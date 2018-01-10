
import {Tenant} from "./Tenant";
import {appStore} from "../../store/AppStore";
import {forEach} from "@angular/router/src/utils/collection";

export class User{
  private tenantId: string;
  private username: string;
  private emailAddress: string;
  private enabled: boolean;

  constructor( _tenantId: string, _username: string,  _emailAddress: string, _enabled: boolean){
    this.tenantId = _tenantId;
    this.username = _username;
    this.emailAddress = _emailAddress;
    this.enabled = _enabled;
  }

  getTenantId():string{
    return this.tenantId;
  }

  getUsername():string{
    return this.username;
  }
  getEmailAddress():string{
    return this.emailAddress;
  }

  setTenantId(tenantId:string){
    this.tenantId = tenantId;
  }
  setUsername(userName:string){
    this.username = userName;
  }
  setEmailAddresse(emailAddress:string){
    this.emailAddress = emailAddress;
  }

  setEnabled(enablement: boolean){
    this.enabled = enablement;
  }

  getEnabled():boolean{
    return this.enabled;
  }

  getTenant():Tenant{
    let tenants:Tenant[] = appStore.getState().tenantsState.tenants;
    console.log("tenants: " + JSON.stringify(tenants));
    for (let tenant of tenants){
      console.log("this.tenantId: " + this.tenantId + "\n\ntenant: " + JSON.stringify(tenant));
      if (this.tenantId === tenant.getTenantId()){
        return tenant;
      }
    }
    return null;
  }
}


/*
{
  "tenantId": "5BB1C93E-99A2-4521-859B-370E186254CF",
  "username": "admin",
  "emailAddress": "didier2@gmail.com"
}
 */
