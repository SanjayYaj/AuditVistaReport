import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'reactstrap';
import '../../LayoutInfo.css'
import { updateLayoutInfo, retriveClnPrimaryValue, setZoomInStatus, setZoomOutStatus, setResetCharts, toggleProcessingState, sortFunc, sortDescending } from '../../../../Slice/reportd3/reportslice';
import { data } from 'autoprefixer';
import urlSocket from '../../../../helpers/urlSocket';



const D3AreaChart = (props) => {
    const dispatch = useDispatch();
    const svgRef = useRef()
    var containerWidth = props.containerWidth
    var containerHeight = props.containerHeight
    var chart_data = props.chart_data
    var chart_color = props.chart_color
    var i = props.id
    var label_name = props.label
    var mouseovered = props.mouseovered
    var mouseovered_type = props.mouseovered_type !== undefined && props.mouseovered_type === 'single' ? false : true
    var enable_table = props.show_table
    var show_Grid = props.show_Grid
    var temp_containerWidth = props.temp_containerWidth
    var temp_containerHeight = props.temp_containerHeight
    var fullScreen_enabled = props.show_Full_Screen_toggle
    var YLabel = props.YLabel
    var show_Square = props.show_Square
    var svgHeight = props.chart_height
    var show_bar_values = props.show_bar_values
    var text_color_arr = props.text_color
    var barLabel = props.label;
    var show_Legend = props.show_Legend

    var dataRetreived = props.itemInfo


    var choosedColors = dataRetreived.ColorMapping 

    console.log('dataRetreived for Area', choosedColors , dataRetreived)

    var calc = props.math_calc
    console.log('dataRetreived.calc Area chart', calc)
    const [chartData, setchartData] = useState([]);
    const [textColorBar, settextColorBar] = useState([])
    const [showOptions, setShowOptions] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [mouseoverEnabled, setMouseoverEnabled] = useState(mouseovered)
    const [enabledTable, setenabledTable] = useState(enable_table)
    const [showGridEnabled, setShowGridEnabled] = useState(show_Grid)
    const [sortShowOptions, setSortShowOptions] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);
    const [arrValues, setarrValues] = useState([])
    const [sortOrder, setSortOrder] = useState('')
    const [sortdata, setsortdata] = useState([]);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [scrollDelta, setScrollDelta] = useState(0);
    const [groupedData, setGroupeddata] = useState([]);
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

    // const reportSlice = useSelector(state => state.reportSlice);


    // const dbInfo = {
    //     encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@65.0.69.57:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
    //     db_name: 'hotel_surguru-beta',
    // }


    const AuthSlice = useSelector(state => state.auth);
    const dbInfo = AuthSlice.db_info


    const reportSlice = useSelector(state => state.reportSliceReducer)
    const ProcessedID = reportSlice.processingData[props.id]
    var queryFilter = reportSlice.queryFilter
