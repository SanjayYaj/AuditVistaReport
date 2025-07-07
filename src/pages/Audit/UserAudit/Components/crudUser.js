import React from 'react';
import { useEffect, useState } from 'react';
import {Row, Col, Button, Modal, ModalHeader, ModalBody,Form,Label,Input,FormFeedback} from "reactstrap";
import urlSocket from '../../../../helpers/urlSocket';
import Swal from "sweetalert2";
import { LoadingOutlined } from '@ant-design/icons';
import { useFormik } from "formik";
import * as Yup from "yup";
import { _ } from 'core-js';





const propTypes = {};

const defaultProps = {};

const CrudUser = (props) => {
    console.log(props.location_info.method_selected,'props.location_info.method_selected')
    if(props.location_info.method_selected === "2"){

        const [show, setShow] = useState(true)
        const [dataLoaded, setdataLoaded] = useState(false)
        const [errorMessage, seterrorMessage] = useState(false)
        const [invalid_user, setinvalid_user] = useState(false)
        const [invalid_phone_num, setinvalid_phone_num] = useState(false)
        const [categoryDisabled, setcategoryDisabled] = useState(false)
        const [cat_name_exist, setcat_name_exist] = useState(false)
        const [givenEmail, setgivenEmail] = useState("")
        const [countryCode, setcountryCode] = useState("+91")

        const [assigned_task_users, setassigned_task_users] = useState([])
        const [locationUserlvl, setLocationUserlvl] = useState(props.location_info.location_user_level)
        const [secret_key, setsecret_key] = useState('Pkdh347ey%3Tgs')
        const [catName, setcatName] = useState('')
        const [rolePermisson, setrolePermisson] = useState('')
        const [roleErr, setroleErr] = useState(false)
        const [btn_load,setbtn_load] = useState(false)
        const [emailExist,setEmailExist]= useState(false)
        const [phoneExist,setphoneExist]= useState(false)
        const [btnLoad,setbtnLoad]= useState(false)

          const [clientInfo, setClientInfo] = useState(JSON.parse(sessionStorage.getItem("client_info")))[0]
        
    
        const [db_info, setDbInfo] = useState({
            db_name: JSON.parse(sessionStorage.getItem("db_info")).db_name,
            encrypted_db_url: JSON.parse(sessionStorage.getItem("db_info")).encrypted_db_url
        })
        const [sessionUserInfo, setsessionUserInfo] = useState(JSON.parse(sessionStorage.getItem('authUser')))
    
        const multiRef = React.useRef()
    
    
        useEffect(() => {
            console.log("create users")
            setdataLoaded(true)

            var createNewExists = locationUserlvl.some(user => user.hirerachy_name === "+Create new");
            console.log(createNewExists,'createNewExists',locationUserlvl)
            if(!createNewExists){
                locationUserlvl.unshift({
                    hirerachy_name: "+Create new"
                })
            }
            console.log(props.location_info, 'props.location_info')
        }, [])
    
    
        const emai_addrs = (e) => {
            var email = e.target.value
            if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
                setgivenEmail(email)
                seterrorMessage(false)
            }
            else {
                seterrorMessage(true)
                setgivenEmail(email)
            }
    
        }
    
        const onSelectValues = (selectedList, selectedItem) => {
            if (selectedItem.hirerachy_name === "+Create new") {
                console.log(selectedList, selectedItem, multiRef)
                setcategoryDisabled(true)
    
            }
            else {
                console.log(selectedList, selectedItem)
                setassigned_task_users(selectedList)
            }
        }
    
        const onRemove = (selectedItem) => {
            console.log(selectedItem, 'selectedItem', assigned_task_users)
        }
    
        const Validsubmit=async(events,values)=>{
            console.log(values,'values')

        }


        const validation = useFormik({
            initialValues:{
                firstname:"",
                email_id:"",
                countrycode:"",
                phone_number:"",
                role :""
            },
            validationSchema: Yup.object({
                firstname: Yup.string().required("Name is required")
                .matches(/\S+/, "Name cannot be just spaces")
                .min(clientInfo.incd_rpt_validation.name_min, `Name must be at least ${clientInfo.incd_rpt_validation.name_min} characters`)
            ,
             role: Yup.string().required("Role name is required"),
            email_id: Yup.string().email("Invalid email format")
                .test(async function (value) {
                    console.log(value,'value')
                  if (value) {
                    return !(await validateId("cln_adt_users","email_id", value))
                  }
                  else{
                    return true
                  }
                })
                ,
            countrycode: Yup.string().nullable()
            .test('countrycode-required', 'Country code is required if phone number is provided', function (value) {
                const { phone_number } = this.parent;
                if (phone_number && phone_number.length > 0) {
                    return !!value && value !== 'Select';
                }
                return true;
            }
            )
            ,
            phone_number: Yup.string().nullable()
            .test('phone-required', 'Phone number is required if country code is provided', function (value) {
                const { countrycode } = this.parent;
                if (countrycode && countrycode !== 'Select') {
                    return !!value;
                }
                return true;
            }
            ).test(async function (value) {
                console.log(value, 'value')
                if (value) {
                    return !(await validateId("cln_adt_users","phone_number", value))
                }
                else{
                    return true
                  }
            }),


            })
            ,
            onSubmit: async (values) => {
                if(!emailExist && !phoneExist){
                    if (!values.phone_number && !values.email_id) {
                        // setSubmitting(false)
                          validation.setErrors({
                              phone_number: "Enter either Phone number or Email.",
                              email_id: "Enter either Phone number or Email.",
                          });
                          return;
                      }


                    console.log(values,'values')
                    setbtnLoad(true)
                    const authUser = JSON.parse(sessionStorage.getItem("authUser"));
                    values["encrypted_db_url"]=authUser.db_info.encrypted_db_url
                    values["fullNo"]=values.phone_number
                    values["company_id"]=authUser.client_info[0]["company_id"]
                    try {
                       const responseData = await urlSocket.post("cog/create-new-user",{user_info:values})
                        console.log(responseData,'responseData') 
                        if(responseData.status === 200){
                            if(responseData.data.admn_user.length >0){
                                var selectedRoleInfo = _.filter(sessionUserInfo.config_data.action_plan_roles,{id : Number(values.role)})
                                props.location_info.location_unique_users.push({
                                    cat_type: [],
                                    hirerachy_name: [],
                                    designation: "",
                                    _id: responseData.data.admn_user[0]["_id"],
                                    name: values.firstname,
                                    title: props.location_info.name,
                                    email_id : values.email_id,
                                    phone_num : values.phone_number,
                                    user_id: responseData.data.admn_user[0]["_id"],
                                    facilities : selectedRoleInfo.length >0 ? selectedRoleInfo[0]["facilities"]:[],
                                    role_name : selectedRoleInfo.length >0 ? selectedRoleInfo[0]["role_name"]:[],
                                    role_description : selectedRoleInfo.length >0 ? selectedRoleInfo[0]["role_description"]:[],
                                    id :selectedRoleInfo.length >0 ? selectedRoleInfo[0]["id"]:[],
                                })
                                console.log(props.location_info.location_unique_users,'props.location_info.location_unique_users')
                                console.log(props.location_info,'location_info')
                                await updtPublishedLocation(props.location_info)

                            }

                        }


                    } catch (error) {
                        
                    }


                }



            }


        })



    const validateId=async(cln_name,key_name,value)=>{
        console.log(cln_name,key_name,value,'cln_name,key_name,value')
        try {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"));
        const requestData = {
            encrypted_db_url: authUser.db_info.encrypted_db_url,
            db_name: authUser.db_info.db_name,
            dynamic_cln: cln_name,
            dynamic_key: key_name,
            editInfo: null,
            dynamic_value: value,
          };

         const responseData = await urlSocket.post("cog/dup-name-validation", requestData);
          console.log(responseData,'responseData')
          if(responseData.status === 200){
            key_name ==="email_id" ? setEmailExist(responseData.data.data.length >0 ? true : false) : setphoneExist(responseData.data.data.length >0 ? true : false)
          }
            
        } catch (error) {
            console.log(error,'error')
        }


    }

    
        
        const updtPublishedLocation = (location_info) => {
    
            try {
                urlSocket.post('task/update-published-location', {
                    locationInfo: location_info,
                    encrypted_db_url: db_info.encrypted_db_url,
                    mode : "2"
                }).then((res) => {
                    console.log(res)
                    if (res.status === 200) {
                        setbtn_load(false)
                        setbtnLoad(false)
                        Swal.fire({
                            icon: 'success',
                            title: 'User Created successfully',
                            text: 'User Created successfully',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Close',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                sessionStorage.setItem(JSON.stringify(location_info), 'endpointData')
                                props.updateLocationUser(location_info.location_unique_users)
                                props.toggle()
                                // window.location.reload()
                            }
    
                        })
                    }
                })
    
            } catch (error) {
    
            }
    
    
        }
    
    
    
    
        const validate_email = (e, mode) => {
            var admn_info = {}
            if (mode == 1) {
                admn_info["email_id"] = e.target.value
            }
            if (mode === 2) {
                admn_info["phone_number"] = e.target.value
            }
    
            admn_info["encrypted_db_url"] = db_info.encrypted_db_url
            admn_info["db_name"] = db_info.db_name
            admn_info["user_id"] = sessionUserInfo.user_data._id
    
            try {
                urlSocket.post('cog/check-user-exist', { admn_info: admn_info }).then((data) => {
                    if (mode == 1) {
                        if (data.data.response_code === 504 && data.data.message === "Email Id already exist for another user") {
                            setinvalid_user(true)
                        }
                        else {
                            setinvalid_user(false)
                        }
                    }
                    if (mode == 2) {
                        if (data.data.response_code === 504 && data.data.message === "Email Id already exist for another user") {
                            setinvalid_phone_num(true)
                        }
                        else {
                            setinvalid_phone_num(false)
    
                        }  
                    }
                })
            }
            catch (error) {
                console.log(error, 'error')
            }   
        }
    
    
    
        const validateCatName = (event) => {
    
            var validate_category_name = _.filter(locationUserlvl, item => {
                const cleanedHierarchyName = item.hirerachy_name?.replace(/\s/g, '').toLowerCase();
                const cleanedEventValue = event.target.value?.replace(/\s/g, '').toLowerCase();
                return cleanedHierarchyName === cleanedEventValue;
    
            })
            if (validate_category_name.length > 0) {
                setcat_name_exist(true)
            }
            else {
                setcat_name_exist(false)
            }
    
    
    
        }
    
    
    
        if (dataLoaded) {
            return (
                <div>
                    <Modal isOpen={props.modal} toggle={props.toggle}  >
                        <ModalHeader toggle={props.toggle} tag="h4">
                            Create User
                        </ModalHeader>
                        <ModalBody>
                        <Form onSubmit={(e) => { e.preventDefault(); 
                            if(!btnLoad){
                                validation.handleSubmit();
                            }
                            
                            }} className='p-2'>  
                        <div className="mb-3">
                        <Label className="form-label">Full Name :<span className='text-danger'>*</span></Label>
                              <Input
                                name={"firstname"}
                                type={"text"}
                                placeholder={"Enter the Full Name"}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.firstname || ""}
                                invalid={validation.touched.firstname && validation.errors.firstname ? true : false}
                                maxLength={12}
                              />
                              {validation.touched.firstname && validation.errors.firstname ? (
                                <FormFeedback type="invalid">{validation.errors.firstname}</FormFeedback>
                              ) : null}

                         </div>
                         <div className="mb-3">
                        <Label className="form-label">Email Id :</Label>
                         <Input
                                name={"email_id"}
                                type={"text"}
                                placeholder={"Enter the Email ID"}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.email_id || ""}
                                invalid={validation.touched.email_id && validation.errors.email_id ? true : false}
                              />
                              {validation.touched.email_id && validation.errors.email_id ? (
                                <FormFeedback type="invalid">{validation.errors.email_id}</FormFeedback>
                              ) : null}

