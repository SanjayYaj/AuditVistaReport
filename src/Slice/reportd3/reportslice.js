import { createSlice } from "@reduxjs/toolkit"; // Jose Anna Code
import urlSocket from "../../helpers/urlSocket";
import { v4 as uuidv4 } from 'uuid';
import store from '../../store'
import Swal from "sweetalert2";

const initialState = {
    reportTemplateList: [],
    reportRequestLoading: false,
    reportRequestError: false,
    openModal: false,
    selectedReportTemplateInfo: null,
    totalReportTemplates: 0,
    totalListCount: 0,
    resetValues: null,
    pageInfo: {
        pageIndex: 0,
        pageSize: 10
    },
    reportUsers: [],
    selectedReportUser: [],
    userReports: [],
    reportTemplateTree: [],
    pageNodeInfo: JSON.parse(sessionStorage.getItem("pageNodeInfo")),
    reportTreeData: [],
    layoutInfo: [],
    layoutId: '',
    hierarchyList: [],
    hierarchyTree: [],
    filterXaxisValue: [],
    slicerValues: [],
    saveData: true,
    sortedData: [],
    linesorted: [],
    horstack: [],
    vertilinesorted: [],
    areasorted: [],
    horbarsorted: [],
    verticalbarsorted: [],
    name: "",
    breakPoints: {},
    globalFilterValues: [],
    selectedFilterList: [],
    selectedCollectionData: [],
    downloadStatus: false,
    resetCharts: [],
    zoomInStatus: [],
    zoomOutStatus: [],
    data_Sorted: [],
    rangeStatus: [],
    processingData: {},
    tempLayout: [],
    updatedSliceData: [],
    queryFilter: [],
    filterValue: [],
    noLayoutdata: false,
    startDate: '',
    endDate: '',
    selectedsortredux: [],
    selectedValues :[]
};


