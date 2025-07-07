import React, { useEffect } from "react";
import PropTypes from "prop-types";
import withRouter from "components/Common/withRouter";
// import { logoutUser } from "../../store/actions";

//redux
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import urlSocket from "helpers/urlSocket";

const Logout = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    clearSessionInfo()
    // dispatch(logoutUser(history));
  }, [dispatch, history]);
  const clearSessionInfo=async()=>{
    var authUser = JSON.parse(sessionStorage.getItem("authUser"))
    const responseData = await urlSocket.post("handle-session/logout-session",{
        user_id : authUser.user_data._id,
        encrypted_db_url : authUser.db_info.encrypted_db_url,
    })
    console.log(responseData,'responseData')
    if(responseData.data.response_code === 500){
      localStorage.clear()
      sessionStorage.clear()
      history("/login")
    }
  
  }
  

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);