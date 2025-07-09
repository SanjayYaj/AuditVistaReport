import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'reactstrap';
import { toggleProcessingState, retriveClnPrimaryValue, setResetCharts, updateLayoutInfo, sortFunc, sortDescending } from '../../../../Slice/reportd3/reportslice';
import '../../LayoutInfo.css'
import { min } from 'lodash';
import RelationshipModal from '../Relationship';
import urlSocket from '../../../../helpers/urlSocket';

const D3Stack_bar_chart = (props) => {
  const dispatch = useDispatch();
  var containerWidth = props.containerWidth
  var containerHeight = props.containerHeight
  var chart_data = props.chart_data
  var svgHeight = props.chart_height
  var BarWidth = props.BarWidth
  var chart_color = props.chart_color
  var i = props.id
  var show_bar_values = props.show_bar_values
  var mouseovered = props.mouseovered
  // var mouseovered_type = props.mouseovered_type
  var mouseovered_type = props.mouseovered_type !== undefined && props.mouseovered_type === 'single' ? false : true

  var enable_table = props.show_table
  var xLabel = 'Name'
  var show_Grid = props.show_Grid
  var show_Line = props.show_Line
  var temp_containerWidth = props.temp_containerWidth
  var temp_containerHeight = props.temp_containerHeight
  var fullScreen_enabled = props.show_Full_Screen_toggle
  var show_Square = props.show_Square !== undefined &&  props.show_Square === 'square' ? true : false
  var curved_line = props.curved_line;
  var YLabel = props.YLabel
  var resized = props.resized
  var text_color_arr = props.text_color
  var barLabel = props.label !== null ? props.label : 'label';

  var dataRetreived = props.itemInfo
  var show_Legend = props.show_Legend

  var calc = props.math_calc
  console.log('dataRetreived.containerHeight Stack bar',  dataRetreived , dataRetreived.legend_category)



  var choosedColors = dataRetreived.ColorMapping 

  // console.log('choosedColoras for Stack', choosedColors)

  const chartRef = useRef();
  const [data, setData] = useState(chart_data);
  const [text_Color_bar, Set_text_Color_bar] = useState([])
  const [showOptions, setShowOptions] = useState(false)
  const [showvalues, setshowvalues] = useState(show_bar_values);
  const [mouseover_enabled, setmouseover_enabled] = useState(mouseovered)
  const [mouseover_switch_type, setmouseover_switch_type] = useState(mouseovered_type)
  const [enabled_table, setenabled_table] = useState(enable_table)
  const [showDiv, setshowDiv] = useState(false)
  const [show_grid_enabled, setshow_grid_enabled] = useState(show_Grid);
  const [sortshowOptions, setshowsortoption] = useState(false);
  const [sortingField, setSortingField] = useState(null);
  const [chart_height, setchart_height] = useState(svgHeight)
  const [showLine, setShowLine] = useState(true);
  const [chartWidth, setChrtWidth] = useState(BarWidth === undefined ? containerWidth : '200')
  const reportSlice = useSelector(state => state.reportSliceReducer);

  const LayoutArray = useSelector(state => state.LayoutArray);
  console.log('reportSlice :>> ', reportSlice);

  const [sortdata, setsortdata] = useState([]);
  const [dataload, setDataload] = useState(false);

  const [chartsLoad, setChartsLoad] = useState(true)

  const [processing, setProcessing] = useState(false)



  // const dbInfo = {
  //   encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@65.0.69.57:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
  //   db_name: 'hotel_surguru-beta',
  // }

  // const reportSlice = useSelector(state => state.reportSliceReducer)
  const ProcessedID = reportSlice.processingData[props.id]

  const selectedsortredux = useSelector(state => state.reportSliceReducer.selectedsortredux);
  const selectedvalueRedux= useSelector(state => state.reportSliceReducer.selectedValues);
  // console.log('selectedvalueRedux Stack :>> ', selectedvalueRedux);
  const AuthSlice = useSelector(state => state.auth);
  const dbInfo = AuthSlice.db_info

  
  const {reportDB} = useSelector((state) => state.auth)
  console.log(' reportSlice.queryFilter stacks :>> ',  reportSlice.queryFilter);

  var queryFilter = reportSlice.queryFilter
  console.log(' reportSlice.queryFilter :>> ',  reportSlice.queryFilter);

  useEffect(() => {
    console.log('Stack Updated Query', queryFilter)
    setProcessing(true)
    setChartsLoad(false)
    dispatch(toggleProcessingState(dataRetreived.i))
    LoadedData(dataRetreived.x_axis_key?.name, '1')
  }, [queryFilter])


  useEffect(() => {
    // console.log("73 Stack chart", dataRetreived, processing);


    if (ProcessedID === undefined) {
      if (dataRetreived?.yAxis_arr !== undefined && dataRetreived.data === undefined || dataRetreived.chnaged) {
        setProcessing(true)
        setChartsLoad(false)
        dispatch(toggleProcessingState(dataRetreived.i))
        LoadedData(dataRetreived.x_axis_key.name, '1')
      }
      else if (dataRetreived?.filtered_data !== undefined) {
        setData(dataRetreived?.filtered_data)
      } else {
        setData(dataRetreived.data)
        setChartsLoad(true)

      }





    }

    if (ProcessedID) {
      // console.log('121 Already Retyrteived Data ', dataRetreived)
      if (dataRetreived?.filtered_data !== undefined) {
        setData(dataRetreived?.filtered_data)
        setChartsLoad(true)
      }
      // else {
      //   setData(dataRetreived.data)
      //   setChartsLoad(true)
      // }
      else if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined && dataRetreived.data?.[0]?.[calc]) {
        setData(dataRetreived.data)
        setChartsLoad(true)
      }
      else {
        setData(dataRetreived.data)
        setChartsLoad(true)
      }

    }

    if (props.show_table) {
      show_table_fn(true, dataRetreived.data)
    }
    else {
      show_table_fn(false)
    }

  }, [props, dataRetreived])




  useEffect(() => {
    if (data !== undefined && data.length > 0) {
      // setData(data[0][calc])
      setshowvalues(show_bar_values)
      setshow_grid_enabled(show_Grid)
      setmouseover_enabled(mouseovered)
      setmouseover_switch_type(mouseovered_type)
      // setShowLine(showline)
      // setEnabledTable(enable_table)
      // setchartHeight(svgHeight)
      // setShowGridenabled(show_Grid)
      // setChartWidth(BarWidth)
      // sethandlefullscreen(fullScreen_enabled) 

    }
  }, [chartsLoad, mouseovered, enable_table, svgHeight, show_Grid, temp_containerWidth, fullScreen_enabled, temp_containerHeight, show_bar_values, BarWidth, mouseovered_type, containerWidth])





  async function buildAdditionalFields(yAxis_arr, yAxis_Selectd_Cln, CalculationArr) {
    return yAxis_arr.map((field, i) => {
      const collection = yAxis_Selectd_Cln[i]?.label || yAxis_Selectd_Cln[i]?.value;
      const calc = CalculationArr[i] || "count";
      return { field, collection, calc: calc.toLowerCase() };
    }).filter(entry => entry.field && entry.collection && entry.calc);
  }



  const LoadedData = async (value, mode, indx) => {
    console.log(' Stack value , mode :>> ', dataRetreived , reportSlice.pageNodeInfo?.relationships);
    try {

      const addon = await buildAdditionalFields(dataRetreived.yAxis_arr, dataRetreived.yAxis_Selectd_Cln, dataRetreived.CalculationArr);
      console.log('addon :>> ', addon);

    

      // 🏷️ Handle category field if exists
      let categoryQuery = [];
      const categoryField = dataRetreived?.legend_category?.name || '';
      if (categoryField) {
        categoryQuery.push({
          field: categoryField,
          collection: dataRetreived.xaxis_cln.selectedCollection,
        });
      }
      console.log('categoryQuery :>> ', categoryQuery);


      let filters = [];

      if (queryFilter) {
        console.log("queryFilter")


        const collectionName = dataRetreived.xaxis_cln.selectedCollection ;

        for (const field in queryFilter) {
          const checkedValues = queryFilter[field]
            .filter(item => item.is_checked)
            .map(item => item.value);
        
          if (checkedValues.length > 0) {
            filters.push({
              field,
              value: checkedValues,
              collection: collectionName
            });
          }
        }
        
        console.log("Filteres Mod", filters);
    }
    
      if (dataRetreived.selected_cln_name !== undefined) {
        const data = {
          collection_name: dataRetreived.selected_cln_name.cln_name,
          encrypted_db_url: reportDB.encrypted_db_url,
          db_name: reportDB.db_name,
          primary_key: {},
          selected_primary_key: value,
          selected_primary_value: {},
          chart_position: mode,

          // additional_fields: dataRetreived?.yAxis_arr,
          additional_fields : addon ,

          mode: "1",
          // startDate: reportSlice.startDate,
          // endDate: reportSlice.endDate,
          // dateFields: AuthSlice?.dateRangeField,
          CalculationArr: dataRetreived.CalculationArr,

          collection2: dataRetreived.yAxis_Selectd_Cln[0] , 
          collection1: dataRetreived.xaxis_cln.selectedCollection,

          groupingField: dataRetreived.groupingKeys,
          // want to send the level key field for choosing the level values
          level: dataRetreived.groupingValue,

          relationshipdata: reportSlice?.pageNodeInfo?.relationships,
          chartType: '1',

          collections: reportSlice.pageNodeInfo.selected_cln_name,
          // categoryField: dataRetreived.legend_category != undefined ? dataRetreived.legend_category.name : '',
          // categoryField :   [{ field : 'cp_option_selected' , collection : 'cln_adt_pbd_ep_checkpoints' }],
         
         
          // categoryField :[{ field : 'audit_status_name' , collection : 'cln_adt_pbd_endpoints' }],
          categoryField : categoryQuery ,
          chartName: dataRetreived.name,
          collections: reportSlice.pageNodeInfo.selected_cln_name ,


          filters



        }


            console.log('data  req for Stack chart :>> ', data);

        const response = await urlSocket.post("report/retrive-stackedchart-data", data)
        console.log('response  Stackchart:>> ', response);




        // var response = await dispatch(retriveClnPrimaryValue(data))
        // console.log('response 108 stacks :>> ', response);

        if (response) {


          if (response.data.data.length > 0) {

            if (mode === "1") {

              var updating_layObj = { ...dataRetreived };

              updating_layObj.data = response.data.data;
              updating_layObj.chnaged = false
              updating_layObj.configured = true
              console.log('response.data.x_label :>> ', response.data.data);




              if (selectedsortredux[dataRetreived.i]) {
                console.log('ProcessedID Already Sort type is', selectedsortredux[dataRetreived.i])
                if (selectedsortredux[dataRetreived.i] === 'accending') {
                  console.log('Ascending ', response.data.data, selectedvalueRedux);
                  dispatch(sortFunc({ data: response.data.data, arrValues: selectedvalueRedux[dataRetreived.i], chart_id: dataRetreived.i }));
                }
                else if (selectedsortredux[dataRetreived.i] === 'decending') {
                  console.log('Descending', response.data.data, selectedvalueRedux);
                  dispatch(sortDescending({ data: response.data.data, arrValues: selectedvalueRedux[dataRetreived.i], chart_id: dataRetreived.i }));

                }
                else {
                  console.log('Default');
                  // dispatch(sortInfo({ data: response.data.data, chart_id: dataRetreived.i }));
                }
              }







              setData(response.data.data)
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
          else {
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



  // useEffect(() => {
  //   // if (chart_data !== undefined && chart_data.length > 0) {
  //   // setData(chart_data)
  //   Set_text_Color_bar(chart_color)
  //   setshowvalues(show_bar_values)
  //   setmouseover_enabled(mouseovered)
  //   setmouseover_switch_type(mouseovered_type)
  //   setenabled_table(enable_table)
  //   setshow_grid_enabled(show_Grid)
  //   setShowLine(show_Line)
  //   setchart_height(svgHeight)
  //   // }

  // },
  //   [props]
  // )


  // if (data && Array.isArray(data) && data?.length > 0) {
  //   // if (data && Array.isArray(data) && data?.length > 0) {
  //   console.log('data 189', data);
  //   // var datakeys = Object.keys( data[0]['sum'] !== undefined ? data[0]['sum'][0] : data[0]).filter(key => key['sum'] !== 'year' && key['sum'] !== "_id");
  //   var datakeys = Object.keys( data[0][calc] !== undefined ? data[0][calc][0] : data[0]).filter(key => key !== 'year' && key !== "_id");

  //   console.log('datakeys 191:>> ', datakeys);
  //   console.log('data[0] :>> ', data[0]);




  //   var datakeys_name = Object.keys(data[0]).filter(key => key === 'year' && key !== "_id");
  // }




  if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined) {
    // console.log('data 278', data, dataRetreived);
    if (data?.[0] !== undefined) {
      // var datakeys = Object.keys(data[0] !== undefined ? data[0] : data[0]).filter(key => key !== 'name' && key !== "_id");

      var datakeys = Array.from(
        new Set(
          data.flatMap(obj => Object.keys(obj).filter(key => key !== 'name' && key !== '_id'))
        )
      );
      

      // console.log('datakeys 280:>> ', datakeys);
    }
  }
  else {
    // console.log('data 284', props.chart_data);
    var datakeys = Object.keys(props.chart_data.length > 0 && props.chart_data[0]).filter(key => key !== 'name' && key !== "_id");
    // console.log('datakeys 293:>> ', datakeys);
  }



  //   if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined && dataRetreived.data?.[0]?.[calc]) {
  //     console.log('data 278', data, dataRetreived);
  //     if (dataRetreived.data[0][calc][0] !== undefined) {
  //         var datakeys = Object.keys(dataRetreived.data[0][calc] !== undefined ? dataRetreived.data[0][calc][0] : dataRetreived.data[0]).filter(key => key !== 'year' && key !== "_id");
  //         console.log('datakeys 280:>> ', datakeys);
  //     }
  // }
  // else {
  //     console.log('data 284', props.chart_data);
  //     var datakeys = Object.keys(props.chart_data.length > 0 &&  props.chart_data[0]).filter(key => key !== 'year' && key !== "_id");
  //     console.log('datakeys 293:>> ', datakeys);
  // }


  const margin = { top: 70, right: 80, bottom: 80, left: 80 };
  function compressDataPerBar(data, topN = 30) {
    return data.map(item => {
      const { name, ...rest } = item;
      const entries = Object.entries(rest);
      
      // Sort keys by descending value
      const sorted = entries.sort((a, b) => b[1] - a[1]);
      
      const top = sorted.slice(0, topN);
      const others = sorted.slice(topN);
  
      const topObj = Object.fromEntries(top);
      const othersSum = others.reduce((sum, [_, val]) => sum + val, 0);
  
      if (othersSum > 0) topObj["Others"] = othersSum;
  
      return { name, ...topObj };
    });
  }
  

  useEffect(() => {
    var mod_data;
    var chart_id = i;
    // console.log("datakeysdatakeys", datakeys)
    if (datakeys !== undefined) {
      const marginTop = margin.top;
      const marginRight = margin.right;
      const marginBottom = margin.bottom;
      const marginLeft = margin.left;

      var sortSlice = reportSlice[chart_id]?.sortedData;
      // console.log('sortSlice :>> ', sortSlice);
      if (sortSlice && sortSlice.length !== 0) {
        mod_data = sortSlice;
      }
      else if (reportSlice.layoutInfo[props.indexes]?.configured && reportSlice.layoutInfo[props.indexes].data?.[0]) {
        mod_data = reportSlice.layoutInfo[props.indexes].data
      }
      else {
        mod_data = chart_data
      }




      if (reportSlice.layoutInfo[props.indexes]?.filtered_data) {
        mod_data = reportSlice.layoutInfo[props.indexes]?.filtered_data
      }

      // const MAX_BARS = 60;
      // let truncated_data = mod_data.length > MAX_BARS ? mod_data.slice(0, MAX_BARS) : mod_data;
      
      // if (mod_data.length > MAX_BARS) {
      //   console.warn(`Rendering truncated data: showing only first ${MAX_BARS} of ${mod_data.length} records.`);
      // }
      
      // mod_data = truncated_data





      //  else {
      //   mod_data = data;
      // }

      // console.log('mod_data216 :>> ', mod_data);

      // if (mod_data[0][calc] !== undefined) {
      //   mod_data = mod_data[0][calc]
      // }
      // if (props.repeat_chart === false) {
      //   var updt_data = groupData(mod_data)
      //   mod_data = updt_data
      // }


      if (mod_data !== undefined && mod_data.length > 0) {

// mod_data   = [
//   {
//       "name": '2010',
//       "value1": 20,
//       "value2": 170,
//       "value3": 90
//   },
//   {
//       "name": '2011',
//       "value1": 40,
//       "value2": 20,
//       "value3": 50
//   },
//   {
//       "name": '2012',
//       "value1": 10,
//       "value2": 30,
//       "value3": 20
//   },
//   {
//       "name": '2013',
//       "value1": 60,
//       "value2": 40,
//       "value3": 10
//   },
//   {
//       "name": '2014',
//       "value1": 30,
//       "value2": 50,
//       "value3": 40
//   },
//   {
//       "name": '2015',
//       "value1": 50,
//       "value2": 30,
//       "value3": 60
//   }
// ]

        if (svgHeight !== undefined && svgHeight !== '') {
          containerHeight = containerHeight - 200
        }
        else {
          containerHeight = containerHeight
        }
        var width
        var height

        if (fullScreen_enabled !== undefined && fullScreen_enabled !== false) {
          width = temp_containerWidth - margin.left - margin.right;
          // height = temp_containerHeight  - margin.bottom - (enabled_table ? 200 : 0)
          // containerHeight = temp_containerHeight - (enabled_table ? 200 : 0)
          height = temp_containerHeight + margin.top + margin.bottom - (enable_table ? 200 : 0)
          containerHeight = height + margin.top
          containerWidth = temp_containerWidth
        }
        else {
          width = containerWidth - margin.left - margin.right;
          height = containerHeight - margin.top - margin.bottom;
        }
        const temp_barWidth = (BarWidth !== undefined ? Number(BarWidth) : 150)


        // containerWidth = BarWidth !== undefined ? mod_data.length * temp_barWidth : props.containerWidth
        // containerWidth = fullScreen_enabled ? (BarWidth !== undefined ? mod_data.length * temp_barWidth : temp_containerWidth) : containerWidth



        containerWidth = temp_containerWidth !== undefined ? temp_containerWidth + 200 : containerWidth


        if (fullScreen_enabled) {
          containerHeight = temp_containerHeight !== undefined ? temp_containerHeight + margin.bottom  + margin.top- (enable_table ? 200 : 0) : containerHeight
      }
      else {
          containerHeight = containerHeight 
      }


      
        // console.log('containerHeight :>> ', containerHeight);

        const x = d3.scaleBand()
          .domain(mod_data.map(d => d.name))  
          // .range([0, containerWidth - margin.left - margin.right])
          .range([marginLeft, containerWidth - marginRight]) //containerWidth
          .padding(0.1);


          const allSums = mod_data.map(d => d3.sum(datakeys.map(key => d[key])));

// console.log("All summed values:", allSums);  // Debug negative values

// const minValue =d3.min(data, d => d3.min(datakeys, key => +d[key]));
// const maxValue =d3.max(data, d => d3.max(datakeys, key => d[key]));

// console.log('minValue', 'maxValue' , "::::::::::::::::::::____" , mod_data  , datakeys , "maxxxx", d3.max(mod_data, d => d3.sum(datakeys.map(key => d[key]))));

      
          // console.log("444444",  d3.max(mod_data, d => d3.sum(datakeys.map(key => d[key]))) ,  d3.min(mod_data, d => d3.sum(datakeys.map(key => +d[key])))  )
        const y = d3.scaleLinear()
          .domain([ 0 , d3.max(mod_data, d => d3.sum(datakeys.map(key => d[key])))])
          .nice()
          .range([containerHeight - margin.bottom - marginTop, 0]);

        d3.selectAll(`#my_dataviz${i}`).selectAll("svg").remove();
        d3.selectAll(`#my_dataviz${i}`).selectAll("div").remove();
        d3.selectAll(`#my_dataviz${i}`).selectAll("div").remove();

        // Remove the existing svg declaration
        d3.selectAll(`#my_dataviz${i}`).selectAll('svg').append('g').remove();
        d3.selectAll('svg').selectAll('div').remove();
        d3.select(`#my_dataviz${i}`).selectAll("div").remove();
        d3.selectAll(`#my_dataviz${i}`).selectAll("div").remove();
        d3.select(`#my_dataviz${i}`).selectAll("svg").remove();
        const extent = [[marginLeft, marginTop], [containerWidth - marginRight, height - marginTop]];
        const zoom = d3.zoom()
          .scaleExtent([1, 8])
          .translateExtent(extent)
          .extent(extent)
          .on("zoom", zoomed);


        const svgContainer = d3.select(`#my_dataviz${i}`)
          .style("width", '100%')
          // .style("overflow-x", "auto")
          .append("div")
          .style("width", `${containerWidth}px`)
          .style("height", `${containerHeight }px`)
          .style("overflow-y", "hidden")

        const svg = svgContainer
          .append("svg")
          .attr("width", containerWidth) //containerWidth
          .attr("height", containerHeight);


        dataload ?
          svg.style("cursor", "progress")
          :
          svg.style("cursor", "default")




        // Call zoom on SVG
        svg.call(zoom);


        // // Add a chart box
        // svg.append("rect")
        //   .attr("class", `chart-box${i}`)
        //   .attr("x", marginLeft)
        //   .attr("y", 0)
        //   .attr("width", containerWidth - marginLeft - marginRight) //containerWidth
        //   .attr("height", containerHeight - marginTop - marginBottom)
        //   .attr("fill", "none")
        //   .attr("stroke", "black")

        // Group for the main chart
        const g = svg
          .attr("transform", `translate(${0},${margin.top - 20})`);



          // console.log('chart_color  553:>> ', chart_color);
          chart_color = d3.quantize(d3.interpolateRainbow, datakeys.length + 2)
      
      
        //   // Create color scale
        // const color = d3.scaleOrdinal()
        //   .domain(datakeys)
        //   .range(chart_color !== undefined && chart_color.length > 0
        //     ? chart_color
        //     : d3.quantize(d3.interpolateRainbow, datakeys.length + 2));


  // Helper to generate random hex color
  const getRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');



  // Log each key and its mapped color
  const colorMappingArray = datakeys.map(key => {
    const chosen = choosedColors?.[key];
    const finalColor = chosen ?? getRandomColor();
    // console.log(`Color for key "${key}":`, chosen ? `(from choosedColors) ${finalColor}` : `(random) ${finalColor}`);
    return finalColor;
  });

  // Create color scale
  const color = d3.scaleOrdinal()
    .domain(datakeys)
    .range(choosedColors ?? length > 0 ? colorMappingArray : d3.quantize(d3.interpolateRainbow, datakeys.length + 2));



        // Create stack
        const stack = d3.stack()
          .keys(datakeys);




//           const compressedData = compressDataPerBar(mod_data, 3);
// const keys = Object.keys(compressedData[0]).filter(k => k !== "name");
// const series = d3.stack().keys(keys)(compressedData);





        // Stack the data
        const series = stack(mod_data);

        function generateRandomColors(numColors) {
          return Array.from({ length: numColors }, () => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
        }


        const text_color = d3.scaleOrdinal()
          .domain(datakeys)
          .range(
            text_color_arr !== undefined && text_color_arr.length > 0
              ? text_color_arr
              : ['black']
          );

        const handlemouseover = (event, d) => {
          d3.selectAll(`.tooltip`).remove()

          var chartContainer = d3.select(`#my_dataviz${i}`).node();
          var chartContainerRect = chartContainer.getBoundingClientRect();

          if (mouseover_enabled) {
            if (mouseover_switch_type) {
              var totalValue = d3.sum(datakeys.map(key => d.data[key]));
              d3.select(this).attr('class', 'highlighted');
              let tooltipContent = `<span style="color:red;">${barLabel}:</span> ${d.data.name}<br>`;

              datakeys.forEach(key => {
                tooltipContent += `<span style="color:red;">${key}:</span> <span style="color:black;">${formated_number(d.data[key])}</span><br>`;
              });
              tooltipContent += `<span style="color:red;">Total:</span> <span style="color:black;">${formated_number(totalValue)}</span>`;


              const tooltip = d3.select(`#my_dataviz${i}`)
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("pointer-events", "none")

              tooltip
                .html(tooltipContent)
                .style("opacity", 1)


              // Calculate tooltip dimensions
              const tooltipNode = tooltip.node();
              const tooltipRect = tooltipNode.getBoundingClientRect();
              const tooltipWidth = tooltipRect.width;
              const tooltipHeight = tooltipRect.height;

              // Calculate the tooltip's left and top positions
              let leftPosition = event.pageX - chartContainerRect.left + 40;
              var topPosition = event.pageY - chartContainerRect.top - 10;

              // Get mouse position relative to the container
              const mouseX = d3.pointer(event)[0];
              const mouseY = d3.pointer(event)[1];
              // Adjust the position if the tooltip exceeds the container width
              if (leftPosition + tooltipWidth > containerWidth) {
                leftPosition = event.pageX - chartContainerRect.left - tooltipWidth - 10; // Move tooltip to the left
              }

              // Adjust the position if the tooltip exceeds the container height
              if (topPosition + tooltipHeight > containerHeight) {
                topPosition = event.pageY - chartContainerRect.top - tooltipHeight - 10; // Move tooltip upwards
              }


              // Adjust tooltip position vertically based on mouse position and container dimensions
              if (mouseY < margin.top + tooltipHeight) {
                // Show tooltip below the cursor if too close to the top
                topPosition = mouseY + 20;
              } else if (mouseY + tooltipHeight > containerHeight - margin.bottom) {
                // Show tooltip above the cursor if too close to the bottom
                topPosition = mouseY - tooltipHeight - 20;
              }
              else {
                if (leftPosition > margin.right) {
                  leftPosition = margin.left + 200;
                }
                // Center the tooltip vertically relative to the cursor
                topPosition = mouseY - tooltipHeight / 2;
              }




              // Position the tooltip
              tooltip.style("left", leftPosition + "px")
                .style("top", topPosition + "px");





            } else {
              var subgroupName = d3.select(this.parentNode).datum().key;
              var subgroupValue = d.data[subgroupName];
              const tooltipContent = `${barLabel}: ${d.data.name}<br>${subgroupName}: ${formated_number(subgroupValue)}`;

              const tooltip = d3.select(`#my_dataviz${i}`)
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("pointer-events", "none")

              tooltip
                .html(tooltipContent)
                .style("opacity", 1)
                .style("left", (event.offsetX + 30) + "px")
                .style("top", (event.offsetY) + "px");
            }
          }
        }

        const seriesGroups = svg.selectAll(".series")
          .data(series)
          .enter().append("g")
          .attr("class", "series")
          .attr("fill", d => color(d.key));

        // Add rects for each segment
        seriesGroups.selectAll("rect")
          .data(d => d)
          .enter().append("rect")
          // .attr("x", d => x(d.data.name))
          // .attr("y", d => y(d[1]))
          .attr("x", d => {
            const xVal = x(d?.data?.name);
            return typeof xVal === "number" && !isNaN(xVal) ? xVal : 0;
          })
          .attr("y", d => {
            const y1 = y(d?.[1]);
            return typeof y1 === "number" && !isNaN(y1) ? y1 : 0;
          })
          .attr("height", d => {
            const y0 = y(d?.[0]);
            const y1 = y(d?.[1]);
            if (typeof y0 !== "number" || typeof y1 !== "number" || isNaN(y0) || isNaN(y1)) {
              return 0;
            }
            return y0 - y1;
          })
          .attr("width", x.bandwidth())

          .on("mousemove", function (event, d) {

            d3.selectAll(`.tooltip`).remove()
            var chartContainer = d3.select(`#my_dataviz${i}`).node();
            var chartContainerRect = chartContainer.getBoundingClientRect();

            var divX = chartContainerRect.left + window.scrollX;
            var divY = chartContainerRect.top + window.scrollY;

            // console.log('mouseover_enabled', mouseover_enabled, mouseovered_type, mouseovered)

            if (mouseovered) {
              if (mouseovered_type) {
                var totalValue = d3.sum(datakeys.map(key => d.data[key]));

                d3.select(this).attr('class', 'highlighted');
                let tooltipContent = `<span style="color:red;">${barLabel}:</span> ${d.data.name}<br>`;

                datakeys.forEach(key => {
                  tooltipContent += `<span style="color:red;">${key}:</span> <span style="color:black;">${formated_number(d.data[key] ?? 0)}</span><br>`;
                });
                tooltipContent += `<span style="color:red;">Total:</span> <span style="color:black;">${formated_number(totalValue)}</span>`;

                const tooltip = d3.select(`#my_dataviz${i}`)
                  .append("div")
                  .style("opacity", 0)
                  .attr("class", "tooltip")
                  .style("position", "absolute")
                  .style("background-color", "white")
                  .style("border", "solid")
                  .style("border-width", "1px")
                  .style("border-radius", "5px")
                  .style("padding", "10px")
                  .style("pointer-events", "none")

                tooltip
                  .html(tooltipContent)
                  .style("opacity", 1)

                // Calculate tooltip dimensions
                const tooltipNode = tooltip.node();
                const tooltipRect = tooltipNode.getBoundingClientRect();
                const tooltipWidth = tooltipRect.width;
                const tooltipHeight = tooltipRect.height;

                let leftPosition = event.pageX - divX + 20;
                let topPosition = event.pageY - divY - 40;

                if (topPosition + tooltipHeight > chartContainerRect.height) {
                  topPosition -= tooltipHeight;
                }
                if (leftPosition + tooltipWidth > chartContainerRect.width) {
                  leftPosition = event.pageX - divX - tooltipWidth - 10; // Move to the left of the cursor
                }
                tooltip.style("left", leftPosition + "px")
                  .style("top", topPosition + "px");

              }
              else {
                var subgroupName = d3.select(this.parentNode).datum().key;
                var subgroupValue = d.data[subgroupName];
                const tooltipContent = `${barLabel}: ${d.data.name}<br>${subgroupName}: ${formated_number(subgroupValue)}`;

                const tooltip = d3.select(`#my_dataviz${i}`)
                  .append("div")
                  .style("opacity", 0)
                  .attr("class", "tooltip")
                  .style("position", "absolute")
                  .style("background-color", "white")
                  .style("border", "solid")
                  .style("border-width", "1px")
                  .style("border-radius", "5px")
                  .style("padding", "10px")
                  .style("pointer-events", "none")

                tooltip
                  .html(tooltipContent)
                  .style("opacity", 1)

                const tooltipNode = tooltip.node();
                const tooltipRect = tooltipNode.getBoundingClientRect();
                const tooltipWidth = tooltipRect.width;
                const tooltipHeight = tooltipRect.height;



                let leftPosition = event.pageX - divX + 10;
                let topPosition = event.pageY - divY - 30;

                if (topPosition + tooltipHeight > chartContainerRect.height) {
                  topPosition -= tooltipHeight;
                }
                if (leftPosition + tooltipWidth > chartContainerRect.width) {
                  leftPosition = event.pageX - divX - tooltipWidth - 10; // Move to the left of the cursor
                }



                tooltip.style("left", leftPosition + "px")
                  .style("top", topPosition + "px");
              }

            }
          })
          .on("mouseleave", function (event, d) {
            d3.selectAll('.tooltip').transition().duration(50).remove();
          })

        !resized &&
          g.selectAll('g')
            .transition() // Apply transition to animate changes
            .duration(1000)

        if (show_Line) {
          createLineChart(mod_data, datakeys, props.chart_color);
        }





        function createLineChart(data, keys, colors) {


          const filteredKeys = keys.filter(key => {
            return data.some(item => item[key] !== 0);
          });


          const stack = d3.stack().keys(filteredKeys);
          // const series = stack(mod_data);
          // const filteredData = filterData(mod_data);
          const series = stack(mod_data);





          filteredKeys.forEach((key, index) => {
            const lineGenerator = d3.line()
              .x(d => x(d.data.name) + x.bandwidth() / 2) // Center the line within the band
              .y(d => y(d[1])) // Use d[1] for y position

            if (curved_line) {
              lineGenerator.curve(d3.curveCatmullRom.alpha(0.5));
            }

            g.append('path')
              .datum(series[index]) // Use series[index] instead of data
              .attr('class', `line-${key}`)
              .attr('d', lineGenerator)
              .attr('fill', 'none')
              .attr('stroke', 'black')
              .attr('stroke-width', 2.5)
              .attr('stroke-dasharray', '5,5')
              .style('pointer-events', 'none');

            series[index].forEach((point, pointIndex) => {
              const xscale = x(point.data.name) + x.bandwidth() / 2;
              const yscale = y(point[1]);


              const showTooltip = (event, d) => {

                d3.selectAll('.tooltip').remove();



                const tooltip = d3.select(`#my_dataviz${i}`).selectAll(".tooltip").remove()

                const chartContainer = d3.select(`#my_dataviz${i}`).node();
                const chartContainerRect = chartContainer.getBoundingClientRect();
                const containerWidth = chartContainerRect.width;
                const containerHeight = chartContainerRect.height;




                const tooltipContent = `Value: ${(d[1] - d[0]).toFixed(2)}, ${barLabel}: ${d.data.name}`;

                if (tooltip.empty()) {
                  d3.select(`#my_dataviz${i}`)
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("background-color", "white")
                    .style("border", "1px solid black")
                    .style("padding", "5px")
                    .style("opacity", 0)
                    .style('pointer-events', 'none')


                }

                const tooltipNode = d3.select(".tooltip");
                tooltipNode.html(tooltipContent);

                // Calculate tooltip dimensions
                const tooltipRect = tooltipNode.node().getBoundingClientRect();
                const tooltipWidth = tooltipRect.width;
                const tooltipHeight = tooltipRect.height;

                // Calculate tooltip's left and top positions
                let leftPosition = (fullScreen_enabled ? event.offsetX : event.pageX) - chartContainerRect.left + 30;
                let topPosition = event.pageY - chartContainerRect.top + 30;

                const mouseX = d3.pointer(event)[0];

                // Check if hover point is near the center of the container
                const centerX = width / 2;
                if (leftPosition + tooltipWidth > centerX) {
                  leftPosition = mouseX - margin.right - margin.left  // Move tooltip 20px left if near center
                  // console.log('leftPosition--->', leftPosition);

                }




                // console.log('leftPosition + tooltipWidth > containerWidth :>> ', leftPosition + tooltipWidth > containerWidth);
                // Adjust tooltip position if it exceeds container bounds
                // if (leftPosition + tooltipWidth > containerWidth) {
                //   leftPosition = (fullScreen_enabled ? event.offsetX : event.pageX) - chartContainerRect.left - tooltipWidth + 90;
                // }
                if (topPosition + tooltipHeight > containerHeight) {
                  topPosition = (fullScreen_enabled ? event.offsetY : event.pageY) - chartContainerRect.top - tooltipHeight - 10;
                }
                if (topPosition < 0) {
                  topPosition = 10; // Ensure tooltip doesn't go off the top of the container
                }
                // console.log('topPosition :>> ', topPosition, leftPosition, containerWidth, width);
                // Position the tooltip
                tooltipNode.style("left", `${leftPosition}px`)
                  .style("top", `${topPosition}px`)
                  .style("opacity", 0.9);
              };


              const hideTooltip = () => {
                d3.select(".tooltip").style("opacity", 0);
              };

              if (show_Square) {
                g.append('rect') // Changed from circle to rect
                  .datum(point)
                  .attr('class', `node-${key}`)
                  .attr('x', xscale - 5) // Adjust the position to center the square
                  .attr('y', yscale - 5) // Adjust the position to center the square
                  .attr('width', 8) // Width of the square
                  .attr('height', 8) // Height of the square
                  .attr('fill', "green")
                  .on('mouseover', showTooltip)
                  .on('mousemove', showTooltip)
                  .on('mouseout', hideTooltip);


              } else {
                g.append('circle')
                  .datum(point)
                  .attr('class', `node-${key}`)
                  .attr('cx', xscale)
                  .attr('cy', yscale)
                  .attr('r', 4)
                  .attr('fill', "green")
                  .on('mouseover', showTooltip)
                  .on('mousemove', showTooltip)
                  .on('mouseout', hideTooltip);

              }

            });
          });
        }

        const textGroup = g.selectAll('g')

        const renderText = () => {
          const minHeight = 10;
          textGroup.selectAll('text').remove();
          series.forEach((seriesData, seriesIndex) => {
            textGroup.selectAll(`.text-${seriesIndex}`)
              .data(seriesData)
              .enter().append('text')
              .attr('class', `text-${seriesIndex}`)
              .attr('x', d => x(d.data.name) + x.bandwidth() / 2)
              // .attr('y', d => y(d[1]) + (y(d[0]) - y(d[1])) / 2)
              .attr('y', d => {
                if (typeof d[0] !== "number" || typeof d[1] !== "number" || isNaN(d[0]) || isNaN(d[1])) return -9999; // hide off-screen
                return y(d[1]) + (y(d[0]) - y(d[1])) / 2;
              })
              
              
              .text(d => d3.format(",")((d[1] - d[0]).toFixed(2)))
              .attr('text-anchor', 'middle')
              .attr('dy', '0.35em')
              .style('fill', text_color(datakeys[seriesIndex]) !== undefined ? text_color(datakeys[seriesIndex]) : 'black' )
              .style('pointer-events', 'none')
              .style('display', d => (y(d[0]) - y(d[1])) >= minHeight ? (showvalues ? 'block' : 'none') : 'none')
            // .style('fill', 'green')

            // .style("display", function () {
            //   return showvalues ? "block" : "none";
            // });
          });
        };

        renderText();

        const charLimit = 5;
        const axisLabels = g.append('g')
          .attr('class', `x-axis`)
          .attr('transform', `translate(0, ${containerHeight - marginBottom - marginTop})`)
          .call(d3.axisBottom(x))
          .selectAll('text')
          .style('text-anchor', 'end')
          .style('font-size', '14px')
          .attr('fill', 'black')
          .style("text-transform", "capitalize")
          .style("font-weight", (d, i) => i % 2 === 0 ? "bold" : "normal")
          .style('cursor', 'pointer')
          .attr('transform', `rotate(-45)`)
          .text(function (d) {
            if (!d || typeof d !== 'string') {
              return "(blank)";
            }
            return d.length > charLimit ? `${d.substring(0, charLimit)}...` : d;
          });



        // const tooltip = d3.select('body').append('div')
        //   .attr('class', 'textHover')
        //   .style('position', 'absolute')
        //   .style('background', '#f9f9f9')
        //   .style('padding', '5px')
        //   .style('border', '1px solid #ccc')
        //   .style('border-radius', '5px')
        //   .style('pointer-events', 'none')
        //   .style('visibility', 'hidden')
        //   .style('font-size', '12px');

        axisLabels.on('mouseover', function (event, d) {

          // First, ensure no leftover tooltips
          removeTooltip();

          // Create new tooltip
          const tooltip = d3.select('body').append('div')
            .attr('class', 'textHover')
            .style('position', 'absolute')
            .style('background', '#f9f9f9')
            .style('padding', '5px')
            .style('border', '1px solid #ccc')
            .style('border-radius', '5px')
            .style('pointer-events', 'none')
            .style('font-size', '12px')
            .style('visibility', 'visible')
            .style('opacity', 0)
            .transition()
            .duration(200)  // Smooth fade-in in 300ms
            .style('opacity', 1);

          // Determine the tooltip content
          const tooltipText = (!d || typeof d !== 'string') ? "(blank)" : d;
          tooltip.text(tooltipText);

          // Store tooltip reference in this element
          d3.select(this).node().tooltip = tooltip;





          // const tooltipText = (!d || typeof d !== 'string') ? "(blank)" : d;
          // tooltip.style('visibility', 'visible')
          //   .text(tooltipText);
        })
          .on('mousemove', function (event) {
            const tooltip = d3.select('.textHover');
            if (!tooltip.empty()) {
              tooltip.style('top', `${event.pageY + 10}px`)
                .style('left', `${event.pageX + 10}px`);
            }

            // tooltip.style('top', `${event.pageY + 10}px`)
            //   .style('left', `${event.pageX + 10}px`);
          })
          .on('mouseleave', removeTooltip)  // Call function to remove tooltips
          .on('mouseout', removeTooltip);  // Also remove on mouseout

        // const axisLabels = g.append('g')
        //   .attr('class', `x-axis`)
        //   .attr('transform', `translate(0, ${containerHeight - marginBottom - marginTop})`)
        //   .call(d3.axisBottom(x))
        //   .selectAll('text')
        //   .style('text-anchor', 'middle')
        //   .style('font-size', '14px')
        //   .attr('fill', 'black')
        //   .style("text-transform", "capitalize")
        //   .style("font-weight", (d, i) => i % 2 === 0 ? "bold" : "normal") // Apply different font weights
        //   .style('cursor', 'pointer')


        // let rotationAngle = 0; // Variable to track the rotation angle
        // axisLabels.each(function (data, i) {
        //   const label = this;
        //   d3.select(label).on('click', function () {
        //     const currentRotation = rotationAngle === 0 ? -45 : 0;
        //     const currentAnchor = rotationAngle === 0 ? 'end' : "middle";
        //     axisLabels.attr('transform', `rotate(${currentRotation})`)
        //       .style("text-anchor", currentAnchor)
        //     rotationAngle = currentRotation;
        //   });
        // });

        // g.append('g')
        //   .call(d3.axisLeft(y).ticks(5).tickSize(0))

        if (show_grid_enabled) {
          svg.append("g")
            .selectAll("line")
            .attr('class', 'x-grid')
            .data(mod_data)
            .join("line")
            .attr("x1", (d) => x(d.name) + x.bandwidth() / 2)
            .attr("x2", (d) => x(d.name) + x.bandwidth() / 2)
            .attr("y1", 0)
            .attr("y2", containerHeight - marginBottom - marginTop)
            .attr("stroke", "lightgrey")
            .style('pointer-events', 'none');


          svg.append('g')
            .attr('class', 'y-grid')
            .attr('transform', `translate(${marginLeft},${marginTop - marginBottom + 10})`) // Adjust the y-axis grid position
            .call(d3.axisLeft(y)
              .tickSize(-(containerWidth - marginLeft - marginRight))
              .tickFormat('')
              .ticks(5) // Adjust the number of ticks based on the desired granularity

            )
            .style('pointer-events', 'none')

            .select('.domain , line')
            .remove(); // Remove the y-axis line

          svg.selectAll('.x-grid .tick line')
            .attr('class', 'x-grid-line')
            .attr('stroke', 'lightgrey')
            .attr('opacity', 0.5);

          svg.selectAll('.y-grid .tick line')
            .attr('class', 'y-grid-line')
            .attr('stroke', 'lightgrey')
            .attr('opacity', 0.5);

        }
        else {
          svg.selectAll('.grid').remove();
        }


        const newWidth = Math.max(temp_barWidth + margin.left + margin.right, containerWidth); // Ensure new width is at least as wide as containerWidth
        setChrtWidth(BarWidth !== undefined ? newWidth : containerWidth)


        const yAxisContainer = d3.select(`#my_dataviz${i}`)
          .attr('class', 'y-axis')
          .append("div") // Use a separate div for the y-axis container
          .style("position", "absolute")
          .style('background-color', 'white')
          .style("top", `${0}px`) // Adjust the top position as needed
          .style("left", "0")
          .style("width", `${marginLeft}px`) // Adjust the width as needed
          .style("height", `${containerHeight}px`);

        const yAxis = yAxisContainer.append("svg")
          .attr("width", '100%')
          .attr("height", containerHeight)
          .append("g")
          .attr("transform", `translate(${marginLeft},${marginTop})`)
          .call(d3.axisLeft(y).ticks(fullScreen_enabled ? 20 : containerHeight / 50))
          .selectAll('.domain, text')
          .attr('stroke', fullScreen_enabled ? 'black' : 'black')
          .style("font-size", '10px')
          .call(g => g.select(".domain").remove())


        // Adjust the position of the y-axis line
        yAxis.selectAll(".domain")
          .attr("transform", `translate(${-60}, 0)`); // Set the desired X position

        // Change the color of the y-axis line
        yAxis.selectAll(".domain")
          .style("stroke", 'green'); // Set the desired color

        // Change the thickness of the y-axis line
        yAxis.selectAll(".domain")
          .style("stroke-width", 12); // Set the desired line width

        yAxis.selectAll("text")

          .attr('class', 'yAxis-text')
          .attr("x", -10)
          .attr('fill', 'black')
          .attr("dx", "-3.99em")
          .style('font-weight', 'bold')
          .style("font-size", '12px');// y-axis value color

        yAxis.selectAll("line")
          .attr("transform", `translate(${-50}, 0)`)
          .attr('stroke', 'red')
          .attr("dx", "-2em");// y-axis value color

        var datakeys_mod

        if (YLabel.length > 0) {
          datakeys_mod = YLabel.slice(1)
        }
        else {
          datakeys_mod = datakeys
        }
        var datakeys_mod

        if (YLabel.length > 0) {
          datakeys_mod = YLabel.slice(1)
        }
        else {
          datakeys_mod = datakeys
        }


        const legendContainer = d3.selectAll(`#legend${i}`);
        const legendWidth = datakeys.length * 120;
        const legendX = (containerWidth - legendWidth) / 2;
        const legendY = height + margin.bottom - 40;
        legendContainer.selectAll('*').remove(); // Clear previous legend content

        datakeys_mod.forEach((key, i) => {
          const legendItemGroup = legendContainer.append('div')
            .attr('class', 'legend-item')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('margin-right', '10px'); // Add some space between legend items

          legendItemGroup.append('div')
            .attr('class', 'legend-rect')
            .style('width', '13px')
            .style('height', '13px')
            .style('background-color', () => {
              var colorToUse = (chart_color?.length > 0 ? (chart_color[i] != undefined) ? chart_color[i] : chart_color[i + 1] : color(key));
              return colorToUse;
            })
            .style('margin-right', '5px'); // Space between rectangle and text

          legendItemGroup.append('text')
            .attr('class', 'legend-text')
            .style('color', 'green')
            .text(key);
        });


        if (enable_table) {
          show_table_fn(true)
        }
        else {
          show_table_fn(false)
        }

        function zoomed(event) {
          removeTooltip()
          const newXDomain = x.domain().map(d => { return d }); // Update the x-domain
          const newXScale = x.domain(newXDomain); // Update the x-scale with the new domain
          const newBarWidth = x.bandwidth() // Adjust the bar width
          let calc = containerWidth / 100
          // x.range([marginLeft, containerWidth - marginRight].map(d => event.transform.applyX(d))); //containerwidth
          x.range(initialXRange.map(d => event.transform.applyX(d)));

          svg.selectAll("path").remove();
          g.selectAll(".circle-node, .square-node").remove();
          svg.selectAll(".bar-label").remove();
          g.selectAll(".x-grid , node").remove();
          svg.selectAll(".y-grid").remove();
          svg.selectAll(".domain, line").remove();
          g.selectAll('.barValues').remove();
          svg.selectAll('.x-axis').remove()
          svg.select(".x-axis").call(d3.axisBottom(newXScale));

          if (show_Square) {
            datakeys.forEach((key, index) => {
              d3.selectAll(`.node-${key}`)?.remove();
            })
          }


          if (show_Line) {
            createLineChart(mod_data, datakeys, props.chart_color);
          }

          seriesGroups.selectAll("rect")
            .attr("x", d => newXScale(d.data.name))
            .attr("width", x.bandwidth())
            .style('cursor', 'pointer')

          svg
            .attr("transform", `translate(${0},${margin.top - 20})`);


          renderText();


          const charLimit = 5;
          const axisLabels = g.append('g')
            .attr('class', `x-axis`)
            .attr('transform', `translate(0, ${containerHeight - marginBottom - marginTop})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('text-anchor', 'end')
            .style('font-size', '14px')
            .attr('fill', 'black')
            .style("text-transform", "capitalize")
            .style("font-weight", (d, i) => i % 2 === 0 ? "bold" : "normal")
            .style('cursor', 'pointer')
            .attr('transform', `rotate(-45)`)
            .text(function (d) {
              if (!d || typeof d !== 'string') {
                return "(blank)";
              }
              return d.length > charLimit ? `${d.substring(0, charLimit)}...` : d;
            });



          // const tooltip = d3.select('body').append('div')
          //   .attr('class', 'textHover')
          //   .style('position', 'absolute')
          //   .style('background', '#f9f9f9')
          //   .style('padding', '5px')
          //   .style('border', '1px solid #ccc')
          //   .style('border-radius', '5px')
          //   .style('pointer-events', 'none')
          //   .style('visibility', 'hidden')
          //   .style('font-size', '12px');

          axisLabels.on('mouseover', function (event, d) {

            // First, ensure no leftover tooltips
            removeTooltip();

            // Create new tooltip
            const tooltip = d3.select('body').append('div')
              .attr('class', 'textHover')
              .style('position', 'absolute')
              .style('background', '#f9f9f9')
              .style('padding', '5px')
              .style('border', '1px solid #ccc')
              .style('border-radius', '5px')
              .style('pointer-events', 'none')
              .style('font-size', '12px')
              .style('visibility', 'visible')
              .style('opacity', 0)
              .transition()
              .duration(300)  // Smooth fade-in in 300ms
              .style('opacity', 1);

            // Determine the tooltip content
            const tooltipText = (!d || typeof d !== 'string') ? "(blank)" : d;
            tooltip.text(tooltipText);

            // Store tooltip reference in this element
            d3.select(this).node().tooltip = tooltip;





            // const tooltipText = (!d || typeof d !== 'string') ? "(blank)" : d;
            // tooltip.style('visibility', 'visible')
            //   .text(tooltipText);
          })
            .on('mousemove', function (event) {
              const tooltip = d3.select('.textHover');
              if (!tooltip.empty()) {
                tooltip.style('top', `${event.pageY + 10}px`)
                  .style('left', `${event.pageX + 10}px`);
              }

              // tooltip.style('top', `${event.pageY + 10}px`)
              //   .style('left', `${event.pageX + 10}px`);
            })
            .on('mouseleave', removeTooltip)  // Call function to remove tooltips
            .on('mouseout', removeTooltip);  // Also remove on mouseout





          // d3.select(`.chart-box${i}`)
          //   .attr("x", marginLeft)
          //   .attr("y", 0)
          //   .attr("width", containerWidth - marginLeft) //containerWidth
          //   .attr("height", containerHeight - marginTop - marginBottom)
          //   .attr("fill", "none")
          //   .attr("stroke", "black")

          if (show_grid_enabled) {
            svg.append("g")
              .selectAll("line")
              .attr('class', 'x-grid')
              .data(mod_data)
              .join("line")
              .attr("x1", (d) => x(d.name) + x.bandwidth() / 2)
              .attr("x2", (d) => x(d.name) + x.bandwidth() / 2)
              .attr("y1", 0)
              .attr("y2", containerHeight - marginBottom - marginTop)
              .attr("stroke", "lightgrey")
              .style('pointer-events', 'none');


            svg.append('g')
              .attr('class', 'y-grid')
              .attr('transform', `translate(${marginLeft},${marginTop - marginBottom + 10})`) // Adjust the y-axis grid position
              .call(d3.axisLeft(y)
                .tickSize(-(containerWidth - marginLeft - marginRight))
                .tickFormat('')
                .ticks(5) // Adjust the number of ticks based on the desired granularity
              )

            svg.selectAll('.y-grid .tick line')
              .attr('class', 'y-grid-line')
              .attr('stroke', 'lightgrey')
              .style('pointer-events', 'none');

          }

        }

        const initialXDomain = x.domain().slice();
        const initialYDomain = y.domain().slice();
        const initialXRange = x.range().slice();
        const initialYRange = y.range().slice();



        const handleResetButtonClick = () => {


          x.domain(initialXDomain);
          y.domain(initialYDomain);
          x.range(initialXRange);
          y.range(initialYRange);
          svg.call(zoom.transform, d3.zoomIdentity);




          d3.selectAll(`my_dataviz${i}`).select('.node').remove()
          d3.selectAll('.barValues').remove();
          svg.selectAll(".bar-label").remove();
          g.selectAll(".x-grid , node").remove();
          svg.selectAll(".y-grid").remove();
          svg.selectAll("path").remove();
          g.selectAll(".circle-node, .square-node").remove();
          svg.selectAll(".circle-node, .square-node").remove();
          svg.selectAll(".domain, line").remove();

          // const newXScale = x.range([marginLeft, containerWidth - marginRight]);
          const newXScale = x.range(initialXRange);
          svg.attr("width", containerWidth);
          svg.select(".x-axis").call(d3.axisBottom(newXScale));

          seriesGroups.selectAll("rect")
            .attr("x", d => newXScale(d.data.name))
            .attr("width", newXScale.bandwidth());



          g.selectAll('g')
            .data(series)
            .selectAll('text')
            .data(d => d)
            .enter().append('text')
            .attr('class', 'barValues')

            .attr('x', d => x(d.data.name) + x.bandwidth() / 2)
            .attr('y', d => y(d[1]) + (y(d[0]) - y(d[1])) / 2)
            .text(d => d3.format(",")((d[1] - d[0]).toFixed(2)))
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em') // Adjust the vertical alignment if needed
            .style('fill', 'black')// Adjust the text color if needed
            .style("display", function () {
              return showvalues ? "block" : "none";
            });


          if (show_grid_enabled) {
            d3.selectAll('.x-grid').remove()

            g.selectAll(".x-grid").remove();
            svg.selectAll(".y-grid").remove();
            svg.selectAll(".domain, line").remove();

            svg.select(".x-axis").call(d3.axisBottom(newXScale));

            svg.append('g')
              .attr('class', 'y-grid')
              .attr('transform', `translate(${marginLeft},${marginTop - marginBottom + 10})`)
              .call(d3.axisLeft(y)
                .tickSize(-(containerWidth - marginLeft - marginRight))
                .tickFormat('')
                .ticks(5) // Adjust the number of ticks based on the desired granularity
              )
              .style('pointer-events', 'none')

              .select('.domain , line')
              .remove()

            svg.selectAll('.y-grid .tick line')
              .attr('class', 'y-grid-line')
              .attr('stroke', 'lightgrey')
              .attr('opacity', 0.5);


            svg.append("g")
              .selectAll("line")
              .attr('class', 'x-grid')
              .data(mod_data)
              .join("line")
              .attr("x1", (d) => newXScale(d.name) + x.bandwidth() / 2)
              .attr("x2", (d) => newXScale(d.name) + x.bandwidth() / 2)
              .attr("y1", 0)
              .attr("y2", containerHeight - marginBottom - marginTop)
              .attr("stroke", "lightgrey");
          }


          if (show_Line) {

            datakeys.forEach((key, index) => {
              d3.selectAll(`.node-${key}`).remove();
            })
            createLineChart(mod_data, datakeys, props.chart_color);
          }
          function createLineChart(data, keys, colors) {
            const stack = d3.stack().keys(keys);
            const series = stack(mod_data);
            keys.forEach((key, index) => {
              const lineGenerator = d3.line()
                .x(d => x(d.data.name) + x.bandwidth() / 2) // Center the line within the band
                .y(d => y(d[1])) // Use d[1] for y position
              if (curved_line) {
                lineGenerator.curve(d3.curveCatmullRom.alpha(0.5));
              }
              g.append('path')
                .datum(series[index]) // Use series[index] instead of data
                .attr('class', `line-${key}`)
                .attr('d', lineGenerator)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 2.5)
                .attr('stroke-dasharray', '5,5');
              series[index].forEach((point, pointIndex) => {
                const xscale = x(point.data.name) + x.bandwidth() / 2;
                const yscale = y(point[1]);
                if (show_Square) {
                  g.append('rect') // Changed from circle to rect
                    .datum(point)
                    .attr('class', `node-${key}`)
                    .attr('x', xscale - 5) // Adjust the position to center the square
                    .attr('y', yscale - 5) // Adjust the position to center the square
                    .attr('width', 10) // Width of the square
                    .attr('height', 10) // Height of the square
                    .attr('fill', "green")
                    .on('mouseover', function (event, d) {
                      const tooltipX = event.pageX + 10;
                      const tooltipY = event.pageY - 50;
                      let tooltip = d3.selectAll(fullScreen_enabled ? `#tooltip${i}` : '#tooltip');
                      if (tooltip.empty()) {
                        tooltip = d3.select('body').append('div')
                          .attr('id', 'tooltip')
                          .attr('class', 'tooltip')
                          .style('position', 'absolute')
                          .style('background-color', 'white')
                          .style('border', '1px solid black')
                          .style('padding', '5px')
                          .style('opacity', 0);
                      }
                      // tooltip.html(`${barLabel}: ${d.year}<br>Value: ${d.value}`)
                      tooltip.html(`Value: ${formated_number(d[1] - d[0])}<br>${barLabel}: ${d.data.name}`) // Added <br> for line break
                        .style("left", `${tooltipX}px`)
                        .style("top", `${tooltipY}px`)
                        .style('opacity', 0.9);
                    })
                    .on('mouseout', function (event, d) {
                      let tooltip = d3.selectAll(fullScreen_enabled ? `#tooltip${i}` : '#tooltip');
                      tooltip
                        .style('opacity', 0);
                    });
                } else {
                  g.append('circle')
                    .attr('class', `node-${key}`)
                    .attr('cx', xscale)
                    .attr('cy', yscale)
                    .attr('r', 4)
                    .attr('fill', "green")
                    .on('mouseover', function (event, d) {
                      const tooltipX = event.pageX + 10;
                      const tooltipY = event.pageY - 50;
                      // let tooltip = d3.select('#tooltip');
                      let tooltip = d3.selectAll(fullScreen_enabled ? `#tooltip${i}` : '#tooltip');
                      if (tooltip.empty()) {
                        tooltip = d3.select('body').append('div')
                          .attr('id', 'tooltip')
                          .attr('class', 'tooltip')
                          .style('position', 'absolute')
                          .style('background-color', 'white')
                          .style('border', '1px solid black')
                          .style('padding', '5px')
                          .style('opacity', 0);
                      }

                      // tooltip.html(`Value: ${d[1] - d[0]}<br>${barLabel}: ${d.data.year}`) // Added <br> for line break

                      tooltip.html(`Value: ${point[1]}<br>${barLabel}: ${point.data.name}`) // Added <br> for line break
                        .style("left", `${tooltipX}px`)
                        .style("top", `${tooltipY}px`)
                        .style('opacity', 0.9).raise()
                    })
                    .on('mouseout', function (event, d) {
                      let tooltip = d3.selectAll(fullScreen_enabled ? `#tooltip${i}` : '#tooltip');
                      tooltip
                        .style('opacity', 0);
                    });
                }
              });
            });
          }

          renderText()
        };


        if (i === reportSlice.resetCharts.i) {
          handleResetButtonClick();
          dispatch(setResetCharts([]));
        }



        // document.getElementById(`togglereset-${i}`).addEventListener('click', function (event) {
        //   handleResetButtonClick();
        // });


      }

      if (mod_data.length === 0) {
        d3.select(`#my_dataviz${i}`).selectAll("svg").remove();
        d3.select(`#my_dataviz${i}`).selectAll("div").remove();

        d3.select(`#legend${i}`).remove();

        d3.select(`#my_dataviz${i}`)
          .append("div")
          .style("display", "flex")
          .style("align-items", "center")
          .style("justify-content", "center")
          .style("height", `${containerHeight}px`) // Use the containerHeight
          .style("width", `${containerWidth}px`) // Use the containerWidth
          .style("font-size", "16px")
          .style("color", "grey")
          // .style("background-image", `url(${image1})`) // Set the background image
          .style("background-size", "21% 100%") // Adjust the image to fit container's width and height
          .style("background-repeat", "no-repeat") // Prevent the image from repeating
          .style("background-position", "center") // Center the image
          .text("No data available");

        return; // Exit to avoid rendering the chart
      }











    }

    else {

      console.log("Empty Stack Chart");

      // Clear the container
      d3.select(`#my_dataviz${i}`).html("");

      // Add a centered "No data available" message
      d3.select(`#my_dataviz${i}`)
        .style("position", "relative")
        .style("width", `${containerWidth}px`)
        .style("height", `${containerHeight}px`)
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center")
        .style("border", "1px solid #ddd") // Optional: Add a border
        .append("div")
        .style("font-size", "16px")
        .style("color", "grey")
        .text("No data available");

      // if (chart_data.length === 0) {
      //   d3.select(`#my_dataviz${i}`).selectAll("svg").remove();
      //   d3.select(`#my_dataviz${i}`).selectAll("div").remove();

      //   d3.select(`#legend${i}`).remove();

      //   d3.select(`#my_dataviz${i}`)
      //     .append("div")
      //     .style("display", "flex")
      //     .style("align-items", "center")
      //     .style("justify-content", "center")
      //     .style("height", `${containerHeight}px`) // Use the containerHeight
      //     .style("width", `${containerWidth}px`) // Use the containerWidth
      //     .style("font-size", "16px")
      //     .style("color", "grey")
      //     // .style("background-image", `url(${image1})`) // Set the background image
      //     .style("background-size", "21% 100%") // Adjust the image to fit container's width and height
      //     .style("background-repeat", "no-repeat") // Prevent the image from repeating
      //     .style("background-position", "center") // Center the image
      //     .text("No data available");

      //   return; // Exit to avoid rendering the chart
      // }
    }
  },
    // [ props , data]
    [reportSlice, containerWidth, BarWidth, containerHeight, text_Color_bar, showvalues, mouseover_enabled, enable_table, mouseovered_type, chart_color, show_grid_enabled, temp_containerWidth, fullScreen_enabled, temp_containerHeight, sortdata, showLine, YLabel, chart_height, enabled_table, svgHeight, curved_line, show_Square, resized, text_color_arr, dataload, data, reportSlice[i], mouseovered, reportSlice.resetCharts.i === i]
  );



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
  const show_table_fn = async (val, Tdata) => {

    var updtData

    // console.log('data show_table_fn:>> ', data, Tdata, props.chart_data);



    if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined && dataRetreived.data?.[0]?.[calc]) {
      updtData = dataRetreived.data?.[0]?.[calc]
    }
    else {
      updtData = props.chart_data
    }

    if (reportSlice.layoutInfo[props.indexes]?.filtered_data) {
      updtData = reportSlice.layoutInfo[props.indexes]?.filtered_data
    }

    if (updtData !== undefined && updtData.length > 0) {
      // Group the data if it is Not in Combined
      // var updtData = data[0][calc]
      // console.log('updtData :>> ', updtData);
      // const fieldNames = Object.keys(updtData[0]).filter(key => key !== "_id");

      const fieldNames = Array.from(
        new Set(
          updtData.flatMap(obj => Object.keys(obj).filter(key =>  key !== '_id'))
        )
      );
      



      if (val) {
        await tabulate(updtData, fieldNames)
      }
      else {
        setshowDiv(false)
        d3.selectAll(`#tableContainer${i}`).selectAll("table").remove();
      }
    }

  }

  const tabulate = async (data, columns, y_axis_name) => {
    const header = columns;
    var data_exist;
    if (data !== undefined) {
      data_exist = data;
    } else {
      data_exist = data;
    }


    // console.log('data_exist Stacks :>> ', data_exist);
    var tableContainer = document.getElementById(`tableContainer${i}`);

    if (tableContainer !== null) {
      tableContainer.innerHTML = ""; // Clear previous content

    }
    async function renderTable(data, dispatch) {
      const formattedData = await preprocessData(data, dispatch);

      d3.select('#table')
        .selectAll('tr')
        .data(formattedData)
        .enter()
        .append('tr')
        .html(function (d) {
          return d.formattedValue || d.value;
        })
        .attr("style", "text-align: center")
        .style('color', 'black');

      return table;
    }

    var table = d3.select(`#tableContainer${i}`)
      .attr("class", "table-responsive")
      .append("table")
      // .style("width", `${fullScreen_enabled ? temp_containerWidth : props.containerWidth - 12}px`);
      .style("max-width", `-webkit-fill-available`)

    var thead = table.append("thead");
    var tbody = table.append("tbody");

    d3.select(tableContainer)
      .attr('class', 'table_body')
      .style("max-width", `-webkit-fill-available`)
      .style("overflow-y", "scroll")
      .style("overflow-x", "hidden");

    thead.append("tr")
      .selectAll("th")
      .data(header)
      .enter()
      .append("th")
      .text(function (column) { return column.toUpperCase(); })
      .attr("style", "text-align: left") // table rows
      .style('color', 'black')

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
      // .html(function (d) { return d.value; })

      .html(function (d) {
        const value = d.value ?? 0; // fallback to 0 if undefined or null
        if (typeof value === 'number') {

          return formated_number(value);
        }
        return value;
      })



      .attr("style", "text-align: left")
      .style('color', 'black')
    return table;
  }

  const handleSortDefault = () => {
    dispatch(sortInfo({ data: chart_data, chart_id: i })); // Assuming 'i' is the chart_id
    setsortdata([...chart_data]); // Update local state with the original data
    setSortingField(null); // Reset any sorting field
  };



  const formated_number = (val) => {
    var formattedValue = (val % 1 === 0)
      ? val?.toString()
      : val?.toFixed(2);
    return formattedValue
  }

  function showProgressCursor() {
    setTimeout(() => {
      resetCursor()
    }, 2000);
    document.documentElement.style.cursor = 'progress';
    d3.selectAll('svg').style("cursor", "progress");
  }

  // Function to reset cursor to default
  function resetCursor() {
    document.documentElement.style.cursor = 'default';
    d3.selectAll('svg').style("cursor", "default");

  }


  // Function to remove all tooltips
  function removeTooltip() {
    d3.selectAll('.textHover').remove();  // Remove all tooltip instances
  }


  return (
    <div>
      <div id={`tooltip${i}`} style={{ opacity: 0, background: 'lightgray', padding: '10px', borderRadius: '5px' }} ></div>

      {chartsLoad ?
        <>
          <div className="chart-container" >
            <div id={`my_dataviz${i}`} style={{ maxWidth: '100%', }} onMouseLeave={() => { setShowOptions(false); setshowsortoption(false); }} >
              <svg ref={chartRef} width={(fullScreen_enabled ? (BarWidth === undefined ? temp_containerWidth : chartWidth) : chartWidth)} >
              </svg>
            </div>
          </div>
          {
            show_Legend ?
              <div className="legend" id={`legend${i}`} style={{ position: '', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', boxShadow: 'none', marginTop: -45 }}></div>

              :
              null
          }

          {/* <div id={`legend${i}`} style={{ maxWidth: containerWidth / 2, minWidth: '200px', overflowX: 'auto', position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'centre', marginLeft: (fullScreen_enabled ? temp_containerWidth : containerWidth) / 4, marginTop: '-40px', boxShadow: 'none' }}> */}
          {/* </div> */}
        </>
        :
        // <>
        //   <Spinner
        //     color="secondary"
        //     className="chartLoader"
        //     style={{
        //       position: "fixed",
        //       top: "50%",
        //       left: "50%",
        //     }}
        //   >
        //     Loading...
        //   </Spinner>
        // </>
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



      {(props.show_table && chartsLoad) ? (
        <>
          <div style={{
            position: '',
            bottom: 0,
            left: 0,
            backgroundColor: '#fff',
            height: (fullScreen_enabled ? '240px' : '180px'),
            // width:('2000px')

          }} id={`tableContainer${i}`}>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default D3Stack_bar_chart;
