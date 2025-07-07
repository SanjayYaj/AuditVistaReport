import React from "react";
import {
    Row,
    Col,
} from "reactstrap";
import moment from "moment";

const AcplnBox = ({
    index,
    i2,
    item2,
    item,
    loadSelectedCheckpoint,
    selectedTaskIndex
}) => {

    return <Row
        className={selectedTaskIndex === (index + "_" + i2) ?
            "py-3 mb-2 border border-info bg-info bg-opacity-25" :
            item2.task_status === "0" || item2.task_status === undefined ? "py-3 mb-2 border border-secondary border-opacity-50 " :
                item2.task_status === "1" ? "py-3 mb-2 border border-warning border-opacity-50" :
                    item2.task_status === "2" ? "py-3 mb-2 border border-primary border-opacity-50" :
                        item2.task_status === "3" ? "py-3 mb-2 border border-success border-opacity-50" :
                            item2.task_status === "4" && "py-3 mb-2 border border-danger border-opacity-50"
        }

        style={{ cursor: "pointer", borderRadius: 10, margin: 3 }}
        onClick={() => {
            loadSelectedCheckpoint(item, index, i2, item2)
        }}
    >

        <Col md={12} className="mb-2" >
            <div className="d-flex">
                <div className="col">
                    <Col className="col-auto me-2 mb-2" >
                        <div className={`badge bg-${item2.task_status === "0" ? "secondary" : item2.task_status === "1" ? "warning" : item2.task_status === "2" ? "primary" : item2.task_status === "3" ? "success" : item2.task_status === "4" ? "danger" : item2.task_status === "5" && "dark"}`}>
                            {
                                item2.task_status === "0" || item2.task_status === undefined ? <span className=""><i className="fas fa-male me-1" /> Not Started </span> :
                                    item2.task_status === "1" ? <span className=""><i className="fas fa-walking me-1" /> In progress </span> :
                                        item2.task_status === "2" ? <span className=""><i className="fas fa-flag-checkered me-1" /> Completed </span> :
                                            item2.task_status === "3" ? <span className=""> <i className="fas fa-check me-2" /> Closed </span> :
                                                item2.task_status === "4" ? <span className=""><i className="fas fa-calendar-times me-1" /> Overdue </span> :
                                                    item2.task_status === "5" && <span className=""><i className="fas fa-redo me-1" /> Reopen </span>
                            }
                        </div>
                    </Col>
                    <div className="text-dark" style={{ fontSize: "0.75rem" }}>{item2.action}</div>
                </div>
            </div>
        </Col>


        <Row className="justify-content-between">
            <Col>
                <Row>
                    <Col className="col-auto me-2" >
                        <div className="font-size-11 text-secondary">Target Date</div>
                        <div className="font-size-12 text-dark">{item2.task_target_date === null ? (
                            <label className="text-secondary">
                                {"-- / -- / --"}
                            </label>
                        ) : (
                            <label className="text-dark">
                                {moment(item2.task_target_date).format("DD-MMM-YYYY")}
                            </label>
                        )}</div>
                    </Col>
                    <Col className="col-auto me-2" >
                        <div className="font-size-11 text-secondary">Priority</div>
                        <div>
                            <span
                                className={`badge badge-soft-${(item2.task_priority === "No impact" || item2.task_priority === "No Impact") ? "secondary" :
                                    item2.task_priority === "Low" ? "success" :
                                        item2.task_priority === "Medium" ? "warning" :
                                            item2.task_priority === "High" ? "danger" :
                                                item2.task_priority === "Critical" && "danger"
                                    } font-size-12`}>{item2.task_priority}</span></div>
                    </Col>
                </Row>
            </Col>
            <Col className="col-auto" >

                {
                    item2.unreadCount > 0 && item2.unreadCount !== undefined &&
                    <div >
                        <span className="text-white bg-primary avatar-xs rounded-circle d-flex justify-content-center align-items-center"  >
                            {item2.unreadCount}
                        </span>
                    </div>
                }

            </Col>
        </Row>
    </Row>
}

export default AcplnBox;