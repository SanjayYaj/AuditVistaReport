import React from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../getChartcolor";

const PieChart2 = (props) => {
    if (props.chartInfo && props.chartInfo.length > 0) {
        let chartData = props.chartInfo[0]?.grouped_data;

        const dataValues = chartData.map((item) => item.count || 0);
        const labels = chartData.map((item) => item.status || "");
        const bgColors = chartData.map((item) => item.color || '');

        const isNoData = dataValues.every(value => value === 0);

        if (isNoData) {
            return (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "250px", // Full viewport height
                    textAlign: "center",
                    flexDirection: "column"
                }}>
                    <p>No Data Available</p>
                </div>
            );
        }

        const PieApexChartColors = bgColors;
        const series = dataValues;
        const options = {
            chart: {
                height: 320,
                type: "pie",
            },
            series: dataValues,
            labels: labels,
            colors: PieApexChartColors,
            legend: {
                show: false, // Hide default legend
            },
            responsive: [
                {
                    breakpoint: 600,
                    options: {
                        chart: {
                            height: 240,
                        },
                    },
                },
            ],
        };

        return (
            <div style={{ textAlign: "center" }}>
                <ReactApexChart options={options} series={series} type="pie" height={250} />

                <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", flexWrap: "wrap" }}>
                    {labels.map((label, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "center", margin: "5px 10px" }}>
                            <div style={{ width: "12px", height: "12px", backgroundColor: PieApexChartColors[index], borderRadius: "50%", marginRight: "5px" }} ></div>
                            <span style={{ fontSize: "14px", color: "#333" }}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "250px", // Full viewport height
                textAlign: "center",
                flexDirection: "column"
            }}>
                <p>No Data Available</p>
            </div>
        );
    }
};

export default PieChart2;













// import React from "react";
// import ReactApexChart from "react-apexcharts";
// import getChartColorsArray from "../getChartcolor";

// const PieChart2 = (props) => {
//     if (props.chartInfo && props.chartInfo.length > 0) {
//         let chartData = props.chartInfo[0]?.grouped_data;
//         const dataValues = chartData.map((item) => item.count || 0);
//         const labels = chartData.map((item) => item.status || "");
//         const bgColors = chartData.map((item) => item.color || '');

//         var dataColors = props.dataColors;
//         // const PieApexChartColors = getChartColorsArray(dataColors);
//         const PieApexChartColors = bgColors

//         const series = dataValues;
//         const options = {
//             chart: {
//                 height: 320,
//                 type: "pie",
//             },
//             series: dataValues,
//             labels: labels,
//             colors: PieApexChartColors,
//             // dataLabels: {
//             //     enabled: true,
//             //     style: {
//             //         fontSize: "14px",
//             //         fontWeight: "bold",
//             //         colors: ["#333"],
//             //     },
//             //     dropShadow: {
//             //         enabled: false,
//             //     },
//             //     formatter: function (val, opts) {
//             //         // console.log("Formatter Debug:", opts, val);
//             //         return opts.w.globals.labels[opts.seriesIndex] + ": " + opts.w.globals.series[opts.seriesIndex];
//             //     },

//             //     // Adding Leader Lines
//             //     textAnchor: "middle",
//             //     offset: 10, // Adjust distance from slices
//             //     background: {
//             //         enabled: true,
//             //         foreColor: "#fff",
//             //         padding: 4,
//             //         borderRadius: 2,
//             //         borderWidth: 1,
//             //         borderColor: "#ccc",
//             //         opacity: 0.8,
//             //     },
//             // },
//             legend: {
//                 show: false, // Hide default legend
//             },
//             responsive: [
//                 {
//                     breakpoint: 600,
//                     options: {
//                         chart: {
//                             height: 240,
//                         },
//                     },
//                 },
//             ],
//         };

//         return (
//             <div style={{ textAlign: "center" }}>
//                 <ReactApexChart options={options} series={series} type="pie" height={250} />

//                 {/* Custom Legend with Colors */}
//                 <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", flexWrap: "wrap" }}>
//                     {console.log('labels', labels)}
//                     {labels.map((label, index) => (
//                         <div key={index} style={{ display: "flex", alignItems: "center", margin: "5px 10px" }}>
//                             <div style={{ width: "12px", height: "12px", backgroundColor: PieApexChartColors[index], borderRadius: "50%", marginRight: "5px" }} ></div>
//                             <span style={{ fontSize: "14px", color: "#333" }}>{label}</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     } else {
//         return null;
//     }
// };

// export default PieChart2;













