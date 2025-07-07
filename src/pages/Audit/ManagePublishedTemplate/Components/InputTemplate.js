import React, { useEffect, useState } from 'react'
import {
    Row, Col, FormGroup, Button, Card, CardBody, Container, Alert, Label, Form, Progress,
    Input,
} from "reactstrap";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import OptionalComponent from './optionalComponent'
import TagsInput from 'react-tagsinput'
import { Link } from "react-router-dom"
import Dropzone from "react-dropzone"
import _ from 'lodash';
import urlSocket from 'helpers/urlSocket';

const InputTemplate = (props) => {

    const [authUser, setauthUser] = useState(null)
    const [configdatacheckpoint, setconfigdatacheckpoint] = useState([])
    const [checkpointType, setcheckpointType] = useState([])
    const [cpId, setcpId] = useState(null)
    const [selectedInputValue, setselectedInputValue] = useState("0")
    const [dataLoaded, setdataLoaded] = useState(false)
    const [submitProcess, setsubmitProcess] = useState(false)
    const [renderChild, setrenderChild] = useState(true)
    const [selectedFiles, setselectedFiles] = useState([])
    const [imageUploading, setimageUploading] = useState(false)


    useEffect(() => {
        console.log("useeffect",props);
        const fetchData = () => {
            var data = JSON.parse(sessionStorage.getItem("authUser"));
            setauthUser(data)
            var getObjectId = 0
            if (props.mode === "0") {
                setconfigdatacheckpoint(data.config_data.question_type_info.map(obj => ({ ...obj })))
                setcpId(getObjectId)
            }
            else {
                var cpk = data.config_data.question_type_info.map(obj => ({ ...obj }))
                var dataInfo =_.cloneDeep(props.checkpointinfo)
                _.each(dataInfo, child => {
                    _.each(cpk, (item, idx) => {
                        if (child.checkpoint_type_id == item.checkpoint_type_id) {
                            cpk[idx] = child
                            getObjectId = idx
                        }
                    })
                })
                console.log(cpk,'cpk');
                setconfigdatacheckpoint(cpk)
                setcpId(getObjectId)
                setselectedInputValue(cpk[getObjectId].checkpoint_type_id)
                setcheckpointType(cpk[getObjectId].checkpoint_type_id)
            }
            setdataLoaded(true)

        }
        fetchData()
    }, [])


    const onChangeParameterType = (event, values) => {
        setcheckpointType(event.target.value)
        setselectedInputValue(event.target.value)
        setcpId(parseInt(event.target.value) - 1)

    }

    const handleChildUnmount = () => {
        setrenderChild(false)
    }

    const showTemplates = (checkpoint_type) => {
        switch (checkpoint_type) {

            case "1":
                {
                    return renderChild ?
                        <OptionalComponent
                            unmountMe={handleChildUnmount}
                            checkpointinfo={configdatacheckpoint[cpId]}
                            updateState={(data)=>{
                                const updatedInfo = _.cloneDeep(configdatacheckpoint)
                                updatedInfo[cpId]=data
                                setconfigdatacheckpoint(updatedInfo)
                            }}
                            submitprocess={submitProcess}
                            checkpointCompliance={authUser.config_data.checkpoint_compliance}
                            edit={true}
                            config_data={authUser.config_data}
                        /> :
                        null

                }

            case "2":
                {
                    return renderChild ?
                        <OptionalComponent
                            unmountMe={handleChildUnmount}
                            checkpointinfo={configdatacheckpoint[cpId]}
                            updateState={(data)=>{
                                const updatedInfo = _.cloneDeep(configdatacheckpoint)
                                updatedInfo[cpId]=data
                                setconfigdatacheckpoint(updatedInfo)
                            }}
                            submitprocess={submitProcess}
                            checkpointCompliance={authUser.config_data.checkpoint_compliance}
                            edit={true}
                            config_data={authUser.config_data}
                        /> :
                        null

                }

            case "3":
                {
                    return renderChild ?
                        <OptionalComponent
                            unmountMe={handleChildUnmount}
                            checkpointinfo={configdatacheckpoint[cpId]}
                            updateState={(data)=>{
                                const updatedInfo = _.cloneDeep(configdatacheckpoint)
                                updatedInfo[cpId]=data
                                setconfigdatacheckpoint(updatedInfo)
                            }}
                            submitprocess={submitProcess}
                            checkpointCompliance={authUser.config_data.checkpoint_compliance}
                            edit={true}
                            config_data={authUser.config_data}
                        /> :
                        null

                }

            case "4":
                {
                    return renderChild ?
                        <OptionalComponent
                            unmountMe={handleChildUnmount}
                            checkpointinfo={configdatacheckpoint[cpId]}
                            updateState={(data)=>{
                                const updatedInfo = _.cloneDeep(configdatacheckpoint)
                                updatedInfo[cpId]=data
                                setconfigdatacheckpoint(updatedInfo)
                            }}
                            submitprocess={submitProcess}
                            checkpointCompliance={authUser.config_data.checkpoint_compliance}
                            edit={true}
                            config_data={authUser.config_data}
                        /> :
                        null

                }

            case "5":
                {
                    return renderChild ?
                        <OptionalComponent
                            unmountMe={handleChildUnmount}
                            checkpointinfo={configdatacheckpoint[cpId]}
                            updateState={(data)=>{
                                const updatedInfo = _.cloneDeep(configdatacheckpoint)
                                updatedInfo[cpId]=data
                                setconfigdatacheckpoint(updatedInfo)
                            }}
                            submitprocess={submitProcess}
                            checkpointCompliance={authUser.config_data.checkpoint_compliance}
                            edit={true}
                            config_data={authUser.config_data}
                        /> :
                        null

                }

            default:
                return null
        }
    }


    const handleRadioGroupChange = (event) => {
        const updatedConfigData = _.cloneDeep(configdatacheckpoint);
        updatedConfigData[cpId].impact_level = event.target.name;
        setconfigdatacheckpoint(updatedConfigData)
    }


    const handleChangeType = (tags) => {
        const updatedConfigData = _.cloneDeep(configdatacheckpoint);;
        updatedConfigData[cpId].compl_type = tags;
        setconfigdatacheckpoint(updatedConfigData)

    }

    const handleValidSubmit = (event, values) => {
        props.onSubmit(event, values)
    }

    const handleAcceptedFiles = (files) => {
        setimageUploading(false)
        files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: this.formatBytes(file.size),
                uploading: true,
                uploadingStatus: "Uploading"
            })
        )

        var configdatacheckpointInfo = _.cloneDeep(configdatacheckpoint)
        var selectedFilesInfo = _.cloneDeep(selectedFiles)
        setselectedFiles(selectedFilesInfo.concat(files))
        let formData = new FormData()
        for (const key of Object.keys(files)) {
            formData.append('imagesArray', files[key])
        }

        try {
            urlSocket.post("storeImage/awswebupload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            },
                {
                    onUploadProgress: progressEvent => {
                        if (progressEvent.loaded === progressEvent.total) {
                        }

                    }
                }).then(response => {
                    console.log(response, 'response')
                    if (response.data.response_code == 500) {
                        configdatacheckpointInfo[cpId].guideline_image.push(response.data.data[0])
                        setconfigdatacheckpoint(configdatacheckpointInfo)
                        _.each(response.data.data, item => {
                            _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
                                console.log(child, item)
                                if (child.originalname == item.originalname) {
                                    let splitString = item.key.split("/");
                                    let getFileName = splitString[splitString.length - 1];

                                    child["uploading"] = false
                                    child["uploadingStatus"] = "Uploaded"
                                    child["preview"] = authUser.config_data.img_url + getFileName
                                }
                            })
                        })
                        setimageUploading(false)
                    }
                    else {
                        _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
                            child["uploading"] = false
                            child["uploadingStatus"] = "Not Uploaded"
                        })
                        setimageUploading(false)
                    }

                })
        } catch (error) {
            console.log(error, 'error308')
        }

    }

    const deleteImage = (id) => {
        const updatecheckInfo = _.cloneDeep(configdatacheckpoint)
        updatecheckInfo[cpId].guideline_image.splice(id, 1)
        setconfigdatacheckpoint(updatecheckInfo)
    }


    const validateCheckpoint = (data) => {

        setsubmitProcess(true)
        var inputMissing = false

        if (data.checkpoint == "") {
            inputMissing = true
        }
        console.log(data, 'data')

        _.each(data.checkpoint_options, item => {
            {
                console.log(item, item.no_of_video > authUser.config_data.max_photos)
            }
            if (item.option_text == "") {
                inputMissing = true
            }
            if (item.enable_img && (Number.isNaN(item.no_of_img) || item.no_of_img == 0 || (!item.enable_gallery && !item.enable_cam))) {
                inputMissing = true
            }
            if (item.enable_video && item.no_of_video > authUser.config_data.max_photos) {
                inputMissing = true
            }
            if (item.enable_video && item.no_of_video === undefined) {
                item.no_of_video = 1
            }
            if (item.enable_video && (Number.isNaN(item.no_of_video) || item.no_of_video == 0 || (!item.enable_video_gallery && !item.enable_video_cam))) {
                inputMissing = true
            }
            if (item.enable_video && (Number.isNaN(item.no_of_video) || item.no_of_video == 0 || (!item.enable_video_gallery && !item.enable_video_cam))) {
                inputMissing = true
            }
            if (item.default_video_duration > Number(authUser.config_data.max_video_duration)) {
                inputMissing = true
            }
            if (item.enable_doc && item.documents.length == 0) {
                inputMissing = true
            }
            if (item.enable_score && Number.isNaN(item.score)) {
                inputMissing = true
            }
            var getComplianceStatus = _.some(item.compliance, { 'is_selected': true });
            if (!getComplianceStatus) {
                inputMissing = true
            }
        })

        if (data.impact_level == "") {
            inputMissing = true
        }

        if (!inputMissing && !imageUploading) {
            console.log(data,'data');
            props.onSubmit(data)
        }
    }




    if (dataLoaded) {
        return (
            <div>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={12}>
                            <AvForm className="form-horizontal" >
                                <div className="px-4 py-2">

                                    <Row className="mt-4" >
                                        <div className="mb-4">

                                            <Label className="" htmlFor="autoSizingSelect">Select Check point Type<span className="text-danger">*</span></Label>
                                            <select
                                                type="select"
                                                name="subtitledd"
                                                label="Name"
                                                value={selectedInputValue}
                                                className="form-select"
                                                id="cat"
                                                onChange={(e) => onChangeParameterType(e)}
                                            >
                                                <option value="0" defaultValue="0">Choose...</option>
                                                {
                                                    configdatacheckpoint.map((data, idx) => {
                                                        return (
                                                            <option value={data.checkpoint_type_id} key={idx}>{data.checkpoint_type}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </Row>
                                    {
                                        selectedInputValue !== "0" ?
                                            <Row>
                                                <div className="mb-3" >
                                                    <Label className="" >Check point</Label><span className="text-danger" style={{ fontSize: "smaller" }}>*</span>

                                                    <AvField
                                                        name="title"
                                                        value={configdatacheckpoint[cpId].checkpoint}
                                                        onChange={(e) => {
                                                            const updatedConfigData = _.cloneDeep(configdatacheckpoint);
                                                            updatedConfigData[cpId].checkpoint = e.target.value.trim();
                                                            // this.setState({ configdatacheckpoint: updatedConfigData, refresh: true });
                                                            setconfigdatacheckpoint(updatedConfigData)
                                                        }}
                                                        className="form-control"
                                                        placeholder="Enter Check point"
                                                        type="textarea"
                                                        validate={{
                                                            required: {
                                                                value: submitProcess && configdatacheckpoint[cpId].checkpoint === "" ? true : false
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </Row>
                                            : null
                                    }
                                    <Row>
                                        <Col md={12}>
                                            {showTemplates(checkpointType)}
                                        </Col>

                                    </Row>

                                    {
                                        selectedInputValue !== "0" ?
                                            <Row style={{ padding: 10 }}>
                                                <div className="my-2 d-flex flex-column" style={{
                                                    padding: 10,
                                                    border: submitProcess && configdatacheckpoint[cpId].impact_level == "" ? '1px solid #ff0000' : '0px'
                                                }}>
                                                    <label>Impact Level<span className="text-danger" style={{ fontSize: "smaller" }}>*</span></label>
                                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                        <div className="form-check mx-2 form-radio-danger">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="Critical"
                                                                id="exampleRadios1"
                                                                value={configdatacheckpoint[cpId].impact_level}
                                                                onClick={handleRadioGroupChange}
                                                                checked={configdatacheckpoint[cpId].impact_level === "Critical"}
                                                            />
                                                            <label
                                                                className="form-check-label text-danger"
                                                                htmlFor="exampleRadios1"
                                                            >
                                                                Critical
                                                            </label>
                                                        </div>
                                                        <div className="form-check mx-2 form-radio-warning">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="High"
                                                                id="exampleRadios2"
                                                                value={configdatacheckpoint[cpId].impact_level}
                                                                onClick={handleRadioGroupChange}
                                                                checked={configdatacheckpoint[cpId].impact_level === "High"}
                                                            />
                                                            <label
                                                                className="form-check-label text-warning"
                                                                htmlFor="exampleRadios2"
                                                            >
                                                                High
                                                            </label>
                                                        </div>
                                                        <div className="form-check mx-2 form-radio-info">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="Medium"
                                                                id="exampleRadios3"
                                                                value={configdatacheckpoint[cpId].impact_level}
                                                                onClick={handleRadioGroupChange}
                                                                checked={configdatacheckpoint[cpId].impact_level === "Medium"}
                                                            />
                                                            <label
                                                                className="form-check-label text-info"
                                                                htmlFor="exampleRadios3"
                                                            >
                                                                Medium
                                                            </label>
                                                        </div>
                                                        <div className="form-check mx-2 form-radio-success">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="Low"
                                                                id="exampleRadios4"
                                                                value={configdatacheckpoint[cpId].impact_level}
                                                                onClick={handleRadioGroupChange}
                                                                checked={configdatacheckpoint[cpId].impact_level === "Low"}
                                                            />
                                                            <label
                                                                className="form-check-label text-success"
                                                                htmlFor="exampleRadios4"
                                                            >
                                                                Low
                                                            </label>
                                                        </div>
                                                        <div className="form-check mx-2 form-radio-primary">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="No impact"
                                                                id="exampleRadios5"
                                                                value={configdatacheckpoint[cpId].impact_level}
                                                                onClick={handleRadioGroupChange}
                                                                checked={configdatacheckpoint[cpId].impact_level === "No impact"}
                                                            />
                                                            <label
                                                                className="form-check-label text-primary"
                                                                htmlFor="exampleRadios5"
                                                            >
                                                                No impact
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {submitProcess && configdatacheckpoint[cpId].impact_level == "" ? <div  >
                                                        <span className="font-size-10 text-danger" style={{ lineHeight: 1, }}>Select any one impact level </span>
                                                    </div> : null}
                                                </div>
                                                <div className="my-2 d-flex flex-column" style={{ padding: 10, }}>
                                                    <label>Type</label>
                                                    <div >
                                                        <TagsInput
                                                            value={configdatacheckpoint[cpId].compl_type}
                                                            onChange={handleChangeType}
                                                            inputProps={
                                                                { placeholder: 'Add a type and hit enter' }
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="my-2 d-flex flex-column" style={{ padding: 10, }}>
                                                    <AvForm className="form-horizontal" onValidSubmit={handleValidSubmit}>
                                                        <div className="mb-3" >
                                                            <AvField
                                                                name="guideline"
                                                                label="Guideline"
                                                                value={configdatacheckpoint[cpId].guideline}
                                                                onChange={(e) => {
                                                                    const updatedConfigData = _.cloneDeep(configdatacheckpoint);
                                                                    updatedConfigData[cpId].guideline = e.target.value;
                                                                    setconfigdatacheckpoint(updatedConfigData)
                                                                    // this.setState({ configdatacheckpoint: updatedConfigData, refresh: true });
                                                                }}
                                                                className="form-control"
                                                                placeholder="Enter Guideline"
                                                                type="textarea"
                                                                required
                                                            />

                                                        </div>
                                                    </AvForm>
                                                    <label>Add images for guidelines</label>
                                                    <Form>
                                                        <Dropzone
                                                            onDrop={acceptedFiles =>
                                                                handleAcceptedFiles(acceptedFiles)
                                                            }
                                                            accept={[".jpg", ".jpeg", ".png"]}
                                                        >
                                                            {({ getRootProps, getInputProps }) => (
                                                                <div className="dropzone">
                                                                    <div
                                                                        className="dz-message needsclick"
                                                                        {...getRootProps()}
                                                                    >
                                                                        <input {...getInputProps()} />
                                                                        <div className="mb-3">
                                                                            <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                                        </div>
                                                                        <h4>Drop files here or click to upload.</h4>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Dropzone>
                                                        <div
                                                            className="dropzone-previews mt-3"
                                                            id="file-previews"
                                                        >
                                                            {configdatacheckpoint[cpId].guideline_image.map((f, i) => {
                                                                return (
                                                                    <Card
                                                                        className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                                        key={i + "-file"}
                                                                    >
                                                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                            <div className="p-2" style={{ width: '95%' }}>
                                                                                <Row className="align-items-center">
                                                                                    <Col className="col-auto">
                                                                                        <img
                                                                                            data-dz-thumbnail=""
                                                                                            height="80"
                                                                                            className="avatar-sm rounded bg-light"
                                                                                            alt={f.name}
                                                                                            src={f.preview}
                                                                                        />
                                                                                    </Col>
                                                                                    <Col>
                                                                                        <Link
                                                                                            to="#"
                                                                                            className="text-muted font-weight-bold"
                                                                                        >
                                                                                            {f.name}
                                                                                        </Link>
                                                                                        <p className="mb-0">
                                                                                            <strong>{f.formattedSize}</strong>
                                                                                        </p>
                                                                                    </Col>

                                                                                </Row>
                                                                                <div style={{ margin: '5px 0 5px 0' }}>
                                                                                    <span className={f.uploading ? "font-size-10 text-danger" : "font-size-10 text-success"}>{f.uploadingStatus}</span>
                                                                                </div>

                                                                            </div>
                                                                            <div style={{ width: '5%', textAlign: 'center' }}>
                                                                                <Link to="#" onClick={() => deleteImage(i)}><i className="mdi mdi-close-circle-outline font-size-20 text-danger" /></Link>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                )
                                                            })}
                                                        </div>

                                                    </Form>
                                                </div>
                                            </Row>
                                            : null

                                    }
                                    {
                                        selectedInputValue !== "0" ?
                                            <Row>
                                                <footer
                                                    className="ps-0"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: "center",
                                                        height: 50,
                                                        background: "#fff",
                                                        width: "100%",
                                                        position: "fixed",
                                                        bottom: 0,
                                                        zIndex: 999,
                                                        borderTop: "1px solid #dedede"
                                                    }}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center", }}>

                                                        <>
                                                            <div style={{ marginRight: 10 }}>
                                                                <button className="btn btn-sm btn-outline-success btn-block m-1" type="submit" onClick={() => validateCheckpoint(configdatacheckpoint[cpId])}>
                                                                    {props.mode == "0" ? "Submit" : "Update"}
                                                                </button>
                                                            </div>
                                                        </>
                                                    </div>
                                                </footer>


                                            </Row>
                                            :

                                            null
                                    }


                                </div>
                            </AvForm>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
    else {
        return null
    }
}
export default InputTemplate


// import React, { useState, useEffect, useCallback } from "react";
// import ReactDOM from 'react-dom';
// import {
//     Row, Col, FormGroup, Button, Card, CardBody, Container, Alert, Label, Form, Progress,
//     Input,
// } from "reactstrap";
// import Select from "react-select";
// import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
// import { Link } from "react-router-dom"
// import Dropzone from "react-dropzone"
// import TagsInput from 'react-tagsinput'
// import 'react-tagsinput/react-tagsinput.css'

// // import InputType from './InputType';
// // import OptionsType from './OptionsType';
// // import TrueFalse from './TrueFalse';
// import OptionalComponent from './optionalComponent.js';

// const _ = require('lodash')
// import urlSocket from "../../../../helpers/urlSocket";

// const InputTemplate = (props) => {
//     console.log(props,'props');
//     const [editable, setEditable] = useState(true);
//     const [dataLoaded, setDataLoaded] = useState(false);
//     const [selectedInputValue, setSelectedInputValue] = useState("0");
//     const [rows, setRows] = useState([]);
//     const [rows1, setRows1] = useState([]);
//     const [selectedFiles, setSelectedFiles] = useState([]);
//     const [tags, setTags] = useState([]);
//     const [renderChild, setRenderChild] = useState(true);
//     const [checkpointStatus, setCheckpointStatus] = useState(false);
//     const [submitProcess, setSubmitProcess] = useState(false);
//     const [imageUploading, setImageUploading] = useState(false);
//     const [configdatacheckpoint, setConfigDataCheckpoint] = useState([]);
//     const [cpId, setCpId] = useState(0);
//     const [checkpoint_type, setCheckpoint_type] = useState("");
//     const [imagePreviewUrl, setImagePreviewUrl] = useState("");
//     const [imageToken, setImageToken] = useState("");
//     const [checkpointCompliance, setCheckpointCompliance] = useState("");
//     const [config_data, setConfig_data] = useState({});
//     const [max_video_duration, setMax_video_duration] = useState(0);
//     const [refresh, setRefresh] = useState(false);

//     useEffect(() => {
//         getSession();
//     }, []);

//     const getSession = () => {

//         console.log("getsession")
//         var data = JSON.parse(sessionStorage.getItem("authUser"));
//         let configData = data.config_data;
//         let config_data = data;
//         setImagePreviewUrl(data.config_data.img_url);
//         setImageToken(data.config_data.img_url);
//         setCheckpointCompliance(configData.checkpoint_compliance);
//         setConfig_data(config_data.client_info[0]);
//         setMax_video_duration(Number(config_data.client_info[0].max_video_duration.$numberDecimal));

//         var getObjectId = 0;

//         if (props.mode == "0") {
//             setConfigDataCheckpoint(configData.question_type_info.map(obj => ({ ...obj })));
//             setCpId(getObjectId);
//             setDataLoaded(true);
//         } else {
//             var cpk = configData.question_type_info.map(obj => ({ ...obj }));
//             _.each(props.checkpointinfo, child => {
//                 _.each(cpk, (item, idx) => {
//                     if (child?.checkpoint_type_id == item?.checkpoint_type_id) {
//                         cpk[idx] = child;
//                         getObjectId = idx;
//                     }
//                 });
//             });

//             console.log("cpk",cpk)
//             setConfigDataCheckpoint(cpk);
//             setCpId(getObjectId);
//             setSelectedInputValue(cpk[getObjectId].checkpoint_type_id);
//             setCheckpoint_type(cpk[getObjectId].checkpoint_type_id);
//             setDataLoaded(true);
//         }
//     };

//     const onChangeParameterType = (event) => {
//         setCheckpoint_type(event.target.value);
//         setSelectedInputValue(event.target.value);
//         setCpId(parseInt(event.target.value) - 1);
//     };

//     const handleChildUnmount = () => {
//         setRenderChild(false);
//     };

//     const showTemplates = (checkpoint_type) => {
//         switch (checkpoint_type) {
//             case "1":
//             case "2":
//             case "3":
//             case "4":
//             case "5":
//                 return renderChild ?
//                     <OptionalComponent
//                         unmountMe={handleChildUnmount}
//                         checkpointinfo={configdatacheckpoint[cpId]}
//                         submitprocess={submitProcess}
//                         checkpointCompliance={checkpointCompliance}
//                         edit={true}
//                         config_data={config_data}
//                     /> :
//                     null;
//             default:
//                 return null;
//         }
//     };

//     const handleValidSubmit = (event, values) => {
//         console.log("values",values)
//         props.onSubmit(event, values);
//     };

//     const handleAddRow = () => {
//         const item = {
//             name: "",
//         };
//         setRows([...rows, item]);
//     };

//     const handleAddRowNested = () => {
//         const item1 = {
//             name1: "",
//         };
//         setRows1([...rows1, item1]);
//     };

//     const handleRemoveRow = (e, idx) => {
//         if (typeof idx != "undefined")
//             document.getElementById("addr" + idx).style.display = "none";
//     };

//     const handleRemoveRowNested = (e, idx) => {
//         document.getElementById("nested" + idx).style.display = "none";
//     };


//     const handleAcceptedFiles = (files) => {
//         setImageUploading(true);

//         const updatedFiles = files.map(file =>
//             Object.assign(file, {
//                 preview: URL.createObjectURL(file),
//                 formattedSize: formatBytes(file.size),
//                 uploading: true,
//                 uploadingStatus: "Uploading"
//             })
//         );

//         console.log("updatedFiles",updatedFiles)

//         setSelectedFiles(prevFiles => [...prevFiles, ...updatedFiles]);

//         let formData = new FormData();
//         updatedFiles.forEach(file => formData.append("imagesArray", file));

//         console.log("formData",formData)

//         urlSocket.post("storeImage/awswebupload", formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//             onUploadProgress: (progressEvent) => {
//                 if (progressEvent.loaded === progressEvent.total) {
//                     // Handle progress completion if needed
//                 }
//             }
//         })
//         .then(response => {
//             console.log("respose",response)
//             if (response.data.response_code === 500) {
//                 let updatedConfig = [...configdatacheckpoint];
//                 updatedConfig[cpId].guideline_image.push(response.data.data[0]);

//                 setConfigDataCheckpoint(updatedConfig);

//                 response.data.data.forEach(item => {
//                     updatedConfig[cpId].guideline_image.forEach(child => {
//                         if (child.originalname === item.originalname) {
//                             let getFileName = item.key.split("/").pop();
//                             child.uploading = false;
//                             child.uploadingStatus = "Uploaded";
//                             child.preview = imagePreviewUrl + getFileName;
//                         }
//                     });
//                 });

//                 setImageUploading(false);
//                 setRefresh(prev => !prev);
//             } else {
//                 let updatedConfig = [...configdatacheckpoint];
//                 updatedConfig[cpId].guideline_image.forEach(child => {
//                     child.uploading = false;
//                     child.uploadingStatus = "Not Uploaded";
//                 });

//                 setImageUploading(false);
//                 setRefresh(prev => !prev);
//             }
//         })
//         .catch(error => {
//             console.error(error, "Upload Error");
//             setImageUploading(false);
//         });
//     };
    
    
    
    
//     const deleteImage = (id) => {
//         configdatacheckpoint[cpId].guideline_image.splice(id, 1);
//         setRefresh(true);
//     };

//     const formatBytes = (bytes, decimals = 2) => {
//         if (bytes === 0) return "0 Bytes";
//         const k = 1024;
//         const dm = decimals < 0 ? 0 : decimals;
//         const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
//     };

//     const handleChangeTextBox = (tags) => {
//         const updatedConfigData = [...configdatacheckpoint];
//         updatedConfigData[cpId].custom_tbx = tags;
//         setConfigDataCheckpoint(updatedConfigData);
//         setRefresh(true);
//     };

//     const handleChangeType = (tags) => {
//         const updatedConfigData = [...configdatacheckpoint];
//         updatedConfigData[cpId].compl_type = tags;
//         setConfigDataCheckpoint(updatedConfigData);
//         setRefresh(true);
//     };

//     const handleRadioGroupChange = (event) => {
//         console.log("evennnnn",event)
//         const updatedConfigData = [...configdatacheckpoint];
//         updatedConfigData[cpId].impact_level = event.target.name;
//         setConfigDataCheckpoint(updatedConfigData);
//         setRefresh(true);
//     };

//     const validateCheckpoint = (data) => {
//         setSubmitProcess(true);

//         console.log("data",data)

//         var inputMissing = false;

//         if (data.checkpoint == "") {
//             inputMissing = true;
//         }

//         _.each(data.checkpoint_options, item => {
//             if (item.option_text == "") {
//                 inputMissing = true;
//             }
//             if (item.enable_img && (Number.isNaN(item.no_of_img) || item.no_of_img == 0 || (!item.enable_gallery && !item.enable_cam))) {
//                 inputMissing = true;
//             }
//             if (item.enable_video && item.no_of_video > config_data.max_photos) {
//                 inputMissing = true;
//             }
//             if (item.enable_video && item.no_of_video === undefined) {
//                 item.no_of_video = 1;
//             }
//             if (item.enable_video && (Number.isNaN(item.no_of_video) || item.no_of_video == 0 || (!item.enable_video_gallery && !item.enable_video_cam))) {
//                 inputMissing = true;
//             }
//             if (item.enable_video && (Number.isNaN(item.no_of_video) || item.no_of_video == 0 || (!item.enable_video_gallery && !item.enable_video_cam))) {
//                 inputMissing = true;
//             }
//             if (item.default_video_duration > Number(max_video_duration)) {
//                 inputMissing = true;
//             }
//             if (item.enable_doc && item.documents.length == 0) {
//                 inputMissing = true;
//             }
//             if (item.enable_score && Number.isNaN(item.score)) {
//                 inputMissing = true;
//             }
//             var getComplianceStatus = _.some(item.compliance, { 'is_selected': true });
//             if (!getComplianceStatus) {
//                 inputMissing = true;
//             }
//         });

//         if (data.impact_level == "") {
//             inputMissing = true;
//         }

//         if (!inputMissing && !imageUploading) {
//             console.log("submitif")
//             props.onSubmit(data);
//         }
//     };

//     if (!dataLoaded) {
//         return null;
//     }

//     return (
//         <div>
//             <Container>
//                 <Row className="justify-content-center">
//                     <Col md={12}>
//                     {
//                         console.log(configdatacheckpoint,'configdatacheckpoint')
//                     }
                   
//                         <AvForm className="form-horizontal">
//                             <div className="px-4 py-2">
//                                 <Row className="mt-4">
//                                     <div className="mb-4">
//                                         <Label className="" htmlFor="autoSizingSelect">Select Check point Type<span className="text-danger">*</span></Label>
//                                         <select
//                                             type="select"
//                                             name="subtitledd"
//                                             label="Name"
//                                             value={selectedInputValue}
//                                             className="form-select"
//                                             id="cat"
//                                             onChange={(e) => onChangeParameterType(e)}
//                                         >
//                                             <option value="0" defaultValue="0">Choose...</option>
//                                             {
//                                                 configdatacheckpoint.map((data, idx) => {
//                                                     return (
//                                                         <option value={data.checkpoint_type_id} key={idx}>{data.checkpoint_type}</option>
//                                                     )
//                                                 })
//                                             }
//                                         </select>
//                                     </div>
//                                 </Row>
//                                 {selectedInputValue != "0" ?
//                                     <Row>
//                                         <div className="mb-3">
//                                             <Label className="">Check point</Label><span className="text-danger" style={{ fontSize: "smaller" }}>*</span>
//                                             <AvField
//                                                 name="title"
//                                                 value={configdatacheckpoint[cpId].checkpoint}
//                                                 onChange={(e) => {
//                                                     const updatedConfigData = [...configdatacheckpoint];
//                                                     updatedConfigData[cpId].checkpoint = e.target.value.trim();
//                                                     setConfigDataCheckpoint(updatedConfigData);
//                                                     setRefresh(true);
//                                                 }}
//                                                 className="form-control"
//                                                 placeholder="Enter Check point"
//                                                 type="textarea"
//                                                 validate={{
//                                                     required: {
//                                                         value: submitProcess && configdatacheckpoint[cpId].checkpoint === "" ? true : false
//                                                     }
//                                                 }}
//                                             />
//                                         </div>
//                                     </Row>
//                                     : null
//                                 }
//                                 <Row>
//                                     <Col md={12}>
//                                         {showTemplates(checkpoint_type)}
//                                     </Col>
//                                 </Row>
//                                 {selectedInputValue != "0" ?
//                                     <Row style={{ padding: 10 }}>
//                                         <div className="my-2 d-flex flex-column" style={{
//                                             padding: 10,
//                                             border: submitProcess && configdatacheckpoint[cpId].impact_level == "" ? '1px solid #ff0000' : '0px'
//                                         }}>
//                                             <label>Impact Level<span className="text-danger" style={{ fontSize: "smaller" }}>*</span></label>
//                                             <div style={{ display: 'flex', flexDirection: 'row' }}>
//                                                 <div className="form-check mx-2 form-radio-danger">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="radio"
//                                                         name="Critical"
//                                                         id="exampleRadios1"
//                                                         value={configdatacheckpoint[cpId].impact_level}
//                                                         onClick={handleRadioGroupChange}
//                                                         checked={configdatacheckpoint[cpId].impact_level === "Critical"}
//                                                     />
//                                                     <label
//                                                         className="form-check-label text-danger"
//                                                         htmlFor="exampleRadios1"
//                                                     >
//                                                         Critical
//                                                     </label>
//                                                 </div>
//                                                 <div className="form-check mx-2 form-radio-warning">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="radio"
//                                                         name="High"
//                                                         id="exampleRadios2"
//                                                         value={configdatacheckpoint[cpId].impact_level}
//                                                         onClick={handleRadioGroupChange}
//                                                         checked={configdatacheckpoint[cpId].impact_level === "High"}
//                                                     />
//                                                     <label
//                                                         className="form-check-label text-warning"
//                                                         htmlFor="exampleRadios2"
//                                                     >
//                                                         High
//                                                     </label>
//                                                 </div>
//                                                 <div className="form-check mx-2 form-radio-info">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="radio"
//                                                         name="Medium"
//                                                         id="exampleRadios3"
//                                                         value={configdatacheckpoint[cpId].impact_level}
//                                                         onClick={handleRadioGroupChange}
//                                                         checked={configdatacheckpoint[cpId].impact_level === "Medium"}
//                                                     />
//                                                     <label
//                                                         className="form-check-label text-info"
//                                                         htmlFor="exampleRadios3"
//                                                     >
//                                                         Medium
//                                                     </label>
//                                                 </div>
//                                                 <div className="form-check mx-2 form-radio-success">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="radio"
//                                                         name="Low"
//                                                         id="exampleRadios4"
//                                                         value={configdatacheckpoint[cpId].impact_level}
//                                                         onClick={handleRadioGroupChange}
//                                                         checked={configdatacheckpoint[cpId].impact_level === "Low"}
//                                                     />
//                                                     <label
//                                                         className="form-check-label text-success"
//                                                         htmlFor="exampleRadios4"
//                                                     >
//                                                         Low
//                                                     </label>
//                                                 </div>
//                                                 <div className="form-check mx-2 form-radio-primary">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="radio"
//                                                         name="No impact"
//                                                         id="exampleRadios5"
//                                                         value={configdatacheckpoint[cpId].impact_level}
//                                                         onClick={handleRadioGroupChange}
//                                                         checked={configdatacheckpoint[cpId].impact_level === "No impact"}
//                                                     />
//                                                     <label
//                                                         className="form-check-label text-primary"
//                                                         htmlFor="exampleRadios5"
//                                                     >
//                                                         No impact
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                             {submitProcess && configdatacheckpoint[cpId].impact_level == "" ? <div>
//                                                 <span className="font-size-10 text-danger" style={{ lineHeight: 1, }}>Select any one impact level </span>
//                                             </div> : null}
//                                         </div>
//                                         <div className="my-2 d-flex flex-column" style={{ padding: 10, }}>
//                                             <label>Type</label>
//                                             <div>
//                                                 <TagsInput
//                                                     value={configdatacheckpoint[cpId].compl_type}
//                                                     onChange={handleChangeType}
//                                                     inputProps={
//                                                         { placeholder: 'Add a type and hit enter' }
//                                                     }
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="my-2 d-flex flex-column" style={{ padding: 10, }}>
//                                             <AvForm className="form-horizontal" onValidSubmit={handleValidSubmit}>
//                                                 <div className="mb-3">
//                                                     <AvField
//                                                         name="guideline"
//                                                         label="Guideline"
//                                                         value={configdatacheckpoint[cpId].guideline}
//                                                         onChange={(e) => {
//                                                             const updatedConfigData = [...configdatacheckpoint];
//                                                             updatedConfigData[cpId].guideline = e.target.value;
//                                                             setConfigDataCheckpoint(updatedConfigData);
//                                                             setRefresh(true);
//                                                         }}
//                                                         className="form-control"
//                                                         placeholder="Enter Guideline"
//                                                         type="textarea"
//                                                         required
//                                                     />
//                                                 </div>
//                                             </AvForm>
//                                             <label>Add images for guidelines</label>
//                                             <Form>
//                                                 <Dropzone
//                                                     onDrop={acceptedFiles =>
//                                                         handleAcceptedFiles(acceptedFiles)
//                                                     }
//                                                     accept={[".jpg", ".jpeg", ".png"]}
//                                                 >
//                                                     {({ getRootProps, getInputProps }) => (
//                                                         <div className="dropzone">
//                                                             <div
//                                                                 className="dz-message needsclick"
//                                                                 {...getRootProps()}
//                                                             >
//                                                                 <input {...getInputProps()} />
//                                                                 <div className="mb-3">
//                                                                     <i className="display-4 text-muted bx bxs-cloud-upload" />
//                                                                 </div>
//                                                                 <h4>Drop files here or click to upload.</h4>
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                 </Dropzone>
//                                                 <div
//                                                     className="dropzone-previews mt-3"
//                                                     id="file-previews"
//                                                 >
//                                                     {configdatacheckpoint[cpId].guideline_image.map((f, i) => {
//                                                         return (
//                                                             <Card
//                                                                 className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
//                                                                 key={i + "-file"}
//                                                             >
//                                                                 <div style={{ display: 'flex', flexDirection: 'row' }}>
//                                                                     <div className="p-2" style={{ width: '95%' }}>
//                                                                         <Row className="align-items-center">
//                                                                             <Col className="col-auto">
//                                                                                 <img
//                                                                                     data-dz-thumbnail=""
//                                                                                     height="80"
//                                                                                     className="avatar-sm rounded bg-light"
//                                                                                     alt={f.name}
//                                                                                     src={f.preview}
//                                                                                 />
//                                                                             </Col>
//                                                                             <Col>
//                                                                                 <Link
//                                                                                     to="#"
//                                                                                     className="text-muted font-weight-bold"
//                                                                                 >
//                                                                                     {f.name}
//                                                                                 </Link>
//                                                                                 <p className="mb-0">
//                                                                                     <strong>{f.formattedSize}</strong>
//                                                                                 </p>
//                                                                             </Col>
//                                                                         </Row>
//                                                                         <div style={{ margin: '5px 0 5px 0' }}>
//                                                                             <span className={f.uploading ? "font-size-10 text-danger" : "font-size-10 text-success"}>{f.uploadingStatus}</span>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div style={{ width: '5%', textAlign: 'center' }}>
//                                                                         <Link to="#" onClick={() => deleteImage(i)}><i className="mdi mdi-close-circle-outline font-size-20 text-danger" /></Link>
//                                                                     </div>
//                                                                 </div>
//                                                             </Card>
//                                                         )
//                                                     })}
//                                                 </div>
//                                             </Form>
//                                         </div>
//                                     </Row> : null
//                                 }
//                                 {selectedInputValue != "0" ?
//                                     <Row>
//                                         <footer
//                                             className="ps-0"
//                                             style={{
//                                                 display: 'flex',
//                                                 alignItems: "center",
//                                                 height: 50,
//                                                 background: "#fff",
//                                                 width: "100%",
//                                                 position: "fixed",
//                                                 bottom: 0,
//                                                 zIndex: 999,
//                                                 borderTop: "1px solid #dedede"
//                                             }}>
//                                             <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center", }}>
//                                                 <div style={{ marginRight: 10 }}>
//                                                     <button className="btn btn-sm btn-outline-success btn-block m-1" type="submit" onClick={() => validateCheckpoint(configdatacheckpoint[cpId])}>
//                                                         {props.mode == "0" ? "Submit" : "Update"}
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </footer>
//                                     </Row> : null
//                                 }
//                             </div>
//                         </AvForm>
//                     </Col>
//                 </Row>
//             </Container>
//         </div>
//     );
// };

// export default InputTemplate;