import { createSlice } from '@reduxjs/toolkit';
import { changeNodeAtPath, addNodeUnderParent, getFlatDataFromTree, getNodeAtPath, removeNodeAtPath, getVisibleNodeCount } from 'react-sortable-tree';
import urlSocket from '../../helpers/urlSocket';

import { updateLayoutInfo, setReportTreeNodeInfo } from '../../Slice/reportd3/reportslice';
import Swal from "sweetalert2";

const getNodeKey = ({ treeIndex }) => treeIndex;
    

const treeDataSlice = createSlice({
    name: 'treeData',
    initialState: {
        treeData: [],
        crud: false,
        editcrud: false,
        crudStatus: 0,
        path: [],
        getNodeInfo: null,
        getCode: null,
        getTitle: null,
        type: null,
        id: null,
        parent: null,
        menuName: '',
        totalHLength: 0,
        mainToggle: false,
        nodeCount: 1,
        reportRequestLoading : false,
        pageNodeInfo: JSON.parse(sessionStorage.getItem("pageNodeInfo")),
        reportName : ''
    },
    reducers: {
        setTreeData: (state, action) => {
            state.treeData = action.payload;
        },
        setState: (state, action) => {
            Object.assign(state, action.payload);
        },
        setTotalHLength: (state, action) => {
            state.totalHLength = action.payload;
        },
        setMenuName: (state, action) => {
            state.menuName = action.payload;
        },
        setReportRequestLoading:(state,action)=>{
            state.reportRequestLoading = action.payload
        },
        setNodeInfo: (state, action) => {
            state.pageNodeInfo = action.payload
        },
        setReportName:(state,action)=>{
            state.reportName = action.payload
        },
        setReportRequestError:(state,action)=>{
            state.reportRequestError = action.payload
        }
    },
});




const saveTreeData = (treeData, totalHLength, stateValues, history , authInfo , navigate , Node) => async (dispatch, getState) => {

    var auth = getState().auth
    console.log('Node :>> ', Node , stateValues);
    var flatData = await saveHStructure(treeData)
    if (stateValues.type === 1) {
        var nodeInfo = _.filter(flatData, { id: totalHLength - 1 })
        dispatch(createPageNode(totalHLength, stateValues , auth))
        const state = getState().reportSliceReducer;
        if (history !== undefined) {
            dispatch(setReportTreeNodeInfo(nodeInfo[0]))
            dispatch(updateLayoutInfo([]))

            sessionStorage.setItem("pageNodeInfo", JSON.stringify(nodeInfo[0]));
            dispatch(setNodeInfo(nodeInfo[0]));
            navigate("/report_page")
        }
    }   
    dispatch(saveTreeDataApi(treeData,totalHLength , auth , Node))
};


export const saveTreeDataApi=(treeData,totalHLength , authInfo , Node)=>{    

    return async dispatch =>{
        try {
        // const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        const pageInfo = JSON.parse(sessionStorage.getItem("page_data"))
        const data ={
            encrypted_db_url: authInfo.db_info.encrypted_db_url,
            treeInfo: treeData,
            _id: pageInfo?._id,
            totalHLength : totalHLength,
            Node: Node === undefined ? "" : Node ,
            status: pageInfo?.publish_status === '1' ? '3' : '0',
        }

        console.log('data  98888:>> ', data , Node);
        dispatch(setReportRequestLoading(true))
        const responseData = await urlSocket.post("report/crud-page-treeInfo",data)
        console.log('responseData :>> ', responseData);
        dispatch(setReportRequestLoading(false))
            
        } catch (error) {
            dispatch(setReportRequestError(true))
        }
    }
}



