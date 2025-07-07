import React, { useState, useEffect } from "react";
import MetaTags from 'react-meta-tags';
import {
    Card, CardBody, Container,
    CardText,
    CardTitle,
} from "reactstrap";
import { Link, useNavigate, withRouter } from "react-router-dom"
import moment from 'moment'
import ReviewOPType from "./Components/review_optype";
import PreviewImage from "./Components/preview_images";
import PreviewDocuments from "./Components/preview_documents";
import PreviewObservation from "./Components/preview_observation";
import PreviewCAPA from "./Components/preview_CAPA";
import uuid from 'react-uuid'
import { getFlatDataFromTree } from 'react-sortable-tree/dist/index.cjs.js';
const _ = require('lodash')
import urlSocket from "../../../helpers/urlSocket";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import PreviewVideo from "./Components/preview_videos";
const statusText = ["Not started", "In progress", "Completed", "Retake", "Rejected", "Approved"]
const statusColor = ["#555657", "#FDA705", "#31D9AC", "#F76518", "#E22E2E", "#49AF30"]



const ViewCheckpoints = () => {

    const navigate = useNavigate()



    const [height, setHeight] = useState(window.innerHeight);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [showOption, setShowOption] = useState(false);


    const [configData, setConfigData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [endpointData, setEndpointData] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [dbInfo, setDbInfo] = useState(null);
    const [imageToken, setImageToken] = useState(null);
    const [Checkpoints, setCheckpoints] = useState(null);

    const [dataloaded, setDataLoaded] = useState(false);
    const [filteredData, setFilteredData] = useState([]);

    const [idx, setIdx] = useState(-1);





    const [rtk, setRtk] = useState(0);
    const [apvd, setApvd] = useState(0);
    const [rjd, setRjd] = useState(0);
    const [rvd, setRvd] = useState(0);
    const [ntrvd, setNtrvd] = useState(0);

    

    
    var checkpoints = _.filter(Checkpoints, { document_type: "2" })
    console.log("checkpoints",checkpoints)




    useEffect(() => {
        const getSessionData = async () => {

            console.log("useeffect")

            setDataLoaded(true)

            var data = await JSON.parse(sessionStorage.getItem("authUser"));
            var db_info = await JSON.parse(sessionStorage.getItem("db_info"));
            var endpointData = await JSON.parse(sessionStorage.getItem("endpointData"));
            console.log(endpointData, 'endpointData')
            var user_facilities = await JSON.parse(sessionStorage.getItem("user_facilities"));

            console.log("data", data)
            console.log("user_facilities", user_facilities)


            console.log("data.endpointData", data.endpointData)



            setConfigData(data.config_data);
            setUserData(data.user_data);
            setEndpointData(endpointData);
            setImagePreviewUrl(data.config_data.img_url);
            setDbInfo(db_info);
            setImageToken(data.config_data.img_url);

            setTimeout(() => {
                loadCheckpoints();
            }, 0);
            setDataLoaded(false)


        }

        getSessionData();
    }, []);


    const convertFlatDataToTreeData = async (flatData) => {
        if (flatData !== undefined) {
            var parent_data = flatData.filter(item2 => item2.parent_id === null);
            parent_data.sort(function (a, b) {
                return a.document_id - b.document_id;
            });

            const treeData = parent_data.map((parentItem) => {
                parentItem.children = getChildren(parentItem.document_id, flatData);
                return parentItem;
            });

            console.log(treeData, 'treedata')
            var converted_treeDataToFlat = await treeDataToFlat(treeData)
            var removed_node = _.map(converted_treeDataToFlat, "node")
            console.log(converted_treeDataToFlat, 'converted_treeDataToFlat', removed_node)
            return removed_node

        }
    }


    const treeDataToFlat = (treeData) => {
        var getNodeKey = ({ treeIndex }) => treeIndex
        var flatData = getFlatDataFromTree(
            {
                treeData: treeData,
                getNodeKey,
                ignoreCollapsed: false,
            })

        var explicitData = _.filter(flatData, item => {
            return item
        })

        return explicitData
    }


    const getChildren = (parentId, flatData) => {
        var children = flatData.filter(item => item.parent_id === parentId);
        children.sort(function (a, b) {
            return a.document_id - b.document_id;
        });

        return children.map((childItem) => {
            childItem.children = getChildren(childItem.document_id, flatData);
            return childItem;
        });
    }

    const loadCheckpoints = async () => {

        var db_info = await JSON.parse(sessionStorage.getItem("db_info"));
        var endpointData1 = await JSON.parse(sessionStorage.getItem("endpointData"));
        var data = await JSON.parse(sessionStorage.getItem("authUser"));
        const authUser = data.user_data
        try {

            urlSocket.post("epadtprcs/getepcheckpoints", {
                auditInfo: {
                    audit_pbd_id: endpointData1.audit_pbd_id
                },
                userInfo: {
                    _id: authUser._id,
                    company_id: authUser.company_id,
                    encrypted_db_url: db_info.encrypted_db_url
                },
                endpointInfo: endpointData1
            })
                .then(async response => {
                    console.log(response, 'response')
                    var flatData = await convertFlatDataToTreeData(response.data.data)
                    if (response.data.response_code === 500) {
                        setCheckpoints(flatData)
                        getCheckpointStatus(flatData)
                        filterCheckpoints(filterStatus,flatData)
                    }

                })

        } catch (error) {
            console.log("catch error", error)
        }
    }



    const getCheckpointStatus = (flatData) => {
        const filteredCheckpoints = _.filter(flatData, { document_type: "2" });

        const rtkCount = _.filter(filteredCheckpoints, { cp_review_status: "-2" }).length;
        const apvdCount = _.filter(filteredCheckpoints, { cp_review_status: "1" }).length;
        const rjdCount = _.filter(filteredCheckpoints, { cp_review_status: "0" }).length;
        const rvdCount = rtkCount + apvdCount + rjdCount;
        const ntrvdCount = filteredCheckpoints.length - rvdCount;

        setRtk(rtkCount);
        setApvd(apvdCount);
        setRjd(rjdCount);
        setRvd(rvdCount);
        setNtrvd(ntrvdCount);
        setDataLoaded(true);
    };


    const filterCheckpoints = (filterStatus,flatData) => {
        if (filterStatus === "all") {
            setFilteredData(flatData);
            setShowOption(false);
            setIdx(-1);
        } else if (filterStatus === "ntrvd") {
            setFilteredData(
                _.filter(flatData, item => item.cp_review_status === null && item.document_type == "2")
            );
            setShowOption(false);
            setSelectedCheckpoint(null);
            setIdx(-1);
        } else {
            setFilteredData(
                _.filter(flatData, item => item.cp_review_status === filterStatus && item.document_type == "2")
            );
            setShowOption(false);
            setSelectedCheckpoint(null);
            setIdx(-1);
        }
    };










 












    if (dataloaded) {

        return (
            <React.Fragment>
                <div className="page-content" >
                    <MetaTags>
                        <title>AuditVista | Review Check points</title>
                    </MetaTags>

                    <Breadcrumbs
                        title={"Review Check points"}
                        isBackButtonEnable={true}
                        gotoBack={() => {
                            navigate(`/hendpoints`)
                        }}
                    />
                    <Container fluid>

                        <Card>
                            <CardBody>
                                <div className="d-flex justify-content-between align-items-end">
                                    <div>
                                        <CardTitle className="h3 mt-0">
                                            {endpointData?.audit_pbd_name}
                                        </CardTitle>
                                        <CardText>
                                            {endpointData?.name}{" / "}{endpointData?.code}
                                        </CardText>
                                    </div>

                                    <div>
                                        <Link
                                            to="#"
                                            className="badge badge-soft-dark font-size-12 me-1"
                                            onClick={() => {
                                                setFilterStatus("all")
                                                filterCheckpoints("all",Checkpoints);
                                            }}
                                        >
                                            Total check points{" - "}{checkpoints.length}
                                        </Link>
                                        <Link
                                            to="#"
                                            className="badge badge-soft-secondary font-size-12 me-1"
                                            onClick={() => {
                                                setFilterStatus("ntrvd")
                                                filterCheckpoints("ntrvd",Checkpoints);
                                            }}
                                        >
                                            Not Reviewed{" - "}{ntrvd}
                                        </Link>
                                        <Link
                                            to="#"
                                            className="badge badge-soft-dark font-size-12 me-1"
                                            onClick={() => {
                                                setFilterStatus("r")
                                                filterCheckpoints("-2",Checkpoints);
                                            }}
                                        >
                                            Retake{" - "}{rtk}
                                        </Link>
                                        <Link
                                            to="#"
                                            className="badge badge-soft-success font-size-12 me-1"
                                            onClick={() => {

                                                setFilterStatus("r")
                                                filterCheckpoints("1",Checkpoints);

                                            }}
                                        >
                                            Approved{" - "}{apvd}
                                        </Link>
                                        <Link
                                            to="#"
                                            className="badge badge-soft-danger font-size-12"
                                            onClick={() => {
                                                setFilterStatus("r")
                                                filterCheckpoints("0",Checkpoints);
                                            }}
                                        >
                                            Rejected{" - "}{rjd}
                                        </Link>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>






                        <div className="d-xl-flex">
                            <div className="w-100">
                                <div className="d-md-flex">


                                    <div className="w-100 pb-3 me-md-1 overflow-auto" style={{ maxHeight: height - 250 }} >

                                        <div className="d-flex flex-column">
                                            {
                                                console.log("filteredData", filteredData)
                                            }
                                            {
                                                filteredData.length > 0 ? (<>
                                                    {
                                                        filteredData.map((item, i) => {
                                                            return (
                                                                <>
                                                                    {
                                                                        item.document_type == "2" ?
                                                                            <Card key={i + "cpoints"} className="mb-1" style={{ border: '1px solid lightgrey' }}>
                                                                                <CardBody className="pb-0">
                                                                                    <div className="mb-2">
                                                                                        <label className={item.cp_review_status !== null ? "badge badge-soft-primary font-size-10 me-2" : item.cp_status === "0" ? "badge badge-soft-secondary font-size-10 me-2" : item.cp_status === "1" ? "badge badge-soft-warning font-size-10 me-2" : "badge badge-soft-success font-size-10 me-2"}>{item.cp_review_status !== null ? "Reviewed" : item.cp_status === "0" ? "Not started" : item.cp_status === "1" ? "In progress" : "Completed"}</label>
                                                                                        <label className={item.cp_is_compliance ? "badge badge-soft-danger font-size-10 me-2" : "badge badge-soft-success font-size-10 me-2"}>{item.cp_compliance?.name}</label>
                                                                                        <span
                                                                                            className="badge badge-soft font-size-10"
                                                                                            style={{ backgroundColor: statusColor[Number(item.cp_status)] }}
                                                                                        >
                                                                                            {statusText[Number(item.cp_status)]}</span>
                                                                                    </div>
                                                                                    <div className="mb-1">
                                                                                        <span className="font-size-14 fw-bold">{item.checkpoint}</span>
                                                                                    </div>


                                                                                    {
                                                                                        item.checkpoint_type_id === "1" || item.checkpoint_type_id === "2" || item.checkpoint_type_id === "3" || item.checkpoint_type_id === "4" || item.checkpoint_type_id === "5" ?
                                                                                            <ReviewOPType options={item.checkpoint_options} get_btn_color={item} />
                                                                                            : null
                                                                                    }

                                                                                    {
                                                                                        item.cp_attach_images.length !== 0 ?
                                                                                            <div className="mt-3 mb-4">
                                                                                                <label>Images Attached</label>
                                                                                                <PreviewImage
                                                                                                    imagePreviewUrl={imagePreviewUrl}
                                                                                                    images={item.cp_attach_images}
                                                                                                />
                                                                                            </div> : null
                                                                                    }


                                                                                    {
                                                                                        item.cp_attach_videos.length !== 0 ?
                                                                                            <div className="my-3">
                                                                                                <label>Videos Attached</label>
                                                                                                <PreviewVideo
                                                                                                    imagePreviewUrl={imagePreviewUrl}
                                                                                                    videos={item.cp_attach_videos}
                                                                                                />
                                                                                            </div> : null
                                                                                    }

                                                                                    {
                                                                                        item.cp_documents.length !== 0 ?
                                                                                            <div className="my-3">
                                                                                                <label>Documents Attached</label>
                                                                                                <PreviewDocuments
                                                                                                    imagePreviewUrl={imagePreviewUrl}
                                                                                                    images={item.cp_documents}
                                                                                                />
                                                                                            </div> : null

                                                                                    }

                                                                                    {
                                                                                        item.cp_observation !== null ?
                                                                                            <div className="my-3">
                                                                                                <label>Observation</label>
                                                                                                <PreviewObservation
                                                                                                    observation={item.cp_observation}
                                                                                                />
                                                                                            </div> : null
                                                                                    }

                                                                                    {
                                                                                        item.cp_actionplans.length !== 0 ?
                                                                                            <div className="my-3">
                                                                                                <label>CAPA</label>
                                                                                                <PreviewCAPA
                                                                                                    actionplans={item.cp_actionplans}
                                                                                                />
                                                                                            </div> : null
                                                                                    }

                                                                                    {
                                                                                        item.cp_review_status === "0" || item.cp_review_status === "-2" ?
                                                                                            <div>
                                                                                                <label>Reason </label> {endpointData.status === "3" ? <Link to="#" ><i className="mdi mdi-pencil font-size-20 text-primary" /></Link> : null}
                                                                                                <p>{item.cp_review_reason}</p>
                                                                                            </div> : null
                                                                                    }


                                                                                </CardBody>
                                                                            </Card>
                                                                            :
                                                                            <div style={{ backgroundColor: item.parent_id == null ? '#525252' : "#808080" }} className="p-2 my-1">
                                                                                <div className="d-flex">
                                                                                    <div className="overflow-hidden me-auto">
                                                                                        <h5 className="font-size-13  mb-1">
                                                                                            <span style={{ color: '#fffffff5' }}>{item.checkpoint}</span>
                                                                                        </h5>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                    }

                                                                </>
                                                            )
                                                        })
                                                    }</>
                                                ) : (<Card className="mb-1" style={{ border: '1px solid lightgrey' }}>
                                                    <CardBody className="pb-0 text-center">
                                                    <div className="mb-2">

                                                        No Checkpoints Available
                                                        </div>
                                                    </CardBody>

                                                </Card>
)
                                            }

                                        </div>

                                    </div>



                                    <Card className="filemanager-sidebar mb-1 " body>
                                        {
                                            <div className="my-2">
                                                <div className="" >
                                                    <label>Remarks</label>
                                                    {
                                                        endpointData.ep_review_history.length > 0 &&
                                                        endpointData.ep_review_history.map((item, idx) => {
                                                            return (
                                                                <div key={"rmks" + String(idx)} className="mb-2">
                                                                    <div>{moment(item.submitted_on).format("DD/MM/YYYY")}</div>
                                                                    <div>{item.remarks}</div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        }
                                        {
                                            endpointData.audit_signature.length !== 0 ?
                                                <div>
                                                    {
                                                        endpointData.audit_signature.map((item, i) => {
                                                            return (
                                                                <Card
                                                                    className="mt-1 mb-1 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                                    key={i + "-signfile"}
                                                                >
                                                                    <div style={{ display: 'flex', flexDirection: 'row' }} >
                                                                        <div className="p-2 col-10" >
                                                                            <label className="mb-1 font-size-11">{item.sign_by}<br />{item.designation}</label>
                                                                            <img height="80" src={imagePreviewUrl + item?.name} />
                                                                        </div>
                                                                    </div>
                                                                </Card>

                                                            )
                                                        })
                                                    }
                                                </div> : null
                                        }

                                    </Card>

                                </div>
                            </div>
                        </div>

                    </Container>
                </div>
            </React.Fragment>
        )
    }
    else {
        return null
    }


}

export default ViewCheckpoints