import urlSocket from 'helpers/urlSocket'
import React, { useEffect,useRef,useState } from 'react'
import Breadcrumb from 'components/Common/Breadcrumb'
import { useNavigate } from 'react-router-dom'
// import { Card, Container } from 'reactstrap'
import ReviewOPType from './Components/review_optype'
import PreviewImage from './Components/preview_images'
import PreviewVideo from './Components/preview_videos'
import PreviewDocuments from './Components/preview_documents'
import PreviewObservation from './Components/preview_observation'
import PreviewCAPA from './Components/preview_CAPA'
import uuid from 'react-uuid'
import {
  Row, Col, FormGroup, Button, Card, CardBody, Container, Alert, Label, Form, Progress, Badge,
  Input,
  CardText,
  CardTitle,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal, ModalBody, ModalHeader
} from "reactstrap";
import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
  toggleExpandedForAll,
  defaultGetNodeKey,
  getTreeFromFlatData,
  getNodeAtPath,
  changeNodeAtPath,
  getFlatDataFromTree,
  walk,
  map, find
} from 'react-sortable-tree/dist/index.cjs.js';
import { Link } from "react-router-dom"
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import MetaTags from 'react-meta-tags';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import Swal from 'sweetalert2'
import _ from 'lodash'
import CAPA from './Components/capa'


