import React from "react";
import { Row, Col, Input, Label } from "reactstrap";
import TagsInput from "react-tagsinput";
import { setmediaErrors } from "toolkitStore/Auditvista/treeSlice";
import { useDispatch } from "react-redux";

const CheckpointConfigSection = ({ idx, data, checkpointInfo, updateRuleField, submitProcess }) => {
  const [mediaErrors, setMediaErrors] = React.useState({});
  const dispatch = useDispatch();

  const rule = checkpointInfo.rule?.[idx] || {
    image_info: { camera: false, gallery: false, max: 0, min: null },
    video_info: { camera: false, gallery: false, max: 0, min: null, duration: null },
    capa_info: { enable_capa: false, mandatory: false },
    document_info: [],
    images: [],
    videos: [],
    documents: []
  };
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

  const isCameraOrGalleryEnabled = updatedImageInfo.camera || updatedImageInfo.gallery;

  if (isCameraOrGalleryEnabled) {
    if (updatedImageInfo.min == null || updatedImageInfo.min < 0) {
      updatedImageInfo.min = 0;
    }
  } else {
    updatedImageInfo.min = null;
  }
  updateRuleField(idx, "image_info", updatedImageInfo);
};



  const handleImageChange = (field, val) => {
    const numericVal = Math.max(0, Number(val));
    const updatedImageInfo = { ...imageInfo, [field]: numericVal };
    const errors = { ...mediaErrors };
    if (!errors[idx]) errors[idx] = {};
    if (!errors[idx].image) errors[idx].image = {};

    const minVal = Number(field === "min" ? numericVal : updatedImageInfo.min);
    const maxVal = Number(field === "max" ? numericVal : updatedImageInfo.max);

    // if (minVal > maxVal) {
    //   errors[idx].image.min = "Minimum cannot be greater than Maximum";
    //   errors[idx].image.max = "";
    // } else {
    //   errors[idx].image.min = "";
    //   errors[idx].image.max = "";
    // }
    if ((minVal !== null && minVal !== undefined && minVal !== "") &&
      (maxVal !== null && maxVal !== undefined && maxVal !== "")) {
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

  const isCameraOrGalleryEnabled = updatedVideoInfo.camera || updatedVideoInfo.gallery;

  if (isCameraOrGalleryEnabled) {
    // Ensure min is at least 0 if undefined or less than 0
    if (updatedVideoInfo.min == null || updatedVideoInfo.min < 0) {
      updatedVideoInfo.min = 0;
      updatedVideoInfo.duration = 5;
    }
  } else {
    // Clear min if both sources are unchecked
    updatedVideoInfo.min = null;
    updatedVideoInfo.duration = null;
  }

  updateRuleField(idx, "video_info", updatedVideoInfo);
};


  const handleVideoChange = (field, val) => {
    const numericVal = Math.max(0, Number(val));
    const updatedVideoInfo = { ...videoInfo, [field]: numericVal };
    const errors = { ...mediaErrors };
    if (!errors[idx]) errors[idx] = {};
    if (!errors[idx].video) errors[idx].video = {};

    const minVal = Number(field === "min" ? numericVal : updatedVideoInfo.min);
    const maxVal = Number(field === "max" ? numericVal : updatedVideoInfo.max);

    if (minVal > maxVal) {
      errors[idx].video.min = "Minimum cannot be greater than Maximum";
      errors[idx].video.max = "";
    } else {
      errors[idx].video.min = "";
      errors[idx].video.max = "";
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
                min="0"
                placeholder={`Enter ${field}`}
                value={ field === "min" ? imageInfo[field] !== undefined && imageInfo[field] !== null ? imageInfo[field] : "" : imageInfo[field] || ""}
                onChange={(e) => handleImageChange(field, e.target.value)}
                disabled={!(imageInfo.camera || imageInfo.gallery)}
              />
              {mediaErrors[idx]?.image?.[field] && (
                <small className="text-danger mt-1">{mediaErrors[idx].image[field]}</small>
              )}
             
              {/* {submitProcess && (imageInfo.camera || imageInfo.gallery) && !imageInfo[field] && (
                <small className="text-danger mt-1">
                  {field === "min" ? "Minimum is required" : "Maximum is required"}
                </small>
              )} */}
              {submitProcess && (imageInfo.camera || imageInfo.gallery) && !imageInfo[field] && (
                <small className="text-danger mt-1">
                  {field === "max" && "Maximum is required"}
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
          {["min", "max", "duration (Seconds)"].map((field) => {
            const actualField = field === "duration (Seconds)" ? "duration" : field;
            return (
              <Col key={field}>
                 <Label className="mb-1">{field === 'duration (Seconds)' ?'Maximum Duration (Seconds)' :  field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                <Input
                  type="number"
                  min="0"
                 placeholder={`Enter ${field === 'duration (Seconds)' ? 'Maximum Duration' : field}`}
                  value={
                    actualField === "min"
                      ? videoInfo[actualField] !== undefined && videoInfo[actualField] !== null
                        ? videoInfo[actualField]
                        : ""
                      : videoInfo[actualField] || ""
                  }

                  onChange={(e) => handleVideoChange(actualField, e.target.value)}
                  disabled={!(videoInfo.camera || videoInfo.gallery)}
                />
                {mediaErrors[idx]?.video?.[actualField] && (
                  <small className="text-danger mt-1">{mediaErrors[idx].video[actualField]}</small>
                )}


                
                 {field !== 'min' && (
                  <>
                    {submitProcess && (videoInfo.camera || videoInfo.gallery) && (
                      <>
                        {actualField === "duration" && (!videoInfo.duration || Number(videoInfo.duration) < 5) && (
                          <small className="text-danger mt-1">
                            Duration must be at least 5 seconds
                          </small>
                        )}

                        {actualField === "max" && (!videoInfo.max || Number(videoInfo.max) === 0) && (
                          <small className="text-danger mt-1">
                            Maximum is required
                          </small>
                        )}
                      </>

                    )}
                  </>
                )}

              </Col>
            );
          })}
        </Row>
      </SectionWrapper>

      {/* Documents */}
      <SectionWrapper title="Documents">
        <TagsInput
          value={documents}
          onChange={handleDocumentsChange}
          className="form-control react-tagsinput-false bg-white"
          inputProps={{ placeholder: "Input document name and hit enter", style: { minWidth: '300px' } }}
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

export default CheckpointConfigSection;










// import React from "react";
// import { Row, Col, Input, Label } from "reactstrap";
// import TagsInput from "react-tagsinput";
// import { setmediaErrors } from "toolkitStore/Auditvista/treeSlice";
// import {useDispatch } from 'react-redux';


// const CheckpointConfigSection = ({ idx, data, checkpointInfo, updateRuleField, submitProcess }) => {
//   const [mediaErrors, setMediaErrors] = React.useState({});

//   const dispatch = useDispatch();


//   // const rule = checkpointInfo.rule?.[idx] || {};
//     const rule = checkpointInfo.rule?.[idx] || {
//     image_info: { camera: false, gallery: false, max: 0, min: 0 },
//     video_info: { camera: false, gallery: false, max: 0, min: 0, duration: 30 },
//     capa_info: { enable_capa: false, mandatory: false },
//     document_info: [],
//     images: [],
//     videos: [],
//     documents: []
//   };
//   const imageInfo = rule.image_info || {};
//   const videoInfo = rule.video_info || {};
//   const capaInfo = rule.capa_info || {};
//   const documents = rule.document_info || [];




//   const hasAnyMediaError = (errors) => {
//     for (const idxKey in errors) {
//       const section = errors[idxKey];
//       for (const type in section) {
//         for (const field in section[type]) {
//           if (section[type][field]) return true;
//         }
//       }
//     }
//     return false;
//   };
  
  

//   const handleImageCheckboxChange = (field, val) => {
//     const updatedImageInfo = { ...imageInfo, [field]: !val };
//     updateRuleField(idx, "image_info", updatedImageInfo);
//   };

//   const handleImageChange = (field, val) => {
//     const updatedImageInfo = { ...imageInfo, [field]: Number(val) };
//     const errors = { ...mediaErrors };
//     if (!errors[idx]) errors[idx] = {};
//     if (!errors[idx].image) errors[idx].image = {};

//     const minVal = Number(updatedImageInfo.min);
//     const maxVal = Number(updatedImageInfo.max);
//     if (!isNaN(minVal) && !isNaN(maxVal)) {
//       if (minVal > maxVal) {
//         errors[idx].image.min = "Minimum cannot be greater than Maximum";
//         errors[idx].image.max = "";
//       } else {
//         errors[idx].image.min = "";
//         errors[idx].image.max = "";
//       }
//     }

//     setMediaErrors(errors);
//     dispatch(setmediaErrors(hasAnyMediaError(errors)));
//     updateRuleField(idx, "image_info", updatedImageInfo);
//   };

//   const handleVideoCheckboxChange = (field, val) => {
//     const updatedVideoInfo = { ...videoInfo, [field]: !val };
//     updateRuleField(idx, "video_info", updatedVideoInfo);
//   };

//   const handleVideoChange = (field, val) => {
//     const updatedVideoInfo = { ...videoInfo, [field]: Number(val) };
//     const errors = { ...mediaErrors };
//     if (!errors[idx]) errors[idx] = {};
//     if (!errors[idx].video) errors[idx].video = {};

//     const minVal = Number(updatedVideoInfo.min);
//     const maxVal = Number(updatedVideoInfo.max);
//     if (!isNaN(minVal) && !isNaN(maxVal)) {
//       if (minVal > maxVal) {
//         errors[idx].video.min = "Minimum cannot be greater than Maximum";
//         errors[idx].video.max = "";
//       } else {
//         errors[idx].video.min = "";
//         errors[idx].video.max = "";
//       }
//     }

//     setMediaErrors(errors);
//     dispatch(setmediaErrors(hasAnyMediaError(errors)));
//     updateRuleField(idx, "video_info", updatedVideoInfo);
//   };

//   const handleDocumentsChange = (docs) => {
//     updateRuleField(idx, "document_info", docs);
//   };

//   const handleCapaChange = (field, checked) => {
//     const updatedCapaInfo = { ...capaInfo, [field]: checked };
//     updateRuleField(idx, "capa_info", updatedCapaInfo);
//   };

//   if (!data.show_config) return null;

//   return (
//     <div>
//       {/* Image Section */}
//       <SectionWrapper title="Image">
//         <SourceCheckboxes info={imageInfo} onChange={handleImageCheckboxChange} />
//         <Row>
//           {["min", "max"].map((field) => (
//             <Col key={field}>
//               <Label className="mb-1">{field === "min" ? "Minimum" : "Maximum"}</Label>
//               <Input
//                 type="number"
//                 placeholder={`Enter ${field}`}
//                 value={imageInfo[field] || ""}
//                 onChange={(e) => handleImageChange(field, e.target.value)}
//                 disabled={!(imageInfo.camera || imageInfo.gallery)}
//                 min={0}
//               />
//               {mediaErrors[idx]?.image?.[field] && (
//                 <small className="text-danger mt-1">{mediaErrors[idx].image[field]}</small>
//               )}
//               {submitProcess && (imageInfo.camera || imageInfo.gallery) && !imageInfo[field] && (
//                 <small className="text-danger mt-1">
//                   {field === "min" ? "Minimum is required" : "Maximum is required"}
//                 </small>
//               )}
//             </Col>
//           ))}
//         </Row>
//       </SectionWrapper>

//       {/* Video Section */}
//       <SectionWrapper title="Video">
//         <SourceCheckboxes info={videoInfo} onChange={handleVideoCheckboxChange} />
//         <Row>
//           {["min", "max", "duration (Seconds)"].map((field) => (
//             <Col key={field}>
//               <Label className="mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
//               <Input
//                 type="number"
//                 placeholder={`Enter ${field === 'duration (Seconds)' ? 'Duration' : field}`}
//                 value={videoInfo[field] || ""}
//                 onChange={(e) => handleVideoChange(field === 'duration (Seconds)' ? 'duration' : field, e.target.value)}
//                 disabled={!(videoInfo.camera || videoInfo.gallery)}
//               />
//               {mediaErrors[idx]?.video?.[field] && (
//                 <small className="text-danger mt-1">{mediaErrors[idx].video[field]}</small>
//               )}
//               {submitProcess && (videoInfo.camera || videoInfo.gallery) && !videoInfo[field] && (
//                 <small className="text-danger mt-1">
//                   {`${field.charAt(0).toUpperCase() + field.slice(1)} is required`}
//                 </small>
//               )}
//             </Col>
//           ))}
//         </Row>
//       </SectionWrapper>

//       {/* Documents */}
//       <SectionWrapper title="Documents">
//         <TagsInput
//           value={documents}
//           onChange={handleDocumentsChange}
//           className="form-control react-tagsinput-false bg-white"
//           inputProps={{ placeholder: "Input document name and hit enter", style: { minWidth: '300px' }  }}
//         />
//       </SectionWrapper>



//       {/* CAPA */}
//    <div className="border border-light bg-light" style={{ padding: 15, borderRadius: 8 }}>
//         <Row className="align-items-center">       
//             <Col>
//             <Label className="mb-0 me-2">Is CAPA Mandatory</Label>
//               <Input
//                 type="checkbox"
//                 defaultChecked={capaInfo.mandatory || false}
//                 onChange={(e) => handleCapaChange("mandatory", e.target.checked)}
//               />
//             </Col>
//         </Row>
//       </div>
//     </div>
//   );
// };

// // Helper: Wrapper component for each section
// const SectionWrapper = ({ title, children }) => (
//   <div style={sectionStyle}>
//     <div className="col-12">
//       <div className="bg-light p-3 rounded">
//         <Label className="mb-2 fw-bold">{title}</Label>
//         {children}
//       </div>
//     </div>
//   </div>
// );

// // Helper: Checkbox group for camera/gallery
// const SourceCheckboxes = ({ info, onChange }) => (
//   <div className="mb-3 d-flex gap-4">
//     {["camera", "gallery"].map((source) => (
//       <div key={source} className="d-flex align-items-center">
//         <Input
//           type="checkbox"
//           className="form-check-input"
//           defaultChecked={info[source] || false}
//           onClick={() => onChange(source, info[source])}
//         />
//         <Label className="form-check-label ms-2 d-flex align-items-center">
//           <i className={`fas fa-${source === "camera" ? "camera" : "image"} me-1`} />
//           {source.charAt(0).toUpperCase() + source.slice(1)}
//         </Label>
//       </div>
//     ))}
//   </div>
// );

// const sectionStyle = {
//   display: "flex",
//   flexDirection: "column",
//   borderBottom: "1px solid #f0f0f0",
//   paddingBottom: 10,
//   marginTop: 10,
// };

// export default CheckpointConfigSection;












// import React from "react";
// import { Row, Col, Input, Label } from "reactstrap";
// import TagsInput from "react-tagsinput";
// import { setmediaErrors } from "toolkitStore/Auditvista/treeSlice";
// import {useDispatch } from 'react-redux';


// const CheckpointConfigSection = ({ idx, data, checkpointInfo, updateRuleField, submitProcess }) => {
//   const [mediaErrors, setMediaErrors] = React.useState({});

//   const dispatch = useDispatch();


//   // const rule = checkpointInfo.rule?.[idx] || {};
//     const rule = checkpointInfo.rule?.[idx] || {
//     image_info: { camera: false, gallery: false, max: 0, min: 0 },
//     video_info: { camera: false, gallery: false, max: 0, min: 0, duration: 30 },
//     capa_info: { enable_capa: false, mandatory: false },
//     document_info: [],
//     images: [],
//     videos: [],
//     documents: []
//   };
//   const imageInfo = rule.image_info || {};
//   const videoInfo = rule.video_info || {};
//   const capaInfo = rule.capa_info || {};
//   const documents = rule.document_info || [];




//   const hasAnyMediaError = (errors) => {
//     for (const idxKey in errors) {
//       const section = errors[idxKey];
//       for (const type in section) {
//         for (const field in section[type]) {
//           if (section[type][field]) return true;
//         }
//       }
//     }
//     return false;
//   };
  
  

//   const handleImageCheckboxChange = (field, val) => {
//     const updatedImageInfo = { ...imageInfo, [field]: !val };
//     updateRuleField(idx, "image_info", updatedImageInfo);
//   };

//   const handleImageChange = (field, val) => {
//     const updatedImageInfo = { ...imageInfo, [field]: Number(val) };
//     const errors = { ...mediaErrors };
//     if (!errors[idx]) errors[idx] = {};
//     if (!errors[idx].image) errors[idx].image = {};

//     const minVal = Number(updatedImageInfo.min);
//     const maxVal = Number(updatedImageInfo.max);
//     if (!isNaN(minVal) && !isNaN(maxVal)) {
//       if (minVal > maxVal) {
//         errors[idx].image.min = "Minimum cannot be greater than Maximum";
//         errors[idx].image.max = "";
//       } else {
//         errors[idx].image.min = "";
//         errors[idx].image.max = "";
//       }
//     }

//     setMediaErrors(errors);
//     dispatch(setmediaErrors(hasAnyMediaError(errors)));
//     updateRuleField(idx, "image_info", updatedImageInfo);
//   };

//   const handleVideoCheckboxChange = (field, val) => {
//     const updatedVideoInfo = { ...videoInfo, [field]: !val };
//     updateRuleField(idx, "video_info", updatedVideoInfo);
//   };

//   const handleVideoChange = (field, val) => {
//     const updatedVideoInfo = { ...videoInfo, [field]: Number(val) };
//     const errors = { ...mediaErrors };
//     if (!errors[idx]) errors[idx] = {};
//     if (!errors[idx].video) errors[idx].video = {};

//     const minVal = Number(updatedVideoInfo.min);
//     const maxVal = Number(updatedVideoInfo.max);
//     if (!isNaN(minVal) && !isNaN(maxVal)) {
//       if (minVal > maxVal) {
//         errors[idx].video.min = "Minimum cannot be greater than Maximum";
//         errors[idx].video.max = "";
//       } else {
//         errors[idx].video.min = "";
//         errors[idx].video.max = "";
//       }
//     }

//     setMediaErrors(errors);
//     dispatch(setmediaErrors(hasAnyMediaError(errors)));
//     updateRuleField(idx, "video_info", updatedVideoInfo);
//   };

//   const handleDocumentsChange = (docs) => {
//     updateRuleField(idx, "document_info", docs);
//   };

//   const handleCapaChange = (field, checked) => {
//     const updatedCapaInfo = { ...capaInfo, [field]: checked };
//     updateRuleField(idx, "capa_info", updatedCapaInfo);
//   };

//   if (!data.show_config) return null;

//   return (
//     <div>
//       {/* Image Section */}
//       <SectionWrapper title="Image">
//         <SourceCheckboxes info={imageInfo} onChange={handleImageCheckboxChange} />
//         <Row>
//           {["min", "max"].map((field) => (
//             <Col key={field}>
//               <Label className="mb-1">{field === "min" ? "Minimum" : "Maximum"}</Label>
//               <Input
//                 type="number"
//                 placeholder={`Enter ${field}`}
//                 value={imageInfo[field] || ""}
//                 onChange={(e) => handleImageChange(field, e.target.value)}
//                 disabled={!(imageInfo.camera || imageInfo.gallery)}
//               />
//               {mediaErrors[idx]?.image?.[field] && (
//                 <small className="text-danger mt-1">{mediaErrors[idx].image[field]}</small>
//               )}
//               {submitProcess && (imageInfo.camera || imageInfo.gallery) && !imageInfo[field] && (
//                 <small className="text-danger mt-1">
//                   {field === "min" ? "Minimum is required" : "Maximum is required"}
//                 </small>
//               )}
//             </Col>
//           ))}
//         </Row>
//       </SectionWrapper>

//       {/* Video Section */}
//       <SectionWrapper title="Video">
//         <SourceCheckboxes info={videoInfo} onChange={handleVideoCheckboxChange} />
//         <Row>
//           {["min", "max", "duration (Seconds)"].map((field) => (
//             <Col key={field}>
//               <Label className="mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
//               <Input
//                 type="number"
//                 placeholder={`Enter ${field === 'duration (Seconds)' ? 'Duration' : field}`}
//                 value={videoInfo[field] || ""}
//                 onChange={(e) => handleVideoChange(field === 'duration (Seconds)' ? 'duration' : field, e.target.value)}
//                 disabled={!(videoInfo.camera || videoInfo.gallery)}
//               />
//               {mediaErrors[idx]?.video?.[field] && (
//                 <small className="text-danger mt-1">{mediaErrors[idx].video[field]}</small>
//               )}
//               {submitProcess && (videoInfo.camera || videoInfo.gallery) && !videoInfo[field] && (
//                 <small className="text-danger mt-1">
//                   {`${field.charAt(0).toUpperCase() + field.slice(1)} is required`}
//                 </small>
//               )}
//             </Col>
//           ))}
//         </Row>
//       </SectionWrapper>

//       {/* Documents */}
//       <SectionWrapper title="Documents">
//         <TagsInput
//           value={documents}
//           onChange={handleDocumentsChange}
//           className="form-control react-tagsinput-false bg-white"
//           inputProps={{ placeholder: "Input document name and hit enter", style: { minWidth: '300px' }  }}
//         />
//       </SectionWrapper>



//       {/* CAPA */}
//    <div className="border border-light bg-light" style={{ padding: 15, borderRadius: 8 }}>
//         <Row className="align-items-center">       
//             <Col>
//             <Label className="mb-0 me-2">Is CAPA Mandatory</Label>
//               <Input
//                 type="checkbox"
//                 defaultChecked={capaInfo.mandatory || false}
//                 onChange={(e) => handleCapaChange("mandatory", e.target.checked)}
//               />
//             </Col>
//         </Row>
//       </div>
//     </div>
//   );
// };

// // Helper: Wrapper component for each section
// const SectionWrapper = ({ title, children }) => (
//   <div style={sectionStyle}>
//     <div className="col-12">
//       <div className="bg-light p-3 rounded">
//         <Label className="mb-2 fw-bold">{title}</Label>
//         {children}
//       </div>
//     </div>
//   </div>
// );

// // Helper: Checkbox group for camera/gallery
// const SourceCheckboxes = ({ info, onChange }) => (
//   <div className="mb-3 d-flex gap-4">
//     {["camera", "gallery"].map((source) => (
//       <div key={source} className="d-flex align-items-center">
//         <Input
//           type="checkbox"
//           className="form-check-input"
//           defaultChecked={info[source] || false}
//           onClick={() => onChange(source, info[source])}
//         />
//         <Label className="form-check-label ms-2 d-flex align-items-center">
//           <i className={`fas fa-${source === "camera" ? "camera" : "image"} me-1`} />
//           {source.charAt(0).toUpperCase() + source.slice(1)}
//         </Label>
//       </div>
//     ))}
//   </div>
// );

// const sectionStyle = {
//   display: "flex",
//   flexDirection: "column",
//   borderBottom: "1px solid #f0f0f0",
//   paddingBottom: 10,
//   marginTop: 10,
// };

// export default CheckpointConfigSection;











//jose-20-may-2025
// import React from "react";
// import { Row, Col, Input, Label } from "reactstrap";
// import TagsInput from "react-tagsinput";

// const CheckpointConfigSection = ({ idx, data, checkpointInfo, updateRuleField, submitProcess }) => {
//   const [mediaErrors, setMediaErrors] = React.useState({});

//   const rule = checkpointInfo.rule?.[idx] || {};
//   const imageInfo = rule.image_info || {};
//   const videoInfo = rule.video_info || {};
//   const capaInfo = rule.capa_info || {};
//   const documents = rule.documents_attached || [];

//   const handleImageCheckboxChange = (field, val) => {
//     const updatedImageInfo = { ...imageInfo, [field]: !val };
//     updateRuleField(idx, "image_info", updatedImageInfo);
//   };

//   const handleImageChange = (field, val) => {
//     const updatedImageInfo = { ...imageInfo, [field]: Number(val) };
//     const errors = { ...mediaErrors };
//     if (!errors[idx]) errors[idx] = {};
//     if (!errors[idx].image) errors[idx].image = {};

//     const minVal = Number(updatedImageInfo.min);
//     const maxVal = Number(updatedImageInfo.max);
//     if (!isNaN(minVal) && !isNaN(maxVal)) {
//       if (minVal > maxVal) {
//         errors[idx].image.min = "Minimum cannot be greater than Maximum";
//         errors[idx].image.max = "";
//       } else {
//         errors[idx].image.min = "";
//         errors[idx].image.max = "";
//       }
//     }

//     setMediaErrors(errors);
//     updateRuleField(idx, "image_info", updatedImageInfo);
//   };

//   const handleVideoCheckboxChange = (field, val) => {
//     const updatedVideoInfo = { ...videoInfo, [field]: !val };
//     updateRuleField(idx, "video_info", updatedVideoInfo);
//   };

//   const handleVideoChange = (field, val) => {
//     const updatedVideoInfo = { ...videoInfo, [field]: Number(val) };
//     const errors = { ...mediaErrors };
//     if (!errors[idx]) errors[idx] = {};
//     if (!errors[idx].video) errors[idx].video = {};

//     const minVal = Number(updatedVideoInfo.min);
//     const maxVal = Number(updatedVideoInfo.max);
//     if (!isNaN(minVal) && !isNaN(maxVal)) {
//       if (minVal > maxVal) {
//         errors[idx].video.min = "Minimum cannot be greater than Maximum";
//         errors[idx].video.max = "";
//       } else {
//         errors[idx].video.min = "";
//         errors[idx].video.max = "";
//       }
//     }

//     setMediaErrors(errors);
//     updateRuleField(idx, "video_info", updatedVideoInfo);
//   };

//   const handleDocumentsChange = (docs) => {
//     updateRuleField(idx, "documents_attached", docs);
//   };

//   const handleCapaChange = (field, checked) => {
//     const updatedCapaInfo = { ...capaInfo, [field]: checked };
//     updateRuleField(idx, "capa_info", updatedCapaInfo);
//   };

//   if (!data.show_config) return null;

//   return (
//     <div>
//       {/* Image Section */}
//       <SectionWrapper title="Image">
//         <SourceCheckboxes info={imageInfo} onChange={handleImageCheckboxChange} />
//         <Row>
//           {["min", "max"].map((field) => (
//             <Col key={field}>
//               <Label className="mb-1">{field === "min" ? "Minimum" : "Maximum"}</Label>
//               <Input
//                 type="number"
//                 placeholder={`Enter ${field}`}
//                 value={imageInfo[field] || ""}
//                 onChange={(e) => handleImageChange(field, e.target.value)}
//                 disabled={!(imageInfo.camera || imageInfo.gallery)}
//               />
//               {mediaErrors[idx]?.image?.[field] && (
//                 <small className="text-danger mt-1">{mediaErrors[idx].image[field]}</small>
//               )}
//               {submitProcess && (imageInfo.camera || imageInfo.gallery) && !imageInfo[field] && (
//                 <small className="text-danger mt-1">
//                   {field === "min" ? "Minimum is required" : "Maximum is required"}
//                 </small>
//               )}
//             </Col>
//           ))}
//         </Row>
//       </SectionWrapper>

//       {/* Video Section */}
//       <SectionWrapper title="Video">
//         <SourceCheckboxes info={videoInfo} onChange={handleVideoCheckboxChange} />
//         <Row>
//           {["min", "max", "duration"].map((field) => (
//             <Col key={field}>
//               <Label className="mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
//               <Input
//                 type="number"
//                 placeholder={`Enter ${field}`}
//                 value={videoInfo[field] || ""}
//                 onChange={(e) => handleVideoChange(field, e.target.value)}
//                 disabled={!(videoInfo.camera || videoInfo.gallery)}
//               />
//               {mediaErrors[idx]?.video?.[field] && (
//                 <small className="text-danger mt-1">{mediaErrors[idx].video[field]}</small>
//               )}
//               {submitProcess && (videoInfo.camera || videoInfo.gallery) && !videoInfo[field] && (
//                 <small className="text-danger mt-1">
//                   {`${field.charAt(0).toUpperCase() + field.slice(1)} is required`}
//                 </small>
//               )}
//             </Col>
//           ))}
//         </Row>
//       </SectionWrapper>

//       {/* Documents */}
//       <SectionWrapper title="Documents">
//         <TagsInput
//           value={documents}
//           onChange={handleDocumentsChange}
//           className="form-control react-tagsinput-false bg-white"
//           inputProps={{ placeholder: "Input document name and hit enter" }}
//         />
//       </SectionWrapper>

//       {/* CAPA */}
//       <div className="border border-light bg-light" style={{ padding: 15, borderRadius: 8 }}>
//         <Row className="align-items-center">
//           <Col xs="auto">
//             <Label className="mb-0">Enable CAPA</Label>
//           </Col>
//           <Col xs="auto">
//             <Input
//               type="checkbox"
//               defaultChecked={capaInfo.enable_capa || false}
//               onChange={(e) => handleCapaChange("enable_capa", e.target.checked)}
//             />
//           </Col>
//           {capaInfo.enable_capa && (
//             <>
//               <Col xs="auto">
//                 <Label className="mb-0">Mandatory</Label>
//               </Col>
//               <Col xs="auto">
//                 <Input
//                   type="checkbox"
//                   defaultChecked={capaInfo.mandatory || false}
//                   onChange={(e) => handleCapaChange("mandatory", e.target.checked)}
//                 />
//               </Col>
//             </>
//           )}
//         </Row>
//       </div>
//     </div>
//   );
// };

// // Helper: Wrapper component for each section
// const SectionWrapper = ({ title, children }) => (
//   <div style={sectionStyle}>
//     <div className="col-12">
//       <div className="bg-light p-3 rounded">
//         <Label className="mb-2 fw-bold">{title}</Label>
//         {children}
//       </div>
//     </div>
//   </div>
// );

// // Helper: Checkbox group for camera/gallery
// const SourceCheckboxes = ({ info, onChange }) => (
//   <div className="mb-3 d-flex gap-4">
//     {["camera", "gallery"].map((source) => (
//       <div key={source} className="d-flex align-items-center">
//         <Input
//           type="checkbox"
//           className="form-check-input"
//           defaultChecked={info[source] || false}
//           onClick={() => onChange(source, info[source])}
//         />
//         <Label className="form-check-label ms-2 d-flex align-items-center">
//           <i className={`fas fa-${source === "camera" ? "camera" : "image"} me-1`} />
//           {source.charAt(0).toUpperCase() + source.slice(1)}
//         </Label>
//       </div>
//     ))}
//   </div>
// );

// const sectionStyle = {
//   display: "flex",
//   flexDirection: "column",
//   borderBottom: "1px solid #f0f0f0",
//   paddingBottom: 10,
//   marginTop: 10,
// };

// export default CheckpointConfigSection;










///20-5-25-jose
// import React from "react";
// import { Row, Col, Input, Label } from "reactstrap";
// import TagsInput from "react-tagsinput";

// const CheckpointConfigSection = ({ idx, data, checkpointInfo, updateRuleField,  submitProcess }) => {
//   const [videoErrors, setVideoErrors] = React.useState({});
//   const [imageErrors, setImageErrors] = React.useState({});

//   const rule = checkpointInfo.rule?.[idx] || {};
//   const imageInfo = rule.image_info || {};
//   const videoInfo = rule.video_info || {};
//   const capaInfo = rule.capa_info || {};
//   const documents = rule.documents_attached || [];

//   const handleImageCheckboxChange = (field, val) => {
//     const updatedImageInfo = { ...imageInfo, [field]: !val };
//     updateRuleField(idx, "image_info", updatedImageInfo);
//   };

//   const handleImageChange = (field, val) => {
//     const updatedImageInfo = { ...imageInfo, [field]: Number(val) };
//     const errors = { ...imageErrors };
//     if (!errors[idx]) errors[idx] = {};
//     const minVal = Number(updatedImageInfo.min);
//     const maxVal = Number(updatedImageInfo.max);
//     if (!isNaN(minVal) && !isNaN(maxVal)) {
//       if (minVal > maxVal) {
//         errors[idx].min = "Minimum cannot be greater than Maximum";
//         errors[idx].max = "";
//       } else {
//         errors[idx].min = "";
//         errors[idx].max = "";
//       }
//     }

//     setImageErrors(errors);
//     updateRuleField(idx, "image_info", updatedImageInfo);
//   };

//   const handleVideoCheckboxChange = (field, val) => {
//     const updatedVideoInfo = { ...videoInfo, [field]: !val };
//     updateRuleField(idx, "video_info", updatedVideoInfo);
//   };

//   const handleVideoChange = (field, val) => {
//     const updatedVideoInfo = { ...videoInfo, [field]: Number(val) };
//     const errors = { ...videoErrors };
//     if (!errors[idx]) errors[idx] = {};
//     const minVal = Number(updatedVideoInfo.min);
//     const maxVal = Number(updatedVideoInfo.max);
//     if (!isNaN(minVal) && !isNaN(maxVal)) {
//       if (minVal > maxVal) {
//         errors[idx].min = "Minimum cannot be greater than Maximum";
//         errors[idx].max = "";
//       } else {
//         errors[idx].min = "";
//         errors[idx].max = "";
//       }
//     }
//     setVideoErrors(errors);
//     updateRuleField(idx, "video_info", updatedVideoInfo);
//   };

//   const handleDocumentsChange = (docs) => {
//     updateRuleField(idx, "documents_attached", docs);
//   };

//   const handleCapaChange = (field, checked) => {
//     const updatedCapaInfo = { ...capaInfo, [field]: checked };
//     updateRuleField(idx, "capa_info", updatedCapaInfo);
//   };

//   if (!data.show_config) return null;

//   return (
//     <div>
//       {/* Image Section */}
//       <SectionWrapper title="Image">
//         <SourceCheckboxes info={imageInfo} onChange={handleImageCheckboxChange} />
//         <Row>
//           {["min", "max"].map((field) => (
//             <Col key={field}>
//               <Label className="mb-1">{field === "min" ? "Minimum" : "Maximum"}</Label>
//               <Input type="number" placeholder={`Enter ${field}`} value={imageInfo[field] || ""} onChange={(e) => handleImageChange(field, e.target.value)} disabled={!(imageInfo.camera || imageInfo.gallery)} />
//             {imageErrors[idx]?.[field] && (
//                 <small className="text-danger mt-1">{imageErrors[idx][field]}</small>
//               )}
//               {submitProcess && (imageInfo.camera || imageInfo.gallery) && !imageInfo[field] && (
//                 <small className="text-danger mt-1"> {field === "min" ? "Minimum is required" : "Maximum is required"}</small>
//               )}
//             </Col>
//           ))}
//         </Row>
//       </SectionWrapper>

//       {/* Video Section */}
//       <SectionWrapper title="Video">
//         <SourceCheckboxes info={videoInfo} onChange={handleVideoCheckboxChange} />
//         <Row>
//           {["min", "max", "duration"].map((field) => (
//             <Col key={field}>
//               <Label className="mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
//               <Input type="number" placeholder={`Enter ${field}`} value={videoInfo[field] || ""} onChange={(e) => handleVideoChange(field, e.target.value)} disabled={!(videoInfo.camera || videoInfo.gallery)} />
//               {videoErrors[idx]?.[field] && (
//                 <small className="text-danger mt-1">{videoErrors[idx][field]}</small>
//               )}
//               {submitProcess && (videoInfo.camera || videoInfo.gallery) &&!videoInfo[field] && (
//                   <small className="text-danger mt-1" >{`${field.charAt(0).toUpperCase() + field.slice(1)} is required`}</small>
//                 )}
//             </Col>
//           ))}
//         </Row>
//       </SectionWrapper>

//       {/* Documents */}
//       <SectionWrapper title="Documents">
//         <TagsInput value={documents} onChange={handleDocumentsChange} className="form-control react-tagsinput-false bg-white" inputProps={{ placeholder: "Input document name and hit enter" }}/>
//       </SectionWrapper>

//       {/* CAPA */}
//       <div className="border border-light bg-light" style={{ padding: 15, borderRadius: 8 }} >
//         <Row className="align-items-center">
//           <Col xs="auto">
//             <Label className="mb-0">Enable CAPA</Label>
//           </Col>
//           <Col xs="auto">
//             <Input type="checkbox" defaultChecked={capaInfo.enable_capa || false} onChange={(e) => handleCapaChange("enable_capa", e.target.checked)} />
//           </Col>
//           {capaInfo.enable_capa && (
//             <>
//               <Col xs="auto">
//                 <Label className="mb-0">Mandatory</Label>
//               </Col>
//               <Col xs="auto">
//                 <Input type="checkbox" defaultChecked={capaInfo.mandatory || false} onChange={(e) => handleCapaChange("mandatory", e.target.checked)} />
//               </Col>
//             </>
//           )}
//         </Row>
//       </div>
//     </div>
//   );
// };

// // Helper: Wrapper component for each section
// const SectionWrapper = ({ title, children }) => (
//   <div style={sectionStyle}>
//     <div className="col-12">
//       <div className="bg-light p-3 rounded">
//         <Label className="mb-2 fw-bold">{title}</Label>
//         {children}
//       </div>
//     </div>
//   </div>
// );

// // Helper: Checkbox group for camera/gallery
// const SourceCheckboxes = ({ info, onChange }) => (
//   <div className="mb-3 d-flex gap-4">
//     {["camera", "gallery"].map((source) => (
//       <div key={source} className="d-flex align-items-center">
//         <Input type="checkbox" className="form-check-input" defaultChecked={info[source] || false} onClick={() => onChange(source, info[source])} />
//         <Label className="form-check-label ms-2 d-flex align-items-center">
//           <i className={`fas fa-${source === "camera" ? "camera" : "image"} me-1`} />
//           {source.charAt(0).toUpperCase() + source.slice(1)}
//         </Label>
//       </div>
//     ))}
//   </div>
// );

// const sectionStyle = {
//   display: "flex",
//   flexDirection: "column",
//   borderBottom: "1px solid #f0f0f0",
//   paddingBottom: 10,
//   marginTop: 10,
// };

// export default CheckpointConfigSection;

















// import React from "react";
// import { Row, Col, Input, Label } from "reactstrap";
// import TagsInput from "react-tagsinput";

// const CheckpointConfigSection = ({
//   idx,
//   data,
//   checkpointInfo,
//   updateRuleField,  // this comes from parent
// }) => {
  
//   const [videoErrors, setVideoErrors] = React.useState({});
//   const [imageErrors, setImageErrors] = React.useState({});

//   const rule = checkpointInfo.rule?.[idx] || {};
//   const imageInfo = rule.image_info || {};
//   const videoInfo = rule.video_info || {};
//   const capaInfo = rule.capa_info || {};
//   const documents = rule.documents_attached || [];

//   const handleImageCheckboxChange = (field, val) => {
//     const updatedImageInfo = { ...imageInfo, [field]: !val };
//     updateRuleField(idx, "image_info", updatedImageInfo);
//   };

//   const handleImageChange = (field, val) => {
//     const updatedImageInfo = { ...imageInfo, [field]: Number(val) };

//     const errors = { ...imageErrors };
//     if (!errors[idx]) errors[idx] = {};

//     const minVal = Number(updatedImageInfo.min);
//     const maxVal = Number(updatedImageInfo.max);

//     if (!isNaN(minVal) && !isNaN(maxVal)) {
//       if (minVal > maxVal) {
//         errors[idx].min = "Minimum cannot be greater than Maximum";
//         errors[idx].max = "";
//       } else {
//         errors[idx].min = "";
//         errors[idx].max = "";
//       }
//     }

//     setImageErrors(errors);
//     updateRuleField(idx, "image_info", updatedImageInfo);
//   };

//   const handleVideoCheckboxChange = (field, val) => {
//     const updatedVideoInfo = { ...videoInfo, [field]: !val };
//     updateRuleField(idx, "video_info", updatedVideoInfo);
//   };

//   const handleVideoChange = (field, val) => {
//     const updatedVideoInfo = { ...videoInfo, [field]: Number(val) };

//     const errors = { ...videoErrors };
//     if (!errors[idx]) errors[idx] = {};

//     const minVal = Number(updatedVideoInfo.min);
//     const maxVal = Number(updatedVideoInfo.max);

//     if (!isNaN(minVal) && !isNaN(maxVal)) {
//       if (minVal > maxVal) {
//         errors[idx].min = "Minimum cannot be greater than Maximum";
//         errors[idx].max = "";
//       } else {
//         errors[idx].min = "";
//         errors[idx].max = "";
//       }
//     }

//     setVideoErrors(errors);
//     updateRuleField(idx, "video_info", updatedVideoInfo);
//   };

//   const handleDocumentsChange = (docs) => {
//     updateRuleField(idx, "documents_attached", docs);
//   };

//   const handleCapaChange = (field, checked) => {
//     const updatedCapaInfo = { ...capaInfo, [field]: checked };
//     updateRuleField(idx, "capa_info", updatedCapaInfo);
//   };

//   if (!data.show_config) return null;

//   return (
//     <div>
//       {/* Image Section */}
//       <SectionWrapper title="Image">
//         <SourceCheckboxes
//           info={imageInfo}
//           onChange={handleImageCheckboxChange}
//         />
//         <Row>
//           {["min", "max"].map((field) => (
//             <Col key={field}>
//               <Label className="mb-1">{field === "min" ? "Minimum" : "Maximum"}</Label>
//               <Input
//                 type="number"
//                 placeholder={`Enter ${field}`}
//                 value={imageInfo[field] || ""}
//                 onChange={(e) => handleImageChange(field, e.target.value)}
//                 disabled={!(imageInfo.camera || imageInfo.gallery)}
//               />
//               {imageErrors[idx]?.[field] && (
//                 <div className="text-danger mt-1">{imageErrors[idx][field]}</div>
//               )}
//             </Col>
//           ))}
//         </Row>
//       </SectionWrapper>

//       {/* Video Section */}
//       <SectionWrapper title="Video">
//         <SourceCheckboxes
//           info={videoInfo}
//           onChange={handleVideoCheckboxChange}
//         />
//         <Row>
//           {["min", "max", "duration"].map((field) => (
//             <Col key={field}>
//               <Label className="mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
//               <Input
//                 type="number"
//                 placeholder={`Enter ${field}`}
//                 value={videoInfo[field] || ""}
//                 onChange={(e) => handleVideoChange(field, e.target.value)}
//                 disabled={!(videoInfo.camera || videoInfo.gallery)}
//               />
//               {videoErrors[idx]?.[field] && (
//                 <div className="text-danger mt-1" style={{ fontSize: "0.85rem" }}>
//                   {videoErrors[idx][field]}
//                 </div>
//               )}
//             </Col>
//           ))}
//         </Row>
//       </SectionWrapper>

//       {/* Documents */}
//       <SectionWrapper title="Documents">
//         <TagsInput
//           value={documents}
//           onChange={handleDocumentsChange}
//           className="form-control react-tagsinput-false bg-white"
//           inputProps={{ placeholder: "Input document name and hit enter" }}
//         />
//       </SectionWrapper>

//       {/* CAPA */}
//       <div className="bg-light p-2">
//         <Row className="align-items-center">
//           <Col xs="auto">
//             <Label className="mb-0">Enable CAPA</Label>
//           </Col>
//           <Col xs="auto">
//             <Input
//               type="checkbox"
//               defaultChecked={capaInfo.enable_capa || false}
//               onChange={(e) => handleCapaChange("enable_capa", e.target.checked)}
//             />
//           </Col>
//           {capaInfo.enable_capa && (
//             <>
//               <Col xs="auto">
//                 <Label className="mb-0">Mandatory</Label>
//               </Col>
//               <Col xs="auto">
//                 <Input
//                   type="checkbox"
//                   defaultChecked={capaInfo.mandatory || false}
//                   onChange={(e) => handleCapaChange("mandatory", e.target.checked)}
//                 />
//               </Col>
//             </>
//           )}
//         </Row>
//       </div>
//     </div>
//   );
// };

// // Helper: Wrapper component for each section
// const SectionWrapper = ({ title, children }) => (
//   <div style={sectionStyle}>
//     <div className="col-12">
//       <div className="bg-light p-3 rounded">
//         <Label className="mb-2 fw-bold">{title}</Label>
//         {children}
//       </div>
//     </div>
//   </div>
// );

// // Helper: Checkbox group for camera/gallery
// const SourceCheckboxes = ({ info, onChange }) => (
//   <div className="mb-3 d-flex gap-4">
//     {["camera", "gallery"].map((source) => (
//       <div key={source} className="d-flex align-items-center">
//         <Input
//           type="checkbox"
//           className="form-check-input"
//           defaultChecked={info[source] || false}
//           onClick={() => onChange(source, info[source])}
//         />
//         <Label className="form-check-label ms-2 d-flex align-items-center">
//           <i className={`fas fa-${source === "camera" ? "camera" : "image"} me-1`} />
//           {source.charAt(0).toUpperCase() + source.slice(1)}
//         </Label>
//       </div>
//     ))}
//   </div>
// );

// const sectionStyle = {
//   display: "flex",
//   flexDirection: "column",
//   borderBottom: "1px solid #f0f0f0",
//   paddingBottom: 10,
//   marginTop: 10,
// };

// export default CheckpointConfigSection;











// import React from "react";
// import { Row, Col, Input, Label } from "reactstrap";
// import TagsInput from "react-tagsinput"; // Ensure you have this library installed

// const CheckpointConfigSection = ({
//   idx,
//   data,
//   checkpointInfo,
//   imageErrors,
//   videoErrors,
//   handleImageCheckboxChange,
//   handleImageChange,
//   handleVideoCheckboxChange,
//   handleVideoChange,
//   handleDocumentsChange,
//   handleCapaChange,
// }) => {
//   if (!data.show_config) return null;

//   const imageInfo = checkpointInfo.rule?.[idx]?.image_info || {};
//   const videoInfo = checkpointInfo.rule?.[idx]?.video_info || {};
//   const capaInfo = checkpointInfo.rule?.[idx]?.capa_info || {};
//   const documents = checkpointInfo.rule?.[idx]?.documents_attached || [];

//   return (
//     <div>
//       {/* Image Section */}
//       <div style={sectionStyle}>
//         <div className="col-12">
//           <div className="bg-light p-3 rounded d-flex flex-column">
//             <Label className="mb-2 fw-bold">Image</Label>
//             <div className="mb-3 d-flex gap-4">
//               {["camera", "gallery"].map((source) => (
//                 <div key={source} className="d-flex align-items-center">
//                   <Input
//                     type="checkbox"
//                     className="form-check-input"
//                     checked={imageInfo[source] || false}
//                     onClick={(e) =>
//                       handleImageCheckboxChange(idx, source, e.target.checked)
//                     }
//                   />
//                   <Label className="form-check-label ms-2 d-flex align-items-center">
//                     <i className={`fas fa-${source === "camera" ? "camera" : "image"} me-1`} />
//                     {source.charAt(0).toUpperCase() + source.slice(1)}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//             <Row>
//               {["min", "max"].map((field) => (
//                 <Col key={field}>
//                   <Label className="mb-1">{field === "min" ? "Minimum" : "Maximum"}</Label>
//                   <Input
//                     type="number"
//                     placeholder={`Enter ${field}`}
//                     value={imageInfo[field] || ""}
//                     onChange={(e) => handleImageChange(idx, field, e.target.value)}
//                     disabled={!(imageInfo.camera || imageInfo.gallery)}
//                   />
//                   {imageErrors[idx]?.[field] && (
//                     <div className="text-danger mt-1">{imageErrors[idx][field]}</div>
//                   )}
//                 </Col>
//               ))}
//             </Row>
//           </div>
//         </div>
//       </div>

//       {/* Video Section */}
//       <div style={sectionStyle}>
//         <div className="col-12">
//           <div className="bg-light p-3 rounded">
//             <Label className="mb-3 fw-bold">Video</Label>
//             <div className="mb-3 d-flex gap-4">
//               {["camera", "gallery"].map((source) => (
//                 <div key={source} className="d-flex align-items-center">
//                   <Input
//                     type="checkbox"
//                     className="form-check-input"
//                     checked={videoInfo[source] || false}
//                     onClick={(e) =>
//                       handleVideoCheckboxChange(idx, source, e.target.checked)
//                     }
//                   />
//                   <Label className="form-check-label ms-2 d-flex align-items-center">
//                     <i className={`fas fa-${source === "camera" ? "camera" : "image"} me-1`} />
//                     {source.charAt(0).toUpperCase() + source.slice(1)}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//             <Row>
//               {["min", "max", "duration"].map((field) => (
//                 <Col key={field}>
//                   <Label className="mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
//                   <Input
//                     type="number"
//                     placeholder={`Enter ${field}`}
//                     value={videoInfo[field] || ""}
//                     onChange={(e) => handleVideoChange(idx, field, e.target.value)}
//                     disabled={!(videoInfo.camera || videoInfo.gallery)}
//                   />
//                   {videoErrors[idx]?.[field] && (
//                     <div className="text-danger mt-1" style={{ fontSize: "0.85rem" }}>
//                       {videoErrors[idx][field]}
//                     </div>
//                   )}
//                 </Col>
//               ))}
//             </Row>
//           </div>
//         </div>
//       </div>

//       {/* Documents Section */}
//       <div style={sectionStyle}>
//         <div className="col-12">
//           <div className="form-check form-switch form-switch-sm bg-light p-2">
//             <Label>Documents</Label>
//             <div style={{ display: "flex", width: "100%" }}>
//               <div style={{ flex: 1, marginLeft: 7 }}>
//                 <TagsInput
//                   value={documents}
//                   onChange={(tags) => handleDocumentsChange(idx, tags)}
//                   className="form-control react-tagsinput-false bg-white"
//                   inputProps={{
//                     style: { width: "100%" },
//                     placeholder: "Input document name and hit enter",
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CAPA Section */}
//       <div className="bg-light p-2">
//         <Row className="align-items-center">
//           <Col xs="auto">
//             <Label className="mb-0">Enable CAPA</Label>
//           </Col>
//           <Col xs="auto">
//             <Input
//               type="checkbox"
//               defaultChecked={capaInfo.enable_capa || false}
//               onChange={(e) => handleCapaChange(idx, "enable_capa", e.target.checked)}
//             />
//           </Col>
//           {capaInfo.enable_capa && (
//             <>
//               <Col xs="auto">
//                 <Label className="mb-0">Mandatory</Label>
//               </Col>
//               <Col xs="auto">
//                 <Input
//                   type="checkbox"
//                   defaultChecked={capaInfo.mandatory || false}
//                   onChange={(e) => handleCapaChange(idx, "mandatory", e.target.checked)}
//                 />
//               </Col>
//             </>
//           )}
//         </Row>
//       </div>
//     </div>
//   );
// };

// const sectionStyle = {
//   display: "flex",
//   flexDirection: "column",
//   borderBottom: "1px solid #f0f0f0",
//   paddingBottom: 10,
//   marginTop: 10,
// };

// export default CheckpointConfigSection;
