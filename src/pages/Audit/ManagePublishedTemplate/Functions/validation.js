import _, { repeat } from "lodash";
var moment = require('moment')


let validation = {


    updatecclevel: (methodSelected, publishTemplate) => {

        if (methodSelected === "1") {

            if (publishTemplate.endpoints?.length === 0) {
                publishTemplate["cc_level"] = 0
            }
            else {

                var checkAllEndpointsValid = _.every(publishTemplate.endpoints, { rowValid: true })
                console.log(checkAllEndpointsValid,'checkAllEndpointsValid')
                if (checkAllEndpointsValid) {

                    publishTemplate["cc_level"] = 2

                    if (publishTemplate.repeat_mode === "One time") {
                        publishTemplate["cc_level"] = 3
                    }
                    if (publishTemplate.repeat_mode === "Daily" &&
                        publishTemplate.repeat_mode_config.start_date !== null && publishTemplate.repeat_mode_config.end_date !== null) {
                        publishTemplate["cc_level"] = 3
                    }
                    if (publishTemplate.repeat_mode === "Daily" && publishTemplate.repeat_mode_config.scheduled_shift?.length > 0 ) {
                        publishTemplate["cc_level"] = 3

                    }
                    if (publishTemplate.repeat_mode === "Weekly" & publishTemplate.repeat_mode_config.scheduled_shift?.length > 0
                    ) {
                        publishTemplate["cc_level"] = 3
                    }
                 

                    if (publishTemplate.repeat_mode === "Monthly" &&  publishTemplate.repeat_mode_config.scheduled_shift?.length > 0) {
                        publishTemplate["cc_level"] = 3
                    
                    }
                    if (publishTemplate.repeat_mode === "Quaterly") {
                        if (publishTemplate.repeat_mode_config.calendar_type !== null && publishTemplate.repeat_mode_config.selected_quater !== undefined && publishTemplate.repeat_mode_config.selected_quater !== null && publishTemplate.repeat_mode_config.selected_months !== null && publishTemplate.repeat_mode_config.selected_months !== undefined) {
                            publishTemplate["cc_level"] = 3
                        }
                    }
                    if (publishTemplate.repeat_mode === "Half-Yearly") {
                        if (publishTemplate.repeat_mode_config.calendar_type !== null && publishTemplate.repeat_mode_config.selected_half_yearly !== undefined && publishTemplate.repeat_mode_config.selected_half_yearly !== null && publishTemplate.repeat_mode_config.selected_months !== null && publishTemplate.repeat_mode_config.selected_months !== undefined) {
                            publishTemplate["cc_level"] = 3

                        }
                    }

                    if (publishTemplate.start_date !== null && publishTemplate.end_date !== null) {
                        publishTemplate["cc_level"] = 4
                    }

                }
                else {
                    publishTemplate["cc_level"] = 0
                }

            }

        }else
            if (methodSelected === "2" && publishTemplate.hirearchy_type !=='2') {
                console.log(publishTemplate,'publishTemplate')
                if (publishTemplate.hlevel !== null &&
                    publishTemplate.ep_level !== null &&
                    publishTemplate.ep_selected?.length !== 0
                ) {
                    publishTemplate["cc_level"] = 1
                     var filter_location = _.filter(publishTemplate.endpoints, endpoint => endpoint.disabled !== true);
                    console.log(filter_location,'filter_location')
                     var checkAllEndpointsValid = _.every(filter_location, { rowValid: true })
                    // console.log(checkAllEndpointsValid,'checkAllEndpointsValid')
                    if (!publishTemplate.enable_review &&
                        publishTemplate.audit_userlevel !== null &&
                        publishTemplate.endpoints?.length !== 0 &&
                        checkAllEndpointsValid && filter_location?.length !== 0) {
                        publishTemplate["cc_level"] = 2
                    }
                    else
                        if (publishTemplate.enable_review &&
                            publishTemplate.audit_userlevel !== null &&
                            publishTemplate.review_userlevel !== null &&
                            publishTemplate.endpoints?.length !== 0 && checkAllEndpointsValid && filter_location?.length !== 0) {
                            publishTemplate["cc_level"] = 2
                        }

                    if (publishTemplate.cc_level === 2) {
                        if (publishTemplate.repeat_mode === "One time") {
                            publishTemplate["cc_level"] = 3
                        }
                        if (publishTemplate.repeat_mode === "Daily" &&
                            publishTemplate.repeat_mode_config.start_time !== null && publishTemplate.repeat_mode_config.end_time !== null) {
                            publishTemplate["cc_level"] = 2
                        }
                        if (publishTemplate.repeat_mode === "Daily" && publishTemplate.repeat_mode_config.scheduled_shift?.length > 0 ) {
                            publishTemplate["cc_level"] = 3

                            console.log(publishTemplate.repeat_mode_config.scheduled_shift !== 0,'mee')
                        }
                        if (publishTemplate.repeat_mode === "Weekly" &&
                            publishTemplate.repeat_mode_config.scheduled_shift?.length > 0) {
                            publishTemplate["cc_level"] = 3
                        }
                        if (publishTemplate.repeat_mode === "Monthly" &&  publishTemplate.repeat_mode_config.scheduled_shift?.length > 0) {
                            publishTemplate["cc_level"] = 3
                        

                        }
                       

                        if (publishTemplate.start_date !== null && publishTemplate.end_date !== null) {
                            publishTemplate["cc_level"] = 4
                        }
                    }

                }
                else {
                    publishTemplate["cc_level"] = 0
                }
            }
            else{
                if(methodSelected == "2"&& publishTemplate.hirearchy_type == "2"){
                    if (publishTemplate.hlevel !== null &&
                        // publishTemplate.ep_level !== null &&
                        publishTemplate.ep_selected?.length !== 0
                    ) {
                        publishTemplate["cc_level"] = 1
                        var filter_location = _.filter(publishTemplate.endpoints, endpoint => endpoint.disabled !== true);
                       console.log(filter_location,'filter_location',publishTemplate)
                        var checkAllEndpointsValid = _.every(filter_location, { rowValid: true })
                        if (!publishTemplate.enable_review &&
                            publishTemplate.audit_userlevel !== null &&
                            publishTemplate.endpoints?.length !== 0 &&
                            checkAllEndpointsValid && filter_location?.length !== 0) {
                                console.log("check")
                            publishTemplate["cc_level"] = 2
                        }
                        else
                            if (publishTemplate.enable_review &&
                                publishTemplate.audit_userlevel !== null &&
                                publishTemplate.review_userlevel !== null &&
                                publishTemplate.endpoints?.length !== 0 && checkAllEndpointsValid && filter_location?.length !== 0) {
                                    console.log("check11",publishTemplate)
                             
                                    publishTemplate["cc_level"] = 2
                            }
    
                        if (publishTemplate.cc_level === 2) {
                            if (publishTemplate.repeat_mode === "One time") {
                                publishTemplate["cc_level"] = 3
                            }
                            if (publishTemplate.repeat_mode === "Daily" &&
                                publishTemplate.repeat_mode_config.start_time !== null && publishTemplate.repeat_mode_config.end_time !== null) {
                                publishTemplate["cc_level"] = 2
                            }

                            if (publishTemplate.repeat_mode === "Daily" && publishTemplate.repeat_mode_config.scheduled_shift?.length > 0 ) {
                                publishTemplate["cc_level"] = 3
    
                            }
                            if (publishTemplate.repeat_mode === "Weekly" &&
                                publishTemplate.repeat_mode_config.scheduled_shift?.length > 0
                                // _.some(publishTemplate.repeat_mode_config.days, { checked: true })
                            ) {
                                publishTemplate["cc_level"] = 3
                            }
    
                            if (publishTemplate.repeat_mode === "Monthly" &&  publishTemplate.repeat_mode_config.scheduled_shift?.length > 0) {
                                publishTemplate["cc_level"] = 3
                              
                            }
    
                            if (publishTemplate.start_date !== null && publishTemplate.end_date !== null) {
                                publishTemplate["cc_level"] = 4
                            }
                        }
    
                    }




                }
            }

            return publishTemplate

    }


}

export default validation;

