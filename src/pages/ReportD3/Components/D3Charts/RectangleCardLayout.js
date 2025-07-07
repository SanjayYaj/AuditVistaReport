import urlSocket from '../../../../helpers/urlSocket';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { retriveCardChartValue, toggleProcessingState, updateLayoutInfo } from '../../../../Slice/reportd3/reportslice';
import { Label } from 'reactstrap';

const RectangleCardLayout = (props) => {

    const dispatch = useDispatch();


    var chart_data = props.chart_data
    var dataRetreived = props.itemInfo
    var id = props.id

    const [data, setData] = useState();
    const [chartsLoad, setChartsLoad] = useState(true)

    const [processing, setProcessing] = useState(false)
    const [nodeEnabled, setNodeEnabled] = useState(true)

    const reportSlice = useSelector(state => state.reportSliceReducer)
    const ProcessedID = reportSlice.processingData[props.id]


    const AuthSlice = useSelector(state => state.auth);
    const dbInfo = AuthSlice.db_info




console.log('dataRetreived card :>> ', dataRetreived , AuthSlice , dbInfo);






    useEffect(() => {
        console.log("ProcessedID Cardd", ProcessedID, id, dataRetreived);
        if (ProcessedID === undefined) {
            if (dataRetreived?.x_axis_key !== undefined && dataRetreived.data === undefined || dataRetreived.chnaged === true) {
                setProcessing(true)
                setChartsLoad(false)
                dispatch(toggleProcessingState(id))
                LoadedData(dataRetreived.x_axis_key, '1')
            }
            // else if (dataRetreived?.filtered_data !== undefined) {
            //     setData(dataRetreived?.filtered_data)
            //     setChartsLoad(true)
            // } else {
            //     setData(dataRetreived.data)
            //     setChartsLoad(true)
            // }
        }

        // if (ProcessedID) {
        //     if (dataRetreived?.filtered_data !== undefined) {
        //         setData(dataRetreived?.filtered_data)
        //         setChartsLoad(true)
        //     }
        //     else if (reportSlice.layoutInfo[props.indexes]?.configured && dataRetreived.data?.[0] !== undefined) {
        //         setData(dataRetreived.data)
        //         setChartsLoad(true)
        //     }
        //     else {
        //         setData(dataRetreived.data)
        //         setChartsLoad(true)
        //     }

        // }
    }, [props, dataRetreived])






    const LoadedData = async (value, mode, indx) => {
        try {
            console.log("Card layout Card" , dataRetreived, value, mode, indx);
            if (dataRetreived.selected_cln_name !== undefined) {
                const data = {
                    selected_cln_name: {selectedCollection :dataRetreived.selected_cln_name[0]},
                    selected_primary_key: value,
                    selected_primary_value: {},
                    fieldName: value,
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    db_name: dbInfo.db_name,
                    prefrd_calc: dataRetreived.prefrd_calc,
                    // startDate: reportSlice.startDate,
                    // endDate: reportSlice.endDate,
                    // dateFields: AuthSlice?.dateRangeField

                }
                console.log(' Card Requested data card :>> ', data);

                const responseData = await urlSocket.post("report/retrive-card-chart-value", data)
                console.log('responseData 1086 Card:>> ', responseData);

                console.log('object :>> ', responseData.data.data);
                // dispatch(retriveCardChartValue(data, clone_lay, selectedCalc, db_data, updating_layObj, cln_name))
                var CardData = responseData.data.data

                if (CardData.length > 0) {
                    console.log('CardData :>> ', CardData);
                    console.log('dataRetreived :>> ', dataRetreived);
                    console.log('`${dataRetreived.prefrd_calc.value}` :>> ', `${dataRetreived.prefrd_calc.name}`);
                    var ProjectData = CardData[0][`${dataRetreived.prefrd_calc.name}`]
                    console.log('ProjectData :>> ', ProjectData);
                    setData(ProjectData)



                    if (dataRetreived.decimal_count !== undefined) {
                        var decimalCount = handleDecimalPlacesChange(dataRetreived.decimal_count, ProjectData)
                        console.log('decimalCount :>> ', decimalCount);
                    }
                    setChartsLoad(true)
                }
                else {
                    setData("0 ( No data found )")
                    setChartsLoad(true)
                }





                var updating_layObj = { ...dataRetreived };

                updating_layObj.data = CardData;
                updating_layObj.chnaged = false
                updating_layObj.configured = true

                // updating_layObj.decimal_count = 
                updating_layObj.count = decimalCount

                updating_layObj.originalvalue = ProjectData


                // Dispatch to Redux
                await dispatch(
                    updateLayoutInfo({
                        index: props.indexes,
                        updatedObject: updating_layObj,
                    })
                )

            }
        } catch (error) {
            console.log("err", error);
        }
    }





    const handleDecimalPlacesChange = (val, ProjectData) => {
        console.log("event.target.value", val, "cardDatavalue", ProjectData)
        const value = parseInt(val, 10);
        const formatted = formatDecimal(ProjectData, value);
        console.log('formatted :>> ', formatted);
        return formatted
        // updating_layObj.count = formatted;
        // updating_layObj.decimal_count = value;
        // dispatch(updateLayoutInfo(clone_lay));
        // dispatch(updateLayoutData(clone_lay, db_data));
    };


    const formatDecimal = (value, places) => {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
            return parsedValue.toFixed(places);
        }
        return "";
    };

    return (
        <div>



            {/* {

            chartsLoad ?  <div className="Dotloader"></div> 

                : */}
            <div className="mini-stats-wid" style={{ marginTop: '65px' }}>
                <div>
                    <div className="d-flex p-3" style={{ boxShadow: 'none' }}>
                        <div className="flex-grow-1 ml-3" style={{ boxShadow: 'none', marginLeft: '16px' }}>
                            <p className=" "
                                // style={getStyle(item, '1')}
                                style={{ fontSize: '24px', color: 'red', fontWeight: 'bold' }}
                            >
                                {/* {item.text?.toUpperCase()} */}
                                {/* {dataRetreived?.prefrd_calc?.val !== undefined ? (`${dataRetreived?.prefrd_calc?.val} of ${dataRetreived?.x_axis_key?.name}`) : "Label"} */}
                                {
                                    !chartsLoad ? (
                                        <div style={{ height: "34px" }}>
                                            <div className="Dotloader"></div>
                                        </div>
                                    ) : (
                                        <Label style={{
                                            fontSize: dataRetreived?.value_fontsize + "px",
                                            fontWeight: dataRetreived?.value_bold ? "bold" : "normal",
                                            fontStyle: dataRetreived?.value_italic ? "italic" : "normal",
                                            textDecoration: dataRetreived?.value_underline ? "underline" : "none",
                                            color: dataRetreived?.value_fontColor?.trim() ? dataRetreived.value_fontColor : 'black'
                                        }}>{dataRetreived?.count ?? data ?? 9000}</Label>
                                    )
                                }

                            </p>
                            {/* <h6 className="text-muted  fs-4"> */}




                            {
                                (dataRetreived?.label_fontsize ||
                                    dataRetreived.label_bold ||
                                    dataRetreived.label_italic ||
                                    dataRetreived.label_underline ||
                                    dataRetreived.label_fontColor) ?

                                    <Label
                                        style={{
                                            fontSize: dataRetreived.label_fontsize + "px",
                                            fontWeight: dataRetreived.label_bold ? "bold" : "normal",
                                            fontStyle: dataRetreived.label_italic ? "italic" : "normal",
                                            textDecoration: dataRetreived.label_underline ? "underline" : "none",
                                            color: dataRetreived.label_fontColor?.trim() ? dataRetreived.label_fontColor : 'black'

                                        }}
                                    >
                                        {(dataRetreived?.text !== undefined && dataRetreived?.text.trim() !== "") ? dataRetreived.text?.toUpperCase() : dataRetreived?.prefrd_calc?.val !== undefined ? (`${dataRetreived?.prefrd_calc?.val} of ${dataRetreived?.x_axis_key?.name}`.toUpperCase()) : "Label"}

                                    </Label>
                                    :
                                    <h6 className="text-muted  fs-4">
                                        {(dataRetreived?.text !== undefined && dataRetreived?.text.trim() !== "") ? dataRetreived.text?.toUpperCase() : dataRetreived?.prefrd_calc?.val !== undefined ? (`${dataRetreived?.prefrd_calc?.val} of ${dataRetreived?.x_axis_key?.name}`.toUpperCase()) : "Label"}

                                    </h6>



                            }


                            {/* </h6> */}
                        </div>
                        <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                                <i className={"bx bx-copy-alt font-size-24"} ></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* } */}






        </div>
    );
};

export default RectangleCardLayout;