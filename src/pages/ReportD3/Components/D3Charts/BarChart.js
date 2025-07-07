import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Spinner } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import "../../LayoutInfo.css"
import urlSocket from "../../../../helpers/urlSocket";

import { setResetCharts, retriveClnPrimaryValue, updateLayoutInfo, toggleProcessingState, barDescending, barSorting, sortInfo } from '../../../../Slice/reportd3/reportslice';


const BarChart = (props) => {
    var chart_data = props.chart_data
    var BarWidth = props.BarWidth
    // var containerWidth = props.containerWidth
    var containerHeight = props.containerHeight
    var i = props.id
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
    var dataRetreived = props.itemInfo
    var show_Legend = props.show_Legend

    var choosedColors = dataRetreived.ColorMapping 

    console.log('choosedColoras', choosedColors)

    var calc = props.math_calc
    console.log('dataRetreived.calc', dataRetreived)

    const [chartWidth, setChartWidth] = useState(BarWidth === undefined ? props.containerWidth : '200')
    const dispatch = useDispatch()
    const chartRef = useRef();
    const [showOptions, setShowOptions] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [sortShowOptions, setSortShowOptions] = useState(false);
    const [tableColumns, setTableColumns] = useState(["name", "value"]);
    const [zoomedData, setZoomedData] = useState()
    const [data, setData] = useState(chart_data)
    const [mouseoverEnabled, setMouseoverEnabled] = useState(mouseovered)
    const [yLabelname, setYLabelname] = useState('value')
    const [showLine, setShowLine] = useState(showline)
    const [enabledTable, setEnabledTable] = useState(enable_table)
    const [showGridenabled, setShowGridenabled] = useState(show_Grid)
    const [showValues, setShowValues] = useState(show_bar_values);
    const [chartsLoad, setChartsLoad] = useState(true)
    const [selectedXaxisKey, setselectedXaxisKey] = useState("");
    const [chartHeight, setchartHeight] = useState(svgHeight)

    const [selectedYaxisKey, setselectedYaxisKey] = useState('');
    const [processing, setProcessing] = useState(false)
    const [processingStates, setProcessingStates] = useState(new Map());
    const [handlefullscreen, sethandlefullscreen] = useState(fullScreen_enabled)
    // const reportSlice = useSelector(state => state.reportSlice);
    // const reportSlice = useSelector(state => state.reportSliceReducer);
    const downloadStatus = useSelector(state => state.reportSliceReducer.downloadStatus);

    // {
    //     encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@65.0.69.57:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
    //     db_name: 'hotel_surguru-beta',
    // }

    const reportSlice = useSelector(state => state.reportSliceReducer);
    const layout = reportSlice.layoutInfo
    const ProcessedID = reportSlice.processingData[props.id];
    console.log('ProcessedID Bar', ProcessedID, reportSlice)

  const selectedsortredux = useSelector(state => state.reportSliceReducer.selectedsortredux);


    const AuthSlice = useSelector(state => state.auth);
    const dbInfo = AuthSlice.db_info

    let cacheExpirationChecker = null; // A reference for the interval checker


    var colorMapping = {
        "0": "green",
        "Bananas": "#33FF57",
        "Cherries": "#3357FF",
        "Dates": "#F0A500",
        "Elderberries": "#A500F0",
      }

      colorMapping = choosedColors

// const colorMapping  = props.ColorMapping !== undefined ? props.ColorMapping : {}

console.log("colorMapping>>>>>>>>>>>>>", colorMapping);

    useEffect(() => {
        console.log('dataRetreived  bar chart:>> ', dataRetreived);



        if (ProcessedID === undefined) {
            // console.log(' dataRetreived.chnaged :>> ', dataRetreived.y_axis_key, dataRetreived.data, !processingStates[dataRetreived.i], dataRetreived.filtered_data, dataRetreived.chnaged);
            // if (dataRetreived.y_axis_key  && dataRetreived.data === undefined  || dataRetreived.chnaged)
            if (
                (dataRetreived.y_axis_key && Object.keys(dataRetreived.y_axis_key).length > 0) &&
                (dataRetreived.data === undefined || dataRetreived.chnaged)
            ) {
                console.log('dataRetreived  bar chart:>> ', dataRetreived);
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
            // console.log('117 Already Retyrteived Data ', dataRetreived)
            if (dataRetreived.filtered_data !== undefined) {
                setData(dataRetreived.filtered_data)
                setChartsLoad(true)
            }
            else {
                setData(dataRetreived.data)
                setChartsLoad(true)
            }

        }
        if (props.show_table) {
            showTableFunc(true, (dataRetreived.data?.[0] !== undefined ? dataRetreived.data[0][calc] : dataRetreived.data))
        }
        else {
            showTableFunc(false)
        }

    }, [props, dataRetreived])


    useEffect(() => {
        // console.log("calccalc", calc);
        setData(dataRetreived.data?.[0]?.[calc])
    }, [calc])

    // useEffect(()=>{
    //     setShowValues(!show_bar_values)
    // } , [props] )

    // const [chartWidth, setChartWidth] = useState(0);
    useEffect(() => {
        const container = document.getElementById(`my_dataviz${i}`);
        
        if (!container) return;
    
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width } = entry.contentRect;
                console.log("Container resized, new width:", width);
    
               var  containerWidth = width; // Update width dynamically
                d3.select(`#my_dataviz${i} svg`)
                    .attr("width", width);
            }
        });
    
        resizeObserver.observe(container);
    
        return () => {
            resizeObserver.disconnect();
        };
    }, []);
    


    // useEffect(() => {
    //     if (chartWidth === 0) return; // Avoid rendering before width is set

    //     d3.select(`#my_dataviz${props.i}`).selectAll("svg").remove(); // Clear previous chart

    //     const svg = d3
    //         .select(`#my_dataviz${props.i}`)
    //         .append("svg")
    //         .attr("width", chartWidth) // Use dynamic width
    //         .attr("height", props.containerHeight + 30)
    //         .style("max-width", "100%")
    //         .style("display", "flex")
    //         .style("align-items", "center")
    //         .style("justify-content", "center");

    //     // Define scales using updated chartWidth
    //     const x = d3.scaleBand()
    //         .domain(data?.map((d) => d.name))
    //         .range([props.marginLeft, chartWidth - props.marginRight])
    //         .padding(0.1);

    //     const y = d3.scaleLinear()
    //         .domain([0, Math.max(1, d3.max(data, (d) => Number(d.value)))])
    //         .range([props.containerHeight - props.marginBottom, props.marginTop])
    //         .nice();

    //     // Draw bars
    //     svg.selectAll("rect")
    //         .data(data)
    //         .enter()
    //         .append("rect")
    //         .attr("x", d => x(d.name))
    //         .attr("y", d => y(d.value))
    //         .attr("width", x.bandwidth())
    //         .attr("height", d => props.containerHeight - props.marginBottom - y(d.value))
    //         .attr("fill", "steelblue");

    // }, [chartWidth]); // Re-run when width or data changes



    




    useEffect(() => {
        if (data !== undefined && data.length > 0) {
            // setData(data)
            setShowValues(show_bar_values)
            setMouseoverEnabled(mouseovered)
            setShowLine(showline)
            setEnabledTable(enable_table)
            setchartHeight(svgHeight)
            setShowGridenabled(show_Grid)
            setChartWidth(BarWidth)
            sethandlefullscreen(fullScreen_enabled)

        }
    }, [chartsLoad, mouseovered, showline, enable_table, svgHeight, show_Grid, temp_containerWidth, fullScreen_enabled, temp_containerHeight, show_bar_values, chartHeight, BarWidth])

    const LoadedData = async (value, mode) => {
        try {


            // Extract x_axis_keys
            const xAxisKeys = layout
                .filter(item => item.x_axis_key !== undefined)
                .map(item => item.x_axis_key);

            // Extract y_axis_keys and distinct y_axis_arr
            const yAxisKeys = layout.reduce((acc, item) => {
                // If y_axis_key exists and has a 'name', push it to yAxisKeyArr
                if (item.y_axis_key && item.y_axis_key.name) {
                    acc.yAxisKeyArr.push(item.y_axis_key.name);
                }

                // If y_axis_arr exists and is an array, add its distinct values to yAxisArr
                if (Array.isArray(item.y_axis_arr)) {
                    acc.yAxisArr = [...new Set([...acc.yAxisArr, ...item.y_axis_arr])];
                }

                return acc;
            }, { yAxisKeyArr: [], yAxisArr: [] });

            // Extract unique values for x_axis_key (i.e., `name` in x_axis_key)
            const uniqueNamesX = [...new Set(xAxisKeys.map(item => item.name))];

            // Extract unique values for y_axis_key (i.e., name in y_axis_key)
            const uniqueNamesY = [...new Set(yAxisKeys.yAxisKeyArr.map(item => item))];

            // console.log('Unique Names Parent Page:', uniqueNamesX, uniqueNamesY);

            // Combine both unique names from x_axis and y_axis
            var combinedUniqueNames = [...new Set([...uniqueNamesX, ...uniqueNamesY])];

            // Log the combined unique names
            // console.log('Combined Unique Names (x_axis_key and y_axis_key) bars:', combinedUniqueNames);

            console.log('AuthSlice :>> ', AuthSlice);

            if (dataRetreived !== undefined) {
                const data = {
                    collection_name: dataRetreived?.selected_cln_name?.cln_name,
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    db_name: dbInfo.db_name,
                    primary_key: [],
                    selected_primary_key: value.name,
                    selected_primary_value: [],
                    chart_position: mode,
                    mode: "1",
                    additional_fields: [dataRetreived?.y_axis_key.name],
                    combinedUniqueNames: combinedUniqueNames,
                    // startDate: reportSlice.startDate,
                    // endDate: reportSlice.endDate,
                    // dateFields: AuthSlice?.dateRangeField,
                    CalculationArr: dataRetreived.CalculationArr,



                    collection2:dataRetreived.selected_cln_name[1],
                    collection1: dataRetreived.selected_cln_name[0],
          

                    groupingField: dataRetreived.groupingKeys,
                    // want to send the level key field for choosing the level values
                    level: dataRetreived.groupingValue,

                    collections: reportSlice.pageNodeInfo.selected_cln_name ,
                    relationshipdata: reportSlice.pageNodeInfo.relationships,
                    chartType:'0',
                    chartName: dataRetreived.name,
                    // categoryField :  dataRetreived.legend_category != undefined ?  dataRetreived.legend_category.name  : '',
                    // category :   [{ field : 'product_id' , collection : 'ReportCheck_orderitems' }]

                }

                console.log(data, ' bar charts data 127')






                const response = await urlSocket.post("report/retrive-barchart-data", data)
                console.log('response  328:>> ', response);




                // var response = await dispatch(retriveClnPrimaryValue(data))
                // console.log(response, 'response bars')
                if (response !== undefined && response.status === 200) {
                    // if (mode === "1") {
                    // await  setXaxisValue(response.data.x_label);
                    setselectedXaxisKey(value);

                    if (response.data.data.length > 0) {


                        setData(response.data.data)

                        console.log('selectedsortredux   320', ProcessedID, selectedsortredux)


                        if (selectedsortredux[dataRetreived.i]) {
                            console.log('ProcessedID Already Sort type is', selectedsortredux[dataRetreived.i])
                            if (selectedsortredux[dataRetreived.i] === 'accending') {
                                console.log('Ascending ', response.data.data);
                                dispatch(barSorting({ data: response.data.data, chart_id: dataRetreived.i }));
                            }
                            else if (selectedsortredux[dataRetreived.i] === 'decending') {
                                console.log('Descending', response.data.data);
                                dispatch(barDescending({ data: response.data.data, chart_id: dataRetreived.i }));

                            }
                            else {
                                console.log('Default');
                                dispatch(sortInfo({ data: response.data.data, chart_id: dataRetreived.i }));
                            }
                        }


                        const updatedLayoutObj = {
                            ...dataRetreived, // Preserve other existing properties in dataRetreived
                            data: response.data.data, // Update with new data
                            chnaged: false,
                            configured: true // Reset or update the `chnaged` flag
                        };

                        console.log("Updated layout object for index:", props.indexes, updatedLayoutObj);


                        // Copy the existing layoutInfo array
                        const updatedLayoutArr = [...layout];

                        updatedLayoutArr[props.indexes] = {
                            ...updatedLayoutArr[props.indexes], // Preserve other properties of the specific index
                            ...updatedLayoutObj, // Merge updated properties
                        };


                        setChartsLoad(true)
                        dispatch(
                            updateLayoutInfo({
                                index: props.indexes,
                                updatedObject: updatedLayoutObj,
                            })
                        )
                    }
                    else {

                        setData([])

                        const updatedLayoutObj = {
                            ...dataRetreived, // Preserve other existing properties in dataRetreived
                            data: response.data.data, // Update with new data
                            chnaged: false,
                            configured: true // Reset or update the `chnaged` flag
                        };

                        console.log("Updated layout object for index:", props.indexes, updatedLayoutObj);


                        // Copy the existing layoutInfo array
                        const updatedLayoutArr = [...layout];

                        updatedLayoutArr[props.indexes] = {
                            ...updatedLayoutArr[props.indexes], // Preserve other properties of the specific index
                            ...updatedLayoutObj, // Merge updated properties
                        };


                        setChartsLoad(true)
                        dispatch(
                            updateLayoutInfo({
                                index: props.indexes,
                                updatedObject: updatedLayoutObj,
                            })
                        )


                    }





                    // if (data.cacheExpiresAt) {
                    //     const timeRemaining = data.cacheExpiresAt - Date.now();
                    //     console.log("Time Remaining:", timeRemaining);

                    //     if (cacheExpirationChecker) {
                    //       clearInterval(cacheExpirationChecker);
                    //     }

                    //     // Set up the interval to monitor the cache expiration
                    //     cacheExpirationChecker = setInterval(() => {
                    //       const timeLeft = data.cacheExpiresAt - Date.now();
                    //       if (timeLeft <= 0) {
                    //         alert("Cache expired");
                    //         clearInterval(cacheExpirationChecker); // Stop the interval after alerting
                    //       }
                    //     }, 1000); // Check every second
                    //   }


                    // }
                    if (mode === "2") {
                        setselectedYaxisKey(value);

                    }


                }
            }
        } catch (error) {
            console.log('error :>> ', error);
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




    // Clear the interval when the component unmounts

    let zoomState = { k: 1, x: 0, y: 0 };
    const margin = { top: 70, right: 80, bottom: 80, left: 80 };


    // if (data && Array.isArray(data) && data?.length > 0) {
    //     console.log('data 299', data);
    //     // var datakeys = Object.keys(data[0]).filter(key => key !== 'year' && key !== "_id");
    //     var datakeys = Object.keys(data !== undefined &&  data[0]).filter(key => key !== 'name' && key !== "_id");
    //     console.log('datakeys 302:>> ', datakeys);
    //     var datakeys_name = Object.keys(data[0]).filter(key => key === 'name' && key !== "_id");
    // }



    if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined) {
        // console.log('data 278', data, dataRetreived);
        if (data?.[0] !== undefined) {
            var datakeys = Object.keys(data !== undefined ? data[0] : props.chart_data[0]).filter(key => key !== 'name' && key !== "_id");
            // console.log('datakeys 280:>> ', datakeys);
        }
    }
    else {
        // console.log('Sample data Datakeys', props.chart_data);
        var datakeys = Object.keys(props.chart_data.length > 0 && props.chart_data[0]).filter(key => key !== 'name' && key !== "_id");
        // console.log('datakeys 293:>> ', datakeys);
    }





    useEffect(() => {
        // console.log('props 81', props.containerWidth)

        var mod_data;
        var chart_id = i;
        console.log('reportSlice[chart_id] :>> ', reportSlice[chart_id], " reportSlice[chart_id].horbarsorted", reportSlice[chart_id]?.horbarsorted);
        if (reportSlice[chart_id] && reportSlice[chart_id].horbarsorted) {
            console.log("498");
             datakeys = Object.keys( reportSlice[chart_id]?.horbarsorted !== undefined ?  reportSlice[chart_id]?.horbarsorted[0] : props.chart_data[0]).filter(key => key !== 'name' && key !== "_id");

             console.log("501" , datakeys);

            mod_data = reportSlice[chart_id].horbarsorted;
        } else if (reportSlice.layoutInfo[props.indexes]?.configured && reportSlice.layoutInfo[props.indexes].data?.[0]) {
            mod_data = reportSlice.layoutInfo[props.indexes].data
        }
        else {
            mod_data = chart_data
        }


        

        if (reportSlice.layoutInfo[props.indexes]?.filtered_data) {
            mod_data = reportSlice.layoutInfo[props.indexes]?.filtered_data
        }



        console.log('svgHeight :>> ', svgHeight, chartHeight , mod_data);
        if (svgHeight !== undefined && svgHeight !== '') {
            containerHeight = containerHeight - 200
        }
        else {
            containerHeight = containerHeight
        }
        var width
        var height
        var containerWidth = props.containerWidth
        console.log('handlefullscreen :>> ', handlefullscreen, containerWidth, temp_containerWidth);
        if (handlefullscreen !== undefined && handlefullscreen !== false) {
            width = temp_containerWidth - margin.left - margin.right;
            height = temp_containerHeight - margin.top - margin.bottom - (enabledTable ? 200 : 0)
            containerHeight = height + margin.top
            containerWidth = temp_containerWidth;
        }
        else {
            containerWidth = containerWidth - margin.left - margin.right;
            height = containerHeight - margin.top - margin.bottom;
        }
        const temp_barWidth = (BarWidth !== undefined ? Number(BarWidth) : 150);
        containerWidth = (BarWidth !== undefined ? (mod_data.length * temp_barWidth) : props.containerWidth)
        console.log('BarWidth :>> ', BarWidth, containerWidth);

        // containerWidth = handlefullscreen ? (BarWidth !== undefined ? mod_data.length * temp_barWidth : props.containerWidth) : containerWidth


        function getContainerWidth() {
            return handlefullscreen
                ? (BarWidth !== undefined ? mod_data.length * temp_barWidth : props.containerWidth)
                : containerWidth;
        }


        console.log('containerWidth BARS :>> ', containerWidth, "containerHeight--->", containerHeight);
        console.log('width BARS:>> ', width , mod_data);

        const marginTop = margin.top;
        const marginRight = margin.right;
        const marginBottom = margin.bottom;
        const marginLeft = margin.left;

        // console.log('mod_data Bar', mod_data, containerWidth, datakeys)

        if (fullScreen_enabled) {
            containerHeight = temp_containerHeight !== undefined ? temp_containerHeight + margin.top - (enable_table ? 200 : 0) : containerHeight
        }
        else {
            containerHeight = containerHeight -20
        }
console.log('mod_data 567 :>> ', mod_data , "datakeys", datakeys);

        if (mod_data !== undefined && mod_data.length === 0) {
            // Remove any previous chart elements
            d3.select(`#my_dataviz${i}`).selectAll("svg").remove();
            d3.select(`#my_dataviz${i}`).selectAll("div").remove();

            // d3.select(`#legend${i}`).remove();


            // // Append a "No Data Available" message
            // d3.select(`#my_dataviz${i}`)
            // .append("div")
            // .style("display", "flex")
            // .style("align-items", "center")
            // .style("justify-content", "center")
            // .style("height", `${containerHeight}px`) // Use the containerHeight
            // .style("font-size", "16px")
            // .style("color", "grey")
            // .text("No data available");


            // Append a "No Data Available" message with a background image
            d3.select(`#my_dataviz${i}`)
                .append("div")
                .style("display", "flex")
                .style("align-items", "center")
                .style("justify-content", "center")
                .style("height", `${containerHeight}px`) // Use the containerHeight
                .style("font-size", "16px")
                .style("color", "grey")
                // .style("background-image", `url(${image1})`) // Set the background image
                .style("background-size", "21% 100%") // Adjust the image to fit container's width and height
                .style("background-repeat", "no-repeat") // Prevent the image from repeating
                .style("background-position", "center") // Center the image
                .text("No data available");






            return; // Exit to avoid rendering the chart
        }
        else if (mod_data.length > 0 && datakeys !== undefined) {

            // mod_data = groupData(mod_data)



            // if (mod_data[0][calc] !== undefined) {
            //     mod_data = mod_data[0][calc]
            // }



            console.log('mod_data 36:>> ', mod_data, containerWidth);

            containerWidth = temp_containerWidth !== undefined ? temp_containerWidth + 300 : containerWidth
            const x = d3.scaleBand()
                .domain(mod_data.map((d) => d.name))
                .range([marginLeft, containerWidth - marginRight])
                .padding(0.1);

            const y = d3
                .scaleLinear()
                // .domain([0, d3.max(mod_data, (d) => Number(d.value))])
                // .domain([0, Math.max(1, d3.max(mod_data, (d) => Number(d.value)))]) // Set minimum max value to 1

                .domain([0, Math.max(1, d3.max(mod_data, d => d3.sum(datakeys?.map(key => Number(d[key])))))]).nice()

                .nice()
                .range([containerHeight - marginBottom, marginTop])



            const groupedData = d3.rollups(
                mod_data,
                v => d3.max(v, d => d.value ?? 0), // Get max value for each group
                d => d.name // Group by year
            ).map(([name, value]) => ({ name, value }));

            mod_data = groupedData

            d3.select(`#my_dataviz${i}`).selectAll("svg").remove();
            d3.select(`#my_dataviz${i}`).selectAll("div").remove();
            // d3.selectAll(`#my_dataviz${i}`).selectAll("div").remove();
            d3.select(`#my_dataviz${i}`).selectAll('svg').remove();
            d3.select(`#my_dataviz${i}`).selectAll('div').remove();

            const extent = [[marginLeft, marginTop], [containerWidth - marginRight, height - marginTop]];
            const zoom = d3.zoom()
                .scaleExtent([1, 8])
                .translateExtent(extent)
                .extent(extent)
                .on("zoom", zoomed);

            // Select the container and ensure it exists
            const container = d3.select(`#my_dataviz${i}`);

            if (container.empty()) {
                console.error(`Container #my_dataviz${i} does not exist.`);
                return; // Exit if the container is not found
            }

            const svgContainer = d3
                .select(`#my_dataviz${i}`)

                .style("width", '100%')
                .style("overflow-x", BarWidth !== undefined ? "auto" : "hidden")
                // .style("width", `${ containerWidth}px`)
                .style("max-width", `-webkit-fill-available`)
                .style("height", `${containerHeight }px`)
                .style("overflow-y", "hidden")
                .style("margin-left", "20px") // Add margin-left here
            // .call(zoom)


            if (svgContainer.empty()) {
                console.error(`Container #my_dataviz${i} does not exist.`);
                return; // Exit if the container is not found
            }

            const svg = svgContainer
                .append('svg')
                // .attr("width", containerWidth - 30)
                .attr("height", containerHeight )
                .style("max-width", `-webkit-fill-available`)
                // .style("display", "flex")
                // .style("align-items", "center")
                // .style("justify-content", "center")
                // .style("margin-left", "20px") // Add margin-left here
                // .style("overflow-x", BarWidth !== undefined ? "auto" : "hidden")
                // .style("overflow-y", "hidden")
                // .style("margin-left", "20px") // Add margin-left here
                .style("margin-bottom", "10px") // Add margin-left here
                .call(zoom)

            if (svg.empty()) {
                console.log("Empty")
                svg = svgContainer
                    .append('svg')
                    .attr("width", containerWidth )
                    .attr("height", containerHeight );



            }
            console.log("svgsvgsvg", svg);
            // Apply fade-in
            // fadeInSelection(svg);

            // function fadeInSelection(selection, duration = 500) {
            // selection
            // .style('opacity', 0) // Start with opacity 0
            // .transition()
            // .duration(duration)
            // .style('opacity', 1); // Fade to opacity 1
            // }

            async function fadeInSelection(selection, duration = 500) {
                return new Promise((resolve) => {
                    selection
                        .style('opacity', 0) // Start with opacity 0
                        .transition()
                        .duration(duration)
                        .style('opacity', 1) // Fade to opacity 1
                        .on('end', resolve); // Resolve promise when the transition ends
                });
            }

            function applyZoomState() {
                const transform = d3.zoomIdentity.translate(zoomedData.x, zoomedData.y).scale(zoomedData.k);
                svg.call(zoom.transform, transform);
            }
            if (zoomedData !== undefined) {
                applyZoomState();
            }

            // svg.append("rect")
            // .attr("class", "chart-box")
            // .attr("x", marginLeft)
            // .attr("y", marginTop)
            // .attr("width", containerWidth - marginLeft - marginRight)
            // .attr("height", containerHeight - marginTop - marginBottom)
            // .attr("fill", "none")
            // .attr("stroke", "lightgrey")

            if (showGridenabled) {

                svg.append("rect")
                    .attr("class", "chart-box")
                    .attr("x", marginLeft)
                    .attr("y", marginTop)
                    .attr("width", containerWidth - marginLeft - marginRight)
                    .attr("height", containerHeight - marginTop - marginBottom)
                    .attr("fill", "none")
                    .attr("stroke", "lightgrey")

                svg.append("g")
                    .selectAll("line")
                    .attr('class', 'x-grid')
                    .data(mod_data)
                    .join("line")
                    .attr("x1", (d) => x(d.name) + x.bandwidth() / 2)
                    .attr("x2", (d) => x(d.name) + x.bandwidth() / 2)
                    .attr("y1", marginTop)
                    .attr("y2", containerHeight - marginBottom)
                    .attr("stroke", "lightgrey");
                svg.append('g')
                    .attr('class', 'y-grid')
                    .attr('transform', `translate(${marginLeft},${marginTop - marginBottom + 10})`)
                    .call(d3.axisLeft(y)
                        .tickSize(-(containerWidth - marginLeft - marginRight))
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
                .attr('x', (d, i) => x(d.name))
                .attr('y', (d) => y(d.value))
                .attr('height', 0)
                .attr('y', (d) => y(Number(d.value)))
                // .attr('fill', `${props.chart_color}`)
                .attr('fill',   d => choosedColors?.[d.name] ?? props.chart_color)
                .on('mouseover', handleMouseOver)
                .on('mousemove', handleMouseOver)
                .on('mouseout', handleMouseOut)

            var u =
                svg.selectAll('.bar')
                    .data(mod_data)
            u
                .enter()
                .append("rect")
                .merge(u)
                .attr('width', x.bandwidth())
                .attr('x', (d) => {
                    const xlabel = x(d.name);
                    return xlabel;
                })
                .attr('y', (d) => y(0))
                // .transition()
                // .duration(1000)
                .attr('y', (d) => y(Number(d.value)))
                .attr('height', (d) => containerHeight - y(Number(d.value)) - marginBottom)
                .attr('y', (d) => y(Number(d.value)))
                .attr('height', (d) => containerHeight - y(Number(d.value)) - marginBottom)

            function handleMouseOver(event, d) {
                if (mouseoverEnabled) {
                    d3.select(this).attr('fill', '#4682b496');
                    var chartContainer = d3.select(`#my_dataviz${i}`).node();
                    var chartContainerRect = chartContainer.getBoundingClientRect();
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
                            .style("pointer-events", "none");
                    }


                    var divX = chartContainerRect.left + window.scrollX;
                    var divY = chartContainerRect.top + window.scrollY;

                    tooltip.transition().duration(50)
                        .style("opacity", .9);

                    tooltip.html(`${barLabel}: ${d.name}<br>Value: ${d.value % 1 === 0 ? d.value : d.value.toFixed(2)}`)
                        .style("color", "red")
                        .style("background-color", "#ededed")

                    // Calculate tooltip dimensions
                    const tooltipNode = tooltip.node();
                    const tooltipRect = tooltipNode.getBoundingClientRect();
                    const tooltipWidth = tooltipRect.width;
                    const tooltipHeight = tooltipRect.height;

                    let leftPosition = event.pageX - divX + 60; // changed here at 6 Dec 24 for controlling the layout Shadows
                    let topPosition = event.pageY - divY - 40;

                    if (topPosition + tooltipHeight > chartContainerRect.height) {
                        topPosition -= tooltipHeight;
                    }
                    if (leftPosition + tooltipWidth > chartContainerRect.width) {
                        leftPosition = event.pageX - divX - tooltipWidth - 10; // Move to the left of the cursor
                    }

                    tooltip.style("left", (leftPosition) + "px")
                        .style("top", topPosition + "px")
                        .style("pointer-events", "none")
                }
            }

            function handleMousemove(event, d) {
                var chartContainer = d3.select(`#my_dataviz${i}`).node();
                var chartContainerRect = chartContainer.getBoundingClientRect();

                // console.log('chartContainerRect :>> ', chartContainerRect);
                if (mouseoverEnabled) {
                    const scrollX = chartRef.current.scrollLeft;
                    const adjustedMouseX = event.clientX + scrollX;

                    const barRect = this.getBoundingClientRect();


                    // console.log('barRect :>> ', barRect);
                    const adjustedMouseY = event.offsetY
                    const tooltip = d3.select(`#tooltip${i}`);
                    tooltip.html(`${barLabel}: ${d.name}<br>Value: ${d.value}`)
                        .style("left", (fullScreen_enabled ? adjustedMouseX + 50 : barRect.x - chartContainerRect.left + 100) + "px")
                        .style("top", (fullScreen_enabled ? adjustedMouseY : adjustedMouseY) + "px");
                }
            }

            function handleMouseOut(event   , d) {
                // d3.select(this).attr('fill', props.chart_color);
                // const tooltip = d3.select(`#tooltip${i}`);
                // tooltip.transition().duration(100)
                // .style("opacity", 0);

                d3.select(this).attr('fill',d=>  choosedColors?.[d.name] ?? props.chart_color);
                const tooltip = d3.select(`#tooltip${i}`);
                tooltip.transition().duration(100)
                    .style("opacity", 0)
                    .on("end", () => tooltip.remove()); // Remove the tooltip element from the DOM after the transition

            }
            displayValues()
            function displayValues() {
                svg.selectAll('.bar-label')
                    .data(mod_data)
                    .enter()
                    .append('text')
                    .attr('class', 'bar-label')
                    .attr('x', d => x(d.name) + x.bandwidth() / 2)
                    .attr('y', d => y(d.value) - 5)
                    .text(d => showValues ? d.value % 1 === 0 ? d.value : d.value.toFixed(2) : '')
                    .attr('text-anchor', 'middle')
                    .attr('fill', d => text_color_arr)
                    .style("opacity", 0)
                    // .transition()
                    // .duration(1000)
                    .style("opacity", 1);
            }
            // d3.selectAll(`.legends1${i}`).remove()
            // d3.selectAll(`.legends${i}`).selectAll('div').remove()

            const legendContainerDel = d3.selectAll(`#legend${i}`);
            legendContainerDel.selectAll('*').remove(); // Clear previous legend content


            const legendRectSize = 15;
            const legendContainer = d3.selectAll(`#legend${i}`)
                // .attr("class", `legends${i}`)
                .style("display", "flex")
                .style("align-items", "center")
                .style("boxShadow", "none")
                .style("margin-top", "-5px")

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


            // const axisLabels = svg.append('g')
            // .attr('class', `x-axis ${i}`)
            // .attr("transform", `translate(0,${containerHeight - marginBottom})`)
            // .call(d3.axisBottom(x))
            // .selectAll('text')
            // .style("text-anchor", "middle")
            // .attr("font-size", "14px")
            // .attr("dy", "1.5em")
            // .attr("dx", '-.8em')
            // .attr('fill', 'black')
            // .style("text-transform", "capitalize")
            // .style("font-weight", (d, i) => i % 2 === 0 ? "bold" : "normal")


            // let rotationAngle = 0;
            // axisLabels.each(function (_, i) {
            // const label = this;
            // d3.select(label).on('click', function () {
            // const currentRotation = rotationAngle === 0 ? -45 : 0;
            // const currentAnchor = rotationAngle === 0 ? 'end' : "middle";
            // axisLabels.attr('transform', `rotate(${currentRotation})`)
            // .style("text-anchor", function (d) {
            // return currentRotation === -45 ? 'middle' : 'start';
            // })
            // .attr('dx', function (d) {
            // return currentRotation === -45 ? '-.8em' : '-.8em';
            // })
            // .attr('dy', function (d) {
            // return currentRotation === -45 ? '.15em' : '1.5em';
            // })
            // rotationAngle = currentRotation;

            // });
            // });
            // console.log(yLabelname, 'yLabel')







            // const axisLabels = svg.append('g')
            // .attr('class', `x-axis ${i}`)
            // .attr("transform", `translate(0,${containerHeight - marginBottom})`)
            // .call(d3.axisBottom(x))
            // .selectAll('text')
            // .text(function (d) {
            // return truncateText(d, 6); // Adjust divisor for label size
            // })
            // .style("text-anchor", "end") // Adjust to 'end' for rotated labels
            // .attr("font-size", "12px")
            // .attr("transform", "rotate(-90)") // Rotate 90 degrees
            // .attr("dx", "-0.8em") // Horizontal offset for rotated text
            // .attr("dy", "-0.4em") // Vertical offset for rotated text
            // .attr('fill', 'black')
            // .style("text-transform", "capitalize")
            // .style("font-weight", (d, i) => (i % 2 === 0 ? "bold" : "normal"))
            // .style("cursor", "pointer") // Add pointer cursor


            // axisLabels.each(function (d, i) {
            // const label = d3.select(this);
            // const textWidth = label.node().getBBox().width;
            // const availableWidth = containerWidth / data?.length;

            // // if (textWidth > availableWidth) {
            // label.text(truncateText(d, 6)); // Further truncate to fit
            // // }

            // // Add tooltip showing the full label
            // label.append("title").text(d);
            // });




            const axisLabels = svg.append('g')
                .attr('class', `x-axisLabels`)

                .attr("transform", `translate(0,${containerHeight - marginBottom})`)
                .call(d3.axisBottom(x))
                .selectAll('text')

            axisLabels.style("text-anchor", "end") // Align text to the end for rotated labels
                .attr("font-size", "12px")
                .attr("transform", "rotate(-90)") // Rotate text by 90 degrees
                .attr("dx", "-0.8em") // Horizontal offset for rotated text
                .attr("dy", "-0.4em") // Vertical offset for rotated text
                .attr('fill', 'black')
                .style("text-transform", "capitalize")
                .style("font-weight", (d, i) => (i % 2 === 0 ? "normal" : "normal"))
                .style("cursor", "pointer")
                .attr('opacity', 0.7)

                // .attr('class', `x-axis`)

                .text(function (d) {
                    return truncateText(String(d), 6); // Truncate text to a fixed maximum length (e.g., 6 characters)
                })

            // Add tooltips for full text
            axisLabels.each(function (d) {
                const label = d3.select(this);

                // Add tooltip showing the full label
                label.append("title").text(d);
            });



            // const axisLabels = svg.append('g')
            // .attr('class', `x-axis ${i}`)
            // .attr("transform", `translate(0,${containerHeight - marginBottom})`)
            // .call(d3.axisBottom(x))
            // .selectAll('text')
            // .text(function (d) {
            // // Truncate labels to fit within the container width
            // return truncateText(d, 6); // Adjust divisor for label size
            // })
            // .style("text-anchor", "middle") // Straight text anchor
            // .attr("font-size", "12px")
            // .attr("dx", "0em") // Horizontal offset for straight text
            // .attr("dy", "1em") // Vertical offset for straight text
            // .attr('fill', 'black')
            // .style("text-transform", "capitalize")
            // .style("font-weight", (d, i) => (i % 2 === 0 ? "bold" : "normal"))
            // .style("cursor", "pointer") // Add pointer cursor
            // .each(function (d) {
            // const label = d3.select(this);
            // const textWidth = label.node().getBBox().width;
            // const availableWidth = containerWidth / data.length;

            // if (textWidth > availableWidth) {
            // label.text(truncateText(d, 6)); // Further truncate to fit
            // }

            // // Add tooltip showing the full label
            // label.append("title").text(d);

            // // Initialize rotation state
            // label.attr("data-rotated", "false");
            // });

            // // Click-to-Rotate Logic
            // axisLabels.on("click", function () {
            // const label = d3.select(this);
            // const isRotated = label.attr("data-rotated") === "true";

            // if (isRotated) {
            // // Revert to straight text
            // label.attr("transform", null)
            // .style("text-anchor", "middle")
            // .attr("dx", "0em")
            // .attr("dy", "1em")
            // .attr("data-rotated", "false");
            // } else {
            // // Rotate to 90 degrees
            // label.attr("transform", "rotate(-90)")
            // .style("text-anchor", "end")
            // .attr("dx", "-0.8em")
            // .attr("dy", "-0.4em")
            // .attr("data-rotated", "true");
            // }
            // });





            const yAxisContainer = d3.select(`#my_dataviz${i}`)
                .attr('class', 'y-axis')
                .append("div")
                .style("position", "absolute")
                .style('background-color', 'white')
                .style("top", `${0}px`)
                .style("left", "0")
                .style("width", `${marginLeft + 20}px`)
                .style("height", `${containerHeight + 30}px`);

            const yAxis = yAxisContainer.append("svg")
                .attr("width", '100%')
                .attr("height", containerHeight)
                .append("g")
                .attr("transform", `translate(${marginLeft + 20},0)`)
                .call(d3.axisLeft(y).ticks(fullScreen_enabled ? 20 : containerHeight / 50))
                .selectAll('.domain, text')
                .attr('stroke', fullScreen_enabled ? 'black' : 'black')
                .attr('opacity', 0.6)

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

            yAxisContainer.select('svg').append('text')
                .attr('x', -containerHeight / 2)
                .attr('y', marginLeft / 2)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .attr("font-size", "14px")
                .style("fill", 'green')
                .text(barYLabel);
            d3.selectAll('.legend-label')
                .text(yLabelname);

            svg.append("text")
                .attr("class", "axis-label")
                .attr("text-anchor", "start")
                .attr("x", (containerWidth - margin.left - margin.right) / 2)
                .attr("y", containerHeight - margin.bottom + margin.top - 10)
                .text(barLabel)
                .attr('opacity', 0.7)



            if (enable_table) {
                showTableFunc(true, mod_data)
            }
            else {
                showTableFunc(false)
            }

            displayLine()
            function displayLine() {
                if (showLine) {


                    const line = d3.line()
                        .x(d => x(d.name) + x.bandwidth() / 2)
                        .y(d => y(d.value))
                    if (curved_line) {
                        line.curve(d3.curveCatmullRom.alpha(0.5));
                    }
                    const path =
                        // svg.append('path')
                        svg.insert('path', "g")
                            .datum(groupedData)
                            .attr('fill', 'none')
                            .attr('stroke', 'blue')
                            .attr('stroke-width', 2)
                            .attr('d', line)

                    const totalLength = path.node()?.getTotalLength();
                    path.attr('stroke-dasharray', `${totalLength} ${totalLength}`)
                        .attr('stroke-dashoffset', totalLength)
                        .transition()
                        .duration(1000)
                        .ease(d3.easeLinear)
                        .attr('stroke-dashoffset', 0);

                    if (!show_Square) {
                        squareNodeMouseover()
                    }
                    else {
                        circleNodeMouseover()
                    }
                }
            }

            const showTooltip = (event, d) => {
                // console.log("showTooltip");
                const tooltip = d3.select(`#my_dataviz${i}`).selectAll(".tooltip");

                const chartContainer = d3.select(`#my_dataviz${i}`).node();
                const chartContainerRect = chartContainer.getBoundingClientRect();
                const containerWidth = chartContainerRect.width;
                const containerHeight = chartContainerRect.height;
                const tooltipContent = `Value: ${(d.value % 1 === 0 ? d.value : d.value.toFixed(2))}, ${barLabel}: ${d.name}`;

                if (tooltip.empty()) {
                    d3.select(`#my_dataviz${i}`)
                        .append("div")
                        .attr("class", "tooltip")
                        .style("position", "absolute")
                        .style("background-color", "white")
                        .style("border", "1px solid black")
                        .style("padding", "5px")
                        .style("opacity", 0);
                }

                const tooltipNode = d3.select(".tooltip");
                tooltipNode.html(tooltipContent);

                // Calculate tooltip dimensions
                const tooltipRect = tooltipNode.node().getBoundingClientRect();
                const tooltipWidth = tooltipRect.width;
                const tooltipHeight = tooltipRect.height;

                // Calculate tooltip's left and top positions
                let leftPosition = (fullScreen_enabled ? event.offsetX : event.pageX) - chartContainerRect.left + 20; // changed here at 6 Dec 24 for controlling the layout Shadows
                let topPosition = event.pageY - chartContainerRect.top - 40;

                // Adjust tooltip position if it exceeds container bounds
                if (leftPosition + tooltipWidth > containerWidth) {
                    leftPosition = (fullScreen_enabled ? event.offsetX : event.pageX) - chartContainerRect.left - tooltipWidth - 10;
                }
                if (topPosition + tooltipHeight > containerHeight) {
                    topPosition = (fullScreen_enabled ? event.offsetY : event.pageY) - chartContainerRect.top - tooltipHeight - 10;
                }
                if (topPosition < 0) {
                    topPosition = 10; // Ensure tooltip doesn't go off the top of the container
                }

                // Position the tooltip
                tooltipNode.style("left", `${leftPosition}px`)
                    .style("top", `${topPosition}px`)
                    .style("opacity", 0.9);
            };

            function squareNodeMouseover() {


                const squares = svg.selectAll('.square-node')
                    .data(groupedData)
                    .enter()
                    .append('rect')
                    .attr('class', 'square-node')
                    .attr('x', d => x(d.name) + x.bandwidth() / 2 - 4)
                    .attr('y', d => y(d.value) - 4)
                    .attr('width', 8)
                    .attr('height', 8)
                    .attr('fill', 'green')
                    // .on("mouseover", function (event, d) {
                    // const tooltip = d3.select(this.parentNode)
                    // .append("rect")
                    // .attr("class", "tooltip-box")
                    // .attr("x", x(d.year) + x.bandwidth() / 2 - 70)
                    // .attr("y", y(d.value) - 70)
                    // .attr("height", 40)
                    // .attr("width", 140)
                    // .attr("fill", "white")
                    // d3.select(this.parentNode)
                    // .append("text")
                    // .attr("class", "tooltip-text")
                    // .attr("x", x(d.year) + x.bandwidth() / 2)
                    // .attr("y", y(d.value) - 45)
                    // .attr("text-anchor", "middle")
                    // .text(`Value: ${d.value}`)
                    // .style("fill", "red");

                    // d3.select(this.parentNode)
                    // .append("text")
                    // .attr("class", "tooltip-text")
                    // .attr("x", x(d.year) + x.bandwidth() / 2)
                    // .attr("y", y(d.value) - 30)
                    // .attr("text-anchor", "middle")
                    // .text(`${barLabel}: ${d.year}`)
                    // .style("fill", "red");
                    // })
                    .on("mouseover", function (event, d) {
                        showTooltip(event, d)
                    })
                    .on("mousemove", function (event, d) {
                        showTooltip(event, d)
                    })

                    .on("mouseout", function (event, d) {
                        d3.select(".tooltip").remove()
                        d3.select(this.parentNode).selectAll(".tooltip-box").remove();
                        d3.select(this.parentNode).selectAll(".tooltip-text").remove();
                        d3.selectAll(".tooltip-text").remove();
                        d3.selectAll(".tooltip-box").remove();
                    });
            }
            function circleNodeMouseover() {


                const circles = svg.selectAll('.circle-node')
                    .data(groupedData)
                    .enter()
                    .append('circle')
                    .attr('class', 'circle-node')
                    .attr('cx', d => x(d.name) + x.bandwidth() / 2)
                    .attr('cy', d => y(d.value))
                    .attr('r', 4)
                    .attr('fill', 'blue')
                    // .on("mouseover", function (event, d) {
                    // const tooltipBox = d3.select(this.parentNode)
                    // .append("rect")
                    // .attr("class", "tooltip-box")
                    // .attr("x", x(d.year) + x.bandwidth() / 2 - 70)
                    // .attr("y", y(d.value) - 70)
                    // .attr("height", 40)
                    // .attr("width", 140)
                    // .attr("fill", "white")
                    // d3.select(this.parentNode)
                    // .append("text")
                    // .attr("class", "tooltip-text")
                    // .attr("x", x(d.year) + x.bandwidth() / 2)
                    // .attr("y", y(d.value) - 45)
                    // .attr("text-anchor", "middle")
                    // .text(`Value: ${d.value}`)
                    // .style("fill", "red");
                    // d3.select(this.parentNode)
                    // .append("text")
                    // .attr("class", "tooltip-text")
                    // .attr("x", x(d.year) + x.bandwidth() / 2)
                    // .attr("y", y(d.value) - 30)
                    // .attr("text-anchor", "middle")
                    // .text(`${barLabel}: ${d.year}`)
                    // .style("fill", "red");
                    // })
                    .on("mouseover", function (event, d) {
                        showTooltip(event, d)
                    })
                    .on("mousemove", function (event, d) {
                        showTooltip(event, d)
                    })
                    .on("mouseout", function (event, d) {
                        d3.select(".tooltip").remove()
                        d3.select(this.parentNode).selectAll(".tooltip-box").remove();
                        d3.select(this.parentNode).selectAll(".tooltip-text").remove();
                    });

            }

            function zoomed(event) {
                const transform1 = event.transform;
                zoomState = { k: transform1.k, x: transform1.x, y: transform1.y };

                setZoomedData(zoomState)
                d3.selectAll(".tooltip-text").remove();
                d3.selectAll(".tooltip-box").remove();
                const delta = event.sourceEvent?.deltaX;
                const newXDomain = x.domain().map(d => { return d });
                const newXScale = x.domain(newXDomain);
                x.range([marginLeft, containerWidth - marginRight].map(d => event.transform.applyX(d)));

                svg.selectAll(".bar")
                    .attr("x", d => x(d.name))
                    .attr("width", x.bandwidth());



                d3.select(".tooltip").remove()
                d3.select(this.parentNode).selectAll(".tooltip-box").remove();
                d3.select(this.parentNode).selectAll(".tooltip-text").remove();
                d3.selectAll(".tooltip-text").remove();
                d3.selectAll(".tooltip-box").remove();




                svg.selectAll(".x-axisLabels").remove()
                svg.selectAll('path').remove()
                svg.selectAll('.circle-node ,.square-node').remove()
                svg.selectAll('.bar-label').remove()
                svg.selectAll('.x-grid').remove()
                svg.selectAll('.y-grid').remove()
                svg.selectAll('.domain , line').remove()
                svg.selectAll('.grid').remove();


                // .call(d3.axisBottom(newXScale));


                const axisLabels = svg.append('g')

                    .attr("transform", `translate(0,${containerHeight - marginBottom})`)
                    .call(d3.axisBottom(newXScale))
                    .selectAll('text')

                axisLabels.style("text-anchor", "end") // Align text to the end for rotated labels
                    .attr("font-size", "12px")
                    .attr("transform", "rotate(-90)") // Rotate text by 90 degrees
                    .attr("dx", "-0.8em") // Horizontal offset for rotated text
                    .attr("dy", "-0.4em") // Vertical offset for rotated text
                    .attr('fill', 'black')
                    .style("text-transform", "capitalize")
                    .style("font-weight", (d, i) => (i % 2 === 0 ? "normal" : "normal")) //bold
                    .style("cursor", "pointer")
                    .attr('class', `x-axisLabels`)
                    .attr('opacity', 0.7)
                    .text(function (d) {
                        return truncateText(String(d), 6); // Truncate text to a fixed maximum length (e.g., 6 characters)
                    })

                // Add tooltips for full text
                axisLabels.each(function (d) {
                    const label = d3.select(this);

                    // Add tooltip showing the full label
                    label.append("title").text(d);
                });




                displayLine()
                displayValues()

                if (showGridenabled) {
                    // svg.insert('g', ".bar")
                    // .selectAll("line")
                    // .attr('class', 'x-grid')
                    // .data(mod_data)
                    // .join("line")
                    // .attr("x1", (d) => x(d.year) + x.bandwidth() / 2)
                    // .attr("x2", (d) => x(d.year) + x.bandwidth() / 2)
                    // .attr("y1", marginTop)
                    // .attr("y2", containerHeight - marginBottom)
                    // .attr("stroke", "lightgrey");
                    svg.insert('g', ".bar")
                        .attr('class', 'y-grid')

                        .attr('transform', `translate(${marginLeft},${marginTop - marginBottom + 10})`)
                        .call(d3.axisLeft(y)
                            .tickSize(-(containerWidth - marginLeft - marginRight))
                            .tickFormat('')
                            .ticks(5)
                        )
                    svg.selectAll('.y-grid .tick line')
                        .attr('class', 'y-grid-line')
                        .attr('stroke', 'lightgrey')
                }



                // Add a clipping mask to restrict rendering outside the chart area
                svg.append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("x", marginLeft)
                    .attr("y", marginTop)
                    .attr("width", containerWidth - marginLeft - marginRight)
                    .attr("height", containerHeight);

                // svg.selectAll(".bar").attr("clip-path", "url(#clip)");
                // svg.selectAll(".circle-node, .square-node , .domain, line, ").attr("clip-path", "url(#clip)");
                // svg.selectAll("g").attr("clip-path", "url(#clip)");

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
                    .attr("x", d => x(d.name))
                    .attr("width", x.bandwidth())

                svg.select(".x-axis").call(d3.axisBottom(x));
                svg.select(".y-axis").call(d3.axisLeft(y));

                svg.selectAll('path').remove();
                svg.selectAll('.circle-node, .square-node').remove();
                svg.selectAll('.bar-label').remove();
                svg.selectAll('.x-grid').remove();
                svg.selectAll('.y-grid').remove();
                svg.selectAll('.domain, line').remove();
                svg.selectAll('.grid').remove();


                displayLine()
                displayValues()


                if (showGridenabled) {
                    svg.insert('g', ".bar")
                        .selectAll("line")
                        .data(mod_data)
                        .join("line")
                    // .attr('class', 'x-grid')
                    // .attr("x1", d => x(d.year) + x.bandwidth() / 2)
                    // .attr("x2", d => x(d.year) + x.bandwidth() / 2)
                    // .attr("y1", marginTop)
                    // .attr("y2", containerHeight - marginBottom)
                    // .attr("stroke", "lightgrey");

                    svg.insert('g', ".bar")
                        .attr('class', 'y-grid')
                        .attr('transform', `translate(${marginLeft},${marginTop - marginBottom + 10})`)
                        .call(d3.axisLeft(y)
                            .tickSize(-(containerWidth - margin.left - margin.right))
                            .tickFormat('')
                            .ticks(5)
                        );

                    svg.selectAll('.y-grid .tick line')
                        .attr('class', 'y-grid-line')
                        .attr('stroke', 'lightgrey');
                }
            };

            if (i === reportSlice.resetCharts.i) {
                handleResetButtonClick();
                dispatch(setResetCharts([]));

            } else {
                handleResetButtonClick();
                dispatch(setResetCharts([]));
            }

        }


        // }, [props , chartsLoad , mouseoverEnabled , showGridenabled , showLine , showValues , show_Square , curved_line , barYLabel , enable_table])
    },

        [data, props.containerWidth, reportSlice.resetCharts.i === i, reportSlice[i], containerHeight, enable_table, temp_containerHeight, containerHeight, showGridenabled, props.chart_color, mouseoverEnabled, showLine, showValues,
            curved_line,
            barYLabel, BarWidth, handlefullscreen, svgHeight, show_Legend, temp_containerWidth , chartWidth , choosedColors , reportSlice[i]?.horbarsorted]

    )



    // }, !downloadStatus ? [reportSlice] : [props , data , containerWidth , chartsLoad ])

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

    const truncateText = (text, maxLength) => {
        if (!text || typeof text !== 'string') return ''; // Handle null/undefined or non-string values
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    const showTableFunc = async (val1, TData) => {
        var val = true
        if (val1) {
            setEnabledTable(true)
            await tabulate(TData, tableColumns)
        }
    }

    const tabulate = async (data, columns, y_axis_name) => {
        y_axis_name = y_axis_name ? y_axis_name : yLabelname;
        const header = [xLabel, y_axis_name];

        var data_exist;
        if (data !== undefined) {
            data_exist = data;
        } else {
            data_exist = chart_data;
        }
        // console.log('data_exist :>> ', data_exist);
        var tableContainer = document.getElementById(`tableContainer${i}`);
        if (tableContainer !== null) {
            tableContainer.innerHTML = "";
        }

        // console.log('tableContainer 1952 :>> ', tableContainer);
        var table = d3.selectAll(`#tableContainer${i}`)
            .attr("class", "table-responsive")
            .append("table")
        // .style("width", `${fullScreen_enabled ? props.temp_containerWidth + 200 : (props.containerWidth)}px`)

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
                            <svg ref={chartRef}  height={(fullScreen_enabled ? temp_containerHeight - 300 : containerHeight)}>
                            </svg>
                        </div>
                    </div>
                    {
                        show_Legend ?
                            <div 
                            // className="legend"
                            className={`legend ${fullScreen_enabled ? "my-4" : ""}`}
                            id={`legend${i}`} style={{ position: '', display: 'flex', flexDirection: 'row', alignItems: 'centre', marginLeft: (fullScreen_enabled ? temp_containerWidth : props.containerWidth) / 2,  boxShadow: 'none' }}></div>
                            : null
                    } 
                </>
                :
                <div className="chart-skeleton" style={{ width: props.containerWidth, height: containerHeight }}>
                    <div className="skeleton-chart" style={{ height: containerHeight * 0.8 }}>
                        <div className="skeleton-bar" style={{ height: "40%" }}></div>
                        <div className="skeleton-bar" style={{ height: "70%" }}></div>
                        <div className="skeleton-bar" style={{ height: "50%" }}></div>
                        <div className="skeleton-bar" style={{ height: "80%" }}></div>
                        <div className="skeleton-bar" style={{ height: "60%" }}></div>
                    </div>
                </div>

            }

            {isLoading &&
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>}

            {(props.show_table && chartsLoad) ? (
                <>
                    <div style={{
                        position: 'relative',
                        bottom: 0,
                        left: 0,
                        backgroundColor: '#fff',
                        height: (fullScreen_enabled ? '240px' : '200px'),
                    }} id={`tableContainer${i}`}>
                    </div>
                </>
            ) : null}
        </div >
    );
};

export default BarChart;
