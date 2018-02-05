import { Component, OnInit } from '@angular/core';
import {Tenant} from "../../../domain/model/Tenant";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BASE_API_URL} from "../../../Constante";
import {appStore} from "../../../store/AppStore";
import {ActivatedRoute, Router} from "@angular/router";
import {MyAction} from "../../../common/MyAction";
import {appActionCreator} from "../../../actions/Action";
import {LOAD_TENANT} from "../../../actions/TenantsAction";

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.css']
})
export class TenantComponent implements OnInit {

  tenants:Tenant[];

  constructor(private httpClient: HttpClient, private route: Router, private r:ActivatedRoute) {
    //this.tenants=[];
    console.log("TenantComponent constructor");
  }

  ngOnInit() {

    console.log("dans ngOnInit de TenantComponent");

    let leToken : string = appStore.getState().tokenState.token.accessToken;

    console.log("leTokenleTokenleToken: " + leToken);

    this.httpClient.get(BASE_API_URL, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Bearer '+ leToken)
    }).subscribe((data)=>{

      console.log("Tenants Tenants Tenants Tenants: " + JSON.stringify(data));
      let receivedData = data['tenants'];
      let index: number;
      this.tenants = [];
      console.log("LENGTH LENGTH LENGTH: " + receivedData.length);
      for (index=0; index < receivedData.length; index++){
        let links: any = receivedData[index]['_links'];
        let aTenant: Tenant = new Tenant(receivedData[index]['tenantId'], receivedData[index]['name'],
          receivedData[index]['description'],receivedData[index]['active'],{
          self:links['self']['href'], groups:links['groups']['href'], users:links['users']['href']
        });
        console.log(index + " - adding: " + JSON.stringify(aTenant));
        this.tenants.push(aTenant);
      }

      console.log("Tenants Tenants Tenants Tenants: " + JSON.stringify(this.tenants));
      //let user: User = new User(data['tenantId'], data['username'], data['emailAddress']);

      let monAction:MyAction = appActionCreator(LOAD_TENANT, this.tenants);
      appStore.dispatch(monAction);
      //constructor(tenantId: string, name: string, description: string, isActive: boolean, links: any){
    });
  }


  gotoNewTenant(){
    this.route.navigate(["../../autorized/newtenant"], { relativeTo: this.r });
  }


}
