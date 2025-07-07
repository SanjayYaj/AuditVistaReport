import React from 'react'
import {
    Row, Col, FormGroup, Button, Card, CardBody, Container, Alert, Label, Form, Progress,
    Input,
} from "reactstrap";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import { useState } from 'react';
import urlSocket from 'helpers/urlSocket';
import moment from 'moment'


const UpdatePdbAuditInfo = (props) => {
    console.log(props,'prrp')
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];
    const [targetDate,settargetDate]= useState(moment(props.audit_data.audit_end_date,).format('YYYY-MM-DD'))
    const [authUser,setauthUser]= useState(JSON.parse(sessionStorage.getItem('authUser')))


    const updateEndpoint = async () => {

        if (String(targetDate).length > 0) {
            props.audit_data["audit_end_date"] = targetDate

            try {

                const responseData = await urlSocket.post('webpbdadtdta/updateallendpointdate', {
                    userInfo: authUser.user_data,
                    encrypted_db_url: authUser.db_info.encrypted_db_url,
                    auditInfo: props.audit_data
                })
                if (responseData.data.response_code === 500) {
                    if (responseData.data.master_info.length > 0) {
                        sessionStorage.setItem('publishedAuditData', JSON.stringify(responseData.data.master_info[0]))
                    }
                    props.onClose()
                }

            } catch (error) {
                console.log("catch error", error)
            }


        }


    }


    return (
        <div>
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <Card style={{ border: '1px solid #e9e9e9' }}>
                            <CardBody>
                                <AvForm className="form-horizontal">

                                    <Row className="">
                                        <div className="mb-3">
                                            <AvField
                                                name="target_date"
                                                type="date"
                                                label="Audit end date"
                                                errorMessage="Please provide a valid date."
                                                className="form-control"
                                                value={targetDate}
                                                min={tomorrowFormatted}
                                                 onChange={(e) => { settargetDate(e.target.value) }}
                                                onKeyDown={(e) => { e.preventDefault(); }}
                                                validate={{ required: { value: true } }}
                                                id="td"
                                            />
                                        </div>


                                    </Row>
                                    <Row>
                                        <div className="d-flex gap-2 justify-content-end">
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => { props.onClose() }}> Cancel </button>
                                            <button className="btn btn-sm btn-outline-success" onClick={() => {
                                                updateEndpoint()
                                            }}>Update</button>
                                        </div>
                                    </Row>

                                </AvForm>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                {/* {this.state.dataAlert ? (
                            <SweetAlert
                                warning
                                onConfirm={() => this.setState({ dataAlert: false })}
                            >{this.state.alertMessage}</SweetAlert>
                        ) : null} */}
            </Container>
        </div>
    )
}
export default UpdatePdbAuditInfo
