import React, { useEffect, useMemo, useState } from 'react'
import { Container, Row, Col, Button, Card, CardBody, Modal, ModalHeader, ModalBody, UncontrolledDropdown, DropdownToggle, 
    DropdownMenu, DropdownItem, UncontrolledTooltip, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation"
import "react-perfect-scrollbar/dist/css/styles.css";
import "./manageAudit.css";
import _ from 'lodash'
import Breadcrumbs from  '../../../components/Common/Breadcrumb'
import MetaTags from 'react-meta-tags';
import { FaStop, FaRedo } from "react-icons/fa";
import { Popconfirm } from 'antd';
import urlSocket from 'helpers/urlSocket';
import TableContainer from './Components/TableContainer';
import "react-datepicker/dist/react-datepicker.css";
import UpdateDailyAuditInfo from './Components/updateDailyAuditInfo';
import UpdateShiftInfo from './Components/UpdateShiftInfo';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { usePermissions } from 'hooks/usePermisson';
import { use } from 'react';
import ConfigDetails from './Components/ConfigurationDetails';

const ManagePublishedTemplate = () => {

    const [departmentId,setDepartmentId] = useState(null)
    const [departmentName,setdepartmentName] = useState(null)
    const [yearName,setyearName] = useState(null)
    const [depName,setdepName] = useState("")
    const [companyId,setcompanyId] = useState(null)
    const [departmentArray,setdepartmentArray] = useState([])
    const [userId,setuserId] = useState(null)
    const [auditData,setauditData] = useState([])
    const [errorData,seterrorData] = useState([])
    const [yearData,setyearData] = useState([])
    const [dataloaded,setdataloaded] = useState(false)
    const [modal,setmodal] = useState(false)
    const [isEdit,setisEdit] = useState(false)
    const [entitiesAuditData,setentitiesAuditData] = useState([])
    const [searchFiles,setsearchFiles] = useState([])
    const [dupsearchFiles,setdupsearchFiles] = useState([])
    const [currentPage,setcurrentPage] = useState(1)
    const [totalItems,settotalItems] = useState(0)
    const [tempSearchFiles,settempSearchFiles] = useState([])
    const [selectedDate,setselectedDate] = useState(new Date())
    const [open,setOpen] = useState(false)
    const [auditInfo,setauditInfo] = useState(null)
    const [dbInfo,setDbInfo] = useState(null)
    const [userInfo,setuserInfo] = useState(null)
    const [nonpublishedCount,setNonPublishedCount] = useState(null)
    const [publishedCount,setpublishedCount] = useState(null)
    const [totalAudit,settotalAudit] = useState(null)
    const [navMode,setnavMode] = useState("")
    const [selectedItem,setselectedItem] = useState(null)
    const [component,setcomponent] = useState("")
    const [sort,setSort] = useState("")
    // const [cliInfo, setCliInfo] = useState(null)
    const history = useNavigate()
    const {canEdit,canView} = usePermissions("mngpblhtempt")
      const [configOpen, setConfigOpen] = useState(false);
  const [configItem, setConfigItem] = useState(null);



    useEffect(()=>{

        var data = JSON.parse(sessionStorage.getItem("authUser"));
        // var cliData =  JSON.parse(sessionStorage.getItem("client_info"));
        var db_info = JSON.parse(sessionStorage.getItem("db_info"));
        var user_facilities = JSON.parse(sessionStorage.getItem("user_facilities"))
        sessionStorage.removeItem("adt_master_id")
        // setCliInfo(cliData)
        setuserInfo(data.user_data)
        setDbInfo(db_info)
        getAuditMasterTemplates()

    },[])

    useEffect(() => {
        if (dbInfo) {
            getAuditMasterTemplates()
        }

    }, [dbInfo])


    useEffect(()=>{
        if(navMode){
            navigateTo(selectedItem)
        }

    },[navMode])



   const navigateTo = (data) => {
        if (navMode == "0") //publish
        {
          sessionStorage.removeItem("publishData");
          sessionStorage.setItem("publishData", JSON.stringify(data));
          history("/pblhcfg")
        }
        else if (navMode == "1") {
          sessionStorage.removeItem("EditPublishedData");
          sessionStorage.setItem("EditPublishedData", JSON.stringify(data));
          history("/edtpblhtempt");
        }
        else if (navMode == "3") {
            sessionStorage.removeItem("publishData");
            sessionStorage.removeItem("EditPublishedData");
            sessionStorage.removeItem("publishedAuditData");
            sessionStorage.setItem("publishedAuditData", JSON.stringify(data));
            history("/hlvlpbdrpt");
        }
        else if (navMode == "4") {
          sessionStorage.removeItem("publishData");
          sessionStorage.removeItem("EditPublishedData");
          sessionStorage.removeItem("publishedAuditData");
          sessionStorage.setItem("publishedAuditData", JSON.stringify(data));
          history("/adtaltclrprt");
        }
      }



    const getAuditMasterTemplates=async()=>{
      const authUser = JSON.parse(sessionStorage.getItem('authUser'))
      const user_data =authUser.user_data;
      var cliData =  JSON.parse(sessionStorage.getItem("client_info"));


        try {
            const response = await urlSocket.post("/webmngpbhtmplt/getpublishedtemplate",{
                userInfo: {
                    encrypted_db_url: authUser.db_info.encrypted_db_url,
                    company_id: cliData[0].company_id,
                    user_id: user_data._id,
                  },
            })
            console.log(response,'response')
            var non_published_count = []
            _.filter(response.data.data, e => {
                if (e.publish_status == "0") {
                    non_published_count.push(e)
                }
            })
            var published_count = []
            _.filter(response.data.data, e => {
                if (e.publish_status == "2") {
                    published_count.push(e)
                }
            })

            setauditData(response.data.data)
            setentitiesAuditData(response.data.data)
            setdataloaded(true)
            setNonPublishedCount(non_published_count.length)
            setpublishedCount(published_count.length)
            settotalAudit(response.data.data.length)
            setsearchFiles(response.data.data)
            setdupsearchFiles(response.data.data)
            settempSearchFiles(response.data.data)
        } catch (error) {
                console.log(error,'error');
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


      const updateOnetimeInfo = async (tempInfo,status) => {
        console.log('tempInfo', tempInfo)
        tempInfo["schedule_status"]= status
      const authUser = JSON.parse(sessionStorage.getItem('authUser'))
        try {

          const responseData = await urlSocket.post("/webmngpbhtmplt/update-onetime-info", {
            status: tempInfo.schedule_status === "0" ? "1" : "0",
            schedule_status : status,
            encrypted_db_url: authUser.db_info.encrypted_db_url,
            _id: tempInfo._id,
            repeat_mode_config : tempInfo.repeat_mode_config
          })

              console.log(responseData, 'responseData185')
          if (responseData.data.response_code === 200) {
             getAuditMasterTemplates()
          }
    
        } catch (error) {
          console.log(error, 'error')
        }
      }



     const updateMasterInfo = async (tempInfo) => {
      const authUser = JSON.parse(sessionStorage.getItem('authUser'))
        try {

          const responseData = await urlSocket.post("/webmngpbhtmplt/update-master-info", {
            status: tempInfo.schedule_status === "0" ? "1" : "0",
            encrypted_db_url: authUser.db_info.encrypted_db_url,
            _id: tempInfo._id,
            repeat_mode_config : tempInfo.repeat_mode_config
          })
          console.log(responseData, 'responseData')
          if (responseData.data.response_code === 500) {
             getAuditMasterTemplates()
          }
    
        } catch (error) {
          console.log(error, 'error')
        }
      }


      const deleteInfo=(item)=>{
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'Do you want to delete this Audit?',
            showCancelButton: true,
            confirmButtonColor: '#2ba92b',
            confirmButtonText: 'Yes',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No'
        }).then((result) => {
            if(result.isConfirmed){
              console.log(dbInfo,'dbInfo');
                try {
                    urlSocket.post("webmngpbhtmplt/deletepublishedtemplate", {
                      templateInfo: {
                        template_id: item._id
                      },
                      userInfo: {
                        encrypted_db_url: authUser.db_info.encrypted_db_url,
                        company_id: authUser.user_data.company_id,
                        created_by: authUser.user_data._id,
                      },
                    })
                      .then(response => {
                        if (response.data.response_code == 500) {
                            setauditData(response.data.data)
                            getAuditMasterTemplates()
                        }
                      })
                  } catch (error) {
                    console.log("catch error", error)
                  }

            }

        })
      }

      const convertUTCtoIST=(utcDateString)=> {
        const utcDate = new Date(utcDateString);
        const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // 5 hours + 30 minutes in milliseconds
        const istDate = new Date(utcDate.getTime() + istOffset);
        const day = istDate.getUTCDate(); // Use `getUTCDate` to ensure no timezone shift
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[istDate.getUTCMonth()];
        const year = istDate.getUTCFullYear().toString().slice(-2);
        let hours = istDate.getUTCHours(); // Use `getUTCHours` after applying IST offset
        const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
        const period = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12;
      
        return `${day}/${month}/${year} ${hours}:${minutes}${period}`;
      }


    const columns = useMemo(()=>[
        {
          accessor: 'template_name',
          Header: 'Audit Name',
          filterable: true,
          width: "35%",
          Cell: (cellProps) => {
            var item = cellProps.row.original
            return (
              <>
                <div className="fw-bold font-size-12 text-wrap" >
                  {item.template_name}
                </div>
              </>
            )
          }
        },
        {
          accessor: 'method_selected',
          Header: 'Audit type',
          filterable: true,
          Cell: (cellProps) => {
            var item = cellProps.row.original
            return (
              <>
                <span className={item.method_selected == "0" ? "badge badge-soft-secondary font-size-11 m-1" :
                  item.method_selected == "1" ? "badge badge-soft-warning font-size-11 m-1" :
                    item.method_selected == "2" ? "badge badge-soft-pink font-size-11 m-1" : "badge badge-soft-danger font-size-11 m-1"}
                >
                  {item.method_selected === "0" ?"-" :item.method_selected ==="1" ? "Manual" : "Hierarchy"  }
                </span>
              </>
            )
          }
        },
        {
          accessor: 'total_checkpoints',
          Header: 'Check points',
          filterable: true,
          Cell: (cellProps) => {
            var item = cellProps.row.original
            return (
              <>
                <span
                  className={`badge ${item.total_checkpoints === 0 ? "badge-soft-secondary" : "badge-soft-success"} font-size-11`}
                  style={{ borderRadius: "50%", padding: "0.5em 0.75em", display: "inline-block", textAlign: "center" }}>
                  {item.total_checkpoints}
                </span>
              </>
            )
          }
        },
      
        {
          accessor: 'created_on',
          Header: 'Created on',
          Cell: (cellProps) => {
            var item = cellProps.row.original
            return (
              <>
                <div className="font-size-11 text-wrap">{dateConvertion(item.created_on)}</div>
              </>
            )
          }
        },
        {
          accessor: 'publish_status',
          Header: 'Publish status',
          Cell: (cellProps) => {
            var item = cellProps.row.original
            return (
              <>
                <span className={item.publish_status == "0" ? "badge badge-soft-secondary font-size-11 m-1" :
                  item.publish_status == "1" ? "badge badge-soft-warning font-size-11 m-1" :
                    item.publish_status == "2" ? "badge badge-soft-success font-size-11 m-1" : "badge badge-soft-danger font-size-11 m-1"}
                >
                  {item.publish_status == "0" ? "Not publish" : item.publish_status == "1" ? "Publish In progress" : item.publish_status == "2" ? "Published" : "Stopped"}
                </span>
              </>
            )
          }
        },
        {
          accessor: 'published_on',
          Header: 'Published On / Time',
          Cell: (cellProps) => {
            var item = cellProps.row.original
            return (
              <>
                <div className="font-size-11 text-wrap">{item.published_on ? convertUTCtoIST(item.published_on):"-"}</div>
              </>
            )
          }
        },
        {
          accessor: 'next_job_on',
          Header: 'Next Job On / Time',
          Cell: (cellProps) => {
            var item = cellProps.row.original
            return (
              <>
                <div className="font-size-11 text-wrap">{item.job?.next_job_on ? convertUTCtoIST(item.job?.next_job_on):"-"}</div>
              </>
            )
          }
        },
        {
          accessor: 'repeat_mode_config.mode',
          Header: 'Schedule Type',
          filterable: true,
          Cell: (cellProps) => {
            var item = cellProps.row.original
            return (
              <>
                <span className={item.repeat_mode_config.mode == "One time" ? "badge badge-soft-secondary font-size-11 m-1" : "badge badge-soft-info font-size-11 m-1"}>
                  {item.repeat_mode_config.mode}
                </span>
              </>
            )
          }
        },
        {
          accessor: "menu",
          disableFilters: true,
          Header: "Edit / Modify / Reschedule Audit",
          Cell: (cellProps) => {
            var item = cellProps.row.original
            return (
              <>
                <div className="d-flex justify-content-start align-items-center gap-1" style={{ cursor: 'pointer' }}>
                  {item.publish_status !== "1" && item.publish_status !== "2"? (
                    <>
                      <button
                        className="btn btn-sm btn-soft-primary d-flex align-items-center"
                        id={`tooltip-publish-${item._id}`}
                        disabled={canEdit === false}
                        onClick={() => {
                            setselectedItem(item)
                            setnavMode("0")
                            // navigateTo(item)
                        }}
                      >
                        <i className="mdi mdi-publish font-size-12 me-2" />Publish
                      </button>


                      {/* <UncontrolledTooltip placement="top" target={`tooltip-schedule-${item._id}`}>
                        {"Configuration"}
                      </UncontrolledTooltip> */}
                      <button
                        className="btn btn-sm btn-soft-primary d-flex align-items-center"
                        id={`tooltip-view-report-${item._id}`}
                        onClick={() => {
                          setConfigOpen(true);
                          setConfigItem(item)
                        }}
                      >
                        Configuration
                      </button> 






                      <button
                        className="btn btn-sm btn-soft-primary"
                        id={`tooltip-edit-${item._id}`}
                        disabled={canEdit === false}
                        onClick={() => {
                            setselectedItem(item)
                            setnavMode("1")
                        }}
                      >
                        <i className="bx bx-edit-alt font-size-12" />
                      </button>
                      <UncontrolledTooltip placement="top" target={`tooltip-edit-${item._id}`}>
                        Edit
                      </UncontrolledTooltip>

                      <button
                        className="btn btn-sm btn-soft-danger"
                        id={`tooltip-delete-${item._id}`}
                        disabled={canEdit === false}
                        onClick={()=>{
                            deleteInfo(item)
                        }}
                      >
                        <i className="bx bx-trash font-size-12" />
                      </button>
                      <UncontrolledTooltip placement="top" target={`tooltip-delete-${item._id}`}>
                        Delete
                      </UncontrolledTooltip>
                    </>
                  ) : item.repeat_mode_config.mode_id === "0" ? (
                    <>
                      <button
                        className={`btn btn-sm ${item.schedule_status === "0" ? 'btn-soft-danger' : 'btn-soft-secondary'}`}
                        id={`tooltip-schedule-${item._id}`}
                      >
                       
                        <Popconfirm
                          placement="leftBottom"
                          title={`Are you sure to ${item.schedule_status === "0" ? "Stop" : "Restart"}?`}
                          onConfirm={() => updateOnetimeInfo(item,item.schedule_status === "0" ? "1" :"0")}
                          style={{ width: '200px', marginLeft: '0px' }}
                        >
                          {item.schedule_status === "0" ? (
                            <>
                              <FaStop className="me-1" /> Stop
                            </>
                          ) : (
                            <>
                              <FaRedo className="me-1" /> Restart
                            </>
                          )}
                        </Popconfirm>
                      </button>
                      <UncontrolledTooltip placement="top" target={`tooltip-schedule-${item._id}`}>
                        {item.schedule_status === "0" ? "Stop" : "Restart"}
                      </UncontrolledTooltip>
                      <button
                        className="btn btn-sm btn-soft-primary d-flex align-items-center"
                        id={`tooltip-view-report-${item._id}`}
                        onClick={() => {
                            setselectedItem(item)
                            setnavMode("4")
                        }}
                      >
                         View Report
                      </button>
                        <button
                        className="btn btn-sm btn-soft-primary d-flex align-items-center"
                        id={`tooltip-view-report-${item._id}`}
                        onClick={() => {
                          setConfigOpen(true);
                          setConfigItem(item)
                        }}
                      >
                        Configuration
                      </button> 

                              <button
                        className="btn btn-sm btn-soft-primary"
                        id={`tooltip-edit-${item._id}`}
                        disabled={canEdit === false}
                        onClick={() => {
                            setselectedItem(item)
                            setnavMode("1")
                        }}
                      >
                        <i className="bx bx-edit-alt font-size-12" />
                      </button>
                      <UncontrolledTooltip placement="top" target={`tooltip-edit-${item._id}`}>
                        Edit
                      </UncontrolledTooltip>

                      <button
                        className="btn btn-sm btn-soft-primary d-flex align-items-center"
                        id={`tooltip-view-detail-${item._id}`}
                        onClick={() => {
                            setselectedItem(item)
                            setnavMode("3")
                            // sessionStorage.setItem("publishedAuditData", {
                            //   _id : item._id,
                            //   repeat_mode_config : item.repeat_mode_config,

                            // });
                        }}
                      >
                        <i className="bx bx-right-arrow-alt font-size-14" />
                      </button>
                      <UncontrolledTooltip placement="top" target={`tooltip-view-detail-${item._id}`}>
                        View Detail
                      </UncontrolledTooltip>
                    
                    </>
                    
                  ) : (
                    <>
                      <button
                        className={`btn btn-sm ${item.schedule_status === "0" ? 'btn-soft-danger' : 'btn-soft-secondary'}`}
                        id={`tooltip-schedule-${item._id}`}
                      >
                        <Popconfirm
                          placement="leftBottom"
                          title={`Are you sure to ${item.schedule_status === "0" ? "Stop" : "Restart"}?`}
                          onConfirm={() => updateMasterInfo(item)}
                          style={{ width: '200px', marginLeft: '0px' }}
                        >
                          {item.schedule_status === "0" ? (
                            <>
                              <FaStop className="me-1" /> Stop
                            </>
                          ) : (
                            <>
                              <FaRedo className="me-1" /> Restart
                            </>
                          )}
                        </Popconfirm>
                      </button>
                      <UncontrolledTooltip placement="top" target={`tooltip-schedule-${item._id}`}>
                        {item.schedule_status === "0" ? "Stop" : "Restart"}
                      </UncontrolledTooltip>
                      <button
                        className="btn btn-sm btn-soft-primary"
                        id={`tooltip-change-end-date-${item._id}`}
                        onClick={() => {
                          console.log(item,'itmmmm')
                          setOpen(true)
                          setauditInfo(item)
                          setcomponent("end_date")
                        //   this.setState({ open: true, auditInfo: item, component: "end_date" });
                        }}
                      >
                        <i className="bx bx-calendar font-size-12" />
                      </button>
                      <UncontrolledTooltip placement="top" target={`tooltip-change-end-date-${item._id}`}>
                        Change Audit End Date
                      </UncontrolledTooltip>


                      <button
                        className="btn btn-sm btn-soft-primary d-flex align-items-center"
                        id={`tooltip-view-scheduled-shift-${item._id}`}
                        onClick={() => {
                          sessionStorage.setItem("adt_master_id", item._id);
                          setOpen(true)
                          setauditInfo(item)
                          setcomponent("shift_info")
                        }}
                      >
                        <i className="bx bx-edit font-size-14" />
                      </button>
                      <UncontrolledTooltip placement="top" target={`tooltip-view-scheduled-shift-${item._id}`}>
                        Edit Schedule
                      </UncontrolledTooltip>

                      <button
                        className="btn btn-sm btn-soft-primary"
                        id={`tooltip-view-scheduled-${item._id}`}
                        onClick={() => {
                          sessionStorage.setItem("adt_master_id", item._id);
                          history('/scheduled-audit');
                        }}
                      >
                        <i className="bx bx-right-arrow-alt font-size-12" />
                      </button>
                      <UncontrolledTooltip placement="top" target={`tooltip-view-scheduled-${item._id}`}>
                        View Scheduled Audit
                      </UncontrolledTooltip>

                    </>
                  )}
                </div>
              </>

            )
          },
        },
      ],[]);



    const filterStatus = (sort) => {
        var filteredData;

        if (sort == 'pub') {
            filteredData = _.filter(entitiesAuditData, { "publish_status": "2" })
        }
        else if (sort == 'non') {
            filteredData = _.filter(entitiesAuditData, { "publish_status": "0" })

        }
        else {
            filteredData = entitiesAuditData
        }

        setauditData(filteredData)
        setsearchFiles(filteredData)
        setdupsearchFiles(filteredData)
        settempSearchFiles(filteredData)
        setSort(sort)

    }



    if(dataloaded){
    return (
        <React.Fragment>
            <div className="page-content" >
                <MetaTags>
                    <title>Published Templates | AuditVista</title>
                </MetaTags>
                <Breadcrumbs title="Manage Audits" breadcrumbItem="Templates" />
                <Container fluid>
                    <Card>
                        <CardBody>
                            <TableContainer
                                columns={columns}
                                data={auditData}
                                isGlobalFilter={true}
                                isAddOptions={false}
                                isJobListGlobalFilter={false}
                                customPageSize={10}
                                style={{ width: '100%' }}
                                isPagination={true}
                                total_audit={totalAudit}
                                published_count={publishedCount}
                                non_published_count={nonpublishedCount}
                                filterStatus={(data) => filterStatus(data)}
                                sort={sort}
                                tableClass="align-middle table-nowrap table-check"
                                theadClass="table-light"
                                pagination="pagination pagination-rounded justify-content-end mb-2 my-2"
                                enableBtn={true}
                                // dynamicBtn={"Publish New Audit"}
                            />


                        </CardBody>
                    </Card>
                    <Offcanvas
                        isOpen={open}
                        toggle={() => setOpen(false)}
                        direction="end" // Position: 'start', 'end', 'top', or 'bottom'
                        style={{ width: '700px' }}
                    >
                        <OffcanvasHeader toggle={() => setOpen(false)}>
                            {open && component === "shift_info" ? `Audit Name: ${auditInfo?.template_name}` : 'Update'}
                        </OffcanvasHeader>
                        <OffcanvasBody>


                            {
                                open && component === "end_date" ?
                                    <UpdateDailyAuditInfo
                                        onClose={() => {
                                            setOpen(false)
                                            setcomponent("")
                                            // this.setState({ open: false, component: "", dataloaded: false }, () => {
                                            //     this.getAuditMasterTemplates()
                                            //     this.setState({
                                            //         dataloaded: true
                                            //     })
                                            // })
                                        }}
                                        // onClose={() => {this.getAuditMasterTemplates(); this.setState({ open: false, component: "" })}}
                                        auditInfo={auditInfo}
                                    />
                                    :
                                    open && component === "shift_info" ?
                                        <UpdateShiftInfo
                                            onClose={() => {
                                                setOpen(false)
                                                setcomponent("")
                                                // this.setState({ open: false, component: "", dataloaded: false }, () => {
                                                //     this.getAuditMasterTemplates()
                                                //     this.setState({
                                                //         dataloaded: true
                                                //     })
                                                // })
                                            }}
                                            auditInfo={auditInfo}
                                        />
                                        :
                                        null
                            }

                        </OffcanvasBody>
                    </Offcanvas>


                    <Offcanvas
              isOpen={configOpen}
              toggle={() => {
                setConfigOpen(false);
                setConfigItem(null);
              }}
              direction="end"
              style={{ width: '700px' }}
            >
              <OffcanvasHeader
                toggle={() => {
                  setConfigOpen(false);
                  setConfigItem(null);
                }}
              >
                {configItem?.template_name || "Configuration"}
              </OffcanvasHeader>

              <OffcanvasBody>
                <ConfigDetails
                  config={configItem}
                  onClose={() => {
                    setConfigOpen(false);
                    setConfigItem(null);
                  }}
                />
              </OffcanvasBody>
            </Offcanvas>
                </Container>

            </div>
        </React.Fragment>
    )
    }
    else{
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
              <div>Loading...</div>
              <Spinner color="primary" />
            </div>
          );
    }
}
export default ManagePublishedTemplate


