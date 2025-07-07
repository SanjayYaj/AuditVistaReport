import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Modal, Row, Button } from "reactstrap";
import { UploadOutlined } from '@ant-design/icons';
import { Dropdown } from 'react-bootstrap';
import Webcam from 'react-webcam';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const ImageCrop = ({ userImg, base_url, onSubmitProfileInfo }) => {
  const [src, setSrc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [croppedBlobUrl, setCroppedBlobUrl] = useState(null);
  const [takePhoto, setTakePhoto] = useState(false);
  const [webcamCapturedBlob, setWebcamCapturedBlob] = useState(null);
  const [imageName, setImageName] = useState('');

  const cropperRef = useRef(null);
  const webcamRef = useRef(null);

  const handleCapture = (blob) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setSrc(event.target.result);
      setShowModal(true);
    };
    reader.readAsDataURL(blob);
  };

  const captureImage = () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (screenshot) {
      const blob = dataURLToBlob(screenshot);
      setWebcamCapturedBlob(blob);
      setShowModal(true);
      setTakePhoto(false);
      handleCapture(blob);
    }
  };

  const dataURLToBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageName(e.target.files[0].name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSrc(event.target.result);
        setShowModal(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCrop = () => {
    const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
    croppedCanvas.toBlob((blob) => {
      const croppedBlobUrl = URL.createObjectURL(blob);
      const croppedFile = new File([blob], imageName || 'captured-image.jpg', { type: 'image/jpeg' });
      onSubmitProfileInfo(croppedFile);
      setCroppedBlobUrl(croppedBlobUrl);
      setShowModal(false);
    });
  };

  return (
    <div>
      <Dropdown onSelect={(eventKey) => (eventKey === 'takePhoto' ? setTakePhoto(true) : document.getElementById('fileInput').click())}>
        <Dropdown.Toggle variant="white" className="rounded-circle header-profile-user avatar-lg">
          {userImg.length > 0 ? (
            <img src={base_url + userImg[0].originalname} alt="profile" className="rounded-circle header-profile-user avatar-lg" style={{ width: '100%' }} />
          ) : croppedBlobUrl ? (
            <img src={croppedBlobUrl} alt="Cropped" className="rounded-circle header-profile-user avatar-lg" style={{ width: '100%' }} />
          ) : (
            <h3><UploadOutlined /></h3>
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item eventKey="takePhoto">Take Photo</Dropdown.Item>
          <Dropdown.Item eventKey="browseGallery">Browse Gallery</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} hidden />
      {showModal && (
        <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
          <div className="modal-header">
            <h5 className="modal-title">Crop Image</h5>
            <button type="button" className="close" onClick={() => setShowModal(false)}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Cropper ref={cropperRef} src={src} style={{ height: 400, width: '100%' }} initialAspectRatio={1} guides={false} />
          </div>
          <div className="modal-footer">
            <Button color="danger" onClick={() => setShowModal(false)} outline>Cancel</Button>
            <Button color="success" onClick={handleCrop} outline>Crop</Button>
          </div>
        </Modal>
      )}
      {takePhoto && (
        <Modal isOpen={takePhoto} toggle={() => setTakePhoto(false)}>
          <div className="modal-header">
            <h5 className="modal-title">Take Photo</h5>
            <button type="button" className="close" onClick={() => setTakePhoto(false)}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: 'user' }} width={500} />
          </div>
          <div className="modal-footer">
            <Button onClick={captureImage} color='primary' outline>
              <FontAwesomeIcon icon={faCamera} /> <span>Capture</span>
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ImageCrop;
