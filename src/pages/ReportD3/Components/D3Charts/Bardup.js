import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Spinner } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { verticalBar, barSorting, barDescending, handleDownloadBar, imgDownloadSvg, imgDownloadPng } from '../../../../store/reportd3/reportslice';

const BarChart = (props) => {
    var chart_data = props.chart_data
    var BarWidth = props.BarWidth
    var datasLoaded = (props.load !== undefined ? props.load : true)
    var containerWidth = props.containerWidth
    var containerHeight = props.containerHeight
    var i = props.id
    var label_name = props.label
    var barColor = props.chart_color || 'steelblue';
    var mouseovered = props.mouseovered
    var showline = props.show_Line
    var xLabel = 'Name'
    var enable_table = props.show_table
    var svgHeight = props.chart_height
    var show_bar_values = props.show_bar_values
    var barLabel = props.label;
    var barYLabel = props.YLabel
    var show_Grid = props.show_Grid
    var temp_containerWidth = props.temp_containerWidth
    var temp_containerHeight = props.temp_containerHeight
    var fullScreen_enabled = props.show_Full_Screen_toggle
    var show_Square = props.show_Square
    var curved_line = props.curved_line
    var text_color_arr = props.text_color
    var y_axis_key = props.chartWidth

    const [chartWidth, setChartWidth] = useState(BarWidth === undefined ? containerWidth : '200')
    const dispatch = useDispatch()
    const chartRef = useRef();
    const [showOptions, setShowOptions] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [sortShowOptions, setSortShowOptions] = useState(false);
    const [tableColumns, setTableColumns] = useState(["year", "value"]);
    const [zoomedData, setZoomedData] = useState()
    const [data, setData] = useState(chart_data)
    const [mouseoverEnabled, setMouseoverEnabled] = useState(mouseovered)
    const [yLabelname, setYLabelname] = useState('value')
    const [showLine, setShowLine] = useState(showline)
    const [enabledTable, setEnabledTable] = useState(enable_table)
    const [chartHeight, setchartHeight] = useState(svgHeight)
    const [showGridenabled, setShowGridenabled] = useState(show_Grid)
    const [showValues, setShowValues] = useState(show_bar_values);
    const [sortData, setSortData] = useState([]);
    const [chartsLoad, setChartsLoad] = useState(true)
    const SortArr = useSelector(state => state.reportSliceReducer);

    var resized = props.resized
    useEffect(() => {
        setChartsLoad(datasLoaded)
    }, [datasLoaded])







    useEffect(() => {
        if (chart_data !== undefined && chart_data.length > 0) {
            setData(chart_data)
            setShowValues(show_bar_values)
            setMouseoverEnabled(mouseovered)
            setShowLine(showline)
            setEnabledTable(enable_table)
            setchartHeight(svgHeight)
            setShowGridenabled(show_Grid)

        }
    }, [chart_data, barColor, label_name, mouseovered, showline, enable_table, svgHeight, show_Grid, temp_containerWidth, fullScreen_enabled, temp_containerHeight, show_bar_values])

    if (props.chart_data.length !== 0) {
        var datakeys = Object.keys(props.chart_data[0]).filter(key => key !== 'year' && key !== "_id");
        var datakeys_name = Object.keys(props.chart_data[0]).filter(key => key === 'year' && key !== "_id");

    }
    let zoomState = { k: 1, x: 0, y: 0 };
    const margin = { top: 70, right: 30, bottom: 80, left: 40 };
    useEffect(() => {

        var mod_data;
        var chart_id = i;
        if (SortArr[chart_id] && SortArr[chart_id].horbarsorted) {
            mod_data = SortArr[chart_id].horbarsorted;
        } else {
            mod_data = data;
        }

        // mod_data = [
        //     { year: "2020", value: 10 },
        //     { year: "2020", value: 15 },
        //     { year: "2021", value: 20 },
        //     { year: "2021", value: 25 },
        //     { year: "2022", value: 30 },
        //     { year: "2022", value: 35 },
        //     { year: "2023", value: 40 },
        //     { year: "2023", value: 45 },
        //     { year: "2024", value: 50 },
        //     { year: "2024", value: 55 },
        //     { year: "20000000000000", value: 60 },
        //     { year: "2025", value: 65 },
        //     { year: "2026", value: 70 },
        //     { year: "2026", value: 75 },
        //     { year: "2027", value: 80 },
        //     { year: "2027", value: 85 },
        //     { year: "2028", value: 90 },
        //     { year: "2028", value: 95 },
        //     { year: "2029", value: 100 },
        //     { year: "2029", value: 105 }
        // ];


        if (svgHeight !== undefined && svgHeight !== '') {
            containerHeight = containerHeight - 200
        }
        else {
            containerHeight = containerHeight - 40
        }
        var width
        var height
        if (fullScreen_enabled !== undefined && fullScreen_enabled !== false) {
            width = temp_containerWidth - margin.left - margin.right;
            height = temp_containerHeight - margin.top - margin.bottom - (enabledTable ? 200 : 0)
            containerHeight = height + margin.top
            containerWidth = width
        }
        else {
            width = containerWidth - margin.left - margin.right;
            height = containerHeight - margin.top - margin.bottom ;
        }
        const temp_barWidth = BarWidth !== undefined ? Number(BarWidth) : 150;
        containerWidth = BarWidth !== undefined ? mod_data.length * temp_barWidth : props.containerWidth
        containerWidth = fullScreen_enabled ? (BarWidth !== undefined ? mod_data.length * temp_barWidth : temp_containerWidth) : containerWidth

        const marginTop = margin.top;
        const marginRight = margin.right;
        const marginBottom = margin.bottom;
        const marginLeft = margin.left;
        const x = d3.scaleBand()
            // .domain(mod_data.map((d) => d.year))
            .domain(mod_data.map((d, i) => i))
            .range([marginLeft, containerWidth - marginRight])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(mod_data, (d) => Number(d.value))])
            .nice()
            .range([containerHeight - marginBottom, marginTop])

        d3.select(`#my_dataviz${i}`).selectAll("svg").remove();
        d3.select(`#my_dataviz${i}`).selectAll("div").remove();
        d3.selectAll(`#my_dataviz${i}`).selectAll("div").remove();
        d3.select(`#my_dataviz${i}`).selectAll('svg').remove();
        d3.select(`#my_dataviz${i}`).selectAll('div').remove();

        const extent = [[marginLeft, marginTop], [containerWidth - marginRight, height - marginTop]];
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", zoomed);
        const svgContainer = d3
            .select(`#my_dataviz${i}`)
            .style("width", '100%')
            .style("overflow-x", BarWidth !== undefined ? "auto" : "hidden")
            .style("width", `${containerWidth}px`)

            .style("height", `${fullScreen_enabled ? containerHeight + marginBottom  : containerHeight + 30}px`)
            .style("overflow-y", "hidden")
            .call(zoom)
        const svg = svgContainer
            .append('svg')
            .attr("width", containerWidth)
            .attr("height", containerHeight + 30 )
        function applyZoomState() {
            const transform = d3.zoomIdentity.translate(zoomedData.x, zoomedData.y).scale(zoomedData.k);
            svg.call(zoom.transform, transform);
        }
        if (zoomedData !== undefined) {
            applyZoomState();
        }

        svg.append("rect")
            .attr("class", "chart-box")
            .attr("x", marginLeft)
            .attr("y", marginTop)
            .attr("width", containerWidth - marginLeft - marginRight)
            .attr("height", containerHeight - marginTop - marginBottom)
            .attr("fill", "none")
            .attr("stroke", "lightgrey")
        if (showGridenabled) {
            svg.append("g")
                .selectAll("line")
                .attr('class', 'x-grid')
                .data(mod_data)
                .join("line")
                .attr("x1", (d ,  i) => x(i) + x.bandwidth() / 2)
                .attr("x2", (d , i) => x(i) + x.bandwidth() / 2)
                .attr("y1", marginTop)
                .attr("y2", containerHeight - marginBottom)
                .attr("stroke", "lightgrey");
            svg.append('g')
                .attr('class', 'y-grid')
                .attr('transform', `translate(${marginLeft},${marginTop - marginBottom + 10})`)
                .call(d3.axisLeft(y)
                    .tickSize(-(mod_data.length * temp_barWidth - marginLeft - marginRight))
                    .tickFormat('')
                    .ticks(5)
                )
                .select('.domain , line')
                .remove();

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
        const newWidth = Math.max(temp_barWidth + margin.left + margin.right, containerWidth);
        setChartWidth(BarWidth !== undefined ? newWidth : containerWidth)

        svg.selectAll('.bar')
            .data(mod_data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr("x", (d, i) => x(i))
            .attr("y", d => y(d.value))
            .attr('height', 0)
            .attr('y', (d) => y(Number(d.value)))
            .attr('fill', `${props.chart_color}`)
            .on('mouseover', handleMouseOver)
            .on('mousemove', handleMousemove)
            .on('mouseout', handleMouseOut)

        var u =
            svg.selectAll('.bar')
                .data(mod_data)
        u
            .enter()
            .append("rect")
            .merge(u)
            .attr('width', x.bandwidth())
            .attr("x", (d, i) => x(i))
            .attr('y', (d) => y(0))
            .transition()
            .duration(1000)
            .attr('y', (d) => y(Number(d.value)))
            .attr('height', (d) => containerHeight - y(Number(d.value)) - marginBottom)
            .attr('y', (d) => y(Number(d.value)))
            .attr('height', (d) => containerHeight - y(Number(d.value)) - marginBottom)

        function handleMouseOver(event, d) {
            if (mouseoverEnabled) {
                // d3.select(this).attr('fill', '#4682b4');
                const scrollX = chartRef.current.scrollLeft;
                const adjustedMouseX = event.clientX + scrollX;
                const tooltip = d3.select(`#tooltip${i}`);
                tooltip.transition().duration(200)
                    .style("opacity", .9);
                tooltip.html(`${barLabel}: ${d.year}<br>Value: ${d.value}`)
                    .style("left", (adjustedMouseX - 650) + "px")
                    .style("top", (100) + "px")
                    .style("color", "red")
                    .style("background-color", "white")
            }
        }

        function handleMousemove(event, d) {
            if (mouseoverEnabled) {
                const scrollX = chartRef.current.scrollLeft;
                const adjustedMouseX = event.clientX + scrollX;
                const adjustedMouseY = event.offsetY
                const tooltip = d3.select(`#tooltip${i}`);
                tooltip.html(`${barLabel}: ${d.year}<br>Value: ${d.value}`)
                    .style("left", (fullScreen_enabled ? adjustedMouseX + 50 : adjustedMouseX - 650) + "px")
                    .style("top", (fullScreen_enabled ? adjustedMouseY : adjustedMouseY) + "px");
            }
        }

        function handleMouseOut() {
            // d3.select(this).attr('fill', props.chart_color);
            const tooltip = d3.select(`#tooltip${i}`);
            tooltip.transition().duration(100)
                .style("opacity", 0);
        }
        svg.selectAll('.bar-label')
            .data(mod_data)
            .enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('x', d => x(d.year) + x.bandwidth() / 2)
            .attr('y', d => y(d.value) - 5)
            .text(d => showValues ? d.value : '')
            .attr('text-anchor', 'middle')
            .attr('fill', d => text_color_arr)
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 1);

        d3.selectAll(`.legends1${i}`).remove()
        d3.selectAll(`.legends${i}`).selectAll('div').remove()
        // const legendRectSize = 15;
        // const legendContainer = d3.selectAll(`#legend${i}`)

        //     .attr("class", `legends${i}`)
        //     .style("boxShadow", "none");

        // legendContainer.append("div")
        //     .attr("class", "legend-rect")
        //     .style("width", `${legendRectSize}px`)
        //     .style("height", `${legendRectSize}px`)
        //     .style("background-color", props.chart_color)
        //    .style("margin-right", "5px") 
        //     .style("boxShadow", "none");


        // legendContainer.append("div")
        //     .attr("class", "legend-text")
        //     .style("lineHeight", `${legendRectSize}px`)
        //     .text(barYLabel)
        //     .style("BoxShadow", "none");

        const legendRectSize = 15;
        const legendContainer = d3.selectAll(`#legend${i}`)
            .attr("class", `legends${i}`)
            .style("display", "flex")
            .style("align-items", "center")
            .style("boxShadow", "none");

        legendContainer.append("div")
            .attr("class", "legend-rect")
            .style("width", `${legendRectSize}px`)
            .style("height", `${legendRectSize}px`)
            .style("background-color", props.chart_color)
            .style("margin-right", "7px") // Add small gap between rectangle and text
            .style("boxShadow", "none");

        legendContainer.append("div")
            .attr("class", "legend-text")
            .style("line-height", `${legendRectSize}px`)
            .text(barYLabel)
            .style("boxShadow", "none");



        const axisLabels = svg.append('g')
            .attr('class', `x-axis ${i}`)
            .attr("transform", `translate(0,${containerHeight - marginBottom})`)
            .call(d3.axisBottom(x).tickFormat((d, i) => mod_data[i].year))
            .selectAll('text')
            .style("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("dy", "1.5em")
            .attr("dx", '-0em')
            .attr('fill', 'black')
            .style("text-transform", "capitalize")
            .style("font-weight", (d, i) => i % 2 === 0 ? "bold" : "normal")
        let rotationAngle = 0;
        axisLabels.each(function (_, i) {
            const label = this;
            d3.select(label).on('click', function () {
                const currentRotation = rotationAngle === 0 ? -45 : 0;
                const currentAnchor = rotationAngle === 0 ? 'end' : "middle";
                axisLabels.attr('transform', `rotate(${currentRotation})`)
                    .style("text-anchor", function (d) {
                        return currentRotation === -45 ? 'middle' : 'middle';
                    })
                    .attr('dx', function (d) {
                        return currentRotation === -45 ? '-.8em' : '0em';
                    })
                    .attr('dy', function (d) {
                        return currentRotation === -45 ? '.15em' : '1.5em';
                    })
                rotationAngle = currentRotation;

            });
        });
       

        const yAxisContainer = d3.select(`#my_dataviz${i}`)
            .attr('class', 'y-axis')
            .append("div")
            .style('z-index', 1)
            .style("position", "absolute")
            .style("top", `${0}px`)
            .style("left", "0")
            .style("width", `${marginLeft + 20}px`)
            .style("height", `${containerHeight + 20}px`);

        const yAxis = yAxisContainer.append("svg")
            .attr("width", '100%')
            .attr("height", containerHeight)
            .append("g")
            .attr("transform", `translate(${marginLeft + 20},0)`)
            .call(d3.axisLeft(y).ticks(fullScreen_enabled ? 20 : containerHeight / 50))
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



            yAxisContainer.select("svg")
            .append('text')
            .attr('class', 'ylabel')
                .attr('x', -containerHeight / 2)
                .attr('y', marginLeft / 2)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .attr("font-size", "14px")
                .style("fill", 'green')
                .text(yLabelname);
            d3.selectAll('.legend-label')
                .text(yLabelname);


        // X-n Axis label
            svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "start")
            .attr("x", (containerWidth - margin.left - margin.right) / 2 )
            .attr("y", containerHeight - margin.bottom  + margin.top - 10)
            .text(barLabel);

        // // Y-axis label
        // svg.append("text")
        //     .attr("class", "axis-label")
        //     .attr("text-anchor", "start")
        //     .attr("x", margin.left) // Position horizontally based on margin left
        //     .attr("y", margin.top - 10) // Position vertically based on margin top
        //     .text(barYLabel);





        if (enable_table) {
            showTableFunc(true)
        }
        else {
            showTableFunc(false)
        }

        if (showLine) {

            // const line = d3.line()
            //     .x(d => x(d.year) + x.bandwidth() / 2)
            //     .y(d => y(d.value))


            const line = d3.line()
                .x((d, i) => x(i) + x.bandwidth() / 2) // Use index here
                .y(d => y(d.value));



            if (curved_line) {
                line.curve(d3.curveCatmullRom.alpha(0.5));
            }
            const path = svg.append('path')
                .datum(mod_data)
                .attr('fill', 'none')
                .attr('stroke', 'blue')
                .attr('stroke-width', 2)
                .attr('d', line)

            const totalLength = path.node()?.getTotalLength();
            path.attr('stroke-dasharray', `${totalLength} ${totalLength}`)
                .attr('stroke-dashoffset', totalLength)
                .transition()
                .duration(100)
                .ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0);

            if (!show_Square) {
                squareNodeMouseover()
            }
            else {
                circleNodeMouseover()
            }
        }
        function squareNodeMouseover() {

            
            var u =
                svg.selectAll('.bar')
                    .data(mod_data)

            u
                .enter()
                .append("rect")
                .attr('class', 'bars')
                .merge(u)
                .attr('width', x.bandwidth())
                .attr("x", (d, i) => x(i))
                .attr('y', (d) => y(Number(d.value)))
                .attr('height', (d) => containerHeight - y(Number(d.value)) - marginBottom)
        

            const squares = svg.selectAll('.square-node')
                .data(mod_data)
                .enter()
                .append('rect')
                .attr('class', 'square-nodes')
                // .attr('x', d => x(d.year) + x.bandwidth() / 2 - 4)
                .attr('x', (d, i) => x(i) + x.bandwidth() / 2 - 4)
                .attr('y', d => y(d.value) - 4)
                .attr('width', 8)
                .attr('height', 8)
                .attr('fill', 'blue')
                .on("mouseover", function (event, d) {
                const index = mod_data.findIndex(data => data._id === d._id);

                    const tooltip = d3.select(this.parentNode)
                        .append("rect")
                        .attr("class", "tooltip-box")
                        .attr("x", x(index) + x.bandwidth() / 2 - 70)
                        .attr("y", y(d.value) - 70)
                        .attr("height", 40)
                        .attr("width", 140)
                        .attr("fill", "white")
                    d3.select(this.parentNode)
                        .append("text")
                        .attr("class", "tooltip-text")
                        .attr("x", x(index) + x.bandwidth() / 2)
                        .attr("y", y(d.value) - 45)
                        .attr("text-anchor", "middle")
                        .text(`Value: ${d.value}`)
                        .style("fill", "red");

                    d3.select(this.parentNode)
                        .append("text")
                        .attr("class", "tooltip-text")
                        .attr("x", x(index) + x.bandwidth() / 2)
                        .attr("y", y(d.value) - 30)
                        .attr("text-anchor", "middle")
                        .text(`${barLabel}: ${d.year}`)
                        .style("fill", "red");
                })
                .on("mouseout", function (event, d) {
                    d3.select(this.parentNode).selectAll(".tooltip-box").remove();
                    d3.select(this.parentNode).selectAll(".tooltip-text").remove();
                    d3.selectAll(".tooltip-text").remove();
                    d3.selectAll(".tooltip-box").remove();
                });      
        }

        function circleNodeMouseover() {

            // // Create bars
            var bars = svg.selectAll('.bar')
                .data(mod_data);

            bars.enter()
                .append("rect")
                .attr('class', 'bars')
                .merge(bars)
                .attr('width', x.bandwidth())
                .attr("x", (d, i) => x(i))
                .attr('y', (d) => y(Number(d.value)))
                .attr('height', (d) => containerHeight - y(Number(d.value)) - marginBottom)
                .attr('fill', 'steelblue');

            bars.exit().remove();



            svg.append('path')
                // .attr('stroke-dashoffset', totalLength)
                .transition()
                .duration(100)
                .ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0);



            // Create circles
            const circles = svg.selectAll('.circle-node')
                .data(mod_data);

            circles.enter()
                .append('circle')
                .attr('class', 'circle-nodes')
                .merge(circles)
                .attr('cx', (d, i) => x(i) + x.bandwidth() / 2)
                .attr('cy', d => y(d.value))
                .attr('r', 6)
                .attr('fill', 'red')
                .style('cursor', 'pointer')





                .on("mouseover", function (event, d) {
                    const parent = d3.select(this.parentNode);
                    const circle = d3.select(this);
                    const xPos = parseFloat(circle.attr('cx'));
                    const yPos = parseFloat(circle.attr('cy'));

                    // Calculate tooltip dimensions based on content
                    const valueText = `Value: ${d.value}`;
                    const labelText = `${barLabel}: ${d.year}`;

                    // Calculate text lengths
                    const valueTextWidth = getTextWidth(valueText, "tooltip-text");
                    const labelTextWidth = getTextWidth(labelText, "tooltip-text");

                    const maxTextWidth = Math.max(valueTextWidth, labelTextWidth);

                    const tooltipPadding = 10;
                    const tooltipWidth = maxTextWidth + tooltipPadding * 2;
                    const tooltipHeight = 50;

                    let tooltipX = xPos - 50;
                    let tooltipY = yPos - 80;

                    const svgRect = parent.node().getBoundingClientRect();

                    let tooltip = parent.selectAll(".tooltip-box").data([d]);
                    tooltip.enter()
                        .append("rect")
                        .attr("class", "tooltip-box")
                        .merge(tooltip)
                        .attr("x", tooltipX)
                        .attr("y", tooltipY)
                        .attr("height", tooltipHeight)
                        .attr("width", tooltipWidth)
                        .attr("fill", "lightgrey")
                        .attr("opacity", 0.2)
                        .attr("stroke", "black")
                        .attr("stroke-width", 1)
                        .attr("rx", 4)
                        .attr("ry", 4);

                    let tooltipText = parent.selectAll(".tooltip-text").data([valueText, labelText]);
                    tooltipText.enter()
                        .append("text")
                        .attr("class", "tooltip-text")
                        .merge(tooltipText)
                        .attr("x", tooltipX + tooltipWidth / 2)
                        .attr("y", (d, i) => tooltipY + 20 + i * 20)
                        .attr("text-anchor", "middle")
                        .style("fill", "black")
                        .text(d => d);
                })
                .on("mouseout", function (event, d) {
                    d3.select(this.parentNode).selectAll(".tooltip-box").remove();
                    d3.select(this.parentNode).selectAll(".tooltip-text").remove();
                });

            circles.exit().remove();
        }

        // Function to calculate text width
        function getTextWidth(text, className) {
            const dummyText = svg.append("text")
                .attr("class", className)
                .text(text)
                .style("opacity", 0);
            const width = dummyText.node().getComputedTextLength();
            dummyText.remove();
            return width;
        }

        function zoomed(event) {
            const transform1 = event.transform;
            zoomState = { k: transform1.k, x: transform1.x, y: transform1.y };

            setZoomedData(zoomState)
            d3.selectAll(".tooltip-text").remove();
            d3.selectAll(".tooltip-box").remove();
            svg.selectAll('.bars').remove()

            const delta = event.sourceEvent?.deltaX;
            const newXDomain = x.domain().map(d => { return d });
            const newXScale = x.domain(newXDomain);
            x.range([marginLeft, containerWidth - marginRight].map(d => event.transform.applyX(d)));

            svg.selectAll(".bar")
                .attr("x", (d, i) => x(i))
                .attr("width", x.bandwidth());



            svg.select(".x-axis").call(d3.axisBottom(newXScale))
                .call(d3.axisBottom(x).tickFormat((d, i) => mod_data[i].year))



            svg.selectAll('path').remove()
            svg.selectAll('.circle-nodes ,.square-nodes').remove()
            svg.selectAll('.bar-label').remove()
            svg.selectAll('.x-grid').remove()
            svg.selectAll('.y-grid').remove()
            // svg.selectAll('.domain , line').remove()
            svg.selectAll('.grid').remove();
            if (showLine) {
                const line = d3.line()
                    // .x(d => x(d.year) + x.bandwidth() / 2)
                    .x((d, i) => x(i) + x.bandwidth() / 2)
                    .y(d => y(d.value))

                if (curved_line) {
                    line.curve(d3.curveCatmullRom.alpha(0.5));
                }

                const path = svg.append('path')
                    .datum(mod_data)
                    .attr('fill', 'none')
                    .attr('stroke', 'green')
                    .attr('stroke-width', 2)
                    .attr('d', line)


                if (!show_Square) {
                    squareNodeMouseover()
                }
                else {
                    circleNodeMouseover()

                }
            }
            svg.selectAll('.bar-label')
                .data(mod_data)
                .enter()
                .append('text')
                .attr('class', 'bar-label')
                .attr('x', (d, i) => x(i) + x.bandwidth() / 2 )
                .attr('y', d => y(d.value) - 10)
                .text(d => showValues ? d.value : '')
                .attr('text-anchor', 'middle')
                .attr('fill', d => text_color_arr)
                .style("opacity", 0)
                .transition()
                .duration(500)
                .style("opacity", 1);
            if (showGridenabled) {
                svg.append("g")
                    .selectAll("line")
                    .attr('class', 'x-grid')
                    .data(mod_data)
                    .join("line")
                    .attr("x1", (d , i) => x(i) + x.bandwidth() / 2)
                    .attr("x2", (d , i) => x(i) + x.bandwidth() / 2)
                    .attr("y1", marginTop)
                    .attr("y2", containerHeight - marginBottom)
                    .attr("stroke", "lightgrey");
                svg.insert('g', ':first-child')
                    .attr('class', 'y-grid')
                    .attr('transform', `translate(${marginLeft},${marginTop - marginBottom + 10})`)
                    .call(d3.axisLeft(y)
                        .tickSize(-(mod_data.length * temp_barWidth - marginLeft - marginRight))
                        .tickFormat('')
                        .ticks(5)
                    )
                svg.selectAll('.y-grid .tick line')
                    .attr('class', 'y-grid-line')
                    .attr('stroke', 'lightgrey')
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
            svgContainer.call(zoom.transform, d3.zoomIdentity);
            svg.attr("width", containerWidth);

            svg.selectAll(".bar")
                .attr("x", (d, i) => x(i))
                .attr("width", x.bandwidth())

            svg.select(".x-axis").call(d3.axisBottom(x).tickFormat((d, i) => mod_data[i].year));

            svg.select(".y-axis").call(d3.axisLeft(y));

            svg.selectAll('path').remove();
            svg.selectAll('.circle-node, .square-node').remove();
            svg.selectAll('.bar-label').remove();
            svg.selectAll('.x-grid').remove();
            svg.selectAll('.y-grid').remove();
            svg.selectAll('.domain, line').remove();
            svg.selectAll('.grid').remove();
            if (showLine) {
                const line = d3.line()
                    .x((d, i) => x(i) + x.bandwidth() / 2)
                    .y(d => y(d.value));
                if (curved_line) {
                    line.curve(d3.curveCatmullRom.alpha(0.5));
                }

                svg.append('path')
                    .datum(mod_data)
                    .attr('fill', 'none')
                    .attr('stroke', props.chart_color)
                    .attr('stroke-width', 2)
                    .attr('d', line);
                if (!show_Square) {
                    squareNodeMouseover();
                } else {
                    circleNodeMouseover();
                }
            }
            svg.selectAll('.bar-label')
                .data(mod_data)
                .enter()
                .append('text')
                .attr('class', 'bar-label')
                .attr('x', (d, i) => x(i) + x.bandwidth() / 2)
                .attr('y', d => y(d.value) - 5)
                .text(d => showValues ? d.value : '')
                .attr('text-anchor', 'middle');
            if (showGridenabled) {
                svg.append("g")
                    .selectAll("line")
                    .data(mod_data)
                    .join("line")
                    .attr('class', 'x-grid')
                    .attr("x1", d => x(d.year) + x.bandwidth() / 2)
                    .attr("x2", d => x(d.year) + x.bandwidth() / 2)
                    .attr("y1", marginTop)
                    .attr("y2", containerHeight - marginBottom)
                    .attr("stroke", "lightgrey");

                svg.insert('g', ':first-child')
                    .attr('class', 'y-grid')
                    .attr('transform', `translate(${marginLeft},${marginTop - marginBottom + 10})`)
                    .call(d3.axisLeft(y)
                        .tickSize(-(mod_data.length * temp_barWidth - margin.left - margin.right))
                        .tickFormat('')
                        .ticks(5)
                    );

                svg.selectAll('.y-grid .tick line')
                    .attr('class', 'y-grid-line')
                    .attr('stroke', 'lightgrey');
            }
        };
        document.getElementById(`togglereset-${i}`).addEventListener('click', function () {
            handleResetButtonClick();
        });
    }, [y_axis_key, chart_data, containerWidth, BarWidth, containerHeight, data, barColor, mouseoverEnabled, showLine, enabledTable, chartHeight, barYLabel, temp_containerWidth, fullScreen_enabled, temp_containerHeight, sortData, showValues, showGridenabled, barLabel, resized, enable_table, svgHeight, show_Square, curved_line, SortArr, text_color_arr])

    const handleMenuClick = (e) => {
        setShowOptions(!showOptions);
    };

    const handleSortIconClick = (e) => {
        setSortShowOptions(!sortShowOptions)
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
        dispatch(verticalBar({ data: chart_data, chart_id: i }));
        setSortData([...chart_data]);

    };

    const showTableFunc = async (val1) => {
        var val = true
        if (val1) {
            setEnabledTable(true)
            await tabulate(data, tableColumns)
        }

    }

    const tabulate = async (data, columns, y_axis_name) => {
        y_axis_name = y_axis_name ? y_axis_name : yLabelname;
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
            .style("width", `${fullScreen_enabled ? temp_containerWidth : (props.containerWidth)}px`)

        var thead = table.append("thead");
        var tbody = table.append("tbody");

        d3.select(tableContainer)
            .attr('class', 'table_body')
            .style("width", `${fullScreen_enabled ? temp_containerWidth : (props.containerWidth)}px`)
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
        <div>
            <div id={`tooltip${i}`} style={{ position: 'absolute', opacity: 0, background: 'lightgray', padding: '10px', borderRadius: '5px' }}></div>
            {chartsLoad ?
                <>
                    <div className="chart-container" >
                        <div id={`my_dataviz${i}`} style={{ maxWidth: '100%', }} onMouseLeave={() => { setShowOptions(false); setSortShowOptions(false); }}>
                            <svg ref={chartRef} width={(fullScreen_enabled ? (BarWidth === undefined ? temp_containerWidth : chartWidth) : chartWidth)} height={(fullScreen_enabled ? temp_containerHeight : containerHeight)}>
                            </svg>
                        </div>
                    </div>
                </>
                :
                <>
                    <Spinner
                        color="primary"
                        className="chartLoader"
                    >
                        Loading...
                    </Spinner>
                </>
            }
            <div className="legend" id={`legend${i}`} style={{ position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'centre', marginLeft: (fullScreen_enabled ? temp_containerWidth : containerWidth) / 2, marginTop: enable_table ? (fullScreen_enabled ? '-80px' : '-40px') : '-40px', boxShadow: 'none' }}></div>
            {showOptions && (
                <div
                    className="download-options"
                    style={{
                        position: 'absolute',
                        top: '46px',
                        right: '70px',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        color: '#000080',
                        padding: '5px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        cursor: 'pointer',
                        justifyContent: 'center'
                    }}
                    onMouseOver={(e) => { e.target.style.color = 'green'; setShowOptions(true); }} onMouseOut={(e) => e.target.style.color = 'blue'}
                >
                    <p onClick={() => handleDownloadBar('0', datakeys_name, datakeys, data)}>Download as CSV</p>
                    <p onClick={() => imgDownloadSvg(`my_dataviz${i}`)}>Download as SVG</p>
                    <p onClick={() => imgDownloadPng(i)} className='mt-1'>Download as PNG</p>
                </div>
            )}
            <span onMouseOver={() => { handleSortIconClick(); setShowOptions(false); }} onMouseOut={() => { setSortShowOptions(false) }}>
                <i
                    className="bx bx-sort"
                    style={{
                        cursor: 'pointer',
                        fontSize: '20px',
                        width: '30px',
                        height: '50px',
                        position: 'absolute',
                        top: '9px',
                        right: '100px',
                        zIndex: '1',
                        color: '#6666B2',
                    }}
                ></i>
            </span>
            <i className="bx bx-reset"
                style={{
                    cursor: 'pointer',
                    fontSize: '20px',
                    width: '35px',
                    position: 'absolute',
                    top: '9px',
                    right: '260px',
                    zIndex: '1',
                    color: '#6666B2',
                }}
                id={`togglereset-${i}`}
            ></i>
            <span onMouseOver={() => { handleMenuClick(); setSortShowOptions(false); }} >
                <i
                    className="bx bx-download"
                    style={{
                        cursor: 'pointer',
                        fontSize: '25px',
                        width: '40px',
                        height: '50px',
                        position: 'absolute',
                        top: '7px',
                        right: '60px',
                        zIndex: '1',
                        color: '#6666B2',
                    }}

                    onMouseOver={() => { handleMenuClick(); setSortShowOptions(false); }}
                    onMouseUp={() => { setShowOptions(false); }}
                ></i>
            </span>

            {sortShowOptions && (
                <div
                    className="download-options"
                    style={{
                        position: 'absolute',
                        top: '45px',
                        right: '116px',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        color: '#000080',
                        padding: '5px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                    }}

                    onMouseOver={(e) => { e.target.style.color = 'green'; setSortShowOptions(true) }} onMouseOut={(e) => e.target.style.color = 'blue'}
                >
                    <p onClick={() => handleSortAscending('ascending')}>Sort Ascending</p>
                    <p onClick={() => handleSortDescending('descending')}>Sort Descending</p>
                    <p onClick={() => handleSortDefault('default')} >Default Sorting</p>

                </div>
            )}

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
        </div >
    );
};

export default BarChart;