// import React, { useEffect, useMemo, useState } from 'react'
// import { Container, Row, Col, Button, Card, CardBody, Modal, ModalHeader, ModalBody, UncontrolledDropdown, DropdownToggle, 
//     DropdownMenu, DropdownItem, UncontrolledTooltip, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner } from "reactstrap";
// import { AvForm, AvField } from "availity-reactstrap-validation"
// import "react-perfect-scrollbar/dist/css/styles.css";
// import "./manageAudit.css";
// import _ from 'lodash'
// import Breadcrumbs from  '../../../components/Common/Breadcrumb'
// import MetaTags from 'react-meta-tags';
// import { FaStop, FaRedo } from "react-icons/fa";
// import { Popconfirm } from 'antd';
// import urlSocket from 'helpers/urlSocket';
// import TableContainer from './Components/TableContainer';
// import "react-datepicker/dist/react-datepicker.css";
// import UpdateDailyAuditInfo from './Components/updateDailyAuditInfo';
// import UpdateShiftInfo from './Components/UpdateShiftInfo';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import { usePermissions } from 'hooks/usePermisson';

// const ManagePublishedTemplate = () => {

//     const [departmentId,setDepartmentId] = useState(null)
//     const [departmentName,setdepartmentName] = useState(null)
//     const [yearName,setyearName] = useState(null)
//     const [depName,setdepName] = useState("")
//     const [companyId,setcompanyId] = useState(null)
//     const [departmentArray,setdepartmentArray] = useState([])
//     const [userId,setuserId] = useState(null)
//     const [auditData,setauditData] = useState([])
//     const [errorData,seterrorData] = useState([])
//     const [yearData,setyearData] = useState([])
//     const [dataloaded,setdataloaded] = useState(false)
//     const [modal,setmodal] = useState(false)
//     const [isEdit,setisEdit] = useState(false)
//     const [entitiesAuditData,setentitiesAuditData] = useState([])
//     const [searchFiles,setsearchFiles] = useState([])
//     const [dupsearchFiles,setdupsearchFiles] = useState([])
//     const [currentPage,setcurrentPage] = useState(1)
//     const [totalItems,settotalItems] = useState(0)
//     const [tempSearchFiles,settempSearchFiles] = useState([])
//     const [selectedDate,setselectedDate] = useState(new Date())
//     const [open,setOpen] = useState(false)
//     const [auditInfo,setauditInfo] = useState(null)
//     const [dbInfo,setDbInfo] = useState(null)
//     const [userInfo,setuserInfo] = useState(null)
//     const [nonpublishedCount,setNonPublishedCount] = useState(null)
//     const [publishedCount,setpublishedCount] = useState(null)
//     const [totalAudit,settotalAudit] = useState(null)
//     const [navMode,setnavMode] = useState("")
//     const [selectedItem,setselectedItem] = useState(null)
//     const [component,setcomponent] = useState("")
//     const [sort,setSort] = useState("")
//     const history = useNavigate()
//     const {canEdit,canView} = usePermissions("mngpblhtempt")


