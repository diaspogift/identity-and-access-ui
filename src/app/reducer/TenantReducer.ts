

import {TenantState} from "../state/TenantState";
import {Reducer} from "redux";
import {CHANGE_TENANT_AVAILABILITY_STATUS, REGISTER_USER} from "../actions/TenantAction";
import {MyAction} from "../common/MyAction";
import {TenantsState} from "../state/TenantsState";
import {Tenant} from "../domain/model/Tenant";
import {LOAD_TENANT} from "../actions/TenantsAction";

export const TenantReducer: Reducer<TenantState> = (tenantState: TenantState, tenantAction: MyAction): TenantState =>{
    switch (tenantAction.type) {
      case REGISTER_USER:
        return Object.assign({}, tenantState, {tenant: Object.assign({}, tenantAction.payload)});
      default:
        return tenantState;
    }
  };

export const TenantsReducer: Reducer<TenantsState> = (tenantsState: TenantsState, tenantsAction: MyAction): TenantsState =>{
  switch (tenantsAction.type) {
    case CHANGE_TENANT_AVAILABILITY_STATUS:
      let tnt = tenantsAction.payload;
      let arrayTenant : Tenant[] = tenantsState.tenants.filter((tenant:Tenant)=>{
        return !(tenant.getTenantId() === tnt.getTenantId());
      });

      arrayTenant = [...arrayTenant, tnt];

      //let aTenantState: TenantState
      return Object.assign({}, tenantsState, {tenants:arrayTenant});
    case LOAD_TENANT:
      let newTenantsState: TenantsState=Object.assign({}, tenantsState, {tenants:tenantsAction.payload});
      return newTenantsState;
    default:
      return tenantsState;
  }
};
