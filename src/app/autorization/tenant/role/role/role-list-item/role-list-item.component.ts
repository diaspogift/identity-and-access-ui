import {Component, ElementRef, Input, OnInit, SimpleChanges} from '@angular/core';
import {User} from "../../../../../domain/model/User";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {appStore} from "../../../../../store/AppStore";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../../../../auth/AuthService";
import {Group} from "../../../../../domain/model/Group";
import {Role} from "../../../../../domain/model/Role";
import {ActivatedRoute, Router} from "@angular/router";
import {BASE_API_URL} from "../../../../../Constante";

@Component({
  selector: 'app-role-list-item',
  templateUrl: './role-list-item.component.html',
  styleUrls: ['./role-list-item.component.css']
})
export class RoleListItemComponent implements OnInit {

  @Input('role')role:Role;
  //groupMembers: any;
  users: LocalUser[];
  groups: LocalGroup[];
  groupNotPlayingThisRole: LocalGroup[];
  userNotPlayingThisRole: LocalUser[];
  //freeGroupMembers: any;
  //rFormAddMembers: FormGroup;
  modalReference: any;
  loading: boolean;
  failiure: boolean;
  success: boolean;

  message: string;
  rFormAddGroup: FormGroup;
  rFormRemoveGroup: FormGroup;
  rFormRemoveUser: FormGroup;
  rFormAddUser: FormGroup;

  modify:boolean;



  constructor(private modalService: NgbModal,private fb: FormBuilder,private httpClient: HttpClient,
              private router: Router, private r:ActivatedRoute, private authService: AuthService) {
    this.rFormAddGroup = fb.group({

    });

    this.rFormRemoveGroup = fb.group({

    });

    this.rFormRemoveUser = fb.group({

    });

    this.rFormAddUser = fb.group({

    });



    this.loading = false;
    this.success = false;
    this.failiure = false;
    this.modify = false;
    this.message = '';
    this.users = [];
    this.groups = [];
    this.groupNotPlayingThisRole = [];
    this.userNotPlayingThisRole = [];

    //this.membersToAdd = [];
  }

  ngOnInit() {

  }

  //ngOnChanges(changes: SimpleChanges): void {
 // }

  gotoMembers(){
    this.router.navigate(['/autorized/groupmembers/', this.role.getLinks()['members'], this.role.getLinks()['notMembers'],
      this.role.getName()]);
    //this.router.navigate(["../autorized/register", '76DC6953-AD34-446E-91D0-92934E5DB6D4'], { relativeTo: this.r });
  }

