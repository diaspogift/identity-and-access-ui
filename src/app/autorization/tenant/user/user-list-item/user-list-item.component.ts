import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../domain/model/User";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {BASE_API_URL} from "../../../../Constante";
import {appStore} from "../../../../store/AppStore";
import {MyAction} from "../../../../common/MyAction";
import {appActionCreator} from "../../../../actions/Action";
import {CHANGE_TENANT_AVAILABILITY_STATUS} from "../../../../actions/TenantAction";
import {CHANGE_USER_ENABLED} from "../../../../actions/UserAction";

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.css']
})
export class UserListItemComponent implements OnInit {

  @Input('user') user: User;
  hasChanged: boolean;

  //desableObservable: Observable<> =  Rx.Observable.fromEvent("#", 'click');

  constructor(private router: Router, private httpClient: HttpClient, private r:ActivatedRoute) {
    this.hasChanged = false;
  }

  ngOnInit() {
  }

  saveChanges(){
    if(this.hasChanged){
      console.log("Change Occure");

      /*
      private boolean enabled;
    private String startDate;
    private String endDate;
       */

      let time: number = new Date().getTime();
      let yesterday: Date = new Date(time - 24000*3600);
      let options = { timeZone: 'UTC', timeZoneName: 'short' };
      const body = {enabled: this.user.getEnabled(), startDate: new Date().toLocaleString('en-US', options),
        endDate: yesterday.toLocaleString('en-US', options)};
      console.log("\n\n" + JSON.stringify(body) + " \n\n");
      this.httpClient.post(BASE_API_URL + encodeURIComponent(this.user.getTenantId()) +
        "/users/" + encodeURIComponent(this.user.getUsername()) + "/enablement", body , {
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }).subscribe((data)=>{

        console.log("Response data: " + JSON.stringify(data));
        let enablement = {"enabled": data['enabled'], startDate: data['startDate'], endDate: data['endDate']};
        //new User(data['tenantId'], data['username'], data['emailAddress']);
        //availability-status  CHANGE_TENANT_AVAILABILITY_STATUS
        let newUser : User = Object.assign({}, this.user, enablement);

        let monAction:MyAction = appActionCreator(CHANGE_USER_ENABLED, newUser);

        console.log("Users changed ----------- User---------------> ", JSON.stringify(monAction));
        appStore.dispatch(monAction);

        //this.router.navigate(['/autorized']);
      });
      //availability-status
    }
  }

  toggleEnablement(){
    this.user.setEnabled(!this.user.getEnabled());
    this.hasChanged = !this.hasChanged;

    console.log("toggling...........................");
  }

}
