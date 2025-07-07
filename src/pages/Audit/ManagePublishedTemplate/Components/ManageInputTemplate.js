import React, { useEffect, useState } from 'react'
import { Row, Col, FormGroup, Card, Container, Label, Form, Input } from "reactstrap";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import OptionalComponent from './optionalComponent'
import TagsInput from 'react-tagsinput'
import { Link } from "react-router-dom"
import Dropzone from "react-dropzone"
import _ from 'lodash';
import urlSocket from 'helpers/urlSocket';
import { useSelector } from 'react-redux';
import ManageOperatorComponent from './ManageOperatorComponent';
import ManageCheckpointConfigSection from './ManageCheckpointConfigSection';


const ManageInputTemplate = (props) => {

    const state = useSelector(state => state.manageTreeSlice);


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
                var dataInfo = _.cloneDeep(props.checkpointinfo)
                _.each(dataInfo, child => {
                    _.each(cpk, (item, idx) => {
                        if (child.checkpoint_type_id == item.checkpoint_type_id) {
                            cpk[idx] = child
                            getObjectId = idx
                        }
                    })
                })
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
        setconfigdatacheckpoint(authUser.config_data.question_type_info.map(obj => ({ ...obj })))
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
                            submitProcess={submitProcess}
                            edit={true}
                            config_data={authUser.config_data}
                            enable_validation={configdatacheckpoint[cpId].enable_validation}
                            updateState={(data) => {
                                const updatedInfo = _.cloneDeep(configdatacheckpoint)
                                updatedInfo[cpId] = data
                                console.log('updatedInfo :>> ', updatedInfo);
                                setconfigdatacheckpoint(updatedInfo)
                            }}
                            selectedInputValue={selectedInputValue}
                        /> :
                        null

                }

            case "2":
                {
                    return renderChild ?
                        <OptionalComponent
                            unmountMe={handleChildUnmount}
                            checkpointinfo={configdatacheckpoint[cpId]}
                            submitProcess={submitProcess}
                            edit={true}
                            config_data={authUser.config_data}
                            enable_validation={configdatacheckpoint[cpId].enable_validation}
                            updateState={(data) => {
                                const updatedInfo = _.cloneDeep(configdatacheckpoint)
                                updatedInfo[cpId] = data
                                setconfigdatacheckpoint(updatedInfo)
                            }}
                            selectedInputValue={selectedInputValue}
                        /> :
                        null

                }

            case "3":
                {
                    return renderChild ?
                        <OptionalComponent
                            unmountMe={handleChildUnmount}
                            checkpointinfo={configdatacheckpoint[cpId]}
                            submitProcess={submitProcess}
                            edit={true}
                            config_data={authUser.config_data}
                            enable_validation={configdatacheckpoint[cpId].enable_validation}
                            updateState={(data) => {
                                const updatedInfo = _.cloneDeep(configdatacheckpoint)
                                updatedInfo[cpId] = data
                                setconfigdatacheckpoint(updatedInfo)
                            }}
                            selectedInputValue={selectedInputValue}
                        /> :
                        null

                }

            case "4":
                {
                    return renderChild ?
                        <OptionalComponent
                            unmountMe={handleChildUnmount}
                            checkpointinfo={configdatacheckpoint[cpId]}
                            submitProcess={submitProcess}
                            edit={true}
                            config_data={authUser.config_data}
                            enable_validation={configdatacheckpoint[cpId].enable_validation}
                            updateState={(data) => {
                                const updatedInfo = _.cloneDeep(configdatacheckpoint)
                                console.log('updatedInfo[cpId] :>> ', updatedInfo[cpId]);
                                updatedInfo[cpId] = data
                                setconfigdatacheckpoint(updatedInfo)
                            }}
                            selectedInputValue={selectedInputValue}
                        /> :
                        null

                }

            case "5":
                {
                    return renderChild ?
                        <OptionalComponent
                            unmountMe={handleChildUnmount}
                            checkpointinfo={configdatacheckpoint[cpId]}
                            submitProcess={submitProcess}
                            edit={true}
                            config_data={authUser.config_data}
                            enable_validation={configdatacheckpoint[cpId].enable_validation}
                            updateState={(data) => {
                                const updatedInfo = _.cloneDeep(configdatacheckpoint)
                                updatedInfo[cpId] = data
                                setconfigdatacheckpoint(updatedInfo)
                            }}
                            selectedInputValue={selectedInputValue}
                        /> :
                        null

                }

            case "6":
                {
                    return renderChild ?
                        <ManageOperatorComponent
                            checkpointinfo={configdatacheckpoint[cpId]}
                            edit={true}
                            config_data={authUser.config_data}
                            submitProcess={submitProcess}
                            enable_validation={configdatacheckpoint[cpId].enable_validation}
                            updateState={(data) => {
                                const updatedInfo = _.cloneDeep(configdatacheckpoint)
                                updatedInfo[cpId] = data
                                setconfigdatacheckpoint(updatedInfo)
                            }}
                            selectedInputValue={selectedInputValue}
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

    const handleCheckboxChange = (cpId, key, checked) => {
        const updated = _.cloneDeep(configdatacheckpoint);
        if (!updated[cpId]) updated[cpId] = {};
        updated[cpId][key] = !checked;
        setconfigdatacheckpoint(updated);
    };

    const handleChangeType = (tags) => {
        const updatedConfigData = _.cloneDeep(configdatacheckpoint);;
        updatedConfigData[cpId].compl_type = tags;
        setconfigdatacheckpoint(updatedConfigData)

    }

    const handleValidSubmit = (event, values) => {
        props.onSubmit(event, values)
    }


    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };




    const handleAcceptedFiles = (files) => {
        setimageUploading(true);
        const enhancedFiles = files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
                uploading: true,
                uploadingStatus: "Uploading"
            })
        );
        const selectedFilesInfo = _.cloneDeep(selectedFiles);
        const newFileList = selectedFilesInfo.concat(enhancedFiles);
        setselectedFiles(newFileList);
        const configdatacheckpointInfo = _.cloneDeep(configdatacheckpoint);
        const formData = new FormData();
        enhancedFiles.forEach(file => {
            formData.append('imagesArray', file);
        });
        try {
            urlSocket.post("storeImage/awswebupload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: progressEvent => {
                    if (progressEvent.loaded === progressEvent.total) {
                    }
                }
            }).then(response => {
                if (response.data.response_code === 500) {
                    const uploadedFiles = response.data.data;
                    configdatacheckpointInfo[cpId].guideline_image.push(...uploadedFiles);
                    _.each(uploadedFiles, item => {
                        _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
                            if (child.originalname === item.originalname) {
                                const splitString = item.key.split("/");
                                const getFileName = splitString[splitString.length - 1];
                                child.uploading = false;
                                child.uploadingStatus = "Uploaded";
                                child.preview = authUser.config_data.img_url + getFileName;
                            }
                        });
                    });

                    setconfigdatacheckpoint(configdatacheckpointInfo);
                } else {
                    _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
                        child.uploading = false;
                        child.uploadingStatus = "Not Uploaded";
                    });
                    setconfigdatacheckpoint(configdatacheckpointInfo);
                }
                setimageUploading(false);
            });
        } catch (error) {
            console.log(error, 'Upload error');
            setimageUploading(false);
        }
    };



    const deleteImage = (id) => {
        const updatecheckInfo = _.cloneDeep(configdatacheckpoint)
        updatecheckInfo[cpId].guideline_image.splice(id, 1)
        setconfigdatacheckpoint(updatecheckInfo)
    }






    const validateCheckpoint = (data) => {
        setsubmitProcess(true);
        var inputMissing = false;

        if (data.checkpoint == "") {
            inputMissing = true;
        }



        data?.rule?.forEach((item, index) => {
            if (selectedInputValue !== '6') {
                if (!item.option_text || item.option_text.trim() === "") {
                    inputMissing = true;
                }
            }
            else {
            }

            if (item.image_info) {
                const { camera, gallery, min, max } = item.image_info;
                if (camera || gallery) {
                    if (!min || min === '') {
                        inputMissing = true;
                    }
                    if (!max || max === '') {
                        inputMissing = true;
                    }
                    if (min && max && Number(max) < Number(min)) {
                        inputMissing = true;
                    }
                }
            }

            if (item.video_info) {
                const { camera, gallery, min, max } = item.video_info;
                if (camera || gallery) {
                    if (!min || min === '') {
                        inputMissing = true;
                    }
                    if (!max || max === '') {
                        inputMissing = true;
                    }
                    if (min && max && Number(max) < Number(min)) {
                        inputMissing = true;
                    }
                }
            }

            if (data.enable_validation) {

                if (
                    !item?.compliance ||
                    typeof item.compliance !== 'object' ||
                    !item.compliance.id ||
                    !item.compliance.name ||
                    Object.keys(item.compliance).length === 0
                ) {
                    inputMissing = true;
                }
            }
        });

        if (data.enable_validation) {

            const invalidCompliances = data.rule?.filter((item, index) =>
                !item?.compliance ||
                typeof item.compliance !== 'object' ||
                !item.compliance.id ||
                !item.compliance.name ||
                Object.keys(item.compliance).length === 0
            );

            if (!invalidCompliances || invalidCompliances.length > 0) {
                inputMissing = true;
            }
        }

        if (state.mediaErrors) {
            inputMissing = true;
        }
        if (state.valueErrors) {
            inputMissing = true;
        }
        if (data.impact_level == "") {
            inputMissing = true;
        }


        if (data.enable_validation && selectedInputValue === '6') {
            if (!Array.isArray(data.rule) || data.rule.length === 0) {
                inputMissing = true;
            }
        }

        if (!inputMissing && !imageUploading) {
            const processedData = _.cloneDeep(data);

            if (!data.enable_validation && Array.isArray(processedData.rule)) {
                if (configdatacheckpoint[cpId].checkpoint_type_id === '6') {
                } else {
                    processedData.rule = processedData.rule.map(rule => {
                        const newRule = { ...rule };
                        delete newRule.compliance;
                        return newRule;
                    });
                }
            }

            props.onSubmit(processedData);
        }
    }

    const handleValidationToggle = (e) => {
        const isChecked = e.target.checked;
        const updatedConfigData = _.cloneDeep(configdatacheckpoint);
        updatedConfigData[cpId]['enable_validation'] = !isChecked;
        if (selectedInputValue === '6' && !isChecked) {
            updatedConfigData[cpId]['rule'] = [];
        }
        setconfigdatacheckpoint(updatedConfigData);
    };

    const handleToggle = (e, field) => {
        const checked = e.target.checked;
        const updatedConfigData = _.cloneDeep(configdatacheckpoint);
        updatedConfigData[cpId][field] = checked;
        setconfigdatacheckpoint(updatedConfigData);
    };


    const handleUnitsChange = (e) => {
        const value = e.target.value;
        const updatedConfigData = _.cloneDeep(configdatacheckpoint)
        updatedConfigData[cpId]["unit_name"] = value
        setconfigdatacheckpoint(updatedConfigData)

    };

    const handleSignOptionChange = (e, fieldName) => {
        const updatedConfigData = _.cloneDeep(configdatacheckpoint);
        updatedConfigData[cpId]["only_positive"] = false;
        updatedConfigData[cpId]["only_negative"] = false;
        updatedConfigData[cpId]["both_case"] = false;
        updatedConfigData[cpId][fieldName] = true;
        setconfigdatacheckpoint(updatedConfigData);
    };

    const handleDecimalChange = (e) => {
        const value = e.target.value;
        const regex = /^\d*\.?\d{0,4}$/;
        if (value === '' || regex.test(value)) {
            const updatedConfigData = _.cloneDeep(configdatacheckpoint)
            updatedConfigData[cpId]["max_decimal"] = Number(value)
            setconfigdatacheckpoint(updatedConfigData)
        }
    };

    const handleMaxDigitsChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            var updatedConfigData = _.cloneDeep(configdatacheckpoint)
            updatedConfigData[cpId]["max_digits"] = Number(value)
            setconfigdatacheckpoint(updatedConfigData)
        }
    };



    const updateRuleField = (idx, key, value) => {
        const updated = _.cloneDeep(configdatacheckpoint);
        if (!updated[cpId]) {
            updated[cpId] = {};
        }
        if (!Array.isArray(updated[cpId].rule)) {
            updated[cpId].rule = [];
        }

        while (updated[cpId].rule.length <= idx) {
            updated[cpId].rule.push({});
        }
        updated[cpId].rule[idx][key] = value;
        console.log('updated :>> ', updated);
        setconfigdatacheckpoint(updated);
    };



    if (dataLoaded) {
        return (
            <div>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={12}>
                            <AvForm className="form-horizontal" >
                                <div className="px-4 py-2">
                                    <Row className="" >
                                        <div className="mb-4">
                                            <Label className="" htmlFor="autoSizingSelect">Select Check point Type<span className="text-danger">*</span></Label>
                                            <select type="select" name="subtitledd" label="Name" value={selectedInputValue} className="form-select" id="cat" onChange={(e) => onChangeParameterType(e)} >
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
                                                <Label className="" >Check point<span className="text-danger ms-1" style={{ fontSize: "smaller" }}>*</span> </Label>
                                                <AvField
                                                    name="title"
                                                    value={configdatacheckpoint[cpId].checkpoint}
                                                    onChange={(e) => {
                                                        const updatedConfigData = _.cloneDeep(configdatacheckpoint);
                                                        updatedConfigData[cpId].checkpoint = e.target.value.trim();
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
                                            </Row>
                                            : null
                                    }
                                    {selectedInputValue !== "0" && selectedInputValue === "6" &&
                                        <div className="border border-light my-2 bg-light" style={{ padding: 15, borderRadius: 8 }}>

                                            <Row className="align-items-center">
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="maxDigits" className="font-weight-bold">
                                                            Number Digits
                                                        </Label>
                                                        <div className="d-flex align-items-center">
                                                            <Input id="maxDigits" type="number" placeholder="Enter max digits (e.g. 5)" value={configdatacheckpoint[cpId]?.max_digits || ''} onChange={handleMaxDigitsChange} min="1" className="me-2" title="Maximum number of digits before the decimal point" />
                                                            <span className="text-muted">digits</span>
                                                        </div>
                                                        <small className="form-text text-muted"> Enter the maximum number of number digits allowed. </small>
                                                    </FormGroup>
                                                </Col>

                                                <Col>
                                                    <FormGroup>
                                                        <Label for="decimalValue" className="font-weight-bold">
                                                            Decimal Points
                                                        </Label>
                                                        <div className="d-flex align-items-center">
                                                            <Input id="decimalValue" type="number" placeholder="Enter decimal points (e.g. 2)" value={configdatacheckpoint[cpId]?.max_decimal || ''} onChange={handleDecimalChange} max="4" className="me-2" title="Number of digits allowed after the decimal point" />
                                                            <span className="text-muted">point</span>
                                                        </div>
                                                        <small className="form-text text-muted"> You can allow up to 4 decimal points. </small>
                                                    </FormGroup>
                                                </Col>
                                            </Row>


                                            <Row className="mt-3">
                                                <Col md={12}>
                                                    <FormGroup tag="fieldset">
                                                        <Label className="font-weight-bold">Positive / Negative</Label>
                                                        <div className="d-flex">
                                                            <FormGroup check className="me-3">
                                                                <Label check>
                                                                    <Input type="radio" name="signOption" defaultChecked={configdatacheckpoint[cpId]?.only_positive} onChange={(e) => handleSignOptionChange(e, 'only_positive')} />{' '}
                                                                    Only Positive
                                                                </Label>
                                                            </FormGroup>
                                                            <FormGroup check className="me-3">
                                                                <Label check>
                                                                    <Input type="radio" name="signOption" defaultChecked={configdatacheckpoint[cpId]?.only_negative} onChange={(e) => handleSignOptionChange(e, 'only_negative')} />{' '}
                                                                    Only Negative
                                                                </Label>
                                                            </FormGroup>
                                                            <FormGroup check>
                                                                <Label check>
                                                                    <Input type="radio" name="signOption" defaultChecked={configdatacheckpoint[cpId]?.both_case} onChange={(e) => handleSignOptionChange(e, 'both_case')} />{' '}
                                                                    Both
                                                                </Label>
                                                            </FormGroup>
                                                        </div>
                                                    </FormGroup>
                                                </Col>

                                            </Row>
                                            <Row className="mt-3">
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <Label for="units" className="font-weight-bold"> Units </Label>
                                                        <Input id="units" type="text" placeholder="e.g. kg, m, °C" value={configdatacheckpoint[cpId]?.unit_name} onChange={handleUnitsChange} />
                                                        <small className="form-text text-muted"> unit of measurement </small>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </div>
                                    }


                                    {
                                        selectedInputValue === '6' && !configdatacheckpoint[cpId]?.enable_validation &&
                                        <ManageCheckpointConfigSection
                                            idx={0}
                                            data={configdatacheckpoint[cpId]?.options !== null ? configdatacheckpoint[cpId]?.options[0] : { option_text: '', id: '', color: null, show_config: true }}
                                            checkpointInfo={configdatacheckpoint[cpId]}
                                            updateRuleField={updateRuleField}
                                            submitProcess={submitProcess}
                                        />
                                    }


                                    {
                                        selectedInputValue !== "0" ?
                                            <div className="border border-light bg-light" style={{ padding: 15, borderRadius: 8 }}>
                                                <div className='d-flex gap-3'>
                                                    <div className="form-check form-switch">
                                                        <input className="form-check-input" type="checkbox" role="switch" id="enableValidationSwitch" checked={configdatacheckpoint[cpId]?.enable_validation || false} onClick={(e) => { handleValidationToggle(e) }} />
                                                        <label className="form-check-label" htmlFor="enableValidationSwitch"> Enable Validation </label>
                                                    </div>

                                                    <div className="form-check form-switch">
                                                        <input className="form-check-input" type="checkbox" role="switch" id="enableNotApplicable" defaultChecked={configdatacheckpoint[cpId]?.enable_notapplicable} onChange={(e) => handleToggle(e, 'enable_notapplicable')} />
                                                        <label className="form-check-label" htmlFor="enableNotApplicable"> Enable Not Applicable </label>
                                                    </div>
                                                </div>
                                            </div>
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
                                                <div className="my-2 d-flex flex-column" style={{ padding: 10, border: submitProcess && configdatacheckpoint[cpId].impact_level == "" ? '1px solid #ff0000' : '0px' }}>
                                                    <label>Impact Level<span className="text-danger" style={{ fontSize: "smaller" }}>*</span></label>
                                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                        <div className="form-check mx-2 form-radio-danger">
                                                            <input className="form-check-input" type="radio" name="Critical" id="exampleRadios1" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "Critical"} />
                                                            <label className="form-check-label text-danger" htmlFor="exampleRadios1" > Critical </label>
                                                        </div>
                                                        <div className="form-check mx-2 form-radio-warning">
                                                            <input className="form-check-input" type="radio" name="High" id="exampleRadios2" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "High"} />
                                                            <label className="form-check-label text-warning" htmlFor="exampleRadios2" > High </label>
                                                        </div>
                                                        <div className="form-check mx-2 form-radio-info">
                                                            <input className="form-check-input" type="radio" name="Medium" id="exampleRadios3" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "Medium"} />
                                                            <label className="form-check-label text-info" htmlFor="exampleRadios3">Medium</label>
                                                        </div>
                                                        <div className="form-check mx-2 form-radio-success">
                                                            <input className="form-check-input" type="radio" name="Low" id="exampleRadios4" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "Low"} />
                                                            <label className="form-check-label text-success" htmlFor="exampleRadios4" > Low </label>
                                                        </div>
                                                        <div className="form-check mx-2 form-radio-primary">
                                                            <input className="form-check-input" type="radio" name="No impact" id="exampleRadios5" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "No impact"} />
                                                            <label className="form-check-label text-primary" htmlFor="exampleRadios5" >No impact </label>
                                                        </div>
                                                    </div>
                                                    {submitProcess && configdatacheckpoint[cpId].impact_level == "" ? <div  >
                                                        <span className="font-size-10 text-danger" style={{ lineHeight: 1, }}>Select any one impact level </span>
                                                    </div> : null}
                                                </div>

                                                <div className="form-check mx-2">
                                                    <input className="form-check-input" type="checkbox" name="checkpoint_mand_status" id="checkpointMandatory" checked={configdatacheckpoint[cpId]?.checkpoint_mand_status === true} onClick={(e) => handleCheckboxChange(cpId, "checkpoint_mand_status", e.target.checked)} />
                                                    <label className="form-check-label" htmlFor="checkpointMandatory"> Checkpoint is optional </label>
                                                </div>


                                                <div className="my-2 d-flex flex-column" style={{ padding: 10, }}>
                                                    <label>Type</label>
                                                    <div >
                                                        <TagsInput value={configdatacheckpoint[cpId].compl_type} onChange={handleChangeType} inputProps={{ placeholder: 'Add a type and hit enter' }} />
                                                        <div className="flex flex-wrap gap-2 mt-2 ms-1">
                                                            <span className='fw-bold font-size-13'> Example :</span>
                                                            {['Regulatory', 'Internal', 'External']?.map((type, index, array) => (
                                                                <span key={index} className="px-1 py-1 flex items-center gap-1 font-size-11">
                                                                    {type} {index < array.length - 1 ? ',' : '.'}
                                                                </span>
                                                            ))}
                                                        </div>



                                                    </div>
                                                </div>
                                                <div className="my-2 d-flex flex-column" style={{ padding: 10, }}>
                                                    <AvForm className="form-horizontal" onValidSubmit={handleValidSubmit}>
                                                        <div className="mb-3" >
                                                            <AvField name="guideline" label="Guideline" value={configdatacheckpoint[cpId].guideline} className="form-control" placeholder="Enter Guideline" type="textarea" required
                                                                onChange={(e) => {
                                                                    const updatedConfigData = _.cloneDeep(configdatacheckpoint);
                                                                    updatedConfigData[cpId].guideline = e.target.value;
                                                                    setconfigdatacheckpoint(updatedConfigData)
                                                                }}
                                                            />
                                                        </div>
                                                    </AvForm>
                                                    <label>Add images for guidelines</label>
                                                    <Form>
                                                        <Dropzone onDrop={acceptedFiles => handleAcceptedFiles(acceptedFiles)} accept={[".jpg", ".jpeg", ".png"]} multiple={true}>
                                                            {({ getRootProps, getInputProps }) => (
                                                                <div className="dropzone">
                                                                    <div className="dz-message needsclick" {...getRootProps()} >
                                                                        <input {...getInputProps()} />
                                                                        <div className="mb-3">
                                                                            <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                                        </div>
                                                                        <h4>Drop files here or click to upload.</h4>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Dropzone>
                                                        {/* {console.log('configdatacheckpoint[cpId] :>> ', configdatacheckpoint[cpId])} */}
                                                        <div className="dropzone-previews mt-3" id="file-previews">
                                                            {configdatacheckpoint[cpId]?.guideline_image?.map((f, i) => {
                                                                return (
                                                                    <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete" key={i + "-file"}>
                                                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                            <div className="p-2" style={{ width: '95%' }}>
                                                                                <Row className="align-items-center">
                                                                                    <Col className="col-auto">
                                                                                        <img data-dz-thumbnail="" height="80" className="avatar-sm rounded bg-light" alt={f.name}
                                                                                            // src={f.preview}
                                                                                            src={`${authUser.client_info[0].base_url}eaudit-files/` + f?.originalname}
                                                                                        />
                                                                                    </Col>
                                                                                    <Col>
                                                                                        <Link to="#" className="text-muted font-weight-bold" > {f.name} </Link>
                                                                                        <p className="mb-0"> <strong>{f.formattedSize}</strong> </p>
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
                                                <footer className="ps-0" style={{ display: 'flex', alignItems: "center", height: 50, background: "#fff", width: "100%", position: "fixed", bottom: 0, zIndex: 999, borderTop: "1px solid #dedede" }}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center", }}>
                                                        <>
                                                            <div style={{ marginRight: 10 }}>
                                                                <button className="btn btn-sm btn-outline-success w-sm m-1" type="submit" onClick={() => validateCheckpoint(configdatacheckpoint[cpId])}>
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
export default ManageInputTemplate
