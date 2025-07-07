import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../LayoutInfo.css'
import * as d3 from 'd3';
import { Spinner } from 'reactstrap';
import { toggleProcessingState, retrivePieChartvalue, updateLayoutInfo, setRangeStatus } from '../../../../Slice/reportd3/reportslice';
import { set } from 'lodash';



const PieChart = (props) => {
    const dispatch = useDispatch();


    var containerWidth = props.containerWidth
    var containerHeight = props.containerHeight
    var chart_data = props.chart_data
    var i = props.id
    var mouseovered = props.mouseovered
    var enable_table = props.show_table
    var svgHeight = props.chart_height
    var show_bar_values = props.show_bar_values
    var temp_containerWidth = props.temp_containerWidth
    var temp_containerHeight = props.temp_containerHeight
    var fullScreen_enabled = props.show_Full_Screen_toggle
    var dataRetreived = props.itemInfo

    var showlegend = props.show_Legend
    const [showOptions, setShowOptions] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pieColor, setpieColor] = useState(chart_data.length > 0 ? d3.schemeCategory10 : ['#d3d3d3', '#e0e0e0'])
    const [mouseoverEnabled, setMouseoverEnabled] = useState(mouseovered)
    const [enabledTable, setEnabledTable] = useState(enable_table)
    const [sortShowOptions, setSortShowOptions] = useState(false);
    const [cornerRadius, setCornerRadius] = useState(0);
    const [innerRadius, setInnerRadius] = useState(0);
    const [padAngle, setPadAngle] = useState(0);
    const [chartSize, setChartSize] = useState(props.containerHeight);
    const [showvalues, setshowvalues] = useState(show_bar_values);
    const [chartsLoad, setChartsLoad] = useState(false)
    const [chart_height, setchart_height] = useState(svgHeight);
    const reportSlice = useSelector(state => state.reportSliceReducer)
    const rangeStatus = useSelector(state => state.reportSliceReducer.rangeStatus);
    const ProcessedID = reportSlice.processingData[props.id]

    const [processing, setProcessing] = useState(false)
    const [ lengendRect , setLegendrect] = useState( showlegend )

    const [legendheight , setLegendheight] = useState(props.containerHeight / 2)

    var width;
    var height;

    // const dbInfo = {
    //     encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@65.0.69.57:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
    //     db_name: 'hotel_surguru-beta',
    // }



    const AuthSlice = useSelector(state => state.auth);
    const dbInfo = AuthSlice.db_info
    
    console.log("PIE CHART CALLED!!" , ProcessedID , dataRetreived);
    useEffect(() => {

        if (ProcessedID === undefined) {

            if (dataRetreived?.x_axis_key !== undefined && dataRetreived.data === undefined  || dataRetreived.changed) {
                setProcessing(true)
                setChartsLoad(false)
                LoadedData(dataRetreived, '1')
            }
            else if (dataRetreived.filtered_data !== undefined) {
                setData(dataRetreived.filtered_data)
                setChartsLoad(true)

            }
            else {
                console.log("Default Pie Loaded");
                setData(dataRetreived.data)
                setChartsLoad(true)
            }
        }

        if (ProcessedID) {
            console.log('98 Already Retyrteived Data ', dataRetreived)
            if (dataRetreived.filtered_data !== undefined) {
                setData(dataRetreived.filtered_data)
                setChartsLoad(true)
            }
            else if(reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined){
                setData(dataRetreived.data)
                setChartsLoad(true) 
            }
            else{
                setData(dataRetreived.data)
                setChartsLoad(true) 
            }
        }

        setChartSize(dataRetreived.temp_containerHeight !== undefined ? dataRetreived.temp_containerHeight :  props.containerHeight- margin.top - margin.bottom - (enable_table ? 200 : 0) )
        var i =  props.i
        // dispatch(setRangeStatus({ value: temp_containerHeight, ID:i, fieldName:'ChartSize' }));
        setLegendrect(showlegend)

    }, [props, dataRetreived])

    const LoadedData = async (dataRetreived, mode) => {
        console.log('LoadedData  Pie chart:>> ' , dataRetreived);
        if (dataRetreived.selected_cln_name !== undefined) {

            // const data = {
            //     selected_cln_name: dataRetreived.selected_cln_name,
            //     selected_primary_key: {},
            //     selected_primary_value: {},
            //     fieldName: dataRetreived.x_axis_key,
            //     encrypted_db_url: dbInfo.encrypted_db_url,
            //     db_name: dbInfo.db_name,
            // }


            const data ={
                collection_name: dataRetreived?.selected_cln_name[0],
                encrypted_db_url: dbInfo.encrypted_db_url,
                db_name: dbInfo.db_name,
                // primary_key: [],
                fieldName: dataRetreived.x_axis_key.name,
               
                // combinedUniqueNames: combinedUniqueNames,
            //     startDate: reportSlice.startDate,
            //     endDate: reportSlice.endDate,
            //   dateFields: AuthSlice?.dateRangeField


            }



            var pie_data = await dispatch(retrivePieChartvalue(data, reportSlice.layoutInfo, props.requestInfo))
            console.log(' retrivePieChartvalue pie_data :>> ', pie_data);
            // dispatch(toggleProcessingState(dataRetreived.i))
            if (pie_data !== undefined) {
                var updating_layObj = { ...dataRetreived };

                updating_layObj.changed = false;
                updating_layObj.data = pie_data;
                updating_layObj.configured = true

                var layoutArr = [...reportSlice.layoutInfo]

                layoutArr[props.indexes] = {
                    ...layoutArr[props.indexes],
                    ...updating_layObj
                };
                setData(pie_data)
                setChartsLoad(true)
                dispatch(
                    updateLayoutInfo({
                        index: props.indexes,
                        updatedObject: updating_layObj,
                    })
                )
            }
            else{
                var updating_layObj = { ...dataRetreived };

                updating_layObj.changed = false;
                updating_layObj.data = [];
                updating_layObj.configured = true 
    
                var layoutArr = [...reportSlice.layoutInfo]
    
                layoutArr[props.indexes] = {
                    ...layoutArr[props.indexes],
                    ...updating_layObj
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
    };

    useEffect(() => {
        if (chart_data !== undefined) {
            setData(chart_data)
            setpieColor(d3.schemeCategory10)
            setMouseoverEnabled(mouseovered)
            setEnabledTable(enable_table)
            setshowvalues(show_bar_values)
            setchart_height(svgHeight)
            setLegendrect(showlegend)
            if (enable_table) {
                showTableFn(true)
            }
            else {
                showTableFn(false)
            }
        }
    }, [chart_data, pieColor, mouseovered, enable_table, show_bar_values, temp_containerWidth, fullScreen_enabled, temp_containerHeight, svgHeight])




    if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined ) {
        console.log('data 278', data, dataRetreived);
        if (dataRetreived.data !== undefined) {
            var datakeys = Object.keys(dataRetreived.data !== undefined ? dataRetreived.data[0] : dataRetreived.data[0]).filter(key => key !== 'year' && key !== "_id");
            console.log('datakeys 280:>> ', datakeys);
        }
    }
    else {
        console.log('data 284', props.chart_data);
        var datakeys = Object.keys(props.chart_data !== undefined  && props.chart_data.length > 0   && props.chart_data?.[0] ).filter(key => key !== 'year' && key !== "_id");
        console.log('datakeys 293:>> ', datakeys);
    }



    // if (data.length !== 0) {
    //     var datakeys = Object.keys(data[0]).filter(key => key !== 'year' && key !== "_id");
    //     var datakeys_name = Object.keys(data[0]).filter(key => key === 'year' && key !== "_id");
    // }
    const margin = { top: 35, right: 30, bottom: 10, left: 40 };



    useEffect(() => {


        var mod_data;
        console.log('datakeys {Pie} :>> ', datakeys);

        if (datakeys !== undefined && datakeys.length > 0) {

            if (reportSlice.layoutInfo[props.indexes]?.configured && reportSlice.layoutInfo[props.indexes].data) {
                mod_data = reportSlice.layoutInfo[props.indexes].data;
            }
            else {
                mod_data = chart_data
            }



            if (reportSlice.layoutInfo[props.indexes].filtered_data) {
                mod_data = reportSlice.layoutInfo[props.indexes].filtered_data
            }



            console.log('mod_data PIes :>> ', mod_data);


            if (mod_data !== undefined) {

                if (svgHeight !== undefined && svgHeight !== '') {
                    containerHeight = containerHeight - 200
                }
                else {
                    containerHeight = containerHeight
                }
                if (fullScreen_enabled !== undefined && fullScreen_enabled !== false) {
                    width = temp_containerWidth - margin.left - margin.right;
                    height = temp_containerHeight + margin.top + margin.bottom - (enabledTable ? 200 : 0)
                    containerWidth = width
                    containerHeight = height
                }
                else {
                    width = containerWidth - margin.left - margin.right;
                    height = containerHeight - margin.top - margin.bottom - (enabledTable ? 200 : 0)
                }
                console.log("chartSize", chartSize , containerHeight)
                const radius = Math.min(chartSize, chartSize) / 2.5;
                const svg = d3.select(`#my_dataviz${i}`)
                    .attr('width', containerWidth)
                    .attr('height', containerHeight);

                const g = svg.select('g');
                g.selectAll('*').remove();
                g.attr('transform', `translate(${(fullScreen_enabled ? temp_containerWidth : containerWidth) / 2}, ${containerHeight / 2})`);

                var color = d3.scaleOrdinal()
                    .range(pieColor);

                const pie = d3.pie()
                    .value(d => d.count);
                const arcs = pie(mod_data);
                const arc = d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius);

                const arcLabel = d3.arc()
                    .innerRadius(radius * 0.7)
                    .outerRadius(radius * 0.7);



                g.selectAll('path')
                    .data(arcs)
                    .enter()
                    .append('path')
                    .attr('fill', (d, i) => color(i))
                    .transition()
                    .duration(1000)
                    .attrTween('d', function (d) {
                        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                        return function (t) {
                            return arc(interpolate(t));
                        }
                    })
                    .on('end', function () {
                        d3.select(this)
                            .on('mouseover', handleMouseOverAnimate)
                            .on('mousemove', handleMouseMove)
                            .on('mouseout', handleMouseOutAnimate)
                            .on('mouseleave', handleMouseLeaveAnimate);
                    })

                function midAngle(d) {
                    return d.startAngle + (d.endAngle - d.startAngle) / 2;
                }
                function handleMouseOverAnimate(event, d) {
                    if (mouseoverEnabled) {
                        d3.select(this)
                            .style('filter', 'url(#glow)')
                            .transition()
                            .duration(200)
                            .attr('transform', `translate(${0.1 * radius * Math.cos(event.startAngle + (event.endAngle - event.startAngle) / 2)}, ${0.1 * radius * Math.sin(event.startAngle + (event.endAngle - event.startAngle) / 2)})`)
                            .style('opacity', 1)

                        d3.select(this)
                            .transition()
                            .duration(100)
                            .attr('transform', `scale(1.1)`)
                        const tooltip = d3.selectAll(`#tooltip${i}`);
                        tooltip.transition().duration(100).style('opacity', 0.9);
                        const svgContainer = d3.selectAll(`#my_dataviz${i}`).selectAll('g');
                        const [x1, y1] = d3.pointer(event, svgContainer.node());
                        const xPosition = x1 + (fullScreen_enabled ? temp_containerWidth : containerWidth) / 2 + 30;
                        const yPosition = y1 + containerHeight / 2
                        tooltip.html(`<strong>${d.data.name}</strong>: ${d.data.count}`)
                            .style('transform', `translate(${xPosition}px, ${yPosition}px)`)
                            .style("color", "red")
                            .style("background-color", "white")
                    }
                    else {
                    }
                }

                function handleMouseMove(event) {
                    const tooltip = d3.selectAll(`#tooltip${i}`);
                    const svgContainer = d3.selectAll(`#my_dataviz${i}`).selectAll('g');
                    const [x1, y1] = d3.pointer(event, svgContainer.node());
                    const xPosition = x1 + (fullScreen_enabled ? temp_containerWidth : containerWidth) / 2 + 30;
                    const yPosition = y1 + containerHeight / 2;
                    tooltip.style('transform', `translate(${xPosition}px, ${yPosition}px)`);
                }

                async function handleMouseOutAnimate(event, d) {
                    d3.select(this).style('opacity', 1);
                    d3.selectAll(`#tooltip${i}`).style('opacity', 0);
                    d3.select(this)
                        .style('filter', null)
                        .transition()
                        .duration(200)
                        .attr('transform', 'translate(0,0)')
                }
                const handleMouseLeaveAnimate = () => {
                    const tooltip = d3.select(`#tooltip${i}`);
                    tooltip.transition().duration(100).style('opacity', 0);
                    d3.selectAll(`#tooltip${i}`).style('opacity', 0);
                }
                if (enable_table) {
                    showTableFn(true)
                }
                else {
                    showTableFn(false)
                }
                const updateChart = () => {
                    const arc = d3.arc()
                        .innerRadius(innerRadius)
                        .outerRadius(Math.min(chartSize, chartSize) / 2.5)
                        .cornerRadius(cornerRadius);
                    const arcLabel = d3.arc()
                        .innerRadius(radius * 0.7)
                        .outerRadius(Math.min(chartSize, chartSize) / 2.5);
                    const pie = d3.pie()
                        .value(d => d.count)
                        .padAngle(padAngle);
                    const arcs = pie(mod_data);

                    g.selectAll('polyline , text,.legend ').remove()
                    g.selectAll('text')
                        .data(arcs)
                        .enter()
                        .append('text')
                        .attr('transform', d => {
                            const pos = arcLabel.centroid(d);
                            pos[0] = radius * 1.3 * (midAngle(d) < Math.PI ? 1 : -1);
                            return `translate(${pos})`;
                        })
                        .attr('dy', '0.35em')
                        .style('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end')
                        .style("text-transform", 'capitalize')
                        .text(d => showvalues ? d.data.name : '')
                        .style("opacity", 0)
                        .transition()
                        .duration(1000)
                        .style("opacity", 1)
                        .attrTween('transform', function (d) {
                            const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                            return function (t) {
                                const pos = arcLabel.centroid(interpolate(t));
                                pos[0] = radius * 1.1 * (midAngle(interpolate(t)) < Math.PI ? 1 : -1);
                                return `translate(${pos})`;
                            };
                        });
                    showvalues && g.selectAll('polyline')
                        .data(arcs)
                        .enter()
                        .append('polyline')
                        .attr('points', d => {
                            const posA = arc.centroid(d);
                            const posB = arcLabel.centroid(d);
                            const posC = arcLabel.centroid(d);
                            posC[0] = radius * 1 * (midAngle(d) < Math.PI ? 1 : -1);
                            return [posA, posB, posC];
                        })
                        .style('fill', 'none')
                        .style('stroke', 'lightgrey')
                        .style('stroke-width', '1.5px')

                    function midAngle(d) {
                        return d.startAngle + (d.endAngle - d.startAngle) / 2;
                    }

                    svg.selectAll('path')
                        .data(arcs)
                        .transition()
                        .duration(1000)
                        .attrTween('d', function (d) {
                            const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                            return function (t) {
                                return arc(interpolate(t));
                            }
                        })
                        .on('end', function () {
                            d3.select(this)
                                .on('mouseover', handleMouseOverAnimate)
                                .on('mousemove', handleMouseMove)
                                .on('mouseout', handleMouseOutAnimate)
                                .on('mouseleave', handleMouseLeaveAnimate);
                        });

                
                    console.log('lengendRect :>> ', lengendRect);

                    if (lengendRect) {

                        // const legend = g.selectAll('.legend')
                        //     .data(mod_data)
                        //     .enter().append('g')
                        //     .attr('class', 'legend')
                        //     .attr('transform', (d, i) => {
                        //         if (containerWidth < 700) {
                        //             const legendWidth = 100;
                        //             const legendSpacing = 10;
                        //             const totalWidth = data.length * (legendWidth + legendSpacing);
                        //             const xOffset = (containerWidth - totalWidth) / 2;
                        //             return `translate(${xOffset + i * (legendWidth + legendSpacing)}, ${chartSize - 50})`;
                        //         } else {
                        //             return `translate(-${containerWidth / 2 - margin.left - 20}, ${i * 20 - 100})`;
                        //         }
                        //     });


                        // legend.append('rect')
                        //     .attr('width', 12)
                        //     .attr('height', 12)
                        //     .style('fill', (d, i) => color(i));

                        // legend.append('text')
                        //     .attr('x', 24)
                        //     .attr('y', 9)
                        //     .attr('dy', '.35em')
                        //     .style('text-anchor', 'start')
                        //     .text(d => d.name);






                        // Define a fixed max height
                        const maxLegendHeight = containerHeight / 2;

                        // Create a scrollable legend container
                        const legendContainer = d3.select(`#legend-container${i}`)
                            .style('max-height', `${maxLegendHeight}px`) // Set max-height
                            .style('overflow-y', 'auto')
                            .style('position', 'absolute')
                            .style('top', containerHeight / 4+ 'px')
                            .style('left', margin.left + 'px')
                            .style('width', containerWidth / 4 + 'px')
                            .style('background-color', '#f9f9f9') // Light background for contrast
                            .style('border', '1px solid #ccc') // Soft border
                            .style('border-radius', '8px') // Rounded corners
                            .style('box-shadow', '2px 2px 10px rgba(0, 0, 0, 0.1)') // Subtle shadow
                            .style('padding', '10px'); // Padding for spacing

                        // Remove previous legends to avoid duplication
                        legendContainer.selectAll('*').remove();

                        const legend = legendContainer.selectAll('.legend')
                            .data(mod_data)
                            .enter().append('div')
                            .attr('class', 'legend')
                            .style('display', 'flex')
                            .style('align-items', 'center')
                            .style('margin-bottom', '5px');

                        legend.append('div')
                            .style('width', '12px')
                            .style('height', '12px')
                            .style('margin-right', '5px')
                            .style('background-color', (d, i) => color(i));

                        legend.append('span')
                            .text(d => d.name)
                            .style('font-size', '12px')
                            .style('text-transform', 'capitalize');




//                         // Create a scrollable legend container
// const legendContainer = d3.select(`#legend-container${i}`)
// .style('max-height', legendheight) // Adjust this based on your requirement
// .style('overflow-y', 'auto');

// // Remove previous legends to avoid duplication
// legendContainer.selectAll('*').remove();

// const legend = legendContainer.selectAll('.legend')
// .data(mod_data)
// .enter().append('div')
// .attr('class', 'legend')
// .style('display', 'flex')
// .style('align-items', 'center')
// .style('margin-bottom', '5px');

// legend.append('div')
// .style('width', '12px')
// // .style('height', '12px')
// .style('margin-right', '5px')
// .style('background-color', (d, i) => color(i));

// legend.append('span')
// .text(d => d.name)
// .style('font-size', '12px')
// .style('text-transform', 'capitalize');



                    } else {
                        g.selectAll('.legend').remove();
                    }
                        
                };
                updateChart();

            }

        }
        else{

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
        }
     

    },
    // [containerWidth, containerHeight, data, mouseoverEnabled, enabledTable, showvalues, temp_containerWidth, fullScreen_enabled, temp_containerHeight, enable_table, svgHeight, cornerRadius, innerRadius, padAngle, chartSize, rangeStatus[i]]);
    [containerWidth, containerHeight, chartsLoad , data, mouseoverEnabled, enabledTable, showvalues, temp_containerWidth, fullScreen_enabled, temp_containerHeight,  cornerRadius, innerRadius, padAngle, chartSize,lengendRect,legendheight, rangeStatus[i]]);




    const handleRadiusChange = (fieldName, value) => {
        
        if (fieldName === 'cornerRadius') {
            setCornerRadius(value);
        } else if (fieldName === 'innerRadius') {
            setInnerRadius(value);
        } else if (fieldName === 'padAngle') {
            setPadAngle(value);
        } else if (fieldName === 'ChartSize') {
            setChartSize(value);
        }
    };
    
    useEffect(() => {
        if (rangeStatus && rangeStatus[i]) {
            const currentStatus = rangeStatus[i];
            Object.keys(currentStatus).forEach((fieldName) => {
                const { value } = currentStatus[fieldName]; 
                handleRadiusChange(fieldName, value);
            });
        }
    }, [rangeStatus, i]);



    const showTableFn = async (val) => {
        var mod_data
        if (data?.length > 0) {
            mod_data = data
        } else {
            mod_data = [{ count: 1, name: 'Placeholder1' }, { count: 1, name: 'Placeholder2' }];
        }
        const fieldNames = Object.keys(mod_data[0]);
        if (val) {
            await tabulate(data, fieldNames)
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
            .style("width", `-webkit-fill-available`)
            // .style("max-width", `-webkit-fill-available`)
        var thead = table.append("thead");
        var tbody = table.append("tbody");
        d3.select(tableContainer)
            .attr('class', 'table_body')
            .style("width", `-webkit-fill-available`)
            .style("overflow-y", "scroll")
            .style("overflow-x", "hidden");
        thead.append("tr")
            .selectAll("th")
            .data(header)
            .enter()
            .append("th")
            .text(function (column) { return column.toUpperCase(); })
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
            .html(function (d) {
                return d.column === "percentage" ? d.value.toFixed(2) + "%" : d.value;
            })
            .attr("style", "text-align: center")
            .style('color', 'black')
        return table;
    }

    return (
        <div>
            <div id={`tooltip${i}`} style={{ position: 'absolute', opacity: 0, background: 'lightgray', padding: '10px', borderRadius: '5px' }}></div>

            {
                chartsLoad ?

                    <div id={`my_dataviz${i}`} style={{ textAlign: fullScreen_enabled ? 'center' :'end'  }}  width={(fullScreen_enabled !== undefined && fullScreen_enabled !== false) ? temp_containerWidth : containerWidth} onMouseLeave={() => { setShowOptions(false); setSortShowOptions(false); }} >
                        <svg width={(fullScreen_enabled !== undefined && fullScreen_enabled !== false) ? temp_containerWidth : containerWidth} height={(fullScreen_enabled) ? temp_containerHeight : containerHeight} >
                            <g></g>
                        </svg>
                        {
                            showlegend &&
                            <div
                            id={`legend-container${i}`}
                            style={{
                                width: '160px',
                                overflowY: 'auto',
                                // maxHeight: '260px',  // Max height of 260px
                                position: 'absolute',
                                top: '200px',
                                left: '90px'
                            }}
                        ></div>
                        }
                     
                        {/* <div id={`legend-container${i}`} style={{width: '150px', overflowY: 'auto' ,  height: legendheight , position : 'absolute' , left:'90px', top:'200px'}}></div> */}
                    </div>
                    :
                    <>
                        {/* <Spinner
                            color="info"
                            className="chartLoader"
                            style={{
                                position: "fixed",
                                top: "50%",
                                left: "50%",
                            }}
                        >
                            Loading...
                        </Spinner> */}
                       <div className="chart-skeleton" style={{ width : containerWidth , height : containerHeight }}>
                {/* <div className="skeleton-title"></div> */}
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
            </div>
                    </>
            }
            {isLoading &&
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>}
            {enabledTable ? (
                <>
                    <div style={{
                        position: 'absolute',
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
export default PieChart





// commented on 3 feb 25
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';

// import * as d3 from 'd3';
// import { Spinner } from 'reactstrap';
// import { toggleProcessingState, retrivePieChartvalue, updateLayoutInfo } from '../../../../Slice/reportd3/reportslice';



// const PieChart = (props) => {
//     const dispatch = useDispatch();


//     var containerWidth = props.containerWidth
//     var containerHeight = props.containerHeight
//     var chart_data = props.chart_data
//     var i = props.id
//     var mouseovered = props.mouseovered
//     var enable_table = props.show_table
//     var svgHeight = props.chart_height
//     var show_bar_values = props.show_bar_values
//     var temp_containerWidth = props.temp_containerWidth
//     var temp_containerHeight = props.temp_containerHeight
//     var fullScreen_enabled = props.show_Full_Screen_toggle
//     var dataRetreived = props.itemInfo

//     const [showOptions, setShowOptions] = useState(false)
//     const [isLoading, setIsLoading] = useState(false);
//     const [data, setData] = useState([]);
//     const [pieColor, setpieColor] = useState(chart_data.length > 0 ? d3.schemeCategory10 : ['#d3d3d3', '#e0e0e0'])
//     const [mouseoverEnabled, setMouseoverEnabled] = useState(mouseovered)
//     const [enabledTable, setEnabledTable] = useState(enable_table)
//     const [sortShowOptions, setSortShowOptions] = useState(false);
//     const [cornerRadius, setCornerRadius] = useState(0);
//     const [innerRadius, setInnerRadius] = useState(0);
//     const [padAngle, setPadAngle] = useState(0);
//     const [chartSize, setChartSize] = useState(props.containerHeight);
//     const [showvalues, setshowvalues] = useState(show_bar_values);
//     const [chartsLoad, setChartsLoad] = useState(false)
//     const [chart_height, setchart_height] = useState(svgHeight);
//     const reportSlice = useSelector(state => state.reportSliceReducer)
//     const rangeStatus = useSelector(state => state.reportSliceReducer.rangeStatus);
//     const ProcessedID = reportSlice.processingData[props.id]

//     const [processing, setProcessing] = useState(false)


//     var width;
//     var height;

//     // const dbInfo = {
//     //     encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@65.0.69.57:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
//     //     db_name: 'hotel_surguru-beta',
//     // }



//     const AuthSlice = useSelector(state => state.auth);
//     const dbInfo = AuthSlice.db_info
    
//     console.log("PIE CHART CALLED!!" , ProcessedID , dataRetreived);
//     useEffect(() => {

//         if (ProcessedID === undefined) {

//             if (dataRetreived?.x_axis_key !== undefined && dataRetreived.data === undefined  || dataRetreived.changed) {
//                 setProcessing(true)
//                 setChartsLoad(false)
//                 LoadedData(dataRetreived, '1')
//             }
//             else if (dataRetreived.filtered_data !== undefined) {
//                 setData(dataRetreived.filtered_data)
//                 setChartsLoad(true)

//             }
//             else {
//                 console.log("Default Pie Loaded");
//                 setData(dataRetreived.data)
//                 setChartsLoad(true)
//             }
//         }

//         if (ProcessedID) {
//             console.log('98 Already Retyrteived Data ', dataRetreived)
//             if (dataRetreived.filtered_data !== undefined) {
//                 setData(dataRetreived.filtered_data)
//                 setChartsLoad(true)
//             }
//             else if(reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined){
//                 setData(dataRetreived.data)
//                 setChartsLoad(true) 
//             }
//             else{
//                 setData(dataRetreived.data)
//                 setChartsLoad(true) 
//             }
//         }

//     }, [props, dataRetreived])

//     const LoadedData = async (dataRetreived, mode) => {
//         console.log('LoadedData :>> ');
//         if (dataRetreived.selected_cln_name !== undefined) {

//             // const data = {
//             //     selected_cln_name: dataRetreived.selected_cln_name,
//             //     selected_primary_key: {},
//             //     selected_primary_value: {},
//             //     fieldName: dataRetreived.x_axis_key,
//             //     encrypted_db_url: dbInfo.encrypted_db_url,
//             //     db_name: dbInfo.db_name,
//             // }


//             const data ={
//                 collection_name: dataRetreived?.selected_cln_name?.cln_name,
//                 encrypted_db_url: dbInfo.encrypted_db_url,
//                 db_name: dbInfo.db_name,
//                 // primary_key: [],
//                 fieldName: dataRetreived.x_axis_key.name,
               
//                 // combinedUniqueNames: combinedUniqueNames,
//                 startDate: reportSlice.startDate,
//                 endDate: reportSlice.endDate,
//               dateFields: AuthSlice?.dateRangeField


//             }



//             var pie_data = await dispatch(retrivePieChartvalue(data, reportSlice.layoutInfo, props.requestInfo))
//             console.log(' retrivePieChartvalue pie_data :>> ', pie_data);
//             // dispatch(toggleProcessingState(dataRetreived.i))
//             if (pie_data !== undefined) {
//                 var updating_layObj = { ...dataRetreived };

//                 updating_layObj.changed = false;
//                 updating_layObj.data = pie_data;
//                 updating_layObj.configured = true

//                 var layoutArr = [...reportSlice.layoutInfo]

//                 layoutArr[props.indexes] = {
//                     ...layoutArr[props.indexes],
//                     ...updating_layObj
//                 };
//                 setData(pie_data)
//                 setChartsLoad(true)
//                 dispatch(
//                     updateLayoutInfo({
//                         index: props.indexes,
//                         updatedObject: updating_layObj,
//                     })
//                 )
//             }
//             else{
//                 var updating_layObj = { ...dataRetreived };

//                 updating_layObj.changed = false;
//                 updating_layObj.data = [];
//                 updating_layObj.configured = true 
    
//                 var layoutArr = [...reportSlice.layoutInfo]
    
//                 layoutArr[props.indexes] = {
//                     ...layoutArr[props.indexes],
//                     ...updating_layObj
//                 };
//                 setData([])
//                 setChartsLoad(true)
//                 dispatch(
//                     updateLayoutInfo({
//                         index: props.indexes,
//                         updatedObject: updating_layObj,
//                     })
//                 )
//             }

//         }
//     };

//     useEffect(() => {
//         if (chart_data !== undefined) {
//             setData(chart_data)
//             setpieColor(d3.schemeCategory10)
//             setMouseoverEnabled(mouseovered)
//             setEnabledTable(enable_table)
//             setshowvalues(show_bar_values)
//             setchart_height(svgHeight)
//             if (enable_table) {
//                 showTableFn(true)
//             }
//             else {
//                 showTableFn(false)
//             }
//         }
//     }, [chart_data, pieColor, mouseovered, enable_table, show_bar_values, temp_containerWidth, fullScreen_enabled, temp_containerHeight, svgHeight])




//     if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined ) {
//         console.log('data 278', data, dataRetreived);
//         if (dataRetreived.data !== undefined) {
//             var datakeys = Object.keys(dataRetreived.data !== undefined ? dataRetreived.data[0] : dataRetreived.data[0]).filter(key => key !== 'year' && key !== "_id");
//             console.log('datakeys 280:>> ', datakeys);
//         }
//     }
//     else {
//         console.log('data 284', props.chart_data);
//         var datakeys = Object.keys(props.chart_data !== undefined  && props.chart_data.length > 0   && props.chart_data?.[0] ).filter(key => key !== 'year' && key !== "_id");
//         console.log('datakeys 293:>> ', datakeys);
//     }



//     // if (data.length !== 0) {
//     //     var datakeys = Object.keys(data[0]).filter(key => key !== 'year' && key !== "_id");
//     //     var datakeys_name = Object.keys(data[0]).filter(key => key === 'year' && key !== "_id");
//     // }
//     const margin = { top: 35, right: 30, bottom: 10, left: 40 };



//     useEffect(() => {


//         var mod_data;
//         console.log('datakeys {Pie} :>> ', datakeys);

//         if (datakeys !== undefined && datakeys.length > 0) {

//             if (reportSlice.layoutInfo[props.indexes]?.configured && reportSlice.layoutInfo[props.indexes].data) {
//                 mod_data = reportSlice.layoutInfo[props.indexes].data;
//             }
//             else {
//                 mod_data = chart_data
//             }



//             if (reportSlice.layoutInfo[props.indexes].filtered_data) {
//                 mod_data = reportSlice.layoutInfo[props.indexes].filtered_data
//             }



//             console.log('mod_data PIes :>> ', mod_data);


//             if (mod_data !== undefined) {

//                 if (svgHeight !== undefined && svgHeight !== '') {
//                     containerHeight = containerHeight - 200
//                 }
//                 else {
//                     containerHeight = containerHeight
//                 }
//                 if (fullScreen_enabled !== undefined && fullScreen_enabled !== false) {
//                     width = temp_containerWidth - margin.left - margin.right;
//                     height = temp_containerHeight - margin.top - margin.bottom - (enabledTable ? 200 : 0)
//                     containerWidth = width
//                     containerHeight = height
//                 }
//                 else {
//                     width = containerWidth - margin.left - margin.right;
//                     height = containerHeight - margin.top - margin.bottom;
//                 }
//                 const radius = Math.min(chartSize, chartSize) / 2.5;
//                 const svg = d3.select(`#my_dataviz${i}`)
//                     .attr('width', containerWidth)
//                     .attr('height', containerHeight);

//                 const g = svg.select('g');
//                 g.selectAll('*').remove();
//                 g.attr('transform', `translate(${(fullScreen_enabled ? temp_containerWidth : containerWidth) / 2}, ${containerHeight / 2})`);

//                 var color = d3.scaleOrdinal()
//                     .range(pieColor);

//                 const pie = d3.pie()
//                     .value(d => d.count);
//                 const arcs = pie(mod_data);
//                 const arc = d3.arc()
//                     .innerRadius(0)
//                     .outerRadius(radius);

//                 const arcLabel = d3.arc()
//                     .innerRadius(radius * 0.7)
//                     .outerRadius(radius * 0.7);



//                 g.selectAll('path')
//                     .data(arcs)
//                     .enter()
//                     .append('path')
//                     .attr('fill', (d, i) => color(i))
//                     .transition()
//                     .duration(1000)
//                     .attrTween('d', function (d) {
//                         const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
//                         return function (t) {
//                             return arc(interpolate(t));
//                         }
//                     })
//                     .on('end', function () {
//                         d3.select(this)
//                             .on('mouseover', handleMouseOverAnimate)
//                             .on('mousemove', handleMouseMove)
//                             .on('mouseout', handleMouseOutAnimate)
//                             .on('mouseleave', handleMouseLeaveAnimate);
//                     })

//                 function midAngle(d) {
//                     return d.startAngle + (d.endAngle - d.startAngle) / 2;
//                 }
//                 function handleMouseOverAnimate(event, d) {
//                     if (mouseoverEnabled) {
//                         d3.select(this)
//                             .style('filter', 'url(#glow)')
//                             .transition()
//                             .duration(200)
//                             .attr('transform', `translate(${0.1 * radius * Math.cos(event.startAngle + (event.endAngle - event.startAngle) / 2)}, ${0.1 * radius * Math.sin(event.startAngle + (event.endAngle - event.startAngle) / 2)})`)
//                             .style('opacity', 1)

//                         d3.select(this)
//                             .transition()
//                             .duration(100)
//                             .attr('transform', `scale(1.1)`)
//                         const tooltip = d3.selectAll(`#tooltip${i}`);
//                         tooltip.transition().duration(100).style('opacity', 0.9);
//                         const svgContainer = d3.selectAll(`#my_dataviz${i}`).selectAll('g');
//                         const [x1, y1] = d3.pointer(event, svgContainer.node());
//                         const xPosition = x1 + (fullScreen_enabled ? temp_containerWidth : containerWidth) / 2 + 30;
//                         const yPosition = y1 + containerHeight / 2
//                         tooltip.html(`<strong>${d.data.name}</strong>: ${d.data.count}`)
//                             .style('transform', `translate(${xPosition}px, ${yPosition}px)`)
//                             .style("color", "red")
//                             .style("background-color", "white")
//                     }
//                     else {
//                     }
//                 }

//                 function handleMouseMove(event) {
//                     const tooltip = d3.selectAll(`#tooltip${i}`);
//                     const svgContainer = d3.selectAll(`#my_dataviz${i}`).selectAll('g');
//                     const [x1, y1] = d3.pointer(event, svgContainer.node());
//                     const xPosition = x1 + (fullScreen_enabled ? temp_containerWidth : containerWidth) / 2 + 30;
//                     const yPosition = y1 + containerHeight / 2;
//                     tooltip.style('transform', `translate(${xPosition}px, ${yPosition}px)`);
//                 }

//                 async function handleMouseOutAnimate(event, d) {
//                     d3.select(this).style('opacity', 1);
//                     d3.selectAll(`#tooltip${i}`).style('opacity', 0);
//                     d3.select(this)
//                         .style('filter', null)
//                         .transition()
//                         .duration(200)
//                         .attr('transform', 'translate(0,0)')
//                 }
//                 const handleMouseLeaveAnimate = () => {
//                     const tooltip = d3.select(`#tooltip${i}`);
//                     tooltip.transition().duration(100).style('opacity', 0);
//                     d3.selectAll(`#tooltip${i}`).style('opacity', 0);
//                 }
//                 if (enable_table) {
//                     showTableFn(true)
//                 }
//                 else {
//                     showTableFn(false)
//                 }
//                 const updateChart = () => {
//                     const arc = d3.arc()
//                         .innerRadius(innerRadius)
//                         .outerRadius(Math.min(chartSize, chartSize) / 2.5)
//                         .cornerRadius(cornerRadius);
//                     const arcLabel = d3.arc()
//                         .innerRadius(radius * 0.7)
//                         .outerRadius(Math.min(chartSize, chartSize) / 2.5);
//                     const pie = d3.pie()
//                         .value(d => d.count)
//                         .padAngle(padAngle);
//                     const arcs = pie(mod_data);

//                     g.selectAll('polyline , text,.legend ').remove()
//                     g.selectAll('text')
//                         .data(arcs)
//                         .enter()
//                         .append('text')
//                         .attr('transform', d => {
//                             const pos = arcLabel.centroid(d);
//                             pos[0] = radius * 1.3 * (midAngle(d) < Math.PI ? 1 : -1);
//                             return `translate(${pos})`;
//                         })
//                         .attr('dy', '0.35em')
//                         .style('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end')
//                         .style("text-transform", 'capitalize')
//                         .text(d => showvalues ? d.data.name : '')
//                         .style("opacity", 0)
//                         .transition()
//                         .duration(1000)
//                         .style("opacity", 1)
//                         .attrTween('transform', function (d) {
//                             const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
//                             return function (t) {
//                                 const pos = arcLabel.centroid(interpolate(t));
//                                 pos[0] = radius * 1.1 * (midAngle(interpolate(t)) < Math.PI ? 1 : -1);
//                                 return `translate(${pos})`;
//                             };
//                         });
//                     showvalues && g.selectAll('polyline')
//                         .data(arcs)
//                         .enter()
//                         .append('polyline')
//                         .attr('points', d => {
//                             const posA = arc.centroid(d);
//                             const posB = arcLabel.centroid(d);
//                             const posC = arcLabel.centroid(d);
//                             posC[0] = radius * 1 * (midAngle(d) < Math.PI ? 1 : -1);
//                             return [posA, posB, posC];
//                         })
//                         .style('fill', 'none')
//                         .style('stroke', 'lightgrey')
//                         .style('stroke-width', '1.5px')

//                     function midAngle(d) {
//                         return d.startAngle + (d.endAngle - d.startAngle) / 2;
//                     }

//                     svg.selectAll('path')
//                         .data(arcs)
//                         .transition()
//                         .duration(1000)
//                         .attrTween('d', function (d) {
//                             const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
//                             return function (t) {
//                                 return arc(interpolate(t));
//                             }
//                         })
//                         .on('end', function () {
//                             d3.select(this)
//                                 .on('mouseover', handleMouseOverAnimate)
//                                 .on('mousemove', handleMouseMove)
//                                 .on('mouseout', handleMouseOutAnimate)
//                                 .on('mouseleave', handleMouseLeaveAnimate);
//                         });

//                     const legend = g.selectAll('.legend')
//                         .data(mod_data)
//                         .enter().append('g')
//                         .attr('class', 'legend')
//                         .attr('transform', (d, i) => {
//                             if (containerWidth < 700) {
//                                 const legendWidth = 100;
//                                 const legendSpacing = 10;
//                                 const totalWidth = data.length * (legendWidth + legendSpacing);
//                                 const xOffset = (containerWidth - totalWidth) / 2;
//                                 return `translate(${xOffset + i * (legendWidth + legendSpacing)}, ${chartSize - 50})`;
//                             } else {
//                                 return `translate(-${containerWidth / 2 - margin.left - 20}, ${i * 20 - 100})`;
//                             }
//                         });
//                     legend.append('rect')
//                         .attr('width', 12)
//                         .attr('height', 12)
//                         .style('fill', (d, i) => color(i));
//                     legend.append('text')
//                         .attr('x', 24)
//                         .attr('y', 9)
//                         .attr('dy', '.35em')
//                         .style('text-anchor', 'start')
//                         .text(d => d.name);

//                 };
//                 updateChart();

//             }

//         }
//         else{

//             // Clear the container
//             d3.select(`#my_dataviz${i}`).html("");

//             // Add a centered "No data available" message
//             d3.select(`#my_dataviz${i}`)
//                 .style("position", "relative")
//                 .style("width", `${containerWidth}px`)
//                 .style("height", `${containerHeight}px`)
//                 .style("display", "flex")
//                 .style("justify-content", "center")
//                 .style("align-items", "center")
//                 .style("border", "1px solid #ddd") // Optional: Add a border
//                 .append("div")
//                 .style("font-size", "16px")
//                 .style("color", "grey")
//                 .text("No data available");
//         }
     

//     },
//     // [containerWidth, containerHeight, data, mouseoverEnabled, enabledTable, showvalues, temp_containerWidth, fullScreen_enabled, temp_containerHeight, enable_table, svgHeight, cornerRadius, innerRadius, padAngle, chartSize, rangeStatus[i]]);
//     [containerWidth, containerHeight, chartsLoad , data, mouseoverEnabled, enabledTable, showvalues, temp_containerWidth, fullScreen_enabled, temp_containerHeight,  cornerRadius, innerRadius, padAngle, chartSize, rangeStatus[i]]);




//     const handleRadiusChange = (fieldName, value) => {
    
//         if (fieldName === 'cornerRadius') {
//             setCornerRadius(value);
//         } else if (fieldName === 'innerRadius') {
//             setInnerRadius(value);
//         } else if (fieldName === 'padAngle') {
//             setPadAngle(value);
//         } else if (fieldName === 'ChartSize') {
//             setChartSize(value);
//         }
//     };
    
//     useEffect(() => {
//         if (rangeStatus && rangeStatus[i]) {
//             const currentStatus = rangeStatus[i];
//             Object.keys(currentStatus).forEach((fieldName) => {
//                 const { value } = currentStatus[fieldName]; 
//                 handleRadiusChange(fieldName, value);
//             });
//         }
//     }, [rangeStatus, i]);



//     const showTableFn = async (val) => {
//         var mod_data
//         if (data?.length > 0) {
//             mod_data = data
//         } else {
//             mod_data = [{ count: 1, name: 'Placeholder1' }, { count: 1, name: 'Placeholder2' }];
//         }
//         const fieldNames = Object.keys(mod_data[0]);
//         if (val) {
//             await tabulate(data, fieldNames)
//         }
//         else {
//             d3.selectAll(`#tableContainer${i}`).selectAll("table").remove();
//         }
//     }



//     const tabulate = async (data, columns, y_axis_name) => {
//         const header = columns;
//         var data_exist;
//         if (data !== undefined) {
//             data_exist = data;
//         } else {
//             data_exist = data;
//         }
//         var tableContainer = document.getElementById(`tableContainer${i}`);
//         if (tableContainer !== null) {
//             tableContainer.innerHTML = "";

//         }
//         var table = d3.select(`#tableContainer${i}`)
//             .attr("class", "table-responsive")
//             .append("table")
//             .style("width", `${fullScreen_enabled ? temp_containerWidth : containerWidth - 8}px`);
//         var thead = table.append("thead");
//         var tbody = table.append("tbody");
//         d3.select(tableContainer)
//             .attr('class', 'table_body')
//             .style("overflow-y", "scroll")
//             .style("overflow-x", "hidden");
//         thead.append("tr")
//             .selectAll("th")
//             .data(header)
//             .enter()
//             .append("th")
//             .text(function (column) { return column.toUpperCase(); })
//             .attr("style", "text-align: center")
//             .style('color', 'black')
//         var rows = tbody.selectAll("tr")
//             .data(data_exist)
//             .enter()
//             .append("tr");
//         var cells = rows.selectAll("td")
//             .data(function (row) {
//                 return columns.map(function (column) {
//                     return { column: column, value: row[column] };
//                 });
//             })
//             .enter()
//             .append("td")
//             .attr("class", function (d) { return "cell " + d.column; })
//             .html(function (d) {
//                 return d.column === "percentage" ? d.value.toFixed(2) + "%" : d.value;
//             })
//             .attr("style", "text-align: center")
//             .style('color', 'black')
//         return table;
//     }

//     return (
//         <div>
//             <div id={`tooltip${i}`} style={{ position: 'absolute', opacity: 0, background: 'lightgray', padding: '10px', borderRadius: '5px' }}></div>

//             {
//                 chartsLoad ?

//                     <div id={`my_dataviz${i}`} width={(fullScreen_enabled !== undefined && fullScreen_enabled !== false) ? temp_containerWidth : containerWidth} onMouseLeave={() => { setShowOptions(false); setSortShowOptions(false); }} >
//                         <svg width={(fullScreen_enabled !== undefined && fullScreen_enabled !== false) ? temp_containerWidth : containerWidth} height={(fullScreen_enabled !== undefined && fullScreen_enabled !== false) ? temp_containerWidth : containerHeight} >
//                             <g></g>
//                         </svg>
//                     </div>
//                     :
//                     <>
//                         <Spinner
//                             color="info"
//                             className="chartLoader"
//                             style={{
//                                 position: "fixed",
//                                 top: "50%",
//                                 left: "50%",
//                             }}
//                         >
//                             Loading...
//                         </Spinner>
//                     </>
//             }
//             {isLoading &&
//                 <div className="loader-overlay">
//                     <div className="loader"></div>
//                 </div>}
//             {enabledTable ? (
//                 <>
//                     <div style={{
//                         position: 'absolute',
//                         bottom: 0,
//                         left: 0,
//                         backgroundColor: '#fff',
//                         height: (fullScreen_enabled ? '240px' : '200px')

//                     }} id={`tableContainer${i}`}>
//                     </div>
//                 </>
//             ) : null}
//         </div>
//     );
// };
// export default PieChart;













// Existing
// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import * as d3 from 'd3';

// const PieChart = (props) => {
//     var containerWidth = props.containerWidth
//     var containerHeight = props.containerHeight
//     var chart_data = props.chart_data
//     var i = props.id
//     var mouseovered = props.mouseovered
//     var enable_table = props.show_table
//     var svgHeight = props.chart_height

//     var show_bar_values = props.show_bar_values
//     var temp_containerWidth = props.temp_containerWidth
//     var temp_containerHeight = props.temp_containerHeight
//     var fullScreen_enabled = props.show_Full_Screen_toggle

//     const [showOptions, setShowOptions] = useState(false)
//     const [isLoading, setIsLoading] = useState(false);
//     const [data, setData] = useState(chart_data);
//     const [pieColor, setpieColor] = useState(d3.schemeCategory10)
//     const [mouseoverEnabled, setMouseoverEnabled] = useState(mouseovered)
//     const [enabledTable, setEnabledTable] = useState(enable_table)
//     const [sortShowOptions, setSortShowOptions] = useState(false);
//     const [chart_height, setchart_height] = useState(svgHeight);
//     const [cornerRadius, setCornerRadius] = useState(0);
//     const [innerRadius, setInnerRadius] = useState(0);
//     const [padAngle, setPadAngle] = useState(0);
//     const [chartSize, setChartSize] = useState(props.containerHeight);
//     const [showvalues, setshowvalues] = useState(show_bar_values);

//     const dispatch = useDispatch();

//     const downloadStatus = useSelector(state => state.reportSliceReducer.downloadStatus);
    // const rangeStatus = useSelector(state => state.reportSliceReducer.rangeStatus);
//     console.log('rangeStatusAreachart', rangeStatus)
    
//     var width
//     var height
//     useEffect(() => {
//         if (chart_data !== undefined) {
//             setData(chart_data)
//             setpieColor(d3.schemeCategory10)
//             setMouseoverEnabled(mouseovered)
//             setEnabledTable(enable_table)
//             setshowvalues(show_bar_values)
//             setchart_height(svgHeight)
//             if (enable_table) {
//                 showTableFn(true)
//             }
//             else {
//                 showTableFn(false)
//             }
//         }
//     }, [chart_data, pieColor, mouseovered, enable_table, show_bar_values, temp_containerWidth, fullScreen_enabled, temp_containerHeight, svgHeight])
//     if (props.chart_data.length !== 0) {
//         var datakeys = Object.keys(props.chart_data[0]).filter(key => key !== 'year' && key !== "_id");
//         var datakeys_name = Object.keys(props.chart_data[0]).filter(key => key === 'year' && key !== "_id");
//     }
//     const margin = { top: 35, right: 30, bottom: 10, left: 40 };
//     useEffect(() => {
//         if (svgHeight !== undefined && svgHeight !== '') {
//             containerHeight = containerHeight - 200
//         }
//         else {
//             containerHeight = containerHeight
//         }
//         if (fullScreen_enabled !== undefined && fullScreen_enabled !== false) {
//             width = temp_containerWidth - margin.left - margin.right;
//             height = temp_containerHeight - margin.top - margin.bottom - (enabledTable ? 200 : 0)
//             containerWidth = width
//             containerHeight = height
//         }
//         else {
//             width = containerWidth - margin.left - margin.right;
//             height = containerHeight - margin.top - margin.bottom;
//         }
//         const radius = Math.min(chartSize, chartSize) / 2.5;
//         const svg = d3.select(`#my_dataviz${i}`)
//             .attr('width', containerWidth)
//             .attr('height', containerHeight);

//         const g = svg.select('g');
//         g.selectAll('*').remove();
//         g.attr('transform', `translate(${(fullScreen_enabled ? temp_containerWidth : containerWidth) / 2}, ${containerHeight / 2})`);

//         var color = d3.scaleOrdinal()
//             .range(pieColor);

//         const pie = d3.pie()
//             .value(d => d.count);
//         console.log(data, 'data')

//         const arcs = pie(data);
//         const arc = d3.arc()
//             .innerRadius(0)
//             .outerRadius(radius);

//         const arcLabel = d3.arc()
//             .innerRadius(radius * 0.7)
//             .outerRadius(radius * 0.7);



//         g.selectAll('path')
//             .data(arcs)
//             .enter()
//             .append('path')
//             .attr('fill', (d, i) => color(i))
//             .transition()
//             .duration(1000)
//             .attrTween('d', function (d) {
//                 const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
//                 return function (t) {
//                     return arc(interpolate(t));
//                 }
//             })
//             .on('end', function () {
//                 d3.select(this)
//                     .on('mouseover', handleMouseOverAnimate)
//                     .on('mousemove', handleMouseMove)
//                     .on('mouseout', handleMouseOutAnimate)
//                     .on('mouseleave', handleMouseLeaveAnimate);
//             })

//         function midAngle(d) {
//             return d.startAngle + (d.endAngle - d.startAngle) / 2;
//         }
//         function handleMouseOverAnimate(event, d) {
//             if (mouseoverEnabled) {
//                 d3.select(this)
//                     .style('filter', 'url(#glow)')
//                     .transition()
//                     .duration(200)
//                     .attr('transform', `translate(${0.1 * radius * Math.cos(event.startAngle + (event.endAngle - event.startAngle) / 2)}, ${0.1 * radius * Math.sin(event.startAngle + (event.endAngle - event.startAngle) / 2)})`)
//                     .style('opacity', 1)

//                 d3.select(this)
//                     .transition()
//                     .duration(100)
//                     .attr('transform', `scale(1.1)`)
//                 const tooltip = d3.selectAll(`#tooltip${i}`);
//                 tooltip.transition().duration(100).style('opacity', 0.9);
//                 const svgContainer = d3.selectAll(`#my_dataviz${i}`).selectAll('g');
//                 const [x1, y1] = d3.pointer(event, svgContainer.node());
//                 const xPosition = x1 + (fullScreen_enabled ? temp_containerWidth : containerWidth) / 2 + 30;
//                 const yPosition = y1 + containerHeight / 2
//                 tooltip.html(`<strong>${d.data.name}</strong>: ${d.data.count}`)
//                     .style('transform', `translate(${xPosition}px, ${yPosition}px)`)
//                     .style("color", "red")
//                     .style("background-color", "white")
//             }
//             else {
//             }
//         }

//         function handleMouseMove(event) {
//             const tooltip = d3.selectAll(`#tooltip${i}`);
//             const svgContainer = d3.selectAll(`#my_dataviz${i}`).selectAll('g');
//             const [x1, y1] = d3.pointer(event, svgContainer.node());
//             const xPosition = x1 + (fullScreen_enabled ? temp_containerWidth : containerWidth) / 2 + 30;
//             const yPosition = y1 + containerHeight / 2;
//             tooltip.style('transform', `translate(${xPosition}px, ${yPosition}px)`);
//         }

//         async function handleMouseOutAnimate(event, d) {
//             d3.select(this).style('opacity', 1);
//             d3.selectAll(`#tooltip${i}`).style('opacity', 0);
//             d3.select(this)
//                 .style('filter', null)
//                 .transition()
//                 .duration(200)
//                 .attr('transform', 'translate(0,0)')
//         }
//         const handleMouseLeaveAnimate = () => {
//             const tooltip = d3.select(`#tooltip${i}`);
//             tooltip.transition().duration(100).style('opacity', 0);
//             d3.selectAll(`#tooltip${i}`).style('opacity', 0);
//         }
//         if (enable_table) {
//             showTableFn(true)
//         }
//         else {
//             showTableFn(false)
//         }
//         const updateChart = () => {
//             const arc = d3.arc()
//                 .innerRadius(innerRadius)
//                 .outerRadius(Math.min(chartSize, chartSize) / 2.5)
//                 .cornerRadius(cornerRadius);
//             const arcLabel = d3.arc()
//                 .innerRadius(radius * 0.7)
//                 .outerRadius(Math.min(chartSize, chartSize) / 2.5);
//             const pie = d3.pie()
//                 .value(d => d.count)
//                 .padAngle(padAngle);
//             const arcs = pie(data);

//             g.selectAll('polyline , text,.legend ').remove()
//             g.selectAll('text')
//                 .data(arcs)
//                 .enter()
//                 .append('text')
//                 .attr('transform', d => {
//                     const pos = arcLabel.centroid(d);
//                     pos[0] = radius * 1.3 * (midAngle(d) < Math.PI ? 1 : -1);
//                     return `translate(${pos})`;
//                 })
//                 .attr('dy', '0.35em')
//                 .style('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end')
//                 .style("text-transform", 'capitalize')
//                 .text(d => showvalues ? d.data.name : '')
//                 .style("opacity", 0)
//                 .transition()
//                 .duration(1000)
//                 .style("opacity", 1)
//                 // .style("text-transform", capitalize)
//                 .attrTween('transform', function (d) {
//                     const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
//                     return function (t) {
//                         const pos = arcLabel.centroid(interpolate(t));
//                         pos[0] = radius * 1.1 * (midAngle(interpolate(t)) < Math.PI ? 1 : -1);
//                         return `translate(${pos})`;
//                     };
//                 });
//             showvalues && g.selectAll('polyline')
//                 .data(arcs)
//                 .enter()
//                 .append('polyline')
//                 .attr('points', d => {
//                     const posA = arc.centroid(d);
//                     const posB = arcLabel.centroid(d);
//                     const posC = arcLabel.centroid(d);
//                     posC[0] = radius * 1 * (midAngle(d) < Math.PI ? 1 : -1);
//                     return [posA, posB, posC];
//                 })
//                 .style('fill', 'none')
//                 .style('stroke', 'lightgrey')
//                 .style('stroke-width', '1.5px')

//             function midAngle(d) {
//                 return d.startAngle + (d.endAngle - d.startAngle) / 2;
//             }

//             svg.selectAll('path')
//                 .data(arcs)
//                 .transition()
//                 .duration(1000)
//                 .attrTween('d', function (d) {
//                     const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
//                     return function (t) {
//                         return arc(interpolate(t));
//                     }
//                 })
//                 .on('end', function () {
//                     d3.select(this)
//                         .on('mouseover', handleMouseOverAnimate)
//                         .on('mousemove', handleMouseMove)
//                         .on('mouseout', handleMouseOutAnimate)
//                         .on('mouseleave', handleMouseLeaveAnimate);
//                 });



//             const legend = g.selectAll('.legend')
//                 .data(data)
//                 .enter().append('g')
//                 .attr('class', 'legend')
//                 .attr('transform', (d, i) => {
//                     if (containerWidth < 700) {
//                         const legendWidth = 100;
//                         const legendSpacing = 10;
//                         const totalWidth = data.length * (legendWidth + legendSpacing);
//                         const xOffset = (containerWidth - totalWidth) / 2;
//                         return `translate(${xOffset + i * (legendWidth + legendSpacing)}, ${chartSize - 50})`;
//                     } else {
//                         return `translate(-${containerWidth / 2 - margin.left - 20}, ${i * 20 - 100})`;
//                     }
//                 });
//             legend.append('rect')
//                 .attr('width', 12)
//                 .attr('height', 12)
//                 .style('fill', (d, i) => color(i));
//             legend.append('text')
//                 .attr('x', 24)
//                 .attr('y', 9)
//                 .attr('dy', '.35em')
//                 .style('text-anchor', 'start')
//                 .text(d => d.name);

//         };
//         updateChart();
//     }, !downloadStatus ?  [ rangeStatus[i] ,cornerRadius, innerRadius, padAngle, chartSize] : [ containerWidth, containerHeight, data, pieColor, mouseoverEnabled, enabledTable, showvalues, temp_containerWidth, fullScreen_enabled, temp_containerHeight, enable_table, svgHeight, cornerRadius, innerRadius, padAngle, chartSize]);
    


//     const showTableFn = async (val) => {
//         const fieldNames = Object.keys(data[0]);
//         if (val) {
//         await tabulate(data, fieldNames)
//         }
//         else {
//         d3.selectAll(`#tableContainer${i}`).selectAll("table").remove();
//         }
//     }


    // const handleRadiusChange = (fieldName, value) => {
    //     console.log('handleRadiusChange', typeof fieldName, fieldName, value);
    
    //     if (fieldName === 'cornerRadius') {
    //         setCornerRadius(value);
    //     } else if (fieldName === 'innerRadius') {
    //         setInnerRadius(value);
    //     } else if (fieldName === 'padAngle') {
    //         setPadAngle(value);
    //     } else if (fieldName === 'ChartSize') {
    //         setChartSize(value);
    //     }
    // };
    
    // useEffect(() => {
    //     if (rangeStatus && rangeStatus[i]) {
    //         const currentStatus = rangeStatus[i];
    //         Object.keys(currentStatus).forEach((fieldName) => {
    //             const { value } = currentStatus[fieldName]; 
    //             handleRadiusChange(fieldName, value);
    //         });
    //     }
    // }, [rangeStatus, i]);

//     const tabulate = async (data, columns, y_axis_name) => {
//         const header = columns;
//         var data_exist;
//         if (data !== undefined) {
//             data_exist = data;
//         } else {
//             data_exist = data;
//         }
//         var tableContainer = document.getElementById(`tableContainer${i}`);
//         if (tableContainer !== null) {
//             tableContainer.innerHTML = "";

//         }
//         var table = d3.select(`#tableContainer${i}`)
//             .attr("class", "table-responsive")
//             .append("table")
//             .style("width", `${fullScreen_enabled ? temp_containerWidth : containerWidth - 8}px`);
//         var thead = table.append("thead");
//         var tbody = table.append("tbody");
//         d3.select(tableContainer)
//             .attr('class', 'table_body')
//             .style("overflow-y", "scroll")
//             .style("overflow-x", "hidden");
//         thead.append("tr")
//             .selectAll("th")
//             .data(header)
//             .enter()
//             .append("th")
//             .text(function (column) { return column.toUpperCase(); })
//             .attr("style", "text-align: center")
//             .style('color', 'black')
//         var rows = tbody.selectAll("tr")
//             .data(data_exist)
//             .enter()
//             .append("tr");
//         var cells = rows.selectAll("td")
//             .data(function (row) {
//                 return columns.map(function (column) {
//                     return { column: column, value: row[column] };
//                 });
//             })
//             .enter()
//             .append("td")
//             .attr("class", function (d) { return "cell " + d.column; })
//             .html(function (d) {
//                 return d.column === "percentage" ? d.value.toFixed(2) + "%" : d.value;
//             })
//             .attr("style", "text-align: center")
//             .style('color', 'black')
//         return table;
//     }
//     return (
//         <div>
//             <div id={`tooltip${i}`} style={{ position: 'absolute', opacity: 0, background: 'lightgray', padding: '10px', borderRadius: '5px' }}></div>
//             <div id={`my_dataviz${i}`} width={(fullScreen_enabled !== undefined && fullScreen_enabled !== false) ? temp_containerWidth : containerWidth} onMouseLeave={() => { setShowOptions(false); setSortShowOptions(false); }} >
//                 <svg width={(fullScreen_enabled !== undefined && fullScreen_enabled !== false) ? temp_containerWidth : containerWidth} height={(fullScreen_enabled !== undefined && fullScreen_enabled !== false) ? temp_containerWidth : containerHeight} >
//                     <g></g>
//                 </svg>
//             </div>

//             {isLoading &&
//                 <div className="loader-overlay">
//                     <div className="loader"></div>
//                 </div>}
//             {enabledTable ? (
//                 <>
//                     <div style={{
//                         position: 'absolute',
//                         bottom: 0,
//                         left: 0,
//                         backgroundColor: '#fff',
//                         height: (fullScreen_enabled ? '240px' : '200px')

//                     }} id={`tableContainer${i}`}>
//                     </div>
//                 </>
//             ) : null}
//         </div>
//     );
// };
// export default PieChart;