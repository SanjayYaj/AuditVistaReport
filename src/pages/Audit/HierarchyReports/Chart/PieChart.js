import React from "react";
import ReactApexChart from "react-apexcharts";

const PieChart = ({total_checkpoints, compliantCount, nonCompliantCount, partiallyCompliantCount, notApplicableCount }) => {
  const series = [compliantCount, nonCompliantCount, partiallyCompliantCount, notApplicableCount];

  const options = {
    chart: {
      height: 320,
      type: 'pie',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
        offsetY: 0,
      },
    },
    labels: ['Compliant', 'Non Compliant', 'Partially Compliant', 'Not Applicable'],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
    },
    responsive: [{
      breakpoint: 600,
      options: {
        chart: {
          height: 240
        },
        legend: {
          show: false
        },
      }
    }],
  };

  const colors = ["#00953B", "#EA0029", "#FFD600", "#A7A8A9"];

  return (
  <div>
    <ReactApexChart options={{ ...options, colors }} series={series} type="pie" height={320} />
    <h7>Total Checkpoints - {total_checkpoints}</h7>
    </div>
  );
};

export default PieChart;