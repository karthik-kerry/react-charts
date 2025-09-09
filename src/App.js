import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import { Line } from "@ant-design/plots";

// ---- Demo Chart ---- //
const DemoChart = ({ color }) => {
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
  const config = {
    data,
    xField: "year",
    yField: "value",
    style: { lineWidth: 3, stroke: color },
    point: { sizeField: 5 },
  };
  return <Line {...config} />;
};

// ---- Dashboard ---- //
const Dashboard = () => {
  const [layout, setLayout] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeWidget, setActiveWidget] = useState(null); // for modal
  const [dragOver, setDragOver] = useState(false);
  const [dropPosition, setDropPosition] = useState({ x: 0, y: 0 });

  const availableWidgets = [
    { id: "w1", color: "red" },
    { id: "w2", color: "blue" },
    { id: "w3", color: "green" },
    { id: "w4", color: "purple" },
  ];

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
        },
      ]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * 6); // 6 cols
    const y = Math.floor((e.clientY - rect.top) / 250); // rowHeight = 250
    setDropPosition({ x, y });
    setDragOver(true);
  };

  return (
    <div style={{ padding: 20, position: "relative" }}>
      {/* Floating Button */}
      <button
        onClick={() => setShowDrawer(!showDrawer)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
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
          }}
        >
          <h3 style={{ marginBottom: 10 }}>Widgets</h3>
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
              Chart ({w.color})
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => handleDrop(layout, null, e)}
        style={{
          position: "relative",
          minHeight: 500,
          border: "2px dashed #ddd",
          borderRadius: 12,
          background: dragOver ? "rgba(37, 99, 235, 0.1)" : "#f0f2f5",
          padding: 10,
          transition: "background 0.2s",
        }}
      >
        {/* Dashboard Grid */}
        <GridLayout
          layout={layout}
          cols={3}
          rowHeight={250}
          width={950}
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
              <DemoChart color={w.color} />

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
              <DemoChart color={activeWidget.color} />
            </div>
          </div>
        </div>
      )}

      {/* Inline CSS for dropping */}
      <style>
        {`
          .grid-dropping {
            background-color: rgba(37, 99, 235, 0.1); /* light blue */
            border: 2px dashed #2563eb;
            transition: background 0.2s;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
