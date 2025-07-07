import React, { useState } from "react";
import { Row, Col, Button, Card, CardBody, Label } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

const Observation = (props) => {
    const { selectedCheckpoint, saveCheckpoint, audit_status } = props
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [observation, setObservation] = useState(selectedCheckpoint.cp_observation || "");

    const handleValidSubmit = (event, values) => {
        selectedCheckpoint.cp_observation = values.cp_remarks;
        saveCheckpoint(selectedCheckpoint);
        setShowCommentBox(false);
    };

    return (
        <div>
            <label>Comments</label>
            <Card className="border border-2">
                <CardBody>
                    <Row className="mb-2">
                        <div className="d-sm-flex align-items-center justify-content-between pb-1">
                            <div>
                                <Label>Comment</Label>
                            </div>
                            {selectedCheckpoint.cp_observation !== null && !showCommentBox ? (
                                <div>
                                    <Button
                                        className="btn btn-sm w-md d-flex align-items-center justify-content-center gap-2"
                                        color="primary"
                                        onClick={() => setShowCommentBox(true)}
                                    >
                                        <i className="bx bx-edit-alt" /> Edit
                                    </Button>
                                </div>
                            ) : (
                                
                                    observation && (
                                        <button
                                        type="button"
                                        className="btn btn-sm w-md btn-danger"
                                        onClick={() => {
                                            setShowCommentBox(false);
                                            setObservation('');
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    )
                                
                               
                            )}
                        </div>
                    </Row>
                    <Row>
                        <Col sm="12" lg="12">
                            {audit_status !== "3" && audit_status !== "4" && selectedCheckpoint.cp_observation == null ? (
                                <AvForm className="form-horizontal" onValidSubmit={handleValidSubmit}>
                                    <div className="mb-3">
                                        <AvField
                                            name="cp_remarks"
                                            value={observation}
                                            onChange={(e) => setObservation(e.target.value)}
                                            className="form-control"
                                            placeholder="Enter Comment"
                                            type="textarea"
                                            required
                                        />
                                    </div>
                                    <div className="text-end">
                                        <button className="btn btn-sm w-md btn-primary">Save</button>
                                    </div>
                                </AvForm>
                            ) : (
                                <div>
                                    <p className="text-primary">{selectedCheckpoint.cp_observation}</p>
                                </div>
                            )}
                            {showCommentBox && audit_status !== "3" && audit_status !== "4" ? (
                                <AvForm className="form-horizontal" onValidSubmit={handleValidSubmit}>
                                    <div className="mb-3">
                                        <AvField
                                            name="cp_remarks"
                                            value={observation}
                                            onChange={(e) => setObservation(e.target.value)}
                                            className="form-control"
                                            placeholder="Enter Comment"
                                            type="textarea"
                                            required
                                        />
                                    </div>
                                    <div className="text-end">
                                        <button className="btn btn-sm w-md btn-success">Save</button>
                                    </div>
                                </AvForm>
                            ) : null}
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </div>
    );
};

export default Observation;