export const createPageNode=(nodeId,nodeValues , authInfo)=>{

    return async dispatch =>{
        const pageInfo = JSON.parse(sessionStorage.getItem("page_data"))
        const data ={
            node_id:nodeId,
            parent_id: nodeValues.parent,
            node_type : nodeValues.type,
            node_title : nodeValues.menuName,
            template_id: pageInfo._id,
            template_name: pageInfo.name,
            created_by : authInfo.user_data._id,
            status:( pageInfo.publish_status === '1' || pageInfo.publish_status === '0' )? '3' : '0',
        } 
        console.log('createPageNode', data)
        dispatch(setReportRequestLoading(true))
        try {
            const responseData = await urlSocket.post('report/create-node-page-layout',{layoutInfo : data, encrypted_db_url: authInfo.db_info.encrypted_db_url})
            dispatch(setReportRequestLoading(false))
          
        } catch (error) {
            console.log(error,'error')
            // dispatch(setReportRequestError(true))
        }
    }
}




//  function to get tree data from flat data
const treeDataToFlat = (treeData) => {
    var flatData = getFlatDataFromTree({
        treeData: treeData,
        getNodeKey,
        ignoreCollapsed: false,
    });
    var explicitData = _.filter(flatData, (item) => {
        return item;
    });
    return explicitData;
};

//  action to save tree structure 
export const saveHStructure = (treeData) => {
    return new Promise((resolve, reject) => {
        try {
            const explicitData = treeDataToFlat(treeData);
            resolve(_.map(explicitData, 'node'))
        } catch (error) {
            reject(error)
        }
    })
};


//  action to add sub node
export const addNode = (node, path, type) => (dispatch, getState) => {
    const state = getState().treeData;
    if (!path || path.length === 0) {
        console.error("Path array is empty or undefined");
        return;
    }
    const getNodeInfo = getNodeAtPath({
        treeData: state.treeData,
        path,
        getNodeKey,
    });

    if (!getNodeInfo) {
        console.error("Invalid path: getNodeInfo is null or undefined");
        return;
    }

    dispatch(setState({
        type,
        path: path,
        crud: true,
        editcrud: false,
        crudStatus: 1,
        title: getNodeInfo.node.title,
        getTitle: "",
        getSubTitle: "",
        getSubTitledd: "0",
        id: getNodeInfo.node.children ? getNodeInfo.node.children.length + 1 : getNodeInfo.node.id,
        parent: getNodeInfo.node.id,
        children: getNodeInfo.node.children || state.children || [],
    }));
};

