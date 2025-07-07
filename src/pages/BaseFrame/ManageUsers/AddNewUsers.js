import React, { useEffect, useRef, useState, useCallback } from 'react'
import { CardBody, Container, Row, Col, Card, Form, Input, Label, FormFeedback, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import { useNavigate } from 'react-router-dom'
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from 'react-redux';
import { setUserMailIdExist, setUserNumExist, setEditUserInfo, retriveRoleData, createUserInfo, retriveUserInfo, validateExistValue } from '../../../toolkitStore/Auditvista/userSlice';
import store from '../../../store';
// import { useAsyncDebounce } from "react-table"; // Import useAsyncDebounce
import 'bootstrap/dist/css/bootstrap.min.css';
import { retriveDesignationInfo, createDesignation, createDeptInfo, setDepartmentExist, setDesignationExist, IRTvalidateDupName, retriveDeptInfo } from 'toolkitStore/Auditvista/orgSlice';
import { Multiselect } from 'multiselect-react-dropdown'
import { usePermissions } from 'hooks/usePermisson';
import urlSocket from 'helpers/urlSocket';
import { useValidationDebounce } from '../../../utils/useValidationDebounce'; 
const IRAddUser = () => {

    const { canView, canEdit } = usePermissions("murs");
        const { debouncedEmailValidation, debouncedPhoneValidation } = useValidationDebounce(500);


    const navigate = useNavigate();
    const dispatch = useDispatch();
    const IR_UserSlice = useSelector(state => state?.userSlice);
    const IR_OrgSlice = useSelector(state => state?.orgSlice);

    const authUser = JSON.parse(sessionStorage.getItem("authUser"))
    const [clientInfo, setClientInfo] = useState(JSON.parse(sessionStorage.getItem("client_info")))[0]
    const [userInfo, setUserInfo] = useState(null)
    const [enabelIncdType, setEnableIncdType] = useState(false)
    const [dataLoaded, setdataLoaded] = useState(sessionStorage.getItem("userId") ? false : false)
    const [checkedKeys, setcheckedKeys] = useState([])
    const [selectedLocation, setSelectedLocation] = useState(false)
    const [disabledKeys, setDisabledKeys] = useState([]);


    const [showModal, setShowModal] = useState(false);
    const [newDeptName, setNewDeptName] = useState("");
    const [newDeptCode, setNewDeptCode] = useState("");
    const [options, setOptions] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [modal, setModal] = useState(false);
    const [newDesignation, setNewDesignation] = useState("");
    const [resetMiltiSelect, setresetMiltiSelect] = useState(true);
    const [branchList, setBranchList] = useState([]);

    const [selectedBranch, setSelectedBranch] = useState([]);
    const [selectedDeptId, setSelectedDeptId] = useState([]);
    const [selectedDesignation, setSelectedDesignation] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const multiRef = useRef()
    const multiBranchRef = useRef()

    useEffect(() => {
        const initialize = async () => {
            try {
                const userId = sessionStorage.getItem("userId");
                document.title = userId ? "Edit User | Auditvista" : "Create User | Auditvista";
                //  var response = await dispatch(retriveDeptInfo())
                // if (response.status === 200) {
                //     setOptions([
                //         { dept_name: "+ Add New Department", dept_code: "new", _id: "new_dept" },
                //         ...response.data.deptInfo.map((map) => ({
                //             dept_name: map.dept_name,
                //             dept_code: map.dept_code || '',
                //             _id: map._id,
                //         })),
                //     ]);

                await dispatch(retriveRoleData());
                await dispatch(retriveDesignationInfo());
                await retriveBranchInfo()

                dispatch(setUserMailIdExist(false))
                dispatch(setUserNumExist(false))
                if (userId) {
                    const userInfo = await dispatch(retriveUserInfo(userId));
                    console.log(userInfo, 'userInfo')
                    setUserInfo(userInfo)
                    setSelectedDeptId(userInfo.dept_id)
                    setSelectedDesignation(userInfo.designation)
                    setSelectedBranch(userInfo.branch_id)
                    setSelectedRoles(userInfo.role_info)
                    validation.setValues(userInfo);
                    setdataLoaded(true)
                } else {
                    dispatch(setEditUserInfo(null))
                    setTimeout(() => {
                        validation.resetForm()
                        setdataLoaded(true)
                    }, 500)
                }
            // }
            } catch (error) {
                console.log('error', error);
            }
        };

        initialize();
    }, []);

    useEffect(() => {
        setOptions([
            { dept_name: "+ Add New Department", dept_code: "new", _id: "new_dept" },
            ...IR_UserSlice.deptData.map((map) => ({
                dept_name: map.dept_name,
                dept_code: map.dept_code,
                _id: map._id,
            })),
        ]);
    }, [IR_UserSlice?.deptData]);

    useEffect(() => {
        if (options.length === 2) {
            setSelectedDeptId([options[1]])
        } else {
            setSelectedDeptId([])
        }
    }, [options]);

    const validation = useFormik({
        initialValues: {
            fullname: sessionStorage.getItem("userId") ? IR_UserSlice.editUserInfo?.fullname : "",
            email_id: "",
            countrycode: sessionStorage.getItem("userId") ? (IR_UserSlice.editUserInfo?.countrycode ?? "") : "",
            phone_number: sessionStorage.getItem("userId") ? (IR_UserSlice.editUserInfo?.phone_number ?? "") : "",

            dept_id: [],
            branch_id: [],

        },

        validationSchema: Yup.object().shape({
            fullname: Yup.string()
                .required("Name is required")
                .matches(/\S+/, "Name cannot be just spaces")
                .min(clientInfo.incd_rpt_validation.name_min, `Name must be at least ${clientInfo.incd_rpt_validation.name_min} characters`),

            email_id: Yup.string()
                .email("Invalid email format")
                .nullable()
                .test("email-or-phone", "Either Email or Phone number is required", function (value) {
                    const { phone_number } = this.parent;
                    return !!value || !!phone_number;
                }),
            countrycode: Yup.string().nullable()
                .test('countrycode-required', 'Country code is required if phone number is provided', function (value) {
                    const { phone_number } = this.parent;
                    if (phone_number && phone_number.length > 0) {
                        return !!value && value !== 'Select';
                    }
                    return true;
                }),

            phone_number: Yup.string()
                .nullable()
                .test('phone-required', 'Phone number is required if Email is not provided', function (value) {
                    const { email_id } = this.parent;
                    return !!value || !!email_id;
                }),

            dept_id: Yup.array()
                .min(1, "Department is required.").of(
                    Yup.object().shape({
                        _id: Yup.string().required(),
                        dept_name: Yup.string().required(),
                    })
                ),

            branch_id: Yup.array()
                .min(1, "Branch is required.")
                .of(
                    Yup.object().shape({
                        _id: Yup.string().required(),
                        br_name: Yup.string().required(),
                    })
                ),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            var updatedValues = _.cloneDeep(values);

            try {
                // Let's validate email and phone once before submitting
                if (values.email_id) {
                    await dispatch(validateExistValue(
                        store.getState().userSlice.editUserInfo,
                        "cln_adt_users",
                        "email_id",
                        values.email_id,
                        setUserMailIdExist
                    ));
                }

                if (values.phone_number) {
                    await dispatch(validateExistValue(
                        store.getState().userSlice.editUserInfo,
                        "cln_adt_users",
                        "phone_number",
                        values.phone_number,
                        setUserNumExist
                    ));
                }

                // Check if there are validation errors from the API
                if (IR_UserSlice.userMailIdExist || IR_UserSlice.userNumExist) {
                    setSubmitting(false);
                    return;
                }

                var dept_id_result = selectedDeptId.map(department => ({ _id: department._id, dept_name: department.dept_name }));
                updatedValues["dept_id"] = dept_id_result;

                updatedValues["designation"] =
                    IR_OrgSlice?.designationData && IR_OrgSlice?.designationData.length === 1
                        ? IR_OrgSlice?.designationData.map(design => ({ _id: design._id, desgn_name: design.desgn_name }))
                        : IR_OrgSlice?.designationData
                            .filter(design => selectedDesignation.some(sel => sel._id === design._id))
                            .map(design => ({ _id: design._id, desgn_name: design.desgn_name }));

                console.log(selectedBranch, selectedRoles);
                var branch_id_result = branchList && branchList.length === 1 ? branchList : selectedBranch?.map(branch => ({ _id: branch._id, br_name: branch.br_name }));
                updatedValues["branch_id"] = branch_id_result

                var role_info_result = selectedRoles?.map(role => ({ _id: role._id, role_name: role.role_name }));
                updatedValues["role_info"] = role_info_result

                // Validation: Ensure none of them are empty
                const errors = {};
                // if (updatedValues.dept_id.length === 0) {
                //     errors.dept_id = "Department is required.";
                // }
                // if (updatedValues.designation.length === 0) {
                //     errors.designation = "Designation is required.";
                // }
                // if (updatedValues.branch_id.length === 0) {
                //     errors.branch_id = "Branch is required.";
                // }

                if (Object.keys(errors).length > 0) {
                    validation.setErrors(errors);
                    setSubmitting(false);
                    return;
                }

                updatedValues["username"] = updatedValues["email_id"];
                updatedValues["created_by"] = authUser.user_data._id;
                updatedValues["clientId"] = clientInfo.clientId;
                updatedValues["userPoolId"] = clientInfo.userPoolId;
                updatedValues["company_id"] = clientInfo.company_id;

                console.log("Final values:", updatedValues);

                await dispatch(createUserInfo(updatedValues, navigate));
                setSubmitting(false);

            } catch (error) {
                console.log('error', error);
                setSubmitting(false);
            }
        }
    });

    const handleEmailChange = (e) => {
        const value = e.target.value;
        validation.setFieldValue("email_id", value);
        dispatch(setUserMailIdExist(false)); 
        debouncedEmailValidation(value);
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        validation.setFieldValue("phone_number", value);
        dispatch(setUserNumExist(false));
        debouncedPhoneValidation(value);
    };

    const retriveBranchInfo = async () => {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        try {
            const responseData = await urlSocket.post("branch/retrive-branches", {
                encrypted_db_url: authUser.db_info.encrypted_db_url
            })
            if (responseData.status === 200) {
                const defaultOption = { br_name: "+ Add New Branch", br_code: "new", _id: "new_dept" };
                setBranchList(responseData.data.data)
            }

        } catch (error) {
            console.log(error, 'error');
        }
    }

    const handleAddRole = (selectedList) => {
        setSelectedRoles(selectedList);
        const hasIncidentManage = selectedList.some(role =>
            role.facilities && role.facilities.some(facility => facility.id === 11)
        );

        setEnableIncdType(hasIncidentManage);
    };

    const handleRemoveRole = (selectedList, removedItem) => {
        const updatedRoles = selectedList.filter(role => role._id !== removedItem._id);
        setSelectedRoles(updatedRoles);
        const hasIncidentManage = updatedRoles.some(role =>
            role.facilities && role.facilities.some(facility => facility.id === 11)
        );

        setEnableIncdType(hasIncidentManage);
    };

    const addDisabledCheckboxToChildren = (data, targetKey, checked) => {
        data.forEach(node => {
            if (targetKey.includes(node.key)) {
                if (Array.isArray(node.children)) {
                    node.children.forEach(child => {
                        addDisabledToAllDescendants(child, checked);
                    });
                }
            } else if (Array.isArray(node.children) && node.children.length > 0) {
                addDisabledCheckboxToChildren(node.children, targetKey, checked);
            }
        });

        return data;
    }

    const addDisabledToAllDescendants = (node, checked) => {
        node.disableCheckbox = checked ? true : false;
        node.disabled = checked ? true : false;
        if (Array.isArray(node.children)) {
            node.children.forEach(child => {
                addDisabledToAllDescendants(child, checked);
            });
        }
    }

    const loopTree = (data) =>
        data.map((item) => ({
            ...item,
            disabled: disabledKeys.includes(item.key),
            children: item.children ? loopTree(item.children) : undefined,
        }));

    const navigateTo = () => {
        navigate(-1);
    }

    const handleSelect = useCallback((selectedList, selectedItem) => {
        if (selectedItem._id === "new_dept") {
            setresetMiltiSelect(false)
            var selectedList = selectedList.filter((ele) => {
                if (ele._id !== "new_dept") {
                    return ele
                }
            })

            multiRef.current.state.selectedValues = selectedList

            setTimeout(() => {
                setresetMiltiSelect(true)
            }, 200);

            setShowModal(true);
        } else {
            setSelectedDeptId(selectedList)
             validation.setFieldValue("dept_id", selectedList)
        }
    }, [selectedDeptId]);

    const handleBranchSelect = useCallback((selectedList, selectedItem) => {
        if (selectedItem._id === "new_dept") {
            setresetMiltiSelect(false)
            var selectedList = selectedList.filter((ele) => {
                if (ele._id !== "new_dept") {
                    return ele
                }
            })
            multiBranchRef.current.state.selectedValues = selectedList
            setTimeout(() => {
                setresetMiltiSelect(true)
            }, 200);

            setShowModal(true);
        } else {
            setSelectedBranch(selectedList);
             validation.setFieldValue("branch_id", selectedList)
        }
    }, [selectedBranch]);

    const toggleModal = (open) => {
        if (open === 'modal') {
            dispatch(setDesignationExist(false));
            setNewDesignation('')
        }
        setModal(!modal);
    }

    const toggle = (open) => {
        if (open === 'showModal') {
            dispatch(setDepartmentExist(false));
            setNewDeptName('')
            setNewDeptCode('')
        }
        setShowModal(!showModal)
    };

    const handleSelectChange = (e) => {
        console.log('handleSelectChange', e.target.value)
        validation.setErrors(prevErrors => ({ ...prevErrors, designation: '' }))

        if (e.target.value === "add_new") {
            setModal(true);
        } else {
            var selectedDesgn = _.filter(IR_OrgSlice?.designationData, { _id: e.target.value })
            console.log('selectedDesgn :>> ', selectedDesgn);
            setSelectedDesignation(selectedDesgn)
        }
    };

    const handleCreateDesignation = async () => {
        if (newDesignation.trim() !== "") {
            const values = {
                desgn_name: newDesignation,
                created_by: authUser.user_data._id,
            };
            if (IR_OrgSlice.editDesignationInfo !== null) {
                values["_id"] = IR_OrgSlice.editDesignationInfo._id;
            }

            if (IR_OrgSlice?.degnNameExist === false) {
                dispatch(createDesignation(values));

                const updatedDesignations = [...designations, newDesignation];
                setDesignations(updatedDesignations);
                setSelectedDesignation(newDesignation);
                setNewDesignation("");

                setModal(false);
            }
        }
    };

    // const handleCreateDepartMent = async () => {
    //     const newDepartment = { dept_name: newDeptName, dept_code: newDeptCode };
    //     const values = {
    //         dept_name: newDeptName,
    //         dept_code: newDeptCode,
    //         created_by: authUser.user_data._id,
    //     };
    //     if (IR_OrgSlice?.deptNameExist === false) {
    //         dispatch(createDeptInfo(values));
    //         setShowModal(false);
    //         setOptions((prevOptions) => [
    //             ...prevOptions,
    //             newDepartment
    //         ]);
    //         setSelectedDeptId([...selectedDeptId, newDepartment])
    //         setNewDeptName("");
    //         setNewDeptCode("");
    //         setShowModal(false);
    //     }
    // };
     const handleCreateDepartMent = async () => {
        const newDepartment = { dept_name: newDeptName, dept_code: newDeptCode };
        const values = {
            dept_name: newDeptName,
            dept_code: newDeptCode,
            created_by: authUser.user_data._id,
        };
        console.log('IR_OrgSlice?.deptNameExist :>> ', IR_OrgSlice?.deptNameExist);
        if (IR_OrgSlice?.deptNameExist === false) {
            dispatch(createDeptInfo(values));
            setShowModal(false);
            setOptions((prevOptions) => [
                ...prevOptions,
                newDepartment
            ]);
            validation.setFieldValue("dept_id", [...selectedDeptId, newDepartment])
            setSelectedDeptId([...selectedDeptId, newDepartment])
            setNewDeptName("");
            setNewDeptCode("");
            setShowModal(false);
        }
    };

    const handleDesignationChange = async (value) => {
        setNewDesignation(value);
        await dispatch(IRTvalidateDupName(store.getState().orgSlice.editDesignationInfo, "cln_adt_desgn_lists", "desgn_name", value, setDesignationExist));
    };

    const handleNewDepartmentChange = async (value) => {
        setNewDeptName(value);
        await dispatch(IRTvalidateDupName(store.getState().orgSlice.editDeptInfo, "cln_adt_depart_lists", "dept_name", value, setDepartmentExist));
    };

    if (dataLoaded) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Breadcrumbs title="Add User" breadcrumbItem="Add User" isBackButtonEnable={true} gotoBack={() => { navigateTo() }} />
                    <Container fluid>
                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <h5 className='text-primary'>User Information</h5>
                                        <hr className="border-secondary opacity-50" />
                                        <Form onSubmit={(e) => { e.preventDefault(); validation.handleSubmit(); }} className='p-2'>
                                            <fieldset disabled={!canEdit}>
                                                <Row>
                                                    <Col style={{ border: '1px solid #f1f1f1', borderRadius: '5px', padding: '10px' }} className='me-2'>
                                                        <div>
                                                            <Row className='mb-3'>
                                                                <Col>
                                                                    <Label className="form-label">Full Name :<span className='text-danger'>*</span></Label>
                                                                    <Input
                                                                        name={"fullname"}
                                                                        type={"text"}
                                                                        placeholder={"Enter the Full Name"}
                                                                        onChange={validation.handleChange}
                                                                        onBlur={validation.handleBlur}
                                                                        value={validation.values.fullname || ""}
                                                                        invalid={validation.touched.fullname && validation.errors.fullname ? true : false}
                                                                        maxLength={30}
                                                                    />
                                                                    {validation.touched.fullname && validation.errors.fullname ? (
                                                                        <FormFeedback type="invalid">{validation.errors.fullname}</FormFeedback>
                                                                    ) : null}
                                                                </Col>
                                                                <Col>
                                                                    <Label>Mobile Number: <span className='text-danger'>*</span></Label>
                                                                    <Row>
                                                                        <Col md={3} className='pe-0' >
                                                                            <select
                                                                                name="countrycode"
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                className={`form-select ${validation.touched.countrycode && validation.errors.countrycode ? 'is-invalid' : ''}`}
                                                                                defaultValue={IR_UserSlice.editUserInfo?.countrycode ? IR_UserSlice?.editUserInfo?.countrycode : "Select"}
                                                                                required
                                                                                disabled={userInfo?.countrycode}
                                                                                style={{ borderRight: 'none' }}
                                                                            >
                                                                                <option value="Select" disabled={true}>Select</option>
                                                                                {
                                                                                    clientInfo.countries.map((c, idx) => (
                                                                                        <option key={idx} value={c.code}>
                                                                                            {c.code}{""}&nbsp;{c.label}
                                                                                        </option>
                                                                                    ))
                                                                                }
                                                                            </select>

                                                                            {validation.touched.countrycode && validation.errors.countrycode && (
                                                                                <div className="invalid-feedback d-block">{validation.errors.countrycode}</div>
                                                                            )}
                                                                        </Col>
                                                                        <Col md={9} className='ps-0'>
                                                                            <Input
                                                                                name="phone_number"
                                                                                type="number"
                                                                                placeholder="Enter the Mobile Number"
                                                                                onChange={handlePhoneChange} 
                                                                                disabled={userInfo?.phone_number}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.phone_number ? validation.values.phone_number : "" || ""}
                                                                                invalid={validation.touched.phone_number && validation.errors.phone_number ? true : false}
                                                                            />
                                                                            {validation.touched.phone_number && validation.errors.phone_number ? (
                                                                                <FormFeedback type="invalid">{validation.errors.phone_number}</FormFeedback>
                                                                            ) : null}
                                                                            {IR_UserSlice.userNumExist && (
                                                                                <div style={{ fontSize: "smaller" }} className="text-danger">
                                                                                    Phone Number already assigned to another user.
                                                                                </div>
                                                                            )}
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>

                                                            <Row className='mb-3'>
                                                                <Col>
                                                                    <Label className="form-label">Email ID : <span className='text-danger'>*</span></Label>
                                                                    <Input
                                                                        name={"email_id"}
                                                                        type={"text"}
                                                                        placeholder={"Enter the Email ID"}
                                                                        onChange={handleEmailChange} // Use custom handler
                                                                        onBlur={validation.handleBlur}
                                                                        value={validation.values.email_id || ""}
                                                                        invalid={validation.touched.email_id && validation.errors.email_id ? true : false}
                                                                        disabled={userInfo?.email_id}
                                                                    />
                                                                    {validation.touched.email_id && validation.errors.email_id ? (
                                                                        <FormFeedback type="invalid">{validation.errors.email_id}</FormFeedback>
                                                                    ) : null}
                                                                    {
                                                                        IR_UserSlice.userMailIdExist &&
                                                                        <div style={{ fontSize: "smaller" }} className='text-danger'>Email ID already exists.</div>
                                                                    }
                                                                </Col>

                                                                <Col>
                                                                    <Label className="form-label"> Roles :</Label>
                                                                    <Multiselect
                                                                        options={IR_UserSlice?.roleList}
                                                                        selectedValues={selectedRoles}
                                                                        onSelect={handleAddRole}
                                                                        onRemove={handleRemoveRole}
                                                                        displayValue="role_name"
                                                                        closeOnSelect={false}
                                                                        style={{ width: "100%" }}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            <Row className="mb-3">
                                                                <Col>
                                                                    <Label className="form-label"> Department: <span className='text-danger'>*</span></Label>
                                                                    {
                                                                        resetMiltiSelect && (
                                                                            <div style={{ position: "relative", width: "100%" }}>
                                                                                <Multiselect
                                                                                    options={options}
                                                                                    selectedValues={selectedDeptId}
                                                                                    displayValue="dept_name"
                                                                                    closeOnSelect={false}
                                                                                    ref={multiRef}
                                                                                    onSelect={(selectedList, selectedItem) => { validation.setErrors(prevErrors => ({ ...prevErrors, dept_id: '' })); handleSelect(selectedList, selectedItem) }}
                                                                                    showOptions={false}
                                                                                     onRemove={(selectedList) => { validation.setFieldValue("dept_id", selectedList); setSelectedDeptId(selectedList) }}
                                                                                    style={{ width: "100%", minHeight: "38px", paddingRight: "30px" }}
                                                                                />
                                                                                <i
                                                                                    className="fa fa-angle-down"
                                                                                    style={{
                                                                                        position: "absolute",
                                                                                        right: "20px",
                                                                                        top: "50%",
                                                                                        transform: "translateY(-50%)",
                                                                                        pointerEvents: "none",
                                                                                        color: "#555",
                                                                                    }}
                                                                                ></i>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    {validation.touched.dept_id && validation.errors.dept_id && (
                                                                        <div className="text-danger mt-1" style={{ fontSize: "10px" }}>
                                                                            {validation.errors.dept_id}
                                                                        </div>
                                                                    )}
                                                                </Col>

                                                                <Col>
                                                                    <Label className="form-label"> Designation: </Label>
                                                                    <Input
                                                                        type="select"
                                                                        name="designation"
                                                                        value={IR_OrgSlice?.designationData.length === 1 ? IR_OrgSlice?.designationData[0]._id : selectedDesignation.length > 0 ? selectedDesignation[0]._id : ""}
                                                                        onChange={handleSelectChange}
                                                                    >
                                                                        <option value="" disabled>
                                                                            Select
                                                                        </option>
                                                                        <option value="add_new" style={{ fontWeight: "bold", color: "blue" }}>
                                                                            + Add New Designation
                                                                        </option>
                                                                        {IR_OrgSlice?.designationData.map((designation, index) => (
                                                                            <option key={index} value={designation._id}>
                                                                                {designation.desgn_name}
                                                                            </option>
                                                                        ))}
                                                                    </Input>
                                                                    {validation.errors.designation && (
                                                                        <div className="text-danger mt-1" style={{ fontSize: "10px" }}>
                                                                            {validation.errors.designation}
                                                                        </div>
                                                                    )}
                                                                </Col>

                                                                <Col>
                                                                    <Label className="form-label">Branch:<span className='text-danger'>*</span></Label>
                                                                    {
                                                                        resetMiltiSelect && (
                                                                            <div style={{ position: "relative", width: "100%" }}>
                                                                                <Multiselect
                                                                                    options={branchList}
                                                                                    selectedValues={
                                                                                        branchList.length === 1
                                                                                            ? branchList
                                                                                            : branchList?.filter(option =>
                                                                                                selectedBranch.some(dept => dept?._id === option?._id)
                                                                                            )
                                                                                    }
                                                                                    displayValue="br_name"
                                                                                    closeOnSelect={false}
                                                                                    ref={multiBranchRef}
                                                                                    onSelect={(selectedList, selectedItem) => handleBranchSelect(selectedList, selectedItem)}
                                                                                    showOptions={false}
                                                                                    onRemove={(selectedList) => {setSelectedBranch(selectedList);  validation.setFieldValue("branch_id", selectedList)}}
                                                                                    style={{ width: "100%", minHeight: "38px", paddingRight: "30px" }}
                                                                                    disable={branchList.length === 1}
                                                                                />
                                                                                <i
                                                                                    className="fa fa-angle-down"
                                                                                    style={{
                                                                                        position: "absolute",
                                                                                        right: "20px",
                                                                                        top: "50%",
                                                                                        transform: "translateY(-50%)",
                                                                                        pointerEvents: "none",
                                                                                        color: "#555",
                                                                                    }}
                                                                                ></i>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    {validation.touched.branch_id && validation.errors.branch_id && (
                                                                        <div className="text-danger mt-1" style={{ fontSize: "10px" }}>
                                                                            {validation.errors.branch_id}
                                                                        </div>
                                                                    )}
                                                                </Col>
                                                            </Row>

                                                        </div>
                                                    </Col>
                                                </Row>
                                            </fieldset>
                                            <>
                                                {
                                                    canEdit && (<>
                                                        <Row className='mt-3'>
                                                            <Col>
                                                                <div className="text-end">
                                                                    <button className="btn btn-sm btn-outline-danger me-2" type="button" onClick={async () => { await dispatch(setEditUserInfo(null)); sessionStorage.removeItem("userId"); navigate(-1); }} >
                                                                        Cancel
                                                                    </button>
                                                                    <button className="btn btn-sm btn-outline-success" disabled={validation.isSubmitting} type='submit' onClick={() => { checkedKeys.length > 0 ? setSelectedLocation(false) : setSelectedLocation(true) }} >
                                                                        {
                                                                            validation.isSubmitting ? (
                                                                                <>
                                                                                    <Spinner size="sm">...</Spinner>
                                                                                    <span>{' '}Submitting...</span>
                                                                                </>
                                                                            ) : (
                                                                                <>Submit</>
                                                                            )
                                                                        }
                                                                    </button>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </>)
                                                }
                                            </>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Modal isOpen={showModal} toggle={() => toggle('showModal')} centered>
                            <ModalHeader toggle={() => toggle('showModal')}>Add New Department</ModalHeader>
                            <ModalBody>
                                <Label for="deptName">Department Name <span className="text-danger">*</span></Label>
                                <Input
                                    id="deptName"
                                    type="text"
                                    placeholder="Enter Department Name"
                                    value={newDeptName}
                                    onChange={(e) => handleNewDepartmentChange(e.target.value)}
                                    invalid={IR_OrgSlice?.deptNameExist}
                                />
                                {IR_OrgSlice?.deptNameExist === true ?
                                    <div className='text-danger' >Department name alrady exist...!</div>
                                    : null}

                                <Label for="deptCode" className='mt-3'>Department Code</Label>
                                <Input
                                    id="deptCode"
                                    type="text"
                                    placeholder="Enter Department Code"
                                    value={newDeptCode}
                                    onChange={(e) => setNewDeptCode(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary" onClick={() => toggle('showModal')}>
                                    Cancel
                                </Button>
                                <Button color="primary" onClick={handleCreateDepartMent}>
                                    Create
                                </Button>
                            </ModalFooter>
                        </Modal>
                        <Modal isOpen={modal} toggle={() => toggleModal('modal')}>
                            <ModalHeader toggle={() => toggleModal('modal')}>Add New Designation</ModalHeader>
                            <ModalBody>
                                <Input
                                    type="text"
                                    placeholder="Enter Designation"
                                    value={newDesignation}
                                    onChange={(e) => handleDesignationChange(e.target.value)}
                                    invalid={IR_OrgSlice?.degnNameExist}
                                />
                                {IR_OrgSlice?.degnNameExist === true ?
                                    <div className='text-danger' >Designation name alrady exist...!</div>
                                    : null}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary" onClick={() => toggleModal('modal')}>
                                    Cancel
                                </Button>
                                <Button color="primary" type='submit' onClick={() => handleCreateDesignation()}>
                                    Create
                                </Button>
                            </ModalFooter>
                        </Modal>
                    </Container>
                </div>
            </React.Fragment>
        )
    }
    else {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div>Loading...</div>
                <Spinner color="primary" />
            </div>
        );
    }
}
export default IRAddUser;














///31-5-25-Venu
// import React, { useEffect, useRef, useState, useCallback } from 'react'
// import { CardBody, Container, Row, Col, Card, Form, Input, Label, FormFeedback, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
// import Breadcrumbs from '../../../components/Common/Breadcrumb'
// import { useNavigate } from 'react-router-dom'
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useSelector, useDispatch } from 'react-redux';
// import { setUserMailIdExist, setUserNumExist, setEditUserInfo, retriveRoleData, createUserInfo, retriveUserInfo, validateExistValue } from '../../../toolkitStore/Auditvista/userSlice';
// import store from '../../../store';
// // import { useAsyncDebounce } from "react-table"; // Import useAsyncDebounce
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { retriveDesignationInfo, createDesignation, createDeptInfo, setDepartmentExist, setDesignationExist, IRTvalidateDupName } from 'toolkitStore/Auditvista/orgSlice';
// import { Multiselect } from 'multiselect-react-dropdown'
// import { usePermissions } from 'hooks/usePermisson';
// import urlSocket from 'helpers/urlSocket';
// import { useValidationDebounce } from '../../../utils/useValidationDebounce'; 
// const IRAddUser = () => {

//     const { canView, canEdit } = usePermissions("murs");
//         const { debouncedEmailValidation, debouncedPhoneValidation } = useValidationDebounce(500);


//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const IR_UserSlice = useSelector(state => state?.userSlice);
//     console.log('IR_UserSlice26', IR_UserSlice)
//     const IR_OrgSlice = useSelector(state => state?.orgSlice);

//     const authUser = JSON.parse(sessionStorage.getItem("authUser"))
//     const [clientInfo, setClientInfo] = useState(JSON.parse(sessionStorage.getItem("client_info")))[0]
//     const [userInfo, setUserInfo] = useState(null)
//     const [enabelIncdType, setEnableIncdType] = useState(false)
//     const [dataLoaded, setdataLoaded] = useState(sessionStorage.getItem("userId") ? false : false)
//     const [submitLoad, setSubmitLoad] = useState(false)
//     const [checkedKeys, setcheckedKeys] = useState([])
//     const [selectedLocation, setSelectedLocation] = useState(false)
//     const [disabledKeys, setDisabledKeys] = useState([]);


//     const [showModal, setShowModal] = useState(false);
//     const [newDeptName, setNewDeptName] = useState("");
//     const [newDeptCode, setNewDeptCode] = useState("");
//     const [options, setOptions] = useState([]);
//     const [designations, setDesignations] = useState([]);
//     const [modal, setModal] = useState(false);
//     const [newDesignation, setNewDesignation] = useState("");
//     const [resetMiltiSelect, setresetMiltiSelect] = useState(true);
//     const [branchList, setBranchList] = useState([]);

//     const [selectedBranch, setSelectedBranch] = useState([]);
//     const [selectedDeptId, setSelectedDeptId] = useState([]);
//     const [selectedDesignation, setSelectedDesignation] = useState([]);
//     const [selectedRoles, setSelectedRoles] = useState([]);

//     const multiRef = useRef()
//     const multiBranchRef = useRef()

//     // // Debounced validation functions
//     // const debouncedEmailValidation = useAsyncDebounce(async (email) => {
//     //     if (email && email.trim() !== "") {
//     //         await dispatch(validateExistValue(
//     //             store.getState().userSlice.editUserInfo, 
//     //             "cln_adt_users", 
//     //             "email_id", 
//     //             email, 
//     //             setUserMailIdExist
//     //         ));
//     //     }
//     // }, 500); // 500ms delay

//     // const debouncedPhoneValidation = useAsyncDebounce(async (phone) => {
//     //     if (phone && phone.trim() !== "") {
//     //         await dispatch(validateExistValue(
//     //             store.getState().userSlice.editUserInfo, 
//     //             "cln_adt_users", 
//     //             "phone_number", 
//     //             phone, 
//     //             setUserNumExist
//     //         ));
//     //     }
//     // }, 500); // 500ms delay

//     useEffect(() => {
//         const initialize = async () => {
//             try {
//                 const userId = sessionStorage.getItem("userId");
//                 document.title = userId ? "Edit User | Auditvista" : "Create User | Auditvista";

//                 await dispatch(retriveRoleData());
//                 await dispatch(retriveDesignationInfo());
//                 await retriveBranchInfo()

//                 dispatch(setUserMailIdExist(false))
//                 dispatch(setUserNumExist(false))
//                 if (userId) {
//                     const userInfo = await dispatch(retriveUserInfo(userId));
//                     console.log(userInfo, 'userInfo')
//                     setUserInfo(userInfo)
//                     setSelectedDeptId(userInfo.dept_id)
//                     setSelectedDesignation(userInfo.designation)
//                     setSelectedBranch(userInfo.branch_id)
//                     setSelectedRoles(userInfo.role_info)
//                     validation.setValues(userInfo);
//                     setdataLoaded(true)
//                 } else {
//                     dispatch(setEditUserInfo(null))
//                     setTimeout(() => {
//                         validation.resetForm()
//                         setdataLoaded(true)
//                     }, 500)
//                 }
//             } catch (error) {
//                 console.log('error', error);
//             }
//         };

//         initialize();
//     }, []);

//     useEffect(() => {
//         console.log(IR_UserSlice?.deptData, 'IR_UserSlice?.deptData');
//         setOptions([
//             { dept_name: "+ Add New Department", dept_code: "new", _id: "new_dept" },
//             ...IR_UserSlice.deptData.map((map) => ({
//                 dept_name: map.dept_name,
//                 dept_code: map.dept_code,
//                 _id: map._id,
//             })),
//         ]);
//     }, [IR_UserSlice?.deptData]);

//     useEffect(() => {
//         if (options.length === 2) {
//             setSelectedDeptId([options[1]])
//         } else {
//             setSelectedDeptId([])
//         }
//     }, [options]);

//     const validation = useFormik({
//         initialValues: {
//             fullname: sessionStorage.getItem("userId") ? IR_UserSlice.editUserInfo?.fullname : "",
//             // email_id: sessionStorage.getItem("userId") ? IR_UserSlice.editUserInfo?.email_id || "" : "",
//              email_id: "",
//             countrycode: sessionStorage.getItem("userId") ? (IR_UserSlice.editUserInfo?.countrycode ?? "") : "",
//             phone_number: sessionStorage.getItem("userId") ? (IR_UserSlice.editUserInfo?.phone_number ?? "") : "",
//         },

//         validationSchema: Yup.object().shape({
//             fullname: Yup.string()
//                 .required("Name is required")
//                 .matches(/\S+/, "Name cannot be just spaces")
//                 .min(clientInfo.incd_rpt_validation.name_min, `Name must be at least ${clientInfo.incd_rpt_validation.name_min} characters`),

//             email_id: Yup.string()
//                 .email("Invalid email format")
//                 .nullable()
//                 .test("email-or-phone", "Either Email or Phone number is required", function (value) {
//                     const { phone_number } = this.parent;
//                     return !!value || !!phone_number;
//                 }),
//             //      .test(async function (value) {
//             //          return !submitLoad ? !(await dispatch(validateExistValue(store.getState().userSlice.editUserInfo, "cln_adt_users", "email_id", value, setUserMailIdExist))) : false;
//             //    }),
//             countrycode: Yup.string().nullable()
//                 .test('countrycode-required', 'Country code is required if phone number is provided', function (value) {
//                     const { phone_number } = this.parent;
//                     if (phone_number && phone_number.length > 0) {
//                         return !!value && value !== 'Select';
//                     }
//                     return true;
//                 }),

//             phone_number: Yup.string()
//                 .nullable()
//                 .test('phone-required', 'Phone number is required if Email is not provided', function (value) {
//                     const { email_id } = this.parent;
//                     return !!value || !!email_id;
//                 }),
// //                 .test('phone-unique', 'Phone number already exists', async function (value) {
// //                     return !submitLoad ? !(await dispatch(validateExistValue(store.getState().userSlice.editUserInfo, "cln_adt_users", "phone_number", value, setUserNumExist))) : false;
// //                 }),
//         }),
//         onSubmit: async (values, { setSubmitting }) => {
//             var updatedValues = _.cloneDeep(values);

//             try {
//                 // Let's validate email and phone once before submitting
//                 if (values.email_id) {
//                     await dispatch(validateExistValue(
//                         store.getState().userSlice.editUserInfo, 
//                         "cln_adt_users", 
//                         "email_id", 
//                         values.email_id, 
//                         setUserMailIdExist
//                     ));
//                 }
                
//                 if (values.phone_number) {
//                     await dispatch(validateExistValue(
//                         store.getState().userSlice.editUserInfo, 
//                         "cln_adt_users", 
//                         "phone_number", 
//                         values.phone_number, 
//                         setUserNumExist
//                     ));
//                 }

//                 // Check if there are validation errors from the API
//                 if (IR_UserSlice.userMailIdExist || IR_UserSlice.userNumExist) {
//                     setSubmitting(false);
//                     return;
//                 }

//                 var dept_id_result = selectedDeptId.map(department => ({ _id: department._id, dept_name: department.dept_name }));
//                 updatedValues["dept_id"] = dept_id_result;

//                 updatedValues["designation"] =
//                     IR_OrgSlice?.designationData && IR_OrgSlice?.designationData.length === 1
//                         ? IR_OrgSlice?.designationData.map(design => ({ _id: design._id, desgn_name: design.desgn_name }))
//                         : IR_OrgSlice?.designationData
//                             .filter(design => selectedDesignation.some(sel => sel._id === design._id))
//                             .map(design => ({ _id: design._id, desgn_name: design.desgn_name }));

//                 console.log(selectedBranch, selectedRoles);
//                 var branch_id_result = branchList && branchList.length === 1 ? branchList : selectedBranch?.map(branch => ({ _id: branch._id, br_name: branch.br_name }));
//                 updatedValues["branch_id"] = branch_id_result

//                 var role_info_result = selectedRoles?.map(role => ({ _id: role._id, role_name: role.role_name }));
//                 updatedValues["role_info"] = role_info_result

//                 // Validation: Ensure none of them are empty
//                 const errors = {};
//                 // if (updatedValues.dept_id.length === 0) {
//                 //     errors.dept_id = "Department is required.";
//                 // }
//                 // if (updatedValues.designation.length === 0) {
//                 //     errors.designation = "Designation is required.";
//                 // }
//                 if (updatedValues.branch_id.length === 0) {
//                     errors.branch_id = "Branch is required.";
//                 }

//                 if (Object.keys(errors).length > 0) {
//                     validation.setErrors(errors);
//                     setSubmitting(false);
//                     return;
//                 }

//                 updatedValues["username"] = updatedValues["email_id"];
//                 updatedValues["created_by"] = authUser.user_data._id;
//                 updatedValues["clientId"] = clientInfo.clientId;
//                 updatedValues["userPoolId"] = clientInfo.userPoolId;
//                 updatedValues["company_id"] = clientInfo.company_id;

//                 console.log("Final values:", updatedValues);

//                 await dispatch(createUserInfo(updatedValues, navigate));
//                 setSubmitting(false);

//             } catch (error) {
//                 console.log('error', error);
//                 setSubmitting(false);
//             }
//         }
//     });

//     // Custom handlers for email and phone changes
//     const handleEmailChange = (e) => {
//         const value = e.target.value;
//         validation.setFieldValue("email_id", value);
//         dispatch(setUserMailIdExist(false)); 
//         debouncedEmailValidation(value);
//     };

//     const handlePhoneChange = (e) => {
//         const value = e.target.value;
//         validation.setFieldValue("phone_number", value);
//         dispatch(setUserNumExist(false));
//         debouncedPhoneValidation(value);
//     };

//     const retriveBranchInfo = async () => {
//         const authUser = JSON.parse(sessionStorage.getItem("authUser"))
//         try {
//             const responseData = await urlSocket.post("branch/retrive-branches", {
//                 encrypted_db_url: authUser.db_info.encrypted_db_url
//             })
//             if (responseData.status === 200) {
//                 const defaultOption = { br_name: "+ Add New Branch", br_code: "new", _id: "new_dept" };
//                 setBranchList(responseData.data.data)
//             }

//         } catch (error) {
//             console.log(error, 'error');
//         }
//     }

//     const handleAddRole = (selectedList) => {
//         setSelectedRoles(selectedList);
//         const hasIncidentManage = selectedList.some(role =>
//             role.facilities && role.facilities.some(facility => facility.id === 11)
//         );

//         setEnableIncdType(hasIncidentManage);
//     };

//     const handleRemoveRole = (selectedList, removedItem) => {
//         const updatedRoles = selectedList.filter(role => role._id !== removedItem._id);
//         setSelectedRoles(updatedRoles);
//         const hasIncidentManage = updatedRoles.some(role =>
//             role.facilities && role.facilities.some(facility => facility.id === 11)
//         );

//         setEnableIncdType(hasIncidentManage);
//     };

//     const addDisabledCheckboxToChildren = (data, targetKey, checked) => {
//         data.forEach(node => {
//             if (targetKey.includes(node.key)) {
//                 if (Array.isArray(node.children)) {
//                     node.children.forEach(child => {
//                         addDisabledToAllDescendants(child, checked);
//                     });
//                 }
//             } else if (Array.isArray(node.children) && node.children.length > 0) {
//                 addDisabledCheckboxToChildren(node.children, targetKey, checked);
//             }
//         });

//         return data;
//     }

//     // Helper function to recursively add 'disabledcheckbox: true' to all descendants
//     const addDisabledToAllDescendants = (node, checked) => {
//         node.disableCheckbox = checked ? true : false;
//         node.disabled = checked ? true : false;
//         if (Array.isArray(node.children)) {
//             node.children.forEach(child => {
//                 addDisabledToAllDescendants(child, checked);
//             });
//         }
//     }

//     const loopTree = (data) =>
//         data.map((item) => ({
//             ...item,
//             disabled: disabledKeys.includes(item.key),
//             children: item.children ? loopTree(item.children) : undefined,
//         }));

//     const navigateTo = () => {
//         navigate(-1);
//     }

//     const handleSelect = useCallback((selectedList, selectedItem) => {
//         if (selectedItem._id === "new_dept") {
//             setresetMiltiSelect(false)
//             var selectedList = selectedList.filter((ele) => {
//                 if (ele._id !== "new_dept") {
//                     return ele
//                 }
//             })

//             multiRef.current.state.selectedValues = selectedList

//             setTimeout(() => {
//                 setresetMiltiSelect(true)
//             }, 200);

//             setShowModal(true);
//         } else {
//             setSelectedDeptId(selectedList)
//         }
//     }, [selectedDeptId]);

//     const handleBranchSelect = useCallback((selectedList, selectedItem) => {
//         if (selectedItem._id === "new_dept") {
//             setresetMiltiSelect(false)
//             var selectedList = selectedList.filter((ele) => {
//                 if (ele._id !== "new_dept") {
//                     return ele
//                 }
//             })
//             multiBranchRef.current.state.selectedValues = selectedList
//             setTimeout(() => {
//                 setresetMiltiSelect(true)
//             }, 200);

//             setShowModal(true);
//         } else {
//             setSelectedBranch(selectedList);
//         }
//     }, [selectedBranch]);

//     const toggleModal = (open) => {
//         if (open === 'modal') {
//             dispatch(setDesignationExist(false));
//             setNewDesignation('')
//         }
//         setModal(!modal);
//     }

//     const toggle = (open) => {
//         if (open === 'showModal') {
//             dispatch(setDepartmentExist(false));
//             setNewDeptName('')
//             setNewDeptCode('')
//         }
//         setShowModal(!showModal)
//     };

//     const handleSelectChange = (e) => {
//         console.log('handleSelectChange', e.target.value)
//         validation.setErrors(prevErrors => ({ ...prevErrors, designation: '' }))

//         if (e.target.value === "add_new") {
//             setModal(true);
//         } else {
//             var selectedDesgn = _.filter(IR_OrgSlice?.designationData, { _id: e.target.value })
//             console.log('selectedDesgn :>> ', selectedDesgn);
//             setSelectedDesignation(selectedDesgn)
//         }
//     };

//     const handleCreateDesignation = async () => {
//         if (newDesignation.trim() !== "") {
//             const values = {
//                 desgn_name: newDesignation,
//                 created_by: authUser.user_data._id,
//             };
//             if (IR_OrgSlice.editDesignationInfo !== null) {
//                 values["_id"] = IR_OrgSlice.editDesignationInfo._id;
//             }

//             if (IR_OrgSlice?.degnNameExist === false) {
//                 dispatch(createDesignation(values));

//                 const updatedDesignations = [...designations, newDesignation];
//                 setDesignations(updatedDesignations);
//                 setSelectedDesignation(newDesignation);
//                 setNewDesignation("");

//                 setModal(false);
//             }
//         }
//     };

//     const handleCreateDepartMent = async () => {
//         const newDepartment = { dept_name: newDeptName, dept_code: newDeptCode };
//         const values = {
//             dept_name: newDeptName,
//             dept_code: newDeptCode,
//             created_by: authUser.user_data._id,
//         };
//         if (IR_OrgSlice?.deptNameExist === false) {
//             dispatch(createDeptInfo(values));
//             setShowModal(false);
//             setOptions((prevOptions) => [
//                 ...prevOptions,
//                 newDepartment
//             ]);
//             setSelectedDeptId([...selectedDeptId, newDepartment])
//             setNewDeptName("");
//             setNewDeptCode("");
//             setShowModal(false);
//         }
//     };

//     const handleDesignationChange = async (value) => {
//         setNewDesignation(value);
//         await dispatch(IRTvalidateDupName(store.getState().orgSlice.editDesignationInfo, "cln_adt_desgn_lists", "desgn_name", value, setDesignationExist));
//     };

//     const handleNewDepartmentChange = async (value) => {
//         setNewDeptName(value);
//         await dispatch(IRTvalidateDupName(store.getState().orgSlice.editDeptInfo, "cln_adt_depart_lists", "dept_name", value, setDepartmentExist));
//     };

//     if (dataLoaded) {
//         return (
//             <React.Fragment>
//                 <div className="page-content">
//                     <Breadcrumbs title="Add User" breadcrumbItem="Add User" isBackButtonEnable={true} gotoBack={() => { navigateTo() }} />
//                     <Container fluid>
//                         <Row>
//                             <Col>
//                                 <Card>
//                                     <CardBody>
//                                         <h5 className='text-primary'>User Information</h5>
//                                         <hr className="border-secondary opacity-50" />
//                                         <Form onSubmit={(e) => { e.preventDefault(); validation.handleSubmit(); }} className='p-2'>
//                                             <fieldset disabled={!canEdit}>
//                                                 <Row>
//                                                     <Col style={{ border: '1px solid #f1f1f1', borderRadius: '5px', padding: '10px' }} className='me-2'>
//                                                         <div>
//                                                             <Row className='mb-3'>
//                                                                 <Col>
//                                                                     <Label className="form-label">Full Name :<span className='text-danger'>*</span></Label>
//                                                                     <Input
//                                                                         name={"fullname"}
//                                                                         type={"text"}
//                                                                         placeholder={"Enter the Full Name"}
//                                                                         onChange={validation.handleChange}
//                                                                         onBlur={validation.handleBlur}
//                                                                         value={validation.values.fullname || ""}
//                                                                         invalid={validation.touched.fullname && validation.errors.fullname ? true : false}
//                                                                         maxLength={30}
//                                                                     />
//                                                                     {validation.touched.fullname && validation.errors.fullname ? (
//                                                                         <FormFeedback type="invalid">{validation.errors.fullname}</FormFeedback>
//                                                                     ) : null}
//                                                                 </Col>
//                                                                 <Col>
//                                                                     <Label>Mobile Number: </Label>
//                                                                     <Row>
//                                                                         <Col md={3} className='pe-0' >
//                                                                             <select
//                                                                                 name="countrycode"
//                                                                                 onChange={validation.handleChange}
//                                                                                 onBlur={validation.handleBlur}
//                                                                                 className={`form-select ${validation.touched.countrycode && validation.errors.countrycode ? 'is-invalid' : ''}`}
//                                                                                 defaultValue={IR_UserSlice.editUserInfo?.countrycode ? IR_UserSlice?.editUserInfo?.countrycode : "Select"}
//                                                                                 required
//                                                                                 disabled={userInfo?.countrycode}
//                                                                                 style={{ borderRight: 'none' }}
//                                                                             >
//                                                                                 <option value="Select" disabled={true}>Select</option>
//                                                                                 {
//                                                                                     clientInfo.countries.map((c, idx) => (
//                                                                                         <option key={idx} value={c.code}>
//                                                                                             {c.code}{""}&nbsp;{c.label}
//                                                                                         </option>
//                                                                                     ))
//                                                                                 }
//                                                                             </select>

//                                                                             {validation.touched.countrycode && validation.errors.countrycode && (
//                                                                                 <div className="invalid-feedback d-block">{validation.errors.countrycode}</div>
//                                                                             )}
//                                                                         </Col>
//                                                                         <Col md={9} className='ps-0'>
//                                                                             <Input
//                                                                                 name="phone_number"
//                                                                                 type="number"
//                                                                                 placeholder="Enter the Mobile Number"
//                                                                                 onChange={handlePhoneChange} 
//                                                                                 disabled={userInfo?.phone_number}
//                                                                                 onBlur={validation.handleBlur}
//                                                                                 value={validation.values.phone_number ? validation.values.phone_number : "" || ""}
//                                                                                 invalid={validation.touched.phone_number && validation.errors.phone_number ? true : false}
//                                                                             />
//                                                                             {validation.touched.phone_number && validation.errors.phone_number ? (
//                                                                                 <FormFeedback type="invalid">{validation.errors.phone_number}</FormFeedback>
//                                                                             ) : null}
//                                                                             {IR_UserSlice.userNumExist && (
//                                                                                 <div style={{ fontSize: "smaller" }} className="text-danger">
//                                                                                     Phone Number already assigned to another user.
//                                                                                 </div>
//                                                                             )}
//                                                                         </Col>
//                                                                     </Row>
//                                                                 </Col>
//                                                             </Row>

//                                                             <Row className='mb-3'>
//                                                                 <Col>
//                                                                     <Label className="form-label">Email ID :</Label>
//                                                                     <Input
//                                                                         name={"email_id"}
//                                                                         type={"text"}
//                                                                         placeholder={"Enter the Email ID"}
//                                                                         onChange={handleEmailChange} // Use custom handler
//                                                                         onBlur={validation.handleBlur}
//                                                                         value={validation.values.email_id || ""}
//                                                                         invalid={validation.touched.email_id && validation.errors.email_id ? true : false}
//                                                                         disabled={userInfo?.email_id}
//                                                                     />
//                                                                     {validation.touched.email_id && validation.errors.email_id ? (
//                                                                         <FormFeedback type="invalid">{validation.errors.email_id}</FormFeedback>
//                                                                     ) : null}
//                                                                     {
//                                                                         IR_UserSlice.userMailIdExist &&
//                                                                         <div style={{ fontSize: "smaller" }} className='text-danger'>Email ID already exists.</div>
//                                                                     }
//                                                                 </Col>

//                                                                 <Col>
//                                                                     <Label className="form-label"> Roles :</Label>
//                                                                     <Multiselect
//                                                                         options={IR_UserSlice?.roleList}
//                                                                         selectedValues={selectedRoles}
//                                                                         onSelect={handleAddRole}
//                                                                         onRemove={handleRemoveRole}
//                                                                         displayValue="role_name"
//                                                                         closeOnSelect={false}
//                                                                         style={{ width: "100%" }}
//                                                                     />
//                                                                 </Col>
//                                                             </Row>

//                                                             <Row className="mb-3">
//                                                                 <Col>
//                                                                     <Label className="form-label"> Department:</Label>
//                                                                     {console.log('selectedDeptId :>> ', selectedDeptId, options)}
//                                                                     {
//                                                                         resetMiltiSelect && (
//                                                                             <div style={{ position: "relative", width: "100%" }}>
//                                                                                 <Multiselect
//                                                                                     options={options}
//                                                                                     selectedValues={selectedDeptId}
//                                                                                     displayValue="dept_name"
//                                                                                     closeOnSelect={false}
//                                                                                     ref={multiRef}
//                                                                                     onSelect={(selectedList, selectedItem) => { validation.setErrors(prevErrors => ({ ...prevErrors, dept_id: '' })); handleSelect(selectedList, selectedItem) }}
//                                                                                     showOptions={false}
//                                                                                     onRemove={(selectedList) => setSelectedDeptId(selectedList)}
//                                                                                     style={{ width: "100%", minHeight: "38px", paddingRight: "30px" }}
//                                                                                 />
//                                                                                 <i
//                                                                                     className="fa fa-angle-down"
//                                                                                     style={{
//                                                                                         position: "absolute",
//                                                                                         right: "20px",
//                                                                                         top: "50%",
//                                                                                         transform: "translateY(-50%)",
//                                                                                         pointerEvents: "none",
//                                                                                         color: "#555",
//                                                                                     }}
//                                                                                 ></i>
//                                                                             </div>
//                                                                         )
//                                                                     }
//                                                                     {validation.errors.dept_id && (
//                                                                         <div className="text-danger mt-1" style={{ fontSize: "10px" }}>
//                                                                             {validation.errors.dept_id}
//                                                                         </div>
//                                                                     )}
//                                                                 </Col>

//                                                                 <Col>
//                                                                     <Label className="form-label"> Designation: </Label>
//                                                                     <Input
//                                                                         type="select"
//                                                                         name="designation"
//                                                                         value={IR_OrgSlice?.designationData.length === 1 ? IR_OrgSlice?.designationData[0]._id : selectedDesignation.length > 0 ? selectedDesignation[0]._id : ""}
//                                                                         onChange={handleSelectChange}
//                                                                     >
//                                                                         <option value="" disabled>
//                                                                             Select
//                                                                         </option>
//                                                                         <option value="add_new" style={{ fontWeight: "bold", color: "blue" }}>
//                                                                             + Add New Designation
//                                                                         </option>
//                                                                         {IR_OrgSlice?.designationData.map((designation, index) => (
//                                                                             <option key={index} value={designation._id}>
//                                                                                 {designation.desgn_name}
//                                                                             </option>
//                                                                         ))}
//                                                                     </Input>
//                                                                     {validation.errors.designation && (
//                                                                         <div className="text-danger mt-1" style={{ fontSize: "10px" }}>
//                                                                             {validation.errors.designation}
//                                                                         </div>
//                                                                     )}
//                                                                 </Col>

//                                                                 <Col>
//                                                                     <Label className="form-label">Branch:</Label>
//                                                                     {
//                                                                         resetMiltiSelect && (
//                                                                             <div style={{ position: "relative", width: "100%" }}>
//                                                                                 <Multiselect
//                                                                                     options={branchList}
//                                                                                     selectedValues={
//                                                                                         branchList.length === 1
//                                                                                             ? branchList
//                                                                                             : branchList?.filter(option =>
//                                                                                                 selectedBranch.some(dept => dept?._id === option?._id)
//                                                                                             )
//                                                                                     }
//                                                                                     displayValue="br_name"
//                                                                                     closeOnSelect={false}
//                                                                                     ref={multiBranchRef}
//                                                                                     onSelect={(selectedList, selectedItem) => handleBranchSelect(selectedList, selectedItem)}
//                                                                                     showOptions={false}
//                                                                                     onRemove={(selectedList) => setSelectedBranch(selectedList)}
//                                                                                     style={{ width: "100%", minHeight: "38px", paddingRight: "30px" }}
//                                                                                     disable={branchList.length === 1}
//                                                                                 />
//                                                                                 <i
//                                                                                     className="fa fa-angle-down"
//                                                                                     style={{
//                                                                                         position: "absolute",
//                                                                                         right: "20px",
//                                                                                         top: "50%",
//                                                                                         transform: "translateY(-50%)",
//                                                                                         pointerEvents: "none",
//                                                                                         color: "#555",
//                                                                                     }}
//                                                                                 ></i>
//                                                                             </div>
//                                                                         )
//                                                                     }
//                                                                     {validation.errors.branch_id && (
//                                                                         <div className="text-danger mt-1" style={{ fontSize: "10px" }}>
//                                                                             {validation.errors.branch_id}
//                                                                         </div>
//                                                                     )}
//                                                                 </Col>
//                                                             </Row>

//                                                         </div>
//                                                     </Col>
//                                                 </Row>
//                                             </fieldset>
//                                             <>
//                                                 {
//                                                     canEdit && (<>
//                                                         <Row className='mt-3'>
//                                                             <Col>
//                                                                 <div className="text-end">
//                                                                     <button className="btn btn-sm btn-outline-danger me-2" type="button" onClick={async () => { await dispatch(setEditUserInfo(null)); sessionStorage.removeItem("userId"); navigate(-1); }} >
//                                                                         Cancel
//                                                                     </button>
//                                                                     <button className="btn btn-sm btn-outline-success" disabled={validation.isSubmitting} type='submit' onClick={() => { checkedKeys.length > 0 ? setSelectedLocation(false) : setSelectedLocation(true) }} >
//                                                                         {
//                                                                             validation.isSubmitting ? (
//                                                                                 <>
//                                                                                     <Spinner size="sm">...</Spinner>
//                                                                                     <span>{' '}Submitting...</span>
//                                                                                 </>
//                                                                             ) : (
//                                                                                 <>Submit</>
//                                                                             )
//                                                                         }
//                                                                     </button>
//                                                                 </div>
//                                                             </Col>
//                                                         </Row>
//                                                     </>)
//                                                 }
//                                             </>
//                                         </Form>
//                                     </CardBody>
//                                 </Card>
//                             </Col>
//                         </Row>

//                         <Modal isOpen={showModal} toggle={() => toggle('showModal')} centered>
//                             <ModalHeader toggle={() => toggle('showModal')}>Add New Department</ModalHeader>
//                             <ModalBody>
//                                 <Label for="deptName">Department Name <span className="text-danger">*</span></Label>
//                                 <Input
//                                     id="deptName"
//                                     type="text"
//                                     placeholder="Enter Department Name"
//                                     value={newDeptName}
//                                     onChange={(e) => handleNewDepartmentChange(e.target.value)}
//                                     invalid={IR_OrgSlice?.deptNameExist}
//                                 />
//                                 {IR_OrgSlice?.deptNameExist === true ?
//                                     <div className='text-danger' >Department name alrady exist...!</div>
//                                     : null}

//                                 <Label for="deptCode" className='mt-3'>Department Code</Label>
//                                 <Input
//                                     id="deptCode"
//                                     type="text"
//                                     placeholder="Enter Department Code"
//                                     value={newDeptCode}
//                                     onChange={(e) => setNewDeptCode(e.target.value)}
//                                 />
//                             </ModalBody>
//                             <ModalFooter>
//                                 <Button color="secondary" onClick={() => toggle('showModal')}>
//                                     Cancel
//                                 </Button>
//                                 <Button color="primary" onClick={handleCreateDepartMent}>
//                                     Create
//                                 </Button>
//                             </ModalFooter>
//                         </Modal>
//                         <Modal isOpen={modal} toggle={() => toggleModal('modal')}>
//                             <ModalHeader toggle={() => toggleModal('modal')}>Add New Designation</ModalHeader>
//                             <ModalBody>
//                                 <Input
//                                     type="text"
//                                     placeholder="Enter Designation"
//                                     value={newDesignation}
//                                     onChange={(e) => handleDesignationChange(e.target.value)}
//                                     invalid={IR_OrgSlice?.degnNameExist}
//                                 />
//                                 {IR_OrgSlice?.degnNameExist === true ?
//                                     <div className='text-danger' >Designation name alrady exist...!</div>
//                                     : null}
//                             </ModalBody>
//                             <ModalFooter>
//                                 <Button color="secondary" onClick={() => toggleModal('modal')}>
//                                     Cancel
//                                 </Button>
//                                 <Button color="primary" type='submit' onClick={() => handleCreateDesignation()}>
//                                     Create
//                                 </Button>
//                             </ModalFooter>
//                         </Modal>
//                     </Container>
//                 </div>
//             </React.Fragment>
//         )
//     }
//     else {
//         return (
//             <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
//                 <div>Loading...</div>
//                 <Spinner color="primary" />
//             </div>
//         );
//     }
// }
// export default IRAddUser;


