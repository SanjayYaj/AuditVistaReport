import React, { useEffect, useMemo, useState } from 'react'
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row,Spinner, Label, Modal, ModalHeader, ModalBody, Input, FormFeedback, Form } from "reactstrap";
import TableContainer from './Components/TableContainer';
import { useDispatch, useSelector } from 'react-redux';
import { retriveBranchInfo, IRTvalidateDupName, setBranchNameExist, setDepartmentExist, seteditDeptInfo, setBranchData, retriveDeptInfo, createDeptInfo, deleteDeptInfo, setDesignationExist, setDeptStatus, setFlatDeptData } from '../../../toolkitStore/Auditvista/orgSlice';
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from 'sweetalert2';
import store from '../../../store';
import { MetaTags } from 'react-meta-tags';
import { Multiselect } from 'multiselect-react-dropdown';
import { Popconfirm } from 'antd';
import { usePermissions } from 'hooks/usePermisson';



const ManageDepartment = () => {
    const dispatch = useDispatch();
    const IR_OrgSlice = useSelector(state => state.orgSlice);
    const isDeptLoading = IR_OrgSlice.isDepartmentLoading



    const [authUser, setAuthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")));
    const [clientInfo, setClientInfo] = useState(JSON.parse(sessionStorage.getItem("client_info")))[0];
    const [modalDept, setModalDept] = useState(false);
    const [modalDegn, setModalDegn] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [status, setStatus] = useState(null)
    const { canEdit } = usePermissions("department");
    const [isSubmitted, setSubmitted] = useState(false)




    const flatDeptData = IR_OrgSlice.flatDeptData
    var parentDeptOption = IR_OrgSlice.departmentInfo?.map(dept => ({ parent_id: dept._id, parent_dept_name: dept.dept_name }));



    useEffect(() => {
        dispatch(retriveDeptInfo());
    }, [])

    useEffect(() => {
       
        if (IR_OrgSlice.departmentInfo && IR_OrgSlice.departmentInfo.length === 1) {
            setSelectedDepartmentId(IR_OrgSlice.departmentInfo[0]._id)
            deptValidation.setFieldValue('parent_id', IR_OrgSlice.departmentInfo[0]._id)
        }
    }, [IR_OrgSlice.departmentInfo, modalDept])

    


    useEffect(() => {
        if (IR_OrgSlice.branchInfo && IR_OrgSlice.branchInfo.length === 1) {
            setSelectedBranch(IR_OrgSlice.branchInfo);
        }
    }, [IR_OrgSlice.branchInfo]);


    useEffect(() => {
        var flatDeptData = flattenDeptTree(IR_OrgSlice.departMentData);
        dispatch(setFlatDeptData(flatDeptData))
    }, [IR_OrgSlice.departMentData]);



    const ensureAllFields = (values) => ({
    dept_name: "",
    dept_code: "",
    dept_descrption: "",
    branch_id: [],
    parent_id: "",
    status: "1",
    ...values,
});

const deptValidation = useFormik({
    initialValues: {
        dept_name: "",
        dept_code: "",
        dept_descrption: "",
        branch_id: [],
        parent_id: "",
        status: "1",
    },
    validationSchema: Yup.object({
        dept_name: Yup.string()
            .required("Department Name is required")
            .test("no-leading-or-trailing-space", "Department Name cannot be just spaces", value => {
                return value && value.trim().length > 0;
            })
            .test("min-trimmed-length", `Department Name must be at least ${clientInfo.incd_rpt_validation.name_min} characters`, function (value) {
                return value && value.trim().length >= clientInfo.incd_rpt_validation.name_min;
            })
            .test("unique-name", "Department Name already exists", async function (value) {
                return !(
                    await dispatch(
                        IRTvalidateDupName(
                            store.getState().orgSlice.editDeptInfo,
                            "cln_adt_departs",
                            "dept_name",
                            value,
                            setDepartmentExist
                        )
                    )
                );
            }),

        parent_id: Yup.string()
            .required("Parent Department is required")
            .matches(/\S+/, "Parent Department cannot be empty"),

        dept_descrption: Yup.string()
            .nullable()
            .notRequired()
            .test(
                "description-validation",
                "Description must be at least 10 characters and cannot be just spaces",
                function (value) {
                    if (!value) return true;
                    const trimmedValue = value.trim();
                    return trimmedValue.length >= clientInfo.incd_rpt_validation.desc_min;
                }
            ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
        setSubmitted(true);
        try {
            console.log('values :>> ', values);
            const fullValues = ensureAllFields(values);
            console.log('fullValues :>> ', fullValues);

            const isEdit = IR_OrgSlice?.editDeptInfo !== null;

            fullValues["created_by"] = isEdit
                ? selectedItem?.created_by
                : authUser?.user_data?._id;

            if (isEdit) {
                fullValues["_id"] = IR_OrgSlice.editDeptInfo._id;
                fullValues["modified_by"] = authUser.user_data._id;
            }

            fullValues["parent_id"] = isEdit
                ? selectedDepartmentId
                : selectedItem
                ? selectedItem._id
                : IR_OrgSlice?.departmentInfo?.find(d => d._id === selectedDepartmentId)?._id;

            fullValues["branch_id"] = selectedBranch.map(branch => ({
                _id: branch._id,
                br_name: branch.br_name
            }));

            delete fullValues?.children;

           

            if (!IR_OrgSlice.deptNameExist) {
                 console.log("Submitted values :>> ", selectedItem, fullValues);
                await dispatch(createDeptInfo(fullValues));
                setModalDept(false);
            }
        } catch (error) {
            console.error("Submit error:", error);
        } finally {
            setSubmitted(false);
            setSubmitting(false);
        }
    },
});



    // const ensureAllFields = (values) => ({
    //     dept_name: "",
    //     dept_code: "",
    //     dept_descrption: "",
    //     branch_id: [],
    //     parent_id: "",
    //     status: "1",
    //     ...values,
    // });

    // const deptValidation = useFormik({
    //     initialValues: {
    //         dept_name: "",
    //         dept_code: "",
    //         dept_descrption: '',
    //         branch_id: [],
    //         parent_id: '',
    //         status: "1",
    //     },
    //     validationSchema: Yup.object({
    //         // dept_name: Yup.string()
    //         //     .required("Department Name is required")
    //         //     .test(async function (value) {
    //         //         return !(
    //         //             await dispatch( IRTvalidateDupName( store.getState().orgSlice.editDeptInfo, "cln_adt_departs", "dept_name", value, setDepartmentExist ) )
    //         //         );
    //         //     })
    //         //     .matches(/\S+/, "Department Name cannot be just spaces")
    //         //     .min(
    //         //         clientInfo.incd_rpt_validation.name_min,
    //         //         `Department Name must be at least ${clientInfo.incd_rpt_validation.name_min} characters`
    //         //     ),
    //         dept_name: Yup.string()
    //             .required("Department Name is required")
    //             .test("no-leading-or-trailing-space", "Department Name cannot be just spaces", value => {
    //                 return value && value.trim().length > 0;
    //             })
    //             .test("min-trimmed-length", `Department Name must be at least ${clientInfo.incd_rpt_validation.name_min} characters`, function (value) {
    //                 return value && value.trim().length >= clientInfo.incd_rpt_validation.name_min;
    //             })
    //             .test("unique-name", "Department Name already exists", async function (value) {
    //                 return !(
    //                     await dispatch(
    //                         IRTvalidateDupName(
    //                             store.getState().orgSlice.editDeptInfo,
    //                             "cln_adt_departs",
    //                             "dept_name",
    //                             value,
    //                             setDepartmentExist
    //                         )
    //                     )
    //                 );
    //             }),

    //         parent_id: Yup.string()
    //             .required("Parent Department is required")
    //             .matches(/\S+/, "Parent Department cannot be empty"),
    //         dept_descrption: Yup.string()
    //             .nullable()
    //             .notRequired()
    //             .test(
    //                 "description-validation",
    //                 "Description must be at least 10 characters and cannot be just spaces",
    //                 function (value) {
    //                     if (!value) return true;
    //                     const trimmedValue = value.trim();
    //                     return trimmedValue.length >= clientInfo.incd_rpt_validation.desc_min;
    //                 }
    //             ),

    //     }),
    //     onSubmit: async(values) => {
    //         setSubmitted(true)
    //         console.log('values :>> ', values);
    //         const fullValues = ensureAllFields(values);
    //         console.log('fullValues :>> ', fullValues);

    //         fullValues["created_by"] = IR_OrgSlice?.editDeptInfo !== null ? selectedItem.created_by : authUser.user_data._id;
    //         if (IR_OrgSlice.editDeptInfo !== null) {
    //             fullValues["_id"] = IR_OrgSlice.editDeptInfo._id;
    //             fullValues["modified_by"] = authUser.user_data._id;
    //         }
    //         console.log(selectedDepartmentId, IR_OrgSlice?.editDeptInfo, selectedItem, selectedDepartmentId);
    //         fullValues["parent_id"] = IR_OrgSlice?.editDeptInfo !== null ? selectedDepartmentId : selectedItem ? selectedItem._id : IR_OrgSlice?.departmentInfo?.find(d => d._id === selectedDepartmentId)?._id;
    //         fullValues["branch_id"] = selectedBranch.map(branch => ({ _id: branch._id, br_name: branch.br_name }));
    //         delete fullValues?.children;

    //         console.log("Submitted values :>> ", selectedItem, fullValues);

    //         if (!IR_OrgSlice.deptNameExist) {
    //            await dispatch(createDeptInfo(fullValues));
    //             setModalDept(false);
    //             setSubmitted(false)
    //         }
    //     },
    // });




    // const deptValidation = useFormik({
    //     initialValues: {
    //         dept_name: "",
    //         dept_code: "",
    //         dept_descrption: '',
    //         branch_id: [],
    //         parent_id: '',
    //         status: "1",
    //     },
    //     validationSchema: Yup.object({
    //         // dept_name: Yup.string()
    //         //     .required("Department Name is required")
    //         //     .test(async function (value) {
    //         //         return !(
    //         //             await dispatch( IRTvalidateDupName( store.getState().orgSlice.editDeptInfo, "cln_adt_departs", "dept_name", value, setDepartmentExist ) )
    //         //         );
    //         //     })
    //         //     .matches(/\S+/, "Department Name cannot be just spaces")
    //         //     .min(
    //         //         clientInfo.incd_rpt_validation.name_min,
    //         //         `Department Name must be at least ${clientInfo.incd_rpt_validation.name_min} characters`
    //         //     ),
    //         dept_name: Yup.string()
    //             .required("Department Name is required")
    //             .test("no-leading-or-trailing-space", "Department Name cannot be just spaces", value => {
    //                 return value && value.trim().length > 0;
    //             })
    //             .test("min-trimmed-length", `Department Name must be at least ${clientInfo.incd_rpt_validation.name_min} characters`, function (value) {
    //                 return value && value.trim().length >= clientInfo.incd_rpt_validation.name_min;
    //             })
    //             .test("unique-name", "Department Name already exists", async function (value) {
    //                 return !(
    //                     await dispatch(
    //                         IRTvalidateDupName(
    //                             store.getState().orgSlice.editDeptInfo,
    //                             "cln_adt_departs",
    //                             "dept_name",
    //                             value,
    //                             setDepartmentExist
    //                         )
    //                     )
    //                 );
    //             }),

    //         parent_id: Yup.string()
    //             .required("Parent Department is required")
    //             .matches(/\S+/, "Parent Department cannot be empty"),
    //         dept_descrption: Yup.string()
    //             .nullable()
    //             .notRequired()
    //             .test(
    //                 "description-validation",
    //                 "Description must be at least 10 characters and cannot be just spaces",
    //                 function (value) {
    //                     if (!value) return true;
    //                     const trimmedValue = value.trim();
    //                     return trimmedValue.length >= clientInfo.incd_rpt_validation.desc_min;
    //                 }
    //             ),

    //     }),
    //     onSubmit: (values) => {
    //         console.log('values :>> ', values);


    //         if (submitLockRef.current) return; // 🔐 Hard stop
    //         submitLockRef.current = true; // ✅ Lock immediately

    //         formikHelpers.setSubmitting(true);

    //         const fullValues = ensureAllFields(values);
    //         console.log('fullValues :>> ', fullValues);

    //         fullValues["created_by"] = IR_OrgSlice?.editDeptInfo !== null ? selectedItem.created_by : authUser.user_data._id;
    //         if (IR_OrgSlice.editDeptInfo !== null) {
    //             fullValues["_id"] = IR_OrgSlice.editDeptInfo._id;
    //             fullValues["modified_by"] = authUser.user_data._id;
    //         }
    //         console.log(selectedDepartmentId, IR_OrgSlice?.editDeptInfo, selectedItem, selectedDepartmentId);
    //         fullValues["parent_id"] = IR_OrgSlice?.editDeptInfo !== null ? selectedDepartmentId : selectedItem ? selectedItem._id : IR_OrgSlice?.departmentInfo?.find(d => d._id === selectedDepartmentId)?._id;
    //         fullValues["branch_id"] = selectedBranch.map(branch => ({ _id: branch._id, br_name: branch.br_name }));
    //         delete fullValues?.children;

    //         console.log("Submitted values :>> ", selectedItem, fullValues);

    //         if (!IR_OrgSlice.deptNameExist) {
    //             // dispatch(createDeptInfo(fullValues));
    //             // setModalDept(false);
    //         }
    //     },
    // });


    const Deptcolumns = useMemo(() => {
        const columns = [
           
            {
                accessor: "dept_name",
                Header: "Department Name",
                filterable: true,
                Cell: ({ row }) => {
                    const item = row.original;
                    const isParent = (item.children && item.children.length > 0) || item.level === 0;
                    return (
                        <div className="d-flex align-items-center" style={{ paddingLeft: `${(item.level || 0) * 20}px`, position: "relative" }} >
                            <div style={{ position: "absolute", left: `${(item.level || 0) * 20 - 10}px`, top: 0, bottom: 0, width: "1px", backgroundColor: "#dee2e6", zIndex: 0 }} />
                            <i className={`me-2 ${isParent ? "bx bxs-folder text-secondary" : "bx bx-file text-muted"}`} style={{ fontSize: "16px", zIndex: 1 }} />
                            <span className={`font-size-12 fw-bold ${item.level !== 0 ? "text-muted" : "text-dark"}`} style={{ zIndex: 1 }} >
                                {item.dept_name}
                            </span>
                        </div>
                    );
                },
            },
            
            {
                accessor: "dummy",
                Header: "Parent",
                filterable: true,
                width: "10%",
                Cell: ({ row }) => {
                      const item = row.original;
                    const isParent = (item.children && item.children.length > 0) || item.level === 0;
                    return (
                        <div className="font-size-11">{isParent ? "Parent" : 'Children'}</div>
                    )
                }
            },
            {
                accessor: "fullname",
                Header: "Created By",
                filterable: true,
                width: "10%",
                Cell: ({ row }) => {
                    const item = row.original;
                    return (
                        <div className="font-size-11">
                            {item.fullname || "-"}
                        </div>
                    );
                },
            },
            {
                accessor: "status",
                Header: "Status",
                filterable: true,
                width: "10%",
                Cell: ({ row }) => {
                    const item = row.original;
                    const isActive = item.status === "1";
                    return (
                        <span className={`badge ${isActive ? "badge-soft-success" : "badge-soft-danger"}`} style={{ fontSize: "11px" }}>
                            {isActive ? "Active" : "Inactive"}
                        </span>
                    );
                },
            },
        ];

        if (canEdit) {
            columns.push({
                accessor: "Action",
                Header: "Action",
                width: "10%",
                Cell: ({ row }) => {
                    const item = row.original;
                    return (
                        <ul className="list-unstyled hstack gap-1 mb-0 font-size-11">
                            <li>
                                <Link
                                    to="#"
                                    className="btn btn-sm btn-soft-secondary d-flex align-items-center"
                                    onClick={() => {
                                        console.log(item);
                                        setSelectedItem(item);
                                        deptValidation.resetForm();
                                        deptValidation.setValues({});
                                        dispatch(seteditDeptInfo(null));
                                        setModalDept(true);
                                    }}
                                    id={`addsubmenu-tooltip-${item._id}`}
                                >
                                    <i className="bx bx-plus me-2" /> Add Sub Department
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="#"
                                    className="btn btn-sm btn-soft-primary d-flex align-items-center"
                                    onClick={() => onEditDepartment(item)}
                                    id={`edittooltip-${item._id}`}
                                >
                                    <i className="bx bx-edit-alt me-2" /> Edit
                                </Link>
                            </li>
                        </ul>
                    );
                },
            });
        }

        return columns;
    }, [flatDeptData, canEdit]);




    function flattenDeptTree(data) {
        const map = {};
        const roots = [];

        data.forEach(item => {
            map[item._id] = { ...item, children: [] };
        });

        data.forEach(item => {
            if (item.parent_id && map[item.parent_id]) {
                map[item.parent_id].children.push(map[item._id]);
            } else {
                roots.push(map[item._id]);
            }
        });

        const result = [];
        const traverse = (node, level = 0) => {
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => traverse(child, level + 1));
            }
            result.push({ ...node, level });
        };

        roots.forEach(root => traverse(root));
        return result;
    }



    const toggleModal = (open) => {
        if (open === 'modalDept') {
            dispatch(setDepartmentExist(false));
            setModalDept(!modalDept);

        } else {
            dispatch(setDesignationExist(false));
            setModalDegn(!modalDegn);
        }
    }



    const onClickDelete = (item, mode) => {
        Swal.fire({
            icon: 'question',
            title: 'Are you sure?',
            text: `Do you want to delete this Department ?`,
            showCancelButton: true,
            confirmButtonColor: '#2ba92b',
            confirmButtonText: 'Yes',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteDeptInfo(item))
            }
        })
    }



    const onEditDepartment = (item) => {
        dispatch(setDepartmentExist(false))
        setSelectedItem(item);
        setSelectedDepartmentId(item.parent_id)
        setSelectedBranch(item.branch_id);
        dispatch(seteditDeptInfo(item));
        deptValidation.setValues(item);
        setModalDept(true);
    };



    const handleChangeStatus = (value) => {
        let status;
        const getParent = (item) => {
            return flatDeptData.find(dept => dept?._id === item?.parent_id);
        };
        if (value === '0') {
            const isLeaf = !selectedItem?.children || selectedItem?.children.length === 0 || selectedItem?.status === null;
            if (isLeaf) {
                status = true;
            } else {
                const hasInactiveChild = selectedItem.children.some(child => child.status === '0');
                console.log('hasInactiveChild :>> ', hasInactiveChild);
                status = hasInactiveChild;
            }
            console.log("Deactivating - allowed?", status);
            dispatch(setDeptStatus(status));
        } else {
            const parent = getParent(selectedItem);
            if (parent && parent.status !== '1') {
                status = false;
            } else {
                status = true;
            }
            console.log("Activating - allowed?", status);
            dispatch(setDeptStatus(status));
        }
    };





    const handleSelect = (selectedList) => {
        deptValidation.setFieldValue("branch_id", selectedList);
        if (selectedList.length > 0) {
            deptValidation.setFieldTouched("branch_id", false); 
        }
        setSelectedBranch(selectedList)
    };

    const handleRemove = (selectedList) => {
        deptValidation.setFieldValue("branch_id", selectedList);
        if (selectedList.length === 0) {
            deptValidation.setFieldTouched("branch_id", true, false); 
        }
        setSelectedBranch(selectedList)
    };
    
    var fieldsDept = [
        { label: "Department Name :", name: "dept_name", placeholder: "Enter Department Name", mandatory: true, type: "text", name_exist: IR_OrgSlice.deptNameExist, message: IR_OrgSlice.deptNameExist ? "Department Name already exist" : "", show: true },
        { label: "Parent Department :", name: "parent_id", placeholder: "Select Parent Department", mandatory: true, type: "select", options: parentDeptOption, value: selectedDepartmentId, key: "parent_dept_name", show: parentDeptOption?.length === 1 ? false : true },
        { label: "Branch :", name: "br_name", placeholder: "Select Branch", mandatory: false, type: "multi-select", options: IR_OrgSlice.branchInfo, value: selectedBranch, key: "", show: IR_OrgSlice.branchInfo?.length === 1 ? false : true },
        { label: "Department Code :", name: "dept_code", placeholder: "Enter Department Code", mandatory: false, type: "text", show: true },
        { label: "Department Descrption:", name: "dept_descrption", placeholder: "Enter Descrption", mandatory: false, type: "textarea", show: true },
        { label: "Status:", name: "status", placeholder: "", mandatory: false, type: "switch", value: deptValidation.values.status || "1", show: true }
    ];
    fieldsDept = fieldsDept.filter(field => field.show);



    return (
        <>
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Manage Department | AuditVista</title>
                    </MetaTags>


                    <Breadcrumbs title="Department" breadcrumbItem="Department" />
                    <Container fluid={true}>
                        <Col lg={12}>
                            <Card style={{ minHeight: "78vh" }}>
                                <CardBody>
                                {isDeptLoading ? (
                                        <div style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
                                        </div>
                                    ) : (
                                        <TableContainer
                                            columns={Deptcolumns}
                                            data={flatDeptData}
                                            isGlobalFilter={true}
                                            isAddOptions={false}
                                            isJobListGlobalFilter={false}
                                            isPagination={true}
                                            iscustomPageSizeOptions={false}
                                            isShowingPageLength={false}
                                            customPageSize={10}
                                            tableClass="align-middle table-nowrap table-check table-striped-columns table-hover"
                                            theadClass="table-light"
                                            pagination="pagination pagination-rounded justify-content-end my-2"
                                            shwoBtn={true}
                                            id={'dept'}
                                            handleNewBranch={() => { dispatch(setDepartmentExist(false)); setSelectedItem(null); deptValidation.resetForm(); deptValidation.setValues({}); dispatch(seteditDeptInfo(null)); setModalDept(true); }}
                                            handleReset={() => { dispatch(retriveDeptInfo()); }}
                                            canEdit={canEdit}
                                        />
                                  )  }

                                </CardBody>
                            </Card>
                        </Col>
                    </Container>

                    {modalDept && (
    <Modal backdrop={"static"} isOpen={modalDept} toggle={() => toggleModal('modalDept')}>
        <ModalHeader toggle={() => toggleModal('modalDept')} tag="h4">
            {IR_OrgSlice.editDeptInfo
                ? "Edit Department"
                : selectedItem
                ? 'Add Sub Department'
                : "Add Department"}
        </ModalHeader>
        <ModalBody>
            <Form onSubmit={deptValidation.handleSubmit}>
                <Row>
                    <Col className="col-12">
                        {fieldsDept.map((field, index) => (
                            field.show && (
                                <div className="mb-3" key={index}>
                                    <Label className="form-label">
                                        {field.label}
                                        {field.mandatory && <span className='text-danger'>*</span>}
                                    </Label>

                                    {/* Multi-select */}
                                    {field.type === "multi-select" && field.options ? (
                                        <>
                                            <Multiselect
                                                options={field.options}
                                                selectedValues={deptValidation.values.branch_id}
                                                onSelect={handleSelect}
                                                onRemove={handleRemove}
                                                displayValue="br_name"
                                                placeholder="Select Branch"
                                                showCheckbox={true}
                                                style={{ width: "100%" }}
                                            />
                                            {deptValidation.errors.branch_id && deptValidation.touched.branch_id && (
                                                <div className="text-danger" style={{ fontSize: "smaller" }}>
                                                    {deptValidation.errors.branch_id}
                                                </div>
                                            )}
                                        </>
                                    ) : field.type === "select" && field.options ? (
                                        <>
                                            <select
                                                name="parent_id"
                                                onChange={e => {
                                                    const value = e.target.value;
                                                    setSelectedDepartmentId(value);
                                                    deptValidation.setFieldValue('parent_id', value);
                                                }}
                                                value={deptValidation.values.parent_id || ""}
                                                className={`form-select ${deptValidation.touched.parent_id && deptValidation.errors.parent_id ? 'is-invalid' : ''}`}
                                            >
                                                <option value="" disabled>Select</option>
                                                {field.options.map((ele, idx) => (
                                                    <option key={idx} value={ele[field.name]}>
                                                        {ele[field.key]}
                                                    </option>
                                                ))}
                                            </select>
                                        </>
                                    ) : field.type === "textarea" ? (
                                        <textarea
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            onChange={deptValidation.handleChange}
                                            onBlur={deptValidation.handleBlur}
                                            value={deptValidation.values[field.name] || ""}
                                            className={`form-control ${deptValidation.touched[field.name] && deptValidation.errors[field.name] ? 'is-invalid' : ''}`}
                                        />
                                    ) : field.type === "switch" ? (
                                        <div className="form-check form-switch mt-2">
                                            <Popconfirm
                                                title={`Are you sure you want to ${deptValidation.values.status === "1" ? "deactivate" : "activate"} this?`}
                                                onConfirm={() => {
                                                    if (IR_OrgSlice.deptStatus) {
                                                        const newVal = deptValidation.values.status === "1" ? "0" : "1";
                                                        setStatus(newVal);
                                                        handleChangeStatus(newVal);
                                                        deptValidation.setFieldValue("status", newVal);
                                                    } else {
                                                        Swal.fire({
                                                            icon: 'error',
                                                            title: 'Action Not Allowed',
                                                            text: 'You cannot change the status due to inactive child departments.'
                                                        });
                                                    }
                                                }}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="active"
                                                    name="status"
                                                    checked={deptValidation.values.status === "1"}
                                                    readOnly
                                                />
                                            </Popconfirm>
                                            <label className="form-check-label ms-1" htmlFor="active">
                                                {deptValidation.values.status === "1" ? "Active" : "Inactive"}
                                            </label>
                                        </div>
                                    ) : (
                                        <Input
                                            name={field.name}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            onChange={deptValidation.handleChange}
                                            onBlur={deptValidation.handleBlur}
                                            value={deptValidation.values[field.name] || ""}
                                            invalid={deptValidation.touched[field.name] && deptValidation.errors[field.name] ? true : false}
                                        />
                                    )}

                                    {deptValidation.touched[field.name] && deptValidation.errors[field.name] && (
                                        <FormFeedback type="invalid">{deptValidation.errors[field.name]}</FormFeedback>
                                    )}

                                    {field.name_exist && (
                                        <div className='text-danger' style={{ fontSize: 'smaller' }}>
                                            {field.message}
                                        </div>
                                    )}
                                </div>
                            )
                        ))}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="text-end">
                            <button
                                className="btn btn-sm w-md btn-outline-success"
                                type="submit"
                                disabled={deptValidation.isSubmitting}
                            >
                                {(deptValidation.isSubmitting ) ? (
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                ) : null}
                                {IR_OrgSlice.editDeptInfo ? "Update" : "Save"}
                            </button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </ModalBody>
    </Modal>
)}


                    {/* {modalDept && (
                        <Modal backdrop={"static"} isOpen={modalDept} toggle={() => toggleModal('modalDept')}>
                            <ModalHeader toggle={() => toggleModal('modalDept')} tag="h4">
                                {IR_OrgSlice.editDeptInfo !== null ? "Edit Department" : selectedItem && selectedItem !== null ? 'Add Sub Department' : "Add Department"}
                            </ModalHeader>
                            <ModalBody>
                                <Form onSubmit={async (e) => { e.preventDefault(); 
                                
                                const errors = await deptValidation.validateForm();
                                    deptValidation.setTouched({ dept_name: true, dept_code: true, dept_descrption: true, branch_id: true, parent_id: true, status: true });
                                    if (Object.keys(errors).length === 0) {
                                        deptValidation.handleSubmit();
                                    }
                                }}>
                                    <Row>
                                        <Col className="col-12">
                                            {fieldsDept.map((field, index) => (
                                                field.show && (
                                                    <div className="mb-3" key={index}>
                                                        <Label className="form-label">
                                                            {field.label}
                                                            {field.mandatory && <span className='text-danger'>*</span>}
                                                        </Label>
                                                        {field.type === "multi-select" && field.options ? (
                                                            <>
                                                                <Multiselect
                                                                    options={field.options}
                                                                    selectedValues={field.value || deptValidation.values.branch_id}
                                                                    onSelect={handleSelect}
                                                                    onRemove={handleRemove}
                                                                    displayValue="br_name"
                                                                    placeholder="Select Branch"
                                                                    showCheckbox={true}
                                                                    style={{ width: "100%" }}
                                                                />
                                                                {deptValidation.errors.branch_id && deptValidation.touched.branch_id && (
                                                                    <div className="text-danger" style={{ fontSize: "smaller" }}>
                                                                        {deptValidation.errors.branch_id}
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : field.type === "select" && field.options ? (
                                                                <>
                                                                    <select
                                                                        name={'parent_id'}
                                                                        onChange={e => { const value = e.target.value; setSelectedDepartmentId(value); deptValidation.setFieldValue('parent_id', value); }}
                                                                        value={deptValidation.values['parent_id'] || ""}
                                                                        className={`form-select ${deptValidation.touched['parent_id'] && deptValidation.errors['parent_id'] ? 'is-invalid' : ''}`}
                                                                    >
                                                                        <option value="" disabled>Select</option>
                                                                        {field.options.map((ele, idx) => (
                                                                            <option key={idx} value={ele[field.name]}>
                                                                                {ele[field.key]}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                   
                                                                </>

                                                        ) : field.type === "textarea" ? (
                                                            <textarea
                                                                name={field.name}
                                                                placeholder={field.placeholder}
                                                                onChange={deptValidation.handleChange}
                                                                onBlur={deptValidation.handleBlur}
                                                                value={deptValidation.values[field.name] || ""}
                                                                className={`form-control ${deptValidation.touched[field.name] && deptValidation.errors[field.name] ? 'is-invalid' : ''}`}
                                                            />
                                                        ) :
                                                            field.type === "switch" ? (

                                                                <div className="form-check form-switch mt-2">
                                                                    <Popconfirm
                                                                        title={`Are you sure you want to ${deptValidation.values.status === "1" ? "deactivate" : "activate"} this?`}
                                                                        onConfirm={(e) => {
                                                                            if (IR_OrgSlice.deptStatus) {
                                                                                deptValidation.setFieldValue("status", status);
                                                                            } else {
                                                                                Swal.fire({ icon: 'error', title: 'Action Not Allowed', text: 'You cannot change the status due to inactive child departments.' });
                                                                            }
                                                                        }}

                                                                        okText="Yes"
                                                                        cancelText="No"
                                                                    >
                                                                        <input className="form-check-input" type="checkbox" id="active" name="status" checked={field.value === "1"} onChange={(e) => { const val = e.target.checked ? "1" : "0"; setStatus(val); handleChangeStatus(val) }} />
                                                                    </Popconfirm>

                                                                    <label className="form-check-label ms-1" htmlFor="active">
                                                                        {field.value === "1" ? "Active" : "Inactive"}
                                                                    </label>
                                                                </div>
                                                            ) :
                                                                (
                                                                    <Input
                                                                        name={field.name}
                                                                        type={field.type}
                                                                        placeholder={field.placeholder}
                                                                        onChange={deptValidation.handleChange}
                                                                        onBlur={deptValidation.handleBlur}
                                                                        value={deptValidation.values[field.name] || ""}
                                                                        invalid={deptValidation.touched[field.name] && deptValidation.errors[field.name] ? true : false}
                                                                    />
                                                                )}

                                                        {deptValidation.touched[field.name] && deptValidation.errors[field.name] && (
                                                            <FormFeedback type="invalid">{deptValidation.errors[field.name]}</FormFeedback>
                                                        )}

                                                        {field.name_exist && <div className='text-danger' style={{ fontSize: 'smaller' }}>{field.message}</div>}
                                                    </div>
                                                )
                                            ))}

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="text-end">
                                                <button
                                                    className="btn btn-sm w-md btn-outline-success">
                                                    {IR_OrgSlice.editDeptInfo !== null ? "Update" : "Save"}
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </ModalBody>
                        </Modal>
                    )} */}

                </div>
            </React.Fragment>
        </>
    );

}

