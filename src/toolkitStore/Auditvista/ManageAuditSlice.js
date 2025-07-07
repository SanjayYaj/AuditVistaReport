import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "d3";
import urlSocket from "helpers/urlSocket";

const initialState = {
    publishTemplate: null,
    hierarchyData:[],
    apiRequestLoad : false,
    navItems :[
    { id: 1, label: 'Hierarchy Level', icon: 'bx bx-sitemap', minLevel: 0 },
    { id: 2, label: 'Audit / Review', icon: 'bx bxs-user', minLevel: 1 },
    { id: 3, label: 'Audit Schedule', icon: 'bx bx-cog', minLevel: 2 },
    // { id: 4, label: 'Report Schedule', icon: 'bx bx-cog', minLevel: 2 },
    { id: 6, label: 'Confirm & Publish', icon: 'bx bx-badge-check', minLevel: 4 },
  ],
  userList:[],
  reviewSchedule:[],
  tempInfo : null

}

const manageAuditSlice = createSlice({
    name: "manageAuditSlice",
    initialState: initialState,
    reducers: {
        setpublishTemplate: (state, action) => {
            state.publishTemplate = action.payload
        },
        setHierarchyData: (state, action) => {
            state.hierarchyData = action.payload
        },
        setNavItems:(state,action)=>{
            state.navItems = action.payload
        },
        setApiRequestLoad:(state,action)=>{
            state.apiRequestLoad = action.payload
        },
        setUserList:(state,action)=>{
            state.userList = action.payload
        },
        setReviewSchedule:(state,action)=>{
            state.reviewSchedule = action.payload
        },
        setTempInfo:(state,action)=>{
            state.tempInfo = action.payload
        }
    }
})


export const updateAuditEpsApi = (epdata, audit_data) => {

    return async dispatch => {
        try {
              dispatch(setApiRequestLoad(true))
            const authUser = JSON.parse(sessionStorage.getItem("authUser"));
            const responseData = await urlSocket.post("webpbdadtdta/updateauditendpoints", {
                 encrypted_db_url: authUser.db_info.encrypted_db_url,
                    userInfo: authUser.user_data,
                    endpointInfo: epdata,
                    auditInfo: audit_data
            })
              dispatch(setApiRequestLoad(false))
              return responseData

        } catch (error) {
            console.log(error,'error')
        }
    }

}





export const retriveTempAuditInfo = (publishTemplate) => {

    return async dispatch => {

        try {
            dispatch(setApiRequestLoad(true))
            const authUser = JSON.parse(sessionStorage.getItem("authUser"));
            const responseData = await urlSocket.post('webphlbconf/retrive-audit-info', {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                ref_id: publishTemplate._id
            })
            dispatch(setApiRequestLoad(false))
            console.log(responseData,'responseData')
            if (responseData.status === 200) {
                dispatch(setTempInfo(responseData.data.data))
            }


        } catch (error) {
            dispatch(setApiRequestLoad(false))

        }

    }

}





export const revertAuditDataApi = (backupRefId, reason, auditInfo) => {
  return async dispatch => {
    try {
      dispatch(setApiRequestLoad(true))
      const authUser = JSON.parse(sessionStorage.getItem("authUser"));
      
      const requestData = {
        encrypted_db_url: authUser.db_info.encrypted_db_url,
        userInfo: authUser.user_data,
        revertInfo: {
          backup_ref_id: backupRefId,
          reason: reason
        },
        auditInfo: auditInfo
      };

      console.log('Reverting audit data from backup:', requestData);

      const responseData = await urlSocket.post("webpbdadtdta/revertauditdata", requestData);
      
      dispatch(setApiRequestLoad(false))
      
      if (responseData.status === 200) {
        console.log('Audit data reverted successfully:', responseData.data);
        return {
          status: 200,
          data: responseData.data,
          message: "Audit data reverted successfully"
        };
      } else {
        throw new Error(responseData.data?.message || 'Failed to revert audit data');
      }

    } catch (error) {
      dispatch(setApiRequestLoad(false))
      console.error('Error reverting audit data:', error);
      
      return {
        status: 500,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to revert audit data'
      };
    }
  }
}

