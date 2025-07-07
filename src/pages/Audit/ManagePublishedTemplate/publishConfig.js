import urlSocket from 'helpers/urlSocket';
import React, { useEffect, useState,useRef } from 'react'
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import { useNavigate } from 'react-router-dom';
import { Row, Col, Offcanvas, CardFooter, FormGroup, Container, Input, Nav, Button, TabContent, Label, TabPane, ListGroup, ListGroupItem, Card, CardBody, CardTitle, Spinner, NavItem, NavLink, OffcanvasHeader, OffcanvasBody } from 'reactstrap';
import { MetaTags } from 'react-meta-tags';
import _, { values } from 'lodash';
import Validation from './Functions/validation';
import { Badge } from 'antd';
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import classnames from 'classnames';
import Swal from 'sweetalert2';
import AddEndpointNode from './Components/AddEndpointNode';
import LoadEndpoint from './Components/LoadEndpoints'
import ImportUser from './Components/ImportUser';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setpublishTemplate, setReviewSchedule,setHierarchyData,setUserList,retriveHierarchyUsers, setNavItems,getLocationList,updateEndpointsData, updatepublishedTempData,retriveTemplateList,levelDataList,retriveHlevelMethod,updateHierarchyData, clearMasterAuditData } from 'toolkitStore/Auditvista/ManageAuditSlice';
import store from 'store';
import LocationList from './Components/LocationList';
import ScheduleConfiguration from './Components/ScheduleConfiguration';
import { usePermissions } from 'hooks/usePermisson';
import ReviewSchedule from './Components/ReviewSchedule';
import ConfirmPublish from './Components/ConfirmPublish';
import LocationUserList from './Components/LocationUserList';
import ReportScheduling from './Components/ReportScheduling';