export default ManageDepartment;








///31-5-25-Venu
// import React, { useEffect, useMemo, useState } from 'react'
// import Breadcrumbs from '../../../components/Common/Breadcrumb'
// import { Link } from 'react-router-dom';
// import { Card, CardBody, Col, Container, Row, Label, Modal, ModalHeader, ModalBody, Input, FormFeedback, Form ,Spinner} from "reactstrap";
// import TableContainer from './Components/TableContainer';
// import { useDispatch, useSelector } from 'react-redux';
// import { retriveBranchInfo, IRTvalidateDupName, setBranchNameExist, setDepartmentExist, seteditDeptInfo, setBranchData, retriveDeptInfo, createDeptInfo, deleteDeptInfo, setDesignationExist, setDeptStatus, setFlatDeptData } from '../../../toolkitStore/Auditvista/orgSlice';
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import Swal from 'sweetalert2';
// import store from '../../../store';
// import { MetaTags } from 'react-meta-tags';
// import { Multiselect } from 'multiselect-react-dropdown';
// import { Popconfirm } from 'antd';
// import { usePermissions } from 'hooks/usePermisson';
// import { useDepartmentValidation } from '../../../utils/useDepartmentValidation';

// const ManageDepartment = () => {
//     const dispatch = useDispatch();
//     const IR_OrgSlice = useSelector(state => state.orgSlice);
//     const isDeptLoading = IR_OrgSlice.isDepartmentLoading

