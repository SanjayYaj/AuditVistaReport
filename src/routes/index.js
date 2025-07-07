import React from "react";
import { Navigate } from "react-router-dom";

import UserProfile from "components/CommonForBoth/UserProfile";

// Authentication related pages
import LoginNew from '../pages/PublicAccess/Authentication/LoginNew'
import Url404 from "pages/Audit/Utility/UrlNotFound";

// Base Frame Pages
import Dashboard from "../pages/BaseFrame/AdminDashboard/Dashboard";
import Main from '../pages/BaseFrame/ManageHirerachy/Main'
import NewHstructure from "../pages/BaseFrame/ManageHirerachy/NewHstructure";
import ManageBranches from 'pages/BaseFrame/ManageBranches/index'
import Designation from "pages/BaseFrame/ManageDesignation";
import MapUserInfo from "pages/BaseFrame/ManageHirerachy/mapUserInfo";
import ManageRoles from "pages/BaseFrame/ManageRoles/ManageRoles";
import CreateRoles from "pages/BaseFrame/ManageRoles/CreateRoles";
import Mels from "../pages/BaseFrame/ManageEntities/mels";
import MapUserManualLocation from "../pages/BaseFrame/ManageEntities/Components/mapUserManualLocation";
import UserLists from "pages/BaseFrame/ManageUsers/musr";
import AddNewuser from 'pages/BaseFrame/ManageUsers/AddNewUsers';
import ManageDepartment from '../pages/BaseFrame/ManageDepartment'


import ManagePublishedTemplate from "pages/Audit/ManagePublishedTemplate";
import PublishedReport from "pages/Audit/ManagePublishedTemplate/publishedReport";
import EditPublishedTemplate from "pages/Audit/ManagePublishedTemplate/editPublishedTemplate";
import PublishConfig from "pages/Audit/ManagePublishedTemplate/publishConfig";
import ManageMasterTemplate from "../pages/Audit/ManageMasterTemplate/index";
import HReports from "pages/Audit/HierarchyReports";
import Hreport from "pages/Audit/HierarchyReports/Hreport";
import HierarchyEndpoints from "pages/Audit/HierarchyReports/HierarchyEndpoints";
import ScheduledAudit from "pages/Audit/HierarchyReports/HDailyAudits";
import CheckpointCollapseReportHierarchy from "pages/Audit/HierarchyReports/CheckpointCollapseReportHierarchy";
import ViewCheckpointsHierarchy from "pages/Audit/HierarchyReports/viewHierCheckpoint";
import FollowUpUserAudit from '../pages/AplnFollowUp';
import AplnAuditLocations from "../pages/AplnFollowUp/locations";
import AuditLocationActionPlans from "../pages/AplnFollowUp/actionplans";
import ViewCheckpoints from "pages/Audit/UserAudit/viewCheckpoint"

import UserAudit from "pages/Audit/UserAudit";
import Endpoints from "pages/Audit/UserAudit/endpoints";
import Checkpoints from "pages/Audit/UserAudit/checkpoints";
import CheckpointCollapseReport from "pages/Audit/UserAudit/CheckpointCollapseReport"
import Logout from "../pages/PublicAccess/Authentication/Logout";
import Forbidden from "pages/Audit/Utility/Forbidden";
import CrudTemplate from "pages/Audit/ManageMasterTemplate/crudTemplate";
import ScheduledAuditInfo from "pages/Audit/ManagePublishedTemplate/ScheduledAudit";
import AuditAnalyticalReport from "pages/Audit/ManagePublishedTemplate/AuditAnalyticalReport";
import Reviewcheckpoints from "pages/Audit/UserAudit/Reviewchecklist";



import ReportTemplate from "pages/ReportD3";
import PageTree from "../pages/ReportD3/PageTree";
import LayoutInfo from "../pages/ReportD3/LayoutInfo";
import PublishReport from '../pages/ReportD3/ReportUser'
import UserReport  from '../pages/ReportD3/UserReport'
import PreviewReport from '../pages/ReportD3/NoRespGridLayOut'


