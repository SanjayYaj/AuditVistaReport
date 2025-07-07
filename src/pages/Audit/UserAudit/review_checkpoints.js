import React, { Component } from "react";
import ReactDOM from 'react-dom';
import MetaTags from 'react-meta-tags';
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
// import Dropzone from "react-dropzone"
import MediaPreview from "./Components/media_preview";

import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import { Link, withRouter } from "react-router-dom"
import facility from '../FacilityScreen'
import Swal from "sweetalert2";


import moment from 'moment'
import SweetAlert from "react-bootstrap-sweetalert"
import { ReactSketchCanvas } from 'react-sketch-canvas';

import ReviewOPType from "./Components/review_optype";
import PreviewImage from "./Components/preview_images";
import PreviewDocuments from "./Components/preview_documents";
import PreviewObservation from "./Components/preview_observation";
import PreviewCAPA from "./Components/preview_CAPA";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import uuid from 'react-uuid'


const _ = require('lodash')

import urlSocket from "../../../helpers/urlSocket";
import PreviewVideo from "../ManagePublishedTemplate/Components/preview_videos";

const styles = {
  border: '0.0625rem solid #9c9c9c',
  borderRadius: '0.25rem',
};


export default class Reviewcheckpoints extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataloaded: false,
      activeTab: "1",
      height: window.innerHeight,
      selectedCheckpoint: null,
      filterStatus: "all",
      showOption: false,
      attachImages: [],
      attachDocuments: [],
      selectedOption: null,
      docfileStatus: "clear",
      fileStatus: "clear",
      doc_warning_enabled: false,
      warning_enabled: false,
      issign_empty: true,
      signee: null,
      remarks: "",
      isReviewerSigned: false,
      isRemDisabled: false,
      sign_valid : true

    }
    this.avForm = React.createRef()
    this.toggle = this.toggle.bind(this)
    this.canvas = React.createRef();

  }


  modaltoggle = () => {
    const updatedCheckpoints = this.state.checkpoints.map(data => {
        if (data._id === this.state.recent_review._id) {
            return {
                ...data,
                cp_review_status: null
            };
        }
        return data;
    });

    this.setState(prevState => ({
        modal: !prevState.modal,
        filteredData: updatedCheckpoints
    }));
}

  signmodaltoggle = () => {
    this.setState(prevState => ({
      signmodal: !prevState.signmodal,
    }))
  }


  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      })
    }
  }

  async componentDidMount() {

    try {
      const { data } = this.props.location.state
      // console.log(data, 'data')
      this.updt_endpoint_data(data)
    } catch (error) {
      // console.log(error, 'error')
    }


    await this.getSessionData()
    // await this.loadCheckpoints()
  }

  updt_endpoint_data = (data) => {
    var endpointData = JSON.parse(sessionStorage.getItem("endpointData"))
    var db_info = JSON.parse(sessionStorage.getItem('db_info'))

    try {
      urlSocket.post('epadtprcs/updt-endpoint-review-location',{
        endpointData :endpointData._id,
        encrypted_db_url: db_info.encrypted_db_url,
        location_data : data
      }).then(response =>{
      })
    } catch (error) {
      
    }



  }



  async getSessionData() {

    var data = JSON.parse(sessionStorage.getItem("authUser"));
    var endpointData = JSON.parse(sessionStorage.getItem("endpointData"));
    var db_info = JSON.parse(sessionStorage.getItem('db_info'))
    var user_facilities = JSON.parse(sessionStorage.getItem("user_facilities"))
    
    
    var protect_routes = await facility(user_facilities, 'usradt')
    if (protect_routes !== undefined) {
      this.setState({
        configData: data.config_data,
        userData: data.user_data,
        endpointData,
        db_info: db_info,
        imagePreviewUrl: data.config_data.img_url,
        imageToken: data.config_data.img_url,
        signee: data.user_data.firstname
      },()=>{this.loadCheckpoints()})
    }
    else {
      this.props.history.push('/dashboard')
    }

  }

  async loadCheckpoints() {
    try {

      urlSocket.post("epadtprcs/getepcheckpoints", {
        auditInfo: {
          audit_pbd_id: this.state.endpointData.audit_pbd_id
        },
        userInfo: {
          _id: this.state.userData._id,
          company_id: this.state.userData.company_id,
          encrypted_db_url: this.state.db_info.encrypted_db_url
        },
        endpointInfo: this.state.endpointData
      })
        .then(async response => {
          console.log(response,'response')
          if (response.data.response_code === 500) {
            var flatData= await this.convertFlatDataToTreeData(response.data.data)
             var checkpoints = _.filter(response.data.data, { document_type: "2" })
            this.setState({
              checkpoints: flatData,
              nr: _.filter(checkpoints, { cp_review_status: null }).length,
              rwd: _.filter(checkpoints, item => {
                return item.cp_review_status !== null
              }).length,

            }, function () {
              this.getCheckpointStatus()
              this.filterCheckpoints(this.state.filterStatus)
            })
          }

        })

    } catch (error) {
      console.log("catch error", error)
    }
  }



  convertFlatDataToTreeData =async (flatData) => {
    if (flatData !== undefined) {
      var parent_data = flatData.filter(item2 => item2.parent_id === null);
      parent_data.sort(function (a, b) {
        return a.document_id - b.document_id;
      });
      const treeData = parent_data.map((parentItem) => {
        parentItem.children = this.getChildren(parentItem.document_id, flatData);
        return parentItem;
      });
  
      console.log(treeData,'treedata')
     var converted_treeDataToFlat =await this.treeDataToFlat(treeData)
    var removed_node= _.map(converted_treeDataToFlat, "node")
     console.log(converted_treeDataToFlat,'converted_treeDataToFlat',removed_node)
     return removed_node
  
    }
  }


  getChildren = (parentId, flatData) => {
    var children = flatData.filter(item => item.parent_id === parentId);
    children.sort(function (a, b) {
      return a.document_id - b.document_id;
    });
  
    return children.map((childItem) => {
      childItem.children = this.getChildren(childItem.document_id, flatData);
      return childItem;
    });
  }

  treeDataToFlat = (treeData) => {
    var getNodeKey = ({ treeIndex }) => treeIndex;
    var flatData = getFlatDataFromTree(
        {
            treeData: treeData,
            getNodeKey,
            ignoreCollapsed: false,
        });

    // Create a new array with the desired data
    var explicitData = flatData.filter((item) => !!item);

    return explicitData;
};



  getCheckpointStatus() {
    this.setState({
      nr: _.filter(this.state.checkpoints, { cp_review_status: null , document_type :"2" }).length,
      rwd: _.filter(this.state.checkpoints, item => {
        return item.cp_review_status !== null && item.document_type == "2"
      }).length,
      dataloaded: true
    })

  }

  filterCheckpoints(filterStatus) {
    if (filterStatus === "all") {
      this.setState({
        filteredData: this.state.checkpoints,
        showOption: false,
        //selectedCheckpoint:null,
        idx: -1
      })
    }
    else
      if (filterStatus === "nr") {
        this.setState({
          filteredData: _.filter(this.state.checkpoints, item => {
            return item.cp_review_status === null && item.document_type =="2"
          }),
          showOption: false,
          selectedCheckpoint: null,
          idx: -1
        })
      }
      else {
        this.setState({
          filteredData: _.filter(this.state.checkpoints, item => {
            return item.cp_review_status !== null && item.document_type =="2"
          }),
          showOption: false,
          selectedCheckpoint: null,
          idx: -1
        })
      }
  }

  loadSelectedCheckpoint(item, i) {
    this.setState({ showOption: false, optionSelected: false });
    setTimeout(() => {
      this.setState({
        selectedCheckpoint: item,
        idx: i,
        optionSelected: _.filter(item.checkpoint_options, { is_selected: true }).length !== 0 ? true : false,
        selected_option: _.filter(item.checkpoint_options, { is_selected: true })[0]
      })
      this.setState({ showOption: true });
    }, 10);
  }


  onSelected(item, value) {

    this.setState({recent_review : item})

    if (value === "0") {
      item["cp_status"] = "4";
      item["cp_review_status"] = "0"
      this.setState({ modal: true, selectedItem: item, selectedValue: value ,showTxtMessage : false })
      // this.updateEndpointData()
      // this.getCheckpointStatus()
      // this.updateCheckpoint(item)

    }
    else
      if (value === "-2") {
        item["cp_status"] = "3";
        item["cp_review_status"] = "-2"
        this.setState({ modal: true, selectedItem: item, selectedValue: value })
        this.updateEndpointData()
        this.getCheckpointStatus()
        this.updateCheckpoint(item)
      }
      else {
        this.setState({ selectedValue: value, reason: "" }, () => {

          if (value === "1") {
            item["cp_status"] = "5";
            item["cp_review_status"] = "1"
          }

          this.getCheckpointStatus()
          this.updateEndpointData()
          this.updateCheckpoint(item)

        })
      }

  }




  // onSelected(item, value) {

  //   console.log(item,value)
  //   if (value === "0" || value === "-2") {
  //     this.setState({ modal: true, selectedItem: item, selectedValue:value })
  //     this.updateEndpointData()
  //   }
  //   else {
  //     this.setState({selectedValue:value, reason:""}, () => {
  //       item["cp_review_status"] = value

  //       if(value === "1")
  //       {
  //         item["cp_status"] = "5";
  //         item["cp_review_status"] = "1"
  //       }

  //       this.getCheckpointStatus()
  //       this.updateEndpointData()
  //       this.updateCheckpoint(item)  

  //     })
  //   }

  // }

  getCheckpointStatus() {
    console.log(this.state.checkpoints,'this.state.checkpoints')
    this.setState({
      rtk: _.filter(this.state.checkpoints, { cp_review_status: "-2" , document_type :"2" }).length,
      apvd: _.filter(this.state.checkpoints, { cp_review_status: "1", document_type :"2" }).length,
      rjd: _.filter(this.state.checkpoints, { cp_review_status: "0", document_type :"2" }).length,
      dataloaded: true
    }, () => {
      console.log(this.state.rtk , this.state.apvd , this.state.rjd,'this.state.rtk + this.state.apvd + this.state.rjd')
      this.setState({
        rvd: this.state.rtk + this.state.apvd + this.state.rjd
      })

    })

  }

  // updateEndpointData = () => {
  //   if (this.state.checkpoints.length === this.state.rvd) {
  //     if (this.state.endpointData.status == "4") {
  //       this.state.endpointData.audit_cp_status = "Reviewed Completed";
  //       this.state.endpointData.review_status = "1";
  //     }
  //   }
  //   else {
  //     if (this.state.endpointData.status === "3" || this.state.endpointData.status == "4") {
  //       this.state.endpointData.audit_cp_status = "Review in progress";
  //       this.state.endpointData.status = "4";
  //       this.state.endpointData.review_status = "1";
  //     }
  //   }

  // }


  updateEndpointData = () => {
    let updatedStatus = this.state.endpointData.status;
    let updatedAuditCpStatus = this.state.endpointData.audit_cp_status;
    let updatedReviewStatus = this.state.endpointData.review_status;

    if (this.state.checkpoints.length === this.state.rvd) {
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

    this.setState({
        endpointData: {
            ...this.state.endpointData,
            audit_cp_status: updatedAuditCpStatus,
            status: updatedStatus,
            review_status: updatedReviewStatus
        }
    });
}


  // updateCheckpoint(item) {
  //   try {

  //     urlSocket.post("epadtprcs/reviewcheckpoints", {
  //       userInfo: {
  //         _id: this.state.userData._id,
  //         company_id: this.state.userData.company_id,
  //         encrypted_db_url: this.state.db_info.encrypted_db_url
  //       },
  //       endpointInfo: this.state.endpointData,
  //       checkpointInfo: item,
  //       auditInfo: {
  //         audit_pbd_id: this.state.endpointData.audit_pbd_id
  //       },
  //     })
  //       .then(response => {
  //         if (response.data.response_code === 500) {
  //           var getIndex = _.findIndex(this.state.checkpoints, { _id: response.data.data._id })
  //           if (getIndex !== -1) {
  //             this.state.checkpoints[getIndex] = response.data.data
  //           }
  //           this.setState({
  //             checkpoints: this.state.checkpoints,
  //           }, function () {
  //             this.getCheckpointStatus()
  //             this.filterCheckpoints(this.state.filterStatus)
  //           })
  //         }
  //       })

  //   } catch (error) {
  //     console.log("catch error", error)
  //   }
  // }


  updateCheckpoint(item) {
    try {
        urlSocket.post("epadtprcs/reviewcheckpoints", {
            userInfo: {
                _id: this.state.userData._id,
                company_id: this.state.userData.company_id,
                encrypted_db_url: this.state.db_info.encrypted_db_url
            },
            endpointInfo: this.state.endpointData,
            checkpointInfo: item,
            auditInfo: {
                audit_pbd_id: this.state.endpointData.audit_pbd_id
            },
        }).then(response => {
            if (response.data.response_code === 500) {
                const updatedCheckpoints = this.state.checkpoints.map(checkpoint => {
                    if (checkpoint._id === response.data.data._id) {
                        return response.data.data;
                    }
                    return checkpoint;
                });

                this.setState({
                    checkpoints: updatedCheckpoints,
                }, () => {
                    this.getCheckpointStatus();
                    this.filterCheckpoints(this.state.filterStatus);
                });
            }
        });
    } catch (error) {
        console.log("catch error", error);
    }
}


  onSubmitReason(item) {

    if (this.state.reason === "" || this.state.reason === undefined) {
      this.setState({
        showTxtMessage: true
      })
    }
    else{
    this.setState({ modal: false })
  }
    if (this.state.selectedValue === "0") {
      item["cp_status"] = "4";
      item["cp_review_status"] = "0"
    }
    if (this.state.selectedValue === "-2") {
      item["cp_status"] = "3";
      item["cp_review_status"] = "-2"
    }

    item["cp_review_reason"] = this.state.reason


    try {

      // urlSocket.post("epadtprcs/reviewcheckpoints", {
      //   userInfo: {
      //     _id: this.state.userData._id,
      //     company_id: this.state.userData.company_id,
      //     encrypted_db_url: this.state.db_info.encrypted_db_url
      //   },
      //   endpointInfo: this.state.endpointData,
      //   checkpointInfo: item,
      //   auditInfo: {
      //     audit_pbd_id: this.state.endpointData.audit_pbd_id
      //   },
      // })
      //   .then(response => {
      //     if (response.data.response_code === 500) {
      //       var getIndex = _.findIndex(this.state.checkpoints, { _id: response.data.data._id })
      //       if (getIndex !== -1) {
      //         this.state.checkpoints[getIndex] = response.data.data
      //       }
      //       this.setState({
      //         checkpoints: this.state.checkpoints,
      //       }, function () {
      //         this.getCheckpointStatus()
      //         this.filterCheckpoints(this.state.filterStatus)
      //       })
      //     }
      //   })


      urlSocket.post("epadtprcs/reviewcheckpoints", {
        userInfo: {
            _id: this.state.userData._id,
            company_id: this.state.userData.company_id,
            encrypted_db_url: this.state.db_info.encrypted_db_url,
        },
        endpointInfo: this.state.endpointData,
        checkpointInfo: item,
        auditInfo: {
            audit_pbd_id: this.state.endpointData.audit_pbd_id,
        },
    })
    .then(response => {
        if (response.data.response_code === 500) {
            this.avForm.current.reset();
            const updatedCheckpoints = [...this.state.checkpoints]; // Create a copy of the checkpoints array
            const getIndex = updatedCheckpoints.findIndex(checkpoint => checkpoint._id === response.data.data._id);
            
            if (getIndex !== -1) {
                updatedCheckpoints[getIndex] = response.data.data; // Update the specific checkpoint
                this.setState({
                    checkpoints: updatedCheckpoints, // Update the state with the new array
                    reason:""
                }, () => {
                    this.getCheckpointStatus();
                    this.filterCheckpoints(this.state.filterStatus);
                });
            }
        }
    });
    

    } catch (error) {
      console.log("catch error", error)
    }


  }

  //-------------- signature ----------------------------



  checkReviewerSigned = () => {
    var indexOfAuditSigned = _.findIndex(this.state.endpointData.audit_signature, {
      audit_user_id: this.state.userData._id,
    });
    this.setState({ isReviewerSigned: indexOfAuditSigned === -1 ? false : true }, () => {
      this.setState({
        // signee: this.state.isReviewerSigned ? this.state.signee :this.state.userData.first_name,
        signeeDesignation: this.state.isReviewerSigned ? this.state.signeeDesignation : this.state.userData.designation,
        isDisabled: this.state.isReviewerSigned ? false : true,
        custom_div: true,
        signmodal: true,
        sign_valid: true
      })
    })

  }


  submit = () => {

    if (this.state.signee === null || this.state.signeeDesignation === null) {
      this.setState({ sign_valid: true, signboard_message: "Enter Name / Designation" })
    }
    else {
    if (!this.state.issign_empty) {

      this.setState({ signmodal: false })

      this.canvas.current.exportImage("png").then(data => {
        // console.log(data,'data')
        this.setState({ sign_url: data })
        var ImageURL = data
        var block = ImageURL.split(";");
        var contentType = block[0].split(":")[1];// In this case "image/gif"
        var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
        var blob = this.b64toBlob(realData, contentType);
        // console.log(realData,contentType)

        this.sign_upload(blob)
      })
        .catch((error) => { console.log("--catch error ---", error) })

    }
    else {
      this.setState({ sign_valid: true, signboard_message: "No signature in board" })
    }
    }



  }

  b64toBlob(b64Data, contentType, sliceSize) {
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




  clear = () => { this.canvas.current.clearCanvas(); this.setState({ sign_url: null, up_sign_url: null, issign_empty: true, sign_valid: false }) }
  undo = () => { this.canvas.current.undo() }
  redo = () => { this.canvas.current.redo() }

  deleteSignature(id) {
    var getIndex = _.findIndex(this.state.endpointData.audit_signature, { id: id })
    this.state.endpointData.audit_signature.splice(getIndex, 1)

    urlSocket.post('epadtprcs/updatesignature', {
      auditInfo: {
        audit_pbd_id: this.state.endpointData.audit_pbd_id,
      },
      userInfo: {
        _id: this.state.userData._id,
        company_id: this.state.userData.company_id,
        encrypted_db_url : this.state.db_info.encrypted_db_url
      },
      endpointInfo: this.state.endpointData
    })
      .then((response) => {
        if (response.data.response_code === 500) {

          this.setState({
            // signee: null,
            issign_empty: true,
            refresh: true
          })
        }
      })

  }

  sign_upload = async (image_info) => {

    const img = new FormData()
    let u_id = uuid()

    img.append('image', image_info, u_id + 'sign.png')

    await urlSocket.post('storeImage/awswebupload', img,{
      headers: {
        'Content-Type': 'multipart/form-data', // Set the Content-Type header
      },
    })
      .then((res) => {
        if (res.status == 200) {
          let splitString = res.data.data[0].key.split("/");
          let getFileName = splitString[splitString.length - 1];
          //this.setState({ up_sign_url: String(u_id) + 'sign.png' })
          // console.log("uploaded _sign", res)
          this.update_sign(u_id, getFileName)
        }
      })
  }

  update_sign = (u_id, fileName) => {
    // var sign_by = sessionStorage.getItem()
    var signature = {
      "id": String(u_id),
      "name": fileName,
      "sign_by": this.state.signee,
      "designation": this.state.signeeDesignation,
      "preview": fileName,
      "uploading": false,
      "filetype": "image/png",
      "uploadingStatus": "Uploaded",
      "originalName": fileName,
      //"captured_on": new Date(),
      "path": fileName,
      "type": "image/png",
      "uri": fileName,
      "audit_user_id": !this.state.isAuditSigned ? this.state.userData._id : "",
      "review_user_id": "",

    }
    var endpointData={...this.state.endpointData}
    endpointData["audit_signature"] = endpointData["audit_signature"].concat([signature])


    
    urlSocket.post('epadtprcs/updatesignature', {
      auditInfo: {
        audit_pbd_id: endpointData.audit_pbd_id
      },
      userInfo: {
        _id: this.state.userData._id,
        company_id: this.state.userData.company_id,
        encrypted_db_url: this.state.db_info.encrypted_db_url
      },
      endpointInfo: endpointData
    })
      .then((response) => {
        if (response.data.response_code === 500) {

          this.setState({
            signee: null,
            issign_empty: true,
            refresh: true.valueOf,
            endpointData
          })
        }
      })
  }

  // updateSign = async (u_id, fileName) => {
  //   const signature = {
  //     // Your signature properties here
  //   };
  
  //   this.state.endpointData["audit_signature"].push(signature);
  
  //   try {
  //     const response = await urlSocket.post('epadtprcs/updatesignature', {
  //       auditInfo: {
  //         audit_pbd_id: this.state.endpointData.audit_pbd_id,
  //       },
  //       userInfo: {
  //         _id: this.state.userData._id,
  //         company_id: this.state.userData.company_id,
  //         encrypted_db_url: this.state.db_info.encrypted_db_url,
  //       },
  //       endpointInfo: this.state.endpointData,
  //     });
  
  //     if (response.data.response_code === 500) {
  //       this.setState({
  //         signee: null,
  //         issign_empty: true,
  //         refresh: true,
  //       });
  //     }
  //   } catch (error) {
  //     // Handle other possible errors here
  //     console.error('Error:', error);
  //   }
  // };
  


  del_sign = () => {
    this.props.del_sign(this.props.entity_id, this.props.current_data)
  }

  //-----------------------------------------------------

  validateReview() {

    var indexOfAuditSigned = _.findIndex(this.state.endpointData.audit_signature, {
      audit_user_id: this.state.userData._id,
    });

    var isrevSigned = indexOfAuditSigned === -1 ? false : true
    var checkpoints = _.filter(this.state.checkpoints,{document_type :"2"})
    console.log(checkpoints,this.state.rvd,'this.state.rvd')
    if (this.state.rvd !== checkpoints.length) {

      this.setState({
        showWarning: true,
        submitMessage: "Cannot submit till all the checkpoints reviewed"
      })


    }
    else {
      if (this.state.rtk > 0) {
        if (this.state.remarks !== "" && this.state.remarks.length >= 5) {
          this.setState({
            confirm_both: true,
            confirmFrom: "reviewSubmit"
          })
        }
        else {
          this.setState({
            showWarning: true,
            submitMessage: "Enter remarks or remarks should be 5 or more characters"
          })
        }
      }
      else if (this.state.rjd > 0) {
        if (this.state.remarks === "" && this.state.remarks.length < 5) {
          this.setState({
            showWarning: true,
            submitMessage: "Enter remarks or remarks should be 5 or more characters"
          })
          return
        }
        if (!isrevSigned) {
          this.setState({
            showWarning: true,
            submitMessage: "Reviewer Signature is required"
          })
        }
        else {
          this.setState({
            confirm_both: true,
            confirmFrom: "reviewSubmit"
          })
        }
      }
      else {
        if (!isrevSigned) {
          this.setState({
            showWarning: true,
            submitMessage: "Reviewer Signature is required"
          })
        }
        else {
          this.setState({
            confirm_both: true,
            confirmFrom: "reviewSubmit"
          })
        }
      }
    }






    // else {
    //   this.setState({
    //     confirm_both: true,
    //     confirmFrom: "reviewSubmit"
    //   })
    // }

  }

  submitReviewAudit() {
    var checkpoints = _.filter(this.state.checkpoints,{document_type :"2"})


    var historyData = {
      "submitted_by": this.state.userData._id,
      "submitted_on": new Date(),
      "remarks": this.state.remarks
    }
    var endpointData={...this.state.endpointData}
    endpointData.ep_review_history.push(historyData)
    endpointData.updated_on = new Date();
    endpointData.audit_reviewed_on = new Date();

    if (this.state.rtk > 0) {
      endpointData.status = "5";
      endpointData.audit_cp_status = "Retake";
    }
    else {
      endpointData.status = "7";
      endpointData.audit_cp_status = "Reviewed";
    }


    endpointData.review_status = "1";

    this.setState({
      endpointData: endpointData
    }, () => {
      const sum_of_reviewscore = _.sumBy(
        checkpoints.filter(obj => obj.cp_review_status === "1"),
        obj => parseFloat(obj.cp_otpion_score.$numberDecimal)
      );
      // console.log(sum_of_reviewscore, 'sum_of_auditscore')
      endpointData["review_score"] = sum_of_reviewscore
      try {

        urlSocket.post("epadtprcs/updatereviewendpoint", {
          auditInfo: {
            audit_pbd_id: endpointData.audit_pbd_id
          },
          userInfo: {
            _id: this.state.userData._id,
            company_id: this.state.userData.company_id,
            encrypted_db_url: this.state.db_info.encrypted_db_url,
            designation: this.state.signeeDesignation
          },
          endpointInfo: endpointData
        })
          .then(async response => {
            if (response.data.response_code === 500) {
              var checkpoints = _.filter(this.state.checkpoints, { document_type: "2" });
              const sum_of_auditscore = _.sumBy(checkpoints, obj => parseFloat(obj.cp_otpion_score.$numberDecimal));
              const updatedEndpointData = { ...this.state.endpointData, audit_score: sum_of_auditscore };
              // console.log(updatedEndpointData, 'updatedEndpointData', checkpoints)
              const action_plan_checkpoints = _.filter(checkpoints, checkpoint => checkpoint.cp_actionplans.length > 0);
              const allResponsiblePersons = _.flatMap(action_plan_checkpoints, 'cp_actionplans')
                .flatMap(actionPlan => _.get(actionPlan, 'responsible_person', []));
          
              const uniqueUsers = _.uniqBy(allResponsiblePersons, 'user_id');
          
              console.log(uniqueUsers)
          
              updatedEndpointData["audit_ac_plan_resp_persons"] = uniqueUsers
              updatedEndpointData["activity_id"]= JSON.parse(sessionStorage.getItem("auditData")).audit_pbd_id


              if(updatedEndpointData.status === "7"){
                updatedEndpointData["location_permission_acpln"] = uniqueUsers
                var createActionPlan = await this.crudActionPlanTask(updatedEndpointData, this.state.userData, this.state.db_info)
                
              }

              this.setState({
                endpointData: endpointData
              })
              this.props.history.push("/usrenpdts");
            }

          })

      } catch (error) {
        console.log("catch error", error)
      }
    })
  }



  crudActionPlanTask = (updatedEndpointData, userData, db_info) => {

    // try {
      try {

        urlSocket.post("task/task-cln"
          , {
            auditInfo: {
              audit_pbd_id: updatedEndpointData.audit_pbd_id
            },
            userInfo: {
              _id: userData._id,
              encrypted_db_url: db_info.encrypted_db_url,
              company_id: userData.company_id,
            },
            endpointInfo: updatedEndpointData
          })
          .then(async response => {
            console.log(response,'response')
            if (response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Audit Published & Action Plan Task Created Successfully',
                text: 'Audit published successfully',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Go to Locations',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.props.history.push("/usrenpdts");
                }

              })
            }
          });
      } catch (error) {
        //.log("catch error", error)
      }

    // } catch (error) {

    // }

  }


  updateSign = async (u_id, fileName) => {
    const signature = {
      // Your signature properties here
    };
  
    this.state.endpointData["audit_signature"].push(signature);
  
    try {
      const response = await urlSocket.post('epadtprcs/updatesignature', {
        auditInfo: {
          audit_pbd_id: this.state.endpointData.audit_pbd_id,
        },
        userInfo: {
          _id: this.state.userData._id,
          company_id: this.state.userData.company_id,
          encrypted_db_url: this.state.db_info.encrypted_db_url,
        },
        endpointInfo: this.state.endpointData,
      });
  
      if (response.data.response_code === 500) {
        this.setState({
          signee: null,
          issign_empty: true,
          refresh: true,
        });
      }
    } catch (error) {
      // Handle other possible errors here
      console.error('Error:', error);
    }
  };
  

  editReason(item) {

    this.setState({
      modal: true,
      selectedItem: item,
      reason: item.cp_review_reason
    })

  }

  retakeAuditConfirm() {
    this.setState({
      confirm_both: true,
      confirmFrom: "retakeSubmit"
    })
  }

  submitReviewAll = (review_status) => {
    var checkpointInfo = _.cloneDeep(this.state.checkpoints)
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
      item.cp_review_by_id = this.state.userData._id
    })

