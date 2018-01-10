
import {SAVE_TOKEN, saveTokenActionCreator} from "./TokenAction";

import {ActionCreator} from "redux";
import {
  CHANGE_TENANT_AVAILABILITY_STATUS, changeTenantAvailabilityStatusActionCreator, REGISTER_USER,
  registerUserActionCreator
} from "./TenantAction";
import {LOAD_USERS, LOGIN_USER, LOGOUT_USER, userActionActionCreator, usersActionActionCreator} from "./UserAction";
import {MyAction} from "../common/MyAction";
import {LOAD_TENANT, loadTenantsActionCreator, UPDATE_TENANT, updateTenantsActionCreator} from "./TenantsAction";


export const appActionCreator:ActionCreator<MyAction> = (type:string, pld:any)=>
{
  if (type === REGISTER_USER){
    return registerUserActionCreator(type, pld);
  }else if (type === LOGIN_USER || type === LOGOUT_USER){
    return userActionActionCreator(type, pld);
  }else if (type === SAVE_TOKEN){
    return saveTokenActionCreator(type, pld);
  }else if (type === LOAD_TENANT){
    return loadTenantsActionCreator(type, pld);
  }else if (type === UPDATE_TENANT){
    return updateTenantsActionCreator(type, pld);
  }else if (type === CHANGE_TENANT_AVAILABILITY_STATUS){
    return changeTenantAvailabilityStatusActionCreator(type, pld);
  }else if (type === LOAD_USERS){
    return usersActionActionCreator(type, pld);
  }



  let myAction : MyAction = {type:type, payload: pld};
  //myAction.type = type; myAction.payload = pld;
  return myAction;
};