//     useEffect(()=>{
//         var data = JSON.parse(sessionStorage.getItem("authUser"));
//         var db_info = JSON.parse(sessionStorage.getItem("db_info"));
//         var user_facilities = JSON.parse(sessionStorage.getItem("user_facilities"))
//         sessionStorage.removeItem("adt_master_id")
//         setuserInfo(data.user_data)
//         setDbInfo(db_info)
//         // getAuditMasterTemplates()

//     },[])

//     useEffect(() => {
//         if (dbInfo) {
//             getAuditMasterTemplates()
//         }

//     }, [dbInfo])


//     useEffect(()=>{
//         if(navMode){
//             navigateTo(selectedItem)
//         }

//     },[navMode])



//    const navigateTo = (data) => {
//         if (navMode == "0") //publish
//         {
//           sessionStorage.removeItem("publishData");
//           sessionStorage.setItem("publishData", JSON.stringify(data));
//           history("/pblhcfg")
//         }
//         else if (navMode == "1") {
//           sessionStorage.removeItem("EditPublishedData");
//           sessionStorage.setItem("EditPublishedData", JSON.stringify(data));
//           history("/edtpblhtempt");
//         }
//         else if (navMode == "3") {
//             sessionStorage.removeItem("publishData");
//             sessionStorage.removeItem("EditPublishedData");
//             sessionStorage.removeItem("publishedAuditData");
//             sessionStorage.setItem("publishedAuditData", JSON.stringify(data));
//             history("/hlvlpbdrpt");
//         }
//         else if (navMode == "4") {
//           sessionStorage.removeItem("publishData");
//           sessionStorage.removeItem("EditPublishedData");
//           sessionStorage.removeItem("publishedAuditData");
//           sessionStorage.setItem("publishedAuditData", JSON.stringify(data));
//           history("/adtaltclrprt");
//         }
//       }



