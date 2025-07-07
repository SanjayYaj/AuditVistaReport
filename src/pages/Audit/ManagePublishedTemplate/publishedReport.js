import React, { useEffect, useState, useMemo } from 'react'
import { retriveAuditInfo } from 'toolkitStore/Auditvista/ManageAuditSlice'
import { useDispatch } from 'react-redux'
import TableContainer from './ReportComponents/TableContainer'
import Breadcrumb from 'components/Common/Breadcrumb'
import { MetaTags } from 'react-meta-tags'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardBody, Container, UncontrolledTooltip, Offcanvas, OffcanvasHeader, OffcanvasBody, Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input } from 'reactstrap'
import { MdCheckBox, MdCheckBoxOutlineBlank, MdChevronRight, MdKeyboardArrowDown, MdAddBox, MdIndeterminateCheckBox, MdLocationCity, MdStore, MdFolder, MdCheckCircle, MdDescription } from "react-icons/md";
import CheckboxTree, {
  getNode, flattenNodes, deserializeLists, serializeList
} from 'react-checkbox-tree';
import './CSS/checkboxtree.css';
import _ from 'lodash'
var moment = require('moment')
import EditEndpoints from './Components/EditEndpoints'
import { updateEndpointApi, clearAuditDataApi, revertAuditDataApi, listBackupsApi } from 'toolkitStore/Auditvista/ManageAuditSlice'
import Swal from 'sweetalert2'