console.log(' reportSlice.queryFilter :>> ',  reportSlice.queryFilter);

    const selectedsortredux = useSelector(state => state.reportSliceReducer.selectedsortredux);
    const selectedvalueRedux= useSelector(state => state.reportSliceReducer.selectedValues);


    
    useEffect(() => {
        console.log("calccalc", calc);
        setchartData(dataRetreived.data?.[0][calc])
    }, [calc])

    useEffect(() => {
        console.log('queryFilter from Area', queryFilter)
        setProcessing(true)
        setChartsLoad(false)
        dispatch(toggleProcessingState(dataRetreived.i))
        LoadedData(dataRetreived.x_axis_key.name, '1')
    }, [queryFilter])

    useEffect(() => {

        if (ProcessedID === undefined) {
            if (dataRetreived?.yAxis_arr !== undefined && dataRetreived.data === undefined || dataRetreived.chnaged === true) {
                setProcessing(true)
                setChartsLoad(false)
                dispatch(toggleProcessingState(dataRetreived.i))
                LoadedData(dataRetreived.x_axis_key.name, '1')
            }
            else if (dataRetreived.filtered_data !== undefined) {
                setchartData(dataRetreived.filtered_data)
                setChartsLoad(true)

            }
            else {

                setChartsLoad(true)
                setchartData(props.chart_data)
            }
        }


        if (ProcessedID) {
            console.log('110 Already Retyrteived Data ', dataRetreived)
            if (dataRetreived.filtered_data !== undefined) {
                setchartData(dataRetreived.filtered_data)
                setChartsLoad(true)
            }
            else if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined) {
                setchartData(dataRetreived.data)
                setChartsLoad(true)
            }
            else {
                setchartData(dataRetreived.data)
                setChartsLoad(true)
            }

        }
        if (props.show_table) {
            show_table_fn(true, dataRetreived.data)
        }
        else {
            show_table_fn(false)
        }

    }, [props, containerWidth, dataRetreived , queryFilter])





    useEffect(() => {
        if (props.chart_data !== undefined && props.chart_data.length > 0) {
            // setchartData(props.chart_data[0][calc])
            // setshowvalues(show_bar_values)
            setShowGridEnabled(show_Grid)
            setMouseoverEnabled(mouseovered)
            // setmouseover_switch_type(mouseovered_type)
            // setShowLine(showline)
            setenabledTable(enable_table)
            // setchartHeight(svgHeight)
            // setShowGridenabled(show_Grid)
            // setChartWidth(BarWidth)
            // sethandlefullscreen(fullScreen_enabled) 

        }
    }, [chartsLoad, mouseovered, enable_table, svgHeight, show_Grid, temp_containerWidth, fullScreen_enabled, temp_containerHeight, show_bar_values, mouseovered_type, containerWidth])


   async function buildAdditionalFields(yAxis_arr, yAxis_Selectd_Cln, CalculationArr) {
        return yAxis_arr.map((field, i) => {
          const collection = yAxis_Selectd_Cln[i]?.label || yAxis_Selectd_Cln[i]?.value;
          const calc = CalculationArr[i] || "count";
          return { field, collection, calc: calc.toLowerCase() };
        }).filter(entry => entry.field && entry.collection && entry.calc);
      }

      


    const LoadedData = async (value, mode, indx) => {
        console.log(' Area value , mode :>> ', value, mode, indx);
        try {

            const addon =await buildAdditionalFields( dataRetreived.yAxis_arr, dataRetreived.yAxis_Selectd_Cln, dataRetreived.CalculationArr);
            console.log('addon :>> ', addon);


            const filters = [];
            if( queryFilter ){
              console.log("queryFilter")
             
      
              const collectionName = "cln_adt_pbd_endpoints";
              
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
              
              console.log("???filters????", filters);
          }
        

            if (dataRetreived.selected_cln_name !== undefined) {
                const data = {
                    collection_name: dataRetreived.selected_cln_name.cln_name,
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    db_name: dbInfo.db_name,
                    primary_key: {},
                    selected_primary_key: value,
                    selected_primary_value: {},
                    chart_position: mode,
                    // additional_fields: dataRetreived?.yAxis_arr,

                    // additional_fields: [
                    //     { field: "qty", collection: "ReportCheck_orderitems", calc: "avg" },
                    //     { field: "product_id", collection: "ReportCheck_products", calc: "count" },
                    //     { field: "price", collection: "ReportCheck_orderitems", calc: "avg" }
                    // ],
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
                    chartType:'1',
                    relationshipdata: reportSlice.pageNodeInfo?.relationships,
                    collections: reportSlice.pageNodeInfo.selected_cln_name ,
                    chartName: dataRetreived.name,


                   
                    filters
            
                }


                const response = await urlSocket.post("report/retrive-areachart-data", data)
                console.log('response  Area Chart:>> ', response);

                // var response = await dispatch(retriveClnPrimaryValue(data))
                // console.log('response 108 Area :>> ', response);

                if (response.status === 200) {

                    if (response.data.data.length > 0) {
                        // if (mode === "1") {
                        // setchartData(response.data.x_label)
                        // setchartData( response.data.x_label[0][calc])

                        var updating_layObj = { ...dataRetreived };
                        updating_layObj.data = response.data.data;
                        updating_layObj.chnaged = false;
                        updating_layObj.configured = true


                        var layoutArr = [...reportSlice.layoutInfo]

                        // Update the specific index by merging properties properly
                        layoutArr[props.indexes] = {
                            ...layoutArr[props.indexes],
                            ...updating_layObj // Spread the properties of updating_layObj directly
                        };




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






                        console.log('layoutArr  after:>> ', layoutArr, " layoutArr[props.indexes]", layoutArr[props.indexes]);
                        console.log('reportSlice  after updation:>> ', reportSlice.layoutInfo);
                        setChartsLoad(true)
                        setchartData(response.data.data)
                        await dispatch(
                            updateLayoutInfo({
                                index: props.indexes,
                                updatedObject: updating_layObj,
                            })
                        )
                        // }

                    }
                    else {

                        var updating_layObj = { ...dataRetreived };
                        updating_layObj.data = response.data.data;
                        updating_layObj.chnaged = false;
                        updating_layObj.configured = true


                        var layoutArr = [...reportSlice.layoutInfo]

                        // Update the specific index by merging properties properly
                        layoutArr[props.indexes] = {
                            ...layoutArr[props.indexes],
                            ...updating_layObj // Spread the properties of updating_layObj directly
                        };


                        setChartsLoad(true)
                        setchartData([])
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


    // if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined && dataRetreived.data?.[0]?.[calc]) {
    //     console.log('data 278',  dataRetreived);
    //     if (dataRetreived.data[0][calc][0] !== undefined) {
    //         var datakeys = Object.keys(dataRetreived.data[0][calc] !== undefined ? dataRetreived.data[0][calc][0] : dataRetreived.data[0]).filter(key => key !== 'year' && key !== "_id");
    //         console.log('datakeys 280:>> ', datakeys);
    //     }
    // }
    // else {
    //     console.log('data 284', props.chart_data);
    //     var datakeys = Object.keys(  props.chart_data.length > 0 &&  props.chart_data[0]).filter(key => key !== 'year' && key !== "_id");
    //     console.log('datakeys 293:>> ', datakeys);
    // }





    if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined) {
        // console.log('data 278', data, dataRetreived);
        if (chartData?.[0] !== undefined) {
            var datakeys = Object.keys(chartData[0] !== undefined ? chartData[0] : chartData[0]).filter(key => key !== 'name' && key !== "_id");
            // console.log('datakeys 280:>> ', datakeys);
        }
    }
    else {
        // console.log('data 284', props.chart_data);
        var datakeys = Object.keys(props.chart_data.length > 0 && props.chart_data[0]).filter(key => key !== 'name' && key !== "_id");
        // console.log('datakeys 293:>> ', datakeys);
    }






    // if (chartData && Array.isArray(chartData) && chartData?.length > 0) {
    //     // var datakeys = Object.keys(chartData[0]).filter(key => key !== 'year' && key !== "_id");
    //      var datakeys = Object.keys( chartData[0][calc] !== undefined ? chartData[0][calc][0] : chartData[0]).filter(key => key !== 'year' && key !== "_id");

    //     var datakeys_name = Object.keys(chartData[0]).filter(key => key === 'year' && key !== "_id");
    // }

    useEffect(() => {
        var mod_data;
        if (datakeys !== undefined && datakeys.length > 0) {
            var chart_id = i;
            var dataSeries1;
            if (reportSlice[chart_id] && reportSlice[chart_id].linesorted) {
                mod_data = reportSlice[chart_id].linesorted;
            }
            else if (reportSlice.layoutInfo[props.indexes]?.configured && reportSlice.layoutInfo[props.indexes].data?.[0]) {
                mod_data = reportSlice.layoutInfo[props.indexes].data

            }
            else {
                mod_data = props.chart_data
            }


            console.log('mod_data 259 :>> ', mod_data);
            // else {
            //     if (chartData === undefined || chartData.length === 0) {
            //         mod_data = [
            //             { year: '10006', y1: 316, y2: 20, y3: 15 },
            //             { year: '10008', y1: 405, y2: 25, y3: 40 },
            //             { year: '10015', y1: 203, y2: 15, y3: 100 },
            //         ];
            //     } else {
            //         mod_data = chartData;
            //     }
            // }



            // if (mod_data[0][calc] !== undefined) {
            //     mod_data = mod_data[0][calc]
            //   }




            // if(props.repeat_chart === false){
            // var updt_data = groupData(mod_data)
            // mod_data = updt_data
            // }

            console.log('mod_data Area :>> ', mod_data);


            if (reportSlice.layoutInfo[props.indexes]?.filtered_data) {
                mod_data = reportSlice.layoutInfo[props.indexes].filtered_data
            }

            if (mod_data !== undefined && mod_data.length > 0) {
                if (Array.isArray(mod_data)) {
                    dataSeries1 = [mod_data];
                }
                console.log('dataSeries1 :>> ', dataSeries1);


                // Step 1: Get all unique keys from data
                const allKeys = Array.from(
                    new Set(dataSeries1[0].flatMap(d => Object.keys(d)))
                ).filter(k => k !== "name"); // exclude 'name'

                // Step 2: Normalize each entry
                const normalizedData = dataSeries1[0].map(entry => {
                    const newEntry = { name: entry.name };
                    allKeys.forEach(key => {
                        newEntry[key] = Number.isFinite(entry[key]) ? entry[key] : 0;
                    });
                    return newEntry;
                });

  

console.log('normalizedData :>> ', normalizedData , allKeys);

dataSeries1 = [normalizedData];
                // const keys = Object.keys(dataSeries1[0][0]).filter((key) => key !== 'year');
                const keys = dataSeries1?.[0]?.[0]
                    ? Object.keys(dataSeries1[0][0]).filter((key) => key !== 'name')
                    : [];
                console.log('Keys:', keys);

                const stack = d3.stack()
                    .keys(keys)
                    .order(d3.stackOrderNone)
                    .offset(d3.stackOffsetNone);
                const stackedData = stack(dataSeries1[0]);
                const margin = { top: 70, right: 80, bottom: 90, left: 80 };
                if (svgHeight !== undefined && svgHeight !== '') {
                    containerHeight = containerHeight - 200
                }
                var width
                var height
                if (fullScreen_enabled !== undefined && fullScreen_enabled !== false) {
                    width = temp_containerWidth + margin.left + margin.right + 100;
                    height = temp_containerHeight - margin.bottom - (enabledTable ? 200 : 0)
                    containerWidth = width
                }
                else {
                    width = containerWidth - margin.left - margin.right;
                    height = containerHeight - margin.top - margin.bottom;
                }
                const svg1 = d3.selectAll(`#my_dataviz${i}`);
                svg1.selectAll('*').remove();
                const drag = d3.drag()
                    .on("drag", dragged)


                    console.log(' Area width :>> ', width , containerWidth);
                const svg = d3.select(`#my_dataviz${i}`)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .data(dataSeries1[0])
                    .attr("transform", `translate(${margin.left},${margin.top})`)

                d3.select(`#my_dataviz${i}`)
                    .call(drag);

                function dragged(event, d) {
                    const isChartAreaPath = d3.select('.area')
                    const isXAxis = d3.select('.x-axis');
                    if (isChartAreaPath || isXAxis) {
                        const deltaX = event.dx;
                        let newX = 0;
                        if (isChartAreaPath) {
                            newX = parseFloat(svg.attr("transform").split("(")[1].split(",")[0]) + deltaX;
                        } else if (isXAxis) {
                            newX = parseFloat(svg.attr("transform").split("(")[1].split(",")[0]) + deltaX;
                        }
                        if (isChartAreaPath) {
                            
                            if (newX >= 40) {

                                svg.attr("transform", `translate(${margin.left},${margin.top})`);
                            }

                            else if (newX < 0) {
                                svg.attr("transform", `translate(${newX},${margin.top})`);
                            }
                            else {
                                svg.attr("transform", `translate(${newX},${margin.top})`);
                            }
                        } else if (isXAxis) {
                            xScale.attr("transform", `translate(${newX},0)`);
                        }
                    }
                }

                // const color = d3.scaleOrdinal()
                //     .domain(datakeys)
                //     .range(chart_color !== undefined && chart_color.length > 0
                //         ? chart_color
                //         : d3.quantize(d3.interpolateRainbow, datakeys.length + 2));


               
                // // Create a color scale with fallback
                // const color = d3.scaleOrdinal()
                //     .domain(datakeys)
                //     .range(datakeys.map(key => choosedColors[key] || d3.schemeCategory10[datakeys.indexOf(key) % 10]));

                // // Example usage:
                // datakeys.forEach(key => {
                //     console.log(`Color for ${key}:`, color(key));
                // });

                // Helper to generate random hex color
const getRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');



// Log each key and its mapped color
const colorMappingArray = datakeys.map(key => {
    const chosen = choosedColors?.[key];
    const finalColor = chosen ?? getRandomColor();
    console.log(`Color for key "${key}":`, chosen ? `(from choosedColors) ${finalColor}` : `(random) ${finalColor}`);
    return finalColor;
  });
  
  // Create color scale
  const color = d3.scaleOrdinal()
    .domain(datakeys)
    .range( choosedColors??length > 0 ?  colorMappingArray: d3.quantize(d3.interpolateRainbow, datakeys.length + 2));

    

    
// const color = d3.scaleOrdinal()
//   .domain(datakeys)
//   .range(datakeys.map(key => choosedColors?.[key] ?? getRandomColor()));

// Example usage
// mod_data.forEach(d => {
//     datakeys.forEach(key => {
//       const value = d?.[key] ?? 0;
//       console.log(`Value for ${key} in ${d.name}:`, value);
//     });
//   });
  

                // const color =  d3.scaleOrdinal() .domain(datakeys).range( d3.quantize(d3.interpolateRainbow, datakeys.length + 2))
                

                const text_color = d3.scaleOrdinal()
                    .domain(datakeys)
                    .range(text_color_arr !== undefined && text_color_arr.length > 0
                        ? text_color_arr
                        : d3.quantize(d3.interpolateRainbow, datakeys.length + 2));

                const xScale = d3.scalePoint()
                    .domain(dataSeries1[0].map(d => d.name))
                    .range([0, width])
                const yScale = d3.scaleLinear()
                    .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])])
                    .range([height, 0]);
                yScale.domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]);
                datakeys.forEach((key, index) => {
                    const gradient = svg.append("defs")
                        .append("linearGradient")
                        .attr("id", `gradient-${key}`)
                        .attr("class", "area overlay")
                        .attr("x1", "0%")
                        .attr("x2", "0%")
                        .attr("y1", "0%")
                        .attr("y2", "100%");
                    gradient.append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", (chart_color?.length > 0 && chart_color[index] !== undefined) ? chart_color[index] : color(key));
                    gradient.append("stop")
                        .attr("offset", "80%")
                        .attr("stop-color", (chart_color?.length > 0 && chart_color[index] !== undefined) ? chart_color[index] : color[index])
                        .attr("stop-opacity", 0);
                });

                const hoverLine = svg.append("line")
                    .attr("class", "hover-line")
                    .style("stroke", "black")
                    .style("stroke-width", 2)
                    .style("stroke-dasharray", "3,3")
                    .attr("x1", 0)
                    .attr("x2", 0)
                    .attr("y1", 0)
                    .attr("y2", height)
                    .style("pointer-events", "none")
                const g = svg.append('g')
                svg.on('mouseover', Multimouseverd)
                svg.on('mousemove', Multimouseverd)
                svg.on("mouseout", function (event, d) {
                    const tooltip = d3.select(`#tooltip${i}`);
                    tooltip.transition()
                        .duration(50)
                        .remove()
                    // .style("opacity", 0);
                    hoverLine.transition()
                        .duration(50)
                        .style("opacity", 0);
                    setShowOptions(false)
                })

                function Multimouseverd(event, d) {
                    if (mouseoverEnabled) {
                        if (mouseovered_type) {
                            const mouseX = d3.pointer(event)[0];
                            const mouseY = d3.pointer(event)[1];
                            hoverLine.attr("x1", mouseX).attr("x2", mouseX);
                            let isMouseOverNode = false;
                            areaGroups.selectAll('circle, rect').each(function (nodeData) {
                                const dataPoint = nodeData;
                                if (dataPoint !== undefined) {
                                    const node = d3.select(this);
                                    const nodeX = parseFloat(node.attr('cx') || node.attr('x'));
                                    const nodeY = parseFloat(node.attr('cy') || node.attr('y'));
                                    if (Math.abs(mouseX - nodeX) < 8 && Math.abs(mouseY - nodeY) < 8) {
                                        isMouseOverNode = true;
                                    }
                                }
                            });
                            const tooltip = d3.select(`#tooltip${i}`);

                            hoverLine.transition()
                                .duration(0)
                                .style("opacity", isMouseOverNode ? 9 : 0);
                        }
                    }
                }
                // const area = d3.area()
                // .defined(d =>
                //      (d &&
                //     Array.isArray(d) &&
                //     Number.isFinite(d[0]) &&
                //     Number.isFinite(d[1]) )
                // )
                //     .x(d => xScale(d.data.name) + xScale.bandwidth() / 2)
                //     .y0((d) => { console.log('d 558', d)
                //         return   yScale(d[0])})
                //     .y1(d => yScale(d[1]))
                //     .curve(d3.curveCardinal)



                const area = d3.area()
    .x(d => xScale(d.data.name) + xScale.bandwidth() / 2)
    .y0(d => Number.isFinite(d[0]) ? yScale(d[0]) : yScale(0))  // fallback to 0
    .y1(d => Number.isFinite(d[1]) ? yScale(d[1]) : yScale(0))  // fallback to 0
    .curve(d3.curveCardinal); // or any other preferred curve

                const areaGroups = svg.selectAll(`g.area-group${i}`)
                    .data(stackedData)
                    .enter()
                    .append("g")
                    .attr("class", `area-group${i}`)
                areaGroups
                    .append("path")
                    .attr("class", `area${i}`)
                    // .attr("fill", (d, i) => `url(#gradient-${d.key})`)
                    .attr("fill", d => color(d)) 
                    .attr("d", area)
                areaGroups.each(function () {
                    this.parentNode.insertBefore(this, this.parentNode.firstChild);
                });
                var newContainerWidth = containerWidth + scrollDelta;
                var newXscale = xScale.range([0, newContainerWidth - margin.left - margin.right]);
                if (newContainerWidth > containerWidth) {
                    xScale.range([0, newContainerWidth - margin.left - margin.right]);
                    g.append("g").attr('width', newContainerWidth);
                } else {
                    xScale.range([0, containerWidth - margin.left - margin.right]);
                    g.append("g").attr('width', containerWidth);
                }
                d3.selectAll(`.area${i}`).remove()
                areaGroups
                    .append("path")
                    .attr("class", `area${i}`)
                    // .attr("fill", (d, i) => `url(#gradient-${d.key})`)
                    .attr("fill", d => color(d)) 
                    .attr("d", area)
                if (newContainerWidth >= containerWidth) {
                    d3.select(`#my_dataviz${i}`).on('wheel', handleScroll);

                }
                else {
                    setScrollDelta(0)
                }
                if (!show_Square) {
                    var rectangles = areaGroups.selectAll('circle')
                        // .data(d => {
                        //     return ((d.key != '_id') ? d : '');
                        // })
                        .data(d => {
                            // Filter out the entries where the difference between d[1] and d[0] is zero
                            // console.log("@@@@@@@", d.filter(item => (item[1] - item[0]) !== 0) , d.filter(item => (  item[1] -  item[0]) !== 0 ));


                            console.log(
                                "@@@@@@@",
                                d.filter(item =>
                                  item &&
                                  typeof item[0] === 'number' &&
                                  typeof item[1] === 'number' &&
                                  !isNaN(item[0]) &&
                                  !isNaN(item[1]) &&
                                  (item[1] - item[0]) !== 0
                                )
                              );
                              
                            return d.filter(item =>
                                item &&
                                typeof item[0] === 'number' &&
                                typeof item[1] === 'number' &&
                                !isNaN(item[0]) &&
                                !isNaN(item[1]) &&
                                (item[1] - item[0]) !== 0
                              );
                            // d.filter(item => ( isNaN(item[1]) && item[1] - isNaN(item[0]) && item[0]) !== 0 );
                        })

                        .enter().append('rect')
                        .attr('x', (d) => xScale(d.data.name) + xScale.bandwidth() / 2 - 5)
                        .attr('y', (d) => yScale(d[1]) - 5)
                        .attr('width', 8)
                        .attr('height', 8)
                        .attr('fill', 'white')
                        .attr('stroke', 'black')
                        .style('pointer-events', 'all')
                        .on('mouseover', handleMouseOver)
                        .on('mousemove', handleMouseOver)
                        .on('mouseout', handleMouseOut)
                        .style('cursor', 'pointer')
                        .raise()
                    rectangles.each(function () {
                        this.parentNode.appendChild(this);
                    });
                } else {
                    areaGroups.selectAll('circle')
                        // .data(d => {
                        //     return ((d.key != '_id') ? d : '');
                        // })
                        .data(d => {
                            // Filter out the entries where the difference between d[1] and d[0] is zero
                            return d.filter(item => (item[1] - item[0]) !== 0);
                        })
                        .enter().append('circle')
                        .attr('cx', (d) => xScale(d.data.name) + xScale.bandwidth() / 2)
                        .attr('cy', (d) => yScale(d[1]))
                        .attr('r', 4)
                        .attr('fill', 'white')
                        .attr('stroke', 'black')
                        .attr('stroke-width', 2)
                        .style('pointer-events', 'all')
                        .on('mouseover', handleMouseOver)
                        .on('mousemove', handleMouseOver)
                        .on('mouseout', handleMouseOut)
                        .style('cursor', 'pointer')
                        .raise()
                }

                const renderText = (areaGroups, stackedData, text_color) => {
                    areaGroups.selectAll('text').remove();
                    stackedData.forEach((seriesData, seriesIndex) => {
                        areaGroups
                            .selectAll(`.text-${seriesIndex}`)
                            .data(seriesData)
                            .enter()
                            .append('text')
                            .attr('class', `text-${seriesIndex}`)
                            .text(d => {
                                const textValue = d[1] - d[0];
                                return isNaN(textValue) ? '' : (textValue).toFixed(2);
                            })
                            .attr('x', d => {
                                const xPos = xScale(d.data.name);
                                return isNaN(xPos) ? 0 : xPos + xScale.bandwidth() / 2;
                            })
                            .attr('y', d => {
                                const yPos = yScale(d[1]);
                                return isNaN(yPos) ? 0 : yPos - 20;
                            })
                            .attr('text-anchor', 'middle')
                            .attr('fill', text_color(seriesData.key))
                            .attr('dominant-baseline', 'middle');
                    });
                };

                if (show_bar_values) {
                    renderText(areaGroups, stackedData, text_color);
                }
                // const axisLabels = svg.append("g")
                //     .attr("transform", `translate(0,${height})`)
                //     .call(d3.axisBottom(xScale))
                //     .selectAll('text')
                //     .style("text-anchor", "middle")
                //     .attr("font-size", "14px")
                //     .attr('fill', 'black')
                //     .style("text-transform", "capitalize")
                //     .style("font-weight", (d, i) => i % 2 === 0 ? "bold" : "normal")
                //     .style('cursor', 'pointer')
                // let rotationAngle = 0;
                // axisLabels.each(function (_, i) {
                //     const label = this;
                //     d3.select(label).on('click', function () {
                //         const currentRotation = rotationAngle === 0 ? -45 : 0;
                //         const currentAnchor = rotationAngle === 0 ? 'end' : "middle";
                //         axisLabels.attr('transform', `rotate(${currentRotation})`)
                //             .style("text-anchor", currentAnchor)
                //         rotationAngle = currentRotation;
                //     });
                // });



                const charLimit = 5;
                const axisLabels = svg.append("g")
                    .attr("transform", `translate(0,${height})`)
                    .call(d3.axisBottom(xScale))
                    .selectAll('text')
                    .style("text-anchor", "end")
                    .attr("font-size", "14px")
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
                //     .attr('class', 'textHover')
                //     .style('position', 'absolute')
                //     .style('background', '#f9f9f9')
                //     .style('padding', '5px')
                //     .style('border', '1px solid #ccc')
                //     .style('border-radius', '5px')
                //     .style('pointer-events', 'none')
                //     .style('visibility', 'hidden')
                //     .style('font-size', '12px');

                axisLabels.on('mouseover', function (event, d) {
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
                        .duration(500)  // Smooth fade-in in 300ms
                        .style('opacity', 1)
                        .style("pointer-events", "none")


                    // Determine the tooltip content
                    const tooltipText = (!d || typeof d !== 'string') ? "(blank)" : d;
                    tooltip.text(tooltipText);
                    // const tooltipText = (!d || typeof d !== 'string') ? "(blank)" : d;
                    // tooltip.style('visibility', 'visible')
                    //     .text(tooltipText);
                })
                    .on('mousemove', function (event) {
                        const tooltip = d3.select('.textHover');
                        if (!tooltip.empty()) {
                            tooltip.style('top', `${event.pageY + 10}px`)
                                .style('left', `${event.pageX + 10}px`);
                        }

                        // tooltip.style('top', `${event.pageY + 10}px`)
                        //     .style('left', `${event.pageX + 10}px`);
                    })
                    .on('mouseleave', removeTooltip)  // Call function to remove tooltips
                    .on('mouseout', removeTooltip);  // Also remove on mouseout






                const yAxisContainer = d3.select(`#my_dataviz${i}`)
                    .attr('class', 'y-axis')
                    .append("div")
                    .style("position", "absolute")
                    .style("top", `${0}px`)
                    .style("left", "0")
                    .style("width", `${margin.left}px`)
                    .style("height", `${containerHeight - 100}px`);
                const yAxis = yAxisContainer.append("svg")
                    .attr("width", '100%')
                    .attr("height", fullScreen_enabled ? temp_containerHeight : containerHeight)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`)
                    .call(d3.axisLeft(yScale).ticks(fullScreen_enabled ? 20 : containerHeight / 50))
                    .selectAll('.domain, text')
                    .attr('stroke', fullScreen_enabled ? 'black' : 'black')
                    .style("font-size", '10px')
                    .call(g => g.select(".domain").remove())

                yAxis.select(".domain")
                    .attr("transform", `translate(${-60}, 0)`);
                yAxis.select(".domain")
                    .style("stroke", 'green');
                yAxis.select(".domain")
                    .style("stroke-width", 2);
                yAxis.selectAll("text")
                    .attr('class', 'yAxis-text')
                    .attr("x", -10)
                    .attr('fill', 'black')
                    .attr("dx", "-3.99em")
                    .style('font-weight', 'bold')
                    .style("font-size", '12px');
                yAxis.selectAll("line")
                    .attr("transform", `translate(${-50}, 0)`)
                    .attr('stroke', 'black')
                    .attr("dx", "-2em");
                svg
                    .attr("width", 2000)
                if (show_Grid) {
                    svg.insert('g', ':first-child')
                        .attr('class', 'grid')
                        .attr('transform', `translate(0, ${height})`)
                        .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''))
                        .selectAll('line')
                        .attr('stroke', 'green');
                }

                if (show_Grid) {
                    svg.insert('g', ':first-child')
                        .attr('class', 'grid')
                        .call(d3.axisLeft(yScale).ticks(5).tickSize(-newContainerWidth).tickFormat(''))
                        .selectAll('line')
                        .attr('stroke', 'lightgrey');
                } else {
                    svg.selectAll('.grid').remove();
                }
                var datakeys_mod
                if (YLabel.length > 0) {
                    datakeys_mod = YLabel.slice(1)
                }
                else {
                    datakeys_mod = datakeys
                }
                d3.selectAll('.line-label ,label-group ').remove();


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
                if (enabledTable) {
                    show_table_fn(true, dataRetreived.data)
                }
                else {
                    show_table_fn(false)
                }

                const handleResetButtonClick = () => {
                    setScrollDelta(0);
                    xScale.range([0, containerWidth - margin.left - margin.right])
                    svg.attr("width", containerWidth)
                    svg.attr("transform", `translate(${margin.left},${margin.top})`)
                };

                if (i === reportSlice.resetCharts.i) {
                    handleResetButtonClick();
                    dispatch(setResetCharts([]));
                }

                // document.getElementById(`togglereset-${i}`).addEventListener('click', function (event) {
                //     handleResetButtonClick()
                // })
            }
            if (mod_data?.length === 0) {
                d3.select(`#my_dataviz${i}`).selectAll("svg").remove();
                d3.select(`#my_dataviz${i}`).selectAll("div").remove();

                d3.select(`#legend${i}`).remove();

                d3.select(`#my_dataviz${i}`)
                    .append("div")
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("justify-content", "center")
                    .style("height", `${containerHeight}px`) // Use the containerHeight
                    .style("font-size", "16px")
                    .style("color", "grey")
                    .style("background-size", "21% 100%") // Adjust the image to fit container's width and height
                    .style("background-repeat", "no-repeat") // Prevent the image from repeating
                    .style("background-position", "center") // Center the image
                    .text("No data available");

                return; // Exit to avoid rendering the chart
            }


        }
        else {

            if (chart_data.length === 0) {
                d3.select(`#my_dataviz${i}`).selectAll("svg").remove();
                d3.select(`#my_dataviz${i}`).selectAll("div").remove();

                d3.select(`#legend${i}`).remove();

                d3.select(`#my_dataviz${i}`)
                    .append("div")
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("justify-content", "center")
                    .style("height", `${containerHeight}px`) // Use the containerHeight
                    .style("font-size", "16px")
                    .style("color", "grey")
                    .style("background-size", "21% 100%") // Adjust the image to fit container's width and height
                    .style("background-repeat", "no-repeat") // Prevent the image from repeating
                    .style("background-position", "center") // Center the image
                    .text("No data available");

                return; // Exit to avoid rendering the chart
            }

        }
    },
        //    [ props , chartsLoad , scrollDelta]
        [containerWidth, containerHeight, chart_color, textColorBar, showGridEnabled, temp_containerWidth, fullScreen_enabled, temp_containerHeight, sortdata, YLabel, enable_table, enabledTable, svgHeight, show_Square, mouseovered_type, mouseovered, show_bar_values, reportSlice, zoomLevel, scrollDelta, text_color_arr, chartData, chartsLoad , choosedColors]
    )

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
        setGroupeddata(groupedData)
        return groupedData

    }
    const show_table_fn = async (val, TData) => {
        console.log('TData :>> ', TData, val);

        var updtData
        console.log('data show_table_fn:>> ', props.chart_data);

        if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined && dataRetreived.data?.[0]?.[calc]) {
            updtData = dataRetreived.data?.[0]?.[calc]
        }
        else {
            updtData = props.chart_data
        }



        if (reportSlice.layoutInfo[props.indexes]?.filtered_data) {
            updtData = reportSlice.layoutInfo[props.indexes].filtered_data
        }



        console.log('updtData  Area:>> ', updtData);

        if (updtData?.length > 0) {
            // var updtData = groupData(chartData)
            const fieldNames = Object.keys(updtData[0]).filter(key => key !== "_id");
            if (val) {
                await tabulate(updtData, fieldNames)
            }
            else {
                d3.selectAll(`#tableContainer${i}`).selectAll("table").remove();
            }
        }

    }


    useEffect(() => {
        if (i === reportSlice.zoomInStatus.i) {
            handlePlusIconClick(true);
            dispatch(setZoomInStatus([]));
        } else if (i === reportSlice.zoomOutStatus.i) {
            handlePlusIconClick(false);
            dispatch(setZoomOutStatus([]));
        } else {
        }
    }, [reportSlice.zoomInStatus, reportSlice.zoomOutStatus]);


    // Function to remove all tooltips
    function removeTooltip() {
        d3.selectAll('.textHover').remove();  // Remove all tooltip instances
    }


    async function handlePlusIconClick(value) {
        let deltaYExtension;
        if (value) {
            deltaYExtension = 100;
        } else {
            if (scrollDelta < 0) {
                deltaYExtension = 0;
            }
            else {
                deltaYExtension = -100;
            }

        }
        const wheelEvent = new WheelEvent("wheel", {
            deltaY: deltaYExtension,
            view: window,
            bubbles: true,
            cancelable: true
        });
        handleScroll(wheelEvent)
    }


    const handleScroll = (event) => {
        event.preventDefault()
        removeTooltip()
        const delta = event.deltaY;
        setScrollDelta(prevDelta => prevDelta + delta);
        const newZoomLevel = zoomLevel + (delta > 0 ? -0.1 : 0.1);
        if (newZoomLevel > 0) {
            setZoomLevel(newZoomLevel);
        }
    };


    const tabulate = async (data, columns, y_axis_name) => {
        const header = columns;
        var data_exist;
        if (data !== undefined) {
            data_exist = data;
        } else {
            data_exist = data;
        }

        console.log('data_exist  767:>> ', data_exist);
        var tableContainer = document.getElementById(`tableContainer${i}`);
        if (tableContainer !== null) {
            tableContainer.innerHTML = ""; // Clear previous content

        }
        var table = d3.select(`#tableContainer${i}`)
            .attr("class", "table-responsive")
            .append("table")
            // .style("width", `${fullScreen_enabled ? temp_containerWidth : containerWidth - 12}px`);

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
            .text(function (column) { return column; })
            .attr("style", "text-align: center")
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
            // .html(function (d) {
            //     // Check if the value is a number
            //     if (typeof d.value === 'number') {
            //         return d.value.toFixed(2);
            //     }
            //     return d.value;
            // })
            .html(function (d) {
                const value = d.value ?? 0; // fallback to 0 if undefined or null
                if (typeof value === 'number') {
        
                  return formated_number(value);
                }
                return value;
              })
            .attr("style", "text-align: center")
            .style('color', 'black')
        return table;
    }

    const formated_number = (val) => {
        var formattedValue = (val % 1 === 0)
          ? val?.toString()
          : val?.toFixed(2);
        return formattedValue
      }

      
    const handleMouseOver = (event, d) => { // Mouse over event handler
        console.log("mouseoverEnabled--->", mouseoverEnabled , mouseovered_type);
        if (mouseoverEnabled) {
            if (mouseovered_type) {
                const svg = d3.select(`#my_dataviz${i}`)
                const hoverLine = svg.append("line")
                const [mouseX, mouseY] = d3.pointer(event, this);
                hoverLine.attr("x1", mouseX).attr("x2", mouseX);
                let isMouseOverNode = false;
                const areaGroups = svg.selectAll(`g.area-group${i}`)
                areaGroups.selectAll('circle, rect').each(function (nodeData) {
                    const dataPoint = nodeData;

                    if (dataPoint !== undefined) {
                        const node = d3.select(this);
                        const nodeX = parseFloat(node.attr('cx') || node.attr('x'));
                        const nodeY = parseFloat(node.attr('cy') || node.attr('y'));

                        if (Math.abs(mouseX - nodeX) < 8 && Math.abs(mouseY - nodeY) < 8) {
                            isMouseOverNode = true;
                        }
                    }
                });
                var tooltip = d3.select(`#tooltip${i}`);
                if (isMouseOverNode) {

                    if (tooltip.empty()) {
                        tooltip = d3.select(`#my_dataviz${i}`)
                            .append("div")
                            .attr("id", `tooltip${i}`)
                            .style("position", "absolute")
                            .style("opacity", 0.9)
                            .style("padding", "10px")
                            .style("border-radius", "5px")
                            .style("background-color", "white")
                            .style("pointer-events", "none")
                    }

                    tooltip.transition()
                        .duration(50)
                        .style("opacity", 0.9);

                    let tooltipLeft, tooltipTop;

                    if (mouseY < containerHeight / 2) {
                        tooltipTop = mouseY + 80;
                    } else {
                        tooltipTop = mouseY - 20;
                    }

                    const numericValues = Object.entries(d.data)
                        .filter(([key, value]) => key !== 'name' && !isNaN(value))
                        .map(([key, value]) => parseFloat(value));
                    const totalValue = numericValues.reduce((acc, value) => acc + parseFloat(value), 0);
                    const totalContent = `<div class="tooltip-content"><strong style="color: black;">Total:</strong> <span style="color: black;">${totalValue.toFixed(2)}</span></div>`;
                    const tooltipContent = Object.entries(d.data)
                        .filter(([key, value]) => key !== '_id' && key !== 'name')
                        .map(([key, value]) => `<div class="tooltip-content" ><strong style="color: black;">${key}:</strong> <span style="color: black;">${value.toFixed(2)}</span></div>`)
                        .join('');

                    tooltip.html(`Name: ${d.data.name}<br>${tooltipContent}${(totalContent)}`)

                    var chartContainer = d3.select(`#my_dataviz${i}`).node();
                    var chartContainerRect = chartContainer.getBoundingClientRect();
                    var divX = chartContainerRect.left + window.scrollX;
                    var divY = chartContainerRect.top + window.scrollY;

                    const tooltipNode = tooltip.node();
                    const tooltipRect = tooltipNode.getBoundingClientRect();
                    const tooltipWidth = tooltipRect.width;
                    const tooltipHeight = tooltipRect.height;



                    let leftPosition = event.pageX - divX + 20;
                    let topPosition = event.pageY - divY - 10;

                    if (topPosition + tooltipHeight > chartContainerRect.height) {
                        topPosition -= tooltipHeight;
                    }
                    if (leftPosition + tooltipWidth > chartContainerRect.width) {
                        leftPosition = event.pageX - divX - tooltipWidth - 10; // Move to the left of the cursor
                    }

                    tooltip.style("left", `${leftPosition}px`)
                        .style("top", `${topPosition}px`);
                } else {
                    tooltip.transition()
                        .duration(50)
                        // .style("opacity", 0);
                        .remove()
                }

                hoverLine.transition()
                    .duration(0)
                    .style("opacity", isMouseOverNode ? 9 : 0);
            }
            else {
                var tooltip = d3.select(`#tooltip${i}`);
                const name = d.data.name;
                // const mouseY = d3.pointer(event)[1];
                // const mouseX = event.offsetX
                // let tooltipLeft = mouseX < containerWidth / 2 ? mouseX + 90 : mouseX - 120;
                // let tooltipTop = mouseY < containerHeight / 2 ? mouseY + 100 : mouseY - 40;


                var chartContainer = d3.select(`#my_dataviz${i}`).node();
                var chartContainerRect = chartContainer.getBoundingClientRect();
                var divX = chartContainerRect.left + window.scrollX;
                var divY = chartContainerRect.top + window.scrollY;


                if (tooltip.empty()) {
                    tooltip = d3.selectAll(`#my_dataviz${i}`)
                        .append("div")
                        .attr("id", `tooltip${i}`)
                        .style("position", "absolute")
                        .style("opacity", 0.9)
                        .style("padding", "10px")
                        .style("border-radius", "5px")
                        .style("background-color", "white")
                        .style("pointer-events", "none")

                }

                tooltip.html(
                    `<div class="tooltip-content"><strong style="color: black;">${barLabel}:</strong> <span style="color: black;">${name}</span></div>` +
                    `<div class="tooltip-content"><strong style="color: black;">Value:</strong> <span style="color: black;">${(d[1] - d[0]).toFixed(2)}</span></div>`
                )

                const tooltipNode = tooltip.node();
                const tooltipRect = tooltipNode.getBoundingClientRect();
                const tooltipWidth = tooltipRect.width;
                const tooltipHeight = tooltipRect.height;


                let leftPosition = event.pageX - divX + 20;
                let topPosition = event.pageY - divY - 10;

                if (topPosition + tooltipHeight > chartContainerRect.height) {
                    topPosition -= tooltipHeight;
                }
                if (leftPosition + tooltipWidth > chartContainerRect.width) {
                    leftPosition = event.pageX - divX - tooltipWidth - 10; // Move to the left of the cursor
                }

                tooltip.style('left', `${leftPosition}px`)
                    .style('top', `${topPosition - 30}px`)
                    .style('opacity', 0.8);
            }
        }
    };
    const handleMouseOut = () => {
        const tooltip = d3.selectAll(`#tooltip${i}`);
        tooltip.transition().duration(100).remove()
    };
    return (
        <div>

            <div id={`tooltip${i}`} style={{ position: 'absolute', opacity: 0.9, padding: '10px', borderRadius: '5px', backgroundColor: 'White'  , pointerEvents:'none' }}></div>

            {
                chartsLoad ?
                    <>
                        <div id={`my_dataviz${i}`} onMouseLeave={() => { setShowOptions(false); setSortShowOptions(false); }}
                        >
                            <svg ref={svgRef} width={(fullScreen_enabled ? temp_containerWidth : containerWidth)} ></svg>
                        </div>
                        {/* <div className="legend" id={`legend${i}`} style={{ position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'centre', marginLeft: containerWidth / 3, marginTop: '-40px', boxShadow: 'none' }}></div> */}

                        {
                            show_Legend ?
                                <div 
                                // className="legend" 
                                className={`legend ${fullScreen_enabled ? "my-4" : ""}`}
                                id={`legend${i}`} style={{ position: '', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', boxShadow: 'none', marginTop: '-30px' }}></div>
                                :
                                null}

                    </>
                    :
                    // <>
                    //     <Spinner
                    //         color="success"
                    //         className="chartLoader"
                    //         style={{
                    //             position: "fixed",
                    //             top: "50%",
                    //             left: "50%",
                    //         }}
                    //     >
                    //         Loading...
                    //     </Spinner>
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
                        position: 'relative',
                        bottom: 0,
                        left: 0,
                        backgroundColor: '#fff',
                        height: (fullScreen_enabled ? '240px' : '200px'),
                        // width:('2000px')

                    }} id={`tableContainer${i}`}>
                    </div>
                </>
            ) : null}

        </div>
    );
};

export default D3AreaChart;