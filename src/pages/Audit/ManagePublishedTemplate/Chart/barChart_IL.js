import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import urlSocket from "../../../../helpers/urlSocket";
import _ from "lodash";
import moment from "moment";

const BarChartIL = ({ userInfo, encrypted_db_url, auditInfo, total_locations }) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [chartData, setChartData] = useState({
    totalEnties: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    no_impact: 0,
  });

  useEffect(() => {
    const getCheckpointReportData = async () => {
      try {
        const response = await urlSocket.post("webpbdadtdta/getCNCreport", {
          userInfo: {
            _id: userInfo._id,
            user_code: userInfo.user_code,
            company_id: userInfo.company_id,
          },
          encrypted_db_url,
          auditInfo,
        });
        console.log(response,'response')
        if (response.data.response_code === 500) {
          let totalEnties = response.data.data.length
          const critical = _.sumBy(response.data.data, "critical");
          const high = _.sumBy(response.data.data, "high");
          const medium = _.sumBy(response.data.data, "medium");
          const low = _.sumBy(response.data.data, "low");
          const no_impact = _.sumBy(response.data.data, "no_impact");

          setChartData({
            totalEnties,
            critical,
            high,
            medium,
            low,
            no_impact,
          });
          setDataLoaded(true);
        }
      } catch (error) {
        console.log("catch error", error);
      }
    };

    getCheckpointReportData();
  }, [userInfo, encrypted_db_url, auditInfo, total_locations]);

  if (!dataLoaded) return null;

  const data = {
    labels: ["Total checkpoints", "Critical", "High", "Medium", "Low", "No impact"],
    datasets: [
      {
        data: [
          chartData.totalEnties,
          chartData.critical,
          chartData.high,
          chartData.medium,
          chartData.low,
          chartData.no_impact,
        ],
        backgroundColor: ["#343a40", "#f46a6a", "#f1b44c", "#50a5f1", "#34c38f", "#556ee6"],
        hoverBackgroundColor: ["#343a40", "#f46a6a", "#f1b44c", "#50a5f1", "#34c38f", "#556ee6"],
        hoverBorderColor: "#fff",
      },
    ],
  };

  return (
    <React.Fragment>
      {console.log(data, "data")}
      <Pie width={474} height={260} data={data} />
    </React.Fragment>
  );
};

export default BarChartIL;

