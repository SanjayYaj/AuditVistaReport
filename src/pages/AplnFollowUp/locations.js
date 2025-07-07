import React, { useState, useEffect, useMemo } from "react";
import MetaTags from "react-meta-tags";
import {
    Row,
    Col,
    Card,
    CardBody,
    Container,
    Spinner,
    Button,
    UncontrolledTooltip
} from "reactstrap";
import TableContainer from "./Components/TableContainer";
import { useDispatch, useSelector } from "react-redux";
import { getAplnAuditLocationData } from "../../toolkitStore/Auditvista/aplnfollowup/aplnflwupslice"
import Breadcrumbs from "./Components/breadCrumb"
import moment from "moment";
import { useNavigate } from "react-router-dom";



const AplnAuditLocations = (props) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { aplnAuditLocationList } = useSelector(state => state.acplnFollowUpSliceReducer)
    const [auditData, setAuditData] = useState(null)


    useEffect(() => {
        const auditData = JSON.parse(sessionStorage.getItem("auditData"));
        setAuditData(auditData)
        dispatch(getAplnAuditLocationData(auditData));

        return () => { };
    }, [dispatch]);

    const navigateToActionPlan = (endpoint_data) => {
        sessionStorage.removeItem("endpointData");
        sessionStorage.setItem("endpointData", JSON.stringify(endpoint_data));
        navigate("/adtactnplns");
    };

    const columns = useMemo(
        () => [
            {
                accessor: 'location_name',
                Header: "Locations",
                filterable: true,
                Cell: (cellProps) => {
                    var item = cellProps.row.original
                    return (
                        <div
                            className="font-size-12 fw-bold"
                            style={{ cursor: "pointer" }}
                            onClick={() => { navigateToActionPlan(item) }}
                        >
                            <span>{item.location_name}</span>
                        </div>
                    )
                }
            },
            {
                accessor: 'code',
                Header: "Last updated on",
                filterable: true,
                Cell: (cellProps) => {
                    var item = cellProps.row.original
                    return (
                        <div className="font-size-11">
                            {item.audit_started_on === null ? "-- / -- / --" : moment(item.updatedAt).format("DD-MMM-YYYY")}
                        </div>
                    )
                }
            },
            {
                accessor: 'total',
                Header: <span className="badge bg-dark text-light font-size-12">Total</span>,
                disableFilters: true,
                bgColor: "bg-dark",
                Cell: (cellProps) => {
                    var item = cellProps.row.original
                    console.log(item, 'item')

                    return (
                        <>
                            {
                                item.task_status.length > 0 &&
                                <span
                                    className={`badge badge-soft-dark font-size-11`}
                                    style={{ borderRadius: "50%", padding: "0.5em 0.75em", display: "inline-block", textAlign: "center" }}>
                                    {item.task_status[0]?.status_info[0]?.count}
                                </span>
                            }

                        </>
                    )
                }
            },
            {
                accessor: 'not_started',
                Header: <span className="badge bg-secondary font-size-12"><i className="fas fa-male  me-2" /> Not Started</span>,
                disableFilters: true,
                bgColor: "bg-secondary",
                Cell: (cellProps) => {
                    var item = cellProps.row.original
                    return (
                        <span
                            className={`badge badge-soft-secondary font-size-11`}
                            style={{ borderRadius: "50%", padding: "0.5em 0.75em", display: "inline-block", textAlign: "center" }}>
                            {item.task_status[0]?.status_info[1]?.count}
                        </span>
                    )
                }
            },
            {
                accessor: 'in_progress',
                Header: <span className="badge bg-warning font-size-12"><i className="fas fa-walking  me-2" /> In Progress</span>,
                disableFilters: true,
                bgColor: "bg-warning",
                Cell: (cellProps) => {
                    var item = cellProps.row.original
                    return (
                        <span
                            className={`badge badge-soft-warning font-size-11`}
                            style={{ borderRadius: "50%", padding: "0.5em 0.75em", display: "inline-block", textAlign: "center" }}>
                            {item.task_status[0]?.status_info[2]?.count}
                        </span>
                    )
                }
            },
            {
                accessor: 'completed',
                Header: <span className="badge bg-primary font-size-12"><i className="fas fa-flag-checkered  me-2" /> Completed</span>,
                disableFilters: true,
                bgColor: "bg-primary",
                Cell: (cellProps) => {
                    var item = cellProps.row.original

                    return (
                        <span
                            className={`badge badge-soft-primary font-size-11`}
                            style={{ borderRadius: "50%", padding: "0.5em 0.75em", display: "inline-block", textAlign: "center" }}>
                            {item.task_status[0]?.status_info[3]?.count}
                        </span>
                    )
                }
            },
            {
                accessor: 'closed',
                Header: <span className="badge bg-success font-size-12"><i className="fas fa-check  me-2" /> Closed</span>,
                bgColor: "bg-success",
                disableFilters: true,
                Cell: (cellProps) => {
                    var item = cellProps.row.original

                    return (
                        <span
                            className={`badge badge-soft-success font-size-11`}
                            style={{ borderRadius: "50%", padding: "0.5em 0.75em", display: "inline-block", textAlign: "center" }}>
                            {item.task_status[0]?.status_info[4]?.count}
                        </span>
                    )
                }
            },
            {
                accessor: "menu",
                disableFilters: true,
                Header: "Action",
                Cell: (cellProps) => {
                    var item = cellProps.row.original
                    return (
                        <div >
                            <Button
                                id={`view-${item._id}`}
                                className="btn btn-sm btn-soft-primary"
                                onClick={() => { navigateToActionPlan(item) }}
                            >
                                <i className="bx bx-right-arrow-alt font-size-14"></i>
                            </Button>
                            <UncontrolledTooltip placement="top" target={`view-${item._id}`}>
                                View Details
                            </UncontrolledTooltip>
                        </div>
                    )
                },
            },
        ],
        []
    )

    const gotoBack = () => {
        navigate('/follow_audit')
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Action plan Audit Locations | AuditVista</title>
                </MetaTags>

                <Container fluid>
                    <Breadcrumbs
                        title={auditData && "Audit : " + auditData.activity_name}
                        location={"Locations"}
                        breadcrumbItem="Location action plans"
                        isBackButtonEnable={true}
                        gotoBack={() => gotoBack()}
                    />
                    <Row>
                        {
                            aplnAuditLocationList ?
                                <Col lg="12">
                                    <Card>
                                        <CardBody>
                                            <TableContainer
                                                columns={columns}
                                                data={aplnAuditLocationList}
                                                isGlobalFilter={true}
                                                isAddOptions={false}
                                                isJobListGlobalFilter={false}
                                                customPageSize={10}
                                                style={{ width: "100%" }}
                                                isPagination={true}
                                                filterable={false}
                                                tableClass="align-middle table-nowrap table-check"
                                                theadClass="table-light"
                                                pagination="pagination pagination-rounded justify-content-end my-2"
                                            />
                                        </CardBody>
                                    </Card>
                                </Col> :
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
                        }
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )


}

export default AplnAuditLocations;