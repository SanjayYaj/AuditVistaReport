import React, { useState, useEffect } from "react";
import { ReactMic } from 'react-mic';
import { Card, CardBody } from 'reactstrap'

const WebMic = ({
    uploadAudioAndEmit,
    isOpen
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingStartTime, setRecordingStartTime] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [currentMessage, setCurrentMessage] = useState("");

    const onStartRecording = () => {
        setIsRecording(true);
        setRecordingStartTime(Date.now());
        setRecordingDuration(0);
    };

    const onStopRecording = (recordedBlob) => {
        setIsRecording(false);
        setAudioBlob(recordedBlob);
        setRecordingDuration(0);
    };

    useEffect(() => {
        if (!isOpen) {
            onStopRecording();
        }
    }, [isOpen]);

    useEffect(() => {
        let timer;
        if (isRecording) {
            timer = setInterval(() => {
                const currentTime = Date.now();
                const elapsed = Math.floor((currentTime - recordingStartTime) / 1000);
                setRecordingDuration(elapsed);
            }, 1000);
        } else {
            clearInterval(timer);
        }
        return () => {
            clearInterval(timer);
            setRecordingDuration(0);
        }
    }, [isRecording, recordingStartTime]);

    const sendMessage = () => {
        uploadAudioAndEmit(audioBlob, currentMessage);
        setAudioBlob(null);
    };

    return (
        <div>
            {
                !audioBlob ?
                    <div className="d-flex flex-row gap-2 align-items-center justify-content-center">
                        <div className="col-11">
                            <div className="d-flex flex-row gap-2 align-items-center" >
                                <i className="mdi mdi-microphone text-primary" style={{ fontSize: 30 }} />
                                <ReactMic
                                    record={isRecording}
                                    className="sound-wave p-2"
                                    onStop={onStopRecording}
                                    onStart={onStartRecording}
                                    strokeColor="#556ee6"
                                    backgroundColor="#dbe7ff"
                                    width={400}
                                />
                            </div>
                        </div>
                        <div className="col-1 d-flex flex-column align-items-center justify-content-center gap-2">
                            <div>
                                {
                                    !isRecording ?
                                        <div className="d-flex flex-column align-items-center gap-1">
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => setIsRecording(true)}><i className="mdi mdi-record-circle" style={{ fontSize: 30 }} /></button>
                                            <label>Record</label>
                                        </div>
                                        :
                                        <div className="d-flex flex-column align-items-center gap-1">
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => setIsRecording(false)}><i className="mdi mdi-stop" style={{ fontSize: 30 }} /></button>
                                            <label>Stop</label>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div className="d-flex flex-column gap-2" >
                        <Card style={{ border: '1px solid #e9e9e9' }}>
                            <CardBody>
                                <div className="d-flex flex-row gap-2 mb-2 align-items-center justify-content-between" >
                                    <div className="col-10 align-items-center">
                                        <audio controls controlsList="nodownload" preload="auto" >
                                            <source src={audioBlob.blobURL} type="audio/wav" />
                                        </audio>
                                    </div>
                                    <div className="col-2 d-flex flex-column align-items-center justify-content-center gap-2">
                                        <div className="d-flex flex-column align-items-center gap-1">
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => { setAudioBlob(null) }}><i className="mdi mdi-microphone-settings" style={{ fontSize: 20 }} /></button>
                                            <label>Rerecord</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex flex-row gap-2 py-2">
                                    <textarea
                                        type="text"
                                        value={currentMessage}
                                        onChange={(e) => setCurrentMessage(e.target.value)}
                                        className="form-control chat-input ps-4"
                                        placeholder="Enter Message..."
                                        rows="1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => sendMessage()}
                                        className="btn btn-primary btn-rounded chat-send w-md"
                                    >
                                        <span className="d-none d-sm-inline-block me-2">Send</span>{" "}
                                        <i className="mdi mdi-send" />
                                    </button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
            }
            {isRecording && <div>Recording Duration: {recordingDuration} seconds</div>}
        </div>
    );
};

export default WebMic;