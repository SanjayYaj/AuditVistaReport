import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Label } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { setvalueErrors } from 'toolkitStore/Auditvista/treeSlice';


const OperatorInput = ({
    index,
    operator_info,
    operatorList,
    requiresTwoValues,
    onOperatorChange,
    onValueChange,
    compliance,
    onComplianceChange,
    checkpointInfo,
    onScoreChange,
    submitProcess
}) => {
    const config = {
        max_digits: checkpointInfo?.max_digits || 0,
        max_decimal: checkpointInfo?.max_decimal || 1,
        allowNegative: checkpointInfo?.both_case || checkpointInfo?.only_negative || false,
        onlyNegative: checkpointInfo?.only_negative || false
    };

    const [operatorSelected, setOperatorSelected] = useState(false);
    const [valueErrors, setValueErrors] = useState({});
    const selectedOperator = operator_info?.operator;
    const dispatch = useDispatch();


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



    useEffect(() => {
        if (selectedOperator !== undefined) {
            setOperatorSelected(true);
        }
    }, []);

    const getInputProps = (fieldName) => {
        const step = config.max_decimal > 0 ? Math.pow(10, -config.max_decimal) : 1;

        return {
            type: 'number',
            inputMode: config.max_decimal > 0 ? 'decimal' : 'numeric',
            step,
            onChange: (e) => {
                let value = e.target.value;

                if (value === '-' || value === '.' || (config.allowNegative && value === '-.')) {
                    onValueChange({ target: { value } }, index, fieldName);
                    return;
                }

                value = value.replace(/[^0-9.-]/g, '');

                if (config.allowNegative) {
                    const minusMatch = value.match(/-/g);
                    if (minusMatch?.length > 1 || (value.includes('-') && !value.startsWith('-'))) {
                        value = '-' + value.replace(/-/g, '');
                    }
                } else {
                    value = value.replace(/-/g, '');
                }

                const dotMatch = value.match(/\./g);
                if (dotMatch?.length > 1) {
                    const [first, ...rest] = value.split('.');
                    value = first + '.' + rest.join('');
                }

                const [intPartRaw, decPartRaw] = value.split('.');
                let intPart = intPartRaw.replace('-', '').slice(0, config.max_digits);
                let decPart = decPartRaw?.slice(0, config.max_decimal) || '';
                const hasMinus = config.allowNegative && value.startsWith('-');

                value = hasMinus ? `-${intPart}` : intPart;
                if (config.max_decimal > 0 && value !== '-' && decPartRaw !== undefined) {
                    value += `.${decPart}`;
                }

                const numericValue = parseFloat(value);
                if (!isNaN(numericValue)) {
                    if (!config.allowNegative && numericValue < 0) {
                        return;
                    }
                    if (config.onlyNegative && numericValue > 0) {
                        return;
                    }
                }

                onValueChange({ target: { value } }, index, fieldName);

                const fromVal = fieldName === 'from' ? value : operator_info?.from;
                const toVal = fieldName === 'to' ? value : operator_info?.to;

                let newErrors = { ...valueErrors };
                if (!newErrors[index]) newErrors[index] = {};

                if (requiresTwoValues(selectedOperator)) {
                    const fromNum = parseFloat(fromVal);
                    const toNum = parseFloat(toVal);

                    if (!isNaN(fromNum) && !isNaN(toNum) && fromNum > toNum) {
                        newErrors[index].from = 'From value must be less than or equal to To value';
                        newErrors[index].to = '';
                    } else {
                        newErrors[index].from = '';
                        newErrors[index].to = '';
                    }

                    setValueErrors(newErrors);
                    dispatch(setvalueErrors(hasAnyMediaError(newErrors)));

                }
            },
        };
    };




// const getInputProps = (fieldName) => {
//     const step = config.max_decimal > 0 ? Math.pow(10, -config.max_decimal) : 1;

//     return {
//         type: 'text', // allows better control over input
//         inputMode: 'decimal',
//         step,
//         onChange: (e) => {
//             let value = e.target.value;

//             // Immediately block if there's a '-' or comma
//             if (value.includes('-') || value.includes(',')) {
//                 return;
//             }

//             // Allow only digits and at most one dot
//             const validNumberRegex = /^\d*\.?\d*$/;
//             if (!validNumberRegex.test(value)) {
//                 return; // skip invalid format
//             }

//             // Limit integer and decimal length
//             const [intPartRaw, decPartRaw] = value.split('.');
//             const intPart = intPartRaw?.slice(0, config.max_digits);
//             const decPart = decPartRaw?.slice(0, config.max_decimal) || '';
//             value = intPart;
//             if (config.max_decimal > 0 && decPartRaw !== undefined) {
//                 value += `.${decPart}`;
//             }

//             onValueChange({ target: { value } }, index, fieldName);

//             // --- Validation: from <= to ---
//             const fromVal = fieldName === 'from' ? value : operator_info?.from;
//             const toVal = fieldName === 'to' ? value : operator_info?.to;

//             let newErrors = { ...valueErrors };
//             if (!newErrors[index]) newErrors[index] = {};

//             if (requiresTwoValues(selectedOperator)) {
//                 const fromNum = parseFloat(fromVal);
//                 const toNum = parseFloat(toVal);

//                 if (!isNaN(fromNum) && !isNaN(toNum) && fromNum > toNum) {
//                     newErrors[index].from = 'From value must be less than or equal to To value';
//                     newErrors[index].to = '';
//                 } else {
//                     newErrors[index].from = '';
//                     newErrors[index].to = '';
//                 }

//                 setValueErrors(newErrors);
//                 dispatch(setvalueErrors(hasAnyMediaError(newErrors)));
//             }
//         },
//     };
// };



    const renderInput = (fieldName) => (
        <Input
            {...getInputProps(fieldName)}
            placeholder="Value"
            value={operator_info?.[fieldName] || ''}
        />
    );

    const handleOperatorChange = (e) => {
        onOperatorChange(e, index);
        setOperatorSelected(Boolean(e.target.value));
    };

    return (
        <div>
            <Row className="my-2 align-items-center">
                <Col>
                    <Label>Operator</Label>
                    <Input
                        type="select"
                        value={selectedOperator?.id || ''}
                        onChange={handleOperatorChange}
                    // invalid={!!valueErrors[index]?.operator_info}
                    >
                        <option value="" disabled>Select Operator</option>
                        {operatorList.map((op, i) => (
                            <option key={i} value={op.id}>{op.name}</option>
                        ))}
                    </Input>
                    {submitProcess &&
                        checkpointInfo?.rule[index]?.operator_info === undefined && (
                            <small className="text-danger">Operator is required</small>
                        )}
                </Col>

                {operatorSelected && (
                    <>
                        {requiresTwoValues(selectedOperator) ? (
                            <>
                                <Col>
                                    <Label>From</Label>
                                    {renderInput('from')}
                                    {(submitProcess && !operator_info?.from) && (
                                        <div className="text-danger small mt-1">From value is required</div>
                                    )}
                                </Col>

                                <Col xs="auto" className="d-flex align-items-center justify-content-center mt-4">
                                    <Label>{selectedOperator?.modulus}</Label>
                                </Col>

                                <Col>
                                    <Label>To</Label>
                                    {renderInput('to')}
                                    {(submitProcess && !operator_info?.to) && (
                                        <div className="text-danger small mt-1">To value is required</div>
                                    )}
                                </Col>
                                {valueErrors[index]?.from && (
                                    <div className="text-danger small mt-1">{valueErrors[index].from}</div>
                                )}
                            </>
                        ) : (
                            <Col>
                                <Label>From</Label>
                                <div className="d-flex align-items-center">
                                    <span className="me-3 text-dark fs-4 ">{selectedOperator?.modulus}</span>
                                    {renderInput('from')}
                                    {(submitProcess && !operator_info?.from) && (
                                        <div className="text-danger small mt-1">Value is required</div>
                                    )}
                                </div>
                            </Col>
                        )}
                    </>
                )}
            </Row>
            <Row>
                <Col>
                    <Label>Compliance<span className="text-danger" style={{ fontSize: "smaller" }}>*</span></Label>
                    <Input
                        type="select"
                        value={checkpointInfo.rule?.[index]?.compliance?.id || ''}
                        onChange={(e) => onComplianceChange(e, index)}
                    >
                        <option value="" disabled>Select Compliance</option>
                        {compliance.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </Input>
                    {submitProcess &&
                        checkpointInfo?.rule[index]?.compliance === undefined && (
                            <small className="text-danger">Compliance is required</small>
                        )}
                </Col>


                <Col>
                    <Label>Score</Label>
                    <Input
                        type="number"
                        placeholder="Enter Score"
                        step="0.01"
                        value={checkpointInfo.rule?.[index]?.score ?? ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                onScoreChange(e, index, 'score');
                            }
                        }}
                    />
                </Col>


                {/* <Col>
                    <Label>Score</Label>
                    <Input type="number" placeholder="Enter Score" step="0.01" value={checkpointInfo.rule?.[index]?.score || ''}
                        onChange={(e) => { const value = e.target.value;
                            if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                onScoreChange(e, index, 'score');
                            }
                        }}
                    />
                </Col> */}
            </Row>
        </div>
    );
};

