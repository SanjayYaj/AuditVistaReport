import React, { useState, useEffect } from 'react';
import { Row, Col, Label } from 'reactstrap';
import OperatorInput from './OperatorInput'
import { Popconfirm } from 'antd';
import { HexColorPicker } from 'react-colorful';
import CheckpointConfigSection from './CheckpointConfigSection';




const OperatorComponent = (props) => {
    const { checkpointinfo, config_data, submitProcess, updateState, enable_validation } = props

    const [checkpointInfo, setcheckpointInfo] = useState(checkpointinfo)
    const [compliance, setComplaince] = useState([])
    const [operatorValues, setOperatorValues] = useState({});
    const [operatorList, setOperatorList] = useState([])
    const [visiblePickers, setVisiblePickers] = useState({});

    const Colors = [
        '#007bff', // Blue
        '#6610f2', // Indigo
        '#6f42c1', // Purple
        '#e83e8c', // Pink
        '#f14f45', // Red-Orange
        '#dc3545', // Red
        '#fd7e14', // Orange
        '#f18845', // Light Orange
        '#f1b345', // Yellow-Orange
        '#ffc107', // Amber
        '#28a745', // Green
        '#20c997', // Teal
        '#17a2b8', // Cyan
        '#6c757d', // Gray
        '#343a40', // Dark Gray
        '#adb5bd', // Light Gray
        '#000000', // Black
        '#b0e0e6', // Powder Blue
        '#ff69b4', // Hot Pink
        '#c0c0c0', // Silver
        '#ffdab9', // Peach Puff
        '#90ee90', // Light Green
    ];



    useEffect(() => {
        setOperatorList(config_data.operators_list)
        setComplaince(config_data.compliance)
        setcheckpointInfo(checkpointinfo)
    }, [checkpointinfo])


    const togglePickerVisibility = (idx) => {
        setVisiblePickers((prev) => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    const onChangeConfigReq = (e, data, idx) => {
        const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);
        updatedCheckpointInfo.rule[idx]["show_config"] = !e.target.checked
        setcheckpointInfo(updatedCheckpointInfo);
        updateState(updatedCheckpointInfo)
    }

    const handleOperatorChange = (e, idx) => {
        const { value } = e.target;
        const operator = operatorList.find(op => op.id === value);
        const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);
        if (!Array.isArray(updatedCheckpointInfo.rule)) {
            updatedCheckpointInfo.rule = [];
        }

        while (updatedCheckpointInfo.rule.length <= idx) {
            updatedCheckpointInfo.rule.push({});
        }
        updatedCheckpointInfo.rule[idx] = { ...updatedCheckpointInfo.rule[idx], operator_info: { operator } };
        updateState(updatedCheckpointInfo)
        setcheckpointInfo(updatedCheckpointInfo);
    };

    const requiresTwoValues = (operatorObj) => {
        if (!operatorObj) return false;
        return operatorObj.modulus === 'between' || operatorObj.modulus?.includes('or');
    };

    const handleAddRule = () => {
        const defaultRule = { show_config: true };
        const newRuleEntry = _.cloneDeep(defaultRule);
        const updtCheckpointInfo = _.cloneDeep(checkpointInfo);
        if (!Array.isArray(updtCheckpointInfo.rule)) {
            updtCheckpointInfo.rule = [];
        }
        updtCheckpointInfo.rule.push(newRuleEntry);
        setcheckpointInfo(updtCheckpointInfo);
        updateState(updtCheckpointInfo)
    };

    const handleDeleteRule = (indexToDelete) => {
        const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);
        if (Array.isArray(updatedCheckpointInfo.rule)) {
            updatedCheckpointInfo.rule = updatedCheckpointInfo.rule.filter((_, index) => index !== indexToDelete);
        }
        setcheckpointInfo(updatedCheckpointInfo);
        updateState(updatedCheckpointInfo)
    };

    const handleComplianceChange = (e, idx, data) => {
        const { value } = e.target;
        const operator = compliance.find(op => op.id === value);
        const colorMap = { success: '#28a745', danger: '#dc3545', warning: '#ffc107', secondary: '#d3d3d3' };
        const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);
        if (!Array.isArray(updatedCheckpointInfo.rule)) {
            updatedCheckpointInfo.rule = [];
        }

        while (updatedCheckpointInfo.rule.length <= idx) {
            updatedCheckpointInfo.rule.push({});
        }
        updatedCheckpointInfo.rule[idx] = { ...updatedCheckpointInfo.rule[idx], compliance: operator, color: colorMap[operator?.color] || '', };
        updateState(updatedCheckpointInfo)
        setcheckpointInfo(updatedCheckpointInfo);
    };

    const updateRuleField = (idx, key, value) => {
        const updated = _.cloneDeep(checkpointInfo);
        if (!Array.isArray(updated.rule)) updated.rule = [];

        while (updated.rule.length <= idx) {
            updated.rule.push({});
        }

        updated.rule[idx][key] = value;
        updateState(updated)
        setcheckpointInfo(updated);
    };

    // const handleOperatorValueChange = (e, idx, field) => {
    //     const { value } = e.target;

    //     const updatedValues = { ...operatorValues };
    //     updatedValues[idx] = {
    //         ...updatedValues[idx],
    //         [field]: Number(value)
    //     };

    //     setOperatorValues(updatedValues);

    //     const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);

    //     if (Array.isArray(updatedCheckpointInfo.rule)) {
    //         const ruleItem = updatedCheckpointInfo.rule[idx] || {};
    //         ruleItem.operator_info = { ...ruleItem.operator_info, [field]: Number(value) };
    //         updatedCheckpointInfo.rule[idx] = ruleItem;
    //     }

    //     updateState(updatedCheckpointInfo);
    //     setcheckpointInfo(updatedCheckpointInfo);
    // };



