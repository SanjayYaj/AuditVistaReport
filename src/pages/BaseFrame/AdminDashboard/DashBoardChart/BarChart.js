import React from "react";
import ReactApexChart from "react-apexcharts";

const BarChart = (props) => {
    if (props.chartInfo && props.chartInfo.length > 0) {
        let chartData = props.chartInfo[0].results;
        const categories = chartData.map((item) => item.status || '');
        const seriesData = chartData.map((item) => item.count !== undefined ? item.count : 0);  // Ensure 0 values are included
        const barColors = chartData.map((item) => item.color || '');

        const isNoData = seriesData.every(value => value === 0);

        if (isNoData) {
            return (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "250px", // Fixed height
                    textAlign: "center",
                    flexDirection: "column"
                }}>
                    <p>No Data Available</p>
                </div>
            );
        }

        const individualBarColors = barColors.length
            ? barColors
            : ["#FF4560", "#008FFB", "#00E396", "#FEB019", "#FF66B2", "#775DD0", "#00B8D4", "#FF9800", "#FF5722", "#8BC34A"];

        const series = [
            {
                data: seriesData,
            },
        ];

        const options = {
            chart: {
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    distributed: true, // This ensures each bar gets a unique color
                },
            },
            dataLabels: {
                enabled: true,  // Enable data labels
                style: {
                    colors: ['#fff'],  // Color for the text on the bars
                },
            },
            // `colors` can be applied individually per bar using the "distributed" option
            colors: individualBarColors, // Here we set different colors for each bar
            grid: {
                borderColor: "#f1f1f1",
            },
            xaxis: {
                categories: categories,
            },
        };

        return (
            <ReactApexChart options={options} series={series} type="bar" height="350" />
        );
    } else {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "250px", // Fixed height
                textAlign: "center",
                flexDirection: "column"
            }}>
                <p>No Data Available</p>
            </div>
        );
    }
};

export default BarChart;














//4-2-25
// import React from "react";
// import ReactApexChart from "react-apexcharts";

// const BarChart = (props) => {
// //   const spineareaChartColors = getChartColorsArray(dataColors);

//   if (props.chartInfo && props.chartInfo.length > 0) {
//     let chartData = props.chartInfo[0].results;
//     const categories = chartData.map((item) => item.status || '');
//     const seriesData = chartData.map((item) => item.count !== undefined ? item.count : 0);  // Ensure 0 values are included
//     const barColors = chartData.map((item) => item.color || '');

//   // Generate a color for each bar, ensuring there are enough colors
//   const individualBarColors = barColors.length
//     ? barColors
//     : [ "#FF4560", "#008FFB", "#00E396", "#FEB019", "#FF66B2", "#775DD0", "#00B8D4", "#FF9800", "#FF5722", "#8BC34A" ];

//   const series = [
//     {
//       data: seriesData,
//     },
//   ];

//   const options = {
//     chart: {
//       toolbar: {
//         show: false,
//       },
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         distributed: true, // This ensures each bar gets a unique color
//       },
//     },
//     dataLabels: {
//       enabled: true,  // Enable data labels
//       style: {
//         colors: ['#fff'],  // Color for the text on the bars
//       },
//     },
//     // `colors` can be applied individually per bar using the "distributed" option
//     colors: individualBarColors, // Here we set different colors for each bar
//     grid: {
//       borderColor: "#f1f1f1",
//     },
//     xaxis: {
//       categories: categories,
//     },
//   };

//   return (
//     <ReactApexChart options={options} series={series} type="bar" height="350" />
//   );
// } else {
//   return null;
// }
// };

// export default BarChart;











// import React from 'react';
// import Chart from 'react-apexcharts';

// const BarChart = (props) => {
//     if (props.chartInfo && props.chartInfo.length > 0) {
//         let chartData = props.chartInfo[0].results;

//         // Prepare the data for ApexCharts
//         const categories = chartData.map((item) => item.status || '');
//         const seriesData = chartData.map((item) => item.count !== undefined ? item.count : 0);  // Ensure 0 values are included