const reportSlice = createSlice({
    name: "reportSlice",
    initialState,
    // initialState: {
    //     reportTemplateList: [],
    //     reportRequestLoading: false,
    //     reportRequestError: false,
    //     openModal: false,
    //     selectedReportTemplateInfo: null,
    //     totalReportTemplates: 0,
    //     totalListCount: 0,
    //     resetValues: null,
    //     pageInfo: {
    //         pageIndex: 0,
    //         pageSize: 10
    //     },
    //     reportUsers: [],
    //     selectedReportUser: [],
    //     userReports: [],
    //     reportTemplateTree: [],
    //     pageNodeInfo: JSON.parse(sessionStorage.getItem("pageNodeInfo")),
    //     reportTreeData: [],
    //     layoutInfo: [],
    //     layoutId: '',
    //     hierarchyList: [],
    //     hierarchyTree: [],
    //     filterXaxisValue: [],
    //     slicerValues: [],
    //     saveData: true,
    //     //sort state
    //     sortedData: [],
    //     linesorted: [],
    //     horstack: [],
    //     vertilinesorted: [],
    //     areasorted: [],
    //     horbarsorted: [],
    //     verticalbarsorted: [],
    //     name: "",
    //     breakPoints: {},
    //     globalFilterValues: [],
    //     selectedFilterList: [],
    //     selectedCollectionData: [],
    //     downloadStatus: false,
    //     resetCharts: [],
    //     zoomInStatus: [],
    //     zoomOutStatus: [],
    //     data_Sorted: [],
    //     rangeStatus: [],
    //     processingData: {},
    //     tempLayout:[],


    //     updatedSliceData: [],
    //     queryFilter: [],
    //     filterValue: [],
    //     noLayoutdata: undefined,
    //     startDate: '',
    //     endDate: ''


    // },
    reducers: {
        resetState: (state) => {
            return { ...initialState };
        },
        setReportChartLoading  : (state,action)=>{
            state.reportChartsLoading  = action.payload
        },
        settempLayout: (state, action) => {
            console.log(action.payload,'action.payload')
            state.tempLayout = action.payload;
        },
      
        toggleProcessingState: (state, action) => {
            const id = action.payload;
            console.log('iiiiiiiiiiiiiiiiii :>> ', id);
            if (id === undefined) {
                // If no ID is provided, reset all processingData entries to undefined
                Object.keys(state.processingData).forEach(key => {
                    state.processingData[key] = undefined;
                });
            }
            else if( state.processingData[id]  === true ){
                state.processingData[id] = undefined
            }
            else {
                // If ID exists, toggle the specific entry
                console.log("State before toggle:", state, action, state.processingData[id]);
                state.processingData[id] = !state.processingData[id] || true;
            }
        },
        setResetValues: (state, action) => {
            state.resetValues = action.payload;
        },
        setRangeStatus: (state, action) => {
            const { value, ID, fieldName } = action.payload;
            if (value === 'deleteAll') {
                state.rangeStatus = [];
            }

            else if (value === 'reset') {
                state.rangeStatus = {
                    ...state.rangeStatus,
                    [ID]: {
                        cornerRadius: { value: 0, id: ID },
                        innerRadius: { value: 0, id: ID },
                        padAngle: { value: 0, id: ID },
                        ChartSize: { value: 320, id: ID },
                    },
                };
            } else if (value === 'delete') {
                const rangeStatusCopy = { ...state.rangeStatus };
                delete rangeStatusCopy[ID];
                state.rangeStatus = rangeStatusCopy;
            } else {
                state.rangeStatus = {
                    ...state.rangeStatus,
                    [ID]: {
                        ...state.rangeStatus[ID],
                        [fieldName]: { value: Number(value), id: ID },
                    },
                };
            }
        },


        setdata_Sorted: (state, action) => {
            state.data_Sorted = action.payload
        },
        setZoomInStatus: (state, action) => {
            state.zoomInStatus = action.payload
        },
        setZoomOutStatus: (state, action) => {
            state.zoomOutStatus = action.payload
        },
        setResetCharts: (state, action) => {
            state.resetCharts = action.payload
        },

        setReportTemplate: (state, action) => {
            state.reportTemplateList = action.payload
        },
        setReportRequestLoading: (state, action) => {
            state.reportRequestLoading = action.payload
        },
        setReportRequestError: (state, action) => {
            state.reportRequestError = action.payload
        },
        setSaveData: (state, action) => {
            state.saveData = action.payload
        },
        setopenModal: (state, action) => {
            state.openModal = action.payload
        },
        setSelectedReportInfo: (state, action) => {
            state.selectedReportTemplateInfo = action.payload
        },
        setTotalReportItems: (state, action) => {
            state.totalReportTemplates = action.payload
        },
        setPageInfo: (state, action) => {
            state.pageInfo = action.payload
        },
        setReportUser: (state, action) => {
            state.reportUsers = action.payload
        },
        setSelectedReportUser: (state, action) => {
            state.selectedReportUser = action.payload
        },
        setUserReport: (state, action) => {
            state.userReports = action.payload
        },
        setReportTemplateTree: (state, action) => {
            state.reportTemplateTree = action.payload
        },
        setReportTreeNodeInfo: (state, action) => {
            state.pageNodeInfo = action.payload
        },
        setreportTreeData: (state, action) => {
            state.reportTreeData = action.payload
        },
        updateLayoutInfo: (state, action) => {
            if (action.payload.index === undefined) {
                console.log("1000000000000000000");
                state.layoutInfo = action.payload;
            } else {
                const { index, updatedObject } = action.payload;
                state.layoutInfo = state.layoutInfo.map((item, i) =>
                    i === index ? { ...item, ...updatedObject } : item
                );
                console.log("Updated layoutInfo Slicers:", state.layoutInfo);
            }
        },

        setHierarchyData: (state, action) => {
            state.hierarchyList = action.payload
        },
        setHierarchTree: (state, action) => {
            state.hierarchyTree = action.payload
        },
        setGlobalFilter: (state, action) => {
            state.globalFilterValues = action.payload
        },
        setselectedFilterList: (state, action) => {
            state.selectedFilterList = action.payload
        },
        setXaxisFilterValue: (state, action) => {
            state.filterXaxisValue = action.payload
        },
        setSlicerValues: (state, action) => {
            state.slicerValues = action.payload
        },
        setSelectedCollectionData: (state, action) => {
            state.selectedCollectionData = action.payload
        },

        // setSelectedSortredux: (state, action) => {
        //     state.selectedsortredux = action.payload
        // },

        setSelectedSortredux: (state, action) => {
            const { chart_id, key } = action.payload;
            state.selectedsortredux = {
                ...state.selectedsortredux, // Preserve existing data
                [chart_id]: key // Store key for the corresponding chart_id
            };
        },


        setSelectedValuesRedux: (state, action) => {
            const { chart_id, key } = action.payload;
            state.selectedValues = {
                ...state.selectedValues, // Preserve existing data
                [chart_id]: key // Store key for the corresponding chart_id
            };
        },

        


        textBlock: (state, action) => {
            const indx = action.payload;
            let newHeader;
            if (indx === '1') {
                newHeader = { i: uuidv4(), x: 0, y: 0, w: 12, h: 1, type: 'text', value: 'Header 1', fontsize: '24px', isResizable: false };
            } else if (indx === '2') {
                newHeader = { i: uuidv4(), x: 0, y: 0, w: 12, h: 0.8, type: 'text', value: 'Header 2', fontsize: '20px', isResizable: false };
            } else if (indx === '3') {
                newHeader = { i: uuidv4(), x: 0, y: 0, w: 12, h: 0.7, type: 'text', value: 'Header 3', fontsize: '18px', isResizable: false };
            } else {
                newHeader = { i: uuidv4(), x: 0, y: 0, w: 12, h: 0.5, type: 'text', value: 'Header 4', fontsize: '14px', isResizable: false };
            }
            const totalHeaderHeight = newHeader.h;
            const updatedLayout = state.layoutInfo.map(item => ({ ...item, y: item.y + totalHeaderHeight }));
            const newLayout = [newHeader, ...updatedLayout];
            state.layoutInfo = newLayout;

        },
        setLayoutId: (state, action) => {
            state.layoutId = action.payload
        },
        setBreakpoints: (state, action) => {
            state.breakPoints = action.payload
        },


        sortLine: (state, action) => {
            const { chart_id, sortedData } = action.payload;

            state[chart_id] = sortedData;
        },

        sortHorstack: (state, action) => {

            const { chart_id, sortedData } = action.payload;
            state[chart_id] = sortedData;
        },
        sortVerticalline: (state, action) => {
            const { chart_id, sortedData } = action.payload;
            state[chart_id] = sortedData;
        },
        sortArea: (state, action) => {
            const { chart_id, sortedData } = action.payload;
            state[chart_id] = sortedData;
        },
        sortBar: (state, action) => {
            const { chart_id, sortedData } = action.payload;
            state[chart_id] = sortedData;
        },




        sortFunc: (state, action) => {
            const { data, arrValues, chart_id } = action.payload;
            console.log('Sort data :>> ', data , chart_id);
            if( data.length < 0 ){
                state[chart_id] = {
                  
                    linesorted: [], 
                    horbarsorted : [] ,
                    sortedData: [],
                    horstack: [],
                    vertilinesorted: [],
                    areasorted: [],
                    barsorted: []
                };

            }
            else{
                const sortedData = [...data].sort((a, b) => {
                    for (const value of arrValues) {
                        if (a[value] !== b[value]) {
                            return a[value] - b[value];
                        }
                    }
                    return 0;
                });
                console.log('sortedData :>> ', sortedData);
                state[chart_id] = { ...state[chart_id], linesorted: sortedData, sortedData, horstack: sortedData, vertilinesorted: sortedData, areasorted: sortedData, barsorted: sortedData };
            }
           
            
        },

        sortDescending: (state, action) => {
            const { data, arrValues, chart_id } = action.payload;
            console.log('data, arrValues, chart_id', data, arrValues, chart_id)
            const sortedData = [...data].sort((a, b) => {
                for (const value of arrValues) {
                    if (a[value] !== b[value]) {
                        return b[value] - a[value];
                    }
                }
                return 0;
            });


            if (!state[chart_id]) {
                state[chart_id] = {};
            }

            state[chart_id] = { ...state[chart_id], linesorted: sortedData, sortedData, horstack: sortedData, vertilinesorted: sortedData, areasorted: sortedData, barsorted: sortedData, };

        },


        sortInfo: (state, action) => {
            const { data, chart_id } = action.payload;
            state[chart_id] = data;
        },

        barSorting: (state, action) => {
            const { data, chart_id } = action.payload;

            const sortedData = [...data].sort((a, b) => a.value - b.value);
            console.log('sortedData  barSorting:>> ', sortedData);
            state[chart_id] = { ...state[chart_id], horbarsorted: sortedData, verticalbarsorted: sortedData };
        },

        barDescending: (state, action) => {
            const { data, chart_id } = action.payload;
            const sortedData = [...data].sort((a, b) => b.value - a.value);
            console.log('sortedData Descending  :>> ', sortedData);
            state[chart_id] = { ...state[chart_id], horbarsorted: sortedData, verticalbarsorted: sortedData };
        },


        verticalBar: (state, action) => {
            const { chartData, ID } = action.payload;
            state[ID] = chartData;
        },
        setDownloadStatus: (state, action) => {
            state.downloadStatus = action.payload
        },
       
        setqueryFilter: (state, action) => {
            // console.log(action.payload,'action')
            state.queryFilter = action.payload
        },


        setQueryResult: (state, action) => {
            // console.log(action.payload,'action')
            state.queryResult = action.payload
        },


        setfilterValue: (state, action) => {
            // console.log(action.payload,'action')
            state.filterValue = action.payload
        },

        setupdatedSliceData: (state, action) => {
            // console.log(action.payload,'action')
            state.updatedSliceData = action.payload
        },
            setNoLayoutdata: (state, action) => {
            // console.log(action.payload,'action.payload')
            state.noLayoutdata = action.payload;
        },
        FilterStartDate: (state, action) => {
            // console.log(action.payload,'action.payload')
            state.startDate = action.payload;
        },
        FilterEndtDate: (state, action) => {
            // console.log(action.payload,'action.payload')
            state.endDate = action.payload;
        },

        removeReportData: (state, action) => {
            const id = action.payload;
            if (state[id]) {
              delete state[id]; // Removing the dynamic ID from the state
            }
          },
    }
    

})



