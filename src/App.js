import React, { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import { Column, Line, Pie } from "@ant-design/plots";

const ChartRenderer = ({ type, color }) => {
  const data = [
    { year: "1991", value: 3 },
    { year: "1992", value: 4 },
    { year: "1993", value: 3.5 },
    { year: "1994", value: 5 },
    { year: "1995", value: 4.9 },
    { year: "1996", value: 6 },
    { year: "1997", value: 7 },
    { year: "1998", value: 9 },
    { year: "1999", value: 13 },
  ];

  if (type === "line") {
    return (
      <Line
        data={data}
        xField="year"
        yField="value"
        style={{ lineWidth: 3, stroke: color }}
        point={{ sizeField: 5 }}
      />
    );
  }

  if (type === "bar") {
    return (
      <Column
        data={data}
        xField="year"
        yField="value"
        color={color}
        columnStyle={{ radius: [4, 4, 0, 0] }}
      />
    );
  }

  if (type === "pie") {
    return (
      <Pie
        data={data}
        angleField="value"
        colorField="year"
        radius={0.9}
        legend={{ position: "bottom" }}
      />
    );
  }

  return null;
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

  const availableWidgets = [
    { id: "w1", color: "red", type: "line", label: "Line Chart", w: 1, h: 1 },
    { id: "w2", color: "blue", type: "bar", label: "Bar Chart", w: 2, h: 1 },
    { id: "w3", color: "green", type: "pie", label: "Pie Chart", w: 1, h: 1 },
  ];

  // Load dashboards from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dashboards");
    if (saved) {
      setDashboards(JSON.parse(saved));
    }
  }, []);

  const handleLayoutChange = (newLayout) => setLayout(newLayout);

  const handleDrop = (layout, layoutItem, e) => {
    setDragOver(false);
    const widgetId = e.dataTransfer.getData("widgetId");
    const widget = availableWidgets.find((w) => w.id === widgetId);
    if (widget) {
      setWidgets((prev) => [
        ...prev,
        {
          ...widget,
          i: widgetId + Date.now(),
          x: dropPosition.x,
          y: dropPosition.y,
          w: widget.type === "bar" ? 2 : 1, // bar = 2 columns
          h: 1,
        },
      ]);
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
    const updated = {
      ...dashboards,
      [newName]: { widgets, layout },
    };
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
        }}
      >
        <button
          onClick={() => setShowDrawer(!showDrawer)}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 60,
            height: 60,
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
            width: 250,
            background: "#f9fafb",
            borderLeft: "1px solid #ddd",
            padding: 20,
            boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header with Close Button */}
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
                  marginBottom: 10,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  cursor: "grab",
                  textAlign: "center",
                }}
              >
                Chart ({w.label})
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
              <ChartRenderer type={w.type} color={w.color} />

              {/* Modal Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveWidget(w);
                }}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 44,
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  zIndex: 2,
                }}
              >
                🔍
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setWidgets((prev) => prev.filter((item) => item.i !== w.i));
                }}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  zIndex: 2,
                }}
                title="Delete"
              >
                🗑️
              </button>
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

            <div style={{ flex: 1 }}>
              <ChartRenderer
                type={activeWidget.type}
                color={activeWidget.color}
              />
            </div>
          </div>
        </div>
      )}

      {/* Inline CSS for dropping */}
      <style>
        {`
          .grid-dropping {
            background-color: rgba(37, 99, 235, 0.1);
            border: 2px dashed #2563eb;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
