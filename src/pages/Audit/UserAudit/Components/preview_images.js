import React from 'react';
import { Row, Col } from "reactstrap";
import { Image } from 'antd';
import _ from 'lodash';

const PreviewImage = (props) => {
    const { images, imagePreviewUrl } = props;

    return (
        <Row>
            {images.map((item, idx) => (
                <Col sm={3} md={2} lg={2} key={idx} className="pe-1">
                    <div
                        style={{
                            width: "auto",
                            height: "140px",
                            overflow: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#f5f5f5",
                            border: '1px solid #e9e9e9',
                            borderRadius: '10px',
                        }}
                    >
                        <Image
                            src={imagePreviewUrl+props.folderPath + (item?.name ? item.name : item.originalname)}
                            className="img-fluid"
                            style={{
                                maxHeight: "100%",
                                maxWidth: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </div>
                </Col>
            ))}
        </Row>
    );
};

export default PreviewImage;
