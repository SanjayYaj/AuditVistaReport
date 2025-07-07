import React from 'react';
import { Row, Col } from "reactstrap";

const Breadcrumbs = (props) => {

        return (
            <React.Fragment>
                <Row className='px-2'>
                    <Col xs={props.isBackButtonEnable ? 9 : 12}>
                        <div className="d-flex flex-column justify-content-center py-2">
                            <div className="mb-0 font-size-12 text-dark">{props.title}</div>
                            <div className="mb-0 font-size-13 text-primary">{props.location}</div>
                        </div>
                    </Col>
                    {
                        props.isBackButtonEnable &&
                        <Col xs={3} className='d-flex align-items-center justify-content-end'>
                            <button className='btn btn-outline-primary btn-sm' color="primary" onClick={() => props.gotoBack()}>Back <i className="mdi mdi-arrow-left"></i></button>
                        </Col>
                    }
                </Row>
            </React.Fragment>

        );
    }


export default Breadcrumbs;