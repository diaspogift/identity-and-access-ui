import {ActionCreator} from "redux";
import {MyAction} from "../common/MyAction";

export const LOAD_TENANT: string = 'LOAD_TENANT';  // load the tenant list
export const UPDATE_TENANT: string = 'UPDATE_TENANT'; // update a specific tenant

export const loadTenantsActionCreator: ActionCreator<MyAction> = (type: string, pld: any) => ( {type:type, payload:pld});

export const updateTenantsActionCreator: ActionCreator<MyAction> = (type: string, pld: any) => ( {type:type, payload:pld});

export const tenantsActionActionCreator:ActionCreator<MyAction> = (type:string, pld:any)=>
{
  if (type === LOAD_TENANT){
    return loadTenantsActionCreator(type, pld);
  }else if (type === UPDATE_TENANT){
    return tenantsActionActionCreator(type, pld);
  }
  return null;
};
