
import {initialUsersState, initialUserState, UsersState, UserState} from "./UserState";
import {initialTenantState, TenantState} from "./TenantState";
import {initialTokenState, TokenState} from "./TokenState";
import {initialTenantsState, TenantsState} from "./TenantsState";

export interface AppState{
  userState: UserState;
  tenantState: TenantState;
  tokenState:TokenState;
  tenantsState: TenantsState;
  usersState: UsersState;
}

export const initialAppsState: AppState = {
  userState: initialUserState,
  tenantState: initialTenantState,
  tokenState:initialTokenState,
  tenantsState: initialTenantsState,
  usersState: initialUsersState
};