//         // Generate dynamic colors
//         const generateColors = (length) => {
//             return Array.from({ length }, () =>
//                 `#${Math.floor(Math.random() * 16777215).toString(16)}`
//             );
//         };

//         const barColors = chartData.map((item) => item.color || '');

//         // // ApexCharts options
//         // const options = {
//         //     chart: {
//         //         type: 'bar',
//         //         height: 350,
//         //         toolbar: {
//         //             show: false, // Disable the toolbar
//         //         },
//         //     },
//         //     plotOptions: {
//         //         bar: {
//         //             horizontal: false,
//         //             columnWidth: '55%',
//         //             endingShape: 'rounded',
//         //         },
//         //     },
//         //     dataLabels: {
//         //         enabled: false, // Hide data labels on the bars
//         //     },
//         //     xaxis: {
//         //         categories: categories, // Use the status labels
//         //     },
//         //     yaxis: {
//         //         labels: {
//         //             formatter: (value) => value === 0 ? '0' : value.toString(), // Explicitly handle 0 values
//         //         },
//         //     },
//         //     tooltip: {
//         //         y: {
//         //             formatter: function (value) {
//         //                 return value === 0 ? 'Count: 0' : `Count: ${value}`; // Tooltip for 0 values
//         //             },
//         //         },
//         //     },
//         //     colors: barColors, // Assign dynamic colors to bars
//         //     fill: {
//         //         type: 'gradient', // Add gradient effect
//         //         gradient: {
//         //             shade: 'light',
//         //             type: 'vertical',
//         //             shadeIntensity: 0.25,
//         //             gradientToColors: barColors.map((color) => `${color}80`), // Lighten for gradient
//         //             inverseColors: false,
//         //             opacityFrom: 0.85,
//         //             opacityTo: 0.9,
//         //             stops: [0, 100],
//         //         },
//         //     },
//         //     legend: {
//         //         show: false, // Hide the legend
//         //     },
//         // };

//         // const options = {
//         //     chart: {
//         //         type: 'bar',
//         //         height: 350,
//         //         toolbar: {
//         //             show: false, // Disable the toolbar
//         //         },
//         //     },
//         //     plotOptions: {
//         //         bar: {
//         //             horizontal: false,
//         //             columnWidth: '35%',
//         //             endingShape: 'rounded',
//         //         },
//         //     },
//         //     dataLabels: {
//         //         enabled: true, // Show data labels on the bars
//         //     },
//         //     xaxis: {
//         //         categories: categories, // Use the status labels
//         //         tickPlacement: 'on', // Ensure tick lines align with categories
//         //         axisTicks: {
//         //             show: true, // Show tick lines on the X-axis
//         //         },
//         //         axisBorder: {
//         //             show: true, // Show X-axis border line
//         //         },
//         //     },
//         //     yaxis: {
//         //         labels: {
//         //             formatter: (value) => value === 0 ? '0' : value.toString(), // Explicitly handle 0 values
//         //         },
//         //         tickAmount: 6, // Defines number of tick lines
//         //         axisTicks: {
//         //             show: true, // Show tick lines on the Y-axis
//         //         },
//         //         axisBorder: {
//         //             show: true, // Show Y-axis border line
//         //         },
//         //     },
//         //     tooltip: {
//         //         y: {
//         //             formatter: function (value) {
//         //                 return value === 0 ? 'Count: 0' : `Count: ${value}`; // Tooltip for 0 values
//         //             },
//         //         },
//         //     },
//         //     colors: barColors, // Assign dynamic colors to bars
//         //     fill: {
//         //         type: 'gradient', // Add gradient effect
//         //         gradient: {
//         //             shade: 'dark', // Change to 'dark' for better contrast
//         //             type: 'vertical',
//         //             shadeIntensity: 0.4,
//         //             // gradientToColors: barColors.map((color) => `${color}80`), // Lighten for gradient
//         //             inverseColors: false,
//         //             opacityFrom: 0.85,
//         //             opacityTo: 0.9,
//         //             stops: [0, 100],
//         //         },
//         //     },
//         //     legend: {
//         //         show: true, // Ensure the legend is visible
//         //         position: 'bottom', // Put the legend at the bottom
//         //         horizontalAlign: 'center', // Center align
//         //         floating: false, // Do not let it float above the chart
//         //         fontSize: '14px',
//         //         markers: {
//         //             width: 10,
//         //             height: 10,
//         //             radius: 10, // Adjust marker size
//         //         },
//         //     },
//         //     grid: {
//         //         show: true, // Ensure grid lines are visible
//         //         borderColor: "#222", // Darker grid lines
//         //         strokeDashArray: 0, // Solid lines for better visibility
//         //         xaxis: {
//         //             lines: {
//         //                 show: true, // Show vertical grid lines
//         //             },
//         //         },
//         //         yaxis: {
//         //             lines: {
//         //                 show: true, // Show horizontal grid lines
//         //             },
//         //         },
//         //     },
//         // };
        

