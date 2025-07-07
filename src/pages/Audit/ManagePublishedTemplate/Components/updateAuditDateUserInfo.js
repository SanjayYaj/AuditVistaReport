import React, { useEffect,useState } from 'react'
import { Row,Container,Col,Card,CardBody,Label } from 'reactstrap'
import { AvField,AvForm } from 'availity-reactstrap-validation'
import { useDispatch } from 'react-redux'
import { retriveAuditInfo } from 'toolkitStore/Auditvista/ManageAuditSlice'
import { Table } from 'react-bootstrap';
import { Multiselect } from 'multiselect-react-dropdown';
import { updatePublishedAuditEps } from 'toolkitStore/Auditvista/ManageAuditSlice'
import Swal from 'sweetalert2';



const UpdateAuditDateUserInfo = (props) => {
  console.log(props,'props')
  const [minDate, setMinDate] = useState(null)
  const dispatch = useDispatch()
  const [epsList,setEpsList] = useState([])
  const [auditInfo,setauditInfo] = useState(props.auditInfo)
  const [updatedMsg, setupdatedMsg] = useState(false)
   const [resetMultiSelect, setresetMultiSelect] = useState(false)
   const [auditUserErrors, setAuditUserErrors] = useState([]);
   const [reviewUserErrors, setReviewUserErrors] = useState([]);
   const [inchargeUserErrors, setInchargeUserErrors] = useState([]);

 
  

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];
    console.log("update the date info", props, tomorrowFormatted)
    setMinDate(tomorrowFormatted)
    retriveAuditLocation()

  }, [])


  const validateAuditType = (epsList) => {
    console.log("epsList", epsList);

    const auditErrors = epsList.map(row =>
      _.some(row.audit_pbd_users, { audit_type: "1" })
        ? null
        : "Please select at least one audit user"
    );

    let reviewErrors = [];

    if (auditInfo.settings.enable_review) {
      reviewErrors = epsList.map(row =>
        _.some(row.audit_pbd_users, { audit_type: "2" })
          ? null
          : "Please select at least one review user"
      );
      setReviewUserErrors(reviewErrors);
    }


    const inChargeErrors = epsList.map(row =>
      _.some(row.audit_pbd_users, { audit_type: "3" })
          ? null
          : "Please select at least one inCharge user"
  );

    setAuditUserErrors(auditErrors);
    setInchargeUserErrors(inChargeErrors)



 

    const isAuditValid = auditErrors.every(err => err === null);
    const isReviewValid = reviewErrors.every(err => err === null);
    const isInchargeValid = inChargeErrors.every(err => err === null);


    return isAuditValid && (!auditInfo.settings.enable_review || isReviewValid && isInchargeValid);
  };


  const retriveAuditLocation=async()=>{

    const responseData = await dispatch(retriveAuditInfo())
    console.log(responseData,'responseData')
    if (responseData.response_code === 500) {
      setEpsList(responseData.data)
    }
  }


  const changeAuditUserHandler = async (selectedList, selectedItem, item, mode, action) => {
    console.log(selectedList, selectedItem, item, mode, action, 'selectedList, selectedItem,item, mode, action')
    const epsListInfo = _.cloneDeep(epsList)
    var findIdx
    if (mode !== "3") {
      findIdx = _.findIndex(item.audit_pbd_users, (user) =>
        user.user_id === selectedItem.user_id && user.audit_type !== "3"
      );
    }
    else {
      findIdx = _.findIndex(item.audit_pbd_users, (user) =>
        user.user_id === selectedItem.user_id
      );
    }
    const epIdx = _.findIndex(epsListInfo, { _id: item._id })
    if (findIdx === -1) {
      item.audit_pbd_users.push({
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
      console.log(item.audit_pbd_users[findIdx]["audit_type"], item, findIdx, action, 'item.adt_users[findIdx]["audit_type"]')
      if (item.audit_pbd_users[findIdx]["audit_type"] !== mode && mode !== "3") {
        setresetMultiSelect(false)
        selectedList = selectedList.filter((ele) => {
          if (ele.user_id !== selectedItem.user_id) {
            return ele
          }
        })
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
        })
      } else if (action === "remove") {
        if (findIdx !== -1) {
          item.audit_pbd_users.splice(findIdx, 1)
        }
      }
    }

    epsListInfo[epIdx] = item
    setEpsList(epsListInfo)

    validateAuditType(epsListInfo);

  }

  const updateAuditInfo=async()=>{
    console.log(epsList,'epList')

    if (!validateAuditType(epsList)) {
      return;
    }


    console.log("doneeeee")

    var updateInfo = await dispatch(updatePublishedAuditEps(epsList,auditInfo.repeat_mode_config.mode))
   
   
    if(updateInfo){
      setupdatedMsg(true)
      setTimeout(() => {
        setupdatedMsg(false)
        props.onClose()
      }, 2000);
      retriveAuditLocation()
    }
    
  }



  return (
    <div>  <Container>
      <Row className="justify-content-center">
        <Col md={12}>
          <Card style={{ border: '1px solid #e9e9e9' }}>
            <CardBody>
                  <AvForm className="form-horizontal">
                <Row className="mb-2">
                  <Col>
                    <AvField
                      name="target_date"
                      type="date"
                      label="Audit end date"
                      errorMessage="Please provide a valid date."
                      className="form-control"
                      value={auditInfo?.audit_end_date ? auditInfo.audit_end_date.split('T')[0] : ''}
                      min={minDate}
                      onChange={(e) => { 
                        // setChangedDateInfo(e.target.value)
                       }}
                      onKeyDown={(e) => { e.preventDefault(); }}
                      validate={{ required: { value: true } }}
                      id="td"
                    />

                  
                  </Col>
                </Row>
                <Row>
                       <Col>
                       <Label className=" text-center">Audit Information</Label>
                        <div className="table-responsive">
                      <Table striped bordered hover responsive className="shadow-sm">
                        <thead className="thead-dark">
                          <tr>
                            <th>{"Location / Asset Name"} </th>
                            <th>Audit User</th>
                            {
                              auditInfo?.settings?.enable_review &&
                              <th>Review User</th>
                            }
                              <th>Incharge User</th>
                            
                          </tr>
                        </thead>
                            <tbody>
                          {epsList.map((row, index) => (
                            <tr key={index}>

                              <td>
                                <p className="mb-1 text-primary">{row.loc_name}</p>
                              </td>
                              <td style={{ minWidth: '200px', maxWidth: '250px' }}>
                                <Multiselect
                                  options={row.location_unique_users}
                                  displayValue="name"
                                  selectedValues={
                                    _.filter(row.audit_pbd_users, { audit_type: "1" }).length > 0 ? _.filter(row.audit_pbd_users, { audit_type: "1" }) : []

                                  }
                                  onSelect={(selectedList, selectedItem) => {
                                     changeAuditUserHandler(selectedList, selectedItem, _.cloneDeep(row), "1", 'add')

                                  }}
                                  onRemove={(selectedList, selectedItem) => {
                                     changeAuditUserHandler(selectedList, selectedItem, _.cloneDeep(row), "1", 'remove')
                                  }}
                                  style={{
                                    chips: { background: '#007bff' },
                                    multiselectContainer: { color: 'black' }
                                  }}
                                />
                                {auditUserErrors[index] && (
                                  <p style={{ color: 'red', fontSize: '12px' }}>{auditUserErrors[index]}</p>
                                )}
                              </td>
                              {
                                auditInfo?.settings.enable_review && (
                                  <td style={{ minWidth: '200px', maxWidth: '250px' }}>
                                    <Multiselect
                                      options={row.location_unique_users}
                                      displayValue="name"
                                      selectedValues={
                                        _.filter(row.audit_pbd_users, { audit_type: "2" }).length > 0
                                          ? _.filter(row.audit_pbd_users, { audit_type: "2" })
                                          : []
                                      }
                                      onSelect={(selectedList, selectedItem) => {
                                        changeAuditUserHandler(selectedList, selectedItem, _.cloneDeep(row), "2", 'add');
                                      }}
                                      onRemove={(selectedList, selectedItem) => {
                                        changeAuditUserHandler(selectedList, selectedItem, _.cloneDeep(row), "2", 'remove');
                                      }}
                                      style={{
                                        chips: { background: '#28a745' },
                                        multiselectContainer: { color: 'black' }
                                      }}
                                    />
                                    {reviewUserErrors[index] && (
                                      <p style={{ color: 'red', fontSize: '12px' }}>{reviewUserErrors[index]}</p>
                                    )}
                                  </td>
                                )
                              }
                                  <td style={{ minWidth: '200px', maxWidth: '250px' }}>
                                <Multiselect
                                  options={row.location_unique_users}
                                  displayValue="name"
                                  selectedValues={
                                    _.filter(row.audit_pbd_users, { audit_type: "3" }).length > 0 ? _.filter(row.audit_pbd_users, { audit_type: "3" }) : []

                                  }
                                  onSelect={(selectedList, selectedItem) => {
                                     changeAuditUserHandler(selectedList, selectedItem, _.cloneDeep(row), "3", 'add')

                                  }}
                                  onRemove={(selectedList, selectedItem) => {
                                     changeAuditUserHandler(selectedList, selectedItem, _.cloneDeep(row), "3", 'remove')
                                  }}
                                  style={{
                                    chips: { background: '#007bff' },
                                    multiselectContainer: { color: 'black' }
                                  }}
                                />
                                {inchargeUserErrors[index] && (
                                  <p style={{ color: 'red', fontSize: '12px' }}>{inchargeUserErrors[index]}</p>
                                )}
                              </td>

                            </tr>
                          ))}
                            </tbody>
                      </Table>
                        </div>
                       </Col>
                </Row>
                {
                  updatedMsg &&
                  <div className="alert alert-success text-center mb-4" role="alert">Audit updated successfully.</div>
                }
                <Row>
                  <div className="d-flex gap-2 justify-content-end mt-2">
                    <button className="btn btn-sm btn-outline-danger" type='button' onClick={() => props.onClose()}> Cancel </button>
                    <button className="btn btn-sm btn-outline-success" 
                    disabled={updatedMsg}
                     onClick={() => { 
                      updateAuditInfo()
                       }}>Update</button>
                  </div>
                </Row>

                  </AvForm>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>

    </div>
  )
}
export default UpdateAuditDateUserInfo
