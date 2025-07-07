import React, { useEffect, useState } from 'react'
import { Row, Col, FormGroup, Card, Container, Label, Form, Input } from "reactstrap";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import OptionalComponent from './optionalComponent'
import TagsInput from 'react-tagsinput'
import { Link } from "react-router-dom"
import Dropzone from "react-dropzone"
import _ from 'lodash';
import urlSocket from 'helpers/urlSocket';
import OperatorComponent from './OperatorComponent';
import CheckpointConfigSection from './CheckpointConfigSection';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';


const InputTemplate = (props) => {
    const state = useSelector(state => state.treeData);


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
    const [templateData,setTemplateData] = useState(JSON.parse(sessionStorage.getItem("EditData")))

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





    // const onChangeParameterType = (event, values) => {
    //     setconfigdatacheckpoint(authUser.config_data.question_type_info.map(obj => ({ ...obj })))
    //     setcheckpointType(event.target.value)
    //     setselectedInputValue(event.target.value)
    //     setcpId(parseInt(event.target.value) - 1)
    // }
    const onChangeParameterType = (event, values) => {
        setconfigdatacheckpoint(authUser.config_data.question_type_info.map(obj => ({ ...obj, checkpoint: configdatacheckpoint[cpId]?.checkpoint ?configdatacheckpoint[cpId]?.checkpoint :"" })))
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
                                // console.log('updatedInfo :>> ', updatedInfo);
                                setconfigdatacheckpoint(updatedInfo)
                            }}
                            selectedInputValue= {selectedInputValue}
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
                             selectedInputValue= {selectedInputValue}
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
                             selectedInputValue= {selectedInputValue}
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
                             selectedInputValue= {selectedInputValue}
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
                             selectedInputValue= {selectedInputValue}
                        /> :
                        null

                }

            case "6":
                {
                    return renderChild ?
                        <OperatorComponent
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
                             selectedInputValue= {selectedInputValue}
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

    /// sinle media file upload 20-5-25
    // const handleAcceptedFiles = (files) => {
    //     setimageUploading(false)
    //     files.map(file =>
    //         Object.assign(file, {
    //             preview: URL.createObjectURL(file),
    //             formattedSize: formatBytes(file.size),
    //             uploading: true,
    //             uploadingStatus: "Uploading"
    //         })
    //     )

    //     var configdatacheckpointInfo = _.cloneDeep(configdatacheckpoint)
    //     var selectedFilesInfo = _.cloneDeep(selectedFiles)
    //     setselectedFiles(selectedFilesInfo.concat(files))
    //     let formData = new FormData()
    //     for (const key of Object.keys(files)) {
    //         formData.append('imagesArray', files[key])
    //     }
    //     console.log('formData :>> ', formData);
    //     try {
    //         urlSocket.post("storeImage/awswebupload", formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             }
    //         },
    //             {
    //                 onUploadProgress: progressEvent => {
    //                     if (progressEvent.loaded === progressEvent.total) {
    //                     }

    //                 }
    //             }).then(response => {
    //                 console.log(response, 'response')
    //                 if (response.data.response_code == 500) {
    //                     console.log('chandleAcceptedFiles ', configdatacheckpointInfo[cpId]);
    //                     configdatacheckpointInfo[cpId].guideline_image.push(response.data.data[0])
    //                     setconfigdatacheckpoint(configdatacheckpointInfo)
    //                     _.each(response.data.data, item => {
    //                         _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
    //                             if (child.originalname == item.originalname) {
    //                                 let splitString = item.key.split("/");
    //                                 let getFileName = splitString[splitString.length - 1];
    //                                 child["uploading"] = false
    //                                 child["uploadingStatus"] = "Uploaded"
    //                                 child["preview"] = authUser.config_data.img_url + getFileName
    //                             }
    //                         })
    //                     })
    //                     setimageUploading(false)
    //                 }
    //                 else {
    //                     _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
    //                         child["uploading"] = false
    //                         child["uploadingStatus"] = "Not Uploaded"
    //                     })
    //                     setimageUploading(false)
    //                 }
    //             })
    //     } catch (error) {
    //         console.log(error, 'error308')
    //     }

    // }



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
             formData.append('folder', authUser.client_info[0]["s3_folder_path"] + templateData._id + '/');
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


    // const validateCheckpoint = (data) => {
    //     console.log('data :>> ', data);
    //     setsubmitProcess(true);
    //     var inputMissing = false;

    //     if (data.checkpoint == "") {
    //         inputMissing = true;
    //     }

    //     console.log('selectedInputValue :>> ', selectedInputValue);

    //     data?.rule?.forEach((item, index) => {
    //         if (selectedInputValue !== '6') {
    //             if (!item.option_text || item.option_text.trim() === "") {
    //                 console.log('iffff :>> ');
    //                 inputMissing = true;
    //             }
    //         }
    //         else {
    //         console.log('elseeee :>> ');
    //         }


    //         if (item.image_info) {
    //             const { camera, gallery, min, max } = item.image_info;

    //             if (camera || gallery) {
                    

    //                 // Allow min = 0, but disallow empty/null/undefined
    //                 if (min === '' || min === null || min === undefined) {
    //                     inputMissing = true;
    //                 }

    //                 // Disallow max = 0 or blank/null
    //                 if (
    //                     max === '' || max === null || max === undefined || Number(max) === 0
    //                 ) {
    //                     inputMissing = true;
    //                 }

    //                 // Check max >= min only if both are present
    //                 if (
    //                     min !== '' &&
    //                     max !== '' &&
    //                     min !== null &&
    //                     max !== null &&
    //                     min !== undefined &&
    //                     max !== undefined &&
    //                     Number(max) < Number(min)
    //                 ) {
    //                     inputMissing = true;
    //                 }
    //             }
    //         }
    //         if (item.video_info) {
    //             const { camera, gallery, min, max, duration } = item.video_info;
    //             if (camera || gallery) {
    //                 // Allow min = 0 but disallow null/undefined/empty
    //                 if (min === '' || min === null || min === undefined) {
    //                     inputMissing = true;
    //                 }

    //                 // Disallow max = 0 or empty/null/undefined
    //                 if (
    //                     max === '' ||
    //                     max === null ||
    //                     max === undefined ||
    //                     Number(max) === 0
    //                 ) {
    //                     inputMissing = true;
    //                 }

    //                 // Check if max is less than min
    //                 if (
    //                     min !== '' &&
    //                     max !== '' &&
    //                     min !== null &&
    //                     max !== null &&
    //                     min !== undefined &&
    //                     max !== undefined &&
    //                     Number(max) < Number(min)
    //                 ) {
    //                     inputMissing = true;
    //                 }

    //                 // Enforce minimum duration of 5
    //                 if (
    //                     duration === '' ||
    //                     duration === null ||
    //                     duration === undefined ||
    //                     Number(duration) < 5
    //                 ) {
    //                     inputMissing = true;
    //                 }
    //             }
    //         }

    //         if (data.enable_validation) {

    //             if (
    //                 !item?.compliance ||
    //                 typeof item.compliance !== 'object' ||
    //                 !item.compliance.id ||
    //                 !item.compliance.name ||
    //                 Object.keys(item.compliance).length === 0
    //             ) {
    //                 inputMissing = true;
    //             }
    //         }
    //     });

    //     if (data.enable_validation) {

    //         const invalidCompliances = data.rule?.filter((item, index) =>
    //             !item?.compliance ||
    //             typeof item.compliance !== 'object' ||
    //             !item.compliance.id ||
    //             !item.compliance.name ||
    //             Object.keys(item.compliance).length === 0
    //         );

    //         if (!invalidCompliances || invalidCompliances.length > 0) {
    //             inputMissing = true;
    //         }
    //     }

    //     if (state.mediaErrors) {
    //         inputMissing = true;
    //     }
    //     if (state.valueErrors) {
    //         inputMissing = true;
    //     }
    //     if (data.impact_level == "") {
    //         inputMissing = true;
    //     }


    //     if (data.enable_validation && selectedInputValue === '6') {
    //         if (!Array.isArray(data.rule) || data.rule.length === 0) {
    //             inputMissing = true;
    //         }
    //     }
        

    //     if (!inputMissing && !imageUploading) {
    //         const processedData = _.cloneDeep(data);

    //         if (!data.enable_validation && Array.isArray(processedData.rule)) {
    //             if (configdatacheckpoint[cpId].checkpoint_type_id === '6') {
    //                 // processedData.rule = []
    //             } else {
    //                 processedData.rule = processedData.rule.map(rule => {
    //                     const newRule = { ...rule };
    //                      newRule.compliance = null;
    //                     // delete newRule.compliance;
    //                     return newRule;
    //                 });
    //             }
    //         }
    //         console.log('processedData :>> ', processedData);
    //         // props.onSubmit(processedData);
    //     }
    // }




const validateCheckpoint = (data) => {
    console.log('data :>> ', data);
    setsubmitProcess(true);
    let inputMissing = false;

    if (data.checkpoint === "") {
        inputMissing = true;
    }

    console.log('selectedInputValue :>> ', selectedInputValue);

    data?.rule?.forEach((item, index) => {
        // --- Option Text Validation ---
        if (selectedInputValue !== '6') {
            if (!item.option_text || item.option_text.trim() === "") {
                console.log(`Empty option_text at rule[${index}]`);
                inputMissing = true;
            }
        }

        // --- Image Info Validation ---
        const image = item.image_info;
        if (image && (image.camera || image.gallery)) {
            if (image.min === '' || image.min === null || image.min === undefined) {
                inputMissing = true;
            }

            if (image.max === '' || image.max === null || image.max === undefined || Number(image.max) === 0) {
                inputMissing = true;
            }

            if (
                image.min !== '' &&
                image.max !== '' &&
                image.min !== null &&
                image.max !== null &&
                image.min !== undefined &&
                image.max !== undefined &&
                Number(image.max) < Number(image.min)
            ) {
                inputMissing = true;
            }
        }

        // --- Video Info Validation ---
        const video = item.video_info;
        if (video && (video.camera || video.gallery)) {
            if (video.min === '' || video.min === null || video.min === undefined) {
                inputMissing = true;
            }

            if (video.max === '' || video.max === null || video.max === undefined || Number(video.max) === 0) {
                inputMissing = true;
            }

            if (
                video.min !== '' &&
                video.max !== '' &&
                video.min !== null &&
                video.max !== null &&
                video.min !== undefined &&
                video.max !== undefined &&
                Number(video.max) < Number(video.min)
            ) {
                inputMissing = true;
            }

            if (
                video.duration === '' ||
                video.duration === null ||
                video.duration === undefined ||
                Number(video.duration) < 5
            ) {
                inputMissing = true;
            }
        }

        // --- Compliance Validation ---
        // if (data.enable_validation) {
        //     const comp = item.compliance;
        //     if (
        //         !comp ||
        //         typeof comp !== 'object' ||
        //         !comp.id ||
        //         !comp.name ||
        //         Object.keys(comp).length === 0
        //     ) {
        //         inputMissing = true;
        //     }

        //     // --- Operator Info Validation ---
        //     const op = item.operator_info;
        //     if (
        //         !op ||
        //         typeof op !== 'object' ||
        //         !op.operator ||
        //         typeof op.operator !== 'object' ||
        //         !op.operator.id ||
        //         !op.operator.name ||
        //         !op.operator.modulus ||
        //         op.from === '' ||
        //         op.from === null ||
        //         op.from === undefined ||
        //         isNaN(Number(op.from)) ||
        //         op.to === '' ||
        //         op.to === null ||
        //         op.to === undefined ||
        //         isNaN(Number(op.to))
        //     ) {
        //         console.log(`Invalid operator_info at rule[${index}]`);
        //         inputMissing = true;
        //     } else {
        //         if (op.operator.modulus === 'between' && Number(op.from) > Number(op.to)) {
        //             console.log(`Operator 'between' has from > to at rule[${index}]`);
        //             inputMissing = true;
        //         }
        //     }
        // }

        if (data.enable_validation && selectedInputValue === '6') {
            const comp = item.compliance;
            if (
                !comp ||
                typeof comp !== 'object' ||
                !comp.id ||
                !comp.name ||
                Object.keys(comp).length === 0
            ) {
                inputMissing = true;
            }
        
            const op = item.operator_info;
        
            if (
                !op ||
                typeof op !== 'object' ||
                !op.operator ||
                typeof op.operator !== 'object' ||
                !op.operator.id ||
                !op.operator.name ||
                !op.operator.modulus
            ) {
                inputMissing = true;
            } else {
                const { modulus } = op.operator;
        
                const isFromInvalid =
                    op.from === '' || op.from === null || op.from === undefined || isNaN(Number(op.from));
                const isToInvalid =
                    op.to === '' || op.to === null || op.to === undefined || isNaN(Number(op.to));
        
                switch (modulus) {
                    case 'between':
                        if (isFromInvalid || isToInvalid || Number(op.from) > Number(op.to)) {
                            inputMissing = true;
                        }
                        break;
        
                    case '<':
                    case '>':
                    case '<=':
                    case '>=':
                        if (isFromInvalid) {
                            inputMissing = true;
                        }
                        break;
        
                    case '< or >':
                    case '<= or >=':
                        if (isFromInvalid || isToInvalid) {
                            inputMissing = true;
                        }
                        break;
        
                    default:
                        inputMissing = true;
                }
            }
        }

        
    });

    // --- Re-check for invalid compliances globally ---
    if (data.enable_validation) {
        const invalidCompliances = data.rule?.filter(item =>
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

    // --- Global checks ---
    if (state.mediaErrors) inputMissing = true;
    if (state.valueErrors) inputMissing = true;
    if (data.impact_level === "") inputMissing = true;

    // --- Special case for type 6 with validation ---
    if (data.enable_validation && selectedInputValue === '6') {
        if (!Array.isArray(data.rule) || data.rule.length === 0) {
            inputMissing = true;
        }
    }

    // --- Final submission ---
    if (!inputMissing && !imageUploading) {
        const processedData = _.cloneDeep(data);

        if (!data.enable_validation && Array.isArray(processedData.rule)) {
            if (configdatacheckpoint[cpId]?.checkpoint_type_id !== '6') {
                processedData.rule = processedData.rule.map(rule => {
                    const newRule = { ...rule, compliance: null };
                    return newRule;
                });
            }
        }

        console.log('processedData :>> ', processedData);
        props.onSubmit(processedData);
    }
};


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

    // const handleSignOptionChange = (e, fieldName) => {
    //     const updatedConfigData = _.cloneDeep(configdatacheckpoint);
    //     updatedConfigData[cpId]["only_positive"] = false;
    //     updatedConfigData[cpId]["only_negative"] = false;
    //     updatedConfigData[cpId]["both_case"] = false;
    //     updatedConfigData[cpId][fieldName] = true;
    //     setconfigdatacheckpoint(updatedConfigData);
    // };

    // const handleDecimalChange = (e) => {
    //     const value = e.target.value;
    //     const regex = /^\d*\.?\d{0,4}$/;
    //     if (value === '' || regex.test(value)) {
    //         const updatedConfigData = _.cloneDeep(configdatacheckpoint)
    //         updatedConfigData[cpId]["max_decimal"] = Number(value)
    //         setconfigdatacheckpoint(updatedConfigData)
    //     }
    // };

    // const handleMaxDigitsChange = (e) => {
    //     const value = e.target.value;
    //     if (value === '' || /^\d+$/.test(value)) {
    //         var updatedConfigData = _.cloneDeep(configdatacheckpoint)
    //         updatedConfigData[cpId]["max_digits"] = Number(value)
    //         setconfigdatacheckpoint(updatedConfigData)
    //     }
    // };


    // const handleDecimalChange = (e) => {
    //     const value = e.target.value;
    //     const maxDecimal = Number(value);
    //     const regex = /^\d*\.?\d{0,4}$/;

    //     if (value === '' || regex.test(value)) {
    //         const rules = configdatacheckpoint[cpId]?.rule || [];

    //         const hasInvalidDecimals = rules.some((rule) => {
    //             const opInfo = rule.operator_info;
    //             if (!opInfo) return false;

    //             const fromDecimals = (opInfo.from?.toString().split('.')[1] || '').length;
    //             const toDecimals = (opInfo.to?.toString().split('.')[1] || '').length;

    //             return fromDecimals > maxDecimal || toDecimals > maxDecimal;
    //         });

    //         if (hasInvalidDecimals) {
    //             alert("One or more rules exceed the selected decimal limit.");
    //             return; // Prevent update
    //         }

    //         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
    //         updatedConfigData[cpId]["max_decimal"] = maxDecimal;
    //         setconfigdatacheckpoint(updatedConfigData);
    //     }
    // };




    ////

    // const handleDecimalChange = (e) => {
    //     const value = e.target.value;
    //     const maxDecimal = Number(value);
    //     const regex = /^\d*\.?\d{0,4}$/;

    //     // Enforce max limit of 4 decimal points
    //     if (maxDecimal > 4) {
    //         alert("You can allow up to 4 decimal points only.");
    //         resetOperatorValuesInRules();
    //         return;
    //     }

    //     if (value === '' || regex.test(value)) {
    //         const rules = configdatacheckpoint[cpId]?.rule || [];

    //         const hasInvalidDecimals = rules.some((rule) => {
    //             const opInfo = rule.operator_info;
    //             if (!opInfo) return false;

    //             const fromDecimals = (opInfo.from?.toString().split('.')[1] || '').length;
    //             const toDecimals = (opInfo.to?.toString().split('.')[1] || '').length;

    //             return fromDecimals > maxDecimal || toDecimals > maxDecimal;
    //         });

    //         if (hasInvalidDecimals) {
    //             alert("One or more rules exceed the selected decimal limit.");
    //             return;
    //         }

    //         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
    //         updatedConfigData[cpId]["max_decimal"] = maxDecimal;
    //         setconfigdatacheckpoint(updatedConfigData);
    //     }
    // };

    // const handleSignOptionChange = (e, fieldName) => {
    //     const rules = configdatacheckpoint[cpId]?.rule || [];

    //     const isInvalid = rules.some((rule) => {
    //         const opInfo = rule.operator_info;
    //         if (!opInfo) return false;

    //         const values = [Number(opInfo.from), Number(opInfo.to)];
    //         if (fieldName === "only_positive") return values.some(v => v < 0);
    //         if (fieldName === "only_negative") return values.some(v => v > 0);
    //         return false;
    //     });

    //     const updatedConfigData = _.cloneDeep(configdatacheckpoint);

    //     if (isInvalid) {
    //         alert("One or more rules contain values that conflict with this sign option. They will be reset.");
    //         resetOperatorValuesInRules()

    //         // Reset from/to values
    //         const rules = updatedConfigData[cpId]?.rule || [];
    //         rules.forEach((rule) => {
    //             if (rule.operator_info) {
    //                 rule.operator_info.from = "";
    //                 rule.operator_info.to = "";
    //             }
    //         });
    //         updatedConfigData[cpId].rule = rules;
    //     }

    //     // Set the selected sign option
    //     updatedConfigData[cpId]["only_positive"] = false;
    //     updatedConfigData[cpId]["only_negative"] = false;
    //     updatedConfigData[cpId]["both_case"] = false;
    //     updatedConfigData[cpId][fieldName] = true;

    //     // Finally update state
    //     setconfigdatacheckpoint(updatedConfigData);
    // };

    // const handleMaxDigitsChange = (e) => {
    //     const value = e.target.value;
    //     if (value === '' || /^\d+$/.test(value)) {
    //         const maxDigits = Number(value);
    //         const rules = configdatacheckpoint[cpId]?.rule || [];

    //         const hasInvalidDigits = rules.some((rule) => {
    //             const opInfo = rule.operator_info;
    //             if (!opInfo) return false;

    //             const fromDigits = opInfo.from?.toString().split('.')[0].length || 0;
    //             const toDigits = opInfo.to?.toString().split('.')[0].length || 0;

    //             return fromDigits > maxDigits || toDigits > maxDigits;
    //         });

    //         if (hasInvalidDigits) {
    //             alert("One or more rules exceed the selected max digit limit.");
    //             resetOperatorValuesInRules();
    //             return;
    //         }

    //         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
    //         updatedConfigData[cpId]["max_digits"] = maxDigits;
    //         setconfigdatacheckpoint(updatedConfigData);
    //     }
    // };
    ///


const handleDecimalChange = (e) => {
    const value = e.target.value;
    const maxDecimal = Number(value);
    const regex = /^\d*\.?\d{0,4}$/;

    if (maxDecimal > 4) {
        Swal.fire({
            icon: 'warning',
            title: 'Decimal Limit Exceeded',
            text: 'You can allow up to 4 decimal points only.',
            showCancelButton: true,
            confirmButtonText: 'Reset',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                resetOperatorValuesInRules();
            }
        });
        return;
    }

    if (value === '' || regex.test(value)) {
        const rules = configdatacheckpoint[cpId]?.rule || [];

        const hasInvalidDecimals = rules.some((rule) => {
            const opInfo = rule.operator_info;
            if (!opInfo) return false;

            const fromDecimals = (opInfo.from?.toString().split('.')[1] || '').length;
            const toDecimals = (opInfo.to?.toString().split('.')[1] || '').length;

            return fromDecimals > maxDecimal || toDecimals > maxDecimal;
        });

        if (hasInvalidDecimals) {
            Swal.fire({
                icon: 'warning',
                title: 'Decimal Mismatch',
                text: 'One or more rules exceed the selected decimal limit.',
                showCancelButton: true,
                confirmButtonText: 'Reset',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    resetOperatorValuesInRules();
                }
            });
            return;
        }

        const updatedConfigData = _.cloneDeep(configdatacheckpoint);
        updatedConfigData[cpId]["max_decimal"] = maxDecimal;
        setconfigdatacheckpoint(updatedConfigData);
    }
};


const handleSignOptionChange = (e, fieldName) => {
    const rules = configdatacheckpoint[cpId]?.rule || [];

    const isInvalid = rules.some((rule) => {
        const opInfo = rule.operator_info;
        if (!opInfo) return false;

        const values = [Number(opInfo.from), Number(opInfo.to)];
        if (fieldName === "only_positive") return values.some(v => v < 0);
        if (fieldName === "only_negative") return values.some(v => v > 0);
        return false;
    });

    const updatedConfigData = _.cloneDeep(configdatacheckpoint);

    if (isInvalid) {
        Swal.fire({
            icon: 'warning',
            title: 'Invalid Sign Configuration',
            text: 'One or more rules contain values that conflict with this sign option. They will be reset.',
            showCancelButton: true,
            confirmButtonText: 'Reset',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                resetOperatorValuesInRules();

                const rules = updatedConfigData[cpId]?.rule || [];
                rules.forEach((rule) => {
                    if (rule.operator_info) {
                        rule.operator_info.from = "";
                        rule.operator_info.to = "";
                    }
                });
                updatedConfigData[cpId].rule = rules;

                updatedConfigData[cpId]["only_positive"] = false;
                updatedConfigData[cpId]["only_negative"] = false;
                updatedConfigData[cpId]["both_case"] = false;
                updatedConfigData[cpId][fieldName] = true;

                setconfigdatacheckpoint(updatedConfigData);
            }
        });
        return;
    }

    updatedConfigData[cpId]["only_positive"] = false;
    updatedConfigData[cpId]["only_negative"] = false;
    updatedConfigData[cpId]["both_case"] = false;
    updatedConfigData[cpId][fieldName] = true;

    setconfigdatacheckpoint(updatedConfigData);
};

const handleMaxDigitsChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
        const maxDigits = Number(value);
        const rules = configdatacheckpoint[cpId]?.rule || [];

        const hasInvalidDigits = rules.some((rule) => {
            const opInfo = rule.operator_info;
            if (!opInfo) return false;

            const fromDigits = opInfo.from?.toString().split('.')[0].length || 0;
            const toDigits = opInfo.to?.toString().split('.')[0].length || 0;

            return fromDigits > maxDigits || toDigits > maxDigits;
        });

        if (hasInvalidDigits) {
            Swal.fire({
                icon: 'warning',
                title: 'Digit Limit Exceeded',
                text: 'One or more rules exceed the selected max digit limit.',
                showCancelButton: true,
                confirmButtonText: 'Reset',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    resetOperatorValuesInRules();
                }
            });
            return;
        }

        const updatedConfigData = _.cloneDeep(configdatacheckpoint);
        updatedConfigData[cpId]["max_digits"] = maxDigits;
        setconfigdatacheckpoint(updatedConfigData);
    }
};



    // const handleSignOptionChange = (e, fieldName) => {
    //     const rules = configdatacheckpoint[cpId]?.rule || [];

    //     const isInvalid = rules.some((rule) => {
    //         const opInfo = rule.operator_info;
    //         if (!opInfo) return false;

    //         const values = [Number(opInfo.from), Number(opInfo.to)];
    //         if (fieldName === "only_positive") return values.some(v => v < 0);
    //         if (fieldName === "only_negative") return values.some(v => v > 0);
    //         return false;
    //     });

    //     if (isInvalid) {
    //         alert("One or more rules contain values that conflict with this sign option.");
    //          resetOperatorValuesInRules();
    //         return;
    //     }

    //     const updatedConfigData = _.cloneDeep(configdatacheckpoint);
    //     updatedConfigData[cpId]["only_positive"] = false;
    //     updatedConfigData[cpId]["only_negative"] = false;
    //     updatedConfigData[cpId]["both_case"] = false;
    //     updatedConfigData[cpId][fieldName] = true;
    //     setconfigdatacheckpoint(updatedConfigData);
    // };




    const resetOperatorValuesInRules = () => {
        const updatedConfigData = _.cloneDeep(configdatacheckpoint);
        const rules = updatedConfigData[cpId]?.rule || [];

        rules.forEach((rule) => {
            if (rule.operator_info) {
                rule.operator_info.from = "";
                rule.operator_info.to = "";
            }
        });

        updatedConfigData[cpId].rule = rules;
        setconfigdatacheckpoint(updatedConfigData);
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
                                                    {/* <FormGroup tag="fieldset">
                                                        <Label className="font-weight-bold">Positive / Negative</Label>
                                                        {console.log('configdatacheckpoint[cpId]? :>> ', configdatacheckpoint[cpId])}
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
                                                    </FormGroup> */}

                                                    <FormGroup check className="me-3">
                                                        <Label check>
                                                            <Input
                                                                type="radio"
                                                                name="signOption"
                                                                checked={configdatacheckpoint[cpId]?.only_positive}
                                                                onClick={(e) => handleSignOptionChange(e, 'only_positive')}
                                                            />
                                                            {' '}Only Positive
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check className="me-3">
                                                        <Label check>
                                                            <Input
                                                                type="radio"
                                                                name="signOption"
                                                                checked={configdatacheckpoint[cpId]?.only_negative}
                                                                onClick={(e) => handleSignOptionChange(e, 'only_negative')}
                                                            />
                                                            {' '}Only Negative
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input
                                                                type="radio"
                                                                name="signOption"
                                                                checked={configdatacheckpoint[cpId]?.both_case}
                                                                onClick={(e) => handleSignOptionChange(e, 'both_case')}
                                                            />
                                                            {' '}Both
                                                        </Label>
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
                                        <CheckpointConfigSection
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
                                                     {!configdatacheckpoint[cpId]?.checkpoint_type?.includes("Not Applicable") && (
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" role="switch" id="enableNotApplicable" defaultChecked={configdatacheckpoint[cpId]?.enable_notapplicable} onChange={(e) => handleToggle(e, 'enable_notapplicable')} />
                                                            <label className="form-check-label" htmlFor="enableNotApplicable"> Enable Not Applicable </label>
                                                        </div>
                                                    )}
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
                                                        <TagsInput value={configdatacheckpoint[cpId].compl_type} onChange={handleChangeType} inputProps={{ placeholder: 'Add a type and hit enter', style: { minWidth: '300px' }  }} />
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
                                                                                            // src={`${authUser.client_info[0].base_url}eaudit-files/` + f?.originalname}
                                                                                            src={`${authUser.client_info[0].base_url}${authUser.client_info[0].s3_folder_path}${templateData._id}/${f?.originalname}`}
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
export default InputTemplate















//// 24-6-25
// import React, { useEffect, useState } from 'react'
// import { Row, Col, FormGroup, Card, Container, Label, Form, Input } from "reactstrap";
// import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
// import OptionalComponent from './optionalComponent'
// import TagsInput from 'react-tagsinput'
// import { Link } from "react-router-dom"
// import Dropzone from "react-dropzone"
// import _ from 'lodash';
// import urlSocket from 'helpers/urlSocket';
// import OperatorComponent from './OperatorComponent';
// import CheckpointConfigSection from './CheckpointConfigSection';
// import { useSelector } from 'react-redux';


// const InputTemplate = (props) => {
//     const state = useSelector(state => state.treeData);


//     const [authUser, setauthUser] = useState(null)
//     const [configdatacheckpoint, setconfigdatacheckpoint] = useState([])
//     const [checkpointType, setcheckpointType] = useState([])
//     const [cpId, setcpId] = useState(null)
//     const [selectedInputValue, setselectedInputValue] = useState("0")
//     const [dataLoaded, setdataLoaded] = useState(false)
//     const [submitProcess, setsubmitProcess] = useState(false)
//     const [renderChild, setrenderChild] = useState(true)
//     const [selectedFiles, setselectedFiles] = useState([])
//     const [imageUploading, setimageUploading] = useState(false)
//     const [templateData,setTemplateData] = useState(JSON.parse(sessionStorage.getItem("EditData")))

//     useEffect(() => {
//         const fetchData = () => {
//             var data = JSON.parse(sessionStorage.getItem("authUser"));
//             setauthUser(data)
//             var getObjectId = 0
//             if (props.mode === "0") {
//                 setconfigdatacheckpoint(data.config_data.question_type_info.map(obj => ({ ...obj })))
//                 setcpId(getObjectId)
//             }
//             else {
//                 var cpk = data.config_data.question_type_info.map(obj => ({ ...obj }))
//                 var dataInfo = _.cloneDeep(props.checkpointinfo)
//                 _.each(dataInfo, child => {
//                     _.each(cpk, (item, idx) => {
//                         if (child.checkpoint_type_id == item.checkpoint_type_id) {
//                             cpk[idx] = child
//                             getObjectId = idx
//                         }
//                     })
//                 })
//                 setconfigdatacheckpoint(cpk)
//                 setcpId(getObjectId)
//                 setselectedInputValue(cpk[getObjectId].checkpoint_type_id)
//                 setcheckpointType(cpk[getObjectId].checkpoint_type_id)
//             }
//             setdataLoaded(true)

//         }
//         fetchData()
//     }, [])





//     const onChangeParameterType = (event, values) => {
//         setconfigdatacheckpoint(authUser.config_data.question_type_info.map(obj => ({ ...obj })))
//         setcheckpointType(event.target.value)
//         setselectedInputValue(event.target.value)
//         setcpId(parseInt(event.target.value) - 1)

//     }

//     const handleChildUnmount = () => {
//         setrenderChild(false)
//     }

  

//  const showTemplates = (checkpoint_type) => {
//         switch (checkpoint_type) {

//             case "1":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 // console.log('updatedInfo :>> ', updatedInfo);
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                             selectedInputValue= {selectedInputValue}
//                         /> :
//                         null

//                 }

//             case "2":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                              selectedInputValue= {selectedInputValue}
//                         /> :
//                         null

//                 }

//             case "3":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                              selectedInputValue= {selectedInputValue}
//                         /> :
//                         null

//                 }

//             case "4":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 console.log('updatedInfo[cpId] :>> ', updatedInfo[cpId]);
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                              selectedInputValue= {selectedInputValue}
//                         /> :
//                         null

//                 }

//             case "5":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                              selectedInputValue= {selectedInputValue}
//                         /> :
//                         null

//                 }

//             case "6":
//                 {
//                     return renderChild ?
//                         <OperatorComponent
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             submitProcess={submitProcess}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                              selectedInputValue= {selectedInputValue}
//                         /> :
//                         null
//                 }

//             default:
//                 return null
//         }
//     }


//     const handleRadioGroupChange = (event) => {
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//         updatedConfigData[cpId].impact_level = event.target.name;
//         setconfigdatacheckpoint(updatedConfigData)
//     }

//     const handleCheckboxChange = (cpId, key, checked) => {
//         const updated = _.cloneDeep(configdatacheckpoint);
//         if (!updated[cpId]) updated[cpId] = {};
//         updated[cpId][key] = !checked;
//         setconfigdatacheckpoint(updated);
//     };

//     const handleChangeType = (tags) => {
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);;
//         updatedConfigData[cpId].compl_type = tags;
//         setconfigdatacheckpoint(updatedConfigData)

//     }

//     const handleValidSubmit = (event, values) => {
//         props.onSubmit(event, values)
//     }


//     const formatBytes = (bytes, decimals = 2) => {
//         if (bytes === 0) return "0 Bytes";
//         const k = 1024;
//         const dm = decimals < 0 ? 0 : decimals;
//         const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
//     };

//     /// sinle media file upload 20-5-25
//     // const handleAcceptedFiles = (files) => {
//     //     setimageUploading(false)
//     //     files.map(file =>
//     //         Object.assign(file, {
//     //             preview: URL.createObjectURL(file),
//     //             formattedSize: formatBytes(file.size),
//     //             uploading: true,
//     //             uploadingStatus: "Uploading"
//     //         })
//     //     )

//     //     var configdatacheckpointInfo = _.cloneDeep(configdatacheckpoint)
//     //     var selectedFilesInfo = _.cloneDeep(selectedFiles)
//     //     setselectedFiles(selectedFilesInfo.concat(files))
//     //     let formData = new FormData()
//     //     for (const key of Object.keys(files)) {
//     //         formData.append('imagesArray', files[key])
//     //     }
//     //     console.log('formData :>> ', formData);
//     //     try {
//     //         urlSocket.post("storeImage/awswebupload", formData, {
//     //             headers: {
//     //                 'Content-Type': 'multipart/form-data',
//     //             }
//     //         },
//     //             {
//     //                 onUploadProgress: progressEvent => {
//     //                     if (progressEvent.loaded === progressEvent.total) {
//     //                     }