//         const options = {
//             chart: {
//               type: 'bar',
//               height: 350,
//               toolbar: {
//                 show: false, // Disable the toolbar
//               },
//             },
//             plotOptions: {
//               bar: {
//                 horizontal: false,
//                 columnWidth: '35%',
//                 endingShape: 'rounded',
//               },
//             },
//             dataLabels: {
//               enabled: true, // Show data labels on the bars
//             },
//             xaxis: {
//               categories: categories, // Use the status labels
//               tickPlacement: 'on', // Ensure tick lines align with categories
//               axisTicks: {
//                 show: true, // Show tick lines on the X-axis
//               },
//               axisBorder: {
//                 show: true, // Show X-axis border line
//               },
//             },
//             yaxis: {
//               labels: {
//                 formatter: (value) => value === 0 ? '0' : value.toString(), // Explicitly handle 0 values
//               },
//               tickAmount: 6, // Defines number of tick lines
//               axisTicks: {
//                 show: true, // Show tick lines on the Y-axis
//               },
//               axisBorder: {
//                 show: true, // Show Y-axis border line
//               },
//             },
//             tooltip: {
//               y: {
//                 formatter: function (value) {
//                   return value === 0 ? 'Count: 0' : `Count: ${value}`; // Tooltip for 0 values
//                 },
//               },
//             },
//             colors:barColors, // Use dynamic colors for the bars
//             fill: {
//               type: 'gradient', // Add gradient effect
//               gradient: {
//                 shade: 'dark', // Change to 'dark' for better contrast
//                 type: 'vertical',
//                 shadeIntensity: 0.4,
//                 inverseColors: false,
//                 opacityFrom: 0.85,
//                 opacityTo: 0.9,
//                 stops: [0, 100],
//               },
//             },
//             legend: {
//               show: true, // Ensure the legend is visible
//               position: 'bottom', // Put the legend at the bottom
//               horizontalAlign: 'center', // Center align
//               floating: false, // Do not let it float above the chart
//               fontSize: '14px',
//               markers: {
//                 width: 10,
//                 height: 10,
//                 radius: 10, // Adjust marker size
//               },
//             },
//             grid: {
//               show: true, // Ensure grid lines are visible
//               borderColor: "#222", // Darker grid lines
//               strokeDashArray: 0, // Solid lines for better visibility
//               xaxis: {
//                 lines: {
//                   show: true, // Show vertical grid lines
//                 },
//               },
//               yaxis: {
//                 lines: {
//                   show: true, // Show horizontal grid lines
//                 },
//               },
//             },
//             series: [
//               {
//                 name: 'Data Series 1',
//                 data: [10, 20, 30, 40, 50], // Sample data
//               },
//               // Add other series if needed
//             ],
//           };
          

//             // ApexCharts series
//         const series = [
//             {
//                 name: 'Latest Audits',
//                 data: seriesData,
//             },
//         ];

