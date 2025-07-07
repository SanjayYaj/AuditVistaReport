import React, { useEffect, useState } from 'react'

import {
    Row, Col, FormGroup, Button, Card, CardBody, Container, Alert, Label, Form, Progress,
    Input, Spinner
} from "reactstrap";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import urlSocket from '../../../../helpers/urlSocket';
import { Table } from 'react-bootstrap';
import { Multiselect } from 'multiselect-react-dropdown';
import _ from 'lodash';
import Swal from 'sweetalert2';


const UpdateDailyAuditInfo = (props) => {
    const { auditInfo } = props;
    console.log('auditInfo', auditInfo)

    const [auditUserState, setAuditUserState] = useState('')
    const [dataLoaded, setDataLoaded] = useState(false)
    const [selectedAuditUser, setSelectedAuditUser] = useState({});
    const [selectedReviewUser, setSelectedReviewUser] = useState({});
    const [userList, setuserList] = useState([]);
    const [epsList, setepsList] = useState([]);

    const [changedDataInfo, setChangedDateInfo] = useState(null)
    const [minDate, setMinDate] = useState(null)
    const [updatedMsg, setupdatedMsg] = useState(false)
    const [authUser, setAuthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
    const [resetMultiSelect, setresetMultiSelect] = useState(false)
    const [auditUserErrors, setAuditUserErrors] = useState([]);
    const [reviewUserErrors, setReviewUserErrors] = useState([]);
    const [inchargeUserErrors, setInchargeUserErrors] = useState([]);








    useEffect(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowFormatted = tomorrow.toISOString().split("T")[0];
        console.log("update the date info", props, tomorrowFormatted)
        setMinDate(tomorrowFormatted)
        setDataLoaded(true)
        loadEOPTS()

    }, [])


    const updateAuditInfo = async (changedDataInfo) => {

        const updatedAuditInfo = { ...auditInfo };


        if (changedDataInfo) {
            updatedAuditInfo.audit_end_date = changedDataInfo;
        }

        if (!validateAuditType(epsList)) {
            return;
        }

        try {
            const responseData = await urlSocket.post("webmngpbhtmplt/updt-date-info", {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                publishedInfo: updatedAuditInfo,
                endpoints: epsList
            })
            console.log(responseData, 'responseData')
            if (responseData.data.response_code === 500) {
                setupdatedMsg(true)
                setTimeout(() => {
                    setupdatedMsg(false)
                    props.onClose()
                }, 2000);
            }

        } catch (error) {

        }
    }



    const loadEOPTS = () => {
        try {
            urlSocket.post("webmngpbhtmplt/retrive-published-eps",
                {
                    encrypted_db_url: authUser.db_info.encrypted_db_url,
                    ref_id: auditInfo._id
                }
            )
                .then((response) => {
                    console.log(response, 'response')
                    if (response.status === 200) {
                        setepsList(response.data.data[0]["endpoints"])
                    }
                })
        } catch (error) {
            console.log(error, 'error')
        }
    }



    const changeAuditUserHandler = async (selectedList, selectedItem, item, mode, action) => {
        console.log(selectedList, selectedItem, item, mode, action, 'selectedList, selectedItem,item, mode, action')
        const epsListInfo = _.cloneDeep(epsList)
        var findIdx
        if (mode !== "3") {
            findIdx = _.findIndex(item.adt_users, (user) =>
                user.user_id === selectedItem.user_id && user.audit_type !== "3"
            );
        }
        else {
            findIdx = _.findIndex(item.adt_users, (user) =>
                user.user_id === selectedItem.user_id
            );
        }
        const epIdx = _.findIndex(epsListInfo, { _id: item._id })
        if (findIdx === -1) {
            item.adt_users.push({
                audit_type: mode,
                designation: null,
                email_id: selectedItem.email_id,
                name: selectedItem.name,
                phone_num: selectedItem.phone_num,
                user_code: selectedItem.user_code,
                user_id: selectedItem.user_id
            })
        }
        else {
            console.log(item.adt_users[findIdx]["audit_type"], item, findIdx, action, 'item.adt_users[findIdx]["audit_type"]')
            if (item.adt_users[findIdx]["audit_type"] !== mode && mode !== "3") {
                setresetMultiSelect(false)
                selectedList = selectedList.filter((ele) => {
                    if (ele.user_id !== selectedItem.user_id) {
                        return ele
                    }
                })
                Swal.fire({
                    icon: 'warning',
                    title: 'warning!',
                    text: 'This user is already selected to another task in this location. Try different user.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        setTimeout(() => {
                            setresetMultiSelect(true)

                        }, 200);
                    }
                })
            } else if (action === "remove") {
                if (findIdx !== -1) {
                    item.adt_users.splice(findIdx, 1)
                }
            }
        }

        epsListInfo[epIdx] = item
        setepsList(epsListInfo)

        validateAuditType(epsListInfo);

    }


    const validateAuditType = (epsList) => {
        console.log("epsList", epsList);

        const auditErrors = epsList.map(row =>
            _.some(row.adt_users, { audit_type: "1" })
                ? null
                : "Please select at least one audit user"
        );

        let reviewErrors = [];

        if (auditInfo.settings.enable_review) {
            reviewErrors = epsList.map(row =>
                _.some(row.adt_users, { audit_type: "2" })
                    ? null
                    : "Please select at least one review user"
            );
            setReviewUserErrors(reviewErrors);
        }


        const inChargeErrors = epsList.map(row =>
            _.some(row.adt_users, { audit_type: "3" })
                ? null
                : "Please select at least one inCharge user"
        );

        setAuditUserErrors(auditErrors);
        setInchargeUserErrors(inChargeErrors)

        const isAuditValid = auditErrors.every(err => err === null);
        const isReviewValid = reviewErrors.every(err => err === null);
        const isInchargeValid = inChargeErrors.every(err => err === null);

        return isAuditValid && (!auditInfo.settings.enable_review || isReviewValid) && isInchargeValid;
    };



    return (
        <div>
            <Container>
                <Row className="justify-content-center">
                    <Col md={12}>
                        <Card style={{ border: '1px solid #e9e9e9' }}>
                            <CardBody>
                                <AvForm className="form-horizontal">
                                    <Row className="mb-2">
                                        <Col>
                                            <AvField
                                                name="target_date"
                                                type="date"
                                                label="Audit end date"
                                                errorMessage="Please provide a valid date."
                                                className="form-control"
                                                value={props.auditInfo.audit_end_date}
                                                min={minDate}
                                                onChange={(e) => { setChangedDateInfo(e.target.value) }}
                                                onKeyDown={(e) => { e.preventDefault(); }}
                                                validate={{ required: { value: true } }}
                                                id="td"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Label className=" text-center">Audit Information</Label>
                                            <div className="table-responsive">
                                                {
                                                    dataLoaded ?
                                                        <Table striped bordered hover responsive className="shadow-sm">
                                                            <thead className="thead-dark">
                                                                <tr>
                                                                    <th>{"Location / Asset Name"} </th>
                                                                    <th>Audit User</th>
                                                                    {
                                                                        auditInfo.settings.enable_review &&
                                                                        <th>Review User</th>
                                                                    }
                                                                    <th>Incharge User</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {epsList.map((row, index) => (
                                                                    <tr key={index}>

                                                                        <td>
                                                                            <p className="mb-1 text-primary">{row.hlevel_name}</p>
                                                                        </td>
                                                                        <td style={{ minWidth: '200px', maxWidth: '250px' }}>
                                                                            {resetMultiSelect &&
                                                                                <Multiselect
                                                                                    options={row.unique_users}
                                                                                    displayValue="name"
                                                                                    selectedValues={
                                                                                        _.filter(row.adt_users, { audit_type: "1" }).length > 0 ? _.filter(row.adt_users, { audit_type: "1" }) : []

                                                                                    }
                                                                                    onSelect={(selectedList, selectedItem) => {
                                                                                        changeAuditUserHandler(selectedList, selectedItem, _.cloneDeep(row), "1", 'add')

                                                                                    }}
                                                                                    onRemove={(selectedList, selectedItem) => {
                                                                                        changeAuditUserHandler(selectedList, selectedItem, _.cloneDeep(row), "1", 'remove')
                                                                                    }}
                                                                                    style={{
                                                                                        chips: { background: '#007bff' },
                                                                                        multiselectContainer: { color: 'black' }
                                                                                    }}
                                                                                />
                                                                            }
                                                                            {auditUserErrors[index] && (
                                                                                <p style={{ color: 'red', fontSize: '12px' }}>{auditUserErrors[index]}</p>
                                                                            )}
                                                                        </td>
                                                                        {
                                                                            auditInfo.settings.enable_review && (
                                                                                <td style={{ minWidth: '200px', maxWidth: '250px' }}>
                                                                                    {resetMultiSelect &&

                                                                                        <Multiselect
                                                                                            options={row.unique_users}
                                                                                            displayValue="name"
                                                                                            selectedValues={
                                                                                                _.filter(row.adt_users, { audit_type: "2" }).length > 0
                                                                                                    ? _.filter(row.adt_users, { audit_type: "2" })
                                                                                                    : []
                                                                                            }
                                                                                            onSelect={(selectedList, selectedItem) => {
                                                                                                changeAuditUserHandler(selectedList, selectedItem, _.cloneDeep(row), "2", 'add');
                                                                                            }}
                                                                                            onRemove={(selectedList, selectedItem) => {
                                                                                                changeAuditUserHandler(selectedList, selectedItem, _.cloneDeep(row), "2", 'remove');
                                                                                            }}
                                                                                            style={{
                                                                                                chips: { background: '#28a745' },
                                                                                                multiselectContainer: { color: 'black' }
                                                                                            }}
                                                                                        />
                                                                                    }
                                                                                    {reviewUserErrors[index] && (
                                                                                        <p style={{ color: 'red', fontSize: '12px' }}>{reviewUserErrors[index]}</p>
                                                                                    )}
                                                                                </td>
                                                                            )
                                                                        }
                                                                        <td style={{ minWidth: '200px', maxWidth: '250px' }}>
                                                                            {resetMultiSelect &&

                                                                                <Multiselect
                                                                                    options={row.unique_users}
                                                                                    displayValue="name"
                                                                                    selectedValues={
                                                                                        _.filter(row.adt_users, { audit_type: "3" }).length > 0 ? _.filter(row.adt_users, { audit_type: "3" }) : []

                                                                                    }
                                                                                    onSelect={(selectedList, selectedItem) => {
                                                                                        changeAuditUserHandler(selectedList, selectedItem, _.cloneDeep(row), "3", 'add')

                                                                                    }}
                                                                                    onRemove={(selectedList, selectedItem) => {
                                                                                        changeAuditUserHandler(selectedList, selectedItem, _.cloneDeep(row), "3", 'remove')
                                                                                    }}
                                                                                    style={{
                                                                                        chips: { background: '#007bff' },
                                                                                        multiselectContainer: { color: 'black' }
                                                                                    }}
                                                                                />
                                                                            }
                                                                            {inchargeUserErrors[index] && (
                                                                                <p style={{ color: 'red', fontSize: '12px' }}>{inchargeUserErrors[index]}</p>
                                                                            )}
                                                                        </td>

                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                        :
                                                        <div className="d-flex justify-content-center align-items-start" style={{ height: '100vh' }}>
                                                            <Spinner color="primary" />
                                                        </div>
                                                }

                                            </div>
                                        </Col>
                                    </Row>
                                    {
                                        updatedMsg &&
                                        <div className="alert alert-success text-center mb-4" role="alert">Audit updated successfully.</div>
                                    }
                                    <Row>
                                        <div className="d-flex gap-2 justify-content-end mt-2">
                                            <button className="btn btn-sm btn-outline-danger" type='button' onClick={() => props.onClose()}> Cancel </button>
                                            <button className="btn btn-sm btn-outline-success" disabled={updatedMsg} onClick={() => { updateAuditInfo(changedDataInfo) }}>Update</button>
                                        </div>
                                    </Row>


                                </AvForm>

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )

}
export default UpdateDailyAuditInfo