//     //                 }
//     //             }).then(response => {
//     //                 console.log(response, 'response')
//     //                 if (response.data.response_code == 500) {
//     //                     console.log('chandleAcceptedFiles ', configdatacheckpointInfo[cpId]);
//     //                     configdatacheckpointInfo[cpId].guideline_image.push(response.data.data[0])
//     //                     setconfigdatacheckpoint(configdatacheckpointInfo)
//     //                     _.each(response.data.data, item => {
//     //                         _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
//     //                             if (child.originalname == item.originalname) {
//     //                                 let splitString = item.key.split("/");
//     //                                 let getFileName = splitString[splitString.length - 1];
//     //                                 child["uploading"] = false
//     //                                 child["uploadingStatus"] = "Uploaded"
//     //                                 child["preview"] = authUser.config_data.img_url + getFileName
//     //                             }
//     //                         })
//     //                     })
//     //                     setimageUploading(false)
//     //                 }
//     //                 else {
//     //                     _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
//     //                         child["uploading"] = false
//     //                         child["uploadingStatus"] = "Not Uploaded"
//     //                     })
//     //                     setimageUploading(false)
//     //                 }
//     //             })
//     //     } catch (error) {
//     //         console.log(error, 'error308')
//     //     }

//     // }



//     const handleAcceptedFiles = (files) => {
//         setimageUploading(true);
//         const enhancedFiles = files.map(file =>
//             Object.assign(file, {
//                 preview: URL.createObjectURL(file),
//                 formattedSize: formatBytes(file.size),
//                 uploading: true,
//                 uploadingStatus: "Uploading"
//             })
//         );
//         const selectedFilesInfo = _.cloneDeep(selectedFiles);
//         const newFileList = selectedFilesInfo.concat(enhancedFiles);
//         setselectedFiles(newFileList);
//         const configdatacheckpointInfo = _.cloneDeep(configdatacheckpoint);
//         const formData = new FormData();
//         enhancedFiles.forEach(file => {
//             formData.append('imagesArray', file);
//              formData.append('folder', authUser.client_info[0]["s3_folder_path"] + templateData._id + '/');
//         });
//         try {
//             urlSocket.post("storeImage/awswebupload", formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//                 onUploadProgress: progressEvent => {
//                     if (progressEvent.loaded === progressEvent.total) {
//                     }
//                 }
//             }).then(response => {
//                 if (response.data.response_code === 500) {
//                     const uploadedFiles = response.data.data;
//                     configdatacheckpointInfo[cpId].guideline_image.push(...uploadedFiles);
//                     _.each(uploadedFiles, item => {
//                         _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
//                             if (child.originalname === item.originalname) {
//                                 const splitString = item.key.split("/");
//                                 const getFileName = splitString[splitString.length - 1];
//                                 child.uploading = false;
//                                 child.uploadingStatus = "Uploaded";
//                                 child.preview = authUser.config_data.img_url + getFileName;
//                             }
//                         });
//                     });

//                     setconfigdatacheckpoint(configdatacheckpointInfo);
//                 } else {
//                     _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
//                         child.uploading = false;
//                         child.uploadingStatus = "Not Uploaded";
//                     });
//                     setconfigdatacheckpoint(configdatacheckpointInfo);
//                 }
//                 setimageUploading(false);
//             });
//         } catch (error) {
//             console.log(error, 'Upload error');
//             setimageUploading(false);
//         }
//     };



//     const deleteImage = (id) => {
//         const updatecheckInfo = _.cloneDeep(configdatacheckpoint)
//         updatecheckInfo[cpId].guideline_image.splice(id, 1)
//         setconfigdatacheckpoint(updatecheckInfo)
//     }


//     // const validateCheckpoint = (data) => {
//     //     console.log('data :>> ', data);
//     //     setsubmitProcess(true);
//     //     var inputMissing = false;

//     //     if (data.checkpoint == "") {
//     //         inputMissing = true;
//     //     }

//     //     console.log('selectedInputValue :>> ', selectedInputValue);

//     //     data?.rule?.forEach((item, index) => {
//     //         if (selectedInputValue !== '6') {
//     //             if (!item.option_text || item.option_text.trim() === "") {
//     //                 console.log('iffff :>> ');
//     //                 inputMissing = true;
//     //             }
//     //         }
//     //         else {
//     //         console.log('elseeee :>> ');
//     //         }


//     //         if (item.image_info) {
//     //             const { camera, gallery, min, max } = item.image_info;

//     //             if (camera || gallery) {
                    

//     //                 // Allow min = 0, but disallow empty/null/undefined
//     //                 if (min === '' || min === null || min === undefined) {
//     //                     inputMissing = true;
//     //                 }

//     //                 // Disallow max = 0 or blank/null
//     //                 if (
//     //                     max === '' || max === null || max === undefined || Number(max) === 0
//     //                 ) {
//     //                     inputMissing = true;
//     //                 }

//     //                 // Check max >= min only if both are present
//     //                 if (
//     //                     min !== '' &&
//     //                     max !== '' &&
//     //                     min !== null &&
//     //                     max !== null &&
//     //                     min !== undefined &&
//     //                     max !== undefined &&
//     //                     Number(max) < Number(min)
//     //                 ) {
//     //                     inputMissing = true;
//     //                 }
//     //             }
//     //         }
//     //         if (item.video_info) {
//     //             const { camera, gallery, min, max, duration } = item.video_info;
//     //             if (camera || gallery) {
//     //                 // Allow min = 0 but disallow null/undefined/empty
//     //                 if (min === '' || min === null || min === undefined) {
//     //                     inputMissing = true;
//     //                 }

//     //                 // Disallow max = 0 or empty/null/undefined
//     //                 if (
//     //                     max === '' ||
//     //                     max === null ||
//     //                     max === undefined ||
//     //                     Number(max) === 0
//     //                 ) {
//     //                     inputMissing = true;
//     //                 }

//     //                 // Check if max is less than min
//     //                 if (
//     //                     min !== '' &&
//     //                     max !== '' &&
//     //                     min !== null &&
//     //                     max !== null &&
//     //                     min !== undefined &&
//     //                     max !== undefined &&
//     //                     Number(max) < Number(min)
//     //                 ) {
//     //                     inputMissing = true;
//     //                 }

//     //                 // Enforce minimum duration of 5
//     //                 if (
//     //                     duration === '' ||
//     //                     duration === null ||
//     //                     duration === undefined ||
//     //                     Number(duration) < 5
//     //                 ) {
//     //                     inputMissing = true;
//     //                 }
//     //             }
//     //         }

//     //         if (data.enable_validation) {

//     //             if (
//     //                 !item?.compliance ||
//     //                 typeof item.compliance !== 'object' ||
//     //                 !item.compliance.id ||
//     //                 !item.compliance.name ||
//     //                 Object.keys(item.compliance).length === 0
//     //             ) {
//     //                 inputMissing = true;
//     //             }
//     //         }
//     //     });

//     //     if (data.enable_validation) {

//     //         const invalidCompliances = data.rule?.filter((item, index) =>
//     //             !item?.compliance ||
//     //             typeof item.compliance !== 'object' ||
//     //             !item.compliance.id ||
//     //             !item.compliance.name ||
//     //             Object.keys(item.compliance).length === 0
//     //         );

//     //         if (!invalidCompliances || invalidCompliances.length > 0) {
//     //             inputMissing = true;
//     //         }
//     //     }

//     //     if (state.mediaErrors) {
//     //         inputMissing = true;
//     //     }
//     //     if (state.valueErrors) {
//     //         inputMissing = true;
//     //     }
//     //     if (data.impact_level == "") {
//     //         inputMissing = true;
//     //     }


//     //     if (data.enable_validation && selectedInputValue === '6') {
//     //         if (!Array.isArray(data.rule) || data.rule.length === 0) {
//     //             inputMissing = true;
//     //         }
//     //     }
        

//     //     if (!inputMissing && !imageUploading) {
//     //         const processedData = _.cloneDeep(data);

//     //         if (!data.enable_validation && Array.isArray(processedData.rule)) {
//     //             if (configdatacheckpoint[cpId].checkpoint_type_id === '6') {
//     //                 // processedData.rule = []
//     //             } else {
//     //                 processedData.rule = processedData.rule.map(rule => {
//     //                     const newRule = { ...rule };
//     //                      newRule.compliance = null;
//     //                     // delete newRule.compliance;
//     //                     return newRule;
//     //                 });
//     //             }
//     //         }
//     //         console.log('processedData :>> ', processedData);
//     //         // props.onSubmit(processedData);
//     //     }
//     // }




// const validateCheckpoint = (data) => {
//     console.log('data :>> ', data);
//     setsubmitProcess(true);
//     let inputMissing = false;

//     if (data.checkpoint === "") {
//         inputMissing = true;
//     }

//     console.log('selectedInputValue :>> ', selectedInputValue);

//     data?.rule?.forEach((item, index) => {
//         // --- Option Text Validation ---
//         if (selectedInputValue !== '6') {
//             if (!item.option_text || item.option_text.trim() === "") {
//                 console.log(`Empty option_text at rule[${index}]`);
//                 inputMissing = true;
//             }
//         }

//         // --- Image Info Validation ---
//         const image = item.image_info;
//         if (image && (image.camera || image.gallery)) {
//             if (image.min === '' || image.min === null || image.min === undefined) {
//                 inputMissing = true;
//             }

//             if (image.max === '' || image.max === null || image.max === undefined || Number(image.max) === 0) {
//                 inputMissing = true;
//             }

//             if (
//                 image.min !== '' &&
//                 image.max !== '' &&
//                 image.min !== null &&
//                 image.max !== null &&
//                 image.min !== undefined &&
//                 image.max !== undefined &&
//                 Number(image.max) < Number(image.min)
//             ) {
//                 inputMissing = true;
//             }
//         }

//         // --- Video Info Validation ---
//         const video = item.video_info;
//         if (video && (video.camera || video.gallery)) {
//             if (video.min === '' || video.min === null || video.min === undefined) {
//                 inputMissing = true;
//             }

//             if (video.max === '' || video.max === null || video.max === undefined || Number(video.max) === 0) {
//                 inputMissing = true;
//             }

//             if (
//                 video.min !== '' &&
//                 video.max !== '' &&
//                 video.min !== null &&
//                 video.max !== null &&
//                 video.min !== undefined &&
//                 video.max !== undefined &&
//                 Number(video.max) < Number(video.min)
//             ) {
//                 inputMissing = true;
//             }

//             if (
//                 video.duration === '' ||
//                 video.duration === null ||
//                 video.duration === undefined ||
//                 Number(video.duration) < 5
//             ) {
//                 inputMissing = true;
//             }
//         }

//         // --- Compliance Validation ---
//         if (data.enable_validation) {
//             const comp = item.compliance;
//             if (
//                 !comp ||
//                 typeof comp !== 'object' ||
//                 !comp.id ||
//                 !comp.name ||
//                 Object.keys(comp).length === 0
//             ) {
//                 inputMissing = true;
//             }

//             // --- Operator Info Validation ---
//             const op = item.operator_info;
//             if (
//                 !op ||
//                 typeof op !== 'object' ||
//                 !op.operator ||
//                 typeof op.operator !== 'object' ||
//                 !op.operator.id ||
//                 !op.operator.name ||
//                 !op.operator.modulus ||
//                 op.from === '' ||
//                 op.from === null ||
//                 op.from === undefined ||
//                 isNaN(Number(op.from)) ||
//                 op.to === '' ||
//                 op.to === null ||
//                 op.to === undefined ||
//                 isNaN(Number(op.to))
//             ) {
//                 console.log(`Invalid operator_info at rule[${index}]`);
//                 inputMissing = true;
//             } else {
//                 if (op.operator.modulus === 'between' && Number(op.from) > Number(op.to)) {
//                     console.log(`Operator 'between' has from > to at rule[${index}]`);
//                     inputMissing = true;
//                 }
//             }
//         }
//     });

//     // --- Re-check for invalid compliances globally ---
//     if (data.enable_validation) {
//         const invalidCompliances = data.rule?.filter(item =>
//             !item?.compliance ||
//             typeof item.compliance !== 'object' ||
//             !item.compliance.id ||
//             !item.compliance.name ||
//             Object.keys(item.compliance).length === 0
//         );
//         if (!invalidCompliances || invalidCompliances.length > 0) {
//             inputMissing = true;
//         }
//     }

//     // --- Global checks ---
//     if (state.mediaErrors) inputMissing = true;
//     if (state.valueErrors) inputMissing = true;
//     if (data.impact_level === "") inputMissing = true;

//     // --- Special case for type 6 with validation ---
//     if (data.enable_validation && selectedInputValue === '6') {
//         if (!Array.isArray(data.rule) || data.rule.length === 0) {
//             inputMissing = true;
//         }
//     }

//     // --- Final submission ---
//     if (!inputMissing && !imageUploading) {
//         const processedData = _.cloneDeep(data);

//         if (!data.enable_validation && Array.isArray(processedData.rule)) {
//             if (configdatacheckpoint[cpId]?.checkpoint_type_id !== '6') {
//                 processedData.rule = processedData.rule.map(rule => {
//                     const newRule = { ...rule, compliance: null };
//                     return newRule;
//                 });
//             }
//         }

//         console.log('processedData :>> ', processedData);
//         props.onSubmit(processedData);
//     }
// };


//     const handleValidationToggle = (e) => {
//         const isChecked = e.target.checked;
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//         updatedConfigData[cpId]['enable_validation'] = !isChecked;
//         if (selectedInputValue === '6' && !isChecked) {
//             updatedConfigData[cpId]['rule'] = [];
//         }
//         setconfigdatacheckpoint(updatedConfigData);
//     };

//     const handleToggle = (e, field) => {
//         const checked = e.target.checked;
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//         updatedConfigData[cpId][field] = checked;
//         setconfigdatacheckpoint(updatedConfigData);
//     };


//     const handleUnitsChange = (e) => {
//         const value = e.target.value;
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint)
//         updatedConfigData[cpId]["unit_name"] = value
//         setconfigdatacheckpoint(updatedConfigData)

//     };

//     // const handleSignOptionChange = (e, fieldName) => {
//     //     const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//     //     updatedConfigData[cpId]["only_positive"] = false;
//     //     updatedConfigData[cpId]["only_negative"] = false;
//     //     updatedConfigData[cpId]["both_case"] = false;
//     //     updatedConfigData[cpId][fieldName] = true;
//     //     setconfigdatacheckpoint(updatedConfigData);
//     // };

//     // const handleDecimalChange = (e) => {
//     //     const value = e.target.value;
//     //     const regex = /^\d*\.?\d{0,4}$/;
//     //     if (value === '' || regex.test(value)) {
//     //         const updatedConfigData = _.cloneDeep(configdatacheckpoint)
//     //         updatedConfigData[cpId]["max_decimal"] = Number(value)
//     //         setconfigdatacheckpoint(updatedConfigData)
//     //     }
//     // };

//     // const handleMaxDigitsChange = (e) => {
//     //     const value = e.target.value;
//     //     if (value === '' || /^\d+$/.test(value)) {
//     //         var updatedConfigData = _.cloneDeep(configdatacheckpoint)
//     //         updatedConfigData[cpId]["max_digits"] = Number(value)
//     //         setconfigdatacheckpoint(updatedConfigData)
//     //     }
//     // };


//     // const handleDecimalChange = (e) => {
//     //     const value = e.target.value;
//     //     const maxDecimal = Number(value);
//     //     const regex = /^\d*\.?\d{0,4}$/;

//     //     if (value === '' || regex.test(value)) {
//     //         const rules = configdatacheckpoint[cpId]?.rule || [];

//     //         const hasInvalidDecimals = rules.some((rule) => {
//     //             const opInfo = rule.operator_info;
//     //             if (!opInfo) return false;

//     //             const fromDecimals = (opInfo.from?.toString().split('.')[1] || '').length;
//     //             const toDecimals = (opInfo.to?.toString().split('.')[1] || '').length;

//     //             return fromDecimals > maxDecimal || toDecimals > maxDecimal;
//     //         });

//     //         if (hasInvalidDecimals) {
//     //             alert("One or more rules exceed the selected decimal limit.");
//     //             return; // Prevent update
//     //         }

//     //         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//     //         updatedConfigData[cpId]["max_decimal"] = maxDecimal;
//     //         setconfigdatacheckpoint(updatedConfigData);
//     //     }
//     // };

//     const handleDecimalChange = (e) => {
//         const value = e.target.value;
//         const maxDecimal = Number(value);
//         const regex = /^\d*\.?\d{0,4}$/;

//         // Enforce max limit of 4 decimal points
//         if (maxDecimal > 4) {
//             alert("You can allow up to 4 decimal points only.");
//             resetOperatorValuesInRules();
//             return;
//         }

//         if (value === '' || regex.test(value)) {
//             const rules = configdatacheckpoint[cpId]?.rule || [];

//             const hasInvalidDecimals = rules.some((rule) => {
//                 const opInfo = rule.operator_info;
//                 if (!opInfo) return false;

