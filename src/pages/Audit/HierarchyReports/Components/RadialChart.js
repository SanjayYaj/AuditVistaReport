import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import _ from "lodash";
import urlSocket from "../../../../helpers/urlSocket";

const RadialChart = ({ userInfo, encrypted_db_url, auditInfo, total_locations }) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});

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
        let totalEntries = _.sumBy(response.data.data, "total") * total_locations;
        let Compliance = _.sum(_.map(response.data.data, "compliance"));
        let Non_Compliance = _.sum(_.map(response.data.data, "non_compliance"));

        setSeries([totalEntries, Compliance, Non_Compliance]);

        setOptions({
          plotOptions: {
            radialBar: {
              dataLabels: {
                name: {
                  fontSize: "15px",
                },
                value: {
                  fontSize: "16px",
                },
                total: {
                  show: true,
                  label: "Total",
                  formatter: () => totalEntries,
                },
              },
            },
          },
          labels: ["Total checkpoints", "Compliant", "Non-Compliant"],
          colors: ["#343a40", "#f46a6a", "#34c38f"],
          legend: {
            show: true,
            floating: true,
            fontSize: "16px",
            position: "left",
            offsetX: -10,
            offsetY: 15,
            labels: {
              useSeriesColors: true,
            },
            markers: {
              size: 0,
            },
            formatter: (seriesName, opts) => `${seriesName}:  ${opts.w.globals.series[opts.seriesIndex]}`,
            itemMargin: {
              vertical: 3,
            },
          },
        });

        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching checkpoint report data:", error);
    }
  };

  return dataLoaded ? (
    <ReactApexChart options={options} series={series} type="radialBar" height="370" className="apex-charts" />
  ) : null;
};

export default RadialChart;
