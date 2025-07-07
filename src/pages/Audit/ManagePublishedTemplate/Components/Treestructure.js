import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// import { Container, Row, UncontrolledTooltip, DropdownMenu, DropdownToggle, UncontrolledDropdown, Tooltip } from "reactstrap"
import { Container, Row, UncontrolledTooltip, OffcanvasBody,DropdownMenu, DropdownToggle, UncontrolledDropdown, Tooltip, Offcanvas,OffcanvasHeader } from "reactstrap"

import { AvForm, AvField } from 'availity-reactstrap-validation';
import SortableTree from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import { addNode, crudNode, dndNode, setMenuName, setTreeData, deleteNode, getNodeData, setState, updateTreeData, editNode, updateNode, onTreeChange } from '../../../../toolkitStore/Auditvista/tempSlice';
import InputTemplate from './InputTemplate';
import { changeNodeAtPath, addNodeUnderParent, getFlatDataFromTree, getNodeAtPath, removeNodeAtPath, getVisibleNodeCount } from 'react-sortable-tree';


// const TreeStructure = () => {
//     const dispatch = useDispatch();
//     const [dataLoaded, setDataLoaded] = useState(true);
//     const [selectedNodeId, setSelectedNodeId] = useState(null);
//     const [dropdownStates, setDropdownStates] = useState({});

//     const treeData = useSelector(updateTreeData);
//     const state = useSelector(state => state.TemptreeData);
//     console.log(state,'state');
//     const toggle = () => {
//         dispatch(setState({ mainToggle: !state.mainToggle }));
//     };

//     const addCrudNode = (values) => {
//         const action = state.crudStatus === 2 ? updateNode : crudNode;
//         dispatch(action(values));
//         setDropdownStates({})
//     };

//     const toggleToolTip = () => {
//     };

//     const handleTreeChange = (newTreeData) => {
//         onTreeChange(newTreeData, dispatch);
//     };

//     const handleBackButtonClick = () => {
//         dispatch(setTreeData([]));
//         dispatch(setState({}));

//     };
//     const toggleDropdown = (id) => {
//         setDropdownStates({
//             ...dropdownStates,
//             [id]: !dropdownStates[id]
//         });
//     };

//     return (
//         <React.Fragment>
//             {dataLoaded ? (
//                 <Container fluid>
//                     <div className="d-flex flex-row" style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
//                         <div style={{ background: "white", width: "100%", transition: "width .35s ease-in-out", position: "absolute", float: "left", }} className="p-3 me-2" >
//                             <div className="row">
//                                 <div className="mb-2 col-10 ">
//                                     <UncontrolledDropdown isOpen={state.mainToggle} toggle={toggle}>
//                                         <DropdownToggle className="btn btn-primary" color="#eff2f7" onClick={() => dispatch(setState({ path: [], crud: true, crudStatus: 0, type: 0, children: [], mainToggle: true }))} >
//                                             <i className="mdi mdi-plus me-1 "></i> Create New
//                                         </DropdownToggle>
//                                         <DropdownMenu style={{ width: 250 }} className="">
//                                             <div className="px-4">
//                                                 <AvForm onValidSubmit={addCrudNode}>
//                                                     <div className="my-2">
//                                                         <AvField name="title" label="Menu Name " placeholder="Enter Menu" type="text" errorMessage="Enter Menu" validate={{ required: { value: true }, minLength: { value: 4, errorMessage: "Min 4 chars.", } }} defaultValue={""} onChange={(e) => { dispatch(setMenuName(e.target.value)) }} />
//                                                     </div>
//                                                     <div className="my-3">
//                                                         <button className="btn btn-primary btn-block m-1" type="submit" style={{ marginRight: 5 }}>
//                                                             Add Menu
//                                                         </button>
//                                                     </div>
//                                                 </AvForm>
//                                             </div>
//                                         </DropdownMenu>
//                                     </UncontrolledDropdown>
//                                 </div>

