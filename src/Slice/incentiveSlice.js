import { createSlice } from '@reduxjs/toolkit';
import urlSocket from '../helpers/urlSocket';

const incentiveSlice = createSlice({
    name: 'incentiveSliceInfo',
    initialState: {
        incentiveList: [],
        incentivePrvw: [],
        incentiveEditData: null,
        progressCount: 0,
        incTypeNameList: [],
        orderTypes: [],
        mealType: [],
        apiLoading: false,
        outletList: [],
        captainList: [],
        waiterList: [],
        employeesList: [],
        waiterMapping: [],
        sameCaptainAndWaiter: [],
        empIDExist: false,

    },
    reducers: {
        setIncentiveList: (state, action) => {
            state.incentiveList = action.payload;
        },
        setApiLoading: (state, action) => {
            state.apiLoading = action.payload
        },
        setIncentivePrvw: (state, action) => {
            state.incentivePrvw = action.payload;
        },
        setIncentiveEditData: (state, action) => {
            state.incentiveEditData = action.payload;
        },
        setProgressCount: (state, action) => {
            state.progressCount = action.payload;
        },
        setIncTypeNameList: (state, action) => {
            state.incTypeNameList = action.payload;
        },
        setOrderTypes: (state, action) => {
            state.orderTypes = action.payload;
        },
        setMealType: (state, action) => {
            state.mealType = action.payload;
        },
        setOutletList: (state, action) => {
            state.outletList = action.payload;
        },
        setCaptainList: (state, action) => {
            state.captainList = action.payload;
        },
        setWaiterList: (state, action) => {
            state.waiterList = action.payload;
        },
        setEmployeesList: (state, action) => {
            state.employeesList = action.payload;
        },
        setWaiterMapping: (state, action) => {
            state.waiterMapping = action.payload;
        },
        setSameCaptainAndWaiter: (state, action) => {
            state.sameCaptainAndWaiter = action.payload;
        },
        setEmpIDExist: (state, action) => {
            state.empIDExist = action.payload;
        },

    },
});

export const crudIncentiveInfo = (data) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await urlSocket.post('incentive/crud-incentives', { data });
            if (response.status === 200) {
                resolve(response.data)
            }
        } catch (error) {
            reject(error)
        }
    })
}


export const getIncentiveActiveItems = (data) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await urlSocket.post('incentive/incentive-active-item-types');
            if (response.status === 200) {
                resolve(response.data)
            }
        } catch (error) {
            reject(error)
        }
    })
}

export const retrieveOutletInfoAPI = (data) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await urlSocket.post('incentive/get-outlet-info');
            if (response.status === 200) {
                resolve(response.data)
            }
        } catch (error) {
            reject(error)
        }
    })
}

export const validateProfileName = (profile_name, _id) => async (dispatch) => {
    try {
        const response = await urlSocket.post('incentive/check-profile-name', { profile_name, _id });
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Unexpected response status:', response.status);
            throw new Error('Unexpected response status');
        }
    } catch (error) {
        console.error('Error validating profile name:', error);
        throw error;
    }
}

export const getSalesDataAPI = (start_date, end_date) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await urlSocket.post('incentive/get-incntv-sales-data', { start_date, end_date });
            if (response.status === 200) {
                resolve(response.data)
            }
        } catch (error) {
            reject(error)
        }
    })
}


export const getSalesDataPrvwAPI = (data) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            dispatch(setApiLoading(true))
            const response = await urlSocket.post('incentive/get-incntv-sales-data-report', { data },
            );
            if (response.status === 200) {
                resolve(response.data.data);

            } else {
                reject(new Error('Unexpected response status'));
            }
        } catch (error) {
            reject(error);
        }
    });
};


export const retrieveIncItemNameAPI = (start_date, end_date) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await urlSocket.post('incentive/get-inc-type-name-list', { start_date, end_date });
            if (response.status === 200) {
                resolve(response.data)
            }
        } catch (error) {
            reject(error)
        }
    })
}



export const retrieveOrderTypeAPI = (data) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await urlSocket.post('incentive/retrieve-order-type');
            if (response.status === 200) {
                resolve(response.data)
                const { data: orderTypesData, meals } = response.data;
                sessionStorage.setItem('orderTypes', JSON.stringify(orderTypesData));
                sessionStorage.setItem('mealTypes', JSON.stringify(meals));
                dispatch(setOrderTypes(response.data.data))
                dispatch(setMealType(response.data.meals))
            }
        } catch (error) {
            reject(error)
        }
    })
}


export const empDuplicateCheck = (empid, id) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await urlSocket.post('/captain-mapping/validate-emp-id', { emp_id: empid, _id: id });
            resolve(response.data);
        } catch (err) {
            reject(err);
        }
    });
};



export const retrieveEmployeeListAPI = (data) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await urlSocket.post('captain-mapping/retrieve-employee-list', {
                captainId: data?.captainid,
                captainname: data?.captainname,
            });
        
            if (response.status === 200) {


                // const combinedData = [...response.data.captains, ...response.data.waiters];

                // // Create a map to hold unique pairs of captain and waiter names/IDs
                // const uniqueMap = new Map();
                
                // combinedData.forEach(person => {
                //     // Define keys based on whether we are dealing with a captain or waiter
                //     const captainKey = person.captainname ? person.captainname.trim() : '';
                //     const waiterKey = person.waitername ? person.waitername.trim() : '';
                
                //     // Add captain names/IDs to the map
                //     if (captainKey) {
                //         uniqueMap.set(captainKey, { captainName: captainKey, captainId: person.captainid });
                //     }
                
                //     // Add waiter names/IDs to the map
                //     if (waiterKey) {
                //         // If the waiter is already in the map, update their entry to include the waiter information
                //         if (uniqueMap.has(waiterKey)) {
                //             uniqueMap.get(waiterKey).waiterName = waiterKey;
                //             uniqueMap.get(waiterKey).waiterId = person.waiterid;
                //         } else {
                //             uniqueMap.set(waiterKey, { waiterName: waiterKey, waiterId: person.waiterid });
                //         }
                //     }
                // });
                
                // // Convert the map back to an array
                // const resultArray = Array.from(uniqueMap.values());
                
                // // Logging the result
                // console.log('Unique Name and ID pairs:', resultArray);
                
                
                

                dispatch(setCaptainList(response.data.captains));
                dispatch(setWaiterList(response.data.waiters));
                resolve(response.data)
            }
        } catch (error) {
            reject(error)
        }
    })
}



export const retrieveCaptainData = (data) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await urlSocket.post('captain-mapping/crud-captain-info', { data });

            if (response.status === 200) {
                resolve(response.data)
            }
        } catch (error) {
            reject(error)
        }
    })
}


export const getAllCaptainMappings = async () => {
    try {
        const response = await urlSocket.post('captain-mapping/captain-info');
        return response.data;
    } catch (error) {
        console.error('Error fetching captain mappings:', error);
        throw error;
    }
};



export const retrieveMapedUserInfo = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await urlSocket.post('captain-mapping/mapped-waiter-info');
            if (response.status === 200) {
                resolve(response.data)
            }
        } catch (error) {
            console.log('Error fetching captain mappings:', error);
            reject(error)
        }
    })


};







export const { setIncentiveList, setApiLoading, setIncentivePrvw, setIncentiveEditData, setProgressCount, setIncTypeNameList, setOrderTypes, setMealType, setOutletList, setCaptainList, setWaiterList, setEmployeesList,
    setWaiterMapping, setSameCaptainAndWaiter, setEmpIDExist,
} = incentiveSlice.actions;
export const incentiveReducer = incentiveSlice.reducer;
