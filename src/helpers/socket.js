import io from "socket.io-client";
import store from "../store";



// const socket = io.connect('http://localhost:8050/', {
const socket = io.connect('https://auditvista.com/', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity
});

const onSocketConnection = async (authUser) => {

    socket.connect();

    socket.on('connect', () => {
        console.log('Socket connected to server');
    });

    socket.on("connect_error", (error) => {
        console.log("Connection error:", error);
    });

    socket.emit("task_user_info", authUser);

}

// -------- Acpln --------------

const aplnJoinRoom = (aplnInfo, userData) => {
    var newRoom = { _id: aplnInfo._id }
    var userdata = {
        firstname: userData.user_data.firstname,
        _id: userData.user_data._id,
        user_status: userData.user_status,
        email_id: userData.user_data.email_id
    }
    socket.emit("join room", { newRoom, userdata })
}

const aplnGetRoomUsers = (aplnInfo) => {
    var newRoom = aplnInfo._id
    socket.emit
}

const determineMediaType = (message) => {

    if (message.text !== '') {
        return '0';
    } else if (message.image !== '') {
        return '1';
    } else if (message.video !== '') {
        return '2';
    } else if (message.audio !== '') {
        return '3';
    } else if (message.recorded_audio !== '') {
        return '4';
    } else if (message.captured_image !== '') {
        return '5';
    } else if (message.captured_video !== '') {
        return '6';
    } else if (message.attachment !== '') {
        return '7';
    }

    return '';

};

// const locationInfo = JSON.parse(sessionStorage.getItem("endpointData"))


