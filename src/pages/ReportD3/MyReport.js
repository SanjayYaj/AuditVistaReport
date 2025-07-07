import React from 'react';
import { getUserReport } from '../../Slice/reportd3/reportslice';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import TableContainer from './Components/TableContainer';
import MetaTags from 'react-meta-tags';
import { Container, Row, Col, Spinner,Card,CardBody } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';

const propTypes = {};

const defaultProps = {};

/**
 * 
 */
const MyReport = () => {
    const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
    const reportSlice = useSelector(state => state.reportSliceReducer)
    const dispatch = useDispatch()
    const userReports = reportSlice.userReports

    useEffect(() => {
        dispatch(getUserReport(authUser))
    }, [])


    const columns = [
        {
            accessor: 'name',
            Header: <span className="">Template Name</span>,
            filterable: true,
            width: "30%",
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <div className="fw-bold">
                        <span style={{ fontSize: '13px', color: '#848484' }}>{item.name}</span>
                    </div>
                )
            }
        },
        {
            accessor: 'createdAt',
            Header: <span className="">Published On</span>,
            filterable: true,
            width: "15%",
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                        <div className=" text-secondary">
                            {item.createdAt === null ? "-- / -- / --" : moment(item.createdAt).format("DD / MMM / YYYY")}
                        </div>
                    </>
                )
            }
        },
        {
            accessor: 'view_report',
            Header: <span className="">View Report</span>,
            filterable: true,
            width: "15%",
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <h2>
                        <Link to="/view_report"><i className="bx bx-right-arrow-alt text-primary" style={{ cursor: 'pointer', fontSize: '28px' }} onClick={() => {
                            sessionStorage.setItem("page_data", JSON.stringify(item))
                        }}
                        /></Link>
                    </h2>

                )
            }
        }
    ]

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>AuditVista | Report Templates</title>
                </MetaTags>
                <Container fluid>
                    <Breadcrumbs title="My Templates" breadcrumbItem="My Templates" />
                    <Row>
                        {
                            userReports ?
                                <Col lg="12">
                                    <Card>
                                        <CardBody>
                                            <TableContainer
                                                columns={columns}
                                                data={userReports}
                                                isGlobalFilter={true}
                                                isAddOptions={false}
                                                isJobListGlobalFilter={false}
                                                customPageSize={10}
                                                style={{ width: "100%" }}
                                                isPagination={true}
                                                filterable={false}
                                                tableClass="align-middle table-nowrap table-check"
                                                theadClass="table-light"
                                                pagination="pagination pagination-rounded justify-content-center mb-2 my-2"
                                                showBtn ={false}
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                                :
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
    );
}

MyReport.propTypes = propTypes;
MyReport.defaultProps = defaultProps;
// #endregion

export default MyReport;