import React, { Suspense,useMemo } from 'react'
import { useEffect, useState } from 'react'
import urlSocket from '../../../helpers/urlSocket'
import TableContainer from './Components/TableContainer'
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import MetaTags from 'react-meta-tags';
import { Container, Row, Col, Button, Card, CardBody, Modal, ModalHeader, ModalBody, UncontrolledTooltip,Spinner } from "reactstrap";
import { useNavigate } from 'react-router-dom'



const ScheduledAudit = () => {
    const [auditList, setauditList] = useState([])
    const [statusData, setstatusData] = useState([])
    const [apiRequestLoad,setApiRequestLoad] = useState(true)


    const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
    const navigate = useNavigate()

    useEffect(() => {
        console.log("useEffect")
        var sessionInfo = JSON.parse(sessionStorage.getItem("hdaily_data"))
        console.log('sessionInfo', sessionInfo)
        if (sessionInfo) {
            getDateMeta(sessionInfo)
        }
    }, [])


    const getDateMeta = async (sessionInfo) => {

        try {
            var responseData = await urlSocket.post("hreport/retrive-scheduledaudit-hinfo", {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                user_id : authUser.user_data._id,
                adt_master_id : sessionInfo._id,
                h_id : sessionInfo.h_id,
            })

            setApiRequestLoad(false)
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

    const columns = useMemo(()=> [

        {
            accessor: 'template_name',
            Header: 'Audit Name',
            filterable: true,
            width: "50%",
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
            width: '10%',
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                         <span
                            className={`badge ${item.total_checkpoints === 0 ? "badge-soft-secondary" : "badge-soft-success"} font-size-11`}
                            style={{ borderRadius: "50%", padding: "0.5em 0.75em", display: "inline-block", textAlign: "center" }}>
                            {item.total_checkpoints}
                        </span>
                    </>
                )
            }
        },
        {
            accessor: 'created_on',
            Header: 'Created on',
            width: '15%',
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <div className='font-size-11'>
                        {dateConvertion(item.created_on)}
                    </div>
                )
            }
        },
        {
            accessor: 'published_on',
            Header: 'Published on',
            width: '15%',
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <div className='font-size-11'>
                        {dateConvertion(item.published_on)}
                    </div>
                )
            }
        },
       
        {
            accessor: "menu",
            disableFilters: true,
            Header: "Action",
            width: '5%',
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <div className="d-flex gap-2" style={{ display: 'flex', alignContent: 'center' }}>
                        <Button id={`delete-${item._id}`} className="btn btn-sm btn-soft-primary"
                            onClick={() => { navigate("/hcharts"); sessionStorage.setItem("hreport_data",JSON.stringify({ _id : item._id, mode : item.repeat_mode_config.mode_id, h_id : item.hlevel_id })) }}>
                          Report  
                        </Button>   
                        <Button id={`view-${item._id}`} className="btn btn-sm btn-soft-primary"
                            onClick={() => { navigate("/hendpoints"); sessionStorage.setItem("publishedHInfoAuditData",JSON.stringify(item))}}>
                            <i className="bx bx-right-arrow-alt"></i>
                        </Button>
                        <UncontrolledTooltip placement="top" target={`view-${item._id}`}>
                            View Details
                        </UncontrolledTooltip>
                    </div>
                )
            },
        },

    ],[auditList])



    if(!apiRequestLoad){
    return (
        <React.Fragment>
            <div className="page-content" >
                <MetaTags>
                    <title>Scheduled Audits | AuditVista</title>
                </MetaTags>
                <Breadcrumbs title="Scheduled Audits" breadcrumbItem="Audits" isBackButtonEnable={true} gotoBack={() => {navigate("/hreports")}}/>

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
                                        pagination="pagination pagination-rounded justify-content-end my-2"
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Container>

            </div>
        </React.Fragment>
    )
}
else{
    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
           <div>Loading...</div>
          <Spinner color="primary" />         
        </div>
      );
}
}
export default ScheduledAudit