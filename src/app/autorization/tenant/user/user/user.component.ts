import { Component, OnInit } from '@angular/core';
import {User} from "../../../../domain/model/User";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {BASE_API_URL} from "../../../../Constante";
import {appStore} from "../../../../store/AppStore";
import {LOAD_USERS} from "../../../../actions/UserAction";
import {appActionCreator} from "../../../../actions/Action";
import {MyAction} from "../../../../common/MyAction";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users:User[];

  url: string;
  constructor(private httpClient: HttpClient, private route: Router, private r:ActivatedRoute) {
    r.params.subscribe(params=>{
      this.url = params['id']?params['id']:BASE_API_URL + appStore.getState().tenantState.tenant.getTenantId() +"/users";
      console.log("url url url: " + this.url);
    });
  }

  ngOnInit() {

    this.httpClient.get(this.url, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("Users  Users Users Users: " + JSON.stringify(data));
      let receivedData = data['users'];
      let index: number;
      this.users = [];
      console.log("LENGTH LENGTH LENGTH: " + receivedData.length);
      for (index=0; index < receivedData.length; index++){
        let links: any = receivedData[index]['_links'];
        let aUser: User = new User(receivedData[index]['tenantId'], receivedData[index]['username'],
          receivedData[index]['emailAddress'], false);
        console.log(index + " - adding: " + JSON.stringify(aUser));
        this.users.push(aUser);
      }

      console.log("Users Users Users Users: " + JSON.stringify(this.users));

      if (this.users.length > 0){
        let monAction:MyAction = appActionCreator(LOAD_USERS, {'tenantid':this.users[0].getTenantId(), 'users':this.users});
        appStore.dispatch(monAction);
      }


      //constructor(tenantId: string, name: string, description: string, isActive: boolean, links: any){
    });
  }

}
