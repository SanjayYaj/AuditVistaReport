import React, { useState } from "react";
import Chart from "react-apexcharts";

const StackedBarChart = (props) => {
    if (props.chartInfo && props.chartInfo.length > 0) {
  let chartInfo = props.chartInfo
 let output = ["Not Started", "Inprogress", "Completed","Submitted","Reviewed"]?.map((statusName) => ({
    name: statusName,
    data: chartInfo?.map(
      (audit) => audit.status.find((s) => s.label === statusName)?.count || 0
    ),
  }))

  const customColors = ["#555657", "#FDA705", "#0DE0E8", "#0DB0F9", "#0D68F9"]; 
  
  const [chartData, setChartData] = useState({
    series: output,
    options: {
      chart: {
        type: "bar",
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          barWidth: "30%",
        },
      },
      xaxis: {
        categories: _.map(chartInfo, "auditname"),
        labels: {
          rotate: -45,
          trim: true,
          style: {
            fontSize: "12px",
            whiteSpace: "nowrap",
          },
          formatter: (value) => (value.length > 10 ? value.substring(0, 10) + "..." : value), // Shorten text
        },
        tooltip: {
          enabled: true, // Show full text on hover
        },
      },
      tooltip: {
        y: {
          formatter: (val) => val, // Keep default y-axis tooltip
        },
        x: {
          show: true,
          formatter: (val) => val, // Show full audit name on hover
        },
      },
      legend: {
        position: "bottom",
      },
      fill: {
        opacity: 1,
      },
      colors: customColors,
    },
  });

  return (
    <div>
      <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
    </div>
  );
}
else{
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "250px", 
            textAlign: "center",
            flexDirection: "column"
        }}>
            <p>No Data Available</p>
        </div>
    ); 
}
};

export default StackedBarChart;
















// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';

// const LineChart = (props) => {
//     const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1330); // Set breakpoint for small screens

//     useEffect(() => {
//         const handleResize = () => {
//             setIsSmallScreen(window.innerWidth < 1330); // Update on screen resize
//         };
        
//         window.addEventListener('resize', handleResize);
        
//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     if (props.chartInfo && props.chartInfo.length > 0) {
//         let chartData = props.chartInfo[0].myAuditStatus;

//         const bgColors = chartData.map((item) => item.color || '');
//         const hoverColors = bgColors.map(color => {
//             const shadeFactor = 0.2;
//             const shadeColor = color.replace(/^#/, '').match(/.{2}/g).map(c => {
//                 const value = Math.max(0, parseInt(c, 16) - shadeFactor * 255);
//                 return Math.floor(value).toString(16).padStart(2, '0');
//             }).join('');
//             return `#${shadeColor}`;
//         });

//         const data = {
//             labels: chartData.map((item) => item.status || ''),
//             datasets: [
//                 {
//                     label: "Audits",
//                     fill: false,
//                     lineTension: 0.1,
//                     backgroundColor: bgColors,
//                     borderColor: "#74788d",
//                     borderCapStyle: 'butt',
//                     borderDash: [],
//                     borderDashOffset: 0.0,
//                     borderJoinStyle: 'miter',
//                     pointBorderColor: bgColors,
//                     pointBackgroundColor: bgColors,
//                     pointHoverBackgroundColor: hoverColors,
//                     pointHoverBorderColor: "#fff",
//                     pointBorderWidth: 1,
//                     pointHoverRadius: 5,
//                     pointHoverBorderWidth: 2,
//                     pointRadius: 5,
//                     pointHitRadius: 10,
//                     data: chartData.map((item) => item.count || 0)
//                 }
//             ]
//         };

