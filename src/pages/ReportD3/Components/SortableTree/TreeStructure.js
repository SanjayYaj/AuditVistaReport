import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Label, Row, UncontrolledTooltip, DropdownMenu, DropdownToggle, UncontrolledDropdown, Tooltip , Button , Dropdown} from "reactstrap"
import { AvForm, AvField } from 'availity-reactstrap-validation';
import SortableTree from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import { addNode, setNodeInfo, crudNode, dndNode, setMenuName, setReportName, deleteNode, getNodeData, setState, editNode, updateNode, onTreeChange } from '../../../../Slice/reportd3/treedataSlice';
import { updateLayoutInfo  , resetState, updateTemplateStatus} from '../../../../Slice/reportd3/reportslice';

import store from '../../../../store';
import urlSocket from '../../../../helpers/urlSocket';

import "react-sortable-tree/style.css";
// import SortableTree from "react-sortable-tree";
import { motion } from "framer-motion";

import { usePermissions } from 'hooks/usePermisson';

    const {canEdit,canView} = usePermissions("user_report")

import RelationshipModal  from '../Relationship';

const TreeStructure = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [dataLoaded, setDataLoaded] = useState(true);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [dropdownStates, setDropdownStates] = useState({});
    const [dropdownReportStates, setDropdownReportStates] = useState(false);
    const [selectedButton, setSelectedButton] = useState("")
    const [selectedCln, setSelectedCln] = useState({})
    const [formError, setFormError] = useState(false);

    const [hoveredNodeId, setHoveredNodeId] = useState(null);

    const [dbCollections, setdbCollections] = useState([])
    const state = useSelector(state => state?.treeData);
  const [relationships, setRelationships] = useState([]);


  const [ managerelationshipToggle , setManageRelationshipToggle] = useState(false);

    const [openDropdown, setOpenDropdown] = useState(false);
const [selectedItems, setSelectedItems] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);

const [collections] = useState([
    { name: 'Orders' },
    { name: 'Customers' },
    { name: 'Products' },
    // whatever collections you have
  ]);


  const [searchQuery, setSearchQuery] = useState('');


  const handleSaveRelationship = (relationship) => {
    console.log('Saved Relationship:', relationship);

    // now you can store in state or send to backend
    setRelationships(prev => [...prev, relationship]);
  };

const toggleDropdown = () => setOpenDropdown(!openDropdown);

    const treeData = state?.treeData
    console.log('treeData', treeData)

    const authInfo = useSelector((state1) => state1.auth);
    const authUser = authInfo.userInfo

    const dbInfo = authInfo.db_info

