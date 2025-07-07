
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row, Spinner, ncontrolledTooltip, Label, Modal, ModalHeader, ModalBody, Input, FormFeedback, Form } from "reactstrap";
import MetaTags from 'react-meta-tags';
import urlSocket from '../../../helpers/urlSocket';
import RoleTableContainer from './Component/TableContainer';
import _ from 'lodash';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { usePermissions } from 'hooks/usePermisson';


const ManageRoles = () => {

    const { canView, canEdit } = usePermissions("mroles");

    const navigate = useNavigate();
    const [rolesInfo, setRolesInfo] = useState([]);
    const [searchFiles, setSearchFiles] = useState([]);
    const [dupSearchFiles, setDupSearchFiles] = useState([]);
    const [tempSearchFiles, setTempSearchFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusBasedFilteredData, setStatusBasedFilteredData] = useState([]);
    const [dataloaded, setDataloaded] = useState(false);
    const [entitiesAuditData, setEntitiesAuditData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = JSON.parse(sessionStorage.getItem('authUser'));
            const userFacilities = JSON.parse(sessionStorage.getItem("user_facilities"));
           
                try {
                    const response = await urlSocket.post('cog/manage-roles', {
                        encrypted_db_url: data.db_info.encrypted_db_url,
                        user_id: data.user_data._id,
                        show_all: data.user_data.created_by === null
                    });
                    if (response.data.response_code === 500) {
                        setRolesInfo(response.data.data);
                        setStatusBasedFilteredData(response.data.data);
                        setSearchFiles(response.data.data);
                        setDupSearchFiles(response.data.data);
                        setTempSearchFiles(response.data.data);
                        setDataloaded(true);
                    }
                } catch (error) {
                    console.error(error);
                }
            
        };

        fetchData();
    }, [navigate]);



    const getdata = useCallback((data) => {
        sessionStorage.setItem('role_id', data._id);
        navigate('/createroles');
    }, [navigate]);


    const filterStatus = (data) => {
        let filteredData;
        if (data === "In active") {
            filteredData = _.filter(entitiesAuditData, { "active": "0" });
        } else if (data === "Active") {
            filteredData = _.filter(entitiesAuditData, { "active": "1" });
        } else {
            filteredData = entitiesAuditData;
        }
        setStatusBasedFilteredData(filteredData);
    };

    const completedStatus = (data) => {
        return data
            ? [{ status: "Active", color: "#fbae17", badgeClass: "success" }]
            : [{ status: "In active", color: "#303335", badgeClass: "danger" }];
    };


    const pageClick = (currentPage) => {
        setCurrentPage(currentPage);
        paginationProcess();
    };

    const paginationProcess = () => {
    };

    const getFuzzySearch = (search_files) => {
        console.log('search_files', search_files);
        setStatusBasedFilteredData(search_files);
        setSearchFiles(search_files);
        setDupSearchFiles(tempSearchFiles);
        pageClick(currentPage);
    };


    const columns = useMemo(() => [
        {
            accessor: 'role_name',
            Header: 'Role Name & Responsibilities',
            width: "80%",
            Cell: ({ row }) => {
                const item = row.original;
                const itemStatus = completedStatus(item.role_status)[0];
                const screens = item.facilities.map((facility) => facility.interfacename).join(" | ");

                return (
                    <div className="d-flex flex-row align-items-center">
                        <div className="me-2">
                            <i className={`mdi ${itemStatus.badgeClass === "success" ? "mdi-checkbox-marked-circle-outline" : "mdi-circle-slice-8"} font-size-15 text-${itemStatus.badgeClass}`} />
                        </div>
                        <div className="d-flex flex-column flex-wrap">
                            <div className={`font-size-13 fw-bold text-buttonPrimaryE `} >{item.role_name}</div>
                            <div className="font-size-10 text-secondary" style={{minWidth:"50%"}}>{screens}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessor: "fullname",
            Header: "Created By",
            filterable: true,
            width:"10%",
            Cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="font-size-11" >
                        {item.fullname || "-"}
                    </div>
                );
            }
        },
        {
            accessor: 'role_status',
            Header: 'Status',
            width: "10%",
            Cell: ({ row }) => {
                const itemStatus = completedStatus(row.original.role_status)[0];
                return (
                    <span className={`font-size-10 badge badge-soft-${itemStatus.badgeClass} text-${itemStatus.color}`}>{itemStatus.status}</span>
                );
            },
        },
        // {
        //     accessor: "menu",
        //     Header: "Edit/ Modify Role",
        //     Cell: ({ row }) => (
        //         canEdit ? (
        //             <button
        //                 type="button"
        //                 className="btn btn-sm btn-soft-primary d-flex align-items-center"
        //                 onClick={() => getdata(row.original)}
        //             >
        //                 <i className="bx bx-edit-alt align-middle me-2"></i> Edit Role
        //             </button>
        //         ) : null
        //     ),

        // },
        ...(canEdit
            ? [{
                accessor: "menu",
                Header: "Action",
                width: "10%",
                Cell: ({ row }) => (
                    <button
                        type="button"
                        className="btn btn-sm btn-soft-primary d-flex align-items-center"
                        onClick={() => getdata(row.original)}
                    >
                        <i className="bx bx-edit-alt align-middle me-2"></i> Edit Role
                    </button>
                ),
            }]
            : []),
    ], [rolesInfo]);

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Manage Roles | AuditVista</title>
                </MetaTags>
                <Breadcrumbs title="Roles" breadcrumbItem="Roles" />
                <Container fluid>
                    <Row>
                        <Col lg={12} >
                            {dataloaded ? (
                                <Card style={{ minHeight: "78vh" }}>
                                    <CardBody>
                                        <RoleTableContainer
                                            columns={columns}
                                            data={statusBasedFilteredData}
                                            isGlobalFilter
                                            isAddOptions={false}
                                            isJobListGlobalFilter={false}
                                            customPageSize={10}
                                            dynamicBtn
                                            btnClick={() => { sessionStorage.removeItem('role_id'); navigate('/createroles'); }}
                                            btnName={"Add New Role"}
                                            tableClass="align-middle table-nowrap table-check table-striped-columns table-hover"
                                            theadClass="table-light"
                                            pagination="pagination pagination-rounded justify-content-end my-2"
                                        />
                                    </CardBody>
                                </Card>
                            ) : (
                                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
                                    <div>Loading...</div>
                                    <Spinner color="primary" />
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

ManageRoles.propTypes = {};
ManageRoles.defaultProps = {};

export default ManageRoles;