//                             </div>
//                             <div style={{ overflow: "auto", height: "90vh", }}>
//                                 <SortableTree
//                                     treeData={treeData}
//                                     onChange={handleTreeChange}
//                                     onMoveNode={(object) => dispatch(dndNode(object))}
//                                     canDrop={(object) => object.nextParent !== undefined && object.nextParent.type == 2 ? false : true}
//                                     scaffoldBlockPxWidth={40}
//                                     slideRegionSize={25}
//                                     generateNodeProps={({ node, path }) => {
//                                         const updatedPath = [...path];
//                                         return {
//                                             listIndex: 0,
//                                             lowerSiblingCounts: [],
//                                             className: node.type === 2 ? "icon-a" : "icon-b",
//                                             onClick: (event) => {
//                                                 if (event.target.className.includes("collapseButton") || event.target.className.includes("expandButton")) {
//                                                 } else {
//                                                     setSelectedNodeId(node.id);
//                                                     dispatch(getNodeData(node));
//                                                 }
//                                             },
//                                             style: {
//                                                 border: selectedNodeId === node.id ? "2px solid #556EE6" : '1px solid #c3cacd',
//                                                 backgroundImage: "url('../../../../assets/images/drag-and-drop-7.png')"
//                                             },
//                                             title: (
//                                                 <div>
//                                                     <div style={{ maxWidth: 450 }} key={`div-${node.id}`}>
//                                                         {state.editcrud && state.id === node.id ? (
//                                                             <AvForm onValidSubmit={addCrudNode}>
//                                                                 <div className="d-flex flex-row align-items-center">
//                                                                     <div className="me-2 p-0">
//                                                                         <input name="title" placeholder="Enter Menu Name" className="form-control py-1 m-0" type="text" value={state.menuName} onChange={(e) => { dispatch(setMenuName(e.target.value)) }} />
//                                                                     </div>
//                                                                     <div className="d-flex flex-row">
//                                                                         <button className="btn btn-sm btn-secondary " type="submit" style={{ marginRight: 3 }}>
//                                                                             Update
//                                                                         </button>
//                                                                         <Link to="#" className="btn btn-sm btn-soft-danger" onClick={() => { dispatch(setState({ editcrud: false, id: null })) }} id={`closetooltip-${node.id}`} >
//                                                                             <i className="mdi mdi-close" />
//                                                                             <UncontrolledTooltip placement="top" target={`closetooltip-${node.id}`} >
//                                                                                 {"Close"}
//                                                                             </UncontrolledTooltip>
//                                                                         </Link>
//                                                                     </div>
//                                                                 </div>
//                                                             </AvForm>
//                                                         ) : (
//                                                             <div>
//                                                                 <Tooltip
//                                                                     placement="bottom"
//                                                                     target={`btn-${node.id}`}
//                                                                     toggle={() => toggleToolTip(`btn-${node.id}`)}
//                                                                 >
//                                                                     {node.title}
//                                                                 </Tooltip>
//                                                                 <Link
//                                                                     to="#"
//                                                                     id={`btn-${node.id}`}
//                                                                     style={{ fontSize: 12, fontWeight: 400 }}
//                                                                 >
//                                                                     {String(node.title).slice(0, 40) +
//                                                                         (node.title?.length > 40 ? "..." : "")}
//                                                                 </Link>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             ),
//                                             buttons: [
//                                                 <Row className="" key={node.id}>
//                                                     <ul className="list-unstyled hstack gap-1 mb-0 justify-content-end">
//                                                         {state.editcrud && state.id === node.id ? null : (
//                                                             <li>
//                                                                 <Link
//                                                                     to="#"
//                                                                     className="btn btn-sm btn-soft-info"
//                                                                     onClick={() => node.type !== 2 && dispatch(editNode(updatedPath, node))}
//                                                                     id={`edittooltip-${node.id}`}
//                                                                 >
//                                                                     <i className="mdi mdi-pencil-outline" />
//                                                                     <UncontrolledTooltip placement="top" target={`edittooltip-${node.id}`} >
//                                                                         {node.type !== 2 && "Edit Menu"}
//                                                                     </UncontrolledTooltip>
//                                                                 </Link>
//                                                             </li>
//                                                         )}
//                                                         {node.type === 0 && (
//                                                             <UncontrolledDropdown direction="end" isOpen={dropdownStates[node.id]} toggle={() => toggleDropdown(node.id)}>
//                                                                 <DropdownToggle className="card-drop" tag="a">
//                                                                     <Link to="#" className="btn btn-sm btn-soft-primary" id={`viewtooltip-${node.id}`} onClick={() => dispatch(addNode(node, updatedPath, 0))} >
//                                                                         <i className="mdi mdi-file-tree" />
//                                                                         <UncontrolledTooltip placement="top" target={`viewtooltip-${node.id}`}>
//                                                                             Add Submenu
//                                                                         </UncontrolledTooltip>
//                                                                     </Link>
//                                                                 </DropdownToggle>
//                                                                 <DropdownMenu className="dropdown-menu-end " style={{ width: 220 }} id={"dp" + String(node.id)}>
//                                                                     <div className="px-4">
//                                                                         <AvForm onValidSubmit={addCrudNode} >
//                                                                             <div className="my-2">
//                                                                                 <AvField
//                                                                                     name="title"
//                                                                                     label="Sub Menu Name "
//                                                                                     placeholder="Enter Sub Menu"
//                                                                                     type="text"
//                                                                                     errorMessage="Enter Menu"
//                                                                                     validate={{
//                                                                                         required: { value: true },
//                                                                                         minLength: {
//                                                                                             value: 4,
//                                                                                             errorMessage: "Min 4 chars.",
//                                                                                         },
//                                                                                     }}
//                                                                                     defaultValue={""}
//                                                                                     onChange={(e) => {
//                                                                                         dispatch(setMenuName(e.target.value));
//                                                                                     }}
//                                                                                 />
//                                                                             </div>
//                                                                             <div className="my-3">
//                                                                                 <button className="btn btn-primary btn-block m-1" type="submit" style={{ marginRight: 5 }}>
//                                                                                     Add Menu
//                                                                                 </button>
//                                                                             </div>
//                                                                         </AvForm>
//                                                                     </div>
//                                                                 </DropdownMenu>
//                                                             </UncontrolledDropdown>
//                                                         )}

