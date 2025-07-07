import React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row, Button, Form, Label, Input, FormFeedback, CardBody } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import auditvista_logo from "../../../assets/images/auditvista_logo.png";
import background_image from "../../../assets/auditvista/digital_3.jpg"
import { useState } from "react";
import urlSocket from "../../../helpers/urlSocket";
import { useDispatch } from "react-redux";
import Swal from 'sweetalert2'
import { OtpInput } from 'reactjs-otp-input';

const ForgetPassword2 = () => {
  const dispatch = useDispatch()
  const [isPhone, setIsPhone] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [showPassword, setShowpassword] = useState(false)
  const [otp, setOtp] = useState('')
  const [userName, setuserName] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [otpErr, setotpErr] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false);


  const countryCodes = [
    { code: "+1", name: "USA" },
    { code: "+44", name: "UK" },
    { code: "+91", name: "India" },
  ];

  const otpInputWrapperStyle = {
    marginBottom: '20px',
  };
  const otpInputStyle = {
    width: '40px',
    height: '40px',
    margin: '0 5px',
    textAlign: 'center',
    fontSize: '18px',
    borderRadius: '8px',
    border: '2px solid #ccc',
    outline: 'none',
  };

  const otpFocusStyle = {
    border: '2px solid #4CAF50',
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      username: '',
      new_password: '',

    },
    validationSchema: () => {
      let schema = Yup.object().shape({
        username: Yup.string().required("Please Enter Your Email ID / Mobile Number"),
      });

      if (showPassword) {
        schema = schema.shape({
          new_password: Yup.string().required("Enter New Password"),
        });
      }

      return schema;
    },
    onSubmit: async (values) => {
      values["new_password"] = validation.values.new_password
      values["confirmationCode"] = otp
      values["short_name"] = sessionStorage.getItem('short_name')
      values["isPhone"] = isPhone
      values["countryCode"] = countryCode
      if (showPassword === false) {
        var responseInfo = await urlSocket.post('cog/forget-password', values)
        if (responseInfo.status === 200 && responseInfo.data.code === "200") {
          setShowpassword(true)
          setuserName(responseInfo.data.username)
        }
        else if (responseInfo.data.data.error.code === "LimitExceededException") {
          Swal.fire({
            icon: 'warning',
            title: 'Exceed !',
            text: 'You have exceeded more than the Limit',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
          })
        }
        else {
          Swal.fire({
            icon: 'warning',
            title: 'Invalid !',
            text: 'Invalid Username not found',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
          })
        }
      }
      if (showPassword === true && values.new_password !== '' && values.confirmationCode !== undefined) {
        var responseInfo = await urlSocket.post('cog/confirm-reset-password', values)
        console.log(responseInfo, 'responseInfo')
        if (responseInfo.status === 200 && responseInfo.data.data !== undefined) {
          setShowSuccess(true)

        }
        else if (responseInfo.data.error.error.code === "LimitExceededException") {
          Swal.fire({
            icon: 'warning',
            title: 'Exceed !',
            text: 'You have exceeded more than the Limit',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
          })
        }
        else if (responseInfo.data.error.error.code === "CodeMismatchException") {
          Swal.fire({
            icon: 'warning',
            title: 'Invalid !',
            text: 'Invalid OTP you have entered,Please verify the OTP sent through Email/Mobile',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
          })

        }
      }

    }
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/\S+@\S+\.\S+/.test(value)) {
      setIsPhone(false);
    } else if (/^\d+$/.test(value)) {
      setIsPhone(true);
    } else {
      setIsPhone(false);
    }
    validation.setFieldValue("username", value);
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(23, 53, 120, 0.70)", // Adjust opacity (0.1 to 1)
  };

  return (
    <React.Fragment>

      <div className="login-page bg-white">
        <Container fluid className="p-0">
          <Row className="g-0 ">
            <Col className="col-7 "
              style={{
                backgroundColor: "#173578",
                backgroundImage: `url(${background_image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}>
              <div style={overlayStyle}></div>
              <div className="" style={{ position: "absolute", width: "100%", height: "100vh", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <div className=" me-5" style={{ textAlign: "right" }}>
                  <div className="text-white" style={{ fontSize: 40, lineHeight: 1, fontWeight: 300 }}>PRECISION - COMPLIANCE - INSIGHTS</div>
                  {/* <div className="text-white" style={{ fontSize: 50, lineHeight:1, fontWeight:800 }}>COMPLIANCE</div>
                      <div className="text-white" style={{ fontSize: 50, lineHeight:1, fontWeight:800 }}>INSIGHTS </div> */}
                  <div className="text-white" style={{ fontSize: 50, lineHeight: 1.2, fontWeight: 800, }}>WELCOME TO AUDITVISTA</div>
                </div>
              </div>
            </Col>
            <Col className="col-5"
              style={{
                borderRadius: 0,
                borderLeftStyle: "solid",
                borderLeftWidth: 10,
                borderLeftColor: "#2667ff",
              }}
            >
              <Row>
                <Col className="col-12 d-flex align-items-center ms-5 "
                  style={{
                    height: "100vh",
                    // background: "repeating-linear-gradient(to right, rgba(0, 0, 0, 0.05) 0px, rgba(0, 0, 0, 0.05) 0px, transparent 1px, transparent 100px)",
                    // backgroundSize: "100% 200px", // Controls the spacing between lines
                  }}>
                  <div className="p-4 col-lg-8 col-md-10 col-sm-11">

                    {
                      !showSuccess &&
                      <>
                        <div className="mb-4">
                          <Link to="/dashboard" className="d-block auth-logo">
                            <img
                              src={auditvista_logo}
                              alt=""
                              height="30"
                              className="auth-logo-dark"
                            />
                            <img
                              src={auditvista_logo}
                              alt=""
                              height="30"
                              className="auth-logo-light"
                            />
                          </Link>
                        </div>
                        <div className="my-auto">
                          <div className="mb-3">
                            <div className="text-dark" style={{ fontSize: 25 }}>Reset Password</div>
                          </div>
                          <div className="">
                            <Form className="form-horizontal"
                              onSubmit={(e) => {
                                e.preventDefault();
                                validation.handleSubmit();
                                return false;
                              }}
                            >
                              <div className="mb-3">
                                <Label className=''>E-MAIL / MOBILE NUMBER</Label>

                                <div className={`${isPhone ? 'd-flex' : ''}`} >
                                  {isPhone &&
                                    <Input
                                      type="select"
                                      className="form-control bg-light  bg-opacity-50 w-auto me-1"
                                      style={{ border: 0, borderRadius: 0, height: 50, borderBottom: "3px solid #2667ff" }}
                                      value={countryCode}
                                      onChange={(e) => setCountryCode(e.target.value)}
                                      disabled={showPassword}
                                    >
                                      {countryCodes.map((country) => (
                                        <option key={country.code} value={country.code}>
                                          {country.name} ({country.code})
                                        </option>
                                      ))}
                                    </Input>
                                  }
                                  <Input
                                    name="username"
                                    className="form-control bg-light  bg-opacity-50"
                                    style={{ border: 0, borderRadius: 0, height: 50, borderBottom: "3px solid #2667ff", }}
                                    placeholder="Enter Email ID / Phone Number"
                                    type={`${isPhone ? 'number' : 'text'}`}
                                    onChange={handleInputChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.username || ""}
                                    invalid={validation.touched.username && validation.errors.username ? true : false}
                                    min={isPhone ? "0" : undefined}
                                    disabled={showPassword}
                                  />
                                  {validation.touched.username && validation.errors.username ? (
                                    <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                                  ) : null}
                                </div>


                                {
                                  showPassword &&
                                  <>
                                    <div style={{ position: "relative" }} className="mt-5">
                                      <h5 className="text-primary">Enter OTP</h5>

                                    </div>
                                    <p>We have sent one time password to <span className="text-primary">{userName}</span>.<br />Never share your OTP with anyone.</p>

                                    <div style={otpInputWrapperStyle}>
                                      <OtpInput
                                        value={otp}
                                        onChange={(otp) => {
                                          setOtp(otp);
                                          setotpErr('')
                                        }}
                                        numInputs={6}
                                        separator={<span>-</span>}
                                        inputStyle={otpInputStyle}
                                        focusStyle={otpFocusStyle}
                                        placeholder="0"
                                      />
                                      {
                                        otpErr &&
                                        <label className="text-danger mt-2" style={{ fontSize: 'smaller' }}>Please Enter the OTP </label>
                                      }
                                    </div>


                                    <br />
                                    <div className="mb-3">
                                      <Label className="form-label">NEW PASSWORD</Label>

                                      <div className="input-group auth-pass-inputgroup">
                                        <Input
                                          name="new_password"
                                          className="form-control bg-light  bg-opacity-50"
                                          style={{ border: 0, borderRadius: 0, height: 50, borderBottom: "3px solid #2667ff", }}
                                          placeholder="Enter New Password"
                                          type={showNewPassword ? "text" : "password"}
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.new_password || ""}
                                          invalid={
                                            validation.touched.new_password && validation.errors.new_password ? true : false
                                          }
                                          autoComplete='new-password'
                                        />
                                        <button
                                          onClick={() => setShowNewPassword(!showNewPassword)}
                                          className="btn text-dark bg-light bg-opacity-50 font-size-18"
                                          style={{ background: 'none', border: 0, borderBottom: "3px solid #2667ff" }}
                                          type="button"
                                          id="password-addon"
                                        >
                                          <i className={showNewPassword ? "mdi mdi-eye-off-outline" : "mdi mdi-eye-outline"}></i>
                                        </button>

                                        {validation.touched.new_password && validation.errors.new_password ? (
                                          <FormFeedback type="invalid">{validation.errors.new_password}</FormFeedback>
                                        ) : null}
                                      </div>

                                    </div>
                                  </>
                                }
                              </div>
                              <div className="mt-4 text-end">
                                <Button
                                  className="btn btn-primary w-md waves-effect waves-light w-100"
                                  style={{ height: 50, borderRadius: 0 }}
                                  type="submit"
                                  color="primary"
                                  onClick={() => {
                                    if (String(otp).length === 0) {
                                      setotpErr(true)
                                    }
                                    else {
                                      setotpErr(false)
                                    }
                                  }}
                                >
                                  {showPassword ? "Reset" : "Submit"}
                                </Button>
                              </div>

                            </Form>
                            <div className="mt-5 text-center">
                              <p>
                                Remember It ?{" "}
                                <Link
                                  to="/login"
                                  className="fw-medium text-primary"
                                >
                                  {" "}
                                  Sign In here{" "}
                                </Link>{" "}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 mt-md-5 text-center">
                          <p className="mb-0">© {new Date().getFullYear()} designed and developed by <br /><span className="text-primary fw-bold">eParampara Technologies</span></p>
                        </div>
                      </>
                    }

                    {
                      showSuccess &&
                      <>
                        <div className="mb-4 mb-md-5">
                          <a href="/" className="d-block auth-logo">

                          </a>
                        </div>
                        <div className="my-auto">
                          <div className="text-center">
                            <div className="avatar-md mx-auto">
                              <div className="avatar-title rounded-circle bg-light">
                                <i className="bx bx-mail-send h1 mb-0 text-primary"></i>
                              </div>
                            </div>
                            <div className="p-2 mt-4">
                              <h4>Success !</h4>
                              <title>Password changed successfully</title>
                              <p className="text-muted">
                                You can now log in to your account using your new password.
                              </p>
                              <div className="mt-4">
                                <Link to="/login" className="btn btn-sm w-md  btn-success">
                                  Back to Login
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 mt-md-5 text-center">
                          <p className="mb-0">© {new Date().getFullYear()} designed and developed by <br /><span className="text-primary fw-bold">eParampara Technologies</span></p>
                        </div>
                      </>
                    }
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ForgetPassword2;
