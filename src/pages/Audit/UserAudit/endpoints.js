import React, { useState, useEffect, useMemo } from "react";
import MetaTags from 'react-meta-tags';
import { Row, Col, Button, Card, CardBody, Container, Spinner } from "reactstrap";
import moment from 'moment';
import Swal from "sweetalert2";
import TableContainer from "../../../common/TableContainer";
import QRScanner from "./Components/QRScanner";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import _ from 'lodash';
import urlSocket from "../../../helpers/urlSocket";

const statusColor = ["#555657", "#FDA705", "#31D9AC", "#0DE0E8", "#0DB0F9", "#F76518", "#FDA705", "#0D68F9"];
const statusText = ["Not started", "In progress", "Completed", "Submitted", "Review In progress", "Retake", "Retake In progress", "Reviewed"];

const Endpoints = () => {
    const navigate = useNavigate();

    // Separate state variables
    const [dataloaded, setDataloaded] = useState(false);
    const [searchFiles, setSearchFiles] = useState([]);
    const [dupSearchFiles, setDupSearchFiles] = useState([]);
    const [tempSearchFiles, setTempSearchFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [enableScanner, setEnableScanner] = useState(false);
    const [configData, setConfigData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [dbInfo, setDbInfo] = useState(null);
    const [auditData, setAuditData] = useState(null);
    const [dupendpointData, setDupendpointData] = useState([]);
    const [endpointData, setEndpointData] = useState([]);
    const [showWarning, setShowWarning] = useState(false);
    const [message, setMessage] = useState('');



    useEffect(() => {
        getSessionData();
    }, [])
    

    const getSessionData = async () => {
        const data = JSON.parse(sessionStorage.getItem("authUser"));
        const db_info = JSON.parse(sessionStorage.getItem("db_info"));
        const auditData = JSON.parse(sessionStorage.getItem("auditData"));

        setConfigData(data.config_data);
        setUserData(data.user_data);
        setDbInfo(db_info);
        setAuditData(auditData);
        loadEndpoints(data, db_info, auditData);
    };

    const loadEndpoints = (userData, db_info, auditData) => {
        try {
            urlSocket.post("webpbdadtdta/getendpoints", {
                auditInfo: auditData,
                userInfo: {
                    _id: userData.user_data._id,
                    encrypted_db_url: db_info.encrypted_db_url,
                    // company_id: userData.user_data.company_id
                }
            })
                .then(response => {
                    setDupendpointData(response.data.data);
                    setEndpointData(response.data.data);
                    setSearchFiles(response.data.data);
                    setDupSearchFiles(response.data.data);
                    setTempSearchFiles(response.data.data);
                    setDataloaded(true);
                    pageClick(1);
                });
        } catch (error) {
            console.log("catch error", error);
        }
    };

    const accessLocation = (mode) => {
        if (mode === "1") {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const location_data = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                    navigate({
                        pathname: '/enpcpts',
                        state: { data: location_data },
                    });
                },
                error => {
                    if (error.code === 1) {
                        Swal.fire({
                            icon: 'info',
                            title: '<span style="color: #3085d6; font-size: 24px;">You need to enable Location to conduct this audit</span>',
                            html: `<span style="font-size: 18px;">To enable location access, please go to your browser settings and grant permission for <strong>https://${sessionStorage.getItem('short_name')}.auditvista.com</strong> to access your location.</span>`,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK',
                            customClass: {
                                popup: 'swal-popup',
                                title: 'swal-title',
                                htmlContainer: 'swal-html',
                                confirmButton: 'swal-button'
                            }
                        });
                    }
                }
            );
        } else {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const location_data = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                    navigate({
                        pathname: '/rewenpcpts',
                        state: { data: location_data },
                    });
                },
                error => {
                    if (error.code === 1) {
                        Swal.fire({
                            icon: 'info',
                            title: '<span style="color: #3085d6; font-size: 24px;">You need to enable Location to conduct this review</span>',
                            html: `<span style="font-size: 18px;">To enable location access, please go to your browser settings and grant permission for <strong>https://${sessionStorage.getItem('short_name')}.auditvista.com</strong> to access your location.</span>`,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK',
                            customClass: {
                                popup: 'swal-popup',
                                title: 'swal-title',
                                htmlContainer: 'swal-html',
                                confirmButton: 'swal-button'
                            }
                        });
                    }
                }
            );
        }
    };

    const navigateTorprt = (endpoint_data) => {
        sessionStorage.removeItem("endpointInfo");
        sessionStorage.setItem("endpointInfo", JSON.stringify(endpoint_data));
        navigate("/chkpntrprt");
        sessionStorage.setItem("redirect", 1);
    };

    // const navigateTo = (endpoint_data) => {
    //     sessionStorage.removeItem("endpointData");
    //     sessionStorage.setItem("endpointData", JSON.stringify(endpoint_data));
    //     if (endpoint_data.audit_config?.audit_qr_enable || endpoint_data.audit_config?.review_qr_enable) {
    //         if (endpoint_data.audit_status_id === "0" || endpoint_data.audit_status_id === "1" || endpoint_data.audit_status_id === "2" || endpoint_data.audit_status_id === "5") {              
    //             setEnableScanner(true);
    //         } else {
    //             navigate("/viewcpts");
    //             setEnableScanner(false);
    //         }
    //     } else {
    //         if (endpoint_data.audit_pbd_users.audit_type === "1") {
    //             if (endpoint_data.audit_status_id === "0" || endpoint_data.audit_status_id === "1" || endpoint_data.audit_status_id === "2" || endpoint_data.audit_status_id === "5") {
    //                 if (endpoint_data.audit_config?.audit_coords_enable) {
    //                     accessLocation("1");
    //                 } else {
    //                     navigate("/enpcpts");
    //                 }
    //             } else {
    //                 navigate("/viewcpts");
    //             }
    //         } else if (endpoint_data.audit_pbd_users.audit_type === "2") {
    //             if (endpoint_data.audit_status_id === "3" || endpoint_data.audit_status_id === "4") {
    //                 if (endpoint_data.audit_config?.review_coords_enable) {
    //                     accessLocation("2");
    //                 } else {
    //                     navigate("/rewenpcpts");
    //                 }
    //             } else {
    //                 navigate("/viewcpts");
    //             }
    //         }
    //     }
    // };


    const navigateTo = async(endpoint_data) => {
        console.log('endpoint_data :>> ', endpoint_data);
        sessionStorage.removeItem("endpointData");
        sessionStorage.setItem("endpointData", JSON.stringify(endpoint_data));
        if (endpoint_data.audit_config?.audit_qr_enable || endpoint_data.audit_config?.review_qr_enable) {
            if (endpoint_data.audit_status_id === "0" || endpoint_data.audit_status_id === "1" || endpoint_data.audit_status_id === "2" || endpoint_data.audit_status_id === "5") {              
                setEnableScanner(true);
            } else {
                navigate("/viewcpts");
                setEnableScanner(false);
            }
        } else {
            if (endpoint_data.audit_pbd_users.audit_type === "1") {
                if (endpoint_data.audit_status_id === "0" || endpoint_data.audit_status_id === "1" || endpoint_data.audit_status_id === "2" || endpoint_data.audit_status_id === "5") {
                    if (endpoint_data.audit_config?.audit_coords_enable) {
                        accessLocation("1");
                        const response = await onUpdateTakenBy(endpoint_data)
                    } else {
                        const response = await onUpdateTakenBy(endpoint_data)
                        console.log('response :>> ', response);
                        if(response?.status === 200){
                            navigate("/enpcpts");
                        }
                    }
                } else {
                    navigate("/viewcpts");
                }
            } else if (endpoint_data.audit_pbd_users.audit_type === "2") {
                if (endpoint_data.audit_status_id === "3" || endpoint_data.audit_status_id === "4") {
                    if (endpoint_data.audit_config?.review_coords_enable) {
                        accessLocation("2");
                          const response = await onUpdateTakenByReview(endpoint_data)
                    } else {
                        // navigate("/rewenpcpts");
                          const response = await onUpdateTakenByReview(endpoint_data)
                        console.log('response :>> ', response);
                        if(response?.status === 200){
                            navigate("/rewenpcpts");
                        }
                    }
                } else {
                    navigate("/viewcpts");
                }
            }
        }
    };


     const onUpdateTakenBy = async (endpoint_data) => {
        const data = JSON.parse(sessionStorage.getItem("authUser"));
        const authUser = data.user_data;
        const db_info = JSON.parse(sessionStorage.getItem("db_info"));
        const takenBy = endpoint_data?.taken?.audited_by;
        const currentUserId = authUser._id;
        if (takenBy && takenBy !== currentUserId) {
            Swal.fire({
                icon: 'warning',
                title: 'Audit in Progress',
                text: 'Another user is currently taking this audit.',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            console.log('API :>> ');
            const response = await urlSocket.post("webpbdadtdta/update-taken-by", {
                location_id: endpoint_data._id,
                userInfo: {
                    _id: authUser._id,
                    encrypted_db_url: db_info.encrypted_db_url,
                    taken: {
                        audited_by: authUser._id,
                        auditor_name : authUser.fullname,
                        audit_taken_on : new Date(),
                        // reviewed_by: null,
                    },
                },
            });
            return response;
        } catch (error) {
            console.error("Error fetching endpoint info:", error);
            throw error;
        }
    };


      const onUpdateTakenByReview = async (endpoint_data) => {
        const data = JSON.parse(sessionStorage.getItem("authUser"));
        const authUser = data.user_data;
        const db_info = JSON.parse(sessionStorage.getItem("db_info"));
        const takenBy = endpoint_data?.taken?.reviewed_by;
        const currentUserId = authUser._id;
        if (takenBy && takenBy !== currentUserId) {
            Swal.fire({
                icon: 'warning',
                title: 'Audit in Progress',
                text: 'Another user is currently taking this audit.',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            console.log('API :>> ');
            const response = await urlSocket.post("webpbdadtdta/update-taken-by", {
                location_id: endpoint_data._id,
                userInfo: {
                    _id: authUser._id,
                    encrypted_db_url: db_info.encrypted_db_url,
                    taken: {
                        reviewed_by: authUser._id,
                        reviewer_name: authUser.fullname,
                        review_taken_on: new Date(),
                    },
                },
            });
            return response;
        } catch (error) {
            console.error("Error fetching endpoint info:", error);
            throw error;
        }
    };




    const getAuditStatus = (data) => {
        const endDate = new Date(data.audit_pbd_ends_on);
        const today = new Date();
        return endDate < today;
    };

    const pageClick = (page) => {
        setCurrentPage(page);
        paginationProcess(page);
    };

    const paginationProcess = (page) => {
        const result = searchFiles.slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage);
        if (result.length > 0) {
            setEndpointData(result);
        } else {
            setEndpointData(searchFiles);
        }
    };

    const getFuzzySearch = (search_files) => {
        setSearchFiles(search_files);
        setDupSearchFiles(tempSearchFiles);
        pageClick(currentPage);
    };

    const hasCodeColumn = dupendpointData.some((item) => item.code !== null);

    const columns = useMemo(() => [
        {
            accessor: 'loc_name',
            Header: 'Location / Assets',
            filterable: true,
            Cell: (cellProps) => {
                const item = cellProps.row.original;
                return (
                    <div className={item.audit_pbd_users.audit_type === "1" ? "fw-bold font-size-12" : "fw-bold font-size-12"}>
                        {item.loc_name}
                    </div>
                );
            }
        },
        ...(hasCodeColumn
            ? [
                {
                    accessor: 'code',
                    Header: 'Code',
                    filterable: true,
                    Cell: (cellProps) => {
                        const item = cellProps.row.original;
                        return (
                            <div className="font-size-11">{item.code}</div>
                        );
                    },
                },
            ]
            : []),
        {
            accessor: '',
            Header: 'Status',
            disableFilters: true,
            Cell: (cellProps) => {
                const item = cellProps.row.original;
                return (
                    <div
                        style={{
                            backgroundColor: statusColor[Number(item.audit_status_id)],
                            color: 'white',
                            padding: '0.4em 0.8em',
                            fontSize: '10px',
                            fontWeight: '500',
                            display: 'inline-block',
                            textAlign: 'center',
                            margin: '0.2em'
                        }}
                        className="badge"
                    >
                        {statusText[Number(item.audit_status_id)]}
                    </div>
                );
            }
        },
        {
            accessor: 'audit_started_on',
            Header: 'Started on',
            disableFilters: true,
            Cell: (cellProps) => {
                const item = cellProps.row.original;
                return (
                    <div className='font-size-11'>
                        {item.audit_started_on === null ? "-- / -- / --" : moment(item.audit_started_on).format("DD-MMM-YYYY")}
                    </div>
                );
            }
        },
        {
            accessor: 'audit_submitted_on',
            Header: 'Submitted on',
            disableFilters: true,
            Cell: (cellProps) => {
                const item = cellProps.row.original;
                return (
                    <div className="font-size-11">
                        {item.audit_submitted_on === null ? "-- / -- / --" : moment(item.audit_submitted_on).format("DD-MMM-YYYY")}
                    </div>
                );
            }
        },
        {
            accessor: 'audit_score',
            Header: 'Audit Score',
            disableFilters: true,
            Cell: (cellProps) => {
                const item = cellProps.row.original;
                if (item.audit_score_preview) {
                    return (
                        <div className='font-size-11'>
                            <label>{item.audit_score.$numberDecimal == undefined ? parseFloat(item.audit_score).toFixed(2) : parseFloat(item.audit_score.$numberDecimal).toFixed(2)}</label>
                        </div>
                    );
                } else {
                    return (
                        <label style={{ fontStyle: "italic", color: "#ff0000" }} className="text-danger font-size-11">Audit score preview not applicable</label>
                    );
                }
            }
        },
        {
            accessor: 'review_score',
            Header: 'Review Score',
            disableFilters: true,
            Cell: (cellProps) => {
                const item = cellProps.row.original;
                if (item.review_score_preview) {
                    return (
                        <div className='font-size-11'>
                            <label>{item.review_score.$numberDecimal == undefined ? parseFloat(item.review_score).toFixed(2) : item.review_score.$numberDecimal}</label>
                        </div>
                    );
                } else {
                    return (
                        <label style={{ fontStyle: "italic", color: "#ff0000" }} className="text-danger font-size-11">Review score preview not applicable</label>
                    );
                }
            }
        },
        {
            accessor: 'status',
            Header: 'Audit Status',
            disableFilters: true,
            Cell: (cellProps) => {
                const item = cellProps.row.original;
                const audit_status = getAuditStatus(item);
                return (
                    <div className={`font-size-11 badge badge-soft-${audit_status ? 'danger' : 'success'}`}>
                        {audit_status ? "Expired" : "Active"}
                    </div>
                );
            }
        },
        {
            accessor: "menu",
            disableFilters: true,
            Header: "View Audits",
            Cell: (cellProps) => {
                const item = cellProps.row.original;
                const audit_status = getAuditStatus(item);
                console.log(item,'item')
                return (
                    <div className="d-flex gap-3" style={{ display: 'flex', alignContent: 'center' }}>
                        <div className="d-flex gap-1">
                            {item.audit_pbd_users.audit_type === "2" &&
                                (item.audit_status_id === "0" || item.audit_status_id === "1" || item.audit_status_id === "2" || item.audit_status_id === "6") ? (
                                <label style={{ fontSize: 12, fontStyle: "italic", color: "#ff0000" }}>Not allowed to review till audit is completed</label>
                            ) : item.audit_pbd_users.audit_type === "2" && (item.audit_status_id === "5" || item.audit_status_id === "7") ? (
                                <Button className="btn btn-sm btn-soft-primary"  onClick={() => navigateTo(item)}>
                                    View <i className="bx bx-right-arrow-alt font-size-14 ms-1"></i>
                                </Button>
                            ) : item.audit_pbd_users.audit_type === "2" ? (
                                <Button className="btn btn-sm btn-soft-success"  onClick={() => navigateTo(item)}>Review</Button>
                            ) : null}
                            {item.audit_pbd_users.audit_type === "3" &&
                                (item.audit_status_id === "0" || item.audit_status_id === "1" || item.audit_status_id === "2" || item.audit_status_id === "6") ? (
                                <label style={{ fontSize: 12, fontStyle: "italic", color: "#ff0000" }}>Not allowed to view till audit is completed</label>
                            ) : null}
                            {item.audit_status_id >= "3" && (
                                <Button className="btn btn-sm btn-soft-primary" onClick={() => navigateTorprt(item)} >Report</Button>
                            )}
                            {item.audit_pbd_users.audit_type === "1" &&
                                (item.audit_status_id === "3" || item.audit_status_id === "4" || item.audit_status_id === "7") ? (
                                <Button className="btn btn-sm btn-soft-primary d-flex align-items-center"  onClick={() => navigateTo(item)}>
                                    View <i className="bx bx-right-arrow-alt font-size-14 ms-1"></i>
                                </Button>
                            ) : audit_status ? (
                                <label style={{ fontSize: 12, fontStyle: "italic", color: "#ff0000" }} className="text-danger">Expired</label>
                            ) : item.audit_pbd_users.audit_type === "1" && item.audit_status_id === "5" ? (
                                <Button className="btn btn-sm btn-soft-danger"  onClick={() => navigateTo(item)}>Retake</Button>
                            ) : item.audit_pbd_users.audit_type === "1" ? (
                                <Button className="btn btn-sm btn-soft-primary" onClick={() => navigateTo(item)}>Start Audit</Button>
                            ) : null}
                        </div>
                    </div>
                );
            },
        },
    ], [dupendpointData, auditData])

  
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Audit | AuditVista</title>
                </MetaTags>
                <Breadcrumbs
                    title="Audit Lists"
                    isBackButtonEnable={true}
                    gotoBack={() => (!enableScanner ? navigate("/usradt") : setEnableScanner(false))}
                />
                <Container fluid>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    {dataloaded ? (
                                        !enableScanner ? (
                                            <TableContainer
                                                columns={columns}
                                                data={dupendpointData}
                                                isGlobalFilter={true}
                                                isAddOptions={false}
                                                isJobListGlobalFilter={false}
                                                customPageSize={10}
                                                style={{ width: "100%" }}
                                                isPagination={true}
                                                filterable={false}
                                                tableClass="align-middle table-nowrap"
                                                theadClass="table-light"
                                                pagination="pagination pagination-rounded justify-content-end mb-2"
                                                audit_pbd_name={auditData?.audit_pbd_name}
                                            />
                                        ) : (
                                            <QRScanner />
                                        )
                                    ) : (
                                        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
                                            <div>Loading...</div>
                                            <Spinner color="primary" />
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
    
                    {/* {showWarning && (
                        <SweetAlert title="Message" warning onConfirm={() => setShowWarning(false)}>
                            {message}
                        </SweetAlert>
                    )} */}
                </Container>
            </div>
        </React.Fragment>
    );
    
};
export default Endpoints;
