import React, { useState, useEffect, useMemo } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Label,
    FormGroup,
    Input,
    Button, UncontrolledTooltip,
    ListGroup, ListGroupItem,
} from "reactstrap";
import urlSocket from "../../../../helpers/urlSocket";
import { Popconfirm } from 'antd';
import TableContainer from "../../../../common/TableContainer";
import Swal from 'sweetalert2';
import useDebounce from './useDebounce'
import Calendar from "./Calendar28days";


var moment = require('moment')
let moment1 = require('moment-timezone');


const UpdateShiftInfo = (props) => {
    const [authUser, setAuthUser] = useState(
        JSON.parse(sessionStorage.getItem("authUser"))
    );
    const [scheduleInfo, setScheduleInfo] = useState(null);
    const [monthScheduleInfo, setmonthScheduleInfo] = useState(null);
    const [updateTimeInfo, setupdateTimeInfo] = useState(null);
    const [showConfig, setShowConfig] = useState(false);
    const [publishTemplate, setpublishTemplate] = useState(null)
    const [reUpdt, setReUpdt] = useState(false);

    const [repeatModeData, setRepeatModeData] = useState(
        JSON.parse(sessionStorage.getItem("authUser")).config_data.repeat_mode
    );
    const [dataLoaded, setDataLoaded] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [newStartTime, setnewStartTime] = useState(null)
    const [newEndTime, setnewEndTime] = useState(null)

    const debouncedInputValue = useDebounce(inputValue, 300)


    useEffect(() => {
        const scheduleInfoDup = scheduleInfo ? _.cloneDeep(scheduleInfo) : {};
        scheduleInfoDup["shift_count"] = debouncedInputValue;
        console.log(JSON.stringify(scheduleInfoDup), 'scheduleInfoDup')
        setScheduleInfo(scheduleInfoDup);
    }, [debouncedInputValue]);

    useEffect(() => {
        const master_id = sessionStorage.getItem("adt_master_id");
        retriveMasterInfo(master_id);
    }, []);

    const retriveMasterInfo = async (master_id) => {
        try {
            const response = await urlSocket.post(
                "webmngpbhtmplt/retrive-master-audit-info",
                {
                    encrypted_db_url: authUser.db_info.encrypted_db_url,
                    _id: master_id,
                }
            );
            if (response.status === 200 && response.data.data.length > 0) {
                setScheduleInfo(response.data.data[0].repeat_mode_config);
                if(response.data.data[0].repeat_mode_config.mode_id === "3"){
                    // response.data.data[0].repeat_mode_config["next_job"]
                    setmonthScheduleInfo(response.data.data[0].repeat_mode_config)
                }

                setpublishTemplate(response.data.data[0])
                setDataLoaded(true);
            }
        } catch (error) {
            console.error("Error retrieving master info:", error);
        }
    };


    const editShifInfo = (timeInfo) => {
        console.log("edit", timeInfo)
        setupdateTimeInfo(timeInfo)

    }

    const handleUpdateSchedule = () => {
        console.log(updateTimeInfo, 'updateTimeInfo')
        let scheduleInfoDup = _.cloneDeep(scheduleInfo)
        const startTime = updateTimeInfo.start
        const endTime = updateTimeInfo.end
        console.log("trifgger")
        if (!startTime || !endTime) {
            alert("Please select both start and end times.");
            return;
        }
        const newStart = moment(startTime, "hh:mm A");
        let newEnd = moment(endTime, "hh:mm A");
        console.log(newStart, 'newStart', newEnd)
        var next_date
        if (newEnd.isBefore(newStart)) {
            newEnd.add(1, 'day'); // If end time is before start time, add 1 day
            next_date = true
            // scheduleInfoDup["next_date"]=true
        }
        else {
            next_date = false
            // scheduleInfoDup["next_date"]=false
        }

        var newEvent

        if (scheduleInfoDup.schedule_type !== "24") {

            const isOverlapping = scheduleInfoDup.scheduled_shift?.some((schedule) => {
                const existingStart = moment(schedule.start, "HH:mm");
                let existingEnd = moment(schedule.end, "HH:mm");

                if (existingEnd.isBefore(existingStart)) {
                    existingEnd.add(1, 'day'); // If existing end is before start, it's on the next day
                }
                return (
                    (newStart.isSameOrAfter(existingStart) && newStart.isBefore(existingEnd)) || // New start within existing schedule
                    (newEnd.isAfter(existingStart) && newEnd.isSameOrBefore(existingEnd)) || // New end within existing schedule
                    (newStart.isBefore(existingStart) && newEnd.isAfter(existingEnd)) // New schedule fully overlaps an existing schedule
                );
            });
            console.log(isOverlapping, 'isOverlapping')
            if (isOverlapping) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Invalid !',
                    text: 'This time overlaps with an existing schedule. Please choose a different time.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {

                })
                return;
            }

            newEvent = {
                title: "Shift",
                start: newStart.format("HH:mm"),
                end: newEnd.format("HH:mm"),
                next_date
            };

            if (scheduleInfoDup["shift_type"] === "automate") {
                scheduleInfoDup["repeat_mode_config"]["scheduled_shift"] = [newEvent];

            }
            else {
                scheduleInfoDup["scheduled_shift"] = [...scheduleInfoDup["scheduled_shift"], newEvent];
                console.log(scheduleInfoDup, 'publishTemplate');
            }
        }
        setScheduleInfo(scheduleInfoDup)
        setupdateTimeInfo(null)
    };



    const getCurrentOrNextShift = (scheduled_shift) => {
        const now = moment1().tz("Asia/Kolkata"); // Current time in IST
        const currentTime = now.format("HH:mm");
        for (const shift of scheduled_shift) {
            if (currentTime >= shift.start && currentTime <= shift.end) {
                return { message: "Current shift found", shift };
            }
        }
        const nextShift = scheduled_shift.find(shift => currentTime < shift.start);
        if (nextShift) {
            return { message: "No current shift, next upcoming shift", shift: nextShift };
        }
        return { message: "No shifts available", shift: null };
    }



    const getCurrentIndianTimeDup = (desiredDate, desiredHours, desiredMinutes, useNextDay) => {
        const currentUTC = desiredDate ? new Date(desiredDate) : new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const currentIST = new Date(currentUTC.getTime() + istOffset);
        currentIST.setHours(desiredHours);
        currentIST.setMinutes(desiredMinutes);
        currentIST.setSeconds(0); // Set seconds to zero if not specified

        if (useNextDay) {
            currentIST.setDate(currentIST.getDate() + 1);
        }
        const year = currentIST.getFullYear();
        const month = String(currentIST.getMonth() + 1).padStart(2, '0');
        const day = String(currentIST.getDate()).padStart(2, '0');
        const hours = String(currentIST.getHours()).padStart(2, '0');
        const minutes = String(currentIST.getMinutes()).padStart(2, '0');
        const seconds = String(currentIST.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`;
    }


    const isCurrentDate = (dateToCheck) => {
        const currentDate = new Date();
        return dateToCheck.getFullYear() === currentDate.getFullYear() &&
            dateToCheck.getMonth() === currentDate.getMonth() &&
            dateToCheck.getDate() === currentDate.getDate();
    };


    const updateApi = async (next_job_on, _id, scheduleInfo) => {
        const data = {
            next_job_on,
            repeat_mode_config: scheduleInfo,
            repeat_mode: scheduleInfo.mode,
        }
        console.log(data, 'data')

        try {
            const responseData = await urlSocket.post("webphlbconf/update-master-schedule-info", {
                master_info: data,
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                _id
            })
            console.log(responseData, 'responseData')
            if (responseData.data.response_code === 500) {
                props.onClose()
            }

        } catch (error) {

        }


    }




    const checkTimeIntervalOver = (startTime, endTime, currentDate) => {
        const [startHours, startMinutes] = startTime.split(":").map(Number);
        const [endHours, endMinutes] = endTime.split(":").map(Number);

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // JavaScript months are 0-indexed
        const day = currentDate.getDate();
        const startDateTime = new Date(year, month, day, startHours, startMinutes, 0);
        const endDateTime =
            endHours < startHours || (endHours === startHours && endMinutes < startMinutes)
                ? new Date(year, month, day + 1, endHours, endMinutes, 0) // Next day
                : new Date(year, month, day, endHours, endMinutes, 0); // Same day

        const currentIST = new Date();
        return currentIST > endDateTime;
    };



    const getSpecificDayDate = (dayName, useNext = false) => {
        const daysOfWeek = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
     
        const today = new Date();
        const todayIndex = today.getDay(); // Get today's index (0 = Sunday, ..., 6 = Saturday)
        const targetIndex = daysOfWeek.indexOf(dayName.toLowerCase()); // Find the index of the target day
        if (targetIndex === -1) {
          throw new Error("Invalid day name provided."); // Handle invalid day names
        }
        // Calculate the number of days until the target day
        let daysUntilTarget =
          todayIndex <= targetIndex
            ? targetIndex - todayIndex // If the target day is ahead in the week
            : 7 - todayIndex + targetIndex; // If the target day is in the next week
     
        // If `useNext` is true and today is the target day, skip today by adding 7 days
        if (useNext && todayIndex === targetIndex) {
          daysUntilTarget = 7;
        }
        // Calculate the target date
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + daysUntilTarget);
     
        // Format the date to YYYY-MM-DD
        const formattedDate = targetDate.toISOString().split("T")[0];
     
        return formattedDate;
      };


      const getNthDateOfCurrentMonth=(n, next = false,end)=> {
        const now = new Date();
        if (next) {
          now.setMonth(now.getMonth() + 1);
        }
        now.setDate(n);
        end ? now.setHours(23, 59, 0, 0) : now.setHours(0, 0, 0, 0);
        console.log(now,'now',n)
        // Return the formatted date with time
        const formattedDateWithTime = now.toISOString();
        return formattedDateWithTime;
      }

      const getWeekDatesInIST = () => {
        const now = new Date(); // Current date and time in local time
        const utcOffsetMinutes = 5 * 60 + 30; // Offset for IST (5 hours 30 minutes)
     
        // Get the current date in UTC
        const utcNow = new Date(now.toISOString()); // Convert to UTC
       
        // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const dayOfWeek = utcNow.getUTCDay();
     
        // Calculate the Monday (start of the week) in UTC
        const monday = new Date(utcNow);
        monday.setUTCDate(utcNow.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Adjust if it's Sunday (0)
        monday.setUTCHours(18, 30, 0, 0); // Set to 18:30 UTC on the correct Monday
     
        // Adjust Monday from UTC to IST (Add the IST offset of 5:30)
        const mondayInIST = new Date(monday.getTime() + utcOffsetMinutes * 60 * 1000);
     
        // Calculate the Sunday (end of the week) in UTC
        const sunday = new Date(monday);
        sunday.setUTCDate(monday.getUTCDate() + 6); // Add 6 days to Monday
        sunday.setUTCHours(18, 29, 59, 999); // Set to 18:29:59.999 UTC (end of Sunday in IST)
     
        // Adjust Sunday from UTC to IST (Add the IST offset of 5:30)
        const sundayInIST = new Date(sunday.getTime() + utcOffsetMinutes * 60 * 1000);
     
        // Adjust Monday and Sunday back to UTC for return values
        // const mondayInUTC = new Date(mondayInIST.getTime() - utcOffsetMinutes * 60 * 1000);
        const mondayInUTC = new Date(mondayInIST.getTime() - utcOffsetMinutes * 60 * 1000 - 24 * 60 * 60 * 1000);
        const sundayInUTC = new Date(sundayInIST.getTime() - utcOffsetMinutes * 60 * 1000);
     
        return {
          mondayUTC: mondayInUTC.toISOString(),
          sundayUTC: sundayInUTC.toISOString(),
          mondayIST: mondayInIST.toISOString(),
          sundayIST: sundayInIST.toISOString()
        };
      };
     

    const updateAuditMasterInfo = () => {
        const master_id = sessionStorage.getItem("adt_master_id");
        Swal.fire({
            icon: 'warning', // You can use 'warning', 'error', or any other appropriate icon
            title: '<span style="font-size: 15px;">Confirmation</span>',
            html: `<span style="font-size: 13px;">Are you sure you want to update this changes ?</span>`,
            showCancelButton: true,
            confirmButtonColor: '#34c38f',
            cancelButtonColor: '#556EE6',
            confirmButtonText: 'Publish',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log(scheduleInfo, 'scheduleInfo', master_id)
                const isToday = isCurrentDate(new Date(publishTemplate.start_date));
                const scheduleInfoDup = _.cloneDeep(scheduleInfo)

                var currentDate = new Date()
                var next_job_on

                if (scheduleInfo.mode_id === "1") {
                    var nextShift = await getCurrentOrNextShift(scheduleInfo.scheduled_shift)
                    console.log(nextShift, 'nextShift')
                    var timeString;
                    var timeStringEnd
                    console.log(isToday, 'isToday')
                    if (isToday) {
                        if (nextShift.shift !== null) {
                            timeString = nextShift.shift.start;
                            timeStringEnd = nextShift.shift.end;
                            const [hours, minutes] = timeString.split(":").map(Number);
                            const [hoursEnd, minutesEnd] = timeStringEnd.split(":").map(Number);
                            console.log(hours, minutes, 'hours', hoursEnd, minutesEnd)
                            var start_job_on = await getCurrentIndianTimeDup(publishTemplate.start_date, hours, minutes);
                            const isDateCompleted = new Date() >= new Date(start_job_on);
                            var end_job_on = await getCurrentIndianTimeDup(publishTemplate.start_date, hoursEnd, minutesEnd);
                            const endDatecompleted = new Date() >= new Date(end_job_on);
                            const isIntervalOver = await checkTimeIntervalOver(timeString, timeStringEnd, currentDate);

                            if (endDatecompleted) {
                                start_job_on = await getCurrentIndianTimeDup(publishTemplate.start_date, hours, minutes, isIntervalOver);
                            }
                            end_job_on = await getCurrentIndianTimeDup(publishTemplate.start_date, hoursEnd, minutesEnd, endDatecompleted);
                            console.log(isDateCompleted, endDatecompleted, 'endDatecompleted', start_job_on, publishTemplate.start_date, new Date(publishTemplate.start_date))
                            next_job_on = start_job_on
                        }
                    }
                    else {
                        if (nextShift.shift !== null) {
                            const givenDate = publishTemplate.start_date; // The date to validate
                            const isGreater = new Date(givenDate) > new Date(currentDate);
                            timeString = nextShift.shift.start;
                            timeStringEnd = nextShift.shift.end;
                            const [hours, minutes] = timeString.split(":").map(Number);
                            const [hoursEnd, minutesEnd] = timeStringEnd.split(":").map(Number);
                            console.log(hours, minutes, 'hours', hoursEnd, minutesEnd)
                            var start_job_on = await getCurrentIndianTimeDup(isGreater ? publishTemplate.start_date : currentDate, hours, minutes);
                            const isDateCompleted = new Date() >= new Date(start_job_on);
                            var end_job_on = await getCurrentIndianTimeDup(isGreater ? publishTemplate.start_date : currentDate, hoursEnd, minutesEnd);
                            const endDatecompleted = new Date() >= new Date(end_job_on);
                            var currentDate = new Date()
                            const isIntervalOver = await checkTimeIntervalOver(timeString, timeStringEnd, currentDate);

                            if (endDatecompleted) {
                                start_job_on = await getCurrentIndianTimeDup(isGreater ? publishTemplate.start_date : currentDate, hours, minutes, isIntervalOver);
                            }
                            end_job_on = await getCurrentIndianTimeDup(isGreater ? publishTemplate.start_date : currentDate, hoursEnd, minutesEnd, endDatecompleted);
                            console.log(isDateCompleted, endDatecompleted, 'endDatecompleted', start_job_on, publishTemplate.start_date, new Date(publishTemplate.start_date))
                            next_job_on = start_job_on


                        }
                        else {

                            const givenDate = publishTemplate.start_date; // The date to validate
                            const isGreater = new Date(givenDate) > new Date(currentDate);

                            timeString = scheduleInfo.scheduled_shift[0].start;
                            timeStringEnd = scheduleInfo.scheduled_shift[0].end;
                            const [hours, minutes] = timeString.split(":").map(Number);
                            const [hoursEnd, minutesEnd] = timeStringEnd.split(":").map(Number);
                            var start_job_on = await getCurrentIndianTimeDup(isGreater ? publishTemplate.start_date : currentDate, hours, minutes);
                            const isDateCompleted = new Date() >= new Date(start_job_on);
                            var end_job_on = await getCurrentIndianTimeDup(isGreater ? publishTemplate.start_date : currentDate, hoursEnd, minutesEnd);
                            const endDatecompleted = new Date() >= new Date(end_job_on);
                            if (endDatecompleted) {
                                start_job_on = await getCurrentIndianTimeDup(isGreater ? publishTemplate.start_date : currentDate, hours, minutes, false);
                            }
                            end_job_on = await getCurrentIndianTimeDup(isGreater ? publishTemplate.start_date : currentDate, hoursEnd, minutesEnd, endDatecompleted);
                            console.log(isDateCompleted, endDatecompleted, 'endDatecompleted')
                            next_job_on = start_job_on
                        }

                        console.log(next_job_on, 'next_job_on')
                    }
                }
                else if (scheduleInfo.mode_id === "0") {

                    const givenDate = publishTemplate.start_date; // The date to validate
                    const isGreater = new Date(givenDate) > new Date(currentDate);
                    next_job_on = new Date(isToday ? currentDate : isGreater ? publishTemplate["start_date"] : currentDate).toISOString();
                    scheduleInfoDup["scheduled_shift"] = []
                    scheduleInfoDup["mode"] = "One Time"
                    setScheduleInfo(scheduleInfoDup)
                }
                else if(scheduleInfo.mode_id === "2"){
                    const weekDates = await getWeekDatesInIST();
                    // var useNextMonth = await veriFyPublishedThisMonth("2",weekDates)
                    // console.log(useNextMonth,'useNextMonth')
                    next_job_on = await getSpecificDayDate(scheduleInfo.scheduled_shift[0]["day"])
                    console.log(next_job_on,'next_job_on',weekDates)
                   
                    const utcOffsetMinutes = 5 * 60 + 30; // 5 hours 30 minutes
                    const date = new Date(next_job_on);
                    next_job_on = new Date(date.getTime() - utcOffsetMinutes * 60 * 1000);
                    if (useNextMonth) {
                        next_job_on.setDate(next_job_on.getDate() + 7); // Add 7 days to next_job_on
                      }
                     

                    next_job_on = next_job_on.toISOString()
                    // console.log(adjustedDate.toISOString(),'adjustedDate')
                }
                else if(scheduleInfo.mode_id === "3"){
                   
                    // var useNextMonth = await veriFyPublishedThisMonth("3")
                    next_job_on = await getNthDateOfCurrentMonth(scheduleInfo.scheduled_shift[0]["dateInfo"]["startDate"])
                }
                    console.log(next_job_on,'next_job_on')
                  await updateApi(next_job_on, master_id, scheduleInfoDup)

            }

        })

    }

    const veriFyPublishedThisMonth = (mode,weekDates) => {

        if(mode === "3"){
        const today = new Date();
        return new Promise(async(resolve, reject) => {
            try {
              const responseData = await urlSocket.post("webphlbprcs/check-published-this-month",{
                encrypted_db_url : authUser.db_info.encrypted_db_url,
                adt_master_id : sessionStorage.getItem("adt_master_id"),
                start_date:new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1, 18, 30, 0)),
                end_date:new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0, 18, 29, 59))
              })
              console.log(responseData,'responseData')
              if(responseData.data.response_code === 200){
                resolve(responseData.data.exist)
              }

            } catch (error) {
                reject(error)
            }
        })
        }
        else if(mode ==="2"){
            return new Promise(async(resolve, reject) => {
                try {
                  const responseData = await urlSocket.post("webphlbprcs/check-published-this-month",{
                    encrypted_db_url : authUser.db_info.encrypted_db_url,
                    adt_master_id : sessionStorage.getItem("adt_master_id"),
                    start_date:weekDates.mondayUTC,
                    end_date:weekDates.sundayUTC
                  })
                  console.log(responseData,'responseData')
                  if(responseData.data.response_code === 200){
                    resolve(responseData.data.exist)
                  }
   
                } catch (error) {
                    reject(error)
                }
            })
        }
    }


    const deleteShift = (index) => {
        var shiftInfo = _.cloneDeep(scheduleInfo)
        shiftInfo.scheduled_shift.splice(index, 1)
        console.log(shiftInfo, 'shiftInfo')
        setScheduleInfo(shiftInfo)
    }


    const extendShift = (schedule, oldEndTime, newEndTime) => {
        const parseTime = (time) => new Date(`1970-01-01T${time}:00`);
        const formatTime = (date) => date.toISOString().substring(11, 16);

        // Find the shift to extend
        const indexToExtend = schedule.findIndex((shift) => shift.end === oldEndTime);
        if (indexToExtend === -1) {
            console.error("Shift not found with the given old end time!");
            return;
        }

        // Calculate the added duration
        const oldEndParsed = parseTime(oldEndTime);
        const newEndParsed = parseTime(newEndTime);
        const addedDuration = newEndParsed - oldEndParsed;

        // Update the current shift's end time
        schedule[indexToExtend].end = newEndTime;

        // Adjust subsequent shifts
        for (let i = indexToExtend + 1; i < schedule.length; i++) {
            const prevShift = schedule[i - 1];
            const currentShift = schedule[i];

            // Set the new start time for the current shift
            currentShift.start = prevShift.end;

            // Adjust the end time by preserving the original duration and adding the extra time
            const currentDuration =
                parseTime(currentShift.end) - parseTime(currentShift.start);
            currentShift.end = formatTime(
                new Date(parseTime(currentShift.start).getTime() + currentDuration + addedDuration)
            );
        }
        console.log("Updated Schedule:", schedule);

    }




    // const handleUpdateShiftStartAndEnd = (shiftIndex, newStartTime, newEndTime) => {
    // let updatedSchedule = {...scheduleInfo};
    // console.log(newStartTime,'newStartTime',newEndTime)
    // // Parse existing and new times
    // const currentStart = moment(updatedSchedule["scheduled_shift"][shiftIndex].start, "HH:mm");
    // const currentEnd = moment(updatedSchedule["scheduled_shift"][shiftIndex].end, "HH:mm");

    // const newStart = newStartTime ? moment(newStartTime, "HH:mm") : currentStart;
    // const newEnd = newEndTime ? moment(newEndTime, "HH:mm") : currentEnd;

    // // Update the current shift
    // updatedSchedule["scheduled_shift"][shiftIndex].start = newStart.format("HH:mm");
    // updatedSchedule["scheduled_shift"][shiftIndex].end = newEnd.format("HH:mm");
    // updatedSchedule["scheduled_shift"][shiftIndex]['show_input'] = false

    // // Recalculate durations dynamically
    // for (let i = shiftIndex + 1; i < updatedSchedule["scheduled_shift"].length; i++) {
    // const prevShiftEnd = moment(updatedSchedule["scheduled_shift"][i - 1].end, "HH:mm");
    // const nextShiftDuration = moment(updatedSchedule["scheduled_shift"][i].end, "HH:mm").diff(
    // moment(updatedSchedule["scheduled_shift"][i].start, "HH:mm"),
    // "minutes"
    // );

    // // Adjust subsequent shifts
    // updatedSchedule["scheduled_shift"][i].start = prevShiftEnd.format("HH:mm");
    // updatedSchedule["scheduled_shift"][i].end = prevShiftEnd
    // .clone()
    // .add(nextShiftDuration, "minutes")
    // .format("HH:mm");
    // }
    // console.log(updatedSchedule,'updatedSchedule')
    // setScheduleInfo(updatedSchedule)
    // setnewEndTime(null)
    // setnewStartTime(null)

    // // Set the updated schedule
    // // setScheduleInfo({
    // // ...scheduleInfo,
    // // scheduled_shift: updatedSchedule,
    // // });
    // };



    const handleUpdateShiftStartAndEnd = (shiftIndex, newStartTime, newEndTime) => {

        if (newStartTime && !newEndTime) {
            let updatedSchedule = { ...scheduleInfo };
            const newStart = moment(newStartTime, "HH:mm");
            const currentShiftDuration = moment(updatedSchedule["scheduled_shift"][shiftIndex].end, "HH:mm").diff(
                moment(updatedSchedule["scheduled_shift"][shiftIndex].start, "HH:mm"),
                "minutes"
            );

            // Update the start time and end time of the current shift
            updatedSchedule["scheduled_shift"][shiftIndex].start = newStart.format("HH:mm");
            updatedSchedule["scheduled_shift"][shiftIndex].show_input = false
            updatedSchedule["scheduled_shift"][shiftIndex].end = newStart
                .clone()
                .add(currentShiftDuration, "minutes")
                .format("HH:mm");

            // Update subsequent shifts dynamically
            for (let i = shiftIndex + 1; i < updatedSchedule["scheduled_shift"].length; i++) {
                const prevShiftEnd = moment(updatedSchedule["scheduled_shift"][i - 1].end, "HH:mm");
                const nextShiftDuration = moment(updatedSchedule["scheduled_shift"][i].end, "HH:mm").diff(
                    moment(updatedSchedule["scheduled_shift"][i].start, "HH:mm"),
                    "minutes"
                );

                updatedSchedule["scheduled_shift"][i].start = prevShiftEnd.format("HH:mm");
                updatedSchedule["scheduled_shift"][i].end = prevShiftEnd
                    .clone()
                    .add(nextShiftDuration, "minutes")
                    .format("HH:mm");
            }
            console.log(updatedSchedule["scheduled_shift"], 'updatedSchedule["scheduled_shift"]')
            setScheduleInfo(updatedSchedule)
        }
        else if (newEndTime && !newStartTime) {
            let updatedSchedule = { ...scheduleInfo };
            const newEnd = moment(newEndTime, "HH:mm");
            updatedSchedule["scheduled_shift"][shiftIndex].end = newEnd.format("HH:mm");
            updatedSchedule["scheduled_shift"][shiftIndex].show_input = false
            // Update subsequent shifts dynamically
            for (let i = shiftIndex + 1; i < updatedSchedule.scheduled_shift.length; i++) {
                const prevShiftEnd = moment(updatedSchedule.scheduled_shift[i - 1].end, "HH:mm");
                const currentShiftDuration = moment(updatedSchedule.scheduled_shift[i].end, "HH:mm").diff(
                    moment(updatedSchedule.scheduled_shift[i].start, "HH:mm"),
                    "minutes"
                );

                updatedSchedule.scheduled_shift[i].start = prevShiftEnd.format("HH:mm");
                updatedSchedule.scheduled_shift[i].end = prevShiftEnd
                    .clone()
                    .add(currentShiftDuration, "minutes")
                    .format("HH:mm");
            }
            console.log(updatedSchedule.scheduled_shift, 'updatedSchedule')
            setScheduleInfo(updatedSchedule)

        }
        else if (newStartTime && newEndTime) {
            let updatedSchedule = { ...scheduleInfo };
            const newStart = moment(newStartTime, "HH:mm");
            const newEnd = moment(newEndTime, "HH:mm");

            // Calculate the duration of the current shift
            const currentShiftDuration = newEnd.diff(newStart, "minutes");

            // Update the start and end time of the current shift
            updatedSchedule["scheduled_shift"][shiftIndex].start = newStart.format("HH:mm");
            updatedSchedule["scheduled_shift"][shiftIndex].end = newEnd.format("HH:mm");
            updatedSchedule["scheduled_shift"][shiftIndex].show_input = false;

            // Update subsequent shifts dynamically
            for (let i = shiftIndex + 1; i < updatedSchedule["scheduled_shift"].length; i++) {
                const prevShiftEnd = moment(updatedSchedule["scheduled_shift"][i - 1].end, "HH:mm");
                const nextShiftDuration = moment(updatedSchedule["scheduled_shift"][i].end, "HH:mm").diff(
                    moment(updatedSchedule["scheduled_shift"][i].start, "HH:mm"),
                    "minutes"
                );

                updatedSchedule["scheduled_shift"][i].start = prevShiftEnd.format("HH:mm");
                updatedSchedule["scheduled_shift"][i].end = prevShiftEnd
                    .clone()
                    .add(currentShiftDuration, "minutes")
                    .format("HH:mm");
            }

            console.log(updatedSchedule["scheduled_shift"], 'updatedSchedule["scheduled_shift"]');
            setScheduleInfo(updatedSchedule);
        }
        setnewEndTime(null)
        setnewStartTime(null)


    }






    const columns =
        useMemo(() => {
            return scheduleInfo?.schedule_type === "24" ?
                [
                    {
                        accessor: 'title',
                        Header: 'Job Title',
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
                        Header: 'Job Title',
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
                            var shiftIndex = cellProps.row.index
                            // console.log(item,'item')
                            return (
                                <>
                                    {
                                        item.show_input ?
                                            <Input
                                                type="time"
                                                value={newStartTime ? newStartTime : item?.start || ""}
                                                onChange={(e) => {

                                                    setnewStartTime(e.target.value)
                                                    // const updatedSchedule = {...scheduleInfo};
                                                    // const newStart = moment(e.target.value, "HH:mm");
                                                    // const currentShiftDuration = moment(updatedSchedule["scheduled_shift"][shiftIndex].end, "HH:mm").diff(
                                                    // moment(updatedSchedule["scheduled_shift"][shiftIndex].start, "HH:mm"),
                                                    // "minutes"
                                                    // );

                                                    // // Update the start time and end time of the current shift
                                                    // updatedSchedule["scheduled_shift"][shiftIndex].start = newStart.format("HH:mm");
                                                    // updatedSchedule["scheduled_shift"][shiftIndex].end = newStart
                                                    // .clone()
                                                    // .add(currentShiftDuration, "minutes")
                                                    // .format("HH:mm");

                                                    // // Update subsequent shifts dynamically
                                                    // for (let i = shiftIndex + 1; i < updatedSchedule["scheduled_shift"].length; i++) {
                                                    // const prevShiftEnd = moment(updatedSchedule["scheduled_shift"][i - 1].end, "HH:mm");
                                                    // const nextShiftDuration = moment(updatedSchedule["scheduled_shift"][i].end, "HH:mm").diff(
                                                    // moment(updatedSchedule["scheduled_shift"][i].start, "HH:mm"),
                                                    // "minutes"
                                                    // );

                                                    // updatedSchedule["scheduled_shift"][i].start = prevShiftEnd.format("HH:mm");
                                                    // updatedSchedule["scheduled_shift"][i].end = prevShiftEnd
                                                    // .clone()
                                                    // .add(nextShiftDuration, "minutes")
                                                    // .format("HH:mm");
                                                    // }
                                                    // console.log(updatedSchedule["scheduled_shift"],'updatedSchedule["scheduled_shift"]')
                                                    // setScheduleInfo(updatedSchedule)




                                                    // let updatedSchedule = {...scheduleInfo};
                                                    // const newEnd = moment(e.target.value, "HH:mm");
                                                    // updatedSchedule["scheduled_shift"][index].start = newEnd.format("HH:mm");
                                                    // // Update subsequent shifts dynamically
                                                    // for (let i = index + 1; i < updatedSchedule.scheduled_shift.length; i++) {
                                                    // const prevShiftEnd = moment(updatedSchedule.scheduled_shift[i - 1].end, "HH:mm");
                                                    // const currentShiftDuration = moment(updatedSchedule.scheduled_shift[i].end, "HH:mm").diff(
                                                    // moment(updatedSchedule.scheduled_shift[i].start, "HH:mm"),
                                                    // "minutes"
                                                    // );

                                                    // updatedSchedule.scheduled_shift[i].start = prevShiftEnd.format("HH:mm");
                                                    // updatedSchedule.scheduled_shift[i].end = prevShiftEnd
                                                    // .clone()
                                                    // .add(currentShiftDuration, "minutes")
                                                    // .format("HH:mm");
                                                    // }
                                                    // console.log(updatedSchedule.scheduled_shift,'updatedSchedule')
                                                    // setScheduleInfo(updatedSchedule)

                                                }}
                                            />
                                            :
                                            moment(item.start, "HH:mm").format("hh:mm A")
                                    }
                                    {/* {moment(item.start, "HH:mm").format("hh:mm A")} */}
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
                                    {/* {moment(item.end, "HH:mm").format("hh:mm A")} */}
                                    {
                                        item.show_input ?
                                            <Input
                                                type="time"
                                                value={newEndTime ? newEndTime : item?.end || ""}
                                                onChange={(e) => {
                                                    setnewEndTime(e.target.value)
                                                    // const updatedTimeInfo = updateTimeInfo
                                                    // ? _.cloneDeep(updateTimeInfo)
                                                    // : {};
                                                    // updatedTimeInfo["end"] = e.target.value;
                                                    // setupdateTimeInfo(updatedTimeInfo);
                                                    // let updatedSchedule = {...scheduleInfo};
                                                    // const newEnd = moment(e.target.value, "HH:mm");
                                                    // // Update the end time of the current shift
                                                    // updatedSchedule["scheduled_shift"][index].end = newEnd.format("HH:mm");
                                                    // // Update subsequent shifts dynamically
                                                    // for (let i = index + 1; i < updatedSchedule.scheduled_shift.length; i++) {
                                                    // const prevShiftEnd = moment(updatedSchedule.scheduled_shift[i - 1].end, "HH:mm");
                                                    // const currentShiftDuration = moment(updatedSchedule.scheduled_shift[i].end, "HH:mm").diff(
                                                    // moment(updatedSchedule.scheduled_shift[i].start, "HH:mm"),
                                                    // "minutes"
                                                    // );

                                                    // updatedSchedule.scheduled_shift[i].start = prevShiftEnd.format("HH:mm");
                                                    // updatedSchedule.scheduled_shift[i].end = prevShiftEnd
                                                    // .clone()
                                                    // .add(currentShiftDuration, "minutes")
                                                    // .format("HH:mm");
                                                    // }
                                                    // console.log(updatedSchedule.scheduled_shift,'updatedSchedule')
                                                    // setScheduleInfo(updatedSchedule)

                                                }}
                                            />
                                            :
                                            moment(item.end, "HH:mm").format("hh:mm A")
                                    }

                                </>
                            )
                        }
                    },
                    {
                        accessor: 'menu',
                        Header: 'Action',
                        Cell: (cellProps) => {
                            var item = cellProps.row.original
                            var index = cellProps.row.index
                            return (
                                <div className="d-flex align-items-center gap-1">

                                    {/* {
 !item?.show_input ?
 <button className={item.show_input ? "btn btn-sm btn-soft-success" : "btn btn-sm btn-soft-primary"}
 onClick={() => {
 if (item.show_input) {
 handleUpdateShiftStartAndEnd(index, newStartTime, newEndTime);
 } else {
 const updatedScheduleInfo = { ...scheduleInfo };
 updatedScheduleInfo.scheduled_shift[index].show_input = true;
 setScheduleInfo(updatedScheduleInfo);
 }
 }}

 id={`tooltip-edit-${item._id}`} >
 <i className={`bx ${item.show_input ? "bx-check" : "bx-edit-alt"}`} />
 </button>
 :
 <Popconfirm placement="leftBottom" title={`Are You sure to change upcoming shifts ?`} onConfirm={() => {
 handleUpdateShiftStartAndEnd(index, newStartTime, newEndTime);
 }}>
 <button className={item.show_input ? "btn btn-sm btn-soft-success" : "btn btn-sm btn-soft-primary"}
 onClick={() => {
 
 }}
 id={`tooltip-edit-${item._id}`} >
 <i className={`bx ${item.show_input ? "bx-check" : "bx-edit-alt"}`} />
 </button>
 </Popconfirm>
 } */}

                                    {/* <UncontrolledTooltip placement="top" target={`tooltip-edit-${item._id}`}>
 {item.show_input ? "Update" : "Edit"}
 </UncontrolledTooltip> */}
                                    <Popconfirm placement="leftBottom" title={`Are You sure to delete ?`} onConfirm={() => { deleteShift(cellProps.row.index) }}>
                                        <span className="btn btn-sm btn-soft-danger" id={`tooltip-delete-${item._id}`}>
                                            <i className="bx bx-trash" />
                                        </span>
                                        <UncontrolledTooltip placement="top" target={`tooltip-delete-${item._id}`}>
                                            Delete
                                        </UncontrolledTooltip>
                                    </Popconfirm>
                                </div>
                            )

                        }
                    }
                ]
        }, [scheduleInfo, setScheduleInfo, deleteShift]);


    const handleRepeatMode = (event) => {
        console.log(event.target.value, 'handleRepeatMode')
        const scheduleInfoDup = _.cloneDeep(scheduleInfo)
        scheduleInfoDup["mode_id"] = event.target.value
        setScheduleInfo(scheduleInfoDup)
    }

    useEffect(() => {
        if (reUpdt && scheduleInfo.schedule_type === "24") {
            console.log("trigger")
            handleUpdateSchedule()
        }

    }, [reUpdt])



    const getNextSevenDays = (startDayIndex) => {
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
      };



    const updateScheduleType = (event) => {
        const updateTimeInfoDup = updateTimeInfo ? _.cloneDeep(updateTimeInfo) : {}
        const scheduleInfoDup = _.cloneDeep(scheduleInfo)
        scheduleInfoDup["scheduled_shift"] = []
        console.log(event.target.value,'event',scheduleInfoDup)
        if (scheduleInfoDup["mode_id"] === "1") {
            if (event.target.value === "24") {
                updateTimeInfoDup["start"] = "00:00"
                updateTimeInfoDup["end"] = "23:59",
                    updateTimeInfoDup["title"] = "Shift"
                scheduleInfoDup["scheduled_shift"].push({
                    start: "00:00",
                    end: "23:59",
                    title: "Shift"
                })
            }
            scheduleInfoDup["schedule_type"] = event.target.value

            setScheduleInfo(scheduleInfoDup)
            setupdateTimeInfo(event.target.value === "24" ?
                updateTimeInfoDup : null,
            );
            setReUpdt(true)
        }
        else if (scheduleInfoDup["mode_id"] === "2") {
            scheduleInfoDup["schedule_type"] = event.target.value
            if(event.target.value === "7"){
                scheduleInfoDup["scheduled_shift"] = getNextSevenDays()
            }
            else{
                scheduleInfoDup["scheduled_shift"]=[]
                scheduleInfoDup["days"]=scheduleInfoDup["days"]?.map((ele,idx)=>{
                  return {day : ele.day , day_id :ele.day_id,checked : ele.checked}
                })
              }
              setScheduleInfo(scheduleInfoDup)

        }
        else if(scheduleInfoDup["mode_id"] === "3"){
            scheduleInfoDup["schedule_type"] = event.target.value
            if(event.target.value === "mstart"){
                scheduleInfoDup["scheduled_shift"]=[{
                    startDate :"Every Month on 1st",
                    endDate :"Every Month on 28th",
                    dateInfo:{
                      startDate :1,
                      endDate :28
                    }  
                }]

            }
            else{
                scheduleInfoDup["scheduled_shift"]=[]

            }
            setScheduleInfo(scheduleInfoDup)

        }




    }

    const getOrdinalSuffix=(number)=> {
        const suffixes = ["th", "st", "nd", "rd"];
        const remainder = number % 100;
      
        // Determine the correct suffix based on the rules
        const suffix = 
          (remainder >= 11 && remainder <= 13) ? "th" :
          suffixes[number % 10] || "th";
      
        return `${number}${suffix}`;
      }



  const calculatedEndMonth=(dateInfo)=>{
        console.log(dateInfo,'dateInfo')
        const scheduleInfoDup = _.cloneDeep(scheduleInfo)
        // ${dateInfo.startDate}
        scheduleInfoDup["scheduled_shift"]=[{
          startDate :`Every Month on ${getOrdinalSuffix(dateInfo.startDate)}`,
          dateInfo,
          endDate :`Every Month on ${getOrdinalSuffix(dateInfo.endDate)}`,
        }]
        setScheduleInfo(scheduleInfoDup)
        // this.setState({
        //   publishTemplate
        // },()=>{
        //   this.updatePublishTemplateData()
        // })
      }
   

    const handleAutomateShift = () => {
        console.log(updateTimeInfo, 'updateTimeInfo')
        const startTime = updateTimeInfo.start
        const endTime = updateTimeInfo.end
        console.log(startTime, endTime)
        const scheduleInfoDup = _.cloneDeep(scheduleInfo)

        if (!Number(scheduleInfoDup.shift_count) || !startTime || !endTime) {
            alert("Please provide the number of shifts, start time, and end time.");
            return;
        }

        let startMoment = moment(startTime, "hh:mm A");
        let endMoment = moment(endTime, "hh:mm A");

        if (endMoment.isBefore(startMoment)) {
            endMoment.add(1, 'day'); // If end time is before start time, add 1 day
        }
        const totalDuration = endMoment.diff(startMoment, 'hours');

        if (totalDuration <= 0) {
            alert("End time must be after the start time.");
            return;
        }

        const hoursPerShift = totalDuration / Number(scheduleInfoDup.shift_count);
        const shifts = [];
        const newEvents = [];

        let currentStartTime = startMoment.clone();

        for (let i = 0; i < Number(scheduleInfoDup.shift_count); i++) {
            const currentEndTime = currentStartTime.clone().add(hoursPerShift, 'hours');

            // Prevent creating shifts that exceed the end time
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

            // Move the start time for the next shift
            currentStartTime = currentEndTime;
        }


        if (scheduleInfoDup["shift_type"] === "automate") {
            scheduleInfoDup["scheduled_shift"] = []

            scheduleInfoDup["scheduled_shift"] = [...shifts];

        }
        else {
            scheduleInfoDup["scheduled_shift"] = [...scheduleInfoDup["scheduled_shift"], ...shifts];

        }
        setupdateTimeInfo(null)
        setScheduleInfo(scheduleInfoDup)


    }


    const handleDayClick=(index)=>{
        let scheduleInfoDup = _.cloneDeep(scheduleInfo)
        const updatedDays = scheduleInfoDup.days.map((ele, idx) =>
            idx === index ? { ...ele, isSelected: !ele.isSelected } : {...ele, isSelected : false}
          );
          console.log(updatedDays,'updatedDays')
          scheduleInfoDup.days=updatedDays
          scheduleInfoDup.scheduled_shift= getNextSevenDays(Number(scheduleInfoDup.days[index]["day_id"] === "0" ? 7 :scheduleInfoDup.days[index]["day_id"] ))
          setScheduleInfo(scheduleInfoDup)
    }



    if (!dataLoaded) {
        return null;
    }


    return (
        <React.Fragment>
            <Container fluid>

                <div className="text-end mb-2">
                    <button onClick={() => { setShowConfig((prevShowConfig) => !prevShowConfig); }} className={ showConfig ? "btn btn-danger w-md btn-sm" : "btn btn-success w-md btn-sm" }
                    >
                        {showConfig ? "Hide" : "Show schedule info"}{" "}
                    </button>
                </div>
                {
                    console.log(scheduleInfo,'scheduleInfo')
                }

                {showConfig && (
                    <>
                        <div className="row mb-2">
                            <div className="col">
                                <Label htmlFor="autoSizingSelect"> Select Repeat Mode </Label>
                                <select
                                    type="select"
                                    name="repeat_mode"
                                    value={scheduleInfo?.mode_id}
                                    className="form-select"
                                    id="review_mode_level"
                                    required
                                    onChange={(e) => {
                                        handleRepeatMode(e);
                                    }}
                                >
                                    <option value="choose" disabled>
                                        Choose...
                                    </option>
                                    {repeatModeData.map((data, idx) => (
                                        <option value={String(idx)} key={idx}>
                                            {data.mode}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {
                                scheduleInfo.mode_id === "1" ?
                                    <div className="col">
                                        <FormGroup>
                                            <Label for="scheduleType">
                                                Select Schedule Type: <span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="select"
                                                name="scheduleType"
                                                id="scheduleType"
                                                defaultValue={scheduleInfo?.schedule_type || "select"}
                                                onChange={(e) => {
                                                    updateScheduleType(e);
                                                }}
                                            >
                                                <option value="select" disabled>
                                                    Select
                                                </option>
                                                <option value="24">24 hrs</option>
                                                <option value="custom">Custom</option>
                                            </Input>
                                        </FormGroup>
                                    </div>
                                    :
                                    scheduleInfo.mode_id === "2" ?
                                        <div className="col">
                                            <FormGroup>
                                                <Label for="scheduleType">
                                                    Select Schedule Type: <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                        type="select"
                                                        name="scheduleType"
                                                        id="scheduleType"
                                                    defaultValue={scheduleInfo?.schedule_type || "select"}
                                                    onChange={(e) => {
                                                        updateScheduleType(e);
                                                    }}
                                                >
                                                      <option value="select" disabled={true}>Select</option>
                                                        <option value="7">7 days</option>
                                                        <option value="custom">Custom</option>
                                                </Input>
                                            </FormGroup>
                                        </div>

                                        :
                                        scheduleInfo.mode_id === "3" ?
                                            <div className="col">
                                                <FormGroup>
                                                    <Label for="scheduleType">
                                                        Select Schedule Type: <span className="text-danger">*</span>
                                                    </Label>
                                                    <Input
                                                        type="select"
                                                        name="scheduleType"
                                                        id="scheduleType"
                                                        defaultValue={scheduleInfo?.schedule_type || "select"}
                                                        onChange={(e) => {
                                                            updateScheduleType(e);
                                                        }}
                                                    >
                                                        <option value="select" disabled={true}>Select</option>
                                                        <option value="mstart">Month Starts</option>
                                                        <option value="custom">Custom</option>
                                                    </Input>
                                                </FormGroup>
                                            </div>

                                            :
                                            null


                            }

                        </div>
                    </>
                )}
                <div>
                    {showConfig &&
                        <div className='text-end'>
                            <button className="btn btn-primary w-md btn-sm mb-1" onClick={() => { const master_id = sessionStorage.getItem("adt_master_id"); setDataLoaded(false); retriveMasterInfo(master_id); }}>
                                Reset
                            </button>
                        </div>
                    }
                    {scheduleInfo?.mode_id === "1" ?
                    (
                        <>
                           

                                    {showConfig ? (
                                    <Card style={{ border: '1px solid #e9e9e9' }}>
                                        <CardBody>
                                            <Row>
                                                <Col>
                                                    {scheduleInfo.schedule_type === "custom" && (
                                                        <>
                                                            <div className="d-flex align-items-center gap-3 mb-3">
                                                                <div>
                                                                    <Input
                                                                        type="radio"
                                                                        id="scheduleShift"
                                                                        name="shiftType"
                                                                        value="schedule"
                                                                        checked={scheduleInfo.shift_type === "schedule"}
                                                                        onChange={(e) => {
                                                                            var scheduleUpdt = _.cloneDeep(scheduleInfo);
                                                                            scheduleUpdt["shift_type"] = e.target.value;
                                                                            scheduleUpdt["scheduled_shift"] = [];
                                                                            scheduleUpdt.shift_count = 1
                                                                            setupdateTimeInfo(null)
                                                                            setScheduleInfo(scheduleUpdt);
                                                                            console.log(e.target.value);
                                                                        }}
                                                                    />
                                                                    <Label for="scheduleShift">
                                                                        &nbsp; Schedule Shift
                                                                    </Label>
                                                                </div>
                                                                <div>
                                                                    <Input
                                                                        type="radio"
                                                                        id="automateShift"
                                                                        name="shiftType"
                                                                        value="automate"
                                                                        checked={scheduleInfo.shift_type === "automate"}
                                                                        onChange={(e) => {
                                                                            console.log(e.target.value);
                                                                            var scheduleUpdt = _.cloneDeep(scheduleInfo);
                                                                            scheduleUpdt["shift_type"] = e.target.value;
                                                                            scheduleUpdt["scheduled_shift"] = [];
                                                                            scheduleUpdt.shift_count = 1
                                                                            console.log(scheduleUpdt, 'scheduleUpdt')
                                                                            setupdateTimeInfo(null)
                                                                            setScheduleInfo(scheduleUpdt);
                                                                        }}
                                                                    />
                                                                    <Label for="automateShift">
                                                                        &nbsp; Automate Shift
                                                                    </Label>
                                                                </div>
                                                                {/* <button className="btn btn-success btn-sm"
                                                                onClick={() => {
                                                                    const master_id = sessionStorage.getItem("adt_master_id");
                                                                    retriveMasterInfo(master_id);
                                                                }}
                                                            >Reset</button> */}
                                                            </div>


                                                            {scheduleInfo.shift_type === "schedule" ? (
                                                                <Row>
                                                                    <Col>
                                                                        <Label>Start Time</Label>
                                                                        <Input
                                                                            type="time"
                                                                            value={updateTimeInfo?.start || ""}
                                                                            onChange={(e) => {
                                                                                const updatedTimeInfo = updateTimeInfo
                                                                                    ? _.cloneDeep(updateTimeInfo)
                                                                                    : {};
                                                                                updatedTimeInfo["start"] = e.target.value;
                                                                                setupdateTimeInfo(updatedTimeInfo);
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                    <Col>
                                                                        <Label>End Time</Label>
                                                                        <Input
                                                                            type="time"
                                                                            value={updateTimeInfo?.end || ""}
                                                                            onChange={(e) => {
                                                                                const updatedTimeInfo = updateTimeInfo
                                                                                    ? _.cloneDeep(updateTimeInfo)
                                                                                    : {};
                                                                                updatedTimeInfo["end"] = e.target.value;
                                                                                setupdateTimeInfo(updatedTimeInfo);
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            ) : scheduleInfo.shift_type === "automate" ? (
                                                                <Row className="">
                                                                    <Col>
                                                                        <div className="d-flex align-items-end gap-2">
                                                                            <div>
                                                                                <Label>Create Schedule a day</Label>
                                                                                <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="form-control" />
                                                                            </div>
                                                                            <div>
                                                                                <Label>Start Time</Label>
                                                                                <Input
                                                                                    type="time"
                                                                                    value={updateTimeInfo?.start || ""}
                                                                                    onChange={(e) => {
                                                                                        const updatedTimeInfo = updateTimeInfo
                                                                                            ? _.cloneDeep(updateTimeInfo)
                                                                                            : {};
                                                                                        updatedTimeInfo["start"] =
                                                                                            e.target.value;
                                                                                        setupdateTimeInfo(updatedTimeInfo);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <Label>End Time</Label>
                                                                                <Input
                                                                                    type="time"
                                                                                    value={updateTimeInfo?.end || ""}
                                                                                    onChange={(e) => {
                                                                                        const updatedTimeInfo = updateTimeInfo
                                                                                            ? _.cloneDeep(updateTimeInfo)
                                                                                            : {};
                                                                                        updatedTimeInfo["end"] = e.target.value;
                                                                                        setupdateTimeInfo(updatedTimeInfo);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </Col>


                                                                </Row>
                                                            ) : (
                                                                <></>
                                                            )}

                                                            {scheduleInfo.shift_type && (
                                                                <Button
                                                                    color="primary"
                                                                    onClick={() => {
                                                                        if (scheduleInfo.shift_type === "schedule") {
                                                                            handleUpdateSchedule();
                                                                        } else {
                                                                            handleAutomateShift();
                                                                        }
                                                                    }}
                                                                    className="mt-3 btn btn-sm"
                                                                    outline
                                                                >
                                                                    Add Custom Schedule
                                                                </Button>
                                                            )}
                                                        </>
                                                    )}
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>

                                    ) : (
                                        <>
                                            {
                                                scheduleInfo.shift_type === "schedule" &&
                                                <Row>
                                                    <Col>
                                                        <Label>Start Time</Label>
                                                        <Input
                                                            type="time"
                                                            value={updateTimeInfo?.start || ""}
                                                            onChange={(e) => {
                                                                const updatedTimeInfo = updateTimeInfo
                                                                    ? _.cloneDeep(updateTimeInfo)
                                                                    : {};
                                                                updatedTimeInfo["start"] = e.target.value;
                                                                setupdateTimeInfo(updatedTimeInfo);
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Label>End Time</Label>
                                                        <Input
                                                            type="time"
                                                            value={updateTimeInfo?.end || ""}
                                                            onChange={(e) => {
                                                                const updatedTimeInfo = updateTimeInfo
                                                                    ? _.cloneDeep(updateTimeInfo)
                                                                    : {};
                                                                const oldEndTime = updateTimeInfo?.end || "";
                                                                updatedTimeInfo["end"] = e.target.value;
                                                                extendShift(
                                                                    scheduleInfo.scheduled_shift,
                                                                    oldEndTime,
                                                                    e.target.value
                                                                );
                                                                setupdateTimeInfo(updatedTimeInfo);
                                                            }}
                                                        />
                                                    </Col>
                                                </Row>
                                            }

                                            <Row>
                                                <Col>
                                                    {scheduleInfo.shift_type && scheduleInfo.shift_type === "schedule" && (
                                                        <Button
                                                            color="primary"
                                                            onClick={() =>
                                                                scheduleInfo.shift_type === "schedule"
                                                                    ? handleUpdateSchedule()
                                                                    : handleAutomateShift()
                                                            }
                                                            className="mt-3 btn btn-sm"
                                                            outline
                                                        >
                                                            Add Custom Schedule
                                                        </Button>
                                                    )}
                                                </Col>
                                            </Row>
                                        </>
                                    )}

                              

                            <Row>
                                {scheduleInfo.next_date && (
                                    <div className="d-flex align-items-center my-3">
                                        <div className="text-danger me-2"style={{ fontSize: "medium", cursor: "pointer" }} >
                                            <i className="mdi mdi-information-outline me-1" />
                                            <span>This Shift goes for the next date also</span>
                                        </div>
                                    </div>
                                )}
                                <Col>
                                    <Card style={{ border: '1px solid #e9e9e9' }}>
                                        <CardBody>
                                            <label>Scheduled Jobs</label>
                                            <TableContainer
                                                columns={columns}
                                                data={scheduleInfo.scheduled_shift}
                                                isGlobalFilter={true}
                                                isAddOptions={false}
                                                isJobListGlobalFilter={false}
                                                customPageSize={10}
                                                isPagination={true}
                                                iscustomPageSizeOptions={false}
                                                filterable={false}
                                                tableClass="align-middle table-nowrap table-check"
                                                theadClass="table-light"
                                                paginationDiv="col-sm-12 col-md-7"
                                                pagination="pagination justify-content-end pagination-rounded"
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    ) :
                    scheduleInfo?.mode_id === "2" ?(
                    <>
                        {
                        scheduleInfo.schedule_type ==="custom" &&
                            <>
                        <h3 className="text-center mb-4">Select Days</h3>
                        <table className="table table-bordered text-center">
                          <thead className="table-light">
                            <tr>
                              <th>Action</th>
                              <th>Day</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scheduleInfo.days.map((ele, idx) => (
                              <tr
                                key={idx}
                                className={ele?.isSelected ? "table-primary" : ""}
                                style={{
                                  transition: "background-color 0.2s",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDayClick(idx)}
                              >
                                <td>
                                  <div className="d-flex align-items-center">
                                    <input
                                      type="radio"
                                      checked={ele?.isSelected}
                                    //   onChange={() => this.handleDayClick(idx)}
                                      style={{ marginRight: "auto" }}
                                    />
                                  </div>
                                </td>
                                <td className="text-start">
                                  {ele.day}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </>
                        }


                                {
                                    scheduleInfo.scheduled_shift.length > 0 &&
                                    <div className="text-center my-3">
                                        <Row>
                                            <Col md={6}>
                                                <ListGroup flush className="border rounded shadow-sm">
                                                    <ListGroupItem className="d-flex align-items-center justify-content-between text-muted">
                                                        <div>
                                                            <i className="mdi mdi-circle-medium me-2"></i>
                                                            Audit Starts on
                                                        </div>
                                                        <span className="text-success">{scheduleInfo.scheduled_shift[0]?.day}</span>
                                                    </ListGroupItem>
                                                    <ListGroupItem className="d-flex align-items-center justify-content-between text-muted">
                                                        <div>
                                                            <i className="mdi mdi-circle-medium me-2"></i>
                                                            Audit Ends on
                                                        </div>
                                                        <span className="text-danger">{scheduleInfo.scheduled_shift[scheduleInfo.scheduled_shift.length - 1]["day"]}</span>
                                                    </ListGroupItem>
                                                </ListGroup>

                                            </Col>
                                        </Row>

                                    </div>
                                }

                </>
                    )
               
                    :
                    scheduleInfo?.mode_id === "3" ?
                    (
                        <>
                        {
                        scheduleInfo.schedule_type === "custom" &&
                        <>
                          <Calendar
                      calculatedDate={(dateInfo)=>{
                        calculatedEndMonth(dateInfo)
                      }}
                      selectedDate={scheduleInfo.scheduled_shift.length >0 ? scheduleInfo.scheduled_shift[0]?.dateInfo?.startDate : null}
                      />
                      </>
                      }
                      {
                  scheduleInfo.scheduled_shift.length > 0 &&
                  <div className="text-center my-3">
                  <Row>
                    <Col md={6}>
                    <ListGroup flush className="border rounded shadow-sm">
                        <ListGroupItem className="d-flex align-items-center justify-content-between text-muted">
                          <div>
                            <i className="mdi mdi-circle-medium me-2"></i>
                            Audit Starts on
                          </div>
                          <span className="text-success">{scheduleInfo?.scheduled_shift[0]["startDate"]}</span>
                        </ListGroupItem>
                        <ListGroupItem className="d-flex align-items-center justify-content-between text-muted">
                          <div>
                            <i className="mdi mdi-circle-medium me-2"></i>
                            Audit Ends on
                          </div>
                          <span className="text-danger">{scheduleInfo?.scheduled_shift[scheduleInfo?.scheduled_shift.length -1]["endDate"]}</span>
                        </ListGroupItem>
                      </ListGroup>
                   
                    </Col>
                  </Row>
                   
                </div>
                }
                       
                        </>
                    )
                    :
                    (
                        <>
                        </>
                    )
                }



                    <footer
                        style={{
                            display: 'flex',
                            alignItems: "center",
                            height: 50,
                            background: "#fff",
                            width: "100%",
                            position: "fixed",
                            bottom: 0,
                            zIndex: 999,
                            borderTop: "1px solid #dedede"
                        }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                            <button className="btn btn-success btn-sm w-md" onClick={() => { updateAuditMasterInfo(); }} >
                                Save
                            </button>
                        </div>
                    </footer>
                    {/* <button className="btn btn-success btn-sm" onClick={() => { updateAuditMasterInfo(); }} >
 Save
 </button> */}
                </div>

            </Container>
        </React.Fragment>
    );
};

export default UpdateShiftInfo;
