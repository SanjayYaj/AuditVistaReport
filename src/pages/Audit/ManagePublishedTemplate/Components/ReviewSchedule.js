import React, { useEffect,useState,useMemo } from 'react'
import { Row, Col, Offcanvas, CardFooter, FormGroup, Container, Input, Nav, Button, TabContent, Label, TabPane, ListGroup, ListGroupItem, Card, CardBody, CardTitle, Spinner, NavItem, NavLink, OffcanvasHeader, OffcanvasBody } from 'reactstrap';
import { useSelector } from 'react-redux';
import TableContainer from 'common/TableContainer'
import Calendar from './Calendar28days'
import { Popconfirm } from 'antd';
import ReviewCard from './ReviewCard';
import Swal from 'sweetalert2';
var moment = require('moment')


const ReviewSchedule = (props) => {
    const manageAuditSlice = useSelector(state => state.manageAuditSlice)
    const publishTemplate = manageAuditSlice.publishTemplate
    const [selectedRepeatMode, setselectedRepeatMode] = useState("choose")
    const [timeInfo, settimeInfo] = useState({})
    const [dataLoaded, setdataLoaded] = useState(true)
    const [selectedInterval, setSelectedInterval] = useState("#")
    const [configData, setConfigData] = useState(JSON.parse(sessionStorage.getItem("authUser")).config_data)
    const [shiftCount, setshiftCount] = useState(null)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [fromDate, setfromDate] = useState('');
    const [updateSchedule, setupdateSchedule] = useState(false);
    const [currentStageInfo, setcurrentStageInfo] = useState(null);
    const [updateShiftInfo,setupdateShiftInfo] = useState(null)
    const [auditScheduleInfo,setauditScheduleInfo] = useState(null)
    const [defaultInterval,setdefaultInterval] = useState(8)
    console.log(updateShiftInfo,'updateShiftInfo')
    

    useEffect(()=>{
        console.log("ReviewSchedule")
        var today = new Date()
        const dd = today.getDate().toString().length == 1 ? "0" + today.getDate().toString() : today.getDate().toString()
        const mm = String(today.getMonth() + 1).length == 1 ? "0" + String(today.getMonth() + 1) : today.getMonth() + 1
        const yyyy = today.getFullYear()
        const fromate_date = (today = yyyy + "-" + mm + "-" + dd)
        setfromDate(fromate_date)
        setStartDate(publishTemplate.review_start_date)
        setEndDate(publishTemplate.review_end_date)
    },[])


    const updateShiftData=(data,idx)=>{
      console.log(data,idx,'index')
      setupdateShiftInfo(
        {
          item: data,
          position: idx
        }
      )
      var publishTempInfo = _.cloneDeep(publishTemplate)
      setauditScheduleInfo(publishTempInfo["repeat_mode_config"]["scheduled_shift"][idx])

  }

  const updatedtedShiftInfo=async(index)=>{
    const publishTempInfo = _.cloneDeep(publishTemplate)
    publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"][index]=updateShiftInfo.item
    console.log(publishTempInfo,'publishTempInfo')
    setupdateShiftInfo(null)
    var updatedData = await ccLevelValidation(publishTempInfo)
    props.updateTempMasterInfo(updatedData)
  } 



    const handleScheduleTypeChange = async (event, publishTempInfo) => {
        console.log(event.target.value, 'event')
        if (currentStageInfo.mode_id === "1") {
            publishTempInfo["repeat_mode_config_review"][0]["schedule_type"] = event.target.value
            // publishTempInfo.repeat_mode_config.scheduled_shift = []
            publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"]=[]
            delete publishTempInfo["repeat_mode_config_review"][0].shift_type
            if (event.target.value === "24") {
                publishTempInfo["repeat_mode_config_review"][0].scheduled_shift = [{ start: "00:00", end: "23:59", title: "Shift", }];
                settimeInfo({
                    startTime: "00:00",
                    endTime: "23:59",
                })
                handleAddCustomSchedule("00:00", "23:59", publishTempInfo)
            }

        }
        else if (currentStageInfo.mode_id === "2") {
            publishTempInfo["repeat_mode_config_review"][0]["schedule_type"] = event.target.value
            if (event.target.value === "7") {
                publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] = getNextSevenDays()
            }
            else {
                publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] = []
                publishTempInfo["repeat_mode_config_review"][0]["days"] = publishTempInfo["repeat_mode_config_review"][0]["days"]?.map((ele, idx) => {
                    return { day: ele.day, day_id: ele.day_id, checked: ele.checked }
                })
            }
        }
        else if (currentStageInfo.mode_id === "3") {
            publishTempInfo["repeat_mode_config_review"][0]["evermnth"] = event.target.value
            delete publishTempInfo["repeat_mode_config_review"][0]["months"]
            delete publishTempInfo["repeat_mode_config_review"][0]["month_start"]
            delete publishTempInfo["repeat_mode_config_review"][0]["schedule_type"]
            publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] = []
        }
        var updatedData = await ccLevelValidation(publishTempInfo)
        setcurrentStageInfo(publishTempInfo.repeat_mode_config_review[0])
        props.updateTempMasterInfo(updatedData)
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
        if (publishTemplate["repeat_mode_config_review"][0].schedule_type !== "24") {
          const isOverlapping = publishTemplate["repeat_mode_config_review"][0].scheduled_shift?.some((schedule) => {
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
          if (publishTemplate["repeat_mode_config_review"][0]["shift_type"] === "automate") {
            publishTemplate["repeat_mode_config_review"][0]["scheduled_shift"] = [newEvent];
          }
          else {
            publishTemplate["repeat_mode_config_review"][0]["scheduled_shift"] = [...publishTemplate["repeat_mode_config_review"][0]["scheduled_shift"], newEvent];
          }
        }
        settimeInfo({})
        setdataLoaded(true)
        var updatedData =await ccLevelValidation(publishTemplate)
        setcurrentStageInfo(publishTemplate["repeat_mode_config_review"][0])
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
            var index = cellProps.row.index
            console.log(auditScheduleInfo,'auditScheduleInfo');
            return (
              <>
                {/* {
                  updateShiftInfo?.position === index ?
                    <>
                      <Input
                        type="time"
                        value={updateShiftInfo?.item?.start || ""}
                        onChange={(e) => {
                          const newTime = e.target.value;
                          console.log(newTime,'newTime');
                          if (newTime >= auditScheduleInfo.start) {
                            const timeInfoUpdt = _.cloneDeep(updateShiftInfo);
                            timeInfoUpdt.item.start = newTime;
                            setupdateShiftInfo(timeInfoUpdt);
                          } else {
                            // alert("Please select a time after 09:00");
                            Swal.fire({
                              title: "Error",
                              text: "Review Schedule cannot be less than Audit schedule",
                              icon: "error",
                            });
                          }
                        }}

                      />

                    </>
                    : */}
                      {moment(item.start, "HH:mm").format("hh:mm A")}

                {/* } */}
                {/* {} */}
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
            var index = cellProps.row.index

            return (
              <>
                {
                  updateShiftInfo?.position === index ?
                    <>
                      <Input
                        type="time"
                        value={updateShiftInfo?.item?.end || ""}
                        // onChange={(e) => {
                        //   const timeInfoUpdt = _.cloneDeep(updateShiftInfo)
                        //   timeInfoUpdt["item"]["end"] = e.target.value
                        //   setupdateShiftInfo(timeInfoUpdt)
                        // }
                        // }

                        onChange={(e) => {
                          const newTime = e.target.value;
                          console.log(newTime,'newTime');
                          if (newTime >= auditScheduleInfo.end) {
                            const timeInfoUpdt = _.cloneDeep(updateShiftInfo);
                            timeInfoUpdt.item.end = newTime;
                            setupdateShiftInfo(timeInfoUpdt);
                          } else {
                            // alert("Please select a time after 09:00");
                            Swal.fire({
                              title: "Error",
                              text: "Review Schedule cannot be less than Audit schedule",
                              icon: "error",
                            });
                          }
                        }}

                      />
                    </>
                    :
                    <>
                      {moment(item.end, "HH:mm").format("hh:mm A")}

                    </>
                }



              </>
            )
          }
        },
        {
          accessor: 'menus',
          Header: 'Edit / Delete',
          // hidden : this.state.publishTemplate.repeat_mode_config.schedule_type === "24" ? true : false,
          Cell: (cellProps) => {
            var item = cellProps.row.original
            var index = cellProps.row.index
            return (
              <>
                {
                  updateShiftInfo?.position === index ?
                    <>
                      <Popconfirm placement="leftBottom" title={`Are You sure to update this ?`}
                        onConfirm={async () => {
                          updatedtedShiftInfo(index)
                        }}
                      >
                        <Button outline 
                        className="btn btn-sm btn-soft-primary">
                          {/* <i className="mdi mdi-pencil-outline" /> */}
                          Update
                        </Button> &nbsp;
                        <Button
                        outline 
                        className="btn btn-sm btn-soft-danger"
                          onClick={() => {
                            setupdateShiftInfo(null)
                          }}
                        >
                          Cancel
                        </Button>
                      </Popconfirm>
                    </>

                    :
                    <>

                      <Button outline onClick={() => {
                        updateShiftData(item, index)
                      }} className="btn btn-sm btn-soft-primary">
                        <i className="mdi mdi-pencil-outline" />
                      </Button>
                    </>
                } &nbsp;
              <Popconfirm placement="leftBottom" title={`Are You sure to delete ?`}
                onConfirm={async () => {
                  console.log("delete")
                  var publishTemplateInfo = _.cloneDeep(publishTemplate)
                  var filteredInfo = publishTemplateInfo.repeat_mode_config_review[0]?.scheduled_shift.filter((ele) => {
                    if (ele.start !== item.start) {
                      return ele
                    }
                  })
                  console.log(filteredInfo,'filteredInfo');
                  publishTemplateInfo["repeat_mode_config_review"][0]["scheduled_shift"] = filteredInfo
                  const updatedData = await ccLevelValidation(publishTemplateInfo)
                  console.log(updatedData,'updatedData');
                  props.updateTempMasterInfo(updatedData)
                  setupdateShiftInfo(null)

                }} >
                <Button outline className="btn btn-sm btn-soft-danger">
                  <i className="bx bx-trash" />
                </Button>
              </Popconfirm>
              </>
            )
          }
        }
      ]
    , [publishTemplate.repeat_mode_config
      .scheduled_shift,updateShiftInfo]
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
            publishTemplateInfo.repeat_mode_config_review[0]["scheduled_shift"] = []
            var start_date = await ordinal_suffix_of(dateInfo.startDate)
            publishTemplateInfo.repeat_mode_config_review[0]["scheduled_shift"] = [{ startDate: `Every Month on ${dateInfo.startDate}${start_date}`, dateInfo, endDate: `Every Month on ${dateInfo.endDate}${await ordinal_suffix_of(dateInfo.endDate)}`, }]
            var updatedData = await ccLevelValidation(publishTemplateInfo)
            setcurrentStageInfo(publishTemplateInfo.repeat_mode_config_review[0])
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
            currentStartTime = currentEndTime;
          }
          if(publishTemplateInfo.repeat_mode_config_review[0]["shift_type"] === "automate"){
            publishTemplateInfo.repeat_mode_config_review[0]["scheduled_shift"] = [ ...shifts];
      
          }
          else{
            publishTemplateInfo.repeat_mode_config_review[0]["scheduled_shift"] = [...publishTemplate.repeat_mode_config_review[0]["scheduled_shift"], ...shifts];
          }
          publishTemplateInfo.repeat_mode_config_review[0]["shift_count"]= shiftCount
          var updatedData =await ccLevelValidation(publishTemplateInfo)
          props.updateTempMasterInfo(updatedData)
      
        }


    const handleDayClick = (index) => {
        const publishTemplateInfo = _.cloneDeep(publishTemplate)
        var configData = JSON.parse(sessionStorage.getItem("authUser")).config_data
        publishTemplateInfo.repeat_mode_config_review[0]["scheduled_shift"] = []
        setTimeout(async () => {
            const updatedDays = publishTemplate.repeat_mode_config_review[0].days.map((ele, idx) =>
                idx === index ? { ...ele, isSelected: !ele.isSelected } : { ...ele, isSelected: false }
            );
            console.log(updatedDays, 'updatedDays')
            publishTemplateInfo.repeat_mode_config_review[0].days = updatedDays
            configData.month_list = updatedDays
            publishTemplateInfo.repeat_mode_config_review[0].scheduled_shift = updatedDays[index]["isSelected"] ? getNextSevenDays(Number(publishTemplateInfo.repeat_mode_config_review[0].days[index]["day_id"] === "0" ? 7 : publishTemplateInfo.repeat_mode_config_review[0].days[index]["day_id"])) : []
            var updatedData = await ccLevelValidation(publishTemplateInfo)
            setcurrentStageInfo(updatedData.repeat_mode_config_review[0])
            props.updateTempMasterInfo(updatedData)
        }, 200);

    }
      
    


    const ccLevelValidation = async (publishTempInfo) => {

        if (publishTempInfo.repeat_mode_config_review[0]["mode"]=== "One time" && (publishTempInfo.review_start_date !== null && publishTempInfo.review_end_date !== null) ) {
          publishTempInfo["cc_level"] = 4
        }
        else if (publishTempInfo.repeat_mode_config_review[0].scheduled_shift?.length > 0) {
          publishTempInfo["cc_level"] = 4
        }
        else {
          publishTempInfo["cc_level"] = 3
    
        }
        return publishTempInfo
    
      }

    const updateMonthInfo = async (publishTempInfo) => {
        var selectedIdx = _.findIndex(publishTempInfo.repeat_mode_config.months, { isSelected: true })
        console.log(selectedIdx, 'selectedIdx')
        if (selectedIdx !== -1) {
            await handleDayClickMonth(selectedIdx, publishTempInfo.repeat_mode_config.months[selectedIdx]["month"], publishTempInfo)
        }
        else {
            props.updateTempMasterInfo(publishTempInfo)
        }

    }



      const handleDayClickMonth = async (index, value,publishTempInfo) => {
        console.log('value', value)
        var publishTemplateInfo = publishTempInfo ? publishTempInfo : _.cloneDeep(publishTemplate)
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        publishTemplateInfo.repeat_mode_config_review[0].scheduled_shift = []
        const updatedMonths = authUser.config_data.month_list.map((ele, idx) =>
          idx === index ? { ...ele, isSelected: !ele.isSelected } : { ...ele, isSelected: false }
        )
        console.log(updatedMonths, 'updatedMonths');
        publishTemplateInfo.repeat_mode_config_review[0].months = updatedMonths
        publishTemplateInfo.repeat_mode_config_review[0].scheduled_shift = updatedMonths[index]["isSelected"] ? await getNextQuarterDateRanges(value,publishTemplateInfo.repeat_mode_config_review[0].interval ) : []
        console.log(publishTemplateInfo.repeat_mode_config.scheduled_shift,'publishTemplateInfo.repeat_mode_config.scheduled_shift')
        setcurrentStageInfo(publishTemplateInfo["repeat_mode_config_review"][0])
       var updatedData =await ccLevelValidation(publishTemplateInfo)
        props.updateTempMasterInfo(updatedData)
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
    

      const handleIntervalChange=(value)=>{
        console.log(value,'value');
        setdefaultInterval(Number(value))
        const publishTempInfo = _.cloneDeep(publishTemplate)
        publishTempInfo["repeat_mode_config_review"][0]["week_interval"] = Number(value)
        publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] =getNextEightDays(Number(value))
        console.log(getNextEightDays(Number(value)),'getNextEightDays(Number(value))');
        setcurrentStageInfo(publishTempInfo.repeat_mode_config_review[0])
        props.updateTempMasterInfo(publishTempInfo)
      }
      


  const getNextEightDays = (dynamicInterval) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Get today's date
    const today = new Date();
    const nextSevenDays = [];

    for (let i = 0; i < dynamicInterval; i++) {
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


      const selectRepeatMode = async (event) => {
        console.log(event.target.value, 'event')
        var findIdx = _.findIndex(props.repeatModeData, { mode_id: event.target.value })
        if (findIdx !== -1) {
          const publishTempInfo = _.cloneDeep(publishTemplate)
          // publishTempInfo.repeat_mode = props.repeatModeData[findIdx]["mode"]
          publishTempInfo["repeat_mode_config_review"][0]["mode"] = props.repeatModeData[findIdx]["mode"]
          publishTempInfo["repeat_mode_config_review"][0]["mode_id"] = props.repeatModeData[findIdx]["mode_id"]
          publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] =[]
          delete publishTempInfo["repeat_mode_config_review"][0]["schedule_type"] 
          const updatedPublishedTemp = await ccLevelValidation(publishTempInfo)
          setcurrentStageInfo(publishTempInfo["repeat_mode_config_review"][0])
          props.updateTempMasterInfo(updatedPublishedTemp)
          console.log(publishTempInfo, 'publishTempInfo', updatedPublishedTemp)
          setselectedRepeatMode(props.repeatModeData[findIdx]["mode_id"])
        }
      }


       const showRepeatModeComponent = (mode) => {
          console.log(timeInfo, 'timeInfo')
      
          return (
            <>
              {
                mode === "1" && 
                <>
                {/* {
                  publishTemplate.repeat_mode_config.schedule_type ==="custom" &&
                  <div className="col">
                    <FormGroup>
                      <Label for="scheduleType">Select Schedule Type :<span className="text-danger">*</span></Label>
                      <Input
                        type="select"
                        name="scheduleType"
                        id="scheduleType"
                        defaultValue={currentStageInfo?.schedule_type ? currentStageInfo?.schedule_type : "select"}
                        onChange={(e) => { handleScheduleTypeChange(e, _.cloneDeep(publishTemplate)) }}
                      >
                        <option value="select" disabled={true}>Select</option>
                        <option value="24">24 hrs</option>
                        <option value="custom">Custom</option>
                      </Input>
                    </FormGroup>
                  </div>
                } */}

                  <div className="col text-end">
                        <Button className="btn-sm" color='danger'
                          onClick={() => {
                            showDetailedInfo(null, false)
                          }}
                        >Close</Button>
                      </div>
                  <div>
                    {
                      currentStageInfo?.schedule_type &&
                      <div style={{ border: '1px solid #e9e9e9', borderRadius: '5px' }} className="p-3 mt-2">
                        <Row>
                          <Col>
                            {/* {currentStageInfo.schedule_type === "custom" && (
                              <div>
                                <div className="d-flex align-items-center gap-3 mb-3 mt-2">
                                  <div>
                                    <Input
                                      type="radio"
                                      id="scheduleShift"
                                      name="shiftType"
                                      value="schedule"
                                      disabled={true}
                                      checked={
                                        currentStageInfo
                                          ?.shift_type === "schedule"
                                      }
                                      onClick={(e) => {
                                        var publishTemplateInfo = _.cloneDeep(publishTemplate);
                                        publishTemplateInfo["repeat_mode_config_review"][0][
                                          "shift_type"
                                        ] = e.target.value;
                                        publishTemplateInfo["repeat_mode_config_review"][0][
                                          "scheduled_shift"
                                        ] = [];
                                        setcurrentStageInfo(publishTemplateInfo["repeat_mode_config_review"][0])
                                        delete publishTemplateInfo["repeat_mode_config_review"][0][
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
                                        currentStageInfo
                                          .shift_type === "automate"
                                      }
                                      disabled={true}
                                      onClick={(e) => {
                                        var publishTemplateInfo = _.cloneDeep(publishTemplate);
                                        publishTemplateInfo["repeat_mode_config_review"][0][
                                          "shift_type"
                                        ] = e.target.value;
                                        publishTemplateInfo["repeat_mode_config_review"][0][
                                          "scheduled_shift"
                                        ] = [];
                                        delete publishTemplateInfo["repeat_mode_config_review"][0][
                                          "shift_count"
                                        ];
                                        setcurrentStageInfo(publishTemplateInfo["repeat_mode_config_review"][0])
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
                                {publishTemplate["repeat_mode_config_review"][0].shift_type === "automate" && (
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
                                            publishTemplate["repeat_mode_config_review"][0]
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
                                      {publishTemplate["repeat_mode_config_review"][0].shift_type && (
                                        <div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (publishTemplate["repeat_mode_config_review"][0].shift_type === "schedule") {
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
       */}
                            {publishTemplate["repeat_mode_config_review"][0].scheduled_shift?.length > 0 && (
                              <div>
                                <Label>Scheduled Jobs</Label> &nbsp;
                                {
                                  publishTemplate["repeat_mode_config_review"][0]["schedule_type"] === "24" &&
                                  <span className='text-pink'>(Reviewer schedule for this will be extended for 1 day from the Audit Schedule.)</span>
                                }
                                <TableContainer
                                  columns={columnsCalendar}
                                  data={
                                    publishTemplate["repeat_mode_config_review"][0]
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
                  <div className="col">
                    <FormGroup>
                      <Label for="scheduleType">Review Interval :<span className="text-danger">*</span></Label>
                      <Input
                        type="number"
                        name="week_interval"
                        min={8}
                        defaultValue={publishTemplate.repeat_mode_config_review[0]["week_interval"] ?publishTemplate.repeat_mode_config_review[0]["week_interval"] : defaultInterval}
                        onChange={(e)=>{
                          handleIntervalChange(e.target.value)
                        }}
                        // id="scheduleType"
                        // defaultValue={currentStageInfo?.schedule_type ? currentStageInfo?.schedule_type : "select"}
                        // onChange={(e) => { handleScheduleTypeChange(e, _.cloneDeep(publishTemplate)) }}
                      >
                        {/* <option value="select" disabled={true}>Select</option>
                        <option value="7">7 days</option>
                        <option value="custom">Custom</option> */}
                      </Input>
                    </FormGroup>
                  </div>
                  <div className="col text-end">
                        <Button className="btn-sm" color='danger'
                          onClick={() => {
                            showDetailedInfo(null, false)
                          }}
                        >Close</Button>
                      </div>
      
                  <Row>
                    {
                      currentStageInfo.schedule_type === "custom" &&
                      <>
      
                        <Col md={6}>
                          <CardTitle>Select Day</CardTitle>
                          <div className="list-group">
                            {currentStageInfo.days.map((ele, idx) => (
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
                                  defaultChecked={ele?.isSelected}
                                // onChange={() => this.handleDayClick(idx)}
                                />
                              </div>
                            ))}
                          </div>
                        </Col>
                      </>
                    }
      
      
                    <Col md={6} className="d-flex align-items-center justify-content-center">
                      {currentStageInfo.scheduled_shift.length > 0 ? (
                        <div className="w-100">
                          <CardTitle>Scheduled Week <span className='text-pink' style={{fontSize:"smaller"}}>(From the Audit schedule it takes {publishTemplate.repeat_mode_config_review[0]["week_interval"] ?publishTemplate.repeat_mode_config_review[0]["week_interval"] : defaultInterval} days to complete the Review schedule) :</span> </CardTitle>
                          <ListGroup flush className="border rounded shadow-sm">
                            <ListGroupItem className="d-flex align-items-center justify-content-between">
                              <div className="fw-bold text-muted">Review Starts On:</div>
                              <span className="text-success badge badge-soft-success fw-bold font-size-12">{currentStageInfo.scheduled_shift[0]["day"]}</span>
                            </ListGroupItem>
                            <ListGroupItem className="d-flex align-items-center justify-content-between">
                              <div className="fw-bold text-muted">Review Ends On:</div>
                              <span className="text-danger badge badge-soft-danger fw-bold font-size-12">{currentStageInfo.scheduled_shift[currentStageInfo.scheduled_shift.length - 1]["day"]}</span>
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
                  {
                    /*
                  <div className="col-4">
                    <FormGroup>
                      <Label for="scheduleType">Select Schedule Type :<span className="text-danger">*</span></Label>
                      <Input
                        type="select"
                        name="scheduleType"
                        id="scheduleType"
                        defaultValue={currentStageInfo?.evermnth ? currentStageInfo?.evermnth : "select"}
                        onChange={(e) => { handleScheduleTypeChange(e, _.cloneDeep(publishTemplate)) }}
                      >
                        <option value="select" disabled={true}>Select</option>
                        <option value="evermnth">Every Month</option>
                        <option value="custom">Custom Month</option>
                      </Input>
                    </FormGroup>
                  </div>
                  */}


                  <div className="col text-end">
                        <Button className="btn-sm" color='danger'
                          onClick={() => {
                            showDetailedInfo(null, false)
                          }}
                        >Close</Button>
                      </div>
                  <Row>
                    {/* {
                      currentStageInfo.evermnth === "evermnth" &&
                      <div className="d-flex align-items-center gap-3 mb-3 mt-2">
                        <div>
                          <Input
                            type="radio"
                            id="month_start"
                            name="monthStart"
                            value="mstart"
                            checked={
                              currentStageInfo
                                ?.schedule_type === "mstart"
                            }
                            onClick={async (e) => {
                              const publishTempInfo = _.cloneDeep(publishTemplate)
                              publishTempInfo["repeat_mode_config_review"][0]["schedule_type"] = e.target.value
                              publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] = [{
                                startDate: "Every Month on 1st",
                                endDate: "Every Month on 28th",
                                dateInfo: {
                                  startDate: 1,
                                  endDate: 28
                                }
                              }]
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
                              publishTemplate["repeat_mode_config_review"][0]
                                .schedule_type === "custom"
                            }
                            onClick={async (e) => {
                              var publishTemplateInfo = _.cloneDeep(publishTemplate);
                              publishTemplateInfo["repeat_mode_config_review"][0][
                                "schedule_type"
                              ] = "custom";
                              publishTemplateInfo["repeat_mode_config_review"][0][
                                "scheduled_shift"
                              ] = [];
                              setcurrentStageInfo(publishTemplateInfo["repeat_mode_config_review"][0])
                              var updatedData = await ccLevelValidation(publishTemplateInfo)
                              props.updateTempMasterInfo(updatedData)
      
                            }}
                          />
                          <Label for="custom_month">&nbsp; Custom</Label>
                        </div>
                      </div>
                    } */}
                    {
                      publishTemplate["repeat_mode_config_review"][0].evermnth === "custom" &&
                      <>
                        {/* <Col md={6}>
                          <div style={{ border: '1px solid #e9e9e9', borderRadius: '5px' }} className="p-3">
                            <CardTitle>Select Start Month</CardTitle>
                            <label>Choose Month Interval : <span className='text-danger'>*</span></label>
                            <select onChange={async(e)=>{
                              setSelectedInterval(e.target.value)
                              const publishTempInfo = _.cloneDeep(publishTemplate)
                              publishTempInfo["repeat_mode_config_review"][0]["interval"]=e.target.value
                              setcurrentStageInfo(publishTempInfo["repeat_mode_config_review"][0])
                              await updateMonthInfo(publishTempInfo)
                            }} defaultValue={publishTemplate["repeat_mode_config_review"][0]["interval"] ? publishTemplate["repeat_mode_config_review"][0]["interval"] : selectedInterval} className="form-control select2 mb-3 mb-xxl-0">
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
                            {publishTemplate["repeat_mode_config_review"][0]["interval"] &&
                              < div className="list-group">
                            {(publishTemplate["repeat_mode_config_review"][0].months ? publishTemplate["repeat_mode_config_review"][0].months : configData.month_list).map((ele, idx) => (
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
                        </Col> */}
                           <div className="w-100 mt-3">
                              <Label>Monthly Schedule :</Label>
                              <div>
                                <span className="text-dark">
                                  The reviewer schedule will ends duration of
                                  <input
                                    type="number"
                                    min={publishTemplate["repeat_mode_config_review"][0]["duration"]}
                                    defaultValue={publishTemplate["repeat_mode_config_review"][0]["duration"]}
                                    className="mx-2"
                                    onChange={(e) => {
                                      const publishTemplateInfo = _.cloneDeep(publishTemplate)
                                      publishTemplateInfo["repeat_mode_config_review"][0]["duration"] = Number(e.target.value)
                                      props.updateTempMasterInfo(publishTemplateInfo)

                                    }}
                                  />
                                   days after the audit schedule ends.
                                </span>
                              </div>

                              <CardTitle>Monthly Scheduled </CardTitle>
                          <ListGroup flush className="border rounded shadow-sm">
                            <ListGroupItem className="d-flex align-items-center justify-content-between">
                              <div className="fw-bold text-muted">Review Starts On:</div>
                              <span className="text-success badge badge-soft-success fw-bold font-size-12">{currentStageInfo.scheduled_shift[0]["startDate"]}</span>
                            </ListGroupItem>
                            <ListGroupItem className="d-flex align-items-center justify-content-between">
                              <div className="fw-bold text-muted">Review Ends On:</div>
                              <span className="text-danger badge badge-soft-danger fw-bold font-size-12">
                              {`Every Month on ${currentStageInfo.scheduled_shift[0]["dateInfo"]["duration"]}`}
                                {/* {currentStageInfo.scheduled_shift[currentStageInfo.scheduled_shift.length - 1]["day"]} */}
                                </span>
                            </ListGroupItem>
                          </ListGroup>


                        </div>

                      </>
                    }
                    {/* {
                      publishTemplate["repeat_mode_config_review"][0].schedule_type === "custom" &&
                      <>
                        <Col md={6}>
                          <div style={{ border: '1px solid #e9e9e9', borderRadius: '5px' }} className="p-3">
                            <CardTitle>Select Monthly Start Date</CardTitle>
                            <Calendar
                              calculatedDate={(dateInfo) => { calculatedEndMonth(dateInfo) }}
                              selectedDate={publishTemplate["repeat_mode_config_review"][0].scheduled_shift.length > 0 ? publishTemplate["repeat_mode_config_review"][0].scheduled_shift[0]?.dateInfo?.startDate : null}
                            />
                          </div>
                        </Col>
                      </>
                    } */}
                    {
                      publishTemplate["repeat_mode_config_review"][0].schedule_type === "quaterly"
                       &&
                      <>
                        <Col md={6}>
                          <div style={{ border: '1px solid #e9e9e9', borderRadius: '5px' }} className="p-3">
                            <CardTitle>Select Start Month</CardTitle>
                            <div className="list-group">
                              {(publishTemplate["repeat_mode_config_review"][0].months ? publishTemplate["repeat_mode_config_review"][0].months : configData.month_list).map((ele, idx) => (
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
                    }
      
      
                    <Col md={6} className="d-flex align-items-center justify-content-center">
                      {publishTemplate["repeat_mode_config_review"][0].scheduled_shift.length > 0 &&
                        publishTemplate["repeat_mode_config_review"][0].evermnth !== "custom" ? (
                        <div className="w-100 mt-3">
                              <Label>Monthly Schedule :</Label>
                              <div>
                                <span className="text-dark">
                                  The reviewer schedule will ends duration of
                                  <input
                                    type="number"
                                     min={1}
                                     max={28}
                                    defaultValue={publishTemplate["repeat_mode_config_review"][0]["scheduled_shift"][0]["dateInfo"]["duration"]}
                                    className="mx-2"
                                    onChange={async(e) => {
                                      const publishTemplateInfo = _.cloneDeep(publishTemplate)
                                      publishTemplateInfo["repeat_mode_config_review"][0]["scheduled_shift"][0]["dateInfo"]["duration"] = Number(e.target.value)
                                      publishTemplateInfo["repeat_mode_config_review"][0]["scheduled_shift"][0]["dateInfo"]["endDate"] = Number(e.target.value)
                                      publishTemplateInfo["repeat_mode_config_review"][0]["scheduled_shift"][0]["endDate"] = `Every Month on ${Number(e.target.value)}${await ordinal_suffix_of(Number(e.target.value))}`
                                      props.updateTempMasterInfo(publishTemplateInfo)

                                    }}
                                  />
                                  days after the audit schedule ends.
                                </span>
                              </div>

                              {/* <CardTitle>Monthly Scheduled </CardTitle> */}
                              <div className='mt-3'>
                          <ListGroup flush className="border rounded shadow-sm">
                            <ListGroupItem className="d-flex align-items-center justify-content-between">
                              <div className="fw-bold text-muted">Review Starts On:</div>
                              <span className="text-success badge badge-soft-success fw-bold font-size-12">{currentStageInfo.scheduled_shift[0]["startDate"]}</span>
                            </ListGroupItem>
                            <ListGroupItem className="d-flex align-items-center justify-content-between">
                              <div className="fw-bold text-muted">Review Ends On:</div>
                              <span className="text-danger badge badge-soft-danger fw-bold font-size-12">
                                {publishTemplate.repeat_mode_config_review[0]["scheduled_shift"][0]["endDate"]}
                              {/* {`Every Month on ${publishTemplate.repeat_mode_config_review[0].scheduled_shift[0]["dateInfo"]["duration"]}`} */}
                                {/* {currentStageInfo.scheduled_shift[currentStageInfo.scheduled_shift.length - 1]["day"]} */}
                                </span>
                            </ListGroupItem>
                          </ListGroup>
                          </div>

                        </div>
                      ) :
                      (
                        // null
                        <>
                        
                        </>
                      )
                    }
                      
                    </Col>
                  </Row>
      
                </>
              }
            
            </>
          )
      
        }
      
    const onChangeStartDate = async (event) => {

        const publishTempInfo = _.cloneDeep(publishTemplate)
        publishTempInfo["review_start_date"] = event.target.value
        setStartDate(event.target.value)
        var updatedData = await ccLevelValidation(publishTempInfo)
        props.updateTempMasterInfo(updatedData)
    }

    const showDetailedInfo=(data,status)=>{
      setupdateSchedule(status)
      setcurrentStageInfo(data)
    }




    if (dataLoaded) {
        return (
          <>
          {
            !updateSchedule  ?
            <Row>
            {
              publishTemplate.repeat_mode_config_review?.map((ele, idx) => {
                return (
                  <ReviewCard
                  key={idx}
                    data={ele}
                    index={idx}
                    showDetailedInfo={showDetailedInfo}
                  />
                )
              })
            }
          </Row>

          :
          <Card style={{ border: '1px solid #e9e9e9' }}>
          <CardBody>
              <div className="row mb-3">
                  <div className="col">
                      <Label htmlFor="autoSizingSelect">Select Repeat Mode :</Label>
                      <select
                          type="select"
                          name="repeat_mode"
                          label="Name"
                          value={currentStageInfo.mode_id ? currentStageInfo.mode_id : selectedRepeatMode}
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
               
                  <br />
                  {currentStageInfo.mode_id === "0" && (
                      <>
                          <div className="row mt-3">
                              <div className="col-md-6 mb-3">
                                  <label htmlFor="start_date" className="form-label fw-bold">
                                      Review Starts on :<span className="text-danger">*</span>
                                  </label>
                                  <input
                                      className="form-control"
                                      type="date"
                                      id="start_date"
                                      min={fromDate}
                                      value={publishTemplate.review_start_date || ""}
                                      onChange={(e) => onChangeStartDate(e)}
                                      onKeyDown={(e) => e.preventDefault()}
                                  />
                              </div>

                              <div className="col-md-6 mb-3">
                                  <label htmlFor="end_date" className="form-label fw-bold">
                                        Review End on :<span className="text-danger">*</span>
                                  </label>
                                  <input
                                      className="form-control"
                                      type="date"
                                      id="end_date"
                                      value={publishTemplate.review_end_date}
                                      onChange={async (e) => {
                                          const publishTempInfo = _.cloneDeep(publishTemplate)
                                          publishTempInfo["review_end_date"] = e.target.value
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
                      currentStageInfo.mode_id &&
                     showRepeatModeComponent(currentStageInfo.mode_id)
                  }
                      
              </div>
              <div>

              </div>
          </CardBody>
      </Card>
          }
          </>
        )
    }
    else{
        console.log("load")
        return null
      }
}
export default ReviewSchedule
