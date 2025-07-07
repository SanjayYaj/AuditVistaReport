import React from 'react';
import { useEffect, useState, useRef } from 'react'
import { Row, Col, Card, CardBody, Button, UncontrolledTooltip } from 'reactstrap';
import { AvForm, AvField } from "availity-reactstrap-validation"
import urlSocket from '../../../helpers/urlSocket'
import { useDispatch, useSelector } from 'react-redux';
import { crudNewUser, checkUserAvailableApi, updateUserStatus, updtPublishedLocation, setphoneNumExist, setEmailExist } from '../../../toolkitStore/Auditvista/aplnfollowup/aplnflwupslice';
import store from '../../../store';
import { LoadingOutlined } from '@ant-design/icons'

const CreateNewUser = (props) => {
    const formRef = useRef(null);
    const [acplanRoleInfo, setacplanRoleInfo] = useState([])
    const [rolePermisson, setrolePermisson] = useState("")
    const [locationInfo, setLocationInfo] = useState(JSON.parse(sessionStorage.getItem("endpointData")))
    const [sessionUserInfo, setsessionUserInfo] = useState(JSON.parse(sessionStorage.getItem("authUser")))
    const [clientInfo, setclientInfo] = useState(JSON.parse(sessionStorage.getItem("client_info"))[0])
    const [countryCode, setcountryCode] = useState("+91")
    const [invalidEmail, setInvalidEmail] = useState(false)
    const [roleErr, setroleErr] = useState(false)
    const [historyPermission, setHistoryPermission] = useState('1');
    const [Name, setName] = useState('')
    const [exist, setexist] = useState(null)
    const [isPhone, setIsPhone] = useState(false);
    const [loading, setloading] = useState(false);
    const [assignUser, setassignUser] = useState(false);
    const [enableRole, setenableRole] = useState(false);
    const [userExist, setuserExist] = useState("");



    const dispatch = useDispatch()
    const followUpSlice = useSelector(state => state.acplnFollowUpSliceReducer)
    const phoneNumExist = followUpSlice.phoneNumExist
    const [errors, setErrors] = useState({});

    useEffect(() => {
        var roleInfo = JSON.parse(sessionStorage.getItem("authUser")).config_data.action_plan_roles
        var roleInfo = roleInfo.filter((e) => {
            if (e.id >= followUpSlice.validUser[0].id) {
                return e
            }
        })
        setacplanRoleInfo(roleInfo)
    }, [])


    const ExisttaskUserAddInfo = (userIdx) => {
        dispatch(updateUserStatus(props.selectedActionplan.task_users[userIdx], props.selectedActionplan._id, props.selectedActionplan, props.selectedCheckpoint, locationInfo))
        setcountryCode(null)
        setrolePermisson("")
        dispatch(setEmailExist(false))
        dispatch(setphoneNumExist(false))
        props.onClose()
        setexist(null)
        setHistoryPermission("1")
        setroleErr(false);
        setassignUser(false)
        setenableRole(false)

    }

    const taskUserAddInfo = () => {
        var followUpSlice = store.getState().acplnFollowUpSliceReducer
        const userId = followUpSlice.existUser ? followUpSlice.existUser._id : followUpSlice.userInfo[0]["_id"];
        const commonUserData = {
            _id: userId,
            name: followUpSlice.existUser ? followUpSlice.existUser.firstname : followUpSlice.userInfo[0]["firstname"],
            title: locationInfo.location_name,
            user_id: userId,
            role_permission: rolePermisson,
            history_permission: historyPermission,
            id: rolePermisson.id,
            role_name: rolePermisson.role_name,
            facilities: rolePermisson.facilities,
            user_status: "0",
            email_id: followUpSlice.existUser ? followUpSlice.existUser.email_id : followUpSlice.userInfo[0]["email_id"],
            phone_num: followUpSlice.existUser ? followUpSlice.existUser.phone_number : followUpSlice.userInfo[0]["phone_number"],
        };

        locationInfo.location_user_path.push({
            ...commonUserData,
        });

        locationInfo["created_user"] = {
            ...commonUserData,
        };

        locationInfo.location_unique_users.push({
            ...commonUserData,
        });

        locationInfo.location_permission_acpln.push({
            ...commonUserData,
            role_description: rolePermisson.role_description,
        });


        locationInfo['recent_user'] = followUpSlice.existUser ? followUpSlice.existUser : followUpSlice.userInfo[0]

        dispatch(updtPublishedLocation(locationInfo, sessionUserInfo, rolePermisson, historyPermission, props.selectedActionplan, props.selectedCheckpoint))
        formRef.current?.reset()
        setrolePermisson("")
        dispatch(setEmailExist(false))
        dispatch(setphoneNumExist(false))
        props.onClose()
        setexist(null)
        setHistoryPermission("1")
        setroleErr(false);
        setloading(false)
        setassignUser(false)
        setenableRole(false)
        setcountryCode("")
        setIsPhone(false)


    }



    const Validsubmit = async (events, values) => {
        if (exist === null) {
            if (isPhone) {
                if (String(countryCode).length === 0) {
                    setloading(false)
                    setErrors({
                        phone_number: "Please select country code.",
                    })
                    return
                }
                else {
                    setloading(true)
                    checkUserExist(2, values);
                }
            }
            else {
                setloading(true)
                checkUserExist(1, values);
            }
        }
        else {
            if (!rolePermisson) {
                setroleErr(true);
            } else {

                await validateExistValue(isPhone ? values.email_id.trim() : values.phone_number.trim(), "cln_adt_users", isPhone ? "email_id" : "phone_number").then(async (status) => {
                    setloading(true)
                    if (!assignUser) {
                        values["userPoolId"] = clientInfo.userPoolId
                        values["clientId"] = clientInfo.clientId
                        values["fullNo"] = isPhone ? countryCode + values.phone_number : undefined
                        if (status === 'success') {
                            await dispatch(crudNewUser(values))
                        }


                    }
                    if (status === 'success') {
                        await taskUserAddInfo()
                    }
                    else {
                        setloading(false)

                    }
                })

            }


        }
    };


    const checkValidEmail = (e) => {
        var email = e.target.value
        if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            setInvalidEmail(false)
        }
        else {
            setInvalidEmail(true)
        }
    }

    const checkUserExist = async (mode, value) => {
        var admn_info = {}
        if (mode == 1) {
            admn_info["email_id"] = value["email_id"]
        }
        if (mode === 2) {
            admn_info["phone_number"] = value["phone_number"]
        }

        admn_info["encrypted_db_url"] = sessionUserInfo.db_info.encrypted_db_url
        admn_info["db_name"] = sessionUserInfo.db_info.db_name
        admn_info["user_id"] = sessionUserInfo.user_data._id
        var responseInfo = await dispatch(checkUserAvailableApi(admn_info, mode))
        if (responseInfo.length > 0) {
            let existUserInfo = _.filter(props.selectedActionplan.task_users, { user_id: responseInfo[0]["_id"] })
            if (existUserInfo.length > 0) {
                if (existUserInfo[0]['user_status'] === "0") {
                    setloading(false)
                    setErrors({
                        info: "This user already exist in this task.",
                    })
                    setTimeout(() => {
                        setErrors({})
                    }, 2500);
                }
                if (existUserInfo[0]['user_status'] === "1" || existUserInfo[0]['user_status'] === "2") {
                    setloading(false)
                    setassignUser(true)
                }
            }
            else {
                setloading(false)
                setassignUser(true)
                setenableRole(true)
            }
        }
        else {
            setloading(false)
            setexist(false)

        }
    }

    const selectRole = (event) => {
        var id = event.target.value
        var getSelectedRole = _.filter(acplanRoleInfo, { id: Number(id) })
        if (getSelectedRole.length > 0) {
            setrolePermisson(getSelectedRole[0])
            setroleErr(false)
        }
    }


    const validateExistValue = async (value, dynamic_cln, dynamic_key) => {

        const authUser = JSON.parse(sessionStorage.getItem("authUser"));

        try {
            const responseData = await urlSocket.post("cog/dup-name-validation", {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                db_name: authUser.db_info.db_name,
                dynamic_cln: dynamic_cln,
                dynamic_key: dynamic_key,
                editInfo: null,
                dynamic_value: value
            })
            if (responseData.status === 200) {
                if (responseData.data.data.length > 0) {
                    setuserExist(dynamic_key === "email_id" ? "Email Id already exist to another user." : "Mobile Number already exist to another user.")
                    return "error"
                }
                else {
                    setuserExist("")
                    return "success"
                }

            }

        } catch (error) {

        }
    }


    if (assignUser) {
        return (
            <div className='mt-3'>
                <Row className='m-0' >
                    <Col lg="12">


                        <Card className="border shadow-sm bg-light">
                            <CardBody>
                                <div className="mb-2 text-center">
                                    <h5 className="text-primary fw-bold">User Already Exists</h5>
                                </div>

                                <div className="mb-2">
                                    <div>
                                        <span className='text-muted'>Name:</span> <strong>{followUpSlice.existUser.firstname}</strong>
                                    </div>
                                    <div>
                                        <span className='text-muted'>Email:</span> <strong>{followUpSlice.existUser.email_id}</strong>
                                    </div>
                                    <div>
                                        <span className='text-muted'>Phone:</span> <strong>{followUpSlice.existUser.phone_number || "Not Provided"}</strong>
                                    </div>
                                </div>

                                {enableRole && (
                                    <div className="mb-4">
                                        <div className="mb-2">
                                            <label htmlFor="roleSelect" className="form-label mb-1"> Select Role </label>
                                            <select
                                                id="roleSelect"
                                                value={rolePermisson?.id || ""}
                                                onChange={(e) => selectRole(e)}
                                                className="form-select"
                                            >
                                                <option value="" disabled>
                                                    Choose a role
                                                </option>
                                                {acplanRoleInfo.map((data, idx) => (
                                                    <option key={idx} value={data.id}>
                                                        {data.role_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-check form-switch">
                                            <input
                                                type="checkbox"
                                                id="historySwitch"
                                                className="form-check-input"
                                                checked={historyPermission === "0"}
                                                onChange={(e) => setHistoryPermission(e.target.checked ? "0" : "1")}
                                            />
                                            <label className="form-check-label" htmlFor="historySwitch">
                                                Show Conversation History
                                            </label>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-3 text-center">
                                    <p className="text-muted">
                                        <strong>Do you want to assign this task to this user?</strong>
                                    </p>
                                </div>

                                <div className="d-flex gap-3 justify-content-center">
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => {
                                            setassignUser(false);
                                            setenableRole(false);
                                            setrolePermisson("");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => {
                                            const existUserIdx = _.findIndex(props.selectedActionplan.task_users, {
                                                user_id: followUpSlice.existUser._id,
                                            });

                                            if (existUserIdx !== -1) {
                                                ExisttaskUserAddInfo(existUserIdx);
                                            } else {
                                                if (rolePermisson) {
                                                    taskUserAddInfo();
                                                } else {
                                                    setErrors({ info: "Please select a role!" });
                                                    setTimeout(() => setErrors({}), 2500);
                                                }
                                            }
                                        }}
                                    >
                                        Assign
                                    </button>
                                </div>

                                {errors.info && (
                                    <div className="alert alert-danger mt-3 text-center">
                                        {errors.info}
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
    else {
        return (
            <div className='mt-3'>
                <Row className='m-0' >
                    <Col lg="12">
                        <Card className='bg-light'>
                            <CardBody>

                                {exist !== null &&
                                    <>
                                        <div className='text-end'>
                                            <button id={`edit`} className="btn btn-sm btn-soft-primary" style={{ cursor: 'pointer' }} onClick={() => { setexist(null); setuserExist("") }}>
                                                <i className="bx bx-edit-alt" />
                                            </button>
                                            <UncontrolledTooltip placement="top" target={`edit`}>
                                                Edit
                                            </UncontrolledTooltip>
                                        </div>
                                    </>

                                }
                                <AvForm ref={formRef} className="form-horizontal" onValidSubmit={Validsubmit}>
                                    <div className="mb-1">
                                        <label>E-MAIL / MOBILE NUMBER<span className="text-danger"> *</span></label>

                                        <div className={`${isPhone ? 'd-flex' : ''}`}>
                                            <Row>
                                                {isPhone && (
                                                    <Col md={4} className="pe-0">
                                                        <select name="countrycode"
                                                            onChange={(e) => {
                                                                setcountryCode(e.target.value);
                                                                setErrors({})
                                                            }}
                                                            value={countryCode}
                                                            disabled={exist !== null ? true : false}
                                                            className="form-select" required>
                                                            <option disabled value={""}>Select</option>
                                                            {
                                                                clientInfo.countries.map((c, idx) => (
                                                                    <option key={idx} value={c.code}>
                                                                        {c.code}{""}&nbsp;{c.label}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                    </Col>
                                                )}
                                                <Col md={isPhone ? 8 : 12} className="px-1">
                                                    <AvField
                                                        name={`${isPhone ? "phone_number" : 'email_id'}`}
                                                        className="form-control"
                                                        placeholder="Enter Email ID / Mobile Number"
                                                        type={`${isPhone ? 'number' : 'text'}`}
                                                        onKeyDown={(e) => { e.key == "Enter" ? e.preventDefault() : console.log("") }}
                                                        disabled={exist !== null ? true : false}
                                                        onChange={(e) => {
                                                            var inputValue = e.target.value;
                                                            inputValue = /^\d+$/.test(inputValue)
                                                            setIsPhone(inputValue);
                                                            if (!inputValue) {
                                                                checkValidEmail(e)
                                                            }
                                                            else {
                                                                setInvalidEmail(false)
                                                            }

                                                            setErrors({})
                                                        }}
                                                        validate={{
                                                            required: { value: true, errorMessage: "This field is required" },
                                                            pattern: {
                                                                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$|^\d+$/,
                                                                errorMessage: "Invalid email or Mobile number format",
                                                            },
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        {errors.phone_number && <div className='text-danger' style={{ fontSize: "smaller" }}>{errors.phone_number}</div>}
                                        {
                                            phoneNumExist &&
                                            <div className="text-danger mt-1" style={{ fontSize: 'smaller' }}>Mobile Number already exist fo another user</div>
                                        }
                                        {errors.email_id && <div className='text-danger' style={{ fontSize: "smaller" }}>{errors.email_id}</div>}
                                    </div>
                                    {
                                        exist ?
                                            <>
                                                <label>Role Permission :<span className="text-danger"> *</span></label>
                                                <div className="mb-3">
                                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                        {
                                                            <div className="select-container">
                                                                <select defaultValue={rolePermisson?.id == null ? "Select Role" : rolePermisson.id}
                                                                    onChange={(e) => {
                                                                        selectRole(e)
                                                                    }}
                                                                    className='form-select'
                                                                >
                                                                    <option disabled value={'Select Role'}>{"Select Role"}</option>
                                                                    {
                                                                        acplanRoleInfo.map((data, idx) => (
                                                                            <option key={idx} value={data.id}>{data.role_name} </option>
                                                                        ))
                                                                    }

                                                                </select>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                {
                                                    roleErr &&
                                                    <div className='text-danger' style={{ fontSize: 'smaller' }}>Please Select the User role</div>
                                                }
                                                <div className="mb-3">
                                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                        <div className="form-check mx-2 form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                role="switch"
                                                                id="flexSwitchCheckDefault"
                                                                checked={historyPermission === '0'}
                                                                onChange={(e) => {
                                                                    setHistoryPermission(e.target.checked ? '0' : '1');
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                                Show conversation history
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            exist === false ?
                                                <>
                                                    <div className="mb-1">
                                                        <label>Full Name :<span className="text-danger"> *</span></label>
                                                        <AvField
                                                            name="firstname"
                                                            errorMessage="Please enter your name"
                                                            className="form-control"
                                                            placeholder="Enter First Name"
                                                            type="text"
                                                            value={Name}
                                                            required
                                                        />
                                                    </div>
                                                    <label>{isPhone ? "Email Id" : "Mobile Number"} :</label>
                                                    <div className={`${!isPhone ? 'd-flex' : ''}`}>
                                                        <Row>
                                                            {!isPhone && (
                                                                <Col md={4} className="pe-0">
                                                                    <select name="countrycode"
                                                                        onChange={(e) => {
                                                                            setcountryCode(e.target.value);
                                                                            setErrors({})
                                                                        }}
                                                                        value={countryCode}
                                                                        className="form-select" required>
                                                                        <option disabled value={""}>Select</option>
                                                                        {
                                                                            clientInfo.countries.map((c, idx) => (
                                                                                <option key={idx} value={c.code}>
                                                                                    {c.code}{""}&nbsp;{c.label}
                                                                                </option>
                                                                            ))
                                                                        }
                                                                    </select>
                                                                </Col>
                                                            )}
                                                            <Col className={!isPhone && "ps-0"}>
                                                                <AvField
                                                                    name={`${isPhone ? "email_id" : 'phone_number'}`}
                                                                    className="form-control"
                                                                    placeholder={`Enter ${isPhone ? 'Email ID' : 'Mobile Number'}`}
                                                                    type={`${isPhone ? 'text' : 'number'}`}
                                                                    onKeyDown={(e) => { e.key == "Enter" ? e.preventDefault() : console.log("") }}
                                                                    validate={{
                                                                        pattern: {
                                                                            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$|^\d+$/,
                                                                            errorMessage: "Invalid email or Mobile number format",
                                                                        },
                                                                    }}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    {String(userExist).length > 0 &&
                                                        <div className='text-danger' style={{ fontSize: "smaller" }}>
                                                            {userExist}
                                                        </div>
                                                    }

                                                    <label>Role Permission :<span className="text-danger"> *</span></label>
                                                    <div className="mb-3">
                                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                            {
                                                                <div className="select-container">
                                                                    <select defaultValue={rolePermisson?.id == null ? "Select Role" : rolePermisson.id}
                                                                        onChange={(e) => {
                                                                            selectRole(e)
                                                                        }}
                                                                        className='form-select'
                                                                    >
                                                                        <option disabled value={'Select Role'}>{"Select Role"}</option>
                                                                        {
                                                                            acplanRoleInfo.map((data, idx) => (
                                                                                <option key={idx} value={data.id}>{data.role_name} </option>
                                                                            ))
                                                                        }

                                                                    </select>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        roleErr &&
                                                        <div className='text-danger' style={{ fontSize: 'smaller' }}>Please Select the User role</div>
                                                    }

                                                    <div className="mb-3">
                                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                            <div className="form-check mx-2 form-switch">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    role="switch"
                                                                    id="flexSwitchCheckDefault"
                                                                    defaultChecked={historyPermission === '0'}
                                                                    onChange={(e) => {
                                                                        setHistoryPermission(prev => prev === '0' ? '1' : '0');
                                                                    }}
                                                                />
                                                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                                    Show conversation history
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>


                                                </>
                                                :
                                                <>
                                                </>

                                    }
                                    {
                                        invalidEmail &&
                                        <div className="text-danger mt-1" style={{ fontSize: 'smaller' }}>Please Enter a valid Email ID</div>
                                    }
                                    <div >
                                        <Button
                                            disabled={loading}
                                            style={{ width: "100%" }} type='submit' className={
                                                loading ? 'btn btn-secondary' : 'btn btn-danger'
                                            }>
                                            {loading ? (
                                                <>
                                                    <LoadingOutlined style={{ marginRight: '0.5rem' }} />
                                                    Checking...
                                                </>
                                            ) : ('Submit')}
                                        </Button>
                                        {
                                            errors.info &&
                                            <div className="alert alert-secondary text-center my-2" role="alert">{errors.info}</div>

                                        }

                                    </div>
                                </AvForm>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>

        );
    }
}


export default CreateNewUser;