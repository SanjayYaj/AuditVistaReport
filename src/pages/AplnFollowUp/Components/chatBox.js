import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"
import {
    Col,
    Row,
    UncontrolledTooltip,
    Badge
} from "reactstrap";
import moment from 'moment'
import _ from "lodash";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Image, Popconfirm } from "antd";
import { Timeline, ConfigProvider } from 'antd';
import Swal from "sweetalert2";
import { emitAplnProgress, emitAplnDelMessage } from "../../../helpers/socket"
import { useSelector } from "react-redux";
import { usePermissions } from 'hooks/usePermisson';




const MessageMediaContent = ({ userMsg }) => {

    const followUpSlice = useSelector(state => state.acplnFollowUpSliceReducer)
    const validUser = followUpSlice.validUser

    const downLoadAttachmentStatus = useMemo(() => _.some(validUser[0]?.facilities, facility => {
        return facility.id === 8 && facility.role_status === true && (facility.checked === undefined || facility.checked === true);
    }), [validUser[0]?.facilities]);

    ;



    return <>{userMsg.message.image && userMsg.message.image[0] && (
        <Image src={"https://d3pnv0bkd16srd.cloudfront.net/followup-uploads/" + userMsg.message.image[0]} className="my-2" alt="" width="120px" style={{ borderRadius: '10px' }} />
    )}

        {userMsg.message.attachment && userMsg.message.attachment[0] && (
            <div className="mb-2">
                {
                    downLoadAttachmentStatus ?
                        <a
                            href={"https://d3pnv0bkd16srd.cloudfront.net/followup-uploads/" + userMsg.message.attachment[0].url_name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-light font-size-12 px-2 py-1 text-dark border border-secondary border-opacity-50"
                            style={{ borderRadius: 20 }}
                        >
                            {userMsg.message.attachment[0].original_file_name.substring(0, 15)} <i className="ms-2 mdi mdi-download" />
                        </a>
                        :
                        <div
                            className="bg-light font-size-12 px-2 py-1 text-dark border border-secondary border-opacity-50"
                            style={{
                                borderRadius: 20,
                                cursor: 'not-allowed',
                                opacity: 0.5
                            }}
                            title="Download disabled"
                        >
                            {userMsg.message.attachment[0].original_file_name.substring(0, 15)} <i className="ms-2 mdi mdi-download" />
                        </div>
                }

            </div>
        )}

        {userMsg.message.audio && userMsg.message.audio.length > 0 && (
            <div className="">
                <audio controls controlsList="nodownload" preload="auto" >
                    <source
                        src={"https://d3pnv0bkd16srd.cloudfront.net/followup-uploads/" + userMsg.message.audio}
                        type="audio/mp3"
                    />
                    Your browser does not support the audio tag.
                </audio>
            </div>
        )}

        {userMsg.message.video !== undefined && userMsg.message.video?.[0] && (
            <div className="">
                <video width="320" height="240" controls controlsList="nodownload">
                    <source
                        src={"https://d3pnv0bkd16srd.cloudfront.net/followup-uploads/" + userMsg.message.video[0]}
                        type="audio/mp3"
                    />
                </video>
            </div>
        )}

    </>
}

const ChatBox = ({
    messages,
    userData,
    selectedContent,
    selectedCheckpoint,
    selectedActionplan,
    connectedRoomUsers,
    showUserPanel,
    endpointData,
    userFacilities
}) => {

    const [messageBox, setMessageBox] = useState(null);
    const [EditTimer, setEditTimer] = useState(3);
    const [timelineData, setTimelineData] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)

       const { canView, canEdit } = usePermissions("follow_audit");
       console.log("canEdit",canEdit)
    



    const deleteMessageStatus = useMemo(() => _.some(userFacilities, facility => {
        return facility.id === 10 && facility.role_status === true && (facility.checked === undefined || facility.checked === true);
    }), [userFacilities])

    const closeStatus = useMemo(() => _.some(userFacilities, facility => {
        return facility.id === 5 && facility.role_status === true && (facility.checked === undefined || facility.checked === true);
    }), [userFacilities]);
    const reOpenStatus = useMemo(() => _.some(userFacilities, facility => {
        return facility.id === 6 && facility.role_status === true && (facility.checked === undefined || facility.checked === true);
    }), [userFacilities]);
    const replyStatus = useMemo(() => _.some(userFacilities, facility => {
        return facility.id === 7 && facility.role_status === true && (facility.checked === undefined || facility.checked === true);
    }), [userFacilities]);

    useEffect(() => {

        if (selectedActionplan) {
            var userInfo = _.filter(selectedActionplan.task_users, { "user_id": userData.user_data._id })[0]
            setCurrentUser(userInfo)
        }

    }, [selectedActionplan])



    const scrollToBottom = () => {
        if (messageBox) {
            messageBox.scrollTop = messageBox.scrollHeight + 1300;
        }
    };


    const closeActionPlan = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'Do you want to close this Action plan?',
            showCancelButton: true,
            confirmButtonColor: '#2ba92b',
            confirmButtonText: 'Yes',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                emitAplnProgress(selectedActionplan, selectedCheckpoint, userData, 100, endpointData, "close_apln")
            }
        });
    }

    const reopenActionPlan = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'Do you want to reopen this Action plan?',
            showCancelButton: true,
            confirmButtonColor: '#2ba92b',
            confirmButtonText: 'Yes',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
            } else {
            }
        });
    }




    useEffect(() => {


        var data = []
        data.push({
            color: "blue",
            dot: (
                <div className="ms-2">
                    <div className="avatar-xs align-self-center">
                        <span className="border border-secondary text-primary bg-white" style={{ height: "80%", width: "80%", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 7 }}>
                            <i className="bx bxs-circle text-secondary" />
                        </span>
                    </div>

                </div>
            ),
            children: (
                <li
                    className="mb-4"
                >
                    <Row className="m-0">
                        <div className="d-flex flex-column">
                            <div className="">
                                {selectedCheckpoint.task_status.length !== 0 ? (
                                    <div className="">
                                        <div className="">
                                            <div className="text-dark font-size-11 fw-bold mb-2"  >
                                                {selectedCheckpoint.breadcrumbs !== undefined && selectedCheckpoint.breadcrumbs}
                                            </div>
                                            <div
                                                className="text-primary mb-2"
                                                style={{ fontSize: "0.8rem", maxWidth: "90%" }}
                                            >
                                                {selectedCheckpoint.checkpoint}
                                            </div>

                                            <div className="d-flex">
                                                <div className="text-dark font-size-13 fw-bold " >Type:</div>
                                                <div className="text-dark font-size-13 mb-1 ms-2"  >
                                                    {selectedCheckpoint.compl_type.map((item2, index) => {
                                                        const formattedItem = index === selectedCheckpoint.compl_type.length - 1 ? item2 + '.' : item2;
                                                        return formattedItem;
                                                    }).join(', ')}
                                                </div>
                                            </div>
                                            <div className="my-2 d-flex flex-row gap-2">
                                                <div className="row my-2">
                                                    {selectedCheckpoint.checkpoint_options &&
                                                        selectedCheckpoint.checkpoint_options.map((item, index) => {
                                                            const tooltipId = `option-tooltip-${index}`;

                                                            return (
                                                                <div key={"cpt" + index} className="col-auto px-1">
                                                                    <div
                                                                        className={`text-${item.is_selected ? "primary" : "dark"} font-size-13 border border-${item.is_selected ? "primary bg-light" : "light"} px-2 py-1`}
                                                                        style={{ borderRadius: 5, lineHeight: 1 }}
                                                                        id={tooltipId}
                                                                    >
                                                                        {item.option_text}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                            <div className="my-2 d-flex flex-row gap-2">
                                                {
                                                    selectedCheckpoint.cp_attach_images && selectedCheckpoint.cp_attach_images.map((item, index) => {
                                                        return (
                                                            <div key={"cptimg" + index}>
                                                                <Image
                                                                    src={"https://d3pnv0bkd16srd.cloudfront.net/eaudit-files/" + (item.originalname ? item.originalname : item.name ? item.name : item.originalName)}
                                                                    alt=""
                                                                    height="80px"
                                                                    width="80px"
                                                                    style={{ borderRadius: '10px' }}
                                                                    className="border border-secondary border-opacity-50 m-0"
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                }
                                                {
                                                    selectedCheckpoint.cp_attach_videos && selectedCheckpoint.cp_attach_videos.map((item, index) => {
                                                        return (
                                                            <video
                                                                key={index}
                                                                height="80px" width="80px"
                                                                style={{ borderRadius: '10px' }}
                                                                src={"https://d3pnv0bkd16srd.cloudfront.net/eaudit-files/" + (item.originalname ? item.originalname : item.name ? item.name : item.originalName)}
                                                                controlsList="nodownload"
                                                                controls
                                                            />
                                                        )

                                                    })
                                                }
                                                {
                                                    selectedCheckpoint.cp_documents && selectedCheckpoint.cp_documents.map((item, index) => {
                                                        return (

                                                            <div key={index}>
                                                                <a
                                                                    href={`https://d3pnv0bkd16srd.cloudfront.net/eaudit-files/${item.originalname ? item.originalname : item.name ? item.name : item.originalName}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="bg-light font-size-12 text-dark border border-secondary border-opacity-50 d-flex align-items-center justify-content-center mt-0"
                                                                    style={{ borderRadius: '10px', height: '80px', width: '80px' }}
                                                                >
                                                                    <span
                                                                        id={`file-tooltip-${index}`}
                                                                    >
                                                                        {item.originalname ? item.originalname?.substring(0, 5) : item.name ? item.name?.substring(0, 5) : item.originalName?.substring(0, 5)}...
                                                                    </span>
                                                                    <i className="ms-2 mdi mdi-download" />
                                                                </a>

                                                                <UncontrolledTooltip
                                                                    placement="top"
                                                                    target={`file-tooltip-${index}`}
                                                                >
                                                                    {item.originalname ? item.originalname : item.name ? item.name : item.originalName}
                                                                </UncontrolledTooltip>
                                                            </div>
                                                        )
                                                    })
                                                }


                                            </div>
                                        </div>

                                        <Row>

                                            <Row style={{ maxWidth: "90%" }}>
                                                <div className="p-2 ">
                                                    <Col className="col-12 mb-3" >
                                                        <div className="text-secondary font-size-3" > Action plan </div>
                                                        <p className="text-dark font-size-13 " style={{ lineHeight: 1.5 }} >{selectedActionplan.action}</p>
                                                    </Col>
                                                    <Col className="col-12 mb-3" >
                                                        <div className="text-secondary font-size-3" > Observation </div>
                                                        <p className="text-dark font-size-13" style={{ lineHeight: 1.5 }} >{selectedActionplan.observation}</p>
                                                    </Col>
                                                    <Col className="col-12 mb-3" >
                                                        <div className="text-secondary font-size-13" > Root Cause </div>
                                                        <p className="text-dark font-size-13" style={{ lineHeight: 1.5 }} >{selectedActionplan.root_cause}</p>
                                                    </Col>

                                                </div>
                                            </Row>
                                            <Row className="p-2">
                                                <Col className="col-auto me-2 mb-2" >
                                                    <div className="font-size-13 text-secondary mb-1">Target Date</div>
                                                    <div className="font-size-14 text-dark">{selectedActionplan.task_target_date === null ? (
                                                        <label className="text-secondary">{"-- / -- / --"}</label>
                                                    ) : (
                                                        <label className="text-dark">
                                                            {moment(selectedActionplan.task_target_date).format("DD-MMM-YYYY")}
                                                        </label>
                                                    )}</div>
                                                </Col>
                                                <Col className="col-auto me-2" >
                                                    <div className="font-size-13 text-secondary mb-1">Priority</div>
                                                    <div>
                                                        <span
                                                            className={`
                                                        badge badge-soft-${selectedActionplan.task_priority === "No impact" || selectedActionplan.task_priority === "No Impact" ? "secondary" :
                                                                    selectedActionplan.task_priority === "Low" ? "success" :
                                                                        selectedActionplan.task_priority === "Medium" ? "warning" :
                                                                            selectedActionplan.task_priority === "High" ? "danger" :
                                                                                selectedActionplan.task_priority === "Critical" && "danger"
                                                                } font-size-14`}>{selectedActionplan.task_priority}</span></div>

                                                </Col>

                                                <Col className="col-auto me-2" >
                                                    <div className="font-size-13 text-secondary mb-1">Completion</div>
                                                    <div><span
                                                        className={`badge badge-soft-${Number(selectedActionplan.task_completion_perc) === 0 ? "secondary" :
                                                            Number(selectedActionplan.task_completion_perc) >= 10 && Number(selectedActionplan.task_completion_perc) <= 90 ? "warning" : Number(selectedActionplan.task_completion_perc) > 90 && "primary"} font-size-14`}>{selectedActionplan.task_completion_perc}%</span></div>
                                                </Col>



                                                <Col className="col-auto me-2" >
                                                    <div className="font-size-13 text-secondary mb-1">Assigned by</div>
                                                    <div className="font-size-14 text-dark" >{selectedActionplan.task_assigner_name}
                                                    </div>
                                                </Col>

                                            </Row>
                                        </Row>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </Row>
                </li>
            )
        })
        if (messages && !canEdit) { 
            messages.map((userMsg, idx) => {
                const emojiRegex = /\p{Emoji}/u;
                var isEmoji = emojiRegex.test(userMsg.message.text)
                data.push({
                    color: "blue",
                    dot: (
                        <span className={`${userMsg.task_status === "0" ? "bg-secondary" : userMsg.task_status === "1" ? "bg-warning" : userMsg.task_status === "2" ? "bg-primary" : userMsg.task_status === "3" ? "bg-success" : userMsg.task_status === "4" ? "bg-danger" : userMsg.task_status === "5" && "bg-dark"}`} style={{ height: "20px", width: "20px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 7 }}>
                            <i className={`${userMsg.task_status === "0" ? "fas fa-male" : userMsg.task_status === "1" ? "fas fa-walking " : userMsg.task_status === "2" ? "fas fa-flag-checkered" : userMsg.task_status === "3" ? "fas fa-check" : userMsg.task_status === "4" ? "fas fa-calendar-times" : userMsg.task_status === "5" && "fas fa-redo text-danger"}  text-white font-size-12`} />
                        </span>

                    ),
                    children: (
                        <li
                            key={"test_k" + idx}
                            className="mb-4"
                        >
                            <div >
                                <div className="d-flex flex-row">
                                    <div className="d-flex flex-column ">
                                        <div className="d-flex flex-row gap-2">
                                            <div className={`font-size-12 fw-bold  ${userMsg.task_user_id === userData._id ? 'text-info' : 'text-dark'}`}>{userMsg.task_user_id === userData.user_data._id ? "You" : userMsg.message_from}</div>
                                            <div className="font-size-12 text-secondary text-opacity-75"><i className="mdi mdi-calendar-text-outline font-size-12 me-1" />{moment(userMsg.createdAt).format("LLL")}</div>
                                        </div>




                                        {
                                            userMsg.message_type === "2" &&
                                            <div className="mt-2 d-flex flex-row" >
                                                <div className="bg-secondary px-1 py-2" style={{ borderRadius: "10px 0 0 10px", }}>
                                                </div>
                                                <div className="bg-light p-2" style={{ borderRadius: "0px 10px 10px 0px", maxWidth: "90%" }} >

                                                    <div className="font-size-12 fw-bold  ">{userMsg.message.replied_msg.message_from}</div>
                                                    {
                                                        userMsg.message.replied_msg.message.image.length !== 0 &&
                                                        <div className="d-flex align-items-center">
                                                            <div className="mt-2">
                                                                <img
                                                                    src={"https://d3pnv0bkd16srd.cloudfront.net/followup-uploads/" + userMsg.message.replied_msg.message.image}
                                                                    style={{ width: "40px", height: "40px", borderRadius: "5px" }}
                                                                />
                                                            </div>
                                                            <div className="font-size-12 fw-bold ms-1 me-5 mt-2 text-primary"> <i className="mdi mdi-image mx-1"></i>Image</div>
                                                        </div>
                                                    }
                                                    {
                                                        userMsg.message.replied_msg.message.attachment &&
                                                        userMsg.message.replied_msg.message.attachment.length !== 0 &&
                                                        <div className="text-dark mt-1" style={{ fontSize: "0.75rem" }} >
                                                            <i className="mdi mdi-file-document-outline"></i>
                                                            {userMsg.message.replied_msg.message.attachment[0].original_file_name}
                                                        </div>
                                                    }
                                                    {
                                                        userMsg.message.replied_msg.message.audio &&
                                                        userMsg.message.replied_msg.message.audio.length !== 0 &&
                                                        <div>
                                                            <i className=" mdi mdi-microphone-outline"></i>{"Audio"}
                                                        </div>
                                                    }
                                                    {
                                                        userMsg.message.replied_msg.message.video &&
                                                        userMsg.message.replied_msg.message.video.length !== 0 &&
                                                        <div>
                                                            <i className=" mdi mdi-video"></i>{"video"}
                                                        </div>
                                                    }
                                                    <div className="text-dark mt-1" style={{ fontSize: "0.75rem" }}>{userMsg.message.replied_msg.message.text}</div>
                                                </div>
                                            </div>
                                        }
                                        {
                                            userMsg.message_type !== '3' && userMsg.message_type !== '6' && userMsg.message_type !== '7' && userMsg.message.text && userMsg.message.text.length > 0 && userMsg.message_type !== '9' &&
                                            <div className="d-flex mt-2 mb-2 pe-3" style={{ maxWidth: "90%" }}>
                                                <div className="text-dark" style={{ fontSize: "0.75rem" }}>{userMsg.message.text}</div>
                                            </div>
                                        }

                                        {
                                            userMsg.message_type === '3' &&
                                            <div className="d-flex mt-2 mb-2 pe-3" >
                                                <div className="text-dark bg-light px-2 py-1 " style={{ fontSize: "0.75rem", fontStyle: "italic", borderRadius: 25 }}>{"This message was deleted"}</div>
                                            </div>
                                        }

                                        {
                                            userMsg.message_type === '6' &&
                                            <div className="d-flex mt-2 mb-2 pe-3" >
                                                <div className="text-dark bg-light px-2 py-1 " style={{ fontSize: "0.75rem", fontStyle: "italic", borderRadius: 25 }}>{userMsg.message.text}</div>
                                            </div>
                                        }
                                        {
                                            userMsg.message_type === '9' &&
                                            <div className="d-flex mt-2 mb-2 pe-3" >
                                                <div className="text-dark bg-light px-2 py-1 " style={{ fontSize: "0.75rem", fontStyle: "italic", borderRadius: 25 }}>{userMsg.message.text}</div>
                                            </div>
                                        }

                                        {
                                            userMsg.message_type === '7' &&
                                            <div className="d-flex mt-2 mb-2 pe-3" >
                                                <div className="text-dark bg-light px-2 py-1 " style={{ fontSize: "0.75rem", fontStyle: "italic", borderRadius: 25 }}>{userMsg.message.text}</div>
                                            </div>
                                        }

                                        {
                                            userMsg.message_type !== '2' && userMsg.message_type !== '5' && userMsg.message_type !== '3' &&
                                            <div className={"mt-2 d-flex flex-row gap-3"}>
                                                <div>
                                                    <MessageMediaContent
                                                        userMsg={userMsg}
                                                    />
                                                </div>
                                            </div>

                                        }
                                        {
                                            userMsg.message_type !== '3' && userMsg.message_type !== '6' && userMsg.message_type !== '7' && userMsg.message_type !== '9' &&
                                            <div className="d-flex flex-row mb-2 align-items-center">
                                                <Badge className={`${userMsg.task_status === "0" ? "badge-soft-secondary" : userMsg.task_status === "1" ? "badge-soft-warning" : userMsg.task_status === "2" ? "badge-soft-primary" : userMsg.task_status === "3" && "badge-soft-success"} me-1`}>
                                                    {
                                                        userMsg.task_status === "0" || userMsg.task_status === undefined ? <span className="text-secondary">Not Started</span> :
                                                            userMsg.task_status === "1" ? <span className="text-warning">In progress</span> :
                                                                userMsg.task_status === "2" ? <span className="text-primary">Completed</span> :
                                                                    userMsg.task_status === "3" ? <span className="text-success">closed</span> :
                                                                        userMsg.task_status === "4" ? <span className="text-danger">Overdue</span> :
                                                                            userMsg.task_status === "5" && <span className="text-dark">Reopen</span>
                                                    }
                                                </Badge>
                                                <Badge className={`${userMsg.task_status === "0" ? "badge-soft-secondary" : userMsg.task_status === "1" ? "badge-soft-warning" : userMsg.task_status === "2" ? "badge-soft-primary" : userMsg.task_status === "3" && "badge-soft-success"} me-1`}>{userMsg.task_percentage}%</Badge>
                                                <div className="font-size-11 text-secondary text-opacity-75">Modified by : {userMsg.task_modifier_name}</div>
                                            </div>
                                        }


                                        <div className="d-flex flex-row gap-3 ">
                                            {userMsg.message_type !== '3' && userMsg.message_type !== '6' && userMsg.message_type !== '7' && userMsg.message_type !== '8' && selectedActionplan && (selectedActionplan.task_status !== "3")
                                                && userMsg.message_type !== '9'

                                                && <div className="d-flex gap-2">
                                                    {
                                                        selectedActionplan && (selectedActionplan.task_status !== "3") && replyStatus &&
                                                        <div className="font-size-12" style={{ cursor: "pointer" }} onClick={(e) => selectedContent(userMsg, "Reply")}><i className="mdi mdi-reply text-secondary font-size-14 me-1" />Reply</div>
                                                    }

                                                    {
                                                        userMsg.task_user_id === userData.user_data._id && deleteMessageStatus && userMsg.message_type !== '8' &&
                                                        <Popconfirm placement="rightBottom" title="Are you sure you want to delete this message?" okText="Yes" cancelText="No" onConfirm={() => { sendAplnMessage(userMsg, "Delete") }} >
                                                            <div className="font-size-12 text-danger " style={{ cursor: "pointer", }}><i className="mdi mdi-trash-can-outline font-size-14 me-1" />Delete</div>
                                                        </Popconfirm>
                                                    }


                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )
                })
            })

        }
        setTimelineData(data)
        setTimeout(() => {
            scrollToBottom();
        }, 50);

    }, [messages, userData])

    const sendAplnMessage = (msg, mode) => {
        var setSelectedMessage = {
            message: msg,
            mode: mode
        }
        emitAplnDelMessage(selectedActionplan, selectedCheckpoint, userData, "This message was deleted", endpointData, "text_message", setSelectedMessage)
    }

    return (
        <ul className="list-unstyled mb-0 p-1">

            {
                currentUser && currentUser.user_status === "0" &&
                <Row className="m-0 py-2 border-bottom border-secondary border-opacity-25">
                    <Col md={9}>
                        <div className="avatar-group float-start task-assigne">
                            {connectedRoomUsers && selectedActionplan.task_users.map((item, index) => {
                                var isActive = _.findIndex(connectedRoomUsers.users, { "userid": item.user_id })
                                if (item.user_status === "0" || item.user_status === undefined) {
                                    return (
                                        <div key={index} className="avatar-group-item" title={item.name}>
                                            <Link to="#" className="d-inline-block" defaultValue="member-4">
                                                <div className={`rounded-circle avatar-xs ${isActive !== -1 ? "bg-success text-dark" : "bg-secondary text-dark"} bg-opacity-50`} style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: 'black',
                                                }}>
                                                    {item.name.charAt(0).toUpperCase()}
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                }
                            })}
                            <div className="avatar-group-item" title={"Add More Users"}>
                                <Link to="#" className="d-inline-block" defaultValue="member-4"
                                    onClick={() => { showUserPanel() }}
                                >
                                    <div className={`rounded-circle avatar-xs bg-light`} style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: 'black',
                                    }}>
                                        <i className="fas fa-users-cog" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </Col>
                    <Col md={3} className="d-flex align-items-center justify-content-end " >
                        {
                            selectedActionplan && (selectedActionplan.task_completion_perc === 100 && selectedActionplan.task_status === "2") && closeStatus &&
                            <div className="float-end">
                                <button className="btn btn-sm btn-success" onClick={() => {
                                    closeActionPlan()
                                }}>Close Action plan</button>
                            </div>
                        }
                    </Col>
                </Row>

            }

            <PerfectScrollbar
                style={{ height: currentUser && currentUser.user_status !== "0" ? "80vh" : selectedActionplan && (selectedActionplan.task_completion_perc === 100 && selectedActionplan.task_status === "3") ? "80vh" : "55vh", paddingLeft: 30, paddingTop: 15 }}
                containerRef={ref => setMessageBox(ref)}
            >
                <ConfigProvider>
                    <Timeline
                        items={timelineData}
                    />
                </ConfigProvider>

            </PerfectScrollbar>

        </ul>
    )

}

export default ChatBox;