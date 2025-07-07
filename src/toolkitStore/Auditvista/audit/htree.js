import { createSlice } from '@reduxjs/toolkit';
import { changeNodeAtPath, addNodeUnderParent, getFlatDataFromTree, getNodeAtPath, removeNodeAtPath, getVisibleNodeCount,getTreeFromFlatData } from 'react-sortable-tree';
import urlSocket from '../../../helpers/urlSocket';
// import store from '../../store'

const getNodeKey = ({ treeIndex }) => treeIndex;
    

const treeDataSlice = createSlice({
    name: 'HtreeData',
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
        publishInfo:{
            saving : false,
            successmsgshow : false,
            alertMsg :""
        },
        nodeInfo : null,
        nodeUsers :[],
        showQr:'',
        generate:false,
        newNodeInfo : null,
        apiRequestLoading : true
    },
    reducers: {
        setTreeData: (state, action) => {
            console.log(action.payload,'action.payload')
            state.treeData = action.payload;
        },
        setApiRequestLoad: (state, action) => {
            state.apiRequestLoading = action.payload;
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
        setShowQr:(state,action)=>{
            state.showQr = action.payload
        },
        setPublishInfo:(state,action)=>{
            state.publishInfo.saving = action.payload.saving
            state.publishInfo.successmsgshow = action.payload.successmsgshow
            state.publishInfo.alertMsg = action.payload.alertMsg
        },
        setnodeInfo:(state,action)=>{
            state.nodeInfo = action.payload
        },
        setnodeUsers:(state,action)=>{
            state.nodeUsers = action.payload
        },
        setGenerate:(state,action)=>{
            state.generate = action.payload
        },
        setNewNodeInfo:(state,action)=>{
            state.newNodeInfo = action.payload
        }
    },
});

export const { setTreeData,setGenerate,setNewNodeInfo, setState,setApiRequestLoad, setTotalHLength,setPublishInfo, setMenuName,setnodeInfo ,setnodeUsers,setShowQr} = treeDataSlice.actions;


// Function to save tree and flat data
export const saveTreeData = async (treeData, totalHLength,dispatch,getState,mode,nodeInfo,subtitle) => {
    var flatData = await saveHStructure(treeData)
    console.log('saveTreeData', treeData, flatData, totalHLength)
   await saveData(flatData,totalHLength,dispatch,getState,mode,nodeInfo,subtitle)
};


export const getHdata =(mode)=>{
    console.log('///111',mode)
    return dispatch =>{

        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        const hInfo = JSON.parse(sessionStorage.getItem("hInfo"))

        try {

            urlSocket.post("webhstre/gethstructure",{
                info:{
                    _id : hInfo._id,
                    company_id : hInfo.company_id,
                    encrypted_db_url : authUser.db_info.encrypted_db_url,
                }
            }).then(async(response)=>{
                console.log(response,'response')
                if(response.data.response_code === 500){
                    var FlatData = response.data.data.hstructure
                    console.log(FlatData,'treeData')
                    dispatch(setTreeData(FlatData))
                    dispatch(setTotalHLength(response.data.data.lastGeneratedId))
                    dispatch(setApiRequestLoad(false))
                }
            })
           
        } catch (error) {
                console.log(error,'error')
        }
    }
}


export const addUsers = async (userNodeInfo) => {
    console.log(userNodeInfo,'userNodeInfo')
    const store = require("../../../store").default; 
    var treeData =[]
    var HtreeData = store.getState().HtreeData
    var treeData = [...HtreeData.treeData]
    const index = userNodeInfo.nodeInfo.flatData.findIndex(node => node.id === userNodeInfo.nodeInfo.node.id);
    if (index !== -1) {
        userNodeInfo.nodeInfo.flatData[index]["user_count"] = userNodeInfo.nodeInfo.node.unique_users.length;
        var updatedInfo = await updateNodeFlatCln(userNodeInfo.nodeInfo.node)
        console.log(updatedInfo,'updatedInfo')
    }
    console.log(index, 'index', userNodeInfo)
    var treeData = await getTreeFromFlatDataAsync(userNodeInfo.nodeInfo.flatData)
    console.log(treeData, 'treeData')
    store.dispatch(setTreeData(treeData))
    saveTreeData(treeData, store.getState().totalHLength, store.dispatch)
    store.dispatch(setnodeUsers(userNodeInfo.nodeInfo.node.unique_users))
    store.dispatch(setnodeInfo(userNodeInfo.nodeInfo.node))
   
   
  }


