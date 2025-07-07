import React, { useEffect, useMemo,useState } from 'react'
import TableContainer from 'common/TableContainer'
import { useSelector,useDispatch } from 'react-redux'
import _ from 'lodash'
import { retriveLocationList,updateEndpointsData,updatepublishedTempData,setHierarchyData,updateHierarchyData } from 'toolkitStore/Auditvista/ManageAuditSlice'

const LocationUserList = (props) => {
    const manageAuditSlice = useSelector(state => state.manageAuditSlice)
    const dispatch = useDispatch()
    const [selectedUsers,setSelectedUsers] = useState([])


    useEffect(()=>{
        console.log("LocationUserList",selectedUsers,manageAuditSlice)
        const selectedUserInfo = _.cloneDeep(manageAuditSlice.hierarchyData.usr_selected)
        const data = manageAuditSlice.hierarchyData.usr_selected.filter(item =>
          manageAuditSlice.userList.some(ele => ele.user_id === item.user_id)
        );
        
        console.log(data, 'data');
        setSelectedUsers(data);
    },[])

  const handleSelectUser = (item, event, mode) => {
    console.log(event.target.checked, 'event.target.checked', item)
    var selectedUsersInfo = _.cloneDeep(selectedUsers)
    if (mode === "1") {
      if (event.target.checked) {
        selectedUsersInfo.push(item)
        console.log(item, 'item', selectedUsersInfo);
        setSelectedUsers(selectedUsersInfo)
      }
      else {
        var filteredUsers = selectedUsersInfo.filter((ele) => {
          if (ele.user_id !== item.user_id) {
            return ele
          }
        })
        console.log(filteredUsers, 'filteredUsers')
        setSelectedUsers(filteredUsers)
      }
    }
    else {
      if(event.target.checked){
        setSelectedUsers(_.cloneDeep(manageAuditSlice.userList))
      }
      else{
        setSelectedUsers([])
      }
    }
  }


    const columns = useMemo(()=>[
      {
        id: 'selection',
        Header: (cellProps) => {
          const allSelected = selectedUsers.length === manageAuditSlice.userList.length;
          return (
            <input type="checkbox"
              onChange={(e) => {
                if(e.target.checked){
                  setSelectedUsers(_.cloneDeep(manageAuditSlice.userList))
                }
                else{
                  setSelectedUsers([])
                }

              }}
              defaultChecked={allSelected}

            />
          )
        },
        Cell: (cellProps) => {
          const user = cellProps.row.original
          return (
            <input type="checkbox"
              onChange={(e) => {
                handleSelectUser(user,e,"1")
              }}
              defaultChecked={_.filter(selectedUsers, { user_id: user.user_id }).length > 0 ? true : false}
            />
          )
        }
          },
       
        {
            accessor: 'name',
            Header: 'Name',
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                        <div className="font-size-12" style={{ display: 'flex',
                             flexDirection: 'column'}}>
                            {item.name}
                        </div>
                    </>
                )
            }
        },
        {
            accessor: 'email_id',
            Header: 'Email',
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <span className="font-size-11" >
                        {item.email_id}
                    </span>
                )
            }
        },
        {
            accessor: 'phone_num',
            Header: 'Mob Num',
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <span className="font-size-11" >
                        {item.phone_num === "" ? "-" : item.phone_num}
                    </span>
                )
            }
        },
        {
            accessor: 'audit_type',
            Header: 'Role',
            Cell: ({ row }) => {
              const { audit_type } = row.original;
          
              let label = '-';
              let colorClass = 'bg-secondary text-white';
          
              if (audit_type === "1") {
                label = 'Auditor';
                colorClass = 'bg-primary text-white';
              } else if (audit_type === "2") {
                label = 'Reviewer';
                colorClass = 'bg-warning text-dark';
              } else if (audit_type === "3") {
                label = 'Auditee';
                colorClass = 'bg-success text-white';
              }
          
              return (
                <span
                  className={`badge ${colorClass} font-size-11`}
                  style={{ padding: '4px 8px', borderRadius: '12px' }}
                >
                  {label}
                </span>
              );
            }
          }


    ],[selectedUsers])

    const retriveLocationInfo=async()=>{
      const selectedUsersInfo = _.cloneDeep(selectedUsers)
      const hierarchyDataInfo = _.cloneDeep(manageAuditSlice.hierarchyData)
      const publishTemplateInfo = _.cloneDeep(manageAuditSlice.publishTemplate)

      console.log(selectedUsersInfo,'selectedUsersInfo')
      var user_ids = _.map(selectedUsersInfo,'user_id')
    
      var adtIdx = _.findIndex(selectedUsersInfo,{audit_type :"1"})
      var incIdx = _.findIndex(selectedUsersInfo,{audit_type :"3"})
      var reviewIdx = _.findIndex(selectedUsersInfo,{audit_type :"2"})
      if(reviewIdx !==-1){
        publishTemplateInfo["settings"]["enable_review"]=true
      }
      else{
        publishTemplateInfo["settings"]["enable_review"]=false

      }

      var statusInfo ={
        review: reviewIdx !==-1 ? true : false,
        audit: adtIdx !==-1 ? true : false,
        auditee: incIdx !==-1 ? true : false,
      }
      hierarchyDataInfo["usr_selected"]=selectedUsersInfo
      console.log(user_ids,selectedUsersInfo,'user_ids',reviewIdx,adtIdx,incIdx,hierarchyDataInfo)
      var epsIds = await retriveLocationList(hierarchyDataInfo.hlvl_master_id,user_ids)
      hierarchyDataInfo["ep_selected"]=epsIds
      console.log(epsIds,'epsIds')
      await updateEndpoints(epsIds,"3",publishTemplateInfo.settings.enable_review,publishTemplateInfo,hierarchyDataInfo,statusInfo)
      // hierarchyDataInfo["endpoints"]=epsIds
      if(epsIds.length === 0){
        hierarchyDataInfo["endpoints"]=epsIds
      }
      // const responseData = await dispatch(updateHierarchyData(hierarchyDataInfo))
      // if (responseData.status === 200) {
      //   dispatch(setHierarchyData(responseData.data.hData[0]))
      // }

    }


      const updateEndpoints = async (endpointsId,mode,reviewEnable,publishTemplateInfo,hierarchyDataInfo,statusInfo) => {
        try {
          publishTemplateInfo["usr_selected"]=_.map(hierarchyDataInfo["usr_selected"],"user_id")
          const responseData = await dispatch(updateEndpointsData(endpointsId,mode,reviewEnable,publishTemplateInfo,statusInfo))
          console.log(responseData, 'responseData');
          if (responseData.status === 200) {
            if (responseData.data.validEps) {
              publishTemplateInfo["cc_level"] =endpointsId.length == 0 ? 0 :2
              const updatedInfo = await dispatch(updatepublishedTempData(publishTemplateInfo))
            }
            else{
              publishTemplateInfo["cc_level"] =responseData.data.hData[0]["endpoints"].length > 0 ? 1 :0
              const updatedInfo = await dispatch(updatepublishedTempData(publishTemplateInfo))
              // if(responseDataInfo.data.hData[0]["endpoints"])
            }
            console.log(publishTemplateInfo,'publishTemplateInfo ');
            responseData.data.hData[0]["usr_selected"]=hierarchyDataInfo["usr_selected"]
            responseData.data.hData[0]["ep_selected"]=hierarchyDataInfo["ep_selected"]
            const responseDataInfo = await dispatch(updateHierarchyData(responseData.data.hData[0]))
            if (responseDataInfo.status === 200) {
              dispatch(setHierarchyData(responseDataInfo.data.hData[0]))
            }
            props.onDrawerClose()
            // dispatch(setHierarchyData(responseData.data.hData[0]))
           
          }
    
        } catch (error) {
          console.log(error,'error');
          ////console.log(error, 'error')
        }
    
    
      }
    




  return (
    <>
        <div>
              <TableContainer
                  columns={columns}
                  data={manageAuditSlice.userList}
                  isGlobalFilter={true}
                  customPageSize={10}
                  tableClass="align-middle table-nowrap table-check"
                  theadClass="table-light"
                  pagination="pagination justify-content-end pagination-rounded"
                  isPagination={true}
              />


        </div>
        <footer>
            <button className='btn btn-sm btn-success me-2' 
            onClick={()=>{
              // console.log(selectedUsers,'selectedUsers');
              retriveLocationInfo()
            }}>
                Submit
            </button>
        </footer>
    
    </>
  )
}
export default LocationUserList
