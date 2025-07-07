import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { retriveClnPrimaryValue, updateLayoutInfo } from '../../../../Slice/reportd3/reportslice';
import { toggleProcessingState, retriveClnPrimaryValue, setResetCharts, updateLayoutInfo} from '../../../../Slice/reportd3/reportslice';

import * as d3 from 'd3';
import html2canvas from 'html2canvas';

const D3Table = (props) => {
  const dispatch = useDispatch();

  const sortOrders = {};
  const [showOptions, setShowOptions] = useState(false)

  var containerWidth = props.containerWidth
  var containerHeight = props.containerHeight
  var chart_data = props.chart_data
  var i = props.id
  var enable_table = props.show_table
  var label_arr = props.label_name

  const [data, setData] = useState([])
  const [TableHeight, setTableHeight] = useState(containerHeight)

  const chartArea = d3.select(`#ChartArea${i}`);
  const noDataDiv = d3.select(`#no-data-message-${i}`);

  var fullScreen_enabled = props.show_Full_Screen_toggle
  var temp_containerWidth = props.temp_containerWidth
  var temp_containerHeight = props.temp_containerHeight

  var dataRetreived = props.itemInfo
  var calc = props.math_calc

  const [yAxisArr, setYAxisArr] = useState([])
  const [colorArr, setColorArr] = useState([])
  const [mergedArr, setmergedArr] = useState([])
  const [combinedArr, setcombinedArr] = useState([]);
  const [yAxisarrMod, setYaxisarrMod] = useState([]);
  const [XaxisValue, setXaxisValue] = useState([]);
  const [selectedXaxisKey, setselectedXaxisKey] = useState("");
  const [YaxisValue, setYaxisValue] = useState([]);
  const [selectedYaxisKey, setselectedYaxisKey] = useState('');
  const [chartsLoad, setChartsLoad] = useState(false)

  const [processing, setProcessing] = useState(false)

  const reportSlice = useSelector(state => state.reportSliceReducer)

  const ProcessedID = reportSlice.processingData[props.id]


  // const dbInfo = {
  //   encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@65.0.69.57:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
  //   db_name: 'hotel_surguru-beta',
  // }
console.log("fullScreen_enabled :>> ", fullScreen_enabled);

  const AuthSlice = useSelector(state => state.auth);
  const dbInfo = AuthSlice.db_info
  useEffect(() => {
    setData([])
    console.log('ProcessedID :>> ', ProcessedID);
    if (ProcessedID === undefined) {


    if (dataRetreived?.yAxis_arr !== undefined && dataRetreived.data === undefined || dataRetreived.chnaged) {
      setProcessing(true)
      setChartsLoad(false)
      setData([])
      dispatch(toggleProcessingState(dataRetreived.i))
      LoadedData(dataRetreived.x_axis_key.name, '1')
    }
    else if (dataRetreived.filtered_data !== undefined) {
      setData(dataRetreived.filtered_data)
      setChartsLoad(true)
    }else{
      setData(dataRetreived.data)
      setChartsLoad(true)

    }
  }






  if (ProcessedID) {
    // console.log(' 115 Already Retyrteived Data ', dataRetreived)
    if (dataRetreived?.filtered_data !== undefined) {
        setData(dataRetreived?.filtered_data)
        setChartsLoad(true)
    }
    else if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined ) {
        setData(dataRetreived.data)
        setChartsLoad(true)
    }
    else {
        setData(dataRetreived.data)
        setChartsLoad(true)
    }

}






  showTableFn(true , chart_data)


  }, [props ,dataRetreived , containerWidth , fullScreen_enabled])


 
