import React from 'react';
import {
    Row,
    Col,
    Card,
    Label,
    CardBody,
    Button,
} from "reactstrap"
import MetaTags from "react-meta-tags";
import { Link, useHistory, useNavigate } from 'react-router-dom'
// #region constants

// #endregion

// #region styled-components

// #endregion

// #region functions


// #region component
const propTypes = {};

const defaultProps = {};

const PublishType = () => {

    const navigate = useNavigate()
    // const history = useHistory()

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>AuditVista | Publishing</title>
                </MetaTags>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }} className="mb-1">
                    <div style={{ width: '80%', padding: '0 20px' }}>Publishing</div>
                    <div style={{ width: '20%', padding: '0 20px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Link to={"/report"}><Button color="primary">Back <i className="mdi mdi-arrow-left"></i></Button></Link>
                    </div>
                </div>
                <div>
                    <Card>
                        <CardBody>
                            <Label className="my-3">Publish Report By</Label>
                            <Row>
                                <Col xl="6" sm="6">
                                    <div className="me-2 text-wrap">
                                        <button className="btn btn-outline-primary" onClick={() => { sessionStorage.setItem("report_publish_type", "0"); navigate("/hryreport") }}>Hirerachy Users</button>
                                    </div>
                                </Col>
                                <Col xl="6" sm="6">
                                    <div className="me-2 text-wrap">
                                        <button className="btn btn-outline-primary" onClick={() => { sessionStorage.setItem("report_publish_type", "1"); navigate("/report-users") }}>Manual Users</button>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </React.Fragment>

    );
}

PublishType.propTypes = propTypes;
PublishType.defaultProps = defaultProps;
// #endregion

export default PublishType;