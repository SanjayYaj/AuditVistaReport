import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  Row, Col, Button, Card, CardBody, Container, Label, 
  Input, Modal, ModalHeader, ModalBody, ModalFooter,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation"
import moment from 'moment'
import { Multiselect } from 'multiselect-react-dropdown';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { updateAuditEpsApi } from 'toolkitStore/Auditvista/ManageAuditSlice';
import {
  setDepartmentExist,
  setDesignationExist,
  IRTvalidateDupName,
  createDeptInfo,
  createDesignation,
  retriveDesignationInfo,
  retriveDeptInfo
} from 'toolkitStore/Auditvista/orgSlice';
import { checkUserAvailableApi } from 'toolkitStore/Auditvista/aplnfollowup/aplnflwupslice'; 
import { createUserInfo,retriveUserList,retriveRoleData } from 'toolkitStore/Auditvista/userSlice';
import Swal from 'sweetalert2';
import urlSocket from 'helpers/urlSocket';

const EditEndpoints = (props) => {
  const [formattedDate, setFormattedDate] = useState(null)
  const [epData, setepData] = useState(_.cloneDeep(props.epdata))
  const multiRef = useRef()
  const inputRef = useRef()
  const deptMultiRef = useRef()

  const [resetMultiSelect, setresetMultiSelect] = useState(true)
  const [dataExtended, setdataExtended] = useState(false)

  // Create User functionality states
  const [showCreateUserInput, setShowCreateUserInput] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPhone, setNewUserPhone] = useState('')
  const [countryCode, setCountryCode] = useState("+91")
  const [isPhone, setIsPhone] = useState(false)
  const [userInputValue, setUserInputValue] = useState('')
  const [errors, setErrors] = useState({})
  const [acplanRoleInfo, setAcplanRoleInfo] = useState([])
  
  // User existence check states (similar to CreateNewUser)
  const [exist, setexist] = useState(null)
  const [assignUser, setassignUser] = useState(false)
  const [enableRole, setenableRole] = useState(false)
  const [loading, setloading] = useState(false)

  // Department and Roles states
  const [deptOptions, setDeptOptions] = useState([])
  const [selectedDeptId, setSelectedDeptId] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])
  const [selectedDesignation, setSelectedDesignation] = useState([])

  // Department creation modal states
  const [showDeptModal, setShowDeptModal] = useState(false)
  const [newDeptName, setNewDeptName] = useState("")
  const [newDeptCode, setNewDeptCode] = useState("")

  // Designation creation modal states
  const [showDesignationModal, setShowDesignationModal] = useState(false)
  const [newDesignation, setNewDesignation] = useState("")

  const [clientInfo, setClientInfo] = useState(JSON.parse(sessionStorage.getItem("client_info") || '{}'))
  const [resetDeptMultiSelect, setResetDeptMultiSelect] = useState(true)
  const [enabelIncdType, setEnableIncdType] = useState(false)
  const[roleLists,setRoleList] = useState([]);

  const dispatch = useDispatch()
  const IR_OrgSlice = useSelector(state => state?.orgSlice);
  console.log('IR_OrgSlice', IR_OrgSlice)
  const IR_UserSlice = useSelector(state => state?.userSlice);
  console.log('IR_UserSlice', IR_UserSlice)
  const followUpSlice = useSelector(state => state.acplnFollowUpSliceReducer) // Add this for user check
  console.log('followUpSlice', followUpSlice)
  const authUser = JSON.parse(sessionStorage.getItem("authUser") || '{}')
  console.log('authUser78', authUser,props)


  useEffect(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split("T")[0];
  setFormattedDate(tomorrowFormatted)

  // Initialize department and designation data
  const initializeDeptAndDesignation = async () => {
    try {
      await dispatch(retriveRoleData());
      // await dispatch(retriveUserList());
      await dispatch(retriveDeptInfo());
      await dispatch(retriveDesignationInfo());
    } catch (error) {
      console.error('Error initializing department and designation data:', error);
    }
  };

  initializeDeptAndDesignation();
}, [dispatch])

