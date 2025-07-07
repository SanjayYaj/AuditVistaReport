import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import {
  Container, Row, Col,
  Modal, ModalHeader, ModalBody, UncontrolledTooltip,
  DropdownMenu, DropdownToggle, UncontrolledDropdown,
  Offcanvas, OffcanvasHeader, OffcanvasBody
} from "reactstrap"
import { Popconfirm } from 'antd';
import { AvForm, AvField } from "availity-reactstrap-validation"
import Breadcrumbs from "./Components/Breadcrumb2"
// import InputTemplate from "./Components/InputTemplate"

import SortableTree, {
  addNodeUnderParent,
  getTreeFromFlatData,
  getFlatDataFromTree,
  changeNodeAtPath,
  getNodeAtPath,
  removeNodeAtPath,
  getVisibleNodeCount
} from "@nosferatu500/react-sortable-tree";

import "@nosferatu500/react-sortable-tree/style.css";
import "react-perfect-scrollbar/dist/css/styles.css"
import "./manageAudit.css"
import "react-rangeslider/lib/index.css"
import MetaTags from 'react-meta-tags';
import { getDocuments, setTreeData } from 'toolkitStore/Auditvista/treeSlice';
import { useDispatch, useSelector } from 'react-redux';
import TreeStructure from './TreeStructure';
// import './react-tree-style.css'
// import './CSS/DGT.css'



const crudTemplate = () => {

  const [height, setHeight] = useState(null)
  const [authUser, setauthUser] = useState(null)
  const [templateData, settemplateData] = useState(null)
  const [modal, setmodal] = useState(false)
  const [auditNameExist, setauditNameExist] = useState(false)
  const [configdataCheckpoint, setconfigdataCheckpoint] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()




  useEffect(() => {
    const fetchData = async () => {
      var templateData = JSON.parse(sessionStorage.getItem("EditData"));
      var data = JSON.parse(sessionStorage.getItem("authUser"));
      setHeight(window.innerHeight)
      setauthUser(data)
      setconfigdataCheckpoint(data.config_data.question_type_info)
      settemplateData(templateData)
      dispatch(getDocuments())
      dispatch(setTreeData([]))
      
      // await getDocuments()
    }
    fetchData()


  }, [])


  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Edit Template | AuditVista</title>
        </MetaTags>
        <Breadcrumbs
          title={"Template / " + templateData?.template_name}
          link={"Template / "}
          changeAuditEditMode={() => { setmodal(!modal); setauditNameExist(!auditNameExist) }}
          isBackButtonEnable={true}
          gotoBack={() => {dispatch(setTreeData([])); navigate("/mngmtrtmplt")}}
          breadcrumbItem="Template"
        />
        <TreeStructure />



      </div>


    </React.Fragment>
  )
}
export default crudTemplate
