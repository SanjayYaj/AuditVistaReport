import React, { useState, useEffect } from "react";
import { Row, Col, UncontrolledTooltip } from "reactstrap";

const ReviewOPType = (props) => {
    const { options, get_btn_color } = props;
    
    return (
        <Row className="my-2 mx-2">
            {options.map((item, idx) => {
                const tooltipId = `option-tooltip-${idx}`;
                const isLongText = item.option_text.length > 15;
                const colorMap = {
                    success: "#34c38f",
                    danger: "#f46a6a",
                    warning: "#f1b44c",
                    secondary: "rgb(108 117 125 / 79%)"
                };

                const backgroundColor = item.is_selected && get_btn_color.cp_compliance.color 
                    ? colorMap[get_btn_color.cp_compliance.color] || "white"
                    : "white";

                return (
                    <Col
                        key={idx}
                        style={{
                            background: backgroundColor,
                            filter: !item.is_selected ? "blur(1px)" : "none",
                        }}
                        className={
                            item.is_selected && get_btn_color.cp_compliance.color 
                                ? "rounded-3 col-auto my-2 me-2"
                                : "border border-info rounded-3 col-auto my-2 me-2"
                        }
                    >
                        <div
                            className={
                                item.is_selected && get_btn_color.cp_compliance.color 
                                    ? "font-size-14 p-2 text-white"
                                    : "font-size-14 p-2 text-info"
                            }
                            id={tooltipId}
                        >
                            {isLongText ? `${item.option_text.slice(0, 15)}...` : item.option_text}
                        </div>
                        {isLongText && (
                            <UncontrolledTooltip placement="top" target={tooltipId}>
                                {item.option_text}
                            </UncontrolledTooltip>
                        )}
                    </Col>
                );
            })}
        </Row>
    );
};

export default ReviewOPType;