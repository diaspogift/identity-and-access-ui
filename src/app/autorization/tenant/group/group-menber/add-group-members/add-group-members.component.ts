import { Component, OnInit } from '@angular/core';
import {Group} from "../../../../../domain/model/Group";
import {User} from "../../../../../domain/model/User";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GroupMember} from "../../../../../domain/model/GroupMember";
import {BASE_API_URL} from "../../../../../Constante";
import {appStore} from "../../../../../store/AppStore";


@Component({
  selector: 'app-add-group-members',
  templateUrl: './add-group-members.component.html',
  styleUrls: ['./add-group-members.component.css']
})
export class AddGroupMembersComponent implements OnInit {

  groupMembers: any;
  users: User[];
  groups: Group[];
  freeGroupMembers: any;

  loading: boolean;

  failiure: boolean;

  success: boolean;

  message: string;
  membersToAdd: Array<any>;

  groupName: string;

  rFormAddMembers: FormGroup;
  url: string;


  constructor(private modalService: NgbModal,private fb: FormBuilder,private httpClient: HttpClient, private router: Router, private r:ActivatedRoute) {
    this.rFormAddMembers = fb.group({
    });

    this.loading = false;
    this.success = false;
    this.failiure = false;
    this.message = '';
    this.groupMembers = [];
    this.membersToAdd = [];
    this.freeGroupMembers = [];

    r.params.subscribe(params=>{
      this.url = params['url']?params['url']:/*BASE_API_URL + appStore.getState().tenantState.tenant.getTenantId() +"/groups/"*/'' ;
      this.groupName = params['grpname']?params['grpname']:'';
      console.log("url url url addgroup: " + this.url);
    });
  }

