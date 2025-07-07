import React, { useState, useEffect, useRef,useMemo } from "react";
import { ReactSketchCanvas } from 'react-sketch-canvas';
import MetaTags from 'react-meta-tags';
import {
  Row, Col, Button, Card, CardBody, Container, Label,

  CardText,
  CardTitle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal, ModalBody, ModalHeader,
  Spinner,
  CardHeader
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation"
import { Link, useNavigate } from "react-router-dom"
import moment from 'moment'
import OptionComponent from "./Components/option_component";
import Observation from "./Components/observation";
import CAPA from "./Components/capa";
import classnames from "classnames"
import ValidateCP from "./Functions/validate_cp"
import CRUD_Images from "./Components/CRUD_Images";
import CRUD_Videos from "./Components/CRUD_videos";
import CRUD_Documents from "./Components/CRUD_Documents";
import uuid from 'react-uuid'
import ReviewOPType from "./Components/review_optype";
import PreviewImage from "./Components/preview_images";
import PreviewDocuments from "./Components/preview_documents";
import PreviewObservation from "./Components/preview_observation";
import PreviewCAPA from "./Components/preview_CAPA";
import Swal from "sweetalert2";
import { getFlatDataFromTree } from 'react-sortable-tree/dist/index.cjs.js';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
const _ = require('lodash')
import urlSocket from "../../../helpers/urlSocket";

const styles = {
  border: '0.0625rem solid #9c9c9c',
  borderRadius: '0.25rem',
};


const statusText = ["Not started", "In progress", "Completed", "Retake", "Rejected", "Approved"]
const statusColor = ["#555657", "#FDA705", "#31D9AC", "#F76518", "#E22E2E", "#49AF30"]



const Checkpoints = (props) => {

  const [dataloaded, setDataloaded] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [height, setHeight] = useState(window.innerHeight);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showOption, setShowOption] = useState(false);
  const [attachImages, setAttachImages] = useState([]);
  const [attachDocuments, setAttachDocuments] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [docfileStatus, setDocfileStatus] = useState("clear");
  const [fileStatus, setFileStatus] = useState("clear");
  const [signeeDesignation, setSigneeDesignation] = useState("");
  const [docWarningEnabled, setDocWarningEnabled] = useState(false);
  const [warningEnabled, setWarningEnabled] = useState(false);
  const [issignEmpty, setIssignEmpty] = useState(true);
  const [signee, setSignee] = useState("");
  const [signValid, setSignValid] = useState(true);
  const [previewAuditScore, setPreviewAuditScore] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [clientInfo, setClientInfo] = useState(
    JSON.parse(sessionStorage.getItem("client_info"))[0]
  );
  const [isInputFieldOpen, setIsInputFieldOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [checkpoints, setCheckpoints] = useState([]);
  const [totalCp, settotalCp] = useState(0);
  const [ns, setNs] = useState(0);
  const [ip, setIp] = useState(0);
  const [cpt, setCpt] = useState(0);
  const [rtk, setRtk] = useState(0);
  const [apvd, setApvd] = useState(0);
  const [rjd, setRjd] = useState(0);
  const [rwd, setRwd] = useState(0);
  const [configData, setConfigData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [endpointData, setEndpointData] = useState(null);
  const [endpointInfo, setEndpointInfo] = useState(null);
  const [dbInfo, setDbInfo] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageToken, setImageToken] = useState('');
  const [isCheckpointSaved, setIsCheckpointSaved] = useState(false);



  const [signUrl, setSignUrl] = useState(null);
  const [upSignUrl, setUpSignUrl] = useState(null);
  const [isSignEmpty, setIsSignEmpty] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [signBoardMessage, setSignBoardMessage] = useState("")
  const [optionSelected, setOptionSelected] = useState(false);


  const [filteredData, setFilteredData] = useState([]);
  const [idx, setIdx] = useState(-1);


  const [showWarning, setShowWarning] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [confirmBoth, setConfirmBoth] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isAuditSigned, setIsAuditSigned] = useState(false);
  const [customDiv, setCustomDiv] = useState(false);
  const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")));







  const canvas = useRef(null);
  const navigate = useNavigate()



  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = props.location.state;
        setLatitude(data.latitude);
        setLongitude(data.longitude);
      } catch (error) {
      }

      console.log(selectedCheckpoint, "selectedCheckpoint");
      await getSessionData();
      await getEndpointInfo();
      await checkPointProcess();
    };

    fetchData();
  }, []);


  const modaltoggle = () => {
    setModal(prevModal => !prevModal);
  };


  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const showWarningAlert = () => {
    setShowWarning(true)
    Swal.fire({
      title: 'Message',
      text: submitMessage, icon: 'warning', confirmButtonText: 'OK',
    })
      .then(() => { setShowWarning(false) })
  }



  const showConfirmAlert = () => {
    setConfirmBoth(true)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    }).then((result) => {
      if (result.isConfirmed) {
        // setSuccessDlg(true)
        // setDynamicTitle("Deleted")
        // setDynamicDescription("Your file has been deleted.")
        submitAudit()
      } else {
        // setErrorDlg(true)
        // setDynamicTitle("Cancelled")
        // setDynamicDescription("Your imaginary file is safe :)")
      }
      setConfirmBoth(false)
    })
  }



  const getCheckpointStatus = async() => {
    console.log("llll", checkpoints);
    settotalCp(_.filter(checkpoints, { document_type: "2" }).length)
    setNs(_.filter(checkpoints, { cp_status: "0", document_type: "2" }).length);
    setIp(_.filter(checkpoints, { cp_status: "1", document_type: "2" }).length);
    setCpt(_.filter(checkpoints, { cp_status: "2", document_type: "2" }).length);
    setRtk(_.filter(checkpoints, { cp_status: "3", document_type: "2" }).length);
    setApvd(_.filter(checkpoints, { cp_status: "5", document_type: "2" }).length);
    setRjd(_.filter(checkpoints, { cp_status: "4", document_type: "2" }).length);
    setRwd(_.filter(checkpoints, (item) => item?.cp_review_status !== null).length);
  };

  const getSessionData = async () => {
    const data = JSON.parse(sessionStorage.getItem("authUser"));
    const db_info = JSON.parse(sessionStorage.getItem("db_info"));
    const endpointData = JSON.parse(sessionStorage.getItem("endpointData"));
    console.log(endpointData,'endpointData')
    setConfigData(data.config_data);
    setUserData(data.user_data);
    setEndpointData(endpointData);
    setEndpointInfo(endpointData)
    setDbInfo(db_info);
    setImagePreviewUrl(data.config_data.img_url);
    setImageToken(data.config_data.img_url);
    setSignee(data.user_data.firstname + data.user_data.lastname);
  };

  const getEndpointInfo = async () => {

    const data = JSON.parse(sessionStorage.getItem("authUser"));
    const authUser = data.user_data
    const db_info = JSON.parse(sessionStorage.getItem("db_info"));
    const endpointData1 = JSON.parse(sessionStorage.getItem("endpointData"));

    try {
      const response = await urlSocket.post("webpbdadtdta/getendpointInfo", {
        endpointInfo: endpointData1,
        userInfo: {
          _id: authUser._id,
          encrypted_db_url: db_info.encrypted_db_url,
          company_id: authUser.company_id
        }
      });

      setEndpointData(response.data.data);
      var dataInfo = response.data.data
      var userInfo = _.filter(response.data.data.audit_pbd_users,{user_id : authUser._id})
      if(userInfo.length >0){
        dataInfo["audit_pbd_users"]=userInfo[0]
      }
      setEndpointInfo(dataInfo)

    } catch (error) {
      console.error("Error fetching endpoint info:", error);
    }
  };


  const checkPointProcess = async () => {
    const endpointData = JSON.parse(sessionStorage.getItem("endpointData"));

    if (endpointData.audit_cp_status === "0") {
      await createCheckPoints()
    }
    else if (endpointData.audit_cp_status === "1") {
      await loadCheckpoints()
    }
    else {
      await loadCheckpoints()
    }
  }


  const createCheckPoints = async () => {


    const data = JSON.parse(sessionStorage.getItem("authUser"));
    const authUser = data.user_data
    const db_info = JSON.parse(sessionStorage.getItem("db_info"));
    const endpointData1 = JSON.parse(sessionStorage.getItem("endpointData"));
    try {

      urlSocket.post("epadtprcs/clonecpfmcpmaster", {
        auditInfo: {
          audit_pbd_id: endpointData1.audit_pbd_id
        },
        userInfo: {
          _id: authUser._id,
          encrypted_db_url: db_info.encrypted_db_url,
        },
        endpointInfo: endpointData1
      })
        .then( async(response) => {
          console.log(response,'response',endpointData1)
          if (response.data.response_code === 500) {
            var endpointData = { ...endpointData1 }
            endpointData["audit_cp_status"] = "1"
            sessionStorage.setItem("endpointData", JSON.stringify(endpointData));

            setCheckpoints(response.data.data)
            console.log('response.data.data', response.data.data)
            setEndpointData(endpointData)
          //  await getCheckpointStatus(response.data.data)
            filterCheckpoints(filterStatus,response.data.data)
          }

        })

    } catch (error) {
      console.log("catch error", error)
    }

  }


  useEffect(()=>{
    getCheckpointStatus()

  },[checkpoints])


  const loadCheckpoints = async () => {

    const data = JSON.parse(sessionStorage.getItem("authUser"));
    const authUser = data.user_data
    const db_info = JSON.parse(sessionStorage.getItem("db_info"));
    const endpointData1 = JSON.parse(sessionStorage.getItem("endpointData"));


    try {

      urlSocket.post("epadtprcs/getepcheckpoints", {
        auditInfo: {
          audit_pbd_id: endpointData1.audit_pbd_id
        },
        userInfo: {
          _id: authUser._id,
          company_id: authUser.company_id,
          encrypted_db_url: db_info.encrypted_db_url
        },
        endpointInfo: endpointData1
      })
        .then(async response => {
          if (response.data.response_code === 500) {
            var flatData = await convertFlatDataToTreeData(response.data.data)
            setCheckpoints(flatData)

          await  getCheckpointStatus()
            filterCheckpoints(filterStatus, flatData)
          }

        })

    } catch (error) {
      console.log("catch error", error)
    }
  }

  const updateCheckpoint = (data, item) => {
    updateAudit(item)

  }



  const updateAudit = (item) => {
    saveCheckpoint(item);

    const updatedEndpointData = { ...endpointData };
    console.log(updatedEndpointData,'updatedEndpointData')
    console.log(updatedEndpointData,'updatedEndpointData')
    if (updatedEndpointData.audit_status_id === "5") {
      updatedEndpointData.audit_status_id = "6";
      updatedEndpointData.audit_status_name = "Review In progress";
      // updatedEndpointData.audit_cp_status = "Review In progress";
      setEndpointData(updatedEndpointData);
      saveCheckpoint(item);
      return;
    }
    console.log(cpt,apvd,rjd,'rjd',ns)
    if (updatedEndpointData.audit_status_id === "6" && checkpoints.length === (cpt + apvd + rjd)) {
      updatedEndpointData.audit_completed_on = new Date();
      // updatedEndpointData.audit_cp_status = "Completed";
      updatedEndpointData.audit_status_id = "2";
      updatedEndpointData.audit_status_name = "Completed";
      updatedEndpointData.review_status_id = "0";
      updatedEndpointData.review_status_id = "Not Started";
      setEndpointData(updatedEndpointData);
      saveCheckpoint(item);
      return;
    }

    if (updatedEndpointData.audit_status_id !== "3") {
      if (ns !== 0) {
        if (
          updatedEndpointData.audit_status_id === "1" &&
          ns === cpt
        ) {
          updatedEndpointData.audit_completed_on = new Date();
          // updatedEndpointData.audit_cp_status = "Completed";
          updatedEndpointData.audit_status_id = "2";
          updatedEndpointData.audit_status_name = "Completed";
          setEndpointData(updatedEndpointData);
          saveCheckpoint(item);
          return;
        }

        if (
          (updatedEndpointData.audit_status_id === "0" ||
            updatedEndpointData.audit_status_id === "1" ||
            updatedEndpointData.audit_status_id === "2") &&
          cpt !== ns
        ) {
          updatedEndpointData.audit_started_on = updatedEndpointData.audit_started_on || new Date();
          // updatedEndpointData.audit_cp_status = "In progress";
          updatedEndpointData.audit_status_id = "1";
          updatedEndpointData.audit_status_name = "In progress";
          console.log(updatedEndpointData,'updatedEndpointData')
          setEndpointData(updatedEndpointData);
          saveCheckpoint(item,updatedEndpointData);
          return;
        }
      }
    }
  };


  const addCAPA = (checkpoint) => {

    console.log("checkpoint", checkpoint)
    const cp_apln_length = checkpoint.cp_actionplans.length + 1;

    checkpoint["cp_actionplans"] = checkpoint["cp_actionplans"].concat([
      {
        "id": checkpoint._id + String(cp_apln_length),
        "observation": "",
        "actionplan": "",
        "target_date": null,
        "to_email": "",
        "to_phone": "",
        "status": "0",
        "isEdit": true,
        "acp_files":[]
      }
    ]);

    setIsInputFieldOpen(true);
    setRefresh(true);
    setIsCheckpointSaved(true);
  };



  const saveCheckpoint = async (checkpoint,endpointDataInfo) => {
    try {
      console.log('checkpoint', checkpoint)
      const cpStatus = ValidateCP.checkpointStatus(selectedCheckpoint,endpointInfo);
      console.log(cpStatus,'cpStatus')
      const updatedEndpointData = endpointDataInfo  === undefined ? {...endpointData} : endpointDataInfo

      if (updatedEndpointData.audit_config?.audit_coords_enable === true) {
        updatedEndpointData.audit_lat = latitude;
        updatedEndpointData.audit_long = longitude;
      }

      // Set checkpoint status
      checkpoint.cp_status = cpStatus;

      // Post data to the server
      console.log('saveCheckpoint',checkpoint, dbInfo, userData, updatedEndpointData, updatedEndpointData)
      checkpoint["source"]="web"
      const response = await urlSocket.post("epadtprcs/updatecheckpoints", {
        userInfo: {
          encrypted_db_url: dbInfo.encrypted_db_url,
          _id: userData._id,
          company_id: userData.company_id,
        },
        endpointInfo: updatedEndpointData,
        checkpointInfo: checkpoint,
        auditInfo: {
          audit_pbd_id: updatedEndpointData.audit_pbd_id,
        },
      });

      console.log('response', response)

      if (response.data.response_code === 500) {
        // Update checkpoints in state
        const updatedCheckpoints = _.cloneDeep(checkpoints)
        const getIndex = _.findIndex(updatedCheckpoints, { _id: response.data.data._id });

        if (getIndex !== -1) {
          updatedCheckpoints[getIndex] = response.data.data;
        }

        setCheckpoints(updatedCheckpoints);
        setEndpointData(response.data.endpoint);
        setEndpointData(updatedEndpointData);

        setIsInputFieldOpen(false);
       await getCheckpointStatus();
      }



    } catch (error) {
      console.error("Error saving checkpoint:", error);
    }
  };





  const filterCheckpoints = async (filterStatus, flatData) => {
    let filtered;
    console.log('filterStatus', filterStatus, filtered)
    if (filterStatus === "all") {
      filtered = flatData;
      setFilteredData(filtered);
      setShowOption(false);
      setSelectedCheckpoint(null);
      setIdx(-1);
      // setDataloaded(true);
    } else if (filterStatus === "rwd") {
      filtered = _.filter(flatData, (item) => item.cp_review_status !== null);
      setFilteredData(filtered);
      setShowOption(false);
      setSelectedCheckpoint(null);
      setIdx(-1);
      // setDataloaded(true);
    } else {
      filtered = _.filter(flatData, { cp_status: filterStatus, document_type: '2' });
      setFilteredData(filtered);
      setShowOption(false);
      setSelectedCheckpoint(null);
      setIdx(-1);
      // setDataloaded(true);
    }
    setDataloaded(true);
  };

  

  const loadSelectedCheckpoint = async (item, i) => {
    setShowOption(false);
    setOptionSelected(false);

    setTimeout(() => {
      setSelectedCheckpoint(item);
      setIdx(i);
      // if (!item.enable_validation && item.checkpoint_type_id === "6") {
      //   setOptionSelected(true);
      //   setSelectedOption(item.rule[0]);
      // }
      // else {
        const selectedOptions = _.filter(item.rule, { is_selected: true });
        setOptionSelected(selectedOptions.length !== 0);
        setSelectedOption(selectedOptions[0]);
      // }
      //   else{

      //   }
      // }
     
      setShowOption(true);
    }, 10);
  };

  const getactionplanCount = () => {
    var count = _.filter(selectedCheckpoint.cp_actionplans, { status: "1" }).length
    return count
  }


  const confirmSubmit = () => {

    const filteredCheckpoints = _.filter(checkpoints, { document_type: "2" });
    console.log('filteredCheckpoints', cpt + apvd + rjd)
    if (filteredCheckpoints?.length !== (cpt + apvd + rjd)) {
      setShowWarning(true);
      setSubmitMessage("Cannot submit till you complete all check points");
    } else if (endpointData.audit_capture_sign === true && endpointData.audit_signature.length === 0) {
      setShowWarning(true);
      setSubmitMessage("Auditor signature is required.");
    } else {
      setConfirmBoth(true);
    }
  };


  const treeDataToFlat = async (treeData) => {
    var getNodeKey = ({ treeIndex }) => treeIndex;
    var flatData = getFlatDataFromTree(
      {
        treeData: treeData,
        getNodeKey,
        ignoreCollapsed: false,
      });

    var explicitData = flatData.filter((item) => !!item);

    return explicitData;
  };


  const convertFlatDataToTreeData = async (flatData) => {
    if (flatData !== undefined) {
      var parent_data = flatData.filter(item2 => item2.parent_id === null);
      parent_data.sort(function (a, b) {
        return a.document_id - b.document_id;
      });

      const treeData = parent_data.map((parentItem) => {
        parentItem.children = getChildren(parentItem.document_id, flatData);
        return parentItem;
      });

      var converted_treeDataToFlat = await treeDataToFlat(treeData)
      var removed_node = _.map(converted_treeDataToFlat, "node")
      return removed_node
    }
  }


  const getChildren = (parentId, flatData) => {
    var children = flatData.filter(item => item.parent_id === parentId);
    children.sort(function (a, b) {
      return a.document_id - b.document_id;
    });

    return children.map((childItem) => {
      childItem.children = getChildren(childItem.document_id, flatData);
      return childItem;
    });
  }



  const submitAudit = async () => {
    const filteredCheckpoints = _.filter(checkpoints, { document_type: "2" });
    const sumOfAuditScore = _.sumBy(filteredCheckpoints, (obj) =>
      parseFloat(obj.cp_otpion_score?.$numberDecimal)
    );

    const updatedEndpointData = { ...endpointData, audit_score: sumOfAuditScore };

    const actionPlanCheckpoints = _.filter(filteredCheckpoints, (checkpoint) => checkpoint.cp_actionplans.length > 0);
    const allResponsiblePersons = _.flatMap(actionPlanCheckpoints, "cp_actionplans")
      .flatMap((actionPlan) => _.get(actionPlan, "responsible_person", []));
    const uniqueUsers = _.uniqBy(allResponsiblePersons, "user_id");

    updatedEndpointData["audit_ac_plan_resp_persons"] = uniqueUsers;
    updatedEndpointData["activity_id"] = JSON.parse(sessionStorage.getItem("auditData")).audit_pbd_id;

    if (filteredCheckpoints.length === cpt + apvd + rjd) {
      try {
        const response = await urlSocket.post("epadtprcs/updateendpoint", {
          auditInfo: { audit_pbd_id: updatedEndpointData.audit_pbd_id },
          userInfo: {
            _id: userData._id,
            encrypted_db_url: dbInfo.encrypted_db_url,
            company_id: userData.company_id,
          },
          endpointInfo: updatedEndpointData,
        });

        if (response.data.response_code === 500) {
          const reviewUser = _.filter(updatedEndpointData.audit_pbd_users, { audit_type: "2" });

          // if (clientInfo.allowFollowup && reviewUser.length === 0) {
          //   if (uniqueUsers.length > 0) {
          //     updatedEndpointData["location_permission_acpln"] = uniqueUsers;
          //     await crudActionPlanTask(updatedEndpointData, userData, dbInfo);
          //   } else {
          //     navigate("/usrenpdts");
          //   }
          // } else {
            navigate("/usrenpdts");
          // }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setShowWarning(true);
    }
  };




  const crudActionPlanTask = async (updatedEndpointData, userData, db_info) => {
    setLoading(true);

    try {
      const response = await urlSocket.post("task/task-cln", {
        auditInfo: {
          audit_pbd_id: updatedEndpointData.audit_pbd_id,
        },
        userInfo: {
          _id: userData._id,
          encrypted_db_url: db_info.encrypted_db_url,
          company_id: userData.company_id,
        },
        endpointInfo: updatedEndpointData,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Audit Published & Action Plan Task Created Successfully',
          text: 'Audit published successfully',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Go to Locations',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/usrenpdts");
          }
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: 'Failed to create Action Plan Task',
      });
    } finally {
      setLoading(false);
    }
  };



  // -------Signature




  const checkAuditeeSigned = () => {
    const indexOfAuditSigned = _.findIndex(endpointData.audit_signature, {
      audit_user_id: userData._id,
    });

    setIsAuditSigned(indexOfAuditSigned === -1 ? false : true);

    setBtnDisabled(false);
    setSignee(indexOfAuditSigned === -1 && endpointData.audit_signature.length === 0
      ? userData.fullname
      : "");
    setSigneeDesignation(indexOfAuditSigned === -1 && endpointData.audit_signature.length === 0
      ? userData.designation.length > 0 ? userData.designation[0]["desgn_name"] :""
      : "");
    setIsDisabled(indexOfAuditSigned === -1);
    setCustomDiv(true);
    setModal(true);
  };




  // Clear the canvas
  const clear = () => {
    canvas.current.clearCanvas();
    setSignUrl(null);
    setUpSignUrl(null);
    setIsSignEmpty(true);
    setSignValid(false);
  };


  const submit = () => {
    console.log('signeeddddd')
    if (signee === "" || signee === null || signeeDesignation === null) {
      setSignValid(true)
      setSignBoardMessage("Enter Name / Designation")
    }
    else {
      if (!isSignEmpty) {

        setBtnDisabled(true);
        setModal(false);

        canvas.current.exportImage("png").then(data => {
          setSignUrl(data)
          var ImageURL = data
          var block = ImageURL.split(";");
          var contentType = block[0].split(":")[1];
          var realData = block[1].split(",")[1];
          var blob = b64toBlob(realData, contentType);
          signUpload(blob);
        })
          .catch((error) => {
            console.log('error', error)
          })
      }
      else {
        setSignValid(true);
        setSignBoardMessage("No signature in board")
      }
    }
  }

  const b64toBlob = (b64Data, contentType, sliceSize) => {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }






  const deleteSignature = (id) => {
    var getIndex = _.findIndex(endpointData.audit_signature, { id: id })
    endpointData.audit_signature.splice(getIndex, 1)

    urlSocket.post('epadtprcs/updatesignature', {
      auditInfo: {
        audit_pbd_id: endpointData.audit_pbd_id
      },
      userInfo: {
        encrypted_db_url: dbInfo.encrypted_db_url,
        _id: userData._id,
        company_id: userData.company_id
      },
      endpointInfo: endpointData
    })
      .then((response) => {
        if (response.data.response_code === 500) {
          setSignee(null);
          setIsSignEmpty(true);
          setRefresh(true);
          setSigneeDesignation("")
        }
      })
  }

  const signUpload = async (imageInfo) => {
    const formData = new FormData();
    const uId = uuid();
    const authUser = JSON.parse(sessionStorage.getItem("authUser"))
    formData.append('folder', `${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`);
    formData.append('image', imageInfo, `${uId}sign.png`);


    try {
      const response = await urlSocket.post('storeImage/awswebupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const fileName = response.data.data[0].key.split('/').pop();
        updateSign(uId, fileName);
      }
    } catch (error) {
      console.error('Upload error', error);
    }
  };

  const updateSign = (uId, fileName) => {
    const signature = {
      id: String(uId),
      name: fileName,
      sign_by: signee ? signee : userData.fullname ? userData.fullname : userData.firstname ,
      designation: signeeDesignation || userData.designation.length >0 ?userData.designation[0]["desgn_name"] :"",
      preview: fileName,
      uploading: false,
      filetype: 'image/png',
      uploadingStatus: 'Uploaded',
      originalName: fileName,
      captured_on: new Date(),
      path: fileName,
      type: 'image/png',
      uri: fileName,
      audit_user_id: !isAuditSigned ? userData._id : '',
      review_user_id: '',
    };

    const updatedEndpointData = { ...endpointData, audit_signature: [...endpointData.audit_signature, signature] };
    urlSocket
      .post('epadtprcs/updatesignature', {
        auditInfo: {
          audit_pbd_id: updatedEndpointData.audit_pbd_id,
        },
        userInfo: {
          _id: userData._id,
          company_id: userData.company_id,
          encrypted_db_url: dbInfo.encrypted_db_url,
        },
        endpointInfo: updatedEndpointData,
      })
      .then((response) => {
        if (response.data.response_code === 500) {
          setSignee(null);
          setIsSignEmpty(true);
          setRefresh(true);
          setEndpointData(updatedEndpointData);
        }
      });
  };

  const deleteSign = () => {
    props.delSign(props.entityId, props.currentData);
  };


  const warningComponent = useMemo(() => {
    return showWarning ? showWarningAlert() : null;
  }, [showWarning]);
  
  const confirmComponent = useMemo(() => {
    return confirmBoth ? showConfirmAlert() : null;
  }, [confirmBoth]);







  if (dataloaded) {
    return (
      <React.Fragment>
        <div className="page-content" >
          <MetaTags>
            <title>Check points | Auditvista</title>
          </MetaTags>

          <Breadcrumbs
            title="Check points"
            // breadcrumbItem={'Check points'}
            isBackButtonEnable={true}
            gotoBack={() => { navigate('/usrenpdts') }}
          />

          <Container fluid>

            <Card className="mb-1">
              <CardBody>
                {
                  console.log(endpointData,'endpointData')
                }
                <Row>
                  <Col sm='4'>
                    <CardTitle>{endpointData?.audit_name}</CardTitle>
                    <CardText>{endpointData?.loc_name}{" / "}{endpointData?.code} </CardText>
                  </Col>
                  <Col sm='8' className="d-flex align-items-start justify-content-end">
                    <div className="button-items">
                      <div className="btn-group " role="group" aria-label="Basic radio toggle button group">
                        <Button className="btn-sm" color="dark" outline onClick={() => { setFilterStatus("all"); filterCheckpoints("all", checkpoints) }}>
                          Total check points{" - "}{totalCp}
                        </Button>
                        <Button className="btn-sm" color="secondary" outline onClick={() => { setFilterStatus("0"); filterCheckpoints("0", checkpoints) }}>
                          Not started{" - "}{ns}
                        </Button>
                        <Button className="btn-sm" color="warning" outline onClick={() => { setFilterStatus("1"); filterCheckpoints("1", checkpoints) }}>
                          In progress{" - "}{ip}
                        </Button>
                        <Button className="btn-sm" color="success" outline onClick={() => { setFilterStatus("2"); filterCheckpoints("2", checkpoints) }}>
                          Completed{" - "}{cpt}
                        </Button>
                        <Button className="btn-sm" color="primary" outline onClick={() => { setFilterStatus("rwd"); filterCheckpoints("rwd", checkpoints) }}>
                          Reviewed{" - "}{rwd}
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <div className="d-xl-flex">
              <div className="w-100">
                <div className="d-md-flex">

                  {/* 2nd left bar  */}
                  <Card className="w-50 me-md-1  pb-3 ">
                    <CardBody style={{ maxHeight: height - 250 }} className="overflow-auto">

                      {filteredData?.length > 0 ?
                        <>
                          {
                            filteredData.map((item, i) => {
                                item.cp_status === '1' ? '#f1b44c' :
                                  item.cp_status === '2' ? '#34c38f' : '#50a5f1'
                              return (
                                <div className="card shadow-none mb-1" key={"chkpt" + String(i)}>
                                  <div style={{
                                    borderLeft: item.document_type === "2" ? item.cp_review_status !== null ? "5px solid #556ee6" : item.cp_status === "0" ? "5px solid #74788d" : item.cp_status === "1" ? "5px solid #f1b44c" : item.cp_status === "2" ? "5px solid #34c38f" : "5px solid #50a5f1" : "",
                                    borderRight: idx === i ? "1px solid #556ee6" : "1px solid #74788d2e",
                                    borderTop: idx === i ? "1px solid #556ee6" : "1px solid #74788d2e",
                                    borderBottom: idx === i ? "1px solid #556ee6" : "1px solid #74788d2e",
                                  }}>
                                    {
                                      item.document_type === "2" ?
                                        <Link to="#" className="text-body" onClick={() => { loadSelectedCheckpoint(item, i) }}>
                                          <div className="p-2">
                                            <div className="d-flex">
                                              <div className="overflow-hidden me-auto">
                                                <h5 className="font-size-13  mb-1">
                                                  <span className=''>{item.checkpoint}</span>
                                                </h5>

                                                {
                                                  endpointData?.audit_status_id === "2" || endpointData?.audit_status_id === "5" || endpointData?.audit_status_id === "6" || endpointData?.audit_status_id === "7" || endpointData?.audit_status_id === "1" || endpointData?.audit_status_id === "0" ?

                                                    <span
                                                      className="badge badge-soft font-size-10"
                                                      style={{ backgroundColor: statusColor[Number(item.cp_status)] }}
                                                    >
                                                      {statusText[Number(item.cp_status)]}</span> : null
                                                }
                                              </div>
                                            </div>
                                          </div>
                                        </Link>
                                        :
                                        <div style={{ backgroundColor: item.parent_id === null ? '#525252' : "#808080" }} className="p-2">
                                          <div className="d-flex">
                                            <div className="overflow-hidden me-auto">
                                              <h5 className="font-size-13  mb-1">
                                                <span style={{ color: '#fffffff5' }}>{item.checkpoint}</span>
                                              </h5>
                                            </div>
                                          </div>
                                        </div>
                                    }

                                  </div>
                                </div>
                              )
                            })
                          }
                        </>
                        :
                        <div className="text-center mt-3">
                          <p>No checkpoint available</p>
                        </div>
                      }
                    </CardBody>
                  </Card>


                  <Card className="w-100 pb-3 me-md-1">
                    <CardBody style={{ maxHeight: height - 250 }} className="overflow-auto">
                      {
                        showOption && selectedCheckpoint.cp_status !== "4" && selectedCheckpoint.cp_status !== "5" ?
                          <div className='d-flex flex-column bg-white' >

                            <div className="my-1">
                              <span
                                className={selectedCheckpoint.cp_review_status !== null ? "badge badge-soft-primary me-2" : selectedCheckpoint.cp_status === "0" ? "badge badge-soft-secondary me-2" : selectedCheckpoint.cp_status === "1" ? "badge badge-soft-warning me-2" : selectedCheckpoint.cp_status === "2" ? "badge badge-soft-success me-2" : "badge badge-soft-info me-2"}
                              >{selectedCheckpoint.cp_review_status !== null ? "Reviewed" : selectedCheckpoint.cp_status === "0" ? "Not started" : selectedCheckpoint.cp_status === "1" ? "In progress" : selectedCheckpoint.cp_status === "2" ? "Completed" : ""}</span>
                              {
                                endpointData.status === "4" ?
                                  <span
                                    className={selectedCheckpoint.cp_review_status === "0" ? "badge badge-soft-danger" : "badge badge-soft-success"}
                                  >
                                    {selectedCheckpoint.cp_review_status === "0" ? "Rejected" : "Accepted"}</span> : null
                              }

                              <span className={`badge badge-soft-${selectedOption?.compliance?.color} mx-2`} >
                                {selectedOption?.compliance?.name}
                              </span>
                              {
                                endpointData.status === "4" ?
                                  <span
                                    className={selectedCheckpoint.cp_review_status === "0" ? "badge badge-soft-danger" : "badge badge-soft-success"}
                                  >
                                    {selectedCheckpoint.cp_review_status === "0" ? "Rejected" : "Accepted"}</span> : null
                              }
                            </div>

                            {/* <div className="my-1">
                              <span
                                className={selectedCheckpoint.cp_review_status !== null ? "badge badge-soft-primary me-2" : selectedCheckpoint.cp_status === "0" ? "badge badge-soft-secondary me-2" : selectedCheckpoint.cp_status === "1" ? "badge badge-soft-warning me-2" : selectedCheckpoint.cp_status === "2" ? "badge badge-soft-success me-2" : "badge badge-soft-info me-2"}
                              >{selectedCheckpoint.cp_review_status !== null ? "Reviewed" : selectedCheckpoint.cp_status === "0" ? "Not started" : selectedCheckpoint.cp_status === "1" ? "In progress" : selectedCheckpoint.cp_status === "2" ? "Completed" : ""}
                              </span>
                              {
                                endpointData.status === "4" ?
                                  <span
                                    className={selectedCheckpoint.cp_review_status === "0" ? "badge badge-soft-danger" : "badge badge-soft-success"}
                                  >
                                    {selectedCheckpoint.cp_review_status === "0" ? "Rejected" : "Accepted"}
                                    </span> : null
                              }
                            </div> */}

                              


                            <CardTitle className="h4">{selectedCheckpoint.checkpoint}</CardTitle>
                              {
                                console.log(selectedCheckpoint,'selectedCheckpoint')
                              }

                            <div className='my-2'>
                              {/* { */}
                                <OptionComponent
                                  options={selectedCheckpoint.rule}
                                  index={idx}
                                  checkpoint={selectedCheckpoint}
                                  imagePreviewUrl={imagePreviewUrl}
                                  imageToken={imageToken}
                                  selectionoption={(data, options) => { setSelectedOption(data); setOptionSelected(true); updateCheckpoint(options, selectedCheckpoint) }}
                                  updateimages={(data) => { updateCheckpointImages(data, selectedCheckpoint) }}
                                  updatedocuments={(data) => { updateCheckpointDocuments(data, selectedCheckpoint) }}
                                  audit_status={endpointData.audit_status_id}
                                  epsInfo={endpointInfo}

                                />
                              {/* } */}
                            </div>
                            {
                              optionSelected
                                //  selectedCheckpoint.cp_compliance.id !=="4" 
                                ?
                                <>
                                  <Nav tabs>
                                    {
                                      selectedOption.image_info?.min > 0 && selectedOption.image_info?.max > 0 &&
                                      <NavItem>
                                        <NavLink
                                          style={{ cursor: "pointer" }}
                                          className={classnames({
                                            active: activeTab === "1",
                                          })}
                                          onClick={() => {
                                            toggle("1")
                                          }}
                                        >
                                          <div>
                                            Images
                                          </div>
                                          {
                                            selectedCheckpoint.cp_noof_images !== 0 ?
                                              <span className={selectedCheckpoint.cp_attach_images === undefined
                                                ? "badge badge-soft-danger"
                                                : selectedCheckpoint.cp_attach_images.length
                                                  >=
                                                  selectedCheckpoint.cp_noof_images
                                                  ? "badge badge-soft-success"
                                                  : "badge badge-soft-danger"}
                                              >
                                                {/* {selectedCheckpoint.cp_attach_images === undefined
                                              ? '0 / ' + selectedCheckpoint.cp_noof_images
                                              : (selectedCheckpoint.cp_attach_images.length  >= selectedCheckpoint.cp_noof_images) ? selectedCheckpoint.cp_noof_images : selectedCheckpoint.cp_attach_images.length  +
                                              ' / ' +
                                              selectedCheckpoint.cp_noof_images
                                              }  */}

                                                {
                                                  selectedCheckpoint.cp_attach_images === undefined
                                                    ? `0 / ${selectedCheckpoint.cp_noof_images}`
                                                    : `${Math.min(selectedCheckpoint.cp_attach_images.length, selectedCheckpoint.cp_noof_images)} / ${selectedCheckpoint.cp_noof_images}`
                                                }

                                                required </span> : <span>&nbsp;</span>
                                          }

                                        </NavLink>
                                      </NavItem>
                                    }
                                    {
                                      selectedOption.video_info?.min> 0 && selectedOption.video_info?.max > 0 &&
                                      <NavItem>
                                        <NavLink
                                          style={{ cursor: "pointer" }}
                                          className={classnames({
                                            active: activeTab === "6",
                                          })}
                                          onClick={() => {
                                            toggle("6")
                                          }}
                                        >
                                          <div>
                                            Videos
                                          </div>
                                          {
                                            console.log(selectedCheckpoint, selectedOption, 'selectedCheckpoint')
                                          }
                                          {
                                            selectedCheckpoint.cp_noof_videos !== 0 ?
                                              <span className={selectedCheckpoint.cp_attach_videos === undefined
                                                ? "badge badge-soft-danger"
                                                : selectedCheckpoint.cp_attach_videos.length >=
                                                  selectedCheckpoint.cp_noof_videos
                                                  ? "badge badge-soft-success"
                                                  : "badge badge-soft-danger"}
                                              >
                                                {/* {selectedCheckpoint.cp_attach_videos === undefined
                                              ? '0 / ' + selectedCheckpoint.cp_noof_videos
                                              : selectedCheckpoint.cp_attach_videos.length +
                                              ' / ' +
                                              selectedCheckpoint.cp_noof_videos}  */}

                                                {
                                                  selectedCheckpoint.cp_attach_videos === undefined
                                                    ? `0 / ${selectedCheckpoint.cp_noof_videos}`
                                                    : `${Math.min(selectedCheckpoint.cp_attach_videos.length, selectedCheckpoint.cp_noof_videos)} / ${selectedCheckpoint.cp_noof_videos}`
                                                }

                                                required </span> : <span>&nbsp;</span>
                                          }

                                        </NavLink>
                                      </NavItem>
                                    }

                                    {
                                      selectedOption?.document_info?.length > 0 &&
                                      <NavItem>
                                        <NavLink
                                          style={{ cursor: "pointer" }}
                                          className={classnames({
                                            active: activeTab === "2",
                                          })}
                                          onClick={() => {
                                            toggle("2")
                                          }}
                                        >
                                          <div>
                                            Documents
                                          </div>
                                          {
                                            console.log(selectedOption, 'selectedOption', selectedCheckpoint)
                                          }
                                          {
                                            selectedCheckpoint.cp_noof_documents !== 0 ?
                                              <span className={
                                                selectedCheckpoint.cp_documents.length >=
                                                  selectedCheckpoint.cp_noof_documents
                                                  ? "badge badge-soft-success"
                                                  : "badge badge-soft-danger"}>
                                                {/* {selectedCheckpoint.cp_documents === undefined
                                                ? '0 / ' + selectedCheckpoint.cp_noof_documents
                                                : selectedCheckpoint.cp_documents.length +
                                                ' / ' +
                                                selectedCheckpoint.cp_noof_documents}  */}

                                                {
                                                  selectedCheckpoint.cp_documents === undefined
                                                    ? `0 / ${selectedCheckpoint.cp_noof_documents}`
                                                    : `${Math.min(selectedCheckpoint.cp_documents.length, selectedCheckpoint.cp_noof_documents)} / ${selectedCheckpoint.cp_noof_documents}`
                                                }

                                                required </span>
                                              : <span>&nbsp;</span>
                                          }
                                        </NavLink>
                                      </NavItem>
                                    }

                                    <NavItem>
                                      <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                          active: activeTab === "4",
                                        })}
                                        onClick={() => {
                                          toggle("4")
                                        }}
                                      >
                                        <div>
                                          Comments
                                        </div>
                                        <span>&nbsp;</span>
                                      </NavLink>
                                    </NavItem>
                                    <NavItem>
                                      <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                          active: activeTab === "3",
                                        })}
                                        onClick={() => {
                                          toggle("3")
                                        }}
                                      >
                                        <div>
                                          CAPA
                                        </div>
                                        {
                                          console.log(endpointInfo,'endpointInfo')
                                        }
                                        {
                                     endpointInfo.audit_pbd_users?.create_acplan  &&  selectedOption.capa_info?.mandatory ? <span
                                            className={getactionplanCount() > 0 ? "badge badge-soft-success" : "badge badge-soft-danger"}
                                          >Required</span> : <span>&nbsp;</span>
                                        }
                                        <span>&nbsp;</span>
                                      </NavLink>
                                    </NavItem>
                                    <NavItem>
                                      <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                          active: activeTab === "5",
                                        })}
                                        onClick={() => {
                                          toggle("5")
                                        }}
                                      >
                                        <div>
                                          Guideline
                                        </div>
                                        <span>&nbsp;</span>
                                      </NavLink>
                                    </NavItem>
                                  </Nav>

                                  <TabContent activeTab={activeTab} className="p-3 text-muted">
                                    <TabPane tabId="1">
                                      <Row>
                                        <Col sm="12">
                                          <CRUD_Images
                                            selected_option={selectedOption}
                                            selectedCheckpoint={selectedCheckpoint}
                                            saveCheckpoint={(data) => saveCheckpoint(data)}
                                            imagePreviewUrl={imagePreviewUrl}
                                            audit_status={endpointData.audit_status_id}
                                            latitude={latitude}
                                            longitude={longitude}
                                            endpointData={endpointData}
                                            folderPath={`${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`}
                                            // folderName={}
                                         />
                                        </Col>
                                      </Row>
                                    </TabPane>
                                    <TabPane tabId="6">
                                      <Row>
                                        <Col sm="12">
                                          <CRUD_Videos
                                            selected_option={selectedOption}
                                            selectedCheckpoint={selectedCheckpoint}
                                            saveCheckpoint={(data) => saveCheckpoint(data)}
                                            imagePreviewUrl={imagePreviewUrl}
                                            audit_status={endpointData.audit_status_id}
                                            latitude={latitude}
                                            longitude={longitude}
                                            endpointData={endpointData}
                                             folderPath={`${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`}
                                          />
                                        </Col>
                                      </Row>
                                    </TabPane>


                                    <TabPane tabId="2">

                                      <Row>
                                        <Col sm="12">
                                          <CRUD_Documents
                                            selected_option={selectedOption}
                                            selectedCheckpoint={selectedCheckpoint}
                                            saveCheckpoint={(data) => saveCheckpoint(data)}
                                            imagePreviewUrl={imagePreviewUrl}
                                            audit_status={endpointData.audit_status_id}
                                            endpointData={endpointData}
                                             folderPath={`${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`}
                                          />
                                        </Col>
                                      </Row>
                                    </TabPane>
                                    <TabPane tabId="3">
                                      <Row>
                                        <Col sm="12">


                                          {
                                            selectedCheckpoint.cp_actionplans.map((apln, idx) => {
                                              return (
                                                <CAPA
                                                  key={"capa" + String(idx)}
                                                  index={idx}
                                                  data={apln}
                                                  onsave={(data) => { addapln(selectedCheckpoint, data, idx) }}
                                                  onadd={() => { addCAPA(selectedCheckpoint) }}
                                                  saveCheckpoint={(data) => saveCheckpoint(data)}
                                                  getDeletediles={(data) => getDeletediles(data)}
                                                  selectedCheckpoint={selectedCheckpoint}
                                                  audit_status={endpointData.status}
                                                  location_info={endpointData}
                                                  priority={authUser.config_data.acp_priority}
                                                  folderPath={`${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`}
                                                 imagePreviewUrl={imagePreviewUrl}
                                                 epsInfo={endpointInfo}
                                                  />
                                              )
                                            })
                                          }
                                          {(
                                            (selectedCheckpoint.cp_actionplans.every(item => item.actionplan !== "") && !isInputFieldOpen) || endpointData.status === "3" || endpointData.status === "4") && (
                                              <div className="mb-2">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => { addCAPA(selectedCheckpoint) }} >
                                                  Add
                                                </button>
                                              </div>
                                            )}
                                        </Col>

                                      </Row>
                                    </TabPane>
                                    <TabPane tabId="4">
                                      <Row>
                                        <Col sm="12">
                                          <Observation
                                            selectedCheckpoint={selectedCheckpoint}
                                            saveCheckpoint={(data) => saveCheckpoint(data)}
                                            audit_status={endpointData.audit_status_id}
                                          />
                                        </Col>
                                      </Row>
                                    </TabPane>
                                    <TabPane tabId="5">
                                      <Row>
                                        <Col sm="12">
                                          <label>Guideline</label>
                                          <div>
                                            {
                                              selectedCheckpoint.guideline
                                            }
                                            <div >
                                              <Row>
                                                {
                                                  selectedCheckpoint.guideline_image.map((item, index) => {
                                                    return (
                                                      <Col sm={3} key={index}>
                                                        <div style={{ width: "100%", height: "180px", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
                                                          <img
                                                            src={authUser.client_info[0]["base_url"]+item.key}
                                                            className="img-fluid"
                                                            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                                                            alt={`Guideline ${index + 1}`}
                                                          />
                                                        </div>
                                                      </Col>
                                                    );
                                                  })
                                                }
                                              </Row>
                                            </div>



                                          </div>
                                        </Col>
                                      </Row>
                                    </TabPane>
                                  </TabContent>
                                </> : null
                            }
                          </div> :
                          showOption ?
                            <div className='d-flex flex-column bg-white' >
                              <div className="mb-2">
                                <label className={selectedCheckpoint.cp_review_status !== null ? "badge badge-soft-primary font-size-10 me-2" : selectedCheckpoint.cp_status === "0" ? "badge badge-soft-secondary font-size-10 me-2" : selectedCheckpoint.cp_status === "1" ? "badge badge-soft-warning font-size-10 me-2" : "badge badge-soft-success font-size-10 me-2"}>{selectedCheckpoint.cp_review_status !== null ? "Reviewed" : selectedCheckpoint.cp_status === "0" ? "Not started" : selectedCheckpoint.cp_status === "1" ? "In progress" : "Completed"}</label>
                                <label className={selectedCheckpoint.cp_is_compliance ? "badge badge-soft-danger font-size-10" : "badge badge-soft-success font-size-10"}>{selectedCheckpoint.cp_is_compliance ? "Compliance" : "Non-Compliance"}</label>
                              </div>
                              <div className="mb-1">
                                <span className="font-size-13">{selectedCheckpoint.checkpoint}</span>
                              </div>

                              {
                                selectedCheckpoint.checkpoint_type_id === "1" || selectedCheckpoint.checkpoint_type_id === "2" ?
                                  <ReviewOPType options={selectedCheckpoint.checkpoint_options} />
                                  : null
                              }

                              {
                                selectedCheckpoint.cp_attach_images.length !== 0 ?
                                  <div className="mt-3 mb-4">
                                    <label>Images Attached</label>
                                    <PreviewImage
                                      imagePreviewUrl={imagePreviewUrl}
                                      images={selectedCheckpoint.cp_attach_images}
                                      folderPath={`${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`}
                                    />
                                  </div> : null
                              }


                              {
                                selectedCheckpoint.cp_documents.length !== 0 ?
                                  <div className="my-4">
                                    <label>Documents Attached</label>
                                    <PreviewDocuments
                                      imagePreviewUrl={imagePreviewUrl}
                                      images={selectedCheckpoint.cp_documents}
                                      folderPath={`${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`}

                                    />
                                  </div> : null

                              }

                              {
                                selectedCheckpoint.cp_observation !== null ?
                                  <div className="my-4">
                                    <label>Observation</label>
                                    <PreviewObservation
                                      observation={selectedCheckpoint.cp_observation}
                                      folderPath={`${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`}

                                    />
                                  </div> : null
                              }

                              {
                                selectedCheckpoint.cp_actionplans.length !== 0 ?
                                  <div className="my-4">
                                    <label>CAPA</label>
                                    <PreviewCAPA
                                      actionplans={selectedCheckpoint.cp_actionplans}
                                      folderPath={`${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`}

                                    />
                                  </div> : null
                              }
                            </div> :
                            <div className='d-flex p-3 bg-white justify-content-center align-item-center' >
                              <p>Select check point to audit</p>
                            </div>
                      }
                    </CardBody>
                  </Card>



                  <Card className="filemanager-sidebar">
                    <CardHeader>
                      {endpointData?.audit_status_id !== "3" && endpointData?.audit_status_id !== "4" &&
                        <div>
                          <button className="btn btn-sm btn-success mb-2 w-100" onClick={() => confirmSubmit()} id="custom-padding-width-alert" >
                            Submit Audit
                          </button>
                        </div>
                      }
                    </CardHeader>
                    <CardBody style={{ height: height - 250 }} className="overflow-auto">

                      {endpointData?.audit_signature?.length !== 0 ? (
                        <div>
                          {endpointData?.audit_signature?.map((item, i) => {
                            return (
                              <Card
                                className="mt-1 mb-2 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                key={i + "-signfile"}
                              >
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                  <div className="p-2 col-10">
                                    <label className="mb-1 font-size-11">
                                      {item.sign_by}
                                      <br />
                                      {item.designation}
                                    </label>
                                    <img height="80" src={(imagePreviewUrl + `${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`) + item.name} alt="Signature" />
                                  </div>
                                  {endpointData?.audit_status_id !== "3" &&
                                    endpointData?.audit_status_id !== "4" ? (
                                    <div className="col-2 text-end me-2" style={{ lineHeight: 1.3 }}>
                                      <Link to="#" onClick={() => deleteSignature(item.id)}>
                                        <i className="mdi mdi-close-circle-outline font-size-20 text-danger" />
                                      </Link>
                                    </div>
                                  ) : null}
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      ) : null}

                      {endpointData?.audit_status_id !== "3" && endpointData?.audit_status_id !== "4" ? (
                        <Col className="mb-2">
                          <Label>Signature</Label>
                          <div>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                checkAuditeeSigned();
                              }}
                              id="custom-padding-width-alert"
                            >
                              Add signature
                            </button>
                          </div>
                        </Col>
                      ) : null}

                      {endpointData?.audit_status_id === "3" || endpointData?.audit_status_id === "4" ? (
                        <div>
                          <label>Audit Started on</label>
                          <p>{moment(endpointData.audit_started_on).format("DD/MM/YYYY")}</p>
                          <label>Audit Completed on</label>
                          <p>{moment(endpointData.audit_completed_on).format("DD/MM/YYYY")}</p>
                          <label>Audit Submitted on</label>
                          <p>{moment(endpointData.audit_submitted_on).format("DD/MM/YYYY")}</p>
                        </div>
                      ) : null}

                    </CardBody>


                  </Card>

                </div>
              </div>
            </div>

            <Modal
              isOpen={modal}
              className={props.className}
            >
              <ModalHeader toggle={modaltoggle} tag="h4">
                Signature
              </ModalHeader>
              <ModalBody>
                <AvForm className="form-horizontal"
                >
                  <div className="mb-3" >
                    <AvField
                      name="signee"
                      value={endpointData?.audit_signature?.length === 0 ? userData.firstname ? userData.firstname : userData.fullname : ''}
                      onChange={(e) => setSignee(e.target.value)}
                      className="form-control"
                      placeholder="Enter signee name"
                      type="input"
                      // disabled={isDisabled}
                      required
                    />
                  </div>
                  <div className="mb-3" >
                    <AvField
                      name="designation"
                      value={endpointData?.audit_signature?.length === 0 ? userData.designation.length >0 ? userData.designation[0]["desgn_name"] :"" : ""}
                      onChange={(e) => setSigneeDesignation(e.target.value)}
                      className="form-control"
                      placeholder="Enter designation"
                      type="input"
                      required
                    />
                  </div>
                  <ReactSketchCanvas
                    ref={canvas}
                    style={styles}
                    strokeColor="black"
                    width="600"
                    height="400"
                    strokeWidth={4}
                    onStroke={() => { setIsSignEmpty(false); setSignValid(false) }}
                  />

                  {
                    signValid ? <div className="m-2"><label className="text-danger">{signBoardMessage}</label></div> : null
                  }

                  <div className="my-2 d-flex gap-1 align-items-center justify-content-end">
                    <button className="btn btn-sm btn-outline-success" disabled={btnDisabled} onClick={() => { submit() }}>Submit</button>
                    <button className="btn btn-sm btn-outline-info" onClick={() => clear()}>Clear</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setModal(false)}>Cancel</button>
                  </div>
                </AvForm>
              </ModalBody>
            </Modal>

            {/* {
              showWarning && showWarningAlert()
            }
            {
              confirmBoth && showConfirmAlert()
            } */}

{warningComponent}
{confirmComponent}

          </Container>
        </div>
      </React.Fragment>
    )

  }
  else {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div>Loading...</div>
        <Spinner color="primary" />
      </div>
    );


  }


}

export default Checkpoints