// 2. List Available Backups API
export const listBackupsApi = (endpointId) => {
    console.log('endpointId', endpointId)
  return async dispatch => {
    try {
      dispatch(setApiRequestLoad(true))
      const authUser = JSON.parse(sessionStorage.getItem("authUser"));
      
      const requestData = {
        encrypted_db_url: authUser.db_info.encrypted_db_url,
        userInfo: authUser.user_data,
        endpointInfo: {
          _id: endpointId
        }
      };

      const responseData = await urlSocket.post("webpbdadtdta/listbackups", requestData);
      console.log('responseData>>132', responseData)
      
      dispatch(setApiRequestLoad(false))
      
      if (responseData.status === 200) {
        return {
          status: 200,
          data: responseData.data,
          message: "Backups retrieved successfully"
        };
      } else {
        throw new Error(responseData.data?.message || 'Failed to retrieve backups');
      }

    } catch (error) {
      dispatch(setApiRequestLoad(false))
      console.error('Error retrieving backups:', error);
      
      return {
        status: 500,
        data: null,
        message: error.message || 'Failed to retrieve backups'
      };
    }
  }
}



export const updateEndpointApi = (epdata,publishedAuditData) => {

    return async dispatch => {
        try {
              dispatch(setApiRequestLoad(true))
            const authUser = JSON.parse(sessionStorage.getItem("authUser"));
              const responseData = await urlSocket.post("webpbdadtdta/ainendpoints", {
                  encrypted_db_url: authUser.db_info.encrypted_db_url,
                  userInfo: authUser.user_data,
                  endpointInfo: epdata,
                  auditInfo: publishedAuditData

              })
              dispatch(setApiRequestLoad(false))
              return responseData
        } catch (error) {
            console.log(error,'error')

        }clearAuditDataApi
    }
}

export const clearAuditDataApi = (endpointInfo, auditInfo, reason) => {
  return async dispatch => {
    try {
      dispatch(setApiRequestLoad(true))
      const authUser = JSON.parse(sessionStorage.getItem("authUser"));
      
      const requestData = {
        encrypted_db_url: authUser.db_info.encrypted_db_url,
        userInfo: authUser.user_data,
        endpointInfo: {
          _id: endpointInfo._id,
          reason: reason,
          loc_name: endpointInfo.loc_name,
          loc_ref_id: endpointInfo.loc_ref_id
        },
        auditInfo: auditInfo
      };

      console.log('Clearing audit data for:', requestData);

      const responseData = await urlSocket.post("webpbdadtdta/clearauditdata", requestData);
      
      dispatch(setApiRequestLoad(false))
      
      if (responseData.status === 200) {
        console.log('Audit data cleared successfully:', responseData.data);
        return {
          status: 200,
          data: responseData.data,
          message: "Audit data cleared successfully"
        };
      } else {
        throw new Error(responseData.data?.message || 'Failed to clear audit data');
      }

    } catch (error) {
      dispatch(setApiRequestLoad(false))
      console.error('Error clearing audit data:', error);
      
      return {
        status: 500,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to clear audit data'
      };
    }
  }
}




export const retriveTemplateList = (publishTemplate) => {
    console.log(publishTemplate,'publishTemplate')
    return async dispatch => {
        try {
            dispatch(setApiRequestLoad(true))
            const authUser = JSON.parse(sessionStorage.getItem("authUser"));
            const responseData = await urlSocket.post("webphlbconf/gettemplate", {
                userInfo: {
                    encrypted_db_url: authUser.db_info.encrypted_db_url,
                    created_by: authUser.user_data._id,
                    company_id: authUser.user_data.company_id,
                },
                publishtemplateInfo: publishTemplate
            })
            dispatch(setApiRequestLoad(false))
            console.log(responseData,'responseData')
            return responseData

        } catch (error) {
            console.log(error,'error')
        }
    }
}


export const retriveLocationList=async(h_id,user_id)=>{

    try {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        const responseData = await urlSocket.post("webphlbconf/retrive-user-locations",{
            h_id : h_id,
            userIds:user_id,
            encrypted_db_url : authUser.db_info.encrypted_db_url
        })
        console.log(responseData,'responseData')
        if(responseData.status === 200){
            return responseData.data.data
        }
        
    } catch (error) {
            console.log(error,'error')
    }


}

export const updateAuditAPI=(auditInfo)=>{

    return async dispatch =>{

        try {
            dispatch(setApiRequestLoad(true))
            const authUser = JSON.parse(sessionStorage.getItem("authUser"));
            const responseData = await urlSocket.post("webmngpbhtmplt/updatePublishedAuditEps",{
                encrypted_db_url : authUser.db_info.encrypted_db_url,
                audit_id :auditInfo._id,
                status :auditInfo.schedule_status === "0" ? "1" :"0",
                schedule_status :auditInfo.schedule_status
            })
            dispatch(setApiRequestLoad(false))
            return responseData
        } catch (error) {
            console.log(error,'error')
            
        }
    }



}