//     // Use the custom hook for debounced validation
//     const { debouncedDepartmentValidation } = useDepartmentValidation(500);

//     const [authUser, setAuthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")));
//     const [clientInfo, setClientInfo] = useState(JSON.parse(sessionStorage.getItem("client_info")))[0];
//     const [modalDept, setModalDept] = useState(false);
//     const [modalDegn, setModalDegn] = useState(false);
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
//     const [selectedBranch, setSelectedBranch] = useState([]);
//     const [status, setStatus] = useState(null)
//     const { canEdit } = usePermissions("department");

//     const flatDeptData = IR_OrgSlice.flatDeptData
//     var parentDeptOption = IR_OrgSlice.departmentInfo?.map(dept => ({ parent_id: dept._id, parent_dept_name: dept.dept_name }));

//     useEffect(() => {
//         dispatch(retriveDeptInfo());
//     }, [])

//     useEffect(() => {
//         if (IR_OrgSlice.departmentInfo && IR_OrgSlice.departmentInfo.length === 1) {
//             setSelectedDepartmentId(IR_OrgSlice.departmentInfo[0]._id)
//         }
//     }, [IR_OrgSlice.departmentInfo])

//     useEffect(() => {
//         if (IR_OrgSlice.branchInfo && IR_OrgSlice.branchInfo.length === 1) {
//             setSelectedBranch(IR_OrgSlice.branchInfo);
//         }
//     }, [IR_OrgSlice.branchInfo]);

