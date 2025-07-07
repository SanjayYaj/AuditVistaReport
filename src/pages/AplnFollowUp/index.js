import React, { useEffect, useMemo } from "react";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Container, Spinner, UncontrolledTooltip } from "reactstrap";
import TableContainer from "./Components/TableContainer";
import { useDispatch, useSelector } from "react-redux";
import { getAplnAuditData } from "../../toolkitStore/Auditvista/aplnfollowup/aplnflwupslice";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "hooks/usePermisson";

const AplnAuditList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { canView, canEdit } = usePermissions("follow_audit");
    const aplnAuditList = useSelector(state => state.acplnFollowUpSliceReducer || [])
    useEffect(() => {
        dispatch(getAplnAuditData());
    }, [dispatch]);

    const loadEndpoints = (audit) => {
        sessionStorage.removeItem("auditData");
        sessionStorage.setItem("auditData", JSON.stringify(audit));
        navigate("/adtlctns");
    };

    const columns = useMemo(() => [
        {
            accessor: "activity_name",
            Header: "Audit",
            filterable: true,
            Cell: ({ row }) => (
                <div className="font-size-12 fw-bold" style={{ cursor: "pointer" }} onClick={() => loadEndpoints(row.original)}>
                    {row.original.activity_name}
                </div>
            ),
        },
        {
            accessor: "assigned_on",
            Header: 'Published On / Time',
            disableFilters: true,
            Cell: ({ row }) => (
                <div className="font-size-11">
                    {new Intl.DateTimeFormat("en-GB", {
                        month: "short", day: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit", hourCycle: "h12"
                    }).format(new Date(row.original.createdAt))}
                </div>
            ),
        },
        {
            accessor: "location_count",
            Header: "Total Locations",
            filterable: true,
            Cell: ({ row }) => (
                <div className="text-dark fw-500 font-size-11">
                    <span className="badge badge-soft-secondary font-size-11"
                          style={{ borderRadius: "50%", padding: "0.5em 0.75em", display: "inline-block", textAlign: "center" }}>
                        {Number(row.original.location_count)}
                    </span>
                </div>
            ),
        },
        {
            accessor: "menu",
            disableFilters: true,
            Header: "View Action Plan",
            Cell: ({ row }) => (
                <div>
                    <button id={`view-${row.original._id}`} className="btn btn-sm btn-soft-primary d-flex align-items-center"
                            onClick={() => loadEndpoints(row.original)}>
                        <i className="bx bx-right-arrow-alt font-size-14"></i>
                    </button>
                    <UncontrolledTooltip placement="top" target={`view-${row.original._id}`}>
                        View Details
                    </UncontrolledTooltip>
                </div>
            ),
        }
    ], [aplnAuditList]);

    if (aplnAuditList.aplnAuditList) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags><title>Action plan Audit | AuditVista</title></MetaTags>
                    <Container fluid>
                        <Breadcrumbs title="Audits" breadcrumbItem="User Audits" />
                        <Row>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        <TableContainer
                                            columns={columns}
                                            data={aplnAuditList.aplnAuditList}
                                            isGlobalFilter={true}
                                            isAddOptions={false}
                                            isJobListGlobalFilter={false}
                                            customPageSize={10}
                                            isPagination={true}
                                            filterable={false}
                                            tableClass="align-middle table-nowrap table-check"
                                            theadClass="table-light"
                                            pagination="pagination pagination-rounded justify-content-end my-2"
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    } else {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div>Loading...</div>
                <Spinner color="primary" />
            </div>
        )
    }

   
};

export default AplnAuditList;