export const DescendingSort = (ID, arrValues, chartData) => {
    return async (dispatch) => {
        try {
            const sortedDataArr = [...chartData].sort((a, b) => {
                for (const value of arrValues) {
                    if (a[value] !== b[value]) {
                        return a[value] - b[value];
                    }
                }
                return 0;
            });

            dispatch(setdata_Sorted(sortedDataArr));

            return sortedDataArr;
        } catch (error) {
            console.error('Error during sorting:', error);
        }
    };
};



export const createLayout = (val , authInfo) => {

    return async (dispatch, getState) => {
        const state = getState().reportSliceReducer;
        // console.log(state,'state')
        const pageNodeInfo = JSON.parse(sessionStorage.getItem("pageNodeInfo"))
        console.log('createLayout', pageNodeInfo, val)
        const layout = [...state.layoutInfo];
        const uniqueArr = _.uniqBy(layout, "y");
        const totalHeight = uniqueArr.reduce((acc, item) => acc + item.h, 0);
        const newY = totalHeight;
        // console.log(pageNodeInfo?.selected_cln_name?.[0],'pageNodeInfo.selected_cln_name[0]')
        var lay1
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        const pageInfo = JSON.parse(sessionStorage.getItem('page_data'))


        // console.log('store.getState()?.auth?.db_info :>> ', store.getState()?.auth);
        const requestInfo = {
            dbInfo:  authInfo?.db_info,
            layoutId: state.layoutId,
            pageInfo: pageInfo,
            userInfo:  authInfo?.user_data
 
        }

        if (val === '1') {
            console.log('pageNodeInfo?.selected_cln_name[0]', pageNodeInfo?.selected_cln_name, pageNodeInfo)
            lay1 = [
                ...layout,
                {
                    i: uuidv4(), x: 0, y: newY, w: 12, h: 3, minH: 2, minW: 5,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                },

            ];
        } else if (val === '2') {
            lay1 = [
                ...layout,
                {
                    i: uuidv4(), x: 0, y: newY, w: 6, h: 3, minH: 2, minW: 5,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                },
                {
                    i: uuidv4(), x: 6, y: newY, w: 6, h: 3, minH: 2, minW: 5,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                }
            ];
        } else if (val === '3') {
            lay1 = [
                ...layout,
                {
                    i: uuidv4(), x: 0, y: newY, w: 4, h: 3, minH: 2, minW: 2,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                },
                {
                    i: uuidv4(), x: 4, y: newY, w: 4, h: 3, minH: 2, minW: 2,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                },
                {
                    i: uuidv4(), x: 8, y: newY, w: 4, h: 3, minH: 2, minW: 2,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                }
            ];
        } else if (val === '4') {
            lay1 = [
                ...layout,
                {
                    i: uuidv4(), x: 0, y: newY, w: 3, h: 2, minH: 2, minW: 1.5,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                },
                {
                    i: uuidv4(), x: 3, y: newY, w: 3, h: 2, minH: 2, minW: 1.5,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                },
                {
                    i: uuidv4(), x: 6, y: newY, w: 3, h: 2, minH: 2, minW: 1.5,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                },
                {
                    i: uuidv4(), x: 9, y: newY, w: 3, h: 2, minH: 2, minW: 1.5,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                }
            ];
        } else if (val === '5') {
            lay1 = [
                ...layout,
                {
                    i: uuidv4(), x: 0, y: newY, w: 3, h: 1, minH: 2, minW: 1.5,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                },
                {
                    i: uuidv4(), x: 3, y: newY, w: 3, h: 1, minH: 2, minW: 1.5,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                },
                {
                    i: uuidv4(), x: 6, y: newY, w: 2, h: 1, minH: 2, minW: 1.5,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                },
                {
                    i: uuidv4(), x: 8, y: newY, w: 2, h: 1, minH: 2, minW: 1.5,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                },
                {
                    i: uuidv4(), x: 10, y: newY, w: 2, h: 1, minH: 2, minW: 1.5,
                    selected_cln_name: pageNodeInfo?.selected_cln_name
                }
            ];
        }
        dispatch(updateLayoutInfo(lay1))
        dispatch(updateLayoutData(lay1, requestInfo))
    }
}





//Dynamic DB Added
export const getReportTemplateList = (authInfo , DynDB ) => {
    return (dispatch) => {
        return new Promise(async (resolve, reject) => {
            try {
                const authUser = JSON.parse(sessionStorage.getItem("authUser"))
                console.log('authUser 634 :>> ', authUser , 'DynDB :>> ', DynDB);


                var DB_Info = authUser?.db_info

                const data = {
                    encrypted_db_url: DynDB.encrypted_db_url,
                    created_by: authUser.user_data._id,
                };

                const responseData = await urlSocket.post("report/find-report-page", data);
                console.log('responseData  getReportTemplateList :>> ', responseData);
                // Stop loading
                dispatch(setReportRequestLoading(false));
                if (responseData.status === 200) {
                    // Resolve with the data
                    resolve(responseData.data);
                } else {
                    // Dispatch error action and reject the promise
                    dispatch(setReportRequestError(true));
                    reject(new Error("Failed to fetch report templates"));
                }
            } catch (error) {
                dispatch(setReportRequestError(true));
                reject(error);
            }
        });
    };
};