//     const getAuditMasterTemplates=async()=>{
//       const authUser = JSON.parse(sessionStorage.getItem('authUser'))

//         try {
//             const response = await urlSocket.post("/webmngpbhtmplt/getpublishedtemplate",{
//                 userInfo: {
//                     encrypted_db_url: authUser.db_info.encrypted_db_url,
//                     company_id: userInfo.company_id,
//                     user_id: userInfo._id,
//                   },
//             })
//             console.log(response,'response')
//             var non_published_count = []
//             _.filter(response.data.data, e => {
//                 if (e.publish_status == "0") {
//                     non_published_count.push(e)
//                 }
//             })
//             var published_count = []
//             _.filter(response.data.data, e => {
//                 if (e.publish_status == "2") {
//                     published_count.push(e)
//                 }
//             })

//             setauditData(response.data.data)
//             setentitiesAuditData(response.data.data)
//             setdataloaded(true)
//             setNonPublishedCount(non_published_count.length)
//             setpublishedCount(published_count.length)
//             settotalAudit(response.data.data.length)
//             setsearchFiles(response.data.data)
//             setdupsearchFiles(response.data.data)
//             settempSearchFiles(response.data.data)
//         } catch (error) {
//                 console.log(error,'error');
//         }
//     }


//    const dateConvertion = (dateToConvert) => {
//         if (dateToConvert != null) {
//           var date = typeof (dateToConvert) == "object" ? String(dateToConvert.toISOString()) : String(dateToConvert)
//           var convertedDate = date.slice(8, 10) + ' / ' + (date.slice(5, 7)) + ' / ' + date.slice(0, 4);//prints expected format. 
//           if (convertedDate == "01 / 01 / 1970") {
//             return "-- / -- / --"
//           }
//           else {
//             return convertedDate
//           }
//         }
//         else {
//           return "-- / -- / --"
//         }
//       }


