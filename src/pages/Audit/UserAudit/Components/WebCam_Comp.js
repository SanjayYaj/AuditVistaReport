import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";

import ImageProcess from "./imageprocess"
import { CardBody } from 'reactstrap'

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const WebcamCapture = (props) => {
  if (props.video === true) {
    const [devices, setDevices] = React.useState([]);
    const [cameraID, setCameraId] = React.useState(null)
    const [showWebCam, setShowCam] = React.useState(false)
    const [showWebVideo, setShowVideo] = React.useState(false)
    const [picture, setPicture] = useState('')
    const [isRecording, setIsRecording] = React.useState(false)
    const [dataLoaded, setdataLoaded] = React.useState(false)
    const [previewUrl, setpreviewUrl] = React.useState(null)
    const [recordvideoBlob, setrecordvideoBlob] = React.useState()
    const [duration, setDuration] = useState(0);

    const videoRef = React.useRef(null)
    const mediaRecorderRef = React.useRef(null);
    const chunksRef = React.useRef([]);
    const recordingTimeoutRef = React.useRef(null);
    const selectRef = React.useRef(null);
    const webcamRef = React.useRef(null)
    var duration_time = isNaN(props.max_video_length) ? 1 : props.max_video_length;

    const durationTarget = duration_time * 60; // 3 minutes * 60 seconds/minute

    const handleDevices = React.useCallback(
      (mediaDevices) =>
        setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
      [setDevices]
    );

    React.useEffect(() => {
      // try {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
      setdataLoaded(true)

      // } catch (error) {

      // }
    }, [handleDevices]);

    const handleSubmit = (event) => {
      event.preventDefault()
      setShowCam(false)
      setCameraId(event.target.value)
      setShowCam(true)
    }



    // useEffect(() => {
    //   let intervalId;

    //   if (isRecording) {
    //     intervalId = setInterval(() => {
    //       setDuration((prevDuration) => prevDuration + 1);
    //     }, 1000);
    //   }

    //   return () => {
    //     clearInterval(intervalId);
    //   };
    // }, [isRecording]);
    useEffect(() => {
      let intervalId;
      console.log(props.max_video_length)
      if (isRecording && duration < durationTarget) {
        intervalId = setInterval(() => {
          setDuration((prevDuration) => prevDuration + 1);
        }, 1000);
      }

      return () => {
        clearInterval(intervalId);
      };
    }, [isRecording, duration, durationTarget]);

    const formatBytes = (bytes, decimals = 2) => {
      if (bytes === 0) return "0 Bytes"
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    }

    const capture = React.useCallback(() => {
      const pictureSrc = webcamRef.current.getScreenshot()
      var image_info = ImageProcess.convertBaseToURL(pictureSrc);
      // if (recordingTimeoutRef.current) {
      //   clearTimeout(recordingTimeoutRef.current);
      // }

      setPicture(pictureSrc)
      setShowCam(false)
      setpreviewUrl(null)
      makeDefault()
      props.uploadWebCamImage(image_info)
    })


    const captureVideo = async () => {
      console.log(webcamRef, 'webcamRef', videoRef.current)
      setShowCam(false)
      setShowVideo(true)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        videoRef.current.srcObject = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);
        console.log(mediaRecorderRef.current)
        var chunks = []
        chunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };
        mediaRecorderRef.current.onstop = () => {
          console.log(mediaRecorderRef.current)

          const blob = new Blob(chunksRef.current, { type: "video/mp4" });
          const videoUrl = URL.createObjectURL(blob);
          chunksRef.current.length = 0;
          console.log(videoUrl, 'videoUrl', blob)
          setpreviewUrl(videoUrl)
          setIsRecording(false)
          setrecordvideoBlob(blob)
        };
        setIsRecording(true)
        mediaRecorderRef.current.start();
        console.log(props, mediaRecorderRef.current, props.max_video_length)
        var duration = isNaN(props.max_video_length) ? 1 : props.max_video_length;

        // var duration =props.max_video_length == NaN(props.max_video_length) ? 1 : props.max_video_length
        //  Number(props.max_video_length)
        // props.max_video_length == NaN(props.max_video_length) ? 1 : props.max_video_length
        console.log(duration, 'duration')
        recordingTimeoutRef.current = setTimeout(() => {
          stopRecording();
        }, duration * 60000);

      } catch (error) {
        console.error("Error accessing user media:", error);
      }
    }


    const stopRecording = () => {
      console.log(mediaRecorderRef.current, 'mediaRecorder')

      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }

      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        if (videoRef.current !== null) {
          videoRef.current.srcObject
            .getTracks()
            .forEach((track) => track.stop());
          setShowVideo(false)
          setIsRecording(false)
          setDuration(0)
          // setIsRecording(false)

          console.log(previewUrl, 'prebiewUrl')
        }
      }
    };

    const uploadVedio = () => {
      console.log(recordvideoBlob, 'recordvideoBlob', devices)
      props.uploadWebCamVedio(recordvideoBlob)
      setpreviewUrl(null)
      makeDefault()
    }

    const makeDefault = () => {
      setDevices([]);
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        handleDevices(devices);
        if (selectRef.current) {
          selectRef.current.disabled = true;
        }
      });
    }


    if (dataLoaded) {
      return (
        <CardBody>
          {
            devices.length > 0 ? <>
              <div className='text-center'><label>Select Camera</label></div>
              <div>
                <select defaultValue={"choose"} onChange={handleSubmit} className="form-select">
                  <option value="choose" ref={selectRef} disabled>Select Camera</option>
                  {devices.map((device, key) => (
                    <option key={key} value={device.deviceId}>{device.label || `Device ${key + 1}`}</option>
                  ))}
                </select>
              </div>
            </> :
              <div><label style={{ fontSize: 12, color: "#ff6666" }}>No web camera detected</label></div>
          }


          {
            showWebCam &&
            <div className="mt-3">
              <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ deviceId: cameraID }}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </div>
              <div className="text-end mt-2">
                <button onClick={(e) => { e.preventDefault(); captureVideo(); }} className="btn btn-sm btn-primary">
                  Record Video
                </button>
              </div>
            </div>


          }
          {
            showWebVideo ?

              <div className="mt-3" style={{ width: "100%", position: "relative" }} >
                {isRecording &&
                  <div className="recording-indicator">Recording... <span className="duration-text ms-4">{`${Math.floor(
                    (durationTarget - duration) / 60
                  )} minutes ${(durationTarget - duration) % 60} seconds remaining`}</span></div>
                }
                <video style={{ width: "500px" }} ref={videoRef} autoPlay playsInline muted />
                <div className="text-end">
                  {picture !== '' ? (
                    <button onClick={(e) => { e.preventDefault(); setPicture('') }} className="btn btn-sm btn-sm btn-primary" >
                      Retake Video
                    </button>
                  ) : (
                    <>
                    </>
                  )}
                  <button onClick={(e) => { e.preventDefault(); stopRecording() }} className="btn btn-sm btn-danger">
                    Stop Recording
                  </button>&nbsp;


                </div>
              </div>
              :
              previewUrl !== null &&
              <>
                <div className="mt-3" style={{ width: "100%", position: "relative" }} >
                  <video
                    style={{ width: "500px" }}
                    src={previewUrl}
                    controls
                  />
                  <div className='text-end'>
                    <button onClick={(e) => { e.preventDefault(); captureVideo() }} className="btn btn-sm btn-danger" >
                      Retake Video
                    </button>&nbsp;
                    <button onClick={(e) => { e.preventDefault(); uploadVedio() }} className="btn btn-sm btn-success " >
                      Upload
                    </button>

                  </div>
                </div>

              </>
          }

        </CardBody>
      );
    }
    else {
      return null
    }
  }
  else {
    const [devices, setDevices] = React.useState([]);
    const [cameraID, setCameraId] = React.useState(null)
    const [showWebCam, setShowCam] = React.useState(false)
    const [picture, setPicture] = useState('')

    const webcamRef = React.useRef(null)
    console.log(props, '!!!!', devices, cameraID, showWebCam, picture)

    const handleDevices = React.useCallback(
      (mediaDevices) =>
        setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
      [setDevices]
    );

    React.useEffect(() => {
      // try {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
      // } catch (error) {

      // }
    }, [handleDevices]);

    const handleSubmit = (event) => {
      event.preventDefault()
      setShowCam(false)
      setCameraId(event.target.value)
      setShowCam(true)
    }

    const formatBytes = (bytes, decimals = 2) => {
      if (bytes === 0) return "0 Bytes"
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    }

    const capture = React.useCallback(() => {
      const pictureSrc = webcamRef.current.getScreenshot()
      var image_info = ImageProcess.convertBaseToURL(pictureSrc);

      setPicture(pictureSrc)

      props.uploadWebCamImage(image_info)
      setShowCam(false)
    })

    return (
      <CardBody>
        {
          devices.length > 0 ? <>
            <div className='text-center'><label>Select Camera</label></div>
            <div>
              <select defaultValue={"choose"} onChange={handleSubmit} className="form-select">
                <option value="choose" disabled>Select Camera</option>
                {devices.map((device, key) => (
                  <option key={key} value={device.deviceId}>{device.label || `Device ${key + 1}`}</option>
                ))}
              </select>
            </div>
          </> :
            <div><label style={{ fontSize: 12, color: "#ff6666" }}>No web camera detected</label></div>
        }


        {
          showWebCam &&
          <div className="mt-3" style={{ width: "100%", position: "relative" }} >
            <div style={{ maxWidth: "500px", margin: "0 auto" }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ deviceId: cameraID }}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </div>
            <div className="text-end mt-2">
              {picture !== '' ? (
                <button onClick={(e) => { e.preventDefault(); setPicture('') }} className="btn btn-sm btn-primary">Retake</button>
              ) : (
                <button onClick={(e) => { e.preventDefault(); capture() }} className="btn btn-sm btn-danger" > Capture </button>
              )}
            </div>
          </div>
        }

      </CardBody>
    );
  };
}

export default WebcamCapture





