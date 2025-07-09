import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'
import urlSocket from '../../../helpers/urlSocket'
import { useDispatch, useSelector } from 'react-redux'
import _ from "lodash";
import Spinner from '../../../components/Common/Spinner'
import { UncontrolledTooltip } from 'reactstrap';

import {toggleProcessingState , updateLayoutInfo, setqueryFilter, retreivedataQuery, setfilterValue } from '../../../Slice/reportd3/reportslice';



const Slicer = forwardRef((props, ref) => {

    var containerWidth = props.containerWidth 
    var containerHeight = props.containerHeight

    var enableLength = props.enableLength;

    const dispatch = useDispatch()
    const reportSlice = useSelector(state => state.reportSliceReducer)
    const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem('authUser')))
    const [selectedValues, setSelectedValues] = useState([])

    const [dataLoading, setdataLoading] = useState(false)



    const authInfo = useSelector((state) => state.auth);
    // console.log('authInfo 29 :>> ', authInfo);
    const filterRef = useRef(null)
    const refs = useRef({}); // Store dynamic refs in an object



    useEffect(() => {
    

    }, [props.data, dispatch]);

    const multiSelectFilter = async (selectedList, selectedItem) => {
        console.log(selectedList, selectedItem, 'selectedList, selectedItem')
        const templateInfo = JSON.parse(sessionStorage.getItem("page_data"))
        const nodeInfo = JSON.parse(sessionStorage.getItem("pageNodeInfo"))
        var getIdx = _.findIndex(reportSlice.layoutInfo, { i: props.data.i })
        console.log(getIdx, 'getIdx')
        try {
            const responseData = await urlSocket.post("report/slicer-filter-values", {
                selectedList: selectedList,
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                template_id: templateInfo._id,
                node_id: nodeInfo.id,
                selected_cln_name: nodeInfo.selected_cln_name[0].cln_name,
                db_name: authUser.db_info.db_name,
                filterKey: props.data.name,
                layoutIdx: getIdx
            })

            console.log(responseData, 'responseData')
            if (responseData.status === 200) {
                dispatch(updateLayoutInfo(responseData.data.data))
            }

        } catch (error) {
            console.log(error, 'error')
        }
    }




    const updateSlicerInfoRecursively = async (slicer, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive) => {

        console.log('Starting recursive update...');
        console.log('Initial Parameters:');
        console.log('Counter :>> ', counter);
        console.log('CurrentIdx :>> ', currentIdx);
        console.log('FilterKey :>> ', filterKey);
        console.log('FilterValue :>> ', filterValue);
        console.log('retreive :>> ', retreive);
        console.log('specificFilterValue :>> ', specificFilterValue);


        let SlicerCopy = _.cloneDeep(slicer);
        console.log('SlicerCopy.length :>> ', SlicerCopy.length);
        if (retreive.length > 0) {
            // Recursive base case
            if (SlicerCopy.length <= counter) {
                console.log('SlicerCopy :>> ', SlicerCopy);

                const layout = [...reportSlice.layoutInfo]
                await updateChartsFilteredData(layout, 0, 0, props.data.name, filterValue, props.data.name, filterValue, retreive, SlicerCopy)
                // await dispatch(updateLayoutInfo(SlicerCopy)); // Dispatch updated layout to store
                return;
            }

            // Current component in layout
            const currentComponent = SlicerCopy[counter];
            console.log('currentComponent.chart_name 700   :>> ', currentComponent.name, "currentIdx :>>>>", currentIdx, counter, currentComponent);

            if (currentComponent.chart_name === "slicer") {
                console.log("currentComponent.chart_name", currentComponent.chart_name);
                if (!currentComponent.selected_filter) {
                    currentComponent.selected_filter = [];
                }
                // Check if the filter already exists
                const filterIndex = _.findIndex(currentComponent.selected_filter, { filterKey });

                if (filterValue?.length === 0) {
                    // Remove the filter if the value is empty
                    if (filterIndex !== -1) {
                        currentComponent.selected_filter.splice(filterIndex, 1);
                    }
                } else {
                    // If filter already exists, update it with the new filterValue array
                    if (filterIndex !== -1) {
                        currentComponent.selected_filter[filterIndex] = { filterKey, filterValue };

                    } else {
                        // Add new filter
                        currentComponent.selected_filter.push({ filterKey, filterValue });
                    }
                }

                console.log('Updated selected_filter for slicer:', currentComponent.selected_filter);

                // Filter slicer values (Apply slicer filter and also the waitername filter)
                const filteredInfo = _.filter(retreive, item => {
                    // Apply slicer filters
                    const slicerFilterApplied = _.every(currentComponent.selected_filter, filter =>
                        _.includes(filter.filterValue, item[filter.filterKey])
                    );

                    // Apply the specific filter for waitername (check if it's in the specificFilterValue array)
                    const specificFilterApplied = Array.isArray(specificFilterValue)
                        ? specificFilterValue.some(value => value === item[specificFilterKey])  // .some ensures any match
                        : item[specificFilterKey] === specificFilterValue;

                    // Return true only if both slicer filter and specific waitername filter are satisfied
                    return slicerFilterApplied && specificFilterApplied;
                });

                const updateData = filteredInfo.map(ele => ({
                    value: ele[currentComponent.name],
                    _id: ele._id,
                }));


                console.log('Filtered slicer values:', currentComponent);
            }


            // Move to the next component
            counter++;
            await updateSlicerInfoRecursively(SlicerCopy, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive);

        }
        else {
         
            var updatedLayoutdata = reportSlice.layoutInfo.map(item => {
                return {
                    ...item,
                    filtered_data: [], // Assign an empty array to `filtered_data`
                    // data :[]
                };
            });
            console.log("77777777");
            await   dispatch(updateLayoutInfo(updatedLayoutdata)); // Dispatch updated layout to store

        }

    };




    const updateChartsFilteredData = async (updatedLayout, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive, slicer) => {
        console.log('Starting recursive update...');
        console.log('Initial Parameters:');
        console.log('Counter :>> ', counter);
        console.log('CurrentIdx :>> ', currentIdx);
        console.log('FilterKey :>> ', filterKey);
        console.log('FilterValue :>> ', filterValue);
        console.log('retreive :>> ', retreive);
        console.log('specificFilterValue :>> ', specificFilterValue);

        // Deep clone the layout to avoid mutating state
        let layoutCopy = _.cloneDeep(updatedLayout);

        // Recursive base case
        if (layoutCopy.length <= counter) {
            // console.log('Final layout before dispatch:', JSON.stringify(layoutCopy, null, 2));
            console.log('layoutCopy :>> ', layoutCopy);
            await dispatch(updateLayoutInfo(layoutCopy)); // Dispatch updated layout to store
            return;
        }

        // Current component in layout
        const currentComponent = layoutCopy[counter];
        if (retreive.length > 0) {

            if (currentComponent.chart_name !== "slicer" && currentComponent.x_axis_key && currentComponent.y_axis_key) {

                console.log('currentComponent.chart_name :>> ', currentComponent.chart_name, "X-Axis", currentComponent.x_axis_key);
                // Identify the slicer in the layout
                const slicerIndex = _.findIndex(slicer, { chart_name: "slicer" });

                // if (slicerIndex !== -1) {
                const slicerFilters = slicer[slicerIndex].selected_filter || [];

                console.log('Slicer filters applied to chart:', slicerFilters);


                // Apply slicer filters to collection data
                const filteredInfo = _.filter(retreive, item => {
                    // Apply slicer filters
                    const slicerFilterApplied = _.every(slicerFilters, filter =>
                        _.includes(filter.filterValue, item[filter.filterKey])
                    );

                    // Apply the specific filter for waitername (check if it's in the specificFilterValue array)
                    const specificFilterApplied = Array.isArray(specificFilterValue)
                        ? specificFilterValue.some(value => value === item[specificFilterKey])  // .some ensures any match
                        : item[specificFilterKey] === specificFilterValue;

                    // Return true only if both slicer filter and specific waitername filter are satisfied
                    return slicerFilterApplied && specificFilterApplied;
                });

                console.log('Filtered data from collection (before chart mapping):', filteredInfo), `<----- ${currentComponent.name}`;

                // Map filtered data to chart format
                currentComponent.filtered_data = filteredInfo.map(ele => {
                    const xValue = ele[currentComponent.x_axis_key.name];
                    const yValue = ele[currentComponent.y_axis_key.name];

                    // Handle cases where y-axis value is nested or has special formats
                    const numericString = (typeof yValue === "object" && yValue.$numberDecimal)
                        ? yValue.$numberDecimal
                        : yValue;
                    const parsedValue = isNaN(parseFloat(numericString)) ? 0 : parseFloat(numericString);

                    return {
                        year: xValue,
                        _id: ele._id,
                        value: parsedValue,
                    };
                });

                if (retreive.length > 0) {

                    // Filter the data
                    const filteredData = filterDataByDynamicKey(retreive, currentComponent.data, currentComponent.x_axis_key, currentComponent, filterKey, filterValue, "year");

                    console.log('filteredData 266:>> ', filteredData, currentComponent.name);

                    // Extract `waitername` values from cln_data (or whichever field is specified in x_axis_key)
                    const waiterNamesFromClnData = retreive?.map(item => item[filterKey]);

                    console.log('currentComponent  bar chart:>> ', currentComponent, waiterNamesFromClnData);
                    // Filter `layout.data` where the `year` (equivalent to `waitername` in this case) matches the waiter names in `cln_data`
                    const filteredLayoutData = currentComponent.data.filter(item => waiterNamesFromClnData.includes(item.year));

                    console.log(filteredLayoutData, "filteredLayoutData");

                    // if (filteredLayoutData.length > 0) {
                    //     currentComponent.filtered_data = filteredLayoutData
                    // }

                    if (filteredData.length > 0) {
                        currentComponent.filtered_data = filteredData
                    }
                    else {
                        currentComponent.filtered_data = []
                    }
                }
                else {
                    currentComponent.filtered_data = []
                    currentComponent.data = []
                }
                //  else if (currentComponent.filtered_data.length === 0) {
                //     currentComponent.filtered_data = currentComponent.data
                // }

                console.log('Filtered chart data:', currentComponent.filtered_data, currentComponent.filtered_data.length === 0 ? currentComponent.data.length : null);
                // }

            }

            console.log('currentComponent.chart_name 287 :>> ', currentComponent);


            if (currentComponent.name !== 'bar_charts' &&
                currentComponent.name !== 'hor_barcharts' &&
                currentComponent.name !== 'slicer' && currentComponent.x_axis_key && currentComponent.yAxis_arr?.length > 0) {




                // if (currentComponent.chart_name === "Stack" && currentComponent.x_axis_key && currentComponent.yAxis_arr.length > 0) {
                console.log("Entered for Stack chart", currentComponent.name);

                // Identify the slicer in the layout
                const slicerIndex = _.findIndex(slicer, { chart_name: "slicer" });

                // if (slicerIndex !== -1) {
                const slicerFilters = slicer[slicerIndex].selected_filter || [];

                console.log('Slicer filters applied to stack chart:', slicerFilters, "layoutCopy", layoutCopy, "slicerIndex", slicerIndex);
                console.log('object :>> ', currentComponent);

                const filteredInfo = _.filter(retreive, item => {
                    // Apply slicer filters
                    const slicerFilterApplied = _.every(slicerFilters, filter =>
                        _.includes(filter.filterValue, item[filter.filterKey])
                    );

                    // Apply the specific filter for waitername (check if it's in the specificFilterValue array)
                    const specificFilterApplied = Array.isArray(specificFilterValue)
                        ? specificFilterValue.some(value => value === item[specificFilterKey]) // .some ensures any match
                        : item[specificFilterKey] === specificFilterValue;

                    console.log('specificFilterApplied :>> ', specificFilterApplied);
                    // Return true only if both slicer filter and specific waitername filter are satisfied
                    return slicerFilterApplied && specificFilterApplied;
                });

                console.log('Filtered data from collection (before stack chart mapping):', filteredInfo, `<----- ${currentComponent.name}`);




                if (retreive.length > 0) {
                    // Dynamic x_axis_key
                    const x_axis_key = { name: filterKey };

                    // Filter the data
                    const filteredData = filterDataByDynamicKey(retreive, currentComponent.data, x_axis_key, currentComponent, filterKey, filterValue, "year");

                    console.log('filteredData 331:>> ', filteredData, currentComponent.name);

                    // Extract `waitername` values from cln_data (or whichever field is specified in x_axis_key)
                    const waiterNamesFromClnData = retreive?.map(item => item[filterKey]);

                    console.log('currentComponent :>> ', currentComponent, waiterNamesFromClnData);
                    // Filter `layout.data` where the `year` (equivalent to `waitername` in this case) matches the waiter names in `cln_data`
                    const filteredLayoutData = currentComponent.data.filter(item => waiterNamesFromClnData.includes(item.year));

                    console.log(filteredLayoutData, "filteredLayoutData stack" , filteredData,"<--------", currentComponent);


                    if (filteredLayoutData.length > 0) {
                        currentComponent.filtered_data = filteredLayoutData
                    } else {
                        currentComponent.filtered_data = []
                    }


                    if (filteredData.length > 0) {
                        currentComponent.filtered_data = filteredData
                    }
                    else {
                        currentComponent.filtered_data = []
                    }
                }

                // else if (currentComponent.filtered_data?.length === 0) {
                //     currentComponent.filtered_data = currentComponent.data
                // }
                else {
                    currentComponent.filtered_data = []
                    currentComponent.data = []

                }

            }

            // ---------------------------
            if (currentComponent.card_name === 'rectangle_card') {
                console.log("Entered Card");
                // Extract the values of "Mealorder" based on the filterKey
                const values = retreive
                    .filter(item => item[filterKey]) // Filter objects where filterKey exists
                    .map(item => item.Mealorder); // Extract the Mealorder value

                console.log('values  461:>> ', values);


                // Calculate sum
                const sum = values.reduce((acc, value) => acc + value, 0);
                console.log('sum :>> ', sum);

                // Calculate total count
                const total = values.length;

                // Calculate average
                const avg = total > 0 ? sum / total : 0;

                // Calculate minimum
                const min = Math.min(...values);

                // Calculate maximum
                const max = Math.max(...values);


                console.log("Calc:", {
                    total,
                    sum,
                    avg: parseFloat(avg.toFixed(2)), // Limit to 2 decimal places
                    min,
                    max
                });


                if (currentComponent.prefrd_calc.name === 'SUM') {
                    currentComponent.filteredcount = sum
                }
                else if (currentComponent.prefrd_calc.name === 'AVG') {
                    currentComponent.filteredcount = avg
                } else if (currentComponent.prefrd_calc.name === 'COUNT') {
                    currentComponent.filteredcount = total
                } else if (currentComponent.prefrd_calc.name === 'MIN') {
                    currentComponent.filteredcount = min
                } else if (currentComponent.prefrd_calc.name === 'MAX') {
                    currentComponent.filteredcount = max
                }



            }

            if (currentComponent.name === "pie_chart") {
                console.log("Entered pie chart", currentComponent, filterKey, filterValue);

                // Identify the slicer in the layout
                const slicerIndex = _.findIndex(slicer, { chart_name: "slicer" });

                // if (slicerIndex !== -1) {
                const slicerFilters = slicer[slicerIndex].selected_filter || [];

                console.log('Slicer filters applied to pie chart:', slicerFilters, "layoutCopy", layoutCopy, "slicerIndex", slicerIndex);
                console.log('object :>> ', currentComponent);

                const filteredInfo = _.filter(retreive, item => {
                    // Apply slicer filters
                    const slicerFilterApplied = _.every(slicerFilters, filter =>
                        _.includes(filter.filterValue, item[filter.filterKey])
                    );

                    // Apply the specific filter for waitername (check if it's in the specificFilterValue array)
                    const specificFilterApplied = Array.isArray(specificFilterValue)
                        ? specificFilterValue.some(value => value === item[specificFilterKey]) // .some ensures any match
                        : item[specificFilterKey] === specificFilterValue;

                    console.log('specificFilterApplied :>> ', specificFilterApplied);
                    // Return true only if both slicer filter and specific waitername filter are satisfied
                    return slicerFilterApplied && specificFilterApplied;
                });

                console.log('Filtered data from collection (before pie chart mapping):', filteredInfo, `<----- ${currentComponent.name}`);




                if (retreive.length > 0) {
                    // Dynamic x_axis_key
                    const x_axis_key = { name: filterKey };

                    // Filter the data
                    const filteredData = filterDataByDynamicKey(retreive, currentComponent.data, x_axis_key, currentComponent, filterKey, filterValue, "name");

                    console.log('filteredData 331:>> ', filteredData, currentComponent.name);

                    // Extract `waitername` values from cln_data (or whichever field is specified in x_axis_key)
                    const waiterNamesFromClnData = retreive?.map(item => item[filterKey]);

                    console.log('currentComponent is pie :>> ', currentComponent, waiterNamesFromClnData);
                    // Filter `layout.data` where the `year` (equivalent to `waitername` in this case) matches the waiter names in `cln_data`
                    const filteredLayoutData = currentComponent.data.filter(item => waiterNamesFromClnData.includes(item.name));

                    console.log(filteredLayoutData, "filteredLayoutData pie");


                    // if (filteredLayoutData.length > 0) {
                    //     currentComponent.filtered_data = filteredLayoutData
                    // }


                    if (filteredData.length > 0) {
                        currentComponent.filtered_data = filteredData
                    }
                    else {
                        currentComponent.filtered_data = []
   
                    }

                }

                // else if (currentComponent.filtered_data?.length === 0) {
                //     currentComponent.filtered_data = currentComponent.data
                // }
                else {
                    currentComponent.filtered_data = []

                }

                console.log('Filtered pie chart data:', currentComponent.filtered_data);

                // }

            }
        } else {
            currentComponent.filtered_data = []
            // console.log('layoutcopy :>> ', layoutcopy);


            var updatedLayoutdata = updatedLayout.map(item => {
                return {
                    ...item,
                    filtered_data: [], // Assign an empty array to `filtered_data`
                    // data :[]
                };
            });




            // var updatedLayoutdata = layoutCopy.map(item => {
            //     const { filtered_data, ...rest } = item;
            //     console.log('rest :>> ', rest);// Exclude `filtereddata` from the object
            //     return rest;
            // });

            // await   dispatch(updateLayoutInfo(updatedLayoutdata)); // Dispatch updated layout to store
        }

        // Move to the next component
        counter++;
        await updateChartsFilteredData(layoutCopy, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive, slicer);

    }






    const filterDataByDynamicKey = (query_filtered_data, data, x_axis_key, val, filterkey, filtervalue, name) => {
        // Extract all values of the dynamic key (e.g., waitername) from query_filtered_data
        const validKeys = query_filtered_data.filter(item => item[x_axis_key.name]);

        console.log('validKeys :>> ', validKeys, val);

        var filteredArr = validKeys.map((vdata, i) => {
            console.log(' vdata[filterkey] :>> ', vdata[filterkey], vdata[val.x_axis_key.name]);
            //  vdata[filterkey]
            return vdata[val.x_axis_key.name]

        })


        console.log('filteredArr :>> ', filteredArr);
        // Extract distinct waiter names from the data
        const distinct = [...new Set(query_filtered_data.map(item => item[x_axis_key.name]))];
        console.log("Distinct :", distinct);
        // Filter the data array based on whether its dynamic key value exists in validKeys
        const filteredData = data?.filter(item => filteredArr.includes(item[name]));
        console.log('filteredData  527:>> ', filteredData, val.name);
        return filteredData;
    };



