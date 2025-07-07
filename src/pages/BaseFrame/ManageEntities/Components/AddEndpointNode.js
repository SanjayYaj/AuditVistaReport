import React, { useState, useEffect } from "react";
import {
    Row, Col, Card, CardBody, Container, Label, Input,
} from "reactstrap";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation";
import { Link } from "react-router-dom";
import _ from "lodash";
import urlSocket from "../../../../helpers/urlSocket";
import { usePermissions } from 'hooks/usePermisson';


const AddEndpointNode = ({ editItem, endpoints, onClose, onCancel }) => {
    const { canView, canEdit } = usePermissions("mels");

    const [dataloaded, setDataloaded] = useState(false);
    const [alertEnable, setAlertEnable] = useState(false);
    const [formDisabled, setFormDisabled] = useState(false);
    const [sessionUserInfo, setSessionUserInfo] = useState({});
    const [dbInfo, setDbInfo] = useState(null);
    const [optionGroup, setOptionGroup] = useState([]);
    const [endpointName, setEndpointName] = useState(editItem ? editItem.name : "");
    const [otpCode, setOtpCode] = useState(editItem ? editItem.code : "");
    const [getCode, setGetCode] = useState(editItem ? editItem.code : "");
    const [endpointCat, setEndpointCat] = useState(editItem ? editItem.category : "");
    const [enableAddCode, setEnableAddCode] = useState(true);
    const [enableCode, setEnableCode] = useState(editItem ? true : false);
    const [createNewCat, setCreateNewCat] = useState(false);
    const [eoptexist, setEoptexist] = useState(false);

    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem("authUser"));
        const db_info = JSON.parse(sessionStorage.getItem("db_info"));
        setSessionUserInfo(data.user_data);
        setDbInfo(db_info);
        setDataloaded(true);
        generateUniqueCode(db_info, data.user_data);
    }, []);

    const generateUniqueCode = async (dbInfo, userInfo) => {
        try {
            const response = await urlSocket.post("webEntities/gencode", {
                encrypted_db_url: dbInfo.encrypted_db_url,
                userInfo,
            });
            setGetCode(response.data.data);
            setEnableCode(true);
        } catch (error) {
            console.error("Error generating code:", error);
        }
    };

    const listOutCategory = () => {
        return _.uniq(endpoints.map((item) => item.category));
    };

    const selectCat = (event) => {
        const selectedValue = event.target.value;
        setCreateNewCat(selectedValue === "00");
        setEndpointCat(selectedValue);
    };

    const submitData = async (event, values) => {
        const trimmedValues = Object.fromEntries(
            Object.entries(values).map(([key, val]) => [key, typeof val === "string" ? val.trim() : val])
        );
        trimmedValues.endpoint_cat = createNewCat ? endpointCat.trim() : endpointCat;
        console.log(values,';values');
        const loggedUserInfo = {
            encrypted_db_url: dbInfo.encrypted_db_url,
            company_id: sessionUserInfo.company_id,
            user_id: sessionUserInfo._id,
        };

        const apiEndpoint = editItem ? "webEntities/updateeopt" : "webEntities/crudeopt";
        const payload = editItem ? { userInfo: loggedUserInfo, endpointInfo: { values: trimmedValues }, eopt: editItem } : { userInfo: loggedUserInfo, endpointInfo: { values: trimmedValues } };

        try {
            const response = await urlSocket.post(apiEndpoint, payload);
            console.log(response,'response');
            if (response.data.response_code === 502) {
                setEoptexist(true);
            } else if (response.data.response_code === 500) {
                onClose();
            }
        } catch (error) {
            console.error("Error in submission:", error);
        }
    };

    if (!dataloaded) return null;

    const optionGroups = listOutCategory();

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Card className="overflow-hidden">
                        {!formDisabled ? (
                            <CardBody>
                                <div className="p-2">
                                    <AvForm onValidSubmit={submitData}>

                                    <fieldset disabled={!canEdit}>

                                        <div className="mb-3">
                                            <AvField name="endpoint_name" label="Name" type="text" value={endpointName} required placeholder="Enter Name" />
                                        </div>
                                        <div className="mb-3">
                                            <Label htmlFor="autoSizingSelect">Category</Label>
                                            <AvInput type="select" name="endpoint_cat" className="form-select" value={endpointCat} required onChange={selectCat}>
                                                <option value="" disabled>Choose...</option>
                                                <option value="00">Create New</option>
                                                {optionGroup.map((data, idx) => (
                                                    <option key={idx} value={data}>{data}</option>
                                                ))}
                                            </AvInput>
                                        </div>
                                        {createNewCat && (
                                            <div className="mb-3">
                                                <AvField name="category" type="text" required placeholder="Enter New Category" onChange={(e) => setEndpointCat(e.target.value)} />
                                            </div>
                                        )}
                                        {enableCode && (
                                            <div className="mb-3">
                                                <AvField name="code" label="Code" type="text" value={otpCode || getCode} required placeholder="Enter Code" />
                                            </div>
                                        )}

                                            {
                                                canEdit && (<>
                                                    <div className="mt-3 d-flex flex-row justify-content-end">
                                                        <button className="btn btn-sm btn-outline-danger m-1" onClick={onCancel}>Cancel</button>
                                                        <button className={editItem ? "btn btn-sm btn-outline-secondary m-1" : "btn btn-sm btn-outline-success m-1"} type="submit">{editItem ? "Update Location" : "Add Location"}</button>
                                                    </div>
                                                </>)
                                            }
                                        </fieldset>
                                    </AvForm>
                                </div>
                                {
                                    eoptexist &&
                                    <div className="text-danger" style={{fontSize:"smaller"}}>Location info Already Exist</div>
                                }
                            </CardBody>
                        ) : (
                            <CardBody className="text-center">
                                <div className="mt-4">
                                    <div className="mb-0" style={{ fontSize: 20 }}>
                                        <span className="text-danger">{sessionUserInfo.first_name}</span> has been added successfully
                                    </div>
                                    <div className="mt-4">
                                        <Link className="btn btn-success" onClick={onClose}>Back</Link>
                                    </div>
                                </div>
                            </CardBody>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddEndpointNode;
