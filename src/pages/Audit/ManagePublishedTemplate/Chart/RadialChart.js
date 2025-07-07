import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import urlSocket from "../../../../helpers/urlSocket";
import _ from "lodash";
import moment from "moment";

const RadialChart = ({ userInfo, encrypted_db_url, auditInfo, total_locations }) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    const getCheckpointReportData = async () => {
      try {
        const response = await urlSocket.post("webpbdadtdta/getCNCreport", {
          userInfo: {
            _id: userInfo._id,
          },
          encrypted_db_url: encrypted_db_url,
          auditInfo: auditInfo,
        });

        if (response.data.response_code === 500) {
          let totalEnties = _.sumBy(response.data.data, "total");
          totalEnties = totalEnties * total_locations;

          const Compliance = _.sumBy(response.data.data, "compliance");
          const Non_Compliance = _.sumBy(response.data.data, "non_compliance");

          setSeries([totalEnties, Compliance, Non_Compliance]);
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
                    formatter: function () {
                      return totalEnties;
                    },
                  },
                },
              },
            },
            labels: ["Total checkpoints", "Complaint", "Non Complaint"],
            colors: ["#343a40", "#34c38f", "#f46a6a"],
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
              formatter: function (seriesName, opts) {
                return `${seriesName}:  ${opts.w.globals.series[opts.seriesIndex]}`;
              },
              itemMargin: {
                vertical: 3,
              },
            },
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

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height="370"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default RadialChart;















// import React, { Component } from "react"
// import ReactApexChart from "react-apexcharts"

// const _ = require('lodash')

// // var urlSocket = require("../../../helpers/urlSocket")
// import urlSocket from "../../../../helpers/urlSocket"
// var moment = require('moment')

// class RadialChart extends Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//      dataLoaded:false
//     }
//     this.getCheckpointReportData()
//   }

//   getCheckpointReportData() {

//     var userInfo = this.props.userInfo
//     console.log(this.props,'this.propss')

//     try {
//       urlSocket.post("webpbdadtdta/getCNCreport", {
//         userInfo: {
//           _id: userInfo._id,
//           user_code: userInfo.user_code,
//           company_id: userInfo.company_id,
//         },
//         encrypted_db_url : this.props.encrypted_db_url,
//         auditInfo: this.props.auditInfo
//       })
//         .then(response => {
//           console.log(response,'response')
//           if (response.data.response_code === 500) {
//             var totalEnties = _.sumBy(response.data.data, "total")
//             totalEnties= (totalEnties * this.props.total_locations)
//             // var totalEnties = response.data.data.length
//             var Compliance = _.sum(_.map(response.data.data, "compliance"))
//             var Non_Compliance = _.sum(_.map(response.data.data, "non_compliance"))

//             this.setState({
//               series: [totalEnties, Compliance, Non_Compliance],
//               options: {
//                 plotOptions: {
//                   radialBar: {
//                     dataLabels: {
//                       name: {
//                         fontSize: "15px",
//                       },
//                       value: {
//                         fontSize: "16px",
//                       },
//                       total: {
//                         show: true,
//                         label: "Total",
//                         formatter: function (w) {
//                           // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
//                           return totalEnties
//                         },
//                       },
//                     },
//                   },
//                 },
        
//                 labels: ["Total checkpoints", "Complaint", "Non Complaint"],
//                 colors: ["#343a40","#34c38f", "#f46a6a" ],
//                 legend: {
//                   show: true,
//                   floating: true,
//                   fontSize: '16px',
//                   position: 'left',
//                   offsetX: -10,
//                   offsetY: 15,
//                   labels: {
//                     useSeriesColors: true,
//                   },
//                   markers: {
//                     size: 0
//                   },
//                   formatter: function(seriesName, opts) {
//                     return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
//                   },
//                   itemMargin: {
//                     vertical: 3
//                   }
//                 },
//               },
//               dataLoaded:true
//             })
//           }
//         })
//     } catch (error) {
//       console.log("catch error", error)
//     }
//   }
//   render() {
//     if(this.state.dataLoaded)
//     {
//     return (
//       <React.Fragment>
//         <ReactApexChart
//           options={this.state.options}
//           series={this.state.series}
//           type="radialBar"
//           height="370"
//           className="apex-charts"
//         />
//       </React.Fragment>
//     )
//     }
//     else
//     {
//       return null
//     }
//   }
// }

// export default RadialChart