//                 const fromDecimals = (opInfo.from?.toString().split('.')[1] || '').length;
//                 const toDecimals = (opInfo.to?.toString().split('.')[1] || '').length;

//                 return fromDecimals > maxDecimal || toDecimals > maxDecimal;
//             });

//             if (hasInvalidDecimals) {
//                 alert("One or more rules exceed the selected decimal limit.");
//                 return;
//             }

//             const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//             updatedConfigData[cpId]["max_decimal"] = maxDecimal;
//             setconfigdatacheckpoint(updatedConfigData);
//         }
//     };

//     const handleSignOptionChange = (e, fieldName) => {
//         const rules = configdatacheckpoint[cpId]?.rule || [];

//         const isInvalid = rules.some((rule) => {
//             const opInfo = rule.operator_info;
//             if (!opInfo) return false;

//             const values = [Number(opInfo.from), Number(opInfo.to)];
//             if (fieldName === "only_positive") return values.some(v => v < 0);
//             if (fieldName === "only_negative") return values.some(v => v > 0);
//             return false;
//         });

//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);

//         if (isInvalid) {
//             alert("One or more rules contain values that conflict with this sign option. They will be reset.");
//             resetOperatorValuesInRules()

//             // Reset from/to values
//             const rules = updatedConfigData[cpId]?.rule || [];
//             rules.forEach((rule) => {
//                 if (rule.operator_info) {
//                     rule.operator_info.from = "";
//                     rule.operator_info.to = "";
//                 }
//             });
//             updatedConfigData[cpId].rule = rules;
//         }

//         // Set the selected sign option
//         updatedConfigData[cpId]["only_positive"] = false;
//         updatedConfigData[cpId]["only_negative"] = false;
//         updatedConfigData[cpId]["both_case"] = false;
//         updatedConfigData[cpId][fieldName] = true;

//         // Finally update state
//         setconfigdatacheckpoint(updatedConfigData);
//     };

//     const handleMaxDigitsChange = (e) => {
//         const value = e.target.value;
//         if (value === '' || /^\d+$/.test(value)) {
//             const maxDigits = Number(value);
//             const rules = configdatacheckpoint[cpId]?.rule || [];

//             const hasInvalidDigits = rules.some((rule) => {
//                 const opInfo = rule.operator_info;
//                 if (!opInfo) return false;

//                 const fromDigits = opInfo.from?.toString().split('.')[0].length || 0;
//                 const toDigits = opInfo.to?.toString().split('.')[0].length || 0;

//                 return fromDigits > maxDigits || toDigits > maxDigits;
//             });

//             if (hasInvalidDigits) {
//                 alert("One or more rules exceed the selected max digit limit.");
//                 resetOperatorValuesInRules();
//                 return;
//             }

//             const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//             updatedConfigData[cpId]["max_digits"] = maxDigits;
//             setconfigdatacheckpoint(updatedConfigData);
//         }
//     };

//     // const handleSignOptionChange = (e, fieldName) => {
//     //     const rules = configdatacheckpoint[cpId]?.rule || [];

//     //     const isInvalid = rules.some((rule) => {
//     //         const opInfo = rule.operator_info;
//     //         if (!opInfo) return false;

//     //         const values = [Number(opInfo.from), Number(opInfo.to)];
//     //         if (fieldName === "only_positive") return values.some(v => v < 0);
//     //         if (fieldName === "only_negative") return values.some(v => v > 0);
//     //         return false;
//     //     });

//     //     if (isInvalid) {
//     //         alert("One or more rules contain values that conflict with this sign option.");
//     //          resetOperatorValuesInRules();
//     //         return;
//     //     }

//     //     const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//     //     updatedConfigData[cpId]["only_positive"] = false;
//     //     updatedConfigData[cpId]["only_negative"] = false;
//     //     updatedConfigData[cpId]["both_case"] = false;
//     //     updatedConfigData[cpId][fieldName] = true;
//     //     setconfigdatacheckpoint(updatedConfigData);
//     // };




//     const resetOperatorValuesInRules = () => {
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//         const rules = updatedConfigData[cpId]?.rule || [];

//         rules.forEach((rule) => {
//             if (rule.operator_info) {
//                 rule.operator_info.from = "";
//                 rule.operator_info.to = "";
//             }
//         });

//         updatedConfigData[cpId].rule = rules;
//         setconfigdatacheckpoint(updatedConfigData);
//     };



//     const updateRuleField = (idx, key, value) => {
//         const updated = _.cloneDeep(configdatacheckpoint);
//         if (!updated[cpId]) {
//             updated[cpId] = {};
//         }
//         if (!Array.isArray(updated[cpId].rule)) {
//             updated[cpId].rule = [];
//         }

//         while (updated[cpId].rule.length <= idx) {
//             updated[cpId].rule.push({});
//         }
//         updated[cpId].rule[idx][key] = value;
//         console.log('updated :>> ', updated);
//         setconfigdatacheckpoint(updated);
//     };



//     if (dataLoaded) {
//         return (
//             <div>
//                 <Container>
//                     <Row className="justify-content-center">
//                         <Col md={12}>
//                             <AvForm className="form-horizontal" >
//                                 <div className="px-4 py-2">
//                                     <Row className="" >
//                                         <div className="mb-4">
//                                             <Label className="" htmlFor="autoSizingSelect">Select Check point Type<span className="text-danger">*</span></Label>
//                                             <select type="select" name="subtitledd" label="Name" value={selectedInputValue} className="form-select" id="cat" onChange={(e) => onChangeParameterType(e)} >
//                                                 <option value="0" defaultValue="0">Choose...</option>
//                                                 {
//                                                     configdatacheckpoint.map((data, idx) => {
//                                                         return (
//                                                             <option value={data.checkpoint_type_id} key={idx}>{data.checkpoint_type}</option>
//                                                         )
//                                                     })
//                                                 }
//                                             </select>
//                                         </div>
//                                     </Row>

//                                     {
//                                         selectedInputValue !== "0" ?
//                                             <Row>
//                                                 <Label className="" >Check point<span className="text-danger ms-1" style={{ fontSize: "smaller" }}>*</span> </Label>
//                                                 <AvField
//                                                     name="title"
//                                                     value={configdatacheckpoint[cpId].checkpoint}
//                                                     onChange={(e) => {
//                                                         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//                                                         updatedConfigData[cpId].checkpoint = e.target.value.trim();
//                                                         setconfigdatacheckpoint(updatedConfigData)
//                                                     }}
//                                                     className="form-control"
//                                                     placeholder="Enter Check point"
//                                                     type="textarea"
//                                                     validate={{
//                                                         required: {
//                                                             value: submitProcess && configdatacheckpoint[cpId].checkpoint === "" ? true : false
//                                                         }
//                                                     }}
//                                                 />
//                                             </Row>
//                                             : null
//                                     }
//                                     {selectedInputValue !== "0" && selectedInputValue === "6" &&
//                                         <div className="border border-light my-2 bg-light" style={{ padding: 15, borderRadius: 8 }}>

//                                             <Row className="align-items-center">
//                                                 <Col>
//                                                     <FormGroup>
//                                                         <Label for="maxDigits" className="font-weight-bold">
//                                                             Number Digits
//                                                         </Label>
//                                                         <div className="d-flex align-items-center">
//                                                             <Input id="maxDigits" type="number" placeholder="Enter max digits (e.g. 5)" value={configdatacheckpoint[cpId]?.max_digits || ''} onChange={handleMaxDigitsChange} min="1" className="me-2" title="Maximum number of digits before the decimal point" />
//                                                             <span className="text-muted">digits</span>
//                                                         </div>
//                                                         <small className="form-text text-muted"> Enter the maximum number of number digits allowed. </small>
//                                                     </FormGroup>
//                                                 </Col>

//                                                 <Col>
//                                                     <FormGroup>
//                                                         <Label for="decimalValue" className="font-weight-bold">
//                                                             Decimal Points
//                                                         </Label>
//                                                         <div className="d-flex align-items-center">
//                                                             <Input id="decimalValue" type="number" placeholder="Enter decimal points (e.g. 2)" value={configdatacheckpoint[cpId]?.max_decimal || ''} onChange={handleDecimalChange} max="4" className="me-2" title="Number of digits allowed after the decimal point" />
//                                                             <span className="text-muted">point</span>
//                                                         </div>
//                                                         <small className="form-text text-muted"> You can allow up to 4 decimal points. </small>
//                                                     </FormGroup>
//                                                 </Col>
//                                             </Row>


//                                             <Row className="mt-3">
//                                                 <Col md={12}>
//                                                     {/* <FormGroup tag="fieldset">
//                                                         <Label className="font-weight-bold">Positive / Negative</Label>
//                                                         {console.log('configdatacheckpoint[cpId]? :>> ', configdatacheckpoint[cpId])}
//                                                         <div className="d-flex">
//                                                             <FormGroup check className="me-3">
//                                                                 <Label check>
//                                                                     <Input type="radio" name="signOption" defaultChecked={configdatacheckpoint[cpId]?.only_positive} onChange={(e) => handleSignOptionChange(e, 'only_positive')} />{' '}
//                                                                     Only Positive
//                                                                 </Label>
//                                                             </FormGroup>
//                                                             <FormGroup check className="me-3">
//                                                                 <Label check>
//                                                                     <Input type="radio" name="signOption" defaultChecked={configdatacheckpoint[cpId]?.only_negative} onChange={(e) => handleSignOptionChange(e, 'only_negative')} />{' '}
//                                                                     Only Negative
//                                                                 </Label>
//                                                             </FormGroup>
//                                                             <FormGroup check>
//                                                                 <Label check>
//                                                                     <Input type="radio" name="signOption" defaultChecked={configdatacheckpoint[cpId]?.both_case} onChange={(e) => handleSignOptionChange(e, 'both_case')} />{' '}
//                                                                     Both
//                                                                 </Label>
//                                                             </FormGroup>
//                                                         </div>
//                                                     </FormGroup> */}

//                                                     <FormGroup check className="me-3">
//                                                         <Label check>
//                                                             <Input
//                                                                 type="radio"
//                                                                 name="signOption"
//                                                                 checked={configdatacheckpoint[cpId]?.only_positive}
//                                                                 onClick={(e) => handleSignOptionChange(e, 'only_positive')}
//                                                             />
//                                                             {' '}Only Positive
//                                                         </Label>
//                                                     </FormGroup>
//                                                     <FormGroup check className="me-3">
//                                                         <Label check>
//                                                             <Input
//                                                                 type="radio"
//                                                                 name="signOption"
//                                                                 checked={configdatacheckpoint[cpId]?.only_negative}
//                                                                 onClick={(e) => handleSignOptionChange(e, 'only_negative')}
//                                                             />
//                                                             {' '}Only Negative
//                                                         </Label>
//                                                     </FormGroup>
//                                                     <FormGroup check>
//                                                         <Label check>
//                                                             <Input
//                                                                 type="radio"
//                                                                 name="signOption"
//                                                                 checked={configdatacheckpoint[cpId]?.both_case}
//                                                                 onClick={(e) => handleSignOptionChange(e, 'both_case')}
//                                                             />
//                                                             {' '}Both
//                                                         </Label>
//                                                     </FormGroup>

//                                                 </Col>

//                                             </Row>
//                                             <Row className="mt-3">
//                                                 <Col md={12}>
//                                                     <FormGroup>
//                                                         <Label for="units" className="font-weight-bold"> Units </Label>
//                                                         <Input id="units" type="text" placeholder="e.g. kg, m, °C" value={configdatacheckpoint[cpId]?.unit_name} onChange={handleUnitsChange} />
//                                                         <small className="form-text text-muted"> unit of measurement </small>
//                                                     </FormGroup>
//                                                 </Col>
//                                             </Row>
//                                         </div>
//                                     }


//                                     {
//                                         selectedInputValue === '6' && !configdatacheckpoint[cpId]?.enable_validation &&
//                                         <CheckpointConfigSection
//                                             idx={0}
//                                             data={configdatacheckpoint[cpId]?.options !== null ? configdatacheckpoint[cpId]?.options[0] : { option_text: '', id: '', color: null, show_config: true }}
//                                             checkpointInfo={configdatacheckpoint[cpId]}
//                                             updateRuleField={updateRuleField}
//                                             submitProcess={submitProcess}
//                                         />
//                                     }


//                                     {
//                                         selectedInputValue !== "0" ?
//                                             <div className="border border-light bg-light" style={{ padding: 15, borderRadius: 8 }}>
//                                                 <div className='d-flex gap-3'>
//                                                     <div className="form-check form-switch">
//                                                         <input className="form-check-input" type="checkbox" role="switch" id="enableValidationSwitch" checked={configdatacheckpoint[cpId]?.enable_validation || false} onClick={(e) => { handleValidationToggle(e) }} />
//                                                         <label className="form-check-label" htmlFor="enableValidationSwitch"> Enable Validation </label>
//                                                     </div>
//                                                      {!configdatacheckpoint[cpId]?.checkpoint_type?.includes("Not Applicable") && (
//                                                         <div className="form-check form-switch">
//                                                             <input className="form-check-input" type="checkbox" role="switch" id="enableNotApplicable" defaultChecked={configdatacheckpoint[cpId]?.enable_notapplicable} onChange={(e) => handleToggle(e, 'enable_notapplicable')} />
//                                                             <label className="form-check-label" htmlFor="enableNotApplicable"> Enable Not Applicable </label>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             : null
//                                     }


//                                     <Row>
//                                         <Col md={12}>
//                                             {showTemplates(checkpointType)}
//                                         </Col>

//                                     </Row>
                                    

//                                     {
//                                         selectedInputValue !== "0" ?
//                                             <Row style={{ padding: 10 }}>
//                                                 <div className="my-2 d-flex flex-column" style={{ padding: 10, border: submitProcess && configdatacheckpoint[cpId].impact_level == "" ? '1px solid #ff0000' : '0px' }}>
//                                                     <label>Impact Level<span className="text-danger" style={{ fontSize: "smaller" }}>*</span></label>
//                                                     <div style={{ display: 'flex', flexDirection: 'row' }}>
//                                                         <div className="form-check mx-2 form-radio-danger">
//                                                             <input className="form-check-input" type="radio" name="Critical" id="exampleRadios1" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "Critical"} />
//                                                             <label className="form-check-label text-danger" htmlFor="exampleRadios1" > Critical </label>
//                                                         </div>
//                                                         <div className="form-check mx-2 form-radio-warning">
//                                                             <input className="form-check-input" type="radio" name="High" id="exampleRadios2" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "High"} />
//                                                             <label className="form-check-label text-warning" htmlFor="exampleRadios2" > High </label>
//                                                         </div>
//                                                         <div className="form-check mx-2 form-radio-info">
//                                                             <input className="form-check-input" type="radio" name="Medium" id="exampleRadios3" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "Medium"} />
//                                                             <label className="form-check-label text-info" htmlFor="exampleRadios3">Medium</label>
//                                                         </div>
//                                                         <div className="form-check mx-2 form-radio-success">
//                                                             <input className="form-check-input" type="radio" name="Low" id="exampleRadios4" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "Low"} />
//                                                             <label className="form-check-label text-success" htmlFor="exampleRadios4" > Low </label>
//                                                         </div>
//                                                         <div className="form-check mx-2 form-radio-primary">
//                                                             <input className="form-check-input" type="radio" name="No impact" id="exampleRadios5" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "No impact"} />
//                                                             <label className="form-check-label text-primary" htmlFor="exampleRadios5" >No impact </label>
//                                                         </div>
//                                                     </div>
//                                                     {submitProcess && configdatacheckpoint[cpId].impact_level == "" ? <div  >
//                                                         <span className="font-size-10 text-danger" style={{ lineHeight: 1, }}>Select any one impact level </span>
//                                                     </div> : null}
//                                                 </div>

//                                                 <div className="form-check mx-2">
//                                                     <input className="form-check-input" type="checkbox" name="checkpoint_mand_status" id="checkpointMandatory" checked={configdatacheckpoint[cpId]?.checkpoint_mand_status === true} onClick={(e) => handleCheckboxChange(cpId, "checkpoint_mand_status", e.target.checked)} />
//                                                     <label className="form-check-label" htmlFor="checkpointMandatory"> Checkpoint is optional </label>
//                                                 </div>


//                                                 <div className="my-2 d-flex flex-column" style={{ padding: 10, }}>
//                                                     <label>Type</label>
//                                                     <div >
//                                                         <TagsInput value={configdatacheckpoint[cpId].compl_type} onChange={handleChangeType} inputProps={{ placeholder: 'Add a type and hit enter', style: { minWidth: '300px' }  }} />
//                                                         <div className="flex flex-wrap gap-2 mt-2 ms-1">
//                                                             <span className='fw-bold font-size-13'> Example :</span>
//                                                             {['Regulatory', 'Internal', 'External']?.map((type, index, array) => (
//                                                                 <span key={index} className="px-1 py-1 flex items-center gap-1 font-size-11">
//                                                                     {type} {index < array.length - 1 ? ',' : '.'}
//                                                                 </span>
//                                                             ))}
//                                                         </div>