//         const options = {
//             defaultFontColor: '#74788d',
//             tooltips: {
//                 enabled: true,
//                 mode: 'index',
//                 intersect: false,
//                 callbacks: {
//                     label: function (tooltipItem) {
//                         return `Count: ${tooltipItem.yLabel}`;
//                     }
//                 }
//             },
//             scales: {
//                 yAxes: [
//                     {
//                         ticks: {
//                             max: Math.max(...chartData.map(item => item.count)) + 10,
//                             min: 0,
//                             stepSize: 10,
//                         },
//                         gridLines: {
//                             color: 'rgba(166, 176, 207, 0.1)',
//                         },
//                     },
//                 ],
//                 xAxes: [
//                     {
//                         ticks: {
//                             autoSkip: true,
//                             maxRotation: isSmallScreen ? 30 : 0,  // Apply rotation only on small screens
//                             minRotation: isSmallScreen ? 30 : 0, // Apply rotation only on small screens
//                         },
//                         gridLines: {
//                             display: false,
//                         },
//                     },
//                 ],
//             },
//             legend: {
//                 display: false,
//             }
//         };

//         return (
//             <React.Fragment>
//                 {/* Keep the chart height constant at 150 */}
//                 <Line width={600} height={150} data={data} options={options} />
//             </React.Fragment>
//         );
//     } else {
//         return null;
//     }
// };

// export default LineChart;


// import React from 'react';
// import { Line } from 'react-chartjs-2';

// const LineChart = (props) => {
//     if (props.chartInfo && props.chartInfo.length > 0) {
//         let chartData = props.chartInfo[0].myAuditStatus;
       
//         const bgColors = chartData.map((item) => item.color || '');
//         const hoverColors = bgColors.map(color => {
//             const shadeFactor = 0.2;
//             const shadeColor = color.replace(/^#/, '').match(/.{2}/g).map(c => {
//                 const value = Math.max(0, parseInt(c, 16) - shadeFactor * 255);
//                 return Math.floor(value).toString(16).padStart(2, '0');
//             }).join('');
//             return `#${shadeColor}`;
//         });

//         const data = {
//             labels: chartData.map((item) => item.status || ''),
//             datasets: [
//                 {
//                     label: "Audits",
//                     fill: false,
//                     lineTension: 0.1,
//                     backgroundColor: bgColors,
//                     borderColor: "#74788d",
//                     borderCapStyle: 'butt',
//                     borderDash: [],
//                     borderDashOffset: 0.0,
//                     borderJoinStyle: 'miter',
//                     pointBorderColor: bgColors,
//                     pointBackgroundColor: bgColors,
//                     pointHoverBackgroundColor: hoverColors,
//                     pointHoverBorderColor: "#fff",
//                     pointBorderWidth: 1,
//                     pointHoverRadius: 5,
//                     pointHoverBorderWidth: 2,
//                     pointRadius: 5,
//                     pointHitRadius: 10,
//                     data: chartData.map((item) => item.count || 0)
//                 }
//             ]
//         };

//         const options = {
//             defaultFontColor: '#74788d',
//             tooltips: {
//                 enabled: true,
//                 mode: 'index',
//                 intersect: false,
//                 callbacks: {
//                     label: function (tooltipItem) {
//                         return `Count: ${tooltipItem.yLabel}`;
//                     }
//                 }
//             },
//             scales: {
//                 yAxes: [
//                     {
//                         ticks: {
//                             max: Math.max(...chartData.map(item => item.count)) + 10,
//                             min: 0,
//                             stepSize: 10,
//                         },
//                         gridLines: {
//                             color: 'rgba(166, 176, 207, 0.1)',
//                         },
//                     },
//                 ],
//                 xAxes: [
//                     {
//                         ticks: {
//                             autoSkip: true,
//                             maxRotation: 30,  // Set maximum rotation for labels
//                             minRotation: 30,  // Ensure a fixed rotation
//                         },
//                         gridLines: {
//                             display: false,
//                         },
//                     },
//                 ],
//             },
//             legend: {
//                 display: false,
//             }
//         };

//         return (
//             <React.Fragment>
//                 <Line width={600} height={150} data={data} options={options} />
//             </React.Fragment>
//         );
//     } else {
//         return null;
//     }
// };

// export default LineChart;



// import React from "react";
// import ReactApexChart from "react-apexcharts";

// const LineChart = (props) => {


//     if (props.chartInfo && props.chartInfo.length > 0) {

