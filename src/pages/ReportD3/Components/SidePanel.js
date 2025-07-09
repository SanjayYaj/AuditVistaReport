
import React, { useState, useEffect , useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "react-drawer/lib/react-drawer.css";
import Select from "react-select";
import { CompactPicker, TwitterPicker , SketchPicker } from "react-color";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-drawer/lib/react-drawer.css";
import { Input , Popconfirm} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, CardBody, Card, UncontrolledTooltip, Offcanvas, OffcanvasHeader, OffcanvasBody, Label , Collapse } from "reactstrap";
import '../LayoutInfo.css'

import { toggleProcessingState, updateLayoutData,updateLayoutInfo,retriveClnKeys,retriveClnPrimaryValue,retriveCardChartValue, removeReportData, sortArea, setSelectedSortredux} from '../../../Slice/reportd3/reportslice' 
import _ from 'lodash';
import urlSocket from "../../../helpers/urlSocket";
import { FaChevronDown } from "react-icons/fa"; // Importing down arrow icon
import { Auth } from "aws-amplify";
const SidePanel = (props) => {
  const dispatch = useDispatch();
  var isOpen = props.isOpen;
  var onClose = props.onClose;
  // var dbCollections = props.dbCollections;
  var db_data = props.db_data;
  var updateLayout = props.updateLayout;
  var show_table_function = props.show_table_function;
  var blockData = props.data;
  console.log('blockData :>> ', blockData);
  const [prefered_selection, setprefered_selection] = useState([
    { name: "SUM", value: "sum" },
    { name: "AVG", value: "avg" },
    { name: "total_count", value: "total_count" },
    { name: "min", value: "min" },
    { name: "max", value: "max" },
  ]);

  // const dbInfo = {
  //   // encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@15.206.204.11:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
  //   encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@65.0.69.57:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
  //   db_name: 'hotel_surguru-beta',
  // }

    const authInfo = useSelector((state) => state.auth);
    const dbInfo = authInfo.db_info
    var cln_name = authInfo.cln_list
    

  const [selectedCalc, setSelectedCalc] = useState({name: 'sum', value: 'sum'});
  // const [dbInfo, setDbinfo] = useState(JSON.parse(sessionStorage.getItem("db_info")));
  const [primaryKey, setprimaryKey] = useState([]);
  const [primaryKeyYaxis, setprimaryKeyYaxis] = useState([]);

  const [ fieldTypes , setFieldTypes ] = useState([])
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



  const [labelBold, setLabelBold] = useState(false);
  const [labelItalic, setLabelItalic] = useState(false);
  const [labelUnderline, setLabelUnderline] = useState(false);
  const [labelFontSize, setLabelFontSize] = useState(16);
  const [labelFontColor, setLabelFontColor] = useState("#000000");





  const [countBold, setCountBold] = useState(false);
  const [countItalic, setCountItalic] = useState(false);
  const [countUnderline, setCountUnderline] = useState(false);
  const [countFontSize, setCountFontSize] = useState(16);
  const [countFontColor, setCountFontColor] = useState("#000000");


 const [selectedColorBar, setSelectedColorBar] = useState("#FF5733");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [selectedValue, setSelectedValue] = useState(props.math_calc );

const [ calc_arr, setCalc_arr] = useState([])
  const layout =reportSlice.layoutInfo
  const report_math_operations = authInfo.report_math_operations;
  const AuthSlice = useSelector(state => state.auth);

  const pickerRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [colorMapping, setColorMapping] = useState({});

  
  const [collectionList, setCollectionList] = useState([]);

  const [ xaxisKeys ,set_XaxisKeys] = useState([]);
const [groupingKeys , setGroupingKeys] = useState([]);

const [groupedKeyValues, setGroupedKeyValues] = useState([]);


const [ columnOptions , setColumnOptions] = useState([]);


const [ dynmaicFieldType , setDynamicFieldType] = useState([]);

const [  collectionSelections  , setCollectionSelections ] = useState([]);


const [ xAxis_cln , setxAxis_cln ] = useState('0');


const [ selectedGroupingKey , setSelectedGroupingkey   ] = useState();
const [ selectedGroupingStateValue , setSelectedGroupingStateValue   ] = useState();


const [  selectedY_axisCollection, setSelectedY_axisCollection ] = useState([]);


const [  selectedCategoryLegend  ,   setSelectedCategoryLegend  ] = useState([]);

const [  selectedYAxiscln , setselectedYAxiscln ] = useState([])
useEffect(() => {

  if (Array.isArray(props.data?.selected_cln_name)) {
    const mapped = props.data.selected_cln_name.map(item => ({
      label: item,  // or label: item, if you prefer
      value: item
    }));
    setCollectionList([...mapped]);
  }



}, []);


const [showExtras, setShowExtras] = useState(false);

const toggleExtras = () => {
  setShowExtras(!showExtras);
};
  
  const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));


//   // Get all keys from the first item, excluding "name"
// const keys = Object.keys(layout[blockIdx]?.data[0]).filter(key => key !== "name");


    // Step 1: Get all unique keys from data
    const allKeys = Array.from(
      new Set( layout?.[blockIdx]?.data?.flatMap(d => Object.keys(d)))
  ).filter(k => k !== "name"); // exclude 'name'

  // // Step 2: Normalize each entry
  // const normalizedData =  layout?.[blockIdx]?.data.map(entry => {
  //     const newEntry = { name: entry.name };
  //     allKeys.forEach(key => {
  //         newEntry[key] = Number.isFinite(entry[key]) ? entry[key] : 0;
  //     });
  //     return newEntry;
  // });



  console.log('allKeys sidepannel; :>> ', allKeys);



const keys = allKeys



// const keys = layout?.[blockIdx]?.data?.[0]
//   ? Object.keys(layout[blockIdx].data[0]).filter(key => key !== "name")
//   : [];

  
// Generate the options array
const categoryOptions = [ ...keys.map(k => ({ name: k, value: k }))];//{ name: "ALL", value: "ALL" },

console.log(categoryOptions);

  // // Adding "ALL" as the first option
  // const categoryOptions = [{ name: "ALL", value: "ALL" }, ...(layout[blockIdx]?.data || [])];


  const selectCollection = async (val , axis ) => {
    try {
      console.log('val :>> ', val , axis);
    await  getFieldsName(val , axis);
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
      // selectCollection(props.data.selected_cln_name)
    }
   
      // Set default selected value to "ALL"
      setSelectedCategory(categoryOptions[0]);

  },[])

