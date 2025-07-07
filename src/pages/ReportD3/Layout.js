import React, { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { useHistory } from "react-router-dom"
import Swal from 'sweetalert2';
import SidePanel from '../ReportD3/Components/SidePanel';
import { Responsive, WidthProvider } from 'react-grid-layout';
import * as d3 from 'd3';
import store from '../../store';
// Images Assets path
import one_row from '../../assets/images/row.jpg'
import two_col from '../../assets/images/2-col.jpg'
import three_col from '../../assets/images/3-col.jpg'
import four_col from '../../assets/images/4-col.jpg'
import five_col from '../../assets/images/5-col.jpg'
import barChart from '../../../src/assets/images/crp_bar.png'
import hor_barChart from '../../../src/assets/images/Picsart_24-01-25_19-04-12-866.jpg'
import areaChart from '../../../src/assets/images/crp_Areas.png'
import stackChart from '../../../src/assets/images/crp_stack.png'
import hor_stackChart from '../../../src/assets/images/Picsart_24-01-25_19-06-10-286.png'
import pieChart from '../../../src/assets/images/crp_piechrt.png'
import lineChart from '../../../src/assets/images/crp_linechrt.png'
import rectangle from '../../assets/images/png-clipart-rectangle-shape-shape-angle-rectangle-thumbnail.png'

//charts JS path
import BarChart from '../ReportD3/Components/D3Charts/BarChart'
import StackChart from '../ReportD3/Components/D3Charts/StackChart'
import AreaChart from '../ReportD3/Components/D3Charts/AreaChart'
import PieChart from '../ReportD3/Components/D3Charts/PieChart'
import LineChart from "../ReportD3/Components/D3Charts/LineChart";
import HorizontalbarChart from '../ReportD3/Components/D3Charts/HorizontalBarChart'
import HorizontalStackChart from '../ReportD3/Components/D3Charts/HorizontalStackChart'
import vertical from '../../../src/assets/images/crp_linechrt2.png'
import VerticalLineChart from '../ReportD3/Components/D3Charts/VerticalLineChart'
import D3Table from "../ReportD3/Components/D3Charts/D3Table";

import {
    Row, Col, Button, Container, CardBody,
    Card,
    DropdownMenu,
    DropdownToggle, UncontrolledDropdown,
    DropdownItem,
    Spinner
} from "reactstrap";
import { Input } from 'antd';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDispatch, useSelector } from 'react-redux';

import { updateLayoutInfo, createLayout, setSaveData, setXaxisFilterValue, updateLayoutData, selectGlobalXaxis, setBreakpoints, 
    retriveClnKeys, retrivePageLayout, updateChartData } from "../../Slice/reportd3/reportslice";

import Slicer from "./Components/Slicer";

const ResponsiveGridLayout = WidthProvider(Responsive);

const LoadingOverlay = () => {
    return (
        <Col lg="12">
            <Card>
                <CardBody style={{ height: "100vh" }}>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <div>Loading...</div>
                        <Spinner className="ms-2" color="primary" />
                    </div>
                </CardBody>
            </Card>
        </Col>
    )
}


const LayoutHeader = ({ item, convertChart, onlayoutClick,
    showTableFunc,
    delBlock,
    index1,
    isFullScreen,
    handleToggleFullScreen,
    exitScreen,
    layout,
    sessionInfo,
    mathOperation

}) => {
    return (
        <>
            {
                item.data !== undefined &&
                <>
                    <div
                        className="outLay"
                        style={{
                            width: "auto",
                            position: 'absolute',
                            top: '10px',
                            right: '350px',
                            zIndex: '1',
                            color: '#6666B2',
                            boxShadow: 'none',
                            backgroundColor: 'transparent'
                        }}
                    >
                       
                        <select onChange={(e) => {
                            mathOperation(item, e.target.value)
                        }} value={item.selected_operation === undefined ? "Select" : String(item.selected_operation)}>
                            <option value={"Select"} disabled>Select</option>
                            {
                                sessionInfo.config_data.report_math_operations?.map((ele, pos) => {
                                    return (
                                        <option key={pos} value={ele.id}>{ele.name}</option>

                                    )
                                })
                            }
                        </select>
                    </div>

                </>
            }

            {(item.fullScreen_enabled === undefined || item.fullScreen_enabled === false)
                &&

                <div

                    className="drag-handle "
                    style={{
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                        padding: '5px',
                        // width: '50px',
                        // height: "40px",
                        cursor: 'move',
                        // background: 'lightblue',
                        zIndex: 1
                    }}
                >
                    <i className="bx bx-menu text-primary"

                        style={{
                            fontSize: '30px',

                        }}

                    ></i>
                </div>
            }
            {
                <>
                    <p style={{
                        position: 'absolute',
                        top: '2%',
                        left: '9%',
                        zIndex: '10',
                        backgroundColor: 'transparent',
                        padding: '0.5em',
                        fontWeight: 'bold',
                        color: 'black',
                        fontSize: '0.5vw', // Adjust font size based on viewport width
                    }}
                        className="ms-1"
                    >
                        {item.chart_name?.toUpperCase()}
                        {/* {item.i?.slice(-3)} */}
                    </p>
                    <style>
                        {`
            @media (max-width: 600px) {
                p {
                    font-size: 10px; // Set font size to 10px on smaller screens
                }
            }
        `}
                    </style>
                </>
            }
            {
                (item.name !== undefined && item.name !== 'rectangle_card' && item.name !== '' && item.name !== 'pie_chart')
                &&
                <div className="outLay"
                    style={{
                        // cursor: 'pointer',
                        fontSize: '5px',
                        width: '45px',
                        position: 'absolute',
                        top: '10px',
                        right: '70px',
                        zIndex: '1',
                        color: '#6666B2',
                        boxShadow: 'none',
                        backgroundColor: 'transparent'
                    }}
                >
                    <UncontrolledDropdown className="" style={{ marginLeft: '-118px', width: '25px', boxShadow: 'none', backgroundColor: 'transparent', position: 'absolute', }}>
                        <DropdownToggle tag="a" className="" role="button">

                            {
                                (item.fullScreen_enabled !== true) && <span>
                                    <i className="bx bx-bar-chart-alt-2"
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '20px',
                                            width: '45px',
                                            zIndex: '1',
                                            color: '#6666B2',
                                            boxShadow: 'none'
                                        }}
                                    ></i>
                                </span>}
                        </DropdownToggle>

                        <DropdownMenu className="dropdown-menu-end" style={{ top: '-282px', right: '250px' }} >
                            <DropdownItem className="dropdown-item" href="#" onClick={() => convertChart('Stack', item, index1)}>Stack</DropdownItem>
                            <DropdownItem className="dropdown-item" href="#" onClick={() => convertChart('bar_charts', item, index1)}>Bar Chart</DropdownItem>
                            <DropdownItem className="dropdown-item" href="#" onClick={() => convertChart('area_chart', item, index1)}>Area</DropdownItem>
                            <DropdownItem className="dropdown-item" href="#" onClick={() => convertChart('line_chart', item, index1)}>LineChart</DropdownItem>
                            <DropdownItem className="dropdown-item" href="#" onClick={() => convertChart('hor_barcharts', item, index1)}>Horizontal Bar chart</DropdownItem>
                            <DropdownItem className="dropdown-item" href="#" onClick={() => convertChart('hor_stack', item, index1)}>Horizontal Stack chart</DropdownItem>
                            <DropdownItem className="dropdown-item" href="#" onClick={() => convertChart('Vertical_linechart', item, index1)}>Vertical Line  chart</DropdownItem>
                            <DropdownItem className="dropdown-item" href="#" onClick={() => convertChart('table', item, index1)}>Table</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            }
            {
                (item.name !== undefined && item.name !== 'rectangle_card' && item.name !== '') &&
                <>
                    {
                        (item.fullScreen_enabled !== true) &&
                        <span>
                            <i className="bx bx-edit-alt"
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    width: '26px',
                                    position: 'absolute',
                                    top: '10px',
                                    right: item.name == 'pie_chart' ? '200px' : '240px',
                                    zIndex: '1',
                                    color: '#6666B2',
                                }}
                                onClick={(e) => {
                                    onlayoutClick(item, index1, layout);
                                    sessionStorage.setItem('blockdata', JSON.stringify(item));
                                    sessionStorage.setItem('blockIdx', JSON.stringify(index1))
                                }}
                                title="Edit"
                            ></i>
                        </span>}
                    {
                        (item.name != 'table') &&
                        <>
                            {
                                (item.show_table === true && item.fullScreen_enabled !== true) ?
                                    <button style={{
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        width: '28px',
                                        position: 'absolute',
                                        // top: '10px',
                                        right: '163px',
                                        zIndex: '1',
                                        height: '25px',
                                        backgroundColor: 'transparent',
                                        border: 'none'
                                    }}
                                        onClick={async (e) => {
                                            sessionStorage.setItem('blockdata', JSON.stringify(item));
                                            sessionStorage.setItem('blockIdx', JSON.stringify(index1));
                                            showTableFunc(e, item, index1, layout);
                                        }}
                                        title="Table"

                                    >
                                        <span>
                                            {/* <Icon
                                                path={mdiTableOff} // with strike slash
                                                style={{
                                                    cursor: 'pointer',
                                                    fontSize: '15px',
                                                    width: '25px',
                                                    marginLeft: item.name == 'pie_chart' ? '50px' : '22px',
                                                    // marginTop: '-35px',
                                                }}
                                                title="Table"
                                            /> */}
                                        </span>

                                    </button>
                                    :
                                    ((item.show_table === false || item.show_table === undefined) && item.fullScreen_enabled !== true) ?
                                        <button style={{
                                            cursor: 'cursor',
                                            fontSize: '20px',
                                            width: '28px',
                                            position: 'absolute',
                                            // top: '1px',
                                            right: '163px',
                                            zIndex: '1',
                                            height: '20px',
                                            backgroundColor: 'transparent',
                                            border: 'none'
                                        }}
                                            onClick={async (e) => {
                                                sessionStorage.setItem('blockdata', JSON.stringify(item));
                                                sessionStorage.setItem('blockIdx', JSON.stringify(index1));
                                                showTableFunc(e, item, index1, layout);
                                            }}
                                        >
                                            {/* <Icon
                                                path={mdiTableLarge}
                                                style={{
                                                    cursor: 'pointer',
                                                    fontSize: '20px',
                                                    width: '20px',
                                                    marginLeft: item.name == 'pie_chart' ? '50px' : '22px',
                                                    // marginTop: '-30px',
                                                }}
                                                title="Table"
                                            /> */}
                                        </button>
                                        :
                                        null
                            }
                            <div onClick={() => { !isFullScreen ? handleToggleFullScreen(item.i, item, layout, index1) : exitScreen(item.i, index1) }}>
                                <span>
                                    <i
                                        className={`bx ${isFullScreen ? ' bx-exit-fullscreen' : 'bx-fullscreen'}`}
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '20px',
                                            position: 'absolute',
                                            top: '8px',
                                            right: item.name == 'pie_chart' ? '165px' : '175px',
                                            zIndex: '1',
                                            color: '#6666B2',
                                        }}
                                        title="Full-Screen"
                                    />
                                </span>
                            </div>
                        </>
                    }
                </>
            }
            {
                (item.name !== 'rectangle_card' && item.fullScreen_enabled !== true)
                &&
                <i
                    className="bx bx-x "
                    onClick={(e) => delBlock(e, item, index1)}
                    style={{
                        cursor: 'pointer',
                        fontSize: '28px',
                        width: '45px',
                        position: 'absolute',
                        top: '7px',
                        right: '25px',
                        zIndex: '1',
                    }}
                >
                </i>}
        </>
    )
}