export const retriveHierarchyUsers = (hierarchyDataInfo) => {

    return async dispatch => {

        try {
            const authUser = JSON.parse(sessionStorage.getItem("authUser"));
            const responseData = await urlSocket.post("webphlbconf/retrive-hierarchy-users",{
                encrypted_db_url : authUser.db_info.encrypted_db_url,
                h_id : hierarchyDataInfo.hlvl_master_id,
                _id : hierarchyDataInfo._id
            })
            console.log(responseData,'responseData')
            if(responseData.status === 200){
                dispatch(setUserList(responseData.data.data))
            }

        } catch (error) {
            console.log(error,'error')
        }

    }

}





export const levelDataList = (hierarchyDataInfo, publishTemplateInfo) => {

    return async dispatch => {
        try {
            console.log(hierarchyDataInfo, publishTemplateInfo,'hierarchyDataInfo, publishTemplateInfo')
            dispatch(setApiRequestLoad(true))
            const authUser = JSON.parse(sessionStorage.getItem("authUser"));
            const responseData = await urlSocket.post("webphlbconf/getlocationlevels", {
                userInfo: {
                    created_by: authUser.user_data._id,
                    encrypted_db_url: authUser.db_info.encrypted_db_url
                },
                hInfo: {
                    h_id: hierarchyDataInfo ? hierarchyDataInfo.hlvl_master_id : hierarchyData.hlvl_master_id,
                    publishtemplateInfo: publishTemplateInfo ? publishTemplateInfo : publishTemplate
                }
            })
            dispatch(setApiRequestLoad(false))
            console.log(responseData, 'responseData')
            return responseData
        } catch (error) {
            console.log(error, 'error')

        }
    }
}

export const findConfigUser = (config) => {
    return async (dispatch) => {
        try {
            const authUser = JSON.parse(sessionStorage.getItem("authUser"));

            const responseData = await urlSocket.post("webphlbconf/retrive-href-location", {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                ref_id: config._id,
            });

            return responseData.data.data[0];
        } catch (error) {
            console.error("Error in findConfigUser:", error);
            return null;
        }
    };
};

export const updateSelecteduser = (config, dynamicValue,dynamicKey) => {


    return async (dispatch) => {
        try {
            const authUser = JSON.parse(sessionStorage.getItem("authUser"));

            const responseData = await urlSocket.post("webphlbconf/updateUsrSelected", {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                ref_id: config._id,
                value: dynamicValue,
                key:dynamicKey
            });

            return responseData.data.data; 
        } catch (error) {
            console.error("Error in updateSelecteduser:", error);
            return null;
        }
    };
};


export const retriveHlevelMethod =(authUser,publishTemplate)=>{

    return async dispatch =>{

        try {
            dispatch(setApiRequestLoad(true))
            const responseData = await urlSocket.post("webphlbconf/gethlmethod", {
                userInfo: {
                    encrypted_db_url: authUser.db_info.encrypted_db_url,
                    created_by: authUser.user_data._id,
                    company_id: authUser.user_data.company_id,
                },
                publishtemplateInfo: publishTemplate

            })
            dispatch(setApiRequestLoad(false))
            console.log(responseData,'responsee')
            return responseData

        } catch (error) {
            console.log(error,'error')
        }
    }
}


export const updateHierarchyData = (hlevelData) => {

    return async dispatch => {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        try {
            dispatch(setApiRequestLoad(true))
            const responseData = await urlSocket.post('webphlbconf/update-href-data', {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                hlevelData,
            })
            dispatch(setApiRequestLoad(false))
            return responseData

        } catch (error) {
            console.log(error,'error')
        }

    }
}

export const auditReportApi = (publishedAuditData) => {

    return async dispatch => {
    const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        try {
            dispatch(setApiRequestLoad(true))   
            const responseData = await urlSocket.post("webpbdadtdta/getauditreport",{
                userInfo: {
                    _id: authUser.user_data._id,
                    encrypted_db_url: authUser.db_info.encrypted_db_url,
                },
                auditInfo: publishedAuditData
            })
            dispatch(setApiRequestLoad(false))
            return  responseData


        } catch (error) {
            console.log(error,'error')
        }
    }

}


export const updatepublishedTempData = (publishTemplateInfo) => {

    return async dispatch => {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        try {
            dispatch(setApiRequestLoad(true))
            const responseData = await urlSocket.post("webphlbconf/updatepublishtemplate", {
                userInfo: {
                    encrypted_db_url: authUser.db_info.encrypted_db_url,
                    created_by: authUser.user_data._id,
                },
                hInfo: {
                    publishtemplateInfo: publishTemplateInfo
                }
            })
            dispatch(setApiRequestLoad(false))
            if (responseData.status === 200) {
                dispatch(setpublishTemplate(responseData.data.data))
            }
            return responseData

        } catch (error) {
            console.log(error, 'error')
        }
    }
}


