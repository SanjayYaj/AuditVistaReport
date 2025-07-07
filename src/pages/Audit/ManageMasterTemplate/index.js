import PropTypes from "prop-types";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  Label
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { withTranslation } from "react-i18next";
import { map } from "lodash"
import urlSocket from "helpers/urlSocket";
import CardContact from "./card-contact"
import tmplIcon from './Assests/Images/tmpl-icon-1.png';
import TableContainer from "./Components/TemplateTableContainer";
import { AvForm, AvField } from "availity-reactstrap-validation"
import { LoadingOutlined } from '@ant-design/icons'
import Swal from 'sweetalert2';
import { groupBy } from 'lodash';
import { usePermissions } from 'hooks/usePermisson';
import { useTemplateValidationDebounce } from "utils/ useTemplateValidationDebounce";
import noDataFound from "../../../assets/auditvista/no_data_found.jpg"






const TemplateLibrary = props => {

  document.title = "Template Library";
  const navigate = useNavigate();


  const dbInfo = JSON.parse(sessionStorage.getItem("db_info"));
  const userInfo = JSON.parse(sessionStorage.getItem("authUser"));

  const [auditData, setAuditData] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [auditNameExist, setAuditNameExist] = useState(false);
  const [btnLoad, setBtnLoad] = useState(false);
  const [tempAuditData, setTempAuditData] = useState([]);
  const [searchFiles, setSearchFiles] = useState([]);
  const [dupSearchFiles, setDupSearchFiles] = useState([]);
  const [tempSearchFiles, setTempSearchFiles] = useState([]);
  const [gridView, setGridView] = useState("list");
  const [config, setConfig] = useState(null);
  const [protectRoutes, setProtectRoutes] = useState(null);
  const [templatesData, setTemplatesData] = useState([]);
  const [dataloaded, setDataloaded] = useState(false);
  const [users, setUsers] = useState('');
  const [convertionTemplateData, setConvertionTemplateData] = useState(null);
  const [confirmBoth, setConfirmBoth] = useState(false);
  const [convertionMode, setConvertionMode] = useState("0");
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateTemp, setUpdateTemp] = useState({});
  const [templateName, setTemplateName] = useState('');
  const [templateInfo, setTemplateInfo] = useState('');
  const [deleteItem, setTdeleteItem] = useState([]);
  const [searchValue, setSearchValue] = useState('');


  const [category, setCategory] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const { canEdit } = usePermissions("mngmtrtmplt");
  const { debouncedTemplateNameValidation } = useTemplateValidationDebounce(500);

  const [groupedData, setGroupedData] = useState({});
  const [categories, setCategories] = useState([]);





  useEffect(() => {
    const loadData = async () => {
      const data = JSON.parse(sessionStorage.getItem("authUser"));
      const dbInfo = JSON.parse(sessionStorage.getItem("db_info"));
      const userFacilities = JSON.parse(sessionStorage.getItem("user_facilities"));
      const configData = data.config_data;
      const userData = data.user_data;
      setConfig(configData);
      await retriveCatInfo()
      getAuditMasterTemplates();

    };

    loadData();
  }, []);



  const getAuditDefaultTemplates = async () => {
    try {
      const response = await urlSocket.post('/webmngtmplt/gettemplates', {
        userInfo: {
          encrypted_db_url: dbInfo?.encrypted_db_url,
          company_id: userInfo?.company_id,
          user_id: userInfo?._id,
        },
      });

      console.log(response, 'response');
      if (response.data.response_code === 500) {
        setTemplatesData(response.data.data);
        getAuditMasterTemplates();
        setDataloaded(true);
      } else {
        setDataloaded(true);
      }
    } catch (error) {
      console.log(error.toString());
    }
  };



  const getAuditMasterTemplates = async () => {

    try {
      const response = await urlSocket.post('/webmngtmplt/getusertemplatemaster', {
        userInfo: {
          encrypted_db_url: dbInfo.encrypted_db_url,
          company_id: userInfo.user_data.company_id,
          user_id: userInfo.user_data._id,
        },
      });

      console.log(response, 'response');
      if (response.data) {
        const data = response.data.data;

        var filteredData = String(searchValue).length > 0 ? data.filter(item =>
          item.template_name.toLowerCase().includes(searchValue.toLowerCase())
        ) : data

        setAuditData(filteredData);
        const grouped = groupAuditDataByCategory(filteredData);
        setGroupedData(grouped.groupedData);
        setCategories(grouped.categories);
        setTempAuditData(data);
        setSearchFiles(data);
        setDupSearchFiles(data);
        setTempSearchFiles(data);
        setDataloaded(true);
      }
    } catch (error) {
      console.log(error.toString());
    }
  };



  const toggle = () => {
    setModal(prevModal => !prevModal);
    setConvertionMode("0");
    setAuditNameExist(false);
  };



  const handleUserClicks = async (arg) => {
    setCategory('')
    setTemplateInfo('')
    setTemplateName('')
    setShowAddCategoryInput(false)
    setUsers('');
    setIsEdit(false);
    setConvertionMode("0");
    setAuditNameExist(false);
    setModal(prevState => !prevState);
    setAuditNameExist(false);
  };

  const retriveCatInfo = async () => {
    const authUser = JSON.parse(sessionStorage.getItem("authUser"))
    console.log('user_data :>> ', authUser.user_data);

    try {
      const responseData = await urlSocket.post("webmngtmplt/retrive-temp-cat-info", {
        encrypted_db_url: authUser.db_info.encrypted_db_url,
        // branch_id: authUser.user_data.branch_id,
        // dept_id: authUser.user_data.dept_id
        user_id: authUser.user_data._id
      })
      console.log(responseData, 'responseData')
      if (responseData.status === 200) {
        setCategoryList(responseData.data?.data)
      }
    } catch (error) {

    }
  }


  const useTemplateHandlerClick = (data) => {
    console.log("data", data)
    setUsers('');
    setTemplateName('')
    setTemplateInfo('')
    setIsEdit(false);
    setConvertionMode("2");
    setConvertionTemplateData(data);
    setModal(prevModal => !prevModal);
    setAuditNameExist(false);
  };


  const handleDeleteTemplate = async (values) => {

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });
      if (result.isConfirmed) {
     
        const response = await urlSocket.post("webmngtmplt/deletetemplate", {
          templateInfo: {
            template_id: values._id
          },
          userInfo: {
            encrypted_db_url: dbInfo.encrypted_db_url,
            company_id: userInfo.user_data.company_id,
            created_by: userInfo.user_data._id,
          },
        });

        console.log("response", response);

        if (response.data.response_code === 500) {
          // setAuditData(response.data.data);

           await retriveCatInfo()
           getAuditMasterTemplates();
          // setTempAuditData(response.data.data);
          // setSearchFiles(response.data.data);
          // setDupSearchFiles(response.data.data);
          // setTempSearchFiles(response.data.data);
          setDataloaded(true);

          Swal.fire({
            title: "Deleted!",
            text: "Template has been deleted.",
            icon: "success",
          });
        }
      } else {
        Swal.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while deleting the template.",
        icon: "error",
      });
    }
  };




  // const handleValidAuditSubmit = (e, values) => {
  //   console.log('updateTemp', values);
  //   setBtnLoad(true);
  //   const authUser = JSON.parse(sessionStorage.getItem("authUser"));
  // console.log('convertionMode :>> ', convertionMode, isEdit);
  //   if (!auditNameExist) {
    
  //     if (convertionMode === "2") {
  //       const templateNameInfo = {
  //         template_name: values["template_name"],
  //         template_info: values["template_info"]
  //       };
  //       convertTemplateAs(convertionTemplateData, templateNameInfo);
  //     }
  //     if (convertionMode === '3') {
  //       console.log('Make a copy :', values, category);
  //       const copyPayload = {
  //         ...updateTemp,
  //         is_copy: true,
  //         template_name: values.template_name,
  //         template_info: values.template_info,
  //         category: category,
  //       };
  //       console.log('copyPayload :>> ', copyPayload);
  //       createNewAudit(copyPayload);
  //     } 
  //     else {
  //       if (isEdit) {
  //         setUpdateTemp(prevTemp => {
  //           const updatedTemp = {
  //             ...prevTemp,
  //             template_name: values.template_name,
  //             template_info: values.template_info,
  //             category: category
  //           };
  //           createNewAudit(updatedTemp);
  //           return updatedTemp;
  //         });

  //       } else if(convertionMode !== '2') {
  //         const templateInfo = {
  //            ...updateTemp,
  //           template_name: values["template_name"],
  //           template_info: values["template_info"],
  //           branch_id: authUser.user_data.branch_id?.map(branch => branch._id) || [],
  //           dept_id: authUser.user_data.dept_id?.map(dept => dept._id) || [],
  //           category: category
  //         };
  //         console.log('templateInfo :>> ', templateInfo);
  //         createNewAudit(templateInfo);
  //       }
  //     }

  //     setSelectedUser(null);
  //     setModal(prevState => !prevState);
  //     setAuditNameExist(false);
  //   }

  //   setBtnLoad(false);
  // };