//     useEffect(() => {
//         var flatDeptData = flattenDeptTree(IR_OrgSlice.departMentData);
//         dispatch(setFlatDeptData(flatDeptData))
//     }, [IR_OrgSlice.departMentData]);

//     const ensureAllFields = (values) => ({
//         dept_name: "",
//         dept_code: "",
//         dept_descrption: "",
//         branch_id: [],
//         parent_id: "",
//         status: "1",
//         ...values,
//     });

//     const deptValidation = useFormik({
//         initialValues: {
//             dept_name: "",
//             dept_code: "",
//             dept_descrption: '',
//             branch_id: [],
//             parent_id: '',
//             status: "1",
//         },
//         validationSchema: Yup.object({
//             dept_name: Yup.string()
//                 .required("Department Name is required")
//                 .matches(/\S+/, "Department Name cannot be just spaces")
//                 .min(
//                     clientInfo.incd_rpt_validation.name_min,
//                     `Department Name must be at least ${clientInfo.incd_rpt_validation.name_min} characters`
//                 ),
//             dept_descrption: Yup.string()
//                 .nullable()
//                 .notRequired()
//                 .test(
//                     "description-validation",
//                     "Description must be at least 10 characters and cannot be just spaces",
//                     function (value) {
//                         if (!value) return true;
//                         const trimmedValue = value.trim();
//                         return trimmedValue.length >= clientInfo.incd_rpt_validation.desc_min;
//                     }
//                 ),
//             branch_id: Yup.array()
//                 .min(1, "At least one branch must be selected")
//                 .of(
//                     Yup.object().shape({
//                         _id: Yup.string().required("Branch ID is required"),
//                         br_name: Yup.string().required("Branch name is required"),
//                     })
//                 ),
//         }),
//         onSubmit: async (values) => {
//             try {
//                 // Validate department name before submitting
//                 if (values.dept_name) {
//                     await dispatch(IRTvalidateDupName(
//                         store.getState().orgSlice.editDeptInfo,
//                         "cln_adt_departs",
//                         "dept_name",
//                         values.dept_name,
//                         setDepartmentExist
//                     ));
//                 }