const Layout = () => {
    const history = useHistory()
    const dispatch = useDispatch();
    const layoutRef = useRef(null)
    const [targetBlock, settargetBlock] = useState(null);
    const [iconData, seticonData] = useState(null);
    const [iconName, seticonName] = useState(null);
    const [isResizing, setisResizing] = useState(false);
    const [showSaveAnimation, setShowSaveAnimation] = useState(false);
    const [standardLayout, setStandardLayout] = useState(true);
    const [autoLayout, setautoLayout] = useState(false);
    const [charts, setcharts] = useState(false);
    const [grid, setGrid] = useState(false);
    const [Text, setText] = useState(false);
    const [selectMenu, setSelectMenu] = useState('1');
    const [isSidePanelOpen, setSidePanelOpen] = useState(false);
    const [sidepanelData, setSidepanelData] = useState([]);
    const [dbInfo, setDbInfo] = useState(JSON.parse(sessionStorage.getItem('db_info')))
    const [pageInfo, setpageInfo] = useState(JSON.parse(sessionStorage.getItem('page_data')))
    const [userInfo, setuserInfo] = useState(JSON.parse(sessionStorage.getItem('authUser')).user_data)
    const [dbCollections, setdbCollections] = useState(JSON.parse(sessionStorage.getItem('authUser')).config_data.report_collection_name)
    const [defaultBarChartValue, setDefaultBarChartValue] = useState(JSON.parse(sessionStorage.getItem('authUser')).config_data.default_bar_chart_values)
    const [defaultPieChartValue, setDefaultPieChartValue] = useState(JSON.parse(sessionStorage.getItem('authUser')).config_data.default_pie_chart_values)
    const [defaultStackChartValue, setDefaultStackChartValue] = useState(JSON.parse(sessionStorage.getItem('authUser')).config_data.default_stack_chart_values)
    const [defaultLineChartValue, setDefaultLineChartValue] = useState(JSON.parse(sessionStorage.getItem('authUser')).config_data.default_line_chart_values)
    const [defaultVerticalLineChartValue, setDefaultVerticalLineChartValue] = useState(JSON.parse(sessionStorage.getItem('authUser')).config_data.default_vertical_line_chart_values)
    const [defaultAreaChartValue, setDefaultAreaChartValue] = useState(JSON.parse(sessionStorage.getItem('authUser')).config_data.default_area_chart_values)
    const [isFullScreen, setIsFullScreen] = useState(null);
    const [loading, setLoading] = useState(false);
    const [prvpage, setprvpage] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(true)
    const [sessionInfo, setSessionInfo] = useState(JSON.parse(sessionStorage.getItem("authUser")))
    // const [saveData, setsaveData] = useState(false)



    const [groupedBlocks, setGroupedBlocks] = useState({});
    const [standardWidth, setStandardWidth] = useState(4);



    const [fullscreenSize, setFullscreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    // const [breakPoints,setBreakpoints] = useState({})
    const reportSlice = useSelector(state => state.reportSliceReducer)
    const saveData = reportSlice.saveData

    const layout = reportSlice.layoutInfo
    const layoutId = reportSlice.layoutId
    const requestInfo = {
        dbInfo, layoutId, pageInfo, userInfo
    }
    const rowRef = useRef(null);
    var getBreakPoints = {}


    useEffect(() => {
        const rowElement = 'my-specific-row'
        const rowElementId = document.getElementById(rowElement);
        const width = rowElementId.offsetWidth;
        const height = rowElementId.offsetHeight;
        getBreakPoints = calculateBreakpoints(width, height)
        dispatch(setBreakpoints(getBreakPoints))
        dispatch(retrivePageLayout())
    }, [dispatch])




    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);




    const handleResize = async () => {
        setFullscreenSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        var reportSlice = store.getState().reportSliceReducer
        var responsed = await responsive_chrts(reportSlice.layoutInfo)
        if (responsed !== undefined && responsed.length > 0) {
            dispatch(updateLayoutInfo(responsed))
        }
    };

    const responsive_chrts = async (updt_data) => {

        if (updt_data?.length > 0) {
            let clone_lay = [...layout]
            await updt_data.map(async (chrt, index) => {
                const itemId = chrt.i;
                let width = 0;
                let height = 0;
                const targetElement = await document.getElementById(itemId);
                if (targetElement) {
                    const style = targetElement.style;
                    width = await parseFloat(style.width) - 10; 
                    height = targetElement.offsetHeight;
                    clone_lay[index] = {
                        ...chrt,
                        containerWidth: width,
                        containerHeight: height,
                        resized: true
                    };
                }
            })
            return clone_lay
        }
    }

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


    useEffect(() => {
        if (layout?.length > 0 && saveData) {
            const layoutInfo = [...layout]
            layoutInfo.map((ele, indx) => {
                if (ele.data !== undefined) {
                    mathOperation(ele, "1")
                }
            })
           dispatch(updateLayoutData(layoutInfo, requestInfo));
        }
    }, [layout])

    const handleIconDragStart = (e, iconSrc, name) => {
        e.dataTransfer.setData('text/plain', iconSrc);
        seticonData(iconSrc)
        seticonName(name)
    };


    const handleDragOver = (e, item) => {
        e.preventDefault();
        settargetBlock(item);
    };


    const handleDrop = async (e, item) => {
        let updatedLayout = [...layout]
        e.preventDefault();
        const itemIndex = layout.findIndex((layoutItem) => layoutItem.i === item.i);
        if (itemIndex !== -1) {
            const itemId = layout[itemIndex].i;
            let width = 0;
            let height = 0;
            const targetElement = document.getElementById(itemId);
            if (targetElement) {
                const style = targetElement.style;
                width = parseFloat(style.width) - 10; 
                height = targetElement.offsetHeight; 
            }

            if (iconData && targetBlock === item) {
                const layoutItem = updatedLayout[itemIndex];
                if (layoutItem.type !== 'text') {
                    if (layoutItem.imgSrc === undefined) {
                        if (iconName === 'rectangle_card') {
                            updatedLayout[itemIndex] = {
                                ...layoutItem,
                                name: iconName,
                                card_name: iconName,
                                text: 'Labels',
                                count: '900',
                                h: 2,
                                minH: 2,
                                maxH: 2
                            };
                        }
                        else if (iconName === 'table') {
                            updatedLayout[itemIndex] = {
                                ...layoutItem,
                                name: iconName,
                                Table: true,
                                containerWidth: width,
                                containerHeight: height,
                            };
                        }
                        else {
                            updatedLayout[itemIndex] = {
                                ...layoutItem,
                                imgSrc: iconName,
                                name: iconName,
                                chart_name: iconName,
                                containerWidth: width,
                                containerHeight: height,

                            };
                        }
                    } else {
                        var confirmation = await showAlert(layoutItem, iconData, iconName, width, height, updatedLayout, itemIndex);
                    }
                }
                else {
                    Swal.fire({
                        title: 'Alert!',
                        text: 'Not Allowed for Headers',
                        icon: 'info',
                        confirmButtonText: 'OK',
                    });
                }
            }
            else if (item.name === undefined || item.imgSrc === undefined) {
                const layoutItem = updatedLayout[itemIndex];
                updatedLayout[itemIndex] = {
                    ...layoutItem,
                    name: iconName,
                    chart_name: "slicer",
                    containerWidth: width,
                    containerHeight: height,
                }
            }
            var updated_chart_data = updatedLayout.find((data) => item.i === data.i)
            if (updated_chart_data !== undefined) {
                updateChartData(updated_chart_data)
            }
            onLayoutChange(updatedLayout)
        }
        dispatch(updateLayoutInfo(updatedLayout));
    };

    const adjustBlocksToTotalWidth = (blocks) => {
        // Ensure each block meets the minimum width requirement
        const adjustedBlocks = blocks.map(block => ({
            ...block,
            w: Math.max(block.w, 3) // Ensure each block has at least width of 3
        }));

        // Ensure the first block has a width of 4
        adjustedBlocks[0].w = Math.min(adjustedBlocks[0].w, 4);

        // Calculate the total current width
        const totalCurrentWidth = adjustedBlocks.reduce((acc, block) => acc + block.w, 0);

        // If total width is already 12 or less, return the adjusted blocks
        if (totalCurrentWidth <= 12) {
            return adjustedBlocks;
        }

        // Calculate how much width needs to be distributed evenly among remaining blocks
        const excess = totalCurrentWidth - 12;
        const numRemainingBlocks = adjustedBlocks.length - 1;
        const reducePerBlock = Math.floor(excess / numRemainingBlocks);
        var remainder = excess % numRemainingBlocks;

        // Adjust widths of remaining blocks evenly
        for (let i = 1; i < adjustedBlocks.length; i++) {
            const newWidth = adjustedBlocks[i].w - reducePerBlock - (remainder > 0 ? 1 : 0);
            adjustedBlocks[i].w = Math.max(newWidth, 3); // Ensure each block has at least width of 3
            remainder--;
        }
        return adjustedBlocks;
    };

   
    const onLayoutChange = async (layout) => {
        dispatch(updateLayoutInfo(layout));
    }

    const onDragStop = async (layoutInfo, oldItem, newItem, from_rsz_func, swaped) => {
        layout.map((data, idx) => {
            layoutInfo.map((ele, pos) => {
                if (data.i == ele.i) {
                    const { x, y, ...rest } = layout[idx]
                    layoutInfo[pos] = {
                        ...layoutInfo[pos], // Retain any existing properties in layoutInfo[pos]
                        y: layoutInfo[pos].y,
                        x: layoutInfo[pos].x,
                        ...rest
                    }
                }
            })
        })


        var modified = []
        if (standardLayout) {
            var modified_layout = await layoutInfo?.map((lay_data, lay_indx) => {
                const new_data = layoutInfo.find(item => item.i === lay_data.i);
                if (new_data) {
                    return { ...lay_data, x: new_data.x, y: new_data.y, h: new_data.h, w: new_data.w };
                } else {
                    return { ...lay_data };
                }
            });
            modified = modified_layout
        }
        else {
            const targetRow_new = layoutInfo.filter((item) => item.y === newItem.y);
            const totalWidth_new = targetRow_new.reduce((total, item) => total + item.w, 0);
            const availableSpace_new = 12 - totalWidth_new;
            let adjustedLayout = []
            let updatedLayout = []
            if (availableSpace_new > newItem.w) {
                adjustedLayout = layoutInfo.map((item) => {
                    if (item.type !== 'text') {
                        if (item.i === newItem.i) {
                            return {
                                ...newItem, w: availableSpace_new + item.w, imgSrc: item.imgSrc, name: item.name, chart_name: item.name, containerHeight: item.containerHeight,
                                containerWidth: item.containerWidth, data: item?.data !== undefined ? item.data : undefined,
                                chart_customize_clr: item?.chart_customize_clr !== undefined ? item.chart_customize_clr : undefined,
                                selected_cln_name: item?.selected_cln_name !== undefined ? item.selected_cln_name : undefined,
                                selected_primary_key: item?.selected_primary_key !== undefined ? item.selected_primary_key : undefined,
                                selected_primary_value: item?.selected_primary_value !== undefined ? item.selected_primary_value : undefined,
                                x_axis_key: item?.x_axis_key !== undefined ? item.x_axis_key : undefined,
                                y_axis_key: item?.y_axis_key !== undefined ? item.y_axis_key : undefined,
                                text: item?.text !== undefined ? item.text : 'lab',
                                count: item?.count !== undefined ? item.count : '800',
                                h: item?.h !== undefined ? item.h : 2,
                                minH: item?.minH !== undefined ? item.minH : 2,
                                maxH: item?.maxH !== undefined ? item.maxH : 2,
                            };
                        } else {
                            return item;
                        }
                    }
                    else {
                        if (item.i === newItem.i) {
                            return {
                                ...newItem, type: item.type
                            };
                        } else {
                            return item;
                        }
                    }
                });
                dispatch(updateLayoutInfo(adjustedLayout));
            } else {
                adjustedLayout = layoutInfo.map((item) => {
                    if (item.i === newItem.i) {
                        return {
                            ...newItem, w: availableSpace_new + item.w, x: item.x, y: item.y, imgSrc: item.imgSrc, name: item.name, chart_name: item.chart_name, containerHeight: item.containerHeight,
                            containerWidth: item.containerWidth, type: item.type, value: item.value, fontsize: item.fontsize, h: item.h, text: item.text, data: item?.data !== undefined ? item.data : undefined, chart_customize_clr: item?.chart_customize_clr !== undefined ? item.chart_customize_clr : undefined,
                            selected_cln_name: item?.selected_cln_name !== undefined ? item.selected_cln_name : undefined,
                            selected_primary_key: item?.selected_primary_key !== undefined ? item.selected_primary_key : undefined,
                            selected_primary_value: item?.selected_primary_value !== undefined ? item.selected_primary_value : undefined,
                            x_axis_key: item?.x_axis_key !== undefined ? item.x_axis_key : undefined,
                            y_axis_key: item?.y_axis_key !== undefined ? item.y_axis_key : undefined,
                            show_table: item?.show_table !== undefined ? item.show_table : undefined,
                            chart_height: item?.chart_height !== undefined ? item.chart_height : '',
                            minH: item?.minH !== undefined ? item.minH : '',
                            text: item?.text !== undefined ? item.text : 'lab',
                            count: item?.count !== undefined ? item.count : '800',
                        };
                    } else {
                        return item;
                    }
                });
                dispatch(updateLayoutInfo(adjustedLayout));
            }
            modified = await rearrange(layoutInfo, oldItem, newItem, adjustedLayout, updatedLayout, from_rsz_func)
            const groupedByY = modified.reduce((groups, item) => {
                const group = groups[item.y] || [];
                return { ...groups, [item.y]: [...group, item] };
            }, {});
            const maxHeightByY = Object.keys(groupedByY).reduce((maxHeights, y) => {
                const maxH = Math.max(...groupedByY[y].map(item => item.h));
                return { ...maxHeights, [y]: maxH };
            }, {});
            const updatedData = modified.map(item => ({
                ...item,
                h: maxHeightByY[item.y],
            }));
            modified = updatedData
        }
        dispatch(updateLayoutInfo(modified));
        onLayoutChange(modified)
        dispatch(updateLayoutData(modified, requestInfo));
        return modified
    }

    const rearrange = async (layout, oldItem, newItem, adjustedLayout, updatedLayout, from_rsz_func) => {
        adjustedLayout.map((adjusted_data, adj_indx) => {
            if (adjusted_data.type === 'text') {
            }
            else {
                return { adjusted_data }
            }
        })
        let filteredLayout_no_headers = adjustedLayout.filter(item => item.type !== 'text');
        let filteredLayout_with_headers = adjustedLayout.filter(item => item.type === 'text');
        var updatedLayout_mod
        var updatedLayout1
        if (filteredLayout_with_headers.length > 0) {
            adjustedLayout = filteredLayout_no_headers
            const rowYValues = [...new Set(adjustedLayout.map((item) => item.y))];
            const rows = {};
            adjustedLayout.forEach((item) => {
                if (!rows[item.y]) {
                    rows[item.y] = [];
                }
                rows[item.y].push(item);
            });

            for (const yValue of rowYValues) {
                const itemsInRow = rows[yValue];
                const totalWidthInRow = itemsInRow.reduce((total, item) => total + item.w, 0);
                let currentX = 0;
                const remainingWidth = 12 - totalWidthInRow;
                const additionalWidthPerItem = Math.floor(remainingWidth / itemsInRow.length);
                const remainder = remainingWidth % itemsInRow.length;

                itemsInRow.forEach((item, index) => {
                    item.w += additionalWidthPerItem;
                    if (index < remainder) {
                        item.w += 1;
                    }
                    item.x = currentX;
                    currentX += item.w;
                });
            }
            updatedLayout1 = Object.values(rows).flat();
            const itemsInSameRow = updatedLayout1.filter((item) => item.y === newItem.y);
            const newHeight = (12 / newItem.w) * newItem.h;
            var heightForOtherItems = Math.round(newHeight / itemsInSameRow.length);
            if (itemsInSameRow.length === 1 && newHeight > 5) {
                heightForOtherItems = 2
            }
            updatedLayout_mod = updatedLayout1.map((item) => {
                if (itemsInSameRow.some((rowItem) => rowItem.i === item.i)) {
                    return { ...item, h: heightForOtherItems };
                }
                return item;
            });
            const insertIndex = 1;
            updatedLayout_mod.splice(insertIndex, 0, ...filteredLayout_with_headers);
        }
        else {
            const rowYValues = [...new Set(adjustedLayout.map((item) => item.y))];
            const rows = {};
            adjustedLayout.forEach((item) => {
                if (!rows[item.y]) {
                    rows[item.y] = [];
                }
                rows[item.y].push(item);
            });
            for (const yValue of rowYValues) {
                const itemsInRow = rows[yValue];
                const totalWidthInRow = itemsInRow.reduce((total, item) => total + item.w, 0);
                let currentX = 0;
                const remainingWidth = 12 - totalWidthInRow;
                const additionalWidthPerItem = Math.floor(remainingWidth / itemsInRow.length);
                const remainder = remainingWidth % itemsInRow.length;

                itemsInRow.forEach((item, index) => {
                    item.w += additionalWidthPerItem;
                    if (index < remainder) {
                        item.w += 1;
                    }
                    item.x = currentX;
                    currentX += item.w;
                });
            }
            updatedLayout1 = Object.values(rows).flat();
            const itemsInSameRow = updatedLayout1.filter((item) => item.y === newItem.y);
            if (itemsInSameRow.length > 1) {
                const newHeight = (12 / newItem.w) * newItem.h;
                var heightForOtherItems = Math.round(newHeight / itemsInSameRow.length);
                if (itemsInSameRow.length === 1) {
                    heightForOtherItems = 2
                }
                updatedLayout_mod = updatedLayout1.map((item) => {
                    if (itemsInSameRow.some((rowItem) => rowItem.i === item.i)) {
                        return { ...item, h: heightForOtherItems };
                    }
                    return item;
                });
            }
            else {
                updatedLayout_mod = updatedLayout1
            }
        }
        dispatch(updateLayoutInfo(updatedLayout_mod));
        onLayoutChange(updatedLayout_mod)
        if (isResizing && !standardLayout && from_rsz_func) {
            onResize(updatedLayout_mod, oldItem, newItem, false, updatedLayout1)
        }
        setisResizing(true)
        let targetElement = ''
        let mod_data = []
        if (updtData !== undefined) {
            await updtData.map(async (ele, idx) => {
                await updatedLayout_mod.map(async (item, pos) => {
                    if (ele.i === item.i) {
                        if (ele.imgSrc !== undefined && ele.imgSrc !== null) {
                            updatedLayout_mod[pos]["imgSrc"] = ele.imgSrc
                            updatedLayout_mod[pos]["name"] = ele.name
                            const itemId = ele.i;
                            let width = 0
                            let height = 0
                            let style = ''
                            targetElement = await document.getElementById(itemId);
                            if (targetElement) {
                                style = targetElement.style;
                                setSidePanelOpen(false)
                                style = targetElement.style;
                                width = parseFloat(style.width)
                                height = parseFloat(style.height); // Get the height
                            }
                            updatedLayout_mod[pos]["containerWidth"] = width
                            updatedLayout_mod[pos]["containerHeight"] = height
                        }
                        mod_data = updatedLayout_mod
                    }
                    else {
                        mod_data = updatedLayout_mod
                    }
                })
            })
        }
        else {
            mod_data = updatedLayout_mod
        }
        if (mod_data.length === 0) {
            mod_data = updatedLayout_mod
        }
        dispatch(updateLayoutInfo(mod_data));
        onLayoutChange(mod_data)
        return mod_data
    }


    const blockResized = async () => {

        const itemIndex = layout.findIndex((layoutItem) => layoutItem.i === newItem.i);
        const itemId = layout[itemIndex].i;
        let width = 0
        let height = 0
        const targetElement = await document.getElementById(itemId);
        if (targetElement) {
            const style = targetElement.style;
            width = await parseFloat(style.width);
            height = await parseFloat(style.height);
        }
        if (layout !== undefined) {
            layout.map((item, pos) => {
                if (ele.imgSrc !== undefined && ele.imgSrc !== null) {
                    layout[pos]["imgSrc"] = ele.imgSrc
                    layout[pos]["name"] = ele.name
                    layout[pos]["chart_name"] = ele.chart_name
                    layout[pos]["containerWidth"] = width
                    layout[pos]["containerHeight"] = height
                    layout[pos]["data"] = ele?.data !== undefined ? ele.data : undefined
                    layout[pos]["chart_customize_clr"] = ele?.chart_customize_clr !== undefined ? ele.chart_customize_clr : undefined
                    layout[pos]["selected_cln_name"] = ele?.selected_cln_name !== undefined ? ele.selected_cln_name : undefined
                    layout[pos]["selected_primary_key"] = ele?.selected_primary_key !== undefined ? ele.selected_primary_key : undefined
                    layout[pos]["selected_primary_value"] = ele?.selected_primary_value !== undefined ? ele.selected_primary_value : undefined
                    layout[pos]["x_axis_key"] = ele?.x_axis_key !== undefined ? ele.x_axis_key : undefined
                    layout[pos]["y_axis_key"] = ele?.y_axis_key !== undefined ? ele.y_axis_key : undefined
                    layout[pos]["show_table"] = ele?.show_table !== undefined ? ele.show_table : false
                    layout[pos]["chart_height"] = ele?.chart_height !== undefined ? ele.chart_height : ''
                    layout[pos]["minH"] = ele?.minH !== undefined ? ele.minH : ''
                }
                else if (ele.name === 'rectangle_card') {
                    layout[pos]["name"] = ele.name
                    layout[pos]["containerWidth"] = width
                    layout[pos]["containerHeight"] = height
                    layout[pos]["text"] = ele?.text !== undefined ? ele.text : ''
                    layout[pos]["count"] = ele?.count !== undefined ? ele.count : ''
                    layout[pos]["minH"] = ele?.minH !== undefined ? 2 : 2
                    layout[pos]["maxH"] = ele?.maxH !== undefined ? 2 : 2
                }
            })
        }
        return layout

    }


    const heightMatch = async () => {
        const itemsInSameRow = layout.filter((item) => item.y === newItem.y);
        const heightForOtherItems = newItem.h;
        const updatedLayout = layout.map((item) => {
            if (itemsInSameRow.some((rowItem) => rowItem.i === item.i)) {
                return { ...item, h: heightForOtherItems };
            }
            return item;
        });
        setisResizing(true);
        return updatedLayout
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

    const updatingFunc = async (updtData, updatedLayout1) => {
        const updatedData = await Promise.all(updtData.map(async (ele, idx) => {
            const data_modified = Promise.all(await updatedLayout1.map(async (item, pos) => {
                if (ele.i === item.i) {
                    if (ele.imgSrc !== undefined && ele.imgSrc !== null) {
                        updatedLayout1[pos]["imgSrc"] = ele.imgSrc;
                        updatedLayout1[pos]["name"] = ele.name;
                        updatedLayout1[pos]["chart_name"] = ele.chart_name;
                        const itemId = ele.i;
                        var awaited_data = await styleFunc(itemId, updatedLayout1, pos)
                        updatedLayout1 = awaited_data
                        dispatch(updateLayoutInfo(updatedLayout1));
                    }
                } else {
                    return item;
                }
            }));
            return updatedLayout1;
        }));
        return updatedLayout1;
    }


    const rowWidthMatchFunc = async (layout, oldItem, newItem, updated_data, updatedLayout123) => {
        let updatedLayout1 = []
        const rowYValues = [...new Set(updatedLayout123.map((item) => item.y))];
        await rowYValues.forEach(async (yValue) => {
            const itemsInRow = updatedLayout123.filter((item) => item.y === yValue);
            const totalWidthInRow = itemsInRow.reduce((total, item) => total + item.w, 0);
            if (totalWidthInRow !== 12) {
                const array = itemsInRow
                const nameToFind = newItem.i;
                const index_arr = array.findIndex(item => item.i === nameToFind);
                if (index_arr !== -1) {
                    const currentIndex = index_arr;
                    const nextIndex = currentIndex + 1;
                    var targetRow_new = array.filter((item) => item.y === newItem.y);
                    const totalWidth_new = targetRow_new.reduce((total, item) => total + item.w, 0);
                    const availableSpace_new = 12 - totalWidth_new;
                    if (nextIndex < array.length) {
                        itemsInRow[nextIndex].w = added_width
                        let cumulativeX = 0;
                        for (let i = 0; i < itemsInRow.length; i++) {
                            itemsInRow[i].x = cumulativeX;
                            cumulativeX += itemsInRow[i].w;
                        }
                    }
                    else {
                        var item_data = itemsInRow[nextIndex - 1]
                        var added_width = item_data.w + availableSpace_new
                        item_data.w = added_width
                        itemsInRow.forEach((item, index) => {
                            if (array[index].i === itemsInRow[nextIndex - 1].i) {
                            }
                        })
                    }
                    itemsInRow.forEach((item, index) => {
                        const updatedItem = { ...item, w: item.w };
                        updatedLayout1.push(updatedItem);
                    })
                }
                else {
                    var targetRow_new = itemsInRow;
                    const availableSpace_new = 12 - totalWidthInRow;
                    var added_width = itemsInRow[0].w + availableSpace_new
                    itemsInRow[0].w = added_width
                    let cumulativeX = 0;
                    for (let i = 0; i < itemsInRow.length; i++) {
                        itemsInRow[i].x = cumulativeX;
                        cumulativeX += itemsInRow[i].w;
                    }
                    var width = 0;
                    var height = 0;
                    const targetElement = await document.getElementById(itemsInRow[0].i);
                    if (targetElement) {
                        const style = targetElement.style;
                        width = await parseFloat(style.width);
                        height = await parseFloat(style.height);
                        itemsInRow[0]["containerWidth"] = width;
                        itemsInRow[0]["containerHeight"] = height;
                    }
                    itemsInRow.forEach((item, index) => {
                        const updatedItem = { ...item, w: item.w };
                        updatedLayout1.push(updatedItem);
                    })
                }
            } else {
                updatedLayout1.push(...itemsInRow);
            }
        });
        return updatedLayout1
    }

    const onResize = async (layout, oldItem, newItem, from_rsz_func_retrn, final) => {
        setSidePanelOpen(false)
        if (standardLayout) {
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
            if (layout !== undefined) {
                for (const ele of cloned_lay) {
                    const modifiedItems = await Promise.all(updatedLayout1.map(async (item) => {
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
                dispatch(updateLayoutInfo(updatedLayout1));
                dispatch(updateLayoutData(updatedLayout1, requestInfo));
            }
        }
        else {
            var layout = await blockResized(layout, oldItem, newItem)
            var updatedLayout = await heightMatch(layout, oldItem, newItem)
            if (updtData !== undefined) {
                var updated_data = await updatingFunc(updtData, updatedLayout)
                setisResizing(false)
                let from_rsz_func = ((from_rsz_func_retrn === undefined || from_rsz_func_retrn === null) ? true : from_rsz_func_retrn)
                var row_width_match = await rowWidthMatchFunc(layout, oldItem, newItem, updtData, updatedLayout)
                setupdtData(row_width_match)
                setlayout(row_width_match)
                dispatch(updateLayoutInfo(row_width_match));
                onLayoutChange(row_width_match)
                return
            }
            row_width_match = await rowWidthMatchFunc(layout, oldItem, newItem, updtData, updatedLayout)
            setupdtData(updatedLayout !== undefined ? updatedLayout : updtData)
            setlayout(updatedLayout !== undefined ? updatedLayout : updtData)
            dispatch(updateLayoutInfo(updatedLayout !== undefined ? updatedLayout : updtData));
            await onLayoutChange(updatedLayout !== undefined ? updatedLayout : updtData)
            dispatch(updateLayoutData(updatedLayout !== undefined ? updatedLayout : updtData, requestInfo));
        }
    }

    const showAlert = async (layoutItem, iconData, iconName, width, height, updatedLayout, index) => {
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
                    };
                }
                dispatch(updateLayoutInfo(updatedLayout));
                dispatch(updateLayoutData(updatedLayout, requestInfo));
                await onLayoutChange(updatedLayout)
                Swal.fire('Success', 'Chart modified successfully!', 'success');
            } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Chart modification cancelled.', 'error');
            }
        });
    };



    const delBlock = async (e, item1, indx) => {
        let arr = [...layout]
        var targetRow_new = arr.filter((item) => item.y === item1.y);
        arr.splice(indx, 1);
        targetRow_new = arr.filter((item) => item.y === item1.y);
        var mod_lay
        if (targetRow_new.length > 0) {
            mod_lay = await Promise.all(arr.map(async (item, idx) => {
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
                            dispatch(updateLayoutInfo(arr));
                            dispatch(updateLayoutData(arr, requestInfo));
                        }, 100);
                    }
                }
                return arr_item;
            }));
        }
        dispatch(updateLayoutInfo(arr !== undefined ? arr : []));
        dispatch(updateLayoutData(arr !== undefined ? arr : [], requestInfo));
        dispatch(selectGlobalXaxis(reportSlice.selectedFilterList))
    }

    const updtTxtLayout = async (e, item, indx) => {
        var updt_layout = layout.map((layout, index) => {
            if (index === indx) {
                return { ...layout, value: e.target.value };
            }
            return layout;
        });
        dispatch(updateLayoutInfo(updt_layout));
        dispatch(updateLayoutData(updt_layout, requestInfo));
    };

    const onlayoutClick = (item, index1, layout) => {
        if (item.name !== undefined) {
            setSidePanelOpen(!isSidePanelOpen)
            setSidepanelData(item)
            sessionStorage.setItem('blockdata', JSON.stringify(item));
            sessionStorage.setItem('blockIdx', JSON.stringify(index1));
        }
    }

    const updateLayout = async (layout, rerender) => {
        dispatch(updateLayoutData(layout, requestInfo));
        if (rerender) {
            dispatch(updateLayoutData(layout, requestInfo));
            onLayoutChange(layout)
        }
    }

    async function showTableFunc(e, item, indx, lay) {
        let tempLayout = layout.map(obj => ({ ...obj }));
        let show_table = layout[indx]["show_table"]
        if (show_table === false || show_table === undefined) {
            tempLayout[indx] = { ...tempLayout[indx] }; // Create a shallow copy of the object at tempLayout[indx]
            tempLayout[indx]["h"] = layout[indx]["h"] + 2;
            tempLayout[indx]["chart_height"] = layout[indx]["containerHeight"] + 200;
            tempLayout[indx]["minH"] = tempLayout[indx]["h"]
            tempLayout[indx]["show_table"] = true;
            tempLayout[indx]["containerHeight"] = layout[indx]["containerHeight"] + 200;
        }

        if (show_table === true) {
            tempLayout[indx] = { ...tempLayout[indx] }; // Create a shallow copy of the object at tempLayout[indx]
            tempLayout[indx]["containerHeight"] = layout[indx]["containerHeight"] - 200;
            tempLayout[indx]["minH"] = '';
            tempLayout[indx]["h"] = (layout[indx]["h"]) - 2;
            tempLayout[indx]["show_table"] = undefined;
            tempLayout[indx]["chart_height"] = '';
        }

        var rersized = await tableRezided(layout, item, tempLayout[indx], tempLayout)
        dispatch(updateLayoutInfo(rersized !== undefined ? rersized : updtData));
        dispatch(updateLayoutData(rersized !== undefined ? rersized : updtData, requestInfo));
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
            await Promise.all(tempArr.map(async (ele, idx) => {
                layout.forEach((item, pos) => {
                    if (ele.i === item.i) {
                        const updatedItem = { ...item };
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
                        updatedLayout[pos] = updatedItem;
                    }
                });
            }));
            return updatedLayout;
        }
        return layout;
    };

    const handleToggleFullScreen = async (item, obj, lay, indx) => {
        const chartElement = document.getElementById(`${item}`);
        if (chartElement) {
            if (!isFullScreen) {
                const lay1 = { ...layout[indx] };
                lay1.temp_containerWidth = fullscreenSize.width;
                lay1.temp_containerHeight = fullscreenSize.height + 150;
                lay1.fullScreen_enabled = true;
                var updateLayout = [...layout]
                updateLayout[indx] = lay1
                dispatch(updateLayoutInfo(updateLayout))
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
    };

    const createArrowIcon = (className, direction, onClick, isDisabled = false) => {
        const arrowIcon = document.createElement("i");
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
            arrowIcon.addEventListener("click", onClick);
        }
        return arrowIcon;
    };

    const hasNextChart = (item) => {
        const itemIndex = layout.findIndex((layoutItem) => layoutItem.i === item);
        return itemIndex < layout.length - 1;
    };

    const hasPreviousChart = (item) => {
        const itemIndex = layout.findIndex((layoutItem) => layoutItem.i === item);
        return itemIndex > 0;
    };

    const handleNextChart = async (item, idx, lay) => {
        setIsFullScreen(true);
        let nextIndex = idx + 1;
        while (nextIndex < layout.length) {
            const nextChart = layout[nextIndex];
            if (nextChart && nextChart.chart_name) {
                await handleToggleFullScreen(nextChart.i, '', lay, nextIndex);
                return;
            } else {
                nextIndex++;
            }
        }
    };

    const handlePreviousChart = async (item, indx, lay) => {
        let previousIndex = indx - 1;
        while (previousIndex >= 0) {
            const previousChart = layout[previousIndex];
            if (previousChart && previousChart.chart_name) {
                await handleToggleFullScreen(previousChart.i, '', lay, previousIndex);
                return;
            } else {
                previousIndex--;
            }
        }
    };

    const getStyle = (item, val) => {
        if (val === '1') {
            const style = { fontSize: `${item.label_fontsize ? item.label_fontsize : 14}px`, color: `${item.label_fontColor ? item.label_fontColor : 'black'}`, };
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
            updatedLayout.map((data, FullScr_index) => {
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
                    fullScreen_enabled: false
                };
                const parentElement = document.getElementById(data.i);
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
            })
            dispatch(updateLayoutInfo(updatedLayout))
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
        if (name === 'Stack') {
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
        dispatch(updateLayoutInfo(clone_lay))
        dispatch(updateLayoutData(clone_lay))
    }

    const resetedData = async () => {
        try {
            dispatch(updateLayoutInfo([]));
            dispatch(updateLayoutData([], requestInfo));
        } catch (error) {
            console.log('error :>> ', error);
        }
    }

    const calculateOperation = (data, mode,name) => {
        if (mode === "1") {
            return d3.rollup(data, v => d3.sum(v, d => d.value), d => d.year);
        }
        if (mode === "2") {
            const avg = d3.mean(data, d => d.value);
            var average = data.map(d => ({ ...d, value: avg }));
            return average

        }
        if (mode === "3") {
            return d3.rollup(data, v => d3.min(v, d => d.value), d => d.year);
        }
        // if (mode === "4") {
        //     return d3.rollup(data, v => d3.max(v, d => d.value), d => d.year);
        // }

               if (mode === "4") {

            if (name === 'pie_chart') {
                let arr = []
                const maxValue = d3.max(data, d => d.percentage);
                const maxData = data.find(d => d.percentage === maxValue);
                arr.push(maxData)
                return arr
            } else {
                return d3.rollup(data, v => d3.max(v, d => d.value), d => d.year);
            }

        }
        if (mode === "5") {
            return d3.rollup(data, v => v.length, d => d.year);
        }
        if (mode === "6") {
            return d3.rollup(data, v => d3.deviation(v, d => d.value), d => d.year);
        }
        if (mode === "7") {
            return d3.rollup(data, v => d3.variance(v, d => d.value), d => d.year);
        }
        if (mode === "8") {
            return d3.rollup(data, v => d3.median(v, d => d.value), d => d.year);
        }



    }


    const mathOperation = (item, value,) => {
        var itemInfo = { ...item };
        var getIdx = _.findIndex(layout, { i: itemInfo.i });
        var updateLayoutInfoData = [...layout];
        if (getIdx !== -1) {
            const operationResult = calculateOperation(itemInfo.data, value,item.name);
            let groupedData;

            if (value === "1" || value === "5" || value === "3" || value === "6" || value === "7" || value == "8") {
                groupedData = Array.from(operationResult, ([year, value]) => ({ year, value }));
            } else if (value === "2" || value === "4" ) {
                groupedData = operationResult;
            }

            updateLayoutInfoData[getIdx] = {
                ...updateLayoutInfoData[getIdx],
                filtered_data: groupedData,
                selected_operation: Number(value)
            };
            dispatch(updateLayoutInfo(updateLayoutInfoData));
            dispatch(setSaveData(false));
        }
    }


    const previewEnable = async () => {
        setprvpage(!prvpage)
        sessionStorage.setItem('layout_preview', !prvpage);
        history.push("/preview_page")
    }


    const getXaxisValue = async () => {
        const pageNodeInfo = JSON.parse(sessionStorage.getItem("pageNodeInfo"))

        var response = await dispatch(retriveClnKeys(pageNodeInfo.selected_cln_name[0]))
        if (response.status === 200) {
            if (response.data.data.length > 0) {
                dispatch(setXaxisFilterValue(response.data.data))
            }
        }
    
    }

    return (
        <React.Fragment>
            <div style={{}}>
                {loading && <LoadingOverlay />}
            </div>

            {dataLoaded && <div className="page-content" >
                <Container fluid style={{ paddingTop: "16px", paddingRight: "7px" }}>
                   
                    <Row style={{ width: "100%" }} >
                        <Col md={4} lg={2} style={{}} >


                            <div className="d-flex bg-white" style={{ justifyContent: 'space-evenly', height: '100vh' }}>
                                <div>
                                    <ul className="metismenu list-unstyled" id="side-menu">
                                        <li className="h-100 p-2 px-0" >
                                            <div className="custom-grid" style={{ textAlign: 'center', color: selectMenu === '1' ? '#556ee6' : '', padding: '10px', cursor: 'pointer' }}
                                                onClick={() => { setGrid(!grid); setcharts(false); setSelectMenu('1') }}>
                                                <span className="bx bx-grid">
                                                    <div style={{ fontSize: '13px', fontFamily: "poppins, sans-serif" }}>Grid</div>
                                                </span>
                                            </div>
                                            <br />
                                            <div className="custom-grid" style={{ textAlign: 'center', color: selectMenu === '2' ? '#556ee6' : '', padding: '10px', cursor: 'pointer' }}
                                                onClick={() => {
                                                    setText(!Text); setGrid(false);
                                                    setSelectMenu('2')
                                                }}>
                                                <span className="bx bx-text">
                                                    <div style={{ fontSize: '13px', fontFamily: "poppins, sans-serif" }}>Text</div>
                                                </span>
                                            </div>
                                            <br />
                                            <div className="custom-grid" style={{ textAlign: 'center', color: selectMenu === '3' ? '#556ee6' : '', padding: '10px', cursor: 'pointer' }}
                                                onClick={() => { setcharts(!charts); setGrid(false); setSelectMenu('3') }}>
                                                <span className="bx bx-bar-chart-square">
                                                    <i className="waves-effect">
                                                    </i>
                                                    <div style={{ fontSize: '13px', fontFamily: "poppins, sans-serif" }}>Charts</div>
                                                </span>
                                            </div>
                                            <br />
                                            <div className="custom-grid" style={{ textAlign: 'center', color: selectMenu === '4' ? '#556ee6' : '', padding: '10px', cursor: 'pointer' }}
                                                onClick={() => { setcharts(!charts); setGrid(!false); setSelectMenu('4') }}>
                                                <span className="bx bx-rectangle">
                                                    <i className="waves-effect">
                                                    </i>
                                                    <div style={{ fontSize: '13px', fontFamily: "poppins, sans-serif" }}>Cards</div>
                                                </span>
                                            </div>
                                            <br />
                                            <div className="custom-grid" style={{ textAlign: 'center', color: selectMenu === '5' ? '#556ee6' : '', padding: '10px', cursor: 'pointer' }}
                                                onClick={() => {
                                                    //  setcharts(!charts);
                                                    //   setGrid(!false);
                                                    getXaxisValue();
                                                    setSelectMenu('5')
                                                }}>
                                                <span className="fas fa-filter">
                                                    <i className="waves-effect">
                                                    </i>
                                                    <div style={{ fontSize: '13px', fontFamily: "poppins, sans-serif" }}>Filter</div>
                                                </span>
                                            </div>

                                        </li>
                                    </ul>
                                </div>
                                <div >
                                    {
                                        selectMenu === '1' ?
                                            <div className="p-2" style={{}}>
                                                <div id="" className="mt-2" style={{
                                                    display: "flex",
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    paddingTop: "35px",
                                                    rowGap: "2rem",
                                                    columnGap: "1rem",
                                                    overflow: 'none',
                                                    overflowY: 'none',
                                                    overflowX: 'none'
                                                }}>

                                                    <div>
                                                        <div style={{ cursor: 'pointer' }} >
                                                            <img src={one_row} draggable onClick={() => dispatch(createLayout('1'))} />
                                                        </div>
                                                        <div style={{ cursor: 'pointer' }}>
                                                            <img src={two_col} draggable onClick={() => dispatch(createLayout('2'))} />
                                                        </div>
                                                    </div>

                                                    <div >
                                                        <div style={{ cursor: 'pointer' }}>
                                                            <img src={three_col} draggable onClick={() => dispatch(createLayout('3'))} />
                                                        </div>
                                                        <div style={{ cursor: 'pointer' }} >
                                                            <img src={four_col} draggable onClick={() => dispatch(createLayout('4'))} />
                                                        </div>
                                                    </div>

                                                    <div >
                                                        <div style={{ cursor: 'pointer' }} >
                                                            <img src={five_col} draggable onClick={() => dispatch(createLayout('5'))} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            selectMenu === '2' ?
                                                <div className="p-2" style={{
                                                    display: "flex",
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    paddingTop: "35px",
                                                    rowGap: "2rem",
                                                    columnGap: "1rem",
                                                    overflow: 'none',
                                                    overflowY: 'none',
                                                    overflowX: 'none'
                                                }}>

                                                    <div className="ps-2" style={{ marginTop: '42px' }} >
                                                        <Row>
                                                            <Col md={6} style={{ cursor: 'pointer', width: "100%" }}>
                                                                <h2 onClick={() => text_block("1")}> HEADER 1</h2>
                                                            </Col>
                                                        </Row>
                                                        <br />
                                                        <Row >
                                                            <Col md={6} style={{ cursor: 'pointer', width: "100%" }}>
                                                                <h3 onClick={() => text_block("2")}> HEADER 2</h3>
                                                            </Col>
                                                        </Row>
                                                        <br />
                                                        <Row >
                                                            <Col md={6} style={{ cursor: 'pointer', width: "100%", display: "flex" }}>
                                                                <h4 onClick={() => text_block("3")} > HEADER 3</h4>
                                                            </Col>
                                                        </Row>
                                                        <br />
                                                        <Row >
                                                            <Col md={6} style={{ cursor: 'pointer', width: "100%", display: "flex" }}>
                                                                <h5 onClick={() => text_block("4")}> HEADER 4</h5>
                                                            </Col>
                                                        </Row>

                                                    </div>
                                                </div>
                                                :
                                                selectMenu === '3' ?
                                                    <div className="p-2" style={{ backgroundColor: 'white', height: '100vh' }} >

                                                        <div className="mt-0" style={{
                                                            display: "flex",
                                                            justifyContent: 'space-evenly',
                                                            flexWrap: "wrap",
                                                            paddingTop: "35px",
                                                            rowGap: "1rem",
                                                            columnGap: "1rem",
                                                        }}>
                                                            <div>
                                                                <div style={{ cursor: 'pointer' }}>
                                                                    <img src={barChart} draggable onDragStart={(e) => handleIconDragStart(e, barChart, "bar_charts")} />
                                                                </div>
                                                                <div style={{ cursor: 'pointer' }} className="items mt-2">
                                                                    <img src={areaChart} draggable onDragStart={(e) => handleIconDragStart(e, areaChart, "area_chart")} />
                                                                </div>
                                                            </div>


                                                            <div>
                                                                <div style={{ cursor: 'pointer' }} className="items">
                                                                    <img src={stackChart} draggable onDragStart={(e) => handleIconDragStart(e, stackChart, "stack_bar")} />
                                                                </div>
                                                                <div style={{ cursor: 'pointer' }} className="items mt-3 ms-2">
                                                                    <img src={pieChart} draggable onDragStart={(e) => handleIconDragStart(e, pieChart, "pie_chart")} />
                                                                </div>
                                                            </div>


                                                            <div>
                                                                <div style={{ cursor: 'pointer' }} className="items">
                                                                    <img src={lineChart} draggable onDragStart={(e) => handleIconDragStart(e, lineChart, "line_chart")} />
                                                                </div>
                                                                <br />
                                                                <div style={{ cursor: 'pointer' }} >
                                                                    <img src={hor_barChart} height={60} width={90} draggable onDragStart={(e) => handleIconDragStart(e, hor_barChart, "hor_barcharts")} />
                                                                </div>
                                                            </div>


                                                            <div>

                                                                <div style={{ cursor: 'pointer' }} className="">
                                                                    <img src={hor_stackChart} height={66} width={94} draggable onDragStart={(e) => handleIconDragStart(e, hor_stackChart, "hor_stack")} />
                                                                </div>
                                                                <div style={{ cursor: 'pointer' }} className="">
                                                                    <span>
                                                                        <i style={{ fontSize: '70px', color: '#2d93ea' }} className="bx bx-table" draggable onDragStart={(e) => handleIconDragStart(e, 'table', "table")} >
                                                                        </i>
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <div style={{ cursor: 'pointer' }} className="">
                                                                    <img src={vertical} height={66} width={94} draggable onDragStart={(e) => handleIconDragStart(e, 'Vertical_linechart', "Vertical_linechart")} />
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    :
                                                    selectMenu === '4' ?
                                                        <div className="p-2" style={{ backgroundColor: 'white', height: '100vh' }}>
                                                            <div className="mt-0" style={{
                                                                display: "flex",
                                                                justifyContent: 'space-evenly',
                                                                flexWrap: "wrap",
                                                                paddingTop: "35px",
                                                                rowGap: "1rem",
                                                                columnGap: "1rem",
                                                            }}>
                                                                <div>
                                                                    <div style={{ cursor: 'pointer', mixBlendMode: 'hard-light' }}>
                                                                        <img height={80} src={rectangle} draggable onDragStart={(e) => handleIconDragStart(e, rectangle, "rectangle_card")} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :
                                                        selectMenu === '5' ?
                                                            <div className="p-2" style={{ backgroundColor: 'white', height: '100vh' }}>
                                                                <div className="mt-0" style={{
                                                                    display: "flex",
                                                                    justifyContent: 'space-evenly',
                                                                    flexWrap: "wrap",
                                                                    paddingTop: "35px",
                                                                    rowGap: "1rem",
                                                                    columnGap: "1rem",
                                                                }}>
                                                                    <div>
                                                                        <ul>
                                                                            {
                                                                                reportSlice.filterXaxisValue.map((ele, idx) => {
                                                                                    return (
                                                                                        <li key={idx} onDragStart={(e) => handleIconDragStart(e, undefined, ele.name)} draggable>{ele.name}</li>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </ul>
                                                                        {/* <div style={{ cursor: 'pointer', mixBlendMode: 'hard-light' }}>
                                                                    <img height={80} src={rectangle} draggable onDragStart={(e) => handleIconDragStart(e, rectangle, "rectangle_card")} />
                                                                </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            :
                                                            null
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col md={8} lg={10} className="p-0 ps-2">
                            <Card style={{ border: '1px solid lightgrey', overflowX: 'scroll', height: '100%' }}>
                                <CardBody style={{ background: '#f7f7f7' }} >
                                    <Row className="d-flex" style={{}}>
                                        <Col className="mb-2 mb-md-0 ">
                                            <label style={{ fontFamily: "poppins,sans-serif" }}> {reportSlice.pageNodeInfo?.title}</label>
                                        </Col>
                                       
                                        <Col className="mb-2 mb-md-0 ">
                                            <div className="d-flex justify-content-end">
                                                <div className="me-2" >
                                                    <Button className="btn btn-sm btn-danger w-10"
                                                        style={{
                                                            cursor: 'pointer',
                                                            fontFamily: 'poppins,sans-serif bold',
                                                            color: 'white',
                                                        }}
                                                        onClick={() => {
                                                            resetedData()
                                                        }}> RESET</Button>
                                                </div>
                                                <div className="me-2">
                                                    <Button className="btn-sm" onClick={() => { previewEnable() }}>{prvpage ? "MAIN" : "PREVIEW"}</Button>
                                                </div>
                                                <div className="me-2">
                                                    <Button className="btn btn-sm btn-primary"
                                                        onClick={() => {
                                                            history.push("/page_tree")
                                                        }}> Back</Button>
                                                </div>
                                            </div>

                                        </Col>
                                    </Row>

                                    <Row id="my-specific-row" style={{ overflow: "auto" }} >
                                        <Col md={12} style={{}} >
                                            <div >
                                                {
                                                    isSidePanelOpen &&
                                                    <div>
                                                        <SidePanel
                                                            overlay={true} updateLayout={(data, rerender) => { updateLayout(data, rerender) }} layout={layout} dbCollections={dbCollections} isOpen={isSidePanelOpen} onClose={() => { setSidePanelOpen(false); }} data={sidepanelData}
                                                            db_data={requestInfo}
                                                            show_table_function={(val, item, index, layoutarr) => showTableFunc(val, item, index, layoutarr)} />
                                                    </div>
                                                }
                                            </div>

                                            {layout.length > 0 &&

                                                <ResponsiveGridLayout
                                                    className="layout pe-5"
                                                    layouts={{ lg: layout }}
                                                    breakpoints={{ lg: 1200, md: 700, sm: 768, xs: 480 }}
                                                    cols={{ lg: 12, md: 4, sm: 4, xs: 4 }}
                                                    rowHeight={100}
                                                    isResizable={true}
                                                    isDraggable={true}
                                                    onDragStop={onDragStop}
                                                    ref={layoutRef}
                                                    resizeHandles={isFullScreen ? [] : ['e', 's', 'se']}
                                                    onResizeStop={onResize}
                                                    width={"width-40px"}
                                                    draggableCancel=".grid-item-content"
                                                    draggableHandle=".drag-handle"
                                                    style={{
                                                        opacity: showSaveAnimation ? '25%' : '100%', padding: "10px", transition: 'box-shadow 0.1s', position: 'relative'
                                                    }}
                                                >
                                                    {
                                                        layout?.length > 0 && layout !== undefined ?
                                                            layout.map((item, index1) => (
                                                                <div key={item.i}
                                                                    style={{ cursor: 'default', border: '1px solid #e4e4e4', }}
                                                                    onDragOver={(e) => handleDragOver(e, item)}
                                                                    onDrop={(e) => handleDrop(e, item)}
                                                                    id={item.i}
                                                                    className="grid-item"
                                                                >
                                                                  

                                                                    <LayoutHeader
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
                                                                        sessionInfo={sessionInfo}
                                                                        mathOperation={mathOperation}
                                                                    />
                                                                    {
                                                                        item.name === 'bar_charts' ?
                                                                            <div id={`${'bar1' + item.i}`} style={{}}>
                                                                                <div  >
                                                                                    <BarChart
                                                                                        BarWidth={item.barWidth}
                                                                                        load={item.charts_loaded}
                                                                                        temp_containerWidth={item.temp_containerWidth}
                                                                                        temp_containerHeight={item.temp_containerHeight}
                                                                                        containerWidth={item.containerWidth}
                                                                                        containerHeight={item.containerHeight}
                                                                                        chart_height={item?.chart_height !== undefined ? item.chart_height : undefined}
                                                                                        chart_data={item?.data === undefined ? defaultBarChartValue : item.filtered_data === undefined ? item.data : item.filtered_data}
                                                                                        chart_color={item?.chart_customize_clr !== undefined ? item.chart_customize_clr : 'steelblue'}
                                                                                        id={item.i}
                                                                                        label={item?.x_axis_label !== undefined ? item.x_axis_label : 'label'}
                                                                                        YLabel={item?.y_axis_label !== undefined ? item.y_axis_label : 'Ylabel'}
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
                                                                                        itemInfo={item}
                                                                                    />
                                                                                </div>

                                                                            </div>
                                                                            :
                                                                            item.name === 'stack_bar' ? (
                                                                                <div id={`${'bar1' + item.i}`} >
                                                                                    <div style={{ position: 'absolute', }}>
                                                                                        <StackChart
                                                                                            BarWidth={item.barWidth}
                                                                                            temp_containerWidth={item.temp_containerWidth}
                                                                                            temp_containerHeight={item.temp_containerHeight}
                                                                                            containerWidth={item.containerWidth}
                                                                                            containerHeight={item.containerHeight}
                                                                                            chart_height={item?.chart_height !== undefined ? item.chart_height : ''}
                                                                                            chart_data={item?.data === undefined ? defaultStackChartValue : item.data}
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
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                                :
                                                                                item.name === 'area_chart' ?
                                                                                    (
                                                                                        <div id={`${'bar1' + item.i}`} >
                                                                                            <div style={{ position: 'relative' }}>
                                                                                                <AreaChart
                                                                                                    temp_containerWidth={item.temp_containerWidth}
                                                                                                    temp_containerHeight={item.temp_containerHeight}
                                                                                                    containerWidth={item.containerWidth}
                                                                                                    containerHeight={item.containerHeight}
                                                                                                    chart_data={item?.data === undefined ? defaultAreaChartValue : item.data}
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
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                    :
                                                                                    item.name === 'pie_chart' ?
                                                                                        (
                                                                                            <div id={`${'bar1' + item.i}`} style={{ boxShadow: 'none', border: 'none' }} >
                                                                                                <div style={{ boxShadow: 'none', border: 'none' }} >
                                                                                                    <PieChart
                                                                                                        temp_containerWidth={item.temp_containerWidth}
                                                                                                        temp_containerHeight={item.temp_containerHeight}
                                                                                                        containerWidth={item.containerWidth}
                                                                                                        containerHeight={item.containerHeight}
                                                                                                        chart_height={item?.chart_height !== undefined ? item.chart_height : undefined}
                                                                                                        // chart_data={item?.data === undefined ? defaultPieChartValue : item.data}
                                                                                        chart_data={item?.data === undefined ? defaultPieChartValue : item.filtered_data === undefined ? item.data : item.filtered_data}

                                                                                                        id={item.i}
                                                                                                        label={item?.x_axis_label !== undefined ? item.x_axis_label : 'label'}
                                                                                                        mouseovered={item?.mouseovered !== undefined ? item.mouseovered : false}
                                                                                                        show_table={item?.show_table !== undefined ? item.show_table : false}
                                                                                                        show_bar_values={item?.show_bar_values !== undefined ? item.show_bar_values : false}
                                                                                                        show_Full_Screen_toggle={item.fullScreen_enabled !== undefined ? item.fullScreen_enabled : false}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                        :
                                                                                        item.name === 'line_chart' ?
                                                                                            (
                                                                                                <div id={`${'bar1' + item.i}`} >
                                                                                                    <div style={{ position: 'relative' }}>
                                                                                                        <LineChart
                                                                                                            temp_containerWidth={item.temp_containerWidth}
                                                                                                            temp_containerHeight={item.temp_containerHeight}
                                                                                                            containerWidth={item.containerWidth}
                                                                                                            containerHeight={item.containerHeight}
                                                                                                            chart_height={item?.chart_height !== undefined ? item.chart_height : undefined}
                                                                                                            chart_data={item?.data === undefined ? defaultLineChartValue : item.data}
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
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            )
                                                                                            : item.name === "rectangle_card" ?
                                                                                                <Card style={{ height: '100%' }}>
                                                                                                    <CardBody >
                                                                                                        <div style={{ textAlign: 'right', border: 'none', boxShadow: 'none' }}>
                                                                                                            <i className="bx bx-edit-alt" style={{ cursor: 'pointer', color: '#6666b2', fontSize: '25px' }} onClick={(e) => { onlayoutClick(item, index1, layout); sessionStorage.setItem('blockdata', JSON.stringify(item)); sessionStorage.setItem('blockIdx', JSON.stringify(index1)) }}  ></i>
                                                                                                            <span>
                                                                                                                <i className="bx bx-x" onClick={(e) => delBlock(e, item, index1)} style={{ cursor: 'pointer', fontSize: '35px', width: "45px", zIndex: '0' }} ></i>
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        <br />
                                                                                                        <div className="d-flex" style={{ boxShadow: 'none' }}>
                                                                                                            <div className="flex-grow-1" style={{ boxShadow: 'none' }}>
                                                                                                                <p className=" " style={getStyle(item, '1')}>
                                                                                                                    {item.text}
                                                                                                                </p>
                                                                                                                <h4 className="mb-0" style={getStyle(item, '2')}>{(item.count !== null && item.count !== undefined) ? item.count : 'IN- VALID'}</h4>
                                                                                                            </div>
                                                                                                            <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                                                                                                                <span className="avatar-title rounded-circle bg-primary">
                                                                                                                    <i className={"bx bx-copy-alt font-size-24"}
                                                                                                                    ></i>
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </CardBody>
                                                                                                </Card>
                                                                                                :
                                                                                                item.name === 'table' ?
                                                                                                    <div >
                                                                                                        <D3Table
                                                                                                            containerWidth={item.containerWidth}
                                                                                                            containerHeight={item.containerHeight}
                                                                                                            show_table={true}
                                                                                                            chart_data={item?.data === undefined ? defaultStackChartValue : item.data}
                                                                                                            id={item.i}
                                                                                                            label_name={item?.label_arr_data === undefined ? '' : item.label_arr_data} />
                                                                                                    </div>
                                                                                                    :
                                                                                                    item.name === 'hor_barcharts' ?
                                                                                                        <div id={`${'bar1' + item.i}`} style={{}}>
                                                                                                            <div >
                                                                                                                <HorizontalbarChart
                                                                                                                    BarWidth={item.barWidth}
                                                                                                                    temp_containerWidth={item.temp_containerWidth}
                                                                                                                    temp_containerHeight={item.temp_containerHeight}
                                                                                                                    containerWidth={item.containerWidth}
                                                                                                                    containerHeight={item.containerHeight}
                                                                                                                    chart_height={item?.chart_height !== undefined ? item.chart_height : ''}
                                                                                                                    chart_data={item?.data === undefined ? defaultBarChartValue : item.data}
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
                                                                                                                />
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        :
                                                                                                        item.name === 'hor_stack' ?
                                                                                                            <div id={`${'bar1' + item.i}`} style={{}}>
                                                                                                                <div >
                                                                                                                    <HorizontalStackChart
                                                                                                                        temp_containerWidth={item.temp_containerWidth}
                                                                                                                        temp_containerHeight={item.temp_containerHeight}
                                                                                                                        containerWidth={item.containerWidth}
                                                                                                                        containerHeight={item.containerHeight}
                                                                                                                        chart_height={item?.chart_height !== undefined ? item.chart_height : undefined}
                                                                                                                        chart_data={item?.data === undefined ? defaultStackChartValue : item.data}
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
                                                                                                                    />
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            :
                                                                                                            item.name === 'Vertical_linechart' ?
                                                                                                                (
                                                                                                                    <div id={`${'bar1' + item.i}`} style={{ boxShadow: 'none', border: 'none' }} >
                                                                                                                        <div style={{ boxShadow: 'none', border: 'none' }} >
                                                                                                                            <VerticalLineChart
                                                                                                                                temp_containerWidth={item.temp_containerWidth}
                                                                                                                                temp_containerHeight={item.temp_containerHeight}
                                                                                                                                containerWidth={item.containerWidth}
                                                                                                                                containerHeight={item.containerHeight}
                                                                                                                                chart_height={item?.chart_height !== undefined ? item.chart_height : undefined}
                                                                                                                                chart_data={item?.data === undefined ? defaultVerticalLineChartValue : item.data}
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
                                                                                                                                YLabel={item?.label_arr_data !== undefined ? item.label_arr_data : []}
                                                                                                                                text_color={item?.text_customize_clr_arr !== undefined ? item.text_customize_clr_arr : []}
                                                                                                                            />
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                )
                                                                                                                :
                                                                                                                item.chart_name === 'slicer' ?
                                                                                                                    <div
                                                                                                                        id={`${'bar1' + item.i}`}
                                                                                                                        style={{
                                                                                                                            display: 'flex',
                                                                                                                            justifyContent: 'center',  // Centers children horizontally
                                                                                                                            alignItems: 'center',      // Centers children vertically
                                                                                                                            boxShadow: 'none',
                                                                                                                            border: 'none',
                                                                                                                            padding: '30px',
                                                                                                                            marginTop: '18px'
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <Slicer data={item} requestInfo={requestInfo} />
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
                                            }
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>}
        </React.Fragment>
    );
}

export default Layout;


