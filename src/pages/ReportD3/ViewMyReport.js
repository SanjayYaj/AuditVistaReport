import React, { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import SimpleBar from "simplebar-react"
import ReportUserTree from './Components/ReportUserTree';
import { Container,Row,Col,CardBody,Card,Spinner } from 'reactstrap';
import Report from './NoRespGridLayOut'
import { useHistory } from 'react-router-dom';

import { getReportInfo } from '../../Slice/reportd3/reportslice';


const propTypes = {};

const defaultProps = {};

/**
 * 
 */
const ViewMyReport = () => {
    const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
    const [pageInfo, setpageInfo] = useState(JSON.parse(sessionStorage.getItem("page_data")))
    const [showPreview, setShowPreview] = useState(false)
    const [dataLoaded,setdataLoaded] = useState(true)
    const dispatch = useDispatch()
    const history = useHistory()
    const reportSlice = useSelector(state =>state.reportSliceReducer)


    useEffect(() => {
        dispatch(getReportInfo(authUser, pageInfo))
    }, [])


    const enablePreview = () => {
        setdataLoaded(false)
        setShowPreview(true)
        setTimeout(() => {
            setdataLoaded(true)
        }, 100);
    }

    if(dataLoaded){
    return (
        <div className="page-content" style={{ marginTop: '10px', height: "calc(100vh)" }}>
            <Container fluid style={{ width: "100%" }}>
                <div className='text-end'>
                    <button className='btn btn-primary' onClick={() => { history.push("/my-reports") }}>Back</button>
                </div>
                <Row>
                    <Col md={3} style={{ overflow: "scroll"}}>
                        <SimpleBar   style={{height: '95vh', background: 'white'}}>
                            <ReportUserTree
                                reportTemplateTree={reportSlice.reportTemplateTree}
                                enablePreview={enablePreview}
                            />

                        </SimpleBar>
                    </Col>
                    {
                        showPreview &&(
                            <Col md={9} style={{ overflow: "scroll" }}>
                                <Report/>
                            </Col>
                        )
                    }
                </Row>
            </Container>
        </div>
    );
    }
    else{
        return (
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
        )
    }
}

ViewMyReport.propTypes = propTypes;
ViewMyReport.defaultProps = defaultProps;
// #endregion

export default ViewMyReport;