const emitIncidentReport = (
    selectedActionplan,
    userInfo,
    value,
    emitAs,
    selectedContent,
    mediaContent
) => {
    console.log("value", value, emitAs, selectedContent)


    const messageToUsers = selectedActionplan.task_users.filter(item => item.name !== userInfo.user_data.firstname);
    const userInfoArray = messageToUsers.map(ele => ({
        user_id: ele.user_id,
        user_name: ele.name,
        delivery_status: 'pending',
        deliverd_on: null,
        viewed_status: false,
        viewed_on: null,
        selected_option: 'option1',
    }));

    var messageData;
    if (emitAs === "text_message" && !selectedContent) {

        messageData = {
            task_id: selectedActionplan._id,
            message_from: userInfo.user_data.firstname,
            message_to: userInfoArray,
            message: {
                text: value,
            },
            message_type: '0',
            media_type: determineMediaType({
                text: value,
            }),
            task_user_name: userInfo.user_data.firstname,
            task_user_id: userInfo.user_data._id,
            task_user_role: userInfo.user_data.role_name,
            task_status: selectedActionplan.task_status,
            task_percentage: selectedActionplan.task_completion_perc,
            task_modifier_id: selectedActionplan.task_modified_by,
            task_modifier_name: selectedActionplan.task_modifier_name,
        };

    }
    else if (emitAs === "text_message" && selectedContent.mode === "Reply") {

        messageData = {
            task_id: selectedActionplan._id,
            message_from: userInfo.user_data.firstname,
            message_to: userInfoArray,
            message: {
                text: value,
                replied_msg: selectedContent.message
            },

            // 0:send message, 1:forwarded, 2:replied, 3:deleted , 4:edited
            message_type: "2",
            media_type: determineMediaType({
                text: value,
            }),
            task_user_name: userInfo.user_data.firstname,
            task_user_id: userInfo.user_data._id,
            task_user_role: userInfo.user_data.role_name,
            task_status: selectedActionplan.task_status,
            task_percentage: selectedActionplan.task_completion_perc,
            task_modifier_id: selectedActionplan.task_modified_by,
            task_modifier_name: selectedActionplan.task_modifier_name,
        };

    }

    else if (emitAs === "import_user") {
        messageData = {
            task_id: selectedActionplan._id,
            message_from: userInfo.user_data.firstname,
            message_to: userInfoArray,
            message: {
                text: value,
            },

            media_type: determineMediaType({
                text: value,
            }),
            message_type: "7",
            task_user_name: userInfo.user_data.firstname,
            task_user_id: userInfo.user_data._id,
            task_user_role: userInfo.user_data.role_name,
            task_status: selectedActionplan.task_status,
            task_percentage: selectedActionplan.task_completion_perc,
            task_modifier_id: selectedActionplan.task_modified_by,
            task_modifier_name: selectedActionplan.task_modifier_name,
        };
    }





    else if (emitAs === "close_apln") {

        messageData = {
            task_id: selectedActionplan._id,
            message_from: userInfo.user_data.firstname,
            message_to: userInfoArray,
            task_modifier_id: userInfo.user_data._id,
            task_modifier_name: userInfo.user_data.firstname,
            task_user_name: userInfo.user_data.firstname,
            task_user_id: userInfo.user_data._id,
            task_user_role: userInfo.user_data.role_name,
            task_status: "3",
            task_percentage: value
        };
    }

    else if (emitAs === "text_message" && selectedContent.mode === "Delete") {
        messageData = {
            task_id: selectedActionplan._id,
            message_from: userInfo.user_data.firstname,
            message_to: userInfoArray,
            message: {
                text: value,
            },
            message_type: '0',
            media_type: determineMediaType({
                text: value,
            }),
            task_user_name: userInfo.user_data.firstname,
            task_user_id: userInfo.user_data._id,
            task_user_role: userInfo.user_data.role_name,
            task_status: selectedActionplan.task_status,
            task_percentage: selectedActionplan.task_completion_perc,
            task_modifier_id: selectedActionplan.task_modified_by,
            task_modifier_name: selectedActionplan.task_modifier_name,
        };

    }

    else if (emitAs === "change_progress") {


        messageData = {
            task_id: selectedActionplan._id,
            message_from: userInfo.user_data.firstname,
            message_to: userInfoArray,
            task_modifier_id: userInfo.user_data._id,
            task_modifier_name: userInfo.user_data.firstname,
            task_user_name: userInfo.user_data.firstname,
            task_user_id: userInfo.user_data._id,
            task_user_role: userInfo.user_data.role_name,
            task_status: value === 0 ? "0" : value > 0 && value <= 90 ? "1" : value > 90 && "2",
            task_percentage: value,
            message_type: "8"
            // user_id : userInfo.user_data._id
        };


        console.log("messageData", messageData)
    }
    else if (emitAs === "image") {
        messageData = {
            task_id: selectedActionplan._id,
            message_from: userInfo.user_data.firstname,
            message_to: userInfoArray,
            message: {
                text: value,
                image: [mediaContent],
            },
            message_type: "0",
            media_type: "1",
            task_user_name: userInfo.user_data.firstname,
            task_user_id: userInfo.user_data._id,
            task_user_role: userInfo.user_data.role_name,
            task_status: selectedActionplan.task_status,
            task_percentage: selectedActionplan.task_completion_perc,
            task_modifier_id: selectedActionplan.task_modified_by,
            task_modifier_name: selectedActionplan.task_modifier_name,
        };
    }

    else if (emitAs === "video") {
        messageData = {
            task_id: selectedActionplan._id,
            message_from: userInfo.user_data.firstname,
            message_to: userInfoArray,
            message: {
                text: value,
                video: [mediaContent],
            },

            message_type: "0",
            media_type: "2",
            task_user_name: userInfo.user_data.firstname,
            task_user_id: userInfo.user_data._id,
            task_user_role: userInfo.user_data.role_name,
            task_status: selectedActionplan.task_status,
            task_percentage: selectedActionplan.task_completion_perc,
            task_modifier_id: selectedActionplan.task_modified_by,
            task_modifier_name: selectedActionplan.task_modifier_name,
        };
    }
    else if (emitAs === "audio") {
        messageData = {
            task_id: selectedActionplan._id,
            message_from: userInfo.user_data.firstname,
            message_to: userInfoArray,
            message: {
                text: value,
                audio: mediaContent,
            },

            // 0:send message, 1:forwarded, 2:replied, 3:deleted , 4:edited
            message_type: "0",
            media_type: "3",
            task_user_name: userInfo.user_data.firstname,
            task_user_id: userInfo.user_data._id,
            task_user_role: userInfo.user_data.role_name,
            task_status: selectedActionplan.task_status,
            task_percentage: selectedActionplan.task_completion_perc,
            task_modifier_id: selectedActionplan.task_modified_by,
            task_modifier_name: selectedActionplan.task_modifier_name,
        };
    }
    else if (emitAs === "document") {
        messageData = {
            task_id: selectedActionplan._id,
            message_from: userInfo.user_data.firstname,
            message_to: userInfoArray,
            message: {
                text: value,
                attachment: [mediaContent],
            },

            // 0:send message, 1:forwarded, 2:replied, 3:deleted , 4:edited
            message_type: "0",
            media_type: "7",
            task_user_name: userInfo.user_data.firstname,
            task_user_id: userInfo.user_data._id,
            task_user_role: userInfo.user_data.role_name,
            task_status: selectedActionplan.task_status,
            task_percentage: selectedActionplan.task_completion_perc,
            task_modifier_id: selectedActionplan.task_modified_by,
            task_modifier_name: selectedActionplan.task_modifier_name,
        };
    }

    try {

        const db_info = JSON.parse(sessionStorage.getItem("db_info"));

        const data = {
            encrypted_db_url: db_info.encrypted_db_url,
            messageData: messageData,
            user_id: userInfo.user_data._id,
        }

        console.log("data", data, store.getState().incdreportslice)

        socket.emit("ir_progress_status", data)

    } catch (error) {
        console.log("catch error", error)
    }


}


const IRJoinRoom = (aplnInfo, userData) => {
    var newRoom = { _id: aplnInfo._id }
    var userdata = {
        firstname: userData.user_data.firstname,
        _id: userData.user_data._id,
        user_status: userData.user_status,
        email_id: userData.user_data.email_id
    }
    socket.emit("ir_join_room", { newRoom, userdata })
}








