import React, { useState, useRef } from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom"
import Dropzone from "react-dropzone";


const WebDocument = ({
    uploadDocumentAndEmit
}) => {
    const [isDocumentSelected, setIsDocumentSelected] = useState()
    const [selectedFiles, setselectedFiles] = useState([]);
    const [previewUrl, setpreviewUrl] = useState(null)
    const [currentMessage, setCurrentMessage] = useState("");
    const buttonRef = useRef(null);


    function handleAcceptedFiles(files) {
        files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        )
        setselectedFiles(files)
        setpreviewUrl(files[0].name)
        setIsDocumentSelected(true)
    }

    const reload = () => {
        setselectedFiles([])
        setpreviewUrl(null)
        setIsDocumentSelected(false)
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
        buttonRef.current.disabled = true;
        await uploadDocumentAndEmit(selectedFiles[0], currentMessage, previewUrl)

    }

    return (
        <div>
            {
                !isDocumentSelected ?
                    <div className="d-flex flex-row gap-2 align-items-center justify-content-center">
                        <div className="col-12">
                            <div className="d-flex flex-row gap-2 align-items-center" >
                                <div className="d-flex flex-column  align-items-center" style={{ zoom: 0.9 }}>
                                    <Dropzone onDrop={acceptedFiles => { handleAcceptedFiles(acceptedFiles) }} maxFiles={1} >
                                        {({ getRootProps, getInputProps }) => (
                                            <div className="dropzone">
                                                <div className="dz-message needsclick mt-2" {...getRootProps()} >
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
                        <Card style={{ border: '1px solid #e9e9e9' }}>
                            <CardBody>
                                <div className="d-flex flex-row justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center gap-2 flex-grow-1">
                                        <i className="mdi mdi-file text-warning" style={{ fontSize: 30 }} />
                                        <label className="m-0">{previewUrl}</label>
                                    </div>

                                    <div className="d-flex flex-column align-items-center gap-1">
                                        <Link to="#" className="btn btn-sm btn-outline-danger" onClick={() => reload()} >
                                            <i className="mdi mdi-file-remove" style={{ fontSize: 20 }} />
                                        </Link>
                                        <label className="m-0">Cancel</label>
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

export default WebDocument;