const handleOperatorValueChange = (e, idx, field) => {
    let { value } = e.target;

    // Block "-" and "," characters
    if (value.includes('-') || value.includes(',')) return;

    // Validate number format
    const validNumberRegex = /^\d*\.?\d*$/;
    if (!validNumberRegex.test(value)) return;

    const parsed = parseFloat(value);
    if (isNaN(parsed)) return;

    const updatedValues = { ...operatorValues };
    updatedValues[idx] = {
        ...updatedValues[idx],
        [field]: parsed
    };

    setOperatorValues(updatedValues);

    const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);
    if (Array.isArray(updatedCheckpointInfo.rule)) {
        const ruleItem = updatedCheckpointInfo.rule[idx] || {};
        ruleItem.operator_info = {
            ...ruleItem.operator_info,
            [field]: parsed
        };
        updatedCheckpointInfo.rule[idx] = ruleItem;
    }

    updateState(updatedCheckpointInfo);
    setcheckpointInfo(updatedCheckpointInfo);
};

    
    const onScoreChange = (e, idx, field) => {
        const { value } = e.target;
        const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);
        if (updatedCheckpointInfo.rule && updatedCheckpointInfo.rule[idx]) {
            updatedCheckpointInfo.rule[idx][field] = Number(value);
        }
        updateState(updatedCheckpointInfo)
        setcheckpointInfo(updatedCheckpointInfo);
    };

    const handleColorChange = (idx, field, val) => {
        updateRuleField(idx, field, val);
    };

    return (
        <div>
            {
                checkpointInfo?.enable_validation &&
                <Row className="my-2">
                    {checkpointInfo.rule?.map((data, idx) => {
                        return (
                            <Col key={idx} md={12}>
                                <div style={{ display: 'flex', flexDirection: 'column', padding: 15, borderRadius: 8, borderColor: checkpointInfo.rule[idx]?.color || Colors[0], borderWidth: '2px', borderStyle: 'solid', borderRadius: '4px', padding: '1rem', marginBottom: '1%' }} >
                                    <div className='d-flex align-items-center justify-content-end'>
                                        <Popconfirm title="Are you sure you want to delete this rule?" onConfirm={() => handleDeleteRule(idx)} okText="Yes" cancelText="No" >
                                            <i className='bx bx-trash' style={{ color: 'red', fontSize: 16, cursor: 'pointer' }} />
                                        </Popconfirm>
                                    </div>

                                    <Row className="align-items-center">
                                        <>
                                            <OperatorInput
                                                index={idx}
                                                operator_info={data.operator_info}
                                                operatorList={operatorList}
                                                compliance={compliance}
                                                requiresTwoValues={requiresTwoValues}
                                                onOperatorChange={handleOperatorChange}
                                                onValueChange={handleOperatorValueChange}
                                                onComplianceChange={handleComplianceChange}
                                                checkpointInfo={checkpointInfo}
                                                onScoreChange={onScoreChange}
                                                config_data={config_data}
                                                submitProcess={submitProcess}
                                            />
                                        </>
                                    </Row>


                                    <div className="bg-light p-2 my-2 rounded">
                                        <Label>Pick a Color</Label>

                                        <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '10px' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                                {Colors.map((colorItem, index) => (
                                                    <div key={index} onClick={() => handleColorChange(idx, 'color', colorItem)}
                                                        style={{ backgroundColor: colorItem, width: '20px', height: '20px', margin: '5px', borderRadius: '5px', cursor: 'pointer', border: checkpointInfo.rule?.[idx]?.color === colorItem ? '2px solid black' : 'none', }} />
                                                ))}


                                                <div onClick={() => togglePickerVisibility(idx)} style={{ width: '20px', height: '20px', margin: '5px', borderRadius: '5px', border: '1px dashed gray', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', color: '#555', }}>
                                                    {visiblePickers[idx] ? '×' : '+'}
                                                </div>

                                            </div>

                                            {visiblePickers[idx] && (
                                                <div style={{ marginTop: '20px', width: '100%' }}>
                                                    <HexColorPicker color={checkpointInfo.rule?.[idx]?.color || Colors[0]} onChange={(hex) => handleColorChange(idx, 'color', hex)} style={{ width: '100%' }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>


                                    <div className='border border-bottom-secondary'></div>
                                    <div style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid #f0f0f0', paddingBottom: 5, marginTop: 5 }} >
                                        <div className="form-check form-switch form-switch-sm " style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <input type="checkbox" className="form-check-input me-2 " id={"config" + idx} onClick={(e) => { onChangeConfigReq(e, data, idx) }} checked={data.show_config} />
                                            <label className={data.show_config ? "form-check-label text-primary font-size-12" : "form-check-label text-Dark font-size-12"} htmlFor={"config" + idx} >
                                                Show Configuration
                                            </label>
                                        </div>
                                    </div>

                                    {data.show_config && enable_validation ?
                                        <div>
                                            <CheckpointConfigSection idx={idx} data={data} checkpointInfo={checkpointInfo} updateRuleField={updateRuleField} submitProcess={submitProcess} />
                                        </div> : null}
                                </div>
                            </Col>
                        )
                    })}
                </Row>
            }

            {
                checkpointInfo?.enable_validation &&
                <Row>
                    <Col>
                        <button className='btn btn-sm btn-primary w-sm' onClick={handleAddRule}>Add Rule</button>
                        <div>
                            {(submitProcess && checkpointInfo.rule.length === 0) ? <small className='text-danger'>Please add at least one rule.</small> : null}
                        </div>
                    </Col>
                </Row>
            }

        </div>
    );
};

export default OperatorComponent;





























//before simplify code 15-5-25
// import React, { useState, useEffect } from 'react';
// import { Row, Col, Input, Label, FormGroup } from 'reactstrap';
// import TagsInput from 'react-tagsinput'
// import OperatorInput from './OperatorInput'
// import { Popconfirm } from 'antd';
// import { HexColorPicker } from 'react-colorful';
// import CheckpointConfigSection from './CheckpointConfigSection';




// const OperatorComponent = (props) => {
//     const { checkpointinfo, edit, config_data, submitprocess, updateState, onChangeEnableValidation, enable_validation } = props

//     const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
//     const [checkpointInfo, setcheckpointInfo] = useState(null)
//     const [minusPressed, setminusPressed] = useState(false)
//     const [compliance, setComplaince] = useState([])
//     const [operatorValues, setOperatorValues] = useState({});
//     const [operatorList, setOperatorList] = useState([])
//     const [rule, setRule] = useState([])

//     const [enableValidation, setEnableValidation] = useState(false);
//     const [imageErrors, setImageErrors] = useState({});
//     const [videoErrors, setVideoErrors] = useState({});
//     const [visiblePickers, setVisiblePickers] = useState({});
    
//     const Colors = [
//         '#007bff', // Blue
//         '#6610f2', // Indigo
//         '#6f42c1', // Purple
//         '#e83e8c', // Pink
//         '#f14f45', // Red-Orange
//         '#dc3545', // Red
//         '#fd7e14', // Orange
//         '#f18845', // Light Orange
//         '#f1b345', // Yellow-Orange
//         '#ffc107', // Amber
//         '#28a745', // Green
//         '#20c997', // Teal
//         '#17a2b8', // Cyan
//         '#6c757d', // Gray
//         '#343a40', // Dark Gray
//         '#adb5bd', // Light Gray
//         '#000000', // Black
//         '#b0e0e6', // Powder Blue
//         '#ff69b4', // Hot Pink
//         '#c0c0c0', // Silver
//         '#ffdab9', // Peach Puff
//         '#90ee90', // Light Green
//       ];





//     useEffect(() => {
//         setOperatorList(config_data.operators_list)
//         setComplaince(config_data.compliance)
//         setcheckpointInfo(checkpointinfo)
//         // setRule(checkpointinfo.rule || [])
//         // setEnableValidation(checkpointinfo.enable_validation)
//     }, [checkpointinfo])

//     const handleValidationToggle = (e) => {
//         setEnableValidation(e.target.checked);
//         onChangeEnableValidation(e.target.checked)
//         var updtCheckpointInfo = _.cloneDeep(checkpointInfo)
//         updtCheckpointInfo["enable_validation"] = e.target.checked
//         setcheckpointInfo(updtCheckpointInfo)
//         updateState(updtCheckpointInfo)
//     };


//     const handleKeypress = (event) => {
//         const { key, target } = event;
//         if (key === '-' || key === '+') {
//             if (minusPressed || target.value.includes('-') || target.value.includes('+')) {
//                 event.preventDefault();
//             } else {
//                 setminusPressed(true)
//             }
//         } else if (key === 'Backspace') {
//             setminusPressed(false)
//         }
//     };

//     const togglePickerVisibility = (idx) => {
//     setVisiblePickers((prev) => ({
//       ...prev,
//       [idx]: !prev[idx]
//     }));
//   };



//     const onChangeConfigReq = (e, data, idx) => {
//         const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);
//         updatedCheckpointInfo.rule[idx]["show_config"] = !e.target.checked
//         setcheckpointInfo(updatedCheckpointInfo);
//         updateState(updatedCheckpointInfo)
//     }


//     const handleOperatorChange = (e, idx) => {
//         const { value } = e.target;
//         const operator = operatorList.find(op => op.id === value);
//         const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);
//         if (!Array.isArray(updatedCheckpointInfo.rule)) {
//             updatedCheckpointInfo.rule = [];
//         }

//         while (updatedCheckpointInfo.rule.length <= idx) {
//             updatedCheckpointInfo.rule.push({});
//         }
//         console.log('operator :>> ', operator);
//         updatedCheckpointInfo.rule[idx] = { ...updatedCheckpointInfo.rule[idx], operator_info: { operator } };
//         updateState(updatedCheckpointInfo)
//         setcheckpointInfo(updatedCheckpointInfo);
//     };





//     const requiresTwoValues = (operatorObj) => {
//         if (!operatorObj) return false;
//         return operatorObj.modulus === 'between' || operatorObj.modulus?.includes('or');
//     };



//     const defaultRule = { show_config: true };




//     const handleAddRule = () => {
//         const newRuleEntry = _.cloneDeep(defaultRule);
//         // const updatedRules = [...rule, newRuleEntry];
//         // setRule(updatedRules);
//         const updtCheckpointInfo = _.cloneDeep(checkpointInfo);
//         if (!Array.isArray(updtCheckpointInfo.rule)) {
//             updtCheckpointInfo.rule = [];
//         }
//         updtCheckpointInfo.rule.push(newRuleEntry);
//         setcheckpointInfo(updtCheckpointInfo);
//         updateState(updtCheckpointInfo)
//     };




//     const handleDeleteRule = (indexToDelete) => {
//         // const updatedRules = rule.filter((_, index) => index !== indexToDelete);
//         // setRule(updatedRules);
//         const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);
//         if (Array.isArray(updatedCheckpointInfo.rule)) {
//             updatedCheckpointInfo.rule = updatedCheckpointInfo.rule.filter((_, index) => index !== indexToDelete);
//         }
//         setcheckpointInfo(updatedCheckpointInfo);
//         updateState(updatedCheckpointInfo)
//     };



//     const handleComplianceChange = (e, idx, data) => {
//         const { value } = e.target;
//         const operator = compliance.find(op => op.id === value);
//         console.log('operator :>> ', operator, checkpointInfo);
//         const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);
//         if (!Array.isArray(updatedCheckpointInfo.rule)) {
//             updatedCheckpointInfo.rule = [];
//         }

//         while (updatedCheckpointInfo.rule.length <= idx) {
//             updatedCheckpointInfo.rule.push({});
//         }
//         updatedCheckpointInfo.rule[idx] = { ...updatedCheckpointInfo.rule[idx], compliance: operator };
//         updateState(updatedCheckpointInfo)
//         setcheckpointInfo(updatedCheckpointInfo);
//     };

//     const updateRuleField = (idx, key, value) => {
//         const updated = _.cloneDeep(checkpointInfo);
//         if (!Array.isArray(updated.rule)) updated.rule = [];

//         while (updated.rule.length <= idx) {
//             updated.rule.push({});
//         }

//         updated.rule[idx][key] = value;
//         // console.log('updated :>> ', updated);
//         updateState(updated)
//         setcheckpointInfo(updated);
//     };


//     const handleImageChange = (idx, field, val) => {
//         const rule = checkpointInfo.rule?.[idx] || {};
//         const imageInfo = { ...rule.image_info, [field]: val };
//         let errors = { ...imageErrors };

//         if (!errors[idx]) errors[idx] = {};

//         const minVal = Number(imageInfo.min);
//         const maxVal = Number(imageInfo.max);

//         if (!isNaN(minVal) && !isNaN(maxVal)) {
//             if (minVal > maxVal) {
//                 errors[idx].min = 'Minimum cannot be greater than Maximum';
//             } else {
//                 errors[idx].min = '';
//             }

//             if (maxVal < minVal) {
//                 errors[idx].max = 'Maximum cannot be less than Minimum';
//             } else {
//                 errors[idx].max = '';
//             }
//         }

//         setImageErrors(errors);
//         updateRuleField(idx, 'image_info', imageInfo);
//     };

//     const handleImageCheckboxChange = (idx, field, val) => {
//         const rule = checkpointInfo.rule?.[idx] || {};
//         const imageInfo = { ...rule.image_info, [field]: !val };
//         updateRuleField(idx, 'image_info', imageInfo);
//     }

//     const handleVideoCheckboxChange = (idx, field, val) => {
//         const rule = checkpointInfo.rule?.[idx] || {};
//         const video_info = { ...rule.video_info, [field]: !val };
//         updateRuleField(idx, 'video_info', video_info);
//     }


//     const handleVideoChange = (idx, field, val) => {
//         const rule = checkpointInfo.rule?.[idx] || {};
//         const videoInfo = { ...rule.video_info, [field]: Number(val) };
//         let errors = { ...videoErrors };

//         if (!errors[idx]) errors[idx] = {};

//         const minVal = Number(videoInfo.min);
//         const maxVal = Number(videoInfo.max);

//         // Validation logic for min and max
//         if (!isNaN(minVal) && !isNaN(maxVal)) {
//             if (minVal > maxVal) {
//                 errors[idx].min = 'Minimum cannot be greater than Maximum';
//                 errors[idx].max = '';
//             } else {
//                 errors[idx].min = '';
//                 errors[idx].max = '';
//             }
//         }

//         setVideoErrors(errors);
//         updateRuleField(idx, 'video_info', videoInfo);
//     };


//     const handleDocumentsChange = (idx, docs) => {
//         updateRuleField(idx, 'documents_attached', docs);
//     };


//     const handleCapaChange = (idx, field, checked) => {
//         const rule = checkpointInfo.rule?.[idx] || {};
//         const capaInfo = { ...rule.capa_info, [field]: checked };
//         updateRuleField(idx, 'capa_info', capaInfo);
//     };


//     // const handleOperatorValueChange = (e, idx, field) => {
//     //     const { value } = e.target;
//     //     console.log('value :>> ', value);

//     //     const updatedValues = { ...operatorValues };
//     //     updatedValues[idx] = {
//     //         ...updatedValues[idx],
//     //         [field]: Number(value)
//     //     };

//     //     console.log("operatorValues", operatorValues)

//     //     setOperatorValues(updatedValues);

//     //     const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);
//     //     console.log('Array.isArray(updatedCheckpointInfo.rule :>> ', Array.isArray(updatedCheckpointInfo.rule) );
//     //     if (Array.isArray(updatedCheckpointInfo.rule)) {
//     //         updatedCheckpointInfo.rule[idx] = {
//     //             ...updatedCheckpointInfo.rule[idx],
//     //             operator_info: updatedValues[idx]
//     //         };
//     //     }
//     //     console.log('updatedCheckpointInfo :>> ', updatedCheckpointInfo);
//     //     // updateState(updatedCheckpointInfo)
//     //     // setcheckpointInfo(updatedCheckpointInfo);
//     // };
//     const handleOperatorValueChange = (e, idx, field) => {
//         const { value } = e.target;

//         const updatedValues = { ...operatorValues };
//         updatedValues[idx] = {
//             ...updatedValues[idx],
//             [field]: Number(value)
//         };

//         setOperatorValues(updatedValues);

//         const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);

//         if (Array.isArray(updatedCheckpointInfo.rule)) {
//             const ruleItem = updatedCheckpointInfo.rule[idx] || {};

//             // Ensure operator_info exists
//             ruleItem.operator_info = {
//                 ...ruleItem.operator_info,
//                 [field]: Number(value)  // set 'from' or 'to' inside operator_info
//             };

//             updatedCheckpointInfo.rule[idx] = ruleItem;
//         }

//         updateState(updatedCheckpointInfo);
//         setcheckpointInfo(updatedCheckpointInfo);
//     };


//     const onScoreChange = (e, idx, field) => {
//         const { value } = e.target;

//         const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);

//         if (updatedCheckpointInfo.rule && updatedCheckpointInfo.rule[idx]) {
//             updatedCheckpointInfo.rule[idx][field] = Number(value);
//         }
//         updateState(updatedCheckpointInfo)
//         setcheckpointInfo(updatedCheckpointInfo);
//     };
//    const handleColorChange = (idx, field, val) => {
//         updateRuleField(idx, field, val);
//     };

//     return (
//         <div>
//             {
//                 checkpointInfo?.enable_validation &&
//                 <Row className="my-2">
//                         {checkpointInfo.rule?.map((data, idx) => {
//                             var getComplianceStatus = _.some(data?.compliance, { 'is_selected': true });
//                             return (
//                                 <Col key={idx} md={12}>
//                                     <div
//                                         style={{
//                                             display: 'flex',
//                                             flexDirection: 'column',
//                                             padding: 15,
//                                             borderRadius: 8,
//                                             // border: submitprocess && (data.option_text == "" ||
//                                             //     (data.enable_img && (Number.isNaN(data.no_of_img) || data.no_of_img == 0 || (!data.enable_gallery && !data.enable_cam))) ||
//                                             //     (data.enable_video && (Number.isNaN(data.no_of_video) || data.no_of_video == 0 || (!data.enable_video_gallery && !data.enable_video_cam)))
//                                             //     ||
//                                             //     (data.enable_doc && data.documents.length == 0) || (data.enable_score && Number.isNaN(data.score)) || !getComplianceStatus) ? '1px solid #ff0000' : '0px',
//                                             borderColor: checkpointInfo.rule[idx]?.color || Colors[0],
//                                             borderWidth: '2px',
//                                             borderStyle: 'solid',
//                                             borderRadius: '4px',
//                                             padding: '1rem',
//                                             marginBottom: '1%'
//                                         }}
//                                     >
//                                         <div className='d-flex align-items-center justify-content-end'>
//                                             <Popconfirm
//                                                 title="Are you sure you want to delete this rule?"
//                                                 onConfirm={() => handleDeleteRule(idx)}
//                                                 okText="Yes"
//                                                 cancelText="No"
//                                             >
//                                                 <i className='bx bx-trash' style={{ color: 'red', fontSize: 16, cursor: 'pointer' }} />
//                                             </Popconfirm>
//                                         </div>

//                                         <Row className="align-items-center">
//                                             <>
//                                                 <OperatorInput
//                                                     index={idx}
//                                                     operator_info={data.operator_info}
//                                                     operatorList={operatorList}
//                                                     compliance={compliance}
//                                                     requiresTwoValues={requiresTwoValues}
//                                                     onOperatorChange={handleOperatorChange}
//                                                     onValueChange={handleOperatorValueChange}
//                                                     onComplianceChange={handleComplianceChange}
//                                                     checkpointInfo={checkpointInfo}
//                                                     onScoreChange={onScoreChange}
//                                                 />
//                                             </>
//                                         </Row>

//                                         <div className="bg-light p-2 my-2">
//                                             <Label>Pick a Color</Label>

//                                             <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '10px' }}>
//                                                 <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//                                                     {Colors.map((colorItem, index) => (
//                                                         <div
//                                                             key={index}
//                                                             onClick={() => handleColorChange(idx, 'color', colorItem)}
//                                                             style={{
//                                                                 backgroundColor: colorItem,
//                                                                 width: '20px',
//                                                                 height: '20px',
//                                                                 margin: '5px',
//                                                                 borderRadius: '5px',
//                                                                 cursor: 'pointer',
//                                                                 border: checkpointInfo.rule?.[idx]?.color === colorItem ? '2px solid black' : 'none',
//                                                             }}
//                                                         />
//                                                     ))}

//                                                     <button
//                                                         onClick={() => togglePickerVisibility(idx)}
//                                                         className="btn btn-sm btn-primary"
//                                                         style={{ margin: '5px' }}
//                                                     >
//                                                         {visiblePickers[idx] ? 'Close Advanced' : 'Advanced'}
//                                                     </button>
//                                                 </div>

//                                                 {visiblePickers[idx] && (
//                                                     <div style={{ marginTop: '20px', width: '100%' }}>
//                                                         <HexColorPicker
//                                                             color={checkpointInfo.rule?.[idx]?.color || Colors[0]}
//                                                             onChange={(hex) => handleColorChange(idx, 'color', hex)}
//                                                             style={{ width: '100%' }}
//                                                         />
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>


//                                         <div className='border border-bottom-secondary'></div>
//                                         <div style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid #f0f0f0', paddingBottom: 5, marginTop: 5 }} >
//                                             <div className="form-check form-switch form-switch-sm " style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
//                                                 <input
//                                                     type="checkbox"
//                                                     className="form-check-input me-2 "
//                                                     id={"config" + idx}
//                                                     onClick={(e) => { onChangeConfigReq(e, data, idx) }}
//                                                     checked={data.show_config}
//                                                 />

//                                                 <label className={data.show_config ? "form-check-label text-primary font-size-12" : "form-check-label text-Dark font-size-12"} htmlFor={"config" + idx} >
//                                                     Show Configuration
//                                                 </label>
//                                             </div>
//                                         </div>

//                                         {data.show_config  && enable_validation ?
//                                             <div>
//                                                 <CheckpointConfigSection idx={idx} data={data} checkpointInfo={checkpointInfo} updateRuleField={updateRuleField} />

//                                                 {/* <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f0f0f0', paddingBottom: 10, marginTop: 10, }} >
//                                                     <div className="col-12">
//                                                         <div className=" bg-light p-3 rounded" style={{ display: 'flex', flexDirection: 'column' }} >
//                                                             <Label className="mb-2 fw-bold">Image</Label>
//                                                             <div className="mb-3 d-flex gap-4">
//                                                                 <div className="d-flex align-items-center">
//                                                                     <Input
//                                                                         type="checkbox"
//                                                                         className="form-check-input"
//                                                                         checked={checkpointInfo.rule?.[idx]?.image_info?.camera || false}
//                                                                         onClick={(e) => handleImageCheckboxChange(idx, 'camera', e.target.checked)}
//                                                                     />
//                                                                     <Label className="form-check-label ms-2 d-flex align-items-center">
//                                                                         <i className="fas fa-camera me-1"></i> Camera
//                                                                     </Label>
//                                                                 </div>
//                                                                 <div className="d-flex align-items-center">
//                                                                     <Input
//                                                                         type="checkbox"
//                                                                         className="form-check-input"
//                                                                         checked={checkpointInfo.rule?.[idx]?.image_info?.gallery || false}
//                                                                         onClick={(e) => handleImageCheckboxChange(idx, 'gallery', e.target.checked)}
//                                                                     />
//                                                                     <Label className="form-check-label ms-2 d-flex align-items-center">
//                                                                         <i className="fas fa-image me-1"></i> Gallery
//                                                                     </Label>
//                                                                 </div>
//                                                             </div>

//                                                             <Row>
//                                                                 <Col>
//                                                                     <Label className="mb-1">Minimum</Label>
//                                                                     <Input
//                                                                         type="number"
//                                                                         placeholder="Enter Minimum"
//                                                                         value={checkpointInfo.rule?.[idx]?.image_info?.min || ''}
//                                                                         onChange={(e) => handleImageChange(idx, 'min', e.target.value)}
//                                                                         disabled={!(checkpointInfo.rule?.[idx]?.image_info?.gallery || checkpointInfo.rule?.[idx]?.image_info?.camera)}
//                                                                     />
//                                                                     {imageErrors[idx]?.min && (
//                                                                         <div className="text-danger mt-1">{imageErrors[idx].min}</div>
//                                                                     )}
//                                                                 </Col>
//                                                                 <Col>
//                                                                     <Label className="mb-1">Maximum</Label>
//                                                                     <Input
//                                                                         type="number"
//                                                                         placeholder="Enter Maximum"
//                                                                         value={checkpointInfo.rule?.[idx]?.image_info?.max || ''}
//                                                                         onChange={(e) => handleImageChange(idx, 'max', e.target.value)}
//                                                                         disabled={!(checkpointInfo.rule?.[idx]?.image_info?.gallery || checkpointInfo.rule?.[idx]?.image_info?.camera)}
//                                                                     />
//                                                                     {imageErrors[idx]?.max && (
//                                                                         <div className="text-danger mt-1">{imageErrors[idx].max}</div>
//                                                                     )}
//                                                                 </Col>
//                                                             </Row>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f0f0f0', paddingBottom: 10, marginTop: 10, }} >
//                                                     <div className="col-12">
//                                                         <div className="bg-light p-3 rounded">
//                                                             <Label className="mb-3 fw-bold">Video</Label>
//                                                             <div className="mb-3 d-flex gap-4">
//                                                                 <div className="d-flex align-items-center">
//                                                                     <Input
//                                                                         type="checkbox"
//                                                                         className="form-check-input"
//                                                                         checked={checkpointInfo.rule?.[idx]?.video_info?.camera || false}
//                                                                         onClick={(e) =>
//                                                                             handleVideoCheckboxChange(idx, 'camera', e.target.checked)
//                                                                         }
//                                                                     />
//                                                                     <Label className="form-check-label ms-2 d-flex align-items-center">
//                                                                         <i className="fas fa-camera me-1"></i> Camera
//                                                                     </Label>
//                                                                 </div>
//                                                                 <div className="d-flex align-items-center">
//                                                                     <Input
//                                                                         type="checkbox"
//                                                                         className="form-check-input"
//                                                                         checked={checkpointInfo.rule?.[idx]?.video_info?.gallery || false}
//                                                                         onClick={(e) =>
//                                                                             handleVideoCheckboxChange(idx, 'gallery', e.target.checked)
//                                                                         }
//                                                                     />
//                                                                     <Label className="form-check-label ms-2 d-flex align-items-center">
//                                                                         <i className="fas fa-image me-1"></i> Gallery
//                                                                     </Label>
//                                                                 </div>
//                                                             </div>

//                                                             <Row>


//                                                                 <Col>
//                                                                     <Label className="mb-1">Minimum</Label>
//                                                                     <Input
//                                                                         type="number"
//                                                                         placeholder="Enter Minimum"
//                                                                         value={checkpointInfo.rule?.[idx]?.video_info?.min || ''}
//                                                                         onChange={(e) => handleVideoChange(idx, 'min', e.target.value)}
//                                                                         disabled={!(checkpointInfo.rule?.[idx]?.video_info?.gallery || checkpointInfo.rule?.[idx]?.video_info?.camera)}
//                                                                     />
//                                                                     {videoErrors[idx]?.min && (
//                                                                         <div className="text-danger mt-1" style={{ fontSize: '0.85rem' }}>
//                                                                             {videoErrors[idx].min}
//                                                                         </div>
//                                                                     )}
//                                                                 </Col>
//                                                                 <Col>
//                                                                     <Label className="mb-1">Maximum</Label>
//                                                                     <Input
//                                                                         type="number"
//                                                                         placeholder="Enter Maximum"
//                                                                         value={checkpointInfo.rule?.[idx]?.video_info?.max || ''}
//                                                                         onChange={(e) => handleVideoChange(idx, 'max', e.target.value)}
//                                                                         disabled={!(checkpointInfo.rule?.[idx]?.video_info?.gallery || checkpointInfo.rule?.[idx]?.video_info?.camera)}
//                                                                     />
//                                                                     {videoErrors[idx]?.max && (
//                                                                         <div className="text-danger mt-1" style={{ fontSize: '0.85rem' }}>
//                                                                             {videoErrors[idx].max}
//                                                                         </div>
//                                                                     )}
//                                                                 </Col>

//                                                                 <Col>
//                                                                     <Label className="mb-1">Duration</Label>
//                                                                     <Input
//                                                                         type="number"
//                                                                         placeholder="Enter Duration"
//                                                                         value={checkpointInfo.rule?.[idx]?.video_info?.duration || ''}
//                                                                         onChange={(e) => handleVideoChange(idx, 'duration', e.target.value)}
//                                                                         disabled={!(checkpointInfo.rule?.[idx]?.video_info?.gallery || checkpointInfo.rule?.[idx]?.video_info?.camera)}
//                                                                     />
//                                                                 </Col>
//                                                             </Row>
//                                                         </div>
//                                                     </div>
//                                                 </div>



//                                                 <div style={{ display: 'flex', flexDirection: 'row', gap: 5, borderBottom: '1px solid #f0f0f0', paddingBottom: 5, marginTop: 10 }} >
//                                                     <div className="col-12">
//                                                         <div className="form-check form-switch form-switch-sm bg-light p-2" >
//                                                             <Label>Documents</Label>
//                                                             <div style={{ display: 'flex', width: '100%' }}>
//                                                                 <div style={{ flex: 1, marginLeft: 7 }}>
//                                                                     <TagsInput
//                                                                         value={checkpointInfo.rule?.[idx]?.documents_attached || []}
//                                                                         onChange={(tags) => handleDocumentsChange(idx, tags)}
//                                                                         className="form-control react-tagsinput-false bg-white"
//                                                                         inputProps={{
//                                                                             style: { width: "100%" },
//                                                                             placeholder: 'Input document name and hit enter'
//                                                                         }}
//                                                                     />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>



//                                                 <div className="bg-light p-2" >
//                                                     <Row className="align-items-center">
//                                                         <Col xs="auto">
//                                                             <Label className="mb-0">Enable CAPA</Label>
//                                                         </Col>
//                                                         <Col xs="auto">
//                                                             <Input
//                                                                 type="checkbox"
//                                                                 defaultChecked={checkpointInfo.rule?.[idx]?.capa_info?.enable_capa || false}
//                                                                 onChange={(e) => handleCapaChange(idx, 'enable_capa', e.target.checked)}
//                                                             />
//                                                         </Col>
//                                                         {checkpointInfo.rule?.[idx]?.capa_info?.enable_capa &&
//                                                             <>
//                                                                 <Col xs="auto">
//                                                                     <Label className="mb-0">Mandatory</Label>
//                                                                 </Col>
//                                                                 <Col xs="auto">
//                                                                     <Input
//                                                                         type="checkbox"
//                                                                         defaultChecked={checkpointInfo.rule?.[idx]?.capa_info?.mandatory || false}
//                                                                         onChange={(e) => handleCapaChange(idx, 'mandatory', e.target.checked)}
//                                                                     />
//                                                                 </Col>
//                                                             </>
//                                                         }
//                                                     </Row>
//                                                 </div> */}

//                                             </div> : null}
//                                     </div>
//                                 </Col>
//                             )
//                         })}
//                 </Row>
//             }

//             {
//                 checkpointInfo?.enable_validation &&
//                 <Row>
//                     <Col>
//                         <button className='btn btn-sm btn-primary w-sm' onClick={handleAddRule}>Add Rule</button>
//                     </Col>
//                 </Row>
//             }

//         </div>
//     );
// };

// export default OperatorComponent;














//9-5-25-Jose
// import React, { useState, useEffect } from 'react';
// import {
//     Row,
//     Col,
//     Input,
//     Label,
//     FormGroup,
//     Card,
//     CardBody,
// } from 'reactstrap'; import TagsInput from 'react-tagsinput'
// import OperatorInput from './OperatorInput'
// import { Popconfirm } from 'antd';




// const OperatorComponent = (props) => {
//     const { checkpointinfo, edit, config_data, submitprocess } = props
//     console.log('props :>> ', props);
//     const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
//     const [selectedType, setSelectedType] = useState("");
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [checkpointInfo, setcheckpointInfo] = useState(null)
//     const [minusPressed, setminusPressed] = useState(false)
//     const [compliance, setComplaince] = useState([])
//     const [operatorValues, setOperatorValues] = useState({});

//     const [decimalValue, setDecimalValue] = useState('');
//     const [maxDigits, setMaxDigits] = useState('');
//     const [signOption, setSignOption] = useState('positive');
//     const [units, setUnits] = useState('');
//     const [operatorList, setOperatorList] = useState([])
//     const [rule, setRule] = useState([])

//     const [enableValidation, setEnableValidation] = useState(false);


//     const handleValidationToggle = () => {
//         setEnableValidation(prev => !prev);
//     };



//     useEffect(() => {
//         setOperatorList(config_data.operators_list)
//         setComplaince(config_data.compliance)
//         setcheckpointInfo(checkpointinfo)
//     }, [])

//     const handleKeypress = (event) => {
//         const { key, target } = event;
//         if (key === '-' || key === '+') {
//             if (minusPressed || target.value.includes('-') || target.value.includes('+')) {
//                 event.preventDefault();
//             } else {
//                 setminusPressed(true)
//             }
//         } else if (key === 'Backspace') {
//             setminusPressed(false)
//         }
//     };



//     const onChangeConfigReq = (e, data, idx) => {
//         var updtComplianceInfo = _.cloneDeep(compliance)
//         updtComplianceInfo[idx]["show_config"] = !e.target.checked
//         setComplaince(updtComplianceInfo)
//     }

//     const onChangePhotoReq = (e, data, idx) => {
//         const updtComplianceInfo = _.cloneDeep(compliance)
//         updtComplianceInfo[idx]["enable_img"] = !e.target.checked
//         setComplaince(updtComplianceInfo)
//     }

//     const onChangeVideoReq = (e, data, idx) => {
//         const updtComplianceInfo = _.cloneDeep(compliance)
//         updtComplianceInfo[idx]["enable_video"] = !e.target.checked
//         setComplaince(updtComplianceInfo)
//     }

//     const onChangeScoreReq = (e, data, idx) => {
//         const updtComplianceInfo = _.cloneDeep(compliance)
//         updtComplianceInfo[idx]["enable_score"] = !e.target.checked
//         setComplaince(updtComplianceInfo)
//     }

//     const onChangeActionReq = (e, data, idx) => {
//         const updtComplianceInfo = _.cloneDeep(compliance)
//         updtComplianceInfo[idx]["enable_nc"] = !e.target.checked
//         setComplaince(updtComplianceInfo)
//     }

//     const onChangeDocReq = (e, data, idx) => {
//         const updtComplianceInfo = _.cloneDeep(compliance)
//         updtComplianceInfo[idx]["enable_doc"] = !e.target.checked
//         setComplaince(updtComplianceInfo)
//     }


//     const handleChange = (tags, data, idx) => {
//         const updtComplianceInfo = _.cloneDeep(compliance)
//         updtComplianceInfo[idx]["documents"] = tags
//         setComplaince(updtComplianceInfo)
//     }


//     const handleOperatorChange = (e, idx) => {
//         const { value } = e.target;
//         const operator = operatorList.find(op => op.id === value);

//         const updatedValues = { ...operatorValues };
//         updatedValues[idx] = {
//             ...updatedValues[idx],
//             operator,
//             value1: '',
//             value2: ''
//         };

//         const updtComplianceInfo = _.cloneDeep(compliance)
//         updtComplianceInfo[idx]["operator_info"] = updatedValues[idx]
//         setComplaince(updtComplianceInfo)


//         setOperatorValues(updatedValues);
//     };


//     const handleOperatorValueChange = (e, idx, field) => {
//         const { value } = e.target;
//         const updatedValues = { ...operatorValues };
//         updatedValues[idx] = {
//             ...updatedValues[idx],
//             [field]: Number(value)
//         };

//         const updtComplianceInfo = _.cloneDeep(compliance)
//         updtComplianceInfo[idx]["operator_info"] = updatedValues[idx]
//         setComplaince(updtComplianceInfo)

//         setOperatorValues(updatedValues);
//     };




//     const handleDecimalChange = (e) => {
//         const value = e.target.value;
//         const regex = /^\d*\.?\d{0,4}$/;
//         if (value === '' || regex.test(value)) {
//             setDecimalValue(value);
//         }
//     };

//     const handleMaxDigitsChange = (e) => {
//         const value = e.target.value;
//         if (value === '' || /^\d+$/.test(value)) {
//             setMaxDigits(value);
//         }
//     };


//     const handleSignOptionChange = (e) => {
//         setSignOption(e.target.value);
//     };



//     const handleUnitsChange = (e) => {
//         setUnits(e.target.value);
//     };



//     const requiresTwoValues = (operatorObj) => {
//         if (!operatorObj) return false;
//         return operatorObj.modulus === 'between' || operatorObj.modulus?.includes('or');
//     };
//     const defaultRule = {
//         option_text: '',
//         compliance: [],
//         enable_img: false,
//         enable_gallery: false,
//         enable_cam: false,
//         enable_video: false,
//         enable_video_gallery: false,
//         enable_video_cam: false,
//         enable_doc: false,
//         enable_score: false,
//         score: null,
//         enable_nc: false,
//         nc_mandatory: false,
//         documents: [],
//         no_of_img: null,
//         no_of_video: null,
//         default_video_duration: null,
//         show_config: true
//     };

//     const handleAddRule = () => {
//         const newRule = [...rule, _.cloneDeep(defaultRule)];
//         setRule(newRule);

//         const newCompliance = [...compliance, _.cloneDeep(defaultRule)];
//         setComplaince(newCompliance);
//     };

//     const handleDeleteRule = (idx) => {
//         const updatedRules = [...rule];
//         updatedRules.splice(idx, 1);
//         setRule(updatedRules); // Or whatever your setter function is
//     };

//     const handleComplianceChange = (e, idx) => {
//         const { value } = e.target;
//         const updatedValues = { ...operatorValues };
//         updatedValues[idx] = {
//             ...updatedValues[idx],
//             complianceId: value
//         };
//         const updtComplianceInfo = _.cloneDeep(compliance);
//         updtComplianceInfo[idx]["operator_info"] = updatedValues[idx];
//         setComplaince(updtComplianceInfo);
//         setOperatorValues(updatedValues);
//     };




//     return (
//         <div>
//             {console.log('compliance :>> ', compliance, rule)}
//             <div className="border border-light my-2" style={{ padding: 15, borderRadius: 8 }}>

//                 <Card className='bg-light'>
//                     <CardBody className='p-2'>
//                         <Row className="align-items-center">
//                             <Col>
//                                 <FormGroup>
//                                     <Label for="maxDigits" className="font-weight-bold">
//                                         Whole Number Digits
//                                     </Label>
//                                     <div className="d-flex align-items-center">
//                                         <Input
//                                             id="maxDigits"
//                                             type="number"
//                                             placeholder="Enter max digits (e.g. 5)"
//                                             value={maxDigits}
//                                             onChange={handleMaxDigitsChange}
//                                             min="1"
//                                             className="me-2"
//                                             title="Maximum number of digits before the decimal point"
//                                         />
//                                         <span className="text-muted">digits</span>
//                                     </div>
//                                     <small className="form-text text-muted">
//                                         Enter the maximum number of whole number digits allowed.
//                                     </small>
//                                 </FormGroup>
//                             </Col>

//                             <Col className="text-center">
//                                 {/* <div className="d-flex align-items-center justify-content-center h-100"> */}
//                                 {/* <Badge color="secondary" className="p-3" style={{ fontSize: '1.8rem' }}> */}

//                                 {/* </Badge> */}
//                                 <span className='' style={{ fontSize: '1.5rem' }}>+ </span>
//                                 {/* </div> */}
//                             </Col>

//                             <Col>
//                                 <FormGroup>
//                                     <Label for="decimalValue" className="font-weight-bold">
//                                         Decimal Places
//                                     </Label>
//                                     <div className="d-flex align-items-center">
//                                         <Input
//                                             id="decimalValue"
//                                             type="number"
//                                             placeholder="Enter decimal places (e.g. 2)"
//                                             value={decimalValue}
//                                             onChange={handleDecimalChange}
//                                             min="0"
//                                             max="4"
//                                             className="me-2"
//                                             title="Number of digits allowed after the decimal point"
//                                         />
//                                         <span className="text-muted">places</span>
//                                     </div>
//                                     <small className="form-text text-muted">
//                                         You can allow up to 4 decimal places.
//                                     </small>
//                                 </FormGroup>
//                             </Col>
//                         </Row>
//                     </CardBody>
//                 </Card>

//                 <Row className="mt-1">
//                     <Col md={12}>
//                         <FormGroup tag="fieldset">
//                             <Label className="font-weight-bold">Number Sign</Label>
//                             <div className="d-flex">
//                                 <FormGroup check className="me-3">
//                                     <Label check>
//                                         <Input
//                                             type="radio"
//                                             name="signOption"
//                                             value="positive"
//                                             checked={signOption === 'positive'}
//                                             onClick={handleSignOptionChange}
//                                         />{' '}
//                                         Only Positive
//                                     </Label>
//                                 </FormGroup>
//                                 <FormGroup check className="me-3">
//                                     <Label check>
//                                         <Input
//                                             type="radio"
//                                             name="signOption"
//                                             value="negative"
//                                             checked={signOption === 'negative'}
//                                             onClick={handleSignOptionChange}
//                                         />{' '}
//                                         Only Negative
//                                     </Label>
//                                 </FormGroup>
//                                 <FormGroup check>
//                                     <Label check>
//                                         <Input
//                                             type="radio"
//                                             name="signOption"
//                                             value="both"
//                                             checked={signOption === 'both'}
//                                             onClick={handleSignOptionChange}
//                                         />{' '}
//                                         Both
//                                     </Label>
//                                 </FormGroup>
//                             </div>
//                         </FormGroup>
//                     </Col>
//                 </Row>
//                 <Row className="mt-1">
//                     <Col md={12}>
//                         <FormGroup>
//                             <Label for="units" className="font-weight-bold">
//                                 Units
//                             </Label>
//                             <Input
//                                 id="units"
//                                 type="text"
//                                 placeholder="e.g. kg, m, °C"
//                                 value={units}
//                                 onChange={handleUnitsChange}
//                             />
//                             <small className="form-text text-muted">
//                                 unit of measurement
//                             </small>
//                         </FormGroup>
//                     </Col>
//                 </Row>
//             </div>



//             <div className="border border-light my-2" style={{ padding: 15, borderRadius: 8 }}>
//                 <div className="form-check form-switch">
//                     <input
//                         className="form-check-input"
//                         type="checkbox"
//                         role="switch"
//                         id="enableValidationSwitch"
//                         checked={enableValidation}
//                         onClick={() => { handleValidationToggle() }}
//                     />
//                     <label className="form-check-label" htmlFor="enableValidationSwitch">
//                         Enable Validation
//                     </label>
//                 </div>
//             </div>

//             {
//                 enableValidation &&
//                 <Row className="my-2">
//                     <Label>Compliance</Label>
//                     {rule?.map((data, idx) => {
//                         var getComplianceStatus = _.some(data.compliance, { 'is_selected': true });
//                         return (
//                             <Col key={idx} md={12}>
//                                 <div
//                                     className="border border-secondary my-2"
//                                     style={{
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         padding: 15,
//                                         borderRadius: 8,
//                                         border: submitprocess && (data.option_text == "" ||
//                                             (data.enable_img && (Number.isNaN(data.no_of_img) || data.no_of_img == 0 || (!data.enable_gallery && !data.enable_cam))) ||
//                                             (data.enable_video && (Number.isNaN(data.no_of_video) || data.no_of_video == 0 || (!data.enable_video_gallery && !data.enable_video_cam)))
//                                             ||
//                                             (data.enable_doc && data.documents.length == 0) || (data.enable_score && Number.isNaN(data.score)) || !getComplianceStatus) ? '1px solid #ff0000' : '0px'
//                                     }}
//                                 >
//                                     <div className='d-flex align-items-center justify-content-end'>
//                                         <Popconfirm
//                                             title="Are you sure you want to delete this rule?"
//                                             onConfirm={() => handleDeleteRule(idx)}
//                                             okText="Yes"
//                                             cancelText="No"
//                                         >
//                                             <i className='bx bx-trash' style={{ color: 'red', fontSize: 16, cursor: 'pointer' }} />
//                                         </Popconfirm>
//                                     </div>

//                                     <Row className="align-items-center">
//                                         <>
//                                             <OperatorInput
//                                                 index={idx}
//                                                 operatorValue={operatorValues[idx]}
//                                                 operatorList={operatorList}
//                                                 compliance={compliance}
//                                                 requiresTwoValues={requiresTwoValues}
//                                                 onOperatorChange={handleOperatorChange}
//                                                 onValueChange={handleOperatorValueChange}
//                                                 onComplianceChange={handleComplianceChange}
//                                             />
//                                         </>
//                                     </Row>

//                                     <div className='border border-bottom-secondary'></div>
//                                     <div style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid #f0f0f0', paddingBottom: 5, marginTop: 5 }} >
//                                         <div className="form-check form-switch form-switch-sm " style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
//                                             <input
//                                                 type="checkbox"
//                                                 className="form-check-input me-2 "
//                                                 id={"config" + idx}
//                                                 onClick={(e) => { onChangeConfigReq(e, data, idx) }}
//                                                 checked={data.show_config}
//                                             />

//                                             <label className={data.show_config ? "form-check-label text-primary font-size-12" : "form-check-label text-Dark font-size-12"} htmlFor={"config" + idx} >
//                                                 Show Configuration
//                                             </label>
//                                         </div>
//                                     </div>

//                                     {data.show_config ?
//                                         <div>

//                                             <div style={{ display: 'flex', flexDirection: 'row', gap: 5, borderBottom: '1px solid #f0f0f0', paddingBottom: 5, marginTop: 10 }} >

//                                                 <div className='col-12'>
//                                                     <div style={{ display: 'flex', flexDirection: 'column', }} >
//                                                         <div className="form-check form-switch form-switch-sm bg-light  p-2" >
//                                                             <Row>
//                                                                 <Label className='mb-2'>Image</Label>
//                                                                 <Col>
//                                                                     <Label>Minimum</Label>
//                                                                     <Input
//                                                                         type="number"
//                                                                         placeholder="Enter Minimum"

//                                                                     />
//                                                                 </Col>
//                                                                 <Col>
//                                                                     <Label>Maximum</Label>
//                                                                     <Input
//                                                                         type="number"
//                                                                         placeholder="Enter Maximum"
//                                                                     />
//                                                                 </Col>

//                                                             </Row>
//                                                         </div>
//                                                     </div>
//                                                 </div>



//                                             </div>
//                                             <div style={{ display: 'flex', flexDirection: 'row', gap: 5, borderBottom: '1px solid #f0f0f0', paddingBottom: 5, marginTop: 10 }} >
//                                                 <div className="col-12">
//                                                     <div style={{ display: 'flex', flexDirection: 'column', }} >

//                                                         <div className="form-check form-switch form-switch-sm bg-light  p-2" >
//                                                             <Row>
//                                                                 <Label className='mb-2'>Video</Label>
//                                                                 <Col>
//                                                                     <Label>Minimum</Label>
//                                                                     <Input
//                                                                         type="number"
//                                                                         placeholder="Enter Minimum"

//                                                                     />
//                                                                 </Col>
//                                                                 <Col>
//                                                                     <Label>Maximum</Label>
//                                                                     <Input
//                                                                         type="number"
//                                                                         placeholder="Enter Maximum"

//                                                                     />
//                                                                 </Col>
//                                                                 <Col>
//                                                                     <Label>Duration</Label>
//                                                                     <Input
//                                                                         type="number"
//                                                                         placeholder="Enter Duration"

//                                                                     />
//                                                                 </Col>

//                                                             </Row>
//                                                         </div>

//                                                     </div>
//                                                 </div>
//                                             </div>


//                                             <div style={{ display: 'flex', flexDirection: 'row', gap: 5, borderBottom: '1px solid #f0f0f0', paddingBottom: 5, marginTop: 10 }} >
//                                                 <div className="col-12">
//                                                     <div className="form-check form-switch form-switch-sm bg-light  p-2" >
//                                                         <Label>Documents</Label>
//                                                         <div style={{ display: 'flex', width: '100%' }}>
//                                                             <div style={{ flex: 1, marginLeft: 7 }}>
//                                                                 <TagsInput
//                                                                     value={[]}
//                                                                     className="form-control react-tagsinput-false bg-white"
//                                                                     inputProps={{
//                                                                         style: { width: "100%" },
//                                                                         placeholder: 'Input document name and hit enter'
//                                                                     }}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className=" bg-light  p-2" >
//                                                 <Row className="align-items-center">
//                                                     <Col xs="auto">
//                                                         <Label className="mb-0">Enable CAPA</Label>
//                                                     </Col>
//                                                     <Col xs="auto">
//                                                         <Input type="checkbox" />
//                                                     </Col>
//                                                     <Col xs="auto">
//                                                         <Label className="mb-0">Mandatory</Label>
//                                                     </Col>
//                                                     <Col xs="auto">
//                                                         <Input type="checkbox" />
//                                                     </Col>
//                                                 </Row>
//                                             </div>
//                                         </div> : null}
//                                 </div>
//                             </Col>
//                         )
//                     })}
//                 </Row>
//             }

//             {
//                 enableValidation &&
//                 <Row>
//                     <Col>
//                         <button className='btn btn-sm btn-primary w-sm' onClick={handleAddRule}>Add Rule</button>
//                     </Col>
//                 </Row>
//             }

//         </div>
//     );
// };

// export default OperatorComponent;