//                                                         <li>
//                                                             <Link
//                                                                 to="#"
//                                                                 className="btn btn-sm btn-soft-danger"
//                                                                 onClick={() => dispatch(deleteNode(node, path, "udp" + String(node.id), "dp" + String(node.id)))}
//                                                                 id={`deletetooltip-${node.id}`}
//                                                             >
//                                                                 <i className="mdi mdi-delete-outline" />
//                                                                 <UncontrolledTooltip placement="top" target={`deletetooltip-${node.id}`}>
//                                                                     {node.type !== 2 && "Delete Menu"}
//                                                                 </UncontrolledTooltip>
//                                                             </Link>
//                                                         </li>
//                                                     </ul>
//                                                 </Row>
//                                             ],
//                                         };
//                                     }}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </Container>
//             ) : (
//                 <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
//                     <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
//                         <div className="spinner-border text-secondary m-1" role="status"> </div>
//                         <div>Loading, Please wait.</div>
//                     </div>
//                 </div>
//             )}
//         </React.Fragment>
//     );
// };

const TreeStructure = () => {
    const dispatch = useDispatch();
    const [dataLoaded, setDataLoaded] = useState(true);
    const [open, setOpen] = useState(false);
    const [nodeSelected, setnodeSelected] = useState(false);
    const [expanded, setexpanded] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")));
    const [dropdownStates, setDropdownStates] = useState({});
    const [checkpointInfo, setcheckpointInfo] = useState([]);
    const [position, setposition] = useState("right");
    const [mode, setmode] = useState("right");
    const getNodeKey = ({ treeIndex }) => treeIndex;


    const treeData = useSelector(updateTreeData);
    console.log(treeData,'treeData');
    const state = useSelector(state => state.TemptreeData);
    console.log(state,'state');
    const toggle = () => {
        dispatch(setState({ mainToggle: !state.mainToggle }));
    };

    const addCrudNode = (event,values) => {
        console.log(values,'values',event);
        const action = state.crudStatus === 2 ? updateNode : crudNode;
        dispatch(action(values));
        setDropdownStates({})
    };

    const toggleToolTip = () => {
    };

    const handleTreeChange = (newTreeData) => {
        onTreeChange(newTreeData, dispatch);
    };

    const handleBackButtonClick = () => {
        dispatch(setTreeData([]));
        dispatch(setState({}));

    };
    const toggleDropdown = (id) => {
        setDropdownStates({
            ...dropdownStates,
            [id]: !dropdownStates[id]
        });
    };

    const addCheckpoint=(node, path, getNodeKey, type, udp, dp)=>{
        setOpen(!open)
        var getNodeInfo = getNodeAtPath({
            treeData: state.treeData,
            path,
            getNodeKey,
          });

          console.log(getNodeInfo,type,'getNodeInfo');

        dispatch(setState({
            type,
            path: path,
            getNodeKey: getNodeKey,
            crud: false,
            editcrud: false,
            crudStatus: 1,
            title: getNodeInfo.node.title,
            getTitle: "",
            getSubTitle: "",
            getSubTitledd: "0",
            id:
                getNodeInfo.node.children == undefined || getNodeInfo.node.children == 0
                    ? getNodeInfo.node.id
                    : getNodeInfo.node.children.length + 1,
            parent: getNodeInfo.node.id,
            mode: "0",
            configdatacheckpoint: authUser.config_data.question_type_info,
        }))
    }



    const AECheckPointUnderNode=(values,mode)=>{
        var validate_no_of_img = values.checkpoint_options
        var max_img = validate_no_of_img.filter((e => {
            if (e.no_of_img > authUser.client_info[0].max_photos || e.score > authUser.client_info[0].max_score_value) {
              return e
            }
          }))
          console.log(mode,'mode',values);
          if (mode == "0") {
            if (max_img.length == 0) {
                dispatch(crudNode(values))
                setOpen(!open)
            }
          }
          else
            if (mode == "1") {
              if (max_img.length == 0) {
                // dispatch(crudNode(values))
                dispatch(editCheckpointAtPath(values))
                setOpen(!open)
              }
            }




    }



    const onDrawerClose =()=>{
        setOpen(false)
        dispatch(getDocuments())

    }

    const editCheckpoint=(path, getNodeKey, udp, dp,nodeInfo)=>{
        setOpen(true)
        var getNodeInfo = getNodeAtPath({
            treeData: state.treeData,
            path,
            getNodeKey,
          });
          console.log(getNodeInfo,'getNodeInfo',nodeInfo);
          dispatch(setState({
            crud: false,
            editcrud: false,
            crudStatus: 2,
            path: path,
            getNodeInfo: getNodeInfo.node,
            getNodeKey: getNodeKey,
            getCode: getNodeInfo.node.code,
            getTitle: getNodeInfo.node.title,
            type: getNodeInfo.node.type,
            mode: "1",
            // checkpointInfo: [getNodeInfo.node],
          }))
          setcheckpointInfo([getNodeInfo.node])



    }




    return (
        <React.Fragment>
            {dataLoaded ? (
                <Container fluid>
                   <div className="d-flex flex-row" style={{position: "relative", width:"100%", minHeight:"100vh", overflow: 'auto' }} >
                    <div
                            style={{
                                background: "white",
                                width: nodeSelected ? "calc(100% - 600px)" : "100%",
                                transition: "width .35s ease-in-out",
                                position: "absolute",
                                float: "left",
                            }}
                            className="p-3 me-2">

                            <div className="row">
                                <div className="mb-2 col-10 ">
                                    <UncontrolledDropdown isOpen={state.mainToggle} toggle={toggle}>
                                        <DropdownToggle className="btn btn-primary" color="#eff2f7" onClick={() => dispatch(setState({ path: [], crud: true, crudStatus: 0, type: 0, children: [], mainToggle: true }))} >
                                            <i className="mdi mdi-plus me-1 "></i> Create New Topic
                                        </DropdownToggle>
                                        <DropdownMenu style={{ width: 250 }} className="">
                                            <div className="px-4">
                                                <AvForm onValidSubmit={addCrudNode}>
                                                    <div className="my-2">
                                                        <AvField name="title" label="Topic Name " placeholder="Enter Topic" type="text" errorMessage="Enter Topic" validate={{ required: { value: true }, minLength: { value: 4, errorMessage: "Min 4 chars.", } }} defaultValue={""} onChange={(e) => { dispatch(setMenuName(e.target.value)) }} />
                                                    </div>
                                                    <div className="my-3">
                                                        <button className="btn btn-primary btn-block m-1" type="submit" style={{ marginRight: 5 }}>
                                                            Add Topic
                                                        </button>
                                                    </div>
                                                </AvForm>
                                            </div>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                                <div className="col-2 d-flex justify-content-end">
                                    {
                                        nodeSelected &&
                                        <div>
                                            <button className="btn btn-md btn-primary" onClick={() => {
                                                setnodeSelected(false)
                                                setSelectedNodeId(null);
                                                // dispatch(getNodeData(node));
                                            }}>Expand <i className="mdi mdi-arrow-right" /></button>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div style={{ overflow: "visible", height: "70vh" }}>
                                <SortableTree
                                    treeData={state.treeData}
                                    onChange={handleTreeChange}
                                    onMoveNode={(object) => dispatch(dndNode(object))}
                                    canDrop={(object) => object.nextParent !== undefined && object.nextParent.type == 2 ? false : true}
                                    scaffoldBlockPxWidth={40}
                                    slideRegionSize={25}
                                    generateNodeProps={({ node, path }) => {
                                        const updatedPath = [...path];
                                        console.log(node,'node');
                                        return {
                                            listIndex: 0,
                                            lowerSiblingCounts: [],
                                            className: node.type === 2 ? "icon-a" : "icon-b",
                                            onClick: (event) => {
                                                if (event.target.className.includes("collapseButton") || event.target.className.includes("expandButton")) {
                                                } else {
                                                    setSelectedNodeId(node.id);
                                                    dispatch(getNodeData(node));
                                                    setnodeSelected(true)
                                                }
                                            },
                                            style: {
                                                border: selectedNodeId === node.id ? "2px solid #556EE6" : '1px solid #c3cacd',
                                                backgroundImage: "url('../../../../assets/images/drag-and-drop-7.png')"
                                            },
                                            title: (
                                                <div>
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
                                                                    onClick={() => {
                                                                        node.type !== 2 ? dispatch(editNode(updatedPath, node)) :
                                                                            editCheckpoint(path, getNodeKey, "udp" + String(node.id), "dp" + String(node.id), node)
                                                                        //  setOpen(true)
                                                                    }}
                                                                    id={`edittooltip-${node.id}`}
                                                                >
                                                                    <i className="mdi mdi-pencil-outline" />
                                                                    <UncontrolledTooltip placement="top" target={`edittooltip-${node.id}`} >
                                                                        {node.type !== 2 && "Edit Topic"}
                                                                    </UncontrolledTooltip>
                                                                </Link>
                                                            </li>
                                                        )}
                                                        {node.type === 0 && (
                                                            <UncontrolledDropdown direction="end" isOpen={dropdownStates[node.id]} toggle={() => toggleDropdown(node.id)}>
                                                                <DropdownToggle className="card-drop" tag="a">
                                                                    <Link to="#" className="btn btn-sm btn-soft-primary" id={`viewtooltip-${node.id}`} onClick={() => dispatch(addNode(node, updatedPath, 0))} >
                                                                        <i className="mdi mdi-file-tree" />
                                                                        <UncontrolledTooltip placement="top" target={`viewtooltip-${node.id}`}>
                                                                            Add SubTopic
                                                                        </UncontrolledTooltip>
                                                                    </Link>
                                                                </DropdownToggle>
                                                                <DropdownMenu className="dropdown-menu-end " style={{ width: 220 }} id={"dp" + String(node.id)}>
                                                                    <div className="px-4">
                                                                        <AvForm onValidSubmit={addCrudNode} >
                                                                            <div className="my-2">
                                                                                <AvField
                                                                                    name="title"
                                                                                    label="Add SubTopic Name "
                                                                                    placeholder="Enter SubTopic"
                                                                                    type="text"
                                                                                    errorMessage="Enter SubTopic"
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
                                                                                    Add SubTopic
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
                                                                onClick={() => dispatch(deleteNode(node, path, "udp" + String(node.id), "dp" + String(node.id)))}
                                                                id={`deletetooltip-${node.id}`}
                                                            >
                                                                <i className="mdi mdi-delete-outline" />
                                                                <UncontrolledTooltip placement="top" target={`deletetooltip-${node.id}`}>
                                                                    {/* {node.type !== 2 && "Delete Menu"} */}
                                                                    {node.type !== 2 ? "Delete Menu" : "Delete Check point"}
                                                                </UncontrolledTooltip>
                                                            </Link>
                                                        </li>
                                                        {
                                                            node.type === 0 &&
                                                            <li>
                                                                <Link
                                                                    to="#"
                                                                    className={"btn btn-sm btn-soft-success"}
                                                                    onClick={() => {
                                                                        console.log(state.path, path)
                                                                        addCheckpoint(
                                                                            node,
                                                                            path,
                                                                            getNodeKey,
                                                                            2,
                                                                            "udp" + String(node.id),
                                                                            "dp" + String(node.id)
                                                                        )

                                                                    }}
                                                                    // onClick={() => dispatch(deleteNode(node, path, "udp" + String(node.id), "dp" + String(node.id)))}
                                                                    id={`shareaudit-${node.id}`}
                                                                >
                                                                    <i className="mdi mdi-clipboard-text-outline" />
                                                                    <UncontrolledTooltip placement="top" target={`shareaudit-${node.id}`}>
                                                                        {"Add Checkpoint"}
                                                                    </UncontrolledTooltip>
                                                                </Link>
                                                            </li>
                                                        }
                                                    </ul>
                                                </Row>
                                            ],
                                        };
                                    }}
                                />

                            </div>

                    </div>
  <div
                                style={{
                                    position: "absolute",
                                    right: nodeSelected ? 0 : -620,
                                    transition: "right .35s ease-in-out",
                                    width: 600,
                                }}


                            >
                                <div className="ms-2">
                                    {
                                        nodeSelected &&
                                        <div style={{ height: "100vh", overflow: "auto" }}>
                                            <div
                                                className={
                                                    state.getNodeInfo?.title != "" ? "mb-1 p-3 bg-white" : ""
                                                }
                                            >
                                                <span>{state.getNodeInfo?.title}</span>
                                            </div>
                                            {state?.nodeChildren?.map((item, i) => {
                                                var getColor =
                                                    item.node.impact_level == "Critical"
                                                        ? "#f46a6a"
                                                        : item.node.impact_level == "High"
                                                            ? "#f1b44c"
                                                            : item.node.impact_level == "Medium"
                                                                ? "#50a5f1"
                                                                : item.node.impact_level == "Low"
                                                                    ? "#34c38f"
                                                                    : "#556ee6";
                                                return (
                                                    <div
                                                        className="mb-1 d-flex flex-column p-3 bg-white"
                                                        key={"cp" + i}
                                                        style={{
                                                            borderBottom: "1px solid",
                                                            borderColor: getColor,
                                                        }}
                                                    >
                                                        <div>
                                                            <span className="font-size-10 text-secondary">
                                                                {item.parentNode != null
                                                                    ? item.parentNode.title
                                                                    : ""}
                                                            </span>
                                                        </div>
                                                        <div className="my-2">
                                                            <span style={{ color: getColor }}>
                                                                {String(i).length > 1 ? i + 1 : "0" + (i + 1)}
                                                            </span>{" "}
                                                            <span className="font-size-13">
                                                                {item.node.checkpoint}
                                                            </span>
                                                        </div>
                                                        <div className="my-2">
                                                            {item.node.checkpoint_options.map(
                                                                (child, idx) => (
                                                                    <div
                                                                        className="d-flex flex-column p-2 my-1"
                                                                        style={{
                                                                            border: "1px solid #f0f0f0",
                                                                            borderRadius: 10,
                                                                        }}
                                                                        key={"cp" + i + "ptn" + idx}
                                                                    >
                                                                        <span>
                                                                            {child.option_text}{" "}
                                                                            {child.enable_img ? (
                                                                                <i className="mdi mdi-camera-plus" />
                                                                            ) : null}{" "}
                                                                            {child.enable_video ? (
                                                                                <i className="mdi mdi-video-plus" />
                                                                            ) : null}{" "}
                                                                            {child.enable_doc ? (
                                                                                <i className="mdi mdi-file-document" />
                                                                            ) : null}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                        {item.node.impact_level != "" ? (
                                                            <div className="my-2">
                                                                <span
                                                                    className="badge badge-soft p-1 font-size-12"
                                                                    style={{ backgroundColor: getColor }}
                                                                >
                                                                    {item.node.impact_level}
                                                                </span>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    }
                                </div>
                            </div>
                    </div>
                  
                    <Offcanvas
                     isOpen={open}
                     toggle={onDrawerClose}
                     direction="end" // 'end' corresponds to 'right' in Drawer
                     style={{ width: '700px', zIndex: 9999 }}
                    >
                <OffcanvasHeader toggle={onDrawerClose}> Add Check point </OffcanvasHeader>
                <OffcanvasBody
                  style={{
                    padding: 10,
                    maxHeight: window.innerHeight,
                    overflow: "auto",
                  }}
                >
                    {
                        open ?
                        <InputTemplate
                        checkpointinfo={checkpointInfo}
                        configdatacheckpoint={
                            authUser.config_data.question_type_info
                        }
                        mode={state.mode}
                        parameterData={true}
                        onClose={() => onDrawerClose()}
                        onSubmit={(values) => {
                          AECheckPointUnderNode(values, state.crudStatus === 2 ?"1" : "0");
                        }}
                      />
                      :
                      null

                    }


                    </OffcanvasBody>


                    </Offcanvas>
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
