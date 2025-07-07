import React, { useState, useEffect, useMemo } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom"
import MetaTags from 'react-meta-tags';
import { Container, Button, Card, CardBody, UncontrolledTooltip, Spinner } from "reactstrap"
import Swal from "sweetalert2";
import TableContainer from "./Components/TableContainerEndpoints";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import { getFlatDataFromTree } from 'react-sortable-tree/dist/index.cjs.js';

import CheckboxTree, {
} from 'react-checkbox-tree';
import './checkboxtree.css';
import { MdCheckBox, MdCheckBoxOutlineBlank, MdChevronRight, MdKeyboardArrowDown, MdAddBox, MdIndeterminateCheckBox, MdLocationCity, MdStore } from "react-icons/md";
const _ = require('lodash')

import urlSocket from "../../../helpers/urlSocket";
var moment = require('moment')

const icons = {
    check: <MdCheckBox className="rct-icon rct-icon-check text-success" />,
    uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
    halfCheck: (
        <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />
    ),
    expandClose: (
        <MdChevronRight className="" />
    ),
    expandOpen: (
        <MdKeyboardArrowDown className="" />
    ),
    expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
    collapseAll: (
        <MdIndeterminateCheckBox className="" />
    ),
    parentClose: <MdLocationCity className="" />,
    parentOpen: <MdLocationCity className="" />,
    leaf: <MdStore className="" />
}


