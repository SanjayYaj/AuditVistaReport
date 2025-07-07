import React, { useEffect } from 'react'
import { Modal, ModalHeader, ModalBody, Form, Row, Col, Label, Input, FormFeedback } from "reactstrap";

const ModalComponent = ({ modal, toggle,backDrop, isEdit, fields, validation, onSubmit,modalHeader,btnName }) => {

    useEffect(()=>{
        console.log(modal,'props')
    },[])


    return (
        <Modal backdrop={backDrop} isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
        {modalHeader}
          {/* {!!isEdit ? "Edit Branch" : "Add Branch"} */}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              onSubmit();
            }}
          >
            <Row>
              <Col className="col-12">
                {fields.map((field, index) => (
                  <div className="mb-3" key={index}>
                        <Label className="form-label">{field.label}
                            {
                                field.mandatory &&
                                <span className='text-danger'>*</span>

                            }

                    </Label>
                    {field.countryCode ? (
                      <div className="d-flex">
                        <Input
                          type="select"
                          name="branch_ccode"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.branch_ccode || "+91"}
                          className="me-2"
                        >
                          {field.country_list.map((ele, idx) => (
                            <option key={idx} value={ele.code}>{ele.code}</option>
                          ))}
                        </Input>

                        <Input
                          name={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values[field.name] || ""}
                          invalid={validation.touched[field.name] && validation.errors[field.name] ? true : false}
                        />
                      </div>
                    ) : field.type === "select" && field.options ? (
                      <select
                        type="select"
                        name={field.name}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values[field.name] || ""}
                        className={`form-select ${validation.touched[field.name] && validation.errors[field.name] ? 'is-invalid' : ''}`}
                      >
                          <option value="" disabled>Select</option>
                        {field.options.map((ele, idx) => (
                          <option key={idx} value={ele[field.value]}>{ele[field.key]}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values[field.name] || ""}
                        invalid={validation.touched[field.name] && validation.errors[field.name] ? true : false}
                      />
                    )}
                      
                    {/* </Input> */}
                    {validation.touched[field.name] && validation.errors[field.name] ? (
                      <FormFeedback type="invalid">{validation.errors[field.name]}</FormFeedback>
                    ) : null}


                    {field.name_exist &&
                      <div className='text-danger' style={{ fontSize: 'smaller' }}>
                        {field.message}
                      </div>

                    }


                  </div>
                ))}
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button  
                  onClick={onSubmit} 
                  className="btn btn-sm btn-outline-success">
                    {btnName}
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    )
}

export default ModalComponent