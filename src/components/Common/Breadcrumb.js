import React from "react"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import { Row, Col, BreadcrumbItem } from "reactstrap"

const Breadcrumb = props => {
  return (
    <React.Fragment>
    <Row className='px-3 py-3'>
        <Col xs={props?.isBackButtonEnable ? 9 : 12}>
            <div className="d-flex align-items-center justify-content-between">
                <div className=" font-size-14 fw-bold">{props?.title}</div>
            </div>
        </Col>
        {
            props?.isBackButtonEnable &&
            <Col xs={3} className='d-flex align-items-center justify-content-end'>
                <button className='btn btn-outline-secondary btn-sm' color="primary" onClick={() => props.gotoBack()}>Back <i className="mdi mdi-arrow-left"></i></button>
            </Col>

        }
    </Row>
</React.Fragment>
  )
}

Breadcrumb.propTypes = {
  breadcrumbItem: PropTypes.string,
  title: PropTypes.string
}

export default Breadcrumb
