import React from 'react';
import { Col, Row } from "reactstrap";
import { Link } from "react-router-dom";

const PreviewDocuments = (props) => {
    const { images, imagePreviewUrl } = props;

    return (
        <Row>
            {images.map((item, idx) => (
                <Col key={idx}>
                    {item.filetype === "application/zip" ? (
                        <Col>
                            <Link to={`//${imagePreviewUrl}${item.preview}`} target="_blank" download>
                                <i className="fas fa-file-archive text-warning me-2" style={{ fontSize: 35 }} />
                                <span>{item.originalName}</span>
                            </Link>
                        </Col>
                    ) : item.filetype === "application/pdf" ? (
                        <Col>
                            <a href={`${imagePreviewUrl}${item.originalName}`} target="_blank" rel="noreferrer">
                                <i className="fas fa-file-pdf text-danger me-2" style={{ fontSize: 35 }} />
                                <span>{item.originalName}</span>
                            </a>
                        </Col>
                    ) : item.filetype === "application/xls" || item.filetype === "application/xlsx" || item.filetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? (
                        <Col>
                            <Link to={`//${imagePreviewUrl}${item.preview}`} target="_blank" download>
                                <i className="fas fa-file-excel text-success me-2" style={{ fontSize: 35 }} />
                                <span>{item.originalName}</span>
                            </Link>
                        </Col>
                    ) : (
                        <Col>
                            <Link to={`//${imagePreviewUrl}${item.preview}`} target="_blank" download>
                                <i className="fas fa-file text-primary me-2" style={{ fontSize: 35 }} />
                                <span>{item.originalName}</span>
                            </Link>
                        </Col>
                    )}
                </Col>
            ))}
        </Row>
    );
};

export default PreviewDocuments;