//   const chartData = props.chartInfo[0]?.myAuditStatus || [];

//   // Ensure each item has a defined color, or fallback to a default one
//   const bgColors = chartData.map((item) => item.color || "#000"); // Fallback to black if no color is provided

//   const series = [
//     { 
//       name: "Audit", 
//       data: chartData.map((item) => item.count) 
//     },
//   ];


//   console.log(bgColors); // Check that bgColors is as expected


// //   const options = {
// //     chart: {
// //       height: 380,
// //       type: "line",
// //       zoom: { enabled: false },
// //       toolbar: { show: false },
// //     },
// //     colors: bgColors, // Dynamically set colors for the line series
// //     dataLabels: { enabled: false },
// //     stroke: {
// //       width: 3, 
// //       curve: "straight",
// //       colors: bgColors, // Apply dynamic colors to the stroke (line)
// //     },
// //     title: {
// //       text: "Audit",
// //       align: "left",
// //       style: { fontWeight: "500" },
// //     },
// //     grid: {
// //       row: { colors: ["transparent", "transparent"], opacity: 0.2 },
// //       borderColor: "#f1f1f1",
// //     },
// //     markers: {
// //       size: 6,
// //       colors: bgColors, // Ensure markers match the line colors
// //       strokeColors: "#fff",
// //       strokeWidth: 2,
// //     },
// //     xaxis: {
// //       categories: chartData.map((item) => item.status),
// //       title: false,
// //     },
// //     yaxis: { title: false },
// //     legend: {
// //       position: "top",
// //       horizontalAlign: "right",
// //       floating: true,
// //       offsetY: -25,
// //       offsetX: -5,
// //     },
// //     responsive: [
// //       {
// //         breakpoint: 600,
// //         options: {
// //           chart: { toolbar: { show: false } },
// //           legend: { show: false },
// //         },
// //       },
// //     ],
// //   };

// const options = {
//     chart: {
//       height: 380,
//       type: "line",
//       zoom: { enabled: false },
//       toolbar: { show: false },
//     },
//     colors: bgColors, // Dynamically set colors for the line series
//     dataLabels: { enabled: false },
//     stroke: {
//       width: 3,
//       curve: "straight",
//       colors: bgColors, // Apply dynamic colors to the stroke (line)
//     },
//     title: {
//       text: "Audit",
//       align: "left",
//       style: { fontWeight: "500" },
//     },
//     grid: {
//       row: { colors: ["transparent", "transparent"], opacity: 0.2 },
//       borderColor: "#f1f1f1",
//     },
//     markers: {
//       size: 6,
//       colors: bgColors, // Ensure markers match the line colors
//       strokeColors: bgColors, // Apply dynamic stroke color for the marker borders
//       strokeWidth: 2,
//       shape: "circle", // You can change this if needed
//     },
//     xaxis: {
//       categories: chartData.map((item) => item.status),
//       title: false,
//     },
//     yaxis: { title: false },
//     legend: {
//       position: "top",
//       horizontalAlign: "right",
//       floating: true,
//       offsetY: -25,
//       offsetX: -5,
//     },
//     responsive: [
//       {
//         breakpoint: 600,
//         options: {
//           chart: { toolbar: { show: false } },
//           legend: { show: false },
//         },
//       },
//     ],
//   };
  


//   return (
//     <ReactApexChart
//       options={options}
//       series={series}
//       type="line"
//       height="380"
//       className="apex-charts"
//     />
//   );
// }else{
//     return null
// }
// };

// export default LineChart;


// import React from "react";
// import ReactApexChart from "react-apexcharts";

// const LineChart = (props) => {
//     if (props.chartInfo && props.chartInfo.length > 0) {
//   const chartData = props.chartInfo[0]?.myAuditStatus || [];

//   // Ensure each item has a defined color, or fallback to a default one
//   const bgColors = chartData.map((item) => item.color || "#000");

//   const series = [
//     { name: "Audit", data: chartData.map((item) => item.count) },
//   ];

