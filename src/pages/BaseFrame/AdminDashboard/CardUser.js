import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from "reactstrap"


function CardUser(props) {
  const [userImg, setUserImg] = useState([])

  useEffect(() => {
    if (props.user_data.user_img !== undefined) {
      setUserImg(props.user_data.user_img)
    }

  }, [])



  return (
    <React.Fragment>
      <Row>
        <Col lg="12" >
          <Card style={{ borderRadius: 100, backgroundColor: "transparent", boxShadow: "none" }} className="mb-1">
            <CardBody>
              <Row>
                <Col lg="4">
                  <div className="d-flex flex-row align-items-center ">
                    <div className="col-auto gx-2">
                      {/* <div className="text-muted">
                        <div className="text-dark" style={{ margin: 0, padding: 0, fontSize: 18, fontWeight:"500", lineHeight: 1 }}> Welcome, {props.user_data.firstname?.charAt(0).toUpperCase() + props.user_data.firstname?.slice(1)}</div>
                        <div className="mb-0" style={{ fontSize: 12 }}>{props.user_data?.role_name}</div>
                      </div> */}
                        <div className="text-muted">
                        <div className="text-dark" style={{ margin: 0, padding: 0, fontSize: 18, fontWeight:"500", lineHeight: 1 }}> Welcome, { props.user_data.firstname ? props.user_data.firstname.charAt(0).toUpperCase() +props.user_data.firstname.slice(1)
                         :  props.user_data.fullname.charAt(0).toUpperCase() + props.user_data.fullname.slice(1)}</div>
                        <div className="mb-0" style={{ fontSize: 12 }}>{props.user_data.role_name}</div>
                      </div>
                    </div>
                  </div>                 
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default CardUser