  ngOnInit() {

    this.success = false;
    this.failiure = false;
    this.loading = true;
    this.message = '';

    let url: string =this.url;
    this.httpClient.get(url, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("not group members : " + JSON.stringify(data));

      //groupMembers

      this.freeGroupMembers = data['groupMembers'];
      if (this.freeGroupMembers.length === 0){

      }

      //setTimeout(()=>{
        this.success = true;
        this.failiure = false;
        this.loading = false;
     // }, 3000);

      /*let receivedData = data['groupMembers'];
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

      console.log("not group members : "+ JSON.stringify(this.groupMembers));*/


      /*let url1: string = this.url;//this.group.getLinks()['members'];

      let demiUrl1 : string = url1.substring(BASE_API_URL.length);
      let tenantId: string = demiUrl1.split("\/")[0];

      console.log("EXTRACT URLLL : " + tenantId);

      this.httpClient.get(BASE_API_URL + tenantId + '/users', {
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }).subscribe((users)=>{

        console.log("Users  Users Users Users: " + JSON.stringify(users));
        let receivedData1 = users['users'];
        let index1: number;
        this.users = [];
        console.log("LENGTH LENGTH LENGTH: " + receivedData1.length);
        for (index1=0; index1 < receivedData1.length; index1++){
          let links: any = receivedData1[index1]['_links'];
          let aUser: User = new User(receivedData1[index1]['tenantId'], receivedData1[index1]['username'],
            receivedData1[index1]['emailAddress'], receivedData1[index1]['enabled'], links, null,
            receivedData1[index1]['firstName'], receivedData1[index1]['lastName']); // links a revoir
          console.log(index1 + " - adding: " + JSON.stringify(aUser));
          this.users.push(aUser);
        }

        console.log("Users Users Users Users: " + JSON.stringify(this.users));

        let url2: string = this.url;//this.group.getLinks()['members'];

        let demiUrl2 : string = url2.substring(BASE_API_URL.length);
        let tenantId2: string = demiUrl2.split("\/")[0];

        console.log("EXTRACT URLLL : " + tenantId);

        this.httpClient.get(BASE_API_URL + tenantId + '/groups', {
          headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
            .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
        }).subscribe((groups)=>{

          console.log("Groups Groups Groups Groups: " + JSON.stringify(groups));
          let receivedData2 = groups['groups'];
          let index2: number;
          this.groups = [];
          console.log("LENGTH LENGTH LENGTH: " + receivedData2.length);
          for (index2=0; index2 < receivedData2.length; index2++){
            let links: any = receivedData2[index2]['_links'];
            let aGroup: Group = new Group(receivedData2[index2]['name'],
              receivedData2[index2]['description'], true,{
                self:links['self']['href'], members:links['members']['href']
              });
            console.log(index2 + " - adding: " + JSON.stringify(aGroup));
            this.groups.push(aGroup);
          }

          console.log("Groups Groups Groups Groups: " + JSON.stringify(this.groups));
          //constructor(tenantId: string, name: string, description: string, isActive: boolean, links: any){
          this.freeGroupMembers = [];

          for(let group of this.groups){
            if (!(group.getName()===this.groupName)){
              let booleen:boolean = false;
              let i: number;
              for (i=0; i<this.groupMembers.length && !booleen; i++){
                if ((this.groupMembers[i]['name'] === group.getName()) &&(this.groupMembers[i]['type'] == 'group')){
                  booleen = true;
                }
              }

              if (!booleen){
                this.freeGroupMembers.push({name:group.getName(), type:'group'});
              }
            }
          }

          for(let auser of this.users){
            let booleen:boolean = false;
            let i: number;
            for (i=0; i<this.groupMembers.length && !booleen; i++){
              if ((this.groupMembers[i]['name'] === auser.getUsername()) && (this.groupMembers[i]['type'] == 'user')){
                booleen = true;
              }
            }

            if (!booleen){
              this.freeGroupMembers.push({name:auser.getUsername(), type:'user'});
            }
          }

          console.log("freeGroupMembers: " + JSON.stringify(this.freeGroupMembers));

        });


      });*/

    },(error)=>{
      this.success = false;
      this.failiure = true;
      this.loading = false;
      this.message = "Error";
    },()=>{
      this.loading = false;
    });
  }

  addToMembersToAdd(event) {
    let input : any = event.target;
    console.log("input elem: " + input.name);
    let m = this.getFreeMemberByName(input.name);
    let mm = this.getMemberToAddByName(input.name);
    if (input.checked && mm === null){
      this.membersToAdd.push(m);
    }else if(!input.checked && !(mm===null)){
      console.log("ECHO" + JSON.stringify(mm));
      this.membersToAdd = this.membersToAdd.filter((v)=>{
        return !(v['name'] === mm['name']);
      });
    }

    console.log("this.membersToAdd: " + JSON.stringify(this.membersToAdd));
  }

  getMemberToAddByName(name:string):any{
    for (let m of this.membersToAdd){
      if (m['name'] == name){
        return m;
      }
    }
    return null;
  }

  getFreeMemberByName(name:string):any{
    for (let m of this.freeGroupMembers){
      if (m['name'] == name){
        return m;
      }
    }
    return null;
  }


  addMembers(form){

    console.log("In addMembers");

    this.loading = true;
    this.success = false;
    this.failiure = false;
    this.message = '';

//[{"name":"user","type":"user"},{"name":"ROLE-INTERNAL-GROUP: 7E97C8B6-9093-41CA-B6CB-9EC02B50AB3D","type":"group"},
// {"name":"admin","type":"user"}]
    /*let nativeFormulaire = this.addMemberTogroupFrom.nativeElement;
    let inputs = nativeFormulaire.getElementsByTagName('input');

    for(let input of inputs){
      if (input.type == 'checkbox'){
        console.log("\n\n\n" + input.name + " | " + input.value + " | " + input.checked);
        if (input.checked){
          let m = this.getFreeMemberByName(input.name);
          if (!(m === null)){
            membersToAdd.push(m);

          }
        }
      }
    }*/


    console.log("membersToAdd: " + JSON.stringify(this.membersToAdd));

    /**** ADD it to group*****/

    let url: string = this.url;//this.group.getLinks()['members'];

    let demiUrl : string = url.substring(BASE_API_URL.length);
    let tenantId: string = demiUrl.split("\/")[0];

    console.log("EXTRACT URLLL : " + tenantId);

    //for(let i:number=0; i<this.membersToAdd.length;i++){
      this.loading = true;
      //let member = this.membersToAdd[i];
      this.httpClient.post(BASE_API_URL + encodeURIComponent(tenantId) + "/groups/" +
        encodeURIComponent(this.groupName) + "/members"  , {'groupMembers':this.membersToAdd}, {
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }).subscribe((data)=>{

        console.log("Added Members: " + JSON.stringify(this.membersToAdd) + " was added " + JSON.stringify(data));
        let succededMembers = data['groupMembers'];
        this.message = '';

        for (let member of succededMembers){
          this.message += '\n + ' + member['name'] + ' was added to the group ' + this.groupName + ' \n';
        }
        this.message += '____________________________________________________________';

        /*this.membersToAdd = this.membersToAdd.filter((v)=>{
          return !(v['name'] === member['name']);
        });*/

        /*console.log("memberstoadd: " + JSON.stringify(this.membersToAdd));

        if (this.membersToAdd.length === 0){
          this.ngOnInit();
        }else{

        }*/



        this.success = true;
        this.failiure = false;
        this.ngOnInit();
        //this.router.navigate(['/autorized/addgroupmembers/', this.url, this.groupName]);
        //this.router.navigate(['/autorized/groups', this.tenant.getLinks()['groups']]);

      }, (data) => {
        this.failiure = true;
        this.success = false;
        let succededMembers = this.membersToAdd;
        this.message = '';

        for (let member of succededMembers){
          this.message += '\n + Failed to add ' + member['name'] + '  to the group ' + this.groupName + ' \n';
        }
        this.message += '____________________________________________________________';
        //this.message += 'Failed: for Member  ' + JSON.stringify(data);
        console.log("ADD MEMBER FAILL: " + JSON.stringify(data));
        this.loading = false;
      },()=>{
        this.loading = false;
      });
   // }


  }

}