//   const options = {
//     chart: {
//       height: 380,
//       type: "line",
//       zoom: { enabled: false },
//       toolbar: { show: false },
//     },
//     colors: bgColors, // Ensure colors are dynamically passed
//     dataLabels: { enabled: false },
//     stroke: { width: 3, curve: "straight" },
//     title: {
//       text: "Audit",
//       align: "left",
//       style: { fontWeight: "500" },
//     },
//     grid: {
//       row: { colors: ["transparent", "transparent"], opacity: 0.2 },
//       borderColor: "#f1f1f1",
//     },
//     markers: {
//       size: 6,
//       colors: bgColors, // Ensure markers match the line colors
//       strokeColors: "#fff",
//       strokeWidth: 2,
//     },
//     xaxis: {
//       categories: chartData.map((item) => item.status),
//       title: false,
//     },
//     yaxis: { title: false },
//     legend: {
//       position: "top",
//       horizontalAlign: "right",
//       floating: true,
//       offsetY: -25,
//       offsetX: -5,
//     },
//     responsive: [
//       {
//         breakpoint: 600,
//         options: {
//           chart: { toolbar: { show: false } },
//           legend: { show: false },
//         },
//       },
//     ],
//   };

//   return (
//     <ReactApexChart
//       options={options}
//       series={series}
//       type="line"
//       height="380"
//       className="apex-charts"
//     />
//   );
// }
// else{
//     return null
// }
// };

// export default LineChart;


// import React from "react";
// import ReactApexChart from "react-apexcharts";

// const LineChart = (props) => {
//   let chartData = props.chartInfo[0].myAuditStatus;

//   const bgColors = chartData.map((item) => item.color || "");
//   const apaexlineChartColors = bgColors;

//   const series = [
//     { name: "Audit", data: chartData.map((item) => item.count) },
//   ];

//   const options = {
//     chart: {
//       height: 380,
//       type: "line",
//       zoom: { enabled: false },
//       toolbar: { show: false },
//     },
//     colors: apaexlineChartColors,
//     dataLabels: { enabled: false },
//     stroke: { width: 3, curve: "straight" },
//     title: {
//       text: "Audit",
//       align: "left",
//       style: { fontWeight: "500" },
//     },
//     grid: {
//       row: { colors: ["transparent", "transparent"], opacity: 0.2 },
//       borderColor: "#f1f1f1",
//     },
//     markers: { style: "inverted", size: 6 },
//     xaxis: {
//       categories: chartData.map((item) => item.status),
//       title: false
//     },
//     yaxis: { title:false },
//     legend: {
//       position: "top",
//       horizontalAlign: "right",
//       floating: true,
//       offsetY: -25,
//       offsetX: -5,
//     },
//     responsive: [
//       {
//         breakpoint: 600,
//         options: {
//           chart: { toolbar: { show: false } },
//           legend: { show: false },
//         },
//       },
//     ],
//   };

//   return (
//     <ReactApexChart
//       options={options}
//       series={series}
//       type="line"
//       height="380"
//       className="apex-charts"
//     />
//   );
// };

// export default LineChart;




// import React from "react"
// import ReactApexChart from "react-apexcharts"


// const LineChart = (props) => {


//     let chartData = props.chartInfo[0].myAuditStatus;
       
//       const bgColors = chartData.map((item) => item.color || '');
//   const apaexlineChartColors =bgColors

//   const series = [
//     { name: "High - 2018", data: [26, 24, 32, 36, 33, 31, 33] },
//     { name: "Low - 2018", data: [14, 11, 16, 12, 17, 13, 12] },
//   ]
//   const options = {
//     chart: {
//       height: 380,
//       type: 'line',
//       zoom: {
//         enabled: false
//       },
//       toolbar: {
//         show: false
//       }
//     },
//     colors: apaexlineChartColors,
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       width: [3, 3],
//       curve: 'straight'
//     },
//     series: [{
//       name: "High - 2018",
//       data: [26, 24, 32, 36, 33, 31, 33]
//     },
//     {
//       name: "Low - 2018",
//       data: [14, 11, 16, 12, 17, 13, 12]
//     }
//     ],
//     title: {
//       text: 'Average High & Low Temperature',
//       align: 'left',
//       style: {
//         fontWeight: '500',
//       },
//     },
//     grid: {
//       row: {
//         colors: ['transparent', 'transparent'], 
//         opacity: 0.2
//       },
//       borderColor: '#f1f1f1'
//     },
//     markers: {
//       style: 'inverted',
//       size: 6
//     },
//     xaxis: {
//         categories: [
//             'January ',
//             'February ',
//             'March ',
//             'April',
//             'May - Warmer Days',
//             'June - Mid-Year Mark',
//             'July - Summer Vibes'
//         ],
        
