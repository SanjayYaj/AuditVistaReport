import React, { useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import urlSocket from '../../../../helpers/urlSocket';
import Swal from 'sweetalert2'

const QRScanner = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
    const [locationInfo, setLocationInfo] = useState(null)
    const [endPointInfo, setendPointInfo] = useState(JSON.parse(sessionStorage.getItem("endpointData")))
    const navigate = useNavigate();

    useEffect(() => {
        setModalOpen(true);
    }, [])

    const handleScan = async (info) => {
        try {
            const responseData = await urlSocket.post("cog/audit-qr", {
                data: info.text.replace(/^"|"$/g, ''),
                encrypted_db_url: authUser.db_info.encrypted_db_url,
                ref_id: endPointInfo.ref_id

            })
            if (responseData.data.response_code === 500) {
                setModalOpen(false)
                if (responseData.data.data.length > 0) {
                    setLocationInfo(responseData.data.data[0])
                }
            }
            else if (responseData.data.response_code === 504) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Invalid QR !',
                    confirmButtonText: 'Try Valid One'
                });
            }

        } catch (error) {
            console.log(error, 'error')
        }
    }


    const navigateTo = () => {
        if (endPointInfo.audit_pbd_users.audit_type == "1") {
            if (endPointInfo.status === "0" || endPointInfo.status === "1" || endPointInfo.status === "2" || endPointInfo.status === "5") {
                if (endPointInfo.audit_coords_enable == true) {
                }
                else {
                    navigate("/enpcpts");
                }
            }
            else {
                navigate("/viewcpts")
            }
        }

        else if (endPointInfo.audit_pbd_users.audit_type == "2") {
            if (endPointInfo.status === "3" || endPointInfo.status === "4") {
                if (endPointInfo.review_coords_enable == true) {

                }
                else {
                    navigate("/rewenpcpts");
                }
            }
            else {
                navigate("/viewcpts")
            }
        }
    }

    return (
        <div>
            <h6>{modalOpen ? "QR Code Scanner" : "Scanned Information"} </h6>
            <Row>
                <Col md={12}>
                    {
                        modalOpen ?
                            <QrReader
                                onResult={(result, error) => {
                                    if (result) {
                                        handleScan(result);
                                    }
                                }}
                                style={{ width: '50%', height: "50%" }}
                            />
                            :
                            <Card>
                                {
                                    locationInfo?.h_node_type?.id === "2" ?
                                        <CardBody>
                                            <div className="text-center">
                                                <h5 className="mt-3 mb-1">{locationInfo?.hlevel_name}</h5>
                                            </div>

                                            <ul className="list-unstyled mt-4">
                                                <li>
                                                    <div className="d-flex">
                                                        <i className="bx bxs-key text-primary fs-4"></i>
                                                        <div className="ms-3">
                                                            <h6 className="fs-14 mb-2">Asset Serial No</h6>
                                                            <p className="text-muted fs-14 mb-0">{locationInfo?.asset_s_no}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="mt-3">
                                                    <div className="d-flex">
                                                        <i className="bx bx-box text-primary fs-4"></i>
                                                        <div className="ms-3">
                                                            <h6 className="fs-14 mb-2">Asset Name</h6>
                                                            <p className="text-muted fs-14 mb-0">{locationInfo?.hlevel_name}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="mt-3">
                                                    <div className="d-flex">
                                                        <i className="bx bx-file text-primary fs-4"></i>
                                                        <div className="ms-3">
                                                            <h6 className="fs-14 mb-2">Asset Description</h6>
                                                            <p className="text-muted fs-14 text-break mb-0">{locationInfo?.asset_desc}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="mt-3">
                                                    <div className="d-flex">
                                                        <i className="bx bx-calendar text-primary fs-4"></i>
                                                        <div className="ms-3">
                                                            <h6 className="fs-14 mb-2">Asset Placed On</h6>
                                                            <p className="text-muted fs-14 mb-0">{locationInfo?.asset_placed_on}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="mt-3">
                                                    <div className="d-flex">
                                                        <i className="bx bx-alarm  text-primary fs-4"></i>
                                                        <div className="ms-3">
                                                            <h6 className="fs-14 mb-2">Asset Expiry On</h6>
                                                            <p className="text-muted fs-14 mb-0">{locationInfo?.asset_expiry_on}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="mt-4">
                                                <Link to="#" onClick={() => {
                                                    navigateTo()
                                                }} className="btn btn-soft-primary btn-hover w-100 rounded"><i className="mdi mdi-eye"></i> Take Audit</Link>
                                            </div>
                                        </CardBody>

                                        :
                                        <CardBody>
                                            <div className="text-center">
                                                <h5 className="mt-3 mb-1">{locationInfo?.hlevel_name}</h5>
                                            </div>

                                            <ul className="list-unstyled mt-4">
                                                <li>
                                                    <div className="d-flex">
                                                        <i className="bx bxs-key text-primary fs-4"></i>
                                                        <div className="ms-3">
                                                            <h6 className="fs-14 mb-2">Location Latitude</h6>
                                                            <p className="text-muted fs-14 mb-0">{locationInfo?.loc_lat}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="mt-3">
                                                    <div className="d-flex">
                                                        <i className="bx bx-box text-primary fs-4"></i>
                                                        <div className="ms-3">
                                                            <h6 className="fs-14 mb-2">Location Longitude</h6>
                                                            <p className="text-muted fs-14 mb-0">{locationInfo?.loc_long}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="mt-4">
                                                <Link to="#" onClick={() => {
                                                    navigateTo()
                                                }} className="btn btn-soft-primary btn-hover w-100 rounded"><i className="mdi mdi-eye"></i> Take Audit</Link>
                                            </div>
                                        </CardBody>
                                }

                            </Card>
                    }

                </Col>
            </Row>
        </div>
    )
}
export default QRScanner;
