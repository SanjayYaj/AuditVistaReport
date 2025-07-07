import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Button,
    Label,
    Input,
    FormFeedback,
    Form,
    Modal, FormGroup
} from "reactstrap";
import CryptoJS from 'crypto-js'
import { Upload, Image, Popconfirm } from 'antd';
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from 'sweetalert2';
import { LoadingOutlined, DeleteTwoTone, UploadOutlined, InboxOutlined } from '@ant-design/icons'
import Dropzone from "react-dropzone";
// import {reactImageSize} from 'react-image-size';
import {getImageSize} from "react-image-size";

import Resizer from 'react-image-file-resizer'
import Header from "../../components/VerticalLayout/Header";

import Breadcrumb from "../../components/Common/Breadcrumb";
import ImgCrop from "antd-img-crop";
import urlSocket from "../../helpers/urlSocket";
// import { useHistory } from 'react-router-dom';

import WebcamCapture from "../../pages/Audit/UserAudit/Components/WebCam_Comp";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ImageCrop from "./ImageCrop";

const UserProfile = () => {

  //meta title
  document.title = "Profile | AuditVista";

  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [idx, setidx] = useState(1);
  const [previewUser, setPreviewUser] = useState(true)
  const [userInfo, setUserInfo] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const [dbInfo, setDbInfo] = useState({})
  const [clientInfo, setClientInfo] = useState({})
  const [selectedFiles, setselectedFiles] = useState([]);
  const [secret_key, setSecret_key] = useState('Pkdh347ey%3Tgs')
  const [showUpload, setshowUpload] = useState(false);
  const [renderHeader, setrenderHeader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userImg, setUserImg] = useState([]);
 
  // const [takephoto, setTakephoto] = useState(false);
  const [galleryphoto, setGalleryphoto] = useState(false);

  const webcamRef = React.useRef(null)
const [cameraID, setCameraId] = React.useState(null)

const [takephoto, setTakePhoto] = useState(false);
const [uploadphoto, setUploadPhoto] = useState(false);
const [showDropdown, setshowDropdown] = useState(true);
const [mobNumExist, setmobNumExist] = useState(false);

//   const [crop, setCrop] = useState({ aspect: 1 / 1 }); // Aspect ratio for cropping
const [crop, setCrop] = useState({ aspect: 16 / 9 });
const [modalVisible, setModalVisible] = useState(false);

const [show0, setShow0] = useState(false);
const [show1, setShow1] = useState(false);
const [show2, setShow2] = useState(false);

  useEffect(() => {
      var db_info = JSON.parse(sessionStorage.getItem("db_info"));
      var client_info = JSON.parse(sessionStorage.getItem("client_info"))[0];    
      console.log(client_info,'client_info')
      sessionStorage.removeItem("activeMenu")
      setshowUpload(client_info.client_logo === undefined || client_info.client_logo === null  ? true : false)
      console.log(db_info, 'db_info')
      setDbInfo(db_info)
      setClientInfo(client_info)
      if (sessionStorage.getItem("authUser")) {
          const obj = JSON.parse(sessionStorage.getItem("authUser"));
          console.log(obj, 'obj')
          session_data(obj)

      }
  }, []);

  const session_data = (data) => {
      console.log(data, 'data')
      setUserInfo(data.user_data)
      setUserImg(data.user_data?.user_img !== undefined ? data.user_data?.user_img :[])
      setname(data.user_data.firstname)
      setemail(data.user_data.email_id);
      setidx(data.uid);

  }


  const changepwd = useFormik({
      enableReinitialize: true,
      initialValues: {
          current_password: '',
          new_password: '',
          confirm_password: ''
      },
     
      validationSchema: Yup.object({
          current_password: Yup.string().required("Please Enter Your Current Password"),
          new_password: Yup.string().min(8, "Password must be at least 8 characters long")
              .matches(
                  /^(?=.*[A-Z]).+$/,
                  "Password must contain at least one uppercase letter"
              )
              .notOneOf([Yup.ref("current_password"), null], "New password cannot be the same as current password")
              .required("Please Enter the New Password"),
          confirm_password: Yup.string()
              .oneOf([Yup.ref("new_password"), null], "Passwords must match")
              .required("Please Confirm Your New Password"),
      }),
      onSubmit: (values) => {
          console.log(values, dbInfo, clientInfo)
          values["encrypted_db_url"] = dbInfo.encrypted_db_url
          values["db_name"] = dbInfo.db_name
          values["userPoolId"] = clientInfo.userPoolId
          values["clientId"] = clientInfo.clientId
          let temp_curr_pwd = values.current_password
          let temp_new_pwd = values.new_password
          var curr_pwd = CryptoJS.AES.encrypt(temp_curr_pwd, secret_key).toString()
          var new_pwd = CryptoJS.AES.encrypt(temp_new_pwd, secret_key).toString()
          values["current_password"] = curr_pwd
          values["new_password"] = new_pwd
          values["confirm_password"] = new_pwd
          values["email_id"] = userInfo.email_id
          console.log(values, dbInfo, clientInfo)
          setLoading(true);

          try {
              urlSocket.post('cog/change-pwd', values).then((res) => {
                  console.log(res, 'res')
                  values["current_password"] = temp_curr_pwd
                  values["new_password"] = temp_new_pwd
                  values["confirm_password"] = temp_new_pwd
                  if (res.data.data.response_code === 500) {      
                      Swal.fire({
                          icon: 'success',
                          title: 'Success!',
                          text: 'Your request has been processed successfully.',
                          confirmButtonColor: '#3085d6',
                          confirmButtonText: 'OK'
                      }).then((result) => {
                          console.log(result, 'result')
                          if (result.isConfirmed) {
                              setLoading(false);
                              setOpenModal(false);
                              sessionStorage.clear()
                              window.location.reload();
                          }
                          else{
                              setLoading(false);
                              setOpenModal(false);    
                              sessionStorage.clear()
                              window.location.reload();
                          }
                      })
                  }else if(res.data.data.error.code === "NotAuthorizedException" || res.data.data.error.name === "NotAuthorizedException"){
                      Swal.fire({
                          icon: 'warning',
                          title: 'Incorrect!',
                          text: 'Current password incorrect.',
                          confirmButtonColor: '#3085d6',
                          confirmButtonText: 'OK'
                      }).then((result) => {
                          console.log(result, 'result')
                          setOpenModal(false);
                          setLoading(false);
                         
                          if (result.isConfirmed) {                              
                              setLoading(false);

                          }
                      })
                  }
              })
          } catch (error) {
              console.log(error, 'error')
          }
      }
  })



  const checkMobExists=(value)=>{
      console.log(value,'value')
      var admn_info = {}
      admn_info["phone_number"] =value

      admn_info["encrypted_db_url"] =  dbInfo.encrypted_db_url
      admn_info["db_name"] =  dbInfo.db_name
      admn_info["user_id"] = userInfo._id
      admn_info["edit"] = true


      try {
          urlSocket.post('cog/check-user-exist', { admn_info: admn_info }).then((data) => {
              console.log(data, 'data')
              if (data.data.response_code === 504 && data.data.message === "Email Id already exist for another user") {
                  setmobNumExist(true)
              } else {
                  setmobNumExist(false)
              }
          })
      } catch (error) {

      }


  }






  // })

  const validation = useFormik({
      enableReinitialize: true,

      initialValues: {
          username: userInfo.username || '',
          firstname: userInfo.firstname || '',
          addrss_1: userInfo.addrss_1 || '',
          city: userInfo.city || '',
          state: userInfo.state || '',
          country: userInfo.country || '',
          email_id: userInfo.email_id || '',
          phone_number: userInfo.phone_number || '',
          qualification: userInfo.qualification || '',
          doj: userInfo.doj || '',
          designation: userInfo.designation || '',
          experience: userInfo.experience || '',
          usercode: userInfo.usercode || '',
          password: userInfo.password || '',
      },
      validationSchema: Yup.object({
          username: Yup.string().required("Please Enter Your UserName"),
          firstname: Yup.string().required("Please Enter Your firstname"),
          email_id: Yup.string().required("Please Enter Your Email Id"),
          phone_number: Yup.string().required("Please Enter Your Mobile Number")
          .test(async function (value) {
              return !(await checkMobExists(value));
            }),



       
      }),
      onSubmit: (values) => {
          values["userPoolId"] = clientInfo.userPoolId
          values["clientId"] = clientInfo.clientId
          values["encrypted_db_url"] = dbInfo.encrypted_db_url
          values["db_name"] = dbInfo.db_name
          values["_id"] = userInfo._id
          values["status"] = userInfo.status
          values["active"] = userInfo.active
          values["role_id"] = userInfo.role_id
          values["role_name"] = userInfo.role_name
          values["user_id"] = userInfo._id
          console.log(values)
          if(!mobNumExist){
          const obj = JSON.parse(sessionStorage.getItem("authUser"));

          try {
              urlSocket.post('cog/cruduser', {   encrypted_db_url: obj.db_info.encrypted_db_url,
                  user_info : values}).then((res) => {
                  console.log(res, 'res')
                  if (res.status === 200) {
                      var authUser = JSON.parse(sessionStorage.getItem('authUser'))
                      authUser["user_data"]= res.data.admn_user[0]
                      console.log(authUser,'authUser')
                      sessionStorage.setItem('authUser',JSON.stringify(authUser))
                      Swal.fire({
                          icon: 'success',
                          title: 'Success!',
                          text: 'User Information has been saved successfully.',
                          confirmButtonColor: '#3085d6',
                          confirmButtonText: 'OK'
                      })
                          .then((result) => {
                              console.log(result, 'result')
                              if (result.isConfirmed) {
                                  window.location.reload();
                              }
                          })
                  }
              })

          } catch (error) {
              console.log(error, 'error')
          }
          }

      }
  });

 

  const  imageSizeValid = (imageUrl) => {
    console.log(imageUrl,'imageUrl')
    try {
      return getImageSize (imageUrl)
        .then(({ width, height }) => {
          console.log({ width, height })
          let data = { width, height }
          data["width"]=width
          data["height"]=height
          return data
        })
        .catch((error) => {
          console.log(error)
        })
    } catch {

    }
  }





  async function handleAcceptedFiles(files) {
      setLoading(true)
      const formData = new FormData();
      clientInfo["client_logo"] = {}
      files.map(async file => {
          const formattedFile = Object.assign(file, {
              preview: URL.createObjectURL(file),
              formattedSize: formatBytes(file.size),
              filetype: file.type,
              uploadingStatus: 'Not uploaded',
              originalName: file.name,
          });
 
          let image_size = await imageSizeValid(files[0].preview)
          formattedFile["width"] = image_size.width
          formattedFile["height"] = image_size.width
          console.log(image_size, 'image_size', formattedFile)  
          formData.append('files', formattedFile);
          if (clientInfo._id !== undefined) {
              console.log("update_img", clientInfo._id)
              formData.append('client_logo', clientInfo._id);  
              formData.append('email_id', clientInfo.email_id);
              formData.append('short_name', clientInfo
                .short_name);
              formData.append('encrypted_db_url',dbInfo.encrypted_db_url );          
          }
          if (files[0].size > 1000000) {
              setLoading(false)
              Swal.fire({
                  icon: 'warning',
                  title: 'Warning!',
                  text: `Image Size is more than 1MB `,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
              }).then((result) => {
 
              })
          }
          else{
          try {
              const config = {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
              };
              urlSocket.post('storeImage/logo_awswebupload', formData, config).then(async(response) => {
                  console.log(response, 'response')
                  if (response.data.response_code === 500) {
                      var upload = await updt_rszd_img(formattedFile)
                      console.log(upload,'upload')
                      var rszed_img = await rszed_upload_img(upload,config,files)
 
 
                  }
              })
 
          } catch (error) {
              console.log(error,'error')
          }
      }
      });
 
  }
 
      async function rszed_upload_img(upload, config,files) {
          urlSocket.post('storeImage/logo_awswebupload', upload, config).then(async (response) => {
              console.log(response, 'response')
              if(response.data.response_code === 500){
                   var session_data = JSON.parse(sessionStorage.getItem('authUser'))
                  var client_data = JSON.parse(sessionStorage.getItem('client_info'))
                  client_data = response.data.client_info
                  session_data.client_info = response.data.client_info
                  console.log(session_data,'session_data')
                  sessionStorage.setItem('client_info',JSON.stringify(client_data))
                  sessionStorage.setItem('authUser',JSON.stringify(session_data))
                  setLoading(false)
                  setshowUpload(false)
                  setselectedFiles(files)
              }
          })
 
 
      }
 
 
 
 
 
 
 
 
 
      async function updt_rszd_img(files){
 
          const formData = new FormData()
          if(clientInfo._id !== undefined){
              formData.append('client_logo',clientInfo._id)
          }
 
          if (files.size > 500000 && files.size <= 1000000) {
 
              const resizedFile = await resizeImage(files, 0.8, 512, 512)
              resizedFile.formattedSize= formatBytes(resizedFile.size)
              resizedFile.preview= URL.createObjectURL(resizedFile)
             
              const dotIndex = resizedFile.name.lastIndexOf('.');
              const modifiedFilename = resizedFile.name.slice(0, dotIndex) + "_rzd" + resizedFile.name.slice(dotIndex);
              resizedFile["originalname"]= modifiedFilename
             
              formData.append('files', resizedFile);
              formData.append('email_id', clientInfo.email_id);
              formData.append('short_name', clientInfo.short_name);
              formData.append('encrypted_db_url',dbInfo.encrypted_db_url );
              formData.append('resized', true);    
              return formData
 
          } else {
              formData.append('email_id', clientInfo.email_id);
              formData.append('encrypted_db_url',dbInfo.encrypted_db_url );
              formData.append('short_name', clientInfo.short_name);
              formData.append('resized', true);    
              formData.append('files', files);
              return formData
 
          }    
 
      }
 
      async function resizeImage(file, resizeRatio, targetWidth, targetHeight) {
          const dotIndex = file.name.lastIndexOf('.');
          const modifiedFilename = file.name.slice(0, dotIndex) + "_rzd" + file.name.slice(dotIndex);
          var originalName =modifiedFilename
          return new Promise((resolve, reject) => {
              Resizer.imageFileResizer(
                  file,
                  targetWidth,
                  targetHeight,
                  'JPEG',
                  80,
                  0,
                  (resizedFile) => {
                      const modifiedResizedFile = new File([resizedFile], originalName, { type: resizedFile.type });
                      resolve(modifiedResizedFile);
                  },
                  'blob'
              );
          });
      }
 
  function formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes"
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }


  function deleteImage(data) {
      console.log(data, 'data')
      if (Object.keys(clientInfo.client_logo).length > 0) {
          delete clientInfo["client_logo"]
          console.log(clientInfo,'state')
          var delete_data ={}
          delete_data["userPoolId"] = clientInfo.userPoolId
          delete_data["clientId"] = clientInfo.clientId
          delete_data["_id"] = clientInfo._id
          delete_data["email_id"] = clientInfo.email_id
          delete_data["short_name"] = clientInfo.short_name
          delete_data["encrypted_db_url"] = dbInfo.encrypted_db_url
          delete_data["db_name"] = dbInfo.db_name
          urlSocket.post('webmngtmplt/delete-client-logo', { "client_info": delete_data }).then((response) => {
              console.log(response, 'response')
              setselectedFiles([])
              if(response.data.response_code === 500){
                  Swal.fire({
                      icon: 'success',
                      title: 'Success!',
                      text: `Image has been deleted successfully`,
                      confirmButtonColor: '#FF0000',
                      confirmButtonText: 'OK'
                  }).then((result) => {
                      console.log(result, 'result')
                      var session_data = JSON.parse(sessionStorage.getItem('authUser'))
                      session_data["client_info"] = response.data.client_data
                      sessionStorage.setItem('authUser',JSON.stringify(session_data))
                      sessionStorage.setItem('client_info',JSON.stringify(response.data.client_data))
                      if (result.isConfirmed) {
                          setrenderHeader(true)
                      }
                      // getClientList()
 
                  })

              }
             
              setshowUpload(true)


          })
      }
      else {
          setselectedFiles([])
      }
      setshowUpload(true)
  }


  const edit_user_info = () => {
      console.log("edit usersss")
      setPreviewUser(false)
  }

  const changePassword = (data) => {
      console.log("change passowrd")
      changepwd.resetForm();
      setOpenModal(true)
      setLoading(false)
      if (data === "1") {
          setOpenModal(!openModal)
      }

  }

  const onFileChange = (files) => {
      console.log('e', [files]);
      [files].map(async file => {
          const formattedFile = Object.assign(file, {
              preview: URL.createObjectURL(file),
              formattedSize: formatBytes(file.size),
              filetype: file.type,
              uploadingStatus: 'Not uploaded',
              originalName: file.name,
          });
          const formData = new FormData();
          console.log(formattedFile,'formattedFile')
          formData.append('files',formattedFile)
          formData.append('encrypted_db_url',dbInfo.encrypted_db_url)
          formData.append('_id',userInfo._id)

          try {
              const config = {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
              };
              urlSocket.post('storeImage/user-img-upload',formData,config).then((response)=>{
                  console.log(response,'response')
                  if(response.data.response_code === 500){
                      setUserImg(response.data.data)
                      var session_data = JSON.parse(sessionStorage.getItem('authUser'))
                      session_data["user_data"] = response.data.user_data[0]
                      sessionStorage.setItem('authUser',JSON.stringify(session_data))
                      setUploadPhoto(false)
                      // sessionStorage.setItem('client_info',JSON.stringify(response.data.client_data))
                  }
              })
             
          } catch (error) {
             
          }
      })
  }

  const deleteUserImg =(data)=>{
      console.log("user image delete",data)
      var obj_data ={}
      obj_data["user_data"]=data
      obj_data["encrypted_db_url"]=dbInfo.encrypted_db_url

      try {
              urlSocket.post('storeImage/user-delete-img',obj_data).then((response)=>{
                  console.log(response,'response')
                  if(response.data.response_code == 500){
                      Swal.fire({
                          icon: 'success',
                          title: 'Deleted Successfully',
                          text: 'Profile Image Deleted successfully',
                          confirmButtonColor: '#3085d6',
                          confirmButtonText: 'Ok',
                      }).then((result) => {
                          if(result.isConfirmed){
                              console.log("success")
                              var session_data = JSON.parse(sessionStorage.getItem('authUser'))
                              session_data["user_data"] = response.data.user_data[0]
                              sessionStorage.setItem('authUser',JSON.stringify(session_data))
                              setUserImg([])
                          }

                      })
                  }
              })
      } catch (error) {
         
      }

  }





 const uploadWebCamImage = async (file) => {
      Object.assign(file, {
          "preview": URL.createObjectURL(file), //URL.createObjectURL(file),
          "formattedSize": formatBytes(file.size),
          "uploading": false,
          "filetype": file.type,
          "uploadingStatus": 'Not uploaded',
          "originalName": file.name,
          "captured_on": new Date(),
          "path": file.name,
          //  "name": image_info.name,
          // "type": file.type,
          //"uri": URL.createObjectURL(image_info),
      })
      //window.location = URL.createObjectURL(file);
      setUserImg([file])
      setTakePhoto(false)
      setModalVisible(true)
      let formData = new FormData();        
      formData.append('imagesArray', file)

     
  }


  const handleImageLoaded = (image) => {
      console.log('image', image)
  };

  const handleCropComplete = (crop) => {
      console.log('crop', crop)
  };

  const handleCropChange = (newCrop) => {
      console.log('newCrop', newCrop)
      setCrop(newCrop);
  };

 



  const handleCropSave = (file) => {
      const originalImage = document.getElementById('myImage'); // Replace with the actual image element's ID
    console.log('file', file, originalImage)
      const canvas = document.createElement('canvas');
      canvas.width = crop.width;
      canvas.height = crop.height;
   
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        originalImage,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );
   
      // Create a new Blob with the cropped image data
      canvas.toBlob((blob) => {
        const updatedFile = new File([blob], file.name, {
          type: 'image/jpeg', // Adjust if needed
        });
        updatedFile.preview = URL.createObjectURL(file);
        updatedFile.formattedSize = blob !== null ? formatBytes(blob.size) : file.formattedSize;
        updatedFile.uploading = false;
        updatedFile.uploadingStatus = 'Not uploaded';
        updatedFile.path = file.name;
   
          const formData = new FormData();
          formData.append('files', blob !== null ? updatedFile : file);
          formData.append('encrypted_db_url', dbInfo.encrypted_db_url);
          formData.append('_id', userInfo._id);

          try {
              const config = {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
              };
              urlSocket.post('storeImage/user-img-upload', formData, config).then((response) => {
                  console.log(response, 'response')
                  if (response.data.response_code === 500) {
                      setUserImg(response.data.data)
                      var session_data = JSON.parse(sessionStorage.getItem('authUser'))
                      session_data["user_data"] = response.data.user_data[0]
                      sessionStorage.setItem('authUser', JSON.stringify(session_data))
                      setModalVisible(false)
                  }
              })

          } catch (error) {

          }


      }, 'image/jpeg'); // Change format if needed
    };


   
  const onHideToggle = () => {
      setModalVisible(false)
      setUploadPhoto(false)
      setTakePhoto(false)
     
  }

  const onHideCropModal =()=>{
      setModalVisible(false)
      setUserImg([])
      setUploadPhoto(false)
      setTakePhoto(false)
  }



  const onSubmitProfileInfo = (croppedFile) => {
      const formData = new FormData();
      formData.append('files', croppedFile)
      formData.append('encrypted_db_url', dbInfo.encrypted_db_url);
      formData.append('_id', userInfo._id);
      console.log('final data :', croppedFile)
      try {
          const config = {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          };
          urlSocket.post('storeImage/user-img-upload', formData, config).then((response) => {
              if (response.data.response_code === 500) {
                  setUserImg(response.data.data)
                  var session_data = JSON.parse(sessionStorage.getItem('authUser'))
                  session_data["user_data"] = response.data.user_data[0]
                  sessionStorage.setItem('authUser', JSON.stringify(session_data))
                  // setUploadPhoto(false)
              }
          })

      } catch (error) {

      }

  }


  const handleCloseModal = () => {
      setOpenModal(false);
      setShow0(false);
      setShow1(false);
      setShow2(false);
  };


  return (
      <React.Fragment>
      <div className="page-content">
          <Container fluid>
              <Breadcrumb breadcrumbItem="User Profile" />
              <Card>
                  <CardBody>
                      <Row>
                          <Col lg="10">
                              <div className="d-flex">                                    
                                     
                              <div className='' id="file-previews">                                        
                                            <ImageCrop db_info={dbInfo} user_Info={userInfo} userImg={userImg} base_url={clientInfo.base_url} onSubmitProfileInfo={(data) => { onSubmitProfileInfo(data) }} />
                                            {
                                                userImg.length > 0 &&
                                                <div style={{textAlign: 'right'}}>
                                                <Popconfirm title="Are you sure you want to delete?" okText="Yes" cancelText="No" onConfirm={() => { deleteUserImg(userInfo) }} >
                                                    <DeleteTwoTone twoToneColor="red" style={{ fontSize: '14px' }} />
                                                </Popconfirm>
                                                </div>
                                            }
                                            </div>
                                      <div className='' id="file-previews">

                                         

                                          {userImg.length > 0 &&
                                              <Modal isOpen={modalVisible} toggle={() => setModalVisible(modalVisible)}>
                                                  <div className="modal-header">
                                                      <h5 className="modal-title">Crop Image</h5>
                                                      <button type="button" className="close" onClick={() => onHideCropModal()}>
                                                          <span aria-hidden="true">&times;</span>
                                                      </button>
                                                  </div>
                                                  <div className="modal-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                     
                                                      <ReactCrop
                                                          crop={crop}
                                                          onImageLoaded={handleImageLoaded}
                                                          onComplete={handleCropComplete}
                                                          onChange={handleCropChange}
                                                      >
                                                         
                                                          <img src={userImg[0].preview} alt="Preview" style={{ width: "100%" }} id="myImage"/>
                                                      </ReactCrop>

                                                  </div>
                                                  <div className="modal-footer">
                                                 
                                                      <Button color="primary" onClick={() => handleCropSave(userImg[0])}>
                                                          Save
                                                      </Button>
                                                  </div>
                                              </Modal>
                                          }




                                          {
                                              takephoto ?
                                                  <>
                                                      <label>Take photo</label>
                                                     
                                                      <Modal isOpen={modalVisible} toggle={() => setModalVisible(true)} style={{ maxWidth: '600px'}}>
                                                          <div className="modal-header">
                                                              <h5 className="modal-title">Take Photo</h5>
                                                              <button type="button" className="close" onClick={() => onHideToggle()}>
                                                                  <span aria-hidden="true">&times;</span>
                                                              </button>
                                                          </div>
                                                          <div className="modal-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>                                                              
                                                                   
                                                          <Row>
                                                                            <WebcamCapture uploadWebCamImage={(data) => { uploadWebCamImage(data) }} />
                                                                        </Row>
                                                          </div>                                                          
                                                      </Modal>
                                                  </>
                                                  :

                                                  uploadphoto ?
                                                  <div>
                                                      <ImgCrop showGrid showReset rotationSlider zoomSlider cropShape="round">
                                                          <Upload
                                                              listType="picture-circle"
                                                              showUploadList={false}
                                                              beforeUpload={onFileChange}
                                                          >                                                              
                                                                  {'+ Click Here'}
                                                           
                                                          </Upload>
                                                      </ImgCrop>
                                                      <div style={{cursor: 'pointer'}} className="mt-2 text-primary" onClick={() => onHideToggle()}>
                                                      <i className="fas fa-arrow-left" ></i> Back
                                                      </div>
                                                  </div>
                                                  :
                                                  null
                                          }                                            
                                       

                                         

                                      </div>

                                     
                                  <div className="flex-grow-1 align-self-center">
                                      <div className="text-muted" style={{ marginLeft: '15px' }}>
                                          <h5>{name}</h5>
                                          <p className="mb-1" style={{ marginTop: "-6px" }}>{email}</p>
                                          <p className="mb-1" style={{ marginTop: "-5px" }}><span className="text-dark">Login ID :</span> {userInfo.username}</p>
                                      </div>
                                  </div>
                              </div>
                             

                          </Col>
                          <Col lg='2' className="d-flex align-items-center justify-content-end">
                          </Col>
                      </Row>
                      <Row className="mt-2">
                          <Col sm='6'>
                              <Button
                                  outline
                                  color="success"
                                  style={{ paddingLeft: 'inherit' }}
                                  onClick={() => { edit_user_info() }}
                                  type="button"
                                  className="btn-sm waves-effect waves-light mt-2"
                              >
                                  <i className="mdi mdi-pencil font-size-7"></i> Edit User Profile
                              </Button>
                          </Col>

                          <Col sm='6' className="text-end">
                                 
                          </Col>
                         

                      </Row>
                  </CardBody>
              </Card>
             
                 
                  {
                      renderHeader &&
                      <Header/>
                  }

              <Card>
                  <CardBody>
                      <Form
                          className="form-horizontal"
                          onSubmit={(e) => {
                              e.preventDefault();
                              validation.handleSubmit();
                              return false;
                          }}
                      >
                          <Row className="my-4">
                              <div className="text-primary font-size-18" style={{ fontWeight: 'bold' }}>User Information</div>
                              <hr className="my-2" />
                          </Row>
                          <Row>
                              <Col md={12}>
                                  <div className="form-group">
                                      <Label className="form-label">Full Name :<label className="text-danger"> *</label></Label>
                                      <Input
                                          name="firstname"
                                          // value={name}
                                          className="form-control"
                                          placeholder="Enter First Name"
                                          type="text"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.firstname || ""}
                                          disabled={previewUser}
                                          invalid={
                                              validation.touched.firstname && validation.errors.firstname ? true : false
                                          }
                                      />
                                      {validation.touched.firstname && validation.errors.firstname ? (
                                          <FormFeedback type="invalid">{validation.errors.firstname}</FormFeedback>
                                      ) : null}
                                  </div>
                              </Col>
                             
                          </Row>
                          <br />
                          <Row>
                              <Col md={12}>
                                  <div className="form-group">
                                      <Label className="form-label">Address:</Label>
                                      <Input
                                          name="addrss_1"
                                          className="form-control"
                                          placeholder="Enter Address Name"
                                          type="text"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          disabled={previewUser}
                                          value={validation.values.addrss_1 || ""}
                                      />
                                  </div>

                              </Col>
                          </Row>
                          <br />
                          <Row>
                              <Col md={4}>
                                  <div className="form-group">
                                      <Label className="form-label">City:</Label>
                                      <Input
                                          name="city"
                                          className="form-control"
                                          placeholder="Enter City Name"
                                          type="text"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.city || ""}
                                          disabled={previewUser}
                                      />
                                  </div>
                              </Col>
                              <Col md={4}>
                                  <div className="form-group">
                                      <Label className="form-label">State :</Label>
                                      <Input
                                          name="state"
                                          className="form-control"
                                          placeholder="Enter State Name"
                                          type="text"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.state || ""}
                                          disabled={previewUser}
                                      />
                                  </div>
                              </Col>
                              <Col md={4}>
                                  <div className="form-group">
                                      <Label className="form-label">Country:</Label>
                                      <Input
                                          name="country"
                                          className="form-control"
                                          placeholder="Enter Country Name"
                                          type="text"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.country || ""}
                                          disabled={previewUser}
                                      />
                                  </div>
                              </Col>
                          </Row>
                          <br />
                          <Row>
                              <Col md={6}>
                                  <div className="form-group">
                                      <Label className="form-label">Email ID :<label className="text-danger"> *</label></Label>
                                      <Input
                                          name="email_id"
                                          className="form-control"
                                          placeholder="Enter Email ID"
                                          type="text"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.email_id || ""}
                                          disabled={true}
                                          invalid={
                                              validation.touched.email_id && validation.errors.email_id ? true : false
                                          }
                                      />

                                     
                                      {validation.touched.email_id && validation.errors.email_id ? (
                                          <FormFeedback type="invalid">{validation.errors.email_id}</FormFeedback>
                                      ) : null}
                                  </div>
                                 

                              </Col>
                              <Col md={6}>
                                  <div className="form-group">
                                      <Label className="form-label">Mobile Number :<label className="text-danger"> *</label></Label>
                                      <Input
                                          name="phone_number"
                                          className="form-control"
                                          placeholder="Enter Mobile Number"
                                          type="number"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.phone_number || ""}
                                          disabled={true}
                                          invalid={
                                              validation.touched.phone_number && validation.errors.phone_number ? true : false
                                          }
                                      />
                                      {validation.touched.phone_number && validation.errors.phone_number ? (
                                          <FormFeedback type="invalid">{validation.errors.phone_number}</FormFeedback>
                                      ) : null}
                                  </div>
                                  {
                                          mobNumExist &&
                                          <div className="text-danger" style={{fontSize:"smaller"}}>
                                              Mobile Number already exist

                                              </div>
                                      }
                              </Col>
                          </Row>
                          <br />
                          <Row className="my-4">
                              <div className="text-primary font-size-18" style={{ fontWeight: 'bold' }}>Company Information</div>
                              <hr className="my-2" />
                          </Row>
                       
                          <Row>
                              <Col md={6}>
                                  <div className="form-group">
                                      <Label className="form-label">Qualification:</Label>
                                      <Input
                                          name="qualification"
                                          className="form-control"
                                          placeholder="Enter Qualification"
                                          type="text"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.qualification || ""}
                                          disabled={previewUser}

                                      />
                                  </div>
                              </Col>
                              <Col md={6}>
                                  <div className="form-group">
                                      <Label className="form-label">Date of Joining:</Label>
                                     
                                          <Input
                                              name="doj"
                                              className="form-control"
                                              placeholder="Enter Date of Joining"
                                              // type="text"
                                              type="date"
                                              onChange={validation.handleChange}
                                              onKeyDown={(e) => { e.preventDefault() }}
                                              onBlur={validation.handleBlur}
                                              value={validation.values.doj || ""}
                                              disabled={previewUser}

                                          />
                                  </div>
                              </Col>
                          </Row>
                          <br />
                          <Row>
                              <Col md={4}>
                                  <div className="form-group">
                                      <Label className="form-label">Designation :</Label>
                                      <Input
                                          name="designation"
                                          className="form-control"
                                          placeholder="Enter your Designation"
                                          type="text"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.designation || ""}
                                          disabled={previewUser}

                                          // invalid={
                                          //     validation.touched.designation && validation.errors.designation ? true : false
                                          // }
                                      />
                                     
                                  </div>
                              </Col>
                              <Col md={4}>
                                  <div className="form-group">
                                      <Label className="form-label">Experience:</Label>
                                      <Input
                                          name="experience"
                                          className="form-control"
                                          placeholder="Enter your Experience"
                                          type="text"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.experience || ""}
                                          disabled={previewUser}

                                      />
                                  </div>
                              </Col>
                              <Col md={4}>
                                  <div className="form-group">
                                      <Label className="form-label">User Code:</Label>
                                      <Input
                                          name="usercode"
                                          className="form-control"
                                          placeholder="Enter your User Code"
                                          type="text"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.usercode || ""}
                                          disabled={previewUser}

                                          invalid={
                                              validation.touched.usercode && validation.errors.usercode ? true : false
                                          }
                                      />
                                      {validation.touched.usercode && validation.errors.usercode ? (
                                          <FormFeedback type="invalid">{validation.errors.usercode}</FormFeedback>
                                      ) : null}
                                  </div>
                              </Col>
                          </Row>
                              <br/>
                              <br />
                         
                       {  userInfo.role === "Super Admin" && <Label>Upload Company Logo:</Label>}
                          <Row>
                              <Col md={3}>

                                  {
                                      showUpload && userInfo.role === "Super Admin" ?
                                          <div className={loading ? "loading-container" : ""}>
                                              <div className={`dropzone ${loading ? "blur" : ""}`}>
                                                  <Dropzone
                                                      onDrop={(acceptedFiles) => {
                                                          handleAcceptedFiles(acceptedFiles);
                                                      }}
                                                      disabled={previewUser}
                                                      accept={[".jpg", ".jpeg", ".png"]}
                                                      className={previewUser ? "dropzone-disabled" : ""}
                                                  >
                                                      {({ getRootProps, getInputProps }) => (
                                                          <div className={`dz-message needsclick mt-2 ${previewUser ? "dropzone-blur" : ""}`} {...getRootProps()}>
                                                              <input {...getInputProps()} />
                                                              <div className="mb-3">
                                                                  <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                              </div>
                                                              <h4>Drop files here or click to upload.</h4>
                                                              <div className="mt-2 font-size-11 text-dark text-center">
                                                                  <span className="text-danger">Files accepted - .jpg, .jpeg, .png </span> <br />
                                                                  <span className="text-danger">Maximum individual file size - 1mb</span>
                                                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                              </div>
                                                          </div>
                                                      )}
                                                  </Dropzone>
                                              </div>
                                              {loading && <div className="loading">Loading...</div>}
                                          </div>
                                          :

                                          userInfo.role === "Super Admin" && (Object.keys(clientInfo.client_logo
                                          ).length > 0) ?

                                              <div className="dropzone-previews mt-3" id="file-previews">
                                                  <Card  style={{ background: '#d3d3d35e', borderRadius: '12px' }}>
                                                      <CardBody>
                                                          <Row>
                                                              <Col md={12} style={{ textAlign: 'center' }}>
                                                                  <Image  src={clientInfo.base_url + clientInfo.client_logo.originalname} width={'50%'} height={'auto'} alt="Thumbnail" />
                                                              </Col>
                                                              <div className="mt-2 contentInfo text-center">
                                                                  <Label style={{ marginBottom: 0 }}>File name: <span>{clientInfo.client_logo.originalname}</span></Label><br />
                                                                  <Label style={{ marginBottom: 0 }}>Size: <span>{clientInfo.client_logo.formattedSize}</span></Label>
                                                              </div>
                                                              <div className='mt-2 text-end'>
                                                              <span style={{ pointerEvents: previewUser ? 'none' : 'auto' }}>
                                                                  <Popconfirm title="Are you sure you want to delete?" okText="Yes" cancelText="No" onConfirm={() => { deleteImage(clientInfo.client_logo) }}>
                                                                      <DeleteTwoTone twoToneColor="red" style={{ fontSize: '18px' }} />
                                                                  </Popconfirm>
                                                                  </span>
                                                              </div>
                                                          </Row>
                                                      </CardBody>
                                                  </Card>


                                              </div>
                                              :
                                              selectedFiles.map((f, i) => {
                                                  return (
                                                      // <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete" key={i + "-file"} >
                                                      <div key={i + "-file"} >
                                                          <Card style={{ background: '#d3d3d35e', borderRadius: '12px' }}>
                                                              <CardBody>
                                                                  <Row>
                                                                      <Col md={12} style={{ textAlign: 'center' }}>
                                                                          <Image className="text-center" src={f.preview} width={'50%'} height={'auto'} alt="Thumbnail" />
                                                                      </Col>
                                                                      <div className="mt-2 contentInfo text-center">
                                                                          <Label style={{ marginBottom: 0 }}>File name: <span>{f.name}</span></Label><br />
                                                                          <Label style={{ marginBottom: 0 }}>Size: <span>{f.formattedSize}</span></Label>
                                                                      </div>
                                                                      <div className='mt-2 text-end'>
                                                                          <Popconfirm title="Are you sure you want to delete?" okText="Yes" cancelText="No" onConfirm={() => { deleteImage(f) }}>
                                                                              <DeleteTwoTone twoToneColor="red" style={{ fontSize: '18px' }} />
                                                                          </Popconfirm>
                                                                      </div>
                                                                  </Row>
                                                              </CardBody>
                                                          </Card>
                                                      </div>
                                                  )
                                              })
                                  }
                              </Col>
                          </Row>

                          <br />
                         
                          <br />
                          <Row>
                              <Col xl={10}>

                              </Col>
                              <Col xl={2} className="text-end">
                              <Button type="submit" color="danger" disabled={previewUser === true? true : false}>
                                  Update User Info
                              </Button>
                                  </Col>
                          </Row>
                         
                      </Form>
                      {openModal &&
                          <Modal
                              size="xl"
                              isOpen={openModal}
                              toggle={() => {
                                  changePassword("1");
                              }}
                              backdrop="static"
                              centered
                          >
                              <Row>
                                  <Col xl={12} md={12} sm={12}>
                              <div className="modal-header">
                                  <h5
                                      className="modal-title mt-0"
                                  >
                                      Change Password
                                  </h5>
                                  <button
                                      onClick={handleCloseModal}
                                      type="button"
                                      className="close"
                                      data-dismiss="modal"
                                      aria-label="Close"
                                  >
                                      <span aria-hidden="true">&times;</span>
                                  </button>
                              </div>
                              <br />

                              <Row>
                                  <Col md={1}>
                                    <label style={{ marginLeft: '17px' }}>Email ID:</label>

                                  </Col>
                                  <Col md={2}>
                                      <label>{userInfo.email_id}</label>
                                  </Col>
                              </Row>
                              <br />
                              <Form className="needs-validation"
                                  onSubmit={(e) => {
                                      e.preventDefault();
                                      changepwd.handleSubmit();
                                      return false;
                                  }}
                              >
                                  <Row>
                                      <Col xl={11} md={10} sm={8}>

                                          <FormGroup style={{ marginLeft: '18px' }}>
                                              <Label >Current Password:</Label>
                                              <Input
                                                  name="current_password"
                                                  style={{ width: "106%" }}
                                                  placeholder="Current Password"
                                                  type={show0 ? "text" : "password"}
                                                  className="form-control"
                                                  onChange={changepwd.handleChange}
                                                  onBlur={changepwd.handleBlur}
                                                  value={changepwd.values.current_password || ""}
                                                  invalid={
                                                      changepwd.touched.current_password && changepwd.errors.current_password ? true : false
                                                  }
                                              />
                                              {changepwd.touched.current_password && changepwd.errors.current_password ? (
                                                  <FormFeedback type="invalid">{changepwd.errors.current_password}</FormFeedback>
                                              ) : null}
                                          </FormGroup>
                                      </Col>
                                          <Col xl={1} md={2} sm={2} style={{ marginTop: '27px' }}>
                                          <button onClick={() => setShow0(!show0)} className="btn btn-light " type="button">
                                                  <i className={show0 ? "mdi mdi-eye-outline" : "mdi mdi-eye-off"}></i></button>
                                          </Col>
                                      </Row>
                                      <br/>
                                      <Row>
                                      <Col xl={11} md={10} sm={8}>
                                          <FormGroup style={{ marginLeft: '18px' }}>
                                              <Label >New Password:</Label>
                                              <Input
                                                  name="new_password"
                                                  placeholder="New Password"
                                                  style={{ width: "106%" }}
                                                  type={show1 ? "text" : "password"}
                                                  className="form-control"
                                                  onChange={changepwd.handleChange}
                                                  onBlur={changepwd.handleBlur}
                                                  value={changepwd.values.new_password || ""}
                                                  invalid={
                                                      changepwd.touched.new_password && changepwd.errors.new_password ? true : false
                                                  }
                                              />
                                              {changepwd.touched.new_password && changepwd.errors.new_password ? (
                                                  <FormFeedback type="invalid">{changepwd.errors.new_password}</FormFeedback>
                                              ) : null}
                                          </FormGroup>
                                      </Col>
                                      <Col xl={1} md={2} sm={2} style={{ marginTop: '27px' }}>
                                          <button onClick={() => setShow1(!show1)} className="btn btn-light " type="button">
                                                  <i className={show1 ? "mdi mdi-eye-outline" : "mdi mdi-eye-off"}></i></button>
                                          </Col>
                                      </Row>
                                      <br/>
                                      <Row>
                                      <Col xl={11} md={10} sm={8}>
                                          <FormGroup style={{ marginLeft: '18px' }}>
                                              <Label >Confirm Password:</Label>
                                              <Input
                                                  name="confirm_password"
                                                  placeholder="Confirm Password"
                                                  style={{ width: "106%" }}
                                                  type={show2 ? "text" : "password"}
                                                  className="form-control"
                                                  onChange={changepwd.handleChange}
                                                  onBlur={changepwd.handleBlur}
                                                  value={changepwd.values.confirm_password || ""}
                                                  invalid={
                                                      changepwd.touched.confirm_password && changepwd.errors.confirm_password ? true : false
                                                  }
                                              />                                                  
                                              {changepwd.touched.confirm_password && changepwd.errors.confirm_password ? (
                                                  <FormFeedback type="invalid">{changepwd.errors.confirm_password}</FormFeedback>
                                              ) : null}
                                          </FormGroup>
                                      </Col>
                                      <Col xl={1} md={2} sm={2} style={{ marginTop: '27px' }}>
                                          <button onClick={() => setShow2(!show2)} className="btn btn-light " type="button">
                                                  <i className={show2 ? "mdi mdi-eye-outline" : "mdi mdi-eye-off"}></i></button>
                                          </Col>
                                      </Row>
                                      <br/>
                                  <Row>
                                      <Col xl={9} md={7} sm={5}>
                                      </Col>
                                      <Col xl={3} md={5}  sm={7}>
                                          <Button type="submit" color="danger" style={{ marginLeft: '10px' }} onClick={handleCloseModal} >Cancel</Button>
                                                      <Button
                                                          type="submit"
                                                          color="success"
                                                          className="ms-2"
                                                          disabled={loading}
                                                         
                                                      >
                                                          {loading ? (
                                                              <>
                                                                  <LoadingOutlined style={{ marginRight: '0.5rem' }} />
                                                                  Loading... </>
                                                          ) : ('Change Password')}
                                                      </Button>
                                      </Col>

                                  </Row>
                              </Form>
                              </Col>
                              </Row>
                              <br />
                              <br />

                          </Modal>
                      }


                  </CardBody>
              </Card>
          </Container>
      </div>
  </React.Fragment>

);
};


export default UserProfile