//      const updateMasterInfo = async (tempInfo) => {
//       const authUser = JSON.parse(sessionStorage.getItem('authUser'))
//         try {

//           const responseData = await urlSocket.post("/webmngpbhtmplt/update-master-info", {
//             status: tempInfo.schedule_status === "0" ? "1" : "0",
//             encrypted_db_url: authUser.db_info.encrypted_db_url,
//             _id: tempInfo._id,
//             repeat_mode_config : tempInfo.repeat_mode_config
//           })
//           console.log(responseData, 'responseData')
//           if (responseData.data.response_code === 500) {
//              getAuditMasterTemplates()
//           }
    
//         } catch (error) {
//           console.log(error, 'error')
//         }
//       }


//       const deleteInfo=(item)=>{
//         const authUser = JSON.parse(sessionStorage.getItem("authUser"))
//         Swal.fire({
//             icon: 'warning',
//             title: 'Are you sure?',
//             text: 'Do you want to delete this Audit?',
//             showCancelButton: true,
//             confirmButtonColor: '#2ba92b',
//             confirmButtonText: 'Yes',
//             cancelButtonColor: '#d33',
//             cancelButtonText: 'No'
//         }).then((result) => {
//             if(result.isConfirmed){
//               console.log(dbInfo,'dbInfo');
//                 try {
//                     urlSocket.post("webmngpbhtmplt/deletepublishedtemplate", {
//                       templateInfo: {
//                         template_id: item._id
//                       },
//                       userInfo: {
//                         encrypted_db_url: authUser.db_info.encrypted_db_url,
//                         company_id: authUser.user_data.company_id,
//                         created_by: authUser.user_data._id,
//                       },
//                     })
//                       .then(response => {
//                         if (response.data.response_code == 500) {
//                             setauditData(response.data.data)
//                             getAuditMasterTemplates()
//                         }
//                       })
//                   } catch (error) {
//                     console.log("catch error", error)
//                   }