const PublishedReport = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [publishedAuditData, setPublishedAuditData] = useState(JSON.parse(sessionStorage.getItem("publishedAuditData")))
  const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
  console.log(authUser, "authUser26")
  const [locationData, setLocationData] = useState([])
  const [auditList, setauditList] = useState([])
  const [statusBasedFilteredData, setStatusBasedFilterdData] = useState([])
  const [expanded, setExpanded] = useState([]);
  const [endpoints, setEndpoints] = useState([]); // Assume endpoints are populated elsewhere
  const [checked, setChecked] = useState([]);
  const [statusInfo, setStatusInfo] = useState({});
  const [open, setOpen] = useState(false)
  const [enableEdit, setenableEdit] = useState(false)
  const [epData, setepData] = useState(null)

  // Clear functionality states
  const [showClearModal, setShowClearModal] = useState(false)
  const [clearReason, setClearReason] = useState('')
  const [isClearing, setIsClearing] = useState(false)
  const [itemToClear, setItemToClear] = useState(null)
  const [showRevertModal, setShowRevertModal] = useState(false)
  const [revertReason, setRevertReason] = useState('')
  const [isReverting, setIsReverting] = useState(false)
  const [itemToRevert, setItemToRevert] = useState(null)
  const [availableBackups, setAvailableBackups] = useState([])
  const [selectedBackupRefId, setSelectedBackupRefId] = useState('')
  const [showBackupsList, setShowBackupsList] = useState(false)



  // Add these state variables to your existing useState declarations
  const [showResetAllModal, setShowResetAllModal] = useState(false)
  const [showRevertAllModal, setShowRevertAllModal] = useState(false)
  const [resetAllReason, setResetAllReason] = useState('')
  const [revertAllReason, setRevertAllReason] = useState('')
  const [isResettingAll, setIsResettingAll] = useState(false)
  const [isRevertingAll, setIsRevertingAll] = useState(false)
  const [selectedItemsForReset, setSelectedItemsForReset] = useState([])
  const [selectedItemsForRevert, setSelectedItemsForRevert] = useState([])
  const [selectAllForReset, setSelectAllForReset] = useState(false)
  const [selectAllForRevert, setSelectAllForRevert] = useState(false)


  const [showRevertButton, setShowRevertButton] = useState(false)



  const icons = {
    check: <MdCheckBox className="rct-icon rct-icon-check text-success" />,
    uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
    halfCheck: (
      <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />
    ),
    expandClose: (
      <MdChevronRight className="" />
    ),
    expandOpen: (
      <MdKeyboardArrowDown className="" />
    ),
    expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
    collapseAll: (
      <MdIndeterminateCheckBox className="" />
    ),
    parentClose: <MdLocationCity className="" />,
    parentOpen: <MdLocationCity className="" />,
    leaf: <MdStore className="" />
  }

  useEffect(() => {
    fetchData()

  }, [])

  const fetchData = async () => {
    const response = await dispatch(retriveAuditInfo())
    if (response) {
      console.log(response, 'respons79e');
      setStatusBasedFilterdData(response.data)
      if (response.hData.length > 0) {
        setLocationData(response.hData[0]["ep_structure"])
      }
      setEndpoints(response.data)
      const statusData = await updateStatusInfo(response.data)
      console.log(statusData, 'statusData');
      setStatusInfo(statusData)
    }
  }

  const updateStatusInfo = (endpoints) => {
    const statusData = {
      in_progress_count: _.filter(endpoints, { audit_status_id: "1" }).length,
      not_started_count: _.filter(endpoints, { audit_status_id: "0" }).length,
      completed_count: _.filter(endpoints, { audit_status_id: "2" }).length,
      submitted_count: _.filter(endpoints, { audit_status_id: "3" }).length,
      reviewed_count: _.filter(endpoints, { audit_status_id: "7" }).length,
    }
    return statusData
  }

  const getNodeEndpoints = (data, check) => {
    console.log('checkchecked', checked, check);

    const extractValues = (node, key = "value") => {
      const result = [];

      const traverse = (item) => {
        if (!item) return;
        if (item[key] !== undefined) result.push(item[key]);
        if (Array.isArray(item.children)) item.children.forEach(traverse);
      };

      traverse(data);
      return result;
    };

    const mappedData = extractValues(data);
    const endpointIds = endpoints.map(ep => ep.loc_ref_id);

    console.log('endpointIds', endpointIds, data);

    let updatedChecked = new Set(check);
    const matchedIDs = endpointIds.filter(id => check.includes(id));
    matchedIDs.forEach(id => updatedChecked.add(id));

    let updData = new Set(check);

    if (updData.has(data.value)) {
      mappedData.forEach(value => updData.delete(value));
    } else {
      mappedData.forEach(value => updData.add(value));
    }

    endpointIds.forEach(id => {
      if (check.includes(id) || mappedData.includes(id)) {
        updData.add(id);
      }
    });

    let ltdData = endpoints.filter(ep => updData.has(ep.loc_ref_id));

    if ((data?.children?.length > 0 || endpointIds.includes(data.value)) && (!checked.length > 0)) {
      console.log('ifffff');

      setChecked(ltdData.map(map => map.loc_ref_id));
      setStatusBasedFilterdData(ltdData);

      if (endpointIds.includes(data.value) && data.children !== null) {
        handleEndpointExpanded(mappedData);
      } else if (data.children === null) {
        return;
      } else {
        handleEndpointExpanded([]);
      }

    } else {
      console.log('ellllsseeeeeee');

      setChecked([]);
      setStatusBasedFilterdData(endpoints);
      handleEndpointExpanded([]);
    }
  };

  const onDrawerClose = () => {
    setOpen(false)
    setenableEdit(false)
    fetchData()
  }

  const activeInactive = (item) => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: item.active === "0" ? "Make this Location Active ?" : 'Make this Location InActive ?',
      showCancelButton: true,
      confirmButtonColor: '#2ba92b',
      confirmButtonText: 'Yes',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        item["active"] = item.active === "0" ? "1" : "0"
        const responseData = await dispatch(updateEndpointApi(item, publishedAuditData))
        if (responseData.status === 200) {
          fetchData()
        }
      }
    })
  }

  // Clear functionality
  const handleClearClick = (item) => {
    console.log('188', item)
    setItemToClear(item)
    setShowClearModal(true)
    setClearReason('')
  }


  // Updated handleClearConfirm function in React component
  const handleClearConfirm = async () => {
    if (!clearReason.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Reason Required',
        text: 'Please provide a reason for reset the data.',
      })
      return
    }

    if (!itemToClear) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No item selected for reset.',
      })
      return
    }

    setIsClearing(true)

    try {
      // Show backup progress
      Swal.fire({
        title: 'Creating Backup & Resetting Data...',
        html: `
        <div style="text-align: left;">
          <p><i class="bx bx-data"></i> Creating backup for: <strong>${itemToClear.loc_name}</strong></p>
          <p><i class="bx bx-loader bx-spin"></i> This may take a few moments...</p>
        </div>
      `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      // Call the backend API to clear the data (now with backup)
      const responseData = await dispatch(clearAuditDataApi(
        itemToClear,
        publishedAuditData,
        clearReason.trim()
      ))
      console.log('backupInforesponseData', responseData)


      if (responseData.status === 200) {
        // Remove the item from local state arrays
        const updatedEndpoints = endpoints.filter(ep => ep.id !== itemToClear.id)
        const updatedStatusFilteredData = statusBasedFilteredData.filter(item => item._id !== itemToClear.id)
        const updatedChecked = checked.filter(id => id !== itemToClear.loc_ref_id)

        // Update all the state with filtered data
        setEndpoints(updatedEndpoints)
        setStatusBasedFilterdData(updatedStatusFilteredData)
        setChecked(updatedChecked)

        // Recalculate status info with the remaining data
        const updatedStatusInfo = await updateStatusInfo(updatedEndpoints)
        setStatusInfo(updatedStatusInfo)

        // Close modal and reset
        setShowClearModal(false)
        setItemToClear(null)

        // Show success message with backup information
        const backupInfo = responseData.data?.data?.backup_info;

        Swal.fire({
          icon: 'success',
          title: 'Data Reset Successfully with Backup',
          html: `
          <div style="text-align: left;">
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h6 style="color: #28a745; margin-bottom: 10px;"><i class="bx bx-check-circle"></i> Reset Completed</h6>
              <p><strong>Location:</strong> ${itemToClear.loc_name}</p>
              <p><strong>Status Changed:</strong> ${itemToClear.audit_status_name} → Not Started</p>
              <p><strong>Reason:</strong> ${clearReason}</p>
              <p><strong>Reset by:</strong> ${authUser?.user_data?.fullname || 'Unknown'}</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
              <h6 style="color: #1976d2; margin-bottom: 10px;"><i class="bx bx-data"></i> Backup Information</h6>
              <p><strong>Backup ID:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 4px;">${backupInfo?.backup_ref_id || 'N/A'}</code></p>
              <p><strong>Checkpoints Backed Up:</strong> ${backupInfo?.checkpoints_backed_up || 0}</p>
              <p><strong>Backup Created:</strong> ${new Date(backupInfo?.backup_created_on || new Date()).toLocaleString()}</p>
              <p style="font-size: 12px; color: #666; margin-bottom: 0;">
                <i class="bx bx-info-circle"></i> Your data is safely backed up and can be restored if needed.
              </p>
            </div>
          </div>
        `,
          width: 600,
          timer: 8000,
          showConfirmButton: true,
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745'
        })

        // Log the clear action with backup information
        console.log('Audit data cleared successfully with backup:', {
          locationId: itemToClear.id,
          locationName: itemToClear.loc_name,
          locRefId: itemToClear.loc_ref_id,
          previousStatus: itemToClear.audit_status_name,
          newStatus: 'Not Started',
          reason: clearReason,
          timestamp: new Date().toISOString(),
          user: authUser?.user_data?.fullname || 'Unknown',
          backupInfo: backupInfo
        })

        // Optionally refresh the entire data to get updated info from server
        fetchData()

      } else {
        throw new Error(responseData.message || 'Failed to reset audit data')
      }

    } catch (error) {
      console.error('Error reset audit data:', error)

      Swal.fire({
        icon: 'error',
        title: 'Reset Failed',
        html: `
        <div style="text-align: left;">
          <p><strong>Error:</strong> ${error.message || 'Failed to reset audit data. Please try again.'}</p>
          <p style="font-size: 12px; color: #666;">
            <i class="bx bx-info-circle"></i> No changes were made to your data.
          </p>
        </div>
      `,
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      })
    } finally {
      setIsClearing(false)
    }
  }

  const handlerevertclick = async (item) => {
    console.log('Revert clicked for item:', item)
    setItemToRevert(item)

    // First, get available backups for this endpoint
    try {
      const backupsResponse = await dispatch(listBackupsApi(item._id))
      console.log('backupsResponse', backupsResponse.data.data[0])

      if (backupsResponse.status === 200 && backupsResponse.data.data.length > 0) {
        console.log("first")

        // Sort backups by creation date (most recent first)
        const sortedBackups = backupsResponse.data.data.sort((a, b) =>
          new Date(b.backup_created_on) - new Date(a.backup_created_on)
        );

        setAvailableBackups(sortedBackups)

        // Automatically select the most recent backup (first in sorted array)
        const mostRecentBackup = sortedBackups[0];
        setSelectedBackupRefId(mostRecentBackup.backup_ref_id)

        setShowBackupsList(true)
        setShowRevertModal(true)
        setRevertReason('')
      } else {
        Swal.fire({
          icon: 'info',
          title: 'No Backups Available',
          text: 'No backup data found for this location. you didnot start for this location',
          confirmButtonColor: '#2ba92b'
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to retrieve backup information. Please try again.',
        confirmButtonColor: '#d33'
      })
    }
  }



  // Handle revert confirmation
  const handleRevertConfirm = async () => {
    if (!revertReason.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Reason Required',
        text: 'Please provide a reason for reverting the data.',
      })
      return
    }

    if (!selectedBackupRefId) {
      Swal.fire({
        icon: 'warning',
        title: 'Backup Selection Required',
        text: 'Please select a backup to revert from.',
      })
      return
    }

    if (!itemToRevert) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No item selected for revert.',
      })
      return
    }

    setIsReverting(true)

    try {
      // Show progress
      Swal.fire({
        title: 'Reverting Data from Backup...',
        html: `
                <div style="text-align: left;">
                    <p><i class="bx bx-history"></i> Restoring data for: <strong>${itemToRevert.loc_name}</strong></p>
                    <p><i class="bx bx-data"></i> From backup: <strong>${selectedBackupRefId}</strong></p>
                    <p><i class="bx bx-loader bx-spin"></i> This may take a few moments...</p>
                </div>
            `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      // Call the revert API
      const responseData = await dispatch(revertAuditDataApi(
        selectedBackupRefId,
        revertReason.trim(),
        publishedAuditData
      ))
      console.log('responseDatarevertAuditDataApi', responseData)

      if (responseData.status === 200) {
        // Update local state with reverted data
        const updatedEndpoints = endpoints.map(ep =>
          ep.id === itemToRevert.id
            ? {
              ...ep,
              audit_status_id: "1",
              audit_status_name: "In Progress",
              audit_cp_status: "1"
            }
            : ep
        )

        const updatedStatusFilteredData = statusBasedFilteredData.map(item =>
          item.not_started_countid === itemToRevert.id
            ? {
              ...item,
              audit_status_id: "1",
              audit_status_name: "In Progress",
              audit_cp_status: "1"
            }
            : item
        )

        // Update all the state with reverted data
        setEndpoints(updatedEndpoints)
        setStatusBasedFilterdData(updatedStatusFilteredData)

        // Recalculate status info
        const updatedStatusInfo = await updateStatusInfo(updatedEndpoints)
        setStatusInfo(updatedStatusInfo)

        // Close modal and reset
        setShowRevertModal(false)
        setItemToRevert(null)
        setShowBackupsList(false)
        setAvailableBackups([])

        // Show success message
        const restoreInfo = responseData.data?.data?.restore_info;

        Swal.fire({
          icon: 'success',
          title: 'Data Reverted Successfully',
          html: `
                    <div style="text-align: left;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                            <h6 style="color: #28a745; margin-bottom: 10px;"><i class="bx bx-check-circle"></i> Revert Completed</h6>
                            <p><strong>Location:</strong> ${itemToRevert.loc_name}</p>
                            <p><strong>Status Changed:</strong> Not Started → In Progress</p>
                            <p><strong>Checkpoints Restored:</strong> ${restoreInfo?.checkpoints_restored || 0}</p>
                            <p><strong>Reason:</strong> ${revertReason}</p>
                            <p><strong>Reverted by:</strong> ${authUser?.user_data?.fullname || 'Unknown'}</p>
                        </div>
                        
                        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
                            <h6 style="color: #28a745; margin-bottom: 10px;"><i class="bx bx-history"></i> Restore Information</h6>
                            <p><strong>Backup Reference:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 4px;">${restoreInfo?.backup_ref_id || 'N/A'}</code></p>
                            <p><strong>Restored On:</strong> ${new Date(restoreInfo?.restored_on || new Date()).toLocaleString()}</p>
                            <p style="font-size: 12px; color: #666; margin-bottom: 0;">
                                <i class="bx bx-info-circle"></i> Your audit data has been successfully restored from the selected backup.
                            </p>
                        </div>
                    </div>
                `,
          width: 600,
          timer: 8000,
          showConfirmButton: true,
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745'
        })

        // Log the revert action
        console.log('Audit data reverted successfully:', {
          locationId: itemToRevert.id,
          locationName: itemToRevert.loc_name,
          backupRefId: selectedBackupRefId,
          newStatus: 'In Progress',
          reason: revertReason,
          timestamp: new Date().toISOString(),
          user: authUser?.user_data?.fullname || 'Unknown',
          restoreInfo: restoreInfo
        })

        // Refresh data to ensure consistency
        fetchData()

      } else {
        throw new Error(responseData.message || 'Failed to revert audit data')
      }

    } catch (error) {
      console.error('Error reverting audit data:', error)

      Swal.fire({
        icon: 'error',
        title: 'Revert Failed',
        html: `
                <div style="text-align: left;">
                    <p><strong>Error:</strong> ${error.message || 'Failed to revert audit data. Please try again.'}</p>
                    <p style="font-size: 12px; color: #666;">
                        <i class="bx bx-info-circle"></i> No changes were made to your data.
                    </p>
                </div>
            `,
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      })
    } finally {
      setIsReverting(false)
    }
  }

  // Handle revert cancel
  const handleRevertCancel = () => {
    setShowRevertModal(false)
    setRevertReason('')
    setItemToRevert(null)
    setShowBackupsList(false)
    setAvailableBackups([])
    setSelectedBackupRefId('')
  }





  const handleClearCancel = () => {
    setShowClearModal(false)
    setClearReason('')
    setItemToClear(null) // Reset the item to clear

  }


  // Get items that can be reset (not "Not Started" status)
  const getResettableItems = () => {
    return statusBasedFilteredData.filter(item => item.audit_status_id !== "0")
  }

  // Get items that can be reverted ("Not Started" status)
  const getRevertableItems = () => {
    return statusBasedFilteredData.filter(item => item.audit_status_id === "0")
  }



  const handleResetAllClick = () => {
    const resettableItems = getResettableItems()
    if (resettableItems.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Items to Reset',
        text: 'There are no items available for reset. Only items with status other than "Not Started" can be reset.',
        confirmButtonColor: '#2ba92b'
      })
      return
    }

    // Initialize with all items selected by default
    const allItemIds = resettableItems.map(item => item._id)
    setSelectedItemsForReset(allItemIds)
    setSelectAllForReset(true) // Set to true by default
    setResetAllReason('')
    setShowResetAllModal(true)
  }




  const handleRevertAllClick = () => {
    const revertableItems = getRevertableItems()
    if (revertableItems.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Items to Revert',
        text: 'There are no items available for revert. Only items with "Not Started" status can be reverted.',
        confirmButtonColor: '#2ba92b'
      })
      return
    }

    // Initialize with all items selected by default
    const allItemIds = revertableItems.map(item => item._id)
    setSelectedItemsForRevert(allItemIds)
    setSelectAllForRevert(true) // Set to true by default
    setRevertAllReason('')
    setShowRevertAllModal(true)
  }


  const handleSelectAllForReset = (checked) => {
    setSelectAllForReset(checked)
    if (checked) {
      setSelectedItemsForReset(getResettableItems().map(item => item._id))
    } else {
      setSelectedItemsForReset([])
    }
  }


  const handleSelectAllForRevert = (checked) => {
    setSelectAllForRevert(checked)
    if (checked) {
      setSelectedItemsForRevert(getRevertableItems().map(item => item._id))
    } else {
      setSelectedItemsForRevert([])
    }
  }





  // 6. Update individual selection handlers to properly manage "Select All" state
  const handleResetItemSelection = (itemId, checked) => {
    if (checked) {
      setSelectedItemsForReset(prev => {
        const newSelection = [...prev, itemId]
        // Check if all items are now selected
        if (newSelection.length === getResettableItems().length) {
          setSelectAllForReset(true)
        }
        return newSelection
      })
    } else {
      setSelectedItemsForReset(prev => prev.filter(id => id !== itemId))
      setSelectAllForReset(false)
    }
  }


  const handleRevertItemSelection = (itemId, checked) => {
    if (checked) {
      setSelectedItemsForRevert(prev => {
        const newSelection = [...prev, itemId]
        // Check if all items are now selected
        if (newSelection.length === getRevertableItems().length) {
          setSelectAllForRevert(true)
        }
        return newSelection
      })
    } else {
      setSelectedItemsForRevert(prev => prev.filter(id => id !== itemId))
      setSelectAllForRevert(false)
    }
  }

  // Handle Reset All confirmation
  const handleResetAllConfirm = async () => {
    if (!resetAllReason.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Reason Required',
        text: 'Please provide a reason for resetting the data.',
      })
      return
    }

    if (selectedItemsForReset.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Items Selected',
        text: 'Please select at least one item to reset.',
      })
      return
    }

    setIsResettingAll(true)

    try {
      const itemsToReset = getResettableItems().filter(item => selectedItemsForReset.includes(item._id))

      // Show progress
      Swal.fire({
        title: 'Resetting Multiple Items...',
        html: `
        <div style="text-align: left;">
          <p><i class="bx bx-data"></i> Resetting ${itemsToReset.length} items...</p>
          <p><i class="bx bx-loader bx-spin"></i> Creating backups and resetting data...</p>
          <div id="progress-info"></div>
        </div>
      `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      let successCount = 0
      let failCount = 0
      const failedItems = []

      // Process items one by one
      for (let i = 0; i < itemsToReset.length; i++) {
        const item = itemsToReset[i]

        // Update progress
        const progressEl = document.getElementById('progress-info')
        if (progressEl) {
          progressEl.innerHTML = `<small>Processing: ${item.loc_name} (${i + 1}/${itemsToReset.length})</small>`
        }

        try {
          const responseData = await dispatch(clearAuditDataApi(
            item,
            publishedAuditData,
            resetAllReason.trim()
          ))

          if (responseData.status === 200) {
            successCount++
          } else {
            failCount++
            failedItems.push(item.loc_name)
          }
        } catch (error) {
          failCount++
          failedItems.push(item.loc_name)
          console.error(`Error resetting ${item.loc_name}:`, error)
        }
      }

      // Update local state - remove successfully reset items
      const successfullyResetIds = itemsToReset.slice(0, successCount).map(item => item._id)
      const updatedEndpoints = endpoints.filter(ep => !successfullyResetIds.includes(ep._id))
      const updatedStatusFilteredData = statusBasedFilteredData.filter(item => !successfullyResetIds.includes(item._id))
      const updatedChecked = checked.filter(id => {
        const item = endpoints.find(ep => ep.loc_ref_id === id)
        return item && !successfullyResetIds.includes(item._id)
      })

      setEndpoints(updatedEndpoints)
      setStatusBasedFilterdData(updatedStatusFilteredData)
      setChecked(updatedChecked)

      // Recalculate status info
      const updatedStatusInfo = await updateStatusInfo(updatedEndpoints)
      setStatusInfo(updatedStatusInfo)

      // Close modal
      setShowResetAllModal(false)
      setSelectedItemsForReset([])

      // Show results
      Swal.fire({
        icon: successCount > 0 ? 'success' : 'error',
        title: 'Bulk Reset Complete',
        html: `
        <div style="text-align: left;">
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h6 style="color: #28a745; margin-bottom: 10px;"><i class="bx bx-check-circle"></i> Reset Summary</h6>
            <p><strong>Successfully Reset:</strong> ${successCount} items</p>
            ${failCount > 0 ? `<p><strong>Failed:</strong> ${failCount} items</p>` : ''}
            <p><strong>Total Processed:</strong> ${itemsToReset.length} items</p>
            <p><strong>Reason:</strong> ${resetAllReason}</p>
            <p><strong>Reset by:</strong> ${authUser?.user_data?.fullname || 'Unknown'}</p>
          </div>
          
          ${failCount > 0 ? `
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h6 style="color: #856404; margin-bottom: 10px;"><i class="bx bx-warning"></i> Failed Items</h6>
              <p style="font-size: 12px;">${failedItems.join(', ')}</p>
            </div>
          ` : ''}
        </div>
      `,
        width: 600,
        timer: 8000,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#28a745'
      })

      // Refresh data
      fetchData()

    } catch (error) {
      console.error('Error in bulk reset:', error)
      Swal.fire({
        icon: 'error',
        title: 'Bulk Reset Failed',
        text: 'An error occurred during bulk reset. Please try again.',
        confirmButtonColor: '#d33'
      })
    } finally {
      setIsResettingAll(false)
    }
  }

  // Handle Revert All confirmation
  const handleRevertAllConfirm = async () => {
    if (!revertAllReason.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Reason Required',
        text: 'Please provide a reason for reverting the data.',
      })
      return
    }

    if (selectedItemsForRevert.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Items Selected',
        text: 'Please select at least one item to revert.',
      })
      return
    }

    setIsRevertingAll(true)

    try {
      const itemsToRevert = getRevertableItems().filter(item => selectedItemsForRevert.includes(item._id))

      // Show progress
      Swal.fire({
        title: 'Reverting Multiple Items...',
        html: `
        <div style="text-align: left;">
          <p><i class="bx bx-history"></i> Reverting ${itemsToRevert.length} items...</p>
          <p><i class="bx bx-loader bx-spin"></i> Restoring from backups...</p>
          <div id="progress-info"></div>
        </div>
      `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      let successCount = 0
      let failCount = 0
      const failedItems = []

      // Process items one by one
      for (let i = 0; i < itemsToRevert.length; i++) {
        const item = itemsToRevert[i]

        // Update progress
        const progressEl = document.getElementById('progress-info')
        if (progressEl) {
          progressEl.innerHTML = `<small>Processing: ${item.loc_name} (${i + 1}/${itemsToRevert.length})</small>`
        }

        try {
          // Get the most recent backup for this item
          const backupsResponse = await dispatch(listBackupsApi(item._id))

          if (backupsResponse.status === 200 && backupsResponse.data.data.length > 0) {
            const sortedBackups = backupsResponse.data.data.sort((a, b) =>
              new Date(b.backup_created_on) - new Date(a.backup_created_on)
            )
            const mostRecentBackup = sortedBackups[0]

            const responseData = await dispatch(revertAuditDataApi(
              mostRecentBackup.backup_ref_id,
              revertAllReason.trim(),
              publishedAuditData
            ))

            if (responseData.status === 200) {
              successCount++
            } else {
              failCount++
              failedItems.push(item.loc_name)
            }
          } else {
            failCount++
            failedItems.push(`${item.loc_name} (No backup found)`)
          }
        } catch (error) {
          failCount++
          failedItems.push(item.loc_name)
          console.error(`Error reverting ${item.loc_name}:`, error)
        }
      }

      // Close modal
      setShowRevertAllModal(false)
      setSelectedItemsForRevert([])

      // Show results
      Swal.fire({
        icon: successCount > 0 ? 'success' : 'error',
        title: 'Bulk Revert Complete',
        html: `
        <div style="text-align: left;">
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h6 style="color: #28a745; margin-bottom: 10px;"><i class="bx bx-check-circle"></i> Revert Summary</h6>
            <p><strong>Successfully Reverted:</strong> ${successCount} items</p>
            ${failCount > 0 ? `<p><strong>Failed:</strong> ${failCount} items</p>` : ''}
            <p><strong>Total Processed:</strong> ${itemsToRevert.length} items</p>
            <p><strong>Reason:</strong> ${revertAllReason}</p>
            <p><strong>Reverted by:</strong> ${authUser?.user_data?.fullname || 'Unknown'}</p>
          </div>
          
          ${failCount > 0 ? `
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h6 style="color: #856404; margin-bottom: 10px;"><i class="bx bx-warning"></i> Failed Items</h6>
              <p style="font-size: 12px;">${failedItems.join(', ')}</p>
            </div>
          ` : ''}
        </div>
      `,
        width: 600,
        timer: 8000,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#28a745'
      })

      // Refresh data
      fetchData()

    } catch (error) {
      console.error('Error in bulk revert:', error)
      Swal.fire({
        icon: 'error',
        title: 'Bulk Revert Failed',
        text: 'An error occurred during bulk revert. Please try again.',
        confirmButtonColor: '#d33'
      })
    } finally {
      setIsRevertingAll(false)
    }
  }

  // Cancel handlers
  const handleResetAllCancel = () => {
    setShowResetAllModal(false)
    setResetAllReason('')
    setSelectedItemsForReset([])
    setSelectAllForReset(false)
  }

  const handleRevertAllCancel = () => {
    setShowRevertAllModal(false)
    setRevertAllReason('')
    setSelectedItemsForRevert([])
    setSelectAllForRevert(false)
  }

  const handleEndpointExpanded = (expandedValue) => {
    console.log(expandedValue, 'expandedValue');
    setExpanded(expandedValue);
  };

  const columns = useMemo(() => {
    const cols = [
      {
        accessor: 'name',
        Header: 'Location / Assets',
        filterable: true,
        Cell: (cellProps) => {
          var item = cellProps.row.original
          return (
            <>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className={item.active == "1" ? "font-size-12 text-dark fw-bold" : "font-size-12 text-black-50"} style={{ marginBottom: 5 }}>
                  <i
                    className={
                      item.status === '0'
                        ? "mdi mdi-circle text-secondary font-size-10" :
                        item.status === '1' ?
                          "mdi mdi-circle text-warning font-size-10" :
                          item.status === '2' ?
                            "mdi mdi-circle text-success font-size-10" :
                            item.status === '3' ?
                              "mdi mdi-circle text-info font-size-10" : "mdi mdi-circle text-primary font-size-10"
                    }
                  />{" "} {item.loc_name}
                </div>
                <div>
                  <span className="font-size-10">Audit started on - {item.audit_started_on === null ? "-- / -- / --" : moment(item.audit_started_on).format("DD/MM/YYY")}</span> <br />
                  <span className="font-size-10">Audit submitted on - {item.audit_submitted_on === null ? "-- / -- / --" : moment(item.audit_submitted_on).format("DD/MM/YYY")}</span> <br />
                  <span className="font-size-10">Audit reviewed on - {item.audit_reviewed_on === null ? "-- / -- / --" : moment(item.audit_reviewed_on).format("DD/MM/YYY")}</span> <br />
                </div>
              </div>
            </>
          )
        }
      },
      {
        accessor: 'audit_pdb_total_cp',
        Header: 'Check points',
        Cell: (cellProps) => {
          var item = cellProps.row.original
          return (
            <>
              <span className={item.active == "1" ? "font-size-14 text-dark" : "font-size-14 text-black-50"}>{item.audit_pdb_total_cp}</span>
            </>
          )
        }
      },
      {
        accessor: 'audit_pbd_ends_on',
        Header: 'Completes On',
        Cell: (cellProps) => {
          var item = cellProps.row.original
          return (
            <>
              <span className={item.active == "1" ? "font-size-14 text-dark" : "font-size-14 text-black-50"}>{moment(item.audit_pbd_ends_on).format("DD/MM/YYYY")}</span>
            </>
          )
        }
      },
      {
        accessor: 'audit_pbd_users',
        Header: 'Audit assigned to',
        Cell: (cellProps) => {
          var item = cellProps.row.original
          var users = _.filter(item.audit_pbd_users, { audit_type: "1" })
          return (
            <>
              <div className="font-size-11">
                {users.length === 0 ? (
                  <span className="text-black-50">No users assigned</span>
                ) : (
                  users.map((user, index) => (
                    <span key={index}>
                      <span className={item.active === "1" ? "" : "text-black-50"}>
                        {user.name}
                        {user?.user_code ? ` (${user.user_code})` : ""}
                      </span>
                      <span className={item.active === "1" ? "text-primary" : "text-black-50"}>
                        {" "} - {user.designation}
                      </span>
                      {index < users.length - 1 && <span className="mx-1">, </span>}
                      <br />
                    </span>
                  ))
                )}
              </div>
            </>
          );
        }
      },
      {
        accessor: 'inch_pbd_users',
        Header: 'Incharge assigned to',
        Cell: (cellProps) => {
          var item = cellProps.row.original
          var users = _.filter(item.audit_pbd_users, { audit_type: "3" })
          return (
            <>
              <div className="font-size-11">
                {users.length === 0 ? (
                  <span className="text-black-50">No users assigned</span>
                ) : (
                  users.map((user, index) => (
                    <span key={index}>
                      <span className={item.active === "1" ? "" : "text-black-50"}>
                        {user.name}
                        {user?.user_code ? ` (${user.user_code})` : ""}
                      </span>
                      <span className={item.active === "1" ? "text-primary" : "text-black-50"}>
                        {" "} - {user.designation}
                      </span>
                      {index < users.length - 1 && <span className="mx-1">, </span>}
                      <br />
                    </span>
                  ))
                )}
              </div>
            </>
          );
        }
      },
    ]

    if (publishedAuditData.settings.enable_review) {
      cols.push({
        accessor: 'audit_pbd_users_',
        Header: 'Review assigned to',
        hidden: publishedAuditData?.settings?.enable_review === false ? false : true,
        Cell: (cellProps) => {
          var item = cellProps.row.original
          var getUser = _.find(item.audit_pbd_users, { audit_type: "2" })
          console.log(getUser, 'getUser', item, publishedAuditData);
          return (
            <>
            </>
          )
        }
      })
    }

    cols.push(
      {
        accessor: 'status',
        Header: 'Status',
        Cell: (cellProps) => {
          var item = cellProps.row.original
          return (
            <>
              <span className={item.audit_status_id === "0" ? "badge badge-soft-secondary font-size-11 m-1" :
                item.audit_status_id === "1" ? "badge badge-soft-warning font-size-11 m-1" : item.audit_status_id === "2" ? "badge badge-soft-success font-size-11 m-1" : item.audit_status_id === "3" ? "badge badge-soft-info font-size-11 m-1" : "badge badge-soft-primary font-size-11 m-1"}
              >
                {item.audit_status_id === "0" ? "Not started" : item.audit_status_id === "1" ? "In progress" : item.audit_status_id === "2" ? "Completed" : item.audit_status_id === "3" ? "Submitted" : "Reviewed"}
              </span>
            </>
          )
        }
      },
      {
        accessor: "menu",
        Header: "Edit / Modify / View",
        Cell: (cellProps) => {
          var item = cellProps.row.original
          return (
            <div className="d-flex gap-3" style={{ display: 'flex', alignContent: 'center' }}>
              <div className="d-flex gap-1">
                {
                  item.active === "1" && item.status !== "3" && item.status !== "4" ?
                    <>
                      <button id={`edit-btn-${item._id}`} className={`btn btn-sm btn-soft-primary`} title="Edit" onClick={() => {
                        setOpen(true)
                        setenableEdit(true)
                        setepData(item)
                      }}>
                        <i className="bx bx-edit-alt font-size-12" />
                      </button>
                      <UncontrolledTooltip target={`edit-btn-${item._id}`}>
                        Edit
                      </UncontrolledTooltip>
                    </>
                    : null
                }
                {item.status !== "3" && item.status !== "4" ?
                  <>
                    <Link className={item.active == "1" ? "btn btn-soft-danger btn-sm" : "btn btn-soft-info btn-sm"} to="#" onClick={() => {
                      activeInactive(item)
                    }}>{item.active === "0" ? "Active" : "Make Inactive"}</Link>
                  </>
                  : null}
              </div>
            </div>
          )
        },
      },
      {
        accessor: "report",
        Header: "Report",
        Cell: (cellProps) => {
          var item = cellProps.row.original
          return (
            <div className="d-flex gap-3" style={{ display: 'flex', alignContent: 'center' }}>
              <div className="d-flex gap-1">
                <button id={`report-btn-${item._id}`} className={item.active == "1" ? "btn btn-soft-primary btn-sm" : "btn btn-soft-secondary btn-sm"} title="Report" onClick={() => {
                  //  this.showEndpointReport(item) 
                }}>
                  Report
                </button>
                <UncontrolledTooltip target={`report-btn-${item._id}`}>
                  View report for this item
                </UncontrolledTooltip>
              </div>
            </div>
          )
        }
      },




      {
        accessor: "reset_revert",
        Header: "Reset/Revert",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          console.log('item842', item._id)

          // Determine if item can be reverted (status "0" - Not Started) or reset (other statuses)
          const canRevert = item.audit_status_id === "0";
          const canReset = item.audit_status_id !== "0";

          // Determine which action is currently processing
          const isProcessingReset = isClearing && itemToClear?.id === item._id;
          const isProcessingRevert = isReverting && itemToRevert?.id === item._id;
          const isProcessing = isProcessingReset || isProcessingRevert;

          return (
            <div className="d-flex gap-3" style={{ display: 'flex', alignContent: 'center' }}>
              <div className="d-flex gap-1">
                {canRevert && item?.reset_status === "1" ? (
                  // Show Revert button for cleared items (status "0")
                  <>
                    <button
                      id={`revert-btn-${item._id}`}
                      className="btn btn-soft-info btn-sm"
                      onClick={() => handlerevertclick(item)}
                      disabled={isProcessing}
                    >
                      {isProcessingRevert ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          Reverting...
                        </>
                      ) : (
                        <>
                          <i className="bx bx-history me-1"></i>
                          Revert
                        </>
                      )}
                    </button>
                    <UncontrolledTooltip target={`revert-btn-${item._id}`}>
                      Restore data from backup for this location
                    </UncontrolledTooltip>
                  </>
                ) : canReset ? (
                  // Show Reset button for all other statuses  
                  <>
                    <button
                      id={`reset-btn-${item._id}`}
                      className="btn btn-soft-dark btn-sm"
                      onClick={() => handleClearClick(item)}
                      disabled={isProcessing}
                    >
                      {isProcessingReset ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          Resetting...
                        </>
                      ) : (
                        <>
                          <i className="bx bx-reset me-1"></i>
                          Reset
                        </>
                      )}
                    </button>
                    <UncontrolledTooltip target={`reset-btn-${item._id}`}>
                      Reset data for this location (creates backup)
                    </UncontrolledTooltip>
                  </>
                ) : (
                  // Fallback for any edge cases
                  <>
                    <button
                      id={`action-disabled-btn-${item._id}`}
                      className="btn btn-soft-secondary btn-sm"
                      disabled={true}
                    >
                      <i className="bx bx-block me-1"></i>
                      No Action
                    </button>
                    <UncontrolledTooltip target={`action-disabled-btn-${item._id}`}>
                      No reset or revert action available for this status
                    </UncontrolledTooltip>
                  </>
                )}
              </div>
            </div>
          );
        }
      }


    )
    return cols;
  }, [])

  const updateEPData = (updatedData) => {
    console.log(updatedData, 'updatedData')
  }

  const filterStatus = (data) => {
    var filteredData;
    if (data == "Not started") {
      filteredData = _.filter(endpoints, { "audit_status_id": "0" })
    }
    else
      if (data == "In progress") {
        filteredData = _.filter(endpoints, { "audit_status_id": "1" })
      }
      else
        if (data == "Completed") {
          filteredData = _.filter(endpoints, { "audit_status_id": "2" })
        }
        else
          if (data == "Submitted") {
            filteredData = _.filter(endpoints, { "audit_status_id": "3" })
          }
          else
            if (data == "Reviewed") {
              filteredData = _.filter(endpoints, { "audit_status_id": "7" })
            }
            else
              if (data == "All") {
                filteredData = endpoints
              }
    setStatusBasedFilterdData(filteredData)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Published Audit | AuditVista</title>
        </MetaTags>
        <Breadcrumb
          title={"Published Audit"}
          isBackButtonEnable={true}
          gotoBack={() => {
            navigate(`${publishedAuditData.repeat_mode_config.mode_id === "0" ? "/mngpblhtempt" : "/scheduled-audit"}`)
          }}
          breadcrumbItem="Template"
        />

        <Container fluid>


          <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
            <div style={{
              width: '240px',
              minWidth: '240px',
              boxSizing: 'border-box',
              borderRight: '1px solid #ccc'
            }}>

              <Card className="h-100">

                <CardBody>
                  {
                    console.log(locationData, 'locationData', checked, expanded)
                  }
                  <CheckboxTree
                    nodes={locationData}
                    checked={checked}
                    expanded={expanded}
                    onCheck={(checked, targetNode) => {
                      getNodeEndpoints(targetNode, checked);
                    }}
                    onExpand={expanded =>
                      handleEndpointExpanded(expanded)
                    }
                    icons={icons}
                    showNodeIcon={false}
                    showExpandAll
                  />
                </CardBody>
              </Card>
            </div>

            <div style={{
              flex: 1,
              boxSizing: 'border-box',
              overflowY: 'auto'
            }}>
              <Card className="h-100">
                <CardBody>
                  {/* <div className="d-flex gap-2 mb-3">
                    <Button
                      color="dark"
                      size="sm"
                      onClick={handleResetAllClick}
                      disabled={getResettableItems().length === 0}
                    >
                      <i className="bx bx-reset me-1"></i>
                      Reset All ({getResettableItems().length})
                    </Button>
                    <Button
                      color="info"
                      size="sm"
                      onClick={handleRevertAllClick}
                      disabled={getRevertableItems().length === 0}
                    >
                      <i className="bx bx-history me-1"></i>
                      Revert All ({getRevertableItems().length})
                    </Button>
                  </div> */}
                  <div className="d-flex gap-2 mb-3">
                    {!showRevertButton ? (
                      // Show only Reset All button initially
                      <Button
                        color="dark"
                        size="sm"
                        onClick={handleResetAllClick}
                        disabled={getResettableItems().length === 0}
                      >
                        <i className="bx bx-reset me-1"></i>
                        Reset All ({getResettableItems().length})
                      </Button>
                    ) : (
                      // Show both buttons after reset is completed
                      <>

                        <Button
                          color="info"
                          size="sm"
                          onClick={handleRevertAllClick}
                          disabled={getRevertableItems().length === 0}
                        >
                          <i className="bx bx-history me-1"></i>
                          Revert All ({getRevertableItems().length})
                        </Button>
                      </>
                    )}
                  </div>
                  <TableContainer
                    columns={columns}
                    data={statusBasedFilteredData}
                    isGlobalFilter={true}
                    isAddOptions={false}
                    isJobListGlobalFilter={false}
                    customPageSize={10}
                    isPagination={true}
                    tableClass="align-middle table-nowrap table-check"
                    theadClass="table-light"
                    pagination="pagination pagination-rounded justify-content-end my-2"
                    total_audit={statusBasedFilteredData.length}
                    not_started_count={statusInfo.not_started_count}
                    in_progress_count={statusInfo.in_progress_count}
                    completed_count={statusInfo.completed_count}
                    submitted_count={statusInfo.submitted_count}
                    reviewed_count={statusInfo.reviewed_count}
                    filterStatus={(data) => filterStatus(data)}
                    publishedAuditData={publishedAuditData}
                    onClickChangeAuditEndDate={() => {
                      // this.setState({ updatePbdAudit: true, open: true })
                    }}
                  />
                </CardBody>
              </Card>
            </div>
          </div>
        </Container>
      </div>

      {/* Edit Offcanvas */}
      <Offcanvas
        isOpen={open}
        toggle={onDrawerClose}
        direction="end"
        className="drawer-open"
        style={{ maxHeight: window.innerHeight, overflowY: 'auto', padding: '10px' }}
      >
        {
          console.log(enableEdit, 'enableEdit', open)
        }
        <OffcanvasHeader toggle={onDrawerClose}>
          {
            enableEdit &&
            "Edit Location / Assets"
          }
        </OffcanvasHeader>
        <OffcanvasBody>
          {
            enableEdit && (
              <EditEndpoints
                epdata={epData}
                user_data={authUser.user_data}
                audit_data={publishedAuditData}
                onClose={onDrawerClose}
                updateEPData={updateEPData}
              />
            )}
        </OffcanvasBody>
      </Offcanvas>
      <Modal isOpen={showClearModal} toggle={handleClearCancel} centered>
        <ModalHeader toggle={handleClearCancel}>
          <i className="bx bx-warning text-warning me-2"></i>
          Confirm Reset Data
        </ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <p className="text-muted mb-3">
              Are you sure you want to reset data for <strong>"{itemToClear?.loc_name}"</strong>?
              This action cannot be undone.
            </p>
            <Label htmlFor="clearReason" className="form-label">
              Reason for Reset data <span className="text-danger">*</span>
            </Label>
            <Input
              type="textarea"
              id="clearReason"
              placeholder="Please provide a reason for reset the data..."
              value={clearReason}
              onChange={(e) => setClearReason(e.target.value)}
              rows={3}
              maxLength={1000}
            />
            <div className="text-muted small mt-1">
              {clearReason.length}/1000 characters
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={handleClearCancel}
            disabled={isClearing}
          >
            Cancel
          </Button>
          <Button
            color="danger" // Changed to danger color
            onClick={handleClearConfirm}
            disabled={isClearing || !clearReason.trim()}
          >
            {isClearing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                reset...
              </>
            ) : (
              <>
                <i className="bx bx-trash me-1"></i>
                Reset Location Data
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={showRevertModal} toggle={handleRevertCancel} centered size="lg">
        <ModalHeader toggle={handleRevertCancel}>
          <i className="bx bx-history text-info me-2"></i>
          Revert Data from Backup
        </ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <p className="text-muted mb-3">
              Restore data for <strong>"{itemToRevert?.loc_name}"</strong> from a previous backup.
              This will restore the endpoint status to "In Progress" and recover all checkpoint data.
            </p>

            {/* Backup Selection */}
            {showBackupsList && availableBackups.length > 0 && (
              <div className="mb-3">
                <Label className="form-label">
                  Select Backup to Restore From <span className="text-danger">*</span>
                </Label>
                <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {availableBackups.map((backup, index) => (
                    <div key={backup.backup_ref_id} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="selectedBackup"
                        id={`backup-${index}`}
                        value={backup.backup_ref_id}
                        defaultChecked={selectedBackupRefId === backup.backup_ref_id}
                        onChange={(e) => setSelectedBackupRefId(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor={`backup-${index}`}>
                        <div>
                          <strong>Backup ID:</strong> <code>{backup.backup_ref_id}</code>
                          <br />
                          <small className="text-muted">
                            <strong>Created:</strong> {new Date(backup.backup_created_on).toLocaleString()}
                            <br />
                            <strong>By:</strong> {backup.backup_created_by_name}
                            <br />
                            <strong>Reason:</strong> {backup.backup_reason}
                            <br />
                            <strong>Original Status:</strong> {backup.original_status.audit_status_name}
                          </small>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reason Input */}
            <Label htmlFor="revertReason" className="form-label">
              Reason for Reverting Data <span className="text-danger">*</span>
            </Label>
            <Input
              type="textarea"
              id="revertReason"
              placeholder="Please provide a reason for reverting the data..."
              value={revertReason}
              onChange={(e) => setRevertReason(e.target.value)}
              rows={3}
              maxLength={1000}
            />
            <div className="text-muted small mt-1">
              {revertReason.length}/1000 characters
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={handleRevertCancel}
            disabled={isReverting}
          >
            Cancel
          </Button>
          <Button
            color="info"
            onClick={handleRevertConfirm}
          // disabled={isReverting || !revertReason.trim() || !selectedBackupRefId}
          >
            {isReverting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Reverting...
              </>
            ) : (
              <>
                <i className="bx bx-history me-1"></i>
                Revert from Backup
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={showResetAllModal} toggle={handleResetAllCancel} centered size="lg">
        <ModalHeader toggle={handleResetAllCancel}>
          <i className="bx bx-warning text-warning me-2"></i>
          Bulk Reset Data
        </ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <p className="text-muted mb-3">
              Select items to reset. This will create backups and reset the selected items to "Not Started" status.
            </p>


            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="selectAllReset"
                checked={selectAllForReset} // Changed from defaultChecked to checked
                onChange={(e) => handleSelectAllForReset(e.target.checked)}
              />
              <label className="form-check-label fw-bold" htmlFor="selectAllReset">
                Select All ({getResettableItems().length} items)
              </label>
            </div>




            <div className="border rounded p-3 mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {getResettableItems().map((item, index) => (
                <div key={item._id} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`reset-item-${index}`}
                    checked={selectedItemsForReset.includes(item._id)} // Changed from defaultChecked to checked
                    onChange={(e) => handleResetItemSelection(item._id, e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor={`reset-item-${index}`}>
                    <div>
                      <strong>{item.loc_name}</strong>
                      <br />
                      <small className="text-muted">
                        Status: <span className={
                          item.audit_status_id === "1" ? "badge badge-soft-warning" :
                            item.audit_status_id === "2" ? "badge badge-soft-success" :
                              item.audit_status_id === "3" ? "badge badge-soft-info" :
                                "badge badge-soft-primary"
                        }>
                          {item.audit_status_id === "1" ? "In Progress" :
                            item.audit_status_id === "2" ? "Completed" :
                              item.audit_status_id === "3" ? "Submitted" : "Reviewed"}
                        </span>
                      </small>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            {/* Reason Input */}
            <Label htmlFor="resetAllReason" className="form-label">
              Reason for Bulk Reset <span className="text-danger">*</span>
            </Label>
            <Input
              type="textarea"
              id="resetAllReason"
              placeholder="Please provide a reason for resetting all selected items..."
              value={resetAllReason}
              onChange={(e) => setResetAllReason(e.target.value)}
              rows={3}
              maxLength={1000}
            />
            <div className="text-muted small mt-1">
              {resetAllReason.length}/1000 characters
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={handleResetAllCancel}
            disabled={isResettingAll}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={handleResetAllConfirm}
            disabled={isResettingAll || !resetAllReason.trim() || selectedItemsForReset.length === 0}
          >
            {isResettingAll ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Resetting...
              </>
            ) : (
              <>
                <i className="bx bx-reset me-1"></i>
                Reset {selectedItemsForReset.length} Items
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Revert All Modal */}
      <Modal isOpen={showRevertAllModal} toggle={handleRevertAllCancel} centered size="lg">
        <ModalHeader toggle={handleRevertAllCancel}>
          <i className="bx bx-history text-info me-2"></i>
          Bulk Revert Data
        </ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <p className="text-muted mb-3">
              Select items to revert from their most recent backups. This will restore the items to "In Progress" status.
            </p>


            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="selectAllRevert"
                defaultChecked={selectAllForRevert} // Changed from defaultChecked to checked
                onChange={(e) => handleSelectAllForRevert(e.target.checked)}
              />
              <label className="form-check-label fw-bold" htmlFor="selectAllRevert">
                Select All ({getRevertableItems().length} items)
              </label>
            </div>


            <div className="border rounded p-3 mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {getRevertableItems().map((item, index) => (
                <div key={item._id} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`revert-item-${index}`}
                    checked={selectedItemsForRevert.includes(item._id)} // Changed from defaultChecked to checked
                    onChange={(e) => handleRevertItemSelection(item._id, e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor={`revert-item-${index}`}>
                    <div>
                      <strong>{item.loc_name}</strong>
                      <br />
                      <small className="text-muted">
                        Status: <span className="badge badge-soft-secondary">Not Started</span>
                      </small>
                    </div>
                  </label>
                </div>
              ))}
            </div>


            {/* Reason Input */}
            <Label htmlFor="revertAllReason" className="form-label">
              Reason for Bulk Revert <span className="text-danger">*</span>
            </Label>
            <Input
              type="textarea"
              id="revertAllReason"
              placeholder="Please provide a reason for reverting all selected items..."
              value={revertAllReason}
              onChange={(e) => setRevertAllReason(e.target.value)}
              rows={3}
              maxLength={1000}
            />
            <div className="text-muted small mt-1">
              {revertAllReason.length}/1000 characters
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={handleRevertAllCancel}
            disabled={isRevertingAll}
          >
            Cancel
          </Button>
          <Button
            color="info"
            onClick={handleRevertAllConfirm}
            disabled={isRevertingAll || !revertAllReason.trim() || selectedItemsForRevert.length === 0}
          >
            {isRevertingAll ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Reverting...
              </>
            ) : (
              <>
                <i className="bx bx-history me-1"></i>
                Revert {selectedItemsForRevert.length} Items
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>

    </React.Fragment>
  )
}

export default PublishedReport;




// import React, { useEffect, useState, useMemo } from 'react'
// import { retriveAuditInfo } from 'toolkitStore/Auditvista/ManageAuditSlice'
// import { useDispatch } from 'react-redux'
// import TableContainer from './ReportComponents/TableContainer'
// import Breadcrumb from 'components/Common/Breadcrumb'
// import { MetaTags } from 'react-meta-tags'
// import { useNavigate, Link } from 'react-router-dom'
// import { Card, CardBody, Container, UncontrolledTooltip, Offcanvas, OffcanvasHeader, OffcanvasBody, Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input } from 'reactstrap'
// import { MdCheckBox, MdCheckBoxOutlineBlank, MdChevronRight, MdKeyboardArrowDown, MdAddBox, MdIndeterminateCheckBox, MdLocationCity, MdStore, MdFolder, MdCheckCircle, MdDescription } from "react-icons/md";
// import CheckboxTree, {
//   getNode, flattenNodes, deserializeLists, serializeList
// } from 'react-checkbox-tree';
// import './CSS/checkboxtree.css';
// import _ from 'lodash'
// var moment = require('moment')
// import EditEndpoints from './Components/EditEndpoints'
// import { updateEndpointApi,clearAuditDataApi, revertAuditDataApi,listBackupsApi } from 'toolkitStore/Auditvista/ManageAuditSlice'
// import Swal from 'sweetalert2'
// import UpdatePdbAuditInfo from './Components/UpdatePdbAuditInfo'

// const PublishedReport = () => {

//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const [publishedAuditData, setPublishedAuditData] = useState(JSON.parse(sessionStorage.getItem("publishedAuditData")))
//   const [authUser, setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
//   console.log(authUser,"authUser26")
//   const [locationData, setLocationData] = useState([])
//   const [auditList, setauditList] = useState([])
//   const [statusBasedFilteredData, setStatusBasedFilterdData] = useState([])
//   const [expanded, setExpanded] = useState([]);
//   const [endpoints, setEndpoints] = useState([]); // Assume endpoints are populated elsewhere
//   const [checked, setChecked] = useState([]);
//   const [statusInfo, setStatusInfo] = useState({});
//   const [open, setOpen] = useState(false)
//   const [updatePbdAudit,setupdatePbdAudit] = useState(false)
//   const [enableEdit, setenableEdit] = useState(false)
//   const [epData, setepData] = useState(null)
//   const [filterValue, setfilterValue] = useState('')

//   // Clear functionality states
//   const [showClearModal, setShowClearModal] = useState(false)
//   const [clearReason, setClearReason] = useState('')
//   const [isClearing, setIsClearing] = useState(false)
//   const [itemToClear, setItemToClear] = useState(null)
// const [showRevertModal, setShowRevertModal] = useState(false)
// const [revertReason, setRevertReason] = useState('')
// const [isReverting, setIsReverting] = useState(false)
// const [itemToRevert, setItemToRevert] = useState(null)
// const [availableBackups, setAvailableBackups] = useState([])
// const [selectedBackupRefId, setSelectedBackupRefId] = useState('')
// const [showBackupsList, setShowBackupsList] = useState(false)

//   const icons = {
//     check: <MdCheckBox className="rct-icon rct-icon-check text-success" />,
//     uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
//     halfCheck: (
//       <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />
//     ),
//     expandClose: (
//       <MdChevronRight className="" />
//     ),
//     expandOpen: (
//       <MdKeyboardArrowDown className="" />
//     ),
//     expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
//     collapseAll: (
//       <MdIndeterminateCheckBox className="" />
//     ),
//     parentClose: <MdLocationCity className="" />,
//     parentOpen: <MdLocationCity className="" />,
//     leaf: <MdStore className="" />
//   }

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     const response = await dispatch(retriveAuditInfo())
//     if (response) {
//       console.log(response, 'respons79e');
//       setStatusBasedFilterdData(response.data)
//       if (response.hData.length > 0) {
//         setLocationData(response.hData[0]["ep_structure"])
//       }
//       setEndpoints(response.data)
//       const statusData = await updateStatusInfo(response.data)
//       console.log(statusData, 'statusData');
//       setStatusInfo(statusData)
//     }
//   }

//   const updateStatusInfo = (endpoints) => {
//     const statusData = {
//       in_progress_count: _.filter(endpoints, { audit_status_id: "1" }).length,
//       not_started_count: _.filter(endpoints, { audit_status_id: "0" }).length,
//       completed_count: _.filter(endpoints, { audit_status_id: "2" }).length,
//       submitted_count: _.filter(endpoints, { audit_status_id: "3" }).length,
//       reviewed_count: _.filter(endpoints, { audit_status_id: "7" }).length,
//     }
//     return statusData
//   }

//   const showEndpointReport=(data)=> {
//         if (data.audit_status_id < "3") {
//             // this.setState({
//             //     showWarning: true,
//             //     submitMessage: "Audit is not submitted, you cannot view report"
//             // })
//         }
//         else {
//             sessionStorage.removeItem("endpointInfo");
//             sessionStorage.setItem("endpointInfo", JSON.stringify(data));
//             // this.props.history.push("/chkpntrprt");
//             navigate("/chkpntrprt")
//         }

//     }





//   const getNodeEndpoints = (data, check) => {
//     console.log('checkchecked', checked, check);

//     const extractValues = (node, key = "value") => {
//       const result = [];

//       const traverse = (item) => {
//         if (!item) return;
//         if (item[key] !== undefined) result.push(item[key]);
//         if (Array.isArray(item.children)) item.children.forEach(traverse);
//       };

//       traverse(data);
//       return result;
//     };

//     const mappedData = extractValues(data);
//     const endpointIds = endpoints.map(ep => ep.loc_ref_id);

//     console.log('endpointIds', endpointIds, data);

//     let updatedChecked = new Set(check);
//     const matchedIDs = endpointIds.filter(id => check.includes(id));
//     matchedIDs.forEach(id => updatedChecked.add(id));

//     let updData = new Set(check);

//     if (updData.has(data.value)) {
//       mappedData.forEach(value => updData.delete(value));
//     } else {
//       mappedData.forEach(value => updData.add(value));
//     }

//     endpointIds.forEach(id => {
//       if (check.includes(id) || mappedData.includes(id)) {
//         updData.add(id);
//       }
//     });

//     let ltdData = endpoints.filter(ep => updData.has(ep.loc_ref_id));

//     if ((data?.children?.length > 0 || endpointIds.includes(data.value)) && (!checked.length > 0)) {
//       console.log('ifffff');

//       setChecked(ltdData.map(map => map.loc_ref_id));
//       setStatusBasedFilterdData(ltdData);

//       if (endpointIds.includes(data.value) && data.children !== null) {
//         handleEndpointExpanded(mappedData);
//       } else if (data.children === null) {
//         return;
//       } else {
//         handleEndpointExpanded([]);
//       }

//     } else {
//       console.log('ellllsseeeeeee');

//       setChecked([]);
//       setStatusBasedFilterdData(endpoints);
//       handleEndpointExpanded([]);
//     }
//   };

//   const onDrawerClose = () => {
//     setOpen(false)
//     setenableEdit(false)
//     fetchData()
//   }

//   const activeInactive = (item) => {
//     Swal.fire({
//       icon: 'warning',
//       title: 'Are you sure?',
//       text: item.active === "0" ? "Make this Location Active ?" : 'Make this Location InActive ?',
//       showCancelButton: true,
//       confirmButtonColor: '#2ba92b',
//       confirmButtonText: 'Yes',
//       cancelButtonColor: '#d33',
//       cancelButtonText: 'No'
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         item["active"] = item.active === "0" ? "1" : "0"
//         const responseData = await dispatch(updateEndpointApi(item, publishedAuditData))
//         if (responseData.status === 200) {
//           fetchData()
//         }
//       }
//     })
//   }

//   // Clear functionality
//   const handleClearClick = (item) => {
//     console.log('188', item)
//     setItemToClear(item)
//     setShowClearModal(true)
//     setClearReason('')
//   }


// // Updated handleClearConfirm function in React component
// const handleClearConfirm = async () => {
//   if (!clearReason.trim()) {
//     Swal.fire({
//       icon: 'warning',
//       title: 'Reason Required',
//       text: 'Please provide a reason for reset the data.',
//     })
//     return
//   }

//   if (!itemToClear) {
//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: 'No item selected for reset.',
//     })
//     return
//   }

//   setIsClearing(true)

//   try {
//     // Show backup progress
//     Swal.fire({
//       title: 'Creating Backup & Resetting Data...',
//       html: `
//         <div style="text-align: left;">
//           <p><i class="bx bx-data"></i> Creating backup for: <strong>${itemToClear.loc_name}</strong></p>
//           <p><i class="bx bx-loader bx-spin"></i> This may take a few moments...</p>
//         </div>
//       `,
//       allowOutsideClick: false,
//       showConfirmButton: false,
//       didOpen: () => {
//         Swal.showLoading()
//       }
//     })

//     // Call the backend API to clear the data (now with backup)
//     const responseData = await dispatch(clearAuditDataApi(
//       itemToClear, 
//       publishedAuditData, 
//       clearReason.trim()
//     ))
//           console.log('backupInforesponseData', responseData)


//     if (responseData.status === 200) {
//       // Remove the item from local state arrays
//       const updatedEndpoints = endpoints.filter(ep => ep.id !== itemToClear.id)
//       const updatedStatusFilteredData = statusBasedFilteredData.filter(item => item.id !== itemToClear.id)
//       const updatedChecked = checked.filter(id => id !== itemToClear.loc_ref_id)

//       // Update all the state with filtered data
//       setEndpoints(updatedEndpoints)
//       setStatusBasedFilterdData(updatedStatusFilteredData)
//       setChecked(updatedChecked)

//       // Recalculate status info with the remaining data
//       const updatedStatusInfo = await updateStatusInfo(updatedEndpoints)
//       setStatusInfo(updatedStatusInfo)

//       // Close modal and reset
//       setShowClearModal(false)
//       setItemToClear(null)

//       // Show success message with backup information
//       const backupInfo = responseData.data?.data?.backup_info;
      
//       Swal.fire({
//         icon: 'success',
//         title: 'Data Reset Successfully with Backup',
//         html: `
//           <div style="text-align: left;">
//             <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
//               <h6 style="color: #28a745; margin-bottom: 10px;"><i class="bx bx-check-circle"></i> Reset Completed</h6>
//               <p><strong>Location:</strong> ${itemToClear.loc_name}</p>
//               <p><strong>Status Changed:</strong> ${itemToClear.audit_status_name} → Not Started</p>
//               <p><strong>Reason:</strong> ${clearReason}</p>
//               <p><strong>Reset by:</strong> ${authUser?.user_data?.fullname || 'Unknown'}</p>
//             </div>
            
//             <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
//               <h6 style="color: #1976d2; margin-bottom: 10px;"><i class="bx bx-data"></i> Backup Information</h6>
//               <p><strong>Backup ID:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 4px;">${backupInfo?.backup_ref_id || 'N/A'}</code></p>
//               <p><strong>Checkpoints Backed Up:</strong> ${backupInfo?.checkpoints_backed_up || 0}</p>
//               <p><strong>Backup Created:</strong> ${new Date(backupInfo?.backup_created_on || new Date()).toLocaleString()}</p>
//               <p style="font-size: 12px; color: #666; margin-bottom: 0;">
//                 <i class="bx bx-info-circle"></i> Your data is safely backed up and can be restored if needed.
//               </p>
//             </div>
//           </div>
//         `,
//         width: 600,
//         timer: 8000,
//         showConfirmButton: true,
//         confirmButtonText: 'OK',
//         confirmButtonColor: '#28a745'
//       })

//       // Log the clear action with backup information
//       console.log('Audit data cleared successfully with backup:', {
//         locationId: itemToClear.id,
//         locationName: itemToClear.loc_name,
//         locRefId: itemToClear.loc_ref_id,
//         previousStatus: itemToClear.audit_status_name,
//         newStatus: 'Not Started',
//         reason: clearReason,
//         timestamp: new Date().toISOString(),
//         user: authUser?.user_data?.fullname || 'Unknown',
//         backupInfo: backupInfo
//       })

//       // Optionally refresh the entire data to get updated info from server
//       fetchData()

//     } else {
//       throw new Error(responseData.message || 'Failed to reset audit data')
//     }

//   } catch (error) {
//     console.error('Error reset audit data:', error)
    
//     Swal.fire({
//       icon: 'error',
//       title: 'Reset Failed',
//       html: `
//         <div style="text-align: left;">
//           <p><strong>Error:</strong> ${error.message || 'Failed to reset audit data. Please try again.'}</p>
//           <p style="font-size: 12px; color: #666;">
//             <i class="bx bx-info-circle"></i> No changes were made to your data.
//           </p>
//         </div>
//       `,
//       confirmButtonColor: '#d33',
//       confirmButtonText: 'OK'
//     })
//   } finally {
//     setIsClearing(false)
//   }
// }

// const handlerevertclick = async (item) => {
//     console.log('Revert clicked for item:', item)
//     setItemToRevert(item)
    
//     // First, get available backups for this endpoint
//     try {
//         const backupsResponse = await dispatch(listBackupsApi(item._id))
//         console.log('backupsResponse', backupsResponse.data.data[0])
        
//         if (backupsResponse.status === 200 && backupsResponse.data.data.length > 0) {
//             console.log("first")
            
//             // Sort backups by creation date (most recent first)
//             const sortedBackups = backupsResponse.data.data.sort((a, b) => 
//                 new Date(b.backup_created_on) - new Date(a.backup_created_on)
//             );
            
//             setAvailableBackups(sortedBackups)
            
//             // Automatically select the most recent backup (first in sorted array)
//             const mostRecentBackup = sortedBackups[0];
//             setSelectedBackupRefId(mostRecentBackup.backup_ref_id)
            
//             setShowBackupsList(true)
//             setShowRevertModal(true)
//             setRevertReason('')
//         } else {
//             Swal.fire({
//                 icon: 'info',
//                 title: 'No Backups Available',
//                 text: 'No backup data found for this location. Revert is only possible if data was previously cleared with backup.',
//                 confirmButtonColor: '#2ba92b'
//             })
//         }
//     } catch (error) {
//         Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'Failed to retrieve backup information. Please try again.',
//             confirmButtonColor: '#d33'
//         })
//     }
// }

// // const handlerevertclick = async (item) => {
// //     console.log('Revert clicked for item:', item)
// //     setItemToRevert(item)
    
// //     // First, get available backups for this endpoint
// //     try {
// //         const backupsResponse = await dispatch(listBackupsApi(item._id))
// //         console.log('backupsResponse', backupsResponse.data.data[0])
        
// //         if (backupsResponse.status === 200 && backupsResponse.data.data.length > 0) {
// //           console.log("first")
// //             setAvailableBackups(backupsResponse.data.data)
// //             setShowBackupsList(true)
// //             setShowRevertModal(true)
// //             setRevertReason('')
// //             setSelectedBackupRefId('')
// //         } else {
// //             Swal.fire({
// //                 icon: 'info',
// //                 title: 'No Backups Available',
// //                 text: 'No backup data found for this location. Revert is only possible if data was previously cleared with backup.',
// //                 confirmButtonColor: '#2ba92b'
// //             })
// //         }
// //     } catch (error) {
// //         Swal.fire({
// //             icon: 'error',
// //             title: 'Error',
// //             text: 'Failed to retrieve backup information. Please try again.',
// //             confirmButtonColor: '#d33'
// //         })
// //     }
// // }

// // Handle revert confirmation
// const handleRevertConfirm = async () => {
//     if (!revertReason.trim()) {
//         Swal.fire({
//             icon: 'warning',
//             title: 'Reason Required',
//             text: 'Please provide a reason for reverting the data.',
//         })
//         return
//     }

//     if (!selectedBackupRefId) {
//         Swal.fire({
//             icon: 'warning',
//             title: 'Backup Selection Required',
//             text: 'Please select a backup to revert from.',
//         })
//         return
//     }

//     if (!itemToRevert) {
//         Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'No item selected for revert.',
//         })
//         return
//     }

//     setIsReverting(true)

//     try {
//         // Show progress
//         Swal.fire({
//             title: 'Reverting Data from Backup...',
//             html: `
//                 <div style="text-align: left;">
//                     <p><i class="bx bx-history"></i> Restoring data for: <strong>${itemToRevert.loc_name}</strong></p>
//                     <p><i class="bx bx-data"></i> From backup: <strong>${selectedBackupRefId}</strong></p>
//                     <p><i class="bx bx-loader bx-spin"></i> This may take a few moments...</p>
//                 </div>
//             `,
//             allowOutsideClick: false,
//             showConfirmButton: false,
//             didOpen: () => {
//                 Swal.showLoading()
//             }
//         })

//         // Call the revert API
//         const responseData = await dispatch(revertAuditDataApi(
//             selectedBackupRefId,
//             revertReason.trim(),
//             publishedAuditData
//         ))
//         console.log('responseDatarevertAuditDataApi', responseData)

//         if (responseData.status === 200) {
//             // Update local state with reverted data
//             const updatedEndpoints = endpoints.map(ep => 
//                 ep.id === itemToRevert.id 
//                     ? {
//                         ...ep,
//                         audit_status_id: "1",
//                         audit_status_name: "In Progress", 
//                         audit_cp_status: "1"
//                     }
//                     : ep
//             )
            
//             const updatedStatusFilteredData = statusBasedFilteredData.map(item => 
//                 item.id === itemToRevert.id 
//                     ? {
//                         ...item,
//                         audit_status_id: "1",
//                         audit_status_name: "In Progress",
//                         audit_cp_status: "1"
//                     }
//                     : item
//             )

//             // Update all the state with reverted data
//             setEndpoints(updatedEndpoints)
//             setStatusBasedFilterdData(updatedStatusFilteredData)

//             // Recalculate status info
//             const updatedStatusInfo = await updateStatusInfo(updatedEndpoints)
//             setStatusInfo(updatedStatusInfo)

//             // Close modal and reset
//             setShowRevertModal(false)
//             setItemToRevert(null)
//             setShowBackupsList(false)
//             setAvailableBackups([])

//             // Show success message
//             const restoreInfo = responseData.data?.data?.restore_info;
            
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Data Reverted Successfully',
//                 html: `
//                     <div style="text-align: left;">
//                         <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
//                             <h6 style="color: #28a745; margin-bottom: 10px;"><i class="bx bx-check-circle"></i> Revert Completed</h6>
//                             <p><strong>Location:</strong> ${itemToRevert.loc_name}</p>
//                             <p><strong>Status Changed:</strong> Not Started → In Progress</p>
//                             <p><strong>Checkpoints Restored:</strong> ${restoreInfo?.checkpoints_restored || 0}</p>
//                             <p><strong>Reason:</strong> ${revertReason}</p>
//                             <p><strong>Reverted by:</strong> ${authUser?.user_data?.fullname || 'Unknown'}</p>
//                         </div>
                        
//                         <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
//                             <h6 style="color: #28a745; margin-bottom: 10px;"><i class="bx bx-history"></i> Restore Information</h6>
//                             <p><strong>Backup Reference:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 4px;">${restoreInfo?.backup_ref_id || 'N/A'}</code></p>
//                             <p><strong>Restored On:</strong> ${new Date(restoreInfo?.restored_on || new Date()).toLocaleString()}</p>
//                             <p style="font-size: 12px; color: #666; margin-bottom: 0;">
//                                 <i class="bx bx-info-circle"></i> Your audit data has been successfully restored from the selected backup.
//                             </p>
//                         </div>
//                     </div>
//                 `,
//                 width: 600,
//                 timer: 8000,
//                 showConfirmButton: true,
//                 confirmButtonText: 'OK',
//                 confirmButtonColor: '#28a745'
//             })

//             // Log the revert action
//             console.log('Audit data reverted successfully:', {
//                 locationId: itemToRevert.id,
//                 locationName: itemToRevert.loc_name,
//                 backupRefId: selectedBackupRefId,
//                 newStatus: 'In Progress',
//                 reason: revertReason,
//                 timestamp: new Date().toISOString(),
//                 user: authUser?.user_data?.fullname || 'Unknown',
//                 restoreInfo: restoreInfo
//             })

//             // Refresh data to ensure consistency
//             fetchData()

//         } else {
//             throw new Error(responseData.message || 'Failed to revert audit data')
//         }

//     } catch (error) {
//         console.error('Error reverting audit data:', error)
        
//         Swal.fire({
//             icon: 'error',
//             title: 'Revert Failed',
//             html: `
//                 <div style="text-align: left;">
//                     <p><strong>Error:</strong> ${error.message || 'Failed to revert audit data. Please try again.'}</p>
//                     <p style="font-size: 12px; color: #666;">
//                         <i class="bx bx-info-circle"></i> No changes were made to your data.
//                     </p>
//                 </div>
//             `,
//             confirmButtonColor: '#d33',
//             confirmButtonText: 'OK'
//         })
//     } finally {
//         setIsReverting(false)
//     }
// }

// // Handle revert cancel
// const handleRevertCancel = () => {
//     setShowRevertModal(false)
//     setRevertReason('')
//     setItemToRevert(null)
//     setShowBackupsList(false)
//     setAvailableBackups([])
//     setSelectedBackupRefId('')
// }





//   const handleClearCancel = () => {
//     setShowClearModal(false)
//     setClearReason('')
//     setItemToClear(null) // Reset the item to clear

//   }

//   const handleEndpointExpanded = (expandedValue) => {
//     console.log(expandedValue, 'expandedValue');
//     setExpanded(expandedValue);
//   };

//   const columns = useMemo(() => {
//     const cols = [
//       {
//         accessor: 'loc_name',
//         Header: 'Location / Assets',
//         filterable: true,
//         Cell: (cellProps) => {
//           var item = cellProps.row.original
//           return (
//             <>
//               <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <div className={item.active == "1" ? "font-size-12 text-dark fw-bold" : "font-size-12 text-black-50"} style={{ marginBottom: 5 }}>
//                   <i
//                     className={
//                       item.audit_status_id === '0'
//                         ? "mdi mdi-circle text-secondary font-size-10" :
//                         item.audit_status_id === '1' ?
//                           "mdi mdi-circle text-warning font-size-10" :
//                           item.audit_status_id === '2' ?
//                             "mdi mdi-circle text-success font-size-10" :
//                             item.audit_status_id === '3' ?
//                               "mdi mdi-circle text-info font-size-10" : "mdi mdi-circle text-primary font-size-10"
//                     }
//                   />{" "} {item.loc_name}
//                 </div>
//                 <div>
//                   <span className="font-size-10">Audit started on - {item.audit_started_on === null ? "-- / -- / --" : moment(item.audit_started_on).format("DD/MM/YYY")}</span> <br />
//                   <span className="font-size-10">Audit submitted on - {item.audit_submitted_on === null ? "-- / -- / --" : moment(item.audit_submitted_on).format("DD/MM/YYY")}</span> <br />
//                   <span className="font-size-10">Audit reviewed on - {item.audit_reviewed_on === null ? "-- / -- / --" : moment(item.audit_reviewed_on).format("DD/MM/YYY")}</span> <br />
//                 </div>
//               </div>
//             </>
//           )
//         }
//       },
//       {
//         accessor: 'audit_pdb_total_cp',
//         Header: 'Check points',
//         Cell: (cellProps) => {
//           var item = cellProps.row.original
//           return (
//             <>
//               <span className={item.active == "1" ? "font-size-14 text-dark" : "font-size-14 text-black-50"}>{item.audit_pdb_total_cp}</span>
//             </>
//           )
//         }
//       },
//       {
//         accessor: 'audit_pbd_ends_on',
//         Header: 'Completes On',
//         Cell: (cellProps) => {
//           var item = cellProps.row.original
//           return (
//             <>
//               <span className={item.active == "1" ? "font-size-14 text-dark" : "font-size-14 text-black-50"}>{moment(item.audit_pbd_ends_on).format("DD/MM/YYYY")}</span>
//             </>
//           )
//         }
//       },
//       {
//         accessor: 'audit_pbd_users',
//         Header: 'Audit assigned to',
//         Cell: (cellProps) => {
//           var item = cellProps.row.original
//           var users = _.filter(item.audit_pbd_users, { audit_type: "1" })
//           return (
//             <>
//               <div className="font-size-11">
//                 {users.length === 0 ? (
//                   <span className="text-black-50">No users assigned</span>
//                 ) : (
//                   users.map((user, index) => (
//                     <span key={index}>
//                       <span className={item.active === "1" ? "" : "text-black-50"}>
//                         {user.name}
//                         {user?.user_code ? ` (${user.user_code})` : ""}
//                       </span>
//                       <span className={item.active === "1" ? "text-primary" : "text-black-50"}>
//                         {" "} - {user.designation}
//                       </span>
//                       {index < users.length - 1 && <span className="mx-1">, </span>}
//                       <br />
//                     </span>
//                   ))
//                 )}
//               </div>
//             </>
//           );
//         }
//       },
//       {
//         accessor: 'inch_pbd_users',
//         Header: 'Incharge assigned to',
//         Cell: (cellProps) => {
//           var item = cellProps.row.original
//           var users = _.filter(item.audit_pbd_users, { audit_type: "3" })
//           return (
//             <>
//               <div className="font-size-11">
//                 {users.length === 0 ? (
//                   <span className="text-black-50">No users assigned</span>
//                 ) : (
//                   users.map((user, index) => (
//                     <span key={index}>
//                       <span className={item.active === "1" ? "" : "text-black-50"}>
//                         {user.name}
//                         {user?.user_code ? ` (${user.user_code})` : ""}
//                       </span>
//                       <span className={item.active === "1" ? "text-primary" : "text-black-50"}>
//                         {" "} - {user.designation}
//                       </span>
//                       {index < users.length - 1 && <span className="mx-1">, </span>}
//                       <br />
//                     </span>
//                   ))
//                 )}
//               </div>
//             </>
//           );
//         }
//       },
//     ]

//     if (publishedAuditData.settings.enable_review) {
//       cols.push({
//         accessor: 'audit_pbd_users_',
//         Header: 'Review assigned to',
//         hidden: publishedAuditData?.settings?.enable_review === false ? false : true,
//         Cell: (cellProps) => {
//           var item = cellProps.row.original
//           var users = _.filter(item.audit_pbd_users, { audit_type: "2" })
//           console.log(users, 'getUser', item, publishedAuditData);
//           return (
//             <>
//               <div className="font-size-11">
//                 {users.length === 0 ? (
//                   <span className="text-black-50">No users assigned</span>
//                 ) : (
//                   users.map((user, index) => (
//                     <span key={index}>
//                       <span className={item.active === "1" ? "" : "text-black-50"}>
//                         {user.name}
//                         {user?.user_code ? ` (${user.user_code})` : ""}
//                       </span>
//                       <span className={item.active === "1" ? "text-primary" : "text-black-50"}>
//                         {" "} - {user.designation}
//                       </span>
//                       {index < users.length - 1 && <span className="mx-1">, </span>}
//                       <br />
//                     </span>
//                   ))
//                 )}
//               </div>
//             </>
//           )
//         }
//       })
//     }

//     cols.push(
//       {
//         accessor: 'status',
//         Header: 'Status',
//         Cell: (cellProps) => {
//           var item = cellProps.row.original
//           return (
//             <>
//               <span className={item.audit_status_id === "0" ? "badge badge-soft-secondary font-size-11 m-1" :
//                 item.audit_status_id === "1" ? "badge badge-soft-warning font-size-11 m-1" : item.audit_status_id === "2" ? "badge badge-soft-success font-size-11 m-1" : item.audit_status_id === "3" ? "badge badge-soft-info font-size-11 m-1" : "badge badge-soft-primary font-size-11 m-1"}
//               >
//                 {item.audit_status_id === "0" ? "Not started" : item.audit_status_id === "1" ? "In progress" : item.audit_status_id === "2" ? "Completed" : item.audit_status_id === "3" ? "Submitted" : "Reviewed"}
//               </span>
//             </>
//           )
//         }
//       },
//       {
//         accessor: "menu",
//         Header: "Edit / Modify / View",
//         Cell: (cellProps) => {
//           var item = cellProps.row.original
//           return (
//             <div className="d-flex gap-3" style={{ display: 'flex', alignContent: 'center' }}>
//               <div className="d-flex gap-1">
//                 {
//                   item.active === "1" && item.status !== "3" && item.status !== "4" ?
//                     <>
//                       <button id={`edit-btn-${item.id}`} className={`btn btn-sm btn-soft-primary`} title="Edit" onClick={() => {
//                         setOpen(true)
//                         setenableEdit(true)
//                         setepData(item)
//                       }}>
//                         <i className="bx bx-edit-alt font-size-12" />
//                       </button>
//                       <UncontrolledTooltip target={`edit-btn-${item.id}`}>
//                         Edit
//                       </UncontrolledTooltip>
//                     </>
//                     : null
//                 }
//                 {item.status !== "3" && item.status !== "4" ?
//                   <>
//                     <Link className={item.active == "1" ? "btn btn-soft-danger btn-sm" : "btn btn-soft-info btn-sm"} to="#" onClick={() => {
//                       activeInactive(item)
//                     }}>{item.active === "0" ? "Active" : "Make Inactive"}</Link>
//                   </>
//                   : null}
//               </div>
//             </div>
//           )
//         },
//       },
//       {
//         accessor: "report",
//         Header: "Report",
//         Cell: (cellProps) => {
//           var item = cellProps.row.original
//           return (
//             <div className="d-flex gap-3" style={{ display: 'flex', alignContent: 'center' }}>
//               <div className="d-flex gap-1">
//                 <button id={`report-btn-${item.id}`} className={item.active == "1" ? "btn btn-soft-primary btn-sm" : "btn btn-soft-secondary btn-sm"} title="Report" onClick={() => {
//                    showEndpointReport(item) 
//                 }}>
//                   Report
//                 </button>
//                 <UncontrolledTooltip target={`report-btn-${item.id}`}>
//                   View report for this item
//                 </UncontrolledTooltip>
//               </div>
//             </div>
//           )
//         }
//       },

    


// {
//   accessor: "reset_revert",
//   Header: "Reset/Revert", 
//   Cell: (cellProps) => {
//     const item = cellProps.row.original;
    
//     // Determine if item can be reverted (status "0" - Not Started) or reset (other statuses)
//     const canRevert = item.audit_status_id === "0";
//     const canReset = item.audit_status_id !== "0";
    
//     // Determine which action is currently processing
//     const isProcessingReset = isClearing && itemToClear?.id === item.id;
//     const isProcessingRevert = isReverting && itemToRevert?.id === item.id;
//     const isProcessing = isProcessingReset || isProcessingRevert;
    
//     return (
//       <div className="d-flex gap-3" style={{ display: 'flex', alignContent: 'center' }}>
//         <div className="d-flex gap-1">
//           {canRevert ? (
//             // Show Revert button for cleared items (status "0")
//             <>
//               <button
//                 id={`revert-btn-${item.id}`}
//                 className="btn btn-soft-info btn-sm"
//                 onClick={() => handlerevertclick(item)}
//                 disabled={isProcessing}
//               >
//                 {isProcessingRevert ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
//                     Reverting...
//                   </>
//                 ) : (
//                   <>
//                     <i className="bx bx-history me-1"></i>
//                     Revert
//                   </>
//                 )}
//               </button>
//               <UncontrolledTooltip target={`revert-btn-${item.id}`}>
//                 Restore data from backup for this location
//               </UncontrolledTooltip>
//             </>
//           ) : canReset ? (
//             // Show Reset button for all other statuses  
//             <>
//               <button
//                 id={`reset-btn-${item.id}`}
//                 className="btn btn-soft-dark btn-sm"
//                 onClick={() => handleClearClick(item)}
//                 disabled={isProcessing}
//               >
//                 {isProcessingReset ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
//                     Resetting...
//                   </>
//                 ) : (
//                   <>
//                     <i className="bx bx-reset me-1"></i>
//                     Reset
//                   </>
//                 )}
//               </button>
//               <UncontrolledTooltip target={`reset-btn-${item.id}`}>
//                 Reset data for this location (creates backup)
//               </UncontrolledTooltip>
//             </>
//           ) : (
//             // Fallback for any edge cases
//             <>
//               <button
//                 id={`action-disabled-btn-${item.id}`}
//                 className="btn btn-soft-secondary btn-sm"
//                 disabled={true}
//               >
//                 <i className="bx bx-block me-1"></i>
//                 No Action
//               </button>
//               <UncontrolledTooltip target={`action-disabled-btn-${item.id}`}>
//                 No reset or revert action available for this status
//               </UncontrolledTooltip>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   }
// }


//     )
//     return cols;
//   }, [])

//   const updateEPData = (updatedData) => {
//     console.log(updatedData, 'updatedData')
//   }

//   const filterStatus = (data) => {
//     var filteredData;
//     if (data == "Not started") {
//       filteredData = _.filter(endpoints, { "audit_status_id": "0" })
//     }
//     else
//       if (data == "In progress") {
//         filteredData = _.filter(endpoints, { "audit_status_id": "1" })
//       }
//       else
//         if (data == "Completed") {
//           filteredData = _.filter(endpoints, { "audit_status_id": "2" })
//         }
//         else
//           if (data == "Submitted") {
//             filteredData = _.filter(endpoints, { "audit_status_id": "3" })
//           }
//           else
//             if (data == "Reviewed") {
//               filteredData = _.filter(endpoints, { "audit_status_id": "7" })
//             }
//             else
//               if (data == "All") {
//                 filteredData = endpoints
//               }
//               if(String(filterValue).length >0){
//                 const normalizedFilterValue = filterValue.toLowerCase().replace(/\s/g, "");

//                 filteredData = _.filter(filteredData, (item) => {
//                   const normalizedLocName = item.loc_name?.toLowerCase().replace(/\s/g, "");
//                   return normalizedLocName === normalizedFilterValue;
//                 });

//                 //  filteredData = _.filter(filteredData,{loc_name :filterValue})
//                  console.log(filteredData,'filteredData',filterValue)
//               }
//     setStatusBasedFilterdData(filteredData)
//   }

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <MetaTags>
//           <title>Published Audit | AuditVista</title>
//         </MetaTags>
//         <Breadcrumb
//           title={"Published Audit"}
//           isBackButtonEnable={true}
//           gotoBack={() => {
//             navigate(`${publishedAuditData.repeat_mode_config.mode_id === "0" ? "/mngpblhtempt" : "/scheduled-audit"}`)
//           }}
//           breadcrumbItem="Template"
//         />

//         <Container fluid>


//           <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
//             <div style={{
//               width: '240px',
//               minWidth: '240px',
//               boxSizing: 'border-box',
//               borderRight: '1px solid #ccc'
//             }}>
//               <Card className="h-100">
//                 <CardBody>
//                   {
//                     console.log(locationData, 'locationData', checked, expanded)
//                   }
//                   <CheckboxTree
//                     nodes={locationData}
//                     checked={checked}
//                     expanded={expanded}
//                     onCheck={(checked, targetNode) => {
//                       getNodeEndpoints(targetNode, checked);
//                     }}
//                     onExpand={expanded =>
//                       handleEndpointExpanded(expanded)
//                     }
//                     icons={icons}
//                     showNodeIcon={false}
//                     showExpandAll
//                   />
//                 </CardBody>
//               </Card>
//             </div>

//             <div style={{
//               flex: 1,
//               boxSizing: 'border-box',
//               overflowY: 'auto'
//             }}>
//               <Card className="h-100">
//                 <CardBody>
//                   <TableContainer
//                     columns={columns}
//                     data={statusBasedFilteredData}
//                     isGlobalFilter={true}
//                     isAddOptions={false}
//                     isJobListGlobalFilter={false}
//                     customPageSize={10}
//                     isPagination={true}
//                     tableClass="align-middle table-nowrap table-check"
//                     theadClass="table-light"
//                     pagination="pagination pagination-rounded justify-content-end my-2"
//                     total_audit={statusBasedFilteredData.length}
//                     not_started_count={statusInfo.not_started_count}
//                     in_progress_count={statusInfo.in_progress_count}
//                     completed_count={statusInfo.completed_count}
//                     submitted_count={statusInfo.submitted_count}
//                     reviewed_count={statusInfo.reviewed_count}
//                     filterStatus={(data) => filterStatus(data)}
//                     publishedAuditData={publishedAuditData}
//                     onClickChangeAuditEndDate={() => {
//                       setupdatePbdAudit(true)
//                       setOpen(true)
//                       // this.setState({ updatePbdAudit: true, open: true })
//                     }}
//                     filteredValue={(val)=>{
//                       setfilterValue(val)
//                     }}
//                   />
//                 </CardBody>
//               </Card>
//             </div>
//           </div>
//         </Container>
//       </div>

//       {/* Edit Offcanvas */}
//       <Offcanvas
//         isOpen={open}
//         toggle={onDrawerClose}
//         direction="end"
//         className="drawer-open"
//         style={{ maxHeight: window.innerHeight, overflowY: 'auto', padding: '10px' }}
//       >
//         <OffcanvasHeader toggle={onDrawerClose}>
//           {
//             enableEdit ?
//               "Edit Location / Assets"
//               :
//               updatePbdAudit ?
//                 "Update Audit Info"
//                 :
//                 ""
//           }
//         </OffcanvasHeader>
//         <OffcanvasBody>
//           {
//             enableEdit ? (
//               <EditEndpoints
//                 epdata={epData}
//                 user_data={authUser.user_data}
//                 audit_data={publishedAuditData}
//                 onClose={onDrawerClose}
//                 updateEPData={updateEPData}
//               />
//             )
//             :
//             updatePbdAudit ?
//                 <UpdatePdbAuditInfo
//                   epdata={epData}
//                   user_data={authUser.user_data}
//                   audit_data={publishedAuditData}
//                   onClose={onDrawerClose}
//             />
//             :
//             <>
            
//             </>
          
          
//           }
//         </OffcanvasBody>
//       </Offcanvas>
//       <Modal isOpen={showClearModal} toggle={handleClearCancel} centered>
//         <ModalHeader toggle={handleClearCancel}>
//           <i className="bx bx-warning text-warning me-2"></i>
//           Confirm Reset Data
//         </ModalHeader>
//         <ModalBody>
//           <div className="mb-3">
//             <p className="text-muted mb-3">
//               Are you sure you want to reset data for <strong>"{itemToClear?.loc_name}"</strong>?
//               This action cannot be undone.
//             </p>
//             <Label htmlFor="clearReason" className="form-label">
//               Reason for Reset data <span className="text-danger">*</span>
//             </Label>
//             <Input
//               type="textarea"
//               id="clearReason"
//               placeholder="Please provide a reason for reset the data..."
//               value={clearReason}
//               onChange={(e) => setClearReason(e.target.value)}
//               rows={3}
//               maxLength={1000}
//             />
//             <div className="text-muted small mt-1">
//               {clearReason.length}/1000 characters
//             </div>
//           </div>
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             color="secondary"
//             onClick={handleClearCancel}
//             disabled={isClearing}
//           >
//             Cancel
//           </Button>
//           <Button
//             color="danger" // Changed to danger color
//             onClick={handleClearConfirm}
//             disabled={isClearing || !clearReason.trim()}
//           >
//             {isClearing ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                 reset...
//               </>
//             ) : (
//               <>
//                 <i className="bx bx-trash me-1"></i>
//                 Reset Location Data
//               </>
//             )}
//           </Button>
//         </ModalFooter>
//       </Modal>
//       <Modal isOpen={showRevertModal} toggle={handleRevertCancel} centered size="lg">
//     <ModalHeader toggle={handleRevertCancel}>
//         <i className="bx bx-history text-info me-2"></i>
//         Revert Data from Backup
//     </ModalHeader>
//     <ModalBody>
//         <div className="mb-3">
//             <p className="text-muted mb-3">
//                 Restore data for <strong>"{itemToRevert?.loc_name}"</strong> from a previous backup.
//                 This will restore the endpoint status to "In Progress" and recover all checkpoint data.
//             </p>
            
//             {/* Backup Selection */}
//             {showBackupsList && availableBackups.length > 0 && (
//                 <div className="mb-3">
//                     <Label className="form-label">
//                         Select Backup to Restore From <span className="text-danger">*</span>
//                     </Label>
//                     <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                         {availableBackups.map((backup, index) => (
//                             <div key={backup.backup_ref_id} className="form-check mb-2">
//                                 <input
//                                     className="form-check-input"
//                                     type="radio"
//                                     name="selectedBackup"
//                                     id={`backup-${index}`}
//                                     value={backup.backup_ref_id}
//                                     defaultChecked={selectedBackupRefId === backup.backup_ref_id}
//                                     onChange={(e) => setSelectedBackupRefId(e.target.value)}
//                                 />
//                                 <label className="form-check-label" htmlFor={`backup-${index}`}>
//                                     <div>
//                                         <strong>Backup ID:</strong> <code>{backup.backup_ref_id}</code>
//                                         <br />
//                                         <small className="text-muted">
//                                             <strong>Created:</strong> {new Date(backup.backup_created_on).toLocaleString()}
//                                             <br />
//                                             <strong>By:</strong> {backup.backup_created_by_name}
//                                             <br />
//                                             <strong>Reason:</strong> {backup.backup_reason}
//                                             <br />
//                                             <strong>Original Status:</strong> {backup.original_status.audit_status_name}
//                                         </small>
//                                     </div>
//                                 </label>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
            
//             {/* Reason Input */}
//             <Label htmlFor="revertReason" className="form-label">
//                 Reason for Reverting Data <span className="text-danger">*</span>
//             </Label>
//             <Input
//                 type="textarea"
//                 id="revertReason"
//                 placeholder="Please provide a reason for reverting the data..."
//                 value={revertReason}
//                 onChange={(e) => setRevertReason(e.target.value)}
//                 rows={3}
//                 maxLength={1000}
//             />
//             <div className="text-muted small mt-1">
//                 {revertReason.length}/1000 characters
//             </div>
//         </div>
//     </ModalBody>
//     <ModalFooter>
//         <Button
//             color="secondary"
//             onClick={handleRevertCancel}
//             disabled={isReverting}
//         >
//             Cancel
//         </Button>
//         <Button
//             color="info"
//             onClick={handleRevertConfirm}
//             // disabled={isReverting || !revertReason.trim() || !selectedBackupRefId}
//         >
//             {isReverting ? (
//                 <>
//                     <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                     Reverting...
//                 </>
//             ) : (
//                 <>
//                     <i className="bx bx-history me-1"></i>
//                     Revert from Backup
//                 </>
//             )}
//         </Button>
//     </ModalFooter>
// </Modal>

//     </React.Fragment>
//   )
// }

// export default PublishedReport;
// // import React, { useEffect, useState ,useMemo} from 'react'
// // import { retriveAuditInfo } from 'toolkitStore/Auditvista/ManageAuditSlice'
// // import { useDispatch } from 'react-redux'
// // import TableContainer from './ReportComponents/TableContainer'
// // import Breadcrumb from 'components/Common/Breadcrumb'
// // import { MetaTags } from 'react-meta-tags'
// // import { useNavigate,Link } from 'react-router-dom'
// // import { Card,CardBody,Container,UncontrolledTooltip, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
// // import { MdCheckBox, MdCheckBoxOutlineBlank, MdChevronRight, MdKeyboardArrowDown, MdAddBox, MdIndeterminateCheckBox, MdLocationCity, MdStore, MdFolder, MdCheckCircle, MdDescription } from "react-icons/md";
// // import CheckboxTree, {
// //     getNode, flattenNodes, deserializeLists, serializeList
// // } from 'react-checkbox-tree';
// // import './CSS/checkboxtree.css';
// // import _ from 'lodash'
// // var moment = require('moment')
// // import EditEndpoints from './Components/EditEndpoints'
// // import { updateEndpointApi } from 'toolkitStore/Auditvista/ManageAuditSlice'
// // import Swal from 'sweetalert2'


// // const PublishedReport = () => {

// //   const dispatch = useDispatch()
// //   const navigate = useNavigate()
// //   const [publishedAuditData,setPublishedAuditData] = useState(JSON.parse(sessionStorage.getItem("publishedAuditData")))
// //   const [authUser,setauthUser] = useState(JSON.parse(sessionStorage.getItem("authUser")))
// //   const [locationData,setLocationData] = useState([])
// //   const [auditList,setauditList] = useState([])
// //   const [statusBasedFilteredData,setStatusBasedFilterdData] = useState([])
// //     const [expanded, setExpanded] = useState([]);
// //     const [endpoints, setEndpoints] = useState([]); // Assume endpoints are populated elsewhere
// //   const [checked, setChecked] = useState([]);
// //   const [statusInfo, setStatusInfo] = useState({});
// //   const [open,setOpen] = useState(false)
// //   const [enableEdit,setenableEdit] = useState(false)
// //   const [epData,setepData] = useState(null)



// //   const icons = {
// //     check: <MdCheckBox className="rct-icon rct-icon-check text-success" />,
// //     uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
// //     halfCheck: (
// //         <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />
// //     ),
// //     expandClose: (
// //         <MdChevronRight className="" />
// //     ),
// //     expandOpen: (
// //         <MdKeyboardArrowDown className="" />
// //     ),
// //     expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
// //     collapseAll: (
// //         <MdIndeterminateCheckBox className="" />
// //     ),
// //     parentClose: <MdLocationCity className="" />,
// //     parentOpen: <MdLocationCity className="" />,
// //     leaf: <MdStore className="" />
// // }


// //   useEffect(() => {
   
// //     fetchData()

// //   }, [])


// //    const fetchData = async() => {
// //       const response = await dispatch(retriveAuditInfo())
// //       if(response){
// //         console.log(response,'response');
// //         setStatusBasedFilterdData(response.data)
// //         if(response.hData.length > 0){
// //         setLocationData(response.hData[0]["ep_structure"])

// //         }
// //         setEndpoints(response.data)
// //         const statusData =await updateStatusInfo(response.data)
// //         console.log(statusData,'statusData');
// //         setStatusInfo(statusData)
// //       }
// //       // console.log(auditList, 'auditList');
// //     }

// //   const updateStatusInfo=(endpoints)=>{
// //     const statusData ={
// //     in_progress_count : _.filter(endpoints,{audit_status_id : "1"}).length,
// //     not_started_count : _.filter(endpoints,{audit_status_id : "0"}).length,
// //     completed_count : _.filter(endpoints,{audit_status_id : "2"}).length,
// //     submitted_count : _.filter(endpoints,{audit_status_id : "3"}).length,
// //     reviewed_count : _.filter(endpoints,{audit_status_id : "7"}).length,
// //     }

// //     return statusData


// //   }




// // const getNodeEndpoints = (data, check) => {
// //     console.log('checkchecked', checked, check);

// //     const extractValues = (node, key = "value") => {
// //       const result = [];

// //       const traverse = (item) => {
// //         if (!item) return;
// //         if (item[key] !== undefined) result.push(item[key]);
// //         if (Array.isArray(item.children)) item.children.forEach(traverse);
// //       };

// //       traverse(data);
// //       return result;
// //     };

// //     const mappedData = extractValues(data);
// //     const endpointIds = endpoints.map(ep => ep.loc_ref_id);

// //     console.log('endpointIds', endpointIds, data);

// //     let updatedChecked = new Set(check);
// //     const matchedIDs = endpointIds.filter(id => check.includes(id));
// //     matchedIDs.forEach(id => updatedChecked.add(id));

// //     let updData = new Set(check);

// //     if (updData.has(data.value)) {
// //       mappedData.forEach(value => updData.delete(value));
// //     } else {
// //       mappedData.forEach(value => updData.add(value));
// //     }

// //     endpointIds.forEach(id => {
// //       if (check.includes(id) || mappedData.includes(id)) {
// //         updData.add(id);
// //       }
// //     });

// //     let ltdData = endpoints.filter(ep => updData.has(ep.loc_ref_id));

// //     if ((data?.children?.length > 0 || endpointIds.includes(data.value)) && (!checked.length > 0)) {
// //       console.log('ifffff');

// //       setChecked(ltdData.map(map => map.loc_ref_id));
// //       setStatusBasedFilterdData(ltdData);

// //       if (endpointIds.includes(data.value) && data.children !== null) {
// //         handleEndpointExpanded(mappedData);
// //       } else if (data.children === null) {
// //         return;
// //       } else {
// //         handleEndpointExpanded([]);
// //       }

// //     } else {
// //       console.log('ellllsseeeeeee');

// //       setChecked([]);
// //       setStatusBasedFilterdData(endpoints);
// //       handleEndpointExpanded([]);
// //     }
// //   };

// // const onDrawerClose=()=>{
// //   setOpen(false)
// //   setenableEdit(false)
// //     fetchData()
// // }


// // const activeInactive=(item)=>{

// //   Swal.fire({
// //     icon: 'warning',
// //     title: 'Are you sure?',
// //     text: item.active === "0" ? "Make this Location Active ?" : 'Make this Location InActive ?',
// //     showCancelButton: true,
// //     confirmButtonColor: '#2ba92b',
// //     confirmButtonText: 'Yes',
// //     cancelButtonColor: '#d33',
// //     cancelButtonText: 'No'
// //   }).then(async(result)=>{
// //     if(result.isConfirmed){
// //         // const epsDataInfo = _.cloneDeep(epData)
// //         item["active"] = item.active === "0" ? "1" :"0"
// //         const responseData = await dispatch(updateEndpointApi(item,publishedAuditData))
// //         if(responseData.status === 200){
// //           fetchData()
// //         }

// //     }

// //   })



// // }





// // const handleEndpointExpanded = (expandedValue) => {
// //   console.log(expandedValue,'expandedValue');
// //     setExpanded(expandedValue);
// //   };

// //   const columns = useMemo(() => {
// //     const cols =[

// //     {
// //       accessor: 'name',
// //       Header: 'Location / Assets',
// //       filterable: true,
// //       Cell: (cellProps) => {
// //         var item = cellProps.row.original
// //         return (
// //           <>
// //             <div style={{ display: 'flex', flexDirection: 'column' }}>
// //               <div className={item.active == "1" ? "font-size-12 text-dark fw-bold" : "font-size-12 text-black-50"} style={{ marginBottom: 5 }}>
// //                 <i
// //                   className={
// //                     item.status === '0'
// //                       ? "mdi mdi-circle text-secondary font-size-10" :
// //                       item.status === '1' ?
// //                         "mdi mdi-circle text-warning font-size-10" :
// //                         item.status === '2' ?
// //                           "mdi mdi-circle text-success font-size-10" :
// //                           item.status === '3' ?
// //                             "mdi mdi-circle text-info font-size-10" : "mdi mdi-circle text-primary font-size-10"
// //                   }
// //                 />{" "} {item.loc_name}
// //               </div>
// //               <div>
// //                 <span className="font-size-10">Audit started on - {item.audit_started_on === null ? "-- / -- / --" : moment(item.audit_started_on).format("DD/MM/YYY")}</span> <br />
// //                 <span className="font-size-10">Audit submitted on - {item.audit_submitted_on === null ? "-- / -- / --" : moment(item.audit_submitted_on).format("DD/MM/YYY")}</span> <br />
// //                 <span className="font-size-10">Audit reviewed on - {item.audit_reviewed_on === null ? "-- / -- / --" : moment(item.audit_reviewed_on).format("DD/MM/YYY")}</span> <br />
// //               </div>
// //             </div>
// //           </>
// //         )
// //       }
// //     },

// //     {
// //       accessor: 'audit_pdb_total_cp',
// //       Header: 'Check points',
// //       Cell: (cellProps) => {
// //         var item = cellProps.row.original
// //         return (
// //           <>
// //             <span className={item.active == "1" ? "font-size-14 text-dark" : "font-size-14 text-black-50"}>{item.audit_pdb_total_cp}</span>
// //           </>
// //         )
// //       }
// //     },
// //     {
// //       accessor: 'audit_pbd_ends_on',
// //       Header: 'Completes On',
// //       Cell: (cellProps) => {
// //         var item = cellProps.row.original
// //         return (
// //           <>
// //             <span className={item.active == "1" ? "font-size-14 text-dark" : "font-size-14 text-black-50"}>{moment(item.audit_pbd_ends_on).format("DD/MM/YYYY")}</span>
// //           </>
// //         )
// //       }
// //     },
// //     {
// //       accessor: 'audit_pbd_users',
// //       Header: 'Audit assigned to',
// //       Cell: (cellProps) => {
// //         var item = cellProps.row.original

// //         var users = _.filter(item.audit_pbd_users, { audit_type: "1" })
// //         // return (
// //         //   <>
// //         //     <div className='font-size-11'>
// //         //       <span className={item.active == "1" ? null : "font-size-11 text-black-50"}>{getUser.name} {getUser?.user_code === "" || getUser?.user_code === null || getUser?.user_code === undefined ? "" : `(${getUser?.user_code})`}</span><br /><span className={item.active == "1" ? "font-size-11 text-primary" : "font-size-11 text-black-50"}>{getUser.designation}</span>
// //         //     </div>
// //         //   </>
// //         // )

// //         return (
// //       <>
// //         <div className="font-size-11">
// //           {users.length === 0 ? (
// //             <span className="text-black-50">No users assigned</span>
// //           ) : (
// //             users.map((user, index) => (
// //               <span key={index}>
// //                 <span className={item.active === "1" ? "" : "text-black-50"}>
// //                   {user.name}
// //                   {user?.user_code ? ` (${user.user_code})` : ""}
// //                 </span>
// //                 <span className={item.active === "1" ? "text-primary" : "text-black-50"}>
// //                   {" "} - {user.designation}
// //                 </span>
// //                 {index < users.length - 1 && <span className="mx-1">, </span>}
// //                 <br />
// //               </span>
// //             ))
// //           )}
// //         </div>
// //       </>
// //     );

// //       }
// //     },
// //     {
// //       accessor: 'inch_pbd_users',
// //       Header: 'Incharge assigned to',
// //       Cell: (cellProps) => {
// //         var item = cellProps.row.original
// //         var users = _.filter(item.audit_pbd_users, { audit_type: "3" })
// //           return (
// //       <>
// //         <div className="font-size-11">
// //           {users.length === 0 ? (
// //             <span className="text-black-50">No users assigned</span>
// //           ) : (
// //             users.map((user, index) => (
// //               <span key={index}>
// //                 <span className={item.active === "1" ? "" : "text-black-50"}>
// //                   {user.name}
// //                   {user?.user_code ? ` (${user.user_code})` : ""}
// //                 </span>
// //                 <span className={item.active === "1" ? "text-primary" : "text-black-50"}>
// //                   {" "} - {user.designation}
// //                 </span>
// //                 {index < users.length - 1 && <span className="mx-1">, </span>}
// //                 <br />
// //               </span>
// //             ))
// //           )}
// //         </div>
// //       </>
// //     );
// //       }
// //     },
// //     ]
// //     if(publishedAuditData.settings.enable_review){
// //     cols.push({
// //       accessor: 'audit_pbd_users_',
// //       Header: 'Review assigned to',
// //       hidden: publishedAuditData?.settings?.enable_review === false ? false : true,
// //       Cell: (cellProps) => {
// //         var item = cellProps.row.original
// //         var users = _.filter(item.audit_pbd_users, { audit_type: "2" })
// //         console.log(users, 'getUser', item,publishedAuditData);
// //         return (
// //           <>
// //           {users.length === 0 ? (
// //             <span className="text-black-50">No users assigned</span>
// //           ) : (
// //             users.map((user, index) => (
// //               <span key={index}>
// //                 <span className={item.active === "1" ? "" : "text-black-50"}>
// //                   {user.name}
// //                   {user?.user_code ? ` (${user.user_code})` : ""}
// //                 </span>
// //                 <span className={item.active === "1" ? "text-primary" : "text-black-50"}>
// //                   {" "} - {user.designation}
// //                 </span>
// //                 {index < users.length - 1 && <span className="mx-1">, </span>}
// //                 <br />
// //               </span>
// //             ))
// //           )}

// //             {/* <div>
// //               <span className={item.active == "1" ? null : "font-size-11 text-black-50"}>{getUser.name} {getUser?.user_code === "" || getUser?.user_code === null || getUser?.user_code === undefined ? "" : `(${getUser?.user_code})`}</span><br /><span className={item.active == "1" ? "font-size-11 text-primary" : "font-size-11 text-black-50"}>{getUser.designation}</span>
// //             </div> */}
// //           </>
// //         )
// //       }
// //     })
// //     }
// //     cols.push(
// //     {
// //       accessor: 'status',
// //       Header: 'Status',
// //       Cell: (cellProps) => {
// //         var item = cellProps.row.original
// //         return (
// //           <>
// //             <span className={item.audit_status_id === "0" ? "badge badge-soft-secondary font-size-11 m-1" :
// //               item.audit_status_id === "1" ? "badge badge-soft-warning font-size-11 m-1" : item.audit_status_id === "2" ? "badge badge-soft-success font-size-11 m-1" : item.audit_status_id === "3" ? "badge badge-soft-info font-size-11 m-1" : "badge badge-soft-primary font-size-11 m-1"}
// //             >
// //               {item.audit_status_id === "0" ? "Not started" : item.audit_status_id === "1" ? "In progress" : item.audit_status_id === "2" ? "Completed" : item.audit_status_id === "3" ? "Submitted" : "Reviewed"}
// //             </span>
// //           </>
// //         )
// //       }
// //     },
// //       {
// //       accessor: "menu",
// //       Header: "Edit / Modify / View",
// //       Cell: (cellProps) => {
// //         var item = cellProps.row.original
// //         return (
// //           <div className="d-flex gap-3" style={{ display: 'flex', alignContent: 'center' }}>
// //             <div className="d-flex gap-1">
// //               {
// //                 item.active === "1" && item.status !== "3" && item.status !== "4" ?
// //                   <>
// //                     <button id={`edit-btn-${item.id}`} className={`btn btn-sm btn-soft-primary`} title="Edit" onClick={() => { 
// //                       // this.setState({ open: true, enableEdit: true, epData: item }) 
// //                       setOpen(true)
// //                       setenableEdit(true)
// //                       setepData(item)
// //                       }}>
// //                       <i className="bx bx-edit-alt font-size-12" />
// //                     </button>
// //                     <UncontrolledTooltip target={`edit-btn-${item.id}`}>
// //                       Edit
// //                     </UncontrolledTooltip>
// //                   </>
// //                   : null
// //               }
// //               {item.status !== "3" && item.status !== "4" ?
// //                 <>
// //                   <Link className={item.active == "1" ? "btn btn-soft-danger btn-sm" : "btn btn-soft-info btn-sm"} to="#" onClick={() => {
// //                      activeInactive(item) 
// //                      }}>{item.active === "0" ? "Active" : "Make Inactive"}</Link>

// //                 </>
// //                 : null}

// //             </div>
// //           </div>
// //         )
// //       },
// //     },
// //     {
// //       accessor: "report",
// //       Header: "Report",
// //       Cell: (cellProps) => {
// //         var item = cellProps.row.original
// //         return (
// //           <div className="d-flex gap-3" style={{ display: 'flex', alignContent: 'center' }}>
// //             <div className="d-flex gap-1">
// //               <button id={`report-btn-${item.id}`} className={item.active == "1" ? "btn btn-soft-primary btn-sm" : "btn btn-soft-secondary btn-sm"} title="Report" onClick={() => {
// //                  showEndpointReport(item) 
// //                  }}>
// //                 Report
// //               </button>
// //               <UncontrolledTooltip target={`report-btn-${item.id}`}>
// //                 View report for this item
// //               </UncontrolledTooltip>
// //             </div>
// //           </div>
// //         )

// //       }
// //     }
// //   )
// //   return cols;

// //   }, [epData])


// //   const showEndpointReport=(data)=>{

// //       if(data.audit_status_id < "3"){
// //         Swal.fire({
// //           icon: 'warning',
// //           title: 'warning!',
// //           text:  "Audit is not submitted, you cannot view report",
// //           confirmButtonColor: '#3085d6',
// //           confirmButtonText: 'OK'
// //         }).then((result) => {


// //         })

// //       }


// //   }





// //   const updateEPData=(updatedData)=>{
// //       console.log(updatedData,'updatedData')
// //   }

// //   const filterStatus = (data) => {
// //         var filteredData;
// //         if (data == "Not started") {
// //             filteredData = _.filter(endpoints, { "audit_status_id": "0" })
// //         }
// //         else
// //             if (data == "In progress") {
// //                 filteredData = _.filter(endpoints, { "audit_status_id": "1" })
// //             }
// //             else
// //                 if (data == "Completed") {
// //                     filteredData = _.filter(endpoints, { "audit_status_id": "2" })
// //                 }
// //                 else
// //                     if (data == "Submitted") {
// //                         filteredData = _.filter(endpoints, { "audit_status_id": "3" })
// //                     }
// //                     else
// //                         if (data == "Reviewed") {
// //                             filteredData = _.filter(endpoints, { "audit_status_id": "7" })
// //                         }
// //                         else
// //                             if (data == "All") {
// //                                 filteredData = endpoints
// //                             }
// //         // this.setState({
// //         //     statusBasedFilteredData: filteredData,
// //         //     dupFilteredData: filteredData,
// //         //     dataloaded: true
// //         // })
// //         setStatusBasedFilterdData(filteredData)
// //     }
  



// //   return (
// //     <React.Fragment>
// //       <div className="page-content">
// //         <MetaTags>
// //           <title>Published Audit | AuditVista</title>
// //         </MetaTags>
// //         <Breadcrumb
// //           title={"Published Audit"}
// //           isBackButtonEnable={true}
// //           gotoBack={() => {
// //             navigate(`${publishedAuditData.repeat_mode_config.mode_id === "0" ? "/mngpblhtempt" : "/scheduled-audit"}`)
// //           }}
// //           breadcrumbItem="Template"
// //         />

// //         <Container fluid>

// //           <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
// //             <div style={{
// //               width: '240px',
// //               minWidth: '240px',
// //               boxSizing: 'border-box',
// //               borderRight: '1px solid #ccc'
// //             }}>
// //               <Card className="h-100">
// //                 <CardBody>
// //                   {
// //                     console.log(locationData,'locationData',checked,expanded)
// //                   }
// //                   <CheckboxTree
// //                     nodes={locationData}
// //                     checked={checked}
// //                     expanded={expanded}
// //                     onCheck={(checked, targetNode) => {
// //                       getNodeEndpoints(targetNode, checked);

// //                     }}
// //                     onExpand={expanded => 
// //                       handleEndpointExpanded(expanded)
// //                     }
// //                     icons={icons}
// //                     showNodeIcon={false}
// //                     showExpandAll
// //                   />
// //                 </CardBody>
// //               </Card>
// //             </div>

// //             <div style={{
// //               flex: 1,
// //               boxSizing: 'border-box',
// //               overflowY: 'auto'
// //             }}>
// //               <Card className="h-100">
// //                 <CardBody>
// //                   <TableContainer
// //                     columns={columns}
// //                     data={statusBasedFilteredData}
// //                     isGlobalFilter={true}
// //                     isAddOptions={false}
// //                     isJobListGlobalFilter={false}
// //                     customPageSize={10}
// //                     isPagination={true}
// //                     tableClass="align-middle table-nowrap table-check"
// //                     theadClass="table-light"
// //                     pagination="pagination pagination-rounded justify-content-end my-2"
// //                     total_audit={statusBasedFilteredData.length}
// //                     not_started_count={statusInfo.not_started_count}
// //                     in_progress_count={statusInfo.in_progress_count}
// //                     completed_count={statusInfo.completed_count}
// //                     submitted_count={statusInfo.submitted_count}
// //                     reviewed_count={statusInfo.reviewed_count}
// //                     filterStatus={(data) => filterStatus(data)}
// //                     publishedAuditData={publishedAuditData}
// //                     onClickChangeAuditEndDate={() => {
// //                       // this.setState({ updatePbdAudit: true, open: true })
// //                     }}
// //                   />
// //                 </CardBody>
// //               </Card>
// //             </div>
// //           </div>
// //         </Container>
// //       </div>
// //       <Offcanvas
// //         isOpen={open}
// //         toggle={onDrawerClose}
// //         direction="end"
// //         className="drawer-open"
// //         style={{ maxHeight: window.innerHeight, overflowY: 'auto', padding: '10px' }}
// //       >
// //         {
// //           console.log(enableEdit,'enableEdit',open)
// //         }
// //         <OffcanvasHeader toggle={onDrawerClose}>
// //           {
// //             enableEdit &&
// //             "Edit Location / Assets"
// //           }

// //         </OffcanvasHeader>
// //         <OffcanvasBody>
// //           {
// //             enableEdit &&(
// //               <EditEndpoints 
// //               epdata={epData}
// //               user_data ={authUser.user_data}
// //               audit_data={publishedAuditData}
// //               onClose ={onDrawerClose}
// //               updateEPData={updateEPData}

// //               />
// //           )}

// //         </OffcanvasBody>


// //       </Offcanvas>




// //     </React.Fragment>
// //   )
// // }
// // export default PublishedReport
