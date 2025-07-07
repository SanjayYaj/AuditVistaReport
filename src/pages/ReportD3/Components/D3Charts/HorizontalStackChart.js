import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'reactstrap';
import '../../LayoutInfo.css'
import { retriveClnPrimaryValue, setResetCharts, updateLayoutInfo, toggleProcessingState } from '../../../../Slice/reportd3/reportslice';


const HorizontalStackChart = (props) => {
  const dispatch = useDispatch();
  var containerWidth = props.containerWidth
  var containerHeight = props.containerHeight
  var chart_data = props.chart_data
  var chart_color = props.chart_color
  var i = props.id
  var show_bar_values = props.show_bar_values
  var mouseovered = props.mouseovered
  var mouseovered_type = props.mouseovered_type
  var enable_table = props.show_table
  var svgHeight = props.chart_height
  var show_Grid = props.show_Grid
  var temp_containerWidth = props.temp_containerWidth
  var temp_containerHeight = props.temp_containerHeight
  var fullScreen_enabled = props.show_Full_Screen_toggle
  var curved_line = props.curved_line;
  var show_Square = props.show_Square !== undefined &&  props.show_Square === 'square' ? true : false
  var YLabel = props.YLabel
  var BarWidth = props.BarWidth
  var text_color_arr = props.text_color
  var barLabel = props.label;
  var dataRetreived = props.itemInfo
  var calc = props.math_calc

  var show_Legend = props.show_Legend

  const [data, setData] = useState([]);
  const [textColorBar, setTextColorBar] = useState([])
  const [showOptions, setShowOptions] = useState(false)
  const [showValues, setShowValues] = useState(show_bar_values);
  const [mouseoverEnabled, setMouseoverEnabled] = useState(mouseovered)
  const [mouseoverSwitchType, setMouseoverSwitchType] = useState(mouseovered_type)
  const [enabledTable, setEnabledTable] = useState(enable_table)
  const [showGridEnabled, setShowGridEnabled] = useState(show_Grid);
  const [sortShowOptions, setShowSortoption] = useState(false);
  const [showLine, setShow_Line] = useState(showline)
  // const reportSlice = useSelector(state => state.reportSliceReducer);
  const [sortData, setSortData] = useState([]);
  const [processing, setProcessing] = useState(false)
  var showline = props.show_Line
  const [chartsLoad, setChartsLoad] = useState(true)

  // const dbInfo = {
  //   encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@65.0.69.57:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
  //   db_name: 'hotel_surguru-beta',
  // }

  const reportSlice = useSelector(state => state.reportSliceReducer)
  const ProcessedID = reportSlice.processingData[props.id]


  const AuthSlice = useSelector(state => state.auth);
  const dbInfo = AuthSlice.db_info
  useEffect(() => {
    console.log("81 Hor Stack chart", dataRetreived);
    if (ProcessedID === undefined) {

      if (dataRetreived?.yAxis_arr !== undefined && dataRetreived.data === undefined || dataRetreived.chnaged) {
        setProcessing(true)
        dispatch(toggleProcessingState(dataRetreived.i))
        setChartsLoad(false)
        LoadedData(dataRetreived.x_axis_key.name, '1')
      }
      else if (dataRetreived?.filtered_data !== undefined) {
        setData(dataRetreived?.filtered_data)
        setChartsLoad(true)
      }
      else {
        setData(chart_data)
        setChartsLoad(true)
      }
    }

    if (ProcessedID) {
      console.log('106 Already Retyrteived Data ', dataRetreived)
      if (dataRetreived?.filtered_data !== undefined) {
        setData(dataRetreived?.filtered_data)
        setChartsLoad(true)
      }
      else if (reportSlice.layoutInfo[props.indexes].configured && dataRetreived.data?.[0] !== undefined ) {
        setData(dataRetreived.data)
        setChartsLoad(true)
      }
      else {
        setData(dataRetreived.data)
        setChartsLoad(true)
      }


      // if (props.show_table) {
      //   show_table_fn(true, dataRetreived.data)
      // }
      // else {
      //   show_table_fn(false)
      // }


    }

  }, [props , dataRetreived])


    useEffect(() => {
    if (chart_data !== undefined && chart_data.length > 0) {
      // setData(chart_data)
      setTextColorBar(chart_color)
      setShowValues(show_bar_values)
      setMouseoverEnabled(mouseovered)
      setMouseoverSwitchType(mouseovered_type)
      setEnabledTable(enable_table)
      setShowGridEnabled(show_Grid)
      setShow_Line(showline)
    }
  }, [chart_data, chart_color, show_bar_values, mouseovered, mouseovered_type, enable_table, show_Grid, temp_containerWidth, fullScreen_enabled, temp_containerHeight, showline]) 


  const LoadedData = async (value, mode, indx) => {
    console.log('Hor  Stack value , mode :>> ', value, mode, indx);
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
          dateFields: AuthSlice?.dateRangeField ,
          CalculationArr: dataRetreived.CalculationArr,




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
        console.log('response 108 Hor stack :>> ', response);

        if (response.status === 200) {

          if (response.data.data.length > 0) {

            // if (mode === "1") {

              var updating_layObj = { ...dataRetreived };

              updating_layObj.data = response.data.data;
              updating_layObj.chnaged = false;
              updating_layObj.configured = true

              setData(response.data.data)
              var layoutArr = [...reportSlice.layoutInfo]

              // Update the specific index by merging properties properly
              layoutArr[props.indexes] = {
                ...layoutArr[props.indexes],
                ...updating_layObj // Spread the properties of updating_layObj directly
              };

              console.log('layoutArr  after:>> ', layoutArr, " layoutArr[props.indexes]", layoutArr[props.indexes]);
              console.log('reportSlice  after updation:>> ', reportSlice.layoutInfo);
              setChartsLoad(true)
              dispatch(
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

            setData([])
            var layoutArr = [...reportSlice.layoutInfo]

            // Update the specific index by merging properties properly
            layoutArr[props.indexes] = {
              ...layoutArr[props.indexes],
              ...updating_layObj // Spread the properties of updating_layObj directly
            };


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

//   if (data && Array.isArray(data) && data?.length > 0) {
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
  //   console.log('data 278', data, dataRetreived);
  //   if (dataRetreived.data[0][calc][0] !== undefined) {
  //     var datakeys = Object.keys(dataRetreived.data[0][calc] !== undefined ? dataRetreived.data[0][calc][0] : dataRetreived.data[0]).filter(key => key !== 'name' && key !== "_id");
  //     console.log('datakeys 280:>> ', datakeys);
  //   }
  // }
  // else {
  //   console.log('data 284', props.chart_data);
  //   var datakeys = Object.keys( props.chart_data.length > 0 &&  props.chart_data[0] ).filter(key => key !== 'name' && key !== "_id");
  //   console.log('datakeys 293:>> ', datakeys);
  // }

  const margin = { top: 70, right: 80, bottom: 80, left:  80 };


  useEffect(() => {
    // const data = chart_data;
    // const chartArea = d3.select(`#ChartArea${i}`);
    // const noDataDiv = chartArea.select(`#no-data-message-${i}`);

    if (datakeys !== undefined && datakeys.length > 0 ) {
      var mod_data;
      var chart_id = i;
      if (reportSlice[chart_id] && reportSlice[chart_id].horstack) {
        mod_data = reportSlice[chart_id].horstack;
      } else if (reportSlice.layoutInfo[props.indexes]?.configured && reportSlice.layoutInfo[props.indexes].data?.[0]) {
        mod_data = reportSlice.layoutInfo[props.indexes].data
      }
      else {
        mod_data = chart_data
      }


      if (reportSlice.layoutInfo[props.indexes]?.filtered_data) {
        mod_data = reportSlice.layoutInfo[props.indexes]?.filtered_data
      }





      
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
        containerHeight = height + margin.bottom
      } else {
        width = containerWidth - margin.left - margin.right;
        height = containerHeight - margin.top - margin.bottom;
      }
      const temp_barHeight = BarWidth !== undefined ? Number(BarWidth) : 45;
      const marginTop = margin.top;
      const marginRight = margin.right;
      const marginBottom = margin.bottom;
      const marginLeft = margin.left;
      d3.selectAll(`#tooltip${i}`).remove()
      d3.selectAll(`.x-axis${i}`).remove()
      d3.selectAll(`.top-layer${i}`).remove()

      const extent = [
        [marginLeft, marginTop], // Top-left corner
        [marginLeft, containerHeight - marginBottom] // Bottom-left corner
      ];
      console.log("Hor Stack Mod mod_data ", mod_data);



      if (mod_data.length > 0) {


        // Clear the "No data available" message if it exists
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
          .range([containerHeight - marginBottom, marginTop])
          .padding(0.1);

        const xScale = d3.scaleLinear()
          .domain([0, d3.max(mod_data, d => d3.sum(datakeys.map(key => d[key])))])
          .nice()
          .range([0, width]);

        const text_color = d3.scaleOrdinal()
          .domain(datakeys)
          .range(text_color_arr !== undefined && text_color_arr.length > 0
            ? text_color_arr
            : d3.quantize(d3.interpolateRainbow, datakeys.length + 2));

        const g = svg.select('g');
        g.selectAll('*').remove();
        g.attr('transform', `translate(${margin.left},${margin.bottom - margin.top - 10})`);

        const color = d3.scaleOrdinal()
          .domain(datakeys)
          .range((textColorBar !== '' && textColorBar !== undefined && textColorBar.length > 0) ? textColorBar : ['red', 'blue', 'green', 'orange', 'purple', 'cyan']);

        const stack = d3.stack().keys(datakeys)
        const series = stack(mod_data);

        const tooltip = d3.select(fullScreen_enabled ? `#my_dataviz${i}` : 'body')
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "1px")
          .style("border-radius", "5px")
          .style("padding", "10px");

        const newWidth = Math.max(temp_barHeight + margin.bottom + margin.top, containerWidth);

        const bars = g.selectAll('g')
          .data(series)
          .enter().append('g')
          .attr('fill', (d, i) => {
            var colorToUse = (chart_color?.length > 0 ? (chart_color[i] != undefined) ? chart_color[i] : chart_color[i + 1] : color(d.key));
            return colorToUse;
          })
          .selectAll('rect')
          .data(d => d)
          .enter().append('rect')
          .attr('y', d => yScale(d.data.name))
          .attr('x', 0)
          .attr('width', 0)
          .attr('height', yScale.bandwidth())
          .style('cursor', 'pointer')
          .on("mouseover", multi_mouseover)
          .on("mousemove", multi_mouseover)
          .on('mouseleave', multi_mouseleave)
          .on("mouseout", multi_mouseout)

          // bars.transition()
          //   .duration(1000)
          .attr('x', d => xScale(d[0]))
          .attr('width', d => xScale(d[1]) - xScale(d[0]));

        d3.select(`#my_dataviz${i}`).selectAll(" .x-axis").remove()

        const mainSvg = d3.select(`#my_dataviz${i}`).select('svg');

        // Append the X-axis to the main SVG
        const xAxisGroup = mainSvg.append("g")
          .attr("class", `x-axis${i}`)
          .attr("transform", `translate(${margin.left}, ${containerHeight - margin.bottom})`)
          .call(d3.axisBottom(xScale).ticks())
          .call(g => {
            g.selectAll('.domain, text')
              .attr('stroke', fullScreen_enabled ? 'black' : 'black')
              .style("font-size", '10px');
          });

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

        if (showLine) {
          createLineChart(data, datakeys, props.chart_color);
        }
        function createLineChart(data, keys, colors) {
          const filteredKeys = keys.filter(key => data.some(item => item[key] !== 0));

          const stack = d3.stack().keys(filteredKeys);
          const series = stack(mod_data);

          const chartContainer = d3.select(`#my_dataviz${i}`).node();
          const chartContainerRect = chartContainer?.getBoundingClientRect();
          const containerWidth = chartContainerRect?.width;
          const containerHeight = chartContainerRect?.height;

          filteredKeys?.forEach((key, index) => {
            const lineGenerator = d3.line()
              .x(d => xScale(d[1]))
              .y(d => yScale(d.data.name) + yScale.bandwidth() / 2);

            if (curved_line) {
              lineGenerator.curve(d3.curveCardinal);
            }

            g.append('path')
              .datum(series?.[index])
              .attr('class', `line-${key}`)
              .attr('d', lineGenerator)
              .attr('fill', 'none')
              .attr('stroke', 'black')
              .attr('stroke-width', 2.5)
              .attr('stroke-dasharray', '5,5');

            series[index].forEach((point, pointIndex) => {
              const x = xScale(point[1]);
              const y = yScale(point.data.name) + yScale.bandwidth() / 2;

              function showTooltip(event, d) {
                const tooltipWidth = 120; // Width of the tooltip
                const tooltipHeight = 50; // Height of the tooltip

                // Get the SVG container dimensions and position
                const svgContainer = d3.select(`#my_dataviz${i}`);
                const svgRect = svgContainer.node().getBoundingClientRect();
                const svgX = svgRect.left;
                const svgY = svgRect.top;
                const svgWidth = svgRect.width;
                const svgHeight = svgRect.height;

                // Calculate the tooltip's initial position
                let tooltipX = event.pageX + 50; // Default to the right of the cursor
                let tooltipY = event.pageY - tooltipHeight - 50; // Default above the cursor

                // Adjust tooltipX if it goes beyond the right margin
                if (tooltipX + tooltipWidth > svgX + svgWidth - margin.right) {
                  tooltipX = event.pageX - tooltipWidth - 100;
                }

                // Adjust tooltipX if it goes beyond the left margin
                if (tooltipX < svgX + margin.left) {
                  tooltipX = event.pageX + 10;
                }

                // Adjust tooltipY if it goes beyond the bottom margin
                if (tooltipY + tooltipHeight > svgY + svgHeight - margin.bottom) {
                  tooltipY = event.pageY - tooltipHeight - 10;
                }

                // Adjust tooltipY if it goes beyond the top margin
                if (tooltipY < svgY + margin.top) {
                  tooltipY = event.pageY + 10;
                }

                // Create or select the tooltip
                let tooltip = d3.selectAll(fullScreen_enabled ? `#tooltip${i}` : '#tooltip');
                if (tooltip.empty()) {
                  tooltip = d3.select(fullScreen_enabled ? `#my_dataviz${i}` : 'body').append('div')
                    .attr('id', 'tooltip')
                    .attr('class', 'tooltip')
                    .style('position', 'absolute')
                    .style('background-color', 'white')
                    .style('border', '1px solid black')
                    .style('padding', '5px')
                    .style('opacity', 0);
                }

                // Update tooltip content and position
                tooltip.html(`<div>Value: ${(d[1] - d[0]).toFixed(2)}</div><div>${barLabel}: ${d.data.name}</div>`)
                  .style("left", `${tooltipX}px`)
                  .style("top", `${tooltipY}px`)
                  .style('opacity', 0.9);
              }

              if (show_Square) {
                g.append('rect')
                  .datum(point)
                  .attr('class', `node-${key}`)
                  .attr('x', x - 5)
                  .attr('y', y - 5)
                  .attr('width', 10)
                  .attr('height', 10)
                  .attr('fill', "pink")
                  .on('mouseover', showTooltip)
                  .on('mousemove', showTooltip)
                  .on('mouseout', function () {
                    d3.select('#tooltip')
                      .style('opacity', 0);
                  });
              } else {
                g.append('circle')
                  .datum(point)
                  .attr('class', `node-${key}`)
                  .attr('cx', x)
                  .attr('cy', y)
                  .attr('r', 5)
                  .attr('fill', "green")
                  .on('mouseover', showTooltip)
                  .on('mousemove', showTooltip)
                  .on('mouseout', function () {
                    d3.select('#tooltip')
                      .style('opacity', 0);
                  });
              }
            });
          });
        }

        g.selectAll('g')
          .data(series)
          .selectAll('text')
          .data(d => d)
          .enter().append('text')
          .attr('x', d => xScale(d[1]) + (xScale(d[0]) - xScale(d[1])) / 2)
          .attr('y', d => yScale(d.data.name) + yScale.bandwidth() / 2)
          .text(d => d3.format(",")((d[1] - d[0]).toFixed(2)))
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .style('fill', 'black')
          .style("display", function () {
            return showValues ? "block" : "none";
          });

        const textGroup = g.selectAll('g');
        const renderText = () => {
          textGroup.selectAll('text').remove();
          series.forEach((seriesData, seriesIndex) => {
            textGroup.selectAll(`.text-${seriesIndex}`)
              .data(seriesData)
              .enter().append('text')
              .attr('class', `text-${seriesIndex}`)
              .attr('x', d => xScale(d[1]) + (xScale(d[0]) - xScale(d[1])) / 2)
              .attr('y', d => yScale(d.data.name) + yScale.bandwidth() / 2)
              .text(d => d3.format(",")((d[1] - d[0]).toFixed(2)))
              .attr('text-anchor', 'middle')
              .attr('dy', '0.35em')
              .style('fill', text_color(datakeys[seriesIndex]))
              .style("display", function () {
                return showValues ? "block" : "none";
              });
          });
        };

        renderText();

        if (show_Grid) {
          g.insert('g', ':first-child')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${containerHeight - marginBottom})`)
            .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''))
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

        // const axisLabels =
        //   g.append('g')
        //     .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => typeof d === 'string' ? d.toUpperCase() : d))
        //     .selectAll(' text')
        //     .attr('stroke', 'Black')
        //     .style("font-size", '11px')
        //     .style("font-style", "normal")
        //     .style('cursor', 'pointer')

        // let rotationAngle = 0;
        // axisLabels.each(function (_, i) {
        //   const label = this;
        //   d3.select(label).on('click', function () {
        //     const currentRotation = rotationAngle === 0 ? -45 : 0;
        //     const currentAnchor = rotationAngle === 0 ? 'end' : "middle";
        //     axisLabels.attr('transform', `rotate(${currentRotation})`)
        //       .style("text-anchor", 'end')
        //     rotationAngle = currentRotation;
        //   });
        // });

        const charLimit = 5;
        const axisLabels =
          g.append('g')
            .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => typeof d === 'string' ? d.toUpperCase() : d))
            .selectAll(' text')
            .attr('fill', 'Black')
            .style("font-size", '11px')
            .style("font-style", "normal")
            .style('cursor', 'pointer')
            .text(function (d) {
              if (!d || typeof d !== 'string') {
                return "(blank)";
              }
              return d.length > charLimit ? `${d.substring(0, charLimit)}...` : d;
            });



        const ToolTip = d3.select('body').append('div')
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
          ToolTip.style('visibility', 'visible')
            .text(tooltipText);
        })
          .on('mousemove', function (event) {
            ToolTip.style('top', `${event.pageY + 10}px`)
              .style('left', `${event.pageX + 10}px`);
          })
          .on('mouseleave', function () {
            ToolTip.style('visibility', 'hidden');
          })
          .on('mouseout', function () {
            ToolTip.style('visibility', 'hidden');
          });

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

        if (enabledTable) {
          show_table_fn(true)
        }
        else {
          show_table_fn(false)
        }

        function multi_mouseover(event, d) {
          d3.select(`#tooltip${i}`).remove()
          if (mouseoverEnabled) {
            var chartContainer = d3.select(`#my_dataviz${i}`).node();
            var chartContainerRect = chartContainer.getBoundingClientRect();

            if (mouseoverSwitchType) {
              d3.selectAll(`.tooltip`).remove()

              var totalValue = d3.sum(datakeys.map(key => d.data[key]));
              d3.select(this)
              let tooltipContent = `<span style="color:red;">${barLabel}:</span> ${d.data.name}<br>`;
              datakeys.forEach(key => {
                tooltipContent += `<span style="color:red;">${key}:</span> <span style="color:black;">${d.data[key]?.toFixed(2)}</span><br>`;
              });
              tooltipContent += `<span style="color:red;">Total:</span> <span style="color:black;">${totalValue?.toFixed(2)}</span>`;

              // const tooltip = d3.select(fullScreen_enabled ? `#my_dataviz${i}` : 'body')
              const tooltip = d3.select(`#my_dataviz${i}`)
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("opacity", 0);

              tooltip.html(tooltipContent).style("opacity", 1);


              var divX = chartContainerRect.left + window.scrollX;
              var divY = chartContainerRect.top + window.scrollY;


              // Calculate tooltip dimensions
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

              tooltip.style("left", leftPosition + "px").style("top", topPosition + "px");
            } else {
              d3.selectAll(`.tooltip`).remove()


              var subgroupName = d3.select(this.parentNode).datum().key;
              var subgroupValue = d.data[subgroupName];

              const tooltip = d3.select(`#my_dataviz${i}`)
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("opacity", 0);

              tooltip.html("Label: " + d.data.name + "<br>" + "Value: " + (subgroupValue.toFixed(2))).style("opacity", 1);


              var divX = chartContainerRect.left + window.scrollX;
              var divY = chartContainerRect.top + window.scrollY;


              // Calculate tooltip dimensions
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
              // Position the tooltip
              tooltip.style("left", leftPosition + "px").style("top", topPosition + "px");
            }
          }
        }




        function multi_mouseout() {
          const tooltip = d3.selectAll(`#tooltip${i}`).remove()
          tooltip.transition().duration(100)
            .remove()
          // .style("opacity", 0);
        }

        function multi_mouseleave() {
          d3.select(this)
            .attr('class', 'stack-group')
            .style('fill-opacity', 1)
            .style('stroke', 'none');
          tooltip
            // .style("opacity", 0)
            .remove()
          d3.selectAll(`.tooltip`).remove()
        }

        // Define the initial clip path
        svg.append("clipPath")
          .attr("id", 'clip')

          .append("rect")
          .attr("width", containerWidth)
          .attr("height", containerHeight - margin.bottom);

        function zoomed(event) {
          const newYDomain = yScale.domain().map(d => d);
          const newYScale = yScale.domain(newYDomain);
          const newBarHeight = temp_barHeight / event.transform.k;
          // yScale.range([containerHeight - marginBottom, marginTop].map(d => event.transform.applyY(d)));

          yScale.range(initialYRange.map(d => event.transform.applyY(d)));
          g.selectAll('*').remove()

          var clipId = `clip-${i}`

          // Re-apply the clip path
          g.append("clipPath")
            .attr("id", clipId)

            .append("rect")
            .attr("width", containerWidth)
            .attr("height", containerHeight - margin.bottom);



          g.selectAll('g')
            .data(series)
            .enter().append('g')
            // .attr('fill', d => color(d.key))

            .attr('fill', (d, i) => {
              var colorToUse = (chart_color?.length > 0 ? (chart_color[i] != undefined) ? chart_color[i] : chart_color[i + 1] :  color(d.key));
              return colorToUse;
            })
            .selectAll('rect')
            .data(d => d)
            .enter().append('rect')
            // .attr('clip-path', 'url(#clip)')
            .attr('clip-path', `url(#${clipId})`)
            .attr('y', d => yScale(d.data.name))

            .attr('x', d => xScale(d[0]))
            .attr('width', d => xScale(d[1]) - xScale(d[0]))
            .attr('height', yScale.bandwidth())

            .style('cursor', 'pointer')
            .on("mouseover", multi_mouseover)
            .on("mousemove", multi_mouseover)
            .on("mouseleave", multi_mouseleave)
            .on("mouseout", multi_mouseout)

          // const axisLabels =
          //   g.append('g')
          //     .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => typeof d === 'string' ? d.toUpperCase() : d))
          //     .selectAll(' text')
          //     .attr('stroke', 'Black')
          //     .style("font-size", '11px')
          //     .style("font-style", "normal")


          // let rotationAngle = 0;
          // axisLabels.each(function (_, i) {
          //   const label = this;
          //   d3.select(label).on('click', function () {
          //     const currentRotation = rotationAngle === 0 ? -45 : 0;
          //     const currentAnchor = rotationAngle === 0 ? 'end' : "middle";
          //     axisLabels.attr('transform', `rotate(${currentRotation})`)
          //       .style("text-anchor", 'end')
          //     rotationAngle = currentRotation;
          //   });
          // })
          const charLimit = 5;
          const axisLabels =
            g.append('g')
              .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => typeof d === 'string' ? d.toUpperCase() : d))
              .selectAll(' text')
              .attr('fill', 'Black')
              .style("font-size", '11px')
              .style("font-style", "normal")
              .style('cursor', 'pointer')
              .text(function (d) {
                if (!d || typeof d !== 'string') {
                  return "(blank)";
                }
                return d.length > charLimit ? `${d.substring(0, charLimit)}...` : d;
              });



          const ToolTip = d3.select('body').append('div')
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
            ToolTip.style('visibility', 'visible')
              .text(tooltipText);
          })
            .on('mousemove', function (event) {
              ToolTip.style('top', `${event.pageY + 10}px`)
                .style('left', `${event.pageX + 10}px`);
            })
            .on('mouseleave', function () {
              ToolTip.style('visibility', 'hidden');
            })
            .on('mouseout', function () {
              ToolTip.style('visibility', 'hidden');
            });



          g.selectAll('g')
            .data(series)
            .selectAll('text')
            .data(d => d)
            .enter().append('text')
            // .attr('clip-path', 'url(#clip)')

            .attr('clip-path', `url(#${clipId})`)
            .attr('x', d => xScale(d[1]) + (xScale(d[0]) - xScale(d[1])) / 2)
            .attr('y', d => yScale(d.data.name) + yScale.bandwidth() / 2)
            .text(d => d3.format(",")((d[1] - d[0]).toFixed(2)))
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('fill', 'black')
            .style("display", function () {
              return showValues ? "block" : "none";
            });

          if (show_Grid) {
            g.insert('g', ':first-child')
              .attr('class', 'grid')

              .attr('transform', `translate(0, ${containerHeight - marginBottom})`)
              .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''))
              .selectAll('line')
              .attr('stroke', 'red');

            g.insert('g', ':first-child')
              .attr('class', 'grid')
              // .attr('clip-path', 'url(#clip)')
              .attr('clip-path', `url(#${clipId})`)

              .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(''))
              .selectAll('line')
              .attr('stroke', 'lightgrey');

          } else {
            g.selectAll('.grid').remove();
          }

          if (showLine) {
            createLineChart(data, datakeys, props.chart_color);
          }

          function createLineChart(data, keys, colors) {
            const stack = d3.stack().keys(keys);
            const series = stack(mod_data);

            keys.forEach((key, index) => {
              const lineGenerator = curved_line ?
                d3.line().curve(d3.curveCardinal) :
                d3.line();

              lineGenerator.x(d => xScale(d[1]))
                .y(d => yScale(d.data.name) + yScale.bandwidth() / 2);

              g.append('path')
                // .attr('clip-path', 'url(#clip)')
                .attr('clip-path', `url(#${clipId})`)

                .datum(series[index])
                .attr('class', `line-${key}`)
                .attr('d', lineGenerator)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 2.5)
                .attr('stroke-dasharray', '5,5');

              series[index].forEach((point, pointIndex) => {
                const x = xScale(point[1]);
                const y = yScale(point.data.name) + yScale.bandwidth() / 2;

                if (show_Square) {
                  g.append('rect')
                    // .attr('clip-path', 'url(#clip)')
                    .attr('clip-path', `url(#${clipId})`)

                    .datum(point)
                    .attr('class', `node-${key}`)
                    .attr('x', x - 5)
                    .attr('y', y - 5)
                    .attr('width', 10)
                    .attr('height', 10)
                    .attr('fill', "pink")
                    .on('mouseover', function (event, d) {
                      const tooltipX = event.pageX + 10;
                      const tooltipY = event.pageY - 50;
                      let tooltip = d3.selectAll(fullScreen_enabled ? `#tooltip${i}` : '#tooltip');
                      if (tooltip.empty()) {
                        tooltip = d3.select(fullScreen_enabled ? `#my_dataviz${i}` : 'body').append('div')
                          .attr('id', 'tooltip')
                          .attr('class', 'tooltip')
                          .style('position', 'absolute')
                          .style('background-color', 'white')
                          .style('border', '1px solid black')
                          .style('padding', '5px')
                          .style('opacity', 0);
                      }
                      tooltip.html(`Value: ${(d[1] - d[0]).toFixed(2)}, ${barLabel}: ${d.data.name}`)
                        .style("left", ` ${fullScreen_enabled ? event.offsetX - 10 : event.pageX - 10}px`)
                        .style("top", `${fullScreen_enabled ? event.offsetY - 50 : event.pageY - 50}px`)
                        .style('opacity', 0.9).raise()
                    })
                    .on('mouseout', function (event, d) {
                      d3.select('#tooltip')
                        .style('opacity', 0);
                    });
                } else {
                  g.append('circle')
                    .datum(point)
                    .attr('class', `node-${key}`)
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', 5)
                    .attr('fill', "green")
                    .on('mouseover', function (event, d) {
                      const tooltipX = event.pageX + 10;
                      const tooltipY = event.pageY - 50;
                      let tooltip = d3.selectAll(fullScreen_enabled ? `#tooltip${i}` : '#tooltip');
                      if (tooltip.empty()) {
                        tooltip = d3.select(fullScreen_enabled ? `#my_dataviz${i}` : 'body').append('div')
                          .attr('id', 'tooltip')
                          .attr('class', 'tooltip')
                          .style('position', 'absolute')
                          .style('background-color', 'white')
                          .style('border', '1px solid black')
                          .style('padding', '5px')
                          .style('opacity', 0);
                      }
                      tooltip.html(`<div>Value: ${(d[1] - d[0]).toFixed(2)}</div><div>${barLabel}: ${d.data.name}</div>`)
                        .style("left", ` ${fullScreen_enabled ? event.offsetX - 10 : event.pageX - 10}px`)
                        .style("top", `${fullScreen_enabled ? event.offsetY - 50 : event.pageY - 50}px`)
                        .style('opacity', 0.9);
                    })
                    .on('mouseout', function (event, d) {
                      d3.select('#tooltip')
                        .style('opacity', 0);
                    });
                }
              });
            });
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
          const newYScale = yScale.domain(initialYDomain).range(initialYRange)
          // yScale.range(initialYRange);
          const newXDomain = [0, d3.max(mod_data, d => d3.sum(datakeys.map(key => d[key])))];
          // const newXScale = xScale.domain(newXDomain).range([0, containerWidth - marginLeft - marginRight]);
          const newXScale = xScale.domain(initialXDomain).range(initialXRange);
          g.selectAll('*').remove();
          g.selectAll('g')
            .data(series)
            .enter()
            .append('g')
            .attr('fill', d => color(d.key))
            .selectAll('rect')
            .data(d => d)
            .enter()
            .append('rect')
            .attr('y', d => newYScale(d.data.name))
            .attr('x', d => newXScale(d[0]))
            .attr('width', d => newXScale(d[1]) - newXScale(d[0]))
            .attr('height', yScale.bandwidth())
            .style('cursor', 'pointer')
            .on("mouseover", multi_mouseover)
            .on("mousemove", multi_mouseover)
            .on("mouseout", multi_mouseout)
            .on("mouseleave", multi_mouseleave)
          g.append('g')
            .call(d3.axisLeft(newYScale).ticks(5).tickFormat(d => typeof d === 'string' ? d.toUpperCase() : d))
            .selectAll('.domain, text')
            .attr('stroke', 'Black')
            .style("font-size", '11px');

          g.append('g')
            .attr('transform', `translate(0, ${containerHeight - marginTop})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .attr('fill', 'black');
          g.selectAll('g')
            .data(series)
            .selectAll('text')
            .data(d => d)
            .enter()
            .append('text')
            .attr('x', d => newXScale(d[1]) + (newXScale(d[0]) - newXScale(d[1])) / 2)
            .attr('y', d => newYScale(d.data.name) + yScale.bandwidth() / 2)
            .text(d => d3.format(",")((d[1] - d[0]).toFixed(2)))
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('fill', 'black')
            .style("display", function () {
              return showValues ? "block" : "none";
            });
          if (showLine) {
            createLineChart(data, datakeys, props.chart_color);
          }

          function createLineChart(data, keys, colors) {
            const stack = d3.stack().keys(keys);
            const series = stack(mod_data);
            keys.forEach((key, index) => {
              const lineGenerator = curved_line ?
                d3.line().curve(d3.curveCardinal) :
                d3.line();
              lineGenerator.x(d => xScale(d[1]))
                .y(d => yScale(d.data.name) + yScale.bandwidth() / 2);

              g.append('path')
                .datum(series[index])
                .attr('class', `line-${key}`)
                .attr('d', lineGenerator)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 2.5)
                .attr('stroke-dasharray', '5,5');

              series[index].forEach((point, pointIndex) => {
                const x = xScale(point[1]);
                const y = yScale(point.data.name) + yScale.bandwidth() / 2;

                if (show_Square) {
                  g.append('rect')
                    .datum(point)
                    .attr('class', `node-${key}`)
                    .attr('x', x - 5)
                    .attr('y', y - 5)
                    .attr('width', 10)
                    .attr('height', 10)
                    .attr('fill', "pink")
                    .on('mouseover', function (event, d) {
                      const tooltipX = event.pageX + 10;
                      const tooltipY = event.pageY - 50;
                      let tooltip = d3.select('#tooltip');
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

                      tooltip.html(`Value: ${(d[1] - d[0]).toFixed(2)}, ${barLabel}: ${d.data.name}`)
                        .style("left", `${tooltipX}px`)
                        .style("top", `${tooltipY}px`)
                        .style('opacity', 0.9);
                    })
                    .on('mouseout', function (event, d) {
                      d3.select('#tooltip')
                        .style('opacity', 0);
                    });
                }
                else {
                  g.append('circle')
                    .datum(point)
                    .attr('class', `node-${key}`)
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', 5)
                    .attr('fill', "green")
                    .on('mouseover', function (event, d) {
                      const tooltipX = event.pageX + 10;
                      const tooltipY = event.pageY - 50;
                      let tooltip = d3.select('#tooltip');
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

                      tooltip.html(`Value: ${(d[1] - d[0]).toFixed(2)}, ${barLabel}: ${d.data.name}`)
                        .style("left", `${tooltipX}px`)
                        .style("top", `${tooltipY}px`)
                        .style('opacity', 0.9);
                    })
                    .on('mouseout', function (event, d) {
                      d3.select('#tooltip')
                        .style('opacity', 0);
                    });
                }
              });
            });


          }
          if (show_Grid) {
            g.insert('g', ':first-child')
              .attr('class', 'grid')
              .attr('transform', `translate(0, ${containerHeight - marginBottom})`)
              .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''))
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
        };


        if (i === reportSlice.resetCharts.i) {
          handleResetButtonClick();
          dispatch(setResetCharts([]));
        }

        // document.getElementById(`togglereset-${i}`).addEventListener('click', function (event) {
        //   handleResetButtonClick();
        // });



      }


    }
    // else {
    //   // Clear the container
    //   d3.select(`#my_dataviz${i}`).html("");

    //   // Add a centered "No data available" message
    //   d3.select(`#my_dataviz${i}`)
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
    // }


  },
    // [  props , data ]
    [containerWidth, BarWidth, containerHeight, textColorBar, showValues, mouseoverEnabled, mouseoverSwitchType, showGridEnabled, temp_containerWidth, fullScreen_enabled, temp_containerHeight, sortData, showLine, svgHeight, enable_table, curved_line, show_Square, reportSlice[i], text_color_arr, enabledTable, data, i === reportSlice.resetCharts.i,chart_color]
  );

  const show_table_fn = async (val) => {


    var updtData
    console.log('data show_table_fn:>> ', data ,  props.chart_data);

    if( reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined   ){
        updtData = dataRetreived.data
    }
    else{
        updtData =  props.chart_data
    }



    if(reportSlice.layoutInfo[props.indexes]?.filtered_data){
      updtData =  reportSlice.layoutInfo[props.indexes]?.filtered_data
  }

  
console.log('updtData :>> ', updtData);


    const fieldNames = Object.keys(updtData[0]).filter(key => key !== "_id");
    if (val) {
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
      .html(function (d) {
        // Check if the value is a number
        if (typeof d.value === 'number') {
          return d.value.toFixed(2);
        }
        return d.value;
      })
      .attr("style", "text-align: center")
      .style('color', 'black')
    return table;
  }


  return (
    <div>
      <div id={`tooltip${i}`} style={{ position: 'absolute', opacity: 0, background: 'white', padding: '10px', borderRadius: '5px' }}></div>
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
              <div id={`my_dataviz${i}`} onMouseLeave={() => { setShowOptions(false); setShowSortoption(false); }}>
                <svg width={(fullScreen_enabled ? temp_containerWidth : containerWidth)} height={(fullScreen_enabled ? temp_containerHeight : containerHeight)} >
                  <g></g>
                </svg>
              </div>
              {
                show_Legend ?
                  <div className="legend" id={`legend${i}`} style={{ position: '', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', boxShadow: 'none', marginTop: enable_table ? (fullScreen_enabled ? '-290px' : '-230px') : '-40px' }}></div>
                  :
                  null
              }

              { }
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
            //   <Spinner
            //     color="success"
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
        }




      </div>
      {(props.show_table && chartsLoad )? (
                <>
                    <div style={{
                      position:"absolute",
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

export default HorizontalStackChart;
