import React, { useState, useEffect, useCallback } from "react";
import { Row, Container,Col } from "reactstrap";
import _ from "lodash";

const OptionComponent = (props) => {
 const { options, checkpoint, selectionoption, index } = props
    const [selectedOption, setSelectedOption] = useState(null);
    const [optionIdx, setoptionIdx] = useState(null);

    useEffect(() => {
        console.log("option component mounted");
            if(!checkpoint.enable_validation && checkpoint.checkpoint_type_id === "6"){
                    onSelected(checkpoint.rule[0])
            }
            // else if(checkpoint.enable_validation && checkpoint.checkpoint_type_id === "6"){
            //     var findIndex = _.findIndex(checkpoint)
            //     setoptionIdx()
            // }
    }, []);

    const onSelected = (data) => {
        console.log(data,'data')
        _.each(options, item => {
            item["is_selected"] = false
        })

        data["is_selected"] = true

        checkpoint.rule = options;
        checkpoint.cp_noof_images = (data.image_info?.camera || data.image_info?.gallery) ? data.image_info.min : 0;
        checkpoint.cp_ai_is_mandatory = (data.image_info?.camera || data.image_info?.gallery) ? true  : false;
        checkpoint.cp_noof_videos = (data.video_info?.camera || data.video_info?.gallery) ? data.video_info.min  : 0;
        // checkpoint.cp_apln_is_mandatory =props.epsInfo.audit_pbd_users.create_acplan ? data.capa_info?.mandatory : false;
        checkpoint.cp_apln_is_mandatory = data.capa_info?.mandatory;
        checkpoint.cp_noof_documents = data.document_info?.length > 0 ? data.document_info.length : 0;
        checkpoint.cp_compliance = data.compliance;
        checkpoint.cp_otpion_score = data.score;
        // checkpoint.cp_attach_videos = [];
        // checkpoint.cp_attach_images = [];
        // checkpoint.cp_documents = [];
        checkpoint.updated_on = new Date();
        
        if(data.images !== undefined){
            checkpoint.cp_attach_images = data.images;
        }
        else{
            checkpoint.cp_attach_images = [];
            data.images = [];
        }
        if(data.videos !== undefined){
            checkpoint.cp_attach_videos = data.videos
        }
        else{
            checkpoint.cp_attach_videos = [];
            data.videos = [];
        }
        if(data.documents !== undefined){
            checkpoint.cp_documents = data.documents;
        }
        else{
            checkpoint.cp_documents = [];
            data.documents = [];
        }


        setSelectedOption(data);
        console.log(data,options,'options')
        selectionoption(data, options);

    };

// const findMatchingRuleWithIndex=(value, rules)=> {
//   for (let i = 0; i < rules.length; i++) {
//     const rule = rules[i];
//     const { operator_info } = rule;
//     const { operator, from, to } = operator_info || {};

//     if (!operator || !operator.modulus) continue;

//     switch (operator.modulus.toLowerCase()) {
//       case 'between':
//         if (value >= from && value <= to) return { index: i, rule };

//       case '<':
//         if (value < from) return { index: i, rule };

//       case '>':
//         if (value > from) return { index: i, rule };

//       case '<=':
//         if (value <= from) return { index: i, rule };

//       case '>=':
//         if (value >= from) return { index: i, rule };

//       case '=':
//       case '==':
//         if (value === from) return { index: i, rule };

//       // Add more custom logic if needed
//     }
//   }

//   return null; // no matching rule
// }

// function findMatchingRule(value, rules) {
//   return rules.find(rule => {
//     const { operator_info } = rule;
//     const { operator, from, to } = operator_info || {};

//     if (!operator || !operator.modulus) return false;

//     switch (operator.modulus.toLowerCase()) {
//       case 'between':
//         return value >= from && value <= to;

//       case '<':
//         return value < from;

//       case '>':
//         return value > from;

//       case '<=':
//         return value <= from;

//       case '>=':
//         return value >= from;

//       case '=':
//       case '==':
//         return value === from;

//       default:
//         return false;
//     }
//   });
// }


 function findMatchingRule(value, rules) {
  const index = rules.findIndex(rule => {
    const { operator_info } = rule;
    const { operator, from, to } = operator_info || {};

    if (!operator || !operator.modulus) return false;

    switch (operator.modulus.toLowerCase()) {
      case 'between':
        return value >= from && value <= to;

      case '<':
        return value < from;

      case '>':
        return value > from;

      case '<=':
        return value <= from;

      case '>=':
        return value >= from;

      case '=':
      case '==':
        return value === from;

      default:
        return false;
    }
  });

  if (index !== -1) {
    return { index, rule: rules[index] };
  }

  return null;
}

    const handleValueChange = (value) => {
        console.log(value, 'vakuuuee', checkpoint)
        if (!checkpoint.enable_validation) {
            checkpoint.rule[0]["option_text"] = value
            var data = checkpoint.rule[0]
              checkpoint.rule = options;
                checkpoint.cp_noof_images = (data.image_info?.camera || data.image_info?.gallery) ? data.image_info.min : 0;
                checkpoint.cp_ai_is_mandatory = (data.image_info?.camera || data.image_info?.gallery) ? true : false;
                checkpoint.cp_noof_videos = (data.video_info?.camera || data.video_info?.gallery) ? data.video_info.min : 0;
                checkpoint.cp_apln_is_mandatory = data.capa_info?.mandatory;
                checkpoint.cp_noof_documents = data.document_info?.length > 0 ? data.document_info.length : 0;
                checkpoint.cp_compliance = data.compliance;
                checkpoint.cp_otpion_score = data.score;
                checkpoint.updated_on = new Date();
                setSelectedOption(data);
                console.log(data, options, 'options')
                // selectionoption(data, options);

            selectionoption(checkpoint.rule[0], checkpoint.rule);
        }
        else{
            var matchedRule = findMatchingRule(Number(value),checkpoint.rule)
            console.log(matchedRule,'matchedRule')
            if(matchedRule){
                options.map((ele,idx)=>{
                    if(matchedRule.index === idx){
                        ele["is_selected"]= true
                    }
                    else{
                        ele["is_selected"]= false
                    }
                })
                var data = checkpoint.rule[matchedRule.index]
                data["option_text"]=value
                checkpoint.rule = options;
                checkpoint.cp_noof_images = (data.image_info?.camera || data.image_info?.gallery) ? data.image_info.min : 0;
                checkpoint.cp_ai_is_mandatory = (data.image_info?.camera || data.image_info?.gallery) ? true : false;
                checkpoint.cp_noof_videos = (data.video_info?.camera || data.video_info?.gallery) ? data.video_info.min : 0;
                checkpoint.cp_apln_is_mandatory = data.capa_info?.mandatory;
                checkpoint.cp_noof_documents = data.document_info?.length > 0 ? data.document_info.length : 0;
                checkpoint.cp_compliance = data.compliance;
                checkpoint.cp_otpion_score = data.score;
                checkpoint.updated_on = new Date();
                setSelectedOption(data);
                console.log(data, options, 'options')
                selectionoption(data, options);

                // checkpoint.rule[matchedRule.index]['is_selected']= true
            }


        }

    }

    var getOptionIndex = _.findIndex(checkpoint.rule,{
        is_selected : true
    })

    return (
        <Container fluid>
            <Row>
                <div className="button-items mb-1">
                    <div className="btn-group-horizontal mt-2 mt-xl-0" role="group" aria-label="Basic radio toggle button group">
                        {checkpoint.checkpoint_type_id !== "6" ? (
                            <>
                                {options.map((item, idx) => {
                                    const tooltipId = `tooltip-${index}-${idx}`;
                                    const showTooltip = item.option_text?.length > 15;

                                    return (
                                        <React.Fragment key={`optns-${idx}`}>
                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name={`${index}btnradio${idx}`}
                                                id={`${index}btnradio${idx}`}
                                                autoComplete="off"
                                                checked={item.is_selected}
                                                onClick={() => onSelected(item)}
                                                disabled={
                                                    checkpoint.cp_status !== "4" &&
                                                        checkpoint.cp_status !== "5"
                                                        ? false
                                                        : true
                                                }
                                            />
                                            <label
                                                className="btn btn-outline-primary me-1 font-size-11"
                                                 style={{
                                                    // color:!item?.is_selected ? '#556EE6' : item?.color
                                                    backgroundColor : item?.is_selected ? item?.color : "white" , borderColor : item?.is_selected ? item?.color :"#556EE6"}}
                                                htmlFor={`${index}btnradio${idx}`}
                                                id={showTooltip ? tooltipId : undefined}
                                            >
                                                <span>
                                                    {item.option_text}
                                                    {(item.image_info?.camera || item.image_info?.gallery) && (
                                                        <i className="mdi mdi-camera-plus" />
                                                    )}{" "}
                                                    {(item.video_info?.camera ||item.video_info?.gallery ) && <i className="mdi mdi-video-plus" />}{" "}
                                                    {item.document_info?.length >0 && <i className="mdi mdi-file-document" />}
                                                </span>
                                            </label>
                                        </React.Fragment>
                                    );
                                })}
                            </>
                        ) : (
                            // <Row>
                            //     <Col>
                            //     <input type="number" className="form-control" onChange={(e)=>handleValueChange(e.target.value)} defaultValue= {!checkpoint.enable_validation ? checkpoint.rule[0]?.option_text :getOptionIndex !== -1 ? checkpoint.rule[getOptionIndex]?.option_text : "" }  />
                            // </Col>
                            // <Col>
                            // </Col>
                            // </Row>
                            <Row>
                                    <Col>
                                        <div className="d-flex gap-2 align-items-center">
                                            <div>
                                                <input type="number" className="form-control" onChange={(e) => handleValueChange(e.target.value)} defaultValue={!checkpoint.enable_validation ? checkpoint.rule[0]?.option_text : getOptionIndex !== -1 ? checkpoint.rule[getOptionIndex]?.option_text : ""} />
                                            </div>
                                            <div>
                                                <label className="fw-bold font-size-15">{checkpoint?.unit_name}</label>
                                            </div>
                                        </div>
                                    </Col>
                            </Row>
                        )}



                    </div>
                </div>
            </Row>
        </Container>
    );
};

export default OptionComponent;
