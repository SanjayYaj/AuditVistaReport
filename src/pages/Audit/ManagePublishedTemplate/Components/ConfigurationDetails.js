import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
    ListGroupItem,
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
    Button
} from 'reactstrap'
import _ from 'lodash';
import {
    findConfigUser,
    retriveTemplateList,
    updatepublishedTempData,
    updateSelecteduser
} from 'toolkitStore/Auditvista/ManageAuditSlice';
import LocationSelectedUsers from './LocationSelectedUsers';

const ConfigDetails = ({ config, onClose }) => {
    const dispatch = useDispatch();
    const [openTaskUsers, setopenTaskUsers] = useState(false);
    const [localPermissions, setLocalPermissions] = useState([]);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        console.log("config", config)

        const fetchData = async () => {
            const response = await dispatch(retriveTemplateList(config))

            if (response.data.response_code === 500) {
                console.log("responsehdata", response.data.data)
                setLocalPermissions(_.cloneDeep(response.data.data.adt_permissons))
            }
        }
        fetchData()

    }, [])

    if (!config) {
        return <div>No configuration details available.</div>;
    }

    const handleCheckTool = (event, idx) => {
        const { name, checked } = event.target;
        const updatedPermissions = [...localPermissions];
        console.log("checked", checked)

        updatedPermissions[idx][name] = !checked;

        if (name === "create_acplan" && checked) {
            updatedPermissions[idx]["modify_acplan"] = false;
        }

        if (name === "allow_set_target_date" && checked) {
            updatedPermissions[idx]["allow_assgn_task_users"] = false;
        }

        setLocalPermissions(updatedPermissions);
        setIsChanged(true);
    };
    

    const handleUpdatePermissions = async () => {
        const updatedConfig = {
            ...config,
            adt_permissons: localPermissions,
        };

        await dispatch(updatepublishedTempData(updatedConfig));

        const response = await dispatch(findConfigUser(config));

        const updatedUserSelection = response?.usr_selected?.map(ele => {
            const matchedLocal = localPermissions.find(local => local.func_id === ele.audit_type);
            if (matchedLocal) {
                return {
                    ...ele,
                    create_acplan: matchedLocal.create_acplan,
                    modify_acplan: matchedLocal.modify_acplan,
                    allow_set_target_date: matchedLocal.allow_set_target_date,
                    allow_assgn_task_users: matchedLocal.allow_assgn_task_users,
                };
            }
            return ele;
        });

        const userResponse = await dispatch(updateSelecteduser(config, updatedUserSelection, "usr_selected"));
        const userSelected = userResponse?.usr_selected;

        response.endpoints?.forEach(endpoint => {
            if (Array.isArray(endpoint.adt_users)) {
                endpoint.adt_users.forEach(user => {
                    const matchedUser = userSelected.find(sel =>
                        sel.user_id === user.user_id && sel.audit_type === user.audit_type
                    );
                    if (matchedUser) {
                        user.create_acplan = matchedUser.create_acplan;
                        user.modify_acplan = matchedUser.modify_acplan;
                        user.allow_set_target_date = matchedUser.allow_set_target_date;
                        user.allow_assgn_task_users = matchedUser.allow_assgn_task_users;
                    }
                });
            }
        });

        const endpointResponse = await dispatch(updateSelecteduser(config, response.endpoints, "endpoints"));

        setIsChanged(false);
        if (onClose) onClose();
    };

    
    

    const onDrawerClose = () => {
        setopenTaskUsers(false);
    };

    return (
        <div>

            {
                console.log("localPermissions",localPermissions)
            }
            <table className="table">
                <thead>
                    <tr>
                        <th>Permission</th>
                        <th>Create Action Plan</th>
                        <th>Modify Action Plan</th>
                        <th>Allow Set Target Date</th>
                        <th>Allow Assign Task Users</th>
                    </tr>
                </thead>
                <tbody>
                    {localPermissions.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>{row.func_name}</td>
                            <td>
                                <input
                                    className='ms-2'
                                    checked={row.create_acplan}
                                    name="create_acplan"
                                    onClick={(e) => handleCheckTool(e, rowIndex)}
                                    type='checkbox'
                                />
                            </td>
                            <td>
                                <input
                                    className='ms-2'
                                    checked={row.modify_acplan}
                                    name="modify_acplan"
                                    onClick={(e) => handleCheckTool(e, rowIndex)}
                                    disabled={!row.create_acplan}
                                    type='checkbox'
                                />
                            </td>
                            <td>
                                <input
                                    className='ms-2'
                                    checked={row.allow_set_target_date}
                                    name="allow_set_target_date"
                                    onClick={(e) => handleCheckTool(e, rowIndex)}
                                    type='checkbox'
                                />
                            </td>
                            <td>
                                <input
                                    className='ms-2'
                                    checked={row.allow_assgn_task_users}
                                    name="allow_assgn_task_users"
                                    onClick={(e) => handleCheckTool(e, rowIndex)}
                                    disabled={!row.allow_set_target_date}
                                    type='checkbox'
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center mt-3">

                <Button
                    onClick={() => setopenTaskUsers(true)}
                    className='btn btn-sm btn-secondary'
                >
                    Customise Users
                </Button>


                <Button
                    color="primary"
                    size="sm"
                    disabled={!isChanged}
                    onClick={handleUpdatePermissions}
                >
                    Update Permissions
                </Button>

            </div>

            {
                openTaskUsers &&
                <Offcanvas
                    isOpen={openTaskUsers}
                    toggle={onDrawerClose}
                    direction="end"
                    style={{ width: '1000px', zIndex: 9999 }}
                >
                    <OffcanvasHeader toggle={onDrawerClose}>
                        <span>Location Users</span>
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        <LocationSelectedUsers onDrawerClose={onDrawerClose} />
                    </OffcanvasBody>
                </Offcanvas>
            }
        </div>
    );
};

export default ConfigDetails;