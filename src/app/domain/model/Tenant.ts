
export class Tenant{

  private tenantId: string;
  private name: string;
  private description: string;
  private isActive: boolean;
  private links: any;

  constructor(tenantId: string, name: string, description: string, isActive: boolean, links: any){
    this.tenantId = tenantId;
    this.name = name;
    this.description = description;
    this.isActive = isActive;
    this.links = links;
  }

  getTenantId():string{
    return this.tenantId;
  }

  getName():string{
    return this.name;
  }

  getDescription():string{
    return this.description;
  }

  getIsActive():boolean{
    return this.isActive;
  }

  getLinks():any{
    return this.links;
  }

  setTenantId(aTenantId: string){
    this.tenantId = aTenantId;
  }

  setName(aName: string){
    this.name = aName;
  }

  setDescription(aDescription: string){
    this.description = aDescription;
  }

  setIsActive(aIsActive: boolean){
    this.isActive = aIsActive;
  }

  setLinks(aLinks: any){
    this.links = aLinks;
  }
}


/*
{
      "tenantId": "5BB1C93E-99A2-4521-859B-370E186254CF",
      "name": "BINGO2",
      "description": "HOPITAL BINGO 2",
      "active": true,
      "_links": {
        "self": {
          "href": "http://localhost:8085/api/v1/tenants/5BB1C93E-99A2-4521-859B-370E186254CF"
        },
        "groups": {
          "href": "http://localhost:8085/api/v1/tenants/5BB1C93E-99A2-4521-859B-370E186254CF/groups"
        },
        "users": {
          "href": "http://localhost:8085/api/v1/tenants/5BB1C93E-99A2-4521-859B-370E186254CF/users"
        }
      }
    }
 */