//       title: {
//         text: 'Month'
//       }
//     },
//     yaxis: {
//       title: {
//         text: 'Temperature'
//       },
//       min: 5,
//       max: 40
//     },
//     legend: {
//       position: 'top',
//       horizontalAlign: 'right',
//       floating: true,
//       offsetY: -25,
//       offsetX: -5
//     },
//     responsive: [{
//       breakpoint: 600,
//       options: {
//         chart: {
//           toolbar: {
//             show: false
//           }
//         },
//         legend: {
//           show: false
//         },
//       }
//     }]
//   }

//   return (
//     <ReactApexChart
//       options={options}
//       series={series}
//       type="line"
//       height="380"
//       className="apex-charts"
//     />
//   )
// }

// export default LineChart







// import React from 'react';
// import { Line } from 'react-chartjs-2';

// const LineChart = (props) => {
//     if (props.chartInfo && props.chartInfo.length > 0) {
//         let chartData = props.chartInfo[0].myAuditStatus;
       
//         const bgColors = chartData.map((item) => item.color || '');
//         const hoverColors = bgColors.map(color => {
//             const shadeFactor = 0.2;
//             const shadeColor = color.replace(/^#/, '').match(/.{2}/g).map(c => {
//                 const value = Math.max(0, parseInt(c, 16) - shadeFactor * 255);
//                 return Math.floor(value).toString(16).padStart(2, '0');
//             }).join('');
//             return `#${shadeColor}`;
//         });

//         const data = {
//             labels: chartData.map((item) => item.status || ''),
//             datasets: [
//                 {
//                     label: "Audits",
//                     fill: false,
//                     lineTension: 0.1,
//                     backgroundColor: bgColors,
//                     borderColor: "#74788d",
//                     borderCapStyle: 'butt',
//                     borderDash: [],
//                     borderDashOffset: 0.0,
//                     borderJoinStyle: 'miter',
//                     pointBorderColor: bgColors,
//                     pointBackgroundColor: bgColors,
//                     pointHoverBackgroundColor: hoverColors,
//                     pointHoverBorderColor: "#fff",
//                     pointBorderWidth: 1,
//                     pointHoverRadius: 5,
//                     pointHoverBorderWidth: 2,
//                     pointRadius: 5,
//                     pointHitRadius: 10,
//                     data: chartData.map((item) => item.count || 0)
//                 }
//             ]
//         };

//         // const options = {
//         //     defaultFontColor: '#74788d',
//         //     tooltips: {
//         //         enabled: true,
//         //         mode: 'index',
//         //         intersect: false,
//         //         callbacks: {
//         //             label: function (tooltipItem) {
//         //                 return `Count: ${tooltipItem.yLabel}`;
//         //             }
//         //         }
//         //     },
//         //     scales: {
//         //         yAxes: [
//         //             {
//         //                 ticks: {
//         //                     max: Math.max(...chartData.map(item => item.count)) + 10,
//         //                     min: 0,
//         //                     stepSize: 10,
//         //                 },
//         //                 gridLines: {
//         //                     color: 'rgba(166, 176, 207, 0.1)',
//         //                 },
//         //             },
//         //         ],
//         //     },
//         //     legend: {
//         //         display: false,
//         //     }
//         // };



