import React from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../getChartcolor";

const PieChart = (props) => {
  if (props.chartInfo && props.chartInfo.length > 0) {
    let chartData = props.chartInfo[0]?.pieChartData;
    const dataValues = chartData.map((item) => item.count || 0);
    const labels = chartData.map((item) => item.status || "");
    const bgColors = chartData.map((item) => item.color || '');

    var dataColors = props.dataColors;
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
    return null;
  }
};

export default PieChart;














// import React from "react";
// import ReactApexChart from "react-apexcharts";
// import getChartColorsArray from "../getChartcolor";

// const PieChart = (props) => {
//   if (props.chartInfo && props.chartInfo.length > 0) {
//     let pieChartData = props.chartInfo[0]?.pieChartData;
//     const dataValues = pieChartData.map((item) => item.count || 0);
//     const labels = pieChartData.map((item) => item.status || "");

//     var dataColors = props.dataColors;
//     const PieApexChartColors = getChartColorsArray(dataColors);
    
//     const series = dataValues;
//     const options = {
//       chart: {
//         height: 320,
//         type: "pie",
//       },
//       series: dataValues,
//       labels: labels,
//       colors: PieApexChartColors,
//       legend: {
//         show: false, // Hide default legend
//       },
//       responsive: [
//         {
//           breakpoint: 600,
//           options: {
//             chart: {
//               height: 240,
//             },
//           },
//         },
//       ],
//     };

//     return (
//       <div style={{ textAlign: "center" }}>
//         <ReactApexChart options={options} series={series} type="pie" height={250} />

//         {/* Custom Legend */}
//         <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", flexWrap: "wrap" }}>
//           {labels.map((label, index) => (
//             <div key={index} style={{ display: "flex", alignItems: "center", margin: "5px 10px" }}>
//               <div
//                 style={{
//                   width: "12px",
//                   height: "12px",
//                   backgroundColor: PieApexChartColors[index],
//                   borderRadius: "50%",
//                   marginRight: "5px",
//                 }}
//               ></div>
//               <span style={{ fontSize: "14px", color: "#333" }}>{label}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   } else {
//     return null;
//   }
// };

// export default PieChart;












// import React from "react"
// import ReactApexChart from "react-apexcharts"
// import getChartColorsArray from "../getChartcolor";

// const PieChart = (props) => {


//     if (props.chartInfo && props.chartInfo.length > 0) {
//         let pieChartData = props.chartInfo[0]?.pieChartData
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

// export default PieChart



















// import React from 'react';
// import { Pie } from 'react-chartjs-2';

// const PieChart = (props) => {


//     if (props.chartInfo && props.chartInfo.length > 0) {
//         let pieChartData = props.chartInfo[0]?.pieChartData
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
//                 <Pie  height={150} data={data} options={option} />
//             </React.Fragment>
//         );
//     } else {
//         return null
//     }
// };

// export default PieChart;














// import React from 'react';
// import { Pie } from 'react-chartjs-2';

// // Function to generate random colors
// const generateColors = (numColors) => {
//     const colors = [];
//     for (let i = 0; i < numColors; i++) {
//         // Generate random color in hex format
//         const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
//         colors.push(randomColor);
//     }
//     return colors;
// };

// const PieChart = () => {
//     const dataValues = [480, 300, 180]; 
//     const labels = ["Total users","Active User", "Inactive User"]; 

//     // Generate dynamic background and hover colors based on the data length
//     const numDataPoints = dataValues.length;
//     const backgroundColor = generateColors(numDataPoints); 
//     const hoverBackgroundColor = generateColors(numDataPoints); 
//     const hoverBorderColor = "#fff"; 

//     const data = {
//         labels: labels,
//         datasets: [
//             {
//                 data: dataValues,
//                 backgroundColor: backgroundColor,
//                 hoverBackgroundColor: hoverBackgroundColor,
//                 hoverBorderColor: hoverBorderColor,
//             }
//         ]
//     };

