import React, { useEffect, useState } from 'react'
import { Row, Col, Label, Input } from "reactstrap";
import { AvField } from "availity-reactstrap-validation";
import { HexColorPicker } from 'react-colorful';
import ManageOperatorInput from './ManageOperatorInput';
import ManageCheckpointConfigSection from './ManageCheckpointConfigSection';

const YesorNo = (props) => {
    const { updateState, enable_validation, checkpointinfo, config_data , submitProcess} = props

    console.log("checkpointinfo",checkpointinfo)

    const [compliance, setComplaince] = useState([])
    const [checkpointInfo, setcheckpointInfo] = useState(null)
    const [dataLoaded, setdataLoaded] = useState(false)
    const [operatorValues, setOperatorValues] = useState({});
    const [operatorList, setOperatorList] = useState([])
    const [visiblePickers, setVisiblePickers] = useState({});

    const dec_digit_count = config_data.dec_digit_count


    useEffect(() => {
        setComplaince(config_data.compliance);
        setOperatorList(config_data.operators_list);
        if (checkpointinfo?.options && !checkpointinfo.rule) {
            const updated = _.cloneDeep(checkpointinfo);
            // updated.rule = updated.options.map(opt => ({ option_text: opt.option_text, id: opt.id, show_config: true }));
           
            updated.rule = updated.options.map(opt => ({
                option_text: opt.option_text,
                id: opt.id,
                show_config: true,
                image_info: { camera: false, gallery: false, max: 0, min: 0 },
                video_info: { camera: false, gallery: false, max: 0, min: 0, duration:30 },
                capa_info : { enable_capa: false, mandatory: false },
                document_info:[],
                images:[],
                videos:[],
                documents:[],
            }));
            setcheckpointInfo(updated);
        } else {
            setcheckpointInfo(checkpointinfo);
        }
        setdataLoaded(true);
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
        var updtCheckpointInfo = _.cloneDeep(checkpointInfo)
        updtCheckpointInfo.rule[idx]["show_config"] = e.target.checked
        setcheckpointInfo(updtCheckpointInfo)
        updateState(checkpointinfo)
    }

    const addOptions = () => {
        var updtCheckpointInfo = _.cloneDeep(checkpointInfo)
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
        checkpointInfo.rule.splice(id, 1)
        setcheckpointInfo(checkpointInfo)
        updateState(checkpointInfo)
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
        const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);
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
        const updated = _.cloneDeep(checkpointInfo);
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

        const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);

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

                    {
                        console.log("checkpointInfo",checkpointInfo)
                    }
                    <div className="btn-group-vertical " role="group" aria-label="Basic radio toggle button group">
                        <Row>
                            {
                                checkpointInfo?.rule?.map((data, idx) => {
                                    return (
                                        <Col md={12} key={idx} >
                                                <div style={{ display: 'flex', flexDirection: 'column', padding: 15, borderRadius: 8, borderColor: checkpointInfo.rule[idx]?.color || Colors[0], borderWidth: '2px', borderStyle: 'solid', borderRadius: '4px', padding: '1rem', marginBottom: '1%' }}>
                                                <div className="position-relative" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 3 }}>
                                                    <AvField name={"option " + idx + 1} type="text" value={data.option_text} disabled={!checkpointinfo.enable_addOptns} placeholder="Enter Option..."
                                                        onChange={(e) => { updateRuleField(idx, 'option_text', e.target.value); }}
                                                        className={checkpointinfo.enable_addOptns ? "mb-2 form-control" : "mb-2 form-control chat-input"}
                                                        validate={{ required: { value: props.submitProcess && data.option_text == "" ? true : false } }}
                                                    />
                                                </div>


                                                {checkpointInfo.enable_operator ?
                                                    <ManageOperatorInput
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
                                                                 <Input type="number" placeholder="Enter Score" step={`0.${'0'.repeat(dec_digit_count - 1)}1`} value={checkpointInfo.rule?.[idx]?.score || ''} onChange={(e) => { const value = e.target.value; const regex = new RegExp(`^\\d*\\.?\\d{0,${dec_digit_count}}$`); if (value === '' || regex.test(value)) { onScoreChange(e, idx, 'score') }}} />
                                                                {/* <Input type="number" placeholder="Enter Score" step="0.01" min="0" value={checkpointInfo.rule?.[idx]?.score || ''} onChange={(e) => { const value = e.target.value; if (/^\d*\.?\d{0,2}$/.test(value)) { onScoreChange(e, idx, 'score') } }} /> */}
                                                            </div>

                                                            {enable_validation ? (
                                                                <div className="col-md-6 ">
                                                                    <Label className="mb-2">Compliance</Label>
                                                                    <Input type="select" value={checkpointInfo.rule?.[idx]?.compliance?.id || ''} onChange={(e) => handleComplianceChange(e, idx, data)} >
                                                                        <option value="" disabled>Select Compliance</option>
                                                                        {compliance.map((item) => (
                                                                            <option key={item.id} value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </Input>
                                                                     {submitProcess && checkpointInfo?.rule[idx]?.compliance === undefined && ( <small className="text-danger">Compliance is required</small> )}
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
                                                                <div key={index} onClick={() => handleColorChange(idx, 'color', colorItem)} style={{ backgroundColor: colorItem, width: '20px', height: '20px', margin: '5px', borderRadius: '5px', cursor: 'pointer', border: checkpointInfo.rule?.[idx]?.color === colorItem ? '2px solid black' : 'none', }} />
                                                            ))}

                                                            <div onClick={() => togglePickerVisibility(idx)} style={{ width: '20px', height: '20px', margin: '5px', borderRadius: '5px', border: '1px dashed gray', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', color: '#555' }} >
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
                                                    <ManageCheckpointConfigSection idx={idx} data={data} checkpointInfo={checkpointInfo} updateRuleField={updateRuleField}  submitProcess={submitProcess}/>
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



