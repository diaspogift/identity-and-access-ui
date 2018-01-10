import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Tenant} from "../../../../domain/model/Tenant";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BASE_API_URL} from "../../../../Constante";
import {appStore} from "../../../../store/AppStore";
import {User} from "../../../../domain/model/User";
import {MyAction} from "../../../../common/MyAction";
import {appActionCreator} from "../../../../actions/Action";
import {CHANGE_TENANT_AVAILABILITY_STATUS} from "../../../../actions/TenantAction";

@Component({
  selector: 'app-tenant-list-item',
  templateUrl: './tenant-list-item.component.html',
  styleUrls: ['./tenant-list-item.component.css'],

})
export class TenantListItemComponent implements OnInit , OnChanges{


  @Input('tenant')tenant:Tenant;
  hasChanged: boolean;

  //desableObservable: Observable<> =  Rx.Observable.fromEvent("#", 'click');

  constructor(private router: Router, private httpClient: HttpClient) {
    this.hasChanged = false;
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['tenant']) {
      //this.groupPosts = this.groupByCategory(this.data);
      //this.initialTenant = changes['tenant'].currentValue;
      console.log("changes['tenant'].currentValue: ", JSON.stringify(changes['tenant'].currentValue));
    }

  }

  gotoGroups(){
    this.router.navigate(['/autorized/groups', this.tenant.getLinks()['groups']]);
  }

  gotoUsers(){
    this.router.navigate(['/autorized/users/', this.tenant.getLinks()['users']]);
  }

  saveChanges(){
    if(this.hasChanged){
      console.log("Change Occure");

      const body = {active: this.tenant.getIsActive()};
      console.log("\n\n" + JSON.stringify(body) + " \n\n");
      this.httpClient.post(BASE_API_URL + encodeURIComponent(this.tenant.getTenantId()) + "/availability-status", body , {
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }).subscribe((data)=>{

        this.hasChanged = false;
        console.log("Response data: " + JSON.stringify(data));
        let status = {"isActive":data['active']};
        //new User(data['tenantId'], data['username'], data['emailAddress']);
        //availability-status  CHANGE_TENANT_AVAILABILITY_STATUS

       //let myNewTenant : Tenant = Object.assign({}, this.tenant, status);

        this.tenant.setIsActive(data['active']);
        //let myNewTenant : Tenant =
       //console.log("::::::::::::::::::::::::" + JSON.stringify(myNewTenant));
        let monAction:MyAction = appActionCreator(CHANGE_TENANT_AVAILABILITY_STATUS, this.tenant);

        console.log("tenant changed ----------- Tenant---------------> ", JSON.stringify(monAction));
        appStore.dispatch(monAction);

        //this.router.navigate(['/autorized']);
      });
      //availability-status
    }
  }

  toggleState(){
    this.tenant.setIsActive(!this.tenant.getIsActive());
    this.hasChanged = !this.hasChanged;
  }
}
