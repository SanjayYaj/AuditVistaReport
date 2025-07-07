import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "components/Common/withRouter";

// users
import user1 from "../../../assets/images/avatar.jpg";

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const [username, setusername] = useState("");
  const [authUser, setAuthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")));
  const [isSocketConnected, setSocketConneccted] = useState(false)


  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem("authUser"))) {
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        setusername(obj.user_data.fullname);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        setusername(obj.user_data.fullname);
      }
    }
  }, [props.success]);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn "
          id="page-header-user-dropdown"
          tag="button"
          style={{ border: 0, borderRadius: 0 }}

        >
          {
            authUser && authUser.user_data.user_img !== undefined && authUser.user_data.user_img.length > 0 ?
              <img
                className="rounded-circle header-profile-user"
                src={authUser.client_info[0].base_url + authUser.user_data.user_img[0].originalname}
                alt="Header Avatar"
              /> :
              <img
                className="rounded-circle header-profile-user"
                src={user1}
                alt="Header Avatar"
              />
          }
          <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/profile">
            {" "}
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t("Profile")}{" "}
          </DropdownItem>
          <div className="dropdown-divider" />
          <Link to="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>

    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
};

const mapStatetoProps = state => {
  const { error, success } = {};
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