//  action to create parent , child, and edit node
export const crudNode = (values, history, authInfo, navigate) => (dispatch, getState) => {
    const state = getState().treeData;
    const { treeData, menuName, totalHLength, crudStatus } = state;

    let updatedTreeData;

    console.log('values 212 :>> ', values , crudStatus ,  values?.relationships);
    console.log(String(values.title).length === 0 && String(values.menuName).length > 0 , String(values.title).length > 0 && String(values.menuName).length === 0 , String(values.title).length > 0 && String(values.menuName).length > 0 )
    switch (crudStatus) {

        case 0: // create main node
            if (String(values.title).length === 0 && String(values.menuName).length > 0) {
                const parentKey = state.path && state.path.length > 0 ? state.path[state.path.length - 1] : null;
                updatedTreeData = addNodeUnderParent({
                    treeData,
                    parentKey,
                    expandParent: true,
                    getNodeKey,
                    newNode: {
                        id: totalHLength + 1,
                        parent: null,
                        title: values.menuName,
                        subtitle: "",
                        type: state.type,
                        children: [],
                       


                    },
                    addAsFirstChild: state.addAsFirstChild,
                }).treeData;
            }
            if (String(values.title).length > 0 && String(values.menuName).length === 0) {

                const parentKey = state.path && state.path.length > 0 ? state.path[state.path.length - 1] : null;
                updatedTreeData = addNodeUnderParent({
                    treeData,
                    parentKey,
                    expandParent: true,
                    getNodeKey,
                    newNode: {
                        id: totalHLength + 1,
                        parent: null,
                        title: values.title,
                        subtitle: "",
                        type: 1,
                        children: [],
                        selected_cln_name: values?.selected_cln_name,
                        relationships: values?.relationships,
                        // ...values
                    },
                    addAsFirstChild: state.addAsFirstChild,
                }).treeData;
                console.log('values?.selected_cln_name,', values?.selected_cln_name,)
            }

            if (String(values.title).length > 0 && String(values.menuName).length > 0) {
                const parentKey = state.path && state.path.length > 0 ? state.path[state.path.length - 1] : null;
                // var childNode ={
                //     id: hLength+1,
                //     parent: hLength,
                //     title: values.title,
                //     subtitle: "",
                //     type: 1,
                // }
                updatedTreeData = addNodeUnderParent({
                    treeData,
                    parentKey,
                    expandParent: true,
                    getNodeKey,
                    newNode: {
                        id: totalHLength + 1,
                        parent: null,
                        title: values.selected_mode === "0" ? values.title : values.menuName,
                        subtitle: "",
                        type: values.selected_mode === "0" ? 1 : state.type,
                        children: [],
                        selected_cln_name: values?.selected_cln_name,
                        relationships: values?.relationships,
                    },
                    addAsFirstChild: state.addAsFirstChild,
                }).treeData;
            }


            break;

        case 1: // Create sub-node
            const newNode = {
                id: totalHLength + 1,
                parent: state.parent,
                title: values.title,
                subtitle: "",
                type: state.type,
            };

            updatedTreeData = addNodeUnderParent({
                treeData,
                parentKey: state.path[state.path.length - 1],
                expandParent: true,
                getNodeKey,
                newNode,
                addAsFirstChild: state.addAsFirstChild,
            }).treeData;

            break;

        default:
            console.error("Invalid crudStatus value:", crudStatus);
            return;
    }

    // Dispatch action to update treeData in Redux store
    dispatch(setTreeData(updatedTreeData));
    dispatch(saveTreeData(updatedTreeData, crudStatus === 2 ? totalHLength : String(values.title).length > 0 && String(values.menuName).length > 0 ? totalHLength + 2 : totalHLength + 1, getState().treeData, history, authInfo, navigate))

    // Dispatch action to update state
    dispatch(setState({
        crud: false,
        editcrud: false,
        childToggle: false,
        mainToggle: false,
        dataLoaded: true,
        totalHLength: crudStatus === 2 ? totalHLength : totalHLength + 1,
    }));
};



export const retrivePageTree = ( authInfo , canEdit ) => {

    return async dispatch => {

        
        try {
            const data = {
                _id: JSON.parse(sessionStorage.getItem("page_data"))._id,
                encrypted_db_url: authInfo.db_info.encrypted_db_url,
                authUser : authInfo.userInfo,
                authUser: { role: !canEdit ?'User' :'admin' }
               
            }
            console.log("authInfo 338", authInfo.userInfo , "data--->", data , "canEdit-------", canEdit)
            dispatch(setReportRequestLoading(true))
            var responseData
            if( !canEdit ){
                responseData = await urlSocket.post("report/retrive-user-page-tree", data)
                console.log("responseData user", responseData);
            }
            else{
                 responseData = await urlSocket.post("report/retrive-page-tree", data)
                 console.log("responseData Admin", responseData);
            }
           
            dispatch(setReportRequestLoading(false))
            if (responseData.status === 200) {
                if (responseData.data.data.length > 0) {
                    dispatch(setTreeData(responseData.data.data[0].tree_info))
                    dispatch(setTotalHLength(responseData.data.data[0].totalHLength))
                }
                else {
                    dispatch(setTreeData([]))
                }
            }


        }
        //  catch (error) {
        //     console.log(error, 'error')
        // }
        catch (error) {
            if (error.response) {
                // Server responded with a status other than 200
                console.error("Error Response:", error.response.status, error.response.data);

                if (error.response && error.response.status === 404) {
                    Swal.fire({
                      title: "Template Removed!",
                      text: "This template has been removed by the admin.",
                      icon: "error",
                      confirmButtonColor: "#d33",
                      confirmButtonText: "OK",
                    }).then(() => {
                      window.location.href = canEdit ? "/report" :'/user_report'; // Redirect after user clicks OK
                    });
                  }
            } else if (error.request) {
                // No response was received from the server
                console.error("No response received:", error.request);
            } else {
                // Other errors
                console.error("Error:", error.message);
            }
        }

    }
}

