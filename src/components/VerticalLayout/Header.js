import PropTypes from 'prop-types';
import React, { useState } from "react";

import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";

// Import menuDropdown
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import megamenuImg from "../../assets/images/megamenu-img.png";

// import images
import github from "../../assets/images/brands/github.png";
import bitbucket from "../../assets/images/brands/bitbucket.png";
import dribbble from "../../assets/images/brands/dribbble.png";
import dropbox from "../../assets/images/brands/dropbox.png";
import mail_chimp from "../../assets/images/brands/mail_chimp.png";
import slack from "../../assets/images/brands/slack.png";

import logo from "../../assets/images/logo.svg";
import logoLightSvg from "../../assets/images/logo-light.svg";

//i18n
import { withTranslation } from "react-i18next";

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions";

const Header = props => {


  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable");
    } else {
      body.classList.toggle("vertical-collpsed");
      body.classList.toggle("sidebar-enable");
    }

  }

  const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))

  return (
    <React.Fragment>
      <header id="page-topbar" style={{ borderBottom: "1px solid #dedede", left: 0 }}>
        <div className="navbar-header" style={{ height: 60 }}>
          <div className="d-flex align-items-center">

            {/* <div className="d-flex flex-column justify-content-center align-items-center" > */}
            {authUser &&
              <div className='d-flex flex-row align-items-center justify-content-center gap-2 px-2' style={{ width: 250 }}>
                <div>
                  {
                    authUser.client_info[0]?.client_logo_rzd !== undefined &&
                    authUser.client_info[0]?.client_logo_rzd !== null &&
                    <img
                      alt="Header Avatar"
                      className=""
                      src={`${authUser.client_info[0].base_url}eaudit-files/` + authUser.client_info[0]?.client_logo?.originalname}
                      style={{ height: '50px', objectFit: 'contain', borderRadius: 30 }}
                    />
                  }
                </div>
                <div style={{ textTransform: "uppercase", fontSize: 15 }} className='text-truncate'>{authUser.client_info[0]?.client_name}</div>
              </div>
            }
            {/* </div> */}

            <button
              type="button"
              onClick={() => {
                tToggle();
              }}
              className="btn btn-sm px-3 font-size-16 header-item "
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>

          </div>
          <div className="d-flex align-items-center">

            <ProfileMenu />


          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func
};

const mapStatetoProps = state => {
  const {
    layoutType,
    showRightSidebar,
    leftMenu,
    leftSideBarType,
  } = state.Layout;
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header));
