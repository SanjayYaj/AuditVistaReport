import React, { useEffect, useMemo, useState,useRef } from 'react'
import { Row, Col, Card, CardBody,Label, Button,Offcanvas,OffcanvasHeader,OffcanvasBody } from 'reactstrap';
import TableContainer from 'common/TableContainer';
import urlSocket from 'helpers/urlSocket';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
// import { dispatch } from 'd3';
import { useDispatch } from 'react-redux';
import { setHierarchyData, setNavItems, setpublishTemplate, updateEndpointsData, updateHierarchyData, updatepublishedTempData } from 'toolkitStore/Auditvista/ManageAuditSlice';
import { Multiselect } from 'multiselect-react-dropdown';
import Swal from 'sweetalert2';
import LocationUserList from './LocationUserList';


const LocationList = (props) => {

    const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
    const manageAuditSlice = useSelector(state => state.manageAuditSlice)
    const [resetMultiSelect,setresetMultiSelect] = useState(true)
    const [stageCount,setstageCount] = useState(null)
    const hierarchyData = manageAuditSlice.hierarchyData
    const publishTemplate = manageAuditSlice.publishTemplate
    const dispatch= useDispatch()
    const multiRef= useRef()
    const [hData, setHdata] = useState(hierarchyData)
    const [dynamicColumns, setDynamicColumns] = useState([]);
    const [openUserList, setopenUserList] = useState(false)

   
    useEffect(() => {
        console.log('ifffffff :>> ', hierarchyData.endpoints);
        setHdata(hierarchyData)
    }, [hierarchyData.endpoints])



    const changeAuditUserHandler=async( selectedList, selectedItem, item, mode, action,removedIndex)=>{
        const hierarchyDataInfo = _.cloneDeep(hData)
        var findIdx 
        if (mode !== "3") {
             findIdx = _.findIndex(item.adt_users, (user) =>
                user.user_id === selectedItem.user_id && user.audit_type !== "3"
            );
        }
        else{
            findIdx = removedIndex ? removedIndex : _.findIndex(item.adt_users, (user) =>
                user.user_id === selectedItem.user_id
            );
        }
        const epIdx = _.findIndex(hierarchyDataInfo.endpoints,{_id :item._id })
        if (findIdx === -1) {
            item.adt_users.push({
                audit_type: mode,
                designation: null,
                email_id: selectedItem.email_id,
                name: selectedItem.name,
                phone_num: selectedItem.phone_num,
                user_code: selectedItem.user_code,
                user_id: selectedItem.user_id
            })
        }
        else {
            console.log(item.adt_users[findIdx]["audit_type"],item,findIdx,action,'item.adt_users[findIdx]["audit_type"]')
            if(item.adt_users[findIdx]["audit_type"] !== mode && mode !=="3"){
                setresetMultiSelect(false)
                selectedList = selectedList.filter((ele) => {
                    if (ele.user_id !== selectedItem.user_id && ele.audit_type !== selectedItem.audit_type) {
                        return ele
                    }
                })
                console.log(selectedList,'selectedList')
                multiRef.current.state.selectedValues = selectedList
                Swal.fire({
                    icon: 'warning',
                    title: 'warning!',
                    text: 'This user is already selected to another task in this location. Try different user.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        setTimeout(() => {
                            setresetMultiSelect(true)
                                
                            }, 200);
                    }
                    else{
                            setresetMultiSelect(true)
                    }
                })
            }else if (action === "remove") {
                if (findIdx !== -1) {
                    item.adt_users.splice(findIdx, 1)
                }
            }
            else{
                item.adt_users.push({
                    audit_type: mode,
                    designation: null,
                    email_id: selectedItem.email_id,
                    name: selectedItem.name,
                    phone_num: selectedItem.phone_num,
                    user_code: selectedItem.user_code,
                    user_id: selectedItem.user_id
            })
            }
        }
        var checkLocValid = publishTemplate.settings.enable_review ? _.filter(item.adt_users, { audit_type: "1" }).length > 0 && _.filter(item.adt_users, { audit_type: "2" }).length > 0 : _.filter(item.adt_users, { audit_type: "1" }).length > 0
        item["rowValid"]=checkLocValid
        hierarchyDataInfo["endpoints"][epIdx]=item
        var checkAllEndpointsValid = _.every(hierarchyDataInfo["endpoints"], { rowValid: true })
        if(checkAllEndpointsValid){
            const publishTempInfo = _.cloneDeep(publishTemplate)
            publishTempInfo["cc_level"]=2
            dispatch(setpublishTemplate(publishTempInfo))
            await updateTempMasterInfo(publishTempInfo)
        }
        else{
            const publishTempInfo = _.cloneDeep(publishTemplate)
            publishTempInfo["cc_level"]=1
            dispatch(setpublishTemplate(publishTempInfo))
            await updateTempMasterInfo(publishTempInfo)
        }
        console.log(hierarchyDataInfo,'hierarchyDataInfo');
        setHdata(hierarchyDataInfo)
        await updateHData(hierarchyDataInfo)
    //    await dispatch(setHierarchyData(hierarchyDataInfo))
    }


    const updateTempMasterInfo = async (publishTemplateInfo) => {

        try {
            const responseData = await dispatch(updatepublishedTempData(publishTemplateInfo))

        } catch (error) {
            //console.log(error, 'error');
        }

    }


 const updateHData = async (hlevelData) => {
    try {
    const responseData = await dispatch(updateHierarchyData(hlevelData))
      if (responseData.status === 200) {
        dispatch(setHierarchyData(responseData.data.hData[0]))
      }
    } catch (error) {
        //console.log(error,'error')
    }
  }




    const columns = useMemo(() => [
        {
            accessor: 'hlevel_name_',
            Header: 'SNO',
            Cell: (cellProps) => {
                var item = cellProps.row.index
                var data = cellProps.row.original
                return (
                    <>
                        <div className="font-size-12" style={{ display: 'flex', 
                            // opacity: item.disabled ? "50%" : "none", 
                            flexDirection: 'column' }}>
                            {item + 1}
                        </div>
                    </>
                )
            }
        },
        {
            accessor: 'hlevel_name',
            Header: 'Location',
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                        <div className="font-size-12" style={{ display: 'flex',
                            //  opacity: item.disabled ? "50%" : "none", 
                             flexDirection: 'column'}}>
                            {item.hlevel_name}
                        </div>
                    </>
                )
            }
        },
        {
            accessor: 'hlevel',
            Header: 'Category',
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <span className="font-size-11" >
                        {item.hlevel}
                    </span>
                )
            }
        },
        {
            accessor: 'adt_usr',
            Header: 'Audit User',
            Cell: (cellProps) => {
                var item = _.cloneDeep(cellProps.row.original)
                var index = cellProps.row.index
                var mappedUser = _.filter(item.adt_users, { audit_type: "1" })
                if(mappedUser.length >0){
                    item["rowValid"] = true
                }
                return (
                    <>
                        <div>
                            {resetMultiSelect &&
                                <Multiselect
                                    ref={multiRef}
                                    options={item?.unique_users.map((data) => ({
                                        name: `${data.name}`,
                                        user_id: data.user_id,
                                        audit_type: "1",
                                        email_id: data.email_id,
                                        phone_num: data.phone_num,
                                        user_code: null,
                                    }))}
                                    selectedValues={mappedUser ? mappedUser : []}
                                    onSelect={(selectedList, selectedItem) =>
                                        changeAuditUserHandler(selectedList, selectedItem, _.cloneDeep(item), "1", 'add')
                                    }
                                    onRemove={(selectedList, removedItem) =>{
                                          
                                        changeAuditUserHandler(selectedList, removedItem, _.cloneDeep(item), "1", 'remove')}
                                    }
                                    displayValue="name"
                                    disable={item.disabled}
                                    placeholder="Choose..."
                                />
                            }
                        </div>
                    </>
                )
            }
        },
        {
            accessor: '',
            Header: 'Review User',
            hidden: publishTemplate.settings.enable_review ? false : true,
            Cell: (cellProps) => {
                var item = _.cloneDeep(cellProps.row.original)
                var index = cellProps.row.index
                var mappedUser =_.filter(item.adt_users, { audit_type: "2" })
                if(mappedUser.length >0){
                    item["rowValid"] = true
                }
                return (
                    <>
                        {
                            !publishTemplate.settings.enable_review ? <div className="text-secondary">Review not enable</div> : null
                        }
                        {
                            publishTemplate.settings.enable_review ?
                                <div>
                                    <Multiselect
                                        ref={multiRef}
                                        options={item?.unique_users
                                            .map((data) => ({
                                                name: `${data.name}`,
                                                user_id: data.user_id,
                                                audit_type: "2",
                                                email_id: data.email_id,
                                                phone_num: data.phone_num,
                                                user_code: null,
                                            }))
                                        }
                                        selectedValues={mappedUser ? mappedUser : []}
                                        onSelect={(selectedList, selectedItem) =>
                                            changeAuditUserHandler(selectedList, selectedItem, _.cloneDeep(item), "2", 'add')
                                        }
                                        onRemove={(selectedList, removedItem) =>
                                            changeAuditUserHandler(selectedList, removedItem, _.cloneDeep(item), "2", 'remove')
                                        }
                                        displayValue="name"
                                        disable={item.disabled}
                                        placeholder="Choose..."
                                    />
                                </div> : null
                        }

                    </>
                )
            }
        },
        {
            accessor: 'inch_usr',
            Header: 'Auditee',
            Cell: (cellProps) => {
                var item = cellProps.row.original
                var index = cellProps.row.index
                var mappedUser = _.filter(item.adt_users,{audit_type:"3"})
              
                return (
                    <>
                        <div>
                             <Multiselect
                                options={item?.unique_users.map((data) => ({
                                    name: `${data.name}`,
                                    user_id: data.user_id,
                                    audit_type :"3",
                                    email_id : data.email_id,
                                    phone_num : data.phone_num,
                                    user_code : null,
                                }))}
                                selectedValues={mappedUser ? mappedUser : []}
                                onSelect={(selectedList, selectedItem) =>
                                    changeAuditUserHandler(selectedList,selectedItem, _.cloneDeep(item), "3", 'add')
                                }
                                onRemove={(selectedList, removedItem) =>{
                                      const removedIndex = item?.adt_users.findIndex(option => option.user_id === removedItem.user_id &&option.audit_type === "3");
                                            console.log(removedIndex,'removedIndex')
                                    changeAuditUserHandler(selectedList,removedItem, _.cloneDeep(item), "3", 'remove',removedIndex)}
                                }
                                displayValue="name"
                                disable={item.disabled}
                                placeholder="Choose..."
                            />


                        </div>
                    </>
                )
            }
        },

      
        {
            accessor: "menus",
            Header: "Action",
            Cell: (cellProps) => {
                var item = cellProps.row.original
                var index = cellProps.row.index
                return (
                    <div className="d-flex gap-1" style={{ display: 'flex', alignContent: 'center' }}>

                        <button className={item.disabled ? "btn btn-md btn-outline-success" : "btn btn-md btn-outline-danger"}
                        onClick={(e)=>{
                            ignoreLocation(e,index,item,item.disabled === true ? false :true )
                        }}

                        >{item.disabled ? "Reconsider" : "Ignore"} </button>
                    </div>
                )
            },
        },

    ], [
        publishTemplate, resetMultiSelect, hData
    ])
    // const columns = useMemo(() => [...baseColumns, ...dynamicColumns], [baseColumns, dynamicColumns]);


    const ccLevelValidation = async (endpoints) => {
        console.log(endpoints,'endpoints');
        var checkAllEndpointsValid =endpoints.length >0 ? _.every(endpoints, e => e.rowValid === true && (e.disabled === false || e.disabled === undefined)) : false
        //  _.every(endpoints, { rowValid: true })
        console.log(checkAllEndpointsValid,'checkAllEndpointsValid')
        return checkAllEndpointsValid
    
      }



    const ignoreLocation=(event, idx, item, mode)=>{
        const hierarchyDataInfo = _.cloneDeep(hierarchyData)
        const publishTemplateInfo = _.cloneDeep(publishTemplate)
        Swal.fire({
            icon: !mode ? 'warning':'error',
            title: !mode ? 'Reconsider Confirmation' : 'Ignore Confirmation',
            text: `Are you sure you want to ${!mode ? 'reconsider' : 'ignore'} this location?`,
            showCancelButton: true,
            confirmButtonColor: '#34c38f',
            cancelButtonColor: '#f46a6a',
            confirmButtonText: 'Ignore',
            cancelButtonText: 'Cancel',
            customClass: {
              icon: 'swal-icon-small', // Apply a custom class to the icon
          },
          }).then(async(result) => {
            if (result.isConfirmed) {
                hierarchyDataInfo["endpoints"][idx]["disabled"]=mode
                dispatch(setHierarchyData(hierarchyDataInfo))
                await updateHData(hierarchyDataInfo)
                const result = await ccLevelValidation(_.filter(hierarchyDataInfo.endpoints, e => e.disabled === false || e.disabled === undefined))
                console.log(result,'result',hierarchyDataInfo);
                if(result){
                    publishTemplateInfo["cc_level"] =2
                    dispatch(setpublishTemplate(publishTemplateInfo))
                    await updateTempMasterInfo(publishTemplateInfo)
                }
                else{
                    publishTemplateInfo["cc_level"] =1
                    dispatch(setpublishTemplate(publishTemplateInfo))
                    await updateTempMasterInfo(publishTemplateInfo)
                }

            }

          })

    }


    const updateEndpoints = async (endpointsId, mode, reviewEnable,publishTemplateInfo) => {
        // const publishTemplateInfo = _.cloneDeep(publishTemplate)

        try {
            var statusInfo={}
            if(publishTemplateInfo.adt_based_on === "0"){
                var adtIdx = _.findIndex(hierarchyData.usr_selected, { audit_type: "1" })
                var incIdx = _.findIndex(hierarchyData.usr_selected, { audit_type: "3" })
                var reviewIdx = _.findIndex(hierarchyData.usr_selected, { audit_type: "2" })
                statusInfo ={
                    review: reviewIdx !==-1 ? true : false,
                    audit: adtIdx !==-1 ? true : false,
                    auditee: incIdx !==-1 ? true : false,
                  }

            }
            const responseData =publishTemplateInfo.adt_based_on === "0" ?  await dispatch(updateEndpointsData(endpointsId, mode, publishTemplateInfo.settings.enable_review,publishTemplateInfo,statusInfo)) : publishTemplateInfo.settings.enable_review ? await dispatch(updateEndpointsData(endpointsId, mode, publishTemplateInfo.settings.enable_review,publishTemplateInfo)) :{
                status :200,
                data :{
                    hData:[_.cloneDeep(hierarchyData)]
                }
            }
            if (responseData.status === 200) {
                console.log(responseData,'responseData');
                dispatch(setHierarchyData(responseData.data.hData[0]))
                const result = _.every(responseData.data.hData[0].endpoints, { rowValid: true })
                console.log(result,'result');
                // await ccLevelValidation(_.filter(responseData.data.hData[0].endpoints,{disabled : false}))
                if(result){
                    if(publishTemplateInfo.repeat_mode !== null){
                        if (publishTemplateInfo.repeat_mode === "One time" && (publishTemplateInfo.audit_start_date !== null && publishTemplateInfo.audit_end_date !== null) ) {
                            publishTemplateInfo["cc_level"] = 5
                          }
                          else if (publishTemplateInfo.repeat_mode_config.scheduled_shift?.length > 0) {
                            publishTemplateInfo["cc_level"] = 4
                          }
                          else {
                            publishTemplateInfo["cc_level"] = 2
                      
                          }
                    }
                    else{
                        publishTemplateInfo["cc_level"] =2
                    }
                    dispatch(setpublishTemplate(publishTemplateInfo))
                    await updateTempMasterInfo(publishTemplateInfo)
                }
                else{
                    publishTemplateInfo["cc_level"] =1
                    dispatch(setpublishTemplate(publishTemplateInfo))
                    await updateTempMasterInfo(publishTemplateInfo)
                }
            }

        } catch (error) {
            console.log(error, 'error')
        }

    }

      const addStages=()=>{
        console.log(baseColumns,dynamicColumns,'baseeee',stageCount)
        const newColumn = {
            accessor: '',
            Header: `Review User`,
            hidden: publishTemplate.settings.enable_review ? false : true,
            Cell: (cellProps) => {
              const item = cellProps.row.original;
              const index = cellProps.row.index;
              const mappedUser = _.filter(item.adt_users, { audit_type: "2" });
          
              if (mappedUser.length > 0) {
                item["rowValid"] = true;
              }
          
              return (
                <>
                  {
                    !publishTemplate.settings.enable_review
                      ? <div className="text-secondary">Review not enable</div>
                      : <div>
                          <Multiselect
                            ref={multiRef}
                            options={item?.unique_users.map((data) => ({
                              name: `${data.name}`,
                              user_id: data.user_id,
                              audit_type: "2",
                              email_id: data.email_id,
                              phone_num: data.phone_num,
                              user_code: null,
                            }))}
                            selectedValues={mappedUser || []}
                            onSelect={(selectedList, selectedItem) =>
                              changeAuditUserHandler(selectedList, selectedItem, item, "2", 'add')
                            }
                            onRemove={(selectedList, removedItem) =>
                              changeAuditUserHandler(selectedList, removedItem, item, "2", 'remove')
                            }
                            displayValue="name"
                            disable={item.disabled}
                            placeholder="Choose..."
                          />
                        </div>
                  }
                </>
              );
            }
          };
          var obj={}
          var arr=[]
          for (let i = 0; i < Number(stageCount); i++) {
            // obj=newColumn["Header"]+i
            obj={
                ...newColumn,
                Header : newColumn["Header"]+" " + (i+2)
            }
            arr.push(obj)
            obj={}
          }
          console.log(arr,'arr')
          setDynamicColumns(prev => [...prev, ...arr]);


      }


      const onDrawerClose = async () => {
        setopenUserList(false)
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


      const updateReviewSchedule=async(checked,publishTempInfo)=>{
        console.log(checked,publishTempInfo,'publishTempInfo');
        if(checked){
            if(publishTempInfo.repeat_mode_config.mode_id === "1"){
                var updatedShift=[]
                publishTempInfo.repeat_mode_config.scheduled_shift.map((ele,idx)=>{
                    let [hours, minutes] = ele.end.split(":").map(Number);
                    var timeData = _.cloneDeep(ele)
                    hours = (hours + 1) % 24;
                    const newTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    timeData["end"]=newTime
                    updatedShift.push(timeData)
                })

                publishTempInfo.repeat_mode_config_review=[
                    {
                        ...publishTempInfo.repeat_mode_config_review[0],
                        mode_id:  publishTempInfo.repeat_mode_config.mode_id,
                        mode:  publishTempInfo.repeat_mode_config.mode,
                        schedule_type:  publishTempInfo.repeat_mode_config.schedule_type,
                        shift_type:  publishTempInfo.repeat_mode_config.shift_type,
                        scheduled_shift:  updatedShift,
                    }
                ]


            }
            else if(publishTempInfo.repeat_mode_config.mode_id === "2"){
                var updatedShift=[]
                if(publishTempInfo.repeat_mode_config.schedule_type === "7"){
                    updatedShift=getNextEightDays()
                }
                else{
                    var findIdx = _.findIndex(publishTempInfo.repeat_mode_config.days,{isSelected : true})
                    // updatedShift = 
                    console.log(findIdx,'findIdx');
                    if(findIdx !==-1){
                        const updatedDays = publishTempInfo.repeat_mode_config.days.map((ele, idx) =>
                            idx === findIdx ? { ...ele, isSelected: true } : { ...ele, isSelected: false }
                          );
                          console.log(updatedDays,'updatedDays');
                        updatedShift =getNextEightDays(Number(publishTempInfo.repeat_mode_config.days[findIdx]["day_id"] === "0" ? 7 : publishTempInfo.repeat_mode_config.days[findIdx]["day_id"]))
                        console.log(publishTempInfo.repeat_mode_config.days[findIdx]["day_id"],'publishTempInfo.repeat_mode_config.days[findIdx]["day_id"]');
                        publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] =  updatedShift
                        publishTempInfo["repeat_mode_config_review"][0]["days"] =  updatedDays
                        publishTempInfo["repeat_mode_config_review"][0]["week_interval"] =  8

                    }
                }
                //  publishTempInfo.repeat_mode_config.scheduled_shift === "7" ? getNextEightDays() : []
                publishTempInfo.repeat_mode_config_review=[
                    {
                        ...publishTempInfo.repeat_mode_config_review[0],
                        mode_id:  publishTempInfo.repeat_mode_config.mode_id,
                        mode:  publishTempInfo.repeat_mode_config.mode,
                        schedule_type:  publishTempInfo.repeat_mode_config.schedule_type,
                        shift_type:  publishTempInfo.repeat_mode_config.shift_type,
                        scheduled_shift:  updatedShift,
                        stage: "1"
                    }
                ]

            }
            else if(publishTempInfo.repeat_mode_config.mode_id === "3"){
                  var updatedShift=[]
                  publishTempInfo["repeat_mode_config_review"][0]["evermnth"] =publishTempInfo.repeat_mode_config.evermnth
                //   publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] =[]       
                    publishTempInfo["repeat_mode_config_review"][0]["schedule_type"] = publishTempInfo.repeat_mode_config["schedule_type"]
                          publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"]=[{
                            startDate: "Every Month on 1st",
                            endDate: "Every Month on 1st",
                            dateInfo: {
                              startDate: 1,
                              endDate: 1,
                              duration:1
                            }
                          }]
                publishTempInfo["repeat_mode_config_review"][0]["scheduled_shift"] = publishTempInfo.repeat_mode_config["schedule_type"] === "custom" ?
                    [{ startDate: `Every Month on ${publishTempInfo.repeat_mode_config.scheduled_shift[0].dateInfo.startDate}${await ordinal_suffix_of(publishTempInfo.repeat_mode_config.scheduled_shift[0].dateInfo.startDate)}`, dateInfo: publishTempInfo.repeat_mode_config.scheduled_shift[0].dateInfo, endDate: `Every Next Month on ${publishTempInfo.repeat_mode_config.scheduled_shift[0].dateInfo.startDate}${await ordinal_suffix_of(publishTempInfo.repeat_mode_config.scheduled_shift[0].dateInfo.startDate)}`, }]
                    :
                    [{
                        startDate: "Every Month on 1st",
                        endDate: "Every Month on 1st",
                        dateInfo: {
                            startDate: 1,
                            endDate: 1,
                            duration: 1
                        }
                    }]

               
                publishTempInfo.repeat_mode_config_review=[
                    {
                        ...publishTempInfo.repeat_mode_config_review[0],
                        mode_id:  publishTempInfo.repeat_mode_config.mode_id,
                        mode:  publishTempInfo.repeat_mode_config.mode,
                        stage: "1"
                    }
                ]


            }
        }
        else{
            publishTempInfo.repeat_mode_config_review=[
                {
                    mode: null,
                    mode_id: null,
                    start_date: null,
                    end_date: null,
                    job_status : true,
                    days: [
                        {
                          day: "Sunday",
                          day_id: "0",
                          "checked": false
                        },
                        {
                          day: "Monday",
                          day_id: "1",
                          "checked": false
                        },
                        {
                          day: "Tuesday",
                          day_id: "2",
                          "checked": false
                        },
                        {
                          day: "Wednesday",
                          day_id: "3",
                          "checked": false
                        },
                        {
                          day: "Thursday",
                          day_id: "4",
                          "checked": false
                        },
                        {
                          day: "Friday",
                          day_id: "5",
                          "checked": false
                        },
                        {
                          day: "Saturday",
                          day_id: "6",
                          "checked": false
                        },
                      ],
                }
            ]


        }
        return publishTempInfo

      }



    return (
        <Card style={{ border: '1px solid #e9e9e9' }}>
            <CardBody>
                <div className="form-check form-switch form-switch-sm mb-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={"review"}
                        defaultChecked={publishTemplate?.settings?.enable_review}
                        onClick={async(e)=>{
                            const publishTempInfo = _.cloneDeep(publishTemplate)
                            const hierarchyDataInfo = _.cloneDeep(hierarchyData)
                            console.log(e.target.checked,'e.target.checked')
                            publishTempInfo["settings"]["enable_review"]=e.target.checked
                            if(e.target.checked){
                                dispatch(setNavItems([
                                    { id: 1, label: 'Hierarchy Level', icon: 'bx bx-sitemap', minLevel: 0 },
                                    { id: 2, label: 'Audit / Review', icon: 'bx bxs-user', minLevel: 1 },
                                    { id: 3, label: 'Audit Schedule', icon: 'bx bx-cog', minLevel: 2 },
                                    { id: 4, label: 'Review Schedule', icon: 'bx bx-cog', minLevel: 3 },
                                    // { id: 5, label: 'Report Schedule', icon: 'bx bx-cog', minLevel: 2 },
                                   
                                    // { id: 5, label: 'Audit Summary Frequency', icon: 'bx bx-cog', minLevel: 5 },
                                    { id: 6, label: 'Confirm & Publish', icon: 'bx bx-badge-check', minLevel: 4 },
                                  ]))
                            }
                            else{
                                dispatch(setNavItems([
                                    { id: 1, label: 'Hierarchy Level', icon: 'bx bx-sitemap', minLevel: 0 },
                                    { id: 2, label: 'Audit / Review', icon: 'bx bxs-user', minLevel: 1 },
                                    { id: 3, label: 'Audit Schedule', icon: 'bx bx-cog', minLevel: 2 },
                                    // { id: 4, label: 'Report Schedule', icon: 'bx bx-cog', minLevel: 2 },
                                    // { id: 5, label: 'Audit Summary Frequency', icon: 'bx bx-cog', minLevel: 2 },
                                    { id: 6, label: 'Confirm & Publish', icon: 'bx bx-badge-check', minLevel: 4 },
                                  ]))
                            }
                            if(publishTempInfo.adt_based_on === "0"){
                                publishTempInfo["usr_selected"]=_.map(hierarchyDataInfo["usr_selected"],"user_id")
                            }
                           const updatedInfo = await updateReviewSchedule(e.target.checked,publishTempInfo)
                           console.log(updatedInfo,'updatedInfo');
                            await updateEndpoints(hierarchyDataInfo.ep_selected, publishTempInfo.adt_based_on === "0" ? "3" : "2", e.target.checked, updatedInfo)
                            // await updateTempMasterInfo(publishTempInfo)
                            // dispatch(setpublishTemplate(publishTempInfo))
                        }}
                    />
                    <label className={"form-check-label text-primary"} htmlFor={"review"}
                    >
                        Enable Review
                    </label>
                  
                </div>
                {
                    publishTemplate.adt_based_on === "0" &&
                    <>
                        <Row>
                            <Col className='text-end'>
                                <button
                                    className='btn btn-sm btn-dark me-2'
                                    onClick={() => {
                                        setopenUserList(true)
                                    }}
                                >View User List</button> &nbsp;&nbsp;
                            </Col>
                        </Row> &nbsp;
                    </>
                }

                <Row>
                    <Col>
                        <TableContainer
                            columns={columns}
                            // data={_.cloneDeep(hierarchyData.endpoints)}
                            data={hData.endpoints}
                            isAddOptions={false}
                            isJobListGlobalFilter={false}
                            customPageSize={10}
                            style={{ width: '100%' }}
                            isPagination={true}
                            filterable={false}
                            tableClass="align-middle table-nowrap table-check"
                            theadClass="table-light"
                            pagination="pagination pagination-rounded justify-content-end my-2"
                            isGlobalFilter={true}
                        />
                    </Col>
                </Row>
                   {
                                                      openUserList &&
                                                      <Offcanvas
                                                        isOpen={openUserList}
                                                        toggle={onDrawerClose}
                                                        direction="end" // 'end' for right side, use 'start' for left
                                                        style={{ width: '800px', zIndex: 9999 }}
                                                      >
                                                        <OffcanvasHeader toggle={onDrawerClose}>
                                                          <span>Location Users</span>
                                                        </OffcanvasHeader>
                                                        <OffcanvasBody>
                                                          <LocationUserList 
                                                          onDrawerClose={onDrawerClose}
                                                          />
                                                        </OffcanvasBody>
                                                      </Offcanvas>
                                                    }
               
            </CardBody>
        </Card>
    )
}
export default LocationList