//         var options = {
//             scales: {
//               yAxes: [{
//                 ticks: {
//                   max: Math.max(...chartData.map(item => item.count)) + 10,
//                   min: 20,
//                   stepSize: 10
//                 }
//               }]
//             }
//           }
//         return (
//             <React.Fragment>
//                 <Line width={600} height={150} data={data} options={options} />
//             </React.Fragment>
//         );
//     } else {
//         return null;
//     }
// };

// export default LineChart;











// import React from 'react';
// import { Line } from 'react-chartjs-2';

// const LineChart = (props) => {

//     if (props.chartInfo && props.chartInfo.length > 0) {
//         let charData = props.chartInfo[0].myAuditStatus
//         var bgColors = charData.map((item) => item.color || '')
//         // console.log('bgColors', bgColors)

//         const generateColors = (length) => {
//             const colors = [];
//             for (let i = 0; i < length; i++) {
//                 const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
//                 colors.push(color);
//             }
//             return colors;
//         };

//         const data = {
//             labels: charData.map((item) => item.status || ''),
//             datasets: [
//                 {
//                     label: "Audits",
//                     fill: false,
//                     lineTension: 0.1,
//                     backgroundColor: bgColors,
//                     borderColor: "#74788d",
//                     borderCapStyle: 'butt',
//                     borderDash: [],
//                     borderDashOffset: 0.0,
//                     borderJoinStyle: 'miter',
//                     pointBorderColor: "#3c4ccf",
//                     pointBackgroundColor: "#fff",
//                     pointBorderWidth: 1,
//                     pointHoverRadius: 5,
//                     pointHoverBackgroundColor: "#3c4ccf",
//                     pointHoverBorderColor: "#fff",
//                     pointHoverBorderWidth: 2,
//                     pointRadius: 5,
//                     pointHitRadius: 10,
//                     data: charData.map((item) => item.count || 0)
//                 }
//             ]
//         };
//         const options = {
//             defaultFontColor: '#74788d',
//             tooltips: {
//                 enabled: true,
//                 mode: 'index',
//                 intersect: false,
//                 callbacks: {
//                     label: function (tooltipItem) {
//                         return `Count: ${tooltipItem.yLabel}`;
//                     }
//                 }
//             },
//             scales: {
//                 yAxes: [
//                     {
//                         ticks: {
//                             max: Math.max(...charData.map(item => item.count)) + 10,
//                             min: 0,
//                             stepSize: 10,
//                         },
//                         gridLines: {
//                             color: 'rgba(166, 176, 207, 0.1)',
//                         },
//                     },
//                 ],
//             },
//             legend: {
//                 display: false,
//             }
//         };


//         // const options = {
//         //     defaultFontColor: '#74788d',
//         //     tooltips: {
//         //         enabled: true,  // Ensure tooltips are enabled
//         //         mode: 'index',  // Tooltip will show the value of the point being hovered
//         //         intersect: false,  // The tooltip will show even when not directly over the point
//         //         callbacks: {
//         //             label: function (tooltipItem) {
//         //                 return `Count: ${tooltipItem.yLabel}`; // Customizing the label displayed in the tooltip
//         //             }
//         //         }
//         //     },
//         //     scales: {
//         //         yAxes: [
//         //             {
//         //                 ticks: {
//         //                     max: Math.max(...props.myAuditStatus.map(item => item.count)) + 10, // Dynamically set max value based on the data
//         //                     min: 0, // Ensure the minimum is 0 to avoid clipping
//         //                     stepSize: 10,
//         //                 },
//         //                 gridLines: {
//         //                     color: 'rgba(166, 176, 207, 0.1)',
//         //                 },
//         //             },
//         //         ],
//         //     },
//         //     legend: {
//         //         display: true, // Ensure the legend is displayed
//         //         position: 'top', // Legend position (can be 'top', 'left', 'bottom', 'right')
//         //     }
//         // };

//         return (
//             <React.Fragment>
//                 <Line width={600} height={150} data={data} options={options} />
//             </React.Fragment>
//         );
//     } else {
//         return null;
//     }
// };

// export default LineChart;










// import React from 'react';
// import { Line } from 'react-chartjs-2';

// const LineChart = (props) => {

//     if (props.myAuditStatus && props.myAuditStatus.length > 0) {