const LoadedData = async (value, mode, indx) => {
  console.log(' Table value , mode :>> ', value, mode, indx);
  try {
      if (dataRetreived.selected_cln_name !== undefined) {
          const data = {
              collection_name: dataRetreived.selected_cln_name.cln_name,
              encrypted_db_url: dbInfo.encrypted_db_url,
              db_name: dbInfo.db_name,
              primary_key: {},
              selected_primary_key: value,
              selected_primary_value: {},
              chart_position: mode,

              additional_fields:dataRetreived?.yAxis_arr ,

              mode: "1",
              startDate: reportSlice.startDate,
              endDate: reportSlice.endDate,
              dateFields: AuthSlice?.dateRangeField,
              CalculationArr: dataRetreived.CalculationArr ,



          collection2: "cln_adt_pbd_endpoints",
          collection1: dataRetreived.xaxis_cln.selectedCollection,

          groupingField: dataRetreived.groupingKeys,
          // want to send the level key field for choosing the level values
          level: dataRetreived.groupingValue,

          relationshipdata: reportSlice.pageNodeInfo.relationships,
          chartType:'0' ,
            // categoryField :  dataRetreived.legend_category != undefined ?  dataRetreived.legend_category.name  : '',

          }
          var response = await dispatch(retriveClnPrimaryValue(data))
          console.log('response 108 tableeee :>> ', response);

          if (response.status === 200) {


            if (response.data.data.length > 0) {

              // if (mode === "1") {

                var updating_layObj = { ...dataRetreived };

                updating_layObj.data = response.data.data;
                updating_layObj.chnaged = false
                updating_layObj.configured = true
                console.log('response.data.x_label :>> ', response.data.data);
                setData(response.data.data)
                setChartsLoad(true)

                // Dispatch to Redux
                await dispatch(
                  updateLayoutInfo({
                    index: props.indexes,
                    updatedObject: updating_layObj,
                  })
                )
              // }

             
            }
            else{
              var updating_layObj = { ...dataRetreived };

              updating_layObj.data = response.data.data;
              updating_layObj.chnaged = false
              updating_layObj.configured = true
              setData([])
              setChartsLoad(true)

              // Dispatch to Redux
              await dispatch(
                updateLayoutInfo({
                  index: props.indexes,
                  updatedObject: updating_layObj,
                })
              )
            }
             
          }
      }
  } catch (error) {
      console.log("err", error);
  }
}


  useEffect(() => {
    if (label_arr.length > 0) {
      console.log('data  194:>> ', data);
      if( data !== undefined ){
        const modifiedData = data.map(obj => {
          const newObj = {};
          Object.keys(obj).forEach((key, index) => {
            if (key === '_id') {
              newObj[key] = obj[key];
            } else {
              newObj[label_arr[index - 1]] = obj[key];
            }
          });
          return newObj;
        });
        tabulate(modifiedData, label_arr , fullScreen_enabled)
      }
   
    }

  }, [label_arr , fullScreen_enabled]);


  // if (data?.length !== 0) {
  //   var datakeys = Object.keys(data[0]).filter(key => key !== 'year' && key !== "_id");
  //   var datakeys_name = Object.keys(data[0]).filter(key => key === 'year' && key !== "_id");
  // }

  const margin = { top: 70, right: 30, bottom: 80, left: 40 };
  useEffect(() => {
    var mod_data

    if (reportSlice.layoutInfo[props.indexes]?.configured && reportSlice.layoutInfo[props.indexes].data?.[0]) {
      mod_data = reportSlice.layoutInfo[props.indexes].data;
    }
    else {
      mod_data = chart_data
    }

    if (reportSlice.layoutInfo[props.indexes]?.filtered_data) {
      mod_data = reportSlice.layoutInfo[props.indexes]?.filtered_data
    }
console.log('mod_data :>> ', mod_data , calc);

    if (mod_data) {
      showTableFn(true , mod_data)
    }

  }, [containerWidth, props, data , dataRetreived , calc , temp_containerHeight , fullScreen_enabled])



  const groupData = (val) => {
    const groupedData = Array.from(d3.group(val, d => d.name), ([name, values]) => {
      const aggregated = { name };
      Object.keys(values[0]).forEach(key => {
        if (key !== '_id' && key !== 'name') {
          aggregated[key] = d3.sum(values, v => v[key]);
        }
      });
      return aggregated;
    });

    return groupedData

  }







  const showTableFn = async (val , mod_data) => {
    console.log(' Tabled data :>> ', data , fullScreen_enabled);


   if( mod_data?.length > 0 ){
    const fieldNames = Object.keys(mod_data?.[0]).filter(key => key !== "_id");
    console.log('val :>> ', val);
    if (val) {
      var return_grouped_data = await groupData(mod_data)
      if (return_grouped_data && label_arr.length > 0) {

        const modifiedData = return_grouped_data.map(obj => {
          const newObj = {};
          Object.keys(obj).forEach((key, index) => {
            if (key === '_id') {
              newObj[key] = obj[key];
            } else {
              newObj[label_arr[index]] = obj[key];
            }
          });
          return newObj;
        });

        await tabulate(modifiedData, label_arr , fullScreen_enabled )
      }
      else {

        await tabulate(return_grouped_data, fieldNames , fullScreen_enabled)

      }
    }
    else {
      d3.selectAll(`#tableContainer${i}`).selectAll("table").remove();
    }
   }
  
  }

  const tabulate = async (data, columns, fullScreen_enabled , y_axis_name) => { 
    console.log('fullScreen_enabled :>> ', fullScreen_enabled , fullScreen_enabled ? temp_containerHeight : containerHeight - margin.top);
    const header = columns;
    var data_exist;
    if (data !== undefined) {
      data_exist = data;
    } else {
      data_exist = data;
    }



    var tableContainer = document.getElementById(`tableContainer${i}`);
    if(tableContainer !== null ){
      tableContainer.innerHTML = "";
    }
  
    console.log("width of table ", fullScreen_enabled ? props.temp_containerWidth :  containerWidth);
    var table = d3.select(`#tableContainer${i}`)
      .attr("class", "table-responsive")
      .append("table")
      .style("height", `${ fullScreen_enabled ? temp_containerHeight : containerHeight - margin.top}px`)
      .style("width", `${  fullScreen_enabled ? temp_containerWidth + margin.left + margin.right:  containerWidth}px`);

    var thead = table.append("thead");
    var tbody = table.append("tbody");

    d3.select(tableContainer)
      .attr('class', 'table_body')
      .style("position", "relative")
      .style("height", `${ fullScreen_enabled ? temp_containerHeight + margin.bottom + margin.top  : containerHeight - margin.top}px`)
      .style("width", `${fullScreen_enabled ?  temp_containerWidth + margin.left + margin.right :  containerWidth}px`)
      // .style("margin-left", `${fullScreen_enabled ?   "90px" : "" }`) // Add margin-left here
      .style("overflow-y", "scroll")
      .style("overflow-x", "hidden")
      .style("margin", "0 auto") // Center horizontally
      .style("display", "block"); // Ensure it behaves like a block element


    var originalData = data ? data.slice() : [];
    var temp_order_data


    thead
      .append("tr")
      .selectAll("th")
      .data(header)
      .enter()
      .append("th")
      .text(function (column) {

        return column?.replace(/\b\w/g, function (l) {
          return l.toUpperCase();
        });
      })
      .attr("style", "text-align: center")
      .style('color', 'black')
      .on("click", function (column, event) {
        updateTable(column, event);
      })
      .append("span")
      .html(function (column) {
        var sortClass = sortOrders[column] === 'asc' ? 'ascending' : sortOrders[column] === 'desc' ? 'descending' : 'no-sort';
        var arrowSize = "18px";
        var arrowColor = "blue";
        var iconClass = 'bx bx-sort';

        return '<span class="' + sortClass + ' ' + ((sortOrders[column] != 'asc' && sortOrders[column] != 'desc') ? iconClass : '') + '" style="font-size:' + arrowSize + '; color:' + arrowColor + ';">' +
          (sortOrders[column] === 'asc' ? ' &#x2191;' : sortOrders[column] === 'desc' ? ' &#x2193;' : '') +
          '</span>';
      });

    const updateTable = (column, event) => {
      if (sortOrders[event] === 'asc') {
        sortOrders[event] = 'desc';
      } else if (sortOrders[event] === 'desc') {
        sortOrders[event] = undefined;
      } else {
        sortOrders[event] = 'asc';
      }

      temp_order_data = data_exist.slice();

      var bg = temp_order_data.sort(function (a, b) {
        if (sortOrders[event] === 'asc') {
          return d3.ascending(a[event], b[event]);
        } else if (sortOrders[event] === 'desc') {
          return d3.descending(a[event], b[event]);
        } else {
          return d3.ascending(a[event], b[event]);
        }
      });

      temp_order_data = sortOrders[event] === undefined ? originalData : bg;
      Object.keys(sortOrders).forEach((key) => {
        if (key !== event) {
          sortOrders[key] = undefined;
        }
      });
      updateTableDisplay();
    };


    const updateTableDisplay = () => {
      var rows = tbody.selectAll("tr")
        .data(temp_order_data);
      rows.exit().remove();
      var cells = rows.enter()
        .append("tr")
        .merge(rows)
        .selectAll("td")
        .data(function (row) {
          return columns.map(function (column) {
            return { column: column, value: row[column] };
          });
        });

      cells.enter()
        .append("td")
        .merge(cells)
        .attr("class", function (d) { return "cell " + d.column; })
        .html(function (d) { return d.value; })
        .attr("style", "text-align: center")
        .style('color', 'black');
      thead.selectAll("th").style("color", 'black');

      thead.selectAll("th")
        .style("color", function (column) {
          var sortOrder = sortOrders[column];
          var ascendingColor = "green";
          var descendingColor = "orange";
          return sortOrder === 'asc' ? ascendingColor : sortOrder === 'desc' ? descendingColor : 'black';
        });

      thead.selectAll("th span")
        .html(function (column) {
          var arrowSize = "18px";
          var arrowColor = "green";
          var iconClass = 'bx bx-sort';
          var sortOrder = sortOrders[column];
          var ascendingColor = "green";
          var descendingColor = "orange";
          var color_updt = (sortOrder === 'asc' ? ascendingColor : sortOrder === 'desc' ? descendingColor : 'black');
          var sortClass = sortOrders[column] === 'asc' ? 'ascending' : sortOrders[column] === 'desc' ? 'descending' : 'no-sort';

          return '<span class="' + sortClass + ' ' + ((sortOrders[column] != 'asc' && sortOrders[column] != 'desc') ? iconClass : '') + '" style="font-size:' + arrowSize + '; color:' + color_updt + ';">' +
            (sortOrders[column] === 'asc' ? ' &#x2191;' : sortOrders[column] === 'desc' ? ' &#x2193;' : '') +
            '</span>';
        });

          // Add the total row
    addTotalRow(label_arr.length > 0 ? label_arr : header, data_exist, tbody, thead);

      return table;
    };


    thead.selectAll("th").style("color", 'black');

    var rows = tbody.selectAll("tr")
      .data(data_exist)
      .enter()
      .append("tr");

    var cells = rows.selectAll("td")
      .data(function (row) {
        return columns.map(function (column) {
          return { column: column, value: row[column] };
        });
      })
      .enter()
      .append("td")
      .attr("class", function (d) { return "cell " + d.column; })
      .html(function (d) { return d.value; })
      .attr("style", "text-align: center")
      .style('color', 'black')

    // Add the total row
    addTotalRow(label_arr.length > 0 ? label_arr : header, data_exist, tbody, thead);

    return table;
  }

  const addTotalRow = (columns, data_exist, tbody, thead) => {
    console.log('addTotalRow :>> ', columns, data_exist);
    // Compute totals for each column
    const totals = columns.map((column) => {
      // Check if the column contains numeric values and calculate the sum
      if (data_exist.every((row) => !isNaN(row[column]))) {
        return d3.sum(data_exist, (d) => +d[column]);
      }
      return "Total"; // Leave empty for non-numeric columns
    });

    // Create rows in tbody
    var rows = tbody.selectAll("tr")
      .data(data_exist)
      .enter()
      .append("tr");

    var cells = rows.selectAll("td")
      .data(function (row) {
        return columns.map(function (column) {
          return { column: column, value: row[column] };
        });
      })
      .enter()
      .append("td")
      .attr("class", function (d) { return "cell " + d.column; })
      .html(function (d) { return d.value; })
      .attr("style", "text-align: center")
      .style('color', 'black');

    // Append the total row at the end of the tbody
    var totalRow = tbody.append("tr").attr("class", "total-row");

    totalRow.selectAll("td")
      .data(totals)
      .enter()
      .append("td")
      .html((total) => total !== "" ? `<strong>${total}</strong>` : "")
      .attr("style", (d) => {
        return d !== ""
          ? "text-align: center; font-weight: bold; background-color: lightblue; color: black;"
          : "text-align: center; background-color: white; color: gray;";
      });

    // Apply sticky style to the total row in the tbody
    d3.select(".total-row")
      .style("position", "sticky")
      .style("bottom", "0px") // Keep it at the bottom of the scrollable area
      .style("z-index", "1")
      .style("background-color", "white") // You can adjust the background color
      .style("border-top", "2px solid #ccc");

  };


  return (
    <div onMouseLeave={() => { setShowOptions(false) }}>
    
      <div id={`no-data-message-${i}`}
        style={{
          display: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '16px',
          color: 'grey'
        }}
      >
        No data available
      </div>

      {
        chartsLoad ?

          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            top: '40px',
            backgroundColor: '#fff',
          }} id={`tableContainer${i}`}>
          </div>
          :
          <div className="chart-skeleton" style={{ width: containerWidth, height: containerHeight }}>
          {/* <div className="skeleton-title"></div> */}
          <div className="skeleton-chart" style={{ width: containerWidth * 0.8, height: containerHeight * 0.8 }}>
              <div className="skeleton-bar" style={{ height: "40%" }}></div>
              <div className="skeleton-bar" style={{ height: "70%" }}></div>
              <div className="skeleton-bar" style={{ height: "50%" }}></div>
              <div className="skeleton-bar" style={{ height: "80%" }}></div>
              <div className="skeleton-bar" style={{ height: "60%" }}></div>
          </div>
      </div>
      }
     

    </div>
  );
};

