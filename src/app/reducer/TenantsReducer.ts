

import {TenantsState} from "../state/TenantsState";
import {Reducer} from "redux";
import {MyAction} from "../common/MyAction";
import {
  LOAD_TENANT, loadTenantsActionCreator, tenantsActionActionCreator,
  UPDATE_TENANT
} from "../actions/TenantsAction";

export const tenantsReducer: Reducer<TenantsState> = (tenantsState: TenantsState, action: MyAction): TenantsState => {
  console.log("Enter Tenants Reducer with: " + JSON.stringify(action) + "\n\n\n" + JSON.stringify(action));
  switch (action.type) {
    case loadTenantsActionCreator(action.type, action.payload).type:
      switch (tenantsActionActionCreator(action.type, action.payload).type){
        case LOAD_TENANT:
          return Object.assign({}, tenantsState, {tenants:Object.assign({}, tenantsState.tenants, {tenants:action.payload})});
        case UPDATE_TENANT:
          console.log("updating tenants : -------....>>>>> ", JSON.stringify(action.payload));
          let atenantsState: TenantsState = Object.assign({}, tenantsState);
          atenantsState.tenants[action.payload.index] = action.payload.newTenant;
          return Object.assign({}, tenantsState, atenantsState);
        default:
          return tenantsState;
      }
    //const user: User = <User>action.payload;
    default:
      return tenantsState;
  }
};


