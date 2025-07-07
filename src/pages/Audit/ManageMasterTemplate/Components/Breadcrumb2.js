import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Row, Col, Breadcrumb, BreadcrumbItem, Button } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation"

class Breadcrumbs2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editMode:false
        }
    }


    render() {
        return (
            <React.Fragment>
            <Row className='px-2 my-2'>
                <Col xs={this.props.isBackButtonEnable ? 9 : 12}>
                    <div className="d-flex align-items-center justify-content-between py-3">
                        <div className="mb-0 mt-2 m-3 font-size-16">{this.props.title} 
                            {/* <i className="fas fa-edit ms-2 text-primary" style={{ cursor: "pointer" }} onClick={() => this.props.changeAuditEditMode() } ></i> */}
                            </div>
                    </div>
                </Col>
                {
                    this.props.isBackButtonEnable &&
                    <Col xs={3} className='d-flex align-items-center justify-content-end'>
                        <button className='btn btn-outline-primary btn-sm' color="primary" onClick={() => this.props.gotoBack()}>Back <i className="mdi mdi-arrow-left"></i></button>
                    </Col>

                }
            </Row>
        </React.Fragment>
            // <React.Fragment>
            //     <Row className='px-2'>
            //         <Col xs={this.props.isBackButtonEnable ? 11 : 2}>
            //             <div className="d-flex flex-column  py-3">
            //                 <div className="mb-0 font-size-12 text-secondary text-opacity-75">{this.props.link}</div>
            //                 <div className='col-6'>
                                // <div className="mb-0 font-size-13 fw-bold">{this.props.title} <i
                                //     className="fas fa-edit ms-2 text-primary"
                                //     style={{ cursor: "pointer" }}
                                //     onClick={() =>
                                //         this.props.changeAuditEditMode()
                                //     }
                                // ></i></div>
                                // <div className="mb-0 font-size-12 text-secondary">{this.props.description}</div>
            //                 </div>
            //             </div>
            //         </Col>
            //         {
            //             this.props.isBackButtonEnable &&
            //             <Col xs={1} className='d-flex align-items-center justify-content-end'>
            //                 <button className='btn btn-sm btn-outline-primary' color="primary" onClick={() => this.props.gotoBack()}>Back <i className="mdi mdi-arrow-left"></i></button>
            //             </Col>

            //         }
            //     </Row>
            // </React.Fragment>

        );
    }
}

export default Breadcrumbs2;