import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import _ from "lodash";
import urlSocket from "../../../../helpers/urlSocket";

const BarChartIL = ({ userInfo, encrypted_db_url, auditInfo, total_locations }) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    getCheckpointReportData();
  }, []);

  const getCheckpointReportData = async () => {
    try {
      const response = await urlSocket.post("hreport/hreport-getCNCreport", {
        userInfo: {
          _id: userInfo._id,
        },
        encrypted_db_url,
        auditInfo,
      });

      if (response.data.response_code === 500) {
        let totalEntries = response.data.data.length * total_locations;
        let critical = _.sum(_.map(response.data.data, "critical"));
        let high = _.sum(_.map(response.data.data, "high"));
        let medium = _.sum(_.map(response.data.data, "medium"));
        let low = _.sum(_.map(response.data.data, "low"));
        let noImpact = _.sum(_.map(response.data.data, "no_impact"));

        setChartData({
          labels: ["Total checkpoints", "Critical", "High", "Medium", "Low", "No impact"],
          datasets: [
            {
              data: [totalEntries, critical, high, medium, low, noImpact],
              backgroundColor: ["#343a40", "#f46a6a", "#f1b44c", "#50a5f1", "#34c38f", "#556ee6"],
              hoverBackgroundColor: ["#343a40", "#f46a6a", "#f1b44c", "#50a5f1", "#34c38f", "#556ee6"],
              hoverBorderColor: "#fff",
            },
          ],
        });

        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching checkpoint report data:", error);
    }
  };

  return dataLoaded ? <Pie width={474} height={260} data={chartData} /> : null;
};

export default BarChartIL;