const emitLeftRemoveUser = (
    selectedActionplan,
    selectedCheckpoint,
    userInfo,
    value,
    locationInfo,
    emitAs,
    selectedContent,
    mediaContent
) => {
    const messageToUsers = selectedActionplan.task_users.filter(item => item.name !== userInfo.user_data.firstname);
    let userInfoArray = messageToUsers.map(ele => ({
        user_id: ele.user_id,
        user_name: ele.name,
        delivery_status: 'pending',
        deliverd_on: null,
        viewed_status: false,
        viewed_on: null,
        selected_option: 'option1',
    }));
    var messageData;


    if (emitAs === "remove_user") {
        messageData = {
            task_id: selectedActionplan._id,
            task_checkpoint_id: selectedCheckpoint._id,
            message_from: userInfo.user_data.firstname,
            message_to: userInfoArray,
            message: {
                text: value,
            },

            media_type: determineMediaType({
                text: value,
            }),
            message_type: "6",
            task_user_name: userInfo.user_data.firstname,
            task_user_id: userInfo.user_data._id,
            task_user_role: userInfo.user_data.role_name,
            task_status: selectedActionplan.task_status,
            task_percentage: selectedActionplan.task_completion_perc,
            task_modifier_id: selectedActionplan.task_modified_by,
            task_modifier_name: selectedActionplan.task_modifier_name,
        };
    }
    else if (emitAs === "left_user") {
        messageData = {
            task_id: selectedActionplan._id,
            task_checkpoint_id: selectedCheckpoint._id,
            message_from: userInfo.user_data.firstname,
            message_to: userInfoArray,
            message: {
                text: value,
            },

            media_type: determineMediaType({
                text: value,
            }),
            message_type: "7",
            task_user_name: userInfo.user_data.firstname,
            task_user_id: userInfo.user_data._id,
            task_user_role: userInfo.user_data.role_name,
            task_status: selectedActionplan.task_status,
            task_percentage: selectedActionplan.task_completion_perc,
            task_modifier_id: selectedActionplan.task_modified_by,
            task_modifier_name: selectedActionplan.task_modifier_name,
        };
    }



    const db_info = JSON.parse(sessionStorage.getItem("db_info"));

    const data = {
        encrypted_db_url: db_info.encrypted_db_url,
        messageData: messageData,
        location_id: locationInfo._id,
        user_id: userInfo.user_data._id,
        activity_id: locationInfo.activity_id,
        auditName: locationInfo.activity_name,
        locationName: locationInfo.location_name,
        actionPlanName: selectedActionplan.action


    }

    console.log("data", data)

    socket.emit("apln_progress_status", data)
}