//                                                     </div>
//                                                 </div>
//                                                 <div className="my-2 d-flex flex-column" style={{ padding: 10, }}>
//                                                     <AvForm className="form-horizontal" onValidSubmit={handleValidSubmit}>
//                                                         <div className="mb-3" >
//                                                             <AvField name="guideline" label="Guideline" value={configdatacheckpoint[cpId].guideline} className="form-control" placeholder="Enter Guideline" type="textarea" required
//                                                                 onChange={(e) => {
//                                                                     const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//                                                                     updatedConfigData[cpId].guideline = e.target.value;
//                                                                     setconfigdatacheckpoint(updatedConfigData)
//                                                                 }}
//                                                             />
//                                                         </div>
//                                                     </AvForm>
//                                                     <label>Add images for guidelines</label>
//                                                     <Form>
//                                                         <Dropzone onDrop={acceptedFiles => handleAcceptedFiles(acceptedFiles)} accept={[".jpg", ".jpeg", ".png"]} multiple={true}>
//                                                             {({ getRootProps, getInputProps }) => (
//                                                                 <div className="dropzone">
//                                                                     <div className="dz-message needsclick" {...getRootProps()} >
//                                                                         <input {...getInputProps()} />
//                                                                         <div className="mb-3">
//                                                                             <i className="display-4 text-muted bx bxs-cloud-upload" />
//                                                                         </div>
//                                                                         <h4>Drop files here or click to upload.</h4>
//                                                                     </div>
//                                                                 </div>
//                                                             )}
//                                                         </Dropzone>
//                                                         {/* {console.log('configdatacheckpoint[cpId] :>> ', configdatacheckpoint[cpId])} */}
//                                                         <div className="dropzone-previews mt-3" id="file-previews">
//                                                             {configdatacheckpoint[cpId]?.guideline_image?.map((f, i) => {
//                                                                 return (
//                                                                     <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete" key={i + "-file"}>
//                                                                         <div style={{ display: 'flex', flexDirection: 'row' }}>
//                                                                             <div className="p-2" style={{ width: '95%' }}>
//                                                                                 <Row className="align-items-center">
//                                                                                     <Col className="col-auto">
//                                                                                         <img data-dz-thumbnail="" height="80" className="avatar-sm rounded bg-light" alt={f.name}
//                                                                                             // src={f.preview}
//                                                                                             // src={`${authUser.client_info[0].base_url}eaudit-files/` + f?.originalname}
//                                                                                             src={`${authUser.client_info[0].base_url}${authUser.client_info[0].s3_folder_path}${templateData._id}/${f?.originalname}`}
//                                                                                         />
//                                                                                     </Col>
//                                                                                     <Col>
//                                                                                         <Link to="#" className="text-muted font-weight-bold" > {f.name} </Link>
//                                                                                         <p className="mb-0"> <strong>{f.formattedSize}</strong> </p>
//                                                                                     </Col>

//                                                                                 </Row>
//                                                                                 <div style={{ margin: '5px 0 5px 0' }}>
//                                                                                     <span className={f.uploading ? "font-size-10 text-danger" : "font-size-10 text-success"}>{f.uploadingStatus}</span>
//                                                                                 </div>

//                                                                             </div>
//                                                                             <div style={{ width: '5%', textAlign: 'center' }}>
//                                                                                 <Link to="#" onClick={() => deleteImage(i)}><i className="mdi mdi-close-circle-outline font-size-20 text-danger" /></Link>
//                                                                             </div>
//                                                                         </div>
//                                                                     </Card>
//                                                                 )
//                                                             })}
//                                                         </div>

//                                                     </Form>
//                                                 </div>
//                                             </Row>
//                                             : null

//                                     }
//                                     {
//                                         selectedInputValue !== "0" ?
//                                             <Row>
//                                                 <footer className="ps-0" style={{ display: 'flex', alignItems: "center", height: 50, background: "#fff", width: "100%", position: "fixed", bottom: 0, zIndex: 999, borderTop: "1px solid #dedede" }}>
//                                                     <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center", }}>
//                                                         <>
//                                                             <div style={{ marginRight: 10 }}>
//                                                                 <button className="btn btn-sm btn-outline-success w-sm m-1" type="submit" onClick={() => validateCheckpoint(configdatacheckpoint[cpId])}>
//                                                                     {props.mode == "0" ? "Submit" : "Update"}
//                                                                 </button>
//                                                             </div>
//                                                         </>
//                                                     </div>
//                                                 </footer>
//                                             </Row>
//                                             :

//                                             null
//                                     }


//                                 </div>
//                             </AvForm>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>
//         )
//     }
//     else {
//         return null
//     }
// }
// export default InputTemplate












//24-6-25
// import React, { useEffect, useState } from 'react'
// import { Row, Col, FormGroup, Card, Container, Label, Form, Input } from "reactstrap";
// import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
// import OptionalComponent from './optionalComponent'
// import TagsInput from 'react-tagsinput'
// import { Link } from "react-router-dom"
// import Dropzone from "react-dropzone"
// import _ from 'lodash';
// import urlSocket from 'helpers/urlSocket';
// import OperatorComponent from './OperatorComponent';
// import CheckpointConfigSection from './CheckpointConfigSection';
// import { useSelector } from 'react-redux';


// const InputTemplate = (props) => {
//     const state = useSelector(state => state.treeData);


//     const [authUser, setauthUser] = useState(null)
//     const [configdatacheckpoint, setconfigdatacheckpoint] = useState([])
//     const [checkpointType, setcheckpointType] = useState([])
//     const [cpId, setcpId] = useState(null)
//     const [selectedInputValue, setselectedInputValue] = useState("0")
//     const [dataLoaded, setdataLoaded] = useState(false)
//     const [submitProcess, setsubmitProcess] = useState(false)
//     const [renderChild, setrenderChild] = useState(true)
//     const [selectedFiles, setselectedFiles] = useState([])
//     const [imageUploading, setimageUploading] = useState(false)
//     const [templateData,setTemplateData] = useState(JSON.parse(sessionStorage.getItem("EditData")))

//     useEffect(() => {
//         const fetchData = () => {
//             var data = JSON.parse(sessionStorage.getItem("authUser"));
//             setauthUser(data)
//             var getObjectId = 0
//             if (props.mode === "0") {
//                 setconfigdatacheckpoint(data.config_data.question_type_info.map(obj => ({ ...obj })))
//                 setcpId(getObjectId)
//             }
//             else {
//                 var cpk = data.config_data.question_type_info.map(obj => ({ ...obj }))
//                 var dataInfo = _.cloneDeep(props.checkpointinfo)
//                 _.each(dataInfo, child => {
//                     _.each(cpk, (item, idx) => {
//                         if (child.checkpoint_type_id == item.checkpoint_type_id) {
//                             cpk[idx] = child
//                             getObjectId = idx
//                         }
//                     })
//                 })
//                 setconfigdatacheckpoint(cpk)
//                 setcpId(getObjectId)
//                 setselectedInputValue(cpk[getObjectId].checkpoint_type_id)
//                 setcheckpointType(cpk[getObjectId].checkpoint_type_id)
//             }
//             setdataLoaded(true)

//         }
//         fetchData()
//     }, [])





//     const onChangeParameterType = (event, values) => {
//         setconfigdatacheckpoint(authUser.config_data.question_type_info.map(obj => ({ ...obj })))
//         setcheckpointType(event.target.value)
//         setselectedInputValue(event.target.value)
//         setcpId(parseInt(event.target.value) - 1)

//     }

//     const handleChildUnmount = () => {
//         setrenderChild(false)
//     }

  

//  const showTemplates = (checkpoint_type) => {
//         switch (checkpoint_type) {

//             case "1":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 // console.log('updatedInfo :>> ', updatedInfo);
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                             selectedInputValue= {selectedInputValue}
//                         /> :
//                         null

//                 }

//             case "2":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                              selectedInputValue= {selectedInputValue}
//                         /> :
//                         null

//                 }

//             case "3":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                              selectedInputValue= {selectedInputValue}
//                         /> :
//                         null

//                 }

//             case "4":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 console.log('updatedInfo[cpId] :>> ', updatedInfo[cpId]);
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                              selectedInputValue= {selectedInputValue}
//                         /> :
//                         null

//                 }

//             case "5":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                              selectedInputValue= {selectedInputValue}
//                         /> :
//                         null

//                 }

//             case "6":
//                 {
//                     return renderChild ?
//                         <OperatorComponent
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             submitProcess={submitProcess}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                              selectedInputValue= {selectedInputValue}
//                         /> :
//                         null
//                 }

//             default:
//                 return null
//         }
//     }


//     const handleRadioGroupChange = (event) => {
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//         updatedConfigData[cpId].impact_level = event.target.name;
//         setconfigdatacheckpoint(updatedConfigData)
//     }

//     const handleCheckboxChange = (cpId, key, checked) => {
//         const updated = _.cloneDeep(configdatacheckpoint);
//         if (!updated[cpId]) updated[cpId] = {};
//         updated[cpId][key] = !checked;
//         setconfigdatacheckpoint(updated);
//     };

//     const handleChangeType = (tags) => {
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);;
//         updatedConfigData[cpId].compl_type = tags;
//         setconfigdatacheckpoint(updatedConfigData)

//     }

//     const handleValidSubmit = (event, values) => {
//         props.onSubmit(event, values)
//     }


//     const formatBytes = (bytes, decimals = 2) => {
//         if (bytes === 0) return "0 Bytes";
//         const k = 1024;
//         const dm = decimals < 0 ? 0 : decimals;
//         const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
//     };

//     /// sinle media file upload 20-5-25
//     // const handleAcceptedFiles = (files) => {
//     //     setimageUploading(false)
//     //     files.map(file =>
//     //         Object.assign(file, {
//     //             preview: URL.createObjectURL(file),
//     //             formattedSize: formatBytes(file.size),
//     //             uploading: true,
//     //             uploadingStatus: "Uploading"
//     //         })
//     //     )

//     //     var configdatacheckpointInfo = _.cloneDeep(configdatacheckpoint)
//     //     var selectedFilesInfo = _.cloneDeep(selectedFiles)
//     //     setselectedFiles(selectedFilesInfo.concat(files))
//     //     let formData = new FormData()
//     //     for (const key of Object.keys(files)) {
//     //         formData.append('imagesArray', files[key])
//     //     }
//     //     console.log('formData :>> ', formData);
//     //     try {
//     //         urlSocket.post("storeImage/awswebupload", formData, {
//     //             headers: {
//     //                 'Content-Type': 'multipart/form-data',
//     //             }
//     //         },
//     //             {
//     //                 onUploadProgress: progressEvent => {
//     //                     if (progressEvent.loaded === progressEvent.total) {
//     //                     }

//     //                 }
//     //             }).then(response => {
//     //                 console.log(response, 'response')
//     //                 if (response.data.response_code == 500) {
//     //                     console.log('chandleAcceptedFiles ', configdatacheckpointInfo[cpId]);
//     //                     configdatacheckpointInfo[cpId].guideline_image.push(response.data.data[0])
//     //                     setconfigdatacheckpoint(configdatacheckpointInfo)
//     //                     _.each(response.data.data, item => {
//     //                         _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
//     //                             if (child.originalname == item.originalname) {
//     //                                 let splitString = item.key.split("/");
//     //                                 let getFileName = splitString[splitString.length - 1];
//     //                                 child["uploading"] = false
//     //                                 child["uploadingStatus"] = "Uploaded"
//     //                                 child["preview"] = authUser.config_data.img_url + getFileName
//     //                             }
//     //                         })
//     //                     })
//     //                     setimageUploading(false)
//     //                 }
//     //                 else {
//     //                     _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
//     //                         child["uploading"] = false
//     //                         child["uploadingStatus"] = "Not Uploaded"
//     //                     })
//     //                     setimageUploading(false)
//     //                 }
//     //             })
//     //     } catch (error) {
//     //         console.log(error, 'error308')
//     //     }

//     // }



//     const handleAcceptedFiles = (files) => {
//         setimageUploading(true);
//         const enhancedFiles = files.map(file =>
//             Object.assign(file, {
//                 preview: URL.createObjectURL(file),
//                 formattedSize: formatBytes(file.size),
//                 uploading: true,
//                 uploadingStatus: "Uploading"
//             })
//         );
//         const selectedFilesInfo = _.cloneDeep(selectedFiles);
//         const newFileList = selectedFilesInfo.concat(enhancedFiles);
//         setselectedFiles(newFileList);
//         const configdatacheckpointInfo = _.cloneDeep(configdatacheckpoint);
//         const formData = new FormData();
//         enhancedFiles.forEach(file => {
//             formData.append('imagesArray', file);
//              formData.append('folder', authUser.client_info[0]["s3_folder_path"] + templateData._id + '/');
//         });
//         try {
//             urlSocket.post("storeImage/awswebupload", formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//                 onUploadProgress: progressEvent => {
//                     if (progressEvent.loaded === progressEvent.total) {
//                     }
//                 }
//             }).then(response => {
//                 if (response.data.response_code === 500) {
//                     const uploadedFiles = response.data.data;
//                     configdatacheckpointInfo[cpId].guideline_image.push(...uploadedFiles);
//                     _.each(uploadedFiles, item => {
//                         _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
//                             if (child.originalname === item.originalname) {
//                                 const splitString = item.key.split("/");
//                                 const getFileName = splitString[splitString.length - 1];
//                                 child.uploading = false;
//                                 child.uploadingStatus = "Uploaded";
//                                 child.preview = authUser.config_data.img_url + getFileName;
//                             }
//                         });
//                     });

//                     setconfigdatacheckpoint(configdatacheckpointInfo);
//                 } else {
//                     _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
//                         child.uploading = false;
//                         child.uploadingStatus = "Not Uploaded";
//                     });
//                     setconfigdatacheckpoint(configdatacheckpointInfo);
//                 }
//                 setimageUploading(false);
//             });
//         } catch (error) {
//             console.log(error, 'Upload error');
//             setimageUploading(false);
//         }
//     };



//     const deleteImage = (id) => {
//         const updatecheckInfo = _.cloneDeep(configdatacheckpoint)
//         updatecheckInfo[cpId].guideline_image.splice(id, 1)
//         setconfigdatacheckpoint(updatecheckInfo)
//     }


//     const validateCheckpoint = (data) => {
//         setsubmitProcess(true);
//         var inputMissing = false;

//         if (data.checkpoint == "") {
//             inputMissing = true;
//         }



//         data?.rule?.forEach((item, index) => {
//             if (selectedInputValue !== '6') {
//                 if (!item.option_text || item.option_text.trim() === "") {
//                     inputMissing = true;
//                 }
//             }
//             else {
//             }

//             // if (item.image_info) {
//             //     const { camera, gallery, min, max } = item.image_info;
//             //     if (camera || gallery) {
//             //         console.log('min, max :>> ', min, max, item.image_info);
//             //         if (!min || min === '' ) {
//             //             inputMissing = true;
//             //         }
//             //         if (!max || max === '') {
//             //             inputMissing = true;
//             //         }
//             //         if (min && max && Number(max) < Number(min)) {
//             //             inputMissing = true;
//             //         }
//             //     }
//             // }
//             if (item.image_info) {
//                 const { camera, gallery, min, max } = item.image_info;

//                 if (camera || gallery) {
                    

//                     // Allow min = 0, but disallow empty/null/undefined
//                     if (min === '' || min === null || min === undefined) {
//                         inputMissing = true;
//                     }

//                     // Disallow max = 0 or blank/null
//                     if (
//                         max === '' || max === null || max === undefined || Number(max) === 0
//                     ) {
//                         inputMissing = true;
//                     }

//                     // Check max >= min only if both are present
//                     if (
//                         min !== '' &&
//                         max !== '' &&
//                         min !== null &&
//                         max !== null &&
//                         min !== undefined &&
//                         max !== undefined &&
//                         Number(max) < Number(min)
//                     ) {
//                         inputMissing = true;
//                     }
//                 }
//             }
//             if (item.video_info) {
//                 const { camera, gallery, min, max, duration } = item.video_info;
//                 console.log('video_info min, max :>> ', min, max, item.video_info);

//                 if (camera || gallery) {
//                     // Allow min = 0 but disallow null/undefined/empty
//                     if (min === '' || min === null || min === undefined) {
//                         inputMissing = true;
//                     }

//                     // Disallow max = 0 or empty/null/undefined
//                     if (
//                         max === '' ||
//                         max === null ||
//                         max === undefined ||
//                         Number(max) === 0
//                     ) {
//                         inputMissing = true;
//                     }

//                     // Check if max is less than min
//                     if (
//                         min !== '' &&
//                         max !== '' &&
//                         min !== null &&
//                         max !== null &&
//                         min !== undefined &&
//                         max !== undefined &&
//                         Number(max) < Number(min)
//                     ) {
//                         inputMissing = true;
//                     }