//             }

//         })
//       }

//       const convertUTCtoIST=(utcDateString)=> {
//         const utcDate = new Date(utcDateString);
//         const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // 5 hours + 30 minutes in milliseconds
//         const istDate = new Date(utcDate.getTime() + istOffset);
//         const day = istDate.getUTCDate(); // Use `getUTCDate` to ensure no timezone shift
//         const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//         const month = monthNames[istDate.getUTCMonth()];
//         const year = istDate.getUTCFullYear().toString().slice(-2);
//         let hours = istDate.getUTCHours(); // Use `getUTCHours` after applying IST offset
//         const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
//         const period = hours >= 12 ? 'pm' : 'am';
//         hours = hours % 12 || 12;
      
//         return `${day}/${month}/${year} ${hours}:${minutes}${period}`;
//       }


//     const columns = useMemo(()=>[
//         {
//           accessor: 'template_name',
//           Header: 'Audit Name',
//           filterable: true,
//           width: "35%",
//           Cell: (cellProps) => {
//             var item = cellProps.row.original
//             return (
//               <>
//                 <div className="fw-bold font-size-12 text-wrap" >
//                   {item.template_name}
//                 </div>
//               </>
//             )
//           }
//         },
//         {
//           accessor: 'method_selected',
//           Header: 'Audit type',
//           filterable: true,
//           Cell: (cellProps) => {
//             var item = cellProps.row.original
//             return (
//               <>
//                 <span className={item.method_selected == "0" ? "badge badge-soft-secondary font-size-11 m-1" :
//                   item.method_selected == "1" ? "badge badge-soft-warning font-size-11 m-1" :
//                     item.method_selected == "2" ? "badge badge-soft-pink font-size-11 m-1" : "badge badge-soft-danger font-size-11 m-1"}
//                 >
//                   {item.method_selected === "0" ?"-" :item.method_selected ==="1" ? "Manual" : "Hierarchy"  }
//                 </span>
//               </>
//             )
//           }
//         },
//         {
//           accessor: 'total_checkpoints',
//           Header: 'Check points',
//           filterable: true,
//           Cell: (cellProps) => {
//             var item = cellProps.row.original
//             return (
//               <>
//                 <span
//                   className={`badge ${item.total_checkpoints === 0 ? "badge-soft-secondary" : "badge-soft-success"} font-size-11`}
//                   style={{ borderRadius: "50%", padding: "0.5em 0.75em", display: "inline-block", textAlign: "center" }}>
//                   {item.total_checkpoints}
//                 </span>
//               </>
//             )
//           }
//         },
      