export const publishHStructure =async(treeData,dispatch)=>{

    var explicitData = await treeDataToFlat(treeData)
    var flatData = _.map(explicitData,'node')
    console.log(flatData,'flatData')
    await publishData(flatData,dispatch)
}

export const publishData=async(flatData,dispatch)=>{

    try {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        const hInfo = JSON.parse(sessionStorage.getItem("hInfo"))
        dispatch(setPublishInfo({
            saving : true,
            successmsgshow : false,
            alertMsg :''
        }))


        const responseData = await urlSocket.post("webhstre/publishhstructure",{
            info :{
                encrypted_db_url : authUser.db_info.encrypted_db_url,
                company_id: hInfo.company_id,
                user_id: authUser.user_data._id,
                user_name: authUser.user_data.first_name,
                h_id: hInfo._id,
                flatData: flatData,
            }
        })
        console.log(responseData,'responseData')

        if(responseData.data.response_code === 500){
            dispatch(setPublishInfo({
                saving : false,
                successmsgshow : true,
                alertMsg : responseData.data.message
            }))

            setTimeout(() => {
                dispatch(setPublishInfo({
                    saving : false,
                    successmsgshow : false,
                    alertMsg : ""
                }))
            }, 2500);

        }


        
    } catch (error) {
        console.log(error,'error')
        
    }



}






export const getTreeFromFlatDataAsync = (FlatData) => {
    // FlatData
    console.log(FlatData)
    try {
      return new Promise((resolve, reject) => {
        try {
          const treeData = getTreeFromFlatData({
            flatData: FlatData,
            getKey: (node) => node.id,
            getParentKey: (node) => node.parent,
            rootKey: null,
            expanded: true
          });
          console.log(treeData, 'treeData')
          resolve(treeData);
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {

    }

  }





export const addNodeUser = (treeData, nodeInfo, type, history, cat_type, path) => {
    var flatData = getFlatDataFromTree(
        {
            treeData: treeData,
            getNodeKey: getNodeKey,
            ignoreCollapsed: false,
        })

    console.log(flatData, 'flatData', nodeInfo)
    // if(nodeInfo.children === undefined){
    //     nodeInfo["children"]=[]
    // }
    // var node = {
    //     node:nodeInfo, path, totalHLength: flatData.length, cat_type: cat_type, 
    //     treeData: treeData,
    //     flat_data: _.map(flatData,'node')
    // }

    
    var node ={
        node:nodeInfo,
        path,
        totalHLength: flatData.length,
        cat_type: cat_type, 
    }
    var treeData={
        treeData: treeData,
    }
    var flat_data={
        flat_data : _.map(flatData,'node')
    }

    console.log(node,'node')
    sessionStorage.removeItem("nodeInfo");
    sessionStorage.setItem("nodeInfo", JSON.stringify(node));
    // sessionStorage.setItem("treeData", JSON.stringify(treeData));
    // sessionStorage.setItem("flatData", JSON.stringify(flat_data));

    if (type === 2) {
        history('/mpusr')
    }
}

export const saveData =(flatData,totalHLength,dispatch,getState,mode,nodeInfo,subtitle)=>{
    const hInfo = JSON.parse(sessionStorage.getItem("hInfo"))
    const authUser = JSON.parse(sessionStorage.getItem("authUser"))
    dispatch(setPublishInfo({
        saving : true,
        successmsgshow : false,
        alertMsg :''
    }))
    var HtreeData = getState().HtreeData

    try {
        urlSocket.post("webhstre/savehstructure",
            {
                info :{
                    _id : hInfo._id,
                    encrypted_db_url : authUser.db_info.encrypted_db_url,
                    company_id : hInfo.company_id,
                    flatData : HtreeData.treeData,
                    lastGeneratedId: totalHLength
                }
            }
        ).then(async(response)=>{
            console.log(response,'response')
            if(mode){
                // if(values.subtitle && state.crudStatus ===2){
                    await updateAlllevelNode(nodeInfo,subtitle)
                // }
            }
            dispatch(setPublishInfo({
                saving : false,
                successmsgshow : true,
                alertMsg : "Saved successfully"
            }))
            // setTimeout(() => {
                console.log("here");
                dispatch(getHdata("mode"))
                    
                // }, 200);

            setTimeout(() => {
                dispatch(setPublishInfo({
                    saving : false,
                    successmsgshow : false,
                    alertMsg : ""
                }))
            }, 2500);
        })

    } catch (error) {
        console.log("here",error);
        
    }
}


export const updateNodeFlatCln=async(flatInfo)=>{

    // return async dispatch =>{
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))

        try {
            const responseData = await urlSocket.post("webhstre/crud-flat-info",{
                encrypted_db_url : authUser.db_info.encrypted_db_url,
                flatInfo : flatInfo,
                user_id : authUser.user_data._id
            })
            console.log(responseData,'responseData')
            if(responseData.data.response_code === 500){
                return responseData
            }
            
        } catch (error) {
            
        }



    // }



}






//  function to get tree data from flat data
export const treeDataToFlat = (treeData) => {
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
const saveHStructure = (treeData) => {
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
    const state = getState().HtreeData;
    console.log('state', state)
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
        children: getNodeInfo.node.children || state.children || []
    }));
};