const PublishConfig = () => {
  const dispatch = useDispatch()
  const manageAuditSlice = useSelector(state => state.manageAuditSlice)
  const publishTemplate = manageAuditSlice.publishTemplate
  const hierarchyData = manageAuditSlice.hierarchyData
  const [authUser, setauthUser] = useState(null)
  const [ccLevel, setccLevel] = useState(null)
  const [dataLoaded, setdataLoaded] = useState(false)
  const [component, setcomponent] = useState("")
  const [open, setopen] = useState(false)
  const [hirerachyData, sethirerachyData] = useState([])
  const [endpoints, setEndpoints] = useState([])
  const [dataSource, setdataSource] = useState([])
  const [auditUserlevelSelected, setauditUserlevelSelected] = useState(false)
  const [customEnableReview, setcustomEnableReview] = useState(false)
  const [reviewUserlevelSelected, setreviewUserlevelSelected] = useState(false)
  const [repeatMode, setrepeatMode] = useState("")
  const [selectedRepeatMode, setselectedRepeatMode] = useState("")
  const [activeCustomTab, setactiveCustomTab] = useState(1)
  const [statusBasedFilteredData, setstatusBasedFilteredData] = useState([])
  // const [hierarchyData,sethierarchyData] = useState(null)
  const [userData, setuserData] = useState([])
  const [hList, sethList] = useState([])
  const [userGroupSelected, setuserGroupSelected] = useState('')
  const [editItem, setEditItem] = useState("")
  const [activeTab, setactiveTab] = useState(1)
  const [enablePublishType, setenablePublishType] = useState(false)
  const [hlevelData, sethlevelData] = useState([])
  const [hTree, setHtree] = useState([])
  const [treeNodes, setTreenodes] = useState([])
  const [selectedLvl, setselectedLvl] = useState("choose")
  const [checkedKeys, setcheckedKeys] = useState([])
  const [renderLocation, setrenderLocation] = useState(false)
  const [renderSchedule, setrenderSchedule] = useState(false)
  const [renderReviewSchedule, setrenderReviewSchedule] = useState(false)
  const [renderConfirmPublish, setrenderConfirmPublish] = useState(false)
  const [renderReportSchedule, setrenderReportSchedule] = useState(false)
  const [openUserList, setopenUserList] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState([]);


  const formRef = useRef(null);
  const navItems = manageAuditSlice.navItems


  const {canView,canEdit} = usePermissions("mngpblhtempt")
  console.log(canView,canEdit,'canView,canEdit')

  console.log(publishTemplate,'publishTemplate',manageAuditSlice)
  const history = useNavigate()


  useEffect(() => {
    ////console.log("object");
    const fetchData = async () => {
      const publishTemplate = JSON.parse(sessionStorage.getItem("publishData"));
      await getTemplate(publishTemplate)
    }
    fetchData()
    




  }, [])


  useEffect(() => {
    if (treeNodes.length) {
      const allKeys = getAllKeys(treeNodes);
      setExpandedKeys(allKeys);
    }
  }, [treeNodes]);


  const getAllKeys = (nodes) => {
    let keys = [];
    nodes.forEach((node) => {
      keys.push(node.key);
      if (node.children) {
        keys = keys.concat(getAllKeys(node.children));
      }
    });
    return keys;
  };
     


  useEffect(() => {
    ////console.log(hTree, 'hTree');
    const processData = async (hTreeInfo) => {
      if (hTreeInfo.length > 0) {
        var treeNodes = await buildTreeNodes(hTreeInfo)
        ////console.log(treeNodes, 'treeNodes')
        setTreenodes(treeNodes)
      }
    }
    processData(hTree)
  }, [hTree])



  const onDrawerClose = async () => {
    setauditUserlevelSelected(false)
    setcomponent('')
    setopen(false)
    setopenUserList(false)
    getTemplate(publishTemplate)
  }




  const onCheck = async (checked, event, mode) => {
    var publishTemplateInfo = _.cloneDeep(publishTemplate)
    var hierarchyDataInfo = _.cloneDeep(hierarchyData)
    setrenderLocation(false)
    if (mode == "2") {
      var findIdx = _.findIndex(hierarchyDataInfo.endpoints, { _id: event.node.node_id })
      if (event.checked == true) {
        var endPointArray = {
          adt_users: [],
          code: event.node.code,
          designation: "",
          h_id: hierarchyDataInfo.hlvl_master_id,
          hlevel: event.node.ep_level,
          hlevel_name: event.node.label,
          hlevel_value: event.node.ep_level_value,
          user_path: event.node.user_path,
          unique_users: event.node.unique_users,
          user_permission_acpln: event.node.user_permission_acpln,
          _id: event.node.node_id,
          h_node_type: event.node.h_node_type,
          // dynamic_data : event.node.dynamic_data
        }
        hierarchyDataInfo.endpoints.push(endPointArray)
        hierarchyDataInfo["ep_selected"] = checked.checked
      }
      else {

        publishTemplateInfo["enable_review"] = false
        hierarchyDataInfo["ep_selected"] = checked.checked
        hierarchyDataInfo.endpoints.splice(findIdx, 1)
      }
      publishTemplateInfo["cc_level"] = checked.checked.length > 0 ? 1 : 0
      setcheckedKeys(checked.checked)
      await updateHData(hierarchyDataInfo)
      dispatch(setHierarchyData(hierarchyDataInfo))
      await updateEndpoints(checked.checked,"2",publishTemplateInfo.settings.enable_review,publishTemplateInfo)

    }
    else {
      publishTemplateInfo["cc_level"] = checked.length > 0 ? 1 : 0
      hierarchyDataInfo["ep_selected"] = checked
      await updateHData(hierarchyDataInfo)
      setcheckedKeys(checked)
      await updateEndpoints(checked,"1",publishTemplateInfo.settings.enable_review,publishTemplateInfo)
    }
    dispatch(setpublishTemplate(publishTemplateInfo))

  };



  const updateEndpoints = async (endpointsId,mode,reviewEnable,publishTemplateInfo) => {
    try {
      const responseData = await dispatch(updateEndpointsData(endpointsId,mode,reviewEnable,publishTemplateInfo))
      console.log(responseData, 'responseData');
      if (responseData.status === 200) {
        if (responseData.data.validEps) {
          publishTemplateInfo["cc_level"] = 2
          const updatedInfo = await dispatch(updatepublishedTempData(publishTemplateInfo))
        }
        else{
          const updatedInfo = await dispatch(updatepublishedTempData(publishTemplateInfo))
        }
        dispatch(setHierarchyData(responseData.data.hData[0]))
      }

    } catch (error) {
      ////console.log(error, 'error')
    }


  }




  const buildTreeNodes = (nodes) => {
    if (publishTemplate.hirearchy_type === "2") {
      ////console.log(nodes, 'nodes')
      return nodes.map((node) => {
        const { value, label, children, ep_level, code, ep_level_value, id, node_id, parent, user_path, unique_users, user_permission_acpln, h_node_type } = node;
        const hasChildren = (children && children.length > 0);
        return {
          key: value,
          label: label,
          user_path: user_path,
          unique_users: unique_users,
          h_node_type: h_node_type,
          value,
          ep_level,
          ep_level_value,
          id,
          node_id,
          parent,
          children: hasChildren ? buildTreeNodes(children) : [],
          user_permission_acpln: user_permission_acpln,
          code: code,
          title: (
            <div // Use a div container for the entire node
              // onClick={() => this.handleNodeClick(value)} // Handle node click
              style={{
                background: hasChildren ? 'transparent' : publishTemplate.hirearchy_type == "1" ? '#E6F4FF' : 'transparent',

                position: 'relative',
                zIndex: 'auto',
                minHeight: '24px',
                margin: '0',
                padding: '0 4px',
                color: 'inherit',
                lineHeight: '24px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s, border 0s, line - height 0s, box - shadow 0s'
              }}
            >
              {hasChildren && publishTemplate.hirearchy_type == "1" ? (
                <FolderOutlined style={{ cursor: 'unset', opacity: 0.5 }} />
              ) : (
                <FileOutlined
                  style={{
                    cursor: 'pointer',
                    color: '#556EE6',
                    opacity: 1,
                  }}
                />
              )}
              <span style={{ marginLeft: '4px', opacity: hasChildren && publishTemplate.hirearchy_type == "1" ? 0.5 : 1, fontWeight: hasChildren && publishTemplate.hirearchy_type == "1" ? '' : 600 }}>
                {label}
              </span>
            </div>
          ),

        };
      });
    }
    if (publishTemplate.hirearchy_type === "1") {
      return nodes.map((node) => {
        const { value, label, children, ep_level, code, ep_level_value, id, node_id, user_permission_acpln, parent, user_path, unique_users, h_node_type } = node;
        const hasChildren = (children && children.length > 0);
        return {
          key: value,
          label: label,
          user_path: user_path,
          unique_users: unique_users,
          h_node_type: h_node_type,
          value,
          ep_level,
          ep_level_value,
          id,
          node_id,
          code: code,
          parent,
          children: hasChildren ? buildTreeNodes(children) : [],
          user_permission_acpln: user_permission_acpln,

          title: (
            <div // Use a div container for the entire node
              // onClick={() => this.handleNodeClick(value)} // Handle node click
              style={{
                background: node.ep_level === sessionStorage.getItem("hlevel") && node.node_positon === sessionStorage.getItem("node_positon") ? "#E6F4FF" : "transparent",
                position: 'relative',
                zIndex: 'auto',
                minHeight: '24px',
                margin: '0',
                padding: '0 4px',
                color: 'inherit',
                lineHeight: '24px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s, border 0s, line - height 0s, box - shadow 0s'
              }}
            >
              {
                node.ep_level !== sessionStorage.getItem("hlevel") && node.node_positon !== sessionStorage.getItem("node_positon")
                  ? (
                    <FolderOutlined style={{ cursor: 'unset', opacity: 0.5 }} />
                  ) : (
                    <FileOutlined
                      style={{
                        cursor: 'pointer',
                        color: '#556EE6',
                        opacity: 1,
                      }}
                    />
                  )}
              <span style={{ marginLeft: '4px', opacity: node.ep_level === sessionStorage.getItem("hlevel") && node.node_positon === sessionStorage.getItem("node_positon") ? 1 : 0.5, fontWeight: node.ep_level === sessionStorage.getItem("hlevel") ? 600 : '' }}>
                {label}
              </span>

            </div>
          ),

        };
      });
    }
  };


  const resetAll=()=>{
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Do you want to clear all this data?',
      showCancelButton: true,
      confirmButtonColor: '#2ba92b',
      confirmButtonText: 'Yes',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No'
    }).then(async(result) => {
      if(result.isConfirmed){
          setrenderLocation(false)
          const publishTempInfo = _.cloneDeep(publishTemplate)
          await clearAllData(publishTempInfo)
        } 
    })
  }


  const clearAllData = async() => {
    const publishTemplateInfo = _.cloneDeep(publishTemplate)

    publishTemplateInfo["adt_based_on"]=null
    publishTemplateInfo["hirearchy_type"]=null
    publishTemplateInfo["adt_permissons"]=[]
    publishTemplateInfo["settings"]={
      enable_review: false,
      audit_qr_enable: false,
      review_qr_enable: false,
      audit_coords_enable: false,
      audit_score_preview: false,
      review_score_preview: false,
      review_coords_enable: false,
      allow_adt_task : false,
      allow_review_task : false,
      allow_incharge_task : false,

    }
    publishTemplateInfo["repeat_mode_config"]={mode: null,
    mode_id: null,
    start_date: null,
    end_date: null,
    days: [
        {
          day: "Sunday",
          day_id: "0",
          "checked": false
        },
        {
          day: "Monday",
          day_id: "1",
          "checked": false
        },
        {
          day: "Tuesday",
          day_id: "2",
          "checked": false
        },
        {
          day: "Wednesday",
          day_id: "3",
          "checked": false
        },
        {
          day: "Thursday",
          day_id: "4",
          "checked": false
        },
        {
          day: "Friday",
          day_id: "5",
          "checked": false
        },
        {
          day: "Saturday",
          day_id: "6",
          "checked": false
        },
      ],
    start_time: "00:00:00",
    end_time: "23:59:00",
    start_on: 1,
    ends_on: 28,
    mstartoption:null,
    mendoption:null,
  }

  publishTemplateInfo["repeat_mode_config_review"][0]={mode: null,
    mode_id: null,
    start_date: null,
    end_date: null,
    days: [
        {
          day: "Sunday",
          day_id: "0",
          "checked": false
        },
        {
          day: "Monday",
          day_id: "1",
          "checked": false
        },
        {
          day: "Tuesday",
          day_id: "2",
          "checked": false
        },
        {
          day: "Wednesday",
          day_id: "3",
          "checked": false
        },
        {
          day: "Thursday",
          day_id: "4",
          "checked": false
        },
        {
          day: "Friday",
          day_id: "5",
          "checked": false
        },
        {
          day: "Saturday",
          day_id: "6",
          "checked": false
        },
      ],
    start_time: "00:00:00",
    end_time: "23:59:00",
    start_on: 1,
    ends_on: 28,
    mstartoption:null,
    mendoption:null,
  }

    publishTemplateInfo["cc_level"]=0
    publishTemplateInfo["audit_start_date"]=null
    publishTemplateInfo["audit_end_date"]=null

    try {
      // const responseData = await urlSocket.post("webphlbconf/clear-masteraudit-data",{
      //   encrypted_db_url : authUser.db_info.encrypted_db_url,
      //   ref_id : publishTemplate._id,
      //   publishTemplateInfo
      // })
      const responseData = await dispatch(clearMasterAuditData(publishTemplateInfo))
      console.log(responseData,'responseData')
      if(responseData.status === 200){
        // formRef.current.reset()
        console.log(formRef,'formrefff')
        setrenderLocation(false)
        setrenderSchedule(false)
        dispatch(setpublishTemplate(publishTemplateInfo))
        dispatch(setHierarchyData(null))
        dispatch(setNavItems([
          { id: 1, label: 'Hierarchy Level', icon: 'bx bx-sitemap', minLevel: 0 },
          { id: 2, label: 'Audit / Review', icon: 'bx bxs-user', minLevel: 1 },
          { id: 3, label: 'Audit Schedule', icon: 'bx bx-cog', minLevel: 2 },
          // { id: 4, label: 'Report Schedule', icon: 'bx bx-cog', minLevel: 2 },
          { id: 6, label: 'Confirm & Publish', icon: 'bx bx-badge-check', minLevel: 4 },
        ]))
      }

    } catch (error) {
      ////console.log(error,'error')
    }

  }



  const getTemplate = async (publishTemplate) => {
    const authUser = JSON.parse(sessionStorage.getItem("authUser"));

    try {
      const response = await dispatch(retriveTemplateList(publishTemplate))
      console.log(response,'response');
      if (response.data.response_code === 500 && response.data.templateData.length > 0) {
        dispatch(setpublishTemplate(response.data.data))
        if (response.data.data?.settings?.enable_review === true) {
          dispatch(setNavItems([
            { id: 1, label: 'Hierarchy Level', icon: 'bx bx-sitemap', minLevel: 0 },
            { id: 2, label: 'Audit / Review', icon: 'bx bxs-user', minLevel: 1 },
            { id: 3, label: 'Audit Schedule', icon: 'bx bx-cog', minLevel: 2 },
            { id: 4, label: 'Review Schedule', icon: 'bx bx-cog', minLevel: 3 },
            // { id: 5, label: 'Report Schedule', icon: 'bx bx-cog', minLevel: 2 },
            { id: 6, label: 'Confirm & Publish', icon: 'bx bx-badge-check', minLevel: 4 },
          ]))

          const configData = JSON.parse(sessionStorage.getItem('authUser')).config_data
          const publishTempInfo = response.data.data
             var reviewModeType =[]
             if(publishTempInfo["repeat_mode_config"]["mode_id"] === "0"){
               reviewModeType = _.filter(configData.repeat_mode,{mode_id :publishTempInfo["repeat_mode_config"]["mode_id"]})
             }
            else if(publishTempInfo["repeat_mode_config"]["mode_id"] === "1"){
             console.log("object");
               configData.repeat_mode.map((ele,idx)=>{
                 if(ele.mode_id === "1" ||ele.mode_id === "2" || ele.mode_id === "3"){
                   reviewModeType.push(ele)
                 }
               })
             }
             else if(publishTempInfo["repeat_mode_config"]["mode_id"] === "2"){
               configData.repeat_mode.map((ele,idx)=>{
                 if(ele.mode_id=== "2" ||ele.mode_id === "3"){
                   reviewModeType.push(ele)
                 }
               })
             }
             else if(publishTempInfo["repeat_mode_config"]["mode_id"] === "3"){
               configData.repeat_mode.map((ele,idx)=>{
                 if(ele.mode_id === "3"){
                   reviewModeType.push(ele)
                 }
               })
             }
             dispatch(setReviewSchedule(reviewModeType))
             console.log(reviewModeType,'reviewModeType');
        }
        setccLevel(response.data.templateData[0].cc_level)
        setdataLoaded(true)
        setauthUser(authUser)
        dispatch(setHierarchyData(response.data.hData.length > 0 ? response.data.hData[0] : null))
        if (response.data.hData.length > 0) {
          setenablePublishType(true)
          if (response.data.data.adt_based_on === "1") {
            if (response.data.data.hirearchy_type === "1") {
              await retriveLevelInfo(response.data.hData[0], response.data.data)
            }
            if (response.data.hData[0]["ep_structure"].length > 0) {
              setHtree(response.data.hData[0]["ep_structure"])
              setcheckedKeys(response.data.hData[0]["ep_selected"])
            }
          }
          else if (response.data.data.adt_based_on === "0") {
            await dispatch(retriveHierarchyUsers(response.data.hData[0]))
          }   
        }
        gethlevelMethod()
      }
    } catch (error) {
      console.log(error,'error')
    }
  }


  const ccLevelValidation = async (publishTempInfo,hierarchyDataInfo) => {

    console.log(hierarchyDataInfo,'hierarchyDataInfo')
    if (hierarchyDataInfo.endpoints.length >0) {
      publishTempInfo["cc_level"] = 1
    }
    else {
      publishTempInfo["cc_level"] = 0

    }
    return publishTempInfo

  }





  const adtBasedOn = async (type) => {
    let publishTemplateInfo = _.cloneDeep(publishTemplate)
    let hierarchyDataInfo = _.cloneDeep(hierarchyData)
    publishTemplateInfo["adt_based_on"] = type
    publishTemplateInfo["hirearchy_type"] = null
    hierarchyDataInfo["ep_selected"] = []
    hierarchyDataInfo["ep_structure"] = []
    hierarchyDataInfo["endpoints"] = []
    hierarchyDataInfo["usr_selected"] = []
    const updatedData = await ccLevelValidation(publishTemplateInfo,hierarchyDataInfo)
    console.log(updatedData,'updatedData')
    if(type === "0"){
      await dispatch(retriveHierarchyUsers(hierarchyDataInfo))
    }
    else{
      dispatch(setUserList([]))
    }
    await updateTempMasterInfo(updatedData)
    await updateHData(hierarchyDataInfo)

  }


  const updateTempMasterInfo = async (publishTemplateInfo) => {
    console.log(publishTemplateInfo,'publishTemplateInfo');
    try {
      const responseData = await dispatch(updatepublishedTempData(publishTemplateInfo))
    } catch (error) {
      console.log(error,'error');
    }
  }


  const gethlevelMethod = async () => {
    const authUser = JSON.parse(sessionStorage.getItem("authUser"))
    const publishTemplate = JSON.parse(sessionStorage.getItem("publishData"));


    try {
      const response = await dispatch(retriveHlevelMethod(authUser,publishTemplate))
      console.log(response,'response')
      if (response.data.response_code == 500) {
        sethList(response.data.data.hlevelData)
      }

    } catch (error) {
      console.log(error,'error')
    }


  }

  const validateEndpoints = () => {
    const publishTemplateInfo = _.cloneDeep(publishTemplate)
    _.each(publishTemplateInfo.endpoints, item => {
      if (publishTemplateInfo.enable_review && (!_.some(item.adt_users, { audit_type: "2" }) || !_.some(item.adt_users, { audit_type: "1" }) || !_.some(item.adt_users, { audit_type: "3" }))) {
        item["rowValid"] = false
      }
      else if (!publishTemplateInfo.enable_review && !_.some(item.adt_users, { audit_type: "1" }) || !_.some(item.adt_users, { audit_type: "3" })) {
        item["rowValid"] = false
      }
      else {
        item["rowValid"] = true
      }
    })
    dispatch(setpublishTemplate(publishTemplateInfo))

  }

  const toggleTab = async (tab) => {
    console.log(tab,'tab')
    if (activeTab !== tab) {
      if (tab === 2) {
        setrenderLocation(true)
        setrenderSchedule(false)
        setrenderConfirmPublish(false)
        setrenderReviewSchedule(false)
        setrenderReportSchedule(false)
      }
     else if (tab === 3) {
        setrenderSchedule(true)
        setrenderLocation(false)
        setrenderConfirmPublish(false)
        setrenderReviewSchedule(false)
        setrenderReportSchedule(false)
      }
      else if (tab === 4) {
        setrenderReviewSchedule(true)
        setrenderConfirmPublish(false)
        setrenderSchedule(false)
        setrenderLocation(false)
        setrenderReportSchedule(false)
      }
      else if (tab === 5) {
        setrenderConfirmPublish(false)
        setrenderReviewSchedule(false)
        setrenderSchedule(false)
        setrenderLocation(false)
        setrenderReportSchedule(true)
      }
      else if (tab === 6) {
        setrenderConfirmPublish(true)
        setrenderReviewSchedule(false)
        setrenderSchedule(false)
        setrenderLocation(false)
        setrenderReportSchedule(false)
      }
      setactiveTab(tab)
    }
  }


  const selectLevel = async (event) => {
    console.log('event', event.target.value, hList)
    // var hirerachyData = hList[parseInt(event.target.value) - 1] //JSON.parse(event.target.value)

    const selectedId = event.target.value; 
    console.log('Selected ID:', selectedId);
    const hirerachyData = hList.find(item => item._id === selectedId);
    console.log('hirerachyData', hirerachyData)

    console.log('hirerachyData', hirerachyData)
    var publishtemplateInfo = _.cloneDeep(publishTemplate)
    var hlevelData = {
      ep_structure: [],
      ep_selected: [],
      endpoints: [],
      hlevel: hirerachyData.hname,
      hlvl_master_id: hirerachyData._id,
      ref_id: publishtemplateInfo._id,
      branch_id: publishtemplateInfo.branch_id,
      dept_id: publishtemplateInfo.dept_id,
      template_name: publishtemplateInfo.template_name,
      created_by: publishtemplateInfo.created_by,
    }
    publishtemplateInfo.settings = {
      enable_review: false,
      audit_qr_enable: false,
      review_qr_enable: false,
      audit_coords_enable: false,
      audit_score_preview: false,
      review_score_preview: false,
      review_coords_enable: false,
      review_pdf_download : false,
      review_acplan_create : false,

    }
    publishtemplateInfo.audit_start_date = null
    publishtemplateInfo.audit_end_date = null
    publishtemplateInfo.hirearchy_type = null
    publishtemplateInfo.cc_level = 0
    publishtemplateInfo.adt_based_on=null
    publishtemplateInfo.repeat_mode_config={mode: null,
      mode_id: null,
      start_date: null,
      end_date: null,
      days: [
          {
            day: "Sunday",
            day_id: "0",
            "checked": false
          },
          {
            day: "Monday",
            day_id: "1",
            "checked": false
          },
          {
            day: "Tuesday",
            day_id: "2",
            "checked": false
          },
          {
            day: "Wednesday",
            day_id: "3",
            "checked": false
          },
          {
            day: "Thursday",
            day_id: "4",
            "checked": false
          },
          {
            day: "Friday",
            day_id: "5",
            "checked": false
          },
          {
            day: "Saturday",
            day_id: "6",
            "checked": false
          },
        ],
      start_time: "00:00:00",
      end_time: "23:59:00",
      start_on: 1,
      ends_on: 28,
      mstartoption:null,
      mendoption:null,
    }

    publishtemplateInfo.repeat_mode_config_review=[
      {mode: null,
        mode_id: null,
        start_date: null,
        end_date: null,
        days: [
            {
              day: "Sunday",
              day_id: "0",
              "checked": false
            },
            {
              day: "Monday",
              day_id: "1",
              "checked": false
            },
            {
              day: "Tuesday",
              day_id: "2",
              "checked": false
            },
            {
              day: "Wednesday",
              day_id: "3",
              "checked": false
            },
            {
              day: "Thursday",
              day_id: "4",
              "checked": false
            },
            {
              day: "Friday",
              day_id: "5",
              "checked": false
            },
            {
              day: "Saturday",
              day_id: "6",
              "checked": false
            },
          ],
        start_time: "00:00:00",
        end_time: "23:59:00",
        start_on: 1,
        ends_on: 28,
        mstartoption:null,
        mendoption:null,
      }
    ]
    ////console.log(publishtemplateInfo, 'publishtemplateInfo', hlevelData);
    setenablePublishType(true)
    await updateHData(hlevelData)
    await updateTempMasterInfo(publishtemplateInfo)
  }


  const updateHData = async (hlevelData) => {
    try {
      const responseData = await dispatch(updateHierarchyData(hlevelData))
      if (responseData.status === 200) {
        dispatch(setHierarchyData(responseData.data.hData[0]))
      }
    } catch (error) {
      console.log(error,'error')
    }
  }





  const hierarchyType = async (mode) => {
    const publishTempInfo = _.cloneDeep(publishTemplate)
    const hierarchyDataInfo = _.cloneDeep(hierarchyData)
    setselectedLvl("choose")
    setcheckedKeys([])
    setTreenodes([])
    hierarchyDataInfo["endpoints"] = []
    hierarchyDataInfo["ep_selected"] = []
    hierarchyDataInfo["ep_structure"] = []
    publishTempInfo["hirearchy_type"] = mode
    publishTempInfo["cc_level"] = 0
    ////console.log(hierarchyDataInfo, 'hierarchyDataInfo');
    // await updatePublishTemplateData(publishTempInfo)
    const updatedInfo = await dispatch(updatepublishedTempData(publishTempInfo))
    await updateHData(hierarchyDataInfo)
    if (mode === "1") {
      await retriveLevelInfo(hierarchyDataInfo, publishTempInfo)
    }
    if (mode === "2") {
      await getlocations({}, "allow")
    }

  }


  const retriveLevelInfo = async (hierarchyDataInfo, publishTemplateInfo) => {
    try {
      const responseData = await dispatch(levelDataList(hierarchyDataInfo, publishTemplateInfo))
      if (responseData.status === 200) {
        var getUniqueRecords = _.uniqBy(responseData.data.data, el => `${el.hlevel}-${el.node_positon}`)
        sethlevelData(getUniqueRecords)
        if (hierarchyDataInfo.hlevel) {
          var findIdx = _.findIndex(getUniqueRecords, { hlevel_value: hierarchyDataInfo.eplevel_value })
          if (findIdx !== -1) {
            var endpointInfo = getUniqueRecords[parseInt(findIdx)]
            setselectedLvl(String(findIdx + 1))
          }
        }
      }

    } catch (error) {
      console.log(error,'error')
    }
  }

  const updateReduxState = (publishTemplateInfo, hierarchyDataInfo) => {
    ////console.log(publishTemplateInfo, hierarchyDataInfo, 'publishTemplateInfo,hierarchyDataInfo')
    dispatch(setpublishTemplate(publishTemplateInfo))
    dispatch(setHierarchyData(hierarchyDataInfo))
  }



  const selectLocation = async (event) => {
    ////console.log(event.target.value, 'selectLocation')
    var endpointInfo = hlevelData[parseInt(event.target.value) - 1]
    ////console.log(endpointInfo, 'endpointInfo')
    const publishTempInfo = _.cloneDeep(publishTemplate)
    const hierarchyDataInfo = _.cloneDeep(hierarchyData)
    hierarchyDataInfo["hlevel"] = endpointInfo.hlevel
    hierarchyDataInfo["eplevel_value"] = endpointInfo.hlevel_value
    hierarchyDataInfo["ep_structure"] = []
    hierarchyDataInfo["ep_selected"] = []
    hierarchyDataInfo["ep_selected"] = []
    hierarchyDataInfo["endpoints"] = []
    publishTempInfo["settings"]["enable_review"] = false
    publishTempInfo["audit_start_date"] = null
    publishTempInfo["audit_end_date"] = null
    publishTempInfo["cc_level"] = 0
    sessionStorage.setItem('hlevel', endpointInfo.hlevel)
    sessionStorage.setItem('node_positon', endpointInfo.node_positon)
    ////console.log(hierarchyDataInfo, 'hierarchyDataInfo');
    setcheckedKeys([])
    setselectedLvl(event.target.value)
    updateReduxState(publishTempInfo, hierarchyDataInfo)
    // await updatePublishTemplateData(publishTempInfo)
    const updatedInfo = await dispatch(updatepublishedTempData(publishTempInfo))
    await updateHData(hierarchyDataInfo)
    await getlocations(endpointInfo)

  }


  const getlocations = async (endpointInfo, type) => {
    const manageAuditSlice = store.getState().manageAuditSlice
    ////console.log(manageAuditSlice.publishTemplate, 'publishTempInfo');
    try {
    
      const responseData = await dispatch(getLocationList(endpointInfo, type))
      console.log(responseData,'responseData')
      if (responseData.data.response_code === 500) {
        var convertedFlatData = await convertFlatDataToTreeData(responseData.data.data)
        console.log(convertedFlatData, 'convertedFlatData')
        const publishTemplateInfo = _.cloneDeep(manageAuditSlice.publishTemplate)
        const hierarchyDataInfo = _.cloneDeep(manageAuditSlice.hierarchyData)
        ////console.log(hierarchyDataInfo, 'hierarchyDataInfo')
        hierarchyDataInfo["ep_structure"] = convertedFlatData
        updateReduxState(publishTemplateInfo, hierarchyDataInfo)
        setHtree(convertedFlatData)
        await updateHData(hierarchyDataInfo)
      }

    } catch (error) {
      ////console.log(error, 'error')
    }

  }





  const convertFlatDataToTreeData = (arr) => {
    console.log('arr :>> ', arr);
    var tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;
    for (var i = 0, len = arr.length; i < len; i++) {
      arrElem = {
        "value": arr[i]._id,
        "label": arr[i].hlevel_name,
        "h_node_type": arr[i].h_node_type,
        "children": arr[i].children,
        "id": arr[i].id,
        "parent": arr[i].parent,
        "node_id": arr[i]._id,
        "ep_level": arr[i].hlevel,
        "ep_level_value": arr[i].hlevel_value,
        "user_path": arr[i].user_path,
        "unique_users": arr[i].unique_users,
        "node_positon": arr[i].node_positon,
        "user_permission_acpln": arr[i].user_permission_acpln,
        "code": arr[i].hlevel_code,
        dynamic_data : arr[i]["dynamic_data"]

      }
      mappedArr[arrElem.id] = arrElem;
      mappedArr[arrElem.id]['children'] = []
    }

    for (var id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        ////console.log(mappedElem, 'mappedArr', tree)
        if (mappedElem.parent) {
          if (mappedArr[mappedElem['parent']] !== undefined) {
            mappedArr[mappedElem['parent']]['children'].push(mappedElem);
          }
        }
        else {
          tree.push(mappedElem);
        }
      }
    }

    let update = () => obj => {
      if (obj.children.length > 0)
        obj.children.forEach(update());
      else
        obj.children = null
    };

    tree.forEach(update());
    return tree;

  }






  if (dataLoaded) {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Publishing | AuditVista</title>
          </MetaTags>
          <Breadcrumbs
            title='Audit Type'
            breadcrumbItem="Audit Type"
            isBackButtonEnable={true}
            gotoBack={() => { history('/mngpblhtempt') }} />
          <Container fluid>
            <Row>
              <Col>
                <div>
                  <div className="checkout-tabs">
                    <div className='d-flex gap-2 align-items-stretch'>
                      <div className="d-flex">
                        <Card className="flex-fill mb-4" style={{ border: '1px solid #e9e9e9' }}>
                          <CardBody>
                            <Nav className="flex-column custom-nav-box">
                              {navItems.map((item) => {
                                const isActive = activeTab === item.id;
                                const isEnabled = publishTemplate.cc_level >= item.minLevel;
                                const borderColor = isActive ? '#556ee6' : publishTemplate.cc_level > item.minLevel ? '#34c38f' : 'lightgrey';

                                return (
                                  <NavItem key={item.id}>
                                    {publishTemplate.cc_level > item.minLevel ? (
                                      <>
                                        <Badge.Ribbon text="Completed" color="green" size="small" style={{ fontSize: '10px', marginTop: '-5px' }}>
                                          <NavLink
                                            className={classnames('custom-nav-link', { active: isActive })}
                                            onClick={() => isEnabled && toggleTab(item.id)}
                                            disabled={!isEnabled}
                                            style={{
                                              border: `1px solid ${borderColor}`,
                                              cursor: isEnabled ? 'pointer' : 'not-allowed',
                                              backgroundColor: isActive ? '#f8f9fa' : 'transparent',
                                            }}
                                          >
                                            <i className={`${item.icon} d-block mt-3 mb-2`} style={{ fontSize: '1.5rem' }} />
                                            <p className="font-weight-bold mb-3">{item.label}</p>
                                          </NavLink>
                                        </Badge.Ribbon>
                                      </>
                                    ) : (
                                      <NavLink
                                        className={classnames('custom-nav-link', { active: isActive })}
                                        onClick={() => isEnabled && toggleTab(item.id)}
                                        disabled={!isEnabled}
                                        style={{
                                          border: `1px solid ${borderColor}`,
                                          cursor: isEnabled ? 'pointer' : 'not-allowed',
                                          backgroundColor: isActive ? '#f8f9fa' : 'transparent',
                                        }}
                                      >
                                        <i className={`${item.icon} d-block mt-3 mb-2`} style={{ fontSize: '1.5rem' }} />
                                        <p className="font-weight-bold mb-3">{item.label}</p>
                                      </NavLink>
                                    )}
                                  </NavItem>
                                );
                              })}
                            </Nav>
                          </CardBody>
                        </Card>
                      </div>
                      <Card className="flex-fill" style={{ border: '1px solid #e9e9e9' }}>
                        <CardBody>
                          <AvForm ref={formRef} className="form-horizontal"
                          >
                            {
                              console.log(activeTab,'activeTab')
                            }
                            <TabContent activeTab={activeTab}>
                              <TabPane tabId={1}>
                                <div>
                                  <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div>
                                      <h5>Hirerachy Level</h5>
                                    </div>
                                    <div>
                                      <button className="btn btn-sm btn-primary me-2"
                                      onClick={()=>{
                                        resetAll()
                                      }}
                                      //  onClick={() => this.setState({ changeMethodConfirmation: true, triggerFrom: "hlevel" })}
                                       >Reset </button>
                                    </div>
                                  </div>
                                </div>
                                {
                                  console.log(hList, 'hList', hierarchyData)
                                }
                                {hList.length > 0 &&
                                  <Row className="mb-3 d-flex align-items-stretch">
                                    <Col className="pe-1">
                                      <Card className="h-100" style={{ borderRadius: "0.5rem", border: '1px solid #e4e4e4' }}>
                                        <CardBody>
                                          <div className="mb-3">
                                            <Label htmlFor="autoSizingSelect">Select Hierarchy <span className='text-danger'>*</span></Label>
                                            <div className={
                                              (publishTemplate.hirearchy_type === "1" ||
                                                publishTemplate.hirearchy_type === "2") ? "col-6" : "col-4"
                                            }>
                                              <Input
                                                type="select"
                                                name="hlevel"
                                                label="HirerachLevel"
                                                disabled={canEdit === false}
                                                value={
                                                  // hierarchyData?.hlvl_master_id ? hierarchyData?.hlvl_master_id :"0"
                                                  hierarchyData ? hierarchyData?.hlvl_master_id :"0"
                                                }
                                                className="form-select"
                                                id="hlevel1"
                                                required
                                                onChange={(e) => selectLevel(e)}
                                              >
                                                <option value="0" defaultValue disabled >Choose...</option>
                                                {
                                                  hList?.map((data, idx) => {
                                                    return (
                                                      <option value={data._id} selected key={idx}>{data.hname}</option>
                                                      // <option value={String(idx + 1)} selected key={idx}>{data.hname}</option>
                                                    )
                                                  })
                                                }
                                              </Input>
                                             
                                            </div>
                                          </div>

                                          {
                                            hierarchyData?.hlvl_master_id ?
                                              <>
                                                <Label htmlFor="autoSizingSelect">Select Audit Publish based on : <span className='text-danger'>*</span></Label>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className=''>
                                                  <input type={"radio"}
                                                       disabled={canEdit === false}
                                                    checked={publishTemplate?.adt_based_on === "0"}
                                                    onClick={(e) => {
                                                      adtBasedOn("0")

                                                    }} />&nbsp;&nbsp;<div onClick={(e) => {
                                                      adtBasedOn("0")
                                                    }} >User</div>&nbsp;&nbsp;
                                                  <input disabled={canEdit === false} type={"radio"} checked={publishTemplate?.adt_based_on === "1"} onClick={(e) => {
                                                    adtBasedOn("1")
                                                  }} />&nbsp;&nbsp;
                                                  <div onClick={(e) => {
                                                    adtBasedOn("1")
                                                  }} >Location</div>&nbsp;&nbsp;
                                                </div>
                                              </>
                                              : null
                                          }
                                          <br />


                                          {
                                            publishTemplate?.adt_based_on === "1" ?
                                              <>
                                                <Label htmlFor="autoSizingSelect">Select Hierarchy Structure : <span className='text-danger'>*</span></Label>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className=''>
                                                  <input type={"radio"}
                                                  disabled={canEdit === false}
                                                    checked={publishTemplate?.hirearchy_type === "1"}
                                                    onClick={(e) => {
                                                      hierarchyType("1")

                                                    }} />&nbsp;&nbsp;<div onClick={(e) => {
                                                      hierarchyType("1")
                                                    }} >Organised Structure</div>&nbsp;&nbsp;
                                                  <input disabled={canEdit === false} type={"radio"} checked={publishTemplate?.hirearchy_type === "2"} onClick={(e) => {
                                                    setTreenodes([]);
                                                    hierarchyType("2")
                                                  }} />&nbsp;&nbsp;
                                                  <div onClick={(e) => {
                                                    hierarchyType("2")
                                                  }} >Un-Organised Structure</div>&nbsp;&nbsp;
                                                </div>
                                              </>
                                              : 
                                              publishTemplate?.adt_based_on ==="0" ?
                                                  <>
                                                    <Button onClick={()=>{
                                                      setopenUserList(true)
                                                    }} className='btn btn-sm btn-info me-2'>View Users List</Button>
                                                  </>
                                                  :
                                                  null

                                          }
                                        </CardBody>
                                      </Card>
                                    </Col>


                                    {
                                      (publishTemplate.hirearchy_type &&
                                        hList.length > 0) &&
                                      <Col className="ps-1">{
                                        (publishTemplate.hirearchy_type) ?
                                          <Card className="h-100" style={{ borderRadius: "0.5rem", border: '1px solid #e4e4e4' }}>
                                            <CardBody>
                                              {
                                                publishTemplate.hirearchy_type === "1" &&

                                                <div>
                                                  <Label htmlFor="autoSizingSelect">Select Location :<span className='text-danger'>*</span></Label>
                                                  <div className="mb-3 col-6">
                                                    <select
                                                      type="select"
                                                      name="location"
                                                      label="Name"
                                                      value={selectedLvl}
                                                      className="form-select"
                                                      id="location"
                                                      required
                                                      onChange={(e) => selectLocation(e)}
                                                    >
                                                      <option value="choose" disabled >Choose...</option>
                                                      {
                                                        hlevelData.map((data, idx) => {
                                                          return (
                                                            <option value={String(idx + 1)} selected key={idx}>{data.hlevel}-({data.node_positon})</option>
                                                          )
                                                        })
                                                      }
                                                    </select>

                                                  </div>
                                                </div>
                                              }

                                              {
                                                publishTemplate.hirearchy_type == "1" ?
                                                  treeNodes.length > 0 &&
                                                  <div>
                                                    <Label htmlFor="autoSizingSelect">Select {hierarchyData.hlevel}</Label>
                                                    <Tree
                                                      style={{ borderColor: '#150101' }}
                                                      defaultExpandAll={true}
                                                      treeData={treeNodes}
                                                      checkable
                                                      checkedKeys={checkedKeys}
                                                      onCheck={(checked, event) => { onCheck(checked, event) }}
                                                      showLine={true}
                                                      showIcon={true}
                                                      expandedKeys={expandedKeys}
                                                      onExpand={(keys) => setExpandedKeys(keys)}
                                                    />
                                                  </div>
                                                  :
                                                  publishTemplate.hirearchy_type == "2" ?
                                                    <div>
                                                      <Label htmlFor="autoSizingSelect">Select Location : <span className='text-danger'>*</span></Label>
                                                      <Tree
                                                        style={{ borderColor: '#150101' }}
                                                        defaultExpandAll={true}
                                                        treeData={treeNodes}
                                                        checkable
                                                        checkedKeys={checkedKeys}
                                                        onCheck={(checked, event) => { onCheck(checked, event, "2") }}
                                                        showLine={true}
                                                        showIcon={true}
                                                        expandedKeys={expandedKeys}
                                                        onExpand={(keys) => setExpandedKeys(keys)}
                                                        checkStrictly={true}
                                                      />
                                                    </div>
                                                    :
                                                    null
                                              }
                                            </CardBody>
                                          </Card>
                                          :
                                          null
                                      }
                                      </Col>
                                    }
                                    {
                                      openUserList &&
                                      <Offcanvas
                                        isOpen={openUserList}
                                        toggle={onDrawerClose}
                                        direction="end" // 'end' for right side, use 'start' for left
                                        style={{ width: '800px', zIndex: 9999 }}
                                      >
                                        <OffcanvasHeader toggle={onDrawerClose}>
                                          <span>Location Users</span>
                                        </OffcanvasHeader>
                                        <OffcanvasBody>
                                          <LocationUserList 
                                          onDrawerClose={onDrawerClose}
                                          />
                                        </OffcanvasBody>
                                      </Offcanvas>
                                    }
                                  </Row>
                                }
                              </TabPane>
                              <TabPane tabId={2} id="v-pills-confir" role="tabpanel">
                                <div>
                                  <div className="mb-2">
                                    <h5>Audit & Review</h5>
                                  </div>
                                  {
                                    renderLocation &&
                                    <LocationList
                                      hierarchyData={hierarchyData}
                                    />
                                  }
                                </div>
                              </TabPane>
                              <TabPane tabId={3} id="v-pills-config" role="tabpanel" aria-labelledby="v-pills-config-tab" >
                                <div>
                                  <div className="mb-2">
                                    <h5>Configuration</h5>
                                  </div>
                                  {renderSchedule &&
                                    <ScheduleConfiguration
                                      repeatModeData={authUser.config_data.repeat_mode}
                                      updateTempMasterInfo={(data) => updateTempMasterInfo(data)}
                                    />

                                  }

                                </div>
                              </TabPane>
                              <TabPane tabId={4} id="v-pills-config" role="tabpanel" aria-labelledby="v-pills-config-tab" >
                              <div>
                                  <div className="mb-2">
                                    <h5>Review Stages</h5>
                                  </div>
                                  {renderReviewSchedule &&
                                    <ReviewSchedule
                                    repeatModeData={_.cloneDeep(manageAuditSlice.reviewSchedule)}
                                    updateTempMasterInfo={(data) => updateTempMasterInfo(data)}
                                    toggleTab={(tab)=>{toggleTab(tab)}}
                                    />

                                  }

                                  </div>
                                
                              </TabPane>

                              {/* <TabPane tabId={5} id="v-pills-config" role="tabpanel" aria-labelledby="v-pills-config-tab" >
                              <div>
                                  <div className="mb-2">
                                    <h5>Report Schedule</h5>
                                  </div>
                                  {renderReportSchedule &&
                                    <ReportScheduling
                                    repeatModeData={_.cloneDeep(manageAuditSlice.reviewSchedule)}
                                    updateTempMasterInfo={(data) => updateTempMasterInfo(data)}
                                    toggleTab={(tab)=>{toggleTab(tab)}}
                                    />

                                  }

                                  </div>
                                
                              </TabPane> */}
                              
                              <TabPane tabId={6} id="v-pills-config" role="tabpanel" aria-labelledby="v-pills-config-tab" >
                              <div>
                                  <div className="mb-2">
                                    <h5>Confirmation</h5>
                                    <p className="text-muted">{publishTemplate?.template_name}</p>
                                  </div>
                                  {renderConfirmPublish &&
                                    <ConfirmPublish
                                    repeatModeData={authUser.config_data.repeat_mode}
                                    updateTempMasterInfo={(data) => updateTempMasterInfo(data)}
                                    toggleTab={(tab)=>{toggleTab(tab)}}
                                    />

                                  }

                                  </div>

                              </TabPane>




                            </TabContent>
                          </AvForm>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                </div>
                <Offcanvas
                  isOpen={open}
                  toggle={onDrawerClose}
                  direction='end' // Controls the placement: 'start', 'end', 'top', or 'bottom'
                  style={{ width: '700px' }}
                >

                  <OffcanvasHeader toggle={onDrawerClose}>
                    {
                      component === "import_usr" ?
                        <div className="text-danger">Add Users for <span className='text-dark me-2'>{this.state.location_info.hlevel_name}</span>Location</div>
                        :
                        component === "endpoint" ?
                          <span>Location Information </span>
                          :
                          component === "loadendpoint" ?
                            <span>Load Location</span>
                            :
                            ""
                    }

                  </OffcanvasHeader>
                  <OffcanvasBody style={{ padding: 10, overflow: 'auto' }} >
                    {
                      component === "user" ? (
                        <>

                        </>
                      )
                        :
                        component === "endpoint" ? (
                          <AddEndpointNode
                            endpoints={publishTemplate.endpoints}
                            publishtemplateInfo={publishTemplate}
                            onClose={onDrawerClose}
                            editItem={editItem}
                            onCancel={() => {
                              setopen(false)
                              setcomponent("")
                            }}
                          />

                        )
                          :
                          component === "loadendpoint" ? (
                            <LoadEndpoint
                              userInfo={authUser.user_data}
                              publishtemplateInfo={publishTemplate}
                              onClose={onDrawerClose}
                            />
                          )
                            :
                            component === "import_usr" ? (
                              <>

                              </>
                            )
                              :
                              null
                    }
                  </OffcanvasBody>
                </Offcanvas>
              </Col>
            </Row>
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

    )
  }
}
export default PublishConfig
