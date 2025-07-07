import React from 'react';
import { useEffect, useState, useMemo, useRef } from 'react';
import {
    Container, Row, Col, Card, CardBody, CardTitle, Table, Button, Badge,
    Progress, Pagination, PaginationItem, PaginationLink,
    Modal, ModalHeader, ModalBody, OffcanvasHeader, Offcanvas, OffcanvasBody,
    UncontrolledTooltip,Spinner
} from "reactstrap";
import {  useNavigate } from 'react-router-dom';
import urlSocket from '../../../../helpers/urlSocket';
import TableContainer from './mapUserTableContainer';
import CrudManualCategory from './CrudManualCategory';
import { AvForm, AvField } from "availity-reactstrap-validation"

import Breadcrumbs from "../../../../components/Common/Breadcrumb"


import 'react-modern-drawer/dist/index.css'
import LocationOwner from './LocationOwner';


const propTypes = {};

const defaultProps = {};


const MapUserManualLocation = (props) => {
    const [locationData, setlocationData] = useState({})
    const [statusBasedFilteredData, setstatusBasedFilteredData] = useState([])
    const [roleUser,setRoleUser] = useState(null) 
    const [addedUsers, setaddedUsers] = useState([])

    const [columns, setColumns] = useState([])
    const [labelData, setlabelData] = useState([])
    const [userInfo, setUserInfo] = useState({})
    const [configData, setconfigData] = useState({})
    const [db_info, setDbInfo] = useState({})
    const [location_info, setLocationInfo] = useState({})
    const [viewUser, setviewUser] = useState({})
    const [dataloaded, setdataloaded] = useState(false)
    const [modal, setmodal] = useState(false)
    const [open, setOpen] = useState(false)
    const [position, setposition] = useState("")
    const [component, setcomponent] = useState("")
    const childCrudCategory = React.useRef(null)
    const history = useNavigate()


    const getSessionInfo = async () => {
        var locationInfo = JSON.parse(sessionStorage.getItem("locationInfo"))
        var data = JSON.parse(sessionStorage.getItem("authUser"))
        var dbInfo = JSON.parse(sessionStorage.getItem("db_info"))
        setDbInfo(dbInfo)
        setUserInfo(data.user_data)
        setLocationInfo(locationInfo)
        setconfigData(data.config_data)
        retriveExistCategory(dbInfo, locationInfo)
        getUserList(data.user_data, dbInfo)
        loadUserLabels(dbInfo, data.user_data)
        console.log("mapUserManualLocatotin", locationInfo, locationData.user_level, locationData)


    }



    const updateLocationData =(locationData)=>{

        setlocationData(locationData)


    }



    const retriveExistCategory = (db_info, locationData) => {
        console.log(db_info, 'db_info', locationData)
        try {
            urlSocket.post('cog/retrive-categories', {
                encrypted_db_url: db_info.encrypted_db_url,
                location_id: locationData._id,
                manual_location: true
            }).then((response) => {
                console.log(response, 'response')
                if (response.data.response_code === 500) {
                    console.log(response.data.data[0], 'response.data.data[0]')
                    setlocationData(response.data.data[0])
                    setaddedUsers(response.data.data[0].user_path)
                    setdataloaded(true)
                }
            })
        } catch (error) {
            console.log(error, 'error')
        }
    }




    const onDrawerClose = () => {
        setOpen(false)

    }


    useEffect(() => {

        getSessionInfo()

        // setdataloaded(true)
    }, [])

    const getUserList = (userData, dbData) => {
        console.log(userData, 'userInfo')
        try {
            var data = {
                company_id: userData.company_id,
                encrypted_db_url: dbData.encrypted_db_url
            }

            urlSocket.post("webUsers/usersList", data).then((response) => {
                console.log(response, 'response')
                if (response.data.response_code === 500) {
                    var active_usrs = _.filter(response.data.data, { active: "1" })
                    setstatusBasedFilteredData(active_usrs)
                    // retriveExistCategory()
                    setdataloaded(true)
                }
            })



        } catch (error) {

        }
    }

   

  

 


    const viewUserInfo = (data) => {
        console.log(data, 'data')
        setviewUser(data)
        setmodal(true)


    }

    const onSelectUsers=(userInfo,event)=>{
        console.log(userInfo,event.target.checked,'this.state.nodeInfo.node')
        var nodeInfo = JSON.parse(JSON.stringify(locationData))
        var selectedUsers =[...addedUsers]
        if(event.target.checked){
            var userLocInfo ={
                email_id : userInfo.email_id,
                phone_num : String(userInfo.countrycode) +String(userInfo.phone_number) ,
                cat_type : [] ,
                hirerachy_name : [] ,
                name : userInfo.firstname,
                // node_id : nodeInfo.node.flat_ref_id,
                user_id : userInfo._id,
                _id : userInfo._id,
            }
            nodeInfo.unique_users.push(userLocInfo)
            selectedUsers.push(userLocInfo)
        }
        else{
            var filteredUsers = nodeInfo.unique_users.filter((ele)=>{
                if(ele._id !== userInfo._id){
                    return ele
                }
            })


            var filteredRole = nodeInfo.user_permission_acpln.filter((ele)=>{
                if(ele.user_id !== userInfo._id){
                    return ele
                }
            })


            selectedUsers = selectedUsers.filter((ele)=>{
                if(ele._id !== userInfo._id){
                    return ele
                }
            })
            nodeInfo.unique_users =filteredUsers
            nodeInfo.user_permission_acpln =filteredRole


            // nodeInfo.node.unique_users = filteredUsers
        }
  
        setaddedUsers(selectedUsers)
        setlocationData(nodeInfo)
        console.log(nodeInfo,'nodeInfo',selectedUsers)




    }



    useEffect(() => {
        setColumns([
            {
                accessor: "select",
                Header: "Select User",
                // width: "5%",
                Cell: (cellProps) => {
                    const user = cellProps.row.original;
                    const selectedUsers = _.filter(locationData.unique_users, { user_id: cellProps.row.original._id });
                    return (
                        <input
                            defaultChecked={_.filter(selectedUsers, { user_id: user._id }).length > 0 ? true : false}
                            onChange={(e) => { onSelectUsers(user, e) }}
                            type="checkbox"
                        />
                    );
                }
            },
            {
                accessor: 'firstname',
                Header: 'User Name',
                isSort: true,
                // width: "30%",
                Cell: (cellProps) => {
                    var user_idx = _.filter(addedUsers, { _id: cellProps.row.original._id })

                    var item = cellProps.row.original
                    const filteredOptions = locationData.user_level?.filter((option) => {
                        return !user_idx.some((user) => user.cat_type === option.cat_type);
                    });
                    const highlightRow = user_idx.length > 0;
                    return (
                        // <div className={`row-highlight ${highlightRow ? 'highlighted' : ''} font-size-12`}>
                        <div className={`row-highlight font-size-12`}>
                            <div className="d-flex " style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className=" font-size-12 ">
                                    {item.firstname}
                                </div>
                                <div className=" font-size-11">
                                    {item.designation}
                                </div>
                            </div>
                        </div>
                    )
                }
            },
          
         
            {
                accessor: "menu",
                Header: "Action",
                // width: "10%",
                Cell: (cellProps) => {
                    var user = cellProps.row.original
                    return (
                        <div className="d-flex gap-3" style={{ display: 'flex', alignContent: 'center', cursor: 'pointer' }}>
                            
                             <Button id={`view-${user._id}`} className="btn btn-sm btn-soft-primary d-flex align-items-center" onClick={() => {viewUserInfo(user) }}  >
                                View Details  <i className="bx bx-right-arrow-alt ms-2 font-size-14"></i>
                                </Button>

                        </div>
                    )
                },
            },
            
        ])
        // getSessionInfo()
    }, [statusBasedFilteredData, addedUsers , roleUser])
    // const columns = useMemo(() => [



    // ], [])

    const mapSelectedUser = () => {
        reusableCrudApi(db_info, locationData)
       



    }


    const reusableCrudApi = (dbInfo, locationData) => {
        console.log(dbInfo, locationData, 'dbInfo,locationData')
        locationData.unique_users.forEach((ele,idx)=>{
         var facilityInfo = _.filter(locationData.user_permission_acpln,{user_id : ele.user_id})
         if(facilityInfo.length >0){
            locationData.unique_users[idx]["facilities"] = facilityInfo[0].facilities
            locationData.unique_users[idx]["role_description"] = facilityInfo[0].role_description
            locationData.unique_users[idx]["role_name"] = facilityInfo[0].role_name
            locationData.unique_users[idx]["id"] = facilityInfo[0].id
         }
        })


            try {
                urlSocket.post('cog/crud-category', {
                    confiGuration: {
                        encrypted_db_url: dbInfo.encrypted_db_url,
                        hirerachyUserlvl: locationData,
                        _id: locationData._id,
                        manual_location: true
                    }

                }).then((response) => {
                    console.log(response, 'response')
                    if (response.data.response_code === 500) {
                        history("/mels")
                     
                    }
                })

            } catch (error) {
                console.log(error, 'error')
            }
       
    }

    const toggle = () => {
        setmodal(!modal)


    }


    const loadUserLabels = (dbInfo, userData) => {
        console.log(dbInfo, userData)
        try {
            urlSocket.post("userSettings/get-user-group", {
                userInfo: {
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    _id: userData._id,
                    company_id: userData.company_id
                }
            })
                .then(response => {
                    console.log(response, 'response')
                    setlabelData(response.data.data)
              
                })

        } catch (error) {
        }
    }







    const labelSelected = (data) => {

        // console.log("data.target.value -->", data.target.value)

        if (data.target.value === "all") {
            getUserList(userInfo,db_info)
            // retriveExistCategory(db_info, location_info)
        }
        else {
            var mylabel = labelData[data.target.value]

            try {

                urlSocket.post("userSettings/load-group-users", {
                    labelInfo: mylabel,
                    userInfo: {
                        encrypted_db_url: db_info.encrypted_db_url,
                        _id: userInfo._id,
                        company_id: userInfo.company_id
                    }
                })
                    .then(response => {
                        console.log(response, 'response')
                        setstatusBasedFilteredData(response.data.data)
                    })
            } catch (error) {
            }

        }
    }


    const gotoBack = () => {
        history('/mels')
    }


    if (dataloaded) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ minHeight: "100vh" }}>
                <Breadcrumbs
                            title={"Location / " + locationData.name}
                            breadcrumbItem="Locations"
                            isBackButtonEnable={true}
                            gotoBack={() => gotoBack()}
                        />
                    <Container fluid>

                      

                        <Card className="" >
                            <CardBody>
                                    <TableContainer
                                        columns={columns}
                                        data={statusBasedFilteredData}
                                        isGlobalFilter={true}
                                        isAddOptions={false}
                                        isJobListGlobalFilter={false}
                                        customPageSize={10}
                                        style={{ width: '100%' }}

                                        labelData={labelData}
                                        labelSelected={(data) => labelSelected(data)}
                                        newCategory={() => {
                                            setOpen(true);
                                            setcomponent("crud");
                                            setposition("relative");
                                            console.log(childCrudCategory);
                                            childCrudCategory.current?.retriveExistCategory(locationData, db_info)
                                        }
                                        }
                                        filteredDatalength={statusBasedFilteredData.length}
                                        history={history}

                                        isPagination={true}
                                        iscustomPageSizeOptions={false}
                                        filterable={false}
                                        tableClass="align-middle table-nowrap table-check"
                                        theadClass="table-light"
                                        paginationDiv="col-sm-12 col-md-7"
                                        pagination="pagination justify-content-end pagination-rounded"
                                        addedUsers= {locationData?.unique_users}
                                    />

                            </CardBody>
                        </Card>

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
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center"}}>
                                    <button className="btn btn-success btn-sm ms-2" type="submit" onClick={() => { mapSelectedUser() }} >
                                        Map Selected Users
                                    </button>
                            </div>
                        </footer>


                        <Modal isOpen={modal} toggle={toggle}  >
                            <ModalHeader toggle={toggle} tag="h4">
                                User Info
                            </ModalHeader>
                            <ModalBody>
                                <AvForm className="form-horizontal"
                                //  onValidSubmit={Validsubmit}
                                >
                                    <div className="mb-3">
                                        <label>Full Name :<span className="text-danger"> *</span></label>
                                        <AvField
                                            name="firstname"
                                            value={viewUser !== undefined ? viewUser.firstname : ''}
                                            disabled={true}
                                            errorMessage="Please enter your name"
                                            className="form-control"
                                            placeholder="Enter First Name"
                                            type="text"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Email Id :<span className="text-danger"> *</span></label>
                                        <AvField
                                            name="email_id"
                                            value={viewUser !== undefined ? viewUser.email_id : ''}
                                            disabled={true}
                                            errorMessage="Please enter your Email ID"
                                            className="form-control"
                                            placeholder="Enter User Email"
                                            type="email"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Username :<span className="text-danger"> *</span></label>
                                        <AvField
                                            name="username"
                                            type="text"
                                            required
                                            placeholder="Enter username"
                                            disabled={true}
                                            value={viewUser !== undefined ? viewUser.username : ''}
                                        />
                                    </div>
                                    <div className="mb-3">                              
                                                <Row>
                                                    <label>Phone Number:<span className="text-danger"> *</span></label>
                                                    <Col md={3} className="pe-0">
                                                        <input
                                                            type="text"
                                                            value={viewUser !== undefined ? viewUser.countrycode : ''}
                                                            className="form-control"
                                                            disabled={true}
                                                        />
                                                    </Col>
                                                    <Col md={9} className="ps-0">
                                                        <AvField
                                                            name="phone_number"
                                                            className="form-control"
                                                            placeholder="Enter Phone number"
                                                            errorMessage="Please enter your Phone Number"
                                                            value={viewUser !== undefined ? viewUser.phone_number : ''}
                                                            disabled={true}
                                                            type="number"
                                                        />
                                                    </Col>
                                                </Row>
                                           
                                    </div>

                                   
                                </AvForm>


                            </ModalBody>
                        </Modal>

                        {
                            open && (
                                <Offcanvas
                                    isOpen={open}
                                    toggle={onDrawerClose}
                                    direction="end" // 'end' for right side, use 'start' for left
                                    style={{ width: '500px', zIndex: 9999 }}
                                >
                                    <OffcanvasHeader toggle={onDrawerClose}>
                                        {/* You can add a custom header title if needed */}
                                        {component === "crud" && <span>Crud Manual Category</span>}
                                        {component === "role" && <span>Role Management</span>}
                                    </OffcanvasHeader>

                                    <OffcanvasBody>
                                       
                                        {
                                            component === "crud" ? (
                                                <CrudManualCategory
                                                    onClose={onDrawerClose}
                                                    locationData={locationData}
                                                    ref={childCrudCategory}
                                                />
                                            ) : component === "role" ? (
                                                <LocationOwner
                                                    updateLocationData={updateLocationData}
                                                    roleUser={roleUser}
                                                    userInfo={statusBasedFilteredData}
                                                    locationData={locationData}
                                                    config_data={configData}
                                                    onClose={onDrawerClose}
                                                />
                                            ) : null
                                        }
                                    </OffcanvasBody>
                                </Offcanvas>
                            )
                        }


                       
                      
                    </Container>
                </div>
            </React.Fragment>


        )
    }
    else {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
               <div>Loading...</div>
              <Spinner color="primary" />         
            </div>
          );
    }
}

MapUserManualLocation.propTypes = propTypes;
MapUserManualLocation.defaultProps = defaultProps;

export default MapUserManualLocation;