//         // Generate a dynamic background color based on the length of data
//         const generateColors = (length) => {
//             const colors = [];
//             for (let i = 0; i < length; i++) {
//                 // Generate a random color
//                 const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
//                 colors.push(color);
//             }
//             return colors;
//         };

//         const data = {
//             labels: props.myAuditStatus.map((item) => item.status || ''),
//             datasets: [
//                 {
//                     label: "Audits",
//                     fill: true,
//                     lineTension: 0.5,
//                     backgroundColor: generateColors(props.myAuditStatus.length), // Dynamically generate the background color
//                     borderColor: "#74788d",
//                     borderCapStyle: 'butt',
//                     borderDash: [],
//                     borderDashOffset: 0.0,
//                     borderJoinStyle: 'miter',
//                     pointBorderColor: "#3c4ccf",
//                     pointBackgroundColor: "#fff",
//                     pointBorderWidth: 1,
//                     pointHoverRadius: 5,
//                     pointHoverBackgroundColor: "#3c4ccf",
//                     pointHoverBorderColor: "#fff",
//                     pointHoverBorderWidth: 2,
//                     pointRadius: 1,
//                     pointHitRadius: 10,
//                     data: props.myAuditStatus.map((item) => item.count || 0)
//                 }
//             ]
//         };
//         console.log('data', data)
//         const options = {
//             defaultFontColor: '#74788d',
//             tooltips: {
//                 enabled: true,  // Ensure tooltips are enabled
//                 mode: 'index',  // Tooltip will show the value of the point being hovered
//                 intersect: false,  // The tooltip will show even when not directly over the point
//                 callbacks: {
//                     // Customize the tooltip content
//                     label: function (tooltipItem) {
//                         return `Count: ${tooltipItem.yLabel}`; // Customizing the label displayed in the tooltip
//                     }
//                 }
//             },
//             scales: {
//                 yAxes: [
//                     {
//                         ticks: {
//                             max: 100,
//                             min: 20,
//                             stepSize: 10,
//                         },
//                         gridLines: {
//                             color: 'rgba(166, 176, 207, 0.1)',
//                         },
//                     },
//                 ],
//             },
//             legend: {
//                 display: true, // Ensure the legend is displayed
//                 position: 'top', // Legend position (can be 'top', 'left', 'bottom', 'right')
//             }
//         };

//         return (
//             <React.Fragment>
//                 <Line width={600} height={150} data={data} options={options} />
//             </React.Fragment>
//         );
//     } else {
//         return null;
//     }
// };

// export default LineChart;















// import React from 'react';
// import { Line } from 'react-chartjs-2';

// const LineChart = (props) => {




//     if (props.myAuditStatus && props.myAuditStatus.length > 0) {

//         const data = {
//             // labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October"],
//             labels:  props.myAuditStatus.map((item) => item.status || ''),
//             datasets: [
//                 {
//                     label: "Sales Analytics",
//                     fill: true,
//                     lineTension: 0.5,
//                     backgroundColor: "rgba(60, 76, 207, 0.2)",
//                     borderColor: "#74788d",
//                     borderCapStyle: 'butt',
//                     borderDash: [],
//                     borderDashOffset: 0.0,
//                     borderJoinStyle: 'miter',
//                     pointBorderColor: "#3c4ccf",
//                     pointBackgroundColor: "#fff",
//                     pointBorderWidth: 1,
//                     pointHoverRadius: 5,
//                     pointHoverBackgroundColor: "#3c4ccf",
//                     pointHoverBorderColor: "#fff",
//                     pointHoverBorderWidth: 2,
//                     pointRadius: 1,
//                     pointHitRadius: 10,
//                     // data: [65, 59, 80, 81, 56, 55, 40, 55, 30, 80]
//                     data: props.myAuditStatus.map((item) => item.count || 0)
//                 }
                
//             ]
//         };

