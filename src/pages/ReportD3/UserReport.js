import React, { use, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from "formik";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import MetaTags from 'react-meta-tags';
import { useNavigate } from 'react-router-dom'
import {
    CardBody, Container, Button, Row, Col, Card, Spinner, Modal, Form, FormGroup, Label, Input, FormFeedback
} from 'reactstrap';
import store from '../../store';
import TableContainer from './Components/TableContainer';
import moment from 'moment'
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
    getReportTemplateList, setSelectedReportInfo, crudReportPage, setopenModal,
    setReportTemplate, setTotalReportItems, setReportRequestLoading, deleteReportpage, getUserTemplates, updateTemplateStatus
} from '../../Slice/reportd3/reportslice';
import DeleteComp from './Components/DeleteComp'
import urlSocket from '../../helpers/urlSocket';
import { debounce } from "lodash";
import { setDbInfo } from 'Slice/authSlice';
import { usePermissions } from 'hooks/usePermisson';

    const {canEdit,canView} = usePermissions("user_report")

const ReportTemplate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const reportSlice = useSelector(state => state.reportSliceReducer)
    const AuthSliceState = useSelector((state) => state.auth);




    const authUser =  sessionStorage.getItem("authUser") ? JSON.parse(sessionStorage.getItem("authUser")) : null
    const dbInfo = useSelector((state) => state.auth)?.db_info





    console.log('dbInfo  Redux store :>> ', dbInfo);





    useEffect(() => {
        if( dbInfo === null || dbInfo === undefined || dbInfo == {} || Object.keys(dbInfo).length === 0) {
            console.log('dbInfo is empty or undefined, Manual DB Adjusted!!');
        //    dispatch(setDbInfo(JSON.parse(sessionStorage.getItem("authUser"))?.db_info || {}));
    
        }
    }, [ dbInfo , dispatch])

    




    console.log('authUser Userside ', authUser)
    const [editInfo, seteditInfo] = useState({})
    const [deleteModal, setDeleteModal] = useState(false);
    const [tempdata, setTempdata] = useState();

    const reportTemplateList = reportSlice?.reportTemplateList
    const pageSize = reportSlice?.pageInfo.pageSize
    const pageIndex = reportSlice?.pageInfo.pageIndex
    const openModal = reportSlice?.openModal

