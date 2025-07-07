import React from 'react';
import PropTypes from 'prop-types';
import {
    Row, Col, FormGroup, Button, Card, CardBody, Container, Alert, Label, Form, Progress,
    Modal,
    ModalHeader,
    ModalBody,
    Input,
} from "reactstrap";
import TableContainer from '../../../../common/TableContainer';
// import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
// import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit"
// import BootstrapTable from "react-bootstrap-table-next"
import _ from 'lodash'
// #region constants

// #endregion

// #region styled-components

// #endregion

// #region functions

// #endregion

// #region component
const propTypes = {};

const defaultProps = {};

/**
 * 
 */
class ImportUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addedUsers:[],
            userInfo:[],
            empt_usr_err:false
        };
    }

    componentDidMount() {
        console.log("import user",this.props.rowData)
        this.setState({
            userInfo: this.props.user_data,
            dataloaded: true
        })
    }

    selectedUsers = (row, isSelect, rowIndex) => {
        console.log(row, isSelect, rowIndex, 'row,isSelect,rowIndex')
        var userPath_userInfo = {
            title: this.props.rowData.hlevel_name,
            designation: row.designation,
            name: row.firstname,
            type: 2,
            user_id: row._id,
            _id: row._id,
            cat_type: this.props.coloumn_type,
            hirerachy_name: this.props.coloumn_type == "1" ? "Auditor" : "Reviewer",
        }
        var unique_users_userInfo = {
            title: this.props.rowData.hlevel_name,
            designation: row.designation,
            name: row.firstname,
            type: 2,
            user_id: row._id,
            _id: row._id,
            cat_type: [this.props.coloumn_type],
            hirerachy_name: this.props.coloumn_type == "1" ? ["Auditor"] : ["Reviewer"],
        }
        console.log(userPath_userInfo, 'userInfo')
        if (isSelect === true) {
            this.props.rowData.user_path.push(userPath_userInfo)
            if (this.props.rowData.unique_users === undefined) {
                this.props.rowData["unique_users"] = []
                this.props.rowData.unique_users.push(unique_users_userInfo)
            }
            else {
                this.props.rowData.unique_users.push(unique_users_userInfo)
            }
            this.setState({addedUsers : [userPath_userInfo] , empt_usr_err : false})
        }
        else {
            console.log("remove user")
            var filtered_uncheck_user_path = _.filter(this.props.rowData.user_path, user => user._id !== row._id);
            var filtered_uncheck_unique_users = _.filter(this.props.rowData.unique_users, user => user._id !== row._id);

            this.props.rowData["user_path"] = filtered_uncheck_user_path
            this.props.rowData["unique_users"] = filtered_uncheck_unique_users
            console.log(filtered_uncheck_user_path, 'filtered_uncheck_user')
            this.setState({addedUsers : filtered_uncheck_user_path})
        }
        console.log(this.props.rowData, 'this.props.rowData')

    }

    selectAllUsers=(row, isSelect, event)=>{
        console.log(this.props.rowData, isSelect)
        if(isSelect === false){
            var filtered_user_path =_.differenceBy(this.props.rowData.user_path, row, '_id');
            var filtered_unique_users =_.differenceBy(this.props.rowData.unique_users, row, '_id');
           
            console.log(filtered_user_path,'filtered_users')
            this.props.rowData["user_path"]=filtered_user_path
            this.props.rowData["unique_users"]=filtered_unique_users
        }
        else if(isSelect === true){
            row.map((data,idx)=>{
                var user_path_info ={
                    title: this.props.rowData.hlevel_name,
                    designation: data.designation,
                    name: data.firstname,
                    type: 2,
                    user_id: data._id,
                    _id: data._id,
                    cat_type: this.props.coloumn_type,
                    hirerachy_name: this.props.coloumn_type == "1" ? "Auditor" : "Reviewer",
                }
                var unique_users_userInfo = {
                    title: this.props.rowData.hlevel_name,
                    designation: data.designation,
                    name: data.firstname,
                    type: 2,
                    user_id: data._id,
                    _id: data._id,
                    cat_type: [this.props.coloumn_type],
                    hirerachy_name: this.props.coloumn_type == "1" ? ["Auditor"] : ["Reviewer"],
                }
                this.props.rowData["user_path"].push(user_path_info)
                this.props.rowData["unique_users"].push(unique_users_userInfo) 
            })

        }
    }




    addSelectedUsers=(event)=>{
        console.log(event,this.props.rowData,this.props.hstructure,this.state.addedUsers)
        if(this.state.addedUsers.length >0){
            console.log("Api call can be done")
            this.props.updateInFlatCln(this.props.rowData,this.props.hstructure)
        }
        else{
            this.setState({
                empt_usr_err : true
            })
        }




    }


    render() {
        console.log(this.props,'this.props')
        if (this.state.dataloaded) {
            // const { SearchBar } = Search;
            const options = {
                // pageStartIndex: 0,

                sizePerPage: 7,
                totalSize: this.state.userInfo.length, // replace later with size(users),
                custom: true,
            };
            const columns = [
                {
                    Header: ({ rows }) => <div className="form-check font-size-16" >
                        <input className="form-check-input" onChange={() => {
                            // Determine if all rows are currently selected
                            const allSelected = rows.every((row) => row.original.selected);
                            console.log(allSelected,'allSelected',rows)
                            // Update the selection for each row
                            rows.forEach((row) => {
                                row.original.selected = !allSelected;
                            }); this.selectAllUsers(this.state.userInfo, !allSelected,)
                        }} type="checkbox" checked={rows.length > 0 && rows.every((row) => row.original.selected)} id="checkAll" />
                        <label className="form-check-label" htmlFor="checkAll"></label>
                    </div>,
                    accessor: '#',
                    width: '20px',
                    filterable: true,
                    Cell: ({ row }) => (
                        <div className="form-check font-size-16" >
                            <input className="form-check-input" checked={row.original.selected} type="checkbox" onChange={(e) => { row.original.selected = !row.original.selected; this.selectedUsers(row.original,row.original.selected,row.index) }} id="checkAll" />
                            <label className="form-check-label" htmlFor="checkAll"></label>
                        </div>
                    )
                },
                // {
                //     text: "id",
                //     dataField: "_id",
                //     sort: true,
                //     hidden: true,
                //     formatter: (cellContent, item) => (
                //         <>
                //             {item._id}
                //         </>
                //     ),
                // },
                {
                    accessor: 'firstname',
                    Header: 'Name',
                    // sort: true,
                    Cell: (cellProps) => {
                        var item = cellProps.row.original
                        return (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className=" font-size-14 text-dark" style={{ marginBottom: 5 }}>
                                        {item.firstname}
                                    </div>
                                </div>
                            </>
                        )
                    }
                },
                {
                    accessor: 'email_id',
                    Header: 'Email Id',
                    // sort: true,
                    Cell: (cellProps) => {
                        var item = cellProps.row.original
                        return (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className=" font-size-14 text-dark" style={{ marginBottom: 5 }}>
                                        {item.email_id}
                                    </div>
                                </div>
                            </>
                        )
                    }
                },
                {
                    accessor: 'email_ids',
                    Header: 'Assgin to',
                    // sort: true,
                    Cell: (cellProps) => {
                        var item = cellProps.row.original

                        return (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className=" font-size-14 text-dark" style={{ marginBottom: 5 }}>
                                        {/* {item.email_id} */}
                                        {
                                            this.props.coloumn_type == "2" ?
                                            "Reviewer"
                                            :
                                            "Auditor"
                                        }
                                    </div>
                                </div>
                            </>
                        )
                    }
                },
            ]
            const selectRow = {
                mode: 'checkbox',
                clickToSelect: true,
                onSelect: (row, isSelect, rowIndex, e) => {
                    console.log(row,isSelect,rowIndex)
                    this.selectedUsers(row,isSelect,rowIndex)
                },
                onSelectAll: (isSelect, rows, e) => {
                    console.log(rows,isSelect,e)
                    this.selectAllUsers(rows,isSelect,e)
                },
            }
            
            return (
                <React.Fragment>
                    <Container fluid>
                        <Row >
                            <Col>

                                <Card style={{ overflow: 'auto' }}>
                                    <CardBody>
                                        <TableContainer
                                            columns={columns}
                                            data={this.state.userInfo}
                                            isGlobalFilter={true}
                                            isAddOptions={false}
                                            isJobListGlobalFilter={false}
                                            customPageSize={10}
                                            style={{ width: '100%' }}
                                            // dynamicBtn={true}
                                            // btnClick={(param1, param2) => this.navigateTo("", 1)}
                                            iscustomPageSizeOptions={true}
                                            // dynamicParams={params1,params2}
                                            isPagination={true}
                                            filterable={false}
                                            // btnName={"Add User"}
                                            tableClass="align-middle table-nowrap table-check"
                                            theadClass="table-light"
                                            pagination="pagination pagination-rounded justify-content-end mb-2"
                                        />
                                    </CardBody>
                                </Card>
                              


                                {/* <Button color="primary" onClick={(e) => { this.addSelectedUsers(e) }} > Add Selected Users</Button> */}
                                {/* {
                            this.state.empt_usr_err &&
                            <div className='text-danger mt-2' style={{ fontSize: 'smaller' }}>Please select the users, no user have been selected.</div>
                        } */}
                            </Col>
                        </Row>
                        <footer
                            style={{
                                display: 'flex',
                                alignItems: "center",
                                height: 50,
                                background: "#fff",
                                width: "100%",
                                position: "fixed",
                                bottom: 0,
                                zIndex: 9998,
                                borderTop: "1px solid #dedede"
                            }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                                <Button color="primary"  className='btn btn-sm' onClick={(e) => { this.addSelectedUsers(e) }} > Add Selected Users</Button>
                                {
                                    this.state.empt_usr_err &&
                                    <div className='text-danger mt-2' style={{ fontSize: 'smaller' }}>Please select the users, no user have been selected.</div>
                                }
                            </div>
                        </footer>
                    </Container>
                </React.Fragment>

            );
        }
        else {
            return null
        }
    }

}

ImportUser.propTypes = propTypes;
ImportUser.defaultProps = defaultProps;

export default ImportUser;