console.log(checkpointInfo,'checkpointInfo');
    this.setState({ checkpoints: checkpointInfo }, () => {
      var rtk = _.filter(this.state.checkpoints, { cp_review_status: "-2" }).length
      var apvd = _.filter(this.state.checkpoints, { cp_review_status: "1" }).length
      var rjd = _.filter(this.state.checkpoints, { cp_review_status: "0" }).length
      var rvd = rtk + apvd + rjd
      this.setState({
        rtk, apvd, rjd, rvd
      }, () => {
        this.updateEndpointData()
        this.updateReviewAll()
      })


    })

  }

  updateReviewAll = () => {
    console.log(this.state.filterStatus,'filterStatus');
    try {

      urlSocket.post("epadtprcs/updateAllCheckpoints", {
        userInfo: {
          _id: this.state.userData._id,
          company_id: this.state.userData.company_id,
          encrypted_db_url: this.state.db_info.encrypted_db_url
        },
        endpointInfo: this.state.endpointData,
        checkpoints: this.state.checkpoints,
        auditInfo: {
          audit_pbd_id: this.state.endpointData.audit_pbd_id
        },
      })
        .then(response => {
          console.log(response,'response')
          if (response.data.response_code === 500) {
            var responseCheckpoints = response.data.data
            this.setState({
              checkpoints: responseCheckpoints
              // _.filter(responseCheckpoints, { document_type: "2" }),
            }, () => {
              this.getCheckpointStatus()
              this.filterCheckpoints(this.state.filterStatus)
            })

          }
        })

    } catch (error) {
      console.log("catch error", error)
    }
  }


  render() {
    if (this.state.dataloaded) {
      this.canvas = React.createRef();
      var checkpoints = _.filter(this.state.checkpoints,{document_type :"2"})
      return (
        <React.Fragment>
          <div className="page-content" >
           
            <MetaTags>
              <title>AuditVista | Review Check points</title>
            </MetaTags>
            {/* <div style={{ width: '100%', display: 'flex', flexDirection: 'row', marginBottom: 20, alignItems: 'center' }}>
              <div style={{ width: '80%', padding: '0 20px', display: 'flex', justifyContent: 'flex-start' }}>
                Review Check points
              </div>
              <div style={{ width: '20%', padding: '0 20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Link to="/usrenpdts"><Button color="primary">Back <i className="mdi mdi-arrow-left"></i></Button></Link>
              </div>
            </div> */}


            <Breadcrumbs
              title="Review Check points"
              // breadcrumbItem={'Check points'}
              isBackButtonEnable={true}
              gotoBack={() => { this.props.history.push('/usrenpdts') }}
            />





            <Container fluid>

              <Card body>
                <Row>
                  <Col lg={12}>
                    <CardTitle className="h3 mt-0">
                      {this.state.endpointData.audit_pbd_name}
                    </CardTitle>
                    <CardText>
                      {this.state.endpointData.name}{" / "}{this.state.endpointData.code}
                    </CardText>

                    <Row>
                      <Col lg={8}>
                        <div>
                          <Link to="#" className="badge badge-soft-dark font-size-14 me-3" onClick={() => { this.setState({ filterStatus: "all" }); this.filterCheckpoints("all") }}>
                            Total check points{" - "}{checkpoints.length}
                          </Link>
                          <Link to="#" className="badge badge-soft-secondary font-size-14 me-3" onClick={() => { this.setState({ filterStatus: "nr" }); this.filterCheckpoints("nr") }}>
                            Not Reviewed{" - "}{this.state.nr}
                          </Link>
                          <Link to="#" className="badge badge-soft-info font-size-14 me-3" onClick={() => { this.setState({ filterStatus: "r" }); this.filterCheckpoints("r") }}>
                            Reviewed{" - "}{this.state.rwd}
                          </Link>
                        </div>
                      </Col>

                      <Col lg={4} className="d-flex align-item-center justify-content-center">
                        <div>
                          <Link to="#" className="badge badge-soft-success font-size-14 me-3" onClick={() => { this.submitReviewAll("1") }}>
                            Accept all
                          </Link>
                          <Link to="#" className="badge badge-soft-danger font-size-14 me-3" onClick={() => { this.submitReviewAll("0") }}>
                            Reject all
                          </Link>
                          <Link to="#" className="badge badge-soft-dark font-size-14 me-3" onClick={() => { this.submitReviewAll("-2") }}>
                            Retake all
                          </Link>
                        </div>
                      </Col>
                    </Row>


                  </Col>

                </Row>
              </Card>

              <div className="d-xl-flex">
                <div className="w-100">
                  <div className="d-md-flex">

                    {/* 1st block */}

                    <div className="w-100 pb-3 me-md-2 overflow-auto" style={{ maxHeight: this.state.height - 250 }} >

                      <div className="d-flex flex-column">

                        {
                          this.state.filteredData.map((item, i) => {
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
                                    <span className="font-size-13">{item.checkpoint}</span>
                                  </div>
                                  {
                                    console.log(item,'item')
                                  }

                                  {
                                    item.checkpoint_type_id === "1" || item.checkpoint_type_id === "2" ?
                                      <ReviewOPType
                                        options={item.checkpoint_options}
                                        get_btn_color={item}

                                      />
                                      : null
                                  }

                                  {
                                    item.cp_attach_images.length !== 0 ?
                                      <div className="mt-3 mb-4">
                                        <label>Images Attached</label>
                                        <PreviewImage
                                          imagePreviewUrl={this.state.imagePreviewUrl}
                                          images={item.cp_attach_images}
                                        />
                                      </div> : null
                                  }

{
                                    item.cp_attach_videos.length !== 0 ?
                                      <div className="mt-3 mb-4">
                                        <label>Videos Attached</label>
                                        <PreviewVideo
                                          imagePreviewUrl={this.state.imagePreviewUrl}
                                          videos={item.cp_attach_videos}
                                        />
                                      </div> : null
                                  }

                                  {
                                    item.cp_documents.length !== 0 ?
                                      <div className="my-4">
                                        <label>Documents Attached</label>
                                        {/* {
                                          console.log(this.state.imagePreviewUrl, item.cp_documents)
                                        } */}
                                        <PreviewDocuments
                                          imagePreviewUrl={this.state.imagePreviewUrl}
                                          images={item.cp_documents}
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
                                    item.cp_actionplans.length !== 0 ?
                                      <div className="my-4">
                                        <label>CAPA</label>
                                        <PreviewCAPA
                                          actionplans={item.cp_actionplans}
                                        />
                                      </div> : null
                                  }



                                  <div className="row p-2">
                                    <div className="button-items mb-1">
                                      <div className="btn-group mt-2 mt-xl-0" role="group" aria-label="Basic radio toggle button group">
                                        <input type="radio"
                                          className="btn-check"
                                          name={i + "btnradio0"} id={i + "btnradio0"} autoComplete="off"
                                          checked={item.cp_review_status === "1"}
                                          onClick={() => { this.onSelected(item, "1") }}
                                        // disabled={this.state.endpointData.status === "4"}
                                        />
                                        <label className="btn btn-outline-success btn-sm"
                                          htmlFor={i + "btnradio0"}>Accept</label>

                                        <input type="radio"
                                          className="btn-check"
                                          name={i + "btnradio1"}
                                          id={i + "btnradio1"}
                                          autoComplete="off"
                                          checked={item.cp_review_status === "0"}
                                          onClick={() => { this.onSelected(item, "0") }}
                                        // disabled={this.state.endpointData.status === "4"}
                                        />
                                        <label className="btn btn-outline-danger btn-sm" htmlFor={i + "btnradio1"}>Reject</label>

                                        <input type="radio"
                                          className="btn-check"
                                          name={i + "btnradio2"}
                                          id={i + "btnradio2"}
                                          autoComplete="off"
                                          checked={item.cp_review_status === "-2"}
                                          onClick={() => { this.onSelected(item, "-2") }}
                                        // disabled={this.state.endpointData.status === "4"}
                                        />
                                        <label className="btn btn-outline-dark btn-sm" htmlFor={i + "btnradio2"}>Retake</label>
                                      </div>
                                    </div>
                                  </div>


                                  {
                                    item.cp_review_status === "0" || item.cp_review_status === "-2" ?
                                      <div>
                                        <label>Reason </label> {this.state.endpointData.status === "3" ? <Link to="#" onClick={() => this.editReason(item)}><i className="mdi mdi-pencil font-size-20 text-primary" /></Link> : null}
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
                          <AvForm className="form-horizontal" onValidSubmit={this.handleValidSubmit}>
                            <div className="" >
                              <label>Remarks</label>
                              <AvField
                                name="remarks"
                                value={this.state.remarks}
                                onChange={(e) => { this.setState({ remarks: e.target.value }) }}
                                className="form-control"
                                placeholder="Enter remarks"
                                type="textarea"
                                style={{ height: 150 }}
                                disabled={this.state.isRemDisabled}
                                required
                              />
                            </div>
                          </AvForm>
                        </div>
                      }
                      {/* {
                        console.log(this.state.endpointData.audit_signature,'this.state.endpointData.audit_signature')
                      } */}
                      {
                        this.state.endpointData.audit_signature.length !== 0 ?
                          <div>
                            {
                              this.state.endpointData.audit_signature.map((item, i) => {
                                return (
                                  <Card
                                    className="mt-1 mb-2 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                    key={i + "-signfile"}
                                  >
                                    <div style={{ display: 'flex', flexDirection: 'row' }} >
                                      <div className="p-2 col-10" >
                                        <label className="mb-1 font-size-11">{item.sign_by}<br />{item.designation}</label>
                                        <img height="80" src={this.state.imagePreviewUrl + item.name} />
                                      </div>
                                      {
                                        item.audit_user_id === this.state.userData._id &&
                                        <div className="col-2 text-end me-2" style={{ lineHeight: 1.3 }}>
                                          <Link to="#" onClick={() => this.deleteSignature(item.id)}><i className="mdi mdi-close-circle-outline font-size-20 text-danger" /></Link>
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
                        this.state.rtk === 0 &&
                        <div className="my-2">
                          <div className="">
                            <Button
                              color="primary"
                              onClick={() => { this.checkReviewerSigned() }}
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
                          <Button outline color="success" onClick={() => this.validateReview()}>Submit audit review</Button>
                        </div>
                        // : null
                      }
                    </Card>

                  </div>
                </div>
              </div>





              {this.state.showWarning ? (
                <SweetAlert
                  title="Message"
                  warning
                  onConfirm={() => this.setState({ showWarning: false })}
                >
                  {this.state.submitMessage}
                </SweetAlert>
              ) : null}

              <Modal
                isOpen={this.state.signmodal}
                className={this.props.className}
              >
                <ModalHeader toggle={this.signmodaltoggle} tag="h4">
                  Signature
                </ModalHeader>
                <ModalBody>
                  <AvForm className="form-horizontal" onValidSubmit={this.handleValidSubmit}>
                    <div className="mb-3" >
                      <AvField
                        name="signee"
                        value={this.state.isReviewerSigned ? "" :this.state.userData.firstname}
                        onChange={(e) => { this.setState({ signee: e.target.value }) }}
                        className="form-control"
                        placeholder="Enter signee name"
                        type="input"
                        disabled={this.state.isDisabled}
                        required
                      />
                    </div>
                    <div className="mb-3" >
                      <AvField
                        name="designation"
                        value={this.state.isReviewerSigned ? '' : this.state.userData.designation}
                        onChange={(e) => { this.setState({ signeeDesignation: e.target.value }) }}
                        className="form-control"
                        placeholder="Enter designation"
                        type="input"
                      // disabled = {this.state.userData.designation ==="" ? false : this.state.isDisabled}
                      // required
                      />
                    </div>


                    <ReactSketchCanvas
                      ref={this.canvas}
                      style={styles}
                      width="600"
                      height="400"
                      strokeWidth={4}
                      strokeColor="red"
                      onStroke={() => this.setState({ issign_empty: false, sign_valid: false })}
                    />
                    {
                      this.state.sign_valid ? <div className="m-2"><label className="text-danger">{this.state.signboard_message}</label></div> : null
                    }

                    <Button className="my-2 me-2" color="primary" onClick={this.submit}>Submit</Button>
                    <Button className="my-2 me-2" color="warning" onClick={this.clear}>Clear</Button>
                    <Button className="my-2" color="danger" onClick={() => this.setState({ modal: false ,signmodal : false })}>Cancel</Button>
                  </AvForm>
                </ModalBody>
              </Modal>

              <Modal
                isOpen={this.state.modal}
                className={this.props.className}
              >
                <ModalHeader toggle={this.modaltoggle} tag="h4">
                  Reason for rejection
                </ModalHeader>
                <ModalBody>
                  <AvForm ref={this.avForm} className="form-horizontal" onValidSubmit={this.handleValidSubmit}>
                    <div className="mb-3" >
                      <AvField
                        name="reason"
                        value={this.state.reason}
                        onChange={(e) => { this.setState({ reason: e.target.value }) }}
                        className="form-control"
                        placeholder="Enter reason"
                        type="textarea"
                        required
                      />
                      {
                        this.state.showTxtMessage &&
                        <div className="text-danger" style={{fontSize : 'smaller'}}>Reason for reject is required!</div>
                      }
                    </div>
                    <Button className="my-2 me-2" color="primary" onClick={() => this.onSubmitReason(this.state.selectedItem)}>Submit</Button>
                    {/* <Button className="my-2" color="danger" onClick={() => this.setState({ modal: false })}>Cancel</Button> */}
                    <Button className="my-2" color="danger" onClick={() => this.modaltoggle()}>Cancel</Button>

                    {/* modaltoggle */}
                  </AvForm>
                </ModalBody>
              </Modal>

              {this.state.confirm_both ? (
                <SweetAlert
                  title="Are you sure?"
                  warning
                  showCancel
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() =>
                    this.setState({
                      confirm_both: false,
                      success_dlg: true,
                      dynamic_title: "Deleted",
                      dynamic_description: "Your file has been deleted.",
                    },
                      function () {
                        this.submitReviewAudit()
                        // if (this.state.confirmFrom === "reviewSubmit") {
                        //   this.submitReviewAudit()
                        // }
                        // else {
                        //   this.retakeAudit()
                        // }

                      }
                    )
                  }
                  onCancel={() =>
                    this.setState({
                      confirm_both: false,
                      error_dlg: true,
                      dynamic_title: "Cancelled",
                      dynamic_description:
                        "Your imaginary file is safe :)",
                    })
                  }
                >
                  You won't be able to revert this!
                </SweetAlert>
              ) : null}

            </Container>
          </div>
        </React.Fragment>
      )
    }
    else {
      return null
    }
  }

}