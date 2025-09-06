// import { Line } from "@ant-design/plots";
// import { useRef, useState } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import GridLayout from "react-grid-layout";
// import "react-grid-layout/css/styles.css";
// import "react-resizable/css/styles.css";

// // ---- Demo Charts ---- //
// const DemoLine = () => {
//   const data = [
//     { year: "1991", value: 3 },
//     { year: "1992", value: 4 },
//     { year: "1993", value: 3.5 },
//     { year: "1994", value: 5 },
//     { year: "1995", value: 4.9 },
//     { year: "1996", value: 6 },
//     { year: "1997", value: 7 },
//     { year: "1998", value: 9 },
//     { year: "1999", value: 13 },
//   ];
//   const config = {
//     data,
//     xField: "year",
//     yField: "value",
//     point: {
//       shapeField: "circle",
//       sizeField: 5,
//       style: { fill: "blue", stroke: "#fff" },
//     },
//     style: { lineWidth: 3, stroke: "red" },
//     theme: { background: "#f0f4ff" },
//     interaction: { tooltip: { marker: false } },
//   };
//   return <Line {...config} />;
// };

// const DemoLine1 = () => {
//   const data = [
//     { year: "1991", value: 3 },
//     { year: "1992", value: 4 },
//     { year: "1993", value: 3.5 },
//     { year: "1994", value: 5 },
//     { year: "1995", value: 4.9 },
//     { year: "1996", value: 6 },
//     { year: "1997", value: 7 },
//     { year: "1998", value: 9 },
//     { year: "1999", value: 13 },
//   ];
//   const config = {
//     data,
//     xField: "year",
//     yField: "value",
//     shapeField: "smooth",
//     scale: { y: { domainMin: 0 } },
//     interaction: { tooltip: { marker: false } },
//     style: { lineWidth: 2, stroke: "red" },
//   };
//   return <Line {...config} />;
// };

// const DemoLine3 = () => {
//   const config = {
//     data: {
//       type: "fetch",
//       value:
//         "https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json",
//     },
//     xField: (d) => new Date(d.year),
//     yField: "value",
//     sizeField: "value",
//     shapeField: "trail",
//     legend: { size: false },
//     colorField: "category",
//   };
//   return <Line {...config} />;
// };

// const DemoLine4 = () => {
//   const data = [
//     { year: "1991", value: 8 },
//     { year: "1992", value: 9 },
//     { year: "1993", value: 9.1 },
//     { year: "1994", value: 9.3 },
//     { year: "1995", value: 12 },
//     { year: "1996", value: 12.9 },
//     { year: "1997", value: 12.9 },
//   ];
//   const config = {
//     data,
//     xField: "year",
//     yField: "value",
//     style: { lineWidth: 3, stroke: "red" },
//     area: {
//       style: { fill: "linear-gradient(-90deg, #ffe5e5 0%, #ff0000 100%)" },
//     },
//     theme: { background: "#fff7f7" },
//     interaction: { tooltip: { marker: false } },
//   };
//   return <Line {...config} />;
// };

// const charts = [
//   { id: 1, component: <DemoLine /> },
//   { id: 2, component: <DemoLine1 /> },
//   { id: 3, component: <DemoLine3 /> },
//   { id: 4, component: <DemoLine4 /> },
// ];

// // ---- App Component ---- //
// const App = () => {
//   const chartRef = useRef();
//   const [maxChart, setMaxChart] = useState(null);
//   const [layout, setLayout] = useState(() => {
//     const saved = localStorage.getItem("chartLayout");
//     return saved
//       ? JSON.parse(saved)
//       : charts.map((c, i) => ({
//           i: String(c.id),
//           x: i % 2 === 0 ? 0 : 1,
//           y: Math.floor(i / 2),
//           w: 1,
//           h: 1,
//         }));
//   });

//   // Save layout changes
//   const handleLayoutChange = (newLayout) => {
//     setLayout(newLayout);
//     localStorage.setItem("chartLayout", JSON.stringify(newLayout));
//   };

//   const downloadImage = async () => {
//     if (!chartRef.current) return;
//     const canvas = await html2canvas(chartRef.current);
//     const link = document.createElement("a");
//     link.download = "chart.png";
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//   };

