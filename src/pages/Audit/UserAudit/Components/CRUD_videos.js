import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Col, Form, Row, Card } from "reactstrap";
import { Popconfirm } from 'antd';
import Dropzone from "react-dropzone";
import WebcamCapture from './WebCam_Comp';
import _ from 'lodash';
import urlSocket from '../../../../helpers/urlSocket';
import Swal from 'sweetalert2';
import { data } from 'autoprefixer';

const CRUD_videos = (props) => {
    const [attachVideos, setAttachVideos] = useState([]);
    const [fileStatus, setFileStatus] = useState("clear");
    const [warningEnabled, setWarningEnabled] = useState(false);
    const [maxVideoLength, setMaxVideoLength] = useState("");
    const [maxVideoSize, setMaxVideoSize] = useState("");
    const [authUser,setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
  
  useEffect(() => {
    console.log(props, 'props')
    var selectedIdx = _.findIndex(props.selectedCheckpoint.rule, { is_selected: true })
    const data = JSON.parse(sessionStorage.getItem("authUser"));
    if (selectedIdx !== -1) {
      const durationInMinutes = props.selectedCheckpoint.rule[selectedIdx]["video_info"]?.duration ? props.selectedCheckpoint.rule[selectedIdx]["video_info"]['duration'] : 30; 
      const durationInSeconds = durationInMinutes / 60;
      console.log(durationInSeconds); // Output: 3600
      setMaxVideoLength(durationInSeconds);
      setMaxVideoSize(data.client_info[0].max_video_size);
    }
    else {
      setMaxVideoLength(data.client_info[0].max_video_duration.$numberDecimal);
      setMaxVideoSize(data.client_info[0].max_video_size);
    }

  }, []);


  // const handleAcceptedFiles = async (files) => {
  //   const MAX_DURATION_SECONDS = 10;
  //   const maxSize = maxVideoSize * 1024 * 1024;

  //   const updatedFiles = [];

  //   for (const file of files) {
  //     if (file.size > maxSize) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: `File too large`,
  //         text: `File "${file.name}" exceeds ${maxVideoSize} MB limit.`,
  //         confirmButtonColor: "#3085d6",
  //         confirmButtonText: "OK",
  //       });
  //       continue;
  //     }

  //     const video = document.createElement("video");
  //     video.preload = "metadata";
  //     video.src = URL.createObjectURL(file);

  //     const duration = await new Promise((resolve) => {
  //       video.onloadedmetadata = () => resolve(video.duration);
  //     });

  //     URL.revokeObjectURL(video.src);

  //     if (duration > MAX_DURATION_SECONDS) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Video too long",
  //         text: `File "${file.name}" exceeds 40 seconds. Please upload a shorter video.`,
  //         confirmButtonColor: "#3085d6",
  //         confirmButtonText: "OK",
  //       });
  //       continue;
  //     }

  //     updatedFiles.push({
  //       ...file,
  //       preview: URL.createObjectURL(file),
  //       formattedSize: formatBytes(file.size),
  //       uploading: false,
  //       filetype: file.type,
  //       uploadingStatus: "Not uploaded",
  //       originalName: file.name,
  //       startTime: 0,
  //       endTime: duration,
  //     });
  //   }

  //   if (updatedFiles.length === 0) return;

  //   const getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
  //     is_selected: true,
  //   });

  //   if (
  //     props.selectedCheckpoint.rule[getOptionIndex].videos.length + updatedFiles.length <=
  //     props.selected_option.video_info.max
  //   ) {
  //     setAttachVideos((prevVideos) => [...prevVideos, ...updatedFiles]);

  //     const formData = new FormData();
  //     updatedFiles.forEach((file) => {
  //       formData.append("folder", props.folderPath);
  //       formData.append("imagesArray", file);
  //     });

  //     try {
  //       const response = await urlSocket.post("storeImage/awswebupload", formData, {
  //         headers: { "Content-Type": "multipart/form-data" },
  //         onUploadProgress: (progressEvent) => {
  //           if (progressEvent.loaded === progressEvent.total) {
  //             // Upload complete
  //           }
  //         },
  //       });

  //       if (response.data.response_code === 500) {
  //         setAttachVideos([]);

  //         const uploadedData = response.data.data;
  //         const ruleVideos = props.selectedCheckpoint.rule[getOptionIndex].videos;

  //         if (ruleVideos.length === 0) {
  //           props.selectedCheckpoint.rule[getOptionIndex]["videos"] = uploadedData;
  //         } else {
  //           ruleVideos.push(uploadedData[0]);
  //         }

  //         for (const item of uploadedData) {
  //           for (const child of props.selectedCheckpoint.rule[getOptionIndex]["videos"]) {
  //             if (child.originalname === item.originalname) {
  //               const trackLoc = await accessLocation();
  //               const splitString = item.key.split("/");
  //               const getFileName = splitString[splitString.length - 1];

  //               child["uploading"] = false;
  //               child["uploadingStatus"] = "Uploaded";
  //               child["preview"] = getFileName;
  //               child["lat"] = props.endpointData.audit_config?.audit_coords_enable
  //                 ? String(trackLoc.latitude)
  //                 : null;
  //               child["long"] = props.endpointData.audit_config?.audit_coords_enable
  //                 ? String(trackLoc.longitude)
  //                 : null;
  //               child["source"] = "camera";
  //             }
  //           }
  //         }

  //         props.selectedCheckpoint.cp_attach_videos =
  //           props.selectedCheckpoint.rule[getOptionIndex]["videos"];

  //         await updateCheckpointImages(
  //           props.selectedCheckpoint.cp_attach_videos,
  //           props.selectedCheckpoint
  //         );

  //         setWarningEnabled(false);
  //       } else {
  //         props.selectedCheckpoint.cp_attach_videos.forEach((child) => {
  //           child["uploading"] = false;
  //           child["uploadingStatus"] = "Not Uploaded";
  //         });

  //         setWarningEnabled(false);
  //       }
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   } else {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Video upload limit reached",
  //       text: `You can upload up to ${props.selected_option.video_info.max} videos only.`,
  //       confirmButtonColor: "#3085d6",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };


  
  const handleAcceptedFiles = async (files) => {
    const updatedFiles = await Promise.all(
      files.map(async (file) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.src = URL.createObjectURL(file);
        const durationPromise = new Promise((resolve) => {
          video.onloadedmetadata = () => {
            resolve(video.duration);
          };
        });
        const duration = await durationPromise;
        URL.revokeObjectURL(video.src);

        return {
          ...file,
          preview: URL.createObjectURL(file),
          formattedSize: formatBytes(file.size),
          uploading: false,
          filetype: file.type,
          uploadingStatus: "Not uploaded",
          originalName: file.name,
          startTime: 0, // Default start time
          endTime: duration, // Set the video duration as the end time
        };
      })
    );

    const maxSize = maxVideoSize * 1024 * 1024;

    if (files.length === 1) {
      if (files[0].size > maxSize) {
        Swal.fire({
          icon: "warning",
          title: `File size cannot be greater than ${maxVideoSize} MB`,
          text: `Please upload the video less than ${maxVideoSize} MB `,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      } else {
        var MAX_DURATION_SECONDS = 0
        var duration = 0
        var seconds = props.selectedCheckpoint.rule[getOptionIndex]["video_info"]["duration"]
        for (const file of files) {
          MAX_DURATION_SECONDS = seconds ? seconds : 30;
          const video = document.createElement("video");
          video.preload = "metadata";
          video.src = URL.createObjectURL(file);

          duration = await new Promise((resolve) => {
            video.onloadedmetadata = () => resolve(video.duration);
          });
        }

        if (
          duration < MAX_DURATION_SECONDS
        ) {
          if (props.selectedCheckpoint.rule[getOptionIndex].videos.length + files.length <= props.selected_option.video_info.max) {

            setAttachVideos((prevVideos) => [...prevVideos, ...files]);

            const formData = new FormData();
            files.forEach((file) => {
              formData.append('folder', props.folderPath)
              // formData.append('folder', `${authUser.client_info[0]["s3_folder_path"]}${props.endpointData.audit_name}/${props.endpointData.loc_name}/`)
              formData.append("imagesArray", file);
            });

            try {
              const response = await urlSocket.post(
                "storeImage/awswebupload",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  onUploadProgress: (progressEvent) => {
                    if (progressEvent.loaded === progressEvent.total) {
                    }
                  },
                }
              );
              console.log(response, 'response')
              if (response.data.response_code === 500) {
                setAttachVideos([]);

                const getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
                  is_selected: true,
                });

                if (
                  props.selectedCheckpoint.rule[getOptionIndex]
                    .videos.length === 0
                ) {
                  props.selectedCheckpoint.rule[getOptionIndex]["videos"] = response.data.data;
                } else {
                  props.selectedCheckpoint.rule[getOptionIndex]["videos"].push(response.data.data[0]);
                }

                _.each(response.data.data, (item) => {
                  _.each(
                    props.selectedCheckpoint.rule[getOptionIndex]["videos"],
                    async (child) => {
                      if (child.originalname === item.originalname) {
                        const trackLoc = await accessLocation();
                        const splitString = item.key.split("/");
                        const getFileName = splitString[splitString.length - 1];
                        child["uploading"] = false;
                        child["uploadingStatus"] = "Uploaded";
                        child["preview"] = getFileName;
                        child["lat"] = props.endpointData.audit_config?.audit_coords_enable
                          ? String(trackLoc.latitude)
                          : null;
                        child["long"] = props.endpointData.audit_config?.audit_coords_enable
                          ? String(trackLoc.longitude)
                          : null;
                        child["source"] = "camera";

                      }
                    }
                  );
                });
                props.selectedCheckpoint.cp_attach_videos = props.selectedCheckpoint.rule[getOptionIndex]["videos"]
                await updateCheckpointImages(
                  props.selectedCheckpoint.cp_attach_videos,
                  props.selectedCheckpoint
                );
                setWarningEnabled(false);
              } else {
                props.selectedCheckpoint.cp_attach_videos.forEach((child) => {
                  child["uploading"] = false;
                  child["uploadingStatus"] = "Not Uploaded";
                });

                setWarningEnabled(false);
              }
            } catch (error) {
              console.log("error", error);
            }
          }
        }
        else {
          Swal.fire({
            icon: "warning",
            title: "Video too long",
            text: `File  exceeds 40 seconds. Please upload a shorter video.`,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          });
        }
      }
    }
    else if(files.length > 1 && files.length <= selectedOption.video_info.max){
      await uploadVideoRecursively(files,0,maxSize,maxVideoSize)
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Reached the max file upload limit',
        text: 'Failed to upload',
      });


    }
  };


  const uploadVideoRecursively=async(fileInfo,counter,maxSize,maxVideoSize)=>{

    if(fileInfo.length > counter){
        if(fileInfo[counter]["size"] > maxSize){
          Swal.fire({
            icon: "warning",
            title: `File size cannot be greater than ${maxVideoSize} MB`,
            text: `Please upload the video less than ${maxVideoSize} MB `,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          });
        }
        else{

            const formData = new FormData();
              formData.append('folder', props.folderPath)
              // formData.append('folder', `${authUser.client_info[0]["s3_folder_path"]}${props.endpointData.audit_name}/${props.endpointData.loc_name}/`)
              formData.append("imagesArray", fileInfo[counter]);

            try {
              const response = await urlSocket.post(
                "storeImage/awswebupload",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  onUploadProgress: (progressEvent) => {
                    if (progressEvent.loaded === progressEvent.total) {
                    }
                  },
                }
              );
              console.log(response, 'response')
              if (response.data.response_code === 500) {

                const getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
                  is_selected: true,
                });
                if (
                  props.selectedCheckpoint.rule[getOptionIndex]
                    .videos.length === 0
                ) {
                  props.selectedCheckpoint.rule[getOptionIndex]["videos"] = response.data.data;
                } else {
                  props.selectedCheckpoint.rule[getOptionIndex]["videos"].push(response.data.data[0]);
                }

                _.each(response.data.data, (item) => {
                  _.each(
                    props.selectedCheckpoint.rule[getOptionIndex]["videos"],
                    async (child) => {
                      if (child.originalname === item.originalname) {
                        const trackLoc = await accessLocation();
                        const splitString = item.key.split("/");
                        const getFileName = splitString[splitString.length - 1];
                        child["uploading"] = false;
                        child["uploadingStatus"] = "Uploaded";
                        child["preview"] = getFileName;
                        child["lat"] = props.endpointData.audit_config?.audit_coords_enable
                          ? String(trackLoc.latitude)
                          : null;
                        child["long"] = props.endpointData.audit_config?.audit_coords_enable
                          ? String(trackLoc.longitude)
                          : null;
                        child["source"] = "camera";

                      }
                    }
                  );
                });
                props.selectedCheckpoint.cp_attach_videos = props.selectedCheckpoint.rule[getOptionIndex]["videos"]
                await updateCheckpointImages(
                  props.selectedCheckpoint.cp_attach_videos,
                  props.selectedCheckpoint
                );
                counter ++
                await uploadVideoRecursively(fileInfo,counter,maxSize,maxVideoSize)


              } else {
                props.selectedCheckpoint.cp_attach_videos.forEach((child) => {
                  child["uploading"] = false;
                  child["uploadingStatus"] = "Not Uploaded";
                });

                setWarningEnabled(false);
              }
            } catch (error) {
              console.log("error", error);
            }
          


        }



    }



  }




    const formatBytes = (bytes, decimals = 2) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };
  
    const accessLocation = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            resolve(locationData);
          },
          (error) => {
            console.log(error, "error");
            reject(null);
          }
        );
      });
    };
  
    const uploadWebCamVideo = (file) => {
      const formData = new FormData();
       formData.append('folder', props.folderPath)
      // formData.append('folder', `${authUser.client_info[0]["s3_folder_path"]}${props.endpointData.audit_name}/${props.endpointData.loc_name}/`)
      formData.append("imagesArray", file);
  
      try {
        urlSocket
          .post("storeImage/awswebupload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(async(response) => {
            if (response.data.response_code === 500) {
              setAttachVideos([]);

               const getOptionIndex = _.findIndex(
                props.selectedCheckpoint.rule,
                {
                  is_selected: true,
                }
              );
              
              if(props.selectedCheckpoint.rule[getOptionIndex].videos.length === 0){
                props.selectedCheckpoint.rule[getOptionIndex].videos=response.data.data
              }
              else{
                props.selectedCheckpoint.rule[getOptionIndex].videos.push(response.data.data[0])
              }

              _.each(response.data.data, (item) => {
                _.each(
                  props.selectedCheckpoint.rule[getOptionIndex].videos,
                  async (child) => {
                    if (child.originalname === item.originalname) {
                      const trackLoc = await accessLocation();
  
                      const splitString = item.key.split("/");
                      const getFileName = splitString[splitString.length - 1];
                      child["uploading"] = false;
                      child["uploadingStatus"] = "Uploaded";
                      child["preview"] = getFileName;
                      child["lat"] = props.endpointData.audit_config?.audit_coords_enable
                        ? String(trackLoc.latitude)
                        : null;
                      child["long"] = props.endpointData.audit_config?.audit_coords_enable
                        ? String(trackLoc.longitude)
                        : null;
                      child["source"] = "camera";
                      // await updateCheckpointImages(
                      //   props.selectedCheckpoint.cp_attach_videos,
                      //   props.selectedCheckpoint
                      // );
                    }
                  }
                );
              });
            props.selectedCheckpoint.cp_attach_videos = props.selectedCheckpoint.rule[getOptionIndex].videos
                await updateCheckpointImages(
                        props.selectedCheckpoint.cp_attach_videos,
                        props.selectedCheckpoint
                      );
  
              // setWarningEnabled(false);
              // props.selectedCheckpoint.cp_attach_videos =
              //   props.selectedCheckpoint.checkpoint_options[getOptionIndex].videos;
            } else {
              props.selectedCheckpoint.cp_attach_videos.forEach((child) => {
                child["uploading"] = false;
                child["uploadingStatus"] = "Not Uploaded";
              });
  
              setWarningEnabled(false);
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
      } catch (error) {
        console.log("catch error", error);
      }
    };
  
    const updateCheckpointImages = (data, item) => {
      props.saveCheckpoint(item);
    };
  
    const deleteImage = (item,idx) => {
      const getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
        is_selected: true,
      });
      // const getIndex = _.findIndex(
      //   props.selectedCheckpoint.rule[getOptionIndex].rule,
      //   { originalName: item.originalname }
      // );
      props.selectedCheckpoint.rule[getOptionIndex].videos.splice(
        idx,
        1
      );
      props.selectedCheckpoint.cp_attach_videos =
        props.selectedCheckpoint.rule[getOptionIndex].videos;
      updateCheckpointImages(props.selectedCheckpoint.cp_attach_videos, props.selectedCheckpoint);
      setFileStatus("clear");
      setWarningEnabled(false);
    };


    const selectedOption = props.selected_option;
    const getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
      is_selected: true,
    });
  
    // if (
    //   props.selectedCheckpoint.rule[getOptionIndex]?.videos ===
    //   undefined
    // ) {
    //   props.selectedCheckpoint.rule[getOptionIndex]["videos"] = [];
    // }


    return (
        <div>
            {props.audit_status !== "3" && props.audit_status !== "4" && 
            // props.selectedCheckpoint.rule[getOptionIndex].videos?.length 
           props.selectedCheckpoint.rule[getOptionIndex].video_info?.max
            !==
             props.selectedCheckpoint.cp_attach_videos.length ? 
            (
                <div>
                    <label>Add Videos</label>
                    <Row className="my-2 align-items-center justify-content-between">
                        <div>
                            <Card style={{ border: '1px dashed lightgrey' }} className='d-flex align-items-center justify-content-start mb-1'>
                                <WebcamCapture
                                    video={true}
                                    uploadWebCamVedio={(data) => uploadWebCamVideo(data)}
                                    max_video_length={props.selectedCheckpoint.rule[getOptionIndex]?.default_video_duration || Number(maxVideoLength)}
                                />
                            </Card>
                        </div>
                        <div>
                            <Card style={{ border: '1px dashed lightgrey' }}>
                                <div style={{ zoom: 0.7 }}>
                                    <Form>
                                        <Dropzone onDrop={handleAcceptedFiles} accept={[".avi", ".mov", ".mkv", ".mp4"]}>
                                            {({ getRootProps, getInputProps }) => (
                                                <div className="dropzone">
                                                    <div className="dz-message needsclick" {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <div className="mb-3">
                                                            <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                        </div>
                                                        <h4>Drop Videos here or click to upload.</h4>
                                                        <div className="mt-2 font-size-13 text-dark text-center">
                                                            <label className='me-2'>Files accepted - .mov,.mp4 </label>
                                                            <label className='me-2'>Maximum individual file size - 5mb</label>
                                                            <label className='me-2'>Minimum Number of files - {selectedOption?.video_info?.min}</label>
                                                            <label>Maximum upto {selectedOption?.video_info?.max} files</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Dropzone>
                                    </Form>
                                </div>
                            </Card>
                        </div>
                    </Row>
                </div>
            ) : props.audit_status !== "3" && props.audit_status !== "4" && props.selectedCheckpoint.cp_noof_videos !== 0 ? (
                <div style={{ padding: 10 }}><label style={{ fontSize: 12, color: "#ff6666" }}>You are reached the Maximum requirment. If you want to retake or upload image, delete one of the image uploaded and capture/upload the picture </label></div>
            ) : null}
            {warningEnabled && <Row><div className="my-2 font-size-12 text-danger">{warningEnabled}</div></Row>}
            <Row className="dropzone-previews" id="file-previews">
                {props.selectedCheckpoint.rule[getOptionIndex].videos?.map((f, i) => (
                    <Col key={`${i}-file`} sm={6} md={4} lg={3} className="mb-3">
                        <Card className="shadow-none border dz-processing dz-image-preview dz-success dz-complete">
                            <div className="d-flex flex-column">
                                {props.audit_status !== "3" && props.audit_status !== "4" && (
                                    <div className="text-end me-2 mb-0 pb-0">
                                        <Popconfirm
                                            title="Are you sure you want to delete?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() => deleteImage(f,i)}
                                        >
                                            <Link to="#"><i className="mdi mdi-close-circle-outline font-size-20 text-danger" /></Link>
                                        </Popconfirm>
                                    </div>
                                )}
                                <div style={{ width: "100%", height: "0", paddingBottom: "56.25%", position: "relative", backgroundColor: "#f5f5f5", border: "1px solid #e9e9e9" }}>
                                    <video
                                        src={
                                           `${props.imagePreviewUrl}${props.folderPath}`+
                                            f.originalname}
                                        className="img-fluid"
                                        style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", objectFit: "contain" }}
                                        controls
                                    />
                                </div>
                                <div className="mt-2 text-center">
                                    <span className={`font-size-10 ${f.uploading ? "text-danger" : "text-success"}`}>{f.uploadingStatus}</span>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default CRUD_videos;