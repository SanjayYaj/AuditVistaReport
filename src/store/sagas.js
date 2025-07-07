import { all, fork } from "redux-saga/effects";

//public
import LayoutSaga from "../toolkitStore/Auditvista/layout/saga";
// import projectsSaga from "./projects/saga";
// import tasksSaga from "./tasks/saga";

export default function* rootSaga() {
  yield all([
    //public
    fork(LayoutSaga),
    // fork(projectsSaga),
    // fork(tasksSaga),
  ]);
}
