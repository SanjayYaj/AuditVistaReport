import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {
    Row, Col, FormGroup, Button, Card, CardBody, Container, Alert, Label, Form, Progress,
    Input,
} from "reactstrap";
import Select from "react-select";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import { Link } from "react-router-dom"
// import Dropzone from "react-dropzone"
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'



const _ = require('lodash')
// var urlSocket = require("../../../helpers/urlSocket")
import urlSocket from "../../../../helpers/urlSocket";

export default class AddEndpointNode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataloaded: false,
            alertEnable: false,
            formDisabled: false,
            userInfo: {},
            optionGroup:[],
            codeError: "Please enter the code",
            codeErrorEnabled: false,
            catErrorEnabled: false,
            hlevel_name:this.props.editItem === null ? "" : this.props.editItem.hlevel_name,
            hlevel_cat:this.props.editItem === null ? "" : this.props.editItem.hlevel,
            getCode:this.props.editItem === null ? "" : this.props.editItem.code,
            enableAddCode:true,
            enableCode:this.props.editItem === null ? false : this.props.editItem.enable_code,
            code_err : false
        };


    }

    componentDidMount() {
        var data = JSON.parse(sessionStorage.getItem("authUser"));
        var db_info = JSON.parse(sessionStorage.getItem("db_info"));
        
        this.setState(
            {
                sessionUserInfo: data.user_data,
                db_info:db_info,
                user_data : data,
                dataloaded: true,
            },
            function () {
                //this.getEntityDetaitedData()
            }
        )
    }

    componentWillUnmount(){
    }

    listOutCategory=()=>{
        var category = _.map(this.props.endpoints, item => {
            return item.hlevel
        })
        
        var uniqueHlevels = _.uniqBy(category)

        return uniqueHlevels
    }


    validationApi=(location_value,mode)=>{
        location_value["user_id"]= this.state.user_data.user_data._id
        try {
            urlSocket.post('cog/validate-location-info', location_value).then((response) => {
                if (response.data.response_code === 500) {
                    if (response.data.data.length > 0 && response.data.message == "name already exist") {
                        if(mode == 1){
                        this.setState({location_name_err: true})
                        }
                        if(mode == 2){
                        this.setState({code_err: true})
                        }
                    }
                    else{
                        if(mode ==1){
                        this.setState({ location_name_err: false })
                        }
                        if(mode ==2){
                        this.setState({code_err: false})

                        }

                    }
                }
            })
        } catch (error) {

        }
    }

    selectCat = (event) => {
        this.setState({ createNewCat: event.target.value == "1" ? true : false, catErrorEnabled:false, catError:"" })
    
      }

      validateNode = (values) => {
        var flatData = this.props.endpoints
    
        var returnValue = true
        var getCatValue = -1
        if (values.hlevel_cat == "1") {
          var getSubtitle = String(values.hlevel).replace(/\s/g, '').toLowerCase()
          getCatValue = _.findIndex(flatData, function (o) { if (String(o.hlevel).replace(/\s/g, '').toLowerCase() == getSubtitle) { return true } else { return false } });

          if (getCatValue != -1) {
            this.setState({
              catErrorEnabled: true,
              hlevel: values.hlevel,
              hlevel_cat: values.hlevel_cat,
              catError: "Category is already available",
            })
            returnValue = false
          }
        }
        else if (values.hlevel_cat == "0" || values.hlevel_cat == "") {
          this.setState({
            catErrorEnabled: true,
            hlevel: "",
            hlevel_cat: values.hlevel_cat,
            catError: "Select Category",
          })
          returnValue = false
        }
        else {
          this.setState({
            catErrorEnabled: false,
            catError:"",
          })
        }
    
        if (this.state.enableCode) {
          var getCode = String(values.code).replace(/\s/g, '').toLowerCase()
          var getCodeValue = _.findIndex(flatData, function (o) {
               if (String(o.code).replace(/\s/g, '').toLowerCase() == getCode) { return true } else { return false } 
            });

            if(getCode === this.state.getCode)
            {

            }
            else
            {
                if (getCodeValue != -1) {
                    this.setState({
                      codeErrorEnabled: true,
                      getCode: values.code,
                      codeError: "Code is already available"
                    })
                    returnValue = false
                  }
                  else {
                    this.setState({
                      codeErrorEnabled: false,
                      codeError:"",
                    })
                  }
            }

          
        }
    
    
        return returnValue
      }

      submitData=(event, values)=>{
        var allowToWrite = this.validateNode(values)
        if(allowToWrite && this.state.code_err == false && this.state.location_name_err == false)
        {
            try {
                var loggedUserInfo = {
                    encrypted_db_url:this.state.db_info.encrypted_db_url,
                    company_id: this.state.sessionUserInfo.company_id,
                    company_name: this.state.sessionUserInfo.company_name,
                    created_by:this.state.sessionUserInfo._id
                }
                urlSocket.post("webphlbconf/addendpoints", {
                    userInfo: loggedUserInfo,
                    hInfo:{
                        publishtemplateInfo: this.props.publishtemplateInfo
                    },
                    endpointInfo: {
                        values,
                        _id:this.props.editItem !== null ? this.props.editItem._id : "",
                        audit_user:this.props.editItem !== null ? this.props.editItem.audit_user : null,
                        review_user:this.props.editItem !== null ? this.props.editItem.review_user : null,
                    }
                })
                .then(response=>{
                    if(response.data.response_code === 500)
                    {
                            this.props.onClose()
                    }
                })
            } catch (error) {
                console.log("catch error", error)
            }
        }
        
      }

      validateLocation = (event,mode) => {
        var location_value = {}
        if(mode == 1){
        location_value["name"] = event.target.value.trim()
        location_value["encrypted_db_url"] = this.state.db_info.encrypted_db_url
        this.validationApi(location_value,mode)
        }
        if(mode == 2){
        location_value["code"] = event.target.value.trim()
        location_value["encrypted_db_url"] = this.state.db_info.encrypted_db_url
        this.validationApi(location_value,mode)
        }
        // this.validationApi(location_value,mode)
       

    }


    render() {
        if (this.state.dataloaded) {
            const optionGroup = this.listOutCategory()
            return (
                <React.Fragment>
                    <Container fluid>
                        <Row >
                            <Col >
                                <Card className="overflow-hidden" style={{border: '1px solid #e9e9e9'}}>
                                    {
                                        !this.state.formDisabled ?
                                            <CardBody className="">
                                                    <AvForm className="form-horizontal" onValidSubmit={this.submitData} onInvalidSubmit={this.handleInvalidSubmit}>
                                                        {/* <Row className="my-4">
                                                            <div className="d-sm-flex align-items-center justify-content-between">
                                                                <div className="text-danger font-size-18">Location Information</div>
                                                                <button className="btn btn-outline-dark " onClick={() => this.props.onClose()}> Close </button>
                                                            </div>
                                                            <hr className="my-4" />
                                                        </Row> */}
                                                        <div className="mb-3">
                                                            <AvField
                                                                name="hlevel_name"
                                                                label="Name"
                                                                type="text"
                                                                //defaultValue={this.state.hlevel_name}
                                                                onChange={(e) => { this.validateLocation(e,1) }}
                                                                value={this.state.hlevel_name}
                                                                required
                                                                placeholder="Enter Name"
                                                            />
                                                              {
                                                                this.state.location_name_err &&
                                                                <div className="text-danger" style={{ fontSize: 'smaller' }}>Location name already exist</div>
                                                            }
                                                        </div>
                                                        <div className="mb-3">
                                                            <Label className="" htmlFor="autoSizingSelect">Category</Label>
                                                            <AvInput
                                                                type="select"
                                                                name="hlevel_cat"
                                                                label="Name"
                                                                value={this.state.hlevel_cat}
                                                                className="form-select"
                                                                id="cate"
                                                                required
                                                                onChange={(e) => this.selectCat(e)}>
                                                                <option value="" disabled selected>Choose...</option>
                                                                <option value="1"  >Create New</option>
                                                                {
                                                                    optionGroup.map((data, idx) => {
                                                                        return (
                                                                            <option value={data}  key={idx}>{data}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </AvInput>
                                                        </div>
                                                        {
                                                            this.state.createNewCat ?
                                                                <div className="mb-3">
                                                                    <AvField
                                                                        name="hlevel"
                                                                        type="text"
                                                                        value={this.state.hlevel}
                                                                        required
                                                                        onChange={()=>this.setState({catErrorEnabled:false, catError:""})}
                                                                        placeholder="Enter New Category"
                                                                    />
                                                                </div> : null
                                                        }
                                                        {this.state.catErrorEnabled ? <Label className="text-danger" style={{ margin: '0 0 7px 0' }} htmlFor="autoSizingSelect">{this.state.catError}</Label> : null}
                                                        {/* {
                                                            this.state.enableAddCode ? <div className="form-check">
                                                                <AvInput
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    name="code_enable"
                                                                    id="invalidCheck"
                                                                    value={this.state.enableCode}
                                                                    onChange={() => this.setState({ enableCode: !this.state.enableCode ? true : false })}
                                                                />
                                                                <Label
                                                                    className="form-check-label"
                                                                    htmlFor="invalidCheck"
                                                                >{" "}
                                                                    Add Code
                                                                </Label>
                                                            </div> : null
                                                        } */}

                                                        {/* {
                                                            this.state.enableCode ? */}
                                                                <div className="mb-3">
                                                                    <AvField
                                                                        name="code"
                                                                        label="Code"
                                                                        type="text"
                                                                        //errorMessage={this.state.codeError}
                                                                        onChange={(e)=>{this.validateLocation(e,2)}}
                                                                        value={this.state.getCode}
                                                                        validate={{
                                                                            required: { value: true, errorMessage: this.state.codeError },
                                                                        }}
                                                                        placeholder="Enter Code"
                                                                    />
                                                                    {this.state.codeErrorEnabled ? <Label className="text-danger" style={{ margin: '5px 0 7px 0' }} htmlFor="autoSizingSelect">{this.state.codeError}</Label> : null}
                                                                    {
                                                                    this.state.code_err &&
                                                                    <div className="text-danger" style={{fontSize :"smaller"}}>Code already exist</div>
                                                                }
                                                                </div>
                                                                 {/* : null */}
                                                        {/* } */}



                                                        <div className="mt-4 d-flex flex-row justify-content-end align-items-center">
                                                             <button
                                                                className="btn btn-sm btn-outline-danger me-1"
                                                                onClick={() => this.props.onCancel()}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-success"
                                                                type="submit"
                                                            >
                                                                {this.props.editItem !== null ? "Update Location" : "Add Location"}
                                                            </button>
                                                           
                                                        </div>
                                                    </AvForm>
                                            </CardBody> :
                                            <CardBody>
                                                <div className="mt-4 text-center">
                                                    <div className="mb-0" style={{ fontSize: 20 }}>
                                                        <span className="text-danger">{this.state.first_name}</span> has added successfully
                                                    </div>
                                                    <div style={{ marginTop: 20 }}>
                                                        <Link className="btn btn-success" onClick={() => this.props.onClose()}>
                                                            Back
                                                        </Link>
                                                    </div>
                                                </div>
                                            </CardBody>
                                    }
                                </Card>

                            </Col>
                        </Row>
                    </Container>
                </React.Fragment>
            )
        }
        else {
            return null
        }
    }
}


