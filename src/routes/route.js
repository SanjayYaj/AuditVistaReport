import React from "react";
import { Navigate } from "react-router-dom";

const Authmiddleware = (props) => {
  if (JSON.parse(sessionStorage.getItem('user_facilities'))) {
    var facilities = JSON.parse(sessionStorage.getItem('user_facilities'))
    const menu = facilities?.find((item) => item.url === props.route.parent);
  }
  if (!sessionStorage.getItem("authUser")) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }
  return (<React.Fragment>
    {props.children}
  </React.Fragment>);
};

export default Authmiddleware;
