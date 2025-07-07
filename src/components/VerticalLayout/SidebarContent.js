import React, { useEffect, useRef, useCallback, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Spinner } from "reactstrap";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";
import { withTranslation } from "react-i18next";
import withRouter from "components/Common/withRouter";
import urlSocket from "helpers/urlSocket";
import _ from "lodash";
import { authProtectedRoutes } from "routes";
import validateSession from "routes/validateSession";

const SidebarContent = (props) => {
  const ref = useRef();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [screens, setScreens] = useState([]);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSideBarInfo = async () => {
      const authUser = JSON.parse(sessionStorage.getItem("authUser"));
      const responseData = await urlSocket.post("cog/get-role-facilities", {
        encrypted_db_url: authUser?.db_info?.encrypted_db_url,
        user_data: authUser?.user_data,
      });

      setDataLoaded(true);
      if (responseData.data.response_code === 500) {
        const facilities = responseData.data.data[0].facilities;
        setScreens(facilities);
        sessionStorage.setItem("user_facilities", JSON.stringify(facilities));
      }
    };

    fetchSideBarInfo();
  }, []);



  const toggleSubMenu = (submenuId) => {
    setActiveSubmenu(activeSubmenu === submenuId ? null : submenuId);
    handleMenuClick()
  };

  const scrollElement = (item) => {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  };

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");

    let parent = item.parentElement;


    while (parent) {
      parent.classList.add("mm-active");
      const sibling = parent.querySelector("ul");
      if (sibling) sibling.classList.add("mm-show");

      parent = parent.parentElement.closest("li");
    }

    scrollElement(item);
  }, []);

  const removeActivation = (items) => {
    Array.from(items).forEach((item) => {
      item.classList.remove("active");
      let parent = item.parentElement;
      while (parent) {
        parent.classList.remove("mm-active", "mm-show");
        const firstChild = parent.querySelector("a");
        if (firstChild) firstChild.classList.remove("mm-active");
        parent = parent.parentElement.closest("li");
      }
    });
  };




  const activeMenu = useCallback(() => {
    const pathName = location.pathname.replace(/\/+$/, "");
    const ul = document.getElementById("side-menu");
    if (!ul) return;

    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    const currentRoute = authProtectedRoutes.find(route =>
      route.path.replace(/\/+$/, "") === pathName
    );

    if (!currentRoute) return;



    const targetPath = currentRoute.parent
      ? authProtectedRoutes.find(route => route.path.includes(currentRoute.parent))?.path
      : currentRoute.path;

    for (let i = 0; i < items.length; ++i) {
      const linkHref = items[i].getAttribute("href");
      if (!linkHref) continue;

      try {
        const itemPath = new URL(linkHref, window.location.origin).pathname.replace(/\/+$/, "");
        if (itemPath === targetPath) {
          items[i].classList.add("active");
          activateParentDropdown(items[i]);
          break;
        }
      } catch (error) {
        console.warn("Invalid URL", linkHref, error);
      }
    }
  }, [location.pathname]);


  useEffect(() => {
    if (ref.current) {
      ref.current.recalculate();
    }
  }, []);

  useEffect(() => {
    if (screens.length > 0) {
      new MetisMenu("#side-menu");
      activeMenu();
    }
  }, [screens]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  const handleMenuClick = async (item) => {
    try {
      const express_session = JSON.parse(localStorage.getItem('express-session'));
      if (!express_session) {
        console.error("No session found!");
        return;
      }
      const result = await validateSession(express_session);
      console.log("result", result);
    } catch (error) {
      console.error("Failed to validate session", error);
    }
  };

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {screens.map((item, index) => {
              if (item.type === "group") {
                const getSubMenu = _.filter(screens, { parent_id: item.id });

                return (
                  <li key={index}>
                    <a
                      href="#"
                      className={`has-arrow ${activeSubmenu === item.id ? "mm-active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSubMenu(item.id);
                      }}
                    >
                      <i className={item.icon_name}></i>
                      <span>{item.interfacename}</span>
                    </a>
                    {getSubMenu.length > 0 && activeSubmenu === item.id && (
                      <ul className="sub-menu">
                        {getSubMenu.map((subItem, ind) => (
                          <li key={`sbmnu${ind}`}>
                            <Link
                              to={`/${subItem.url}`}
                              onClick={() => handleMenuClick(subItem)}
                            >
                              {subItem.interfacename}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              } else if (item.parent_id === null && item.type === "menu") {
                return (
                  <li key={`menu${index}`}>
                    <Link
                      to={`/${item.url}`}
                      onClick={() => handleMenuClick(item)}
                    >
                      <i className={item.icon_name}></i>
                      <span>{item.interfacename}</span>
                    </Link>
                  </li>
                );
              } else {
                return null;
              }
            })}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));










///31-5-25-Venu
// import React, { useEffect, useRef, useCallback, useState } from "react";
// import { useLocation, Link, useNavigate } from "react-router-dom";
// import PropTypes from "prop-types";
// import { Spinner } from "reactstrap";
// import SimpleBar from "simplebar-react";
// import MetisMenu from "metismenujs";
// import { withTranslation } from "react-i18next";
// import withRouter from "components/Common/withRouter";
// import urlSocket from "helpers/urlSocket";
// import _ from "lodash";
// import { authProtectedRoutes } from "routes";
// import validateSession from "routes/validateSession";

// const SidebarContent = (props) => {
//   const ref = useRef();
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const [screens, setScreens] = useState([]);
//   const [activeSubmenu, setActiveSubmenu] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSideBarInfo = async () => {
//       const authUser = JSON.parse(sessionStorage.getItem("authUser"));
//       const responseData = await urlSocket.post("cog/get-role-facilities", {
//         encrypted_db_url: authUser?.db_info?.encrypted_db_url,
//         user_data: authUser?.user_data,
//       });

//       setDataLoaded(true);
//       if (responseData.data.response_code === 500) {
//         const facilities = responseData.data.data[0].facilities;
//         setScreens(facilities);
//         sessionStorage.setItem("user_facilities", JSON.stringify(facilities));
//       }
//     };

//     fetchSideBarInfo();
//   }, []);



//   const toggleSubMenu = (submenuId) => {
//     setActiveSubmenu(activeSubmenu === submenuId ? null : submenuId);
//     handleMenuClick()
//   };

//   const scrollElement = (item) => {
//     if (item) {
//       const currentPosition = item.offsetTop;
//       if (currentPosition > window.innerHeight) {
//         ref.current.getScrollElement().scrollTop = currentPosition - 300;
//       }
//     }
//   };

//   const activateParentDropdown = useCallback((item) => {
//     item.classList.add("active");

//     let parent = item.parentElement;


//     while (parent) {
//       parent.classList.add("mm-active");
//       const sibling = parent.querySelector("ul");
//       if (sibling) sibling.classList.add("mm-show");

//       parent = parent.parentElement.closest("li");
//     }

//     scrollElement(item);
//   }, []);

//   const removeActivation = (items) => {
//     Array.from(items).forEach((item) => {
//       item.classList.remove("active");
//       let parent = item.parentElement;
//       while (parent) {
//         parent.classList.remove("mm-active", "mm-show");
//         const firstChild = parent.querySelector("a");
//         if (firstChild) firstChild.classList.remove("mm-active");
//         parent = parent.parentElement.closest("li");
//       }
//     });
//   };




//   const activeMenu = useCallback(() => {
//     const pathName = location.pathname.replace(/\/+$/, "");
//     const ul = document.getElementById("side-menu");
//     if (!ul) return;

//     const items = ul.getElementsByTagName("a");
//     removeActivation(items);

//     const currentRoute = authProtectedRoutes.find(route =>
//       route.path.replace(/\/+$/, "") === pathName
//     );

//     if (!currentRoute) return;



//     const targetPath = currentRoute.parent
//       ? authProtectedRoutes.find(route => route.path.includes(currentRoute.parent))?.path
//       : currentRoute.path;

//     for (let i = 0; i < items.length; ++i) {
//       const linkHref = items[i].getAttribute("href");
//       if (!linkHref) continue;

//       try {
//         const itemPath = new URL(linkHref, window.location.origin).pathname.replace(/\/+$/, "");
//         if (itemPath === targetPath) {
//           items[i].classList.add("active");
//           activateParentDropdown(items[i]);
//           break;
//         }
//       } catch (error) {
//         console.warn("Invalid URL", linkHref, error);
//       }
//     }
//   }, [location.pathname]);


//   useEffect(() => {
//     if (ref.current) {
//       ref.current.recalculate();
//     }
//   }, []);

//   useEffect(() => {
//     if (screens.length > 0) {
//       new MetisMenu("#side-menu");
//       activeMenu();
//     }
//   }, [screens]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     activeMenu();
//   }, [activeMenu]);

//   const handleMenuClick = async (item) => {
//     try {
//       const express_session = JSON.parse(localStorage.getItem('express-session'));
//       if (!express_session) {
//         console.error("No session found!");
//         return;
//       }
//       const result = await validateSession(express_session);
//       console.log("result", result);
//     } catch (error) {
//       console.error("Failed to validate session", error);
//     }
//   };

//   return (
//     <React.Fragment>
//       <SimpleBar className="h-100" ref={ref}>
//         <div id="sidebar-menu">
//           <ul className="metismenu list-unstyled" id="side-menu">
//             {screens.map((item, index) => {
//               if (item.type === "group") {
//                 const getSubMenu = _.filter(screens, { parent_id: item.id });

//                 return (
//                   <li key={index}>
//                     <a
//                       href="#"
//                       className={`has-arrow ${activeSubmenu === item.id ? "mm-active" : ""}`}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         toggleSubMenu(item.id);
//                       }}
//                     >
//                       <i className={item.icon_name}></i>
//                       <span>{item.interfacename}</span>
//                     </a>
//                     {getSubMenu.length > 0 && activeSubmenu === item.id && (
//                       <ul className="sub-menu">
//                         {getSubMenu.map((subItem, ind) => (
//                           <li key={`sbmnu${ind}`}>
//                             <Link
//                               to={`/${subItem.url}`}
//                               onClick={() => handleMenuClick(subItem)}
//                             >
//                               {subItem.interfacename}
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </li>
//                 );
//               } else if (item.parent_id === null && item.type === "menu") {
//                 return (
//                   <li key={`menu${index}`}>
//                     <Link
//                       to={`/${item.url}`}
//                       onClick={() => handleMenuClick(item)}
//                     >
//                       <i className={item.icon_name}></i>
//                       <span>{item.interfacename}</span>
//                     </Link>
//                   </li>
//                 );
//               } else {
//                 return null;
//               }
//             })}
//           </ul>
//         </div>
//       </SimpleBar>
//     </React.Fragment>
//   );
// };

// SidebarContent.propTypes = {
//   location: PropTypes.object,
//   t: PropTypes.any,
// };

// export default withRouter(withTranslation()(SidebarContent));