//                 // Check if there are validation errors from the API
//                 if (IR_OrgSlice.deptNameExist) {
//                     return;
//                 }

//                 const fullValues = ensureAllFields(values);

//                 fullValues["created_by"] = IR_OrgSlice?.editDeptInfo !== null ? selectedItem.created_by : authUser.user_data._id;
//                 if (IR_OrgSlice.editDeptInfo !== null) {
//                     fullValues["_id"] = IR_OrgSlice.editDeptInfo._id;
//                     fullValues["modified_by"] = authUser.user_data._id;
//                 }
//                 console.log(selectedDepartmentId, IR_OrgSlice?.editDeptInfo, selectedItem);
//                 fullValues["parent_id"] = IR_OrgSlice?.editDeptInfo !== null ? selectedItem.parent_id : selectedItem ? selectedItem._id : IR_OrgSlice?.departmentInfo?.find(d => d._id === selectedDepartmentId)?._id;
//                 fullValues["branch_id"] = selectedBranch.map(branch => ({ _id: branch._id, br_name: branch.br_name }));
//                 delete fullValues?.children;

//                 console.log("Submitted values :>> ", selectedItem, fullValues);

//                 if (!IR_OrgSlice.deptNameExist) {
//                     dispatch(createDeptInfo(fullValues));
//                     setModalDept(false);
//                 }
//             } catch (error) {
//                 console.log('Error in form submission:', error);
//             }
//         },
//     });

//     // Custom handler for department name change
//     const handleDepartmentNameChange = (e) => {
//         const value = e.target.value;
//         deptValidation.setFieldValue("dept_name", value);
//         dispatch(setDepartmentExist(false)); // Reset the error state
//         debouncedDepartmentValidation(value); // Trigger debounced validation
//     };

//     const Deptcolumns = useMemo(() => {
//         const columns = [
//             {
//                 accessor: "dept_name",
//                 Header: "Department Name",
//                 filterable: true,
//                 width: "45%",
//                 Cell: ({ row }) => {
//                     const item = row.original;
//                     const isParent = (item.children && item.children.length > 0) || item.level === 0;
//                     return (
//                         <div className="d-flex flex-column">
//                             <div className="font-size-13 fw-bold text-buttonPrimaryE">{item.dept_name}</div>
//                             <div className="font-size-11 text-secondary">Code - {item.dept_code}</div>
//                         </div>
//                     );
//                 },
//             },
//             {
//                 accessor: "dummy",
//                 Header: "Parent",
//                 filterable: true,
//                 width: "10%",
//                 Cell: ({ row }) => (
//                     <div className="font-size-11">{"Parent"}</div>
//                 )
//             },
//             {
//                 accessor: "fullname",
//                 Header: "Created By",
//                 filterable: true,
//                 width: "10%",
//                 Cell: ({ row }) => {
//                     const item = row.original;
//                     return (
//                         <div className="font-size-11">
//                             {item.fullname || "-"}
//                         </div>
//                     );
//                 },
//             },
//             {
//                 accessor: "status",
//                 Header: "Status",
//                 filterable: true,
//                 width: "10%",
//                 Cell: ({ row }) => {
//                     const item = row.original;
//                     const isActive = item.status === "1";
//                     return (
//                         <span className={`badge ${isActive ? "badge-soft-success" : "badge-soft-danger"}`} style={{ fontSize: "11px" }}>
//                             {isActive ? "Active" : "Inactive"}
//                         </span>
//                     );
//                 },
//             },
//         ];

//         if (canEdit) {
//             columns.push({
//                 accessor: "Action",
//                 Header: "Action",
//                 width: "10%",
//                 Cell: ({ row }) => {
//                     const item = row.original;
//                     return (
//                         <ul className="list-unstyled hstack gap-1 mb-0 font-size-11">
//                             <li>
//                                 <Link
//                                     to="#"
//                                     className="btn btn-sm btn-soft-secondary d-flex align-items-center"
//                                     onClick={() => {
//                                         console.log(item);
//                                         setSelectedItem(item);
//                                         deptValidation.resetForm();
//                                         deptValidation.setValues({});
//                                         dispatch(seteditDeptInfo(null));
//                                         setModalDept(true);
//                                     }}
//                                     id={`addsubmenu-tooltip-${item._id}`}
//                                 >
//                                     <i className="bx bx-plus me-2" /> Add Sub Department
//                                 </Link>
//                             </li>

//                             <li>
//                                 <Link
//                                     to="#"
//                                     className="btn btn-sm btn-soft-primary d-flex align-items-center"
//                                     onClick={() => onEditDepartment(item)}
//                                     id={`edittooltip-${item._id}`}
//                                 >
//                                     <i className="bx bx-edit-alt me-2" /> Edit
//                                 </Link>
//                             </li>
//                         </ul>
//                     );
//                 },
//             });
//         }

//         return columns;
//     }, [flatDeptData, canEdit]);

//     function flattenDeptTree(data) {
//         const map = {};
//         const roots = [];

//         data.forEach(item => {
//             map[item._id] = { ...item, children: [] };
//         });

//         data.forEach(item => {
//             if (item.parent_id && map[item.parent_id]) {
//                 map[item.parent_id].children.push(map[item._id]);
//             } else {
//                 roots.push(map[item._id]);
//             }
//         });

//         const result = [];
//         const traverse = (node, level = 0) => {
//             if (node.children && node.children.length > 0) {
//                 node.children.forEach(child => traverse(child, level + 1));
//             }
//             result.push({ ...node, level });
//         };

//         roots.forEach(root => traverse(root));
//         return result;
//     }

//     const toggleModal = (open) => {
//         if (open === 'modalDept') {
//             dispatch(setDepartmentExist(false));
//             setModalDept(!modalDept);
//         } else {
//             dispatch(setDesignationExist(false));
//             setModalDegn(!modalDegn);
//         }
//     }

//     const onClickDelete = (item, mode) => {
//         Swal.fire({
//             icon: 'question',
//             title: 'Are you sure?',
//             text: `Do you want to delete this Department ?`,
//             showCancelButton: true,
//             confirmButtonColor: '#2ba92b',
//             confirmButtonText: 'Yes',
//             cancelButtonColor: '#d33',
//             cancelButtonText: 'No'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 dispatch(deleteDeptInfo(item))
//             }
//         })
//     }

//     const onEditDepartment = (item) => {
//         setSelectedItem(item);
//         setSelectedBranch(item.branch_id);
//         dispatch(seteditDeptInfo(item));
//         deptValidation.setValues(item);
//         setModalDept(true);
//     };

//     const handleChangeStatus = (value) => {
//         let status;
//         const getParent = (item) => {
//             return flatDeptData.find(dept => dept?._id === item?.parent_id);
//         };
//         if (value === '0') {
//             const isLeaf = !selectedItem?.children || selectedItem?.children.length === 0 || selectedItem?.status === null;
//             if (isLeaf) {
//                 status = true;
//             } else {
//                 const hasInactiveChild = selectedItem.children.some(child => child.status === '0');
//                 console.log('hasInactiveChild :>> ', hasInactiveChild);
//                 status = hasInactiveChild;
//             }
//             console.log("Deactivating - allowed?", status);
//             dispatch(setDeptStatus(status));
//         } else {
//             const parent = getParent(selectedItem);
//             if (parent && parent.status !== '1') {
//                 status = false;
//             } else {
//                 status = true;
//             }
//             console.log("Activating - allowed?", status);
//             dispatch(setDeptStatus(status));
//         }
//     };

//     const handleSelect = (selectedList) => {
//         deptValidation.setFieldValue("branch_id", selectedList);
//         if (selectedList.length > 0) {
//             deptValidation.setFieldTouched("branch_id", false);
//         }
//         setSelectedBranch(selectedList)
//     };

//     const handleRemove = (selectedList) => {
//         deptValidation.setFieldValue("branch_id", selectedList);
//         if (selectedList.length === 0) {
//             deptValidation.setFieldTouched("branch_id", true, false);
//         }
//         setSelectedBranch(selectedList)
//     };

//     var fieldsDept = [
//         { label: "Department Name :", name: "dept_name", placeholder: "Enter Department Name", mandatory: true, type: "text", name_exist: IR_OrgSlice.deptNameExist, message: IR_OrgSlice.deptNameExist ? "Department Name already exist" : "", show: true },
//         { label: "Parent Department :", name: "parent_id", placeholder: "Select Parent Department", mandatory: false, type: "select", options: parentDeptOption, value: selectedDepartmentId, key: "parent_dept_name", show: parentDeptOption?.length === 1 ? false : true },
//         { label: "Branch :", name: "br_name", placeholder: "Select Branch", mandatory: false, type: "multi-select", options: IR_OrgSlice.branchInfo, value: selectedBranch, key: "", show: IR_OrgSlice.branchInfo?.length === 1 ? false : true },
//         { label: "Department Code :", name: "dept_code", placeholder: "Enter Department Code", mandatory: false, type: "text", show: true },
//         { label: "Department Descrption:", name: "dept_descrption", placeholder: "Enter Descrption", mandatory: false, type: "textarea", show: true },
//         { label: "Status:", name: "status", placeholder: "", mandatory: false, type: "switch", value: deptValidation.values.status || "1", show: true }
//     ];
//     fieldsDept = fieldsDept.filter(field => field.show);

