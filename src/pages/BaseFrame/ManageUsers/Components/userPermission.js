import React, { useState, useEffect } from "react";
import {
    Row, Col, Button, Container
} from "reactstrap";
import { AvForm } from "availity-reactstrap-validation";
import 'react-tagsinput/react-tagsinput.css';

const _ = require('lodash');
var urlSocket = require("../../../../helpers/urlSocket");

const UserPermission = ({ userData, onClose }) => {
    const [dataloaded, setDataloaded] = useState(false);
    const [permissionsadded, setPermissionsadded] = useState([]);
    const [dbInfo, setDbInfo] = useState(null);
    const [sessionUserInfo, setSessionUserInfo] = useState(null);
    const [configData, setConfigData] = useState(null);

    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem("authUser"));
        const db_info = JSON.parse(sessionStorage.getItem("db_info"));
        
        setSessionUserInfo(data.user_data);
        setConfigData(data);
        setDbInfo(db_info);
        
        // Adding permissions
        const userPermissions = userData.facilities.map((item) => item);
        setPermissionsadded(userPermissions);
        
        setDataloaded(true);
    }, [userData]);

    const addPermissions = (e, idx) => {
        const updatedPermissions = [...permissionsadded];
        updatedPermissions[idx].enabled = e.target.checked;
        setPermissionsadded(updatedPermissions);
    };

    const updatePermissions = async () => {
        try {
            const res = await urlSocket.post("cog/updatepermissions", {
                user_access: permissionsadded,
                user_info: userData,
                db_info: dbInfo,
            });
            if (res.data.response_code === 500) {
                setPermissionsadded([]);
                onClose();
            }
        } catch (error) {
            console.error("Error updating permissions:", error);
        }
    };

    if (!dataloaded) return null;

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col>
                        <div className="p-5">
                            <AvForm className="form-horizontal">
                                <Row className="my-4">
                                    <div className="d-sm-flex align-items-center justify-content-between">
                                        <div className="text-danger font-size-18">Permissions to access</div>
                                        <button className="btn btn-outline-dark" onClick={onClose}>Close</button>
                                    </div>
                                    <hr className="my-4" />
                                </Row>

                                <Row>
                                    {permissionsadded.map((item, idx) => (
                                        <Col className="col-auto" key={"pn" + idx}>
                                            <div className="form-check mb-3">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value=""
                                                    id={"pmsn" + idx}
                                                    onChange={(e) => addPermissions(e, idx)}
                                                    checked={item.enabled}
                                                />
                                                <label className="form-check-label" htmlFor={"pmsn" + idx}>
                                                    {item.interfacename}
                                                </label>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>

                                <Row>
                                    <Button className="my-4" color="warning" onClick={updatePermissions}>Update</Button>
                                </Row>
                            </AvForm>
                        </div>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default UserPermission;