const emitAplnProgress = (
    selectedActionplan,
    selectedCheckpoint,
    userInfo,
    value,
    locationInfo,
    emitAs,
    selectedContent,
    mediaContent
) => {

    const messageToUsers = selectedActionplan.task_users.filter(item => item.name !== userInfo.user_data.firstname);

    let userInfoArray = messageToUsers.filter(item => {
        return item.user_status === "0"
    });

    userInfoArray = userInfoArray.map(ele => ({
        user_id: ele.user_id,
        user_name: ele.name,
        delivery_status: 'pending',
        deliverd_on: null,
        viewed_status: false,
        viewed_on: null,
        selected_option: 'option1',
    }));

    var messageData;
    console.log(emitAs, 'emitAs')
    if (emitAs === "change_progress") {


        messageData = {
            task_id: selectedActionplan._id,
            task_checkpoint_id: selectedCheckpoint._id,
            message_from: userInfo.user_data.firstname,
            message_to: userInfoArray,
            task_modifier_id: userInfo.user_data._id,
            task_modifier_name: userInfo.user_data.firstname,
            task_user_name: userInfo.user_data.firstname,
            task_user_id: userInfo.user_data._id,
            task_user_role: userInfo.user_data.role_name,
            task_status: value === 0 ? "0" : value > 0 && value <= 90 ? "1" : value > 90 && "2",
            task_percentage: value,
            location_id: locationInfo._id,
            message_type: "8"
        };


        console.log("messageData", messageData)
    }
    else
        if (emitAs === "close_apln") {
            messageData = {
                task_id: selectedActionplan._id,
                task_checkpoint_id: selectedCheckpoint._id,
                message_from: userInfo.user_data.firstname,
                message_to: userInfoArray,
                task_modifier_id: userInfo.user_data._id,
                task_modifier_name: userInfo.user_data.firstname,
                task_user_name: userInfo.user_data.firstname,
                task_user_id: userInfo.user_data._id,
                task_user_role: userInfo.user_data.role_name,
                task_status: "3",
                task_percentage: value,
                command: "close_apln"
            };
        }
        else
            if (emitAs === "text_message" && !selectedContent) {
                console.log("value", value)
                messageData = {
                    task_id: selectedActionplan._id,
                    task_checkpoint_id: selectedCheckpoint._id,
                    message_from: userInfo.user_data.firstname,
                    message_to: userInfoArray,
                    message: {
                        text: value,
                    },

                    // 0:send message, 1:forwarded, 2:replied, 3:deleted , 4:edited
                    message_type: '0',
                    media_type: determineMediaType({
                        text: value,
                    }),
                    task_user_name: userInfo.user_data.firstname,
                    task_user_id: userInfo.user_data._id,
                    task_user_role: userInfo.user_data.role_name,
                    task_status: selectedActionplan.task_status,
                    task_percentage: selectedActionplan.task_completion_perc,
                    task_modifier_id: selectedActionplan.task_modified_by,
                    task_modifier_name: selectedActionplan.task_modifier_name,
                };
            }
            else if (emitAs === "text_message" && selectedContent.mode === "Reply") {
                messageData = {
                    task_id: selectedActionplan._id,
                    message_from: userInfo.user_data.firstname,
                    message_to: userInfoArray,
                    message: {
                        text: value,
                        replied_msg: selectedContent.message
                    },

                    // 0:send message, 1:forwarded, 2:replied, 3:deleted , 4:edited
                    message_type: "2",
                    media_type: determineMediaType({
                        text: value,
                    }),
                    task_user_name: userInfo.user_data.firstname,
                    task_user_id: userInfo.user_data._id,
                    task_user_role: userInfo.user_data.role_name,
                    task_status: selectedActionplan.task_status,
                    task_percentage: selectedActionplan.task_completion_perc,
                    task_modifier_id: selectedActionplan.task_modified_by,
                    task_modifier_name: selectedActionplan.task_modifier_name,
                };
            }

            else if (emitAs === "text_message" && selectedContent) {
                messageData = {
                    task_id: selectedActionplan._id,
                    task_checkpoint_id: selectedCheckpoint._id,
                    message_from: userInfo.user_data.firstname,
                    message_to: userInfoArray,
                    message: {
                        text: value,
                        replied_msg: selectedContent.message
                    },

                    // 0:send message, 1:forwarded, 2:replied, 3:deleted , 4:edited
                    message_type: "2",
                    media_type: determineMediaType({
                        text: value,
                    }),
                    task_user_name: userInfo.user_data.firstname,
                    task_user_id: userInfo.user_data._id,
                    task_user_role: userInfo.user_data.role_name,
                    task_status: selectedActionplan.task_status,
                    task_percentage: selectedActionplan.task_completion_perc,
                    task_modifier_id: selectedActionplan.task_modified_by,
                    task_modifier_name: selectedActionplan.task_modifier_name,
                };
            }
            else if (emitAs === "image") {
                messageData = {
                    task_id: selectedActionplan._id,
                    task_checkpoint_id: selectedCheckpoint._id,
                    message_from: userInfo.user_data.firstname,
                    message_to: userInfoArray,
                    message: {
                        text: value,
                        image: [mediaContent],
                    },

                    message_type: "0",
                    media_type: "1",
                    task_user_name: userInfo.user_data.firstname,
                    task_user_id: userInfo.user_data._id,
                    task_user_role: userInfo.user_data.role_name,
                    task_status: selectedActionplan.task_status,
                    task_percentage: selectedActionplan.task_completion_perc,
                    task_modifier_id: selectedActionplan.task_modified_by,
                    task_modifier_name: selectedActionplan.task_modifier_name,
                };
            }
            else if (emitAs === "video") {
                messageData = {
                    task_id: selectedActionplan._id,
                    task_checkpoint_id: selectedCheckpoint._id,
                    message_from: userInfo.user_data.firstname,
                    message_to: userInfoArray,
                    message: {
                        text: value,
                        video: [mediaContent],
                    },

                    message_type: "0",
                    media_type: "2",
                    task_user_name: userInfo.user_data.firstname,
                    task_user_id: userInfo.user_data._id,
                    task_user_role: userInfo.user_data.role_name,
                    task_status: selectedActionplan.task_status,
                    task_percentage: selectedActionplan.task_completion_perc,
                    task_modifier_id: selectedActionplan.task_modified_by,
                    task_modifier_name: selectedActionplan.task_modifier_name,
                };
            }
            else if (emitAs === "audio") {
                messageData = {
                    task_id: selectedActionplan._id,
                    task_checkpoint_id: selectedCheckpoint._id,
                    message_from: userInfo.user_data.firstname,
                    message_to: userInfoArray,
                    message: {
                        text: value,
                        audio: mediaContent,
                    },

                    // 0:send message, 1:forwarded, 2:replied, 3:deleted , 4:edited
                    message_type: "0",
                    media_type: "3",
                    task_user_name: userInfo.user_data.firstname,
                    task_user_id: userInfo.user_data._id,
                    task_user_role: userInfo.user_data.role_name,
                    task_status: selectedActionplan.task_status,
                    task_percentage: selectedActionplan.task_completion_perc,
                    task_modifier_id: selectedActionplan.task_modified_by,
                    task_modifier_name: selectedActionplan.task_modifier_name,
                };
            }
            else if (emitAs === "document") {
                messageData = {
                    task_id: selectedActionplan._id,
                    task_checkpoint_id: selectedCheckpoint._id,
                    message_from: userInfo.user_data.firstname,
                    message_to: userInfoArray,
                    message: {
                        text: value,
                        attachment: [mediaContent],
                    },

                    message_type: "0",
                    media_type: "7",
                    task_user_name: userInfo.user_data.firstname,
                    task_user_id: userInfo.user_data._id,
                    task_user_role: userInfo.user_data.role_name,
                    task_status: selectedActionplan.task_status,
                    task_percentage: selectedActionplan.task_completion_perc,
                    task_modifier_id: selectedActionplan.task_modified_by,
                    task_modifier_name: selectedActionplan.task_modifier_name,
                };
            }
            else if (emitAs === "import_user") {
                messageData = {
                    task_id: selectedActionplan._id,
                    task_checkpoint_id: selectedCheckpoint._id,
                    message_from: userInfo.user_data.firstname,
                    message_to: userInfoArray,
                    message: {
                        text: value,
                    },

                    media_type: determineMediaType({
                        text: value,
                    }),
                    message_type: "7",
                    task_user_name: userInfo.user_data.firstname,
                    task_user_id: userInfo.user_data._id,
                    task_user_role: userInfo.user_data.role_name,
                    task_status: selectedActionplan.task_status,
                    task_percentage: selectedActionplan.task_completion_perc,
                    task_modifier_id: selectedActionplan.task_modified_by,
                    task_modifier_name: selectedActionplan.task_modifier_name,
                };
            }

    try {

        const db_info = JSON.parse(sessionStorage.getItem("db_info"));

        const data = {
            encrypted_db_url: db_info.encrypted_db_url,
            messageData: messageData,
            location_id: locationInfo._id,
            user_id: userInfo.user_data._id,
            activity_id: locationInfo.activity_id,
            auditName: locationInfo.activity_name,
            locationName: locationInfo.location_name,
            actionPlanName: selectedActionplan.action
        }

        console.log("data", data)

        socket.emit("apln_progress_status", data)

    } catch (error) {
        console.log("catch error", error)
    }
}