//         return (
//             <React.Fragment>
//                 <Chart options={options} series={series} type="bar" height={250} />
//             </React.Fragment>
//         );
//     } else {
//         return null;
//     }
// };

// export default BarChart;










// import React from 'react';
// import Chart from 'react-apexcharts';

// const BarChart = (props) => {
//     if (props.chartInfo && props.chartInfo.length > 0) {
//         let chartData = props.chartInfo[0].results;

//         // Prepare the data for ApexCharts
//         const categories = chartData.map((item) => item.status || '');
//         const seriesData = chartData.map((item) => item.count || 0);

//         // Generate dynamic colors
//         const generateColors = (length) => {
//             return Array.from({ length }, () =>
//                 `#${Math.floor(Math.random() * 16777215).toString(16)}`
//             );
//         };

//         const barColors = chartData.map((item) => item.color || '');

//         // ApexCharts options
//         const options = {
//             chart: {
//                 type: 'bar',
//                 height: 350,
//                 toolbar: {
//                     show: false, // Disable the toolbar
//                 },
//             },
//             plotOptions: {
//                 bar: {
//                     horizontal: false,
//                     columnWidth: '55%',
//                     endingShape: 'rounded',
//                 },
//             },
//             dataLabels: {
//                 enabled: false, // Hide data labels on the bars
//             },
//             xaxis: {
//                 categories: categories, // Use the status labels
//             },
//             yaxis: {
//                 labels: {
//                     formatter: (value) => value.toString(), // Format y-axis values
//                 },
//             },
//             tooltip: {
//                 y: {
//                     formatter: function (value) {
//                         return `Count: ${value}`; // Tooltip value formatting
//                     },
//                 },
//             },
//             colors: barColors, // Assign dynamic colors to bars
//             fill: {
//                 type: 'gradient', // Add gradient effect
//                 gradient: {
//                     shade: 'light',
//                     type: 'vertical',
//                     shadeIntensity: 0.25,
//                     gradientToColors: barColors.map((color) => `${color}80`), // Lighten for gradient
//                     inverseColors: false,
//                     opacityFrom: 0.85,
//                     opacityTo: 0.9,
//                     stops: [0, 100],
//                 },
//             },
//             legend: {
//                 show: false, // Hide the legend
//             },
//         };

//         // ApexCharts series
//         const series = [
//             {
//                 name: 'Latest Audits',
//                 data: seriesData,
//             },
//         ];

//         return (
//             <React.Fragment>
//                 <Chart options={options} series={series} type="bar" height={250} />
//             </React.Fragment>
//         );
//     } else {
//         return null;
//     }
// };

// export default BarChart;











// import React from 'react';
// import Chart from 'react-apexcharts';

// const BarChart = (props) => {
//     if (props.chartInfo && props.chartInfo.length > 0) {
//         let chartData = props.chartInfo[0].results;

//         // Prepare the data for ApexCharts
//         const categories = chartData.map((item) => item.status || '');
//         const seriesData = chartData.map((item) => item.count || 0);

//         // ApexCharts options
//         const options = {
//             chart: {
//                 type: 'bar',
//                 height: 350,
//                 toolbar: {
//                     show: false, // Disable the toolbar
//                 },
//             },
//             plotOptions: {
//                 bar: {
//                     horizontal: false,
//                     columnWidth: '55%',
//                     endingShape: 'rounded',
//                 },
//             },
//             dataLabels: {
//                 enabled: false,
//             },
//             xaxis: {
//                 categories: categories, // Use the status labels
//             },
//             yaxis: {
//                 labels: {
//                     formatter: (value) => value.toString(), // Format y-axis values
//                 },
//             },
//             tooltip: {
//                 y: {
//                     formatter: function (value) {
//                         return `Count: ${value}`;
//                     },
//                 },
//             },
//             colors: chartData.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`), // Random colors for bars
//             legend: {
//                 show: false,
//             },
//         };

//         // ApexCharts series
//         const series = [
//             {
//                 name: 'Latest Audits',
//                 data: seriesData, 
//             },
//         ];

