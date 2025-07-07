import React from "react";
import { Row, Col, Input, Label } from "reactstrap";
import TagsInput from "react-tagsinput";
import { setmediaErrors } from "toolkitStore/Auditvista/treeSlice";
import {useDispatch } from 'react-redux';


const ManageCheckpointConfigSection = ({ idx, data, checkpointInfo, updateRuleField, submitProcess }) => {
  const [mediaErrors, setMediaErrors] = React.useState({});

  const dispatch = useDispatch();


  const rule = checkpointInfo.rule?.[idx] || {};
  const imageInfo = rule.image_info || {};
  const videoInfo = rule.video_info || {};
  const capaInfo = rule.capa_info || {};
  const documents = rule.document_info || [];


  const hasAnyMediaError = (errors) => {
    for (const idxKey in errors) {
      const section = errors[idxKey];
      for (const type in section) {
        for (const field in section[type]) {
          if (section[type][field]) return true;
        }
      }
    }
    return false;
  };
  
  

  const handleImageCheckboxChange = (field, val) => {
    const updatedImageInfo = { ...imageInfo, [field]: !val };
    updateRuleField(idx, "image_info", updatedImageInfo);
  };

  const handleImageChange = (field, val) => {
    const updatedImageInfo = { ...imageInfo, [field]: Number(val) };
    const errors = { ...mediaErrors };
    if (!errors[idx]) errors[idx] = {};
    if (!errors[idx].image) errors[idx].image = {};

    const minVal = Number(updatedImageInfo.min);
    const maxVal = Number(updatedImageInfo.max);
    if (!isNaN(minVal) && !isNaN(maxVal)) {
      if (minVal > maxVal) {
        errors[idx].image.min = "Minimum cannot be greater than Maximum";
        errors[idx].image.max = "";
      } else {
        errors[idx].image.min = "";
        errors[idx].image.max = "";
      }
    }

    setMediaErrors(errors);
    dispatch(setmediaErrors(hasAnyMediaError(errors)));
    updateRuleField(idx, "image_info", updatedImageInfo);
  };

  const handleVideoCheckboxChange = (field, val) => {
    const updatedVideoInfo = { ...videoInfo, [field]: !val };
    updateRuleField(idx, "video_info", updatedVideoInfo);
  };

  const handleVideoChange = (field, val) => {
    const updatedVideoInfo = { ...videoInfo, [field]: Number(val) };
    const errors = { ...mediaErrors };
    if (!errors[idx]) errors[idx] = {};
    if (!errors[idx].video) errors[idx].video = {};

    const minVal = Number(updatedVideoInfo.min);
    const maxVal = Number(updatedVideoInfo.max);
    if (!isNaN(minVal) && !isNaN(maxVal)) {
      if (minVal > maxVal) {
        errors[idx].video.min = "Minimum cannot be greater than Maximum";
        errors[idx].video.max = "";
      } else {
        errors[idx].video.min = "";
        errors[idx].video.max = "";
      }
    }

    setMediaErrors(errors);
    dispatch(setmediaErrors(hasAnyMediaError(errors)));
    updateRuleField(idx, "video_info", updatedVideoInfo);
  };

  const handleDocumentsChange = (docs) => {
    updateRuleField(idx, "document_info", docs);
  };

  const handleCapaChange = (field, checked) => {
    const updatedCapaInfo = { ...capaInfo, [field]: checked };
    updateRuleField(idx, "capa_info", updatedCapaInfo);
  };

  if (!data.show_config) return null;

  return (
    <div>
      {/* Image Section */}
      <SectionWrapper title="Image">
        <SourceCheckboxes info={imageInfo} onChange={handleImageCheckboxChange} />
        <Row>
          {["min", "max"].map((field) => (
            <Col key={field}>
              <Label className="mb-1">{field === "min" ? "Minimum" : "Maximum"}</Label>
              <Input
                type="number"
                placeholder={`Enter ${field}`}
                value={imageInfo[field] || ""}
                onChange={(e) => handleImageChange(field, e.target.value)}
                disabled={!(imageInfo.camera || imageInfo.gallery)}
              />
              {mediaErrors[idx]?.image?.[field] && (
                <small className="text-danger mt-1">{mediaErrors[idx].image[field]}</small>
              )}
              {submitProcess && (imageInfo.camera || imageInfo.gallery) && !imageInfo[field] && (
                <small className="text-danger mt-1">
                  {field === "min" ? "Minimum is required" : "Maximum is required"}
                </small>
              )}
            </Col>
          ))}
        </Row>
      </SectionWrapper>

      {/* Video Section */}
      <SectionWrapper title="Video">
        <SourceCheckboxes info={videoInfo} onChange={handleVideoCheckboxChange} />
        <Row>
          {["min", "max", "duration (Seconds)"].map((field) => (
            <Col key={field}>
              <Label className="mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input
                type="number"
                placeholder={`Enter ${field === 'duration (Seconds)' ? 'Duration' : field}`}
                value={videoInfo[field] || ""}
                onChange={(e) => handleVideoChange(field, e.target.value)}
                disabled={!(videoInfo.camera || videoInfo.gallery)}
              />
              {mediaErrors[idx]?.video?.[field] && (
                <small className="text-danger mt-1">{mediaErrors[idx].video[field]}</small>
              )}
              {submitProcess && (videoInfo.camera || videoInfo.gallery) && !videoInfo[field] && (
                <small className="text-danger mt-1">
                  {`${field.charAt(0).toUpperCase() + field.slice(1)} is required`}
                </small>
              )}
            </Col>
          ))}
        </Row>
      </SectionWrapper>

      {/* Documents */}
      <SectionWrapper title="Documents">
        <TagsInput
          value={documents}
          onChange={handleDocumentsChange}
          className="form-control react-tagsinput-false bg-white"
          inputProps={{ placeholder: "Input document name and hit enter" }}
        />
      </SectionWrapper>

      {/* CAPA */}
      <div className="border border-light bg-light" style={{ padding: 15, borderRadius: 8 }}>
        <Row className="align-items-center">       
            <Col>
            <Label className="mb-0 me-2">Is CAPA Mandatory</Label>
              <Input
                type="checkbox"
                defaultChecked={capaInfo.mandatory || false}
                onChange={(e) => handleCapaChange("mandatory", e.target.checked)}
              />
            </Col>
        </Row>
      </div>
    </div>
  );
};

// Helper: Wrapper component for each section
const SectionWrapper = ({ title, children }) => (
  <div style={sectionStyle}>
    <div className="col-12">
      <div className="bg-light p-3 rounded">
        <Label className="mb-2 fw-bold">{title}</Label>
        {children}
      </div>
    </div>
  </div>
);

// Helper: Checkbox group for camera/gallery
const SourceCheckboxes = ({ info, onChange }) => (
  <div className="mb-3 d-flex gap-4">
    {["camera", "gallery"].map((source) => (
      <div key={source} className="d-flex align-items-center">
        <Input
          type="checkbox"
          className="form-check-input"
          defaultChecked={info[source] || false}
          onClick={() => onChange(source, info[source])}
        />
        <Label className="form-check-label ms-2 d-flex align-items-center">
          <i className={`fas fa-${source === "camera" ? "camera" : "image"} me-1`} />
          {source.charAt(0).toUpperCase() + source.slice(1)}
        </Label>
      </div>
    ))}
  </div>
);

const sectionStyle = {
  display: "flex",
  flexDirection: "column",
  borderBottom: "1px solid #f0f0f0",
  paddingBottom: 10,
  marginTop: 10,
};

export default ManageCheckpointConfigSection;