export default D3Table;















// Existing
// import React, { useRef, useEffect, useState } from 'react';
// import * as d3 from 'd3';
// import html2canvas from 'html2canvas';
// import { useSelector } from 'react-redux';


// const D3Table = (props) => {
//   const sortOrders = {};
//   const [showOptions, setShowOptions] = useState(false)

//   var containerWidth = props.containerWidth
//   var containerHeight = props.containerHeight
//   var chart_data = props.chart_data
//   console.log('chart_data_table', chart_data)
//   var i = props.id
//   var enable_table = props.show_table
//   var label_arr = props.label_name

//   const [data, setData] = useState(chart_data)
//   const [TableHeight, setTableHeight] = useState(containerHeight)

//   const downloadStatus = useSelector(state => state.reportSliceReducer.downloadStatus);


//   useEffect(() => {
//     if (chart_data !== undefined && chart_data.length > 0) {
//       setData(chart_data)
//       setTableHeight(containerHeight)
//       if (enable_table) {
//         showTableFn(true)
//       }
//       else {
//         showTableFn(false)
//       }
//     }
//   }, downloadStatus ? [] : [chart_data, enable_table, containerHeight, TableHeight, containerWidth])


//   useEffect(() => {

//     if (label_arr.length > 0) {
//       const modifiedData = data.map(obj => {
//         const newObj = {};
//         Object.keys(obj).forEach((key, index) => {
//           if (key === '_id') {
//             newObj[key] = obj[key];
//           } else {
//             newObj[label_arr[index - 1]] = obj[key];
//           }
//         });
//         return newObj;
//       });
//       tabulate(modifiedData, label_arr)
//     }

