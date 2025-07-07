import React from 'react';
import { Row, Col } from "reactstrap";

const Breadcrumbs2 = (props) => {
    const { title, description, isBackButtonEnable, gotoBack } = props;

    return (
        <React.Fragment>
            <Row className='px-2'>
                <Col xs={isBackButtonEnable ? 9 : 12}>
                    <div className="py-3">
                        <div className="mb-0 mt-2 m-3 font-size-14 fw-bold">{title}</div>
                        <div className="ms-3 font-size-12 text-secondary">{description}</div>
                    </div>
                </Col>
                {isBackButtonEnable && (
                    <Col xs={3} className='d-flex align-items-center justify-content-end'>
                        <button className='btn btn-outline-primary btn-sm' color="primary" onClick={gotoBack}>Back <i className="mdi mdi-arrow-left"></i></button>
                    </Col>
                )}
            </Row>
        </React.Fragment>
    );
};

export default Breadcrumbs2;
