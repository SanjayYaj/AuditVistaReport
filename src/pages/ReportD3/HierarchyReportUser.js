import React, { useState, useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import { Link, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Button, Label, UncontrolledDropdown, DropdownToggle, DropdownMenu  } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { Tree, Badge, Space, } from 'antd';
import '../Audit/ManagePublishedTemplate/custom-tree-styles.css';
import { FolderOutlined, FileOutlined,  } from '@ant-design/icons';
import _ from 'lodash';

import { hierarchyList, getHierarchyInfo, publishSelectedUser } from '../../Slice/reportd3/reportslice';

import Swal from "sweetalert2";

const propTypes = {};

const defaultProps = {};

const HierarchyReportUser = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    const reportSlice = useSelector(state => state.reportSliceReducer);
    const [selectedHinfo, setSelectedHinfo] = useState("0");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedUsers,setSelectedUsers] = useState([])
    const [templateInfo,setTemplateInfo] = useState(JSON.parse(sessionStorage.getItem("page_data")))

    useEffect(() => {
        dispatch(hierarchyList());
    }, [dispatch]);

    const chooseHierarchy = (event) => {
        setSelectedHinfo(event.target.value);
        const hList = [...reportSlice.hierarchyList];
        const hInfo = _.filter(hList, { _id: event.target.value });
        if (hInfo.length > 0) {
            dispatch(getHierarchyInfo(hInfo[0]));
        }
    };

    const buildTreeNodes = (nodes) => {
        if (!nodes) return [];

        return nodes.map((node) => {
            const { title, children, ep_level, value, unique_users } = node;
            const hasChildren = children && children.length > 0;
            const background = ep_level === sessionStorage.getItem("hlevel") && node.node_positon === sessionStorage.getItem("node_positon") ? "#E6F4FF" : "transparent";

            return {
                ...node,
                key: value,
                children: hasChildren ? buildTreeNodes(children) : [],
                title: (
                    <div
                        onClick={() => handleNodeClick(value)}
                        className= 'd-flex align-items-center gap-2'
                    >
                        <div>
                            {hasChildren ? (
                                <FolderOutlined style={{ cursor: 'unset', opacity: 0.5 }} />
                            ) : (
                                <FileOutlined
                                    style={{
                                        cursor: 'pointer',
                                        color: '#556EE6',
                                    }}
                                />
                            )}
                        </div>
                        <div>
                            <span style={{ marginLeft: '4px', fontWeight: hasChildren ? '' : 600 }}>
                                {title}
                            </span>
                        </div>
                        <div>
                            <UncontrolledDropdown>
                                <DropdownToggle
                                    className="card-drop"
                                    tag="a"
                                >
                                    <Space size="middle">
                                        <Badge count={unique_users ? unique_users.length : 0} color="#556EE6">
                                            <i className="bx bx-user-pin font-size-20" title="Users" style={{ marginTop: '4px', marginLeft: '5px' }}></i>
                                        </Badge>
                                    </Space>
                                </DropdownToggle>
                                <DropdownMenu className="ms-4" style={{ minWidth: "500px", zIndex: 2, padding: 10, marginLeft: '13px', marginTop: '-15px' }}>
                                    {true ? (
                                        <div className="mt-2">
                                            <div className="mt-2">
                                                Users of&nbsp;
                                                <span className="font-size-13 text-primary mt-2">
                                                    {title}
                                                </span>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    Total Users:&nbsp;
                                                    <span className="font-size-13 text-danger mt-2">
                                                        {unique_users ? unique_users.length : 0}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="table-responsive mt-3" style={{ maxHeight: "300px" }}>
                                                <table className="table custom-table-style">
                                                    <thead>
                                                        <tr>
                                                            <th>S.No</th>
                                                            <th>Name</th>
                                                            <th>Category</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {unique_users ? unique_users.map((data, idx) => (
                                                            data.cat_type.length > 0 ? (
                                                                <tr key={idx}>
                                                                    <td>{idx + 1}</td>
                                                                    <td>{data.name}</td>
                                                                    <td>
                                                                        {data.cat_type.map((ele, index) => (
                                                                            <Badge
                                                                                key={index}
                                                                                pill
                                                                            >
                                                                                {ele === "1" ? "Auditor" : ele === "2" ? "Reviewer" : data.hirerachy_name ? data.hirerachy_name[index] : ""}
                                                                            </Badge>
                                                                        ))}
                                                                    </td>
                                                                </tr>
                                                            ) : null
                                                        )) : null}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : null}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>

                    </div>
                ),
            };
        });
    };


    const onCheck=(checked, event)=>{
        const user=[...selectedUsers]
        event.node.unique_users.map((ele,idx)=>{
            user.push({
                _id : ele.user_id,
                firstname : ele.name,
            })
        })
        setSelectedUsers(user)
    }


    const addSelectedUser=()=>{
        const userList = _.unionBy(selectedUsers,'_id')
        setSelectedUsers(userList)
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))

        Swal.fire({
            icon: 'warning', 
            title: 'Publish Confirmation',
            text: 'Are you sure you want to publish this users ?', 
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Publish',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if(result.isConfirmed){
                dispatch(publishSelectedUser(userList,templateInfo,authUser,history))
            }
        })


    }

    const handleNodeClick = (value) => {
    };

    const treeNodes = buildTreeNodes(reportSlice.hierarchyTree);

    return (
        <div className="page-content">
            <MetaTags>
                <title>AuditVista | Hierarchy</title>
            </MetaTags>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }} className="mb-1">
                <div style={{ width: '80%', padding: '0 20px' }}>Publishing</div>
                <div style={{ width: '20%', padding: '0 20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={"/report"}><Button color="primary">Back <i className="mdi mdi-arrow-left"></i></Button></Link>
                </div>
            </div>
            <Container fluid>
                <Breadcrumbs title="Hierarchy Report User" breadcrumbItem="Hierarchy Report User" />
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody>
                                <Label className="text-primary" htmlFor="autoSizingSelect">Select Level</Label>
                                <select
                                    type="select"
                                    name="hlevel"
                                    value={selectedHinfo}
                                    className="form-select"
                                    id="hlevel1"
                                    required
                                    onChange={chooseHierarchy}
                                >
                                    <option value="0" defaultValue disabled>Choose...</option>
                                    {
                                        reportSlice.hierarchyList?.map((data, idx) => (
                                            <option value={data._id} key={idx}>{data.hname}</option>
                                        ))
                                    }
                                </select>
                                <div className='mt-3'>
                                <Tree
                                    style={{ borderColor: '#150101' }}
                                    defaultExpandAll
                                    treeData={treeNodes}
                                    checkable
                                    showLine
                                    showIcon
                                    checkStrictly
                                    onCheck={(checked, event) => { onCheck(checked, event) }}
                                />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                {
                    selectedUsers.length > 0 &&
                    <div className="mt-4 d-grid">
                        <button
                            className="btn btn-danger btn-block"
                            type="submit"
                            onClick={() => { addSelectedUser() }}
                        >
                            Publish Report for Selected Users
                        </button>
                    </div>
                }

            </Container>
        </div>
    );
}

HierarchyReportUser.propTypes = propTypes;
HierarchyReportUser.defaultProps = defaultProps;

export default HierarchyReportUser;