//____________________________________________________________________________________________________________





    // const updateSlicerInfoRecursivelyLoop = async (slicer, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive) => {

    //     console.log('Starting recursive update 1275...');
    //     console.log('Initial Parameters:');
    //     console.log('Counter :>> ', counter);
    //     console.log('CurrentIdx :>> ', currentIdx);
    //     console.log('FilterKey :>> ', filterKey);
    //     console.log('FilterValue :>> ', filterValue);
    //     console.log('retreive :>> ', retreive);
    //     console.log('specificFilterValue :>> ', specificFilterValue);


    //     let SlicerCopy = _.cloneDeep(slicer);
    //     console.log('SlicerCopy.length :>> ', SlicerCopy.length);
    //     if (retreive) {
    //         // Recursive base case
    //         if (SlicerCopy.length <= counter) {
    //             console.log('SlicerCopy :>> ', SlicerCopy);

    //             const layout = [...reportSlice.layoutInfo]
    //             await updateChartsFilteredDataLoop(layout, 0, 0, props.data.name, filterValue, props.data.name, filterValue, retreive, SlicerCopy)
    //             // await dispatch(updateLayoutInfo(SlicerCopy)); // Dispatch updated layout to store
    //             return;
    //         }

    //         // Current component in layout
    //         const currentComponent = SlicerCopy[counter];
    //         console.log('currentComponent.chart_name 700   :>> ', currentComponent.name, "currentIdx :>>>>", currentIdx, counter, currentComponent);

    //         if (currentComponent.chart_name === "slicer") {
    //             console.log("currentComponent.chart_name", currentComponent.chart_name);
    //             if (!currentComponent.selected_filter) {
    //                 currentComponent.selected_filter = [];
    //             }
    //             // Check if the filter already exists
    //             const filterIndex = _.findIndex(currentComponent.selected_filter, { filterKey });

    //             if (filterValue?.length === 0) {
    //                 // Remove the filter if the value is empty
    //                 if (filterIndex !== -1) {
    //                     currentComponent.selected_filter.splice(filterIndex, 1);
    //                 }
    //             } else {
    //                 // If filter already exists, update it with the new filterValue array
    //                 if (filterIndex !== -1) {
    //                     currentComponent.selected_filter[filterIndex] = { filterKey, filterValue };

    //                 } else {
    //                     // Add new filter
    //                     currentComponent.selected_filter.push({ filterKey, filterValue });
    //                 }
    //             }

    //             console.log('Updated selected_filter for slicer:', currentComponent.selected_filter);

    //             // Filter slicer values (Apply slicer filter and also the waitername filter)
    //             const filteredInfo = _.filter(retreive, item => {
    //                 // Apply slicer filters
    //                 const slicerFilterApplied = _.every(currentComponent.selected_filter, filter =>
    //                     _.includes(filter.filterValue, item[filter.filterKey])
    //                 );

    //                 // Apply the specific filter for waitername (check if it's in the specificFilterValue array)
    //                 const specificFilterApplied = Array.isArray(specificFilterValue)
    //                     ? specificFilterValue.some(value => value === item[specificFilterKey])  // .some ensures any match
    //                     : item[specificFilterKey] === specificFilterValue;

    //                 // Return true only if both slicer filter and specific waitername filter are satisfied
    //                 return slicerFilterApplied && specificFilterApplied;
    //             });

    //             const updateData = filteredInfo.map(ele => ({
    //                 value: ele[currentComponent.name],
    //                 _id: ele._id,
    //             }));

    //             // currentComponent.filtered_slicer_values = _.uniqBy(updateData, "value").map(item => ({
    //             //     ...item,
    //             //     is_checked: true,
    //             // }));

    //             console.log('Filtered slicer values:', currentComponent);
    //         }


    //         // Move to the next component
    //         counter++;
    //         await updateSlicerInfoRecursivelyLoop(SlicerCopy, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive);

    //     }
    //     else {

    //         var updatedLayoutdata = reportSlice.layoutInfo.map(item => {
    //             return {
    //                 ...item,
    //                 filtered_data: [], // Assign an empty array to `filtered_data`
    //                 // data :[]
    //             };
    //         });
    //         console.log("77777777");
    //         await dispatch(updateLayoutInfo(updatedLayoutdata)); // Dispatch updated layout to store

    //         // var updatedLayoutdata = reportSlice.layoutInfo.map(item => {
    //         //     const { filtered_data, ...rest } = item;
    //         //     console.log('rest :>> ', rest);// Exclude `filtereddata` from the object
    //         //     return rest;
    //         // });
    //         // await dispatch(updateLayoutInfo(updatedLayoutdata))
    //     }

    // };


    // const updateChartsFilteredDataLoop = async (updatedLayout, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive, slicer) => {
    //     console.log('Starting recursive update...');
    //     console.log('Initial Parameters:');
    //     console.log('Counter :>> ', counter);
    //     console.log('CurrentIdx :>> ', currentIdx);
    //     console.log('FilterKey :>> ', filterKey);
    //     console.log('FilterValue :>> ', filterValue);
    //     console.log('retreive 1393 :>> ', retreive);
    //     console.log('specificFilterValue  1394:>> ', specificFilterValue);

    //     // Deep clone the layout to avoid mutating state
    //     let layoutCopy = _.cloneDeep(updatedLayout);

    //     // Recursive base case
    //     if (layoutCopy.length <= counter) {
    //         // console.log('Final layout before dispatch:', JSON.stringify(layoutCopy, null, 2));
    //         console.log('layoutCopy :>> ', layoutCopy);
    //         await dispatch(updateLayoutInfo(layoutCopy)); // Dispatch updated layout to store
    //         return;
    //     }

    //     // Current component in layout
    //     const currentComponent = layoutCopy[counter];
    //     if (retreive) {

    //         if (currentComponent.chart_name !== "slicer" && currentComponent.x_axis_key && currentComponent.y_axis_key && currentComponent?.data?.length > 0) {

    //             console.log('currentComponent.chart_name :>> ', currentComponent.chart_name, "X-Axis", currentComponent.x_axis_key , currentComponent.data);

    //             console.log('currentComponent.x_axis_key  1416:>> ', retreive[currentComponent.x_axis_key.name]);

    //             // Extract _id values from retreive[currentComponent.x_axis_key.name]
    //             const idsToFilter = retreive[currentComponent.x_axis_key.name]?.map(item => item._id);

    //             // Filter currentComponent.data to exclude matching year values
    //             const filteredDataLoop = currentComponent.data?.filter(
    //                 dataItem => idsToFilter.includes(dataItem.name)
    //             );

    //             // Set the filtered data on currentComponent.filtered_data
    //             currentComponent.filtered_data = filteredDataLoop;

    //             console.log('Filtered Data bar:', currentComponent?.filtered_data);

    //             // if (retreive.length > 0) {

    //             //     // Filter the data
    //             //     const filteredData = filterDataByDynamicKeyLoop(retreive, currentComponent.data, currentComponent.x_axis_key, currentComponent, filterKey, filterValue, "year");

    //             //     console.log('filteredData 266:>> ', filteredData, currentComponent.name);

    //             //     // Extract `waitername` values from cln_data (or whichever field is specified in x_axis_key)
    //             //     const waiterNamesFromClnData = retreive?.map(item => item[filterKey]);

    //             //     console.log('currentComponent  bar chart:>> ', currentComponent, waiterNamesFromClnData);
    //             //     // Filter `layout.data` where the `year` (equivalent to `waitername` in this case) matches the waiter names in `cln_data`
    //             //     const filteredLayoutData = currentComponent.data.filter(item => waiterNamesFromClnData.includes(item.year));

    //             //     console.log(filteredLayoutData, "filteredLayoutData");

    //             //     // if (filteredLayoutData.length > 0) {
    //             //     //     currentComponent.filtered_data = filteredLayoutData
    //             //     // }

    //             //     if (filteredData.length > 0) {
    //             //         currentComponent.filtered_data = filteredData
    //             //     }
    //             //     else {
    //             //         currentComponent.filtered_data = []
    //             //     }
    //             // }
    //             // else {
    //             //     currentComponent.filtered_data = []
    //             //     currentComponent.data = []
    //             // }
    //             //  else if (currentComponent.filtered_data.length === 0) {
    //             //     currentComponent.filtered_data = currentComponent.data
    //             // }

    //             console.log('Filtered chart data:', currentComponent?.filtered_data, currentComponent?.filtered_data?.length === 0 ? currentComponent?.data?.length : null);
    //             // }

    //         }

    //         console.log('currentComponent.chart_name 287 :>> ', currentComponent);

    //         if (currentComponent.name !== 'bar_charts' &&
    //             currentComponent.name !== 'hor_barcharts' &&
    //             currentComponent.name !== 'slicer' && currentComponent.x_axis_key && currentComponent.yAxis_arr?.length > 0 && currentComponent?.data) {




    //             // if (currentComponent.chart_name === "Stack" && currentComponent.x_axis_key && currentComponent.yAxis_arr.length > 0) {
    //             console.log("Entered for Stack chart", currentComponent.name);

           
    //             // Extract _id values from retreive[currentComponent.x_axis_key.name]
    //             const idsToFilter = retreive[currentComponent.x_axis_key.name].map(item => item._id);

    //             // Filter currentComponent.data to exclude matching year values
    //             const filteredDataLoop = currentComponent.data?.filter(
    //                 dataItem => idsToFilter.includes(dataItem.name)
    //             );

    //             // Set the filtered data on currentComponent.filtered_data
    //             currentComponent.filtered_data = filteredDataLoop;

    //             console.log('Filtered stack chart data:', currentComponent.filtered_data);



    //         }

    //         // ---------------------------
    //         if (currentComponent.card_name === 'rectangle_card' && currentComponent?.data?.length > 0) {
    //             console.log("Entered Card" , retreive);
    //             // Extract the values of "Mealorder" based on the filterKey
    //             // const values = retreive
    //             //     .filter(item => item[filterKey]) // Filter objects where filterKey exists
    //             //     .map(item => item.Mealorder); // Extract the Mealorder value

    //             // console.log('values  461:>> ', values);


    //             // // Calculate sum
    //             // const sum = values.reduce((acc, value) => acc + value, 0);
    //             // console.log('sum :>> ', sum);

    //             // // Calculate total count
    //             // const total = values.length;

    //             // // Calculate average
    //             // const avg = total > 0 ? sum / total : 0;

    //             // // Calculate minimum
    //             // const min = Math.min(...values);

    //             // // Calculate maximum
    //             // const max = Math.max(...values);


    //             // console.log("Calc:", {
    //             //     total,
    //             //     sum,
    //             //     avg: parseFloat(avg.toFixed(2)), // Limit to 2 decimal places
    //             //     min,
    //             //     max
    //             // });


    //             // if (currentComponent.prefrd_calc.name === 'SUM') {
    //             //     currentComponent.filteredcount = sum
    //             // }
    //             // else if (currentComponent.prefrd_calc.name === 'AVG') {
    //             //     currentComponent.filteredcount = avg
    //             // } else if (currentComponent.prefrd_calc.name === 'COUNT') {
    //             //     currentComponent.filteredcount = total
    //             // } else if (currentComponent.prefrd_calc.name === 'MIN') {
    //             //     currentComponent.filteredcount = min
    //             // } else if (currentComponent.prefrd_calc.name === 'MAX') {
    //             //     currentComponent.filteredcount = max
    //             // }



    //         }

    //         if (currentComponent.name === "pie_chart" && currentComponent?.data?.length > 0) {
    //             console.log("Entered pie chart", currentComponent, filterKey, filterValue);

    //             // Identify the slicer in the layout
    //             const slicerIndex = _.findIndex(slicer, { chart_name: "slicer" });

    //             // if (slicerIndex !== -1) {
    //             const slicerFilters = slicer[slicerIndex].selected_filter || [];

    //             console.log('Slicer filters applied to pie chart:', slicerFilters, "layoutCopy", layoutCopy, "slicerIndex", slicerIndex);
    //             console.log('object :>> ', currentComponent);

    //             const filteredInfo = _.filter(retreive, item => {
    //                 // Apply slicer filters
    //                 const slicerFilterApplied = _.every(slicerFilters, filter =>
    //                     _.includes(filter.filterValue, item[filter.filterKey])
    //                 );

    //                 // Apply the specific filter for waitername (check if it's in the specificFilterValue array)
    //                 const specificFilterApplied = Array.isArray(specificFilterValue)
    //                     ? specificFilterValue.some(value => value === item[specificFilterKey]) // .some ensures any match
    //                     : item[specificFilterKey] === specificFilterValue;

    //                 console.log('specificFilterApplied :>> ', specificFilterApplied);
    //                 // Return true only if both slicer filter and specific waitername filter are satisfied
    //                 return slicerFilterApplied && specificFilterApplied;
    //             });

    //             console.log('Filtered data from collection (before pie chart mapping):', filteredInfo, `<----- ${currentComponent.name}`);


    //                                                 // if (currentComponent.chart_name === "Stack" && currentComponent.x_axis_key && currentComponent.yAxis_arr.length > 0) {
    //                                                 console.log("Entered for PIE chart", currentComponent.name);


    //                                                 // Extract _id values from retreive[currentComponent.x_axis_key.name]
    //                                                 const idsToFilter = retreive[currentComponent.x_axis_key.name].map(item => item._id);

    //                                                 console.log('idsToFilter :>> ', idsToFilter , currentComponent.data);
    //                                                 // Filter currentComponent.data to exclude matching year values
    //                                                 const filteredDataLoop = currentComponent.data.filter(
    //                                                     dataItem => idsToFilter.includes(dataItem.name)
    //                                                 );

    //                                                 // Set the filtered data on currentComponent.filtered_data
    //                                                 currentComponent.filtered_data = filteredDataLoop;

    //                                                 console.log('Filtered Pies chart data:', currentComponent.filtered_data);
    


    //             // if (retreive) {
    //             //     // Dynamic x_axis_key
    //             //     const x_axis_key = { name: filterKey };

    //             //     // Filter the data
    //             //     const filteredData = filterDataByDynamicKeyLoop(retreive, currentComponent.data, x_axis_key, currentComponent, filterKey, filterValue, "name");

    //             //     console.log('filteredData 331:>> ', filteredData, currentComponent.name);

    //             //     // Extract `waitername` values from cln_data (or whichever field is specified in x_axis_key)
    //             //     const waiterNamesFromClnData = retreive?.map(item => item[filterKey]);

    //             //     console.log('currentComponent is pie :>> ', currentComponent, waiterNamesFromClnData);
    //             //     // Filter `layout.data` where the `year` (equivalent to `waitername` in this case) matches the waiter names in `cln_data`
    //             //     const filteredLayoutData = currentComponent.data.filter(item => waiterNamesFromClnData.includes(item.name));

    //             //     console.log(filteredLayoutData, "filteredLayoutData pie");


    //             //     // if (filteredLayoutData.length > 0) {
    //             //     //     currentComponent.filtered_data = filteredLayoutData
    //             //     // }


    //             //     if (filteredData.length > 0) {
    //             //         currentComponent.filtered_data = filteredData
    //             //     }
    //             //     else {
    //             //         currentComponent.filtered_data = []

    //             //     }

    //             // }


    //             // else {
    //             //     currentComponent.filtered_data = []

    //             // }

    //             console.log('Filtered pie chart data:', currentComponent.filtered_data);

    //             // }

    //         }
    //     } else {
    //         currentComponent.filtered_data = []
    //         // console.log('layoutcopy :>> ', layoutcopy);


    //         var updatedLayoutdata = updatedLayout.map(item => {
    //             return {
    //                 ...item,
    //                 filtered_data: [], // Assign an empty array to `filtered_data`
    //                 // data :[]
    //             };
    //         });

    //     }

    //     // Move to the next component
    //     counter++;
    //     await updateChartsFilteredDataLoop(layoutCopy, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive, slicer);

    // }

    const filterDataByDynamicKeyLoop = (query_filtered_data, data, x_axis_key, val, filterkey, filtervalue, name) => {
        console.log('query_filtered_data :>> ', query_filtered_data);
        // Extract all values of the dynamic key (e.g., waitername) from query_filtered_data
        const validKeys = query_filtered_data.filter(item => item[x_axis_key.name]);

        console.log('validKeys :>> ', validKeys, val);

        var filteredArr = validKeys.map((vdata, i) => {
            console.log(' vdata[filterkey] :>> ', vdata[filterkey], vdata[val.x_axis_key.name]);
            //  vdata[filterkey]
            return vdata[val.x_axis_key.name]

        })


        console.log('filteredArr :>> ', filteredArr);
        // Extract distinct waiter names from the data
        const distinct = [...new Set(query_filtered_data.map(item => item[x_axis_key.name]))];
        console.log("Distinct :", distinct);
        // Filter the data array based on whether its dynamic key value exists in validKeys
        const filteredData = data?.filter(item => filteredArr.includes(item[name]));
        console.log('filteredData  527:>> ', filteredData, val.name);
        return filteredData;
    };



    const handleReset = () => {
        // Clear selected values
        setSelectedValues([]);
        // Clear filter values in the store
        dispatch(setfilterValue([]));
         dispatch(setqueryFilter([]));
    };


    const selectList = async (event, item) => {
        var selectedCollectionData = reportSlice.selectedCollectionData
        console.log('selectedCollectionData', selectedCollectionData , '>>>>>', event.target.checked, item)
        var itemInfo = { ...item }
        itemInfo["is_checked"] = event.target.checked

        // itemInfo["key"]=props.data.name
        console.log('itemInfo', itemInfo)
        var updatedInfo = [...selectedValues]
        if (event.target.checked) {
            updatedInfo.push(itemInfo)
        }
        else {
            var getIdx = _.findIndex(updatedInfo, { _id: itemInfo._id })
            // console.log(getIdx, 'getIdx')
            if (getIdx !== -1) {
                updatedInfo = [
                    ...updatedInfo.slice(0, getIdx),
                    ...updatedInfo.slice(getIdx + 1)
                ];
            }

        }

            console.log('reportSlice.updatedSliceData', reportSlice, reportSlice.updatedSliceData, updatedInfo, props.data.i)
        const Slicer = [...reportSlice.updatedSliceData]
        const layout = [...reportSlice.layoutInfo]
        var getIdx = _.findIndex(Slicer, { i: props.data.i })
        console.log(getIdx, 'getIdx')
        setSelectedValues(updatedInfo)
        var filterValue = _.map(updatedInfo, 'value')
        console.log('filterValue 277 :>> ', props.data.name, '=>', filterValue, "updatedInfo=>", updatedInfo);
        console.log('filterValue', filterValue)
        dispatch(setfilterValue(filterValue))
        // Extract x_axis_key values
        // const xAxisKeys = layout.map(item =>  item.x_axis_key !== undefined && item.x_axis_key );



        const xAxisKeys = layout
            .filter(item => item.x_axis_key !== undefined)
            .map(item => item.x_axis_key);




        // Log the result
        console.log('Extracted x_axis_key values:', xAxisKeys);

        // Extract unique values of name
        const uniqueNames = [...new Set(xAxisKeys.map(item => item.name))];

        console.log('Unique Names:', uniqueNames, filterValue);
    



        // Combine updatedInfo with queryFilter grouped by key
        const existingQueryFilter = reportSlice.queryFilter || {};
        const key = props.data.name;
        console.log('existingQueryFilter', existingQueryFilter)

        const combinedQueryFilter = {
             ...existingQueryFilter, [key]: event.target.checked ?
              _.uniqBy([...(existingQueryFilter[key] || []), itemInfo], '_id') 
                : (existingQueryFilter[key] || []).filter(obj => obj._id !== itemInfo._id) 
        };
        setdataLoading(true)
        // console.log('Combined Query Filter:', combinedQueryFilter);
        //    await updateSlicerInfoRecursively(layout,0,getIdx,props.data.name,filterValue ,props.data.name , filterValue )

        console.log('combinedQueryFilter :>> ', combinedQueryFilter);
        // // Dispatch the updated queryFilter
        await dispatch(setqueryFilter(combinedQueryFilter));


        const areAllFieldsEmpty = (combinedQueryFilter) => {
            return Object.values(combinedQueryFilter).every((field) => field.length === 0);
        };
       
        if (areAllFieldsEmpty(combinedQueryFilter)) {
            console.log("All fields are empty.");
            // Perform your specific action here

            const updatedLayout = layout.map((item , i)=> {
                const { filtered_data, ...rest  } = item; // Exclude `filtereddata` from the object
                console.log("item.iitem.i", item.i);
                dispatch(toggleProcessingState(item.i)); // Sets all states to undefined
   
                return rest;
            });

            console.log("updatedLayout After Unchecked All Check Boxes", updatedLayout);
            dispatch(updateLayoutInfo(updatedLayout))
            setdataLoading(false)

        } else {
            console.log("Some fields are not empty.");
            setdataLoading(false)

            // await  updateSlicerInfoRecursivelyLoop(Slicer, 0, getIdx, props.data.name, filterValue, props.data.name, filterValue)
            // setdataLoading(false)







            // var retreive = await dispatch(retreivedataQuery(combinedQueryFilter, authInfo , uniqueNames))
            // console.log('retreive retreivedataQuery :>> ', retreive);

            // // if (retreive.data) {
            // //     // await updateSlicerInfoRecursively(layout, 0, getIdx, props.data.name, filterValue, props.data.name, filterValue, retreive, Slicer)
            // //     await updateSlicerInfoRecursively(Slicer, 0, getIdx, props.data.name, filterValue, props.data.name, filterValue, retreive.data)
            // //     setdataLoading(false)
            // // }


            // if( retreive.distinctValues ){
            // await  updateSlicerInfoRecursivelyLoop(Slicer, 0, getIdx, props.data.name, filterValue, props.data.name, filterValue, retreive.distinctValues)
            // setdataLoading(false)
            // }
        }



    }







    const updateSlicerInfoRecursivelyLoop = async (slicer, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive) => {

        console.log('Starting recursive update 1275...');
        console.log('Initial Parameters:');
        console.log('Counter :>> ', counter);
        console.log('CurrentIdx :>> ', currentIdx);
        console.log('FilterKey :>> ', filterKey);
        console.log('FilterValue :>> ', filterValue);
        console.log('retreive :>> ', retreive);
        console.log('specificFilterValue :>> ', specificFilterValue);


        let SlicerCopy = _.cloneDeep(slicer);
        console.log('SlicerCopy.length :>> ', SlicerCopy.length);

            // Recursive base case
            if (SlicerCopy.length <= counter) {
                console.log('SlicerCopy :>> ', SlicerCopy);

                const layout = [...reportSlice.layoutInfo]
                await updateChartsFilteredDataLoop(layout, 0, 0, props.data.name, filterValue, props.data.name, filterValue, retreive, SlicerCopy)
                // await dispatch(updateLayoutInfo(SlicerCopy)); // Dispatch updated layout to store
                return;
            }

            // Current component in layout
            const currentComponent = SlicerCopy[counter];
            console.log('currentComponent.chart_name 700   :>> ', currentComponent.name, "currentIdx :>>>>", currentIdx, counter, currentComponent);

            if (currentComponent.chart_name === "slicer") {
                console.log("currentComponent.chart_name", currentComponent.chart_name);
                if (!currentComponent.selected_filter) {
                    currentComponent.selected_filter = [];
                }
                // Check if the filter already exists
                const filterIndex = _.findIndex(currentComponent.selected_filter, { filterKey });

                if (filterValue?.length === 0) {
                    // Remove the filter if the value is empty
                    if (filterIndex !== -1) {
                        currentComponent.selected_filter.splice(filterIndex, 1);
                    }
                } else {
                    // If filter already exists, update it with the new filterValue array
                    if (filterIndex !== -1) {
                        currentComponent.selected_filter[filterIndex] = { filterKey, filterValue };

                    } else {
                        // Add new filter
                        currentComponent.selected_filter.push({ filterKey, filterValue });
                    }
                }

                console.log('Updated selected_filter for slicer:', currentComponent.selected_filter);

                // Filter slicer values (Apply slicer filter and also the waitername filter)
                const filteredInfo = _.filter(retreive, item => {
                    // Apply slicer filters
                    const slicerFilterApplied = _.every(currentComponent.selected_filter, filter =>
                        _.includes(filter.filterValue, item[filter.filterKey])
                    );

                    // Apply the specific filter for waitername (check if it's in the specificFilterValue array)
                    const specificFilterApplied = Array.isArray(specificFilterValue)
                        ? specificFilterValue.some(value => value === item[specificFilterKey])  // .some ensures any match
                        : item[specificFilterKey] === specificFilterValue;

                    // Return true only if both slicer filter and specific waitername filter are satisfied
                    return slicerFilterApplied && specificFilterApplied;
                });

                const updateData = filteredInfo.map(ele => ({
                    value: ele[currentComponent.name],
                    _id: ele._id,
                }));

                // currentComponent.filtered_slicer_values = _.uniqBy(updateData, "value").map(item => ({
                //     ...item,
                //     is_checked: true,
                // }));

                console.log('Filtered slicer values:', currentComponent);
            }


            // Move to the next component
            counter++;
            await updateSlicerInfoRecursivelyLoop(SlicerCopy, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive);

 
      

    };


    const updateChartsFilteredDataLoop = async (updatedLayout, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive, slicer) => {
        console.log('Starting recursive update...');
        console.log('Initial Parameters:');
        console.log('Counter :>> ', counter);
        console.log('CurrentIdx :>> ', currentIdx);
        console.log('FilterKey :>> ', filterKey);
        console.log('FilterValue :>> ', filterValue);
        console.log('retreive 1393 :>> ', retreive);
        console.log('specificFilterValue  1394:>> ', specificFilterValue);

        // Deep clone the layout to avoid mutating state
        let layoutCopy = _.cloneDeep(updatedLayout);

        // Recursive base case
        if (layoutCopy.length <= counter) {
            // console.log('Final layout before dispatch:', JSON.stringify(layoutCopy, null, 2));
            console.log('layoutCopy :>> ', layoutCopy);
            await dispatch(updateLayoutInfo(layoutCopy)); // Dispatch updated layout to store
            return;
        }

        // Current component in layout
        const currentComponent = layoutCopy[counter];
    

            if (currentComponent.chart_name !== "slicer" && currentComponent.x_axis_key && currentComponent.y_axis_key && currentComponent?.data?.length > 0) {

                console.log('currentComponent.chart_name :>> ', currentComponent.chart_name, "X-Axis", currentComponent.x_axis_key, currentComponent.data);

                // console.log('currentComponent.x_axis_key  1416:>> ', retreive[currentComponent.x_axis_key.name]);

                // // Extract _id values from retreive[currentComponent.x_axis_key.name]
                // const idsToFilter = retreive[currentComponent.x_axis_key.name]?.map(item => item._id);

                // // Filter currentComponent.data to exclude matching year values
                // const filteredDataLoop = currentComponent.data?.filter(
                //     dataItem => idsToFilter.includes(dataItem.name)
                // );

                // // Set the filtered data on currentComponent.filtered_data
                // currentComponent.filtered_data = filteredDataLoop;

                // console.log('Filtered Data bar:', currentComponent?.filtered_data);

                // if (retreive.length > 0) {

                //     // Filter the data
                //     const filteredData = filterDataByDynamicKeyLoop(retreive, currentComponent.data, currentComponent.x_axis_key, currentComponent, filterKey, filterValue, "year");

                //     console.log('filteredData 266:>> ', filteredData, currentComponent.name);

                //     // Extract `waitername` values from cln_data (or whichever field is specified in x_axis_key)
                //     const waiterNamesFromClnData = retreive?.map(item => item[filterKey]);

                //     console.log('currentComponent  bar chart:>> ', currentComponent, waiterNamesFromClnData);
                //     // Filter `layout.data` where the `year` (equivalent to `waitername` in this case) matches the waiter names in `cln_data`
                //     const filteredLayoutData = currentComponent.data.filter(item => waiterNamesFromClnData.includes(item.year));

                //     console.log(filteredLayoutData, "filteredLayoutData");

                //     // if (filteredLayoutData.length > 0) {
                //     //     currentComponent.filtered_data = filteredLayoutData
                //     // }

                //     if (filteredData.length > 0) {
                //         currentComponent.filtered_data = filteredData
                //     }
                //     else {
                //         currentComponent.filtered_data = []
                //     }
                // }
                // else {
                //     currentComponent.filtered_data = []
                //     currentComponent.data = []
                // }
                //  else if (currentComponent.filtered_data.length === 0) {
                //     currentComponent.filtered_data = currentComponent.data
                // }

                console.log('Filtered chart data:', currentComponent?.filtered_data, currentComponent?.filtered_data?.length === 0 ? currentComponent?.data?.length : null);
                // }

            }

            console.log('currentComponent.chart_name 287 :>> ', currentComponent);

            if (currentComponent.name !== 'bar_charts' &&
                currentComponent.name !== 'hor_barcharts' &&
                currentComponent.name !== 'slicer' && currentComponent.x_axis_key && currentComponent.yAxis_arr?.length > 0 && currentComponent?.data) {




                // if (currentComponent.chart_name === "Stack" && currentComponent.x_axis_key && currentComponent.yAxis_arr.length > 0) {
                console.log("Entered for Stack chart", currentComponent);


                // dispatch(toggleProcessingState(currentComponent.i));


                // currentComponent.chnaged = true;
                // currentComponent.changed = true;
                // // Extract _id values from retreive[currentComponent.x_axis_key.name]
                // const idsToFilter = retreive[currentComponent.x_axis_key.name].map(item => item._id);

                // // Filter currentComponent.data to exclude matching year values
                // const filteredDataLoop = currentComponent.data?.filter(
                //     dataItem => idsToFilter.includes(dataItem.name)
                // );

                // // Set the filtered data on currentComponent.filtered_data
                // currentComponent.filtered_data = filteredDataLoop;

                // console.log('Filtered stack chart data:', currentComponent.filtered_data);



            }

            // ---------------------------
            if (currentComponent.card_name === 'rectangle_card' && currentComponent?.data?.length > 0) {
                console.log("Entered Card", retreive);
                // Extract the values of "Mealorder" based on the filterKey
                // const values = retreive
                //     .filter(item => item[filterKey]) // Filter objects where filterKey exists
                //     .map(item => item.Mealorder); // Extract the Mealorder value

                // console.log('values  461:>> ', values);


                // // Calculate sum
                // const sum = values.reduce((acc, value) => acc + value, 0);
                // console.log('sum :>> ', sum);

                // // Calculate total count
                // const total = values.length;

                // // Calculate average
                // const avg = total > 0 ? sum / total : 0;

                // // Calculate minimum
                // const min = Math.min(...values);

                // // Calculate maximum
                // const max = Math.max(...values);


                // console.log("Calc:", {
                //     total,
                //     sum,
                //     avg: parseFloat(avg.toFixed(2)), // Limit to 2 decimal places
                //     min,
                //     max
                // });


                // if (currentComponent.prefrd_calc.name === 'SUM') {
                //     currentComponent.filteredcount = sum
                // }
                // else if (currentComponent.prefrd_calc.name === 'AVG') {
                //     currentComponent.filteredcount = avg
                // } else if (currentComponent.prefrd_calc.name === 'COUNT') {
                //     currentComponent.filteredcount = total
                // } else if (currentComponent.prefrd_calc.name === 'MIN') {
                //     currentComponent.filteredcount = min
                // } else if (currentComponent.prefrd_calc.name === 'MAX') {
                //     currentComponent.filteredcount = max
                // }



            }

            if (currentComponent.name === "pie_chart" && currentComponent?.data?.length > 0) {
                console.log("Entered pie chart", currentComponent, filterKey, filterValue);

                // Identify the slicer in the layout
                const slicerIndex = _.findIndex(slicer, { chart_name: "slicer" });

                // if (slicerIndex !== -1) {
                const slicerFilters = slicer[slicerIndex].selected_filter || [];

                console.log('Slicer filters applied to pie chart:', slicerFilters, "layoutCopy", layoutCopy, "slicerIndex", slicerIndex);
                console.log('object :>> ', currentComponent);

                const filteredInfo = _.filter(retreive, item => {
                    // Apply slicer filters
                    const slicerFilterApplied = _.every(slicerFilters, filter =>
                        _.includes(filter.filterValue, item[filter.filterKey])
                    );

                    // Apply the specific filter for waitername (check if it's in the specificFilterValue array)
                    const specificFilterApplied = Array.isArray(specificFilterValue)
                        ? specificFilterValue.some(value => value === item[specificFilterKey]) // .some ensures any match
                        : item[specificFilterKey] === specificFilterValue;

                    console.log('specificFilterApplied :>> ', specificFilterApplied);
                    // Return true only if both slicer filter and specific waitername filter are satisfied
                    return slicerFilterApplied && specificFilterApplied;
                });

                console.log('Filtered data from collection (before pie chart mapping):', filteredInfo, `<----- ${currentComponent.name}`);


                // if (currentComponent.chart_name === "Stack" && currentComponent.x_axis_key && currentComponent.yAxis_arr.length > 0) {
                console.log("Entered for PIE chart", currentComponent.name);


                // Extract _id values from retreive[currentComponent.x_axis_key.name]
                const idsToFilter = retreive[currentComponent.x_axis_key.name].map(item => item._id);

                console.log('idsToFilter :>> ', idsToFilter, currentComponent.data);
                // Filter currentComponent.data to exclude matching year values
                const filteredDataLoop = currentComponent.data.filter(
                    dataItem => idsToFilter.includes(dataItem.name)
                );

                // Set the filtered data on currentComponent.filtered_data
                currentComponent.filtered_data = filteredDataLoop;

                console.log('Filtered Pies chart data:', currentComponent.filtered_data);



                // if (retreive) {
                //     // Dynamic x_axis_key
                //     const x_axis_key = { name: filterKey };

                //     // Filter the data
                //     const filteredData = filterDataByDynamicKeyLoop(retreive, currentComponent.data, x_axis_key, currentComponent, filterKey, filterValue, "name");

                //     console.log('filteredData 331:>> ', filteredData, currentComponent.name);

                //     // Extract `waitername` values from cln_data (or whichever field is specified in x_axis_key)
                //     const waiterNamesFromClnData = retreive?.map(item => item[filterKey]);

                //     console.log('currentComponent is pie :>> ', currentComponent, waiterNamesFromClnData);
                //     // Filter `layout.data` where the `year` (equivalent to `waitername` in this case) matches the waiter names in `cln_data`
                //     const filteredLayoutData = currentComponent.data.filter(item => waiterNamesFromClnData.includes(item.name));

                //     console.log(filteredLayoutData, "filteredLayoutData pie");


                //     // if (filteredLayoutData.length > 0) {
                //     //     currentComponent.filtered_data = filteredLayoutData
                //     // }


                //     if (filteredData.length > 0) {
                //         currentComponent.filtered_data = filteredData
                //     }
                //     else {
                //         currentComponent.filtered_data = []

                //     }

                // }


                // else {
                //     currentComponent.filtered_data = []

                // }

                console.log('Filtered pie chart data:', currentComponent.filtered_data);

                // }

            }
    

        // Move to the next component
        counter++;
        await updateChartsFilteredDataLoop(layoutCopy, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive, slicer);

    }









    // Expose the function via ref
    useImperativeHandle(ref, () => ({
        updateSlicer: updateSlicerInfoRecursively,
        resetfilter: handleReset
    }));

    return (
        <div>
            {
                dataLoading &&
                <Spinner />
            }


            <div className="" style={{ height: '100%', overflowY: 'auto' }}>
                <div ref={(el) => (refs.current[`filterRef${props.data.i}`] = el)} id={`filterRef${props.data.i}`}>
                    {props.data.filtered_slicer_values !== undefined
                        ? props.data.filtered_slicer_values.map((ele, pos) => {
                            const tooltipId = `tooltip-${props.data.i}-${pos}`;
                            return (
                                <div key={pos}>
                                    <input type="checkbox" onChange={(e) => selectList(e, ele)} className="me-2" />
                                    <label id={tooltipId}>
                                        {ele.value?.length > 10 ? `${ele.value.substring(0, 10)}...` : ele.value}
                                    </label>
                                    {ele.value?.length > 10 && (
                                        <UncontrolledTooltip placement="auto" target={tooltipId} > {ele.value} </UncontrolledTooltip>
                                    )}
                                </div>
                            );
                        })
                        : props.data?.slicer_values?.map((ele, indx) => {
                            const tooltipId = `tooltip-${props.data.i}-${indx}`;
                            return (

                                <div key={indx}>
                                    <input type="checkbox" onChange={(e) => selectList(e, ele)} className="me-2" />
                                    <label id={tooltipId}>
                                        {
                                            ele?.value?.length > (enableLength === undefined ? 9 : 14)
                                                ? `${ele.value.substring(0, enableLength === undefined ? 9 : 15)}...`
                                                : ele.value
                                        }
                                    </label>
                                    {ele?.value?.length > (enableLength === undefined ? 9 : 15) && (
                                        <UncontrolledTooltip placement="auto" target={tooltipId} >
                                            {ele.value}
                                        </UncontrolledTooltip>
                                    )}
                                </div>

                            );
                        })}
                </div>
            </div>
        </div>

    )

    // return (
    //     <div>
    //         {
    //             dataLoading &&
    //             <Spinner />
    //         }
    //         {/* <label>Selected Key :{props.data.name}</label> */}
    //         <div className="" style={{ maxHeight: containerHeight - 30, overflowY: 'auto' }}>


    //             <div
    //                 ref={el => (refs.current[`filterRef${props.data.i}`] = el)}
    //                 id={`filterRef${props.data.i}`}
    //             >
    //                 {
    //                     props.data.filtered_slicer_values !== undefined ?
    //                         props.data.filtered_slicer_values.map((ele, pos) => {
    //                             return (
    //                                 <div key={pos}>
    //                                     <input type='checkbox'
    //                                         onChange={(e) => { selectList(e, ele) }}
    //                                         className='me-2'
    //                                     />{ele.value}
    //                                 </div>
    //                             )
    //                         })
    //                         :
    //                         props.data?.slicer_values?.map((ele, indx) => {
    //                             return (
    //                                 <div key={indx}>
    //                                     <input type='checkbox'
    //                                         onChange={(e) => { selectList(e, ele) }}
    //                                         className='me-2'
    //                                     />{ele.value}
    //                                 </div>
    //                             )
    //                         })
    //                 }
    //             </div>
                

    //         </div>

    //     </div>

    // )
}
)
// Add display name for debugging
Slicer.displayName = "Slicer";
export default Slicer