//   }, [label_arr]);


//   if (props.chart_data.length !== 0) {
//     var datakeys = Object.keys(props.chart_data[0]).filter(key => key !== 'year' && key !== "_id");
//     var datakeys_name = Object.keys(props.chart_data[0]).filter(key => key === 'year' && key !== "_id");
//   }

//   const margin = { top: 70, right: 30, bottom: 80, left: 40 };
//   useEffect(() => {
//     if (chart_data.lenght > 0) {
//       showTableFn(true)
//     }

//   }, [chart_data, containerWidth])

//   const handleMenuClick = (e) => {
//     setShowOptions(!showOptions);
//   };

//   const handleDownloadBar = (value) => {
//     datakeys_name
//     const newKeys = {
//       label: datakeys_name,
//       value: datakeys,
//     };
//     const renamedData = data.map(obj => renameKeys(obj, newKeys));
//     if (value === "0") {
//       const datas = renamedData.map(obj => {
//         const { _id, ...rest } = obj;
//         return rest
//       })
//       const csv = convertToCSV(datas);
//       const blob = new Blob([csv], { type: 'text/csv' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'table.csv';
//       a.click();
//       URL.revokeObjectURL(url);
//     }
//     else {
//       const data1 = data.filter(item => item !== null);
//       const data = data1;
//       const csv = convertToCSV(data);
//       const blob = new Blob([csv], { type: 'text/csv' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'table.csv';
//       a.click();
//       URL.revokeObjectURL(url);
//     }
//   }

