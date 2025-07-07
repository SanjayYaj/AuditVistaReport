import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { addActionPlanUser } from '../../../toolkitStore/Auditvista/aplnfollowup/aplnflwupslice';
import { useDispatch } from 'react-redux';


const ImportUser = (props) => {

    const dispatch = useDispatch()

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [historyPermission, setHistoryPermission] = useState({});
    const [errorValue, setErrorValue] = useState(false)
    const [locationInfo, setLocationInfo] = useState(JSON.parse(sessionStorage.getItem("endpointData")))
    const [sessionUserInfo, setsessionUserInfo] = useState(JSON.parse(sessionStorage.getItem("authUser")))
    const [acplanRoleInfo, setacplanRoleInfo] = useState([])
    const followUpSlice = useSelector(state => state.acplnFollowUpSliceReducer)
    const [isChecked, setIsChecked] = useState(false);
    const [isSwitch, setIsSwitch] = useState(false);



    const filteredOtherUsers = locationInfo.location_unique_users.filter(item1 => !props.selectedApln.task_users.some(item2 => item1["user_id"] === item2["user_id"]));

    useEffect(() => {

    }, [followUpSlice.selectedActionplan])


    useEffect(() => {
        var roleInfo = JSON.parse(sessionStorage.getItem("authUser")).config_data.action_plan_roles
        var roleInfo = roleInfo.filter((e) => {
            if (e.id >= followUpSlice.validUser[0].id) {
                return e
            }
        })
        setacplanRoleInfo(roleInfo)
    }, [])


    const handleUserSelectionChange = (user, isSelected) => {
        const check = isSelected === false ? true : false;
        if (check) {
            user["user_status"] = "0"
            setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, user]);
            setHistoryPermission(prevPermission => ({ ...prevPermission, [user.user_id]: '0' }));
        } else {
            setSelectedUsers(prevSelectedUsers => prevSelectedUsers.filter(u => u.user_id !== user.user_id));
            setHistoryPermission(prevPermission => {
                const { [user.user_id]: omit, ...rest } = prevPermission;
                return rest;
            });
        }
        setIsChecked(!isChecked)
    };


    const handleHistoryPermissionChange = (user, isAllowed) => {
        const updatedPermission = isAllowed ? '0' : '1';
        const updatedUser = { ...user, history_permisson: updatedPermission };
        const updatedSelectedUsers = selectedUsers.map(selectedUser =>
            selectedUser.user_id === user.user_id ? updatedUser : selectedUser
        );
        setSelectedUsers(updatedSelectedUsers);
        setHistoryPermission(prevPermission => ({ ...prevPermission, [user.user_id]: updatedPermission }));
    };


    const handleSaveClick = async () => {
        if (selectedUsers.some(user => !user.role_name)) {
            setErrorValue(true)
        } else {
            setErrorValue(false)
            locationInfo["action_id"] = props.selectedApln.action_id

            const uniqueSelectedUsers = Array.from(
                new Map(selectedUsers.map(user => [user.user_id, user])).values()
            );

            const dataobject = {
                selectedUsers: uniqueSelectedUsers.map(user => ({ ...user, history_permisson: historyPermission[user.user_id] })),
                location_info: locationInfo,
                task_id: props.selectedApln._id,
                action_id: props.selectedApln.action_id,
                dbInfo: sessionUserInfo.db_info,
                userdata: sessionUserInfo.user_data
            };
            dispatch(addActionPlanUser(dataobject, props.selectedApln, props.selectedCheckpoint, props.locationInfo));
            props.onClose()
            setSelectedUsers([])
        };

    }



    const assignRoleForUser = (event, userInfo) => {
        setErrorValue(false)
        var getSelectedRole = _.filter(acplanRoleInfo, { id: Number(event.target.value) })
        var selectedUser = [...selectedUsers]
        if (getSelectedRole.length > 0) {
            var getIdx = _.findIndex(selectedUser, { _id: userInfo._id })
            if (getIdx !== -1) {
                selectedUser[getIdx]["id"] = getSelectedRole[0].id
                selectedUser[getIdx]["role_name"] = getSelectedRole[0].role_name
                selectedUser[getIdx]["role_description"] = getSelectedRole[0].role_description
                selectedUser[getIdx]["facilities"] = getSelectedRole[0].facilities
                selectedUser[getIdx]["user_status"] = "0"

            }
        }
        setSelectedUsers(selectedUser);

    };



    return (<div className='mt-2'>

        <table className="table" >
            <thead>
                <tr>
                    <th className='bg-light'>Select</th>
                    <th className='bg-light'>Name</th>
                </tr>
            </thead>
            <tbody>
                {filteredOtherUsers.map((user, idx) => (
                    <tr key={idx} >
                   <td width={"70px"}>
                            <input
                                type="checkbox"
                                id={`checkbox_${idx}`}
                                onClick={(e) => handleUserSelectionChange(user, isChecked)}
                                checked={selectedUsers.some((selectedUser) => selectedUser.user_id === user.user_id)}
                            />
                        </td>

                        <td>
                            <div className='d-flex flex-column gap-2'>
                                <div>{user.name}</div>
                                {user.designation && <div>{user.designation}</div>}
                                {selectedUsers.some((selectedUser) => selectedUser.user_id === user.user_id) && (
                                    <>
                                        <div style={{}}>

                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <select defaultValue={user?.id == null ? "Select Role" : user.id}
                                                    onChange={(e) => {
                                                        assignRoleForUser(e, user)
                                                    }}
                                                    className='form-select'
                                                >
                                                    <option disabled value={'Select Role'}>{"Select Role"}</option>
                                                    {
                                                        acplanRoleInfo.map((data, idx) => (
                                                            <option defaultValue={user?.id === data.id} key={idx} value={data.id}>{data.role_name} </option>
                                                        ))
                                                    }

                                                </select>
                                            </div>
                                        </div>

                                        {
                                            errorValue === true &&
                                            <p className='text-danger'><span>*</span> Please Select the Roll</p>
                                        }
                                    </>
                                )}
                               {selectedUsers.some((selectedUser) => selectedUser.user_id === user.user_id) && (
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id={`flexSwitchCheck_${idx}`}
                                            onClick={(e) => { setIsSwitch(!isSwitch); handleHistoryPermissionChange(user, isSwitch) }}
                                            checked={historyPermission[user.user_id] === '0'}
                                        />
                                        <label className="form-check-label" htmlFor={`flexSwitchCheck_${idx}`}>
                                            Show conversation history
                                        </label>
                                    </div>
                                )}

                            </div>
                        </td>


                    </tr>
                ))}
            </tbody>
        </table>

        {selectedUsers.length !== 0 &&
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
                    <button className="btn btn-success btn-sm ms-2 w-md" type="submit" onClick={() => { handleSaveClick() }} >
                        Import
                    </button>
                </div>
            </footer>
        }
    </div>);
}

export default ImportUser;