const authProtectedRoutes = [
  // Audit
  { path: "/dashboard", component: <Dashboard />, parent: "dashboard" },
  { path: "/hirchy", component: <Main />, parent: "hirchy" },
  { path: "/new-hstructure", component: <NewHstructure />, parent: "hirchy" },
  { path: "/mpusr", component: <MapUserInfo />, parent: "hirchy" },
  { path: "/mngpblhtempt", component: <ManagePublishedTemplate /> },
    { path: "/hlvlpbdrpt", component: <PublishedReport/>, parent: "mngpblhtempt" },
    {path:"/scheduled-audit" , component: <ScheduledAuditInfo/>, parent :"mngpblhtempt"},
    {path:"/adtaltclrprt" , component: <AuditAnalyticalReport/>, parent :"mngpblhtempt"},
  { path: "/edtpblhtempt", component: <EditPublishedTemplate /> },
  { path: "/mroles", component: <ManageRoles />, parent: "mroles" },
  { path: "/createroles", component: <CreateRoles />, parent: "mroles" },
  { path: "/mels", component: <Mels />, parent: "mels" },
  { path: "/map-user", component: <MapUserManualLocation />, parent: "mels" },
  { path: "/murs", component: <UserLists />, parent: "murs" },
  { path: "/pblhcfg", component: <PublishConfig /> },
  { path: "/mngmtrtmplt", component: <ManageMasterTemplate />, parent: "mngmtrtmplt" },
  { path: "/crttmplt", component: <CrudTemplate />, parent: "mngmtrtmplt" },
  { path: "/add-new-user", component: <AddNewuser />, parent: "murs" },
  { path: "/branches", component: <ManageBranches />, parent: "branches" },

  { path: "/hreports", component: <HReports />, parent: "hreports" },
  { path: "/hcharts", component: <Hreport />, parent: "hreports" },
  { path: "/hendpoints", component: <HierarchyEndpoints />, parent: "hreports" },
  { path: "/hdaily-audits", component: <ScheduledAudit />, parent: "hreports" },
  { path: "/hcollapse", component: <CheckpointCollapseReportHierarchy />, parent: "hreports" },
  { path: "/hcheckp", component: <ViewCheckpointsHierarchy />, parent: "hreports" },
  { path: "/usradt", component: <UserAudit />, parent: "usradt" },
  { path: "/usrenpdts", component: <Endpoints />, parent: "usradt" },
  { path: "/viewcpts", component: <ViewCheckpoints />, parent: "usradt" },
  { path: "/rewenpcpts", component: <Reviewcheckpoints />, parent: "usradt" },
  { path: "/enpcpts", component: <Checkpoints />, parent: "usradt" },
  { path: "/chkpntrprt", component: <CheckpointCollapseReport />, parent: "usradt" },
  { path: "/department", component: <ManageDepartment />, parent: "department" },
  { path: "/designation", component: <Designation />, parent: "designation" },

  // FollowUp
  { path: "/follow_audit", component: <FollowUpUserAudit />, parent: "follow_audit" },
  { path: "/adtlctns", component: <AplnAuditLocations />, parent: "follow_audit" },
  { path: "/adtactnplns", component: <AuditLocationActionPlans />, parent: "follow_audit" },
  { path: "/profile", component: <UserProfile />, parent: "dashboard" },
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },






  { path: "/report", component: <ReportTemplate /> },
  { path: "/page_tree", component: <PageTree />, parent: "report" },
  { path: "/report_page", component: <LayoutInfo />, parent: "report" },
  { path: "/publish_reports", component: <PublishReport />, parent: "ReportTemplate" },
  { path: "/user_report", component: <UserReport /> },
  { path: "/preview-report", component: <PreviewReport /> , parent: "user_report"},


];

const publicRoutes = [
  { path: "/login", component: <LoginNew /> },
  { path: "/url-not-found", component: <Url404 /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forbidden", component: <Forbidden /> },
  {
    path: "/",
    exact: true,
    component: <Navigate to="/login" />,
  },

];

export { authProtectedRoutes, publicRoutes };
