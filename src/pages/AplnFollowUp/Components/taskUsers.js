import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import {
    Col,
    Row,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Collapse,
} from "reactstrap";
import _ from "lodash";
import CreateNewUser from "./createNewUser";
import ImportUser from "./ImportUser"
import UserRoleInformation from "./userRoleInformation";
import { removeAplnUser, setSelectedUser, setEmailExist, setphoneNumExist } from '../../../toolkitStore/Auditvista/aplnfollowup/aplnflwupslice'

const TaskUsers = ({
    selectedCheckpoint,
    selectedApln,
    endpointData,
    userData,
    connectedRoomUsers,
    showUserPanel
}) => {

    const dispatch = useDispatch();

    const followUpSlice = useSelector(state => state.acplnFollowUpSliceReducer)

    const [customActiveTab, setcustomActiveTab] = useState("1");
    const [customActiveUserTab, setcustomActiveUserTab] = useState("1");
    const [addUserType, setaddUserType] = useState("")
    const [locationInfo, setLocationInfo] = useState(JSON.parse(sessionStorage.getItem("endpointData")))
    const [hideImportUser, sethideImportUser] = useState(false)
    const [ColToggle, setColToggle] = useState(false)


    const validUser = followUpSlice.validUser
    const userFacilities = validUser.length > 0 ? validUser[0]["facilities"] : []
    const addUserStatus = useMemo(() => _.some(userFacilities, facility => {
        return facility.id === 1 && facility.role_status === true && (facility.checked === undefined || facility.checked === true);
    }), [userFacilities]);

    const deleteUserStatus = useMemo(() => _.some(userFacilities, facility => {
        return facility.id === 2 && facility.role_status === true && (facility.checked === undefined || facility.checked === true);
    }), [userFacilities]);

    const changeRoleStatus =
        useMemo(() => _.some(userFacilities, facility => {
            return facility.id === 3 && facility.role_status === true && (facility.checked === undefined || facility.checked === true);
        }), [userFacilities]);

    useEffect(() => {

        if (selectedApln) {
            if (selectedApln.task_status === "3") {
                setcustomActiveTab("1")
            }

        }
    }, [selectedApln, userData])


    useEffect(() => {
        const locationUsersWithIds = locationInfo.location_unique_users.filter(user => user.user_id);

        const allUserIdsExist = locationUsersWithIds.every(locationUser => {
            return selectedApln.task_users.some(taskUser => taskUser.user_id === locationUser.user_id);
        });

        sethideImportUser(allUserIdsExist)

    }, [])

    const toggleCustom = tab => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };

    const toggleUserCustom = tab => {
        if (customActiveUserTab !== tab) {
            setcustomActiveUserTab(tab);
        }
    };

    const onClickRemove = (selecteduser, selectedApln, type) => {

        let newuser = {
            ...selecteduser,
            user_status: type === 'remove' ? "1" : "2"
        };
        dispatch(removeAplnUser(newuser, selectedApln._id, selectedApln, selectedCheckpoint, locationInfo));
    }




    return (
        <div>
            <Row>
                <Col>
                    <div className="px-3 d-flex flex-row justify-content-between border-bottom border-secondary border-opacity-25" style={{ padding: '12px' }}>
                        <div className="d-flex flex-row gap-2 ">
                            <Nav tabs className="nav-tabs-custom " style={{ border: 0 }}>
                                <NavItem style={{ flexGrow: 0 }}>
                                    <NavLink
                                        style={{ cursor: "pointer", padding: 0 }}
                                        className="me-2"

                                        onClick={() => {
                                            toggleCustom("1");
                                        }}
                                    >

                                        <div className="avatar-group-item" title={"Add More Users"}>
                                            <Link to="#" className="d-inline-block" defaultValue="member-4"
                                            >
                                                <div className={`rounded-circle avatar-xs ${customActiveTab === "1" ? "bg-primary" : "bg-light"}`} style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: 'black',
                                                }}>
                                                    <i className={`fas fa-users ${customActiveTab === "1" ? "text-white" : "text-dark"}`} />
                                                </div>
                                            </Link>
                                        </div>

                                    </NavLink>
                                </NavItem>
                                {
                                    addUserStatus && selectedApln.task_status !== "3" &&
                                    <NavItem style={{ flexGrow: 0 }}>
                                        <NavLink
                                            style={{ cursor: "pointer", padding: 0 }}
                                            className="me-2"
                                            onClick={() => {
                                                dispatch(setEmailExist(false))
                                                dispatch(setphoneNumExist(false))
                                                toggleCustom("2");
                                                toggleUserCustom("1");
                                            }}
                                        >
                                            <div className="avatar-group-item" title={"Add More Users"}>
                                                <Link to="#" className="d-inline-block" defaultValue="member-4"
                                                >
                                                    <div className={`rounded-circle avatar-xs ${customActiveTab === "2" ? "bg-primary" : "bg-light"}`} style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        color: 'black',
                                                    }}>
                                                        <i className={`fas fa-user-plus ${customActiveTab === "2" ? "text-white" : "text-dark"}`} />
                                                    </div>
                                                </Link>
                                            </div>

                                        </NavLink>
                                    </NavItem>
                                }
                            </Nav>
                        </div>

                        <div className="avatar-group-item" title={"Add More Users"}>
                            <Link to="#" className="d-inline-block" defaultValue="member-4"
                                onClick={() => { showUserPanel() }}
                            >
                                <div className={`rounded-circle avatar-xs bg-danger`} style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'black',
                                }}>
                                    <i className="mdi mdi-close text-white" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="col p-2">
                <TabContent
                    activeTab={customActiveTab}
                    className=" text-muted"
                >
                    <TabPane tabId="1" >
                        <div style={{ height: "72vh", overflow: "auto" }} >
                            {
                                selectedApln.task_status !== "3" ?

                                    connectedRoomUsers && selectedApln.task_users.map((user, index) => {
                                        var isActive = _.findIndex(connectedRoomUsers.users, { "userid": user.user_id })
                                        if (user.user_status === "0" || user.user_status === undefined) {
                                            return <div className="d-flex flex-column mb-2 p-2 bg-light " key={"tu" + index} style={{ borderRadius: 25 }}>

                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <div className={`rounded-circle avatar-xs me-2 ${isActive !== -1 ? "bg-success text-dark" : "bg-secondary text-dark"} bg-opacity-25`} style={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            color: 'black',
                                                        }}>
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="d-flex flex-column ">
                                                            <div className="font-size-13 text-dark">{user.name} {user.user_id === userData._id && "(You)"}</div>
                                                            <div className="text-secondary" style={{ fontSize: "0.7rem" }}>{user.role_name}</div>
                                                        </div>
                                                    </div>
                                                    {
                                                        validUser[0]["id"] === 4 && user.user_id === userData._id ?
                                                            <div className="d-flex flex-row gap-1">
                                                                <UncontrolledDropdown className="dropdown d-inline-block me-1">
                                                                    {

                                                                        <DropdownToggle type="menu" tag="a" id="dropdownMenuButton1">
                                                                            <div className="avatar-group-item" title={"Add More Users"}>
                                                                                <Link to="#" className="d-inline-block" defaultValue="member-4"
                                                                                >
                                                                                    <div className={`rounded-circle avatar-xs bg-secondary`} style={{
                                                                                        display: 'flex',
                                                                                        justifyContent: 'center',
                                                                                        alignItems: 'center',
                                                                                        color: 'black',
                                                                                    }}>
                                                                                        <i className="mdi mdi-dots-vertical text-white" />
                                                                                    </div>
                                                                                </Link>
                                                                            </div>
                                                                        </DropdownToggle>
                                                                    }
                                                                    <DropdownMenu>
                                                                        {user.user_id === userData._id && (
                                                                            <li><DropdownItem onClick={() => { onClickRemove(user, selectedApln, 'leave') }} href="#" className="my-2 text-danger">Left from room</DropdownItem></li>
                                                                        )}
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown>
                                                            </div>
                                                            :

                                                            validUser[0]["id"] !== 4 ?
                                                                <div className="d-flex flex-row gap-1">


                                                                    <UncontrolledDropdown className="dropdown d-inline-block me-1">
                                                                        {

                                                                            <DropdownToggle type="menu" tag="a" id="dropdownMenuButton1">
                                                                                <div className="avatar-group-item" title={"Add More Users"}>
                                                                                    <Link to="#" className="d-inline-block" defaultValue="member-4"
                                                                                    >
                                                                                        <div className={`rounded-circle avatar-xs bg-secondary`} style={{
                                                                                            display: 'flex',
                                                                                            justifyContent: 'center',
                                                                                            alignItems: 'center',
                                                                                            color: 'black',
                                                                                        }}>
                                                                                            <i className="mdi mdi-dots-vertical text-white" />
                                                                                        </div>
                                                                                    </Link>
                                                                                </div>
                                                                            </DropdownToggle>
                                                                        }
                                                                        <DropdownMenu>
                                                                            {user.user_id === userData._id && (
                                                                                <li><DropdownItem onClick={() => { onClickRemove(user, selectedApln, 'leave') }} href="#" className="my-2 text-danger">Left from room</DropdownItem></li>
                                                                            )}
                                                                            {
                                                                                user.user_id !== userData._id && changeRoleStatus
                                                                                && user.id >= followUpSlice.validUser[0].id

                                                                                && (
                                                                                    <li onClick={() => {
                                                                                        setaddUserType("changerole");
                                                                                        dispatch(setSelectedUser(user))
                                                                                        ColToggle !== index ? setColToggle(index) : setColToggle(-1)
                                                                                    }}><DropdownItem href="#" className="my-2" >Change role</DropdownItem></li>

                                                                                )
                                                                            }
                                                                            {
                                                                                user.user_id !== userData._id && deleteUserStatus === true &&
                                                                                <li><DropdownItem onClick={() => { onClickRemove(user, selectedApln, 'remove') }} href="#" className="text-danger my-2 py-2 border-top border-secondary border-opacity-25">
                                                                                    <div className="d-flex justify-content-between">
                                                                                        <div>Remove </div>
                                                                                        <div><i className="bx bx-user-minus font-size-18"></i></div>
                                                                                    </div></DropdownItem>
                                                                                </li>
                                                                            }
                                                                        </DropdownMenu>
                                                                    </UncontrolledDropdown>
                                                                </div>
                                                                :
                                                                <>
                                                                </>
                                                    }
                                                </div>

                                                <Collapse isOpen={ColToggle === index}>
                                                    {
                                                        addUserType === "changerole" &&
                                                        <UserRoleInformation
                                                            onClose={() => {
                                                                ColToggle !== index ? setColToggle(index) : setColToggle(-1)
                                                            }}
                                                            selectedApln={selectedApln}
                                                        />}
                                                </Collapse>


                                            </div>
                                        }
                                    }
                                    )
                                    :
                                    connectedRoomUsers && selectedApln.task_users.map((user, index) => {
                                        var isActive = _.findIndex(connectedRoomUsers.users, { "userid": user.user_id })
                                        if (user.user_status === "0" || user.user_status === undefined) {
                                            return <div className="d-flex flex-column mb-2 p-2 bg-light " key={"tu" + index} style={{ borderRadius: 25 }}>

                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <div className={`rounded-circle avatar-xs me-2 ${isActive !== -1 ? "bg-success text-dark" : "bg-secondary text-dark"} bg-opacity-25`} style={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            color: 'black',
                                                        }}>
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="d-flex flex-column ">
                                                            <div className="font-size-13 text-dark">{user.name} {user.user_id === userData._id && "(You)"}</div>
                                                            <div className="text-secondary" style={{ fontSize: "0.7rem" }}>{user.role_name}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    }
                                    )
                            }
                        </div>
                    </TabPane>
                    <TabPane tabId="2" >
                        <div className="d-flex flex-column" style={{ height: "72vh", overflow: "auto" }} >
                            <div className="overflow-auto">
                                <Nav tabs className="nav-tabs-custom d-flex flex-wrap justify-content-center flex-sm-column flex-md-row" style={{ border: 0 }}>
                                    <NavItem className="mx-1 my-1">
                                        <NavLink style={{ cursor: "pointer", padding: 0 }} className="me-2" onClick={() => { toggleUserCustom("1") }} >
                                            <div className="avatar-group-item" title={"Add More Users"}>
                                                <Link to="#" className="d-inline-block" defaultValue="member-4" >
                                                    <div className={` py-1 px-3 font-size-12 ${customActiveUserTab === "1" ? "bg-primary  text-white" : "bg-light text-secondary"}`} style={{ borderRadius: 25, fontWeight: 400 }}>
                                                        <i className={`fas fa-users me-2`} /> Create New User
                                                    </div>
                                                </Link>
                                            </div>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="mx-1 my-1">
                                        <NavLink style={{ cursor: "pointer", padding: 0 }} className="me-2" disabled={hideImportUser} onClick={() => { toggleUserCustom("2"); }} >
                                            <div className="avatar-group-item" title={"Add More Users"}>
                                                <Link to="#" className="d-inline-block" defaultValue="member-4" >
                                                    <div className={`py-1 px-3 font-size-12 ${hideImportUser && "text-secondary text-opacity-25"} ${customActiveUserTab === "2" ? "bg-primary text-white" : "bg-light text-secondary"}`}
                                                        style={{ borderRadius: 25, fontWeight: 400 }}>
                                                        <i className={`fas fa-user-plus me-2`} /> Import Users
                                                    </div>
                                                </Link>
                                            </div>

                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </div>

                            <TabContent
                                activeTab={customActiveUserTab}
                                className=" text-muted"
                            >
                                <TabPane tabId="1" >
                                    <div >
                                        {
                                            customActiveUserTab &&
                                            <CreateNewUser
                                                onClose={() => {
                                                    toggleCustom("1");
                                                }}
                                                selectedActionplan={selectedApln}
                                                selectedCheckpoint={selectedCheckpoint}
                                                locationInfo={endpointData}
                                            />
                                        }

                                    </div>
                                </TabPane>
                                <TabPane tabId="2" >
                                    <div >
                                        <ImportUser
                                            onClose={() => {
                                                toggleCustom("1");
                                            }}
                                            selectedCheckpoint={selectedCheckpoint}
                                            selectedApln={selectedApln}
                                            locationInfo={endpointData}
                                        />
                                    </div>
                                </TabPane>
                            </TabContent>
                        </div>
                    </TabPane>
                </TabContent>

            </div>
        </div>
    )
}

export default TaskUsers