const Reviewchecklist = (props) => {
    const [endpointData,setEndpointData] = useState(JSON.parse(sessionStorage.getItem("endpointData")))
    const [endpointInfo,setEndpointInfo] = useState(JSON.parse(sessionStorage.getItem("endpointData")))
    const [authUser,setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
    const [checkPoints,setcheckPoints] = useState([])
    const [filteredData,setfilteredData] = useState([])
    const [nr,setnr] = useState(0)
    const [rwd,setrwd] = useState(0)
    const [rtk,setrtk] = useState(0)
    const [apvd,setapvd] = useState(0)
    const [rjd,setrjd] = useState(0)
    const [rvd,setrvd] = useState(0)
    const [filterStatus,setfilterStatus] = useState('all')
    const [showOption,setshowOption] = useState(false)
    const [dataLoaded,setdataLoaded] = useState(false)
    const [height,setheight] = useState(window.innerHeight)
    const [imagePreviewUrl,setimagePreviewUrl] = useState(JSON.parse(sessionStorage.getItem("authUser")).client_info[0]["base_url"] )
    const navigate = useNavigate()
    const [selectedValue, setSelectedValue] = useState("");
    const [reason, setreason] = useState("");
    const [modal, setModal] = useState(false);
    const [selectedItem, setselectedItem] = useState(null);
    const [signee, setsignee] = useState(JSON.parse(sessionStorage.getItem("authUser")).user_data.fullname);
    const [signeeDesignation, setsigneeDesignation] = useState(null);
    const canvas = useRef(null)
    const avForm = useRef(null)
    const [issign_empty,setissign_empty]= useState(true)
    const [signmodal,setsignmodal]= useState(false)
    const [isReviewerSigned,setisReviewerSigned]= useState(false)
    const [showTxtMessage,setshowTxtMessage] = useState(false)
    const [remarks,setremarks] = useState("")
    const [isDisabled,setisDisabled] = useState(false)
    const [sign_valid,setsign_valid] = useState(false)
    const [signboard_message,setsignboard_message] = useState("")
    const [selectedCheckpoint,setSelectedCheckpoint] = useState(null)


    const styles = {
        border: '0.0625rem solid #9c9c9c',
        borderRadius: '0.25rem',
    };


    useEffect(() => {
  if (canvas.current) {
    console.log("Canvas is ready", canvas.current);
  }
  else{
    console.log("not readyyy")
  }
}, []);



    useEffect(() => {

        const loadData = async() => {
            await loadCheckpoints()
            await retriveEpsInfo()
        }
        loadData()

    }, [])


      const retriveEpsInfo = async () => {

    const authUser = JSON.parse(sessionStorage.getItem('authUser'))
    const epsInfo = JSON.parse(sessionStorage.getItem("endpointData"))
    try {
      const responseData = await urlSocket.post('epadtprcs/retriveepsinfo', {
        encrypted_db_url: authUser.db_info.encrypted_db_url,
        location_id: epsInfo._id,
      })
      console.log(responseData,'responseData')
      if (responseData.status === 200) {

        setEndpointData(responseData.data.data)
        var dataInfo = responseData.data.data
        var userInfo = _.filter(responseData.data.data.audit_pbd_users, { user_id: authUser.user_data._id })
        console.log(userInfo,'userInfo')
        if (userInfo.length > 0) {
          dataInfo["audit_pbd_users"] = userInfo[0]
          setEndpointInfo(dataInfo)
        }
          setdataLoaded(true)
      }


    } catch (error) {
      console.log(error,'error')
    }

  }






    const loadCheckpoints=async()=>{

        try {
            const responseData = await urlSocket.post("epadtprcs/getepcheckpoints",{
                auditInfo :{
                     audit_pbd_id: endpointData.audit_pbd_id
                },
                userInfo: {
                    _id: authUser._id,
                    encrypted_db_url: authUser.db_info.encrypted_db_url
                },
                endpointInfo: endpointData
            })
            console.log(responseData,'responseData')

            if(responseData.data.response_code === 500){
                var flatData = await convertFlatDataToTreeData(responseData.data.data)
                var checkpoints = _.filter(responseData.data.data, { document_type: "2" })
                setcheckPoints(flatData)
                setnr(_.filter(checkpoints, { cp_review_status: null }).length)
                setrwd(_.filter(checkpoints, item => {
                                return item.cp_review_status !== null
                              }).length)
                getCheckpointStatus()
                reviewCheckpointStatus()
                setfilterStatus("all")
                // filterCheckpoints(filterStatus)
            }

            
        } catch (error) {
                console.log(error,'error')
        }
    }


    useEffect(() => {
        if (filterStatus === "all") {
            setfilteredData(checkPoints)
            setshowOption(false)
        }
        else{
            if (filterStatus === "nr") {
                setfilteredData(_.filter(checkPoints, item => {
                    return item.cp_review_status === null && item.document_type == "2"
                }))
                setshowOption(false)
            }
            else {
                setfilteredData(_.filter(checkPoints, item => {
                    return item.cp_review_status !== null && item.document_type == "2"
                }))
                setshowOption(false)
            }
          }
          getCheckpointStatus()
          reviewCheckpointStatus()
    }, [checkPoints, filterStatus])

    const signmodaltoggle = () => {
        setsignmodal(prev => !prev); // toggle value
    };


    const  filterCheckpoints=(filterStatus)=> {
        if (filterStatus === "all") {
            setfilteredData(checkPoints)
            setshowOption(false)
        }
        else
          if (filterStatus === "nr") {
           setfilteredData(_.filter(checkPoints, item => {
                       return item.cp_review_status === null && item.document_type =="2"
                     }))
            setshowOption(false)
          }
          else {
             setfilteredData(_.filter(checkPoints, item => {
                         return item.cp_review_status !== null && item.document_type =="2"
                       }))
            setshowOption(false)
          }
      }



    const getCheckpointStatus=()=>{
        setnr(_.filter(checkPoints, { cp_review_status: null, document_type: "2" }).length)
        setrwd(_.filter(checkPoints, item => {
            return item.cp_review_status !== null && item.document_type == "2"
        }).length)
    }

  const reviewCheckpointStatus = () => {
    var retake = _.filter(checkPoints, { cp_review_status: "-2" , document_type :"2" }).length
    var accept =_.filter(checkPoints, { cp_review_status: "1", document_type :"2" }).length
    var reject =_.filter(checkPoints, { cp_review_status: "0", document_type :"2" }).length
    setrtk(retake)
    setapvd(accept)
    setrjd(reject)
    console.log(retake,accept,reject)
    setrvd(retake+accept+reject)

  }






     const convertFlatDataToTreeData =async (flatData) => {
        if (flatData !== undefined) {
          var parent_data = flatData.filter(item2 => item2.parent_id === null);
          parent_data.sort(function (a, b) {
            return a.document_id - b.document_id;
          });
          const treeData = parent_data.map((parentItem) => {
            parentItem.children = getChildren(parentItem.document_id, flatData);
            return parentItem;
          });
      
          console.log(treeData,'treedata')
         var converted_treeDataToFlat =await treeDataToFlat(treeData)
        var removed_node= _.map(converted_treeDataToFlat, "node")
         console.log(converted_treeDataToFlat,'converted_treeDataToFlat',removed_node)
         return removed_node
      
        }
      }

      const  treeDataToFlat = (treeData) => {
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
    

    const submitReviewAll = (review_status) => {
        var checkpointInfo = _.cloneDeep(checkPoints)
        checkpointInfo.forEach(item => {
            if (review_status === "1") {
                item.cp_status = "5";
                item.cp_review_status = "1"
            }

            if (review_status === "0") {
                item.cp_status = "4";
                item.cp_review_status = "0"
            }

            if (review_status === "-2") {
                item.cp_status = "3";
                item.cp_review_status = "-2";
            }
            item.cp_reviewed_on = new Date()
            item.updated_on = new Date();
            item.cp_review_by_id = authUser.user_data._id
        })

        console.log(checkpointInfo, 'checkpointInfo');
        setcheckPoints(checkpointInfo)
        var rtk = _.filter(checkpointInfo, { cp_review_status: "-2" }).length
        var apvd = _.filter(checkpointInfo, { cp_review_status: "1" }).length
        var rjd = _.filter(checkpointInfo, { cp_review_status: "0" }).length

        setrtk(rtk)
        setapvd(apvd)
        setrjd(rjd)
        setrvd(rtk + apvd + rjd)
        updateEndpointData()
        updateReviewAll(checkpointInfo)

    }



 const updateEndpointData = () => {
    let endpointInfo = _.cloneDeep(endpointData)
    let updatedStatus = endpointData.audit_status_id;
    let updatedAuditCpStatus = endpointData.audit_cp_status;
    let updatedReviewStatus = endpointData.review_status;
    console.log(checkPoints.length,'checkPoints',rvd)
    if (checkPoints.length === rvd) {
        if (updatedStatus === "4") {
            updatedAuditCpStatus = "Reviewed Completed";
            updatedReviewStatus = "1";
        }
    } else {
        if (updatedStatus === "3" || updatedStatus === "4") {
            updatedAuditCpStatus = "Review in progress";
            updatedStatus = "4";
            updatedReviewStatus = "1";
        }
    }

    console.log(updatedStatus,'updatedStatus')

    endpointInfo={
        ...endpointInfo,
         audit_cp_status: updatedAuditCpStatus,
         audit_status_id: updatedStatus,
         audit_status_name: updatedAuditCpStatus,
         review_status: updatedReviewStatus,
         
    }
    setEndpointData(endpointInfo)
}

  const updateReviewAll = (checkpointInfo) => {
    console.log(filterStatus,'filterStatus');
    try {

      urlSocket.post("epadtprcs/updateAllCheckpoints", {
        userInfo: {
          _id: authUser.user_data._id,
        //   company_id: this.state.userData.company_id,
          encrypted_db_url: authUser.db_info.encrypted_db_url
        },
        endpointInfo: endpointData,
        checkpoints:checkpointInfo ? checkpointInfo : checkPoints,
        auditInfo: {
          audit_pbd_id: endpointData.audit_pbd_id
        },
      })
        .then(response => {
          console.log(response,'response')
          if (response.data.response_code === 500) {
            var responseCheckpoints = response.data.data
            setcheckPoints(responseCheckpoints)
            getCheckpointStatus()
            reviewCheckpointStatus()
          }
        })

    } catch (error) {
      console.log("catch error", error)
    }
  }


    const updateCheckpoint=(item)=> {
      try {
          urlSocket.post("epadtprcs/reviewcheckpoints", {
              userInfo: {
                  _id: authUser.user_data._id,
                //   company_id: this.state.userData.company_id,
                  encrypted_db_url: authUser.db_info.encrypted_db_url
              },
              endpointInfo: endpointData,
              checkpointInfo: item,
              auditInfo: {
                  audit_pbd_id: endpointData.audit_pbd_id
              },
          }).then(response => {
              if (response.data.response_code === 500) {
                  const updatedCheckpoints = checkPoints.map(checkpoint => {
                      if (checkpoint._id === response.data.data._id) {
                          return response.data.data;
                      }
                      return checkpoint;
                  });
                  setcheckPoints(updatedCheckpoints)
                  getCheckpointStatus();
                  reviewCheckpointStatus()
              }
          });
      } catch (error) {
          console.log("catch error", error);
      }
  }
  

   const deleteSignature=(id)=> {
      var getIndex = _.findIndex(endpointData.audit_signature, { id: id })
      endpointData.audit_signature.splice(getIndex, 1)
  
      urlSocket.post('epadtprcs/updatesignature', {
        auditInfo: {
          audit_pbd_id: endpointData.audit_pbd_id,
        },
        userInfo: {
          _id: authUser.user_data._id,
        //   company_id: this.state.userData.company_id,
          encrypted_db_url : authUser.db_info.encrypted_db_url
        },
        endpointInfo: endpointData
      })
        .then((response) => {
          if (response.data.response_code === 500) {
  
            // this.setState({
            //   issign_empty: true,
            //   refresh: true
            // })
          }
        })
  
    }


  const onSelected=(item, value)=> {

    // this.setState({recent_review : item})
    console.log(value,'value')

    if (value === "0") {
      item["cp_status"] = "4";
      item["cp_review_status"] = "0"
        setSelectedValue(value)
        setModal(true)
        setselectedItem(item)
      //   this.setState({ modal: true, selectedItem: item, selectedValue: value ,showTxtMessage : false })

    }
    else
      if (value === "-2") {
        item["cp_status"] = "3";
        item["cp_review_status"] = "-2"
          setSelectedValue(value)
        setModal(true)
        setselectedItem(item)

        // this.setState({ modal: true, selectedItem: item, selectedValue: value })
       updateEndpointData()
        getCheckpointStatus()
        reviewCheckpointStatus()
        updateCheckpoint(item)
      }
      else {
        // this.setState({ selectedValue: value, reason: "" }, () => {

          if (value === "1") {
            item["cp_status"] = "5";
            item["cp_review_status"] = "1"
          }
          setSelectedValue(value)
         setselectedItem(item)

          getCheckpointStatus()
          reviewCheckpointStatus()
          updateEndpointData()
          updateCheckpoint(item)

        // })
      }

  }


  const  checkReviewerSigned = () => {
      var indexOfAuditSigned = _.findIndex(endpointData.audit_signature, {
        audit_user_id: authUser.user_data._id,
      });
      var isReviewerSigned = indexOfAuditSigned === -1 ? false : true

      setisReviewerSigned(isReviewerSigned)
      setsigneeDesignation(isReviewerSigned ? signeeDesignation : authUser.user_data.designation )
      // setisDisabled(isReviewerSigned ? false : true)
      setsignmodal(true)
    
    }

  const clear = () => { canvas.current.clearCanvas();
    //  this.setState({ sign_url: null, up_sign_url: null, issign_empty: true, sign_valid: false }) 
    }



  const submit = () => {
    console.log(signee,issign_empty,'signeeDesignation',signeeDesignation)
    if (signee === null || signeeDesignation === null) {
      setsign_valid(true)
      setsignboard_message("Enter Name / Designation")
    }
    else {
      if (!issign_empty) {
        setsignmodal(false)
        console.log(canvas,'canvas')
        canvas.current.exportImage("png").then(data => {
          var ImageURL = data
          var block = ImageURL.split(";");
          var contentType = block[0].split(":")[1];// In this case "image/gif"
          var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
          var blob = b64toBlob(realData, contentType);

          signUpload(blob)
        })
          .catch((error) => { console.log("--catch error ---", error) })

      }
      else {
        setsign_valid(true)
        setsignboard_message("No signature in board")
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

 const  signUpload = async (image_info) => {
 
     const img = new FormData()
     let u_id = uuid()
   const authUser = JSON.parse(sessionStorage.getItem("authUser"))
    img.append('folder', `${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`);
     img.append('image', image_info, u_id + 'sign.png')
 
     await urlSocket.post('storeImage/awswebupload', img,{
       headers: {
         'Content-Type': 'multipart/form-data', // Set the Content-Type header
       },
     })
       .then((res) => {
        console.log(res,'res');
         if (res.status == 200) {
           let splitString = res.data.data[0].key.split("/");
           let getFileName = splitString[splitString.length - 1];
           update_sign(u_id, getFileName)
         }
       })
   }

    const update_sign = (u_id, fileName) => {
       // var sign_by = sessionStorage.getItem()
       var signature = {
         "id": String(u_id),
         "name": fileName,
         "sign_by": signee,
         "designation":signeeDesignation,
         "preview": fileName,
         "uploading": false,
         "filetype": "image/png",
         "uploadingStatus": "Uploaded",
         "originalName": fileName,
         //"captured_on": new Date(),
         "path": fileName,
         "type": "image/png",
         "uri": fileName,
         "audit_user_id":  authUser.user_data._id ,
         "review_user_id": "",
   
       }
       var endpointDataInfo={...endpointData}
       console.log(endpointData,endpointDataInfo,'endpointData')
       endpointDataInfo["audit_signature"] = endpointDataInfo["audit_signature"].concat([signature])
   
   
       
       urlSocket.post('epadtprcs/updatesignature', {
         auditInfo: {
           audit_pbd_id: endpointData.audit_pbd_id
         },
         userInfo: {
           _id: authUser.user_data._id,
        //    company_id: this.state.userData.company_id,
           encrypted_db_url: authUser.db_info.encrypted_db_url
         },
         endpointInfo: endpointDataInfo
       })
         .then((response) => {
           if (response.data.response_code === 500) {
            setsignee(null)
            setissign_empty(true)
            setEndpointData(endpointDataInfo)
           }
         })
     }
  
     
     const modaltoggle=()=>{
      const updatedCheckpoints = checkPoints.map(data =>{
        if(data._id === selectedItem._id){
          return {
            ...data,
            cp_review_status: null
          }
        }
        return data
      })
        setModal(prevModal => !prevModal);
      setfilteredData(updatedCheckpoints)
     }


     const onSubmitReason=(item)=>{


    if (reason === "" || reason === undefined) {
      setshowTxtMessage(true)
    }
    else{
    // this.setState({ modal: false })
      setModal(false)
  }
    if (selectedValue === "0") {
      item["cp_status"] = "4";
      item["cp_review_status"] = "0"
    }
    if (selectedValue === "-2") {
      item["cp_status"] = "3";
      item["cp_review_status"] = "-2"
    }

    item["cp_review_reason"] = reason

    console.log(avForm,'avformmmm');

    try {
      urlSocket.post("epadtprcs/reviewcheckpoints", {
        userInfo: {
            _id: authUser.user_data._id,
            encrypted_db_url: authUser.db_info.encrypted_db_url,
        },
        endpointInfo: endpointData,
        checkpointInfo: item,
        auditInfo: {
            audit_pbd_id: endpointData.audit_pbd_id,
        },
    })
    .then(response => {
        if (response.data.response_code === 500) {
            // avForm.current.reset();
            const updatedCheckpoints = [...checkPoints]; // Create a copy of the checkpoints array
            const getIndex = updatedCheckpoints.findIndex(checkpoint => checkpoint._id === response.data.data._id);
            
            if (getIndex !== -1) {
                updatedCheckpoints[getIndex] = response.data.data; // Update the specific checkpoint
                setcheckPoints(updatedCheckpoints)
                setreason("")
                getCheckpointStatus()
                reviewCheckpointStatus()
            }
        }
    });
    

    } catch (error) {
      console.log("catch error", error)
    }


     }

     const validateReview=()=>{

    var indexOfAuditSigned = _.findIndex(endpointData.audit_signature, {
      audit_user_id: authUser.user_data._id,
    });
    console.log(indexOfAuditSigned,'indexOfAuditSigned')

       var isrevSigned = indexOfAuditSigned === -1 ? false : true
       var checkpoints = _.filter(filteredData,{document_type :"2"})
       console.log(checkpoints.length ,rtk,rjd,checkPoints,'checkpoints' , remarks,rvd,rjd)
       
      //  const acp_status = checkpoints.every(
      //    ele => ele.cp_apln_is_mandatory && ele.cp_actionplans.length === 0
      //  );

       var acp_status = false
       checkpoints.forEach((ele, idx) => {
         if (ele.cp_apln_is_mandatory && ele.cp_actionplans.length === 0) {
           acp_status = true
         }
       })


       console.log(acp_status,'acp_status')
       if(acp_status && endpointInfo.audit_pbd_users.create_acplan){
         Swal.fire({
           icon: 'warning',
           title: 'Missing',
           text: "Please fill the action plans for the checkpoints which is mandatory !",
           confirmButtonText: 'OK',
         });

       }
       else {
         if (rvd !== checkpoints.length) {
           Swal.fire({
             icon: 'warning',
             title: 'Missing',
             text: "Cannot submit till all the checkpoints reviewed",
             confirmButtonText: 'OK',
           });
         }
         else {
           if (rtk > 0) {
             if (remarks !== "" && remarks.length >= 5) {
               Swal.fire({
                 icon: 'warning',
                 title: 'Are you sure?',
                 text: "Submit this Review",
                 showCancelButton: true,
                 confirmButtonColor: '#2ba92b',
                 confirmButtonText: 'Yes',
                 cancelButtonColor: '#d33',
                 cancelButtonText: 'No'
               }).then(async (result) => {
                 if (result.isConfirmed) {

                   submitReviewAudit()

                 }


               })


             }
             else if (String(remarks).length === 0) {
               Swal.fire({
                 icon: 'warning',
                 title: 'Missing',
                 text: "Enter remarks or remarks should be 5 or more characters",
                 confirmButtonText: 'OK',
               });
             }
             else {
               Swal.fire({
                 icon: 'warning',
                 title: 'Are you sure?',
                 text: "Submit this Review",
                 showCancelButton: true,
                 confirmButtonColor: '#2ba92b',
                 confirmButtonText: 'Yes',
                 cancelButtonColor: '#d33',
                 cancelButtonText: 'No'
               }).then(async (result) => {
                 if (result.isConfirmed) {
                   submitReviewAudit()

                 }
               })
             }
           }
           else if (rjd > 0) {
             if (remarks !== "" && remarks.length < 5) {
               Swal.fire({
                 icon: 'warning',
                 title: 'Missing',
                 text: "Enter remarks or remarks should be 5 or more characters",
                 confirmButtonText: 'OK',
               });
             }
             if (!isrevSigned && endpointData.audit_config.review_capture_sign === true) {
               Swal.fire({
                 icon: 'warning',
                 title: 'Missing',
                 text: "Reviewer Signature is required",
                 confirmButtonText: 'OK',
               });
             }
             else {
               Swal.fire({
                 icon: 'warning',
                 title: 'Are you sure?',
                 text: "Submit this Review",
                 showCancelButton: true,
                 confirmButtonColor: '#2ba92b',
                 confirmButtonText: 'Yes',
                 cancelButtonColor: '#d33',
                 cancelButtonText: 'No'
               }).then(async (result) => {
                 if (result.isConfirmed) {
                   submitReviewAudit()

                 }
               })
             }

           }
           else {
             if (!isrevSigned && endpointData.audit_config.review_capture_sign === true) {
               Swal.fire({
                 icon: 'warning',
                 title: 'Missing',
                 text: "Reviewer Signature is required",
                 confirmButtonText: 'OK',
               });

             }
             else {
               if (String(remarks.trim()).length > 0) {
                 Swal.fire({
                   icon: 'warning',
                   title: 'Are you sure?',
                   text: "Submit this Review",
                   showCancelButton: true,
                   confirmButtonColor: '#2ba92b',
                   confirmButtonText: 'Yes',
                   cancelButtonColor: '#d33',
                   cancelButtonText: 'No'
                 }).then(async (result) => {
                   if (result.isConfirmed) {

                     submitReviewAudit()

                   }


                 })
               }
               else {
                 Swal.fire({
                   icon: 'warning',
                   title: 'Missing',
                   text: "Enter remarks or remarks should be 5 or more characters",
                   confirmButtonText: 'OK',
                 });
               }

             }

           }
         }
       }
     }
   

     const submitReviewAudit=()=> {
    var checkpoints = _.filter(checkPoints,{document_type :"2"})
    var historyData = {
      "submitted_by": authUser.user_data._id,
      "submitted_on": new Date(),
      "remarks": remarks
    }
    var endpointDataInfo={...endpointData}
    console.log(endpointDataInfo,'endpointDataInfo',rtk)
    if(!endpointDataInfo.ep_review_history){
      endpointDataInfo.ep_review_history =[]
    endpointDataInfo.ep_review_history.push(historyData)
    }
    else{
    endpointDataInfo.ep_review_history.push(historyData)
    }
    endpointDataInfo.updated_on = new Date();
    endpointDataInfo.audit_reviewed_on = new Date();

    if (rtk > 0) {
      endpointDataInfo.audit_status_id = "5";
      endpointDataInfo.audit_status_name = "Retake";
      endpointDataInfo.audit_cp_status = "Retake";
    }
    else {
      endpointDataInfo.audit_status_id = "7";
      endpointDataInfo.audit_cp_status = "Reviewed";
      endpointDataInfo.audit_status_name = "Reviewed";
    }


    endpointDataInfo.review_status = "1";

    // setEndpointData(endpointDataInfo)

      const sum_of_reviewscore = _.sumBy(
        checkpoints.filter(obj => obj.cp_review_status === "1"),
        obj => parseFloat(obj.cp_otpion_score?.$numberDecimal)
      );
      endpointDataInfo["review_score"] = sum_of_reviewscore

      try {

        urlSocket.post("epadtprcs/updatereviewendpoint", {
          auditInfo: {
            audit_pbd_id: endpointDataInfo.audit_pbd_id
          },
          userInfo: {
            _id: authUser.user_data._id,
            // company_id: authUser.user_data.company_id,
            encrypted_db_url: authUser.db_info.encrypted_db_url,
            designation: signeeDesignation
          },
          endpointInfo: endpointDataInfo
        })
          .then(async response => {
            if (response.data.response_code === 500) {
              // var checkpoints = _.filter(checkPoints, { document_type: "2" });
              // const sum_of_auditscore = _.sumBy(checkpoints, obj => parseFloat(obj.cp_otpion_score.$numberDecimal));
              // const updatedEndpointData = { ...endpointData, audit_score: sum_of_auditscore };
              // // console.log(updatedEndpointData, 'updatedEndpointData', checkpoints)
              // const action_plan_checkpoints = _.filter(checkpoints, checkpoint => checkpoint.cp_actionplans.length > 0);
              // const allResponsiblePersons = _.flatMap(action_plan_checkpoints, 'cp_actionplans')
              //   .flatMap(actionPlan => _.get(actionPlan, 'responsible_person', []));
          
              // const uniqueUsers = _.uniqBy(allResponsiblePersons, 'user_id');
          
              // console.log(uniqueUsers)
          
              // updatedEndpointData["audit_ac_plan_resp_persons"] = uniqueUsers
              // updatedEndpointData["activity_id"]= JSON.parse(sessionStorage.getItem("auditData")).audit_pbd_id


              // if(updatedEndpointData.status === "7"){
              //   updatedEndpointData["location_permission_acpln"] = uniqueUsers
              //   var createActionPlan = await this.crudActionPlanTask(updatedEndpointData, this.state.userData, this.state.db_info)
                
              // }

              // this.setState({
              //   endpointData: endpointData
              // })
              navigate("/usrenpdts");
            }

          })

      } catch (error) {
        console.log("catch error", error)
      }
    // })
  }



  const saveCheckpoint=(data)=>{
    var filteredDataInfo = _.cloneDeep(filteredData)
    var findIdx = _.findIndex(filteredDataInfo,{_id : data._id})
    if(findIdx !==-1){
      filteredDataInfo[findIdx]=data
      updateCheckpointInfo(filteredDataInfo[findIdx])
    }
    setfilteredData(filteredDataInfo)

  }

  const updateCheckpointInfo=async(checkpoint)=>{

    try {

      const response = await urlSocket.post("epadtprcs/updatecheckpoints", {
        userInfo: {
          encrypted_db_url: authUser.db_info.encrypted_db_url,
          _id: authUser.user_data._id,
          // company_id: userData.company_id,
        },
        endpointInfo: endpointData,
        checkpointInfo: checkpoint,
        auditInfo: {
          audit_pbd_id: endpointData.audit_pbd_id,
        },
      });

      console.log('response', response)
      if(response.status === 200){


      }


      
    } catch (error) {
      
    }


  }




  const addCAPA = (checkpoint) => {

    console.log("checkpoint", checkpoint,filteredData)
    const cp_apln_length = checkpoint.cp_actionplans.length + 1;
    var filteredDataInfo = _.cloneDeep(filteredData)

    var findIdx = _.findIndex(filteredDataInfo,{_id : checkpoint._id})

    filteredDataInfo[findIdx]["cp_actionplans"] = filteredDataInfo[findIdx]["cp_actionplans"].concat([
      {
        "id": checkpoint._id + String(cp_apln_length),
        "observation": "",
        "actionplan": "",
        "target_date": null,
        "to_email": "",
        "to_phone": "",
        "status": "0",
        "isEdit": true,
        "acp_files": []
      }
    ]);
    setSelectedCheckpoint(filteredDataInfo[findIdx])
    setfilteredData(filteredDataInfo)

  };



    const actionPlanDynamicText = (selectedCheckpoint) => {
      console.log(selectedCheckpoint,'selectedCheckpoint',endpointInfo)
      // var count = _.filter(selectedCheckpoint?.cp_actionplans, { status: "1" }).length
      // return count
    }


    const getactionplanCount = (selectedCheckpoint) => {
      console.log(selectedCheckpoint,'selectedCheckpoint')
      var count = _.filter(selectedCheckpoint?.cp_actionplans, { status: "1" }).length
      return count
    }



  if (dataLoaded) {
    return (
      <React.Fragment>
        <div className="page-content" >

          <MetaTags>
            <title>AuditVista | Review Check points</title>
          </MetaTags>

          <Breadcrumb
            title="Review Check points"
            isBackButtonEnable={true}
            gotoBack={() => { navigate('/usrenpdts') }}
          />
          <Container fluid>
            {
              console.log(canvas, 'canvas')
            }
            <Card body>
              <Row>
                <Col lg={12}>
                  <CardTitle className="h3 mt-0">
                    {endpointData.audit_name}
                  </CardTitle>
                  <CardText>
                    {endpointData.loc_name}{" / "}{endpointData.code}
                  </CardText>

                  <Row>
                    <Col lg={8}>
                      <div>
                        <Link to="#" className="badge badge-soft-dark font-size-14 me-3" onClick={() => {
                          setfilterStatus("all")
                        }}>
                          Total check points{" - "}{checkPoints.length}
                        </Link>
                        <Link to="#" className="badge badge-soft-secondary font-size-14 me-3" onClick={() => {
                          setfilterStatus("nr")
                        }}>
                          Not Reviewed{" - "}{nr}
                        </Link>
                        <Link to="#" className="badge badge-soft-info font-size-14 me-3" onClick={() => {
                          setfilterStatus("r")
                        }}>
                          Reviewed{" - "}{rwd}
                        </Link>
                      </div>
                    </Col>

                    <Col lg={4} className="d-flex align-item-center justify-content-center">
                      <div>
                        <Link to="#" className="badge badge-soft-success font-size-14 me-3" onClick={() => {
                          submitReviewAll("1")
                        }}>
                          Accept all
                        </Link>
                        <Link to="#" className="badge badge-soft-danger font-size-14 me-3" onClick={() => {
                          submitReviewAll("0")
                        }}>
                          Reject all
                        </Link>
                        <Link to="#" className="badge badge-soft-dark font-size-14 me-3" onClick={() => {
                          submitReviewAll("-2")
                        }}>
                          Retake all
                        </Link>
                      </div>
                    </Col>
                  </Row>


                </Col>

              </Row>

            </Card>

          </Container>
          <div className="d-xl-flex">
            <div className="w-100">
              <div className="d-md-flex">

                {/* 1st block */}

                <div className="w-100 pb-3 me-md-2 overflow-auto" style={{ maxHeight: height - 250 }} >

                  <div className="d-flex flex-column">
                    {
                      console.log(filteredData, 'filteredData')
                    }

                    {
                      filteredData.map((item, i) => {
                        return (
                          <>
                            {
                              item.document_type == "2" ?
                                <Card key={i + "cpoints"}>
                                  <CardBody>
                                    <div className="mb-2">
                                      <label className={item.cp_review_status !== null ? "badge badge-soft-primary font-size-10 me-2" : item.cp_status === "0" ? "badge badge-soft-secondary font-size-10 me-2" : item.cp_status === "1" ? "badge badge-soft-warning font-size-10 me-2" : "badge badge-soft-success font-size-10 me-2"}>{item.cp_review_status !== null ? "Reviewed" : item.cp_status === "0" ? "Not started" : item.cp_status === "1" ? "In progress" : "Completed"}</label>
                                      <label className={item.cp_is_compliance ? "badge badge-soft-danger font-size-10" : "badge badge-soft-success font-size-10"}>{item.cp_is_compliance ? "Compliance" : "Non-Compliance"}</label>
                                    </div>
                                    <div className="mb-1">
                                      <span className="font-size-13">{item.checkpoint}</span>&nbsp;<span>
                                        {_.find(item.rule, { is_selected: true })?.capa_info?.mandatory ? (
                                          <span
                                            className={
                                              getactionplanCount(item) > 0
                                                ? "badge badge-soft-success"
                                                : "badge badge-soft-danger"
                                            }
                                          >
                                          {/* {actionPlanDynamicText(item)} */}
                                          Capa Required
                                          </span>
                                        ) : (
                                          <span>&nbsp;</span>
                                        )}
                                      </span>
                                    </div>

                                    {
                                      item.checkpoint_type_id === "1" || item.checkpoint_type_id === "2" || item.checkpoint_type_id === "3" || item.checkpoint_type_id === "4" || item.checkpoint_type_id === "5" || item.checkpoint_type_id === "6" ?
                                        <ReviewOPType
                                          options={item.rule}
                                          get_btn_color={item}

                                        />
                                        : null
                                    }

                                    {
                                      item.cp_attach_images.length !== 0 ?
                                        <div className="mt-3 mb-4">
                                          <label>Images Attached</label>
                                          <PreviewImage
                                            imagePreviewUrl={imagePreviewUrl}
                                            images={item.cp_attach_images}
                                            folderPath={`${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`}
                                          />
                                        </div> : null
                                    }

                                    {
                                      item.cp_attach_videos.length !== 0 ?
                                        <div className="mt-3 mb-4">
                                          <label>Videos Attached</label>
                                          <PreviewVideo
                                            imagePreviewUrl={imagePreviewUrl}
                                            videos={item.cp_attach_videos}
                                            folderPath={`${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`}
                                          />
                                        </div> : null
                                    }

                                    {
                                      item.cp_documents.length !== 0 ?
                                        <div className="my-4">
                                          <label>Documents Attached</label>
                                          <PreviewDocuments
                                            imagePreviewUrl={imagePreviewUrl}
                                            images={item.cp_documents}
                                            folderPath={`${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`}
                                          />
                                        </div> : null

                                    }

                                    {
                                      item.cp_observation !== null ?
                                        <div className="my-4">
                                          <label>Observation</label>
                                          <PreviewObservation
                                            observation={item.cp_observation}
                                          />
                                        </div> : null
                                    }


                                    {
                                      endpointInfo.audit_pbd_users?.create_acplan && (item.cp_actionplans.every(item => item.observation !== "")) &&
                                      <div className="mb-2">
                                        <button className="btn btn-sm btn-outline-primary"
                                          onClick={() => { addCAPA(item) }}
                                        >
                                          Add Capa
                                        </button>
                                      </div>

                                    }

                                    {/* {
                                                item.cp_actionplans.length !== 0 ?
                                                  <div className="my-4">
                                                    <label>CAPA</label>
                                                    <PreviewCAPA
                                                      actionplans={item.cp_actionplans}
                                                    />
                                                  </div> : null
                                              } */}

                                    {

                                      item.cp_actionplans?.map((apln, idx) => {
                                        return (
                                          <CAPA
                                            key={"capa" + String(idx)}
                                            index={idx}
                                            data={apln}
                                            onadd={() => { addCAPA(selectedCheckpoint) }}
                                            saveCheckpoint={(data) => saveCheckpoint(data)}
                                            // getDeletediles={(data) => getDeletediles(data)}
                                            selectedCheckpoint={item}
                                            audit_status={endpointData.audit_status_id}
                                            location_info={endpointData}
                                            priority={authUser.config_data.acp_priority}
                                            folderPath={`${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/`}
                                            imagePreviewUrl={imagePreviewUrl}
                                            epsInfo={endpointInfo}
                                          />
                                        )


                                      })



                                    }






                                    <div className="row p-2">
                                      <div className="button-items mb-1">
                                        <div className="btn-group mt-2 mt-xl-0" role="group" aria-label="Basic radio toggle button group">
                                          <input type="radio"
                                            className="btn-check"
                                            name={i + "btnradio0"} id={i + "btnradio0"} autoComplete="off"
                                            checked={item.cp_review_status === "1"}
                                            onClick={() => {
                                              onSelected(item, "1")
                                            }}
                                          />
                                          <label className="btn btn-outline-success btn-sm"
                                            htmlFor={i + "btnradio0"}>Accept</label>

                                          <input type="radio"
                                            className="btn-check"
                                            name={i + "btnradio1"}
                                            id={i + "btnradio1"}
                                            autoComplete="off"
                                            checked={item.cp_review_status === "0"}
                                            onClick={() => {
                                              onSelected(item, "0")
                                              setreason("")
                                            }}
                                          />
                                          <label className="btn btn-outline-danger btn-sm" htmlFor={i + "btnradio1"}>Reject</label>

                                          <input type="radio"
                                            className="btn-check"
                                            name={i + "btnradio2"}
                                            id={i + "btnradio2"}
                                            autoComplete="off"
                                            checked={item.cp_review_status === "-2"}
                                            onClick={() => {
                                              onSelected(item, "-2")
                                            }}
                                          />
                                          <label className="btn btn-outline-dark btn-sm" htmlFor={i + "btnradio2"}>Retake</label>
                                        </div>
                                      </div>
                                    </div>


                                    {
                                      item.cp_review_status === "0" || item.cp_review_status === "-2" ?
                                        <div>
                                          <label>Reason </label> {endpointData.audit_status_id === "3" ? <Link to="#" onClick={() => {
                                            // this.editReason(item)

                                          }}><i className="mdi mdi-pencil font-size-20 text-primary" /></Link> : null}
                                          <p>{item.cp_review_reason}</p>
                                        </div> : null
                                    }


                                  </CardBody>
                                </Card>
                                :
                                <div style={{ backgroundColor: item.parent_id == null ? '#525252' : "#808080" }} className="p-2 my-1">
                                  <div className="d-flex">
                                    <div className="overflow-hidden me-auto">
                                      <h5 className="font-size-13  mb-1">
                                        <span style={{ color: '#fffffff5' }}>{item.checkpoint}</span>
                                      </h5>
                                    </div>
                                  </div>
                                </div>

                            }

                          </>
                        )
                      })
                    }

                  </div>

                </div>



                {/* 2nd block */}
                <Card className="filemanager-sidebar " body>
                  {
                    <div className="my-2">
                      <AvForm className="form-horizontal"
                      //   onValidSubmit={this.handleValidSubmit}
                      >
                        <div className="" >
                          <label>Remarks</label>
                          <AvField
                            name="remarks"
                            value={remarks}
                            onChange={(e) => {
                              setremarks(e.target.value)
                            }}
                            className="form-control"
                            placeholder="Enter remarks"
                            type="textarea"
                            style={{ height: 150 }}
                            // disabled={this.state.isRemDisabled}
                            required
                          />
                        </div>
                      </AvForm>
                    </div>
                  }
                  {
                    endpointData.audit_signature.length !== 0 ?
                      <div>
                        {
                          endpointData.audit_signature.map((item, i) => {
                            return (
                              <Card
                                className="mt-1 mb-2 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                key={i + "-signfile"}
                              >
                                <div style={{ display: 'flex', flexDirection: 'row' }} >
                                  <div className="p-2 col-10" >
                                    <label className="mb-1 font-size-11">{item.sign_by}<br />{item.designation}</label>
                                    <img height="80" src={imagePreviewUrl + `${authUser.client_info[0]["s3_folder_path"]}${endpointData.audit_name}${'_'}${endpointData.audit_pbd_id}/${endpointData.loc_name}${'_'}${endpointData._id}/` + item.name} />
                                  </div>
                                  {
                                    item.audit_user_id === authUser.user_data._id &&
                                    <div className="col-2 text-end me-2" style={{ lineHeight: 1.3 }}>
                                      <Link to="#" onClick={() => {
                                        deleteSignature(item.id)
                                      }}><i className="mdi mdi-close-circle-outline font-size-20 text-danger" /></Link>
                                    </div>
                                  }

                                </div>
                              </Card>

                            )
                          })
                        }
                      </div> : null
                  }
                  {
                    rtk === 0 &&
                    <div className="my-2">
                      <div className="">
                        <Button
                          color="primary"
                          onClick={() => {
                            checkReviewerSigned()
                          }}
                          id="custom-padding-width-alert"
                        >
                          Add signature
                        </Button>
                      </div>
                    </div>
                  }

                  {
                    // this.state.endpointData.status === "3" ?
                    <div>
                      <Button outline color="success" onClick={() => {
                        validateReview()
                      }
                        //  this.validateReview()
                      }>Submit audit review</Button>
                    </div>
                    // : null
                  }
                </Card>

              </div>
            </div>
          </div>
        </div>


        <Modal
          isOpen={signmodal}
          className={props.className}
        >
          <ModalHeader toggle={signmodaltoggle} tag="h4">
            Signature
          </ModalHeader>
          <ModalBody>
            <AvForm className="form-horizontal"
            >
              <div className="mb-3" >
                <AvField
                  name="signee"
                  value={isReviewerSigned ? "" : authUser.user_data.fullname}
                  onChange={(e) => {
                    setsignee(e.target.value)
                  }}
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
                  value={isReviewerSigned ? '' : authUser.user_data.designation}
                  onChange={(e) => {
                    setsigneeDesignation(e.target.value)
                  }}
                  className="form-control"
                  placeholder="Enter designation"
                  type="input"
                />
              </div>


              <ReactSketchCanvas
                ref={canvas}
                style={styles}
                width="600"
                height="400"
                strokeWidth={4}
                strokeColor="black"
                onStroke={() => {
                  setissign_empty(false)
                  setsign_valid(false)
                  // this.setState({ issign_empty: false, sign_valid: false })}
                }}
              />
              {
                sign_valid ? <div className="m-2"><label className="text-danger">{signboard_message}</label></div> : null
              }

              <Button className="my-2 me-2" color="primary" onClick={submit}>Submit</Button>
              <Button className="my-2 me-2" color="warning" onClick={clear}>Clear</Button>
              <Button className="my-2" color="danger" onClick={() => {
                // this.setState({ modal: false, signmodal: false })}
                setModal(false)
                setsignmodal(false)
              }
              }>Cancel</Button>
            </AvForm>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={modal}
          className={props.className}
        >
          <ModalHeader toggle={modaltoggle} tag="h4">
            Reason for {selectedValue === "-2" ? "Retake" : "Rejection"}
          </ModalHeader>
          <ModalBody>
            <AvForm ref={avForm} className="form-horizontal"
            // onValidSubmit={this.handleValidSubmit}
            >
              <div className="mb-3" >
                <AvField
                  name="reason"
                  value={reason}
                  onChange={(e) => {
                    setreason(e.target.value)
                  }}
                  className="form-control"
                  placeholder="Enter reason"
                  type="textarea"
                  required
                />
                {
                  showTxtMessage &&
                  <div className="text-danger" style={{ fontSize: 'smaller' }}>Reason for reject is required!</div>
                }
              </div>
              <Button className="my-2 me-2" color="primary" onClick={() => onSubmitReason(selectedItem)}>Submit</Button>
              <Button className="my-2" color="danger" onClick={() => modaltoggle()}>Cancel</Button>
            </AvForm>
          </ModalBody>
        </Modal>




      </React.Fragment>
    )
  }
  else {
    return null
  }
}
export default Reviewchecklist
