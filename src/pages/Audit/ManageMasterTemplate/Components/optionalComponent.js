
import React, { useEffect, useState } from 'react'
import { Row, Col, Label, Input } from "reactstrap";
import { AvField } from "availity-reactstrap-validation";
import OperatorInput from './OperatorInput'
import { HexColorPicker } from 'react-colorful';
import CheckpointConfigSection from './CheckpointConfigSection';

const YesorNo = (props) => {
    const { updateState, enable_validation, checkpointinfo, config_data , submitProcess, selectedInputValue} = props
    // console.log('checkpointinfo :>> ', checkpointinfo);

    const [compliance, setComplaince] = useState([])
    const [checkpointInfo, setcheckpointInfo] = useState(checkpointinfo)
    const [dataLoaded, setdataLoaded] = useState(false)
    const [operatorValues, setOperatorValues] = useState({});
    const [operatorList, setOperatorList] = useState([])
    const [visiblePickers, setVisiblePickers] = useState({});

    const dec_digit_count = config_data.dec_digit_count


    useEffect(() => {
        console.log('config_data.compliance :>> ', config_data.compliance);
        setComplaince(config_data.compliance);
        setOperatorList(config_data.operators_list);
        
        if (checkpointinfo?.options && !checkpointinfo.rule) {
            const updated = _.cloneDeep(checkpointinfo);
            updated.rule = updated.options.map(opt => ({
                option_text: opt.option_text,
                id: opt.id,
                show_config: true,
                image_info: { camera: false, gallery: false, max: 0, min: null },
                video_info: { camera: false, gallery: false, max: 0, min: null, duration: null },
                capa_info : { enable_capa: false, mandatory: false },
                document_info:[],
                images:[],
                videos:[],
                documents:[],
            }));
            // updated.rule = updated.options.map(opt => ({ option_text: opt.option_text, id: opt.id, show_config: true }));
            setcheckpointInfo(updated);
            updateState(updated)
        } 
        else {
            console.log('elseeee :>> ', checkpointinfo);
             const updated = _.cloneDeep(checkpointinfo);
            setcheckpointInfo(updated);
             updateState(updated)
        }
        setdataLoaded(true);
    }, [selectedInputValue]);

useEffect(() => {
//   console.log('checkpointInfo updated:', checkpointInfo, checkpointinfo);
  // You can use checkpointInfo here safely
}, [checkpointinfo]);



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



    const togglePickerVisibility = (idx) => {
        setVisiblePickers((prev) => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };




    const onChangeConfigReq = (e, data, idx) => {
        var updtCheckpointInfo = _.cloneDeep(checkpointinfo)
        updtCheckpointInfo.rule[idx]["show_config"] = e.target.checked
        setcheckpointInfo(updtCheckpointInfo)
        updateState(updtCheckpointInfo)
    }

    const addOptions = () => {
        var updtCheckpointInfo = _.cloneDeep(checkpointinfo)
        updtCheckpointInfo.rule = updtCheckpointInfo.rule.concat([
            {
                "option_text": "",
                "score": 0,
                "enable_img": false,
                "no_of_img": 0,
                "no_of_video": 0,
                "optn_editable": true,
                "enable_nc": false,
                "enable_doc": false,
                "enable_score": false,
                "documents": [],
                "nc_mandatory": false,
                "enable_cam": false,
                "enable_gallery": false,
                "show_config": false,
                "images": [],
                "videos": [],
                "documents_attached": [],
                "compliance": [
                    {
                        "id": "1",
                        "name": "Compliant",
                        "color": "success",
                        "is_selected": false
                    },
                    {
                        "id": "2",
                        "name": "Non Compliant",
                        "color": "danger",
                        "is_selected": false
                    },
                    {
                        "id": "3",
                        "name": "Partially Compliant",
                        "color": "warning",
                        "is_selected": false
                    }
                ],
                'show_config': true
            }
        ])
        setcheckpointInfo(updtCheckpointInfo)
        updateState(updtCheckpointInfo)
    }

    const deleteOption = (id) => {
        checkpointinfo.rule.splice(id, 1)
        setcheckpointInfo(checkpointinfo)
        updateState(checkpointinfo)
    }


    const requiresTwoValues = (operatorObj) => {
        if (!operatorObj) return false;
        return operatorObj.modulus === 'between' || operatorObj.modulus?.includes('and');
    };

    const handleOperatorChange = (e, idx) => {
        const { value } = e.target;
        const operator = operatorList.find(op => op.id === value);
        const updatedValues = { ...operatorValues };
        updatedValues[idx] = {
            ...updatedValues[idx],
            operator,
            value1: '',
            value2: ''
        };
        const updtComplianceInfo = _.cloneDeep(compliance)
        updtComplianceInfo[idx]["operator_config"] = updatedValues[idx]
        setComplaince(updtComplianceInfo)
        setOperatorValues(updatedValues);
    };


    const handleOperatorValueChange = (e, idx, field) => {
        const { value } = e.target;
        const updatedValues = { ...operatorValues };
        updatedValues[idx] = {
            ...updatedValues[idx],
            [field]: Number(value)
        };
        const updtComplianceInfo = _.cloneDeep(compliance)
        updtComplianceInfo[idx]["operator_config"] = updatedValues[idx]
        setComplaince(updtComplianceInfo)
        setOperatorValues(updatedValues);
    };

    const handleComplianceChange = (e, idx, data) => {
        const { value } = e.target;
        const operator = compliance.find(op => op.id === value);
        const colorMap = { success: '#28a745', danger: '#dc3545', warning: '#ffc107',secondary: '#d3d3d3'};
        const updatedCheckpointInfo = _.cloneDeep(checkpointinfo);
        if (!Array.isArray(updatedCheckpointInfo.rule)) {
            updatedCheckpointInfo.rule = [];
        }
        while (updatedCheckpointInfo.rule.length <= idx) {
            updatedCheckpointInfo.rule.push({});
        }
        updatedCheckpointInfo.rule[idx] = {
            ...updatedCheckpointInfo.rule[idx],
            title: data.option_text,
            compliance: operator,
            color: colorMap[operator?.color] || '',
        };
        setcheckpointInfo(updatedCheckpointInfo);
        updateState(updatedCheckpointInfo);
    };


    const updateRuleField = (idx, key, value) => {
        const updated = _.cloneDeep(checkpointinfo);
        if (!Array.isArray(updated.rule)) updated.rule = [];
        while (updated.rule.length <= idx) {
            updated.rule.push({});
        }
        updated.rule[idx][key] = value;
        setcheckpointInfo(updated);
        updateState(updated)
    };


    const handleColorChange = (idx, field, val) => {
        updateRuleField(idx, field, val);
    };

    const onScoreChange = (e, idx, field) => {
        const { value } = e.target;

        const updatedCheckpointInfo = _.cloneDeep(checkpointinfo);

        if (updatedCheckpointInfo.rule && updatedCheckpointInfo.rule[idx]) {
            updatedCheckpointInfo.rule[idx][field] = Number(value);
        }
        updateState(updatedCheckpointInfo)
        setcheckpointInfo(updatedCheckpointInfo);
    };

    if (dataLoaded) {
        return (
            <div>
                <div className="button-items mt-2">
                    <div className="btn-group-vertical " role="group" aria-label="Basic radio toggle button group">
                        <Row>
                            {
                                checkpointinfo?.rule?.map((data, idx) => {
                                    return (
                                        <Col md={12} key={idx} >
                                                <div style={{ display: 'flex', flexDirection: 'column', padding: 15, borderRadius: 8, borderColor: checkpointinfo.rule[idx]?.color || Colors[0], borderWidth: '2px', borderStyle: 'solid', borderRadius: '4px', padding: '1rem', marginBottom: '1%' }}>
                                                <div className="position-relative" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 3 }}>
                                                    <AvField name={"option " + idx + 1} type="text" value={data.option_text} disabled={!checkpointinfo.enable_addOptns} placeholder="Enter Option..."
                                                        onChange={(e) => { updateRuleField(idx, 'option_text', e.target.value); }}
                                                        className={checkpointinfo.enable_addOptns ? "mb-2 form-control" : "mb-2 form-control chat-input"}
                                                        validate={{ required: { value: submitProcess && data.option_text?.trim() === "" ? true : false } }}
                                                    />
                                                </div>


                                                {checkpointinfo.enable_operator ?
                                                    <OperatorInput
                                                        index={idx}
                                                        operatorValue={operatorValues[idx]}
                                                        operatorList={operatorList}
                                                        requiresTwoValues={requiresTwoValues}
                                                        onOperatorChange={handleOperatorChange}
                                                        onValueChange={handleOperatorValueChange}
                                                        compliance={compliance}
                                                        onComplianceChange={handleComplianceChange}
                                                        submitProcess={submitProcess}

                                                    />
                                                    :
                                                    <>
                                                        <div className="row my-2">
                                                            <div className="col-md-6">
                                                                <Label className="mb-2">Score</Label>
                                                                 <Input type="number" placeholder="Enter Score" step={`0.${'0'.repeat(dec_digit_count - 1)}1`} value={checkpointinfo.rule?.[idx]?.score || ''} onChange={(e) => { const value = e.target.value; const regex = new RegExp(`^\\d*\\.?\\d{0,${dec_digit_count}}$`); if (value === '' || regex.test(value)) { onScoreChange(e, idx, 'score') }}} />
                                                                {/* <Input type="number" placeholder="Enter Score" step="0.01" min="0" value={checkpointinfo.rule?.[idx]?.score || ''} onChange={(e) => { const value = e.target.value; if (/^\d*\.?\d{0,2}$/.test(value)) { onScoreChange(e, idx, 'score') } }} /> */}
                                                            </div>

                                                            {enable_validation ? (
                                                                <div className="col-md-6 ">
                                                                    <Label className="mb-2">Compliance</Label>
                                                                    <Input type="select" value={checkpointinfo.rule?.[idx]?.compliance?.id || ''} onChange={(e) => handleComplianceChange(e, idx, data)} >
                                                                        <option value="" disabled>Select Compliance</option>
                                                                        {compliance.map((item) => (
                                                                            <option key={item.id} value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </Input>
                                                                     {submitProcess && checkpointinfo?.rule[idx]?.compliance === undefined && ( <small className="text-danger">Compliance is required</small> )}
                                                                </div>

                                                            ) : null}
                                                        </div>
                                                    </>
                                                }


                                                <div className="bg-light p-2 my-2 rounded">
                                                    <Label>Pick a Color</Label>
                                                    <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '10px' }}>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                                            {Colors.map((colorItem, index) => (
                                                                <div key={index} onClick={() => handleColorChange(idx, 'color', colorItem)} style={{ backgroundColor: colorItem, width: '20px', height: '20px', margin: '5px', borderRadius: '5px', cursor: 'pointer', border: checkpointinfo.rule?.[idx]?.color === colorItem ? '2px solid black' : 'none', }} />
                                                            ))}

                                                            <div onClick={() => togglePickerVisibility(idx)} style={{ width: '20px', height: '20px', margin: '5px', borderRadius: '5px', border: '1px dashed gray', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', color: '#555' }} >
                                                                {visiblePickers[idx] ? '×' : '+'}
                                                            </div>
                                                        </div>
                                                        {visiblePickers[idx] && (
                                                            <div style={{ marginTop: '20px', width: '100%' }}>
                                                                <HexColorPicker color={checkpointinfo.rule?.[idx]?.color || Colors[0]} onChange={(hex) => handleColorChange(idx, 'color', hex)} style={{ width: '100%' }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid #f0f0f0', paddingBottom: 5, marginTop: 5 }} >
                                                    <div className="form-check form-switch form-switch-sm " style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }} >
                                                        <input type="checkbox" className="form-check-input me-2 " id={"config" + idx} onChange={(e) => { onChangeConfigReq(e, data, idx) }} defaultChecked={data?.show_config} />
                                                        <label className={data.show_config ? "form-check-label text-primary font-size-12" : "form-check-label text-Dark font-size-12"} htmlFor={"config" + idx} >
                                                            Show Configuration
                                                        </label>
                                                    </div>
                                                    {data.show_config ?
                                                        <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                            {idx > 0 && checkpointinfo.enable_addOptns ?
                                                                <div className='me-1'>
                                                                    <button className="btn btn-primary btn-block btn-sm" onClick={() => addOptions()}>Add Option</button>
                                                                </div> : null
                                                            }
                                                            {idx > 1 && checkpointinfo.enable_addOptns ?
                                                                <div>
                                                                    <button className="btn btn-danger btn-block btn-sm" onClick={() => deleteOption(idx)}>Delete this Option</button>
                                                                </div>
                                                                : null
                                                            }
                                                        </div>
                                                        : null}
                                                </div>
                                                {data.show_config &&
                                                    <CheckpointConfigSection idx={idx} data={data} checkpointInfo={checkpointinfo} updateRuleField={updateRuleField}  submitProcess={submitProcess}/>
                                                }

                                            </div>
                                        </Col>
                                    )
                                }
                                )
                            }
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return null
    }
}

export default YesorNo










//11-6-25

// import React, { useEffect, useState } from 'react'
// import { Row, Col, Label, Input } from "reactstrap";
// import { AvField } from "availity-reactstrap-validation";
// import OperatorInput from './OperatorInput'
// import { HexColorPicker } from 'react-colorful';
// import CheckpointConfigSection from './CheckpointConfigSection';

// const YesorNo = (props) => {
//     const { updateState, enable_validation, checkpointinfo, config_data , submitProcess, selectedInputValue} = props
//     console.log('checkpointinfo :>> ', checkpointinfo);

//     const [compliance, setComplaince] = useState([])
//     const [checkpointInfo, setcheckpointInfo] = useState(checkpointinfo)
//     const [dataLoaded, setdataLoaded] = useState(false)
//     const [operatorValues, setOperatorValues] = useState({});
//     const [operatorList, setOperatorList] = useState([])
//     const [visiblePickers, setVisiblePickers] = useState({});

//     const dec_digit_count = config_data.dec_digit_count


//     useEffect(() => {
//         setComplaince(config_data.compliance);
//         setOperatorList(config_data.operators_list);
        
//         if (checkpointinfo?.options && !checkpointinfo.rule) {
//             console.log('iffffff :>> ', checkpointinfo);
//             const updated = _.cloneDeep(checkpointinfo);
//             updated.rule = updated.options.map(opt => ({ option_text: opt.option_text, id: opt.id, show_config: true }));
//             setcheckpointInfo(updated);
//             updateState(updated)
//         } 
//         else {
//             console.log('elseeee :>> ', checkpointinfo);
//              const updated = _.cloneDeep(checkpointinfo);
//             setcheckpointInfo(updated);
//              updateState(updated)
//         }
//         setdataLoaded(true);
//     }, [selectedInputValue]);




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
//     ];



//     const togglePickerVisibility = (idx) => {
//         setVisiblePickers((prev) => ({
//             ...prev,
//             [idx]: !prev[idx]
//         }));
//     };




//     const onChangeConfigReq = (e, data, idx) => {
//         var updtCheckpointInfo = _.cloneDeep(checkpointInfo)
//         updtCheckpointInfo.rule[idx]["show_config"] = e.target.checked
//         setcheckpointInfo(updtCheckpointInfo)
//         updateState(checkpointinfo)
//     }

//     const addOptions = () => {
//         var updtCheckpointInfo = _.cloneDeep(checkpointInfo)
//         updtCheckpointInfo.rule = updtCheckpointInfo.rule.concat([
//             {
//                 "option_text": "",
//                 "score": 0,
//                 "enable_img": false,
//                 "no_of_img": 0,
//                 "no_of_video": 0,
//                 "optn_editable": true,
//                 "enable_nc": false,
//                 "enable_doc": false,
//                 "enable_score": false,
//                 "documents": [],
//                 "nc_mandatory": false,
//                 "enable_cam": false,
//                 "enable_gallery": false,
//                 "show_config": false,
//                 "images": [],
//                 "videos": [],
//                 "documents_attached": [],
//                 "compliance": [
//                     {
//                         "id": "1",
//                         "name": "Compliant",
//                         "color": "success",
//                         "is_selected": false
//                     },
//                     {
//                         "id": "2",
//                         "name": "Non Compliant",
//                         "color": "danger",
//                         "is_selected": false
//                     },
//                     {
//                         "id": "3",
//                         "name": "Partially Compliant",
//                         "color": "warning",
//                         "is_selected": false
//                     }
//                 ],
//                 'show_config': true
//             }
//         ])
//         setcheckpointInfo(updtCheckpointInfo)
//         updateState(updtCheckpointInfo)
//     }

//     const deleteOption = (id) => {
//         checkpointInfo.rule.splice(id, 1)
//         setcheckpointInfo(checkpointInfo)
//         updateState(checkpointInfo)
//     }


//     const requiresTwoValues = (operatorObj) => {
//         if (!operatorObj) return false;
//         return operatorObj.modulus === 'between' || operatorObj.modulus?.includes('and');
//     };

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
//         updtComplianceInfo[idx]["operator_config"] = updatedValues[idx]
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
//         updtComplianceInfo[idx]["operator_config"] = updatedValues[idx]
//         setComplaince(updtComplianceInfo)
//         setOperatorValues(updatedValues);
//     };

//     const handleComplianceChange = (e, idx, data) => {
//         const { value } = e.target;
//         const operator = compliance.find(op => op.id === value);
//         const colorMap = { success: '#28a745', danger: '#dc3545', warning: '#ffc107',secondary: '#d3d3d3'};
//         const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);
//         if (!Array.isArray(updatedCheckpointInfo.rule)) {
//             updatedCheckpointInfo.rule = [];
//         }
//         while (updatedCheckpointInfo.rule.length <= idx) {
//             updatedCheckpointInfo.rule.push({});
//         }
//         updatedCheckpointInfo.rule[idx] = {
//             ...updatedCheckpointInfo.rule[idx],
//             title: data.option_text,
//             compliance: operator,
//             color: colorMap[operator?.color] || '',
//         };
//         setcheckpointInfo(updatedCheckpointInfo);
//         updateState(updatedCheckpointInfo);
//     };


//     const updateRuleField = (idx, key, value) => {
//         const updated = _.cloneDeep(checkpointInfo);
//         if (!Array.isArray(updated.rule)) updated.rule = [];
//         while (updated.rule.length <= idx) {
//             updated.rule.push({});
//         }
//         updated.rule[idx][key] = value;
//         setcheckpointInfo(updated);
//         updateState(updated)
//     };


//     const handleColorChange = (idx, field, val) => {
//         updateRuleField(idx, field, val);
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

//     if (dataLoaded) {
//         return (
//             <div>
//                 <div className="button-items mt-2">
//                     <div className="btn-group-vertical " role="group" aria-label="Basic radio toggle button group">
//                         {console.log('checkpointInfo :>> ', checkpointInfo)}
//                         <Row>
//                             {
//                                 checkpointInfo?.rule?.map((data, idx) => {
//                                     return (
//                                         <Col md={12} key={idx} >
//                                                 <div style={{ display: 'flex', flexDirection: 'column', padding: 15, borderRadius: 8, borderColor: checkpointInfo.rule[idx]?.color || Colors[0], borderWidth: '2px', borderStyle: 'solid', borderRadius: '4px', padding: '1rem', marginBottom: '1%' }}>
//                                                 <div className="position-relative" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 3 }}>
//                                                     <AvField name={"option " + idx + 1} type="text" value={data.option_text} disabled={!checkpointinfo.enable_addOptns} placeholder="Enter Option..."
//                                                         onChange={(e) => { updateRuleField(idx, 'option_text', e.target.value); }}
//                                                         className={checkpointinfo.enable_addOptns ? "mb-2 form-control" : "mb-2 form-control chat-input"}
//                                                         validate={{ required: { value: props.submitProcess && data.option_text == "" ? true : false } }}
//                                                     />
//                                                 </div>


//                                                 {checkpointInfo.enable_operator ?
//                                                     <OperatorInput
//                                                         index={idx}
//                                                         operatorValue={operatorValues[idx]}
//                                                         operatorList={operatorList}
//                                                         requiresTwoValues={requiresTwoValues}
//                                                         onOperatorChange={handleOperatorChange}
//                                                         onValueChange={handleOperatorValueChange}
//                                                         compliance={compliance}
//                                                         onComplianceChange={handleComplianceChange}
//                                                         submitProcess={submitProcess}

//                                                     />
//                                                     :
//                                                     <>
//                                                         <div className="row my-2">
//                                                             <div className="col-md-6">
//                                                                 <Label className="mb-2">Score</Label>
//                                                                  <Input type="number" placeholder="Enter Score" step={`0.${'0'.repeat(dec_digit_count - 1)}1`} value={checkpointInfo.rule?.[idx]?.score || ''} onChange={(e) => { const value = e.target.value; const regex = new RegExp(`^\\d*\\.?\\d{0,${dec_digit_count}}$`); if (value === '' || regex.test(value)) { onScoreChange(e, idx, 'score') }}} />
//                                                                 {/* <Input type="number" placeholder="Enter Score" step="0.01" min="0" value={checkpointInfo.rule?.[idx]?.score || ''} onChange={(e) => { const value = e.target.value; if (/^\d*\.?\d{0,2}$/.test(value)) { onScoreChange(e, idx, 'score') } }} /> */}
//                                                             </div>

//                                                             {enable_validation ? (
//                                                                 <div className="col-md-6 ">
//                                                                     <Label className="mb-2">Compliance</Label>
//                                                                     <Input type="select" value={checkpointInfo.rule?.[idx]?.compliance?.id || ''} onChange={(e) => handleComplianceChange(e, idx, data)} >
//                                                                         <option value="" disabled>Select Compliance</option>
//                                                                         {compliance.map((item) => (
//                                                                             <option key={item.id} value={item.id}>{item.name}</option>
//                                                                         ))}
//                                                                     </Input>
//                                                                      {submitProcess && checkpointInfo?.rule[idx]?.compliance === undefined && ( <small className="text-danger">Compliance is required</small> )}
//                                                                 </div>

//                                                             ) : null}
//                                                         </div>
//                                                     </>
//                                                 }


//                                                 <div className="bg-light p-2 my-2 rounded">
//                                                     <Label>Pick a Color</Label>
//                                                     <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '10px' }}>
//                                                         <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
//                                                             {Colors.map((colorItem, index) => (
//                                                                 <div key={index} onClick={() => handleColorChange(idx, 'color', colorItem)} style={{ backgroundColor: colorItem, width: '20px', height: '20px', margin: '5px', borderRadius: '5px', cursor: 'pointer', border: checkpointInfo.rule?.[idx]?.color === colorItem ? '2px solid black' : 'none', }} />
//                                                             ))}

//                                                             <div onClick={() => togglePickerVisibility(idx)} style={{ width: '20px', height: '20px', margin: '5px', borderRadius: '5px', border: '1px dashed gray', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', color: '#555' }} >
//                                                                 {visiblePickers[idx] ? '×' : '+'}
//                                                             </div>
//                                                         </div>
//                                                         {visiblePickers[idx] && (
//                                                             <div style={{ marginTop: '20px', width: '100%' }}>
//                                                                 <HexColorPicker color={checkpointInfo.rule?.[idx]?.color || Colors[0]} onChange={(hex) => handleColorChange(idx, 'color', hex)} style={{ width: '100%' }} />
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>

//                                                 <div style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid #f0f0f0', paddingBottom: 5, marginTop: 5 }} >
//                                                     <div className="form-check form-switch form-switch-sm " style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }} >
//                                                         <input type="checkbox" className="form-check-input me-2 " id={"config" + idx} onChange={(e) => { onChangeConfigReq(e, data, idx) }} defaultChecked={data?.show_config} />
//                                                         <label className={data.show_config ? "form-check-label text-primary font-size-12" : "form-check-label text-Dark font-size-12"} htmlFor={"config" + idx} >
//                                                             Show Configuration
//                                                         </label>
//                                                     </div>
//                                                     {data.show_config ?
//                                                         <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
//                                                             {idx > 0 && checkpointinfo.enable_addOptns ?
//                                                                 <div className='me-1'>
//                                                                     <button className="btn btn-primary btn-block btn-sm" onClick={() => addOptions()}>Add Option</button>
//                                                                 </div> : null
//                                                             }
//                                                             {idx > 1 && checkpointinfo.enable_addOptns ?
//                                                                 <div>
//                                                                     <button className="btn btn-danger btn-block btn-sm" onClick={() => deleteOption(idx)}>Delete this Option</button>
//                                                                 </div>
//                                                                 : null
//                                                             }
//                                                         </div>
//                                                         : null}
//                                                 </div>
//                                                 {data.show_config &&
//                                                     <CheckpointConfigSection idx={idx} data={data} checkpointInfo={checkpointInfo} updateRuleField={updateRuleField}  submitProcess={submitProcess}/>
//                                                 }

//                                             </div>
//                                         </Col>
//                                     )
//                                 }
//                                 )
//                             }
//                         </Row>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
//     else {
//         return null
//     }
// }

// export default YesorNo




















//before simplify code 15-5-25
// import React, { useEffect, useState } from 'react'
// import { Row, Col, Label, Input } from "reactstrap";
// import { AvField } from "availity-reactstrap-validation";
// import TagsInput from 'react-tagsinput'
// import OperatorInput from './OperatorInput'
// import { HexColorPicker } from 'react-colorful';
// import CheckpointConfigSection from './CheckpointConfigSection';

// const YesorNo = (props) => {
//     const { updateState, enable_validation, checkpointinfo, config_data } = props

//     const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
//     const [compliance, setComplaince] = useState([])
//     const [checkpointInfo, setcheckpointInfo] = useState(null)
//     const [dataLoaded, setdataLoaded] = useState(false)
//     const [operatorValues, setOperatorValues] = useState({});
//     const [operatorList, setOperatorList] = useState([])
//     const [imageErrors, setImageErrors] = useState({});
//     const [videoErrors, setVideoErrors] = useState({});

//     const [visiblePickers, setVisiblePickers] = useState({});


//     useEffect(() => {
//         setComplaince(config_data.compliance);
//         setOperatorList(config_data.operators_list);
//         if (checkpointinfo?.options && !checkpointinfo.rule) {
//             const updated = _.cloneDeep(checkpointinfo);
//             updated.rule = updated.options.map(opt => ({ option_text: opt.option_text, id: opt.id, show_config: true }));
//             setcheckpointInfo(updated);
//         } else {
//             setcheckpointInfo(checkpointinfo);
//         }
//         setdataLoaded(true);
//     }, [checkpointinfo]);

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
//     ];



//     const togglePickerVisibility = (idx) => {
//         setVisiblePickers((prev) => ({
//             ...prev,
//             [idx]: !prev[idx]
//         }));
//     };




//     const onChangeConfigReq = (e, data, idx) => {
//         var updtCheckpointInfo = _.cloneDeep(checkpointInfo)
//         updtCheckpointInfo.rule[idx]["show_config"] = e.target.checked
//         setcheckpointInfo(updtCheckpointInfo)
//         updateState(checkpointinfo)
//     }

//     const addOptions = () => {
//         var updtCheckpointInfo = _.cloneDeep(checkpointInfo)
//         console.log('addOptions :>> ', checkpointinfo, updtCheckpointInfo);
//         updtCheckpointInfo.rule = updtCheckpointInfo.rule.concat([
//             {
//                 "option_text": "",
//                 "score": 0,
//                 "enable_img": false,
//                 "no_of_img": 0,
//                 "no_of_video": 0,
//                 "optn_editable": true,
//                 "enable_nc": false,
//                 "enable_doc": false,
//                 "enable_score": false,
//                 "documents": [],
//                 "nc_mandatory": false,
//                 "enable_cam": false,
//                 "enable_gallery": false,
//                 "show_config": false,
//                 "images": [],
//                 "videos": [],
//                 "documents_attached": [],
//                 "compliance": [
//                     {
//                         "id": "1",
//                         "name": "Compliant",
//                         "color": "success",
//                         "is_selected": false
//                     },
//                     {
//                         "id": "2",
//                         "name": "Non Compliant",
//                         "color": "danger",
//                         "is_selected": false
//                     },
//                     {
//                         "id": "3",
//                         "name": "Partially Compliant",
//                         "color": "warning",
//                         "is_selected": false
//                     }
//                 ],
//                 'show_config': true
//             }
//         ])
//         setcheckpointInfo(updtCheckpointInfo)
//         updateState(updtCheckpointInfo)
//     }

//     const deleteOption = (id) => {
//         checkpointinfo.rule.splice(id, 1)
//         setcheckpointInfo(checkpointinfo)
//         updateState(checkpointinfo)
//     }


//     const requiresTwoValues = (operatorObj) => {
//         if (!operatorObj) return false;
//         return operatorObj.modulus === 'between' || operatorObj.modulus?.includes('and');
//     };

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
//         updtComplianceInfo[idx]["operator_config"] = updatedValues[idx]
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
//         updtComplianceInfo[idx]["operator_config"] = updatedValues[idx]
//         setComplaince(updtComplianceInfo)
//         setOperatorValues(updatedValues);
//     };

//     const handleComplianceChange = (e, idx, data) => {
//         const { value } = e.target;
//         console.log('value :>> ', value, data);

//         const operator = compliance.find(op => op.id === value);
//         console.log('operator :>> ', operator, checkpointInfo);

//         const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);

//         if (!Array.isArray(updatedCheckpointInfo.rule)) {
//             updatedCheckpointInfo.rule = [];
//         }

//         while (updatedCheckpointInfo.rule.length <= idx) {
//             updatedCheckpointInfo.rule.push({});
//         }

//         updatedCheckpointInfo.rule[idx] = {
//             ...updatedCheckpointInfo.rule[idx],
//             title: data.option_text,
//             compliance: operator
//         };

//         setcheckpointInfo(updatedCheckpointInfo);
//         updateState(updatedCheckpointInfo)
//     };

//     const updateRuleField = (idx, key, value) => {
//         const updated = _.cloneDeep(checkpointInfo);
//         if (!Array.isArray(updated.rule)) updated.rule = [];

//         while (updated.rule.length <= idx) {
//             updated.rule.push({});
//         }

//         updated.rule[idx][key] = value;
//         setcheckpointInfo(updated);
//         updateState(updated)
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


//     const handleColorChange = (idx, field, val) => {
//         updateRuleField(idx, field, val);
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

//     if (dataLoaded) {
//         return (
//             <div>
               


//                 <div className="button-items mt-2">
//                     <div className="btn-group-vertical " role="group" aria-label="Basic radio toggle button group">
//                         <Row>
//                             {
//                                 checkpointInfo?.rule?.map((data, idx) => {
//                                     var getComplianceStatus = _.some(data.compliance, { 'is_selected': true });
//                                     return (
//                                         <Col md={12} key={idx} >
//                                             <div
//                                                 style={{
//                                                     display: 'flex',
//                                                     flexDirection: 'column',
//                                                     padding: 15,
//                                                     borderRadius: 8,
//                                                     // border: props.submitProcess && (data.option_text == "" ||
//                                                     //     (data.enable_img && (Number.isNaN(data.no_of_img) || data.no_of_img == 0 || (!data.enable_gallery && !data.enable_cam))) ||
//                                                     //     (data.enable_video && (Number.isNaN(data.no_of_video) || data.no_of_video == 0 || (!data.enable_video_gallery && !data.enable_video_cam)))
//                                                     //     ||
//                                                     //     (data.enable_doc && data.documents.length == 0) || (data.enable_score && Number.isNaN(data.score)) || !getComplianceStatus) ? '1px solid #ff0000' : '0px',
//                                                     borderColor: checkpointInfo.rule[idx]?.color || Colors[0],
//                                                     borderWidth: '2px',
//                                                     borderStyle: 'solid',
//                                                     borderRadius: '4px',
//                                                     padding: '1rem',
//                                                     marginBottom: '1%'
//                                                 }}
//                                             >
//                                                 <div className="position-relative" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 3 }}>
//                                                     <AvField
//                                                         name={"option " + idx + 1}
//                                                         type="text"
//                                                         value={data.option_text}
//                                                         // onChange={(e) => { checkpointinfo.checkpoint_options[idx].option_text = (e.target.value) }}
//                                                         onChange={(e) => { updateRuleField(idx, 'option_text', e.target.value); }}
//                                                         disabled={!checkpointinfo.enable_addOptns}
//                                                         className={checkpointinfo.enable_addOptns ? "mb-2 form-control" : "mb-2 form-control chat-input"}
//                                                         placeholder="Enter Option..."
//                                                         validate={{ required: { value: props.submitProcess && data.option_text == "" ? true : false } }}
//                                                     />
//                                                 </div>


//                                                 {checkpointInfo.enable_operator ?
//                                                     <OperatorInput
//                                                         index={idx}
//                                                         operatorValue={operatorValues[idx]}
//                                                         operatorList={operatorList}
//                                                         requiresTwoValues={requiresTwoValues}
//                                                         onOperatorChange={handleOperatorChange}
//                                                         onValueChange={handleOperatorValueChange}
//                                                         compliance={compliance}
//                                                         onComplianceChange={handleComplianceChange}

//                                                     />
//                                                     :
//                                                     <>
//                                                         <div className="row my-2">
//                                                             <div className="col-md-6">
//                                                                 <Label className="mb-2">Score</Label>
//                                                                 <Input
//                                                                     type="number"
//                                                                     placeholder="Enter Score"
//                                                                     value={checkpointInfo.rule?.[idx]?.score || ''}
//                                                                     onChange={(e) => onScoreChange(e, idx, 'score')}
//                                                                 />
//                                                             </div>
//                                                             {enable_validation ? (
//                                                                 <div className="col-md-6 ">
//                                                                     <Label className="mb-2">Compliance</Label>
//                                                                     <Input
//                                                                         type="select"
//                                                                         value={checkpointInfo.rule?.[idx]?.compliance?.id || ''}
//                                                                         onChange={(e) => handleComplianceChange(e, idx, data)}
//                                                                     >
//                                                                         <option value="" disabled>Select Compliance</option>
//                                                                         {compliance.map((item) => (
//                                                                             <option key={item.id} value={item.id}>{item.name}</option>
//                                                                         ))}
//                                                                     </Input>
//                                                                 </div>

//                                                             ) : null}
//                                                         </div>
//                                                     </>

//                                                 }



//                                                 <div className="bg-light p-2 my-2">
//                                                     <Label>Pick a Color</Label>

//                                                     <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '10px' }}>
//                                                         <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//                                                             {Colors.map((colorItem, index) => (
//                                                                 <div
//                                                                     key={index}
//                                                                     onClick={() => handleColorChange(idx, 'color', colorItem)}
//                                                                     style={{
//                                                                         backgroundColor: colorItem,
//                                                                         width: '20px',
//                                                                         height: '20px',
//                                                                         margin: '5px',
//                                                                         borderRadius: '5px',
//                                                                         cursor: 'pointer',
//                                                                         border: checkpointInfo.rule?.[idx]?.color === colorItem ? '2px solid black' : 'none',
//                                                                     }}
//                                                                 />
//                                                             ))}

//                                                             <button
//                                                                 onClick={() => togglePickerVisibility(idx)}
//                                                                 className="btn btn-sm btn-primary"
//                                                                 style={{ margin: '5px' }}
//                                                             >
//                                                                 {visiblePickers[idx] ? 'Close Advanced' : 'Advanced'}
//                                                             </button>
//                                                         </div>

//                                                         {visiblePickers[idx] && (
//                                                             <div style={{ marginTop: '20px', width: '100%' }}>
//                                                                 <HexColorPicker
//                                                                     color={checkpointInfo.rule?.[idx]?.color || Colors[0]}
//                                                                     onChange={(hex) => handleColorChange(idx, 'color', hex)}
//                                                                     style={{ width: '100%' }}
//                                                                 />
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>





                                              
//                                                 {data.show_config ?
//                                                     <div>
//                                                         <div style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid #f0f0f0', paddingBottom: 5, marginTop: 5 }} >
//                                                             <div className="form-check form-switch form-switch-sm " style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }} >
//                                                                 <input type="checkbox" className="form-check-input me-2 " id={"config" + idx} onChange={(e) => { onChangeConfigReq(e, data, idx) }} defaultChecked={data?.show_config} />
//                                                                 <label className={data.show_config ? "form-check-label text-primary font-size-12" : "form-check-label text-Dark font-size-12"} htmlFor={"config" + idx} >
//                                                                     Show Configuration
//                                                                 </label>
//                                                             </div>

//                                                             <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
//                                                                 {idx > 0 && checkpointinfo.enable_addOptns ?
//                                                                     <div className='me-1'>
//                                                                         <button className="btn btn-primary btn-block btn-sm" onClick={() => addOptions()}>Add Option</button>
//                                                                     </div> : null
//                                                                 }
//                                                                 {idx > 1 && checkpointinfo.enable_addOptns ?
//                                                                     <div>
//                                                                         <button className="btn btn-danger btn-block btn-sm" onClick={() => deleteOption(idx)}>Delete this Option</button>
//                                                                     </div>
//                                                                     : null
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <CheckpointConfigSection idx={idx} data={data} checkpointInfo={checkpointInfo} updateRuleField={updateRuleField} />







//                                                         {/* <div
//                                                             style={{
//                                                                 display: 'flex',
//                                                                 flexDirection: 'column',
//                                                                 borderBottom: '1px solid #f0f0f0',
//                                                                 paddingBottom: 10,
//                                                                 marginTop: 10,
//                                                             }}
//                                                         >
//                                                             <div className="col-12">
//                                                                 <div className=" bg-light p-3 rounded" style={{ display: 'flex', flexDirection: 'column' }} >
//                                                                     <Label className="mb-2 fw-bold">Image</Label>

//                                                                     <div className="mb-3 d-flex gap-4">
//                                                                         <div className="d-flex align-items-center">
//                                                                             <Input
//                                                                                 type="checkbox"
//                                                                                 className="form-check-input"
//                                                                                 checked={checkpointInfo.rule?.[idx]?.image_info?.camera || false}
//                                                                                 onClick={(e) => handleImageCheckboxChange(idx, 'camera', e.target.checked)}
//                                                                             />
//                                                                             <Label className="form-check-label ms-2 d-flex align-items-center">
//                                                                                 <i className="fas fa-camera me-1"></i> Camera
//                                                                             </Label>
//                                                                         </div>
//                                                                         <div className="d-flex align-items-center">
//                                                                             <Input
//                                                                                 type="checkbox"
//                                                                                 className="form-check-input"
//                                                                                 checked={checkpointInfo.rule?.[idx]?.image_info?.gallery || false}
//                                                                                 onClick={(e) => handleImageCheckboxChange(idx, 'gallery', e.target.checked)}
//                                                                             />
//                                                                             <Label className="form-check-label ms-2 d-flex align-items-center">
//                                                                                 <i className="fas fa-image me-1"></i> Gallery
//                                                                             </Label>
//                                                                         </div>
//                                                                     </div>

//                                                                     <Row>
//                                                                         <Col>
//                                                                             <Label className="mb-1">Minimum</Label>
//                                                                             <Input
//                                                                                 type="number"
//                                                                                 placeholder="Enter Minimum"
//                                                                                 value={checkpointInfo.rule?.[idx]?.image_info?.min || ''}
//                                                                                 onChange={(e) => handleImageChange(idx, 'min', e.target.value)}
//                                                                                 disabled={!(checkpointInfo.rule?.[idx]?.image_info?.gallery || checkpointInfo.rule?.[idx]?.image_info?.camera)}
//                                                                             />
//                                                                             {imageErrors[idx]?.min && (
//                                                                                 <div className="text-danger mt-1">{imageErrors[idx].min}</div>
//                                                                             )}
//                                                                         </Col>
//                                                                         <Col>
//                                                                             <Label className="mb-1">Maximum</Label>
//                                                                             <Input
//                                                                                 type="number"
//                                                                                 placeholder="Enter Maximum"
//                                                                                 value={checkpointInfo.rule?.[idx]?.image_info?.max || ''}
//                                                                                 onChange={(e) => handleImageChange(idx, 'max', e.target.value)}
//                                                                                 // disabled={!checkpointInfo.rule?.[idx]?.image_info?.gallery || !checkpointInfo.rule?.[idx]?.image_info?.camera}
//                                                                                 disabled={!(checkpointInfo.rule?.[idx]?.image_info?.gallery || checkpointInfo.rule?.[idx]?.image_info?.camera)}
//                                                                             />
//                                                                             {imageErrors[idx]?.max && (
//                                                                                 <div className="text-danger mt-1">{imageErrors[idx].max}</div>
//                                                                             )}
//                                                                         </Col>
//                                                                     </Row>
//                                                                 </div>
//                                                             </div>
//                                                         </div>

//                                                         <div
//                                                             style={{
//                                                                 display: 'flex',
//                                                                 flexDirection: 'column',
//                                                                 borderBottom: '1px solid #f0f0f0',
//                                                                 paddingBottom: 10,
//                                                                 marginTop: 10,
//                                                             }}
//                                                         >
//                                                             <div className="col-12">
//                                                                 <div className="bg-light p-3 rounded">
//                                                                     <Label className="mb-3 fw-bold">Video</Label>

//                                                                     <div className="mb-3 d-flex gap-4">
//                                                                         <div className="d-flex align-items-center">
//                                                                             <Input
//                                                                                 type="checkbox"
//                                                                                 className="form-check-input"
//                                                                                 checked={checkpointInfo.rule?.[idx]?.video_info?.camera || false}
//                                                                                 onClick={(e) => handleVideoCheckboxChange(idx, 'camera', e.target.checked)}
//                                                                             />
//                                                                             <Label className="form-check-label ms-2 d-flex align-items-center">
//                                                                                 <i className="fas fa-camera me-1"></i> Camera
//                                                                             </Label>
//                                                                         </div>
//                                                                         <div className="d-flex align-items-center">
//                                                                             <Input
//                                                                                 type="checkbox"
//                                                                                 className="form-check-input"
//                                                                                 checked={checkpointInfo.rule?.[idx]?.video_info?.gallery || false}
//                                                                                 onClick={(e) => handleVideoCheckboxChange(idx, 'gallery', e.target.checked)}

//                                                                             />
//                                                                             <Label className="form-check-label ms-2 d-flex align-items-center">
//                                                                                 <i className="fas fa-image me-1"></i> Gallery
//                                                                             </Label>
//                                                                         </div>
//                                                                     </div>

//                                                                     <Row>


//                                                                         <Col>
//                                                                             <Label className="mb-1">Minimum</Label>
//                                                                             <Input
//                                                                                 type="number"
//                                                                                 placeholder="Enter Minimum"
//                                                                                 value={checkpointInfo.rule?.[idx]?.video_info?.min || ''}
//                                                                                 onChange={(e) => handleVideoChange(idx, 'min', e.target.value)}
//                                                                                 disabled={!(checkpointInfo.rule?.[idx]?.video_info?.gallery || checkpointInfo.rule?.[idx]?.video_info?.camera)}
//                                                                             />
//                                                                             {videoErrors[idx]?.min && (
//                                                                                 <div className="text-danger mt-1" style={{ fontSize: '0.85rem' }}>
//                                                                                     {videoErrors[idx].min}
//                                                                                 </div>
//                                                                             )}
//                                                                         </Col>
//                                                                         <Col>
//                                                                             <Label className="mb-1">Maximum</Label>
//                                                                             <Input
//                                                                                 type="number"
//                                                                                 placeholder="Enter Maximum"
//                                                                                 value={checkpointInfo.rule?.[idx]?.video_info?.max || ''}
//                                                                                 onChange={(e) => handleVideoChange(idx, 'max', e.target.value)}
//                                                                                 disabled={!(checkpointInfo.rule?.[idx]?.video_info?.gallery || checkpointInfo.rule?.[idx]?.video_info?.camera)}
//                                                                             />
//                                                                             {videoErrors[idx]?.max && (
//                                                                                 <div className="text-danger mt-1" style={{ fontSize: '0.85rem' }}>
//                                                                                     {videoErrors[idx].max}
//                                                                                 </div>
//                                                                             )}
//                                                                         </Col>

//                                                                         <Col>
//                                                                             <Label className="mb-1">Duration</Label>
//                                                                             <Input
//                                                                                 type="number"
//                                                                                 placeholder="Enter Duration"
//                                                                                 value={checkpointInfo.rule?.[idx]?.video_info?.duration || ''}
//                                                                                 onChange={(e) => handleVideoChange(idx, 'duration', e.target.value)}
//                                                                                 disabled={!(checkpointInfo.rule?.[idx]?.video_info?.gallery || checkpointInfo.rule?.[idx]?.video_info?.camera)}
//                                                                             />
//                                                                         </Col>
//                                                                     </Row>
//                                                                 </div>
//                                                             </div>
//                                                         </div>

//                                                         <div style={{ display: 'flex', flexDirection: 'row', gap: 5, borderBottom: '1px solid #f0f0f0', paddingBottom: 5, marginTop: 10 }} >
//                                                             <div className="col-12">
//                                                                 <div className="form-check form-switch form-switch-sm bg-light p-2" >
//                                                                     <Label>Documents</Label>
//                                                                     <div style={{ display: 'flex', width: '100%' }}>
//                                                                         <div style={{ flex: 1, marginLeft: 7 }}>
//                                                                             <TagsInput
//                                                                                 value={checkpointInfo.rule?.[idx]?.documents_attached || []}
//                                                                                 onChange={(tags) => handleDocumentsChange(idx, tags)}
//                                                                                 className="form-control react-tagsinput-false bg-white"
//                                                                                 inputProps={{
//                                                                                     style: { width: "100%" },
//                                                                                     placeholder: 'Input document name and hit enter'
//                                                                                 }}
//                                                                             />
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>

//                                                         <div className="bg-light p-2" >
//                                                             <Row className="align-items-center">
//                                                                 <Col xs="auto">
//                                                                     <Label className="mb-0">Enable CAPA</Label>
//                                                                 </Col>
//                                                                 <Col xs="auto">
//                                                                     <Input
//                                                                         type="checkbox"
//                                                                         defaultChecked={checkpointInfo.rule?.[idx]?.capa_info?.enable_capa || false}
//                                                                         onChange={(e) => handleCapaChange(idx, 'enable_capa', e.target.checked)}
//                                                                     />
//                                                                 </Col>
//                                                                 {checkpointInfo.rule?.[idx]?.capa_info?.enable_capa &&
//                                                                     <>
//                                                                         <Col xs="auto">
//                                                                             <Label className="mb-0">Mandatory</Label>
//                                                                         </Col>
//                                                                         <Col xs="auto">
//                                                                             <Input
//                                                                                 type="checkbox"
//                                                                                 defaultChecked={checkpointInfo.rule?.[idx]?.capa_info?.mandatory || false}
//                                                                                 onChange={(e) => handleCapaChange(idx, 'mandatory', e.target.checked)}
//                                                                             />
//                                                                         </Col>
//                                                                     </>
//                                                                 }
//                                                             </Row>
//                                                         </div> */}


//                                                     </div> : null}
//                                             </div>
//                                         </Col>
//                                     )
//                                 }
//                                 )
//                             }
//                         </Row>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
//     else {
//         return null
//     }
// }

// export default YesorNo














// import React, {  useEffect, useState } from 'react'
// import { Row, Col, Input } from "reactstrap";
// import { AvField } from "availity-reactstrap-validation";
// import TagsInput from 'react-tagsinput'
// import 'react-tagsinput/react-tagsinput.css'

// import '../manageAudit.css'
// const _ = require('lodash')

// const YesorNo = (props) =>{

//     const [currentTab, setCurrentTab] = useState("1");
//     const [tags, setTags] = useState([]);
//     const [compliance, setCompliance] = useState([]);
//     const [complianceSelected, setComplianceSelected] = useState("");
//     const [maxVideoDuration, setMaxVideoDuration] = useState(0);
//     const [configData, setConfigData] = useState(null);
//     const [refresh, setRefresh] = useState(false);
//     const [minusPressed, setMinusPressed] = useState(false);


//     useEffect(() => {
//         const configData = JSON.parse(sessionStorage.getItem("authUser"));
//         console.log(configData, "config_data");

//         if (configData) {
//             setCompliance(props.checkpointCompliance);
//             setMaxVideoDuration(Number(configData.client_info[0].max_video_duration.$numberDecimal));
//             setConfigData(configData.client_info[0]);
//         }
//         setRefresh(true)
//     }, []);




//     // const onChangeConfigReq = (e, data) => {
//     //     let value = e.target.checked ? true : false
//     //     data.show_config = value
//     //     setRefresh(true)
//     // }

//     const onChangeConfigReq = (e, data) => {
//         data.show_config = !data.show_config;
//         setRefresh(prev => !prev);
//     };
    


//     const onChangePhotoReq = (e, data) => {

//         console.log("e.target.checked",e.target.checked)
//         data.enable_img = !data.enable_img;
//         setRefresh(prev => !prev); 

//     }


//     const onChangeVideoReq = (e, data) => {

//         data.enable_video = !data.enable_video;
//         setRefresh(prev => !prev);
//     }


//     const enableCamOrGallery = (e, data, source, fileType) => {
//         console.log(data, source, fileType);

//         const camKey = `enable_${fileType.toLowerCase()}_cam`;
//         const galleryKey = `enable_${fileType.toLowerCase()}_gallery`;
//         console.log('camKey', camKey, galleryKey)
//         if (source === "camera") {
//             data[camKey] = true;
//             data[galleryKey] = false;
//         } else {
//             data[galleryKey] = true;
//             data[camKey] = false;
//         }
//         setRefresh(true);
//     };


//     const onChangeActionReq = (e, data) => {
//         data.enable_nc = !data.enable_nc;
//         setRefresh(true);

//     }


//     const onChangeDocReq = (e, data) => {
//         let value = e.target.checked ? true : false
//         data.enable_doc = value
//         setRefresh(true);

//     }

//     const onChangeScoreReq = (e, data) => { 
//         data.enable_score = !data.enable_score;
//         setRefresh(prev => !prev);
//     }



//     const get_minScore = (data) => {
//         try {
//             return isNaN(Math.min.apply(Math, data.map((o) => { return o.score }))) ? 0 : Math.min.apply(Math, data.map((o) => { return o.score }))
//         } catch (error) {
//             return 0
//         }
//     }

//     const get_maxScore = (data) => {
//         try {
//             return isNaN(Math.max.apply(Math, data.map((o) => { return o.score }))) ? 0 : Math.max.apply(Math, data.map((o) => { return o.score }))
//         } catch (error) {
//             return 0
//         }
//     }


//     const handleChange = (tags, data) => {
//         data.documents = tags
//         setRefresh(true);
//     }




//     const scoreHandle = (e, idx) => {
//         var valof = e.target.value
//         if (valof == "") {
//             e.preventDefault();
//         }
//         checkpointinfo.checkpoint_options[idx].score = parseFloat(e.target.value); 
//         setRefresh(true);

//     }


//     const   addOptions =()=> {
//         checkpointinfo.checkpoint_options = checkpointinfo.checkpoint_options.concat([
//             {
//                 "option_text": "",
//                 "score": 0,
//                 "enable_img": false,
//                 "no_of_img": 0,
//                 "no_of_video": 0,
//                 "optn_editable": true,
//                 "enable_nc": false,
//                 "enable_doc": false,
//                 "enable_score": false,
//                 "documents": [],
//                 "nc_mandatory": false,
//                 "enable_cam": false,
//                 "enable_gallery": false,
//                 "show_config": false,
//                 "images": [],
//                 "videos": [],
//                 "documents_attached": [],
//                 "compliance": [
//                     {
//                         "id": "1",
//                         "name": "Compliant",
//                         "color": "success",
//                         "is_selected": false
//                     },
//                     {
//                         "id": "2",
//                         "name": "Non Compliant",
//                         "color": "danger",
//                         "is_selected": false
//                     },
//                     {
//                         "id": "3",
//                         "name": "Partially Compliant",
//                         "color": "warning",
//                         "is_selected": false
//                     }
//                 ]
//             }
//         ])


//         setRefresh(true);

//     }



//     const deleteOption = (id) => {
//         checkpointinfo.checkpoint_options.splice(id, 1)
//         setRefresh(true);

//     }

    
    
//     const handleRadioGroupChange = (event, idx, data) => {
//         _.each(checkpointinfo.checkpoint_options[idx].compliance, item => {
//             console.log("item.name === data.name",item.name === data.name)
//             if (item.name === data.name) {
//                 item["is_selected"] = true
//             }
//             else {
//                 item["is_selected"] = false
//             }
//         })

//         setCompliance(compliance)

//     }

//     const handleKeypress = (event) => {
//         const { key, target } = event;
//         if (key === '-' || key === '+') {
//             if (minusPressed || target.value.includes('-') || target.value.includes('+')) {
//                 event.preventDefault();
//             } else {
//                 setMinusPressed(true)
//             }
//         } else if (key === 'Backspace') {
//             setMinusPressed(false)

//         }
//     };



//     return (
//         <div >

//             <div>
//                 <div className="button-items ">
//                     <div className="btn-group-vertical " role="group" aria-label="Basic radio toggle button group">

//                         <Row>
//                             {
//                                 checkpointinfo.checkpoint_options.map((data, idx) => {
//                                     var getComplianceStatus = _.some(data.compliance, { 'is_selected': true });
//                                     { console.log('data', data) }

//                                     return (
//                                         <Col md={12} key={idx} >

//                                             <div className="border border-secondary my-2"
//                                                 style={{
//                                                     display: 'flex',
//                                                     flexDirection: 'column',
//                                                     padding: 15,
//                                                     borderRadius: 8,
//                                                     border: props.submitProcess && (data.option_text == "" ||
//                                                         (data.enable_img && (Number.isNaN(data.no_of_img) || data.no_of_img == 0 || (!data.enable_gallery && !data.enable_cam))) ||
//                                                         (data.enable_video && (Number.isNaN(data.no_of_video) || data.no_of_video == 0 || (!data.enable_video_gallery && !data.enable_video_cam)))
//                                                         ||
//                                                         (data.enable_doc && data.documents.length == 0) || (data.enable_score && Number.isNaN(data.score)) || !getComplianceStatus) ? '1px solid #ff0000' : '0px'
//                                                 }}
//                                             >
//                                                 <div className="position-relative" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 3 }}>
//                                                     <AvField
//                                                         name={"option " + idx + 1}
//                                                         type="text"
//                                                         value={data.option_text}
//                                                         // onKeyPress={onKeyPress}
//                                                         onChange={(e) => {
//                                                             checkpointinfo.checkpoint_options[idx].option_text = (e.target.value);
//                                                             setRefresh(true)
//                                                         }}
//                                                         disabled={!checkpointinfo.enable_addOptns}
//                                                         className={checkpointinfo.enable_addOptns ? "mb-2 form-control" : "mb-2 form-control chat-input"}
//                                                         placeholder="Enter Option..."
//                                                         validate={{ required: { value: props.submitProcess && data.option_text == "" ? true : false } }}
//                                                     />
//                                                     <div className='d-flex flex-row align-items-center' role="group">

//                                                         {
//                                                             data.compliance &&
//                                                             data.compliance.map((item, indx) => {
//                                                                 var radioId = "nc" + indx + idx
//                                                                 return (
//                                                                     <div className={"form-check  my-2 me-2 form-radio-" + item.color} key={"cpmt" + String(indx)}>
//                                                                         <input
//                                                                             className="form-check-input me-2"
//                                                                             type="radio"
//                                                                             name={radioId}
//                                                                             id={radioId}
//                                                                             // disabled={data.na_id === "1"}
//                                                                             value={item.name}
//                                                                             onClick={(event) => { handleRadioGroupChange(event, idx, item) }}
//                                                                             checked={item.is_selected}
//                                                                         />

//                                                                         <label
//                                                                             className={data.is_compliance ? "form-check-label text-primary font-size-12" : "form-check-label text-Dark font-size-12"}
//                                                                             htmlFor={"nc" + indx + idx}
//                                                                         >
//                                                                             {item.name}
//                                                                         </label>
//                                                                     </div>
//                                                                 )
//                                                             })
//                                                         }

//                                                         {
//                                                             props.submitProcess && !getComplianceStatus && <label className='text-danger p-0 m-0'> Select any one option</label>
//                                                         }
//                                                     </div>



//                                                 </div>


//                                                 <div style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid #f0f0f0', paddingBottom: 5, marginTop: 5 }} >
//                                                     <div
//                                                         className="form-check form-switch form-switch-sm "
//                                                         style={{
//                                                             display: 'flex', flexDirection: 'row', alignItems: 'center',
//                                                         }}
//                                                     >
//                                                         <Input
//                                                             type="checkbox"
//                                                             className="form-check-input me-2 "
//                                                             id={"config" + idx}
//                                                             value={data.show_config}
//                                                             onClick={(e) => { onChangeConfigReq(e, data) }}
//                                                             checked={data.show_config}
//                                                         />

//                                                         <label
//                                                             className={data.show_config ? "form-check-label text-primary font-size-12" : "form-check-label text-Dark font-size-12"}
//                                                             htmlFor={"config" + idx}
//                                                         >
//                                                             Show Configuration
//                                                         </label>
//                                                     </div>

//                                                     <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
//                                                         {idx > 0 && checkpointinfo.enable_addOptns ?
//                                                             <div className='me-1'>
//                                                                 <button className="btn btn-primary btn-block btn-sm" onClick={() => addOptions()}>Add Option</button>
//                                                             </div> : null
//                                                         }
//                                                         {idx > 1 && checkpointinfo.enable_addOptns ?
//                                                             <div>
//                                                                 <button className="btn btn-danger btn-block btn-sm" onClick={() => deleteOption(idx)}>Delete this Option</button>
//                                                             </div>
//                                                             : null
//                                                         }
//                                                     </div>
//                                                 </div>
//                                                 {data.show_config ?
//                                                     <div>

//                                                         <div style={{ display: 'flex', flexDirection: 'row', gap: 5, borderBottom: '1px solid #f0f0f0', paddingBottom: 5, marginTop: 10 }} >

//                                                             <div className='col-6'>

//                                                                 <div style={{ display: 'flex', flexDirection: 'column', }} >

//                                                                     <div
//                                                                         className="form-check form-switch form-switch-sm bg-light  py-1"
//                                                                         style={{
//                                                                             display: 'flex', flexDirection: 'row', marginBottom: 5, borderRadius: 10, justifyContent: "center"
//                                                                         }}
//                                                                     >

//                                                                         <Input
//                                                                             type="checkbox"
//                                                                             className="form-check-input me-2"
//                                                                             id={"photo" + idx}
//                                                                             onClick={(e) => onChangePhotoReq(e, data)}
//                                                                             checked={data.enable_img}
//                                                                         />
//                                                                         <label
//                                                                             className={data.enable_img ? "form-check-label text-primary" : "form-check-label text-Dark"}
//                                                                             htmlFor={"photo" + idx}
//                                                                         >
//                                                                             Photos
//                                                                         </label>
//                                                                     </div>
//                                                                     {
//                                                                         data.enable_img ?
//                                                                             <div style={{ display: 'flex', flexDirection: 'column', }} >
//                                                                                 <div className="row m-0 " >

//                                                                                     <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, borderRadius: 10, justifyContent: "center", alignItems: "center" }} className='bg-light py-2'>
//                                                                                         <div style={{ display: 'flex', flexDirection: 'row', }}>
//                                                                                             <div className="form-check form-check-primary me-2" >
//                                                                                                 <input
//                                                                                                     type="checkbox"
//                                                                                                     className="form-check-input"
//                                                                                                     id={"videocam" + idx}
//                                                                                                     checked={data.enable_photos_cam}
//                                                                                                     // onClick={(e) => { data.enable_cam = e.target.checked;setRefresh(true)  }}
//                                                                                                     onClick={(e) => enableCamOrGallery(e, data, 'camera', 'photos')}
//                                                                                                     data-validate={{ required: { value: data.enable_img } }}
//                                                                                                 />
//                                                                                                 <label
//                                                                                                     className="form-check-label"
//                                                                                                     htmlFor={"videocam" + idx}
//                                                                                                 >
//                                                                                                     Camera
//                                                                                                 </label>
//                                                                                             </div>
//                                                                                             <div className="form-check form-check-primary">
//                                                                                                 <input
//                                                                                                     type="checkbox"
//                                                                                                     className="form-check-input"
//                                                                                                     id={"videogal" + idx}
//                                                                                                     checked={data.enable_photos_gallery}
//                                                                                                     // onClick={(e) => { data.enable_gallery = e.target.checked;setRefresh(true)  }}
//                                                                                                     onClick={(e) => enableCamOrGallery(e, data, 'gallery', 'photos')}
//                                                                                                 />
//                                                                                                 <label
//                                                                                                     className="form-check-label"
//                                                                                                     htmlFor={"videogal" + idx}
//                                                                                                 >
//                                                                                                     Gallery
//                                                                                                 </label>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                         {data.enable_img && (!data.enable_gallery && !data.enable_cam) ? <div style={{ marginLeft: 7 }} >
//                                                                                             <span className="font-size-10 text-danger" style={{ lineHeight: 1, }}>Select any one </span>
//                                                                                         </div> : null}
//                                                                                     </div>
//                                                                                     {
//                                                                                         (data.enable_gallery || data.enable_cam) &&
//                                                                                         <div className='bg-light py-2 d-flex justify-content-center ' style={{ marginBottom: 5, borderRadius: 10, }} >
//                                                                                             <div className='form-floating' style={{ width: "100%" }}>
//                                                                                                 <input
//                                                                                                     className='form-control'
//                                                                                                     name={"iCount" + idx}
//                                                                                                     type="number"
//                                                                                                     id="numberOfImages"

//                                                                                                     value={data.no_of_img}
//                                                                                                     min={1}
//                                                                                                     max={props.edit ? config_data.max_photos : configData.max_photos}
//                                                                                                     onChange={(e) => { checkpointinfo.checkpoint_options[idx].no_of_img = parseInt(e.target.value); setRefresh(true) }}

//                                                                                                 />
//                                                                                                 <label htmlFor="numberOfImages" >No. of Photos</label>
//                                                                                             </div>


//                                                                                         </div>
//                                                                                     }
//                                                                                     {
//                                                                                         checkpointinfo.checkpoint_options[idx].no_of_img > configData?.max_photos &&
//                                                                                         <div className='col text-danger' style={{ fontSize: "smaller" }}>
//                                                                                             Maximum No.of.photos Allowed is {Number(configData?.max_photos)}
//                                                                                         </div>
//                                                                                     }
//                                                                                 </div>

//                                                                             </div> : null
//                                                                     }


//                                                                 </div>
//                                                             </div>

//                                                             <div className="col-6">
//                                                                 <div style={{ display: 'flex', flexDirection: 'column', }} >
//                                                                     <div
//                                                                         className="form-check form-switch form-switch-sm bg-light  py-1"
//                                                                         style={{
//                                                                             display: 'flex', flexDirection: 'row', marginBottom: 5, borderRadius: 10, justifyContent: "center"
//                                                                         }}
//                                                                     >
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             className="form-check-input me-2"
//                                                                             id={"video" + idx}
//                                                                             onClick={(e) => onChangeVideoReq(e, data)}
//                                                                             checked={data.enable_video}
//                                                                         />
//                                                                         <label
//                                                                             className={data.enable_video ? "form-check-label text-primary" : "form-check-label text-Dark"}
//                                                                             htmlFor={"video" + idx}
//                                                                         >
//                                                                             Videos
//                                                                         </label>
//                                                                     </div>
//                                                                     {
//                                                                         data.enable_video ?
//                                                                             <div style={{ display: 'flex', flexDirection: 'column', }}>

//                                                                                 <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, borderRadius: 10, justifyContent: "center", alignItems: "center" }} className='bg-light py-2'>
//                                                                                     <div style={{ display: 'flex', flexDirection: 'row' }}>
//                                                                                         <div className="form-check form-check-primary me-2" >
//                                                                                             <input
//                                                                                                 type="checkbox"
//                                                                                                 className="form-check-input"
//                                                                                                 id={"cam" + idx}
//                                                                                                 checked={data.enable_videos_cam}
//                                                                                                 // onClick={(e) => { data.enable_video_cam = e.target.checked; setRefresh(true)  }}
//                                                                                                 onClick={(e) => enableCamOrGallery(e, data, 'camera', 'videos')}
//                                                                                                 data-validate={{ required: { value: data.enable_video } }}
//                                                                                             />
//                                                                                             <label
//                                                                                                 className="form-check-label"
//                                                                                                 htmlFor={"cam" + idx}
//                                                                                             >
//                                                                                                 Camera
//                                                                                             </label>
//                                                                                         </div>
//                                                                                         <div className="form-check form-check-primary">
//                                                                                             <input
//                                                                                                 type="checkbox"
//                                                                                                 className="form-check-input"
//                                                                                                 id={"gal" + idx}
//                                                                                                 checked={data.enable_videos_gallery}
//                                                                                                 // onClick={(e) => { data.enable_video_gallery = e.target.checked; setRefresh(true)  }}
//                                                                                                 onClick={(e) => enableCamOrGallery(e, data, 'gallery', 'videos')}
//                                                                                             />
//                                                                                             <label
//                                                                                                 className="form-check-label"
//                                                                                                 htmlFor={"gal" + idx}
//                                                                                             >
//                                                                                                 Gallery
//                                                                                             </label>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                     {data.enable_video && (!data.enable_video_gallery && !data.enable_video_cam) ? <div style={{ marginLeft: 7 }} >
//                                                                                         <span className="font-size-10 text-danger" style={{ lineHeight: 1, }}>Select any one </span>
//                                                                                     </div> : null}
//                                                                                 </div>
//                                                                                 {data.enable_video && (data.enable_video_gallery || data.enable_video_cam) &&
//                                                                                     <div className='bg-light p-2 d-flex flex-row' style={{ marginBottom: 5, borderRadius: 10, }} >
//                                                                                         <div className='form-floating me-2' style={{ width: "48%" }}>
//                                                                                             <input
//                                                                                                 name={"iCount" + idx}
//                                                                                                 type="number"
//                                                                                                 id="noOfVideos"
//                                                                                                 className='form-control w-100'
//                                                                                                 value={data.no_of_video === undefined || data.no_of_video === null ? 1 : data.no_of_video}
//                                                                                                 style={{ width: 80, }}
//                                                                                                 min={1}
//                                                                                                 max={props.edit ? config_data.max_photos : configData.max_photos}
//                                                                                                 onChange={(e) => {
//                                                                                                     checkpointinfo.checkpoint_options[idx].no_of_video = parseInt(e.target.value);
//                                                                                                     setRefresh(true)
//                                                                                                 }}

//                                                                                             />
//                                                                                             <label htmlFor='noOfVideos' >No. of Videos</label>
//                                                                                         </div>
//                                                                                         {
//                                                                                             checkpointinfo.checkpoint_options[idx].no_of_video > Number(configData?.max_photos) &&
//                                                                                             <div className='text-danger' style={{ fontSize: "smaller" }}>
//                                                                                                 Maximum video Allowed is {Number(configData.max_photos)}
//                                                                                             </div>
//                                                                                         }
//                                                                                         <div className='form-floating' style={{ width: "48%" }}>

//                                                                                             <input
//                                                                                                 name={"iCount" + idx}
//                                                                                                 type="number"
//                                                                                                 className='form-control w-100'
//                                                                                                 id="videoDuration"
//                                                                                                 value={data.default_video_duration}
//                                                                                                 style={{ width: 80, }}
//                                                                                                 min={1}
//                                                                                                 max={props.edit ? Number(config_data.max_video_duration) : Number(maxVideoDuration)}
//                                                                                                 onChange={(e) => {
//                                                                                                     checkpointinfo.checkpoint_options[idx].default_video_duration = parseInt(e.target.value);
//                                                                                                     setRefresh(true)
//                                                                                                 }}

//                                                                                             />
//                                                                                             <label htmlFor='videoDuration' >Duration(Minutes)</label>
//                                                                                         </div>

//                                                                                         {
//                                                                                             checkpointinfo.checkpoint_options[idx].default_video_duration > Number(maxVideoDuration) &&
//                                                                                             <div className='text-danger' style={{ fontSize: "smaller" }}>
//                                                                                                 Maximum video Duration Allowed is {Number(maxVideoDuration)}
//                                                                                             </div>
//                                                                                         }
//                                                                                     </div>
//                                                                                 }

//                                                                             </div> : null}
//                                                                 </div>
//                                                             </div>

//                                                         </div>

//                                                         {/* --------------------- */}
//                                                         <div style={{ display: 'flex', flexDirection: 'row', gap: 5, borderBottom: '1px solid #f0f0f0', paddingBottom: 5, marginTop: 10 }} >

//                                                             <div className='col-6'>
//                                                                 <div style={{ display: 'flex', flexDirection: 'column', }} >

//                                                                     <div
//                                                                         className="form-check form-switch form-switch-sm bg-light  py-1"
//                                                                         style={{
//                                                                             display: 'flex', flexDirection: 'row', marginBottom: 5, borderRadius: 10, justifyContent: "center"
//                                                                         }}
//                                                                     >
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             className="form-check-input me-2"
//                                                                             id={"score" + idx}
//                                                                             onClick={(e) => { onChangeScoreReq(e, data) }}
//                                                                             checked={data.enable_score}
//                                                                         />
//                                                                         <label
//                                                                             className={data.enable_score ? "form-check-label text-primary" : "form-check-label text-Dark"}
//                                                                             htmlFor={"score" + idx}
//                                                                         >
//                                                                             Score
//                                                                         </label>
//                                                                     </div>
//                                                                     {
//                                                                         data.enable_score ?
//                                                                             <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, borderRadius: 10, justifyContent: "center", alignItems: "center" }} className='bg-light py-2'>
//                                                                                 <div className='form-floating'>

//                                                                                     <input
//                                                                                         name={"iscore" + idx}
//                                                                                         type="number"
//                                                                                         id="scoreValue"
//                                                                                         className="form-control"
//                                                                                         value={data.score}
//                                                                                         max={props.edit ? config_data.max_score_value : configData.max_score_value}
//                                                                                         onChange={(e) => {

//                                                                                             console.log('e.target.value', e.target.value)
//                                                                                             data.score = e.target.value;
//                                                                                             // checkpointinfo.checkpoint_options[idx].score = e.target.value;
//                                                                                             setRefresh(true)

//                                                                                         }}
//                                                                                         onKeyDown={(e) => { handleKeypress(e) }}
//                                                                                         required
//                                                                                     />
//                                                                                     <label htmlFor='scoreValue'>Value</label>
//                                                                                 </div>

//                                                                                 {/* {
//                                                                                     <div className='text-danger'>{errorMessage}</div>
//                                                                                 } */}


//                                                                             </div> : null

//                                                                     }

//                                                                 </div>
//                                                             </div>

//                                                             <div className='col-6'>
//                                                                 <div style={{ display: 'flex', flexDirection: 'column', }}>
//                                                                     <div
//                                                                         className="form-check form-switch form-switch-sm bg-light  py-1"
//                                                                         style={{
//                                                                             display: 'flex', flexDirection: 'row', marginBottom: 5, borderRadius: 10, justifyContent: "center"
//                                                                         }}
//                                                                     >
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             className="form-check-input me-2"
//                                                                             id={"nc" + idx}
//                                                                             onClick={(e) => { onChangeActionReq(e, data) }}
//                                                                             checked={data.enable_nc}
//                                                                         />
//                                                                         <div style={{ display: 'flex', flexDirection: 'column' }}>
//                                                                             <label
//                                                                                 className={data.enable_nc ? "form-check-label text-primary" : "form-check-label text-Dark"}
//                                                                                 htmlFor={"nc" + idx}
//                                                                             >
//                                                                                 CAPA <span className="font-size-10" style={{ lineHeight: 1 }}>Corrective and Preventive Actions</span>
//                                                                             </label>

//                                                                         </div>
//                                                                     </div>
//                                                                     {
//                                                                         data.enable_nc ?
//                                                                             <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, borderRadius: 10, justifyContent: "center", alignItems: "center" }} className='bg-light py-2'>
//                                                                                 <div className="form-check form-check-primary " >
//                                                                                     <input
//                                                                                         type="checkbox"
//                                                                                         className="form-check-input "
//                                                                                         id={"ncm" + idx}
//                                                                                         checked={data.nc_mandatory}
//                                                                                         onClick={(e) => {
//                                                                                             data.nc_mandatory = data.nc_mandatory === true ? false : true ;
//                                                                                             setRefresh(true);
//                                                                                         }}
//                                                                                     />
//                                                                                     <label
//                                                                                         className="form-check-label"
//                                                                                         htmlFor={"ncm" + idx}
//                                                                                     >
//                                                                                         Mandatory
//                                                                                     </label>
//                                                                                 </div>
//                                                                             </div> : null
//                                                                     }

//                                                                 </div>

//                                                             </div>

//                                                         </div>

//                                                         {/* --------------------- */}
//                                                         <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f0f0f0', paddingBottom: 10, marginTop: 10 }} >
//                                                             <div className="" style={{}}>
//                                                                 <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
//                                                                     <div
//                                                                         className="form-check form-switch form-switch-sm"
//                                                                         style={{
//                                                                             display: 'flex', flexDirection: 'row', alignItems: 'center',
//                                                                             paddingRight: 15, borderRight: '1px solid #f0f0f0', height: 36, width: "25%"
//                                                                         }}
//                                                                     >
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             className="form-check-input me-2"
//                                                                             id={"doc" + idx}
//                                                                             onChange={(e) => { onChangeDocReq(e, data) }}

//                                                                             checked={data.enable_doc}
//                                                                         />
//                                                                         <label
//                                                                             className={data.enable_doc ? "form-check-label text-primary" : "form-check-label text-Dark"}
//                                                                             style={{ margin: 0 }}
//                                                                             htmlFor={"doc" + idx}
//                                                                         >Documents
//                                                                         </label>
//                                                                     </div>
//                                                                     {
//                                                                         data.enable_doc ?
//                                                                             <div
//                                                                                 style={{ width: "75%", flexDirection: 'row', paddingRight: 15, borderRight: '1px solid #f0f0f0', }}
//                                                                             >

//                                                                                 <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 7 }}>
//                                                                                     <TagsInput
//                                                                                         value={data.documents}
//                                                                                         onChange={(e) => handleChange(e, data)}
//                                                                                         className={data.documents.length === 0 ? `${"form-control react-tagsinput-false bg-white"}` : `${"form-control react-tagsinput-true bg-white"}`}
//                                                                                         inputProps={
//                                                                                             {
//                                                                                                 style: { width: "100%" },
//                                                                                                 placeholder: 'Input document name and hit enter'
//                                                                                             }
//                                                                                         }
//                                                                                         maxTags={props.edit ? config_data.max_documents : configData.max_documents}
//                                                                                     />
//                                                                                     {data.documents.length == 0 ? <div  >
//                                                                                         <span className="font-size-10 text-danger" style={{ lineHeight: 1, }}>Enter minimum one document name</span>
//                                                                                     </div> :
//                                                                                         null}

//                                                                                     {
//                                                                                         data.documents.length === (props.edit ? config_data.max_documents : configData.max_documents) ?
//                                                                                             <div  >
//                                                                                                 <span className="font-size-10 text-danger" style={{ lineHeight: 1, }}>exceeded maximum alloted document {props.edit ? config_data.max_documents : configData.max_documents}</span>
//                                                                                             </div> :
//                                                                                             null
//                                                                                     }
//                                                                                 </div>
//                                                                             </div> : null
//                                                                     }

//                                                                 </div>
//                                                             </div>
//                                                         </div>



//                                                     </div> : null}
//                                             </div>
//                                         </Col>
//                                     )
//                                 }
//                                 )
//                             }
//                         </Row>
//                     </div>
//                 </div>

//             </div>

//         </div>
//     )





// }

// export default YesorNo