export default OperatorInput;








//20-may-2025-jose
// import React, { useState, useEffect } from 'react';
// import { Row, Col, Input, Label } from 'reactstrap';

// const OperatorInput = ({
//     index,
//     operator_info,
//     operatorList,
//     requiresTwoValues,
//     onOperatorChange,
//     onValueChange,
//     compliance,
//     onComplianceChange,
//     checkpointInfo,
//     onScoreChange,
//     config_data,
//     submitProcess
// }) => {
//     const config = {
//         max_digits: checkpointInfo?.max_digits || 0,
//         max_decimal: checkpointInfo?.max_decimal || 1,
//         allowNegative: checkpointInfo?.both_case || checkpointInfo?.only_negative || false,
//         onlyNegative: checkpointInfo?.only_negative || false
//     };
//     const dec_digit_count = config_data.dec_digit_count

//     const [operatorSelected, setOperatorSelected] = useState(false);
//     const selectedOperator = operator_info?.operator;

//     useEffect(() => {
//         if (selectedOperator !== undefined) {
//             setOperatorSelected(true);
//         }
//     }, []);

//     const getInputProps = (fieldName) => {
//         const step = config.max_decimal > 0 ? Math.pow(10, -config.max_decimal) : 1;

//         return {
//             type: 'number',
//             inputMode: config.max_decimal > 0 ? 'decimal' : 'numeric',
//             step,
//             onChange: (e) => {
//                 let value = e.target.value;

