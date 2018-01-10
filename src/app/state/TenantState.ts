
import {Tenant} from "../domain/model/Tenant";

export interface TenantState{
  tenant: Tenant;
}

export const initialTenantState: TenantState = {tenant: null};
