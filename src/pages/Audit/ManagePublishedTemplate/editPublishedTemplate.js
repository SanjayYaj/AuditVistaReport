import urlSocket from 'helpers/urlSocket'
import React, { useEffect, useState } from 'react'

import "@nosferatu500/react-sortable-tree/style.css";
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import { useNavigate } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import { AvForm, AvField } from "availity-reactstrap-validation"
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
    ModalFooter,
    Table,
    UncontrolledTooltip,
    Label,
    Alert,
    FormGroup
} from "reactstrap";
import _ from 'lodash';
// import TreeStructure from './Components/Treestructure';
import { useDispatch } from 'react-redux';
import ManageTreeStructure from './Components/MngTmpltTreeStucture';
import { getDocuments, updateCurrentAudits, updateUpComingAudits } from 'toolkitStore/Auditvista/managetreeSlice';
import Swal from 'sweetalert2';



const EditPublishedTemplate = () => {

    const [authUser, setauthUser] = useState(null)
    const [templateData, setTemplateData] = useState(null)
    const [tempName, settempName] = useState(null)
    const [tempInfo, settempInfo] = useState(null)
    const [changeToUpdate, setchangeToUpdate] = useState(false)
    const [auditNameExist, setauditNameExist] = useState(false)
    const [successMsg, setSuccessMessage] = useState(false)
    const [updateTemplateStatus, setupdateTemplateStatus] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [modalOpen, setModalOpen] = useState(false);
    const [currentAudit, setCurrentAudit] = useState(null);
    const [upcomingAudit, setUpcomingAudit] = useState(null);
    const [auditStatusState, setAuditStatusState] = useState({
        notStarted: false,
        inProgress: false,
        completed: false,
        submitted: false,
        retake: false,
        reviewed: false,
        all: false,
    });

    useEffect(() => {
        const setSessionInfo = async () => {
            setauthUser(JSON.parse(sessionStorage.getItem("authUser")))
            setTemplateData(JSON.parse(sessionStorage.getItem("EditPublishedData")))
            settempName(JSON.parse(sessionStorage.getItem("EditPublishedData")).template_name)
            settempInfo(JSON.parse(sessionStorage.getItem("EditPublishedData")).template_info)
        }
        setSessionInfo()
        dispatch(getDocuments())
    }, [])


    const toggleModal = () => setModalOpen(!modalOpen);

    const handleAuditTypeChange = (e) => {
        const { name, checked } = e.target;
        if (name === "current") {
            setCurrentAudit(!checked ? "0" : null);
        } else if (name === "upcoming") {
            setUpcomingAudit(!checked ? "1" : null);
        }
    };

 
    const handleUpdateConfirm = async () => {
        let didUpdate = false;
    
        if (upcomingAudit !== null) {
            const result = await dispatch(updateUpComingAudits());
    
            if (result?.response_code === 500) {
                Swal.fire({
                    icon: 'success',
                    title: 'Upcoming Audit Updated',
                    text: 'The upcoming audit structure has been updated successfully.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'Something went wrong while updating the upcoming audit.',
                });
            }
    
            didUpdate = true;
        }
    
        if (currentAudit !== null) {

            

            const result = await dispatch(updateCurrentAudits());
    
            if (result?.response_code === 500) {
                Swal.fire({
                    icon: 'success',
                    title: 'Current Audit Updated',
                    text: 'The current audit structure has been updated successfully.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'Something went wrong while updating the current audit.',
                });
            }
    
            didUpdate = true;
        }
    
        if (!didUpdate) {
            Swal.fire({
                icon: 'info',
                title: 'No Audit Type Selected',
                text: 'Please select an audit type before updating.',
            });
        }
    
        setModalOpen(false);
    };
    



    const handleAuditStatusChange = (e) => {
        const { name, checked } = e.target;

        if (name === "all") {
            const toggleValue = !checked;
            setAuditStatusState({
                notStarted: toggleValue,
                inProgress: toggleValue,
                completed: toggleValue,
                submitted: toggleValue,
                retake: toggleValue,
                reviewed: toggleValue,
                all: toggleValue,
            });
        } else {
            setAuditStatusState((prev) => {
                const updatedState = {
                    ...prev,
                    [name]: !checked,
                };
                const allSelected =
                    updatedState.notStarted &&
                    updatedState.inProgress &&
                    updatedState.completed &&
                    updatedState.submitted &&
                    updatedState.retake &&
                    updatedState.reviewed;

                return {
                    ...updatedState,
                    all: allSelected,
                };
            });
        }
    };



    const handleValidUserSubmit = (event, values) => {
        console.log(event, values, 'event, values');
        if (auditNameExist !== true) {

            try {
                urlSocket.post("webmngpbhtmplt/crudpublishedtemplate", {
                    templateInfo: {
                        template_id: templateData._id,
                        template_name: values.template_name.trim(),
                        template_info: values.template_info
                    },
                    userInfo: {
                        created_by: authUser.user_data._id,
                        encrypted_db_url: authUser.db_info.encrypted_db_url
                    }
                })
                    .then((response) => {
                        if (response.data.response_code == 500) {
                            const templateDataInfo = _.cloneDeep(templateData)
                            setchangeToUpdate(false)
                            setSuccessMessage(true)
                            setupdateTemplateStatus(response.data.message)
                            templateDataInfo["template_name"] = tempName
                            templateDataInfo["template_info"] = tempInfo
                            setTemplateData(templateDataInfo)
                            setTimeout(() => {
                                setSuccessMessage(false)
                            }, 2500);
                        }
                    })

            } catch (error) {
                console.log("error",error)
            }


        }
    }

    const changeAuditEditMode = (status) => {
        setchangeToUpdate(status)
    }

    const validateAuditName = (e) => {
        var audit_name = e.target.value
        try {

            urlSocket.post('cog/validate-edit-audit-name', { audit_name, db_url: authUser.db_info.encrypted_db_url, user_id: authUser.user_data._id, audit_id: templateData._id }).then((response) => {
                console.log(response, 'response');
                if (response.data.data.length > 0) {
                    setauditNameExist(true)
                }
                else {
                    setauditNameExist(false)
                }
            })
        } catch (error) {

        }
    }



    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Edit Template | AuditVista</title>
                </MetaTags>
                <Breadcrumbs
                    title='Edit Template'
                    breadcrumbItem="Template"
                    isBackButtonEnable={true}
                    gotoBack={() => {
                        navigate("/mngpblhtempt")
                    }}
                />
                <Container fluid>

                    <Card>
                        <CardBody>
                            <div className="row">

                                <div className="right-column mb-0 pb-0">
                                    <Row>
                                        <Col>
                                            <Card style={{ border: '1px solid #e9e9e9' }} className="mb-1">
                                                <CardBody>
                                                    <Alert color="success" isOpen={successMsg} className="mb-1">
                                                        <strong>Well done!</strong> {updateTemplateStatus}
                                                    </Alert>

                                                    {changeToUpdate ? (
                                                        <Card>
                                                            <div>
                                                                <AvForm
                                                                    onValidSubmit={handleValidUserSubmit}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter") e.preventDefault();
                                                                    }}
                                                                >
                                                                    <Row>

                                                                        <Col md={6}>
                                                                            <div className="">
                                                                                <AvField
                                                                                    name="template_name"
                                                                                    label="Audit Name"
                                                                                    placeholder="Enter Audit Name"
                                                                                    type="text"
                                                                                    errorMessage="Enter Audit Name"
                                                                                    validate={{
                                                                                        required: { value: true },
                                                                                        minLength: { value: 6, errorMessage: "Min 6 chars." },
                                                                                    }}
                                                                                    defaultValue={tempName}
                                                                                    onChange={(e) => {
                                                                                        settempName(e.target.value)
                                                                                        validateAuditName(e)
                                                                                    }}
                                                                                />
                                                                                {auditNameExist && (
                                                                                    <div className="text-danger" style={{ fontSize: 'smaller' }}>
                                                                                        This audit name already exists.
                                                                                    </div>
                                                                                )}

                                                                                {/* Description */}
                                                                                <div className="my-2">
                                                                                    <label>Description</label>
                                                                                    <AvField
                                                                                        type="textarea"
                                                                                        name="template_info"
                                                                                        defaultValue={tempInfo}
                                                                                        onChange={(e) =>
                                                                                            settempInfo(e.target.value)
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                                <div className="text-end">
                                                                                    <button className="btn btn-sm btn-outline-danger me-1"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            setchangeToUpdate(false)
                                                                                            setauditNameExist(false)
                                                                                            settempName(templateData.template_name)
                                                                                            settempInfo(templateData.template_info)
                                                                                        }} >
                                                                                        Close
                                                                                    </button>
                                                                                    <button className="btn btn-sm btn-outline-success">
                                                                                        Update
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </AvForm>
                                                            </div>
                                                        </Card>
                                                    )
                                                        :


                                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                            <div className="d-flex align-items-center flex-wrap">
                                                                <h5 className="text-wrap font-size-15 mb-0 me-3">
                                                                    <span className="text-primary me-2">{templateData?.template_name}</span>
                                                                    <i
                                                                        className="fas fa-edit"
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={() => changeAuditEditMode(true)}
                                                                    />
                                                                </h5>

                                                                <span className="text-muted">{templateData?.template_info}</span>
                                                            </div>

                                                            <button type="button" className="btn btn-primary mt-2 mt-sm-0" onClick={toggleModal}>
                                                                Update
                                                            </button>
                                                        </div>


                                                    }
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>

                                </div>
                                <div className="left-column mt-0 pt-0" style={{ background: 'white' }}>
                                    <ManageTreeStructure />
                                    {/* <TreeStructure/> */}
                                </div>
                                <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
                                    <ModalHeader toggle={toggleModal}>Select Audit Options</ModalHeader>
                                    <ModalBody>
                                        <div className="row mb-4">
                                            <div className="col-12">
                                                <h6 className="mb-2">Audit Type</h6>
                                                <div className="d-flex flex-wrap gap-4">
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input
                                                                type="checkbox"
                                                                name="current"
                                                                checked={currentAudit === "0"}
                                                                onClick={handleAuditTypeChange}
                                                            />
                                                            {' '}Current Audit
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input
                                                                type="checkbox"
                                                                name="upcoming"
                                                                checked={upcomingAudit === "1"}
                                                                onClick={handleAuditTypeChange}
                                                            />
                                                            {' '}Upcoming Audit
                                                        </Label>
                                                    </FormGroup>

                                                </div>
                                            </div>
                                        </div>
                                        {currentAudit === "0" && (
                                            <div className="row">
                                                <div className="col-12">
                                                    <h6 className="mb-2">Audit Status</h6>
                                                    <div className="d-flex flex-wrap gap-4">
                                                        {[
                                                            { label: 'All', key: 'all' },
                                                            { label: 'Not Started', key: 'notStarted' },
                                                            { label: 'In-progress', key: 'inProgress' },
                                                            { label: 'Completed', key: 'completed' },
                                                            { label: 'Submitted', key: 'submitted' },
                                                            { label: 'Retake', key: 'retake' },
                                                            { label: 'Reviewed', key: 'reviewed' },
                                                        ].map((item) => (
                                                            <FormGroup check key={item.key}>
                                                                <Label check>
                                                                    <Input
                                                                        type="checkbox"
                                                                        name={item.key}
                                                                        checked={auditStatusState[item.key]}
                                                                        onClick={handleAuditStatusChange}
                                                                    />
                                                                    {' '}{item.label}
                                                                </Label>
                                                            </FormGroup>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                                        <Button color="primary" onClick={handleUpdateConfirm}>Confirm</Button>{' '}
                                    </ModalFooter>
                                </Modal>
                            </div>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    )
}
export default EditPublishedTemplate