//     const option = {
//         tooltips: {
//             callbacks: {
//                 label: function (tooltipItem, data) {
//                     var dataset = data.datasets[tooltipItem.datasetIndex];
//                     var meta = dataset._meta[Object.keys(dataset._meta)[0]];
//                     var total = meta.total;
//                     var currentValue = dataset.data[tooltipItem.index];
//                     var percentage = parseFloat((currentValue / total * 100).toFixed(1));
//                     return currentValue + ' (' + percentage + '%)';
//                 },
//                 title: function (tooltipItem, data) {
//                     return data.labels[tooltipItem[0].index];
//                 }
//             }
//         }
//     };

//     return (
//         <React.Fragment>
//             <Pie height={150} data={data} options={option} />
//         </React.Fragment>
//     );
// };

// export default PieChart;













// import React from 'react';
// import { Pie } from 'react-chartjs-2';

// // Function to generate random colors
// const generateColors = (numColors) => {
//     const colors = [];
//     for (let i = 0; i < numColors; i++) {
//         // Generate random color in hex format
//         const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
//         colors.push(randomColor);
//     }
//     return colors;
// };

// const PieChart = () => {
//     const dataValues = [480, 300, 180]; 
//     const labels = ["Total users","Active User", "Inactive User"]; 

//     // Generate dynamic background and hover colors based on the data length
//     const numDataPoints = dataValues.length;
//     const backgroundColor = generateColors(numDataPoints); 
//     const hoverBackgroundColor = generateColors(numDataPoints); 
//     const hoverBorderColor = "#fff"; 

//     const data = {
//         labels: labels,
//         datasets: [
//             {
//                 data: dataValues,
//                 backgroundColor: backgroundColor,
//                 hoverBackgroundColor: hoverBackgroundColor,
//                 hoverBorderColor: hoverBorderColor,
//             }
//         ]
//     };

//     const option = {
//         tooltips: {
//             callbacks: {
//                 label: function (tooltipItem, data) {
//                     var dataset = data.datasets[tooltipItem.datasetIndex];
//                     var meta = dataset._meta[Object.keys(dataset._meta)[0]];
//                     var total = meta.total;
//                     var currentValue = dataset.data[tooltipItem.index];
//                     var percentage = parseFloat((currentValue / total * 100).toFixed(1));
//                     return currentValue + ' (' + percentage + '%)';
//                 },
//                 title: function (tooltipItem, data) {
//                     return data.labels[tooltipItem[0].index];
//                 }
//             }
//         }
//     };

//     return (
//         <React.Fragment>
//             <Pie height={150} data={data} options={option} />
//         </React.Fragment>
//     );
// };

// export default PieChart;














// import React, { Component } from 'react';
// import { Pie } from 'react-chartjs-2';

// class PieChart extends Component {

//     render() {
//         const data = {
//             labels: [ "Desktops", "Tablets" ],
//             datasets: [
//                 {
//                     data: [300, 180],
//                     backgroundColor: [ "#02a499", "#ebeff2" ],
//                     hoverBackgroundColor: [ "#02a499", "#ebeff2" ],
//                     hoverBorderColor: "#fff"
//                 }]
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
//         }

//         return (
//             <React.Fragment>
//                 <Pie  height={150} data={data} options={option} />
//             </React.Fragment>
//         );
//     }
// }

// export default PieChart;   










// import React from 'react';
// import { Pie } from 'react-chartjs-2';

// const PieChart = (props) => {
//     console.log('Props:', props);

//     const pieChartData =
//         props.user_pie_chart && props.user_pie_chart[0]
//             ? props.user_pie_chart[0].pieChartData
//             : [];

//     // Handle nested arrays if necessary
//     const flatPieChartData = Array.isArray(pieChartData)
//         ? pieChartData.flat()
//         : [];

