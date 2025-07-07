import { createSlice } from "@reduxjs/toolkit";
// import { put, post, get, del } from "helpers/api_helper";
import urlSocket from "../helpers/urlSocket";
import { debounce } from "lodash";




const initialState = {
    aplnRequestLoading: false,
    aplnRequestError: null,
    userList: [],
    roleList: [],
    // userMailIdExist : false,
    userMailIdExist: false,
    userNumExist: false,
    branchData: [],
    deptData: [],
    incdType: [],
    editUserInfo: null,
    HData: []

}

// const authUser = JSON.parse(sessionStorage.getItem("authUser"))


const ReportUserSlice = createSlice({
    name: "ReportUserSlice",
    initialState: initialState,
    reducers: {
        setAplnRequestLoading: (state, action) => {
            state.aplnRequestLoading = action.payload
        },
        setAplnRequestError: (state, action) => {
            state.aplnRequestError = action.payload
        },
        setUserList: (state, action) => {
            state.userList = action.payload
        },
        setRoleList: (state, action) => {
            state.roleList = action.payload
        },
        setUserMailIdExist: (state, action) => {
            state.userMailIdExist = action.payload
        },
        setUserNumExist: (state, action) => {
            state.userNumExist = action.payload
        },
        setBranchData: (state, action) => {
            state.branchData = action.payload
        },
        setHData: (state, action) => {
            state.HData = action.payload
        },
        setDeptData: (state, action) => {
            state.deptData = action.payload
        },
        setIncdType: (state, action) => {
            state.incdType = action.payload
        },
        setEditUserInfo: (state, action) => {
            console.log(action.payload, 'action')
            state.editUserInfo = action.payload
        }
    }
})






export const retrieveUserListAPI = (data) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data, 'data retrieveUserListAPI')
            urlSocket.post('cog/get-user-info', data).then((res) => {
                if (res.data.response_code === 500) {
                    console.log('res.data.user_list', res)
                    dispatch(setUserList(res.data.userList))
                    resolve(res.data)
                }
            });
        } catch (error) {
            console.error(error);
            reject(error)
        }
    })
}




export const retriveUserList = () => {
    return async dispatch => {
        var authUser = JSON.parse(sessionStorage.getItem("authUser"))
        try {
            dispatch(setAplnRequestLoading(true))
            const responseData = await urlSocket.post("ir-user/retrive-user-list", { created_by: authUser.user_data._id, encrypted_db_url: authUser.db_info.encrypted_db_url })
            dispatch(setAplnRequestLoading(false))
            console.log(responseData, 'responseData');
            if (responseData.status === 200) {
                dispatch(setUserList(responseData.data.data))
                dispatch(setRoleList(responseData.data.roles))
            }
            else {
                dispatch(setAplnRequestError(responseData.data.message))
            }

        } catch (error) {
            dispatch(setAplnRequestError(error))
        }
    }
}

export const validateExistValue = (editInfo, dynamic_cln, dynamic_key, dynamic_value, dynamicReducer) => {
    // console.log('validateExistValue', dynamic_key)
    return async (dispatch) => {
        try {
            dispatch(setAplnRequestLoading(true));
            const authUser = JSON.parse(sessionStorage.getItem("authUser"));
            const responseData = await urlSocket.post('authentication/dup-name-validation',
                {
                    // encrypted_db_url: authUser.db_info.encrypted_db_url,
                    // db_name: authUser.db_info.db_name,
                    dynamic_cln: dynamic_cln,
                    dynamic_key: dynamic_key,
                    editInfo: editInfo,
                    dynamic_value: dynamic_value
                }
            )
            dispatch(setAplnRequestLoading(false))
            // console.log(responseData, 'responseData')
            if (responseData.status === 200) {
                dispatch(dynamicReducer(responseData.data.data.length > 0 ? true : false))
            }



        } catch (error) {
            dispatch(setAplnRequestLoading(false));
            console.error(error, "error");
        }
    };
};


export const validateRequired = () => {
    return async dispatch => {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        try {
            dispatch(setAplnRequestLoading(true))
            const responseData = await urlSocket.post("ir-user/validate-required-user-creation", {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
            })
            console.log(responseData, 'responseData')
            dispatch(setAplnRequestLoading(false))
            if (responseData.status === 200) {
                return responseData
            }
            dispatch(setAplnRequestLoading(false))

        } catch (error) {
            dispatch(setAplnRequestError(error))

        }
    }
}



