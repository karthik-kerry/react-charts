import React, { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import {
  Column,
  Line,
  Pie,
  Area,
  Treemap,
  Heatmap,
  DualAxes,
  Funnel,
  Venn,
} from "@ant-design/plots";
import html2canvas from "html2canvas";
import barPreview from "./assets/barChart.jpg";
import linePreview from "./assets/lineChart.jpg";
import piePreview from "./assets/pieChart.jpg";
import areaPreview from "./assets/areaChart.png";
import treePreview from "./assets/treeChart.png";
import heatMapPreview from "./assets/heatmapChart.png";
import duallinePreview from "./assets/duallineChart.png";
import duallinestyledPreview from "./assets/duallineStyledChart.png";
import groupedBarPreview from "./assets/groupedBarChart.png";
import groupedColumnMultiLinePreview from "./assets/groupedColumnMultiLine.png";
import funnelPreview from "./assets/funnelChart.png";
import vennPreview from "./assets/vennChart.png";
import axios from "axios";

const ChartRenderer = ({ type, color, data }) => {
  const now = new Date();
  let expiring = 0;
  let ongoing = 0;
  let expired = 0;

  if (data && data.length > 0) {
    data.forEach((item) => {
      const endDateStr = item.asset?.expiry_date;
      const startDateStr = item.asset?.commencement_date;
      if (!endDateStr) return;
      const endDate = new Date(endDateStr);
      const startDate = startDateStr ? new Date(startDateStr) : null;

      if (endDate < now) {
        expired += 1;
      } else if (
        (endDate - now) / (1000 * 60 * 60 * 24) <= 30 &&
        endDate > now
      ) {
        expiring += 1;
      } else if (!startDate || (startDate <= now && endDate > now)) {
        ongoing += 1;
      }
    });
  } else {
    expiring = 1;
    ongoing = 2;
    expired = 3;
  }

  const basic = [
    { status: "Expiring Contracts", count: expiring, value: expiring },
    { status: "Ongoing Contracts", count: ongoing, value: ongoing },
    { status: "Expired Contracts", count: expired, value: expired },
  ];

  if (type === "line") {
    return (
      <Line
        data={basic}
        xField="status"
        yField="count"
        style={{ lineWidth: 3, stroke: color }}
        point={{ sizeField: 5 }}
      />
    );
  }

  if (type === "bar" || type === "column") {
    return (
      <Column
        data={basic}
        xField="status"
        yField="count"
        color={color}
        columnStyle={{ radius: [4, 4, 0, 0] }}
      />
    );
  }

  if (type === "pie") {
    const pieData = basic.map((d) => ({ status: d.status, value: d.value }));
    return (
      <Pie
        data={pieData}
        angleField="value"
        colorField="status"
        radius={0.9}
        legend={{ position: "bottom" }}
      />
    );
  }

  if (type === "area") {
    return (
      <Area
        data={basic}
        xField="status"
        yField="count"
        areaStyle={{ fill: color }}
      />
    );
  }

  if (type === "treemap") {
    const treeData = {
      name: "contracts",
      children: basic.map((d) => ({ name: d.status, value: d.count })),
    };
    return <Treemap data={treeData} tile="binary" />;
  }

  if (type === "heatmap") {
    const categories = ["A", "B", "C"];
    const heatData = [];
    categories.forEach((cat, i) => {
      basic.forEach((b, j) => {
        heatData.push({ x: b.status, y: cat, value: (i + 1) * (j + 1) });
      });
    });
    return <Heatmap data={heatData} xField="x" yField="y" colorField="value" />;
  }

  if (type === "dual-line" || type === "dualaxes" || type === "dual-axis") {
    const x = ["Expiring", "Ongoing", "Expired"];
    const left = x.map((k, i) => ({ x: k, y: basic[i].count }));
    const right = x.map((k, i) => ({ x: k, y: basic[i].count * (i + 1) }));

    const config = {
      data: [left, right],
      xField: "x",
      yField: ["y", "y"],
      geometryOptions: [
        { geometry: "line", smooth: true, lineStyle: { stroke: color } },
        { geometry: "line", smooth: true, lineStyle: { stroke: "#ff7a45" } },
      ],
    };
    return <DualAxes {...config} />;
  }

  if (type === "dual-line-with-style") {
    const x = ["Expiring", "Ongoing", "Expired"];
    const left = x.map((k, i) => ({ x: k, y: basic[i].count }));
    const right = x.map((k, i) => ({ x: k, y: basic[i].count * (i + 2) }));
    return (
      <DualAxes
        data={[left, right]}
        xField="x"
        yField={["y", "y"]}
        geometryOptions={[
          {
            geometry: "line",
            smooth: true,
            lineStyle: { stroke: color, lineDash: [4, 4] },
          },
          {
            geometry: "line",
            smooth: true,
            lineStyle: { stroke: "#3333ff", opacity: 0.85 },
          },
        ]}
      />
    );
  }

  if (type === "grouped-bar" || type === "grouped-column") {
    const groupData = [];
    const companies = ["Org1", "Org2"];
    basic.forEach((b) => {
      companies.forEach((c, idx) => {
        groupData.push({
          category: b.status,
          company: c,
          value: b.count + idx,
        });
      });
    });
    return (
      <Column
        data={groupData}
        xField="category"
        yField="value"
        seriesField="company"
        isGroup
      />
    );
  }

  if (type === "grouped-column-with-multiline") {
    const categories = ["Expiring", "Ongoing", "Expired"];
    const columnData = [];
    const lineData = [];
    categories.forEach((cat, i) => {
      columnData.push({ x: cat, y: basic[i].count * 10, series: "A" });
      columnData.push({ x: cat, y: basic[i].count * 5, series: "B" });

      lineData.push({ x: cat, y: basic[i].count });
    });

    return (
      <DualAxes
        data={[columnData, lineData]}
        xField="x"
        yField={["y", "y"]}
        geometryOptions={[
          { geometry: "column", isGroup: true, seriesField: "series" },
          { geometry: "line", smooth: true, lineStyle: { stroke: color } },
        ]}
      />
    );
  }

  if (type === "funnel") {
    const funnelData = basic.map((d) => ({ type: d.status, value: d.count }));
    return <Funnel data={funnelData} xField="type" yField="value" />;
  }

  if (type === "venn") {
    const vennData = [
      { sets: ["A"], size: ongoing + 1 },
      { sets: ["B"], size: expiring + 1 },
      { sets: ["A", "B"], size: Math.min(ongoing, expiring) },
    ];
    return <Venn data={vennData} />;
  }

  return (
    <div style={{ padding: 20 }}>No preview available for this chart type.</div>
  );
};

const Dashboard = () => {
  const [layout, setLayout] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeWidget, setActiveWidget] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [dropPosition, setDropPosition] = useState({ x: 0, y: 0 });
  // NEW STATE for multiple dashboards
  const [dashboards, setDashboards] = useState({});
  const [selectedDashboard, setSelectedDashboard] = useState("");
  const [newName, setNewName] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint =
          "http://182.72.177.132:7733/asset/asset_list/12/78/68/";
        const headers = {
          Authorization: "Token a6ad3147ff248970157308b729daac63368c8a88",
        };
        const res = await axios.get(endpoint, { headers });
        setData(res.data.response_data);
      } catch (error) {
        console.log("Error fetching contracts:", error);
      }
    };
    fetchData();
  }, []);

  const availableWidgets = [
    {
      id: "w1",
      color: "red",
      type: "line",
      label: "Line Chart",
      preview: linePreview,
      w: 1,
      h: 1,
    },
    {
      id: "w2",
      color: "blue",
      type: "bar",
      label: "Bar / Column",
      preview: barPreview,
      w: 2,
      h: 1,
    },
    {
      id: "w3",
      color: "green",
      type: "pie",
      label: "Pie Chart",
      preview: piePreview,
      w: 1,
      h: 1,
    },
    {
      id: "w4",
      color: "#16a34a",
      type: "area",
      label: "Area Chart",
      preview: areaPreview,
      w: 2,
      h: 1,
    },
    {
      id: "w5",
      color: "#7c3aed",
      type: "treemap",
      label: "Treemap",
      preview: treePreview,
      w: 2,
      h: 1,
    },
    {
      id: "w6",
      color: "#0ea5e9",
      type: "heatmap",
      label: "Heatmap",
      preview: heatMapPreview,
      w: 2,
      h: 1,
    },
    {
      id: "w7",
      color: "#ef4444",
      type: "dualaxes",
      label: "Dual Line (Dual Axes)",
      preview: duallinePreview,
      w: 2,
      h: 1,
    },
    {
      id: "w8",
      color: "#ff7a45",
      type: "dual-line-with-style",
      label: "Dual Line (Styled)",
      preview: duallinestyledPreview,
      w: 2,
      h: 1,
    },
    {
      id: "w9",
      color: "#0ea5e9",
      type: "grouped-column",
      label: "Grouped Column / Bar",
      preview: groupedBarPreview,
      w: 2,
      h: 1,
    },
    {
      id: "w10",
      color: "#f59e0b",
      type: "grouped-column-with-multiline",
      label: "Grouped Column + Multi Line",
      preview: groupedColumnMultiLinePreview,
      w: 3,
      h: 1,
    },
    {
      id: "w11",
      color: "#06b6d4",
      type: "funnel",
      label: "Funnel",
      preview: funnelPreview,
      w: 2,
      h: 1,
    },
    {
      id: "w12",
      color: "#ef4444",
      type: "venn",
      label: "Venn",
      preview: vennPreview,
      w: 2,
      h: 1,
    },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("dashboards");
    if (saved) setDashboards(JSON.parse(saved));
  }, []);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    setWidgets((prevWidgets) =>
      prevWidgets.map((w) => {
        const updated = newLayout.find((l) => l.i === w.i);
        return updated ? { ...w, ...updated } : w;
      })
    );
  };

  const handleDrop = (layout, layoutItem, e) => {
    setDragOver(false);
    const widgetId = e.dataTransfer.getData("widgetId");
    const widget = availableWidgets.find((w) => w.id === widgetId);
    if (widget) {
      const newWidget = {
        ...widget,
        i: widgetId + Date.now(),
        x: dropPosition.x,
        y: dropPosition.y,
        w: widget.w || 1,
        h: widget.h || 1,
      };
      setWidgets((prev) => [...prev, newWidget]);
      setLayout((prev) => [...prev, newWidget]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * 6);
    const y = Math.floor((e.clientY - rect.top) / 250);
    setDropPosition({ x, y });
    setDragOver(true);
  };

  // --- NEW: Save dashboard under a given name
  const handleSave = () => {
    if (!newName.trim()) {
      alert("Please enter a dashboard name");
      return;
    }
    const updated = { ...dashboards, [newName]: { widgets, layout } };
    setDashboards(updated);
    localStorage.setItem("dashboards", JSON.stringify(updated));
    setSelectedDashboard(newName);
    alert(`Dashboard "${newName}" saved ✅`);
  };

  // --- NEW: Load dashboard
  const handleSelectDashboard = (name) => {
    setSelectedDashboard(name);
    const d = dashboards[name];
    if (d) {
      setWidgets(d.widgets);
      setLayout(d.layout);
    }
  };

  // --- NEW: Delete dashboard
  const handleDeleteDashboard = () => {
    if (!selectedDashboard) return;
    const updated = { ...dashboards };
    delete updated[selectedDashboard];
    setDashboards(updated);
    localStorage.setItem("dashboards", JSON.stringify(updated));
    setSelectedDashboard("");
    setWidgets([]);
    setLayout([]);
    alert("Dashboard deleted ❌");
  };

  return (
    <div style={{ padding: 20, position: "relative" }}>
      {/* Controls: Save + Dropdown */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="Dashboard name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ padding: 6 }}
        />
        <button
          onClick={handleSave}
          style={{
            background: "#10b981",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Save
        </button>

        <select
          value={selectedDashboard}
          onChange={(e) => handleSelectDashboard(e.target.value)}
          style={{ padding: 6 }}
        >
          <option value="">-- Select Dashboard --</option>
          {Object.keys(dashboards).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <button
          onClick={handleDeleteDashboard}
          disabled={!selectedDashboard}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: 6,
            cursor: selectedDashboard ? "pointer" : "not-allowed",
          }}
        >
          Delete
        </button>
      </div>

      {/* Floating Buttons (Drawer + Save Quick) */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          display: "flex",
          gap: 10,
          zIndex: 2,
        }}
      >
        <button
          onClick={() => setShowDrawer(!showDrawer)}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 50,
            height: 50,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          📊
        </button>
      </div>

      {/* Widget Drawer */}
      {showDrawer && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            bottom: 0,
            width: 300,
            background: "#f9fafb",
            borderLeft: "1px solid #ddd",
            padding: 20,
            boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>Widgets</h3>
            <button
              onClick={() => setShowDrawer(false)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: 18,
                cursor: "pointer",
                color: "#ef4444",
              }}
              title="Close Drawer"
            >
              ✖
            </button>
          </div>

          <div style={{ marginTop: 20, flex: 1, overflowY: "auto" }}>
            {availableWidgets.map((w) => (
              <div
                key={w.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("widgetId", w.id)}
                style={{
                  padding: 10,
                  marginBottom: 15,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  cursor: "grab",
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}
                >
                  {w.label}
                </div>
                {w.preview && (
                  <img
                    src={w.preview}
                    alt={`${w.label} preview`}
                    style={{ width: "100%", height: 100, objectFit: "contain" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => handleDrop(layout, null, e)}
        style={{
          position: "relative",
          minHeight: 500,
          width: 1170,
          border: "2px dashed #ddd",
          borderRadius: 12,
          background: dragOver ? "rgba(37, 99, 235, 0.1)" : "#f0f2f5",
          padding: 10,
          paddingBottom: 30,
          transition: "background 0.2s",
        }}
      >
        {/* Dashboard Grid */}
        <GridLayout
          layout={layout}
          cols={3}
          rowHeight={250}
          width={1150}
          margin={[50, 50]}
          containerPadding={[20, 20]}
          onLayoutChange={handleLayoutChange}
          onDrop={handleDrop}
          isDroppable={true}
          droppingClassName="grid-dropping"
          droppingItem={{
            i: "placeholder",
            w: 1,
            h: 1,
            x: dropPosition.x,
            y: dropPosition.y,
          }}
        >
          {widgets.map((w) => (
            <div
              key={w.i}
              style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 10,
                padding: 10,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                position: "relative",
              }}
            >
              <ChartRenderer data={data} type={w.type} color={w.color} />

              {/* Ellipsis menu trigger */}
              <div
                className="no-drag"
                style={{ position: "absolute", top: 8, right: 8 }}
              >
                <button
                  className="no-drag"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setWidgets((prev) =>
                      prev.map((item) =>
                        item.i === w.i
                          ? { ...item, showMenu: !item.showMenu }
                          : item
                      )
                    );
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                >
                  ⋮
                </button>

                {w.showMenu && (
                  <div
                    className="no-drag"
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      padding: "4px 0",
                      zIndex: 10,
                    }}
                  >
                    <div
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveWidget(w);
                        setWidgets((prev) =>
                          prev.map((item) =>
                            item.i === w.i ? { ...item, showMenu: false } : item
                          )
                        );
                      }}
                      style={{
                        padding: "6px 12px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      🔍 Preview
                    </div>
                    <div
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setWidgets((prev) =>
                          prev.filter((item) => item.i !== w.i)
                        );
                      }}
                      style={{
                        padding: "6px 12px",
                        cursor: "pointer",
                        color: "red",
                        whiteSpace: "nowrap",
                      }}
                    >
                      🗑️ Delete
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </GridLayout>
      </div>

      {/* Modal */}
      {activeWidget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            id="preview-container"
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              width: "80%",
              height: "80%",
              position: "relative",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setActiveWidget(null)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "#ef4444",
                border: "none",
                borderRadius: 6,
                color: "#fff",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Close
            </button>

            <button
              onClick={async () => {
                const element = document.getElementById("preview-container");
                const buttons = element.querySelectorAll("button");
                buttons.forEach((btn) => (btn.style.display = "none"));
                const canvas = await html2canvas(element);
                const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
                buttons.forEach((btn) => (btn.style.display = ""));
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = `${activeWidget.label || "chart"}.jpg`;
                link.click();
              }}
              style={{
                position: "absolute",
                top: 10,
                right: 70,
                background: "#10b981",
                border: "none",
                borderRadius: 6,
                color: "#fff",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              📥 Download JPG
            </button>

            <div style={{ flex: 1 }}>
              <ChartRenderer
                type={activeWidget.type}
                color={activeWidget.color}
                data={data}
              />
            </div>
          </div>
        </div>
      )}

      {/* Inline CSS for dropping */}
      <style>{`.grid-dropping { background-color: rgba(37, 99, 235, 0.1); border: 2px dashed #2563eb; }`}</style>
    </div>
  );
};

export default Dashboard;