{
                                                        emailExist &&
                                                        <div className='text-danger' style={{fontSize :"smaller"}}>
                                                            Email ID already exist
                                                        </div>
                                                    }


                            </div>

                                <div className="mb-3">
                                    <Row>
                                        <Col className="col-12">
                                            <Label>Mobile Number: </Label>
                                            <Row>
                                                <Col md={3} className='pe-0' >
                                                    <select
                                                        name="countrycode"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        className={`form-select ${validation.touched.countrycode && validation.errors.countrycode ? 'is-invalid' : ''}`}
                                                        defaultValue={countryCode}
                                                        required
                                                        style={{ borderRight: 'none' }}
                                                    >
                                                        <option value="Select" disabled={true}>Select</option>
                                                        {
                                                            clientInfo.countries.map((c, idx) => (
                                                                <option key={idx} value={c.code}>
                                                                    {c.code}{""}&nbsp;{c.label}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>

                                                    {validation.touched.countrycode && validation.errors.countrycode && (
                                                        <div className="invalid-feedback d-block">{validation.errors.countrycode}</div>
                                                    )}

                                                  


                                                </Col>
                                                <Col md={9} className='ps-0'>
                                                    <Input
                                                        name="phone_number"
                                                        type="number"
                                                        placeholder="Enter the Phone Number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.phone_number ? validation.values.phone_number : "" || ""}
                                                        invalid={validation.touched.phone_number && validation.errors.phone_number ? true : false}
                                                    />
                                                    {validation.touched.phone_number && validation.errors.phone_number ? (
                                                        <FormFeedback type="invalid">{validation.errors.phone_number}</FormFeedback>
                                                    ) : null}
                                                        {
                                                            phoneExist && 
                                                            <div className='text-danger' style={{fontSize :"smaller"}}>
                                                            Phone Number already exist
                                                        </div>
                                                        }


                                                   
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                                <label>Role Permission :<span className="text-danger"> *</span></label>
                                <div className="mb-3">
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <select
                                        onChange={validation.handleChange}
                                        name='role'
                                        onBlur={validation.handleBlur}
                                        className={`form-select ${validation.touched.role && validation.errors.role ? 'is-invalid' : ''}`}
                                        defaultValue={"Select Role"}
                                        >
                                            <option disabled value="Select Role">
                                                Select Role
                                            </option>
                                            {
                                                sessionUserInfo.config_data.action_plan_roles.map((ele, idx) => {
                                                    return (
                                                        <option key={idx} value={ele.id}>
                                                            {ele.role_name}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <Button disabled={btnLoad} style={{ width: "100%" }} type='submit' className='btn btn-danger'>
                                        {btnLoad && <LoadingOutlined/>}{btn_load ? '...' : 'Submit'}
                                          </Button>
                                </div>
                            </Form>
                        </ModalBody>
                    </Modal>
                </div>
                
            
            );
        }
        else {
            return null
        }


    }
    else{


        const [show, setShow] = useState(true)
        const [dataLoaded, setdataLoaded] = useState(false)
        const [errorMessage, seterrorMessage] = useState(false)
        const [invalid_user, setinvalid_user] = useState(false)
        const [invalid_phone_num, setinvalid_phone_num] = useState(false)
        const [categoryDisabled, setcategoryDisabled] = useState(false)
        const [cat_name_exist, setcat_name_exist] = useState(false)
        const [givenEmail, setgivenEmail] = useState("")
        const [countryCode, setcountryCode] = useState("+91")
        const [country_code_err, setcountry_code_err] = useState(false)
        const [givenName, setgivenName] = useState("")
        const [assigned_task_users, setassigned_task_users] = useState([])
        const [locationUserlvl, setLocationUserlvl] = useState(props.location_info.location_user_level)
        const [secret_key, setsecret_key] = useState('Pkdh347ey%3Tgs')
        const [catName, setcatName] = useState('')
        const [rolePermisson, setrolePermisson] = useState('')
        const [roleErr, setroleErr] = useState(false)
        const [btn_load,setbtn_load] = useState(false)
        const [emailExist,setEmailExist]= useState(false)
        const [phoneExist,setphoneExist]= useState(false)
        const [btnLoad,setbtnLoad]= useState(false)

          const [clientInfo, setClientInfo] = useState(JSON.parse(sessionStorage.getItem("client_info")))[0]
        
    
        const [db_info, setDbInfo] = useState({
            db_name: JSON.parse(sessionStorage.getItem("db_info")).db_name,
            encrypted_db_url: JSON.parse(sessionStorage.getItem("db_info")).encrypted_db_url
        })
        const [sessionUserInfo, setsessionUserInfo] = useState(JSON.parse(sessionStorage.getItem('authUser')))
    
        const multiRef = React.useRef()
    
    
        useEffect(() => {
            console.log("create users")
            setdataLoaded(true)

            var createNewExists = locationUserlvl.some(user => user.hirerachy_name === "+Create new");
            console.log(createNewExists,'createNewExists',locationUserlvl)
            if(!createNewExists){
                locationUserlvl.unshift({
                    hirerachy_name: "+Create new"
                })
            }
            console.log(props.location_info, 'props.location_info')
        }, [])
    
    
        const emai_addrs = (e) => {
            var email = e.target.value
            if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
                setgivenEmail(email)
                seterrorMessage(false)
            }
            else {
                seterrorMessage(true)
                setgivenEmail(email)
            }
    
        }
    
        const onSelectValues = (selectedList, selectedItem) => {
            if (selectedItem.hirerachy_name === "+Create new") {
                console.log(selectedList, selectedItem, multiRef)
                setcategoryDisabled(true)
    
            }
            else {
                console.log(selectedList, selectedItem)
                setassigned_task_users(selectedList)
            }
        }
    
        const onRemove = (selectedItem) => {
            console.log(selectedItem, 'selectedItem', assigned_task_users)
        }
    
        const Validsubmit=async(events,values)=>{
            console.log(values,'values')

        }


        const validation = useFormik({
            initialValues:{
                firstname:"",
                email_id:"",
                countrycode:"",
                phone_number:"",
                role :""
            },
            validationSchema: Yup.object({
                firstname: Yup.string().required("Name is required")
                .matches(/\S+/, "Name cannot be just spaces")
                .min(clientInfo.incd_rpt_validation.name_min, `Name must be at least ${clientInfo.incd_rpt_validation.name_min} characters`)
            ,
             role: Yup.string().required("Role name is required"),
            email_id: Yup.string().email("Invalid email format")
                .test(async function (value) {
                    console.log(value,'value')
                    return !(await validateId("cln_adt_users","email_id", value))
                })
                ,
            countrycode: Yup.string().nullable()
            .test('countrycode-required', 'Country code is required if phone number is provided', function (value) {
                const { phone_number } = this.parent;
                if (phone_number && phone_number.length > 0) {
                    return !!value && value !== 'Select';
                }
                return true;
            }
            )
            ,
            phone_number: Yup.string().nullable()
            .test('phone-required', 'Phone number is required if country code is provided', function (value) {
                const { countrycode } = this.parent;
                if (countrycode && countrycode !== 'Select') {
                    return !!value;
                }
                return true;
            }
            ).test(async function (value) {
                console.log(value, 'value')
                    return !(await validateId("cln_adt_users","phone_number", value))
         
            }),


            })
            ,
            onSubmit: async (values) => {
                if(!emailExist && !phoneExist){
                    console.log(values,'values')

                    if (!values.phone_number && !values.email_id) {
                          validation.setErrors({
                              phone_number: "Enter either Phone number or Email.",
                              email_id: "Enter either Phone number or Email.",
                          });
                          return;
                      }

                    setbtnLoad(true)
                    const authUser = JSON.parse(sessionStorage.getItem("authUser"));
                    values["encrypted_db_url"]=authUser.db_info.encrypted_db_url
                    values["fullNo"]=values.phone_number
                    values["company_id"]=authUser.client_info[0]["company_id"]
                    // values["encrypted_db_url"]=authUser.db_info.encrypted_db_url
                    try {
                       const responseData = await urlSocket.post("cog/create-new-user",{user_info:values})
                        console.log(responseData,'responseData') 
                        if(responseData.status === 200){
                            if(responseData.data.admn_user.length >0){
                                var selectedRoleInfo = _.filter(sessionUserInfo.config_data.action_plan_roles,{id : Number(values.role)})
                                props.location_info.location_unique_users.push({
                                    cat_type: [],
                                    hirerachy_name: [],
                                    designation: "",
                                    _id: responseData.data.admn_user[0]["_id"],
                                    name: values.firstname,
                                    title: props.location_info.name,
                                    email_id : values.email_id,
                                    phone_num : values.phone_number,
                                    user_id: responseData.data.admn_user[0]["_id"],
                                    facilities : selectedRoleInfo.length >0 ? selectedRoleInfo[0]["facilities"]:[],
                                    role_name : selectedRoleInfo.length >0 ? selectedRoleInfo[0]["role_name"]:[],
                                    role_description : selectedRoleInfo.length >0 ? selectedRoleInfo[0]["role_description"]:[],
                                    id :selectedRoleInfo.length >0 ? selectedRoleInfo[0]["id"]:[],
                                })
                                console.log(props.location_info.location_unique_users,'props.location_info.location_unique_users')
                                console.log(props.location_info,'location_info')
                                await updtPublishedLocation(props.location_info)

                            }

                        }


                    } catch (error) {
                        
                    }


                }



            }


        })



    const validateId=async(cln_name,key_name,value)=>{
        console.log(cln_name,key_name,value,'cln_name,key_name,value')
        try {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"));
        const requestData = {
            encrypted_db_url: authUser.db_info.encrypted_db_url,
            db_name: authUser.db_info.db_name,
            dynamic_cln: cln_name,
            dynamic_key: key_name,
            editInfo: null,
            dynamic_value: value,
          };

         const responseData = await urlSocket.post("cog/dup-name-validation", requestData);
          console.log(responseData,'responseData')
          if(responseData.status === 200){
            key_name ==="email_id" ? setEmailExist(responseData.data.data.length >0 ? true : false) : setphoneExist(responseData.data.data.length >0 ? true : false)
          }
            
        } catch (error) {
            console.log(error,'error')
        }


    }

        const updtPublishedLocation = (location_info) => {
    
            try {
                urlSocket.post('task/update-published-location', {
                    locationInfo: location_info,
                    encrypted_db_url: db_info.encrypted_db_url,
                    mode : "1"
                }).then((res) => {
                    console.log(res)
                    if (res.status === 200) {
                        setbtn_load(false)
                        setbtnLoad(false)
                        Swal.fire({
                            icon: 'success',
                            title: 'User Created successfully',
                            text: 'User Created successfully',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Close',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                sessionStorage.setItem(JSON.stringify(location_info), 'endpointData')
                                props.updateLocationUser(location_info.location_unique_users)
                                props.toggle()
                                // window.location.reload()
                            }
    
                        })
                    }
                })
    
            } catch (error) {
    
            }
    
    
        }
    
    
    
    
        const validate_email = (e, mode) => {
            var admn_info = {}
            if (mode == 1) {
                admn_info["email_id"] = e.target.value
            }
            if (mode === 2) {
                admn_info["phone_number"] = e.target.value
            }
    
            admn_info["encrypted_db_url"] = db_info.encrypted_db_url
            admn_info["db_name"] = db_info.db_name
            admn_info["user_id"] = sessionUserInfo.user_data._id
    
            try {
                urlSocket.post('cog/check-user-exist', { admn_info: admn_info }).then((data) => {
                    if (mode == 1) {
                        if (data.data.response_code === 504 && data.data.message === "Email Id already exist for another user") {
                            setinvalid_user(true)
                        }
                        else {
                            setinvalid_user(false)
                        }
                    }
                    if (mode == 2) {
                        if (data.data.response_code === 504 && data.data.message === "Email Id already exist for another user") {
                            setinvalid_phone_num(true)
                        }
                        else {
                            setinvalid_phone_num(false)
    
                        }  
                    }
                })
            }
            catch (error) {
                console.log(error, 'error')
            }   
        }
    
    
    
        const validateCatName = (event) => {
    
            var validate_category_name = _.filter(locationUserlvl, item => {
                const cleanedHierarchyName = item.hirerachy_name?.replace(/\s/g, '').toLowerCase();
                const cleanedEventValue = event.target.value?.replace(/\s/g, '').toLowerCase();
                return cleanedHierarchyName === cleanedEventValue;
    
            })
            if (validate_category_name.length > 0) {
                setcat_name_exist(true)
            }
            else {
                setcat_name_exist(false)
            }
    
    
    
        }
    
    
    
        if (dataLoaded) {
            return (
                <div>
                    <Modal isOpen={props.modal} toggle={props.toggle}  >
                        <ModalHeader toggle={props.toggle} tag="h4">
                            Create User
                        </ModalHeader>
                        <ModalBody>
                        <Form onSubmit={(e) => { e.preventDefault(); 
                            if(!btnLoad){
                                validation.handleSubmit();
                            }
                            
                            }} className='p-2'>  
                        <div className="mb-3">
                        <Label className="form-label">Full Name :<span className='text-danger'>*</span></Label>
                              <Input
                                name={"firstname"}
                                type={"text"}
                                placeholder={"Enter the Full Name"}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.firstname || ""}
                                invalid={validation.touched.firstname && validation.errors.firstname ? true : false}
                                maxLength={12}
                              />
                              {validation.touched.firstname && validation.errors.firstname ? (
                                <FormFeedback type="invalid">{validation.errors.firstname}</FormFeedback>
                              ) : null}

                         </div>
                         <div className="mb-3">
                        <Label className="form-label">Email Id :</Label>
                         <Input
                                name={"email_id"}
                                type={"text"}
                                placeholder={"Enter the Email ID"}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.email_id || ""}
                                invalid={validation.touched.email_id && validation.errors.email_id ? true : false}
                              />
                              {validation.touched.email_id && validation.errors.email_id ? (
                                <FormFeedback type="invalid">{validation.errors.email_id}</FormFeedback>
                              ) : null}

{
                                                        emailExist &&
                                                        <div className='text-danger' style={{fontSize :"smaller"}}>
                                                            Email ID already exist
                                                        </div>
                                                    }


                            </div>

                                <div className="mb-3">
                                    <Row>
                                        <Col className="col-12">
                                            <Label>Phone Number: <span className="text-danger"> *</span></Label>
                                            <Row>
                                                <Col md={3} className='pe-0' >
                                                    <select
                                                        name="countrycode"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        className={`form-select ${validation.touched.countrycode && validation.errors.countrycode ? 'is-invalid' : ''}`}
                                                        defaultValue={countryCode}
                                                        required
                                                        style={{ borderRight: 'none' }}
                                                    >
                                                        <option value="Select" disabled={true}>Select</option>
                                                        {
                                                            clientInfo.countries.map((c, idx) => (
                                                                <option key={idx} value={c.code}>
                                                                    {c.code}{""}&nbsp;{c.label}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>

                                                    {validation.touched.countrycode && validation.errors.countrycode && (
                                                        <div className="invalid-feedback d-block">{validation.errors.countrycode}</div>
                                                    )}

                                                  


                                                </Col>
                                                <Col md={9} className='ps-0'>
                                                    <Input
                                                        name="phone_number"
                                                        type="number"
                                                        placeholder="Enter the Phone Number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.phone_number ? validation.values.phone_number : "" || ""}
                                                        invalid={validation.touched.phone_number && validation.errors.phone_number ? true : false}
                                                    />
                                                    {validation.touched.phone_number && validation.errors.phone_number ? (
                                                        <FormFeedback type="invalid">{validation.errors.phone_number}</FormFeedback>
                                                    ) : null}
                                                        {
                                                            phoneExist && 
                                                            <div className='text-danger' style={{fontSize :"smaller"}}>
                                                            Phone Number already exist
                                                        </div>
                                                        }
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                                <label>Role Permission :<span className="text-danger"> *</span></label>
                                <div className="mb-3">
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <select
                                        onChange={validation.handleChange}
                                        name='role'
                                        onBlur={validation.handleBlur}
                                        className={`form-select ${validation.touched.role && validation.errors.role ? 'is-invalid' : ''}`}
                                        defaultValue={"Select Role"}
                                        >
                                            <option disabled value="Select Role">
                                                Select Role
                                            </option>
                                            {
                                                sessionUserInfo.config_data.action_plan_roles.map((ele, idx) => {
                                                    return (
                                                        <option key={idx} value={ele.id}>
                                                            {ele.role_name}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <Button disabled={btnLoad} style={{ width: "100%" }} type='submit' className='btn btn-danger'>
                                        {btnLoad && <LoadingOutlined/>}{btn_load ? '...' : 'Submit'}
                                          </Button>
                                </div>
                            </Form>
                        </ModalBody>
                    </Modal>
                </div>
                
            
            );
        }
        else {
            return null
        }
}

}

CrudUser.propTypes = propTypes;
CrudUser.defaultProps = defaultProps;
// #endregion

export default CrudUser;