//     return (
//         <>
//             <React.Fragment>
//                 <div className="page-content">
//                     <MetaTags>
//                         <title>Manage Department | AuditVista</title>
//                     </MetaTags>

//                     <Breadcrumbs title="Department" breadcrumbItem="Department" />
//                     <Container fluid={true}>
//                         <Col lg={12}>
//                             <Card style={{ minHeight: "78vh" }}>
//                                 <CardBody>
//                                     {isDeptLoading ? (
//                                         <div style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
//                                             <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
//                                         </div>
//                                     ) : (
//                                         <TableContainer
//                                             columns={Deptcolumns}
//                                             data={flatDeptData}
//                                             isGlobalFilter={true}
//                                             isAddOptions={false}
//                                             isJobListGlobalFilter={false}
//                                             isPagination={true}
//                                             iscustomPageSizeOptions={false}
//                                             isShowingPageLength={false}
//                                             customPageSize={10}
//                                             tableClass="align-middle table-nowrap table-check table-striped-columns table-hover"
//                                             theadClass="table-light"
//                                             pagination="pagination pagination-rounded justify-content-end my-2"
//                                             shwoBtn={true}
//                                             id={'dept'}
//                                             handleNewBranch={() => {
//                                                 setSelectedItem(null);
//                                                 deptValidation.resetForm();
//                                                 deptValidation.setValues({});
//                                                 dispatch(seteditDeptInfo(null));
//                                                 setModalDept(true);
//                                             }}
//                                             handleReset={() => {
//                                                 dispatch(setBranchData([]));
//                                                 dispatch(retriveBranchInfo());
//                                                 dispatch(setBranchNameExist(false));
//                                                 dispatch(retriveDeptInfo());
//                                             }}
//                                             canEdit={canEdit}
//                                         />
//                                     )}
//                                 </CardBody>
//                             </Card>
//                         </Col>
//                     </Container>

//                     {modalDept && (
//                         <Modal backdrop={"static"} isOpen={modalDept} toggle={() => toggleModal('modalDept')}>
//                             <ModalHeader toggle={() => toggleModal('modalDept')} tag="h4">
//                                 {IR_OrgSlice.editDeptInfo !== null ? "Edit Department" : selectedItem && selectedItem !== null ? 'Add Sub Department' : "Add Department"}
//                             </ModalHeader>
//                             <ModalBody>
//                                 <Form onSubmit={(e) => { e.preventDefault(); deptValidation.handleSubmit() }}>
//                                     <Row>
//                                         <Col className="col-12">
//                                             {fieldsDept.map((field, index) => (
//                                                 field.show && (
//                                                     <div className="mb-3" key={index}>
//                                                         <Label className="form-label">
//                                                             {field.label}
//                                                             {field.mandatory && <span className='text-danger'>*</span>}
//                                                         </Label>
//                                                         {field.type === "multi-select" && field.options ? (
//                                                             <>
//                                                                 <Multiselect
//                                                                     options={field.options}
//                                                                     selectedValues={field.value || deptValidation.values.branch_id}
//                                                                     onSelect={handleSelect}
//                                                                     onRemove={handleRemove}
//                                                                     displayValue="br_name"
//                                                                     placeholder="Select Branch"
//                                                                     showCheckbox={true}
//                                                                     style={{ width: "100%" }}
//                                                                 />
//                                                                 {deptValidation.errors.branch_id && deptValidation.touched.branch_id && (
//                                                                     <div className="text-danger" style={{ fontSize: "smaller" }}>
//                                                                         {deptValidation.errors.branch_id}
//                                                                     </div>
//                                                                 )}
//                                                             </>
//                                                         ) : field.type === "select" && field.options ? (
//                                                             <select
//                                                                 name={'parent_id'}
//                                                                 onChange={e => { const value = e.target.value; setSelectedDepartmentId(value); deptValidation.setFieldValue('parent_id', value); }}
//                                                                 value={deptValidation.values['parent_id'] || ""}
//                                                                 className={`form-select ${deptValidation.touched['parent_id'] && deptValidation.errors['parent_id'] ? 'is-invalid' : ''}`}
//                                                             >
//                                                                 <option value="" disabled>Select</option>
//                                                                 {field.options.map((ele, idx) => (
//                                                                     <option key={idx} value={ele[field.name]}>
//                                                                         {ele[field.key]}
//                                                                     </option>
//                                                                 ))}
//                                                             </select>
//                                                         ) : field.type === "textarea" ? (
//                                                             <textarea
//                                                                 name={field.name}
//                                                                 placeholder={field.placeholder}
//                                                                 onChange={deptValidation.handleChange}
//                                                                 onBlur={deptValidation.handleBlur}
//                                                                 value={deptValidation.values[field.name] || ""}
//                                                                 className={`form-control ${deptValidation.touched[field.name] && deptValidation.errors[field.name] ? 'is-invalid' : ''}`}
//                                                             />
//                                                         ) : field.type === "switch" ? (
//                                                             <div className="form-check form-switch mt-2">
//                                                                 <Popconfirm
//                                                                     title={`Are you sure you want to ${deptValidation.values.status === "1" ? "deactivate" : "activate"} this?`}
//                                                                     onConfirm={(e) => {
//                                                                         if (IR_OrgSlice.deptStatus) {
//                                                                             deptValidation.setFieldValue("status", status);
//                                                                         } else {
//                                                                             Swal.fire({ icon: 'error', title: 'Action Not Allowed', text: 'You cannot change the status due to inactive child departments.' });
//                                                                         }
//                                                                     }}
//                                                                     okText="Yes"
//                                                                     cancelText="No"
//                                                                 >
//                                                                     <input className="form-check-input" type="checkbox" id="active" name="status" checked={field.value === "1"} onChange={(e) => { const val = e.target.checked ? "1" : "0"; setStatus(val); handleChangeStatus(val) }} />
//                                                                 </Popconfirm>
//                                                                 <label className="form-check-label ms-1" htmlFor="active">
//                                                                     {field.value === "1" ? "Active" : "Inactive"}
//                                                                 </label>
//                                                             </div>
//                                                         ) : (
//                                                             <Input
//                                                                 name={field.name}
//                                                                 type={field.type}
//                                                                 placeholder={field.placeholder}
//                                                                 onChange={field.name === "dept_name" ? handleDepartmentNameChange : deptValidation.handleChange}
//                                                                 onBlur={deptValidation.handleBlur}
//                                                                 value={deptValidation.values[field.name] || ""}
//                                                                 invalid={deptValidation.touched[field.name] && deptValidation.errors[field.name] ? true : false}
//                                                             />
//                                                         )}

//                                                         {deptValidation.touched[field.name] && deptValidation.errors[field.name] && (
//                                                             <FormFeedback type="invalid">{deptValidation.errors[field.name]}</FormFeedback>
//                                                         )}

//                                                         {field.name_exist && <div className='text-danger' style={{ fontSize: 'smaller' }}>{field.message}</div>}
//                                                     </div>
//                                                 )
//                                             ))}
//                                         </Col>
//                                     </Row>
//                                     <Row>
//                                         <Col>
//                                             <div className="text-end">
//                                                 <button
//                                                     className="btn btn-sm w-md btn-outline-success">
//                                                     {IR_OrgSlice.editDeptInfo !== null ? "Update" : "Save"}
//                                                 </button>
//                                             </div>
//                                         </Col>
//                                     </Row>
//                                 </Form>
//                             </ModalBody>
//                         </Modal>
//                     )}

//                 </div>
//             </React.Fragment>
//         </>
//     );
// }

// export default ManageDepartment;














// import React, { useEffect, useMemo, useState } from 'react'
// import Breadcrumbs from '../../../components/Common/Breadcrumb'
// import { Link } from 'react-router-dom';
// import { Card, CardBody, Col, Container, Row, Label, Modal, ModalHeader, ModalBody, Input, FormFeedback, Form } from "reactstrap";
// import TableContainer from './Components/TableContainer';
// import { useDispatch, useSelector } from 'react-redux';
// import { retriveBranchInfo, IRTvalidateDupName, setBranchNameExist, setDepartmentExist, seteditDeptInfo, setBranchData, retriveDeptInfo, createDeptInfo, deleteDeptInfo, setDesignationExist, setDeptStatus, setFlatDeptData } from '../../../toolkitStore/Auditvista/orgSlice';
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import Swal from 'sweetalert2';
// import store from '../../../store';
// import { MetaTags } from 'react-meta-tags';
// import { Multiselect } from 'multiselect-react-dropdown';
// import { Popconfirm } from 'antd';
// import { usePermissions } from 'hooks/usePermisson';



// const ManageDepartment = () => {
//     const dispatch = useDispatch();
//     const IR_OrgSlice = useSelector(state => state.orgSlice);


//     const [authUser, setAuthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")));
//     const [clientInfo, setClientInfo] = useState(JSON.parse(sessionStorage.getItem("client_info")))[0];
//     const [modalDept, setModalDept] = useState(false);
//     const [modalDegn, setModalDegn] = useState(false);
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
//     const [selectedBranch, setSelectedBranch] = useState([]);
//     const [status, setStatus] = useState(null)
//     const { canEdit } = usePermissions("department");




//     const flatDeptData = IR_OrgSlice.flatDeptData
//     var parentDeptOption = IR_OrgSlice.departmentInfo?.map(dept => ({ parent_id: dept._id, parent_dept_name: dept.dept_name }));