//  action to edit  a node's information
export const editNode = (path, node) => (dispatch, getState) => {
    const state = getState().treeData;

    const getNodeInfo = getNodeAtPath({
        treeData: state.treeData,
        path,
        getNodeKey,
    });

    dispatch(setState({
        crud: false,
        editcrud: true,
        crudStatus: 2,
        path: path,
        getNodeInfo: getNodeInfo.node,
        getCode: getNodeInfo.node.code,
        getTitle: getNodeInfo.node.title,
        type: getNodeInfo.node.type,
        id: getNodeInfo.node.id,
        parent: getNodeInfo.node.parent,
        menuName: node.title,
    }));
};
//  action to edit and update a node
export const updateNode = (values) => (dispatch, getState,history) => {
    const state = getState().treeData;
    const { treeData, menuName, totalHLength, crudStatus } = state;

    let updatedTreeData;

    switch (crudStatus) {
        case 2: // Edit node
            updatedTreeData = changeNodeAtPath({
                treeData,
                path: state.path,
                expandParent: true,
                getNodeKey,
                newNode: {
                    ...state.getNodeInfo,
                    title: menuName,
                },
            });
            break;

        default:
            console.error("Invalid crudStatus value:", crudStatus);
            return;
    }

    // Dispatch action to update treeData in Redux store
    dispatch(setTreeData(updatedTreeData));
    dispatch(saveTreeData(updatedTreeData, totalHLength,getState().treeData,history));

    // Dispatch action to update state
    dispatch(setState({
        crud: false,
        editcrud: false,
        childToggle: false,
        mainToggle: false,
        dataLoaded: true,
        totalHLength: crudStatus === 2 ? totalHLength : totalHLength + 1,
    }));
};

//  action to delete node
export const deleteNode = (node, path , navigate) => (dispatch, getState) => {
    console.log('node :>> ', node);
      var totalHLength = getState().treeData.totalHLength
    dispatch(setTreeData(removeNodeAtPath({
        treeData: getState().treeData.treeData, // Accessing the treeData from Redux state
        path,
        getNodeKey,
    })));
    dispatch(setState({ crud: false }))
    dispatch(saveTreeData( getState().treeData.treeData , totalHLength , getState().treeData , "" , "" , navigate , node))
};

//  action to drag and drop  nodes
export const dndNode = (droppedNode) => async (dispatch, getState) => {
    try {
        const parentId = droppedNode.nextParentNode ? droppedNode.nextParentNode.id : null;

        const updatedTreeData = changeNodeAtPath({
            treeData: getState().treeData.treeData,
            path: droppedNode.path,
            getNodeKey: getNodeKey,
            newNode: {
                parent: parentId,
                id: droppedNode.node.id,
                title: droppedNode.node.title,
                subtitle: droppedNode.node.subtitle,
                type: droppedNode.node.type,
                children: droppedNode.node.children || [],
                selected_cln_name: droppedNode.node.selected_cln_name || "", 
                relationships: droppedNode.node.relationships || "",
            },
        });

        dispatch(setTreeData(updatedTreeData));
        await dispatch(saveTreeData(updatedTreeData, getState().treeData.totalHLength,getState().treeData));
    } catch (error) {
        console.error('Error occurred while performing DND operation:', error);
        // Handle the error gracefully, e.g., show a message to the user or perform fallback actions
        // Optionally, re-throw the error if you need to propagate it further
        throw error;
    }
};

//  action to select node
export const getNodeData = (nodeData) => (dispatch, getState) => {
    const { type, title, children } = nodeData;

};

//  action to Expand button
export const onTreeChange = (newTreeData, dispatch) => {
    // Dispatch the setTreeData action to update the Redux store with the new tree data
    dispatch(setTreeData(newTreeData));
    dispatch(setState({
        nodeCount: getVisibleNodeCount({ treeData: newTreeData })
    }));
};


export const {setReportName, setTreeData, setState, setTotalHLength, setMenuName ,setNodeInfo,setReportRequestLoading} = treeDataSlice.actions;

export const treeDataSliceReducer = treeDataSlice.reducer