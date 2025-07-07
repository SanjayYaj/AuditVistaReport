import PropTypes from "prop-types";

// import SweetAlert from "react-bootstrap-sweetalert";
import React, { useCallback, useEffect, useState } from "react";
import MetaTags from 'react-meta-tags';
import { useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    CardBody, Col, Container, Label, Modal, ModalBody, ModalHeader, Offcanvas, OffcanvasBody, OffcanvasHeader, Row, Spinner, UncontrolledTooltip
} from "reactstrap";

import FuzzySearch from '../../../common/FuzzySearch';



import { withTranslation } from "react-i18next";
import Breadcrumbs from "../../../components/Common/Breadcrumb";


import { AvField, AvForm } from "availity-reactstrap-validation";


import { LoadingOutlined } from '@ant-design/icons';
import urlSocket from "helpers/urlSocket";
import { usePermissions } from 'hooks/usePermisson';
import Swal from 'sweetalert2';
import AddEndpointNode from "./Components/AddEndpointNode";
import TableContainer from "./Components/Tablecontainer";





const ManageLocations = props => {


    const navigate = useNavigate();
    const { canView, canEdit } = usePermissions("mels");
    // const canEdit = false;


    const dbInfo = JSON.parse(sessionStorage.getItem("db_info"));
    const userInfo = JSON.parse(sessionStorage.getItem("authUser"));



    const [modal, setModal] = useState(false);
    const [usertype, setUsertype] = useState('');
    const [dataloaded, setDataloaded] = useState(false);
    const [auditStatusData, setAuditStatusData] = useState([
        { status: "Active", count: 0, color: "#fbae17", id: "1", badgeClass: "success" },
        { status: "In active", count: 0, color: "#303335", id: "0", badgeClass: "danger" },
    ]);
    const [userHLevel, setUserHLevel] = useState("All");
    const [resultData, setResultData] = useState([]);
    const [ddchange, setDdchange] = useState(false);
    const [open, setOpen] = useState(false);
    const [labelData, setLabelData] = useState([]);
    const [selectedLabel, setSelectedLabel] = useState(false);
    const [selectedEOPT, setSelectedEOPT] = useState([]);
    const [eopt, setEOPT] = useState([]);
    const [groupNameErr, setGroupNameErr] = useState(false);
    const [height, setHeight] = useState(window.innerHeight);
    const [searchFiles, setSearchFiles] = useState([]);
    const [dupSearchFiles, setDupSearchFiles] = useState([]);
    const [tempSearchFiles, setTempSearchFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [btnLoad, setBtnLoad] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchGroupName, setSearchGroupName] = useState([]);
    const [dupSearchGroupName, setDupSearchGroupName] = useState([]);
    const [dupLabelData, setDupLabelData] = useState([]);
    const [dupTempSearchGroup, setDupTempSearchGroup] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [folderMenu, setFolderMenu] = useState(false);
    const [imgMaxMb, setImgMaxMb] = useState(null);
    const [usercode, setUsercode] = useState(null);
    const [mappinginfo, setMappinginfo] = useState(null);
    const [designation, setDesignation] = useState(null);
    const [configData, setConfigData] = useState(null);
    const [auditData, setAuditData] = useState(null);
    const [tableDataloaded, setTableDataloaded] = useState(false);
    const [statusBasedFilteredData, setStatusBasedFilteredData] = useState([]);
    const [allowTableRowToSelect, setAllowTableRowToSelect] = useState(false);
    const [labelDefault, setLabelDefault] = useState(false);
    const [label, setLabel] = useState({ endpoints: [] });
    const [labelWindow, setLabelWindow] = useState(false);
    const [mainToggle, setMainToggle] = useState(false);
    const [confirmBoth, setconfirmBoth] = useState(false);
    const [successDlg, setSuccessDlg] = useState(false);
    const [dynamicTitle, setDynamicTitle] = useState("");
    const [dynamicDescription, setDynamicDescription] = useState("");
    const [errorDlg, setErrorDlg] = useState(false);










    useEffect(() => {

        const fetchData = async () => {

            var data = JSON.parse(sessionStorage.getItem("authUser"));
            var auditData = JSON.parse(sessionStorage.getItem("auditData"));
            var user_facilities = JSON.parse(sessionStorage.getItem("user_facilities"))



            setImgMaxMb(data.img_max_mb);
            setUsercode(data.user_data.user_code);
            setMappinginfo(data.user_data.mappinginfo);
            setDesignation(data.user_data.designation);
            setConfigData(data.config_data);
            setAuditData(auditData);
            setDataloaded(false);

            await loadEOPTS();

        }

        fetchData();

    }, [])




    const toggleFolder = () => {
        setFolderMenu(prevState => !prevState);
    };

    const loadEOPTS = async () => {
        setTableDataloaded(false);
        setIsAllSelected(false);

        //console.log("dbInfo", dbInfo)

        try {
            const response = await urlSocket.post("webEntities/endpointlist", {
                userInfo: {
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    company_id: userInfo.user_data.company_id,
                    user_id: userInfo.user_data._id,
                },
            });

            //console.log(response, 'response');

            const data = response.data.data;

            setStatusBasedFilteredData(data);
            setTableDataloaded(true);
            setAllowTableRowToSelect(true);
            setLabelDefault(true);
            setSelectedLabel(false);
            setLabel({ endpoints: [] });
            setSearchFiles(data);
            setDupSearchFiles(data);
            setTempSearchFiles(data);

            loadUserLabels();
            pageClick(1);
        } catch (error) {
            console.error(error);
        }
    };


    const loadUserLabels = async () => {

        //console.log("userInfo", userInfo.user_data._id)


        try {
            const response = await urlSocket.post("userSettings/getuserlabels", {
                userInfo: {
                    _id: userInfo.user_data._id,
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    company_id: userInfo.user_data.company_id,
                },
            });

            //console.log("response", response)

            const data = response.data.data;

            setLabelData(data);
            setDupLabelData(data);
            setTableDataloaded(true);
            setDataloaded(true);
            setSearchGroupName(data);
            setDupSearchGroupName(data);
            setDupTempSearchGroup(data);
            setAllowTableRowToSelect(false);
        } catch (error) {
            console.error(error);
        }
    };


    const pageClick = (currentPage) => {

        setCurrentPage(currentPage)
        paginationProcess();

    }

    const paginationProcess = () => {

    }


    const dateConvertion = (dateToConvert) => {
        if (dateToConvert != null) {
            var date = typeof (dateToConvert) == "object" ? String(dateToConvert.toISOString()) : String(dateToConvert)
            var convertedDate = date.slice(8, 10) + ' / ' + (date.slice(5, 7)) + ' / ' + date.slice(0, 4);
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



    const completedStatus = (data) => {
        var labels = []
        data == false ? labels.push({ status: "In active", color: "#303335", badgeClass: "danger" }) :
            data == true ? labels.push({ status: "Active", color: "#fbae17", badgeClass: "success" }) :
                labels.push({ status: "In active", color: "#303335", badgeClass: "danger" })
        return labels
    }



    const navigateTo = (entityData, mode) => {
        if (mode === 0) {
            sessionStorage.removeItem("entityData");
            sessionStorage.removeItem("uniqueNextLevels");
            sessionStorage.setItem("entityData", JSON.stringify(entityData));
            navigate("/edtent");
        }
        else
            if (mode === 1) {
                navigate("/adendpt");
            }
    }


    const toggle2 = () => {
        setLabelWindow(prev => !prev);
        setGroupNameErr(false);
        setBtnLoad(false);
    };

    const toggle = () => {
        setMainToggle(prev => !prev);
    };



    const closeDrawer = () => {
        setOpen(false)
    }

    const onDrawerClose = () => {
        setOpen(false)
        loadEOPTS()

    }

    const addEndpoint = (data) => {
    }



    const handleValidSubmit = (event, values) => {

        if (values.label_name) {
            values.label_name = values.label_name.trim()
        }
        //console.log('values', values)
        if (groupNameErr === false) {
            setBtnLoad(true)
            try {

                urlSocket.post("userSettings/createlabel", {
                    labelInfo: values,
                    userInfo: {
                        encrypted_db_url: dbInfo.encrypted_db_url,
                        _id: userInfo.user_data._id,
                        company_id: userInfo.user_data.company_id
                    }
                })
                    .then(response => {


                        setLabelData(response.data.data)
                        setDupLabelData(response.data.data)
                        setLabelWindow(false)
                        setAllowTableRowToSelect(true)


                    })

            } catch (error) {
            }
        }

    }


    const deleteLabel = () => {
        try {
            urlSocket.post("userSettings/deleteLabel", {
                labelInfo: label,
                userInfo: {
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    _id: userInfo._id,
                    company_id: userInfo.company_id
                }
            })
                .then(response => {
                    setLabelData(response.data.data)
                    setDupLabelData(response.data.data)
                    setLabelWindow(false)
                    setAllowTableRowToSelect(true)
                    loadEOPTS()
                })
        } catch (error) {
        }
    }



    const delete_endpoint = (data) => {
        var api_data = {}
        api_data["_id"] = data._id
        api_data["encrypted_db_url"] = dbInfo.encrypted_db_url
        api_data["user_id"] = userInfo._id
        Swal.fire({
            icon: 'question',
            title: 'Are you sure?',
            text: 'Do you want to delete this location?',
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

                try {
                    urlSocket.post('webEntities/delete-end-point', api_data).then((response) => {
                        if (response.data.response_code == 500) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success!',
                                text: `Location deleted Successfully`,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    loadEOPTS()
                                }
                            })
                        }
                    })
                } catch (error) {
                }
            }
        })
    }



    const labelSelected = (data) => {
        //console.log(data, 'data415')

        setTableDataloaded(false)
        setSelectedLabel(data._id)
        setIsAllSelected(false)
        setLabel(data)
        try {
            urlSocket.post("webEntities/loadlabeleopts", {
                labelInfo: data,
                userInfo: {
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    _id: userInfo.user_data._id,
                    company_id: userInfo.client_info[0]._id,
                }
            })
                .then(response => {
                    //console.log(response, 'response430')
                    const data = response.data.data;
                    setStatusBasedFilteredData(data);
                    setSearchFiles(data);
                    setDupSearchFiles(data);
                    setTempSearchFiles(data);
                    setLabelDefault(false);
                    setTableDataloaded(true);
                    setSelectedEOPT([])
                })

        } catch (error) {
        }

    }


    const getSelectedEOPT = (row, isSelect, rowIndex, e) => {

        var getIndex = selectedEOPT.indexOf(row._id)

        if (getIndex === -1) {
            selectedEOPT.push(row._id)
        }
        else {
            selectedEOPT.splice(getIndex, 1)
        }

        setSelectedEOPT(selectedEOPT)
        setIsAllSelected(selectedEOPT.length > 0 ? true : false)
    }
    const getFuzzySearch = useCallback((searchFiles, mode) => {

        if (mode === "1") {
            //console.log("search group name");
            setDupLabelData(searchFiles);
            setDupSearchGroupName(tempSearchFiles);
        } else if (mode === "2") {
            setLabelData(searchFiles);
            setDupSearchGroupName(tempSearchFiles);
        } else if (mode === undefined) {
            //console.log("Here");
            setStatusBasedFilteredData(searchFiles);
            setSearchFiles(searchFiles);
            setDupSearchFiles(tempSearchFiles);
            pageClick(currentPage);
        }
    }, [tempSearchFiles, currentPage]);




    const moveToLabel = (data) => {
        //console.log(data, 'data595');
        if (selectedEOPT.length !== 0) {
            //console.log(selectedEOPT, 'selectedEOPT597');

            _.each(data.endpoints, (item) => {
                //console.log(item, '460item');
                const getIndex = selectedEOPT.indexOf(item);

                if (getIndex !== -1) {
                    selectedEOPT.splice(getIndex, 1);
                }
            });

            const concated = selectedEOPT.concat(data.endpoints);
            setTableDataloaded(false);

            try {
                urlSocket
                    .post('userSettings/movetolabel', {
                        eopts: concated,
                        labelInfo: data,
                        userInfo: {
                            encrypted_db_url: dbInfo.encrypted_db_url,
                            _id: userInfo.user_data._id,
                            company_id: userInfo.client_info[0]._id,
                        },
                    })
                    .then((response) => {
                        //console.log('Full Response:', response);

                        const getIndex = _.findIndex(
                            labelData,
                            (item) => item._id === response.data.data._id
                        );

                        var updatedLabelData = [...labelData];
                        updatedLabelData[getIndex] = response.data.data;

                        setLabelData(updatedLabelData);
                        setDupLabelData(updatedLabelData);
                        setSelectedEOPT([]);
                        setTableDataloaded(true);
                    })
                    .catch((error) => {
                        console.error('API Error:', error);
                    });
            } catch (error) {
                console.error('Error in moveToLabel:', error);
            }
        } else {
            //console.log('No selected endpoints.');
        }
    };





    const removeFromLabel = async () => {
        if (selectedEOPT.length !== 0) {
            setTableDataloaded(false);
            _.each(selectedEOPT, item => {
                var getIndex = label.endpoints.indexOf(item)
                if (getIndex !== -1) {
                    label.endpoints.splice(getIndex, 1)
                }
            })
            try {

                urlSocket.post("userSettings/movetolabel", {
                    eopts: label.endpoints,
                    labelInfo: label,
                    userInfo: {
                        encrypted_db_url: dbInfo.encrypted_db_url,
                        _id: userInfo.user_data._id,
                        company_id: userInfo.client_info[0]._id,
                    }
                })
                    .then(response => {

                        var getIndex = _.findIndex(labelData, item => { return item._id == response.data.data._id })
                        var labelData = [...labelData]
                        labelData[getIndex] = response.data.data


                        setLabelData(labelData);
                        setDupLabelData(labelData);
                        setLabel(response.data.data);
                        setSelectedEOPT([]);
                        setTableDataloaded(true);




                        labelSelected(response.data.data)

                    })

            } catch (error) {
            }
        }

    }



    const editEOPT = (data) => {

        setOpen(true)
        setEOPT(data)

    }


    const handleGroupName = (event) => {
        var api_data = {}
        api_data["group_name"] = event.target.value.trim()
        api_data["encrypted_db_url"] = dbInfo.encrypted_db_url
        api_data["user_id"] = userInfo._id
        if (event.target.value !== "") {

            urlSocket.post('webEntities/validate-user-group-location', api_data).then((response) => {
                if (response.data.data.length > 0) {
                    setGroupNameErr(true)
                }
                else {
                    setGroupNameErr(false)
                }
            })


        }
    }


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

    const columns =
        React.useMemo(() => [
            canEdit ?
                {
                    Header: (cellProps) => {
                        return (
                            <div className="form-check font-size-14">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    onChange={() => {
                                        const allSelected = cellProps.page.every((row) => row.original.selected);
                                        //console.log(allSelected, 'allSelected', cellProps.page)
                                        cellProps.page.forEach((row) => {
                                            row.original.selected = !allSelected;
                                        });
                                        selectAllUser(_.map(cellProps.page, "original"))
                                        setIsAllSelected(cellProps.page.every((row) => row.original.selected === true));
                                    }
                                    }
                                    defaultChecked={cellProps.page.every((row) => row.original.selected) && (cellProps.page.length === selectedEOPT.length) && statusBasedFilteredData.length !== 0}
                                    id="checkAll"
                                />
                                <label className="form-check-label" htmlFor="checkAll"></label>
                            </div>
                        );
                    },
                    accessor: '#',
                    width: '5%',
                    filterable: true,
                    isSort: false,
                    Cell: ({ row }) => {
                        return (
                            <div className="form-check font-size-14">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    defaultChecked={selectedEOPT.includes(row.original._id)}
                                    onChange={(e) => {
                                        row.original.selected = !row.original.selected;
                                        //console.log(`Checkbox for row with ID: ${row.original._id} toggled. Selected: ${row.original.selected}`);
                                        getSelectedEOPT(row.original)
                                    }}
                                    id="checkAll"
                                />
                                <label className="form-check-label" htmlFor="checkAll"></label>
                            </div>
                        );
                    },
                } : null,
            {
                accessor: 'name',
                Header: 'Location',
                filterable: true,
                isSort: true,
                width: '50%',
                Cell: (cellProps) => {
                    var item = cellProps.row.original
                    return (
                        <>
                            <div className="fw-bold text-truncate font-size-12 d-block">
                                {item.name}

                                {
                                    item.endpoints !== undefined ?
                                        <div > {item.endpoints.length !== 0 ? <span className="font-size-10 text-secondary">Grouped in - </span> : null}
                                            {
                                                item.endpoints.map(elm => {
                                                    return (
                                                        <label key={''} style={{ backgroundColor: elm.label_color }} className="badge  me-2 font-size-10">{String(elm.label_name).slice(0, 20) + (elm.label_name.length > 20 ? "..." : "")}</label>
                                                    )
                                                })
                                            }
                                        </div> : null
                                }


                            </div>
                        </>
                    )
                }
            },
            {
                accessor: 'code',
                Header: 'Code',
                isSort: true,
                // width: '20%',
                Cell: (cellProps) => {
                    var item = cellProps.row.original
                    return (
                        <>
                            <div className="text-truncate font-size-11 d-block">
                                {item.code}
                            </div>
                        </>
                    )
                }
            },
            {
                accessor: 'category',
                Header: 'Category',
                isSort: true,
                // width: '20%',
                Cell: (cellProps) => {
                    var item = cellProps.row.original
                    return (
                        <>
                            <div className="text-truncate font-size-11 d-block">
                                {item.category}
                            </div>
                        </>
                    )
                }
            },
            {
                accessor: "menu",
                disableFilters: true,
                Header: canEdit ? 'View / Edit / Modify Location' : 'View Location',
                isSort: false,
                // width: '10%',
                Cell: (cellProps) => {
                    var item = cellProps.row.original
                    return (
                        <div className="d-flex justify-content-start align-items-center gap-1">
                            {
                                canEdit && (
                                    <>
                                        <>
                                            <Button id={`map-users-tooltip-${item.id}`} className="btn btn-sm btn-soft-primary d-flex align-items-center"
                                                onClick={() => {
                                                    navigate('/map-user');
                                                    sessionStorage.setItem('locationInfo', JSON.stringify(item));
                                                }}>
                                                <i className="bx bx-group font-size-12"></i>
                                            </Button>
                                            <UncontrolledTooltip placement="top" target={`map-users-tooltip-${item.id}`}>
                                                Map Users
                                            </UncontrolledTooltip>
                                        </>

                                        <>
                                            <Button id={`delete-tooltip-${item.id}`} className="btn btn-sm btn-soft-danger d-flex align-items-center" onClick={() => delete_endpoint(item)} >
                                                <i className="bx bx-trash font-size-12"></i>
                                            </Button>
                                            <UncontrolledTooltip placement="top" target={`delete-tooltip-${item.id}`}>
                                                Delete
                                            </UncontrolledTooltip>
                                        </>
                                    </>)

                            }

                            <Button id={`view-detail-tooltip-${item.id}`} className="btn btn-sm btn-soft-primary d-flex align-items-center" onClick={() => editEOPT(item)}>
                                <i className="bx bx-right-arrow-alt font-size-14"></i>
                            </Button>
                            <UncontrolledTooltip placement="top" target={`view-detail-tooltip-${item.id}`}>
                                View Details
                            </UncontrolledTooltip>



                        </div>
                    )
                },
            },
        ].filter(Boolean), []);








    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Manage Location | AuditVista</title>
                </MetaTags>
                <Container fluid>
                    {
                        dataloaded ? (<>
                            <Breadcrumbs
                                title={props.t("Manage Locations")}
                                breadcrumbItem={props.t("Manage Locations")}
                            />

                            <div className="d-xl-flex">
                                <div className="w-100">
                                    <div className="d-md-flex">

                                        <Card className="me-md-2  pb-3" style={{ maxWidth: 235, height: '87vh', overflowY: "auto" }}>

                                            <CardBody style={{ overflow: 'auto' }} >

                                                <Row className="mb-3">

                                                    {canEdit && (
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <Button type="button" color="primary" className="btn btn-sm waves-effect waves-light"
                                                                onClick={() => {
                                                                    setLabelWindow(true)
                                                                    setBtnLoad(false)
                                                                }} >
                                                                <i className="mdi mdi-domain text-white font-size-16" /> Create Location Group
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Row>
                                                {/* <Row className="mb-3" > */}
                                                <Row className="mb-3">
                                                    <Label>Groups</Label>
                                                    <FuzzySearch
                                                        searchFiles={searchGroupName}
                                                        getFuzzySearch={(searchFiles) => getFuzzySearch(searchFiles, '2')}
                                                        dup_search_files={dupSearchGroupName}
                                                        temp_search_files={dupTempSearchGroup}
                                                        keyword={['label_name']}
                                                    />

                                                </Row>

                                                {/* </Row> */}
                                                <div className="mail-list mt-4" style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                                                    <div
                                                        className={`btn btn-sm col-12 border-bottom py-1 ${!selectedLabel ? 'btn-primary' : 'btn-white'}`}
                                                        style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}
                                                        onClick={() => { loadEOPTS() }}
                                                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#556EE6'; e.target.style.color = '#FFF' }}
                                                        onMouseLeave={(e) => { e.target.style.backgroundColor = ''; e.target.style.color = '' }}
                                                    >
                                                        <i className="mdi mdi-circle text-secondary font-size-10" />
                                                        &nbsp;&nbsp;ALL
                                                    </div>

                                                    <div className="row">
                                                        {labelData?.map((item, idx) => (
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
                                                                    <i style={{ color: item.label_color }} className="mdi mdi-circle font-size-10" /> &nbsp;&nbsp;{item.label_name}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                </div>
                                            </CardBody>
                                        </Card>

                                        <div className="w-100" style={{ height: '87vh', overflowY: "auto", overflowX: "hidden" }}>
                                            <Row style={{}}>
                                                <Col lg="12">

                                                    {
                                                        tableDataloaded ?

                                                            <Card>
                                                                <CardBody>
                                                                    <TableContainer
                                                                        columns={columns}
                                                                        data={statusBasedFilteredData}
                                                                        isGlobalFilter={true}
                                                                        isAddOptions={false}
                                                                        isJobListGlobalFilter={false}
                                                                        customPageSize={10}
                                                                        style={{ width: '100%' }}
                                                                        selectedEOPT={selectedEOPT}
                                                                        labelDefault={labelDefault}
                                                                        search_group_name={searchGroupName}
                                                                        getFuzzySearch={(search_files) => getFuzzySearch(search_files, '1')}
                                                                        dup_search_group_name={dupSearchGroupName}
                                                                        dup_temp_search_group={dupTempSearchGroup}
                                                                        dup_labelData={dupLabelData}
                                                                        dynamicBtn={true}
                                                                        btnClick={() => {
                                                                            setOpen(true)
                                                                            setEOPT(null)
                                                                        }}
                                                                        moveToLabel={(data) => { moveToLabel(data) }}
                                                                        removeFromLabel={() => { removeFromLabel() }}
                                                                        confirmDelete={() => {
                                                                            setconfirmBoth(true)

                                                                        }}
                                                                        resultData={resultData}
                                                                        toggle2={(e) => toggle2(e)}
                                                                        isAllSelected={isAllSelected}
                                                                        btnName={"Add Location"}
                                                                        isPagination={true}
                                                                        iscustomPageSizeOptions={false}
                                                                        filterable={false}
                                                                        tableClass="table align-middle table-nowrap table-hover"
                                                                        theadClass="table-light"
                                                                        paginationDiv="col-sm-12 col-md-7"
                                                                        pagination="pagination justify-content-end pagination-rounded"
                                                                    />
                                                                </CardBody>
                                                            </Card>


                                                            : null
                                                    }



                                                </Col>
                                            </Row>
                                        </div>



                                    </div>
                                </div>
                            </div>





                        </>)
                            :
                            (<>
                                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
                                    <div>Loading...</div>
                                    <Spinner color="primary" />
                                </div>


                            </>)
                    }

                </Container>
                <Modal
                    isOpen={labelWindow}
                >
                    <ModalHeader toggle={toggle2} tag="h5">
                        Create Group
                    </ModalHeader>
                    <ModalBody>
                        <AvForm
                            onValidSubmit={handleValidSubmit}
                        >
                            <Row form>
                                <Col className="col-12">
                                    <div className="mb-3">
                                        <AvField
                                            name="label_name"
                                            label="Group Name"
                                            type="text"
                                            onChange={(e) => { handleGroupName(e) }}
                                            errorMessage="Invalid name"
                                            validate={{ required: { value: true }, }}
                                        />
                                        {
                                            groupNameErr &&
                                            <div className="text-danger" style={{ fontSize: 'smaller' }}>Group name already exist, Enter a new one.</div>
                                        }
                                    </div>
                                </Col>


                            </Row>
                            <Row>
                                <Col>
                                    <div className="text-end">

                                        <button type="submit" className="btn btn-sm btn-outline-success save-user" disabled={btnLoad || groupNameErr} >
                                            {
                                                btnLoad &&
                                                <LoadingOutlined />
                                            }
                                            {
                                                btnLoad ? "..." : "Submit"
                                            }


                                        </button>
                                    </div>
                                </Col>
                            </Row>



                        </AvForm>
                    </ModalBody>



                </Modal>
                <Offcanvas
                    isOpen={open}
                    toggle={onDrawerClose}
                    direction="end" // 'end' for right-side sliding
                    style={{ width: '500px', zIndex: 9999 }}
                >
                    <OffcanvasHeader toggle={onDrawerClose}>
                        Manage Endpoint Node
                    </OffcanvasHeader>
                    <OffcanvasBody style={{ padding: '5px', maxHeight: height, overflow: 'auto' }}>
                        {open && (
                            <AddEndpointNode
                                endpoints={statusBasedFilteredData}
                                onClose={onDrawerClose}
                                editItem={eopt}
                                onCancel={onDrawerClose}
                            />
                        )}
                    </OffcanvasBody>
                </Offcanvas>



                {/* {confirmBoth && (
                    <SweetAlert
                        title="Are you sure?"
                        warning
                        showCancel
                        confirmBtnBsStyle="success"
                        cancelBtnBsStyle="danger"
                        onConfirm={() => {
                            setconfirmBoth(false);
                            setSuccessDlg(true);
                            setDynamicTitle("Deleted");
                            setDynamicDescription("Your file has been deleted.");
                            deleteLabel();
                            // getUserList();
                        }}
                        onCancel={() => {
                            setconfirmBoth(false);
                            setErrorDlg(true);
                            setDynamicTitle("Cancelled");
                            setDynamicDescription("Your imaginary file is safe :)");
                        }}
                        style={{
                            icon: { fontSize: "10px" },
                        }}
                    >
                        You won't be able to revert this !!!!!!!!
                    </SweetAlert>
                )
                } */}
            </div>



        </React.Fragment>
    );
};

ManageLocations.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
};

export default withTranslation()(ManageLocations);