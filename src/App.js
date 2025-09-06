import { useState, useEffect, useRef } from "react";
import { Line } from "@ant-design/plots";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// ---- Real Charts ---- //
const DemoLine = () => {
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
  return (
    <Line
      data={data}
      xField="year"
      yField="value"
      point={{
        shapeField: "circle",
        sizeField: 4,
        style: { fill: "blue", stroke: "#fff" },
      }}
      style={{ lineWidth: 2, stroke: "red" }}
      theme={{ background: "#f0f4ff" }}
      interaction={{ tooltip: { marker: false } }}
    />
  );
};

const DemoLine1 = () => {
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
  return (
    <Line
      data={data}
      xField="year"
      yField="value"
      shapeField="smooth"
      scale={{ y: { domainMin: 0 } }}
      style={{ lineWidth: 2, stroke: "green" }}
      interaction={{ tooltip: { marker: false } }}
    />
  );
};

const DemoLine3 = () => {
  return (
    <Line
      data={{
        type: "fetch",
        value:
          "https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json",
      }}
      xField={(d) => new Date(d.year)}
      yField="value"
      sizeField="value"
      shapeField="trail"
      legend={{ size: false }}
      colorField="category"
    />
  );
};

const DemoLine4 = () => {
  const data = [
    { year: "1991", value: 8 },
    { year: "1992", value: 9 },
    { year: "1993", value: 9.1 },
    { year: "1994", value: 9.3 },
    { year: "1995", value: 12 },
    { year: "1996", value: 12.9 },
    { year: "1997", value: 12.9 },
  ];
  return (
    <Line
      data={data}
      xField="year"
      yField="value"
      style={{ lineWidth: 2, stroke: "purple" }}
      area={{
        style: { fill: "linear-gradient(-90deg, #ffe5e5 0%, #ff0000 100%)" },
      }}
      theme={{ background: "#fff7f7" }}
      interaction={{ tooltip: { marker: false } }}
    />
  );
};

// Chart Library
const charts = [
  { id: "1", label: "Chart 1", component: <DemoLine /> },
  { id: "2", label: "Chart 2", component: <DemoLine1 /> },
  { id: "3", label: "Chart 3", component: <DemoLine3 /> },
  { id: "4", label: "Chart 4", component: <DemoLine4 /> },
];

export default function App() {
  const [layout, setLayout] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const gridRef = useRef(null);
  const trashRef = useRef(null);

  // Track container width
  useEffect(() => {
    const updateSize = () => {
      if (gridRef.current) {
        setContainerWidth(gridRef.current.offsetWidth);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Handle drop
  const onDrop = (newLayout, layoutItem, e) => {
    const chartId = e.dataTransfer.getData("text/plain");
    if (!chartId) return;

    const nextX = layout.length % 6; // up to 6 cols
    const nextY = Math.floor(layout.length / 6); // next row

    const newItem = {
      i: chartId + "-" + Date.now(),
      x: nextX,
      y: nextY,
      w: 2, // smaller size
      h: 2,
    };

    setLayout([...layout, newItem]);
    setIsDragging(false);
  };

  // Delete if dropped in Trash
  const onDragStop = (layoutArr, oldItem, newItem) => {
    const trashEl = trashRef.current?.getBoundingClientRect();
    if (!trashEl) return;

    const chartEl = document.querySelector(`[data-grid-i="${newItem.i}"]`);
    if (!chartEl) return;

    const chartBox = chartEl.getBoundingClientRect();
    const overlap =
      chartBox.right > trashEl.left &&
      chartBox.left < trashEl.right &&
      chartBox.bottom > trashEl.top &&
      chartBox.top < trashEl.bottom;

    if (overlap) {
      setLayout((prev) => prev.filter((i) => i.i !== newItem.i));
    }
  };

  // Manual delete
  const removeChart = (id) => {
    setLayout((prev) => prev.filter((i) => i.i !== id));
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar Widgets */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: 10,
          padding: 10,
          width: 160,
          zIndex: 1000,
        }}
      >
        <h4>📦 Widgets</h4>
        {charts.map((chart) => (
          <div
            key={chart.id}
            draggable
            onDragStart={(e) => {
              setIsDragging(true);
              e.dataTransfer.setData("text/plain", chart.id);
            }}
            onDragEnd={() => setIsDragging(false)}
            style={{
              border: "1px solid #aaa",
              borderRadius: 6,
              padding: 5,
              marginBottom: 10,
              background: "#fafafa",
              cursor: "grab",
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {chart.label}
          </div>
        ))}
      </div>

      {/* Droppable Grid */}
      <div
        ref={gridRef}
        style={{
          marginLeft: 200,
          padding: 20,
          width: "100%",
          minHeight: "90vh",
        }}
      >
        {containerWidth > 0 && (
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={200}
            width={containerWidth}
            isResizable={false}
            isBounded={true}
            compactType="vertical"
            onDrop={onDrop}
            onDragStop={onDragStop}
            isDroppable={true} // ✅ allow dropping
          >
            {layout.map((item) => {
              const chartDef = charts.find((c) => item.i.startsWith(c.id));
              if (!chartDef) return null;

              return (
                <div key={item.i} data-grid={item}>
                  <div className="bg-white shadow-md rounded-xl h-full w-full flex flex-col">
                    <div className="flex justify-between items-center px-3 py-2 border-b">
                      <span className="font-semibold">{chartDef.label}</span>
                      <button
                        onClick={() => removeChart(item.i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex-1 p-2">
                      <div className="w-full h-full">{chartDef.component}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </GridLayout>
        )}
      </div>

      {/* 🗑️ Trash Area */}
      <div
        ref={trashRef}
        style={{
          position: "fixed",
          bottom: 20,
          right: 40,
          width: 100,
          height: 100,
          background: "#ffefef",
          border: "2px dashed red",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "red",
          fontWeight: "bold",
          zIndex: 2000,
        }}
      >
        🗑️ Trash
      </div>
    </div>
  );
}
