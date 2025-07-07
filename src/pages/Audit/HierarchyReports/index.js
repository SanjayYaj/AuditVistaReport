import React, { useEffect, useState,useMemo } from 'react'
import urlSocket from '../../../helpers/urlSocket'
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import { Container,Row,Col,Card,CardBody, Button, Spinner, UncontrolledTooltip } from 'reactstrap'
import TableContainer from './Components/TableContainer'
import { useNavigate} from 'react-router-dom'
import MetaTags from 'react-meta-tags';


 const HReports = () => {

    const [authUser,setAuthUser]= useState(JSON.parse(sessionStorage.getItem("authUser")))
    const [auditList,setAuditList] = useState([])
    const [apiRequestLoad,setApiRequestLoad] = useState(true)
    const navigate = useNavigate()

    useEffect(()=>{
        fetchUserHierarchyAudits()
    },[])


    const fetchUserHierarchyAudits=async()=>{

        try {
           
          const responseData = await urlSocket.post("hreport/get-huser-audits",{
                encrypted_db_url : authUser.db_info.encrypted_db_url,
                user_id : authUser.user_data._id
            },
        
        )
             console.log(responseData,'responseData')
             setApiRequestLoad(false)
             if(responseData.data.response_code === 500){
                setAuditList(responseData.data.data)
             }
           
        } catch (error) {
            
        }
    }


    const AuditColumns = useMemo(
        () => [
            {
                accessor: "template_name",
                Header: "Audit Name",
                filterable: true,
                width: '50%',
                Cell: (cellProps) => {
                    var item = cellProps.row.original;
                    return (
                        <div className="fw-bold font-size-12">
                            {item.template_name}
                        </div>

                    )
                }
            },
            {
                accessor: "repeat_mode",
                Header: "Schedule Type",
                filterable: true,
                Cell: (cellProps) => {
                    var item = cellProps.row.original;
                    return (
                        <div className="font-size-11" style={{ cursor: "pointer" }} >
                            <span className={item.repeat_mode_config.mode_id === "1" ? "badge badge-soft-warning font-size-11 m-1" : "badge badge-soft-success font-size-11 m-1" }>
                                {item.repeat_mode_config.mode_id === "1"?  "Daily" : "One Time" }
                            </span>
                        </div>

                    )
                }
            },
            {
                accessor: "Action",
                Header: "Action",
                Cell: (cellProps) => {
                    var item = cellProps.row.original;
                    return (
                        <div className="d-flex gap-1">
                            {item.repeat_mode_config.mode_id === "0" && (
                                <>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-soft-primary"
                                        id={`report-btn-${item._id}`}
                                        onClick={() => {
                                            navigate("/hcharts");
                                            sessionStorage.setItem("hreport_data", JSON.stringify({
                                                _id: item._id,
                                                mode: item.repeat_mode_config.mode_id,
                                                h_id: item.hlevel_id,
                                            }));
                                        }}
                                    >
                                      View Report
                                    </button>
                                </>
                            )}

                            <>
                                <button
                                    type="button"
                                    className={`d-flex align-items-center btn btn-sm btn-soft-${item.repeat_mode_config.mode_id === "0" ? "primary" : "secondary"}`}
                                    id={`detail-btn-${item._id}`} // Unique ID for Tooltip
                                    onClick={() => {
                                        if (item.repeat_mode_config.mode_id === "0") {
                                            navigate("/hendpoints");
                                            sessionStorage.setItem("publishedHInfoAuditData", JSON.stringify(item));
                                        } else {
                                            navigate("/hdaily-audits");
                                            sessionStorage.setItem("hdaily_data", JSON.stringify({
                                                _id: item._id,
                                                mode: item.repeat_mode_config.mode_id,
                                                h_id: item.hlevel_id,
                                            }));
                                        }
                                    }}
                                >
                                    {item.repeat_mode_config.mode_id === "0" ? <i className={`bx bx-right-arrow-alt font-size-14`}></i> : 'View Audits'}
                                </button>
                                {item.repeat_mode_config.mode_id === "0" &&
                                <UncontrolledTooltip placement="top" target={`detail-btn-${item._id}`}>
                                     View Details
                                </UncontrolledTooltip>
                }
                            </>
                        </div>
                    )
                }



            }

        ],[auditList]
    )



     if (!apiRequestLoad) {
         return (
             <React.Fragment>
                 <div className='page-content'>
                     <MetaTags> <title>Reports | AuditVista</title> </MetaTags>
                     <Breadcrumbs title="Hierarchy Reports" breadcrumbItem="Hierarchy Reports" />
                     <Container fluid={true}>
                                 <Card>
                                     <CardBody>
                                         <TableContainer
                                             columns={AuditColumns}
                                             data={auditList}
                                             isGlobalFilter={true}
                                             isAddOptions={false}
                                             isJobListGlobalFilter={false}
                                             isPagination={true}
                                             iscustomPageSizeOptions={false}
                                             isShowingPageLength={false}
                                             customPageSize={10}
                                             tableClass="align-middle table-nowrap table-check"
                                             theadClass="table-light"
                                             pagination="pagination pagination-rounded justify-content-end mt-2"
                                         />
                                     </CardBody>



                                  
                                 </Card>
                            
                     </Container>

                 </div>


             </React.Fragment>
         )
     } else {
         return (
             <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
                 <div>Loading...</div>
                 <Spinner color="primary" />
             </div>
         );
     }
}
export default HReports