// import React from "react"
// import ReactApexChart from "react-apexcharts"
// import getChartColorsArray from "../getChartcolor";

// const PieChart2 = (props) => {


//     if (props.chartInfo && props.chartInfo.length > 0) {
//         let pieChartData = props.chartInfo[0]?.grouped_data
//         const dataValues = pieChartData.map((item) => item.count || 0)
//         const labels = pieChartData.map((item) => item.status || '')

//         var dataColors = props.dataColors

//         const PieApexChartColors = getChartColorsArray(dataColors);
//         const series = dataValues
//         const options = {
//             chart: {
//                 height: 320,
//                 type: 'pie',
//             },
//             series: dataValues,
//             labels: labels,
//             colors: PieApexChartColors,
//             legend: {
//                 show: true,
//                 position: 'bottom',
//                 horizontalAlign: 'center',
//                 verticalAlign: 'middle',
//                 floating: false,
//                 fontSize: '14px',
//                 offsetX: 0,
//             },
//             responsive: [{
//                 breakpoint: 600,
//                 options: {
//                     chart: {
//                         height: 240
//                     },
//                     legend: {
//                         show: false
//                     },
//                 }
//             }]
//         }

//         return (
//             <ReactApexChart options={options} series={series} type="pie"  height={250} />
//         )
//     } else { return null }
// }

// export default PieChart2











// import React from "react";
// import ReactEcharts from "echarts-for-react";
// import getChartColorsArray from "../getChartcolor";

// const PieChart2 = (props) => {
//     if (props.chartInfo && props.chartInfo.length > 0) {
//         var dataColors = props.dataColors;
//         let pieChartData = props.chartInfo[0]?.grouped_data;

//         const labels = pieChartData.map((item) => item.status || "");
//         const transformedData = pieChartData.map((item) => ({
//             value: item.count,
//             name: item.status,
//         }));

//         const PieEChartColors = getChartColorsArray(dataColors);
//         const options = {
//             toolbox: {
//                 show: false,
//             },
//             tooltip: {
//                 trigger: "item",
//                 formatter: "{a} <br/>{b} : {c} ({d}%)",
//             },
//             legend: {
//                 orient: "horizontal",
//                 left: "center",
//                 data: labels,
//                 textStyle: {
//                     color: ["#8791af"],
//                 },
//             },
//             color: PieEChartColors,
//             series: [
//                 {
//                     name: "ActionPlan",
//                     type: "pie",
//                     // Use an array for radius to create the doughnut effect
//                     radius: ["40%", "70%"], // Inner radius ("40%") and outer radius ("70%")
//                     center: ["50%", "60%"],
//                     data: transformedData,
//                     itemStyle: {
//                         emphasis: {
//                             shadowBlur: 10,
//                             shadowOffsetX: 0,
//                             shadowColor: "rgba(0, 0, 0, 0.5)",
//                         },
//                     },
//                 },
//             ],
//         };

//         return (
//             <React.Fragment>
//                 {/* Keep height fixed and width 100% to cover the parent container */}
//                 <ReactEcharts
//                     style={{ height: "300px", width: "100%" }} // Adjust the height to your preference
//                     option={options}
//                 />
//             </React.Fragment>
//         );
//     } else {
//         return null;
//     }
// };

// export default PieChart2;












// import React from "react";
// import ReactEcharts from "echarts-for-react";
// import getChartColorsArray from "../getChartcolor";

// const PieChart2 = (props) => {
    
//     if (props.chartInfo && props.chartInfo.length > 0) {
//         var dataColors = props.dataColors
//         let pieChartData = props.chartInfo[0]?.grouped_data;
//         // console.log('pieChartData', pieChartData)
//         const labels = pieChartData.map((item) => item.status || "");
//         console.log('labels', labels)
//         const transformedData = pieChartData.map((item) => ({
//             value: item.count,
//             name: item.status,
//           }));
//           console.log('transformedData', transformedData)


//         const PieEChartColors = getChartColorsArray(dataColors);
//         const options = {
//             toolbox: {
//                 show: false,
//             },
//             tooltip: {
//                 trigger: "item",
//                 formatter: "{a} <br/>{b} : {c} ({d}%)",
//             },
//             legend: {
//                 orient: "horizontal",
//                 left: "center",
//                 data: labels,
//                 textStyle: {
//                     color: ["#8791af"],
//                 },
//             },
//             color: PieEChartColors,
//             series: [
//                 {
//                     name: "ActionPlan",
//                     type: "pie",
//                     radius: "70%",
//                     center: ["50%", "60%"],                
//                     data: transformedData,
//                     itemStyle: {
//                         emphasis: {
//                             shadowBlur: 10,
//                             shadowOffsetX: 0,
//                             shadowColor: "rgba(0, 0, 0, 0.5)",
//                         },
//                     },
//                 },
//             ],
//         };