//                     // Enforce minimum duration of 5
//                     if (
//                         duration === '' ||
//                         duration === null ||
//                         duration === undefined ||
//                         Number(duration) < 5
//                     ) {
//                         inputMissing = true;
//                     }
//                 }
//             }

            
//             // if (item.video_info) {
//             //     const { camera, gallery, min, max } = item.video_info;
//             //     if (camera || gallery) {
//             //         if (!min || min === '') {
//             //             inputMissing = true;
//             //         }
//             //         if (!max || max === '') {
//             //             inputMissing = true;
//             //         }
//             //         if (min && max && Number(max) < Number(min)) {
//             //             inputMissing = true;
//             //         }
//             //     }
//             // }

//             if (data.enable_validation) {

//                 if (
//                     !item?.compliance ||
//                     typeof item.compliance !== 'object' ||
//                     !item.compliance.id ||
//                     !item.compliance.name ||
//                     Object.keys(item.compliance).length === 0
//                 ) {
//                     inputMissing = true;
//                 }
//             }
//         });

//         if (data.enable_validation) {

//             const invalidCompliances = data.rule?.filter((item, index) =>
//                 !item?.compliance ||
//                 typeof item.compliance !== 'object' ||
//                 !item.compliance.id ||
//                 !item.compliance.name ||
//                 Object.keys(item.compliance).length === 0
//             );

//             if (!invalidCompliances || invalidCompliances.length > 0) {
//                 inputMissing = true;
//             }
//         }

//         if (state.mediaErrors) {
//             inputMissing = true;
//         }
//         if (state.valueErrors) {
//             inputMissing = true;
//         }
//         if (data.impact_level == "") {
//             inputMissing = true;
//         }


//         if (data.enable_validation && selectedInputValue === '6') {
//             if (!Array.isArray(data.rule) || data.rule.length === 0) {
//                 inputMissing = true;
//             }
//         }

//         if (!inputMissing && !imageUploading) {
//             const processedData = _.cloneDeep(data);

//             if (!data.enable_validation && Array.isArray(processedData.rule)) {
//                 if (configdatacheckpoint[cpId].checkpoint_type_id === '6') {
//                     // processedData.rule = []
//                 } else {
//                     processedData.rule = processedData.rule.map(rule => {
//                         const newRule = { ...rule };
//                          newRule.compliance = null;
//                         // delete newRule.compliance;
//                         return newRule;
//                     });
//                 }
//             }
//             console.log('processedData :>> ', processedData);
//             // props.onSubmit(processedData);
//         }
//     }

//     const handleValidationToggle = (e) => {
//         const isChecked = e.target.checked;
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//         updatedConfigData[cpId]['enable_validation'] = !isChecked;
//         if (selectedInputValue === '6' && !isChecked) {
//             updatedConfigData[cpId]['rule'] = [];
//         }
//         setconfigdatacheckpoint(updatedConfigData);
//     };

//     const handleToggle = (e, field) => {
//         const checked = e.target.checked;
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//         updatedConfigData[cpId][field] = checked;
//         setconfigdatacheckpoint(updatedConfigData);
//     };


//     const handleUnitsChange = (e) => {
//         const value = e.target.value;
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint)
//         updatedConfigData[cpId]["unit_name"] = value
//         setconfigdatacheckpoint(updatedConfigData)

//     };

//     const handleSignOptionChange = (e, fieldName) => {
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//         updatedConfigData[cpId]["only_positive"] = false;
//         updatedConfigData[cpId]["only_negative"] = false;
//         updatedConfigData[cpId]["both_case"] = false;
//         updatedConfigData[cpId][fieldName] = true;
//         setconfigdatacheckpoint(updatedConfigData);
//     };

//     const handleDecimalChange = (e) => {
//         const value = e.target.value;
//         const regex = /^\d*\.?\d{0,4}$/;
//         if (value === '' || regex.test(value)) {
//             const updatedConfigData = _.cloneDeep(configdatacheckpoint)
//             updatedConfigData[cpId]["max_decimal"] = Number(value)
//             setconfigdatacheckpoint(updatedConfigData)
//         }
//     };

//     const handleMaxDigitsChange = (e) => {
//         const value = e.target.value;
//         if (value === '' || /^\d+$/.test(value)) {
//             var updatedConfigData = _.cloneDeep(configdatacheckpoint)
//             updatedConfigData[cpId]["max_digits"] = Number(value)
//             setconfigdatacheckpoint(updatedConfigData)
//         }
//     };



//     const updateRuleField = (idx, key, value) => {
//         const updated = _.cloneDeep(configdatacheckpoint);
//         if (!updated[cpId]) {
//             updated[cpId] = {};
//         }
//         if (!Array.isArray(updated[cpId].rule)) {
//             updated[cpId].rule = [];
//         }

//         while (updated[cpId].rule.length <= idx) {
//             updated[cpId].rule.push({});
//         }
//         updated[cpId].rule[idx][key] = value;
//         console.log('updated :>> ', updated);
//         setconfigdatacheckpoint(updated);
//     };



//     if (dataLoaded) {
//         return (
//             <div>
//                 <Container>
//                     {/* {console.log('configdatacheckpoint[cpId] :>> ', configdatacheckpoint[cpId])} */}
//                     <Row className="justify-content-center">
//                         <Col md={12}>
//                             <AvForm className="form-horizontal" >
//                                 <div className="px-4 py-2">
//                                     <Row className="" >
//                                         <div className="mb-4">
//                                             <Label className="" htmlFor="autoSizingSelect">Select Check point Type<span className="text-danger">*</span></Label>
//                                             <select type="select" name="subtitledd" label="Name" value={selectedInputValue} className="form-select" id="cat" onChange={(e) => onChangeParameterType(e)} >
//                                                 <option value="0" defaultValue="0">Choose...</option>
//                                                 {
//                                                     configdatacheckpoint.map((data, idx) => {
//                                                         return (
//                                                             <option value={data.checkpoint_type_id} key={idx}>{data.checkpoint_type}</option>
//                                                         )
//                                                     })
//                                                 }
//                                             </select>
//                                         </div>
//                                     </Row>

//                                     {
//                                         selectedInputValue !== "0" ?
//                                             <Row>
//                                                 <Label className="" >Check point<span className="text-danger ms-1" style={{ fontSize: "smaller" }}>*</span> </Label>
//                                                 <AvField
//                                                     name="title"
//                                                     value={configdatacheckpoint[cpId].checkpoint}
//                                                     onChange={(e) => {
//                                                         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//                                                         updatedConfigData[cpId].checkpoint = e.target.value.trim();
//                                                         setconfigdatacheckpoint(updatedConfigData)
//                                                     }}
//                                                     className="form-control"
//                                                     placeholder="Enter Check point"
//                                                     type="textarea"
//                                                     validate={{
//                                                         required: {
//                                                             value: submitProcess && configdatacheckpoint[cpId].checkpoint === "" ? true : false
//                                                         }
//                                                     }}
//                                                 />
//                                             </Row>
//                                             : null
//                                     }
//                                     {selectedInputValue !== "0" && selectedInputValue === "6" &&
//                                         <div className="border border-light my-2 bg-light" style={{ padding: 15, borderRadius: 8 }}>

//                                             <Row className="align-items-center">
//                                                 <Col>
//                                                     <FormGroup>
//                                                         <Label for="maxDigits" className="font-weight-bold">
//                                                             Number Digits
//                                                         </Label>
//                                                         <div className="d-flex align-items-center">
//                                                             <Input id="maxDigits" type="number" placeholder="Enter max digits (e.g. 5)" value={configdatacheckpoint[cpId]?.max_digits || ''} onChange={handleMaxDigitsChange} min="1" className="me-2" title="Maximum number of digits before the decimal point" />
//                                                             <span className="text-muted">digits</span>
//                                                         </div>
//                                                         <small className="form-text text-muted"> Enter the maximum number of number digits allowed. </small>
//                                                     </FormGroup>
//                                                 </Col>

//                                                 <Col>
//                                                     <FormGroup>
//                                                         <Label for="decimalValue" className="font-weight-bold">
//                                                             Decimal Points
//                                                         </Label>
//                                                         <div className="d-flex align-items-center">
//                                                             <Input id="decimalValue" type="number" placeholder="Enter decimal points (e.g. 2)" value={configdatacheckpoint[cpId]?.max_decimal || ''} onChange={handleDecimalChange} max="4" className="me-2" title="Number of digits allowed after the decimal point" />
//                                                             <span className="text-muted">point</span>
//                                                         </div>
//                                                         <small className="form-text text-muted"> You can allow up to 4 decimal points. </small>
//                                                     </FormGroup>
//                                                 </Col>
//                                             </Row>


//                                             <Row className="mt-3">
//                                                 <Col md={12}>
//                                                     <FormGroup tag="fieldset">
//                                                         <Label className="font-weight-bold">Positive / Negative</Label>
//                                                         <div className="d-flex">
//                                                             <FormGroup check className="me-3">
//                                                                 <Label check>
//                                                                     <Input type="radio" name="signOption" defaultChecked={configdatacheckpoint[cpId]?.only_positive} onChange={(e) => handleSignOptionChange(e, 'only_positive')} />{' '}
//                                                                     Only Positive
//                                                                 </Label>
//                                                             </FormGroup>
//                                                             <FormGroup check className="me-3">
//                                                                 <Label check>
//                                                                     <Input type="radio" name="signOption" defaultChecked={configdatacheckpoint[cpId]?.only_negative} onChange={(e) => handleSignOptionChange(e, 'only_negative')} />{' '}
//                                                                     Only Negative
//                                                                 </Label>
//                                                             </FormGroup>
//                                                             <FormGroup check>
//                                                                 <Label check>
//                                                                     <Input type="radio" name="signOption" defaultChecked={configdatacheckpoint[cpId]?.both_case} onChange={(e) => handleSignOptionChange(e, 'both_case')} />{' '}
//                                                                     Both
//                                                                 </Label>
//                                                             </FormGroup>
//                                                         </div>
//                                                     </FormGroup>
//                                                 </Col>

//                                             </Row>
//                                             <Row className="mt-3">
//                                                 <Col md={12}>
//                                                     <FormGroup>
//                                                         <Label for="units" className="font-weight-bold"> Units </Label>
//                                                         <Input id="units" type="text" placeholder="e.g. kg, m, °C" value={configdatacheckpoint[cpId]?.unit_name} onChange={handleUnitsChange} />
//                                                         <small className="form-text text-muted"> unit of measurement </small>
//                                                     </FormGroup>
//                                                 </Col>
//                                             </Row>
//                                         </div>
//                                     }


//                                     {
//                                         selectedInputValue === '6' && !configdatacheckpoint[cpId]?.enable_validation &&
//                                         <CheckpointConfigSection
//                                             idx={0}
//                                             data={configdatacheckpoint[cpId]?.options !== null ? configdatacheckpoint[cpId]?.options[0] : { option_text: '', id: '', color: null, show_config: true }}
//                                             checkpointInfo={configdatacheckpoint[cpId]}
//                                             updateRuleField={updateRuleField}
//                                             submitProcess={submitProcess}
//                                         />
//                                     }


//                                     {
//                                         selectedInputValue !== "0" ?
//                                             <div className="border border-light bg-light" style={{ padding: 15, borderRadius: 8 }}>
//                                                 <div className='d-flex gap-3'>
//                                                     <div className="form-check form-switch">
//                                                         <input className="form-check-input" type="checkbox" role="switch" id="enableValidationSwitch" checked={configdatacheckpoint[cpId]?.enable_validation || false} onClick={(e) => { handleValidationToggle(e) }} />
//                                                         <label className="form-check-label" htmlFor="enableValidationSwitch"> Enable Validation </label>
//                                                     </div>

//                                                     {/* <div className="form-check form-switch">
//                                                         <input className="form-check-input" type="checkbox" role="switch" id="enableNotApplicable" defaultChecked={configdatacheckpoint[cpId]?.enable_notapplicable} onChange={(e) => handleToggle(e, 'enable_notapplicable')} />
//                                                         <label className="form-check-label" htmlFor="enableNotApplicable"> Enable Not Applicable </label>
//                                                     </div> */}
//                                                      {!configdatacheckpoint[cpId]?.checkpoint_type?.includes("Not Applicable") && (
//                                                         <div className="form-check form-switch">
//                                                             <input className="form-check-input" type="checkbox" role="switch" id="enableNotApplicable" defaultChecked={configdatacheckpoint[cpId]?.enable_notapplicable} onChange={(e) => handleToggle(e, 'enable_notapplicable')} />
//                                                             <label className="form-check-label" htmlFor="enableNotApplicable"> Enable Not Applicable </label>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             : null
//                                     }


//                                     <Row>
//                                         <Col md={12}>
//                                             {showTemplates(checkpointType)}
//                                         </Col>

//                                     </Row>
                                    

//                                     {
//                                         selectedInputValue !== "0" ?
//                                             <Row style={{ padding: 10 }}>
//                                                 <div className="my-2 d-flex flex-column" style={{ padding: 10, border: submitProcess && configdatacheckpoint[cpId].impact_level == "" ? '1px solid #ff0000' : '0px' }}>
//                                                     <label>Impact Level<span className="text-danger" style={{ fontSize: "smaller" }}>*</span></label>
//                                                     <div style={{ display: 'flex', flexDirection: 'row' }}>
//                                                         <div className="form-check mx-2 form-radio-danger">
//                                                             <input className="form-check-input" type="radio" name="Critical" id="exampleRadios1" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "Critical"} />
//                                                             <label className="form-check-label text-danger" htmlFor="exampleRadios1" > Critical </label>
//                                                         </div>
//                                                         <div className="form-check mx-2 form-radio-warning">
//                                                             <input className="form-check-input" type="radio" name="High" id="exampleRadios2" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "High"} />
//                                                             <label className="form-check-label text-warning" htmlFor="exampleRadios2" > High </label>
//                                                         </div>
//                                                         <div className="form-check mx-2 form-radio-info">
//                                                             <input className="form-check-input" type="radio" name="Medium" id="exampleRadios3" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "Medium"} />
//                                                             <label className="form-check-label text-info" htmlFor="exampleRadios3">Medium</label>
//                                                         </div>
//                                                         <div className="form-check mx-2 form-radio-success">
//                                                             <input className="form-check-input" type="radio" name="Low" id="exampleRadios4" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "Low"} />
//                                                             <label className="form-check-label text-success" htmlFor="exampleRadios4" > Low </label>
//                                                         </div>
//                                                         <div className="form-check mx-2 form-radio-primary">
//                                                             <input className="form-check-input" type="radio" name="No impact" id="exampleRadios5" value={configdatacheckpoint[cpId].impact_level} onClick={handleRadioGroupChange} checked={configdatacheckpoint[cpId].impact_level === "No impact"} />
//                                                             <label className="form-check-label text-primary" htmlFor="exampleRadios5" >No impact </label>
//                                                         </div>
//                                                     </div>
//                                                     {submitProcess && configdatacheckpoint[cpId].impact_level == "" ? <div  >
//                                                         <span className="font-size-10 text-danger" style={{ lineHeight: 1, }}>Select any one impact level </span>
//                                                     </div> : null}
//                                                 </div>

//                                                 <div className="form-check mx-2">
//                                                     <input className="form-check-input" type="checkbox" name="checkpoint_mand_status" id="checkpointMandatory" checked={configdatacheckpoint[cpId]?.checkpoint_mand_status === true} onClick={(e) => handleCheckboxChange(cpId, "checkpoint_mand_status", e.target.checked)} />
//                                                     <label className="form-check-label" htmlFor="checkpointMandatory"> Checkpoint is optional </label>
//                                                 </div>


//                                                 <div className="my-2 d-flex flex-column" style={{ padding: 10, }}>
//                                                     <label>Type</label>
//                                                     <div >
//                                                         <TagsInput value={configdatacheckpoint[cpId].compl_type} onChange={handleChangeType} inputProps={{ placeholder: 'Add a type and hit enter', style: { minWidth: '300px' }  }} />
//                                                         <div className="flex flex-wrap gap-2 mt-2 ms-1">
//                                                             <span className='fw-bold font-size-13'> Example :</span>
//                                                             {['Regulatory', 'Internal', 'External']?.map((type, index, array) => (
//                                                                 <span key={index} className="px-1 py-1 flex items-center gap-1 font-size-11">
//                                                                     {type} {index < array.length - 1 ? ',' : '.'}
//                                                                 </span>
//                                                             ))}
//                                                         </div>