//         {
//           accessor: 'created_on',
//           Header: 'Created on',
//           Cell: (cellProps) => {
//             var item = cellProps.row.original
//             return (
//               <>
//                 <div className="font-size-11 text-wrap">{dateConvertion(item.created_on)}</div>
//               </>
//             )
//           }
//         },
//         {
//           accessor: 'publish_status',
//           Header: 'Publish status',
//           Cell: (cellProps) => {
//             var item = cellProps.row.original
//             return (
//               <>
//                 <span className={item.publish_status == "0" ? "badge badge-soft-secondary font-size-11 m-1" :
//                   item.publish_status == "1" ? "badge badge-soft-warning font-size-11 m-1" :
//                     item.publish_status == "2" ? "badge badge-soft-success font-size-11 m-1" : "badge badge-soft-danger font-size-11 m-1"}
//                 >
//                   {item.publish_status == "0" ? "Not publish" : item.publish_status == "1" ? "Publish In progress" : item.publish_status == "2" ? "Published" : "Stopped"}
//                 </span>
//               </>
//             )
//           }
//         },
//         {
//           accessor: 'published_on',
//           Header: 'Published On / Time',
//           Cell: (cellProps) => {
//             var item = cellProps.row.original
//             return (
//               <>
//                 <div className="font-size-11 text-wrap">{item.published_on ? convertUTCtoIST(item.published_on):"-"}</div>
//               </>
//             )
//           }
//         },
//         {
//           accessor: 'next_job_on',
//           Header: 'Next Job On / Time',
//           Cell: (cellProps) => {
//             var item = cellProps.row.original
//             return (
//               <>
//                 <div className="font-size-11 text-wrap">{item.job?.next_job_on ? convertUTCtoIST(item.job?.next_job_on):"-"}</div>
//               </>
//             )
//           }
//         },
//         {
//           accessor: 'repeat_mode_config.mode',
//           Header: 'Schedule Type',
//           filterable: true,
//           Cell: (cellProps) => {
//             var item = cellProps.row.original
//             return (
//               <>
//                 <span className={item.repeat_mode_config.mode == "One time" ? "badge badge-soft-secondary font-size-11 m-1" : "badge badge-soft-info font-size-11 m-1"}>
//                   {item.repeat_mode_config.mode}
//                 </span>
//               </>
//             )
//           }
//         },
//         {
//           accessor: "menu",
//           disableFilters: true,
//           Header: "Edit / Modify / Reschedule Audit",
//           Cell: (cellProps) => {
//             var item = cellProps.row.original
//             return (
//               <>
//                 <div className="d-flex justify-content-start align-items-center gap-1" style={{ cursor: 'pointer' }}>
//                   {item.publish_status !== "1" && item.publish_status !== "2"? (
//                     <>
//                       <button
//                         className="btn btn-sm btn-soft-primary d-flex align-items-center"
//                         id={`tooltip-publish-${item._id}`}
//                         disabled={canEdit === false}
//                         onClick={() => {
//                             setselectedItem(item)
//                             setnavMode("0")
//                             // navigateTo(item)
//                         }}
//                       >
//                         <i className="mdi mdi-publish font-size-12 me-2" />Publish
//                       </button>
//                       <button
//                         className="btn btn-sm btn-soft-primary"
//                         id={`tooltip-edit-${item._id}`}
//                         disabled={canEdit === false}
//                         onClick={() => {
//                             setselectedItem(item)
//                             setnavMode("1")
//                         }}
//                       >
//                         <i className="bx bx-edit-alt font-size-12" />
//                       </button>
//                       <UncontrolledTooltip placement="top" target={`tooltip-edit-${item._id}`}>
//                         Edit
//                       </UncontrolledTooltip>

//                       <button
//                         className="btn btn-sm btn-soft-danger"
//                         id={`tooltip-delete-${item._id}`}
//                         disabled={canEdit === false}
//                         onClick={()=>{
//                             deleteInfo(item)
//                         }}
//                       >
//                         <i className="bx bx-trash font-size-12" />
//                       </button>
//                       <UncontrolledTooltip placement="top" target={`tooltip-delete-${item._id}`}>
//                         Delete
//                       </UncontrolledTooltip>
//                     </>
//                   ) : item.repeat_mode_config.mode_id === "0" ? (
//                     <>
//                      <button
//                         className={`btn btn-sm ${item.schedule_status === "0" ? 'btn-soft-danger' : 'btn-soft-secondary'}`}
//                         id={`tooltip-schedule-${item._id}`}
//                       >
//                         <Popconfirm
//                           placement="leftBottom"
//                           title={`Are you sure to ${item.schedule_status === "0" ? "Stop" : "Restart"}?`}
//                           onConfirm={() => updateMasterInfo(item)}
//                           style={{ width: '200px', marginLeft: '0px' }}
//                         >
//                           {item.schedule_status === "0" ? (
//                             <>
//                               <FaStop className="me-1" /> Stop
//                             </>
//                           ) : (
//                             <>
//                               <FaRedo className="me-1" /> Restart
//                             </>
//                           )}
//                         </Popconfirm>
//                       </button>
//                       <UncontrolledTooltip placement="top" target={`tooltip-schedule-${item._id}`}>
//                         {item.schedule_status === "0" ? "Stop" : "Restart"}
//                       </UncontrolledTooltip>
//                       <button
//                         className="btn btn-sm btn-soft-primary d-flex align-items-center"
//                         id={`tooltip-view-report-${item._id}`}
//                         onClick={() => {
//                             setselectedItem(item)
//                             setnavMode("4")
//                         }}
//                       >
//                          View Report
//                       </button>
//                       <button
//                         className="btn btn-sm btn-soft-primary d-flex align-items-center"
//                         id={`tooltip-view-detail-${item._id}`}
//                         onClick={() => {
//                             setselectedItem(item)
//                             setnavMode("3")
//                             // sessionStorage.setItem("publishedAuditData", {
//                             //   _id : item._id,
//                             //   repeat_mode_config : item.repeat_mode_config,

//                             // });
//                         }}
//                       >
//                         <i className="bx bx-right-arrow-alt font-size-14" />
//                       </button>
//                       <UncontrolledTooltip placement="top" target={`tooltip-view-detail-${item._id}`}>
//                         View Detail
//                       </UncontrolledTooltip>
//                     </>
//                   ) : (
//                     <>
//                       <button
//                         className={`btn btn-sm ${item.schedule_status === "0" ? 'btn-soft-danger' : 'btn-soft-secondary'}`}
//                         id={`tooltip-schedule-${item._id}`}
//                       >
//                         <Popconfirm
//                           placement="leftBottom"
//                           title={`Are you sure to ${item.schedule_status === "0" ? "Stop" : "Restart"}?`}
//                           onConfirm={() => updateMasterInfo(item)}
//                           style={{ width: '200px', marginLeft: '0px' }}
//                         >
//                           {item.schedule_status === "0" ? (
//                             <>
//                               <FaStop className="me-1" /> Stop
//                             </>
//                           ) : (
//                             <>
//                               <FaRedo className="me-1" /> Restart
//                             </>
//                           )}
//                         </Popconfirm>
//                       </button>
//                       <UncontrolledTooltip placement="top" target={`tooltip-schedule-${item._id}`}>
//                         {item.schedule_status === "0" ? "Stop" : "Restart"}
//                       </UncontrolledTooltip>