//                 if (value === '-' || value === '.' || (config.allowNegative && value === '-.')) {
//                     onValueChange({ target: { value } }, index, fieldName);
//                     return;
//                 }

//                 value = value.replace(/[^0-9.-]/g, '');

//                 if (config.allowNegative) {
//                     const minusMatch = value.match(/-/g);
//                     if (minusMatch?.length > 1 || (value.includes('-') && !value.startsWith('-'))) {
//                         value = '-' + value.replace(/-/g, '');
//                     }
//                 } else {
//                     value = value.replace(/-/g, '');
//                 }

//                 const dotMatch = value.match(/\./g);
//                 if (dotMatch?.length > 1) {
//                     const [first, ...rest] = value.split('.');
//                     value = first + '.' + rest.join('');
//                 }

//                 const [intPartRaw, decPartRaw] = value.split('.');
//                 let intPart = intPartRaw.replace('-', '').slice(0, config.max_digits);
//                 let decPart = decPartRaw?.slice(0, config.max_decimal) || '';
//                 const hasMinus = config.allowNegative && value.startsWith('-');

//                 value = hasMinus ? `-${intPart}` : intPart;
//                 if (config.max_decimal > 0 && value !== '-' && decPartRaw !== undefined) {
//                     value += `.${decPart}`;
//                 }

//                 const numericValue = parseFloat(value);
//                 if (!isNaN(numericValue)) {
//                     if (!config.allowNegative && numericValue < 0) {
//                         return;
//                     }
//                     if (config.onlyNegative && numericValue > 0) {
//                         return;
//                     }
//                 }

//                 onValueChange({ target: { value } }, index, fieldName);
//             },
//         };
//     };

//     const renderInput = (fieldName) => (
//         <Input
//             {...getInputProps(fieldName)}
//             placeholder="Value"
//             value={operator_info?.[fieldName] || ''}
//         />
//     );

//     const handleOperatorChange = (e) => {
//         onOperatorChange(e, index);
//         setOperatorSelected(Boolean(e.target.value));
//     };

//     return (
//         <div>
//             <Row className="my-2 align-items-center">
//                 <Col>
//                     <Label>Operator</Label>
//                     <Input type="select" value={selectedOperator?.id || ''} onChange={handleOperatorChange} >
//                         <option value="" disabled>Select Operator</option>
//                         {operatorList.map((op, i) => (
//                             <option key={i} value={op.id}>{op.name}</option>
//                         ))}
//                     </Input>
//                 </Col>

//                 {operatorSelected && (
//                     <>
//                         {requiresTwoValues(selectedOperator) ? (
//                             <>
//                                 <Col>
//                                     <Label>From</Label>
//                                     {renderInput('from')}
//                                 </Col>

