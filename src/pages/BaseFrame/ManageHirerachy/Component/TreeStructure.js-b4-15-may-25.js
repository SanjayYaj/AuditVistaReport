import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container, Input, Row, Col,
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
    UncontrolledTooltip, Label, DropdownMenu, DropdownToggle, UncontrolledDropdown, Tooltip, UncontrolledAlert
} from "reactstrap"
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import QRCode from 'react-qr-code';
import SortableTree from '@nosferatu500/react-sortable-tree';
import '../CSS/style.css';
import { Space, Badge, Tag } from 'antd'
import Select from 'react-select';
import Breadcrumbs from '../../../../components/Common/Breadcrumb';
import { FaMapMarkerAlt, FaFireExtinguisher } from 'react-icons/fa';
import store from '../../../../store'
import Swal from 'sweetalert2';
import { Popconfirm } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import urlSocket from '../../../../helpers/urlSocket';
import { addNode, crudNode, setnodeUsers, getFlatNodeInfo, setnodeInfo, getHdata, updateNodeFlatCln, publishHStructure, dndNode, setMenuName, saveTreeData, getTreeFromFlatDataAsync, setTreeData, saveData, deleteNode, getNodeData, setState, updateTreeData, editNode, updateNode, onTreeChange, treeDataToFlat, addNodeUser, setShowQr, setGenerate } from '../../../../toolkitStore/Auditvista/audit/htree'
import { usePermissions } from 'hooks/usePermisson';


const CustomDragHandle = ({ node }) => {
    return (
        <div className="custom-drag-handle">
            {node.isFolder ? '📦' : '📄'} {/* Dynamic Icon */}
        </div>
    );
};


