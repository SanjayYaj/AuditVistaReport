import React, { useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import {
    Row,
    Col,
    CardTitle,
    Container,
    Spinner,
    Badge,
    Toast,
    ToastBody,
    ToastHeader
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAuditLocationAplnData, setValidUser, updateAplnData, setSelectedActionplan, setAplnAuditLocationAplnData } from "../../toolkitStore/Auditvista/aplnfollowup/aplnflwupslice"
import Breadcrumbs from "./Components/breadCrumb"
import { Empty } from "antd";
import AcplnBox from "./Components/acplnBox";
import Conversation from "./Components/conversation";
import TaskUsers from "./Components/taskUsers";
import chaticon from "../../assets/images/icons/chat.png";
import socket, { onSocketConnection } from "../../helpers/socket";
import { useNavigate } from "react-router-dom";


const AuditLocationActionPlans = (props) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const { aplnAuditLocationAplnList, aplnAuditLocationAplnStatus } = useSelector(state => state.acplnFollowUpSliceReducer)
    const [userData, setUserData] = useState(null)
    const [endpointData, setEndpointData] = useState(null);
    const [selectedTaskIndex, setSelectedTaskIndex] = useState(null)
    const [selectedCheckpoint, setSelectedCheckpoint] = useState(null)
    const [selectedApln, setSelectedApln] = useState(null)
    const [showTaskEditor, setShowTaskEditor] = useState(false)
    const [connectedRoomUsers, setConnectedRoomUsers] = useState(null)
    const [showUserPanel, setShowUserPanel] = useState(false)
    const [aplnList, setAplnList] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [toast, setToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('message received!!!');
    const [loading, setLoading] = useState(true);
    const [col1Width, setCol1Width] = useState(350);

    useEffect(() => {

        if (socket) {
            socket.on("update_users_in_room", (data) => {
                setConnectedRoomUsers(data)
            });
        }
        socket.on("notify_msg", msg => {
            setToastMessage(msg.message.text);
            setToast(true);
            setTimeout(() => {
                setToast(false);
            }, 1000);

            var data = {
                checkpoint_id: msg.task_checkpoint_id,
                actionplan_id: msg.room_id,
                task_status: msg.task_status,
                task_percentage: msg.task_percentage,
                task_modified_by: msg.task_modifier_id,
                task_modifier_name: msg.task_modifier_name,
                task_users: msg.task_users,
                unread: msg.unread
            }
            dispatch(updateAplnData(data))

        });

    }, [socket])


    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem("authUser"));
        setUserData(data)
        const endpointData = JSON.parse(sessionStorage.getItem("endpointData"));
        setEndpointData(endpointData)
        dispatch(getAuditLocationAplnData(endpointData));
        return () => { };
    }, [dispatch]);


    useEffect(() => {
        console.log(aplnAuditLocationAplnList, 'aplnAuditLocationAplnList')
        if (aplnAuditLocationAplnList) {
            setAplnList(aplnAuditLocationAplnList)
            setLoading(false)
            if (selectedApln) {
                var getCheckpoint = _.filter(aplnAuditLocationAplnList, { _id: selectedCheckpoint._id })[0]
                var getApln = _.filter(getCheckpoint?.action_plan, { _id: selectedApln._id })
                setSelectedApln(null)
                setSelectedApln(getApln.length > 0 ? getApln[0] : null)
            }
        }
        const data = JSON.parse(sessionStorage.getItem("authUser"));
        onSocketConnection(data)
        return () => { }

    }, [aplnAuditLocationAplnList])

    const loadSelectedCheckpoint = async (item, i, i2, item2) => {
        const validUser = item2.task_users.filter(item => item.user_id === userData.user_data._id)
        dispatch(setValidUser(validUser))

        setSelectedTaskIndex(i + "_" + i2)
        setSelectedCheckpoint(item)
        var updatedInfo = { ...item2 }
        updatedInfo = {
            ...updatedInfo, unreadCount: 0
        }
        var apListIdx = _.findIndex(aplnAuditLocationAplnList, { _id: updatedInfo.tk_checkpoint_id })
        if (apListIdx !== -1) {
            var apList = [...aplnAuditLocationAplnList]
            var acplnIdx = _.findIndex(apList[apListIdx].action_plan, { _id: updatedInfo._id })
            apList[apListIdx] = {
                ...apList[apListIdx],
                action_plan: apList[apListIdx].action_plan.map((plan, idx) =>
                    idx === acplnIdx ? { ...plan, unreadCount: 0 } : plan
                )
            }
            dispatch(setAplnAuditLocationAplnData({ data: apList }));
        }

        setSelectedApln(item2)
        dispatch(setSelectedActionplan(item2))
        setShowTaskEditor(true)
        var userInfo = _.filter(item2.task_users, { "user_id": userData.user_data._id })[0]
        setCurrentUser(userInfo)

    }

    const gotoBack = () => {
        navigate('/adtlctns')
    }

    const toggleToast = () => {
        setToast(!toast);
    };


    const handleMouseDown = (e) => {
        const startX = e.clientX;
        const startWidth = col1Width;
        const handleMouseMove = (e) => {
            const newWidth = Math.min(Math.max(startWidth + e.clientX - startX, 300), 600);
            setCol1Width(newWidth);
        };
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };


    if (!loading) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Action plans | AuditVista</title>
                    </MetaTags>

                    <Container fluid>
                        <Breadcrumbs
                            title={endpointData && "Audit : " + endpointData.activity_name}
                            location={endpointData && "Location : " + endpointData.location_name}
                            breadcrumbItem="Location action plans"
                            isBackButtonEnable={true}
                            gotoBack={() => gotoBack()}
                        />
                        <Row className="m-0 bg-white" >
                            <Col md={12}>
                                <CardTitle style={{ fontWeight: 300 }} className="py-2">
                                    <Col md={12} className="mt-1">
                                        <div className="d-flex gap-4 align-items-center">
                                            {
                                                aplnAuditLocationAplnStatus &&
                                                aplnAuditLocationAplnStatus.map((item, idx) => {
                                                    return <div className="text-dark " key={"cnt" + idx} style={{ fontSize: "0.7rem", lineHeight: 0 }}>
                                                        {item.name}
                                                        {
                                                            item.id === 4 ?
                                                                <span className="ms-2 font-size-12 bg-primary badge bg-primary"><i className="fas fa-flag-checkered  me-1"></i> {item.count}</span>
                                                                :
                                                                <Badge
                                                                    className={`ms-2 font-size-12 bg-${item.id === 1
                                                                        ? "dark"
                                                                        : item.id === 2
                                                                            ? "secondary"
                                                                            : item.id === 3
                                                                                ? "warning"
                                                                                :
                                                                                item.id === 4
                                                                                    ? "primary"
                                                                                    : item.id === 5
                                                                                        ? "success"
                                                                                        : item.id === 6
                                                                                            ? "danger"
                                                                                            : item.id === 7
                                                                                                ? "dark"
                                                                                                : ""
                                                                        }`}
                                                                >
                                                                    {idx !== 0 && <i className={`fas fa-${item.id === 2 ? "male" : item.id === 3 ? "walking" : item.id === 4 ? "flag-checkered" : item.id === 5 ? "check" : item.id === 6 ? "calendar-times" : item.id === 7 && "redo"}  me-1`} />} {item.count}</Badge>

                                                        }

                                                    </div>
                                                })
                                            }

                                        </div>
                                    </Col>
                                </CardTitle>
                            </Col>
                        </Row>
                        <Row className="m-0 mt-1 " >
                            <Col lg="12" className="m-0 p-0">
                                <div className="d-lg-flex gap-1" style={{ display: "flex", gap: "1rem", height: "82vh" }}>
                                    <div
                                        className="resizable-column bg-white"
                                        style={{
                                            width: col1Width + "px",
                                            minWidth: "300px",
                                            maxWidth: "600px",
                                            height: "82vh",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <div className="scroll-design">
                                            <Row className="m-0">
                                                {aplnList && aplnList.length > 0 ? (
                                                    <div>
                                                        {aplnList.map((item, index) => (
                                                            <div key={`acln-${index}`} className="py-2">
                                                                <div className="py-2">
                                                                    <div className="text-dark font-size-11 fw-bold">
                                                                        {item.breadcrumbs || ""}
                                                                    </div>
                                                                    <div
                                                                        className="text-primary"
                                                                        style={{ fontSize: "0.8rem" }}
                                                                    >
                                                                        {item.checkpoint}
                                                                    </div>
                                                                    <div className="d-flex">
                                                                        <div className="text-dark font-size-11 fw-bold">Type:</div>
                                                                        <div className="text-dark font-size-11 ms-2">
                                                                            {item.compl_type.join(", ")}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {item.action_plan &&
                                                                    item.action_plan.map((item2, i2) => (
                                                                        <AcplnBox
                                                                            key={`itm-${index}-${i2}`}
                                                                            index={index}
                                                                            i2={i2}
                                                                            item2={item2}
                                                                            item={item}
                                                                            selectedTaskIndex={selectedTaskIndex}
                                                                            loadSelectedCheckpoint={(item, index, i2, item2) =>
                                                                                loadSelectedCheckpoint(item, index, i2, item2)
                                                                            }
                                                                        />
                                                                    ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <Empty />
                                                    </div>
                                                )}
                                            </Row>
                                        </div>
                                        <div className="section-drag-handle" onMouseDown={handleMouseDown} />
                                    </div>

                                    <div className="user-chat bg-white scroll-design" style={{ flexGrow: 1, minWidth: "350px", height: "82vh", transition: "all 0.2s ease" }} >
                                        {showTaskEditor && selectedApln ? (
                                            <div>
                                                <Conversation
                                                    selectedCheckpoint={selectedCheckpoint}
                                                    selectedApln={selectedApln}
                                                    endpointData={endpointData}
                                                    userData={userData}
                                                    connectedRoomUsers={connectedRoomUsers}
                                                    showUserPanel={() => setShowUserPanel(!showUserPanel)}
                                                />
                                            </div>
                                        ) : (
                                            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "82vh" }}>
                                                <img src={chaticon} style={{ width: "25%" }} className="pb-2" />
                                                <p>Your conversation starts here</p>
                                            </div>
                                        )}
                                    </div>

                                    {currentUser && currentUser.user_status === "0" && showUserPanel && (
                                        <div className="col-3 bg-white scroll-design" style={{ flexShrink: 0, flexGrow: 0, minWidth: "300px", height: "82vh" }}>
                                            <TaskUsers
                                                selectedCheckpoint={selectedCheckpoint}
                                                selectedApln={selectedApln}
                                                endpointData={endpointData}
                                                userData={userData.user_data}
                                                connectedRoomUsers={connectedRoomUsers}
                                                showUserPanel={() => setShowUserPanel(!showUserPanel)}
                                            />
                                        </div>
                                    )}
                                </div>

                            </Col>
                        </Row>

                    </Container>
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
            </React.Fragment>
        )
    } else {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div>Loading...</div>
                <Spinner color="primary" />
            </div>
        )
    }

}

export default AuditLocationActionPlans;