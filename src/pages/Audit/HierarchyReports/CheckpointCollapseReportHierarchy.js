import React, { Component, useEffect, useState, useRef } from "react";
import MetaTags from "react-meta-tags";
import {
    Container,
    Row,
    Col,
    Button,
    Card,
    CardBody,
    CardText,
    Table,
    Modal,
    Spinner,
    Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledTooltip
} from "reactstrap";
import CardTitle from "reactstrap/lib/CardTitle";
import PreviewCAPA from "./Components/preview_CAPA";
import "bootstrap/dist/css/bootstrap.min.css";
import NestedChildren from './NestedChildren'
import ExpandNestedChildren from './ExpandNestedChildren'
import { getFlatDataFromTree } from 'react-sortable-tree/dist/index.cjs.js';
import moment from 'moment'
import { Empty } from 'antd'
import { AiOutlineWarning } from 'react-icons/ai';
import { LoadingOutlined } from '@ant-design/icons';
import urlSocket from "../../../helpers/urlSocket";
import MultiStackedBarChart from "./Chart/D3-Chart/multiStackedBarChart";
import TypeMultiStackedBarChart from './Chart/D3-Chart/typeMultiStackedBarChart'
import PieChart from "./Chart/PieChart";
import CompliantMultiStackedBarChart from "./Chart/D3-Chart/compliantMultiStackedBarChart";
import NonCompliantMultiStackedBarChart from "./Chart/D3-Chart/nonCompliantMultiStackedBarChart";
import PartiallyCompliantMultiStackedBarChart from "./Chart/D3-Chart/partiallyCompliantMultiStackedBarChart";
import NotApplicableMultiStackedBarChart from "./Chart/D3-Chart/NotApplicableMultiStackedBarChart";
import Geolocation from '../../../components/GeoLocation'
import classnames from "classnames";
import _ from 'lodash'
import Breadcrumbs from "./Components/Breadcrumb2"
import { useNavigate } from "react-router-dom";

