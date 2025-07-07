import { createSlice } from '@reduxjs/toolkit';
import urlSocket from 'helpers/urlSocket';
import { changeNodeAtPath, addNodeUnderParent, getFlatDataFromTree, getNodeAtPath, removeNodeAtPath, getVisibleNodeCount } from 'react-sortable-tree';

const getNodeKey = ({ treeIndex }) => treeIndex;
    
const treeDataSlice = createSlice({
    name: 'TemptreeData',
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
        nodeCount: 1
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
    },
});

export const { setTreeData, setState, setTotalHLength, setMenuName } = treeDataSlice.actions;


const saveTreeData = async (treeData, totalHLength) => {
    var flatData = await saveHStructure(treeData)

};

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


// export const addNode = (node, path, type) => (dispatch, getState) => {
//     const state = getState().TemptreeData;
//     if (!path || path.length === 0) {
//         console.error("Path array is empty or undefined");
//         return;
//     }
//     const getNodeInfo = getNodeAtPath({
//         treeData: state.treeData,
//         path,
//         getNodeKey,
//     });

//     if (!getNodeInfo) {
//         console.error("Invalid path: getNodeInfo is null or undefined");
//         return;
//     }

//     dispatch(setState({
//         type,
//         path: path,
//         crud: true,
//         editcrud: false,
//         crudStatus: 1,
//         title: getNodeInfo.node.title,
//         getTitle: "",
//         getSubTitle: "",
//         getSubTitledd: "0",
//         id: getNodeInfo.node.children ? getNodeInfo.node.children.length + 1 : getNodeInfo.node.id,
//         parent: getNodeInfo.node.id,
//         children: getNodeInfo.node.children || state.children || []
//     }));
// };