//                                 <Col xs="auto" className="d-flex align-items-center justify-content-center mt-4">
//                                     <Label>{selectedOperator?.modulus}</Label>
//                                 </Col>

//                                 <Col>
//                                     <Label>To</Label>
//                                     {renderInput('to')}
//                                 </Col>
//                             </>
//                         ) : (
//                             <Col>
//                                 <Label>From</Label>
//                                 <div className="d-flex align-items-center">
//                                     <span className="me-3 text-dark fs-4 ">{selectedOperator?.modulus}</span>
//                                     {renderInput('from')}
//                                 </div>
//                             </Col>
//                         )}
//                     </>
//                 )}
//             </Row>
//             <Row>
//                 <Col>
//                     <Label>Compliance</Label>
//                     <Input type="select" value={checkpointInfo.rule?.[index]?.compliance?.id || ''} onChange={(e) => onComplianceChange(e, index)} >
//                         <option value="" disabled>Select Compliance</option>
//                         {compliance.map((item) => (
//                             <option key={item.id} value={item.id}>{item.name}</option>
//                         ))}
//                     </Input>
//                      {submitProcess && checkpointInfo?.rule[idx]?.compliance === undefined && (
//                             <small className="text-danger">Compliance is required</small>
//                         )}
//                 </Col>

//                 {/* <Col>
//                     <Label>Score</Label>
//                     <Input type="number" placeholder="Enter Score" step="0.01" value={checkpointInfo.rule?.[index]?.score || ''} onChange={(e) => { const value = e.target.value; if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) { onScoreChange(e, index, 'score'); } }} />
//                 </Col> */}
//                 <Col>
//                     <Label>Score</Label>
//                     <Input type="number" placeholder="Enter Score" step={`0.${'0'.repeat(dec_digit_count - 1)}1`} value={checkpointInfo.rule?.[index]?.score || ''} onChange={(e) => { const value = e.target.value; const regex = new RegExp(`^\\d*\\.?\\d{0,${dec_digit_count}}$`); if (value === '' || regex.test(value)) { onScoreChange(e, index, 'score') }}} />
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default OperatorInput;















//19-5-25 - Vinayagam 
// import React, { useState } from 'react';
// import { Row, Col, Input, Label } from 'reactstrap';

// const OperatorInput = ({
//     index,
//     operator_info,
//     operatorList,
//     requiresTwoValues,
//     onOperatorChange,
//     onValueChange,
//     compliance,
//     onComplianceChange,
//     config = { maxLength: 5, decimal: 3, allowNegative: true },
//     checkpointInfo,
//     onScoreChange
// }) => {
//     const [valueErrors, setValueErrors] = useState({});
//     const selectedOperator = operator_info?.operator;

//     const getInputProps = (fieldName) => {
//         const step = config.decimal > 0 ? Math.pow(10, -config.decimal) : 1;

//         return {
//             type: 'number',
//             inputMode: config.decimal > 0 ? 'decimal' : 'numeric',
//             step,
//             onChange: (e) => {
//                 let value = e.target.value;

//                 if (value === '-' || value === '.' || (config.allowNegative && value === '-.')) {
//                     onValueChange({ target: { value } }, index, fieldName);
//                     return;
//                 }

//                 value = value.replace(/[^0-9.-]/g, '');

//                 if (config.allowNegative) {
//                     const minusMatch = value.match(/-/g);
//                     if (minusMatch?.length > 1 || (value.includes('-') && !value.startsWith('-'))) {
//                         value = '-' + value.replace(/-/g, '');
//                     }
//                 } else {
//                     value = value.replace(/-/g, '');
//                 }

//                 const dotMatch = value.match(/\./g);
//                 if (dotMatch?.length > 1) {
//                     const [first, ...rest] = value.split('.');
//                     value = first + '.' + rest.join('');
//                 }

//                 const [intPartRaw, decPartRaw] = value.split('.');
//                 let intPart = intPartRaw.replace('-', '').slice(0, config.maxLength);
//                 let decPart = decPartRaw?.slice(0, config.decimal) || '';
//                 const hasMinus = config.allowNegative && value.startsWith('-');

//                 value = hasMinus ? `-${intPart}` : intPart;
//                 if (config.decimal > 0 && value !== '-' && decPartRaw !== undefined) {
//                     value += `.${decPart}`;
//                 }

//                 onValueChange({ target: { value } }, index, fieldName);

//                 const fromVal = fieldName === 'from' ? value : operator_info?.from;
//                 const toVal = fieldName === 'to' ? value : operator_info?.to;