const emitIRDelMessage = (selectedApln, userData, msg, mode, content) => {

    const messageData = {
        task_id: selectedApln._id,
        message_id: content.message._id,
        user_id: userData.user_data._id,
        message_type: "3",
    }
    try {

        const db_info = JSON.parse(sessionStorage.getItem("db_info"));
        const data = {
            encrypted_db_url: db_info.encrypted_db_url,
            messageData: messageData,
            type: "3"
        }
        socket.emit("ir_messages", data);

    } catch (error) {
        console.log("catch error", error)
    }
}

const emitAplnDelMessage = (selectedApln, selectedCheckpoint, userData, msg, endpointData, mode, content) => {

    const messageData = {
        task_id: selectedApln._id,
        message_id: content.message._id,
        user_id: userData.user_data._id,
        message_type: "3",
    }
    try {

        const db_info = JSON.parse(sessionStorage.getItem("db_info"));
        const data = {
            encrypted_db_url: db_info.encrypted_db_url,
            messageData: messageData,
            type: "3"
        }
        socket.emit("apln_messages", data);

    } catch (error) {
        console.log("catch error", error)
    }
}

const sendMessage = (selectedActionplan, selectedCheckpoint, userInfo, value, locationInfo, emitAs) => {

    const messageToUsers = selectedActionplan.task_users.filter(item => item._id !== userInfo.user_data._id);
    const userInfoArray = messageToUsers.map(ele => ({
        user_id: ele.user_id,
        user_name: ele.name,
        delivery_status: 'pending',
        deliverd_on: null,
        viewed_status: false,
        viewed_on: null,
        selected_option: 'option1',
    }));

    const messageData = {
        task_id: selectedActionplan._id,
        task_checkpoint_id: selectedCheckpoint._id,
        message_from: userInfo.user_data.firstname,
        message_to: userInfoArray,
        message: {
            text: value,
        },

        // 0:send message, 1:forwarded, 2:replied, 3:deleted , 4:edited
        message_type: replymessage.length > 0 ? '2' : '0',
        media_type: determineMediaType({
            text: currentMessage,
        }),
        task_user_name: userInfo.user_data.firstname,
        task_user_id: userInfo.user_data._id,
        task_user_role: userInfo.user_data.role_name,
        task_status: selectedActionplan.task_status,
        task_percentage: selectedActionplan.task_completion_perc,
        task_modifier_id: selectedActionplan.task_modified_by,
        task_modifier_name: selectedActionplan.task_modifier_name,
    };

    const db_info = JSON.parse(sessionStorage.getItem("db_info"));

    const data = {
        encrypted_db_url: db_info.encrypted_db_url,
        messageData: messageData,
        location_id: locationInfo._id,
        user_id: userInfo.user_data._id,
        activity_id: locationInfo.activity_id
    }

    socket.emit("apln_messages", data);

};

const emitchangerole = (selectedApln, updatedSeletedUser) => {
    const dbInfo = JSON.parse(sessionStorage.getItem("db_info"));
    const data = {
        encrypted_db_url: dbInfo.encrypted_db_url,
        _id: selectedApln._id,
        updated_user: updatedSeletedUser
    }
    socket.emit("apln_change_role", data);
}

