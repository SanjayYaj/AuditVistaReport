import React, { useState, useEffect, useRef, useCallback } from "react"; //Jose Anna Code
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2';
import SidePanel from '../ReportD3/Components/SidePanel';
import { Responsive, WidthProvider } from 'react-grid-layout';
import * as d3 from 'd3';
import one_row from '../../assets/images/Reportimages/row.jpg'
import two_col from '../../assets/images/Reportimages/2-col.jpg'
import three_col from '../../assets/images/Reportimages/3-col.jpg'

import barChart from '../../../src/assets/images/Reportimages/crp_bar.png'
import hor_barChart from '../../../src/assets/images/Reportimages/Picsart_24-01-25_19-04-12-866.jpg'
import areaChart from '../../../src/assets/images/Reportimages/crp_Areas.png'
import stackChart from '../../../src/assets/images/Reportimages/crp_stack.png'
import hor_stackChart from '../../../src/assets/images/Reportimages/Picsart_24-01-25_19-06-10-286.png'
import lineChart from '../../../src/assets/images/Reportimages/crp_linechrt.png'
import rectangle from '../../assets/images/Reportimages/png-clipart-rectangle-shape-shape-angle-rectangle-thumbnail.png'

import BarChart from '../ReportD3/Components/D3Charts/BarChart';
import StackChart from '../ReportD3/Components/D3Charts/StackChart';
import AreaChart from '../ReportD3/Components/D3Charts/AreaChart';
import PieChart from '../ReportD3/Components/D3Charts/PieChart';
import LineChart from "../ReportD3/Components/D3Charts/LineChart";
import HorizontalbarChart from '../ReportD3/Components/D3Charts/HorizontalBarChart';
import HorizontalStackChart from '../ReportD3/Components/D3Charts/HorizontalStackChart';
import VerticalLineChart from '../ReportD3/Components/D3Charts/VerticalLineChart';
import D3Table from "../ReportD3/Components/D3Charts/D3Table";

import surgurulogo from "../../assets/images/Reportimages/surguru-logo-transparent.png"
import Breadcrumbs from "../../components/Common/D3Breadcrumb";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { tToggle } from "../../components/VerticalLayout/Header";

import RectangleCardLayout from "../ReportD3/Components/D3Charts/RectangleCardLayout";

import { Row, Col, Container, Label, CardBody, Card, DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem, UncontrolledTooltip, } from "reactstrap";
import { Input, Popconfirm, Spin } from 'antd';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDispatch, useSelector } from 'react-redux';



import { usePermissions } from 'hooks/usePermisson';

    const {canEdit,canView} = usePermissions("report")


import {
    sortInfo, sortFunc, sortDescending, setDownloadStatus, imgDownloadSvg, imgDownloadCsv, imgDownloadPng, barSorting,
    barDescending, updateChartData, setZoomOutStatus, setZoomInStatus, setResetCharts, setRangeStatus, sortArea,
    toggleProcessingState, updateLayoutInfo, createLayout, setSaveData, setXaxisFilterValue, updateLayoutData, setBreakpoints,
    retriveClnKeys, setqueryFilter, retrivePageLayout, setupdatedSliceData, updateSliceFilter, FilterStartDate, FilterEndtDate, resetState, retriveSlicerLayout, setNoLayoutdata , setSelectedSortredux,
    setSelectedValuesRedux
} from '../../Slice/reportd3/reportslice';

import Slicer from "./Components/Slicer";
import store from '../../store';
import "./LayoutInfo.css"
import { isUndefined } from "lodash";
import { isEmptyArray } from "formik";
import { v4 as uuidv4 } from 'uuid';
import { Rectangle } from "recharts";



const ResponsiveGridLayout = WidthProvider(Responsive);


