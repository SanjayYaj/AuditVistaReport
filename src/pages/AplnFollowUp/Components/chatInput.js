import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"
import Swal from 'sweetalert2';
import {
    Button,
    Col,
    Row,
    UncontrolledTooltip,
    Modal,
} from "reactstrap";
import { Image, Popover } from "antd";
import Slider from "react-rangeslider"
import "./rangeSlider.css"
import socket, { emitAplnProgress } from "../../../helpers/socket"
import { addMessage } from '../../../toolkitStore/Auditvista/socket/socketSlice';
import { uploadImageToAws, uploadVideoToAws, uploadRecordedAudioToAws, uploaddocsToAws } from "../API/AWSUpload";
import { useDispatch, useSelector } from "react-redux";
import WebCam from "../MediaComponents/webCam";
import WebMic from "../MediaComponents/webMic";
import WebGallery from "../MediaComponents/webGallery";
import WebDocument from "../MediaComponents/webDocuments";
import { setMarkerState } from '../../../toolkitStore/Auditvista/actionPlan/Slice/actionplaninfoslice';
import { _ } from "core-js";


const b2bEmojis = [
    { id: 1, emoji: '😊', name: 'Happy B2B' },
    { id: 2, emoji: '🤝', name: 'Handshake' },
    { id: 3, emoji: '👏', name: 'Briefcase' },
    { id: 4, emoji: '🤔', name: 'Growth' },
    { id: 5, emoji: '😎', name: 'Connection' },
    { id: 6, emoji: '💯', name: 'Global' },
    { id: 7, emoji: '👋', name: 'Tools' },
    { id: 8, emoji: '✋', name: 'Analytics' },
    { id: 9, emoji: '👌', name: 'Calendar' },
    { id: 10, emoji: '👍', name: 'Automation' },
    { id: 11, emoji: '👎', name: 'Search' },
    { id: 12, emoji: '🙏', name: 'Technology' },
];