// import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'
// import urlSocket from '../../../helpers/urlSocket'
// import { useDispatch, useSelector } from 'react-redux'
// import _ from "lodash";
// import Spinner from '../../../components/Common/Spinner'
// import { UncontrolledTooltip } from 'reactstrap';

// import {toggleProcessingState , updateLayoutInfo, setqueryFilter, retreivedataQuery, setfilterValue } from '../../../Slice/reportd3/reportslice';



// const Slicer = forwardRef((props, ref) => {

//     var containerWidth = props.containerWidth 
//     var containerHeight = props.containerHeight

//     var enableLength = props.enableLength;

//     const dispatch = useDispatch()
//     const reportSlice = useSelector(state => state.reportSliceReducer)
//     const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem('authUser')))
//     const [selectedValues, setSelectedValues] = useState([])

//     const [dataLoading, setdataLoading] = useState(false)



//     const authInfo = useSelector((state) => state.auth);
//     // console.log('authInfo 29 :>> ', authInfo);
//     const filterRef = useRef(null)
//     const refs = useRef({}); // Store dynamic refs in an object



//     useEffect(() => {
    

//     }, [props.data, dispatch]);

//     const multiSelectFilter = async (selectedList, selectedItem) => {
//         console.log(selectedList, selectedItem, 'selectedList, selectedItem')
//         const templateInfo = JSON.parse(sessionStorage.getItem("page_data"))
//         const nodeInfo = JSON.parse(sessionStorage.getItem("pageNodeInfo"))
//         var getIdx = _.findIndex(reportSlice.layoutInfo, { i: props.data.i })
//         console.log(getIdx, 'getIdx')
//         try {
//             const responseData = await urlSocket.post("report/slicer-filter-values", {
//                 selectedList: selectedList,
//                 encrypted_db_url: authUser.db_info.encrypted_db_url,
//                 template_id: templateInfo._id,
//                 node_id: nodeInfo.id,
//                 selected_cln_name: nodeInfo.selected_cln_name[0].cln_name,
//                 db_name: authUser.db_info.db_name,
//                 filterKey: props.data.name,
//                 layoutIdx: getIdx
//             })