export const retriveUserInfo = (user_id) => {
    return async dispatch => {
        try {
            dispatch(setAplnRequestLoading(true))
            const responseData = await urlSocket.post("user-info/get-selected-user", { _id: user_id })
            console.log('responseData', responseData)
            if (responseData.status === 200 && responseData.data.user_info.length > 0) {
                dispatch(setEditUserInfo(responseData.data.user_info[0]))
                return responseData.data.user_info[0]
                // dispatch(setRoleList(responseData.data.data))
            }
            else {
                // dispatch(setAplnRequestError(responseData.data.message))
            }


        } catch (error) {
            console.log(error, 'error');
            dispatch(setAplnRequestError(error))

        }

    }
}



export const retriveRoleData = () => {
    return async dispatch => {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        try {
            dispatch(setAplnRequestLoading(true))
            const responseData = await urlSocket.post("cog/retrive-roles", {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
            })
            console.log(responseData, 'encrypted_db_url')
            if (responseData.status === 200) {
                dispatch(setRoleList(responseData.data.data))
                dispatch(setDeptData(responseData.data.deptInfo))
                dispatch(setHData(responseData.data.hInfo))
            }
            else {
                dispatch(setAplnRequestError(responseData.data.message))
            }
        } catch (error) {
            dispatch(setAplnRequestError(error))

        }
    }
}




export const createUserInfo = (values, history) => {
    console.log(values, 'values');
    return async dispatch => {
        try {
            const responseData = await urlSocket.post("authentication/cruduser", { user_info: values });
            console.log(responseData, 'responseDatauser');
            await dispatch(setEditUserInfo(null));
            sessionStorage.removeItem("userId");

            // Handle success response
            if (responseData.status === 200) {
                console.log("User creation successful");
                return responseData.data
            } else {
                console.error("Server error:", responseData.data.message);
                dispatch(setAplnRequestError(responseData.data.message));
            }
        } catch (error) {
            console.error('Error creating user:', error);
            dispatch(setAplnRequestError(error.message || "An error occurred"));
        } finally {
            // Optionally reset loading state (uncomment if required)
            // dispatch(setAplnRequestLoading(false));
        }
    };
};


export const deleteUserInfo = (data) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await urlSocket.post('user-info/delete-selected-user', {
                user_id: data._id,
                email: data.email_id,
                userInfo: data,
            });
            console.log('response', response)
            if (response.status === 200) {
                // dispatch(setUserList(response.data.data))
                resolve(response.data)
            }
        } catch (error) {
            reject(error)
        }
    })
};


export const userStatus = (data) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await urlSocket.post('user-info/user-status', {
                user_id: data._id,
                userInfo: data,
            });
            console.log('Response from userStatus:', response);

            if (response.status === 200) {
                resolve(response.data);
            } else {
                reject(new Error("Failed to update user status"));
            }
        } catch (error) {
            console.error("Error in userStatus:", error.message);
            reject(error);
        }
    });
};


export const userNewPassword = (data) => async (dispatch) => {

    return new Promise(async (resolve, reject) => {
        try {
            console.log('data', data)
            const response = await urlSocket.post('authentication/reset-client-user-pwd', {
                data
                // user_id: data._id,
                // userInfo: data,
            });
            console.log('Response from userStatus:', response);

            if (response.status === 200) {
                resolve(response.data);
            } else {
                reject(new Error("Failed to update user status"));
            }
        } catch (error) {
            console.error("Error in userStatus:", error.message);
            reject(error);
        }
    });
};








// export const createUserInfo =(values,history)=>{
//     console.log(values,'values');
//     return async dispatch =>{
//     const authUser = JSON.parse(sessionStorage.getItem("authUser"))
//         try {
//             // dispatch(setAplnRequestLoading(true))

//             const responseData = await urlSocket.post("incentive/cruduser", { user_info : values })
//             console.log(responseData,'encrypted_db_url')
//             await dispatch(setEditUserInfo(null))
//             sessionStorage.removeItem("userId");
//             if(responseData.status === 200){

//             }
//             else{
//                 dispatch(setAplnRequestError(responseData.data.message))
//             }


//         } catch (error) {
//             console.log(error,'error');
//             dispatch(setAplnRequestError(error))

//         }
//     }

// }



export const {
    setAplnRequestError,
    setAplnRequestLoading,
    setUserList,
    setRoleList,
    setUserMailIdExist,
    setBranchData,
    setDeptData,
    setIncdType,
    setHData,
    setEditUserInfo,
    setUserNumExist
} = ReportUserSlice.actions

export default ReportUserSlice.reducer


// commented on 17 Jan 25 
// import { createSlice } from "@reduxjs/toolkit";
// // import { put, post, get, del } from "helpers/api_helper";
// import urlSocket from "../helpers/urlSocket";
// import { debounce } from "lodash";




// const initialState={
//     aplnRequestLoading: false,
//     aplnRequestError: null,
//     userList:[],
//     roleList:[],
//     // userMailIdExist : false,
//     userMailIdExist : false,
//     userNumExist : false,
//     branchData: [],
//     deptData: [],
//     incdType:[],
//     editUserInfo : null,
//     HData :[]

