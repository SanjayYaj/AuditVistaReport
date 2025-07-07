import urlSocket from 'helpers/urlSocket';
import React, { useEffect, useState, useMemo } from 'react'
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    UncontrolledTooltip,
    Label,
    Modal, ModalHeader, ModalBody,
    Input,
    FormFeedback,
    Form,
} from "reactstrap";
import { MetaTags } from 'react-meta-tags';
import Breadcrumbs from 'components/Common/Breadcrumb';
import TableContainer from './Components/TableContainer';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { usePermissions } from 'hooks/usePermisson';
import { useDispatch, useSelector } from 'react-redux';
import { IRTvalidateDupName, setBranchNameExist } from 'toolkitStore/Auditvista/orgSlice';



const ManageBranches = () => {

    const dispatch = useDispatch();
    const IR_OrgSlice = useSelector(state => state.orgSlice);
    const branchExist = IR_OrgSlice.branchNameExist


    const [branchList, setBranchList] = useState([])
    const [modalDept, setModalDept] = useState(false);
    const [authUser, setAuthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")));
    const [editBranchInfo, seteditBranchInfo] = useState(null);
    const { canEdit } = usePermissions("branches");

    useEffect(() => {
        retriveBranchInfo()
    }, [])

    const retriveBranchInfo = async () => {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        try {
            const responseData = await urlSocket.post("branch/retrive-branches", {
                encrypted_db_url: authUser.db_info.encrypted_db_url
            })
            if (responseData.status === 200) {
                setBranchList(responseData.data.data)
            }

        } catch (error) {
            console.log(error, 'error');
        }
    }

    const branchColumns = useMemo(() => {
        const columns = [
            {
                accessor: "br_name",
                Header: "Branch Name",
                filterable: false,
                width: "40%",
                Cell: (cellProps) => {
                    const item = cellProps.row.original;
                    return (
                        <div className="font-size-13 fw-bold text-buttonPrimaryE">
                            {item.br_name}
                        </div>
                    );
                },
            },
            {
                accessor: "br_code",
                Header: "Branch Code",
                filterable: false,
                width: "40%",
                Cell: (cellProps) => {
                    const item = cellProps.row.original;
                    return (
                        <div className="font-size-11">
                            {item.br_code ? item.br_code : "-- --"}
                        </div>
                    );
                },
            },
        ];

        if (canEdit) {
            columns.push({
                accessor: "Action",
                Header: "Action",
                width: "10%",
                Cell: (cellProps) => {
                    const item = cellProps.row.original;

                    return (
                        <ul className="list-unstyled hstack gap-1 mb-0 font-size-11">
                            <li>
                                <Link
                                    to="#"
                                    className="btn btn-sm btn-soft-primary d-flex align-items-center"
                                    onClick={() => {
                                        seteditBranchInfo(item);
                                        setModalDept(true);
                                        branchValidation.setValues(item);
                                    }}
                                    id={`edittooltip-${item.id}`}
                                >
                                    <i className="bx bx-edit-alt me-2" /> Edit
                                    <UncontrolledTooltip placement="top" target={`edittooltip-${item.id}`}>
                                        Edit
                                    </UncontrolledTooltip>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="#"
                                    className="btn btn-sm btn-soft-danger"
                                    onClick={() => {
                                        onClickDelete(item);
                                    }}
                                    id={`deletetooltip-${item.id}`}
                                >
                                    <i className="bx bx-trash" />
                                    <UncontrolledTooltip placement="top" target={`deletetooltip-${item.id}`}>
                                        Delete
                                    </UncontrolledTooltip>
                                </Link>
                            </li>
                        </ul>
                    );
                },
            });
        }

        return columns;
    }, [canEdit]);


    const onClickDelete = async (item) => {

        Swal.fire({
            icon: 'question',
            title: 'Are you sure?',
            text: 'Do you want to delete this branch ?',
            showCancelButton: true,
            confirmButtonColor: '#34c38f',
            confirmButtonText: 'Yes',
            cancelButtonColor: '#f46a6a',
            cancelButtonText: 'No',
            customClass: {
                icon: 'swal-icon-small',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const responseData = await urlSocket.post("branch/delete-branch-info", {
                        encrypted_db_url: authUser.db_info.encrypted_db_url,
                        _id: item._id,
                    })
                    console.log(responseData, 'responseData');
                    if (responseData.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: `Branch deleted Successfully`,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                retriveBranchInfo()
                            }
                        })
                    }

                } catch (error) {
                    console.log(error, 'error');

                }
            }
        })
    }





    const toggleModal = () => {
        setModalDept(!modalDept);
        dispatch(setBranchNameExist(false))

    }

    const fieldsBranch = [
        {label: "Branch Name :", name: "br_name", placeholder: "Enter Branch Name", mandatory: true, type: "text", name_exist: branchExist, message: branchExist ? "Branch Name already exist" : ""},
        { label: "Branch Code :", name: "br_code", placeholder: "Enter Branch Code", mandatory: false, type: "text" },
        { label: "Branch Description :", name: "br_descp", placeholder: "Enter Branch Description", mandatory: false, type: "textarea" },
        { label: "Branch Address :", name: "br_address", placeholder: "Enter Branch Address", mandatory: false, type: "text" },
        { label: "Branch City :", name: "br_city", placeholder: "Enter Branch City", mandatory: false, type: "text" },
        { label: "Branch State :", name: "br_state", placeholder: "Enter Branch State", mandatory: false, type: "text" },
        { label: "Branch Country :", name: "br_country", placeholder: "Enter Branch Country", mandatory: false, type: "text" },
        { label: "Branch Contact Name :", name: "br_per_contct_name", placeholder: "Enter Branch Contact Name", mandatory: false, type: "text" },
        { label: "Branch Contact Number :", name: "br_per_contct_num", placeholder: "Enter Branch Contact Number", mandatory: false, type: "number" },
    ];


    const branchValidation = useFormik({
        initialValues: {
            br_name: "",
            br_code: "",
            br_descp: '',
            branch_ccode: ""

        },
        validationSchema: Yup.object({
            br_name: Yup.string().required("Branch Name is required")
                .matches(/\S+/, "Branch Name cannot be just spaces")
                .test(async function (value) {
                    return !(await dispatch(IRTvalidateDupName(editBranchInfo, "cln_adt_branches", "br_name", value, setBranchNameExist)));
                }),

            br_descp: Yup.string()
                .nullable()
                .notRequired()
        }),
        onSubmit: async (values) => {
            console.log(values, 'values');
            values["encrypted_db_url"] = authUser.db_info.encrypted_db_url
            if (editBranchInfo !== null) {
                values["_id"] = editBranchInfo._id
            }
            if (!branchExist) {
                const savedInfo = await saveBranch(values)
                console.log(savedInfo, 'savedInfo');
                if (savedInfo.status === 200) {
                    branchValidation.resetForm()
                    seteditBranchInfo(null)
                    setModalDept(false)
                    retriveBranchInfo()
                }
            }
        },
    });

    const saveBranch = async (values) => {
        return new Promise(async (resolve, reject) => {
            try {
                const responseData = await urlSocket.post("branch/crud-branches", { branch_info: values })
                console.log(responseData, 'responseData');
                resolve(responseData)

            } catch (error) {
                reject(error)
            }
        })

    }


    return (
        <React.Fragment>
            <div className='page-content'>
                <MetaTags>
                    <title>Manage Branch | AuditVista</title>
                </MetaTags>
                <Breadcrumbs title="Branches" breadcrumbItem="Branch" />

                <Container fluid>
                    <Card style={{ minHeight: "78vh" }}>
                        <CardBody>
                            <Row>
                                <Col md={12}>
                                    <TableContainer
                                        columns={branchColumns}
                                        data={branchList}
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
                                        handleNewBranch={() => { setModalDept(true); branchValidation.resetForm(); seteditBranchInfo(null); branchValidation.setValues({}); dispatch(setBranchNameExist(false)) }}
                                        canEdit={canEdit}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {modalDept && (
                        <Modal backdrop={"static"} isOpen={modalDept} toggle={() => toggleModal()}>
                            <ModalHeader toggle={() => toggleModal()} tag="h4">
                                {
                                    editBranchInfo !== null ? "Edit Branch" : "Add Branch"
                                }
                            </ModalHeader>
                            <ModalBody>
                                <Form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        branchValidation.handleSubmit();
                                    }}
                                >
                                    <Row>
                                        <Col className="col-12">
                                            {fieldsBranch.map((field, index) => (
                                                <div className="mb-3" key={index}>
                                                    <Label className="form-label">{field.label}
                                                        {
                                                            field.mandatory &&
                                                            <span className='text-danger'>*</span>

                                                        }

                                                    </Label>
                                                    {field.countryCode ? (
                                                        <div className="d-flex">
                                                            <Input
                                                                type="select"
                                                                name="branch_ccode"
                                                                onChange={branchValidation.handleChange}
                                                                onBlur={branchValidation.handleBlur}
                                                                value={branchValidation.values.branch_ccode || "+91"}
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
                                                                onChange={branchValidation.handleChange}
                                                                onBlur={branchValidation.handleBlur}
                                                                value={branchValidation.values[field.name] || ""}
                                                                invalid={branchValidation.touched[field.name] && branchValidation.errors[field.name] ? true : false}
                                                            />
                                                        </div>
                                                    ) : field.type === "select" && field.options ? (
                                                        <select
                                                            type="select"
                                                            name={field.name}
                                                            onChange={branchValidation.handleChange}
                                                            onBlur={branchValidation.handleBlur}
                                                            value={branchValidation.values[field.name] || ""}
                                                            className={`form-select ${branchValidation.touched[field.name] && branchValidation.errors[field.name] ? 'is-invalid' : ''}`}
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
                                                            onChange={branchValidation.handleChange}
                                                            onBlur={branchValidation.handleBlur}
                                                            value={branchValidation.values[field.name] || ""}
                                                            invalid={branchValidation.touched[field.name] && branchValidation.errors[field.name] ? true : false}
                                                        />
                                                    )}

                                                    {branchValidation.touched[field.name] && branchValidation.errors[field.name] ? (
                                                        <FormFeedback type="invalid">{branchValidation.errors[field.name]}</FormFeedback>
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
                                                <button
                                                    className="btn btn-sm w-md btn-outline-success">
                                                    {
                                                        editBranchInfo !== null ? "Update" : "Save"
                                                    }
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </ModalBody>
                        </Modal>
                    )}
                </Container>
            </div>
        </React.Fragment>
    )
}
export default ManageBranches