//             console.log(responseData, 'responseData')
//             if (responseData.status === 200) {
//                 dispatch(updateLayoutInfo(responseData.data.data))
//             }

//         } catch (error) {
//             console.log(error, 'error')
//         }
//     }




//     const updateSlicerInfoRecursively = async (slicer, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive) => {

//         console.log('Starting recursive update...');
//         console.log('Initial Parameters:');
//         console.log('Counter :>> ', counter);
//         console.log('CurrentIdx :>> ', currentIdx);
//         console.log('FilterKey :>> ', filterKey);
//         console.log('FilterValue :>> ', filterValue);
//         console.log('retreive :>> ', retreive);
//         console.log('specificFilterValue :>> ', specificFilterValue);


//         let SlicerCopy = _.cloneDeep(slicer);
//         console.log('SlicerCopy.length :>> ', SlicerCopy.length);
//         if (retreive.length > 0) {
//             // Recursive base case
//             if (SlicerCopy.length <= counter) {
//                 console.log('SlicerCopy :>> ', SlicerCopy);

//                 const layout = [...reportSlice.layoutInfo]
//                 await updateChartsFilteredData(layout, 0, 0, props.data.name, filterValue, props.data.name, filterValue, retreive, SlicerCopy)
//                 // await dispatch(updateLayoutInfo(SlicerCopy)); // Dispatch updated layout to store
//                 return;
//             }

