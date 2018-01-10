
import {AppState, initialAppsState} from "../state/AppState";
import {UsersState, UserState} from "../state/UserState";
import {UserReducer, UsersReducer} from "./UserReducer";
import {TenantState} from "../state/TenantState";
import {TenantReducer, TenantsReducer} from "./TenantReducer";
import {Reducer} from "redux";
import {TokenState} from "../state/TokenState";
import {tokenReducer} from "./TokenReducer";
import {MyAction} from "../common/MyAction";
import {SAVE_TOKEN} from "../actions/TokenAction";
import {CHANGE_TENANT_AVAILABILITY_STATUS, REGISTER_USER} from "../actions/TenantAction";
import {CHANGE_USER_ENABLED, LOAD_USERS, LOGIN_USER, LOGOUT_USER} from "../actions/UserAction";
import {TenantsState} from "../state/TenantsState";
import {LOAD_TENANT} from "../actions/TenantsAction";

export const  rootReducer: Reducer<AppState> = (appState: AppState = initialAppsState, action: MyAction): AppState => {
  console.log("in root reducer: ", JSON.stringify(appState), " Action: ", JSON.stringify(action));

  switch (action.type){
    case LOGOUT_USER:
      console.log("");
      let utenteState0: UserState = UserReducer(appState.userState, action);
      return Object.assign({},appState, {userState: utenteState0, tenantState:appState.tenantState, tokenState:appState.tokenState});
    case LOGIN_USER:
        console.log("BEFOR USER REDUCER LOGIN_USERLOGIN_USERLOGIN_USER: " + JSON.stringify(appState.userState) + "\n\n\n" +  JSON.stringify(action));
        let utenteState: UserState = UserReducer(appState.userState, action);
      let retVal = Object.assign({},appState, {userState: utenteState, tenantState:appState.tenantState, tokenState:appState.tokenState});
      console.log("AFTER USER REDUCER LOGIN_USERLOGIN_USERLOGIN_USER: " + JSON.stringify(retVal.userState) + "\n\n\n" +  JSON.stringify(action));
      return retVal;
    case REGISTER_USER:
      let tenantState: TenantState = TenantReducer(appState.tenantState, action);
      return Object.assign({},appState, {userState:appState.userState, tenantState: tenantState, tokenState:appState.tokenState});
    case SAVE_TOKEN:
      let tokenState: TokenState = tokenReducer(appState.tokenState, action);
      let anAppstate: AppState = Object.assign({},appState, {userState:appState.userState, tenantState: appState.tenantState, tokenState: tokenState});
      console.log("in root reducer --> case: " + SAVE_TOKEN, JSON.stringify(anAppstate));
      return anAppstate;
    case CHANGE_TENANT_AVAILABILITY_STATUS:
      let tenantsState1: TenantsState = TenantsReducer(appState.tenantsState, action);
      let anAppstate1: AppState = Object.assign({},appState, {tenantsState:tenantsState1});
      return anAppstate1;
    case CHANGE_USER_ENABLED:
      let tenantsState3: UsersState = UsersReducer(appState.usersState, action);
      let anAppstate3: AppState = Object.assign({},appState, {usersState:tenantsState3});
      return anAppstate3;
    case LOAD_TENANT:
      let tenantsState2: TenantsState = TenantsReducer(appState.tenantsState, action);
      let anAppstate2: AppState = Object.assign({},appState, {tenantsState:tenantsState2});
      return anAppstate2;
    case LOAD_USERS:
      return Object.assign({}, appState, {usersState: UsersReducer(appState.usersState, action)});
    default:
      return appState;
  }
};
