import React, { useEffect, useMemo, useState } from 'react'
import TableContainer from 'common/TableContainer';
import { useSelector, useDispatch } from 'react-redux';
import { updateHierarchyData,setHierarchyData, updatepublishedTempData } from 'toolkitStore/Auditvista/ManageAuditSlice';
import _ from 'lodash';
import Swal from 'sweetalert2';

const LocationSelectedUsers = (props) => {
  const manageAuditSlice = useSelector(state => state.manageAuditSlice)
  const hierarchyData = manageAuditSlice.hierarchyData
  const dispatch = useDispatch()
  const [selectedUser,setSelectedUser] = useState( manageAuditSlice.hierarchyData.usr_selected)


  useEffect(() => {
    console.log("object");
  }, [])


  // const handleSelectUser = (item, event, index,name) => {
  //   var selectedUsersInfo = _.cloneDeep(selectedUser)
  //   console.log(selectedUsersInfo,'selectedUsersInfo',event.target.checked);
  //   if (event.target.checked) {
  //     item[name]=true
  //     selectedUsersInfo.push(item)
  //     console.log(selectedUsersInfo,'selectedUsersInfo');
  //     setSelectedUser(selectedUsersInfo)
  //   }
  //   else {
  //     var filteredUsers = selectedUsersInfo.filter((ele) => {
  //       if (ele.user_id !== item.user_id) {
  //         return ele
  //       }
  //     })
  //     console.log(filteredUsers, 'filteredUsers')
  //     setSelectedUser(filteredUsers)
  //   }

  // }




  const handleSelectUser = (item, event, index,name) => {
    var selectedUsersInfo = _.cloneDeep(selectedUser)
    console.log(selectedUsersInfo,'selectedUsersInfo',event.target.checked);
    var findIdx =_.findIndex(selectedUsersInfo,{user_id : item.user_id})
    if(findIdx !== -1){
      selectedUsersInfo[findIdx][name] = event.target.checked
    }
    setSelectedUser(selectedUsersInfo)


    // if (event.target.checked) {
    //   item[name]=true
    //   selectedUsersInfo.push(item)
    //   console.log(selectedUsersInfo,'selectedUsersInfo');
    //   setSelectedUser(selectedUsersInfo)
    // }
    // else {
    //   var filteredUsers = selectedUsersInfo.filter((ele) => {
    //     if (ele.user_id !== item.user_id) {
    //       return ele
    //     }
    //   })
    //   console.log(filteredUsers, 'filteredUsers')
    //   setSelectedUser(filteredUsers)
    // }

  }


  const applyPermission = (publishTemplateInfo,permissionKey) => {
    const filteredUsers = _.filter(selectedUser, { [permissionKey]: true });
    const auditTypeIds = _.map(filteredUsers, 'audit_type');

    publishTemplateInfo.adt_permissons.forEach((ele) => {
      ele[permissionKey] = auditTypeIds.includes(ele.func_id);
    });
    return publishTemplateInfo
  };

  const updateLocationUsers = async () => {
    console.log(selectedUser, 'selecte')
    const hierarchyDataInfo = _.cloneDeep(manageAuditSlice.hierarchyData)
    const publishTemplateInfo = _.cloneDeep(manageAuditSlice.publishTemplate)
    var updatedInfo = applyPermission(publishTemplateInfo,'create_acplan');
    updatedInfo = applyPermission(updatedInfo,'modify_acplan');
    updatedInfo = applyPermission(updatedInfo,'allow_set_target_date');
    updatedInfo = applyPermission(updatedInfo,'allow_assgn_task_users');
    console.log(updatedInfo,'updatedInfo');



    // var checkAcpln = _.filter(selectedUser,{create_acplan : true})
    // var modifyAcpln = _.filter(selectedUser,{modify_acplan : true})
  
    // if (checkAcpln.length > 0) {
    //   var auditTypeIds = _.map(checkAcpln,"audit_type")
    //   publishTemplateInfo.adt_permissons.map((ele, pos) => {
    //     if (auditTypeIds.includes(ele.func_id)) {
    //       ele["create_acplan"] = true
    //     }
    //   })
    // }
    // else{
    //     publishTemplateInfo.adt_permissons.map((ele, pos) => {
    //       ele["create_acplan"] = false
    //   })
    // }
    hierarchyDataInfo["usr_selected"] = selectedUser

    console.log(selectedUser, 'selectedUsersInfo', hierarchyDataInfo,publishTemplateInfo);
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Do you want to submit this ?',
      showCancelButton: true,
      confirmButtonColor: '#2ba92b',
      confirmButtonText: 'Yes',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(setHierarchyData(hierarchyDataInfo))
        await dispatch(updateHierarchyData(hierarchyDataInfo))
        await dispatch(updatepublishedTempData(updatedInfo))
        props.onDrawerClose()
      }
    })
  }


  const columns = useMemo(() => [
    {
      accessor: 'name',
      Header: 'Name',
      Cell: (cellProps) => {
        var item = cellProps.row.original
        return (
          <>
            <div className="font-size-12" style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
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
    },
     {
      id: 'selection',
      // Header: 'Create Action Plan',
      Header: () => (
        <>
          Create<br />Action Plan
        </>
      ),
      Cell: (cellProps) => {
        const user = _.cloneDeep(cellProps.row.original)
        const index = cellProps.row.index
        return (
          <div className="form-check form-switch form-switch-sm mb-2">
          <input type="checkbox"
            onChange={(e) => {
              handleSelectUser(user, e, index,"create_acplan")
            }}
               className="form-check-input"
            defaultChecked={user?.create_acplan}
          />
          </div>
        )
      }
    },
    {
      id: 'modify_acplan',
      // Header: 'Modify Action Plan',
      Header: () => (
        <>
          Modify<br />Action Plan
        </>
      ),
      Cell: (cellProps) => {
        const user = _.cloneDeep(cellProps.row.original)
        const index = cellProps.row.index
        return (
          <div className="form-check form-switch form-switch-sm mb-2">
          <input type="checkbox"
            onChange={(e) => {
              handleSelectUser(user, e, index,"modify_acplan")
            }}
               className="form-check-input"
            defaultChecked={user?.modify_acplan}
          />
          </div>
        )
      }
    },
    {
      id: 'allow_set_target_date',
      // Header: 'Allow Set Target Date',
      Header: () => (
        <>
          Allow<br />Set Target Date
        </>
      ),
      Cell: (cellProps) => {
        const user = _.cloneDeep(cellProps.row.original)
        const index = cellProps.row.index
        return (
          <div className="form-check form-switch form-switch-sm mb-2">
          <input type="checkbox"
            onChange={(e) => {
              handleSelectUser(user, e, index,'allow_set_target_date')
            }}
               className="form-check-input"
            defaultChecked={user?.allow_set_target_date}
          />
          </div>
        )
      }
    },
    {
      id: 'allow_assgn_task_users',
      // Header: 'Allow Assign Task Users',
      Header: () => (
        <>
          Allow<br />Assign Task Users
        </>
      ),
      Cell: (cellProps) => {
        const user = _.cloneDeep(cellProps.row.original)
        const index = cellProps.row.index
        return (
          <div className="form-check form-switch form-switch-sm mb-2">
          <input type="checkbox"
            onChange={(e) => {
              handleSelectUser(user, e, index,"allow_assgn_task_users")
            }}
               className="form-check-input"
            defaultChecked={user?.allow_assgn_task_users}
          />
          </div>
        )
      }
    },

  ], [selectedUser])


  return (
    <>
      <div>
        {
          console.log(selectedUser,'selectedUser')
        }
        <TableContainer
          columns={columns}
          data={selectedUser}
          isGlobalFilter={true}
          customPageSize={10}
          tableClass="align-middle table-nowrap table-check"
          theadClass="table-light"
          pagination="pagination justify-content-end pagination-rounded"
          isPagination={true}

        />
        {
          console.log(selectedUser,'selectedUser')
        }
      </div>
      <footer>
        <button className='btn btn-sm btn-success me-2'
          onClick={() => {
            // console.log(selectedUsers,'selectedUsers');
            updateLocationUsers()
          }}>
          Submit
        </button>
      </footer>

    </>
  )
}
export default LocationSelectedUsers