//                                                     </div>
//                                                 </div>
//                                                 <div className="my-2 d-flex flex-column" style={{ padding: 10, }}>
//                                                     <AvForm className="form-horizontal" onValidSubmit={handleValidSubmit}>
//                                                         <div className="mb-3" >
//                                                             <AvField name="guideline" label="Guideline" value={configdatacheckpoint[cpId].guideline} className="form-control" placeholder="Enter Guideline" type="textarea" required
//                                                                 onChange={(e) => {
//                                                                     const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//                                                                     updatedConfigData[cpId].guideline = e.target.value;
//                                                                     setconfigdatacheckpoint(updatedConfigData)
//                                                                 }}
//                                                             />
//                                                         </div>
//                                                     </AvForm>
//                                                     <label>Add images for guidelines</label>
//                                                     <Form>
//                                                         <Dropzone onDrop={acceptedFiles => handleAcceptedFiles(acceptedFiles)} accept={[".jpg", ".jpeg", ".png"]} multiple={true}>
//                                                             {({ getRootProps, getInputProps }) => (
//                                                                 <div className="dropzone">
//                                                                     <div className="dz-message needsclick" {...getRootProps()} >
//                                                                         <input {...getInputProps()} />
//                                                                         <div className="mb-3">
//                                                                             <i className="display-4 text-muted bx bxs-cloud-upload" />
//                                                                         </div>
//                                                                         <h4>Drop files here or click to upload.</h4>
//                                                                     </div>
//                                                                 </div>
//                                                             )}
//                                                         </Dropzone>
//                                                         {/* {console.log('configdatacheckpoint[cpId] :>> ', configdatacheckpoint[cpId])} */}
//                                                         <div className="dropzone-previews mt-3" id="file-previews">
//                                                             {configdatacheckpoint[cpId]?.guideline_image?.map((f, i) => {
//                                                                 return (
//                                                                     <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete" key={i + "-file"}>
//                                                                         <div style={{ display: 'flex', flexDirection: 'row' }}>
//                                                                             <div className="p-2" style={{ width: '95%' }}>
//                                                                                 <Row className="align-items-center">
//                                                                                     <Col className="col-auto">
//                                                                                         <img data-dz-thumbnail="" height="80" className="avatar-sm rounded bg-light" alt={f.name}
//                                                                                             // src={f.preview}
//                                                                                             // src={`${authUser.client_info[0].base_url}eaudit-files/` + f?.originalname}
//                                                                                             src={`${authUser.client_info[0].base_url}${authUser.client_info[0].s3_folder_path}${templateData._id}/${f?.originalname}`}
//                                                                                         />
//                                                                                     </Col>
//                                                                                     <Col>
//                                                                                         <Link to="#" className="text-muted font-weight-bold" > {f.name} </Link>
//                                                                                         <p className="mb-0"> <strong>{f.formattedSize}</strong> </p>
//                                                                                     </Col>

//                                                                                 </Row>
//                                                                                 <div style={{ margin: '5px 0 5px 0' }}>
//                                                                                     <span className={f.uploading ? "font-size-10 text-danger" : "font-size-10 text-success"}>{f.uploadingStatus}</span>
//                                                                                 </div>

//                                                                             </div>
//                                                                             <div style={{ width: '5%', textAlign: 'center' }}>
//                                                                                 <Link to="#" onClick={() => deleteImage(i)}><i className="mdi mdi-close-circle-outline font-size-20 text-danger" /></Link>
//                                                                             </div>
//                                                                         </div>
//                                                                     </Card>
//                                                                 )
//                                                             })}
//                                                         </div>

//                                                     </Form>
//                                                 </div>
//                                             </Row>
//                                             : null

//                                     }
//                                     {
//                                         selectedInputValue !== "0" ?
//                                             <Row>
//                                                 <footer className="ps-0" style={{ display: 'flex', alignItems: "center", height: 50, background: "#fff", width: "100%", position: "fixed", bottom: 0, zIndex: 999, borderTop: "1px solid #dedede" }}>
//                                                     <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center", }}>
//                                                         <>
//                                                             <div style={{ marginRight: 10 }}>
//                                                                 <button className="btn btn-sm btn-outline-success w-sm m-1" type="submit" onClick={() => validateCheckpoint(configdatacheckpoint[cpId])}>
//                                                                     {props.mode == "0" ? "Submit" : "Update"}
//                                                                 </button>
//                                                             </div>
//                                                         </>
//                                                     </div>
//                                                 </footer>
//                                             </Row>
//                                             :

//                                             null
//                                     }


//                                 </div>
//                             </AvForm>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>
//         )
//     }
//     else {
//         return null
//     }
// }
// export default InputTemplate













//before simplify code 15-5-25

// import React, { useEffect, useState } from 'react'
// import { Row, Col, FormGroup, Button, Card, CardBody, Container, Alert, Label, Form, Progress, Input } from "reactstrap";
// import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
// import OptionalComponent from './optionalComponent'
// import TagsInput from 'react-tagsinput'
// import { Link } from "react-router-dom"
// import Dropzone from "react-dropzone"
// import _ from 'lodash';
// import urlSocket from 'helpers/urlSocket';
// import OperatorComponent from './OperatorComponent';
// import CheckpointConfigSection from './CheckpointConfigSection';



// const InputTemplate = (props) => {

//     const [authUser, setauthUser] = useState(null)
//     const [configdatacheckpoint, setconfigdatacheckpoint] = useState([])
//     const [checkpointType, setcheckpointType] = useState([])
//     const [cpId, setcpId] = useState(null)
//     const [selectedInputValue, setselectedInputValue] = useState("0")
//     const [dataLoaded, setdataLoaded] = useState(false)
//     const [submitProcess, setsubmitProcess] = useState(false)
//     const [renderChild, setrenderChild] = useState(true)
//     const [selectedFiles, setselectedFiles] = useState([])
//     const [imageUploading, setimageUploading] = useState(false)

//     const [enableValidation, setEnableValidation] = useState(false);



//     useEffect(() => {
//         const fetchData = () => {
//             var data = JSON.parse(sessionStorage.getItem("authUser"));
//             setauthUser(data)
//             var getObjectId = 0
//             if (props.mode === "0") {
//                 setconfigdatacheckpoint(data.config_data.question_type_info.map(obj => ({ ...obj })))
//                 setcpId(getObjectId)
//             }
//             else {
//                 var cpk = data.config_data.question_type_info.map(obj => ({ ...obj }))
//                 var dataInfo = _.cloneDeep(props.checkpointinfo)
//                 _.each(dataInfo, child => {
//                     _.each(cpk, (item, idx) => {
//                         if (child.checkpoint_type_id == item.checkpoint_type_id) {
//                             cpk[idx] = child
//                             getObjectId = idx
//                         }
//                     })
//                 })
//                 setconfigdatacheckpoint(cpk)
//                 setcpId(getObjectId)
//                 setselectedInputValue(cpk[getObjectId].checkpoint_type_id)
//                 setcheckpointType(cpk[getObjectId].checkpoint_type_id)
//             }
//             setdataLoaded(true)

//         }
//         fetchData()
//     }, [])





//     const onChangeParameterType = (event, values) => {
//         setconfigdatacheckpoint(authUser.config_data.question_type_info.map(obj => ({ ...obj })))
//         setcheckpointType(event.target.value)
//         setselectedInputValue(event.target.value)
//         setcpId(parseInt(event.target.value) - 1)

//     }

//     const handleChildUnmount = () => {
//         setrenderChild(false)
//     }

//     const showTemplates = (checkpoint_type) => {
//         switch (checkpoint_type) {

//             case "1":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}

//                         /> :
//                         null

//                 }

//             case "2":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}

//                         /> :
//                         null

//                 }

//             case "3":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}

//                         /> :
//                         null

//                 }

//             case "4":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}

//                         /> :
//                         null

//                 }

//             case "5":
//                 {
//                     return renderChild ?
//                         <OptionalComponent
//                             unmountMe={handleChildUnmount}
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             submitProcess={submitProcess}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}

//                         /> :
//                         null

//                 }

//             case "6":
//                 {
//                     return renderChild ?
//                         <OperatorComponent
//                             checkpointinfo={configdatacheckpoint[cpId]}
//                             // checkpointCompliance={configdatacheckpoint[cpId].other_options}
//                             edit={true}
//                             config_data={authUser.config_data}
//                             submitProcess={submitProcess}
//                             updateState={(data) => {
//                                 const updatedInfo = _.cloneDeep(configdatacheckpoint)
//                                 updatedInfo[cpId] = data
//                                 setconfigdatacheckpoint(updatedInfo)
//                             }}
//                             onChangeEnableValidation={(data) => { setEnableValidation(data) }}
//                             enable_validation={configdatacheckpoint[cpId].enable_validation}
//                         /> :
//                         null
//                 }

//             default:
//                 return null
//         }
//     }


//     const handleRadioGroupChange = (event) => {
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//         updatedConfigData[cpId].impact_level = event.target.name;
//         setconfigdatacheckpoint(updatedConfigData)
//     }


//     const handleChangeType = (tags) => {
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);;
//         updatedConfigData[cpId].compl_type = tags;
//         setconfigdatacheckpoint(updatedConfigData)

//     }

//     const handleValidSubmit = (event, values) => {
//         props.onSubmit(event, values)
//     }

//     const handleAcceptedFiles = (files) => {
//         setimageUploading(false)
//         files.map(file =>
//             Object.assign(file, {
//                 preview: URL.createObjectURL(file),
//                 formattedSize: this.formatBytes(file.size),
//                 uploading: true,
//                 uploadingStatus: "Uploading"
//             })
//         )

//         var configdatacheckpointInfo = _.cloneDeep(configdatacheckpoint)
//         var selectedFilesInfo = _.cloneDeep(selectedFiles)
//         setselectedFiles(selectedFilesInfo.concat(files))
//         let formData = new FormData()
//         for (const key of Object.keys(files)) {
//             formData.append('imagesArray', files[key])
//         }

//         try {
//             urlSocket.post("storeImage/awswebupload", formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 }
//             },
//                 {
//                     onUploadProgress: progressEvent => {
//                         if (progressEvent.loaded === progressEvent.total) {
//                         }

//                     }
//                 }).then(response => {
//                     //console.log(response, 'response')
//                     if (response.data.response_code == 500) {
//                         configdatacheckpointInfo[cpId].guideline_image.push(response.data.data[0])
//                         setconfigdatacheckpoint(configdatacheckpointInfo)
//                         _.each(response.data.data, item => {
//                             _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
//                                 //console.log(child, item)
//                                 if (child.originalname == item.originalname) {
//                                     let splitString = item.key.split("/");
//                                     let getFileName = splitString[splitString.length - 1];

//                                     child["uploading"] = false
//                                     child["uploadingStatus"] = "Uploaded"
//                                     child["preview"] = authUser.config_data.img_url + getFileName
//                                 }
//                             })
//                         })
//                         setimageUploading(false)
//                     }
//                     else {
//                         _.each(configdatacheckpointInfo[cpId].guideline_image, child => {
//                             child["uploading"] = false
//                             child["uploadingStatus"] = "Not Uploaded"
//                         })
//                         setimageUploading(false)
//                     }

//                 })
//         } catch (error) {
//             //console.log(error, 'error308')
//         }

//     }

//     const deleteImage = (id) => {
//         const updatecheckInfo = _.cloneDeep(configdatacheckpoint)
//         updatecheckInfo[cpId].guideline_image.splice(id, 1)
//         setconfigdatacheckpoint(updatecheckInfo)
//     }


//     const validateCheckpoint = (data) => {

//         setsubmitProcess(true)
//         var inputMissing = false

//         if (data.checkpoint == "") {
//             inputMissing = true
//         }
//         //console.log(data, 'data')

//         _.each(data.checkpoint_options, item => {
//             {
//                 //console.log(item, item.no_of_video > authUser.config_data.max_photos)
//             }
//             if (item.option_text == "") {
//                 inputMissing = true
//             }
//             if (item.enable_img && (Number.isNaN(item.no_of_img) || item.no_of_img == 0 || (!item.enable_gallery && !item.enable_cam))) {
//                 inputMissing = true
//             }
//             if (item.enable_video && item.no_of_video > authUser.config_data.max_photos) {
//                 inputMissing = true
//             }
//             if (item.enable_video && item.no_of_video === undefined) {
//                 item.no_of_video = 1
//             }
//             if (item.enable_video && (Number.isNaN(item.no_of_video) || item.no_of_video == 0 || (!item.enable_video_gallery && !item.enable_video_cam))) {
//                 inputMissing = true
//             }
//             if (item.enable_video && (Number.isNaN(item.no_of_video) || item.no_of_video == 0 || (!item.enable_video_gallery && !item.enable_video_cam))) {
//                 inputMissing = true
//             }
//             if (item.default_video_duration > Number(authUser.config_data.max_video_duration)) {
//                 inputMissing = true
//             }
//             if (item.enable_doc && item.documents.length == 0) {
//                 inputMissing = true
//             }
//             if (item.enable_score && Number.isNaN(item.score)) {
//                 inputMissing = true
//             }
//             var getComplianceStatus = _.some(item.compliance, { 'is_selected': true });
//             if (!getComplianceStatus) {
//                 inputMissing = true
//             }
//         })

//         if (data.impact_level == "") {
//             inputMissing = true
//         }

//         if (!inputMissing && !imageUploading) {
//             const processedData = _.cloneDeep(data);

//             if (!data.enable_validation && Array.isArray(processedData.rule)) {
//                 if (configdatacheckpoint[cpId].checkpoint_type_id === '6') {
//                     processedData.rule = []
//                 } else {
//                     processedData.rule = processedData.rule.map(rule => {
//                         const newRule = { ...rule };
//                         delete newRule.compliance;
//                         return newRule;
//                     });
//                 }
//             }

//             console.log('submittt', processedData, enableValidation);
//             // props.onSubmit(processedData);
//         }

//     }




//     const handleValidationToggle = (e) => {
//         const isChecked = e.target.checked;
//         // setEnableValidation(isChecked);
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//         updatedConfigData[cpId]['enable_validation'] = !isChecked;
//         setconfigdatacheckpoint(updatedConfigData);
//     };

//     const handleToggle = (e, field) => {
//         const checked = e.target.checked;
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//         updatedConfigData[cpId][field] = checked;
//         setconfigdatacheckpoint(updatedConfigData);
//     };


//     const handleUnitsChange = (e) => {
//         const value = e.target.value;
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint)
//         updatedConfigData[cpId]["unit_name"] = value
//         setconfigdatacheckpoint(updatedConfigData)

//     };

//     const handleSignOptionChange = (e, fieldName) => {
//         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//         updatedConfigData[cpId]["only_positive"] = false;
//         updatedConfigData[cpId]["only_negative"] = false;
//         updatedConfigData[cpId]["both_case"] = false;
//         updatedConfigData[cpId][fieldName] = true;
//         setconfigdatacheckpoint(updatedConfigData);
//     };

//     const handleDecimalChange = (e) => {
//         const value = e.target.value;
//         const regex = /^\d*\.?\d{0,4}$/;
//         if (value === '' || regex.test(value)) {
//             const updatedConfigData = _.cloneDeep(configdatacheckpoint)
//             updatedConfigData[cpId]["max_decimal"] = Number(value)
//             setconfigdatacheckpoint(updatedConfigData)
//         }
//     };

//     const handleMaxDigitsChange = (e) => {
//         const value = e.target.value;
//         if (value === '' || /^\d+$/.test(value)) {
//             var updatedConfigData = _.cloneDeep(configdatacheckpoint)
//             updatedConfigData[cpId]["max_digits"] = Number(value)
//             setconfigdatacheckpoint(updatedConfigData)
//         }
//     };


//     const updateRuleField = (idx, key, value) => {
//         const updated = _.cloneDeep(configdatacheckpoint);
//         if (!Array.isArray(updated.rule)) updated.rule = [];

//         while (updated.rule.length <= idx) {
//             updated.rule.push({});
//         }

//         updated.rule[idx][key] = value;
//         setconfigdatacheckpoint(updated);
//     }


//     if (dataLoaded) {
//         return (
//             <div>
//                 <Container>
//                     <Row className="justify-content-center">
//                         <Col md={12}>
//                             <AvForm className="form-horizontal" >
//                                 <div className="px-4 py-2">

//                                     <Row className="" >
//                                         <div className="mb-4">

//                                             <Label className="" htmlFor="autoSizingSelect">Select Check point Type<span className="text-danger">*</span></Label>
//                                             <select
//                                                 type="select"
//                                                 name="subtitledd"
//                                                 label="Name"
//                                                 value={selectedInputValue}
//                                                 className="form-select"
//                                                 id="cat"
//                                                 onChange={(e) => onChangeParameterType(e)}
//                                             >
//                                                 <option value="0" defaultValue="0">Choose...</option>
//                                                 {
//                                                     configdatacheckpoint.map((data, idx) => {
//                                                         return (
//                                                             <option value={data.checkpoint_type_id} key={idx}>{data.checkpoint_type}</option>
//                                                         )
//                                                     })
//                                                 }
//                                             </select>
//                                         </div>
//                                     </Row>
//                                     {
//                                         selectedInputValue !== "0" ?
//                                             <Row>
//                                                 <Label className="" >Check point<span className="text-danger ms-1" style={{ fontSize: "smaller" }}>*</span> </Label>
//                                                 <AvField
//                                                     name="title"
//                                                     value={configdatacheckpoint[cpId].checkpoint}
//                                                     onChange={(e) => {
//                                                         const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//                                                         updatedConfigData[cpId].checkpoint = e.target.value.trim();
//                                                         setconfigdatacheckpoint(updatedConfigData)
//                                                     }}
//                                                     className="form-control"
//                                                     placeholder="Enter Check point"
//                                                     type="textarea"
//                                                     validate={{
//                                                         required: {
//                                                             value: submitProcess && configdatacheckpoint[cpId].checkpoint === "" ? true : false
//                                                         }
//                                                     }}
//                                                 />
//                                             </Row>
//                                             : null
//                                     }
//                                     {selectedInputValue !== "0" && selectedInputValue === "6" &&
//                                         <div className="border border-light my-2 bg-light" style={{ padding: 15, borderRadius: 8 }}>

