
import {Tenant} from "./Tenant";
import {appStore} from "../../store/AppStore";
import {forEach} from "@angular/router/src/utils/collection";

export class User{
  private tenantId: string;
  private username: string;
  private emailAddress: string;
  private enabled: boolean;
  private firstName: string;
  private lastName: string;
  private links: any;
  private roles: string[];

  constructor( _tenantId: string, _username: string,  _emailAddress: string, _enabled: boolean, _links: any, _roles: string[],
               _firstName:string, _lastName:string){
    this.tenantId = _tenantId;
    this.username = _username;
    this.emailAddress = _emailAddress;
    this.enabled = _enabled;
    this.links = _links;
    this.roles = _roles;
    this.firstName = _firstName;
    this.lastName = _lastName;
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

  getRoles():string[]{
    return this.roles;
  }

  setRoles(aRoles: string[]){
    this.roles = aRoles;
  }

  getFirstName():string{
    return this.firstName;
  }

  getLastNane():string{
    return this.lastName;
  }

  setFirstName(_firstName:string):void{
    this.firstName = _firstName;
  }

  setLastName(lastName:string):void{
    this.lastName = lastName;
  }

  getLinks():any{
    return this.links;
  }

  setLinks(links: any):void{
    this.links = links;
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
    return appStore.getState().tenantState.tenant;
  }
}


