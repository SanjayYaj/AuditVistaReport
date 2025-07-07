import React from 'react';
import { Row, Col } from "reactstrap";
const _ = require('lodash');

const PreviewVideo = (props) => {
    const { videos, imagePreviewUrl } = props;

    return (
        <Row>
            {videos.map((item, idx) => (
                <Col xs={6} sm={4} md={3} lg={2} className="px-1 d-flex" key={idx}>
                    <div
                        style={{
                            width: "100%",
                            height: "0",
                            paddingBottom: "56.25%", 
                            position: "relative",
                            backgroundColor: "#f5f5f5",
                            border: "1px solid #e9e9e9",
                        }}
                    >
                        <video
                            src={imagePreviewUrl +props.folderPath +(item?.name ? item.name : item.originalname)}
                            className="img-fluid"
                            style={{
                                position: "absolute",
                                top: "0",
                                left: "0",
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                            controls
                        />
                    </div>
                </Col>
            ))}
        </Row>
    );
};

export default PreviewVideo;
