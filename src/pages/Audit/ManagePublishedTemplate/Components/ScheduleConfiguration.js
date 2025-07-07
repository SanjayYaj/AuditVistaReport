import React, { useEffect, useState,useMemo } from 'react'
import { Label, Card, CardBody, FormGroup, Input,Row,Col,Button,CardTitle,CardSubtitle,ListGroup,ListGroupItem,Offcanvas,OffcanvasBody,OffcanvasHeader } from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
var moment = require('moment')
import TableContainer from 'common/TableContainer'
import { Popconfirm } from 'antd';
import Swal from 'sweetalert2'
import Calendar from './Calendar28days'
import { setReviewSchedule,toolMasterApiList,updatepublishedTempData,retriveTempAuditInfo,updateHierarchyData,setHierarchyData, updateSelecteduser } from 'toolkitStore/Auditvista/ManageAuditSlice'
import LocationSelectedUsers from './LocationSelectedUsers'

const ScheduleConfiguration = (props) => {
  const [selectedRepeatMode, setselectedRepeatMode] = useState("choose")
  const [timeInfo, settimeInfo] = useState({})
  const manageAuditSlice = useSelector(state => state.manageAuditSlice)
  const publishTemplate = manageAuditSlice.publishTemplate
  const [dataLoaded,setdataLoaded] = useState(true)
  const [shiftCount,setshiftCount]= useState(null)
  const [configData,setConfigData] = useState(JSON.parse(sessionStorage.getItem("authUser")).config_data)
  const [selectedInterval,setSelectedInterval] = useState("#")
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fromDate, setfromDate] = useState('');
  const [toolData, settoolData] = useState([]);
  const dispatch = useDispatch()
  const [openTaskUsers, setopenTaskUsers] = useState(false);
  console.log(manageAuditSlice,'manageAuditSlice')

  useEffect(() => {
    console.log("schedulee", props)
    if (publishTemplate.repeat_mode_config?.shift_count) {
      setshiftCount(publishTemplate.repeat_mode_config.shift_count)
    }
    if(publishTemplate.repeat_mode_config?.interval){
      setSelectedInterval(publishTemplate.repeat_mode_config.interval)
    }
  
    var today = new Date()
    const dd = today.getDate().toString().length == 1 ? "0" + today.getDate().toString() : today.getDate().toString()
    const mm = String(today.getMonth() + 1).length == 1 ? "0" + String(today.getMonth() + 1) : today.getMonth() + 1
    const yyyy = today.getFullYear()
    const fromate_date = (today = yyyy + "-" + mm + "-" + dd)
    async function validate() {
      const updatedPublishedTemp = await ccLevelValidation(_.cloneDeep(publishTemplate))
      props.updateTempMasterInfo(updatedPublishedTemp)
    }
    validate()
    updateSelectedUsers()
    setfromDate(fromate_date)
    setStartDate(publishTemplate["audit_start_date"])
    setEndDate(publishTemplate["audit_end_date"])
  }, [])

  const updateSelectedUsers = async () => {
    const hierarchyDataInfo = _.cloneDeep(manageAuditSlice.hierarchyData)
    console.log(hierarchyDataInfo, 'hierarchyDataInfo');
    const uniqueUsers = Array.from(
      new Map(
        hierarchyDataInfo.endpoints[0].adt_users.map(user => [user.user_id, user])
      ).values()
    );
    console.log(uniqueUsers, 'uniqueUsers')
    uniqueUsers.map((ele, idx) => {
      var findIdx = _.findIndex(hierarchyDataInfo.usr_selected, { user_id: ele.user_id })
      console.log(findIdx,'findIdx');
      if (findIdx == -1) {
        ele["create_acplan"]=false
        ele["allow_set_target_date"]=false
        ele["allow_assgn_task_users"]=false
        ele["modify_acplan"]=false
        hierarchyDataInfo.usr_selected.push(ele)
      }
    })
    console.log(hierarchyDataInfo, 'hierarchyDataInfo');
    const responseData = await dispatch(updateHierarchyData(hierarchyDataInfo))
    const retriveTempInfo = await dispatch(retriveTempAuditInfo(publishTemplate))

    if (responseData.status === 200) {
      dispatch(setHierarchyData(responseData.data.hData[0]))
     retriveToolList(hierarchyDataInfo)

    }


  }



    const retriveToolList=async(hierarchyDataInfo)=>{
  
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
                      const toolIds = _.map(hierarchyDataInfo.usr_selected,"audit_type")
                      var dataInfo =[]
                      updatedToolData.map((ele,pos)=>{
                        if(toolIds.includes( ele.func_id)){
                          dataInfo.push(ele)
                        }
                      })
                      console.log(updatedToolData,dataInfo,'updatedToolData',manageAuditSlice.hierarchyData);
                      publishTempInfo["adt_permissons"]=dataInfo
                      dispatch(updatepublishedTempData(publishTempInfo))
                      settoolData(dataInfo);
                    var event = {
                      target: {
                        checked: false
                      }
                    }
                    var findIdx = _.findIndex(dataInfo,{func_id :"3"})
                    console.log(findIdx,'findIdx',dataInfo);
                    if(findIdx !==-1){
                      var eventInfo = {
                        target:{
                          name : "allow_set_target_date",
                          checked : false
                        }
                      }
                       await handleCheckTool(eventInfo, findIdx,dataInfo);
                       await handleToolData("3", "allow_set_target_date", event,hierarchyDataInfo)
                       eventInfo["target"]["name"]="allow_assgn_task_users"
                        await handleCheckTool(eventInfo, findIdx,dataInfo);
                       await handleToolData("3", "allow_assgn_task_users", event,hierarchyDataInfo)

                    }

                    // await handleToolData("3", "allow_set_target_date", event)
                    // await handleCheckTool()
                    // await handleToolData("3", "allow_assgn_task_users", event)
    
                      
                  }
  
              }
              
          } catch (error) {
              
          }
  
      }




  const selectRepeatMode = async (event) => {
    console.log(event.target.value, 'event')
    var findIdx = _.findIndex(props.repeatModeData, { mode_id: event.target.value })
    if (findIdx !== -1) {
      const publishTempInfo = _.cloneDeep(publishTemplate)
      publishTempInfo.repeat_mode = props.repeatModeData[findIdx]["mode"]
      publishTempInfo["repeat_mode_config"]["mode"] = props.repeatModeData[findIdx]["mode"]
      publishTempInfo["repeat_mode_config"]["mode_id"] = props.repeatModeData[findIdx]["mode_id"]
      
      
      publishTempInfo["audit_start_date"] = null
      publishTempInfo["review_start_date"] = null
      publishTempInfo["audit_end_date"] = null
      publishTempInfo["review_end_date"] = null
      publishTempInfo["repeat_mode_config"]["scheduled_shift"] =[]
      publishTempInfo.settings = {
        enable_review: publishTempInfo.settings.enable_review,
        audit_qr_enable: false,
        review_qr_enable: false,
        audit_coords_enable: false,
        audit_score_preview: false,
        review_score_preview: false,
        review_coords_enable: false,
        review_pdf_download : false,
        review_acplan_create : false,
        audit_capture_sign : false,
        review_capture_sign : false,
      }
      delete publishTempInfo["repeat_mode_config"]["interval"]
      delete publishTempInfo["repeat_mode_config"]["months"]
      delete publishTempInfo["repeat_mode_config"]["evermnth"]
      setSelectedInterval("#")

      publishTempInfo.reminder_info = {
        sms: false,
        email: false
      }
      if(publishTempInfo.settings.enable_review){
        var reviewModeType =[]
        if(props.repeatModeData[findIdx]["mode_id"] === "0"){
          reviewModeType = _.filter(configData.repeat_mode,{mode_id :props.repeatModeData[findIdx]["mode_id"]})
        }
       else if(props.repeatModeData[findIdx]["mode_id"] === "1"){
        console.log("object");
          configData.repeat_mode.map((ele,idx)=>{
            if(ele.mode_id === "1" ||ele.mode_id === "2" || ele.mode_id === "3"){
              reviewModeType.push(ele)
            }
          })
        }
        else if(props.repeatModeData[findIdx]["mode_id"] === "2"){
          configData.repeat_mode.map((ele,idx)=>{
            if(ele.mode_id=== "2" ||ele.mode_id === "3"){
              reviewModeType.push(ele)
            }
          })
        }
        else if(props.repeatModeData[findIdx]["mode_id"] === "3"){
          configData.repeat_mode.map((ele,idx)=>{
            if(ele.mode_id === "3"){
              reviewModeType.push(ele)
            }
          })
        }
        console.log(reviewModeType,'reviewModeType');
        publishTempInfo["repeat_mode_config_review"][0]["mode"] =props.repeatModeData[findIdx]["mode"]
        publishTempInfo["repeat_mode_config_review"][0]["mode_id"] =props.repeatModeData[findIdx]["mode_id"]
        publishTempInfo["repeat_mode_config_review"][0]["stage"] ="1"
        delete publishTempInfo["repeat_mode_config_review"][0]["schedule_type"] 
        dispatch(setReviewSchedule(reviewModeType))
        publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] =[]
        
      }

      delete publishTempInfo["repeat_mode_config"]["schedule_type"] 
      const updatedPublishedTemp = await ccLevelValidation(publishTempInfo)
      props.updateTempMasterInfo(updatedPublishedTemp)
      console.log(publishTempInfo, 'publishTempInfo', updatedPublishedTemp)
      setStartDate('')
      setEndDate('')
      setselectedRepeatMode(props.repeatModeData[findIdx]["mode_id"])
    }
  }


  const ccLevelValidation = async (publishTempInfo) => {
    if (!manageAuditSlice.tempInfo?.capa_enabled) {
      if (publishTempInfo.repeat_mode === "One time" && (publishTempInfo.audit_start_date !== null && publishTempInfo.audit_end_date !== null)) {
        publishTempInfo["cc_level"] = 5
      }
      else if (publishTempInfo.repeat_mode_config.scheduled_shift?.length > 0) {
        publishTempInfo["cc_level"] = 4
      }
      else {
        publishTempInfo["cc_level"] = 2

      }
    }
    else{
      if (publishTempInfo.repeat_mode === "One time" && (publishTempInfo.audit_start_date !== null && publishTempInfo.audit_end_date !== null) && _.filter(publishTempInfo.adt_permissons, { create_acplan: true }).length > 0) {
        publishTempInfo["cc_level"] = 5
      }
      else if (publishTempInfo.repeat_mode_config.scheduled_shift?.length > 0) {
        publishTempInfo["cc_level"] = 4
      }
      else {
        publishTempInfo["cc_level"] = 2
      }
    }
    return publishTempInfo

  }


  const handleAddCustomSchedule=async(startTime,endTime,publishTemplate)=>{

    if (!startTime || !endTime) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Time Input',
        text: 'Please select both start and end times.',
        confirmButtonText: 'OK',
      });
      setdataLoaded(true)
      return;
    }


    const newStart = moment(startTime, "hh:mm A");
    let newEnd = moment(endTime, "hh:mm A")
    console.log(newStart, 'newStart', newEnd)
    if (newEnd.isBefore(newStart)) {
      newEnd.add(1, 'day'); // If end time is before start time, add 1 day
    }
    var newEvent
    if (publishTemplate.repeat_mode_config.schedule_type !== "24") {
      const isOverlapping = publishTemplate.repeat_mode_config.scheduled_shift?.some((schedule) => {
        const existingStart = moment(schedule.start, "HH:mm");
        let existingEnd = moment(schedule.end, "HH:mm");
        if (existingEnd.isBefore(existingStart)) {
          existingEnd.add(1, 'day');
        }
        return (
          (newStart.isSameOrAfter(existingStart) && newStart.isBefore(existingEnd)) || // New start within existing schedule
          (newEnd.isAfter(existingStart) && newEnd.isSameOrBefore(existingEnd)) || // New end within existing schedule
          (newStart.isBefore(existingStart) && newEnd.isAfter(existingEnd)) // New schedule fully overlaps an existing schedule
        );
      });
      if (isOverlapping) {
        Swal.fire({
          icon: 'warning', // Icon type: error, warning, success, info, etc.
          title: 'Time Overlap',
          text: 'This time overlaps with an existing schedule. Please choose a different time.',
          confirmButtonText: 'OK', // Optional: Customize button text
        });
        return;
      }
      newEvent = {
        title: "Shift",
        start: newStart.format("HH:mm"),
        end: newEnd.format("HH:mm"),
      };
      if (publishTemplate["repeat_mode_config"]["shift_type"] === "automate") {
        publishTemplate["repeat_mode_config"]["scheduled_shift"] = [newEvent];
        if(publishTemplate.settings.enable_review){
          const reviewEvent = _.cloneDeep(newEvent); // Clone it here

          let [hours, minutes] = reviewEvent.end.split(":").map(Number);
          hours = (hours + 1) % 24;
          const newTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          reviewEvent["end"] = newTime;
          publishTemplate["repeat_mode_config_review"][0]["scheduled_shift"]=[reviewEvent];
        }
      }
      else {
        publishTemplate["repeat_mode_config"]["scheduled_shift"] = [...publishTemplate["repeat_mode_config"]["scheduled_shift"], newEvent];
        if(publishTemplate.settings.enable_review){
          const reviewEvent = _.cloneDeep(newEvent); // Clone it here

          let [hours, minutes] = reviewEvent.end.split(":").map(Number);
          hours = (hours + 1) % 24;
          const newTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          
          reviewEvent["end"] = newTime;
          publishTemplate["repeat_mode_config_review"][0]["scheduled_shift"]=[...publishTemplate["repeat_mode_config_review"][0]["scheduled_shift"], reviewEvent];
        }
      }
    }
    settimeInfo({})
    setdataLoaded(true)
    console.log(publishTemplate,'publishTemplate');
    var updatedData =await ccLevelValidation(publishTemplate)
    props.updateTempMasterInfo(updatedData)
  }

  const onChangeStartDate=async(event)=>{

    const publishTempInfo = _.cloneDeep(publishTemplate)
    publishTempInfo["audit_start_date"] = event.target.value
    if (publishTempInfo.settings.enable_review) {
      publishTempInfo["audit_start_date"] = event.target.value;
      publishTempInfo["review_start_date"] = event.target.value;
    } else {
      publishTempInfo["audit_start_date"] = event.target.value;
    }
    // publishTempInfo.settings.enable_review ?   publishTempInfo["audit_start_date"] = event.target.value  publishTempInfo["review_start_date"] = event.target.value :publishTempInfo["audit_start_date"] = event.target.value
    // publishTempInfo["audit_end_date"] = event.target.value > publishTempInfo["end_date"] ? null : publishTempInfo["end_date"]
    setStartDate(event.target.value)
    var updatedData = await ccLevelValidation(publishTempInfo)
    props.updateTempMasterInfo(updatedData)
  }


  const handleScheduleTypeChange=async(event,publishTempInfo)=>{
    console.log(event.target.value,'event')
    if(publishTempInfo.repeat_mode_config.mode_id === "1"){
      publishTempInfo["repeat_mode_config"]["schedule_type"] = event.target.value
      if(publishTempInfo.settings.enable_review){
        publishTempInfo["repeat_mode_config_review"][0]["schedule_type"] = event.target.value
        publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] =[]
      }
      publishTempInfo.repeat_mode_config.scheduled_shift = []
      delete publishTempInfo.repeat_mode_config.shift_type 
      if(event.target.value ==="24"){
        publishTempInfo.repeat_mode_config.scheduled_shift = [{ start: "00:00", end: "23:59", title: "Shift", }];   
        if(publishTempInfo.settings.enable_review){
          publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] = [{ start: "00:00", end: "23:59", title: "Shift", }];   
        } 
        settimeInfo({
          startTime: "00:00",
          endTime: "23:59",
        })
        handleAddCustomSchedule("00:00","23:59",publishTempInfo)
      }

    }
    else if(publishTempInfo.repeat_mode_config.mode_id === "2"){
      publishTempInfo["repeat_mode_config"]["schedule_type"] = event.target.value
      if(publishTempInfo.settings.enable_review){
        publishTempInfo["repeat_mode_config_review"][0]["schedule_type"] =event.target.value
      }
      if(event.target.value === "7"){
        publishTempInfo["repeat_mode_config"]["scheduled_shift"]=getNextSevenDays()
        if(publishTempInfo.settings.enable_review){
          publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] =getNextEightDays()
        }
      }
      else{
        publishTempInfo["repeat_mode_config"]["scheduled_shift"]=[]
        publishTempInfo["repeat_mode_config"]["days"]=publishTempInfo["repeat_mode_config"]["days"]?.map((ele,idx)=>{
          return {day : ele.day , day_id :ele.day_id,checked : ele.checked}
        })
        if(publishTempInfo.settings.enable_review){
          publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] =[]
          publishTempInfo["repeat_mode_config_review"][0]["days"] =publishTempInfo["repeat_mode_config_review"][0]["days"]?.map((ele,idx)=>{
            return {day : ele.day , day_id :ele.day_id,checked : ele.checked}
          })
        }
      }
    }
    else if(publishTempInfo.repeat_mode_config.mode_id === "3"){
      publishTempInfo["repeat_mode_config"]["evermnth"] = event.target.value
      if(publishTempInfo.settings.enable_review){
        publishTempInfo["repeat_mode_config_review"][0]["evermnth"] =event.target.value
        publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] =[]
      }
      delete publishTempInfo["repeat_mode_config"]["months"]
      delete publishTempInfo["repeat_mode_config"]["month_start"]
      publishTempInfo["repeat_mode_config"]["schedule_type"] = "quaterly"
      publishTempInfo["repeat_mode_config"]["scheduled_shift"]=[]
    }
    var updatedData = await ccLevelValidation(publishTempInfo)
    props.updateTempMasterInfo(updatedData)
  }

  const getNextSevenDays=(startDayIndex)=>{
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    if(startDayIndex){
      const nextSevenDays = [];
      for (let i = 0; i < 7; i++) {
        const dayIndex = (startDayIndex + i) % 7; // Wrap around using modulo
        nextSevenDays.push({
          day: daysOfWeek[dayIndex],
          id: i,
        });
      }
    
      return nextSevenDays;

    }
    else{
    // Get today's date
    const today = new Date();
    const nextSevenDays = [];
  
    for (let i = 0; i < 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + i);
      const dayName = daysOfWeek[futureDate.getDay()]; // Get the day name
      nextSevenDays.push({
        day: dayName,
        id: i
      });
    }
  
    return nextSevenDays;
  }

  }


  const getNextEightDays=(startDayIndex)=>{
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    if(startDayIndex){
      const nextSevenDays = [];
      for (let i = 0; i < 8; i++) {
        const dayIndex = (startDayIndex + i) % 7; // Wrap around using modulo
        nextSevenDays.push({
          day: daysOfWeek[dayIndex],
          id: i,
        });
      }
    
      return nextSevenDays;

    }
    else{
    // Get today's date
    const today = new Date();
    const nextSevenDays = [];
  
    for (let i = 0; i < 8; i++) {
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + i);
      const dayName = daysOfWeek[futureDate.getDay()]; // Get the day name
      nextSevenDays.push({
        day: dayName,
        id: i
      });
    }
  
    return nextSevenDays;
  }

  }



  const columnsCalendar = useMemo(() =>
    publishTemplate.repeat_mode_config?.schedule_type === "24" ? [
      {
        accessor: 'title',
        Header: 'Schedule Type',
        filterable: true,
        width: "50%",
        Cell: (cellProps) => {
          var item = cellProps.row.original
          return (
            <div className="d-flex flex-row" >
              <div className="me-2">
                <i
                  className={"mdi mdi-file-tree font-size-15 text-danger"}
                />
              </div>
              <div className="text-dark">
                Shift {cellProps.row.index + 1}
              </div>
            </div>
          )
        }
      },
      {
        accessor: 'start',
        Header: 'Start Time',
        width: "10%",
        Cell: (cellProps) => {
          var item = cellProps.row.original
          return (
            <>
              {moment(item.start, "HH:mm").format("hh:mm A")}
            </>
          )
        }
      },
      {
        accessor: 'end',
        Header: 'End Time',
        width: "10%",
        Cell: (cellProps) => {
          var item = cellProps.row.original
          return (
            <>
              {moment(item.end, "HH:mm").format("hh:mm A")}

            </>
          )
        }
      },
    ]
      :

      [
        {
          accessor: 'title',
          Header: 'Schedule Type',
          filterable: true,
          width: "50%",
          Cell: (cellProps) => {
            var item = cellProps.row.original
            return (
              <div className="d-flex flex-row" >
                <div className="me-2">
                  <i
                    className={"mdi mdi-file-tree font-size-15 text-danger"}
                  />
                </div>
                <div className="text-dark">
                  {/* {item.title} */}
                  Shift {cellProps.row.index + 1}
                </div>
              </div>
            )
          }
        },

        {
          accessor: 'start',
          Header: 'Start Time',
          width: "10%",
          Cell: (cellProps) => {
            var item = cellProps.row.original
            return (
              <>
                {/* {moment(item.start).format("hh:mm A")} */}
                {moment(item.start, "HH:mm").format("hh:mm A")}
              </>
            )
          }
        },
        {
          accessor: 'end',
          Header: 'End Time',
          width: "10%",
          Cell: (cellProps) => {
            var item = cellProps.row.original
            return (
              <>
                {/* {moment(item.end).format("hh:mm A")} */}
                {moment(item.end, "HH:mm").format("hh:mm A")}

              </>
            )
          }
        },
        {
          accessor: 'menus',
          Header: 'Delete',
          // hidden : this.state.publishTemplate.repeat_mode_config.schedule_type === "24" ? true : false,
          Cell: (cellProps) => {
            var item = cellProps.row.original
            return (
              <Popconfirm placement="leftBottom" title={`Are You sure to delete ?`}
                onConfirm={async () => {
                  console.log("delete")
                  var publishTemplateInfo = _.cloneDeep(publishTemplate)
                  var filteredInfo = publishTemplateInfo.repeat_mode_config?.scheduled_shift.filter((ele) => {
                    if (ele.start !== item.start) {
                      return ele
                    }
                  })
                  publishTemplateInfo["repeat_mode_config"]["scheduled_shift"] = filteredInfo
                  const updatedData = await ccLevelValidation(publishTemplateInfo)
                  props.updateTempMasterInfo(updatedData)

                }} >
                <Button outline className="btn btn-sm btn-soft-danger">
                  <i className="bx bx-trash" />
                </Button>
              </Popconfirm>
            )
          }
        }
      ]
    , [publishTemplate.repeat_mode_config
      .scheduled_shift]
  )


   async function ordinal_suffix_of(i) {
      var j = i % 10,
        k = i % 100;
      if (j == 1 && k != 11) {
        return "st";
      }
      if (j == 2 && k != 12) {
        return "nd";
      }
      if (j == 3 && k != 13) {
        return "rd";
      }
      return "th";
    }
  
  
    const calculatedEndMonth = async(dateInfo) => {
      console.log(dateInfo, 'dateInfo')
      var publishTemplateInfo = _.cloneDeep(publishTemplate)
      publishTemplateInfo["repeat_mode_config"]["scheduled_shift"] = []
      var start_date = await ordinal_suffix_of(dateInfo.startDate)
      publishTemplateInfo["repeat_mode_config"]["scheduled_shift"] = [{ startDate: `Every Month on ${dateInfo.startDate}${start_date}`, dateInfo, endDate: `Every Month on ${dateInfo.endDate}${await ordinal_suffix_of(dateInfo.endDate)}`, }]
      if(publishTemplateInfo.settings.enable_review){
        dateInfo["endDate"]= dateInfo["startDate"]
        dateInfo["duration"]= 1
        publishTemplateInfo["repeat_mode_config_review"][0]["scheduled_shift"]=[{ startDate: `Every Month on ${dateInfo.startDate}${start_date}`, dateInfo, endDate: `Every Next Month on ${dateInfo.startDate}${await ordinal_suffix_of(dateInfo.startDate)}`, }]
      }
      var updatedData = await ccLevelValidation(publishTemplateInfo)
      props.updateTempMasterInfo(updatedData)
    
    }

  const handleAutomateShift=async()=>{

    const publishTemplateInfo = _.cloneDeep(publishTemplate)

    if (!Number(shiftCount) || !timeInfo.startTime || !timeInfo.endTime) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Input',
        text: 'Please provide the number of shifts, start time, and end time.',
        confirmButtonText: 'OK',
      });
      return;
    }

    let startMoment = moment(timeInfo.startTime, "hh:mm A");
    let endMoment = moment(timeInfo.endTime, "hh:mm A");

    // Adjust for overnight shifts
    if (endMoment.isBefore(startMoment)) {
      endMoment.add(1, 'day'); // If end time is before start time, add 1 day
    }

    const totalDuration = endMoment.diff(startMoment, 'hours');
    if (totalDuration <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Time Range',
        text: 'End time must be after the start time.',
        confirmButtonText: 'OK',
      });
      return;
    }
    const hoursPerShift = totalDuration / Number(shiftCount);
    const shifts = [];
    const newEvents = [];
    const reviewEvents = [];

    let currentStartTime = startMoment.clone();

    for (let i = 0; i < Number(shiftCount); i++) {
      const currentEndTime = currentStartTime.clone().add(hoursPerShift, 'hours');
      if (currentEndTime.isAfter(endMoment)) {
        alert("Shifts exceed the specified end time.");
        break;
      }

      const newEvent = {
        title: `Shift ${i + 1}`,
        start: currentStartTime.format("HH:mm"),
        end: currentEndTime.format("HH:mm"),
      };

      shifts.push(newEvent);
      newEvents.push(newEvent);
      if(publishTemplateInfo.settings.enable_review){
        const reviewEventInfo = _.cloneDeep(newEvent); // Clone it here
        let [hours, minutes] = reviewEventInfo.end.split(":").map(Number);
        hours = (hours + 1) % 24;
        const newTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        reviewEventInfo["end"] = newTime;
        reviewEvents.push(reviewEventInfo)
      }

      currentStartTime = currentEndTime;
    }
    console.log(reviewEvents,'reviewEvents');

    if(publishTemplateInfo["repeat_mode_config"]["shift_type"] === "automate"){
      publishTemplateInfo["repeat_mode_config"]["scheduled_shift"] = [ ...shifts];
      if(publishTemplate.settings.enable_review){
        publishTemplateInfo["repeat_mode_config_review"][0]["scheduled_shift"]=[ ...reviewEvents];
      }

    }
    else{
      publishTemplateInfo["repeat_mode_config"]["scheduled_shift"] = [...publishTemplate["repeat_mode_config"]["scheduled_shift"], ...shifts];
    }
    publishTemplateInfo["repeat_mode_config"]["shift_count"]= shiftCount
    if(publishTemplateInfo.settings.enable_review){
      publishTemplateInfo["repeat_mode_config_review"][0]["shift_count"]= shiftCount
      publishTemplateInfo["repeat_mode_config_review"][0]["scheduled_shift"]= [...reviewEvents];
    }
    var updatedData =await ccLevelValidation(publishTemplateInfo)
    props.updateTempMasterInfo(updatedData)

  }

  const handleDayClick=(index)=>{
    const publishTemplateInfo = _.cloneDeep(publishTemplate)
    var configData = JSON.parse(sessionStorage.getItem("authUser")).config_data
    publishTemplateInfo["repeat_mode_config"]["scheduled_shift"]=[]
    if (publishTemplateInfo.settings.enable_review) {
      publishTemplateInfo["repeat_mode_config_review"][0]["scheduled_shift"] = []
    }
    setTimeout(async() => {
      const updatedDays = publishTemplate.repeat_mode_config.days.map((ele, idx) =>
        idx === index ? { ...ele, isSelected: !ele.isSelected } : { ...ele, isSelected: false }
      );
      console.log(updatedDays, 'updatedDays')
      publishTemplateInfo.repeat_mode_config.days = updatedDays
      configData.month_list = updatedDays
      publishTemplateInfo.repeat_mode_config.scheduled_shift = updatedDays[index]["isSelected"] ? getNextSevenDays(Number(publishTemplateInfo.repeat_mode_config.days[index]["day_id"] === "0" ? 7 : publishTemplateInfo.repeat_mode_config.days[index]["day_id"]) ):[]
      if (publishTemplateInfo.settings.enable_review) {
        publishTemplateInfo["repeat_mode_config_review"][0]["scheduled_shift"] =  updatedDays[index]["isSelected"] ? getNextEightDays(Number(publishTemplateInfo.repeat_mode_config.days[index]["day_id"] === "0" ? 7 : publishTemplateInfo.repeat_mode_config.days[index]["day_id"]) ):[]
        publishTemplateInfo["repeat_mode_config_review"][0]["days"] =  updatedDays
        publishTemplateInfo["repeat_mode_config_review"][0]["week_interval"] =  8
      
      }
      var updatedData =await ccLevelValidation(publishTemplateInfo)
      props.updateTempMasterInfo(updatedData)
    }, 200);

  }

  const updateMonthInfo=async(publishTempInfo)=>{
    var selectedIdx = _.findIndex(publishTempInfo.repeat_mode_config.months,{isSelected : true})
    console.log(selectedIdx,'selectedIdx')
    if(selectedIdx !==-1){
     await handleDayClickMonth(selectedIdx, publishTempInfo.repeat_mode_config.months[selectedIdx]["month"],publishTempInfo)
    }
    else{
      props.updateTempMasterInfo(publishTempInfo)
    }

  }


  const showRepeatModeComponent = (mode) => {
    console.log(timeInfo, 'timeInfo')

    return (
      <>
        {
          mode === "1" &&
          <>
            <div className="col-4">
              <FormGroup>
                <Label for="scheduleType">Select Schedule Type :<span className="text-danger">*</span></Label>
                <Input
                  type="select"
                  name="scheduleType"
                  id="scheduleType"
                  defaultValue={publishTemplate.repeat_mode_config?.schedule_type ? publishTemplate.repeat_mode_config?.schedule_type : "select"}
                  onChange={(e) => { handleScheduleTypeChange(e, _.cloneDeep(publishTemplate)) }}
                >
                  <option value="select" disabled={true}>Select</option>
                  <option value="24">24 hrs</option>
                  <option value="custom">Custom</option>
                </Input>
              </FormGroup>
            </div>
            <div>
              {
                publishTemplate.repeat_mode_config?.schedule_type &&
                <div style={{ border: '1px solid #e9e9e9', borderRadius: '5px' }} className="p-3">
                  <Row>
                    <Col>
                      {publishTemplate.repeat_mode_config.schedule_type === "custom" && (
                        <div>
                          <div className="d-flex align-items-center gap-3 mb-3 mt-2">
                            <div>
                              <Input
                                type="radio"
                                id="scheduleShift"
                                name="shiftType"
                                value="schedule"
                                checked={
                                  publishTemplate.repeat_mode_config
                                    ?.shift_type === "schedule"
                                }
                                onClick={(e) => {
                                  var publishTemplateInfo = _.cloneDeep(publishTemplate);
                                  publishTemplateInfo["repeat_mode_config"][
                                    "shift_type"
                                  ] = e.target.value;
                                  if (publishTemplateInfo.settings.enable_review) {
                                    publishTemplateInfo["repeat_mode_config_review"][0]["shift_type"] = e.target.value
                                    publishTemplateInfo["repeat_mode_config_review"][0]["scheduled_shift"] =[]
                                    delete publishTemplateInfo["repeat_mode_config_review"][0]["shift_count"]
                                  }

                                  publishTemplateInfo["repeat_mode_config"][
                                    "scheduled_shift"
                                  ] = [];
                                  delete publishTemplateInfo["repeat_mode_config"][
                                    "shift_count"
                                  ];
                                  settimeInfo({
                                    startTime: "",
                                    endTime: "",
                                  })
                                  props.updateTempMasterInfo(publishTemplateInfo)
                                }}
                              />
                              <Label for="scheduleShift">&nbsp; Schedule Shift</Label>
                            </div>
                            <div>
                              <Input
                                type="radio"
                                id="automateShift"
                                name="shiftType"
                                value="automate"
                                checked={
                                  publishTemplate.repeat_mode_config
                                    .shift_type === "automate"
                                }
                                onClick={(e) => {
                                  var publishTemplateInfo = _.cloneDeep(publishTemplate);
                                  publishTemplateInfo["repeat_mode_config"][
                                    "shift_type"
                                  ] = e.target.value;
                                  publishTemplateInfo["repeat_mode_config"][
                                    "scheduled_shift"
                                  ] = [];
                                  if (publishTemplateInfo.settings.enable_review) {
                                    publishTemplateInfo["repeat_mode_config_review"][0]["shift_type"] = e.target.value
                                    publishTemplateInfo["repeat_mode_config_review"][0]["scheduled_shift"] =[]
                                    delete publishTemplateInfo["repeat_mode_config_review"][0]["shift_count"]
                                  }
                                  delete publishTemplateInfo["repeat_mode_config"][
                                    "shift_count"
                                  ];
                                  settimeInfo({
                                    startTime: "",
                                    endTime: "",
                                  })
                                  props.updateTempMasterInfo(publishTemplateInfo)
                                }}
                              />
                              <Label for="automateShift">&nbsp; Automate Shift</Label>
                            </div>
                          </div>

                          {/* Schedule Shift Inputs */}
                          {publishTemplate.repeat_mode_config.shift_type === "schedule" && (
                            <>
                              <div className="d-flex align-items-end gap-3 mb-3">
                                <div>
                                  <Label>Start Time</Label>
                                  <Input
                                    type="time"
                                    value={timeInfo?.startTime ||""}
                                    onChange={(e) => {
                                      const timeInfoUpdt = _.cloneDeep(timeInfo)
                                      timeInfoUpdt["startTime"] = e.target.value
                                      settimeInfo(timeInfoUpdt)
                                    }

                                    }
                                  />
                                </div>
                                <div>
                                  <Label>End Time</Label>
                                  <Input
                                    type="time"
                                    value={timeInfo?.endTime ||""}
                                    onChange={(e) => {
                                      const timeInfoUpdt = _.cloneDeep(timeInfo)
                                      timeInfoUpdt["endTime"] = e.target.value
                                      settimeInfo(timeInfoUpdt)
                                    }
                                    }
                                  />
                                </div>
                                {publishTemplate.repeat_mode_config.shift_type && (
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (publishTemplate.repeat_mode_config.shift_type === "schedule") {
                                          setdataLoaded(false)
                                          handleAddCustomSchedule(timeInfo.startTime, timeInfo.endTime, _.cloneDeep(publishTemplate));
                                        }
                                        else {
                                          // this.setState({ customSchedules: [], }, () => { this.handleAutomateShift(); });
                                          handleAutomateShift()
                                        }
                                      }}
                                      className="btn btn-md btn-outline-primary"
                                    >
                                      Add Custom Schedule
                                    </button>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                          {publishTemplate.repeat_mode_config.shift_type === "automate" && (
                            <>

                              <div className="d-flex align-items-end gap-3 mb-3">
                                <div>
                                  <Label>Create Schedule a day</Label>
                                  <input
                                    type="number"
                                    placeholder="Enter a number"
                                    onChange={(e) => {
                                      setshiftCount(e.target.value)
                                    }}
                                    onKeyDown={(e) => {
                                      e.key === "Enter" && e.preventDefault()
                                    }}
                                    defaultValue={
                                      publishTemplate.repeat_mode_config
                                        .shift_count
                                    }
                                    className="form-control"
                                  />{" "}
                                </div>
                                <div>
                                  <Label>Start Time</Label>
                                  <Input
                                    type="time"
                                    value={timeInfo?.startTime || ""}
                                    onChange={(e) => {
                                      const timeInfoUpdt = _.cloneDeep(timeInfo)
                                      timeInfoUpdt["startTime"] = e.target.value
                                      settimeInfo(timeInfoUpdt)
                                    }

                                    }
                                  />
                                </div>
                                <div>
                                  <Label>End Time</Label>
                                  <Input
                                    type="time"
                                    value={timeInfo?.endTime || ""}
                                    onChange={(e) => {
                                      const timeInfoUpdt = _.cloneDeep(timeInfo)
                                      timeInfoUpdt["endTime"] = e.target.value
                                      settimeInfo(timeInfoUpdt)
                                    }

                                    }
                                  />
                                </div>
                                {publishTemplate.repeat_mode_config.shift_type && (
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (publishTemplate.repeat_mode_config.shift_type === "schedule") {
                                          setdataLoaded(false)
                                          handleAddCustomSchedule(timeInfo.startTime, timeInfo.endTime, _.cloneDeep(publishTemplate));
                                        }
                                        else {
                                          handleAutomateShift()
                                        }
                                      }}
                                      className="btn btn-md btn-outline-primary d-flex align-items-center"

                                    >
                                      <i className="bx bx-list-plus me-1" style={{ fontSize: '20px' }} /> Add Custom Schedule
                                    </button>
                                  </div>
                                )}
                              </div>


                            </>
                          )}
                        </div>
                      )}

                      {publishTemplate.repeat_mode_config.scheduled_shift?.length > 0 && (
                        <div>
                          <Label>Scheduled Jobs</Label>
                          <TableContainer
                            columns={columnsCalendar}
                            data={
                              publishTemplate.repeat_mode_config
                                .scheduled_shift
                            }
                            isGlobalFilter={true}
                            customPageSize={10}
                            tableClass="align-middle table-nowrap table-check"
                            theadClass="table-light"
                            pagination="pagination justify-content-end pagination-rounded"
                            isPagination={true}
                          />
                        </div>
                      )}
                    </Col>
                  </Row>
                  {/* </CardBody> */}
                </div>
              }


            </div>


          </>
        }
        {
          mode === "2" &&
          <>
            <div className="col-4">
              <FormGroup>
                <Label for="scheduleType">Select Schedule Type :<span className="text-danger">*</span></Label>
                <Input
                  type="select"
                  name="scheduleType"
                  id="scheduleType"
                  defaultValue={publishTemplate.repeat_mode_config?.schedule_type ? publishTemplate.repeat_mode_config?.schedule_type : "select"}
                  onChange={(e) => { handleScheduleTypeChange(e, _.cloneDeep(publishTemplate)) }}
                >
                  <option value="select" disabled={true}>Select</option>
                  <option value="7">7 days</option>
                  <option value="custom">Custom</option>
                </Input>
              </FormGroup>
            </div>

            <Row>
              {
                publishTemplate.repeat_mode_config.schedule_type === "custom" &&
                <>

                  <Col md={6}>
                    <CardTitle>Select Day</CardTitle>
                    <div className="list-group">
                      {publishTemplate.repeat_mode_config.days.map((ele, idx) => (
                        <div
                          key={idx}
                          className={`list-group-item d-flex justify-content-between align-items-center ${ele?.isSelected ? "list-group-item-primary" : ""}`}
                          style={{
                            transition: "background-color 0.2s",
                            cursor: "pointer",
                          }}
                          onClick={(e) => handleDayClick(idx, e.target)}
                        >
                          <span className="fw-bold">{ele.day}</span>
                          <input
                            type="radio"
                            checked={ele?.isSelected}
                          // onChange={() => this.handleDayClick(idx)}
                          />
                        </div>
                      ))}
                    </div>
                  </Col>
                </>
              }


              <Col md={6} className="d-flex align-items-center justify-content-center">
                {publishTemplate.repeat_mode_config.scheduled_shift.length > 0 ? (
                  <div className="w-100">
                    <CardTitle>Scheduled Week</CardTitle>
                    <ListGroup flush className="border rounded shadow-sm">
                      <ListGroupItem className="d-flex align-items-center justify-content-between">
                        <div className="fw-bold text-muted">Audit Starts On:</div>
                        <span className="text-success badge badge-soft-success fw-bold font-size-12">{publishTemplate.repeat_mode_config.scheduled_shift[0]["day"]}</span>
                      </ListGroupItem>
                      <ListGroupItem className="d-flex align-items-center justify-content-between">
                        <div className="fw-bold text-muted">Audit Ends On:</div>
                        <span className="text-danger badge badge-soft-danger fw-bold font-size-12">{publishTemplate.repeat_mode_config.scheduled_shift[publishTemplate.repeat_mode_config.scheduled_shift.length - 1]["day"]}</span>
                      </ListGroupItem>
                    </ListGroup>
                  </div>
                ) : (
                  <h5 className="text-center text-muted">No schedule selected</h5>
                )}
              </Col>
            </Row>

          </>
        }
        {
          mode ==="3" &&
          <>
            <div className="col-4">
              <FormGroup>
                <Label for="scheduleType">Select Schedule Type :<span className="text-danger">*</span></Label>
                <Input
                  type="select"
                  name="scheduleType"
                  id="scheduleType"
                  defaultValue={publishTemplate.repeat_mode_config?.evermnth ? publishTemplate.repeat_mode_config?.evermnth : "select"}
                  onChange={(e) => { handleScheduleTypeChange(e, _.cloneDeep(publishTemplate)) }}
                >
                  <option value="select" disabled={true}>Select</option>
                  <option value="evermnth">Every Month</option>
                  {/* <option value="quaterly">Quaterly</option> */}
                  <option value="custom">Custom Month</option>
                </Input>
              </FormGroup>
            </div>
            <Row>
              {
                publishTemplate.repeat_mode_config.evermnth === "evermnth" &&
                <div className="d-flex align-items-center gap-3 mb-3 mt-2">
                  <div>
                    <Input
                      type="radio"
                      id="month_start"
                      name="monthStart"
                      value="mstart"
                      checked={
                        publishTemplate.repeat_mode_config
                          ?.schedule_type === "mstart"
                      }
                      onClick={async (e) => {
                        const publishTempInfo = _.cloneDeep(publishTemplate)
                        publishTempInfo["repeat_mode_config"]["schedule_type"] = e.target.value
                        publishTempInfo["repeat_mode_config"]["scheduled_shift"] = [{
                          startDate: "Every Month on 1st",
                          endDate: "Every Month on 28th",
                          dateInfo: {
                            startDate: 1,
                            endDate: 28
                          }
                        }]
                        if(publishTempInfo.settings.enable_review){
                        publishTempInfo["repeat_mode_config_review"][0]["schedule_type"] = e.target.value
                          publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"]=[{
                            startDate: "Every Month on 1st",
                            endDate: "Every Month on 1st",
                            dateInfo: {
                              startDate: 1,
                              endDate: 1,
                              duration:1
                            }
                          }]
                        }

                        var updatedData = await ccLevelValidation(publishTempInfo)
                        props.updateTempMasterInfo(updatedData)
                      }}
                    />
                    <Label for="month_start">&nbsp; Month Starts</Label>
                  </div>
                  <div>
                    <Input
                      type="radio"
                      id="custom_month"
                      name="customMonth"
                      value="custom_month"
                      checked={
                        publishTemplate.repeat_mode_config
                          .schedule_type === "custom"
                      }
                      onClick={async (e) => {
                        var publishTemplateInfo = _.cloneDeep(publishTemplate);
                        publishTemplateInfo["repeat_mode_config"][
                          "schedule_type"
                        ] = "custom";
                        publishTemplateInfo["repeat_mode_config"][
                          "scheduled_shift"
                        ] = [];
                        if(publishTemplateInfo.settings.enable_review){
                          publishTemplateInfo["repeat_mode_config_review"][0]["schedule_type"]="custom"
                          publishTemplateInfo["repeat_mode_config_review"][0]["scheduled_shift"]=[]
                        }
                        var updatedData = await ccLevelValidation(publishTemplateInfo)
                        props.updateTempMasterInfo(updatedData)

                      }}
                    />
                    <Label for="custom_month">&nbsp; Custom</Label>
                  </div>
                </div>
              }
              {
                publishTemplate.repeat_mode_config.evermnth === "custom" &&
                <>
                  <Col md={6}>
                    <div style={{ border: '1px solid #e9e9e9', borderRadius: '5px' }} className="p-3">
                      <CardTitle>Select Start Month</CardTitle>
                      <label>Choose Month Interval : <span className='text-danger'>*</span></label>
                      <select onChange={async(e)=>{
                        setSelectedInterval(e.target.value)
                        const publishTempInfo = _.cloneDeep(publishTemplate)
                        publishTempInfo["repeat_mode_config"]["interval"]=e.target.value
                        if(publishTempInfo.settings.enable_review){
                          publishTempInfo["repeat_mode_config_review"][0]["interval"]=e.target.value
                        }
                        await updateMonthInfo(publishTempInfo)
                      }} defaultValue={publishTemplate["repeat_mode_config"]["interval"] ? publishTemplate["repeat_mode_config"]["interval"] : selectedInterval} className="form-control select2 mb-3 mb-xxl-0">
                      <option value={"#"} disabled>choose</option>
                        <option value={"1"}>1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select> &nbsp;
                      {publishTemplate["repeat_mode_config"]["interval"] &&
                        < div className="list-group">
                      {(publishTemplate.repeat_mode_config.months ? publishTemplate.repeat_mode_config.months : configData.month_list)?.map((ele, idx) => (
                        <div
                          key={idx}
                          className={`list-group-item d-flex justify-content-between align-items-center ${ele?.isSelected ? "list-group-item-primary" : ""}`}
                          style={{
                            transition: "background-color 0.2s",
                            cursor: "pointer",
                          }}
                          onClick={(e) => handleDayClickMonth(idx, ele.month)}
                        >
                          <span className="fw-bold">{ele.month}</span>
                          <input
                            type="radio"
                            checked={ele?.isSelected}
                            onChange={() => handleDayClickMonth(idx, ele.month)}
                          />
                        </div>
                      ))}
                    </div>
  }

                    </div>
                  </Col>
                </>
              }
              {
                publishTemplate.repeat_mode_config.schedule_type === "custom" &&
                <>
                  <Col md={6}>
                    <div style={{ border: '1px solid #e9e9e9', borderRadius: '5px' }} className="p-3">
                      <CardTitle>Select Monthly Start Date</CardTitle>
                      <Calendar
                        calculatedDate={(dateInfo) => { calculatedEndMonth(dateInfo) }}
                        selectedDate={publishTemplate.repeat_mode_config.scheduled_shift.length > 0 ? publishTemplate.repeat_mode_config.scheduled_shift[0]?.dateInfo?.startDate : null}
                      />
                    </div>
                  </Col>
                </>
              }
              {/* {
                publishTemplate.repeat_mode_config.schedule_type === "quaterly"
                 &&
                <>
                  <Col md={6}>
                    <div style={{ border: '1px solid #e9e9e9', borderRadius: '5px' }} className="p-3">
                      <CardTitle>Select Start Month</CardTitle>
                      <div className="list-group">
                        {(publishTemplate.repeat_mode_config.months ? publishTemplate.repeat_mode_config.months : configData.month_list).map((ele, idx) => (
                          <div
                            key={idx}
                            className={`list-group-item d-flex justify-content-between align-items-center ${ele?.isSelected ? "list-group-item-primary" : ""}`}
                            style={{
                              transition: "background-color 0.2s",
                              cursor: "pointer",
                            }}
                            onClick={(e) => handleDayClickMonth(idx, ele.month)}
                          >
                            <span className="fw-bold">{ele.month}</span>
                            <input
                              type="radio"
                              checked={ele?.isSelected}
                              onChange={() => handleDayClickMonth(idx, ele.month)}
                            />
                          </div>
                        ))}
                      </div>

                    </div>
                  </Col>

                </>
              } */}


              <Col md={6} className="d-flex align-items-center justify-content-center">
                {publishTemplate.repeat_mode_config.scheduled_shift.length > 0 && publishTemplate.repeat_mode_config.evermnth !== "custom" ? (
                  <div className="w-100">
                    <CardTitle>Monthly Scheduled</CardTitle>
                    <ListGroup flush className="border rounded shadow-sm">
                      <ListGroupItem className="d-flex align-items-center justify-content-between">
                        <div className="fw-bold text-muted">Audit Starts On:</div>
                        <span className="text-success badge badge-soft-success fw-bold font-size-12">{publishTemplate.repeat_mode_config?.scheduled_shift[0]["startDate"]}</span>
                      </ListGroupItem>
                      <ListGroupItem className="d-flex align-items-center justify-content-between">
                        <div className="fw-bold text-muted">Audit Ends On:</div>
                        <span className="text-danger badge badge-soft-danger fw-bold font-size-12">{publishTemplate.repeat_mode_config?.scheduled_shift[publishTemplate.repeat_mode_config?.scheduled_shift.length - 1]["endDate"]}</span>
                      </ListGroupItem>
                    </ListGroup>
                  </div>
                ) :

                  publishTemplate.repeat_mode_config.scheduled_shift.length > 0 ?
                    <div className="w-100">
                      <h2>Month Ranges</h2>
                      <table border="1" cellPadding="10">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Start Month</th>
                            <th>End Month</th>
                          </tr>
                        </thead>
                        <tbody>
                          {publishTemplate.repeat_mode_config.scheduled_shift?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.start}</td>
                              <td>{item.end}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    :
                    (
                      <h5 className="text-center text-muted">No schedule selected</h5>
                    )}
              </Col>
            </Row>

          </>
        }
      </>
    )

  }



  const handleDayClickMonth = async (index, value,publishTempInfo) => {
    console.log('value', value)
    var publishTemplateInfo = publishTempInfo ? publishTempInfo : _.cloneDeep(publishTemplate)
    const authUser = JSON.parse(sessionStorage.getItem("authUser"))
    publishTemplateInfo.repeat_mode_config.scheduled_shift = []
    if(publishTemplateInfo.settings.enable_review){
      publishTemplateInfo.repeat_mode_config_review[0].scheduled_shift = []
    }
    const updatedMonths = authUser.config_data.month_list.map((ele, idx) =>
      idx === index ? { ...ele, isSelected: !ele.isSelected } : { ...ele, isSelected: false }
    )
    console.log(updatedMonths, 'updatedMonths');
    publishTemplateInfo.repeat_mode_config.months = updatedMonths
    publishTemplateInfo.repeat_mode_config.scheduled_shift = updatedMonths[index]["isSelected"] ? await getNextQuarterDateRanges(value,publishTemplateInfo.repeat_mode_config.interval ) : []
    if(publishTemplateInfo.settings.enable_review){
      publishTemplateInfo["repeat_mode_config_review"][0]["months"]=updatedMonths
      publishTemplateInfo["repeat_mode_config_review"][0]["duration"]=1
      publishTemplateInfo["repeat_mode_config_review"][0]["scheduled_shift"]=updatedMonths[index]["isSelected"] ? await getNextQuarterDateRanges(value,publishTemplateInfo.repeat_mode_config.interval ) : []
    }
    console.log(publishTemplateInfo.repeat_mode_config.scheduled_shift,'publishTemplateInfo.repeat_mode_config.scheduled_shift')
    var updatedData =await ccLevelValidation(publishTemplateInfo)
    props.updateTempMasterInfo(updatedData)
  }

  const handleUpdate=(publishTempInfo,dynamic_key,event)=>{
    console.log(event.target.checked,'event',dynamic_key)
    publishTempInfo["settings"][dynamic_key]=!event.target.checked
    console.log(publishTempInfo,'publishTempInfo')
    props.updateTempMasterInfo(publishTempInfo)
  
  }
  
    const onDrawerClose = async () => {
        setopenTaskUsers(false)
      }



 const getNextQuarterDateRanges = (selectedMonth,interval) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    let selectedIndex = months.indexOf(selectedMonth);
    if (selectedIndex === -1) return "Invalid month";
    let quarterRanges = [];
    let startMonthIndex = selectedIndex;
  
    do {
      console.log(Number(selectedInterval),'Number(selectedInterval)',interval)
      let startMonth = months[startMonthIndex];
      let endMonthIndex = (startMonthIndex + Number(interval ? interval: selectedInterval)-1) % 12;
      let endMonth = months[endMonthIndex];
      quarterRanges.push({ start: startMonth, end: endMonth });
      console.log(quarterRanges,'quarterRanges')
      startMonthIndex = (startMonthIndex + (Number(interval ? interval: selectedInterval))) % 12;
    } while (startMonthIndex !== selectedIndex);
    return quarterRanges;
  };
  

 const handleCheckTool=async(event,idx,dataInfo)=>{
        console.log(event.target.name,idx,'handleCheckTool',event.target.checked);
        try {
          const toolInfo = dataInfo ? dataInfo : _.cloneDeep(toolData)
          const publishTempInfo = _.cloneDeep(publishTemplate)
          toolInfo[idx][event.target.name] = !event.target.checked
          if (event.target.name === "create_acplan") {
            // toolInfo[idx]["modify_acplan"] =false
          toolInfo[idx]["modify_acplan"] = !event.target.checked
          }
          else if (event.target.name === "allow_set_target_date" && toolInfo[idx][event.target.name] === false) {
            toolInfo[idx]["allow_assgn_task_users"] = false
          }
          publishTempInfo["adt_permissons"] = toolInfo
          const updatedPublishedTemp = await ccLevelValidation(_.cloneDeep(publishTempInfo))
          await dispatch(updatepublishedTempData(updatedPublishedTemp))
          console.log(toolInfo, 'toolInfo');
          settoolData(toolInfo)
          
        } catch (error) {
          console.log(error,'error');
        }
     

    }

    // const handleToolData=async(type,name,event)=>{
    //     const hierarchyDataInfo = _.cloneDeep(manageAuditSlice.hierarchyData)
    //     hierarchyDataInfo.usr_selected.map((ele,idx)=>{
    //         if(ele.audit_type === type){
    //             ele[name] = !event.target.checked
    //         }
    //     })
    //     const responseData = await dispatch(updateHierarchyData(hierarchyDataInfo))
    //     console.log(responseData,'responseData');
    //     if (responseData.status === 200) {
    //         dispatch(setHierarchyData(responseData.data.hData[0]))
    //     }
        
    // }



    const handleToolData = async (type, name, event,hierarchyData) => {
    try {
      const hierarchyDataInfo = hierarchyData ? hierarchyData: _.cloneDeep(manageAuditSlice.hierarchyData);
        console.log("handleToolData",hierarchyDataInfo,type)
      hierarchyDataInfo.usr_selected.map((ele, idx) => {
        if (ele.audit_type === type) {
          ele[name] = !event.target.checked;
        }
      });
  
      const responseData = hierarchyDataInfo
      // await dispatch(updateHierarchyData(hierarchyDataInfo));
      const userSelected = responseData?.usr_selected;
  
      console.log(responseData,'responseData',hierarchyDataInfo,userSelected,event,name,type)

      responseData?.endpoints?.forEach(endpoint => {
        if (Array.isArray(endpoint.adt_users)) {
          endpoint.adt_users.forEach(user => {
            const matchedUser = userSelected.find(sel =>
              sel.user_id === user.user_id && sel.audit_type === user.audit_type
            );
            var userIdx = _.findIndex(userSelected,{user_id :  matchedUser.user_id})

            if (matchedUser) {
              user.create_acplan = matchedUser.create_acplan;
              user.modify_acplan = matchedUser.create_acplan ? matchedUser.create_acplan : matchedUser.modify_acplan;
              user.allow_set_target_date = matchedUser.allow_set_target_date;
              user.allow_assgn_task_users = matchedUser.allow_assgn_task_users;
              userSelected[userIdx].create_acplan = matchedUser.create_acplan;
              userSelected[userIdx].modify_acplan = matchedUser.create_acplan ? matchedUser.create_acplan : matchedUser.modify_acplan;
              userSelected[userIdx].allow_set_target_date = matchedUser.allow_set_target_date;
              userSelected[userIdx].allow_assgn_task_users = matchedUser.allow_assgn_task_users;

            }
          });
        }
      });
  
      const config = {
        _id: responseData._id
      };
      
      const endpointResponse = await dispatch(updateSelecteduser(config, responseData?.data?.hData[0].endpoints, "endpoints"));
      const hInfo = await dispatch(updateHierarchyData(responseData));
  
      if (hInfo.status === 200) {
        dispatch(setHierarchyData(hInfo.data.hData[0]));
      }
    } catch (error) {
      console.error("Error in handleToolData:", error);
    }
  };

    


  if(dataLoaded){
    return (
      <Card style={{ border: '1px solid #e9e9e9' }}>
        <CardBody>
          <div className="row mb-3">
            <div className="col-4">
              <Label htmlFor="autoSizingSelect">Select Repeat Mode</Label>
              <select
                type="select"
                name="repeat_mode"
                label="Name"
                value={publishTemplate.repeat_mode_config.mode_id ? publishTemplate.repeat_mode_config.mode_id : selectedRepeatMode}
                className="form-select"
                id="review_mode_level"
                required
                onChange={(e) => selectRepeatMode(e)}
              >
                <option value="choose" disabled>Choose...</option>
                {
                  props.repeatModeData.map((data, idx) => {
                    return (
                      <option value={data.mode_id} selected key={idx}>{data.mode}</option>
                    )
                  })
                }
              </select>
            </div>
     
            <br/>
            {publishTemplate.repeat_mode_config.mode_id === "0" && (
              <>
                <div className="row mt-3">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="start_date" className="form-label fw-bold">
                      Audit Starts on :<span className="text-danger">*</span>
                    </label>
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

                  <div className="col-md-6 mb-3">
                    <label htmlFor="end_date" className="form-label fw-bold">
                      Audit End on :<span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      type="date"
                      id="end_date"
                      value={publishTemplate.audit_end_date || ""}
                      onChange={async(e) => {
                        const publishTempInfo = _.cloneDeep(publishTemplate)
                        publishTempInfo["audit_end_date"] = e.target.value
                        if (publishTempInfo.settings.enable_review) {
                          publishTempInfo["review_end_date"] = e.target.value
                        }
                        var updatedData = await ccLevelValidation(publishTempInfo)
                        props.updateTempMasterInfo(updatedData)
                      }}
                      onKeyDown={(e) => e.preventDefault()}
                      disabled={!startDate}
                      min={startDate}
                    />
                  </div>
                </div>
              </>
            )}
            {
              manageAuditSlice.tempInfo?.capa_enabled &&
              <div className='text-danger' style={{ fontSize: "smaller" }}>
                {"(To go the next stage choose any one role create action plan checked)"}
              </div>
            }

            {
              publishTemplate.repeat_mode_config.mode_id && 
              showRepeatModeComponent(publishTemplate.repeat_mode_config.mode_id)
            }

          </div>
          <Row className="g-4">
            <Col lg={publishTemplate.settings.enable_review ? 6: 12} md={12}>
              <Card className="h-100" style={{ border: '1px solid #e9e9e9' }}>
                <CardBody className="pb-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <CardTitle className="text-lg font-bold mb-0">Audit Configure</CardTitle>
                  </div>
                  <ListGroup flush className="border rounded shadow-sm">
                    <ListGroupItem className="text-muted">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="fw-bold mb-2">
                            <i className="mdi mdi-circle-medium me-1"></i>Display:
                          </div>
                          <div className="d-flex flex-column">
                            <div className="d-flex align-items-center">
                              <input
                                type="checkbox"
                                name="audit_score_preview"
                                className="ms-3"
                                checked={publishTemplate.settings.audit_score_preview}
                                onClick={(e) => handleUpdate(_.cloneDeep(publishTemplate),"audit_score_preview",e)}
                              />
                              <span className="ms-2">Audit Score</span>
                            </div>
                          </div>
                        </div>


                      </div>
                    </ListGroupItem>
                    <ListGroupItem className="text-muted">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="fw-bold mb-2">
                            <i className="mdi mdi-circle-medium me-1"></i>Track Location:
                          </div>
                          <div className="d-flex flex-column">
                            <div className="d-flex align-items-center">
                              <input
                                type="checkbox"
                                name="audit_coords_enable"
                                className="ms-3"
                                checked={publishTemplate.settings.audit_coords_enable}
                                onClick={(e) => handleUpdate(_.cloneDeep(publishTemplate),"audit_coords_enable",e)}
                              />
                              <span className="ms-2">Auditor</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ListGroupItem>
                    <ListGroupItem className="text-muted">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="fw-bold mb-2">
                            <i className="mdi mdi-circle-medium me-1"></i>Remind Auditor through:
                          </div>
                          <div className="d-flex flex-column">
                            <div className="d-flex align-items-center">
                              <input
                                type="checkbox"
                                name="sms"
                                className="ms-3"
                                checked={publishTemplate.reminder_info.sms}
                                onClick={(e) => {
                                  let publishTemplateInfo = _.cloneDeep(publishTemplate)
                                  console.log(e.target.checked,'evennntt')
                                  publishTemplateInfo["reminder_info"]["sms"]= !e.target.checked
                                  props.updateTempMasterInfo(publishTemplateInfo)
                                }
                                  // handleUpdate(_.cloneDeep(publishTemplate),"reminder_info.sms",e)
                                }
                              />
                              <span className="ms-2">SMS</span>
                            </div>
                            <div className="d-flex align-items-center  mt-2">
                              <input
                                type="checkbox"
                                name="email"
                                className="ms-3"
                                checked={publishTemplate.reminder_info.email}
                                onClick={(e) =>{
                                  let publishTemplateInfo = _.cloneDeep(publishTemplate)
                                  publishTemplateInfo["reminder_info"]["email"]= !e.target.checked
                                  props.updateTempMasterInfo(publishTemplateInfo)
                                }
                                  //  handleUpdate(_.cloneDeep(publishTemplate),"reminder_info.email",e)

                                }

                              />
                              <span className="ms-2">EMAIL</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ListGroupItem>

                    <ListGroupItem className="text-muted">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="fw-bold mb-2">
                            <i className="mdi mdi-circle-medium me-1"></i>Capture Signature
                          </div>
                          <div className="d-flex flex-column">
                            <div className="d-flex align-items-center">
                              <input
                                type="checkbox"
                                name="audit_signature"
                                className="ms-3"
                                checked={publishTemplate.settings.audit_signature}
                                onClick={(e) => {
                                  let publishTemplateInfo = _.cloneDeep(publishTemplate)
                                  console.log(e.target.checked, 'evennntt')
                                  publishTemplateInfo["settings"]["audit_signature"] = !e.target.checked
                                  props.updateTempMasterInfo(publishTemplateInfo)
                                }
                                  // handleUpdate(_.cloneDeep(publishTemplate),"reminder_info.sms",e)
                                }
                              />
                              <span className="ms-2">Auditor</span>
                            </div>
                            {
                              publishTemplate.settings.enable_review &&
                              <div className="d-flex align-items-center  mt-2">
                                <input
                                  type="checkbox"
                                  name="email"
                                  className="ms-3"
                                  checked={publishTemplate.settings.review_signature}
                                  onClick={(e) => {
                                    let publishTemplateInfo = _.cloneDeep(publishTemplate)
                                    publishTemplateInfo["settings"]["review_signature"] = !e.target.checked
                                    props.updateTempMasterInfo(publishTemplateInfo)
                                  }
                                    //  handleUpdate(_.cloneDeep(publishTemplate),"reminder_info.email",e)

                                  }

                                />
                                <span className="ms-2">Reviewer</span>
                              </div>
                            }
                          
                          </div>
                        </div>
                      </div>
                    </ListGroupItem>

                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
            {
              publishTemplate.settings.enable_review &&
              <Col lg={publishTemplate.settings.enable_review ? 6: 12} md={12}>
              <Card className="h-100" style={{ border: '1px solid #e9e9e9' }}>
                <CardBody className="pb-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <CardTitle className="text-lg font-bold mb-0">Customise :</CardTitle>
                  </div>
                  <ListGroup flush className="border rounded shadow-sm">
                    <ListGroupItem className="text-muted">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="fw-bold mb-2">
                            <i className="mdi mdi-circle-medium me-1"></i>After Review:
                          </div>
                          <div className="d-flex flex-column">
                            <div className="d-flex align-items-center">
                                  <input
                                    type="checkbox"
                                    name="audit_score_preview"
                                    className="ms-3"
                                    checked={publishTemplate.settings.review_pdf_download}
                                    onClick={(e) => handleUpdate(_.cloneDeep(publishTemplate), "review_pdf_download", e)}
                                  />
                                  <span className="ms-2">Download Report</span>
                            </div>
                                <div className="d-flex align-items-center mt-2">
                                  <input
                                    type="checkbox"
                                    name="audit_score_preview"
                                    className="ms-3"
                                    checked={publishTemplate.settings.review_acplan_create}
                                    onClick={(e) => handleUpdate(_.cloneDeep(publishTemplate), "review_acplan_create", e)}
                                  />
                                  <span className="ms-2">Allocate Capa</span>
                                </div>

                          </div>
                        </div>


                      </div>
                    </ListGroupItem>
                    {/* <ListGroupItem className="text-muted">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="fw-bold mb-2">
                            <i className="mdi mdi-circle-medium me-1"></i>Track Location:
                          </div>
                          <div className="d-flex flex-column">
                            <div className="d-flex align-items-center">
                              <input
                                type="checkbox"
                                name="audit_coords_enable"
                                className="ms-3"
                                checked={publishTemplate.settings.audit_coords_enable}
                                onClick={(e) => handleUpdate(_.cloneDeep(publishTemplate),"audit_coords_enable",e)}
                              />
                              <span className="ms-2">Auditor</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ListGroupItem> */}
                   
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
            }



            <Row>
              <Col lg={12} md={12}>
                <Card className="h-100" style={{ border: '1px solid #e9e9e9' }}>
                  <CardBody className="pb-1">
                    <div className="d-flex justify-content-between align-items-center">
                      {/* <CardTitle className="text-lg font-bold mb-0">Permissions :</CardTitle> */}
                    </div>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Permission</th>
                          <th>Create Action Plan</th>
                          <th>Modify Action Plan</th>
                          <th>Allow Set Target Date</th>
                          <th>Allow Assign Task Users</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          console.log(toolData, 'toolData')
                        }
                        {publishTemplate.adt_permissons.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            <td key={rowIndex}>{row.func_name}</td>
                            <td><input className='ms-2' checked={row.create_acplan} name={"create_acplan"} onClick={(e) => {
                              handleCheckTool(e, rowIndex);
                              handleToolData(row.func_id, "create_acplan", e)
                            }} type='checkbox' /></td>
                            <td><input className='ms-2' checked={row.modify_acplan || row.create_acplan} onClick={(e) => {
                              handleCheckTool(e, rowIndex);
                              handleToolData(row.func_id, 'modify_acplan', e)
                            }} 
                            // disabled={!row.create_acplan} 
                            name={"modify_acplan"} type='checkbox' /></td>
                            <td><input className='ms-2' checked={row.func_id === "3" ? true : row.allow_set_target_date} onClick={(e) => {
                              handleCheckTool(e, rowIndex);
                              handleToolData(row.func_id, 'allow_set_target_date', e)
                            }}
                            disabled={row.func_id === "3"}
                            name={"allow_set_target_date"} type='checkbox' /></td>
                            <td><input className='ms-2' checked={row.func_id === "3" ? true : row.allow_assgn_task_users} onClick={(e) => {
                              handleCheckTool(e, rowIndex);
                              handleToolData(row.func_id, 'allow_assgn_task_users', e)
                            }}
                            //  disabled={!row.allow_set_target_date} 
                            disabled={row.func_id === "3"}
                             name={"allow_assgn_task_users"} type='checkbox' /></td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <ListGroupItem className="d-flex align-items-center justify-content-between text-muted">
                      <div>
                        <button onClick={() => {
                          setopenTaskUsers(true)
                        }} className='btn btn-sm btn-primary me-2'>Customise Users</button>
                      </div>
                    </ListGroupItem>


                  </CardBody>
                </Card>
              </Col>


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

          </Row>
        </CardBody>
      </Card>
    )
  }
  else{
    console.log("load")
    return null
  }
}
export default ScheduleConfiguration
