import React, { useState ,useEffect, useMemo } from "react";
import MetaTags from 'react-meta-tags';
import {
   Card, CardBody, Container, UncontrolledTooltip, Spinner
} from "reactstrap";
import TableContainer from "../../../common/TableContainer";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
const _ = require('lodash')
import urlSocket from "../../../helpers/urlSocket";
import { useNavigate } from "react-router-dom";

const UserAudit = (props) => {



    const navigate = useNavigate();

    const [dataloaded, setDataloaded] = useState(false);
    const [search_files, setSearchFiles] = useState([]);
    const [dup_search_files, setDupSearchFiles] = useState([]);
    const [temp_search_files, setTempSearchFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [items_per_page, setItemsPerPage] = useState(10);
    const [dupAuditData, setDupAuditData] = useState([]);
    const [auditData, setAuditData] = useState([]);
    const [configData, setConfigData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [db_info, setDbInfo] = useState(null);
  
  useEffect(() => {

    const getSessionData = async () => {
      const data = JSON.parse(sessionStorage.getItem("authUser"));
      const db_info = JSON.parse(sessionStorage.getItem("db_info"));
      setConfigData(data.config_data);
      setUserData(data.user_data);
      setDbInfo(db_info);
      getUserAudit(data.user_data, db_info);

    };

    getSessionData();
  }, []);


  
    const getUserAudit = (userInfo, db_info) => {
      try {
        urlSocket.post("webpbdadtdta/getuseraudit", {
          userInfo: {
            _id: userInfo._id,
            encrypted_db_url: db_info.encrypted_db_url,
            user_code: userInfo.user_code,
            company_id: userInfo.company_id
          }
        })
          .then(response => {
            console.log(response,'response');
            if (response.data.response_code === 500) {
              setDupAuditData(response.data.data);
              setAuditData(response.data.data);
              setDataloaded(true);
              setSearchFiles(response.data.data);
              setDupSearchFiles(response.data.data);
              setTempSearchFiles(response.data.data);
              pageClick(1);
            }
          });
      } catch (error) {
        console.log("catch error", error);
      }
    };
  
    const loadEndpoints = (audit) => {
      sessionStorage.removeItem("auditData");
      sessionStorage.setItem("auditData", JSON.stringify(audit));
      navigate("/usrenpdts");
    };
  
    const showReport = (audit) => {
      sessionStorage.removeItem("auditData");
      sessionStorage.setItem("auditData", JSON.stringify(audit));
      navigate("/usrrprt");
    };
  
    const pageClick = (currentPage) => {
      setCurrentPage(currentPage);
      paginationProcess(currentPage);
    };
  
    const paginationProcess = (currentPage) => {
      const result = search_files.slice((currentPage - 1) * items_per_page, (currentPage - 1) * items_per_page + items_per_page);
      if (result.length > 0) {
        setAuditData(result);
      } else {
        setAuditData(search_files);
      }
    };
  
    const getFuzzySearch = (search_files) => {
      setAuditData(search_files);
      setSearchFiles(search_files);
      setDupSearchFiles(temp_search_files);
      pageClick(currentPage);
    };
  
  
  
    const columns = useMemo(() => [
        {
            accessor: 'audit_pbd_name',
            Header: 'Audit',
            filterable: true,
            width: '35%',
            Cell: (cellProps) => {
                const item = cellProps.row.original;
                return (
                    <div className="fw-bold font-size-12">
                        {item.audit_pbd_name}
                    </div>
                );
            }
        },
        {
            accessor: 'started_on',
            Header: 'Starts On',
            disableFilters: true,
            width: '5%',
            Cell: (cellProps) => {
                const item = cellProps.row.original;
                return (
                    <>
                        {item.audit_pbd_start_on !== null && item.audit_pbd_start_on !== undefined ? (
                            <div className="font-size-11">
                                {new Intl.DateTimeFormat('en-GB', {
                                    month: 'short', day: '2-digit', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'IST'
                                }).format(new Date(item.audit_pbd_start_on))}
                            </div>
                        ) : (
                            <div className="font-size-11">
                                {new Intl.DateTimeFormat('en-GB', {
                                    month: 'short', day: '2-digit', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'IST'
                                }).format(new Date(item.audit_pbd_start_on))}
                            </div>
                        )}
                    </>
                );
            }
        },
        {
            accessor: 'completed_on',
            Header: 'Ends On',
            disableFilters: true,
            width: '5%',
            Cell: (cellProps) => {
                const item = cellProps.row.original;
                return (
                    <>
                        {item.audit_pbd_ends_on !== null && item.audit_pbd_ends_on !== undefined && (
                            <div className="font-size-11">
                                {new Intl.DateTimeFormat('en-GB', {
                                    month: 'short', day: '2-digit', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'IST'
                                }).format(new Date(item.audit_pbd_ends_on))}
                            </div>
                        )}
                    </>
                );
            }
        },
        {
            accessor: '',
            Header: 'Status',
            disableFilters: true,
            style: { width: '50%' },
            Cell: (cellProps) => {
                const item = cellProps.row.original;
                return (
                    <>
                        <div className="d-flex gap-3 mb-3">
                            <div className={"font-size-11 badge badge-soft-dark bg-none"} style={{ borderRadius: "2px" }}>
                                Total: {String(item.total)}
                            </div>
                            <div className={"font-size-11 badge badge-soft-secondary badge"} style={{ borderRadius: "2px" }}>
                                Not Started: {String(item.not_started)}
                            </div>
                            <div className={"font-size-11 badge badge-soft-warning badge"} style={{ borderRadius: "2px" }} >
                                In-progress: {String(item.in_progress)}
                            </div>
                        </div>
                        <div className="d-flex gap-3">
                            <div className={"font-size-11 badge badge-soft-success"} style={{ borderRadius: "2px" }} >
                                Completed: {String(item.completed)}
                            </div>
                            <div className={"font-size-11 badge badge-soft-info"} style={{ borderRadius: "2px" }} >
                                Submitted: {String(item.submitted)}
                            </div>
                            <div className={"font-size-11 badge badge-soft-danger"} style={{ borderRadius: "2px" }} >
                                Retake: {String(item.retake)}
                            </div>
                            <div className={"font-size-11 badge badge-soft-primary"} style={{ borderRadius: "2px" }} >
                                Reviewed: {String(item.reviewed)}
                            </div>
                        </div>
                    </>
                );
            }
        },
        {
            accessor: "menu",
            disableFilters: true,
            Header: "View Details ",
            width: '5%',
            Cell: (cellProps) => {
                const item = cellProps.row.original;
                return (
                    <div>
                        <button
                            type="button"
                            className={`btn btn-sm btn-soft-primary d-flex align-items-center`}
                            id={`detail-btn-${item._id}`}
                            onClick={() => loadEndpoints(item)}
                        >
                            <i className='bx bx-right-arrow-alt font-size-14'></i>
                        </button>
                        <UncontrolledTooltip placement="top" target={`detail-btn-${item._id}`}>
                            View Details
                        </UncontrolledTooltip>
                    </div>
                );
            }
        }
    ], [dupAuditData]);
     

      if (!dataloaded) {
      return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div>Loading...</div>
          <Spinner color="primary" />
        </div>
      );
    }
  
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>User Audits | AuditVista</title>
          </MetaTags>
          <Breadcrumbs
            title="Audits"
            isBackButtonEnable={false}
          />
          <Container fluid>
            <Card>
              <CardBody>
                <TableContainer
                  columns={columns}
                  data={dupAuditData}
                  isGlobalFilter={true}
                  isAddOptions={false}
                  isJobListGlobalFilter={false}
                  customPageSize={10}
                  style={{ width: '100%' }}
                  isPagination={true}
                  filterable={false}
                  tableClass="align-middle table-nowrap table-check"
                  theadClass="table-light"
                  pagination="pagination pagination-rounded justify-content-end my-2"
                />
              </CardBody>
            </Card>
          </Container>
        </div>
      </React.Fragment>
    );
  };
  
  export default UserAudit;