import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
    name: 'sessionData',
    initialState: {
        authUserInfo: JSON.parse(sessionStorage.getItem("authUser")) || {}, 
        isAuthenticated: false,
        configInfo: JSON.parse(sessionStorage.getItem("configData")) || {} 
    },
    reducers: {
        setAuthUserInfo: (state, action) => {
            state.authUserInfo = action.payload;
            state.isAuthenticated = true;
        },
        setConfigInfo: (state, action) => {
            state.configInfo = action.payload;
        }
    },
});

export const { setAuthUserInfo, setConfigInfo } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
