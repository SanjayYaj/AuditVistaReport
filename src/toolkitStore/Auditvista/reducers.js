import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication

import IR_Slice from './AuthSlice'
import {HtreeDataSliceReducer} from './audit/htree'
import userSlice from './userSlice'
import acplnFollowUpSliceReducer from './aplnfollowup/aplnflwupslice';
import {chatInfoSliceReducer} from './actionPlan/Slice/chatInfoSlice';
import { infosliceReducer } from './actionPlan/Slice/actionplaninfoslice';
import treeSlice from "./treeSlice"
import {TemptreeDataSliceReducer} from './tempSlice'
import orgSlice from './orgSlice'
import manageAuditSlice from './ManageAuditSlice'
import manageTreeSlice from './managetreeSlice'






import  reportSliceReducer   from "../../Slice/reportd3/reportslice";

import { authReducer } from '../../Slice/authSlice';

import { treeDataSliceReducer } from '../../Slice/reportd3/treedataSlice'

import  ReportUserSlice  from '../../Slice/ReportUserSlice';


const rootReducer = combineReducers({
  Layout,
  IR_Slice,
  userSlice,
  HtreeData: HtreeDataSliceReducer,
  acplnFollowUpSliceReducer,
  chatInfoSliceReducer,
  infosliceReducer,
  treeData: treeSlice,
  orgSlice,
  TemptreeData:TemptreeDataSliceReducer,
  manageAuditSlice,
  manageTreeSlice,


  reportSliceReducer,
  auth:authReducer,
  treeDataSliceReducer,
  ReportUserSlice 


  
});

export default rootReducer;