// Add a separate useEffect to handle role list updates
useEffect(() => {
  if (IR_UserSlice?.roleList && Array.isArray(IR_UserSlice.roleList)) {
    setRoleList(IR_UserSlice.roleList);
    console.log('IR_UserSlice?.roleList', IR_UserSlice.roleList);
  }
}, [IR_UserSlice?.roleList])
  // useEffect(() => {
  //   const tomorrow = new Date();
  //   tomorrow.setDate(tomorrow.getDate() + 1);
  //   const tomorrowFormatted = tomorrow.toISOString().split("T")[0];
  //   setFormattedDate(tomorrowFormatted)

  

  //   // Initialize department and designation data
  //   const initializeDeptAndDesignation = async () => {
  //     try {

  //       await dispatch(retriveRoleData());
  //       // await dispatch(retriveUserList());
  //       await dispatch(retriveDeptInfo());
  //       await dispatch(retriveDesignationInfo());
  //     } catch (error) {
  //       console.error('Error initializing department and designation data:', error);
  //     }
  //   };


  //   if(IR_UserSlice?.roleList){
  //     setRoleList(IR_UserSlice?.roleList)
  //     console.log('IR_UserSlice?.roleList', IR_UserSlice?.roleList)
  //   }

  //   initializeDeptAndDesignation();
  // }, [])

  // Initialize department options with "Add New" option
  useEffect(() => {
    if (IR_OrgSlice?.departMentData) {
      setDeptOptions([
        // { dept_name: "+ Add New Department", dept_code: "new", _id: "new_dept" },
        ...IR_OrgSlice.departMentData.map((dept) => ({
          dept_name: dept.dept_name,
          dept_code: dept.dept_code,
          _id: dept._id,
        })),
      ]);
    }
  }, [IR_OrgSlice?.departMentData]);

  // Auto-select department if only one option available
  useEffect(() => {
    if (deptOptions.length === 2) { // Only "Add New" + one real option
      setSelectedDeptId([deptOptions[1]])
    } else {
      setSelectedDeptId([])
    }
  }, [deptOptions]);

  // ===== USER EXISTENCE CHECK METHODS (from CreateNewUser) =====
  
  const checkUserExist = async (mode, value) => {
    var admn_info = {}
    
    if (mode == 1) {
      admn_info["email_id"] = value["email_id"]
    }
    if (mode === 2) {
      admn_info["phone_number"] = value["phone_number"]
    }

    admn_info["encrypted_db_url"] = authUser.db_info.encrypted_db_url
    admn_info["db_name"] = authUser.db_info.db_name
    admn_info["user_id"] = authUser.user_data._id
    
    var responseInfo = await dispatch(checkUserAvailableApi(admn_info, mode))
    
    if (responseInfo.length > 0) {
      // Check if user is already in current audit
      let existUserInfo = _.filter(epData.audit_pbd_users, { user_id: responseInfo[0]["_id"] })
      console.log('existUserInfo', existUserInfo)
      
      if (existUserInfo.length > 0) {
        if (existUserInfo[0]['user_status'] === "0" || existUserInfo[0]['user_code'] === null) {
          setloading(false)
          setErrors({
            info: "This user already exists in this audit Location.",
          })
          setTimeout(() => {
            setErrors({})
          }, 2500);
        }
        if (existUserInfo[0]['user_status'] === "1" || existUserInfo[0]['user_status'] === "2") {
          setloading(false)
          setassignUser(true)
        }
      } else {
        setloading(false)
        setassignUser(true)
        setenableRole(true)
      }
    } else {
      setloading(false)
      setexist(false)
    }
  }

  const taskUserAddInfo = () => {
    const userId = followUpSlice.existUser ? followUpSlice.existUser._id : followUpSlice.userInfo[0]["_id"];
    const userData = followUpSlice.existUser ? followUpSlice.existUser : followUpSlice.userInfo[0];
    console.log('userData', userData)
    
    const newUser = {
      audit_type: "1",
      designation: selectedDesignation.length > 0 ? selectedDesignation[0].desgn_name : null,
      email_id: userData.email_id,
      name: userData.fullname || userData.firstname,
      phone_num: userData.phone_number,
      user_code: userData.user_code,
      user_id: userId,
      dept_id: selectedDeptId,
      role_info: selectedRoles,
      user_status: "0"
    };
    console.log('newUser', newUser)

    // Update local state
    const updatedEpData = { ...epData }
    updatedEpData.audit_pbd_users.push(newUser)

    // Also add to location_unique_users so it appears in the dropdown
    updatedEpData.location_unique_users.push({
      name: userData.firstname || userData.name,
      user_id: userId,
      email_id: userData.email_id,
      phone_num: userData.phone_number,
      user_code: userData.user_code
    })

    setepData(updatedEpData)

    // Reset form
    resetCreateUserForm()
    
    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: `User "${userData.fullname || userData.name}" has been assigned to the audit.`,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      timer: 3000
    })
  }

  const ExistUserAddInfo = (userIdx) => {
    // Handle existing user reactivation
    const existingUser = epData.audit_pbd_users[userIdx];
    existingUser.user_status = "0"; // Reactivate user
    
    setepData({ ...epData })
    resetCreateUserForm()
    
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'User has been reactivated in the audit.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      timer: 3000
    })
  }

  const resetCreateUserForm = () => {
    setNewUserName('')
    setNewUserEmail('')
    setNewUserPhone('')
    setUserInputValue('')
    setShowCreateUserInput(false)
    setIsCreatingUser(false)
    setIsPhone(false)
    setErrors({})
    setSelectedDeptId([])
    setSelectedRoles([])
    setSelectedDesignation([])
    setexist(null)
    setassignUser(false)
    setenableRole(false)
    setloading(false)
    setCountryCode("+91")

    // Force multiselect to re-render
    setresetMultiSelect(false)
    setTimeout(() => {
      setresetMultiSelect(true)
    }, 100)
  }

  // ===== FORM SUBMISSION HANDLER =====
  
  const Validsubmit = async (events, values) => {
    if (exist === null) {
      if (isPhone) {
        if (String(countryCode).length === 0) {
          setloading(false)
          setErrors({
            phone_number: "Please select country code.",
          })
          return
        } else {
          setloading(true)
          checkUserExist(2, values);
        }
      } else {
        setloading(true)
        checkUserExist(1, values);
      }
    } else {
      if (!selectedRoles || selectedRoles.length === 0) {
        setErrors({ role: 'Please select at least one role' })
      } else {
        setloading(true)
        if (!assignUser) {
          // Create new user
          values["userPoolId"] = clientInfo[0]?.userPoolId || clientInfo.userPoolId
          values["clientId"] = clientInfo[0]?.clientId || clientInfo.clientId
          values["fullNo"] = isPhone ? countryCode + values.phone_number : undefined
          
          await handleCreateUser()
        } else {
          // Assign existing user
          await taskUserAddInfo()
        }
      }
    }
  };

  // ===== EXISTING METHODS (keeping your original functionality) =====

  const changeAuditUserHandler = (selectedList, selectedItem, mode = "1", action = "add") => {
    var findIdx
    if (mode !== "3") {
      findIdx = _.findIndex(epData.audit_pbd_users, (user) =>
        user.user_id === selectedItem.user_id && user.audit_type !== "3"
      );
    } else {
      findIdx = _.findIndex(epData.audit_pbd_users, (user) =>
        user.user_id === selectedItem.user_id
      );
    }

    if (action === "add") {
      if (findIdx === -1) {
        epData.audit_pbd_users.push({
          audit_type: mode,
          designation: null,
          email_id: selectedItem.email_id,
          name: selectedItem.name,
          phone_num: selectedItem.phone_num,
          user_code: selectedItem.user_code,
          user_id: selectedItem.user_id
        })
      } else {
        if (epData.audit_pbd_users[findIdx]["audit_type"] !== mode && mode !== "3") {
          setresetMultiSelect(false)
          selectedList = selectedList.filter((ele) => {
            if (ele.user_id !== selectedItem.user_id) {
              return ele
            }
          })
          multiRef.current.state.selectedValues = selectedList
          Swal.fire({
            icon: 'warning',
            title: 'Warning!',
            text: 'This user is already selected to another task in this location. Try different user.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              setTimeout(() => {
                setresetMultiSelect(true)
              }, 200);
            }
          })
        }
      }
    } else if (action === "remove") {
      if (findIdx !== -1) {
        epData.audit_pbd_users.splice(findIdx, 1)
      }
    }

    setepData({ ...epData })
  }

  // Handle department selection
  const handleDeptSelect = useCallback((selectedList, selectedItem) => {
    if (selectedItem._id === "new_dept") {
      setResetDeptMultiSelect(false)
      var filteredList = selectedList.filter((ele) => {
        if (ele._id !== "new_dept") {
          return ele
        }
      })
      deptMultiRef.current.state.selectedValues = filteredList
      setTimeout(() => {
        setResetDeptMultiSelect(true)
      }, 200);
      setShowDeptModal(true);
    } else {
      setSelectedDeptId(selectedList)
    }
  }, [selectedDeptId]);

  const handleDeptRemove = (selectedList) => {
    setSelectedDeptId(selectedList)
  }

  const handleAddRole = (selectedList) => {
    setSelectedRoles(selectedList);
    const hasIncidentManage = selectedList.some(role =>
      role.facilities && role.facilities.some(facility => facility.id === 11)
    );
    setEnableIncdType(hasIncidentManage);
  };

  const handleRemoveRole = (selectedList, removedItem) => {
    const updatedRoles = selectedList.filter(role => role._id !== removedItem._id);
    setSelectedRoles(updatedRoles);
    const hasIncidentManage = updatedRoles.some(role =>
      role.facilities && role.facilities.some(facility => facility.id === 11)
    );
    setEnableIncdType(hasIncidentManage);
  };

  const toggleDeptModal = (open) => {
    if (open === 'showDeptModal') {
      dispatch(setDepartmentExist(false));
      setNewDeptName('')
      setNewDeptCode('')
    }
    setShowDeptModal(!showDeptModal)
  };

  const handleCreateUser = async () => {
    setErrors({})

    // Validation
    if (newUserName.trim() === '') {
      setErrors({ name: 'Please enter a user name' })
      return
    }

    if (isPhone) {
      if (!countryCode || countryCode === '') {
        setErrors({ countryCode: 'Please select country code' })
        return
      }
      if (!newUserPhone.trim()) {
        setErrors({ phone: 'Please enter phone number' })
        return
      }
      if (newUserPhone.length < 10) {
        setErrors({ phone: 'Phone number should be at least 10 digits' })
        return
      }
    } else {
      if (!newUserEmail.trim()) {
        setErrors({ email: 'Please enter email address' })
        return
      }
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(newUserEmail)) {
        setErrors({ email: 'Please enter a valid email address' })
        return
      }
    }

    if (selectedDeptId.length === 0) {
      setErrors({ dept: 'Please select a department' })
      return
    }

    if (selectedRoles.length === 0) {
      setErrors({ role: 'Please select at least one role' })
      return
    }

    setIsCreatingUser(true)

    try {
      const updatedValues = {
        fullname: newUserName.trim(),
        email_id: newUserEmail.trim(),
        username: newUserEmail.trim(),
        countrycode: isPhone ? countryCode : "",
        phone_number: isPhone ? newUserPhone.trim() : "",
        dept_id: selectedDeptId.map(dept => ({ 
          _id: dept._id, 
          dept_name: dept.dept_name 
        })),
        designation: selectedDesignation.length > 0 
          ? selectedDesignation.map(design => ({ 
              _id: design._id, 
              desgn_name: design.desgn_name 
            }))
          : [],
        role_info: selectedRoles.map(role => ({ 
          _id: role._id, 
          role_name: role.role_name 
        })),
        branch_id: [],
        created_by: authUser.user_data._id,
        clientId: clientInfo[0]?.clientId || clientInfo.clientId,
        userPoolId: clientInfo[0]?.userPoolId || clientInfo.userPoolId,
        company_id: clientInfo[0]?.company_id || clientInfo.company_id,
      }

      const responseData = await urlSocket.post("cog/cruduser", {
        encrypted_db_url: authUser.db_info.encrypted_db_url,
        user_info: updatedValues
      })

      if (responseData.status === 200) {
        const createdUser = responseData.data.admn_user[0];

        const newUser = {
          audit_type: "1",
          designation: selectedDesignation.length > 0 ? selectedDesignation[0].desgn_name : null,
          email_id: createdUser.email_id,
          name: createdUser.fullname,
          phone_num: createdUser.phone_number ? createdUser.countrycode + createdUser.phone_number : '',
          user_code: createdUser.user_code || null,
          user_id: createdUser._id,
          dept_id: createdUser.dept_id,
          role_info: createdUser.role_info,
        }

        const updatedEpData = { ...epData }
        updatedEpData.audit_pbd_users.push(newUser)
        updatedEpData.location_unique_users.push({
          name: createdUser.fullname,
          user_id: createdUser._id,
          email_id: createdUser.email_id,
          phone_num: createdUser.phone_number ? createdUser.countrycode + createdUser.phone_number : '',
          user_code: createdUser.user_code || null
        })

        setepData(updatedEpData)
        resetCreateUserForm()

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `User "${createdUser.fullname}" has been created successfully and added to the audit.`,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
          timer: 3000
        })
      } else {
        throw new Error(responseData.data?.message || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || error.response?.data?.message || 'Failed to create user. Please try again.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      })
      setIsCreatingUser(false)
    }
  }

  const handleCancelCreateUser = () => {
    resetCreateUserForm()
  }

  const handleUserInputChange = (e) => {
    const value = e.target.value
    setUserInputValue(value)

    const isNumeric = /^\d+$/.test(value)
    setIsPhone(isNumeric)

    if (isNumeric) {
      setNewUserPhone(value)
      setNewUserEmail('')
    } else {
      setNewUserEmail(value)
      setNewUserPhone('')
    }

    setErrors({})
  }

  const handleCreateUserButtonClick = () => {
    setShowCreateUserInput(true)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }

  const handleClick = (e) => {
    const updateInfo = _.cloneDeep(epData)
    updateInfo["audit_config"][e.target.name] = !e.target.checked
    setepData(updateInfo)
  }

  const extendLocationDate = (event) => {
    const updatedEpData = { ...epData }
    updatedEpData["audit_pbd_ends_on"] = event.target.value
    setdataExtended(true)
    setepData(updatedEpData)
  }

  const updateEndpoint = async () => {
    const updateInfo = _.cloneDeep(epData)
    updateInfo["dataExtended"] = dataExtended
    const responseData = await dispatch(updateAuditEpsApi(updateInfo, props.audit_data))
    if (responseData.status === 200) {
      props.onClose()
    }
  }

  const getAuditAssignedOptions = () => {
    return epData.location_unique_users.map((data) => ({
      name: `${data.name}`,
      user_id: data.user_id,
      audit_type: "1",
      email_id: data.email_id,
      phone_num: data.phone_num,
      user_code: data.user_code || null,
    }))
  }

  return (
    <div>
      <h5 className="text-primary">{epData?.loc_name}  {epData.code !== "" && epData.code !== null ? "- " + epData.code : null}</h5>
      <Row className="justify-content-center">
        <Col md={12}>
          <AvForm className="form-horizontal" onValidSubmit={Validsubmit}>
            <div className="mb-3">
              <AvField
                name="target_date"
                type="date"
                label="Audit end date"
                errorMessage="Please provide a valid date."
                className="form-control"
                value={
                  new Date(epData.audit_pbd_ends_on).toISOString().split('T')[0]
                }
                onChange={(e) => {
                  extendLocationDate(e)
                }}
                onKeyDown={(e) => { e.preventDefault(); }}
                min={formattedDate}
                validate={{ required: { value: true } }}
                id="td"
              />
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label>Audit assigned to</label>
                <Button
                  color="primary"
                  size="sm"
                  onClick={handleCreateUserButtonClick}
                  disabled={isCreatingUser}
                >
                  <i className="bx bx-plus me-1"></i>
                  Create User
                </Button>
              </div>
              
              {resetMultiSelect &&
                <Multiselect
                  ref={multiRef}
                  options={getAuditAssignedOptions()}
                  selectedValues={_.filter(epData.audit_pbd_users, { audit_type: "1" }).length > 0 ? _.filter(epData.audit_pbd_users, { audit_type: "1" }) : []}
                  onSelect={(selectedList, selectedItem) => {
                    console.log('selectedList, selectedItem', selectedList, selectedItem)
                    changeAuditUserHandler(selectedList, selectedItem, "1", 'add')
                  }}
                  onRemove={(selectedList, removedItem) => {
                    changeAuditUserHandler(selectedList, removedItem, "1", 'remove')
                  }}
                  displayValue="name"
                  placeholder="Choose..."
                  style={{
                    option: {
                      color: '#000'
                    },
                    optionContainer: {
                      border: '1px solid #ccc'
                    }
                  }}
                />
              }

              {/* Create User Input Box */}
              {showCreateUserInput && (
                <Card className="shadow-sm mt-3" style={{ border: '1px solid lightgrey' }}>
                  <CardBody>
                    {exist !== null && (
                      <div className='text-end'>
                        <button 
                          id="edit" 
                          className="btn btn-sm btn-soft-primary" 
                          style={{ cursor: 'pointer' }} 
                          onClick={() => { setexist(null); setErrors({}) }}
                        >
                          <i className="bx bx-edit-alt" />
                        </button>
                      </div>
                    )}

                    <h6 className="text-primary mb-3">Create New User</h6>

                    {/* Email/Phone Input */}
                    <div className="mb-3">
                      <label>Email / Mobile Number <span className="text-danger">*</span></label>
                      <div className={isPhone ? 'd-flex' : ''}>
                        <Row>
                          {isPhone && (
                            <Col md={4} className="pe-0">
                              <select
                                name="countrycode"
                                onChange={(e) => {
                                  setCountryCode(e.target.value)
                                  setErrors({})
                                }}
                                value={countryCode}
                                className="form-select"
                                disabled={exist !== null || isCreatingUser || assignUser}
                                style={{ borderRight: 'none' }}
                              >
                                <option value="" disabled>Select</option>
                                {
                                  clientInfo[0]?.countries?.map((country, idx) => (
                                    <option key={idx} value={country.code}>
                                      {country.code} {country.label}
                                    </option>
                                  ))
                                }
                              </select>
                              {errors.countryCode && (
                                <div className="invalid-feedback d-block">{errors.countryCode}</div>
                              )}
                            </Col>
                          )}
                          <Col md={isPhone ? 8 : 12} className={isPhone ? "ps-1" : ""}>
                            <AvField
                              name={isPhone ? "phone_number" : 'email_id'}
                              className="form-control"
                              placeholder="Enter Email ID / Mobile Number"
                              type={isPhone ? 'number' : 'text'}
                              onKeyDown={(e) => { e.key === "Enter" ? e.preventDefault() : console.log("") }}
                                                              disabled={exist !== null || isCreatingUser || assignUser}
                              value={userInputValue}
                              onChange={handleUserInputChange}
                              validate={{
                                required: { value: true, errorMessage: "This field is required" },
                                pattern: {
                                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$|^\d+$/,
                                  errorMessage: "Invalid email or Mobile number format",
                                },
                              }}
                              style={isPhone ? { borderLeft: 'none' } : {}}
                            />
                          </Col>
                        </Row>
                      </div>
                      {errors.phone_number && <div className='text-danger' style={{ fontSize: "smaller" }}>{errors.phone_number}</div>}
                      {errors.email_id && <div className='text-danger' style={{ fontSize: "smaller" }}>{errors.email_id}</div>}
                    </div>

                    {/* User Already Exists Section - Now shown inline */}
                    {assignUser && (
                      <div className="mb-4">
                        <div className="alert alert-light border p-3" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6' }}>
                          <div className="mb-2 text-center">
                            <h6 className="text-primary fw-bold mb-3">User Already Exists</h6>
                          </div>

                          <div className="mb-3">
                            <div className="mb-1">
                              <span className='text-muted'>Name:</span> <strong>{followUpSlice.existUser?.fullname}</strong>
                            </div>
                            <div className="mb-1">
                              <span className='text-muted'>Email:</span> <strong>{followUpSlice.existUser?.email_id}</strong>
                            </div>
                            <div className="mb-1">
                              <span className='text-muted'>Phone:</span> <strong>{followUpSlice.existUser?.phone_number || "Not Provided"}</strong>
                            </div>
                          </div>

                          {
                            console.log('followUpSlice.existUser?.role_info.length',  followUpSlice.existUser?.role_info.length)
                          }

                          {enableRole && (
                            <div className="mb-3">
                             { followUpSlice.existUser?.role_info.length === 0 &&
                              <div className="mb-2">
                                <label htmlFor="roleSelect" className="form-label mb-1">Select Role</label>
                                <Multiselect
                                  options={roleLists}
                                  selectedValues={selectedRoles}
                                  onSelect={handleAddRole}
                                  onRemove={handleRemoveRole}
                                  displayValue="role_name"
                                  closeOnSelect={false}
                                  style={{ width: "100%" }}
                                />
                              </div>}

                           {   followUpSlice.existUser?.dept_id.length === 0 &&
                            <div className="mb-2">
                                <label htmlFor="deptSelect" className="form-label mb-1">Department</label>
                                {resetDeptMultiSelect && (
                                  <Multiselect
                                    options={deptOptions}
                                    selectedValues={selectedDeptId}
                                    displayValue="dept_name"
                                    closeOnSelect={false}
                                    ref={deptMultiRef}
                                    onSelect={handleDeptSelect}
                                    onRemove={handleDeptRemove}
                                  />
                                )}
                              </div>}
                            </div>
                          )}

                          <div className="mb-3 text-center">
                            <p className="text-muted mb-2">
                              <strong>Do you want to assign this user to this audit?</strong>
                            </p>
                          </div>

                          <div className="d-flex gap-2 justify-content-center">
                            <button
                              className="btn btn-outline-danger btn-sm"
                              type="button"
                              onClick={() => {
                                setassignUser(false);
                                setenableRole(false);
                                setSelectedRoles([]);
                                setSelectedDeptId([]);
                                setexist(null);
                                setUserInputValue('');
                                setNewUserEmail('');
                                setNewUserPhone('');
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              type="button"
                              onClick={() => {
                                const existUserIdx = _.findIndex(epData.audit_pbd_users, {
                                  user_id: followUpSlice.existUser._id,
                                });
                                console.log('firstfollowUpSlice.existUser._id', followUpSlice.existUser)
                                if (existUserIdx !== -1) {
                                  ExistUserAddInfo(existUserIdx);
                                } else {
                                  if (selectedRoles.length > 0) {
                                    taskUserAddInfo();
                                  } else {
                                    // setErrors({ info: "Please select at least one role!" });
                                    // setTimeout(() => setErrors({}), 2500);
                                     taskUserAddInfo();
                                  }
                                }
                              }}
                            >
                              Assign
                            </button>
                          </div>

                          {errors.info && (
                            <div className="alert alert-danger mt-2 text-center">
                              {errors.info}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {exist ? (
                      <>
                        {/* Role Selection for Existing User */}
                        <div className="mb-3">
                          <label>Role Permission <span className="text-danger">*</span></label>
                          <Multiselect
                            options={roleLists}
                            selectedValues={selectedRoles}
                            onSelect={handleAddRole}
                            onRemove={handleRemoveRole}
                            displayValue="role_name"
                            closeOnSelect={false}
                            style={{ width: "100%" }}
                          />
                          {errors.role && <div className='text-danger' style={{ fontSize: 'smaller' }}>{errors.role}</div>}
                        </div>

                        {/* Department Selection for Existing User */}
                        <div className="mb-3">
                          <label>Department <span className="text-danger">*</span></label>
                          {resetDeptMultiSelect && (
                            <Multiselect
                              options={deptOptions}
                              selectedValues={selectedDeptId}
                              displayValue="dept_name"
                              closeOnSelect={false}
                              ref={deptMultiRef}
                              onSelect={handleDeptSelect}
                              onRemove={handleDeptRemove}
                            />
                          )}
                          {errors.dept && <div className='text-danger' style={{ fontSize: 'smaller' }}>{errors.dept}</div>}
                        </div>
                      </>
                    ) : exist === false ? (
                      <>
                        {/* Full Name Input for New User */}
                        <div className="mb-3">
                          <label>Full Name <span className="text-danger">*</span></label>
                          <AvField
                            name="firstname"
                            errorMessage="Please enter the name"
                            className="form-control"
                            placeholder="Enter Full Name"
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            required
                          />
                          {errors.name && <div className="text-danger mt-1" style={{ fontSize: 'smaller' }}>{errors.name}</div>}
                        </div>

                        {/* Secondary Contact Info for New User */}
                        <div className="mb-3">
                          <label>{isPhone ? "Email Id" : "Mobile Number"} :</label>
                          <div className={!isPhone ? 'd-flex' : ''}>
                            <Row>
                              {!isPhone && (
                                <Col md={4} className="pe-0">
                                  <select
                                    name="optionalCountrycode"
                                    onChange={(e) => setCountryCode(e.target.value)}
                                    value={countryCode}
                                    className="form-select"
                                    disabled={isCreatingUser}
                                  >
                                    <option value="" disabled>Select</option>
                                    {
                                      clientInfo[0]?.countries?.map((country, idx) => (
                                        <option key={idx} value={country.code}>
                                          {country.code} {country.label}
                                        </option>
                                      ))
                                    }
                                  </select>
                                </Col>
                              )}
                              <Col className={!isPhone ? "ps-1" : ""}>
                                <AvField
                                  name={isPhone ? "email_id" : 'phone_number'}
                                  className="form-control"
                                  placeholder={`Enter ${isPhone ? 'Email ID' : 'Mobile Number'}`}
                                  type={isPhone ? 'text' : 'number'}
                                  value={isPhone ? newUserEmail : newUserPhone}
                                  onChange={(e) => {
                                    if (isPhone) {
                                      setNewUserEmail(e.target.value)
                                    } else {
                                      setNewUserPhone(e.target.value)
                                    }
                                  }}
                                  validate={{
                                    pattern: {
                                      value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$|^\d+$/,
                                      errorMessage: "Invalid email or Mobile number format",
                                    },
                                  }}
                                />
                              </Col>
                            </Row>
                          </div>
                        </div>

                        {/* Role Selection for New User */}
                        <div className="mb-3">
                          <label>Role Permission <span className="text-danger">*</span></label>
                          <Multiselect
                            options={roleLists}
                            selectedValues={selectedRoles}
                            onSelect={handleAddRole}
                            onRemove={handleRemoveRole}
                            displayValue="role_name"
                            closeOnSelect={false}
                            style={{ width: "100%" }}
                          />
                          {errors.role && <div className='text-danger' style={{ fontSize: 'smaller' }}>{errors.role}</div>}
                        </div>

                        {/* Department Selection for New User */}
                        <div className="mb-3">
                          <label>Department <span className="text-danger">*</span></label>
                          {resetDeptMultiSelect && (
                            <Multiselect
                              options={deptOptions}
                              selectedValues={selectedDeptId}
                              displayValue="dept_name"
                              closeOnSelect={false}
                              ref={deptMultiRef}
                              onSelect={handleDeptSelect}
                              onRemove={handleDeptRemove}
                            />
                          )}
                          {errors.dept && <div className='text-danger' style={{ fontSize: 'smaller' }}>{errors.dept}</div>}
                        </div>

                    
                      </>
                    ) : null}

                    {/* Action Buttons - Only show if not in assignUser mode */}
                    {!assignUser && (
                      <div className="d-flex gap-2 justify-content-end">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={handleCancelCreateUser}
                          disabled={isCreatingUser || loading}
                          type="button"
                        >
                          Cancel
                        </button>
                        <Button
                          disabled={isCreatingUser || loading}
                          className={loading ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
                          type="submit"
                        >
                          {loading || isCreatingUser ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              {exist === null ? 'Checking...' : 'Creating...'}
                            </>
                          ) : (
                            'Submit'
                          )}
                        </Button>
                      </div>
                    )}

                    {errors.info && !assignUser && (
                      <div className="alert alert-secondary text-center my-2" role="alert">
                        {errors.info}
                      </div>
                    )}
                  </CardBody>
                </Card>
              )}
            </div>

            {props.audit_data.settings.enable_review && (
              <div className="mb-3">
                <label>Review assigned to</label>
                {resetMultiSelect &&
                  <Multiselect
                    options={epData.location_unique_users.map((data) => ({
                      name: `${data.name}`,
                      user_id: data.user_id,
                      audit_type: "2",
                      email_id: data.email_id,
                      phone_num: data.phone_num,
                      user_code: data.user_code || null,
                    }))}
                    selectedValues={_.filter(epData.audit_pbd_users, { audit_type: "2" }).length > 0 ? _.filter(epData.audit_pbd_users, { audit_type: "2" }) : []}
                    onSelect={(selectedList, selectedItem) => {
                      changeAuditUserHandler(selectedList, selectedItem, "2", 'add')
                    }}
                    onRemove={(selectedList, removedItem) => {
                      changeAuditUserHandler(selectedList, removedItem, "2", 'remove')
                    }}
                    displayValue="name"
                    placeholder="Choose..."
                    style={{
                      option: {
                        color: '#000'
                      },
                      optionContainer: {
                        border: '1px solid #ccc'
                      }
                    }}
                  />
                }
              </div>
            )}

            <div className="mb-3">
              <label>Incharge assigned to</label>
              {resetMultiSelect &&
                <Multiselect
                  options={epData.location_unique_users.map((data) => ({
                    name: `${data.name}`,
                    user_id: data.user_id,
                    audit_type: "3",
                    email_id: data.email_id,
                    phone_num: data.phone_num,
                    user_code: data.user_code || null,
                  }))}
                  selectedValues={_.filter(epData.audit_pbd_users, { audit_type: "3" }).length > 0 ? _.filter(epData.audit_pbd_users, { audit_type: "3" }) : []}
                  onSelect={(selectedList, selectedItem) => {
                    changeAuditUserHandler(selectedList, selectedItem, "3", 'add')
                  }}
                  onRemove={(selectedList, removedItem) => {
                    changeAuditUserHandler(selectedList, removedItem, "3", 'remove')
                  }}
                  displayValue="name"
                  placeholder="Choose..."
                  style={{
                    option: {
                      color: '#000'
                    },
                    optionContainer: {
                      border: '1px solid #ccc'
                    }
                  }}
                />
              }
            </div>

            <Card className="shadow-sm" style={{ border: '1px solid lightgrey' }}>
              <CardBody>
                <div>
                  <label className="form-label">Display :</label>
                  <div className="list-group-item text-muted d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={epData.audit_config?.audit_score_preview}
                        name="audit_score_preview"
                        onClick={(e) => handleClick(e)}
                      />
                      <span className="ms-2 text-dark">Audit Score</span>
                    </div>
                    {props.audit_data.settings.enable_review && (
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={epData.audit_config?.review_score_preview}
                          name="review_score_preview"
                          onClick={(e) => handleClick(e)}
                        />
                        <span className="ms-2 text-dark">Review Score</span>
                      </div>
                    )}
                  </div>

                  <label className="form-label">Track Location :</label>
                  <div className="list-group-item text-muted d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input ms-2"
                        checked={epData.audit_config?.audit_coords_enable}
                        name="audit_coords_enable"
                        onClick={(e) => handleClick(e)}
                      />
                      <span className="ms-2 text-dark">Auditor</span>
                    </div>
                    {props.audit_data.settings.enable_review && (
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-check-input ms-2"
                          checked={epData.audit_config?.review_coords_enable}
                          name="review_coords_enable"
                          onClick={(e) => handleClick(e)}
                        />
                        <span className="ms-2 text-dark">Reviewer</span>
                      </div>
                    )}
                  </div>

                  <label className="form-label">Enable QR :</label>
                  <div className="list-group-item text-muted d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input ms-2"
                        checked={epData.audit_config?.audit_qr_enable}
                        name="audit_qr_enable"
                        onClick={(e) => handleClick(e)}
                      />
                      <span className="ms-2 text-dark">Auditor</span>
                    </div>
                    {props.audit_data.settings.enable_review && (
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-check-input ms-2"
                          checked={epData.audit_config?.review_qr_enable}
                          name="review_qr_enable"
                          onClick={(e) => handleClick(e)}
                        />
                        <span className="ms-2 text-dark">Reviewer</span>
                      </div>
                    )}
                  </div>

                  <label className="form-label">Remind Auditor through:</label>
                  <div className="list-group-item text-muted d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input ms-2"
                        checked={epData.audit_config?.sms}
                        name="sms"
                        onClick={(e) => handleClick(e)}
                      />
                      <span className="ms-2 text-dark">SMS</span>
                    </div>

                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input ms-2"
                        checked={epData.audit_config?.email}
                        name="email"
                        onClick={(e) => handleClick(e)}
                      />
                      <span className="ms-2 text-dark">EMAIL</span>
                    </div>
                  </div>

                  <label className="form-label">Capture Signature:</label>
                  <div className="list-group-item text-muted d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input ms-2"
                        checked={epData.audit_config?.audit_signature}
                        name="audit_signature"
                        onClick={(e) => handleClick(e)}
                      />
                      <span className="ms-2 text-dark">Auditor</span>
                    </div>

                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input ms-2"
                        checked={epData.audit_config?.review_signature}
                        name="review_signature"
                        onClick={(e) => handleClick(e)}
                      />
                      <span className="ms-2 text-dark">Reviewer</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Row>
              <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-sm btn-outline-danger" onClick={() => props.onClose()}> Cancel </button>
                <button className="btn btn-sm btn-outline-success" onClick={() => {
                  updateEndpoint()
                }}>Update</button>
              </div>
            </Row>

          </AvForm>
        </Col>
      </Row>
    </div>
  )
}

export default EditEndpoints;