  addGroups(form){
    let numChecked: number = 0;
    let groupsChecked: LocalGroup[] = [];
    for (let g of this.groupNotPlayingThisRole){
      if(g.isChecked()){
        numChecked ++;
        groupsChecked.push(g);
      }
    }

    if(numChecked == 0){
      this.message = 'No group selected...';
      this.success = false;
      this.failiure = true;
      return;
    }


    console.log("Add Groups: " + JSON.stringify(this.groupNotPlayingThisRole));

    this.loading = true;
    this.success = false;
    this.failiure = false;
    this.message = '';


    this.httpClient.post(this.role.getLinks()['self'] + '/groups'  , {'groups':groupsChecked}, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("Added groups: " + JSON.stringify(groupsChecked) + " was added " + JSON.stringify(data));
      let succededMembers = data['groups'];
      this.message = '';

      for (let grp of succededMembers){
        this.message += '\n + ' + grp['name'] + ' was added to the role ' + this.role.getName() + ' \n';
      }
      this.message += '_______________________________';

      this.success = true;
      this.failiure = false;
      this.ngOnInit();
      setTimeout(()=>{
        this.modalReference.close();
      }, 3000);

    }, (data) => {
      this.failiure = true;
      this.success = false;
      this.message = 'Failed';
      this.message += '_______________________________';
      //this.message += 'Failed: for Member  ' + JSON.stringify(data);
      console.log("ADD MEMBER FAILL: " + JSON.stringify(data));
      this.loading = false;
    },()=>{
      this.loading = false;
    });


  }


  addUsers(form){
    let numChecked: number = 0;
    let userChecked: LocalUser[] = [];
    for (let u of this.userNotPlayingThisRole){
      if(u.isChecked()){
        numChecked ++;
        userChecked.push(u);
      }
    }

    if(numChecked == 0){
      this.message = 'No group selected...';
      this.success = false;
      this.failiure = true;
      return;
    }


    console.log("Add Groups: " + JSON.stringify(userChecked));

    this.loading = true;
    this.success = false;
    this.failiure = false;
    this.message = '';


    this.httpClient.post(this.role.getLinks()['self'] + '/users'  , {'users':userChecked}, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("Added users: " + JSON.stringify(userChecked) + " was added " + JSON.stringify(data));
      let succededMembers = data['users'];
      this.message = '';

      for (let usr of succededMembers){
        this.message += '\n + ' + usr['firstName']  + " " + usr['firstName']  + "(" + usr['username'] + ")"+
          ' was removed from the role:  ' + this.role.getName() + ' \n';
      }
      this.message += '________________________________';

      this.success = true;
      this.failiure = false;
      this.ngOnInit();
      setTimeout(()=>{
        this.modalReference.close();
      }, 3000);

    }, (data) => {
      this.failiure = true;
      this.success = false;
      this.message = 'Failed';
      this.message += '______________________________';
      //this.message += 'Failed: for Member  ' + JSON.stringify(data);
      console.log("ADD MEMBER FAILL: " + JSON.stringify(data));
      this.loading = false;
    },()=>{
      this.loading = false;
    });


  }


  getFreeMemberByName(name:string):any{

  }


  gotoGroupToadd(content) {
    this.message = '';
    this.failiure = false;
    this.success = false;
    this.modify = false;
    this.modalReference = this.modalService.open(content);

    this.modalReference.result.then((result) => {

    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.httpClient.get(this.role.getLinks()['self']+'/not-groups', {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("not-groups not-groups not-groups not-groups: " + JSON.stringify(data));
      let receivedData = data['groups'];
      let index: number;
      this.groupNotPlayingThisRole = [];
      console.log("LENGTH LENGTH LENGTH: " + receivedData.length);
      for (index=0; index < receivedData.length; index++){
        let links: any = receivedData[index]['_links'];
        let aLocalgroup: LocalGroup = new LocalGroup(receivedData[index]['name'],
          receivedData[index]['description'], true,{
          }, false);
        console.log(index + " - adding: " + JSON.stringify(aLocalgroup));
        this.groupNotPlayingThisRole.push(aLocalgroup);
      }

      console.log("not-groups not-groups not-groups not-groups: " + JSON.stringify(this.groupNotPlayingThisRole));
      //constructor(tenantId: string, name: string, description: string, isActive: boolean, links: any){
    });

  }

  gotoUserToadd(contentAddUser) {
    this.message = '';
    this.failiure = false;
    this.success = false;
    this.modify = false;
    this.modalReference = this.modalService.open(contentAddUser);

    this.modalReference.result.then((result) => {

    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.httpClient.get(this.role.getLinks()['self']+'/not-users', {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("not-users not-users not-users not-users: " + JSON.stringify(data));
      let receivedData = data['users'];
      let index: number;
      this.userNotPlayingThisRole = [];
      console.log("LENGTH LENGTH LENGTH: " + receivedData.length);
      for (index=0; index < receivedData.length; index++){
        let links: any = receivedData[index]['_links'];
        let aLocaluser: LocalUser = new LocalUser(receivedData[index]['tenantId'],
          receivedData[index]['username'], receivedData[index]['emailAddress'], receivedData[index]['enabled'],
          links, [this.role.getName()], receivedData[index]['firstName'], receivedData[index]['lastName'],
          false);
        console.log(index + " - adding: " + JSON.stringify(aLocaluser));
        this.userNotPlayingThisRole.push(aLocaluser);
      }

      console.log("not-users not-users not-users not-users: " + JSON.stringify(this.userNotPlayingThisRole));
      //constructor(tenantId: string, name: string, description: string, isActive: boolean, links: any){
    });



  }




  gotoGroups(modalGroup){
    this.message = '';
    this.failiure = false;
    this.success = false;
    this.modalReference = this.modalService.open(modalGroup);
    this.modalReference.result.then((result) => {

    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });




    this.httpClient.get(this.role.getLinks()['self']+'/groups', {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("groups groups groups groups: " + JSON.stringify(data));
      let receivedData = data['groups'];
      let index: number;
      this.groups = [];
      console.log("LENGTH LENGTH LENGTH: " + receivedData.length);
      for (index=0; index < receivedData.length; index++){
        let links: any = receivedData[index]['_links'];
        let aLocalgroup: LocalGroup = new LocalGroup(receivedData[index]['name'],
          receivedData[index]['description'], true,{
          }, false);
        console.log(index + " - adding: " + JSON.stringify(aLocalgroup));
        this.groups.push(aLocalgroup);
      }

      console.log("Groups Groups Groups Groups: " + JSON.stringify(this.groups));
      //constructor(tenantId: string, name: string, description: string, isActive: boolean, links: any){
    });

  }

  gotoUsers(modalUser){
    this.message = '';
    this.failiure = false;
    this.success = false;
    this.modalReference = this.modalService.open(modalUser);
    this.modalReference.result.then((result) => {

    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.httpClient.get(this.role.getLinks()['self']+'/users', {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{
      console.log("users users users users: " + JSON.stringify(data));
      let receivedData = data['users'];
      let index: number;
      this.users = [];
      console.log("LENGTH LENGTH LENGTH: " + receivedData.length);
      for (index=0; index < receivedData.length; index++){
        let links: any = receivedData[index]['_links'];
        let aLocaluser: LocalUser = new LocalUser(receivedData[index]['tenantId'],
          receivedData[index]['username'], receivedData[index]['emailAddress'], receivedData[index]['enabled'],
          links, [this.role.getName()], receivedData[index]['firstName'], receivedData[index]['lastName'],
          false);
        console.log(index + " - adding: " + JSON.stringify(aLocaluser));
        this.users.push(aLocaluser);
      }

      console.log("users users users users: " + JSON.stringify(this.users));
      //constructor(tenantId: string, name: string, description: string, isActive: boolean, links: any){
    });
  }

  abandonne() {
    this.modalReference.close();
  }

  addToMembersToAdd(event) {
    /*let input : any = event.target;
    console.log("input elem: " + input.name);
    let m = this.getFreeMemberByName(input.name);
    if (input.checked){
      this.membersToAdd.push(m);
    }

    console.log("this.membersToAdd: " + JSON.stringify(this.membersToAdd));*/
  }


  gotoMembersToadd() {

    console.log("this.group.getLinks()['notMembers'] : " + JSON.stringify(this.role)/*.getLinks()['notMembers']*/);
    this.router.navigate(["/autorized/addgroupmembers" , this.role.getLinks()['notMembers'], this.role.getName()]/*, { relativeTo: this.r }*/);
    //this.router.navigate(['/autorized/groupmembers/', this.group.getLinks()['members'], this.group.getName()]);
    //this.router.navigate(['/autorized/groupmembers/', this.group.getLinks()['members']]);
  }

  canAddGroups():boolean{
    let thisTenant = this.authService.extractTenantFromUrl(this.role.getLinks()['self']);
    let connectedTenant = appStore.getState().tenantState.tenant.getTenantId();
    return thisTenant === connectedTenant;
  }

  toggleChecked(name: string) {
    for (let g of this.groupNotPlayingThisRole){
      if (g.getName() == name){
        g.setChecked(!g.isChecked());
        break;
      }
    }
    console.log("groupNotPlayingThisRole: " + JSON.stringify(this.groupNotPlayingThisRole));
  }

  toggleCheckedGroups(name: string) {
    for (let g of this.groups){
      if (g.getName() == name){
        g.setChecked(!g.isChecked());
        break;
      }
    }
    console.log("groupNotPlayingThisRole: " + JSON.stringify(this.groups));
  }



  noCheched(groups: LocalGroup[]):boolean {
    let numChecked: number = 0;
    for (let g of groups){
      if(g.isChecked()){
        return false;
      }
    }
    return true;
  }


  noChechedUsers(users: LocalUser[]):boolean {
    let numChecked: number = 0;
    for (let u of users){
      if(u.isChecked()){
        return false;
      }
    }
    return true;
  }




  removeGroups(value: any) {
    let numChecked: number = 0;
    let groupsChecked: LocalGroup[] = [];
    for (let g of this.groups){
      if(g.isChecked()){
        numChecked ++;
        groupsChecked.push(g);
      }
    }

    if(numChecked == 0){
      this.message = 'No group selected...';
      this.success = false;
      this.failiure = true;
      return;
    }


    console.log("Add Groups: " + JSON.stringify(groupsChecked));

    this.loading = true;
    this.success = false;
    this.failiure = false;
    this.message = '';

    this.httpClient.request('delete', this.role.getLinks()['self'] + '/groups',
      {
        body: { groups:groupsChecked } ,
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }
      ).subscribe((data)=>{

      console.log("Removed groups: " + JSON.stringify(groupsChecked) + " was removed " + JSON.stringify(data));
      let succededMembers = data['groups'];
      this.message = '';

      for (let grp of succededMembers){
        this.message += '\n + ' + grp['name'] + ' was removed from the role:  ' + this.role.getName() + ' \n';
      }
      this.message += '_________________________________';

      this.success = true;
      this.failiure = false;
      this.ngOnInit();
      setTimeout(()=>{
        this.modalReference.close();
      }, 5000);

    }, (data) => {
      this.failiure = true;
      this.success = false;
      this.message = 'Failed';
      this.message += '_______________________________';
      //this.message += 'Failed: for Member  ' + JSON.stringify(data);
      console.log("REMOVE FROM ROLE: " + JSON.stringify(data));
      this.loading = false;
    },()=>{
      this.loading = false;
    });


    /*this.httpClient.post(this.role.getLinks()['self']  , {'groupMembers':groupsChecked}, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("Added groups: " + JSON.stringify(groupsChecked) + " was added " + JSON.stringify(data));
      let succededMembers = data['groups'];
      this.message = '';

      for (let grp of succededMembers){
        this.message += '\n + ' + grp['name'] + ' was added to the role ' + this.role.getName() + ' \n';
      }
      this.message += '____________________________________________________________';

      this.success = true;
      this.failiure = false;
      this.ngOnInit();
      setTimeout(()=>{
        this.modalReference.close();
      }, 3000);

    }, (data) => {
      this.failiure = true;
      this.success = false;
      this.message = 'Failed';
      this.message += '____________________________________________________________';
      //this.message += 'Failed: for Member  ' + JSON.stringify(data);
      console.log("ADD MEMBER FAILL: " + JSON.stringify(data));
      this.loading = false;
    },()=>{
      this.loading = false;
    });*/
  }

  removeUsers(value: any) {
    let numChecked: number = 0;
    let usersChecked: LocalUser[] = [];
    for (let u of this.users){
      if(u.isChecked()){
        numChecked ++;
        usersChecked.push(u);
      }
    }

    if(numChecked == 0){
      this.message = 'No user selected...';
      this.success = false;
      this.failiure = true;
      return;
    }


    console.log("Add Users: " + JSON.stringify(usersChecked));

    this.loading = true;
    this.success = false;
    this.failiure = false;
    this.message = '';

    this.httpClient.request('delete', this.role.getLinks()['self'] + '/users',
      {
        body: { users:usersChecked } ,
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }
    ).subscribe((data)=>{

      console.log("Removed Users: " + JSON.stringify(usersChecked) + " was removed " + JSON.stringify(data));
      let succededMembers = data['users'];
      this.message = '';

      for (let usr of succededMembers){
        this.message += '\n + ' + usr['firstName']  + " " + usr['firstName']  + "(" + usr['username'] + ")"+
          ' was removed from the role:  ' + this.role.getName() + ' \n';
      }
      this.message += '___________________________';

      this.success = true;
      this.failiure = false;
      this.ngOnInit();
      setTimeout(()=>{
        this.modalReference.close();
      }, 5000);

    }, (data) => {
      this.failiure = true;
      this.success = false;
      this.message = 'Failed';
      this.message += '__________________________';
      //this.message += 'Failed: for Member  ' + JSON.stringify(data);
      console.log("REMOVE FROM ROLE: " + JSON.stringify(data));
      this.loading = false;
    },()=>{
      this.loading = false;
    });


    /*this.httpClient.post(this.role.getLinks()['self']  , {'groupMembers':groupsChecked}, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("Added groups: " + JSON.stringify(groupsChecked) + " was added " + JSON.stringify(data));
      let succededMembers = data['groups'];
      this.message = '';

      for (let grp of succededMembers){
        this.message += '\n + ' + grp['name'] + ' was added to the role ' + this.role.getName() + ' \n';
      }
      this.message += '____________________________________________________________';

      this.success = true;
      this.failiure = false;
      this.ngOnInit();
      setTimeout(()=>{
        this.modalReference.close();
      }, 3000);

    }, (data) => {
      this.failiure = true;
      this.success = false;
      this.message = 'Failed';
      this.message += '____________________________________________________________';
      //this.message += 'Failed: for Member  ' + JSON.stringify(data);
      console.log("ADD MEMBER FAILL: " + JSON.stringify(data));
      this.loading = false;
    },()=>{
      this.loading = false;
    });*/
  }


  toggleCheckedUser(username: string) {
    for (let u of this.users){
      if (u.getUsername() == username){
        u.setChecked(!u.isChecked());
        break;
      }
    }
    console.log("checked user: " + JSON.stringify(this.users));
  }

  toggleCheckedUserNotPlaying(username: string) {
    for (let u of this.userNotPlayingThisRole){
      if (u.getUsername() == username){
        u.setChecked(!u.isChecked());
        break;
      }
    }
    console.log("checked user: " + JSON.stringify(this.userNotPlayingThisRole));
  }

}



class LocalGroup extends Group{
  private checked:boolean;

  constructor(name: string, description: string, isGroup:boolean, links: any, checked:boolean){
    super(name, description, isGroup, links);
    this.checked = checked;
  }

  isChecked():boolean{
    return this.checked;
  }

  setChecked(checked:boolean){
    this.checked = checked;
  }
}


class LocalUser extends User{
  private checked:boolean;

  constructor( _tenantId: string, _username: string,  _emailAddress: string, _enabled: boolean, _links: any, _roles: string[],
               _firstName:string, _lastName:string, checked:boolean){
    super(_tenantId, _username, _emailAddress, _enabled, _links, _roles, _firstName, _lastName);
    this.checked = checked;
  }

  isChecked():boolean{
    return this.checked;
  }

  setChecked(checked:boolean){
    this.checked = checked;
  }
}