//                                             <Row className="align-items-center">
//                                                 <Col>
//                                                     <FormGroup>
//                                                         <Label for="maxDigits" className="font-weight-bold">
//                                                             Number Digits
//                                                         </Label>
//                                                         <div className="d-flex align-items-center">
//                                                             <Input
//                                                                 id="maxDigits"
//                                                                 type="number"
//                                                                 placeholder="Enter max digits (e.g. 5)"
//                                                                 value={configdatacheckpoint[cpId]?.max_digits || ''}
//                                                                 onChange={handleMaxDigitsChange}
//                                                                 min="1"
//                                                                 className="me-2"
//                                                                 title="Maximum number of digits before the decimal point"
//                                                             />
//                                                             <span className="text-muted">digits</span>
//                                                         </div>
//                                                         <small className="form-text text-muted">
//                                                             Enter the maximum number of number digits allowed.
//                                                         </small>
//                                                     </FormGroup>
//                                                 </Col>

//                                                 <Col>
//                                                     <FormGroup>
//                                                         <Label for="decimalValue" className="font-weight-bold">
//                                                             Decimal Points
//                                                         </Label>
//                                                         <div className="d-flex align-items-center">
//                                                             <Input
//                                                                 id="decimalValue"
//                                                                 type="number"
//                                                                 placeholder="Enter decimal points (e.g. 2)"
//                                                                 value={configdatacheckpoint[cpId]?.max_decimal || ''}
//                                                                 onChange={handleDecimalChange}
//                                                                 // min="0"
//                                                                 max="4"
//                                                                 className="me-2"
//                                                                 title="Number of digits allowed after the decimal point"
//                                                             />
//                                                             <span className="text-muted">point</span>
//                                                         </div>
//                                                         <small className="form-text text-muted">
//                                                             You can allow up to 4 decimal points.
//                                                         </small>
//                                                     </FormGroup>
//                                                 </Col>
//                                             </Row>


//                                             <Row className="mt-3">
//                                                 <Col md={12}>
//                                                     <FormGroup tag="fieldset">
//                                                         <Label className="font-weight-bold">Positive / Negative</Label>
//                                                         <div className="d-flex">
//                                                             <FormGroup check className="me-3">
//                                                                 <Label check>
//                                                                     <Input
//                                                                         type="radio"
//                                                                         name="signOption"
//                                                                         defaultChecked={configdatacheckpoint[cpId]?.only_positive}
//                                                                         onChange={(e) => handleSignOptionChange(e, 'only_positive')}
//                                                                     />{' '}
//                                                                     Only Positive
//                                                                 </Label>
//                                                             </FormGroup>
//                                                             <FormGroup check className="me-3">
//                                                                 <Label check>
//                                                                     <Input
//                                                                         type="radio"
//                                                                         name="signOption"
//                                                                         defaultChecked={configdatacheckpoint[cpId]?.only_negative}
//                                                                         onChange={(e) => handleSignOptionChange(e, 'only_negative')}
//                                                                     />{' '}
//                                                                     Only Negative
//                                                                 </Label>
//                                                             </FormGroup>
//                                                             <FormGroup check>
//                                                                 <Label check>
//                                                                     <Input
//                                                                         type="radio"
//                                                                         name="signOption"
//                                                                         defaultChecked={configdatacheckpoint[cpId]?.both_case}
//                                                                         onChange={(e) => handleSignOptionChange(e, 'both_case')}
//                                                                     />{' '}
//                                                                     Both
//                                                                 </Label>
//                                                             </FormGroup>
//                                                         </div>
//                                                     </FormGroup>
//                                                 </Col>

//                                             </Row>
//                                             <Row className="mt-3">
//                                                 <Col md={12}>
//                                                     <FormGroup>
//                                                         <Label for="units" className="font-weight-bold">
//                                                             Units
//                                                         </Label>
//                                                         <Input
//                                                             id="units"
//                                                             type="text"
//                                                             placeholder="e.g. kg, m, °C"
//                                                             value={configdatacheckpoint[cpId]?.unit_name}
//                                                             onChange={handleUnitsChange}
//                                                         />
//                                                         <small className="form-text text-muted">
//                                                             unit of measurement
//                                                         </small>
//                                                     </FormGroup>
//                                                 </Col>
//                                             </Row>
//                                         </div>
//                                     }

//                                     {
//                                         selectedInputValue !== '0' && selectedInputValue === '6' && !configdatacheckpoint[cpId]?.enable_validation &&
//                                         <CheckpointConfigSection
//                                             idx={cpId}
//                                             data={configdatacheckpoint[cpId]?.options !== null ? configdatacheckpoint[cpId]?.options[0] : { option_text: '', id: '', color: null, show_config: true }}
//                                             checkpointInfo={configdatacheckpoint[cpId]}
//                                             updateRuleField={updateRuleField}
//                                         />
//                                     }


//                                     {
//                                         // selectedInputValue !== "0" && selectedInputValue !== "6" ?
//                                         selectedInputValue !== "0" ?
//                                             <div className="border border-light " style={{ padding: 15, borderRadius: 8 }}>
//                                                 <div className='d-flex gap-3'>
//                                                     <div className="form-check form-switch">
//                                                         <input
//                                                             className="form-check-input"
//                                                             type="checkbox"
//                                                             role="switch"
//                                                             id="enableValidationSwitch"
//                                                             checked={configdatacheckpoint[cpId]?.enable_validation || false}
//                                                             onClick={(e) => { handleValidationToggle(e) }}
//                                                         />
//                                                         <label className="form-check-label" htmlFor="enableValidationSwitch">
//                                                             Enable Validation
//                                                         </label>
//                                                     </div>

//                                                     <div className="form-check form-switch">
//                                                         <input
//                                                             className="form-check-input"
//                                                             type="checkbox"
//                                                             role="switch"
//                                                             id="enableNotApplicable"
//                                                             defaultChecked={configdatacheckpoint[cpId]?.enable_notapplicable}
//                                                             onChange={(e) => handleToggle(e, 'enable_notapplicable')}
//                                                         />
//                                                         <label className="form-check-label" htmlFor="enableNotApplicable">
//                                                             Enable Not Applicable
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             : null
//                                     }





//                                     <Row>
//                                         <Col md={12}>
//                                             {showTemplates(checkpointType)}
//                                         </Col>

//                                     </Row>

//                                     {
//                                         selectedInputValue !== "0" ?
//                                             <Row style={{ padding: 10 }}>
//                                                 <div className="my-2 d-flex flex-column" style={{
//                                                     padding: 10,
//                                                     border: submitProcess && configdatacheckpoint[cpId].impact_level == "" ? '1px solid #ff0000' : '0px'
//                                                 }}>
//                                                     <label>Impact Level<span className="text-danger" style={{ fontSize: "smaller" }}>*</span></label>
//                                                     <div style={{ display: 'flex', flexDirection: 'row' }}>
//                                                         <div className="form-check mx-2 form-radio-danger">
//                                                             <input
//                                                                 className="form-check-input"
//                                                                 type="radio"
//                                                                 name="Critical"
//                                                                 id="exampleRadios1"
//                                                                 value={configdatacheckpoint[cpId].impact_level}
//                                                                 onClick={handleRadioGroupChange}
//                                                                 checked={configdatacheckpoint[cpId].impact_level === "Critical"}
//                                                             />
//                                                             <label
//                                                                 className="form-check-label text-danger"
//                                                                 htmlFor="exampleRadios1"
//                                                             >
//                                                                 Critical
//                                                             </label>
//                                                         </div>
//                                                         <div className="form-check mx-2 form-radio-warning">
//                                                             <input
//                                                                 className="form-check-input"
//                                                                 type="radio"
//                                                                 name="High"
//                                                                 id="exampleRadios2"
//                                                                 value={configdatacheckpoint[cpId].impact_level}
//                                                                 onClick={handleRadioGroupChange}
//                                                                 checked={configdatacheckpoint[cpId].impact_level === "High"}
//                                                             />
//                                                             <label
//                                                                 className="form-check-label text-warning"
//                                                                 htmlFor="exampleRadios2"
//                                                             >
//                                                                 High
//                                                             </label>
//                                                         </div>
//                                                         <div className="form-check mx-2 form-radio-info">
//                                                             <input
//                                                                 className="form-check-input"
//                                                                 type="radio"
//                                                                 name="Medium"
//                                                                 id="exampleRadios3"
//                                                                 value={configdatacheckpoint[cpId].impact_level}
//                                                                 onClick={handleRadioGroupChange}
//                                                                 checked={configdatacheckpoint[cpId].impact_level === "Medium"}
//                                                             />
//                                                             <label
//                                                                 className="form-check-label text-info"
//                                                                 htmlFor="exampleRadios3"
//                                                             >
//                                                                 Medium
//                                                             </label>
//                                                         </div>
//                                                         <div className="form-check mx-2 form-radio-success">
//                                                             <input
//                                                                 className="form-check-input"
//                                                                 type="radio"
//                                                                 name="Low"
//                                                                 id="exampleRadios4"
//                                                                 value={configdatacheckpoint[cpId].impact_level}
//                                                                 onClick={handleRadioGroupChange}
//                                                                 checked={configdatacheckpoint[cpId].impact_level === "Low"}
//                                                             />
//                                                             <label
//                                                                 className="form-check-label text-success"
//                                                                 htmlFor="exampleRadios4"
//                                                             >
//                                                                 Low
//                                                             </label>
//                                                         </div>
//                                                         <div className="form-check mx-2 form-radio-primary">
//                                                             <input
//                                                                 className="form-check-input"
//                                                                 type="radio"
//                                                                 name="No impact"
//                                                                 id="exampleRadios5"
//                                                                 value={configdatacheckpoint[cpId].impact_level}
//                                                                 onClick={handleRadioGroupChange}
//                                                                 checked={configdatacheckpoint[cpId].impact_level === "No impact"}
//                                                             />
//                                                             <label
//                                                                 className="form-check-label text-primary"
//                                                                 htmlFor="exampleRadios5"
//                                                             >
//                                                                 No impact
//                                                             </label>
//                                                         </div>
//                                                     </div>
//                                                     {submitProcess && configdatacheckpoint[cpId].impact_level == "" ? <div  >
//                                                         <span className="font-size-10 text-danger" style={{ lineHeight: 1, }}>Select any one impact level </span>
//                                                     </div> : null}
//                                                 </div>
//                                                 <div className="my-2 d-flex flex-column" style={{ padding: 10, }}>
//                                                     <label>Type</label>
//                                                     <div >
//                                                         <TagsInput
//                                                             value={configdatacheckpoint[cpId].compl_type}
//                                                             onChange={handleChangeType}
//                                                             inputProps={
//                                                                 { placeholder: 'Add a type and hit enter' }
//                                                             }
//                                                         />
//                                                     </div>
//                                                 </div>
//                                                 <div className="my-2 d-flex flex-column" style={{ padding: 10, }}>
//                                                     <AvForm className="form-horizontal" onValidSubmit={handleValidSubmit}>
//                                                         <div className="mb-3" >
//                                                             <AvField
//                                                                 name="guideline"
//                                                                 label="Guideline"
//                                                                 value={configdatacheckpoint[cpId].guideline}
//                                                                 onChange={(e) => {
//                                                                     const updatedConfigData = _.cloneDeep(configdatacheckpoint);
//                                                                     updatedConfigData[cpId].guideline = e.target.value;
//                                                                     setconfigdatacheckpoint(updatedConfigData)
//                                                                     // this.setState({ configdatacheckpoint: updatedConfigData, refresh: true });
//                                                                 }}
//                                                                 className="form-control"
//                                                                 placeholder="Enter Guideline"
//                                                                 type="textarea"
//                                                                 required
//                                                             />

//                                                         </div>
//                                                     </AvForm>
//                                                     <label>Add images for guidelines</label>
//                                                     <Form>
//                                                         <Dropzone onDrop={acceptedFiles => handleAcceptedFiles(acceptedFiles)} accept={[".jpg", ".jpeg", ".png"]} >
//                                                             {({ getRootProps, getInputProps }) => (
//                                                                 <div className="dropzone">
//                                                                     <div className="dz-message needsclick" {...getRootProps()} >
//                                                                         <input {...getInputProps()} />
//                                                                         <div className="mb-3">
//                                                                             <i className="display-4 text-muted bx bxs-cloud-upload" />
//                                                                         </div>
//                                                                         <h4>Drop files here or click to upload.</h4>
//                                                                     </div>
//                                                                 </div>
//                                                             )}
//                                                         </Dropzone>
//                                                         <div className="dropzone-previews mt-3" id="file-previews">
//                                                             {configdatacheckpoint[cpId]?.guideline_image?.map((f, i) => {
//                                                                 return (
//                                                                     <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete" key={i + "-file"}>
//                                                                         <div style={{ display: 'flex', flexDirection: 'row' }}>
//                                                                             <div className="p-2" style={{ width: '95%' }}>
//                                                                                 <Row className="align-items-center">
//                                                                                     <Col className="col-auto">
//                                                                                         <img data-dz-thumbnail="" height="80" className="avatar-sm rounded bg-light" alt={f.name} src={f.preview} />
//                                                                                     </Col>
//                                                                                     <Col>
//                                                                                         <Link to="#" className="text-muted font-weight-bold" >
//                                                                                             {f.name}
//                                                                                         </Link>
//                                                                                         <p className="mb-0">
//                                                                                             <strong>{f.formattedSize}</strong>
//                                                                                         </p>
//                                                                                     </Col>

//                                                                                 </Row>
//                                                                                 <div style={{ margin: '5px 0 5px 0' }}>
//                                                                                     <span className={f.uploading ? "font-size-10 text-danger" : "font-size-10 text-success"}>{f.uploadingStatus}</span>
//                                                                                 </div>

//                                                                             </div>
//                                                                             <div style={{ width: '5%', textAlign: 'center' }}>
//                                                                                 <Link to="#" onClick={() => deleteImage(i)}><i className="mdi mdi-close-circle-outline font-size-20 text-danger" /></Link>
//                                                                             </div>
//                                                                         </div>
//                                                                     </Card>
//                                                                 )
//                                                             })}
//                                                         </div>

//                                                     </Form>
//                                                 </div>
//                                             </Row>
//                                             : null

//                                     }
//                                     {
//                                         selectedInputValue !== "0" ?
//                                             <Row>
//                                                 <footer
//                                                     className="ps-0"
//                                                     style={{
//                                                         display: 'flex',
//                                                         alignItems: "center",
//                                                         height: 50,
//                                                         background: "#fff",
//                                                         width: "100%",
//                                                         position: "fixed",
//                                                         bottom: 0,
//                                                         zIndex: 999,
//                                                         borderTop: "1px solid #dedede"
//                                                     }}>
//                                                     <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center", }}>

//                                                         <>
//                                                             <div style={{ marginRight: 10 }}>
//                                                                 <button className="btn btn-sm btn-outline-success w-sm m-1" type="submit" onClick={() => validateCheckpoint(configdatacheckpoint[cpId])}>
//                                                                     {props.mode == "0" ? "Submit" : "Update"}
//                                                                 </button>
//                                                             </div>
//                                                         </>
//                                                     </div>
//                                                 </footer>


//                                             </Row>
//                                             :

//                                             null
//                                     }


//                                 </div>
//                             </AvForm>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>
//         )
//     }
//     else {
//         return null
//     }
// }
// export default InputTemplate
















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
//     //console.log(props,'props');
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

//         //console.log("getsession")
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

//             //console.log("cpk",cpk)
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
//                         submitProcess={submitProcess}
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
//         //console.log("values",values)
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

//         //console.log("updatedFiles",updatedFiles)

//         setSelectedFiles(prevFiles => [...prevFiles, ...updatedFiles]);

//         let formData = new FormData();
//         updatedFiles.forEach(file => formData.append("imagesArray", file));

//         //console.log("formData",formData)

//         urlSocket.post("storeImage/awswebupload", formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//             onUploadProgress: (progressEvent) => {
//                 if (progressEvent.loaded === progressEvent.total) {
//                     // Handle progress completion if needed
//                 }
//             }
//         })
//         .then(response => {
//             //console.log("respose",response)
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

    // const formatBytes = (bytes, decimals = 2) => {
    //     if (bytes === 0) return "0 Bytes";
    //     const k = 1024;
    //     const dm = decimals < 0 ? 0 : decimals;
    //     const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    //     const i = Math.floor(Math.log(bytes) / Math.log(k));
    //     return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    // };

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
//         //console.log("evennnnn",event)
//         const updatedConfigData = [...configdatacheckpoint];
//         updatedConfigData[cpId].impact_level = event.target.name;
//         setConfigDataCheckpoint(updatedConfigData);
//         setRefresh(true);
//     };

//     const validateCheckpoint = (data) => {
//         setSubmitProcess(true);

//         //console.log("data",data)

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
//             //console.log("submitif")
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
//                         //console.log(configdatacheckpoint,'configdatacheckpoint')
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