//             // Current component in layout
//             const currentComponent = SlicerCopy[counter];
//             console.log('currentComponent.chart_name 700   :>> ', currentComponent.name, "currentIdx :>>>>", currentIdx, counter, currentComponent);

//             if (currentComponent.chart_name === "slicer") {
//                 console.log("currentComponent.chart_name", currentComponent.chart_name);
//                 if (!currentComponent.selected_filter) {
//                     currentComponent.selected_filter = [];
//                 }
//                 // Check if the filter already exists
//                 const filterIndex = _.findIndex(currentComponent.selected_filter, { filterKey });

//                 if (filterValue?.length === 0) {
//                     // Remove the filter if the value is empty
//                     if (filterIndex !== -1) {
//                         currentComponent.selected_filter.splice(filterIndex, 1);
//                     }
//                 } else {
//                     // If filter already exists, update it with the new filterValue array
//                     if (filterIndex !== -1) {
//                         currentComponent.selected_filter[filterIndex] = { filterKey, filterValue };

//                     } else {
//                         // Add new filter
//                         currentComponent.selected_filter.push({ filterKey, filterValue });
//                     }
//                 }

//                 console.log('Updated selected_filter for slicer:', currentComponent.selected_filter);

//                 // Filter slicer values (Apply slicer filter and also the waitername filter)
//                 const filteredInfo = _.filter(retreive, item => {
//                     // Apply slicer filters
//                     const slicerFilterApplied = _.every(currentComponent.selected_filter, filter =>
//                         _.includes(filter.filterValue, item[filter.filterKey])
//                     );

//                     // Apply the specific filter for waitername (check if it's in the specificFilterValue array)
//                     const specificFilterApplied = Array.isArray(specificFilterValue)
//                         ? specificFilterValue.some(value => value === item[specificFilterKey])  // .some ensures any match
//                         : item[specificFilterKey] === specificFilterValue;

//                     // Return true only if both slicer filter and specific waitername filter are satisfied
//                     return slicerFilterApplied && specificFilterApplied;
//                 });

//                 const updateData = filteredInfo.map(ele => ({
//                     value: ele[currentComponent.name],
//                     _id: ele._id,
//                 }));


//                 console.log('Filtered slicer values:', currentComponent);
//             }


//             // Move to the next component
//             counter++;
//             await updateSlicerInfoRecursively(SlicerCopy, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive);

//         }
//         else {
         
//             var updatedLayoutdata = reportSlice.layoutInfo.map(item => {
//                 return {
//                     ...item,
//                     filtered_data: [], // Assign an empty array to `filtered_data`
//                     // data :[]
//                 };
//             });
//             console.log("77777777");
//             await   dispatch(updateLayoutInfo(updatedLayoutdata)); // Dispatch updated layout to store

//         }

//     };




//     const updateChartsFilteredData = async (updatedLayout, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive, slicer) => {
//         console.log('Starting recursive update...');
//         console.log('Initial Parameters:');
//         console.log('Counter :>> ', counter);
//         console.log('CurrentIdx :>> ', currentIdx);
//         console.log('FilterKey :>> ', filterKey);
//         console.log('FilterValue :>> ', filterValue);
//         console.log('retreive :>> ', retreive);
//         console.log('specificFilterValue :>> ', specificFilterValue);

//         // Deep clone the layout to avoid mutating state
//         let layoutCopy = _.cloneDeep(updatedLayout);

//         // Recursive base case
//         if (layoutCopy.length <= counter) {
//             // console.log('Final layout before dispatch:', JSON.stringify(layoutCopy, null, 2));
//             console.log('layoutCopy :>> ', layoutCopy);
//             await dispatch(updateLayoutInfo(layoutCopy)); // Dispatch updated layout to store
//             return;
//         }

