import React, { useEffect, useState } from 'react'
import { MetaTags } from 'react-meta-tags'

import {
  Container, Row, Col, Button, Alert, Input, Card, CardBody, CardText, Table,
  Modal, ModalHeader, ModalBody, CardTitle,
  Collapse, DropdownMenu, DropdownToggle, UncontrolledAlert, UncontrolledDropdown, Tooltip,
} from "reactstrap"

import Breadcrumbs from 'components/Common/Breadcrumb'
const _ = require('lodash')
import urlSocket from 'helpers/urlSocket'
import { useDispatch } from 'react-redux'
import { auditReportApi } from 'toolkitStore/Auditvista/ManageAuditSlice'
import { useNavigate } from 'react-router-dom'
import BarChart from './Chart/barChart'
import RadialChart from './Chart/RadialChart'
import BarChartIL from './Chart/barChart_IL'

const AuditAnalyticalReport = () => {
    const dispatch = useDispatch()
    const [auditData,setAuditData] = useState(null)
    const [publishedAuditData,setpublishedAuditData] = useState(JSON.parse(sessionStorage.getItem("publishedAuditData")))
    const [authUser,setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))

    const navigate = useNavigate()

    useEffect(() => {
        retriveAuditReportData()

    }, [])

    const retriveAuditReportData=async()=>{

        try {
            const publishedAuditData = JSON.parse(sessionStorage.getItem("publishedAuditData"))
            const responseData = await dispatch(auditReportApi(publishedAuditData))            
            console.log(responseData,'responseData')
            if(responseData.data.response_code === 500){
                setAuditData(responseData.data.data)
            }


        } catch (error) {
            
        }


    }



    return (
         <React.Fragment>
          <div className="page-content">
            <MetaTags>
              <title>Analytical Report | AuditVista</title>
            </MetaTags>
                  <Container fluid >

              <Breadcrumbs
                title={"Analytical Report"}
                isBackButtonEnable={true}
                gotoBack={() => { 
                    navigate(publishedAuditData.repeat_mode_config.mode_id === "0" ? '/mngpblhtempt' : '/scheduled-audit')
                    // this.props.history.push(this.state.publishedAuditData.repeat_mode_config.mode_id === "0" ? `/mngpblhtempt` : `/scheduled-audit` ) 
                }}
                breadcrumbItem="Template"

              />


                    <Card className="mb-1">
                        <CardBody>
                            <CardTitle className="mb-4 text-primary">
                                {publishedAuditData.template_name}
                            </CardTitle>
                            <Row className="justify-content-center">
                                <Col sm={2}>
                                    <div className="text-center">
                                        <h5 className="mb-0 font-size-20">{auditData?.total}</h5>
                                        <p className="text-dark">Total</p>
                                    </div>
                                </Col>
                                <Col sm={2}>
                                    <div className="text-center">
                                        <h5 className="mb-0 font-size-20">{auditData?.not_started}</h5>
                                        <p className="text-secondary">Not Started</p>
                                    </div>
                                </Col>
                                <Col sm={2}>
                                    <div className="text-center">
                                        <h5 className="mb-0 font-size-20 fw-bold">{auditData?.in_progress}</h5>
                                        <p className="text-warning">In progress</p>
                                    </div>
                                </Col>
                                <Col sm={2}>
                                    <div className="text-center">
                                        <h5 className="mb-0 font-size-20 fw-bold">{auditData?.completed}</h5>
                                        <p className="text-success">Completed</p>
                                    </div>
                                </Col>
                                <Col sm={2}>
                                    <div className="text-center">
                                        <h5 className="mb-0 font-size-20 fw-bold">{auditData?.submitted}</h5>
                                        <p className="text-info">Submitted</p>
                                    </div>
                                </Col>
                                <Col sm={2}>
                                    <div className="text-center">
                                        <h5 className="mb-0 font-size-20 fw-bold">{auditData?.reviewed}</h5>
                                        <p className="text-primary">Reviewed</p>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <Card className="mb-1">
                  <CardBody>
                    <CardTitle className="mb-4"> Audit Status </CardTitle>
                    <BarChart auditData={auditData} height={"300"} />
                  </CardBody>
                </Card>

                    <Row className="equal-height-row">
                        <Col lg={6} className="pe-0">
                            <Card className="h-100">
                                <CardBody>
                                    <CardTitle className="mb-4">Compliant / Non-compliant</CardTitle>
                                    <RadialChart
                                        userInfo={authUser.user_data}
                                        auditInfo={publishedAuditData}
                                        encrypted_db_url={authUser.db_info.encrypted_db_url}
                                        total_locations={auditData?.total}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={6} className="px-1">
                            <Card className="h-100">
                                <CardBody>
                                    <CardTitle className="mb-4">Impact level</CardTitle>
                                    <BarChartIL
                                        userInfo={authUser.user_data}
                                        auditInfo={publishedAuditData}
                                        encrypted_db_url={authUser.db_info.encrypted_db_url}
                                        total_locations={auditData?.total}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>



              </Container>


            </div>
            </React.Fragment>
    )
}
export default AuditAnalyticalReport