const {reportDB} = useSelector((state) => state.auth)

    useEffect(() => {
        retreiveDbCln_list()
      var page_data = JSON.parse( sessionStorage.getItem("page_data"))
      console.log('page_data :>> ', page_data);
      dispatch(setState({ editcrud: false, id: null }))
    }, [])



    const retreiveDbCln_list = async () => {
        try {
            const data = {
                encrypted_db_url: reportDB.encrypted_db_url,
            }
            console.log('retreiveDbCln_list data :>> ', data);
            const responseData = await urlSocket.post("report/retrive-dynamicdb-collections", data)
            console.log('dynamicdb-collections responseData :>> ', responseData);
            setdbCollections(responseData.data.data)
        } catch (error) {
            console.log('error :>> ', error);
        }

    }


    const toggle = () => {
       
        dispatch(setState({ mainToggle: !state.mainToggle }));
        setOpenDropdown(!openDropdown)
        setSelectedItems([])
    };

    const addCrudNode = (event, values) => {
        console.log('state.crudStatus',state.crudStatus)
        values["selected_mode"] = selectedButton
        values["selected_cln_name"] = selectedItems
        values['relationships'] = relationships[0]


        console.log('values 88:>> ', values , relationships[0]);
        const action = state.crudStatus === 2 ? updateNode : crudNode;
        dispatch(action(values, history, authInfo, navigate));
        setDropdownStates({})
        setDropdownReportStates({})

      var page_data =  JSON.parse(sessionStorage.getItem("page_data"))
        dispatch(updateTemplateStatus(page_data, authUser, dbInfo, ))
        console.log('page_data  addCrudNode:>> ', page_data);
    };

    const toggleToolTip = (targetName) => {
    };

    const handleTreeChange = (newTreeData) => {
        onTreeChange(newTreeData, dispatch);
    };

    // const toggleDropdown = (id) => {
    //     setDropdownStates({
    //         ...dropdownStates,
    //         [id]: !dropdownStates[id] // Toggle the state for the clicked dropdown menu
    //     });
    // };

    const toggleReportDropdown = (id) => {
        setDropdownReportStates({
            ...dropdownReportStates,
            [id]: !dropdownReportStates[id] // Toggle the state for the clicked dropdown menu
        });


    }


    const selectedClnInfo = (event) => {
        var selectedValue = _.filter(dbCollections, { cln_name: event.target.value })
        console.log('selectedValue', selectedValue)
        if (selectedValue.length > 0) {
            setSelectedCln(selectedValue[0])
        }
    }


    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
          setSelectedItems(prev => [...prev, value]);
        } else {
          setSelectedItems(prev => prev.filter(item => item !== value));
        }
      };
    return (
        <React.Fragment>

            {dataLoaded ? (
                <Container fluid>
                    <div className="d-flex flex-row" style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
                        <div style={{ background: "white", width: "100%", transition: "width .35s ease-in-out", position: "absolute", float: "left", }} className="p-3 me-2" >



                            {

                             !canEdit ?

                            //     <motion.div
                            //     style={{ overflow: "auto", height: "90vh", padding: "10px", backgroundColor: "#F8F9FA", borderRadius: "10px" }}
                            //     initial={{ opacity: 0, y: -10 }}
                            //     animate={{ opacity: 1, y: 0 }}
                            //     transition={{ duration: 0.5 }}
                            // >
                            //     <SortableTree
                            //         treeData={treeData}
                            //         canDrag={() => false}
                            //         canDrop={() => false}
                            //         scaffoldBlockPxWidth={40}
                            //         slideRegionSize={25}
                            //         generateNodeProps={({ node }) => {
                            //             return {
                            //                 className: node.type === 2 ? "icon-a" : "icon-b",
                            //                 style: {
                            //                     border: selectedNodeId === node.id ? "2px solid #556EE6" : "1px solid #c3cacd",
                            //                     borderRadius: "8px",
                            //                     boxShadow: selectedNodeId === node.id ? "0 0 10px rgba(85, 110, 230, 0.3)" : "none",
                            //                     transition: "all 0.3s ease",
                            //                     backgroundColor: "#fff",
                            //                     padding: "8px",
                            //                     marginBottom: "8px",
                            //                 },
                            //                 title: (
                            //                     <motion.div
                            //                         initial={{ opacity: 0, x: -10 }}
                            //                         animate={{ opacity: 1, x: 0 }}
                            //                         transition={{ duration: 0.3 }}
                            //                     >
                            //                         <div style={{ maxWidth: 450 }} key={`div-${node.id}`}>
                            //                             {state.editcrud && state.id === node.id ? (
                            //                                 <input
                            //                                     name="title"
                            //                                     placeholder="Enter Menu Name"
                            //                                     className="form-control py-1 m-0"
                            //                                     type="text"
                            //                                     value={state.menuName}
                            //                                     autoFocus
                            //                                     style={{ borderRadius: "5px" }}
                            //                                 />
                            //                             ) : (
                            //                                 <div>
                            //                                     <Tooltip
                            //                                         placement="bottom"
                            //                                         target={`btn-${node.id}`}
                            //                                         toggle={() => toggleToolTip(`btn-${node.id}`)}
                            //                                     >
                            //                                         {node.title}
                            //                                     </Tooltip>
                            //                                     <Link
                            //                                         to="#"
                            //                                         id={`btn-${node.id}`}
                            //                                         style={{ fontSize: 14, fontWeight: 500, color: "#495057" }}
                            //                                     >
                            //                                         {String(node.title).slice(0, 40) + (node.title?.length > 40 ? "..." : "")}
                            //                                     </Link>
                            //                                 </div>
                            //                             )}
                            //                         </div>
                            //                     </motion.div>
                            //                 ),
                            //                 buttons: [
                            //                     node.type === 1 && (
                            //                         <motion.div
                            //                             key={node.id}
                            //                             className="btn btn-sm btn-soft-info"
                            //                             onClick={() => {
                            //                                 sessionStorage.setItem("pageNodeInfo", JSON.stringify(node));
                            //                                 dispatch(setNodeInfo(node));
                            //                                 dispatch(updateLayoutInfo([]));
                            //                                 dispatch(resetState());
                            //                                 navigate('/preview-report');
                            //                             }}
                            //                             id={`ViewReport-${node.id}`}
                            //                             whileHover={{ scale: 1.1 }}
                            //                             whileTap={{ scale: 0.9 }}
                            //                             style={{
                            //                                 display: "flex",
                            //                                 alignItems: "center",
                            //                                 gap: "5px",
                            //                                 padding: "6px 10px",
                            //                                 borderRadius: "5px",
                            //                                 cursor: "pointer",
                            //                                 backgroundColor: "#e3f2fd",
                            //                                 transition: "0.3s ease",
                            //                             }}
                            //                         >
                            //                             <i className="mdi mdi-layers-plus" style={{ color: "#556EE6" }} />
                            //                             <span style={{ fontSize: "12px", fontWeight: "500", color: "#495057" }}>View Report</span>
                            //                             <UncontrolledTooltip placement="top" target={`ViewReport-${node.id}`}>
                            //                                 View Report
                            //                             </UncontrolledTooltip>
                            //                         </motion.div>
                            //                     ),
                            //                 ],
                            //             };
                            //         }}
                            //     />
                            // </motion.div>














                                    <motion.div
                                        style={{
                                            overflow: "auto",
                                            height: "90vh",
                                            padding: "12px",
                                            backgroundColor: "#F8F9FA",
                                            borderRadius: "12px",
                                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                                        }}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <SortableTree
                                          onChange={handleTreeChange}
                                            treeData={treeData}
                                            canDrag={() => false}
                                            canDrop={() => false}
                                            scaffoldBlockPxWidth={40}
                                            slideRegionSize={25}
                                            generateNodeProps={({ node }) => ({
                                                className: node.type === 2 ? "icon-a" : "icon-b",
                                                style: {
                                                    border: selectedNodeId === node.id ? "2px solid #556EE6" : "1px solid #d1d9dd",
                                                    borderRadius: "10px",
                                                    boxShadow: selectedNodeId === node.id
                                                        ? "0px 5px 15px rgba(85, 110, 230, 0.3)"
                                                        : "0px 2px 6px rgba(0, 0, 0, 0.08)",
                                                    transition: "all 0.3s ease",
                                                    backgroundColor: "#ffffff",
                                                    // padding: "12px",
                                                    // marginBottom: "10px",
                                                    // cursor: "pointer",
                                                    width: '250px',
                                                    ...(hoveredNodeId === node.id && {
                                                        backgroundColor: "#F0F4FF", // Light blue hover effect
                                                        boxShadow: "0px 5px 15px rgba(85, 110, 230, 0.5)", // More intense shadow
                                                        transform: "scale(1.02)", // Slight scale effect
                                                    }),
                                                },
                                                onMouseEnter: () => setHoveredNodeId(node.id),
                                                onMouseLeave: () => setHoveredNodeId(null),
                                                title: (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <div style={{ maxWidth: 450 }} key={`div-${node.id}`}>
                                                            {state.editcrud && state.id === node.id ? (
                                                                <input
                                                                    name="title"
                                                                    placeholder="Enter Menu Name"
                                                                    className="form-control py-1 m-0"
                                                                    type="text"
                                                                    value={state.menuName}
                                                                    autoFocus
                                                                    style={{
                                                                        border: "none",
                                                                        outline: "none",
                                                                        background: "transparent",
                                                                        fontSize: "14px",
                                                                        fontWeight: "500",
                                                                        width: "100%",
                                                                        padding: "2px 4px",
                                                                        borderRadius: "0px",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div style={{}}>
                                                                    <Tooltip
                                                                        placement="bottom"
                                                                        target={`btn-${node.id}`}
                                                                        toggle={() => toggleToolTip(`btn-${node.id}`)}
                                                                    >
                                                                        {node.title}
                                                                    </Tooltip>
                                                                    <Link
                                                                        to="#"
                                                                        id={`btn-${node.id}`}
                                                                        style={{
                                                                            fontSize: "14px",
                                                                            fontWeight: "500",
                                                                            color: "#495057",
                                                                            textDecoration: "none",
                                                                        }}
                                                                    >
                                                                        {String(node.title).slice(0, 40) + (node.title?.length > 40 ? "..." : "")}
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ),
                                                buttons: [
                                                    node.type === 1 && (
                                                        <motion.div
                                                            key={node.id}
                                                            className="btn btn-sm"
                                                            onClick={() => {
                                                                sessionStorage.setItem("pageNodeInfo", JSON.stringify(node));
                                                                dispatch(setNodeInfo(node));
                                                                dispatch(updateLayoutInfo([]));
                                                                dispatch(resetState());
                                                                navigate('/preview-report');
                                                            }}
                                                            id={`ViewReport-${node.id}`}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "8px",
                                                                // padding: "8px 12px",
                                                                borderRadius: "8px",
                                                                cursor: "pointer",
                                                                backgroundColor: "#556EE6",
                                                                color: "#ffffff",
                                                                fontSize: "13px",
                                                                fontWeight: "500",
                                                                transition: "0.3s ease",
                                                                boxShadow: "0px 2px 8px rgba(85, 110, 230, 0.3)",
                                                            }}
                                                        >
                                                            <i className="mdi mdi-layers-plus" style={{ color: "#ffffff" }} />
                                                            <span>View Report</span>
                                                            <UncontrolledTooltip placement="top" target={`ViewReport-${node.id}`}>
                                                                View Report
                                                            </UncontrolledTooltip>
                                                        </motion.div>
                                                    ),
                                                ],
                                            })}
                                        />
                                    </motion.div>




                                    // <div style={{ overflow: "auto", height: "90vh", }}>
                                    //     <SortableTree
                                    //         treeData={treeData}
                                    //         canDrag={() => false}
                                    //         canDrop={() => false}
                                    //         scaffoldBlockPxWidth={40}
                                    //         slideRegionSize={25}
                                    //         generateNodeProps={({ node, path }) => {
                                    //             return {
                                    //                 listIndex: 0,
                                    //                 lowerSiblingCounts: [],
                                    //                 className: node.type === 2 ? "icon-a" : "icon-b",
                                    //                 style: {
                                    //                     border: selectedNodeId === node.id ? "2px solid #556EE6" : '1px solid #c3cacd',
                                    //                     backgroundImage: "url('../../../../assets/images/drag-and-drop-7.png')"
                                    //                 },
                                    //                 title: (
                                    //                     <div>
                                    //                         <div style={{ maxWidth: 450 }} key={`div-${node.id}`}>
                                    //                             {state.editcrud && state.id === node.id ? (
                                    //                                 <div className="d-flex flex-row align-items-center">
                                    //                                     <div className="me-2 p-0">
                                    //                                         <input name="title" placeholder="Enter Menu Name" className="form-control py-1 m-0" type="text" value={state.menuName} />
                                    //                                     </div>
                                    //                                 </div>
                                    //                             ) : (
                                    //                                 <div>
                                    //                                     <Tooltip
                                    //                                         placement="bottom"
                                    //                                         target={`btn-${node.id}`}
                                    //                                         toggle={() => toggleToolTip(`btn-${node.id}`)}
                                    //                                     >
                                    //                                         {node.title}
                                    //                                     </Tooltip>
                                    //                                     <Link
                                    //                                         to="#"
                                    //                                         id={`btn-${node.id}`}
                                    //                                         style={{ fontSize: 12, fontWeight: 400 }}
                                    //                                     >
                                    //                                         {String(node.title).slice(0, 40) +
                                    //                                             (node.title?.length > 40 ? "..." : "")}
                                    //                                     </Link>
                                    //                                 </div>
                                    //                             )}
                                    //                         </div>
                                    //                     </div>
                                    //                 ),
                                    //                 buttons: [
                                    //                     <Row className="" key={node.id}>
                                    //                         <ul className="list-unstyled hstack gap-1 mb-0 justify-content-end">

                                    //                             {node.type === 1 && (
                                    //                                 <li>
                                    //                                     {console.log('node.id', node.id)}
                                    //                                     <div
                                    //                                         className="btn btn-sm btn-soft-info"
                                    //                                         onClick={() => {
                                    //                                             sessionStorage.setItem("pageNodeInfo", JSON.stringify(node));
                                    //                                             dispatch(setNodeInfo(node));
                                    //                                             dispatch(updateLayoutInfo([]));
                                    //                                             dispatch(resetState());
                                    //                                             navigate('/preview-report');
                                    //                                         }}
                                    //                                         id={`ViewReport-${node.id}`}
                                    //                                     >
                                    //                                         <i className="mdi mdi-layers-plus" />
                                    //                                         <UncontrolledTooltip placement="top" target={`ViewReport-${node.id}`} >
                                    //                                             {node.type !== 2 && "View report"}
                                    //                                         </UncontrolledTooltip>
                                    //                                     </div>
                                    //                                 </li>
                                    //                             )}
                                    //                         </ul>
                                    //                     </Row>
                                    //                 ],
                                    //             };
                                    //         }}
                                    //     />
                                    // </div>
                                    :

                                    <>
                                    
                                      {  console.log('state?.mainToggle :>> ', state?.mainToggle)
                                    }
                                        <div className="row">
                                            <div className="mb-2 col-10 ">
                                                <Dropdown isOpen={state?.mainToggle} toggle={() => toggle}>
                                                    <DropdownToggle className="btn btn-primary" color="#eff2f7"
                                                        onClick={() => dispatch(setState({ path: [], crud: true, crudStatus: 0, type: 0, children: [], mainToggle: !state?.mainToggle }))} >
                                                        <i className="mdi mdi-plus me-1 "></i> Create New
                                                    </DropdownToggle>
                                                    <DropdownMenu style={{ width: 350, height: openDropdown ? 410 : 200 }} className="">
                                                        <div className="px-2" style={{ padding: '8px' }}>

                                                            <AvForm onValidSubmit={addCrudNode} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9', height: openDropdown ? 385 : 170 }}>
                                                                <div className="mb-2">
                                                                    <Label>Report Name :</Label>
                                                                    <AvField
                                                                        name="title"
                                                                        placeholder="Enter Report"
                                                                        type="text"
                                                                        errorMessage="Report Name is required"
                                                                        className="form-control"
                                                                        validate={{
                                                                            required: { value: true, errorMessage: "Report Name is required" },
                                                                            minLength: { value: 3, errorMessage: "Minimum 3 characters required" }
                                                                        }}
                                                                        onChange={(e) => dispatch(setReportName(e.target.value))}
                                                                    />
                                                                </div>

                                                                {/* <div>
                                                                    <Label>Choose Data Source :</Label>
                                                                    <AvField
                                                                        type="select"
                                                                        name="dataSource"
                                                                        className="form-control"
                                                                        errorMessage="Data Source is required"
                                                                        validate={{ required: { value: true, errorMessage: "Data Source is required" } }}
                                                                        onChange={(e) => selectedClnInfo(e)}
                                                                    >
                                                                        <option disabled value="">Select</option>
                                                                        {dbCollections.map((ele, ind) => (
                                                                            <option value={ele.cln_name} key={ind}>
                                                                                {ele.cln_name}
                                                                            </option>
                                                                        ))}
                                                                    </AvField>
                                                                </div> */}


                                                                <div className="dropdown" style={{ position: "" }}>
                                                                    <button
                                                                        className="btn  dropdown-toggle d-flex align-items-center justify-content-between"
                                                                        type="button"
                                                                        onClick={toggleDropdown}
                                                                        style={{ width: "100%", padding: "10px 15px", background: '#dedede' }}
                                                                    >
                                                                        Choose Data Source
                                                                        {openDropdown ? (
                                                                            <FaChevronUp style={{ marginLeft: '8px' }} />
                                                                        ) : (
                                                                            <FaChevronDown style={{ marginLeft: '8px' }} />
                                                                        )}
                                                                    </button>

                                                                    {openDropdown && (
                                                                        <div
                                                                            className="dropdown-menu show"
                                                                            style={{
                                                                                width: '100%',
                                                                                padding: '10px',
                                                                                border: '1px solid #ced4da',
                                                                                borderRadius: '4px',
                                                                                marginTop: '5px',
                                                                                maxHeight: '200px',
                                                                                minWidth: '300px', // 👈 make dropdown wider 
                                                                                overflow: 'auto',
                                                                                backgroundColor: '#fff',
                                                                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                                                                zIndex: 1000,
                                                                                position: 'absolute',
                                                                                top: '100%',
                                                                                left: 0,
                                                                                right: 0,
                                                                                display: 'block',

                                                                            }}
                                                                        >

                                                                            <input
                                                                                type="text"
                                                                                placeholder="Search..."
                                                                                className="form-control mb-2"
                                                                                value={searchQuery}
                                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                                style={{
                                                                                    width: '100%',
                                                                                    padding: '6px 10px',
                                                                                    fontSize: '14px',
                                                                                    borderRadius: '4px',
                                                                                }}
                                                                            />

                                                                            {dbCollections
                                                                                .filter(ele =>
                                                                                    ele.cln_name.toLowerCase().includes(searchQuery.toLowerCase())
                                                                                ).map((ele, ind) => (
                                                                                    <div
                                                                                        // key={ind}
                                                                                        key={ele.cln_name}
                                                                                        className="form-check"
                                                                                        style={{
                                                                                            marginBottom: '8px',
                                                                                            whiteSpace: 'nowrap',
                                                                                            overflow: 'hidden',
                                                                                            textOverflow: 'ellipsis',
                                                                                        }}
                                                                                    >
                                                                                        <input
                                                                                            className="form-check-input"
                                                                                            type="checkbox"
                                                                                            value={ele.cln_name}
                                                                                            //   id={`check-${ind}`}
                                                                                            id={`check-${ele.cln_name}`}
                                                                                            onChange={handleCheckboxChange}
                                                                                            style={{ cursor: 'pointer' }}
                                                                                        />
                                                                                        <label
                                                                                            className="form-check-label"
                                                                                            htmlFor={`check-${ele.cln_name}`}
                                                                                            style={{
                                                                                                marginLeft: '8px',
                                                                                                cursor: 'pointer',
                                                                                                // maxWidth: '90%', // important for truncation
                                                                                                maxWidth: '520px', // 👈 control text length
                                                                                                whiteSpace: 'nowrap',
                                                                                                overflow: 'hidden',
                                                                                                textOverflow: 'ellipsis',
                                                                                                display: 'inline-block',
                                                                                                verticalAlign: 'middle',
                                                                                            }}
                                                                                            title={ele.cln_name} // show full text on hover
                                                                                        >
                                                                                            {ele.cln_name}
                                                                                        </label>
                                                                                    </div>
                                                                                ))}
                                                                        </div>
                                                                    )}
                                                                </div>


                                                                {
                                                                    selectedItems.length === 1 ?
                                                                        <div className=" "  >
                                                                            <button onClick={() => setSelectedButton("0")} className="btn btn-success btn-sm" type="submit" style={{ marginTop: openDropdown ? 215 : 7 }}>
                                                                                Add Report
                                                                            </button>
                                                                            <Button className='btn-sm me-2' style={{ marginTop: openDropdown ? '220px' : '7px', marginLeft: "110px" }} onClick={() => toggle()} >Cancel</Button>
                                                                        </div> :
                                                                        <>
                                                                        </>}
                                                                {
                                                                    selectedItems && selectedItems.length > 1 ?
                                                                        <div  style={{ display: "flex", justifyContent: "space-between" }}>
                                                                            {/* <Button color="primary btn-sm" onClick={() => { setIsModalOpen(true); }} style={{ marginTop: openDropdown ? 220 : 9 }}>
                                                                                Create Relationship
                                                                            </Button>
                                                                             */}


                                                                            {relationships.length > 0 ? (

                                                                                <>
                                                                                    <Button
                                                                                        color="info"
                                                                                        size="sm"
                                                                                        onClick={() => setManageRelationshipToggle(!managerelationshipToggle)} // 👈 different modal/functionality
                                                                                        style={{ marginTop: openDropdown ? 220 : 9 }}
                                                                                    >
                                                                                        Manage Relationship
                                                                                    </Button>

                                                                                    <Button
                                                                                color="success"
                                                                                size="sm"
                                                                                type='submit'
                                                                                style={{ marginTop: openDropdown ? 220 : 9, marginLeft: 10 }}
                                                                                onClick={() =>{ console.log("Add Report clicked"); setSelectedButton("0")}}
                                                                            >
                                                                               Add Report
                                                                            </Button>

                                                                                </>
                                                                            ) : (
                                                                                <Button
                                                                                    color="primary"
                                                                                    size="sm"
                                                                                    onClick={() => setIsModalOpen(true)} // 👈 create functionality
                                                                                    style={{ marginTop: openDropdown ? 220 : 9 }}
                                                                                >
                                                                                    Create Relationship
                                                                                </Button>
                                                                            )}


                                                                            {/* <Button
                                                                                color="success"
                                                                                size="sm"
                                                                                type='submit'
                                                                                style={{ marginTop: openDropdown ? 220 : 9, marginLeft: 10 }}
                                                                                onClick={() =>{ console.log("Add Report clicked"); setSelectedButton("0")}}
                                                                            >
                                                                               Add Report
                                                                            </Button> */}
                                                                            <Button className='btn-sm me-2' style={{ marginTop: openDropdown ? '220px' : '7px', marginLeft: ''}} onClick={() => toggle()}>Cancel</Button>

                                                                        </div>
                                                                        :
                                                                        <>
                                                                        </>
                                                                }



                                                            </AvForm>
                                                        </div>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                        </div>

                                        <RelationshipModal
                                            isOpen={isModalOpen}
                                            toggle={() => { setIsModalOpen(!isModalOpen);   } }
                                            collections={selectedItems}
                                            onSaveRelationship={handleSaveRelationship}
                                            style={{ alignContent: 'center' }}
                                            managerelationshipToggle={managerelationshipToggle}
                                            relationshipsAdded={relationships[0]}
                                            
                                            
                                        />
                                        <div style={{ overflow: "auto", height: "90vh", }}>
                                            <SortableTree
                                                treeData={treeData}
                                                onChange={handleTreeChange}
                                                onMoveNode={(object) => dispatch(dndNode(object))}
                                                canDrop={(object) => object.nextParent !== undefined && object.nextParent.type == 2 ? false : true}
                                                scaffoldBlockPxWidth={40}
                                                slideRegionSize={25}
                                                generateNodeProps={({ node, path }) => {
                                                    const updatedPath = [...path];
                                                    return {
                                                        listIndex: 0,
                                                        lowerSiblingCounts: [],
                                                        className: node.type === 2 ? "icon-a" : "icon-b",
                                                        onClick: (event) => {
                                                            if (event.target.className.includes("collapseButton") || event.target.className.includes("expandButton")) {
                                                            } else {
                                                                setSelectedNodeId(node.id);
                                                                dispatch(getNodeData(node));
                                                            }
                                                        },
                                                        style: {
                                                            border: selectedNodeId === node.id ? "2px solid #556EE6" : '1px solid #c3cacd',
                                                            backgroundImage: "url('../../../../assets/images/drag-and-drop-7.png')"
                                                        },
                                                        title: (
                                                            <div>
                                                                {
                                                                    console.log('state.editcrud && state.id  :>> ', state.editcrud , state.id )
                                                                }
                                                                <div style={{ maxWidth: 450 }} key={`div-${node.id}`}>
                                                                    {state.editcrud && state.id === node.id ? (
                                                                        <AvForm onValidSubmit={addCrudNode}>
                                                                            <div className="d-flex flex-row align-items-center">
                                                                                <div className="me-2 p-0">
                                                                                    <input name="title" placeholder="Enter Menu Name" className="form-control py-1 m-0" type="text" value={state.menuName} onChange={(e) => { dispatch(setMenuName(e.target.value)) }} />
                                                                                </div>
                                                                                <div className="d-flex flex-row">
                                                                                    <button className="btn btn-sm btn-secondary " type="submit" style={{ marginRight: 3 }}>
                                                                                        Update
                                                                                    </button>
                                                                                    <Link to="#" className="btn btn-sm btn-soft-danger" onClick={() => { dispatch(setState({ editcrud: false, id: null })) }} id={`closetooltip-${node.id}`} >
                                                                                        <i className="mdi mdi-close" />
                                                                                        <UncontrolledTooltip placement="top" target={`closetooltip-${node.id}`} >
                                                                                            {"Close"}
                                                                                        </UncontrolledTooltip>
                                                                                    </Link>
                                                                                </div>
                                                                            </div>
                                                                        </AvForm>
                                                                    ) : (
                                                                        <div>
                                                                            <Tooltip
                                                                                placement="bottom"
                                                                                target={`btn-${node.id}`}
                                                                                toggle={() => toggleToolTip(`btn-${node.id}`)}
                                                                            >
                                                                                {node.title}
                                                                            </Tooltip>
                                                                            <Link
                                                                                to="#"
                                                                                id={`btn-${node.id}`}
                                                                                style={{ fontSize: 12, fontWeight: 400 }}
                                                                            >
                                                                                {String(node.title).slice(0, 40) +
                                                                                    (node.title?.length > 40 ? "..." : "")}
                                                                            </Link>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ),
                                                        buttons: [
                                                            <Row className="" key={node.id}>
                                                                <ul className="list-unstyled hstack gap-1 mb-0 justify-content-end">
                                                                    {state.editcrud && state.id === node.id ? null : (
                                                                        <li>
                                                                            <Link
                                                                                to="#"
                                                                                className="btn btn-sm btn-soft-info"
                                                                                onClick={() => node.type !== 2 && dispatch(editNode(updatedPath, node))}
                                                                                id={`edittooltip-${node.id}`}
                                                                            >
                                                                                <i className="mdi mdi-pencil-outline" />
                                                                                <UncontrolledTooltip placement="top" target={`edittooltip-${node.id}`} >
                                                                                    {node.type !== 2 && "Edit Menu"}
                                                                                </UncontrolledTooltip>
                                                                            </Link>
                                                                        </li>
                                                                    )}
                                                                    {
                                                                        node.type === 1 && (
                                                                            <li>
                                                                                {console.log('node.id', node.id)}
                                                                                <div

                                                                                    className="btn btn-sm btn-soft-info"
                                                                                    onClick={() => {
                                                                                        sessionStorage.setItem("pageNodeInfo", JSON.stringify(node));
                                                                                        dispatch(setNodeInfo(node));
                                                                                        dispatch(updateLayoutInfo([]));
                                                                                        dispatch(resetState());
                                                                                        navigate('/report_page');
                                                                                    }}
                                                                                    id={`ViewReport-${node.id}`}
                                                                                >
                                                                                    <i className="mdi mdi-layers-plus" />
                                                                                    <UncontrolledTooltip placement="top" target={`ViewReport-${node.id}`} >
                                                                                        {node.type !== 2 && "Create / Edit"}
                                                                                    </UncontrolledTooltip>
                                                                                </div>
                                                                            </li>

                                                                        )


                                                                    }
                                                                    {node.type === 0 && (
                                                                        <UncontrolledDropdown direction="end" isOpen={dropdownStates[node.id]} toggle={() => toggleDropdown(node.id)}>
                                                                            <DropdownToggle className="card-drop" tag="a">
                                                                                <Link to="#" className="btn btn-sm btn-soft-primary" id={`viewtooltip-${node.id}`} onClick={() => dispatch(addNode(node, updatedPath, 0))} >
                                                                                    <i className="mdi mdi-file-tree" />
                                                                                    <UncontrolledTooltip placement="top" target={`viewtooltip-${node.id}`}>
                                                                                        Add Submenu
                                                                                    </UncontrolledTooltip>
                                                                                </Link>
                                                                            </DropdownToggle>
                                                                            <DropdownMenu className="dropdown-menu-end " style={{ width: 220 }} id={"dp" + String(node.id)}>
                                                                                <div className="px-4">
                                                                                    <AvForm onValidSubmit={addCrudNode} >
                                                                                        <div className="my-2">
                                                                                            <AvField
                                                                                                name="title"
                                                                                                label="Sub Menu Name "
                                                                                                placeholder="Enter Sub Menu"
                                                                                                type="text"
                                                                                                errorMessage="Enter Menu"
                                                                                                validate={{
                                                                                                    required: { value: true },
                                                                                                    minLength: {
                                                                                                        value: 4,
                                                                                                        errorMessage: "Min 4 chars.",
                                                                                                    },
                                                                                                }}
                                                                                                defaultValue={""}
                                                                                                onChange={(e) => {
                                                                                                    dispatch(setMenuName(e.target.value));
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="my-3">
                                                                                            <button className="btn btn-primary btn-block m-1" type="submit" style={{ marginRight: 5 }}>
                                                                                                Add Menu
                                                                                            </button>
                                                                                        </div>
                                                                                    </AvForm>
                                                                                </div>
                                                                            </DropdownMenu>
                                                                        </UncontrolledDropdown>
                                                                    )}

                                                                    <li>
                                                                        <Link
                                                                            to="#"
                                                                            className="btn btn-sm btn-soft-danger"
                                                                            onClick={() => dispatch(deleteNode(node, path,navigate, "udp" + String(node.id), "dp" + String(node.id)), authInfo)}
                                                                            id={`deletetooltip-${node.id}`}
                                                                        >
                                                                            <i className="mdi mdi-delete-outline" />
                                                                            <UncontrolledTooltip placement="top" target={`deletetooltip-${node.id}`}>
                                                                                {node.type !== 2 && "Delete Menu"}
                                                                            </UncontrolledTooltip>
                                                                        </Link>
                                                                    </li>
                                                                    {node.type === 0 && (
                                                                        <UncontrolledDropdown direction="end" isOpen={dropdownReportStates[node.id]} toggle={() => toggleReportDropdown(node.id)}>
                                                                            <DropdownToggle className="card-drop" tag="a">
                                                                                <Link to="#" className="btn btn-sm btn-soft-success" id={`addreport-${node.id}`} onClick={() => dispatch(addNode(node, updatedPath, 1))} >
                                                                                    <i className="mdi mdi-plus" />
                                                                                    <UncontrolledTooltip placement="top" target={`addreport-${node.id}`}>
                                                                                        Add Report
                                                                                    </UncontrolledTooltip>
                                                                                </Link>
                                                                            </DropdownToggle>
                                                                            <DropdownMenu className="dropdown-menu-end " style={{ width: 220 }} id={"dp" + String(node.id)}>
                                                                                <div className="px-4">
                                                                                    <AvForm onValidSubmit={addCrudNode}>
                                                                                        <div className="my-2">
                                                                                            <AvField
                                                                                                name="title"
                                                                                                label="Report Name "
                                                                                                placeholder="Enter report Name"
                                                                                                type="text"
                                                                                                errorMessage="Enter Name"
                                                                                                validate={{
                                                                                                    required: { value: true },
                                                                                                    minLength: {
                                                                                                        value: 4,
                                                                                                        errorMessage: "Min 4 chars.",
                                                                                                    },
                                                                                                }}
                                                                                                defaultValue={""}
                                                                                                onChange={(e) => {
                                                                                                    dispatch(setMenuName(e.target.value));
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="my-3">
                                                                                            <button className="btn btn-primary btn-block m-1" type="submit" style={{ marginRight: 5 }}>
                                                                                                Add Report
                                                                                            </button>
                                                                                        </div>
                                                                                    </AvForm>
                                                                                </div>
                                                                            </DropdownMenu>
                                                                        </UncontrolledDropdown>
                                                                    )}

                                                                </ul>
                                                            </Row>
                                                        ],
                                                    };
                                                }}
                                            />
                                        </div>
                                    </>

                            }



                        </div>
                    </div>
                </Container>
            ) : (
                <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <div className="spinner-border text-secondary m-1" role="status"> </div>
                        <div>Loading, Please wait.</div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default TreeStructure;