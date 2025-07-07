import React from 'react';
import { Link } from "react-router-dom";
import {
    Button,
    Col,
    Form,
    Media,
    Row,
    UncontrolledDropdown,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from "reactstrap";
import { Popconfirm } from 'antd';

const MediaPreview = (props) => {

    const { f, imagePreviewUrl, audit_status, retryUpload, deletedocuments, index } = props



    const preview = f.originalName;

    return (
        <Row>
            {
                f.filetype === "application/zip" ?
                    <Col className="col-auto">
                        <i className="fas fa-file-archive text-warning" style={{ fontSize: 50 }} />
                    </Col>
                    :
                    f.filetype === "application/pdf" ?
                        <Col className="col-auto">
                            <i className="fas fa-file-pdf text-danger" style={{ fontSize: 50 }} />
                        </Col>
                        :
                        f.filetype === "application/xls" || f.filetype === "application/xlsx" || f.filetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ?
                            <Col className="col-auto">
                                <i className="fas fa-file-excel text-success" style={{ fontSize: 50 }} />
                            </Col>
                            :
                            f.filetype === "image/jpeg" ?
                                <Col className="col-auto">
                                    <img
                                        data-dz-thumbnail=""
                                        height="80"
                                        className="avatar-sm rounded bg-light"
                                        alt={f.originalName}
                                        src={imagePreviewUrl + preview}
                                    />
                                </Col> :
                                <Col className="col-auto">
                                    <i className="fas fa-file text-primary" style={{ fontSize: 50 }} />
                                </Col>
            }

            <Col>
                <a href={`${imagePreviewUrl + preview}`} target="_blank" rel="noreferrer">
                    <button
                        type="submit"
                        className="text-muted font-weight-bold"
                        style={{ textAlign: 'left', padding: 0, background: 'none', border: 'none' }}
                    >
                        {f.originalName}
                    </button>
                </a>

                <p className="mb-0 font-size-11">
                    <strong>{f.formattedSize}</strong>
                </p>
            </Col>

            {
                audit_status !== "3" && audit_status !== "4" ?
                    <>
                        <div className="col-2 text-end me-2">
                            <Popconfirm
                                title="Are you sure you want to delete?"
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => { deletedocuments(index); }}
                            >
                                <Link to="#">
                                    <i className="mdi mdi-close-circle-outline font-size-20 text-danger" />
                                </Link>
                            </Popconfirm>
                        </div>
                        <div className="mt-1">
                            <span className={f.uploading ? "font-size-10 text-danger" : "font-size-10 text-success"}>{f.uploadingStatus}</span>
                        </div>
                    </> : null
            }
        </Row>
    );
};

export default MediaPreview;