//Dynamic DB Added
export const retrieveTemplateUsers = ( template_id  , dbInfo) => {
    return (dispatch) => {
        return new Promise(async (resolve, reject) => {
            try {
                const authUser = JSON.parse(sessionStorage.getItem("authUser"))
                console.log('authUser :>> ', authUser);

          
                const data = {
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    template_id: template_id,
                };

                const responseData = await urlSocket.post("report/find-template-users", data);
                console.log('responseData :>> ', responseData);
                // Stop loading
                dispatch(setReportRequestLoading(false));
                if (responseData.status === 200) {
                    // Resolve with the data
                    resolve(responseData.data);
                } else {
                    // Dispatch error action and reject the promise
                    dispatch(setReportRequestError(true));
                    reject(new Error("Failed to fetch report template users "));
                }
            } catch (error) {
                dispatch(setReportRequestError(true));
                reject(error);
            }
        });
    };
};




export const getUserTemplates = ( authUser , db_info ) => {
    return (dispatch) => {
        return new Promise(async (resolve, reject) => {
            try {
                
                console.log('db_info---->' , db_info , authUser)
                const data = {
                    encrypted_db_url: db_info.encrypted_db_url,
                    user_id: authUser.user_data._id,
                };
                console.log('data :>> ', data);
                const responseData = await urlSocket.post("report/get-user-report", data);
                console.log('responseData  fetchn user temp :>> ', responseData);
                resolve(responseData.data);
            } catch (error) {
                console.log('error :>> ', error);
                dispatch(setReportTemplate([]))
                
            }


        })
    }
}

export const crudReportPage = (values) => {
    return (dispatch) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('values for update', values);
                const responseData = await urlSocket.post("report/crud-report-page", values);
                if (responseData.status === 200) {
                    resolve(responseData.data);
                } else {
                    dispatch(setReportRequestError(true));
                    reject(new Error("Failed to process report page"));
                }
            } catch (error) {
                // Dispatch error action and reject the promise
                dispatch(setReportRequestError(true));
                reject(error);
            }
        });
    };
};

export const deleteReportpage = (values) => {
    return (dispatch) => {
        return new Promise(async (resolve, reject) => {
            try {
                var DB_Info = store.getState()?.auth?.db_info

                const data = {
                    encrypted_db_url: DB_Info.encrypted_db_url,
                    template_id : values
                };

                const responseData = await urlSocket.post("report/delete-rpt-layouts",data );
                console.log('responseData :>> ', responseData);
                if (responseData.status === 200) {
                    resolve(responseData);
                } else {
                    dispatch(setReportRequestError(true));
                    reject(new Error("Failed to process report page"));
                }
            } catch (error) {
                // Dispatch error action and reject the promise
                dispatch(setReportRequestError(true));
                reject(error);
            }
        });
    };
};




export const getUserList = (authuser, pageInfo) => {

    return async dispatch => {

        try {
            dispatch(setReportRequestLoading(true))
            const data = {
                userInfo: {
                    encrypted_db_url: authuser.db_info.encrypted_db_url,
                    created_by: authuser.user_data._id,
                    company_id: authuser.client_info[0].company_id,
                    template_id: pageInfo._id
                }
            }

            const responseData = await urlSocket.post('webphlbconf/get-all-users-report', data)
            dispatch(setReportRequestLoading(false))
            if (responseData.data.response_code === 500) {
                dispatch(setReportUser(responseData.data.data))
                dispatch(setSelectedReportUser(responseData.data.selected_user))
            }
            else {
                dispatch(setReportRequestError(true))
            }

        } catch (error) {
            dispatch(setReportRequestError(true))
        }
    }
}



export const publishSelectedUser = (selectedRowIds, pageInfo, authuser , dbInfo , navigate) => {

    return async dispatch => {

        try {

            console.log('authuser 813' , authuser);
            // dispatch(setReportRequestLoading(true))
            const data = {
                userList: selectedRowIds,
                template_id: pageInfo._id,
                template_name: pageInfo.name,
                published_by: authuser.user_data._id,
                published_on: new Date() ,
                publish_status : '1',
                encrypted_db_url:  authuser.db_info.encrypted_db_url ,//dbInfo.encrypted_db_url,
                status : "0"
            }
            console.log("data--->", data)
            const responseData = await urlSocket.post("report/publish-report-for-users", data)
            console.log('responseData :>> ', responseData);
            dispatch(setReportRequestLoading(false))
            if (responseData.status === 200) {
                navigate("/report")
            }
            else {
                dispatch(setReportRequestError(true))
            }

        } catch (error) {
            console.log('error :>> ', error);
            dispatch(setReportRequestError(true))
        }
    }
}




export const updateTemplateStatus = ( pageInfo , authUser , dbInfo , status ) => {

    return async dispatch => {

        try {
            console.log('pageInfo :>> ', pageInfo);
            const data = {
                template_id: pageInfo._id,
                template_name: pageInfo.name,
                published_by: authUser._id,
                publish_status : status,
                encrypted_db_url: dbInfo.encrypted_db_url
            }
            console.log(" updateTemplateStatus data--->", data)
            const responseData = await urlSocket.post("report/updt-template-status", data) 
            console.log('responseData :>> ', responseData);
            // dispatch(setReportRequestLoading(false))
            // if (responseData.status === 200) {
            //     navigate("/report")
            // }
            // else {
            //     dispatch(setReportRequestError(true))
            // }

        } catch (error) {
            console.log('error :>> ', error);
            dispatch(setReportRequestError(true))
        }
    }
}







export const getUserReport = (authUser) => {

    return async dispatch => {

        try {
            dispatch(setReportRequestLoading(true))
            const data = {
                user_id: authUser.user_data._id,
                encrypted_db_url: authUser.db_info.encrypted_db_url
            }

            const responseData = await urlSocket.post("report/get-user-report", data)
            dispatch(setReportRequestLoading(false))
            if (responseData.status === 200) {
                dispatch(setUserReport(responseData.data.data))
            }
            else {
                dispatch(setReportRequestError(true))
            }


        } catch (error) {
            dispatch(setReportRequestError(true))
        }
    }
}



