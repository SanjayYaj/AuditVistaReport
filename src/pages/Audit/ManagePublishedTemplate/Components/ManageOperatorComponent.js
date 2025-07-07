import React, { useState, useEffect } from 'react';
import { Row, Col, Label } from 'reactstrap';
import { Popconfirm } from 'antd';
import { HexColorPicker } from 'react-colorful';
import ManageCheckpointConfigSection from './ManageCheckpointConfigSection';
import ManageOperatorInput from './ManageOperatorInput';




const ManageOperatorComponent = (props) => {
    const { checkpointinfo, config_data, submitProcess, updateState, enable_validation } = props

    const [checkpointInfo, setcheckpointInfo] = useState(null)
    const [compliance, setComplaince] = useState([])
    const [operatorValues, setOperatorValues] = useState({});
    const [operatorList, setOperatorList] = useState([])
    const [visiblePickers, setVisiblePickers] = useState({});

    console.log("checkpointInfo",checkpointInfo)


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
        const defaultRule = {
            show_config: true,
            image_info: { camera: false, gallery: false, max: 0, min: 0 },
            video_info: { camera: false, gallery: false, max: 0, min: 0, duration: 30 },
            capa_info: { enable_capa: false, mandatory: false },
            document_info: [],
            images: [],
            videos: [],
            documents: [],
        };
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

    const handleOperatorValueChange = (e, idx, field) => {
        const { value } = e.target;

        const updatedValues = { ...operatorValues };
        updatedValues[idx] = {
            ...updatedValues[idx],
            [field]: Number(value)
        };

        setOperatorValues(updatedValues);

        const updatedCheckpointInfo = _.cloneDeep(checkpointInfo);

        if (Array.isArray(updatedCheckpointInfo.rule)) {
            const ruleItem = updatedCheckpointInfo.rule[idx] || {};
            ruleItem.operator_info = { ...ruleItem.operator_info, [field]: Number(value) };
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
                                            <ManageOperatorInput
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
                                    {console.log('data.show_config :>> ', data.show_config, enable_validation)}

                                    {data.show_config && enable_validation ?
                                        <div>
                                            <ManageCheckpointConfigSection idx={idx} data={data} checkpointInfo={checkpointInfo} updateRuleField={updateRuleField} submitProcess={submitProcess} />
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

export default ManageOperatorComponent;
