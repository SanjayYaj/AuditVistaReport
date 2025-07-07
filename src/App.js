import PropTypes from 'prop-types';
import React from "react";
import { useSelector , useDispatch  } from "react-redux";
import { createSelector } from "reselect";
import { Routes, Route } from "react-router-dom";
import { layoutTypes } from "./constants/layout";
// Import Routes all
import { authProtectedRoutes, publicRoutes } from "./routes";
import { useEffect } from 'react';
import validateSession from 'routes/validateSession';

// Import all middleware
import Authmiddleware from "./routes/route";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
// import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";
import { AuthProvider } from 'store/context/AuthContext';


import { setDbInfoReport  , updateUserInfo} from './Slice/authSlice'
// Import scss
import "./assets/scss/theme.scss";

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper";



// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// };

// init firebase backend
// initFirebaseBackend(firebaseConfig);


const getLayout = (layoutType) => {
  let Layout = VerticalLayout;
  switch (layoutType) {
    case layoutTypes.VERTICAL:
      Layout = VerticalLayout;
      break;
    case layoutTypes.HORIZONTAL:
      // Layout = HorizontalLayout;
      break;
    default:
      break;
  }
  return Layout;
};

const App = () => {

  const dispatch = useDispatch();
  const selectLayoutState = (state) => state.Layout;
  const LayoutProperties = createSelector(
    selectLayoutState,
      (layout) => ({
        layoutType: layout.layoutType,
      })
  );

    const {
      layoutType
  } = useSelector(LayoutProperties);

  const Layout = getLayout(layoutType);



  const checkAuth = async (express_session) => {
    try {
      const result = await validateSession(express_session);
      var authInfo = JSON.parse(sessionStorage.getItem('authUser'))
      if( authInfo ){
        dispatch(setDbInfoReport(authInfo.db_info))
        dispatch(updateUserInfo(authInfo.user_data))
      }
     
    } catch (error) {
      console.error("Auth check failed", error);
    }
  };

  useEffect(() => {
    const express_session = JSON.parse(localStorage.getItem("express-session"));
    if (express_session) {
      checkAuth(express_session);
    }
  }, []);

  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <NonAuthLayout>
                {route.component}
              </NonAuthLayout>
            }
            key={idx}
            exact={true}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <AuthProvider>
              <Authmiddleware route={route}>
                <Layout>{route.component}</Layout>
              </Authmiddleware>
              </AuthProvider>
              }
            key={idx}
            exact={true}
          />
        ))}
      </Routes>
    </React.Fragment>
  );
};

App.propTypes = {
  layout: PropTypes.any
};

export default App;