const emitAplnClosed = (selectedActionplan, selectedCheckpoint, userInfo, value, locationInfo) => {

    const messageToUsers = selectedActionplan.task_users.filter(item => item.name !== userInfo.user_data.firstname);
    const userInfoArray = messageToUsers.map(ele => ({
        user_id: ele.user_id,
        user_name: ele.name,
        delivery_status: 'pending',
        deliverd_on: null,
        viewed_status: false,
        viewed_on: null,
        selected_option: 'option1',
    }));

    const messageData = {
        task_id: selectedActionplan._id,
        task_checkpoint_id: selectedCheckpoint._id,
        message_from: userInfo.user_data.firstname,
        message_to: userInfoArray,
        task_modifier_id: userInfo.user_data._id,
        task_modifier_name: userInfo.user_data.firstname,
        task_user_name: userInfo.user_data.firstname,
        task_user_id: userInfo.user_data._id,
        task_user_role: userInfo.user_data.role_name,
        task_status: "3",
        task_percentage: value
    };

    try {

        const db_info = JSON.parse(sessionStorage.getItem("db_info"));
        const data = {
            encrypted_db_url: db_info.encrypted_db_url,
            messageData: messageData,
            location_id: locationInfo._id
        }
        socket.emit("apln_progress_status", data)

    } catch (error) {
        console.log("catch error", error)
    }
}









///Single Chat

const emitSingleMessage = (
    selectedUser,
    userData,
    currentMessage,
    emitAs,
    selectedContent,
    mediaContent
) => {


    console.log("selectedContent", selectedContent)

    var messageData;

    if (emitAs === "text_message" && !selectedContent) {
        messageData = {
            sender_id: userData.user_data._id,
            sender_name: userData.user_data.firstname,
            receiver_id: selectedUser.sender_id,
            receiver_name: selectedUser.sender_name,
            message: {
                text: currentMessage,
            },
            media_type: "0",
            message_type: "0",
        };
        console.log("messageData", messageData)
    }

    else if (emitAs === "text_message" && selectedContent.mode === "Reply") {
        messageData = {
            sender_id: userData.user_data._id,
            sender_name: userData.user_data.firstname,
            receiver_id: selectedUser.sender_id,
            receiver_name: selectedUser.sender_name,
            message: {
                text: currentMessage,
                replied_msg: selectedContent.message
            },
            message_type: "2",
            media_type: determineMediaType({
                text: currentMessage,
            }),
        };
    }

    else if (emitAs === "image") {
        messageData = {
            sender_id: userData.user_data._id,
            sender_name: userData.user_data.firstname,
            receiver_id: selectedUser.sender_id,
            receiver_name: selectedUser.sender_name,
            message: {
                text: currentMessage,
                image: [mediaContent],
            },
            message_type: "0",
            media_type: "1",
        };
        console.log("messageData", messageData)
    }

    else if (emitAs === "document") {
        messageData = {
            sender_id: userData.user_data._id,
            sender_name: userData.user_data.firstname,
            receiver_id: selectedUser.sender_id,
            receiver_name: selectedUser.sender_name,
            message: {
                text: currentMessage,
                attachment: [mediaContent],
            },
            message_type: "0",
            media_type: "7",
        };
        console.log("messageData", messageData)
    }


    else if (emitAs === "audio") {
        messageData = {
            sender_id: userData.user_data._id,
            sender_name: userData.user_data.firstname,
            receiver_id: selectedUser.sender_id,
            receiver_name: selectedUser.sender_name,
            message: {
                text: currentMessage,
                audio: mediaContent,
            },
            message_type: "0",
            media_type: "3",
        };
        console.log("messageData", messageData)
    }

    else if (emitAs === "video") {
        messageData = {
            sender_id: userData.user_data._id,
            sender_name: userData.user_data.firstname,
            receiver_id: selectedUser.sender_id,
            receiver_name: selectedUser.sender_name,
            message: {
                text: currentMessage,
                video: [mediaContent],
            },
            message_type: "0",
            media_type: "2",
        };
        console.log("messageData", messageData)
    }


    try {
        const db_info = JSON.parse(sessionStorage.getItem("db_info"));
        socket.emit('send_Single_Message', {
            messageData: messageData,
            dbInfo: db_info
        });
    } catch (error) {
        console.log("error", error)
    }

}



const addRecentUser = (user) => {
    console.log("user", user)
    try {
        const db_info = JSON.parse(sessionStorage.getItem("db_info"));
        const userData = JSON.parse(sessionStorage.getItem("authUser"));
        const dataObject = {
            sender_id: user._id,
            sender_name: user.firstname,
            owner_id: userData.user_data._id,
            owner_name: userData.user_data.firstname,
            encrypted_db_url: db_info.encrypted_db_url,
        }
        socket.emit('addRecentUserSingle', dataObject);
    } catch (error) {
        console.log("error", error)
    }
}

