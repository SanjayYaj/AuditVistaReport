import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from 'react-dom';
import {
    Row, Col, FormGroup, Button, Card, CardBody, Container, Alert, Label, Form, Progress,
    Input,
} from "reactstrap";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import TableContainer from "../../../../common/TableContainer";
import 'react-tagsinput/react-tagsinput.css'
import urlSocket from "../../../../helpers/urlSocket";
const _ = require('lodash')

const LoodEndpointNode = (props) => {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedEOPT, setSelectedEOPT] = useState([]);
    const [dup_selectedEOPT, setDupSelectedEOPT] = useState([]);
    const [all_selectedEOPT, setAllSelectedEOPT] = useState([]);
    const [selected_id, setSelectedId] = useState([]);
    const [validateErr, setValidateErr] = useState(false);
    const [db_info, setDbInfo] = useState(null);
    const [tableDataloaded, setTableDataloaded] = useState(false);
    const [statusBasedFilteredData, setStatusBasedFilteredData] = useState([]);
    const [labelData, setLabelData] = useState([]);
    const [selectedLabel, setSelectedLabel] = useState(null);
    const [label, setLabel] = useState({ endpoints: [] });

    useEffect(() => {
        const db_info = JSON.parse(sessionStorage.getItem('db_info'));
        setDbInfo(db_info);
        loadEOPTS();
    }, []);

    const loadEOPTS =() => {
        setTableDataloaded(false);
        try {
            urlSocket.post("webEntities/endpointlist", {
                userInfo: {
                    encrypted_db_url: db_info.encrypted_db_url,
                    company_id: props.userInfo.company_id,
                    user_id: props.userInfo._id,
                },
            })
                .then((response) => {
                    setStatusBasedFilteredData(response.data.data);
                    setTableDataloaded(true);
                    setValidateErr(false);
                    setLabel({ endpoints: [] });
                    loadUserLabels();
                });
        } catch (error) {
            console.error(error);
        }
    };

    const loadUserLabels = () => {
        try {
            urlSocket.post("userSettings/getuserlabels", {
                userInfo: {
                    encrypted_db_url: db_info.encrypted_db_url,
                    _id: props.userInfo._id,
                    company_id: props.userInfo.company_id
                }
            })
                .then(response => {
                    console.log(response,'response');
                    setLabelData(response.data.data);
                    setDataLoaded(true);
                });
        } catch (error) {
            console.error("catch error", error);
        }
    };

    const labelSelected = useCallback((data) => {
        if (data.target.value === "all") {
            loadEOPTS();
        } else {
            const mylabel = labelData[data.target.value];
            setTableDataloaded(false);
            setSelectedLabel(mylabel._id);
            setLabel(mylabel);
            setValidateErr(false);

            try {
                urlSocket.post("webEntities/loadlabeleopts", {
                    labelInfo: mylabel,
                    userInfo: {
                        encrypted_db_url: db_info.encrypted_db_url,
                        _id: props.userInfo._id,
                        company_id: props.userInfo.company_id
                    }
                })
                    .then(response => {
                        setStatusBasedFilteredData(response.data.data);
                        setTableDataloaded(true);
                        setSelectedEOPT([]);
                    });
            } catch (error) {
                console.error("catch error", error);
            }
        }
    }, [db_info, labelData, loadEOPTS, props.userInfo]);

    const getSelectedEOPT = useCallback((row) => {
        const getEOPTId = _.map(selectedEOPT, "_id");
        const getIndex = getEOPTId.indexOf(row._id);

        if (getIndex === -1) {
            setSelectedEOPT([...selectedEOPT, row]);
        } else {
            const newSelectedEOPT = [...selectedEOPT];
            newSelectedEOPT.splice(getIndex, 1);
            setSelectedEOPT(newSelectedEOPT);
        }
        setValidateErr(false);
    }, [selectedEOPT]);

    const addEndpoints = useCallback(() => {
        if (selectedEOPT.length > 0) {
            try {
                const loggedUserInfo = {
                    encrypted_db_url: db_info.encrypted_db_url,
                    company_id: props.userInfo.company_id,
                    company_name: props.userInfo.company_name,
                    created_by: props.userInfo._id
                };
                urlSocket.post("webphlbconf/addmultipleendpoints", {
                    userInfo: loggedUserInfo,
                    publishtemplateInfo: props.publishtemplateInfo,
                    endpointInfo: selectedEOPT
                })
                    .then(response => {
                        if (response.data.response_code === 500) {
                            props.onClose();
                        }
                    });
            } catch (error) {
                console.error("catch error", error);
            }
        } else {
            setValidateErr(true);
        }
    }, [db_info, props, selectedEOPT]);

    const handleSelectAll = useCallback((e, mode, rows) => {
        const isChecked = e;
        const data = mode === 1 ? statusBasedFilteredData : rows;
        const selectedRowKeys = isChecked ? data.map(item => item._id) : [];
        setSelectedEOPT(selectedRowKeys);
        setDupSelectedEOPT(isChecked ? data : []);
    }, [statusBasedFilteredData]);

    const select_func = useCallback((isSelect, rows, e, mode) => {
        if (mode === "1" || mode !== "1") {
            let selectedEOPT = [];
            let selected_id = [];

            if (isSelect) {
                selectedEOPT = rows;
                rows.forEach((data) => {
                    selected_id.push(data._id);
                });
            }

            setSelectedEOPT(selectedEOPT);
            setSelectedId(selected_id);
            setValidateErr(false);
        }
    }, []);

    const handleSelectAllCheckbox = useCallback((event) => {
        const isChecked = event.target.checked;
        const rows = statusBasedFilteredData;
        setSelectedEOPT(isChecked ? rows : []);
    }, [statusBasedFilteredData]);
    console.log(dataLoaded,'dataLoaded');
    if (!dataLoaded) {
        return null;
    }

    const columns = [
        {
            Header: (cellProps) => (
                <div className="form-check font-size-12">
                    <input
                        className="form-check-input"
                        onChange={() => {
                            const allSelected = cellProps.page.every((row) => row.original.selected);
                            cellProps.page.forEach((row) => {
                                row.original.selected = !allSelected;
                            });
                            select_func(!allSelected, _.map(cellProps.page, "original"), "e", '1');
                        }}
                        type="checkbox"
                        checked={cellProps.page.length > 0 && cellProps.page.every((row) => row.original.selected)}
                        id="checkAll"
                    />
                    <label className="form-check-label" htmlFor="checkAll"></label>
                </div>
            ),
            accessor: '#',
            width: '20px',
            filterable: true,
            Cell: ({ row }) => (
                <div className="form-check font-size-11">
                    <input
                        className="form-check-input"
                        checked={row.original.selected}
                        type="checkbox"
                        onChange={(e) => { row.original.selected = !row.original.selected; getSelectedEOPT(row.original) }}
                        id="checkAll"
                    />
                    <label className="form-check-label" htmlFor="checkAll"></label>
                </div>
            )
        },
        {
            accessor: 'name',
            Header: 'Name',
            filterable: true,
            formatter: (cellProps) => {
                const item = cellProps.row.original;
                return (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="font-size-11 text-dark">
                                {item.name}
                            </div>
                        </div>
                    </>
                );
            }
        },
        {
            accessor: 'code',
            Header: 'Code'
        },
        {
            accessor: 'category',
            Header: 'Category'
        },
    ];

    const defaultSorted = [{
        dataField: 'created_on',
        order: 'desc'
    }];

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: (row, isSelect, rowIndex, e) => {
            getSelectedEOPT(row, isSelect, rowIndex, e);
        },
        onSelectAll: (isSelect, rows, e) => {
            select_func(isSelect, rows, e, '1');
        },
    };

    return (
        <React.Fragment>
            <Container fluid>
                <Row className="px-2">
                    <Col md={4}>
                        <AvForm className="form-horizontal">
                            <Label className="" htmlFor="autoSizingSelect">Select label</Label>
                            <AvInput
                                type="select"
                                name="hlevel_cat"
                                label="Name"
                                value={null}
                                className="form-select"
                                id="cate"
                                required
                                onChange={(e) => labelSelected(e)}
                            >
                                <option value="" disabled selected>Choose...</option>
                                <option value="all">ALL</option>
                                {labelData.map((data, idx) => (
                                    <option value={idx} key={"lbl" + idx}>{data.label_name}</option>
                                ))}
                            </AvInput>
                        </AvForm>
                    </Col>
                </Row>
{                console.log(tableDataloaded,columns,statusBasedFilteredData,'tableDataloaded')}
                {tableDataloaded && (
                    <Card>
                        <CardBody className="p-2">
                            {validateErr && (
                                <div className="text-danger" style={{ fontSize: 'smaller' }}>Please select any one location.</div>
                            )}
                            <TableContainer
                                columns={columns}
                                data={statusBasedFilteredData}
                                isGlobalFilter={false}
                                isAddOptions={false}
                                isJobListGlobalFilter={false}
                                customPageSize={10}
                                style={{ width: "100%" }}
                                isPagination={true}
                                filterable={false}
                                btnName={"Add User"}
                                tableClass="align-middle table-nowrap table-check"
                                theadClass="table-light"
                                pagination="pagination pagination-rounded justify-content-end mb-2"
                            />
                        </CardBody>
                    </Card>
                )}

                <footer
                    style={{
                        display: "flex",
                        alignItems: "center",
                        height: 50,
                        background: "#fff",
                        width: "100%",
                        position: "fixed",
                        bottom: 0,
                        zIndex: 9998,
                        borderTop: "1px solid #dedede",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            color="primary"
                            className="btn-sm"
                            onClick={addEndpoints}
                        >
                            Add Selected Location
                        </Button>
                    </div>
                </footer>
            </Container>
        </React.Fragment>
    );
};

export default LoodEndpointNode;














// import React, { Component } from "react";
// import ReactDOM from 'react-dom';
// import {
//     Row, Col, FormGroup, Button, Card, CardBody, Container, Alert, Label, Form, Progress,
//     Input,
// } from "reactstrap";
// import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
// import TableContainer from "../../../../common/TableContainer";
// import 'react-tagsinput/react-tagsinput.css'

// import urlSocket from "../../../../helpers/urlSocket";
// const _ = require('lodash')

// export default class LoodEndpointNode extends React.Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             dataLoaded: false,
//             selectedEOPT:[],
//             dup_selectedEOPT:[],
//             all_selectedEOPT:[],
//             selected_id :[],
//             validateErr : false

//         };

//     }


//     async componentDidMount() {
//         var db_info = JSON.parse(sessionStorage.getItem('db_info'))
//         this.setState({db_info},()=>{this.loadEOPTS()})        
//     }

//     loadEOPTS = () => {
//         this.setState({ tableDataloaded: false })
//         try {
//             urlSocket.post("webEntities/endpointlist", {
//                 userInfo: {
//                     encrypted_db_url:this.state.db_info.encrypted_db_url,
//                     company_id: this.props.userInfo.company_id,
//                     user_id: this.props.userInfo._id,
//                 },
//             })
//                 .then((response) => {
//                     this.setState({
//                         statusBasedFilteredData: response.data.data,
//                         tableDataloaded: true,
//                         allowTableRowToSelect: true,
//                         labelDefault: true,
//                         validateErr : false,
//                         label: {
//                             endpoints: []
//                         },


//                     }, function () {
//                         this.loadUserLabels()
//                     })

//                 })
//         } catch (error) {

//         }
//     }


//     loadUserLabels() {
//         try {
//             urlSocket.post("userSettings/getuserlabels", {
//                 userInfo: {
//                     encrypted_db_url: this.state.db_info.encrypted_db_url,
//                     _id: this.props.userInfo._id,
//                     company_id: this.props.userInfo.company_id
//                 }
//             })
//                 .then(response => {
//                     this.setState({
//                         labelData: response.data.data,
//                         dataLoaded: true

//                     })
//                 })

//         } catch (error) {
//             console.log("catch error", error)
//         }
//     }

//     labelSelected(data) {

//         if(data.target.value === "all")
//         {
//             this.loadEOPTS()
//         }
//         else
//         {

//             var mylabel = this.state.labelData[data.target.value]
    
//             this.setState({
//                 tableDataloaded: false, selectedLabel: mylabel._id,
//                 label: mylabel,
//                 validateErr : false
//             })
    
//             try {
    
//                 urlSocket.post("webEntities/loadlabeleopts", {
//                     labelInfo: mylabel,
//                     userInfo: {
//                         encrypted_db_url: this.state.db_info.encrypted_db_url,
//                         _id: this.props.userInfo._id,
//                         company_id: this.props.userInfo.company_id
//                     }
//                 })
//                     .then(response => {
//                         this.setState({
//                             statusBasedFilteredData: response.data.data,
//                             labelDefault: false,
//                             tableDataloaded: true,
//                             selectedEOPT :[]
//                         })
//                     })
    
//             } catch (error) {
//                 console.log("catch error", error)
//             }
    
//         }

//     }

//     getSelectedEOPT = (row, isSelect, rowIndex, e) => {
//         console.log(row,'row')
//         var getEOPTId = _.map(this.state.selectedEOPT, "_id")
//         var getIndex = getEOPTId.indexOf(row._id)

//         if (getIndex === -1) {
//             this.state.selectedEOPT.push(row)

//             this.setState({
//                 selectedEOPT: this.state.selectedEOPT
//             })
//         }
//         else {
//             this.state.selectedEOPT.splice(getIndex, 1)
//             this.setState({
//                 selectedEOPT: this.state.selectedEOPT
//             })
//         }
//         this.setState({
//           validateErr : false, 
//         })


//     }


//     addEndpoints(){
//         console.log(this.state.selectedEOPT,'this.state.selectedEOPT')
//         if(this.state.selectedEOPT.length >0){
//         try {
//             var loggedUserInfo = {
//                 encrypted_db_url: this.state.db_info.encrypted_db_url,
//                 company_id: this.props.userInfo.company_id,
//                 company_name: this.props.userInfo.company_name,
//                 created_by:this.props.userInfo._id
//             }
//             console.log(this.state.selectedEOPT,'this.state.selectedEOPT',this.props.publishtemplateInfo)
//             urlSocket.post("webphlbconf/addmultipleendpoints", {
//                 userInfo: loggedUserInfo,
//                 publishtemplateInfo: this.props.publishtemplateInfo,
//                 endpointInfo: this.state.selectedEOPT
//             })
//             .then(response=>{
//                 console.log(response,'response')
//                 if(response.data.response_code === 500) {
//                         this.props.onClose()
//                 }
//             })
//         } catch (error) {
//             console.log("catch error", error)
//         }
//       }
//       else{
//         this.setState({
//           validateErr : true
//         })

//       }
//     }


//     handleSelectAll = (e,mode,rows) => {
//         const isChecked = e;
//         const data = mode==1 ? this.state.statusBasedFilteredData :rows ;
//         const selectedRowKeys = isChecked ? data.map(item => item._id) : [];
//         this.setState({
//           selectedEOPT: selectedRowKeys,
//           dup_selectedEOPT: isChecked? data :[],
//         });
//       };



//       select_func = (isSelect, rows, e, mode) => {
//         console.log(rows,'rows',isSelect)
//         if (mode === "1" || mode !== "1") {
//           let selectedEOPT = [];
//           let selected_id = [];
      
//           if (isSelect) {
//             selectedEOPT = rows;
//             rows.forEach((data) => {
//               selected_id.push(data._id);
//             });
//           }
      
//           this.setState({
//             selectedEOPT,
//             selected_id,
//             validateErr : false,
//           });
//         }
//       };


//     handleSelectAllCheckbox = (event) => {
//         const isChecked = event.target.checked;
//         const rows = this.state.statusBasedFilteredData;

//         this.setState({
//             selectedEOPT: isChecked ? rows : [],
//         });
//     };
      

//     render() {
//         if (this.state.dataLoaded) {
         
//             const columns = [
//                 {
//                     Header: (cellProps) => <div className="form-check font-size-12" >
//                         <input className="form-check-input" onChange={() => {
//                             // Determine if all rows are currently selected
//                             const allSelected = cellProps.page.every((row) => row.original.selected);
//                             console.log(allSelected,'allSelected',cellProps.page)
//                             // Update the selection for each row
//                             cellProps.page.forEach((row) => {
//                                 row.original.selected = !allSelected;
//                             }); this.select_func(!allSelected, _.map(cellProps.page,"original"), "e", '1')
//                         }} type="checkbox" checked={cellProps.page.length > 0 && cellProps.page.every((row) => row.original.selected)} id="checkAll" />
//                         <label className="form-check-label" htmlFor="checkAll"></label>
//                     </div>,
//                     accessor: '#',
//                     width: '20px',
//                     filterable: true,
//                     Cell: ({ row }) => (
//                         <div className="form-check font-size-11" >
//                             <input className="form-check-input" checked={row.original.selected} type="checkbox" onChange={(e) => { row.original.selected = !row.original.selected; this.getSelectedEOPT(row.original) }} id="checkAll" />
//                             <label className="form-check-label" htmlFor="checkAll"></label>
//                         </div>
//                     )
//                 },
//                 {
//                     accessor: 'name',
//                     Header: 'Name',
//                     filterable: true,
//                     formatter: (cellProps) => {
//                         var item = cellProps.row.original
//                         return (
//                             <>
//                                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                                     <div className=" font-size-11 text-dark">
//                                         {item.name}
//                                     </div>
//                                 </div>
//                             </>
//                         )
//                     }
//                 },
//                 {
//                     accessor: 'code',
//                     Header: 'Code'
//                 },
//                 {
//                     accessor: 'category',
//                     Header: 'Category'
//                 },                
//             ];
//             const defaultSorted = [{
//                 dataField: 'created_on', // if dataField is not match to any column you defined, it will be ignored.
//                 order: 'desc' // desc or asc
//             }];

//             const selectRow = {
//                 mode: 'checkbox',
//                 clickToSelect: true, // this.state.allowTableRowToSelect,
//                 // selected : this.state.selected_id,
//                 onSelect: (row, isSelect, rowIndex, e) => {
//                     this.getSelectedEOPT(row, isSelect, rowIndex, e)
//                 },
//                 onSelectAll: (isSelect, rows, e) => {
//                     this.select_func(isSelect, rows, e,'1')
          
//                 },
//             }
//             return (
//               <React.Fragment>
//                 <Container fluid>
//                   <Row className="px-2">
//                     <Col md={4}>
//                       <AvForm className="form-horizontal" onValidSubmit={this.submitData} onInvalidSubmit={this.handleInvalidSubmit} >
//                         <Label className="" htmlFor="autoSizingSelect"> Select label</Label>
//                         <AvInput
//                           type="select"
//                           name="hlevel_cat"
//                           label="Name"
//                           value={null}
//                           className="form-select"
//                           id="cate"
//                           required
//                           onChange={(e) => this.labelSelected(e)}
//                         >
//                           <option value="" disabled selected>
//                             Choose...
//                           </option>
//                           <option value="all">ALL</option>
//                           {this.state.labelData.map((data, idx) => {
//                             return (
//                               <option value={idx} key={"lbl" + idx}>
//                                 {data.label_name}
//                               </option>
//                             );
//                           })}
//                         </AvInput>
//                       </AvForm>
//                     </Col>
//                   </Row>

//                   {this.state.tableDataloaded ? (
           
//                             <Card>
//                                 <CardBody className="p-2">
//                                     {
//                                         this.state.validateErr &&
//                                         <div className="text-danger" style={{ fontSize: 'smaller' }}>Please select any one location.</div>
//                                     }
//                                     <TableContainer
//                                         columns={columns}
//                                         data={this.state.statusBasedFilteredData}
//                                         isGlobalFilter={false}
//                                         isAddOptions={false}
//                                         isJobListGlobalFilter={false}
//                                         customPageSize={10}
//                                         style={{ width: "100%" }}
//                                         isPagination={true}
//                                         filterable={false}
//                                         btnName={"Add User"}
//                                         tableClass="align-middle table-nowrap table-check"
//                                         theadClass="table-light"
//                                         pagination="pagination pagination-rounded justify-content-end mb-2"
//                                     />
//                                 </CardBody>
//                             </Card>

//                   ) : null}

//                   <footer
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       height: 50,
//                       background: "#fff",
//                       width: "100%",
//                       position: "fixed",
//                       bottom: 0,
//                       zIndex: 9998,
//                       borderTop: "1px solid #dedede",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Button
//                         color="primary"
//                         className="btn-sm"
//                         onClick={() => {
//                           this.addEndpoints();
//                         }}
//                       >
//                         {" "}
//                         Add Selected Location
//                       </Button>
//                     </div>
//                   </footer>
//                 </Container>
//               </React.Fragment>
//             );
//         }
//         else {
//             return null
//         }
//     }
// }




























// import React, { Component } from "react";
// import ReactDOM from 'react-dom';
// import {
//     Row, Col, FormGroup, Button, Card, CardBody, Container, Alert, Label, Form, Progress,
//     Input,
// } from "reactstrap";
// import Select from "react-select";
// import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
// import { Link } from "react-router-dom"
// import Dropzone from "react-dropzone"
// import TagsInput from 'react-tagsinput'

// import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
// import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit"
// import BootstrapTable from "react-bootstrap-table-next"

// import 'react-tagsinput/react-tagsinput.css'



// const _ = require('lodash')
// var urlSocket = require("../../../helpers/urlSocket")

// export default class LoodEndpointNode extends React.Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             dataLoaded: false,
//             selectedEOPT:[]

//         };
//         this.table = React.createRef();  
//     }



//     async componentDidMount() {
//         var db_info = JSON.parse(sessionStorage.getItem('db_info'))
//         this.setState({db_info},()=>{this.loadEOPTS()})        
//     }

//     loadEOPTS = () => {
//         this.setState({ tableDataloaded: false })
//         try {
//             urlSocket.post("webEntities/endpointlist", {
//                 userInfo: {
//                     encrypted_db_url:this.state.db_info.encrypted_db_url,
//                     company_id: this.props.userInfo.company_id,
//                     user_id: this.props.userInfo._id,
//                 },
//             })
//                 .then((response) => {
//                     this.setState({
//                         statusBasedFilteredData: response.data.data,
//                         tableDataloaded: true,
//                         allowTableRowToSelect: true,
//                         labelDefault: true,
//                         label: {
//                             endpoints: []
//                         },


//                     }, function () {
//                         this.loadUserLabels()
//                     })

//                 })
//         } catch (error) {

//         }
//     }


//     loadUserLabels() {
//         try {
//             urlSocket.post("userSettings/getuserlabels", {
//                 userInfo: {
//                     encrypted_db_url: this.state.db_info.encrypted_db_url,
//                     _id: this.props.userInfo._id,
//                     company_id: this.props.userInfo.company_id
//                 }
//             })
//                 .then(response => {
//                     this.setState({
//                         labelData: response.data.data,
//                         dataLoaded: true

//                     })
//                 })

//         } catch (error) {
//         }
//     }

//     labelSelected(data) {

//         if(data.target.value === "all")
//         {
//             this.loadEOPTS()
//         }
//         else
//         {

//             var mylabel = this.state.labelData[data.target.value]
    
//             this.setState({
//                 tableDataloaded: false, selectedLabel: mylabel._id,
//                 label: mylabel
//             })
    
//             try {
    
//                 urlSocket.post("webEntities/loadlabeleopts", {
//                     labelInfo: mylabel,
//                     userInfo: {
//                         encrypted_db_url: this.state.db_info.encrypted_db_url,
//                         _id: this.props.userInfo._id,
//                         company_id: this.props.userInfo.company_id
//                     }
//                 })
//                     .then(response => {
//                         this.setState({
//                             statusBasedFilteredData: response.data.data,
//                             labelDefault: false,
//                             tableDataloaded: true
//                         })
//                     })
    
//             } catch (error) {
//                 console.log("catch error", error)
//             }
    
//         }

//     }

//     getSelectedEOPT = (row, isSelect, rowIndex, e) => {

//         var getEOPTId = _.map(this.state.selectedEOPT, "_id")
//         var getIndex = getEOPTId.indexOf(row._id)

//         if (getIndex === -1) {
//             this.state.selectedEOPT.push(row)

//             this.setState({
//                 selectedEOPT: this.state.selectedEOPT
//             })
//         }
//         else {
//             this.state.selectedEOPT.splice(getIndex, 1)
//             this.setState({
//                 selectedEOPT: this.state.selectedEOPT
//             })
//         }


//     }

//     // selectAll(event,data){
//     //     this.setState({selectedEOPT : data, disabled_box:true})
        
        
//     // }

//     // selectAll = (event, data,selectRows) => {
//     //     var row = data.slice(0,7)
//     //     selectRows.onSelectAll(event.target.checked,row)
//     //     // this.setState({ selectedEOPT: data });
      
//     //     // const { selectRow } = selectRows;
//     //     // const { onSelectAll } = selectRow;

//     //     // if (onSelectAll) {
//     //     //   const isSelect = true;
//     //     //   const selectedRows = data.map(row => {
//     //     //     return { ...row, selected: isSelect }; // Set the 'selected' property to 'true'
//     //     //   });
//     //     //   onSelectAll(isSelect, selectedRows, event);
//     //     // }
//     //   };


//     selectAll = (event, data, selectRows) => {
//         const row = data.slice(0, 7);
        
//         // Update the selected property of each row to isSelect value
//         const updatedRows = row.map(rowItem => ({
//           ...rowItem,
//           selected: event.target.checked
//         }));
//         selectRows.onSelectAll(event.target.checked, updatedRows);
//       }



//     addEndpoints(){
//         try {
//             var loggedUserInfo = {
//                 encrypted_db_url: this.state.db_info.encrypted_db_url,
//                 company_id: this.props.userInfo.company_id,
//                 company_name: this.props.userInfo.company_name,
//                 created_by:this.props.userInfo._id
//             }
//             urlSocket.post("webphlbconf/addmultipleendpoints", {
//                 userInfo: loggedUserInfo,
//                 publishtemplateInfo: this.props.publishtemplateInfo,
//                 endpointInfo: this.state.selectedEOPT
//             })
//             .then(response=>{
//                 if(response.data.response_code === 500)
//                 {
//                         this.props.onClose()
//                 }
//             })
//         } catch (error) {
//             console.log("catch error", error)
//         }


//     }


//     onSelectAll = (isSelected) => {
//         if (isSelected) {
//           return this.state.statusBasedFilteredData.map(row => row.id);
//         }
//       }




//     render() {
//         if (this.state.dataLoaded) {
//             const { SearchBar } = Search;
//             const options = {
//                 // pageStartIndex: 0,

//                 sizePerPage: 7,
//                 totalSize: this.state.statusBasedFilteredData.length, // replace later with size(users),
//                 custom: true,
//             };
//             const columns = [
//                 {
//                     text: "id",
//                     dataField: "_id",
//                     sort: true,
//                     hidden: true,
//                     formatter: (cellContent, item) => (
//                         <>
//                             {item._id}
//                         </>
//                     ),
//                 },
//                 {
//                     dataField: 'name',
//                     text: 'Name',
//                     sort: true,
//                     formatter: (cellContent, item) => {
//                         return (
//                             <>
//                                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                                     <div className=" font-size-14 text-dark" style={{ marginBottom: 5 }}>
//                                         {item.name}
//                                     </div>
//                                 </div>
//                             </>
//                         )
//                     }
//                 },
//                 {
//                     dataField: 'code',
//                     text: 'Code'
//                 },
//                 {
//                     dataField: 'category',
//                     text: 'Category'
//                 },
//                 {
//                     dataField: 'created_on',
//                     isDummyField: true,
//                     hidden: true,
//                     text: 'updated on'
//                 },
                
                
//             ];
//             const defaultSorted = [{
//                 dataField: 'created_on', // if dataField is not match to any column you defined, it will be ignored.
//                 order: 'desc' // desc or asc
//             }];

//             const selectRow = {
//                 mode: 'checkbox',
//                 clickToSelect: true, 
//                 // this.state.allowTableRowToSelect,
//                 onSelect: (row, isSelect, rowIndex, e) => {
//                     this.getSelectedEOPT(row, isSelect, rowIndex, e)
//                 },
//                 onSelectAll: (isSelect, rows, e) => {
//                     this.state.selectedEOPT = rows
//                     this.setState({
//                         selectedEOPT:this.state.selectedEOPT
//                     })
            
            
//                 },

//                 // onSelectAll: this.onSelectAll
//                 // nonSelectable: this.state.label.endpoints

//             };
//             return (
//                 <React.Fragment>
//                     <Container fluid>
//                         <Row >
//                             <Col >
//                                 <div className="px-5">
//                                     <Row className="my-4">
//                                     <div className="d-sm-flex align-items-center justify-content-between">
//                                     <div className="text-danger font-size-18">Load End points</div>

//                                                 <button className="btn btn-outline-dark " onClick={() => this.props.onClose()}> Close </button>
//                                             </div>
//                                         <hr className="my-4" />
//                                     </Row>
//                                     <Row>
//                                         <AvForm className="form-horizontal" onValidSubmit={this.submitData} onInvalidSubmit={this.handleInvalidSubmit}>
//                                             <div className="mb-1">
//                                                 <Label className="" htmlFor="autoSizingSelect">Select label</Label>
//                                                 <AvInput
//                                                     type="select"
//                                                     name="hlevel_cat"
//                                                     label="Name"
//                                                     value={null}
//                                                     className="form-select"
//                                                     id="cate"
//                                                     required
//                                                     onChange={(e) => this.labelSelected(e)}>
//                                                     <option value="" disabled selected>Choose...</option>
//                                                     <option value="all"  >ALL</option>
//                                                     {
//                                                         this.state.labelData.map((data, idx) => {
//                                                             return (
//                                                                 <option value={idx} key={"lbl" + idx}>{data.label_name}</option>
//                                                             )
//                                                         })
//                                                     }
//                                                 </AvInput>
//                                             </div>
//                                         </AvForm>
//                                     </Row>
//                                 </div>
//                             </Col>
//                         </Row>
//                         <Row>
//                             <div className="p-5">
//                                 {
//                                     this.state.tableDataloaded ?

//                                         <PaginationProvider
//                                             keyField="id"
//                                             data={this.state.statusBasedFilteredData}
//                                             columns={columns}
//                                             pagination={paginationFactory(options)}
//                                         >
//                                             {
//                                                 ({
//                                                     paginationProps,
//                                                     paginationTableProps
//                                                 }) => (
//                                                     <ToolkitProvider
//                                                     // ref="table"
//                                                         keyField="_id"
//                                                         data={this.state.statusBasedFilteredData}
//                                                         columns={columns}
//                                                         search
//                                                     >
//                                                         {
//                                                             toolkitprops => (
//                                                                 <React.Fragment>
//                                                                     <Row className="mb-2" style={{ paddingTop: 10 }}>
//                                                                         <Col sm="10">
//                                                                             <div className="search-box ms-2 d-inline-block">
//                                                                                 <div className="position-relative">
//                                                                                     <SearchBar {...toolkitprops.searchProps} />
//                                                                                     <i className="bx bx-search-alt search-icon" />
//                                                                                 </div>
//                                                                             </div>
//                                                                         </Col>
//                                                                         <Col md={2}>
//                                                                         {/* <input type="checkbox" onClick={(e)=>{selectRow.onSelectAll(e.target.checked,this.state.statusBasedFilteredData)}}/> &nbsp;

//                                                                         <label>Select All</label> */}
                                                                        
//                                                                         </Col>
//                                                                     </Row>
//                                                                     <hr className="my-2" />

//                                                                     <Row>
//                                                                         <Col xl="12">
//                                                                             <div className="table-responsive">
//                                                                                 <BootstrapTable
//                                                                                     {...toolkitprops.baseProps}
//                                                                                     {...paginationTableProps}
//                                                                                     defaultSorted={defaultSorted}
//                                                                                     selectRow={selectRow}
//                                                                                     classes={
//                                                                                         "table align-middle table-nowrap table-hover"
//                                                                                     }
//                                                                                     bordered={false}
//                                                                                     striped={false}
//                                                                                     responsive
//                                                                                 />
//                                                                             </div>
//                                                                         </Col>
//                                                                     </Row>
//                                                                     <Row className="align-items-md-center mt-30">
//                                                                         <Col className="pagination pagination-rounded justify-content-end mb-2">
//                                                                             <PaginationListStandalone
//                                                                                 {...paginationProps}
//                                                                             />
//                                                                         </Col>
//                                                                     </Row>
//                                                                 </React.Fragment>
//                                                             )}
//                                                     </ToolkitProvider>
//                                                 )}
//                                         </PaginationProvider> : null
//                                 }
//                                 <Button color="primary" onClick={()=>{this.addEndpoints()}} > Add Selected End points</Button>
//                             </div>
                            
//                         </Row>
//                     </Container>
//                 </React.Fragment>
//             )
//         }
//         else {
//             return null
//         }
//     }
// }