console.log('props :>> ', props);

  useEffect(() => {
    console.log('colormapping :>> ', colorMapping);

    // Ensure CalculationArr exists
    var updating_layObj1 = {
      ...clone_lay[blockIdx]
    };

    updating_layObj1.ColorMapping = colorMapping;

    console.log('updating_layObj1 :>> ', updating_layObj1);


    var clone_lay_mod = [...clone_lay];
    clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj1;


    dispatch(updateLayoutInfo(clone_lay_mod));
    dispatch(updateLayoutData(clone_lay_mod, db_data));

  } , [ colorMapping ])

  useEffect(() => {
    console.log('blockData :>> ', blockData.name , blockData);
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
       setselectedYAxiscln(blockData.Yaxis_cln)
       selectcln(blockData.Yaxis_cln)

      setSelectedCategoryLegend(blockData.legend_category || []);
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
        setCalc_arr(blockData.CalculationArr || []);
        
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

        console.log('blockData.xaxis_cln.selectedCollection :>> ', blockData.xaxis_cln?.selectedCollection);

        setxAxis_cln(blockData.xaxis_cln)


      selectCollection({ selectedCollection: blockData.xaxis_cln?.selectedCollection }, '0');

      // selectedGroupingField( blockData.groupingKeys)

      setSelectedGroupingkey(blockData.groupingKeys)
      setSelectedGroupingStateValue(blockData.groupingValue)

      setColorMapping(blockData.ColorMapping || {});  


      const fetchFieldOptions = async () => {
        const updatedColumnOptions = [...columnOptions];
        const updatedFieldTypes = [...fieldTypes];
    
        for (let i = 0; i < blockData.yAxis_Selectd_Cln.length; i++) {
          const data = blockData.yAxis_Selectd_Cln[i];
          if (data) {
            try {
              const result = await dispatch(retriveClnKeys({ selectedCollection: data?.label }, authInfo));
              console.log("retriveClnKeys", result, i);
    
              updatedColumnOptions[i] = result.data.data;
              updatedFieldTypes[i] = result.data.key_names;
            } catch (err) {
              console.warn(`❌ Failed to retrieve keys for index ${i}`, err.message);
            }
          }
        }
    
        setFieldTypes(updatedFieldTypes);
        setColumnOptions(updatedColumnOptions);
      };

      fetchFieldOptions();
      
    

      // 





        setdataLoaded(true);
      } else if (blockData.name === "rectangle_card") {
        console.log('blockData  rectangle card:>> ', blockData);
        setCardDataValue( blockData.originalvalue);
        selectCollection( { selectedCollection : blockData.selected_cln_name[0]} , '1');
        setselectedXaxisKey(blockData.x_axis_key);
        setXaxisValue(blockData.x_axis_key);
        // selectcard_field_name(blockData.x_axis_key, "1");
        setSelectedCalc(blockData.prefrd_calc);
        setpreferedSelected(blockData.prefrd_calc ? true : false);
        setFormattedValue(blockData.count);
        setdecimalDigitsCount(blockData.decimal_count);
        settempselectedYaxisKey(blockData.x_axis_key);

        setLabelFontColor(blockData.label_fontColor)
        setLabelBold(blockData.label_bold)
        setLabelItalic(blockData.label_italic)
        setLabelUnderline(blockData.label_underline)
        setLabelFontSize(blockData.label_fontSize)

        setCountFontColor(blockData.value_fontColor)
        setCountBold(blockData.value_bold)
        setCountItalic(blockData.value_italic)
        setCountUnderline(blockData.value_underline)
        setCountFontSize(blockData.value_fontSize)
        // decimal_finder(blockData.count)
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
        setSelectedColorBar(blockData.chart_customize_clr) 
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
        setCalc_arr(blockData.CalculationArr || []);
        setColorMapping(blockData.ColorMapping || {});  

        setxAxis_cln(blockData.xaxis_cln)

      selectCollection({ selectedCollection: blockData.xaxis_cln.selectedCollection }, '0');

      // selectedGroupingField( blockData.groupingKeys)

      setSelectedGroupingkey(blockData.groupingKeys)
      setSelectedGroupingStateValue(blockData.groupingValue)

      
        
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


      if(  blockData.name === 'rectangle_card' ){
        setCardDataValue("");
        setselectedXaxisKey("");
        setXaxisValue("");
        setSelectedCalc({name: 'sum', value: 'sum'});
        setpreferedSelected(false);
        setFormattedValue("");
        setdecimalDigitsCount(0);
        settempselectedYaxisKey("");
        setLabelFontColor("#000000")
        setLabelBold(false)
        setLabelItalic(false)
        setLabelUnderline(false)
        setLabelFontSize(16)

        setCountFontColor("#000000")
        setCountBold(false)
        setCountItalic(false)
        setCountUnderline(false)
        setCountFontSize(16)


        selectCollection( { selectedCollection : blockData.selected_cln_name[0]} , '1');

      }
      else if( blockData.name === 'pie_chart' ){
      selectCollection({ selectedCollection: blockData.selected_cln_name[0] }, '0');

      }
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



    // Close picker when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target)) {
          setShowColorPicker(false);
        }
      };
  
      if (showColorPicker) {
        document.addEventListener("mousedown", handleClickOutside);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showColorPicker]);



  useEffect(() => {
    try {
      console.log("271" , seletedClnName.selectedCollection ,selectedPrimaryKey,
        selectedPrimaryValue,
        selectedXaxisKey,
        dbInfo,
        selectedCalc)
      if (seletedClnName.selectedCollection !== undefined) {
        
        // var updating_layObj={
        //   ...updating_layObj
        // }
        // updating_layObj.selected_cln_name = seletedClnName;
        // updating_layObj.selected_primary_key = selectedPrimaryKey;
        // updating_layObj.selected_primary_value = selectedPrimaryValue;
        // updating_layObj.x_axis_key = selectedXaxisKey;
        // updating_layObj.y_axis_key = selectedYaxisKey;
        // updating_layObj.prefrd_calc = selectedCalc;
        
        
        // const data ={
        //   selected_cln_name: seletedClnName,
        //   selected_primary_key: selectedPrimaryKey,
        //   selected_primary_value: selectedPrimaryValue,
        //   fieldName: selectedXaxisKey,
        //   encrypted_db_url: dbInfo.encrypted_db_url,
        //   db_name: dbInfo.db_name,
        //   prefrd_calc : selectedCalc ,
        //   startDate: reportSlice.startDate,
        //   endDate: reportSlice.endDate,
        //   dateFields: AuthSlice?.dateRangeField

        // }

        // console.log("data 284+++", data , updating_layObj)
          // dispatch(retriveCardChartValue(data,clone_lay,selectedCalc,db_data , updating_layObj , cln_name))
        //__________________________________________________________-


        const data = {
          selected_cln_name: seletedClnName,
          selected_primary_key: selectedPrimaryKey,
          selected_primary_value: selectedPrimaryValue,
          fieldName: selectedXaxisKey,
          encrypted_db_url: dbInfo.encrypted_db_url,
          db_name: dbInfo.db_name,
          prefrd_calc: selectedCalc,
          // startDate: reportSlice.startDate,
          // endDate: reportSlice.endDate,
          // dateFields: AuthSlice?.dateRangeField

        }
        console.log(' Card Requested data :>> ', data);

    
        loadCardData(data)





        // updating_layObj.data = CardData;
        // updating_layObj.chnaged = false
        // updating_layObj.configured = true

        // // updating_layObj.decimal_count = 1
        // updating_layObj.count = ProjectData




        // // Dispatch to Redux
        //  dispatch(
        //   updateLayoutInfo({
        //     index: props.indexes,
        //     updatedObject: updating_layObj,
        //   })
        // )














          //_____________________________________________________________

        //   var updating_layObj = { ...clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] };


        // updating_layObj.prefrd_calc = selectedCalc

        // updating_layObj.text = updating_layObj.text
        // updating_layObj.x_axis_key = selectedXaxisKey



        // clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;


        // dispatch(toggleProcessingState(updating_layObj.i))
        // updating_layObj.chnaged = true;


        // var clone_lay_mod = [...clone_lay];
        // clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;

        // console.log('clone_lay_mod :>> ', clone_lay_mod);
        // dispatch(updateLayoutInfo(clone_lay_mod));
        // dispatch(updateLayoutData(clone_lay_mod, db_data));

      }
    } catch (error) {
      console.log('error :>> ', error);
    }
  }, [cardData]);



  const loadCardData = async (data) => {  


    var updating_layObj={
      ...updating_layObj
    }
    updating_layObj.selected_cln_name = seletedClnName;
    updating_layObj.selected_primary_key = selectedPrimaryKey;
    updating_layObj.selected_primary_value = selectedPrimaryValue;
    updating_layObj.x_axis_key = selectedXaxisKey;
    updating_layObj.y_axis_key = selectedYaxisKey;
    updating_layObj.prefrd_calc = selectedCalc;


    
    const responseData = await  urlSocket.post("report/retrive-card-chart-value", data)
        console.log('responseData 1086 :>> ', responseData);

        console.log('333333333333333 :>> ', responseData.data.data);
        // dispatch(retriveCardChartValue(data, clone_lay, selectedCalc, db_data, updating_layObj, cln_name))
        var CardData = responseData.data.data

        if (CardData.length > 0) {
          setdataLoaded(false);
          console.log('CardData :>> ', CardData);
          console.log('`${dataRetreived.prefrd_calc.value}` :>> ', `${selectedCalc.name}`);
          var ProjectData = CardData[0][`${selectedCalc.name}`]
          console.log('ProjectData 33333333 :>> ', ProjectData);
         
        }
       

        updating_layObj.data = CardData;
        updating_layObj.chnaged = false
        updating_layObj.configured = true


        updating_layObj.decimal_count = 0;
        // dispatch(updateLayoutInfo(clone_lay));
        // dispatch(updateLayoutData(clone_lay, db_data));




        // updating_layObj.decimal_count = 1
        updating_layObj.count = ProjectData
       await decimal_finder(ProjectData)
      // await  setFormattedValue(ProjectData)

        

        var updating_layObj = { ...clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] };


        updating_layObj.prefrd_calc = selectedCalc

        updating_layObj.text = updating_layObj.text
        updating_layObj.x_axis_key = selectedXaxisKey



        clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;


        dispatch(toggleProcessingState(updating_layObj.i))
        updating_layObj.chnaged = true;


        var clone_lay_mod = [...clone_lay];
        clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;

        console.log('clone_lay_mod :>> ', clone_lay_mod);
        dispatch(updateLayoutInfo(clone_lay_mod));
        dispatch(updateLayoutData(clone_lay_mod, db_data));

        setdataLoaded(true);






  }
  // const decimal_finder = async ( value ) => {
  //   // let value = "32.5"
  //   setCardDataValue(value);
  //   var check = await isDecimal(value);
  //   console.log('check :>> ', check);
  //   if (check) {
  //     const DigitsCounted = (value?.toString().split(".")[1] || "").length;
  //     console.log('DigitsCounted :>> ', DigitsCounted);
  //     setdecimalDigitsCount(DigitsCounted);
  //     setFormattedValue(value);
  //   } else {
  //     const DigitsCounted = (value?.toString().split(".")[1] || "").length;
  //     console.log('DigitsCounted :>> ', DigitsCounted);
  //     setdecimalDigitsCount(DigitsCounted);
  //     setFormattedValue(value);
  //   }
  // };

  const decimal_finder = async (value) => {
    setCardDataValue(value);
  
    const check = await isDecimal(value);
    console.log('check :>> ', check);
  
    const decimalCount = value?.toString().split(".")[1]?.length || 0;
    console.log('Decimal Count :>> ', decimalCount);
  
    setdecimalDigitsCount(decimalCount);
    setFormattedValue(value);
  };

  


  const isDecimal = async (value) => {
    console.log('value :>> ', value);
    if (value !== undefined && value !== null && value !== "") {
      const stringValue = value?.toString();
      return /^\d+$/.test(stringValue);
    } else {
      return true;
    }
  };

  const getFieldsName = (value , axis) => {
    return new Promise(async(resolve, reject) => {
      console.log("value----", value)
      if (value !== undefined) {
        try {
        
          var response = await dispatch(retriveClnKeys(value , authInfo))
          console.log(' retriveClnKeys response :>> ', response);
              if (response.status === 200) {
                setprimaryKey(response.data.y_keys);
                setprimaryKeyYaxis(response.data.y_keys);

                if( blockData.name === 'rectangle_card' || blockData.name === 'pie_chart' ){
                  setFieldTypes(response.data.key_names)

                }



                if(   axis === "0"){
                 console.log("axis 0" , response.data.y_keys);
                 set_XaxisKeys(response.data.y_keys);

                 let updating_layObj_clone = { ...updating_layObj };
                 updating_layObj_clone.xaxis_cln = value;
                 console.log('valueqqqqq :>> ', value);
                //  setxAxis_cln(value)

                 clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj_clone;
                 var clone_lay_mod = [...clone_lay];
                 clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj_clone;
                 await      dispatch(updateLayoutInfo(clone_lay_mod));


                //  dispatch(updateLayoutData(clone_lay, db_data));
                }
                else if(axis === "1"){
                  console.log("axis 1" , response.data.y_keys);
                  setGroupingKeys(response.data.y_keys);

                }
                else if(axis === "2"){
                  console.log("axis 2" , response.data.y_keys);

                }



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
          console.log('reportSlice :>> ', reportSlice);


          const dynamicId = updating_layObj.i; // Example ID

          dispatch(removeReportData(dynamicId)); // Removes the entry from Redux state




          // setYaxisValue(response.data.x_label);
          setselectedYaxisKey(value);
          blockData.y_axis_key=value
          updating_layObj.y_axis_key = value;
          updating_layObj.chnaged = true;
          updating_layObj.x_axis_label = xaxislabel;
          updating_layObj.X_axis_value = XaxisValue;
          // updating_layObj.barWidth = barwidth;
          updating_layObj.chart_name = chartName
          updating_layObj.CalculationArr = ['sum']
      

          clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;


          dispatch(toggleProcessingState(updating_layObj.i))


          setCalc_arr(['sum'])

          var clone_lay_mod = [...clone_lay];
          clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;

          await dispatch(updateLayoutInfo(clone_lay_mod));
          await dispatch(updateLayoutData(clone_lay_mod, db_data));
        }
        // }
        // });
      }
    } catch (error) { }
  };

  const handleColorChange = (event) => {
    updating_layObj.chart_customize_clr = event.hex;
    setSelectedColorBar(event.hex)
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
    console.log('yAxisArr 818 :>> ', yAxisArr , newValue);
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

    console.log('cardFielderr :>> ', cardFielderr);
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

          var updated_AxisArr

          setYAxisArr((prevArr) => {
            updated_AxisArr = [...prevArr];
            updated_AxisArr[indx] = value.name;
            updating_layObj.yAxis_arr = updated_AxisArr;
            updating_layObj.math_calc = 'sum'
            return updated_AxisArr;
          });



          setYAxisArrValue(value.name, indx);

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


          // updating_layObj.chnaged = true;

          // updating_layObj.X_axis_value = XaxisValue;
          // updating_layObj.chart_customize_clr_arr = colorArr;
          // updating_layObj.labelname_arr = labelname_arr;


          // dispatch(toggleProcessingState(updating_layObj.i))
          // updating_layObj.chnaged = true;


          clone_lay[blockIdx] = updating_layObj;

          // dispatch(updateLayoutData(clone_lay, db_data));
          await dispatch(updateLayoutInfo(clone_lay));


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
        // getFieldsName(blockData.selected_cln_name);
      } else {
        setShowWarning(true);
      }
    } else {
      setShowWarning(false);
      setAddTransitiondata(addTransitiondata + 1);
      setNumAdditionalAxes(numAdditionalAxes + 1);
      // getFieldsName(blockData.selected_cln_name);
    }
  };

  const delete_card = async (remove_index) => {
    var updatedArray;
    // if (mergedArr.length === 0) {
    //   if (blockData.selected_primary_value !== undefined) {
    //     let mergedArr_mod = layout[Number(JSON.parse(sessionStorage.getItem("blockIdx")))]["merged_arr"];
    //     updatedArray = removeItemByIndex(mergedArr_mod, remove_index);
    //   }
    // } else {
    //   updatedArray = removeItemByIndex(mergedArr, remove_index);
    // }
    const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));
    const labelarr = removeItemByIndex(additionalYLabels, remove_index + 1);
    const labelname_mod = removeItemByIndex(labelname_arr, remove_index + 1);
    const colorarr_modified = removeItemByIndex(colorArr, remove_index);
    const mod_yAxisarr = removeItemByIndex(yAxisArr, remove_index);

    const mod_calculationArr = removeItemByIndex(calc_arr, remove_index);

    setNumAdditionalAxes((prev) => {
      var removed_Axes = prev - 1
      var updtObj = { ...clone_lay[blockIdx] };
      updtObj.num_add_axes = numAdditionalAxes - 1;
      updtObj.add_transition_data = addTransitiondata - 1;
      updtObj.yAxis_arr = mod_yAxisarr

      updtObj.CalculationArr = mod_calculationArr
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
      updating_layObj.CalculationArr = mod_calculationArr

      dispatch(updateLayoutInfo(clone_lay));
      dispatch(updateLayoutData(clone_lay, db_data));
      return labelname_mod;
    });

    var updatedLayout 
    setColorArr((prevColorArr) => {
      if (!Array.isArray(prevColorArr)) {
        prevColorArr = [];
      }
      const updatedColorArr = colorarr_modified;
      var updtObj = { ...clone_lay[blockIdx] };
      updtObj.chart_customize_clr_arr = updatedColorArr;
      updtObj.CalculationArr = mod_calculationArr

      updatedLayout = [...clone_lay];
      updatedLayout[blockIdx] = updtObj;
      console.log('blockIdx :>> ', blockIdx , remove_index ,updatedLayout );

      // removeDynamicField(blockIdx, remove_index , updatedLayout);
      dispatch(toggleProcessingState( updatedLayout[blockIdx].i))
      updatedLayout[blockIdx].chnaged = true;
      updatedLayout[blockIdx].changed = true;
      dispatch(updateLayoutInfo(updatedLayout));
    dispatch(updateLayoutData(updatedLayout, db_data));

      return updatedColorArr;



      // dispatch(updateLayoutInfo(updatedLayout));
      // dispatch(updateLayoutData(updatedLayout, db_data));
     
    });
    setcombinedArr([]);
    setYAxisArr(mod_yAxisarr);

    setCalc_arr(mod_calculationArr)





    setAdditionalYLabels(labelarr);

    console.log('updating_layObj.data :>> ', updating_layObj.data);
    dispatch(sortArea({ data: updating_layObj.data , chart_id:  updating_layObj.i }));
    dispatch(setSelectedSortredux([]));
    setdataLoaded(false)
    setdataLoaded(true)

    
    
    // setTimeout(() => {
    //   setdataLoaded(true)
    //   setmergedArr(updatedArray);
    // }, 50);
  };

  const removeDynamicField = (blockIdx, remove_index , updatedLayout) => {
    const keyToRemove = `value${remove_index + 1}`;

    // Ensure the block and data exist
    if (!updatedLayout[blockIdx] || !Array.isArray(updatedLayout[blockIdx].data)) {
        console.error("Invalid blockIdx or data structure.");
        return;
    }

    // Create a new array with updated objects
    updatedLayout[blockIdx] = {
        ...updatedLayout[blockIdx],
        data: updatedLayout[blockIdx].data.map(obj => {
            const { [keyToRemove]: _, ...rest } = obj; // Remove key safely
            return rest;
        })
    };

    console.log("Updated Data:", updatedLayout[blockIdx]);
 dispatch(updateLayoutInfo(updatedLayout));
 dispatch(updateLayoutData(updatedLayout, db_data));
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
      updating_layObj.mouseovered_type = 'single';
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

  const mouseover_type = (e , name) => {
    console.log('name :>> ', name);
    setShowMouseoverMulti(name);
    updating_layObj.mouseovered_type = name;
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


  const show_legend = (e) => {
    // setshow_grid_toggle(e.target.checked);
    updating_layObj.show_Legend = e.target.checked;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  };

  const handleFormatToggle = (format, val) => {
    if (val === "1") {
      switch (format) {
        case "bold":
          setLabelBold(!labelBold);
          updating_layObj.label_bold = !labelBold;
          dispatch(updateLayoutInfo(clone_lay));
          dispatch(updateLayoutData(clone_lay, db_data));
          break;
        case "italic":
          setLabelItalic(!labelItalic);
          updating_layObj.label_italic = !labelItalic;
          dispatch(updateLayoutInfo(clone_lay));
          dispatch(updateLayoutData(clone_lay, db_data));
          break;
        case "underline":
          setLabelUnderline(!labelUnderline);
          updating_layObj.label_underline = !labelUnderline;
          dispatch(updateLayoutInfo(clone_lay));
          dispatch(updateLayoutData(clone_lay, db_data));
          break;
        default:
          break;
      }
    } else {
      switch (format) {
        case "bold":
          setCountBold(!countBold);
          updating_layObj.value_bold = !countBold;
          dispatch(updateLayoutInfo(clone_lay));
          dispatch(updateLayoutData(clone_lay, db_data));
          break;
        case "italic":
          setCountItalic(!countItalic);
          updating_layObj.value_italic = !countItalic;
          dispatch(updateLayoutInfo(clone_lay));
          dispatch(updateLayoutData(clone_lay, db_data));
          break;
        case "underline":
          setCountUnderline(!countUnderline);
          updating_layObj.value_underline = !countUnderline;
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
    if (val === "1") {
    setLabelFontSize(selectedSize);

      updating_layObj.label_fontsize = selectedSize;
      dispatch(updateLayoutInfo(clone_lay));
      dispatch(updateLayoutData(clone_lay, db_data));
    } else {
    setCountFontSize(selectedSize);

      updating_layObj.value_fontsize = selectedSize;
      dispatch(updateLayoutInfo(clone_lay));
      dispatch(updateLayoutData(clone_lay, db_data));
    }
  };

  const handleFontColorChange = (selectedColor, val) => {
    console.log("selectedColor", selectedColor);
    if (val === "1") {
    setLabelFontColor(selectedColor);

      updating_layObj.label_fontColor = selectedColor;
      dispatch(updateLayoutInfo(clone_lay));
      dispatch(updateLayoutData(clone_lay, db_data));
    } else {
    setCountFontColor(selectedColor);

      updating_layObj.value_fontColor = selectedColor;
      dispatch(updateLayoutInfo(clone_lay));
      dispatch(updateLayoutData(clone_lay, db_data));
    }
  };

  const selectcard_field_name =async (value, mode) => {
    setshowWarningCard(false);
    settempselectedYaxisKey(value);
    try {
      // const data ={
      //   collection_name: authInfo.cln_list[0].cln_name,
      //   encrypted_db_url: dbInfo.encrypted_db_url,
      //   db_name: dbInfo.db_name,
      //   primary_key: selectedPrimaryKey,
      //   selected_primary_key: value.name,
      //   selected_primary_value: selectedPrimaryValue,
      //       chart_position: mode,
      //       mode: "1",

      // }

      // var response = await dispatch(retriveClnPrimaryValue(data))

      //     if (response.status === 200) {
      //       if (mode === "1") {
              
      // setXaxisValue(response.data.x_label);
      setselectedXaxisKey(value);
      setTimeout(() => {
        setcardData(value);
        setpreferedSelected(true);
      }, 100);


            // }
          // }
    } catch (error) { }
  };

  const onChangePrefered_Calc = (e) => {
    setSelectedCalc(e);
    // setTimeout(() => {
      setcardData(e);
    // }, 100);
  };

  const handleDecimalPlacesChange = (event) => {
    console.log("event.target.value", event.target.value , "cardDatavalue", cardDatavalue)
    const value = parseInt(event.target.value, 10);
    setdecimalDigitsCount(value);
    setDecimalPlaces(value);
    const formatted = formatDecimal(cardDatavalue, value);





    console.log('formatted :>> ', formatted);
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
        // dispatch(updateLayoutInfo(cloned));
        // dispatch(updateLayoutData(cloned, db_data));
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

  const show_square = (e , name) => {
    setshowSquare(name);
    updating_layObj.show_Square = name
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
    // updating_layObj.barWidth = barwidth;
    updating_layObj.chart_name = chartName;
    // updating_layObj.chnaged = true;

    

    updateLayout(layout);
    if (yAxisArr?.length > 0) {

      console.log("yAxisArr?.length", yAxisArr?.length , 'calc_arr', calc_arr);
   
      const tempCalcArr = calc_arr.filter(item => item);
      console.log("tempCalcArr", tempCalcArr);

      if (labelname_arr.length - 1 === yAxisArr?.length && tempCalcArr.length  === yAxisArr?.length) {
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





  const mathOperation = async (e, indx) => {
    console.log('mathOperation e :>> ', e.name, indx);
    setSelectedValue(e.name);



    console.log('mathOperation updating_layObj :>> ', updating_layObj, Number(JSON.parse(sessionStorage.getItem("blockIdx"))));

    var clone_lay = [...layout];

    // Get the block index safely
    const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));

    if (!clone_lay[blockIdx]) {
      console.error(`Block at index ${blockIdx} is undefined!`);
      return;
    }

    // Ensure CalculationArr exists
    var updating_layObj1 = {
      ...clone_lay[blockIdx],
      CalculationArr: [...(clone_lay[blockIdx].CalculationArr || [])] // Ensures it's an array
    };

    // Now safely update the index
    updating_layObj1.CalculationArr[indx] = e.name;





    // updating_layObj1.x_axis_key = selectedXaxisKey;
    // updating_layObj1.x_axis_label = xaxislabel;
    // updating_layObj1.add_transition_data = addTransitiondata;
    // updating_layObj1.num_add_axes = numAdditionalAxes;

    updating_layObj1.chnaged = true;

    updating_layObj1.X_axis_value = XaxisValue;
    updating_layObj1.chart_customize_clr_arr = colorArr;
    updating_layObj1.labelname_arr = labelname_arr;



    dispatch(toggleProcessingState(updating_layObj1.i))
    updating_layObj1.chnaged = true;













    // Update clone_lay with the modified object
    clone_lay[blockIdx] = updating_layObj1;

    console.log('Updated clone_lay :>> ', clone_lay);



    setCalc_arr((prevColorArr) => {
      var updatedLabelArr = [...prevColorArr]
      updatedLabelArr[indx] = e.name;
      return updatedLabelArr;
    })




    // setCalc_arr((prevColorArr = []) => {
    //   const updatedLabelArr = [...prevColorArr];
    //   updatedLabelArr[0] = newValue;
    //   updating_layObj.label_arr_data = updatedLabelArr;
    //   dispatch(updateLayoutInfo(clone_lay));
    //   dispatch(updateLayoutData(clone_lay, db_data));
    //   return updatedLabelArr;
    // });




    // // setshowSquare(!showSquare);
    // updating_layObj.math_calc = name;
    // console.log('mathOperation updating_layObj :>> ', updating_layObj , Number(JSON.parse(sessionStorage.getItem("blockIdx"))));
    // dispatch(
    //   updateLayoutInfo({
    //     index: Number(JSON.parse(sessionStorage.getItem("blockIdx"))),
    //     updatedObject: updating_layObj,
    //   })
    // )





    
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));




  }





  const findOptions = (name , i) => {


    console.log('name findOptions :>> ', name , fieldTypes , i , "fieldTypes?.[i]", fieldTypes?.[i]);

    if( name != undefined || name != null || name != "") {
        // Find the field type for yAxisArr[i]
    var fieldType = fieldTypes[i]?.find(field => field.name === name);

    console.log('fieldType :>> ', fieldType);


    if (fieldType === undefined) {


      // Extract the first part before any array index
      const match = name?.match(/^([^\[\].]+)/);
      const firstName = match ? match[1] : name; // Extracted first name before the index

      console.log('Extracted firstName :>> ', firstName);

      // Find the field type using the extracted first name
      fieldType = fieldTypes.find(field => field?.name === firstName);

      console.log('fieldType :>> ', fieldType);


    }





    // Filter options based on the type
    const filteredOptions = report_math_operations.filter(option => {
      if (!fieldType) return false; // If no matching field, return empty
      return (fieldType.type === "integer" || fieldType.type === "array" || fieldType.type === "decimal") ? option.allowForNumbers : option.allowForStrings;
    });
    console.log('filteredOptions :>> ', filteredOptions);
    return filteredOptions

    }
 
  }







  // const handleColorChangeBar = (color) => {
  //   setSelectedColorBar(color.hex);
  // };

  // Handle color change from picker
  const handleColorChangeBar = (color) => {
    if (selectedCategory) {





      // // Now safely update the index
      // updating_layObj1.CalculationArr[indx] = e.name;




      setColorMapping((prev) => ({
        ...prev,
        [selectedCategory.name]: color.hex, // Store category name and color
      }));


     

    }
  };

  const handleCategoryChange = (selectedOption) => {
    console.log('selectedOption :>> ', selectedOption);
    setSelectedCategory(selectedOption);
  };


  const selectedGroupingField = async (e) => {
    console.log('selectedGroupingField :>> ', e);
    // /retrive-field-Values

    let data = {
      encrypted_db_url: AuthSlice.db_info.encrypted_db_url,
      db_name: AuthSlice.db_info.db_name,
      fieldName: e,
    }
    console.log('data 1889 :>> ', data);
    const responseData = await urlSocket.post("report/retrive-field-Values", data)
    console.log('responseData 1782 :>> ', responseData);
    // if (responseData.status === 200) {
    //   setGroupedKeyValues(responseData.data.data);


    //   setSelectedGroupingkey(e)

    //   updating_layObj.groupingKeys = e;
    //   clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;

    //   var clone_lay_mod = [...clone_lay];
    //   clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
    //   await dispatch(updateLayoutInfo(clone_lay_mod));

    // }
  }


  const handleCategoryChangeLegend = (selectedOption) => {
    console.log('selectedOption for legend :>> ', selectedOption);
    setSelectedCategoryLegend(selectedOption);
    updating_layObj.legend_category = selectedOption;
    // updating_layObj.chnaged = true;
    // updating_layObj.changed = true;
    dispatch(toggleProcessingState(updating_layObj.i))

    clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
    dispatch(updateLayoutInfo(clone_lay));
    dispatch(updateLayoutData(clone_lay, db_data));
  };

  const selectedGroupingValue = async (e) => {

    console.log('eeeeeeeee :>> ', e);

    setSelectedGroupingStateValue(e);
    updating_layObj.groupingValue = e;
    clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;



    if( updating_layObj.yAxis_arr !== undefined && updating_layObj.yAxis_arr.length > 0) {
      dispatch(toggleProcessingState(updating_layObj.i))


      console.log('updating_layObj.yAxis_arr :>> ', updating_layObj.yAxis_arr);
      updating_layObj.chnaged = true;
      updating_layObj.changed = true;
  
     

    }

    var clone_lay_mod = [...clone_lay];
      clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
      await dispatch(updateLayoutInfo(clone_lay_mod));


  }


  const selectcln_arr = async (selectedOption , i) => {
    console.log('selectcln_arr :>> ', selectedOption , i);

    console.log('collectionSelections :>> ', collectionSelections);
    const updatedSelections = [...collectionSelections];
    updatedSelections[i] = selectedOption;
    console.log('updatedSelections :>> ', updatedSelections);
    setCollectionSelections(updatedSelections);
    


    updating_layObj.yAxis_Selectd_Cln = updatedSelections;
    clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;


    updating_layObj.chnaged = true;
    updating_layObj.changed = true;


   
    // const fetchedColumns =  await  getFieldsName(selectedOption.value , '2'); 
    var result = await dispatch(retriveClnKeys({ selectedCollection :selectedOption?.label }, authInfo))
    console.log(' retriveClnKeys 1808:>> ', result);


    var updatedColumnOptions = [...columnOptions];
    var updataedFieldTypes = [...fieldTypes];

    updataedFieldTypes[i] = result.data.key_names;
    setFieldTypes(updataedFieldTypes);
    updatedColumnOptions[i] = result.data.data;
    console.log('updatedColumnOptions  1815:>> ', updatedColumnOptions);
    setColumnOptions(updatedColumnOptions);


    var clone_lay_mod = [...clone_lay];
    clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
    await dispatch(updateLayoutInfo(clone_lay_mod));


  }



  const selectcln = async (selectedOption) => {
    console.log('selectcln :>> ', selectedOption);
    setSelectedY_axisCollection(selectedOption);
    updating_layObj.selectedCollection = selectedOption;

    updating_layObj.Yaxis_cln = selectedOption
    
    clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;

    updating_layObj.chnaged = true;
    updating_layObj.changed = true;

    var result = await dispatch(retriveClnKeys({ selectedCollection :selectedOption?.label }, authInfo))
    console.log(' retriveClnKeys 1952:>> ', result);

    if( result ){
      setColumnOptions(result.data.data);
      setFieldTypes(result.data.key_names);
  
      var clone_lay_mod = [...clone_lay];
        clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
        await dispatch(updateLayoutInfo(clone_lay_mod));
  
    }
 
  }




  return (
    dataLoaded && (

      <>
        <Offcanvas isOpen={isOpen} toggle={() => { sidepanelclose() }} direction="end" fade={true} style={{ width: '700px', zoom: 0.9 , transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.2s ease-in-out'}}>
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

                          {preferedSelected && (
                            <Row className="mb-3">
                              <Col md={6}>
                                <Label style={{ fontWeight: "bold", fontSize: "14px" }}>Preferred:</Label>
                                <Select
                                  classNamePrefix="react-select"
                                  // options={prefered_selection}
                                  // getOptionLabel={(option) => option.value}



                                  options={findOptions(selectedXaxisKey?.name)} getOptionLabel={(option) => option.name}




                                  onChange={(e) => onChangePrefered_Calc(e)}
                                  value={
                                    Object.keys(selectedCalc).length === 0
                                      ? { name: "COUNT", value: "total_count" }
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
                                className={`btn ${labelBold ? "active btn-primary" : "btn-light"}`}
                                onClick={() => handleFormatToggle("bold", "1")}
                                style={{ fontWeight: labelBold ? "bold" : "normal" }}
                              >
                                <b>B</b>
                              </button>
                              <button
                                className={`btn ${labelItalic ? "active btn-success" : "btn-light"}`}
                                onClick={() => handleFormatToggle("italic", "1")}
                                style={{ fontStyle: labelItalic ? "italic" : "normal" }}
                              >
                                <i>I</i>
                              </button>
                              <button
                                className={`btn ${labelUnderline ? "active btn-info" : "btn-light"}`}
                                onClick={() => handleFormatToggle("underline", "1")}
                                style={{
                                  textDecoration: labelUnderline ? "underline" : "none",
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
                                style={{ marginBottom: '0px', marginRight: "10px", fontWeight: "bold", fontSize: "14px" }}
                              >
                                Font Size:
                              </Label>
                              <select
                                id="fontSizeDropdown"
                                value={labelFontSize}
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
                                style={{ marginBottom: '0px', marginRight: "10px", fontWeight: "bold", fontSize: "14px" }}
                              >
                                Font Color:
                              </Label>
                              <input
                                type="color"
                                id="fontColorPicker"
                                value={labelFontColor}
                                // onBlur={(e) => handleFontColorChange(e.target.value, "1")} // Dispatch when focus leaves
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
                                        max={5}
                                        onChange={handleDecimalPlacesChange}
                                      />
                                    </div>
                                  </Col>
                                  <Col md={6}>
                                    <h6>Formated value : {formattedValue}</h6>
                                  </Col>
                                </Row>
                              ) : null}
                            </CardBody>
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
                                disabled={true}
                                value={formattedValue}
                                placeholder="Enter count..."
                                style={{ padding: "8px" }}
                              />
                            </Col>
                          </Row>
                          <div className="my-3 d-flex gap-3">
                            <button
                              className={`btn ${countBold ? "active btn-primary" : "btn-light"}`}
                              onClick={() => handleFormatToggle("bold", "2")}
                            >
                              <b>B</b>
                            </button>
                            <button
                              className={`btn ${countItalic ? "active btn-success" : "btn-light"}`}
                              onClick={() => handleFormatToggle("italic", "2")}
                            >
                              <i>I</i>
                            </button>
                            <button
                              className={`btn ${countUnderline ? "active btn-info" : "btn-light"}`}
                              onClick={() => handleFormatToggle("underline", "2")}
                            >
                              <u>U</u>
                            </button>
                          </div>
                          <Row className="mb-3">
                            <div className="font-size-controls d-flex align-items-center">
                              <Label
                                htmlFor="fontSizeDropdown"
                                style={{ marginBottom: '0px', marginRight: "10px", fontWeight: "bold", fontSize: "14px" }}
                              >
                                Font Size:
                              </Label>
                              <select
                                id="fontSizeDropdown"
                                value={countFontSize}
                                onChange={(e) => handleFontSizeChange(parseInt(e.target.value), "2")}
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
                                style={{ marginBottom: '0px', marginRight: "10px", fontWeight: "bold", fontSize: "14px" }}
                              >
                                Font Color:
                              </Label>
                              <input
                                type="color"
                                id="fontColorPicker"
                                value={countFontColor}
                                onChange={(e) => handleFontColorChange(e.target.value, "2")}
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
                                      {
                                        console.log('xAxis_cln :>> ', xAxis_cln , collectionList)
                                      }
                                    <Col md={4}>
                                        <Label> {props.data.name === "table" ? "Choose Table collection" : "Choose Collection"}: </Label>
                                        {/* <Select classNamePrefix="react-select" 
                                          options={collectionList}
                                          getOptionLabel={(option) => option.name}
                                          getOptionValue={(option) => option.value}
                                          //  value={{name :xAxis_cln , value : xAxis_cln}}        
                                          onChange={(e) => selectCollection({selectedCollection :e.value }, '0')  } /> */}


{/* 
                                        <select type="select" name="subtitledd" label="Name"  value={xAxis_cln.selectedCollection} className="form-select" id=""  onChange={(e) => selectCollection({selectedCollection :e.target.value }, '0')  } >
                                          <option value="0" defaultValue="0">Choose...</option>
                                          {
                                            collectionList.map((data, idx) => {
                                              return (
                                                <option value={data.name} key={idx}>{data.name}</option>
                                              )
                                            })
                                          }
                                        </select> */}



{
  console.log('jjjjjjjjjjjj :>> ', collectionList.find(opt => opt.value === xAxis_cln?.selectedCollection) ,)
}

<Select
  name="label"
  id="label"
  // className="basic-single"
  // classNamePrefix="select"
  classNamePrefix="react-select"
  
  options={collectionList.map(item => ({ label: item.label, value: item.value }))}
  // value={{ label: xAxis_cln, value: xAxis_cln }} // assuming xAxis_cln is a string like "cln_adt_flat_h_levels"
  value={collectionList.find(opt => opt.value === xAxis_cln?.selectedCollection)}
  onChange={(selectedOption) => {
    selectCollection({ selectedCollection: selectedOption.value }, '0');
    setxAxis_cln(selectedOption.value);
  }}
  placeholder="Choose..."
/>





                                      </Col>



                                      <Col md={4}>
                                        <Label> {props.data.name === "table" ? "Choose Table Column" : "X Axis field"}: </Label>
                                        <Select classNamePrefix="react-select" options={xaxisKeys} getOptionLabel={(option) => option.name}   value={ selectedXaxisKey || blockData.x_axis_key }
                                          onChange={(e) => { props.data.name === "bar_charts" ? selectXaxis(e, "1") : selectXaxis_arr(e, "1"); }} />
                                      </Col>
                                      <Col md={3}>
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




                            {/* <>
                              <Card style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} >
                                <CardBody>
                                  <Row className="mb-3">
                                    <Col md={6}>
                                      <Label>Choose Grouping Field:</Label>



                                      <Select
                                        classNamePrefix="react-select"
                                        name="name"
                                        id="name"
                                        options={xaxisKeys.map(item => ({ label: item.name, value: item.name }))}
                                        value={{ label: selectedGroupingKey, value: selectedGroupingKey }} // selectedXKey is a string
                                        onChange={(e) => selectedGroupingField(e.value)}     // e.value will be the selected name string
                                        placeholder="Choose..."
                                      />

                                      {
                                        console.log('groupedKeyValues :>> ', groupedKeyValues)
                                      }


                                    </Col>
                                    <Col md={5}>
                                      <Label>select Grouping value:</Label>

                                      <Select classNamePrefix="react-select"
                                        name="name"
                                        id="name"
                                        options={groupedKeyValues.map(item => ({ label: item.name, value: item.name }))}

                                        onChange={(e) => selectedGroupingValue(e.value)}
                                        value={{ label: selectedGroupingStateValue, value: selectedGroupingStateValue }}

                                      />

                                    </Col>

                                  </Row>
                                </CardBody>
                              </Card>
                            </> */}





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

{
  console.log('selectedYAxiscln :>> ', selectedYAxiscln)
}

                            {props.data.name === "bar_charts" || props.data.name === "hor_barcharts" ? (
                              <>
                                <Card className="" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                                  <CardBody>
                                    <Row>
                                    <Col md={6}>
                                      <Label>{props.data.name === "table" ? "Choose Collection" : "choose collection"}:</Label>
                                          <Select
                                            options={collectionList.map(item => ({ label: item.label, value: item.value }))}
                                            // onChange={(e) => { selectcln_arr(e, i) }}
                                            onChange={(e => selectcln(e, "0"))}
                                            value={ collectionList.find(opt => opt.value === selectedYAxiscln.value)}
                                            // value={collectionList.find(opt => opt.value === blockData?.yAxis_Selectd_Cln?.[0]?.value)}
                                          // onBlur={() => onselectField(errors, i)}
                                          />

                                      </Col>

                                      <Col md={6}>
                                        <Label>Y Axis field:</Label>
                                        <div>
                                          <Select classNamePrefix="react-select"
                                            // options={primaryKeyYaxis}
                                            options={columnOptions} getOptionLabel={(option) => option.name} 
                                            // onChange={(e) => { selectXaxis_arr(e, "2", i) }}

                                            //  getOptionLabel={(option) => option.name}
                                            onChange={(e) => { selectXaxis(e, "2") }}
                                            value={props.data.y_axis_key}
                                          />
                                        </div>
                                      </Col>
                                   
                                    </Row>

<Row className="mt-3">
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




                                {

                                  console.log('layout 2149:>> ', layout[blockIdx]?.data)
                                }








                                  </CardBody>
                                </Card>


{
  layout[blockIdx]?.data &&
  <Card className="" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
  <CardBody>
    <Row className="my-4">
      <Label>
        Categories :
      </Label>
      <Select classNamePrefix="react-select"
        options={categoryOptions}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.value}
        value={selectedCategory}
        onChange={handleCategoryChange}
      //  onChange={(e) => { selectXaxis(e, "2") }}
      // value={props.data.y_axis_key} 
      ></Select>
    </Row>
    <Row className="my-4" >
      <Label>Colors:</Label>
      <Col md={2}>
        <div className="position-relative" ref={pickerRef}>
          <div
            className="d-flex align-items-center p-2 border rounded"
            style={{
              cursor: "pointer",
              backgroundColor: "#fff",
              display: "inline-flex",
            }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "10%",
                backgroundColor: selectedColorBar || selectedCategory ? colorMapping[selectedCategory?.name] || "#ccc" : "#ccc",
                marginRight: "10px",
              }}
            ></div>
            {/* <span>Selected Color</span> */}

            {/* Down arrow icon */}
            <FaChevronDown style={{ marginLeft: "8px" }} />


          </div>

          {showColorPicker && (
            <div
              style={{
                position: "absolute",
                zIndex: 2,
                top: "100%",
                left: "0",
                backgroundColor: "#fff",
                padding: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            >
              <SketchPicker
                color={selectedCategory ? colorMapping[selectedCategory.name] || "#ccc" : "#ccc"}
                onChange={handleColorChangeBar}
              />
            </div>
          )}
        </div>
      </Col>
      <Col>
      </Col>
    </Row>



    {/* Display Color Mapping */}
    {/* <Row>
      <Col>
        <h6>Assigned Colors:</h6>
        <ul>
          {Object.entries(colorMapping).map(([category, color]) => (
            <li key={category} style={{ color: color }}>
              {category}: {color}
            </li>
          ))}
        </ul>
      </Col>
    </Row> */}



  </CardBody>
</Card>
}
                           



                              </>
                            ) : (
                              <div style={{ overflowY: "auto" }} >
                                {[...Array(numAdditionalAxes)].map((_, i) => (
                                  <Card key={i} style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                                    <CardBody>

                                      <Row>
                                        <Col className="text-end">
                                          {i > 0 && (
                                            <div className="btn btn-sm btn-soft-danger"  >
                                           

                                              <Popconfirm placement="leftBottom" title="Are you sure to delete?" onConfirm={(e) => onClickDelete(e, i)}>
                                                <i className="mdi mdi-delete-outline" id="deletetooltip" />
                                              </Popconfirm>

                                            </div>
                                          )}
                                        </Col>
                                      </Row>
                                      <Row className="mb-3">
                                        <Col md={6} className="mb-2">
                                          <Label>{props.data.name === "table" ? "Choose Collection" : "choose collection"}{" "} {i + 1}:</Label>
                                          {/* <Select
                                          //  value={yAxisArr !== undefined && yAxisArr.length > 0 ? { name: yAxisArr[i] } : { name: "Select...", }}
                                            options={collectionList} 
                                            getOptionLabel={(option) => option.name}
                                             onChange={(e) => { selectcln_arr(e , i) }}
                                            // onBlur={() => onselectField(errors, i)}
                                             /> */}

{
  console.log('columnOptions :>> ', columnOptions , i)
}

                                          <Select
                                            //  value={yAxisArr !== undefined && yAxisArr.length > 0 ? { name: yAxisArr[i] } : { name: "Select...", }}
                                            options={collectionList.map(item => ({ label: item.label, value: item.value }))}
                                            onChange={(e) => { selectcln_arr(e, i) }}
                                            value={collectionList.find(opt => opt.value === blockData?.yAxis_Selectd_Cln?.[i]?.value)}
                                          // onBlur={() => onselectField(errors, i)}
                                          />

                                        </Col>
                                        <Col md={6}>
                                          <Label>{props.data.name === "table" ? "Choose Column" : "Additional Y-axis Field"}{" "} {i + 1}:</Label>
                                          <Select
                                            //  value={yAxisArr !== undefined && yAxisArr.length > 0 ? { name: yAxisArr[i] } : { name: "Select...", }}
                                            options={columnOptions[i]} getOptionLabel={(option) => option.name} onChange={(e) => { selectXaxis_arr(e, "2", i) }}
                                            onBlur={() => onselectField(errors, i)}

                                            value={yAxisArr !== undefined && yAxisArr.length > 0 ? { name: yAxisArr[i] } : { name: "Select...", }}
                                          />
                                          {/*                           
                                          {(cardFielderr?.[i]?.error) ? (
                                            <span style={{ color: "red" }}>Please select an option</span>
                                          ) :
                                            null} */}
                                        </Col>
                                      </Row>




                                      <Row className="mb-3 my-2">
                                     



                                       
                                        <Col md={4} className="my-2">
                                          <Label>Choose Calculation :</Label>
                                          {/* <Select value={calc_arr !== undefined && calc_arr.length > 0 ? { name: calc_arr[i] } : { name: "Select...", }}
                                            options={report_math_operations} getOptionLabel={(option) => option.name}  onChange={(e) => mathOperation(e, i)}    
                                          /> */}


                                          {console.log('yAxisArr[i] :>> ', yAxisArr[i], fieldTypes)}
                                          <Select value={calc_arr !== undefined && calc_arr.length > 0 ? { name: calc_arr[i] } : { name: "Select...", }}
                                            options={findOptions(yAxisArr[i] , i)} getOptionLabel={(option) => option.name} onChange={(e) => mathOperation(e, i)}
                                            className={yAxisArr[i] && !calc_arr[i] ? "error-border" : ""}
                                          />

                                          {/* Improved Validation Message */}
                                          {yAxisArr[i] && yAxisArr[i] !== "" && !calc_arr[i] ? (
                                            <div className="error-message">⚠ Calculation is required.</div>
                                          ) : null}


                                         
                                        </Col>
                                        {/* <Col md={6}> 
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
                                        */}

                                        <Col md={6} className="my-3">
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



                                        {
                                          layout[blockIdx]?.data &&


                                          <Row className="">
                                            <Col md={5}>
                                              <Label>
                                                Categories of Keys :
                                              </Label>
                                              <Select classNamePrefix="react-select"
                                                options={categoryOptions}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.value}
                                                value={selectedCategory}
                                                onChange={handleCategoryChange}
                                              //  onChange={(e) => { selectXaxis(e, "2") }}
                                              // value={props.data.y_axis_key} 
                                              ></Select>
                                            </Col>


                                            <Col md={2}>
                                              <Label>Colors:</Label>
                                              <div className="position-relative" ref={pickerRef}>
                                                <div
                                                  className="d-flex align-items-center p-2 border rounded"
                                                  style={{
                                                    cursor: "pointer",
                                                    backgroundColor: "#fff",
                                                    display: "inline-flex",
                                                  }}
                                                  onClick={() => setShowColorPicker(!showColorPicker)}
                                                >
                                                  <div
                                                    style={{
                                                      width: "24px",
                                                      height: "24px",
                                                      borderRadius: "10%",
                                                      backgroundColor: selectedColorBar || selectedCategory ? colorMapping[selectedCategory?.name] || "#ccc" : "#ccc",
                                                      marginRight: "10px",
                                                    }}
                                                  ></div>
                                                  {/* <span>Selected Color</span> */}

                                                  {/* Down arrow icon */}
                                                  <FaChevronDown style={{ marginLeft: "8px" }} />


                                                </div>

                                                {showColorPicker && (
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      zIndex: 2,
                                                      top: "100%",
                                                      left: "0",
                                                      backgroundColor: "#fff",
                                                      padding: "10px",
                                                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                                      borderRadius: "8px",
                                                    }}
                                                  >
                                                    <SketchPicker
                                                      color={selectedCategory ? colorMapping[selectedCategory.name] || "#ccc" : "#ccc"}
                                                      onChange={handleColorChangeBar}
                                                    />
                                                  </div>
                                                )}
                                              </div>
                                            </Col>


                                          </Row>




                                        }
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

                          <div className="mt-2 mb-4">
                            <button
                              className="btn btn-outline-secondary w-100 text-start"
                              onClick={toggleExtras}
                            >
                              {showExtras ? "▼ Close" : "▶ Categorization Legends"}
                            </button>

                            <Collapse isOpen={showExtras}>
                              <div className="p-2 mt-2 border rounded bg-light">
                                {/* 🎯 Your extra fields inside here */}
                                <div className="mb-2">
                                  <label>Choose Category fields : </label>
                                  <Select
                                    classNamePrefix="react-select"            
                                    options={xaxisKeys}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.value}
                                    value={selectedCategoryLegend}
                                    onChange={ (e)=>handleCategoryChangeLegend(e)}
                                    isClearable // 💡 Enables the clear (delete) icon
                                  />
                                  
                                </div>
                              </div>
                            </Collapse>
                          </div>



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
{/* commented for more works to be done in part of theses!!!*******************************************||||||||||||||||||||||||||||||||||||||||**************************************************************************** */}
                              {/* {props.data.name !== "area_chart" && props.data.name !== "Vertical_linechart" && props.data.name !== "line_chart" &&
                                props.data.name !== "pie_chart" && props.data.name !== "table" && props.data.name !== "hor_barcharts" && props.data.name !== "hor_stack" && props.data.name !== "hor_barcharts" && (
                                  <Row className="mb-3">
                                    
                                    <Col md={6}>
                                      <Label>Bar Width:</Label>
                                      <Input type="text" min={10} 
                                      // max={blockData.containerWidth} 
                                      maxLength={4} onChange={(e) => OnChangeWidth(e)} value={barwidth !== undefined ? barwidth : (blockData.containerWidth)} />

                                    </Col>
                                    <Col >
                                      <i className="bx bx-revision icon-hover" title="Reset Width"   style={{ fontSize: '18px' }}  onClick={()=> resetwidth()} />
                                    </Col>
                                  </Row>
                                )} */}
{/* commented for more works to be done in part of theses!!!*******************************************||||||||||||||||||||||||||||||||||||||||**************************************************************************** */}

{
  console.log('calc_arr :>> ', calc_arr)
}

                              {
                              // props.data.name !== "area_chart" && props.data.name !== "Vertical_linechart" && props.data.name !== "line_chart" &&
                               (   props.data.name === "bar_charts" ||  props.data.name === "hor_barcharts"  ) 
                                // && props.data.name !== "table" && props.data.name !== "hor_barcharts" && props.data.name !== "hor_stack" && props.data.name !== "hor_barcharts"
                                 && (
                                  <Row className="mb-3">
                                    <Col md={6}>
                                      <Label>Calculation:</Label>
                                      <Select value={ calc_arr !== undefined && calc_arr.length > 0 ? { name: calc_arr[0] } :  { name: "Select...", }}
                                            options={findOptions( selectedYaxisKey?.name ) } getOptionLabel={(option) => option.name} onChange={(e) => mathOperation(e, 0)}
                                          />

                                      {/* <select
                                        className="form-control"
                                        onChange={(e) => mathOperation(e.target.value)}
                                    
                                        value={selectedValue} // Bind state to the dropdown value
                                      >
                                      
                                        {report_math_operations.map((operation) => (
                                          <option key={operation.id} value={operation.name.toLowerCase()}>
                                            {operation.name}
                                          </option>
                                        ))}
                                      </select> */}
                                    </Col>    
                                  </Row>
                                )}


                              {(props.data.name === "pie_chart" || props.data.name ===  "bar_charts"|| props.data.name === "hor_barcharts" )&& ( 
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
                                                        defaultChecked={blockData.mouseovered_type === 'single'} onChange={(e) => mouseover_type(e , 'single')} />
                                                        <label className="form-check-label" htmlFor="radio-single">
                                                          Single Mouseover
                                                        </label>
                                                      </div>
                                                      <div className="form-check">
                                                        <input type="radio" id="radio-multi" name="mouseover-type" value="multi" className="form-check-input custom-radio"
                                                         defaultChecked={blockData.mouseovered_type === 'multi'} onChange={(e) => mouseover_type(e , 'multi')} />
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


                              {/* { ( props.data.name === "line_chart" ||   props.data.name === "area_chart" ||   props.data.name === "stack_bar"  )  && (
                                <div className="settings-row">
                                  <div className="form-check form-switch form-switch-md">
                                    <input type="checkbox" className="form-check-input" id="squareNode" defaultChecked={showSquare} onClick={(e) => show_square(e)} />
                                    <label className="form-check-label" htmlFor="squareNode">
                                      Show square node
                                    </label>
                                  </div>
                                </div>
                              )} */}



                              {(props.data.name === "line_chart" || props.data.name === "area_chart"  || props.data.name ===  "Vertical_linechart" ) && (

                                <Row className="my-3">
                                  <Col md={5}>

                                    <div className="my-1">
                                      <div className="settings-section" style={{ padding: '10px', background: '#d3d3d342' }}>
                                        <div className="radio-buttons">
                                          <div className="form-check mb-2">
                                            <input type="radio" id="radio-square-node" name="nodePoint" value="square" className="form-check-input custom-radio" onClick={(e) => show_square(e , 'square')}
                                              defaultChecked={blockData.show_Square === 'square'} />
                                            <label className="form-check-label" htmlFor="radio-square">
                                              Square Node
                                            </label>
                                          </div>
                                          <div className="form-check">
                                            <input type="radio" id="radio-circle-node" name="nodePoint" value="circle" className="form-check-input custom-radio" onClick={(e) => show_square(e , 'circle')}
                                              defaultChecked={blockData.show_Square === 'circle'} />
                                            <label className="form-check-label" htmlFor="radio-circle">
                                              Circle Node
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                  </Col>
                                </Row>

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
                                  {
                                    showLine &&
                                    <Row className="my-3">
                                      <Col md={5}>

                                        <div className="my-1">
                                          <div className="settings-section" style={{ padding: '10px', background: '#d3d3d342' }}>
                                            <div className="radio-buttons">
                                              <div className="form-check mb-2">
                                                <input type="radio" id="radio-square-node" name="nodePoint" value="square" className="form-check-input custom-radio" onClick={(e) => show_square(e , 'square')} 
                                                  defaultChecked={blockData.show_Square === 'square'} />
                                                <label className="form-check-label" htmlFor="radio-square">
                                                  Square Node
                                                </label>
                                              </div>
                                              <div className="form-check">
                                                <input type="radio" id="radio-circle-node" name="nodePoint" value="circle" className="form-check-input custom-radio" onClick={(e) => show_square(e , 'circle')}
                                                  defaultChecked={blockData.show_Square === 'circle'} />
                                                <label className="form-check-label" htmlFor="radio-circle">
                                                  Circle Node
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                      </Col>
                                    </Row>}


                                </>
                              )}

                              {(props.data.name === "line_chart" ||
                                props.data.name === "Vertical_linechart" ||
                                props.data.name === "stack_bar" ||
                                props.data.name === "hor_stack" ||
                                props.data.name === "bar_charts" ||
                                props.data.name === "hor_barcharts") && (
                                  <>

                                    {(showLine ||props.data.name === "line_chart" ||   props.data.name === "Vertical_linechart" ) ?
                                      <div className="settings-row">
                                        <div className="form-check form-switch form-switch-md">
                                          <input type="checkbox" className="form-check-input" id="curvedLine" defaultChecked={blockData.curved_line_chrt} onClick={(e) => curved_lines(e)} />
                                          <label className="form-check-label" htmlFor="curvedLine"> Curved Line </label>
                                        </div>
                                      </div>
                                      :
                                      null}

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


                              {props.data.name !== "table" && (
                                <div className="settings-row">
                                  <div className="form-check form-switch form-switch-md">
                                    <input type="checkbox" className="form-check-input" id="legend"
                                     defaultChecked={blockData.show_Legend}
                                      onClick={async (e) => show_legend(e)} />
                                    <label className="form-check-label" htmlFor="legend"> Legend </label>
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




// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
// import "react-drawer/lib/react-drawer.css";
// import Select from "react-select";
// import { CompactPicker, TwitterPicker } from "react-color";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import "react-drawer/lib/react-drawer.css";
// import { Input } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import { Row, Col, CardBody, Card, UncontrolledTooltip, Offcanvas, OffcanvasHeader, OffcanvasBody, Label } from "reactstrap";
// import '../LayoutInfo.css'

// import { toggleProcessingState, updateLayoutData,updateLayoutInfo,retriveClnKeys,retriveClnPrimaryValue,retriveCardChartValue} from '../../../Slice/reportd3/reportslice' 


// const SidePanel = (props) => {
//   const dispatch = useDispatch();
//   var isOpen = props.isOpen;
//   var onClose = props.onClose;
//   // var dbCollections = props.dbCollections;
//   var db_data = props.db_data;
//   var updateLayout = props.updateLayout;
//   var show_table_function = props.show_table_function;
//   var blockData = props.data;
//   const [prefered_selection, setprefered_selection] = useState([
//     { name: "SUM", value: "Sum" },
//     { name: "AVG", value: "Average" },
//     { name: "COUNT", value: "Total Count" },
//     { name: "MIN", value: "Minimum" },
//     { name: "MAX", value: "Maximum" },
//   ]);

//   // const dbInfo = {
//   //   // encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@15.206.204.11:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
//   //   encrypted_db_url: 'mongodb://mongoadmin:DegLk916ePdeG@65.0.69.57:27017/hotel_surguru-beta?authMechanism=SCRAM-SHA-1&authSource=admin',
//   //   db_name: 'hotel_surguru-beta',
//   // }

//     const authInfo = useSelector((state) => state.auth);
//     const dbInfo = authInfo.db_info
//     var cln_name = authInfo.cln_list
    

//   const [selectedCalc, setSelectedCalc] = useState({});
//   // const [dbInfo, setDbinfo] = useState(JSON.parse(sessionStorage.getItem("db_info")));
//   const [primaryKey, setprimaryKey] = useState([]);
//   const [primaryKeyYaxis, setprimaryKeyYaxis] = useState([]);
//   const [primaryKeyValue, setprimaryKeyValue] = useState([]);
//   const [XaxisValue, setXaxisValue] = useState([]);
//   const [selectedXaxisKey, setselectedXaxisKey] = useState({});
//   const [selectedYaxisKey, setselectedYaxisKey] = useState({});
//   const [YaxisValue, setYaxisValue] = useState([]);
//   const [selectedPrimaryKey, setselectedPrimaryKey] = useState({});
//   const [selectedPrimaryValue, setselectedPrimaryValue] = useState({});
//   const [seletedClnName, setseletedClnName] = useState({});
//   const [xaxislabel, setxaxislabel] = useState("");
//   const [yaxislabel, setyaxislabel] = useState("");
//   const [addTransitiondata, setAddTransitiondata] = useState(0);
//   const [numAdditionalAxes, setNumAdditionalAxes] = useState(0);
//   const [colorArr, setColorArr] = useState([]);
//   const [deletecard_index, setdeletecard_index] = useState(0);
//   const [additionalYLabels, setAdditionalYLabels] = useState([]);
//   const [yAxisArr, setYAxisArr] = useState([]);
//   const [mergedArr, setmergedArr] = useState([]);
//   const [combinedArr, setcombinedArr] = useState([]);
//   const [yAxisarrMod, setYaxisarrMod] = useState([]);
//   const [pieData, setpieData] = useState([]);
//   const [cardData, setcardData] = useState([]);
//   const [showMouseoverMulti, setShowMouseoverMulti] = useState(false);
//   const [showMouseoverMain, setShowMouseoverMain] = useState(false);
//   const [dataLoaded, setdataLoaded] = useState(false);
//   const [showvalues, setshowvalues] = useState(false);
//   const [showLine, setshowLine] = useState(false);
//   const [showTable, setshowTable] = useState(false);
//   const [show_grid_toggle, setshow_grid_toggle] = useState(false);
//   const [bold, setBold] = useState(false);
//   const [italic, setItalic] = useState(false);
//   const [underline, setUnderline] = useState(false);
//   const [fontSize, setFontSize] = useState(16);
//   const [fontColor, setFontColor] = useState("#000000");
//   const [labelname_arr, setlabelname_arr] = useState([]);
//   const [showSquare, setshowSquare] = useState(false);
//   const [shownode, setshownode] = useState(false);
//   const [showWarningCard, setshowWarningCard] = useState(false);
//   const [barwidth, setBarWidth] = useState(undefined);
//   const [cardFielderr, setCardFielderr] = useState([])
//   const [textClrarr, setTextClrarr] = useState([]);
//   const [decimalPlaces, setDecimalPlaces] = useState(2);
//   const [formattedValue, setFormattedValue] = useState("");
//   const [tempselectedYaxisKey, settempselectedYaxisKey] = useState({});
//   const [chartName, setChartName] = useState("");
//   const [decimalDigitsCount, setdecimalDigitsCount] = useState();
//   const [cardDatavalue, setCardDataValue] = useState();
//   const [showWarning, setShowWarning] = useState(false);
//   const [preferedSelected, setpreferedSelected] = useState(false);
//   const [errors, setErrors] = useState(yAxisArr?.map(() => ({ error: false })));
//   const reportSlice = useSelector((state) => state.reportSliceReducer);

//   const [selectedValue, setSelectedValue] = useState(props.math_calc );


//   const layout =reportSlice.layoutInfo
//   const report_math_operations = authInfo.report_math_operations;


//   const selectCollection = async (val) => {
//     try {
//     await  getFieldsName(val);
//     } catch (error) {
//       console.log("something went wrong", error);
//     }
//   };

//   var clone_lay = [...layout];
//   var updating_layObj = { ...clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] };
//   clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;

//   useEffect(()=>{
//     console.log('props.data.selected_cln_name :>> ', props.data.selected_cln_name);
//      if(props.data.selected_cln_name !== undefined){
//       selectCollection(props.data.selected_cln_name)
//     }
//   },[])



//   useEffect(() => {
//     if (blockData.x_axis_key !== undefined) {
//       setSelectedValue(blockData.math_calc)

//       setseletedClnName(blockData.selected_cln_name);     
//       // selectPrimaryKey(blockData.selected_primary_key);
//       // selectCollection(blockData.selected_cln_name);
//       setselectedPrimaryKey(blockData.selected_primary_key);
//       setselectedPrimaryValue(blockData.selected_primary_value);
//       settempselectedYaxisKey(blockData.x_axis_key);
//       setShowMouseoverMain(blockData.mouseovered);
//       setxaxislabel(blockData.x_axis_label);
//       setyaxislabel(blockData.y_axis_label);
//       setChartName(blockData.chart_name);
//       setBarWidth(blockData.barWidth)
//       if (
//         blockData.name === "stack_bar" ||
//         blockData.name === "line_chart" ||
//         blockData.name === "area_chart" ||
//         blockData.name === "hor_stack" ||
//         blockData.name === "Vertical_linechart"
//       ) {
//         setselectedXaxisKey(blockData.x_axis_key);
//         setAddTransitiondata(blockData.add_transition_data !== undefined ? blockData.add_transition_data : 0);
//         setNumAdditionalAxes(blockData.num_add_axes !== undefined ?  blockData.num_add_axes : 0);
//         setselectedYaxisKey(blockData.y_axis_key);
//         setcombinedArr(blockData.combined_arr || []);
//         setYAxisArr(blockData.yAxis_arr || []);
//         // setmergedArr(blockData.merged_arr || []);
//         setXaxisValue(blockData.X_axis_value);
//         setShowMouseoverMulti(blockData.mouseovered_type);
//         setshowvalues(blockData.show_bar_values);
//         setshowLine(blockData.show_Line);
//         setshowSquare(blockData.show_Square);
//         setshowTable(blockData.show_table);
//         setshow_grid_toggle(blockData.show_Grid);
//         setlabelname_arr(blockData.label_arr_data || []);
//         const colorArray = (blockData?.chart_customize_clr_arr || []).map((color) =>
//           color !== null ? color : generateRandomColor()
//         );
//         setColorArr(colorArray);
//         setBarWidth(blockData.containerWidth)
//         setdataLoaded(true);
//       } else if (blockData.name === "rectangle_card") {
//         // selectCollection(blockData.selected_cln_name);
//         setselectedXaxisKey(blockData.x_axis_key);
//         setXaxisValue(blockData.x_axis_key);
//         selectcard_field_name(blockData.x_axis_key, "1");
//         setSelectedCalc(blockData.prefrd_calc);
//         setpreferedSelected(blockData.prefrd_calc ? true : false);
//         setFormattedValue(blockData.count);
//         setdecimalDigitsCount(blockData.decimal_count);
//         setdataLoaded(true);
//       } else if (blockData.name === "pie_chart") {
//         setselectedPrimaryValue(blockData.selected_primary_value);
//         setselectedXaxisKey(blockData.x_axis_key);
//         setdataLoaded(true);
//       } else if (blockData.name === "table") {
//         setselectedXaxisKey(blockData.x_axis_key);
//         setAddTransitiondata(blockData.add_transition_data !== undefined ? blockData.add_transition_data : 0);
//         setNumAdditionalAxes(blockData.num_add_axes !== undefined ?  blockData.num_add_axes : 0);
//         setselectedYaxisKey(blockData.y_axis_key);
//         // setcombinedArr(blockData.combined_arr || []);
//         setYAxisArr(blockData.yAxis_arr || []);
//         // setmergedArr(blockData.merged_arr || []);
//         setXaxisValue(blockData.X_axis_value);
//         setlabelname_arr(blockData.label_arr_data !== undefined ? blockData.label_arr_data : []);
//         setdataLoaded(true);
//       } else {
//         setselectedXaxisKey(blockData.x_axis_key);
//         setselectedYaxisKey(blockData.y_axis_key);
//         setseletedClnName(blockData.selected_cln_name);    
//         // selectPrimaryKey(blockData.selected_primary_key);
//         // selectCollection(blockData.selected_cln_name);
//         setselectedPrimaryKey(blockData.selected_primary_key);
//         setselectedPrimaryValue(blockData.selected_primary_value);
//         setXaxisValue(blockData.X_axis_value);
//         // selectXaxis(blockData.x_axis_key, "1");
//         setshowvalues(blockData.show_bar_values);
//         setshowTable(blockData.show_table);
//         // selectXaxis(blockData.y_axis_key, "2");
//         setshowLine(blockData.show_Line);
//         setdataLoaded(true);
//       }
//     } else {
//       setChartName(blockData.chart_name)
//       // setseletedClnName({});
//       // setselectedPrimaryKey({});
//       // setselectedPrimaryValue({});
//       setselectedXaxisKey("");
//       setAddTransitiondata(0);
//       setNumAdditionalAxes(0);
//       setselectedYaxisKey({});
//       setYAxisArr([]);
//       setmergedArr([]);
//       setcombinedArr([]);
//       setXaxisValue([]);
//       setshowLine(blockData?.show_Line);
//       setshowSquare(blockData?.show_Square);
//       setshowLine(blockData.show_Line);
//       // setshowSquare(blockData.show_Square);
//       setShowMouseoverMain(blockData.mouseovered);
//       setdataLoaded(true);
//     }
//   }, [blockData]);

//   // useEffect(() => {
//   //   try {
//   //     if (seletedClnName.cln_name !== undefined) {
//   //       updating_layObj.selected_cln_name = seletedClnName;
//   //       updating_layObj.selected_primary_key = selectedPrimaryKey;
//   //       updating_layObj.selected_primary_value = selectedPrimaryValue;
//   //       updating_layObj.x_axis_key = selectedXaxisKey;
//   //       updating_layObj.y_axis_key = selectedYaxisKey;

//   //       const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));

//   //       clone_lay[blockIdx] = updating_layObj;

//   //           dispatch(updateLayoutData(clone_lay, db_data));


//   //     }
//   //   } catch (error) {
//   //     console.log('error :>> ', error);
//   //   }
//   // }, [pieData]);

//   useEffect(() => {
//     try {
//       if (seletedClnName.cln_name !== undefined) {


        
//         var updating_layObj={
//           ...updating_layObj
//         }
//         updating_layObj.selected_cln_name = seletedClnName;
//         updating_layObj.selected_primary_key = selectedPrimaryKey;
//         updating_layObj.selected_primary_value = selectedPrimaryValue;
//         updating_layObj.x_axis_key = selectedXaxisKey;
//         updating_layObj.y_axis_key = selectedYaxisKey;
//         updating_layObj.prefrd_calc = selectedCalc;
        
//         const data ={
//           selected_cln_name: seletedClnName,
//           selected_primary_key: selectedPrimaryKey,
//           selected_primary_value: selectedPrimaryValue,
//           fieldName: selectedXaxisKey,
//           encrypted_db_url: dbInfo.encrypted_db_url,
//           db_name: dbInfo.db_name,
//           prefrd_calc : selectedCalc

//         }
//           dispatch(retriveCardChartValue(data,clone_lay,selectedCalc,db_data , updating_layObj , cln_name))
//       }
//     } catch (error) {
//       console.log('error :>> ', error);
//     }
//   }, [cardData]);

//   const decimal_finder = async (value) => {
//     setCardDataValue(value);
//     var check = await isDecimal(value);
//     if (check) {
//       setFormattedValue(value);
//     } else {
//       const DigitsCounted = (value?.toString().split(".")[1] || "").length;
//       setdecimalDigitsCount(DigitsCounted);
//       setFormattedValue(value);
//     }
//   };

//   const isDecimal = async (value) => {
//     if (value !== undefined && value !== null && value !== "") {
//       const stringValue = value?.toString();
//       return /^\d+$/.test(stringValue);
//     } else {
//       return true;
//     }
//   };

//   const getFieldsName = (value) => {
//     return new Promise(async(resolve, reject) => {
//       if (value !== undefined) {
//         try {
        
//           var response = await dispatch(retriveClnKeys(value))
//               if (response.status === 200) {
//                 setprimaryKey(response.data.data);
//                 setprimaryKeyYaxis(response.data.y_keys);
//                 setseletedClnName(value);
//                 let updating_layObj_clone = { ...updating_layObj };
//                 updating_layObj_clone.selected_cln_name = value;
//                 // dispatch(updateLayoutInfo(clone_lay));
//                 // dispatch(updateLayoutData(clone_lay, db_data));
//                 resolve(response.data);
//               } else {
//                 reject(new Error(`Request failed with status: ${response.status}`));
//               }
//         } catch (error) { }
//       }
//     });
//   };

//   const selectPrimaryKey = async(value) => {
//     try {
//       var collection_name =
//         seletedClnName !== undefined && seletedClnName.cln_name !== undefined
//           ? seletedClnName
//           : blockData.selected_cln_name;
//       if (collection_name) {
//         const data ={
//           collection_name: collection_name.cln_name,
//           encrypted_db_url: dbInfo.encrypted_db_url,
//           db_name: dbInfo.db_name,
//           primary_key: value.name,
//           mode: "0",
//         }
//         var response = await dispatch(retriveClnPrimaryValue(data))
//             if (response.status === 200) {
//               setprimaryKeyValue(response.data.data);
//               setselectedPrimaryKey(value);
//               let updating_layObj_clone = { ...updating_layObj };
//               updating_layObj_clone.selected_primary_key = value;
//               dispatch(updateLayoutInfo(clone_lay));
//               dispatch(updateLayoutData(clone_lay, db_data));
//             }
//       }
//     } catch (error) {
//       console.log("err", error);
//     }
//   };

//   const selectPrimaryValues = (e) => {
//     setselectedPrimaryValue(e);
//     updating_layObj.selected_primary_value = e;
//     dispatch(updateLayoutInfo(clone_lay));
//     dispatch(updateLayoutData(clone_lay, db_data));
//   };

//   const selectXaxis = async (value, mode) => {
//     try {
//       if (mode === "2") {
//         updating_layObj.charts_loaded = false;
//         updating_layObj.chart_progress_count = null;
//         // dispatch(updateLayoutInfo(clone_lay));
//       } else {
//         updating_layObj.charts_loaded = true;
//         // dispatch(updateLayoutInfo(clone_lay));
//       }
//       if (seletedClnName !== undefined) {
//         const data = {
//           collection_name: seletedClnName.cln_name,
//           encrypted_db_url: dbInfo.encrypted_db_url,
//           db_name: dbInfo.db_name,
//           primary_key: selectedPrimaryKey,
//           selected_primary_key: value.name,
//           selected_primary_value: selectedPrimaryValue,
//           chart_position: mode,
//           mode: "1",
//         }
//         if (mode === "1") {
//           updating_layObj.x_axis_key = value;
          
//           blockData.x_axis_key = value

//           dispatch(toggleProcessingState(updating_layObj.i))
//           updating_layObj.chnaged = true;

//           // setXaxisValue(response.data.x_label);
//           setselectedXaxisKey(value);

//           clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
      
//           var clone_lay_mod = [...clone_lay];
//           clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
//           await dispatch(updateLayoutInfo(clone_lay_mod));
//         }
//         if (mode === "2") {
//           // setYaxisValue(response.data.x_label);
//           setselectedYaxisKey(value);
//           blockData.y_axis_key=value
//           updating_layObj.y_axis_key = value;
//           updating_layObj.chnaged = true;
//           updating_layObj.x_axis_label = xaxislabel;
//           updating_layObj.X_axis_value = XaxisValue;
//           updating_layObj.barWidth = barwidth;
//           updating_layObj.chart_name = chartName
//           updating_layObj.math_calc = 'sum'
      

//           clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;


//           dispatch(toggleProcessingState(updating_layObj.i))
     

      
      
//           var clone_lay_mod = [...clone_lay];
//           clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;

//           await    dispatch(updateLayoutInfo(clone_lay_mod));
//             await    dispatch(updateLayoutData(clone_lay_mod, db_data));
//         }
//         // }
//         // });
//       }
//     } catch (error) { }
//   };

//   const handleColorChange = (event) => {
//     updating_layObj.chart_customize_clr = event.hex;
//     clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
//     dispatch(updateLayoutInfo(clone_lay));
//     // dispatch(updateLayoutData(clone_lay, db_data));
//   };


//   const handletext_clr = async (event, i) => {
//     updating_layObj.text_customize_clr = event.target.value;
//     clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
//     dispatch(updateLayoutInfo(clone_lay));
//     dispatch(updateLayoutData(clone_lay, db_data));
//   };

//   //STACK CHART CONFIG PORTION************************!SECTION
//   const setYAxisArrValue = (newValue, index) => {
//     if (yAxisArr?.length > 0) {
//       setCardFielderr((prevArr) => {
//         const updated_AxisArr = [...prevArr];
//         updated_AxisArr[index] = newValue;
//         return updated_AxisArr;
//       })

//       setYAxisArr((prevArr) => {
//         const updated_AxisArr = [...prevArr];
//         updated_AxisArr[index] = newValue;
//         return updated_AxisArr;
//       });
//     } else {
//       setYAxisArr((prevArr) => {
//         const updated_AxisArr = [...prevArr];
//         updated_AxisArr[index] = newValue;
//         return updated_AxisArr;
//       });

//       setCardFielderr((prevArr) => {
//         const updated_AxisArr = [...prevArr];
//         updated_AxisArr[index] = newValue;
//         return updated_AxisArr;
//       })
//     }

//     if (cardFielderr?.[index] !== undefined) {
//       const updatedErrors = [...errors];
//       updatedErrors[index] = { ...updatedErrors[index], error: false };
//       setCardFielderr(updatedErrors)

//     } else {
//       const updatedErrors = [...errors];
//       updatedErrors[index] = { ...updatedErrors[index], error: true };
//       setCardFielderr(updatedErrors)
//     }
//   };

//   const selectXaxis_arr = async (value, mode, indx) => {
//     try {
//       if (seletedClnName !== undefined ) {
        
//               if (mode === "1") {
//                 // setXaxisValue(response.data.x_label);
//                 setselectedXaxisKey(value);
//                 updating_layObj.x_axis_key = value;
//                 blockData.x_axis_key=value


//                 dispatch(toggleProcessingState(updating_layObj.i))
//                 updating_layObj.chnaged = true;



//                 clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
//                 var clone_lay_mod = [...clone_lay];
//                 clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
//                 await      dispatch(updateLayoutInfo(clone_lay_mod));


//               }
//               if (mode === "2") {
//                 // setYaxisValue(response.data.x_label);
//                 setselectedYaxisKey(value);
//                 setYAxisArrValue(value.name, indx);
//                 var updated_AxisArr

//                 setYAxisArr((prevArr) => {
//                    updated_AxisArr = [...prevArr];
//                   updated_AxisArr[indx] = value.name;
//                   updating_layObj.yAxis_arr = updated_AxisArr;
//                    updating_layObj.math_calc = 'sum'
//                   return updated_AxisArr;
//                 });

              



//                 const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));
                
//                 // let data_modified = response.data.x_label;
//                 var AutoColr_arr;
//                 AutoColr_arr = await generateRandomColor(indx + 1);
//                 setColorArr((prevColorArr) => {
//                   const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));
//                   if (!isNaN(blockIdx) && typeof clone_lay[blockIdx] === "object" && clone_lay[blockIdx] !== null) {
//                     let updating_layObj_clone = { ...clone_lay[blockIdx] };
//                     let updatedColorArr = [...prevColorArr];
//                     updatedColorArr[indx] = AutoColr_arr;
//                     if (updating_layObj_clone.chart_customize_clr_arr !== undefined) {
//                       if (AutoColr_arr !== updating_layObj_clone.chart_customize_clr_arr[indx]) {
//                         updating_layObj_clone.chart_customize_clr_arr = [...updatedColorArr];
//                       }
//                     } else {
//                       updating_layObj_clone.chart_customize_clr_arr = updatedColorArr;
//                     }
//                     if (Object.isFrozen(clone_lay)) {
//                       clone_lay = [...clone_lay];
//                     }
//                     clone_lay[blockIdx] = updating_layObj_clone;
//                     // dispatch(updateLayoutInfo(clone_lay));
//                     // dispatch(updateLayoutData(clone_lay, db_data));
//                     return updatedColorArr;
//                   } else {
//                     console.error("Invalid blockIdx or clone_lay[blockIdx] is not an object.");
//                     return prevColorArr;
//                   }
//                 });


//                 updating_layObj.x_axis_key = selectedXaxisKey;
//                 updating_layObj.x_axis_label = xaxislabel;
//                 updating_layObj.add_transition_data = addTransitiondata;
//                 updating_layObj.num_add_axes = numAdditionalAxes;
//                 updating_layObj.yAxis_arr = updated_AxisArr;

              
//                 updating_layObj.chnaged = true;

//                 updating_layObj.X_axis_value = XaxisValue;
//                 updating_layObj.chart_customize_clr_arr = colorArr;
//                 updating_layObj.labelname_arr = labelname_arr;


//                 dispatch(toggleProcessingState(updating_layObj.i))
//                 updating_layObj.chnaged = true;

                
//                 clone_lay[blockIdx] = updating_layObj;

//                     // dispatch(updateLayoutData(clone_lay, db_data));
//                 await    dispatch(updateLayoutInfo(clone_lay));


//               }
//               setShowWarning(false);
//             // }
//       }
//     } catch (error) {
//       console.log("err", error);
//     }
//   };

//   const onselectField = (err, i) => {
//     if (yAxisArr?.[i] !== undefined) {
//       const updatedErrors1 = [...errors];
//       updatedErrors1[i] = { ...updatedErrors1[i], error: false };
//       setErrors(updatedErrors1);
//     } else {
//       const updatedErrors = [...errors];
//       updatedErrors[i] = { ...updatedErrors[i], error: true };
//       setErrors(updatedErrors);
//     }
//     if (cardFielderr?.[i] !== undefined) {
//       const updatedErrors = [...errors];
//       updatedErrors[i] = { ...updatedErrors[i], error: false };
//       setCardFielderr(updatedErrors)
//     } else {
//       const updatedErrors = [...errors];
//       updatedErrors[i] = { ...updatedErrors[i], error: true };
//       setCardFielderr(updatedErrors)
//     }
//   };
  
//   const onClickDelete = (e, index) => {
//     setAddTransitiondata(addTransitiondata - 1);
//     setdeletecard_index(index);
//     delete_card(index);
//   };

//   const handleColorChange_arr = async (event, i) => {
//     const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));
//     setColorArr((prevColorArr) => {
//       if (!isNaN(blockIdx) && typeof clone_lay[blockIdx] === "object" && clone_lay[blockIdx] !== null) {
//         let updating_layObj_clone = { ...clone_lay[blockIdx] };
//         let updatedColorArr = [...prevColorArr];
//         updatedColorArr[i] = event.hex;
//         if (updating_layObj_clone.chart_customize_clr_arr !== undefined) {
//           if (event.hex === updating_layObj_clone.chart_customize_clr_arr[i]) {
//           } else {
//             updating_layObj_clone.chart_customize_clr_arr = [...updatedColorArr];
//             if (Object.isFrozen(clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))])) {
//               clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = [
//                 ...clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))],
//               ];
//             }
//             clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj_clone;
//           }
//         } else {
//           updating_layObj_clone.chart_customize_clr_arr = [...updatedColorArr];
//           clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj_clone;
//         }
//         return updatedColorArr;
//       } else {
//         return prevColorArr;
//       }
//     });
//     dispatch(updateLayoutInfo(clone_lay));
//     dispatch(updateLayoutData(clone_lay, db_data));
//   };

//   const handletext_clr_arr = async (event, i) => {
//     var updatedColorArr = [];
//     setTextClrarr((prevColorArr) => {
//       updatedColorArr = [...prevColorArr];
//       updatedColorArr[i] = event.target.value;
//       updating_layObj.text_customize_clr_arr = updatedColorArr
//       clone_lay[Number(JSON.parse(sessionStorage.getItem('blockIdx')))] = updating_layObj;
//       dispatch(updateLayoutInfo(clone_lay));
//       dispatch(updateLayoutData(clone_lay, db_data));
//       return updatedColorArr;
//     });
//   };

//   const add_axis_data = (e) => {
//     if (selectedXaxisKey === "" || selectedXaxisKey === undefined) {
//       setShowWarning(true);
//     } else if (yAxisArr?.length > 0) {
//       if (labelname_arr.length - 1 === yAxisArr?.length) {
//         setShowWarning(false);
//         setAddTransitiondata(addTransitiondata + 1);
//         setNumAdditionalAxes(numAdditionalAxes + 1);
//         getFieldsName(blockData.selected_cln_name);
//       } else {
//         setShowWarning(true);
//       }
//     } else {
//       setShowWarning(false);
//       setAddTransitiondata(addTransitiondata + 1);
//       setNumAdditionalAxes(numAdditionalAxes + 1);
//       getFieldsName(blockData.selected_cln_name);
//     }
//   };

//   const delete_card = async (remove_index) => {
//     var updatedArray;
//     if (mergedArr.length === 0) {
//       if (blockData.selected_primary_value !== undefined) {
//         let mergedArr_mod = layout[Number(JSON.parse(sessionStorage.getItem("blockIdx")))]["merged_arr"];
//         updatedArray = removeItemByIndex(mergedArr_mod, remove_index);
//       }
//     } else {
//       updatedArray = removeItemByIndex(mergedArr, remove_index);
//     }
//     const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));
//     const labelarr = removeItemByIndex(additionalYLabels, remove_index + 1);
//     const labelname_mod = removeItemByIndex(labelname_arr, remove_index + 1);
//     const colorarr_modified = removeItemByIndex(colorArr, remove_index);
//     const mod_yAxisarr = removeItemByIndex(yAxisArr, remove_index);
//     setNumAdditionalAxes((prev) => {
//       var removed_Axes = prev - 1
//       var updtObj = { ...clone_lay[blockIdx] };
//       updtObj.num_add_axes = numAdditionalAxes - 1;
//       updtObj.add_transition_data = addTransitiondata - 1;
//       updtObj.yAxis_arr = mod_yAxisarr
//       updtObj.label_arr_data = labelname_mod;
//       var updatedLayout = [...clone_lay];
//       updatedLayout[blockIdx] = updtObj;
//       dispatch(updateLayoutInfo(updatedLayout));
//       dispatch(updateLayoutData(updatedLayout, db_data));
//       return removed_Axes;
//     });

//     setlabelname_arr((prevColorArr = []) => {
//       var updatedLabel = [...prevColorArr];
//       updatedLabel = labelname_mod;
//       updating_layObj.label_arr_data = updatedLabel;
//       dispatch(updateLayoutInfo(clone_lay));
//       dispatch(updateLayoutData(clone_lay, db_data));
//       return labelname_mod;
//     });

//     setColorArr((prevColorArr) => {
//       if (!Array.isArray(prevColorArr)) {
//         prevColorArr = [];
//       }
//       const updatedColorArr = colorarr_modified;
//       var updtObj = { ...clone_lay[blockIdx] };
//       updtObj.chart_customize_clr_arr = updatedColorArr;
//       var updatedLayout = [...clone_lay];
//       updatedLayout[blockIdx] = updtObj;
//       dispatch(updateLayoutInfo(updatedLayout));
//       dispatch(updateLayoutData(updatedLayout, db_data));
//       return updatedColorArr;
//     });
//     setcombinedArr([]);
//     setYAxisArr(mod_yAxisarr);
//     setAdditionalYLabels(labelarr);
//     setdataLoaded(false)
//     setTimeout(() => {
//       setdataLoaded(true)
//       setmergedArr(updatedArray);
//     }, 50);
//   };

//   const removeItemByIndex = (dataArray, indexToRemove) => {
//     if (indexToRemove >= 0 && indexToRemove < dataArray.length) {
//       const newArray = [...dataArray];
//       newArray.splice(indexToRemove, 1);
//       return newArray;
//     } else {
//       return dataArray;
//     }
//   };

//   const selectXaxis_pie_chart = async(value, mode) => {
//     try {
       
//             if (mode === "1") {
//               // setXaxisValue(response.data.x_label);


//               updating_layObj.x_axis_key = value;
          
              
//               blockData.x_axis_key = value
//               // updating_layObj.data = []
    
//               // dispatch(toggleProcessingState(updating_layObj.i))
//               updating_layObj.changed = true;
    
//               // setXaxisValue(response.data.x_label);
//               setselectedXaxisKey(value);
    
//               clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
          
//               var clone_lay_mod = [...clone_lay];
//               clone_lay_mod[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
//               await dispatch(updateLayoutInfo(clone_lay_mod));




              
//               // setselectedXaxisKey(value);
//               // setpieData(value);
//             }
//             if (mode === "2") {
//               // setYaxisValue(response.data.x_label);
//               setselectedYaxisKey(value);
//             }
//           // }
//     } catch (error) { }
//   };

//   const curved_lines = (e) => {
//     updating_layObj.curved_line_chrt = e.target.checked;
//     dispatch(updateLayoutInfo(clone_lay));
//     dispatch(updateLayoutData(clone_lay, db_data));
//   };

//   const mouseover_toggle = (e) => {
//     const isChecked = e.target.checked;
//     setShowMouseoverMain(isChecked);
//     if (isChecked) {
//       setShowMouseoverMulti(true);
//       updating_layObj.mouseovered = e.target.checked;
//       updating_layObj.mouseovered_type = !showMouseoverMulti;
//       dispatch(updateLayoutInfo(clone_lay));
//       dispatch(updateLayoutData(clone_lay, db_data));
//     } else {
//       setShowMouseoverMulti(false);
//       updating_layObj.mouseovered = e.target.checked;
//       updating_layObj.mouseovered_type = false;
//       dispatch(updateLayoutInfo(clone_lay));
//       dispatch(updateLayoutData(clone_lay, db_data));
//     }
//   };

//   const mouseover_type = (e) => {
//     setShowMouseoverMulti(!showMouseoverMulti);
//     updating_layObj.mouseovered_type = e.target.checked;
//     dispatch(updateLayoutInfo(clone_lay));
//     dispatch(updateLayoutData(clone_lay, db_data));
//   };

//   const OnChangeWidth = (e) => {
//     setBarWidth(e.target.value)
//     updating_layObj.barWidth = e.target.value;
//     dispatch(updateLayoutInfo(clone_lay));
//     dispatch(updateLayoutData(clone_lay, db_data));
//   }
//   const resetwidth = () => {
//     console.log("resetwidth");
//     setBarWidth(undefined)
//     updating_layObj.barWidth = undefined;
//     dispatch(updateLayoutInfo(clone_lay));
//     dispatch(updateLayoutData(clone_lay, db_data));
//   }
//   const show_bar_val = (e) => {
//     setshowvalues(!showvalues);
//     updating_layObj.show_bar_values = e.target.checked;
//     dispatch(updateLayoutInfo(clone_lay));
//     dispatch(updateLayoutData(clone_lay, db_data));
//   };

//   const show_line = (e) => {
//     setshowLine(e.target.checked);
//     updating_layObj.show_Line = e.target.checked;
//     dispatch(updateLayoutInfo(clone_lay));
//     dispatch(updateLayoutData(clone_lay, db_data));
//   };

//   const show_table = async (e) => {
//     try {
//       const blockIdx = Number(JSON.parse(sessionStorage.getItem("blockIdx")));
//       const blockdata = Number(JSON.parse(sessionStorage.getItem("blockdata")));
//       const updatedLayout = [...layout]; // Assuming layout is an array
//       props.show_table_function(e, blockdata, blockIdx, layout);
//     } catch (error) {
//     }
//   };

//   const show_Grid = (e) => {
//     setshow_grid_toggle(e.target.checked);
//     updating_layObj.show_Grid = e.target.checked;
//     dispatch(updateLayoutInfo(clone_lay));
//     dispatch(updateLayoutData(clone_lay, db_data));
//   };

//   const handleFormatToggle = (format, val) => {
//     if (val === "1") {
//       switch (format) {
//         case "bold":
//           setBold(!bold);
//           updating_layObj.label_bold = !bold;
//           dispatch(updateLayoutInfo(clone_lay));
//           dispatch(updateLayoutData(clone_lay, db_data));
//           break;
//         case "italic":
//           setItalic(!italic);
//           updating_layObj.label_italic = !italic;
//           dispatch(updateLayoutInfo(clone_lay));
//           dispatch(updateLayoutData(clone_lay, db_data));
//           break;
//         case "underline":
//           setUnderline(!underline);
//           updating_layObj.label_underline = !underline;
//           dispatch(updateLayoutInfo(clone_lay));
//           dispatch(updateLayoutData(clone_lay, db_data));
//           break;
//         default:
//           break;
//       }
//     } else {
//       switch (format) {
//         case "bold":
//           setBold(!bold);
//           updating_layObj.value_bold = !bold;
//           dispatch(updateLayoutInfo(clone_lay));
//           dispatch(updateLayoutData(clone_lay, db_data));
//           break;
//         case "italic":
//           setItalic(!italic);
//           updating_layObj.value_italic = !italic;
//           dispatch(updateLayoutInfo(clone_lay));
//           dispatch(updateLayoutData(clone_lay, db_data));
//           break;
//         case "underline":
//           setUnderline(!underline);
//           updating_layObj.value_underline = !underline;
//           dispatch(updateLayoutInfo(clone_lay));
//           dispatch(updateLayoutData(clone_lay, db_data));
//           break;
//         default:
//           break;
//       }
//     }
//   };

//   const label_mod = (e) => {
//     updating_layObj.text = e.target.value;
//     dispatch(updateLayoutInfo(clone_lay));
//     dispatch(updateLayoutData(clone_lay, db_data));
//   };

//   const handleFontSizeChange = (selectedSize, val) => {
//     setFontSize(selectedSize);
//     if (val === "1") {
//       updating_layObj.label_fontsize = selectedSize;
//       dispatch(updateLayoutInfo(clone_lay));
//       dispatch(updateLayoutData(clone_lay, db_data));
//     } else {
//       updating_layObj.value_fontsize = selectedSize;
//       dispatch(updateLayoutInfo(clone_lay));
//       dispatch(updateLayoutData(clone_lay, db_data));
//     }
//   };

//   const handleFontColorChange = (selectedColor, val) => {
//     setFontColor(selectedColor);
//     if (val === "1") {
//       updating_layObj.label_fontColor = selectedColor;
//       dispatch(updateLayoutInfo(clone_lay));
//       dispatch(updateLayoutData(clone_lay, db_data));
//     } else {
//       updating_layObj.value_fontColor = selectedColor;
//       dispatch(updateLayoutInfo(clone_lay));
//       dispatch(updateLayoutData(clone_lay, db_data));
//     }
//   };

//   const selectcard_field_name = async (value, mode) => {
//     setshowWarningCard(false);
//     settempselectedYaxisKey(value);
//     try {
//       const data = {
//         collection_name: authInfo.cln_list[0].cln_name,
//         encrypted_db_url: dbInfo.encrypted_db_url,
//         db_name: dbInfo.db_name,
//         primary_key: selectedPrimaryKey,
//         selected_primary_key: value.name,
//         selected_primary_value: selectedPrimaryValue,
//         chart_position: mode,
//         mode: "1",

//       }

//       var response = await dispatch(retriveClnPrimaryValue(data))

//       if (response.status === 200) {
//         if (mode === "1") {
//           setXaxisValue(response.data.x_label);
//           setselectedXaxisKey(value);
//           setTimeout(() => {
//             setcardData(value);
//             setpreferedSelected(true);
//           }, 1000);
//         }
//       }
//     } catch (error) { }
//   };

//   const onChangePrefered_Calc = (e) => {
//     setSelectedCalc(e);
//     setTimeout(() => {
//       setcardData(e);
//     }, 500);
//   };

//   const handleDecimalPlacesChange = (event) => {
//     const value = parseInt(event.target.value, 10);
//     setdecimalDigitsCount(value);
//     setDecimalPlaces(value);
//     const formatted = formatDecimal(cardDatavalue, value);
//     setFormattedValue(formatted);
//     updating_layObj.count = formatted;
//     updating_layObj.decimal_count = value;
//     dispatch(updateLayoutInfo(clone_lay));
//     dispatch(updateLayoutData(clone_lay, db_data));
//   };

//   const formatDecimal = (value, places) => {
//     const parsedValue = parseFloat(value);
//     if (!isNaN(parsedValue)) {
//       return parsedValue.toFixed(places);
//     }
//     return "";
//   };

//   const InputLabelName =async (e, indx) => {
//     const newValue = e.target.value.trim();
//     if (newValue !== "") {
//       setlabelname_arr((prevColorArr = []) => {
//         const updatedLabelArr = [...prevColorArr];
//         updatedLabelArr[indx + 1] = newValue;
//         const updatedObj = {
//           ...updating_layObj,
//           label_arr_data: updatedLabelArr,
//         };
//         const cloned = [...clone_lay];
//         cloned[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updatedObj;
//         dispatch(updateLayoutInfo(cloned));
//         dispatch(updateLayoutData(cloned, db_data));
//         return updatedLabelArr;
//       });
//     }
//   };

//   const Add_table_label = (e) => {
//     const newValue = e.target.value.trim();
//     setlabelname_arr((prevColorArr = []) => {
//       const updatedLabelArr = [...prevColorArr];
//       updatedLabelArr[0] = newValue;
//       updating_layObj.label_arr_data = updatedLabelArr;
//       dispatch(updateLayoutInfo(clone_lay));
//       dispatch(updateLayoutData(clone_lay, db_data));
//       return updatedLabelArr;
//     });
//   };
//   const Addaxislabel = async (e, name) => {
//     const newValue = e.target.value.trim();
//     if (name === "x") {
//       updating_layObj.x_axis_label = newValue;
//       setxaxislabel(newValue);
//     } else {
//       updating_layObj.y_axis_label = newValue;
//       blockData.y_axis_label = newValue
//       setyaxislabel(newValue);

//       // clone_lay[Number(JSON.parse(sessionStorage.getItem("blockIdx")))] = updating_layObj;
//     }
//     // dispatch(updateLayoutInfo(clone_lay));
//     // dispatch(updateLayoutData(clone_lay, db_data));
//   };

//   const show_square = (e) => {
//     setshowSquare(!showSquare);
//     updating_layObj.show_Square = e.target.checked;
//     dispatch(updateLayoutInfo(clone_lay));
//     dispatch(updateLayoutData(clone_lay, db_data));
//   };
//   const show_node = (e) => {
//     setshownode(!shownode);
//     updating_layObj.show_node = e.target.checked;
//     dispatch(updateLayoutInfo(clone_lay));
//     dispatch(updateLayoutData(clone_lay, db_data));
//   };

//   const sidepanelclose = () => {
//     console.log("sidepanelclose");
//     updating_layObj.selected_primary_key = selectedPrimaryKey;
//     updating_layObj.selected_primary_value = selectedPrimaryValue;
//     updating_layObj.X_axis_value = XaxisValue;


//     updating_layObj.y_axis_key = selectedYaxisKey;
//     updating_layObj.x_axis_label = xaxislabel;
//     // dispatch(toggleProcessingState(updating_layObj.i))
    

//     updating_layObj.y_axis_label = yaxislabel;

//     // updating_layObj.X_axis_value = XaxisValue;
//     updating_layObj.barWidth = barwidth;
//     updating_layObj.chart_name = chartName;
//     // updating_layObj.chnaged = true;

    

//     updateLayout(layout);
//     if (yAxisArr?.length > 0) {
//       if (labelname_arr.length - 1 === yAxisArr?.length) {
//         setShowWarning(false);
//         updating_layObj.num_add_axes = numAdditionalAxes;
//         updating_layObj.x_axis_key = selectedXaxisKey;
//         updating_layObj.add_transition_data = addTransitiondata;
//         updating_layObj.yAxis_arr = yAxisArr;
//         // updating_layObj.merged_arr = mergedArr;
//         updating_layObj.x_axis_label = xaxislabel;
//         updating_layObj.label_arr_data = labelname_arr;
//         dispatch(updateLayoutData(clone_lay, db_data));
//         onClose();
//       } else {
//         setShowWarning(true);
//       }
//     } else {
//       dispatch(updateLayoutData(clone_lay, db_data));

//       onClose();
//     }
//   };

//   const generateRandomColor = async (indx) => {
//     const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16); // Generate random hex color
//     return randomColor;
//   };





//   const mathOperation  = ( name ) =>{
//     console.log('mathOperation e :>> ',  name );
//     setSelectedValue(name);

//     // setshowSquare(!showSquare);
//     updating_layObj.math_calc = name;
//     console.log('mathOperation updating_layObj :>> ', updating_layObj , Number(JSON.parse(sessionStorage.getItem("blockIdx"))));
//     dispatch(
//       updateLayoutInfo({
//         index: Number(JSON.parse(sessionStorage.getItem("blockIdx"))),
//         updatedObject: updating_layObj,
//       })
//     )
//     // dispatch(updateLayoutInfo(clone_lay ));
//     dispatch(updateLayoutData(clone_lay, db_data));




//   }
//   return (
//     dataLoaded && (

//       <>
//         <Offcanvas isOpen={isOpen} toggle={() => { sidepanelclose() }} direction="end" style={{ width: '700px', zoom: 0.9 }}>
//           <OffcanvasHeader toggle={() => { sidepanelclose() }}>Drawer Title</OffcanvasHeader>
//           <OffcanvasBody className="pt-0" >
//             <>
//               <Row>
//                 <Col>

//                   {props.data.name === "rectangle_card" ?
//                   <>
//                       <Card style={{ margin: '20px', backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} >

//                         <CardBody>
//                           <Row className="mb-3">
//                             <Col md={6}>
//                               <Label className="fw-bold" style={{ fontSize: "14px" }}>Field Name 1:</Label>
//                               <Select
//                                 placeholder="Enter Field name..."
//                                 classNamePrefix="react-select"
//                                 options={primaryKey}
//                                 getOptionLabel={(option) => option.name}
//                                 onChange={(e) => selectcard_field_name(e, "1")}
//                                 value={tempselectedYaxisKey}
//                                 styles={{
//                                   control: (base) => ({
//                                     ...base,
//                                     borderColor: showWarningCard ? "red" : "#ced4da",
//                                   }),
//                                 }}
//                               />
//                               {showWarningCard && (
//                                 <span style={{ color: "red", fontSize: "12px" }}>
//                                   Please re-select the correct fields.
//                                 </span>
//                               )}
//                             </Col>
//                           </Row>

//                           {!preferedSelected && (
//                             <Row className="mb-3">
//                               <Col md={6}>
//                                 <Label style={{ fontWeight: "bold", fontSize: "14px" }}>Preferred:</Label>
//                                 <Select
//                                   classNamePrefix="react-select"
//                                   options={prefered_selection}
//                                   getOptionLabel={(option) => option.value}
//                                   onChange={(e) => onChangePrefered_Calc(e)}
//                                   value={
//                                     Object.keys(selectedCalc).length === 0
//                                       ? { name: "COUNT", value: "Total Count" }
//                                       : selectedCalc
//                                   }
//                                 />
//                               </Col>
//                               <Col md={6}>
//                                 <Label className="fw-bold" style={{ fontSize: "14px" }}>Text Label:</Label>
//                                 <Input
//                                   type="text"
//                                   placeholder="Enter Text Label..."
//                                   name="bar"
//                                   defaultValue={props.data.text}
//                                   onChange={(e) => label_mod(e)}
//                                   style={{
//                                     padding: "8px",
//                                     borderRadius: "5px",
//                                     borderColor: "#ced4da",
//                                   }}
//                                 />
//                               </Col>
//                             </Row>
//                           )}

//                           <Row className="mb-3">
//                             <div className="mt-3 d-flex gap-3">
//                               <button
//                                 className={`btn ${bold ? "active btn-primary" : "btn-light"}`}
//                                 onClick={() => handleFormatToggle("bold", "1")}
//                                 style={{ fontWeight: bold ? "bold" : "normal" }}
//                               >
//                                 <b>B</b>
//                               </button>
//                               <button
//                                 className={`btn ${italic ? "active btn-success" : "btn-light"}`}
//                                 onClick={() => handleFormatToggle("italic", "1")}
//                                 style={{ fontStyle: italic ? "italic" : "normal" }}
//                               >
//                                 <i>I</i>
//                               </button>
//                               <button
//                                 className={`btn ${underline ? "active btn-info" : "btn-light"}`}
//                                 onClick={() => handleFormatToggle("underline", "1")}
//                                 style={{
//                                   textDecoration: underline ? "underline" : "none",
//                                 }}
//                               >
//                                 <u>U</u>
//                               </button>
//                             </div>

//                           </Row>

//                           <Row className="mb-3">
//                             <div className="font-size-controls d-flex align-items-center">
//                               <Label
//                                 htmlFor="fontSizeDropdown"
//                                 style={{ marginBottom:'0px', marginRight: "10px", fontWeight: "bold", fontSize: "14px" }}
//                               >
//                                 Font Size:
//                               </Label>
//                               <select
//                                 id="fontSizeDropdown"
//                                 value={fontSize}
//                                 onChange={(e) => handleFontSizeChange(parseInt(e.target.value), "1")}
//                                 style={{
//                                   padding: "5px",
//                                   borderRadius: "5px",
//                                   borderColor: "#ced4da",
//                                 }}
//                               >
//                                 <option value={12}>12px</option>
//                                 <option value={16}>16px</option>
//                                 <option value={20}>20px</option>
//                                 <option value={24}>24px</option>
//                               </select>
//                             </div>
//                           </Row>

//                           <Row>
//                             <div className="font-color-controls d-flex align-items-center">
//                               <Label
//                                 htmlFor="fontColorPicker"
//                                 style={{ marginBottom:'0px', marginRight: "10px", fontWeight: "bold", fontSize: "14px" }}
//                               >
//                                 Font Color:
//                               </Label>
//                               <input
//                                 type="color"
//                                 id="fontColorPicker"
//                                 value={fontColor}
//                                 onChange={(e) => handleFontColorChange(e.target.value, "1")}
//                                 style={{
//                                   padding: "2px",
//                                   border: "none",
//                                   borderRadius: "5px",
//                                 }}
//                               />
//                             </div>
//                           </Row>
//                         </CardBody>


                  
//                       </Card>


//                       <Card style={{ margin: '20px', backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} >
//                       <CardBody>
//                           <Row className="mt-3">
//                             <Col>
//                               <h6>
//                                 <b>Count value :</b>
//                               </h6>
//                               <Input
//                                 type="text"
//                                 value={formattedValue}
//                                 placeholder="Enter count..."
//                                 style={{padding: "8px"}}
//                               />
//                             </Col>
//                           </Row>
//                           <div className="my-3 d-flex gap-3">
//                             <button
//                               className={`btn ${bold ? "active btn-primary" : "btn-light"}`}
//                               onClick={() => handleFormatToggle("bold", "2")}
//                             >
//                               <b>B</b>
//                             </button>
//                             <button
//                               className={`btn ${italic ? "active btn-success" : "btn-light"}`}
//                               onClick={() => handleFormatToggle("italic", "2")}
//                             >
//                               <i>I</i>
//                             </button>
//                             <button
//                               className={`btn ${underline ? "active btn-info" : "btn-light"}`}
//                               onClick={() => handleFormatToggle("underline", "2")}
//                             >
//                               <u>U</u>
//                             </button>
//                           </div>
//                           <Row className="mb-3">
//                             <div className="font-size-controls d-flex align-items-center">
//                               <Label
//                                 htmlFor="fontSizeDropdown"
//                                 style={{ marginBottom:'0px', marginRight: "10px", fontWeight: "bold", fontSize: "14px" }}
//                               >
//                                 Font Size:
//                               </Label>
//                               <select
//                                 id="fontSizeDropdown"
//                                 value={fontSize}
//                                 onChange={(e) => handleFontSizeChange(parseInt(e.target.value), "1")}
//                                 style={{
//                                   padding: "5px",
//                                   borderRadius: "5px",
//                                   borderColor: "#ced4da",
//                                 }}
//                               >
//                                 <option value={12}>12px</option>
//                                 <option value={16}>16px</option>
//                                 <option value={20}>20px</option>
//                                 <option value={24}>24px</option>
//                               </select>
//                             </div>
//                           </Row>
//                           <Row>
//                             <div className="font-color-controls d-flex align-items-center">
//                               <Label
//                                 htmlFor="fontColorPicker"
//                                 style={{ marginBottom:'0px', marginRight: "10px", fontWeight: "bold", fontSize: "14px" }}
//                               >
//                                 Font Color:
//                               </Label>
//                               <input
//                                 type="color"
//                                 id="fontColorPicker"
//                                 value={fontColor}
//                                 onChange={(e) => handleFontColorChange(e.target.value, "1")}
//                                 style={{
//                                   padding: "2px",
//                                   border: "none",
//                                   borderRadius: "5px",
//                                 }}
//                               />
//                             </div>
//                           </Row>
//                         </CardBody>

//                       </Card>

                 



//                     </>
//                     :
//                     <>
//                       <Card>
//                         <CardBody>
//                           <>


//                             {props.data.name !== "pie_chart" ? (
//                               <>
//                                 <Card style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} >
//                                   <CardBody>
//                                     <Row className="mb-3">
//                                       <Col md={6}>
//                                         <Label>{props.data.name != "table" ? "Chart Name" : "Table Name"}:</Label>
//                                         <Input type="text" placeholder="Enter Chart Name" name="bar" maxLength={15} defaultValue={chartName}
//                                           onChange={(e) => { setChartName(e.target.value); updating_layObj.chart_name = e.target.value; dispatch(updateLayoutInfo(clone_lay)); dispatch(updateLayoutData(clone_lay, db_data)) }} />
//                                       </Col>
//                                     </Row>
//                                     <Row className="">
//                                       <Col md={6}>
//                                         <Label> {props.data.name === "table" ? "Choose Table Column" : "X Axis field"}: </Label>
//                                         <Select classNamePrefix="react-select" options={primaryKey} getOptionLabel={(option) => option.name}   value={ selectedXaxisKey || blockData.x_axis_key }
//                                           onChange={(e) => { props.data.name === "bar_charts" ? selectXaxis(e, "1") : selectXaxis_arr(e, "1"); }} />
//                                       </Col>
//                                       <Col md={6}>
//                                         <Label> {props.data.name === "table" ? "Column Label" : "X Axis Label"}: </Label>
//                                         <Input type="text" defaultValue={props.data.name === "table" ? labelname_arr?.[0] : xaxislabel !== undefined ? xaxislabel : "label"}
//                                           onChange={(e) => { props.data.name === "table" ? Add_table_label(e) : Addaxislabel(e, "x"); }} required />
//                                       </Col>
//                                     </Row>
//                                   </CardBody>
//                                 </Card>
//                               </>
//                             )
//                               : (
//                                 <>
//                                   <Card style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} >
//                                     <CardBody>
//                                       {/* <Row className="mb-3">
//                                         <Col md={6}>
//                                           <Label>{props.data.name != "table" ? "Chart Name" : "Table Name"}:</Label>
//                                           <Input type="text" placeholder="Enter Chart Name" name="bar" maxLength={15} defaultValue={chartName}
//                                             onChange={(e) => { setChartName(e.target.value); updating_layObj.chart_name = e.target.value; dispatch(updateLayoutInfo(clone_lay)); dispatch(updateLayoutData(clone_lay, db_data)) }} />
//                                         </Col>
//                                       </Row> */}
//                                       <Row>
//                                         <Col md={6}>
//                                           <Label>{props.data.name != "table" ? "Chart Name" : "Table Name"}:</Label>
//                                           <Input type="text" placeholder="Enter Chart Name" name="bar" maxLength={15} defaultValue={chartName}
//                                             onChange={(e) => { setChartName(e.target.value); updating_layObj.chart_name = e.target.value; dispatch(updateLayoutInfo(clone_lay)); dispatch(updateLayoutData(clone_lay, db_data)) }} />
//                                         </Col>
//                                         <Col md={6}>
//                                           <Label>Field name1:</Label>
//                                           <Select classNamePrefix="react-select" options={primaryKey} getOptionLabel={(option) => option.name}
//                                             onChange={(e) => { selectXaxis_pie_chart(e, "1"); }} value={selectedXaxisKey != "" ? selectedXaxisKey : blockData.x_axis_key} />
//                                         </Col>
//                                       </Row>
//                                     </CardBody>
//                                   </Card>

//                                 </>
//                               )}

// {/* 
//                             {props.data.name === "bar_charts" || props.data.name === "hor_barcharts" &&
//                               <>
//                                 <Row>
//                                   <Col md={6}>
//                                     <Label>Y Axis field:</Label>
//                                     <div>
//                                       <Select classNamePrefix="react-select" options={primaryKeyYaxis} getOptionLabel={(option) => option.name} onChange={(e) => { selectXaxis(e, "2") }} value={props.data.y_axis_key} />
//                                     </div>
//                                   </Col>
//                                   <Col md={6}>
//                                     <Label>Y Axis Label:</Label>
//                                     <div>
//                                       <Input type="text" maxLength={15} onChange={(e) => Addaxislabel(e, "y")} defaultValue={yaxislabel !== undefined ? yaxislabel : "Ylabel"} />
//                                     </div>
//                                   </Col>
//                                 </Row>
//                               </>
//                             } */}



//                             {props.data.name === "bar_charts" || props.data.name === "hor_barcharts" ? (
//                               <>
//                                 <Card className="" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
//                                   <CardBody>
//                                     <Row>
//                                       <Col md={6}>
//                                         <Label>Y Axis field:</Label>
//                                         <div>
//                                           <Select classNamePrefix="react-select" options={primaryKeyYaxis} getOptionLabel={(option) => option.name} onChange={(e) => { selectXaxis(e, "2") }} value={props.data.y_axis_key} />
//                                         </div>
//                                       </Col>
//                                       <Col md={6}>
//                                         <Label>Y Axis Label:</Label>
//                                         <div>
//                                           <Input type="text" maxLength={15} onChange={(e) => Addaxislabel(e, "y")} defaultValue={yaxislabel !== undefined ? yaxislabel : "Ylabel"} />
//                                         </div>
//                                       </Col>
//                                     </Row>

//                                     <Row className="my-2">
//                                       <Col md={6}>
//                                         <Label>Choose Bar Color</Label>
//                                         <CompactPicker color={blockData.chart_customize_clr} onChange={(e) => { handleColorChange(e); }} />
//                                       </Col>
//                                       <Col md={6}>
//                                         <Label>Choose Text Color</Label>
//                                         <div>
//                                           <input type="color" id="textColor" name="textColor" onChange={(e) => handletext_clr(e)} />
//                                         </div>
//                                       </Col>
//                                     </Row>


//                                   </CardBody>
//                                 </Card>

//                               </>
//                             ) : (
//                               <div style={{ overflowY: "auto" }} >
//                                 {[...Array(numAdditionalAxes)].map((_, i) => (
//                                   <Card key={i} style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
//                                     <CardBody>

//                                       <Row>
//                                         <Col className="text-end">
//                                           {i > 0 && (
//                                             <div className="btn btn-sm btn-soft-danger" onClick={(e) => { onClickDelete(e, i); }} >
//                                               <i className="mdi mdi-delete-outline" id="deletetooltip" />
//                                               <UncontrolledTooltip placement="top" target="deletetooltip">
//                                                 Delete
//                                               </UncontrolledTooltip>
//                                             </div>
//                                           )}
//                                         </Col>
//                                       </Row>
//                                       <Row className="mb-3">
//                                         <Col md={6}>
//                                           <Label>{props.data.name === "table" ? "Choose Column" : "Additional Y-axis Field"}{" "} {i + 1}:</Label>
//                                           <Select value={yAxisArr !== undefined && yAxisArr.length > 0 ? { name: yAxisArr[i] } : { name: "Select...", }}
//                                             options={primaryKeyYaxis} getOptionLabel={(option) => option.name} onChange={(e) => { selectXaxis_arr(e, "2", i) }}
//                                             onBlur={() => onselectField(errors, i)} />

//                                           {(cardFielderr?.[i]?.error) ? (
//                                             <span style={{ color: "red" }}>Please select an option</span>
//                                           ) :
//                                             null}
//                                         </Col>
//                                         <Col md={6}>
//                                           <Label> {props.data.name === "table" ? "Column Label" : "Additional Y-axis Label"} {i + 1} :</Label>
//                                           <Input
//                                             type="text"
//                                             placeholder={`Enter label Name ${i + 1}`}
//                                             maxLength={15}
//                                             name={`additional_y_label_${i}`}
//                                             onChange={(e) => {
//                                               InputLabelName(e, i);
//                                             }}
//                                             defaultValue={labelname_arr !== undefined ? labelname_arr[i + 1] : "label"}
//                                             disabled={yAxisArr !== undefined && yAxisArr[i] ? false : true}
//                                           />
//                                         </Col>
//                                       </Row>

//                                       {props.data.name !== "table" && (
//                                         <>
//                                           <Row>
//                                             <Col md={6}>
//                                               <Label>Choose a Bar Color {i + 1}:</Label>
//                                               <TwitterPicker color={colorArr !== undefined && colorArr.length !== 0 ? colorArr[i - 1] : []} disabled={!(yAxisArr !== undefined && yAxisArr[i])}
//                                                 onChange={(e) => !(yAxisArr !== undefined && yAxisArr[i]) ? setShowWarning(true) : handleColorChange_arr(e, i)} />
//                                             </Col>
//                                             <Col md={6}>
//                                               <Label>Choose Text Color  {i + 1} :</Label>
//                                               <div>
//                                                 <input type="color" id="textColor" name="textColor" onChange={(e) => handletext_clr_arr(e, i)} />
//                                               </div>
//                                             </Col>
//                                           </Row>
//                                         </>
//                                       )}
//                                     </CardBody>
//                                   </Card>
//                                 ))}
//                               </div>
//                             )}
//                           </>


//                           {props.data.name === "pie_chart" || props.data.name === "bar_charts" || props.data.name === "hor_barcharts" ?
//                             <>
//                             </>
//                             :
//                             <>
//                               <div className="settings-row">
//                                 <button className="btn btn-sm btn-primary"
//                                   onClick={(e) => addTransitiondata === yAxisArr?.length ? add_axis_data(e) : setShowWarning(true)}
//                                   disabled={props.data.name === "table" ? labelname_arr?.length > 0 ? false : true : xaxislabel !== undefined && xaxislabel !== "" ? false : true} >
//                                   {props.data.name === "table" ? "Add Column" : "Add"} +
//                                 </button>
//                               </div>
//                               <div> {showWarning && <span className="warning-message">Please fill out the required fields</span>} </div>
//                             </>
//                           }



//                           <Card style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
//                             <CardBody>
//                               {props.data.name !== "area_chart" && props.data.name !== "Vertical_linechart" && props.data.name !== "line_chart" &&
//                                 props.data.name !== "pie_chart" && props.data.name !== "table" && props.data.name !== "hor_barcharts" && props.data.name !== "hor_stack" && props.data.name !== "hor_barcharts" && (
//                                   <Row className="mb-3">
//                                     {
//                                       console.log('blockdata :>> ', blockData, barwidth, blockData.containerWidth)
//                                     }
//                                     <Col md={6}>
//                                       <Label>Bar Width:</Label>
//                                       <Input type="text" min={10} 
//                                       // max={blockData.containerWidth} 
//                                       maxLength={4} onChange={(e) => OnChangeWidth(e)} value={barwidth !== undefined ? barwidth : (blockData.containerWidth)} />

//                                     </Col>
//                                     <Col >
//                                       <i className="bx bx-revision icon-hover" title="Reset Width"   style={{ fontSize: '18px' }}  onClick={()=> resetwidth()} />
//                                     </Col>
//                                   </Row>
//                                 )}


//                               {
//                               // props.data.name !== "area_chart" && props.data.name !== "Vertical_linechart" && props.data.name !== "line_chart" &&
//                                 props.data.name !== "pie_chart" 
//                                 // && props.data.name !== "table" && props.data.name !== "hor_barcharts" && props.data.name !== "hor_stack" && props.data.name !== "hor_barcharts"
//                                  && (
//                                   <Row className="mb-3">
//                                     <Col md={6}>
//                                       <Label>Calculation:</Label>
//                                       <select
//                                         className="form-control"
//                                         onChange={(e) => mathOperation(e.target.value)}
//                                         // defaultValue={props.math_calc || "sum"}
//                                         value={selectedValue} // Bind state to the dropdown value
//                                       >
//                                         {/* <option value="" disabled>
//                                           Select Calculation
//                                         </option> */}
//                                         {report_math_operations.map((operation) => (
//                                           <option key={operation.id} value={operation.name.toLowerCase()}>
//                                             {operation.name}
//                                           </option>
//                                         ))}
//                                       </select>
//                                     </Col>    
//                                   </Row>
//                                 )}


//                               {(props.data.name === "pie_chart" || props.data.name ===  "bar_charts"|| props.data.name === "hor_barcharts" )&& ( 
//                                 <div className="settings-row">
//                                   <div className="form-check form-switch form-switch-md">
//                                     <input type="checkbox" className="form-check-input" id="pieMouseover" defaultChecked={blockData.mouseovered} onClick={(e) => mouseover_toggle(e)} />
//                                     <label className="form-check-label" htmlFor="pieMouseover">
//                                       Mouseover
//                                     </label>
//                                   </div>
//                                 </div>
//                               )}



//                               {XaxisValue !== "" && props.data.name !== "bar_charts" && props.data.name !== "pie_chart" && props.data.name !== "hor_barcharts" && (
//                                 <>
//                                   {props.data.name !== "bar_charts" && props.data.name !== "pie_chart" && props.data.name !== "table" && (
//                                     <>

//                                       {/* <div className="settings-row" style={{ display: 'block' }}>
//                                         <div className="form-check form-switch form-switch-md">
//                                           <input type="checkbox" className="form-check-input" id="customSwitchsizemd" onClick={(e) => mouseover_toggle(e)} defaultChecked={blockData.mouseovered} />
//                                           <label className="form-check-label" htmlFor="customSwitchsizemd"> Mouseover </label>
//                                         </div>

//                                         {showMouseoverMain && (
//                                           <>
//                                             <Row>
//                                               <Col md={6}>
//                                                 <div className=" my-1" style={{ padding: '10px' }}>
//                                                   <div className="settings-section m-0 pb-0">
//                                                     <div className="settings-row">
//                                                       <div className=" square-switch">
//                                                         <input type="checkbox" id="square-switch1" className="switch" defaultChecked={showMouseoverMulti || blockData.mouseovered_type} onChange={(e) => mouseover_type(e)} />
//                                                         <label htmlFor="square-switch1" data-on-label="Single" data-off-label="Multi" />
//                                                       </div>
//                                                     </div>
//                                                   </div>
//                                                 </div>
//                                               </Col>
//                                             </Row>
//                                           </>
//                                         )}


//                                       </div> */}

//                                       <div className="settings-row" style={{ display: 'block' }}>
//                                         <div className="form-check form-switch form-switch-md">
//                                           <input type="checkbox" className="form-check-input" id="customSwitchsizemd" onClick={(e) => mouseover_toggle(e)} defaultChecked={blockData.mouseovered} />
//                                           <label className="form-check-label" htmlFor="customSwitchsizemd"> Mouseover </label>
//                                         </div>

//                                         {showMouseoverMain && (
//                                           <>
//                                             <Row>
//                                               <Col md={5}>

//                                                 <div className="my-1">
//                                                   <div className="settings-section" style={{ padding: '10px', background: '#d3d3d342' }}>
//                                                     <div className="radio-buttons">
//                                                       <div className="form-check mb-2">
//                                                         <input type="radio" id="radio-single" name="mouseover-type" value="single" className="form-check-input custom-radio"
//                                                           defaultChecked={blockData.mouseovered_type === 'single'} onChange={(e) => mouseover_type(e)} />
//                                                         <label className="form-check-label" htmlFor="radio-single">
//                                                           Single Mouseover
//                                                         </label>
//                                                       </div>
//                                                       <div className="form-check">
//                                                         <input type="radio" id="radio-multi" name="mouseover-type" value="multi" className="form-check-input custom-radio"
//                                                           defaultChecked={blockData.mouseovered_type === 'multi'} onChange={(e) => mouseover_type(e)} />
//                                                         <label className="form-check-label" htmlFor="radio-multi">
//                                                           Multi Mouseover
//                                                         </label>
//                                                       </div>
//                                                     </div>
//                                                   </div>
//                                                 </div>


//                                                 {/* <div className="my-1" >
//                                                   <div className="settings-section " style={{ padding: '10px', background: '#d3d3d342' }}>
//                                                     <div className="radio-buttons">
//                                                       <div className="form-check mb-2">
//                                                         <input type="radio" id="radio-single" name="mouseover-type" value="single" className="form-check-input"
//                                                           defaultChecked={blockData.mouseovered_type === 'single'} onChange={(e) => mouseover_type(e)} />
//                                                         <label className="form-check-label" htmlFor="radio-single">Single Mouseover</label>
//                                                       </div>
//                                                       <div className="form-check">
//                                                         <input type="radio" id="radio-multi" name="mouseover-type" value="multi" className="form-check-input"
//                                                           defaultChecked={blockData.mouseovered_type === 'multi'} onChange={(e) => mouseover_type(e)} />
//                                                         <label className="form-check-label" htmlFor="radio-multi">Multi Mouseover</label>
//                                                       </div>
//                                                     </div>
//                                                   </div>
//                                                 </div> */}
//                                               </Col>
//                                             </Row>
//                                           </>
//                                         )}
//                                       </div>




//                                     </>
//                                   )}
//                                 </>
//                               )}


//                               { ( props.data.name === "line_chart" ||   props.data.name === "area_chart" )  && (
//                                 <div className="settings-row">
//                                   <div className="form-check form-switch form-switch-md">
//                                     <input type="checkbox" className="form-check-input" id="squareNode" defaultChecked={showSquare} onClick={(e) => show_square(e)} />
//                                     <label className="form-check-label" htmlFor="squareNode">
//                                       Show circle node
//                                     </label>
//                                   </div>
//                                 </div>
//                               )}

//                               {props.data.name !== "table" && (
//                                 <>
//                                   <div className="settings-row">
//                                     <div className="form-check form-switch form-switch-md">
//                                       <input type="checkbox" className="form-check-input" id="valueText" defaultChecked={blockData.show_bar_values} onClick={(e) => show_bar_val(e)} />
//                                       <label className="form-check-label" htmlFor="valueText"> Show Values as Text </label>
//                                     </div>
//                                   </div>

//                                   {props.data.name !== "pie_chart" && props.data.name !== "line_chart" && props.data.name !== "Vertical_linechart" && props.data.name !== "area_chart" && (
//                                     <div className="settings-row">
//                                       <div className="form-check form-switch form-switch-md">
//                                         <input type="checkbox" className="form-check-input" id="lineGraph" defaultChecked={blockData.show_Line} onClick={(e) => show_line(e)} />
//                                         <label className="form-check-label" htmlFor="lineGraph"> Show line graph </label>
//                                       </div>
//                                     </div>
//                                   )}
//                                 </>
//                               )}

//                               {(props.data.name === "line_chart" ||
//                                 props.data.name === "Vertical_linechart" ||
//                                 props.data.name === "stack_bar" ||
//                                 props.data.name === "hor_stack" ||
//                                 props.data.name === "bar_charts" ||
//                                 props.data.name === "hor_barcharts") && (
//                                   <>
//                                     <div className="settings-row">
//                                       <div className="form-check form-switch form-switch-md">
//                                         <input type="checkbox" className="form-check-input" id="curvedLine" defaultChecked={blockData.curved_line_chrt} onClick={(e) => curved_lines(e)} />
//                                         <label className="form-check-label" htmlFor="curvedLine"> Curved Line </label>
//                                       </div>
//                                     </div>
//                                   </>
//                                 )}


//                               {props.data.name !== "pie_chart" && props.data.name !== "table" && (
//                                 <div className="settings-row">
//                                   <div className="form-check form-switch form-switch-md">
//                                     <input type="checkbox" className="form-check-input" id="grid" defaultChecked={blockData.show_Grid} onClick={(e) => show_Grid(e)} />
//                                     <label className="form-check-label" htmlFor="grid">Grid</label>
//                                   </div>
//                                 </div>
//                               )}


//                               {props.data.name !== "table" && (
//                                 <div className="settings-row">
//                                   <div className="form-check form-switch form-switch-md">
//                                     <input type="checkbox" className="form-check-input" id="showTable" defaultChecked={blockData.show_table} onClick={async (e) => show_table(e)} />
//                                     <label className="form-check-label" htmlFor="showTable"> Show Table </label>
//                                   </div>
//                                 </div>
//                               )}
//                             </CardBody>
//                           </Card>

//                         </CardBody>
//                       </Card>
//                     </>
//                   }

//                 </Col>
//               </Row>

//             </>
//           </OffcanvasBody>
//         </Offcanvas>
//       </>

//     )
//   );
// };

// export default SidePanel;