//         return (
//             <React.Fragment>
//                 {/* Keep height fixed and width 100% to cover the parent container */}
//                 <ReactEcharts
//                     style={{ height: "300px", width: "100%" }} // Adjust the height to your preference
//                     option={options}
//                 />
//             </React.Fragment>
//         );
//     } else { return null }
// };

// export default PieChart2;











// import React from "react";
// import { Pie } from "react-chartjs-2";

// const PieChart2 = (props) => {
//   if (props.chartInfo && props.chartInfo.length > 0) {
//     let pieChartData = props.chartInfo[0]?.grouped_data;
//     const dataValues = pieChartData.map((item) => item.count || 0);
//     const labels = pieChartData.map((item) => item.status || "");
//     const generateDynamicColors = (dataLength) => {
//       const colorPalette = [
//         "#02a499",
//         "#f39c12",
//         "#ebeff2",
//         "#8e44ad",
//         "#3498db",
//         "#e74c3c",
//         "#2ecc71",
//         "#f1c40f",
//       ];
//       return Array.from(
//         { length: dataLength },
//         (_, index) => colorPalette[index % colorPalette.length]
//       );
//     };

//     const data = {
//       labels: labels,
//       datasets: [
//         {
//           data: dataValues,
//           backgroundColor: generateDynamicColors(dataValues.length),
//           hoverBackgroundColor: generateDynamicColors(dataValues.length),
//           hoverBorderColor: "#fff",
//         },
//       ],
//     };

//     const options = {
//       responsive: true, // Ensures the chart is responsive
//       maintainAspectRatio: false, // Allows full-width scaling
//       plugins: {
//         tooltip: {
//           callbacks: {
//             label: function (tooltipItem) {
//               const currentValue = tooltipItem.raw;
//               const total = tooltipItem.dataset.data.reduce(
//                 (a, b) => a + b,
//                 0
//               );
//               const percentage = ((currentValue / total) * 100).toFixed(1);
//               return `${currentValue} (${percentage}%)`;
//             },
//           },
//         },
//       },
//     };

//     return (
//       <div style={{ width: "100%", height: "300px" }}>
//         <Pie data={data} options={options} />
//       </div>
//     );
//   } else {
//     return null;
//   }
// };

// export default PieChart2;










// import React from 'react';
// import { Pie } from 'react-chartjs-2';

// const PieChart2 = (props) => {


//     if (props.chartInfo && props.chartInfo.length > 0) {
//         let pieChartData = props.chartInfo[0]?.grouped_data
//         const dataValues = pieChartData.map((item) => item.count || 0)
//         const labels = pieChartData.map((item) => item.status || '')


//         const generateDynamicColors = (dataLength) => {
//             const colorPalette = ["#02a499", "#f39c12", "#ebeff2", "#8e44ad", "#3498db", "#e74c3c", "#2ecc71", "#f1c40f"];
//             return Array.from({ length: dataLength }, (_, index) => colorPalette[index % colorPalette.length]);
//         };

//         const data = {
//             labels: labels,
//             datasets: [
//                 {
//                     data: dataValues,
//                     backgroundColor: generateDynamicColors(dataValues.length),
//                     hoverBackgroundColor: generateDynamicColors(dataValues.length),
//                     hoverBorderColor: "#fff"
//                 }
//             ]
//         };

//         const option = {
//             tooltips: {
//                 callbacks: {
//                     label: function (tooltipItem, data) {
//                         var dataset = data.datasets[tooltipItem.datasetIndex];
//                         var meta = dataset._meta[Object.keys(dataset._meta)[0]];
//                         var total = meta.total;
//                         var currentValue = dataset.data[tooltipItem.index];
//                         var percentage = parseFloat((currentValue / total * 100).toFixed(1));
//                         return currentValue + ' (' + percentage + '%)';
//                     },
//                     title: function (tooltipItem, data) {
//                         return data.labels[tooltipItem[0].index];
//                     }
//                 }
//             }
//         };

//         return (
//             <React.Fragment>
//                  <div style={{ width: "100%", height: "300px" }}>
//                         <Pie data={data} options={option} />
//                       </div>
//                 {/* <Pie height={150} data={data} options={option} /> */}
//             </React.Fragment>
//         );
//     } else {
//         return null
//     }
// };

// export default PieChart2;




