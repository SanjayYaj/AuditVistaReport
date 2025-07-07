import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "react-drawer/lib/react-drawer.css";
import Select from "react-select";
import { CompactPicker, TwitterPicker } from "react-color";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-drawer/lib/react-drawer.css";
import { Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, CardBody, Card, UncontrolledTooltip, Offcanvas, OffcanvasHeader, OffcanvasBody, Label } from "reactstrap";
import '../LayoutInfo.css'

import { toggleProcessingState, updateLayoutData,updateLayoutInfo,retriveClnKeys,retriveClnPrimaryValue,retriveCardChartValue} from '../../../Slice/reportd3/reportslice'


const SidePanel = (props) => {
  const dispatch = useDispatch();
  var isOpen = props.isOpen;
  var onClose = props.onClose;
  // var dbCollections = props.dbCollections;
  var db_data = props.db_data;
  var updateLayout = props.updateLayout;
  var show_table_function = props.show_table_function;
  var blockData = props.data;
  const [prefered_selection, setprefered_selection] = useState([
    { name: "SUM", value: "Sum" },
    { name: "AVG", value: "Average" },
    { name: "COUNT", value: "Total Count" },
    { name: "MIN", value: "Minimum" },
    { name: "MAX", value: "Maximum" },
  ]);

  // const dbInfo = {
  //   // encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@15.206.204.11:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
  //   encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@65.0.69.57:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
  //   db_name: 'hotel_surguru-beta',
  // }

    const authInfo = useSelector((state) => state.auth);
    const dbInfo = authInfo.db_info
    var cln_name = authInfo.cln_list
   

  const [selectedCalc, setSelectedCalc] = useState({});
  // const [dbInfo, setDbinfo] = useState(JSON.parse(sessionStorage.getItem("db_info")));
  const [primaryKey, setprimaryKey] = useState([]);
  const [primaryKeyYaxis, setprimaryKeyYaxis] = useState([]);
  const [primaryKeyValue, setprimaryKeyValue] = useState([]);
  const [XaxisValue, setXaxisValue] = useState([]);
  const [selectedXaxisKey, setselectedXaxisKey] = useState({});
  const [selectedYaxisKey, setselectedYaxisKey] = useState({});
  const [YaxisValue, setYaxisValue] = useState([]);
  const [selectedPrimaryKey, setselectedPrimaryKey] = useState({});
  const [selectedPrimaryValue, setselectedPrimaryValue] = useState({});
  const [seletedClnName, setseletedClnName] = useState({});
  const [xaxislabel, setxaxislabel] = useState("");
  const [yaxislabel, setyaxislabel] = useState("");
  const [addTransitiondata, setAddTransitiondata] = useState(0);
  const [numAdditionalAxes, setNumAdditionalAxes] = useState(0);
  const [colorArr, setColorArr] = useState([]);
  const [deletecard_index, setdeletecard_index] = useState(0);
  const [additionalYLabels, setAdditionalYLabels] = useState([]);
  const [yAxisArr, setYAxisArr] = useState([]);
  const [mergedArr, setmergedArr] = useState([]);
  const [combinedArr, setcombinedArr] = useState([]);
  const [yAxisarrMod, setYaxisarrMod] = useState([]);
  const [pieData, setpieData] = useState([]);
  const [cardData, setcardData] = useState([]);
  const [showMouseoverMulti, setShowMouseoverMulti] = useState(false);
  const [showMouseoverMain, setShowMouseoverMain] = useState(false);
  const [dataLoaded, setdataLoaded] = useState(false);
  const [showvalues, setshowvalues] = useState(false);
  const [showLine, setshowLine] = useState(false);
  const [showTable, setshowTable] = useState(false);
  const [show_grid_toggle, setshow_grid_toggle] = useState(false);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState("#000000");
  const [labelname_arr, setlabelname_arr] = useState([]);
  const [showSquare, setshowSquare] = useState(false);
  const [shownode, setshownode] = useState(false);
  const [showWarningCard, setshowWarningCard] = useState(false);
  const [barwidth, setBarWidth] = useState(undefined);
  const [cardFielderr, setCardFielderr] = useState([])
  const [textClrarr, setTextClrarr] = useState([]);
  const [decimalPlaces, setDecimalPlaces] = useState(2);
  const [formattedValue, setFormattedValue] = useState("");
  const [tempselectedYaxisKey, settempselectedYaxisKey] = useState({});
  const [chartName, setChartName] = useState("");
  const [decimalDigitsCount, setdecimalDigitsCount] = useState();
  const [cardDatavalue, setCardDataValue] = useState();
  const [showWarning, setShowWarning] = useState(false);
  const [preferedSelected, setpreferedSelected] = useState(false);
  const [errors, setErrors] = useState(yAxisArr?.map(() => ({ error: false })));
  const reportSlice = useSelector((state) => state.reportSliceReducer);

  const [selectedValue, setSelectedValue] = useState(props.math_calc );


  const layout =reportSlice.layoutInfo
  const report_math_operations = authInfo.report_math_operations;


  const selectCollection = async (val) => {
    try {
    await  getFieldsName(val);
    } catch (error) {
      console.log("something went wrong", error);
    }
  };

  var clone_lay = [...layout];
  var updating_layObj = { ...clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] };
  clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;

  useEffect(()=>{
    console.log('props.data.selected_cln_name :>> ', props.data.selected_cln_name);
     if(props.data.selected_cln_name !== undefined){
      selectCollection(props.data.selected_cln_name)
    }
  },[])



  useEffect(() => {
    if (blockData.x_axis_key !== undefined) {
      setSelectedValue(blockData.math_calc)

      setseletedClnName(blockData.selected_cln_name);    
      // selectPrimaryKey(blockData.selected_primary_key);
      // selectCollection(blockData.selected_cln_name);
      setselectedPrimaryKey(blockData.selected_primary_key);
      setselectedPrimaryValue(blockData.selected_primary_value);
      settempselectedYaxisKey(blockData.x_axis_key);
      setShowMouseoverMain(blockData.mouseovered);
      setxaxislabel(blockData.x_axis_label);
      setyaxislabel(blockData.y_axis_label);
      setChartName(blockData.chart_name);
      setBarWidth(blockData.barWidth)
      if (
        blockData.name === "stack_bar" ||
        blockData.name === "line_chart" ||
        blockData.name === "area_chart" ||
        blockData.name === "hor_stack" ||
        blockData.name === "Vertical_linechart"
      ) {
        setselectedXaxisKey(blockData.x_axis_key);
        setAddTransitiondata(blockData.add_transition_data !== undefined ? blockData.add_transition_data : 0);
        setNumAdditionalAxes(blockData.num_add_axes !== undefined ?  blockData.num_add_axes : 0);
        setselectedYaxisKey(blockData.y_axis_key);
        setcombinedArr(blockData.combined_arr || []);
        setYAxisArr(blockData.yAxis_arr || []);
        // setmergedArr(blockData.merged_arr || []);
        setXaxisValue(blockData.X_axis_value);
        setShowMouseoverMulti(blockData.mouseovered_type);
        setshowvalues(blockData.show_bar_values);
        setshowLine(blockData.show_Line);
        setshowSquare(blockData.show_Square);
        setshowTable(blockData.show_table);
        setshow_grid_toggle(blockData.show_Grid);
        setlabelname_arr(blockData.label_arr_data || []);
        const colorArray = (blockData?.chart_customize_clr_arr || []).map((color) =>
          color !== null ? color : generateRandomColor()
        );
        setColorArr(colorArray);
        setBarWidth(blockData.containerWidth)
        setdataLoaded(true);
      } else if (blockData.name === "rectangle_card") {
        // selectCollection(blockData.selected_cln_name);
        setselectedXaxisKey(blockData.x_axis_key);
        setXaxisValue(blockData.x_axis_key);
        selectcard_field_name(blockData.x_axis_key, "1");
        setSelectedCalc(blockData.prefrd_calc);
        setpreferedSelected(blockData.prefrd_calc ? true : false);
        setFormattedValue(blockData.count);
        setdecimalDigitsCount(blockData.decimal_count);
        setdataLoaded(true);
      } else if (blockData.name === "pie_chart") {
        setselectedPrimaryValue(blockData.selected_primary_value);
        setselectedXaxisKey(blockData.x_axis_key);
        setdataLoaded(true);
      } else if (blockData.name === "table") {
        setselectedXaxisKey(blockData.x_axis_key);
        setAddTransitiondata(blockData.add_transition_data !== undefined ? blockData.add_transition_data : 0);
        setNumAdditionalAxes(blockData.num_add_axes !== undefined ?  blockData.num_add_axes : 0);
        setselectedYaxisKey(blockData.y_axis_key);
        // setcombinedArr(blockData.combined_arr || []);
        setYAxisArr(blockData.yAxis_arr || []);
        // setmergedArr(blockData.merged_arr || []);
        setXaxisValue(blockData.X_axis_value);
        setlabelname_arr(blockData.label_arr_data !== undefined ? blockData.label_arr_data : []);
        setdataLoaded(true);
      } else {
        setselectedXaxisKey(blockData.x_axis_key);
        setselectedYaxisKey(blockData.y_axis_key);
        setseletedClnName(blockData.selected_cln_name);    
        // selectPrimaryKey(blockData.selected_primary_key);
        // selectCollection(blockData.selected_cln_name);
        setselectedPrimaryKey(blockData.selected_primary_key);
        setselectedPrimaryValue(blockData.selected_primary_value);
        setXaxisValue(blockData.X_axis_value);
        // selectXaxis(blockData.x_axis_key, "1");
        setshowvalues(blockData.show_bar_values);
        setshowTable(blockData.show_table);
        // selectXaxis(blockData.y_axis_key, "2");
        setshowLine(blockData.show_Line);
        setdataLoaded(true);
      }
    } else {
      setChartName(blockData.chart_name)
      // setseletedClnName({});
      // setselectedPrimaryKey({});
      // setselectedPrimaryValue({});
      setselectedXaxisKey("");
      setAddTransitiondata(0);
      setNumAdditionalAxes(0);
      setselectedYaxisKey({});
      setYAxisArr([]);
      setmergedArr([]);
      setcombinedArr([]);
      setXaxisValue([]);
      setshowLine(blockData?.show_Line);
      setshowSquare(blockData?.show_Square);
      setshowLine(blockData.show_Line);
      // setshowSquare(blockData.show_Square);
      setShowMouseoverMain(blockData.mouseovered);
      setdataLoaded(true);
    }
  }, [blockData]);

  // useEffect(() => {
  //   try {
  //     if (seletedClnName.cln_name !== undefined) {
  //       updating_layObj.selected_cln_name = seletedClnName;
  //       updating_layObj.selected_primary_key = selectedPrimaryKey;
  //       updating_layObj.selected_primary_value = selectedPrimaryValue;
  //       updating_layObj.x_axis_key = selectedXaxisKey;
  //       updating_layObj.y_axis_key = selectedYaxisKey;

  //       const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));

  //       clone_lay[blockIdx] = updating_layObj;

  //           dispatch(updateLayoutData(clone_lay, db_data));


  //     }
  //   } catch (error) {
  //     console.log('error :>> ', error);
  //   }
  // }, [pieData]);

  useEffect(() => {
    try {
      if (seletedClnName.cln_name !== undefined) {


       
        var updating_layObj={
          ...updating_layObj
        }
        updating_layObj.selected_cln_name = seletedClnName;
        updating_layObj.selected_primary_key = selectedPrimaryKey;
        updating_layObj.selected_primary_value = selectedPrimaryValue;
        updating_layObj.x_axis_key = selectedXaxisKey;
        updating_layObj.y_axis_key = selectedYaxisKey;
        updating_layObj.prefrd_calc = selectedCalc;
       
        const data ={
          selected_cln_name: seletedClnName,
          selected_primary_key: selectedPrimaryKey,
          selected_primary_value: selectedPrimaryValue,
          fieldName: selectedXaxisKey,
          encrypted_db_url: dbInfo.encrypted_db_url,
          db_name: dbInfo.db_name,
          prefrd_calc : selectedCalc

        }
          dispatch(retriveCardChartValue(data,clone_lay,selectedCalc,db_data , updating_layObj , cln_name))
      }
    } catch (error) {
      console.log('error :>> ', error);
    }
  }, [cardData]);

  const decimal_finder = async (value) => {
    setCardDataValue(value);
    var check = await isDecimal(value);
    if (check) {
      setFormattedValue(value);
    } else {
      const DigitsCounted = (value?.toString().split(".")[1] || "").length;
      setdecimalDigitsCount(DigitsCounted);
      setFormattedValue(value);
    }
  };

  const isDecimal = async (value) => {
    if (value !== undefined && value !== null && value !== "") {
      const stringValue = value?.toString();
      return /^\d+$/.test(stringValue);
    } else {
      return true;
    }
  };

  const getFieldsName = (value) => {
    return new Promise(async(resolve, reject) => {
      if (value !== undefined) {
        try {
       
          var response = await dispatch(retriveClnKeys(value))
              if (response.status === 200) {
                setprimaryKey(response.data.data);
                setprimaryKeyYaxis(response.data.y_keys);
                setseletedClnName(value);
                let updating_layObj_clone = { ...updating_layObj };
                updating_layObj_clone.selected_cln_name = value;
                // dispatch(updateLayoutInfo(clone_lay));
                // dispatch(updateLayoutData(clone_lay, db_data));
                resolve(response.data);
              } else {
                reject(new Error(`Request failed with status: ${response.status}`));
              }
        } catch (error) { }
      }
    });
  };

  const selectPrimaryKey = async(value) => {
    try {
      var collection_name =
        seletedClnName !== undefined && seletedClnName.cln_name !== undefined
          ? seletedClnName
          : blockData.selected_cln_name;
      if (collection_name) {
        const data ={
          collection_name: collection_name.cln_name,
          encrypted_db_url: dbInfo.encrypted_db_url,
          db_name: dbInfo.db_name,
          primary_key: value.name,
          mode: "0",
        }
        var response = await dispatch(retriveClnPrimaryValue(data))
            if (response.status === 200) {
              setprimaryKeyValue(response.data.data);
              setselectedPrimaryKey(value);
              let updating_layObj_clone = { ...updating_layObj };
              updating_layObj_clone.selected_primary_key = value;
              dispatch(updateLayoutInfo(clone_lay));
              dispatch(updateLayoutData(clone_lay, db_data));
            }
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const selectPrimaryValues = (e) => {
    setselectedPrimaryValue(e);
    updating_layObj.selected_primary_value = e;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  };

  const selectXaxis = async (value, mode) => {
    try {
      if (mode === "2") {
        updating_layObj.charts_loaded = false;
        updating_layObj.chart_progress_count = null;
        // dispatch(updateLayoutInfo(clone_lay));
      } else {
        updating_layObj.charts_loaded = true;
        // dispatch(updateLayoutInfo(clone_lay));
      }
      if (seletedClnName !== undefined) {
        const data = {
          collection_name: seletedClnName.cln_name,
          encrypted_db_url: dbInfo.encrypted_db_url,
          db_name: dbInfo.db_name,
          primary_key: selectedPrimaryKey,
          selected_primary_key: value.name,
          selected_primary_value: selectedPrimaryValue,
          chart_position: mode,
          mode: "1",
        }
        if (mode === "1") {
          updating_layObj.x_axis_key = value;
         
          blockData.x_axis_key = value

          dispatch(toggleProcessingState(updating_layObj.i))
          updating_layObj.chnaged = true;

          // setXaxisValue(response.data.x_label);
          setselectedXaxisKey(value);

          clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
     
          var clone_lay_mod = [...clone_lay];
          clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
          await dispatch(updateLayoutInfo(clone_lay_mod));
        }
        if (mode === "2") {
          // setYaxisValue(response.data.x_label);
          setselectedYaxisKey(value);
          blockData.y_axis_key=value
          updating_layObj.y_axis_key = value;
          updating_layObj.chnaged = true;
          updating_layObj.x_axis_label = xaxislabel;
          updating_layObj.X_axis_value = XaxisValue;
          updating_layObj.barWidth = barwidth;
          updating_layObj.chart_name = chartName
          updating_layObj.math_calc = 'sum'
     

          clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;


          dispatch(toggleProcessingState(updating_layObj.i))
     

     
     
          var clone_lay_mod = [...clone_lay];
          clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;

          await    dispatch(updateLayoutInfo(clone_lay_mod));
            await    dispatch(updateLayoutData(clone_lay_mod, db_data));
        }
        // }
        // });
      }
    } catch (error) { }
  };

  const handleColorChange = (event) => {
    updating_layObj.chart_customize_clr = event.hex;
    clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
    dispatch(updateLayoutInfo(clone_lay));
    // dispatch(updateLayoutData(clone_lay, db_data));
  };


  const handletext_clr = async (event, i) => {
    updating_layObj.text_customize_clr = event.target.value;
    clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  };

  //STACK CHART CONFIG PORTION************************!SECTION
  const setYAxisArrValue = (newValue, index) => {
    if (yAxisArr?.length > 0) {
      setCardFielderr((prevArr) => {
        const updated_AxisArr = [...prevArr];
        updated_AxisArr[index] = newValue;
        return updated_AxisArr;
      })

      setYAxisArr((prevArr) => {
        const updated_AxisArr = [...prevArr];
        updated_AxisArr[index] = newValue;
        return updated_AxisArr;
      });
    } else {
      setYAxisArr((prevArr) => {
        const updated_AxisArr = [...prevArr];
        updated_AxisArr[index] = newValue;
        return updated_AxisArr;
      });

      setCardFielderr((prevArr) => {
        const updated_AxisArr = [...prevArr];
        updated_AxisArr[index] = newValue;
        return updated_AxisArr;
      })
    }

    if (cardFielderr?.[index] !== undefined) {
      const updatedErrors = [...errors];
      updatedErrors[index] = { ...updatedErrors[index], error: false };
      setCardFielderr(updatedErrors)

    } else {
      const updatedErrors = [...errors];
      updatedErrors[index] = { ...updatedErrors[index], error: true };
      setCardFielderr(updatedErrors)
    }
  };

  const selectXaxis_arr = async (value, mode, indx) => {
    try {
      if (seletedClnName !== undefined ) {
       
              if (mode === "1") {
                // setXaxisValue(response.data.x_label);
                setselectedXaxisKey(value);
                updating_layObj.x_axis_key = value;
                blockData.x_axis_key=value


                dispatch(toggleProcessingState(updating_layObj.i))
                updating_layObj.chnaged = true;



                clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
                var clone_lay_mod = [...clone_lay];
                clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
                await      dispatch(updateLayoutInfo(clone_lay_mod));


              }
              if (mode === "2") {
                // setYaxisValue(response.data.x_label);
                setselectedYaxisKey(value);
                setYAxisArrValue(value.name, indx);
                var updated_AxisArr

                setYAxisArr((prevArr) => {
                   updated_AxisArr = [...prevArr];
                  updated_AxisArr[indx] = value.name;
                  updating_layObj.yAxis_arr = updated_AxisArr;
                   updating_layObj.math_calc = 'sum'
                  return updated_AxisArr;
                });

             



                const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));
               
                // let data_modified = response.data.x_label;
                var AutoColr_arr;
                AutoColr_arr = await generateRandomColor(indx + 1);
                setColorArr((prevColorArr) => {
                  const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));
                  if (!isNaN(blockIdx) && typeof clone_lay[blockIdx] === "object" && clone_lay[blockIdx] !== null) {
                    let updating_layObj_clone = { ...clone_lay[blockIdx] };
                    let updatedColorArr = [...prevColorArr];
                    updatedColorArr[indx] = AutoColr_arr;
                    if (updating_layObj_clone.chart_customize_clr_arr !== undefined) {
                      if (AutoColr_arr !== updating_layObj_clone.chart_customize_clr_arr[indx]) {
                        updating_layObj_clone.chart_customize_clr_arr = [...updatedColorArr];
                      }
                    } else {
                      updating_layObj_clone.chart_customize_clr_arr = updatedColorArr;
                    }
                    if (Object.isFrozen(clone_lay)) {
                      clone_lay = [...clone_lay];
                    }
                    clone_lay[blockIdx] = updating_layObj_clone;
                    // dispatch(updateLayoutInfo(clone_lay));
                    // dispatch(updateLayoutData(clone_lay, db_data));
                    return updatedColorArr;
                  } else {
                    console.error("Invalid blockIdx or clone_lay[blockIdx] is not an object.");
                    return prevColorArr;
                  }
                });


                updating_layObj.x_axis_key = selectedXaxisKey;
                updating_layObj.x_axis_label = xaxislabel;
                updating_layObj.add_transition_data = addTransitiondata;
                updating_layObj.num_add_axes = numAdditionalAxes;
                updating_layObj.yAxis_arr = updated_AxisArr;

             
                updating_layObj.chnaged = true;

                updating_layObj.X_axis_value = XaxisValue;
                updating_layObj.chart_customize_clr_arr = colorArr;
                updating_layObj.labelname_arr = labelname_arr;


                dispatch(toggleProcessingState(updating_layObj.i))
                updating_layObj.chnaged = true;

               
                clone_lay[blockIdx] = updating_layObj;

                    // dispatch(updateLayoutData(clone_lay, db_data));
                await    dispatch(updateLayoutInfo(clone_lay));


              }
              setShowWarning(false);
            // }
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const onselectField = (err, i) => {
    if (yAxisArr?.[i] !== undefined) {
      const updatedErrors1 = [...errors];
      updatedErrors1[i] = { ...updatedErrors1[i], error: false };
      setErrors(updatedErrors1);
    } else {
      const updatedErrors = [...errors];
      updatedErrors[i] = { ...updatedErrors[i], error: true };
      setErrors(updatedErrors);
    }
    if (cardFielderr?.[i] !== undefined) {
      const updatedErrors = [...errors];
      updatedErrors[i] = { ...updatedErrors[i], error: false };
      setCardFielderr(updatedErrors)
    } else {
      const updatedErrors = [...errors];
      updatedErrors[i] = { ...updatedErrors[i], error: true };
      setCardFielderr(updatedErrors)
    }
  };
 
  const onClickDelete = (e, index) => {
    setAddTransitiondata(addTransitiondata - 1);
    setdeletecard_index(index);
    delete_card(index);
  };

  const handleColorChange_arr = async (event, i) => {
    const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));
    setColorArr((prevColorArr) => {
      if (!isNaN(blockIdx) && typeof clone_lay[blockIdx] === "object" && clone_lay[blockIdx] !== null) {
        let updating_layObj_clone = { ...clone_lay[blockIdx] };
        let updatedColorArr = [...prevColorArr];
        updatedColorArr[i] = event.hex;
        if (updating_layObj_clone.chart_customize_clr_arr !== undefined) {
          if (event.hex === updating_layObj_clone.chart_customize_clr_arr[i]) {
          } else {
            updating_layObj_clone.chart_customize_clr_arr = [...updatedColorArr];
            if (Object.isFrozen(clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))])) {
              clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = [
                ...clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))],
              ];
            }
            clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj_clone;
          }
        } else {
          updating_layObj_clone.chart_customize_clr_arr = [...updatedColorArr];
          clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj_clone;
        }
        return updatedColorArr;
      } else {
        return prevColorArr;
      }
    });
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  };

  const handletext_clr_arr = async (event, i) => {
    var updatedColorArr = [];
    setTextClrarr((prevColorArr) => {
      updatedColorArr = [...prevColorArr];
      updatedColorArr[i] = event.target.value;
      updating_layObj.text_customize_clr_arr = updatedColorArr
      clone_lay[Number(JSON.parse(sessionStorage.getItem('blockIdx')))] = updating_layObj;
      dispatch(updateLayoutInfo(clone_lay));
      dispatch(updateLayoutData(clone_lay, db_data));
      return updatedColorArr;
    });
  };

  const add_axis_data = (e) => {
    if (selectedXaxisKey === "" || selectedXaxisKey === undefined) {
      setShowWarning(true);
    } else if (yAxisArr?.length > 0) {
      if (labelname_arr.length - 1 === yAxisArr?.length) {
        setShowWarning(false);
        setAddTransitiondata(addTransitiondata + 1);
        setNumAdditionalAxes(numAdditionalAxes + 1);
        getFieldsName(blockData.selected_cln_name);
      } else {
        setShowWarning(true);
      }
    } else {
      setShowWarning(false);
      setAddTransitiondata(addTransitiondata + 1);
      setNumAdditionalAxes(numAdditionalAxes + 1);
      getFieldsName(blockData.selected_cln_name);
    }
  };

  const delete_card = async (remove_index) => {
    var updatedArray;
    if (mergedArr.length === 0) {
      if (blockData.selected_primary_value !== undefined) {
        let mergedArr_mod = layout[Number(JSON.parse(sessionStorage.getItem("blockIdx")))]["merged_arr"];
        updatedArray = removeItemByIndex(mergedArr_mod, remove_index);
      }
    } else {
      updatedArray = removeItemByIndex(mergedArr, remove_index);
    }
    const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));
    const labelarr = removeItemByIndex(additionalYLabels, remove_index + 1);
    const labelname_mod = removeItemByIndex(labelname_arr, remove_index + 1);
    const colorarr_modified = removeItemByIndex(colorArr, remove_index);
    const mod_yAxisarr = removeItemByIndex(yAxisArr, remove_index);
    setNumAdditionalAxes((prev) => {
      var removed_Axes = prev - 1
      var updtObj = { ...clone_lay[blockIdx] };
      updtObj.num_add_axes = numAdditionalAxes - 1;
      updtObj.add_transition_data = addTransitiondata - 1;
      updtObj.yAxis_arr = mod_yAxisarr
      updtObj.label_arr_data = labelname_mod;
      var updatedLayout = [...clone_lay];
      updatedLayout[blockIdx] = updtObj;
      dispatch(updateLayoutInfo(updatedLayout));
      dispatch(updateLayoutData(updatedLayout, db_data));
      return removed_Axes;
    });

    setlabelname_arr((prevColorArr = []) => {
      var updatedLabel = [...prevColorArr];
      updatedLabel = labelname_mod;
      updating_layObj.label_arr_data = updatedLabel;
      dispatch(updateLayoutInfo(clone_lay));
      dispatch(updateLayoutData(clone_lay, db_data));
      return labelname_mod;
    });

    setColorArr((prevColorArr) => {
      if (!Array.isArray(prevColorArr)) {
        prevColorArr = [];
      }
      const updatedColorArr = colorarr_modified;
      var updtObj = { ...clone_lay[blockIdx] };
      updtObj.chart_customize_clr_arr = updatedColorArr;
      var updatedLayout = [...clone_lay];
      updatedLayout[blockIdx] = updtObj;
      dispatch(updateLayoutInfo(updatedLayout));
      dispatch(updateLayoutData(updatedLayout, db_data));
      return updatedColorArr;
    });
    setcombinedArr([]);
    setYAxisArr(mod_yAxisarr);
    setAdditionalYLabels(labelarr);
    setdataLoaded(false)
    setTimeout(() => {
      setdataLoaded(true)
      setmergedArr(updatedArray);
    }, 50);
  };

  const removeItemByIndex = (dataArray, indexToRemove) => {
    if (indexToRemove >= 0 && indexToRemove < dataArray.length) {
      const newArray = [...dataArray];
      newArray.splice(indexToRemove, 1);
      return newArray;
    } else {
      return dataArray;
    }
  };

  const selectXaxis_pie_chart = async(value, mode) => {
    try {
       
            if (mode === "1") {
              // setXaxisValue(response.data.x_label);


              updating_layObj.x_axis_key = value;
         
             
              blockData.x_axis_key = value
              // updating_layObj.data = []
   
              // dispatch(toggleProcessingState(updating_layObj.i))
              updating_layObj.changed = true;
   
              // setXaxisValue(response.data.x_label);
              setselectedXaxisKey(value);
   
              clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
         
              var clone_lay_mod = [...clone_lay];
              clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
              await dispatch(updateLayoutInfo(clone_lay_mod));




             
              // setselectedXaxisKey(value);
              // setpieData(value);
            }
            if (mode === "2") {
              // setYaxisValue(response.data.x_label);
              setselectedYaxisKey(value);
            }
          // }
    } catch (error) { }
  };

  const curved_lines = (e) => {
    updating_layObj.curved_line_chrt = e.target.checked;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  };

  const mouseover_toggle = (e) => {
    const isChecked = e.target.checked;
    setShowMouseoverMain(isChecked);
    if (isChecked) {
      setShowMouseoverMulti(true);
      updating_layObj.mouseovered = e.target.checked;
      updating_layObj.mouseovered_type = !showMouseoverMulti;
      dispatch(updateLayoutInfo(clone_lay));
      dispatch(updateLayoutData(clone_lay, db_data));
    } else {
      setShowMouseoverMulti(false);
      updating_layObj.mouseovered = e.target.checked;
      updating_layObj.mouseovered_type = false;
      dispatch(updateLayoutInfo(clone_lay));
      dispatch(updateLayoutData(clone_lay, db_data));
    }
  };

  const mouseover_type = (e) => {
    setShowMouseoverMulti(!showMouseoverMulti);
    updating_layObj.mouseovered_type = e.target.checked;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  };

  const OnChangeWidth = (e) => {
    setBarWidth(e.target.value)
    updating_layObj.barWidth = e.target.value;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  }
  const resetwidth = () => {
    console.log("resetwidth");
    setBarWidth(undefined)
    updating_layObj.barWidth = undefined;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  }
  const show_bar_val = (e) => {
    setshowvalues(!showvalues);
    updating_layObj.show_bar_values = e.target.checked;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  };

  const show_line = (e) => {
    setshowLine(e.target.checked);
    updating_layObj.show_Line = e.target.checked;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  };

  const show_table = async (e) => {
    try {
      const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));
      const blockdata = Number(JSON.parse(sessionStorage.getItem("blockdata")));
      const updatedLayout = [...layout]; // Assuming layout is an array
      props.show_table_function(e, blockdata, blockIdx, layout);
    } catch (error) {
    }
  };

  const show_Grid = (e) => {
    setshow_grid_toggle(e.target.checked);
    updating_layObj.show_Grid = e.target.checked;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  };

  const handleFormatToggle = (format, val) => {
    if (val === "1") {
      switch (format) {
        case "bold":
          setBold(!bold);
          updating_layObj.label_bold = !bold;
          dispatch(updateLayoutInfo(clone_lay));
          dispatch(updateLayoutData(clone_lay, db_data));
          break;
        case "italic":
          setItalic(!italic);
          updating_layObj.label_italic = !italic;
          dispatch(updateLayoutInfo(clone_lay));
          dispatch(updateLayoutData(clone_lay, db_data));
          break;
        case "underline":
          setUnderline(!underline);
          updating_layObj.label_underline = !underline;
          dispatch(updateLayoutInfo(clone_lay));
          dispatch(updateLayoutData(clone_lay, db_data));
          break;
        default:
          break;
      }
    } else {
      switch (format) {
        case "bold":
          setBold(!bold);
          updating_layObj.value_bold = !bold;
          dispatch(updateLayoutInfo(clone_lay));
          dispatch(updateLayoutData(clone_lay, db_data));
          break;
        case "italic":
          setItalic(!italic);
          updating_layObj.value_italic = !italic;
          dispatch(updateLayoutInfo(clone_lay));
          dispatch(updateLayoutData(clone_lay, db_data));
          break;
        case "underline":
          setUnderline(!underline);
          updating_layObj.value_underline = !underline;
          dispatch(updateLayoutInfo(clone_lay));
          dispatch(updateLayoutData(clone_lay, db_data));
          break;
        default:
          break;
      }
    }
  };

  const label_mod = (e) => {
    updating_layObj.text = e.target.value;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  };

  const handleFontSizeChange = (selectedSize, val) => {
    setFontSize(selectedSize);
    if (val === "1") {
      updating_layObj.label_fontsize = selectedSize;
      dispatch(updateLayoutInfo(clone_lay));
      dispatch(updateLayoutData(clone_lay, db_data));
    } else {
      updating_layObj.value_fontsize = selectedSize;
      dispatch(updateLayoutInfo(clone_lay));
      dispatch(updateLayoutData(clone_lay, db_data));
    }
  };

  const handleFontColorChange = (selectedColor, val) => {
    setFontColor(selectedColor);
    if (val === "1") {
      updating_layObj.label_fontColor = selectedColor;
      dispatch(updateLayoutInfo(clone_lay));
      dispatch(updateLayoutData(clone_lay, db_data));
    } else {
      updating_layObj.value_fontColor = selectedColor;
      dispatch(updateLayoutInfo(clone_lay));
      dispatch(updateLayoutData(clone_lay, db_data));
    }
  };

  const selectcard_field_name =async (value, mode) => {
    setshowWarningCard(false);
    settempselectedYaxisKey(value);
    try {
    //   const data ={
    //     collection_name: authInfo.cln_list[0].cln_name,
    //     encrypted_db_url: dbInfo.encrypted_db_url,
    //     db_name: dbInfo.db_name,
    //     primary_key: selectedPrimaryKey,
    //     selected_primary_key: value.name,
    //     selected_primary_value: selectedPrimaryValue,
    //         chart_position: mode,
    //         mode: "1",

    //   }


    const data = {
        collection_name: dataRetreived.selected_cln_name.cln_name,
        encrypted_db_url: dbInfo.encrypted_db_url,
        db_name: dbInfo.db_name,
        primary_key: {},
        selected_primary_key: value,
        selected_primary_value: {},
        chart_position: mode,
         additional_fields:dataRetreived?.yAxis_arr ,

        mode: "1",
        startDate: reportSlice.startDate,
        endDate: reportSlice.endDate,
        dateFields: AuthSlice?.dateRangeField
    }

      var response = await dispatch(retriveClnPrimaryValue(data))

          if (response.status === 200) {
            if (mode === "1") {
              setXaxisValue(response.data.x_label);
              setselectedXaxisKey(value);
              setTimeout(() => {
                setcardData(value);
                setpreferedSelected(true);
              }, 1000);
            }
          }
    } catch (error) { }
  };

  const onChangePrefered_Calc = (e) => {
    setSelectedCalc(e);
    setTimeout(() => {
      setcardData(e);
    }, 500);
  };

  const handleDecimalPlacesChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setdecimalDigitsCount(value);
    setDecimalPlaces(value);
    const formatted = formatDecimal(cardDatavalue, value);
    setFormattedValue(formatted);
    updating_layObj.count = formatted;
    updating_layObj.decimal_count = value;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  };

  const formatDecimal = (value, places) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      return parsedValue.toFixed(places);
    }
    return "";
  };

  const InputLabelName =async (e, indx) => {
    const newValue = e.target.value.trim();
    if (newValue !== "") {
      setlabelname_arr((prevColorArr = []) => {
        const updatedLabelArr = [...prevColorArr];
        updatedLabelArr[indx + 1] = newValue;
        const updatedObj = {
          ...updating_layObj,
          label_arr_data: updatedLabelArr,
        };
        const cloned = [...clone_lay];
        cloned[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updatedObj;
        dispatch(updateLayoutInfo(cloned));
        dispatch(updateLayoutData(cloned, db_data));
        return updatedLabelArr;
      });
    }
  };

  const Add_table_label = (e) => {
    const newValue = e.target.value.trim();
    setlabelname_arr((prevColorArr = []) => {
      const updatedLabelArr = [...prevColorArr];
      updatedLabelArr[0] = newValue;
      updating_layObj.label_arr_data = updatedLabelArr;
      dispatch(updateLayoutInfo(clone_lay));
      dispatch(updateLayoutData(clone_lay, db_data));
      return updatedLabelArr;
    });
  };
  const Addaxislabel = async (e, name) => {
    const newValue = e.target.value.trim();
    if (name === "x") {
      updating_layObj.x_axis_label = newValue;
      setxaxislabel(newValue);
    } else {
      updating_layObj.y_axis_label = newValue;
      blockData.y_axis_label = newValue
      setyaxislabel(newValue);

      // clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
    }
    // dispatch(updateLayoutInfo(clone_lay));
    // dispatch(updateLayoutData(clone_lay, db_data));
  };

  const show_square = (e) => {
    setshowSquare(!showSquare);
    updating_layObj.show_Square = e.target.checked;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  };
  const show_node = (e) => {
    setshownode(!shownode);
    updating_layObj.show_node = e.target.checked;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  };

  const sidepanelclose = () => {
    console.log("sidepanelclose");
    updating_layObj.selected_primary_key = selectedPrimaryKey;
    updating_layObj.selected_primary_value = selectedPrimaryValue;
    updating_layObj.X_axis_value = XaxisValue;


    updating_layObj.y_axis_key = selectedYaxisKey;
    updating_layObj.x_axis_label = xaxislabel;
    // dispatch(toggleProcessingState(updating_layObj.i))
   

    updating_layObj.y_axis_label = yaxislabel;

    // updating_layObj.X_axis_value = XaxisValue;
    updating_layObj.barWidth = barwidth;
    updating_layObj.chart_name = chartName;
    // updating_layObj.chnaged = true;

   

    updateLayout(layout);
    if (yAxisArr?.length > 0) {
      if (labelname_arr.length - 1 === yAxisArr?.length) {
        setShowWarning(false);
        updating_layObj.num_add_axes = numAdditionalAxes;
        updating_layObj.x_axis_key = selectedXaxisKey;
        updating_layObj.add_transition_data = addTransitiondata;
        updating_layObj.yAxis_arr = yAxisArr;
        // updating_layObj.merged_arr = mergedArr;
        updating_layObj.x_axis_label = xaxislabel;
        updating_layObj.label_arr_data = labelname_arr;
        dispatch(updateLayoutData(clone_lay, db_data));
        onClose();
      } else {
        setShowWarning(true);
      }
    } else {
      dispatch(updateLayoutData(clone_lay, db_data));

      onClose();
    }
  };

  const generateRandomColor = async (indx) => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16); // Generate random hex color
    return randomColor;
  };





  const mathOperation  = ( name ) =>{
    console.log('mathOperation e :>> ',  name );
    setSelectedValue(name);

    // setshowSquare(!showSquare);
    updating_layObj.math_calc = name;
    console.log('mathOperation updating_layObj :>> ', updating_layObj , Number(JSON.parse(sessionStorage.getItem("blockIdx"))));
    dispatch(
      updateLayoutInfo({
        index: Number(JSON.parse(sessionStorage.getItem("blockIdx"))),
        updatedObject: updating_layObj,
      })
    )
    // dispatch(updateLayoutInfo(clone_lay ));
    dispatch(updateLayoutData(clone_lay, db_data));




  }
  return (
    dataLoaded && (

      <>
        <Offcanvas isOpen={isOpen} toggle={() => { sidepanelclose() }} direction="end" style={{ width: '700px', zoom: 0.9 }}>
          <OffcanvasHeader toggle={() => { sidepanelclose() }}>Drawer Title</OffcanvasHeader>
          <OffcanvasBody className="pt-0" >
            <>
              <Row>
                <Col>

                  {props.data.name === "rectangle_card" ?
                    <>
                      <Card style={{ margin: '20px', backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} >

                        <CardBody>
                          <Row className="mb-3">
                            <Col md={6}>
                              <Label className="fw-bold" style={{ fontSize: "14px" }}>Field Name 1:</Label>
                              <Select
                                placeholder="Enter Field name..."
                                classNamePrefix="react-select"
                                options={primaryKey}
                                getOptionLabel={(option) => option.name}
                                onChange={(e) => selectcard_field_name(e, "1")}
                                value={tempselectedYaxisKey}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderColor: showWarningCard ? "red" : "#ced4da",
                                  }),
                                }}
                              />
                              {showWarningCard && (
                                <span style={{ color: "red", fontSize: "12px" }}>
                                  Please re-select the correct fields.
                                </span>
                              )}
                            </Col>
                          </Row>

                          {!preferedSelected && (
                            <Row className="mb-3">
                              <Col md={6}>
                                <Label style={{ fontWeight: "bold", fontSize: "14px" }}>Preferred:</Label>
                                <Select
                                  classNamePrefix="react-select"
                                  options={prefered_selection}
                                  getOptionLabel={(option) => option.value}
                                  onChange={(e) => onChangePrefered_Calc(e)}
                                  value={
                                    Object.keys(selectedCalc).length === 0
                                      ? { name: "COUNT", value: "Total Count" }
                                      : selectedCalc
                                  }
                                />
                              </Col>
                              <Col md={6}>
                                <Label className="fw-bold" style={{ fontSize: "14px" }}>Text Label:</Label>
                                <Input
                                  type="text"
                                  placeholder="Enter Text Label..."
                                  name="bar"
                                  defaultValue={props.data.text}
                                  onChange={(e) => label_mod(e)}
                                  style={{
                                    padding: "8px",
                                    borderRadius: "5px",
                                    borderColor: "#ced4da",
                                  }}
                                />
                              </Col>
                            </Row>
                          )}

                          <Row className="mb-3">
                            <div className="mt-3 d-flex gap-3">
                              <button
                                className={`btn ${bold ? "active btn-primary" : "btn-light"}`}
                                onClick={() => handleFormatToggle("bold", "1")}
                                style={{ fontWeight: bold ? "bold" : "normal" }}
                              >
                                <b>B</b>
                              </button>
                              <button
                                className={`btn ${italic ? "active btn-success" : "btn-light"}`}
                                onClick={() => handleFormatToggle("italic", "1")}
                                style={{ fontStyle: italic ? "italic" : "normal" }}
                              >
                                <i>I</i>
                              </button>
                              <button
                                className={`btn ${underline ? "active btn-info" : "btn-light"}`}
                                onClick={() => handleFormatToggle("underline", "1")}
                                style={{
                                  textDecoration: underline ? "underline" : "none",
                                }}
                              >
                                <u>U</u>
                              </button>
                            </div>

                          </Row>

                          <Row className="mb-3">
                            <div className="font-size-controls d-flex align-items-center">
                              <Label
                                htmlFor="fontSizeDropdown"
                                style={{ marginBottom:'0px', marginRight: "10px", fontWeight: "bold", fontSize: "14px" }}
                              >
                                Font Size:
                              </Label>
                              <select
                                id="fontSizeDropdown"
                                value={fontSize}
                                onChange={(e) => handleFontSizeChange(parseInt(e.target.value), "1")}
                                style={{
                                  padding: "5px",
                                  borderRadius: "5px",
                                  borderColor: "#ced4da",
                                }}
                              >
                                <option value={12}>12px</option>
                                <option value={16}>16px</option>
                                <option value={20}>20px</option>
                                <option value={24}>24px</option>
                              </select>
                            </div>
                          </Row>

                          <Row>
                            <div className="font-color-controls d-flex align-items-center">
                              <Label
                                htmlFor="fontColorPicker"
                                style={{ marginBottom:'0px', marginRight: "10px", fontWeight: "bold", fontSize: "14px" }}
                              >
                                Font Color:
                              </Label>
                              <input
                                type="color"
                                id="fontColorPicker"
                                value={fontColor}
                                onChange={(e) => handleFontColorChange(e.target.value, "1")}
                                style={{
                                  padding: "2px",
                                  border: "none",
                                  borderRadius: "5px",
                                }}
                              />
                            </div>
                          </Row>
                        </CardBody>


                        {/* <CardBody>
                          <Row className="mb-3">
                            <Col md={6}>
                              <Label className="fw-b" >Field name1:</Label>
                              <Select
                                classNamePrefix="react-select"
                                options={primaryKey}
                                getOptionLabel={(option) => option.name}
                                onChange={(e) => {
                                  selectcard_field_name(e, "1");
                                }}
                                value={tempselectedYaxisKey}
                              />
                              {showWarningCard && (
                                <span style={{ color: "red" }}>Please Re-select the Correct fields</span>
                              )}

                            </Col>
                          </Row>
                          {!preferedSelected && (
                            <Row className="">
                              <Col md={6}>
                                <Label>Prefered : </Label>
                                <Select
                                  classNamePrefix="react-select"
                                  options={prefered_selection}
                                  getOptionLabel={(option) => option.value}
                                  onChange={(e) => {
                                    onChangePrefered_Calc(e);
                                  }}
                                  value={
                                    Object.keys(selectedCalc).length === 0
                                      ? { name: "COUNT", value: "Total Count" }
                                      : selectedCalc
                                  }
                                />

                              </Col>
                              <Col md={6}>
                                <Label className="fw-b">Text Label :</Label>
                                <Input
                                  type="text"
                                  placeholder="Enter Text Label"
                                  name="bar"
                                  defaultValue={props.data.text}
                                  onChange={(e) => label_mod(e)}
                                  style={{ padding: '8px' }}
                                />

                              </Col>
                            </Row>
                          )}

                          <Row>
                            <div className="mt-3 d-flex gap-3">
                              <button
                                className={`btn ${bold ? "active btn-primary" : "btn-light"}`}
                                onClick={() => handleFormatToggle("bold", "1")}
                              >
                                <b>B</b>
                              </button>
                              <button
                                className={`btn ${italic ? "active btn-success" : "btn-light"}`}
                                onClick={() => handleFormatToggle("italic", "1")}
                              >
                                <i>I</i>
                              </button>
                              <button
                                className={`btn ${underline ? "active btn-info" : "btn-light"}`}
                                onClick={() => handleFormatToggle("underline", "1")}
                              >
                                <u>U</u>
                              </button>
                            </div>
                            <div className="editor-content" contentEditable="true"></div>
                          </Row>
                          <Row>
                            <div className="font-size-controls">
                              <label htmlFor="fontSizeDropdown">Font Size:</label>
                              <select
                                id="fontSizeDropdown"
                                value={fontSize}
                                onChange={(e) => handleFontSizeChange(parseInt(e.target.value), "1")}
                              >
                                <option value={12}>12px</option>
                                <option value={16}>16px</option>
                                <option value={20}>20px</option>
                                <option value={24}>24px</option>
                              </select>
                            </div>
                          </Row>
                          <Row>
                            <div className="font-color-controls">
                              <label htmlFor="fontColorPicker">Font Color:</label>
                              <input
                                type="color"
                                id="fontColorPicker"
                                value={fontColor}
                                onChange={(e) => handleFontColorChange(e.target.value, "1")}
                              />
                            </div>
                          </Row>



                        </CardBody> */}
                      </Card>


                      <Card style={{ margin: '20px', backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} >
                      <CardBody>
                          <Row className="mt-3">
                            <Col>
                              <h6>
                                <b>Count value :</b>
                              </h6>
                              <Input
                                type="text"
                                value={formattedValue}
                                placeholder="Enter count..."
                                style={{padding: "8px"}}
                              />
                            </Col>
                          </Row>
                          <div className="my-3 d-flex gap-3">
                            <button
                              className={`btn ${bold ? "active btn-primary" : "btn-light"}`}
                              onClick={() => handleFormatToggle("bold", "2")}
                            >
                              <b>B</b>
                            </button>
                            <button
                              className={`btn ${italic ? "active btn-success" : "btn-light"}`}
                              onClick={() => handleFormatToggle("italic", "2")}
                            >
                              <i>I</i>
                            </button>
                            <button
                              className={`btn ${underline ? "active btn-info" : "btn-light"}`}
                              onClick={() => handleFormatToggle("underline", "2")}
                            >
                              <u>U</u>
                            </button>
                          </div>
                          <Row className="mb-3">
                            <div className="font-size-controls d-flex align-items-center">
                              <Label
                                htmlFor="fontSizeDropdown"
                                style={{ marginBottom:'0px', marginRight: "10px", fontWeight: "bold", fontSize: "14px" }}
                              >
                                Font Size:
                              </Label>
                              <select
                                id="fontSizeDropdown"
                                value={fontSize}
                                onChange={(e) => handleFontSizeChange(parseInt(e.target.value), "1")}
                                style={{
                                  padding: "5px",
                                  borderRadius: "5px",
                                  borderColor: "#ced4da",
                                }}
                              >
                                <option value={12}>12px</option>
                                <option value={16}>16px</option>
                                <option value={20}>20px</option>
                                <option value={24}>24px</option>
                              </select>
                            </div>
                          </Row>
                          <Row>
                            <div className="font-color-controls d-flex align-items-center">
                              <Label
                                htmlFor="fontColorPicker"
                                style={{ marginBottom:'0px', marginRight: "10px", fontWeight: "bold", fontSize: "14px" }}
                              >
                                Font Color:
                              </Label>
                              <input
                                type="color"
                                id="fontColorPicker"
                                value={fontColor}
                                onChange={(e) => handleFontColorChange(e.target.value, "1")}
                                style={{
                                  padding: "2px",
                                  border: "none",
                                  borderRadius: "5px",
                                }}
                              />
                            </div>
                          </Row>
                        </CardBody>

                      </Card>

                      {/* <Card>
                        <CardBody>
                          <>
                            <Row className="mt-3">
                              <Col md={12}>
                                <h6>
                                  <b>Field name1:</b>
                                </h6>
                                <Select
                                  classNamePrefix="react-select"
                                  options={primaryKey}
                                  getOptionLabel={(option) => option.name}
                                  onChange={(e) => {
                                    selectcard_field_name(e, "1");
                                  }}
                                  value={tempselectedYaxisKey}
                                />
                                {showWarningCard && (
                                  <span style={{ color: "red" }}>Please Re-select the Correct fields</span>
                                )}
                              </Col>
                            </Row>
                            <br />
                            { !preferedSelected && (
                              <Row className="mt-3">
                                <Col md={12}>
                                  <h6>
                                    <b>Prefered :</b>
                                  </h6>
                                  <Select
                                    classNamePrefix="react-select"
                                    options={prefered_selection}
                                    getOptionLabel={(option) => option.value}
                                    onChange={(e) => {
                                      onChangePrefered_Calc(e);
                                    }}
                                    value={
                                      Object.keys(selectedCalc).length === 0
                                        ? { name: "COUNT", value: "Total Count" }
                                        : selectedCalc
                                    }
                                  />
                                </Col>
                              </Row>
                            )}
                            {Object.keys(selectedCalc).length > 0 ? (
                              <Row className="mt-4">
                                <Col md={6}>
                                  <h6>
                                    <b>Number of Decimal Places:</b>
                                  </h6>
                                  <div>
                                    <input
                                      type="number"
                                      value={decimalDigitsCount}
                                      min={0}
                                      onChange={handleDecimalPlacesChange}
                                    />
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <h6>Formated value : {formattedValue}</h6>
                                </Col>
                              </Row>
                            ) : null}
                            <br />
                            <Row className="mt-3">
                              <Col>
                                <h6>
                                  <b>Text Label:</b>
                                </h6>
                                <Input
                                  type="text"
                                  placeholder="Enter Bar Name"
                                  name="bar"
                                  defaultValue={props.data.text}
                                  onChange={(e) => label_mod(e)}
                                />
                              </Col>
                            </Row>
                            <br />
                            <Row>
                              <div className="my-2 d-flex gap-3">
                                <button
                                  className={`btn ${bold ? "active btn-primary" : "btn-light"}`}
                                  onClick={() => handleFormatToggle("bold", "1")}
                                >
                                  <b>B</b>
                                </button>
                                <button
                                  className={`btn ${italic ? "active btn-success" : "btn-light"}`}
                                  onClick={() => handleFormatToggle("italic", "1")}
                                >
                                  <i>I</i>
                                </button>
                                <button
                                  className={`btn ${underline ? "active btn-info" : "btn-light"}`}
                                  onClick={() => handleFormatToggle("underline", "1")}
                                >
                                  <u>U</u>
                                </button>
                              </div>
                              <div className="editor-content" contentEditable="true"></div>
                            </Row>
                            <Row>
                              <div className="font-size-controls">
                                <label htmlFor="fontSizeDropdown">Font Size:</label>
                                <select
                                  id="fontSizeDropdown"
                                  value={fontSize}
                                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value), "1")}
                                >
                                  <option value={12}>12px</option>
                                  <option value={16}>16px</option>
                                  <option value={20}>20px</option>
                                  <option value={24}>24px</option>
                                </select>
                              </div>
                            </Row>
                            <Row>
                              <div className="font-color-controls">
                                <label htmlFor="fontColorPicker">Font Color:</label>
                                <input
                                  type="color"
                                  id="fontColorPicker"
                                  value={fontColor}
                                  onChange={(e) => handleFontColorChange(e.target.value, "1")}
                                />
                              </div>
                            </Row>




                            <Row className="mt-3">
                              <Col>
                                <h6>
                                  <b>Count value :</b>
                                </h6>
                                <Input
                                  type="text"
                                  value={formattedValue}
                                />
                              </Col>
                            </Row>
                            <div className="my-2 d-flex gap-3">
                              <button
                                className={`btn ${bold ? "active btn-primary" : "btn-light"}`}
                                onClick={() => handleFormatToggle("bold", "2")}
                              >
                                <b>B</b>
                              </button>
                              <button
                                className={`btn ${italic ? "active btn-success" : "btn-light"}`}
                                onClick={() => handleFormatToggle("italic", "2")}
                              >
                                <i>I</i>
                              </button>
                              <button
                                className={`btn ${underline ? "active btn-info" : "btn-light"}`}
                                onClick={() => handleFormatToggle("underline", "2")}
                              >
                                <u>U</u>
                              </button>
                            </div>
                            <Row>
                              <div className="font-size-controls">
                                <label htmlFor="fontSizeDropdown">Font Size:</label>
                                <select
                                  id="fontSizeDropdown"
                                  value={fontSize}
                                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value), "2")}
                                >
                                  <option value={12}>12px</option>
                                  <option value={16}>16px</option>
                                  <option value={20}>20px</option>
                                  <option value={24}>24px</option>
                                </select>
                              </div>
                            </Row>
                            <Row>
                              <div className="font-color-controls">
                                <label htmlFor="fontColorPicker">Font Color:</label>
                                <input
                                  type="color"
                                  id="fontColorPicker"
                                  value={fontColor}
                                  onChange={(e) => handleFontColorChange(e.target.value)}
                                />
                              </div>
                            </Row>
                          </>
                        </CardBody>
                      </Card> */}



                    </>
                    :
                    <>
                      <Card>
                        <CardBody>
                          <>


                            {props.data.name !== "pie_chart" ? (
                              <>
                                <Card style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} >
                                  <CardBody>
                                    <Row className="mb-3">
                                      <Col md={6}>
                                        <Label>{props.data.name != "table" ? "Chart Name" : "Table Name"}:</Label>
                                        <Input type="text" placeholder="Enter Chart Name" name="bar" maxLength={15} defaultValue={chartName}
                                          onChange={(e) => { setChartName(e.target.value); updating_layObj.chart_name = e.target.value; dispatch(updateLayoutInfo(clone_lay)); dispatch(updateLayoutData(clone_lay, db_data)) }} />
                                      </Col>
                                    </Row>
                                    <Row className="">
                                      <Col md={6}>
                                        <Label> {props.data.name === "table" ? "Choose Table Column" : "X Axis field"}: </Label>
                                        <Select classNamePrefix="react-select" options={primaryKey} getOptionLabel={(option) => option.name} value={selectedXaxisKey || blockData.x_axis_key}
                                          onChange={(e) => { props.data.name === "bar_charts" ? selectXaxis(e, "1") : selectXaxis_arr(e, "1"); }} />
                                      </Col>
                                      <Col md={6}>
                                        <Label> {props.data.name === "table" ? "Column Label" : "X Axis Label"}: </Label>
                                        <Input type="text" defaultValue={props.data.name === "table" ? labelname_arr?.[0] : xaxislabel !== undefined ? xaxislabel : "label"}
                                          onChange={(e) => { props.data.name === "table" ? Add_table_label(e) : Addaxislabel(e, "x"); }} required />
                                      </Col>
                                    </Row>
                                  </CardBody>
                                </Card>
                              </>
                            )
                              : (
                                <>
                                  <Card style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} >
                                    <CardBody>
                                      {/* <Row className="mb-3">
                                        <Col md={6}>
                                          <Label>{props.data.name != "table" ? "Chart Name" : "Table Name"}:</Label>
                                          <Input type="text" placeholder="Enter Chart Name" name="bar" maxLength={15} defaultValue={chartName}
                                            onChange={(e) => { setChartName(e.target.value); updating_layObj.chart_name = e.target.value; dispatch(updateLayoutInfo(clone_lay)); dispatch(updateLayoutData(clone_lay, db_data)) }} />
                                        </Col>
                                      </Row> */}
                                      <Row>
                                        <Col md={6}>
                                          <Label>{props.data.name != "table" ? "Chart Name" : "Table Name"}:</Label>
                                          <Input type="text" placeholder="Enter Chart Name" name="bar" maxLength={15} defaultValue={chartName}
                                            onChange={(e) => { setChartName(e.target.value); updating_layObj.chart_name = e.target.value; dispatch(updateLayoutInfo(clone_lay)); dispatch(updateLayoutData(clone_lay, db_data)) }} />
                                        </Col>
                                        <Col md={6}>
                                          <Label>Field name1:</Label>
                                          <Select classNamePrefix="react-select" options={primaryKey} getOptionLabel={(option) => option.name}
                                            onChange={(e) => { selectXaxis_pie_chart(e, "1"); }} value={selectedXaxisKey != "" ? selectedXaxisKey : blockData.x_axis_key} />
                                        </Col>
                                      </Row>
                                    </CardBody>
                                  </Card>

                                </>
                              )}

                            {/*
                            {props.data.name === "bar_charts" || props.data.name === "hor_barcharts" &&
                              <>
                                <Row>
                                  <Col md={6}>
                                    <Label>Y Axis field:</Label>
                                    <div>
                                      <Select classNamePrefix="react-select" options={primaryKeyYaxis} getOptionLabel={(option) => option.name} onChange={(e) => { selectXaxis(e, "2") }} value={props.data.y_axis_key} />
                                    </div>
                                  </Col>
                                  <Col md={6}>
                                    <Label>Y Axis Label:</Label>
                                    <div>
                                      <Input type="text" maxLength={15} onChange={(e) => Addaxislabel(e, "y")} defaultValue={yaxislabel !== undefined ? yaxislabel : "Ylabel"} />
                                    </div>
                                  </Col>
                                </Row>
                              </>
                            } */}



                            {props.data.name === "bar_charts" || props.data.name === "hor_barcharts" ? (
                              <>
                                <Card className="" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                                  <CardBody>
                                    <Row>
                                      <Col md={6}>
                                        <Label>Y Axis field:</Label>
                                        <div>
                                          <Select classNamePrefix="react-select" options={primaryKeyYaxis} getOptionLabel={(option) => option.name} onChange={(e) => { selectXaxis(e, "2") }} value={props.data.y_axis_key} />
                                        </div>
                                      </Col>
                                      <Col md={6}>
                                        <Label>Y Axis Label:</Label>
                                        <div>
                                          <Input type="text" maxLength={15} onChange={(e) => Addaxislabel(e, "y")} defaultValue={yaxislabel !== undefined ? yaxislabel : "Ylabel"} />
                                        </div>
                                      </Col>
                                    </Row>

                                    <Row className="my-2">
                                      <Col md={6}>
                                        <Label>Choose Bar Color</Label>
                                        <CompactPicker color={blockData.chart_customize_clr} onChange={(e) => { handleColorChange(e); }} />
                                      </Col>
                                      <Col md={6}>
                                        <Label>Choose Text Color</Label>
                                        <div>
                                          <input type="color" id="textColor" name="textColor" onChange={(e) => handletext_clr(e)} />
                                        </div>
                                      </Col>
                                    </Row>


                                  </CardBody>
                                </Card>

                              </>
                            ) : (
                              <div style={{ overflowY: "auto" }} >
                                {[...Array(numAdditionalAxes)].map((_, i) => (
                                  <Card key={i} style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                                    <CardBody>

                                      <Row>
                                        <Col className="text-end">
                                          {i > 0 && (
                                            <div className="btn btn-sm btn-soft-danger" onClick={(e) => { onClickDelete(e, i); }} >
                                              <i className="mdi mdi-delete-outline" id="deletetooltip" />
                                              <UncontrolledTooltip placement="top" target="deletetooltip">
                                                Delete
                                              </UncontrolledTooltip>
                                            </div>
                                          )}
                                        </Col>
                                      </Row>
                                      <Row className="mb-3">
                                        <Col md={6}>
                                          <Label>{props.data.name === "table" ? "Choose Column" : "Additional Y-axis Field"}{" "} {i + 1}:</Label>
                                          <Select value={yAxisArr !== undefined && yAxisArr.length > 0 ? { name: yAxisArr[i] } : { name: "Select...", }}
                                            options={primaryKeyYaxis} getOptionLabel={(option) => option.name} onChange={(e) => { selectXaxis_arr(e, "2", i) }}
                                            onBlur={() => onselectField(errors, i)} />

                                          {(cardFielderr?.[i]?.error) ? (
                                            <span style={{ color: "red" }}>Please select an option</span>
                                          ) :
                                            null}
                                        </Col>
                                        <Col md={6}>
                                          <Label> {props.data.name === "table" ? "Column Label" : "Additional Y-axis Label"} {i + 1} :</Label>
                                          <Input
                                            type="text"
                                            placeholder={`Enter label Name ${i + 1}`}
                                            maxLength={15}
                                            name={`additional_y_label_${i}`}
                                            onChange={(e) => {
                                              InputLabelName(e, i);
                                            }}
                                            defaultValue={labelname_arr !== undefined ? labelname_arr[i + 1] : "label"}
                                            disabled={yAxisArr !== undefined && yAxisArr[i] ? false : true}
                                          />
                                        </Col>
                                      </Row>

                                      {props.data.name !== "table" && (
                                        <>
                                          <Row>
                                            <Col md={6}>
                                              <Label>Choose a Bar Color {i + 1}:</Label>
                                              <TwitterPicker color={colorArr !== undefined && colorArr.length !== 0 ? colorArr[i - 1] : []} disabled={!(yAxisArr !== undefined && yAxisArr[i])}
                                                onChange={(e) => !(yAxisArr !== undefined && yAxisArr[i]) ? setShowWarning(true) : handleColorChange_arr(e, i)} />
                                            </Col>
                                            <Col md={6}>
                                              <Label>Choose Text Color  {i + 1} :</Label>
                                              <div>
                                                <input type="color" id="textColor" name="textColor" onChange={(e) => handletext_clr_arr(e, i)} />
                                              </div>
                                            </Col>
                                          </Row>
                                        </>
                                      )}
                                    </CardBody>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </>


                          {props.data.name === "pie_chart" || props.data.name === "bar_charts" || props.data.name === "hor_barcharts" ?
                            <>
                            </>
                            :
                            <>
                              <div className="settings-row">
                                <button className="btn btn-sm btn-primary"
                                  onClick={(e) => addTransitiondata === yAxisArr?.length ? add_axis_data(e) : setShowWarning(true)}
                                  disabled={props.data.name === "table" ? labelname_arr?.length > 0 ? false : true : xaxislabel !== undefined && xaxislabel !== "" ? false : true} >
                                  {props.data.name === "table" ? "Add Column" : "Add"} +
                                </button>
                              </div>
                              <div> {showWarning && <span className="warning-message">Please fill out the required fields</span>} </div>
                            </>
                          }



                          <Card style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                            <CardBody>
                              {props.data.name !== "area_chart" && props.data.name !== "Vertical_linechart" && props.data.name !== "line_chart" &&
                                props.data.name !== "pie_chart" && props.data.name !== "table" && props.data.name !== "hor_barcharts" && props.data.name !== "hor_stack" && props.data.name !== "hor_barcharts" && (
                                  <Row className="mb-3">
                                    {
                                      console.log('blockdata :>> ', blockData, barwidth, blockData.containerWidth)
                                    }
                                    <Col md={6}>
                                      <Label>Bar Width:</Label>
                                      <Input type="text" min={10}
                                        // max={blockData.containerWidth}
                                        maxLength={4} onChange={(e) => OnChangeWidth(e)} value={barwidth !== undefined ? barwidth : (blockData.containerWidth)} />

                                    </Col>
                                    <Col >
                                      <i className="bx bx-revision icon-hover" title="Reset Width" style={{ fontSize: '18px' }} onClick={() => resetwidth()} />
                                    </Col>
                                  </Row>
                                )}


                              {
                                // props.data.name !== "area_chart" && props.data.name !== "Vertical_linechart" && props.data.name !== "line_chart" &&
                                props.data.name !== "pie_chart"
                                // && props.data.name !== "table" && props.data.name !== "hor_barcharts" && props.data.name !== "hor_stack" && props.data.name !== "hor_barcharts"
                                && (
                                  <Row className="mb-3">
                                    <Col md={6}>
                                      <Label>Calculation:</Label>
                                      <select
                                        className="form-control"
                                        onChange={(e) => mathOperation(e.target.value)}
                                        // defaultValue={props.math_calc || "sum"}
                                        value={selectedValue} // Bind state to the dropdown value
                                      >
                                        {/* <option value="" disabled>
                                          Select Calculation
                                        </option> */}
                                        {report_math_operations.map((operation) => (
                                          <option key={operation.id} value={operation.name.toLowerCase()}>
                                            {operation.name}
                                          </option>
                                        ))}
                                      </select>
                                    </Col>
                                  </Row>
                                )}


                              {(props.data.name === "pie_chart" || props.data.name === "bar_charts" || props.data.name === "hor_barcharts") && (
                                <div className="settings-row">
                                  <div className="form-check form-switch form-switch-md">
                                    <input type="checkbox" className="form-check-input" id="pieMouseover" defaultChecked={blockData.mouseovered} onClick={(e) => mouseover_toggle(e)} />
                                    <label className="form-check-label" htmlFor="pieMouseover">
                                      Mouseover
                                    </label>
                                  </div>
                                </div>
                              )}



                              {XaxisValue !== "" && props.data.name !== "bar_charts" && props.data.name !== "pie_chart" && props.data.name !== "hor_barcharts" && (
                                <>
                                  {props.data.name !== "bar_charts" && props.data.name !== "pie_chart" && props.data.name !== "table" && (
                                    <>

                                      {/* <div className="settings-row" style={{ display: 'block' }}>
                                        <div className="form-check form-switch form-switch-md">
                                          <input type="checkbox" className="form-check-input" id="customSwitchsizemd" onClick={(e) => mouseover_toggle(e)} defaultChecked={blockData.mouseovered} />
                                          <label className="form-check-label" htmlFor="customSwitchsizemd"> Mouseover </label>
                                        </div>

                                        {showMouseoverMain && (
                                          <>
                                            <Row>
                                              <Col md={6}>
                                                <div className=" my-1" style={{ padding: '10px' }}>
                                                  <div className="settings-section m-0 pb-0">
                                                    <div className="settings-row">
                                                      <div className=" square-switch">
                                                        <input type="checkbox" id="square-switch1" className="switch" defaultChecked={showMouseoverMulti || blockData.mouseovered_type} onChange={(e) => mouseover_type(e)} />
                                                        <label htmlFor="square-switch1" data-on-label="Single" data-off-label="Multi" />
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </Col>
                                            </Row>
                                          </>
                                        )}


                                      </div> */}

                                      <div className="settings-row" style={{ display: 'block' }}>
                                        <div className="form-check form-switch form-switch-md">
                                          <input type="checkbox" className="form-check-input" id="customSwitchsizemd" onClick={(e) => mouseover_toggle(e)} defaultChecked={blockData.mouseovered} />
                                          <label className="form-check-label" htmlFor="customSwitchsizemd"> Mouseover </label>
                                        </div>

                                        {showMouseoverMain && (
                                          <>
                                            <Row>
                                              <Col md={5}>

                                                <div className="my-1">
                                                  <div className="settings-section" style={{ padding: '10px', background: '#d3d3d342' }}>
                                                    <div className="radio-buttons">
                                                      <div className="form-check mb-2">
                                                        <input type="radio" id="radio-single" name="mouseover-type" value="single" className="form-check-input custom-radio"
                                                          defaultChecked={blockData.mouseovered_type === 'single'} onChange={(e) => mouseover_type(e)} />
                                                        <label className="form-check-label" htmlFor="radio-single">
                                                          Single Mouseover
                                                        </label>
                                                      </div>
                                                      <div className="form-check">
                                                        <input type="radio" id="radio-multi" name="mouseover-type" value="multi" className="form-check-input custom-radio"
                                                          defaultChecked={blockData.mouseovered_type === 'multi'} onChange={(e) => mouseover_type(e)} />
                                                        <label className="form-check-label" htmlFor="radio-multi">
                                                          Multi Mouseover
                                                        </label>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>


                                                {/* <div className="my-1" >
                                                  <div className="settings-section " style={{ padding: '10px', background: '#d3d3d342' }}>
                                                    <div className="radio-buttons">
                                                      <div className="form-check mb-2">
                                                        <input type="radio" id="radio-single" name="mouseover-type" value="single" className="form-check-input"
                                                          defaultChecked={blockData.mouseovered_type === 'single'} onChange={(e) => mouseover_type(e)} />
                                                        <label className="form-check-label" htmlFor="radio-single">Single Mouseover</label>
                                                      </div>
                                                      <div className="form-check">
                                                        <input type="radio" id="radio-multi" name="mouseover-type" value="multi" className="form-check-input"
                                                          defaultChecked={blockData.mouseovered_type === 'multi'} onChange={(e) => mouseover_type(e)} />
                                                        <label className="form-check-label" htmlFor="radio-multi">Multi Mouseover</label>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div> */}
                                              </Col>
                                            </Row>
                                          </>
                                        )}
                                      </div>




                                    </>
                                  )}
                                </>
                              )}


                              {(props.data.name === "line_chart" || props.data.name === "area_chart") && (
                                <div className="settings-row">
                                  <div className="form-check form-switch form-switch-md">
                                    <input type="checkbox" className="form-check-input" id="squareNode" defaultChecked={showSquare} onClick={(e) => show_square(e)} />
                                    <label className="form-check-label" htmlFor="squareNode">
                                      Show circle node
                                    </label>
                                  </div>
                                </div>
                              )}

                              {props.data.name !== "table" && (
                                <>
                                  <div className="settings-row">
                                    <div className="form-check form-switch form-switch-md">
                                      <input type="checkbox" className="form-check-input" id="valueText" defaultChecked={blockData.show_bar_values} onClick={(e) => show_bar_val(e)} />
                                      <label className="form-check-label" htmlFor="valueText"> Show Values as Text </label>
                                    </div>
                                  </div>

                                  {props.data.name !== "pie_chart" && props.data.name !== "line_chart" && props.data.name !== "Vertical_linechart" && props.data.name !== "area_chart" && (
                                    <div className="settings-row">
                                      <div className="form-check form-switch form-switch-md">
                                        <input type="checkbox" className="form-check-input" id="lineGraph" defaultChecked={blockData.show_Line} onClick={(e) => show_line(e)} />
                                        <label className="form-check-label" htmlFor="lineGraph"> Show line graph </label>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}

                              {(props.data.name === "line_chart" ||
                                props.data.name === "Vertical_linechart" ||
                                props.data.name === "stack_bar" ||
                                props.data.name === "hor_stack" ||
                                props.data.name === "bar_charts" ||
                                props.data.name === "hor_barcharts") && (
                                  <>
                                    <div className="settings-row">
                                      <div className="form-check form-switch form-switch-md">
                                        <input type="checkbox" className="form-check-input" id="curvedLine" defaultChecked={blockData.curved_line_chrt} onClick={(e) => curved_lines(e)} />
                                        <label className="form-check-label" htmlFor="curvedLine"> Curved Line </label>
                                      </div>
                                    </div>
                                  </>
                                )}


                              {props.data.name !== "pie_chart" && props.data.name !== "table" && (
                                <div className="settings-row">
                                  <div className="form-check form-switch form-switch-md">
                                    <input type="checkbox" className="form-check-input" id="grid" defaultChecked={blockData.show_Grid} onClick={(e) => show_Grid(e)} />
                                    <label className="form-check-label" htmlFor="grid">Grid</label>
                                  </div>
                                </div>
                              )}


                              {props.data.name !== "table" && (
                                <div className="settings-row">
                                  <div className="form-check form-switch form-switch-md">
                                    <input type="checkbox" className="form-check-input" id="showTable" defaultChecked={blockData.show_table} onClick={async (e) => show_table(e)} />
                                    <label className="form-check-label" htmlFor="showTable"> Show Table </label>
                                  </div>
                                </div>
                              )}
                            </CardBody>
                          </Card>

                        </CardBody>
                      </Card>
                    </>
                  }

                </Col>
              </Row>

            </>
          </OffcanvasBody>
        </Offcanvas>
      </>

    )
  );
};

export default SidePanel;