//         // Current component in layout
//         const currentComponent = layoutCopy[counter];
//         if (retreive.length > 0) {

//             if (currentComponent.chart_name !== "slicer" && currentComponent.x_axis_key && currentComponent.y_axis_key) {

//                 console.log('currentComponent.chart_name :>> ', currentComponent.chart_name, "X-Axis", currentComponent.x_axis_key);
//                 // Identify the slicer in the layout
//                 const slicerIndex = _.findIndex(slicer, { chart_name: "slicer" });

//                 // if (slicerIndex !== -1) {
//                 const slicerFilters = slicer[slicerIndex].selected_filter || [];

//                 console.log('Slicer filters applied to chart:', slicerFilters);


//                 // Apply slicer filters to collection data
//                 const filteredInfo = _.filter(retreive, item => {
//                     // Apply slicer filters
//                     const slicerFilterApplied = _.every(slicerFilters, filter =>
//                         _.includes(filter.filterValue, item[filter.filterKey])
//                     );

//                     // Apply the specific filter for waitername (check if it's in the specificFilterValue array)
//                     const specificFilterApplied = Array.isArray(specificFilterValue)
//                         ? specificFilterValue.some(value => value === item[specificFilterKey])  // .some ensures any match
//                         : item[specificFilterKey] === specificFilterValue;

//                     // Return true only if both slicer filter and specific waitername filter are satisfied
//                     return slicerFilterApplied && specificFilterApplied;
//                 });

//                 console.log('Filtered data from collection (before chart mapping):', filteredInfo), `<----- ${currentComponent.name}`;

//                 // Map filtered data to chart format
//                 currentComponent.filtered_data = filteredInfo.map(ele => {
//                     const xValue = ele[currentComponent.x_axis_key.name];
//                     const yValue = ele[currentComponent.y_axis_key.name];

//                     // Handle cases where y-axis value is nested or has special formats
//                     const numericString = (typeof yValue === "object" && yValue.$numberDecimal)
//                         ? yValue.$numberDecimal
//                         : yValue;
//                     const parsedValue = isNaN(parseFloat(numericString)) ? 0 : parseFloat(numericString);

//                     return {
//                         year: xValue,
//                         _id: ele._id,
//                         value: parsedValue,
//                     };
//                 });

//                 if (retreive.length > 0) {

//                     // Filter the data
//                     const filteredData = filterDataByDynamicKey(retreive, currentComponent.data, currentComponent.x_axis_key, currentComponent, filterKey, filterValue, "year");

//                     console.log('filteredData 266:>> ', filteredData, currentComponent.name);

//                     // Extract `waitername` values from cln_data (or whichever field is specified in x_axis_key)
//                     const waiterNamesFromClnData = retreive?.map(item => item[filterKey]);

//                     console.log('currentComponent  bar chart:>> ', currentComponent, waiterNamesFromClnData);
//                     // Filter `layout.data` where the `year` (equivalent to `waitername` in this case) matches the waiter names in `cln_data`
//                     const filteredLayoutData = currentComponent.data.filter(item => waiterNamesFromClnData.includes(item.year));

//                     console.log(filteredLayoutData, "filteredLayoutData");

//                     // if (filteredLayoutData.length > 0) {
//                     //     currentComponent.filtered_data = filteredLayoutData
//                     // }

//                     if (filteredData.length > 0) {
//                         currentComponent.filtered_data = filteredData
//                     }
//                     else {
//                         currentComponent.filtered_data = []
//                     }
//                 }
//                 else {
//                     currentComponent.filtered_data = []
//                     currentComponent.data = []
//                 }
//                 //  else if (currentComponent.filtered_data.length === 0) {
//                 //     currentComponent.filtered_data = currentComponent.data
//                 // }

//                 console.log('Filtered chart data:', currentComponent.filtered_data, currentComponent.filtered_data.length === 0 ? currentComponent.data.length : null);
//                 // }

//             }

//             console.log('currentComponent.chart_name 287 :>> ', currentComponent);


//             if (currentComponent.name !== 'bar_charts' &&
//                 currentComponent.name !== 'hor_barcharts' &&
//                 currentComponent.name !== 'slicer' && currentComponent.x_axis_key && currentComponent.yAxis_arr?.length > 0) {




//                 // if (currentComponent.chart_name === "Stack" && currentComponent.x_axis_key && currentComponent.yAxis_arr.length > 0) {
//                 console.log("Entered for Stack chart", currentComponent.name);

//                 // Identify the slicer in the layout
//                 const slicerIndex = _.findIndex(slicer, { chart_name: "slicer" });

//                 // if (slicerIndex !== -1) {
//                 const slicerFilters = slicer[slicerIndex].selected_filter || [];

//                 console.log('Slicer filters applied to stack chart:', slicerFilters, "layoutCopy", layoutCopy, "slicerIndex", slicerIndex);
//                 console.log('object :>> ', currentComponent);

//                 const filteredInfo = _.filter(retreive, item => {
//                     // Apply slicer filters
//                     const slicerFilterApplied = _.every(slicerFilters, filter =>
//                         _.includes(filter.filterValue, item[filter.filterKey])
//                     );

//                     // Apply the specific filter for waitername (check if it's in the specificFilterValue array)
//                     const specificFilterApplied = Array.isArray(specificFilterValue)
//                         ? specificFilterValue.some(value => value === item[specificFilterKey]) // .some ensures any match
//                         : item[specificFilterKey] === specificFilterValue;

//                     console.log('specificFilterApplied :>> ', specificFilterApplied);
//                     // Return true only if both slicer filter and specific waitername filter are satisfied
//                     return slicerFilterApplied && specificFilterApplied;
//                 });

//                 console.log('Filtered data from collection (before stack chart mapping):', filteredInfo, `<----- ${currentComponent.name}`);




//                 if (retreive.length > 0) {
//                     // Dynamic x_axis_key
//                     const x_axis_key = { name: filterKey };

//                     // Filter the data
//                     const filteredData = filterDataByDynamicKey(retreive, currentComponent.data, x_axis_key, currentComponent, filterKey, filterValue, "year");

//                     console.log('filteredData 331:>> ', filteredData, currentComponent.name);

//                     // Extract `waitername` values from cln_data (or whichever field is specified in x_axis_key)
//                     const waiterNamesFromClnData = retreive?.map(item => item[filterKey]);

//                     console.log('currentComponent :>> ', currentComponent, waiterNamesFromClnData);
//                     // Filter `layout.data` where the `year` (equivalent to `waitername` in this case) matches the waiter names in `cln_data`
//                     const filteredLayoutData = currentComponent.data.filter(item => waiterNamesFromClnData.includes(item.year));

//                     console.log(filteredLayoutData, "filteredLayoutData stack" , filteredData,"<--------", currentComponent);


//                     if (filteredLayoutData.length > 0) {
//                         currentComponent.filtered_data = filteredLayoutData
//                     } else {
//                         currentComponent.filtered_data = []
//                     }


//                     if (filteredData.length > 0) {
//                         currentComponent.filtered_data = filteredData
//                     }
//                     else {
//                         currentComponent.filtered_data = []
//                     }
//                 }

//                 // else if (currentComponent.filtered_data?.length === 0) {
//                 //     currentComponent.filtered_data = currentComponent.data
//                 // }
//                 else {
//                     currentComponent.filtered_data = []
//                     currentComponent.data = []

//                 }

//             }

//             // ---------------------------
//             if (currentComponent.card_name === 'rectangle_card') {
//                 console.log("Entered Card");
//                 // Extract the values of "Mealorder" based on the filterKey
//                 const values = retreive
//                     .filter(item => item[filterKey]) // Filter objects where filterKey exists
//                     .map(item => item.Mealorder); // Extract the Mealorder value

//                 console.log('values  461:>> ', values);


//                 // Calculate sum
//                 const sum = values.reduce((acc, value) => acc + value, 0);
//                 console.log('sum :>> ', sum);

//                 // Calculate total count
//                 const total = values.length;

//                 // Calculate average
//                 const avg = total > 0 ? sum / total : 0;

//                 // Calculate minimum
//                 const min = Math.min(...values);

//                 // Calculate maximum
//                 const max = Math.max(...values);


//                 console.log("Calc:", {
//                     total,
//                     sum,
//                     avg: parseFloat(avg.toFixed(2)), // Limit to 2 decimal places
//                     min,
//                     max
//                 });


//                 if (currentComponent.prefrd_calc.name === 'SUM') {
//                     currentComponent.filteredcount = sum
//                 }
//                 else if (currentComponent.prefrd_calc.name === 'AVG') {
//                     currentComponent.filteredcount = avg
//                 } else if (currentComponent.prefrd_calc.name === 'COUNT') {
//                     currentComponent.filteredcount = total
//                 } else if (currentComponent.prefrd_calc.name === 'MIN') {
//                     currentComponent.filteredcount = min
//                 } else if (currentComponent.prefrd_calc.name === 'MAX') {
//                     currentComponent.filteredcount = max
//                 }



//             }

//             if (currentComponent.name === "pie_chart") {
//                 console.log("Entered pie chart", currentComponent, filterKey, filterValue);

//                 // Identify the slicer in the layout
//                 const slicerIndex = _.findIndex(slicer, { chart_name: "slicer" });

//                 // if (slicerIndex !== -1) {
//                 const slicerFilters = slicer[slicerIndex].selected_filter || [];

//                 console.log('Slicer filters applied to pie chart:', slicerFilters, "layoutCopy", layoutCopy, "slicerIndex", slicerIndex);
//                 console.log('object :>> ', currentComponent);

//                 const filteredInfo = _.filter(retreive, item => {
//                     // Apply slicer filters
//                     const slicerFilterApplied = _.every(slicerFilters, filter =>
//                         _.includes(filter.filterValue, item[filter.filterKey])
//                     );

//                     // Apply the specific filter for waitername (check if it's in the specificFilterValue array)
//                     const specificFilterApplied = Array.isArray(specificFilterValue)
//                         ? specificFilterValue.some(value => value === item[specificFilterKey]) // .some ensures any match
//                         : item[specificFilterKey] === specificFilterValue;

//                     console.log('specificFilterApplied :>> ', specificFilterApplied);
//                     // Return true only if both slicer filter and specific waitername filter are satisfied
//                     return slicerFilterApplied && specificFilterApplied;
//                 });

//                 console.log('Filtered data from collection (before pie chart mapping):', filteredInfo, `<----- ${currentComponent.name}`);




//                 if (retreive.length > 0) {
//                     // Dynamic x_axis_key
//                     const x_axis_key = { name: filterKey };

//                     // Filter the data
//                     const filteredData = filterDataByDynamicKey(retreive, currentComponent.data, x_axis_key, currentComponent, filterKey, filterValue, "name");

//                     console.log('filteredData 331:>> ', filteredData, currentComponent.name);

//                     // Extract `waitername` values from cln_data (or whichever field is specified in x_axis_key)
//                     const waiterNamesFromClnData = retreive?.map(item => item[filterKey]);

//                     console.log('currentComponent is pie :>> ', currentComponent, waiterNamesFromClnData);
//                     // Filter `layout.data` where the `year` (equivalent to `waitername` in this case) matches the waiter names in `cln_data`
//                     const filteredLayoutData = currentComponent.data.filter(item => waiterNamesFromClnData.includes(item.name));

//                     console.log(filteredLayoutData, "filteredLayoutData pie");


//                     // if (filteredLayoutData.length > 0) {
//                     //     currentComponent.filtered_data = filteredLayoutData
//                     // }


//                     if (filteredData.length > 0) {
//                         currentComponent.filtered_data = filteredData
//                     }
//                     else {
//                         currentComponent.filtered_data = []
   
//                     }

//                 }

//                 // else if (currentComponent.filtered_data?.length === 0) {
//                 //     currentComponent.filtered_data = currentComponent.data
//                 // }
//                 else {
//                     currentComponent.filtered_data = []

//                 }

//                 console.log('Filtered pie chart data:', currentComponent.filtered_data);

//                 // }

//             }
//         } else {
//             currentComponent.filtered_data = []
//             // console.log('layoutcopy :>> ', layoutcopy);


//             var updatedLayoutdata = updatedLayout.map(item => {
//                 return {
//                     ...item,
//                     filtered_data: [], // Assign an empty array to `filtered_data`
//                     // data :[]
//                 };
//             });




//             // var updatedLayoutdata = layoutCopy.map(item => {
//             //     const { filtered_data, ...rest } = item;
//             //     console.log('rest :>> ', rest);// Exclude `filtereddata` from the object
//             //     return rest;
//             // });

//             // await   dispatch(updateLayoutInfo(updatedLayoutdata)); // Dispatch updated layout to store
//         }

//         // Move to the next component
//         counter++;
//         await updateChartsFilteredData(layoutCopy, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive, slicer);

//     }






//     const filterDataByDynamicKey = (query_filtered_data, data, x_axis_key, val, filterkey, filtervalue, name) => {
//         // Extract all values of the dynamic key (e.g., waitername) from query_filtered_data
//         const validKeys = query_filtered_data.filter(item => item[x_axis_key.name]);

//         console.log('validKeys :>> ', validKeys, val);