const ChatInput = ({
    selectedActionplan,
    selectedCheckpoint,
    userData,
    endpointData,
    selectedContent,
    clearAll,
    userFacilities
}) => {

    const dispatch = useDispatch()

    const [currentMessage, setCurrentMessage] = useState("");
    const [emojiArray, setEmojiArray] = useState("");
    const [modal_large, setmodal_large] = useState(false);
    const [modalPanel, setModalPanelAs] = useState(null);
    const [def, setdef] = useState(0)
    const [editedImage, setEditedImage] = useState(null)



    const followUpSlice = useSelector(state => state.acplnFollowUpSliceReducer)
    const changeProgress = useMemo(() => _.some(userFacilities, facility => {
        return facility.id === 4 && facility.role_status === true && (facility.checked === undefined || facility.checked === true);
    }), [userFacilities]);

    const allowPost = useMemo(() => _.some(userFacilities, facility => {
        return facility.id === 9 && facility.role_status === true && (facility.checked === undefined || facility.checked === true);
    }), [userFacilities]);

    const allowAttachment = useMemo(() => _.some(userFacilities, facility => {
        return facility.id === 11 && facility.role_status === true && (facility.checked === undefined || facility.checked === true);
    }), [userFacilities]);


    useEffect(() => {

        if (socket) {
            socket.on('receive_room_message', (message) => {
                dispatch(addMessage(message));
            });
            return () => {
            };
        }

    }, [socket]);

    useEffect(() => {
        if (selectedActionplan) {
            setdef(Number(selectedActionplan.task_completion_perc))
        }
        return () => {
        };
    }, [selectedActionplan])


    const countWords = (text) => {
        const words = text.trim().split(/\s+/);
        return words.length;
    };

    const horizontalLabels = {
        0: <span><i className="fas fa-male text-secondary font-size-15 fw-bold" /> 0</span>,
        10: <span><i className="fas fa-walking text-warning font-size-15 fw-bold" /> 10</span>,
        20: <span><i className="fas fa-walking text-warning font-size-15 fw-bold" /> 20</span>,
        30: <span><i className="fas fa-walking text-warning font-size-15 fw-bold" /> 30</span>,
        40: <span><i className="fas fa-walking text-warning font-size-15 fw-bold" /> 40</span>,
        50: <span><i className="fas fa-walking text-warning font-size-15 fw-bold" /> 50</span>,
        60: <span><i className="fas fa-walking text-warning font-size-15 fw-bold" /> 60</span>,
        70: <span><i className="fas fa-walking text-warning font-size-15 fw-bold" /> 70</span>,
        80: <span><i className="fas fa-walking text-warning font-size-15 fw-bold" /> 80</span>,
        90: <span><i className="fas fa-walking text-warning font-size-15 fw-bold" /> 90</span>,
        100: <span><i className="fas fa-flag-checkered text-primary font-size-13" /> 100</span>,

    }


    const showWarningAlert = (icon, title, text) => {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        }).then((result) => {
            if (result.isConfirmed) {
            }
        });
    };

    const handleEmojiClick = (emojiObject) => {
        setEmojiArray([...emojiArray, emojiObject.emoji]);
        setCurrentMessage(currentMessage + emojiObject.emoji);
    };

    function removeBodyCss() {
        document.body.classList.add("no_padding");
    }

    function tog_large() {
        setmodal_large(!modal_large);
        removeBodyCss();
    }

    const emojiContent = () => {
        return <Row >

            <div className="col-12">
                <div className="custom-emoji-picker">
                    {b2bEmojis.map((emoji) => (
                        <span
                            style={{
                                fontSize: '24px',
                                marginRight: '5px',
                                marginBottom: '8px',
                                cursor: 'pointer',
                                padding: '8px',
                                display: 'inline-block',
                            }}
                            key={emoji.id}
                            onClick={() => handleEmojiClick(emoji)}
                        >
                            {emoji.emoji}
                        </span>
                    ))}
                </div>
            </div>

        </Row>
    }

    const documentContent = () => {
        return <Row>
            <div className="col-12 d-flex align-items-center justify-content-center" >
                <Row className="gap-1">
                    <div className="col-auto d-flex flex-column align-items-center">
                        <Link to="#" onClick={() => { setModalPanelAs("Camera"); tog_large(); }} className="text-primary">
                            <i className="mdi mdi-camera" style={{ fontSize: 30 }} />
                        </Link>
                        <label className="font-size-12">Camera</label>
                    </div>
                    <div className="col-auto d-flex flex-column align-items-center" >
                        <Link to="#" onClick={() => { setModalPanelAs("Mic"); tog_large(); }} className="text-secondary">
                            <i className="mdi mdi-microphone" style={{ fontSize: 30 }} />
                        </Link>
                        <label className="font-size-12">Mic</label>
                    </div>

                    <div className="col-auto d-flex flex-column align-items-center" >
                        <Link to="#" onClick={() => { setModalPanelAs("Gallery"); tog_large(); }} className="text-success">
                            <i className="mdi mdi-file-image" style={{ fontSize: 30 }} />
                        </Link>
                        <label className="font-size-12">Image</label>
                    </div>

                    <div className="col-auto d-flex flex-column align-items-center" >

                        <Link to="#" onClick={() => { setModalPanelAs("Documents"); tog_large(); }} className="text-warning">
                            <i className="mdi mdi-file" style={{ fontSize: 30 }} />
                        </Link>
                        <label className="font-size-12">Documents</label>
                    </div>


                </Row>
            </div>

        </Row>
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage()
        }
    };

    const sendMessage = () => {
        if (currentMessage.trim() === "") {
            return;
        }
        sendAplnMessage()
        clearAll()
        setCurrentMessage("")
        setmodal_large(false);
    }

    const sendAplnProgress = (value) => {
        emitAplnProgress(selectedActionplan, selectedCheckpoint, userData, value, endpointData, "change_progress", selectedContent)
    }

    const sendAplnMessage = () => {
        emitAplnProgress(selectedActionplan, selectedCheckpoint, userData, currentMessage, endpointData, "text_message", selectedContent)
    }

    const uploadImageAndEmit = async (imageURL, currentMessage) => {
        const responseData = await uploadImageToAws(imageURL);
        if (responseData) {
            emitAplnProgress(selectedActionplan, selectedCheckpoint, userData, currentMessage, endpointData, "image", selectedContent, responseData)
        }
    }

    const uploadVideoAndEmit = async (videoURL, currentMessage) => {
        const responseData = await uploadVideoToAws(videoURL);
        if (responseData) {
            emitAplnProgress(selectedActionplan, selectedCheckpoint, userData, currentMessage, endpointData, "video", selectedContent, responseData)
        }
    }

    const uploadAudioAndEmit = async (audioURL, currentMessage) => {
        const responseData = await uploadRecordedAudioToAws(audioURL);
        if (responseData) {
            emitAplnProgress(selectedActionplan, selectedCheckpoint, userData, currentMessage, endpointData, "audio", selectedContent, responseData)
        }
    }

    const uploadDocumentAndEmit = async (documentURL, currentMessage, originalName) => {
        const responseData = await uploaddocsToAws(documentURL);
        if (responseData) {
            var documentData = {
                original_file_name: originalName,
                url_name: responseData
            }
            emitAplnProgress(selectedActionplan, selectedCheckpoint, userData, currentMessage, endpointData, "document", selectedContent, documentData)
        }
    }

    return (
        <div className="chat-input-section mt-0">
            {

                selectedContent ?
                    <div className="mx-0 py-2 px-4 d-flex flex-row align-items-center justify-content-between " style={{ backgroundColor: "rgba(230, 232, 235, 0.3)", maxHeight: 80 }} >
                        <div className="d-flex flex-column justify-content-center" style={{ maxWidth: "30%" }}>
                            <div className="font-size-12 fw-bold">{selectedContent.message.message_from}</div>
                            <div className="text-dark text-truncate" style={{ fontSize: "0.75rem", }}>{selectedContent.message.message.text}</div>
                            {
                                selectedContent.message.message.image.length !== 0 &&
                                <div className="mt-2"><Image src={"https://d3pnv0bkd16srd.cloudfront.net/followup-uploads/" + selectedContent.message.message.image} style={{ width: "40px", height: "40px", borderRadius: "5px" }} /><span className="ms-2 text-primary " >Image</span>
                                </div>
                            }
                            {
                                selectedContent.message.message.attachment &&
                                selectedContent.message.message.attachment.length !== 0 &&
                                <div>
                                    <i className="mdi mdi-file-document-outline"></i>
                                    {selectedContent.message.message.attachment[0].original_file_name}
                                </div>
                            }
                            {
                                selectedContent.message.message.audio &&
                                selectedContent.message.message.audio.length !== 0 &&
                                <div>
                                    <i className=" mdi mdi-microphone-outline"></i>{"Audio"}
                                </div>
                            }
                            {
                                selectedContent.message.message.video &&
                                selectedContent.message.message.video.length !== 0 &&
                                <div>
                                    <i className=" mdi mdi-video"></i>{"Video"}
                                </div>
                            }

                        </div>
                        <div>
                            <div className="avatar-group-item" title={"close"}>
                                <Link to="#" className="d-inline-block" defaultValue="member-4"
                                    onClick={() => {
                                        clearAll()
                                    }}
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
                    </div> :
                    <Row className="mx-0 py-2 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: "rgba(230, 232, 235, 0.3)" }} >

                        {
                            changeProgress &&

                            <>
                                <div className="col-12 font-size-12 mb-1" style={{ textAlign: "center" }}>Completed Percentage</div>
                                <div className="col-12 px-5" style={{ height: 26 }}>
                                    <Slider
                                        value={def}
                                        step={10}
                                        labels={horizontalLabels}
                                        orientation="horizontal"
                                        onChange={value => {
                                            setdef(value)
                                        }}
                                        onChangeComplete={() => {
                                            sendAplnProgress(def)
                                        }}
                                        className={`rangeslider-horizontal rangeslider__fill_${def === 0 && def < 10 ? "ns" : def >= 10 && def <= 90 ? "ip" : def > 90 && "cpt"}`}

                                    />
                                </div>
                            </>

                        }

                    </Row>
            }
            {
                allowPost &&
                <Row className="px-3 mt-2">
                    <Col>
                        <div className="position-relative">
                            <textarea
                                type="text"
                                value={currentMessage}
                                onKeyUp={handleKeyPress}
                                onChange={(e) => {
                                    if (countWords(e.target.value) <= 500) {
                                        setCurrentMessage(e.target.value);
                                    } else {
                                        showWarningAlert("warning", "Words exceed", "Text Message should not exceed 500 words.")
                                    }
                                }}
                                className="form-control chat-input ps-4"
                                placeholder="Enter Message..."
                                style={{ minHeight: 70 }}
                            />
                            <div className="chat-input-links">
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item">
                                        <Popover content={emojiContent} title="Emojis">
                                            <Link to="#">
                                                <i
                                                    className="mdi mdi-emoticon-happy-outline me-1 font-size-20"
                                                    id="Emojitooltip"
                                                    onClick={() => {

                                                    }}
                                                />
                                                <UncontrolledTooltip
                                                    placement="top"
                                                    target="Emojitooltip"
                                                >
                                                    Emojis
                                                </UncontrolledTooltip>
                                            </Link>
                                        </Popover>
                                    </li>

                                    {
                                        allowAttachment &&

                                        <li className="list-inline-item">
                                            <Popover content={documentContent} title="Attachment">
                                                <Link to="#"

                                                >
                                                    <i
                                                        className="mdi mdi-plus font-size-20"
                                                        id="Filetooltip"
                                                    />
                                                    <UncontrolledTooltip
                                                        placement="top"
                                                        target="Filetooltip"
                                                    >
                                                        Add Files
                                                    </UncontrolledTooltip>
                                                </Link>
                                            </Popover>
                                        </li>
                                    }

                                </ul>
                            </div>
                        </div>
                    </Col>
                    <Col className="col-auto">
                        <Button
                            type="button"
                            color="primary"
                            onClick={() => {
                                sendMessage()
                            }}
                            className="btn btn-primary btn-rounded chat-send w-md "
                        >
                            <span className="d-none d-sm-inline-block me-2">
                                Send
                            </span>{" "}
                            <i className="mdi mdi-send" />
                        </Button>
                    </Col>
                </Row>
            }

            <Modal
                size="lg"
                isOpen={modal_large}
                toggle={() => {
                    tog_large();
                }}
                centered
                backdrop={"static"}
            >
                <div className="modal-header">
                    <h5
                        className="modal-title mt-0"
                        id="myLargeModalLabel"
                    >
                        {modalPanel === "Camera" ? "Camera" : modalPanel === "Mic" ? "Mic" : "Gallery"}
                    </h5>
                    <button
                        onClick={() => {
                            setmodal_large(false);
                            dispatch(setMarkerState(null))
                        }}
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {
                        modalPanel === "Camera" ?
                            <div className="d-flex justify-content-center">
                                <WebCam
                                    uploadAndEmit={(imageURL, currentMessage) => {
                                        uploadImageAndEmit(imageURL, currentMessage)
                                        setmodal_large(false)
                                    }}
                                    uploadVideoAndEmit={(videoURL, currentMessage) => {
                                        uploadVideoAndEmit(videoURL, currentMessage)
                                        setmodal_large(false)
                                    }}
                                    editedImage={editedImage}
                                    camImageState={editedImage && false}
                                />
                            </div> :
                            modalPanel === "Mic" ?
                                <div className="d-flex justify-content-center">
                                    <WebMic
                                        isOpen={modal_large}
                                        uploadAudioAndEmit={(audioURL, currentMessage) => {
                                            uploadAudioAndEmit(audioURL, currentMessage)
                                            setmodal_large(false)
                                        }}
                                    />
                                </div>
                                :
                                modalPanel === "Gallery" ?
                                    <div className="d-flex justify-content-center">
                                        <WebGallery
                                            uploadGalleryImageAndEmit={(imageURL, currentMessage) => {
                                                uploadImageAndEmit(imageURL, currentMessage)
                                                setmodal_large(false)
                                            }}
                                        />
                                    </div>
                                    :
                                    modalPanel === "Documents" ?
                                        <div className="d-flex justify-content-center">
                                            <WebDocument
                                                uploadDocumentAndEmit={(documentURL, currentMessage, originalName) => {
                                                    uploadDocumentAndEmit(documentURL, currentMessage, originalName)
                                                    setmodal_large(false)
                                                }}
                                            />
                                        </div> :
                                        <div>

                                        </div>
                    }
                </div>
            </Modal>
        </div>

    )

}

export default ChatInput