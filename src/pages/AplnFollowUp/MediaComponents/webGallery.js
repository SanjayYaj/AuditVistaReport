import React, { useState, useRef } from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom"
import Dropzone from "react-dropzone";
import MarkerImage from "./MarkerImage";
import { useDispatch } from "react-redux";
import { setMarkerState } from '../../../toolkitStore/Auditvista/actionPlan/Slice/actionplaninfoslice';

const WebGallery = ({
    uploadGalleryImageAndEmit
}) => {
    const dispatch = useDispatch();
    const [isImageSelected, setIsImageSelected] = useState()
    const [selectedFiles, setselectedFiles] = useState([]);
    const [previewUrl, setpreviewUrl] = useState(null)
    const [captured_url, setCaptureUrl] = useState(null)
    const [currentMessage, setCurrentMessage] = useState("");
    const [markerEnable, setMarkerEnable] = useState(false)
    const [isEdited, setIsEdited] = useState(null)
    const [imageBLOBURL, setImageBLOBURL] = React.useState(null)
    const buttonRef = useRef(null);


    function handleAcceptedFiles(files) {
        files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        )
        setselectedFiles(files)
        setpreviewUrl(files[0].preview)
        setCaptureUrl(files[0].preview)
        setIsImageSelected(true)
    }

    const reload = () => {
        setselectedFiles([])
        setpreviewUrl(null)
        setIsImageSelected(false)
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    }

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
        dispatch(setMarkerState(null))
        buttonRef.current.disabled = true;
        await uploadGalleryImageAndEmit(isEdited ? imageBLOBURL : selectedFiles[0], currentMessage)
    }

    return (
        <div>
            {
                markerEnable ?
                    <MarkerImage
                        onCancelModal={() => { setMarkerEnable(false) }}
                        onEditedImage={(data) => {
                            setpreviewUrl(data.previewUrl);
                            setImageBLOBURL(data.fileUrl);
                            setMarkerEnable(false)
                        }}
                        preview_url={isEdited ? captured_url : previewUrl}
                        actionPlan={true}
                        isEdited={(status) => { setIsEdited(status) }}
                    /> :
                    !isImageSelected ?
                        <div className="d-flex flex-row gap-2 align-items-center justify-content-center">
                            <div className="col-12">
                                <div className="d-flex flex-row gap-2 align-items-center" >
                                    <div className="d-flex flex-column  align-items-center" style={{ zoom: 0.9 }}>
                                        <Dropzone onDrop={acceptedFiles => { handleAcceptedFiles(acceptedFiles) }} maxFiles={1} accept={[".jpg", ".jpeg", ".png"]} >
                                            {({ getRootProps, getInputProps }) => (
                                                <div className="dropzone">
                                                    <div
                                                        className="dz-message needsclick mt-2"
                                                        {...getRootProps()}
                                                    >
                                                        <input {...getInputProps()} />
                                                        <div className="mb-3">
                                                            <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                        </div>
                                                        <h5>Drop files here or click to upload.</h5>
                                                    </div>
                                                </div>
                                            )}
                                        </Dropzone>
                                        <p className="py-2 text-danger font-size-12">* Only one file to select. Accepted format .jpeg, .jpg, .png</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-1 d-flex flex-column align-items-center justify-content-center gap-2">
                                <div>

                                </div>
                            </div>
                        </div>
                        :
                        <div className="d-flex flex-column gap-2" >
                            <Card style={{ border: "1px solid #e9e9e9" }}>
                                <CardBody>
                                    <div className="d-flex flex-row gap-2 mb-2 align-items-center justify-content-between" >
                                        <div className="col-10 d-flex align-items-center justify-content-center">
                                            <img src={previewUrl} width={"50%"} />
                                        </div>
                                        <div className="col-2 d-flex flex-column align-items-center justify-content-center gap-2">
                                            <div className="d-flex flex-column align-items-center gap-1">
                                                <Link to="#" className="btn btn-sm btn-outline-danger" onClick={() => {
                                                    reload()
                                                }}><i className="mdi mdi-signature-image" style={{ fontSize: 20 }} /></Link>
                                                <label>Cancel</label>
                                            </div>
                                            <div className="d-flex flex-column align-items-center gap-1">
                                                <Link to="#" className="btn btn-sm btn-outline-success" onClick={() => {
                                                    setMarkerEnable(true)
                                                }} ><i className="mdi mdi-image-edit" style={{ fontSize: 20 }} /></Link>
                                                <label>Edit</label>
                                            </div>

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
                                            rows={'1'}
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                handleKeyPress(e, true)
                                            }}
                                            ref={buttonRef}
                                            className="btn btn-primary btn-rounded chat-send w-md "
                                        >
                                            <span className="d-none d-sm-inline-block me-2">
                                                Send
                                            </span>{" "}
                                            <i className="mdi mdi-send" />
                                        </button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

            }
        </div>

    )
}

export default WebGallery;