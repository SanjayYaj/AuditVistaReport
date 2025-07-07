import React, { useEffect, useMemo, useRef, useState } from 'react'
import urlSocket from 'helpers/urlSocket'
import { useNavigate } from 'react-router-dom'
import { addUsers, treeDataToFlat } from 'toolkitStore/Auditvista/audit/htree'
import TableContainer from '../../../common/TableContainer'
import Breadcrumbs from 'components/Common/Breadcrumb'
import { Row, Col, Container, CardBody, Button, Card, Modal, ModalHeader, ModalBody,Spinner } from 'reactstrap'
import { AvForm, AvField } from "availity-reactstrap-validation"


const MapUserInfo = () => {
    const [modal, setModal] = useState(false)
    const [usertype, setUserType] = useState("")
    const [dataLoaded, setdataLoaded] = useState(false)
    const [auditStatusData, setauditStatusData] = useState([
        { status: "Active", count: 0, color: "#fbae17", id: "1", badgeClass: "success" },
        { status: "In active", count: 0, color: "#303335", id: "0", badgeClass: "danger" },
    ])
    const [userHLevel, setuserHLevel] = useState("All")
    const [resultData, setresultData] = useState([])
    const [ddchange, setddchange] = useState(false)
    const [selectedUsers, setselectedUsers] = useState([])
    const [hierachyUserLevel, sethierachyUserLevel] = useState([])
    const [dupState, setdupState] = useState([])
    const [open, setopen] = useState(false);
    const [roleUser, setroleUser] = useState(null);
    const [configData, setConfigData] = useState(JSON.parse(sessionStorage.getItem("authUser")).config_data)
    const [clientInfo, setClientInfo] = useState(JSON.parse(sessionStorage.getItem("client_info"))[0])
    const [treeData, setTreeData] = useState([])
    const [flatData, setFlatData] = useState([])
    const [loading, setLoading] = useState(true)
    const [nodeInfo, setnodeInfo] = useState(null)
    const [addedUsers, setAddedUsers] = useState([])
    const [dbInfo, setDbInfo] = useState(null)
    const [userInfo, setuserInfo] = useState(null)
    const [dataSource, setdataSource] = useState([])
    const [entitiesAuditData, setentitiesAuditData] = useState([])
    const [statusBasedFilteredData, setstatusBasedFilteredData] = useState([])
    const [uniqueNextLevels, setuniqueNextLevels] = useState([])
    const [selectedValue, setselectedValue] = useState([])
    const [selectedValueName, setselectedValueName] = useState([])
    const [userViewData, setuserViewData] = useState(null)
    const [totalEntities, settotalEntities] = useState(null)
    const [component, setcomponent] = useState("")
    const [hlData, setHldata] = useState("")
    const [labelData, setlabelData] = useState([])
    const [userGroupSelected, setuserGroupSelected] = useState("")


    const history = useNavigate()



    const childCrudCategory = useRef()


    const getHdata = async () => {
        const hInfo = JSON.parse(sessionStorage.getItem("hInfo"))
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        var nodeInfo = JSON.parse(sessionStorage.getItem("nodeInfo"));

        try {

            return new Promise(async (resolve, reject) => {
                await urlSocket.post("webhstre/gethstructure", {
                    info: {
                        _id: hInfo._id,
                        company_id: hInfo.company_id,
                        encrypted_db_url: authUser.db_info.encrypted_db_url,
                    }
                }).then(async (response) => {
                    console.log(response, 'response', nodeInfo)
                    if (response.data.response_code === 500) {
                        var treeData = response.data.data.hstructure
                        var FlatData = await treeDataToFlat(treeData)
                        var FlatData = _.map(FlatData, 'node')
                        console.log(treeData, 'treeData', FlatData)
                        resolve({ treeData, FlatData })
                    }
                })
            })

        } catch (error) {
            console.log(error, 'error')
        }

    }

    const toggle = () => {
        setModal(!modal)
    }


    const filterEntityData = (event, h_level, hlevelNameValue, selectedIndex) => {
        // this.setState({ dataloaded: false })
        var h_levelValue = event.target.value
        var selectedValue = selectedValue

        var sourceAll = _.filter(dataSource, item => {
            var mapInfo = _.filter(item.departmentandhierarchy, { "department_name": userInfo.departmentandhierarchy[0].department_name })[0]

            if ((selectedIndex == 0 && h_levelValue == "All")) {
                return item
            }
            else {
                if (h_levelValue == "All") {
                    if ((selectedIndex - 1 == 0 && selectedValue[selectedIndex - 1] == "All")) {
                        return item
                    }
                    else {
                        if (mapInfo[String(selectedValueName[selectedIndex - 1])] == selectedValue[selectedIndex - 1]) {
                            return item
                        }
                    }
                }
                else {
                    if (mapInfo[String(h_level)] == h_levelValue) {
                        return item
                    }
                }

            }


        })

        var mappingInfo = _.map(sourceAll, item => {
            let h_level = _.filter(item.departmentandhierarchy, { "department_name": userInfo.departmentandhierarchy[0].department_name })[0]
            return h_level
        })
        var userNextLevel = _.filter(configData.hierarchy_info, ({ hierarchy_level }) => hierarchy_level < hlevelNameValue)
        if (userNextLevel.length > 0) {
            var uniqueHlevels

            _.map(userNextLevel, item => {
                uniqueHlevels = _.uniqBy(mappingInfo, el => `${el[item.hierarchy_level_name]}`)
            })

            var getUniqueRecords = _.uniqWith(mappingInfo, _.isEqual)

            var uniqueNextLevels = []
            _.map(userNextLevel, (item, idx) => {


                var findLevel = _.find(uniqueNextLevels, ["hlevelName", item.hierarchy_level_name]);
                findLevel.hlevelValues = []

                uniqueNextLevels.push({
                    hlevelName: item.hierarchy_level_name,
                    hlevelNameValue: item.hierarchy_level,
                    hlevelValues: _.uniqBy(getUniqueRecords, el => `${el[item.hierarchy_level_name]}`)
                })


                let index = uniqueNextLevels.findIndex(i => i.hlevelName === item.hierarchy_level_name);
                let getuniqueLevelIndex = uniqueNextLevels.findIndex(i => i.hlevelName === item.hierarchy_level_name)
                if (index != -1) {
                    uniqueNextLevels.splice(index, 1, uniqueNextLevels[getuniqueLevelIndex]);
                }
                selectedValue[index] = "All"
                selectedValue[selectedIndex] = h_levelValue
            })

        }
        else {
            selectedValue[selectedIndex] = h_levelValue
        }


        var filteredData = dataSource
        _.map(selectedValue, (data, idx) => {
            filteredData = _.filter(filteredData, item => {
                if (data == "All") {
                    return item

                }
                else {
                    var mapInfo = _.filter(item.departmentandhierarchy, { "department_name": userInfo.departmentandhierarchy[0].department_name })[0]
                    if (mapInfo[selectedValueName[idx]] == data) {
                        return item
                    }

                }
            })

        })
        console.log(uniqueNextLevels, 'uniqueNextLevels');
        setentitiesAuditData(filteredData)
        setuniqueNextLevels(uniqueNextLevels)
        setselectedValue(selectedValue)
        setdataLoaded(true)
        setTimeout(() => {
            createStatus()
            filterStatus('All')

        }, 5);
    }






    const getUserList = () => {
        try {
            var userInfo = {
                company_id: userInfo?.company_id,
                encrypted_db_url: dbInfo.encrypted_db_url
            }
            urlSocket.post("webUsers/usersList", userInfo).then(async (response) => {
                console.log(response, 'response');
                var selectedValue = []
                var selectedValueName = []
                var active_usrs = _.filter(response.data.data, { active: "1" })
                _.orderBy(active_usrs, ['active'], ['asc'])
                var user1 = active_usrs
                var mappingInfo = active_usrs

                var userNextLevel = _.filter(configData.hierarchy_info, ({ hierarchy_level }) => hierarchy_level < userInfo.hierarchy_level_value)
                console.log(mappingInfo, 'mappingInfo');
                var getUniqueRecords = _.uniqWith(mappingInfo, _.isEqual)
                console.log(getUniqueRecords, 'getUniqueRecords', configData, userNextLevel);
                var uniqueHlevels = []
                _.map(userNextLevel, item => {
                    uniqueHlevels = _.uniqBy(c, el => `${el[item.hierarchy_level_name]}`)
                })

                var uniqueNextLevels = []
                _.map(userNextLevel, item => {
                    selectedValue.push("All")
                    selectedValueName.push(item.hierarchy_level_name)
                    uniqueNextLevels.push({ hlevelName: item.hierarchy_level_name, hlevelNameValue: item.hierarchy_level, hlevelValues: _.uniqBy(getUniqueRecords, el => `${el[item.hierarchy_level_name]}`) })
                })
                console.log(uniqueHlevels, 'uniqueHlevels');
                setdataSource(active_usrs)
                setentitiesAuditData(active_usrs)
                setstatusBasedFilteredData(active_usrs)
                setuniqueNextLevels(uniqueHlevels)
                setselectedValue(selectedValue)
                setselectedValueName(selectedValueName)
                setdataLoaded(false)
                await createStatus()

            })
        } catch (error) {
            console.log(error, 'error');
            //(error, 'error')
        }
    }


    const createStatus = () => {
        var entityStatus = _.map(_.countBy(entitiesAuditData, "active"), (val, key) => ({ status: key, count: val }))
        var totalEntities = 0
        var result = []
        result = _.each(auditStatusData, function (audititem) {
            audititem.count = 0;
            _.each(entityStatus, itemStatus => {
                if (itemStatus.status == audititem.id) {
                    audititem.count = itemStatus.count
                    totalEntities = totalEntities + itemStatus.count
                }
            })
        })
        // this.setState({ resultData: result, totalEntities, dataloaded: true })
        setresultData(result)
        settotalEntities(totalEntities)
        setdataLoaded(true)
    }

    const filterStatus = (data) => {
        var filteredData;
        if (data == "In active") {
            filteredData = _.filter(entitiesAuditData, { "active": 0 })
        }
        else
            if (data == "Active") {
                filteredData = _.filter(entitiesAuditData, { "active": 1 })
            }
            else
                if (data == "All") {
                    filteredData = entitiesAuditData
                }
        setstatusBasedFilteredData(filteredData)

    }

    const uniqueByKeys = (data, keys) => {
        const seen = new Set();
        return data.filter(item => {
            const key = keys.map(k => item[k]).join('-');
            if (!seen.has(key)) {
                seen.add(key);
                return true;
            }
            return false;
        });
    }

    const updatedRolesInfo = async (userNodeInfo, dbInfo) => {

        try {
            const responseData = await urlSocket.post("webhstre/update-role-flat-info", {
                encrypted_db_url: dbInfo.encrypted_db_url,
                nodeInfo: userNodeInfo.nodeInfo.node,
            })
            console.log(responseData, 'responseData')

        } catch (error) {

        }
    }


    const getUpdateChild = async (userNodeInfo, db_info) => {
        // this.setState({dataloaded : false})
        setdataLoaded(false)
        try {
            const responseData = await urlSocket.post("webhstre/update-flat-child", {
                h_id: userNodeInfo.nodeInfo.node.h_id,
                encrypted_db_url: db_info.encrypted_db_url,
                nodeInfo: userNodeInfo.nodeInfo.node,
                selectedUsers: userNodeInfo.selectedUsers
            })
            console.log(responseData, 'responseData')
            setdataLoaded(true)
            // this.setState({dataloaded : true})
            history("/new-hstructure")

        } catch (error) {
            console.log(error, 'error')
        }
    }

    const navigateTo = (userData, mode) => {
        if (mode === 0) {
            sessionStorage.removeItem("userData");
            sessionStorage.setItem("userData", JSON.stringify(userData));
            history("/edtusr");
        }
        else
            if (mode === 1) {
                sessionStorage.setItem("redirect", 1)
                history("/add-new-user");
            }
    }




    const mapSelectedUser = async () => {
        sessionStorage.removeItem("userNodeInfo");
        var userNodeInfo = {
            nodeInfo: nodeInfo,
            selectedUsers: selectedUsers
        }
        var unique_userpath = await uniqueByKeys(userNodeInfo.nodeInfo.node.user_path, ['_id', 'cat_type', 'hirerachy_name'])
        userNodeInfo["nodeInfo"]["node"]["user_path"] = unique_userpath
        console.log(userNodeInfo, 'userNodeInfo')
        if (clientInfo.allowFollowup === true) {
            userNodeInfo.selectedUsers.forEach((ele, idx) => {
                var facilityInfo = _.filter(userNodeInfo.nodeInfo.node.user_permission_acpln, { user_id: ele.user_id })
                if (facilityInfo.length > 0) {
                    userNodeInfo.selectedUsers[idx]["facilities"] = facilityInfo[0].facilities
                    userNodeInfo.selectedUsers[idx]["role_description"] = facilityInfo[0].role_description
                    userNodeInfo.selectedUsers[idx]["role_name"] = facilityInfo[0].role_name
                    userNodeInfo.selectedUsers[idx]["id"] = facilityInfo[0].id
                }

            })
            console.log(userNodeInfo, 'userNodeInfo')
            await updatedRolesInfo(userNodeInfo, dbInfo)
            await getUpdateChild(userNodeInfo, dbInfo)

        }
        else {
            addUsers(userNodeInfo)
            history("/new-hstructure")
        }

    }

    const viewUserInfo = (data) => {
        var user_view = _.filter(statusBasedFilteredData, { "_id": data._id })
        console.log(user_view, 'user_view');
        setuserViewData(user_view[0])
        setModal(true)

    }

    const handleSelectAll = (selected, rows) => {
        var getUsers = []
        if (selected == true) {
            rows.map((data, idx) => {
                var userInfo = {
                    title: nodeInfo.node.title,
                    designation: data.designation,
                    name: data.firstname,
                    type: nodeInfo.type,
                    parent: nodeInfo.node.id,
                    user_id: data._id,
                    _id: data._id,
                    cat_type: nodeInfo.cat_type

                }
                getUsers.push(userInfo)
            })
            setselectedUsers(getUsers)
        }
        else {
            setselectedUsers([])
        }
    }

    const onSelectUsers = (userInfo, event) => {
        console.log(nodeInfo, 'nodeInfo');
        var nodeInfoData = _.cloneDeep(nodeInfo)
        // JSON.parse(JSON.stringify(nodeInfo))
        var selectedUsersInfo = _.cloneDeep(selectedUsers)
        // [...selectedUsers]
        if (event.target.checked) {
            var userLocInfo = {
                email_id: userInfo.email_id,
                phone_num: userInfo.countrycode + userInfo.phone_number,
                cat_type: [],
                hirerachy_name: [],
                name: userInfo.fullname,
                node_id: nodeInfoData.node.flat_ref_id,
                user_id: userInfo._id,
                _id: userInfo._id,
            }
            nodeInfoData.node.unique_users.push(userLocInfo)
            selectedUsersInfo.push(userLocInfo)
        }
        else {
            var filteredUsers = nodeInfoData.node.unique_users.filter((ele) => {
                if (ele._id !== userInfo._id) {
                    return ele
                }
            })
            var filteredRole = nodeInfoData.node.user_permission_acpln.filter((ele) => {
                if (ele._id !== userInfo.user_id) {
                    return ele
                }
            })
            selectedUsersInfo = selectedUsersInfo.filter((ele) => {
                if (ele._id !== userInfo._id) {
                    return ele
                }
            })

            nodeInfoData.node.unique_users = filteredUsers
            nodeInfoData.node.user_permission_acpln = filteredRole
        }
        setnodeInfo(nodeInfoData)
        setselectedUsers(selectedUsersInfo)
    }


    const onSelectValues = async (event, data, index) => {
        var userInfo = {
            title: nodeInfo.node.title,
            designation: statusBasedFilteredData[index].designation,
            name: statusBasedFilteredData[index].firstname,
            type: nodeInfo.type,
            parent: nodeInfo.node.id,
            user_id: statusBasedFilteredData[index]._id,
            _id: statusBasedFilteredData[index]._id,
            cat_type: data.cat_type,
            hirerachy_name: data.hirerachy_name
        }
        selectedUsers.push(userInfo)
        nodeInfo.node.user_path.push(userInfo)
        var nodeInfo = { ...nodeInfo }
        addedUsers.push(userInfo)
        if (nodeInfo.node["unique_users"] == undefined) {
            nodeInfo.node["unique_users"] = []
            nodeInfo.node["hirerachy_name"] = []
            nodeInfo.node["unique_users"].push({ ...userInfo })
            nodeInfo.node["unique_users"][0]["cat_type"] = [nodeInfo.node["unique_users"][0]["cat_type"]]
            nodeInfo.node["unique_users"][0]["hirerachy_name"] = [nodeInfo.node["unique_users"][0]["hirerachy_name"]]

        }
        else {
            var find_exist_user = _.find(nodeInfo.node.unique_users, { _id: userInfo._id })
            if (find_exist_user !== undefined) {
                find_exist_user["cat_type"].push(data.cat_type)
                find_exist_user["hirerachy_name"].push(data.hirerachy_name)
            }
            else {
                nodeInfo.node["unique_users"].push({ ...userInfo })
                var find_exist_user_unique = _.findIndex(nodeInfo.node.unique_users, { _id: userInfo._id })
                nodeInfo.node["unique_users"][find_exist_user_unique]["cat_type"] = [nodeInfo.node["unique_users"][find_exist_user_unique]["cat_type"]]
                nodeInfo.node["unique_users"][find_exist_user_unique]["hirerachy_name"] = [nodeInfo.node["unique_users"][find_exist_user_unique]["hirerachy_name"]]

            }
        }
        var unique_userpath = await uniqueByKeys(nodeInfo.node.user_path, ['_id', 'cat_type', 'hirerachy_name'])
        nodeInfo["node"]["user_path"] = unique_userpath
        setselectedUsers(selectedUsers)
        setAddedUsers(unique_userpath)
        setnodeInfo(nodeInfo)

    }

    const onRemove = async (item, idx) => {
        item["_id"] = statusBasedFilteredData[idx]._id
        var removed_data = []
        _.filter(addedUsers, e => {
            if ((e.cat_type == item.cat_type) && (e._id == statusBasedFilteredData[idx]._id)) {
            }
            else {
                removed_data.push(e)
            }

        })
        var update_node_data = []
        nodeInfo.node.user_path.map((data, idx1) => {
            if ((data.cat_type == item.cat_type) && (data._id == statusBasedFilteredData[idx]._id)) {

            }
            else {
                update_node_data.push(data)
            }
        })
        var nodeInfo = { ...nodeInfo }
        nodeInfo.node["user_path"] = update_node_data
        var find_unique_user_idx = _.findIndex(nodeInfo.node.unique_users, { _id: item._id })
        if (find_unique_user_idx !== -1) {
            var filtered_unique_user = nodeInfo.node.unique_users[find_unique_user_idx].cat_type.filter(ele => ele !== item.cat_type);
            var filtered_unique_h_name = nodeInfo.node.unique_users[find_unique_user_idx].hirerachy_name.filter(ele => ele !== item.hirerachy_name);
            nodeInfo.node.unique_users[find_unique_user_idx].cat_type = filtered_unique_user
            nodeInfo.node.unique_users[find_unique_user_idx].hirerachy_name = filtered_unique_h_name

            if (filtered_unique_user.length == 0) {
                var updated_unique_userdata = nodeInfo.node.unique_users.filter((ele, index) => index !== find_unique_user_idx);
                nodeInfo.node["unique_users"] = updated_unique_userdata
            }
        }
        var unique_userpath = await uniqueByKeys(nodeInfo.node.user_path, ['_id', 'cat_type', 'hirerachy_name'])
        nodeInfo["node"]["user_path"] = unique_userpath
        setAddedUsers(unique_userpath)
        setdataLoaded(false)
        setnodeInfo(nodeInfo)
    }

    const onDrawerClose = () => {
        setopen(false)
        setdataLoaded(false)
        setcomponent("")
        setTimeout(() => {
            setdataLoaded(true)
            retriveExistCategory()

        }, 500);
    }

    const getSelectedUsers = (row, isSelect, rowIndex, e) => {
        var statusBasedFilteredData = [...statusBasedFilteredData]
        if (isSelect == true) {
            statusBasedFilteredData[rowIndex]["multi"] = true


        }
        else {
            statusBasedFilteredData[rowIndex]["multi"] = false
        }
        setstatusBasedFilteredData(statusBasedFilteredData)
        setdupState([statusBasedFilteredData[rowIndex]].concat[statusBasedFilteredData[rowIndex]])
        setdataLoaded(false)
        setTimeout(() => {
            setdataLoaded(true)

        }, 500);
    }

    const updateAddUsers = (user_path) => {
        setAddedUsers(user_path)
        setdataLoaded(false)
    }

    const loadUserLabels = () => {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))

        try {
            urlSocket.post("userSettings/get-user-group", {
                userInfo: {
                    encrypted_db_url: dbInfo ? dbInfo.encrypted_db_url : authUser.db_info.encrypted_db_url,
                    _id: userInfo ? userInfo._id : authUser.user_data._id,
                    company_id: userInfo ? userInfo.company_id : authUser.user_data.company_id
                }
            })
                .then(response => {
                    setlabelData(response.data.data)
                })
        } catch (error) {
            console.log(error, 'error');
        }
    }

    const updateNodeInfo = (nodeInfo) => {
        setnodeInfo(nodeInfo)
    }

    const labelSelected = (data) => {

        if (data.target.value === "all") {
            retriveExistCategory()
        }
        else {
            var mylabel = labelData[data.target.value]

            try {

                urlSocket.post("userSettings/load-group-users", {
                    labelInfo: mylabel,
                    userInfo: {
                        encrypted_db_url: dbInfo.encrypted_db_url,
                        _id: userInfo._id,
                        company_id: userInfo.company_id
                    }
                })
                    .then(response => {
                        setstatusBasedFilteredData(response.data.data)
                    })
            } catch (error) {
            }

        }
        setuserGroupSelected(data.target.value)

    }







    const retriveExistCategory = () => {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))

        try {
            urlSocket.post('cog/retrive-categories', {
                encrypted_db_url: dbInfo ? dbInfo.encrypted_db_url : authUser.db_info.encrypted_db_url,
                hierarchy_id: nodeInfo.node.h_id
            }).then((response) => {
                console.log(response, 'response');
                if (response.data.response_code === 500) {
                    sethierachyUserLevel(response.data.data[0].hirerachy_user_level)
                    getUserList()
                }
            })
        } catch (error) {
            console.log(error, 'error');

        }
    }


    const validateData = () => {
        var userNextLevel = _.map(_.filter(configData.hierarchy_info, ({ hierarchy_level }) => hierarchy_level >= this.state.userInfo.hierarchy_level_value), "hierarchy_level_name")
        var hlData = ""
        _.each(userNextLevel, (item, index) => {
            if (index == 1) {
                hlData = userInfo.departmentandhierarchy[0][item]
            }
            else if (index > 1) {
                if (userInfo.departmentandhierarchy[0][item] != "" && userInfo.departmentandhierarchy[0][item] != undefined)
                    hlData = hlData + " / " + userInfo.departmentandhierarchy[0][item]
            }
        })

        setHldata(hlData)
    }


    const getAllChildUsers = (childNode, childs, cat_type) => {
        _.each(childNode, item => {
            if (item.type === 2 && cat_type == item.cat_type) {
                childs.push(item)
            }
            if (item.children) {
                getAllChildUsers(item.children, childs)
            }
        })
    }


    useEffect(() => {
        const fetchData = async () => {
            var hData = await getHdata()
            var data = JSON.parse(sessionStorage.getItem("authUser"));
            var db_info = JSON.parse(sessionStorage.getItem("db_info"));
            var nodeInfo = JSON.parse(sessionStorage.getItem("nodeInfo"));
            nodeInfo["treeData"] = hData.treeData
            nodeInfo["flatData"] = hData.FlatData
            var childrenUsers = []
            await getAllChildUsers(nodeInfo.node.children, childrenUsers, nodeInfo.cat_type)
            var addedUsers = nodeInfo.node.user_path.concat(childrenUsers)
            var filtered_users = _.filter(addedUsers, e => {
                if (addedUsers.length == 0) {
                    if (e.parent_node.title == nodeInfo.node.title) {
                        return e
                    }
                }
                else {
                    if (e.title == nodeInfo.node.title && e.cat_type == nodeInfo.cat_type) {
                        return e
                    }
                }
            })
            setuserInfo(data.user_data)
            setAddedUsers(addedUsers)
            setnodeInfo(nodeInfo)
            setselectedUsers(nodeInfo.node.unique_users)
            setdataLoaded(false)
            setDbInfo(db_info)
        }

        fetchData()

    }, [])

    useEffect(() => {
        if (userInfo && nodeInfo && dbInfo) {  // Ensure state is updated
            retriveExistCategory();
            loadUserLabels();
        }


    }, [userInfo, dbInfo])


    const columns = useMemo(() => [
        {
            accessor: "select",
            Header: "Select User",
            Cell: (cellProps) => {
                const user = cellProps.row.original;
                const selectedUsers = _.filter(nodeInfo?.node.unique_users, { user_id: user._id });
                return (
                    <input
                        defaultChecked={_.filter(selectedUsers, { user_id: user._id }).length > 0 ? true : false}
                        onChange={(e) => { onSelectUsers(user, e) }} type="checkbox" />
                );
            }
        },
        {
            accessor: 'fullname',
            Header: 'User Name',
            sort: true,
            width: '55%',
            Cell: (cellProps) => {
                var item = cellProps.row.original
                var user_idx = _.filter(addedUsers, { _id: item._id })
                return (
                    <div className={` row-highlight ${user_idx.length > 0 ? 'highlighted' : ''}`}>
                        <div className="d-flex " style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className=" font-size-13">
                                {item.fullname}
                            </div>
                            <div className=" font-size-11 ">
                                {/* {item.designation} */}
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            accessor: "menu",
            Header: "Action",
            Cell: (cellProps) => {
                var user = cellProps.row.original
                return (
                    <div className="d-flex align-items-center gap-3" style={{ display: 'flex', alignContent: 'center' }}>
                        <Button id={`view-${user._id}`} className="btn btn-sm btn-soft-primary d-flex align-items-center" onClick={() => { viewUserInfo(user) }} >
                            View Details  <i className="bx bx-right-arrow-alt ms-2 font-size-14"></i>
                        </Button>
                    </div>
                )
            },
        },


    ], [nodeInfo, userViewData]);




    if (dataLoaded) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ minHeight: "100vh" }}>
                    <Breadcrumbs title={nodeInfo?.node?.title} breadcrumbItem="Map Users" isBackButtonEnable={true} gotoBack={() => { history('/new-hstructure') }} />

                    <Container fluid>
                        <Row>
                            <Col xl="12" >
                                <div style={{ width: '80%', padding: '0 20px' }}><h6>{hlData}</h6></div>
                                {
                                    uniqueNextLevels.length !== 0 ?
                                        <div style={{ display: 'flex', flexDirection: 'row', border: '1px solid #ABB8C3', padding: 10 }}>
                                            {
                                                uniqueNextLevels.map((item, idx) => {

                                                    return (
                                                        <div className="col-md-3" key={idx}>
                                                            <div className="form-group">
                                                                <label className="col-md-12 col-form-label">Select {item.hlevelName}</label>
                                                                <div className="col-md-12">
                                                                    <select className="custom-select" value={selectedValue[idx]} id={item.hlevelName} onChange={(e) => filterEntityData(e, item.hlevelName, item.hlevelNameValue, idx)}>
                                                                        <option value="All">All</option>
                                                                        {
                                                                            item.hlevelValues.map((data, idx2) => {
                                                                                if (data[item.hlevelName] != undefined)
                                                                                    return (
                                                                                        <option key={idx2} value={data[item.hlevelName]}>{data[item.hlevelName]}</option>
                                                                                    )
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                        : null
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        <TableContainer
                                            columns={columns}
                                            data={statusBasedFilteredData}
                                            isGlobalFilter={true}
                                            isAddOptions={false}
                                            isJobListGlobalFilter={false}
                                            customPageSize={10}
                                            style={{ width: '100%' }}
                                            iscustomPageSizeOptions={false}
                                            isPagination={true}
                                            filterable={false}
                                            tableClass="align-middle table-nowrap table-check"
                                            theadClass="table-light"
                                            pagination="pagination pagination-rounded justify-content-end mb-2"

                                            navigateto={(userData, mode) => { navigateTo(userData, 1) }}
                                            labelData={labelData}
                                            labelSelected={(e) => { labelSelected(e) }}
                                            showSelect={true}
                                            addedUsers={nodeInfo?.node?.unique_users}
                                        />

                                    </CardBody>

                                </Card>

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
                                zIndex: 999,
                                borderTop: "1px solid #dedede"
                            }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                                <button className="btn btn-sm btn-success ms-2" onClick={() => { mapSelectedUser() }}> Add Selected User</button>
                            </div>
                        </footer>
                        <Modal isOpen={modal} toggle={toggle}  >
                            <ModalHeader toggle={toggle} tag="h4">
                                User Info
                            </ModalHeader>
                            <ModalBody>
                                <AvForm className="form-horizontal" onValidSubmit={
                                    () => {
                                        console.log("?");
                                    }
                                    // this.Validsubmit
                                }>
                                    <div className="mb-3">
                                        <label>Full Name :<span className="text-danger"> *</span></label>
                                        <AvField
                                            name="firstname"
                                            value={userViewData ? userViewData.firstname : ''}
                                            disabled={true}
                                            errorMessage="Please enter your name"
                                            className="form-control"
                                            placeholder="Enter First Name"
                                            type="text"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Email Id :<span className="text-danger"> *</span></label>
                                        <AvField
                                            name="email_id"
                                            value={userViewData ? userViewData.email_id : ''}
                                            disabled={true}
                                            errorMessage="Please enter your Email ID"
                                            className="form-control"
                                            placeholder="Enter User Email"
                                            type="email"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label>Username :<span className="text-danger"> *</span></label>
                                        <AvField
                                            name="username"
                                            type="text"
                                            required
                                            placeholder="Enter username"
                                            disabled={true}
                                            value={userViewData ? userViewData.username : ''}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <Row>
                                            <Col className="col-12">
                                                <Row>
                                                    <label>Phone Number:<span className="text-danger"> *</span></label>
                                                    <Col md={3} className="pe-0">
                                                        <input
                                                            type="text"
                                                            value={userViewData ? userViewData.countrycode : ''}
                                                            className="form-control"
                                                            disabled={true}
                                                        />
                                                    </Col>
                                                    <Col md={9} className="ps-0">
                                                        <AvField
                                                            name="phone_number"
                                                            className="form-control"
                                                            placeholder="Enter Phone number"
                                                            errorMessage="Please enter your Phone Number"
                                                            value={userViewData ? userViewData.phone_number : ''}
                                                            disabled={true}
                                                            type="number"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </AvForm>


                            </ModalBody>
                        </Modal>

                    </Container>
                </div>
            </React.Fragment>

        )
    }
    else {
        return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div>Loading...</div>
            <Spinner color="primary" />
        </div>
        )
    }
}
export default MapUserInfo
