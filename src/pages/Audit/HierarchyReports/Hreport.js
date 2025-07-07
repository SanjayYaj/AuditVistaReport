import React, { useEffect, useState } from 'react'
import urlSocket from '../../../helpers/urlSocket'
import { Link, useNavigate } from "react-router-dom"
import MetaTags from 'react-meta-tags';
import { Row, Col, Card, CardBody, CardTitle, Container, Button, Spinner } from 'reactstrap';
import BarChart from './Components/BarChart';
import RadialChart from './Components/RadialChart';
import BarChartIL from './Components/BarChartIL'
import Breadcrumbs from '../../../components/Common/Breadcrumb';

const Hreport = (props) => {

  const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
  const [auditData, setauditData] = useState([])
  const [apiRequestLoad, setapiRequestLoad] = useState(true)
  const navigate = useNavigate()


  useEffect(() => {
    let sessionInfo = JSON.parse(sessionStorage.getItem("hreport_data"))
    getAuditReportInfo(sessionInfo)

  }, [])


  const getAuditReportInfo = async (sessionInfo) => {

    try {
      const responseData = await urlSocket.post('hreport/huser-getauditreport', {
        encrypted_db_url: authUser.db_info.encrypted_db_url,
        h_id: sessionInfo.h_id,
        mode: sessionInfo.mode,
        adt_master_id: sessionInfo._id,
        user_id: authUser.user_data._id
      })
      console.log(responseData, 'responseData')
      setapiRequestLoad(false)
      if (responseData.data.response_code === 500) {
        setauditData(responseData.data.data)
      }

    } catch (error) {
      console.log(error, 'error')
    }


  }

  if (!apiRequestLoad) {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Analytical Report | AuditVista</title>
          </MetaTags>
          <Breadcrumbs
            title="Analytical Report"
            isBackButtonEnable={true}
            gotoBack={() => { navigate('/hreports') }}
          />
          {
            !apiRequestLoad &&
            <Container fluid >
              <Card className="mb-1">
                <CardBody>
                  <CardTitle className="mb-4">
                    {auditData?.audit_pbd_name}
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
                        <h5 className="mb-0 font-size-20">{auditData?.in_progress}</h5>
                        <p className="text-warning">In progress</p>
                      </div>
                    </Col>
                    <Col sm={2}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">{auditData?.completed}</h5>
                        <p className="text-success">Completed</p>
                      </div>
                    </Col>
                    <Col sm={2}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">{auditData?.submitted}</h5>
                        <p className="text-info">Submitted</p>
                      </div>
                    </Col>
                    <Col sm={2}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">{auditData?.reviewed}</h5>
                        <p className="text-primary">Reviewed</p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              {
                auditData &&
                <Card className="mb-1">
                  <CardBody>
                    <CardTitle className="mb-4"> Audit Status </CardTitle>
                    <BarChart
                      auditData={auditData}
                      height={"300"}
                    />
                  </CardBody>
                </Card>
              }
              <Row className="equal-height-row">
                <Col lg={6} className="pe-0">
                  <Card className="h-100">
                    {
                      auditData &&
                      <CardBody>
                        <CardTitle className="mb-4">Compliant / Non-compliant</CardTitle>
                        <RadialChart
                          userInfo={authUser.user_data}
                          auditInfo={JSON.parse(sessionStorage.getItem("hreport_data"))}
                          encrypted_db_url={authUser.db_info.encrypted_db_url}
                          total_locations={auditData.total}
                        />
                      </CardBody>
                    }

                  </Card>
                </Col>
                <Col lg={6} className="px-1">
                  <Card className="h-100">
                    {
                      auditData &&
                      <CardBody>
                        <CardTitle className="mb-4">Impact level</CardTitle>
                        <BarChartIL
                          userInfo={authUser.user_data}
                          auditInfo={JSON.parse(sessionStorage.getItem("hreport_data"))}
                          encrypted_db_url={authUser.db_info.encrypted_db_url}
                          total_locations={auditData.total}
                        />
                      </CardBody>
                    }
                  </Card>
                </Col>
              </Row>

            </Container>
          }

        </div>


      </React.Fragment>
    )
  }
  else {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div>Loading...</div>
        <Spinner color="primary" />
      </div>
    );
  }
}

export default Hreport
