import React from 'react';
import { Row, Col } from "reactstrap";

const PreviewObservation = (props) => {
    const { observation } = props;

    return (
        <Row className="p-2">
            <div className="p-2 m-2 border border-bottom-1 border-amber-100">
                <Col className="col-auto">
                    <Row className="align-items-center mb-3">
                        <Col sm={"12"} lg={"12"}>
                            <label className="text-primary font-size-12">Observation</label>
                            <div>{observation}</div>
                        </Col>
                    </Row>
                </Col>
            </div>
        </Row>
    );
};

export default PreviewObservation;