//                 let newErrors = { ...valueErrors };
//                 if (!newErrors[index]) newErrors[index] = {};

//                 if (requiresTwoValues(selectedOperator)) {
//                     const fromNum = parseFloat(fromVal);
//                     const toNum = parseFloat(toVal);

//                     if (!isNaN(fromNum) && !isNaN(toNum) && fromNum > toNum) {
//                         newErrors[index].from = 'From value must be less than or equal to To value';
//                         newErrors[index].to = '';
//                     } else {
//                         newErrors[index].from = '';
//                         newErrors[index].to = '';
//                     }

//                     setValueErrors(newErrors);
//                 }
//             },
//         };
//     };

//     const renderInput = (fieldName) => (
//         <div>
//             <Input {...getInputProps(fieldName)} placeholder="Value" value={operator_info?.[fieldName] || ''} />
//         </div>

//     );

//     const handleOperatorChange = (e) => {
//         onOperatorChange(e, index);
//         setValueErrors((prev) => ({
//             ...prev,
//             [index]: { from: '', to: '' }
//         }));
//     };

//     return (
//         <div>
//             <Row className="my-2 align-items-center">
//                 <Col>
//                     <Label>Operator</Label>
//                     <Input type="select" value={selectedOperator?.id || ''} onChange={handleOperatorChange}>
//                         <option value="" disabled>Select Operator</option>
//                         {operatorList.map((op, i) => (
//                             <option key={i} value={op.id}>{op.name}</option>
//                         ))}
//                     </Input>
//                 </Col>

//                 {selectedOperator && (
//                     <>
//                         {requiresTwoValues(selectedOperator) ? (
//                             <>
//                                 <Col>
//                                     <Label>From</Label>
//                                     {renderInput('from')}

//                                 </Col>

//                                 <Col xs="auto" className="d-flex align-items-center justify-content-center mt-4">
//                                     <Label>{selectedOperator?.modulus}</Label>
//                                 </Col>

//                                 <Col>
//                                     <Label>To</Label>
//                                     {renderInput('to')}
//                                     {valueErrors[index]?.to && (
//                                         <div className="text-danger small mt-1">{valueErrors[index].to}</div>
//                                     )}
//                                 </Col>
//                                 {valueErrors[index]?.from && (
//                                     <div className="text-danger small mt-1">{valueErrors[index].from}</div>
//                                 )}
//                             </>
//                         ) : (
//                             <Col>
//                                 <Label>From</Label>
//                                 <div className="d-flex align-items-center">
//                                     <span className="me-3 text-dark fs-4">{selectedOperator?.modulus}</span>
//                                     {renderInput('from')}
//                                 </div>

//                             </Col>
//                         )}
//                     </>
//                 )}

//             </Row>

//             <Row>
//                 <Col>
//                     <Label>Compliance</Label>
//                     <Input type="select" value={checkpointInfo.rule?.[index]?.compliance?.id || ''} onChange={(e) => onComplianceChange(e, index)} >
//                         <option value="" disabled>Select Compliance</option>
//                         {compliance.map((item) => (
//                             <option key={item.id} value={item.id}>{item.name}</option>
//                         ))}
//                     </Input>
//                 </Col>

//                 <Col>
//                     <Label>Score</Label>
//                     <Input type="number" placeholder="Enter Score" value={checkpointInfo.rule?.[index]?.score || ''} onChange={(e) => onScoreChange(e, index, 'score')} />
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default OperatorInput;












// import React, { useState, useEffect } from 'react';
// import { Row, Col, Input, Label } from 'reactstrap';

// const OperatorInput = ({
//     index,
//     operator_info,
//     operatorList,
//     requiresTwoValues,
//     onOperatorChange,
//     onValueChange,
//     compliance,
//     onComplianceChange,
//     checkpointInfo,
//     onScoreChange,
// }) => {
//     const config = {
//         max_digits: checkpointInfo?.max_digits || 0,
//         max_decimal: checkpointInfo?.max_decimal || 1,
//         allowNegative: checkpointInfo?.both_case || checkpointInfo?.only_negative || false,
//         onlyNegative: checkpointInfo?.only_negative || false
//     };

//     const [operatorSelected, setOperatorSelected] = useState(false);
//     const selectedOperator = operator_info?.operator;

//     useEffect(() => {
//         if (selectedOperator !== undefined) {
//             setOperatorSelected(true);
//         }
//     }, []);