const HierarchyEndpoints = props => {

    const navigate = useNavigate()

    const [height, setHeight] = useState(window.innerHeight);
    const [position, setPosition] = useState("right");
    const [open, setOpen] = useState(false);
    const [updatePbdAudit, setUpdatePbdAudit] = useState(false)
    const [locationData, setLocationData] = useState([]);
    const [dataloaded, setDataloaded] = useState(false);
    const [expanded, setExpanded] = useState([]);
    const [configData, setConfigData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [publishedAuditData, setPublishedAuditData] = useState(null);
    const [dbInfo, setDbInfo] = useState(null);
    const [endpoints, setEndpoints] = useState([]);
    const [totalAudit, setTotalAudit] = useState(0);
    const [inProgressCount, setInProgressCount] = useState(0);
    const [notStartedCount, setNotStartedCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [submittedCount, setSubmittedCount] = useState(0);
    const [reviewedCount, setReviewedCount] = useState(0);
    const [enableEdit, setEnableEdit] = useState(false);
    const [statusBasedFilteredData, setStatusBasedFilteredData] = useState([]);
    const [dupFilteredData, setDupFilteredData] = useState([]);
    const [checked, setChecked] = useState([])
    const [successDlg, setSuccessDlg] = useState(false)
    const [showWarning, setShowWarning] = useState(false)
    const [submitMessage, setSubmitMessage] = useState(false)
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [epData, setEpData] = useState(null);
    const [confirmButtonText, setConfirmButtonText] = useState("");
    const [dynamicTitle, setDynamicTitle] = useState("");
    const [dynamicDescription, setDynamicDescription] = useState("");
    const [activeStatus, setActiveStatus] = useState("");



    useEffect(() => {

        const getSessionData = async () => {
            const data = JSON.parse(sessionStorage.getItem("authUser"));
            const publishedAuditData = JSON.parse(sessionStorage.getItem("publishedHInfoAuditData"));
            console.log(publishedAuditData, "publishedAuditData");
            setConfigData(data.config_data);
            setUserData(data.user_data);
            setPublishedAuditData(publishedAuditData);
            setLocationData(publishedAuditData?.ep_structure || []);
            setDbInfo(data.db_info);
            console.log("data.db_info", data.db_info)
            getAuditInfo(data.db_info, publishedAuditData, data.user_data, data.config_data);

        };

        getSessionData();
    }, []);

    const getAuditInfo = async (db_info, publishedAuditDatas, user_data, config_data) => {
        setDataloaded(false);

        console.log("db_info", config_data)

        try {
            const response = await urlSocket.post("hreport/getpublishedHierachyauditdata", {
                auditInfo: publishedAuditDatas,
                userInfo: user_data,
                configData: config_data,
                encrypted_db_url: db_info.encrypted_db_url
            });

            console.log(response, 'response');

            if (response.data.response_code === 500) {
                const data = response.data.data;

                const in_progress_count = data.filter(e => e.status === "1").length;
                const not_started_count = data.filter(e => e.status === "0").length;
                const completed_count = data.filter(e => e.status === "2").length;
                const submitted_count = data.filter(e => e.status === "3").length;
                const reviewed_count = data.filter(e => e.status === "7").length;

                setEndpoints(data);
                setTotalAudit(data.length);
                setInProgressCount(in_progress_count);
                setNotStartedCount(not_started_count);
                setCompletedCount(completed_count);
                setSubmittedCount(submitted_count);
                setReviewedCount(reviewed_count);

                console.log(reviewed_count, submitted_count, in_progress_count, not_started_count, 'not_started_count', completed_count);
                filterStatus('All', data);
            }
        } catch (error) {
            console.log(error, 'error');
        }
    };


    const closeDrawer = () => {
        setOpen(false);
        setEnableEdit(false);
    };

    const onDrawerClose = () => {
        setOpen(false);
        setEnableEdit(false);
        getAuditInfo();
    };


    const activeInactive = (item) => {
        if (item.active === "0") {
            setConfirmAlert(true);
            setEpData(item);
            setConfirmButtonText("Yes, make it active!");
            setDynamicTitle("Active");
            setDynamicDescription("This end point is activated");
            setActiveStatus("1");
        } else {
            setConfirmAlert(true);
            setEpData(item);
            setConfirmButtonText("Yes, make it inactive!");
            setDynamicTitle("Inactive");
            setDynamicDescription("This end point is inactivated");
            setActiveStatus("0");
        }
    };



    const filterStatus = (data, data2) => {
        console.log(data, 'data');
        let filteredData = [];

        if (data === "Not started") {
            filteredData = data2.filter(e => e.status === "0");
        } else if (data === "In progress") {
            filteredData = data2.filter(e => e.status === "1");
        } else if (data === "Completed") {
            filteredData = data2.filter(e => e.status === "2");
        } else if (data === "Submitted") {
            filteredData = data2.filter(e => e.status === "3");
        } else if (data === "Reviewed") {
            filteredData = data2.filter(e => e.status === "7");
        } else if (data === "All") {
            filteredData = data2;   ``
        }
        console.log('filteredData', filteredData)   
        setStatusBasedFilteredData(filteredData);
        setDupFilteredData(filteredData);


        setDataloaded(true);



    };


    const showConfirmAlert = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to do this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            confirmButtonColor: "#28a745", 
            cancelButtonColor: "#dc3545",
        }).then((result) => {
            if (result.isConfirmed) {
                setSuccessDlg(true);
                setDynamicTitle(dynamicTitle);
                setDynamicDescription(dynamicDescription);
                updateEndpoint();
            }
        });
    };


    const showSuccessAlert = () => {
        Swal.fire({
            title: dynamicTitle,
            text: dynamicDescription,
            icon: "success",
            confirmButtonText: "OK",
        }).then(() => {
            setSuccessDlg(false); 
        });
    };


    const showWarningAlert = () => {
        Swal.fire({
            title: "Message",
            text: submitMessage,
            icon: "warning",
            confirmButtonText: "OK",
        }).then(() => {
            setShowWarning(false); 
        });
    };

    const getNodeEndpoints = (data) => {
        console.log(data, "data");

        if (publishedAuditData.method_selected === "1") {
            const getNodeKey = ({ treeIndex }) => treeIndex;
            const flatData = getFlatDataFromTree({
                treeData: [data],
                getNodeKey,
                ignoreCollapsed: false,
            });

            const explicitData = _.filter(flatData, (item) => item);
            console.log(_.map(explicitData, "node"), "explicitData", publishedAuditData);

            const result = _.filter(
                _.map(explicitData, "node"),
                { ep_level_value: publishedAuditData.eplevel_value }
            );
            console.log(result, "result");

            const epids = _.map(result, "node_id");
            const filteredData = _.filter(endpoints, (item) => epids.includes(String(item.ref_id)));
            console.log('filtered_info', filteredData)
            setStatusBasedFilteredData(filteredData);
        } else {
            console.log(publishedAuditData, "method 2");

            const filteredInfo = _.filter(dupFilteredData, { name: data.label });
            console.log(filteredInfo, "filtered_info");

            setStatusBasedFilteredData(filteredInfo);
        }
    };


    const showEndpointReport = (data) => {
        if (data.status < "3") {
            setShowWarning(true);
            setSubmitMessage("Audit is not submitted, you cannot view report");
        } else {
            sessionStorage.removeItem("endpointInfo");
            sessionStorage.setItem("endpointInfo", JSON.stringify(data));
            navigate("/hcollapse");
        }
    };

    const handleEndpointExpanded = (expanded) => {
        setExpanded(expanded);
        setPublishedAuditData((prevData) => ({
            ...prevData,
            ep_structure: locationData,
            ep_expanded: expanded,
        }));
    };


    const updateEndpoint = async () => {
        const updatedEpData = { ...epData, active: activeStatus };

        try {
            const response = await urlSocket.post("webpbdadtdta/ainendpoints", {
                encrypted_db_url: dbInfo.encrypted_db_url,
                userInfo: userData,
                endpointInfo: updatedEpData,
                auditInfo: publishedAuditData,
            });

            if (response.data.response_code === 500) {
                getAuditInfo();
            }
        } catch (error) {
            console.log("catch error", error);
        }
    };


    var columns 

    if (endpoints) {

        if (publishedAuditData?.enable_review === true) {
            columns = useMemo(() => [
                {
                    accessor: 'name',
                    Header: 'Name',
                    filterable: true,
                    Cell: (cellProps) => {
                        var item = cellProps.row.original
                        return (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className={item.active == "1" ? "font-size-14 text-dark fw-bold" : "font-size-14 text-black-50"} style={{ marginBottom: 5 }}>
                                        <i
                                            className={
                                                item.status === '0'
                                                    ? "mdi mdi-circle text-secondary font-size-10" :
                                                    item.status === '1' ?
                                                        "mdi mdi-circle text-warning font-size-10" :
                                                        item.status === '2' ?
                                                            "mdi mdi-circle text-success font-size-10" :
                                                            item.status === '3' ?
                                                                "mdi mdi-circle text-info font-size-10" : "mdi mdi-circle text-primary font-size-10"
                                            }
                                        />{" "} {item.name}
                                    </div>
                                    <div>
                                        <span className="font-size-10">Audit started on - {item.audit_started_on === null ? "-- / -- / --" : moment(item.audit_started_on).format("DD/MM/YYY")}</span> <br />
                                        <span className="font-size-10">Audit submitted on - {item.audit_submitted_on === null ? "-- / -- / --" : moment(item.audit_submitted_on).format("DD/MM/YYY")}</span> <br />
                                        <span className="font-size-10">Audit reviewed on - {item.audit_reviewed_on === null ? "-- / -- / --" : moment(item.audit_reviewed_on).format("DD/MM/YYY")}</span> <br />
                                    </div>
                                </div>
                            </>
                        )
                    }
                },
                {
                    accessor: 'audit_pdb_total_cp',
                    Header: 'Check points',
                    Cell: (cellProps) => {
                        var item = cellProps.row.original
                        return (
                            <>
                                <span
                                    className={`badge ${item.active !== "1" ? "badge-soft-secondary" : "badge-soft-success"} font-size-11`}
                                    style={{ borderRadius: "50%", padding: "0.5em 0.75em", display: "inline-block", textAlign: "center" }}>
                                    {item.audit_pdb_total_cp}
                                </span>
                            </>
                        )
                    }
                },
                {
                    accessor: 'audit_pbd_ends_on',
                    Header: 'Ends on',
                    Cell: (cellProps) => {
                        var item = cellProps.row.original
                        return (
                            <>
                                <span className={item.active == "1" ? "font-size-14 text-dark" : "font-size-14 text-black-50"}>{moment(item.audit_pbd_ends_on).format("DD/MM/YYYY")}</span>
                            </>
                        )
                    }
                },
                {
                    accessor: 'audit_pbd_users',
                    Header: 'Audit assigned to',
                    Cell: (cellProps) => {
                        var item = cellProps.row.original

                        var getUser = _.find(item.audit_pbd_users, { audit_type: "1" })
                        return (
                            <>
                                <div>
                                    <span className={item.active == "1" ? null : "font-size-11 text-black-50"}>{getUser.name} ({getUser.user_code})</span><br /><span className={item.active == "1" ? "font-size-10 text-primary" : "font-size-10 text-black-50"}>{getUser.designation}</span>
                                </div>
                            </>
                        )
                    }
                },
                {
                    accessor: 'audit_pbd_users_',
                    Header: 'Review assigned to',
                    hidden: publishedAuditData.enable_review === false ? false : true,
                    Cell: (cellProps) => {
                        var item = cellProps.row.original
                        console.log(item, 'item')
                        var getUser = _.find(item.audit_pbd_users, { audit_type: "2" })
                        console.log(getUser, 'getUser')
                        return (
                            <>
                                <div>
                                    <span className={item.active == "1" ? null : "font-size-14 text-black-50"}>{getUser?.name} ({getUser?.user_code})</span><br /><span className={item.active == "1" ? "font-size-10 text-primary" : "font-size-10 text-black-50"}>{getUser?.designation}</span>
                                </div>
                            </>
                        )
                    }
                },
                {
                    accessor: 'status',
                    Header: 'Status',
                    Cell: (cellProps) => {
                        var item = cellProps.row.original
                        return (
                            <>
                                <span className={item.status === "0" ? "badge badge-soft-secondary font-size-11 m-1" :
                                    item.status === "1" ? "badge badge-soft-warning font-size-11 m-1" : item.status === "2" ? "badge badge-soft-success font-size-11 m-1" : item.status === "3" ? "badge badge-soft-info font-size-11 m-1" : "badge badge-soft-primary font-size-11 m-1"}
                                >
                                    {item.status === "0" ? "Not started" : item.status === "1" ? "In progress" : item.status === "2" ? "Completed" : item.status === "3" ? "Submitted" : "Reviewed"}
                                </span>
                            </>
                        )
                    }
                },
                {
                    accessor: "menu",
                    Header: "Action",
                    Cell: (cellProps) => {
                        var item = cellProps.row.original
                        return (
                            <div className="d-flex gap-3" style={{ display: 'flex', alignContent: 'center' }}>
                                <div className="d-flex gap-1">
                                    <Link className={item.active == "1" ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"} to="#" onClick={() => { showEndpointReport(item) }}>Report</Link>
                                </div>
                            </div>
                        )
                    },
                },
            ], [])
        }
        else {
            columns = useMemo(() => [
                {
                    accessor: 'name',
                    Header: 'Name',
                    filterable: true,
                    Cell: (cellProps) => {
                        var item = cellProps.row.original
                        return (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className={item.active == "1" ? "font-size-12 text-dark fw-bold" : "font-size-12 text-black-50"} style={{ marginBottom: 5 }}>
                                        <i
                                            className={
                                                item.status === '0'
                                                    ? "mdi mdi-circle text-secondary font-size-10" :
                                                    item.status === '1' ?
                                                        "mdi mdi-circle text-warning font-size-10" :
                                                        item.status === '2' ?
                                                            "mdi mdi-circle text-success font-size-10" :
                                                            item.status === '3' ?
                                                                "mdi mdi-circle text-info font-size-10" : "mdi mdi-circle text-primary font-size-10"
                                            }
                                        />{" "} {item.name}
                                    </div>
                                    <div>
                                        <span className="font-size-10">Audit started on - {item.audit_started_on === null ? "-- / -- / --" : moment(item.audit_started_on).format("DD/MM/YYY")}</span> <br />
                                        <span className="font-size-10">Audit submitted on - {item.audit_submitted_on === null ? "-- / -- / --" : moment(item.audit_submitted_on).format("DD/MM/YYY")}</span> <br />
                                        <span className="font-size-10">Audit reviewed on - {item.audit_reviewed_on === null ? "-- / -- / --" : moment(item.audit_reviewed_on).format("DD/MM/YYY")}</span> <br />
                                    </div>
                                </div>
                            </>
                        )
                    }
                },
                {
                    accessor: 'h_node_type',
                    Header: 'Type',
                    filterable: true,
                    Cell: (cellProps) => {
                        var item = cellProps.row.original
                        console.log(item, 'item')
                        return (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className={"font-size-11 text-dark"} style={{ marginBottom: 5 }}>
                                        {item.h_node_type?.name ? item.h_node_type?.name : ""}
                                    </div>
                                </div>
                            </>
                        )
                    }
                },
                {
                    accessor: 'audit_pdb_total_cp',
                    Header: 'Check points',
                    Cell: (cellProps) => {
                        var item = cellProps.row.original
                        return (
                            <>
                                <span
                                    className={`badge ${item.active !== "1" ? "badge-soft-secondary" : "badge-soft-success"} font-size-11`}
                                    style={{ borderRadius: "50%", padding: "0.5em 0.75em", display: "inline-block", textAlign: "center" }}>
                                    {item.audit_pdb_total_cp}
                                </span>
                            </>
                        )
                    }
                },
                {
                    accessor: 'audit_pbd_ends_on',
                    Header: 'Ends on',
                    Cell: (cellProps) => {
                        var item = cellProps.row.original
                        return (
                            <div>
                                <span className={item.active == "1" ? "font-size-11 text-dark" : "font-size-11 text-black-50"}>{moment(item.audit_pbd_ends_on).format("DD/MM/YYYY")}</span>
                            </div>
                        )
                    }
                },
                {
                    accessor: 'audit_pbd_users',
                    Header: 'Audit assigned to',
                    Cell: (cellProps) => {
                        var item = cellProps.row.original

                        var getUser = _.find(item.audit_pbd_users, { audit_type: "1" })
                        return (
                            <>
                                <div className="font-size-11">
                                    <span className={item.active == "1" ? null : "font-size-11 text-black-50"}>{getUser.name} ({getUser.user_code})</span><br /><span className={item.active == "1" ? "font-size-11 text-primary" : "font-size-11 text-black-50"}>{getUser.designation}</span>
                                </div>
                            </>
                        )
                    }
                },

                {
                    accessor: 'status',
                    Header: 'Status',
                    Cell: (cellProps) => {
                        var item = cellProps.row.original
                        return (
                            <>
                                <span className={item.status === "0" ? "badge badge-soft-secondary font-size-11 m-1" :
                                    item.status === "1" ? "badge badge-soft-warning font-size-11 m-1" : item.status === "2" ? "badge badge-soft-success font-size-11 m-1" : item.status === "3" ? "badge badge-soft-info font-size-11 m-1" : "badge badge-soft-primary font-size-11 m-1"}
                                >
                                    {item.status === "0" ? "Not started" : item.status === "1" ? "In progress" : item.status === "2" ? "Completed" : item.status === "3" ? "Submitted" : "Reviewed"}
                                </span>
                            </>
                        )
                    }
                },
                {
                    accessor: "menu",

                    Header: "Action",
                    Cell: (cellProps) => {
                        var item = cellProps.row.original
                        return (
                            <div className="d-flex gap-1" style={{ display: 'flex', alignContent: 'center' }}>
                                {
                                    item.status >= "3" &&
                                    <Button id={`delete-${item._id}`} className={item.active == "1" ? "btn btn-soft-primary btn-sm" : "btn btn-soft-secondary btn-sm"}
                                        onClick={() => { showEndpointReport(item) }}>
                                        Report
                                    </Button>
                                }

                                {
                                    item.status !== "0" &&
                                    <>
                                        <Button id={`view-${item._id}`} className="btn btn-sm btn-soft-primary"
                                            onClick={() => { sessionStorage.setItem("endpointData", JSON.stringify(item)); navigate("/hcheckp") }}
                                        >
                                            <i className="bx bx-right-arrow-alt"></i>
                                        </Button>
                                        <UncontrolledTooltip placement="top" target={`view-${item._id}`}>
                                            View Details
                                        </UncontrolledTooltip>
                                    </>
                                }

                            </div>
                        )
                    },
                },
            ], []);
        }
    }

    console.log('dataloaded', dataloaded)

    if (dataloaded) {
        return (


            <React.Fragment>

                <div className="page-content">
                    <MetaTags>
                        <title>Published Audit | AuditVista</title>
                    </MetaTags>

                    <Breadcrumbs
                        title={"Published Audit"}
                        isBackButtonEnable={true}
                        gotoBack={() => { navigate(`${publishedAuditData.repeat_mode_config.mode_id === "0" ? "/hreports" : "/hdaily-audits"}`) }}
                        breadcrumbItem="Template"
                    />

                    <Container fluid>


                        <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
                            <div style={{
                                width: '240px',
                                minWidth: '240px',

                                boxSizing: 'border-box',
                                borderRight: '1px solid #ccc'
                            }}>
                                <Card className="h-100">
                                    <CardBody>
                                        <CheckboxTree
                                            nodes={locationData}
                                            checked={checked}
                                            expanded={(expanded)}
                                            onClick={(nodes) => getNodeEndpoints(nodes)}
                                            onExpand={(expanded) => handleEndpointExpanded(expanded)}
                                            icons={icons}
                                            showNodeIcon={false}
                                            showExpandAll
                                        />
                                    </CardBody>
                                </Card>
                            </div>

                            <div style={{
                                flex: 1,
                                boxSizing: 'border-box',
                                overflowY: 'auto'
                            }}>
                                <Card className="h-100">
                                    <CardBody>
                                        {console.log('statusBasedFilteredData', statusBasedFilteredData, columns)}
                                        <TableContainer
                                            columns={columns}
                                            data={statusBasedFilteredData}
                                            isGlobalFilter={true}
                                            isAddOptions={false}
                                            isJobListGlobalFilter={false}
                                            customPageSize={10}
                                            isPagination={true}
                                            tableClass="align-middle table-nowrap table-check"
                                            theadClass="table-light"
                                            pagination="pagination pagination-rounded justify-content-end my-2"
                                            total_audit={totalAudit}
                                            not_started_count={notStartedCount}
                                            in_progress_count={inProgressCount}
                                            completed_count={completedCount}
                                            submitted_count={submittedCount}
                                            reviewed_count={reviewedCount}

                                            filterStatus={(data) => filterStatus(data,endpoints)}
                                            publishedAuditData={publishedAuditData}
                                            onClickChangeAuditEndDate={() => { setUpdatePbdAudit(true); setOpen(true) }}

                                        />
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </Container>
                </div>


                {confirmAlert && showConfirmAlert()}
                {successDlg && showSuccessAlert()}
                {showWarning && showWarningAlert()}




            </React.Fragment>
        )
    } else { return null }




}


export default HierarchyEndpoints
