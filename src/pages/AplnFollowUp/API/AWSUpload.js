import urlSocket from "../../../helpers/urlSocket";

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


// Function 6 - For Image upload to the aws
const uploadImageToAws = (file) => {
    const enhancedFile = {
        "preview": URL.createObjectURL(file),
        "formattedSize": formatBytes(file.size),
        "uploading": false,
        "filetype": file.type,
        "uploadingStatus": 'Not uploaded',
        "originalName": file.name,
        "captured_on": new Date(),
        "path": file.name,
    };

    const formData = new FormData();

    Object.keys(enhancedFile).forEach(key => {
        formData.append(key, enhancedFile[key]);
    });

    formData.append('image', file);


    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };
    return new Promise((resolve, reject) => {
        try {
            urlSocket.post("task/uploads-aws", formData, config, {
                onUploadProgress: (progressEvent) => {
                
                    if (progressEvent.loaded === progressEvent.total) {
                        //this.progress.current++
                    }
                },
            }).then(response => {
                resolve(response.data.data[0].originalname)

            })
                .catch(error => {
                    console.log("error", error)
                    reject(error)

                })

        } catch (error) {
            console.log("error", error)

        }
    })


}



// Function 7 - For docs upload to the aws
const uploaddocsToAws = (file) => {

    const formData = new FormData();
    formData.append("document", file);

    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };
    return new Promise((resolve, reject) => {
        try {
            urlSocket.post("task/uploads-aws", formData, config, {
            }).then(response => {
                resolve(response.data.data[0].originalname)
            })
                .catch(error => {
                    console.log("error", error)
                    reject(error)

                })

        } catch (error) {
            console.log("error", error)

        }
    }
    )

};

// Function 8 - For audio upload to the aws

const uploadAudioToAws = (file) => {
    const formData = new FormData();
    formData.append("audio", file);


    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };
    return new Promise((resolve, reject) => {
        try {
            urlSocket.post("task/uploads-aws", formData, config, {
            }).then(response => {
                resolve(response.data.data[0].originalname)
            })
                .catch(error => {
                    console.log("error", error)
                    reject(error)

                })

        } catch (error) {
            console.log("error", error)

        }
    }
    )


}




// Function 9 - For video upload to the aws

const uploadVideoToAws = (file) => {
    const formData = new FormData();
    formData.append("video", file);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };
    return new Promise((resolve, reject) => {
        try {
            urlSocket.post("task/uploads-aws", formData, config, {
            }).then(response => {
                resolve(response.data.data[0].originalname)
            })
                .catch(error => {
                    console.log("error", error)
                    reject(error)

                })

        } catch (error) {
            console.log("error", error)

        }
    }
    )

}

// Function 10 - For RecordedAudio upload to the aws

const uploadRecordedAudioToAws = (file) => {


    const formData = new FormData();
    formData.append("video", file.blob);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };
    return new Promise((resolve, reject) => {
        try {
            urlSocket.post("task/uploads-aws", formData, config, {
            }).then(response => {
                resolve(response.data.data[0].originalname)
            })
                .catch(error => {
                    console.log("error", error)
                    reject(error)

                })

        } catch (error) {
            console.log("error", error)

        }
    }
    )

}


// Function 11 - For CapturedImage upload to the aws

const uploadcapturedimageToAws = (file) => {


    const formData = new FormData();
    formData.append("video", file);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };
    return new Promise((resolve, reject) => {
        try {
            urlSocket.post("task/uploads-aws", formData, config, {
            }).then(response => {
                resolve(response.data.data[0].originalname)
            })
                .catch(error => {
                    console.log("error", error)
                    reject(error)

                })

        } catch (error) {
            console.log("error", error)

        }
    }
    )

}


// Function 12 - For CapturedVideo upload to the aws

const uploadcapturedvideoToAws = (file) => {


    const formData = new FormData();
    formData.append("video", file);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };
    return new Promise((resolve, reject) => {
        try {
            urlSocket.post("task/uploads-aws", formData, config, {
            }).then(response => {
                resolve(response.data.data[0].originalname)
            })
                .catch(error => {
                    console.log("error", error)
                    reject(error)

                })

        } catch (error) {
            console.log("error", error)

        }
    }
    )

}

export {
    uploadImageToAws,
    uploaddocsToAws,
    uploadAudioToAws,
    uploadVideoToAws,
    uploadRecordedAudioToAws,
    uploadcapturedimageToAws,
    uploadcapturedvideoToAws,
};
