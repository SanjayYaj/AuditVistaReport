import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText,Spinner } from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import { getDashBoardInfo } from '../../../toolkitStore/Auditvista/AuthSlice';
import BarChart from './DashBoardChart/BarChart';
import LineChart from './DashBoardChart/LineChart';
import PieChart from './DashBoardChart/PieChart';
import PieChart2 from './DashBoardChart/PieChart2';



const NewDashboard = () => {
    const dispatch = useDispatch();
    const dashboardInfo = useSelector(state => state.IR_Slice?.dashboardInfo);
    const [facilityLength, setFacilityLength] = useState(0);
    const [facility, setFacility] = useState([]);
    const [dataLoaded, setdataLoaded] = useState(false);
    console.log(dashboardInfo,'dashboardInfo')
    useEffect(() => {
        const fetchData = async () => {
            var response = await dispatch(getDashBoardInfo());
            setdataLoaded(true)
            var facilities = JSON.parse(sessionStorage.getItem("user_facilities"));
            setFacilityLength(facilities.length);
            setFacility(facilities);
        };
        fetchData();
    }, []);
    if (dataLoaded) {
        return (
            <Container fluid>

                {/* First Row */}
                <Row className="g-3">
                    {dashboardInfo?.cardData.map((card) => (
                        <Col key={card.id}>
                            <Card
                                className="h-100 shadow-sm p-2"
                                style={{
                                    borderRadius: '20px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.2s ease-in-out',
                                    border: '1px solid #e9e9e9',
                                }}

                            >
                                <CardBody className="p-2">
                                    <h5 className='fw-bold mb-3'>{card.label}</h5>
                                    <h1 className='ms-1 fw-bold'>{card.count}</h1>
                                    {card.children && (
                                        <div style={{ display: "flex", alignItems: 'center' }} className='gap-3'>
                                            {card.children.map((child) => (
                                                <div className='d-flex align-item-center gap-1' key={child.label}>
                                                    <span className={`badge ${child.label === 'Published' ? 'badge-soft-success' : 'badge-soft-danger'} p-1 font-size-12`}
                                                        style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold' }}>
                                                        {child.count}
                                                    </span>
                                                    <span className="mt-1" style={{ fontSize: '14px', fontWeight: 500 }}>
                                                        {child.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row className="g-3 mt-2">
                    {_.filter(facility, { id: "4" }).length > 0 &&
                        <Col xs={12} md={_.filter(facility, { id: "8" }).length > 0 ? 5 : 12} lg={_.filter(facility, { id: "8" }).length > 0 ? 5 : 12} xl={_.filter(facility, { id: "8" }).length > 0 ? 5 : 12} xxl={_.filter(facility, { id: "8" }).length > 0 ? 5 : 12}>
                            <Card
                                className="h-100 shadow-sm"
                                style={{
                                    borderRadius: "20px",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    transition: "transform 0.2s ease-in-out",
                                    border: "1px solid #e9e9e9",
                                }}
                            >
                                <CardBody>
                                    <CardTitle className="mb-2">Users</CardTitle>
                                    
                                    {dashboardInfo?.user_pie_chart?.length > 0 && (
                                        <Row className="justify-content-center mb-4">
                                            {dashboardInfo?.user_pie_chart?.map((data) =>
                                                data?.pieChartData?.map((data2, index2) => (
                                                    <Col sm={4} key={index2}>
                                                        <div className="text-center">
                                                            <h4 className="mb-0 fw-bold" style={{ color: data2.color }} >{data2.count}</h4>
                                                            <p className="text-truncate">{data2.status}</p>
                                                        </div>
                                                    </Col>
                                                ))
                                            )}
                                        </Row>
                                    )}

                                    <div style={{ width: "100%", height: "auto" }}>
                                        {/* <PieChart chartInfo={dashboardInfo?.user_pie_chart} dataColors='[ "--bs-danger","--bs-success","--bs-primary","--bs-warning","--bs-info"]' /> */}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    }

                    {_.filter(facility, { id: "8" }).length > 0 &&
                        <Col xs={12} md={_.filter(facility, { id: "4" }).length > 0 ? 7 : 12} lg={_.filter(facility, { id: "4" }).length > 0 ? 7 : 12} xl={_.filter(facility, { id: "4" }).length > 0 ? 7 : 12} xxl={_.filter(facility, { id: "4" }).length > 0 ? 7 : 12} >
                            <Card
                                className="h-100 shadow-sm"
                                style={{
                                    borderRadius: '20px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.2s ease-in-out',
                                    border: '1px solid #e9e9e9',
                                }}
                            >
                                <CardBody>
                                    <div className='d-flex align-items-center justify-content-between mb-2'>
                                        <CardTitle>{facilityLength >= 10 ? "Latest Audit Published by me" : "Latest Audit Assigned to me"}</CardTitle>
                                        <CardText className='text-primary fw-bold'>{dashboardInfo?.latest_audit[0]?.audit_pbd_name}</CardText>
                                    </div>

                                    {dashboardInfo?.latest_audit?.length > 0 && (
                                        <Row className="justify-content-center">
                                            {dashboardInfo?.latest_audit?.map((data, index) =>
                                                data?.results?.map((data2, index2) => (
                                                    <Col key={index2}>
                                                        <div className="text-center">
                                                            <h4 className="mb-0 fw-bold" style={{ color: data2.color }}>{data2.count}</h4>
                                                            <p className="text-truncate">{data2.status}</p>
                                                        </div>
                                                    </Col>
                                                ))
                                            )}
                                        </Row>
                                    )}
                                    {/* <BarChart chartInfo={dashboardInfo?.latest_audit} /> */}
                                </CardBody>
                            </Card>
                        </Col>
                    }
                </Row>

                <Row className="g-3 mt-2 mb-4">
                    {_.filter(facility, { id: "8" }).length > 0 &&
                        <Col xs={12} md={_.filter(facility, { id: "11" }).length > 0 ? 7 : 12} lg={_.filter(facility, { id: "11" }).length > 0 ? 7 : 12} xl={_.filter(facility, { id: "11" }).length > 0 ? 7 : 12} xxl={_.filter(facility, { id: "11" }).length > 0 ? 7 : 12}>
                            <Card
                                className="h-100 shadow-sm"
                                style={{
                                    borderRadius: '20px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.2s ease-in-out',
                                    border: '1px solid #e9e9e9',
                                }}
                            >
                                <CardBody>
                                    <CardTitle className="mb-2">Audit</CardTitle>
                                    {dashboardInfo?.myAudit?.length > 0 && (
                                        <Row className="justify-content-center">
                                            {dashboardInfo?.myAudit?.map((data, index) =>
                                                data?.myAuditStatus?.map((data2, index2) => (
                                                    <Col key={index2}>
                                                        <div className="text-center">
                                                            <h4 className="mb-0 fw-bold" style={{ color: data2.color }}>{data2.count}</h4>
                                                            <p className="text-truncate">{data2.status}</p>
                                                        </div>
                                                    </Col>
                                                ))
                                            )}
                                        </Row>
                                    )}

                                    {/* <LineChart chartInfo={dashboardInfo?.myAudit} /> */}
                                </CardBody>
                            </Card>
                        </Col>
                    }

                    {_.filter(facility, { id: "11" }).length > 0 &&
                        <Col xs={12} md={_.filter(facility, { id: "8" }).length > 0 ? 5 : 12} lg={_.filter(facility, { id: "8" }).length > 0 ? 5 : 12} xl={_.filter(facility, { id: "8" }).length > 0 ? 5 : 12} xxl={_.filter(facility, { id: "8" }).length > 0 ? 5 : 12}>
                            <Card
                                className="h-100 shadow-sm"
                                style={{
                                    borderRadius: '20px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.2s ease-in-out',
                                    border: '1px solid #e9e9e9',
                                }}
                            >
                                <CardBody>
                                    <CardTitle className="mb-2">My Action Plan</CardTitle>
                                    {dashboardInfo?.tastStatus?.length > 0 && (
                                        <Row className="justify-content-center">
                                            {dashboardInfo?.tastStatus?.map((data, index) =>
                                                data?.grouped_data?.map((data2, index2) => (
                                                    <Col key={index2}>
                                                        <div className="text-center">
                                                            <h4 className="mb-0 fw-bold" style={{ color: data2.color }}>{data2.count}</h4>
                                                            <p className="text-truncate">{data2.status}</p>
                                                        </div>
                                                    </Col>
                                                ))
                                            )}
                                        </Row>
                                    )}
                                    <div style={{ width: "100%", height: "auto" }}>
                                        {/* <PieChart2 dataColors='["--bs-primary","--bs-warning", "--bs-danger","--bs-info", "--bs-success"]' chartInfo={dashboardInfo?.tastStatus} /> */}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    }
                </Row>

            </Container>
        );
    }
    else {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div>Loading...</div>
                <Spinner color="primary" />
            </div>
        )
    }
};

export default NewDashboard;