export const getReportInfo = (authUser, pageInfo) => {

    return async dispatch => {

        try {
            dispatch(setReportRequestLoading(true))
            const data = {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                _id: pageInfo._id,
            }
            const responseData = await urlSocket.post("report/retrive-page-tree", data)
            dispatch(setReportRequestLoading(false))
            if (responseData.status === 200) {
                dispatch(setReportTemplateTree(responseData.data.data[0].tree_info))
            }
            else {
                dispatch(setReportRequestError(true))
            }


        } catch (error) {
            dispatch(setReportRequestError(true))
        }
    }
}


export const updateSliceFilter = ( filters ,db ) =>{
    return async dispatch => {
        try {
            dispatch(setReportRequestLoading(true))
            const nodeInfo = JSON.parse(sessionStorage.getItem("pageNodeInfo"))
            const templateInfo = JSON.parse(sessionStorage.getItem("page_data"))

            // console.log('db :>> ', db);
            const data = {
               
                encrypted_db_url: db.dbInfo.encrypted_db_url,
                page_id: db.pageInfo._id,
                page_name: db.pageInfo.name,
                created_by: db.userInfo._id,
                node_id: nodeInfo.id,
                _id: db.layoutId == "" || db.layoutId === undefined ? undefined : db.layoutId,
                template_id: templateInfo._id,
                template_name: templateInfo.name,
                node_type: nodeInfo.type ,
                filters :filters
            }
            // console.log('data  690:>> ', data);
            const responseData = await urlSocket.post("report/crud-report-layout", data)            
            dispatch(setReportRequestLoading(false))
            if (responseData.status === 200) {
                dispatch( setupdatedSliceData(responseData.data.data.filters))

            }
            else {
                dispatch(setReportRequestError(true))
            }

        } catch (error) {
            dispatch(setReportRequestError(true))
        }
    }
}







export const updateLayoutData = (layout, db) => {

    return async dispatch => {
        try {
            dispatch(setReportRequestLoading(true))
            const nodeInfo = JSON.parse(sessionStorage.getItem("pageNodeInfo"))
            const templateInfo = JSON.parse(sessionStorage.getItem("page_data"))


            console.log('layout  914:>> ', layout);



            // Store the original data fields with a map of item IDs to data
            const dataMap = layout.reduce((acc, item) => {
                acc[item.i] = item.data;
                return acc;
            }, {});



            // Store the original data fields with a map of item IDs to data
            const FiltdataMap = layout.reduce((acc, item) => {
                acc[item.i] = item.filtered_data;
                return acc;
            }, {});




            // Create a new layout without the 'data' field
            const sanitizedLayout = layout.map(item => {
                const { data, filtered_data, ...rest } = item; // Exclude 'data'
                return rest;
            });

            console.log('db :>> ', db);
            const data = {
                layout: sanitizedLayout,
                encrypted_db_url: db.dbInfo.encrypted_db_url,
                page_id: db.pageInfo._id,
                page_name: db.pageInfo.name,
                created_by: db.userInfo._id,
                node_id: nodeInfo.id,
                _id: db.layoutId == "" || db.layoutId === undefined ? undefined : db.layoutId,
                template_id: templateInfo._id,
                template_name: templateInfo.name,
                node_type: nodeInfo.type,
                // publish_status : templateInfo.publish_status === '1' && "3" 
                status: templateInfo.publish_status === '1' ? "3" : "0"

            }


            console.log('data 675 :>> ', data);
            const responseData = await urlSocket.post("report/crud-report-layout", data)
            console.log(responseData, 'responseData')
            dispatch(setReportRequestLoading(false))
            if (responseData.status === 200) {



                // Reattach the original 'data' field only if it exists in the map
                const updatedLayout = responseData.data.data.layout.map(item => {
                    if (dataMap[item.i]) {
                        return { ...item, data: dataMap[item.i], filtered_data: FiltdataMap[item.i] };
                    }
                    return item;
                });

                console.log('updatedLayout 703 :>> ', updatedLayout);

                dispatch(updateLayoutInfo(updatedLayout))
            }
            else {
                dispatch(setReportRequestError(true))
            }

        } catch (error) {
            console.log("error", error)
            dispatch(setReportRequestError(true))
        }
    }

}




export const renameKeys = (obj, newKeys) => {
    return Object.keys(obj).reduce((acc, key) => {
        acc[newKeys[key] || key] = obj[key];
        return acc;
    }, {});
};



export const convertToCSV = (data) => {
    if (!data || !data.length) return '';

    const keys = Object.keys(data[0]);
    const header = keys.join(',') + '\n';
    const rows = data.map(row => keys.map(k => `"${row[k] || ''}"`).join(',')).join('\n');

    return header + rows;
};


export const imgDownloadCsv = (value, datakeys_name, datakeys, data, chart_name) => {

    return async (dispatch) => {
        try {
            const newKeys = {
                label: datakeys_name,
                value: datakeys,
            };
            const renamedData = data.map(obj => renameKeys(obj, newKeys));
            let finalData;
            if (value === "0") {
                finalData = renamedData.map(({ _id, ...rest }) => rest);
            } else {
                finalData = renamedData.filter(item => item !== null);
            }
            const csv = convertToCSV(finalData);

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${chart_name}.csv`;
            a.click();

            URL.revokeObjectURL(url);

            dispatch({ type: 'SUCCESS' });

        } catch (error) {
            console.error('Download error:', error);
            dispatch({ type: 'ERROR' });
        }
    };
};


const getStyledSvg = (svgElement) => {
    const clonedSvg = svgElement.cloneNode(true);
    const styleSheets = Array.from(document.styleSheets)
        .map(sheet => {
            try {
                return Array.from(sheet.cssRules)
                    .map(rule => rule.cssText)
                    .join('\n');
            } catch (e) {
                console.warn('Access to stylesheet blocked:', sheet);
                return '';
            }
        })
        .join('\n');

    const style = document.createElement('style');
    style.textContent = styleSheets;
    clonedSvg.insertBefore(style, clonedSvg.firstChild);
    return clonedSvg;
};


export const imgDownloadSvg = (id, chart_name) => {

    return async (dispatch) => {
        try {

            const svgElement = document.getElementById(id);
            if (!svgElement) {
                console.error('SVG element not found');
                return;
            }
            const styledSvg = getStyledSvg(svgElement);
            const svgString = new XMLSerializer().serializeToString(styledSvg);

            const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${chart_name}.svg`;

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(downloadLink.href);

            dispatch({ type: 'SVG_DOWNLOAD_SUCCESS' });

        } catch (error) {
            console.error('Error downloading SVG:', error);
            dispatch({ type: 'SVG_DOWNLOAD_ERROR', error: error.message });
        }
    };
};