const emitForwardSingleMessage = (data, message) => {
    console.log("data", message)
    const db_info = JSON.parse(sessionStorage.getItem("db_info"));
    const userData = JSON.parse(sessionStorage.getItem("authUser"));

    const dataObject = {
        selectedUsers: data,
        encrypted_db_url: db_info.encrypted_db_url,
        sender_id: userData.user_data._id,
        sender_name: userData.user_data.firstname,
        message: {
            forwarded_msg: message
        }
    }
    console.log("dataObject", dataObject)
    try {
        socket.emit("forward_single_message", dataObject)
    } catch (error) {
        console.log("error", error)
    }
}



const emitChanSingleMessage = (userData, selectedcontent, selectedUser, currentMessage) => {
    console.log("userData", userData, selectedcontent)

    if (selectedcontent.mode !== "Edit") {
        var messageData = {
            msg_id: selectedcontent.message._id,
            sender_id: userData.user_data._id,
            sender_name: userData.user_data.firstname,
            receiver_id: selectedUser.sender_id,
            receiver_name: selectedUser.sender_name,
            message_type: "3",
        };
        console.log("messageData", messageData)
    } else {
        var messageData = {
            msg_id: selectedcontent.message._id,
            sender_id: userData.user_data._id,
            sender_name: userData.user_data.firstname,
            receiver_id: selectedUser.sender_id,
            receiver_name: selectedUser.sender_name,
            message_type: "4",
            new_text: currentMessage,
        };
        console.log("messageData", messageData)
    }



    try {
        const db_info = JSON.parse(sessionStorage.getItem("db_info"));
        socket.emit('ondeletesingleMessage', {
            messageData: messageData,
            dbInfo: db_info,
            mode: selectedcontent.mode === "Edit" ? "1" : "0"
        });

    } catch (error) {
        console.log("error", error)
    }
}


const createGroup = (data) => {
    const userData = JSON.parse(sessionStorage.getItem("authUser"));
    const db_info = JSON.parse(sessionStorage.getItem("db_info"));

    data.selectedUsers = data.selectedUsers.map((user, index) => {
        if (user.sender_id === undefined) {
            return { ...user, sender_id: user._id, sender_name: user.firstname };
        } else {
            return user;
        }
    });

    const dataobject = {
        groupInfo: data,
        group_users: data.selectedUsers,
        dbInfo: db_info,
        user_id: userData.user_data._id,
        user_name: userData.user_data.firstname
    }
    try {
        socket.emit("create_group", dataobject)
    } catch (error) {
        console.log("error", error)
    }
}



const emitGroupmessage = (
    selectedUser,
    userData,
    currentMessage,
    emitAs,
    selectedContent,
    mediaContent
) => {

    const messageToUsers = selectedUser.group_users.filter(item => item._id !== userData.user_data._id)
    const userInfoArray = messageToUsers.map((ele => ({
        user_id: ele._id,
        user_name: ele.username,
        delivery_status: 'pending',
        deliverd_on: null,
        viewed_status: false,
        viewed_on: null,
    })));

    var messageData;

    if (emitAs === "text_message" && !selectedContent) {
        messageData = {
            group_id: selectedUser.group_id,
            message_from: userData.user_data.firstname,
            group_user_id: userData.user_data._id,
            message_to: userInfoArray,
            message: {
                text: currentMessage,
            },
            // 0:send message, 1:forwarded, 2:replied, 3:deleted , 4:edited
            message_type: '0',
            media_type: '0',
        }
    }
    else if (emitAs === "text_message" && selectedContent.mode === "Reply") {
        messageData = {
            group_id: selectedUser.group_id,
            message_from: userData.user_data.firstname,
            group_user_id: userData.user_data._id,
            message_to: userInfoArray,
            message: {
                text: currentMessage,
                replied_msg: selectedContent.message
            },
            message_type: "2",
            media_type: determineMediaType({
                text: currentMessage,
            }),
        }
    }
    else if (emitAs === "image") {
        messageData = {
            group_id: selectedUser.group_id,
            message_from: userData.user_data.firstname,
            group_user_id: userData.user_data._id,
            message_to: userInfoArray,
            message: {
                text: currentMessage,
                image: [mediaContent],
            },
            message_type: "0",
            media_type: "1",
        }
    }
    else if (emitAs === "document") {
        messageData = {
            group_id: selectedUser.group_id,
            message_from: userData.user_data.firstname,
            group_user_id: userData.user_data._id,
            message_to: userInfoArray,
            message: {
                text: currentMessage,
                attachment: [mediaContent],
            },
            message_type: "0",
            media_type: "7",
        }
    }
    else if (emitAs === "audio") {
        messageData = {
            group_id: selectedUser.group_id,
            message_from: userData.user_data.firstname,
            group_user_id: userData.user_data._id,
            message_to: userInfoArray,
            message: {
                text: currentMessage,
                audio: mediaContent,
            },
            message_type: "0",
            media_type: "3",
        }
    }
    else if (emitAs === "video") {
        messageData = {
            group_id: selectedUser.group_id,
            message_from: userData.user_data.firstname,
            group_user_id: userData.user_data._id,
            message_to: userInfoArray,
            message: {
                text: currentMessage,
                video: [mediaContent],
            },
            message_type: "0",
            media_type: "2",
        }
    }
    console.log("messageData", messageData)
    try {
        const db_info = JSON.parse(sessionStorage.getItem("db_info"));
        const dataObject = {
            messageData: messageData,
            encrypted_db_url: db_info.encrypted_db_url
        }
        socket.emit("send_group_message", dataObject)
    } catch (error) {
        console.log("error", error)
    }
}


