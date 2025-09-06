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
import { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// ---- Demo Charts (replace with your real charts) ---- //
const DemoLine = () => (
  <div style={{ background: "#ffe5e5", height: "100%" }}>📈 Line</div>
);
const DemoLine1 = () => (
  <div style={{ background: "#e5ffe5", height: "100%" }}>📉 Line1</div>
);
const DemoLine3 = () => (
  <div style={{ background: "#e5e5ff", height: "100%" }}>📊 Line3</div>
);
const DemoLine4 = () => (
  <div style={{ background: "#fff5e5", height: "100%" }}>📊 Line4</div>
);

const charts = [
  { id: "1", component: <DemoLine />, w: 1, h: 2 },
  { id: "2", component: <DemoLine1 />, w: 1, h: 2 },
  { id: "3", component: <DemoLine3 />, w: 1, h: 2 },
  { id: "4", component: <DemoLine4 />, w: 1, h: 2 },
];

export default function App() {
  const [layout, setLayout] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = (layout, layoutItem, _event) => {
    const chart = charts.find((c) => c.id === layoutItem.i);
    if (chart) {
      layoutItem.w = chart.w;
      layoutItem.h = chart.h;
    }
    setLayout(layout);
    setIsDragging(false);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Floating Widgets Panel */}
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
            unselectable="on"
            data-grid={{ i: chart.id, w: chart.w, h: chart.h }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            style={{
              border: "1px solid #aaa",
              borderRadius: 6,
              padding: 5,
              marginBottom: 10,
              background: "#fafafa",
              cursor: "grab",
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {chart.component}
          </div>
        ))}
      </div>

      {/* Droppable Grid */}
      <div style={{ marginLeft: 200, padding: 20, width: "80%" }}>
        <GridLayout
          className="layout"
          layout={layout}
          cols={3} // ✅ only 3 per row
          rowHeight={150}
          width={900} // 3 cols * 300px each
          isDroppable={true}
          onDrop={onDrop}
          style={{
            background: isDragging ? "#f0f8ff" : "#fafafa", // ✅ highlight drop area
            border: "2px dashed #ddd",
            minHeight: "80vh",
            transition: "background 0.3s ease",
          }}
        >
          {layout.map((item) => {
            const chart = charts.find((c) => c.id === item.i);
            return (
              <div
                key={item.i}
                style={{
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  padding: 10,
                }}
              >
                {chart?.component}
              </div>
            );
          })}
        </GridLayout>
      </div>
    </div>
  );
}