// }

// // const authUser = JSON.parse(sessionStorage.getItem("authUser"))











// const ReportUserSlice= createSlice({
//     name: "ReportUserSlice",
//     initialState: initialState,
//     reducers: {
//         setAplnRequestLoading: (state, action) => {
//             state.aplnRequestLoading = action.payload
//         },
//         setAplnRequestError: (state, action) => {
//             state.aplnRequestError = action.payload
//         },
//         setUserList: (state, action) => {
//             state.userList = action.payload
//         },
//         setRoleList: (state, action) => {
//             state.roleList = action.payload
//         },
//         setUserMailIdExist: (state, action) => {
//             state.userMailIdExist = action.payload
//         },
//         setUserNumExist: (state, action) => {
//             state.userNumExist = action.payload
//         },
//         setBranchData: (state, action) => {
//             state.branchData = action.payload
//         },
//         setHData: (state, action) => {
//             state.HData = action.payload
//         },
//         setDeptData: (state, action) => {
//             state.deptData = action.payload
//         },
//         setIncdType: (state, action) => {
//             state.incdType = action.payload
//         },
//         setEditUserInfo:(state,action)=>{
//             console.log(action.payload,'action')
//             state.editUserInfo = action.payload
//         }
//     }
// })






// export const retrieveUserListAPI = (data) => async (dispatch) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await urlSocket.post('incentive/get-user-list');
//             console.log('response', response)
//             if (response.status === 200) {
//                 dispatch(setUserList(response.data.data))
//                 resolve(response.data)
//             }
//         } catch (error) {
//             reject(error)
//         }
//     })
// }




// export const retriveUserList = () => {
//     return async dispatch => {
//         var authUser = JSON.parse(sessionStorage.getItem("authUser"))
//         try {
//             dispatch(setAplnRequestLoading(true))
//             const responseData = await urlSocket.post("ir-user/retrive-user-list", { created_by: authUser.user_data._id, encrypted_db_url: authUser.db_info.encrypted_db_url })
//             dispatch(setAplnRequestLoading(false))
//             console.log(responseData, 'responseData');
//             if (responseData.status === 200) {
//                 dispatch(setUserList(responseData.data.data))
//                 dispatch(setRoleList(responseData.data.roles))
//             }
//             else {
//                 dispatch(setAplnRequestError(responseData.data.message))
//             }

//         } catch (error) {
//             dispatch(setAplnRequestError(error))
//         }
//     }
// }

// export const validateExistValue = (editInfo, dynamic_cln, dynamic_key, dynamic_value, dynamicReducer) => {
//     // console.log('validateExistValue', dynamic_key)
//     return async (dispatch) => {
//         try {
//             dispatch(setAplnRequestLoading(true));
//             const authUser = JSON.parse(sessionStorage.getItem("authUser"));
//             const responseData = await urlSocket.post('incentive/dup-name-validation',
//                 {
//                     // encrypted_db_url: authUser.db_info.encrypted_db_url,
//                     // db_name: authUser.db_info.db_name,
//                     dynamic_cln: dynamic_cln,
//                     dynamic_key: dynamic_key,
//                     editInfo: editInfo,
//                     dynamic_value: dynamic_value
//                 }
//             )
//             dispatch(setAplnRequestLoading(false))
//             // console.log(responseData, 'responseData')
//             if (responseData.status === 200) {
//                 dispatch(dynamicReducer(responseData.data.data.length > 0 ? true : false))
//             }



//         } catch (error) {
//             dispatch(setAplnRequestLoading(false));
//             console.error(error, "error");
//         }
//     };
// };


// export const validateRequired=()=>{
//     return async dispatch =>{
//         const authUser = JSON.parse(sessionStorage.getItem("authUser"))
//         try {
//             dispatch(setAplnRequestLoading(true))
//             const responseData = await urlSocket.post("ir-user/validate-required-user-creation", {
//                 encrypted_db_url: authUser.db_info.encrypted_db_url,
//             })
//             console.log(responseData,'responseData')
//             dispatch(setAplnRequestLoading(false))
//             if(responseData.status === 200){
//                 return responseData
//             }
//             dispatch(setAplnRequestLoading(false))
            
//         } catch (error) {
//             dispatch(setAplnRequestError(error))
            
//         }
//     }
// }



// export const retriveUserInfo =(user_id)=>{
//     return async dispatch =>{
//         try {
//             dispatch(setAplnRequestLoading(true))
//             const responseData = await urlSocket.post("incentive/get-selected-user", { _id: user_id })
//             console.log('responseData', responseData)
//             if(responseData.status === 200 && responseData.data.user_info.length >0){
//                 dispatch(setEditUserInfo(responseData.data.user_info[0]))
//                 return responseData.data.user_info[0]
//                 // dispatch(setRoleList(responseData.data.data))
//             }
//             else{
//                 // dispatch(setAplnRequestError(responseData.data.message))
//             }

            
//         } catch (error) {
//             console.log(error,'error');
//             dispatch(setAplnRequestError(error))

