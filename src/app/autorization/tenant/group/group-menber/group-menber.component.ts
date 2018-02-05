import { Component, OnInit } from '@angular/core';
import {GroupMember} from "../../../../domain/model/GroupMember";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {BASE_API_URL} from "../../../../Constante";
import {appStore} from "../../../../store/AppStore";
import {AuthService} from "../../../../auth/AuthService";

@Component({
  selector: 'app-group-menber',
  templateUrl: './group-menber.component.html',
  styleUrls: ['./group-menber.component.css']
})
export class GroupMemberComponent implements OnInit {

  url: string;
  notmemberUrl: string;
  groupMembers: GroupMember[];
  grpname:string;

  constructor(private httpClient: HttpClient, private route: Router, private r:ActivatedRoute, private authService: AuthService) {
    r.params.subscribe(params=>{
      this.url = params['id']?params['id']:/*BASE_API_URL + appStore.getState().tenantState.tenant.getTenantId() +"/groups/"*/'' ;
      this.notmemberUrl = params['notmemberUrl']?params['notmemberUrl']:'';
      this.grpname = params['grpname']?params['grpname']:'';
      console.log("url url url: " + this.url + "\n\nnotmemberUrl: " + this.notmemberUrl + "\n\n");
    });
  }

  ngOnInit() {
    //if (!(this.url === '') && (this.notmemberUrl == '')){
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
    /*}else if (!(this.url === '') && !(this.groupName === '')){

      this.route.navigate(['/autorized/addgroupmembers/', this.url, this.groupName]);

    }*/

  }

  gotoAddGroup() {
    this.route.navigate(["/autorized/addgroupmembers" , this.notmemberUrl, this.grpname]);
  }

  getGroupMembersLinks(message: string) {
    console.log("getGroupMembersLinks: " + message);
    this.url = message;
  }

  getNotGroupMembersLinks(message: string) {
    console.log("getNotGroupMembersLinks: " + message);
    this.notmemberUrl = message;
  }

  getGroupMemberName(message: string) {
    console.log("getGroupMemberName: " + message);
    this.grpname = message;
    this.ngOnInit();
  }

  refreshPage(message: string) {
    console.log("getGroupMemberName: " + message);
    //this.grpname = message;
    this.ngOnInit();
  }



  canAddMembers():boolean{
    let thisTenant = this.authService.extractTenantFromUrl(this.notmemberUrl);
    let connectedTenant = appStore.getState().tenantState.tenant.getTenantId();
    return thisTenant === connectedTenant;
  }
}
