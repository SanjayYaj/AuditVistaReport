import React, { useState, useEffect,useRef } from 'react'
import { Link } from "react-router-dom";
import {
    Col,
    Form,
    Row,
    Card
} from "reactstrap"
import { Popconfirm } from 'antd';
import Dropzone from "react-dropzone"
import MarkerImage from './MarkerImage';

import WebcamCapture from './WebCam_Comp';
import uuid from 'react-uuid'
import Swal from 'sweetalert2';

const _ = require('lodash')

import urlSocket from '../../../../helpers/urlSocket';


const CRUD_Images = (props) => {


    const [attachImages, setAttachImages] = useState([]);
    const [fileStatus, setFileStatus] = useState("clear");
    const [warningEnabled, setWarningEnabled] = useState(false);
    const [maxVideoLength, setMaxVideoLength] = useState("");
    const [previewImageModal, setPreviewImageModal] = useState(false);
    const [uploadMerkerFile, setUploadMerkerFile] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(true);
    const [dbInfo, setDbInfo] = useState(() => {
        return JSON.parse(sessionStorage.getItem("db_info")) || {};
    });
    const [imageUploading, setImageUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [warningMessage, setWarningMessage] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [markers, setMarkers] = useState("");
    const [editPos, setEditPos] = useState(undefined);
    const [editOrginalName, setEditOrginalName] = useState("");
    const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")));

    const imgRef = useRef(null);


    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem("authUser"));
        if (data && data.config_data) {
            setMaxVideoLength(data.config_data.video_ends_after);
        }
    }, []);


    useEffect(()=>{
        if (attachImages.length > 0) {
            console.log(authUser,'authUser')
            let formData = new FormData();
            for (const key of Object.keys(attachImages)) {
                formData.append('folder', `${props.folderPath}`)
                formData.append('imagesArray', attachImages[key])
            }
            try {
                urlSocket.post("storeImage/awswebupload", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }, {
                    onUploadProgress: progressEvent => {
                        if (progressEvent.loaded === progressEvent.total) {
                        }
                    }
                }).then(response => {
                    console.log(response, 'response.data.data[0]')
                    if (response.data.response_code == 500) {
                        setAttachImages([])
                        var getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
                            is_selected: true,
                        });
                        if (props.selectedCheckpoint.rule[getOptionIndex].orginalImage === undefined) {
                            props.selectedCheckpoint.rule[getOptionIndex].orginalImage = []
                            props.selectedCheckpoint.rule[getOptionIndex].orginalImage.push({ name: response.data.data[0].originalname })
                        }
                        else {
                            props.selectedCheckpoint.rule[getOptionIndex].orginalImage.push({ name: response.data.data[0].originalname })
                        }

                        updateCheckpointImages(props.selectedCheckpoint.cp_attach_images, props.selectedCheckpoint)

                    }

                })
            } catch (error) {
            }
        }


    },[attachImages])





    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    }



    const handleAcceptedFiles = async files => {
        if (previewImageModal === false) {
            let u_id = uuid();
            if (files.length === 1) {
                if (files[0].type.startsWith('image/')) {
                    console.log(files, 'files')
                    setImageUploading(true)
                    setFileStatus("clear")
                    setWarningEnabled(false)
                    files.map(file => {
                        if (file.size > 5120000) {
                            setFileStatus("exceed")
                        }
                        else {

                            Object.assign(file, {
                                "preview": URL.createObjectURL(file),
                                "formattedSize": formatBytes(file.size),
                                "uploading": false,
                                "filetype": file.type,
                                "uploadingStatus": 'Not uploaded',
                                "originalName": u_id,
                            })
                        }
                    }
                    )
                    var getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
                        is_selected: true,
                    });

                    if (fileStatus !== "exceed" && props.selectedCheckpoint.rule[getOptionIndex].images.length + files.length <= props.selected_option.image_info.max) {

                        console.log("make modal true")
                        setPreviewImageModal(true)
                        setPreviewImage(files[0].preview)
                        setUploadMerkerFile(files)

                        setAttachImages((prevVideos) => [...prevVideos, ...files])
                        console.log(attachImages, 'attachImages')

                    }
                    else {
                        if (fileStatus === "exceed") {
                            setWarningEnabled(true);
                            setWarningMessage("One of the selected file sizes exceeds more than 5MB");
                        }
                        else {
                            setWarningEnabled(true);
                            setWarningMessage("Maximum Number of files is 5");
                        }
                    }
                }
                else {
                    var getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
                        is_selected: true,
                    });
                    files.map(file => {
                        Object.assign(file, {
                            "preview": URL.createObjectURL(file),
                            "formattedSize": formatBytes(file.size),
                            "uploading": false,
                            "filetype": file.type,
                            "uploadingStatus": 'Not uploaded',
                            "originalName": file.name,
                        })
                    }
                    )
                    setAttachImages(attachImages.concat(files))

                    let formData = new FormData();
                    for (const key of Object.keys(attachImages)) {
                        formData.append('imagesArray', attachImages[key])
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

                                    setAttachImages([])

                                    var getOptionIndex = _.findIndex(props.selectedCheckpoint.checkpoint_options, {
                                        is_selected: true,
                                    });
                                    var dataInfo = {

                                    }
                                    props.selectedCheckpoint.checkpoint_options[getOptionIndex].images.push(response.data.data[0])
                                    _.each(response.data.data, item => {
                                        _.each(props.selectedCheckpoint.checkpoint_options[getOptionIndex].images, async child => {
                                            if (child.originalname == item.originalname) {
                                                var track_loc = await access_location()

                                                let splitString = item.key.split("/");
                                                let getFileName = splitString[splitString.length - 1];
                                                child["uploading"] = false
                                                child["uploadingStatus"] = "Uploaded"
                                                child["preview"] = getFileName
                                                child["lat"] = props.endpointData.audit_coords_enable ? String(track_loc.latitude) : null
                                                child["long"] = props.endpointData.audit_coords_enable ? String(track_loc.longitude) : null
                                                child["source"] = "camera"
                                                await updateCheckpointImages(props.selectedCheckpoint.cp_attach_images, props.selectedCheckpoint);
                                            }
                                        })
                                    })

                                    setImageUploading(false)
                                    setRefresh(true);



                                    props.selectedCheckpoint.cp_attach_images = props.selectedCheckpoint.checkpoint_options[getOptionIndex].images
                                }
                                else {
                                    _.each(props.selectedCheckpoint.cp_attach_images, child => {
                                        child["uploading"] = false
                                        child["uploadingStatus"] = "Not Uploaded"
                                    })
                                    setImageUploading(false)
                                    setRefresh(true);
                                }
                            })
                            .catch(error => {
                            })
                    }
                    catch (error) {
                    }
                }
            }
            else if(files.length >1 && files.length <= selected_option.image_info.max){
               await uploadImagesRecursively(files,0)
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Reached the max file upload limit',
                    text: 'Failed to upload',
                });


            }
        }
    }

    const uploadImagesRecursively=async(fileInfo,counter)=>{
        if(fileInfo.length > counter){
            let formData = new FormData();
            formData.append('folder', `${props.folderPath}`);
            formData.append('imagesArray', fileInfo[counter]);

            try {

                urlSocket.post("storeImage/awswebupload", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: progressEvent => {
                        if (progressEvent.loaded === progressEvent.total) {
                            // You can update upload progress here if needed
                        }
                    }
                }).then(async response => {
                    console.log(response, 'response');
                    if (response.data.response_code === 500) {
                        const uploadedData = response.data.data; // Assume it's an array of uploaded image info
                        const getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
                            is_selected: true,
                        });

                        if (!props.selectedCheckpoint.rule[getOptionIndex].orginalImage) {
                            props.selectedCheckpoint.rule[getOptionIndex].orginalImage = [];
                        }

                        // Push all uploaded original image names
                        uploadedData.forEach(fileInfo => {
                            props.selectedCheckpoint.rule[getOptionIndex].orginalImage.push({
                                name: fileInfo.originalname
                            });
                              props.selectedCheckpoint.rule[getOptionIndex].images.push(fileInfo)
                        });

                        _.each(uploadedData, item => {
                            _.each(props.selectedCheckpoint.rule[getOptionIndex].images, child => {
                                console.log(child.name == item.originalname, 'child.name == item.originalname', child.name, item.originalname)
                                if (child.name == item.originalname) {
                                    let splitString = item.key.split("/");
                                    let getFileName = splitString[splitString.length - 1];
                                    child["uploading"] = false
                                    child["uploadingStatus"] = "Uploaded"
                                    child["preview"] = getFileName
                                    child["source"] = "library"

                                }
                            })
                        })

                        props.selectedCheckpoint.cp_attach_images = props.selectedCheckpoint.rule[getOptionIndex].images
                       await updateCheckpointImages(props.selectedCheckpoint.cp_attach_images, props.selectedCheckpoint);
                       counter ++
                       await uploadImagesRecursively(fileInfo,counter)

                    }
                }).catch(error => {
                    console.error("Upload failed", error);
                });


                
            } catch (error) {
                    console.log(error,'error')
            }

        }


    }




    const access_location = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    var location_data = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    resolve(location_data);
                },
                error => {
                    reject(null);
                }
            );
        });
    };


    const uploadWebCamVedio = (file) => {
        var getOptionIndex = _.findIndex(props.selectedCheckpoint.checkpoint_options, {
            is_selected: true,
        });

        let formData = new FormData();

        formData.append('imagesArray', file)

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
                    if (response.data.response_code == 500) {

                        setAttachImages([])

                        var getOptionIndex = _.findIndex(props.selectedCheckpoint.checkpoint_options, {
                            is_selected: true,
                        });

                        props.selectedCheckpoint.checkpoint_options[getOptionIndex].images.push(response.data.data[0])
                        _.each(response.data.data, item => {
                            _.each(props.selectedCheckpoint.checkpoint_options[getOptionIndex].images, async child => {

                                if (child.originalname == item.originalname) {
                                    var track_loc = await access_location()

                                    let splitString = item.key.split("/");
                                    let getFileName = splitString[splitString.length - 1];
                                    child["uploading"] = false
                                    child["uploadingStatus"] = "Uploaded"
                                    child["preview"] = getFileName
                                    child["lat"] = props.endpointData.audit_coords_enable ? String(track_loc.latitude) : null
                                    child["long"] = props.endpointData.audit_coords_enable ? String(track_loc.longitude) : null
                                    child["source"] = "camera"
                                    await updateCheckpointImages(props.selectedCheckpoint.cp_attach_images, props.selectedCheckpoint);
                                }
                            })
                        })

                        setImageUploading(false)
                        setRefresh(true)

                        props.selectedCheckpoint.cp_attach_images = props.selectedCheckpoint.checkpoint_options[getOptionIndex].images
                    }
                    else {
                        _.each(props.selectedCheckpoint.cp_attach_images, child => {
                            child["uploading"] = false
                            child["uploadingStatus"] = "Not Uploaded"
                        })

                        setImageUploading(false)
                        setRefresh(true)
                    }
                })
                .catch(error => {
                })
        }
        catch (error) {
        }


    }


    const uploadWebCamImage = async (file) => {

        Object.assign(file, {
            "preview": file.name,
            "formattedSize": formatBytes(file.size),
            "uploading": false,
            "filetype": file.type,
            "uploadingStatus": 'Not uploaded',
            "originalName": file.name,
            "captured_on": new Date(),
            "path": file.name,

        })
        // const folderName = `${authUser.client_info[0]["s3_folder_path"]}${props.endpointData.audit_name}${props.endpointData.audit_pbd_id}/${props.endpointData.loc_name}${props.endpointData._id}/`

        let formData = new FormData();
        formData.append('folder', props.folderPath)
        formData.append('imagesArray', file)

        setDataLoaded(false)
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
                    if (response.data.response_code == 500) {
                        setDataLoaded(true)

                        setAttachImages([])
                        var getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
                            is_selected: true,
                        });
                        setPreviewImageModal(true)
                        setPreviewImage((props.imagePreviewUrl+props.folderPath) + response.data.data[0].originalname)
                        setUploadMerkerFile(file)
                          if (props.selectedCheckpoint.rule[getOptionIndex].orginalImage === undefined) {
                            props.selectedCheckpoint.rule[getOptionIndex].orginalImage = []
                            props.selectedCheckpoint.rule[getOptionIndex].orginalImage.push({ name: response.data.data[0].originalname })
                        }
                        else {
                            props.selectedCheckpoint.rule[getOptionIndex].orginalImage.push({ name: response.data.data[0].originalname })
                        }
                        updateCheckpointImages(props.selectedCheckpoint.cp_attach_images, props.selectedCheckpoint);

                    }

                })
                .catch(error => {
                })
        }
        catch (error) {
        }
    }

    const updateCheckpointImages = (data, item) => {
        item["cp_attach_images"] = data
        props.saveCheckpoint(item)
    }


    const deleteFileInAws = (fileInfo) => {
        try {

            urlSocket.post('storeImage/delete-file-aws', {
                fileInfo: fileInfo,
                s3_folder_path :  props.folderPath
            }).then((response) => {
                console.log(response, 'response')

            })

        } catch (error) {

        }
    }

    const deleteImage = async (item) => {

        await deleteFileInAws(item)

        var getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
            is_selected: true,
        });
        var getIndex = _.findIndex(
            props.selectedCheckpoint.rule[getOptionIndex].images,
            { originalName: item.originalName }
        );

        console.log(item, 'item', props.selectedCheckpoint.checkpoint_options[getOptionIndex])

        props.selectedCheckpoint.rule[getOptionIndex].images.splice(getIndex, 1);
        if(getOptionIndex !==-1){
            props.selectedCheckpoint.rule[getOptionIndex].orginalImage.splice(getIndex, 1);    
        }

        props.selectedCheckpoint.cp_attach_images = props.selectedCheckpoint.rule[getOptionIndex].images
        updateCheckpointImages(props.selectedCheckpoint.cp_attach_images, props.selectedCheckpoint)


        setFileStatus("clear")
        setWarningEnabled(false)
        setRefresh(true)
        setMarkers("")



    }


    const updateMarkerInfo = async (marker_info, dataUrl, originalname) => {

        try {
            urlSocket.post('cog/update-marker-info', {
                marker_info: marker_info,
                dataUrl: dataUrl,
                db_info: dbInfo,
                originalname: originalname,
                checkpointInfo: props.selectedCheckpoint
            }).then((response) => {
                console.log(response, 'response')
            })

        } catch (error) {

        }
    }

    const getMarkerInfo = (fileInfo, mode) => {
        var apiUrl = mode === 0 ? "get-marker-info" : "delete-marker-img"
        try {
            urlSocket.post(`cog/${apiUrl}`, {
                fileInfo: fileInfo,
                db_info: dbInfo,
                checkpointInfo: props.selectedCheckpoint
            }).then((response) => {
                console.log(response, 'response')
                if (response.data.response_code === 500 && mode === 0) {
                    setMarkers(response.data.data.length > 0 ? response.data.data[0].marker_info : "")
                    setPreviewImageModal(true)
                }

            })
        } catch (error) {
            console.log(error, 'error')
        }
    }

    const onUploadMarkerFile = async (markerFile, markerData) => {

        if (markers) {
            var fileInfo = {
                originalname: editOrginalName
            }
            await deleteFileInAws(fileInfo)
        }
        let formData = new FormData();
          formData.append('folder', props.folderPath)
        formData.append('imagesArray', markerFile)
        try {
            urlSocket.post(`storeImage/awswebupload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }, {
                onUploadProgress: progressEvent => {
                    if (progressEvent.loaded === progressEvent.total) {
                    }
                }
            }).then(async response => {
                console.log(response, 'response')
                if (response.data.response_code == 500) {

                    setAttachImages([])
                    setPreviewImageModal(false)
                    // var dataInfo ={
                    //     fieldname : response.data.data[0].fieldname,
                    //     originalname : response.data.data[0].originalname,
                    //     mimetype : response.data.data[0].mimetype,
                    //     originalName : response.data.data[0].originalName === undefined ?response.data.data[0].originalname : response.data.data[0].originalName,
                    //     size : response.data.data[0].size,
                    //     metadata : response.data.data[0].metadata
                    // }

                    var getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
                        is_selected: true,
                    });
                    await updateMarkerInfo(markerData.state, markerData.dataUrl, response.data.data[0].originalname)

                    if (editPos !== undefined) {
                        response.data.data[0]["originalName"] = response.data.data[0]["originalname"]
                        props.selectedCheckpoint.rule[getOptionIndex].images[editPos] = response.data.data[0]
                    }
                    else {
                        response.data.data[0]["originalName"] = response.data.data[0]["originalname"]
                        props.selectedCheckpoint.rule[getOptionIndex].images.push(response.data.data[0])
                    }

                    _.each(response.data.data, item => {
                        _.each(props.selectedCheckpoint.rule[getOptionIndex].images, child => {
                            console.log(child.name == item.originalname, 'child.name == item.originalname', child.name, item.originalname)
                            if (child.name == item.originalname) {
                                let splitString = item.key.split("/");
                                let getFileName = splitString[splitString.length - 1];
                                child["uploading"] = false
                                child["uploadingStatus"] = "Uploaded"
                                child["preview"] = getFileName
                                child["source"] = "library"

                            }
                        })
                    })


                    setImageUploading(false)
                    setRefresh(false)
                    setDataLoaded(false)
                    setDataLoaded(true)
                    setRefresh(true)
                    setEditPos(undefined)
                    setMarkers("")

                     props.selectedCheckpoint.cp_attach_images = props.selectedCheckpoint.rule[getOptionIndex].images
                    updateCheckpointImages(props.selectedCheckpoint.cp_attach_images, props.selectedCheckpoint)
                }
                else {
                    _.each(props.selectedCheckpoint.cp_attach_images, child => {
                        child["uploading"] = false
                        child["uploadingStatus"] = "Not Uploaded"
                    })

                    setImageUploading(false)
                    setRefresh(true)
                }

            })
        } catch (error) {
        }
        // })
        // });

    }

    var selected_option = props.selected_option

    var getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
      is_selected: true,
    });

    if (dataLoaded) {
        console.log(props,'propsss')
        return (
            <React.Fragment>
                <div >
                    {
                        props.audit_status !== "3" && props.audit_status !== "4" && 
                        // props.selectedCheckpoint.cp_attach_images.length 
                        props.selectedCheckpoint.rule[getOptionIndex].image_info?.max
                        > props.selectedCheckpoint.cp_attach_images?.length ?
                            <div>
                                <label>Add Images</label>

                                <Row className="my-2 align-items-center justify-content-between">
                                    <div>
                                        <Card style={{ border: '1px dashed lightgrey' }} className='d-flex align-items-center justify-content-start mb-1'>
                                            <WebcamCapture video={false} uploadWebCamImage={(data) => { uploadWebCamImage(data) }} uploadWebCamVedio={(data) => { uploadWebCamVedio(data) }} max_video_length={Number(maxVideoLength)} />
                                        </Card>
                                    </div>

                                    <div>
                                        <Card style={{ border: '1px dashed lightgrey' }}>
                                            <div style={{ zoom: 0.7 }}>
                                                <Form>
                                                    <Dropzone onDrop={acceptedFiles => handleAcceptedFiles(acceptedFiles)} accept={[".jpg", ".jpeg", ".png"]}>
                                                        {({ getRootProps, getInputProps }) => (
                                                            <div className="dropzone">
                                                                <div className="dz-message needsclick" {...getRootProps()} >
                                                                    <input {...getInputProps()} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); } }} />
                                                                    <div className="mb-3"> <i className="display-4 text-muted bx bxs-cloud-upload" /></div>
                                                                    <h4>Drop Images here or click to upload.</h4>
                                                                    <div className="mt-2 font-size-13 text-dark text-center">
                                                                        <label className='me-2'>Files accepted - .jpg, .jpeg, .png, .bmp </label>
                                                                        <label className='me-2'>Maximum individual file size - 5mb</label>
                                                                        <label className='me-2'>Minimum Number of files - {selected_option?.image_info?.min}</label>
                                                                        <label className='me-2'>Maximum upto {selected_option?.image_info?.max} files</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Dropzone>

                                                </Form>
                                            </div>

                                        </Card>
                                    </div>
                                </Row>


                            </div> : props.audit_status !== "3" && props.audit_status !== "4" && props.selectedCheckpoint.cp_noof_images !== 0 ?
                                <div style={{ padding: 10 }}><label style={{ fontSize: 12, color: "#ff6666" }}>You are reached the Maximum requirment. If you want to retake or upload image, delete one of the image uploaded and capture/upload the picture </label></div> : null
                    }

                    {
                        warningEnabled ? <Row>
                            <div className="my-2 font-size-12 text-danger">{warningMessage}</div>
                        </Row> : null
                    }



                    <Row>
                        <Col sm={"12"} lg={"12"}>
                            <Row className="dropzone-previews" id="file-previews">
                                {props.selectedCheckpoint.rule[getOptionIndex].images?.length !== 0 &&
                                    props.selectedCheckpoint.rule[getOptionIndex].images?.map((f, i) => {

                                        return (
                                            <Col key={String(i) + "-file"} sm={6} md={4} lg={3} className="mb-3">
                                                <Card className="shadow-none border dz-processing dz-image-preview dz-success dz-complete">
                                                    {props.audit_status !== "3" && props.audit_status !== "4" ? (
                                                        <div className="d-flex align-items-center justify-content-end gap-2" style={{ cursor: "pointer" }}>
                                                            <div
                                                                onClick={() => {
                                                                    getMarkerInfo(f, 0);
                                                                    setEditPos(i)
                                                                    setPreviewImage(
                                                                         `${props.imagePreviewUrl}${props.folderPath}`+
                                                                         props.selectedCheckpoint.rule[getOptionIndex].orginalImage[i].name
                                                                    )
                                                                    setEditOrginalName(f.originalname);
                                                                }}
                                                            >
                                                                <i className="bx bx-edit-alt font-size-18 text-primary" />
                                                            </div>
                                                            <Popconfirm
                                                                title="Are you sure you want to delete?"
                                                                okText="Yes"
                                                                cancelText="No"
                                                                onConfirm={() => {
                                                                    deleteImage(f);
                                                                    getMarkerInfo(f, 1);
                                                                }}
                                                            >
                                                                <Link to="#">
                                                                    <i className="mdi mdi-close-circle-outline font-size-20 text-danger me-2" />
                                                                </Link>
                                                            </Popconfirm>
                                                        </div>
                                                    ) : null}
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            height: "180px",
                                                            overflow: "hidden",
                                                            backgroundColor: "#f5f5f5",
                                                        }}
                                                    >
                                                        {(f?.filetype?.startsWith("video/") || f?.mimetype?.startsWith("video/")) ? (
                                                            <video
                                                                style={{
                                                                    maxWidth: "100%",
                                                                    maxHeight: "100%",
                                                                    objectFit: "contain",
                                                                }}
                                                                src={
                                                                    props.imagePreviewUrl +
                                                                    (f.originalName === undefined ? f.originalname : f.originalName)
                                                                }
                                                                controls
                                                            />
                                                        ) : (
                                                            <>
                                                            {
                                                                console.log(props.imagePreviewUrl,'props.imagePreviewUrl')
                                                            }
                                                                <img
                                                                    data-dz-thumbnail=""
                                                                    style={{
                                                                        maxWidth: "100%",
                                                                        maxHeight: "100%",
                                                                        objectFit: "contain",
                                                                    }}
                                                                    className="bg-light"
                                                                    alt={f.uploadingStatus === "Uploaded" ? f.path : f.name}
                                                                    src={
                                                                       `${props.imagePreviewUrl}${props.folderPath}`+
                                                                        (f.originalName === undefined ? f.originalname : f.originalName)
                                                                    }
                                                                />


                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className={f.uploading ? "font-size-10 text-danger" : "font-size-10 text-success"} >
                                                            {f.uploadingStatus}
                                                        </span>
                                                    </div>
                                                </Card>
                                            </Col>
                                        );
                                    })}
                            </Row>
                            {previewImageModal && (
                                <div>
                                    <MarkerImage
                                        preview_image_modal={previewImageModal}
                                        preview_url={previewImage}
                                        onCancelModal={() => {
                                            setPreviewImageModal(previewImageModal)
                                            setPreviewImage("")
                                        }
                                        }
                                        onUploadMarkerFile={(markerFile, markerData) => onUploadMarkerFile(markerFile, markerData)}
                                        markers={markers}
                                        editOrginalName={editOrginalName}
                                    />
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>

            </React.Fragment>
        )
    }
    else {
        return null
    }











}
export default CRUD_Images