//         return (
//             <React.Fragment>
//                 <Chart options={options} series={series} type="bar" height={250} />
//             </React.Fragment>
//         );
//     } else {
//         return null;
//     }
// };

// export default BarChart;









// import React from 'react';
// import { Bar } from 'react-chartjs-2';

// const BarChart = (props) => {


//     if (props.chartInfo && props.chartInfo.length > 0) {
//         let chartData = props.chartInfo[0].results
//         const generateColors = () => {
//             const backgroundColors = [];
//             const borderColors = [];
//             for (let i = 0; i < chartData.length; i++) {
//                 const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
//                 backgroundColors.push(color);
//                 borderColors.push(color);
//             }
//             return { backgroundColors, borderColors };
//         };

//         const colors = generateColors();
//         const data = {
//             labels: chartData.map((item) => item.status || ''),
//             datasets: [
//                 {
//                     label: "Latest Audits",
//                     backgroundColor: colors.backgroundColors,
//                     borderColor: colors.borderColors,
//                     borderWidth: 1,
//                     hoverBackgroundColor: "#02a499",
//                     hoverBorderColor: "#02a499",
//                     data: chartData.map((item) => item.count || 0)
//                 }
//             ]
//         };

//         const options = {
//             tooltips: {
//                 callbacks: {
//                     label: function (tooltipItem, data) {
//                         const dataset = data.datasets[tooltipItem.datasetIndex];
//                         const currentValue = dataset.data[tooltipItem.index];
//                         const total = dataset.data.reduce((sum, value) => sum + value, 0);
//                         const percentage = parseFloat((currentValue / total * 100).toFixed(1));
//                         return 'count :' + currentValue;
//                     },
//                     title: function (tooltipItem, data) {
//                         return data.labels[tooltipItem[0].index];
//                     }
//                 }
//             },
//             scales: {
//                 yAxes: [{
//                     ticks: {
//                         beginAtZero: true,
//                     },
//                 }]
//             },
//             legend: {
//                 display: false,
//             }
//         };


//         return (
//             <React.Fragment>
//                 <Bar width={600} height={150} data={data} options={options} />
//             </React.Fragment>
//         );
//     } else {
//         return null;
//     }
// };

// export default BarChart;













// import React from 'react';
// import { Bar } from 'react-chartjs-2';

// const BarChart = (props) => {
//     // Dynamically generate an array of colors


//     if(props.latest_audit && props.latest_audit.length > 0){

//     const generateColors = () => {
//         const colors = [];
//         for (let i = 0; i < props.latest_audit.length; i++) {
//             // Generate random color
//             const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
//             colors.push(color);
//         }
//         return colors;
//     };

//     // Data for the chart
//     const data = {
//         // labels: ["January", "February", "March", "April", "May", "June", "July"],
//         labels: props.latest_audit.map((item) => item.status || ''),
//         datasets: [
//             {
//                 label: "Sales Analytics",
//                 // Dynamically create background and border colors
//                 backgroundColor: generateColors(),
//                 borderColor: "#02a499",
//                 borderWidth: 1,
//                 hoverBackgroundColor: "#02a499",
//                 hoverBorderColor: "#02a499",
//                 // data: [65, 59, 81, 45, 56, 80, 50, 20],
//                 data: props.latest_audit.map((item) => item.count || 0)
//             }
//         ]
//     };

//     // Chart options
//     const options = {
//         tooltips: {
//             callbacks: {
//                 label: function (tooltipItem, data) {
//                     const dataset = data.datasets[tooltipItem.datasetIndex];
//                     const currentValue = dataset.data[tooltipItem.index];    
//                     // Manually calculate the total by summing all dataset values
//                     const total = dataset.data.reduce((sum, value) => sum + value, 0);    
//                     const percentage = parseFloat((currentValue / total * 100).toFixed(1));
//                     return currentValue ;
//                 },
//                 title: function (tooltipItem, data) {
//                     return data.labels[tooltipItem[0].index];
//                 }
//             }
//         }
//     };
    
