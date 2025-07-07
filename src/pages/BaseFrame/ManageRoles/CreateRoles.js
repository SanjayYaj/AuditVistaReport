import React from 'react';
import { useEffect, useState, useHistory } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    Label,
    Input,
    Container,
    FormFeedback,
    Form,
    Table,
} from "reactstrap";
import { Switch, Checkbox } from 'antd'
import * as Yup from "yup";
import { Field, useFormik } from "formik";
import urlSocket from '../../../helpers/urlSocket';
import { _ } from 'core-js';
import Swal from 'sweetalert2';
import MetaTags from 'react-meta-tags'

import Breadcrumbs from "../../../components/Common/Breadcrumb"


const propTypes = {};

const defaultProps = {};

const CreateRoles = () => {
    const navigate = useNavigate();

    const [screenInfo, setScreenInfo] = useState([])
    const [editData, setEditData] = useState({})
    const [userInfo, setUserInfo] = useState({})
    const [readCheckAll, setReadCheckAll] = useState(false)
    const [writeCheckAll, setWriteCheckAll] = useState(false)
    const [RoleStatus, setRoleStatus] = useState(true)
    const [dbUrl, setDbUrl] = useState('')
    const [roleNameErr, setRoleNameErr] = useState(false)

    const [oncreate, setOncreate] = useState(true)
    const [protect, setProtect] = useState({})
    const [addRoles, setAddRoles] = useState([])
    const [selectedFuncRoles, setSelectedFuncRoles] = useState([]);



    const handleFuncRoleChange = (e, role) => {
        const isChecked = !e.target.checked;

        if (isChecked) {
            setSelectedFuncRoles(prev => [...prev, { _id: role._id, func_name: role.func_name, func_id: role.func_id }]);
        } else {
            setSelectedFuncRoles(prev => prev.filter(item => item._id !== role._id));
        }
    };





    useEffect(() => {

        var data = JSON.parse(sessionStorage.getItem('authUser'))
        var role_id = sessionStorage.getItem('role_id')
        setUserInfo(data.user_data)
        var encrypted_db_url = data.db_info.encrypted_db_url
        setDbUrl(encrypted_db_url)
        try {
            urlSocket.post('cog/get-screen-facilities', { encrypted_db_url: encrypted_db_url, user_id: userInfo._id }).then((response) => {

                console.log(response, 'response')

                setAddRoles(response.data.roles)

                var facility_array = response.data.data
                facility_array.map((data, idx) => {
                    if (data.facility_id === "1") {
                        facility_array[idx].read_write_checked = true
                        facility_array[idx].read_checked = false
                    }
                })
                if (response.data.response_code === 500) {
                    if (role_id !== undefined && role_id !== null && role_id !== '') {
                        setOncreate(false)
                        get_role_info(role_id, data.db_info.encrypted_db_url, response.data.data)
                    }
                    else {
                        setOncreate(true)
                        setScreenInfo(facility_array)
                    }
                }
            })

        } catch (error) {

        }

    }, [])


    const get_role_info = (data, encrypted_db_url, state_data) => {

        try {
            urlSocket.post('cog/get-role-info', { role_id: data, encrypted_db_url: encrypted_db_url, user_id: userInfo._id }).then((response) => {
                console.log(response, 'response')
                if (response.data.response_code === 500) {
                    setEditData(response.data.data[0])
                    response.data.data[0].role_status === true ? setRoleStatus(true) : setRoleStatus(false)

                    if (response.data.data[0].tool_access && Array.isArray(response.data.data[0].tool_access)) {
                        setSelectedFuncRoles(response.data.data[0].tool_access);
                    }

                    var facilities = response.data.data[0].facilities
                    console.log(state_data, 'state_data', facilities)
                    state_data.map((data, idx) => {
                        facilities.map((ele, idx1) => {
                            if (data.id === ele.id) {
                                state_data[idx] = facilities[idx1]
                            }
                        })
                    })
                    setScreenInfo(state_data)


                }
            })
        } catch (error) {

        }


    }



    const checkRolenameExist = (value) => {
        var obj_data = {}
        obj_data["role_name"] = value.trim()
        obj_data["encrypted_db_url"] = dbUrl
        obj_data["user_id"] = userInfo._id
        if (Object.keys(editData).length > 0) {
            obj_data["_id"] = editData._id
        }
        if (value !== '' && value !== undefined) {
            try {
                urlSocket.post('cog/check-rolename-exist', obj_data).then((response) => {
                    if (response.data.response_code === 500 && response.data.data.length > 0) {
                        setRoleNameErr(true)
                    }
                    else {
                        setRoleNameErr(false)

                    }
                })

            } catch (error) {

            }
        }

    }


    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            role_name: '' || editData.role_name
        },
        validationSchema: Yup.object({
            role_name: Yup.string().required("Please Enter Role Name")
        }),
        onSubmit: (values) => {
            if (!values.role_name.trim()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Role name cannot be empty.',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK'
                });
                return;
            }

            values["role_status"] = RoleStatus;
            values["encrypted_db_url"] = dbUrl;



            const validate_checkbox = _.filter(screenInfo, element => {
                return element.read_checked === true || element.read_write_checked === true;
            });

            values["facilities"] = validate_checkbox;
            values["_id"] = editData._id;

            if (roleNameErr === false) {
                Swal.fire({
                    icon: 'question',
                    title: 'Are you sure?',
                    text: 'Do you want to save this role?',
                    showCancelButton: true,
                    confirmButtonColor: '#34c38f',
                    confirmButtonText: 'Yes',
                    cancelButtonColor: '#f46a6a',
                    cancelButtonText: 'No',
                    customClass: {
                        icon: 'swal-icon-small',
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log(values, 'values');
                        var updatedValues = []
                        values.facilities.map((ele, idx) => {
                            updatedValues.push({
                                _id: ele._id,
                                read_write_checked: ele.read_write_checked,
                                read_checked: ele.read_checked ? ele.read_checked : false,
                            })
                        })
                        values["facilities"] = updatedValues

                        console.log("values", values)

                        saveRole(values);
                    } else {

                    }
                });
            }

            if (validate_checkbox.length < 1) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'Minimum 1 Screen Information should be selected.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {

                });
            }
        }
    });


    const saveRole = (data) => {
        data["user_id"] = userInfo._id
        data["created_by"] = userInfo._id
        data["tool_access"] = selectedFuncRoles
        try {

            urlSocket.post('cog/crud-roles', data).then((response) => {

                if (response.data.response_code === 500) {
                    navigate('/mroles')
                }
            })

        } catch (error) {

        }

    }



    const onchange_switch = (e, name, idx) => {
        const screen_info = [...screenInfo];

        console.log("screen_info", screen_info)
        const isChecked = !e.target.checked;
        const currentItem = screen_info[idx];

        if (name === 'read_checked') {
            currentItem.read_checked = isChecked;
            if (isChecked) currentItem.read_write_checked = false;

            if (currentItem.type === "group") {
                screen_info.forEach(item => {
                    if (item.parent_id === currentItem.id && item.facility_id !== "1") {
                        item.read_checked = isChecked;
                        item.read_write_checked = false;
                    }
                });
            }

            if (currentItem.parent_id !== null) {
                const siblings = screen_info.filter(i => i.parent_id === currentItem.parent_id);
                const parentIndex = screen_info.findIndex(i => i.id === currentItem.parent_id);
                if (parentIndex !== -1) {
                    const anyRead = siblings.some(i => i.read_checked);
                    screen_info[parentIndex].read_checked = anyRead;
                    if (!anyRead) screen_info[parentIndex].read_write_checked = false;
                }
            }
        }

        else if (name === 'read_write_checked') {
            currentItem.read_write_checked = isChecked;
            if (isChecked) currentItem.read_checked = false;

            if (currentItem.type === "group") {
                screen_info.forEach(item => {
                    if (item.parent_id === currentItem.id && item.facility_id !== "1") {
                        item.read_write_checked = isChecked;
                        item.read_checked = false;
                    }
                });
            }

            if (currentItem.parent_id !== null) {
                const siblings = screen_info.filter(i => i.parent_id === currentItem.parent_id);
                const parentIndex = screen_info.findIndex(i => i.id === currentItem.parent_id);
                if (parentIndex !== -1) {
                    const anyWrite = siblings.some(i => i.read_write_checked);
                    screen_info[parentIndex].read_write_checked = anyWrite;
                    if (anyWrite) screen_info[parentIndex].read_checked = false;
                }
            }
        }

        else if (name === 'read_check_all') {
            const checkAll = !e.target.checked;
            screen_info.forEach(item => {
                if (item.facility_id !== "1") {
                    item.read_checked = checkAll;
                    item.read_write_checked = false;
                }
            });
        }

        else if (name === 'read_write_check_all') {
            const checkAll = !e.target.checked;
            screen_info.forEach(item => {
                if (item.facility_id !== "1") {
                    item.read_write_checked = checkAll;
                    item.read_checked = false;
                }
            });
        }

        const nonSystemItems = screen_info.filter(i => i.facility_id !== "1");



        const allReadChecked = nonSystemItems.length > 0 &&
            nonSystemItems.every(i => i.read_checked === true);

        const allWriteChecked = nonSystemItems.length > 0 &&
            nonSystemItems.every(i => i.read_write_checked === true);



        setReadCheckAll(allReadChecked);
        setWriteCheckAll(allWriteChecked);
        setScreenInfo(screen_info);
    };





    const switch_change = (e, name) => {
        setRoleStatus(e)
    }

    const gotoBack = () => {
        sessionStorage.removeItem('role_id')
        navigate('/mroles')
    }


    const handleRoleNameBlur = async () => {
        const value = validation.values.role_name;
        if (value) {
            try {
                await checkRolenameExist(value);
            } catch (error) {
            }
        }
    };

    const handleInputChange = (event) => {
        setRoleNameErr(false);
        validation.handleChange(event);
    };


    const handleKeyDown = async () => {
        const value = validation.values.role_name;
        if (value) {
            try {
                await checkRolenameExist(value);
                setRoleNameErr(true);
            } catch (error) {
                setRoleNameErr(false);
            }

        }
    };



    return (

        <div className="page-content">

            <MetaTags>
                <title>{oncreate ? 'Create Roles' : 'Edit Roles'} | AuditVista</title>
            </MetaTags>
            <Breadcrumbs
                title="Roles"
                breadcrumbItem={oncreate ? "Create Role" : "Edit Role"}
                isBackButtonEnable={true}
                gotoBack={() => gotoBack()}
            />
            <Container fluid>

                <Card>
                    <CardBody>
                        <Form className="needs-validation"
                            onSubmit={(e) => {
                                e.preventDefault();
                                validation.handleSubmit();
                                return false;
                            }}
                        >




                            <Row className=' border-bottom border-secondary border-opacity-25 mb-3'>
                                <Col md={3}>
                                    <Label>
                                        {oncreate ? "New Role Name" : "Role Name"}
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <FormGroup>
                                        <Input
                                            name="role_name"
                                            placeholder="Enter the Role Name"
                                            type="text"
                                            className="form-control"
                                            onChange={handleInputChange}
                                            onBlur={handleRoleNameBlur}
                                            onKeyDown={handleKeyDown}
                                            value={validation.values.role_name || ""}
                                            invalid={
                                                validation.touched.role_name && validation.errors.role_name
                                            }
                                        />
                                        {roleNameErr && (
                                            <label className="text-danger" style={{ fontSize: 'smaller' }}>
                                                Role Name already exists
                                            </label>
                                        )}
                                        {validation.touched.role_name && validation.errors.role_name && (
                                            <FormFeedback type="invalid">
                                                {validation.errors.role_name}
                                            </FormFeedback>
                                        )}
                                    </FormGroup>
                                </Col>

                                {Object.keys(editData).length !== 0 && (
                                    <Col md={9} className="d-flex align-items-center justify-content-end">
                                        <div>
                                            <Label className='mt-2 me-2'>Inactive</Label>
                                        </div>
                                        <div>
                                            <Switch
                                                size={'small'}
                                                value={RoleStatus}
                                                checked={!!RoleStatus}
                                                onChange={(e) => switch_change(e, 'role_status')}
                                            />
                                        </div>
                                        <div className='ms-2'>
                                            <Label className='mt-2 me-2 text-primary'>Active</Label>
                                        </div>
                                    </Col>
                                )}
                            </Row>

                            <Row className='border-bottom border-secondary border-opacity-25 mb-3 pb-3' >
                                <Col md={12}>
                                    <Label>
                                        Audit Role(s)
                                    </Label>
                                    <div className="d-flex flex-wrap gap-4 mt-2">
                                        {addRoles.map(role => (
                                            <div key={role._id} className="form-check form-check-buttonPrimaryE">
                                                <Input
                                                    type="checkbox"
                                                    className="form-check-input "
                                                    id={`func-role-${role._id}`}
                                                    checked={selectedFuncRoles.some(item => item._id === role._id)}
                                                    onClick={(e) => handleFuncRoleChange(e, role)}
                                                />
                                                <Label
                                                    className="form-check-label text-secondary" style={{fontWeight:400}}
                                                    htmlFor={`func-role-${role._id}`}
                                                >
                                                    {role.func_name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </Col>
                            </Row>

                            <Row >
                                <Col md={12}>
                                    <Label>
                                        Assign the responsibility(ies) for the Role
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <div className="table-responsive">


                                        <Table className="table align-middle">

                                            <thead className="table-light">
                                                <tr>
                                                    <th width="5%"
                                                        style={{
                                                            borderBottomWidth: 0,
                                                            borderTopLeftRadius: 25,
                                                            borderBottomLeftRadius: 25,
                                                            paddingLeft: "20px",
                                                        }}
                                                    >Type</th>
                                                    <th width="65%"
                                                        style={{
                                                            borderBottomWidth: 0,
                                                            minWidth: 200
                                                        }}
                                                    >Responsibilities</th>

                                                    <th width="10%"
                                                        style={{
                                                            borderBottomWidth: 0,
                                                            minWidth: 200
                                                        }}
                                                    >
                                                        <Checkbox
                                                            name="read_write_check_all"
                                                            checked={writeCheckAll}
                                                            onClick={(e) => onchange_switch(e, "read_write_check_all")}
                                                            className="me-2"
                                                        />
                                                        Read & Write
                                                    </th>
                                                    <th width="10%"
                                                        style={{
                                                            borderBottomWidth: 0,
                                                            borderTopRightRadius: 25,
                                                            borderBottomRightRadius: 25,
                                                            minWidth: 200
                                                        }}
                                                    >
                                                        <Checkbox
                                                            name="read_check_all"
                                                            checked={readCheckAll}
                                                            disabled={writeCheckAll === true}
                                                            onClick={(e) => onchange_switch(e, "read_check_all")}
                                                            className="me-2"
                                                        />
                                                        Read Only
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {screenInfo
                                                    .filter(item => item.parent_id === null)
                                                    .map((parentItem) => {
                                                        const parentIndex = screenInfo.findIndex(item => item.id === parentItem.id);
                                                        return (
                                                            <React.Fragment key={parentItem.id}>
                                                                <tr className="table-row-hover">
                                                                    <td className={`font-size-12 text-capitalize ps-4 ${parentItem.type === "menu" ? "text-buttonPrimaryE" : "text-secondary fw-bold"}`}>
                                                                        <div>
                                                                            <i className={`font-size-14 ${parentItem.type === "menu" ? "mdi mdi-link" : "mdi mdi-folder-text-outline"} me-2`} />
                                                                        </div>
                                                                    </td>
                                                                    <td className={`font-size-12 ${parentItem.type === "menu" ? "text-buttonPrimaryE" : "text-secondary fw-bold"}`}>
                                                                        {/* {parentItem.icon_name && (
                                                                            <i className={`${parentItem.icon_name} me-2`}></i>
                                                                        )} */}
                                                                        {parentItem.interfacename}
                                                                    </td>

                                                                    <td>
                                                                        <Checkbox
                                                                            disabled={parentItem.facility_id === "1"}
                                                                            checked={!!parentItem.read_write_checked}
                                                                            onClick={(e) =>
                                                                                onchange_switch(e, "read_write_checked", parentIndex)
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Checkbox
                                                                            checked={!!parentItem.read_checked}
                                                                            disabled={!!parentItem.read_write_checked}
                                                                            onClick={(e) =>
                                                                                onchange_switch(e, "read_checked", parentIndex)
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>

                                                                {parentItem.type === "group" &&
                                                                    screenInfo
                                                                        .filter(child => child.parent_id === parentItem.id)
                                                                        .map(childItem => {
                                                                            const childIndex = screenInfo.findIndex(item => item.id === childItem.id);
                                                                            return (
                                                                                <tr key={childItem.id} className="table-row-hover">
                                                                                    <td className={`font-size-12 text-capitalize ps-4 ${childItem.type === "menu" ? "text-buttonPrimaryE" : "text-secondary fw-bold"}`}>
                                                                                        <div>
                                                                                            <i className={`font-size-14 ${childItem.type === "menu" ? "mdi mdi-link" : "mdi mdi-folder-text-outline"} me-2`} />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className={`font-size-12 ${childItem.type === "menu" ? "text-buttonPrimaryE" : "text-secondary fw-bold"}`} style={{ paddingLeft: "30px" }}>
                                                                                        {/* <i className="fas fa-arrow-right me-2 text-muted"></i> */}
                                                                                        {/* {childItem.icon_name && (
                                                                                            <i className={`${childItem.icon_name} me-2`}></i>
                                                                                        )} */}
                                                                                        {childItem.interfacename}
                                                                                    </td>

                                                                                    <td>
                                                                                        <Checkbox
                                                                                            disabled={childItem.facility_id === "1"}
                                                                                            checked={!!childItem.read_write_checked}
                                                                                            onClick={(e) =>
                                                                                                onchange_switch(e, "read_write_checked", childIndex)
                                                                                            }
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Checkbox
                                                                                            checked={!!childItem.read_checked}
                                                                                            disabled={!!childItem.read_write_checked}
                                                                                            onClick={(e) =>
                                                                                                onchange_switch(e, "read_checked", childIndex)
                                                                                            }
                                                                                        />
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                            </React.Fragment>
                                                        );
                                                    })}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>
                            </Row>






                            {/* Action Buttons */}
                            <Row className="mt-4">
                                <Col md={12} className="text-end">
                                    <button className="btn btn-sm btn-outline-danger me-2" onClick={() => navigate('/mroles')} >
                                        Cancel
                                    </button>
                                    <button className={`btn btn-sm btn-outline-${oncreate ? 'success' : 'info'}`} disabled={protect.read_checked} >
                                        {oncreate ? "Create Role" : "Update Role"}
                                    </button>
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        </div>
    )

}

CreateRoles.propTypes = propTypes;
CreateRoles.defaultProps = defaultProps;

export default CreateRoles;