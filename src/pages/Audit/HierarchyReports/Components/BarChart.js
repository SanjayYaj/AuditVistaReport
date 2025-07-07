import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ auditData }) => {
  const data = {
    labels: ["Total", "Not Started", "In Progress", "Completed", "Submitted", "Reviewed"],
    datasets: [
      {
        label: auditData.audit_pbd_name,
        backgroundColor: ["#343a40", "#74788d", "#f1b44c", "#34c38f", "#50a5f1", "#556ee6"],
        borderColor: ["#343a40", "#74788d", "#f1b44c", "#34c38f", "#50a5f1", "#556ee6"],
        borderWidth: 1,
        hoverBackgroundColor: ["#343a40", "#74788d", "#f1b44c", "#34c38f", "#50a5f1", "#556ee6"],
        hoverBorderColor: ["#343a40", "#74788d", "#f1b44c", "#34c38f", "#50a5f1", "#556ee6"],
        data: [
          auditData.total,
          auditData.not_started,
          auditData.in_progress,
          auditData.completed,
          auditData.submitted,
          auditData.reviewed,
        ],
      },
    ],
  };

  const options = {
    scales: {
      dataset: [
        {
          barPercentage: 0.4,
        },
      ],
    },
  };

  return <Bar width={474} height={100} data={data} options={options} />;
};

export default BarChart;
