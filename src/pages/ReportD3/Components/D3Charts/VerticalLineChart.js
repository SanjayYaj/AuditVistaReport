import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useDispatch, useSelector } from 'react-redux';
import { retriveClnPrimaryValue, updateLayoutInfo, setResetCharts, setZoomInStatus, setZoomOutStatus, toggleProcessingState } from '../../../../Slice/reportd3/reportslice';
import { Spinner } from 'reactstrap';
import '../../LayoutInfo.css'





const VerticalLineChart = (props) => {
    const dispatch = useDispatch();
    const chartRef = useRef();
    var containerWidth = props.containerWidth
    var containerHeight = props.containerHeight
    var chart_data = props.chart_data
    var chart_color = props.chart_color
    var curved_line = props.curved_line
    var mouseovered = props.mouseovered
    // var mouseovered_type = props.mouseovered_type
    var mouseovered_type = props.mouseovered_type !== undefined &&  props.mouseovered_type === 'single' ? true : false

    var i = props.id
    var enable_table = props.show_table
    var svgHeight = props.chart_height
    var show_Grid = props.show_Grid
    var temp_containerWidth = props.temp_containerWidth
    var temp_containerHeight = props.temp_containerHeight
    var fullScreen_enabled = props.show_Full_Screen_toggle
    var show_bar_values = props.show_bar_values
    var show_Square = props.show_Square !== undefined &&  props.show_Square === 'square' ? true : false
    var YLabel = props.YLabel
    var text_color_arr = props.text_color
    var barLabel = props.label;

    var showNode = true
    var dataRetreived = props.itemInfo
    var calc = props.math_calc


    var show_Legend = props.show_Legend


    const [data, setData] = useState(chart_data);
    const [textColorbar, SeTextColorBar] = useState([])
    const [curved, setCurved] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [mouseoverEnabled, setMouseoverEnabled] = useState(mouseovered)
    const [mouseoverSwitchType, setMouseoverSwitchType] = useState(mouseovered_type)
    const [showGridEnabled, setShowGridEnabled] = useState(show_Grid);
    const [sortShowOptions, setShowSortoption] = useState(false);
    const [showValues, setShowValues] = useState(show_bar_values);
    const [selectedValues, setSelectedValues] = useState([]);
    const [arrValues, setarrValues] = useState([])
    // const reportSlice = useSelector(state => state.reportSliceReducer);
    const [sortData, setSortData] = useState([]);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [scrollDelta, setScrollDelta] = useState(0);
    const [chartsLoad, setChartsLoad] = useState(true)
    const [processing, setProcessing] = useState(false)


    // const dbInfo = {
    //     encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@65.0.69.57:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
    //     db_name: 'hotel_surguru-beta',
    // }

    const reportSlice = useSelector(state => state.reportSliceReducer)
    const ProcessedID = reportSlice.processingData[props.id]


    const AuthSlice = useSelector(state => state.auth);
    const dbInfo = AuthSlice.db_info

    useEffect(() => {
        console.log("65 vert Line chart", dataRetreived , ProcessedID);

        if (ProcessedID === undefined) {

            if (dataRetreived?.yAxis_arr !== undefined && dataRetreived.data === undefined || dataRetreived.chnaged) {
                setProcessing(true)
                setChartsLoad(false)
                dispatch(toggleProcessingState(dataRetreived.i))
                LoadedData(dataRetreived.x_axis_key.name, '1')
            }
            else if (dataRetreived?.filtered_data !== undefined) {
                setData(dataRetreived?.filtered_data)
                setChartsLoad(true)


            } else {
                setData(chart_data)
                setChartsLoad(true)
            }

        }

        if (ProcessedID) {
            console.log('97 Already Retrteived Data ', dataRetreived)
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


            // if (props.show_table) {
            //     showTableFn(true , dataRetreived.data)
            // }
            // else {
            //     showTableFn(false)
            // }

        }


    }, [props, dataRetreived])



    const LoadedData = async (value, mode, indx) => {
        console.log('Vert Line value , mode :>> ', value, mode, indx);
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
                    dateFields: AuthSlice?.dateRangeField ,
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
                console.log('response 108 Vert Line :>> ', response);

                if (response.status === 200) {

                    if (response.data.data.length > 0) {
                        // if (mode === "1") {

                            var updating_layObj = { ...dataRetreived };

                            updating_layObj.data = response.data.data;
                            updating_layObj.chnaged = false;
                            updating_layObj.configured = true

                            // updating_layObj.combined_arr = newState_clone;
                            // updating_layObj.merged_arr = mergedArr;
                            // updating_layObj.X_axis_value = XaxisValue;

                            console.log('updating_layObj  Line :>> ', updating_layObj);
                            // setData(response.data.x_label)
                            var layoutArr = [...reportSlice.layoutInfo]

                            // Update the specific index by merging properties properly
                            layoutArr[props.indexes] = {
                                ...layoutArr[props.indexes],
                                ...updating_layObj // Spread the properties of updating_layObj directly
                            };

                            console.log('layoutArr  after:>> ', layoutArr, " layoutArr[props.indexes]", layoutArr[props.indexes]);
                            console.log('reportSlice  after updation:>> ', reportSlice.layoutInfo);
                            setData(response.data.data)
                            //   await  dispatch(updateLayoutInfo(layoutArr));
                            setChartsLoad(true)
                            // Dispatch to Redux
                            dispatch(
                                updateLayoutInfo({
                                    index: props.indexes,
                                    updatedObject: updating_layObj,
                                })
                            )

                            // setXaxisValue(response.data.x_label);
                            // setselectedXaxisKey(value);
                            // dataRetreived.yAxis_arr.map(async (yData, yIndx) => {
                            //     console.log(' Vert Line yData :>> ', yData, yIndx);
                            //     await LoadedData(yData, '2', yIndx)
                            // })
                        // }
                    }
                    else {
                        var updating_layObj = { ...dataRetreived };

                        updating_layObj.data = response.data.data;
                        updating_layObj.configured = true

                        var layoutArr = [...reportSlice.layoutInfo]
                        layoutArr[props.indexes] = {
                            ...layoutArr[props.indexes],
                            ...updating_layObj // Spread the properties of updating_layObj directly
                        };


                        setData([])
                        setChartsLoad(true)
                        dispatch(
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
        if (chart_data !== undefined && chart_data.length > 0) {
            // setData(chart_data)
            SeTextColorBar(chart_color) 
            setCurved(curved_line)
            setMouseoverEnabled(mouseovered)
            setMouseoverSwitchType(mouseovered_type)
            setShowGridEnabled(show_Grid)
            setShowValues(show_bar_values)
        }
    }, [chart_data, chart_color, mouseovered, mouseovered_type, enable_table, show_Grid, temp_containerWidth, fullScreen_enabled, temp_containerHeight, show_bar_values])

    // if (data && Array.isArray(data) && data?.length > 0) {
    //     console.log('data--->', data);
    //     var datakeys = Object.keys(data[0]).filter(key => key !== 'year' && key !== "_id");
    //     var datakeys_name = Object.keys(data[0]).filter(key => key === 'year' && key !== "_id");
    // }


    if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined) {
        // console.log('data 278', data, dataRetreived);
        if (data?.[0] !== undefined) {
            var datakeys = Object.keys(data[0] !== undefined ? data[0] : data[0]).filter(key => key !== 'name' && key !== "_id");
            // console.log('datakeys 280:>> ', datakeys);
        }
    }
    else {
        // console.log('data 284', props.chart_data);
        var datakeys = Object.keys(props.chart_data.length > 0 && props.chart_data[0]).filter(key => key !== 'name' && key !== "_id");
        // console.log('datakeys 293:>> ', datakeys);
    }





    // if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined && dataRetreived.data?.[0]?.[calc]) {
    //     console.log('data 278', data, dataRetreived);
    //     if (dataRetreived.data[0][calc][0] !== undefined) {
    //         var datakeys = Object.keys(dataRetreived.data[0][calc] !== undefined ? dataRetreived.data[0][calc][0] : dataRetreived.data[0]).filter(key => key !== 'name' && key !== "_id");
    //         console.log('datakeys 280:>> ', datakeys);
    //     }
    // }
    // else {
    //     console.log('data 284', props.chart_data);
    //     var datakeys = Object.keys(props.chart_data.length > 0 && props.chart_data[0]).filter(key => key !== 'name' && key !== "_id");
    //     console.log('datakeys 293:>> ', datakeys);
    // }

    useEffect(() => {
        console.log("Entered Line", datakeys);
        // const data = chart_data;
        var mod_data;

        if (datakeys !== undefined && datakeys.length > 0) {

            const chartArea = d3.select(`#ChartArea${i}`);
            const noDataDiv = chartArea.select(`#no-data-message-${i}`);

            var chart_id = i;
            if (reportSlice[chart_id] && reportSlice[chart_id].linesorted) {
                mod_data = reportSlice[chart_id].linesorted;
            } else if (reportSlice.layoutInfo[props.indexes]?.configured && reportSlice.layoutInfo[props.indexes].data?.[0]) {
                mod_data = reportSlice.layoutInfo[props.indexes].data;
            }
            else {
                mod_data = chart_data
            }


            if (reportSlice.layoutInfo[props.indexes]?.filtered_data) {
                mod_data = reportSlice.layoutInfo[props.indexes]?.filtered_data
            }



            if (!mod_data || mod_data.length === 0) {
                // Show "No data available" message
                noDataDiv.style('display', 'flex');
                d3.select(`#my_dataviz${i}`).style('display', 'none');
                return; // Exit early to avoid rendering the chart
            } else {
                // Hide the "No data available" message
                noDataDiv.style('display', 'none');
                d3.select(`#my_dataviz${i}`).style('display', 'flex');
            }



            if (mod_data.length > 0) {


                // Clear the "No data available" message if it exists
                d3.selectAll(`#ChartArea${i}`).select('.no-data-message').remove();

                // Clear the "No data available" text if it exists
                d3.select(`#my_dataviz${props.i}`).select("div").text("");



                // var updt_data =  groupData(mod_data)
                // mod_data = updt_data


                const margin = { top: 70, right: 80, bottom: 80, left: 80 };
                if (svgHeight !== undefined && svgHeight !== '') {
                    containerHeight = containerHeight - 200
                }
                else {
                    containerHeight = containerHeight
                }
                var width;
                var height;
                if (fullScreen_enabled !== undefined && fullScreen_enabled !== false) {
                    width = temp_containerWidth - margin.left - margin.right;
                    height = temp_containerHeight - margin.top - margin.bottom - (enable_table ? 200 : 0);
                    containerWidth = temp_containerWidth
                    containerHeight = temp_containerHeight - (enable_table ? 200 : 0);
                } else {
                    width = containerWidth - margin.left - margin.right;
                    height = containerHeight - margin.top - margin.bottom;
                }
                d3.select(chartRef.current).selectAll('*').remove();
                const drag = d3.drag()
                    .on("drag", dragged)
                    .on("end", dragEnded)
                const svg = d3
                    .select(chartRef.current)
                    .attr('width', containerWidth)
                    .attr('height', containerHeight)
                    .append('g')
                    .style("overflow-y", "scroll")
                d3.select(`#my_dataviz${i}`)
                    .call(drag);
                const chartGroup = svg
                    .append("g")
                    .attr('transform', `translate(${margin.left},${margin.top})`);
                let initialMouseX, initialMouseY;
                let initialX, initialY;

                function dragged(event, d) {
                    if (!initialMouseY) {
                        initialMouseX = d3.pointer(event)[0];
                        initialMouseY = d3.pointer(event)[1];
                        const initialTransform = svg.attr("transform");
                        initialX = initialTransform ? parseFloat(initialTransform.split("(")[1].split(",")[0]) : 0;
                        initialY = initialTransform ? parseFloat(initialTransform.split(",")[1].split(")")[0]) : 0;
                    }
                    const mouseY = d3.pointer(event)[1];
                    const deltaY = mouseY - initialMouseY;
                    const newY = initialY + deltaY;
                    if (scrollDelta) {
                        if (newY >= 0 && !(newY >= newContainerHeight - containerHeight + 100)) {
                            svg.attr("transform", `translate(${initialX},${newY})`);
                        }
                        else if (newY <= newContainerHeight - containerHeight) {
                        }
                    }
                }

                function dragEnded(event, d) {
                    initialMouseX = null;
                    initialMouseY = null;
                }

                const xScale = d3
                    .scaleLinear()
                    .domain([0, d3.max(mod_data, (d) => d3.max(datakeys.map((key) => d[key])))])
                    .nice()
                    .range([0, width]);
                const yScale = d3
                    .scalePoint()
                    .domain(mod_data.map((d) => d.name))
                    .range([height, 0]);
                const color = d3.scaleOrdinal().range(
                    textColorbar !== '' && textColorbar !== undefined && textColorbar.length > 0
                        ? textColorbar
                        : ['red', 'blue', 'green', 'orange', 'purple', 'cyan']
                );

                const text_color = d3.scaleOrdinal()
                    .domain(datakeys)
                    .range(text_color_arr !== undefined && text_color_arr.length > 0
                        ? text_color_arr
                        : d3.quantize(d3.interpolateRainbow, datakeys.length + 2));

                var lineClass;
                const yDomain = d3.max(mod_data, (d) => d.name);
                // const defaultYValue = yDomain[0];
                var newContainerHeight = containerHeight + scrollDelta;



                var clipId = `clip-${i}`

                // Define the clip path
                svg.append("clipPath")
                    .attr("id", clipId)
                    .append("rect")
                    .attr("width", containerWidth)
                    .attr("height", containerHeight - margin.bottom);

                const truncateText = (text, maxLength) => {
                    return text?.length > maxLength ? text.slice(0, maxLength) + '…' : text;
                };

                if (newContainerHeight > containerHeight) {
                    const newRange = [newContainerHeight - margin.bottom, 0];
                    var y1 = yScale.range(newRange);
                    svg.append('g').attr('height', newContainerHeight)

                    const axisGroup = svg.append('g')
                        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => typeof d === 'string' ? d.toUpperCase() : d));


                    axisGroup.select(".domain")
                        .attr("transform", `translate(${margin.left}, ${- scrollDelta}) `);



                    const axisLabels = axisGroup.selectAll('text')
                        .text(d => truncateText(d?.toString(), 6)) // Adjust '10' to control the max length
                        .attr("fill", "black")
                        .style("font-size", '11px')
                        .style("font-style", "normal")
                        .style('cursor', 'pointer')
                        .attr('transform', `translate(${margin.left}, ${margin.top - margin.bottom - scrollDelta})`)
                        .on('mouseover', function (event, d) {
                            // Show tooltip on hover with the full text
                            d3.select(this)
                                .append("title")
                                .text(d?.toString());
                        })
                        .on('mouseout', function () {
                            // Remove the tooltip when not hovering
                            d3.select(this).select("title").remove();
                        });


                    let rotationAngle = 0;
                    axisGroup.on('click', function () {
                        rotationAngle = rotationAngle === 0 ? -45 : 0;
                        const textAnchor = rotationAngle === 0 ? 'middle' : 'end';
                        // axisGroup.attr('transform', `translate(${margin.left}, ${margin.top - margin.bottom })`);
                        axisGroup.attr('transform', `translate(${margin.left}, ${margin.top - margin.bottom})`);
                        axisLabels.attr('transform', `translate(${0}, ${margin.top - margin.bottom - scrollDelta}) rotate(${rotationAngle})`)
                        axisGroup.select(".domain")
                            .attr("transform", `translate(${0}, ${margin.top - margin.bottom - scrollDelta}) `);


                    });
                } else {
                    yScale.range([containerHeight - margin.top - margin.bottom, 0]);
                    // svg.append("g").attr('height', containerHeight);

                    // // Define the yScale domain and range
                    // yScale.range([containerHeight - margin.top - margin.bottom, 0]);

                    // // Create and position the axis group
                    // const axisGroup = svg.append('g')
                    //     .attr("transform", `translate(${margin.left}, ${margin.top})`)  // Position the axis within margins
                    // .call(d3.axisLeft(yScale)
                    //     .ticks(5)
                    //     .tickFormat(d => typeof d === 'string' ? d.toUpperCase() : d)
                    // );

                    // // Style the axis line and text labels
                    // axisGroup.selectAll(".tick line")
                    //     .style("stroke", "black");

                    // axisGroup.selectAll(".tick text")
                    //     .attr("fill", "black")
                    //     .style("font-size", '11px')
                    //     .style("font-style", "normal")
                    //     .style('cursor', 'pointer');






                    // Append and configure axis
                    const axisGroup = svg.append('g')
                        .attr("transform", `translate(${margin.left}, ${margin.top})`)
                        .call(d3.axisLeft(yScale)
                            .ticks(5)
                            .tickFormat(d => typeof d === 'string' ? d.toUpperCase() : d)
                        );

                    // Basic styling to make ticks visible
                    axisGroup.selectAll(".tick text")
                        .style("font-size", "11px")
                        .attr("fill", "black");

                    axisGroup.selectAll(".tick line")
                        .style("stroke", "black");


                    const axisLabels = axisGroup.selectAll('text')
                        .text(d => truncateText(d?.toString(), 6)) // Adjust '10' to control the max length
                        .attr("fill", "black")
                        .style("font-size", '11px')
                        .style("font-style", "normal")
                        .style('cursor', 'pointer')
                        // .attr('transform', `translate(${margin.left}, ${margin.bottom - 20})`)
                        .on('mouseover', function (event, d) {
                            // Show tooltip on hover with the full text
                            d3.select(this)
                                .append("title")
                                .text(d?.toString());
                        })
                        .on('mouseout', function () {
                            // Remove the tooltip when not hovering
                            d3.select(this).select("title").remove();
                        });

                    // Rotate the text on axis click
                    // let rotationAngle = 0;
                    // axisGroup.on('click', function () {
                    //     rotationAngle = rotationAngle === 0 ? -45 : 0;
                    //     const textAnchor = rotationAngle === 0 ? 'middle' : 'end';
                    //     axisLabels
                    //         .attr('transform', `translate(${margin.left}, ${margin.bottom - 20}) rotate(${rotationAngle})`)
                    //         .style('text-anchor', textAnchor);
                    // });







                    // const axisLabels = axisGroup.selectAll('text')
                    //     .attr("fill", "black")
                    //     .style("font-size", '11px')
                    //     .style("font-style", "normal")
                    //     .style('cursor', 'pointer')

                    //     .attr('transform', `translate(${margin.left}, ${margin.bottom - 20})`);
                    // let rotationAngle = 0;
                    // axisGroup.on('click', function () {
                    //     rotationAngle = rotationAngle === 0 ? -45 : 0;
                    //     const textAnchor = rotationAngle === 0 ? 'middle' : 'end';
                    //     axisLabels.attr('transform', `translate(${margin.left}, ${margin.bottom - 20}) rotate(${rotationAngle})`)
                    // });
                }
                d3.selectAll(`line ${lineClass}`).remove()
                if (newContainerHeight >= containerHeight) {
                    d3.select(`#my_dataviz${i}`).on('wheel', handleScroll);
                }
                else {
                    setScrollDelta(0)
                }




                svg.select(`#${clipId} rect`)
                    .attr('width', containerWidth)
                    .attr('height', function () {
                        if (scrollDelta <= 0) {
                            return containerHeight - margin.bottom;
                        } else {
                            return Math.max(containerHeight - margin.bottom - scrollDelta, 0);
                        }
                    })
                    .attr('y', function () {
                        if (scrollDelta <= 0) {
                            return 0;
                        } else {
                            return Math.min(scrollDelta, containerHeight - margin.bottom);
                        }
                    });




                datakeys.forEach((valueKey, index) => {
                    const line = getLineGenerator(curved, valueKey);
                    lineClass = `line-${valueKey}`;
                    function getLineGenerator(usecurvedLines, key) {
                        return usecurvedLines
                            ? d3
                                .line()
                                .x((d) => xScale(d[key]))
                                .y((d) => yScale(d.name))
                                .curve(d3.curveCatmullRom.alpha(0.5))
                            : d3
                                .line()
                                .x((d) => xScale(d[key]))
                                .y((d) => yScale(d.name))
                    }
                    const path = chartGroup
                        .append('path')
                        .datum(mod_data)
                        .attr('class', `line ${lineClass}`)
                        .attr('fill', 'none')
                        .attr('stroke', color(valueKey))
                        .attr('stroke-width', 2)
                        // .attr('clip-path', `url(#${clipId})`)
                        .attr('d', line)


                        .style('stroke-dasharray', function () {
                            const totalLength = this.getTotalLength();
                            return totalLength + ' ' + totalLength;
                        })
                        .style('stroke-dashoffset', function () {
                            return this.getTotalLength();
                        })
                        .style('stroke-dashoffset', 0)
                    if (scrollDelta <= 0) {
                        // path
                        //     .attr('transform', `translate(${0}, ${margin.top - margin.bottom})`);
                    }
                    else {
                        path
                            .attr('transform', `translate(${0}, ${- scrollDelta - margin.top})`); //??????
                    }

                    const labelGroup = chartGroup.append('g')
                        .attr('class', 'label-group');
                    if (showNode) {
                        const circles = labelGroup.selectAll('.line-circle')
                            .data(mod_data)
                            .enter()
                            .append('circle')
                            .attr('class', 'line-circle')
                            .attr('cx', d => xScale(d[valueKey]))
                            .attr('cy', d => yScale(d.name) + 10 - (scrollDelta !== 0 ? 8 : 0))
                            .attr('r', 4)
                            .attr('fill', 'green')
                            .style("opacity", 0)
                            .style("opacity", 1)
                            .each(function (d) {
                                const circle = d3.select(this);
                                const xPos = parseFloat(circle.attr('cx'));
                                const yPos = parseFloat(circle.attr('cy'));

                                const tooltipGroup = chartGroup.append('g')
                                    .attr('class', 'tooltip-group')
                                    .style('opacity', 0);

                                tooltipGroup.append('rect')
                                    .attr('class', 'tooltip-background')
                                    .attr('x', xPos + 20)
                                    .attr('y', yPos)
                                    .attr('width', 40)
                                    .attr('height', 40)
                                    .attr('fill', 'white')
                                    .attr('rx', 3)
                                    .attr('ry', 3);

                                const valueText = tooltipGroup.append('text')
                                    .attr('class', 'tooltip-text')
                                    .attr('x', xPos + 20)
                                    .attr('y', yPos - 10)
                                    .attr('fill', 'red')
                                    .style('font-size', '12px')
                                    .style('opacity', 1);

                                const yearText = tooltipGroup.append('text')
                                    .attr('class', 'tooltip-text')
                                    .attr('x', xPos + 20)
                                    .attr('y', yPos + 5)
                                    .attr('fill', 'black')
                                    .style('font-size', '12px')
                                    .style('opacity', 1);

                                const tooltipGroup_circle = chartGroup.append('g')
                                    .attr('class', 'tooltip-group')
                                    .style('opacity', 0);

                                tooltipGroup_circle.selectAll('.tooltip-background')
                                    .data([d])
                                    .join('rect')
                                    .attr('class', 'tooltip-background')
                                    .attr('x', xPos + 20)
                                    .attr('y', yPos - 25)

                                    .attr('width', function (d) {
                                        const maxWidth = 100;
                                        const contentWidth = 150;
                                        return Math.min(maxWidth, contentWidth);
                                    })
                                    .attr('height', function (d) {
                                        const lineHeight = 17;
                                        const numLines = Object.keys(d).length - 1;
                                        const minHeight = 30;
                                        const calculatedHeight = numLines * lineHeight + 20;
                                        return Math.max(minHeight, calculatedHeight);
                                    })
                                    .attr('fill', 'white')
                                    .attr('rx', 3)
                                    .attr('ry', 3);

                                const tooltipText = tooltipGroup_circle.selectAll('.tooltip-text')
                                    .data(Object.entries(d).filter(([key, value]) => key !== '_id'))
                                    .join('text')
                                    .attr('class', 'tooltip-text')
                                    .attr('x', xPos + 30)
                                    .attr('y', (d, i) => yPos - 10 + i * 15)
                                    .attr('fill', 'red')
                                    .style('font-size', '12px')
                                    .text(([key, value]) => `${key}: ${value}`);

                                circle.on("mouseover", mouseoverPoints)
                                    .on('mouseout', mouseoutPoints)
                                    .on('mouseleave', mouseoutPoints)
                            });
                    }


                    d3.select(`#my_dataviz${i}`).selectAll(".xContainer , .x-axis").remove()
                    d3.select(`#my_dataviz${i}`).selectAll(`.x-axis${i}`).remove()

                    // const XAxisContainer = d3.select(`#my_dataviz${i}`)
                    //     .append("svg")
                    //     .attr('class', `x-axis${i}`)
                    //     .style("position", "absolute")
                    //     .style('background-color', 'white')
                    //     .style("top", `${containerHeight - margin.bottom}px`)
                    //     .style("left", '0px')
                    //     .style("width", `${containerWidth - 15}px`)
                    //     .style("height", `${margin.bottom}px`);

                    // const backgroundRect = XAxisContainer.append("rect")
                    //     .attr("x", 0)
                    //     .attr("y", 0)
                    //     .attr("width", containerWidth)
                    //     .attr("height", '100%')
                    //     .attr("fill", "white");

                    // const xAxisSvg = XAxisContainer.append("svg")
                    //     .attr('class', "xContainer")
                    //     .attr("width", containerWidth)
                    //     .attr("height", '100%')
                    //     .append("g")
                    //     .attr("transform", `translate(${100}, 0)`)
                    //     .call(d3.axisBottom(xScale).ticks())
                    //     .call(g => {
                    //         g.selectAll('.domain, text')
                    //             .attr('stroke', fullScreen_enabled ? 'black' : 'black')
                    //             .style("font-size", '10px');
                    //     });



                    // Select the main SVG container
                    const mainSvg = d3.select(`#my_dataviz${i}`).select('svg');

                    // Append the X-axis to the main SVG
                    const xAxisGroup = mainSvg.append("g")
                        .attr("class", `x-axis${i}`)
                        .attr("transform", `translate(${margin.left}, ${containerHeight - margin.bottom})`)
                        .call(d3.axisBottom(xScale).ticks(10)) //xaxis text
                        .call(g => {
                            g.selectAll('.domain, text')
                                .attr('stroke', fullScreen_enabled ? 'black' : 'black')
                                .style("font-size", '10px');
                        });


                    d3.selectAll(`.top-layer${i}`).remove()

                    const TopContainer = d3.select(`#my_dataviz${i}`)
                        .append("svg")
                        .attr('class', `top-layer${i}`)
                        .style("position", "absolute")
                        .style('background-color', 'white')
                        .style("top", `${0}px`)
                        .style("left", '0px')
                        .style("width", `${containerWidth}px`)
                        .style("height", `${margin.top - 15}px`);

                    const TopbackgroundRect = TopContainer.append("rect")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", containerWidth)
                        .attr("height", '100%')
                        .attr("fill", "white");


                    //     showNode

                    if (showNode) {
                        if (show_Square) {
                            const tooltipGroup_square = chartGroup.append('g')
                            d3.selectAll(".line-circle").remove()
                            const squares = labelGroup.selectAll('.line-square')
                                .data(mod_data);
                            squares.exit()
                                .transition()
                                .duration(100)
                                .style('opacity', 0)
                                .remove();

                            const squaresEnter = squares.enter()
                                .append('rect')
                                .attr('class', 'line-square')
                                .attr('x', d => xScale(d[valueKey]) - 2 )
                                .attr('y', d => yScale(d.name) + 5  - (scrollDelta !== 0 ? 10 : 0))// - (scrollDelta !== 0 ? 14 : 6)
                                .attr('width', 8)
                                .attr('height', 8)
                                .attr('fill', 'green')
                                // .style('opacity', 0)
                                // .transition()
                                // .duration(500)
                                .style('opacity', 1);

                            squares.merge(squaresEnter)
                                .on('mouseover', mouseoverPoints)
                                .on('mouseout', mouseoutPoints)
                                .on('mouseleave', mouseoutPoints)
                        }
                    }


                    if (scrollDelta <= 0) {
                        labelGroup
                            .attr('transform', `translate(${0}, ${margin.top - margin.bottom})`);

                        const labelGroup1 = chartGroup.append('g')
                            .attr('class', 'label-group')
                            .style('fill', color(valueKey));
                        labelGroup1.selectAll('.line-label')
                            .data(mod_data)
                            .enter()
                            .append('text')
                            .attr('class', 'line-label')
                            .attr('x', d => xScale(d[valueKey]))
                            .attr('y', d => yScale(d.name) - 20)
                            .text(d => showValues ? d[valueKey] : '')
                            .attr('text-anchor', 'middle')
                            .attr('fill', text_color(valueKey))
                            .style("opacity", 0)
                            .style("opacity", 1);
                    }
                    else {
                        d3.selectAll('.tooltip').remove()
                        d3.selectAll(`.tooltip${i}`).remove()


                        labelGroup
                            .attr('transform', `translate(${0}, ${- scrollDelta - margin.top})`);

                        const chartGroup = svg.append("g")
                            .attr('transform', `translate(${margin.left},${margin.top})`);
                        const labelGroup1 = chartGroup.append('g')
                            .attr('class', 'label-group')
                            .style('fill', color(valueKey));
                        labelGroup1.selectAll('.line-label')
                            .data(mod_data)
                            .enter()
                            .append('text')
                            .attr('class', 'line-label')
                            .attr('x', d => xScale(d[valueKey]))
                            .attr('y', d => yScale(d.name) - 20)
                            .text(d => showValues ? d[valueKey] : '')
                            .attr('text-anchor', 'middle')
                            .attr('fill', text_color(valueKey))
                            .style("opacity", 0)
                            .transition()
                            .duration(800)
                            .style("opacity", 1).attr('transform', `translate(${0}, ${- scrollDelta - margin.top})`)
                    }

                    // function mouseoverPoints(event, d) {
                    //     console.log('463', 463)
                    //     d3.selectAll('.tooltip').remove()
                    //     const [mouseX, mouseY] = d3.pointer(event);
                    //     const xPos = xScale(d[valueKey]);
                    //     const yPos = scrollDelta ? event.pageY - (fullScreen_enabled ? 0 : 200) : yScale(d.year);
                    //     const tooltip = d3.select(`#my_dataviz${i}`)
                    //         .append("div")
                    //         .style("opacity", 0)
                    //         .attr("class", "tooltip")
                    //         .style("position", "absolute")
                    //         .style("background-color", "white")
                    //         .style("border", "solid")
                    //         .style("border-width", "1px")
                    //         .style("border-radius", "5px")
                    //         .style("padding", "10px");

                    //     if (mouseoverEnabled) {
                    //         if (!mouseoverSwitchType) {
                    //             let tooltipContent = `<span style="color:red;">${barLabel}:</span> ${d.year}<br>`;
                    //             tooltipContent += `<span style="color:red;">Value:</span> <span style="color:black;">${d[valueKey]}</span><br>`;
                    //             tooltip
                    //                 .html(tooltipContent)
                    //                 .style("opacity", 1)
                    //                 .style("background-color", "white")
                    //                 .style("color", "black")
                    //                 .style("border", "solid")
                    //                 .style("border-width", "1px")
                    //                 .style("border-radius", "5px")
                    //                 .style("padding", "10px")
                    //                 .style('border', `2px solid ${color(valueKey)}`)
                    //                 .style("left", (event.offsetX + 30) + "px")
                    //                 .style("top", (event.offsetY) + "px")
                    //         } else {
                    //             var totalValue = d3.sum(datakeys.map(key => d[key]));
                    //             let tooltipContent = `<span style="color:red;">Label:</span> ${d.year}<br>`;
                    //             datakeys.forEach(key => {
                    //                 tooltipContent += `<span style="color:red;">${key}:</span> <span style="color:black;">${d[key]}</span><br>`;
                    //             });
                    //             tooltipContent += `<span style="color:red;">Total:</span> <span style="color:black;">${totalValue}</span>`;
                    //             tooltip
                    //                 .html(tooltipContent)
                    //                 .style("opacity", 1)
                    //                 .style("left", (xPos + 120) + "px")
                    //                 .style("top", (yPos - 10) + "px");
                    //         }
                    //     }
                    // }


                    function mouseoverPoints(event, d) {
                        const index = mod_data.findIndex(data => data._id === d._id);
                        d3.selectAll('.tooltip').remove()
                        const mouseX = d3.pointer(event)[0];
                        const mouseY = d3.pointer(event)[1];
                        const xPos = xScale(d[valueKey]);
                        const yPos = scrollDelta ? event.offsetY - (fullScreen_enabled ? 0 : 200) : yScale(index);
                        const tooltip = d3.select(`#my_dataviz${i}`)
                            .append("div")
                            .style("opacity", 0)
                            .attr("class", `tooltip${i}`)
                            .style("position", "absolute")
                            .style("background-color", "white")
                            .style("border", "solid")
                            .style("border-width", "1px")
                            .style("border-radius", "5px")
                            .style("padding", "10px")
                            .style("pointer-events", "none")



                        if (mouseoverEnabled) {
                            var chartContainer = d3.select(`#my_dataviz${i}`).node();
                            var chartContainerRect = chartContainer.getBoundingClientRect();
                            var divX = chartContainerRect.left + window.scrollX;
                            var divY = chartContainerRect.top + window.scrollY;
                            // if (mouseoverSwitchType) {
                            //     // console.log('495', 495)
                            //     let tooltipContent = `<span style="color:red;">${barLabel}:</span> ${d.name}<br>`;
                            //     tooltipContent += `<span style="color:red;">Value:</span> <span style="color:black;">${d[valueKey]}</span><br>`;
                            //     tooltip
                            //         .html(tooltipContent)
                            //         .style("opacity", 1)
                            //         .style("background-color", "white")
                            //         .style("color", "black")
                            //         .style("border", "solid")
                            //         .style("border-width", "1px")
                            //         .style("border-radius", "5px")
                            //         .style("padding", "10px")
                            //         .style('border', `2px solid ${color(valueKey)}`)
                            //         .style("left", (event.offsetX + 30) + "px")
                            //         .style("top", (event.offsetY) + "px")
                            //         .style('pointer-events', 'none');

                            // } else {
                            //     var totalValue = d3.sum(datakeys.map(key => d[key]));
                            //     let tooltipContent = `<span style="color:red;">Label:</span> ${d.name}<br>`;
                            //     datakeys.forEach(key => {
                            //         tooltipContent += `<span style="color:red;">${key}:</span> <span style="color:black;">${d[key]}</span><br>`;
                            //     });
                            //     tooltipContent += `<span style="color:red;">Total:</span> <span style="color:black;">${totalValue}</span>`;
                            //     tooltip
                            //         .html(tooltipContent)
                            //         .style("opacity", 1)

                            //     // Calculate tooltip dimensions
                            //     const tooltipNode = tooltip.node();
                            //     const tooltipRect = tooltipNode.getBoundingClientRect();
                            //     const tooltipWidth = tooltipRect.width;
                            //     const tooltipHeight = tooltipRect.height;

                            //     let leftPosition = event.pageX - divX + 20;
                            //     let topPosition = event.pageY - divY - 10;

                            //     if (topPosition + tooltipHeight > chartContainerRect.height) {
                            //         topPosition -= tooltipHeight;
                            //     }
                            //     if (leftPosition + tooltipWidth > chartContainerRect.width) {
                            //         leftPosition = event.pageX - divX - tooltipWidth - 10; // Move to the left of the cursor
                            //     }

                            //     tooltip
                            //         .style("left", (leftPosition) + "px")
                            //         .style("top", (topPosition) + "px");
                            // }

                            console.log('mouseoverSwitchType', mouseoverSwitchType)
                            if (mouseoverSwitchType) {
                                let tooltipContent = `<span style="color:red;">${barLabel}:</span> ${d.name}<br>`;
                                tooltipContent += `<span style="color:red;">Value:</span> <span style="color:black;">${d[valueKey]}</span><br>`;

                                tooltip
                                    .html(tooltipContent)
                                    .style("opacity", 1)
                                    .style("background-color", "white")
                                    .style("color", "black")
                                    .style("border", "solid")
                                    .style("border-width", "1px")
                                    .style("border-radius", "5px")
                                    .style("padding", "10px")
                                    .style("border", `2px solid ${color(valueKey)}`)
                                    .style("pointer-events", "none");

                                // Get tooltip dimensions
                                const tooltipNode = tooltip.node();
                                const tooltipRect = tooltipNode.getBoundingClientRect();
                                const tooltipWidth = tooltipRect.width;
                                const tooltipHeight = tooltipRect.height;

                                // Default positions
                                let leftPosition = event.pageX + 20;
                                let topPosition = event.pageY - tooltipHeight / 2;

                                // Ensure tooltip stays within chart container
                                if (leftPosition + tooltipWidth > chartContainerRect.right) {
                                    leftPosition = event.pageX - tooltipWidth - 20;
                                }
                                if (topPosition < chartContainerRect.top) {
                                    topPosition = chartContainerRect.top;
                                }
                                if (topPosition + tooltipHeight > chartContainerRect.bottom) {
                                    topPosition = chartContainerRect.bottom - tooltipHeight;
                                }

                                tooltip.style("left", `${leftPosition}px`).style("top", `${topPosition}px`);
                            } else {
                                var totalValue = d3.sum(datakeys.map(key => d[key]));
                                let tooltipContent = `<span style="color:red;">Label:</span> ${d.name}<br>`;

                                datakeys.forEach(key => {
                                    tooltipContent += `<span style="color:red;">${key}:</span> <span style="color:black;">${d[key]}</span><br>`;
                                });

                                tooltipContent += `<span style="color:red;">Total:</span> <span style="color:black;">${totalValue}</span>`;

                                tooltip
                                    .html(tooltipContent)
                                    .style("opacity", 1);

                                // Get tooltip dimensions
                                const tooltipNode = tooltip.node();
                                const tooltipRect = tooltipNode.getBoundingClientRect();
                                const tooltipWidth = tooltipRect.width;
                                const tooltipHeight = tooltipRect.height;

                                // Mouse pointer position
                                let leftPosition = event.offsetX + 80; // Offset for better visibility
                                let topPosition = event.offsetY - 10;
                                console.log("left>>>>>>>>>", leftPosition, "topPosition", topPosition, "tooltipHeight", tooltipHeight, "containerHeight", containerHeight);


                                console.log("lef", leftPosition, "tooltip", tooltipWidth, "containerWidth", containerWidth);

                                // Get exact mouse position relative to chart container
                                let [mouseX, mouseY] = d3.pointer(event, chartContainer);


           console.log('mouseX :>> ', mouseX , mouseY); 
           
           topPosition = mouseY - tooltipHeight / 2; // Center tooltip vertically
              leftPosition = mouseX + 20; // Offset to the right

                                // Prevent tooltip from going out of bounds (right & bottom)
                                if (leftPosition + tooltipWidth > window.innerWidth) {
                                    console.log("leftPosition Calccccc");
                                    leftPosition = event.pageX - tooltipWidth - 10; // Move left
                                    console.log("left----", leftPosition);

                                }
                                // if (topPosition + tooltipHeight > containerHeight - margin.top - margin.bottom) {
                                //      console.log('topPosition calccccc');
                                //     topPosition -=  30; // Move up
                                // }

                                console.log('topPosition :>> ', topPosition);       
                            
                                tooltip
                                    .style("left", `${leftPosition}px`)
                                    .style("top", `${topPosition}px`);
                            }
                            
                            
                            
                            // Remove tooltip on mouseout
                            d3.selectAll(".bar")
                                .on("mouseout", function () {
                                    tooltip.style("opacity", 0);
                                });


                                

                        }
                    }

                    // function mouseoutPoints(event, d) {
                    //     d3.selectAll('.tooltip').remove()
                    //     chartGroup.selectAll('.tooltip-group').remove();
                    //     chartGroup.selectAll('.tooltip-group-square').remove();
                    // }
                    function mouseoutPoints(event, d) {
                        d3.selectAll('.tooltip').remove()
                        d3.selectAll(`.tooltip${i}`).remove()
                        chartGroup.selectAll('.tooltip-group').remove();
                        chartGroup.selectAll('.tooltip-group-square').remove();
                    }
                });

                if (show_Grid) {
                    chartGroup.insert('g', ':first-child')
                        .attr('class', 'x-grid')
                        .attr('transform', `translate(0, ${height})`)
                        .call(d3.axisBottom(xScale).tickSize(scrollDelta !== 0 ? (margin.bottom - newContainerHeight) : (margin.bottom - height - margin.top - 20)).tickFormat(''))
                        .selectAll('line')
                        .attr('stroke', 'lightgrey')
                    chartGroup.insert('g', ':first-child')
                        .attr('class', 'y-grid')
                        .attr('transform', `translate(${0}, ${scrollDelta !== 0 ? (- scrollDelta - margin.top) : -10})`)
                        .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(''))
                        .selectAll('line')
                        .attr('stroke', 'lightgrey');
                } else {
                    chartGroup.selectAll('.grid').remove();
                }

                var datakeys_mod

                if (YLabel.length > 0) {
                    datakeys_mod = YLabel.slice(1)
                }
                else {
                    datakeys_mod = datakeys
                }
                // const legendContainer = d3.select(`#legend${i}`);
                // const legendY = height + margin.bottom - 40;
                // legendContainer.selectAll('*').remove();

                // datakeys_mod.forEach((key, i) => {
                //     const legendItemGroup = legendContainer.append('div')
                //         .attr('class', 'legend-item')
                //     legendItemGroup.append('div')
                //         .attr('class', 'legend-rect')
                //         .style('background-color', (chart_color?.length > 0 && chart_color[i + 1] != null) ? chart_color[i] : color(key))
                //     const legend = legendContainer.attr('transform', `translate(${250}, ${legendY})`);
                //     legendItemGroup.append('text')
                //         .attr('fill', color(key))
                //         .text(key)
                // });

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
                    showTableFn(true)
                }
                else {
                    showTableFn(false)
                }
                const handleResetButtonClick = () => {
                    setScrollDelta(0);
                    xScale.range([0, containerWidth - margin.left - margin.right])
                    svg.attr("width", containerWidth)
                    svg.attr("transform", `translate(${0},${margin.top - margin.bottom})`)
                };
                // document.getElementById(`togglereset-${i}`)?.addEventListener('click', function (event) {
                //     handleResetButtonClick()
                // })
                if (i === reportSlice.resetCharts.i) {
                    handleResetButtonClick();
                    dispatch(setResetCharts([]));
                }
            }



        }
        // else {
        //     // Check if the container exists before proceeding
        //     const container = d3.select(`#my_dataviz${i}`);
        //     if (container.empty()) {
        //         console.error(`Container #my_dataviz${i} does not exist.`);
        //         return;
        //     }

        //     // Clear all child nodes inside the container
        //     container.selectAll("*").remove();  // Remove all child nodes including any SVG or other elements

        //     // Remove the legend if it exists
        //     d3.select(`#legend${i}`).remove();

        //     // Now add the "No data available" message inside the div container
        //     container
        //         .style("position", "relative")
        //         .style("width", `${containerWidth}px`)
        //         .style("height", `${containerHeight}px`)
        //         .style("display", "flex")
        //         .style("justify-content", "center")
        //         .style("align-items", "center")
        //         .style("border", "1px solid #ddd") // Optional: Add a border for visibility
        //         .append("div")  // Append the div here
        //         .style("font-size", "16px")
        //         .style("color", "grey")
        //         .text("No data available");


        //     // Clear the container
        //     //   d3.select(`#ChartArea${i}`)?.html("");

        //     //   d3.select(`#legend${i}`)?.remove();
        //     //   // Add a centered "No data available" message
        //     //   d3.select(`#my_dataviz${i}`)
        //     //       .style("position", "relative")
        //     //       .style("width", `${containerWidth}px`)
        //     //       .style("height", `${containerHeight}px`)
        //     //       .style("display", "flex")
        //     //       .style("justify-content", "center")
        //     //       .style("align-items", "center")
        //     //       .style("border", "1px solid #ddd") // Optional: Add a border
        //     //       .append("div")
        //     //       .style("font-size", "16px")
        //     //       .style("color", "grey")
        //     //       .text("No data available");

        // }









        
        //     else{
        //     const chartArea = d3.select(`#ChartArea${i}`);

        //         const noDataDiv = chartArea?.select(`#no-data-message-${i}`);
        // //   if (chart_data.length === 0) {
        // //     d3.select(`#my_dataviz${i}`).selectAll("svg").remove();
        // //     d3.select(`#my_dataviz${i}`).selectAll("div").remove();

        //     d3.select(`#legend${i}`)?.remove();

        // //     d3.select(`#my_dataviz${i}`)
        // //         .append("div")
        // //         .style("display", "flex")
        // //         .style("align-items", "center")
        // //         .style("justify-content", "center")
        // //         .style("height", `${containerHeight}px`) // Use the containerHeight
        // //         .style("width", `${containerWidth}px`) // Use the containerWidth
        // //         .style("font-size", "16px")
        // //         .style("color", "grey")
        // //         // .style("background-image", `url(${image1})`) // Set the background image
        // //         .style("background-size", "21% 100%") // Adjust the image to fit container's width and height
        // //         .style("background-repeat", "no-repeat") // Prevent the image from repeating
        // //         .style("background-position", "center") // Center the image
        // //         .text("No data available");

        // //     return; // Exit to avoid rendering the chart


        // noDataDiv?.style('display', 'flex');
        // d3.select(`#my_dataviz${i}`)?.style('display', 'none');
        // return; // Exit early to avoid rendering the chart
        // // }
        //     }
    },
        // [  props , data , scrollDelta]
        [containerWidth, YLabel, containerHeight, textColorbar, curved, mouseoverEnabled, mouseoverSwitchType, showGridEnabled, temp_containerWidth, fullScreen_enabled, temp_containerHeight, sortData, showValues, enable_table, svgHeight, show_Square, chart_color, reportSlice, scrollDelta, text_color_arr, data, reportSlice]
    );




    const groupData = (val) => {
        // console.log('val 877 :>> ', val);
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




    const showTableFn = async (val) => {
        console.log('data 1888 :>> ', data);


        var updtData
        console.log('data show_table_fn:>> ', data, props.chart_data);

        if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined ) {
            updtData = dataRetreived.data
        }
        else {
            updtData = props.chart_data
        }



        if (reportSlice.layoutInfo[props.indexes]?.filtered_data) {
            updtData = reportSlice.layoutInfo[props.indexes]?.filtered_data
        }



        console.log('updtData :>> ', updtData);
        const fieldNames = Object.keys(updtData[0]).filter(key => key !== "_id");
        if (val) {
            console.log('fieldNames :>> ', fieldNames);
            await tabulate(updtData, fieldNames)
        }
        else {
            d3.selectAll(`#tableContainer${i}`).selectAll("table").remove();
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
            .style("width", `${fullScreen_enabled ? temp_containerWidth : containerWidth - 12}px`);
        var thead = table.append("thead");
        var tbody = table.append("tbody");
        d3.select(tableContainer)
            .attr('class', 'table_body')
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
            .html(function (d) { return d.value; })
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
            deltaYExtension = -100;
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
        const delta = event.deltaY;
        setScrollDelta(prevDelta => prevDelta + delta);
        const newZoomLevel = zoomLevel + (delta > 0 ? -0.1 : 0.1);



        if (newZoomLevel > 0) {
            setZoomLevel(newZoomLevel);
        }
    };
    const handleSort = () => {
        var chart_id = i;
        dispatch(sortFunc({ data, arrValues, chart_id }));
    }
    const handleSortDesc = () => {
        var chart_id = i;
        dispatch(sortDescending({ data, arrValues, chart_id }));
    }
    const handleSortDefault = () => {
        dispatch(sortVerticalline({ data: chart_data, chart_id: i }));
        setSortData([...chart_data]);
    };

    const handleCheckboxChange = (e, value) => {
        if (e.target.checked) {
            setarrValues((prevData) => [
                ...prevData,
                value
            ]);
        } else {
            setarrValues(arrValues.filter((val) => val !== value));
        }
        if (selectedValues.includes(value)) {
            setSelectedValues(selectedValues.filter((val) => val !== value));
        } else {
            setSelectedValues([...selectedValues, value]);
        }
    };
    return (
        <div>
            <div id={`tooltip${i}`} style={{ position: 'absolute', opacity: 0, background: 'lightgray', padding: '10px', borderRadius: '5px' }} ></div>



            <div id={`ChartArea${i}`}>

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
                        <>
                            <div id={`my_dataviz${i}`} width={(fullScreen_enabled !== undefined && fullScreen_enabled !== false) ? temp_containerWidth : containerWidth}
                                onMouseLeave={() => { setShowOptions(false); setShowSortoption(false); }} >
                                <svg ref={chartRef} width={(fullScreen_enabled ? temp_containerWidth : containerWidth)} height={(fullScreen_enabled ? temp_containerHeight : containerHeight)} >
                                    <g ></g>
                                </svg>
                            </div>
                            {
                                show_Legend ?
                                    <div className="legend" id={`legend${i}`} style={{ position: '', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', boxShadow: 'none', marginTop: '-40px' }}></div>
                                    :
                                    null
                            }
                        </>
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
                }

                {/* <div className="legend" id={`legend${i}`} style={{ position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'centre', marginLeft: containerWidth / 3, marginTop: '-40px', boxShadow: 'none' }}></div> */}



            </div>
            {isLoading &&
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>}
            {(props.show_table && chartsLoad) ? (
                <>
                    <div style={{
                        bottom: 0,
                        left: 0,
                        backgroundColor: '#fff',
                        height: (fullScreen_enabled ? '240px' : '200px')

                    }} id={`tableContainer${i}`}>
                    </div>
                </>
            ) : null}
        </div>
    );
};
export default VerticalLineChart;