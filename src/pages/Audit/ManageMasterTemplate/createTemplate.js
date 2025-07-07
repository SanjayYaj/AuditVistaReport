import React, { useState, useEffect } from "react"
import {
    Container, Row, Col,
    Modal, ModalHeader, ModalBody, UncontrolledTooltip,
    DropdownMenu, DropdownToggle, UncontrolledDropdown,
    Offcanvas, OffcanvasHeader, OffcanvasBody
} from "reactstrap"
import Breadcrumbs from "./Components/Breadcrumb2"
import MetaTags from 'react-meta-tags';
import { useNavigate } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation"
import TreeStructure from "./TreeStructure";
import { useSelector, useDispatch } from "react-redux";
import urlSocket from "helpers/urlSocket";
import { setIsOpen, getDocuments,addCheckPointUnderNode ,editCheckpointAtPath} from "toolkitStore/Auditvista/treeSlice";
import InputTemplate from "./Components/InputTemplate";


const CreateTemplate = (props) => {



    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [configData, setConfigData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [templateData, setTemplateData] = useState(null);
    const [dbInfo, setDbInfo] = useState(null);
    const [templateName, setTemplateName] = useState("");
    const [templateInfo, setTemplateInfo] = useState("");
    const [configDataCheckpoint, setConfigDataCheckpoint] = useState(null);
    const [clientInfo, setClientInfo] = useState(null);
 

    const [modal, setModal] = useState(false);
    const [auditNameExist, setAuditNameExist] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [updateTemplateStatus, setUpdateTemplateStatus] = useState("");
    const [changeToUpdate, setChangeToUpdate] = useState(true);


    const state = useSelector(state => state.treeData);



    useEffect(() => {
        const fetchData = async () => {
            const templateData = JSON.parse(sessionStorage.getItem("EditData"));
            const authUserData = JSON.parse(sessionStorage.getItem("authUser"));
            const dbInfo = JSON.parse(sessionStorage.getItem("db_info"));
            const userFacilities = JSON.parse(sessionStorage.getItem("user_facilities"));


            setConfigData(authUserData?.config_data);
            setUserData(authUserData?.user_data);
            setTemplateData(templateData);
            setDbInfo(dbInfo);
            setTemplateName(templateData?.template_name || "");
            setTemplateInfo(templateData?.template_info || "");
            setConfigDataCheckpoint(authUserData?.config_data?.question_type_info);
            setClientInfo(authUserData?.client_info?.[0]);


        };

        fetchData();
        console.log(state,'state');
        dispatch(getDocuments(state))
    }, []);

    const gotoBack = () => {
        navigate('/mngmtrtmplt')

    }


    const togglePopup = () => {
        setModal(false)
    }


    const handleValidUserSubmit = (event, values) => {
        console.log('handleValidUserSubmit', values)
        if (auditNameExist !== true) {
            try {
                urlSocket
                    .post("webmngtmplt/crudtemplate", {
                        templateInfo: {
                            template_id: templateData._id,
                            template_name: values.template_name.trim(),
                            template_info: values.template_info,
                        },
                        userInfo: {
                            encrypted_db_url: dbInfo.encrypted_db_url,
                            created_by: userData._id,
                            company_id: userData.company_id,
                        },
                    })
                    .then((response) => {
                        if (response.data.response_code == 500) {
                            sessionStorage.removeItem('EditData')
                            sessionStorage.setItem("EditData", JSON.stringify(response.data.data))

                            togglePopup()

                            setSuccessMessage(true);
                            setUpdateTemplateStatus(response.data.message);
                            setChangeToUpdate(false);
                            setTemplateName(response.data.data.template_name);
                            setTemplateInfo(response.data.data.template_info);
                            setTimeout(() => {

                                setSuccessMessage(false);

                            }, 2500);
                        }
                    });
            } catch (error) { }
        }
    };

    const audit_name = (e) => {
        var audit_name = e.target.value

        try {
            urlSocket.post('webmngtmplt/validate-user-templatemaster', { audit_name, encrypted_db_url: dbInfo.encrypted_db_url, user_id: userData._id, edit_mode: true, template_id: templateData._id }).then((response) => {
                console.log(response, 'response')
                if (response.data.response_code == 500 && response.data.data.length > 0) {
                    setAuditNameExist(true)
                }
                else {
                    setAuditNameExist(false)
                }
            })

        } catch (error) {
            console.log("error", error)
        }

    }


    const onDrawerClose = () => {
        var checkpointInfo = _.cloneDeep(checkpointInfo)
        // setCheckPointInfo(checkpointInfo)
        dispatch(setIsOpen(false))
        dispatch(getDocuments(state))

    }
    
    const AECheckPointUnderNode = (values, mode) => {

        console.log("values",values)
        const client_info = state.authUser.client_info
        var validate_no_of_img = values.checkpoint_options
        var max_img = validate_no_of_img.filter((e => {
            if (e.no_of_img > client_info.max_photos || e.score > client_info.max_score_value) {
                return e
            }
        }))
        console.log(mode, 'mode')
        if (mode == "0") {
            if (max_img.length == 0) {
                dispatch(addCheckPointUnderNode(values,state))
                dispatch(setIsOpen(false))


            }
        }
        else
            if (mode == "1") {
                if (max_img.length == 0) {
                    dispatch(editCheckpointAtPath(values))
                    dispatch(setIsOpen(false))
                }
            }
    }



    return (
        <React.Fragment>
            <div className="page-content">

                <MetaTags>
                    <title>Edit Template | AuditVista</title>
                </MetaTags>

                <Container fluid>

                    <Breadcrumbs
                        title={"Template / " + templateName}
                        link={"Template / "}
                        changeAuditEditMode={() => {
                            setModal(prevModal => !prevModal);
                            setAuditNameExist(false);
                        }}
                        isBackButtonEnable={true}
                        gotoBack={() => gotoBack()}
                        breadcrumbItem="Template"

                    />

                    <TreeStructure />

                    <Offcanvas isOpen={state.open}
                        direction="end" style={{ width: "700px", zIndex: 9999 }}>
                        <OffcanvasHeader toggle={() => onDrawerClose()}>Add Checkpoint</OffcanvasHeader>

                        <OffcanvasBody style={{ padding: 10, overflow: "auto" }}>
                            {

                                state.open ? (
                                    <InputTemplate
                                    checkpointinfo={[_.cloneDeep(state.getNodeInfo)]}
                                        configdatacheckpoint={
                                            state.configdatacheckpoint
                                        }
                                    mode={state.mode}
                                    parameterData={true}
                                    onClose={() => onDrawerClose()}
                                    onSubmit={(values) => {
                                        AECheckPointUnderNode(values,state.crudStatus === 2 ?"1" : state.mode);
                                      }}
                                      />) : null
                            }

                        </OffcanvasBody>
                    </Offcanvas>




                </Container>

                <Modal
                    isOpen={modal}
                    className={props.className}
                >
                    <ModalHeader toggle={togglePopup} tag="h5">
                        {"Edit Template Information"}
                    </ModalHeader>
                    <ModalBody>

                        <AvForm onValidSubmit={handleValidUserSubmit} onKeyDown={(e) => { e.key === "Enter" && e.preventDefault() }}>
                            <Row>
                                <Col>
                                    <div className="my-2">
                                        <AvField
                                            name="template_name"
                                            label="Audit Name"
                                            placeholder="Enter Audit Name"
                                            type="text"
                                            onChange={(e) => { audit_name(e) }}
                                            errorMessage="Enter Audit Name"
                                            validate={{
                                                required: { value: true },
                                                minLength: {
                                                    value: 6,
                                                    errorMessage: "Min 6 chars.",
                                                },
                                            }}
                                            defaultValue={templateName}
                                        />
                                        {
                                            auditNameExist &&
                                            <div className="text-danger" style={{ fontSize: 'smaller' }}>This name already exists, please give another name.</div>
                                        }
                                    </div>
                                    <div className="my-1">
                                        <label>Description</label>
                                        <AvField
                                            type="textarea"
                                            name="template_info"
                                            id="message"
                                            defaultValue={templateInfo}
                                            onChange={(e) => {
                                                setTemplateInfo(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="my-3 text-end">
                                        <button className="btn btn-outline-danger btn-sm btn-block me-2" type="button" onClick={() => {
                                            setTemplateName(templateData.template_name)
                                            setModal(false)
                                        }
                                        }>
                                            Cancel
                                        </button>
                                        <button className="btn btn-outline-success btn-sm btn-block" style={{ marginRight: 5 }} disabled={auditNameExist} type="submit" >
                                            Update
                                        </button>

                                    </div>
                                </Col>
                            </Row>
                        </AvForm>
                    </ModalBody>
                </Modal>

            </div>
        </React.Fragment>

    )

}

export default CreateTemplate