//                       <button
//                         className="btn btn-sm btn-soft-primary"
//                         id={`tooltip-change-end-date-${item._id}`}
//                         onClick={() => {
//                           console.log(item,'itmmmm')
//                           setOpen(true)
//                           setauditInfo(item)
//                           setcomponent("end_date")
//                         //   this.setState({ open: true, auditInfo: item, component: "end_date" });
//                         }}
//                       >
//                         <i className="bx bx-calendar font-size-12" />
//                       </button>
//                       <UncontrolledTooltip placement="top" target={`tooltip-change-end-date-${item._id}`}>
//                         Change Audit End Date
//                       </UncontrolledTooltip>


//                       <button
//                         className="btn btn-sm btn-soft-primary d-flex align-items-center"
//                         id={`tooltip-view-scheduled-shift-${item._id}`}
//                         onClick={() => {
//                           sessionStorage.setItem("adt_master_id", item._id);
//                           setOpen(true)
//                           setauditInfo(item)
//                           setcomponent("shift_info")
//                         }}
//                       >
//                         <i className="bx bx-edit font-size-14" />
//                       </button>
//                       <UncontrolledTooltip placement="top" target={`tooltip-view-scheduled-shift-${item._id}`}>
//                         Edit Schedule
//                       </UncontrolledTooltip>

//                       <button
//                         className="btn btn-sm btn-soft-primary"
//                         id={`tooltip-view-scheduled-${item._id}`}
//                         onClick={() => {
//                           sessionStorage.setItem("adt_master_id", item._id);
//                           history('/scheduled-audit');
//                         }}
//                       >
//                         <i className="bx bx-right-arrow-alt font-size-12" />
//                       </button>
//                       <UncontrolledTooltip placement="top" target={`tooltip-view-scheduled-${item._id}`}>
//                         View Scheduled Audit
//                       </UncontrolledTooltip>

//                     </>
//                   )}
//                 </div>
//               </>

//             )
//           },
//         },
//       ],[]);



//     const filterStatus = (sort) => {
//         var filteredData;

//         if (sort == 'pub') {
//             filteredData = _.filter(entitiesAuditData, { "publish_status": "2" })
//         }
//         else if (sort == 'non') {
//             filteredData = _.filter(entitiesAuditData, { "publish_status": "0" })

//         }
//         else {
//             filteredData = entitiesAuditData
//         }

//         setauditData(filteredData)
//         setsearchFiles(filteredData)
//         setdupsearchFiles(filteredData)
//         settempSearchFiles(filteredData)
//         setSort(sort)

//     }



//     if(dataloaded){
//     return (
//         <React.Fragment>
//             <div className="page-content" >
//                 <MetaTags>
//                     <title>Published Templates | AuditVista</title>
//                 </MetaTags>
//                 <Breadcrumbs title="Manage Audits" breadcrumbItem="Templates" />
//                 <Container fluid>
//                     <Card>
//                         <CardBody>
//                             <TableContainer
//                                 columns={columns}
//                                 data={auditData}
//                                 isGlobalFilter={true}
//                                 isAddOptions={false}
//                                 isJobListGlobalFilter={false}
//                                 customPageSize={10}
//                                 style={{ width: '100%' }}
//                                 isPagination={true}
//                                 total_audit={totalAudit}
//                                 published_count={publishedCount}
//                                 non_published_count={nonpublishedCount}
//                                 filterStatus={(data) => filterStatus(data)}
//                                 sort={sort}
//                                 tableClass="align-middle table-nowrap table-check"
//                                 theadClass="table-light"
//                                 pagination="pagination pagination-rounded justify-content-end mb-2 my-2"
//                                 enableBtn={true}
//                                 // dynamicBtn={"Publish New Audit"}
//                             />


//                         </CardBody>
//                     </Card>
//                     <Offcanvas
//                         isOpen={open}
//                         toggle={() => setOpen(false)}
//                         direction="end" // Position: 'start', 'end', 'top', or 'bottom'
//                         style={{ width: '700px' }}
//                     >
//                         <OffcanvasHeader toggle={() => setOpen(false)}>
//                             {open && component === "shift_info" ? `Audit Name: ${auditInfo?.template_name}` : 'Update'}
//                         </OffcanvasHeader>
//                         <OffcanvasBody>


//                             {
//                                 open && component === "end_date" ?
//                                     <UpdateDailyAuditInfo
//                                         onClose={() => {
//                                             setOpen(false)
//                                             setcomponent("")
//                                                getAuditMasterTemplates()
//                                         }}
//                                         // onClose={() => {this.getAuditMasterTemplates(); this.setState({ open: false, component: "" })}}
//                                         auditInfo={auditInfo}
//                                     />
//                                     :
//                                     open && component === "shift_info" ?
//                                         <UpdateShiftInfo
//                                             onClose={() => {
//                                                 setOpen(false)
//                                                 setcomponent("")
//                                                 // this.setState({ open: false, component: "", dataloaded: false }, () => {
//                                                 //     this.getAuditMasterTemplates()
//                                                 //     this.setState({
//                                                 //         dataloaded: true
//                                                 //     })
//                                                 // })
//                                             }}
//                                             auditInfo={auditInfo}
//                                         />
//                                         :
//                                         null
//                             }

//                         </OffcanvasBody>
//                     </Offcanvas>
//                 </Container>

//             </div>
//         </React.Fragment>
//     )
//     }
//     else{
//         return (
//             <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
//               <div>Loading...</div>
//               <Spinner color="primary" />
//             </div>
//           );
//     }
// }
// export default ManagePublishedTemplate
