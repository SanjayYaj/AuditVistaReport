import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";
import urlSocket from '../../../helpers/urlSocket';
import error from "../../../assets/images/error-img.png";
import auditvista_logo from "../../../assets/images/auditvista_logo.png";
import {setUserpoolInfo} from '../../../toolkitStore/Auditvista/AuthSlice'
import { useDispatch } from 'react-redux';

const Url404 = () => {
    const [invalidPath, setInvalidPath] = useState("");
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const path = window.location.hostname;
        const invalid_path = path.split(".")[0];
        setInvalidPath(invalid_path);

        const fetchData = async () => {
            try {
                const response = await urlSocket.post('cog/find-short-name');
                console.log(response,'response');
                if (response.data.response_code === 500) {
                    sessionStorage.setItem('short_name', response.data.data.short_name);
                    dispatch(setUserpoolInfo(response.data.userpoolinfo))
                    navigate("/login");
                } else {
                    sessionStorage.clear();
                    // props.history.push('/url-not-found'); // Uncomment if needed
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <React.Fragment>
            <div className="account-pages my-5 pt-5">
                <Container>
                    <Row>
                        <Col lg="12">
                            <div className="text-center mb-5">
                                <img
                                    src={auditvista_logo}
                                    alt=""
                                    height="30"
                                    className="auth-logo-dark text-center"
                                />
                                <br />
                                <br />
                                <br />
                                <h4 className="text-uppercase">Sorry, Sub domain <span className='text-danger'>{invalidPath}</span> does not exist</h4>
                                <div className="mt-4 text-center">
                                    <button
                                        className="btn btn-outline-primary waves-effect waves-light"
                                        onClick={() => { document.location.href = "http://register.auditvista.com/register" }}
                                    >
                                        Click here to Register
                                    </button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md="8" xl="6">
                            <div>
                                <img src={error} alt="" className="img-fluid" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Url404;