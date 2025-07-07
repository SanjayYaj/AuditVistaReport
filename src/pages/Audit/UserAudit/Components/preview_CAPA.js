import React from "react";
import { Row, Col } from "reactstrap";
import moment from "moment";

const PreviewCAPA = (props) => {
    return (
        <Row>
            {props.actionplans.map((item, i) => (
                <Row key={i}>
                    <div className="p-2 m-2" style={{ borderTop: "1px solid #e9e9e9" }}>
                        <Col className="col-auto">
                            <label className="font-size-13">Action plan {i + 1}</label>

                            <Row className="mb-2">
                                <Col>
                                    <label className="text-primary font-size-12">Observation</label>
                                    <div>{item.observation}</div>
                                </Col>
                            </Row>

                            <Row className="mb-2">
                                <Col>
                                    <label className="text-primary font-size-12">Root Cause</label>
                                    <div>{item.root_cause}</div>
                                </Col>
                            </Row>
                            {
                                item.actionplan &&
                                <Row className="mb-2">
                                    <Col>
                                        <label className="text-primary font-size-12">Action</label>
                                        <div>{item.actionplan}</div>
                                    </Col>
                                </Row>
                            }
                          
                            {
                                item.target_date &&
                                <Row className="mb-2">
                                    <Col>
                                        <label className="text-primary font-size-12">Target date</label>
                                        <div>{moment(item.target_date).format("DD-MMM-YYYY")}</div>
                                    </Col>
                                </Row>
                            }
                                {
                                    item.responsible_person.length >0 &&
                                      <Row className="mb-2">
                                <Col>
                                    <label className="text-primary font-size-12">People Responsible</label>
                                    <div className="d-flex gap-1">
                                        {item.responsible_person?.map((person, index) => (
                                            <React.Fragment key={index}>
                                                <label>{person.name}</label>
                                                {index < person.length - 1 ? "," : "."}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                                }
                          
                        </Col>
                    </div>
                </Row>
            ))}
        </Row>
    );
};

export default PreviewCAPA;
