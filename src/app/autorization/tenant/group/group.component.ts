import { Component, OnInit } from '@angular/core';
import {Group} from "../../../domain/model/Group";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {appStore} from "../../../store/AppStore";
import {ActivatedRoute} from "@angular/router";
import {BASE_API_URL} from "../../../Constante";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  groups:Group[];
  url: string;

  constructor(private httpClient: HttpClient, private route: ActivatedRoute) {
    route.params.subscribe(params=>{
      this.url = params['id']?params['id']:BASE_API_URL + appStore.getState().tenantState.tenant.getTenantId() +"/groups";
      console.log("url url url: " + this.url);
    });
  }

  ngOnInit() {

    this.httpClient.get(this.url, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("Groups Groups Groups Groups: " + JSON.stringify(data));
      let receivedData = data['groups'];
      let index: number;
      this.groups = [];
      console.log("LENGTH LENGTH LENGTH: " + receivedData.length);
      for (index=0; index < receivedData.length; index++){
        let links: any = receivedData[index]['_links'];
        let aGroup: Group = new Group(receivedData[index]['name'],
          receivedData[index]['description'], false,{
            self:links['self']['href'], members:links['members']['href']
          });
        console.log(index + " - adding: " + JSON.stringify(aGroup));
        this.groups.push(aGroup);
      }

      console.log("Groups Groups Groups Groups: " + JSON.stringify(this.groups));
      //constructor(tenantId: string, name: string, description: string, isActive: boolean, links: any){
    });
  }

}
