import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedUser } from '../../../toolkitStore/Auditvista/aplnfollowup/aplnflwupslice';
import { emitchangerole } from '../../../helpers/socket';


const UserRoleInformation = (props) => {
    const dispatch = useDispatch()
    const [configuredRoleInfo, setconfiguredRoleInfo] = useState([])

    const followUpSlice = useSelector(state => state.acplnFollowUpSliceReducer)
    const seletedUser = followUpSlice.selectedUser
    const facilities = useMemo(() => _.filter(seletedUser.facilities, { role_status: true }))

    useEffect(() => {
        var roleInfo = JSON.parse(sessionStorage.getItem("authUser")).config_data.action_plan_roles

        var roleInfo = roleInfo.filter((e) => {
            if (e.id >= followUpSlice.validUser[0].id) {
                return e
            }
        })

        setconfiguredRoleInfo(roleInfo)

    }, [])


    const handleChange = (event, item) => {

        const getIndex = _.findIndex(seletedUser.facilities, { id: item.id })
        if (getIndex !== -1) {
            var facilityData = [...seletedUser.facilities]
            facilityData[getIndex] = {
                ...facilityData[getIndex],
                checked: event.target.checked
            }

            const updatedUserInfo = {
                ...seletedUser,
                facilities: facilityData

            }
            dispatch(setSelectedUser(updatedUserInfo))
            emitchangerole(props.selectedApln, updatedUserInfo)
        }
    }



    const changeUserRole = (event) => {
        var getRoleInfo = _.filter(configuredRoleInfo, { id: Number(event.target.value) })
        if (getRoleInfo.length > 0) {
            const updatedSeletedUser = {
                ...seletedUser,
                facilities: getRoleInfo[0].facilities,
                id: getRoleInfo[0].id,
                role_name: getRoleInfo[0].role_name,
            };
            dispatch(setSelectedUser(updatedSeletedUser))
            emitchangerole(props.selectedApln, updatedSeletedUser)
        }
    }


    return (
        <div>
            <div className='p-2'>


                <div className='mb-1'>Change Role</div>
                <select
                    className="form-select m-0"
                    style={{
                        padding: "0.47rem 0rem 0.4rem 0.75rem;",
                        borderRadius: 25
                    }}
                    value={seletedUser.id}
                    onChange={(e) => { changeUserRole(e) }}>
                    {
                        configuredRoleInfo.map((data, pos) => {
                            return (
                                <option key={pos} value={data.id} >{data.role_name}</option>
                            )
                        })
                    }
                </select>

            </div>
            <div className='p-2'>
                <div className='mb-1'>Facilities</div>
                <div className="form-check m-0 p-0">
                    {
                        facilities.map((data, index) => {
                            return (
                                <div
                                    key={"fcts" + index}
                                    className={` mb-2 px-2 py-1 d-inline-block me-2 
                                    ${data?.checked === undefined || data?.checked === true ? "bg-success text-white" : "bg-secondary text-white"}`}
                                    style={{ borderRadius: 25 }}
                                >
                                    <div className="form-switch form-check-secondary"
                                    >
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`customCheck-outlinecolor${index}`}
                                            checked={data?.checked === undefined || data?.checked === true}
                                            onClick={(e) => {
                                                handleChange(e, data)
                                            }}
                                        />
                                        <label
                                            className="form-check-label font-size-11"
                                            style={{ fontWeight: 300, fontStyle: "italic" }}
                                            htmlFor={`customCheck-outlinecolor${index}`}
                                        >
                                            {data.role_name}
                                        </label>


                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='p-2'>
                <button className='btn btn-sm btn-outline-secondary btn-rounded' onClick={() => {
                    props.onClose()
                }}>Close</button>
            </div>

        </div>);
}


export default UserRoleInformation;