//         var filteredArr = validKeys.map((vdata, i) => {
//             console.log(' vdata[filterkey] :>> ', vdata[filterkey], vdata[val.x_axis_key.name]);
//             //  vdata[filterkey]
//             return vdata[val.x_axis_key.name]

//         })


//         console.log('filteredArr :>> ', filteredArr);
//         // Extract distinct waiter names from the data
//         const distinct = [...new Set(query_filtered_data.map(item => item[x_axis_key.name]))];
//         console.log("Distinct :", distinct);
//         // Filter the data array based on whether its dynamic key value exists in validKeys
//         const filteredData = data?.filter(item => filteredArr.includes(item[name]));
//         console.log('filteredData  527:>> ', filteredData, val.name);
//         return filteredData;
//     };



// //____________________________________________________________________________________________________________





//     const updateSlicerInfoRecursivelyLoop = async (slicer, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive) => {

//         console.log('Starting recursive update 1275...');
//         console.log('Initial Parameters:');
//         console.log('Counter :>> ', counter);
//         console.log('CurrentIdx :>> ', currentIdx);
//         console.log('FilterKey :>> ', filterKey);
//         console.log('FilterValue :>> ', filterValue);
//         console.log('retreive :>> ', retreive);
//         console.log('specificFilterValue :>> ', specificFilterValue);


//         let SlicerCopy = _.cloneDeep(slicer);
//         console.log('SlicerCopy.length :>> ', SlicerCopy.length);
//         if (retreive) {
//             // Recursive base case
//             if (SlicerCopy.length <= counter) {
//                 console.log('SlicerCopy :>> ', SlicerCopy);

//                 const layout = [...reportSlice.layoutInfo]
//                 await updateChartsFilteredDataLoop(layout, 0, 0, props.data.name, filterValue, props.data.name, filterValue, retreive, SlicerCopy)
//                 // await dispatch(updateLayoutInfo(SlicerCopy)); // Dispatch updated layout to store
//                 return;
//             }

//             // Current component in layout
//             const currentComponent = SlicerCopy[counter];
//             console.log('currentComponent.chart_name 700   :>> ', currentComponent.name, "currentIdx :>>>>", currentIdx, counter, currentComponent);

//             if (currentComponent.chart_name === "slicer") {
//                 console.log("currentComponent.chart_name", currentComponent.chart_name);
//                 if (!currentComponent.selected_filter) {
//                     currentComponent.selected_filter = [];
//                 }
//                 // Check if the filter already exists
//                 const filterIndex = _.findIndex(currentComponent.selected_filter, { filterKey });

//                 if (filterValue?.length === 0) {
//                     // Remove the filter if the value is empty
//                     if (filterIndex !== -1) {
//                         currentComponent.selected_filter.splice(filterIndex, 1);
//                     }
//                 } else {
//                     // If filter already exists, update it with the new filterValue array
//                     if (filterIndex !== -1) {
//                         currentComponent.selected_filter[filterIndex] = { filterKey, filterValue };

//                     } else {
//                         // Add new filter
//                         currentComponent.selected_filter.push({ filterKey, filterValue });
//                     }
//                 }

//                 console.log('Updated selected_filter for slicer:', currentComponent.selected_filter);

//                 // Filter slicer values (Apply slicer filter and also the waitername filter)
//                 const filteredInfo = _.filter(retreive, item => {
//                     // Apply slicer filters
//                     const slicerFilterApplied = _.every(currentComponent.selected_filter, filter =>
//                         _.includes(filter.filterValue, item[filter.filterKey])
//                     );

//                     // Apply the specific filter for waitername (check if it's in the specificFilterValue array)
//                     const specificFilterApplied = Array.isArray(specificFilterValue)
//                         ? specificFilterValue.some(value => value === item[specificFilterKey])  // .some ensures any match
//                         : item[specificFilterKey] === specificFilterValue;

//                     // Return true only if both slicer filter and specific waitername filter are satisfied
//                     return slicerFilterApplied && specificFilterApplied;
//                 });

//                 const updateData = filteredInfo.map(ele => ({
//                     value: ele[currentComponent.name],
//                     _id: ele._id,
//                 }));

//                 // currentComponent.filtered_slicer_values = _.uniqBy(updateData, "value").map(item => ({
//                 //     ...item,
//                 //     is_checked: true,
//                 // }));

//                 console.log('Filtered slicer values:', currentComponent);
//             }


//             // Move to the next component
//             counter++;
//             await updateSlicerInfoRecursivelyLoop(SlicerCopy, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive);

//         }
//         else {

//             var updatedLayoutdata = reportSlice.layoutInfo.map(item => {
//                 return {
//                     ...item,
//                     filtered_data: [], // Assign an empty array to `filtered_data`
//                     // data :[]
//                 };
//             });
//             console.log("77777777");
//             await dispatch(updateLayoutInfo(updatedLayoutdata)); // Dispatch updated layout to store

//             // var updatedLayoutdata = reportSlice.layoutInfo.map(item => {
//             //     const { filtered_data, ...rest } = item;
//             //     console.log('rest :>> ', rest);// Exclude `filtereddata` from the object
//             //     return rest;
//             // });
//             // await dispatch(updateLayoutInfo(updatedLayoutdata))
//         }

//     };


//     const updateChartsFilteredDataLoop = async (updatedLayout, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive, slicer) => {
//         console.log('Starting recursive update...');
//         console.log('Initial Parameters:');
//         console.log('Counter :>> ', counter);
//         console.log('CurrentIdx :>> ', currentIdx);
//         console.log('FilterKey :>> ', filterKey);
//         console.log('FilterValue :>> ', filterValue);
//         console.log('retreive 1393 :>> ', retreive);
//         console.log('specificFilterValue  1394:>> ', specificFilterValue);

//         // Deep clone the layout to avoid mutating state
//         let layoutCopy = _.cloneDeep(updatedLayout);

//         // Recursive base case
//         if (layoutCopy.length <= counter) {
//             // console.log('Final layout before dispatch:', JSON.stringify(layoutCopy, null, 2));
//             console.log('layoutCopy :>> ', layoutCopy);
//             await dispatch(updateLayoutInfo(layoutCopy)); // Dispatch updated layout to store
//             return;
//         }

//         // Current component in layout
//         const currentComponent = layoutCopy[counter];
//         if (retreive) {

//             if (currentComponent.chart_name !== "slicer" && currentComponent.x_axis_key && currentComponent.y_axis_key && currentComponent?.data?.length > 0) {

//                 console.log('currentComponent.chart_name :>> ', currentComponent.chart_name, "X-Axis", currentComponent.x_axis_key , currentComponent.data);

//                 console.log('currentComponent.x_axis_key  1416:>> ', retreive[currentComponent.x_axis_key.name]);

//                 // Extract _id values from retreive[currentComponent.x_axis_key.name]
//                 const idsToFilter = retreive[currentComponent.x_axis_key.name]?.map(item => item._id);

//                 // Filter currentComponent.data to exclude matching year values
//                 const filteredDataLoop = currentComponent.data[0][currentComponent.math_calc]?.filter(
//                     dataItem => idsToFilter.includes(dataItem.year)
//                 );

//                 // Set the filtered data on currentComponent.filtered_data
//                 currentComponent.filtered_data = filteredDataLoop;

//                 console.log('Filtered Data:', currentComponent?.filtered_data);

//                 // if (retreive.length > 0) {

//                 //     // Filter the data
//                 //     const filteredData = filterDataByDynamicKeyLoop(retreive, currentComponent.data, currentComponent.x_axis_key, currentComponent, filterKey, filterValue, "year");

//                 //     console.log('filteredData 266:>> ', filteredData, currentComponent.name);

//                 //     // Extract `waitername` values from cln_data (or whichever field is specified in x_axis_key)
//                 //     const waiterNamesFromClnData = retreive?.map(item => item[filterKey]);

//                 //     console.log('currentComponent  bar chart:>> ', currentComponent, waiterNamesFromClnData);
//                 //     // Filter `layout.data` where the `year` (equivalent to `waitername` in this case) matches the waiter names in `cln_data`
//                 //     const filteredLayoutData = currentComponent.data.filter(item => waiterNamesFromClnData.includes(item.year));

//                 //     console.log(filteredLayoutData, "filteredLayoutData");

//                 //     // if (filteredLayoutData.length > 0) {
//                 //     //     currentComponent.filtered_data = filteredLayoutData
//                 //     // }

//                 //     if (filteredData.length > 0) {
//                 //         currentComponent.filtered_data = filteredData
//                 //     }
//                 //     else {
//                 //         currentComponent.filtered_data = []
//                 //     }
//                 // }
//                 // else {
//                 //     currentComponent.filtered_data = []
//                 //     currentComponent.data = []
//                 // }
//                 //  else if (currentComponent.filtered_data.length === 0) {
//                 //     currentComponent.filtered_data = currentComponent.data
//                 // }

//                 console.log('Filtered chart data:', currentComponent?.filtered_data, currentComponent?.filtered_data?.length === 0 ? currentComponent?.data?.length : null);
//                 // }

//             }

//             console.log('currentComponent.chart_name 287 :>> ', currentComponent);

//             if (currentComponent.name !== 'bar_charts' &&
//                 currentComponent.name !== 'hor_barcharts' &&
//                 currentComponent.name !== 'slicer' && currentComponent.x_axis_key && currentComponent.yAxis_arr?.length > 0 && currentComponent?.data) {




//                 // if (currentComponent.chart_name === "Stack" && currentComponent.x_axis_key && currentComponent.yAxis_arr.length > 0) {
//                 console.log("Entered for Stack chart", currentComponent.name);

           
//                 // Extract _id values from retreive[currentComponent.x_axis_key.name]
//                 const idsToFilter = retreive[currentComponent.x_axis_key.name].map(item => item._id);

//                 // Filter currentComponent.data to exclude matching year values
//                 const filteredDataLoop = currentComponent.data[0][currentComponent.math_calc].filter(
//                     dataItem => idsToFilter.includes(dataItem.year)
//                 );

//                 // Set the filtered data on currentComponent.filtered_data
//                 currentComponent.filtered_data = filteredDataLoop;

//                 console.log('Filtered stack chart data:', currentComponent.filtered_data);

//             }

//             // ---------------------------
//             if (currentComponent.card_name === 'rectangle_card' && currentComponent.data.length > 0) {
//                 console.log("Entered Card");
//                 // Extract the values of "Mealorder" based on the filterKey
//                 const values = retreive
//                     .filter(item => item[filterKey]) // Filter objects where filterKey exists
//                     .map(item => item.Mealorder); // Extract the Mealorder value

//                 console.log('values  461:>> ', values);


//                 // Calculate sum
//                 const sum = values.reduce((acc, value) => acc + value, 0);
//                 console.log('sum :>> ', sum);

//                 // Calculate total count
//                 const total = values.length;

//                 // Calculate average
//                 const avg = total > 0 ? sum / total : 0;

//                 // Calculate minimum
//                 const min = Math.min(...values);

//                 // Calculate maximum
//                 const max = Math.max(...values);


//                 console.log("Calc:", {
//                     total,
//                     sum,
//                     avg: parseFloat(avg.toFixed(2)), // Limit to 2 decimal places
//                     min,
//                     max
//                 });


//                 if (currentComponent.prefrd_calc.name === 'SUM') {
//                     currentComponent.filteredcount = sum
//                 }
//                 else if (currentComponent.prefrd_calc.name === 'AVG') {
//                     currentComponent.filteredcount = avg
//                 } else if (currentComponent.prefrd_calc.name === 'COUNT') {
//                     currentComponent.filteredcount = total
//                 } else if (currentComponent.prefrd_calc.name === 'MIN') {
//                     currentComponent.filteredcount = min
//                 } else if (currentComponent.prefrd_calc.name === 'MAX') {
//                     currentComponent.filteredcount = max
//                 }



//             }

//             if (currentComponent.name === "pie_chart" && currentComponent?.data?.length > 0) {
//                 console.log("Entered pie chart", currentComponent, filterKey, filterValue);

//                 // Identify the slicer in the layout
//                 const slicerIndex = _.findIndex(slicer, { chart_name: "slicer" });

//                 // if (slicerIndex !== -1) {
//                 const slicerFilters = slicer[slicerIndex].selected_filter || [];

//                 console.log('Slicer filters applied to pie chart:', slicerFilters, "layoutCopy", layoutCopy, "slicerIndex", slicerIndex);
//                 console.log('object :>> ', currentComponent);

//                 const filteredInfo = _.filter(retreive, item => {
//                     // Apply slicer filters
//                     const slicerFilterApplied = _.every(slicerFilters, filter =>
//                         _.includes(filter.filterValue, item[filter.filterKey])
//                     );

//                     // Apply the specific filter for waitername (check if it's in the specificFilterValue array)
//                     const specificFilterApplied = Array.isArray(specificFilterValue)
//                         ? specificFilterValue.some(value => value === item[specificFilterKey]) // .some ensures any match
//                         : item[specificFilterKey] === specificFilterValue;

//                     console.log('specificFilterApplied :>> ', specificFilterApplied);
//                     // Return true only if both slicer filter and specific waitername filter are satisfied
//                     return slicerFilterApplied && specificFilterApplied;
//                 });

