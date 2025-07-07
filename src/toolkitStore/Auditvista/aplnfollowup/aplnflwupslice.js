import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import urlSocket from "../../../helpers/urlSocket";
import { emitAplnProgress, emitLeftRemoveUser } from '../../../helpers/socket'

const initialActionState = {
    aplnAuditList: null,
    aplnAuditLocationList: null,
    aplnAuditLocationAplnList: null,
    aplnAuditLocationAplnStatus: null,
    aplnMessages: null,
    aplnRequestLoading: false,
    aplnRequestError: null,
    aplnRequestSuccess: false,
    userInfo: [],
    emailExist: false,
    phoneNumExist: false,
    existUser: null,
    validUser: [],
    selectedUser: null,
    selectedActionplan: null
}

const acplnFollowUpSlice = createSlice({
    name: "acplnFlwupSlice",
    initialState: initialActionState,
    reducers: {
        setAplnAuditData: (state, action) => {
            state.aplnAuditList = action.payload
        },
        setAplnAuditLocationData: (state, action) => {
            state.aplnAuditLocationList = action.payload
        },
        setAplnAuditLocationAplnData: (state, action) => {
            if (action.payload.data !== undefined) {
                state.aplnAuditLocationAplnList = action.payload.data
            }
            if (action.payload.locationInfo !== undefined) {
                if (action.payload.locationInfo[0]?.status_info !== undefined) {
                    var finalData = action.payload.locationInfo[0].status_info.filter((ele, idx) => {
                        if (ele.id < 6) {
                            return ele
                        }

                    })
                    state.aplnAuditLocationAplnStatus = finalData
                }
            }
        },
        updateAplnData: (state, action) => {
            var getAplnList = [...state.aplnAuditLocationAplnList]
            var getCheckPoint = _.filter(getAplnList, { _id: action.payload.checkpoint_id })[0]
            if (getCheckPoint?.action_plan) {
                var getActionPlan = _.filter(getCheckPoint.action_plan, { _id: action.payload.actionplan_id })[0]
                getActionPlan.task_status = action.payload.task_status
                if (action.payload.task_percentage !== undefined) {
                    getActionPlan.task_completion_perc = action.payload.task_percentage
                }
                getActionPlan.task_modified_by = action.payload.task_modified_by
                getActionPlan.task_modifier_name = action.payload.task_modifier_name
                getActionPlan.task_users = action.payload.task_users
                getActionPlan.unreadCount = action.payload.unread
                var getAcplnIndex = _.findIndex(getCheckPoint.action_plan, { _id: action.payload.actionplan_id })
                if (getAcplnIndex !== -1) { getCheckPoint.action_plan[getAcplnIndex] = getActionPlan }
                var getCheckPointIndex = _.findIndex(getAplnList, { _id: action.payload.checkpoint_id })
                if (getCheckPointIndex !== -1) { getAplnList[getCheckPointIndex] = getCheckPoint }
                state.aplnAuditLocationAplnList = [...getAplnList]
            }

        },
        setAplnMessages: (state, action) => {
            state.aplnMessages = action.payload
        },

        addAplnMessages: (state, action) => {
            var msgs = [...state.aplnMessages];
            const index = msgs.findIndex(msg => msg._id === action.payload._id);
            if (index !== -1) {
                msgs[index] = { ...msgs[index], ...action.payload };
            } else {
                msgs.push(action.payload);
            }
            state.aplnMessages = msgs;
        },

        setAplnRequestLoading: (state, action) => {
            state.aplnRequestLoading = action.payload
        },
        setAplnRequestError: (state, action) => {
            state.aplnRequestError = action.payload
        },
        resetAplnRequestState: (state, action) => {
            state.aplnAuditList = null
            state.aplnRequestLoading = false,
                state.aplnRequestError = null
        },
        resetAplnMessages: (state, action) => {
            state.aplnMessages = null
        },
        setCreatedUser: (state, action) => {
            state.userInfo = action.payload
        },
        setEmailExist: (state, action) => {
            state.emailExist = action.payload
        },
        setphoneNumExist: (state, action) => {
            state.phoneNumExist = action.payload
        },
        setExistUserData: (state, action) => {
            state.existUser = action.payload
        },
        setValidUser: (state, action) => {
            state.validUser = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
        setSelectedActionplan: (state, action) => {
            state.selectedActionplan = action.payload
        },

    }
})



export const crudNewUser = createAsyncThunk(
    'user/crudNewUser',
    async (values, { dispatch }) => {
        try {
            const authUser = JSON.parse(sessionStorage.getItem("authUser"))

            dispatch(setAplnRequestLoading(true));
            const responseData = await urlSocket.post('cog/cruduser', {
                user_info: values,
                encrypted_db_url: authUser.db_info.encrypted_db_url,
            });
            if (responseData.status === 200) {
                dispatch(setCreatedUser(responseData.data.admn_user));
            } else {
                dispatch(setAplnRequestError(responseData.statusText));
            }
            dispatch(setAplnRequestLoading(false));
        } catch (error) {
            console.log("catch error", error);
            dispatch(setAplnRequestLoading(false));
        }
    }
);



export const updateUserStatus = (taskUser, apln_id, selectedActionplan, selectedCheckpoint, locationInfo) => {
    return async dispatch => {
        try {
            const userData = JSON.parse(sessionStorage.getItem("authUser"));
            const responseData = await urlSocket.post("task/update-task-user-info", {
                encrypted_db_url: userData.db_info.encrypted_db_url,
                apln_id: apln_id,
                task_user_info: taskUser,

            })
            if (responseData.status === 200) {
                const selected_content = "import_user"
                const value = `${userData.user_data.firstname} added ${taskUser.name} `
                var selectedActionplanInfo = _.cloneDeep(selectedActionplan)
                selectedActionplanInfo["task_users"] = responseData.data.data[0]["task_users"]
                emitAplnProgress(selectedActionplanInfo, selectedCheckpoint, userData, value, locationInfo, selected_content, '', responseData)
            }

        } catch (error) {
            console.log("catch error", error)
        }
    }
}





export const checkUserAvailableApi = (values, mode) => {
    return async dispatch => {

        try {
            dispatch(setAplnRequestLoading(true))
            const responseData = await urlSocket.post("cog/check-user-exist", { admn_info: values })
            if (mode == 1) {
                if (responseData.data.response_code === 504 && responseData.data.message === "Email Id already exist for another user") {
                    dispatch(setEmailExist(true))
                }
                else {
                    dispatch(setEmailExist(false))
                }
            }
            if (mode == 2) {
                if (responseData.data.response_code === 504 && responseData.data.message === "Email Id already exist for another user") {
                    dispatch(setphoneNumExist(true))
                }
                else {
                    dispatch(setphoneNumExist(false))
                }
            }

            dispatch(setAplnRequestLoading(false))
            dispatch(setExistUserData(responseData.data.data.length > 0 ? responseData.data.data[0] : null))
            return responseData.data.data

        } catch (error) {
            console.log("catch error", error);
        }
    }
}

export const getAplnAuditData = () => {




    return async (dispatch) => {
        try {
            dispatch(setAplnRequestLoading(true))
            const userData = await JSON.parse(sessionStorage.getItem("authUser"));
            const dbInfo = await JSON.parse(sessionStorage.getItem("db_info"));


            const responseData = await urlSocket.post("task/acp-audits", {
                encrypted_db_url: dbInfo.encrypted_db_url,
                _id: userData.user_data._id,
            })
            if (responseData.status === 200) {
                dispatch(setAplnAuditData(responseData.data.data))
            }
            else {
                dispatch(setAplnRequestError(responseData.statusText))
            }

            dispatch(setAplnRequestLoading(false))


        } catch (error) {
            console.log("catch error", error);
        }
    }
}

export const getAplnAuditLocationData = (auditData) => {
    return async dispatch => {
        try {
            dispatch(setAplnRequestLoading(true))
            const userData = JSON.parse(sessionStorage.getItem("authUser"));
            const dbInfo = JSON.parse(sessionStorage.getItem("db_info"));
            const responseData = await urlSocket.post('task/acp-location-data', {
                encrypted_db_url: dbInfo.encrypted_db_url,
                activity_id: auditData.activity_id,
                acplan_id: auditData.task_user_id,
                user_id: userData.user_data._id
            })
            if (responseData.status === 200) {

                dispatch(setAplnAuditLocationData(responseData.data.data))
            }
            else {
                dispatch(setAplnRequestError(responseData.statusText))
            }

            dispatch(setAplnRequestLoading(false))


        } catch (error) {
            console.log("catch error", error);
        }
    }
}

export const getAuditLocationAplnData = (endpointData) => {
    return async dispatch => {
        try {
            dispatch(setAplnRequestLoading(true))
            const userData = JSON.parse(sessionStorage.getItem("authUser"));
            const dbInfo = JSON.parse(sessionStorage.getItem("db_info"));
            const responseData = await urlSocket.post('task/create-ac-plan-datas', {
                encrypted_db_url: dbInfo.encrypted_db_url,
                ep_pbd_ref_id: endpointData.location_pbd_id,
                audit_pbd_name: endpointData.activity_name,
                activity_pbd_id: endpointData.activity_pbd_id,
                endpoint_data: endpointData,
                user_id: userData.user_data._id
            })

            if (responseData.status === 200) {
                dispatch(setAplnAuditLocationAplnData(responseData.data))
            }
            else {
                dispatch(setAplnRequestError(responseData.statusText))
            }

            dispatch(setAplnRequestLoading(false))


        } catch (error) {
            console.log("catch error", error);
        }
    }
}



export const removeAplnUser = (userArray, acplnid, selectedApln, selectedCheckpoint, locationInfo) => {
    return async dispatch => {
        dispatch(setAplnRequestLoading(true))
        try {
            const userData = JSON.parse(sessionStorage.getItem("authUser"));
            const dbInfo = JSON.parse(sessionStorage.getItem("db_info"));
            const responseData = await urlSocket.post('task/remove-apln-user', {
                encrypted_db_url: dbInfo.encrypted_db_url,
                user_id: userData.user_data._id,
                actionplan_id: acplnid,
                userArray: userArray
            })

            const value = userArray.user_status === "2" ? `${userArray.name} left` : `${userArray.name} removed by ${userData.user_data.firstname}`;
            const selected_content = userArray.user_status === "2" ? "left_user" : "remove_user"

            if (responseData.status === 200) {
                emitLeftRemoveUser(selectedApln, selectedCheckpoint, userData, value, locationInfo, selected_content, '', responseData.data.data)
            }
            else {
                dispatch(setAplnRequestError(responseData.statusText))
            }
        } catch (error) {
            console.log("error", error)
        }
        dispatch(setAplnRequestLoading(false))
    }

}

export const getAplnMessages = (endpointData, selectedAplnId, selectedApln) => {
    const userData = JSON.parse(sessionStorage.getItem("authUser"));

    var userInfo = _.filter(selectedApln.task_users, { "user_id": userData.user_data._id })[0]
    var auditInfo = JSON.parse(sessionStorage.getItem("auditData"))

    return async dispatch => {
        try {
            dispatch(setAplnRequestLoading(true))
            const dbInfo = JSON.parse(sessionStorage.getItem("db_info"));
            const responseData = await urlSocket.post('task/get-room-messages', {
                encrypted_db_url: dbInfo.encrypted_db_url,
                encrypted_db_url: dbInfo.encrypted_db_url,
                ep_pbd_ref_id: endpointData.location_pbd_id,
                audit_pbd_name: endpointData.activity_name,
                activity_pbd_id: endpointData.activity_pbd_id,
                endpoint_data: endpointData,
                user_id: userData.user_data._id,
                task_id: selectedAplnId,
                user: userInfo,
                auditInfo: {
                    createdAt: auditInfo.createdAt,
                    history_permisson: auditInfo.history_permisson,
                }

            })
            if (responseData.status === 200) {
                dispatch(setAplnMessages(responseData.data.data))
            }
            else {
                dispatch(setAplnRequestError(responseData.statusText))
            }

            dispatch(setAplnRequestLoading(false))

        } catch (error) {
            console.log("catch error", error);
        }
    }
}


export const updtPublishedLocation = (locationInfo, sessionUserInfo, rolePermisson, historyPermission, selectedActionplan, selectedCheckpoint) => {

    return async dispatch => {

        locationInfo["ref_id"] = locationInfo.location_master_id
        locationInfo["created_info"] = locationInfo.created_user


        var activity_data = {
            activity_name: locationInfo.activity_name,
            activity_id: locationInfo.activity_id,
            activity_pbd_id: locationInfo.activity_pbd_id,
            activity_master_id: locationInfo.activity_master_id,
            assigned_by: sessionUserInfo.user_data._id,
            assigner_name: sessionUserInfo.user_data.firstname,
            location_permission_acpln: locationInfo.location_permission_acpln,
            task_user_name: locationInfo.recent_user.firstname,
            task_user_id: locationInfo.recent_user._id,
            task_user_role: rolePermisson.role_name,
            history_permisson: historyPermission,
            location_pbd_id: locationInfo.location_pbd_id,
            action_id: selectedActionplan.action_id,
        }

        try {
            dispatch(setAplnRequestLoading(true))
            const responseData = await urlSocket.post("task/update-published-location-for-task", {
                locationInfo: locationInfo,
                encrypted_db_url: sessionUserInfo.db_info.encrypted_db_url,
                mode: "1",
                endpointInfo: activity_data,
                checkpoint_id: selectedActionplan.tk_checkpoint_id,
                action_id: selectedActionplan._id,
                task_id: selectedActionplan._id,
                created_user: locationInfo.created_user,
                userInfo: {
                    encrypted_db_url: sessionUserInfo.db_info.encrypted_db_url,
                },
            })
            if (responseData.status === 200) {
                const selected_content = "import_user"
                const value = `${sessionUserInfo.user_data.firstname} added ${locationInfo.created_user.name} `
                var selectedActionplanInfo = _.cloneDeep(selectedActionplan)
                selectedActionplanInfo["task_users"] = responseData.data.data[0]["task_users"]
                emitAplnProgress(selectedActionplanInfo, selectedCheckpoint, sessionUserInfo, value, locationInfo, selected_content, '', responseData)
            }
            else {
                dispatch(setAplnRequestError(responseData.statusText))
            }
            dispatch(setAplnRequestLoading(false))


        } catch (error) {
            console.log("catch error", error);
        }
    }
}



export const addActionPlanUser = (data, selectedApln, selectedCheckpoint, locationInfo) => {

    return async dispatch => {
        const userData = JSON.parse(sessionStorage.getItem("authUser"));
        try {
            dispatch(setAplnRequestLoading(true))
            const responseData = await urlSocket.post("task/create-acpln-multiple-user", { data })
            if (responseData.status === 200) {
                const selected_content = "import_user"
                const addedMembersMessage = data.selectedUsers.map(member => member.name).join(", ");
                const value = `${userData.user_data.firstname} added ${addedMembersMessage} `
                var selectedAplnInfo = _.cloneDeep(selectedApln)
                selectedAplnInfo["task_users"] = responseData.data.data[0]["task_users"]
                emitAplnProgress(selectedAplnInfo, selectedCheckpoint, userData, value, locationInfo, selected_content, '', responseData.data)
            }
            dispatch(setAplnRequestLoading(false))

        } catch (error) {
            console.log("catch error", error)
        }

    }
}

export const {
    setAplnAuditData,
    setAplnAuditLocationData,
    setAplnAuditLocationAplnData,
    updateAplnData,
    setAplnMessages,
    addAplnMessages,
    setAplnRequestLoading,
    setAplnRequestError,
    resetAplnRequestState,
    resetAplnMessages,
    setCreatedUser,
    setEmailExist,
    setphoneNumExist,
    setExistUserData,
    setValidUser,
    setSelectedUser,
    setSelectedActionplan
} = acplnFollowUpSlice.actions;

export default acplnFollowUpSlice.reducer;