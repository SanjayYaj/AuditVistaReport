import React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TableContainer from './Components/TableContainer';

import { setReportUser, setSelectedReportUser, publishSelectedUser, getUserList , retrieveTemplateUsers } from '../../Slice/reportd3/reportslice';
import { retrieveUserListAPI, setUserList, deleteUserInfo, userStatus, userNewPassword } from '../../Slice/ReportUserSlice'

import MetaTags from 'react-meta-tags';
import { Container, Row, Col, Card, CardBody, Button, Spinner } from 'reactstrap'
import { Link ,useHistory, useNavigate} from 'react-router-dom';
import Swal from "sweetalert2";
import urlSocket from "../../helpers/urlSocket";

const ReportUser = () => {
    const [authuser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
    const [pageInfo, setpageInfo] = useState(JSON.parse(sessionStorage.getItem("page_data")))
    const [selectedId, setselectedId] = useState([])
    const [reportUsers, setreportUsers] = useState([])
    const dispatch = useDispatch()
    const reportSlice = useSelector(state => state.reportSliceReducer)
    // const history = useHistory()
    const navigate  = useNavigate()
    // const reportUsers = reportSlice.reportUsers
    const selectedReportUser = reportSlice.selectedReportUser
    const authInfo = useSelector((state) => state.auth);
    const dbInfo = authInfo.db_info

const list = useSelector((state1) => state1.ReportUserSlice);
console.log('list :>> ', list);
    const page_data = JSON.parse(sessionStorage.getItem("page_data"))
    console.log('page_data :>> ', page_data);
    useEffect(() => {
        const fetchUserList = async () => {
            try {
                let show_all;
                if (authuser && authuser.user_data.created_by === null) {
                    show_all = true;
                } else {
                    show_all = false;
                }

                const response = await dispatch(retrieveUserListAPI( { db_info: authuser.db_info , user_id : authuser.user_data._id , show_all } ))
                console.log('authUser getUserList :>> ', authuser);
                    console.log('response  46:>> ', response);
                  
                if (response) {
                    // dispatch(setUserList(response.data))
                    console.log('fetching userlist:', response.user_list);
                    setreportUsers(response.user_list);
                }
            } catch (error) {
                console.error('Error fetching userlist:', error);
            }
        };


        const fetchTemplateUsers = async ( page_data ) => {
            try {
                const response = await dispatch(retrieveTemplateUsers( page_data._id  , dbInfo))
                if (response) {
                    console.log('fetching Template Users:', response.data);

                    const preSelectedUsers = response.data.map(user => ({
                        _id: user.user_id,
                        username: user.user_name,
                        email_id: user.user_name,
                    }));

                    console.log('preSelectedUsers :>> ', preSelectedUsers);
                    setSelectedRowIds(preSelectedUsers); 

                }
            } catch (error) {
                console.error('Error fetching Template Users:', error);
            }
        };



        fetchUserList();
        fetchTemplateUsers( page_data )
    }, [])






    const selectUser = (row, index) => {
        var selected_user = []
        const userInfo = reportUsers.map(user => {
            if (user._id === row._id) {
                if (row.selected) {
                    selected_user.push(user)
                }
                return { ...user, selected: row.selected };
            }
            if (user.selected) {
                selected_user.push(user)
            }
            return user;
        });

        var getIndex = selectedId.indexOf(row._id)
        if (getIndex === -1) {
            selectedId.push(row._id)
        }
        else {
            selectedId.splice(getIndex, 1)
        }
        dispatch(setReportUser(userInfo))
        dispatch(setSelectedReportUser(selected_user))
        setselectedId(selectedId)
    }

    const addselectedUser = async () => {

        Swal.fire({
            icon: 'warning', // You can use 'warning', 'error', or any other appropriate icon
            title: 'Publish Confirmation',
            text: 'Are you sure you want to publish this Report for Selected users?', // Customize the confirmation message
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Publish',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if(result.isConfirmed){
                console.log('selectedRowIds :>> ', selectedRowIds)
                console.log('pageInfo :>> ', pageInfo)
                console.log('authuser :>> ', authuser);
                console.log('dbInfo :>> ', dbInfo);
                dispatch(publishSelectedUser(selectedRowIds,pageInfo,authuser , dbInfo ,  navigate))
            }
        })
    }


    const selectAllFun = (isSelect, rows, e, mode) => {
        let selectedEOPT = [];
        let selected_id = [];
        if (isSelect) {
            selectedEOPT = rows;
            rows.forEach((data) => {
                selected_id.push(data._id);
            });
        }
        dispatch(setSelectedReportUser(selectedEOPT))
        setselectedId(selected_id)
    }


    // const columns = [
    //     {
    //         Header: (cellProps) =>
    //             <div className="form-check font-size-16" >
    //                 <input
    //                     className="form-check-input"
    //                     onChange={() => {
    //                         const allSelected = cellProps.page.every((row) => row.original.selected);
    //                         const updatedPage = cellProps.page.map(row => ({
    //                             ...row,
    //                             original: {
    //                                 ...row.original,
    //                                 selected: !allSelected
    //                             }
    //                         }));
    //                         dispatch(setReportUser(_.map(updatedPage, "original")))
    //                         selectAllFun(!allSelected, _.map(updatedPage, "original"), "e", '1')
    //                     }}
    //                     type="checkbox"
    //                     checked={cellProps.page.length > 0 && cellProps.page.every((row) => row.original.selected)}
    //                     id="checkAll"
    //                 />
    //                 <label className="form-check-label" htmlFor="checkAll"></label>
    //             </div>,
    //         accessor: '#',
    //         width: '10%',
    //         filterable: true,
    //         isSort: false,
    //         Cell: ({ row }) => (
    //             <div className="form-check font-size-16" >
    //                 <input className="form-check-input" checked={row.original.selected} type="checkbox" onChange={(e) => {
    //                     const updatedRow = { ...row.original, selected: !row.original.selected };
    //                     selectUser(updatedRow, row.index)
    //                 }}
    //                     id="checkAll" />
    //                 <label className="form-check-label" htmlFor="checkAll"></label>
    //             </div>
    //         )
    //     },

    //     {
    //         accessor: 'username',
    //         Header: <span className="">Name</span>,
    //         filterable: true,
    //         width: "30%",
    //         Cell: (cellProps) => {
    //             var item = cellProps.row.original
    //             return (
    //                 <div className="fw-bold">
    //                     <span style={{ fontSize: '13px', color: '#848484' }}>{item.username}</span>

    //                 </div>


    //             )

    //         }
    //     },
    //     {
    //         accessor: 'email_id',
    //         Header: <span className="">Email ID</span>,
    //         filterable: true,
    //         width: "15%",
    //         Cell: (cellProps) => {
    //             var item = cellProps.row.original
    //             return (
    //                 <>
    //                     <div className=" text-secondary">
    //                         <span style={{ fontSize: '13px', color: '#848484' }}>{item.email_id}</span>
    //                     </div>
    //                 </>
    //             )

    //         }
    //     },
    //     {
    //         accessor: 'role',
    //         Header: <span className="">Role Info</span>,
    //         filterable: true,
    //         width: "15%",
    //         Cell: (cellProps) => {
    //             var item = cellProps.row.original
    //             return (
    //                 <>
    //                     <div className=" text-secondary">
    //                         <span style={{ fontSize: '13px', color: '#848484' }}>{item.role}</span>
    //                     </div>
    //                 </>


    //             )

    //         }
    //     }

    // ]





    const handleRowSelection = ( rowData ) => {
        // var rowId = row.original._id
        // var rowData = row.original
        console.log('rowData :>> ', rowData);
        var Selecteds
        setSelectedRowIds((prev) => {
            const isSelected = prev.some((user) => user._id === rowData._id);
            if (!isSelected) {
                return [...prev, { _id: rowData._id, username: rowData.username, email_id: rowData.email_id }];
            } else {
                return prev.filter((user) => user._id !== rowData._id);
               }
        });
        setIsAllSelected(false);
    };






    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const MAX_SELECTION = 3;


    useEffect(()=>{
        console.log('selectedRowIds :>> ', selectedRowIds);
        
        } , [ selectedRowIds ])


    const columns = useMemo(
        () => [
          {
            Header: () => (
              <div>
                <h5 className="font-size-14 mb-1">
                  <span>{'Select'}</span>
                </h5>
              </div>
            ),
            id: 'selection',
            disableFilters: true,
            filterable: false,
            Cell: ({ row }) => {
            //   const isSelected = selectedRowIds.includes(row.original._id);
            const isSelected = selectedRowIds.some((user) => user._id === row.original._id);
            //   const disableCheckbox = selectedRowIds.length >= MAX_SELECTION && !isSelected;
              return (
                <div>
                  <input
                    type="checkbox"
                    defaultChecked={isSelected}
                    onChange={() => handleRowSelection(row.original )}
                    // disabled={disableCheckbox}
                    style={{
                      width: '16px',
                      height: '16px',
                      background: isSelected ? '#4caf50' : '#fff',
                      border: `2px solid ${isSelected ? '#4caf50' : '#ccc'}`,
                    }}
                  />
                </div>
              );
            },
            width: 60,
          },

          {
            accessor: 'fullname',
            Header: 'Name',
            filterable: true,
            isSort: true,
            Cell: ({ value }) => <span className="fw-bold text-truncate font-size-12 d-block">{value}</span>,
          },


          {
            accessor: 'email_id',
            Header: 'Email-ID',
            filterable: true,
            isSort: true,
            Cell: ({ value }) => <span className="fw-bold text-truncate font-size-12 d-block">{value}</span>,
          },



          {
            accessor: 'role_info[0].role_name',
            Header: 'Roles',
            filterable: true,
            isSort: true,
            Cell: ({ value }) => <span className="fw-bold text-truncate font-size-12 d-block">{value}</span>,
          },

          {
            accessor: 'designation',
            Header: 'Designation',
            filterable: true,
            isSort: true,
            Cell: ({ value }) => {
                const deptNames = Array.isArray(value)
                    ? value.map((desgn) => desgn?.desgn_name).filter(Boolean).join(', ')
                    : '';
                return <span className="fw-bold text-truncate font-size-12 d-block">{deptNames}</span>;
            },          },



            {
                accessor: 'dept_id',
                Header: 'Departments',
                filterable: true,
                isSort: true,
                Cell: ({ value }) => {
                    const deptNames = Array.isArray(value)
                        ? value.map((dept) => dept?.dept_name).filter(Boolean).join(', ')
                        : '';
                    return <span className="fw-bold text-truncate font-size-12 d-block">{deptNames}</span>;
                },
            },


    
         
    
         
    
        
         
        ], [selectedRowIds, isAllSelected]
      );




    return (<React.Fragment>
        <div className="page-content">
            <MetaTags>
                <title>AuditVista | Manage Users</title>
            </MetaTags>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }} className="mb-1">
                <div style={{ width: '80%', padding: '0 20px' }}>Publishing</div>
                <div style={{ width: '20%', padding: '0 20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={"/report"}><Button color="primary">Back <i className="mdi mdi-arrow-left"></i></Button></Link>
                </div>
            </div>
            <Container fluid>
                <Breadcrumbs title="Report Users" breadcrumbItem="Report Users" />
                {
                    console.log('reportUsers :>> ', reportUsers)
                }
                <Row>
                    {
                        reportUsers ?
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        <TableContainer
                                            data={reportUsers}
                                            columns={columns}
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
                                            showBtn ={false}

                                        />
                                        {
                                            selectedRowIds.length > 0 &&
                                            <div className="mt-4 d-grid">
                                                <button
                                                    className="btn btn-danger btn-block"
                                                    type="submit"
                                                    onClick={() => { addselectedUser() }}
                                                >
                                                    Publish Report for Selected Users
                                                </button>
                                            </div>

                                        }
                                    </CardBody>
                                </Card>

                            </Col>
                            :
                            <Col lg="12">
                                <Card>
                                    <CardBody style={{ height: "100vh" }}>
                                        <div className="d-flex flex-column justify-content-center align-items-center">
                                            <div>Loading...</div>
                                            <Spinner className="ms-2" color="primary" />
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                    }
                </Row>
            </Container>
        </div>
    </React.Fragment>);
}


// #endregion

export default ReportUser;