const handleValidAuditSubmit = async (e, values) => {
    console.log('updateTemp', values);
    setBtnLoad(true);
    const authUser = JSON.parse(sessionStorage.getItem("authUser"));
  
    if (!auditNameExist) {
      try {
        if (convertionMode === "2") {
          const templateNameInfo = {
            template_name: values["template_name"],
            template_info: values["template_info"]
          };
          await convertTemplateAs(convertionTemplateData, templateNameInfo);
  
        } else if (convertionMode === '3') {
          console.log('Make a copy :', values, category);
          const copyPayload = {
            ...updateTemp,
            is_copy: true,
            template_name: values.template_name,
            template_info: values.template_info,
            category: category,
          };
          await createNewAudit(copyPayload);
  
        } else {
          if (isEdit) {
            setUpdateTemp(prevTemp => {
              const updatedTemp = {
                ...prevTemp,
                template_name: values.template_name,
                template_info: values.template_info,
                category: category
              };
              // You can call createNewAudit outside setUpdateTemp, but if you want it here:
              createNewAudit(updatedTemp);
              return updatedTemp;
            });
          } else if (convertionMode !== '2') {
            const templateInfo = {
              template_name: values["template_name"],
              template_info: values["template_info"],
              branch_id: authUser.user_data.branch_id?.map(branch => branch._id) || [],
              dept_id: authUser.user_data.dept_id?.map(dept => dept._id) || [],
              category: category
            };
            await createNewAudit(templateInfo);
          }
        }
  
        setSelectedUser(null);
        setModal(prevState => !prevState);
        setAuditNameExist(false);
  
      } catch (error) {
        console.error('Error handling audit submit:', error);
        // Optionally show error to user
      }
    }
  
    setBtnLoad(false);
  };




  const dateConvertion = (dateToConvert) => {
    if (dateToConvert != null) {
      var date = typeof (dateToConvert) == "object" ? String(dateToConvert.toISOString()) : String(dateToConvert)
      var convertedDate = date.slice(8, 10) + ' / ' + (date.slice(5, 7)) + ' / ' + date.slice(0, 4);//prints expected format. 
      if (convertedDate == "01 / 01 / 1970") {
        return "-- / -- / --"
      }
      else {
        return convertedDate
      }
    }
    else {
      return "-- / -- / --"
    }
  }


  const auditName = useCallback(async (e) => {
    const auditName = e.target.value.trim();
    console.log(auditName, 'audit_name');

    if ((auditName !== undefined || auditName === '') && (!isEdit && convertionMode === "2")) {
           console.log("Validate name");
      try {
        const response = await urlSocket.post('cog/validate-audit-name', {
          audit_name: auditName,
          db_url: dbInfo.encrypted_db_url,
          user_id: userInfo._id
        });
        setTemplateName(auditName)
        // console.log(response, 'response');

        if (response.data.data.length > 0) {
          setAuditNameExist(true);
        } else {
          setAuditNameExist(false);
        }
      } catch (error) {
        console.error("Error during audit name validation:", error);
      }
    } else {
      console.log("Validate questionnaire name");

      try {
        const response = await urlSocket.post('webmngtmplt/validate-user-templatemaster', {
          audit_name: auditName,
          encrypted_db_url: dbInfo.encrypted_db_url,
          user_id: userInfo.user_data._id
        });
        console.log('response378', response.data)
        if (response.data.response_code === 500 && response.data.data.length > 0) {
          setAuditNameExist(true);
        } else {
          setAuditNameExist(false);
        }
      } catch (error) {
        console.error("Error during template validation:", error);
      }
    }
  }, []);

  
