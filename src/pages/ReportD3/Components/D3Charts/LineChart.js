import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useDispatch, useSelector } from 'react-redux';
import { retriveClnPrimaryValue, updateLayoutInfo, setResetCharts, setZoomInStatus, setZoomOutStatus, toggleProcessingState, sortArea, setSelectedSortredux, sortDescending, sortFunc } from '../../../../Slice/reportd3/reportslice';
import { Spinner } from 'reactstrap';
import "../../LayoutInfo.css"
import urlSocket from '../../../../helpers/urlSocket';


const LineChart = (props) => {
    console.log("Line chart Called!!!", props.containerWidth, props.itemInfo);
    const dispatch = useDispatch();
    const chartRef = useRef();
    var containerWidth = props.containerWidth
    var containerHeight = props.containerHeight
    var chart_data = props.chart_data
    var chart_color = props.chart_color
    var curved_line = props.curved_line
    var mouseovered = props.mouseovered
    var mouseovered_type = props.mouseovered_type !== undefined &&  props.mouseovered_type === 'single' ? false : true
    var i = props.id
    var enable_table = props.show_table
    var svgHeight = props.chart_height
    var show_Grid = props.show_Grid
    var YLabel = props.YLabel
    var show_Square = props.show_Square !== undefined &&  props.show_Square === 'square' ? true : false
    var temp_containerWidth = props.temp_containerWidth
    var temp_containerHeight = props.temp_containerHeight
    var fullScreen_enabled = props.show_Full_Screen_toggle   
    var show_bar_values = props.show_bar_values
    var text_color_arr = props.text_color
    var barLabel = props.label;
    var dataRetreived = props.itemInfo
    var show_Legend = props.show_Legend
    var calc = props.math_calc

    const [data, setData] = useState(chart_data);
    const [textLinecolorbar, setTextLinecolorbar] = useState([])
    const [curved, setCurved] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [mouseoverEnabled, setmouseoverEnabled] = useState(mouseovered)
    const [mouseoverSwitchType, setMouseoverSwitchType] = useState(mouseovered_type)
    const [enabledTable, setEnabledTable] = useState(enable_table)
    const [showDiv, setshowDiv] = useState(false)
    const [showGridenabled, setShowGridenabled] = useState(show_Grid)
    const [sortShowOptions, setSortShowOptions] = useState(false);


    const [sortData, setSortData] = useState([]);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [scrollDelta, setScrollDelta] = useState(0);
    const [chartsLoad, setChartsLoad] = useState(true)

    const [processing, setProcessing] = useState(false)
    const [nodeEnabled, setNodeEnabled] = useState(true)
    // const reportSlice = useSelector(state => state.reportSlice);

    // const dbInfo = {
    //     encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@65.0.69.57:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
    //     db_name: 'hotel_surguru-beta',
    // }

    const reportSlice = useSelector(state => state.reportSliceReducer)
    const ProcessedID = reportSlice.processingData[props.id]


    const AuthSlice = useSelector(state => state.auth);
    const dbInfo = AuthSlice.db_info


  const selectedsortredux = useSelector(state => state.reportSliceReducer.selectedsortredux);






  const selectedvalueRedux= useSelector(state => state.reportSliceReducer.selectedValues);
  console.log('selectedvalueRedux Line :>> ', selectedvalueRedux);






    // useEffect(() => {
    //     if (dataRetreived?.yAxis_arr !== undefined && dataRetreived.data === undefined && processing === false || dataRetreived.chnaged === true) {
    //         setProcessing(true)
    //         setChartsLoad(false)
    //         LoadedData(dataRetreived.x_axis_key.name, '1')
    //     }
    //     else {
    //         setChartsLoad(true)
    //         setData(props.chart_data)
    //     }
    // }, [props, dataRetreived])



    useEffect(() => {
        // console.log("65 Line chart", dataRetreived , dataRetreived?.yAxis_arr !== undefined &&  dataRetreived.data === undefined  && processing === false  || dataRetreived.chnaged === true  );

        console.log("ProcessedID Line", ProcessedID , dataRetreived , chart_data);
        if (ProcessedID === undefined) {

            if (dataRetreived?.yAxis_arr !== undefined && dataRetreived.data === undefined || dataRetreived.chnaged === true) {
                setProcessing(true)
                setChartsLoad(false)
                dispatch(toggleProcessingState(dataRetreived.i))

                dispatch(sortArea({ data: chart_data , chart_id: i }));
                dispatch(setSelectedSortredux([]));

                LoadedData(dataRetreived.x_axis_key.name, '1')
            }
            else if (dataRetreived?.filtered_data !== undefined) {
                setData(dataRetreived?.filtered_data)
                setChartsLoad(true)
            } else {
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



            if (props.show_table) {
                showTableFunc(true, dataRetreived.data)
            }
            else {
                showTableFunc(false)
            }

        }
    }, [props, dataRetreived])



    useEffect(() => {
        if (data !== undefined && data.length > 0) {
            // setData(data)
            setShowGridenabled(show_Grid)
            setmouseoverEnabled(mouseovered)
            setMouseoverSwitchType(mouseovered_type)


        }
    }, [chartsLoad, data, mouseovered, enable_table, svgHeight, show_Grid, temp_containerWidth, fullScreen_enabled, temp_containerHeight, show_bar_values, mouseovered_type, containerWidth])









    const LoadedData = async (value, mode, indx) => {
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
                    additional_fields: dataRetreived?.yAxis_arr,

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

                }


                   


                const response = await urlSocket.post("report/retrive-linechart-data", data)
                console.log('response  Line Chart:>> ', response);
                // var response = await dispatch(retriveClnPrimaryValue(data, dataRetreived.x_axis_key))

                // console.log('response of Line Chart  :>> ', response);




                console.log('dataRetreived 228 :>> ', dataRetreived);

                //                 const transformedData = response.data.data.map(entry => {
                //                     // console.log('entry :>> ', entry);
                //                     return {
                //                         x: entry.xAxisValue,
                //                         values: entry.total.map((d, index) => {
                //                             const metric = dataRetreived.CalculationArr[index]; // Get the calculation type based on index
                //                             // console.log('metric :>> ', metric);

                //                             let value = null;

                //                             if (metric === "count" && d.uniqueCount !== undefined) {
                //                                 value = d.uniqueCount; // Read uniqueCount directly if metric is "count"
                //                             } else if (d.calculations && d.calculations[metric] !== undefined) {
                //                                 value = d.calculations[metric]; // Read from calculations if available
                //                             }

                //                             return {
                //                                 field: d.fieldName,
                //                                 value: value
                //                             };
                //                         })
                //                     };
                //                 });


                // const d3Data = [];
                // transformedData.forEach(entry => {
                //     entry.values.forEach(val => {
                //         if (!d3Data[val.field]) {
                //             d3Data[val.field] = [];
                //         }
                //         d3Data[val.field].push({ x: entry.x, y: val.value });
                //     });
                // });

                // // Convert to array format for D3 line generation
                // const finalData = Object.keys(d3Data).map(field => ({
                //     field,
                //     values: d3Data[field]
                // }));

                // // console.log("D3 Multi-Line Chart Data:", finalData);


                // const transformedData1 = transformedData.map(entry => {
                //     const obj = { name: entry.x || "Unknown" }; // Set x-axis label
                //     entry.values.forEach((val, index) => {
                //         obj[`value${index + 1}`] = val.value; // Assign dynamically
                //     });
                //     return obj;
                // });

                // console.log(transformedData1 , "::::::::");




                // if (response.status === 200) {
                //     if (response.data.length > 0) {
                //         if (mode === "1") {
                var updating_layObj = { ...dataRetreived };
                updating_layObj.data = response.data.data;
                updating_layObj.chnaged = false;
                updating_layObj.configured = true




                if (selectedsortredux[dataRetreived.i]) {
                    console.log('ProcessedID Already Sort type is', selectedsortredux[dataRetreived.i])
                    if (selectedsortredux[dataRetreived.i] === 'accending') {
                        console.log('Ascending ', response.data.data , selectedvalueRedux);
                        dispatch(sortFunc({ data: response.data.data, arrValues :selectedvalueRedux[dataRetreived.i] ,  chart_id: dataRetreived.i }));
                    }
                    else if (selectedsortredux[dataRetreived.i] === 'decending') {
                        console.log('Descending', response.data.data , selectedvalueRedux);
                        dispatch(sortDescending({ data: response.data.data,  arrValues :selectedvalueRedux[dataRetreived.i] , chart_id: dataRetreived.i }));

                    }
                    else {
                        console.log('Default');
                        // dispatch(sortInfo({ data: response.data.data, chart_id: dataRetreived.i }));
                    }
                }





                
                var layoutArr = [...reportSlice.layoutInfo]

                layoutArr[props.indexes] = {
                    ...layoutArr[props.indexes],
                    ...updating_layObj
                };
                setChartsLoad(true)
                setData(response.data.data)

                await dispatch(
                    updateLayoutInfo({
                        index: props.indexes,
                        updatedObject: updating_layObj,
                    })
                )
                //     }
                // }
                // else{

                //     var updating_layObj = { ...dataRetreived };
                //     updating_layObj.data = response.data.x_label;
                //     updating_layObj.chnaged = false;
                //     updating_layObj.configured = true

                //     var layoutArr = [...reportSlice.layoutInfo]

                //     layoutArr[props.indexes] = {
                //         ...layoutArr[props.indexes],
                //         ...updating_layObj
                //     };
                //     setChartsLoad(true)
                //     setData([])

                //     await dispatch(
                //         updateLayoutInfo({
                //             index: props.indexes,
                //             updatedObject: updating_layObj,
                //         })
                //     )
                // }







                // }
            }
        } catch (error) {
            console.log("err", error);
        }
    }


    // useEffect(() => {
    //     if (chart_data !== undefined && chart_data.length > 0) {
    //         setData(chart_data)
    //     }
    //     else {
    //         setData(chart_data)
    //     }
    // },
    //     [props]
    //     // [chart_data, barColor, label_name, mouseovered, showline, enable_table, svgHeight, show_Grid, show_bar_values, fullScreen_enabled]
    // )

    // const LoadedData = async (value, mode, indx) => {
    //     try {
    //         if (dataRetreived.selected_cln_name !== undefined) {
    //             const data = {
    //                 collection_name: dataRetreived.selected_cln_name.cln_name,
    //                 encrypted_db_url: dbInfo.encrypted_db_url,
    //                 db_name: dbInfo.db_name,
    //                 primary_key: {},
    //                 selected_primary_key: value,
    //                 selected_primary_value: {},
    //                 chart_position: mode,
    //                 additional_fields: dataRetreived?.yAxis_arr,

    //                 mode: "1",
    //             }
    //             var response = await dispatch(retriveClnPrimaryValue(data))

    //             if (response.status === 200) {
    //                 if (mode === "1") {

    //                     var updating_layObj = { ...dataRetreived };
    //                     updating_layObj.data = response.data.x_label;
    //                     updating_layObj.chnaged = false;

    //                     var layoutArr = [...reportSlice.layoutInfo]

    //                     // Update the specific index by merging properties properly
    //                     layoutArr[props.indexes] = {
    //                         ...layoutArr[props.indexes],
    //                         ...updating_layObj // Spread the properties of updating_layObj directly
    //                     };
    //                     setChartsLoad(true)
    //                     setData(response.data.x_label)


    //                 }
    //                 if (mode === "2") {

    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.log("err", error);
    //     }
    // }







    // console.log('updating_layObj 275:>> ', dataRetreived, dataRetreived.configured && dataRetreived[0] !== undefined && dataRetreived[0]?.[calc]);

    if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined) {
        // console.log('data 278', data, dataRetreived);
        if (data?.[0] !== undefined) {
            var datakeys = Object.keys(data[0] !== undefined ? data[0] : data[0]).filter(key => key !== 'name' && key !== "_id");
            // console.log('datakeys 280:>> ', datakeys);
        }
    }
    else {
        console.log('Sample data Datakeys', props.chart_data);
        var datakeys = Object.keys(props.chart_data.length > 0 && props.chart_data[0]).filter(key => key !== 'name' && key !== "_id");
        // console.log('datakeys 293:>> ', datakeys);
    }



    // if (data && Array.isArray(data) && data?.length > 0) {
    //     console.log('data', data);
    //     var datakeys = Object.keys(data[0]).filter(key => key !== 'name' && key !== "_id");
    //     var datakeys_name = Object.keys(data[0]).filter(key => key === 'name' && key !== "_id");
    // }


    useEffect(() => {
        var mod_data;
        // const data = chart_data;


        // console.log("configured!!" , reportSlice.layoutInfo[props.indexes].data?.[0] , reportSlice.layoutInfo[props.indexes]?.configured , reportSlice.layoutInfo[props.indexes].filtered_data , "datakeys-->", datakeys);

        console.log('datakeys Intro :>> ', datakeys);
        if (datakeys !== undefined && datakeys.length > 0) {

            var chart_id = i;
            if (reportSlice[chart_id] && reportSlice[chart_id].linesorted) {
                mod_data = reportSlice[chart_id].linesorted;
            } else if (reportSlice.layoutInfo[props.indexes]?.configured && reportSlice.layoutInfo[props.indexes].data?.[0]) {
                mod_data = reportSlice.layoutInfo[props.indexes].data
            }
            else {
                mod_data = chart_data
            }



            if (reportSlice.layoutInfo[props.indexes]?.filtered_data) {
                mod_data = reportSlice.layoutInfo[props.indexes]?.filtered_data
            }


            console.log('mod_data  438:>> ', mod_data);



            // Step 1: Get all unique keys from data
            const allKeys = Array.from(
                new Set(mod_data.flatMap(d => Object.keys(d)))
            ).filter(k => k !== "name"); // exclude 'name'

            // Step 2: Normalize each entry
            const normalizedData = mod_data.map(entry => {
                const newEntry = { name: entry.name };
                allKeys.forEach(key => {
                    newEntry[key] = Number.isFinite(entry[key]) ? entry[key] : 0;
                });
                return newEntry;
            });



            console.log('normalizedData :>> ', normalizedData, allKeys);

            mod_data = normalizedData;

console.log('mod_data1 :>> ', mod_data);

            // var updt_data = groupData(mod_data)
            // mod_data = updt_data
            // }


            // console.log('mod_data  324:>> ', mod_data , chart_data);

            // if (dataRetreived.configured) {
            //     mod_data = mod_data?.[0][calc]
            // }

            if (mod_data !== undefined && mod_data.length > 0) {



                const margin = { top: 70, right: 80, bottom: 90, left: 80 };
                if (svgHeight !== undefined && svgHeight !== '') {
                    containerHeight = containerHeight - 200
                }
                else {
                    containerHeight = containerHeight
                }

                var width
                var height
                if (fullScreen_enabled !== undefined && fullScreen_enabled !== false) {
                    width = temp_containerWidth + margin.left + margin.right;
                    height = temp_containerHeight + margin.top - margin.bottom  - (enable_table ? 200 : 0)
                    containerWidth = temp_containerWidth + margin.left + margin.right + 100;
                    containerHeight = temp_containerHeight - (enable_table ? 200 : 0) + margin.bottom + margin.top
                }
                else {
                    width = containerWidth - margin.left - margin.right;
                    height = containerHeight - margin.top - margin.bottom;
                }
                console.log('containerWidth  455:>> ', containerWidth , containerHeight);
                d3.select(chartRef.current).selectAll('*').remove();
                d3.selectAll(`#my_dataviz${i}`).selectAll("div").remove();
                d3.selectAll('body').selectAll('*').selectAll('.textHover').remove();



                const drag = d3.drag()
                    .on("start", dragStarted)
                    .on("drag", dragged)
                    .on("end", dragEnded)

                const svg = d3
                    .select(chartRef.current)
                    .attr('width', containerWidth)
                    .attr('height', containerHeight)
                    .append("g")
                    .call(drag);

                d3.selectAll(`#my_dataviz${i}`).call(drag);
                function dragStarted(event, d) {
                }
                let initialMouseX, initialMouseY;
                let initialX, initialY;

                function dragged(event, d) {
                    if (!initialMouseX) {
                        initialMouseX = d3.pointer(event)[0];
                        initialMouseY = d3.pointer(event)[1];
                        const initialTransform = svg.attr("transform");
                        initialX = initialTransform ? parseFloat(initialTransform.split("(")[1].split(",")[0]) : 0;
                        initialY = initialTransform ? parseFloat(initialTransform.split(",")[1].split(")")[0]) : 0;
                    }

                    const mouseX = d3.pointer(event)[0];
                    const deltaX = mouseX - initialMouseX;
                    const newX = initialX + deltaX;


                    console.log("scrollll", scrollDelta, "containerWidth ----", containerWidth, newX, initialX, deltaX);


                    if (newX >= -scrollDelta && newX <= 0) {
                        // Allow dragging when newX is greater than -scrollDelta
                        svg.attr("transform", `translate(${newX},${initialY})`);
                    } else {
                        // Restrict dragging when newX is lower than -scrollDelta (prevent movement beyond -scrollDelta)
                    }


                    // if (newX >= 0) {
                    // } else {
                    //     svg.attr("transform", `translate(${newX},${initialY})`);
                    // }
                }



                
                function dragEnded(event, d) {
                    initialMouseX = null;
                    initialMouseY = null;
                }
                const chartGroup = svg
                    .append("g")
                    .attr('transform', `translate(${margin.left},${margin.top})`);



                const xScale = d3
                    .scalePoint()
                    .domain(mod_data.map((d) => d.name))
                    .range([0, width]);

                const yScale = d3
                    .scaleLinear()
                    .domain([0, d3.max(mod_data, (d) => d3.max(datakeys.map((key) => d[key])))])
                    .nice()
                    .range([height, 0]);

                const color = d3.scaleOrdinal().range(
                    textLinecolorbar !== '' && textLinecolorbar !== undefined && textLinecolorbar.length > 0
                        ? textLinecolorbar
                        : ['red', 'blue', 'green', 'orange', 'purple', 'cyan']
                );

                const text_color = d3.scaleOrdinal()
                    .domain(datakeys)
                    .range(text_color_arr !== undefined && text_color_arr.length > 0
                        ? text_color_arr
                        : d3.quantize(d3.interpolateRainbow, datakeys.length + 2));

                var lineClass

               
                

                const xDomain = d3.extent(mod_data, d => d.name);
                const defaultXValue = xDomain[0];
                const defaultIntersectionData = mod_data.find(d => d.name === defaultXValue);
                const verticalLine = chartGroup.append("line")
                    .attr("class", "vertical-line")
                    .attr("x1", 0)
                    .attr("x2", 0)
                    .attr("y1", 0)
                    .attr("y2", height)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1.5)
                    .attr('pointer', 'cursor')
                    .style("opacity", 0);
                datakeys.forEach((valueKey, index) => {


                    console.log('valueKey !!!!!:>> ', valueKey);
                    const line = getLineGenerator(curved_line, valueKey);
                    lineClass = `line-${valueKey}`;
                    function getLineGenerator(useCurvedLines, key) {
                        return useCurvedLines
                            ? d3
                                .line()
                                .x((d) => xScale(d.name))
                                .y((d) => yScale(d[key]))
                                .curve(d3.curveCatmullRom.alpha(0.5))
                            : d3
                                .line()
                                .x((d) => xScale(d.name))
                                .y((d) => yScale(d[key]));
                    }

                    const labelGroup = chartGroup.append('g')
                        .attr('class', 'label-group')
                        .style('fill', color(valueKey));

                    // console.log('mod_data  579:>> ', mod_data);
                    labelGroup.selectAll('.line-label')
                        .data(mod_data)
                        .enter()
                        .append('text')
                        .attr('class', 'line-label1')
                        .attr('x', d => xScale(d.name))
                        .attr('y', d => yScale(d[valueKey]) - 20)
                        .text(d => {
                            return show_bar_values ? (d[valueKey] !== null ? d[valueKey] : '') : '';
                        })
                        .attr('text-anchor', 'middle')
                        .attr('fill', 'black')
                        .style("opacity", 0)
                        .transition()
                        .duration(10)
                        .style("opacity", 1);

                    const tooltip = chartGroup
                        .append("g")
                        .attr("class", `tooltip-${valueKey}`)
                        .style("opacity", 0);
                    tooltip
                        .append("rect")
                        .attr("width", 100)
                        .attr("height", 40)
                        .attr("fill", "lightgrey")
                        .style("border", "1px solid black");
                    const tooltipText = tooltip
                        .append("text")
                        .attr("x", 10)
                        .attr("y", 20)
                        .style("font-size", "12px");
                    const text = chartGroup.append("text")
                        .attr("class", `tooltip-text-${valueKey}`)
                        .attr("x", 10)
                        .attr("y", 10)
                        .attr("fill", "black")
                        .style("font-size", "12px")
                        .style("opacity", 0);
                });

                // d3.selectAll('.y-val').remove()
                const yAxisContainer = d3.select(`#my_dataviz${i}`)
                    .append("div")
                    .style("position", "absolute")
                     .style('background-color', 'white')

                    .style("top", `${0}px`)
                    .style("left", "0")
                    .style("width", `${margin.left}px`)
                    .style("height", `${ fullScreen_enabled ? temp_containerHeight + 100 : containerHeight - 20}px`);
                const yAxis = yAxisContainer.append("svg")
                    .attr('class', 'y-val')
                    .attr("width", '100%')
                    .attr("height", fullScreen_enabled ? temp_containerHeight + 100 : containerHeight)
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

                if (show_Grid) {
                    chartGroup.insert('g', ':first-child')
                        .attr('class', 'grid')
                        .attr('transform', `translate(0, ${height})`)
                        .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''))
                        .selectAll('line')
                        .attr('stroke', 'lightgray')
                        .style('pointer-events', 'none');

                    chartGroup.insert('g', ':first-child')
                        .attr('class', 'grid')
                        .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(''))
                        .selectAll('line')
                        .attr('stroke', 'lightgray')
                        .style('pointer-events', 'none');

                } else {
                    chartGroup.selectAll('.grid').remove();
                }

                var newContainerWidth = containerWidth + scrollDelta;
                if (newContainerWidth > containerWidth) {
                    var new_xScale = xScale.range([0, newContainerWidth - margin.left - margin.right]);
                    svg.append("g").attr('width', newContainerWidth);

                    if (show_Grid) {
                        chartGroup.selectAll('.grid').remove();
                        chartGroup.insert('g', ':first-child')
                            .attr('class', 'grid')
                            .attr('transform', `translate(0, ${height})`)
                            .call(d3.axisBottom(new_xScale).tickSize(-height).tickFormat(''))
                            .selectAll('line')
                            .attr('stroke', 'lightgray')
                            .style('pointer-events', 'none');

                        chartGroup.insert('g', ':first-child')
                            .attr('class', 'grid')
                            .call(d3.axisLeft(yScale).ticks(5).tickSize(-newContainerWidth).tickFormat(''))
                            .selectAll('line')
                            .attr('stroke', 'lightgray')
                            .style('pointer-events', 'none');

                    } else {
                        chartGroup.selectAll('.grid').remove();
                    }
                } else {
                    xScale.range([0, containerWidth - margin.left - margin.right]);
                    svg.append("g").attr('width', containerWidth);
                }
                d3.selectAll(`line ${lineClass}`).remove()
                d3.selectAll(`.square-node-rect${i} , .line-label1`).remove()
                const path = svg
                    .append('path')
                    .datum(mod_data)
                    .attr('class', `line ${lineClass}`).remove()
                if (newContainerWidth >= containerWidth) {
                    d3.select(`#my_dataviz${i}`).on('wheel', handleScroll);
                }
                else {
                    setScrollDelta(0)
                }

                var chart = svg
                    .append("g")
                    .attr('transform', `translate(${margin.left},${margin.top})`);




                // Character limit for truncation
                const charLimit = 5;

                // Append the axis group
                const axisGroup = chart.append('g')
                    .attr('transform', `translate(0, ${height})`)
                    .call(d3.axisBottom(xScale))
                    .selectAll('text')
                    .style("text-anchor", "end")
                    .attr("font-size", "14px")
                    .attr('fill', 'black')
                    .style("text-transform", "capitalize")
                    .style("font-weight", (d, i) => i % 2 === 0 ? "normal" : "normal")
                    .style('cursor', 'pointer')
                    // .attr('transform', `rotate(-90)`)
                    .attr('transform', `translate(-13, 5) rotate(-90)`) // Move left
                    .text(function (d) {
                        let text = d != null ? String(d) : "(blank)"; // Convert to string and handle null/undefined
                        return text.length > charLimit ? `${text.substring(0, charLimit)}...` : text;
                    });
                    // .text(function (d) {
                    //     if (!d || typeof d !== 'string') {
                    //         // Default to "(blank)" if no text or undefined
                    //         return "(blank)";
                    //     }
                    //     // Truncate text based on the character limit
                    //     return d.length > charLimit ? `${d.substring(0, charLimit)}...` : d;
                    // });


                // // Add a tooltip
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





                // // Add hover behavior for tooltips
                // axisGroup.on('mouseover', function (event, d) {
                //     // Determine the tooltip content
                //     const tooltipText = (!d || typeof d !== 'string') ? "(blank)" : d;

                //     // Show tooltip with the full text
                //     tooltip.style('visibility', 'visible')
                //         .text(tooltipText);
                // })
                //     .on('mousemove', function (event) {
                //         // Position the tooltip near the mouse cursor
                //         tooltip.style('top', `${event.pageY + 10}px`)
                //             .style('left', `${event.pageX + 10}px`);
                //     })
                //     .on('mouseleave', function () {
                //         // Hide tooltip on mouse leave
                //         tooltip.style('visibility', 'hidden');
                //     })
                //     .on('mouseout', function () {
                //         // Hide tooltip on mouse out
                //         tooltip.style('visibility', 'hidden');

                //     });

















                // Add hover behavior for tooltips
                axisGroup.on('mouseover', function (event, d) {
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
                        .duration(500)  // Smooth fade-in in 300ms
                        .style('opacity', 1);

                    // Determine the tooltip content
                    const tooltipText = (!d || typeof d !== 'string') ? "(blank)" : d;
                    tooltip.text(tooltipText);

                    // Store tooltip reference in this element
                    d3.select(this).node().tooltip = tooltip;
                })
                    .on('mousemove', function (event) {
                        const tooltip = d3.select('.textHover');
                        if (!tooltip.empty()) {
                            tooltip.style('top', `${event.pageY + 10}px`)
                                .style('left', `${event.pageX + 10}px`);
                        }
                    })
                    .on('mouseleave', removeTooltip)  // Call function to remove tooltips
                    .on('mouseout', removeTooltip);  // Also remove on mouseout



                // const axisGroup = chart.append('g')
                //     .attr('transform', `translate(0, ${height})`)
                //     .call(d3.axisBottom(xScale))
                //     .selectAll('text')
                //     .style("text-anchor", "middle")
                //     .attr("font-size", "14px")
                //     .attr('fill', 'black')
                //     .style("text-transform", "capitalize")
                //     .style("font-weight", (d, i) => i % 2 === 0 ? "bold" : "normal")
                //     .style('cursor', 'pointer')

                // const axisLabels = chart.selectAll('text')
                //     .attr("fill", "black")
                //     .style("font-size", '13px')
                //     .style("font-style", "normal")
                //     .attr('transform', `translate(0, ${0})`)
                //     .attr('transform', `translate(0, ${0}) rotate(${-45})`)
                //     .style("text-anchor", 'end')

                // let rotationAngle = 0;
                // axisLabels.on('click', function () {
                //     rotationAngle = rotationAngle === 0 ? -45 : 0;
                //     const textAnchor = rotationAngle === 0 ? 'middle' : 'end';
                //     axisGroup

                //         .style("text-anchor", textAnchor)
                //         .attr('transform', `translate(0, ${0}) rotate(${rotationAngle})`);
                // });




                datakeys.forEach((valueKey, index) => {
                    d3.selectAll(`line-${valueKey}`).remove()
                    d3.selectAll(`line ${lineClass}`).remove()
                    datakeys.forEach((valueKey, index) => {
                        const line = getLineGenerator(curved_line, valueKey);
                        lineClass = `line-${valueKey}`;
                        function getLineGenerator(useCurvedLines, key) {
                            return useCurvedLines
                                ? d3
                                    .line()
                                    .x((d) => xScale(d.name))
                                    .y((d) => yScale(d[key]))
                                    .curve(d3.curveCatmullRom.alpha(0.5))
                                : d3
                                    .line()
                                    .x((d) => xScale(d.name))
                                    .y((d) => yScale(d[key]));
                        }

                        const path = chartGroup
                            .append('path')
                            .datum(mod_data)
                            .attr('class', `line ${lineClass}`)
                            .attr('fill', 'none')
                            .attr('stroke', color(valueKey))
                            .attr('stroke-width', 2)
                            .attr('d', line)

                            .transition()
                            .duration(100)
                            .style('stroke-dashoffset', 0)

                        const labelGroup = chartGroup.append('g');
                        const textGroup = chartGroup.append('g');

                        const renderText = () => {
                            textGroup.selectAll('text').remove();

                            datakeys.forEach((seriesData, seriesIndex) => {
                                textGroup.selectAll(`.text-${seriesIndex}`)
                                    .data(mod_data)
                                    .enter().append('text')
                                    .attr('class', `text-${seriesIndex}`);

                                labelGroup.selectAll(`.line-label-${seriesIndex}`)
                                    .data(mod_data)
                                    .enter()
                                    .append('text')
                                    .attr('class', `line-label-${seriesIndex}`)
                                    // .attr('x', d => xScale(d.name))
                                    .attr('x', (d, i) => i === 0 ? xScale(d.name) + 20 : xScale(d.name) + xScale.bandwidth() / 2) // for adding 20 because of showing values inside the charts
                                    .attr('y', d => yScale(d[seriesData]) - 20)
                                    .text(d => show_bar_values ? formated_number(d[seriesData]) : '')
                                    .attr('text-anchor', 'middle')
                                    .attr('fill', text_color(datakeys[seriesIndex]))
                                    .style("opacity", 0)
                                    .transition()
                                    .duration(100)
                                    .style("opacity", 1)
                                    .style('pointer-events', 'none');

                            });
                        };

                        renderText();



                        if (nodeEnabled) {

                            // Safely remove all previous circles for this valueKey
svg.selectAll(`.circles-node${CSS.escape(valueKey)}`).remove();

                            const circlesGroup = chartGroup
                                .append("g")
                                .attr("class", `circles-group-${valueKey}`);
                            console.log('mod_data  900:>> ', mod_data);
                            mod_data.forEach(d => {
                                const cx = xScale(d.name);
                                const cy = yScale(d[valueKey]);


                                console.log('d[valueKey] :>> ', d[valueKey]);
                                if (d[valueKey] !== null && d[valueKey] !== undefined) {
                                    const circle = circlesGroup.append("circle")
                                        .attr("class", `circles-node${valueKey}`)

                                        .datum(d)
                                        .attr("cx", cx)
                                        .attr("cy", cy)
                                        .attr("r", 3)
                                        .attr("fill", "green")
                                        .style("opacity", 1)
                                        .on('mouseover', function (event, d) {   //Mouseover functionality Circle
                                            mouseover(event, d, valueKey);
                                        })
                                        .on('mousemove', function (event, d) {
                                            mouseover(event, d, valueKey);
                                        })
                                        .on('mouseout', function (event, d) {
                                            mouseout(event, d, valueKey);
                                        });

                                    function mouseout(event, d, valueKey) {
                                        const circle = chartGroup.select(`.intersection-circle-${valueKey}`);
                                        const tooltip = chartGroup.select(`.tooltip-${valueKey}`);
                                        circle.style("opacity", 0);
                                        tooltip.style("opacity", 0);
                                        const tooltip_text = d3.selectAll(`.tooltip-text-${valueKey}`)
                                        const tooltip_card = d3.selectAll(`.tooltip-card-${valueKey}`)
                                        tooltip_text.remove()
                                        tooltip_card.remove()

                                        datakeys.forEach((yKey) => {
                                            const tooltip_text = chartGroup.select(`.tooltip-text-${yKey}`)
                                            tooltip_text.style('opacity', 0)
                                        })
                                        verticalLine.style("opacity", 0);

                                        
                                        d3.select('.hover-line')
                                        .remove();

                                        d3.selectAll(`#tooltip${i}`).transition().duration(100).remove()
                                    }

                                    function mouseover(event, d, valueKey) {
                                        console.log('mouseoverEnabled :>> ', mouseoverEnabled , "mouseoverSwitchType-------->" , mouseoverSwitchType);
                                        // if (mouseoverEnabled) {
                                        //     const mouseX = d3.pointer(event)[0];
                                        //     const closestDataPoint = mod_data.reduce((prev, curr) => {
                                        //         const prevDiff = Math.abs(xScale(prev.name) - mouseX);
                                        //         const currDiff = Math.abs(xScale(curr.name) - mouseX);
                                        //         return currDiff < prevDiff ? curr : prev;
                                        //     });

                                        //     if (mouseoverSwitchType) {
                                        //         var tooltipX = xScale(closestDataPoint.name);
                                        //         var tooltipY = yScale(d[valueKey])

                                        //         const tooltipWidth = 100;
                                        //         const tooltipHeight = 40;
                                        //         if (tooltipX + tooltipWidth > newContainerWidth) {
                                        //             tooltipX = (newContainerWidth - tooltipWidth) - 100;
                                        //         }
                                        //         datakeys.forEach((yKey) => {
                                        //             tooltipX = xScale(closestDataPoint.name);
                                        //             tooltipY = yScale(closestDataPoint[yKey]);
                                        //             if (tooltipX + tooltipWidth > newContainerWidth) {
                                        //                 tooltipX = (newContainerWidth - tooltipWidth) - 100;
                                        //             }

                                        //             const circle = chartGroup.select(`.intersection-circle-${yKey}`);
                                        //             const text = chartGroup.select(`.tooltip-text-${yKey}`);
                                        //             circle.attr("cx", tooltipX).attr("cy", tooltipY).style("opacity", 1);
                                        //             tooltipText.text(`${barLabel}: ${closestDataPoint.name}, y: ${formated_number(closestDataPoint[yKey])}`);
                                        //             tooltip
                                        //                 .attr("transform", `translate(${tooltipX + 10}, ${tooltipY - 40})`)
                                        //                 .style("opacity", 1);
                                        //             text
                                        //                 .attr("x", tooltipX + 10)
                                        //                 .attr("y", tooltipY)
                                        //                 .style('font-size', '15px')
                                        //                 .html(`<tspan font-weight="bold">x: </tspan>&nbsp; ${closestDataPoint.name}, <tspan font-weight="bold">y: </tspan> &nbsp;${formated_number(closestDataPoint[yKey])}`)
                                        //                 .style("opacity", 1);

                                        //             var tooltipX1 = xScale(closestDataPoint.name);
                                        //             verticalLine.attr("x1", tooltipX1).attr("x2", tooltipX1).style("opacity", 1);
                                        //         });

                                        //     }
                                        //     else {
                                        //         var tooltipX = xScale(closestDataPoint.name);
                                        //         var tooltipY = yScale(d[valueKey])

                                        //         var chartContainer = d3.select(`#my_dataviz${i}`).node();
                                        //         var chartContainerRect = chartContainer.getBoundingClientRect();

                                        //         var divX = chartContainerRect.left + window.scrollX;
                                        //         var divY = chartContainerRect.top + window.scrollY;


                                        //         let tooltipCard = chartGroup.selectAll(`.tooltip-card-${valueKey}`);

                                        //         // if (tooltipCard.empty()) {
                                        //         //     tooltipCard = chartGroup.select(`.tooltip-card-${valueKey}`);
                                        //         //     const cardGroup = chartGroup
                                        //         //         .append('g')
                                        //         //         .attr('class', `tooltip-card-${valueKey}`)
                                        //         //         .style('opacity', 0);

                                        //         //     cardGroup
                                        //         //         .append('rect')
                                        //         //         .attr('width', 120)
                                        //         //         .attr('height', 50)
                                        //         //         .attr('fill', 'red')
                                        //         //         .attr('stroke', 'black');



                                        //         //     cardGroup
                                        //         //         .append('text')
                                        //         //         .attr('x', 10)
                                        //         //         .attr('y', 20)
                                        //         //         .attr('fill', color(valueKey))
                                        //         //         .style('font-size', '12px')
                                        //         //         .attr('class', `tooltip-text-${valueKey}-line-1`);

                                        //         //     cardGroup
                                        //         //         .append('text')
                                        //         //         .attr('x', 10)
                                        //         //         .attr('y', 40)
                                        //         //         .attr('fill', color(valueKey))
                                        //         //         .style('font-size', '12px')
                                        //         //         .attr('class', `tooltip-text-${valueKey}-line-2`);

                                        //         // }
                                        //         // tooltipCard
                                        //         //     .select(`.tooltip-text-${valueKey}-line-1`)
                                        //         //     .text(`${barLabel}: ${closestDataPoint.name}`);
                                        //         // tooltipCard
                                        //         //     .select(`.tooltip-text-${valueKey}-line-2`)
                                        //         //     .text(`${valueKey}: ${formated_number(d[valueKey])}`);

                                        //         // tooltipCard
                                        //         //     .style('opacity', 1);


                                        //         // const tooltipNode = tooltipCard.node();
                                        //         // const tooltipRect = tooltipNode.getBoundingClientRect();
                                        //         // const tooltipWidth = tooltipRect.width;
                                        //         // const tooltipHeight = tooltipRect.height;



                                        //         // let leftPosition = event.pageX - divX;
                                        //         // let topPosition = event.pageY - divY;

                                        //         // if (topPosition + tooltipHeight > chartContainerRect.height) {
                                        //         //     topPosition -= tooltipHeight;
                                        //         // }
                                        //         // if (leftPosition + tooltipWidth > chartContainerRect.width) {
                                        //         //     leftPosition = event.pageX - divX - tooltipWidth - 0; // Move to the left of the cursor
                                        //         // }

                                        //         // tooltipCard
                                        //         //     .attr('transform', `translate(${leftPosition}, ${topPosition})`)

                                        //         if (tooltipCard.empty()) {
                                        //             tooltipCard = chartGroup.select(`.tooltip-card-${valueKey}`);
                                        //             const cardGroup = chartGroup
                                        //                 .append('g')
                                        //                 .attr('class', `tooltip-card-${valueKey}`)
                                        //                 .style('opacity', 0);
                                                
                                        //             cardGroup
                                        //                 .append('rect')
                                        //                 .attr('width', 120)
                                        //                 .attr('height', 50)
                                        //                 .attr('fill', 'red')
                                        //                 .attr('stroke', 'black');
                                                
                                        //             cardGroup
                                        //                 .append('text')
                                        //                 .attr('x', 10)
                                        //                 .attr('y', 20)
                                        //                 .attr('fill', color(valueKey))
                                        //                 .style('font-size', '12px')
                                        //                 .attr('class', `tooltip-text-${valueKey}-line-1`);
                                                
                                        //             cardGroup
                                        //                 .append('text')
                                        //                 .attr('x', 10)
                                        //                 .attr('y', 40)
                                        //                 .attr('fill', color(valueKey))
                                        //                 .style('font-size', '12px')
                                        //                 .attr('class', `tooltip-text-${valueKey}-line-2`);
                                                
                                        //             tooltipCard = cardGroup; // Ensure reference is updated
                                        //         }
                                                
                                        //         // Ensure tooltip exists before using getBoundingClientRect
                                        //         const tooltipNode = tooltipCard.node();
                                        //         if (!tooltipNode) {
                                        //             console.warn("Tooltip node is null, skipping bounding rect calculation.");
                                        //             return;
                                        //         }
                                                
                                        //         const tooltipRect = tooltipNode.getBoundingClientRect();
                                        //         const tooltipWidth = tooltipRect.width;
                                        //         const tooltipHeight = tooltipRect.height;
                                                
                                        //         // Adjust positioning
                                        //         let leftPosition = event.pageX - divX;
                                        //         let topPosition = event.pageY - divY;
                                                
                                        //         if (topPosition + tooltipHeight > chartContainerRect.height) {
                                        //             topPosition -= tooltipHeight;
                                        //         }
                                        //         if (leftPosition + tooltipWidth > chartContainerRect.width) {
                                        //             leftPosition = event.pageX - divX - tooltipWidth - 10; // Adjust to avoid overflow
                                        //         }
                                                
                                        //         tooltipCard.attr('transform', `translate(${leftPosition}, ${topPosition})`);

                                        //     }
                                        // }

                                        // const hoverLine = chartGroup.append("line")
                                        // .attr("class", "hover-line")
                                        // .style("stroke", "black")
                                        // .style("stroke-width", 2)
                                        // .style("stroke-dasharray", "3,3")
                                        // .attr("x1", 0)
                                        // .attr("x2", 0)
                                        // .attr("y1", 0)
                                        // .attr("y2", height)
                                        // .style("pointer-events", "none")
                        
                                        // hoverLine.transition()
                                        // .style("opacity", 1);


                                        if (mouseoverEnabled) {
                                            const mouseX = d3.pointer(event)[0];
                                            const closestDataPoint = mod_data.reduce((prev, curr) => {
                                                const prevDiff = Math.abs(xScale(prev.name) - mouseX);
                                                const currDiff = Math.abs(xScale(curr.name) - mouseX);
                                                return currDiff < prevDiff ? curr : prev;
                                            });
                                        
                                            if (mouseoverSwitchType) {       
                                              

                                                             
                                        d3.select('.hover-line')
                                        .remove();
                                        
                                                const hoverLine = chartGroup.append("line")
                                                .attr("class", "hover-line")
                                                .style("stroke", "black")
                                                .style("stroke-width", 2)
                                                .style("stroke-dasharray", "3,3")
                                                .attr("x1", 0)
                                                .attr("x2", 0)
                                                .attr("y1", 0)
                                                .attr("y2", height)
                                                .style("pointer-events", "none")
                                
                                                hoverLine.transition()
                                                .style("opacity", 1);
                                                


                                            //     let tooltipX = xScale(closestDataPoint.name);
                                            //     let tooltipY = yScale(d[valueKey]);
                                        

                                            //     const [mouseX, mouseY] = d3.pointer(event, this);

                                             

                                            //     console.log("mmmmm", mouseX, mouseY);
                                            //     let tempText = chartGroup.append("text")
                                            //         .attr("class", "temp-tooltip-text")
                                            //         .style("font-size", "14px")
                                            //         .text(` ${closestDataPoint.name}` )
                                                    
                                                    
                                            //    var tooltip = d3.select(`#tooltip${i}`)
                                            //    .style("position", "absolute")
                                            //    .style("opacity", 0.9)
                                            //    .style("padding", "10px")
                                            //    .style("border-radius", "5px")
                                            //    .style("background-color", "white")
                                            //    .style("pointer-events", "none")
                                             
                                            //         const tooltipContent = Object.entries(d)
                                            //             .filter(([key, value]) => key !== '_id' && key !== 'name')
                                            //             .map(([key, value]) => `<div class="tooltip-content" ><strong style="color: black;">${key}:</strong> <span style="color: black;">${value.toFixed(2)}</span></div>`)
                                            //             .join('');
                                
                                            //         tooltip.html(`Name: ${d.name}<br>${tooltipContent}${('totalContent')}`)

                                            //         tooltip. attr("transform", `translate(${tooltipX + 10}, ${tooltipY - 60})`)


                                            let tooltipX = xScale(closestDataPoint.name);
                                            let tooltipY = yScale(d[valueKey]);
                                        
                                            const [mouseX, mouseY2] = d3.pointer(event, this);
                                            const [mouseX12, mouseY] = [event.pageX, event.pageY]; // Use pageX and pageY for absolute positioning
                                                var modMouseX = mouseX12
                                            // let tempText = chartGroup.append("text")
                                            //     .attr("class", "temp-tooltip-text")
                                            //     .style("font-size", "14px")
                                            //     .text(` ${closestDataPoint.name}` );


                                        
                                            let tooltip = d3.select(`#tooltip${i}`)
                                            .attr("class", "tooltip-card")
                                            .style("position", "absolute")
                                            .style("opacity", 0)
                                            .style("pointer-events", "none")
                                            .style("padding", "10px")
                                            .style("border-radius", "8px")
                                            .style("background-color", "#fff")
                                            .style("box-shadow", "0px 4px 8px rgba(0,0,0,0.2)")
                                            .style("border", "1px solid #ccc");
                                        
                                            if (tooltip.empty()) {
                                                tooltip = d3.select(`#my_dataviz${i}`)
                                                    .append("div")
                                                    .attr("id", `tooltip${i}`)
                                                    .attr("class", "tooltip-card")
                                                    .style("position", "absolute")
                                                    .style("opacity", 0)
                                                    .style("pointer-events", "none")
                                                    .style("padding", "10px")
                                                    .style("border-radius", "8px")
                                                    .style("background-color", "#fff")
                                                    .style("box-shadow", "0px 4px 8px rgba(0,0,0,0.2)")
                                                    .style("border", "1px solid #ccc");
                                            }
                                        
                                            const tooltipContent = Object.entries(d)
                                                .filter(([key, value]) => key !== '_id' && key !== 'name')
                                                .map(([key, value]) => `<div style="font-size: 14px; color: black;">
                                                    <strong>${key}:</strong> ${value.toFixed(2)}
                                                </div>`)
                                                .join('');

                                                tooltip.html(`
                                                <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${d.name}</div>
                                                ${tooltipContent}
                                            `);

                                                // Calculate width dynamically
                                                tooltip.style("display", "block");
                                                const bbox = tooltip.node().getBoundingClientRect();
                                                tooltip.style("width", `${Math.max(bbox.width, 150)}px`); // Ensures a minimum width

                                                var chartContainer = d3.select(`#my_dataviz${i}`).node();
                                                var chartContainerRect = chartContainer.getBoundingClientRect();
                                                var divX = chartContainerRect.left + window.scrollX;
                                                var divY = chartContainerRect.top + window.scrollY;

                                                let leftPosition = mouseX  + 85
                                                let topPosition = event.pageY - divY - 10;
                                                if (leftPosition + bbox.width > width -  margin.right) {
                                                    console.log('leftPosition moddd :>> ', leftPosition, bbox.width, width);
                                                    modMouseX -=  bbox.width  // Move to the left of the cursor
                                                    leftPosition -= bbox.width + 20  // Move to the left of the cursor 
                                                }
                                                console.log('mouseX :>> ', modMouseX, "leftPosition-------", leftPosition, containerWidth, newContainerWidth, "tooltipX--->", tooltipX, containerWidth + margin.right + margin.left, "bbox.width", bbox.width, 'wwww', width - margin.left - margin.right);

                                                tooltip
                                                    .style("left", `${ leftPosition }px`)
                                                    .style("top", `${ mouseY - bbox.height - divY + (fullScreen_enabled ? 90  : 25)}px`)
                                                    .transition()
                                                    .duration(200)
                                                    .style("opacity", 1);



                                                    hoverLine.attr("x1", mouseX).attr("x2", mouseX);



                                            } else {

                                                   
                                        d3.select('.hover-line')
                                        .remove();
                                        
                                                const hoverLine = chartGroup.append("line")
                                                .attr("class", "hover-line")
                                                .style("stroke", "black")
                                                .style("stroke-width", 2)
                                                .style("stroke-dasharray", "3,3")
                                                .attr("x1", 0)
                                                .attr("x2", 0)
                                                .attr("y1", 0)
                                                .attr("y2", height)
                                                .style("pointer-events", "none")
                                
                                                hoverLine.transition()
                                                .style("opacity", 1);


                                                let tooltipX = xScale(closestDataPoint.name);
                                                let tooltipY = yScale(d[valueKey]);
                                        

                                                const [mouseX, mouseY] = d3.pointer(event, this);

                                                // const hoverLine = d3.select(".hover-line")
                                                hoverLine.attr("x1", mouseX).attr("x2", mouseX);

                                                console.log("mmmmm", mouseX, mouseY);
                                                let tempText = chartGroup.append("text")
                                                    .attr("class", "temp-tooltip-text")
                                                    .style("font-size", "14px")
                                                    .text(` ${closestDataPoint.name}` )
                                                    
                                                    
                                        
                                                let textWidth = tempText.node().getBBox().width  + 40
                                                console.log('textWidth,' , textWidth);
                                                let tooltipWidth = Math.min(Math.max(50, textWidth), 200); // Min 100px, Max 200px
                                                tempText.remove();
                                        
                                                if (tooltipX + tooltipWidth > newContainerWidth) {
                                                    tooltipX = newContainerWidth - tooltipWidth - 150;
                                                }

                                                if ( newContainerWidth && tooltipX + tooltipWidth > width + margin.right ) {
                                                    tooltipX =  tooltipX - 120;
                                                }
                                        
                                                let tooltipCard = chartGroup.select(`.tooltip-card-${valueKey}`);
                                                if (!tooltipCard.node()) {
                                                    const cardGroup = chartGroup
                                                        .append("g")
                                                        .attr("class", `tooltip-card-${valueKey}`)
                                                        .style("opacity", 0);
                                        
                                                    cardGroup
                                                        .append("rect")
                                                        .attr("width", tooltipWidth)
                                                        .attr("height", 50)
                                                        .attr("fill", "white")
                                                        .attr("stroke", "lightgrey")
                                                        .attr("rx", 5)
                                                        .attr("ry", 5);
                                        
                                                    cardGroup
                                                        .append("text")
                                                        .attr("x", 10)
                                                        .attr("y", 20)
                                                        .attr("fill", 'black')
                                                        .style("font-size", "13px")
                                                        .style("font-weight", "normal")
                                                        .attr("class", `tooltip-text-${valueKey}-line-1`);
                                        
                                                    cardGroup
                                                        .append("text")
                                                        .attr("x", 10)
                                                        .attr("y", 40)
                                                        .attr("fill", color(valueKey))
                                                        .style("font-size", "12px")
                                                        .attr("class", `tooltip-text-${valueKey}-line-2`);
                                                }
                                        
                                                tooltipCard
                                                    .select(`.tooltip-text-${valueKey}-line-1`)
                                                    .text(` ${closestDataPoint.name}`);
                                        
                                                tooltipCard
                                                    .select(`.tooltip-text-${valueKey}-line-2`)
                                                    // .text(`${valueKey} : ${d[valueKey].toFixed(2)}`);
                                                    .html(`<tspan font-weight="bold">${valueKey}</tspan> : ${d[valueKey].toFixed(2)}`);
                                        
                                                tooltipCard
                                                    .attr("transform", `translate(${tooltipX + 10}, ${tooltipY - 60})`)
                                                    .style("opacity", 1);
                                            }
                                        }
                                        
                                        




                                        // if (mouseoverEnabled) {
                                        //     const mouseX = d3.pointer(event)[0];
                                        //     const closestDataPoint = mod_data.reduce((prev, curr) => {
                                        //         const prevDiff = Math.abs(xScale(prev.name) - mouseX);
                                        //         const currDiff = Math.abs(xScale(curr.name) - mouseX);
                                        //         return currDiff < prevDiff ? curr : prev;
                                        //     });

                                        //     if (mouseoverSwitchType) {
                                        //         var tooltipX = xScale(d.name);
                                        //         var tooltipY = yScale(d[valueKey])
                                        //         const tooltipWidth = 100;
                                        //         const tooltipHeight = 40;
                                        //         // if (tooltipX + tooltipWidth > newContainerWidth) {
                                        //         //     tooltipX = (newContainerWidth - tooltipWidth) - 100;
                                        //         // }
                                        //         datakeys.forEach((yKey) => {
                                        //             tooltipX = xScale(d.name);
                                        //             tooltipY = yScale(d[yKey]);
                                        //             // if (tooltipX + tooltipWidth > newContainerWidth) {
                                        //             //     tooltipX = (newContainerWidth - tooltipWidth) - 100;
                                        //             // }

                                                    

                                        //             const circle = chartGroup.select(`.intersection-circle-${yKey}`);
                                        //             const text = chartGroup.select(`.tooltip-text-${yKey}`);
                                        //             circle.attr("cx", tooltipX).attr("cy", tooltipY).style("opacity", 1);
                                        //             tooltipText.text(`${barLabel}: ${closestDataPoint.name}, y: ${closestDataPoint[yKey]}`);
                                        //             tooltip
                                        //                 .attr("transform", `translate(${tooltipX + 10}, ${tooltipY - 40})`)
                                        //                 .style("opacity", 1);
                                        //             text
                                        //                 .attr("x", tooltipX + 10)
                                        //                 .attr("y", tooltipY)
                                        //                 .style('font-size', '15px')
                                        //                 .html(`<tspan font-weight="bold">x123: </tspan>&nbsp; ${closestDataPoint.name}, <tspan font-weight="bold">y: </tspan> &nbsp;${closestDataPoint[yKey]}`)
                                        //                 .style("opacity", 1);

                                        //             var tooltipX1 = xScale(closestDataPoint.name);
                                        //             verticalLine.attr("x1", tooltipX1).attr("x2", tooltipX1).style("opacity", 1);
                                        //         });

                                        //     }
                                        //     else {
                                        //         var tooltipX = xScale(closestDataPoint.name);
                                        //         var tooltipY = yScale(d[valueKey])
                                        //         const tooltipWidth = 100;
                                        //         const tooltipHeight = 40;
                                        //         if (tooltipX + tooltipWidth > newContainerWidth) {
                                        //             tooltipX = (newContainerWidth - tooltipWidth) - 120;
                                        //         }

                                        //         const circle = chartGroup.select(`.intersection-circle-${valueKey}`);
                                        //         const text = chartGroup.select(`.tooltip-text-${valueKey}`);
                                        //         const tooltipCard = chartGroup.select(`.tooltip-card-${valueKey}`);
                                        //         if (!tooltipCard.node()) {
                                        //             const cardGroup = chartGroup
                                        //                 .append('g')
                                        //                 .attr('class', `tooltip-card-${valueKey}`)
                                        //                 .style('opacity', 0);

                                        //             cardGroup
                                        //                 .append('rect')
                                        //                 .attr('width', 120)
                                        //                 .attr('height', 50)
                                        //                 .attr('fill', 'white')
                                        //                 .attr('stroke', 'black');

                                        //             cardGroup
                                        //                 .append('text')
                                        //                 .attr('x', 10)
                                        //                 .attr('y', 20)
                                        //                 .attr('fill', color(valueKey))
                                        //                 .style('font-size', '12px')
                                        //                 .attr('class', `tooltip-text-${valueKey}-line-1`);

                                        //             cardGroup
                                        //                 .append('text')
                                        //                 .attr('x', 10)
                                        //                 .attr('y', 40)
                                        //                 .attr('fill', color(valueKey))
                                        //                 .style('font-size', '12px')
                                        //                 .attr('class', `tooltip-text-${valueKey}-line-2`);
                                        //         }

                                        //         circle.attr('cx', tooltipX).attr('cy', tooltipY).style('opacity', 1);
                                        //         text.style('opacity', 0);

                                        //         tooltipCard
                                        //             .select(`.tooltip-text-${valueKey}-line-1`)
                                        //             // .text(`xabc: ${closestDataPoint.name}`);
                                        //             .text(`${barLabel}: ${closestDataPoint.name}`);

                                        //         tooltipCard
                                        //             .select(`.tooltip-text-${valueKey}-line-2`)
                                        //             .text(`${valueKey}: ${d[valueKey]}`);

                                        //         tooltipCard
                                        //             .attr('transform', `translate(${tooltipX + 10}, ${tooltipY - 40})`)
                                        //             .style('opacity', 1);
                                        //     }
                                        // }
                                    }

                                    const tooltip = circle.append("g")
                                        .attr("class", `tooltip-${valueKey}`)
                                        .style("opacity", 0);

                                    tooltip
                                        .append("rect")
                                        .attr("width", 100)
                                        .attr("height", 40)
                                        .attr("fill", "lightgrey")
                                        .style("border", "1px solid black");

                                    tooltip
                                        .append("text")
                                        .attr("x", 10)
                                        .attr("y", 20)
                                        .style("font-size", "12px")

                                    circle.tooltip = tooltip;
                                    const defaultTooltipY = yScale(defaultIntersectionData[valueKey]);
                                }
                            });

                            if (show_Square) {
                                d3.selectAll(`.circles-node${valueKey}`).remove()
                                mod_data.forEach(d => {
                                    if (d[valueKey] !== null) {
                                        chartGroup.append('rect')
                                            .attr('x', xScale(d.name) - 2.5)
                                            .attr('y', yScale(d[valueKey]) - 3 )
                                            .attr('width', 6)
                                            .attr('height', 6)
                                    }

                                });
                                const squaresGroup = chartGroup
                                    .append("g")
                                    .attr("class", `squares-group-${valueKey}`);
                                mod_data.forEach(d => {
                                    const x = xScale(d.name) - 6;
                                    const y = yScale(d[valueKey]) - 6;
                                    const square = squaresGroup.append("rect")
                                        .datum(d)
                                        .attr("x", x)
                                        .attr("y", y)
                                        .attr("width", 12)
                                        .attr("height", 12)
                                        .attr("fill", color(valueKey))
                                        .style("opacity", 0)
                                        .on('mouseover', function (event, d) {
                                            mouseover(event, d, valueKey);
                                        })
                                        .on('mousemove', function (event, d) {
                                            mouseover(event, d, valueKey);
                                        })
                                        .on('mouseout', function (event, d) {
                                            mouseout(event, d, valueKey);
                                        });
                                    function mouseout(event, d, valueKey) {
                                        const circle = chartGroup.select(`.squares-group-${valueKey}`);
                                        const tooltip = chartGroup.select(`.tooltip-${valueKey}`);
                                        circle.style("opacity", 0);
                                        tooltip.style("opacity", 0);
                                        const tooltip_text = chartGroup.select(`.tooltip-text-${valueKey}`)
                                        const tooltip_card = chartGroup.select(`.tooltip-card-${valueKey}`)
                                        tooltip_text.style('opacity', 0)
                                        tooltip_card.style('opacity', 0)

                                        datakeys.forEach((yKey) => {
                                            const tooltip_text = chartGroup.select(`.tooltip-text-${yKey}`)
                                            tooltip_text.style('opacity', 0)
                                        })
                                        verticalLine.style("opacity", 0);
                                    }

                                    function mouseover(event, d, valueKey) {
                                        console.log('mouseoverEnabled :>> ', mouseoverEnabled , mouseoverSwitchType);
                                        if (mouseoverEnabled) {
                                            const mouseX = d3.pointer(event)[0];
                                            const closestDataPoint = mod_data.reduce((prev, curr) => {
                                                const prevDiff = Math.abs(xScale(prev.name) - mouseX);
                                                const currDiff = Math.abs(xScale(curr.name) - mouseX);
                                                return currDiff < prevDiff ? curr : prev;
                                            });

                                            if (mouseoverSwitchType) {
                                                var tooltipX = xScale(closestDataPoint.name);
                                                var tooltipY = yScale(d[valueKey])
                                                const tooltipWidth = 100;
                                                const tooltipHeight = 40;
                                                if (tooltipX + tooltipWidth > newContainerWidth) {
                                                    tooltipX = (newContainerWidth - tooltipWidth) - 100;
                                                }
                                                datakeys.forEach((yKey) => {
                                                    tooltipX = xScale(closestDataPoint.name);
                                                    tooltipY = yScale(closestDataPoint[yKey]);
                                                    if (tooltipX + tooltipWidth > newContainerWidth) {
                                                        tooltipX = (newContainerWidth - tooltipWidth) - 100;
                                                    }

                                                    const circle = chartGroup.select(`.intersection-circle-${yKey}`);
                                                    const text = chartGroup.select(`.tooltip-text-${yKey}`);
                                                    circle.attr("cx", tooltipX).attr("cy", tooltipY).style("opacity", 1);
                                                    tooltipText.text(`${barLabel}: ${closestDataPoint.name}, y: ${closestDataPoint[yKey]}`);
                                                    tooltip
                                                        .attr("transform", `translate(${tooltipX + 10}, ${tooltipY - 40})`)
                                                        .style("opacity", 1);
                                                    text
                                                        .attr("x", tooltipX + 10)
                                                        .attr("y", tooltipY)
                                                        .style('font-size', '15px')
                                                        .html(`<tspan font-weight="bold">x123: </tspan>&nbsp; ${closestDataPoint.name}, <tspan font-weight="bold">y: </tspan> &nbsp;${closestDataPoint[yKey]}`)
                                                        .style("opacity", 1);

                                                    var tooltipX1 = xScale(closestDataPoint.name);
                                                    verticalLine.attr("x1", tooltipX1).attr("x2", tooltipX1).style("opacity", 1);
                                                });

                                            }
                                            else {
                                                var tooltipX = xScale(closestDataPoint.name);
                                                var tooltipY = yScale(d[valueKey])
                                                const tooltipWidth = 100;
                                                const tooltipHeight = 40;
                                                if (tooltipX + tooltipWidth > newContainerWidth) {
                                                    tooltipX = (newContainerWidth - tooltipWidth) - 120;
                                                }

                                                const circle = chartGroup.select(`.intersection-circle-${valueKey}`);
                                                const text = chartGroup.select(`.tooltip-text-${valueKey}`);
                                                const tooltipCard = chartGroup.select(`.tooltip-card-${valueKey}`);
                                                if (!tooltipCard.node()) {
                                                    const cardGroup = chartGroup
                                                        .append('g')
                                                        .attr('class', `tooltip-card-${valueKey}`)
                                                        .style('opacity', 0);

                                                    cardGroup
                                                        .append('rect')
                                                        .attr('width', 120)
                                                        .attr('height', 50)
                                                        .attr('fill', 'white')
                                                        .attr('stroke', 'black');

                                                    cardGroup
                                                        .append('text')
                                                        .attr('x', 10)
                                                        .attr('y', 20)
                                                        .attr('fill', color(valueKey))
                                                        .style('font-size', '12px')
                                                        .attr('class', `tooltip-text-${valueKey}-line-1`);

                                                    cardGroup
                                                        .append('text')
                                                        .attr('x', 10)
                                                        .attr('y', 40)
                                                        .attr('fill', color(valueKey))
                                                        .style('font-size', '12px')
                                                        .attr('class', `tooltip-text-${valueKey}-line-2`);
                                                }

                                                circle.attr('cx', tooltipX).attr('cy', tooltipY).style('opacity', 1);
                                                text.style('opacity', 0);

                                                tooltipCard
                                                    .select(`.tooltip-text-${valueKey}-line-1`)
                                                    // .text(`xabc: ${closestDataPoint.name}`);
                                                    .text(`${barLabel}: ${closestDataPoint.name}`);

                                                tooltipCard
                                                    .select(`.tooltip-text-${valueKey}-line-2`)
                                                    .text(`${valueKey}: ${d[valueKey]}`);

                                                tooltipCard
                                                    .attr('transform', `translate(${tooltipX + 10}, ${tooltipY - 40})`)
                                                    .style('opacity', 1);
                                            }
                                        }
                                    }

                                    const tooltip = square.append("g")
                                        .attr("class", `tooltip-${valueKey}`)
                                        .style("opacity", 0);
                                    tooltip
                                        .append("rect")
                                        .attr("width", 100)
                                        .attr("height", 40)
                                        .attr("fill", "lightgrey")
                                        .style("border", "1px solid black");
                                    tooltip
                                        .append("text")
                                        .attr("x", 10)
                                        .attr("y", 20)
                                        .style("font-size", "12px");
                                });
                            }
                            else {
                                d3.selectAll(`.squares-group-${valueKey}`).remove()
                                d3.select(`my_dataviz${i}`).selectAll('.rect').remove()
                            }
                        }




                        const tooltip = chartGroup
                            .append("g")
                            .attr("class", `tooltip-${valueKey}`)
                            .style("opacity", 0);
                        tooltip
                            .append("rect")
                            .attr("width", 100)
                            .attr("height", 40)
                            .attr("fill", "lightgrey")
                            .style("border", "1px solid black");
                        const tooltipText = tooltip
                            .append("text")
                            .attr("x", 10)
                            .attr("y", 20)
                            .style("font-size", "12px");
                        const text = chartGroup.append("text")
                            .attr("class", `tooltip-text-${valueKey}`)
                            .attr("x", 10)
                            .attr("y", 10)
                            .attr("fill", "black")
                            .style("font-size", "12px")
                            .style("opacity", 0);
                    });
                })
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
                if (enable_table) {
                    showTableFunc(true)
                }
                else {
                    showTableFunc(false)
                }


                const handleResetButtonClick = () => {
                    setScrollDelta(0);
                    xScale.range([0, containerWidth - margin.left - margin.right])
                    svg.attr("width", containerWidth)
                    svg.append('g').attr("transform", `translate(${margin.left},${margin.top})`)
                };

                if (i === reportSlice.resetCharts.i) {
                    handleResetButtonClick();
                    dispatch(setResetCharts([]));
                }

            }


            // if (mod_data?.length === 0) {
            //         // Clear the container
            //         d3.select(`#my_dataviz${i}`).html("");

            //         // Add a centered "No data available" message
            //         d3.select(`#my_dataviz${i}`)
            //             .style("position", "relative")
            //             .style("width", `${containerWidth}px`)
            //             .style("height", `${containerHeight}px`)
            //             .style("display", "flex")
            //             .style("justify-content", "center")
            //             .style("align-items", "center")
            //             .style("border", "1px solid #ddd") // Optional: Add a border
            //             .append("div")
            //             .style("font-size", "16px")
            //             .style("color", "grey")
            //             .text("No data available");
            // }

        }
        // else {


        //     console.log("Empty Line Chart");

        //     // Clear the container
        //     d3.select(`#my_dataviz${i}`).html("");

        //     // Add a centered "No data available" message
        //     d3.select(`#my_dataviz${i}`)
        //         .style("position", "relative")
        //         .style("width", `${containerWidth}px`)
        //         .style("height", `${containerHeight}px`)
        //         .style("display", "flex")
        //         .style("justify-content", "center")
        //         .style("align-items", "center")
        //         .style("border", "1px solid #ddd") // Optional: Add a border
        //         .append("div")
        //         .style("font-size", "16px")
        //         .style("color", "grey")
        //         .text("No data available");


        //             // d3.selectAll(`#my_dataviz${i}`).select("svg").selectAll('g').remove();
        //             // // d3.select(`#my_dataviz${i}`).select("div").remove();


        //             // d3.selectAll(`#my_dataviz${i}`).select("div").selectAll('g').remove();


        //             // d3.select(`#legend${i}`).remove();

        //             // d3.selectAll(`#my_dataviz${i}`).select("div")
        //             //     .append('g')
        //             //     .style("display", "flex")
        //             //     .style("align-items", "center")
        //             //     .style("justify-content", "center")
        //             //     .style("height", `${containerHeight}px`) // Use the containerHeight
        //             //     .style("width", `${containerWidth}px`) // Use the containerWidth
        //             //     .style("font-size", "16px")
        //             //     .style("color", "grey")
        //             //     // .style("background-image", `url(${image1})`) // Set the background image
        //             //     .style("background-size", "21% 100%") // Adjust the image to fit container's width and height
        //             //     .style("background-repeat", "no-repeat") // Prevent the image from repeating
        //             //     .style("background-position", "center") // Center the image
        //             //     .text("No data available");






        // }
    },
        // [ props , data , scrollDelta]
        [containerWidth, reportSlice[i], containerHeight, textLinecolorbar, curved, mouseoverEnabled, mouseoverSwitchType, showGridenabled, temp_containerWidth, fullScreen_enabled, temp_containerHeight, sortData, show_bar_values, YLabel, svgHeight, enable_table, show_Square, curved_line, chart_data, reportSlice, scrollDelta, text_color_arr, data, props.show_table]
    );



    const showTableFunc = async (val, Tdata) => {

        // console.log('data  11511:>> ', data);
        // if (data?.length > 0) {
        //     const fieldNames = Object.keys(data[0]).filter(key => key !== "_id");
        //     if (val) {
        //         await tabulate(data, fieldNames)
        //     }
        //     else {
        //         setshowDiv(false)
        //         d3.selectAll(`#tableContainer${i}`).selectAll("table").remove();
        //     }
        // }


        var updtData

        // console.log('data show_table_fn:>> ', data , Tdata , props.chart_data);



        if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined && dataRetreived.data?.[0]?.[calc]) {
            updtData = dataRetreived.data?.[0]?.[calc]
        }
        else {
            updtData = props.chart_data
        }

        if (reportSlice.layoutInfo[props.indexes]?.filtered_data) {
            updtData = reportSlice.layoutInfo[props.indexes]?.filtered_data
        }
        // if(  props.chart_data !== undefined && props.chart_data?.[0][calc] !== undefined  ){
        //   updtData =  props.chart_data[0][calc]
        // }
        // else{
        //   updtData =  props.chart_data
        // }

        // console.log('updtData :>> ', updtData);

        if (updtData !== undefined && updtData.length > 0) {

            const fieldNames = Object.keys(updtData[0]).filter(key => key !== "_id");
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
        var tableContainer = document.getElementById(`tableContainer${i}`);
        if (tableContainer !== null) {
            tableContainer.innerHTML = "";
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
            .html(function (d) {
                if (typeof d.value === 'number') {
                    return formated_number(d.value);
                }
                return d.value;
            })
            .attr("style", "text-align: center")
            .style('color', 'black')
        return table;
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

    // Function to remove all tooltips
    function removeTooltip() {
        d3.selectAll('.textHover').remove();  // Remove all tooltip instances
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

    const formated_number = (val) => {
        // console.log('val  1583:>> ', val);
        if (val !== null)
            var formattedValue = (val % 1 === 0)
                ? val.toString()
                : val.toFixed(2);
        return formattedValue
    }

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

    return (
        <div>
            <div id={`tooltip${i}`} style={{ position: 'absolute', opacity: 0.9, padding: '10px', borderRadius: '5px', backgroundColor: 'White'  , pointerEvents:'none' }}></div>

            {!chartsLoad ? (
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
            ) : (
                <>
                    <div id={`my_dataviz${i}`}   onMouseLeave={() => { setShowOptions(false); setSortShowOptions(false); }}>
                        <svg ref={chartRef} width={fullScreen_enabled ? temp_containerWidth : containerWidth} />
                    </div>
                    {
                        show_Legend ?
                            <div 
                            // className="legend" 
                            className={`legend ${fullScreen_enabled ? "" : ""}`}
                            id={`legend${i}`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', boxShadow: 'none', marginTop: '-30px' }}></div>
                            :
                            null
                    }
                </>
            )}




            {(props.show_table && chartsLoad) ? (
                <>
                    <div style={{
                        // position: 'absolute',
                        bottom: 0,
                        left: 0,
                        backgroundColor: '#fff',
                        height: (fullScreen_enabled ? '240px' : '200px'),

                    }} id={`tableContainer${i}`}>
                    </div>
                </>
            ) : null}

        </div>


    );
};

export default LineChart;