console.log('reportTemplateList :>> ', reportTemplateList );
    useEffect(() => {
        // if (authUser.role === 'User') {
   
            fetchuserReport(authUser, dbInfo)
        // }
        // else {
        //     fetchData();
        // }
    }, [ dbInfo ])

    const [nameExists, setNameExists] = useState(false);

    // Function to check name availability in MongoDB
    const checkNameAvailability = debounce(async (name) => {
        if (!name.trim()) return; // Avoid empty string checks


        if (!name || name?.trim() === editInfo?.name?.trim()) {
            setNameExists(false); // ✅ If name is same as original, don't show error
            return;
        }



        try {

            const response = await urlSocket.post("report/find-template-availability", { name : name  , encrypted_db_url:dbInfo.encrypted_db_url});
            console.log('response :>> ', response.data.exists);
            setNameExists(response.data.exists);
        } catch (error) {
            console.error("Error checking name availability:", error);
        }
    }, []); // Debounce delay to prevent excessive API calls





  




    const fetchData = async () => {
        dispatch(setReportRequestLoading(true))
        var response = await dispatch(getReportTemplateList(AuthSliceState , dbInfo))
        console.log('response 92:>> ', response);
        if (response) {
            console.log('response Auditvista  :>> ', response);
            dispatch(setReportTemplate(response.data))
            dispatch(setTotalReportItems(response.totalItems));
            dispatch(setReportRequestLoading(false))
        }
    }

    const fetchuserReport = async (authUser, dbInfo) => {
        console.log('fetchuserReport :>> ', authUser, dbInfo);
        var responseData = await dispatch(getUserTemplates(authUser, dbInfo))
        console.log('res :>> ', responseData);
        dispatch(setReportTemplate(responseData.data))
        dispatch(setTotalReportItems(responseData.totalItems));
        dispatch(setReportRequestLoading(false))
    }


    const publishPage = (data, mode, reuse) => {
        var reportInfo = { ...data }
        if (reuse === "1") {
            sessionStorage.setItem("page_data", JSON.stringify(reportInfo))

            navigate("/publish_reports")

        }
        if (reuse === "2") {
            reportInfo = {
                ...reportInfo,
                encrypted_db_url: dbInfo.encrypted_db_url,
                status: mode
            }
        }
        if (reuse === "3") {
            reportInfo = {
                ...reportInfo,
                encrypted_db_url: dbInfo.encrypted_db_url,
                publish_status: mode
            }
        }
        if (reuse === "3" || reuse === "2") {
            console.log('reportInfo :>> ', reportInfo);
            dispatch(crudReportPage(reportInfo))


            console.log('data :>> ', data);
            dispatch(updateTemplateStatus(data, authUser, dbInfo, mode))





            setTimeout(() => {
                fetchData();
            }, 100);


        }
    }



    const page = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: '' || editInfo.name,
            description: '' || editInfo.description,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Please Enter Your Page Name"),
            description: Yup.string().required("Please Enter Your Page Description"),
        }),
        onSubmit: async (values) => {
            dispatch(setReportRequestLoading(true));
            console.log('values :>> ', values, Object.keys(editInfo).length);
            console.log("authUser", authUser, "editInfo", editInfo, "AuthSliceState", AuthSliceState);

            var DB_Info = JSON.parse(sessionStorage.getItem("authUser")).db_info
            console.log("DB_Info", DB_Info)
            if (!nameExists) {

            if (Object.keys(editInfo).length > 0) {
                values["created_by"] = authUser?.user_data._id
                values["encrypted_db_url"] = DB_Info.encrypted_db_url
                values["_id"] = editInfo?._id
                values["status"] = editInfo?.status
                values["publish_status"] = editInfo?.publish_status
                values["published_by"] = editInfo?.published_by
                values["published_on"] = editInfo?.published_on
            }
            else {
                values["created_by"] = authUser?.user_data?._id
                values["encrypted_db_url"] = DB_Info.encrypted_db_url
            }
            console.log('values Final :>> ', values);
            var response = await dispatch(crudReportPage(values))
            console.log('response :>> ', response);
            if (response) {
                fetchData()
                dispatch(setReportRequestLoading(false));
                dispatch(setopenModal(false));

            }
          }
           
        }
    })
  // Call checkNameAvailability when name changes
  useEffect(() => {
    if (page.values.name) {
        checkNameAvailability(page.values.name);
    }
}, [page.values.name]);


    const columns = useMemo(() => [
        {
            accessor: 'name',
            Header: <span className="">Template Name</span>,
            filterable: true,
            // width: "30%",
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <div className="fw-bold font-size-12">
                        <span style={{ fontSize: '13px', color: '#848484' }}>{item.name}</span>
                    </div>
                )

            }
        },
        {
            accessor: 'createdAt',
            Header: <span className="">Created On</span>,
            filterable: true,
            // width: "15%",
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                        <span className="font-size-11">
                            {item.createdAt === null ? "-- / -- / --" : moment(item.createdAt).format("DD / MMM / YYYY")}
                        </span>
                    </>
                )

            }
        },
        {
            accessor: 'publish_status',
            Header: <span className="">Publish Status</span>,
            filterable: true,
            // width: "15%",
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                        <div className="d-flex font-size-11">


                            {
                                item.publish_status == "0" ?
                                    <span className="badge badge-soft-secondary" style={{ fontSize: "11px" }}>Not Published</span>
                                    :
                                    item.publish_status == "1" ?
                                        <span className="badge badge-soft-success" style={{ fontSize: "11px" }}> Published</span>
                                        :
                                        <span className="badge badge-soft-danger" style={{ fontSize: "11px" }}> Stopped</span>
                            }


                        </div>
                    </>
                )

            }
        },
        // {
        //     accessor: 'status',
        //     Header: <span className="">Page Status</span>,
        //     filterable: true,
        //     // width: "5%",
        //     Cell: (cellProps) => {
        //         var item = cellProps.row.original
        //         return (
        //             <>
        //                 <span className="d-flex font-size-11">
        //                     {
        //                         item.status == "1" ?
        //                             <span className="badge badge-soft-success" style={{ fontSize: "11px" }}>Active</span>
        //                             :
        //                             <span className="badge badge-soft-danger" style={{ fontSize: "11px" }}>Inactive</span>
        //                     }
        //                 </span>
        //             </>
        //         )
        //     }
        // },
        {
            accessor: 'published_on',
            Header: <span className="">Published On</span>,
            filterable: true,
            // width: "25%",
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                        <span className="font-size-11">
                            {
                                item.published_on == null ? "-- / -- / --" : moment(item.published_on).format("DD / MMM / YYYY")

                            }
                        </span>
                    </>
                )
            }
        },
        {
            accessor: 'action',
            Header: <span className="">Action</span>,
            filterable: true,
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                        <div className="d-flex gap-1 text-end" >
                            {
                                item.publish_status === "0" || item.publish_status === "2" ?
                                    <>
                                        <button className={`${item.publish_status === '1' ? 'btn btn-soft-danger' : 'btn btn-soft-success' }  btn-sm`} onClick={() => { publishPage(item, item.publish_status === "1" ? "0" : "1", "1") }}>
                                            Publish
                                        </button>
                                    </>
                                    :
                                    <>
                                    </>
                            }


                            {/* <button className='btn btn-sm btn-soft-primary' onClick={() => { publishPage(item, item.status === "1" ? "0" : "1", "2") }} >
                                <i className="mdi mdi-account-circle font-size-12  me-1" />{" "}
                                {item.status === "1" ? "Make Inactive" : "Active"}
                            </button> */}



                            {
                                item.publish_status === "1" && (
                                    <button
                                        className="btn btn-sm btn-soft-danger"
                                        onClick={() => {
                                            Swal.fire({
                                                title: "Are you sure?",
                                                // text: `Do you want to stop this ${item.name} Published Template?`,
                                                html: `Do you want to stop <strong style="color: #d33;">${item.name}</strong> Published Template?`,
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#d33",
                                                cancelButtonColor: "#6c757d",
                                                confirmButtonText: "Yes, stop it!",
                                                cancelButtonText: "Cancel",
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    publishPage(item, "2", "3");
                                                    Swal.fire("Stopped!", "The Template has been stopped.", "success");
                                                }
                                            });
                                        }}
                                    >
                                        <i className="bx bx-stop-circle font-size-12 me-1" />Stop
                                    </button>
                                )
                            }



                            {
                                (item.status === "3" && !( item.publish_status === "0" || item.publish_status === "2" ) )&&
                                <button className='btn btn-soft-success' onClick={() => { publishPage(item, item.publish_status === "1" ? "0" : "1", "1") }} >
                                    <i className="bx bx-stop-circle font-size-12 me-1" />Re-Publish
                                </button>
                            }


                            
                            <button className='btn btn-sm btn-soft-primary' onClick={() => { seteditInfo(item); dispatch(setopenModal(true)) }}>
                                <i className="mdi mdi-calendar font-size-12 me-1" />Edit
                            </button>


                            <button className="btn btn-sm btn-soft-danger" onClick={() => { setTempdata(item); setDeleteModal(true) }}>
                                <i className="bx bx-trash-alt font-size-12 me-1" /> Delete
                            </button>


                            <button className='btn btn-sm btn-soft-primary' onClick={() => { sessionStorage.setItem("page_data", JSON.stringify(item)); dispatch(setSelectedReportInfo(item)); navigate('/page_tree') }}>
                                <i className="bx bx-right-arrow-alt" style={{ cursor: 'pointer' }} />
                            </button>

                        </div>
                    </>
                )
            }
        }

    ], reportTemplateList)

    const userColumns = useMemo(() => [
        {
            accessor: 'name',
            Header: <span className="">Template Name</span>,
            filterable: true,
            // width: "30%",
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <div className="fw-bold font-size-12">
                        <span style={{ fontSize: '13px', color: '#848484' }}>{item.name}</span>
                    </div>
                )

            }
        },
        {
            accessor: 'createdAt',
            Header: <span className="">Created On</span>,
            filterable: true,
            // width: "15%",
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                        <span className="font-size-11">
                            {item.createdAt === null ? "-- / -- / --" : moment(item.createdAt).format("DD / MMM / YYYY")}
                        </span>
                    </>
                )

            }
        },
        // {
        //     accessor: 'publish_status',
        //     Header: <span className="">Publish Status</span>,
        //     filterable: true,
        //     // width: "15%",
        //     Cell: (cellProps) => {
        //         var item = cellProps.row.original
        //         return (
        //             <>
        //                 <div className="d-flex font-size-11">


        //                     {
        //                         item.publish_status == "0" ?
        //                             <span className="badge badge-soft-secondary" style={{ fontSize: "11px" }}>Not Published</span>
        //                             :
        //                             item.publish_status == "1" ?
        //                                 <span className="badge badge-soft-success" style={{ fontSize: "11px" }}> Published</span>
        //                                 :
        //                                 <span className="badge badge-soft-danger" style={{ fontSize: "11px" }}> Stopped</span>
        //                     }


        //                 </div>
        //             </>
        //         )

        //     }
        // },
        // {
        //     accessor: 'status',
        //     Header: <span className="">Page Status</span>,
        //     filterable: true,
        //     // width: "5%",
        //     Cell: (cellProps) => {
        //         var item = cellProps.row.original
        //         return (
        //             <>
        //                 <span className="d-flex font-size-11">
        //                     {
        //                         item.status == "1" ?
        //                             <span className="badge badge-soft-success" style={{ fontSize: "11px" }}>Active</span>
        //                             :
        //                             <span className="badge badge-soft-danger" style={{ fontSize: "11px" }}>Inactive</span>
        //                     }
        //                 </span>
        //             </>
        //         )
        //     }
        // },
        {
            accessor: 'published_on',
            Header: <span className="">Published On</span>,
            filterable: true,
            // width: "25%",
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                        <span className="font-size-11">
                            {
                                item.published_on == null ? "-- / -- / --" : moment(item.published_on).format("DD / MMM / YYYY")

                            }
                        </span>
                    </>
                )
            }
        },
        {
            accessor: 'action',
            Header: <span className="">Action</span>,
            filterable: true,
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                        <div className="d-flex gap-1 text-end" >
                            <button className='btn btn-sm btn-soft-primary' onClick={() => { sessionStorage.setItem("page_data", JSON.stringify(item)); dispatch(setSelectedReportInfo(item)); navigate('/page_tree') }}>
                                <i className="bx bx-right-arrow-alt" style={{ cursor: 'pointer', width: '100px', fontSize: '18px' }} />
                            </button>

                        </div>
                    </>
                )
            }
        }

    ], reportTemplateList)


    const deleteItem = async (item) => {

        console.log("585 item._id ", item._id);
        var res = await dispatch(deleteReportpage(item._id))
        console.log('res :>> ', res);
        setDeleteModal(false)
        if (res.status === 200) {
            fetchData()
        }

    }

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Surguru {`${authUser?.role !== undefined ? authUser?.role : ''}`}| Report Templates</title>
                </MetaTags>
                <Container fluid>
                    <Breadcrumbs title="Report Templates" breadcrumbItem="User Templates" />

                    <DeleteComp
                        show={deleteModal}
                        data={tempdata}
                        onDeleteClick={() => deleteItem(tempdata)}
                        onCloseClick={() => setDeleteModal(false)}
                    />

                    <Row>
                        {
                            reportTemplateList ?
                                <Col lg="12">
                                    <Card>
                                        <CardBody>

                                            {
                                                // authUser.role === 'User' ?
                                                    <TableContainer
                                                        columns={userColumns}
                                                        data={reportTemplateList}
                                                        isGlobalFilter={true}
                                                        isAddOptions={false}
                                                        isJobListGlobalFilter={false}
                                                        customPageSize={10}
                                                        style={{ width: "100%" }}
                                                        isPagination={true}
                                                        filterable={false}
                                                        tableClass="align-middle table-nowrap table-check table-hover"
                                                        theadClass="table-light"
                                                        pagination="pagination pagination-rounded justify-content-end my-2"
                                                        // resetForm={() => { page.resetForm(); seteditInfo({}) }}
                                                        pageIndex={pageIndex}
                                                        pageSize={pageSize}
                                                        showBtn={false}
                                                    />
                                                    // :
                                                    // <TableContainer
                                                    //     columns={columns}
                                                    //     data={reportTemplateList}
                                                    //     isGlobalFilter={true}
                                                    //     isAddOptions={false}
                                                    //     isJobListGlobalFilter={false}
                                                    //     customPageSize={10}
                                                    //     style={{ width: "100%" }}
                                                    //     isPagination={true}
                                                    //     filterable={false}
                                                    //     tableClass="align-middle table-nowrap table-check table-hover"
                                                    //     theadClass="table-light"
                                                    //     pagination="pagination pagination-rounded justify-content-end my-2"
                                                    //     resetForm={() => { page.resetForm(); seteditInfo({}) }}
                                                    //     pageIndex={pageIndex}
                                                    //     pageSize={pageSize}
                                                    //     showBtn={true}
                                                    // />
                                            }
                                        </CardBody>
                                    </Card>

                                </Col>
                                :
                                <Col lg="12">
                                    <Card>
                                        <CardBody style={{ height: "100vh" }}>
                                            <div className="d-flex flex-column justify-content-center align-items-center">
                                                <div>Loading...</div>
                                                <Spinner className="ms-2" color="primary" />
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                        }


                        <Modal
                            size="md"
                            isOpen={openModal}
                            toggle={() => dispatch(setopenModal(!openModal))}
                            backdrop="static"
                            centered
                        >
                            <Row className="p-3">
                                <Col xl={12} md={12} sm={12}>
                                    <div className="modal-header bg-light" style={{ borderBottom: '1px solid #dee2e6' }}>
                                        <h5 className="modal-title" style={{ fontSize: "16px", fontFamily: "Poppins, sans-serif" }}>
                                            Template Info
                                        </h5>
                                        <Button
                                            onClick={() => { dispatch(setopenModal(false)); seteditInfo({}) }}
                                            type="button"
                                            className="btn-close"
                                            aria-label="Close"
                                        />
                                    </div>

                                    <div className="modal-body">
                                        <Form
                                            className="needs-validation"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                page.handleSubmit();
                                                return false;
                                            }}
                                        >
                                            <Row className="g-3">
                                                <Col xl={12} md={12} sm={12}>
                                                    <FormGroup>
                                                        <Label className="form-label fw-bold">Template Name:</Label>
                                                        <Input
                                                            name="name"
                                                            placeholder="Enter Page Name"
                                                            type="text"
                                                            className="form-control"
                                                            style={{ borderRadius: "5px" }}
                                                            onChange={page.handleChange}
                                                            onBlur={page.handleBlur}    
                                                            value={page.values.name || editInfo.name || ""}
                                                            invalid={page.touched.name && (page.errors.name || nameExists)} // ✅ Consider both validation error & duplication
                                                        />
                                                        {page.touched.name && page.errors.name && (
                                                            <FormFeedback>{page.errors.name}</FormFeedback>
                                                        )}
                                                        {nameExists  && (
                                                            <FormFeedback>Name already exists. Please choose another.</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                  
                                                </Col>

                                                <Col xl={12} md={12} sm={12}>
                                                    <FormGroup>
                                                        <Label className="form-label fw-bold">Description:</Label>
                                                        <Input
                                                            name="description"
                                                            placeholder="Enter Page Description"
                                                            type="textarea"
                                                            className="form-control"
                                                            style={{ borderRadius: "5px", height: "100px" }}
                                                            onChange={page.handleChange}
                                                            onBlur={page.handleBlur}
                                                            value={page.values.description || editInfo.description || ""}
                                                            invalid={page.touched.description && page.errors.description ? true : false}
                                                        />
                                                        {page.touched.description && page.errors.description && (
                                                            <FormFeedback>{page.errors.description}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Row className="mt-3">
                                                <Col className="d-flex justify-content-end gap-2">
                                                    <Button type="button" color="danger"
                                                        className="btn btn-sm w-md"
                                                        style={{ borderRadius: "5px" }}
                                                        onClick={() => { dispatch(setopenModal(false)); seteditInfo({}) }}

                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit" color="success" className="btn btn-sm w-md" style={{ borderRadius: "5px" }} >
                                                        {Object.keys(editInfo).length > 0 ? "Update" : "Submit"}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </div>
                                </Col>
                            </Row>
                        </Modal>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default ReportTemplate;