export const addNode = (node, path, type) => (dispatch, getState) => {
    console.log("createeee")
    const state = getState().TemptreeData;
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




export const crudNode = (values) => (dispatch, getState) => {
    console.log('values', values)
    const state = getState().TemptreeData;
    console.log('state', state)
    const { treeData, menuName, totalHLength, crudStatus } = state;
    let breadcrumb = state.breadcrumb + ' ' + '/' + ' ' + values.title
    const authUser = JSON.parse(sessionStorage.getItem("authUser"))
    const templateData = JSON.parse(sessionStorage.getItem("EditPublishedData"))

    let updatedTreeData;

    switch (crudStatus) {

        case 0:
            const parentKey = state.path && state.path.length > 0 ? state.path[state.path.length - 1] : null;
            updatedTreeData = addNodeUnderParent({
                treeData,
                parentKey,
                expandParent: true,
                getNodeKey,
                newNode: {
                    company_id: authUser.client_info[0].company_id,
                    owner_id: authUser.user_data._id,
                    template_id: templateData._id,
                    document_id: state.totalHLength + 1,
                    parent_id: null,
                    document_type: "0",
                    checkpoint: values.title,
                    checkpoint_type_id: null,
                    checkpoint_type: null,
                    enable_addOptns: false,
                    checkpoint_options: [],
                    min_score: 0,
                    max_score: 0,
                    custom_tbx: [],
                    impact_level: null,
                    compl_type: [],
                    creator_remarks: [],
                    guideline: "",
                    guideline_image: [],
                    id: state.totalHLength + 1,
                    parent: null,
                    title: values.title,
                    subtitle: "",
                    type:0,
                    breadcrumb: breadcrumb
                },
                addAsFirstChild: state.addAsFirstChild,
            }).treeData;


            console.log("updatedTreeData",updatedTreeData)

            break;

        case 1:

            // if (state.menuName !== '') {

                const newNode = {
                    company_id: authUser.client_info[0].company_id,
                    owner_id: authUser.user_data._id,
                    template_id: templateData._id,
                    document_id: state.totalHLength + 1,
                    parent_id: state.parent,
                    document_type: String(state.type),
                    checkpoint:state.type === 0? values.title : values.checkpoint,
                    checkpoint_type_id:state.type ===0 ? null : values.checkpoint_type_id,
                    checkpoint_type:state.type ===0 ? null: values.checkpoint_type,
                    enable_addOptns:state.type ===0 ? false: values.enable_addOptns,
                    checkpoint_options:state.type ===0 ? []: values.checkpoint_options,
                    min_score:state.type ===0 ? 0: values.min_score,
                    max_score:state.type ===0 ? 0: values.max_score,
                    custom_tbx: state.type ===0 ? []:values.custom_tbx,
                    impact_level:state.type ===0 ? null: values.impact_level,
                    compl_type:state.type ===0 ? []: values.compl_type,
                    creator_remarks:state.type ===0 ? "": values.creator_remarks,
                    guideline:state.type ===0 ? "": values.guideline,
                    guideline_image:state.type ===0 ? []: values.guideline_image,
                    id: state.totalHLength + 1,
                    parent: state.parent,
                    title:state.type === 0? values.title : values.checkpoint,
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
            // }


            break;

        case 2:

            updatedTreeData = addNodeUnderParent({
                treeData,
                expandParent: true,
                getNodeKey,
                newNode: {
                    children: state.getNodeInfo.children,
                    company_id: state.getNodeInfo.company_id,
                    owner_id: state.getNodeInfo.owner_id,
                    template_id: state.getNodeInfo.template_id,
                    document_type: state.getNodeInfo.document_type,
                    document_id: state.getNodeInfo.document_id,
                    parent_id: state.getNodeInfo.parent_id,
                    checkpoint: state.menuName,
                    checkpoint_type_id: state.getNodeInfo.checkpoint_type_id,
                    checkpoint_type: state.getNodeInfo.checkpoint_type,
                    enable_addOptns: state.getNodeInfo.enable_addOptns,
                    checkpoint_options: state.getNodeInfo.checkpoint_options,
                    min_score: state.getNodeInfo.min_score,
                    max_score: state.getNodeInfo.max_score,
                    custom_tbx: state.getNodeInfo.custom_tbx,
                    impact_level: state.getNodeInfo.impact_level,
                    compl_type: state.getNodeInfo.compl_type,
                    creator_remarks: state.getNodeInfo.creator_remarks,
                    guideline: state.getNodeInfo.guideline,
                    guideline_image: state.getNodeInfo.guideline_image,
                    title: state.menuName,
                    subtitle: "",
                    id: state.getNodeInfo.id,
                    parent: state.getNodeInfo.parent,
                    type: state.getNodeInfo.type,
                },
                crud: false,
                editcrud: false,
                childToggle: false,
                mainToggle: false,
                addAsFirstChild: state.addAsFirstChild,
            }).treeData;
            break;
       
       
        default:
            console.error("Invalid crudStatus value:", crudStatus);




            return;


    }
    console.log(updatedTreeData,'updatedTreeData');
    dispatch(setTreeData(updatedTreeData));
    // dispatch(saveTreeData(updatedTreeData, crudStatus === 2 ? totalHLength : totalHLength + 1, state))
    dispatch(saveUpdatedTreeData(updatedTreeData, totalHLength, state));


    dispatch(setState({
        crud: false,
        editcrud: false,
        childToggle: false,
        mainToggle: false,
        dataLoaded: true,
        totalHLength: crudStatus === 2 ? totalHLength : totalHLength + 1,
    }));
};




// export const crudNode = (values) => (dispatch, getState) => {
//     const state = getState().TemptreeData;
//     const { treeData, menuName, totalHLength, crudStatus } = state;

//     let updatedTreeData;

//     switch (crudStatus) {

//         case 0: 
//             const parentKey = state.path && state.path.length > 0 ? state.path[state.path.length - 1] : null;
//             updatedTreeData = addNodeUnderParent({
//                 treeData,
//                 parentKey,
//                 expandParent: true,
//                 getNodeKey,
//                 newNode: {
//                     id: totalHLength + 1,
//                     parent: null,
//                     title: values.title,
//                     subtitle: "",
//                     type: state.type,
//                     children: []
//                 },
//                 addAsFirstChild: state.addAsFirstChild,
//             }).treeData;
//             break;

//         case 1: 
//             const newNode = {
//                 id: totalHLength + 1,
//                 parent: state.parent,
//                 title: values.title,
//                 subtitle: "",
//                 type: state.type,
//             };

//             updatedTreeData = addNodeUnderParent({
//                 treeData,
//                 parentKey: state.path[state.path.length - 1],
//                 expandParent: true,
//                 getNodeKey,
//                 newNode,
//                 addAsFirstChild: state.addAsFirstChild,
//             }).treeData;

//             break;

//         default:
//             console.error("Invalid crudStatus value:", crudStatus);
//             return;
//     }

//     dispatch(setTreeData(updatedTreeData));
//     saveTreeData(updatedTreeData, crudStatus === 2 ? totalHLength : totalHLength + 1)

//     dispatch(setState({
//         crud: false,
//         editcrud: false,
//         childToggle: false,
//         mainToggle: false,
//         dataLoaded: true,
//         totalHLength: crudStatus === 2 ? totalHLength : totalHLength + 1,
//     }));
// };

export const editNode = (path, node) => (dispatch, getState) => {
    const state = getState().TemptreeData;

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

export const updateNode = () => (dispatch, getState) => {
    const state = getState().TemptreeData;
    const { treeData, menuName, totalHLength, crudStatus } = state;

    let updatedTreeData;

    switch (crudStatus) {
        case 2:
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
    console.log(updatedTreeData,'updatedTreeData');
    dispatch(setTreeData(updatedTreeData));
    dispatch(saveUpdatedTreeData(updatedTreeData, totalHLength, state));

    dispatch(setState({
        crud: false,
        editcrud: false,
        childToggle: false,
        mainToggle: false,
        dataLoaded: true,
        totalHLength: crudStatus === 2 ? totalHLength : totalHLength + 1,
    }));
};


export const saveUpdatedTreeData = (treeData, totalHLength,state) => async(dispatch, getState) => {
    var explicitData = await treeDataToFlat(treeData)
    dispatch(saveData(explicitData, totalHLength,state))
}

const saveData=(flatData, totalHLength,state)=>async(dispatch, getState)=>{
    const authUser = JSON.parse(sessionStorage.getItem("authUser"))
    const templateInfo = JSON.parse(sessionStorage.getItem("EditPublishedData"))
    try {
        urlSocket.post("webmngpbhtmplt/savepblhcpstructure",{
            templateInfo: {
                template_id: templateInfo._id,
                flatData: _.map(flatData, "node"),
                checkpointlength: _.filter(_.map(flatData, "node"), { type: 2 }).length,
                lastGeneratedId: totalHLength
            },
            userInfo: {
                created_by: authUser.user_data._id,
                company_id: authUser.user_data.company_id,
                encrypted_db_url: authUser.db_info.encrypted_db_url
            }
        }).then(async(response)=>{
                console.log(response,'response');
                if(response.status === 200){
                        getDocuments(templateInfo,authUser)
                }
        })
        
    } catch (error) {
            console.log(error,'error');
    }
}


const getDocuments=async(templateData,authUser)=>{
    console.log(templateData,authUser,'templateData,authUser');

    try {
        const responseData = await urlSocket.post("/webmngpbhtmplt/getpblhtemplatestructure",{
            templateInfo: {
                template_id: templateData._id,
                // tmplatedBy: this.state.templateData.tmplt_ctd_by
            },
            userInfo: {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                created_by: authUser.user_data._id,
                company_id: authUser.user_data.company_id
            }
        })
        console.log(responseData,'responseData');
        if(responseData.status === 200){
        //     var FlatData = responseData.data.template_structure[0]["template_structure"]
        //     dispatch(setTotalHLength(responseData.data.template_structure[0]["lastGeneratedId"]))
        //     dispatch(setState({
        //           nodeCount: getVisibleNodeCount({ treeData: FlatData })
        //     }))
        //    await dispatch(convertFlatDataToTreeData(FlatData))
        }

        
    } catch (error) {
        console.log(error,'error');
    }
}


   const convertFlatDataToTreeData = (FlatData)=>async(dispatch, getState)=>{
       const tree = getTreeFromFlatData({
           flatData: FlatData,
           getKey: (node) => node.id,
           getParentKey: (node) => node.parent,
           rootKey: null,
           expanded: true
       });
       console.log(tree,'tree');
       dispatch(setTreeData(tree))

}



// export const updateNode = () => (dispatch, getState) => {
//     const state = getState().TemptreeData;
//     const { treeData, menuName, totalHLength, crudStatus } = state;

//     let updatedTreeData;

//     switch (crudStatus) {
//         case 2: 
//             updatedTreeData = changeNodeAtPath({
//                 treeData,
//                 path: state.path,
//                 expandParent: true,
//                 getNodeKey,
//                 newNode: {
//                     ...state.getNodeInfo,
//                     title: menuName,
//                 },
//             });
//             break;

//         default:
//             console.error("Invalid crudStatus value:", crudStatus);
//             return;
//     }

//     dispatch(setTreeData(updatedTreeData));
//     saveTreeData(updatedTreeData, totalHLength);

//     dispatch(setState({
//         crud: false,
//         editcrud: false,
//         childToggle: false,
//         mainToggle: false,
//         dataLoaded: true,
//         totalHLength: crudStatus === 2 ? totalHLength : totalHLength + 1,
//     }));
// };

export const deleteNode = (node, path) => (dispatch, getState) => {
    var totalHLength = getState().TemptreeData.totalHLength
    dispatch(setTreeData(removeNodeAtPath({
        treeData: getState().TemptreeData.treeData,
        path,
        getNodeKey,
    })));
    dispatch(setState({ crud: false }))
    saveTreeData(getState().TemptreeData.treeData, totalHLength)
};

export const dndNode = (droppedNode) => async (dispatch, getState) => {
    try {
        const parentId = droppedNode.nextParentNode ? droppedNode.nextParentNode.id : null;

        const updatedTreeData = changeNodeAtPath({
            treeData: getState().TemptreeData.treeData,
            path: droppedNode.path,
            getNodeKey: getNodeKey,
            newNode: {
                parent: parentId,
                id: droppedNode.node.id,
                title: droppedNode.node.title,
                subtitle: droppedNode.node.subtitle,
                type: droppedNode.node.type,
                children: droppedNode.node.children || [],
            },
        });

        dispatch(setTreeData(updatedTreeData));
        await saveTreeData(updatedTreeData, getState().TemptreeData.totalHLength);
    } catch (error) {
        console.error('Error occurred while performing DND operation:', error);
        throw error;
    }
};
export const getNodeData = (nodeData) => (dispatch, getState) => {
    const { type, title, children } = nodeData;

};

export const onTreeChange = (newTreeData, dispatch) => {
    dispatch(setTreeData(newTreeData));
    dispatch(setState({
        nodeCount: getVisibleNodeCount({ treeData: newTreeData })
    }));
};


export const updateTreeData = (state) => (state.treeData.TemptreeData)
export const TemptreeDataSliceReducer = treeDataSlice.reducer;