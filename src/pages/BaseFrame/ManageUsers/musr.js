import React, { useEffect, useMemo, useState } from "react"
import {
    Container, Row, Col, Card, CardBody, Button,
    Modal, ModalHeader, ModalBody, Label,
    Spinner, UncontrolledTooltip
} from "reactstrap";
import Swal from 'sweetalert2';
import TableContainer from "./Components/TableContainer";
import { AvForm, AvField } from "availity-reactstrap-validation"
import _ from "lodash";
import FuzzySearch from '../../../common/FuzzySearch';
import { LoadingOutlined } from '@ant-design/icons';
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import urlSocket from "../../../helpers/urlSocket";
import { useNavigate } from "react-router-dom";
import { usePermissions } from 'hooks/usePermisson';
import CryptoJS from 'crypto-js'
import { useGroupValidation } from "utils/useGroupValidation"; 



const UserLists = () => {


    const navigate = useNavigate();   
    const { canView, canEdit } = usePermissions("murs");
    

    const [dataloaded, setDataloaded] = useState(false);
    const [auditStatusData, setAuditStatusData] = useState([
        { status: "Active Users", count: 0, color: "#fbae17", id: "1", badgeClass: "success" },
        { status: "In active Users", count: 0, color: "#303335", id: "0", badgeClass: "danger" },
    ]);
    const [resultData, setResultData] = useState([]);
    const [ddchange, setDdchange] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(true);
    const [secretKey, setSecretKey] = useState('Pkdh347ey%3Tgs');
    const [rolesInfo, setRolesInfo] = useState([]);
    const [groupNameExist, setGroupNameExist] = useState(false);
    const [selectedEOPT, setSelectedEOPT] = useState([]);
    ////console.log('selectedEOPT', selectedEOPT)
    const [height, setHeight] = useState(window.innerHeight);
    const [searchFiles, setSearchFiles] = useState([]);
    const [dupSearchFiles, setDupSearchFiles] = useState([]);
    const [tempSearchFiles, setTempSearchFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isSaving, setIsSaving] = useState(false);
    const [btnLoad, setBtnLoad] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [show1, setShow1] = useState(true);
    const [searchGroupName, setSearchGroupName] = useState([]);
    const [dupSearchGroupName, setDupSearchGroupName] = useState([]);
    const [dupLabelData, setDupLabelData] = useState([]);
    const [dupTempSearchGroup, setDupTempSearchGroup] = useState([]);
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [clientInfo, setClientInfo] = useState(null);
    const [dbInfo, setDbInfo] = useState(null);
    const [configData, setConfigData] = useState(null);
    const [hlData, setHlData] = useState("");
    const [dataSource, setDataSource] = useState([]);
    const [entitiesAuditData, setEntitiesAuditData] = useState([]);
    const [statusBasedFilteredData, setStatusBasedFilteredData] = useState([]);
    const [totalEntities, setTotalEntities] = useState(0);
    const [labelDefault, setLabelDefault] = useState(true);
    const [showSelected, setShowSelected] = useState('');
    const [selectedLabel, setSelectedLabel] = useState('');
    const [labelWindow, setLabelWindow] = useState(false);
    const [tableDataloaded, setTableDataloaded] = useState(false);
    const [allowTableRowToSelect, setAllowTableRowToSelect] = useState(false);
    const [label, setLabel] = useState({ endpoints: [] });

    const [labelState, setLabelState] = useState([]);
    // const [labelState, setLabelState] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmBoth, setConfirmBoth] = useState(false);

    const [position, setPosition] = useState(false);
    const [successDlg, setSuccessDlg] = useState(false)
    const [dynamicTitle, setDynamicTitle] = useState("")
    const [dynamicDescription, setDynamicDescription] = useState("")
    const [errorDlg, setErrorDlg] = useState(false)

    const [selectedRows, setSelectedRows] = useState([]);
    const { debouncedGroupValidation } = useGroupValidation(setGroupNameExist, userInfo, dbInfo, 500);








    useEffect(() => {
        const fetchData = async () => {
            const data = await JSON.parse(sessionStorage.getItem("authUser"));
            const db_info = await JSON.parse(sessionStorage.getItem("db_info"));
            const client_info = await JSON.parse(sessionStorage.getItem("client_info"))[0];
            // const user_facilities = await JSON.parse(sessionStorage.getItem("user_facilities"));
            sessionStorage.removeItem("userId");
                const auditData = JSON.parse(sessionStorage.getItem("auditData"));

                setUserInfo(data);
                setClientInfo(client_info);
                setDbInfo(db_info);
                setConfigData(data.config_data);
                setDataloaded(false);

                getUserList(db_info);
           
        };

        fetchData();
    }, []);




    const getRoles = async (db_info) => {
        ////console.log('db_info', db_info)
        try {
            const response = await urlSocket.post('cog/manage-roles', {
                encrypted_db_url: db_info.encrypted_db_url,
                user_id: userInfo?.user_data?._id,
                show_all: true
            });
            ////console.log('response.data.response_code', response.data)
            if (response.data.response_code === 500) {
                setRolesInfo(response.data.data);
                setDataloaded(true);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };


    const validateData = () => {
        const userNextLevel = _.map(
            _.filter(configData?.hierarchy_info, ({ hierarchy_level }) => hierarchy_level >= userInfo?.hierarchy_level_value),
            "hierarchy_level_name"
        );
        let hlData = "";

        userNextLevel.forEach((item, index) => {
            if (index === 1) {
                hlData = userInfo?.departmentandhierarchy[0][item];
            } else if (index > 1) {
                if (userInfo?.departmentandhierarchy[0][item] !== "" && userInfo?.departmentandhierarchy[0][item] !== undefined) {
                    hlData = hlData + " / " + userInfo?.departmentandhierarchy[0][item];
                }
            }
        });

        setHlData(hlData);
    };

    const getUserList = (db_info) => {
        let show_all;
        if (userInfo && userInfo.user_data.created_by === null) {
            show_all = true;
        } else {
            show_all = false;
        }
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        //console.log(authUser,'authUser');
        try {
            urlSocket.post('cog/get-user-info', {
                db_info: db_info,
                user_id: authUser.user_data._id,
                show_all: show_all
            }).then((res) => {
                if (res.data.response_code === 500) {
                    //console.log('res.data.user_list', res.data.user_list)
                    setDataSource(res.data.user_list);
                    setEntitiesAuditData(res.data.user_list);
                    setStatusBasedFilteredData(res.data.user_list);
                    setDataloaded(false);
                    setLabelDefault(true);
                    setTotalEntities(res.data.user_list.length + 1);
                    setSearchFiles(res.data.user_list);
                    setDupSearchFiles(res.data.user_list);
                    setTempSearchFiles(res.data.user_list);
                    setShowSelected('');
                    setTableDataloaded(true);
                    createStatus();
                    loadUserLabels(db_info);
                    pageClick(1);
                }
            });
        } catch (error) {
            console.error(error);
        }
    };


    const showAlert = () => {
        ////console.log('object')
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745", // Bootstrap success color
            cancelButtonColor: "#dc3545", // Bootstrap danger color
            confirmButtonText: "Yes, confirm!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                handleConfirm(); // ✅ Call the confirm function
            } else {
                handleCancel(); // ✅ Call the cancel function
            }
        });
    };

    // const completedStatus = (data) => {
    //     var labels = []
    //     data == false ? labels.push({ status: "In active", color: "#303335", badgeClass: "danger" }) :
    //         data == true ? labels.push({ status: "Active", color: "#fbae17", badgeClass: "success" }) :
    //             labels.push({ status: "In active", color: "#303335", badgeClass: "danger" })
    //     return labels
    // }


    const completedStatus = (data) => {
        let labels = [];

        if (data === '1') {
            labels.push({ status: "Active", color: "#fbae17", badgeClass: "success" });
        } else {
            labels.push({ status: "Inactive", color: "#303335", badgeClass: "danger" });
        }

        return labels;
    };




    const navigateTo = (userData, mode) => {
        ////console.log('userData', userData)
        if (mode === 0) {
            sessionStorage.removeItem("userId");
            sessionStorage.setItem("userId", userData._id);
            navigate("/add-new-user");
        } else if (mode === 1) {
            sessionStorage.removeItem("map_location_page");
            sessionStorage.removeItem("redirect");
            navigate("/add-new-user");
        }
    };



    const toggle2 = (e) => {
        setLabelWindow(prev => !prev);
        setGroupNameExist(false);
        setBtnLoad(false);
        e.preventDefault();
    };


    const loadEOPTS = async () => {
        setTableDataloaded(false);
        setIsAllSelected(false);
        try {
            const response = await urlSocket.post("webEntities/grouplist", {
                userInfo: {
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    company_id: userInfo.client_info[0]._id,
                    user_id: userInfo.user_data._id,
                },
            });

            setStatusBasedFilteredData(response.data.data);
            setTableDataloaded(true);
            setAllowTableRowToSelect(true);
            setLabelDefault(true);
            setSelectedLabel(false);
            setLabel({ endpoints: [] });

            loadUserLabels(dbInfo);
        } catch (error) {
            consoel.log("error", error)
        }
    };

    const createStatus = () => {
        const entityStatus = _.map(_.countBy(entitiesAuditData, "active"), (val, key) => ({
            status: key,
            count: val
        }));

        const result = auditStatusData.map((audititem) => {
            const matchingStatus = entityStatus.find(itemStatus => itemStatus.status === audititem.id);
            return { ...audititem, count: matchingStatus ? matchingStatus.count : 0 };
        });

        const totalEntities = result.reduce((sum, item) => sum + item.count, 0);

        ////console.log("Before State Update - Result:", result);
        ////console.log("Before State Update - Total Entities:", totalEntities);

        setResultData(result);
        setTotalEntities(totalEntities);
    };


    useEffect(() => {
        createStatus();
    }, [entitiesAuditData, auditStatusData])


    const filterStatus = (data) => {
        let filteredData;
        if (data === "In active Users") {
            filteredData = _.filter(entitiesAuditData, { "active": "0" });
        } else if (data === "Active Users") {
            filteredData = _.filter(entitiesAuditData, { "active": "1" });
        } else if (data === "All") {
            filteredData = entitiesAuditData;
        }

        setStatusBasedFilteredData(filteredData);
        setSearchFiles(filteredData);
        setShowSelected(data);
    };



    const handleValidSubmit = (event, values) => {

        var password = CryptoJS.AES.encrypt(values.password, secretKey).toString()
        values["encrypted_db_url"] = dbInfo.encrypted_db_url
        values["db_name"] = dbInfo.db_name
        values["userPoolId"] = clientInfo.userPoolId
        values["clientId"] = clientInfo.clientId
        values["clientId"] = clientInfo.clientId
        values["password"] = password
        values["_id"] = selectedUser._id
        values["email_id"] = selectedUser.email_id
        values["short_name"] = clientInfo.short_name
        values["user_id"] = userInfo.user_data._id

        try {
            urlSocket.post('cog/reset-client-user-pwd', values).then((res) => {
                if (res.data.data.response_code === 500) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Your request has been processed successfully.',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        setShowModal(false)
                        getUserList(dbInfo)
                    })

                }
            })
        } catch (error) {
            //console.log("error", error)
        }

    }




    // const handleValidGroupSubmit = (event, values) => {
    //     if (values.label_name) {
    //         values.label_name = values.label_name.trim();
    //     }
    //     if (groupNameExist === false) {
    //         setBtnLoad(true)
    //         try {
    //             urlSocket.post("userSettings/create-user-group", {
    //                 labelInfo: values,
    //                 userInfo: {
    //                     encrypted_db_url: dbInfo.encrypted_db_url,
    //                     _id: userInfo.user_data._id,
    //                     company_id: userInfo.client_info[0]._id
    //                 }
    //             })
    //                 .then(response => {
    //                     setLabelState(response.data.data);
    //                     setDupLabelData(response.data.data);
    //                     setLabelWindow(false);
    //                     setAllowTableRowToSelect(true);
    //                 })
    //         } catch (error) {
    //             ////console.log("error", error)
    //         }
    //     }

    // }

   const handleValidGroupSubmit = async (event, values) => {
        if (values.label_name) {
            values.label_name = values.label_name.trim();
        }

        await debouncedGroupValidation(values.label_name);
        
        setTimeout(() => {
            if (groupNameExist === false) {
                setBtnLoad(true);
                try {
                    urlSocket.post("userSettings/create-user-group", {
                        labelInfo: values,
                        userInfo: {
                            encrypted_db_url: dbInfo.encrypted_db_url,
                            _id: userInfo.user_data._id,
                            company_id: userInfo.client_info[0]._id
                        }
                    })
                        .then(response => {
                            setLabelState(response.data.data);
                            setDupLabelData(response.data.data);
                            setLabelWindow(false);
                            setAllowTableRowToSelect(true);
                            setBtnLoad(false);
                        })
                        .catch(error => {
                            console.error("Error creating group:", error);
                            setBtnLoad(false);
                        });
                } catch (error) {
                    console.error("Error:", error);
                    setBtnLoad(false);
                }
            }
        }, 100);
    }

   const handleGroupNameChange = (event) => {
        const value = event.target.value;
        setGroupNameExist(false); 
        debouncedGroupValidation(value);
    };

    const handleGroupName = (event) => {
        handleGroupNameChange(event);
    }


    // const handleGroupName = (event) => {
    //     var api_data = {}
    //     api_data["group_name"] = event.target.value.trim()
    //     api_data["encrypted_db_url"] = dbInfo.encrypted_db_url
    //     api_data["user_id"] = userInfo.user_data._id
    //     if (event.target.value !== "") {
    //         try {
    //             urlSocket.post('userSettings/validate-user-group', api_data).then((response) => {
    //                 //(response, 'response')
    //                 console.log('response411', response)
    //                 if (response.data.data.length > 0) {

    //                     setGroupNameExist(true)
    //                 }
    //                 else {
    //                     setGroupNameExist(false)

    //                 }
    //             })

    //         } catch (error) {
    //             cosnoel.log("error", error)

    //         }

    //     }
    // }



    const labelSelected = (data) => {

        setTableDataloaded(false)
        setSelectedLabel(data._id)
        setIsAllSelected(false)
        setLabel(data)

        try {
            urlSocket.post("userSettings/load-group-users", {
                labelInfo: data,
                userInfo: {
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    _id: userInfo.user_data._id,
                    company_id: userInfo.client_info[0].company_id
                }
            })
                .then(response => {
                    setStatusBasedFilteredData(response.data.data)
                    setEntitiesAuditData(response.data.data)
                    setSearchFiles(response.data.data)
                    setDupSearchFiles(response.data.data)
                    setTempSearchFiles(response.data.data)
                    setSelectedEOPT([])
                    setLabelDefault(false)
                    setTableDataloaded(true)

                    createStatus()
                    loadUserLabels(dbInfo)
                })

        } catch (error) {
            ////console.log("error", error)
        }


    }


    const removeFromLabel = () => {


        if (selectedEOPT.length !== 0) {
            setTableDataloaded(false)
            _.each(selectedEOPT, item => {
                var getIndex = label.group_users.indexOf(item)

                if (getIndex !== -1) {
                    label.group_users.splice(getIndex, 1)
                }
            })

            try {
                urlSocket.post("userSettings/move-to-group", {
                    eopts: label.group_users,
                    labelInfo: label,
                    userInfo: {
                        encrypted_db_url: dbInfo.encrypted_db_url,
                        _id: userInfo.user_data._id,
                        company_id: userInfo.client_info[0]._id
                    }
                })
                    .then(response => {
                        var getIndex = _.findIndex(labelState, item => { return item._id == response.data.data._id })
                        var labelData = [...labelState]
                        labelData[getIndex] = response.data.data


                        setLabelState(labelData)
                        setDupLabelData(labelData)
                        setLabel(response.data.data)
                        setSelectedEOPT([])
                        setTableDataloaded(true)


                        labelSelected(response.data.data)
                    })

            } catch (error) {
                consoel.log("error", error)
            }
        }

    }



    const loadUserLabels = (db_info) => {
        ////console.log('db_info', db_info, userInfo)
        const data = JSON.parse(sessionStorage.getItem("authUser"));

        try {
            urlSocket.post("userSettings/get-user-group", {
                userInfo: {
                    _id: data.user_data._id,
                    encrypted_db_url: db_info.encrypted_db_url,
                    company_id: data.client_info[0].company_id
                }
            })
                .then(response => {

                    setLabelState(response.data.data)
                    setDupLabelData(response.data.data)
                    setTableDataloaded(true)
                    setSearchGroupName(response.data.data)
                    setDupSearchGroupName(response.data.data)
                    setDupTempSearchGroup(response.data.data)
                    setAllowTableRowToSelect(false)

                    getRoles(db_info)
                    // getRoles(dbInfo)
                })

        } catch (error) {
            ////console.log("error", error)
        }
    }


    const onDrawerClose = () => {
        setOpen(false);
        setDataloaded(false);
        getUserList(dbInfo);
    };



    const activeInactive = (userInfo) => {
        if (userInfo.active === "0") {
            userInfo.active = "1"
        }
        else {
            userInfo.active = "0"
        }
        try {
            urlSocket.post("cog/updtactive", {
                userInfo: userInfo,
                db_info: dbInfo
            })
                .then((response) => {
                    if (response.data.response_code == 500) {
                        setDataloaded(false)
                        getUserList(dbInfo)
                    }

                })
        } catch (error) {
            ////console.log("error", error)
        }
    }



    const moveToLabel = async (data) => {
        if (selectedEOPT.length === 0) return; // Exit if nothing is selected
    
        setTableDataloaded(false); // Start loading state
    
        try {
            // Create a new selection array without mutating state directly
            const filteredSelection = selectedEOPT.filter(item => !data.group_users.includes(item));
    
            // Concatenate new group users
            const updatedSelection = [...filteredSelection, ...data.group_users];
    
            const response = await urlSocket.post("userSettings/move-to-user-group", {
                eopts: updatedSelection,
                labelInfo: data,
                userInfo: {
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    _id: userInfo.user_data._id,
                    company_id: userInfo.client_info[0]._id
                }
            });
    
            if (response?.data?.data) {
                const updatedLabelData = labelState.map(item =>
                    item._id === response.data.data._id ? response.data.data : item
                );
    
                // ✅ Ensures selectedEOPT is cleared properly
                setLabelState(updatedLabelData);
                setDupLabelData(updatedLabelData);
                setSelectedEOPT([]); // Clear selection
                getUserList(dbInfo)
            }
        } catch (error) {
            console.error("Error moving to label:", error);
        } finally {
            setTableDataloaded(true); // Ensure loading state resets
        }
    };
    


    const select_roles = (selectedList, user) => {

        //console.log('select_roles', user);



        if (selectedList.length > 0) {
            user['role_info'] = selectedList
            // user['role_names'] = selectedList.map(role => role.role_name); 
            user['encrypted_db_url'] = dbInfo.encrypted_db_url;
            user['db_name'] = dbInfo.db_name;
            user["user_id"] = userInfo.user_data._id;
            //console.log('user :>> ', user);
    
            try {
                urlSocket.post('cog/cruduser', {
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    user_info: user
                }).then((res) => {
                    //console.log('resss', res);
                    if (res.data.response_code === 500) {
                        console.error("Server Error");
                    }
                });
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    const deleteLabel = () => {
        try {
            urlSocket.post("userSettings/delete-user-group", {
                labelInfo: label,
                userInfo: {
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    _id: userInfo.user_data._id,
                    company_id: userInfo.client_info[0]._id
                }
            })
                .then(response => {
                    setLabelState(response.data.data)
                    setDupLabelData(response.data.data)
                    setLabelWindow(false)
                    setAllowTableRowToSelect(true)
                    loadEOPTS()
                    getUserList(dbInfo)

                })
        } catch (error) {
            ////console.log("error", error)
        }
    }

    const handleConfirm = () => {
        setConfirmBoth(false);
        setSuccessDlg(true);
        setDynamicTitle("Deleted");
        setDynamicDescription("Your file has been deleted.");

        // Call deleteLabel after state update
        deleteLabel();
    };

    const handleCancel = () => {
        setConfirmBoth(false);
        setErrorDlg(true);
        setDynamicTitle("Cancelled");
        setDynamicDescription("Your imaginary file is safe :)");
    };


    const delete_user = (data) => {
        Swal.fire({
            icon: 'question',
            title: 'Are you sure?',
            text: 'Do you want to delete this user ?',
            showCancelButton: true,
            confirmButtonColor: '#34c38f',
            confirmButtonText: 'Yes',
            cancelButtonColor: '#f46a6a',
            cancelButtonText: 'No',
            customClass: {
                icon: 'swal-icon-small',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                urlSocket.post('cog/delete-user', {
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    user_id: data._id,
                    email: data.email_id,
                    userInfo: data,
                    client_info: userInfo.client_info[0]

                }).then((response) => {
                    if (response.data.response_code === 500) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: `User deleted Successfully`,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                setSelectedEOPT([]);
                                getUserList(dbInfo);

                            }

                        })
                    }
                })
            }
        })
    }





    const getSelectedEOPT = (row) => {
        ////console.log("rowgetSelectedEOPT", row);
        const totalRows = statusBasedFilteredData.length; // Adjust based on your actual dataset

        setSelectedEOPT((prevSelected) => {
            const newSelection = new Set(prevSelected);

            if (newSelection.has(row._id)) {
                newSelection.delete(row._id); // Unselect
            } else {
                newSelection.add(row._id); // Select
            }

            return [...newSelection]; // Convert back to array
        });

        // Use an updater function to get the latest selectedEOPT state after update
        setSelectedEOPT((updatedSelection) => {
            setIsAllSelected(updatedSelection.length > 0 && updatedSelection.length === totalRows); // Ensure totalRows is defined
            return updatedSelection;
        });
    };





    const pageClick = (currentPage) => {

        setCurrentPage(currentPage)
        paginationProcess()

    }

    const paginationProcess = () => {
    }

    const getFuzzySearch = (search_files, mode) => {
        if (mode == "1") {
            setDupLabelData(search_files)
            setDupSearchGroupName(dupTempSearchGroup)
        }
        if (mode == "2") {
            setLabelState(search_files)
            setDupSearchGroupName(dupTempSearchGroup)
        }
        else if (mode == undefined) {

            setStatusBasedFilteredData(search_files)
            setSearchFiles(search_files)
            setDupSearchFiles(tempSearchFiles)
            pageClick(currentPage)
        }
    }




    const handleKeyPress = (event) => {
        if (event.key === "Enter" && groupNameExist) {
            event.preventDefault();
        }
    };


    const handleCloseModal = () => {
        setShowModal(false)
        setShow(true)
        setShow1(true)
    };

    const selectAllUser = (rows) => {
        var _id_grp = []
        rows.map((ele, idx) => {
            if (ele.selected) {
                _id_grp.push(ele._id)
            }
        })
        var selectedEOPT = []
        selectedEOPT = _id_grp
        setSelectedEOPT(selectedEOPT)
    }

    const resetPasswordFunction = (user) => {
        setShowModal(true);
        setSelectedUser(user)
    }

    const confirmDelete = () => {
        ////console.log('confirmBoth', confirmBoth)
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#dc3545",
            confirmButtonText: "Yes, confirm!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                handleConfirm();
            } else {
                handleCancel();
            }
        });
    }


    const columns = useMemo(() => [

        canEdit
            ?
            {
                Header: (cellProps) => (
                    <div className="form-check font-size-14 text-center">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkAll"
                            onClick={(e) => {
                                const allSelected = cellProps.page.every((row) => row.original.selected);
                                setIsRowSelected(allSelected)

                                cellProps.page.forEach((row) => {
                                    row.original.selected = !allSelected;
                                });
                                setIsAllSelected(cellProps.page.every((row) => row.original.selected === true))
                                selectAllUser(_.map(cellProps.page, "original"));


                            }}
                            checked={
                                cellProps.page.every((row) => row.original.selected) &&
                                cellProps.page.length === selectedEOPT.length &&
                                statusBasedFilteredData.length !== 0


                            }
                        />
                        <label className="form-check-label" htmlFor="checkAll"></label>
                    </div>
                ),
                accessor: '#',
                width: '50px',
                filterable: true,
                isSort: false,
                Cell: ({ row }) => (
                    <div className="form-check font-size-14 text-center">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={`checkRow-${row.original._id}`}
                            checked={row.original.selected}
                            onClick={(e) => {
                                row.original.selected = !row.original.selected;
                                getSelectedEOPT(row.original);
                            }}
                        />
                        <label className="form-check-label" htmlFor={`checkRow-${row.original._id}`}></label>
                    </div>
                ),
            } : null,
    
        {
            accessor: (row) => row.firstname || row.fullname,  // Condition in accessor to use either firstname or fullname
            Header: 'Name',
            filterable: true,
            isSort: true,
            Cell: ({ value }) => <span className="fw-bold text-truncate font-size-12 d-block">{value}</span>,
        },
        
        {
            accessor: 'email_id',
            Header: 'Email ID',
            filterable: true,
            isSort: true,
            Cell: ({ value }) => <span className="text-truncate  font-size-11 d-block">{value}</span>,
        },
        {
            accessor: 'phone_number',
            Header: 'Mobile Number',
            filterable: true,
            isSort: true,
            Cell: ({ value }) => <span className="text-truncate  font-size-11 d-block">{value}</span>,
        },
        {
            accessor: 'status',
            Header: 'Status',
            disableFilters: true,
            isSort: true,
            Cell: (cellProps) => {
                // const itemStatus = completedStatus(cellProps.row.original.status)[0];
                const itemStatus = completedStatus(cellProps.row.original.active)[0];
                return (
                    <div className="d-flex justify-content-start  font-size-11">
                        <div>
                            <span className={`font-size-10 badge badge-soft-${itemStatus.badgeClass} text-${itemStatus.color}`} >
                                {itemStatus.status}
                            </span>
                        </div>
                    </div>
                );
            },
        },
       
        {
            accessor: 'roles',
            Header: 'Roles',
            disableFilters: true,
            Cell: (cellProps) => {
                const user = cellProps.row.original;
                const userRoles = user.role_info?.map(role => role.role_name).join(', ') || 'No Role Assigned';
                return (
                    <span className="font-size-11">{userRoles}</span>
                );
            },
        },
        {
            accessor: 'branch_id',
            Header: 'Branch',
            disableFilters: true,
            Cell: (cellProps) => {
                const user = cellProps.row.original;
                const userBranch = user.branch_id?.map(branch => branch.br_name).join(', ') || 'No Branch Assigned';
        
                return (
                    <span className="font-size-11">{userBranch}</span>
                );
            },
        },
        {
            accessor: 'dept_id',
            Header: 'Department',
            disableFilters: true,
            Cell: (cellProps) => {
                const user = cellProps.row.original;
                const userDepart = user.dept_id?.map(dept => dept.dept_name).join(', ') || 'No Department Assigned';
        
                return (
                    <span className="font-size-11">{userDepart}</span>
                );
            },
        },
        
        {
            accessor: 'menu',
            Header: canEdit ?'View / Edit / Modify User' : 'View User',
            disableFilters: true,
            Cell: (cellProps) => {
                const user = cellProps.row.original;
                return (
                    <div className="d-flex justify-content-start align-items-center gap-1 ">
                        {user._id !== userInfo.user_data._id &&
                             canEdit && (
                                <div id={`active-inactive-tooltip-${user._id}`}>
                                    <button
                                        className={`btn btn-sm ${user.active === '0' ? 'btn-soft-success' : 'btn-soft-danger'
                                            }`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => activeInactive(user)}
                                    >
                                        <i className={`bx ${user.active === '0' ? 'bx-user-plus' : 'bx-user-check'} font-size-13`} />
                                    </button>
                                    <UncontrolledTooltip placement="top" target={`active-inactive-tooltip-${user._id}`}>
                                        {user.active === '0' ? 'Activate User' : 'Deactivate User'}
                                    </UncontrolledTooltip>
                                </div>
                            )}

                        {user._id !== userInfo.user_data._id && canEdit &&
                             (
                                <div id={`reset-password-tooltip-${user._id}`}>
                                    <button
                                        className="btn btn-sm btn-soft-primary"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => resetPasswordFunction(user)}
                                    >
                                        <i className="bx bx-edit-alt" />
                                    </button>
                                    <UncontrolledTooltip placement="top" target={`reset-password-tooltip-${user._id}`}>
                                        Reset Password
                                    </UncontrolledTooltip>
                                </div>
                            )}

                        {user._id !== userInfo.user_data._id &&  canEdit && (
                            <div id={`delete-user-tooltip-${user._id}`}>
                                <button className="btn btn-sm btn-soft-danger" style={{ cursor: 'pointer' }} onClick={() => delete_user(user)}>
                                    <i className="bx bx-trash" />
                                </button>
                                <UncontrolledTooltip placement="top" target={`delete-user-tooltip-${user._id}`}>
                                    Delete User
                                </UncontrolledTooltip>
                            </div>
                        )}

                        <div id={`view-detail-tooltip-${user._id}`}>
                            <button className="btn btn-sm btn-soft-primary" style={{ cursor: 'pointer' }} onClick={() => navigateTo(user, 0)} >
                                <i className="bx bx-right-arrow-alt font-size-12" />
                            </button>
                            <UncontrolledTooltip placement="top" target={`view-detail-tooltip-${user._id}`}>
                                View Detail
                            </UncontrolledTooltip>
                        </div>

                    </div>
                );
            },
        },

    ].filter(Boolean), [selectedEOPT, statusBasedFilteredData, isAllSelected, userInfo, dupLabelData, dupTempSearchGroup, dupSearchGroupName,

        rolesInfo, searchGroupName, totalEntities, resultData, showSelected, labelDefault,
    ]);


    return (
        <React.Fragment>
            {
                dataloaded ? (
                    <div className="page-content" style={{ minHeight: "100vh" }}>
                        <Container fluid>
                            <Breadcrumbs title="Users" breadcrumbItem="Users" />
                            <div className="d-xl-flex">
                                <div className="w-100">
                                    <div className="d-md-flex">

                                        <Card className="me-md-2" style={{ maxWidth: 235, height: '87vh', overflowY: 'auto' }}>
                                            <CardBody style={{ maxHeight: height - 150, overflow: 'auto' }} className="overflow-auto">
                                                {
                                                    canEdit && (<>
                                                        <Row className="mb-3">
                                                                <div className="d-flex align-items-center justify-content-center">
                                                                    <Button
                                                                        type="button"
                                                                        color="primary"
                                                                        className="btn btn-sm w-100 px-0"
                                                                        onClick={() => {
                                                                            setLabelWindow(true)
                                                                            setBtnLoad(false)
                                                                        }}
                                                                    >
                                                                        <i className="mdi mdi-account-group text-white font-size-16" /> Create User Group
                                                                    </Button>
                                                                </div>
                                                        </Row>
                                                    </>)
                                                }
                                                <Row className="mb-3">
                                                    <Label>Groups</Label>
                                                    <FuzzySearch
                                                        search_files={searchGroupName}
                                                        getFuzzySearch={(search_files) => getFuzzySearch(search_files, '2')}
                                                        dup_search_files={dupSearchGroupName}
                                                        temp_search_files={dupTempSearchGroup}
                                                        keyword={['label_name']}
                                                    />
                                                </Row>
                                                <div className="mail-list mt-4" style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                                                    <div
                                                        className={`btn btn-sm col-12 border-bottom py-1 ${selectedLabel === null ? 'btn-primary' : 'btn-white'}`}
                                                        style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}
                                                        onClick={() => {
                                                            setSelectedLabel(null);
                                                            getUserList(dbInfo);
                                                        }}
                                                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#556EE6'; e.target.style.color = '#FFF' }}
                                                        onMouseLeave={(e) => { e.target.style.backgroundColor = ''; e.target.style.color = '' }}
                                                    >
                                                        <i className="mdi mdi-circle text-secondary font-size-10" />
                                                        &nbsp;&nbsp;ALL
                                                    </div>
                                                    <div className="row">
                                                        {labelState?.map((item, idx) => (
                                                            <div className="col-12 py-1" key={'lbl' + idx}>
                                                                <div
                                                                    style={{ textAlign: 'left', borderRadius: '0px' }}
                                                                    className={`btn btn-sm col-12 ${selectedLabel === item._id ? 'btn-primary' : 'btn-white'}`}
                                                                    onClick={() => {
                                                                        labelSelected(item);
                                                                    }}
                                                                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#556EE6'; e.target.style.color = '#FFF' }}
                                                                    onMouseLeave={(e) => { e.target.style.backgroundColor = ''; e.target.style.color = '' }}
                                                                >
                                                                    <i
                                                                        style={{ color: item.label_color }}
                                                                        className="mdi mdi-circle font-size-10"
                                                                    />
                                                                    &nbsp;&nbsp;{item.label_name}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                        <div className="w-100" style={{ height: '87vh', overflowY: "auto", overflowX: "hidden" }}>
                                            <Row>
                                                <Col lg="12">
                                                    <Card>
                                                        <CardBody>
                                                            {
                                                                tableDataloaded ? (
                                                                    <>
                                                                        <TableContainer
                                                                            columns={columns}
                                                                            data={statusBasedFilteredData}
                                                                            isGlobalFilter={true}
                                                                            isAddOptions={false}
                                                                            isJobListGlobalFilter={false}
                                                                            customPageSize={10}
                                                                            style={{ width: '100%' }}
                                                                            selectedEOPT={selectedEOPT}
                                                                            search_group_name={searchGroupName}
                                                                            getFuzzySearch={(search_files) => getFuzzySearch(search_files, '1')}
                                                                            dup_search_group_name={dupSearchGroupName}
                                                                            dup_temp_search_group={dupTempSearchGroup}
                                                                            dup_labelData={dupLabelData}
                                                                            moveToLabel={(data) => { moveToLabel(data) }}
                                                                            toggle2={(e) => toggle2(e)}
                                                                            labelDefault={labelDefault}
                                                                            removeFromLabel={() => { removeFromLabel() }}
                                                                            loadUserLabels={() => { loadUserLabels(dbInfo) }}
                                                                            confirmDelete={confirmDelete}
                                                                            resultData={resultData}
                                                                            filterStatus={(data) => filterStatus(data)}
                                                                            show_selected={showSelected}
                                                                            totalEntities={totalEntities}
                                                                            dynamicBtn={true}
                                                                            isAllSelected={isAllSelected}
                                                                            btnClick={() => { navigateTo("", 1) }}
                                                                            btnName={"Add New User"}
                                                                            isPagination={true}
                                                                            iscustomPageSizeOptions={false}
                                                                            filterable={false}
                                                                            tableClass="align-middle table-nowrap table-check table-hover"
                                                                            theadClass="table-light"
                                                                            paginationDiv="col-sm-12 col-md-7"
                                                                            pagination="pagination justify-content-end pagination-rounded"
                                                                            canEdit={canEdit}
                                                                            />
                                                                    </>
                                                                ) : null}

                                                            {showModal && (
                                                                <Modal
                                                                    size="md"
                                                                    isOpen={showModal}
                                                                    toggle={handleCloseModal}
                                                                    centered
                                                                    className="modal-dialog-scrollable"
                                                                >
                                                                    <div className="modal-header">
                                                                        <h5 className="modal-title mt-0">Change Password</h5>
                                                                        <button onClick={handleCloseModal} type="button" className="close" data-dismiss="modal" aria-label="Close" >
                                                                            <span aria-hidden="true">&times;</span>
                                                                        </button>
                                                                    </div>

                                                                    <Row className="px-3 py-2">
                                                                        <Col>
                                                                            <Label> {selectedUser.email_id ? "Email ID" : "Phone Number"} :
                                                                                <span className="ms-2">
                                                                                    {selectedUser.email_id
                                                                                        ? selectedUser.email_id
                                                                                        : `${selectedUser.countrycode} ${selectedUser.phone_number}`}
                                                                                </span>
                                                                            </Label>
                                                                        </Col>
                                                                    </Row>
                                                                    <AvForm className="form-horizontal px-3" onValidSubmit={handleValidSubmit} >
                                                                        <div className="mt-3 input-group">
                                                                            <div className="flex-grow-1">
                                                                                <AvField
                                                                                    name="newpassword"
                                                                                    label="New Password"
                                                                                    className="form-control"
                                                                                    placeholder="Enter New Password"
                                                                                    type={show ? "password" : "text"}
                                                                                    validate={{
                                                                                        required: {
                                                                                            value: true,
                                                                                            errorMessage: "Password is required",
                                                                                        },
                                                                                        minLength: {
                                                                                            value: 8,
                                                                                            errorMessage: "Password must be at least 8 characters long",
                                                                                        },
                                                                                        pattern: {
                                                                                            value: /^(?=.*[A-Z]).+$/,
                                                                                            errorMessage: "Password must contain at least one uppercase letter",
                                                                                        },
                                                                                    }}
                                                                                    required
                                                                                />
                                                                            </div>
                                                                            <div style={{ marginLeft: '', padding: '3px 0px 4px 2px' }}>
                                                                                <button style={{ border: '1px solid lightgrey', padding: '8px' }} onClick={() => setShow(!show)} className="btn btn-light mt-4" type="button" id="password-addon" >
                                                                                    <i className={show ? "mdi mdi-eye-off" : "mdi mdi-eye-outline"} ></i>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="mt-1 input-group">
                                                                            <div className="flex-grow-1">
                                                                                <AvField
                                                                                    name="confirmpassword"
                                                                                    label="Confirm Password"
                                                                                    className="form-control"
                                                                                    placeholder="Enter Confirm Password"
                                                                                    type={show1 ? "password" : "text"}
                                                                                    validate={{
                                                                                        required: {
                                                                                            value: true,
                                                                                            errorMessage: "Confirm password is required",
                                                                                        },
                                                                                        match: {
                                                                                            value: "newpassword",
                                                                                            errorMessage: "Passwords do not match",
                                                                                        },
                                                                                    }}
                                                                                    required
                                                                                />
                                                                            </div>
                                                                            <div style={{ marginLeft: '', padding: '3px 0px 4px 2px' }}>
                                                                                <button style={{ marginLeft: '-1px', padding: '8px', borderTop: '1px solid lightgrey', borderBottom: '1px solid lightgrey', borderRight: '1px solid lightgrey' }} onClick={() => setShow1(!show1)} className="btn btn-light mt-4" type="button" id="password-addon" >
                                                                                    <i className={show1 ? "mdi mdi-eye-off" : "mdi mdi-eye-outline"} ></i>
                                                                                </button>
                                                                            </div>
                                                                        </div>

                                                                        <Row className="mb-3">
                                                                            <Col xs={12} className="text-end">
                                                                                <button type="button" onClick={handleCloseModal} className="btn btn-sm btn-outline-danger me-2" >
                                                                                    Cancel
                                                                                </button>
                                                                                <button type="submit" className="btn btn-sm btn-outline-success me-2" >
                                                                                    Change Password
                                                                                </button>
                                                                            </Col>
                                                                        </Row>
                                                                    </AvForm>
                                                                </Modal>
                                                            )}
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>
                        <Modal
                            isOpen={labelWindow}
                        >
                            <ModalHeader toggle={toggle2} tag="h5">
                                Create Group
                            </ModalHeader>
                            <ModalBody>
                                <AvForm
                                    onValidSubmit={handleValidGroupSubmit}>
                                    <Row form>
                                        <Col className="col-12">
                                            <div className="mb-3">
                                                <AvField
                                                    name="label_name"
                                                    label="Group Name"
                                                    type="text"
                                                    errorMessage="Invalid name"
                                                    validate={{
                                                        required: { value: true },
                                                    }}
                                                    // onChange={(e) => handleGroupName(e)}
                                                     onChange={handleGroupName}
                                                    onKeyPress={(e) => handleKeyPress(e)}
                                                />
                                                {groupNameExist && (
                                                    <label
                                                        className="text-danger"
                                                        style={{ fontSize: "smaller" }}
                                                    >
                                                        Group name already exist
                                                    </label>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="text-end">
                                                <button
                                                    className="btn btn-sm btn-outline-success save-user"
                                                    disabled={btnLoad || groupNameExist}>
                                                    {btnLoad && <LoadingOutlined />}
                                                    {btnLoad ? "..." : "Submit"}
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </AvForm>
                            </ModalBody>
                        </Modal>
                    </div>
                ) : (
                    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
                        <div>Loading...</div>
                        <Spinner color="primary" />
                    </div>
                )
            }
        </React.Fragment>
    )
}
export default UserLists