export const imgDownloadPng = (chartId, chartName) => {

    return () => {

        const svgElement = document.querySelector(`#my_dataviz${chartId} svg`);
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const { width, height } = svgElement.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        const img = new Image();

        img.onload = () => {
            context.drawImage(img, 0, 0);

            const link = document.createElement("a");
            link.download = `${chartName}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };

        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
    }

};


export const updateChartData = (chart_data, layoutId) => {

    return async dispatch => {

        try {
            dispatch(setReportRequestLoading(true))
            const authUser = JSON.parse(sessionStorage.getItem("authUser"))
            const templateInfo = JSON.parse(sessionStorage.getItem("page_data"))
            const nodeInfo = JSON.parse(sessionStorage.getItem("pageNodeInfo"))

            const data = {
                chart_data: chart_data,
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                layout_id: layoutId === "" ? undefined : layoutId,
                template_id: templateInfo._id,
                template_name: templateInfo.name,
                chart_name: chart_data.name,
                node_id: nodeInfo.id
            }

            const responseData = await urlSocket.post("report/updt-chart-data", data)
            dispatch(setReportRequestLoading(false))

        } catch (error) {
            dispatch(setReportRequestError(true))
        }
    }

}


export const retrivePieChartvalue = (data, layout, db_data) => {

    return async dispatch => {

        try {
            dispatch(setReportRequestLoading(true))
            var blockIdx = Number(sessionStorage.getItem("blockIdx"))
            const responseData = await urlSocket.post("report/retrive-pie-chart-value", data)
            console.log('responseData Pie chart loads :>> ', responseData);
            dispatch(setReportRequestLoading(false))
            if (responseData.status === 200) {
                // layout[blockIdx]["data"]= responseData.data.data[0].data

                // dispatch(updateLayoutInfo(layout)) 
                // dispatch(updateLayoutData(layout, db_data));
                return responseData.data.data[0].data
            }
            else {
                dispatch(setReportRequestError(true))
            }


        } catch (error) {
            dispatch(setReportRequestError(true))
        }

    }
}


export const retriveCardChartValue = (data, layout, selectedCalc, db_data , updatedData) => {


    return async dispatch => {

        try {
            console.log('updatedData :>> ', updatedData);
            dispatch(setReportRequestLoading(true))
            var blockIdx = Number(sessionStorage.getItem("blockIdx"))
            console.log('data  1083:>> ', data);
            const responseData = await urlSocket.post("report/retrive-card-chart-value", data)


            console.log('responseData 1258 :>> ', responseData);
            dispatch(setReportRequestLoading(false))
            if (responseData.status === 200) {
                // layout[blockIdx].data = responseData.data.data[0].data
                // layout[blockIdx].sum = responseData.data.data[0].sum
                // layout[blockIdx].avg = responseData.data.data[0].avg
                // layout[blockIdx].min = responseData.data.data[0].min
                // layout[blockIdx].max = responseData.data.data[0].max

                // layout[blockIdx].median = responseData.data.data[0].median


                // layout[blockIdx].stdDeviation = responseData.data.data[0].stdDeviation


                // layout[blockIdx].variance = responseData.data.data[0].variance
                // layout[blockIdx].total_count = responseData.data.data[0].total_count

                layout[blockIdx].prefrd_calc = updatedData.prefrd_calc
                // layout[blockIdx].selected_cln_name = responseData.data.data[0].selected_cln_name
                // layout[blockIdx].selected_primary_value = responseData.data.data[0].selected_primary_value
                // layout[blockIdx].selected_primary_key = responseData.data.data[0].selected_primary_key
                layout[blockIdx].text = updatedData.text
                layout[blockIdx].x_axis_key =   updatedData.x_axis_key
                // if (selectedCalc.name === "SUM") {
                //     layout[blockIdx].count = responseData.data.data[0].sum
                // }
                // else if (selectedCalc.name === "AVG") {
                //     layout[blockIdx].count = responseData.data.data[0].avg
                // }
                // else if (selectedCalc.name === "MIN") {
                //     layout[blockIdx].count = responseData.data.data[0].minimum
                // }
                // else if (selectedCalc.name === "MAX") {
                //     layout[blockIdx].count = responseData.data.data[0].maximum
                // }
                // else {
                //     layout[blockIdx].count = responseData.data.data[0].total_count
                // }
                dispatch(updateLayoutInfo(layout));
                dispatch(updateLayoutData(layout, db_data));
            }
            else {
                dispatch(setReportRequestError(true))
            }
        }
        catch (error) {
            dispatch(setReportRequestError(true))
        }
    }
}


export const retriveClnKeys = (value , authInfo ) => {

    return async dispatch => {

        try {
            console.log('value1350 :>> ', value);
            dispatch(setReportRequestLoading(true))
            const authUser = JSON.parse(sessionStorage.getItem("authUser"))
            var DB_Info = authInfo?.db_info
            console.log(DB_Info);


            const data = {
                collection_name: value,
                encrypted_db_url: DB_Info.encrypted_db_url ,
                db_name: DB_Info.db_name,
            }
            const responseData = await urlSocket.post("report/retrive-cln-keys", data)
            dispatch(setReportRequestLoading(false))
            return responseData

        } catch (error) {
            dispatch(setReportRequestError(true))
        }
    }
}


export const retriveClnPrimaryValue = (data ) => {

    return async dispatch => {

        try {
              // Abort the previous request if it exists
              if (controller) {
                controller.abort();
            }

            // Create a new AbortController
            controller = new AbortController();
            const signal = controller.signal;


            dispatch(setReportRequestLoading(true))
            const authUser = JSON.parse(sessionStorage.getItem("authUser"))
            console.log('retriveClnPrimaryValue - data  - Store :>> ', data );
            
            const responseData = await urlSocket.post("report/retrive-cln-primary-value", data )
            dispatch(setReportRequestLoading(false))
            console.log('responseData  1191:>> ', responseData);
            return responseData

        } catch (error) {
            console.log('error :>> ', error);
            dispatch(setReportRequestError(true))
        }
    }
}


export const hierarchyList = () => {

    return async dispatch => {

        const authUser = JSON.parse(sessionStorage.getItem("authUser"))

        const data = {
            userInfo: {
                created_by: authUser.user_data._id,
                company_id: authUser.user_data.company_id,
                encrypted_db_url: authUser.db_info.encrypted_db_url
            }
        }

        try {
            dispatch(setReportRequestLoading(true))
            const responseData = await urlSocket.post("webhstre/gethslist", data)
            dispatch(setReportRequestLoading(false))
            if (responseData.status === 200) {
                dispatch(setHierarchyData(responseData.data.data))
            }
            else {
                dispatch(setReportRequestError(true))
            }


        }
        catch (error) {

        }
    }
}

export const getHierarchyInfo = (hInfo) => {

    return async dispatch => {

        try {
            dispatch(setReportRequestLoading(true))
            const authUser = JSON.parse(sessionStorage.getItem("authUser"))
            const data = {
                info: {
                    _id: hInfo._id,
                    company_id: hInfo.company_id,
                    encrypted_db_url: authUser.db_info.encrypted_db_url
                }
            }

            const responseData = await urlSocket.post("webhstre/gethstructure", data)
            dispatch(setReportRequestLoading(false))
            if (responseData.status === 200) {
                if (responseData.data.data.hstructure.length > 0) {
                    dispatch(setHierarchTree([responseData.data.data.hstructure[0]]))

                }
            }


        } catch (error) {

        }

    }

}



export const selectGlobalXaxis = (selectedList) => {

    return async dispatch => {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        const nodeInfo = JSON.parse(sessionStorage.getItem("pageNodeInfo"))
        const templateInfo = JSON.parse(sessionStorage.getItem("page_data"))

        try {
            dispatch(setReportRequestLoading(true))
            const data = {
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                template_id: templateInfo._id,
                created_by: templateInfo.created_by,
                node_id: nodeInfo.id,
                selected_x_axis: _.map(selectedList, '_id')
            }
            dispatch(setselectedFilterList(selectedList))
            const responseData = await urlSocket.post('report/global-chart-layout-data', data)
            dispatch(setReportRequestLoading(false))
            if (responseData.status === 200) {
                dispatch(updateLayoutInfo(responseData.data.data))
                dispatch(setGlobalFilter(responseData.data.filter_keys))
            }
            else {
                dispatch(setReportRequestError(true))
            }


        } catch (error) {
            dispatch(setReportRequestError(true))
        }
    }
}



export const retreivedataQuery = (combinedQueryFilter, authInfo , uniqueNames) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const nodeInfo = JSON.parse(sessionStorage.getItem("pageNodeInfo"))
            const data = {
                encrypted_db_url: authInfo.db_info.encrypted_db_url,
                db_name: authInfo.db_info.db_name,
                query: combinedQueryFilter,
                collection_name: nodeInfo.selected_cln_name[0],
                uniqueNames
            }
            const responseData = await urlSocket.post('report/retreive-query-result', data)
            console.log('responseData :>> ', responseData);
            await dispatch(setSelectedCollectionData(responseData.data))
            resolve(responseData.data);
        } catch (err) {
            reject(err);
        }
    });
};




// export const retrivePageLayout = (start, end, filterEnabled) => {

//     return async dispatch => {

//         try {
//             console.log('start , end  :>> ', start, end);
//             console.log("Called List", store.getState()?.auth)
//             var Auth =store.getState()?.auth
//             var DB_Info = store.getState()?.auth?.db_info
//             dispatch(setReportRequestLoading(true))
//             const authUser = JSON.parse(sessionStorage.getItem("authUser"))
//             const nodeInfo = JSON.parse(sessionStorage.getItem("pageNodeInfo"))
//             const templateInfo = JSON.parse(sessionStorage.getItem("page_data"))
//             console.log('nodeInfo', nodeInfo)

//             const data = {
//                 encrypted_db_url: DB_Info.encrypted_db_url,
//                 db_name: DB_Info.db_name,
//                 template_id: templateInfo._id,
//                 created_by: templateInfo.created_by,
//                 node_id: nodeInfo.id,
//                 collection_name: nodeInfo.selected_cln_name?.cln_name,
//                 start, end ,
//                 dateFields: Auth?.dateRangeField

//             }

//             console.log(' request data :>> ', data);
//             const responseData = await urlSocket.post("report/find-page-layout", data)
//             console.log(responseData, 'responseData retrivePageLayout')
//             dispatch(setReportRequestLoading(false))
//             dispatch(setReportChartLoading(false))

//             if (filterEnabled) {
//                 if (responseData.status === 200 && responseData.data.data.length > 0) {
//                     dispatch(setupdatedSliceData(responseData.data.data[0]?.filters === undefined ? [] : responseData.data.data[0]?.filters))
//                     console.log('responseData.data.data[0]?.filters :>> ', responseData.data.data[0]?.filters);
//                 }
//             }
//             else {
//                 if (responseData.status === 200 && responseData.data.data.length > 0) {
//                     dispatch(updateLayoutInfo(responseData.data.data[0]?.layout === undefined ? [] : responseData.data.data[0]?.layout))
//                     dispatch(setLayoutId(responseData.data.data[0]._id === undefined ? "" : responseData.data.data[0]._id))
//                     dispatch(setupdatedSliceData(responseData.data.data[0]?.filters === undefined ? [] : responseData.data.data[0]?.filters))
//                     console.log(responseData.data.xAxisValues, 'responseData.data.xAxisValues')
//                     console.log('responseData.data.data[0]?.filters :>> ', responseData.data.data[0]?.filters);
//                     let dynamic_data = responseData.data.dynamic_data
//                     console.log(dynamic_data, 'dynamic_data')
//                     dispatch(setSelectedCollectionData(dynamic_data))

//                     if (responseData.data.data[0]?.layout) {
//                         console.log("data Founded");
//                         dispatch(setNoLayoutdata(false))
//                     }
//                     //  dispatch(setGlobalFilter(responseData.data.xAxisValues))
//                 }
//                 else {
//                     console.log("No data founded");
//                     dispatch(setNoLayoutdata(true))
//                     dispatch(setReportRequestError(true))
//                     dispatch(setReportChartLoading(true))
//                 }
//             }
//         } catch (error) {
//             console.log(error, 'error')
//             dispatch(setReportRequestError(true))
//         }
//     }
// }

let controller = null; // Store globally to track ongoing requests

export const retrivePageLayout = ( authInfo ,start, end, filterEnabled  , User) => {
  return async (dispatch) => {
    return new Promise(async (resolve, reject) => {


    try {



        console.log('start , end  :>> ', start, end );
        console.log("Called List", authInfo);
      
        var DB_Info = authInfo?.db_info;
  
        dispatch(setReportRequestLoading(true));
        
        // const authUser = JSON.parse(sessionStorage.getItem("authUser"));
        const nodeInfo = JSON.parse(sessionStorage.getItem("pageNodeInfo"));
        console.log('nodeInfo 1629:>> ', nodeInfo);
        const templateInfo = JSON.parse(sessionStorage.getItem("page_data"));
        // console.log('authUser 15781 :>> ', authUser);
       var  authUser={ role:  !User ? 'User' : 'admin'}; 
        const data = {
          encrypted_db_url: DB_Info.encrypted_db_url,
          db_name: DB_Info.db_name,
          template_id: templateInfo._id,
          created_by: templateInfo.created_by,
          node_id: nodeInfo.id,
          collection_name: nodeInfo.selected_cln_name[0],
          start, end,
        //   dateFields: Auth?.dateRangeField,
          authUser,
         
        };
  
        console.log('Request Data :>> ', data , User);


        var responseData 

            if( !User ){
                 responseData = await urlSocket.post("report/find-User-page-layout", data );
                console.log(responseData, 'responseData retrive user PageLayout');
            }
            else{
                 responseData = await urlSocket.post("report/find-page-layout", data );
                console.log(responseData, 'responseData retrivePageLayout');
            }

    //   const responseData = await urlSocket.post("report/find-page-layout", data );
    //   console.log(responseData, 'responseData retrivePageLayout');
      dispatch(setReportRequestLoading(false));
      dispatch(setReportChartLoading(false));

      if (filterEnabled) {
        if (responseData.status === 200 && responseData.data.data.length > 0) {
          dispatch(setupdatedSliceData(responseData.data.data[0]?.filters ?? []));
        }
      } else {
        if (responseData.status === 200 && responseData.data.data.length > 0) {
          dispatch(updateLayoutInfo(responseData.data.data[0]?.layout ?? []));
          dispatch(setLayoutId(responseData.data.data[0]._id ?? ""));
          dispatch(setupdatedSliceData(responseData.data.data[0]?.filters ?? []));
          dispatch(setSelectedCollectionData(responseData.data.dynamic_data));

          if (responseData.data.data[0]?.layout?.length > 0) {
            console.log("Data Found");
            dispatch(setNoLayoutdata(false));
          }
          else{
            dispatch(setNoLayoutdata(true));
          }
        } else {
          console.log("No Data Found");
          dispatch(setNoLayoutdata(true));
          dispatch(setReportRequestError(true));
          dispatch(setReportChartLoading(true));
        }


        resolve( responseData.data )
      }
     }
    //  catch (error) {
    //   if (error.name === "AbortError") {
    //     console.log("API request aborted due to navigation");
    //   } else {
    //     console.log(error, 'error');
    //     dispatch(setReportRequestError(true));
    //   }
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
                      window.location.href =  !User?  "/user_report" : "/report"; // Redirect after user clicks OK
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

    })

  };
};








// /retreive-slicers
export const retriveSlicerLayout = (start, end, filterEnabled) => {
    return async (dispatch) => {
        try {
            // Abort the previous request if it exists
            if (controller) {
                controller.abort();
            }

            // Create a new AbortController
            controller = new AbortController();
            const signal = controller.signal;

            console.log('start , end  :>> ', start, end);
            console.log("Called List", store.getState()?.auth);
            var Auth = store.getState()?.auth;
            var DB_Info = store.getState()?.auth?.db_info;

            const authUser = JSON.parse(sessionStorage.getItem("authUser"));
            const nodeInfo = JSON.parse(sessionStorage.getItem("pageNodeInfo"));
            const templateInfo = JSON.parse(sessionStorage.getItem("page_data"));

            const data = {
                encrypted_db_url: DB_Info.encrypted_db_url,
                db_name: DB_Info.db_name,
                template_id: templateInfo._id,
                created_by: templateInfo.created_by,
                node_id: nodeInfo.id,
                collection_name: nodeInfo.selected_cln_name?.cln_name,
                start, end,
                dateFields: Auth?.dateRangeField
            };

            console.log('Request Data :>> ', data);

            const responseData = await urlSocket.post("report/retreive-slicers", data, { signal });

            console.log(responseData, 'responseData retriveSlicers-Layout');

            if (filterEnabled) {
                if (responseData.status === 200 && responseData.data.data.length > 0) {
                    dispatch(setupdatedSliceData(responseData.data.data[0]?.filters ?? []));
                }
            } else {
                if (responseData.status === 200 && responseData.data.data.length > 0) {
                    dispatch(setupdatedSliceData(responseData.data.data[0]?.filters ?? []));
                    if (responseData.data.data[0]?.layout) {
                        console.log("Data Found");
                    }
                } else {
                    console.log("No Data Found");
                  
                }
            }
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("API request aborted due to navigation");
            } else {
                console.log(error, 'error');
            }
        }
    };
};




export const {
    setReportRequestLoading,
    setReportTemplate,
    setReportRequestError,
    setopenModal,
    setSelectedReportInfo,
    setTotalReportItems,
    setTotalListCount,
    setPageInfo,
    setReportUser,
    setSelectedReportUser,
    setUserReport,
    setReportTemplateTree,
    setReportTreeNodeInfo,
    setreportTreeData,
    updateLayoutInfo,
    textBlock, toggleProcessingState, settempLayout,
    setBreakpoints, setDownloadStatus, setResetCharts, setZoomInStatus, setZoomOutStatus, setdata_Sorted, setRangeStatus,
    sortInfo, sortFunc, sortLine, sortDescending, sortHorstack, sortVerticalline, sortArea, areasorted, horbarsorted, sortBar, barSorting, barDescending, verticalBar, verticalbarsorted,
    setHierarchyData,
    setGlobalFilter,
    setHierarchTree,
    setLayoutId,
    setselectedFilterList,
    setXaxisFilterValue,
    setSlicerValues,
    setSaveData, setReportChartLoading, 
    setSelectedCollectionData,
    setupdatedSliceData,
    setqueryFilter,
    setNoLayoutdata,
    FilterStartDate,
    FilterEndtDate,
    setfilterValue,
    setResetValues,
    removeReportData, setSelectedSortredux , setSelectedValuesRedux
    

} = reportSlice.actions




export const { resetState } = reportSlice.actions;

export default reportSlice.reducer;