//     return (
//         <React.Fragment>
//             <Bar width={600} height={150} data={data} options={options} />
//         </React.Fragment>
//     );
// }else{
//     return null
// }
// };

// export default BarChart;










// import React from 'react';
// import { Bar } from 'react-chartjs-2';

// const BarChart = (props) => {
//     // Check if latest_audit data exists and is non-empty
//     if (props.latest_audit && props.latest_audit.length > 0) {
        
//         // Generate random colors for each bar
//         const generateColors = () => {
//             const colors = [];
//             for (let i = 0; i < props.latest_audit.length; i++) {
//                 const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
//                 colors.push(color);
//             }
//             return colors;
//         };

//         // Prepare data for the chart
//         const data = {
//             labels: props.latest_audit.map((item) => item.status || ''),
//             datasets: [
//                 {
//                     label: "Sales Analytics",
//                     backgroundColor: generateColors(), // Dynamic background color
//                     borderColor: "#02a499", // Static border color
//                     borderWidth: 1,
//                     hoverBackgroundColor: "#02a499",
//                     hoverBorderColor: "#02a499",
//                     data: props.latest_audit.map((item) => item.count || 0)
//                 }
//             ]
//         };

//         // Chart options
//         const options = {
//             responsive: true,  // Ensure chart is responsive to container size
//             tooltips: {
//                 callbacks: {
//                     label: function (tooltipItem, data) {
//                         const dataset = data.datasets[tooltipItem.datasetIndex];
//                         const currentValue = dataset.data[tooltipItem.index];
//                         const total = dataset.data.reduce((sum, value) => sum + value, 0);
//                         const percentage = parseFloat((currentValue / total * 100).toFixed(1));
//                         return `${currentValue} (${percentage}%)`;
//                     },
//                     title: function (tooltipItem, data) {
//                         return data.labels[tooltipItem[0].index];
//                     }
//                 }
//             },
//             legend: {
//                 display: true,
//                 labels: {
//                     boxWidth: 20, // Width of the legend box
//                     fontColor: "#74788d", // Legend font color
//                     generateLabels: function (chart) {
//                         const dataset = chart.data.datasets[0];
//                         return chart.data.labels.map((label, index) => ({
//                             text: label,
//                             fillStyle: dataset.backgroundColor[index], // Match color with data
//                             strokeStyle: dataset.borderColor,
//                             lineWidth: dataset.borderWidth,
//                         }));
//                     }
//                 }
//             },
//             scales: {
//                 xAxes: [{
//                     ticks: {
//                         beginAtZero: true // Ensures the x-axis starts at zero
//                     }
//                 }],
//                 yAxes: [{
//                     ticks: {
//                         beginAtZero: true,  // Start y-axis at 0
//                         stepSize: 5         // Optional: set step size for y-axis ticks
//                     }
//                 }]
//             }
//         };

//         return (
//             <React.Fragment>
//                 <Bar width={600} height={150} data={data} options={options} />
//             </React.Fragment>
//         );
//     } else {
//         return <div>No data available</div>; // Handle empty state if no data
//     }
// };

// export default BarChart;










// import React, { Component } from 'react';
// import { Bar } from 'react-chartjs-2';

// class BarChart extends Component {

//     render() {
//         const data = {
//             labels: ["January", "February", "March", "April", "May", "June", "July"],
//             datasets: [
//                 {
//                     label: "Sales Analytics",
//                     backgroundColor: "#02a499",
//                     borderColor: "#02a499",
//                     borderWidth: 1,
//                     hoverBackgroundColor: "#02a499",
//                     hoverBorderColor: "#02a499",
//                     data: [65, 59, 81, 45, 56, 80, 50, 20]
//                 }
//             ]
//         };

//         const option = {
//             tootlbar: {
//                 show: false
//             },
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
//         }

//         return (
//             <React.Fragment>
//                 <Bar width={600} height={150} data={data} options={option} />
//             </React.Fragment>
//         );
//     }
// }

// export default BarChart;   