const LayoutHeader = ({
    item,
    convertChart,
    onlayoutClick,
    showTableFunc,
    delBlock,
    index1,
    isFullScreen,
    handleToggleFullScreen,
    exitScreen,
    layout,
    sessionInfo,
    mathOperation,
}) => {
    console.log('itemData', item)
    const dispatch = useDispatch();

    const authInfo = useSelector((state) => state.auth);
    const report_math_operations = authInfo.report_math_operations;
    const rangeStatus = useSelector(state => state.reportSliceReducer.rangeStatus);


    const selectedsortredux = useSelector(state => state.reportSliceReducer.selectedsortredux);
    console.log('selectedsortredux :>> ', selectedsortredux);

    const [selectedValues, setSelectedValues] = useState([]);
    const [arrValues, setArrValues] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [selectedSort, setSelectedSort] = useState(selectedsortredux || []);



    const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

    const default_bar_chart_values = [
        { name: 2010, value: 20 },
        { name: 2011, value: 40 },
        { name: 2012, value: 10 },
        { name: 2013, value: 60 },
        { name: 2014, value: 30 },
        { name: 2015, value: 50 },
    ];

    const default_stack_chart_values = [
        { name: 2010, value1: 20, value2: 10, value3: 30 },
        { name: 2011, value1: 40, value2: 20, value3: 50 },
        { name: 2012, value1: 10, value2: 30, value3: 20 },
        { name: 2013, value1: 60, value2: 40, value3: 10 },
        { name: 2014, value1: 30, value2: 50, value3: 40 },
        { name: 2015, value1: 50, value2: 30, value3: 60 },
    ];


    const default_line_chart_values = [
        { name: "2010", value: "20" },
        { name: "2011", value: "40" },
        { name: "2012", value: "10" },
        { name: "2013", value: "60" },
        { name: "2014", value: "30" },
        { name: "2015", value: "60" },
    ];

    const default_area_chart_values = [
        { name: "2001", value: "10" },
        { name: "2010", value: "20" },
        { name: "2011", value: "40" },
        { name: "2012", value: "10" },
        { name: "2013", value: "60" },
        { name: "2014", value: "30" },
        { name: "2015", value: "50" },
    ];

    const default_pie_chart_values = [
        { name: "A", count: 20 },
        { name: "B", count: 40 },
        { name: "C", count: 10 },
        { name: "D", count: 60 },
        { name: "E", count: 30 },
    ];

    const default_table_chart_values = [
        { name: 2010, value1: 20, value2: 10, value3: 30 },
        { name: 2011, value1: 40, value2: 20, value3: 50 },
        { name: 2012, value1: 10, value2: 30, value3: 20 },
        { name: 2013, value1: 60, value2: 40, value3: 10 },
        { name: 2014, value1: 30, value2: 50, value3: 40 },
        { name: 2015, value1: 50, value2: 30, value3: 60 },
    ];

    const defaultValues = {
        bar_charts: default_bar_chart_values,
        hor_barcharts: default_bar_chart_values,

        stack_bar: default_stack_chart_values,
        hor_stack: default_stack_chart_values,

        line_chart: default_line_chart_values,
        Vertical_linechart: default_line_chart_values,

        area_chart: default_area_chart_values,

        pie_chart: default_pie_chart_values,

        table: default_table_chart_values,
    };

    const chartValues = Object.fromEntries(
        Object.entries(defaultValues).map(([key, defaultValue]) => [
            key,
            item.name === key && item?.data?.length > 0 ? item.data : defaultValue
        ])
    );

    const downloadTypes = [
        { id: 1, name: 'Download as CSV' },
        { id: 2, name: 'Download as SVG' },
        { id: 3, name: 'Download as PNG' },
    ];

    const sortingTypes = [
        { id: 1, name: 'Sort Ascending', key: 'accending' },
        { id: 2, name: 'Sort Descending', key: 'decending' },
        { id: 3, name: 'Default Sorting', key: 'default' },
    ];

    const rangeInputs = [
        { name: 'cornerRadius', label: 'Corner Radius', min: 0, max: 40, step: 1, value: rangeStatus[item.i]?.cornerRadius?.value || 0 },
        { name: 'innerRadius', label: 'Inner Radius', min: 0, max: 100, step: 1, value: rangeStatus[item.i]?.innerRadius?.value || 0 },
        { name: 'padAngle', label: 'Pad Angle', min: 0, max: 0.5, step: 0.01, value: rangeStatus[item.i]?.padAngle?.value || 0 },
        { name: 'ChartSize', label: 'Pie Size', min: isFullScreen ? item.temp_containerHeight / 2: item.containerHeight / 2, max:  isFullScreen ? item.temp_containerHeight  :item.containerHeight, id: "sizeSlider", value: rangeStatus[item.i]?.ChartSize?.value || 320 },
    ];


    useEffect(()=>{
        console.log("selectedValues[[[[[]]]]] -----> ",selectedValues , item.i );
        if(selectedValues.length > 0 ){
        dispatch(setSelectedValuesRedux({ chart_id :  item.i , key: selectedValues }));
        
        }
    } , [ selectedValues ])

    function getChartKeys(chartName, item, yearKey = 'name', excludeKey = '_id') {
        const chartData = (item?.data?.length > 0 ? item.data : defaultValues[chartName]) || [];
        if (chartData.length === 0) {
            return { datakeys_name: [], datakeys: [] };
        }

        const data = chartData[0];
        return {
            datakeys_name: Object.keys(data).filter((key) => key === yearKey && key !== excludeKey),
            datakeys: Object.keys(data).filter((key) => key !== yearKey && key !== excludeKey),
        };
    }

    const downloadChart = async (data, id, chart_name,) => {
        const validChartNames = [
            'bar_charts', 'line_chart', 'pie_chart', 'stack_bar',
            'hor_barcharts', 'area_chart', 'hor_stack',
            'Vertical_linechart', 'table'
        ];

        try {
            dispatch(setDownloadStatus(true));
            if (validChartNames.includes(chart_name) && [1, 2, 3].includes(data.id)) {
                const { datakeys_name, datakeys } = getChartKeys(chart_name, item);

                const downloadActions = {
                    1: () => dispatch(imgDownloadCsv('0', datakeys_name, datakeys, chartValues[chart_name], chart_name)),
                    2: () => dispatch(imgDownloadSvg(`my_dataviz${id}`, chart_name)),
                    3: () => dispatch(imgDownloadPng(id, chart_name)),
                };

                await downloadActions[data.id]();
            }
        } finally {
            setDropdownOpen(false);
            dispatch(setDownloadStatus(false));
        }
    };


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





    const handleChartSorting = async (data, item) => {

        var chart_id = item.i;
        var chartName = item.name;
        const chartData = defaultValues[item.name];

        var group_Data;
        if (item.data) {
            group_Data = item.data
            console.log('group_Data 272 :>> ', group_Data);
        }

        console.log('data.id :>> ', data.id);
        if (chartName === 'bar_charts' || chartName === 'hor_barcharts') {
            if (data.id === 1) {
                dispatch(barSorting({ data: group_Data ?? chartData, chart_id }));
            }
            if (data.id === 2) {
                dispatch(barDescending({ data: group_Data ?? chartData, chart_id }));
            }
            if (data.id === 3) {
                dispatch(sortInfo({ data: group_Data ?? chartData, chart_id: chart_id }));
            }
        } else {

            console.log('data.id :>> ', data.id , arrValues);
            if (data.id === 1) {
                dispatch(sortFunc({ data: group_Data ?? chartData, arrValues, chart_id }));
            }
            if (data.id === 2) {
                dispatch(sortDescending({ data: group_Data ?? chartData, arrValues, chart_id }));
            }
            if (data.id === 3) {
                dispatch(sortArea({ data: group_Data ?? chartData, chart_id: chart_id }));
            }
        }
        setSelectedSort(data.key);
        console.log('data.key :>> ', data.key, chart_id);

        // dispatch(setSelectedSortredux(data.key));
        dispatch(setSelectedSortredux({ chart_id, key: data.key }));


    };


    const resetChart = (item) => {
        // console.log('resetChart item :>> ', item);
        dispatch(setResetCharts(item));
    }

    const sortCheck = (e, value) => {
        console.log('value  sortCheck:>> ', value);
        if (e.target.checked) {
            setArrValues((prev) => [...new Set([...prev, value])]);
            setSelectedValues((prev) => [...new Set([...prev, value])]);
            // dispatch(setSelectedValuesRedux({ chart_id, key: data.key }));


        } else {
            setArrValues((prev) => prev.filter((val) => val !== value));
            setSelectedValues((prev) => prev.filter((val) => val !== value));
            // dispatch(setSelectedValuesRedux({ chart_id, key: data.key }));

        }
    };


    const handlerangeChange = (value, ID, fieldName,) => {
        dispatch(setRangeStatus({ value, ID, fieldName }));
    };



    return (
        <>
            <div className="left-section">
                <i className="bx bx-move drag-handle icon-hover" title="Drag" />
                <p> {item.chart_name?.toUpperCase()} </p>
                {/* <p> {item.name !== 'rectangle_card' ? item.chart_name?.toUpperCase() : item.text?.toUpperCase()} </p> */}

            </div>

            {/* <div className="right-section" style={{ border: item.name !== undefined ? '1px solid lightgray' : 'none' }} > */}
            <div className="right-section"   style={{ marginRight : `${isFullScreen  ?' 30px' :'' }`}}>



                {!isUndefined(item.name) && item.name !== "" && (
                    <>

                        {item.name !== 'rectangle_card' &&
                            <>

                                {item.name === 'pie_chart' && (


                                    <div className="chart-dropdown">

                                        <UncontrolledDropdown style={{ position: 'relative', display: 'inline-block' }}>
                                            <DropdownToggle
                                                tag="a"
                                                className="chart-icon-toggle"
                                                role="button"
                                            >
                                                <i className="bx bx-filter icon-hover mt-1" style={{ fontSize: '20px' }} title="Filter" />
                                            </DropdownToggle>
                                            <DropdownMenu
                                                className="p-3 shadow-sm border-0 rounded"
                                                style={{
                                                    minWidth: '180px',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                    
                                                }}
                                            >
                                                <div className="d-flex justify-content-end">
                                                    <span> <i className="bx bx-reset icon-hover" title="reset" onClick={() => handlerangeChange('reset', item.i)} /> </span>
                                                </div>

                                                {rangeInputs.map((input, index) => (
                                                    <div key={index} className="mb-3">
                                                        <label
                                                            className="d-block fs-6 fw-medium"
                                                            style={{ fontFamily: 'Arial, sans-serif' }}
                                                        >
                                                            <span>{input.label}</span>
                                                            <input
                                                                type="range"
                                                                name={input.name}
                                                                min={input.min}
                                                                max={input.max}
                                                                step={input.step}
                                                                value={input.value}
                                                                onChange={(e) => handlerangeChange(e.target.value, item.i, input.name)}
                                                                className="w-100 mt-2"
                                                                style={{
                                                                    background: `linear-gradient(to right, var(--bs-primary) ${((input.value - input.min) / (input.max - input.min)) * 100}%, transparent ${((input.value - input.min) / (input.max - input.min)) * 100}%)`,
                                                                    appearance: 'auto',
                                                                    height: '4px',
                                                                    borderRadius: '2px',
                                                                    cursor: 'pointer',
                                                                    accentColor: '#007bff',
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                ))}
                                            </DropdownMenu>
                                        </UncontrolledDropdown>

                                    </div>
                                )}

                             { item.name !== 'table' && <i className={`bx ${item.show_table ? 'bx-notification-off' : 'bx bx-table'} icon-hover ms-1`} title="Table"
                                    onClick={async (e) => { sessionStorage.setItem('blockdata', JSON.stringify(item)); sessionStorage.setItem('blockIdx', JSON.stringify(index1)); showTableFunc(e, item, index1, layout); }} />}

                                <i className={`bx ${isFullScreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'} icon-hover`} title={!isFullScreen ? "Full Screen" : 'Exit'}
                                    onClick={() => { !isFullScreen ? handleToggleFullScreen(item.i, item, layout, index1) : exitScreen(item.i, index1) }} />



                                {!(item.name === 'pie_chart') &&
                                    <div className="chart-dropdown">
                                        <UncontrolledDropdown>
                                            <DropdownToggle tag="a" className="chart-icon-toggle" role="button">
                                                <i className="bx bx-bar-chart-alt-2 icon-hover mt-1" title="Chart" />
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                {[
                                                    { name: 'Stack', key: 'stack_bar' },
                                                    { name: 'Bar Chart', key: 'bar_charts' },
                                                    { name: 'Area', key: 'area_chart' },
                                                    { name: 'LineChart', key: 'line_chart' },
                                                    { name: 'Horizontal Bar chart', key: 'hor_barcharts' },
                                                    { name: 'Horizontal Stack chart', key: 'hor_stack' },
                                                    { name: 'Vertical Line chart', key: 'Vertical_linechart' },
                                                    { name: 'Table', key: 'table' },
                                                ].map((chart, idx) => (
                                                    <DropdownItem
                                                        key={idx}
                                                        href="#"
                                                        draggable="false"
                                                        onClick={() => convertChart(chart.key, item, index1)}
                                                        style={{
                                                            backgroundColor: item.chart_name === chart.key ? '#556ee6' : 'transparent',
                                                            fontWeight: item.chart_name === chart.key ? 'bold' : 'normal',
                                                            color: item.chart_name === chart.key ? '#fff' : 'inherit',
                                                        }}
                                                    >
                                                        {chart.name}
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                }


                                {!(item.name === 'pie_chart') && (
                                    <div className="chart-dropdown">
                                        <UncontrolledDropdown>
                                            <DropdownToggle tag="a" className="chart-icon-toggle" role="button">
                                                <i className="bx bx-calculator icon-hover mt-1" title="Calculation" />
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                {report_math_operations?.map((ele, pos) => {
                                                    // var isDisabled = item.data[0] && item.data[0][item.math_calc] ? true : false;
                                                    // var isDisabled = Array.isArray(item.data) && item.data[0] && item.data[0][item.math_calc] ? true : false;
                                                    var isDisabled = item.configured !== undefined ? false : true

                                                    return (
                                                        <DropdownItem
                                                            key={pos}
                                                            onClick={(e) => mathOperation(item, String(ele.id), ele)}
                                                            href="#"
                                                            disabled={isDisabled}
                                                            style={{

                                                                backgroundColor:
                                                                    (item.math_calc)?.toUpperCase() === String(ele.name) ? '#556ee6' : 'transparent',
                                                                fontWeight:
                                                                    (item.math_calc)?.toUpperCase() === String(ele.name) ? 'bold' : 'normal',
                                                                color:
                                                                    (item.math_calc)?.toUpperCase() === String(ele.name) ? '#fff' : 'inherit',


                                                                cursor: isDisabled ? 'not-allowed' : 'pointer', // Change cursor for disabled items
                                                                filter: isDisabled ? 'grayscale(100%)' : 'none', // Apply greyscale for disabled items
                                                                opacity: isDisabled ? 0.6 : 1, // Dim the disabled item

                                                            }}
                                                        >
                                                            {ele.name}
                                                        </DropdownItem>
                                                    )
                                                })}
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>)
                                }

                                <div className="chart-dropdown">
                                    <UncontrolledDropdown isOpen={dropdownOpen} toggle={toggleDropdown} >
                                        <DropdownToggle
                                            tag="a"
                                            className="chart-icon-toggle"
                                            role="button"
                                        >
                                            <i className="bx bx-download icon-hover mt-1" title="Download" />
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-end" >
                                            {downloadTypes.map((data, index) => (
                                                <DropdownItem
                                                    id={`ChartArea${item.i}`}
                                                    key={index}
                                                    href="#"
                                                    draggable="false"
                                                    onClick={() => downloadChart(data, item.i, item.name,)}
                                                >
                                                    {data.name}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>

                                    </UncontrolledDropdown>
                                </div>


                                {!(item.name === 'pie_chart' || item.name === 'table') &&
                                    <div className="chart-dropdown">
                                        <UncontrolledDropdown>
                                            <DropdownToggle tag="a" className="chart-icon-toggle" role="button">
                                                <i className="bx bx-sort icon-hover mt-1" title="Sort" />
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                {sortingTypes.map((data, key) => (
                                                    <DropdownItem
                                                        key={key}
                                                        href="#"
                                                        draggable="false"
                                                        disabled={isEmptyArray(selectedValues)}
                                                        onClick={() => handleChartSorting(data, item, item.i)}
                                                        style={{
                                                            cursor: 'pointer',
                                                            color: selectedsortredux[item.i] === data.key ? '#fff' : '',
                                                            backgroundColor: selectedsortredux[item.i] === data.key ? '#007bff' : '',
                                                            fontWeight: selectedsortredux[item.i]  === data.key ? 'bold' : 'normal'
                                                        }}

                                                    >
                                                        {data.name}
                                                    </DropdownItem>
                                                ))}
                                                <hr style={{ margin: 'revert' }}></hr>
                                                {(() => {
                                                    const chartData = (item?.data?.length > 0 ? item.data : defaultValues[item.name]) || [];
                                                    const { datakeys, datakeys_name } = getChartKeys(item.name, item);

                                                    // console.log('datakeys  533:>> ', datakeys, chartData);

                                                    if (chartData.length > 0 && datakeys.length > 0) {

                                                        return (
                                                            <div>
                                                                {/* {
                                                                    console.log('datakeys 535:>> ', datakeys)
                                                                } */}
                                                                {datakeys.map((value) => (
                                                                    <div
                                                                        key={value}
                                                                        style={{
                                                                            padding: '5px 10px',
                                                                            borderRadius: '4px',
                                                                            boxShadow: 'none',
                                                                            transition: 'background-color 0.3s',
                                                                        }}
                                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                    >
                                                                        <label style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            fontSize: '12px',
                                                                            cursor: 'pointer',
                                                                        }}>
                                                                            <input
                                                                                type="checkbox"
                                                                                value={value}
                                                                                defaultChecked={selectedValues.includes(value)}
                                                                                onChange={(e) => sortCheck(e, value)}
                                                                                style={{
                                                                                    marginRight: '8px',
                                                                                    marginLeft: '15px',
                                                                                    cursor: 'pointer',
                                                                                }}
                                                                            />
                                                                            <span style={{
                                                                                fontWeight: selectedValues.includes(value) ? 'bold' : 'normal',
                                                                                color: selectedValues.includes(value) ? '#007bff' : 'inherit',
                                                                            }}>
                                                                                {value.toUpperCase()}
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>


                                }
                                {
                                    (item.name === 'line_chart' || item.name === 'area_chart' || item.name === 'Vertical_linechart') && (
                                        <i className="bx bx-zoom-in icon-hover" title="Zoom In" onClick={() => dispatch(setZoomInStatus(item))} />
                                    )
                                }
                                {
                                    (item.name === 'line_chart' || item.name === 'area_chart' || item.name === 'Vertical_linechart') && (
                                        <i className="bx bx-zoom-out icon-hover" title="Zoom Out" onClick={() => dispatch(setZoomOutStatus(item))} />
                                    )
                                }
                                {
                                    !(item.name === 'pie_chart' || item.name === 'table') && (
                                        <i className="bx bx-revision icon-hover" id={`togglereset-${item.id}`} title="Refresh" onClick={() => resetChart(item)} />
                                    )
                                }
                            </>
                        }

                        {!isFullScreen &&
                            <div className="edit-button ms-1" style={{ border: item?.data !== undefined ? '1px solid red' : '1px solid lightgrey' }} onClick={(e) => {
                                onlayoutClick(item, index1, layout);
                                sessionStorage.setItem('blockdata', JSON.stringify(item));
                                sessionStorage.setItem('blockIdx', JSON.stringify(index1));
                            }}>
                                <i className="bx bx-edit-alt" title="Edit"></i>
                                <span>Edit</span>
                            </div>
                        }
                    </>
                )
                }

                {!isFullScreen &&
                    <Popconfirm placement="leftBottom" title="Are you sure to delete?" onConfirm={(e) => delBlock(e, item, index1)}>
                        <i className="bx bx-trash text-danger icon-hover" title="Delete" />
                    </Popconfirm>
                }
            </div>

        </>
    );
};



const dynamic_width = (itemId) => {
    // console.log("dynamic_width", itemId);
    let width = 0;
    const targetElement = document.getElementById(itemId);

    if (targetElement) {
        // Use getBoundingClientRect to get the actual width
        //   const rect = targetElement.getBoundingClientRect();
        //   width = rect.width;


        const style = targetElement.style;
        width = parseFloat(style.width);




    } else {
        console.error(`Element with ID ${itemId} not found`);
    }
    // console.log('width :>> ', width);
    return width;
};


const BarComponent = React.memo(({ item, index1, default_bar_chart_values }) => {
    return (
        <>
            {
                <div  >

                    <BarChart
                        BarWidth={item.barWidth}
                        load={item.charts_loaded}
                        temp_containerWidth={item.temp_containerWidth}
                        temp_containerHeight={item.temp_containerHeight}
                        // containerWidth={item.containerWidth}
                        containerWidth={dynamic_width(item.i) || item.containerWidth}
                        containerHeight={item.containerHeight}
                        chart_height={item?.chart_height !== undefined ? item.chart_height : undefined}
                        chart_data={item?.data === undefined ? default_bar_chart_values : item.filtered_data === undefined ? item.data : item.filtered_data}
                        chart_color={item?.chart_customize_clr !== undefined ? item.chart_customize_clr : 'steelblue'}
                        id={item.i}
                        repeat_chart={item.filtered_data === undefined ? false : true}
                        label={item?.x_axis_label !== undefined ? item.x_axis_label : 'label'}
                        YLabel={item?.y_axis_label !== undefined ? (item.y_axis_label === "" ? "Label" : item.y_axis_label) : "YLabel"}

                        mouseovered={item?.mouseovered !== undefined ? item.mouseovered : false}
                        mouseovered_type={item?.mouseovered_type !== undefined ? item.mouseovered_type : false}
                        show_Line={item?.show_Line !== undefined ? item.show_Line : false}
                        show_table={item?.show_table !== undefined ? item.show_table : false}
                        show_Full_Screen_toggle={item.fullScreen_enabled !== undefined ? item.fullScreen_enabled : false}
                        show_Grid={item.show_Grid !== undefined ? item.show_Grid : false}
                        show_bar_values={item?.show_bar_values !== undefined ? item.show_bar_values : false}
                        resized={item.resized}
                        show_Square={item?.show_Square !== undefined ? item.show_Square : false}
                        curved_line={item?.curved_line_chrt === undefined ? false : item.curved_line_chrt}
                        text_color={item?.text_customize_clr !== undefined ? item.text_customize_clr : []}
                        y_axis_key={item?.y_axis_key !== undefined ? item.y_axis_key : {}}

                        math_calc={item?.math_calc !== undefined ? item.math_calc : "sum"}
                        itemInfo={item}
                        indexes={index1}
                        show_Legend={item.show_Legend !== undefined ? item.show_Legend : false}

                    />
                </div>
            }
        </>
    )
},

    (prevProps, nextProps) => {

        return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item);
    }

)
BarComponent.displayName = "BarComponent";


const StackComponent = React.memo(({ item, index1, default_stack_chart_values }) => {
    return (
        <>
            {
                <div  >

                    <StackChart
                        BarWidth={item.barWidth}
                        temp_containerWidth={item.temp_containerWidth}
                        temp_containerHeight={item.temp_containerHeight}
                        // containerWidth={item.containerWidth}
                        containerWidth={dynamic_width(item.i) || item.containerWidth}

                        containerHeight={item.containerHeight}
                        chart_height={item?.chart_height !== undefined ? item.chart_height : ''}
                        chart_data={item?.data === undefined ? default_stack_chart_values : item.filtered_data === undefined ? item.data : item.filtered_data}
                        repeat_chart={item.filtered_data === undefined ? false : true}
                        chart_color={item?.chart_customize_clr_arr !== undefined ? item.chart_customize_clr_arr : []}
                        id={item.i}
                        label={item?.x_axis_label !== undefined ? item.x_axis_label : 'label'}
                        YLabel={item?.label_arr_data !== undefined ? item.label_arr_data : []}
                        mouseovered={item?.mouseovered !== undefined ? item.mouseovered : false}
                        mouseovered_type={item?.mouseovered_type !== undefined ? item.mouseovered_type : false}
                        show_Line={item?.show_Line !== undefined ? item.show_Line : false}
                        show_table={item?.show_table !== undefined ? item.show_table : false}
                        show_Full_Screen_toggle={item.fullScreen_enabled !== undefined ? item.fullScreen_enabled : false}
                        show_bar_values={item?.show_bar_values !== undefined ? item.show_bar_values : false}
                        show_Grid={item.show_Grid !== undefined ? item.show_Grid : false}
                        curved_line={item?.curved_line_chrt === undefined ? false : item.curved_line_chrt}
                        show_Square={item?.show_Square !== undefined ? item.show_Square : false}
                        resized={item.resized}
                        text_color={item?.text_customize_clr_arr !== undefined ? item.text_customize_clr_arr : []}

                        math_calc={item?.math_calc !== undefined ? item.math_calc : "sum"}

                        itemInfo={item}
                        indexes={index1}

                        show_Legend={item.show_Legend !== undefined ? item.show_Legend : false}

                        legend_categorys={item?.legend_categories !== undefined ? item.legend_categories : []}

                    />

                </div>
            }
        </>
    )
},

    (prevProps, nextProps) => {

        return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item);
    }

)
StackComponent.displayName = "StackComponent";


const AreaComponent = React.memo(({ item, index1, default_area_chart_values }) => {
    return (
        <>
            {
                <div  >

                    <AreaChart
                        temp_containerWidth={item.temp_containerWidth}
                        temp_containerHeight={item.temp_containerHeight}
                        // containerWidth={item.containerWidth}
                        containerWidth={dynamic_width(item.i) || item.containerWidth}

                        containerHeight={item.containerHeight}
                        chart_data={item?.data === undefined ? default_area_chart_values : item.filtered_data === undefined ? item.data : item.filtered_data}
                        repeat_chart={item.filtered_data === undefined ? false : true}
                        chart_height={item?.chart_height !== undefined ? item.chart_height : undefined}
                        chart_color={item?.chart_customize_clr_arr !== undefined ? item.chart_customize_clr_arr : undefined}
                        id={item.i}
                        label={item?.x_axis_label !== undefined ? item.x_axis_label : 'label'}
                        mouseovered={item?.mouseovered !== undefined ? item.mouseovered : false}
                        mouseovered_type={item?.mouseovered_type !== undefined ? item.mouseovered_type : false}
                        show_table={item?.show_table !== undefined ? item.show_table : false}
                        show_Grid={item.show_Grid !== undefined ? item.show_Grid : false}
                        show_Full_Screen_toggle={item.fullScreen_enabled !== undefined ? item.fullScreen_enabled : false}
                        YLabel={item?.label_arr_data !== undefined ? item.label_arr_data : []}
                        show_Square={item?.show_Square !== undefined ? item.show_Square : false}
                        curved_line={item?.curved_line_chrt === undefined ? false : item.curved_line_chrt}
                        show_bar_values={item?.show_bar_values !== undefined ? item.show_bar_values : false}
                        text_color={item?.text_customize_clr_arr !== undefined ? item.text_customize_clr_arr : []}

                        math_calc={item?.math_calc !== undefined ? item.math_calc : "sum"}


                        itemInfo={item}
                        indexes={index1}

                        show_Legend={item.show_Legend !== undefined ? item.show_Legend : false}

                        legend_categorys={item?.legend_categories !== undefined ? item.legend_categories : []}
                    />
                </div>
            }
        </>
    )
},

    (prevProps, nextProps) => {
        return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item);
    }
)
AreaComponent.displayName = "AreaComponent";


const LineComponenet = React.memo(({ item, index1, default_line_chart_values }) => {
    return (
        <>
            {
                <div  >

                    <LineChart
                        temp_containerWidth={item.temp_containerWidth}
                        temp_containerHeight={item.temp_containerHeight}
                        // containerWidth={item.containerWidth}
                        containerWidth={dynamic_width(item.i) || item.containerWidth}

                        containerHeight={item.containerHeight}
                        chart_height={item?.chart_height !== undefined ? item.chart_height : undefined}
                        chart_data={item?.data === undefined ? default_line_chart_values : item.filtered_data === undefined ? item.data : item.filtered_data}
                        repeat_chart={item.filtered_data === undefined ? false : true}
                        chart_color={item?.chart_customize_clr_arr !== undefined ? item.chart_customize_clr_arr : undefined}
                        curved_line={item?.curved_line_chrt === undefined ? false : item.curved_line_chrt}
                        id={item.i}
                        label={item?.x_axis_label !== undefined ? item.x_axis_label : 'label'}
                        mouseovered={item?.mouseovered !== undefined ? item.mouseovered : false}
                        mouseovered_type={item?.mouseovered_type !== undefined ? item.mouseovered_type : false}
                        show_table={item?.show_table !== undefined ? item.show_table : false}
                        show_Grid={item.show_Grid !== undefined ? item.show_Grid : false}
                        show_Full_Screen_toggle={item.fullScreen_enabled !== undefined ? item.fullScreen_enabled : false}
                        show_bar_values={item?.show_bar_values !== undefined ? item.show_bar_values : false}
                        YLabel={item?.label_arr_data !== undefined ? item.label_arr_data : []}
                        show_Square={item?.show_Square !== undefined ? item.show_Square : false}
                        text_color={item?.text_customize_clr_arr !== undefined ? item.text_customize_clr_arr : []}

                        math_calc={item?.math_calc !== undefined ? item.math_calc : "sum"}


                        itemInfo={item}
                        indexes={index1}

                        show_Legend={item.show_Legend !== undefined ? item.show_Legend : false}

                    />
                </div>
            }
        </>
    )
},

    (prevProps, nextProps) => {

        return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item);
    }
)
LineComponenet.displayName = "LineComponenet";


const RectangleCardComponent = React.memo(({ item, index1 }) => {


    return (
        <>
            {
                <div >

                    <RectangleCardLayout
                        chart_data={item?.data === undefined ? "9000" : item.filtered_data === undefined ? item.data : item.filtered_data}
                        id={item.i}
                        itemInfo={item}
                        indexes={index1}

                    />
                </div>
            }
        </>
    )
}, (prevProps, nextProps) => {

    return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item);
}
)
RectangleCardComponent.displayName = "RectangleCardComponent";




const PieComponent = React.memo(({ item, index1, default_pie_chart_values, requestInfo }) => {
    return (
        <>
            {
                <div  >

                    <PieChart
                        temp_containerWidth={item.temp_containerWidth}
                        temp_containerHeight={item.temp_containerHeight}
                        // containerWidth={item.containerWidth}
                        containerWidth={dynamic_width(item.i) || item.containerWidth}

                        containerHeight={item.containerHeight}
                        chart_height={item?.chart_height !== undefined ? item.chart_height : undefined}
                        chart_data={item?.data === undefined ? default_pie_chart_values : item.filtered_data === undefined ? item.data : item.filtered_data}
                        id={item.i}
                        label={item?.x_axis_label !== undefined ? item.x_axis_label : 'label'}
                        mouseovered={item?.mouseovered !== undefined ? item.mouseovered : false}
                        show_table={item?.show_table !== undefined ? item.show_table : false}
                        show_bar_values={item?.show_bar_values !== undefined ? item.show_bar_values : false}
                        show_Full_Screen_toggle={item.fullScreen_enabled !== undefined ? item.fullScreen_enabled : false}
                        itemInfo={item}
                        indexes={index1}
                        requestInfo={requestInfo}
                        show_Legend={item.show_Legend !== undefined ? item.show_Legend : false}

                    />

                </div>
            }
        </>
    )
},

    (prevProps, nextProps) => {
        return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item);
    }
)
PieComponent.displayName = "PieComponent";


const HorBarchartComponent = React.memo(({ item, index1, default_bar_chart_values }) => {
    return (
        <>
            {
                <div  >

                    <HorizontalbarChart
                        BarWidth={item.barWidth}
                        temp_containerWidth={item.temp_containerWidth}
                        temp_containerHeight={item.temp_containerHeight}
                        // containerWidth={item.containerWidth}
                        containerWidth={dynamic_width(item.i) || item.containerWidth}

                        containerHeight={item.containerHeight}
                        chart_height={item?.chart_height !== undefined ? item.chart_height : ''}
                        chart_data={item?.data === undefined ? default_bar_chart_values : item.filtered_data === undefined ? item.data : item.filtered_data}
                        chart_color={item?.chart_customize_clr !== undefined ? item.chart_customize_clr : '#4682b4'}
                        id={item.i}
                        label={item?.x_axis_label !== undefined ? item.x_axis_label : 'label'}
                        mouseovered={item?.mouseovered !== undefined ? item.mouseovered : false}
                        mouseovered_type={item?.mouseovered_type !== undefined ? item.mouseovered_type : false}
                        show_Line={item?.show_Line !== undefined ? item.show_Line : false}
                        show_table={item?.show_table !== undefined ? item.show_table : false}
                        show_Full_Screen_toggle={item.fullScreen_enabled !== undefined ? item.fullScreen_enabled : false}
                        show_Grid={item.show_Grid !== undefined ? item.show_Grid : false}
                        show_bar_values={item?.show_bar_values !== undefined ? item.show_bar_values : false}
                        curved_line={item?.curved_line_chrt === undefined ? false : item.curved_line_chrt}
                        show_Square={item?.show_Square !== undefined ? item.show_Square : false}
                        YLabel={item?.y_axis_label !== undefined ? item.y_axis_label : 'Ylabel'}
                        text_color={item?.text_customize_clr !== undefined ? item.text_customize_clr : []}

                        math_calc={item?.math_calc !== undefined ? item.math_calc : "sum"}

                        itemInfo={item}
                        indexes={index1}
                        show_Legend={item.show_Legend !== undefined ? item.show_Legend : false}
                        legend_categorys={item?.legend_categories !== undefined ? item.legend_categories : []}

                    />
                </div>
            }
        </>
    )
},

    (prevProps, nextProps) => {
        return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item);
    }
)
HorBarchartComponent.displayName = "HorBarchartComponent";


const HorStackBarComponent = React.memo(({ item, index1, default_stack_chart_values }) => {
    return (
        <>
            {
                <div  >

                    <HorizontalStackChart
                        temp_containerWidth={item.temp_containerWidth}
                        temp_containerHeight={item.temp_containerHeight}
                        // containerWidth={item.containerWidth}
                        containerWidth={dynamic_width(item.i) || item.containerWidth}

                        containerHeight={item.containerHeight}
                        chart_height={item?.chart_height !== undefined ? item.chart_height : undefined}
                        chart_data={item?.data === undefined ? default_stack_chart_values : item.filtered_data === undefined ? item.data : item.filtered_data}
                        chart_color={item?.chart_customize_clr_arr !== undefined ? item.chart_customize_clr_arr : undefined}
                        id={item.i}
                        label={item?.x_axis_label !== undefined ? item.x_axis_label : 'label'}
                        show_bar_values={item?.show_bar_values !== undefined ? item.show_bar_values : false}
                        mouseovered={item?.mouseovered !== undefined ? item.mouseovered : false}
                        mouseovered_type={item?.mouseovered_type !== undefined ? item.mouseovered_type : false}
                        show_table={item?.show_table !== undefined ? item.show_table : false}
                        show_Grid={item.show_Grid !== undefined ? item.show_Grid : false}
                        show_Full_Screen_toggle={item.fullScreen_enabled !== undefined ? item.fullScreen_enabled : false}
                        show_Line={item?.show_Line !== undefined ? item.show_Line : false}
                        curved_line={item?.curved_line_chrt === undefined ? false : item.curved_line_chrt}
                        show_Square={item?.show_Square !== undefined ? item.show_Square : false}
                        YLabel={item?.label_arr_data !== undefined ? item.label_arr_data : []}
                        text_color={item?.text_customize_clr_arr !== undefined ? item.text_customize_clr_arr : []}


                        math_calc={item?.math_calc !== undefined ? item.math_calc : "sum"}

                        itemInfo={item}
                        indexes={index1}

                        show_Legend={item.show_Legend !== undefined ? item.show_Legend : false}

                    />
                </div>
            }
        </>
    )
},
    (prevProps, nextProps) => {
        return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item);
    }
)
HorStackBarComponent.displayName = "HorStackBarComponent";


const VerticalChartComponenet = React.memo(({ item, index1, default_line_chart_values }) => {
    return (
        <>
            {
                <div  >

                    <VerticalLineChart
                        temp_containerWidth={item.temp_containerWidth}
                        temp_containerHeight={item.temp_containerHeight}
                        // containerWidth={item.containerWidth}
                        containerWidth={dynamic_width(item.i) || item.containerWidth}

                        containerHeight={item.containerHeight}
                        chart_height={item?.chart_height !== undefined ? item.chart_height : undefined}
                        chart_data={item?.data === undefined ? default_line_chart_values : item.filtered_data === undefined ? item.data : item.filtered_data}
                        chart_color={item?.chart_customize_clr_arr !== undefined ? item.chart_customize_clr_arr : undefined}
                        curved_line={item?.curved_line_chrt === undefined ? false : item.curved_line_chrt}
                        id={item.i}
                        label={item?.x_axis_label !== undefined ? item.x_axis_label : 'label'}
                        show_table={item?.show_table !== undefined ? item.show_table : false}
                        show_Grid={item.show_Grid !== undefined ? item.show_Grid : false}
                        show_Full_Screen_toggle={item.fullScreen_enabled !== undefined ? item.fullScreen_enabled : false}
                        show_bar_values={item?.show_bar_values !== undefined ? item.show_bar_values : false}
                        mouseovered={item?.mouseovered !== undefined ? item.mouseovered : false}
                        mouseovered_type={item?.mouseovered_type !== undefined ? item.mouseovered_type : false}
                        show_Square={item?.show_Square !== undefined ? item.show_Square : false}
                        show_node={item?.show_node !== undefined ? item.show_node : false}
                        YLabel={item?.label_arr_data !== undefined ? item.label_arr_data : []}
                        text_color={item?.text_customize_clr_arr !== undefined ? item.text_customize_clr_arr : []}

                        math_calc={item?.math_calc !== undefined ? item.math_calc : "sum"}

                        itemInfo={item}
                        indexes={index1}

                        show_Legend={item.show_Legend !== undefined ? item.show_Legend : false}

                    />

                </div>
            }
        </>
    )
},
    (prevProps, nextProps) => {
        return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item);
    }
)
VerticalChartComponenet.displayName = "VerticalChartComponenet";



const D3TableComponent = React.memo(({ item, index1, default_stack_chart_values }) => {
    return (
        <>
            {
                <div  >

                    <D3Table
                        containerWidth={dynamic_width(item.i) || item.containerWidth}
                        containerHeight={item.containerHeight}
                        show_table={true}
                        chart_data={item?.data === undefined ? default_stack_chart_values : item.filtered_data === undefined ? item.data : item.filtered_data}
                        id={item.i}
                        label_name={item?.label_arr_data === undefined ? '' : item.label_arr_data}
                        math_calc={item?.math_calc !== undefined ? item.math_calc : "sum"}
                        show_Full_Screen_toggle={item.fullScreen_enabled !== undefined ? item.fullScreen_enabled : false}

                        temp_containerWidth={item.temp_containerWidth}
                        temp_containerHeight={item.temp_containerHeight}

                        itemInfo={item}
                        indexes={index1}
                    />
                </div>
            }
        </>
    )
},
    (prevProps, nextProps) => {
        return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item);
    }
)
D3TableComponent.displayName = "D3TableComponent";




const LayoutInfo = () => {

    console.log('canEdit Admin :>> ', canEdit);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const slicerRef = useRef();
    const layoutRef = useRef(null)
    const refs = useRef({});
    const reportSlice = useSelector(state => state.reportSliceReducer);
    const treeDataSlice = useSelector(state1 => state1.treeData);

    const updatedSliceData = useSelector(state => state.reportSliceReducer.updatedSliceData);
    const [sliceCards, setSlicerCards] = useState(updatedSliceData)

    const layout = reportSlice.layoutInfo;
    const layoutId = reportSlice.layoutId;
    const authInfo = useSelector((state) => state.auth);

    const [targetBlock, settargetBlock] = useState(null);
    const [iconData, seticonData] = useState(null);
    const [iconName, seticonName] = useState(null);
    const [isResizing, setisResizing] = useState(false);
    const [charts, setcharts] = useState(false);
    const [grid, setGrid] = useState(false);
    const [Text, setText] = useState(false);
    const [selectMenu, setSelectMenu] = useState('1');
    const [isSidePanelOpen, setSidePanelOpen] = useState(false);
    const [sidepanelData, setSidepanelData] = useState([]);
    const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
    const [pageInfo, setpageInfo] = useState(JSON.parse(sessionStorage.getItem('page_data')))
    const [isFullScreen, setIsFullScreen] = useState(null);
    const [prvpage, setprvpage] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(true)
    const [filterLoading, setFilterLoading] = useState(false)

    const [AxisList, setaxisList] = useState([])

    const [dateAdded, setdateAdded] = useState(false)

    const [selectedItem, setSelectedItem] = useState(null); // To store the selected grid item
    const [copiedItem, setCopiedItem] = useState(null); // To store the copied item layout



    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };
    // const [startDate, setStartDate] = useState(getCurrentDate());
    // const [endDate, setEndDate] = useState(getCurrentDate());

    const [fullscreenSize, setFullscreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });


    const default_bar_chart_values =
        [
            {
                "name": "2010",
                "value": 20
            },
            {
                "name": "2011",
                "value": 40
            },
            {
                "name": "2012",
                "value": 10
            },
            {
                "name": "2013",
                "value": 60
            },
            {
                "name": "2014",
                "value": 30
            },
            {
                "name": "2015",
                "value": 50
            }
        ]

    const default_stack_chart_values = [
        {
            "name": '2010',
            "value1": 20,
            "value2": 10,
            "value3": 30
        },
        {
            "name": '2011',
            "value1": 40,
            "value2": 20,
            "value3": 50
        },
        {
            "name": '2012',
            "value1": 10,
            "value2": 30,
            "value3": 20
        },
        {
            "name": '2013',
            "value1": 60,
            "value2": 40,
            "value3": 10
        },
        {
            "name": '2014',
            "value1": 30,
            "value2": 50,
            "value3": 40
        },
        {
            "name": '2015',
            "value1": 50,
            "value2": 30,
            "value3": 60
        }
    ]



    // const default_stack_chart_values = [
    //     {
    //         sum: [{
    //             "year": 2010,
    //             "value1": 20,
    //             "value2": 10,
    //             "value3": 30
    //         },
    //         {
    //             "year": 2011,
    //             "value1": 40,
    //             "value2": 20,
    //             "value3": 50
    //         },
    //         {
    //             "year": 2012,
    //             "value1": 10,
    //             "value2": 30,
    //             "value3": 20
    //         },
    //         {
    //             "year": 2013,
    //             "value1": 60,
    //             "value2": 40,
    //             "value3": 10
    //         },
    //         {
    //             "year": 2014,
    //             "value1": 30,
    //             "value2": 50,
    //             "value3": 40
    //         },
    //         {
    //             "year": 2015,
    //             "value1": 50,
    //             "value2": 30,
    //             "value3": 60
    //         }]
    //     }
    // ]

    const default_line_chart_values = [
        {
            "name": "2010",
            "value": "20"
        },
        {
            "name": "2011",
            "value": "40"
        },
        {
            "name": "2012",
            "value": "10"
        },
        {
            "name": "2013",
            "value": "60"
        },
        {
            "name": "2014",
            "value": "30"
        },
        {
            "name": "2015",
            "value": "60"
        }
    ]

    const default_area_chart_values = [
        {
            "name": '2001',
            "value": 10
        },
        {
            "name": '2010',
            "value": 20
        },
        {
            "name": '2011',
            "value": 40
        },
        {
            "name": '2012',
            "value": 10
        },
        {
            "name": '2013',
            "value": 60
        },
        {
            "name": '2014',
            "value": 30
        },
        {
            "name": '2015',
            "value": 50
        },
        {
            "name": '2015',
            "value": 50
        }
    ]

    const default_pie_chart_values = [
        {
            "name": "A",
            "count": 20
        },
        {
            "name": "B",
            "count": 40
        },
        {
            "name": "C",
            "count": 10
        },
        {
            "name": "D",
            "count": 60
        },
        {
            "name": "E",
            "count": 30
        }
    ]

    // console.log('store.getState()?.auth?.db_info :>> ', store.getState()?.auth?.db_info);
    // console.log('1355 ', authInfo);

    const requestInfo = {
        dbInfo: authInfo.db_info,
        layoutId: layoutId,
        pageInfo: pageInfo,
        userInfo: authInfo?.userInfo
    }
    var getBreakPoints = {}

    useEffect(() => {
        // console.log("Report Slicer date ", reportSlice.endDate);
        const rowElement = 'my-specific-row'
        const rowElementId = document.getElementById(rowElement);
        const width = rowElementId?.offsetWidth;
        const height = rowElementId?.offsetHeight;
        getBreakPoints = calculateBreakpoints(width, height)
        dispatch(setBreakpoints(getBreakPoints))
        // dispatch(retrivePageLayout());

        if (reportSlice.endDate) {
            setDateRange([new Date(reportSlice.startDate) !== undefined ? new Date(reportSlice.startDate) : null, new Date(reportSlice.endDate) !== undefined ? new Date(reportSlice.endDate) : null]);
            // console.log('layout :>> ', layout);
            dispatch(updateLayoutInfo(layout))
            setdateAdded(true)
        }
        else {
            console.log("make the default date ");
            console.log("Setting default date range...");

            // Get today's date and calculate the last 7 days
            const today = new Date();
            const last7Days = new Date();
            last7Days.setDate(today.getDate() - 80);

            var mystrtDate = new Date("2021-01-01")
            var myendDate = new Date("2021-01-31")
            setDateRange([
                mystrtDate, // Default Start Date: 01-Jan-2021
                myendDate, // Default End Date: 02-Jan-2021
              ]);

            // console.log(last7Days, today , 'Dates');
            // Function to format date in required structure
            const formatDate = (date, timeSuffix) => {
                return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}${timeSuffix}`;
            };

            // Properly formatted dates
            const start_date = formatDate(mystrtDate, "T00:00:00Z");
            const end_date = formatDate(myendDate, "T23:59:59.999Z");

            // Log formatted dates
            // console.log("Start Date:", start_date);
            // console.log("End Date:", end_date);

            // console.log("Formatted Dates -> Start:", start_date, "| End:", end_date);
            dispatch(toggleProcessingState(undefined))
            dispatch(FilterStartDate(start_date))
            dispatch(FilterEndtDate(end_date))
            // tToggle(2);

            try {
                console.log('authInfo  1498:>> ', authInfo);
                dispatch(retrivePageLayout(authInfo, start_date, end_date, false , canEdit));
            } catch (error) {
                console.error("Error updating layout or retrieving page layout:", error);
            }
            finally {
                setdateAdded(true)
            }

        }
    }, [])


    useEffect(() => {
        setSlicerCards(updatedSliceData);

        // const xAxisKeys = layout
        //     .filter(item => item.x_axis_key !== undefined)
        //     .map(item => item.x_axis_key);

        // const yAxisKeys = layout.reduce((acc, item) => {
        //     // If y_axis_key exists and is an object, push its 'name' property
        //     if (item.y_axis_key && item.y_axis_key.name) {
        //       acc.yAxisKeyArr.push(item.y_axis_key.name);
        //     }

        //     // If y_axis_arr exists and is an array, add its distinct values
        //     if (Array.isArray(item.y_axis_arr)) {
        //       // Concatenate the array and remove duplicates using Set
        //       acc.yAxisArr = [...new Set([...acc.yAxisArr, ...item.y_axis_arr])];
        //     }

        //     return acc;
        //   }, { yAxisKeyArr: [], yAxisArr: [] });


        // // Extract unique values of name
        // const uniqueNamesX = [...new Set(xAxisKeys.map(item => item.name))];
        // const uniqueNamesY = [...new Set(yAxisKeys.yAxisKeyArr.map(item => item))]
        // console.log('Unique Names Parent Page:', uniqueNamesX , uniqueNamesY);


        // // Combine both unique names from x_axis and y_axis
        // const combinedUniqueNames = [...new Set([...uniqueNamesX, ...uniqueNamesY])];

        // // Log the combined unique names
        // console.log('Combined Unique Names (x_axis_key and y_axis_key):', combinedUniqueNames);



        // let processed = false;  // Flag to track if the process is already done




        // commenetd on 21 Jan 25
        // var combinedUniqueNames=[]
        // function processLayoutData(layout) {
        //     if (AxisList.length > 0) {
        //         console.log("Data has already been processed.");
        //         return;
        //     }

        //     // Extract x_axis_keys
        //     const xAxisKeys = layout
        //         .filter(item => item.x_axis_key !== undefined)
        //         .map(item => item.x_axis_key);

        //     // Extract y_axis_keys and distinct y_axis_arr
        //     const yAxisKeys = layout.reduce((acc, item) => {
        //         // If y_axis_key exists and has a 'name', push it to yAxisKeyArr
        //         if (item.y_axis_key && item.y_axis_key.name) {
        //             acc.yAxisKeyArr.push(item.y_axis_key.name);
        //         }

        //         // If y_axis_arr exists and is an array, add its distinct values to yAxisArr
        //         if (Array.isArray(item.y_axis_arr)) {
        //             acc.yAxisArr = [...new Set([...acc.yAxisArr, ...item.y_axis_arr])];
        //         }

        //         return acc;
        //     }, { yAxisKeyArr: [], yAxisArr: [] });

        //     // Extract unique values for x_axis_key (i.e., `name` in x_axis_key)
        //     const uniqueNamesX = [...new Set(xAxisKeys.map(item => item.name))];

        //     // Extract unique values for y_axis_key (i.e., name in y_axis_key)
        //     const uniqueNamesY = [...new Set(yAxisKeys.yAxisKeyArr.map(item => item))];

        //     console.log('Unique Names Parent Page:', uniqueNamesX, uniqueNamesY);

        //     // Combine both unique names from x_axis and y_axis
        //      combinedUniqueNames = [...new Set([...uniqueNamesX, ...uniqueNamesY])];

        //     // Log the combined unique names
        //     console.log('Combined Unique Names (x_axis_key and y_axis_key):', combinedUniqueNames);

        //     // Mark as processed to avoid running this logic again
        //     setaxisList(combinedUniqueNames)
        // }


        // if (combinedUniqueNames.length === 0 ) {
        //     // Run the process for the first time
        //     processLayoutData(layout);
        // }

    }, [reportSlice])


    useEffect(() => {
        console.log("filter useefeect called!!");
        setTimeout(() => {
            updateLayoutOnResize()

        }, 250);
    }, [selectMenu === '5' && sliceCards.length > 0])

    const updateLayoutOnResize = useCallback(async () => {

        console.log('layout 1587:>> ', layout);


        if (layout.length > 0) {
            const updatedLayout = layout.map((item) => {
                const element = document.getElementById(item.i);
                if (element) {
                    const { offsetWidth, offsetHeight } = element;
                    return {
                        ...item,
                        containerWidth: offsetWidth,
                        containerHeight: offsetHeight,
                    };
                }
                return item;
            });

            console.log('updatedLayout Resized :>> ', updatedLayout);
            await dispatch(updateLayoutInfo(updatedLayout))
            // setLayout(updatedLayout);
        }

    }, [layout]);



    // Attach resize event listener
    useEffect(() => {
        window.addEventListener("resize", updateLayoutOnResize);
        return () => {
            window.removeEventListener("resize", updateLayoutOnResize);
        };
    }, [updateLayoutOnResize, getBreakPoints]);




    const calculateBreakpoints = (width, height) => {
        if (width >= 1200 && height >= 800) {
            return { lg: 1200, md: 996, sm: 768, xs: 480 };
        } else if (width >= 996 && height >= 600) {
            return { lg: 996, md: 800, sm: 600, xs: 480 };
        } else if (width >= 768 && height >= 480) {
            return { lg: 768, md: 600, sm: 480, xs: 360 };
        } else {
            return { lg: width, md: width, sm: width, xs: width };
        }
    };

    const handleIconDragStart = (e, iconSrc, name) => {
        e.dataTransfer.setData('text/plain', iconSrc);
        seticonData(iconSrc)
        seticonName(name)
    };

    const handleDragOver = (e, item) => {
        e.preventDefault();
        settargetBlock(item);
    };




    const handleDropLayout = async (e, item) => {
        if (iconName === 'rectangle_card') {
            handleDropCard(e, item);
        } else {
            handleDrop(e, item);
        }
    }

    const updateLayoutItem = (layoutItem, iconName, width, height, itemIndex, updatedLayout) => {
        if (iconName === 'rectangle_card') {
            updatedLayout[itemIndex] = {
                ...layoutItem,
                name: iconName,
                card_name: iconName,
                text: '',
                count: '9001',
                h: 2,
                minH: 2,
                maxH: 2
            };
        } else if (iconName === 'table') {
            updatedLayout[itemIndex] = {
                ...layoutItem,
                name: iconName,
                Table: true,
                containerWidth: width,
                containerHeight: height,
            };
        } else {
            updatedLayout[itemIndex] = {
                ...layoutItem,
                imgSrc: iconName,
                name: iconName,
                chart_name: iconName,
                containerWidth: width,
                containerHeight: height,
            };
        }
    };

    const handleDrop = async (e, item) => {
        // console.log('layout handleDrop:>> ', layout, iconData);
        let updatedLayout = [...layout];
        e.preventDefault();

        const itemIndex = layout.findIndex((layoutItem) => layoutItem.i === item.i);
        if (itemIndex === -1) return; // Return early if item is not found

        const itemId = layout[itemIndex].i;
        let width = 0;
        let height = 0;
        const targetElement = document.getElementById(itemId);

        if (targetElement) {
            width = parseFloat(targetElement.style.width) - 10;
            height = targetElement.offsetHeight;
        }

        if (iconData && targetBlock === item) {
            const layoutItem = updatedLayout[itemIndex];

            if (layoutItem.type !== 'text') {
                if (layoutItem.imgSrc === undefined) {
                    updateLayoutItem(layoutItem, iconName, width, height, itemIndex, updatedLayout);
                } else {
                    await showAlert(layoutItem, iconData, iconName, width, height, updatedLayout, itemIndex);
                }
            } else {
                Swal.fire({
                    title: 'Alert!',
                    text: 'Not Allowed for Headers',
                    icon: 'info',
                    confirmButtonText: 'OK',
                });
            }
        }
        else if (iconData === undefined && item.name === undefined || item.imgSrc === undefined) {
            console.log("No Actions Done!!!");
        }
        else if (item.name === undefined || item.imgSrc === undefined) {
            const layoutItem = updatedLayout[itemIndex];
            updatedLayout[itemIndex] = {
                ...layoutItem,
                name: iconName,
                chart_name: "slicer",
                containerWidth: width,
                containerHeight: height,
            };
        }

        const updatedChartData = updatedLayout.find((data) => item.i === data.i);
        if (updatedChartData) {
            updateChartData(updatedChartData);
        }
        // console.log('updatedLayout 1556 :>> ', updatedLayout);

        dispatch(updateLayoutData(updatedLayout, requestInfo));

        // setTimeout(() => {
        //     dispatch(retrivePageLayout());
        // }, 200);
    };



    const handleDropCard = async (e, item) => {
        let updatedLayout = [...layout];
        e.preventDefault();

        const itemIndex = layout.findIndex((layoutItem) => layoutItem.i === item.i);
        if (itemIndex === -1) return; // Return early if item is not found

        const itemId = layout[itemIndex].i;
        let width = 320;  // Fixed width set to 320px
        let height = 0;
        const targetElement = document.getElementById(itemId);

        if (targetElement) {
            height = targetElement.offsetHeight;  // Only use height from the element
        }

        // Calculate grid units based on the fixed width of 320px
        const gridUnits = Math.floor(width / (targetElement ? targetElement.offsetWidth / 12 : 1)); // Calculate grid units
        updatedLayout[itemIndex] = {
            ...updatedLayout[itemIndex],
            // w: 2,
            h: Math.ceil(height / 100), // Assuming rowHeight of 100px
            containerWidth: width,
            containerHeight: height,
        };

        if (iconData && targetBlock === item) {
            const layoutItem = updatedLayout[itemIndex];

            if (layoutItem.type !== 'text') {
                if (layoutItem.imgSrc === undefined) {
                    updateLayoutItem(layoutItem, iconName, width, height, itemIndex, updatedLayout);
                } else {
                    await showAlert(layoutItem, iconData, iconName, width, height, updatedLayout, itemIndex);
                }
            } else {
                Swal.fire({
                    title: 'Alert!',
                    text: 'Not Allowed for Headers',
                    icon: 'info',
                    confirmButtonText: 'OK',
                });
            }
        } else if (item.name === undefined || item.imgSrc === undefined) {
            const layoutItem = updatedLayout[itemIndex];
            updatedLayout[itemIndex] = {
                ...layoutItem,
                name: iconName,
                chart_name: "slicer",
                containerWidth: width,
                containerHeight: height,
            };
        }

        const updatedChartData = updatedLayout.find((data) => item.i === data.i);
        if (updatedChartData) {
            updateChartData(updatedChartData);
        }
        // console.log('updatedLayout :>> ', updatedLayout);
        await dispatch(updateLayoutInfo(updatedLayout))

        dispatch(updateLayoutData(updatedLayout, requestInfo));
        // setTimeout(() => {
        //     dispatch(retrivePageLayout(authInfo));
        // }, 500);
    };

    const onDragStop = async (layoutInfo, oldItem, newItem, from_rsz_func, swaped) => {
        layout.map((data, idx) => {
            layoutInfo.map((ele, pos) => {
                if (data.i == ele.i) {
                    const { x, y, ...rest } = layout[idx]
                    layoutInfo[pos] = {
                        ...layoutInfo[pos],
                        y: layoutInfo[pos].y,
                        x: layoutInfo[pos].x,
                        ...rest
                    }
                }
            })
        })


        var modified = []
        var modified_layout = await layoutInfo?.map((lay_data, lay_indx) => {
            const new_data = layoutInfo.find(item => item.i === lay_data.i);
            if (new_data) {
                return { ...lay_data, x: new_data.x, y: new_data.y, h: new_data.h, w: new_data.w };
            } else {
                return { ...lay_data };
            }
        });
        modified = modified_layout
        dispatch(updateLayoutData(modified, requestInfo));
        return modified
    }

    const styleFunc = async (itemId, updatedLayout1, pos) => {
        var width = 0;
        var height = 0;
        const targetElement = document.getElementById(itemId);
        await new Promise(resolve => setTimeout(resolve, 0));
        if (targetElement) {
            const style = await window.getComputedStyle(targetElement);
            width = await parseFloat(style.width);
            height = await parseFloat(style.height);
            updatedLayout1[pos]["containerWidth"] = width;
            updatedLayout1[pos]["containerHeight"] = height;
        }
        return updatedLayout1
    }


    const onResize = async (layout, oldItem, newItem, from_rsz_func_retrn, final) => {
        setSidePanelOpen(false)
        // console.log('layout 1692  resized!!:>> ', layout);
        let cloned_lay = [...layout]
        const itemIndex = cloned_lay.findIndex((layoutItem) => layoutItem.i === newItem.i);
        const itemId = cloned_lay[itemIndex].i;
        let width = 0
        let height = 0
        const targetElement = await document.getElementById(itemId);
        if (targetElement) {
            const style = targetElement.style;
            width = await parseFloat(style.width);
            height = await parseFloat(style.height);
        }
        if (layout !== undefined) {
            await reportSlice.layoutInfo.map(async (ele, idx) => {
                const clonedItem = { ...ele };
                if (ele.imgSrc !== undefined && ele.imgSrc !== null) {
                    clonedItem.imgSrc = ele.imgSrc
                    clonedItem.name = ele.name
                    clonedItem.chart_name = ele.chart_name
                    clonedItem.containerWidth = width
                    clonedItem.containerHeight = height
                    clonedItem.data = ele?.data !== undefined ? ele.data : undefined
                    clonedItem.chart_customize_clr = ele?.chart_customize_clr !== undefined ? ele.chart_customize_clr : undefined
                    clonedItem.selected_cln_name = ele?.selected_cln_name !== undefined ? ele.selected_cln_name : undefined
                    clonedItem.selected_primary_key = ele?.selected_primary_key !== undefined ? ele.selected_primary_key : undefined
                    clonedItem.selected_primary_value = ele?.selected_primary_value !== undefined ? ele.selected_primary_value : undefined
                    clonedItem.x_axis_key = ele?.x_axis_key !== undefined ? ele.x_axis_key : undefined
                    clonedItem.y_axis_key = ele?.y_axis_key !== undefined ? ele.y_axis_key : undefined
                    clonedItem.show_Line = ele?.show_Line !== undefined ? ele.show_Line : undefined
                    clonedItem.show_Grid = ele?.show_Grid !== undefined ? ele.show_Grid : undefined
                    clonedItem.show_bar_values = ele?.show_bar_values !== undefined ? ele.show_bar_values : undefined
                    clonedItem.label_arr_data = ele?.label_arr_data !== undefined ? ele.label_arr_data : []
                    clonedItem.y_axis_label = ele?.y_axis_label !== undefined ? ele.y_axis_label : 'Ylabel'
                    clonedItem.curved_line_chrt = ele?.curved_line_chrt !== undefined ? ele.curved_line_chrt : false
                    clonedItem.chart_customize_clr_arr = ele?.chart_customize_clr_arr !== undefined ? ele.chart_customize_clr_arr : undefined
                    clonedItem.chart_height = ele?.chart_height !== undefined ? ele.chart_height : undefined
                    clonedItem.minH = ele?.minH !== undefined ? ele.minH : ''
                    clonedItem.show_table = ele?.show_table !== undefined ? ele.show_table : undefined
                    clonedItem.yAxis_arr = ele?.yAxis_arr !== undefined ? ele.yAxis_arr : undefined
                    clonedItem.add_transition_data = ele?.add_transition_data !== undefined ? ele.add_transition_data : undefined
                    clonedItem.num_add_axes = ele?.num_add_axes !== undefined ? ele.num_add_axes : undefined
                    clonedItem.combined_arr = ele?.combined_arr !== undefined ? ele.combined_arr : undefined
                    clonedItem.merged_arr = ele?.merged_arr !== undefined ? ele.merged_arr : undefined
                    clonedItem.X_axis_value = ele?.X_axis_value !== undefined ? ele.X_axis_value : undefined
                    clonedItem.x_axis_label = ele?.x_axis_label !== undefined ? ele.x_axis_label : undefined
                    clonedItem.mouseovered_type = ele?.mouseovered_type !== undefined ? ele.mouseovered_type : undefined
                    clonedItem.mouseovered = ele?.mouseovered !== undefined ? ele.mouseovered : undefined
                    clonedItem.show_Square = ele?.show_Square !== undefined ? ele.show_Square : undefined
                    cloned_lay[idx] = clonedItem
                }
                else if (ele.name === 'rectangle_card') {
                    clonedItem.name = ele.name
                    clonedItem.text = ele?.text !== undefined ? ele.text : 'lab'
                    clonedItem.count = ele?.count !== undefined ? ele.count : '800'
                    clonedItem.h = ele?.h !== undefined ? ele.h : 2
                    clonedItem.minH = ele?.minH !== undefined ? ele.minH : 2
                    clonedItem.maxH = ele?.maxH !== undefined ? ele.maxH : 2
                    cloned_lay[idx] = clonedItem
                }
                else if (ele.name === 'table') {
                    clonedItem.name = ele?.name !== undefined ? ele.name : ''
                    clonedItem.containerWidth = width
                    clonedItem.containerHeight = height
                    clonedItem.selected_cln_name = ele?.selected_cln_name !== undefined ? ele.selected_cln_name : undefined
                    clonedItem.selected_primary_key = ele?.selected_primary_key !== undefined ? ele.selected_primary_key : undefined
                    clonedItem.selected_primary_value = ele?.selected_primary_value !== undefined ? ele.selected_primary_value : undefined
                    clonedItem.x_axis_key = ele?.x_axis_key !== undefined ? ele.x_axis_key : undefined
                    clonedItem.y_axis_key = ele?.y_axis_key !== undefined ? ele.y_axis_key : undefined
                    clonedItem.data = ele?.data !== undefined ? ele.data : undefined
                    clonedItem.label_arr_data = ele?.label_arr_data !== undefined ? ele.label_arr_data : []
                    clonedItem.yAxis_arr = ele?.yAxis_arr !== undefined ? ele.yAxis_arr : undefined
                    clonedItem.add_transition_data = ele?.add_transition_data !== undefined ? ele.add_transition_data : undefined
                    clonedItem.num_add_axes = ele?.num_add_axes !== undefined ? ele.num_add_axes : undefined
                    clonedItem.combined_arr = ele?.combined_arr !== undefined ? ele.combined_arr : undefined
                    clonedItem.merged_arr = ele?.merged_arr !== undefined ? ele.merged_arr : undefined
                    clonedItem.X_axis_value = ele?.X_axis_value !== undefined ? ele.X_axis_value : undefined
                    clonedItem.x_axis_label = ele?.x_axis_label !== undefined ? ele.x_axis_label : undefined
                    cloned_lay[idx] = clonedItem
                }
                else {
                    clonedItem.name = ele?.name !== undefined ? ele.name : ''
                    clonedItem.containerWidth = width
                    clonedItem.containerHeight = height
                    cloned_lay[idx] = clonedItem
                }
                cloned_lay[idx] = clonedItem
            })
        }

        let updatedLayout1 = [...layout];
        var modifiedItems
        if (layout !== undefined) {
            for (const ele of cloned_lay) {
                modifiedItems = await Promise.all(updatedLayout1.map(async (item) => {
                    if (ele.i === item.i) {
                        if (ele.imgSrc !== undefined && ele.imgSrc !== null) {
                            const itemId = ele.i;
                            const targetElement = await document.getElementById(itemId);
                            if (targetElement) {
                                const style = await targetElement.style;
                                const width = parseFloat(style.width);
                                const height = parseFloat(style.height);
                                return {
                                    ...ele,
                                    w: item.w,
                                    h: item.h,
                                    containerWidth: width,
                                    containerHeight: height,
                                    chart_height: (ele.show_table !== undefined && ele.show_table !== false) ? ele.containerHeight : ele.chart_height,
                                    data: ele?.data !== undefined ? ele.data : undefined,
                                    filtered_data: ele?.filtered_data !== undefined ? ele.filtered_data : undefined,
                                    imgSrc: ele.imgSrc,
                                    name: ele.name,
                                    chart_name: ele.chart_name,
                                };
                            }
                        } else {
                            const targetElement = await document.getElementById(ele.i);
                            const style = await targetElement.style;
                            const width = parseFloat(style.width);
                            const height = parseFloat(style.height);
                            return {
                                ...ele,
                                Table: ele.Table,
                                name: ele.name,
                                w: item.w,
                                h: item.h,
                                containerWidth: width,
                                containerHeight: height,
                                chart_height: (ele.show_table !== undefined && ele.show_table !== false) ? ele.containerHeight : ele.chart_height,
                                data: ele?.data !== undefined ? ele.data : undefined,
                            };
                        }
                    }
                    return item;
                }));
                updatedLayout1 = modifiedItems;
            }
            // console.log('updatedLayout1  1827:>> ', updatedLayout1, modifiedItems);


            try {
                await dispatch(updateLayoutInfo(modifiedItems))
                await dispatch(updateLayoutData(modifiedItems, requestInfo));
            } catch (error) {

            }

            // dispatch(updateLayoutData(updatedLayout1, requestInfo));
        }

    }

    const showAlert = async (layoutItem, iconData, iconName, width, height, updatedLayout, index) => {
        // console.log('updatedLayout 1966:>> ', updatedLayout, layoutItem);

        await Swal.fire({
            title: 'Are you Sure?',
            text: 'Do you want to modify and Remove its Config data ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (iconName === 'rectangle_card') {
                    updatedLayout[index] = {
                        ...layoutItem,
                        name: iconName,
                        card_name: iconName,
                        text: 'Labels',
                        count: '900',
                        h: 2,
                        minH: 2,
                        maxH: 2
                    }
                }
                else {
                    var table_enabled = false
                    if (layoutItem.show_table) {
                        table_enabled = true
                    }
                    updatedLayout[index] = {
                        imgSrc: iconData,
                        name: iconName,
                        chart_name: iconName,
                        containerWidth: width,
                        containerHeight: table_enabled ? height - 200 : height,
                        chart_customize_clr: undefined,
                        chart_customize_clr_arr: undefined,
                        h: table_enabled ? layoutItem.h - 2 : layoutItem.h,
                        i: layoutItem.i,
                        w: layoutItem.w,
                        x: layoutItem.x,
                        y: layoutItem.y,
                        selected_cln_name: layoutItem.selected_cln_name
                    };
                }
                // console.log('updatedLayout 2007:>> ', updatedLayout);
                dispatch(updateLayoutData(updatedLayout, requestInfo));
                if (layoutItem.name === 'pie_chart') {
                    dispatch(setRangeStatus({ value: 'delete', ID: layoutItem.i }));
                }

                Swal.fire('Success', 'Chart modified successfully!', 'success');
            } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Chart modification cancelled.', 'error');
            }
        });
    };



    const delBlock = async (e, item1, indx) => {
        try {
            e?.stopPropagation();

            let arr = [...layout];

            var targetRow_new = arr.filter((item) => item.y === item1.y);

            arr.splice(indx, 1);

            targetRow_new = arr.filter((item) => item.y === item1.y);

            var mod_lay;
            if (targetRow_new.length > 0) {
                mod_lay = await Promise.all(
                    arr.map(async (item, idx) => {
                        const arr_item = Object.assign({}, item);
                        if (arr_item.i === targetRow_new[0].i) {
                            arr_item.w = targetRow_new[0].w;
                            const targetElement = await document.getElementById(arr_item.i);
                            var width = 0;
                            if (targetElement) {
                                setTimeout(async () => {
                                    const style = targetElement.style;
                                    width = await parseFloat(style.width);
                                    const updatedItem = Object.assign({}, arr_item, { containerWidth: width });
                                }, 100);
                            }
                        }
                        return arr_item;
                    })
                );
            }

            // console.log(arr, requestInfo, "1639")

            if (arr.length === 0) {
                dispatch(setNoLayoutdata(true));
            }

            // Dispatch updated layout data
            dispatch(updateLayoutData(arr !== undefined ? arr : [], requestInfo));

            // Remove the deleted chart's rangeStatus entry based on its ID
            dispatch(setRangeStatus({ value: 'delete', ID: item1.i }));

        } catch (error) {
            console.error('Error in delBlock:', error);
        }
    };

    const updtTxtLayout = async (e, item, indx) => {
        var updt_layout = layout.map((layout, index) => {
            if (index === indx) {
                return { ...layout, value: e.target.value };
            }
            return layout;
        });
        dispatch(updateLayoutData(updt_layout, requestInfo));
    };

    const onlayoutClick = (item, index1, layout) => {
        if (item.name !== undefined) {
            setSidePanelOpen(true)

            // Exclude 'data' field from the item object
            const { data, ...sanitizedItem } = item;
            setSidepanelData(sanitizedItem)
            sessionStorage.setItem('blockdata', JSON.stringify(sanitizedItem));
            sessionStorage.setItem('blockIdx', JSON.stringify(index1));
        }
    }

    const updateLayout = async (layout, rerender) => {
        // dispatch(updateLayoutData(layout, requestInfo));
    }

    async function showTableFunc(e, item, indx, lay) {
        // console.log("1929");
        let tempLayout = layout.map(obj => ({ ...obj }));
        let show_table = layout[indx]["show_table"]
        // console.log('show_table 2112:>> ', show_table);
        if (show_table === false || show_table === undefined) {

            tempLayout[indx] = { ...tempLayout[indx] };
            tempLayout[indx]["h"] = layout[indx]["h"] + 2;
            tempLayout[indx]["chart_height"] = layout[indx]["containerHeight"] + 200;
            tempLayout[indx]["minH"] = tempLayout[indx]["h"]
            tempLayout[indx]["show_table"] = true;
            tempLayout[indx]["containerHeight"] = layout[indx]["containerHeight"] + 200 + 20;
        }

        if (show_table === true) {
            tempLayout[indx] = { ...tempLayout[indx] };
            tempLayout[indx]["containerHeight"] = layout[indx]["containerHeight"] - 200 - 20;
            tempLayout[indx]["minH"] = 2;
            tempLayout[indx]["h"] = (layout[indx]["h"]) - 2;
            tempLayout[indx]["show_table"] = undefined;
            tempLayout[indx]["chart_height"] = '';
        }
        // console.log('tempLayout 2174:>> ', tempLayout[indx]["containerHeight"]);
        var rersized = await tableRezided(layout, item, tempLayout[indx], tempLayout)

        // console.log('rersized  1888:>> ', rersized);
        // dispatch(updateLayoutData(rersized !== undefined ? rersized : updtData, requestInfo));
        dispatch(updateLayoutInfo(rersized !== undefined ? rersized : updtData));
    }

    const tableRezided = async (layout, oldItem, newItem, tempArr) => {
        const itemIndex = layout.findIndex((layoutItem) => layoutItem.i === newItem.i);
        const itemId = layout[itemIndex].i;
        let width = 0;
        let height = 0;
        const targetElement = await document.getElementById(itemId);
        if (targetElement) {
            const style = targetElement.style;
            width = parseFloat(style.width);
            height = parseFloat(style.height);
        }
        if (tempArr !== undefined) {
            const updatedLayout = [...layout];
            // console.log('tempArr :>> ', tempArr);
            await Promise.all(tempArr.map(async (ele, idx) => {
                layout.forEach((item, pos) => {
                    if (ele.i === item.i) {
                        const updatedItem = { ...item };
                        // console.log('ele.imgSrc !== undefined && ele.imgSrc !== null :>> ', ele.imgSrc !== undefined && ele.imgSrc !== null, "ele", ele, 'item', item);
                        if (ele.imgSrc !== undefined && ele.imgSrc !== null) {
                            updatedItem.imgSrc = ele.imgSrc;
                            updatedItem.name = ele.name;
                            updatedItem.chart_name = ele.chart_name;
                            updatedItem.containerWidth = ele.containerWidth;
                            updatedItem.containerHeight = ele.containerHeight;
                            updatedItem.data = ele?.data !== undefined ? ele.data : undefined;
                            updatedItem.chart_customize_clr = ele?.chart_customize_clr !== undefined ? ele.chart_customize_clr : undefined;
                            updatedItem.selected_cln_name = ele?.selected_cln_name !== undefined ? ele.selected_cln_name : undefined;
                            updatedItem.selected_primary_key = ele?.selected_primary_key !== undefined ? ele.selected_primary_key : undefined;
                            updatedItem.selected_primary_value = ele?.selected_primary_value !== undefined ? ele.selected_primary_value : undefined;
                            updatedItem.x_axis_key = ele?.x_axis_key !== undefined ? ele.x_axis_key : undefined;
                            updatedItem.y_axis_key = ele?.y_axis_key !== undefined ? ele.y_axis_key : undefined;
                            updatedItem.show_table = ele?.show_table !== undefined ? ele.show_table : false;
                            updatedItem.chart_height = ele?.chart_height !== undefined ? ele.chart_height : '';
                            updatedItem.minH = ele?.minH !== undefined ? ele.minH : '';
                            updatedItem.h = ele?.h !== undefined ? ele.h : '';
                        } else if (ele.name === 'rectangle_card') {
                            updatedItem.name = ele.name;
                            updatedItem.containerWidth = width;
                            updatedItem.containerHeight = height;
                            updatedItem.text = ele?.text !== undefined ? ele.text : '';
                            updatedItem.count = ele?.count !== undefined ? ele.count : '';
                            updatedItem.minH = ele?.minH !== undefined ? 2 : 2;
                            updatedItem.maxH = ele?.maxH !== undefined ? 2 : 2;
                        }

                        // console.log('updatedItem :>> ', updatedItem);
                        updatedLayout[pos] = updatedItem;
                    }
                });
            }));
            return updatedLayout;
        }
        return layout;
    };

    const handleToggleFullScreen = async (item, obj, lay, indx) => {

        try {
            const chartElement = await document.getElementById(`${item}`);
            if (chartElement) {
                if (!isFullScreen) {
                    // console.log('fullscreenSize.width :>> ', fullscreenSize.width);
                    const lay1 = { ...layout[indx] };
                    lay1.temp_containerWidth = fullscreenSize.width;
                    lay1.temp_containerHeight = fullscreenSize.height + 150;
                    lay1.fullScreen_enabled = true;
                    var updateLayout = [...layout]
                    updateLayout[indx] = lay1

                    setTimeout(async() => {
                        await dispatch(
                            updateLayoutInfo({
                                index: indx,
                                updatedObject: lay1,
                            })
                        )  
                    }, 100);
                    // dispatch(updateLayoutInfo(updateLayout))
                  


                    if (chartElement.requestFullscreen) {
                        chartElement.requestFullscreen();
                    } else if (chartElement.mozRequestFullScreen) {
                        chartElement.mozRequestFullScreen();
                    } else if (chartElement.webkitRequestFullscreen) {
                        chartElement.webkitRequestFullscreen();
                    } else if (chartElement.msRequestFullscreen) {
                        chartElement.msRequestFullscreen();
                    }
                    const rightArrowIcon = createArrowIcon("bx bx-right-arrow-alt", "right", () => handleNextChart(item, indx, lay1), !hasNextChart(item));
                    chartElement.appendChild(rightArrowIcon);
                    const leftArrowIcon = createArrowIcon("bx bx-left-arrow-alt", "left", () => handlePreviousChart(item, indx, lay1), !hasPreviousChart(item));
                    chartElement.appendChild(leftArrowIcon);
                    setIsFullScreen(true);
                    setDataLoaded(true)
                } else {
                    console.log("Exited Full");
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    const rightArrowElement = chartElement.querySelector('.bx-right-arrow-alt');
                    const leftArrowElement = chartElement.querySelector('.bx-left-arrow-alt');
                    if (rightArrowElement) {
                        rightArrowElement.remove();
                    }
                    if (leftArrowElement) {
                        leftArrowElement.remove();
                    }
                    setIsFullScreen(false);
                }
            } else {
            }
        } catch (error) {

        }

    };


    const createArrowIcon = (className, direction, onClick, isDisabled = false) => {
        const arrowIcon = document.createElement("i");
        // console.log("isDisabled", isDisabled);
        arrowIcon.className = className;
        arrowIcon.style.cssText = `
            cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
            font-size: 40px;
            font-weight: bold;
            position: absolute;
            top: 50%;
            ${direction}: 20px;
            z-index: 2;
            color: ${isDisabled ? '#999' : '#6666B2'};
            transform: translateY(-50%);
        `;
        if (!isDisabled) {
            arrowIcon?.addEventListener("click", onClick);
        }
        return arrowIcon;
    };

    const hasNextChart = (item) => {
        // console.log('hasNextChart :>> ', item);
        const itemIndex = layout.findIndex((layoutItem) => layoutItem.i === item);
        // console.log('itemIndex < layout.length - 1 :>> ', itemIndex < layout.length - 1);
        return itemIndex < layout.length - 1;
    };

    const hasPreviousChart = (item) => {
        // console.log('hasPreviousChart :>> ', item);
        const itemIndex = layout.findIndex((layoutItem) => layoutItem.i === item);
        console.log('itemIndex > 0 :>> ', itemIndex > 0);
        return itemIndex > 0;
    };

    const handleNextChart = async (item, idx, lay) => {
        // console.log('handleNextChart :>> ', item, idx, lay);
        setIsFullScreen(true);
        let nextIndex = idx + 1;
        while (nextIndex < layout.length) {
            const nextChart = layout[nextIndex];
            if (nextChart && nextChart.chart_name) {
                // console.log("nextChart && nextChart.chart_name", nextChart && nextChart.chart_name)
                await handleToggleFullScreen(nextChart.i, '', lay, nextIndex);
                return;
            } else {
                nextIndex++;
            }
        }
    };

    const handlePreviousChart = async (item, indx, lay) => {
        // console.log("handlePreviousChart");
        let previousIndex = indx - 1;
        while (previousIndex >= 0) {
            const previousChart = layout[previousIndex];
            if (previousChart && previousChart.chart_name) {
                // console.log('previousChart && previousChart.chart_name :>> ', previousChart && previousChart.chart_name);
                await handleToggleFullScreen(previousChart.i, '', lay, previousIndex);
                return;
            } else {
                previousIndex--;
            }
        }
    };

    const getStyle = (item, val) => {
        if (val === '1') {
            const style = { fontSize: `${item.label_fontsize ? item.label_fontsize : 18}px`, color: `${item.label_fontColor ? item.label_fontColor : 'black'}`, };
            if (item.label_bold || item.label_italic || item.label_underline) {
                if (item.label_bold) style.fontWeight = 'bold';
                if (item.label_italic) style.fontStyle = 'italic';
                if (item.label_underline) style.textDecoration = 'underline';
                return style;
            }
            else {
                return style;
            }
        }
        else {
            const style = { fontSize: `${item.value_fontsize ? item.value_fontsize : 25}px`, color: `${item.value_fontColor ? item.value_fontColor : 'red'}`, };
            if (item.value_bold || item.value_italic || item.value_underline) {
                if (item.value_bold) style.fontWeight = 'bold';
                if (item.value_italic) style.fontStyle = 'italic';
                if (item.value_underline) style.textDecoration = 'underline';
                return style;
            }
            else {
                return style;
            }
        }
    };

    const exitScreen = async (item, indx) => {
        // console.log("Exitedddd", item);
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => {
                exitScreen()
            }).catch((err) => {
            });
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        setIsFullScreen(false)
        if (indx !== undefined) {
            const updatedLayout = [...layout];
            await updatedLayout.map(async (data, FullScr_index) => {
                let leftArrowElement = document.querySelector('.bx-left-arrow-alt');
                let rightArrowElement = document.querySelector('.bx-right-arrow-alt');
                if (leftArrowElement) {
                    leftArrowElement.remove();
                    rightArrowElement.remove()
                } else {
                }
                setIsFullScreen(!isFullScreen)
                const elementInFullscreen = getFullscreenElement();
                if (elementInFullscreen) {
                }
                updatedLayout[FullScr_index] = {
                    ...updatedLayout[FullScr_index],
                    fullScreen_enabled: false,
                    temp_containerHeight: undefined,
                    temp_containerWidth: undefined
                };
                const parentElement = await document.getElementById(data.i);
                if (parentElement) {
                    const leftArrowElements = parentElement.querySelectorAll('.bx-left-arrow-alt');
                    const rightArrowElements = parentElement.querySelectorAll('.bx-right-arrow-alt');
                    leftArrowElements.forEach((element) => {
                        element.remove();
                    });
                    rightArrowElements.forEach((element) => {
                        element.remove();
                    });
                } else {
                }
                await dispatch(updateLayoutInfo(updatedLayout))
            })
            // dispatch(updateLayoutInfo(updatedLayout))
        }
        return indx
    }

    function getFullscreenElement() {
        const fullscreenElement =
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement;
        return fullscreenElement;
    }


    const convertChart = (name, items, indx) => {
        var clone_lay = [...layout]
        var updating_layObj = { ...clone_lay[indx] }


        console.log('name, items, indx :>> ', name, items, indx);
        if (name === 'stack_bar') {
            updating_layObj.imgSrc = stackChart
            updating_layObj.name = 'stack_bar'
            updating_layObj.chart_name = 'stack_bar'
            updating_layObj.data = items.data
            updating_layObj.num_add_axes = items.num_add_axes
            updating_layObj.x_axis_label = items.label_arr_data?.[0]
            updating_layObj.label_arr_data = items.label_arr_data
        }
        else if (name === 'area_chart') {
            updating_layObj.imgSrc = areaChart
            updating_layObj.name = 'area_chart'
            updating_layObj.chart_name = 'area_chart'
            updating_layObj.data = items.data
            updating_layObj.num_add_axes = items.num_add_axes
            updating_layObj.x_axis_label = items.label_arr_data?.[0]
            updating_layObj.label_arr_data = items.label_arr_data
        }
        else if (name === 'line_chart') {
            updating_layObj.imgSrc = lineChart
            updating_layObj.name = 'line_chart'
            updating_layObj.chart_name = 'line_chart'
            updating_layObj.data = items.data
            updating_layObj.num_add_axes = items.num_add_axes
            updating_layObj.x_axis_label = items.label_arr_data?.[0]
            updating_layObj.label_arr_data = items.label_arr_data
        }
        else if (name === 'hor_barcharts') {
            updating_layObj.imgSrc = hor_barChart
            updating_layObj.name = 'hor_barcharts'
            updating_layObj.chart_name = 'hor_barcharts'
            updating_layObj.data = items.data
        }
        else if (name === 'hor_stack') {
            updating_layObj.imgSrc = hor_stackChart
            updating_layObj.name = 'hor_stack'
            updating_layObj.chart_name = 'hor_stack'
            updating_layObj.data = items.data
            updating_layObj.num_add_axes = items.num_add_axes
            updating_layObj.x_axis_label = items.label_arr_data?.[0]
        }
        else if (name === 'table') {
            updating_layObj.imgSrc = hor_stackChart
            updating_layObj.name = 'table'
            updating_layObj.chart_name = 'table'
            updating_layObj.data = items.data
            updating_layObj.label_arr_data = items.label_arr_data
            if (!Object.isExtensible(updating_layObj)) {
                updating_layObj = { ...updating_layObj };
                updating_layObj["label_arr_data"][0] = items?.x_axis_label;
            }
            updating_layObj.Table = true
        }
        else if (name === 'bar_charts') {
            updating_layObj.imgSrc = barChart
            updating_layObj.name = 'bar_charts'
            updating_layObj.chart_name = 'bar_charts'
            updating_layObj.data = items.data
        }
        else if (name === 'Vertical_linechart') {
            updating_layObj.imgSrc = hor_barChart
            updating_layObj.name = 'Vertical_linechart'
            updating_layObj.chart_name = 'Vertical_linechart'
            updating_layObj.data = items.data
            updating_layObj.num_add_axes = items.num_add_axes
            updating_layObj.x_axis_label = items.label_arr_data?.[0]
            updating_layObj.label_arr_data = items.label_arr_data
        }
        clone_lay[indx] = updating_layObj;
        // dispatch(updateLayoutData(clone_lay))
        dispatch(updateLayoutInfo(clone_lay));

    }

    const resetedData = async () => {

        try {

            dispatch(updateLayoutData([], requestInfo));
            dispatch(setNoLayoutdata(true));
            dispatch(setRangeStatus({ value: 'deleteAll' }));

        } catch (error) {
        }

    }


    const calculateOperation = (data, mode, name) => {
        // console.log('mode :>> ', mode);
        if (mode === "1") {
            const groupedData = d3.group(data, d => d.year);
            const valueKeys = Object.keys(data[0]).filter(key => key.startsWith('value'));
            // console.log('valueKeys :>> ', valueKeys);
            const sumValues = [];
            // console.log('groupedData :>> ', groupedData);
            groupedData.forEach((value, key) => {
                const varObj = { year: key };
                valueKeys.forEach(valueKey => {
                    varObj[valueKey] = d3.sum(value, d => d[valueKey]);
                });
                sumValues.push(varObj);
            });
            return sumValues;
        }
        if (mode === "2") {
            if (name === 'bar_charts' || name === 'hor_barcharts') {
                const groupedData = d3.rollups(
                    data,
                    v => d3.mean(v, d => d.value),
                    d => d.year
                ).map(([year, value]) => ({ year, value }));
                return groupedData;
            }
            else {
                const groupedData = d3.group(data, d => d.year);
                const valueKeys = Object.keys(data[0]).filter(key => key.startsWith('value'));
                const avgValues = [];
                groupedData.forEach((values, key) => {
                    const avgObj = { year: key };
                    valueKeys.forEach(valueKey => {
                        avgObj[`avg${valueKey.charAt(0).toUpperCase() + valueKey.slice(1)}`] = d3.mean(values, d => d[valueKey]) || 0;
                    });
                    avgValues.push(avgObj);
                });
                return avgValues;
            }
        }
        if (mode === "3") {
            const groupedData = d3.group(data, d => d.year);
            const valueKeys = Object.keys(data[0]).filter(key => key.startsWith('value'));

            const minValues = [];
            groupedData.forEach((value, key) => {
                const minObject = { year: key };
                valueKeys.forEach(valueKey => {
                    minObject[valueKey] = d3.min(value, d => d[valueKey]);
                });
                minValues.push(minObject);
            });
            return minValues;
        }
        if (mode === "4") {
            const groupedData = d3.group(data, d => d.year);
            const valueKeys = Object.keys(data[0]).filter(key => key.startsWith('value'));

            const maxValues = [];
            groupedData.forEach((value, key) => {
                const maxObject = { year: key };
                valueKeys.forEach(valueKey => {
                    maxObject[valueKey] = d3.max(value, d => d[valueKey]);
                });
                maxValues.push(maxObject);
            });
            return maxValues;

        }
        if (mode === "5") {
            if (name === 'bar_charts' || name === 'hor_barcharts') {
                const countData = d3.rollups(
                    data,
                    v => v.length,
                    d => d.year // Group by year
                ).map(([year, value]) => ({ year, value }));
                return countData
            }
            else {
                const groupedData = d3.group(data, d => d.year);
                const valueKeys = Object.keys(data[0]).filter(key => key.startsWith('value'));
                const countValues = [];
                groupedData.forEach((value, key) => {
                    const countObj = { year: key };
                    valueKeys.forEach(valueKey => {
                        countObj[`count${valueKey.charAt(0).toUpperCase() + valueKey.slice(1)}`] = d3.count(value, d => d[valueKey]);
                    });
                    countValues.push(countObj);
                });
                return countValues;
            }
        }
        if (mode === "6") {
            if (name === 'bar_charts' || name === 'hor_barcharts') {
                const groupedData = d3.rollups(
                    data,
                    v => d3.deviation(v, d => d.value),
                    d => d.year
                ).map(([year, value]) => ({ year, value }));
                return groupedData;
            }
            else {
                const groupedData = d3.group(data, d => d.year);
                const valueKeys = Object.keys(data[0]).filter(key => key.startsWith('value'));
                const devValues = [];
                groupedData.forEach((value, key) => {
                    const varObj = { year: key };
                    valueKeys.forEach(valueKey => {
                        varObj[valueKey] = value.length > 1 && d3.deviation(value, d => d[valueKey]);
                    });
                    devValues.push(varObj);
                });
                return devValues
            }
        }
        if (mode === "7") {
            if (name === 'bar_charts' || name === 'hor_barcharts') {
                const groupedData = d3.rollups(
                    data,
                    v => d3.variance(v, d => d.value),
                    d => d.year
                ).map(([year, value]) => ({ year, value }));
                return groupedData;
            }
            else {
                const groupedData = d3.group(data, d => d.year);
                const valueKeys = Object.keys(data[0]).filter(key => key.startsWith('value'));
                const devValues = [];

                groupedData.forEach((value, key) => {
                    const varObj = { year: key };
                    valueKeys.forEach(valueKey => {
                        varObj[valueKey] = value.length > 1 ? d3.variance(value, d => d[valueKey]) : 0;
                    });
                    devValues.push(varObj);
                });

                return devValues
            }
        }
        if (mode === "8") {
            const groupedData = d3.group(data, d => d.year);
            const valueKeys = Object.keys(data[0]).filter(key => key.startsWith('value'));
            const MedValues = [];
            groupedData.forEach((value, key) => {
                const medObj = { year: key };
                valueKeys.forEach(valueKey => {
                    medObj[valueKey] = d3.median(value, d => d[valueKey]);
                });
                MedValues.push(medObj);
            });
            return MedValues;
        }
    }



    const mathOperation = (item, value, ele) => {
        var itemInfo = { ...item };
        var getIdx = _.findIndex(layout, { i: itemInfo.i });
        var updateLayoutInfoData = [...layout];




        dispatch(sortFunc({ data: [], arrValues: "", chart_id: itemInfo.i }));
        dispatch(sortInfo({ data: [], chart_id: itemInfo.i }));


        // console.log('item.name :>> ', item.name);
        if (getIdx !== -1) {
            const operationResult = calculateOperation(itemInfo.data, value, item.name);
            let groupedData;

            // console.log('value  name :>> ', value, ele.name.toLowerCase());
            // if (value === "1" || value === "3" || value === "4" || value === "6" || value === "7" || value == "8") {
            //     const valueKeys = Object.keys(operationResult[0]).filter(key => key.startsWith('value'));
            //     groupedData = d3.rollups(
            //         operationResult,
            //         v => {
            //             const maxValues = {};
            //             valueKeys.forEach(key => {
            //                 maxValues[key] = d3.max(v, d => d[key]);
            //             });
            //             return maxValues;
            //         },
            //         d => `${d.year}`
            //     ).map(([year, value]) => ({ year, ...value }));
            // } else if (value === "2" || value === "5") {
            //     groupedData = operationResult;
            // }

            updateLayoutInfoData[getIdx] = {
                ...updateLayoutInfoData[getIdx],
                // filtered_data: groupedData,
                math_calc: ele.name.toLowerCase(), // Update the selected operation
            };

            // dispatch(updateLayoutInfo(updateLayoutInfoData));
            dispatch(
                updateLayoutInfo({
                    index: getIdx,
                    updatedObject: updateLayoutInfoData[getIdx],
                })
            )
            dispatch(setSaveData(false));
        }
    };

    const previewEnable = async () => {
        setprvpage(!prvpage)
        sessionStorage.setItem('layout_preview', !prvpage);
        navigate("/preview-report")
    }


    const contentStyle = {
        padding: 50,
        borderRadius: 4,
    };
    const content = <div style={contentStyle} />;


    // const handleCheckboxChange = async (event, name) => {
    //     let updatedSlicerLayout = []
    //     if (sliceCards?.length > 0) {
    //         updatedSlicerLayout = [...sliceCards]
    //     }
    //     if (event.target.checked) {
    //         let width = 120;
    //         let height = 120;

    //         const newItem = {
    //             i: uuidv4(),
    //             name: name,
    //             chart_name: "slicer",
    //             containerWidth: width,
    //             containerHeight: height,
    //         };
    //         updatedSlicerLayout.push(newItem);
    //         setSlicerCards(updatedSlicerLayout)
    //         await dispatch(setupdatedSliceData(updatedSlicerLayout))

    //     } else {
    //         updatedSlicerLayout = updatedSliceData.filter(item => item.name !== name);
    //         setSlicerCards(updatedSlicerLayout)
    //         await dispatch(setupdatedSliceData(updatedSlicerLayout))

    //     }
    //     await dispatch(updateSliceFilter(updatedSlicerLayout, requestInfo))
    //     await dispatch(retrivePageLayout())
    // };

    const handleCheckboxChange = async (event, name) => {
        let updatedSlicerLayout = []
        if (sliceCards?.length > 0) {
            updatedSlicerLayout = [...sliceCards]
        }

        if (event.target.checked) {
            let width = 120;
            let height = 120;

            const newItem = {
                i: uuidv4(),
                name: name,
                chart_name: "slicer",
                containerWidth: width,
                containerHeight: height,
            };
            updatedSlicerLayout.push(newItem);
            setSlicerCards(updatedSlicerLayout)
            await dispatch(setupdatedSliceData(updatedSlicerLayout))

        } else {
            updatedSlicerLayout = updatedSliceData.filter(item => item.name !== name);
            setSlicerCards(updatedSlicerLayout)
            await dispatch(setupdatedSliceData(updatedSlicerLayout))

        }

        // Ensure `updateSliceFilter` completes before calling `retrivePageLayout`
        try {
            await dispatch(updateSliceFilter(updatedSlicerLayout, requestInfo));

            // console.log('reportSlice.startDate :>> ', reportSlice.startDate, reportSlice.endDate);
            await dispatch(retrivePageLayout(authInfo, reportSlice.startDate, reportSlice.endDate, true , canEdit));
        } catch (error) {
            console.error("Error while updating slice filter or retrieving page layout:", error);
        }
        // await dispatch(updateSliceFilter(updatedSlicerLayout, requestInfo))
        // await dispatch(retrivePageLayout(reportSlice.startDate  , reportSlice.endDate))
    };

    const getXaxisValue = async () => {
        const pageNodeInfo = JSON.parse(sessionStorage.getItem("pageNodeInfo"))
        setFilterLoading(true)
        var response = await dispatch(retriveClnKeys(pageNodeInfo.selected_cln_name, authInfo));
        if (response.status === 200) {
            if (response.data.data.length > 0) {
                await dispatch(setXaxisFilterValue(response.data.data))
                setFilterLoading(false)

            }
        }
        setTimeout(() => {
            updateLayoutOnResize()
        }, 200);
    }

    const handleResetfilter = async () => {
        const updatedLayout = layout.map(item => {
            const { filtered_data, ...rest } = item;
            return rest;
        });
        updatedSliceData
            .filter(item => item.chart_name === "slicer")
            .forEach(item => {
                var RefElement = document.getElementById(`filterRef${item.i}`);
                if (RefElement) {
                    const checkboxes = RefElement.querySelectorAll("input[type='checkbox']");
                    checkboxes.forEach(checkbox => (checkbox.checked = false));
                }
            });


        dispatch(setqueryFilter([]))
        if (slicerRef.current) {
            const result = await slicerRef.current.resetfilter();
        }

        dispatch(updateLayoutInfo(updatedLayout))
    }



    const handleSubmit = async () => {

        const startDateTime = new Date(`${startDate}`);
        const endDateTime = new Date(`${endDate}`);


        var orders = reportSlice.selectedCollectionData
        const filteredOrders = orders.filter(order => {
            const orderDateTime = new Date(order.order_date_time);
            return orderDateTime >= startDateTime && orderDateTime <= endDateTime;
        });


        {
            updatedSliceData?.length > 0 && updatedSliceData !== undefined ?
                updatedSliceData
                    .map(async (item, index1) => {

                        var getIdx = _.findIndex(updatedSliceData, { i: item.i });

                        if (slicerRef.current) {
                            const result = await slicerRef.current.updateSlicer(
                                updatedSliceData,
                                0,
                                getIdx,
                                item.name,
                                reportSlice.filterValue,
                                item.name,
                                reportSlice.filterValue,
                                filteredOrders
                            );
                        }
                    }) : null
        }

    };


    const [dateRange, setDateRange] = useState([null, null]);
    // const [dateRange, setDateRange] = useState([  new Date(reportSlice.startDate) !== undefined ? new Date(reportSlice.startDate) : null  , new Date(reportSlice.endDate) !== undefined ? new Date(reportSlice.endDate) : null]);

    const [startDate, endDate] = dateRange;
    const [hasDateErrors, setHasDateErrors] = useState(false);
    const [dateErrorMessage, setDateErrorMessage] = useState("");


    const handleDateChange = async (update) => {

        const [startDate, endDate] = update;
        if (startDate && endDate) {
            const twoMonthsLater = moment(startDate).add(2, 'months');
            if (moment(endDate).isAfter(twoMonthsLater)) {
                setHasDateErrors(true);
                setDateErrorMessage("Date range cannot exceed two months.");
                return; // Do not set the date range if it exceeds two months
            }
        }


        // console.log('update 2902:>> ', update);
        setDateRange(update);
        if (!startDate || !endDate) return;

        if (startDate && endDate) {
            // setIsLoading(true)
            // console.log('select start and end date');
        }

        var start_date = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}T00:00:00Z`;
        var end_date = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}T23:59:59.999Z`;
        // console.log('start_date, end_date', start_date, end_date)

        dispatch(toggleProcessingState(undefined))



        dispatch(FilterStartDate(start_date))
        dispatch(FilterEndtDate(end_date))
        // tToggle(2);



        const updatedLayout = layout.map(item => {
            const { filtered_data, data, ...rest } = item;
            return rest;
        });




        // dispatch(retrivePageLayout());

        //  dispatch(updateLayoutInfo(updatedLayout))
        try {
            // First dispatch updateLayoutInfo
            dispatch(updateLayoutInfo(updatedLayout));

            // // After updateLayoutInfo is successful, dispatch retrivePageLayout
            //  dispatch(retrivePageLayout(start_date, end_date));
            // dispatch(retriveSlicerLayout(start_date, end_date, false))

            // console.log("Layout updated and page layout retrieved successfully.");
        } catch (error) {
            console.error("Error updating layout or retrieving page layout:", error);
        }
        finally {
            // console.log("Finally");
            // dispatch(retriveSlicerLayout(start_date, end_date, false))
            dispatch(retrivePageLayout(authInfo, start_date, end_date, false , canEdit));

            setTimeout(() => {
                setdateAdded(true)
            }, 150);

        }

        // let response = await dispatch(retrieveIncItemNameAPI(start_date, end_date));


    };


    // Handle grid item click to highlight the borders
    const handleClick = (item) => {
        if (item === selectedItem) {
            setSelectedItem(null);
        }
        else {
            setSelectedItem(item);
            // console.log('item handleClick :>> ', item);
        }

    };






    // Listen to the keyboard events (Ctrl + C and Ctrl + V)
    useEffect(() => {
        document.addEventListener("keydown", handleCopy);
        document.addEventListener("keydown", handlePaste);


        return () => {
            document.removeEventListener("keydown", handleCopy);
            document.removeEventListener("keydown", handlePaste);
        };
    }, [selectedItem, copiedItem]);


    // Handle the copy event (Cmd + C on Mac, Ctrl + C on Windows)
    const handleCopy = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "c" && selectedItem) {
            setCopiedItem({ ...selectedItem, i: `copy-${selectedItem.i}` });
        }
    };

    // Handle the paste event (Cmd + V on Mac, Ctrl + V on Windows)
    const handlePaste = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "v" && copiedItem) {
            const newItem = { ...copiedItem, i: `pasted-${Date.now()}` };
            // console.log('newItem  handlePaste:>> ', newItem);
            //   setLayout((prevLayout) => [...prevLayout, newItem]);

            var lay1 = [
                ...layout, newItem

            ];

            dispatch(updateLayoutInfo(lay1))
            dispatch(updateLayoutData(lay1, requestInfo))

        }
    };

    const pageNodeInfo = JSON.parse(sessionStorage.getItem('pageNodeInfo'));
    const collectionArray = pageNodeInfo?.selected_cln_name || [];
    
    const labelText =
    collectionArray.length > 1
      ? 'Multi-Collection'
      : collectionArray.length === 1
      ? collectionArray[0]
      : 'No Collection';

    return (
        <React.Fragment>
            <div className="page-content" >
                <div>
                    {
                        console.log('treeDataSlice :>> ', treeDataSlice)
                    }
                    <Breadcrumbs
                        title={`${pageInfo?.name} / ${JSON.parse(sessionStorage.getItem("pageNodeInfo")).title}`}
                        // title={`${reportSlice.selectedReportTemplateInfo?.name} / ${treeDataSlice?.pageNodeInfo.title}`}
                        isBackButtonEnable={true}
                        labelName={'Back'}
                        gotoBack={() => {
                            navigate('/page_tree'); 
                            // tToggle(1);
                             dispatch(resetState());
                        }}
                        // enableButton={true}
                        enableButton={!(!startDate || !endDate)}
                        btnLabel1={'RESET'}
                        btnLabel1Style={'btn btn-outline-danger btn-sm'}
                        btnLabel1Fun={() => resetedData()}
                        btnLabel2={'PREVIEW'}
                        btnLabel2Style={'btn btn-outline-primary btn-sm'}
                        btnLabel2Fun={() => previewEnable()}
                        dates_filled={dateRange}
                    />
                </div>
                <Container fluid>
                    <Card>
                        <CardBody className='p-1'>
                            {dataLoaded &&
                                <div>
                                    <div className="layout-container">

                                        {
                                            !(!startDate || !endDate) ?

                                                (
                                                    <>
                                                        <div className="sidebar primary-sidebar scroll-design" style={{ zoom: 0.8 , backgroundColor:"aliceblue" }}>
                                                            <div className="sidebar-menu-options ">
                                                                <div className={`menu-item ${selectMenu === '1' ? 'active' : ''} sidebar-menu-icon`} onClick={() => { setGrid(!grid); setcharts(false); setSelectMenu('1'); }} >
                                                                    <i className="bx bx-grid sidebar-menu-icon-style" />
                                                                    <h6>Grid</h6>
                                                                </div>

                                                                <div className={`menu-item ${selectMenu === '3' ? 'active' : ''} sidebar-menu-icon`} onClick={() => { setcharts(!charts); setGrid(false); setSelectMenu('3'); }}>
                                                                    <i className="bx bx-bar-chart-square sidebar-menu-icon-style" />
                                                                    <h6>Charts</h6>
                                                                </div>

                                                                <div className={`menu-item ${selectMenu === '5' ? 'active' : ''} sidebar-menu-icon`} onClick={() => { getXaxisValue(); setSelectMenu('5'); }}>
                                                                    <i className="bx bx-filter-alt sidebar-menu-icon-style" />
                                                                    <h6>Filter</h6>
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className={`scroll-design sidebar-second mx-1 ${selectMenu === '5' ? 'secondary-sidebar-expanded' : 'secondary-sidebar'}`} style={{ zoom: 0.9 }}>

                                                            {selectMenu === '1' && (
                                                                <>
                                                                    <div style={{ position: 'sticky', top: 0, zIndex: 3, backgroundColor: 'aliceblue', padding: '5px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'  }}>
                                                                        <Label draggable="false" className="text-primary fw-bold mb-0 p-1"> Click to create </Label>
                                                                    </div>
                                                                    <div className="layout-options text-center" style={{ borderRight: '1px solid #e9e9e9' }}>

                                                                        <img src={one_row} alt="One Row" draggable="false" onClick={() => dispatch(createLayout('1', authInfo))} />
                                                                        <img src={two_col} alt="Two Col" draggable="false" onClick={() => dispatch(createLayout('2', authInfo))} />
                                                                        <img src={three_col} alt="Three Col"  draggable="false"onClick={() => dispatch(createLayout('3', authInfo))} />
                                                                    </div>
                                                                </>

                                                            )}
                                                            {selectMenu === '2' && (
                                                                <div className="sidebar-menu-options">
                                                                    <p className="text-primary fw-bold"> Click to apply </p>
                                                                    <h3 className="sidebar-menu-icon" style={{ fontSize: '21px' }} onClick={() => text_block("1")}>HEADER 1</h3>
                                                                    <h4 className="sidebar-menu-icon" style={{ fontSize: '19px' }} onClick={() => text_block("2")}>HEADER 2</h4>
                                                                    <h5 className="sidebar-menu-icon" onClick={() => text_block("3")}>HEADER 3</h5>
                                                                    <h6 className="sidebar-menu-icon" onClick={() => text_block("4")}>HEADER 4</h6>
                                                                </div>
                                                            )}
                                                            {selectMenu === '3' && (
                                                                <>
                                                                    <div style={{ position: 'sticky', top: 0, zIndex: 3, backgroundColor: 'white', padding: '5px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                                                        <Label className="text-primary fw-bold mb-0 p-1"> Drag and Drop </Label>
                                                                    </div>
                                                                    <div className="chart-options" style={{ borderRight: '1px solid #e9e9e9' }}>


                                                                        <div className="chart-icon" draggable
                                                                            onDragStart={(e) => {
                                                                                handleIconDragStart(e, 'rectangle', "rectangle_card");
                                                                                document.body.classList.add("grabbing"); // Apply to whole page
                                                                            }}
                                                                            onDrag={(e) => {
                                                                                document.body.classList.remove("grabbing"); // Remove after drag ends
                                                                            }}
                                                                            onDragOver={(e) => {
                                                                                handleIconDragStart(e, 'rectangle', "rectangle_card");
                                                                                document.body.classList.add("grabbing"); // Apply to whole page
                                                                            }}
                                                                        >
                                                                            <i className="bx bx-square chart-icon-style" />
                                                                            <p>Rectangle Card</p>
                                                                        </div>
                                                                        <div className="chart-icon" draggable onDragStart={(e) => handleIconDragStart(e, 'barChart', "bar_charts")}>
                                                                            <i className="bx bxs-bar-chart-alt-2 chart-icon-style text-primary" />
                                                                            <p>Bar Chart</p>
                                                                        </div>
                                                                        <div className="chart-icon" draggable onDragStart={(e) => handleIconDragStart(e, 'lineChart', "line_chart")}>
                                                                            <i className="bx bx-line-chart chart-icon-style" />
                                                                            <p>Line Chart</p>
                                                                        </div>
                                                                        <div className="chart-icon" draggable onDragStart={(e) => handleIconDragStart(e, 'pieChart', "pie_chart")}>
                                                                            <i className="bx bx-pie-chart-alt-2 chart-icon-style" />
                                                                            <p>Pie Chart</p>
                                                                        </div>
                                                                        <div className="chart-icon" draggable onDragStart={(e) => handleIconDragStart(e, 'stackBar', "stack_bar")}>
                                                                            <i className="bx bx-layer chart-icon-style" />
                                                                            <p>Stack Chart</p>
                                                                        </div>
                                                                        <div className="chart-icon" draggable onDragStart={(e) => handleIconDragStart(e, 'horBarChart', "hor_barcharts")}>
                                                                            <i className="bx bx-bar-chart chart-icon-style" />
                                                                            <p>Horizontal Bar Chart</p>
                                                                        </div>
                                                                        <div className="chart-icon" draggable onDragStart={(e) => handleIconDragStart(e, 'areaChart', "area_chart")}>
                                                                            <i className="bx bx-area chart-icon-style" />
                                                                            <p>Area Chart</p>
                                                                        </div>
                                                                        <div className="chart-icon" draggable onDragStart={(e) => handleIconDragStart(e, 'horStack', "hor_stack")}>
                                                                            <i className="bx bx-layer chart-icon-style" />
                                                                            <p>Horizontal Stack Chart</p>
                                                                        </div>
                                                                        <div className="chart-icon" draggable onDragStart={(e) => handleIconDragStart(e, 'VerticalLinechart', "Vertical_linechart")}>
                                                                            <i className="bx bx-line-chart chart-icon-style" style={{ transform: "rotate(90deg)" }} />
                                                                            <p>Vertical Line Chart</p>
                                                                        </div>
                                                                        <div className="chart-icon" draggable onDragStart={(e) => handleIconDragStart(e, 'table', "table")} >
                                                                            <i className="bx bx-table chart-icon-style" />
                                                                            <p>Table</p>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}

                                                            {selectMenu === '4' && (
                                                                <div className="chart-options">
                                                                    <p className="text-primary fw-bold"> Drag and Drop Card </p>
                                                                    <div className="chart-icon" draggable onDragStart={(e) => handleIconDragStart(e, rectangle, "rectangle_card")}>
                                                                        <i className="bx bx-square chart-icon-style" />
                                                                        <p>Rectangle Card</p>
                                                                    </div>

                                                                </div>
                                                            )}


                                                            {selectMenu === '5' && (
                                                                <>
                                                                    <div style={{ position: 'sticky', top: 0, zIndex: 3, backgroundColor: 'white', padding: '5px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                                                        <Label className="text-primary fw-bold mb-0 p-1"> Select Fields</Label>
                                                                        {/* <i className="bx bx-reset font-size-17 align-middle icon-hover " title='Reset' onClick={() => handleResetfilter()} style={{ cursor: 'pointer' }}></i> */}

                                                                    </div>

                                                                    <div className="d-flex flex-column gap-2 pt-1">
                                                                        <div className="d-flex justify-content-evenly flex-wrap gap-1" style={{}}>
                                                                            {filterLoading ? (
                                                                                <Spin tip="Loading">
                                                                                    {content}
                                                                                </Spin>
                                                                            ) : (
                                                                                <div>
                                                                                    <ul className="list-unstyled mt-1 p-1"  >
                                                                                        {reportSlice.filterXaxisValue.map((ele, idx) => {
                                                                                            const isChecked = updatedSliceData?.some(item => item.name === ele.name);
                                                                                            return (
                                                                                                <li key={idx} className="mb-1">
                                                                                                    <input
                                                                                                        type="checkbox"
                                                                                                        id={`checkbox-${idx}`}
                                                                                                        name={`checkbox-${idx}`}
                                                                                                        value={ele.name}
                                                                                                        defaultChecked={isChecked}
                                                                                                        onChange={(e) => handleCheckboxChange(e, ele.name)}
                                                                                                        className=""
                                                                                                    />

                                                                                                    {ele.name.length > 10 && (
                                                                                                        <UncontrolledTooltip placement="auto" target={`label-${idx}`}>
                                                                                                            {ele.name}
                                                                                                        </UncontrolledTooltip>
                                                                                                    )}

                                                                                                    <label
                                                                                                        id={`label-${idx}`}
                                                                                                        htmlFor={`checkbox-${idx}`}
                                                                                                        onDragStart={(e) => handleIconDragStart(e, undefined, ele.name)}
                                                                                                        onClick={() => scrollToLabel(`label-${idx}`)}
                                                                                                        draggable
                                                                                                        className="form-check-label"
                                                                                                    >
                                                                                                        {ele.name.length > 10 ? `${ele.name.substring(0, 10)}...` : ele.name}
                                                                                                    </label>
                                                                                                </li>
                                                                                            );
                                                                                        })}
                                                                                    </ul>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </>


                                                            )}

                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                    </>

                                                )
                                        }
                                        {
                                            !(!startDate || !endDate) ?
                                                <>
                                                    {selectMenu === '5' && sliceCards.length > 0 && (

                                                        // <div className={`scroll-design sidebar mx-1 secondary-sidebar-expanded`}>
                                                        <div className={`scroll-design sidebar mx-1 secondary-sidebar-expanded`} style={{ zoom: 0.9 }}>
                                                            <>
                                                                <div style={{ position: 'sticky', top: 0, zIndex: 3, backgroundColor: 'white', padding: '5px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                                                    <div className="d-flex algin-items-center justify-content-between">
                                                                        <div>
                                                                            <Label className="text-primary fw-bold">Unique Filter </Label>
                                                                        </div>
                                                                        <div>
                                                                            {/* <button className="btn btn-sm btn-outline-primary" title='Reset' onClick={() => handleResetfilter()}>  */}
                                                                            <i className="bx bx-reset font-size-17 align-middle icon-hover" title='Reset' onClick={() => handleResetfilter()} style={{ cursor: 'pointer' }}></i>
                                                                            {/* </button> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="p-1 w-100">
                                                                    {filterLoading ? (
                                                                        <Spin tip="Loading">
                                                                            {content}
                                                                        </Spin>
                                                                    ) : (

                                                                        <div>
                                                                            <ul className="list-unstyled">
                                                                                {/* <div style={{ border: '1px solid #e9e9e9', background: '#EAF1FB' }} className="p-2 mb-1">
                                                                        <div style={{ maxHeight: '200px', overflowY: 'auto', maxWidth: "auto", overflowX: 'hidden' }} className="scroll-design">                                                                           
                                                                            <div className="d-flex align-items-center justify-content-between">
                                                                                <button className="btn btn-sm btn-danger" onClick={() => handleResetfilter()}>Reset</button>
                                                                            </div>

                                                                        </div>
                                                                    </div> */}
                                                                                {
                                                                                    sliceCards?.map((data, indexes) => {
                                                                                        return (
                                                                                            <>

                                                                                                {/* <div style={{ border: '1px solid #e9e9e9', background: '#EAF1FB' }} key={indexes} className="p-2 mb-1"> */}
                                                                                                <div style={{ border: '1px solid lightgrey' }} key={indexes} className="p-2 mb-1">
                                                                                                    <Label style={{ textTransform: 'uppercase', background: '#EAF1FB' }} className="px-1">{data.name}</Label>
                                                                                                    <div key={data.i} id={data.i} style={{ maxHeight: '200px', overflowY: 'auto', maxWidth: "auto" }} className="scroll-design">
                                                                                                        <div id={`${'bar2' + data.i}`}>
                                                                                                            {
                                                                                                                data.slicer_values !== undefined ?
                                                                                                                    <Slicer ref={slicerRef} data={data} containerWidth={500} containerHeight={150} requestInfo={requestInfo} />
                                                                                                                    :
                                                                                                                    <>
                                                                                                                        <Spin tip="Loading"> {content} </Spin>
                                                                                                                    </>
                                                                                                            }
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    )}

                                                                </div>
                                                            </>
                                                        </div>
                                                    )}
                                                </>
                                                :
                                                null}

                                        <div className="chart-content w-100 scroll-design" style={{ zoom: 0.9, borderLeft: '1px solid lightgrey' }}>
                                            <div style={{ position: 'sticky', top: 0, zIndex: 3, backgroundColor: 'aliceblue', padding: '5px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className="d-flex justify-content-between">
                                                {/* <div style={{ minWidth: '250px' }}>
                                                    <Label className="text-primary fw-bold mb-0 p-1">Date Range</Label><span className="text-danger">*</span>
                                                    <DatePicker selectsRange={true} startDate={startDate} dateFormat="dd-MMM-yyyy"
                                                        popperModifiers={[
                                                            { name: "offset", options: { offset: [0, 10] } },
                                                            { name: "preventOverflow", options: { boundary: "viewport", } },
                                                            { name: "zIndex", enabled: true, phase: 'write', fn: ({ state }) => { state.styles.popper.zIndex = 9999 } },
                                                        ]}
                                                        endDate={endDate} onChange={handleDateChange} isClearable={true} maxDate={new Date()} className="form-control w-100" placeholderText="Select Start and End Date" />
                                                    {hasDateErrors && (
                                                        <div className="text-danger font-size-10">
                                                            {(!startDate || !endDate) && <div>{dateErrorMessage}</div>}
                                                            {startDate && endDate && moment(startDate).isAfter(moment(endDate)) && <div>Start date cannot be after end date.</div>}
                                                        </div>
                                                    )}
                                                </div> */}
                                                <div>
                                                    {
                                                        console.log(treeDataSlice, 'treeDataSlice 2992' , JSON.parse(sessionStorage.getItem('pageNodeInfo'))?.selected_cln_name )
                                                    }
                                                    <Label className="fw-bold text-primary mb-0 p-1">{`${JSON.parse(sessionStorage.getItem('pageNodeInfo'))?.title} (${labelText})`}</Label>
                                                </div>

                                            </div>


                                            {dateRange.every(value => value === null) ? (
                                                <p className="text-danger p-2 ml-2">Both start and end dates are not selected.</p>
                                            ) :
                                                dateRange.every(value => value != null) ?
                                                    (
                                                        <>
                                                            <div className="chart-container mb-1" style={{ backgroundColor :'aliceblue'}}>
                                                                <div>
                                                                    <Row id="my-specific-row" >
                                                                        <Col>
                                                                            {
                                                                                isSidePanelOpen ?
                                                                                    <div>
                                                                                        <SidePanel
                                                                                            overlay={true}
                                                                                            updateLayout={(data, rerender) => { updateLayout(data, rerender) }}
                                                                                            layout={layout}
                                                                                            isOpen={isSidePanelOpen}
                                                                                            onClose={() => { setSidePanelOpen(false); }}
                                                                                            data={sidepanelData}
                                                                                            db_data={requestInfo}
                                                                                            show_table_function={(e, blockdata, blockIdx, layout) => showTableFunc(e, blockdata, blockIdx, layout)}
                                                                                        />
                                                                                    </div>
                                                                                    :
                                                                                    null
                                                                            }
                                                                        </Col>
                                                                    </Row>

                                                                    {
                                                                        console.log('layout 2992 :>> ', layout, "dateAdded---->", dateAdded, "reportSlice.noLayoutdata---->", reportSlice.noLayoutdata, "reportSlice.endDate--->", reportSlice.endDate, 'isFullScreen', isFullScreen)
                                                                    }
                                                                    {
                                                                        layout.length > 0 && dateAdded ?

                                                                            <ResponsiveGridLayout
                                                                                layouts={{ lg: layout }}
                                                                                breakpoints={{ lg: 1024, md: 700, sm: 768, xs: 480 }}
                                                                                cols={{ lg: 12, md: 4, sm: 4, xs: 4 }}
                                                                                rowHeight={100}
                                                                                isResizable={true}
                                                                                isDraggable={true}
                                                                                onDragStop={onDragStop}
                                                                                ref={layoutRef}
                                                                                resizeHandles={isFullScreen ? [] : ['e', 's', 'se', "w", "n"]}
                                                                                onResizeStop={onResize}
                                                                                width={"width-40px"}
                                                                                draggableCancel=".grid-item-content"
                                                                                draggableHandle=".drag-handle"
                                                                                transformScale={1}
                                                                                style={{ overflow: 'hidden', transition: 'all 0.2s ease-out', maxHeight: '100%' }}
                                                                                allowOverlap={false} // Prevent overlapping, making it smoother
                                                                            >

                                                                                {
                                                                                    layout?.length > 0 && layout !== undefined ?
                                                                                        layout
                                                                                            .map((item, index1) => (
                                                                                                <div
                                                                                                    key={item.i}
                                                                                                    style={{ cursor: 'default', overflow: 'hidden', transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.2s ease-in-out', border: selectedItem && selectedItem.i === item.i ? "2px solid #007BFF" : "", }}

                                                                                                    onDragOver={(e) => handleDragOver(e, item)}
                                                                                                    onDrop={(e) => handleDropLayout(e, item)}
                                                                                                    onClick={() => handleClick(item)}
                                                                                                    id={item.i}
                                                                                                    className="chart"
                                                                                                >


                                                                                                    < LayoutHeader
                                                                                                        item={item}
                                                                                                        convertChart={convertChart}
                                                                                                        onlayoutClick={onlayoutClick}
                                                                                                        showTableFunc={showTableFunc}
                                                                                                        delBlock={delBlock}
                                                                                                        index1={index1}
                                                                                                        isFullScreen={isFullScreen}
                                                                                                        handleToggleFullScreen={handleToggleFullScreen}
                                                                                                        exitScreen={exitScreen}
                                                                                                        layout={layout}
                                                                                                        sessionInfo={authUser}
                                                                                                        mathOperation={mathOperation}
                                                                                                    />




                                                                                                    {
                                                                                                        item.name === 'bar_charts' ?
                                                                                                            <div id={`${'bar1' + item.i}`} style={{ boxShadow: 'none', border: 'none', overflow: 'hidden' }}>
                                                                                                                <div  >

                                                                                                                    <BarComponent item={item} index1={index1} default_bar_chart_values={default_bar_chart_values} />

                                                                                                                </div>

                                                                                                            </div>
                                                                                                            :
                                                                                                            item.name === 'stack_bar' ? (
                                                                                                                <div id={`${'bar1' + item.i}`} >
                                                                                                                    <div >
                                                                                                                        <StackComponent item={item} index1={index1} default_stack_chart_values={default_stack_chart_values} />

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            )
                                                                                                                :
                                                                                                                item.name === 'area_chart' ?
                                                                                                                    (
                                                                                                                        <div id={`${'bar1' + item.i}`} >
                                                                                                                            <div style={{}}>

                                                                                                                                <AreaComponent item={item} index1={index1} default_area_chart_values={default_area_chart_values} />

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    )
                                                                                                                    :
                                                                                                                    item.name === 'pie_chart' ?
                                                                                                                        (
                                                                                                                            <div id={`${'bar1' + item.i}`} style={{ boxShadow: 'none', border: 'none' }} >
                                                                                                                                <div style={{ boxShadow: 'none', border: 'none' }} >


                                                                                                                                    <PieComponent item={item} index1={index1} default_pie_chart_values={default_pie_chart_values} requestInfo={requestInfo} />

                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        )
                                                                                                                        :
                                                                                                                        item.name === 'line_chart' ?
                                                                                                                            (
                                                                                                                                <div id={`${'bar1' + item.i}`} >
                                                                                                                                    <div style={{ position: 'relative' }}>

                                                                                                                                        <LineComponenet item={item} index1={index1} default_line_chart_values={default_line_chart_values} />

                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            )
                                                                                                                            : item.name === "rectangle_card" ?
                                                                                                                            
                                                                                                                                // <div className="mini-stats-wid" style={{ marginTop: '65px' }}>
                                                                                                                                //     <div>
                                                                                                                                //         <div className="d-flex p-3" style={{ boxShadow: 'none' }}>
                                                                                                                                //             <div className="flex-grow-1 ml-3" style={{ boxShadow: 'none', marginLeft: '16px' }}>
                                                                                                                                //                 <p className=" "
                                                                                                                                //                     // style={getStyle(item, '1')}
                                                                                                                                //                     style={{ fontSize: '18px', color: 'red', fontWeight: 'bold' }}
                                                                                                                                //                 >
                                                                                                                                //                     {item.text?.toUpperCase()}
                                                                                                                                //                 </p>
                                                                                                                                //                 <h6 className="text-muted fw-medium" style={getStyle(item, "2")}>
                                                                                                                                //                     {item?.filteredcount
                                                                                                                                //                         ? item.filteredcount
                                                                                                                                //                         : item.count !== null && item.count !== undefined
                                                                                                                                //                             ? item.count
                                                                                                                                //                             : "IN- VALID"
                                                                                                                                //                     }
                                                                                                                                //                 </h6>
                                                                                                                                //             </div>
                                                                                                                                //             <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                                                                                                                                //                 <span className="avatar-title rounded-circle bg-primary">
                                                                                                                                //                     <i className={"bx bx-copy-alt font-size-24"} ></i>
                                                                                                                                //                 </span>
                                                                                                                                //             </div>
                                                                                                                                //         </div>
                                                                                                                                //     </div>
                                                                                                                                // </div>
                                                                                                                                <RectangleCardComponent item={item} index1={index1} />

                                                                                                                                :
                                                                                                                                item.name === 'table' ?
                                                                                                                                    <div >

                                                                                                                                        <D3TableComponent item={item} index1={index1} default_stack_chart_values={default_stack_chart_values} />

                                                                                                                                    </div>
                                                                                                                                    :
                                                                                                                                    item.name === 'hor_barcharts' ?
                                                                                                                                        <div id={`${'bar1' + item.i}`} style={{}}>
                                                                                                                                            <div >


                                                                                                                                                <HorBarchartComponent item={item} index1={index1} default_bar_chart_values={default_bar_chart_values} />

                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                        :
                                                                                                                                        item.name === 'hor_stack' ?
                                                                                                                                            <div id={`${'bar1' + item.i}`} style={{}}>
                                                                                                                                                <div >
                                                                                                                                                    <HorStackBarComponent item={item} index1={index1} default_stack_chart_values={default_stack_chart_values} />

                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                            :
                                                                                                                                            item.name === 'Vertical_linechart' ?
                                                                                                                                                (
                                                                                                                                                    <div id={`${'bar1' + item.i}`} style={{ boxShadow: 'none', border: 'none' }} >
                                                                                                                                                        <div style={{ boxShadow: 'none', border: 'none' }} >

                                                                                                                                                            <VerticalChartComponenet item={item} index1={index1} default_line_chart_values={default_line_chart_values} />


                                                                                                                                                        </div>
                                                                                                                                                    </div>
                                                                                                                                                )
                                                                                                                                                :
                                                                                                                                                item.chart_name === 'slicer' ?
                                                                                                                                                    <div
                                                                                                                                                        id={`${'bar1' + item.i}`}
                                                                                                                                                        style={{
                                                                                                                                                            display: 'flex',
                                                                                                                                                            justifyContent: 'center',
                                                                                                                                                            alignItems: 'center',

                                                                                                                                                        }}
                                                                                                                                                    >
                                                                                                                                                        <Slicer data={item}
                                                                                                                                                            ref={el => (refs.current[`filterRef${item.i}`] = el)}
                                                                                                                                                            containerWidth={item.containerWidth}
                                                                                                                                                            containerHeight={item.containerHeight}
                                                                                                                                                            requestInfo={requestInfo} />
                                                                                                                                                    </div>

                                                                                                                                                    :

                                                                                                                                                    null
                                                                                                    }
                                                                                                    {
                                                                                                        item.type !== undefined &&
                                                                                                        item.type === 'text' &&
                                                                                                        <div className="d-flex" style={{ justifyContent: 'space-between', boxShadow: 'none' }}>
                                                                                                            <div style={{
                                                                                                                display: 'flex',
                                                                                                                justifyContent: 'center',
                                                                                                                alignItems: 'center',
                                                                                                                maxWidth: '500px',
                                                                                                                marginLeft: '50px',
                                                                                                                boxShadow: 'none'
                                                                                                            }}>
                                                                                                                <Input
                                                                                                                    defaultValue={item.value}
                                                                                                                    style={{ fontSize: item.fontsize, border: '' }}
                                                                                                                    onChange={(e) => updtTxtLayout(e, item, index1)}
                                                                                                                />
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    }
                                                                                                </div>
                                                                                            ))
                                                                                        :
                                                                                        null
                                                                                }
                                                                            </ResponsiveGridLayout>
                                                                            :

                                                                            !reportSlice.noLayoutdata ?
                                                                                <div className="empty-tag-container ">
                                                                                    <div className="empty-tag-message" style={{ justifyContent: 'center' }}>
                                                                                        <img src={surgurulogo} alt="No Data" className="loading-image" style={{ maxHeight: '6vh', maxWidth: '100%', objectFit: 'contain' }} />
                                                                                        <p>Loading...</p>
                                                                                        <p>Please Wait!!!.</p>
                                                                                    </div>
                                                                                </div>
                                                                                :
                                                                                null

                                                                        //     !reportSlice.noLayoutdata && reportSlice.endDate ?
                                                                        // <div className="empty-tag-container">
                                                                        //     <div className="empty-tag-message">
                                                                        //         <img src={surgurulogo} alt="No Data" className="no-data-logo" style={{ maxHeight: '6vh', maxWidth: '100%', objectFit: 'contain' }} />
                                                                        //         {/* <h5>No Data Found</h5>
                                                                        //         <p>Please Create the Charts Layout.</p> */}
                                                                        //     </div>
                                                                        // </div>
                                                                        //     :
                                                                        // <p>Loading...</p>

                                                                    }
                                                                    {

                                                                        layout.length === 0 && reportSlice.noLayoutdata ?
                                                                            <>
                                                                                <div className="empty-tag-container">
                                                                                    <div className="empty-tag-message">
                                                                                        <img src={surgurulogo} alt="No Data" className="no-data-logo" style={{ maxHeight: '6vh', maxWidth: '100%', objectFit: 'contain' }} />
                                                                                        <h5>No Data Found</h5>
                                                                                        <p>Please Create the Charts Layout.</p>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                            :
                                                                            null
                                                                    }
                                                                </div>
                                                            </div>
                                                        </>

                                                    )
                                                    : (
                                                        <p>Dates are selected or partially filled.</p>
                                                    )}

                                        </div>
                                    </div>
                                </div>
                            }
                        </CardBody>
                    </Card>
                </Container>
            </div>


        </React.Fragment>
    );
}
//         <Card style={{ height: '100%' }}> <CardBody >
//         <div style={{ textAlign: 'right', border: 'none', boxShadow: 'none' }}>
//             <i className="bx bx-edit-alt" style={{ cursor: 'pointer', color: '#6666b2', fontSize: '25px' }} onClick={(e) => { onlayoutClick(item, index1, layout); sessionStorage.setItem('blockdata', JSON.stringify(item)); sessionStorage.setItem('blockIdx', JSON.stringify(index1)) }}  ></i>
//             <span>
//                 <i className="bx bx-x" onClick={(e) => delBlock(e, item, index1)} style={{ cursor: 'pointer', fontSize: '35px', width: "45px", zIndex: '0' }} ></i>
//             </span>
//         </div>
//         <br />
// <div className="d-flex" style={{ boxShadow: 'none' }}>
//     <div className="flex-grow-1" style={{ boxShadow: 'none' }}>
//         <p className=" " style={getStyle(item, '1')}>
//             {item.text}
//         </p>
//         <h4 className="mb-0" style={getStyle(item, '2')}>{(item?.filteredcount ? item.filteredcount : (item.count !== null && item.count !== undefined) ? item.count : 'IN- VALID')}</h4>

//     </div>
//             <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
//                 <span className="avatar-title rounded-circle bg-primary">
//                     <i className={"bx bx-copy-alt font-size-24"}
//                     ></i>
//                 </span>
//             </div>
//         </div>
//     </CardBody>
// </Card> 

export default LayoutInfo