export const updateEndpointsData = (endpointsId,mode,reviewEnable,publishTemplateInfo,statusInfo) => {

    return async (dispatch,getState) => {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        const hierarchyData = getState().manageAuditSlice.hierarchyData
        try {
            dispatch(setApiRequestLoad(true))
            const responseData = await urlSocket.post("webphlbconf/auto-mate-endpoint-users",{
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                flat_ids: endpointsId,
                selected_level: hierarchyData.eplevel_value,
                ref_id: hierarchyData.ref_id,
                mode,
                reviewEnable,
                statusInfo,
                publishTemplateInfo
            })
            dispatch(setApiRequestLoad(false))
            return responseData

        } catch (error) {
            console.log(error,'error')
        }

    }
}



export const getLocationList = (endpointInfo, type) => {

    return async (dispatch,getState) => {

        try {
            const authUser = JSON.parse(sessionStorage.getItem("authUser"))
            const hierarchyData = getState().manageAuditSlice.hierarchyData
            dispatch(setApiRequestLoad(true))
            const responseData = await urlSocket.post("webphlbconf/getlocations", {
                userInfo: {
                    created_by: authUser.user_data._id,
                    encrypted_db_url: authUser.db_info.encrypted_db_url
                },
                hInfo: {
                    h_id: hierarchyData.hlvl_master_id,
                    hlevelinfo: type ? "full_data" : endpointInfo,
                    publishtemplateInfo: getState().manageAuditSlice.publishTemplate
                }
            })
            dispatch(setApiRequestLoad(false))
            return responseData
            
        } catch (error) {
            console.log(error,'error')
            
        }

    }
}

export const clearMasterAuditData = (publishTemplateInfo) => {

    return async (dispatch,getState) => {

        try {
            dispatch(setApiRequestLoad(true))
            const authUser = JSON.parse(sessionStorage.getItem("authUser"))
            const responseData = await urlSocket.post("webphlbconf/clear-masteraudit-data", {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                ref_id: getState().manageAuditSlice.publishTemplate._id,
                publishTemplateInfo
            })
            dispatch(setApiRequestLoad(false))
            console.log(responseData,'responseData');
            return responseData
        } catch (error) {
            console.log(error, 'error')
        }


    }


}


export const updatePublishedAuditEps = (epsList,audit_type) => {

    return async dispatch => {

        try {
            dispatch(setApiRequestLoad(true))
            const authUser = JSON.parse(sessionStorage.getItem("authUser"))
            const responseData = await urlSocket.post("webpbdadtdta/updateepsUsers",{
                epsList,
                audit_type,
                encrypted_db_url : authUser.db_info.encrypted_db_url
            })
            console.log(responseData,'responseData')
            if(responseData.status === 200){
                return responseData
            }
        } catch (error) {

        }



    }


}


export const retriveAuditInfo=()=>{

    return async dispatch =>{

        try {
             dispatch(setApiRequestLoad(true))
            const authUser = JSON.parse(sessionStorage.getItem("authUser"))
            const auditInfo = JSON.parse(sessionStorage.getItem("publishedAuditData"))
            const responseData = await urlSocket.post("webpbdadtdta/getpublishedauditdata", {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                auditInfo: auditInfo,
                configData: authUser.config_data,
                userInfo: authUser.user_data,
            })
            console.log(responseData,'responseData')
            if(responseData.status === 200){
                return responseData.data
            }

            
        } catch (error) {
            
        }



    }



}


export const toolMasterApiList=()=>{

    return async dispatch =>{

        try {
            dispatch(setApiRequestLoad(true))
            const authUser = JSON.parse(sessionStorage.getItem("authUser"))

            const responseData = await urlSocket.post("webphlbconf/retrive-client-tool-list",{
                encrypted_db_url : authUser.db_info.encrypted_db_url
            })
            dispatch(setApiRequestLoad(false))
            if(responseData.status === 200){
                return responseData
            }
            else{
                return false
            }
            
        } catch (error) {
            console.log(error, 'error')
        }


    }
}





export const {
    setpublishTemplate,
    setHierarchyData,
    setNavItems,
    setApiRequestLoad,
    setUserList,
    setReviewSchedule,
    setTempInfo
} = manageAuditSlice.actions
export default manageAuditSlice.reducer