//     useEffect(() => {
//         dispatch(retriveDeptInfo());
//     }, [])

//     useEffect(() => {
//         if (IR_OrgSlice.departmentInfo && IR_OrgSlice.departmentInfo.length === 1) {
//             setSelectedDepartmentId(IR_OrgSlice.departmentInfo[0]._id)
//         }
//     }, [IR_OrgSlice.departmentInfo])
//     useEffect(() => {
//         if (IR_OrgSlice.branchInfo && IR_OrgSlice.branchInfo.length === 1) {
//             setSelectedBranch(IR_OrgSlice.branchInfo);
//         }
//     }, [IR_OrgSlice.branchInfo]);


//     useEffect(() => {
//         var flatDeptData = flattenDeptTree(IR_OrgSlice.departMentData);
//         dispatch(setFlatDeptData(flatDeptData))
//     }, [IR_OrgSlice.departMentData]);




//     const ensureAllFields = (values) => ({
//         dept_name: "",
//         dept_code: "",
//         dept_descrption: "",
//         branch_id: [],
//         parent_id: "",
//         status: "1",
//         ...values,
//     });

//     const deptValidation = useFormik({
//         initialValues: {
//             dept_name: "",
//             dept_code: "",
//             dept_descrption: '',
//             branch_id: [],
//             parent_id: '',
//             status: "1",
//         },
//         validationSchema: Yup.object({
//             dept_name: Yup.string()
//                 .required("Department Name is required")
//                 .test(async function (value) {
//                     return !(
//                         await dispatch(
//                             IRTvalidateDupName(
//                                 store.getState().orgSlice.editDeptInfo,
//                                 "cln_adt_departs",
//                                 "dept_name",
//                                 value,
//                                 setDepartmentExist
//                             )
//                         )
//                     );
//                 })
//                 .matches(/\S+/, "Department Name cannot be just spaces")
//                 .min(
//                     clientInfo.incd_rpt_validation.name_min,
//                     `Department Name must be at least ${clientInfo.incd_rpt_validation.name_min} characters`
//                 ),
//             dept_descrption: Yup.string()
//                 .nullable()
//                 .notRequired()
//                 .test(
//                     "description-validation",
//                     "Description must be at least 10 characters and cannot be just spaces",
//                     function (value) {
//                         if (!value) return true;
//                         const trimmedValue = value.trim();
//                         return trimmedValue.length >= clientInfo.incd_rpt_validation.desc_min;
//                     }
//                 ),
//             branch_id: Yup.array()
//                 .min(1, "At least one branch must be selected")
//                 .of(
//                     Yup.object().shape({
//                         _id: Yup.string().required("Branch ID is required"),
//                         br_name: Yup.string().required("Branch name is required"),
//                     })
//                 ),
//         }),
//         onSubmit: (values) => {
//             const fullValues = ensureAllFields(values);

//             fullValues["created_by"] = IR_OrgSlice?.editDeptInfo !== null ? selectedItem.created_by : authUser.user_data._id;
//             if (IR_OrgSlice.editDeptInfo !== null) {
//                 fullValues["_id"] = IR_OrgSlice.editDeptInfo._id;
//                 fullValues["modified_by"] = authUser.user_data._id;
//             }
//             console.log(selectedDepartmentId, IR_OrgSlice?.editDeptInfo, selectedItem);
//             fullValues["parent_id"] = IR_OrgSlice?.editDeptInfo !== null ? selectedItem.parent_id : selectedItem ? selectedItem._id : IR_OrgSlice?.departmentInfo?.find(d => d._id === selectedDepartmentId)?._id;
//             fullValues["branch_id"] = selectedBranch.map(branch => ({ _id: branch._id, br_name: branch.br_name }));
//             delete fullValues?.children;

//             console.log("Submitted values :>> ", selectedItem, fullValues);

//             if (!IR_OrgSlice.deptNameExist) {
//                 dispatch(createDeptInfo(fullValues));
//                 setModalDept(false);
//             }
//         },
//     });

//     const Deptcolumns = useMemo(() => {
//         const columns = [
//             {
//                 accessor: "dept_name",
//                 Header: "Department Name",
//                 filterable: true,
//                 width: "45%",
//                 Cell: ({ row }) => {
//                     const item = row.original;
//                     const isParent = (item.children && item.children.length > 0) || item.level === 0;
//                     return (
//                         <div className="d-flex flex-column">
//                             <div className="font-size-13 fw-bold text-buttonPrimaryE">{item.dept_name}</div>
//                             <div className="font-size-11 text-secondary">Code - {item.dept_code}</div>
//                         </div>
//                     );
//                 },
//             },
//             {
//                 accessor: "dummy",
//                 Header: "Parent",
//                 filterable: true,
//                 width: "10%",
//                 Cell: ({ row }) => (
//                     <div className="font-size-11">{"Parent"}</div>
//                 )
//             },
//             {
//                 accessor: "fullname",
//                 Header: "Created By",
//                 filterable: true,
//                 width: "10%",
//                 Cell: ({ row }) => {
//                     const item = row.original;
//                     return (
//                         <div className="font-size-11">
//                             {item.fullname || "-"}
//                         </div>
//                     );
//                 },
//             },
//             {
//                 accessor: "status",
//                 Header: "Status",
//                 filterable: true,
//                 width: "10%",
//                 Cell: ({ row }) => {
//                     const item = row.original;
//                     const isActive = item.status === "1";
//                     return (
//                         <span className={`badge ${isActive ? "badge-soft-success" : "badge-soft-danger"}`} style={{ fontSize: "11px" }}>
//                             {isActive ? "Active" : "Inactive"}
//                         </span>
//                     );
//                 },
//             },
//         ];

//         if (canEdit) {
//             columns.push({
//                 accessor: "Action",
//                 Header: "Action",
//                 width: "10%",
//                 Cell: ({ row }) => {
//                     const item = row.original;
//                     return (
//                         <ul className="list-unstyled hstack gap-1 mb-0 font-size-11">
//                             <li>
//                                 <Link
//                                     to="#"
//                                     className="btn btn-sm btn-soft-secondary d-flex align-items-center"
//                                     onClick={() => {
//                                         console.log(item);
//                                         setSelectedItem(item);
//                                         deptValidation.resetForm();
//                                         deptValidation.setValues({});
//                                         dispatch(seteditDeptInfo(null));
//                                         setModalDept(true);
//                                     }}
//                                     id={`addsubmenu-tooltip-${item._id}`}
//                                 >
//                                     <i className="bx bx-plus me-2" /> Add Sub Department
//                                 </Link>
//                             </li>

//                             <li>
//                                 <Link
//                                     to="#"
//                                     className="btn btn-sm btn-soft-primary d-flex align-items-center"
//                                     onClick={() => onEditDepartment(item)}
//                                     id={`edittooltip-${item._id}`}
//                                 >
//                                     <i className="bx bx-edit-alt me-2" /> Edit
//                                 </Link>
//                             </li>
//                         </ul>
//                     );
//                 },
//             });
//         }

//         return columns;
//     }, [flatDeptData, canEdit]);




//     function flattenDeptTree(data) {
//         const map = {};
//         const roots = [];

//         data.forEach(item => {
//             map[item._id] = { ...item, children: [] };
//         });

//         data.forEach(item => {
//             if (item.parent_id && map[item.parent_id]) {
//                 map[item.parent_id].children.push(map[item._id]);
//             } else {
//                 roots.push(map[item._id]);
//             }
//         });

//         const result = [];
//         const traverse = (node, level = 0) => {
//             if (node.children && node.children.length > 0) {
//                 node.children.forEach(child => traverse(child, level + 1));
//             }
//             result.push({ ...node, level });
//         };

//         roots.forEach(root => traverse(root));
//         return result;
//     }



//     const toggleModal = (open) => {
//         if (open === 'modalDept') {
//             dispatch(setDepartmentExist(false));
//             setModalDept(!modalDept);

//         } else {
//             dispatch(setDesignationExist(false));
//             setModalDegn(!modalDegn);
//         }
//     }



//     const onClickDelete = (item, mode) => {
//         Swal.fire({
//             icon: 'question',
//             title: 'Are you sure?',
//             text: `Do you want to delete this Department ?`,
//             showCancelButton: true,
//             confirmButtonColor: '#2ba92b',
//             confirmButtonText: 'Yes',
//             cancelButtonColor: '#d33',
//             cancelButtonText: 'No'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 dispatch(deleteDeptInfo(item))
//             }
//         })
//     }



//     const onEditDepartment = (item) => {
//         setSelectedItem(item);
//         setSelectedBranch(item.branch_id);
//         dispatch(seteditDeptInfo(item));
//         deptValidation.setValues(item);
//         setModalDept(true);
//     };



//     const handleChangeStatus = (value) => {
//         let status;
//         const getParent = (item) => {
//             return flatDeptData.find(dept => dept._id === item.parent_id);
//         };
//         if (value === '0') {
//             const isLeaf = !selectedItem?.children || selectedItem?.children.length === 0 || selectedItem?.status === null;
//             if (isLeaf) {
//                 status = true;
//             } else {
//                 const hasInactiveChild = selectedItem.children.some(child => child.status === '0');
//                 console.log('hasInactiveChild :>> ', hasInactiveChild);
//                 status = hasInactiveChild;
//             }
//             console.log("Deactivating - allowed?", status);
//             dispatch(setDeptStatus(status));
//         } else {
//             const parent = getParent(selectedItem);
//             if (parent && parent.status !== '1') {
//                 status = false;
//             } else {
//                 status = true;
//             }
//             console.log("Activating - allowed?", status);
//             dispatch(setDeptStatus(status));
//         }
//     };





