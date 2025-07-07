import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"
import Webcam from "react-webcam";
import ImageProcess from "./imageprocess";
import MarkerImage from "./MarkerImage";
import { useDispatch } from "react-redux";
import { setMarkerState } from '../../../toolkitStore/Auditvista/actionPlan/Slice/actionplaninfoslice';

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

const WebCam = ({
    uploadAndEmit,
    uploadVideoAndEmit,
}) => {
    const dispatch = useDispatch()

    const [isRecording, setIsRecording] = React.useState(false)
    const [previewUrl, setpreviewUrl] = React.useState(null)
    const [captured_url, setCaptureUrl] = React.useState(null)
    const [isEdited, setIsEdited] = React.useState(null)
    const [imageBLOBURL, setImageBLOBURL] = React.useState(null)
    const [recordvideoBlob, setrecordvideoBlob] = React.useState()
    const [duration, setDuration] = useState(0);
    const [showCaptured, setShowCaptured] = useState(false)
    const [currentMessage, setCurrentMessage] = useState("");
    const [markerEnable, setMarkerEnable] = useState(false)
    const [showVideoRecording, setShowVideoRecording] = useState(false)
    const [showVideoPreview, setShowVideoPreview] = useState(false)
    const [disable, setdisable] = useState(false)
    const buttonRef = useRef(null);

    const videoRef = React.useRef(null)
    const mediaRecorderRef = React.useRef(null);
    const chunksRef = React.useRef([]);
    const recordingTimeoutRef = React.useRef(null);
    const webcamRef = React.useRef(null)
    const durationTarget = 3 * 60 * 1000;



    const capture = React.useCallback(
        () => {
            if (webcamRef) {
                const imageSrc = webcamRef.current.getScreenshot();
                var image_info = ImageProcess.convertBaseToURL(imageSrc);
                setpreviewUrl(imageSrc)
                setCaptureUrl(imageSrc)
                setImageBLOBURL(image_info)
                setShowCaptured(true)
                setMarkerEnable(false)
            }
        }
        , [webcamRef]);

    useEffect(() => {
        let intervalId;
        if (isRecording && duration < durationTarget) {
            intervalId = setInterval(() => {
                setDuration((prevDuration) => prevDuration + 1000);


            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isRecording, duration, durationTarget]);


    const recordVideo = async () => {
        setShowVideoRecording(true)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            videoRef.current.srcObject = stream;
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };
            mediaRecorderRef.current.onstop = () => {

                const blob = new Blob(chunksRef.current, { type: "video/mp4" });
                const videoUrl = URL.createObjectURL(blob);
                chunksRef.current.length = 0;
                setpreviewUrl(videoUrl)
                setIsRecording(false)
                setrecordvideoBlob(blob)
                setMarkerEnable(false)
                setShowVideoRecording(false)
                setShowCaptured(true)
                setShowVideoPreview(true)

            };
            setIsRecording(true)
            mediaRecorderRef.current.start();

            recordingTimeoutRef.current = setTimeout(() => {
                stopRecording();
            }, durationTarget);

        } catch (error) {
            console.error("Error accessing user media:", error);
        }
    }


    const stopRecording = () => {

        if (recordingTimeoutRef.current) {
            clearTimeout(recordingTimeoutRef.current);
        }

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            if (videoRef.current !== null) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
                setMarkerEnable(false)
                setShowVideoRecording(false)
                setShowCaptured(true)
                setShowVideoPreview(true)

                setIsRecording(false)
                setDuration(0)
            }
        }
    };


    const countWords = (text) => {
        const words = text.trim().split(/\s+/);
        return words.length;
    };

    const handleKeyPress = async (e, mode) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buttonRef.current.click()
        }
        else if (mode === true) {
            await sendMessage()
        }
    };

    const sendMessage = async () => {
        buttonRef.current.disabled = true;
        setCurrentMessage("")
        await dispatch(setMarkerState(null))
        setIsEdited(false)
        showVideoPreview ?
            await uploadVideoAndEmit(recordvideoBlob, currentMessage) :
            await uploadAndEmit(imageBLOBURL, currentMessage)
        setdisable(true)
    }





    return (
        <div>
            {
                showVideoRecording ?
                    <div className="d-flex flex-row gap-2 align-items-center justify-content-center" style={{ minWidth: 500, minHeight: 300 }}>
                        <div className="col-11">

                            {isRecording &&
                                <div className="recording-indicator">Recording...  <span className="duration-text ms-4">
                                    {`${Math.floor((durationTarget - duration) / 1000 / 60)} minutes ${(Math.floor((durationTarget - duration) / 1000) % 60)} seconds remaining`}
                                </span></div>
                            }
                            <video
                                style={{ width: "100%" }}
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                            />
                        </div>
                        <div className="col-1 d-flex flex-column align-items-center justify-content-center gap-2">
                            <div className="d-flex flex-column align-items-center gap-1">
                                <Link to="#" className="btn btn-outline-danger" onClick={() => stopRecording()}><i className="mdi mdi-stop" style={{ fontSize: 30 }} /></Link>
                                <label>Stop</label>
                            </div>
                        </div>
                    </div>
                    :
                    markerEnable ?
                        <MarkerImage
                            onCancelModal={() => { setMarkerEnable(false) }}
                            onEditedImage={(data) => {
                                setpreviewUrl(data.previewUrl);
                                setImageBLOBURL(data.fileUrl);
                                setShowCaptured(true);
                                setMarkerEnable(false)
                            }}
                            preview_url={isEdited ? captured_url : previewUrl}
                            actionPlan={true}
                            isEdited={(status) => { setIsEdited(status) }}
                        /> :
                        !showCaptured ?
                            <div className="d-flex flex-row gap-2 align-items-center justify-content-center" style={{ minWidth: 500, minHeight: 300 }}>
                                <div className="col-11">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        width={"100%"}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={videoConstraints}
                                    />
                                </div>
                                <div className="col-1 d-flex flex-column align-items-center justify-content-center gap-2">
                                    <div className="d-flex flex-column align-items-center gap-1">
                                        <Link to="#" className="btn btn-outline-primary" onClick={() => capture()}><i className="mdi mdi-camera-iris" style={{ fontSize: 30 }} /></Link>
                                        <label>Capture</label>
                                    </div>

                                    <div className="d-flex flex-column align-items-center gap-1">
                                        <Link to="#" className="btn btn-outline-danger" onClick={() => recordVideo()}><i className="mdi mdi-record-circle" style={{ fontSize: 30 }} /></Link>
                                        <label>Record</label>
                                    </div>
                                </div>
                            </div> :
                            <div className="d-flex flex-column gap-2" >
                                <div className="d-flex flex-row gap-2 align-items-center justify-content-center" style={{ minWidth: 500, minHeight: 300 }}>
                                    <div className="col-11">
                                        {
                                            showVideoPreview ?
                                                <video
                                                    style={{ width: "100%" }}
                                                    src={previewUrl}
                                                    controls
                                                />
                                                : <img src={previewUrl} width={"100%"} />
                                        }
                                    </div>
                                    <div className="col-1 d-flex flex-column align-items-center justify-content-center gap-2">
                                        <div className="d-flex flex-column align-items-center gap-1">
                                            <Link to="#" className="btn btn-outline-primary" onClick={() => {
                                                dispatch(setMarkerState(null))
                                                setIsEdited(false)
                                                setShowCaptured(false)
                                                setShowVideoPreview(false)
                                                setCurrentMessage("")
                                            }}><i className="mdi mdi-camera-retake" style={{ fontSize: 30 }} /></Link>
                                            <label>Retake</label>
                                        </div>

                                        {
                                            !showVideoPreview &&
                                            <div className="d-flex flex-column align-items-center gap-1">
                                                <Link to="#" className="btn btn-outline-success" onClick={() => {
                                                    setMarkerEnable(true)
                                                }} ><i className="mdi mdi-image-edit" style={{ fontSize: 30 }} /></Link>
                                                <label>Edit</label>
                                            </div>
                                        }



                                    </div>
                                </div>
                                <div className="d-flex flex-row gap-2 py-2">
                                    <textarea
                                        type="text"
                                        value={currentMessage}
                                        onKeyUp={(e) => { handleKeyPress(e, false) }}
                                        onChange={(e) => {
                                            if (countWords(e.target.value) <= 500) {
                                                setCurrentMessage(e.target.value);
                                            } else {
                                                alert("Error: Message should not exceed 500 words.");
                                            }
                                        }}
                                        className="form-control chat-input ps-4"
                                        placeholder="Enter Message..."
                                        style={{ minHeight: 70 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            handleKeyPress(e, true)
                                        }}
                                        disabled={disable}
                                        ref={buttonRef}
                                        className="btn btn-primary btn-rounded chat-send w-md "
                                    >
                                        <span className="d-none d-sm-inline-block me-2">
                                            Send
                                        </span>{" "}
                                        <i className="mdi mdi-send" />
                                    </button>
                                </div>
                            </div>
            }
        </div>
    )
}

export default WebCam
