import React, { useState, useEffect, useRef } from "react";
import {
    Row, Col, Button, Card, CardBody, Label,Form
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Multiselect } from 'multiselect-react-dropdown';
import Dropzone from "react-dropzone"
import CrudUser from './crudUser';
import moment from 'moment';
import _ from 'lodash';
import uuid from 'react-uuid'
import MarkerImage from "./MarkerImage";
import urlSocket from "helpers/urlSocket";
import { Popconfirm } from 'antd';
import { Link } from "react-router-dom";
import MediaPreview from "./media_preview";
import WebcamCapture from "./WebCam_Comp";

const CAPA = (props) => {
    const { location_info, data, saveCheckpoint, selectedCheckpoint, index, audit_status } = props
    console.log(props,'props')
    const [data1, setData1] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [previousData, setPreviousData] = useState({});
    const [assignedTaskUsers, setAssignedTaskUsers] = useState([]);
    const [locationUsers, setLocationUsers] = useState([]);
    const [assignUsers, setAssignUsers] = useState(false);
    const [acImpactValid, setAcImpactValid] = useState(false);
    const [resetMultiSelect, setResetMultiSelect] = useState(true);
    const [authUser, setAuthUser] = useState(() => JSON.parse(sessionStorage.getItem("authUser")));
    const [actPln, setActpln] = useState("")
    const [targetDate, setTargetDate] = useState("")
    const [rootCause, setRootCause] = useState("")
    const [modal, setModal] = useState(false);
    const [asigneeEmail, setAsigneeEmail] = useState("");
    const [attachedFiles, setattachedFiles] = useState([]);
    const clientInfo = JSON.parse(sessionStorage.getItem('client_info'))?.[0] || {};
    const [previewImageModal, setPreviewImageModal] = useState(false);
    const [attachImages, setAttachImages] = useState([]);
    const [attachLiveImages, setAttachLiveImages] = useState([]);
    const [warningMessage, setWarningMessage] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadMerkerFile, setUploadMerkerFile] = useState([]);
        const [markers, setMarkers] = useState("");
    const [editOrginalName, setEditOrginalName] = useState("");
        const [editPos, setEditPos] = useState(undefined);
    const [maxVideoLength, setMaxVideoLength] = useState(JSON.parse(sessionStorage.getItem("authUser")).client_info[0].max_video_duration.$numberDecimal)
    const [openAcPlan,setopenAcPlan] = useState(false)
    const [validateAcPlan,setvalidateAcPlan] = useState(false)


    const multiRef = useRef();



    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    }





    useEffect(() => {
        let users = location_info?.location_unique_users || [];

        if (location_info?.audit_pbd_users?.length > 1) {
            const reviewUser = _.filter(location_info.audit_pbd_users, { audit_type: "2" });
            if (reviewUser.length > 0) {
                users = _.reject(users, { _id: reviewUser[0]._id ?? reviewUser[0].user_id });
            }
        }

        if (!users.some(user => user.name === "+Create New")) {
            users.unshift({ name: "+Create New" });
        }
        if(data){
            setAttachLiveImages(data?.acp_files)
        }

        setData1(data);
        setDataLoaded(true);
        setLocationUsers(users);
        setAssignedTaskUsers(data?.responsible_person || []);
    }, [location_info]);

    const deleteAction=(acplanInfo)=>{
        var index = _.findIndex(selectedCheckpoint.cp_actionplans, { id: acplanInfo.id })
        selectedCheckpoint.cp_actionplans[index]["actionplan"] = "";
        selectedCheckpoint.cp_actionplans[index]["target_date"] = "";
        selectedCheckpoint.cp_actionplans[index]["ac_impact"] = "";
        selectedCheckpoint.cp_actionplans[index]["to_email"] = asigneeEmail;
        selectedCheckpoint.cp_actionplans[index]["responsible_person"] = [];
        selectedCheckpoint.cp_actionplans[index]["status"] = "1";
        selectedCheckpoint.cp_actionplans[index]["isEdit"] = false;
        selectedCheckpoint.cp_actionplans[index]["acp_files"] = [];
        saveCheckpoint(selectedCheckpoint);
        setopenAcPlan(false)

    }

       const handleValidSubmit = (evet, values) => {
        console.log('data1values', data1, values,selectedCheckpoint)
        var index = _.findIndex(selectedCheckpoint.cp_actionplans, { id: data1.id })
        console.log(index,'index');
        if (index !== -1) {
            if (props.epsInfo.audit_pbd_users.create_acplan && props.epsInfo.audit_pbd_users.allow_assgn_task_users && props.epsInfo.audit_pbd_users.allow_set_target_date) {
                if (openAcPlan) {
                    if (assignedTaskUsers.length > 0 && data1.ac_impact !== '' && data1.ac_impact !== undefined) {
                        addActionPlan(selectedCheckpoint, values, index)
                    }
                    if (assignedTaskUsers.length === 0) {
                        setAssignUsers(true);
                    }
                    if (data1.ac_impact === undefined) {
                        console.log('Errordfdsgfvds')
                        setAcImpactValid(true)
                    }
                }
                else {
                    selectedCheckpoint.cp_actionplans[index]["observation"] = values.observation;
                    selectedCheckpoint.cp_actionplans[index]["root_cause"] = values.root_cause;
                    selectedCheckpoint.cp_actionplans[index]["actionplan"] = "";
                    selectedCheckpoint.cp_actionplans[index]["target_date"] = "";
                    selectedCheckpoint.cp_actionplans[index]["ac_impact"] = "";
                    selectedCheckpoint.cp_actionplans[index]["to_email"] = asigneeEmail;
                    selectedCheckpoint.cp_actionplans[index]["responsible_person"] = [];
                    selectedCheckpoint.cp_actionplans[index]["status"] = "1";
                    selectedCheckpoint.cp_actionplans[index]["isEdit"] = false;
                    selectedCheckpoint.cp_actionplans[index]["acp_files"] = attachLiveImages;
                    saveCheckpoint(selectedCheckpoint);
                }
                console.log(selectedCheckpoint, 'selectedCheckpoint')

            }
            else if (!props.epsInfo.audit_pbd_users.allow_assgn_task_users) {
                if (props.epsInfo.audit_pbd_users.create_acplan) {
                    if (String(values.actionplan).length > 0 && values.actionplan && data1.ac_impact) {
                        selectedCheckpoint.cp_actionplans[index]["observation"] = values.observation;
                        selectedCheckpoint.cp_actionplans[index]["root_cause"] = values.root_cause;
                        selectedCheckpoint.cp_actionplans[index]["actionplan"] = values.actionplan;
                        selectedCheckpoint.cp_actionplans[index]["target_date"] = props.epsInfo.audit_pbd_users.allow_set_target_date ? values.target_date : "";
                        selectedCheckpoint.cp_actionplans[index]["ac_impact"] = data1.ac_impact;
                        selectedCheckpoint.cp_actionplans[index]["to_email"] = asigneeEmail;
                        selectedCheckpoint.cp_actionplans[index]["responsible_person"] = [];
                        selectedCheckpoint.cp_actionplans[index]["status"] = "1";
                        selectedCheckpoint.cp_actionplans[index]["isEdit"] = false;
                        selectedCheckpoint.cp_actionplans[index]["acp_files"] = attachLiveImages;
                        saveCheckpoint(selectedCheckpoint);
                    }
                    else if (data1.ac_impact === undefined) {
                        console.log('Errordfdsgfvds')
                        if (!openAcPlan) {
                            setvalidateAcPlan(true)

                        }
                        else {
                            setAcImpactValid(true)

                        }
                    }
                    else {
                        setvalidateAcPlan(true)
                    }
                }
                else {
                    selectedCheckpoint.cp_actionplans[index]["observation"] = values.observation;
                    selectedCheckpoint.cp_actionplans[index]["root_cause"] = values.root_cause;
                    selectedCheckpoint.cp_actionplans[index]["actionplan"] = "";
                    selectedCheckpoint.cp_actionplans[index]["target_date"] = "";
                    selectedCheckpoint.cp_actionplans[index]["ac_impact"] = "";
                    selectedCheckpoint.cp_actionplans[index]["to_email"] = asigneeEmail;
                    selectedCheckpoint.cp_actionplans[index]["responsible_person"] = [];
                    selectedCheckpoint.cp_actionplans[index]["status"] = "1";
                    selectedCheckpoint.cp_actionplans[index]["isEdit"] = false;
                    selectedCheckpoint.cp_actionplans[index]["acp_files"] = attachLiveImages;
                      saveCheckpoint(selectedCheckpoint);


                }
                console.log(selectedCheckpoint, 'selectedCheckpoint')
            }
            else {
                selectedCheckpoint.cp_actionplans[index]["observation"] = values.observation;
                selectedCheckpoint.cp_actionplans[index]["root_cause"] = values.root_cause;
                selectedCheckpoint.cp_actionplans[index]["actionplan"] = "";
                selectedCheckpoint.cp_actionplans[index]["target_date"] = "";
                selectedCheckpoint.cp_actionplans[index]["ac_impact"] = "";
                selectedCheckpoint.cp_actionplans[index]["to_email"] = asigneeEmail;
                selectedCheckpoint.cp_actionplans[index]["responsible_person"] = [];
                selectedCheckpoint.cp_actionplans[index]["status"] = "1";
                selectedCheckpoint.cp_actionplans[index]["isEdit"] = false;
                selectedCheckpoint.cp_actionplans[index]["acp_files"] = attachLiveImages;
                saveCheckpoint(selectedCheckpoint);

            }
        }
        else{
            console.log("index wrong")
        }
    }


    // const handleValidSubmit = (evet, values) => {
    //     console.log('data1values', data1, values,selectedCheckpoint)
    //     var index = _.findIndex(selectedCheckpoint.cp_actionplans, { id: data1.id })
    //     console.log(index,'index');
    //     if (index !== -1) {
    //         if (props.epsInfo.audit_pbd_users.create_acplan && props.epsInfo.audit_pbd_users.allow_assgn_task_users) {
    //             if (openAcPlan) {
    //                 if (assignedTaskUsers.length > 0 && data1.ac_impact !== '' && data1.ac_impact !== undefined) {
    //                     addActionPlan(selectedCheckpoint, values, index)
    //                 }
    //                 if (assignedTaskUsers.length === 0) {
    //                     setAssignUsers(true);
    //                 }
    //                 if (data1.ac_impact === undefined) {
    //                     console.log('Errordfdsgfvds')
    //                     setAcImpactValid(true)
    //                 }
    //             }
    //             else {
    //                 selectedCheckpoint.cp_actionplans[index]["observation"] = values.observation;
    //                 selectedCheckpoint.cp_actionplans[index]["root_cause"] = values.root_cause;
    //                 selectedCheckpoint.cp_actionplans[index]["actionplan"] = "";
    //                 selectedCheckpoint.cp_actionplans[index]["target_date"] = "";
    //                 selectedCheckpoint.cp_actionplans[index]["ac_impact"] = "";
    //                 selectedCheckpoint.cp_actionplans[index]["to_email"] = asigneeEmail;
    //                 selectedCheckpoint.cp_actionplans[index]["responsible_person"] = [];
    //                 selectedCheckpoint.cp_actionplans[index]["status"] = "1";
    //                 selectedCheckpoint.cp_actionplans[index]["isEdit"] = false;
    //                 selectedCheckpoint.cp_actionplans[index]["acp_files"] = attachLiveImages;
    //                 saveCheckpoint(selectedCheckpoint);
    //             }
    //             console.log(selectedCheckpoint, 'selectedCheckpoint')

    //         }
    //         else if (!props.epsInfo.audit_pbd_users.allow_assgn_task_users) {
    //             if (props.epsInfo.audit_pbd_users.create_acplan) {
    //                 selectedCheckpoint.cp_actionplans[index]["observation"] = values.observation;
    //                 selectedCheckpoint.cp_actionplans[index]["root_cause"] = values.root_cause;
    //                 selectedCheckpoint.cp_actionplans[index]["actionplan"] = values.actionplan;
    //                 selectedCheckpoint.cp_actionplans[index]["target_date"] = props.epsInfo.audit_pbd_users.allow_set_target_date ? values.target_date : "";
    //                 selectedCheckpoint.cp_actionplans[index]["ac_impact"] = data1.ac_impact;
    //                 selectedCheckpoint.cp_actionplans[index]["to_email"] = asigneeEmail;
    //                 selectedCheckpoint.cp_actionplans[index]["responsible_person"] = [];
    //                 selectedCheckpoint.cp_actionplans[index]["status"] = "1";
    //                 selectedCheckpoint.cp_actionplans[index]["isEdit"] = false;
    //                 selectedCheckpoint.cp_actionplans[index]["acp_files"] = attachLiveImages;
    //             }
    //             else {
    //                 selectedCheckpoint.cp_actionplans[index]["observation"] = values.observation;
    //                 selectedCheckpoint.cp_actionplans[index]["root_cause"] = values.root_cause;
    //                 selectedCheckpoint.cp_actionplans[index]["actionplan"] = "";
    //                 selectedCheckpoint.cp_actionplans[index]["target_date"] = "";
    //                 selectedCheckpoint.cp_actionplans[index]["ac_impact"] = "";
    //                 selectedCheckpoint.cp_actionplans[index]["to_email"] = asigneeEmail;
    //                 selectedCheckpoint.cp_actionplans[index]["responsible_person"] = [];
    //                 selectedCheckpoint.cp_actionplans[index]["status"] = "1";
    //                 selectedCheckpoint.cp_actionplans[index]["isEdit"] = false;
    //                 selectedCheckpoint.cp_actionplans[index]["acp_files"] = attachLiveImages;
    //             }
    //             console.log(selectedCheckpoint, 'selectedCheckpoint')
    //             saveCheckpoint(selectedCheckpoint);
    //         }
    //         else {
    //             selectedCheckpoint.cp_actionplans[index]["observation"] = values.observation;
    //             selectedCheckpoint.cp_actionplans[index]["root_cause"] = values.root_cause;
    //             selectedCheckpoint.cp_actionplans[index]["actionplan"] = "";
    //             selectedCheckpoint.cp_actionplans[index]["target_date"] = "";
    //             selectedCheckpoint.cp_actionplans[index]["ac_impact"] = "";
    //             selectedCheckpoint.cp_actionplans[index]["to_email"] = asigneeEmail;
    //             selectedCheckpoint.cp_actionplans[index]["responsible_person"] = [];
    //             selectedCheckpoint.cp_actionplans[index]["status"] = "1";
    //             selectedCheckpoint.cp_actionplans[index]["isEdit"] = false;
    //             selectedCheckpoint.cp_actionplans[index]["acp_files"] = attachLiveImages;
    //             saveCheckpoint(selectedCheckpoint);

    //         }
    //     }
    //     else{
    //         console.log("index wrong")
    //     }
    // }


    const addActionPlan = (checkpoint, actionplan, index) => {
        console.log('checkpoint, actionplan', checkpoint, actionplan)
        checkpoint.cp_actionplans[index]["observation"] = actionplan.observation;
        checkpoint.cp_actionplans[index]["root_cause"] = actionplan.root_cause;
        checkpoint.cp_actionplans[index]["actionplan"] = actionplan.actionplan;
        checkpoint.cp_actionplans[index]["target_date"] = actionplan.target_date;
        checkpoint.cp_actionplans[index]["ac_impact"] = data1.ac_impact;
        checkpoint.cp_actionplans[index]["to_email"] = asigneeEmail;
        checkpoint.cp_actionplans[index]["responsible_person"] = assignedTaskUsers;
        checkpoint.cp_actionplans[index]["status"] = "1";
        checkpoint.cp_actionplans[index]["isEdit"] = false;
        checkpoint.cp_actionplans[index]["acp_files"] = attachLiveImages;
        console.log(checkpoint,'checkpoint')
        


        saveCheckpoint(checkpoint);
    };

    const editActionPlan = (checkpoint, actionplan) => {
        console.log(checkpoint,actionplan)
        const index = _.findIndex(checkpoint?.cp_actionplans, { id: actionplan.id });
        if (index !== -1) {
            checkpoint.cp_actionplans[index].isEdit = true;
            setData1({ ...data });
            setopenAcPlan(String(data.actionplan).length >0 ? true : false)
        }
    };


    const deleteActionPlan = (checkpoint, actionplan, index) => {
        var temp_cp_actionplan = []
        checkpoint.cp_actionplans.map((data, idx) => {
            if (index !== idx) {
                temp_cp_actionplan.push(data)
            }
        })
        checkpoint['cp_actionplans'] = temp_cp_actionplan
        saveCheckpoint(checkpoint)
    }


    const cancelActionPlan = (checkpoint, actionplan) => {
        const index = _.findIndex(checkpoint.cp_actionplans, { id: actionplan.id });
        if (index !== -1) {
            checkpoint.cp_actionplans[index].isEdit = false;
            setData1({ ...data });
        }
    };

    const onRemove = (selectedItem) => {
        if (selectedItem) {
            setAssignedTaskUsers(prevUsers =>
                prevUsers.filter(user =>
                    user.user_id !== (selectedItem._id ?? selectedItem.user_id)
                )
            );
            if (assignedTaskUsers.length - 1 === 0) setAssignUsers(true);
        }
    };

    const onSelectValues = (selectedList, selectedItem) => {
        if (selectedItem.name === "+Create New") {
            const updatedList = selectedList.filter(user => user.name !== "+Create New");
            multiRef.current.state.selectedValues = updatedList;
            setResetMultiSelect(false);
            setTimeout(() => {
                setResetMultiSelect(true);
                setModal(true);
            }, 0);
        } else {
            const auditorInfo = _.filter(location_info.audit_pbd_users, { audit_type: "1" })[0] || {};
            const defaultRole = _.filter(authUser.config_data.action_plan_roles, { id: 1 })[0] || {};

            const newUser = {
                ...selectedItem,
                auditor_name: auditorInfo.name || "",
                auditor_id: auditorInfo.user_id ?? auditorInfo._id ?? "",
                user_status: "0",
                facilities: selectedItem.facilities || defaultRole.facilities,
                role_name: selectedItem.role_name || defaultRole.role_name,
                role_description: selectedItem.role_description || defaultRole.role_description,
                id: selectedItem.id || defaultRole.id,
            };

            setAssignedTaskUsers(prevUsers => [...prevUsers, newUser]);
            setAsigneeEmail(selectedItem.name);
            setAssignUsers(false);
        }
    };

    console.log(data, data1, 'data, data1')

    const handleRadioChange = (event) => {
        const { name } = event.target;
        setData1((prevData) => ({
            ...prevData,
            ac_impact: name
        }));
        setAcImpactValid(false);
    };

    const toggle = () => setModal(prev => !prev);

    var today = new Date()
    const dd = today.getDate().toString().length == 1 ? "0" + today.getDate().toString() : today.getDate().toString()
    const mm = String(today.getMonth() + 1).length == 1 ? "0" + String(today.getMonth() + 1) : today.getMonth() + 1
    const yyyy = today.getFullYear()
    const formatedDate = (today = yyyy + "-" + mm + "-" + dd)

    const handleAcceptedFiles =async (files) => {
        console.log(files, 'files')
        var fileStatus = ''
        if (previewImageModal === false) {
            let u_id = uuid();
            if (files[0].type.startsWith('image/')) {
                // setImageUploading(true)
                // setFileStatus("clear")
                // setWarningEnabled(false)

                files.map(file => {
                    if (file.size > 5120000) {
                        fileStatus = 'exceed'
                        // setFileStatus("exceed")
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
                if(fileStatus !== 'exceed'){
                    setPreviewImageModal(true)
                    setPreviewImage(files[0].preview)
                    setUploadMerkerFile(files)
                    await uploadAwsFile(files,true)

                    // setAttachImages((prevVideos) => [...prevVideos, ...files])


                }


            }
            else{
                console.log(files,'files')
                  files.map(file => {
                    if (file.size > 5120000) {
                        fileStatus = 'exceed'
                        // setFileStatus("exceed")
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
                if(fileStatus !== 'exceed'){
                    await uploadAwsFile(files,false)

                }

            }

        }
    }


    const uploadAwsFile =async (fileInfo,type) => {
        try {
            let formData = new FormData();
            for (const key of Object.keys(fileInfo)) {
                formData.append('folder', `${props.folderPath}`)
                formData.append('imagesArray', fileInfo[key])
            }
            const response = await urlSocket.post("storeImage/awswebupload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }, {
                onUploadProgress: progressEvent => {
                    if (progressEvent.loaded === progressEvent.total) {
                    }
                }
            })
            console.log(response,'response')
            if (response.data.response_code == 500) {
                    var name = {
                        name : response.data.data[0].originalname
                    }
                type ? setAttachImages((prevImages) => [...prevImages, name]) : setAttachLiveImages((prevVideos) => [...prevVideos, ...response.data.data])




            }

        } catch (error) {
            console.log(error,'error')
        }
    }


    const deleteFileInAws = (fileInfo) => {
        try {

            urlSocket.post('storeImage/delete-file-aws', {
                fileInfo: fileInfo,
                s3_folder_path: props.folderPath
            }).then((response) => {
                console.log(response, 'response')

            })

        } catch (error) {

        }
    }


        const updateMarkerInfo = async (marker_info, dataUrl, originalname) => {
    
            try {
                urlSocket.post('cog/update-marker-info', {
                    marker_info: marker_info,
                    dataUrl: dataUrl,
                    db_info: authUser.db_info,
                    originalname: originalname,
                    checkpointInfo: props.selectedCheckpoint
                }).then((response) => {
                    console.log(response, 'response')
                })
    
            } catch (error) {
    
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
                        let attachLiveImagesInfo = _.cloneDeep(attachLiveImages)
                        if(editPos !== undefined){
                            attachLiveImagesInfo[editPos] = response.data.data[0]
                            setAttachLiveImages(attachLiveImagesInfo)
                        }
                        else{
                        setAttachLiveImages((prevVideos) => [...prevVideos, ...response.data.data])
                        }
                        setPreviewImageModal(false)
                        await updateMarkerInfo(markerData.state, markerData.dataUrl, response.data.data[0].originalname)
                        setDataLoaded(true)
                        setMarkers("")
                        setEditPos(undefined)
                        
                    }
    
                })
            } catch (error) {
            }
            // })
            // });
    
        }


            const deleteImage = async (item,idx) => {
        
                await deleteFileInAws(item)
                let attachImageInfo = _.cloneDeep(attachImages)
                let attachLiveImagesInfo = _.cloneDeep(attachLiveImages)
                attachImageInfo.splice(idx,1)
                attachLiveImagesInfo.splice(idx,1)
                setAttachImages(attachImageInfo)
                setAttachLiveImages(attachLiveImagesInfo)
                setMarkers("")
        
            }

    const getMarkerInfo = (fileInfo, mode) => {
        var apiUrl = mode === 0 ? "get-marker-info" : "delete-marker-img"
        try {
            urlSocket.post(`cog/${apiUrl}`, {
                fileInfo: fileInfo,
                db_info: authUser.db_info,
                checkpointInfo: props.selectedCheckpoint
            }).then((response) => {
                console.log(response, 'response',props.selectedCheckpoint)
                if (response.data.response_code === 500 && mode === 0) {
                    setMarkers(response.data.data.length > 0 ? response.data.data[0].marker_info : "")
                    setPreviewImageModal(true)
                }

            })
        } catch (error) {
            console.log(error, 'error')
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
        // setPreviewImageModal(true)
        // setPreviewImage(file.preview)
        // setUploadMerkerFile([file])
        // await uploadAwsFile([file], true)




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
                    console.log(response,'response')
                    if (response.data.response_code == 500) {
                        var name = {
                            name: response.data.data[0].originalname
                        }
                        setPreviewImageModal(true)
                        setPreviewImage((props.imagePreviewUrl+props.folderPath) + response.data.data[0].originalname)
                        // setUploadMerkerFile(file)
                        setAttachImages((prevImages) => [...prevImages, name])
                    }

                })
                .catch(error => {
                })
        }
        catch (error) {
        }
    }


    const uploadWebCamVedio = async(file) => {
        console.log(file,'file')
        await uploadAwsFile([file],false)

    };
      
    




    return (

        <div>
            <label>Add CAPA</label>
            <Card className="border border-2 border-amber-300">
                {
                    console.log(attachImages,'attachImages',attachLiveImages)
                }
                <CardBody>
                    {
                        data.isEdit ?
                            <AvForm className="form-horizontal" onValidSubmit={handleValidSubmit}>
                                <Row className="mb-2 border-bottom border-2">
                                    <div className="d-sm-flex align-items-center justify-content-between pb-1">
                                        <Label>Action {index + 1}</Label>
                                        <div>
                                            {data.status === "1" ? <Button className="btn w-md btn-sm" color="danger" onClick={() => { cancelActionPlan(selectedCheckpoint, data) }}>Cancel</Button> : null}
                                        </div>
                                    </div>
                                </Row>

                                <Row className="align-items-center mb-2">
                                    <Col sm={"6"} lg={"6"}>
                                        <label>Observation<span className="text-danger">*</span> </label>
                                        <AvField
                                            name="observation"
                                            value={data.observation}
                                            onChange={(e) => setActpln(e.target.value)}
                                            className="form-control"
                                            placeholder="Enter observation"
                                            type="textarea"
                                            required
                                        />
                                    </Col>
                                    <Col sm={"6"} lg={"6"}>
                                        <label>Root Cause</label>
                                        <AvField
                                            name="root_cause"
                                            value={data.root_cause}
                                            onChange={(e) => setRootCause(e.target.value)}
                                            className="form-control"
                                            placeholder="Enter Root Cause"
                                            type="textarea"
                                        />
                                    </Col>
                                </Row>
                                {
                                    props.epsInfo.audit_pbd_users.create_acplan ?
                                    <>
                                    <Row className="mb-2">
                                        <Col sm={String(data.actionplan).length === 0 && !openAcPlan ? "2" :  "1"} lg={String(data.actionplan).length === 0 && !openAcPlan ? "2" :  "1"}>
                                            <Button type='button' onClick={() => {
                                                setopenAcPlan(prev => !prev)
                                                setvalidateAcPlan(false)
                                                }} color={openAcPlan ? "danger" : "dark"} size="sm">
                                              {openAcPlan ? "Close": "Add Action Plan"}
                                            </Button>

                                        </Col>
                                        <br/>
                                        {
                                            validateAcPlan &&
                                            <div className="text-danger" style={{fontSize:"smaller"}}> Please Fill the Action Plan.</div>

                                        }
                                            {
                                                String(data.actionplan).length > 0 &&
                                                  <Popconfirm
                                                  onConfirm={()=>{
                                                    console.log(data,'data')
                                                    deleteAction(data)
                                                  }}
                                                  placement="leftBottom" title={`Are You sure to delete ?`}>
                                                    <Col sm={"2"} lg={"2"} className="text-left">
                                                        <Button type='button' onClick={() => {
                                                        }} color={"dark"} size="sm">
                                                            {"Delete Action Plan"}
                                                        </Button>

                                                    </Col>
                                                    </Popconfirm>
                                                // </Row>
                                            }
                                    </Row>

                                     
                                    </>


                                        


                                    :
                                    <Row className="mb-2">
                                        <Col sm={"5"} lg={"5"}>
                                            <Button disabled={true}       className="d-block mb-2" type='button' color={"primary"} size="sm">
                                              {"Add Action Plan"}
                                            </Button><span className="text-danger">{"(you did not have permission to create action plan)"} </span>

                                        </Col>
                                    </Row>
                                }
                               

                                {
                                  openAcPlan &&  props.epsInfo.audit_pbd_users.create_acplan &&
                                    <>
                                        <Row className="align-items-center mb-2">
                                            <Col sm={"12"} lg={"12"}>
                                                <label>Action plan <span className="text-danger">*</span></label>
                                                <AvField
                                                    name="actionplan"
                                                    value={data.actionplan}
                                                    onChange={(e) => setActpln(e.target.value)}
                                                    className="form-control"
                                                    placeholder="Enter action plan"
                                                    type="textarea"
                                                    required
                                                />

                                            </Col>
                                        </Row>
                                       
                                            <Row className="mb-2">
                                                 {
                                            props.epsInfo.audit_pbd_users.allow_set_target_date &&
                                                <Col sm={"12"} lg={"4"} >
                                                    <label>Target date<span className="text-danger">*</span></label>
                                                    <AvField
                                                        name="target_date"
                                                        type="date"
                                                        errorMessage="Please provide a valid date."
                                                        className="form-control"
                                                        min={formatedDate}
                                                        value={data.target_date}
                                                        onKeyDown={(e) => { e.preventDefault(); }}
                                                        onChange={(e) => setTargetDate(e.target.value)}
                                                        validate={{ required: { value: true } }}
                                                        id="td"
                                                    />
                                                </Col>
}

  {
                                            props.epsInfo.audit_pbd_users.allow_assgn_task_users &&
                                                <Col sm={"12"} lg={"4"}>
                                                    <label>People Responsible<span className="text-danger">*</span></label>

                                                    {resetMultiSelect &&
                                                        <Multiselect
                                                            ref={multiRef}
                                                            onRemove={(selectedList, selectedItem) => onRemove(selectedItem)}
                                                            onSelect={(selectedList, selectedItem) => onSelectValues(selectedList, selectedItem)}
                                                            options={locationUsers}
                                                            displayValue="name"
                                                            closeOnSelect={false}
                                                            selectedValues={data.responsible_person == undefined ? assignedTaskUsers : data.responsible_person}
                                                        />
                                                    }
                                                    {
                                                        assignUsers &&
                                                        <div className="text-danger mt-1" style={{ fontSize: 'smaller' }}>Please Assign Users</div>
                                                    }
                                                </Col>
}
                                            </Row>

                                        <Row className="mb-2">
                                            <Col sm={"12"} lg={"12"}>
                                                <label>Action Plan Priority :
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                    {
                                                        props.priority?.map((ele, idx) => {
                                                            return (
                                                                <div key={idx} className={`form-check mx-2 form-radio-${ele.color}`}>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name={ele.name}
                                                                        id="exampleRadios1"
                                                                        onClick={(e) => handleRadioChange(e)}
                                                                        checked={data1["ac_impact"] === ele.name}
                                                                        value={data1["ac_impact"]}

                                                                    />
                                                                    <label
                                                                        className={`form-check-label text-${ele.color}`}
                                                                        htmlFor="exampleRadios1"
                                                                    >
                                                                        {ele.name}
                                                                    </label>
                                                                </div>
                                                            )

                                                        })

                                                    }
                                                </div>
                                            </Col>
                                            {
                                                acImpactValid &&
                                                <div className="text-danger mt-1" style={{ fontSize: 'smaller' }}>Please Select Imapct Level</div>
                                            }
                                        </Row>

                                        <Row className="mb-2">
                                            <Col sm={"12"} lg={"12"}>
                                                <label>Images / Videos / Documents :
                                                </label>
                                                {
                                                    attachLiveImages.length < authUser.config_data.acp_max_files &&
                                                    <>
                                                        <div>
                                                            <Card style={{ border: '1px dashed lightgrey' }} className='d-flex align-items-center justify-content-start mb-1'>

                                                                <WebcamCapture video={false} uploadWebCamImage={(data) => { uploadWebCamImage(data) }} uploadWebCamVedio={(data) => { uploadWebCamVedio(data) }} max_video_length={Number(maxVideoLength)} />
                                                            </Card>
                                                        </div>


                                                        <div style={{ zoom: 0.7 }}>
                                                            <Form>
                                                                <Dropzone onDrop={acceptedFiles => {
                                                                    handleAcceptedFiles(acceptedFiles)
                                                                }
                                                                }
                                                                    // accept={[".jpg", ".jpeg", ".png"]}
                                                                    accept={[".jpg", ".jpeg", ".png", ".avi", ".mov", ".mkv", ".mp4", '.doc', ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf"]}

                                                                >
                                                                    {({ getRootProps, getInputProps }) => (
                                                                        <div className="dropzone">
                                                                            <div className="dz-message needsclick" {...getRootProps()} >
                                                                                <input {...getInputProps()} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); } }} />
                                                                                <div className="mb-3"> <i className="display-4 text-muted bx bxs-cloud-upload" /></div>
                                                                                <h4>Drop Images here or click to upload.</h4>
                                                                                <div className="mt-2 font-size-13 text-dark text-center">
                                                                                    <label className='me-2'>Files accepted - .jpg, .jpeg, .png, .bmp </label>
                                                                                    <label className='me-2'>Maximum individual file size - 5mb</label>
                                                                                    <label className='me-2'>Minimum Number of files -
                                                                                    </label>
                                                                                    <label className='me-2'>Maximum upto {authUser.config_data.acp_max_files} files</label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Dropzone>

                                                            </Form>
                                                        </div>
                                                    </>
                                                }


                                            </Col>



                                        </Row>

                                        <Row>
                                            <Col sm={"12"} lg={"12"}>
                                                {
                                                    attachLiveImages.map((f, idx) => {
                                                        return (
                                                            <>
                                                                <div className="d-flex align-items-center justify-content-end gap-2" style={{ cursor: "pointer" }}>
                                                                    <div
                                                                        onClick={() => {
                                                                            getMarkerInfo(f, 0);
                                                                            setPreviewImage(
                                                                                `${props.imagePreviewUrl}${props.folderPath}` +
                                                                                // props.selectedCheckpoint.rule[getOptionIndex].orginalImage[i].name
                                                                                (attachImages[idx]?.name ? attachImages[idx]?.name : attachLiveImages[idx].originalname)
                                                                            )
                                                                            setEditPos(idx)
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
                                                                            deleteImage(f, idx);
                                                                            getMarkerInfo(f, 1);
                                                                        }}
                                                                    >
                                                                        <Link to="#">
                                                                            <i className="mdi mdi-close-circle-outline font-size-20 text-danger me-2" />
                                                                        </Link>
                                                                    </Popconfirm>
                                                                </div>
                                                                {
                                                                    f.mimetype.startsWith("image/") ?
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
                                                                                    `${props.imagePreviewUrl}${props.folderPath}` +
                                                                                    (f.originalName === undefined ? f.originalname : f.originalName)
                                                                                }
                                                                            />
                                                                        </div>

                                                                        :
                                                                        f.mimetype.startsWith("video/") ?
                                                                            <div style={{ width: "100%", height: "0", paddingBottom: "56.25%", position: "relative", backgroundColor: "#f5f5f5", border: "1px solid #e9e9e9" }}>
                                                                                <video
                                                                                    src={
                                                                                        `${props.imagePreviewUrl}${props.folderPath}` +
                                                                                        f.originalname}
                                                                                    className="img-fluid"
                                                                                    style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", objectFit: "contain" }}
                                                                                    controls
                                                                                />
                                                                            </div>
                                                                            :
                                                                            <div className="p-2 w-100" key={"media" + idx}>
                                                                                <iframe
                                                                                    src={
                                                                                        `${props.imagePreviewUrl}${props.folderPath}` +
                                                                                        f.originalname}
                                                                                    width="100%"
                                                                                    height="500px"
                                                                                    title={f.originalname}
                                                                                    style={{ border: '1px solid #ccc' }}
                                                                                />
                                                                            </div>

                                                                }

                                                                <div className="mt-1">
                                                                    <span className={f.uploading ? "font-size-10 text-danger" : "font-size-10 text-success"} >
                                                                        {f.uploadingStatus}
                                                                    </span>
                                                                </div>
                                                                {/* <MediaPreview
                                                            f={f}
                                                            index={idx}
                                                            deletedocuments={(index) => { deleteImage(f, idx) }}
                                                            audit_status={"1"}
                                                            imagePreviewUrl={
                                                                `${props.imagePreviewUrl}${props.folderPath}/`
                                                                // `${props.imagePreviewUrl}${authUser.client_info[0].s3_folder_path}${props.endpointData.audit_name}/${props.endpointData.loc_name}/`
                                                            }
                                                        /> */}


                                                            </>)
                                                    })
                                                }
                                            </Col>

                                        </Row>
                                    </>

                                }

                                <Row>
                                    <div className="d-sm-flex align-items-center justify-content-between">
                                        <div className=" font-size-14"></div>
                                        <div >
                                            <Button className="btn w-md btn-sm me-2" outline type="submit" color="success">Save</Button>
                                            <Button className="btn w-md btn-sm" outline color="danger" onClick={() => deleteActionPlan(selectedCheckpoint, data, index)}>Delete</Button>
                                        </div>
                                    </div>
                                </Row>

                            </AvForm>
                            :

                            <div>
                                <Row className="mb-2 border-bottom border-2">
                                    <div className="d-sm-flex align-items-center justify-content-between pb-1">
                                        <div>
                                            <Label>Action {index + 1}</Label>
                                        </div>
                                        {
                                            props.epsInfo.audit_pbd_users.modify_acplan &&
                                            <div >
                                                <Button className="btn btn-sm w-md d-flex align-items-center justify-content-center gap-2" color="primary" onClick={() => editActionPlan(selectedCheckpoint, data)}><i className="bx bx-edit-alt" />Edit</Button>
                                            </div>
                                        }

                                                

                                    </div>
                                </Row>
                                <Row className="align-items-center mb-2 border-bottom" >
                                    <Col sm={"6"} lg={"6"} className="border-end">
                                        <label className="text-primary font-size-12">Observation<span className="text-danger">*</span></label>
                                        <div>{data.observation}</div>
                                    </Col>
                                    <Col sm={"6"} lg={"6"}>
                                        <label className="text-primary font-size-12">Root Cause</label>
                                        <div>{data.root_cause}</div>
                                    </Col>
                                </Row>
                                {
                                    String(data.actionplan).length > 0 && data.actionplan &&
                                    <>
                                        <Row className="align-items-center mb-2 border-bottom">
                                            <Col sm={"12"} lg={"12"}>
                                                <label className="text-primary font-size-12">Action plan<span className="text-danger">*</span> </label>
                                                <div>{data.actionplan}</div>
                                            </Col>
                                        </Row>
                                       
                                            <Row className="align-items-center mb-2 border-bottom">
                                                 {String(data.target_date).length > 0 &&
                                                <Col sm={"6"} lg={"6"} className="border-end">
                                                    <label className="text-primary font-size-12">Target date<span className="text-danger">*</span></label>
                                                    <div>{moment(data.target_date).format("DD-MMM-YYYY")}</div>
                                                </Col>
                                        }

                                            {data.responsible_person.length > 0 &&
                                                <Col sm={"6"} lg={"6"}>
                                                    <label className="text-primary font-size-12">People Responsible<span className="text-danger">*</span></label>


                                                    <div className="d-flex gap-1">
                                                        {data.responsible_person.map((item, index) => (
                                                            <React.Fragment key={index}>
                                                                <label>{item.name}</label>
                                                                {index < data.responsible_person.length - 1 ? ',' : '.'}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                </Col>
                                            }
                                            </Row>

                                        <Row>
                                            <Col sm={"12"} lg={"12"}>
                                                <label>Action Plan Priority :
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                    {
                                                        props.priority?.map((ele, idx) => {
                                                            return (
                                                                <div key={idx} className={`form-check mx-2 form-radio-${ele.color}`}>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name={ele.name}
                                                                        id="exampleRadios1"
                                                                        onClick={(e) => handleRadioChange(e)}
                                                                        checked={data1["ac_impact"] === ele.name}
                                                                        value={data1["ac_impact"]}
                                                                        disabled

                                                                    />
                                                                    <label
                                                                        className={`form-check-label text-${ele.color}`}
                                                                        htmlFor="exampleRadios1"
                                                                    >
                                                                        {ele.name}
                                                                    </label>
                                                                </div>
                                                            )

                                                        })

                                                    }
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col sm={"12"} lg={"12"}>
                                                {
                                                    data.acp_files?.map((f, idx) => {
                                                        return (
                                                            <>
                                                                <div className="d-flex align-items-center justify-content-end gap-2" style={{ cursor: "pointer" }}>
                                                                </div>
                                                                {
                                                                    f.mimetype.startsWith("image/") ?
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
                                                                                    `${props.imagePreviewUrl}${props.folderPath}` +
                                                                                    (f.originalName === undefined ? f.originalname : f.originalName)
                                                                                }
                                                                            />
                                                                        </div>

                                                                        :
                                                                        f.mimetype.startsWith("video/") ?
                                                                            <div style={{ width: "100%", height: "0", paddingBottom: "56.25%", position: "relative", backgroundColor: "#f5f5f5", border: "1px solid #e9e9e9" }}>
                                                                                <video
                                                                                    src={
                                                                                        `${props.imagePreviewUrl}${props.folderPath}` +
                                                                                        f.originalname}
                                                                                    className="img-fluid"
                                                                                    style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", objectFit: "contain" }}
                                                                                    controls
                                                                                />
                                                                            </div>
                                                                            :
                                                                            <div className="p-2 w-100" key={"media" + idx}>
                                                                                <iframe
                                                                                    src={
                                                                                        `${props.imagePreviewUrl}${props.folderPath}` +
                                                                                        f.originalname}
                                                                                    width="100%"
                                                                                    height="500px"
                                                                                    title={f.originalname}
                                                                                    style={{ border: '1px solid #ccc' }}
                                                                                />
                                                                            </div>

                                                                }

                                                                <div className="mt-1">
                                                                    <span className={f.uploading ? "font-size-10 text-danger" : "font-size-10 text-success"} >
                                                                        {f.uploadingStatus}
                                                                    </span>
                                                                </div>

                                                            </>)
                                                    })
                                                }
                                            </Col>

                                        </Row>
                                    </>
                                }


                            </div>
                    }
                </CardBody>
            </Card>

            {modal && (
                <CrudUser
                    updateLocationUser={(data) => {
                        setResetMultiSelect(false);
                        setLocationUsers(data);
                        setTimeout(() => setResetMultiSelect(true), 0);
                    }}
                    modal={modal}
                    toggle={toggle}
                    client_info={clientInfo}
                    location_info={location_info}
                />
            )}


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
                        onUploadMarkerFile={(markerFile, markerData) => {
                          onUploadMarkerFile(markerFile, markerData)

                        }}
                        markers={markers}
                        editOrginalName={editOrginalName}
                    />
                </div>
            )}



        </div>
    );
};

export default CAPA;