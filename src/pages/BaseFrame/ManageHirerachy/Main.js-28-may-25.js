import urlSocket from 'helpers/urlSocket'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import {
  Card, CardBody, Container,
  Row, Col, CardTitle, Table, Button, Badge, Modal, ModalHeader, ModalBody, UncontrolledTooltip, Spinner
} from "reactstrap"
import MetaTags from 'react-meta-tags';
import TableContainer from './Component/TableContainer'
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { setTreeData, setApiRequestLoad } from 'toolkitStore/Auditvista/audit/htree';
import { useDispatch } from 'react-redux';
import { usePermissions } from 'hooks/usePermisson';

const Main = () => {
  const [dataLoaded, setdataLoaded] = useState(false)
  const [modal, setmodal] = useState(false)
  const [authUser, setauthUser] = useState(null)
  const [dataSource, setdataSource] = useState([])
  const [users, setUsers] = useState('')
  const [isEdit, setisEdit] = useState(false)
  const [hname, setHname] = useState('')
  const [id, setId] = useState('')
  const [hitem, setHitem] = useState('')
  const [hierarchyNameExist, sethierarchyNameExist] = useState(false)
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isProcessing = useRef(false);
  const dispatch = useDispatch()
  const { canView, canEdit } = usePermissions("hirchy");
  // const canEdit = false;


  useEffect(() => {

    const fetchData = async () => {
      var data = JSON.parse(sessionStorage.getItem("authUser"));
      await getHStructureListData(data)
      setauthUser(data)
      setdataLoaded(true)
    }
    fetchData()


  }, [])

  const getHStructureListData = async (data) => {

    try {
      const responseData = await urlSocket.post("webhstre/gethslist", {
        userInfo: {
          created_by: data.user_data._id,
          company_id: data.user_data.company_id,
          encrypted_db_url: data.db_info.encrypted_db_url
        },
      })
      if (responseData) {
        if (responseData.data.data) {
          setdataSource(responseData.data.data)
        }

      }

    } catch (error) {

    }
  }

  const dateConvertion = (dateToConvert) => {
    if (dateToConvert != null) {
      var date = typeof (dateToConvert) == "object" ? String(dateToConvert.toISOString()) : String(dateToConvert)
      var convertedDate = date.slice(8, 10) + ' / ' + (date.slice(5, 7)) + ' / ' + date.slice(0, 4);//prints expected format. 
      if (convertedDate == "01 / 01 / 1970") {
        return "-- / -- / --"
      }
      else {
        return convertedDate
      }
    }
    else {
      return "-- / -- / --"
    }
  }


  const handleDelete = (values) => {
    Swal.fire({
      icon: 'question',
      title: 'Are you sure?',
      text: 'Do you want to delete this ?',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      confirmButtonText: 'Yes',
      cancelButtonColor: '#f46a6a',
      cancelButtonText: 'No',
      customClass: {
        icon: 'swal-icon-small', // Apply a custom class to the icon
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        // console.log(authUser,'authUser');
        var authUser = JSON.parse(sessionStorage.getItem("authUser"))
        const responseData = await urlSocket.post("webhstre/deletehstructure", {
          info: values,
          encrypted_db_url: authUser.db_info.encrypted_db_url
        })
        if (responseData) {
          if (responseData.data.response_code == 500) {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: "Your file has been deleted.",
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            }).then(async (result) => {
              if (result.isConfirmed) {
                await getHStructureListData(authUser)
              }
            })
          }
        }

      }
    })

  }




  const columns = useMemo(() => [
    {
      accessor: 'hname',
      Header: 'Hierarchy Name',
      filterable: true,
      width: "50%",
      Cell: (cellProps) => {
        const item = cellProps.row.original;
        return (
          <div className="d-flex flex-row align-items-center">
            <div className="me-2">
              <i
                className={`mdi mdi-file-tree font-size-15 ${item.publish_status === "0"
                  ? "text-secondary"
                  : item.publish_status === "1"
                    ? "text-success"
                    : "text-danger"
                  }`}
              />
            </div>
            <div className={`font-size-13 fw-bold text-buttonPrimaryE `}>
              {item.hname}
              {canEdit && (
                <>

                  <button
                    id={`edit-${item._id}`}
                    className="btn text-primary"
                    style={{backgroundColor:"transparent"}}
                    onClick={() => {
                      setisEdit(true)
                      setHname(item.hname)
                      setId(item._id)
                      sethierarchyNameExist(false)
                      toggle()
                    }}
                  >
                    <i className="bx bx-edit-alt"></i>
                  </button>
                  <UncontrolledTooltip placement="top" target={`edit-${item._id}`}>
                    Edit
                  </UncontrolledTooltip>
                </>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessor: 'created_on',
      Header: 'Created On',
      width: "10%",
      Cell: (cellProps) => {
        const item = cellProps.row.original;
        return (
          <span className="font-size-10">
            {dateConvertion(item.created_on)}
          </span>
        );
      },
    },
    {
      accessor: 'publish_status',
      Header: 'Publish Status',
      width: "10%",
      Cell: (cellProps) => {
        const item = cellProps.row.original;
        return (
          <div>
            <span
              className={`font-size-10 badge ${item.publish_status === "0"
                ? "badge-soft-secondary"
                : item.publish_status === "1"
                  ? "badge-soft-success"
                  : "badge-soft-danger"
                }`}
            >
              {item.publish_status === "0" ? "Not Published" : "Published"}
            </span>
          </div>
        );
      },
    },
    {
      accessor: "menu",
      Header: "Action",
      width: "10%",
      Cell: (cellProps) => {
        const item = cellProps.row.original;
        return (


          <div className="d-flex gap-1 align-items-center" style={{ cursor: "pointer" }}>

            <button
              id={`view-${item._id}`}
              className="btn btn-sm btn-soft-primary d-flex align-items-center"
              onClick={() => { dispatch(setTreeData([])); dispatch(setApiRequestLoad(true)); navigateTo(item) }}
            >
              <i className="bx bx-right-arrow-alt font-size-16"></i>
            </button>

            {
              canEdit && (
                <>
                  <button
                    id={`delete-${item._id}`}
                    className="btn btn-sm btn-soft-danger"
                    onClick={() => {
                      handleDelete(item)
                      setHitem(item)
                    }}
                  >
                    <i className="bx bx-trash"></i>
                  </button>
                  <UncontrolledTooltip placement="top" target={`delete-${item._id}`}>
                    Delete
                  </UncontrolledTooltip>
                </>)
            }

            
          </div>
        );
      },
    },
  ], []);

  const toggle = () => {
    setmodal(!modal);
  }


  const handleUserClicks = arg => {
    setUsers('')
    setisEdit(false)
    setHname('')
    setId(null)
    sethierarchyNameExist(false)
    toggle()
  }

  const navigateTo = (hInfo) => {
    sessionStorage.removeItem("userNodeInfo");
    sessionStorage.removeItem("hInfo");
    sessionStorage.setItem("hInfo", JSON.stringify(hInfo));
    navigate("/new-hstructure")
  }


  const createNewHirerachy = async (hInfo) => {
    var authUser = JSON.parse(sessionStorage.getItem("authUser"))
    try {
      const responseData = await urlSocket.post("webhstre/crudhrchy", {
        hInfo: {
          company_id: authUser.client_info[0]?.["company_id"],
          company_name: authUser.client_info[0]?.["client_name"],
          created_by: authUser.user_data._id,
          updated_by: authUser.user_data._id,
          active: 1,
          hname: hInfo.hname,
          _id: id,
          encrypted_db_url: authUser.db_info.encrypted_db_url
        },
      })
      console.log(responseData, 'responseData');
      if (responseData.data.response_code === 500) {
        // hInfo["_id"] = responseData.data.data._id
        delete responseData.data.data.hstructure
        isEdit ? getHStructureListData(authUser) : navigateTo(responseData.data.data)
      }


    } catch (error) {

    } finally {
      isProcessing.current = false; // 🔹 Unlock submission
      setIsSubmitting(false);
    }



  }


  const handleValidHrchySubmit = (e, values) => {
    if (isProcessing.current) return;

    isProcessing.current = true;
    setIsSubmitting(true)
    const hInfo = {
      hname: values["hname"].trim(),
    }

    if (hierarchyNameExist === false && isEdit === false) {
      createNewHirerachy(hInfo)
      setmodal(false)
    }
    else if (isEdit === true) {
      createNewHirerachy(hInfo)
      setmodal(false)
    }

  }

  const validateHierarchyName = async (event) => {
    var authUser = JSON.parse(sessionStorage.getItem("authUser"))
    if (!isEdit) {
      try {
        const responseData = await urlSocket.post('cog/validate-hierarchy-name', {
          encrypted_db_url: authUser.db_info.encrypted_db_url,
          hname: event.target.value.trim(),
          created_by: authUser.user_data._id,
          create: true
        })
        if (responseData.data.data.length > 0) {
          sethierarchyNameExist(true)
        }
        else {
          sethierarchyNameExist(false)
        }

      } catch (error) {

      }
    }
    else {
      try {
        const responseData = await urlSocket.post('cog/validate-hierarchy-name', {
          encrypted_db_url: authUser.db_info.encrypted_db_url,
          hname: event.target.value.trim(),
          created_by: authUser.user_data._id,
          create: false
        })

        if (responseData.data.data.length > 0) {
          sethierarchyNameExist(true)
        }
        else {
          sethierarchyNameExist(false)

        }

      } catch (error) {

      }
    }
  }





  if (dataLoaded) {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Manage Hierarchy | AuditVista</title>
          </MetaTags>
          <Breadcrumbs title="Hierarchy" breadcrumbItem="Hierarchy" />
          <Container fluid>
            <Card style={{ minHeight: "78vh" }}>
              <CardBody>
                <TableContainer
                  columns={columns}
                  data={dataSource}
                  isGlobalFilter={true}
                  isAddOptions={false}
                  isJobListGlobalFilter={false}
                  customPageSize={10}
                  style={{ width: '100%' }}
                  dynamicBtn={true}
                  btnClick={handleUserClicks}
                  iscustomPageSizeOptions={false}
                  isPagination={true}
                  filterable={false}
                  btnName={"Create Hierarchy"}
                  tableClass="table align-middle table-nowrap table-hover table-striped-columns"
                  theadClass="table-light"
                  paginationDiv="col-sm-12 col-md-7"
                  pagination="pagination justify-content-end pagination-rounded"

                />
              </CardBody>
            </Card>
            <Row>
              <Modal
                isOpen={modal}
              //  className={props.className}
              >
                <ModalHeader
                  toggle={toggle} tag="h5"
                >
                  {isEdit ? "Edit Hierarchy" : "Add Hierarchy"}
                </ModalHeader>
                <ModalBody>
                  <AvForm
                    onValidSubmit={
                      handleValidHrchySubmit
                    }
                  >
                    <Row form>
                      <Col className="col-12">
                        <div className="mb-3">

                          <AvField
                            name="hname"
                            label={<span>Hierarchy Name <span style={{ color: 'red' }}>*</span></span>}
                            type="text"
                            placeholder="Enter Hierarchy Name"
                            errorMessage="Enter Hierarchy name"
                            value={hname}
                            onChange={(e) => { validateHierarchyName(e) }}
                            validate={{
                              required: { value: true },
                            }}
                          />
                          {
                            hierarchyNameExist &&
                            <div className="text-danger" style={{ fontSize: 'smaller' }}>Hierarchy Name already exist </div>
                          }
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="text-end">

                          <button
                            type="submit"
                            className="btn btn-outline-success  btn-sm save-user"
                            disabled={isSubmitting || hierarchyNameExist}
                          >
                            {isEdit ? "Update" : "Create"}
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </AvForm>
                </ModalBody>
              </Modal>
            </Row>
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
    )

  }
}

export default Main