//     const handleSelect = (selectedList) => {
//         deptValidation.setFieldValue("branch_id", selectedList);
//         if (selectedList.length > 0) {
//             deptValidation.setFieldTouched("branch_id", false); // Remove the error when an option is selected
//         }
//         setSelectedBranch(selectedList)
//     };

//     const handleRemove = (selectedList) => {
//         deptValidation.setFieldValue("branch_id", selectedList);
//         if (selectedList.length === 0) {
//             deptValidation.setFieldTouched("branch_id", true, false); // Re-trigger error if empty
//         }
//         setSelectedBranch(selectedList)
//     };


//     var fieldsDept = [
//         { label: "Department Name :", name: "dept_name", placeholder: "Enter Department Name", mandatory: true, type: "text", name_exist: IR_OrgSlice.deptNameExist, message: IR_OrgSlice.deptNameExist ? "Department Name already exist" : "", show: true },
//         { label: "Parent Department :", name: "parent_id", placeholder: "Select Parent Department", mandatory: false, type: "select", options: parentDeptOption, value: selectedDepartmentId, key: "parent_dept_name", show: parentDeptOption?.length === 1 ? false : true },
//         { label: "Branch :", name: "br_name", placeholder: "Select Branch", mandatory: false, type: "multi-select", options: IR_OrgSlice.branchInfo, value: selectedBranch, key: "", show: IR_OrgSlice.branchInfo?.length === 1 ? false : true },
//         { label: "Department Code :", name: "dept_code", placeholder: "Enter Department Code", mandatory: false, type: "text", show: true },
//         { label: "Department Descrption:", name: "dept_descrption", placeholder: "Enter Descrption", mandatory: false, type: "textarea", show: true },
//         { label: "Status:", name: "status", placeholder: "", mandatory: false, type: "switch", value: deptValidation.values.status || "1", show: true }
//     ];
//     fieldsDept = fieldsDept.filter(field => field.show);



//     return (
//         <>
//             <React.Fragment>
//                 <div className="page-content">
//                     <MetaTags>
//                         <title>Manage Department | AuditVista</title>
//                     </MetaTags>


//                     <Breadcrumbs title="Department" breadcrumbItem="Department" />
//                     <Container fluid={true}>
//                         <Col lg={12}>
//                             <Card style={{ minHeight: "78vh" }}>
//                                 <CardBody>
//                                     {
//                                         <TableContainer
//                                             columns={Deptcolumns}
//                                             data={flatDeptData}
//                                             isGlobalFilter={true}
//                                             isAddOptions={false}
//                                             isJobListGlobalFilter={false}
//                                             isPagination={true}
//                                             iscustomPageSizeOptions={false}
//                                             isShowingPageLength={false}
//                                             customPageSize={10}
//                                             tableClass="align-middle table-nowrap table-check table-striped-columns table-hover"
//                                             theadClass="table-light"
//                                             pagination="pagination pagination-rounded justify-content-end my-2"
//                                             shwoBtn={true}
//                                             id={'dept'}
//                                             handleNewBranch={() => { setSelectedItem(null); deptValidation.resetForm(); deptValidation.setValues({}); dispatch(seteditDeptInfo(null)); setModalDept(true); }}
//                                             handleReset={() => { dispatch(setBranchData([])); dispatch(retriveBranchInfo()); dispatch(setBranchNameExist(false)) }}
//                                             canEdit={canEdit}
//                                         />
//                                     }

//                                 </CardBody>
//                             </Card>
//                         </Col>
//                     </Container>


//                     {modalDept && (
//                         <Modal backdrop={"static"} isOpen={modalDept} toggle={() => toggleModal('modalDept')}>
//                             <ModalHeader toggle={() => toggleModal('modalDept')} tag="h4">
//                                 {IR_OrgSlice.editDeptInfo !== null ? "Edit Department" : selectedItem && selectedItem !== null ? 'Add Sub Department' : "Add Department"}
//                             </ModalHeader>
//                             <ModalBody>
//                                 <Form onSubmit={(e) => { e.preventDefault(); deptValidation.handleSubmit() }}>
//                                     <Row>
//                                         <Col className="col-12">
//                                             {fieldsDept.map((field, index) => (
//                                                 field.show && (
//                                                     <div className="mb-3" key={index}>
//                                                         <Label className="form-label">
//                                                             {field.label}
//                                                             {field.mandatory && <span className='text-danger'>*</span>}
//                                                         </Label>
//                                                         {field.type === "multi-select" && field.options ? (
//                                                             <>
//                                                                 <Multiselect
//                                                                     options={field.options}
//                                                                     selectedValues={field.value || deptValidation.values.branch_id}
//                                                                     onSelect={handleSelect}
//                                                                     onRemove={handleRemove}
//                                                                     displayValue="br_name"
//                                                                     placeholder="Select Branch"
//                                                                     showCheckbox={true}
//                                                                     style={{ width: "100%" }}
//                                                                 />
//                                                                 {deptValidation.errors.branch_id && deptValidation.touched.branch_id && (
//                                                                     <div className="text-danger" style={{ fontSize: "smaller" }}>
//                                                                         {deptValidation.errors.branch_id}
//                                                                     </div>
//                                                                 )}
//                                                             </>
//                                                         ) : field.type === "select" && field.options ? (
//                                                             <select
//                                                                 name={'parent_id'}
//                                                                 onChange={e => { const value = e.target.value; setSelectedDepartmentId(value); deptValidation.setFieldValue('parent_id', value); }}
//                                                                 value={deptValidation.values['parent_id'] || ""}
//                                                                 className={`form-select ${deptValidation.touched['parent_id'] && deptValidation.errors['parent_id'] ? 'is-invalid' : ''}`}
//                                                             >
//                                                                 <option value="" disabled>Select</option>
//                                                                 {field.options.map((ele, idx) => (
//                                                                     <option key={idx} value={ele[field.name]}>
//                                                                         {ele[field.key]}
//                                                                     </option>
//                                                                 ))}
//                                                             </select>

//                                                         ) : field.type === "textarea" ? (
//                                                             <textarea
//                                                                 name={field.name}
//                                                                 placeholder={field.placeholder}
//                                                                 onChange={deptValidation.handleChange}
//                                                                 onBlur={deptValidation.handleBlur}
//                                                                 value={deptValidation.values[field.name] || ""}
//                                                                 className={`form-control ${deptValidation.touched[field.name] && deptValidation.errors[field.name] ? 'is-invalid' : ''}`}
//                                                             />
//                                                         ) :
//                                                             field.type === "switch" ? (

//                                                                 <div className="form-check form-switch mt-2">
//                                                                     <Popconfirm
//                                                                         title={`Are you sure you want to ${deptValidation.values.status === "1" ? "deactivate" : "activate"} this?`}
//                                                                         onConfirm={(e) => {
//                                                                             if (IR_OrgSlice.deptStatus) {
//                                                                                 deptValidation.setFieldValue("status", status);
//                                                                             } else {
//                                                                                 Swal.fire({ icon: 'error', title: 'Action Not Allowed', text: 'You cannot change the status due to inactive child departments.' });
//                                                                             }
//                                                                         }}

//                                                                         okText="Yes"
//                                                                         cancelText="No"
//                                                                     >
//                                                                         <input className="form-check-input" type="checkbox" id="active" name="status" checked={field.value === "1"} onChange={(e) => { const val = e.target.checked ? "1" : "0"; setStatus(val); handleChangeStatus(val) }} />
//                                                                     </Popconfirm>

//                                                                     <label className="form-check-label ms-1" htmlFor="active">
//                                                                         {field.value === "1" ? "Active" : "Inactive"}
//                                                                     </label>
//                                                                 </div>
//                                                             ) :
//                                                                 (
//                                                                     <Input
//                                                                         name={field.name}
//                                                                         type={field.type}
//                                                                         placeholder={field.placeholder}
//                                                                         onChange={deptValidation.handleChange}
//                                                                         onBlur={deptValidation.handleBlur}
//                                                                         value={deptValidation.values[field.name] || ""}
//                                                                         invalid={deptValidation.touched[field.name] && deptValidation.errors[field.name] ? true : false}
//                                                                     />
//                                                                 )}

//                                                         {deptValidation.touched[field.name] && deptValidation.errors[field.name] && (
//                                                             <FormFeedback type="invalid">{deptValidation.errors[field.name]}</FormFeedback>
//                                                         )}

//                                                         {field.name_exist && <div className='text-danger' style={{ fontSize: 'smaller' }}>{field.message}</div>}
//                                                     </div>
//                                                 )
//                                             ))}

//                                         </Col>
//                                     </Row>
//                                     <Row>
//                                         <Col>
//                                             <div className="text-end">
//                                                 <button
//                                                     className="btn btn-sm w-md btn-outline-success">
//                                                     {IR_OrgSlice.editDeptInfo !== null ? "Update" : "Save"}
//                                                 </button>
//                                             </div>
//                                         </Col>
//                                     </Row>
//                                 </Form>
//                             </ModalBody>
//                         </Modal>
//                     )}

//                 </div>
//             </React.Fragment>
//         </>
//     );

// }

// export default ManageDepartment;