//   function convertToCSV(data) {
//     const header = Object.keys(data[0]).join(',') + '\n';
//     const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
//     return header + rows;
//   }

//   const renameKeys = (obj, newKeys) => {
//     const keyEntries = Object.entries(obj);
//     const renamedObj = keyEntries.reduce((acc, [key, value]) => {
//       const newKey = newKeys[key] || key;
//       acc[newKey] = value;
//       return acc;
//     }, {});
//     return renamedObj;
//   };

//   const imgDownloadSvg = async (id) => {
//     const tableContainer = document.getElementById(id);
//     if (!tableContainer) {
//       console.error("Table container not found");
//       return;
//     }

//     const originalOverflow = tableContainer.style.overflow;
//     const clonedTable = document.createElement('table');
//     clonedTable.classList.add('table-responsive');
//     clonedTable.style.position = 'absolute';
//     clonedTable.style.left = '-9999px';
//     clonedTable.style.height = `${containerHeight - margin.top}px`;
//     clonedTable.style.width = `${containerWidth}px`;
//     const clonedThead = document.createElement('thead');
//     clonedTable.appendChild(clonedThead);
//     const clonedTbody = document.createElement('tbody');
//     clonedTable.appendChild(clonedTbody);
//     const originalThead = tableContainer.querySelector('thead');
//     clonedThead.innerHTML = originalThead.innerHTML;
//     const originalTbody = tableContainer.querySelector('tbody');
//     clonedTbody.innerHTML = originalTbody.innerHTML;
//     tableContainer.style.overflow = 'hidden';
//     document.body.appendChild(clonedTable);


