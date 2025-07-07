import React, { useState, useEffect } from "react";
import { Toast, ToastBody, ToastHeader } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import ChatBox from "./chatBox";
import ChatInputSection from "./chatInput";
import { getAplnMessages, addAplnMessages, updateAplnData, setValidUser, setAplnAuditLocationAplnData } from "../../../toolkitStore/Auditvista/aplnfollowup/aplnflwupslice"
import socket, { aplnJoinRoom } from "../../../helpers/socket"
import store from '../../../store'

const Conversation = ({
    selectedCheckpoint,
    selectedApln,
    endpointData,
    userData,
    connectedRoomUsers,
    showUserPanel,

}) => {

    const dispatch = useDispatch();

    const { aplnMessages } = useSelector(state => state.acplnFollowUpSliceReducer)
    const [selectedMessage, setSelectedMessage] = useState(null)
    const followUpSlice = useSelector(state => state.acplnFollowUpSliceReducer)
    const validUser = followUpSlice.validUser
    const [toast, setToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('message received!!!');


    useEffect(() => {

        if (socket) {
            socket.on("acpln_status", msg => {
                if (msg.msg.tk_checkpoint_id !== undefined) {

                    var data = {
                        checkpoint_id: msg.msg.tk_checkpoint_id,
                        actionplan_id: msg.msg._id,
                        task_status: msg.msg.task_status,
                        task_percentage: msg.msg.task_completion_perc,
                        task_modified_by: msg.msg.task_modified_by,
                        task_modifier_name: msg.msg.task_modifier_name,
                        task_users: msg.msg?.task_users === undefined ? selectedApln.task_users : msg.msg.task_users
                    }
                    const validUser = msg.msg?.task_users.filter(item => item.user_id === userData.user_data._id)
                    dispatch(setValidUser(validUser))
                }

                else {
                    var followUpSlicefromstore = store.getState().acplnFollowUpSliceReducer

                    if (followUpSlicefromstore.selectedActionplan._id === msg.msg.task_id) {
                        dispatch(addAplnMessages(msg.msg))
                    }
                    var data
                    if (msg.msg.message_type === "3") {
                        data = {
                            checkpoint_id: msg.msg.task_checkpoint_id,
                            actionplan_id: msg.msg.task_id,

                        }
                        data["task_status"] = msg.msg.task_status
                        data["task_modified_by"] = msg.msg.task_modified_by
                        data["task_modifier_name"] = msg.msg.task_modifier_name
                        data["task_users"] = msg?.task_users === undefined ? selectedApln.task_users : msg.task_users

                    }
                    else {
                        data = {
                            checkpoint_id: msg.msg.task_checkpoint_id,
                            actionplan_id: msg.msg.task_id,
                            task_status: msg.task_info.length > 0 ? msg.task_info[0]["task_status"] : msg.msg.task_status,
                            task_percentage: msg.msg.message_type === "3" ? selectedApln.task_completion_perc : msg.msg.task_percentage,
                            task_modified_by: msg.msg.task_modifier_id,
                            task_modifier_name: msg.msg.task_modifier_name,
                            task_users: msg?.task_users === undefined ? selectedApln.task_users : msg.task_users
                        }
                    }
                    if (msg.msg.task_status !== undefined && msg.msg.task_status.length > 0) {
                        var locationInfo = {
                            locationInfo: msg.msg.location_status
                        }
                        dispatch(setAplnAuditLocationAplnData(locationInfo))
                    }
                }

                dispatch(updateAplnData(data))
            })
        }

        return () => { }

    }, [socket])


    useEffect(() => {

        if (selectedApln) {
            if (validUser.length > 0) {
                userData["user_status"] = validUser[0].user_status
            }
            dispatch(getAplnMessages(endpointData, selectedApln._id, selectedApln))
            validUser[0].user_status !== "2" && aplnJoinRoom(selectedApln, userData)
            setSelectedMessage(null)
        }

    }, [dispatch, selectedApln])


    const toggleToast = () => {
        setToast(!toast);
    };

    return (
        <div>
            <ChatBox
                selectedCheckpoint={selectedCheckpoint}
                selectedActionplan={selectedApln}
                messages={aplnMessages}
                userData={userData}
                connectedRoomUsers={connectedRoomUsers}
                showUserPanel={() => { showUserPanel() }}
                endpointData={endpointData}
                selectedContent={(msg, mode) => {
                    setSelectedMessage({
                        message: msg,
                        mode: mode
                    })
                }}
                userFacilities={validUser.length > 0 ? validUser[0]["facilities"] : []}
            />

            {
                validUser[0]?.user_status !== "1" && validUser[0]?.user_status !== "2" 
                && selectedApln && (selectedApln.task_status !== "3")
                &&
                <ChatInputSection
                    selectedCheckpoint={selectedCheckpoint}
                    selectedActionplan={selectedApln}
                    userData={userData}
                    endpointData={endpointData}
                    selectedContent={selectedMessage}
                    clearAll={() => {
                        setSelectedMessage(null)
                    }}
                    userFacilities={validUser.length > 0 ? validUser[0]["facilities"] : []}

                />
            }

            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: "1005" }}>
                <Toast isOpen={toast}>
                    <ToastHeader toggle={toggleToast}>
                        NOTIFICATION!
                    </ToastHeader>
                    <ToastBody>
                        {toastMessage}
                    </ToastBody>
                </Toast>
            </div>
        </div>
    )
}

export default Conversation