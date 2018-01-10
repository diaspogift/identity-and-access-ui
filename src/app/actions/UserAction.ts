import {ActionCreator} from "redux";
import {MyAction} from "../common/MyAction";

export const LOGOUT_USER: string = 'LOGOUT_USER';

export const logOutUserActionCreator: ActionCreator<MyAction> = (type:string, pld:any) => ({type:type, payload:pld});

export const LOGIN_USER: string  =  'LOIN_USER';

export const loginUserActionCreator:ActionCreator<MyAction> = (type:string, pld:any)=>({type:type, payload:pld});


export const LOAD_USERS: string  =  'LOAD_USERS';

export const loadUsersActionCreator:ActionCreator<MyAction> = (type:string, pld:any)=>({type:type, payload:pld});

export const CHANGE_USER_ENABLED = 'CHANGE_USER_ENABLED';


export const userActionActionCreator:ActionCreator<MyAction> = (type:string, pld:any)=>
{
  if (type === LOGOUT_USER){
    return logOutUserActionCreator(type, pld);
  }else if (type === LOGIN_USER){
    return loginUserActionCreator(type, pld);
  }
  return null;
};


export const usersActionActionCreator:ActionCreator<MyAction> = (type:string, pld:any)=>
{
  if (type === LOAD_USERS){
    return loadUsersActionCreator(type, pld);
  } else if (type === CHANGE_USER_ENABLED){
    return loadUsersActionCreator(type, pld);
  }


  return null;
};
