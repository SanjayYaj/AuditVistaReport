import React, { useEffect,useState } from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, Card, CardBody, CardTitle, ListGroup, ListGroupItem,CardFooter, Offcanvas, OffcanvasBody,OffcanvasHeader } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import _ from 'lodash'
import { getCurrentOrNextShift,isCurrentDate,getCurrentIndianTimeDup,getSpecificDayDateFrom,getFirstDateOfMonth,getNthDateOfCurrentMonth,getQuarterForDate } from '../Functions/scheduleFunction'
import Swal from 'sweetalert2'
import urlSocket from 'helpers/urlSocket'
import {updatepublishedTempData,updateHierarchyData,setHierarchyData,toolMasterApiList } from '../../../../toolkitStore/Auditvista/ManageAuditSlice'
import { useDispatch } from 'react-redux'
import LocationSelectedUsers from './LocationSelectedUsers'

const ConfirmPublish = (props) => {
    const manageAuditSlice = useSelector(state => state.manageAuditSlice)
    const dispatch = useDispatch()
    console.log(manageAuditSlice, 'manageAuditSlice')
    const hierarchyData = manageAuditSlice.hierarchyData
    const publishTemplate = manageAuditSlice.publishTemplate
    const navigate = useNavigate()
    const [fromDate, setfromDate] = useState('');
    const [openTaskUsers, setopenTaskUsers] = useState(false);
    const [toolData, settoolData] = useState([]);


    useEffect(() => {
        console.log('sss')
        if (publishTemplate.repeat_mode_config.mode_id !== "0") {
            var today = new Date()
            const dd = today.getDate().toString().length == 1 ? "0" + today.getDate().toString() : today.getDate().toString()
            const mm = String(today.getMonth() + 1).length == 1 ? "0" + String(today.getMonth() + 1) : today.getMonth() + 1
            const yyyy = today.getFullYear()
            const fromate_date = (today = yyyy + "-" + mm + "-" + dd)
            setfromDate(fromate_date)
        }
        retriveToolList()

    }, [])

    const retriveToolList=async()=>{

        try {
            const publishTempInfo = _.cloneDeep(publishTemplate)
            const responseData = await dispatch(toolMasterApiList())
            if(responseData){
                console.log(responseData,'responseData');
                if(responseData.data.data.length >0){
                    const permissionsMap = {};
                    publishTempInfo.adt_permissons.forEach(ele => {
                      permissionsMap[ele.func_id] = {
                        allow_assgn_task_users: ele.allow_assgn_task_users,
                        allow_set_target_date: ele.allow_set_target_date,
                        create_acplan: ele.create_acplan,
                        modify_acplan: ele.create_acplan ? ele.create_acplan : ele.modify_acplan,
                      };
                    });
                    
                    const updatedToolData = responseData.data.data.map(item => {
                      const perms = permissionsMap[item.func_id];
                      if (perms) {
                        return { ...item, ...perms }; 
                      }
                      return item;
                    });
                    console.log(updatedToolData,'updatedToolData');
                    settoolData(updatedToolData);
                    
                }

            }
            
        } catch (error) {
            
        }

    }


    const navigateTo = (publishTemplateInfo) => {
        sessionStorage.setItem("EditPublishedData", JSON.stringify(publishTemplateInfo));
        navigate("/edtpblhtempt");
    }

    const ccLevelValidation = async (publishTempInfo) => {

        if (publishTempInfo.repeat_mode_config.mode_id !== "0" && (publishTempInfo.audit_start_date !== null && publishTempInfo.audit_end_date !== null)) {
            publishTempInfo["cc_level"] = 5
        }
        else {
            publishTempInfo["cc_level"] = 4

        }
        return publishTempInfo

    }

    const handleUpdate=(publishTempInfo,dynamic_key,event)=>{
        console.log(event.target.checked,'event',dynamic_key)
        publishTempInfo["settings"][dynamic_key]=!event.target.checked
        console.log(publishTempInfo,'publishTempInfo')
        props.updateTempMasterInfo(publishTempInfo)
      
      }


     const onChangeStartDate=async(event)=>{
    
        const publishTempInfo = _.cloneDeep(publishTemplate)
        publishTempInfo["audit_start_date"] = event.target.value
        var updatedData = await ccLevelValidation(publishTempInfo)
        props.updateTempMasterInfo(updatedData)
      }


      const publishAudit=async()=>{
        var publishTemplateInfo = _.cloneDeep(publishTemplate)
        var hierarchyDataInfo = _.cloneDeep(hierarchyData)
        hierarchyDataInfo["endpoints"]=_.filter(hierarchyDataInfo.endpoints, endpoint => !endpoint.disabled);
        if(publishTemplateInfo.repeat_mode_config.mode_id === "1"){
            var timeString;
            var timeStringEnd
            var next_job_on
    
            var nextShift = await getCurrentOrNextShift(publishTemplateInfo.repeat_mode_config.scheduled_shift)
            console.log(nextShift, 'nextShift')
            const isToday = isCurrentDate(new Date(publishTemplateInfo.audit_start_date));
            if (isToday) {
              if (nextShift.shift !== null) {
                timeString = nextShift.shift.start;
                timeStringEnd = nextShift.shift.end;
                const [hours, minutes] = timeString.split(":").map(Number);
                const [hoursEnd, minutesEnd] = timeStringEnd.split(":").map(Number);
                var start_job_on = await getCurrentIndianTimeDup(publishTemplateInfo.audit_start_date, hours, minutes);
                const isDateCompleted = new Date() >= new Date(start_job_on);
                var end_job_on = await getCurrentIndianTimeDup(publishTemplateInfo.audit_start_date, hoursEnd, minutesEnd);
                const endDatecompleted = new Date() >= new Date(end_job_on);
                if (endDatecompleted) {
                  start_job_on = await getCurrentIndianTimeDup(publishTemplateInfo.audit_start_date, hours, minutes, false);
                }
                end_job_on = await getCurrentIndianTimeDup(publishTemplateInfo.audit_start_date, hoursEnd, minutesEnd, endDatecompleted);
                console.log(isDateCompleted, endDatecompleted, 'endDatecompleted', start_job_on, publishTemplateInfo.audit_start_date, new Date(publishTemplateInfo.audit_start_date))
                next_job_on = start_job_on
              }
              else {
                timeString = publishTemplateInfo.repeat_mode_config.scheduled_shift[0].start;
                timeStringEnd = publishTemplateInfo.repeat_mode_config.scheduled_shift[0].end;
                const [hours, minutes] = timeString.split(":").map(Number);
                const [hoursEnd, minutesEnd] = timeStringEnd.split(":").map(Number);
                var start_job_on = await getCurrentIndianTimeDup(publishTemplateInfo.audit_start_date, hours, minutes);
                const isDateCompleted = new Date() >= new Date(start_job_on);
                var end_job_on = await getCurrentIndianTimeDup(publishTemplateInfo.audit_start_date, hoursEnd, minutesEnd);
                const endDatecompleted = new Date() >= new Date(end_job_on);
                if (endDatecompleted) {
                  start_job_on = await getCurrentIndianTimeDup(publishTemplateInfo.audit_start_date, hours, minutes, false);
                }
                end_job_on = await getCurrentIndianTimeDup(publishTemplateInfo.audit_start_date, hoursEnd, minutesEnd, endDatecompleted);
                console.log(isDateCompleted, endDatecompleted, 'endDatecompleted')
                next_job_on = start_job_on
              }
            }
            else {
              timeString = publishTemplateInfo.repeat_mode_config.scheduled_shift[0].start;
              timeStringEnd = publishTemplateInfo.repeat_mode_config.scheduled_shift[0].end;
              const [hours, minutes] = timeString.split(":").map(Number);
              const [hoursEnd, minutesEnd] = timeStringEnd.split(":").map(Number);
              var start_job_on = await getCurrentIndianTimeDup(publishTemplateInfo.audit_start_date, hours, minutes);
              const isDateCompleted = new Date() >= new Date(start_job_on);
              var end_job_on = await getCurrentIndianTimeDup(publishTemplateInfo.audit_start_date, hoursEnd, minutesEnd);
              const endDatecompleted = new Date() >= new Date(end_job_on);
              if (endDatecompleted) {
                start_job_on = await getCurrentIndianTimeDup(publishTemplateInfo.audit_start_date, hours, minutes, false);
              }
              end_job_on = await getCurrentIndianTimeDup(publishTemplateInfo.audit_start_date, hoursEnd, minutesEnd, endDatecompleted);
              console.log(isDateCompleted, endDatecompleted, 'endDatecompleted')
              next_job_on = start_job_on
    
            }
            // const timeString = publishTemplate.repeat_mode_config.scheduled_shift[0].start;
            var shifts = publishTemplateInfo.repeat_mode_config.scheduled_shift
            shifts.sort((a, b) => {
              const startA = timeToMinutes(a.start);
              const startB = timeToMinutes(b.start);
    
              if (startA === startB) {
                return timeToMinutes(a.end) - timeToMinutes(b.end);
              }
              return startA - startB;
            });
    
            publishTemplateInfo.repeat_mode_config.scheduled_shift = shifts
            publishTemplateInfo["job"]["next_job_on"] = next_job_on
        }
        else if(publishTemplate.repeat_mode_config.mode_id === "0"){
            publishTemplateInfo["job"]["next_job_on"] = new Date(publishTemplateInfo["audit_start_date"]).toISOString();
        }
        else if (publishTemplateInfo.repeat_mode_config.mode_id === "2") {
            const getDate =await getSpecificDayDateFrom(publishTemplateInfo.repeat_mode_config.scheduled_shift[0]["day"], publishTemplateInfo["audit_start_date"]);
            console.log(new Date(getDate), 'getDate')
            const utcOffsetMinutes = 5 * 60 + 30; // 5 hours 30 minutes
            const date = new Date(getDate);
            const adjustedDate = new Date(date.getTime() - utcOffsetMinutes * 60 * 1000);
            console.log(adjustedDate.toISOString(), 'adjustedDate')
            publishTemplateInfo["job"]["next_job_on"] = adjustedDate.toISOString();

        }
        else if(publishTemplateInfo.repeat_mode_config.mode_id === "3"){
            if(publishTemplateInfo.repeat_mode_config.schedule_type === "quaterly"){
              var monthstartInfo = await getQuarterForDate(publishTemplateInfo.audit_start_date,publishTemplateInfo.repeat_mode_config.scheduled_shift)
              console.log("calculate next job on",monthstartInfo,await getFirstDateOfMonth(monthstartInfo))
              publishTemplateInfo["job"]["next_job_on"] =await getFirstDateOfMonth(monthstartInfo)
    
            }
            else{
                publishTemplateInfo["job"]["next_job_on"] =await getNthDateOfCurrentMonth(publishTemplateInfo.repeat_mode_config.scheduled_shift[0]["dateInfo"]["startDate"])
            }
    
          }
          console.log(publishTemplateInfo,'publishTemplateInfo')


          Swal.fire({
            icon: 'question',
            title: 'Are you sure?',
            text: 'Do you want to publish this Audit ?',
            showCancelButton: true,
            confirmButtonColor: '#34c38f',
            confirmButtonText: 'Yes',
            cancelButtonColor: '#f46a6a',
            cancelButtonText: 'No',
            customClass: {
              icon: 'swal-icon-small', // Apply a custom class to the icon
          },
          }).then(async(result) => {
            if(result.isConfirmed){
                console.log(publishTemplateInfo,'publishTemplateInfo',hierarchyDataInfo);
                publishTemplateInfo["publish_status"]="2"
                await dispatch(updatepublishedTempData(publishTemplateInfo))
                const responseData = await dispatch(updateHierarchyData(hierarchyDataInfo));
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Your request has been processed successfully.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/mngpblhtempt")
                    }
                })
                // publishAuditApi(publishTemplateInfo)

            }
          })        
      }

    const publishAuditApi = async(publishTemplateInfo) => {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        try {
            const responseData =await urlSocket.post("webphlbprcs/publish-audit-master",{
                userInfo: {
                    encrypted_db_url: authUser.db_info.encrypted_db_url,
                },
                    publishedTemplate: publishTemplateInfo,
            })
            console.log(responseData,'responseData')
            if(responseData.data.response_code === 500){
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Your request has been processed successfully.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if(result.isConfirmed){
                        navigate("/mngpblhtempt")
                    }
                  })
            }
        } catch (error) {

        }
    }


 const timeToMinutes=(time)=> {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }







    const updateTempSettings=async(name,event)=>{
        const publishTemplateInfo = _.cloneDeep(publishTemplate)
        const hierarchyDataInfo = _.cloneDeep(hierarchyData)
        publishTemplateInfo["settings"][name]=event.target.checked
        
        var audit_type = name === "allow_adt_task" ? "1" : name === "allow_review_task" ?"2" :"3"
        // var 

        hierarchyDataInfo.usr_selected.map((item,idx)=>{
            if(item.audit_type === audit_type){
                item["enable_ac_plan"] =event.target.checked
            }
        })

        console.log(publishTemplateInfo,'publishTemplateInfo',hierarchyDataInfo)
        await dispatch(updatepublishedTempData(publishTemplateInfo))
        const responseData = await dispatch(updateHierarchyData(hierarchyDataInfo))
        if (responseData.status === 200) {
            dispatch(setHierarchyData(responseData.data.hData[0]))
        }

    }


    const onDrawerClose = async () => {
        setopenTaskUsers(false)
      }

    const handleCheckTool=async(event,idx)=>{
        console.log(event.target.name,'handleCheckTool',event.target.checked);
        const toolInfo = _.cloneDeep(toolData)
        const publishTempInfo = _.cloneDeep(publishTemplate)
        toolInfo[idx][event.target.name] = !event.target.checked
        if(event.target.name ==="create_acplan" && toolInfo[idx][event.target.name] === false){
            toolInfo[idx]["modify_acplan"] =false
        }
        else if(event.target.name ==="allow_set_target_date" && toolInfo[idx][event.target.name] === false){
            toolInfo[idx]["allow_assgn_task_users"] =false
        }
        publishTempInfo["adt_permissons"] = toolInfo
        await dispatch(updatepublishedTempData(publishTempInfo))
        settoolData(toolInfo)

    }

    const handleToolData=async(type,name,event)=>{
        const hierarchyDataInfo = _.cloneDeep(manageAuditSlice.hierarchyData)
        hierarchyDataInfo.usr_selected.map((ele,idx)=>{
            if(ele.audit_type === type){
                ele[name] = !event.target.checked
            }
        })
        const responseData = await dispatch(updateHierarchyData(hierarchyDataInfo))
        console.log(responseData,'responseData');
        if (responseData.status === 200) {
            dispatch(setHierarchyData(responseData.data.hData[0]))
        }
        
    }




    return (
        <>
            <Row className="g-4">
                <Col lg={6} md={12}>
                    <Card className="h-100" style={{ border: '1px solid #e9e9e9' }}>
                        <CardBody className="pb-1">
                            <div className="d-flex justify-content-between align-items-center">
                                <CardTitle className="text-lg font-bold mb-0">Hierarchy Level</CardTitle>
                                <button className="btn btn-sm btn-soft-primary d-flex align-items-center" onClick={() => { props.toggleTab(1) }}>
                                    <i className="bx bx-edit me-1" />
                                    Edit
                                </button>
                            </div>

                            <ListGroup flush className="border rounded shadow-sm">
                                <ListGroupItem className="d-flex align-items-center justify-content-between text-muted">
                                    <div>
                                        <i className="mdi mdi-circle-medium me-2"></i>
                                        Hierarchy Informations
                                    </div>
                                    <span className="text-success">{hierarchyData?.hlevel}</span>
                                </ListGroupItem>
                                <ListGroupItem className="d-flex align-items-center justify-content-between text-muted">
                                    <div>
                                        <i className="mdi mdi-circle-medium me-2"></i>
                                        No. of Endpoints Selected
                                    </div>
                                    <span className="text-success">{hierarchyData?.endpoints.length}</span>
                                </ListGroupItem>
                            </ListGroup>

                        </CardBody>
                    </Card>
                </Col>
                <Col lg={6} md={12}>
                    <Card className="h-100" style={{ border: '1px solid #e9e9e9' }}>
                        <CardBody className="pb-1">
                            <div className="d-flex justify-content-between align-items-center">
                                <CardTitle className="text-lg font-bold mb-0">Checkpoints</CardTitle>
                                <button className="btn btn-sm btn-soft-primary d-flex align-items-center"
                                    onClick={() => { navigateTo(publishTemplate) }}
                                >
                                    <i className="bx bx-edit me-1" />
                                    Edit
                                </button>
                            </div>

                            <ListGroup flush className="border rounded shadow-sm">
                                <ListGroupItem className="d-flex align-items-center justify-content-between text-muted">
                                    <div>
                                        <i className="mdi mdi-circle-medium me-2"></i>
                                        No of check points
                                    </div>
                                    <span className="text-success">{publishTemplate.total_checkpoints}</span>
                                </ListGroupItem>

                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className="g-4 mt-2">
               {publishTemplate.repeat_mode_config.mode_id !== "0" &&
                    <Col lg={6} md={12}>
                        <Card className="h-100" style={{ border: '1px solid #e9e9e9' }}>
                            <CardBody className="pb-1">
                                <div className="d-flex justify-content-between align-items-center">
                                    <CardTitle className="text-lg font-bold mb-0">Configuration</CardTitle>
                                    <button className="btn btn-sm btn-soft-primary d-flex align-items-center" onClick={() => { props.toggleTab(3) }}>
                                        <i className="bx bx-edit me-1" />
                                        Edit
                                    </button>
                                </div>
                                <ListGroup flush className="border rounded shadow-sm">
                                    <ListGroupItem className="d-flex align-items-center text-muted">
                                        <div className="col-md-6">
                                            <div className="fw-bold mb-2">
                                                <i className="mdi mdi-circle-medium me-1"></i>Audit Starts on :<span className="text-danger">*</span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <div className="d-flex align-items-center">
                                                    <input
                                                        className="form-control"
                                                        type="date"
                                                        id="start_date"
                                                        min={fromDate}
                                                        value={publishTemplate.audit_start_date || ""}
                                                        onChange={(e) => onChangeStartDate(e)}
                                                        onKeyDown={(e) => e.preventDefault()}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="d-flex align-items-center text-muted">
                                        <div className="col-md-6">
                                            <div className="fw-bold mb-2">
                                                <i className="mdi mdi-circle-medium me-1"></i>Audit End on :<span className="text-danger">*</span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <div className="d-flex align-items-center">
                                                    <input
                                                        className="form-control"
                                                        type="date"
                                                        id="end_date"
                                                        value={publishTemplate.audit_end_date || ""}
                                                        onChange={async (e) => {
                                                            const publishTempInfo = _.cloneDeep(publishTemplate)
                                                            publishTempInfo["audit_end_date"] = e.target.value
                                                            var updatedData = await ccLevelValidation(publishTempInfo)
                                                            props.updateTempMasterInfo(updatedData)
                                                        }}
                                                        onKeyDown={(e) => e.preventDefault()}
                                                        disabled={!publishTemplate.audit_start_date}
                                                        min={publishTemplate.audit_start_date}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </ListGroupItem>
                                </ListGroup>

                            </CardBody>
                        </Card>
                    </Col>
                }

            
            </Row>

            {
                openTaskUsers &&
                <Offcanvas
                    isOpen={openTaskUsers}
                    toggle={onDrawerClose}
                    direction="end" // 'end' for right side, use 'start' for left
                    style={{ width: '1000px', zIndex: 9999 }}
                >
                    <OffcanvasHeader toggle={onDrawerClose}>
                        <span>Location Users</span>
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        <LocationSelectedUsers
                          onDrawerClose={onDrawerClose}
                        />
                    </OffcanvasBody>
                </Offcanvas>
            }



            <CardFooter className="d-flex align-items-center justify-content-end gap-2 mt-2">
                <div className="d-flex align-items-center justify-content-end gap-2">
                    <button className='btn btn-primary mx-2'
                        style={{ borderRadius: "30px", padding: "0.375rem 1rem", minWidth: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onClick={() => { navigate("/mngpblhtempt") }} > Save </button>
                    <button className='btn btn-success' disabled={
                       publishTemplate.settings.enable_review ? publishTemplate.cc_level <= 3 : publishTemplate.cc_level <= 2
                    }
                        style={{ borderRadius: "30px", padding: "0.375rem 1rem", minWidth: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onClick={() =>publishAudit()}> Save and Publish</button>
                </div>
            </CardFooter>

        </>
    )
}
export default ConfirmPublish
