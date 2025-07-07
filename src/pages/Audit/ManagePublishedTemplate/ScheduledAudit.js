import React, { Suspense, useMemo } from 'react'
import { useEffect, useState } from 'react'
import urlSocket from '../../../helpers/urlSocket'
import TableContainer from './Components/TableContainer'
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import MetaTags from 'react-meta-tags';
import { Container, Row, Col, Button, Card, CardBody, Modal, ModalHeader, ModalBody, UncontrolledTooltip, Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap";
import { useNavigate } from 'react-router-dom'
import { FaStop, FaRedo } from "react-icons/fa";
import { Popconfirm } from 'antd';
import { useDispatch } from 'react-redux'
import { updateAuditAPI } from 'toolkitStore/Auditvista/ManageAuditSlice'
import UpdateAuditDateUserInfo from './Components/updateAuditDateUserInfo'


const ScheduledAudit = () => {
    const [auditList, setauditList] = useState([])
    const [statusData, setstatusData] = useState([])
       const [open, setOpen] = useState(false)
    const [component,setcomponent] = useState("")
    const [auditInfo,setauditInfo] = useState(null)

    const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
    const history = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        console.log("useEffect")
        var sessionInfo = sessionStorage.getItem("adt_master_id")
        console.log('sessionInfo', sessionInfo)
        if (sessionInfo) {
            // retriveAuditlist(sessionInfo)
            getDateMeta(sessionInfo)
        }
    }, [])


    const getDateMeta = async (sessionInfo) => {
        try {
            var responseData = await urlSocket.post("/webmngpbhtmplt/retrive-scheduled-audit", {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                // adt_master_id: sessionInfo,
                adt_master_id: sessionInfo,
            })
            console.log(responseData.data.data, 'responseData.data.data')
            setauditList(responseData.data.data);

        } catch (error) {
            console.log(error, 'error')
        }
    }


    const dateConvertion = (dateToConvert) => {
        if (dateToConvert != null) {
            var date = typeof (dateToConvert) == "object" ? String(dateToConvert.toISOString()) : String(dateToConvert)
            var convertedDate = date.slice(8, 10) + ' / ' + (date.slice(5, 7)) + ' / ' + date.slice(0, 4);//prints expected format. 
            if (convertedDate == "01 / 01 / 1970") {
                return "-- / -- / --"
            }
            else {
                return convertedDate
            }
        }
        else {
            return "-- / -- / --"
        }
    }



    const convertUTCtoIST = (utcDateString) => {
        const utcDate = new Date(utcDateString);
        const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // 5 hours + 30 minutes in milliseconds
        const istDate = new Date(utcDate.getTime() + istOffset);
        const day = istDate.getUTCDate(); // Use `getUTCDate` to ensure no timezone shift
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[istDate.getUTCMonth()];
        const year = istDate.getUTCFullYear().toString().slice(-2);
        let hours = istDate.getUTCHours(); // Use `getUTCHours` after applying IST offset
        const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
        const period = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12;

        return `${day}/${month}/${year} ${hours}:${minutes}${period}`;
    }



    const updateAuditInfo = async (data, status) => {
        console.log(data, 'dataaa')
        data["schedule_status"] = status
        const responseData = await dispatch(updateAuditAPI(data))
        console.log(responseData, 'responseData')
        if (responseData.status === 200) {
            var sessionInfo = sessionStorage.getItem("adt_master_id")
            console.log('sessionInfo', sessionInfo)
            if (sessionInfo) {
                getDateMeta(sessionInfo)
            }

        }

    }


    const columns = useMemo(() => [

        {
            accessor: 'template_name',
            Header: 'Audit Name',
            filterable: true,
            width: "30%",
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                        <div className="fw-bold font-size-12 text-wrap">
                            {item.template_name}
                        </div>
                    </>
                )
            }
        },
        {
            accessor: 'total_checkpoints',
            Header: 'Check points',
            filterable: true,
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <div className="font-size-11 text-wrap">
                        {/* {item.total_checkpoints} */}
                        <span
                            className={`badge ${item.total_checkpoints === 0 ? "badge-soft-secondary" : "badge-soft-success"} font-size-11`}
                            style={{ borderRadius: "50%", padding: "0.5em 0.75em", display: "inline-block", textAlign: "center" }}>
                            {item.total_checkpoints}
                        </span>
                    </div>
                )
            }
        },
        {
            accessor: 'created_on',
            Header: 'Created on',
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <div className="font-size-11 text-wrap">
                        {dateConvertion(item.created_on)}
                    </div>
                )
            }
        },
        {
            accessor: 'publish_status',
            Header: 'Publish status',
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                        <span className={item.publish_status == "0" ? "badge badge-soft-secondary font-size-11 m-1" :
                            item.publish_status == "1" ? "badge badge-soft-warning font-size-11 m-1" :
                                item.publish_status == "2" ? "badge badge-soft-success font-size-11 m-1" : "badge badge-soft-danger font-size-11 m-1"}
                        >
                            {item.publish_status == "0" ? "Not publish" : item.publish_status == "1" ? "Publish In progress" : item.publish_status == "2" ? "Published" : "Stopped"}
                        </span>
                    </>
                )
            }
        },
        {
            accessor: 'published_on',
            Header: 'Published On / Time',
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <div className="font-size-11 text-wrap">
                        {convertUTCtoIST(item.published_on)}
                    </div>
                )
            }
        },
        {
            accessor: '',
            Header: 'Status',
            disableFilters: true,
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                        <div className="d-flex gap-2 mb-2">
                            <div className={"font-size-11 badge badge-soft-dark bg-none"}>
                                Total: {String(item.total)}
                            </div>
                            <div className={"font-size-11 badge badge-soft-secondary badge"}>
                                Not Started: {String(item.not_started)}
                            </div>
                            <div className={"font-size-11 badge badge-soft-warning badge"}>
                                In-progress: {String(item.in_progress)}
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <div className={"font-size-11 badge badge-soft-success"}>
                                Completed: {String(item.completed)}
                            </div>
                            <div className={"font-size-11 badge badge-soft-info"}>
                                Submitted: {String(item.submitted)}
                            </div>
                            <div className={"font-size-11 badge badge-soft-danger"}>
                                Retake: {String(item.retake)}
                            </div>
                            <div className={"font-size-11 badge badge-soft-primary"}>
                                Reviewed: {String(item.reviewed)}
                            </div>
                        </div>
                        <br />
                        <div>
                            <button type="button" className='btn btn-sm btn-soft-primary' onClick={() => {
                                sessionStorage.removeItem("publishData");
                                sessionStorage.removeItem("EditPublishedData");
                                sessionStorage.removeItem("publishedAuditData");
                                sessionStorage.setItem("publishedAuditData", JSON.stringify(item));
                                history("/adtaltclrprt");
                            }}>
                                View Status
                            </button>
                        </div>
                    </>

                )
            },
        },
        // {
        //     accessor: "menu",
        //     disableFilters: true,
        //     Header: "Action",
        //     Cell: (cellProps) => {
        //         var item = cellProps.row.original
        //         return (
        //             <div className="d-flex gap-2" style={{ display: 'flex', alignContent: 'center' }}>
        //                 <button className='btn btn-sm btn-soft-primary'
        //                     id={`view-detail-btn-${item._id}`} // Unique ID for Tooltip
        //                     onClick={() => {
        //                         if (item.method_selected === "2") {
        //                             sessionStorage.removeItem("publishData");
        //                             sessionStorage.removeItem("EditPublishedData");
        //                             sessionStorage.removeItem("publishedAuditData");
        //                             sessionStorage.setItem("publishedAuditData", JSON.stringify(item));
        //                             history("/hlvlpbdrpt");
        //                         }
        //                         else {
        //                             sessionStorage.removeItem("publishData");
        //                             sessionStorage.removeItem("EditPublishedData");
        //                             sessionStorage.removeItem("publishedAuditData");
        //                             sessionStorage.setItem("publishedAuditData", JSON.stringify(item));
        //                             history("/hlvlpbdrpt");
        //                         }

        //                     }}
        //                 >
        //                     <i className='bx bx-right-arrow-alt font-size-14'></i>
        //                 </button>
        //                 <UncontrolledTooltip placement="top" target={`view-detail-btn-${item._id}`}>
        //                     View Details
        //                 </UncontrolledTooltip>
        //             </div>
        //         )
        //     },
        // },



        {
            accessor: "menu",
            disableFilters: true,
            Header: "Action",
            Cell: (cellProps) => {
                const item = cellProps.row.original;
                const handleViewDetail = () => {
                    sessionStorage.removeItem("publishData");
                    sessionStorage.removeItem("EditPublishedData");
                    sessionStorage.removeItem("publishedAuditData");
                    sessionStorage.setItem("publishedAuditData", JSON.stringify(item));
                    history("/hlvlpbdrpt");
                };

                return (
                    <div className="d-flex gap-1 align-items-center" style={{ cursor: 'pointer' }}>
                        {/* Stop / Restart Button - shown when published */}
                       
                            <>
                                <button
                                    className={`btn btn-sm ${item.schedule_status === "0" ? "btn-soft-danger" : "btn-soft-secondary"}`}
                                    id={`tooltip-schedule-${item._id}`}
                                >
                                    <Popconfirm
                                        placement="leftBottom"
                                        title={`Are you sure to ${item.schedule_status === "0" ? "Stop" : "Restart"}?`}
                                        onConfirm={() => updateAuditInfo(item,item.schedule_status === "0" ? "1" :"0")}
                                    >
                                        {item.schedule_status === "0" ? (
                                            <>
                                                <FaStop className="me-1" /> Stop
                                            </>
                                        ) : (
                                            <>
                                                <FaRedo className="me-1" /> Restart
                                            </>
                                        )}
                                    </Popconfirm>
                                </button>
                                <UncontrolledTooltip placement="top" target={`tooltip-schedule-${item._id}`}>
                                    {item.schedule_status === "0" ? "Stop" : "Restart"}
                                </UncontrolledTooltip>
                            </>

                        {/* Change Audit End Date - only if repeat mode is NOT "0" */}
                        { item.repeat_mode_config?.mode_id !== "0" && (
                            <>
                                <button
                                    className="btn btn-sm btn-soft-primary"
                                    id={`tooltip-change-end-date-${item._id}`}
                                    onClick={() => {
                                        setOpen(true)
                                        setcomponent("end_date")
                                        setauditInfo(item)
                                        sessionStorage.setItem("publishedAuditData", JSON.stringify(item));

                                        //   setauditInfo(item)
                                    }}

                                >
                                    <i className="bx bx-calendar font-size-12" />
                                </button>
                                <UncontrolledTooltip placement="top" target={`tooltip-change-end-date-${item._id}`}>
                                    Change Audit End Date
                                </UncontrolledTooltip>
                            </>
                        )}

                        {/* View Detail Button - always visible */}
                        <button
                            className="btn btn-sm btn-soft-primary"
                            id={`view-detail-btn-${item._id}`}
                            onClick={handleViewDetail}
                        >
                            <i className="bx bx-right-arrow-alt font-size-14"></i>
                        </button>
                        <UncontrolledTooltip placement="top" target={`view-detail-btn-${item._id}`}>
                            View Details
                        </UncontrolledTooltip>
                    </div>
                );
            },
        }
    ], [])




    return (
        <React.Fragment>
            <div className="page-content" >
                <MetaTags>
                    <title>Scheduled Audits | AuditVista</title>
                </MetaTags>
                <Breadcrumbs
                    title='Scheduled Audits'
                    breadcrumbItem="Audits"
                    isBackButtonEnable={true}
                    gotoBack={() => { history('/mngpblhtempt') }} />

                <Container fluid>
                    <Card >
                        <CardBody>
                            <Row >
                                <Col lg="12">
                                    <TableContainer
                                        columns={columns}
                                        data={auditList}
                                        isGlobalFilter={true}
                                        isAddOptions={false}
                                        isJobListGlobalFilter={false}
                                        customPageSize={10}
                                        style={{ width: '100%' }}
                                        isPagination={true}
                                        tableClass="align-middle table-nowrap table-check"
                                        theadClass="table-light"
                                        pagination="pagination pagination-rounded justify-content-end mb-2 my-2"
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <Offcanvas
                        isOpen={open}
                        toggle={() => setOpen(false)}
                        direction="end"
                        style={{ width: '700px' }}
                    >
                        <OffcanvasHeader toggle={() => setOpen(false)}>
                            {open && component === "shift_info" ? `Audit Name: ${auditInfo?.template_name}` : 'Update'}
                        </OffcanvasHeader>
                        <OffcanvasBody>
                            {
                                component === 'end_date' &&
                                <UpdateAuditDateUserInfo
                                    onClose={() => {
                                        setOpen(false)
                                        setcomponent("")
                                       getDateMeta(sessionStorage.getItem("adt_master_id"))
                                    }}
                                    auditInfo={auditInfo}
                                />
                            }
                        </OffcanvasBody>
                    </Offcanvas>
                </Container>

            </div>
        </React.Fragment>
    )
}
export default ScheduledAudit