//     try {
//       const canvas = await html2canvas(clonedTable);
//       const imgData = canvas.toDataURL('image/png');
//       tableContainer.style.overflow = originalOverflow;
//       const downloadLink = document.createElement("a");
//       downloadLink.href = imgData;
//       downloadLink.download = "table.png";
//       downloadLink.click();
//       document.body.removeChild(clonedTable);

//     } catch (error) {
//       console.error("Error capturing table as image:", error);
//       tableContainer.style.overflow = originalOverflow;
//     }
//   };


//   const showTableFn = async (val) => {
//     const fieldNames = Object.keys(chart_data[0]).filter(key => key !== "_id");
//     if (val) {
//       await tabulate(chart_data, fieldNames)
//     }
//     else {
//       d3.selectAll(`#tableContainer${i}`).selectAll("table").remove();
//     }
//   }

//   const tabulate = async (data, columns, y_axis_name) => {
//     const header = columns;
//     var data_exist;
//     if (data !== undefined) {
//       data_exist = data;
//     } else {
//       data_exist = data;
//     }

//     var tableContainer = document.getElementById(`tableContainer${i}`);
//     tableContainer.innerHTML = "";
//     var table = d3.select(`#tableContainer${i}`)
//       .attr("class", "table-responsive")
//       .append("table")
//       .style("height", `${containerHeight - margin.top}px`)
//       .style("width", `${containerWidth}px`);

//     var thead = table.append("thead");
//     var tbody = table.append("tbody");

//     d3.select(tableContainer)
//       .attr('class', 'table_body')
//       .style("position", "relative")
//       .style("height", `${containerHeight - margin.top}px`)
//       .style("width", `${containerWidth}px`)

//       .style("overflow-y", "scroll")
//       .style("overflow-x", "hidden");


//     var originalData = data ? data.slice() : [];
//     var temp_order_data


//     thead
//       .append("tr")
//       .selectAll("th")
//       .data(header)
//       .enter()
//       .append("th")
//       .text(function (column) {

//         return column?.replace(/\b\w/g, function (l) {
//           return l.toUpperCase();
//         });
//       })
//       .attr("style", "text-align: center")
//       .style('color', 'black')
//       .on("click", function (column, event) {
//         updateTable(column, event);
//       })
//       .append("span")
//       .html(function (column) {
//         var sortClass = sortOrders[column] === 'asc' ? 'ascending' : sortOrders[column] === 'desc' ? 'descending' : 'no-sort';
//         var arrowSize = "18px";
//         var arrowColor = "blue";
//         var iconClass = 'bx bx-sort';