//  action to create parent , child, and edit node
export const crudNode = (values) => async(dispatch, getState) => {
    // const store = require("../../store"); 
    const state = getState().HtreeData;
    const { treeData, menuName, totalHLength, crudStatus } = state;

    let updatedTreeData;
    var newNode={
        // id: totalHLength + 1,
    }
    console.log(crudStatus,'crudStatus',totalHLength)
    if(crudStatus== 0){
        newNode={
            id : totalHLength+1,
            parent: null,
            title: values.title,
            subtitle: values.subtitledd == "0" || values.subtitledd === "" || (values.subtitledd === "1" && (values.subtitle === "")) ? "Level " + (state.path.length + 1) : values.subtitledd === "1" ? values.subtitle : values.subtitledd,
            node_positon: "Level " + (state.path.length + 1),
            type: state.type,
            category_input: values.subtitledd == "" || (values.subtitledd === "1" && values.subtitle === "") ? false : true,
            user_count:0,
            ...values
        }
    }
    else if(crudStatus== 1){
        newNode = {
            id: totalHLength + 1,
            title: values.title,
            type: state.type,
            user_count:0,
            ...values
        };
    }

    console.log(newNode,'newNode')
    var updateNodeFlat = await updateNodeFlatCln(newNode)   
    console.log(updateNodeFlat,'updateNodeFlat',newNode);
    if(updateNodeFlat.data.data){
        newNode["flat_ref_id"] = updateNodeFlat.data.data._id
    }
    if(newNode["generate_qr"] === true && updateNodeFlat.data.data){
        dispatch(setNewNodeInfo(updateNodeFlat.data.data))
        dispatch(setShowQr(updateNodeFlat.data.data.qr_name))
        dispatch(setGenerate(true))
    }

    switch (crudStatus) {

        case 0: // create main node
            const parentKey = state.path && state.path.length > 0 ? state.path[state.path.length - 1] : null;
            updatedTreeData = addNodeUnderParent({
                treeData,
                parentKey,
                expandParent: true,
                getNodeKey,
                newNode:newNode,
                // newNode: {
                //     id: totalHLength + 1,
                //     parent: null,
                //     title: values.title,
                //     subtitle: values.subtitledd == "0" || values.subtitledd === "" || (values.subtitledd === "1" && (values.subtitle === "")) ? "Level " + (state.path.length + 1) : values.subtitledd === "1" ? values.subtitle : values.subtitledd,
                //     node_positon: "Level " + (state.path.length + 1),
                //     type: state.type,
                //     category_input: values.subtitledd == "" || (values.subtitledd === "1" && values.subtitle === "") ? false : true,
                //     ...values
                // },
                addAsFirstChild: state.addAsFirstChild,
            }).treeData;
            break;

        case 1: // Create sub-node
         newNode = {
                id: totalHLength + 1,
                title: values.title,
                type: state.type,
                node_level : newNode.node_level,
                node_positon : newNode.node_positon,
                flat_ref_id : newNode.flat_ref_id,
                subtitle : newNode.subtitle,
                parent : newNode.parent,
                category_input : newNode.category_input,
                subtitledd : newNode.subtitledd,
                h_id : newNode.h_id,
                company_id : newNode.company_id,
                company_name : newNode.company_name,
                owner_id : newNode.owner_id,
                user_count:0,
                h_node_type : newNode.h_node_type

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

    console.log(updatedTreeData,'updatedTreeData')
    // Dispatch action to update treeData in Redux store
    dispatch(setTreeData(updatedTreeData));
    saveTreeData(updatedTreeData, crudStatus === 2 ? totalHLength : totalHLength + 1,dispatch,getState)

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

//  action to edit  a node's information
export const editNode = (path, node) => (dispatch, getState) => {
    const state = getState().HtreeData;

    const getNodeInfo = getNodeAtPath({
        treeData: state.treeData,
        path,
        getNodeKey,
    });
    console.log(getNodeInfo,'getNodeInfo')

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
export const updateNode = (values) => async(dispatch, getState) => {
    const state = getState().HtreeData;
    const { treeData, menuName, totalHLength, crudStatus } = state;
    console.log(state,'state')
    let updatedTreeData;
    var newNode ={
        ...state.getNodeInfo,
        title: values.title,
        ...values
    }
    console.log(newNode,'newNode');

    var updateNodeFlat = await updateNodeFlatCln(newNode)   
    if(newNode["generate_qr"] === true && updateNodeFlat.data.data){
        dispatch(setShowQr(updateNodeFlat.data.data.qr_name))
        newNode["qr_name"]=updateNodeFlat.data.data.qr_name
        dispatch(setnodeInfo(newNode))
        // dispatch(setGenerate(true))
    }


    switch (crudStatus) {
        case 2: // Edit node
            updatedTreeData = changeNodeAtPath({
                treeData,
                path: state.path,
                expandParent: true,
                getNodeKey,
                newNode: {
                    // ...state.getNodeInfo,
                    // title: values.title,
                    // ...values
                    id: newNode.id,
                    title: newNode.title,
                    type: newNode.type,
                    node_level : newNode.node_level,
                    node_positon : newNode.node_positon,
                    flat_ref_id : newNode.flat_ref_id,
                    subtitle : newNode.subtitle,
                    parent : newNode.parent,
                    category_input : newNode.category_input,
                    subtitledd : newNode.subtitledd,
                    h_id : newNode.h_id,
                    company_id : newNode.company_id,
                    company_name : newNode.company_name,
                    owner_id : newNode.owner_id,
                    user_count:newNode.user_count,
                    h_node_type : newNode.h_node_type,
                    children : newNode.children
                },
            });
            break;

        default:
            console.error("Invalid crudStatus value:", crudStatus);
            return;
    }
    console.log(updatedTreeData,'updatedTreeData')

    // Dispatch action to update treeData in Redux store
    dispatch(setTreeData(updatedTreeData));
    await saveTreeData(updatedTreeData, totalHLength,dispatch,getState,"1",state.nodeInfo,values.subtitle);

   
    // sessionStorage.removeItem("qr_generate")
    // dispatch(setGenerate(false))
    // Dispatch action to update state
    if(!state.generate){
    dispatch(setState({
        crud: false,
        editcrud: false,
        childToggle: false,
        mainToggle: false,
        dataLoaded: true,
        totalHLength: crudStatus === 2 ? totalHLength : totalHLength + 1,
    }));
    }
};


const updateAlllevelNode=async(nodeInfo,subtitle)=>{
    try {
        console.log(nodeInfo,'nodeInfo')
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))

       const reponseData = await urlSocket.post("cog/updt-hlevels",{
            encrypted_db_url : authUser.db_info.encrypted_db_url,
            node_positon : nodeInfo.node_positon,
            h_id : nodeInfo.h_id,
            subtitle : subtitle,
        })
        console.log(reponseData,'reponseData')
        
    } catch (error) {
        
    }
}






export const deletFlatInfo=(node)=>{

    return new Promise(async(resolve,reject)=>{

        try {
            const authUser = JSON.parse(sessionStorage.getItem("authUser"))
            const responseData = await urlSocket.post("webhstre/delete-flat-node-info",{
                encrypted_db_url : authUser.db_info.encrypted_db_url,
                _id : node.flat_ref_id,
                h_id : node.h_id,
                parent : node.id
            })
            console.log(responseData,'responseData')
            if(responseData.data.response_code === 500){
                resolve(responseData)
            }
            
        } catch (error) {
            reject(error)
        }

    })
}



//  action to delete node
export const deleteNode = (node, path) => async(dispatch, getState) => {
    var deleteFlatNode = await deletFlatInfo(node)
    console.log(deleteFlatNode,'node')

    // Assuming you have imported the necessary functions like removeNodeAtPath and saveHStructure
    var totalHLength = getState().HtreeData.totalHLength
    dispatch(setTreeData(removeNodeAtPath({
        treeData: getState().HtreeData.treeData, // Accessing the treeData from Redux state
        path,
        getNodeKey,
    })));
    dispatch(setState({ crud: false }))
    saveTreeData(getState().HtreeData.treeData, totalHLength,dispatch,getState)
};


export const getFlatNodeInfo=(nodeInfo)=>{

    return async dispatch =>{
        try {
            const authUser = JSON.parse(sessionStorage.getItem("authUser"))

            const responseData = await urlSocket.post("webhstre/retrive-flat-node-info",{
                encrypted_db_url : authUser.db_info.encrypted_db_url,
                _id : nodeInfo.flat_ref_id,
            })
            if (responseData.data.response_code === 500) {
                var nodeInfoData = _.cloneDeep(nodeInfo)
                // _.cloneDeep(hSlice.nodeInfo)
                console.log(nodeInfoData,'nodeInfoData');
                if (responseData.data.data.length > 0) {
                    var flatInfo = responseData.data.data[0]
                    return flatInfo
                    // nodeInfoData["loc_lat"] = flatInfo.loc_lat
                    // nodeInfoData["loc_long"] = flatInfo.loc_long
                    // nodeInfoData["asset_expiry_on"] = flatInfo.asset_expiry_on
                    // nodeInfoData["asset_desc"] = flatInfo.asset_desc
                    // nodeInfoData["asset_placed_on"] = flatInfo.asset_placed_on
                    // nodeInfoData["asset_s_no"] = flatInfo.asset_s_no
                    // console.log(nodeInfoData,'nodeInfoData')
                    // store.dispatch(setnodeInfo(nodeInfoData))



                }

            }
        
        } catch (error) {
                console.log(error,'error')
        }
    }

}



const recursiveUpdate=async (nodeData, childData, count, node_level_length,flatData,dispatch,getState)=>{
    var childData =_.cloneDeep(childData)
    console.log(node_level_length,'node_level_length',childData)
    _.each(childData, async(item, idx) => {
        var addedValue = node_level_length+1
        childData[idx].node_level = node_level_length
        childData[idx].node_positon = "Level " + addedValue
        // //(idx,'idx',item)
        if (childData[idx].children !== undefined && childData[idx].children.length >0) {
          count++;
          var level_idx = childData[idx].node_level + 1
          recursiveUpdate(nodeData, childData[idx].children, count, level_idx,flatData,dispatch,getState)
        }
        else{
            _.each(childData,(item,idx1)=>{
                var getIdx = _.findIndex(flatData,{id :childData[idx1].id })
                console.log(getIdx,'flatIdx')
                if(getIdx !==-1){
                flatData[getIdx]={
                    ...flatData[getIdx],
                    node_level : childData[idx1].node_level,
                    node_positon : childData[idx1].node_positon,
                }

                }

            })

            console.log("all completed",childData,count,flatData)
            const treeData = await  getTreeFromFlatDataAsync(flatData);
            console.log(treeData,'treeData')
            dispatch(setTreeData(treeData));
            await saveTreeData(treeData, getState().HtreeData.totalHLength,dispatch,getState);

        }
      })
}


//  action to drag and drop  nodes
export const dndNode = (droppedNodeInfo) => async (dispatch, getState) => {
    try {
        console.log(droppedNodeInfo,'droppedNode')
        var flatInfo = await dispatch(getFlatNodeInfo(droppedNodeInfo.node));
        if(flatInfo){
            var droppedNode = _.cloneDeep(droppedNodeInfo)
            droppedNode.node["loc_lat"] = flatInfo.loc_lat
            droppedNode.node["loc_long"] = flatInfo.loc_long
            droppedNode.node["asset_expiry_on"] = flatInfo.asset_expiry_on
            droppedNode.node["asset_desc"] = flatInfo.asset_desc
            droppedNode.node["asset_placed_on"] = flatInfo.asset_placed_on
            droppedNode.node["asset_s_no"] = flatInfo.asset_s_no
            droppedNode.node["unique_users"]=flatInfo.unique_users
            droppedNode.node["user_path"]=flatInfo.user_path


        }
        console.log(droppedNode,'droppedNode');
        // var nodeInfo = await 

         const parentId = droppedNode.nextParentNode ? droppedNode.nextParentNode.id : null;
        //  droppedNode.node.parent_path = droppedNode.nextParentNode.parent_path
         var getParentNodeInfo
         if(droppedNode.nextParentNode != null){
          getParentNodeInfo = {
            id: droppedNode.nextParentNode.id,
            parent: droppedNode.nextParentNode.parent,
            title: droppedNode.nextParentNode.title,
            subtitle: droppedNode.nextParentNode.subtitle,
            code: droppedNode.nextParentNode.code,
            type: droppedNode.nextParentNode.type,
            h_id: droppedNode.node.h_id,
            company_id: droppedNode.node.company_id,
            company_name: droppedNode.node.company_name,
            owner_id: droppedNode.node.owner_id,
          }
        }

        // var hInfo = JSON.parse(sessionStorage.getItem("hInfo"))
        var newNode ={
            parent: parentId,
            title: droppedNode.node.title,
            code: droppedNode.node.code,
            id: droppedNode.node.id,
            children: droppedNode.node.children == undefined ? [] : droppedNode.node.children,
            type: droppedNode.node.type,
            h_id: droppedNode.node.h_id,
            company_id: droppedNode.node.company_id,
            company_name: droppedNode.node.company_name,
            owner_id: droppedNode.node.owner_id,
            user_path: droppedNode.node.user_path,
            unique_users: droppedNode.node.unique_users == undefined ? [] : droppedNode.node.unique_users,
            node_level: droppedNode.path.length - 1,
            category_input: droppedNode.node.category_input,
            subtitle: droppedNode.node.category_input == false ? "Level " + droppedNode.path.length : droppedNode.node.subtitle,
            node_positon: "Level " + droppedNode.path.length,
            flat_ref_id : droppedNode.node.flat_ref_id,
            h_node_type : droppedNode.node.h_node_type

        }

        var updateNodeFlat = await updateNodeFlatCln(newNode)   

        console.log(newNode,'newNode')

        const updatedTreeData = changeNodeAtPath({
            treeData: getState().HtreeData.treeData,
            path: droppedNode.path,
            getNodeKey: getNodeKey,
            newNode:{
                id: newNode.id,
                title: newNode.title,
                type: newNode.type,
                node_level : newNode.node_level,
                node_positon : newNode.node_positon,
                flat_ref_id : newNode.flat_ref_id,
                subtitle : newNode.subtitle,
                parent : newNode.parent,
                category_input : newNode.category_input,
                h_id : newNode.h_id,
                company_id : newNode.company_id,
                company_name : newNode.company_name,
                owner_id : newNode.owner_id,
                user_count:newNode.unique_users.length,
                h_node_type : newNode.h_node_type,
                children : newNode.children
                
            }
            // {
            //     parent: parentId,
            //     title: droppedNode.node.title,
            //     code: droppedNode.node.code,
            //     id: droppedNode.node.id,
            //     children: droppedNode.node.children == undefined ? [] : droppedNode.node.children,
            //     type: droppedNode.node.type,
            //     h_id: droppedNode.node.h_id,
            //     company_id: droppedNode.node.company_id,
            //     company_name: droppedNode.node.company_name,
            //     owner_id: droppedNode.node.owner_id,
            //     user_path: droppedNode.node.user_path,
            //     unique_users: droppedNode.node.unique_users == undefined ? [] : droppedNode.node.unique_users,
            //     node_level: droppedNode.path.length - 1,
            //     category_input: droppedNode.node.category_input,
            //     subtitle: droppedNode.node.category_input == false ? "Level " + droppedNode.path.length : droppedNode.node.subtitle,
            //     node_positon: "Level " + droppedNode.path.length
            // }
            ,

        });
        console.log(updatedTreeData,'updatedTreeData')

        dispatch(setTreeData(updatedTreeData));
        await saveTreeData(updatedTreeData, getState().HtreeData.totalHLength,dispatch,getState);
  
          if (droppedNode.node.children !== undefined) {
            if (droppedNode.node.children.length > 0) {
                console.log(droppedNode.node.children,'droppedNode',droppedNode)
                var flatData = await treeDataToFlat(getState().HtreeData.treeData)
                var flatData = _.map(flatData,'node')
                console.log(flatData,'flatData')
              recursiveUpdate(droppedNode, droppedNode.node.children, 0, droppedNode.path.length,flatData,dispatch,getState)
            }
          }
         // console.log(droppedNode,'droppedNode',parentId)
      
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


// export default treeDataSlice.reducer;
export const updateTreeData = (state) => (state.HtreeData.treeData)
export const HtreeDataSliceReducer = treeDataSlice.reducer;