import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'reactstrap';
import { toggleProcessingState, setResetCharts, retriveClnPrimaryValue, updateLayoutInfo } from '../../../../Slice/reportd3/reportslice';
import '../../LayoutInfo.css'
import urlSocket from '../../../../helpers/urlSocket';



const HorizontalBarChart = (props) => {
    const dispatch = useDispatch();
    const chartRef = useRef();
    const [showOptions, setShowOptions] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [sortshowOptions, setshowsortoption] = useState(false);
    const [tableColumns, settableColumns] = useState(["name", "value"]);
    var containerWidth = props.containerWidth
    var containerHeight = props.containerHeight
    var chart_data = props.chart_data
    var i = props.id
    var label_name = props.label
    var barColor = props.chart_color;
    var YLabel = props.YLabel
    var mouseovered = props.mouseovered
    var barLabel = props.label;
    var showline = props.show_Line
    var xLabel = 'Name'
    var enable_table = props.show_table
    var svgHeight = props.chart_height
    var show_Grid = props.show_Grid
    var temp_containerWidth = props.temp_containerWidth
    var temp_containerHeight = props.temp_containerHeight
    var curved_line = props.curved_line
    // var show_Square = props.show_Square
  var show_Square = props.show_Square !== undefined &&  props.show_Square === 'square' ? true : false

    var Ylabel = props.YLabel !== undefined ? props.YLabel : 'value'
    var BarWidth = props.BarWidth
    var text_color_arr = props.text_color
    var dataRetreived = props.itemInfo
    var show_bar_values = props.show_bar_values

    var calc = props.math_calc
    var show_Legend = props.show_Legend


    const [data, setData] = useState(chart_data)

    const [mouseoverEnabled, setmouseoverEnabled] = useState(mouseovered)
    const [yLabelName, setYLabelName] = useState('value')
    const [showLine, setShowLine] = useState(showline)
    const [enabledTable, setEnabledTable] = useState(enable_table)
    const [showGridEnabled, setshowGridEnabled] = useState(show_Grid)
    const [sortData, setsortData] = useState([]);
    const [showValues, setShowValues] = useState(show_bar_values);

    const [chartsLoad, setChartsLoad] = useState(true)
    const [processing, setProcessing] = useState(false)


    var fullScreen_enabled = props.show_Full_Screen_toggle
    // const reportSlice = useSelector(state => state.reportSliceReducer);

    // const dbInfo = {
    //     encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@65.0.69.57:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
    //     db_name: 'hotel_surguru-beta',
    // }

    const reportSlice = useSelector(state => state.reportSliceReducer);
    const ProcessedID = reportSlice.processingData[props.id];

    const AuthSlice = useSelector(state => state.auth);
    const dbInfo = AuthSlice.db_info
console.log('Ylabel :>> ', Ylabel);

    useEffect(() => {
        console.log("66 Hor chart", dataRetreived);

        if (ProcessedID === undefined) {

            if (dataRetreived.y_axis_key && dataRetreived.data === undefined || dataRetreived.chnaged) {
                setProcessing(true)
                setChartsLoad(false)
                dispatch(toggleProcessingState(dataRetreived.i))
                LoadedData(dataRetreived.x_axis_key, '1')
            }
            else if (dataRetreived.filtered_data !== undefined) {
                setData(dataRetreived.filtered_data)

            }
        }


        if (ProcessedID) {
            console.log('96 Already Retyrteived Data ', dataRetreived)
            if (dataRetreived.filtered_data !== undefined) {
                setData(dataRetreived.filtered_data)
                setChartsLoad(true)
            }
            else if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined && dataRetreived.data) {
                setData(dataRetreived.data)
                setChartsLoad(true)
            }
            else {
                setData(dataRetreived.data)
                setChartsLoad(true)
            }


            if (props.show_table) {
                showTableFn(true, dataRetreived.data)
            }
            else {
                showTableFn(false)
            }

        }


    }, [props , dataRetreived])

    const LoadedData = async (value, mode) => {
        console.log('value , mode :>> ', value, mode);
        try {
            console.log('dataRetreived :>> ', dataRetreived);
            if (dataRetreived !== undefined) {
                const data = {
                    collection_name: dataRetreived?.selected_cln_name?.cln_name,
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    db_name: dbInfo.db_name,
                    primary_key: [],
                    selected_primary_key: value.name,
                    selected_primary_value: [],
                    chart_position: mode,
                     additional_fields: [dataRetreived?.y_axis_key.name] ,

                    mode: "1",
                    // startDate: reportSlice.startDate,
                    // endDate: reportSlice.endDate,
                    // dateFields: AuthSlice?.dateRangeField ,
                    CalculationArr: dataRetreived.CalculationArr , 




                    collection2:dataRetreived.selected_cln_name[1],
                    collection1: dataRetreived.selected_cln_name[0],

                    groupingField: dataRetreived.groupingKeys,
                    // want to send the level key field for choosing the level values
                    level: dataRetreived.groupingValue,

                    relationshipdata: reportSlice.pageNodeInfo.relationships,
                    chartType:'0' ,
                    collections: reportSlice.pageNodeInfo.selected_cln_name ,
                    categoryField: dataRetreived.legend_category != undefined ? dataRetreived.legend_category.name : '',
                    chartName: dataRetreived.name,
                }
                console.log(data, 'data')

                const response = await urlSocket.post("report/retrive-barchart-data", data)
                console.log('response  162:>> ', response);
                // var response = await dispatch(retriveClnPrimaryValue(data))
                // console.log(response, 'response  Hor Bar 102')

                if (response !== undefined && response.status === 200) {


                    if (response.data.data.length > 0) {

                        // if (mode === "1") {


                            var updating_layObj = { ...dataRetreived };
                            updating_layObj.data = response.data.data;
                            updating_layObj.configured = true
                            updating_layObj.chnaged = false;
                            console.log('updating_layObj Hor bar :>> ', updating_layObj, reportSlice, props.indexes);

                            var layoutArr = [...reportSlice.layoutInfo]

                            // Update the specific index by merging properties properly
                            layoutArr[props.indexes] = {
                                ...layoutArr[props.indexes],
                                ...updating_layObj // Spread the properties of updating_layObj directly
                            };
                            dispatch(
                                updateLayoutInfo({
                                    index: props.indexes,
                                    updatedObject: updating_layObj,
                                })
                            )

                            setData(response.data.data)
                            setChartsLoad(true)


                        // }
                    }
                    else{

                        var updating_layObj = { ...dataRetreived };
                        updating_layObj.data = response.data.data;
                        updating_layObj.configured = true

                        var layoutArr = [...reportSlice.layoutInfo]

                        // Update the specific index by merging properties properly
                        layoutArr[props.indexes] = {
                            ...layoutArr[props.indexes],
                            ...updating_layObj // Spread the properties of updating_layObj directly
                        };
                        dispatch(
                            updateLayoutInfo({
                                index: props.indexes,
                                updatedObject: updating_layObj,
                            })
                        )

                        setData([])
                        setChartsLoad(true)
                    }
                }
            }
        } catch (error) {
            console.log('error :>> ', error);
        }
    }




    // useEffect(() => {
    //     if (dataRetreived.y_axis_key && dataRetreived.data === undefined && processing === false || dataRetreived.chnaged) {
    //         setProcessing(true)

    //         setChartsLoad(false)
    //         LoadedData(dataRetreived.x_axis_key, '1')
    //     }
    //     else {
    //         setChartsLoad(true)
    //     }
    // }, [props, dataRetreived])

    // const LoadedData = async (value, mode) => {
    //     try {
    //         if (dataRetreived !== undefined) {
    //             const data = {
    //                 collection_name: dataRetreived?.selected_cln_name?.cln_name,
    //                 encrypted_db_url: dbInfo.encrypted_db_url,
    //                 db_name: dbInfo.db_name,
    //                 primary_key: [],
    //                 selected_primary_key: value.name,
    //                 selected_primary_value: [],
    //                 chart_position: mode,
    //                 additional_fields: [dataRetreived?.y_axis_key.name],

    //                 mode: "1",
    //             }

    //             var response = await dispatch(retriveClnPrimaryValue(data))
    //             if (response !== undefined && response.status === 200) {
    //                 if (mode === "1") {
    //                     var updating_layObj = { ...dataRetreived };
    //                     updating_layObj.data = response.data.x_label;

    //                     var layoutArr = [...reportSlice.layoutInfo]

    //                     layoutArr[props.indexes] = {
    //                         ...layoutArr[props.indexes],
    //                         ...updating_layObj // Spread the properties of updating_layObj directly
    //                     };

    //                     setData(response.data.x_label)
    //                     setChartsLoad(true)
    //                     setData(response.data.x_label)
    //                 }
    //                 if (mode === "2") {

    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.log('error :>> ', error);
    //     }
    // }


    useEffect(() => {
        if (chart_data !== undefined && chart_data.length > 0) {
            // setData(chart_data)
            setmouseoverEnabled(mouseovered)
            setShowLine(showline)
            setEnabledTable(enable_table)
            setshowGridEnabled(show_Grid)
            setShowValues(show_bar_values)
        }
        else {
            setData(chart_data)
        }
    },
        // [props]
        [chart_data, barColor, label_name, mouseovered, showline, enable_table, svgHeight, show_Grid, show_bar_values, fullScreen_enabled]
    )

    // if (data && Array.isArray(data) && data?.length > 0) {
    //     console.log('data', data);
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
        console.log('Sample data Datakeys', props.chart_data);
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
    //     var datakeys = Object.keys( props.chart_data.length > 0 &&  props.chart_data[0] ).filter(key => key !== 'name' && key !== "_id");
    //     console.log('datakeys 293:>> ', datakeys);
    // }


    
    
    const margin = { top: 70, right: 80, bottom: 80, left: 80 };

    // useEffect(() => {
    //     legendHolder()
    // }, [Ylabel])


    useEffect(() => {
        const chartArea = d3.select(`#ChartArea${i}`);
        const noDataDiv = chartArea.select(`#no-data-message-${i}`);

        var mod_data;
        console.log('datakeys Hor.bar :>> ', datakeys);

        if (datakeys !== undefined && datakeys.length > 0) {
            var chart_id = i;
            if (reportSlice[chart_id] && reportSlice[chart_id].horbarsorted) {
                mod_data = reportSlice[chart_id].horbarsorted;
            } else if (reportSlice.layoutInfo[props.indexes]?.configured && reportSlice.layoutInfo[props.indexes].data?.[0]) {
                mod_data = reportSlice.layoutInfo[props.indexes].data;
            }
            else {
                mod_data = chart_data
            }


            console.log('mod_data  303:>> ', mod_data);

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
                height = temp_containerHeight - margin.top - margin.bottom - (enabledTable ? 200 : 0);
                containerWidth = temp_containerWidth
                containerHeight = temp_containerHeight - (enabledTable ? 200 : 0) + margin.top
            }
            else {
                width = containerWidth - margin.left - margin.right;
                height = containerHeight - margin.top - margin.bottom;

            }
            const temp_barHeight = BarWidth !== undefined ? Number(BarWidth) : 45;
            const marginTop = margin.top;
            const marginRight = margin.right;
            const marginBottom = margin.bottom;
            const marginLeft = margin.left;

            const extent = [
                [marginLeft, marginTop],
                [marginLeft, containerHeight - marginBottom]
            ];


            if (reportSlice.layoutInfo[props.indexes].filtered_data) {
                mod_data = reportSlice.layoutInfo[props.indexes].filtered_data
            }



            if (mod_data && mod_data.length > 0) {

                d3.selectAll(`#ChartArea${i}`).select('.no-data-message').remove();

                // Clear the "No data available" text if it exists
                d3.select(`#my_dataviz${props.i}`).select("div").text("");


                const zoom = d3.zoom()
                    .scaleExtent([1, 10])
                    .translateExtent(extent)
                    .extent(extent)
                    .on("zoom", zoomed);


                const svg = d3.select(`#my_dataviz${i}`)
                    .attr('width', containerWidth)
                    .attr('height', containerHeight)
                    .call(zoom)

                const g = svg.select('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

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

                mod_data = groupData(mod_data)

                const yScale = d3.scaleBand()
                    .domain(mod_data.map(d => d.name))
                    .range([containerHeight - marginBottom, margin.top])
                    .padding(0.1);

                const xScale = d3.scaleLinear()
                    .domain([0, d3.max(mod_data, d => d.value)])
                    .nice()
                    .range([0, width]);
                // const g = svg.select('g');
                g.selectAll('*').remove();
                svg.attr('transform', `translate(${margin.left},${marginTop - marginBottom})`);
                g.attr('transform', `translate(${margin.left},${marginBottom - marginTop})`);
                if (show_Grid) {
                    g.insert('g', ':first-child')
                        .attr('class', 'grid')
                        .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(''))
                        .selectAll('line')
                        .attr('stroke', 'lightgrey');
                } else {
                    g.selectAll('.grid').remove();
                }

                // const axisLabels =
                //     g.append('g')
                //         .call(d3.axisLeft(yScale).ticks(fullScreen_enabled ? 20 : 5).tickFormat(d => typeof d === 'string' ? d.toUpperCase() : d))
                //         .selectAll('text')
                //         .style("text-anchor", "end")
                //         .attr("font-size", "11px")
                //         .attr('fill', 'black')
                //         .style("font-style", "normal")
                //         .style('cursor', 'pointer')

                // let rotationAngle = 0;
                // axisLabels.each(function (_, i) {
                //     const label = this;
                //     d3.select(label).on('click', function () {
                //         const currentRotation = rotationAngle === 0 ? -45 : 0;
                //         const currentAnchor = rotationAngle === 0 ? 'end' : "middle";
                //         axisLabels.attr('transform', `rotate(${currentRotation})`)
                //             .style("text-anchor", 'end')
                //         rotationAngle = currentRotation;
                //     });
                // });

                const charLimit = 5;

                const axisLabels =
                    g.append('g')
                        .call(d3.axisLeft(yScale).ticks(fullScreen_enabled ? 20 : 5).tickFormat(d => typeof d === 'string' ? d.toUpperCase() : d))
                        .selectAll('text')
                        .style("text-anchor", "end")
                        .attr("font-size", "11px")
                        .attr('fill', 'black')
                        .style("font-style", "normal")
                        .style('cursor', 'pointer')
                        .text(function (d) {

                            if (!d || typeof d === undefined) {
                                return "(blank)";
                            }
                            return d.length > charLimit ? `${d.substring(0, charLimit)}...` : d;
                        });

                const tooltip = d3.select('body').append('div')
                    .attr('class', 'textHover')
                    .style('position', 'absolute')
                    .style('background', '#f9f9f9')
                    .style('padding', '5px')
                    .style('border', '1px solid #ccc')
                    .style('border-radius', '5px')
                    .style('pointer-events', 'none')
                    .style('visibility', 'hidden')
                    .style('font-size', '12px');

                axisLabels
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
                // .on('mouseover', function (event, d) {
                //     const tooltipText = (!d || typeof d !== 'string') ? "(blank)" : d;
                //     tooltip.style('visibility', 'visible')
                //         .text(tooltipText);
                // })
                //     .on('mousemove', function (event) {
                //         tooltip.style('top', `${event.pageY + 10}px`)
                //             .style('left', `${event.pageX + 10}px`);
                //     })
                //     .on('mouseleave', function () {
                //         tooltip.style('visibility', 'hidden');
                //     })
                //     .on('mouseout', function () {
                //         tooltip.style('visibility', 'hidden');
                //     });




                g.append("text")
                    .attr("class", "axis-label")
                    .attr("text-anchor", "start")
                    .attr('transform', 'rotate(-90)')
                    .attr("x", (-(containerHeight + margin.top) / 2)) // Position horizontally based on margin left
                    .attr("y", -(margin.top - 20)) // Position vertically based on margin top
                    .text('barYLabel');

                displayHorvalues();

                function displayHorvalues() {
                    g.selectAll('.bar-label')
                        .data(mod_data)
                        .enter()
                        .append('text')
                        .attr('clip-path', `url(#${`clip-${i}`})`)

                        .attr('class', 'bar-label')
                        .attr('x', d => xScale(d.value) + 5)
                        .attr('y', d => yScale(d.name) + yScale.bandwidth() / 2)
                        .attr('text-anchor', 'start')
                        .text(d => showValues ? d.value : '')
                        .attr('fill', d => text_color_arr)
                        .attr('text-anchor', 'start')
                        .style('font-size', '12px')
                }

                g.selectAll('.bar')
                    .data(mod_data)
                    .attr('y', d => yScale(d.name))
                    .attr('x', 0)
                    .attr('height', yScale.bandwidth())
                    .attr('width', d => xScale(d.value))
                    .attr('fill', `${props.chart_color}`)

                function handleMouseOver(event, d) {
                    if (mouseoverEnabled) {
                        var chartContainer = d3.select(`#my_dataviz${i}`).node();
                        var chartContainerRect = chartContainer.getBoundingClientRect();
                        d3.select(this).attr('fill', brightenColor(barColor, 0.2))
                            .style('cursor', 'pointer');
                        var tooltip = d3.select(`#tooltip${i}`);

                        if (tooltip.empty()) {
                            tooltip = d3.select(`#my_dataviz${i}`).append("div")
                                .attr("id", `tooltip${i}`)
                                .attr("class", "tooltip")
                                .style("position", "absolute")
                                .style("opacity", 0)
                                .style("background", "lightgray")
                                .style("padding", "10px")
                                .style("border-radius", "5px")
                                .style('pointer-events', 'none');

                        }

                        tooltip.transition().duration(50)
                            .style("opacity", .9)
                        .style('pointer-events', 'none');


                        var divX = chartContainerRect.left + window.scrollX;
                        var divY = chartContainerRect.top + window.scrollY;
                        tooltip.html(`${barLabel}: ${d.name}<br>Value: ${d.value?.toFixed(2)}`)

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
                            leftPosition = event.pageX - divX - tooltipWidth - 10;
                        }

                        if (topPosition + tooltipHeight + margin.bottom > chartContainerRect.height) {
                            topPosition -= tooltipHeight;
                        }

                        tooltip.style("left", `${leftPosition}px`)
                            .style("top", `${topPosition}px`)
                            .style("color", "red")
                            .style("background-color", "white");
                    }
                }

                function handleMousemove(event, d) {
                    if (mouseoverEnabled) {
                        d3.select(this)
                            .style('cursor', 'pointer');
                        const tooltip = d3.select(`#tooltip${i}`);
                        const tooltipWidth = tooltip.node().offsetWidth;
                        const tooltipHeight = tooltip.node().offsetHeight;

                        const mouseX = d3.pointer(event)[0];
                        const mouseY = d3.pointer(event)[1];

                        let leftPosition = fullScreen_enabled ? event.pageX + 30 : event.offsetX + 30;
                        let topPosition = fullScreen_enabled ? event.pageY : event.offsetY;

                        if (leftPosition + tooltipWidth > containerWidth - margin.right) {
                            leftPosition = containerWidth - tooltipWidth - margin.right - 50;
                        } else if (leftPosition < margin.left) {
                            leftPosition = margin.left + 200;
                        }

                        if (mouseY + tooltipHeight > containerHeight - margin.bottom) {
                            topPosition = mouseY - tooltipHeight - 20;
                        } else if (mouseY < margin.top + tooltipHeight) {
                            topPosition = mouseY + 20;
                        } else {
                            topPosition = mouseY - tooltipHeight / 2;
                        }

                        tooltip.html(`${barLabel}: ${d.name}<br>Value: ${d.value}`)
                            .style("left", `${leftPosition}px`)
                            .style("top", `${topPosition}px`)
                            .style('pointer-events', 'none');

                    }
                }

                function handleMouseOut(event, d) {
                    d3.select(this).attr('fill', barColor);
                    const tooltip = d3.select(`#tooltip${i}`);
                    tooltip.transition().duration(200).remove()
                    // .style("opacity", 0);
                }



                function brightenColor(color, factor) {
                    const r = parseInt(color.slice(1, 3), 16);
                    const g = parseInt(color.slice(3, 5), 16);
                    const b = parseInt(color.slice(5, 7), 16);
                    const brightenedR = Math.min(255, r + factor * 255);
                    const brightenedG = Math.min(255, g + factor * 255);
                    const brightenedB = Math.min(255, b + factor * 255);
                    return `rgb(${brightenedR.toFixed(0)}, ${brightenedG.toFixed(0)}, ${brightenedB.toFixed(0)})`;
                }
                const newWidth = Math.max(temp_barHeight + margin.bottom + margin.top, containerWidth);
                // setChrtWidth(BarWidth !== undefined ? newWidth : height);

                function circleHover(event, d) {
                    var tooltipRemove = d3.select(`#tooltip${i}`);
                    tooltipRemove.transition().duration(100).remove()


                    const parent = d3.select(this.parentNode);
                    const circle = d3.select(this);
                    const xPos = parseFloat(circle.attr('cx'));
                    const yPos = parseFloat(circle.attr('cy'));

                    // Calculate tooltip dimensions based on content
                    const valueText = `Value: ${d.value?.toFixed(2)}`;
                    const labelText = `${barLabel}: ${d.name}`;

                    // Calculate text lengths
                    const valueTextWidth = getTextWidth(valueText, "tooltip-text");
                    const labelTextWidth = getTextWidth(labelText, "tooltip-text");

                    const maxTextWidth = Math.max(valueTextWidth, labelTextWidth);

                    const tooltipPadding = 10;
                    const tooltipWidth = maxTextWidth + tooltipPadding * 2;
                    const tooltipHeight = 50;

                    let tooltipX = xPos + 10;
                    let tooltipY = yPos - 30;

                    const svgRect = parent.node().getBoundingClientRect();
                    if (tooltipX + tooltipWidth > svgRect.width) {
                        tooltipX = xPos - tooltipWidth - 10;
                    }
                    if (tooltipX < 0) {
                        tooltipX = xPos + 10;
                    }
                    if (tooltipY < 0) {
                        tooltipY = yPos + 10;
                    }
                    if (tooltipY + tooltipHeight > svgRect.height) {
                        tooltipY = yPos - tooltipHeight - 10;
                    }

                    let tooltip = parent.selectAll(".tooltip-box").data([d]);
                    tooltip.enter()
                        .append("rect")
                        .attr("class", "tooltip-box")
                        .merge(tooltip)
                        .attr("x", tooltipX)
                        .attr("y", tooltipY)
                        .attr("height", tooltipHeight)
                        .attr("width", tooltipWidth)
                        .attr("fill", "#eff2f7")
                        .attr("opacity", .9)
                        .attr("stroke-width", 1)
                        .attr("stroke", "black")
                        .attr("rx", 2) // Radius for rounded corners
                        .attr("ry", 2); // Radius for rounded corners

                    let tooltipText = parent.selectAll(".tooltip-text").data([valueText, labelText]);
                    tooltipText.enter()
                        .append("text")
                        .attr("class", "tooltip-text")
                        .merge(tooltipText)
                        .attr("x", tooltipX + tooltipWidth / 2)
                        .attr("y", (d, i) => tooltipY + 20 + i * 20)
                        .attr("text-anchor", "middle")
                        .style("fill", "red")
                        .text(d => d);
                }

                function rectMouseover(event, d) {

                    var tooltipRemove = d3.select(`#tooltip${i}`);
                    tooltipRemove.remove()

                    const parent = d3.select(this.parentNode);
                    const rectX = xScale(d.value);
                    const rectY = yScale(d.name);

                    let tooltipWidth = 120; // Initial width
                    const tooltipHeight = 50;
                    const paddingX = 10;
                    const paddingY = 5;

                    // Determine text content and adjust tooltip width dynamically
                    const textValue = `Value: ${d.value?.toFixed(2)}`;
                    const textLabel = `${barLabel}: ${d.name}`;
                    const textMaxLength = Math.max(textValue.length, textLabel.length); // Max length of text lines
                    tooltipWidth = Math.max(tooltipWidth, textMaxLength * 7 + paddingX * 2); // Adjust width based on text length

                    let tooltipX = rectX + 10;
                    let tooltipY = rectY - 20;

                    // Adjust tooltip position to prevent overflow
                    if (tooltipX + tooltipWidth > width) {
                        tooltipX = rectX - tooltipWidth - 10;
                    }
                    if (tooltipX < 0) {
                        tooltipX = rectX + 10;
                    }
                    if (tooltipY < 0) {
                        tooltipY = rectY + 20;
                    }

                    // Create tooltip group
                    const tooltipGroup = parent.append("g")
                        .attr("class", "tooltip-group")
                        .attr("transform", `translate(${tooltipX}, ${tooltipY})`);

                    // Create tooltip box with dynamic dimensions
                    const tooltipRect = tooltipGroup.append("rect")
                        .attr("class", "tooltip-box")
                        .style("opacity", 0)

                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("height", tooltipHeight)
                        .attr("width", tooltipWidth)
                        .attr("fill", "#eff2f7")
                        .style("opacity", .9)
                        .attr("stroke", "black")
                        .attr("stroke-width", 1)
                        .attr("rx", 2) // Radius for rounded corners
                        .attr("ry", 2); // Radius for rounded corners

                    // Add text elements with dynamic positioning
                    tooltipGroup.append("text")
                        .attr("class", "tooltip-text")
                        .attr("x", tooltipWidth / 2)
                        .attr("y", paddingY + 15)
                        .attr("text-anchor", "middle")
                        .text(textValue)
                        .style("fill", "red");

                    tooltipGroup.append("text")
                        .attr("class", "tooltip-text")
                        .attr("x", tooltipWidth / 2)
                        .attr("y", paddingY + 35)
                        .attr("text-anchor", "middle")
                        .text(textLabel)
                        .style("fill", "red");

                    // Transition effect for the rectangle on mouseover
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('width', 10)
                        .attr('height', 10);
                }
                function getTextWidth(text, className) {
                    const tempSvg = d3.select("body").append("svg").attr("class", className);
                    const textElement = tempSvg.append("text").text(text);
                    const width = textElement.node().getBBox().width;
                    tempSvg.remove();
                    return width;
                }
                function circleMouseout(event, d) {
                    const parent = d3.select(this.parentNode);
                    parent.selectAll(".tooltip-box").remove();
                    parent.selectAll(".tooltip-text").remove();
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('r', 5);
                }
                g.selectAll('bar')
                    .data(mod_data)
                    .enter()
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', d => yScale(d.name))
                    .attr('width', 0)
                    .attr('height', yScale.bandwidth())
                    .attr('fill', `${props.chart_color}`)
                    .on('mouseover', handleMouseOver)
                    .on('mousemove', handleMouseOver)
                    .on('mouseout', handleMouseOut)
                    .attr('width', d => xScale(d.value));
                mod_data.forEach(d => {
                    d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .attr("id", `tooltip${d.name}`)
                        .style("position", "absolute")
                        .style("opacity", 0)
                        .style("pointer-events", "none");
                });

                d3.select(`#my_dataviz${i}`).selectAll(".xContainer , .x-axis").remove()
                d3.selectAll(`.x-axis${i}`).remove()

                const mainSvg = d3.select(`#my_dataviz${i}`).select('svg');

                // Append the X-axis to the main SVG
                const xAxisGroup = mainSvg.append("g")
                    .attr("class", `x-axis${i}`)
                    .attr("transform", `translate(${margin.left}, ${containerHeight - margin.bottom + 10})`)
                    .call(d3.axisBottom(xScale).ticks())
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
                    .style("height", `${40}px`);

                const TopbackgroundRect = TopContainer.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", containerWidth)
                    .attr("height", '100%')
                    .attr("fill", "white");
                if (enable_table) {
                    showTableFn(true)
                }
                else {
                    showTableFn(false)
                }

                if (show_Grid) {
                    g.insert('g', ':first-child')
                        .attr('class', 'grid')
                        .attr('transform', `translate(0, ${marginBottom})`)
                        .call(d3.axisBottom(xScale).tickSize(height).tickFormat(''))
                        .selectAll('line')
                        .attr('stroke', 'lightgrey');
                } else {
                    g.selectAll('.grid').remove();
                }

                legendHolder()
                if (showLine) {
                    const line = d3.line()
                        .x(d => xScale(d.value))
                        .y((d, i) => {
                            return yScale(d.name) + yScale.bandwidth() / 2
                        });

                    if (curved_line) {
                        line.curve(d3.curveCatmullRom.alpha(0.5));
                    }
                    const path = g.append('path')
                        .datum(mod_data)
                        .attr('fill', 'none')
                        .attr('stroke', 'blue')
                        .attr('stroke-width', 2)
                        .attr('d', line)
                        .style('cursor', 'pointer')
                        .on("mouseover", function (event, d) {
                            d3.select(this)
                                .transition()
                                .duration(200)
                                .attr('stroke-width', 4);
                        })
                        .on("mouseout", function (event, d) {
                            d3.select(this)
                                .transition()
                                .duration(200)
                                .attr('stroke-width', 2);
                        });


                    if (path.node() !== null) {
                        const totalLength = path.node().getTotalLength();
                        path.attr('stroke-dasharray', `${totalLength} ${totalLength}`)
                            .attr('stroke-dashoffset', totalLength)
                            .transition()
                            .duration(100)
                            .ease(d3.easeLinear)
                            .attr('stroke-dashoffset', 0);
                    }


                    if (show_Square) {
                        g.selectAll('bar')
                            .data(mod_data)
                            .enter()
                            .append('rect')
                            .attr('x', d => xScale(d.value) - 5)
                            .attr('y', d => yScale(d.name) + yScale.bandwidth() / 2 - 5)
                            .attr('width', 8)
                            .attr('height', 8)
                            .attr('fill', 'blue')
                            .style('cursor', 'pointer')
                            .on("mouseover", rectMouseover)
                            .on('mousemove', rectMouseover)
                            .on("mouseout", function (event, d) {
                                d3.select(this.parentNode).selectAll(".tooltip-box").remove();
                                d3.select(this.parentNode).selectAll(".tooltip-text").remove();
                            });

                    }
                    else {
                        const circles = g.selectAll('circle')
                            .data(mod_data)
                            .enter()
                            .append('circle')
                            .attr('cx', d => xScale(d.value) + 2)
                            .attr('cy', d => yScale(d.name) + yScale.bandwidth() / 2)
                            .attr('r', 5) // Radius of the circle
                            .attr('fill', 'red')
                            .style('cursor', 'pointer')
                            .on("mouseover", circleHover)
                            .on('mousemove', circleHover)
                            .on("mouseout", function (event, d) {
                                d3.select(this.parentNode).selectAll(".tooltip-box").remove();
                                d3.select(this.parentNode).selectAll(".tooltip-text").remove();
                                d3.select(this)
                                    .transition()
                                    .duration(200)
                                    .attr('cx', d => xScale(d.value) + 2)
                                    .attr('r', 5);
                            });

                        d3.selectAll('circle').on('mouseover', circleHover).on('mouseout', function () {
                            d3.selectAll(".tooltip-box").remove();
                            d3.selectAll(".tooltip-text").remove();
                        });

                    }


                } else {
                    g.selectAll('.node').remove();
                    g.select('path').remove();
                }
                var deltaY



                // Define the initial clip path
                svg.append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", containerWidth)
                    .attr("height", containerHeight - margin.bottom);




                function zoomed(event) {
                    const newYDomain = yScale.domain().map(d => d);
                    const newYScale = yScale.domain(newYDomain);
                    g.selectAll('*').remove()

                    var tooltipRemove = d3.select(`#tooltip${i}`);
                    tooltipRemove.transition().duration(50).remove()


                    g.append('g').attr('height', height)

                    // yScale.range([containerHeight - marginBottom, marginTop].map(d => event.transform.applyY(d)));
                    yScale.range(initialYRange.map(d => event.transform.applyY(d)));


                    var clipId = `clip-${i}`

                    // Re-apply the clip path
                    g.append("clipPath")
                        .attr("id", clipId)
                        .append("rect")
                        .attr("width", containerWidth)
                        .attr("height", containerHeight - margin.bottom);




                    g.selectAll('bar')
                        .data(mod_data)
                        .enter()
                        .append('rect')
                        .attr('clip-path', `url(#${clipId})`)
                        .attr('x', 0)
                        .attr('y', d => newYScale(d.name))
                        .attr('width', 0)
                        .attr('height', yScale.bandwidth())
                        .attr('fill', `${props.chart_color}`)
                        .on('mouseover', handleMouseOver)
                        .on('mousemove', handleMouseOver)
                        .on('mouseleave', handleMouseOut)
                        .attr('width', d => xScale(d.value))

                    // const axisLabels =
                    //     g.append('g')
                    //         .call(d3.axisLeft(yScale).ticks(fullScreen_enabled ? 20 : 5).tickFormat(d => typeof d === 'string' ? d.toUpperCase() : d))
                    //         .selectAll('text')
                    //         .style("text-anchor", "end")
                    //         .attr("font-size", "11px")
                    //         .attr('fill', 'black')
                    //         .style("font-style", "normal")
                    //         .style('cursor', 'pointer')

                    // let rotationAngle = 0;
                    // axisLabels.each(function (_, i) {
                    //     const label = this;
                    //     d3.select(label).on('click', function () {
                    //         const currentRotation = rotationAngle === 0 ? -45 : 0;
                    //         const currentAnchor = rotationAngle === 0 ? 'end' : "middle";
                    //         axisLabels.attr('transform', `rotate(${currentRotation})`)
                    //             .style("text-anchor", 'end')
                    //         rotationAngle = currentRotation;
                    //     });
                    // });


                    g.append("text")
                        .attr("class", "axis-label")
                        .attr("text-anchor", "start")
                        .attr('transform', 'rotate(-90)')
                        .attr("x", -(containerHeight + margin.top) / 2) // Position horizontally based on margin left
                        .attr("y", -(margin.top - 10)) // Position vertically based on margin top
                        .text('barYLabel');


                    const charLimit = 5;
                    const axisLabels =
                        g.append('g')
                            .call(d3.axisLeft(yScale).ticks(fullScreen_enabled ? 20 : 5).tickFormat(d => typeof d === 'string' ? d.toUpperCase() : d))
                            .selectAll('text')
                            .style("text-anchor", "end")
                            .attr("font-size", "11px")
                            .attr('fill', 'black')
                            .style("font-style", "normal")
                            .style('cursor', 'pointer')
                            .text(function (d) {

                                console.log('dlimit', d)
                                if (!d || typeof d === undefined) {
                                    return "(blank)";
                                }
                                return d.length > charLimit ? `${d.substring(0, charLimit)}...` : d;
                            });

                    const tooltip = d3.select('body').append('div')
                        .attr('class', 'textHover')
                        .style('position', 'absolute')
                        .style('background', '#f9f9f9')
                        .style('padding', '5px')
                        .style('border', '1px solid #ccc')
                        .style('border-radius', '5px')
                        .style('pointer-events', 'none')
                        .style('visibility', 'hidden')
                        .style('font-size', '12px');

                    axisLabels.on('mouseover', function (event, d) {
                        const tooltipText = (!d || typeof d !== 'string') ? "(blank)" : d;
                        tooltip.style('visibility', 'visible')
                            .text(tooltipText);
                    })
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
                        // .on('mousemove', function (event) {
                        //     tooltip.style('top', `${event.pageY + 10}px`)
                        //         .style('left', `${event.pageX + 10}px`);
                        // })
                        // .on('mouseleave', function () {
                        //     tooltip.style('visibility', 'hidden');
                        // })
                        // .on('mouseout', function () {
                        //     tooltip.style('visibility', 'hidden');
                        // });





                    displayHorvalues()

                    g.append("text")
                        .attr('clip-path', `url(#${clipId})`)

                        .attr("class", "axis-label")
                        .attr("text-anchor", "start")
                        .attr('transform', 'rotate(-90)')
                        .attr("x", -(containerHeight + margin.top) / 2) // Position horizontally based on margin left
                        .attr("y", -(margin.top - 10)) // Position vertically based on margin top
                        .text('barYLabel');


                    if (show_Grid) {
                        g.insert('g', ':first-child')
                            .attr('class', 'grid')
                            .attr('transform', `translate(0, ${30})`)
                            .call(d3.axisBottom(xScale).tickSize(containerHeight - marginBottom).tickFormat(''))
                            .selectAll('line')
                            .attr('stroke', 'lightgrey');

                        g.insert('g', ':first-child')
                            .attr('class', 'grid')
                            .attr('clip-path', `url(#${clipId})`)

                            .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(''))
                            .selectAll('line')
                            .attr('stroke', 'lightgrey');


                    } else {
                        g.selectAll('.grid').remove();
                    }
                    if (showLine) {

                        const line = d3.line()
                            .x(d => xScale(d.value))
                            .y(d => yScale(d.name) + yScale.bandwidth() / 2);

                        if (curved_line) {
                            line.curve(d3.curveCatmullRom.alpha(0.5));
                        }
                        const path = g.append('path')
                            .attr('clip-path', `url(#${clipId})`)

                            .datum(mod_data)
                            .attr('fill', 'none')
                            .attr('stroke', 'blue')
                            .attr('stroke-width', 2)
                            .attr('d', line)
                            .style('cursor', 'pointer')
                            .on("mouseover", function (event, d) {
                                d3.select(this)
                                    .transition()
                                    .duration(200)
                                    .attr('stroke-width', 4);
                            })
                            .on("mouseout", function (event, d) {
                                d3.select(this)
                                    .transition()
                                    .duration(200)
                                    .attr('stroke-width', 2);
                            });
                        if (path.node() !== null) {

                            const totalLength = path.node().getTotalLength();
                            path.attr('stroke-dasharray', `${totalLength} ${totalLength}`)
                                .attr('stroke-dashoffset', totalLength)
                                .transition()
                                .duration(1000)
                                .ease(d3.easeLinear)
                                .attr('stroke-dashoffset', 0);
                        }
                        if (show_Square) {
                            g.selectAll('bar')
                                .data(mod_data)
                                .enter()
                                .append('rect')
                                .attr('clip-path', `url(#${clipId})`)

                                .attr('x', d => xScale(d.value) - 5)
                                .attr('y', d => yScale(d.name) + yScale.bandwidth() / 2 - 5)
                                .attr('width', 8)
                                .attr('height', 8)
                                .attr('fill', 'blue')
                                .style('cursor', 'pointer')
                                .on("mouseover", rectMouseover)
                                .on('mousemove', rectMouseover)
                                .on("mouseout", function (event, d) {
                                    d3.select(this.parentNode).selectAll(".tooltip-box").remove();
                                    d3.select(this.parentNode).selectAll(".tooltip-text").remove();
                                });

                        }
                        else {
                            const circles = g.selectAll('circle')
                                .data(mod_data)
                                .enter()
                                .append('circle')
                                .attr('clip-path', `url(#${clipId})`)

                                .attr('cx', d => xScale(d.value) + 2)
                                .attr('cy', d => yScale(d.name) + yScale.bandwidth() / 2)
                                .attr('r', 4)
                                .attr('fill', 'red')
                                .style('cursor', 'pointer')
                                .on("mouseover", circleHover)
                                .on('mousemove', circleHover)
                                .on("mouseout", function (event, d) {
                                    d3.select(this.parentNode).selectAll(".tooltip-box").remove();
                                    d3.select(this.parentNode).selectAll(".tooltip-text").remove();
                                    d3.select(this)
                                        .transition()
                                        .duration(200)
                                        .attr('cx', d => xScale(d.value) + 2)
                                        .attr('r', 5);
                                });


                            d3.selectAll("circle")
                                .on("mouseover", circleHover)
                                .on("mouseout", circleMouseout);

                        }
                    } else {
                        g.selectAll('.node').remove();
                        g.select('path').remove();
                    }
                }


                const initialXDomain = xScale.domain().slice();
                const initialYDomain = yScale.domain().slice();
                const initialXRange = xScale.range().slice();
                const initialYRange = yScale.range().slice();



                const handleResetButtonClick = () => {


                    xScale.domain(initialXDomain);
                    yScale.domain(initialYDomain);
                    xScale.range(initialXRange);
                    yScale.range(initialYRange);
                    svg.call(zoom.transform, d3.zoomIdentity);



                    const newYDomain = yScale.domain().map(d => d);
                    // const newYScale = yScale.domain(newYDomain).range([containerHeight - marginBottom, marginTop]);
                    const newYScale = yScale.domain(initialYDomain).range(initialYRange);
                    const newXScale = xScale.range(initialXRange);
                    g.selectAll('*').remove();
                    g.selectAll('bar')
                        .data(mod_data)
                        .enter()
                        .append('rect')
                        .attr('x', 0)
                        .attr('y', d => newYScale(d.name))
                        .attr('width', d => newXScale(d.value))
                        .attr('height', yScale.bandwidth())
                        .attr('fill', `${props.chart_color}`)
                        .on('mouseover', handleMouseOver)
                        .on('mousemove', handleMousemove)
                        .on('mouseleave', handleMouseOut)
                        .on('mouseout', handleMouseOut);
                    g.append('g')
                        .call(d3.axisLeft(newYScale).ticks(fullScreen_enabled ? 20 : 5).tickFormat(d => typeof d === 'string' ? d.toUpperCase() : d))
                        .selectAll('text')
                        .style("text-anchor", "end")
                        .attr("font-size", "11px")
                        .attr('fill', 'black')
                        .style("font-style", "normal");

                    if (showLine) {
                        const line = d3.line()
                            .x(d => xScale(d.value))
                            .y(d => yScale(d.name) + yScale.bandwidth() / 2);

                        if (curved_line) {
                            line.curve(d3.curveCatmullRom.alpha(0.5));
                        }

                        const path = g.append('path')
                            .datum(mod_data)
                            .attr('fill', 'none')
                            .attr('stroke', 'blue')
                            .attr('stroke-width', 2)
                            .attr('d', line)
                            .style('cursor', 'pointer')
                            .on("mouseover", function (event, d) {
                                d3.select(this)
                                    .transition()
                                    .duration(200)
                                    .attr('stroke-width', 4);
                            })
                            .on("mouseout", function (event, d) {
                                d3.select(this)
                                    .transition()
                                    .duration(200)
                                    .attr('stroke-width', 2);
                            });

                        if (path.node() !== null) {
                            const totalLength = path.node().getTotalLength();
                            path.attr('stroke-dasharray', `${totalLength} ${totalLength}`)
                                .attr('stroke-dashoffset', totalLength)
                                .transition()
                                .duration(1000)
                                .ease(d3.easeLinear)
                                .attr('stroke-dashoffset', 0);
                        }
                        if (show_Square) {
                            g.selectAll('bar')
                                .data(mod_data)
                                .enter()
                                .append('rect')
                                .attr('x', d => xScale(d.value) - 5)
                                .attr('y', d => yScale(d.name) + yScale.bandwidth() / 2 - 5)
                                .attr('width', 8)
                                .attr('height', 8)
                                .attr('fill', 'blue')
                                .style('cursor', 'pointer')
                                .on("mouseover", rectMouseover)
                                .on('mousemove', rectMouseover)
                                .on("mouseout", function (event, d) {
                                    d3.select(this.parentNode).selectAll(".tooltip-box").remove();
                                    d3.select(this.parentNode).selectAll(".tooltip-text").remove();
                                });

                        }
                        else {
                            const circles = g.selectAll('circle')
                                .data(mod_data)
                                .enter()
                                .append('circle')
                                .attr('cx', d => xScale(d.value) + 2)
                                .attr('cy', d => yScale(d.name) + yScale.bandwidth() / 2)
                                .attr('r', 4)
                                .attr('fill', 'red')
                                .style('cursor', 'pointer')
                                .on("mouseover", circleHover)
                                .on('mousemove', circleHover)
                                .on("mouseout", function (event, d) {
                                    d3.select(this.parentNode).selectAll(".tooltip-box").remove();
                                    d3.select(this.parentNode).selectAll(".tooltip-text").remove();
                                    d3.select(this)
                                        .transition()
                                        .duration(200)
                                        .attr('cx', d => xScale(d.value) + 2)
                                        .attr('r', 5);
                                });


                        }


                    } else {
                        g.selectAll('.node').remove();
                        g.select('path').remove();
                    }

                    g.append("text")
                        .attr("class", "axis-label")
                        .attr("text-anchor", "start")
                        .attr('transform', 'rotate(-90)')
                        .attr("x", -(containerHeight + margin.top) / 2) // Position horizontally based on margin left
                        .attr("y", -(margin.top - 10)) // Position vertically based on margin top
                        .text('barYLabel');

                    if (show_Grid) {
                        g.insert('g', ':first-child')
                            .attr('class', 'grid')
                            .attr('transform', `translate(0, ${70})`)
                            .call(d3.axisBottom(xScale).tickSize(height).tickFormat(''))
                            .selectAll('line')
                            .attr('stroke', 'red');

                        g.insert('g', ':first-child')
                            .attr('class', 'grid')
                            .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(''))
                            .selectAll('line')
                            .attr('stroke', 'lightgrey');
                    } else {
                        g.selectAll('.grid').remove();
                    }
                    displayHorvalues()

                };

                if (i === reportSlice.resetCharts.i) {
                    handleResetButtonClick();
                    dispatch(setResetCharts([]));
                }

                // document.getElementById(`togglereset-${i}`).addEventListener('click', function (event) {
                //     handleResetButtonClick();
                // });
            }

        }
        else{

            // // Clear the container
            // d3.select(`#my_dataviz${i}`).html("");

            // // Add a centered "No data available" message
            // d3.select(`#my_dataviz${i}`)
            //     .style("position", "relative")
            //     .style("width", `${containerWidth}px`)
            //     .style("height", `${containerHeight}px`)
            //     .style("display", "flex")
            //     .style("justify-content", "center")
            //     .style("align-items", "center")
            //     .style("border", "1px solid #ddd") // Optional: Add a border
            //     .append("div")
            //     .style("font-size", "16px")
            //     .style("color", "grey")
            //     .text("No data available");
        }
     

    },
        // [props , data]
        [containerWidth, BarWidth, containerHeight, data, barColor, mouseoverEnabled, showLine, enabledTable, showGridEnabled, show_Grid, sortData, showline, showValues, fullScreen_enabled, svgHeight, curved_line, show_Square, enable_table, temp_containerWidth, temp_containerHeight, text_color_arr, YLabel, chart_data, reportSlice[i], reportSlice.resetCharts.i === i ]
    );



    function legendHolder() {
        d3.selectAll(`.legends1${i}`).remove()
        d3.selectAll(`.legends${i}`).selectAll('div').remove()
        const legendWidth = 50;
        const legendRectSize = 15;
        const legendOffset = 20;
        const legendContainer = d3.selectAll(`#legend${i}`)
            .attr("class", `legends${i}`)
            .style("boxShadow", "none");
        legendContainer.append("div")
            .attr("class", "legend-rect")
            .style("width", `${legendRectSize}px`)
            .style("height", `${legendRectSize}px`)
            .style("background-color", barColor)
            .style("margin-right", "7px");

        legendContainer.append("div")
            .attr("class", "legend-text")
            .style("lineHeight", `${legendRectSize}px`)
            // .text(props.YLabel !== undefined  || props.YLabel !== '' ? props.YLabel : "Y-Axis");
            .text(props.YLabel && props.YLabel.trim() !== '' ? props.YLabel.trim() : "Y-Axis");

    }
    const handleMenuClick = (e) => {
        setShowOptions(!showOptions);
    };
    const handleSortIconClick = (e) => {
        setshowsortoption(!sortshowOptions)
    };
    const handleSortAscending = () => {
        var chart_id = i;
        dispatch(barSorting({ data, chart_id }));

    };
    const handleSortDescending = () => {
        var chart_id = i;
        dispatch(barDescending({ data, chart_id }));

    };
    const handleSortDefault = () => {
        dispatch(sortBar({ data: chart_data, chart_id: i }));
        setsortData([...chart_data]);
    };
    const showTableFn = async (val1) => {
        var val = true

        var updtData

        console.log('data show_table_fn:>> ', data ,  props.chart_data);



        if( reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined && dataRetreived.data?.[0]?.[calc]  ){
            updtData = dataRetreived.data?.[0]?.[calc]
        }
        else{
            updtData =  props.chart_data
        }



        if(reportSlice.layoutInfo[props.indexes].filtered_data){
            updtData =  reportSlice.layoutInfo[props.indexes].filtered_data
        }


        


        if (val1) {
            setEnabledTable(true)
            tabulate(updtData, tableColumns)
        }
        else {
            d3.select(`#tableContainer${i}.table_body`).remove();
            d3.selectAll(`#tableContainer${i}`).selectAll("table").remove();
        }

    }
    const tabulate = async (data, columns, y_axis_name) => {
        y_axis_name = y_axis_name ? y_axis_name : yLabelName;
        const header = [xLabel, y_axis_name];
        var data_exist;
        if (data !== undefined) {
            data_exist = data;
        } else {
            data_exist = chart;
        }
        var tableContainer = document.getElementById(`tableContainer${i}`);
        if (tableContainer !== null) {
            tableContainer.innerHTML = "";
        }
        var table = d3.select(`#tableContainer${i}`)
            .attr("class", "table-responsive")
            .append("table")
            .style("width", `${fullScreen_enabled ? temp_containerWidth : containerWidth}px`)
        var thead = table.append("thead");
        var tbody = table.append("tbody");
        d3.select(tableContainer)
            .attr('class', 'table_body')
            .style("width", `${fullScreen_enabled ? temp_containerWidth : containerWidth}px`)
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
                return tableColumns.map(function (column) {
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
    return (
        <>
            <div id={`tooltip${i}`} style={{ position: 'absolute', opacity: 0, background: 'lightgray', padding: '10px', borderRadius: '5px' }}></div>

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
                                onMouseLeave={() => { setShowOptions(false); setshowsortoption(false); }}
                            >
                                <svg ref={chartRef} width={(fullScreen_enabled ? temp_containerWidth : containerWidth)} height={(fullScreen_enabled ? temp_containerHeight : containerHeight)} >
                                    <g ></g>
                                </svg>

                            </div>
                            {
                                show_Legend ?
                                    <div id={`legend${i}`} style={{ position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'centre', marginLeft: containerWidth / 2, marginTop: enable_table ? (fullScreen_enabled ? '-290px' : '-230px') : '-40px', boxShadow: 'none' }}></div>
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
                {(props.show_table && chartsLoad) ? (
                    <>
                        <div style={{
                            position: 'absolute',
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
        </>
    );
};

export default HorizontalBarChart;