const TreeStructure = (props) => {

    const { canView, canEdit } = usePermissions("hirchy");
    // const canEdit =false

    const dispatch = useDispatch();
    const history = useNavigate()
    const [dataLoaded, setDataLoaded] = useState(false);
    const [dropdownStates, setDropdownStates] = useState({});
    const [dropdownStatesEdit, setdropdownStatesEdit] = useState({});
    const [createNewCat, setcreateNewCat] = useState(false)
    const [validErr, setvalidErr] = useState(false)
    const [getSubTitledd, setgetSubTitledd] = useState("")
    const [enableCode, setenableCode] = useState(true)
    const [hInfo, setHinfo] = useState(JSON.parse(sessionStorage.getItem("hInfo")))
    const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
    const [clientInfo, setclientInfo] = useState(JSON.parse(sessionStorage.getItem("client_info")))[0]
    const [catListInfo, setcatListInfo] = useState([])
    const [viewUsers, setviewUsers] = useState(false)
    const [editCatName, seteditCatName] = useState(false)
    const [codeErrorEnabled, setcodeErrorEnabled] = useState(false)
    const [codeError, setcodeError] = useState('')
    const [invalidTittle, setinvalidTittle] = useState(false)
    const [selectedNodeType, setselectedNodeType] = useState("")
    const [showDrawer, setShowDrawer] = useState(false)
    const [enableQr, setenableQr] = useState(false)
    const qrRef = useRef(null); // Ref for the QR code container
    const [qrBase64, setQrBase64] = useState(''); // State to store base64 value
    const [blobUrl, setBlobUrl] = useState("")
    const [assetStartDate, setassetStartDate] = useState("")
    const editRef = useRef()

    const levelColor = ["#03045e", "#023e8a", "#0077b6", "#0096c7", "#00b4d8", "#48cae4", "#90e0ef"]

    const optionRef = useRef()
    const formRef = useRef()


    const treeData = useSelector(updateTreeData);
    const state = useSelector(state => state.HtreeData);
    const nodeUsers = state.nodeUsers
    const nodeInfo = state.nodeInfo
    const toggle = () => {
        dispatch(setState({ mainToggle: !state.mainToggle }));
    };


    useEffect(() => {
        console.log("trigger");
        dispatch(getHdata())
        setDataLoaded(true)
    }, [])


    useEffect(() => {
        var catList = listOutCategory()
        setcatListInfo(catList)
    }, [state.treeData])


    const checkNodeValidation = async (values) => {
        var getCode = String(values.code).replace(/\s/g, '').toLowerCase()
        var flat_data = treeDataToFlat(state.treeData)
        var flat_data = _.map(flat_data, 'node')
        if (state.crudStatus == 2) {



        }
        else {
            var getCodeValue = _.findIndex(flat_data, function (o) { if (String(o.code).replace(/\s/g, '').toLowerCase() == getCode) { return true } else { return false } });
            console.log(getCodeValue, 'getCodeValue')
            if (getCodeValue !== -1) {

                setcodeErrorEnabled(true)
                setcodeError("Code is already available")
                return true
            }
            else {
                return false
            }
        }
    }


    const crudNodeInfo = async (event, values) => {

        var validateNode = false
        if (enableCode) {
            validateNode = await checkNodeValidation(values)
        }
        if (!validateNode) {
            if (state.crudStatus === 0) {
                values["parent"] = null
                values["h_id"] = hInfo._id
                values["company_id"] = hInfo.company_id
                values["company_name"] = hInfo.company_name
                values["owner_id"] = authUser.user_data._id
                values["node_level"] = state.path.length,
                    values["category_input"] = values.subtitledd == "0" || values.subtitledd === "" ? false : true
            }
            if (state.crudStatus === 1) {
                if (values.subtitledd === "0") {
                    values.subtitledd = ""
                }
                values["parent"] = nodeInfo.id
                values["child_id"] = []
                values["h_id"] = hInfo._id
                values["company_id"] = hInfo.company_id
                values["company_name"] = hInfo.company_name
                values["owner_id"] = authUser.user_data._id
                values["user_path"] = []
                values["unique_users"] = []
                values["node_level"] = state.path.length,
                    values["subtitle"] = values.subtitledd == "" || (values.subtitledd === "1" && values.subtitle === "") ? "Level " + (state.path.length + 1) : values.subtitledd === "1" ? values.subtitle : values.subtitledd
                values["category_input"] = (values.subtitledd !== "" && values.subtitledd !== "0") || (values.subtitledd == "1" && values.subtitle !== "") ? true : false
                values["node_positon"] = "Level " + (state.path.length + 1)

            }
            if (values.h_node_type) {
                values["h_node_type"] = _.find(clientInfo.h_node_type, { id: values.h_node_type })
            }
            if (!state.generate) {
                const action = state.crudStatus === 2 ? updateNode : crudNode;
                console.log(values, 'values', state);
                dispatch(action(values));
            }
            else {
                const action = updateNode
                console.log(values, 'values', state);
                dispatch(action(values));
            }
        }


    }



    const toggleToolTip = (targetName) => {
        // console.log('called..')
    };

    const handleTreeChange = (newTreeData) => {
        if (canEdit) {
            onTreeChange(newTreeData, dispatch);
        }
    };

    const toggleDropdown = (id) => {
        setDropdownStates({
            ...dropdownStates,
            [id]: !dropdownStates[id] // Toggle the state for the clicked dropdown menu
        });
        setcodeError('')
        setcodeErrorEnabled(false)
    };

    const toggleDropdownEdit = (id) => {
        setdropdownStatesEdit({
            ...dropdownStatesEdit,
            [id]: !dropdownStatesEdit[id] // Toggle the state for the clicked dropdown menu
        });
    };


    const selectCat = (event, mode) => {
        console.log(event, mode)
        if (mode === undefined) {
            setcreateNewCat(event.target.value == "1" ? true : false)
            setgetSubTitledd(event.target.value)
        }
        else {
            optionRef.current.value = "0"
            setcreateNewCat(false)

        }

    }

    const selectCat1 = (event, mode) => {
        setgetSubTitledd(event.target.value)

    }


    const deleteAllUsers = async (userNodeInfo, db_info) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'Do you want to  delete this?',
            showCancelButton: true,
            confirmButtonColor: '#2ba92b',
            confirmButtonText: 'Yes',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {

                try {
                    const responseData = await urlSocket.post("webhstre/update-flat-child", {
                        h_id: userNodeInfo.h_id,
                        encrypted_db_url: db_info.encrypted_db_url,
                        nodeInfo: userNodeInfo,
                        selectedUsers: [userNodeInfo.unique_users],
                        remove_all: true
                    })
                    console.log(responseData, 'responseData')
                    if (responseData.data.response_code === 500) {
                        dispatch(getHdata())
                        setDropdownStates({
                        });
                        setdropdownStatesEdit({
                        });

                    }

                } catch (error) {
                    console.log(error, 'error')
                }


            }
        })

    }

    const listOutCategory = () => {
        console.log(state.treeData, 'state.treeData')
        var flatData = _.map(treeDataToFlat(state.treeData), item => {
            return item.node.subtitle
        })

        var uniqueHlevels = _.uniqBy(flatData)
        return uniqueHlevels
    }


    const gotoBack = () => {
        history("/hirchy")
    }

    const editCat = (data) => {
        console.log(data, 'data')
        setgetSubTitledd(data.value)
        seteditCatName(true)
        setcreateNewCat(true)
    }


    const validateNodeName = (event) => {
        var validate_node = _.filter(state.treeData, { node_level: 0 })
        const formattedNameToValidate = event.target.value.replace(/\s/g, '').toLowerCase();
        const isNameValid = validate_node.some((name) =>
            name.title.replace(/\s/g, '').toLowerCase() === formattedNameToValidate
        );
        setinvalidTittle(isNameValid)
    }


    const validateSubmenuName = (e) => {
        if (nodeInfo.children !== undefined) {
            if (nodeInfo.children.length > 0) {
                var validate_node = nodeInfo.children.filter((e) => e.node_level == (nodeInfo.node_level + 1))
                const formattedNameToValidate = e.target.value.replace(/\s/g, '').toLowerCase();

                const isNameValid = validate_node.some((name) =>
                    name.title.replace(/\s/g, '').toLowerCase() === formattedNameToValidate
                );
                setinvalidTittle(isNameValid)
            }
            else {

                var flatData = treeDataToFlat(state.treeData)
                const filter_same_lvl_data = flatData.filter(item =>
                    item.node_level === nodeInfo.node_level && item.title !== nodeInfo.title
                );

                console.log(filter_same_lvl_data, 'filter_same_lvl_data')

                const formattedNameToValidate = e.target.value.replace(/\s/g, '').toLowerCase();

                const isNameValid = filter_same_lvl_data.some((name) =>
                    name.title.replace(/\s/g, '').toLowerCase() === formattedNameToValidate
                );
                setinvalidTittle(isNameValid)
            }
        }
    }

    const saveHStructure = async () => {
        var flatData = await saveTreeData(state.treeData, state.totalHLength, dispatch)

    }

    const upDateCatName = (flatData, values) => {
        console.log(values, 'values')
        return flatData.map((data) => {
            if (data.subtitle === nodeInfo.subtitle) {
                return {
                    ...data,
                    subtitle: values.subtitle
                };
            }
            return data;
        });
    }

    const generateQr = async () => {
        setenableQr(true)
        const formInputs = formRef.current._inputs;
        const formValues = {};
        for (const key in formInputs) {
            if (formInputs.hasOwnProperty(key)) {
                formValues[key] = formInputs[key].getValue();
            }

        }
        console.log(formValues, 'formValues', selectedNodeType, qrRef)
        if (state.crudStatus === 2) {
            formValues["flat_ref_id"] = state.getNodeInfo.flat_ref_id
            formValues["subtitle"] = state.getNodeInfo.subtitle

        }

        if (selectedNodeType === "2") {
            if (formValues.asset_desc !== "" && formValues.asset_expiry_on !== "" && formValues.asset_placed_on !== "" && formValues.asset_s_no !== "") {
                setvalidErr(false)
                formValues["generate_qr"] = true
                generateQrSubmitInfo(formValues)
            }
            else {

                setvalidErr(true)
            }
        }
        else if (selectedNodeType === "1") {
            formValues["generate_qr"] = true
            generateQrSubmitInfo(formValues)

        }
    }


    const submitInfo = async (event, values) => {
        var state = store.getState().HtreeData
        if (state.generate === true) {
            values["flat_ref_id"] = state.crudStatus === 2 ? state.getNodeInfo.flat_ref_id : state.newNodeInfo._id
            values["subtitle"] = state.crudStatus === 2 ? state.getNodeInfo.subtitle : state.newNodeInfo.hlevel
        }

        if (state.generate) {
            dispatch(setShowQr(""))
            setTimeout(async () => {
                await crudNodeInfo(undefined, values)
                setShowDrawer(false)

            }, 300);
        }
        else {
            if (values.h_node_type === "Select") {
                setvalidErr(true)
            }
            else {
                await crudNodeInfo(undefined, values)
                setShowDrawer(false)
            }

        }

        dispatch(setGenerate(false))
        dispatch(setShowQr(""))

    }


    const generateQrSubmitInfo = async (values) => {
        var state = store.getState().HtreeData
        console.log(state, values, 'values')

        if (state.generate) {
            console.log(editRef, 'editRef')
            dispatch(setShowQr(""))
            setTimeout(async () => {
                await crudNodeInfo(undefined, values)


            }, 300);
        }
        else {
            await crudNodeInfo(undefined, values)

        }
    }


    const truncateText = (text, length) => {
        if (text?.length > length) {
            return text.substring(0, length) + '...';
        }
        return text;
    };


    const selectNodeType = (event) => {
        const selectedValue = event.target.value;
        console.log(selectedValue, 'event');
        setselectedNodeType(selectedValue);

        const { asset_s_no, asset_desc, loc_lat, loc_long } = formRef.current._inputs || {};

        if (asset_s_no) asset_s_no.value = "";
        if (asset_desc) asset_desc.value = "";
        if (loc_lat) loc_lat.value = "";
        if (loc_long) loc_long.value = "";
    }


    const handleInvalidSubmit = (event, errors, values) => {
        console.log('Form Errors:', errors);
        console.log('Form Values:', values);
        setenableQr(false)
    };



    const getUpdateChild = async (userNodeInfo, db_info, selectedUsers) => {

        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'Do you want to  delete this?',
            showCancelButton: true,
            confirmButtonColor: '#2ba92b',
            confirmButtonText: 'Yes',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const responseData = await urlSocket.post("webhstre/update-flat-child", {
                        h_id: userNodeInfo.h_id,
                        encrypted_db_url: db_info.encrypted_db_url,
                        nodeInfo: userNodeInfo,
                        selectedUsers: [selectedUsers],
                        remove: true
                    })
                    console.log(responseData, 'responseData')
                    if (responseData.data.response_code === 500) {
                        dispatch(getHdata())
                        setDropdownStates({
                        });
                        setdropdownStatesEdit({
                        });

                    }

                } catch (error) {
                    console.log(error, 'error')
                }
            }
        })

    }



    const downloadImageAsPDF = async (imageUrl, flatInfo) => {
        try {

            const response = await fetch(imageUrl, { mode: 'cors' });
            const blob = await response.blob();


            const img = new Image();
            img.src = URL.createObjectURL(blob);

            img.onload = () => {

                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height + 70;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height);
                ctx.font = "15px Arial";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                const textYPosition = img.height + 30;
                if (flatInfo.h_node_type?.id === "2") {
                    ctx.fillText("Asset SI: No: " + flatInfo.asset_s_no, canvas.width / 2, textYPosition);
                    ctx.fillText(flatInfo.h_node_type.name + " Name: " + flatInfo.hlevel_name, canvas.width / 2, textYPosition + 20);
                }
                else if (flatInfo.h_node_type?.id === "1") {
                    ctx.fillText(flatInfo.h_node_type.name + "Name: " + flatInfo.hlevel_name, canvas.width / 2, textYPosition + 20);
                }

                canvas.toBlob((canvasBlob) => {
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(canvasBlob);
                    link.download = flatInfo.qr_name;


                    document.body.appendChild(link);
                    link.click();


                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                }, "image/jpeg");
            };

            img.onerror = (error) => {
                console.error("Error loading image:", error);
            };
        } catch (error) {
            console.error("Error fetching image:", error);
        }
    };



    const calculateMaxDate = () => {
        const assetStartDateInfo = assetStartDate
        console.log(assetStartDateInfo, 'assetStartDateInfo')
        if (assetStartDateInfo === '' || assetStartDateInfo === undefined) {
            return null; // Return null if start date is not set
        }

        const startDate = new Date(assetStartDateInfo);
        startDate.setFullYear(startDate.getFullYear() + 2);

        return startDate.toISOString().slice(0, 10); // Format the date as "YYYY-MM-DD"
    }

    const customStyles = {
        container: (provided) => ({
            ...provided,
            zIndex: 999, // Ensures the dropdown appears above other elements
        }),
        control: (provided) => ({
            ...provided,
            backgroundColor: '#f8f9fa', // Set custom background color for the control
            borderColor: '#ced4da',
            boxShadow: 'none',
            ':hover': {
                borderColor: '#adb5bd',
            },
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 999, // Ensure dropdown menu is above other content
            backgroundColor: '#ffffff', // Dropdown menu background color
        }),
    };


    return (
        <React.Fragment>
            {dataLoaded && !state.apiRequestLoading ? (
                <>
                    <Breadcrumbs
                        title={"Hierarchy / " + hInfo.hname}
                        breadcrumbItem="Roles"
                        isBackButtonEnable={true}
                        gotoBack={() => gotoBack()}
                    />
                    <Container fluid>
                        <div className="d-flex flex-row" style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
                            <div style={{ background: "white", width: "100%", transition: "width .35s ease-in-out", position: "absolute", float: "left", }} className="p-3 me-2" >

                                <div className="row" style={{ borderBottom: "1px solid #dedede" }}>
                                    <div className="mb-2 col-10 ">
                                        <UncontrolledDropdown isOpen={state.mainToggle} toggle={toggle}>
                                            {canEdit && (<>
                                                <DropdownToggle className="btn btn-sm btn-buttonPrimaryE d-flex align-items-center" color="#eff2f7" onClick={() => { dispatch(setState({ path: [], crud: true, crudStatus: 0, type: 0, children: [], mainToggle: true })); setenableCode(false); setinvalidTittle(false) }} >
                                                    <i className="bx bx-plus me-1" style={{ fontSize: '16px' }} />Create Location
                                                </DropdownToggle>
                                            </>)}
                                            <DropdownMenu style={{ width: 250 }} className="">
                                                <div className="px-4">
                                                    <AvForm onValidSubmit={crudNodeInfo}>
                                                        <div className="my-2">
                                                            <AvField name="title" label="Location Name "
                                                                placeholder="Enter Location Name" type="text" errorMessage="Enter Location Name" validate={{ required: { value: true }, }}
                                                                defaultValue={""}
                                                                onChange={(e) => { dispatch(setMenuName(e.target.value)); validateNodeName(e) }} />
                                                        </div>
                                                        {
                                                            invalidTittle &&
                                                            <div style={{ fontSize: 'smaller' }} className='text-danger'>Location name should not same</div>
                                                        }

                                                        <div className="my-2">
                                                            <AvField
                                                                name="code"
                                                                label="Location Code"
                                                                type="text"
                                                                validate={{
                                                                    required: {
                                                                        value: false,
                                                                    },
                                                                }}
                                                                onChange={() => { setcodeError(''); setcodeErrorEnabled(false) }}
                                                                placeholder="Enter Location Code"
                                                            />
                                                        </div>
                                                        <div className="mb-3">

                                                            <Label className="" htmlFor="autoSizingSelect">Label as</Label>
                                                            {

                                                                <AvInput
                                                                    type="select"
                                                                    name="subtitledd"
                                                                    label="Name"
                                                                    className="form-select"
                                                                    id="cat"
                                                                    ref={optionRef}
                                                                    onChange={(e) => selectCat(e)}
                                                                >
                                                                    <option value="0" defaultValue>Choose...</option>
                                                                    <option value="1"  >Create New</option>
                                                                    {
                                                                        catListInfo.map((data, idx) => {
                                                                            return (
                                                                                <option value={data} selected key={idx}>{data}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </AvInput>
                                                            }
                                                            {
                                                                createNewCat ?
                                                                    <AvField
                                                                        name="subtitle"
                                                                        className='mt-2'
                                                                        type="text"
                                                                        required
                                                                        placeholder="Enter New Label"
                                                                    />
                                                                    :
                                                                    null
                                                            }

                                                        </div>

                                                        <div >
                                                            <Row>
                                                                <Col>
                                                                    <AvField
                                                                        name="lat"
                                                                        label="Latitude"
                                                                        type="text"
                                                                        validate={{
                                                                            required: {
                                                                                value: false,
                                                                            },
                                                                        }}
                                                                        onChange={() => { setcodeError(''); setcodeErrorEnabled(false) }}
                                                                        placeholder="Enter latitude"
                                                                    />
                                                                </Col>
                                                                <Col>
                                                                    <AvField
                                                                        name="long"
                                                                        label="Longitude"
                                                                        type="text"
                                                                        validate={{
                                                                            required: {
                                                                                value: false,
                                                                            },
                                                                        }}
                                                                        onChange={() => { setcodeError(''); setcodeErrorEnabled(false) }}
                                                                        placeholder="Enter Longitude"
                                                                    />
                                                                </Col>
                                                            </Row>

                                                        </div>

                                                        <div className="my-2">
                                                            <AvField
                                                                name="address"
                                                                label="Address"
                                                                type="textarea"
                                                                validate={{
                                                                    required: {
                                                                        value: false,
                                                                    },
                                                                }}
                                                                onChange={() => { setcodeError(''); setcodeErrorEnabled(false) }}
                                                                placeholder="Enter Address"
                                                            />
                                                        </div>




                                                        <div className="mt-3 text-end">
                                                            <button disabled={invalidTittle} className="btn btn-sm btn-outline-primary btn-block m-1" type="submit" style={{ marginRight: 5 }}>
                                                                Add Level
                                                            </button>
                                                        </div>
                                                    </AvForm>
                                                </div>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>

                                </div>

                                {/* ------- React Sortable Tree ---------*/}
                                <div style={{ overflow: "auto", height: "90vh", }}>

                                    <SortableTree
                                        treeData={treeData}
                                        onChange={handleTreeChange}
                                        // onMoveNode={(object) => dispatch(dndNode(object))}
                                        onMoveNode={(object) => {
                                            if (canEdit) {
                                                dispatch(dndNode(object));
                                            }
                                        }}
                                        // canDrop={(object) => object.nextParent !== undefined && object.nextParent.type == 2 ? false : true}
                                        canDrop={(object) => {
                                            if (!canEdit) return false;
                                            return object.nextParent !== undefined && object.nextParent.type == 2 ? false : true;
                                        }}
                                        scaffoldBlockPxWidth={40}
                                        slideRegionSize={25}
                                        generateNodeProps={({ node, path }) => {
                                            const updatedPath = [...path];
                                            return {
                                                listIndex: 0,
                                                lowerSiblingCounts: [],
                                                rowdirection: "rtl",
                                                canDrop: node.type == 2 ? false : true,
                                                // className: "icon-drag",
                                                icon: node.isFolder ? <span>📁</span> : <span>📄</span>,
                                                onClick: (event) => {
                                                    if (event.target.className.includes("collapseButton") || event.target.className.includes("expandButton")) {
                                                    } else {
                                                        dispatch(getNodeData(node));
                                                    }
                                                },
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: "row",
                                                    // border: '1px solid #c3cacd',
                                                    gap: 5,
                                                },
                                                title: (
                                                    <div>
                                                        <div style={{ maxWidth: 450 }} key={`div-${node.id}`}>
                                                            {state.editcrud && state.id === node.id ? (
                                                                <div>
                                                                    <Tooltip
                                                                        placement="bottom"
                                                                        target={`btn-${node.id}`}
                                                                        toggle={() => toggleToolTip(`btn-${node.id}`)}
                                                                    >
                                                                        {node.title}


                                                                    </Tooltip>
                                                                    <Link
                                                                        to="#"
                                                                        id={`btn-${node.id}`}
                                                                        style={{ fontSize: 12, fontWeight: 400 }}
                                                                    >
                                                                        {String(node.title).slice(0, 40) +
                                                                            (node.title?.length > 40 ? "..." : "")} &nbsp;
                                                                    </Link>
                                                                </div>

                                                            ) : (
                                                                <div>
                                                                    <Tooltip
                                                                        placement="bottom"
                                                                        target={`btn-${node.id}`}
                                                                        toggle={() => toggleToolTip(`btn-${node.id}`)}
                                                                    >
                                                                        {node.title}
                                                                    </Tooltip>
                                                                    <Link
                                                                        to="#"
                                                                        id={`btn-${node.id}`}
                                                                        style={{ fontSize: 12, fontWeight: 400 }}
                                                                    >
                                                                        {String(node.title).slice(0, 40) +
                                                                            (node.title?.length > 40 ? "..." : "")} &nbsp;
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ),
                                                subtitle: (
                                                    <div style={{ height: '100%', width: '100%', marginTop: 4, marginLeft: node.type == 1 || node.type == 2 ? 28 : 0 }} >
                                                        {node.cat_type === undefined ? node.node_positon !== node.subtitle ? node.subtitle + " (" + node.node_positon + ")" : node.subtitle : node.cat_type == "1" ? "Auditer" : node.cat_type == "2" ? "Reviewer" : node.cat_type == "3" ? "External Auditer" : "NA"}
                                                    </div>),
                                                buttons: [
                                                    <Row className="" key={node.id}>

                                                        <ul className="list-unstyled hstack gap-1 mb-0 justify-content-end">

                                                            <UncontrolledDropdown direction="end" isOpen={dropdownStatesEdit[node.id]} toggle={() => toggleDropdownEdit(node.id)}>

                                                                <DropdownToggle className="card-drop" tag="a">
                                                                    {
                                                                        canEdit && (<>

                                                                            <Link to="#" className="btn btn-sm btn-soft-primary" id={`viewtooltips-${node.id}`} ref={editRef} onClick={async () => {
                                                                                var flatInfo = await dispatch(getFlatNodeInfo(node));
                                                                                console.log(flatInfo, 'flatInfo', node);
                                                                                if (flatInfo) {
                                                                                    var nodeInfoData = _.cloneDeep(node)
                                                                                    nodeInfoData["loc_lat"] = flatInfo.loc_lat
                                                                                    nodeInfoData["loc_long"] = flatInfo.loc_long
                                                                                    nodeInfoData["asset_expiry_on"] = flatInfo.asset_expiry_on
                                                                                    nodeInfoData["asset_desc"] = flatInfo.asset_desc
                                                                                    nodeInfoData["asset_placed_on"] = flatInfo.asset_placed_on
                                                                                    nodeInfoData["asset_s_no"] = flatInfo.asset_s_no
                                                                                    nodeInfoData["qr_name"] = flatInfo.qr_name
                                                                                    nodeInfoData["subtitle"] = flatInfo.hlevel
                                                                                    dispatch(setnodeInfo(nodeInfoData))
                                                                                    dispatch(setShowQr(flatInfo.qr_name))
                                                                                }
                                                                                setShowDrawer(true);
                                                                                setcreateNewCat(false);
                                                                                setgetSubTitledd("");
                                                                                setselectedNodeType(node.h_node_type?.id); dispatch(editNode(updatedPath, node)); setenableCode(false)
                                                                            }}
                                                                                style={{ padding: "2px 5px" }}
                                                                            >
                                                                                <i className="mdi mdi-square-edit-outline font-size-16" />
                                                                                <UncontrolledTooltip placement="top" target={`viewtooltips-${node.id}`}>
                                                                                    {node.type === 0 ? "Edit Level" : "Edit Sub Level"}
                                                                                </UncontrolledTooltip>
                                                                            </Link>
                                                                        </>)}
                                                                </DropdownToggle>
                                                            </UncontrolledDropdown>

                                                            {node.type === 0 && (
                                                                <UncontrolledDropdown direction="end" isOpen={dropdownStates[node.id]} toggle={() => toggleDropdown(node.id)}>
                                                                    {
                                                                        canEdit && (<>
                                                                            <DropdownToggle className="card-drop" tag="a">
                                                                                <Link to="#" className="btn btn-sm btn-soft-secondary" id={`viewtooltip-${node.id}`} onClick={() => {
                                                                                    dispatch(setShowQr(""));
                                                                                    setvalidErr(false);
                                                                                    setcreateNewCat(false)
                                                                                    setgetSubTitledd("");
                                                                                    // setShowDrawer(true); 
                                                                                    setselectedNodeType(""); 
                                                                                    dispatch(addNode(node, updatedPath, 0)); 
                                                                                    dispatch(setnodeInfo(node)); 
                                                                                    setenableCode(false); 
                                                                                    setinvalidTittle(false);
                                                                                    dispatch(setGenerate(false))

                                                                                }}
                                                                                    style={{ padding: "2px 5px" }}
                                                                                >
                                                                                    <i className="mdi mdi-domain-plus font-size-16" />
                                                                                    <UncontrolledTooltip placement="top" target={`viewtooltip-${node.id}`}>
                                                                                        Add Location
                                                                                    </UncontrolledTooltip>
                                                                                </Link>
                                                                            </DropdownToggle>
                                                                            <DropdownMenu className="ms-4 " style={{ minWidth: "500px", zIndex: 2, padding: 10, marginLeft: '13px', marginTop: '-15px' }}>
                                                                                {
                                                                                    state.editcrud ?
                                                                                        <div className="px-4">
                                                                                            <div className="mt-1" style={{ display: 'inline-flex' }}>Edit Sub Level Under</div>
                                                                                            <div title={state.getNodeInfo?.title} className="font-size-13 text-primary mt-2 px-2 py-0" style={{ display: 'inline-flex', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', cursor: 'pointer' }}>
                                                                                                {truncateText(state.getNodeInfo?.title || '', 6)}
                                                                                            </div>
                                                                                            <div className="font-size-11 text-dark" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', cursor: 'pointer' }}>
                                                                                                {truncateText(state.getNodeInfo?.subtitle || '', 6)}
                                                                                            </div>
                                                                                            <AvForm ref={formRef} onValidSubmit={
                                                                                                submitInfo
                                                                                            }>
                                                                                                <div className="my-2">
                                                                                                    <Label className="" htmlFor="autoSizingSelect">Sub Level Name</Label><span className='text-danger'>*</span>
                                                                                                    <AvField
                                                                                                        name="title"
                                                                                                        type="text"
                                                                                                        required
                                                                                                        errorMessage="Enter Sub Level Name"
                                                                                                        placeholder="Enter Sub Level Name"
                                                                                                        value={nodeInfo?.title}
                                                                                                    />
                                                                                                    {
                                                                                                        nodeInfo.parent !== null &&
                                                                                                        <div className="mb-3">
                                                                                                            <Label className="" htmlFor="autoSizingSelect">Define Level:<span className='text-danger'>*</span></Label>
                                                                                                            <AvInput
                                                                                                                type="select"
                                                                                                                name="h_node_type"
                                                                                                                className="form-select"
                                                                                                                id="cat"
                                                                                                                defaultValue={nodeInfo ? nodeInfo.h_node_type?.id : "Select"}
                                                                                                                onChange={(e) => { selectNodeType(e); setvalidErr(false) }}
                                                                                                                required
                                                                                                            >
                                                                                                                <option disabled={true} value={"Select"} defaultValue>Choose...</option>
                                                                                                                {
                                                                                                                    clientInfo.h_node_type?.map((data, idx) => {
                                                                                                                        return (
                                                                                                                            <option value={data.id} selected key={idx}>{data.name}</option>
                                                                                                                        )
                                                                                                                    })
                                                                                                                }
                                                                                                            </AvInput>
                                                                                                        </div>
                                                                                                    }

                                                                                                    <div className='my-2'>
                                                                                                        <Label className="" htmlFor="autoSizingSelect">Category</Label>
                                                                                                        <Select
                                                                                                            styles={customStyles}
                                                                                                            options={catListInfo.map((data, idx) => ({
                                                                                                                label: (
                                                                                                                    <div>
                                                                                                                        {truncateText(data, 6)}
                                                                                                                        <i className="mdi mdi-pencil font-size-12 text-primary me-5"></i>
                                                                                                                    </div>
                                                                                                                ),
                                                                                                                value: data,
                                                                                                            }))}
                                                                                                            value={catListInfo.map(data => ({ label: data, value: data })).find((option) => option.value === nodeInfo?.subtitle)}
                                                                                                            onChange={(e) => editCat(e)}
                                                                                                        />

                                                                                                        {createNewCat &&
                                                                                                            <AvField
                                                                                                                name="subtitle"
                                                                                                                type="text"
                                                                                                                value={getSubTitledd}
                                                                                                                placeholder="Enter New Category"
                                                                                                                required
                                                                                                            />
                                                                                                        }
                                                                                                    </div>

                                                                                                    {(enableCode || nodeInfo?.code) &&
                                                                                                        <div className="mb-3">
                                                                                                            <AvField
                                                                                                                name="code"
                                                                                                                label="Code"
                                                                                                                type="text"
                                                                                                                value={nodeInfo?.code}
                                                                                                                validate={{
                                                                                                                    required: { value: true, errorMessage: "Enter Code" },
                                                                                                                }}
                                                                                                                placeholder="Enter Code"
                                                                                                                onChange={() => { setcodeError(''); setcodeErrorEnabled(false) }}
                                                                                                            />
                                                                                                            {codeErrorEnabled &&
                                                                                                                <Label className="text-danger" style={{ margin: '5px 0 7px 0' }} htmlFor="autoSizingSelect">{codeError}</Label>
                                                                                                            }
                                                                                                        </div>
                                                                                                    }
                                                                                                </div>


                                                                                                {
                                                                                                    selectedNodeType === "1" ?
                                                                                                        <>
                                                                                                            <Label className="" htmlFor="autoSizingSelect">Location Latitude</Label>
                                                                                                            <AvField
                                                                                                                name="loc_lat"
                                                                                                                type="text"
                                                                                                                placeholder="Enter Location Latitude"
                                                                                                                value={nodeInfo.loc_lat ? nodeInfo.loc_lat : ""}
                                                                                                            />

                                                                                                            <Label className="" htmlFor="autoSizingSelect">Location Longitude</Label>

                                                                                                            <AvField
                                                                                                                name="loc_long"
                                                                                                                type="text"
                                                                                                                placeholder="Enter Location Longitude"
                                                                                                                value={nodeInfo.loc_long ? nodeInfo.loc_long : ""}

                                                                                                            />
                                                                                                            {
                                                                                                                console.log(state, 'state')
                                                                                                            }

                                                                                                            <button onClick={() => { dispatch(setGenerate(true)); generateQr() }} type='button' className='btn btn-outline-success btn-sm btn-block m-1'>
                                                                                                                {
                                                                                                                    state.nodeInfo.qr_name === null ?
                                                                                                                        "Generate QR"
                                                                                                                        :
                                                                                                                        !state.generate && state.showQr == "" ? "Generate QR" : "Re Generate QR"}
                                                                                                            </button>
                                                                                                            {

                                                                                                                state.showQr &&
                                                                                                                <div>
                                                                                                                    <img src={clientInfo.base_url + state.showQr} alt="QR Code Preview" style={{ marginTop: '10px', objectFit: "contain", width: '100%', height: '200px' }} />
                                                                                                                </div>

                                                                                                            }
                                                                                                        </>

                                                                                                        :
                                                                                                        selectedNodeType === "2" ?
                                                                                                            <>
                                                                                                                <Label className="" htmlFor="autoSizingSelect">Serial Number</Label><span className='text-danger'>*</span>
                                                                                                                <AvField
                                                                                                                    name="asset_s_no"
                                                                                                                    type="text"
                                                                                                                    required
                                                                                                                    placeholder="Enter Asset Serial Number"
                                                                                                                    errorMessage="Enter Asset Serial Number"
                                                                                                                    value={nodeInfo.asset_s_no ? nodeInfo.asset_s_no : ""}

                                                                                                                />

                                                                                                                <Label className="" htmlFor="autoSizingSelect">Asset Description</Label><span className='text-danger'>*</span>

                                                                                                                <AvField
                                                                                                                    name="asset_desc"
                                                                                                                    type="textarea"
                                                                                                                    required
                                                                                                                    placeholder="Enter Asset Description"
                                                                                                                    errorMessage="Enter Asset Description"
                                                                                                                    value={nodeInfo.asset_desc}

                                                                                                                />
                                                                                                                <Label className="" htmlFor="autoSizingSelect">Asset Placed On</Label><span className='text-danger'>*</span>

                                                                                                                <AvField
                                                                                                                    name="asset_placed_on"
                                                                                                                    type="date"
                                                                                                                    required
                                                                                                                    errorMessage="Select Asset Placed On"
                                                                                                                    value={nodeInfo.asset_placed_on}

                                                                                                                />
                                                                                                                <Label className="" htmlFor="autoSizingSelect">Asset Expire On</Label><span className='text-danger'>*</span>

                                                                                                                <AvField
                                                                                                                    name="asset_expiry_on"
                                                                                                                    type="date"
                                                                                                                    required
                                                                                                                    errorMessage="Select Expire On"
                                                                                                                    value={nodeInfo.asset_expiry_on}

                                                                                                                />


                                                                                                                {
                                                                                                                    selectedNodeType === "2" &&
                                                                                                                    <button onClick={() => { dispatch(setGenerate(true)); generateQr() }} type='button' className='btn btn-outline-primary btn-sm btn-block m-1'>
                                                                                                                        {
                                                                                                                            state.nodeInfo.qr_name === null ?
                                                                                                                                "Generate QR"
                                                                                                                                :
                                                                                                                                !state.generate && state.showQr == "" ? "Generate QR" : "Re Generate QR"}
                                                                                                                    </button>
                                                                                                                }
                                                                                                                {

                                                                                                                    state.showQr &&
                                                                                                                    <div>
                                                                                                                        <img src={clientInfo.base_url + state.showQr} alt="QR Code Preview" style={{ marginTop: '10px', objectFit: "contain", width: '100%', height: '200px' }} />
                                                                                                                    </div>

                                                                                                                }
                                                                                                            </>
                                                                                                            :
                                                                                                            <>
                                                                                                            </>
                                                                                                }


                                                                                                <div className="my-3 text-end">
                                                                                                    <button className='btn btn-outline-danger btn-sm' onClick={() => { setShowDrawer(false); dispatch(setShowQr("")) }} type="button" >
                                                                                                        Close
                                                                                                    </button>
                                                                                                    <button className="btn btn-outline-success btn-sm btn-block m-1" type="submit" >
                                                                                                        {!state.editcrud && !state.generate ? "Create" : "Update"}
                                                                                                    </button>

                                                                                                </div>
                                                                                            </AvForm>
                                                                                        </div>
                                                                                        :
                                                                                        <div className="px-4">
                                                                                            <div className="mt-1" style={{ display: 'inline-flex' }}>Add Sub Level Under</div>
                                                                                            <div title={nodeInfo?.title} className="font-size-13 text-primary mt-2 px-2 py-0" style={{ display: 'inline-flex', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', cursor: 'pointer' }}>
                                                                                                {truncateText(nodeInfo?.title || '', 6)}
                                                                                            </div>
                                                                                            <div title={nodeInfo?.subtitle} className="font-size-11 text-dark" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', cursor: 'pointer' }}>
                                                                                                {truncateText(nodeInfo?.subtitle || '', 6)}
                                                                                            </div>
                                                                                            <AvForm ref={formRef} onValidSubmit={submitInfo} onInvalidSubmit={handleInvalidSubmit}>
                                                                                                <div className="my-2">
                                                                                                    <Label className="" htmlFor="autoSizingSelect">Sub Level Name</Label><span className='text-danger'>*</span>
                                                                                                    <AvField
                                                                                                        name="title"
                                                                                                        type="text"
                                                                                                        required
                                                                                                        placeholder="Enter Sub Level Name"
                                                                                                        errorMessage="Enter Sub Level Name"
                                                                                                        onChange={(e) => validateSubmenuName(e)}
                                                                                                    />
                                                                                                    {
                                                                                                        invalidTittle &&
                                                                                                        <div style={{ fontSize: 'smaller', width: "auto" }} className='text-danger'>Sub Level Name name should not same for same level</div>
                                                                                                    }
                                                                                                    <div className="mb-3">
                                                                                                        <Label className="" htmlFor="autoSizingSelect">Define Level :<span className='text-danger'>*</span></Label>
                                                                                                        <AvInput
                                                                                                            type="select"
                                                                                                            name="h_node_type"
                                                                                                            className="form-select"
                                                                                                            id="cat"
                                                                                                            defaultValue={"Select"}
                                                                                                            onChange={(e) => { selectNodeType(e); setvalidErr(false) }}
                                                                                                            required
                                                                                                        >
                                                                                                            <option disabled={true} value={"Select"} defaultValue>Choose...</option>
                                                                                                            {
                                                                                                                clientInfo.h_node_type?.map((data, idx) => {
                                                                                                                    return (
                                                                                                                        <option value={data.id} selected key={idx}>{data.name}</option>
                                                                                                                    )
                                                                                                                })
                                                                                                            }
                                                                                                        </AvInput>
                                                                                                    </div>
                                                                                                    {
                                                                                                        state.editcrud ?
                                                                                                            <>
                                                                                                            </>
                                                                                                            :
                                                                                                            <>
                                                                                                                <div className="mb-3">
                                                                                                                    <Label className="" htmlFor="autoSizingSelect">Category</Label>
                                                                                                                    <AvInput
                                                                                                                        type="select"
                                                                                                                        name="subtitledd"
                                                                                                                        label="Name"
                                                                                                                        className="form-select"
                                                                                                                        id="cat"
                                                                                                                        ref={optionRef}
                                                                                                                        onChange={(e) => selectCat(e)}
                                                                                                                    >
                                                                                                                        <option value="0" defaultValue>Choose...</option>
                                                                                                                        <option value="1" selected >Create New</option>
                                                                                                                        {
                                                                                                                            catListInfo.map((data, idx) => {
                                                                                                                                return (
                                                                                                                                    <option value={data} selected key={idx}>{data}</option>
                                                                                                                                )
                                                                                                                            })
                                                                                                                        }
                                                                                                                    </AvInput>
                                                                                                                </div>
                                                                                                                {
                                                                                                                    createNewCat ?
                                                                                                                        <AvField
                                                                                                                            name="subtitle"
                                                                                                                            type="text"
                                                                                                                            placeholder="Enter New Category"
                                                                                                                            required
                                                                                                                        />
                                                                                                                        :
                                                                                                                        null
                                                                                                                }

                                                                                                            </>

                                                                                                    }


                                                                                                    {
                                                                                                        selectedNodeType === "1" ?
                                                                                                            <>
                                                                                                                <Label className="" htmlFor="autoSizingSelect">Location Latitude</Label>&nbsp;<span style={{ fontSize: "smaller" }} className='text-danger'>(Precise geographic coordinates for accurate audit tracking and identification of the location)</span>
                                                                                                                <AvField
                                                                                                                    name="loc_lat"
                                                                                                                    type="text"
                                                                                                                    placeholder="Enter Location Latitude"
                                                                                                                />

                                                                                                                <Label className="" htmlFor="autoSizingSelect">Location Longitude</Label><span style={{ fontSize: "smaller" }} className='text-danger'>(Precise geographic coordinates for accurate audit tracking and identification of the location)</span>

                                                                                                                <AvField
                                                                                                                    name="loc_long"
                                                                                                                    type="text"
                                                                                                                    placeholder="Enter Location Longitude"
                                                                                                                />
                                                                                                                {
                                                                                                                    selectedNodeType === "1" &&
                                                                                                                    <>
                                                                                                                        <button onClick={() => {
                                                                                                                            generateQr()
                                                                                                                        }}
                                                                                                                            type='button'
                                                                                                                            className='btn btn-success btn-sm btn-block m-1'>
                                                                                                                            {
                                                                                                                                state.nodeInfo.qr_name === null ?
                                                                                                                                    "Generate QR"
                                                                                                                                    :
                                                                                                                                    !state.generate ? "Generate QR" : "Re Generate QR"}

                                                                                                                        </button>
                                                                                                                        <span className='text-danger' style={{ fontSize: "smaller" }}>(Scan the QR code at the audit location to quickly access and start the audit).</span>
                                                                                                                    </>
                                                                                                                }

                                                                                                            </>

                                                                                                            :
                                                                                                            selectedNodeType === "2" ?
                                                                                                                <>
                                                                                                                    <Label className="" htmlFor="autoSizingSelect">Serial Number</Label><span className='text-danger'>*</span>
                                                                                                                    <AvField
                                                                                                                        name="asset_s_no"
                                                                                                                        type="text"
                                                                                                                        required
                                                                                                                        placeholder="Enter Asset Serial Number"
                                                                                                                        errorMessage="Enter Asset Serial Number"
                                                                                                                    />

                                                                                                                    <Label className="" htmlFor="autoSizingSelect">Asset Description</Label><span className='text-danger'>*</span>
                                                                                                                    <AvField
                                                                                                                        name="asset_desc"
                                                                                                                        type="textarea"
                                                                                                                        required
                                                                                                                        placeholder="Enter Asset Description"
                                                                                                                        errorMessage="Enter Asset Description"
                                                                                                                    />
                                                                                                                    <Label className="" htmlFor="autoSizingSelect">Asset Placed On</Label><span className='text-danger'>*</span>

                                                                                                                    <AvField
                                                                                                                        name="asset_placed_on"
                                                                                                                        type="date"
                                                                                                                        errorMessage="Select Asset Placed on"
                                                                                                                        onChange={(e) => {
                                                                                                                            console.log(e.target.value, 'valuee')
                                                                                                                            setassetStartDate(e.target.value)
                                                                                                                        }}
                                                                                                                        required
                                                                                                                    />
                                                                                                                    <Label className="" htmlFor="autoSizingSelect">Asset Expire On</Label><span className='text-danger'>*</span>
                                                                                                                    <AvField
                                                                                                                        name="asset_expiry_on"
                                                                                                                        type="date"
                                                                                                                        min={assetStartDate}
                                                                                                                        max={calculateMaxDate()}
                                                                                                                        errorMessage="Select Asset Expire on"
                                                                                                                        required
                                                                                                                    />

                                                                                                                </>
                                                                                                                :
                                                                                                                <>
                                                                                                                </>
                                                                                                    }




                                                                                                    {
                                                                                                        enableCode ?
                                                                                                            <div className="mb-3">
                                                                                                                <AvField
                                                                                                                    name="code"
                                                                                                                    label="Code"
                                                                                                                    type="text"
                                                                                                                    validate={{
                                                                                                                        required: { value: true, errorMessage: "Enter Code" },
                                                                                                                    }}
                                                                                                                    onChange={() => { setcodeError(''); setcodeErrorEnabled(false) }}
                                                                                                                    placeholder="Enter Code"
                                                                                                                />
                                                                                                                {
                                                                                                                    codeErrorEnabled &&
                                                                                                                    <Label className="text-danger" style={{ margin: '5px 0 7px 0' }} htmlFor="autoSizingSelect">{codeError}</Label>
                                                                                                                }
                                                                                                            </div> : null
                                                                                                    }
                                                                                                </div>
                                                                                                {
                                                                                                    selectedNodeType === "2" &&
                                                                                                    <>
                                                                                                        <button onClick={() => { generateQr() }} type='button' className='btn btn-success btn-sm btn-block m-1'>
                                                                                                            {
                                                                                                                state.nodeInfo.qr_name === null || state.nodeInfo.qr_name === undefined ?
                                                                                                                    "Generate QR"
                                                                                                                    :
                                                                                                                    !state.generate && state.nodeInfo.qr_name === null ? "Generate QR" : "Re Generate QR"}

                                                                                                        </button>
                                                                                                        <span className='text-danger' style={{ fontSize: "smaller" }}>(Scan the QR code at the audit location to quickly access and start the audit).</span>
                                                                                                    </>
                                                                                                }
                                                                                                {

                                                                                                    state.showQr !== "" &&
                                                                                                    <div>
                                                                                                        <img src={clientInfo.base_url + state.showQr} alt="QR Code Preview" style={{ marginTop: '10px', objectFit: "contain", width: '100%', height: '200px' }} />
                                                                                                    </div>

                                                                                                }

                                                                                                <div className="my-3 text-end">
                                                                                                    <button className='btn btn-outline-danger btn-sm' onClick={() => { setShowDrawer(false); dispatch(setShowQr("")) }} type="button" style={{ marginRight: 5 }}>
                                                                                                        Close
                                                                                                    </button>
                                                                                                    <button className="btn btn-outline-success btn-sm btn-block m-1" type="submit" style={{ marginRight: 5 }}>
                                                                                                        {!state.editcrud && !state.generate ? "Create" : "Update"}
                                                                                                    </button>
                                                                                                </div>
                                                                                                {
                                                                                                    validErr &&
                                                                                                    <div className='text-danger' style={{ fontSize: "smaller" }}>Please Fill the mandatory fields.</div>
                                                                                                }
                                                                                            </AvForm>
                                                                                        </div>
                                                                                }
                                                                            </DropdownMenu>
                                                                        </>)}
                                                                </UncontrolledDropdown>
                                                            )}

                                                            {node.type === 0 && (
                                                                <UncontrolledDropdown direction="end" >
                                                                    {
                                                                        canEdit && (<>
                                                                            <DropdownToggle className="card-drop" tag="a">
                                                                                <Link to="#" className="btn btn-sm btn-soft-secondary" id={`assetTip-${node.id}`} onClick={() => {
                                                                                    dispatch(setShowQr(""));
                                                                                    setvalidErr(false);
                                                                                    setcreateNewCat(false)
                                                                                    setgetSubTitledd("");
                                                                                    // setShowDrawer(true); 
                                                                                    setselectedNodeType("");
                                                                                    dispatch(addNode(node, updatedPath, 0));
                                                                                    dispatch(setnodeInfo(node)); 
                                                                                    setenableCode(false);
                                                                                    setinvalidTittle(false);
                                                                                    dispatch(setGenerate(false))

                                                                                }}
                                                                                    style={{ padding: "2px 5px" }}
                                                                                >
                                                                                    <i className="mdi mdi-package-variant font-size-16" />
                                                                                    <UncontrolledTooltip placement="top" target={`assetTip-${node.id}`}>
                                                                                        Add Asset
                                                                                    </UncontrolledTooltip>
                                                                                </Link>
                                                                            </DropdownToggle>
                                                                            <DropdownMenu className="ms-4 " style={{ minWidth: "500px", zIndex: 2, padding: 10, marginLeft: '13px', marginTop: '-15px' }}>
                                                                                <div className="px-4">
                                                                                    <div className='border-bottom border-secondary border-opacity-50 py-2 mb-2'>
                                                                                        <strong>Add Asset</strong>
                                                                                    </div>
                                                                                    <AvForm onValidSubmit={crudNodeInfo}>
                                                                                        <div className="my-2">
                                                                                            <AvField name="title" label="Asset Name "
                                                                                                placeholder="Enter Asset Name" type="text" errorMessage="Enter Asset Name" validate={{ required: { value: true }, }}
                                                                                                defaultValue={""}
                                                                                                // onChange={(e) => { dispatch(setMenuName(e.target.value)); validateNodeName(e) }} 
                                                                                                />
                                                                                        </div>
                                                                                    

                                                                                    
                                                                                        <div className="mb-3">

                                                                                            <Label className="" htmlFor="autoSizingSelect">Asset Type</Label>
                                                                                            {

                                                                                                <AvInput
                                                                                                    type="select"
                                                                                                    name="subtitledd"
                                                                                                    label="Name"
                                                                                                    className="form-select"
                                                                                                    id="cat"
                                                                                                    ref={optionRef}
                                                                                                    onChange={(e) => selectCat1(e)}
                                                                                                >
                                                                                                    <option value="0" defaultValue>Choose...</option>
                                                                                                    <option value="1"  >Documents</option>
                                                                                                    <option value="2"  >Records</option>
                                                                                                    <option value="3"  >Sytems</option>
                                                                                                    
                                                                                                    
                                                                                                </AvInput>
                                                                                            }
                                                                                            
                                                                                        </div>

                                                                                        <div className="my-2">
                                                                                            <AvField
                                                                                                name="asset_code"
                                                                                                label="Asset Code"
                                                                                                type="text"
                                                                                                validate={{
                                                                                                    required: {
                                                                                                        value: false,
                                                                                                    },
                                                                                                }}
                                                                                                // onChange={() => { setcodeError(''); setcodeErrorEnabled(false) }}
                                                                                                placeholder="Enter Asset Code"
                                                                                            />
                                                                                        </div>

                                                                                    

                                                                                        <div className="my-2">
                                                                                            <AvField
                                                                                                name="address"
                                                                                                label="Asset Info"
                                                                                                type="textarea"
                                                                                                validate={{
                                                                                                    required: {
                                                                                                        value: false,
                                                                                                    },
                                                                                                }}
                                                                                                onChange={() => { setcodeError(''); setcodeErrorEnabled(false) }}
                                                                                                placeholder="Enter information of asset"
                                                                                            />
                                                                                        </div>




                                                                                        <div className="mt-3 text-end">
                                                                                            <button disabled={invalidTittle} className="btn btn-sm btn-outline-primary btn-block m-1" type="submit" style={{ marginRight: 5 }}>
                                                                                                Add Asset
                                                                                            </button>
                                                                                        </div>
                                                                                    </AvForm>
                                                                                </div>


                                                                            </DropdownMenu>
                                                                        </>)}
                                                                </UncontrolledDropdown>
                                                            )}


                                                            {
                                                                canEdit && (<>

                                                                    <li>
                                                                        <Popconfirm
                                                                            description="Are you sure you want to delete this?"
                                                                            title="Warning"
                                                                            okText="Yes"
                                                                            cancelText="No"
                                                                            onConfirm={() => {
                                                                                dispatch(deleteNode(node, path, "udp" + String(node.id), "dp" + String(node.id)))
                                                                            }}
                                                                            zIndex={10000}
                                                                        >
                                                                            <Link
                                                                                to="#"
                                                                                className="btn btn-sm btn-soft-danger"
                                                                                id={`deletetooltip-${node.id}`}
                                                                                style={{ padding: "2px 5px" }}
                                                                            >
                                                                                <i className="mdi mdi-trash-can-outline font-size-16" />
                                                                                <UncontrolledTooltip placement="top" target={`deletetooltip-${node.id}`}>
                                                                                    {node.type !== 2 && "Delete Level"}
                                                                                </UncontrolledTooltip>
                                                                            </Link>
                                                                        </Popconfirm>
                                                                    </li>
                                                                </>)}

                                                            {
                                                                (node.h_node_type?.id === "2" || node.h_node_type?.id === "1") && canEdit &&
                                                                <li>
                                                                    <Link
                                                                        to="#"
                                                                        className="btn btn-sm btn-soft-primary" // Changed to a primary color to match download action
                                                                        onClick={async () => {
                                                                            var flatInfo = await dispatch(getFlatNodeInfo(node));
                                                                            console.log("download qr", flatInfo, 'flatInfo')
                                                                            if (flatInfo.qr_name) {
                                                                                var download_qr = clientInfo.base_url + flatInfo.qr_name
                                                                                downloadImageAsPDF(download_qr, flatInfo)
                                                                            }
                                                                            else {
                                                                                Swal.fire({
                                                                                    icon: 'error',
                                                                                    title: 'Oops...',
                                                                                    text: 'No QR code found!',
                                                                                    confirmButtonText: 'Try Again'
                                                                                });
                                                                            }
                                                                        }}
                                                                        id={`downloadtooltip-${node.id}`}
                                                                    >
                                                                        <i className="mdi mdi-download" /> {/* Updated icon to download */}
                                                                        <UncontrolledTooltip placement="top" target={`downloadtooltip-${node.id}`}>
                                                                            {node.type !== 2 && "Download QR"}
                                                                        </UncontrolledTooltip>
                                                                    </Link>
                                                                </li>
                                                            }


                                                            <div key={""}>
                                                                <UncontrolledDropdown >
                                                                    <DropdownToggle
                                                                        className="card-drop"
                                                                        tag="a"
                                                                        onClick={async () => {
                                                                            var flatInfo = await dispatch(getFlatNodeInfo(node))
                                                                            var nodeInfo = _.cloneDeep(node)
                                                                            if (flatInfo) {
                                                                                nodeInfo["unique_users"] = flatInfo.unique_users
                                                                                nodeInfo["user_permission_acpln"] = flatInfo.user_permission_acpln
                                                                                nodeInfo["user_path"] = flatInfo.user_path
                                                                                nodeInfo["loc_lat"] = flatInfo.loc_lat
                                                                                nodeInfo["loc_long"] = flatInfo.loc_long
                                                                                nodeInfo["asset_expiry_on"] = flatInfo.asset_expiry_on
                                                                                nodeInfo["asset_desc"] = flatInfo.asset_desc
                                                                                nodeInfo["asset_placed_on"] = flatInfo.asset_placed_on
                                                                                nodeInfo["asset_s_no"] = flatInfo.asset_s_no

                                                                            }
                                                                            console.log(nodeInfo, 'flatInfo')

                                                                            setviewUsers(true); dispatch(setnodeInfo(nodeInfo));
                                                                            dispatch(setnodeUsers(nodeInfo.unique_users !== undefined ? nodeInfo.unique_users : []))
                                                                        }}
                                                                    >
                                                                        <Space size="middle">
                                                                            <Badge count={node?.user_count !== undefined ? node.user_count > 0 ? node.user_count : 0 : 0} color="#556EE6">
                                                                                <i className="mdi mdi-account-multiple-plus-outline font-size-16" title={"Users"} style={{ marginTop: '4px', marginLeft: '5px' }}
                                                                                ></i>
                                                                            </Badge>
                                                                        </Space>
                                                                    </DropdownToggle>
                                                                    <DropdownMenu className="ms-4 " style={{ minWidth: "500px", zIndex: 2, padding: 10, marginLeft: '13px', marginTop: '-15px' }}>

                                                                        {viewUsers ? (
                                                                            <div>


                                                                                <div className='d-flex justify-content-between mb-1'>
                                                                                    <div>
                                                                                        Users of <span className='ms-1 font-size-13 text-primary'> {nodeInfo.title} </span>
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className="table-responsive"
                                                                                    style={{

                                                                                        maxHeight: '400px',
                                                                                        overflowY: 'auto',
                                                                                        border: '1px solid #ddd',
                                                                                        borderRadius: '5px',
                                                                                    }}
                                                                                >
                                                                                    <table
                                                                                        className="table"
                                                                                        style={{
                                                                                            width: '100%',
                                                                                            borderCollapse: 'separate',
                                                                                            borderSpacing: '0 10px',
                                                                                            marginBottom: '0',
                                                                                        }}
                                                                                    >
                                                                                        <thead>
                                                                                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                                                                                <th style={{ padding: '5px' }}>S.No</th>
                                                                                                <th style={{ padding: '5px' }}>Name</th>
                                                                                                <th style={{ padding: '5px' }}>Email Id</th>
                                                                                                <th style={{ padding: '5px' }}>Mobile Number</th>
                                                                                                {canEdit && (<th style={{ padding: '5px' }}>Delete User</th>)}

                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {nodeUsers?.map((data, idx) => (
                                                                                                <tr key={idx} >
                                                                                                    <td>{idx + 1}</td>
                                                                                                    <td>{data.name}</td>
                                                                                                    <td>{data.email_id || "-"}</td>
                                                                                                    <td>{data.phone_num || "-"}</td>
                                                                                                    {
                                                                                                        canEdit && (<>
                                                                                                            <td>

                                                                                                                <div>
                                                                                                                    <i className="bx bx-trash text-danger" style={{ cursor: 'pointer' }} onClick={() => getUpdateChild(state.nodeInfo, authUser.db_info, data)} ></i>
                                                                                                                </div>
                                                                                                            </td></>)}
                                                                                                </tr>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                                {canEdit && (<>

                                                                                    <div className="d-flex align-items-center justify-content-end gap-2 my-1">
                                                                                        <button className="btn btn-sm btn-outline-danger btn-sm" onClick={() => deleteAllUsers(state.nodeInfo, authUser.db_info)}> Delete all Users </button>
                                                                                        <button className="btn btn-sm btn-outline-success btn-sm" onClick={() => addNodeUser(treeData, state.nodeInfo, 2, history, null, state.path)}> Add User </button>
                                                                                    </div>
                                                                                </>)}

                                                                            </div>
                                                                        ) : null}
                                                                    </DropdownMenu>

                                                                </UncontrolledDropdown>
                                                            </div>

                                                            <li className='ms-2'>
                                                                <div className='px-2 bg-in-progress text-white py-2' style={{borderRadius: 10 }} >
                                                                    <span>{"L" + node.node_level}</span>
                                                                </div>
                                                            </li>


                                                        </ul>
                                                    </Row>
                                                ],

                                            };
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {
                            canEdit && (<>

                                <footer
                                    style={{
                                        display: 'flex',
                                        alignItems: "center",
                                        height: 50,
                                        background: "#fff",
                                        width: "100%",
                                        position: "fixed",
                                        bottom: 0,
                                        zIndex: 999,
                                        borderTop: "1px solid #dedede"
                                    }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center", paddingLeft: 20 }}>
                                        {
                                            treeData.length > 0 &&
                                            <>
                                                <div>
                                                    <button className="btn btn-sm btn-danger btn-block m-1" type="submit" onClick={() => saveHStructure()} disabled={state.publishInfo.saving} >
                                                        {state.publishInfo.saving ? "Saving" : "Save"}
                                                    </button>
                                                </div>
                                                <div style={{ marginRight: 10 }}>
                                                    <button className="btn btn-sm btn-success btn-block m-1" type="submit" onClick={() => publishHStructure(treeData, dispatch)} >
                                                        Deploy
                                                    </button>
                                                </div>
                                            </>
                                        }


                                        <div>
                                            <UncontrolledAlert
                                                color="success"
                                                className="alert-dismissible fade show"
                                                role="alert"
                                                isOpen={state.publishInfo.successmsgshow}
                                            >
                                                <i className="mdi mdi-check-all me-2"></i>{state.publishInfo.alertMsg}
                                            </UncontrolledAlert>
                                        </div>
                                    </div>
                                </footer>
                            </>)}

                        <Offcanvas
                            direction="end"
                            zIndex={9999}
                            style={{ width: "30%" }}
                            isOpen={showDrawer}
                            toggle={() => {
                                setShowDrawer(!showDrawer);
                                !showDrawer && dispatch(setShowQr(""));
                            }}>
                            <OffcanvasHeader toggle={() => { setShowDrawer(!showDrawer); !showDrawer && dispatch(setShowQr("")) }}>
                                Add Sub Level
                            </OffcanvasHeader>
                            <OffcanvasBody>
                                {
                                    state.editcrud ?
                                        <div className="px-4">
                                            <div className="mt-1" style={{ display: 'inline-flex' }}>Edit Sub Level Under</div>
                                            <div title={state.getNodeInfo?.title} className="font-size-13 text-primary mt-2 px-2 py-0" style={{ display: 'inline-flex', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', cursor: 'pointer' }}>
                                                {truncateText(state.getNodeInfo?.title || '', 6)}
                                            </div>
                                            <div className="font-size-11 text-dark" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', cursor: 'pointer' }}>
                                                {truncateText(state.getNodeInfo?.subtitle || '', 6)}
                                            </div>
                                            <AvForm ref={formRef} onValidSubmit={
                                                submitInfo
                                            }>
                                                <div className="my-2">
                                                    <Label className="" htmlFor="autoSizingSelect">Sub Level Name</Label><span className='text-danger'>*</span>
                                                    <AvField
                                                        name="title"
                                                        type="text"
                                                        required
                                                        errorMessage="Enter Sub Level Name"
                                                        placeholder="Enter Sub Level Name"
                                                        value={nodeInfo?.title}
                                                    />
                                                    {
                                                        nodeInfo.parent !== null &&
                                                        <div className="mb-3">
                                                            <Label className="" htmlFor="autoSizingSelect">Define Level:<span className='text-danger'>*</span></Label>
                                                            <AvInput
                                                                type="select"
                                                                name="h_node_type"
                                                                className="form-select"
                                                                id="cat"
                                                                defaultValue={nodeInfo ? nodeInfo.h_node_type?.id : "Select"}
                                                                onChange={(e) => { selectNodeType(e); setvalidErr(false) }}
                                                                required
                                                            >
                                                                <option disabled={true} value={"Select"} defaultValue>Choose...</option>
                                                                {
                                                                    clientInfo.h_node_type?.map((data, idx) => {
                                                                        return (
                                                                            <option value={data.id} selected key={idx}>{data.name}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </AvInput>
                                                        </div>
                                                    }

                                                    <div className='my-2'>
                                                        <Label className="" htmlFor="autoSizingSelect">Category</Label>
                                                        <Select
                                                            styles={customStyles}
                                                            options={catListInfo.map((data, idx) => ({
                                                                label: (
                                                                    <div>
                                                                        {truncateText(data, 6)}
                                                                        <i className="mdi mdi-pencil font-size-12 text-primary me-5"></i>
                                                                    </div>
                                                                ),
                                                                value: data,
                                                            }))}
                                                            value={catListInfo.map(data => ({ label: data, value: data })).find((option) => option.value === nodeInfo?.subtitle)}
                                                            onChange={(e) => editCat(e)}
                                                        />

                                                        {createNewCat &&
                                                            <AvField
                                                                name="subtitle"
                                                                type="text"
                                                                value={getSubTitledd}
                                                                placeholder="Enter New Category"
                                                                required
                                                            />
                                                        }
                                                    </div>

                                                    {(enableCode || nodeInfo?.code) &&
                                                        <div className="mb-3">
                                                            <AvField
                                                                name="code"
                                                                label="Code"
                                                                type="text"
                                                                value={nodeInfo?.code}
                                                                validate={{
                                                                    required: { value: true, errorMessage: "Enter Code" },
                                                                }}
                                                                placeholder="Enter Code"
                                                                onChange={() => { setcodeError(''); setcodeErrorEnabled(false) }}
                                                            />
                                                            {codeErrorEnabled &&
                                                                <Label className="text-danger" style={{ margin: '5px 0 7px 0' }} htmlFor="autoSizingSelect">{codeError}</Label>
                                                            }
                                                        </div>
                                                    }
                                                </div>


                                                {
                                                    selectedNodeType === "1" ?
                                                        <>
                                                            <Label className="" htmlFor="autoSizingSelect">Location Latitude</Label>
                                                            <AvField
                                                                name="loc_lat"
                                                                type="text"
                                                                placeholder="Enter Location Latitude"
                                                                value={nodeInfo.loc_lat ? nodeInfo.loc_lat : ""}
                                                            />

                                                            <Label className="" htmlFor="autoSizingSelect">Location Longitude</Label>

                                                            <AvField
                                                                name="loc_long"
                                                                type="text"
                                                                placeholder="Enter Location Longitude"
                                                                value={nodeInfo.loc_long ? nodeInfo.loc_long : ""}

                                                            />
                                                            {
                                                                console.log(state, 'state')
                                                            }

                                                            <button onClick={() => { dispatch(setGenerate(true)); generateQr() }} type='button' className='btn btn-outline-success btn-sm btn-block m-1'>
                                                                {
                                                                    state.nodeInfo.qr_name === null ?
                                                                        "Generate QR"
                                                                        :
                                                                        !state.generate && state.showQr == "" ? "Generate QR" : "Re Generate QR"}
                                                            </button>
                                                            {

                                                                state.showQr &&
                                                                <div>
                                                                    <img src={clientInfo.base_url + state.showQr} alt="QR Code Preview" style={{ marginTop: '10px', objectFit: "contain", width: '100%', height: '200px' }} />
                                                                </div>

                                                            }
                                                        </>

                                                        :
                                                        selectedNodeType === "2" ?
                                                            <>
                                                                <Label className="" htmlFor="autoSizingSelect">Serial Number</Label><span className='text-danger'>*</span>
                                                                <AvField
                                                                    name="asset_s_no"
                                                                    type="text"
                                                                    required
                                                                    placeholder="Enter Asset Serial Number"
                                                                    errorMessage="Enter Asset Serial Number"
                                                                    value={nodeInfo.asset_s_no ? nodeInfo.asset_s_no : ""}

                                                                />

                                                                <Label className="" htmlFor="autoSizingSelect">Asset Description</Label><span className='text-danger'>*</span>

                                                                <AvField
                                                                    name="asset_desc"
                                                                    type="textarea"
                                                                    required
                                                                    placeholder="Enter Asset Description"
                                                                    errorMessage="Enter Asset Description"
                                                                    value={nodeInfo.asset_desc}

                                                                />
                                                                <Label className="" htmlFor="autoSizingSelect">Asset Placed On</Label><span className='text-danger'>*</span>

                                                                <AvField
                                                                    name="asset_placed_on"
                                                                    type="date"
                                                                    required
                                                                    errorMessage="Select Asset Placed On"
                                                                    value={nodeInfo.asset_placed_on}

                                                                />
                                                                <Label className="" htmlFor="autoSizingSelect">Asset Expire On</Label><span className='text-danger'>*</span>

                                                                <AvField
                                                                    name="asset_expiry_on"
                                                                    type="date"
                                                                    required
                                                                    errorMessage="Select Expire On"
                                                                    value={nodeInfo.asset_expiry_on}

                                                                />


                                                                {
                                                                    selectedNodeType === "2" &&
                                                                    <button onClick={() => { dispatch(setGenerate(true)); generateQr() }} type='button' className='btn btn-outline-primary btn-sm btn-block m-1'>
                                                                        {
                                                                            state.nodeInfo.qr_name === null ?
                                                                                "Generate QR"
                                                                                :
                                                                                !state.generate && state.showQr == "" ? "Generate QR" : "Re Generate QR"}
                                                                    </button>
                                                                }
                                                                {

                                                                    state.showQr &&
                                                                    <div>
                                                                        <img src={clientInfo.base_url + state.showQr} alt="QR Code Preview" style={{ marginTop: '10px', objectFit: "contain", width: '100%', height: '200px' }} />
                                                                    </div>

                                                                }
                                                            </>
                                                            :
                                                            <>
                                                            </>
                                                }


                                                <div className="my-3 text-end">
                                                    <button className='btn btn-outline-danger btn-sm' onClick={() => { setShowDrawer(false); dispatch(setShowQr("")) }} type="button" >
                                                        Close
                                                    </button>
                                                    <button className="btn btn-outline-success btn-sm btn-block m-1" type="submit" >
                                                        {!state.editcrud && !state.generate ? "Create" : "Update"}
                                                    </button>

                                                </div>
                                            </AvForm>
                                        </div>
                                        :
                                        <div className="px-4">
                                            <div className="mt-1" style={{ display: 'inline-flex' }}>Add Sub Level Under</div>
                                            <div title={nodeInfo?.title} className="font-size-13 text-primary mt-2 px-2 py-0" style={{ display: 'inline-flex', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', cursor: 'pointer' }}>
                                                {truncateText(nodeInfo?.title || '', 6)}
                                            </div>
                                            <div title={nodeInfo?.subtitle} className="font-size-11 text-dark" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', cursor: 'pointer' }}>
                                                {truncateText(nodeInfo?.subtitle || '', 6)}
                                            </div>
                                            <AvForm ref={formRef} onValidSubmit={submitInfo} onInvalidSubmit={handleInvalidSubmit}>
                                                <div className="my-2">
                                                    <Label className="" htmlFor="autoSizingSelect">Sub Level Name</Label><span className='text-danger'>*</span>
                                                    <AvField
                                                        name="title"
                                                        type="text"
                                                        required
                                                        placeholder="Enter Sub Level Name"
                                                        errorMessage="Enter Sub Level Name"
                                                        onChange={(e) => validateSubmenuName(e)}
                                                    />
                                                    {
                                                        invalidTittle &&
                                                        <div style={{ fontSize: 'smaller', width: "auto" }} className='text-danger'>Sub Level Name name should not same for same level</div>
                                                    }
                                                    <div className="mb-3">
                                                        <Label className="" htmlFor="autoSizingSelect">Define Level :<span className='text-danger'>*</span></Label>
                                                        <AvInput
                                                            type="select"
                                                            name="h_node_type"
                                                            className="form-select"
                                                            id="cat"
                                                            defaultValue={"Select"}
                                                            onChange={(e) => { selectNodeType(e); setvalidErr(false) }}
                                                            required
                                                        >
                                                            <option disabled={true} value={"Select"} defaultValue>Choose...</option>
                                                            {
                                                                clientInfo.h_node_type?.map((data, idx) => {
                                                                    return (
                                                                        <option value={data.id} selected key={idx}>{data.name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </AvInput>
                                                    </div>
                                                    {
                                                        state.editcrud ?
                                                            <>
                                                            </>
                                                            :
                                                            <>
                                                                <div className="mb-3">
                                                                    <Label className="" htmlFor="autoSizingSelect">Category</Label>
                                                                    <AvInput
                                                                        type="select"
                                                                        name="subtitledd"
                                                                        label="Name"
                                                                        className="form-select"
                                                                        id="cat"
                                                                        ref={optionRef}
                                                                        onChange={(e) => selectCat(e)}
                                                                    >
                                                                        <option value="0" defaultValue>Choose...</option>
                                                                        <option value="1" selected >Create New</option>
                                                                        {
                                                                            catListInfo.map((data, idx) => {
                                                                                return (
                                                                                    <option value={data} selected key={idx}>{data}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </AvInput>
                                                                </div>
                                                                {
                                                                    createNewCat ?
                                                                        <AvField
                                                                            name="subtitle"
                                                                            type="text"
                                                                            placeholder="Enter New Category"
                                                                            required
                                                                        />
                                                                        :
                                                                        null
                                                                }

                                                            </>

                                                    }


                                                    {
                                                        selectedNodeType === "1" ?
                                                            <>
                                                                <Label className="" htmlFor="autoSizingSelect">Location Latitude</Label>&nbsp;<span style={{ fontSize: "smaller" }} className='text-danger'>(Precise geographic coordinates for accurate audit tracking and identification of the location)</span>
                                                                <AvField
                                                                    name="loc_lat"
                                                                    type="text"
                                                                    placeholder="Enter Location Latitude"
                                                                />

                                                                <Label className="" htmlFor="autoSizingSelect">Location Longitude</Label><span style={{ fontSize: "smaller" }} className='text-danger'>(Precise geographic coordinates for accurate audit tracking and identification of the location)</span>

                                                                <AvField
                                                                    name="loc_long"
                                                                    type="text"
                                                                    placeholder="Enter Location Longitude"
                                                                />
                                                                {
                                                                    selectedNodeType === "1" &&
                                                                    <>
                                                                        <button onClick={() => {
                                                                            generateQr()
                                                                        }}
                                                                            type='button'
                                                                            className='btn btn-success btn-sm btn-block m-1'>
                                                                            {
                                                                                state.nodeInfo.qr_name === null ?
                                                                                    "Generate QR"
                                                                                    :
                                                                                    !state.generate ? "Generate QR" : "Re Generate QR"}

                                                                        </button>
                                                                        <span className='text-danger' style={{ fontSize: "smaller" }}>(Scan the QR code at the audit location to quickly access and start the audit).</span>
                                                                    </>
                                                                }

                                                            </>

                                                            :
                                                            selectedNodeType === "2" ?
                                                                <>
                                                                    <Label className="" htmlFor="autoSizingSelect">Serial Number</Label><span className='text-danger'>*</span>
                                                                    <AvField
                                                                        name="asset_s_no"
                                                                        type="text"
                                                                        required
                                                                        placeholder="Enter Asset Serial Number"
                                                                        errorMessage="Enter Asset Serial Number"
                                                                    />

                                                                    <Label className="" htmlFor="autoSizingSelect">Asset Description</Label><span className='text-danger'>*</span>
                                                                    <AvField
                                                                        name="asset_desc"
                                                                        type="textarea"
                                                                        required
                                                                        placeholder="Enter Asset Description"
                                                                        errorMessage="Enter Asset Description"
                                                                    />
                                                                    <Label className="" htmlFor="autoSizingSelect">Asset Placed On</Label><span className='text-danger'>*</span>

                                                                    <AvField
                                                                        name="asset_placed_on"
                                                                        type="date"
                                                                        errorMessage="Select Asset Placed on"
                                                                        onChange={(e) => {
                                                                            console.log(e.target.value, 'valuee')
                                                                            setassetStartDate(e.target.value)
                                                                        }}
                                                                        required
                                                                    />
                                                                    <Label className="" htmlFor="autoSizingSelect">Asset Expire On</Label><span className='text-danger'>*</span>
                                                                    <AvField
                                                                        name="asset_expiry_on"
                                                                        type="date"
                                                                        min={assetStartDate}
                                                                        max={calculateMaxDate()}
                                                                        errorMessage="Select Asset Expire on"
                                                                        required
                                                                    />

                                                                </>
                                                                :
                                                                <>
                                                                </>
                                                    }




                                                    {
                                                        enableCode ?
                                                            <div className="mb-3">
                                                                <AvField
                                                                    name="code"
                                                                    label="Code"
                                                                    type="text"
                                                                    validate={{
                                                                        required: { value: true, errorMessage: "Enter Code" },
                                                                    }}
                                                                    onChange={() => { setcodeError(''); setcodeErrorEnabled(false) }}
                                                                    placeholder="Enter Code"
                                                                />
                                                                {
                                                                    codeErrorEnabled &&
                                                                    <Label className="text-danger" style={{ margin: '5px 0 7px 0' }} htmlFor="autoSizingSelect">{codeError}</Label>
                                                                }
                                                            </div> : null
                                                    }
                                                </div>
                                                {
                                                    selectedNodeType === "2" &&
                                                    <>
                                                        <button onClick={() => { generateQr() }} type='button' className='btn btn-success btn-sm btn-block m-1'>
                                                            {
                                                                state.nodeInfo.qr_name === null || state.nodeInfo.qr_name === undefined ?
                                                                    "Generate QR"
                                                                    :
                                                                    !state.generate && state.nodeInfo.qr_name === null ? "Generate QR" : "Re Generate QR"}

                                                        </button>
                                                        <span className='text-danger' style={{ fontSize: "smaller" }}>(Scan the QR code at the audit location to quickly access and start the audit).</span>
                                                    </>
                                                }
                                                {

                                                    state.showQr !== "" &&
                                                    <div>
                                                        <img src={clientInfo.base_url + state.showQr} alt="QR Code Preview" style={{ marginTop: '10px', objectFit: "contain", width: '100%', height: '200px' }} />
                                                    </div>

                                                }

                                                <div className="my-3 text-end">
                                                    <button className='btn btn-outline-danger btn-sm' onClick={() => { setShowDrawer(false); dispatch(setShowQr("")) }} type="button" style={{ marginRight: 5 }}>
                                                        Close
                                                    </button>
                                                    <button className="btn btn-outline-success btn-sm btn-block m-1" type="submit" style={{ marginRight: 5 }}>
                                                        {!state.editcrud && !state.generate ? "Create" : "Update"}
                                                    </button>
                                                </div>
                                                {
                                                    validErr &&
                                                    <div className='text-danger' style={{ fontSize: "smaller" }}>Please Fill the mandatory fields.</div>
                                                }
                                            </AvForm>
                                        </div>
                                }


                            </OffcanvasBody>
                        </Offcanvas>
                    </Container>
                </>
            ) : (
                <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <div className="spinner-border text-secondary m-1" role="status"> </div>
                        <div>Loading, Please wait.</div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default TreeStructure;