//     const getInputProps = (fieldName) => {
//         const step = config.max_decimal > 0 ? Math.pow(10, -config.max_decimal) : 1;

//         return {
//             type: 'number',
//             inputMode: config.max_decimal > 0 ? 'decimal' : 'numeric',
//             step,
//             onChange: (e) => {
//                 let value = e.target.value;

//                 if (value === '-' || value === '.' || (config.allowNegative && value === '-.')) {
//                     onValueChange({ target: { value } }, index, fieldName);
//                     return;
//                 }

//                 value = value.replace(/[^0-9.-]/g, '');

//                 if (config.allowNegative) {
//                     const minusMatch = value.match(/-/g);
//                     if (minusMatch?.length > 1 || (value.includes('-') && !value.startsWith('-'))) {
//                         value = '-' + value.replace(/-/g, '');
//                     }
//                 } else {
//                     value = value.replace(/-/g, '');
//                 }

//                 const dotMatch = value.match(/\./g);
//                 if (dotMatch?.length > 1) {
//                     const [first, ...rest] = value.split('.');
//                     value = first + '.' + rest.join('');
//                 }

//                 const [intPartRaw, decPartRaw] = value.split('.');
//                 let intPart = intPartRaw.replace('-', '').slice(0, config.max_digits);
//                 let decPart = decPartRaw?.slice(0, config.max_decimal) || '';
//                 const hasMinus = config.allowNegative && value.startsWith('-');

//                 value = hasMinus ? `-${intPart}` : intPart;
//                 if (config.max_decimal > 0 && value !== '-' && decPartRaw !== undefined) {
//                     value += `.${decPart}`;
//                 }

//                 const numericValue = parseFloat(value);
//                 if (!isNaN(numericValue)) {
//                     if (!config.allowNegative && numericValue < 0) {
//                         return;
//                     }
//                     if (config.onlyNegative && numericValue > 0) {
//                         return;
//                     }
//                 }

//                 onValueChange({ target: { value } }, index, fieldName);
//             },
//         };
//     };

//     const renderInput = (fieldName) => (
//         <Input
//             {...getInputProps(fieldName)}
//             placeholder="Value"
//             value={operator_info?.[fieldName] || ''}
//         />
//     );

//     const handleOperatorChange = (e) => {
//         onOperatorChange(e, index);
//         setOperatorSelected(Boolean(e.target.value));
//     };

//     return (
//         <div>
//             <Row className="my-2 align-items-center">
//                 <Col>
//                     <Label>Operator</Label>
//                     <Input
//                         type="select"
//                         value={selectedOperator?.id || ''}
//                         onChange={handleOperatorChange}
//                     >
//                         <option value="" disabled>Select Operator</option>
//                         {operatorList.map((op, i) => (
//                             <option key={i} value={op.id}>{op.name}</option>
//                         ))}
//                     </Input>
//                 </Col>

//                 {operatorSelected && (
//                     <>
//                         {requiresTwoValues(selectedOperator) ? (
//                             <>
//                                 <Col>
//                                     <Label>From</Label>
//                                     {renderInput('from')}
//                                 </Col>

//                                 <Col xs="auto" className="d-flex align-items-center justify-content-center mt-4">
//                                     <Label>{selectedOperator?.modulus}</Label>
//                                 </Col>

//                                 <Col>
//                                     <Label>To</Label>
//                                     {renderInput('to')}
//                                 </Col>
//                             </>
//                         ) : (
//                             <Col>
//                                 <Label>From</Label>
//                                 <div className="d-flex align-items-center">
//                                     <span className="me-3 text-dark fs-4 ">{selectedOperator?.modulus}</span>
//                                     {renderInput('from')}
//                                 </div>
//                             </Col>
//                         )}
//                     </>
//                 )}
//             </Row>
//             <Row>
//                 <Col>
//                     <Label>Compliance</Label>
//                     <Input
//                         type="select"
//                         value={checkpointInfo.rule?.[index]?.compliance?.id || ''}
//                         onChange={(e) => onComplianceChange(e, index)}
//                     >
//                         <option value="" disabled>Select Compliance</option>
//                         {compliance.map((item) => (
//                             <option key={item.id} value={item.id}>{item.name}</option>
//                         ))}
//                     </Input>
//                 </Col>

//                 <Col>
//                     <Label>Score</Label>
//                     <Input
//                         type="number"
//                         placeholder="Enter Score"
//                         value={checkpointInfo.rule?.[index]?.score || ''}
//                         onChange={(e) => onScoreChange(e, index, 'score')}
//                     />
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default OperatorInput;
