import React from 'react';
import PropTypes from 'prop-types';
import { useEffect,useState,useMemo } from 'react';
import urlSocket from '../../../../helpers/urlSocket';
import { Popconfirm } from 'antd'
import {Link} from 'react-router-dom'
import {
    Row, Col, FormGroup, Button, Card, CardBody, Container, Alert, Label, Form, Progress,
    Input,
} from "reactstrap";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import TableContainer from '../../../../common/TableContainer';
const propTypes = {};

const defaultProps = {};


const CrudManualCategory = React.forwardRef((props,ref) => {

    const [user_level,setUserLvl] = useState([])
    const [locationData,setlocationData] = useState({})
    const [dbInfo,setdbInfo] = useState({})
    const [cat_name_exist,setcat_name_exist] = useState(false)
    const [edit,setEdit] = useState(false)
    const [edit_category,setedit_category] = useState({})
    // submitData = submitData.bind()

    useEffect(() => {
    console.log("crudManualCategory",props)
    var data = JSON.parse(sessionStorage.getItem('authUser'))
    var db_info = JSON.parse(sessionStorage.getItem('db_info'))
    setdbInfo(db_info)
    retriveExistCategory(props.locationData,db_info)
    setlocationData(props.locationData)

    }, [])

    const retriveExistCategory = (locationInfo,db_info) => {
        
        try {
            urlSocket.post("cog/retrive-categories",{
                encrypted_db_url: db_info.encrypted_db_url,
                location_id : locationInfo._id,
                manual_location : true
            }).then((response)=>{
                console.log(response,'response')
                if (response.data.response_code == 500) {
                    var user_level = response.data.data[0].user_level
                    setUserLvl(user_level)


                }
            })    
        } catch (error) {
            
        }
    }

    const updateCategory = (event, item, mode, index) => {
        console.log(event, item, mode, index, 'event,item,mode,index', locationData, dbInfo)
        // event,item,mode,index
        if(mode == "2"){
        var temp_user_level = []
        user_level.map((data, position) => {
            if (position !== index) {
                temp_user_level.push(data)
            }
        })
        locationData["user_level"] = temp_user_level
        console.log(locationData,'locationData')
        reusableCrudApi(dbInfo, locationData)

        }
        if(mode === "1"){
            setedit_category(item)
            setEdit(true)
        }


    }




    const columns = useMemo(() =>[
        {
            accessor: "user_lvl_name",
            Header: "Category Name",
            // sort: true,
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return(
                    <>
                    <div className="d-flex " style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className=" font-size-14 ">
                        {item.user_lvl_name}
                    </div>
                </div>  
                </>  
                )

            }
        },
        {
            accessor: "menu",
            Header: "Action",
            Cell: (cellProps) => {
                var item = cellProps.row.original
                var index = cellProps.row.index
                return(
                item.cat_type == "1" || item.cat_type =="2"?
                 
                <>
                
                
                </>
                :
                <div className="d-flex gap-3" style={{ display: 'flex', alignContent: 'center' }}>
                      <Link className="text-primary" to="#"><i className="mdi mdi-pencil font-size-18"
                       onClick={(e)=>{updateCategory(e,item,"1",index)}} 
                       />{" "}</Link>
                  

                        <Link className="text-danger" to="#"><i className="mdi mdi-delete font-size-18" 
                        onClick={(e) => { updateCategory(e, item, "2",index) }} 
                        />{" "}</Link>

                    {/* </Popconfirm> */}
                </div>
            )},
        },
    ] , [user_level])



    const  validateCatName=(event)=>{
        console.log(event.target.value)
        if(edit === false){
            console.log("validate starts")
            var validate_category_name = _.filter(user_level, item => {
                console.log(item,'item')
                const cleanedHierarchyName = item.user_lvl_name?.replace(/\s/g, '').toLowerCase();
                const cleanedEventValue = event.target.value?.replace(/\s/g, '').toLowerCase();
                return cleanedHierarchyName === cleanedEventValue;
            });
            console.log(validate_category_name,'validate_category_name')
            if(validate_category_name.length >0){
                setcat_name_exist(true)
            }
            else{
                setcat_name_exist(false)
            }
        }
        if(edit === true){
            console.log("validate starts")
            var validate_category_name = _.filter(user_level, item => {
                console.log(item,'item')
                const cleanedHierarchyName = item.user_lvl_name?.replace(/\s/g, '').toLowerCase();
                const cleanedEventValue = event.target.value?.replace(/\s/g, '').toLowerCase();
                return cleanedHierarchyName === cleanedEventValue;
            });
            console.log(validate_category_name,'validate_category_name')
            if(validate_category_name.length >0){
                setcat_name_exist(true)
            }
            else{
                setcat_name_exist(false)
            }
        }


       
    }

    const reusableCrudApi =(dbInfo,locationData)=>{
        console.log(dbInfo,locationData,'dbInfo,locationData')
        try {
            urlSocket.post('cog/crud-category', {
                confiGuration: {
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    hirerachyUserlvl: locationData,
                    _id: locationData._id,
                    manual_location : true
                }

            }).then((response)=>{
                console.log(response,'response')
                if(response.data.response_code === 500){
                    setEdit(false)
                    retriveExistCategory()
                    props.onClose()
                }
            })
            
        } catch (error) {
            console.log(error,'error')
        }
    }




    const submitData=(event, value)=> {
        console.log(event,value,locationData)
        if(cat_name_exist === false){
        if(edit === false){
            const maxCatType = Math.max(...user_level.map((item) => parseInt(item.cat_type, 10)));
            console.log(maxCatType, 'maxCatType')
            value['cat_type'] = String(maxCatType + 1)
            locationData.user_level.push(value)
            console.log(locationData)

        }
        else{
            var findHierarchyIdx = _.findIndex(locationData.user_level, { "cat_type": edit_category.cat_type })
            locationData.user_level[findHierarchyIdx].user_lvl_name = value.user_lvl_name
            console.log(locationData,'loc')
            locationData.user_path.map((ele,idx)=>{
                if (ele.cat_type === edit_category.cat_type) {
                    ele["user_lvl_name"]=value.user_lvl_name
                }
            })
            if(locationData.unique_users !== undefined){
                locationData.unique_users.map((data1, index2) => {
                    if (data1.cat_type.includes(edit_category.cat_type)) {
                        const indexOfValue = data1.cat_type.indexOf(edit_category.cat_type);
                        console.log(indexOfValue,'indexOfValue')
                        data1["user_lvl_name"][indexOfValue] = value.user_lvl_name
                        console.log("tru", indexOfValue)
                    }
                })
            }

            // console.log(this.state.configureData, this.state.edit_category, findHierarchyIdx,this.props.nodeInfo) 
        }

        try {
            urlSocket.post('cog/crud-category', {
                confiGuration: {
                    encrypted_db_url: dbInfo.encrypted_db_url,
                    hirerachyUserlvl: locationData,
                    _id: locationData._id,
                    manual_location : true
                }

            }).then((response)=>{
                console.log(response,'response')
                if(response.data.response_code === 500){
                    setEdit(false)
                    retriveExistCategory()
                    props.onClose()

                }
            })
            
        } catch (error) {
            
        }


    }

    }

    React.useImperativeHandle(ref, () => ({
        retriveExistCategory,
        reusableCrudApi
      }));



    return (
        <React.Fragment>
        <Container fluid>
            <Card className="overflow-hidden">
                <CardBody className="pt-0">
                    <Row >
                        <Col >
                            <div className="p-2 mb-3">
                                
                                    <Row className="my-4">
                                        <div className="d-sm-flex align-items-center justify-content-between">
                                            <div className="text-danger font-size-18">Category Information</div>
                                            <button className="btn btn-outline-dark " onClick={() => props.onClose()}> Close </button>
                                        </div>
                                        <hr className="my-4" />
                                    </Row>
                                    <AvForm className="form-horizontal"
                                   onValidSubmit={(event,value)=>{submitData(event,value)}}
                                 >
                                    <div className="mb-3">
                                        <AvField
                                            name="user_lvl_name"
                                            label="Category"
                                            type="text"
                                            value={edit_category.user_lvl_name}
                                            onChange={(e)=>{validateCatName(e)}}
                                            required
                                            placeholder="Enter Category Name"
                                        />
                                        {
                                            cat_name_exist &&
                                            <div className='text-danger' style={{ fontSize: 'smaller' }}>Category Name already Exist.</div>
                                        }
                                    </div>
                                    <button
                                         className={edit ? "btn btn-primary btn-block m-1" : "btn btn-success btn-block m-1"}
                                        type="submit"
                                        disabled={cat_name_exist}
                                    >
                                        {edit ? "Update" : "Create"}
                                    </button>

                                </AvForm>
                            </div>
                        </Col>
                    </Row>
                    <Row >
                        <Col lg="12">
                        <div className="p-2">
                                <TableContainer
                                    columns={columns}
                                    data={user_level}
                                    isGlobalFilter={true}
                                    isAddOptions={false}
                                    isJobListGlobalFilter={false}
                                    customPageSize={10}
                                    style={{ width: '100%' }}
                                 
                                    isPagination={true}
                                    filterable={false}
                                    btnName={"Add User"}
                                    tableClass="align-middle table-nowrap table-check"
                                    theadClass="table-light"
                                    pagination="pagination pagination-rounded justify-content-end mb-2"

                                />


                            </div>
                        </Col>
                    </Row>
                </CardBody>


            </Card>
        </Container>
    </React.Fragment>
    );
})
CrudManualCategory.displayName = 'CrudManualCategory';
CrudManualCategory.propTypes = propTypes;
CrudManualCategory.defaultProps = defaultProps;
// #endregion

export default CrudManualCategory;