const emitchangeingroupmessage = (userData, selectedContent, selectedUser, currentMessage) => {
    if (selectedContent.mode === "Delete") {
        try {
            const db_info = JSON.parse(sessionStorage.getItem("db_info"));
            const dataObject = {
                encrypted_db_url: db_info.encrypted_db_url,
                group_id: selectedUser.group_id,
                message_id: selectedContent.message._id
            }
            socket.emit("delete_group_message", dataObject)
        } catch (error) {
            console.log("error", error)
        }
    }
    else if (selectedContent.mode === "Edit") {
        try {
            const db_info = JSON.parse(sessionStorage.getItem("db_info"));
            const dataObject = {
                encrypted_db_url: db_info.encrypted_db_url,
                group_id: selectedUser.group_id,
                message_id: selectedContent.message._id,
                new_text: currentMessage
            }
            socket.emit("edit_group_message", dataObject)
        } catch (error) {
            console.log("error", error)
        }
    }
}


const makechangesinuser = (selecteduser, user, type) => {
    try {
        if (type === "Remove") {
            const db_info = JSON.parse(sessionStorage.getItem("db_info"));
            const userData = JSON.parse(sessionStorage.getItem("authUser"));
            const dataobject = {
                encrypted_db_url: db_info.encrypted_db_url,
                group_id: selecteduser.group_id,
                user_id: user._id,
                user_name: user.username,
                modifier_id: userData.user_data._id,
                modifier_name: userData.user_data.firstname,
            }
            socket.emit("removeuser", dataobject)
        }
        else if (type === "Leave") {
            const db_info = JSON.parse(sessionStorage.getItem("db_info"));
            const userData = JSON.parse(sessionStorage.getItem("authUser"));

            const dataobject = {
                encrypted_db_url: db_info.encrypted_db_url,
                group_id: selecteduser.group_id,
                user_id: user._id,
                user_name: user.username,
                modifier_id: userData.user_data._id,
                modifier_name: userData.user_data.firstname,
            }
            socket.emit("leftuser", dataobject)
        }
        else if (type === "Admin") {
            const db_info = JSON.parse(sessionStorage.getItem("db_info"));
            const userData = JSON.parse(sessionStorage.getItem("authUser"));

            const dataobject = {
                encrypted_db_url: db_info.encrypted_db_url,
                group_id: selecteduser.group_id,
                user_id: user._id,
                user_name: user.username,
                modifier_id: userData.user_data._id,
                modifier_name: userData.user_data.firstname,
            }
            socket.emit("adminuser", dataobject)
        }
    } catch (error) {
        console.log("error", error)
    }
}



const addUserToGroup = (data, selectedUser) => {
    try {
        console.log("data", data)
        const userData = JSON.parse(sessionStorage.getItem("authUser"));
        const db_info = JSON.parse(sessionStorage.getItem("db_info"));
        data.selectedUsers = data.selectedUsers.map((user, index) => {
            if (user.sender_id === undefined) {
                return { ...user, sender_id: user._id, sender_name: user.firstname };
            } else {
                return user;
            }
        });
        const dataobject = {
            group_id: selectedUser.group_id,
            users: data.selectedUsers,
            encrypted_db_url: db_info.encrypted_db_url,
            modifier_id: userData.user_data._id,
            modifier_name: userData.user_data.firstname,
        }
        console.log("data.selectedUsers", data.selectedUsers)
        socket.emit("adduseringroup", dataobject)
    } catch (error) {
        console.log("error", error)
    }
}



const emitdeleteGroup = (selectedUser) => {
    try {
        const db_info = JSON.parse(sessionStorage.getItem("db_info"));
        const userData = JSON.parse(sessionStorage.getItem("authUser"));
        const dataobject = {
            group_id: selectedUser.group_id,
            encrypted_db_url: db_info.encrypted_db_url,
            user_id: userData.user_data._id
        }
        socket.emit("deleteuseringroup", dataobject)
    } catch (error) {
        console.log("error", error)
    }
}




export {
    onSocketConnection,
    emitAplnProgress,
    emitAplnDelMessage,
    emitIRDelMessage,
    emitchangerole,
    emitAplnClosed,
    sendMessage,
    aplnJoinRoom,
    addRecentUser,
    emitSingleMessage,
    emitChanSingleMessage,
    emitForwardSingleMessage,
    createGroup,
    emitGroupmessage,
    emitchangeingroupmessage,
    makechangesinuser,
    addUserToGroup,
    emitdeleteGroup,
    IRJoinRoom,
    emitIncidentReport,
    emitLeftRemoveUser
}

export default socket;