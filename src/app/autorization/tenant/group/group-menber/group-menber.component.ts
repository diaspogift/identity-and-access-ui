import { Component, OnInit } from '@angular/core';
import {GroupMember} from "../../../../domain/model/GroupMember";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {BASE_API_URL} from "../../../../Constante";
import {appStore} from "../../../../store/AppStore";

@Component({
  selector: 'app-group-menber',
  templateUrl: './group-menber.component.html',
  styleUrls: ['./group-menber.component.css']
})
export class GroupMemberComponent implements OnInit {

  url: string;
  groupMembers: GroupMember[];

  constructor(private httpClient: HttpClient, private route: Router, private r:ActivatedRoute) {
    r.params.subscribe(params=>{
      this.url = params['id']?params['id']:/*BASE_API_URL + appStore.getState().tenantState.tenant.getTenantId() +"/groups/"*/'' ;
      console.log("url url url: " + this.url);
    });
  }

  ngOnInit() {
    if (!(this.url === '')){
      this.httpClient.get(this.url, {
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }).subscribe((data)=>{

        console.log("Groups Members Groups Members Groups Members : " + JSON.stringify(data));
        let receivedData = data['groupMembers'];
        let index: number;
        this.groupMembers = [];
        console.log("LENGTH LENGTH LENGTH: " + receivedData.length);
        for (index=0; index < receivedData.length; index++){
          let links: any = receivedData[index]['_links'];
          let aMember: GroupMember = new GroupMember(receivedData[index]['name'],
            receivedData[index]['type'],links);
          console.log(index + " - adding: " + JSON.stringify(aMember));
          this.groupMembers.push(aMember);
        }

        console.log("Groups Members Groups Members Groups Members : "+ JSON.stringify(this.groupMembers));
        //constructor(tenantId: string, name: string, description: string, isActive: boolean, links: any){
      });
    }
  }

}
