import React, { useState, useEffect } from 'react';
import { Collapse, CardBody, Card, Row, Col } from 'reactstrap';
import { FaChevronDown } from 'react-icons/fa';
import ReviewOPType from "./Components/review_optype";
import PreviewImage from "./Components/preview_images";
import PreviewDocuments from "./Components/preview_documents";
import PreviewObservation from "./Components/preview_observation";
import PreviewCAPA from "./Components/preview_CAPA";
import PreviewVideo from "./Components/preview_videos";


const ExpandNestedChildren = (props) => {
    const { children } = props;


    const [isCollapseOpen, setIsCollapseOpen] = useState(false);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem("authUser"));
        setImagePreviewUrl(data.config_data.img_url);
    }, []);

    const toggleCollapse = () => {
        setIsCollapseOpen(prevState => !prevState);
    };
    return (
        <React.Fragment>
            <div >
                <div onClick={toggleCollapse}>
                    {
                        children.document_type !== '2' &&
                        <Card style={{ background: "rgb(233, 238, 246)", boxShadow: 'none', border: '1px solid #dedede', cursor: 'pointer' }} className='mb-1' >
                            <CardBody style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                                <div className='d-flex'>
                                    {isCollapseOpen ? (
                                        <div>
                                            <FaChevronDown size={13} className="me-3" />
                                        </div>
                                    ) : (
                                        <div>
                                            <FaChevronDown
                                                size={13}
                                                className="me-3"
                                                style={{ transform: 'rotate(270deg)' }}
                                            />
                                        </div>
                                    )}

                                    {children.checkpoint}
                                </div>
                            </CardBody>
                        </Card>
                    }
                </div>
                <Collapse isOpen={isCollapseOpen || children.document_type == "2"} >
                    {children.document_type === "2" && (
                        <ul style={{ paddingLeft: 0, marginBottom: 0 }} className='bg-light'>
                            {
                                children.document_type == "2" &&
                                <Card className="mt-2" style={{ background: 'white', marginBottom: 0, borderRadius: '0.5rem', border: '1px solid lightgrey' }} >
                                    <CardBody style={{ paddingTop: '10px', paddingBottom: '10px' }} >
                                        <div>
                                            <Row className='mb-3'>
                                                <Col md={3}>
                                                    {children.cp_status !== '0' && (
                                                        <>
                                                            <span className="font-size-10">Compliance status</span><br />

                                                            <label
                                                                className={
                                                                    children.cp_compliance.color !== undefined && children.cp_compliance.color === 'success' ? 'text-success font-size-12'
                                                                        : children.cp_compliance.color !== undefined && children.cp_compliance.color === 'danger' ? 'text-danger font-size-12'
                                                                            : children.cp_compliance.color !== undefined && children.cp_compliance.color === 'warning' ? 'text-warning font-size-12'
                                                                                : children.cp_compliance.color !== undefined && children.cp_compliance.color === 'secondary' ? 'text-secondary font-size-12'
                                                                                    : 'font-size-12'
                                                                }
                                                            >
                                                                {children.cp_compliance.name}
                                                            </label>
                                                        </>
                                                    )}
                                                </Col>
                                                <Col md={2}>
                                                    <>
                                                        <span className="font-size-10">Impact Level</span><br />

                                                        {

                                                            children.impact_level === 'Low'
                                                                ? <label className="font-size-12 badge badge-soft-success">Low</label>
                                                                : children.impact_level === 'Medium'
                                                                    ? <label className="font-size-12 badge badge-soft-info">Medium</label>
                                                                    : children.impact_level === 'High'
                                                                        ? <label className="font-size-12 badge badge-soft-warning">High</label>
                                                                        : children.impact_level === 'Critical'
                                                                            ? <label className="font-size-12 badge badge-soft-danger">Critical</label>
                                                                            : <label className="font-size-12 badge badge-soft-primary ">No impact</label>

                                                        }
                                                    </>
                                                </Col>
                                                <Col md={7}>
                                                    <>
                                                        <span className="font-size-10">Type </span><br />
                                                        <label className="font-size-12">
                                                            {children.compl_type.map((item, index) => {
                                                                const formattedItem = index === children.compl_type.length - 1 ? item + '.' : item;
                                                                return formattedItem;
                                                            }).join(', ')}
                                                        </label>
                                                    </>
                                                </Col>
                                            </Row>
                                        </div>

                                        <div className="mb-1">
                                            <span className="font-size-14 fw-bold">{children.checkpoint}</span>
                                        </div>

                                        {(children.checkpoint_type_id >= '1' && children.checkpoint_type_id <= '5') && (
                                            <ReviewOPType options={children.checkpoint_options} get_btn_color={children} />
                                        )}

                                        {children.cp_attach_images.length !== 0 && (
                                            <div className="mt-4">
                                                <label>Images Attached</label>
                                                <PreviewImage
                                                    imagePreviewUrl={imagePreviewUrl}
                                                    images={children.cp_attach_images}
                                                />
                                            </div>
                                        )}
                                        {children.cp_attach_videos !== undefined && children.cp_attach_videos.length !== 0 && (
                                            <div className="mt-4">
                                                <label>Videos Attached</label>
                                                <PreviewVideo
                                                    imagePreviewUrl={imagePreviewUrl}
                                                    videos={children.cp_attach_videos}
                                                />
                                            </div>
                                        )}

                                        {children.cp_documents.length !== 0 && (
                                            <div className="mt-4">
                                                <label>Documents Attached</label>
                                                <PreviewDocuments
                                                    imagePreviewUrl={imagePreviewUrl}
                                                    images={children.cp_documents}
                                                />
                                            </div>
                                        )}

                                        {children.cp_observation !== null && (
                                            <div className="mt-4">
                                                <label>Observation</label>
                                                <PreviewObservation observation={children.cp_observation} />
                                            </div>
                                        )}

                                        {children.cp_actionplans.length !== 0 && (
                                            <div className="mt-4">
                                                <label>Corrective And Preventive Action(CAPA)</label>
                                                <PreviewCAPA actionplans={children.cp_actionplans} />
                                            </div>
                                        )}
                                    </CardBody>
                                </Card>
                            }

                        </ul>
                    )}
                    {children.children && children.children.length > 0 && (
                        <div>
                            {children.children.map((child, index) => (
                                <ExpandNestedChildren key={child._id}>{child}</ExpandNestedChildren>
                            ))}
                        </div>
                    )}
                </Collapse>



            </div>

        </React.Fragment>
    )


}

export default ExpandNestedChildren