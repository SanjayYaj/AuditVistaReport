import React, { useState, useEffect } from 'react'
import { Col, Form, Row, Card } from "reactstrap"
import Dropzone from "react-dropzone"
import MediaPreview from "./media_preview"
import _ from 'lodash';
import urlSocket from '../../../../helpers/urlSocket'

const CRUD_Documents = (props) => {
  const [attachDocuments, setAttachDocuments] = useState([])
  const [docfileStatus, setDocFileStatus] = useState("clear")
  const [docWarningEnabled, setDocWarningEnabled] = useState(false)
  const [docWarningMessage, setDocWarningMessage] = useState("")
  const [docUploading, setDocUploading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem('authUser')))

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }




  const handleDocumentAcceptedFiles = async (files) => {
    setDocUploading(true);
    setDocFileStatus('clear');
    setDocWarningEnabled(false);

    files.forEach((file) => {
      if (file.size > 5120000) {
        setDocFileStatus('exceed');
      } else {
        const preview = URL.createObjectURL(file);
        Object.assign(file, {
          preview,
          formattedSize: formatBytes(file.size),
          uploading: true,
          filetype: file.type,
          originalName: file.name,
          uploadingStatus: 'Uploading',
        });
      }
    });

    const getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
      is_selected: true,
    });

    if(getOptionIndex !==-1){
      if(!props.selectedCheckpoint.rule[getOptionIndex].documents){
        props.selectedCheckpoint.rule[getOptionIndex].documents=[]
      }
    }

    if (
      docfileStatus !== 'exceed' &&
      props.selectedCheckpoint.rule[getOptionIndex].documents?.length + files.length <= 10
    ) {
      const updatedAttachDocuments = [...attachDocuments, ...files];
      setAttachDocuments(updatedAttachDocuments);

      const formData = new FormData();
      updatedAttachDocuments.forEach((file) => {
        props.selectedCheckpoint.rule[getOptionIndex].documents.push(file);
        formData.append('folder', props.folderPath)
        // formData.append('folder', `${authUser.client_info[0].s3_folder_path}${props.endpointData.audit_name}/${props.endpointData.loc_name}/`);
        formData.append('imagesArray', file);
      });

      try {
        const response = await urlSocket.post('storeImage/awswebupload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.loaded === progressEvent.total) {
              // Handle progress if needed
            }
          },
        });

        if (response.data.response_code === 500) {
          setAttachDocuments([]);

          _.each(response.data.data, (item) => {
            _.each(props.selectedCheckpoint.rule[getOptionIndex].documents, (child) => {
              if (child.name === files[0].originalName) {
                const splitString = item.key.split('/');
                const getFileName = splitString[splitString.length - 1];
                child.uploading = false;
                child.uploadingStatus = 'Uploaded';
                child.preview = props.imagePreviewUrl + getFileName;
                child.originalname = response.data.data[0].originalname;
                child.originalName = response.data.data[0].originalname;
              }
            });
          });

          setDocUploading(false);
          setRefresh(true);
          props.selectedCheckpoint.cp_documents = props.selectedCheckpoint.rule[getOptionIndex].documents;
          updateCheckpointDocuments(props.selectedCheckpoint.cp_documents, props.selectedCheckpoint);
        } else {
          _.each(props.selectedCheckpoint.cp_documents, (child) => {
            child.uploading = false;
            child.uploadingStatus = 'Not Uploaded';
          });
          setDocUploading(false);
          setRefresh(true);
        }
      } catch (error) {
        console.log('error', error);
      }
    } else {
      if (docfileStatus === 'exceed') {
        setDocWarningEnabled(true);
        setDocWarningMessage('One of selected file size is exceed more than 5mb');
      } else {
        setDocWarningEnabled(true);
        setDocWarningMessage('Maximum Number of files is 5');
      }
    }
  };



  const updateCheckpointDocuments = (data, item) => {
    item["cp_documents"] = data
    props.saveCheckpoint(item)
  }

  const deleteDocuments = (item,idx) => {
    const getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
      is_selected: true,
    })

    // const getIndex = _.findIndex(props.selectedCheckpoint.cp_documents, { originalName: item.originalName })

    props.selectedCheckpoint.rule[getOptionIndex].documents.splice(idx, 1)
    props.selectedCheckpoint.cp_documents =props.selectedCheckpoint.rule[getOptionIndex].documents
    updateCheckpointDocuments(props.selectedCheckpoint.cp_documents, props.selectedCheckpoint)

    setDocFileStatus("clear")
    setDocWarningEnabled(false)
    setRefresh(true)
  }

  const selectedOption = props.selected_option;
  const getOptionIndex = _.findIndex(props.selectedCheckpoint.rule, {
    is_selected: true,
  })

  return (
    <div>
      {
        props.audit_status !== "3" && props.audit_status !== "4" && props.selectedCheckpoint.rule[getOptionIndex].documents?.length !== props.selectedCheckpoint.cp_noof_documents ?
          <div>
            <label>Add Documents</label>
            <Row>
              {
                _.filter(props.selectedCheckpoint.rule, { is_selected: true }).length !== 0 ?
                  _.filter(props.selectedCheckpoint.rule, { is_selected: true })[0].document_info?.map((item, idx) => {
                    return (
                      <Col className="col-auto" key={"doc" + String(idx)}>
                        <label className="badge badge-soft-primary font-size-12">{item}</label>
                      </Col>)
                  }) : null
              }
            </Row>
            <Card style={{ border: '1px dashed lightgrey' }}>
              <div style={{ zoom: 0.7 }}>
                <Form>
                  <Dropzone onDrop={acceptedFiles => handleDocumentAcceptedFiles(acceptedFiles)} accept={[".jpg", ".jpeg", ".png",'.doc', ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf"]}>
                    {({ getRootProps, getInputProps }) => (
                      <div className="dropzone">
                        <div className="dz-message needsclick" {...getRootProps()}>
                          <input {...getInputProps()} />
                          <div className="mb-3">
                            <i className="display-4 text-muted bx bxs-cloud-upload" />
                          </div>
                          <h4>Drop Documents here or click to upload.</h4>
                          <div className="mt-2 font-size-13 text-dark text-center">
                            <label className='me-2'>Files accepted - .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf .jpg, .jpeg, .png</label>
                            <label className='me-2'>Maximum individual file size - 5mb</label>
                            <label className='me-2'>Minimum Number of files - {selectedOption.document_info?.length}</label>
                            <label className='me-2'>Maximum upto 10 files</label>
                          </div>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                </Form>
              </div>
            </Card>
          </div> 
          :
           props.audit_status !== "3" && props.audit_status !== "4" && props.selectedCheckpoint.cp_noof_documents !== 0 ?
            <div style={{ padding: 10 }}><label style={{ fontSize: 12, color: "#ff6666" }}>You have reached the maximum requirement. If you want to upload a document, delete one of the uploaded documents and upload the document again.</label></div> : null
      }
      {
        docWarningEnabled ? <Row>
          <div className="my-2 font-size-12 text-danger">{docWarningMessage}</div>
        </Row> : null
      }
      <Row>
        <Col sm={"12"} lg={"12"}>
          <Row
            className="dropzone-previews"
            id="file-previews"
          >
            {props.selectedCheckpoint.rule[getOptionIndex].documents?.length !== 0 && props.selectedCheckpoint.rule[getOptionIndex].documents?.map((f, i) => {
              return (
                <Col lg={"12"} key={i + "doc-file"}>
                  <Card
                    className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                  >
                    <div className="p-2 w-100" key={"media" + i}>
                      <MediaPreview
                        f={f}
                        index={i}
                        deletedocuments={(index) => { deleteDocuments(f,i) }}
                        audit_status={props.audit_status}
                        imagePreviewUrl={
                          `${props.imagePreviewUrl}${props.folderPath}/`
                          // `${props.imagePreviewUrl}${authUser.client_info[0].s3_folder_path}${props.endpointData.audit_name}/${props.endpointData.loc_name}/`
                        }
                      />
                    </div>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default CRUD_Documents