import React, { useEffect, useMemo, useState } from 'react'
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row, UncontrolledTooltip,Spinner, Label, Modal, ModalHeader, ModalBody, Input, FormFeedback, Form } from "reactstrap";
import TableContainer from './Components/TableContainer';
import { useDispatch, useSelector } from 'react-redux';
import { retriveBranchInfo, IRTvalidateDupName, setBranchNameExist, setDepartmentExist, createDesignation, retriveDesignationInfo, setEditDesignationInfo, deleteDegnInfo, setDesignationExist } from '../../../toolkitStore/Auditvista/orgSlice';
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from 'sweetalert2';
import store from '../../../store';
import { MetaTags } from 'react-meta-tags';
import { usePermissions } from 'hooks/usePermisson';
import { useDesignationValidation } from '../../../utils/useDesignationValidation'; 

const ManageDesignation = () => {
    const dispatch = useDispatch();

    const { debouncedDesignationValidation } = useDesignationValidation(100);


    const [modalDept, setModalDept] = useState(false);
    const [modalDegn, setModalDegn] = useState(false);
    const IR_OrgSlice = useSelector(state => state.orgSlice);
    const [authUser, setAuthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")));
    const [clientInfo, setClientInfo] = useState(JSON.parse(sessionStorage.getItem("client_info")))[0];
    const { canEdit } = usePermissions("designation");
    const isDesgLoading = IR_OrgSlice.designationLoading


    useEffect(() => {
        dispatch(retriveDesignationInfo());
    }, [])

    const degnValidation = useFormik({
        initialValues: {
            desgn_name: "",
            desgn_descrption: '',
        },
        validationSchema: Yup.object({
            desgn_name: Yup.string()
                .required("Designation Name is required")
                .matches(/\S+/, "Designation Name cannot be just spaces")
                .min(clientInfo.incd_rpt_validation.name_min, `Designation Name must be at least ${clientInfo.incd_rpt_validation.name_min} characters`),
            desgn_descrption: Yup.string()
                .nullable()
                .notRequired()
                .test(
                    'description-validation',
                    'Description must be at least 10 characters and cannot be just spaces',
                    function (value) {
                        if (!value) return true;
                        const trimmedValue = value.trim();
                        return trimmedValue.length >= clientInfo.incd_rpt_validation.desc_min;
                    }
                )
        }),
        onSubmit: async (values) => {
            try {
                // Validate designation name before submitting
                if (values.desgn_name) {
                    await dispatch(IRTvalidateDupName(
                        store.getState().orgSlice.editDesignationInfo,
                        "cln_adt_desgns",
                        "desgn_name",
                        values.desgn_name,
                        setDesignationExist
                    ));
                }

                // Check if there are validation errors from the API
                if (IR_OrgSlice.degnNameExist) {
                    return;
                }

                values["created_by"] = authUser.user_data._id;
                if (IR_OrgSlice.editDesignationInfo !== null) {
                    values["_id"] = IR_OrgSlice.editDesignationInfo._id;
                }
                setTimeout(() => {
                      if (IR_OrgSlice.degnNameExist === false) {
                    console.log('values :>> ', values, IR_OrgSlice.degnNameExist);
                    // dispatch(createDesignation(values));
                    // setModalDegn(false);
                }
                }, 500);

              
            } catch (error) {
                console.log('Error in form submission:', error);
            }
        },
    });

    // Custom handler for designation name change
    // const handleDesignationNameChange = (e) => {
    //     const value = e.target.value;
    //     dispatch(setDesignationExist(false)); // Reset the error state
    //     debouncedDesignationValidation(value); // Trigger debounced validation
    //      degnValidation.setFieldValue("desgn_name", value);
    // };

    const handleDesignationNameChange = (e) => {
        const value = e.target.value;

        dispatch(setDesignationExist(false)); // Reset duplicate flag
        degnValidation.setFieldValue("desgn_name", value); // Update Formik
        debouncedDesignationValidation(value); // Trigger debounce
    };


    const onClickDelete = (item, mode) => {
        Swal.fire({
            icon: 'question',
            title: 'Are you sure?',
            text: `Do you want to delete this Designation ?`,
            showCancelButton: true,
            confirmButtonColor: '#2ba92b',
            confirmButtonText: 'Yes',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteDegnInfo(item))
            }
        })
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

    const DegnColumn = useMemo(
        () => {
            const columns = [
                {
                    accessor: "desgn_name",
                    Header: "Designation Name",
                    filterable: true,
                    width: "90%",
                    Cell: (cellProps) => {
                        var item = cellProps.row.original;
                        return (
                            <div className={`font-size-13 fw-bold text-buttonPrimaryE `} >
                                {item.desgn_name}
                            </div>
                        )
                    }
                },
                {
                    accessor: "fullname",
                    Header: "Created By",
                    filterable: true,
                    width: "10%",
                    Cell: ({ row }) => {
                        const name = row.original.createdByName || 'Unknown';

                        return (
                            <div className="font-size-11" >
                                {name}
                            </div>
                        );
                    }
                },
            ];
            if (canEdit) {
                columns.push({
                    accessor: "Action",
                    Header: "Action",
                    width: "10%",
                    Cell: (cellProps) => {
                        var item = cellProps.row.original;
                        return (
                            <ul className="list-unstyled hstack gap-1 mb-0 font-size-11">
                                <li>
                                    <Link to="#" className="btn btn-sm btn-soft-primary d-flex align-items-center" onClick={() => { dispatch(setEditDesignationInfo(item)); setModalDegn(true); degnValidation.setValues(item) }} id={`edittooltip-${cellProps.row.original.id}`}>
                                        <i className="bx bx-edit-alt me-2" /> Edit
                                    </Link>
                                </li>

                                <li>
                                    <Link to="#" className="btn btn-sm btn-soft-danger" onClick={() => { onClickDelete(item, "1") }} id={`deletetooltip-${cellProps.row.original.id}`}>
                                        <i className="bx bx-trash" />
                                        <UncontrolledTooltip placement="top" target={`deletetooltip-${cellProps.row.original.id}`}>
                                            Delete
                                        </UncontrolledTooltip>
                                    </Link>
                                </li>
                            </ul>
                        )
                    }
                })
            }

            return columns;
        }, []
    )

    const fieldsDesignation = [
        { label: "Designation Name :", name: "desgn_name", placeholder: "Enter Designation Name", mandatory: true, type: "text", name_exist: IR_OrgSlice.degnNameExist, message: IR_OrgSlice.degnNameExist ? "Designation Name already exist" : "" },
        { label: "Designation Description :", name: "desgn_descrption", placeholder: "Enter Designation Description", mandatory: false, type: "textarea" },
    ];

    return (
        <>
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Manage Designation | AuditVista</title>
                    </MetaTags>
                    {console.log('IR_OrgSlice.degnNameExist :>> ', IR_OrgSlice.degnNameExist)}

                    <Breadcrumbs title="Designation" breadcrumbItem="Designation" />
                   <Container fluid={true}>
                        <Row>
                            <Col lg={12}>
                                <Card style={{ minHeight: "78vh" }}>
                                    <CardBody>
                                        {isDesgLoading ? (
                                            <div style={{
                                                minHeight: "60vh",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                                <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
                                            </div>
                                        ) : (
                                            <TableContainer
                                                columns={DegnColumn}
                                                data={IR_OrgSlice.designationData}
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
                                                id={'desgn'}
                                                handleNewBranch={() => {
                                                    degnValidation.resetForm();
                                                    degnValidation.setValues({});
                                                    dispatch(setEditDesignationInfo(null));
                                                    setModalDegn(true);
                                                }}
                                                handleReset={() => {
                                                    dispatch(retriveDesignationInfo());
                                                }}
                                                canEdit={canEdit}
                                            />
                                        )}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>

                    {modalDegn && (
                        <Modal backdrop={"static"} isOpen={modalDegn} toggle={() => toggleModal('modalDegn')}>
                            <ModalHeader toggle={() => toggleModal('modalDegn')} tag="h4">
                                {IR_OrgSlice.editDesignationInfo !== null ? "Edit Designation" : "Add Designation"}
                            </ModalHeader>
                            <ModalBody>
                                {/* <Form onSubmit={(e) => { e.preventDefault(); degnValidation.handleSubmit() }} > */}
                                 <Form onSubmit={async (e) => {
                                    e.preventDefault(); const errors = await degnValidation.validateForm();
                                    degnValidation.setTouched({ desgn_name: true, });
                                    if (Object.keys(errors).length === 0) {
                                        degnValidation.handleSubmit();
                                    }
                                }} >
                                    <Row>
                                        <Col className="col-12">
                                            {fieldsDesignation.map((field, index) => (
                                                <div className="mb-3" key={index}>
                                                    <Label className="form-label">{field.label}
                                                        {field.mandatory && <span className='text-danger'>*</span>}
                                                    </Label>
                                                    {field.countryCode ? (
                                                        <div className="d-flex">
                                                            <Input
                                                                type="select"
                                                                name="branch_ccode"
                                                                onChange={degnValidation.handleChange}
                                                                onBlur={degnValidation.handleBlur}
                                                                value={degnValidation.values.branch_ccode || "+91"}
                                                                className="me-2"
                                                            >
                                                                {field.country_list.map((ele, idx) => (
                                                                    <option key={idx} value={ele.code}>{ele.code}</option>
                                                                ))}
                                                            </Input>

                                                            <Input
                                                                name={field.name}
                                                                type={field.type}
                                                                placeholder={field.placeholder}
                                                                onChange={field.name === "desgn_name" ? handleDesignationNameChange : degnValidation.handleChange}
                                                                onBlur={degnValidation.handleBlur}
                                                                value={degnValidation.values[field.name] || ""}
                                                                invalid={degnValidation.touched[field.name] && degnValidation.errors[field.name] ? true : false}
                                                            />
                                                        </div>
                                                    ) : field.type === "select" && field.options ? (
                                                        <select
                                                            type="select"
                                                            name={field.name}
                                                            onChange={degnValidation.handleChange}
                                                            onBlur={degnValidation.handleBlur}
                                                            value={degnValidation.values[field.name] || ""}
                                                            className={`form-select ${degnValidation.touched[field.name] && degnValidation.errors[field.name] ? 'is-invalid' : ''}`}
                                                        >
                                                            <option value="" disabled>Select</option>
                                                            {field.options.map((ele, idx) => (
                                                                <option key={idx} value={ele[field.value]}>{ele[field.key]}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <Input
                                                            name={field.name}
                                                            type={field.type}
                                                            placeholder={field.placeholder}
                                                            onChange={field.name === "desgn_name" ? handleDesignationNameChange : degnValidation.handleChange}
                                                            onBlur={degnValidation.handleBlur}
                                                            value={degnValidation.values[field.name] || ""}
                                                            invalid={degnValidation.touched[field.name] && degnValidation.errors[field.name] ? true : false}
                                                        />
                                                    )}

                                                    {degnValidation.touched[field.name] && degnValidation.errors[field.name] ? (
                                                        <FormFeedback type="invalid">{degnValidation.errors[field.name]}</FormFeedback>
                                                    ) : null}

                                                    {field.name_exist &&
                                                        <div className='text-danger' style={{ fontSize: 'smaller' }}>
                                                            {field.message}
                                                        </div>
                                                    }
                                                </div>
                                            ))}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="text-end">
                                                <button  className="btn btn-sm w-md btn-outline-success"> {IR_OrgSlice.editDesignationInfo !== null ? "Update" : "Save"}</button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </ModalBody>
                        </Modal>
                    )}
                </div>
            </React.Fragment>
        </>
    );
}

export default ManageDesignation;














// import React, { useEffect, useMemo, useState } from 'react'
// import Breadcrumbs from '../../../components/Common/Breadcrumb'
// import { Link } from 'react-router-dom';
// import { Card, CardBody, Col, Container, Row, UncontrolledTooltip, Label, Modal, ModalHeader, ModalBody, Input, FormFeedback, Form } from "reactstrap";
// import TableContainer from './Components/TableContainer';
// import { useDispatch, useSelector } from 'react-redux';
// import { retriveBranchInfo, IRTvalidateDupName, setBranchNameExist, setDepartmentExist, createDesignation, retriveDesignationInfo, setEditDesignationInfo, deleteDegnInfo, setDesignationExist } from '../../../toolkitStore/Auditvista/orgSlice';
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import Swal from 'sweetalert2';
// import store from '../../../store';
// import { MetaTags } from 'react-meta-tags';
// import { usePermissions } from 'hooks/usePermisson';





// const ManageDesignation = () => {
//     const dispatch = useDispatch();


//     const [modalDept, setModalDept] = useState(false);
//     const [modalDegn, setModalDegn] = useState(false);
//     const IR_OrgSlice = useSelector(state => state.orgSlice);
//     const [authUser, setAuthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")));
//     const [clientInfo, setClientInfo] = useState(JSON.parse(sessionStorage.getItem("client_info")))[0];
//     const { canEdit } = usePermissions("designation");




//     useEffect(() => {
//         dispatch(retriveDesignationInfo());
//     }, [])


//     const degnValidation = useFormik({
//         initialValues: {
//             desgn_name: "",
//             desgn_descrption: '',

//         },
//         validationSchema: Yup.object({
//             desgn_name: Yup.string().required("Designation Name is required")

//                 .test(async function (value) {
//                     return !(await dispatch(IRTvalidateDupName(store.getState().orgSlice.editDesignationInfo, "cln_adt_desgn_lists", "desgn_name", value, setDesignationExist)));
//                 })
//                 .matches(/\S+/, "Designation Name cannot be just spaces")
//                 .min(clientInfo.incd_rpt_validation.name_min, `Designation Name must be at least ${clientInfo.incd_rpt_validation.name_min} characters`),
//             desgn_descrption: Yup.string().nullable().notRequired()
//                 .test(
//                     'description-validation',
//                     'Description must be at least 10 characters and cannot be just spaces',
//                     function (value) {
//                         if (!value) return true;
//                         const trimmedValue = value.trim();
//                         return trimmedValue.length >= clientInfo.incd_rpt_validation.desc_min;
//                     }
//                 )
//         }),
//         onSubmit: (values) => {
//             values["created_by"] = authUser.user_data._id
//             if (IR_OrgSlice.editDesignationInfo !== null) {
//                 values["_id"] = IR_OrgSlice.editDesignationInfo._id
//             }
//             if (IR_OrgSlice.degnNameExist === false) {
//                 dispatch(createDesignation(values))
//                 setModalDegn(false)
//             }

//         },
//     });




//     const onClickDelete = (item, mode) => {
//         Swal.fire({
//             icon: 'question',
//             title: 'Are you sure?',
//             text: `Do you want to delete this Designation ?`,
//             showCancelButton: true,
//             confirmButtonColor: '#2ba92b',
//             confirmButtonText: 'Yes',
//             cancelButtonColor: '#d33',
//             cancelButtonText: 'No'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 dispatch(deleteDegnInfo(item))
//             }
//         })
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



//     const DegnColumn = useMemo(
//         () => {
//             const columns = [
//                 {
//                     accessor: "desgn_name",
//                     Header: "Designation Name",
//                     filterable: true,
//                     width: "90%",
//                     Cell: (cellProps) => {
//                         var item = cellProps.row.original;
//                         return (
//                             <div className={`font-size-13 fw-bold text-buttonPrimaryE `} >
//                                 {item.desgn_name}
//                             </div>
//                         )
//                     }
//                 },
//                 {
//                     accessor: "fullname",
//                     Header: "Created By",
//                     filterable: true,
//                     width: "10%",
//                     Cell: ({ row }) => {
//                         const item = row.original;
//                         return (
//                             <div className="font-size-11" >
//                                 {item.fullname || "-"}
//                             </div>
//                         );
//                     }
//                 },
//             ];
//             if (canEdit) {
//                 columns.push({
//                     accessor: "Action",
//                     Header: "Action",
//                     width: "10%",
//                     Cell: (cellProps) => {
//                         var item = cellProps.row.original;
//                         return (
//                             <ul className="list-unstyled hstack gap-1 mb-0 font-size-11">
//                                 <li>
//                                     <Link to="#" className="btn btn-sm btn-soft-primary d-flex align-items-center" onClick={() => { dispatch(setEditDesignationInfo(item)); setModalDegn(true); degnValidation.setValues(item) }} id={`edittooltip-${cellProps.row.original.id}`}>
//                                         <i className="bx bx-edit-alt me-2" /> Edit
//                                     </Link>
//                                 </li>

//                                 <li>
//                                     <Link to="#" className="btn btn-sm btn-soft-danger" onClick={() => { onClickDelete(item, "1") }} id={`deletetooltip-${cellProps.row.original.id}`}>
//                                         <i className="bx bx-trash" />
//                                         <UncontrolledTooltip placement="top" target={`deletetooltip-${cellProps.row.original.id}`}>
//                                             Delete
//                                         </UncontrolledTooltip>
//                                     </Link>
//                                 </li>
//                             </ul>
//                         )
//                     }
//                 })
//             }

//             return columns;

//         }, []
//     )



//     const fieldsDesignation = [
//         { label: "Designation Name :", name: "desgn_name", placeholder: "Enter Designation Name", mandatory: true, type: "text", name_exist: IR_OrgSlice.degnNameExist, message: IR_OrgSlice.degnNameExist ? "Designation Name already exist" : "" },
//         { label: "Designation Description :", name: "desgn_descrption", placeholder: "Enter Designation Description", mandatory: false, type: "textarea" },
//     ];


//     return (
//         <>
//             <React.Fragment>
//                 <div className="page-content">
//                     <MetaTags>
//                         <title>Manage Designation | AuditVista</title>
//                     </MetaTags>


//                     <Breadcrumbs title="Designation" breadcrumbItem="Designation" />
//                     <Container fluid={true}>
//                         <Row>
//                             <Col lg={12} >
//                                 <Card style={{ minHeight: "78vh" }}>
//                                     <CardBody>
//                                         <TableContainer
//                                             columns={DegnColumn}
//                                             data={IR_OrgSlice.designationData}
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
//                                             id={'desgn'}
//                                             handleNewBranch={() => { degnValidation.resetForm(); degnValidation.setValues({}); dispatch(setEditDesignationInfo(null)); setModalDegn(true); }}
//                                             handleReset={() => { dispatch(retriveBranchInfo()); dispatch(setBranchNameExist(false)) }}
//                                             canEdit={canEdit}
//                                         />
//                                     </CardBody>
//                                 </Card>
//                             </Col>
//                         </Row>

//                     </Container>
//                     {modalDegn && (
//                         <Modal backdrop={"static"} isOpen={modalDegn} toggle={() => toggleModal('modalDegn')}>
//                             <ModalHeader toggle={() => toggleModal('modalDegn')} tag="h4">
//                                 {IR_OrgSlice.editDesignationInfo !== null ? "Edit Designation" : "Add Designation"}
//                             </ModalHeader>
//                             <ModalBody>
//                                 <Form onSubmit={(e) => { e.preventDefault(); degnValidation.handleSubmit() }} >
//                                     <Row>
//                                         <Col className="col-12">
//                                             {fieldsDesignation.map((field, index) => (
//                                                 <div className="mb-3" key={index}>
//                                                     <Label className="form-label">{field.label}
//                                                         {
//                                                             field.mandatory &&
//                                                             <span className='text-danger'>*</span>
//                                                         }

//                                                     </Label>
//                                                     {field.countryCode ? (
//                                                         <div className="d-flex">
//                                                             <Input
//                                                                 type="select"
//                                                                 name="branch_ccode"
//                                                                 onChange={degnValidation.handleChange}
//                                                                 onBlur={degnValidation.handleBlur}
//                                                                 value={degnValidation.values.branch_ccode || "+91"}
//                                                                 className="me-2"
//                                                             >
//                                                                 {field.country_list.map((ele, idx) => (
//                                                                     <option key={idx} value={ele.code}>{ele.code}</option>
//                                                                 ))}
//                                                             </Input>

//                                                             <Input
//                                                                 name={field.name}
//                                                                 type={field.type}
//                                                                 placeholder={field.placeholder}
//                                                                 onChange={degnValidation.handleChange}
//                                                                 onBlur={degnValidation.handleBlur}
//                                                                 value={degnValidation.values[field.name] || ""}
//                                                                 invalid={degnValidation.touched[field.name] && degnValidation.errors[field.name] ? true : false}
//                                                             />
//                                                         </div>
//                                                     ) : field.type === "select" && field.options ? (
//                                                         <select
//                                                             type="select"
//                                                             name={field.name}
//                                                             onChange={degnValidation.handleChange}
//                                                             onBlur={degnValidation.handleBlur}
//                                                             value={degnValidation.values[field.name] || ""}
//                                                             className={`form-select ${degnValidation.touched[field.name] && degnValidation.errors[field.name] ? 'is-invalid' : ''}`}
//                                                         >
//                                                             <option value="" disabled>Select</option>
//                                                             {field.options.map((ele, idx) => (
//                                                                 <option key={idx} value={ele[field.value]}>{ele[field.key]}</option>
//                                                             ))}
//                                                         </select>
//                                                     ) :
//                                                         (
//                                                             <Input
//                                                                 name={field.name}
//                                                                 type={field.type}
//                                                                 placeholder={field.placeholder}
//                                                                 onChange={degnValidation.handleChange}
//                                                                 onBlur={degnValidation.handleBlur}
//                                                                 value={degnValidation.values[field.name] || ""}
//                                                                 invalid={degnValidation.touched[field.name] && degnValidation.errors[field.name] ? true : false}
//                                                             />
//                                                         )}

//                                                     {degnValidation.touched[field.name] && degnValidation.errors[field.name] ? (
//                                                         <FormFeedback type="invalid">{degnValidation.errors[field.name]}</FormFeedback>
//                                                     ) : null}


//                                                     {field.name_exist &&
//                                                         <div className='text-danger' style={{ fontSize: 'smaller' }}>
//                                                             {field.message}
//                                                         </div>

//                                                     }
//                                                 </div>
//                                             ))}
//                                         </Col>
//                                     </Row>
//                                     <Row>
//                                         <Col>
//                                             <div className="text-end">
//                                                 <button
//                                                     className="btn btn-sm w-md btn-outline-success">
//                                                     {IR_OrgSlice.editDesignationInfo !== null ? "Update" : "Save"}
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

// export default ManageDesignation;