//                 console.log('Filtered data from collection (before pie chart mapping):', filteredInfo, `<----- ${currentComponent.name}`);


//                                                     // if (currentComponent.chart_name === "Stack" && currentComponent.x_axis_key && currentComponent.yAxis_arr.length > 0) {
//                                                     console.log("Entered for PIE chart", currentComponent.name);


//                                                     // Extract _id values from retreive[currentComponent.x_axis_key.name]
//                                                     const idsToFilter = retreive[currentComponent.x_axis_key.name].map(item => item._id);

//                                                     console.log('idsToFilter :>> ', idsToFilter , currentComponent.data);
//                                                     // Filter currentComponent.data to exclude matching year values
//                                                     const filteredDataLoop = currentComponent.data.filter(
//                                                         dataItem => idsToFilter.includes(dataItem.name)
//                                                     );

//                                                     // Set the filtered data on currentComponent.filtered_data
//                                                     currentComponent.filtered_data = filteredDataLoop;

//                                                     console.log('Filtered Pies chart data:', currentComponent.filtered_data);
    


//                 // if (retreive) {
//                 //     // Dynamic x_axis_key
//                 //     const x_axis_key = { name: filterKey };

//                 //     // Filter the data
//                 //     const filteredData = filterDataByDynamicKeyLoop(retreive, currentComponent.data, x_axis_key, currentComponent, filterKey, filterValue, "name");

//                 //     console.log('filteredData 331:>> ', filteredData, currentComponent.name);

//                 //     // Extract `waitername` values from cln_data (or whichever field is specified in x_axis_key)
//                 //     const waiterNamesFromClnData = retreive?.map(item => item[filterKey]);

//                 //     console.log('currentComponent is pie :>> ', currentComponent, waiterNamesFromClnData);
//                 //     // Filter `layout.data` where the `year` (equivalent to `waitername` in this case) matches the waiter names in `cln_data`
//                 //     const filteredLayoutData = currentComponent.data.filter(item => waiterNamesFromClnData.includes(item.name));

//                 //     console.log(filteredLayoutData, "filteredLayoutData pie");


//                 //     // if (filteredLayoutData.length > 0) {
//                 //     //     currentComponent.filtered_data = filteredLayoutData
//                 //     // }


//                 //     if (filteredData.length > 0) {
//                 //         currentComponent.filtered_data = filteredData
//                 //     }
//                 //     else {
//                 //         currentComponent.filtered_data = []

//                 //     }

//                 // }


//                 // else {
//                 //     currentComponent.filtered_data = []

//                 // }

//                 console.log('Filtered pie chart data:', currentComponent.filtered_data);

//                 // }

//             }
//         } else {
//             currentComponent.filtered_data = []
//             // console.log('layoutcopy :>> ', layoutcopy);


//             var updatedLayoutdata = updatedLayout.map(item => {
//                 return {
//                     ...item,
//                     filtered_data: [], // Assign an empty array to `filtered_data`
//                     // data :[]
//                 };
//             });

//         }

//         // Move to the next component
//         counter++;
//         await updateChartsFilteredDataLoop(layoutCopy, counter, currentIdx, filterKey, filterValue, specificFilterKey, specificFilterValue, retreive, slicer);

//     }

//     const filterDataByDynamicKeyLoop = (query_filtered_data, data, x_axis_key, val, filterkey, filtervalue, name) => {
//         console.log('query_filtered_data :>> ', query_filtered_data);
//         // Extract all values of the dynamic key (e.g., waitername) from query_filtered_data
//         const validKeys = query_filtered_data.filter(item => item[x_axis_key.name]);

//         console.log('validKeys :>> ', validKeys, val);

//         var filteredArr = validKeys.map((vdata, i) => {
//             console.log(' vdata[filterkey] :>> ', vdata[filterkey], vdata[val.x_axis_key.name]);
//             //  vdata[filterkey]
//             return vdata[val.x_axis_key.name]

//         })


//         console.log('filteredArr :>> ', filteredArr);
//         // Extract distinct waiter names from the data
//         const distinct = [...new Set(query_filtered_data.map(item => item[x_axis_key.name]))];
//         console.log("Distinct :", distinct);
//         // Filter the data array based on whether its dynamic key value exists in validKeys
//         const filteredData = data?.filter(item => filteredArr.includes(item[name]));
//         console.log('filteredData  527:>> ', filteredData, val.name);
//         return filteredData;
//     };



//     const handleReset = () => {
//         // Clear selected values
//         setSelectedValues([]);
//         // Clear filter values in the store
//         dispatch(setfilterValue([]));
//          dispatch(setqueryFilter([]));
//     };


//     const selectList = async (event, item) => {
//         var selectedCollectionData = reportSlice.selectedCollectionData
//         // console.log('selectedCollectionData', selectedCollectionData)
//         var itemInfo = { ...item }
//         itemInfo["is_checked"] = event.target.checked

//         // itemInfo["key"]=props.data.name
//         console.log('itemInfo', itemInfo)
//         var updatedInfo = [...selectedValues]
//         if (event.target.checked) {
//             updatedInfo.push(itemInfo)
//         }
//         else {
//             var getIdx = _.findIndex(updatedInfo, { _id: itemInfo._id })
//             // console.log(getIdx, 'getIdx')
//             if (getIdx !== -1) {
//                 updatedInfo = [
//                     ...updatedInfo.slice(0, getIdx),
//                     ...updatedInfo.slice(getIdx + 1)
//                 ];
//             }

//         }

//             console.log('reportSlice.updatedSliceData', reportSlice, reportSlice.updatedSliceData, updatedInfo, props.data.i)
//         const Slicer = [...reportSlice.updatedSliceData]
//         const layout = [...reportSlice.layoutInfo]
//         var getIdx = _.findIndex(Slicer, { i: props.data.i })
//         console.log(getIdx, 'getIdx')
//         setSelectedValues(updatedInfo)
//         var filterValue = _.map(updatedInfo, 'value')
//         // console.log('filterValue 277 :>> ', props.data.name, '=>', filterValue, "updatedInfo=>", updatedInfo);
//         console.log('filterValue', filterValue)
//         // Extract x_axis_key values
//         // const xAxisKeys = layout.map(item =>  item.x_axis_key !== undefined && item.x_axis_key );



//         const xAxisKeys = layout
//             .filter(item => item.x_axis_key !== undefined)
//             .map(item => item.x_axis_key);




//         // Log the result
//         console.log('Extracted x_axis_key values:', xAxisKeys);

//         // Extract unique values of name
//         const uniqueNames = [...new Set(xAxisKeys.map(item => item.name))];

//         console.log('Unique Names:', uniqueNames, filterValue);
//         dispatch(setfilterValue(filterValue))



//         // Combine updatedInfo with queryFilter grouped by key
//         const existingQueryFilter = reportSlice.queryFilter || {};
//         const key = props.data.name;
//         console.log('existingQueryFilter', existingQueryFilter)

//         const combinedQueryFilter = {
//              ...existingQueryFilter, [key]: event.target.checked ?
//               _.uniqBy([...(existingQueryFilter[key] || []), itemInfo], '_id') 
//                 : (existingQueryFilter[key] || []).filter(obj => obj._id !== itemInfo._id) 
//         };
//         setdataLoading(true)
//         // console.log('Combined Query Filter:', combinedQueryFilter);
//         //    await updateSlicerInfoRecursively(layout,0,getIdx,props.data.name,filterValue ,props.data.name , filterValue )

//         console.log('combinedQueryFilter :>> ', combinedQueryFilter);
//         // // Dispatch the updated queryFilter
//         await dispatch(setqueryFilter(combinedQueryFilter));


//         const areAllFieldsEmpty = (combinedQueryFilter) => {
//             return Object.values(combinedQueryFilter).every((field) => field.length === 0);
//         };
       
//         if (areAllFieldsEmpty(combinedQueryFilter)) {
//             console.log("All fields are empty.");
//             // Perform your specific action here

//             const updatedLayout = layout.map((item , i)=> {
//                 const { filtered_data, ...rest  } = item; // Exclude `filtereddata` from the object
//                 console.log("item.iitem.i", item.i);
//                 dispatch(toggleProcessingState(item.i)); // Sets all states to undefined
   
//                 return rest;
//             });

//             console.log("updatedLayout After Unchecked All Check Boxes", updatedLayout);
//             dispatch(updateLayoutInfo(updatedLayout))
//             setdataLoading(false)

//         } else {
//             console.log("Some fields are not empty.");
//             // Perform your alternative action here
//             var retreive = await dispatch(retreivedataQuery(combinedQueryFilter, authInfo , uniqueNames))
//             console.log('retreive :>> ', retreive);

//             // if (retreive.data) {
//             //     // await updateSlicerInfoRecursively(layout, 0, getIdx, props.data.name, filterValue, props.data.name, filterValue, retreive, Slicer)
//             //     await updateSlicerInfoRecursively(Slicer, 0, getIdx, props.data.name, filterValue, props.data.name, filterValue, retreive.data)
//             //     setdataLoading(false)
//             // }


//             if( retreive.distinctValues ){
//             await  updateSlicerInfoRecursivelyLoop(Slicer, 0, getIdx, props.data.name, filterValue, props.data.name, filterValue, retreive.distinctValues)
//             setdataLoading(false)
//             }
//         }


     



//         // // Extract distinct waiter names from the data
//         // const distinctWaiternames = [...new Set(retreive.map(item => item.waitername))];

//         // console.log("Distinct Waiternames:", distinctWaiternames);




       





//     }

//     // Expose the function via ref
//     useImperativeHandle(ref, () => ({
//         updateSlicer: updateSlicerInfoRecursively,
//         resetfilter: handleReset
//     }));

//     return (
//         <div>
//             {
//                 dataLoading &&
//                 <Spinner />
//             }


//             <div className="" style={{ height: '100%', overflowY: 'auto' }}>
//                 <div ref={(el) => (refs.current[`filterRef${props.data.i}`] = el)} id={`filterRef${props.data.i}`}>
//                     {props.data.filtered_slicer_values !== undefined
//                         ? props.data.filtered_slicer_values.map((ele, pos) => {
//                             const tooltipId = `tooltip-${props.data.i}-${pos}`;
//                             return (
//                                 <div key={pos}>
//                                     <input type="checkbox" onChange={(e) => selectList(e, ele)} className="me-2" />
//                                     <label id={tooltipId}>
//                                         {ele.value?.length > 10 ? `${ele.value.substring(0, 10)}...` : ele.value}
//                                     </label>
//                                     {ele.value?.length > 10 && (
//                                         <UncontrolledTooltip placement="auto" target={tooltipId} > {ele.value} </UncontrolledTooltip>
//                                     )}
//                                 </div>
//                             );
//                         })
//                         : props.data?.slicer_values?.map((ele, indx) => {
//                             const tooltipId = `tooltip-${props.data.i}-${indx}`;
//                             return (

//                                 <div key={indx}>
//                                     <input type="checkbox" onChange={(e) => selectList(e, ele)} className="me-2" />
//                                     <label id={tooltipId}>
//                                         {
//                                             ele?.value?.length > (enableLength === undefined ? 9 : 14)
//                                                 ? `${ele.value.substring(0, enableLength === undefined ? 9 : 15)}...`
//                                                 : ele.value
//                                         }
//                                     </label>
//                                     {ele?.value?.length > (enableLength === undefined ? 9 : 15) && (
//                                         <UncontrolledTooltip placement="auto" target={tooltipId} >
//                                             {ele.value}
//                                         </UncontrolledTooltip>
//                                     )}
//                                 </div>

//                             );
//                         })}
//                 </div>
//             </div>
//         </div>

//     )

//     // return (
//     //     <div>
//     //         {
//     //             dataLoading &&
//     //             <Spinner />
//     //         }
//     //         {/* <label>Selected Key :{props.data.name}</label> */}
//     //         <div className="" style={{ maxHeight: containerHeight - 30, overflowY: 'auto' }}>


//     //             <div
//     //                 ref={el => (refs.current[`filterRef${props.data.i}`] = el)}
//     //                 id={`filterRef${props.data.i}`}
//     //             >
//     //                 {
//     //                     props.data.filtered_slicer_values !== undefined ?
//     //                         props.data.filtered_slicer_values.map((ele, pos) => {
//     //                             return (
//     //                                 <div key={pos}>
//     //                                     <input type='checkbox'
//     //                                         onChange={(e) => { selectList(e, ele) }}
//     //                                         className='me-2'
//     //                                     />{ele.value}
//     //                                 </div>
//     //                             )
//     //                         })
//     //                         :
//     //                         props.data?.slicer_values?.map((ele, indx) => {
//     //                             return (
//     //                                 <div key={indx}>
//     //                                     <input type='checkbox'
//     //                                         onChange={(e) => { selectList(e, ele) }}
//     //                                         className='me-2'
//     //                                     />{ele.value}
//     //                                 </div>
//     //                             )
//     //                         })
//     //                 }
//     //             </div>
                

//     //         </div>

//     //     </div>

//     // )
// }
// )
// // Add display name for debugging
// Slicer.displayName = "Slicer";
// export default Slicer
