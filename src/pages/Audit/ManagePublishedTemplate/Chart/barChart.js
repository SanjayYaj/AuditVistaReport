import React from "react";
import { Bar } from "react-chartjs-2";
import { useState } from "react";

const BarChart = ({ auditData }) => {
      const [publishedAuditData,setpublishedAuditData] = useState(JSON.parse(sessionStorage.getItem("publishedAuditData")))
  const data = {
    labels: ["Total", "Not Started", "In progress", "Completed", "Submitted", "Reviewed"],
    datasets: [
      {
        label: publishedAuditData?.template_name,
        backgroundColor: ["#343a40", "#74788d", "#f1b44c", "#34c38f", "#50a5f1", "#556ee6"],
        borderColor: ["#343a40", "#74788d", "#f1b44c", "#34c38f", "#50a5f1", "#556ee6"],
        borderWidth: 1,
        hoverBackgroundColor: ["#343a40", "#74788d", "#f1b44c", "#34c38f", "#50a5f1", "#556ee6"],
        hoverBorderColor: ["#343a40", "#74788d", "#f1b44c", "#34c38f", "#50a5f1", "#556ee6"],
        data: [
          auditData?.total,
          auditData?.not_started,
          auditData?.in_progress,
          auditData?.completed,
          auditData?.submitted,
          auditData?.reviewed,
        ],
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return <Bar width={474} height={100} data={data} options={options} />;
};

export default BarChart;