//   const downloadPDF = async () => {
//     if (!chartRef.current) return;
//     const canvas = await html2canvas(chartRef.current);
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("landscape", "mm", "a4");
//     const width = pdf.internal.pageSize.getWidth();
//     const height = pdf.internal.pageSize.getHeight();
//     pdf.addImage(imgData, "PNG", 0, 0, width, height);
//     pdf.save("chart.pdf");
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <GridLayout
//         className="layout"
//         layout={layout}
//         cols={2}
//         rowHeight={320}
//         width={700}
//         onLayoutChange={handleLayoutChange}
//       >
//         {charts.map((chart) => (
//           <div
//             key={chart.id}
//             style={{
//               border: "1px solid #1b1b1b",
//               padding: 10,
//               borderRadius: 5,
//               background: "#fff",
//               position: "relative",
//             }}
//           >
//             {chart.component}
//             {/* Expand icon in bottom-right corner */}
//             <button
//               onClick={() => setMaxChart(chart.id)}
//               style={{
//                 position: "absolute",
//                 bottom: 10,
//                 right: 10,
//                 border: "none",
//                 background: "#2563eb",
//                 color: "#fff",
//                 borderRadius: "50%",
//                 width: 30,
//                 height: 30,
//                 cursor: "pointer",
//               }}
//             >
//               ⛶
//             </button>
//           </div>
//         ))}
//       </GridLayout>

//       {/* Fullscreen overlay */}
//       {maxChart && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "rgba(0,0,0,0.7)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             ref={chartRef}
//             style={{
//               background: "#fff",
//               padding: 20,
//               borderRadius: 10,
//               width: "80%",
//               height: "80%",
//               position: "relative",
//             }}
//           >
//             {charts.find((c) => c.id === maxChart)?.component}
//             <div
//               style={{
//                 position: "absolute",
//                 top: 10,
//                 right: 10,
//                 display: "flex",
//                 gap: "10px",
//               }}
//             >
//               <button onClick={downloadImage}>📸 JPG</button>
//               <button onClick={downloadPDF}>📄 PDF</button>
//               <button onClick={() => setMaxChart(null)}>❌ Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
import { Line } from "@ant-design/plots";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// ---- Demo Charts ---- //
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
  return <Line data={data} xField="year" yField="value" />;
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
  return <Line data={data} xField="year" yField="value" smooth />;
};

const charts = [
  { id: "1", title: "Line Chart", component: <DemoLine /> },
  { id: "2", title: "Smooth Line", component: <DemoLine1 /> },
];

// ---- App Component ---- //
const App = () => {
  const chartRef = useRef();
  const [layout, setLayout] = useState([]);
  const [items, setItems] = useState([]);
  const [showWidgets, setShowWidgets] = useState(false);

  // Handle drop from widget
  const onDrop = (layout, layoutItem, _event) => {
    const chartId = _event.dataTransfer.getData("chartId");
    const chart = charts.find((c) => c.id === chartId);
    if (chart) {
      setItems((prev) => [...prev, { i: `${chart.id}-${Date.now()}`, chart }]);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Floating Widgets Icon */}
      <button
        onClick={() => setShowWidgets(!showWidgets)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          borderRadius: "50%",
          width: 60,
          height: 60,
          border: "none",
          background: "#2563eb",
          color: "#fff",
          fontSize: 16,
          cursor: "pointer",
          zIndex: 2000,
        }}
      >
        📊
        <div style={{ fontSize: 10 }}>Widgets</div>
      </button>

      {/* Widget Drawer */}
      {showWidgets && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 10,
            width: 300,
            maxHeight: 400,
            overflowY: "auto",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            zIndex: 2000,
          }}
        >
          <h4 style={{ marginBottom: 10 }}>Available Charts</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 10,
            }}
          >
            {charts.map((chart) => (
              <div
                key={chart.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("chartId", chart.id)}
                style={{
                  border: "1px solid #ccc",
                  padding: 5,
                  borderRadius: 6,
                  background: "#fafafa",
                  cursor: "grab",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  {chart.title}
                </div>
                <div style={{ height: 100 }}>{chart.component}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Droppable Area */}
      <h2 style={{ marginBottom: 10 }}>Drop your charts here</h2>
      <GridLayout
        className="layout"
        layout={layout}
        cols={2}
        rowHeight={320}
        width={700}
        isDroppable={true}
        onDrop={onDrop}
        onLayoutChange={(newLayout) => setLayout(newLayout)}
        compactType={null}
      >
        {items.map((item) => (
          <div
            key={item.i}
            style={{
              border: "1px solid #1b1b1b",
              borderRadius: 5,
              padding: 10,
              background: "#fff",
            }}
          >
            {item.chart.component}
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default App;