//     const labels = Array.isArray(flatPieChartData)
//         ? flatPieChartData.map((item) => item.status || 'Unknown')
//         : [];
//     const dataValues = Array.isArray(flatPieChartData)
//         ? flatPieChartData.map((item) => item.count || 0)
//         : [];
//     console.log('Flattened Data:', flatPieChartData);
//     console.log('Labels:', labels);
//     console.log('Data Values:', dataValues);

//     // Chart data configuration
//     const data = {
//         labels: labels,
//         datasets: [
//             {
//                 data: dataValues,
//                 backgroundColor: ["#02a499", "#ebeff2"],
//                 hoverBackgroundColor: ["#02a499", "#ebeff2"],
//                 hoverBorderColor: "#fff"
//             }
//         ]
//     };

//     // Chart options configuration
//     const options = {
//         tooltips: {
//             callbacks: {
//                 label: function (tooltipItem, data) {
//                     const dataset = data.datasets[tooltipItem.datasetIndex];
//                     const meta = dataset._meta[Object.keys(dataset._meta)[0]];
//                     const total = meta.total;
//                     const currentValue = dataset.data[tooltipItem.index];
//                     const percentage = parseFloat((currentValue / total * 100).toFixed(1));
//                     return currentValue + ' (' + percentage + '%)';
//                 },
//                 title: function (tooltipItem, data) {
//                     return data.labels[tooltipItem[0].index];
//                 }
//             }
//         }
//     };

//     return (
//         <React.Fragment>
//             <Pie height={150} data={data} options={options} />
//         </React.Fragment>
//     );
// };

// export default PieChart;












// import React from 'react';
// import { Pie } from 'react-chartjs-2';

// const PieChart = (props) => {
//     console.log('PieChart', props)

//     var pieChartData = props.user_pie_chart[0].pieChartData
//     console.log('pieChartData', pieChartData)

//     const labels = pieChartData.map((item) => item.status); // Extract labels
//     console.log('labels', labels)
//     const dataValues = pieChartData.map((item) => item.count); // Extract counts
//     const colors = ["#02a499", "#ebeff2"]; // Define dynamic colors (extend if necessary)

//         console.log('dataValues', dataValues, labels)



//     const data = {
//         labels: labels,
//         datasets: [
//             {
//                 data: dataValues,
//                 backgroundColor: ["#02a499", "#ebeff2"],
//                 hoverBackgroundColor: ["#02a499", "#ebeff2"],
//                 hoverBorderColor: "#fff"
//             }
//         ]
//     };

//     const options = {
//         tooltips: {
//             callbacks: {
//                 label: function (tooltipItem, data) {
//                     const dataset = data.datasets[tooltipItem.datasetIndex];
//                     const meta = dataset._meta[Object.keys(dataset._meta)[0]];
//                     const total = meta.total;
//                     const currentValue = dataset.data[tooltipItem.index];
//                     const percentage = parseFloat((currentValue / total * 100).toFixed(1));
//                     return currentValue + ' (' + percentage + '%)';
//                 },
//                 title: function (tooltipItem, data) {
//                     return data.labels[tooltipItem[0].index];
//                 }
//             }
//         }
//     };

//     return (
//         <React.Fragment>
//             <Pie height={150} data={data} options={options} />
//         </React.Fragment>
//     );
// };

// export default PieChart;














// import React, { Component } from 'react';
// import { Pie } from 'react-chartjs-2';

// class PieChart extends Component {

//     render() {
//         const data = {
//             labels: [ "Desktops", "Tablets" ],
//             datasets: [
//                 {
//                     data: [300, 180],
//                     backgroundColor: [ "#02a499", "#ebeff2" ],
//                     hoverBackgroundColor: [ "#02a499", "#ebeff2" ],
//                     hoverBorderColor: "#fff"
//                 }]
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
//         }

//         return (
//             <React.Fragment>
//                 <Pie  height={150} data={data} options={option} />
//             </React.Fragment>
//         );
//     }
// }

// export default PieChart;   