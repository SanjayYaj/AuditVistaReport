import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useMemo,useState } from 'react';
import { Link } from 'react-router-dom';
import TableContainer from '../../../../common/TableContainer';
import { Row, Col, Container, Card, CardBody } from 'reactstrap';

const propTypes = {};

const defaultProps = {};

const LocationOwner = (props) => {

    const [selectedRole,setSelectedRole] = useState(null)

    useEffect(() => {
        console.log(props.locationData, 'locationinfo')
        if(props.locationData["user_permission_acpln"] !== undefined){
            var selectAssignedRole = _.filter(props.locationData["user_permission_acpln"],{user_id : props.roleUser._id})
            console.log(selectAssignedRole,'selectAssignedRole')
            setSelectedRole(selectAssignedRole.length > 0 ? selectAssignedRole[0] : null)
        }


    }, [])


    const changeRole=(event,item)=>{
        console.log(event,'event',item,props.locationData,props.roleUser)
        if(props.locationData["user_permission_acpln"] === undefined){
            console.log("name added")
        var userInfo =[]
        item["user_id"] = props.roleUser._id
        item["name"] = props.roleUser.firstname
        userInfo.push(item)
        setSelectedRole(item)
        props.locationData["user_permission_acpln"] =userInfo
        }
        else{
            var getIdx = _.findIndex(props.locationData["user_permission_acpln"],{user_id : props.roleUser._id})
            var dupItem ={...item}
            dupItem={
                ...dupItem,
                user_id : props.roleUser._id,
                name : props.roleUser.firstname
            }
            console.log(getIdx,'getIdx',dupItem)
            if (getIdx === -1) {
                props.locationData["user_permission_acpln"].push(dupItem)
            }
            else{
                props.locationData["user_permission_acpln"][getIdx]=dupItem
            }

            setSelectedRole(item)
        }
        console.log(props.locationData,'props.locationData')
        props.updateLocationData(props.locationData)

    }

    const columns = useMemo(() => [
        {
            accessor: "Choose",
            Header: "Assign User as",
            // sort: true,
            Cell: (cellProps) => {
                var item = cellProps.row.original
                return (
                    <>
                        <div className="d-flex " style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className=" font-size-14 ">
                                <input type={"radio"} checked={selectedRole?.id === item.id ? true : false}  onChange={(e)=>{changeRole(e,item)}}/>
                            </div>
                        </div>
                    </>
                )

            }
        },
        {
            accessor: "menu",
            Header: "Role Name",
            Cell: (cellProps) => {
                var item = cellProps.row.original
                var index = cellProps.row.index
                return (
                    <>
                        <div className="d-flex " style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className=" font-size-14 ">
                                {item.role_name}

                            </div>
                        </div>
                    </>
                )
            }
            ,
        },
    ], [selectedRole])


    const removeUser =()=>{
        console.log(props.locationData,props.roleUser,'userinfo')
        var filteredData = _.reject(props.locationData.user_permission_acpln, { user_id: props.roleUser._id })
        props.locationData["user_permission_acpln"]=filteredData
        props.updateLocationData(props.locationData)
        setSelectedRole(null)

    }


    return (<div>
        <React.Fragment>
            <Container fluid>
               
                      
                        {
                            selectedRole &&
                            <div className='text-end'>
                                <button className="btn btn-sm btn-outline-primary " onClick={() => removeUser()}> Remove Assigned Role </button>
                            </div>
                        }
                        <Row >
                            <Col lg="12">
                                    <TableContainer
                                        columns={columns}
                                        data={props.config_data.action_plan_roles}
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
                            </Col>
                        </Row>
                    
            </Container>
        </React.Fragment>

    </div>);
}

LocationOwner.propTypes = propTypes;
LocationOwner.defaultProps = defaultProps;
// #endregion

export default LocationOwner;