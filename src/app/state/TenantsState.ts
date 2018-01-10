
import {Tenant} from "../domain/model/Tenant";

export interface TenantsState {
  tenants: Tenant[];
}

export const initialTenantsState: TenantsState = {tenants: []};
