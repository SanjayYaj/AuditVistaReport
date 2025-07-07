import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  Col,
  UncontrolledTooltip,
  Badge,
} from "reactstrap";

import tmplIcon from "./Assests/Images/tmpl-icon-1.png";

const CardContact = ({ docItem, onEdit, onRename, onDelete, useThisTemplate, makeCopy ,canEdit}) => {
  const [tooltipOpen, setTooltipOpen] = useState({});


  const truncateText = (text, maxLength) =>
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  const toCamelCase = (str) =>
    str.replace(/(^|-)(\w)/g, (match, p1, p2) => (p1 === "-" ? "-" : "") + p2.toUpperCase());

  const className = docItem.tmpltCtdBy === "0" ? "textInfo textUppercase" : "textPrimary textUppercase";
  const templateNameCamelCase = toCamelCase(docItem.template_name);




  const TemplateNameCell = (cellProps) => {
    const item = cellProps;
    const [nameExpanded, setNameExpanded] = useState(false);
    const [infoExpanded, setInfoExpanded] = useState(false);

    const maxLength = 80;

    const isLongName = item.template_name.length > maxLength;
    const isLongInfo = item.template_info.length > maxLength;

    const displayName = nameExpanded
      ? item.template_name
      : item.template_name.slice(0, maxLength);

    const displayInfo = infoExpanded
      ? item.template_info
      : item.template_info.slice(0, maxLength);

    return (
      <div className="d-flex flex-row align-items-end">
       
        <div className="d-flex flex-column pe-2">
          <div className="font-size-12 mb-1 fw-bold" style={{ textWrap: "wrap" }}>
            {displayName}
            {isLongName && (
              <>
                {!nameExpanded && "... "}
                <button
                  onClick={() => setNameExpanded(!nameExpanded)}
                  className="btn btn-link p-0 m-0 ms-1"
                  style={{ fontSize: "10px" }}
                >
                  {nameExpanded ? "Show less" : "Show more"}
                </button>
              </>
            )}
          </div>
          <div>
            <p className="text-muted font-size-10" style={{ textWrap: "wrap" }}>
              {displayInfo}
              {isLongInfo && (
                <>
                  {!infoExpanded && "... "}
                  <button
                    onClick={() => setInfoExpanded(!infoExpanded)}
                    className="btn btn-link p-0 m-0 ms-1"
                    style={{ fontSize: "10px" }}
                  >
                    {infoExpanded ? "Show less" : "Show more"}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  };


  return (
    <Col xxl="3" xl="3" lg="3" md="4" sm="6" className="">
      <Card
        className="shadow-sm h-100"
        style={{
          borderRadius: "10px",
          border: docItem.total_checkpoints !== 0 ? "1px solid #34c38f" : "1px solid lightgrey",
          overflow: "hidden",
        }}
      >
        {/* Card Header */}
        <div className="bg-light p-2 d-flex align-items-center">
          <div
            className="ms-1 d-flex align-items-center justify-content-center"
            style={{
              height: "35px",
              width: "50px",
              borderRadius: "10%",
              background: "rgb(243, 246, 251)",
            }}
          >
            <img src={tmplIcon} alt="Template Icon" style={{ height: "100%", width: "100%", objectFit: "contain" }} />
          </div>
        </div>

        {/* Card Body */}
        {/* <CardBody className="p-2">
          {TemplateNameCell(docItem)}
          {docItem.category?.cat_name && docItem.category?.cat_name !== undefined &&
            <div id={`templateInfo-${docItem._id}`} className="card-text text-muted font-size-10 mb-1"
              style={{ maxWidth: "100%", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer" }}>
              Category: <h6> {docItem.category?.cat_name}</h6>
            </div>
          }
          {docItem.template_info.length > 120 && (
            <UncontrolledTooltip placement='left' target={`templateInfo-${docItem._id}`}
              style={{ maxWidth: "500px", whiteSpace: "normal", wordWrap: "break-word", textAlign: "left", padding: "8px", borderRadius: '10px' }}>
              {docItem.template_info}
            </UncontrolledTooltip>
          )}
        </CardBody> */}


          <CardBody className="p-2">
  {TemplateNameCell(docItem)}

  <div
    id={`templateInfo-${docItem._id}`}
    className="card-text text-muted font-size-10 mb-1"
    style={{
      maxWidth: "100%",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      overflow: "hidden",
      textOverflow: "ellipsis",
      cursor: docItem.template_info.length > 120 ? "pointer" : "default",
    }}
  >
    {docItem.category?.cat_name && (
      <>
        Category: <h6>{docItem.category.cat_name}</h6>
      </>
    )}
  </div>

  {docItem.template_info.length > 120 && (
    <UncontrolledTooltip
      placement="left"
      target={`templateInfo-${docItem._id}`}
      style={{
        maxWidth: "500px",
        whiteSpace: "normal",
        wordWrap: "break-word",
        textAlign: "left",
        padding: "8px",
        borderRadius: "10px",
      }}
    >
      {docItem.template_info}
    </UncontrolledTooltip>
  )}
</CardBody>


        {/* Card Footer */}
        <CardFooter className="bg-white d-flex justify-content-between align-items-center p-2" style={{ borderTop: "1px solid #f1f1f1" }}>
          <span className={`font-size-11 ${docItem.total_checkpoints !== 0 ? 'badge badge-soft-success' : 'badge badge-soft-secondary'}`}>
            Checkpoints: {docItem.total_checkpoints}
          </span>

          {canEdit &&
          <div className="d-flex gap-2">
            <div className="btn btn-sm btn-soft-primary" id={`copytooltip-${docItem._id}`} onClick={() => makeCopy(docItem)} style={{ cursor: "pointer" }}  >
              <i className="bx bx-copy" />
            </div>
            <UncontrolledTooltip placement="top" target={`copytooltip-${docItem._id}`}>
              Make a Copy
            </UncontrolledTooltip>
            <div className="btn btn-sm btn-soft-primary" id={`view-${docItem._id}`} onClick={() => onEdit(docItem)} style={{ cursor: "pointer" }}  >
              <i className="mdi mdi-clipboard-text-outline" />
            </div>

            <UncontrolledTooltip placement="top" target={`view-${docItem._id}`}>
              Edit Template
            </UncontrolledTooltip>

            {/* Rename Button */}
            <Link to="#" className="btn btn-sm btn-soft-info" id={`rename-${docItem._id}`} onClick={() => onRename(docItem)}>
              <i className="bx bx-edit-alt" />
            </Link>
            <UncontrolledTooltip placement="top" target={`rename-${docItem._id}`}>
              Rename Template
            </UncontrolledTooltip>

            {/* Delete Button */}
            <Link to="#" className="btn btn-sm btn-soft-danger" id={`delete-${docItem._id}`} onClick={() => onDelete(docItem)}>
              <i className="bx bx-trash" />
            </Link>
            <UncontrolledTooltip placement="top" target={`delete-${docItem._id}`}>
              Delete Template
            </UncontrolledTooltip>

            {/* Use Template Button */}
            <Link
              to="#"
              className={docItem.total_checkpoints !== 0 ? "btn btn-sm btn-soft-success" : "btn btn-sm btn-soft-secondary"}
              id={`use-${docItem._id}`}
              onClick={() => {
                if (docItem.total_checkpoints !== 0) {
                  useThisTemplate(docItem);
                }
              }}
            >
              <i className={docItem.total_checkpoints === 0 ? "mdi mdi-share-off" : "mdi mdi-share"} />
            </Link>
            <UncontrolledTooltip placement="top" target={`use-${docItem._id}`}>
              {docItem.total_checkpoints === 0 ? "Add check points and use this template" : "Use this template as"}
            </UncontrolledTooltip>
          </div>
}
        </CardFooter>
      </Card>
    </Col>
  );
};

CardContact.propTypes = {
  docItem: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  useThisTemplate: PropTypes.func.isRequired,
};

export default CardContact;