const CheckpointCollapseReport = () => {


    const navigate = useNavigate()

    const [height, setHeight] = useState(window.innerHeight);
    const [position, setPosition] = useState("right");
    const [isOpen, setIsOpen] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [showOption, setShowOption] = useState(false);
    const [attachImages, setAttachImages] = useState([]);
    const [attachDocuments, setAttachDocuments] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [docFileStatus, setDocFileStatus] = useState("clear");
    const [fileStatus, setFileStatus] = useState("clear");
    const [docWarningEnabled, setDocWarningEnabled] = useState(false);
    const [warningEnabled, setWarningEnabled] = useState(false);
    const [isSignEmpty, setIsSignEmpty] = useState(true);
    const [signee, setSignee] = useState(null);
    const [isCollapseOpen, setIsCollapseOpen] = useState([]);
    const [parentCollapseOpen, setParentCollapseOpen] = useState(true);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isOverviewCollapse, setIsOverviewCollapse] = useState(true);
    const [isCompletionCollapse, setIsCompletionCollapse] = useState(true);
    const [isAuditCollapseOpen, setIsAuditCollapseOpen] = useState(true);
    const [areFlaggedItems, setAreFlaggedItems] = useState(true);
    const [canDownloadAudit, setCanDownloadAudit] = useState(true);
    const [isCol1, setIsCol1] = useState(false);
    const [treeData, setTreeData] = useState([]);
    const [isChildCollapseOpen, setIsChildCollapseOpen] = useState([]);
    const [isCollapseAll, setIsCollapseAll] = useState(true);
    const [isExpandAll, setIsExpandAll] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [filterCpCompliant, setFilterCpCompliant] = useState('');
    const [flatData, setFlatData] = useState([]);
    const [selectedImpactLevel, setSelectedImpactLevel] = useState(null);
    const [selectedCpCompliant, setSelectedCpCompliant] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [dupFlatData, setDupFlatData] = useState([]);
    const [noData, setNoData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isBlurLoading, setIsBlurLoading] = useState(false);
    const [nonCompliantCheckpoints, setNonCompliantCheckpoints] = useState([]);
    const [showActionPlanModal, setShowActionPlanModal] = useState(false);
    const [actionPlanData, setActionPlanData] = useState([]);
    const [selectedCheckpointState, setSelectedCheckpointState] = useState('');
    const [cardWidth, setCardWidth] = useState(null);
    const [customActiveTab, setCustomActiveTab] = useState("1");
    const [clientLogo, setClientLogo] = useState(null);
    const [endpointData, setEndpointData] = useState(null);
    const cardRef = useRef(null);
    const [configData, setConfigData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [dbInfo, setDbInfo] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [imageToken, setImageToken] = useState('');
    const [totalAudit, setTotalAudit] = useState(0);
    const [redirect, setRedirect] = useState('');
    const [publishedAuditData, setPublishedAuditData] = useState(null);
    const [checkpoints, setcheckpoints] = useState([]);
    const [filteredData, setfilteredData] = useState([]);
    const [graphInfo, setGraphInfo] = useState(null);
    const [summaryInfo, setSummaryInfo] = useState(null);
    const [summaryReport, setSummaryReport] = useState(null);
    const [pageLoading, setPageLoading] = useState(false);
    const [dataloaded, setDataLoaded] = useState(false);
    const [idx, setIdx] = useState(0);
    const [impactAll, setImpactAll] = useState(null);
    const [cpAll, setCpAll] = useState(null);
    const [typeAll, setTypeAll] = useState(null);
    const [modal, setModal] = useState(false);




    useEffect(() => {
        const fetchData = async () => {
            const data = JSON.parse(sessionStorage.getItem("authUser"));



            const clientLogo = data.client_info[0].client_logo;
            setClientLogo(clientLogo);

            await getSessionData();
            await loadEndpointData(data.db_info);
            await loadCheckpoints(data.db_info);
            await updateCardWidth();
        };

        fetchData();

        const handleResize = () => {
            updateCardWidth();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    const toggleCustom = (tab) => {
        if (customActiveTab !== tab) {
            setCustomActiveTab(tab);
        }
    }

    const updateCardWidth = () => {
        if (cardRef.current) {
            const currentCardWidth = cardRef.current.clientWidth;
            // console.log('Card width:', currentCardWidth);
        }

        let width_1 = 0;
        let height_1 = 0;
        const targetElement = document.getElementById("card_container");

        if (targetElement) {
            const style = targetElement.style;
            width_1 = parseFloat(targetElement?.offsetWidth);
            height_1 = parseFloat(style.height);
            setCardWidth(width_1);
        }
    };

    const loadEndpointData = async (db_info) => {

        console.log("db_info", db_info)

        const endpointData = JSON.parse(sessionStorage.getItem("endpointInfo"));
        console.log("endpointData", endpointData)
        try {
            const response = await urlSocket.post("webpbdadtdta/getpublishedauditlocationinfo", {
                auditInfo: endpointData,
                encrypted_db_url: db_info.encrypted_db_url,
            });

            console.log(response, 'response');
            setEndpointData(response.data.data[0]);
        } catch (error) {
            console.error("Error loading endpoint data", error);
        }
    };


    const getSessionData = () => {
        const data = JSON.parse(sessionStorage.getItem("authUser"));
        const dbInfo = JSON.parse(sessionStorage.getItem("db_info"));
        const endpointData = JSON.parse(sessionStorage.getItem("endpointInfo"));
        const redirect = sessionStorage.getItem("redirect");

        let totalAudit = 0;
        if (endpointData.audit_score?.$numberDecimal !== undefined) {
            totalAudit = (parseFloat(endpointData.audit_score.$numberDecimal).toFixed(2) / parseFloat(endpointData.max_score.$numberDecimal).toFixed(2)) * 100;
        } else {
            totalAudit = (parseFloat(endpointData.audit_score).toFixed(2) / parseFloat(endpointData.max_score).toFixed(2)) * 100;
        }

        const publishedAuditData = JSON.parse(sessionStorage.getItem("publishedHInfoAuditData"));
        let auditData;
        if (publishedAuditData === null) {
            auditData = JSON.parse(sessionStorage.getItem("auditData"));
            auditData["template_name"] = auditData.audit_pbd_name;
        }

        console.log(publishedAuditData, 'publishedAuditData');

        setConfigData(data.config_data);
        setUserData(data.user_data);
        setEndpointData(endpointData);
        setDbInfo(dbInfo);
        setImagePreviewUrl(data.config_data.img_url);
        setImageToken(data.config_data.img_url);
        setTotalAudit(totalAudit);
        setRedirect(redirect);
        setPublishedAuditData(publishedAuditData === null ? auditData : publishedAuditData);
    };

    const loadCheckpoints = async (db_info) => {
        const endpointData1 = JSON.parse(sessionStorage.getItem("endpointInfo"));
        console.log('endpointData1', endpointData1)


        const data = JSON.parse(sessionStorage.getItem("authUser"));
        const authUser = data.user_data

        try {
            urlSocket
                .post("epadtprcs/getepcheckpoints", {
                    auditInfo: {
                        audit_pbd_id: endpointData1.audit_pbd_id,
                    },
                    userInfo: {
                        encrypted_db_url: db_info.encrypted_db_url,
                        _id: authUser._id,
                        company_id: authUser.company_id,
                    },
                    endpointInfo: endpointData1,
                    summary: true
                }).then(async (response) => {
                    console.log(response, 'response')
                    if (response.data.response_code === 500) {
                        const checkpoints = _.filter(response.data.data, {
                            document_type: "2",
                        });

                        const nonCompliantCheckpoints = checkpoints.filter((checkpoint) => {
                            return checkpoint.cp_compliance.name.toLowerCase() === "non compliant";
                        });

                        const isCollapseOpen = new Array(checkpoints.length).fill(false);
                        var updated_flat_data = await convertFlatDataToTreeData(response.data.data, true)
                        console.log(updated_flat_data, 'updated_flat_data')

                        setcheckpoints(checkpoints)
                        setfilteredData(checkpoints)
                        setIsCollapseOpen(isCollapseOpen)
                        setFlatData(response.data.data)
                        setDupFlatData(response.data.data)
                        setNonCompliantCheckpoints(nonCompliantCheckpoints)
                        setSummaryInfo(response.data.summary)
                        setPageLoading(false)

                        summaryData(db_info, authUser)
                    }
                });

        } catch (error) {
            console.log("error", error)
        }

    }


    const summaryData = (db_info, authUser) => {
        const endpointData1 = JSON.parse(sessionStorage.getItem("endpointInfo"));

        try {
            urlSocket
                .post("epadtprcs/report-summary-info", {
                    auditInfo: {
                        audit_pbd_id: endpointData1.audit_pbd_id,
                    },
                    userInfo: {
                        encrypted_db_url: db_info.encrypted_db_url,
                        _id: authUser._id,
                        company_id: authUser.company_id,
                    },
                    endpointInfo: endpointData1,
                })
                .then(async (response) => {
                    console.log(response, 'response')

                    setSummaryReport(response.data.summary)
                    setGraphInfo(response.data.test_data)
                    setDataLoaded(true)
                })

        } catch (error) {
            console.log("error", error)
        }
    }

    const convertFlatDataToTreeData = (flatData) => {
        console.log(flatData, 'flatData')
        if (flatData !== undefined) {
            var parent_data = flatData.filter(item2 => item2.parent_id === null);
            parent_data.sort(function (a, b) {
                return (a.document_id) - (b.document_id);
            });
            parent_data.map((parentItem) => {
                parentItem.children = getChildren(parentItem.document_id, flatData);
            });


            setTreeData(parent_data)

        }
    }


    const treeDataToFlat = (treeData) => {
        var getNodeKey = ({ treeIndex }) => treeIndex
        var flatData = getFlatDataFromTree(
            {
                treeData: treeData,
                getNodeKey,
                ignoreCollapsed: false,
            })

        var explicitData = _.filter(flatData, item => {
            return item
        })

        return explicitData
    }


    const getChildren = (parentId, flatData) => {
        var children = flatData.filter(item => item.parent_id === parentId);
        children.sort(function (a, b) {
            return a.document_id - b.document_id;
        });

        return children.map((childItem) => {
            childItem.children = getChildren(childItem.document_id, flatData);
            return childItem;
        });
    }



    const handleToggleExpand = () => {

        if (isExpanded) {
            setIsExpanded(false)
            setIsOverviewCollapse(true)
            setIsAuditCollapseOpen(true)
            setIsCompletionCollapse(true)
            setSelectedCpCompliant(null)
            setSelectedType(null)
            setSelectedImpactLevel(null)
            setAreFlaggedItems(true)

            loadCheckpoints()
        } else {
            setIsExpanded(true)
            setIsOverviewCollapse(false)
            setIsAuditCollapseOpen(false)
            setIsCompletionCollapse(false)
            setAreFlaggedItems(false)
        }

    };


    const filterTags = (select_value, value) => {
        if (value == "1") {
            /// imapact
            if (select_value == "All") {

                setSelectedImpactLevel(null)
                setSelectedCpCompliant(null)
                setSelectedType(null)
                setImpactAll(select_value)
                setCpAll(null)
                setTypeAll(null)
                setDataLoaded(false)

                setTimeout(() => setDataLoaded(true), 0);

            }
            else {

                setDataLoaded(false);

                setSelectedImpactLevel(select_value);
                setImpactAll(null);
                setCpAll(null);
                setTypeAll(null);

                setTimeout(() => setDataLoaded(true), 0);
            }
        }
        if (value == "2") {
            //// cpcompliance
            if (select_value === "All") {
                setSelectedImpactLevel(null);
                setSelectedCpCompliant(null);
                setSelectedType(null);
                setCpAll(select_value);
                setImpactAll(null);
                setTypeAll(null);
                setDataLoaded(false)


                setTimeout(() => setDataLoaded(true), 0);

            } else {
                setSelectedCpCompliant(select_value);
                setImpactAll(null);
                setCpAll(null);
                setTypeAll(null);
                setDataLoaded(false)

                setTimeout(() => setDataLoaded(true), 0);

            }

        }
        if (value == "3") {
            //// type
            if (select_value === "All") {
                setSelectedImpactLevel(null);
                setSelectedCpCompliant(null);
                setSelectedType(null);
                setTypeAll(select_value);
                setImpactAll(null);
                setCpAll(null);
                setDataLoaded(false)

                setTimeout(() => setDataLoaded(true), 0);



            } else {
                setSelectedType(select_value);
                setImpactAll(null);
                setCpAll(null);
                setTypeAll(null);
                setDataLoaded(false)

                setTimeout(() => setDataLoaded(true), 0);

            }
        }
        setTimeout(() => {

            let parent_array = dupFlatData.filter(e => {
                if ((e.parent_id !== null && e.document_type === '0') || e.parent_id === null) {
                    return true;
                }
                return false;
            });
            if (selectedImpactLevel !== null && selectedCpCompliant !== null && selectedType !== null) {

                var uniqueData = new Set();
                flatData.forEach((item) => {
                    if (
                        item.impact_level === selectedImpactLevel &&
                        (item.cp_compliance !== null && (item.cp_compliance.name === selectedCpCompliant) &&
                            item.compl_type.includes(selectedType))
                    ) {
                        uniqueData.add(item);
                    }
                });

                var mergedData = Array.from(uniqueData);
                if (mergedData.length > 0) {
                    mergedData.filter(e => {
                        parent_array.push(e)
                    })
                    convertFlatDataToTreeData(parent_array)
                    setNoData(true)
                } else {
                    setNoData(false)

                }
            } else {


                var filter_data = _.filter(flatData, e => {


                    if (selectedImpactLevel !== null && selectedCpCompliant !== null) {
                        if (e.impact_level == selectedImpactLevel && (e.cp_compliance !== null && e.cp_compliance.name == selectedCpCompliant)) {
                            return true
                        }
                    }
                    else if (selectedType !== null && selectedCpCompliant !== null) {
                        if (e.cp_compliance !== null && e.cp_compliance.name == selectedCpCompliant && (e.compl_type && e.compl_type.includes(selectedType))) {
                            return true
                        }
                    }
                    else if (selectedType !== null && selectedImpactLevel !== null) {

                        if (e.impact_level == selectedImpactLevel && (e.compl_type && e.compl_type.includes(selectedType))) {
                            return true
                        }
                    }
                    else if (selectedImpactLevel !== null) {
                        if (e.impact_level == selectedImpactLevel) {
                            return true
                        }
                    }
                    else if (selectedCpCompliant !== null) {
                        if (e.cp_compliance !== null && e.cp_compliance.name == selectedCpCompliant) {
                            return true
                        }
                    }

                    else if (selectedType !== null) {
                        if (e.compl_type && e.compl_type.includes(selectedType)) {
                            return true
                        }
                    }
                    else {
                        if (e.document_type === '2') return true
                    }
                })

                if (filter_data.length > 0) {
                    filter_data.filter(e => {
                        parent_array.push(e)
                    })
                    convertFlatDataToTreeData(parent_array)
                    setNoData(true)
                } else {
                    setNoData(false)

                }
            }
        }, 200);

    }


    const handleBack = () => {

        if (endpointData.method_selected === "2") {
            navigate("/hendpoints")
        }
        else {
        }
    }



    const handlePdfDownload = () => {

        setIsLoading(true)
        setIsBlurLoading(true)

        try {
            urlSocket.post('cog/pdf-auditvista', {
                summary_data: {
                    summary_report: summaryReport,
                    summary_info: summaryInfo,
                    graph_info: graphInfo
                },
                pdf_data: flatData,
                location_data: [endpointData],
                cmpny_data: clientLogo,
                encrypted_db_url: dbInfo.encrypted_db_url
            })
                .then((response) => {
                    if (response.data.response_code === 500) {
                        const original_name = response.data.pdf_data.orginalName
                        const download_pdf = imagePreviewUrl + original_name
                        window.open(download_pdf)
                        setIsLoading(false)
                        setIsBlurLoading(false)
                    }
                })
        } catch (error) {
            console.log('error', error)
        }
    }

    const onShowActionPlan = (actionplan_data) => {


        setActionPlanData(actionplan_data.cp_actionplans)
        setSelectedCheckpoint(actionplan_data)
        setShowActionPlanModal(true)


    }


    const handleTimeChange = (time) => {
        setSelectedTime(time)
    };

    const truncateText = (text, maxLength) =>
        text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;


    const formatCheckpointText = (text) => {
        if (text.length <= 100) {
            let words = text.split(" ");
            let formattedText = "";
            let line = "";

            words.forEach((word) => {
                if ((line + word).length > 20) {
                    formattedText += line.trim() + "<br />";
                    line = word + " ";
                } else {
                    line += word + " ";
                }
            });

            formattedText += line.trim(); // Add last line
            return formattedText;
        } else {
            let truncatedText = text.substring(0, 100);
            let lastSpace = truncatedText.lastIndexOf(" ");
            if (lastSpace > 0) {
                truncatedText = truncatedText.substring(0, lastSpace) + "...";
            } else {
                truncatedText += "..."; // In case no spaces were found
            }

            return truncatedText.replace(/(.{1,20})(\s|$)/g, "$1<br />"); // Break at nearest space
        }
    };




    if (dataloaded) {

        return (





            <React.Fragment>
                <div className={isBlurLoading ? 'page-content  blur' : 'page-content'} id='content'>
                    <MetaTags>
                        <title>AuditVista | Check Point Report</title>
                    </MetaTags>


                    <Breadcrumbs
                        title={publishedAuditData?.template_name}
                        description={endpointData.name + " / " + endpointData.code}
                        changeAuditEditMode={() => { setModal(prevModal => !prevModal); }}
                        breadcrumbItem="Template"
                        isBackButtonEnable={true}
                        gotoBack={() => handleBack()}
                    />


                    <Container fluid>
                        <Card>
                            <CardBody className="p-0">
                                <div className="text-end">
                                    <Button type="button" color="primary" className=" w-md btn-sm my-2 mx-2" onClick={handlePdfDownload} disabled={isLoading}>
                                        {isLoading && <LoadingOutlined />}{isLoading ? '...' : <i className="bx bx-download align-middle me-2" style={{ fontSize: '20px' }}></i>}
                                        {isLoading ? ' ' : 'PDF'}
                                    </Button>
                                </div>
                                <Row>
                                    <Col sm="12" >
                                        <div >
                                            <Nav tabs className="nav-tabs-custom nav-justified">
                                                <NavItem>
                                                    <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customActiveTab === "1" })} onClick={() => { toggleCustom("1"); }}>
                                                        <span className="d-flex align-items-center justify-content-center gap-2 fw-bold font-size-16">
                                                            <i className="bx bx-file font-size-16"></i> Summary
                                                        </span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customActiveTab === "2" })} onClick={() => { toggleCustom("2"); }} >
                                                        <span className="d-flex align-items-center justify-content-center gap-2 fw-bold font-size-16">
                                                            <i className="bx bx-notification font-size-16"></i> Items & Actions
                                                        </span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customActiveTab === "3", })} onClick={() => { toggleCustom("3") }} >
                                                        <span className="d-flex align-items-center justify-content-center gap-2 fw-bold font-size-16">
                                                            <i className="bx bx-news font-size-16"></i>Audit Report
                                                        </span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customActiveTab === "4" })} onClick={() => { toggleCustom("4") }} >
                                                        <span className="d-flex align-items-center justify-content-center gap-2 fw-bold font-size-16">
                                                            <i className="bx bx-check-circle font-size-16"></i>Conclusion
                                                        </span>
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>

                                            <TabContent activeTab={customActiveTab} className="p-3 text-muted" >
                                                <TabPane tabId="1">
                                                    <Row style={{ height: "76vh", overflow: "auto" }}>
                                                        <Col sm="12">
                                                            <div id="overview">
                                                                <Card style={{ marginBottom: 0, borderRadius: "0.5rem", border: '1px solid lightgrey' }} className="mt-1">
                                                                    <CardBody className="py-0">
                                                                        <Row className="my-2 align-items-center py-2">

                                                                            <Col className="col-auto">
                                                                                <CardText className="font-size-15 text-secondary mb-3">Audit</CardText>
                                                                                <CardTitle
                                                                                    className="mt-0 text-dark"
                                                                                    style={{
                                                                                        fontSize: "1rem",
                                                                                        fontWeight: "500",
                                                                                        color: "rgb(31, 37, 51)",
                                                                                        lineHeight: "0.5rem",
                                                                                        textTransform: "initial"
                                                                                    }}
                                                                                >
                                                                                    {endpointData.audit_pbd_name}


                                                                                </CardTitle>

                                                                                <CardText
                                                                                    style={{
                                                                                        fontSize: "0.8rem",
                                                                                        color: "rgb(84, 95, 112)",
                                                                                    }}
                                                                                >
                                                                                    {endpointData.name}
                                                                                    {" / "}
                                                                                    {endpointData.code}
                                                                                </CardText>
                                                                            </Col>
                                                                        </Row>
                                                                        {
                                                                            <Row
                                                                                style={{ borderTop: "1px solid lightgrey" }} className="py-3 gap-3 justify-content-between"
                                                                            >
                                                                                {
                                                                                    endpointData.audit_score !== undefined &&
                                                                                    endpointData.min_score !== undefined &&
                                                                                    endpointData.max_score !== undefined &&
                                                                                    <>
                                                                                        <Col className="col-auto"  >
                                                                                            <div className="reportCollapseLabel ">
                                                                                                <span className="text-secondary font-size-12">Audit Score</span>
                                                                                            </div>
                                                                                            <div>
                                                                                                <label style={{ fontSize: "1rem", }} className="fw-bold" >

                                                                                                    {endpointData.audit_score !==
                                                                                                        undefined &&
                                                                                                        endpointData.audit_score !==
                                                                                                        "undefined" &&
                                                                                                        endpointData.audit_score !==
                                                                                                        null ? (
                                                                                                        <>
                                                                                                            {Number(
                                                                                                                endpointData.audit_score
                                                                                                                    .$numberDecimal
                                                                                                            ).toFixed(2)}{" "}

                                                                                                        </>
                                                                                                    ) : (
                                                                                                        endpointData.audit_signature.length > 0 ?
                                                                                                            <>0</>
                                                                                                            :
                                                                                                            <>Not Started</>
                                                                                                    )}
                                                                                                </label>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col className="col-auto"  >
                                                                                            <div className="reportCollapseLabel">
                                                                                                <span className="text-secondary font-size-12" >Minimum Score</span>
                                                                                            </div>
                                                                                            <div>
                                                                                                <label style={{ fontSize: "1rem" }} className="fw-bold" >
                                                                                                    {endpointData.min_score !==
                                                                                                        undefined &&
                                                                                                        endpointData.min_score !==
                                                                                                        "undefined" &&
                                                                                                        endpointData.min_score !== null ? (
                                                                                                        <>
                                                                                                            {Number(
                                                                                                                endpointData.min_score
                                                                                                                    .$numberDecimal
                                                                                                            ).toFixed(2)}
                                                                                                        </>
                                                                                                    ) : (
                                                                                                        endpointData.audit_signature.length > 0 ?
                                                                                                            <>0</>
                                                                                                            :
                                                                                                            <>Not Started</>
                                                                                                    )}
                                                                                                </label>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col className="col-auto" >
                                                                                            <div className="reportCollapseLabel">
                                                                                                <span className="text-secondary font-size-12">Maximum Score</span>
                                                                                            </div>
                                                                                            <div>
                                                                                                <label style={{ fontSize: "1rem" }} className="fw-bold" >
                                                                                                    {endpointData.max_score !==
                                                                                                        undefined &&
                                                                                                        endpointData.max_score !==
                                                                                                        "undefined" &&
                                                                                                        endpointData.max_score !== null ? (
                                                                                                        <>
                                                                                                            {Number(
                                                                                                                endpointData.max_score
                                                                                                                    .$numberDecimal
                                                                                                            ).toFixed(2)}
                                                                                                        </>
                                                                                                    ) : (
                                                                                                        endpointData.audit_signature.length > 0 ?
                                                                                                            <>0</>
                                                                                                            :
                                                                                                            <>Not Started</>
                                                                                                    )}
                                                                                                </label>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </>

                                                                                }
                                                                                {
                                                                                    endpointData.audit_pbd_users.length === 2 ?
                                                                                        <>
                                                                                            <Col className="col-auto">
                                                                                                <div className="text-secondary font-size-12">Audited by:</div>
                                                                                                <div style={{ fontSize: "1rem" }} className="fw-bold" >{endpointData.audit_pbd_users[0].name}</div>
                                                                                            </Col>
                                                                                            <Col className="col-auto">
                                                                                                <div className="text-secondary font-size-12">Started on:</div>
                                                                                                <div style={{ fontSize: "1rem" }} className="fw-bold" >
                                                                                                    {endpointData.audit_started_on !== null ?
                                                                                                        moment(endpointData.audit_started_on).format("DD-MMM-YYYY")
                                                                                                        :
                                                                                                        <span className={"badge badge-soft-danger font-size-11 m-1"} >
                                                                                                            {"Not Submitted"}
                                                                                                        </span>
                                                                                                    }
                                                                                                </div>
                                                                                            </Col>
                                                                                            <Col className="col-auto" >
                                                                                                <div className="text-secondary font-size-12">Completed on:</div>
                                                                                                <div style={{ fontSize: "1rem" }} className="fw-bold" >
                                                                                                    {endpointData.audit_submitted_on !== null ?
                                                                                                        moment(endpointData.audit_submitted_on).format("DD-MMM-YYYY")
                                                                                                        :
                                                                                                        <span className={"badge badge-soft-danger font-size-11 m-1"} >
                                                                                                            {"Not Submitted"}
                                                                                                        </span>
                                                                                                    }
                                                                                                </div>
                                                                                            </Col>
                                                                                            <Col className="col-auto">
                                                                                                <div className="text-secondary font-size-12">Reviewer:</div>
                                                                                                <div style={{ fontSize: "1rem" }} className="fw-bold" >{endpointData.audit_pbd_users[1].name}</div>
                                                                                            </Col>
                                                                                            <Col className="col-auto">
                                                                                                <div className="text-secondary font-size-12">Reviewed on:</div>
                                                                                                <div style={{ fontSize: "1rem" }} className="fw-bold" >
                                                                                                    {endpointData.audit_reviewed_on !== null ?
                                                                                                        moment(endpointData.audit_reviewed_on).format("DD-MMM-YYYY")
                                                                                                        :
                                                                                                        <span className={"badge badge-soft-danger font-size-11 m-1"} >
                                                                                                            {"Not Submitted"}
                                                                                                        </span>
                                                                                                    }
                                                                                                </div>
                                                                                            </Col>

                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            <Col className="col-auto">
                                                                                                <div className="text-secondary font-size-12">Audited by:</div>
                                                                                                <div style={{ fontSize: "1rem" }} className="fw-bold" >{endpointData.audit_pbd_users[0].name}</div>
                                                                                            </Col>
                                                                                            <Col className="col-auto">
                                                                                                <div className="text-secondary font-size-12">Started on:</div>
                                                                                                <div style={{ fontSize: "1rem" }} className="fw-bold" >
                                                                                                    {endpointData.audit_started_on !== null ?
                                                                                                        moment(endpointData.audit_started_on).format("DD-MMM-YYYY")
                                                                                                        :
                                                                                                        <span className={"badge badge-soft-danger font-size-11 m-1"} >
                                                                                                            {"Not Submitted"}
                                                                                                        </span>
                                                                                                    }
                                                                                                </div>
                                                                                            </Col>
                                                                                            <Col className="col-auto" >
                                                                                                <div className="text-secondary font-size-12">Completed on:</div>
                                                                                                <div style={{ fontSize: "1rem" }} className="fw-bold" >
                                                                                                    {endpointData.audit_submitted_on !== null ?
                                                                                                        moment(endpointData.audit_submitted_on).format("DD-MMM-YYYY")
                                                                                                        :
                                                                                                        <span className={"badge badge-soft-danger font-size-11 m-1"} >
                                                                                                            {"Not Submitted"}
                                                                                                        </span>
                                                                                                    }
                                                                                                </div>
                                                                                            </Col>
                                                                                        </>
                                                                                }

                                                                            </Row>
                                                                        }
                                                                    </CardBody>
                                                                </Card>


                                                                {/* status based total count */}
                                                                <Row className="g-1 mt-1">
                                                                    <Col lg="12">
                                                                        <Card className="mini-stats-wid mb-0" style={{ borderRadius: "0.5rem", border: '1px solid lightgrey' }}>
                                                                            <CardBody className="d-flex flex-column justify-content-center" >
                                                                                <div className="d-flex flex-row mb-3 pb-3  border-bottom border-light" style={{ textAlign: "center", justifyContent: 'space-evenly' }}>
                                                                                    <div >
                                                                                        <h2 className="fw-bold text-dark mb-0"  >{summaryInfo?.total_checkpoints}</h2>
                                                                                        <div className="font-size-12 text-secondary">Total Checkpoints</div>
                                                                                    </div>
                                                                                    <div >
                                                                                        <h2 className="fw-bold text-success mb-0"  >{summaryInfo?.compliantCount}</h2>
                                                                                        <div className="font-size-12 text-secondary">Compliant</div>
                                                                                    </div>
                                                                                    <div >
                                                                                        <h2 className="fw-bold text-danger mb-0" >{summaryInfo?.nonCompliantCount}</h2>
                                                                                        <div className="font-size-12 text-secondary">Non Compliant</div>
                                                                                    </div>
                                                                                    <div >
                                                                                        <h2 className="fw-bold text-warning mb-0" >{summaryInfo?.partiallyCompliantCount}</h2>
                                                                                        <div className="font-size-12 text-secondary">Partially Compliant</div>
                                                                                    </div>
                                                                                    <div >
                                                                                        <h2 className="fw-bold text-secondary mb-0" >{summaryInfo?.notApplicableCount}</h2>
                                                                                        <div className="font-size-12 text-secondary">Not Applicable</div>
                                                                                    </div>

                                                                                </div>
                                                                                <Table bordered>
                                                                                    <thead>
                                                                                        <tr >
                                                                                            <th style={{ fontSize: '12px' }} className="bg-light" >Type</th>
                                                                                            <th className="text-dark bg-light" style={{ fontSize: '12px' }}>Total</th>
                                                                                            <th className="text-danger bg-light" style={{ fontSize: '12px' }}>Critical</th>
                                                                                            <th className="text-warning bg-light" style={{ fontSize: '12px' }}>High</th>
                                                                                            <th className="text-info bg-light" style={{ fontSize: '12px' }}>Medium</th>
                                                                                            <th className="text-success bg-light" style={{ fontSize: '12px' }}>Low</th>
                                                                                            <th className="text-primary bg-light" style={{ fontSize: '12px' }}>No Impact</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        <tr >
                                                                                            <td className="fw-bold font-size-14 text-muted">Compliant</td>
                                                                                            <td className="fw-bold font-size-14">{summaryInfo?.compliantCount}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.complaint_critical_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.complaint_high_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.complaint_medium_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.complaint_low_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.complaint_no_impact_count}</td>
                                                                                        </tr>
                                                                                        <tr >
                                                                                            <td className="fw-bold font-size-14 text-muted">Non Compliant</td>
                                                                                            <td className="fw-bold font-size-14">{summaryInfo?.nonCompliantCount}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.non_compliant_critical_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.non_compliant_high_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.non_compliant_medium_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.non_compliant_low_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.non_compliant_no_impact_count}</td>
                                                                                        </tr>
                                                                                        <tr >
                                                                                            <td className="fw-bold font-size-14 text-muted">Partially Compliant</td>
                                                                                            <td className="fw-bold font-size-14">{summaryInfo?.partiallyCompliantCount}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.partially_compliant_critical_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.partially_compliant_high_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.partially_compliant_medium_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.partially_compliant_low_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.partially_compliant_no_impact_count}</td>
                                                                                        </tr>
                                                                                        <tr >
                                                                                            <td className="fw-bold font-size-14 text-muted">Not Applicable</td>
                                                                                            <td className="fw-bold font-size-14">{summaryInfo?.notApplicableCount}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.not_applicable_critical_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.not_applicable_high_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.not_applicable_medium_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.not_applicable_low_count}</td>
                                                                                            <td className="fw-bold font-size-14">{summaryReport.not_applicable_no_impact_count}</td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </Table>

                                                                            </CardBody>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>

                                                                <Row className="g-1 mt-1 align-items-stretch">
                                                                    <Col xs={12} md={12} lg={6} xl={6}>
                                                                        <Card className="mb-0 h-100" style={{ borderRadius: "0.5rem", border: "1px solid lightgrey" }}>
                                                                            <CardBody style={{ padding: "12px 20px" }}>
                                                                                <CardTitle>Status</CardTitle>
                                                                                <PieChart
                                                                                    dataColors='["--bs-success","--bs-primary", "--bs-danger","--bs-info", "--bs-warning"]'
                                                                                    total_checkpoints={summaryReport.total_checkpoints}
                                                                                    compliantCount={summaryInfo?.compliantCount}
                                                                                    nonCompliantCount={summaryInfo?.nonCompliantCount}
                                                                                    partiallyCompliantCount={summaryInfo?.partiallyCompliantCount}
                                                                                    notApplicableCount={summaryInfo?.notApplicableCount}
                                                                                />
                                                                            </CardBody>
                                                                        </Card>
                                                                    </Col>
                                                                    <Col xs={12} md={12} lg={6} xl={6}>
                                                                        <Card className="mb-0 h-100" style={{ borderRadius: "0.5rem", border: "1px solid lightgrey" }}>
                                                                            <CardBody style={{ padding: "12px 20px" }}>
                                                                                <CardTitle>Impact Level</CardTitle>
                                                                                <MultiStackedBarChart
                                                                                    total_checkpoints={summaryReport.total_checkpoints}
                                                                                    compliantCount={summaryInfo.compliantCount}
                                                                                    nonCompliantCount={summaryInfo.nonCompliantCount}
                                                                                    partiallyCompliantCount={summaryInfo.partiallyCompliantCount}
                                                                                    notApplicableCount={summaryInfo.notApplicableCount}
                                                                                    complaint_critical_count={summaryReport.complaint_critical_count}
                                                                                    complaint_high_count={summaryReport.complaint_high_count}
                                                                                    complaint_low_count={summaryReport.complaint_low_count}
                                                                                    complaint_medium_count={summaryReport.complaint_medium_count}
                                                                                    complaint_no_impact_count={summaryReport.complaint_no_impact_count}
                                                                                    non_compliant_critical_count={summaryReport.non_compliant_critical_count}
                                                                                    non_compliant_high_count={summaryReport.non_compliant_high_count}
                                                                                    non_compliant_low_count={summaryReport.non_compliant_low_count}
                                                                                    non_compliant_medium_count={summaryReport.non_compliant_medium_count}
                                                                                    non_compliant_no_impact_count={summaryReport.non_compliant_no_impact_count}
                                                                                    partially_compliant_critical_count={summaryReport.partially_compliant_critical_count}
                                                                                    partially_compliant_high_count={summaryReport.partially_compliant_high_count}
                                                                                    partially_compliant_low_count={summaryReport.partially_compliant_low_count}
                                                                                    partially_compliant_medium_count={summaryReport.partially_compliant_medium_count}
                                                                                    partially_compliant_no_impact_count={summaryReport.partially_compliant_no_impact_count}
                                                                                    not_applicable_critical_count={summaryReport.not_applicable_critical_count}
                                                                                    not_applicable_high_count={summaryReport.not_applicable_high_count}
                                                                                    not_applicable_low_count={summaryReport.not_applicable_low_count}
                                                                                    not_applicable_medium_count={summaryReport.not_applicable_medium_count}
                                                                                    not_applicable_no_impact_count={summaryReport.not_applicable_no_impact_count}
                                                                                />
                                                                            </CardBody>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>


                                                                <Row className="g-1 mt-2">
                                                                    <Col>

                                                                        <Card id="card_container" className="mb-0 h-100" style={{ borderRadius: "0.5rem", border: "1px solid lightgrey" }}>
                                                                            <CardBody>
                                                                                <CardTitle>Types</CardTitle>
                                                                                <TypeMultiStackedBarChart
                                                                                    card_container={"card_container"}
                                                                                    cardWidth={cardWidth}
                                                                                    total_checkpoints={summaryReport.total_checkpoints}
                                                                                    compliantCount={summaryReport.total_complaint_type_count}
                                                                                    nonCompliantCount={summaryReport.total_non_complaint_type_count}
                                                                                    partiallyCompliantCount={summaryReport.total_partially_type_count}
                                                                                    notApplicableCount={summaryReport.total_not_applicable_type_count}
                                                                                    complaint_type_array={summaryReport.unique_type_complaint}
                                                                                    non_complaint_type_array={summaryReport.unique_type_non_complaint}
                                                                                    partially_compliant_type_array={summaryReport.unique_type_partially_complaint}
                                                                                    not_applicable_type_array={summaryReport.unique_type_not_applicable}
                                                                                />
                                                                            </CardBody>
                                                                        </Card>


                                                                    </Col>
                                                                </Row>



                                                                {
                                                                    (summaryReport.unique_type_complaint.length > 0 ||
                                                                        summaryReport.unique_type_non_complaint.length > 0 ||
                                                                        summaryReport.unique_type_partially_complaint.length > 0 ||
                                                                        summaryReport.unique_type_not_applicable.length > 0) &&
                                                                    <>
                                                                        {/* Compliant - MultiStackedBarChart */}
                                                                        <Row className="g-2 mt-2">
                                                                            <Col md={12}>
                                                                                <Card className="mb-0" style={{ borderRadius: "0.5rem", border: '1px solid lightgrey' }}>
                                                                                    <CardBody>
                                                                                        <CardTitle>Compliant</CardTitle>
                                                                                        {/* <Container> */}
                                                                                        {summaryReport.unique_type_complaint.length > 0 ?
                                                                                            <>
                                                                                                <Row className="g-2">
                                                                                                    <Col md={12}>
                                                                                                        <Table bordered>
                                                                                                            <thead>
                                                                                                                <tr>
                                                                                                                    <th className="text-secondary bg-light" style={{ fontSize: '12px' }}>Type</th>
                                                                                                                    <th className="text-danger bg-light" style={{ fontSize: '12px' }}>Critical</th>
                                                                                                                    <th className="text-warning bg-light" style={{ fontSize: '12px' }}>High</th>
                                                                                                                    <th className="text-info bg-light" style={{ fontSize: '12px' }}>Medium</th>
                                                                                                                    <th className="text-success bg-light" style={{ fontSize: '12px' }}>Low</th>
                                                                                                                    <th className="text-primary bg-light" style={{ fontSize: '12px' }}>No Impact</th>
                                                                                                                    <th className="text-dark bg-light" style={{ fontSize: '12px' }}>Total</th>
                                                                                                                </tr>
                                                                                                            </thead>
                                                                                                            <tbody>
                                                                                                                {summaryReport.unique_type_complaint.map((element, indx) => (
                                                                                                                    <tr key={indx}>
                                                                                                                        <td className="fw-bold font-size-14 text-muted">{element.type_name}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.critical_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.high_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.medium_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.low_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.no_impact_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.count}</td>
                                                                                                                    </tr>
                                                                                                                ))}
                                                                                                            </tbody>
                                                                                                        </Table>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                                <CompliantMultiStackedBarChart
                                                                                                    complaint_critical_count={graphInfo.compliant_info.complaint_critical_count}
                                                                                                    complaint_high_count={graphInfo.compliant_info.complaint_high_count}
                                                                                                    complaint_low_count={graphInfo.compliant_info.complaint_low_count}
                                                                                                    complaint_medium_count={graphInfo.compliant_info.complaint_medium_count}
                                                                                                    complaint_no_impact_count={graphInfo.compliant_info.complaint_no_impact_count}


                                                                                                    critical_type_info={graphInfo.compliant_info.critical_type_info}
                                                                                                    high_type_info={graphInfo.compliant_info.high_type_info}
                                                                                                    low_type_info={graphInfo.compliant_info.low_type_info}
                                                                                                    medium_type_info={graphInfo.compliant_info.medium_type_info}
                                                                                                    no_impact_type_info={graphInfo.compliant_info.no_impact_type_info}
                                                                                                // compliant_info = {graphInfo.compliant_info}
                                                                                                />
                                                                                            </>
                                                                                            :
                                                                                            <Row>
                                                                                                <Col className="text-center">
                                                                                                    <CardTitle>No Data Available</CardTitle>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        }
                                                                                        {/* </Container> */}
                                                                                    </CardBody>
                                                                                </Card>
                                                                            </Col>
                                                                        </Row>

                                                                        {/* Non Compliant - MultiStackedBarChart */}
                                                                        <Row className="g-2 mt-2">
                                                                            <Col md={12}>
                                                                                <Card className="mb-0" style={{ borderRadius: "0.5rem", border: '1px solid lightgrey' }}>
                                                                                    <CardBody>
                                                                                        <CardTitle>Non Compliant</CardTitle>

                                                                                        {summaryReport.unique_type_non_complaint.length > 0 ?
                                                                                            <>
                                                                                                <Row className="g-2">
                                                                                                    <Col md={12}>
                                                                                                        <Table bordered>
                                                                                                            <thead>
                                                                                                                <tr>
                                                                                                                    <th className="text-secondary bg-light" style={{ fontSize: '12px' }}>Type</th>
                                                                                                                    <th className="text-danger bg-light" style={{ fontSize: '12px' }}>Critical</th>
                                                                                                                    <th className="text-warning bg-light" style={{ fontSize: '12px' }}>High</th>
                                                                                                                    <th className="text-info bg-light" style={{ fontSize: '12px' }}>Medium</th>
                                                                                                                    <th className="text-success bg-light" style={{ fontSize: '12px' }}>Low</th>
                                                                                                                    <th className="text-primary bg-light" style={{ fontSize: '12px' }}>No Impact</th>
                                                                                                                    <th className="text-dark bg-light" style={{ fontSize: '12px' }}>Total</th>
                                                                                                                </tr>
                                                                                                            </thead>
                                                                                                            <tbody>
                                                                                                                {summaryReport.unique_type_non_complaint.map((element, indx) => (
                                                                                                                    <tr key={indx}>
                                                                                                                        <td className="fw-bold font-size-14 text-muted">{element.type_name}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.critical_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.high_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.medium_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.low_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.no_impact_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.count}</td>
                                                                                                                    </tr>
                                                                                                                ))}
                                                                                                            </tbody>
                                                                                                        </Table>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                                <NonCompliantMultiStackedBarChart
                                                                                                    complaint_critical_count={graphInfo.non_compliant_info.non_complaint_critical_count}
                                                                                                    complaint_high_count={graphInfo.non_compliant_info.non_complaint_high_count}
                                                                                                    complaint_low_count={graphInfo.non_compliant_info.non_complaint_low_count}
                                                                                                    complaint_medium_count={graphInfo.non_compliant_info.non_complaint_medium_count}
                                                                                                    complaint_no_impact_count={graphInfo.non_compliant_info.non_complaint_no_impact_count}


                                                                                                    critical_type_info={graphInfo.non_compliant_info.critical_type_info}
                                                                                                    high_type_info={graphInfo.non_compliant_info.high_type_info}
                                                                                                    low_type_info={graphInfo.non_compliant_info.low_type_info}
                                                                                                    medium_type_info={graphInfo.non_compliant_info.medium_type_info}
                                                                                                    no_impact_type_info={graphInfo.non_compliant_info.no_impact_type_info}
                                                                                                />
                                                                                            </>
                                                                                            :
                                                                                            <Row>
                                                                                                <Col className="text-center">
                                                                                                    <CardTitle>No Data Available</CardTitle>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        }
                                                                                    </CardBody>
                                                                                </Card>
                                                                            </Col>
                                                                        </Row>


                                                                        {/* Partially Compliant - MultiStackedBarChart */}
                                                                        <Row className="g-2 mt-2">
                                                                            <Col md={12}>
                                                                                <Card className="mb-0" style={{ borderRadius: "0.5rem", border: '1px solid lightgrey' }}>
                                                                                    <CardBody>
                                                                                        <CardTitle>Partially Compliant</CardTitle>

                                                                                        {summaryReport.unique_type_partially_complaint.length > 0 ?
                                                                                            <>
                                                                                                <Row className="g-2">
                                                                                                    <Col md={12}>
                                                                                                        <Table bordered>
                                                                                                            <thead>
                                                                                                                <tr>
                                                                                                                    <th className="text-secondary bg-light" style={{ fontSize: '12px' }}>Type</th>
                                                                                                                    <th className="text-danger bg-light" style={{ fontSize: '12px' }}>Critical</th>
                                                                                                                    <th className="text-warning bg-light" style={{ fontSize: '12px' }}>High</th>
                                                                                                                    <th className="text-info bg-light" style={{ fontSize: '12px' }}>Medium</th>
                                                                                                                    <th className="text-success bg-light" style={{ fontSize: '12px' }}>Low</th>
                                                                                                                    <th className="text-primary bg-light" style={{ fontSize: '12px' }}>No Impact</th>
                                                                                                                    <th className="text-dark bg-light" style={{ fontSize: '12px' }}>Total</th>
                                                                                                                </tr>
                                                                                                            </thead>
                                                                                                            <tbody>
                                                                                                                {summaryReport.unique_type_partially_complaint.map((element, indx) => (
                                                                                                                    <tr key={indx}>
                                                                                                                        <td className="fw-bold font-size-14 text-muted">{element.type_name}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.critical_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.high_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.medium_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.low_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.no_impact_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.count}</td>
                                                                                                                    </tr>
                                                                                                                ))}
                                                                                                            </tbody>
                                                                                                        </Table>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                                <PartiallyCompliantMultiStackedBarChart
                                                                                                    complaint_critical_count={graphInfo.partially_compliant_info.partially_complaint_critical_count}
                                                                                                    complaint_high_count={graphInfo.partially_compliant_info.partially_complaint_high_count}
                                                                                                    complaint_low_count={graphInfo.partially_compliant_info.partially_complaint_low_count}
                                                                                                    complaint_medium_count={graphInfo.partially_compliant_info.partially_complaint_medium_count}
                                                                                                    complaint_no_impact_count={graphInfo.partially_compliant_info.partially_complaint_no_impact_count}


                                                                                                    critical_type_info={graphInfo.partially_compliant_info.critical_type_info}
                                                                                                    high_type_info={graphInfo.partially_compliant_info.high_type_info}
                                                                                                    low_type_info={graphInfo.partially_compliant_info.low_type_info}
                                                                                                    medium_type_info={graphInfo.partially_compliant_info.medium_type_info}
                                                                                                    no_impact_type_info={graphInfo.partially_compliant_info.no_impact_type_info}
                                                                                                />
                                                                                            </>
                                                                                            :
                                                                                            <Row>
                                                                                                <Col className="text-center">
                                                                                                    <CardTitle>No Data Available</CardTitle>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        }
                                                                                    </CardBody>
                                                                                </Card>
                                                                            </Col>
                                                                        </Row>


                                                                        {/* Not Applicable - MultiStackedBarChart */}
                                                                        <Row className="g-2 mt-2">
                                                                            <Col md={12}>
                                                                                <Card className="mb-0" style={{ borderRadius: "0.5rem", border: '1px solid lightgrey' }}>
                                                                                    <CardBody>
                                                                                        <CardTitle>Not Applicable</CardTitle>

                                                                                        {summaryReport.unique_type_not_applicable.length > 0 ?
                                                                                            <>
                                                                                                <Row className="g-2">
                                                                                                    <Col md={12}>
                                                                                                        <Table bordered>
                                                                                                            <thead>
                                                                                                                <tr>
                                                                                                                    <th className="text-secondary bg-light" style={{ fontSize: '12px' }}>Type</th>
                                                                                                                    <th className="text-danger bg-light" style={{ fontSize: '12px' }}>Critical</th>
                                                                                                                    <th className="text-warning bg-light" style={{ fontSize: '12px' }}>High</th>
                                                                                                                    <th className="text-info bg-light" style={{ fontSize: '12px' }}>Medium</th>
                                                                                                                    <th className="text-success bg-light" style={{ fontSize: '12px' }}>Low</th>
                                                                                                                    <th className="text-primary bg-light" style={{ fontSize: '12px' }}>No Impact</th>
                                                                                                                    <th className="text-dark bg-light" style={{ fontSize: '12px' }}>Total</th>
                                                                                                                </tr>
                                                                                                            </thead>
                                                                                                            <tbody>
                                                                                                                {summaryReport.unique_type_not_applicable.map((element, indx) => (
                                                                                                                    <tr key={indx}>
                                                                                                                        <td className="fw-bold font-size-14 text-muted">{element.type_name}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.critical_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.high_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.medium_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.low_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.no_impact_count}</td>
                                                                                                                        <td className="fw-bold font-size-14">{element.count}</td>
                                                                                                                    </tr>
                                                                                                                ))}
                                                                                                            </tbody>
                                                                                                        </Table>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                                <NotApplicableMultiStackedBarChart
                                                                                                    complaint_critical_count={graphInfo.not_applicable_info.not_applicable_critical_count}
                                                                                                    complaint_high_count={graphInfo.not_applicable_info.not_applicable_high_count}
                                                                                                    complaint_low_count={graphInfo.not_applicable_info.not_applicable_low_count}
                                                                                                    complaint_medium_count={graphInfo.not_applicable_info.not_applicable_medium_count}
                                                                                                    complaint_no_impact_count={graphInfo.not_applicable_info.not_applicable_no_impact_count}


                                                                                                    critical_type_info={graphInfo.not_applicable_info.critical_type_info}
                                                                                                    high_type_info={graphInfo.not_applicable_info.high_type_info}
                                                                                                    low_type_info={graphInfo.not_applicable_info.low_type_info}
                                                                                                    medium_type_info={graphInfo.not_applicable_info.medium_type_info}
                                                                                                    no_impact_type_info={graphInfo.not_applicable_info.no_impact_type_info}
                                                                                                />
                                                                                            </>
                                                                                            :
                                                                                            <Row>
                                                                                                <Col className="text-center">
                                                                                                    <CardTitle>No Data Available</CardTitle>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        }
                                                                                    </CardBody>
                                                                                </Card>
                                                                            </Col>
                                                                        </Row>
                                                                    </>
                                                                }






                                                                {/* Location details Section */}
                                                                {
                                                                    endpointData.audit_lat !== undefined && endpointData.audit_long !== undefined && endpointData.audit_lat !== null && endpointData.audit_long !== null &&
                                                                    <Row className="g-2 mt-2">
                                                                        <Col md={12}>
                                                                            <Card style={{ borderRadius: "0.5rem", marginBottom: 0, border: '1px solid lightgrey' }} className="mb-0" >
                                                                                <CardBody style={{ padding: "12px 20px" }}>
                                                                                    <CardTitle>Location Details</CardTitle>
                                                                                    <Geolocation latitude={endpointData.audit_lat} longitude={endpointData.audit_long} />
                                                                                </CardBody>
                                                                            </Card>
                                                                        </Col>
                                                                    </Row>
                                                                }


                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                                <TabPane tabId="2">
                                                    <Row style={{ height: "76vh", overflow: "auto" }}>
                                                        <Col sm="12">
                                                            {nonCompliantCheckpoints.length > 0 &&
                                                                <Card className="mt-2" style={{ borderRadius: "0.5rem", border: '1px solid lightgrey' }}>
                                                                    <CardBody>
                                                                        <Table bordered responsive style={{ borderLeft: "3px solid rgb(244, 106, 106)", borderRadiusLeft: '1rem' }}>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th className="text-secondary">S.No</th>
                                                                                    <th className="text-secondary">Checkpoint</th>
                                                                                    <th className="text-secondary">Action Plan</th>
                                                                                    <th className="text-secondary">CP Compliance</th>
                                                                                    <th className="text-secondary">Impact Level</th>
                                                                                    <th className="text-secondary">Type</th>
                                                                                    <th className="text-secondary">Max Score</th>
                                                                                    <th className="text-secondary">Min Score</th>
                                                                                    <th className="text-secondary">Audit Score</th>
                                                                                    <th className="text-secondary">Audit Score %</th>
                                                                                    <th className="text-secondary">Score Gap</th>
                                                                                    <th className="text-secondary">Score Gap %</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {
                                                                                    nonCompliantCheckpoints.map((item, i) => (
                                                                                        <tr key={i} >
                                                                                            <td>{i + 1}</td>
                                                                                            <td id={`templateInfo-${item._id}`}>
                                                                                                <span dangerouslySetInnerHTML={{ __html: formatCheckpointText(item.checkpoint) }} />
                                                                                                {item.checkpoint.length > 100 && (
                                                                                                    <UncontrolledTooltip placement="left" target={`templateInfo-${item._id}`} style={{ maxWidth: "500px", borderRadius: "10px", }}>
                                                                                                        {item.checkpoint}
                                                                                                    </UncontrolledTooltip>
                                                                                                )}
                                                                                            </td>

                                                                                            <td>{item.cp_status !== "0" ? <><span className="font-size-10"> </span><label className={item.cp_is_compliance ? "badge badge-soft-success font-size-10" : "badge badge-soft-danger font-size-10"}>{item.cp_compliance?.name}</label> </> : null} </td>
                                                                                            <td>{
                                                                                                item.impact_level === 'Low'
                                                                                                    ? <label className="font-size-12 badge badge-soft-success">Low</label>
                                                                                                    : item.impact_level === 'Medium'
                                                                                                        ? <label className="font-size-12 badge badge-soft-info">Medium</label>
                                                                                                        : item.impact_level === 'High'
                                                                                                            ? <label className="font-size-12 badge badge-soft-warning">High</label>
                                                                                                            : item.impact_level === 'Critical'
                                                                                                                ? <label className="font-size-12 badge badge-soft-danger">Critical</label>
                                                                                                                : <label className="font-size-12 badge badge-soft-primary ">No impact</label>

                                                                                            }</td>
                                                                                            <td>{item.compl_type.map((item2, index) => {
                                                                                                const formattedItem = index === item.compl_type.length - 1 ? item2 + '.' : item2;
                                                                                                return formattedItem;
                                                                                            }).join(', ')}</td>

                                                                                            <td className="fw-bold font-size-14">{item.max_score}</td>
                                                                                            <td className="fw-bold font-size-14">{item.min_score}</td>
                                                                                            <td className="fw-bold font-size-14">{item.cp_otpion_score !== undefined && item.cp_otpion_score !== null ? parseFloat(item.cp_otpion_score?.$numberDecimal).toFixed(2) : 'No Score'}</td>
                                                                                            <td className="fw-bold font-size-14">
                                                                                                {item.cp_otpion_score !== undefined && item.cp_otpion_score !== null
                                                                                                    ? (item.cp_otpion_score?.$numberDecimal / item.max_score * 100).toFixed(2)
                                                                                                    : 'No Score'}
                                                                                            </td>
                                                                                            <td className="fw-bold font-size-14">
                                                                                                {(item.max_score - (item.cp_otpion_score !== undefined && item.cp_otpion_score !== null
                                                                                                    ? parseFloat(item.cp_otpion_score?.$numberDecimal)
                                                                                                    : 0)).toFixed(2)}
                                                                                            </td>
                                                                                            <td className="fw-bold font-size-14">
                                                                                                {((item.max_score - (item.cp_otpion_score !== undefined && item.cp_otpion_score !== null
                                                                                                    ? parseFloat(item.cp_otpion_score?.$numberDecimal)
                                                                                                    : 0)) / item.max_score * 100).toFixed(2)}
                                                                                            </td>


                                                                                        </tr>
                                                                                    ))}
                                                                            </tbody>
                                                                        </Table>

                                                                    </CardBody>
                                                                </Card>
                                                            }

                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                                <TabPane tabId="3">
                                                    <Row>
                                                        <Col style={{ maxWidth: 200, height: "80vh", overflowY: "auto", padding: "1px" }}>
                                                            <Card style={{ borderRadius: "0.5rem", border: '1px solid lightgrey' }} className="mb-1">
                                                                <CardBody className="pb-0">
                                                                    <div className="form-check form-switch form-switch-sm mb-4">
                                                                        <label className="form-check-label fw-bold font-size-11  ms-2" htmlFor="customSwitchsizesm">
                                                                            {isExpanded ? "Expand All" : "Collapse All"}
                                                                        </label>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-check-input"
                                                                            id="customSwitchsizesm"
                                                                            defaultChecked
                                                                            checked={isExpanded}
                                                                            onClick={handleToggleExpand}
                                                                        />
                                                                    </div>
                                                                </CardBody>
                                                            </Card>

                                                            {!isExpanded && isAuditCollapseOpen && (
                                                                <Card style={{ borderRadius: "0.5rem", border: '1px solid lightgrey' }}>
                                                                    <CardBody>
                                                                        {/* Impact Level Section */}
                                                                        <div className="mb-4">
                                                                            <h6 className="border-bottom pb-2">Impact Level</h6>
                                                                            <div className="d-flex flex-column gap-2">
                                                                                {["All", "Critical", "High", "Medium", "Low", "no_impact"].map(
                                                                                    (level, idx) => (
                                                                                        <Button
                                                                                            key={idx}
                                                                                            color={
                                                                                                level === "Critical"
                                                                                                    ? "danger"
                                                                                                    : level === "High"
                                                                                                        ? "warning"
                                                                                                        : level === "Medium"
                                                                                                            ? "info"
                                                                                                            : level === "Low"
                                                                                                                ? "success"
                                                                                                                : "primary"
                                                                                            }
                                                                                            className="btn-sm"
                                                                                            outline={selectedImpactLevel !== level}
                                                                                            style={{ width: "100%" }}
                                                                                            onClick={() => filterTags(level, "1")}
                                                                                        >
                                                                                            {level === "no_impact" ? "No Impact" : level}
                                                                                        </Button>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* Compliance Status Section */}
                                                                        <div className="mb-4">
                                                                            <h6 className="border-bottom pb-2">Compliance Status</h6>
                                                                            <div className="d-flex flex-column gap-2">
                                                                                {[
                                                                                    { label: "All", color: "info" },
                                                                                    { label: "Compliant", color: "success" },
                                                                                    { label: "Non Compliant", color: "danger" },
                                                                                    { label: "Partially Compliant", color: "warning" },
                                                                                    { label: "Not Applicable", color: "secondary" },
                                                                                ].map((status, idx) => (
                                                                                    <Button
                                                                                        key={idx}
                                                                                        color={status.color}
                                                                                        className="btn-sm"
                                                                                        outline={selectedCpCompliant !== status.label}
                                                                                        style={{ width: "100%" }}
                                                                                        onClick={() => filterTags(status.label, "2")}
                                                                                    >
                                                                                        {status.label}
                                                                                    </Button>
                                                                                ))}
                                                                            </div>
                                                                        </div>

                                                                        {/* Type Section */}
                                                                        <div>
                                                                            <h6 className="border-bottom pb-2">Type</h6>
                                                                            <div className="d-flex flex-column gap-2">
                                                                                {[
                                                                                    { label: "All", color: "info" },
                                                                                    { label: "Regulatory", color: "info" },
                                                                                    { label: "Internal", color: "success" },
                                                                                    { label: "External", color: "danger" },
                                                                                ].map((type, idx) => (
                                                                                    <Button
                                                                                        key={idx}
                                                                                        color={type.color}
                                                                                        className="btn-sm"
                                                                                        outline={selectedType !== type.label}
                                                                                        style={{ width: "100%" }}
                                                                                        onClick={() => filterTags(type.label, "3")}
                                                                                    >
                                                                                        {type.label}
                                                                                    </Button>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </CardBody>
                                                                </Card>
                                                            )}
                                                            {/* </CardBody>
                                                                </Card> */}
                                                        </Col>

                                                        <Col className="w-100" style={{ height: "76vh", overflow: "auto" }}>

                                                            {
                                                                !isExpanded ?
                                                                    <>
                                                                        {
                                                                            noData ?
                                                                                <>
                                                                                    {
                                                                                        treeData.map((child, index) => (

                                                                                            <NestedChildren key={child._id} endpointData={endpointData} index={index}>
                                                                                                {child}
                                                                                            </NestedChildren>
                                                                                        ))}
                                                                                </>
                                                                                :
                                                                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                                                                    <Empty
                                                                                        image={<AiOutlineWarning style={{ fontSize: '48px', color: '#f46a6a' }} />} // Use the imported icon
                                                                                        description="No Data Found"
                                                                                    />
                                                                                </div>
                                                                        }
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {
                                                                            treeData.map((child, index) => (
                                                                                <ExpandNestedChildren
                                                                                    key={child._id}
                                                                                    // children={child}
                                                                                    endpointData={endpointData}
                                                                                    index={index}
                                                                                    expanded={isExpanded}

                                                                                >
                                                                                    {child}
                                                                                </ExpandNestedChildren>
                                                                            ))}
                                                                    </>
                                                            }
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                                <TabPane tabId="4">
                                                    <Row style={{ height: "76vh", overflow: "auto" }}>
                                                        <Col sm="12">

                                                            {endpointData.audit_signature
                                                                .length !== 0 ? (
                                                                <Card style={{ borderRadius: "0.5rem", border: '1px solid lightgrey' }} className="mt-1">
                                                                    <CardBody style={{ paddingBottom: 0 }}>
                                                                        <div style={{ color: "rgb(84, 95, 112)", marginBottom: 10 }}>
                                                                            {" "}
                                                                            Name & Signature of Maintenance Personnel{" "}
                                                                        </div>
                                                                        <Row className="py-3 g-2">
                                                                            {endpointData.audit_signature.map(
                                                                                (item, i) => {
                                                                                    return (
                                                                                        <Col className="col-auto" key={i}>
                                                                                            <div
                                                                                                style={{
                                                                                                    display: "flex",
                                                                                                    flexDirection: "column",
                                                                                                    border: "1px solid #dedede",
                                                                                                    borderRadius: 15,
                                                                                                    padding: 10
                                                                                                }}
                                                                                            >
                                                                                                <div className="p-2">
                                                                                                    <img height="80" src={imagePreviewUrl + item.originalName} />
                                                                                                </div>
                                                                                                <div className="p-2">
                                                                                                    <label className="">
                                                                                                        <span
                                                                                                            style={{
                                                                                                                fontSize: "13px",
                                                                                                                color: "rgb(31, 37, 51)",
                                                                                                                fontWeight: 400,
                                                                                                            }}
                                                                                                        >
                                                                                                            Name : {item.sign_by}

                                                                                                        </span>
                                                                                                        <br />
                                                                                                        <span
                                                                                                            style={{
                                                                                                                fontSize: "13px",
                                                                                                                color: "rgb(31, 37, 51)",
                                                                                                                fontWeight: 400,
                                                                                                            }}
                                                                                                        ></span>Designation : {item.designation}
                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </Col>
                                                                                    );
                                                                                }
                                                                            )}

                                                                        </Row>
                                                                    </CardBody>
                                                                </Card>
                                                            ) : null}
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                            </TabContent>


                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Container>



                </div>


            </React.Fragment>
        )




    } else if (pageLoading) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: 0 }}  >
                    <Container fluid >
                        <Row style={{ minHeight: "calc(100vh - 450px)" }}>
                            <div className='d-flex w-100 flex-column justify-content-center align-items-center'>
                                <Spinner className="mb-2" color="primary" />
                                <div>Loading ...</div>
                            </div>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        )

    }
    else {
        return null;
    }


}


export default CheckpointCollapseReport