//         }

//     }
// }



// export const retriveRoleData =()=>{
//     return async dispatch =>{
//     const authUser = JSON.parse(sessionStorage.getItem("authUser"))
//         try {
//             dispatch(setAplnRequestLoading(true))
//             const responseData = await urlSocket.post("cog/retrive-roles", {
//                 encrypted_db_url: authUser.db_info.encrypted_db_url,
//             })
//             console.log(responseData,'encrypted_db_url')
//             if(responseData.status === 200){
//                 dispatch(setRoleList(responseData.data.data))
//                 dispatch(setDeptData(responseData.data.deptInfo))
//                 dispatch(setHData(responseData.data.hInfo))
//             }
//             else{
//                 dispatch(setAplnRequestError(responseData.data.message))
//             }            
//         } catch (error) {
//             dispatch(setAplnRequestError(error))
            
//         }
//     }
// }




// export const createUserInfo = (values, history) => {
//     console.log(values, 'values');
//     return async dispatch =>{        
//         try {
//             const responseData = await urlSocket.post("incentive/cruduser", { user_info: values });
//             console.log(responseData, 'responseData');            
//             await dispatch(setEditUserInfo(null));
//             sessionStorage.removeItem("userId");

//             // Handle success response
//             if (responseData.status === 200) {
//                 console.log("User creation successful");
//                 return responseData.data
//             } else {
//                 console.error("Server error:", responseData.data.message);
//                 dispatch(setAplnRequestError(responseData.data.message));
//             }
//         } catch (error) {
//             console.error('Error creating user:', error);
//             dispatch(setAplnRequestError(error.message || "An error occurred"));
//         } finally {
//             // Optionally reset loading state (uncomment if required)
//             // dispatch(setAplnRequestLoading(false));
//         }
//     };
// };


// export const deleteUserInfo = (data) => async (dispatch) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await urlSocket.post('incentive/delete-selected-user', {
//                 user_id: data._id,
//                 email: data.email_id,
//                 userInfo: data,
//             });
//             console.log('response', response)
//             if (response.status === 200) {
//                 // dispatch(setUserList(response.data.data))
//                 resolve(response.data)
//             }
//         } catch (error) {
//             reject(error)
//         }
//     })



//     // if (result.isConfirmed) {
//     //     urlSocket.post('cog/delete-user', {
//     //       encrypted_db_url: this.state.db_info.encrypted_db_url,
//     //       user_id: data._id,
//     //       email: data.email_id,
//     //       userInfo: data,
//     //       client_info: this.state.userInfo.client_info[0]

//     //     }).then((response) => {
//     //       console.log(response, 'response')
//     //       if (response.data.response_code === 500) {
//     //         Swal.fire({
//     //           icon: 'success',
//     //           title: 'Success!',
//     //           text: `User deleted Successfully`,
//     //           confirmButtonColor: '#3085d6',
//     //           confirmButtonText: 'OK'
//     //         }).then((result) => {
//     //           if (result.isConfirmed) {
//     //             this.setState({
//     //               selectedEOPT :[]
//     //             },()=>{
//     //             this.getUserList()
                  
//     //             })
//     //           }
//     //         })
//     //       }
//     //     })
//     //   }



// }







// // export const createUserInfo =(values,history)=>{
// //     console.log(values,'values');
// //     return async dispatch =>{
// //     const authUser = JSON.parse(sessionStorage.getItem("authUser"))
// //         try {
// //             // dispatch(setAplnRequestLoading(true))

// //             const responseData = await urlSocket.post("incentive/cruduser", { user_info : values })
// //             console.log(responseData,'encrypted_db_url')
// //             await dispatch(setEditUserInfo(null))
// //             sessionStorage.removeItem("userId");
// //             if(responseData.status === 200){
                
// //             }
// //             else{
// //                 dispatch(setAplnRequestError(responseData.data.message))
// //             }

            
// //         } catch (error) {
// //             console.log(error,'error');
// //             dispatch(setAplnRequestError(error))
            
// //         }
// //     }

// // }



// export const {
//     setAplnRequestError,
//     setAplnRequestLoading,
//     setUserList,
//     setRoleList,
//     setUserMailIdExist,
//     setBranchData,
//     setDeptData,
//     setIncdType,
//     setHData,
//     setEditUserInfo,
//     setUserNumExist
// } = ReportUserSlice.actions

// export default ReportUserSlice.reducer