//         return '<span class="' + sortClass + ' ' + ((sortOrders[column] != 'asc' && sortOrders[column] != 'desc') ? iconClass : '') + '" style="font-size:' + arrowSize + '; color:' + arrowColor + ';">' +
//           (sortOrders[column] === 'asc' ? ' &#x2191;' : sortOrders[column] === 'desc' ? ' &#x2193;' : '') +
//           '</span>';
//       });

//     const updateTable = (column, event) => {
//       if (sortOrders[event] === 'asc') {
//         sortOrders[event] = 'desc';
//       } else if (sortOrders[event] === 'desc') {
//         sortOrders[event] = undefined;
//       } else {
//         sortOrders[event] = 'asc';
//       }

//       temp_order_data = data_exist.slice();

//       var bg = temp_order_data.sort(function (a, b) {
//         if (sortOrders[event] === 'asc') {
//           return d3.ascending(a[event], b[event]);
//         } else if (sortOrders[event] === 'desc') {
//           return d3.descending(a[event], b[event]);
//         } else {
//           return d3.ascending(a[event], b[event]);
//         }
//       });

//       temp_order_data = sortOrders[event] === undefined ? originalData : bg;
//       Object.keys(sortOrders).forEach((key) => {
//         if (key !== event) {
//           sortOrders[key] = undefined;
//         }
//       });
//       updateTableDisplay();
//     };


//     const updateTableDisplay = () => {
//       var rows = tbody.selectAll("tr")
//         .data(temp_order_data);
//       rows.exit().remove();
//       var cells = rows.enter()
//         .append("tr")
//         .merge(rows)
//         .selectAll("td")
//         .data(function (row) {
//           return columns.map(function (column) {
//             return { column: column, value: row[column] };
//           });
//         });
//       cells.enter()
//         .append("td")
//         .merge(cells)
//         .attr("class", function (d) { return "cell " + d.column; })
//         .html(function (d) { return d.value; })
//         .attr("style", "text-align: center")
//         .style('color', 'black');
//       thead.selectAll("th").style("color", 'black');

//       thead.selectAll("th")
//         .style("color", function (column) {
//           var sortOrder = sortOrders[column];
//           var ascendingColor = "green";
//           var descendingColor = "orange";
//           return sortOrder === 'asc' ? ascendingColor : sortOrder === 'desc' ? descendingColor : 'black';
//         });

//       thead.selectAll("th span")
//         .html(function (column) {
//           var arrowSize = "18px";
//           var arrowColor = "green";
//           var iconClass = 'bx bx-sort';
//           var sortOrder = sortOrders[column];
//           var ascendingColor = "green";
//           var descendingColor = "orange";
//           var color_updt = (sortOrder === 'asc' ? ascendingColor : sortOrder === 'desc' ? descendingColor : 'black');
//           var sortClass = sortOrders[column] === 'asc' ? 'ascending' : sortOrders[column] === 'desc' ? 'descending' : 'no-sort';

//           return '<span class="' + sortClass + ' ' + ((sortOrders[column] != 'asc' && sortOrders[column] != 'desc') ? iconClass : '') + '" style="font-size:' + arrowSize + '; color:' + color_updt + ';">' +
//             (sortOrders[column] === 'asc' ? ' &#x2191;' : sortOrders[column] === 'desc' ? ' &#x2193;' : '') +
//             '</span>';
//         });

//       return table;
//     };


//     thead.selectAll("th").style("color", 'black');

//     var rows = tbody.selectAll("tr")
//       .data(data_exist)
//       .enter()
//       .append("tr");

//     var cells = rows.selectAll("td")
//       .data(function (row) {
//         return columns.map(function (column) {
//           return { column: column, value: row[column] };
//         });
//       })
//       .enter()
//       .append("td")
//       .attr("class", function (d) { return "cell " + d.column; })
//       .html(function (d) { return d.value; })
//       .attr("style", "text-align: center")
//       .style('color', 'black')
//     return table;
//   }

//   return (
//     <div>
     
//       <div style={{ position: 'absolute', bottom: 0, left: 0, top: '40px', backgroundColor: '#fff', }} id={`tableContainer${i}`}> </div>

//     </div>
//   );
// };

// export default D3Table;