//         const options = {
//             defaultFontColor: '#74788d',
//             tooltips: {
//                 enabled: true,  // Ensure tooltips are enabled
//                 mode: 'index',  // Tooltip will show the value of the point being hovered
//                 intersect: false,  // The tooltip will show even when not directly over the point
//                 callbacks: {
//                     // Customize the tooltip content
//                     label: function(tooltipItem) {
//                         return `Count: ${tooltipItem.yLabel}`; // Customizing the label displayed in the tooltip
//                     }
//                 }
//             },
//             scales: {
//                 yAxes: [
//                     {
//                         ticks: {
//                             max: 100,
//                             min: 20,
//                             stepSize: 10,
//                         },
//                         gridLines: {
//                             color: 'rgba(166, 176, 207, 0.1)',
//                         },
//                     },
//                 ],
//             },
//         };
//         return (
//             <React.Fragment>
//                 <Line width={600} height={150} data={data} options={options} />
//             </React.Fragment>
//         );
//     } else {
//         return null
//     }
// }

// export default LineChart;











// import React, { Component } from 'react';
// import { Line } from 'react-chartjs-2';

// class LineChart extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//         }
//     }
//     render() {
//         const data = {
//             labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October"],
//             options: {
//                 fontColor: '#8791af',
//                 defaultFontColor: '#8791af',
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 scales: {
//                     xAxes: [
//                         {
//                             gridLines: {
//                                 color: 'rgba(166, 176, 207, 0.1)',
//                             },
//                         },
//                     ],
//                     yAxes: [
//                         {
//                             ticks: {
//                                 max: 100,
//                                 min: 20,
//                                 stepSize: 10,
//                             },
//                             gridLines: {
//                                 color: 'rgba(166, 176, 207, 0.1)',
//                             },
//                         },
//                     ],
//                 },
//             },
//             datasets: [
//                 {
//                     label: "Sales Analytics",
//                     fill: true,
//                     lineTension: 0.5,
//                     backgroundColor: "rgba(60, 76, 207, 0.2)",
//                     borderColor: "#74788d",
//                     borderCapStyle: 'butt',
//                     borderDash: [],
//                     borderDashOffset: 0.0,
//                     borderJoinStyle: 'miter',
//                     pointBorderColor: "#3c4ccf",
//                     pointBackgroundColor: "#fff",
//                     pointBorderWidth: 1,
//                     pointHoverRadius: 5,
//                     pointHoverBackgroundColor: "#3c4ccf",
//                     pointHoverBorderColor: "#fff",
//                     pointHoverBorderWidth: 2,
//                     pointRadius: 1,
//                     pointHitRadius: 10,
//                     data: [65, 59, 80, 81, 56, 55, 40, 55, 30, 80]
//                 },
//                 {
//                     label: "Monthly Earnings",
//                     fill: true,
//                     lineTension: 0.5,
//                     backgroundColor: "rgba(235, 239, 242, 0.2)",
//                     borderColor: "#74788d",
//                     borderCapStyle: 'butt',
//                     borderDash: [],
//                     borderDashOffset: 0.0,
//                     borderJoinStyle: 'miter',
//                     pointBorderColor: "#ebeff2",
//                     pointBackgroundColor: "#fff",
//                     pointBorderWidth: 1,
//                     pointHoverRadius: 5,
//                     pointHoverBackgroundColor: "#ebeff2",
//                     pointHoverBorderColor: "#eef0f2",
//                     pointHoverBorderWidth: 2,
//                     pointRadius: 1,
//                     pointHitRadius: 10,
//                     data: [80, 23, 56, 65, 23, 35, 85, 25, 92, 36]
//                 }
//             ]
//         };
//         var option = {
//             defaultFontColor: '#74788d',
//             scales: {
//                 yAxes: [
//                     {
//                         ticks: {
//                             max: 100,
//                             min: 20,
//                             stepSize: 10,
//                         },
//                         gridLines: {
//                             color: 'rgba(166, 176, 207, 0.1)',
//                         },
//                     },
//                 ],
//             },
//         }
//         return (
//             <React.Fragment>
//                 <Line width={600} height={150} data={data} options={option} />
//             </React.Fragment>
//         );
//     }
// }

// export default LineChart;