// const handleTemplateNameChange = (value) => {
//     const templateName = value;
//     debouncedTemplateNameValidation(templateName, {isEdit, convertionMode, dbInfo, userInfo, setAuditNameExist, setTemplateName });
//   };


const handleTemplateNameChange = (value) => {
    const templateName = value;
  // setBtnLoad(true)
    debouncedTemplateNameValidation(templateName, {
        isEdit,
        convertionMode,
        dbInfo,
        userInfo,
        setAuditNameExist,
        setTemplateName,
        onComplete: (result) => {
            console.log("Validation result:", result);
            if (result.exists) {
                console.log("Name already exists");
                setBtnLoad(false)
            } else {
                console.log("Name is valid");
                setBtnLoad(false)
            }
        }
    });
};


  const createNewAudit = async (data) => {
    console.log('data369', data)
    console.log('userInfo', userInfo)
    setBtnLoad(true);
    try {
      const response = await urlSocket.post('/webmngtmplt/crudtemplate', {
        userInfo: {
          encrypted_db_url: dbInfo.encrypted_db_url,
          company_id: userInfo.user_data.company_id,
          company_name: config.client_name,
          user_id: userInfo.user_data._id,
        },

        templateInfo:
          data.is_copy ? data : {
            template_id: data._id !== undefined ? data._id : undefined,
            template_name: data.template_name.trim(),
            template_info: data.template_info,
            tmplt_ctd_by: data.tmplt_ctd_by,
            branch_id: data.branch_id,
            dept_id: data.dept_id,
            category: data.category,

          }
      });

      setBtnLoad(false);
      await retriveCatInfo()
      console.log('response :>> ', response);
      if (response.data.response_code === 500) {
        navigateTo(response.data.data);
      } else {
        getAuditMasterTemplates();
      }

    } catch (error) {
      console.error("Error while creating audit:", error.toString());
      setBtnLoad(false);
    }
  };



  const convertTemplateAs = async (data, templateNameInfo) => {
    setBtnLoad(true);
    data["created_by"] = userInfo.user_data._id
    try {
      const response = await urlSocket.post('/webmngtmplt/converttemplate', {
        userInfo: {
          encrypted_db_url: dbInfo.encrypted_db_url,
          company_id: userInfo.user_data.company_id,
          company_name: userInfo.user_data.company_name,
          user_id: userInfo.user_data._id,
        },
        templateInfo: {
          data,
          template_name: templateNameInfo.template_name,
          template_info: templateNameInfo.template_info,
        }
      });

      setBtnLoad(false);

      if (response.data.response_code === 500) {
        navigateTo();
      }
    } catch (error) {
      console.error("Error while converting template:", error);
      setBtnLoad(false);
    }
  };



  const navigateTo = (data) => {
    if (convertionMode === "2") {
      console.log("navigateeee");
      sessionStorage.removeItem("EditData");
      navigate("/mngpblhtempt");
    } else {
      sessionStorage.removeItem("EditData");
      sessionStorage.setItem("EditData", JSON.stringify({ template_name: data.template_name, template_info: data.template_info, _id: data._id, tmplt_ctd_by: data.tmplt_ctd_by }));
      console.log('Stored data:', JSON.parse(sessionStorage.getItem("EditData")));
      navigate("/crttmplt");
    }
  };


  const renameTemp = (data) => {

    console.log("convertion456", data)
    setShowAddCategoryInput(false)
    setUpdateTemp(data);
    setTemplateName(data.template_name);
    setTemplateInfo(data.template_info);
    setCategory(data.category?.cat_name)
    setConvertionMode("0");
    setModal(prev => !prev);
    setAuditNameExist(false);
  };





  const searchTempName = (value) => {
    if (value.length > 0) {
      const filteredData = tempAuditData.filter(item =>
        item.template_name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchValue(value)
      setAuditData(filteredData);
    } else {
       setSearchValue('')
      setAuditData(tempAuditData);
    }
  };

  const makeCopy = (data) => {
    // handleTemplateNameChange(data.template_name)
    
    setShowAddCategoryInput(false)
    setConvertionMode("3");
    setIsEdit(true)
    setUpdateTemp(data);
    setTemplateName(data.template_name);
    setTemplateInfo(data.template_info);
    setModal(prev => !prev);
    setAuditNameExist(false);
    setCategory(data.category?.cat_name)
  };

  useEffect(() => {
    if (modal && convertionMode === "3" && isEdit) {
      setTemplateName(prev => prev + " copy");
    } 
    else if (modal && isEdit) {
      setTemplateName(templateName);
    } else if (!isEdit) {
      // setTemplateName("");
    }
  }, [modal, convertionMode, isEdit]);

   useEffect(() => {
    if (modal && convertionMode === "3" && isEdit) {
      // setTemplateName(prev => prev + " copy");
      console.log('templateName :>> ', templateName);
       handleTemplateNameChange(templateName)
    } 
  }, [templateName]);

  const TemplateNameCell = (cellProps) => {
  const item = cellProps.row.original;
  const [nameExpanded, setNameExpanded] = useState(false);
  const [infoExpanded, setInfoExpanded] = useState(false);

  const maxLength = 50;

  const isLongName = item.template_name.length > maxLength;
  const isLongInfo = item.template_info.length > maxLength;

  const displayName = nameExpanded
    ? item.template_name
    : item.template_name.slice(0, maxLength);

  const displayInfo = infoExpanded
    ? item.template_info
    : item.template_info.slice(0, maxLength);

  return (
    <div className="d-flex flex-row align-items-end">
      <div className="me-2">
        <div
          style={{
            height: "60px",
            width: "60px",
            padding: 10,
            display: "flex",
            justifyContent: "center",
            borderRadius: "10%",
            alignItems: "center",
            background: "rgb(243, 246, 251)",
          }}
        >
          <img
            src={tmplIcon}
            alt=""
            style={{
              height: "100%",
              width: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
      <div className="d-flex flex-column pe-2">
        <div className="font-size-12 mb-1 fw-bold" style={{ textWrap: "wrap" }}>
          {displayName}
          {isLongName && (
            <>
              {!nameExpanded && "... "}
              <button
                onClick={() => setNameExpanded(!nameExpanded)}
                className="btn btn-link p-0 m-0 ms-1"
                style={{ fontSize: "10px" }}
              >
                {nameExpanded ? "Show less" : "Show more"}
              </button>
            </>
          )}
        </div>
        <div>
          <p className="text-muted font-size-10" style={{ textWrap: "wrap" }}>
            {displayInfo}
            {isLongInfo && (
              <>
                {!infoExpanded && "... "}
                <button
                  onClick={() => setInfoExpanded(!infoExpanded)}
                  className="btn btn-link p-0 m-0 ms-1"
                  style={{ fontSize: "10px" }}
                >
                  {infoExpanded ? "Show less" : "Show more"}
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};


  const templateColumns = useMemo(() => {
    const columns = [
      // {
      //   accessor: 'template_name',
      //   Header: 'Template Name',
      //   width: "50%",
      //   Cell: (cellProps) => {
      //     const item = cellProps.row.original;
      //     return (
      //       <div className="d-flex flex-row align-items-end">
      //         <div className="me-2">
      //           <div
      //             style={{
      //               height: "60px",
      //               width: "60px",
      //               padding: 10,
      //               display: "flex",
      //               justifyContent: "center",
      //               borderRadius: "10%",
      //               alignItems: "center",
      //               background: "rgb(243, 246, 251)",
      //             }}
      //           >
      //             <img
      //               src={tmplIcon}
      //               alt=""
      //               style={{
      //                 height: "100%",
      //                 width: "100%",
      //                 objectFit: "contain",
      //               }}
      //             />
      //           </div>
      //         </div>
      //         <div className="d-flex flex-column pe-2">
      //           <div className="font-size-12 mb-1 fw-bold" style={{ textWrap: "wrap" }}>
      //             {item.template_name}
      //           </div>
      //           <div>
      //             <p className="text-muted font-size-10" style={{ textWrap: "wrap" }}>
      //               {item.template_info}
      //             </p>
      //           </div>
      //         </div>
      //       </div>
      //     );
      //   }
      // },
      {
        accessor: 'template_name',
        Header: 'Template Name',
        width: "50%",
        Cell: TemplateNameCell,
      },
      {
        accessor: 'category',
        Header: 'Category',
        width: "20%",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const categoryName = item.category?.cat_name;
          return <span className="font-size-11">{categoryName || "--"}</span>;
        }
      },
      {
        accessor: 'total_checkpoints',
        Header: 'Total Checkpoint',
        width: "10%",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          return (
            <span
              className={`badge ${item.total_checkpoints === 0
                ? "badge-soft-secondary"
                : "badge-soft-success"
                } font-size-11`}
              style={{
                borderRadius: "50%",
                padding: "0.5em 0.75em",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              {item.total_checkpoints}
            </span>
          );
        }
      },
      {
        accessor: 'created_on',
        Header: 'Created on',
        width: "20%",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          return (
            <span className="font-size-11">{dateConvertion(item.created_on)}</span>
          );
        }
      }
    ];


    if (canEdit) {



      columns.push({
        accessor: "menu",
        Header: "Action",
        width: "20%",
        Cell: (cellProps) => {
          const docItem = cellProps.row.original;
          return (
            <Row>
              <ul className="list-unstyled hstack gap-1 mb-0">
                {/* <li>
                  <Link
                    to="#"
                    className="btn btn-sm btn-soft-primary"
                    onClick={() => makeCopy(docItem)}
                    id={`copytooltipTemp-${docItem._id}`}
                  >
                    <i className="bx bx-copy" />
                  </Link>
                  <UncontrolledTooltip placement="top" target={`copytooltipTemp-${docItem._id}`}>
                    Make a Copy
                  </UncontrolledTooltip>
                </li> */}
                {docItem._id && (
                  <>
                    <Link
                      to="#"
                      className="btn btn-sm btn-soft-primary"
                      onClick={() => makeCopy(docItem)}
                      id={`copytooltipTemp-${docItem._id}`}
                    >
                      <i className="bx bx-copy" />
                    </Link>
                    <UncontrolledTooltip
                      placement="top"
                      target={`copytooltipTemp-${docItem._id}`}
                    >
                      Make a Copy
                    </UncontrolledTooltip>
                  </>
                )}


                <li>
                  <div className="btn btn-sm btn-soft-primary" id={`viewtooltip-${docItem._id}`} onClick={() => { setConvertionMode("1"); navigateTo(docItem); }} style={{ cursor: "pointer" }} >
                    <i className="mdi mdi-clipboard-text-outline" />
                  </div>
                  <UncontrolledTooltip placement="top" target={`viewtooltip-${docItem._id}`}>
                    Edit Template
                  </UncontrolledTooltip>
                </li>

                <li>
                  <Link to="#" className="btn btn-sm btn-soft-info" onClick={() => renameTemp(docItem)} id={`edittooltip-${docItem._id}`} >
                    <i className="bx bx-edit-alt" />
                  </Link>
                  <UncontrolledTooltip placement="top" target={`edittooltip-${docItem._id}`}>
                    Rename Template
                  </UncontrolledTooltip>
                </li>

                <li>
                  <Link to="#" className="btn btn-sm btn-soft-danger" onClick={() => { setConfirmBoth(true); setTdeleteItem(docItem); handleDeleteTemplate(docItem) }} id={`deletetooltip-${docItem._id}`} >
                    <i className="bx bx-trash" />
                  </Link>
                  <UncontrolledTooltip placement="top" target={`deletetooltip-${docItem._id}`}>
                    Delete Template
                  </UncontrolledTooltip>
                </li>

                <li>
                  <Link to="#" className={ docItem.total_checkpoints !== 0 ? "btn btn-sm btn-soft-success" : "btn btn-sm btn-soft-secondary" }
                    onClick={() => { setConvertionMode("2"); if (docItem.total_checkpoints !== 0) { useTemplateHandlerClick(docItem); } }} id={`shareaudit-${docItem._id}`} >
                    <i className={ docItem.total_checkpoints === 0 ? "mdi mdi-share-off" : "mdi mdi-share" } />
                  </Link>
                  <UncontrolledTooltip placement="top" target={`shareaudit-${docItem._id}`}>
                    {docItem.total_checkpoints === 0
                      ? "Add check points and use this template"
                      : "Use this template as"}
                  </UncontrolledTooltip>
                </li>
              </ul>
            </Row>
          );
        }
      });
    }

    return columns;
  }, []);



  const handleSelectCategory = (e) => {
    if (e.target.value === "add_new") {
      setShowAddCategoryInput(true);
      setCategory('')
    } else {
      setShowAddCategoryInput(false)
      var selectedDesgn = _.filter(categoryList, { cat_name: event.target.value })[0]
      console.log('selectedDesgn :>> ', selectedDesgn);
      setCategory(selectedDesgn.cat_name)
    }
  };



  const handleCategoryInputChange = async (value) => {
    console.log('value :>> ', value);
    if (value.trim() === '') {
      setDuplicateError(false);
      return;
    }
    setCategory(value.trim())
    const exists = await checkCategoryExists(value);
    console.log('exists :>> ', exists);
    setDuplicateError(exists);
  };

  const checkCategoryExists = async (name) => {
    console.log('userInfo._id :>> ', userInfo.user_data._id);
    try {
      const response = await urlSocket.post('webmngtmplt/validate-category', {
        category: name,
        db_url: dbInfo.encrypted_db_url,
        user_id: userInfo.user_data._id
      });

      return response.data.exist;
    } catch (err) {
      return false;
    }
  };


  // var groupedData = groupBy(auditData, (item) =>
  //   item.category?.cat_name || "Unauthorized"
  // );

  // const categories = Object.keys(groupedData).filter((cat) => cat !== "Unauthorized");

  // if (groupedData["Unauthorized"]) {
  //   categories.push("Unauthorized");
  // }
  // console.log('groupedData :>> ', groupedData);



  const groupAuditDataByCategory = (auditData) => {
  const grouped = groupBy(auditData, (item) =>
    item.category?.cat_name || "Unauthorized"
  );

  const catList = Object.keys(grouped).filter((cat) => cat !== "Unauthorized");
  if (grouped["Unauthorized"]) {
    catList.push("Unauthorized");
  }

  return {
    groupedData: grouped,
    categories: catList,
  };
};

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={props.t("Audit Templates")}
            breadcrumbItem={props.t("Audit Templates")}
          />
          

          <Card>
            <CardBody>
              <Row className="mb-2">
                <Col md={4}>
                  <Input type="text" className="form-control" id="searchJob" placeholder="Search your audit" onChange={(e) => { searchTempName(e.target.value) }} />
                </Col>
                <Col md={8} className="d-flex justify-content-end gap-2">
                  <div>
                    <span className="me-2">View :</span>
                    <button
                      className={`btn btn-sm me-2 ${gridView === "block" ? "btn-primary text-white" : "btn-outline-primary"}`}
                      style={{ borderRadius: "50px", padding: "0.375rem 1rem", minWidth: "3rem", textAlign: "center" }}
                      onClick={() => { setGridView("block"); getAuditDefaultTemplates() }}
                    >
                      <i className="bx bx-grid-alt" /> Grid
                    </button>
                    <button
                      className={`btn btn-sm me-2 ${gridView === "list" ? "btn-primary text-white" : "btn-outline-primary"}`}
                      style={{ borderRadius: "50px", padding: "0.375rem 1rem", minWidth: "3rem", textAlign: "center" }}
                      onClick={() => { setGridView("list"); getAuditDefaultTemplates() }}
                    >
                      <i className="bx bx-list-ol" /> List
                    </button>
                  </div>
                  {
                    canEdit ? (
                      <div>
                        <Button onClick={handleUserClicks} className="btn-sm d-flex align-items-center" color="primary" type="button">
                          <i className="bx bx-list-plus me-1" style={{ fontSize: '20px' }} /> {'Create Template'}
                        </Button>
                      </div>
                    ) : null
                  }
                </Col>
              </Row>

              {gridView === "block" && (
                <>
                  {categories.map((categoryName) => (
                    <div key={categoryName} className="mb-4">
                      <h6 className="my-3 text-primary fw-bold">{categoryName}</h6>
                      <Row className="g-2">
                        {groupedData[categoryName].map((docItem, contactkey) => (
                          <CardContact
                            docItem={docItem}
                            key={"_docItem_" + contactkey}
                            contactkey={contactkey}
                            onRename={(data) => renameTemp(data)}
                            onEdit={(data) => {
                              setConvertionMode("1");
                              navigateTo(data);
                            }}
                            onDelete={(data) => {
                              setConfirmBoth(true);
                              setTdeleteItem(data);
                              handleDeleteTemplate(data);
                            }}
                            useThisTemplate={(data) => useTemplateHandlerClick(data)}
                            makeCopy={() => makeCopy(docItem)}
                            canEdit={canEdit}
                          />
                        ))}
                      </Row>
                    </div>
                  ))}
                </>
              )}
                          
              {/* {gridView === "block" && (
                <>
                  {auditData.length === 0 ? <Row className="g-2"> <div className="d-flex flex-column justify-content-center align-items-center">
                    <img src={noDataFound} style={{ width: "20%" }} />
                    <label className='font-size-16'>No data found</label>
                  </div></Row> : <>
                    {categories.map((categoryName) => (
                      <div key={categoryName} className="mb-4">
                        <h6 className="my-3 text-primary fw-bold">{categoryName}</h6>
                        <Row className="g-2">
                          {groupedData[categoryName].map((docItem, contactkey) => (
                            <CardContact
                              docItem={docItem}
                              key={"_docItem_" + contactkey}
                              contactkey={contactkey}
                              onRename={(data) => { renameTemp(data) }}
                              onEdit={(data) => { setConvertionMode("1"); navigateTo(data) }}
                              onDelete={(data) => { setConfirmBoth(true); setTdeleteItem(data); handleDeleteTemplate(data) }}
                              useThisTemplate={(data) => { useTemplateHandlerClick(data) }}
                              makeCopy={() => makeCopy(docItem)}
                              canEdit={canEdit}
                            />
                          ))}
                        </Row>
                      </div>
                    ))}
                  </>}
                </>
              )} */}

              {
                 gridView == "list" &&
                <Row>
                  <Col lg="12" className="">
                    <TableContainer
                      columns={templateColumns}
                      data={auditData}
                      isGlobalFilter={false}
                      isAddOptions={false}
                      isJobListGlobalFilter={false}
                      customPageSize={10}
                      style={{ width: '100%' }}
                      iscustomPageSizeOptions={false}
                      isPagination={true}
                      filterable={false}
                      tableClass="align-middle table-nowrap table-check"
                      theadClass="table-light"
                      paginationDiv="col-sm-12 col-md-7"
                      pagination="pagination justify-content-end pagination-rounded my-2"
                      canEdit={canEdit}
                    />
                  </Col>
                </Row>
              }

            </CardBody>
          </Card>


              {console.log('btnLoad :>> ', btnLoad)}
          <Modal isOpen={modal}>
            <ModalHeader toggle={toggle} tag="h5">
              {
                isEdit && convertionMode === "0"
                  ? "Rename Template"
                  : !isEdit && convertionMode === "2"
                    ? "Use Template as"
                    : convertionMode === "3"
                      ? "Make a Copy"
                      : "Add New Template"
              }
            </ModalHeader>
            <ModalBody>
              <AvForm onValidSubmit={handleValidAuditSubmit} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }} >
                <Row>
                  <Col className="col-12">
                    <div className="mb-3">
                      <Label htmlFor="autoSizingSelect">
                        {
                          convertionMode === "2"
                            ? "Audit Name"
                            : convertionMode === "3"
                              ? "Copy Name"
                              : "Template Name"
                        }
                      </Label>
                      <span className="text-danger" style={{ fontSize: "smaller" }}>*</span>
                      <AvField
                        name="template_name"
                        type="textarea"
                        onChange={(e) => handleTemplateNameChange(e.target.value)}
                        value={templateName || ''}
                        errorMessage="Please fill this Input"
                        validate={{ required: { value: true } }}
                        placeholder={convertionMode === "2"
                          ? "Enter Audit Name"
                          : convertionMode === "3"
                            ? "Enter Copy Name"
                            : "Enter Template Name"}
                      />
                      {
                        auditNameExist &&
                        <div className="text-danger" style={{ fontSize: 'smaller' }}>
                          This name already exists, give another name.
                        </div>
                      }
                    </div>
                  </Col>
                 
                  { convertionMode !== "2" &&
                    <Col className="col-12">
                      <div className="mb-3">
                        <Label htmlFor="categorySelect">Select Category</Label>
                        <span className="text-danger" style={{ fontSize: "smaller" }}>*</span>

                        <AvField
                          type="select"
                          name="category"
                          value={category || ''}
                          onChange={(e) => handleSelectCategory(e)}
                          validate={{ required: { value: true, errorMessage: "Please select a category" } }}
                        >
                          <option value="" disabled> Select </option>
                          <option value="add_new" style={{ fontWeight: "bold", color: "blue" }}> + Add New Category </option>
                          {categoryList.map((cat, index) => (
                            <option key={index} value={cat.cat_name}> {cat.cat_name} </option>
                          ))}
                        </AvField>

                        {showAddCategoryInput && (
                          <AvField name="new_category_name" type="text" errorMessage="Please enter category name" validate={{ required: { value: true } }} onChange={(e) => handleCategoryInputChange(e.target.value)} />
                        )}
                      </div>
                    </Col>
                  }


                  <Col className="col-12">
                    <div className="mb-3">
                      <Label>Description</Label>
                      <AvField name="template_info" type="textarea" placeholder= 'Enter Description' value={templateInfo || ''}/>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <div className="text-end">
                      <button type="submit" className="btn btn-sm btn-outline-success save-user w-sm" disabled={btnLoad || auditNameExist} >
                        {btnLoad && <LoadingOutlined />}
                        {
                          btnLoad
                            ? "..."
                            : isEdit && convertionMode !== '3'
                              ? "Update"
                              : convertionMode === "3"
                                ? "Create Copy"
                                : "Save"
                        }
                      </button>
                    </div>
                  </Col>
                </Row>
              </AvForm>
            </ModalBody>
          </Modal>
          

        </Container>
      </div>
    </React.Fragment>
  );


}



TemplateLibrary.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(TemplateLibrary);
