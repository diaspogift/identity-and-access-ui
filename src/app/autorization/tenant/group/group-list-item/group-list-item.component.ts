import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {Group} from "../../../../domain/model/Group";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GroupMember} from "../../../../domain/model/GroupMember";
import {appStore} from "../../../../store/AppStore";
import {User} from "../../../../domain/model/User";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../auth/AuthService";
import {BASE_API_URL} from "../../../../Constante";

@Component({
  selector: 'app-group-list-item',
  templateUrl: './group-list-item.component.html',
  styleUrls: ['./group-list-item.component.css']
})
export class GroupListItemComponent implements OnInit , OnChanges/*, AfterViewInit*/{


  @Output('sendRefreshGroup') sendRefreshGroup: EventEmitter<string>;
  @Input('group')group:Group;
  groupMembers: LocalGroupMember[];
  users: User[];
  groups: Group[];
  freeGroupMembers: any;
  rFormAddMembers: FormGroup;
  rFormRemoveGroupMembers: FormGroup;
  modalReference: any;
  loading: boolean;

  failiure: boolean;

  success: boolean;

  message: string;
  membersToAdd: Array<any>;

  @ViewChild("addMemberTogroupFrom", {read: ElementRef}) addMemberTogroupFrom: ElementRef;
  //@ViewChild("tref", {read: ElementRef}) tref: ElementRef;

/*
  ngAfterViewInit(): void {
    // outputs `I am span`
    //console.log("this.tref.nativeElement.textContent: " + this.tref.nativeElement.textContent);
    console.log("this.addMemberTogroupFrom.nativeElement.textContent: " + this.addMemberTogroupFrom.nativeElement.innerHTML);
  }*/


  constructor(private modalService: NgbModal,private fb: FormBuilder,private httpClient: HttpClient,
              private router: Router, private r:ActivatedRoute, private authService: AuthService) {
    this.rFormAddMembers = fb.group({
    });

    this.rFormRemoveGroupMembers = fb.group({

    });

    this.loading = false;
    this.success = false;
    this.failiure = false;
    this.message = '';
    this.membersToAdd = [];
    this.sendRefreshGroup = new EventEmitter<string>();
    this.groupMembers = [];
  }

  ngOnInit() {
    /*let url: string = this.group.getLinks()['members'];
    this.httpClient.get(url, {
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


      let url1: string = this.group.getLinks()['members'];

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

        let url2: string = this.group.getLinks()['members'];

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
            if (!(group.getName()===this.group.getName())){
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


      });

    });*/
  }

  ngOnChanges(changes: SimpleChanges): void {
  }



  gotoMembers(){
    this.router.navigate(['/autorized/groupmembers/', this.group.getLinks()['members'], this.group.getLinks()['notMembers'],
      this.group.getName()]);
    //this.router.navigate(["../autorized/register", '76DC6953-AD34-446E-91D0-92934E5DB6D4'], { relativeTo: this.r });
  }

  transform(str:string):string{
    return str.replace(/\:|@|\.|\s/g,'');
  }


  addMembers(form){

    /*console.log("In addMembers");

    this.loading = true;
    this.success = false;
    this.failiure = false;
    this.message = '';

    console.log("In addMembers : " + JSON.stringify(this.membersToAdd));

    let membersToAdd: Array<any> = [];
    for(let j=0; j<this.membersToAdd.length; j++){
      let i:number;
      for (i=0; i<membersToAdd.length; i++){
        if(membersToAdd[i]['name'] == this.membersToAdd[j]['name'] && membersToAdd[i]['type'] == this.membersToAdd[j]['type']){
          break;
        }
      }
      console.log("iiiiiiiiiiiii= " + i + " ;  lenght: " + membersToAdd.length);
      if (i>=membersToAdd.length){
        membersToAdd.push(this.membersToAdd[j]);
      }
    }*/
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


    //console.log("membersToAdd: " + JSON.stringify(membersToAdd));

    /**** ADD it to group*****/

    /*let url1: string = this.group.getLinks()['members'];

    let demiUrl1 : string = url1.substring(BASE_API_URL.length);
    let tenantId: string = demiUrl1.split("\/")[0];

    console.log("EXTRACT URLLL : " + tenantId);

    for(let member of membersToAdd){
      this.loading = true;
      this.httpClient.post(BASE_API_URL + encodeURIComponent(tenantId) + "/groups/" +
        encodeURIComponent(this.group.getName()) + "/members"  , member, {
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }).subscribe((data)=>{

        console.log("Added Members: " + JSON.stringify(member) + " was added \n\nResponse: " + JSON.stringify(data) + "\n\n");
        //this.router.navigate(['/autorized/groups', this.tenant.getLinks()['groups']]);

      }, (data) => {
        this.failiure = true;
        this.message += 'Failed: for Member  ' + member;
        console.log("ADD MEMBER FAILL: " + JSON.stringify(data));
      },()=>{
        if (!this.failiure){
          this.message += "Succeded to add member: " + member['name'] + '.  ';
        }
        this.loading = false;
      });
    }*/


  }

  getFreeMemberByName(name:string):any{
    for (let m of this.freeGroupMembers){
      if (m['name'] == name){
        return m;
      }
    }
    return null;
  }


  openAddMemberModal(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      console.log("Opening modal...");
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  abandonne() {
    this.modalReference.close();
  }

  addToMembersToAdd(event) {
    let input : any = event.target;
    console.log("input elem: " + input.name);
    let m = this.getFreeMemberByName(input.name);
    if (input.checked){
      this.membersToAdd.push(m);
    }

    console.log("this.membersToAdd: " + JSON.stringify(this.membersToAdd));
  }


  gotoMembersToadd() {

    console.log("this.group.getLinks()['notMembers'] : " + JSON.stringify(this.group)/*.getLinks()['notMembers']*/);
    this.router.navigate(["/autorized/addgroupmembers" , this.group.getLinks()['notMembers'], this.group.getName()]/*, { relativeTo: this.r }*/);
    //this.router.navigate(['/autorized/groupmembers/', this.group.getLinks()['members'], this.group.getName()]);
    //this.router.navigate(['/autorized/groupmembers/', this.group.getLinks()['members']]);
  }

  canAddMembers():boolean{
    let thisTenant = this.authService.extractTenantFromUrl(this.group.getLinks()['members']);
    let connectedTenant = appStore.getState().tenantState.tenant.getTenantId();
    return thisTenant === connectedTenant;
  }

  gotoMembersToRemove(memberToremoveModal) {

    this.openAddMemberModal(memberToremoveModal);

    this.message = '';
    this.failiure = false;
    this.loading = true;
    this.success = false;

    this.httpClient.get(this.group.getLinks()['members'], {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      this.success = true;
      this.failiure = false;
      this.message = '';

      console.log("Groups Members Groups Members Groups Members : " + JSON.stringify(data));
      let receivedData = data['groupMembers'];
      let index: number;
      this.groupMembers = [];
      console.log("LENGTH LENGTH LENGTH: " + receivedData.length);
      for (index=0; index < receivedData.length; index++){
        let links: any = receivedData[index]['_links'];
        let aMember: LocalGroupMember = new LocalGroupMember(receivedData[index]['name'],
          receivedData[index]['type'],links, false);
        console.log(index + " - adding: " + JSON.stringify(aMember));
        this.groupMembers.push(aMember);
      }

      console.log("Groups Members Groups Members Groups Members : "+ JSON.stringify(this.groupMembers));
      this.failiure = (this.groupMembers.length === 0)? true:false;
      this.message = (this.groupMembers.length === 0)? "No Members found":"";
      console.log("failiure: " + this.failiure + "  message: " + this.message);
      this.loading = false;
      this.success = !this.failiure;
      //constructor(tenantId: string, name: string, description: string, isActive: boolean, links: any){
    },(data)=>{
      this.loading = false;
      this.failiure = true;
      this.success = false;
      this.message = 'Error occured';
    }, ()=>{
      this.loading = false;
    });

    //this.router.navigate(['/autorized/groupmembers/', this.group.getLinks()['members'], this.group.getLinks()['notMembers'], this.group.getName()]);
  }

  noCheched(groups: LocalGroupMember[]):boolean {
    let numChecked: number = 0;
    for (let g of this.groupMembers){
      if(g.getIsChecked()){
        return false;
      }
    }
    return true;
  }

toggleCheckedGroupMembers(name: string) {
  for (let g of this.groupMembers){
    if (g.getName() == name){
      g.setIsChecked(!g.getIsChecked());
      //g.setChecked(!g.isChecked());
      break;
    }
  }
  console.log("groupMembers: " + JSON.stringify(this.groupMembers));
}

  removeGroupsMembers(from) {

    let numChecked: number = 0;
    let groupsMembersChecked: LocalGroupMember[] = [];
    for (let g of this.groupMembers){
      if(g.getIsChecked()){
        numChecked ++;
        groupsMembersChecked.push(g);
      }
    }

    if(numChecked == 0){
      this.message = 'No group selected...';
      this.success = false;
      this.failiure = true;
      return;
    }


    this.loading = true;
    this.success = false;
    this.failiure = false;
    this.message = '';

    this.httpClient.request('delete', this.group.getLinks()['members'] ,
      {
        body: { groupMembers:  groupsMembersChecked} ,
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }
    ).subscribe((data)=>{

      console.log("Removed member from group: " + " \n\n" + JSON.stringify(data));



      this.message = 'The operation was executed successfully';


      this.message += '\n\n';

      this.success = true;
      this.failiure = false;
      this.ngOnInit();
      setTimeout(()=>{
        this.modalReference.close();
        this.emitRefreshGroup();
      }, 2500);

    }, (data) => {
      this.failiure = true;
      this.success = false;
      this.message = 'Failed';
      this.message += '';
      //this.message += 'Failed: for Member  ' + JSON.stringify(data);
      console.log("REMOVE FROM Group: " + JSON.stringify(data));
      this.loading = false;
    },()=>{
      this.loading = false;
    });

  }

  emitRefreshGroup(){
    this.sendRefreshGroup.emit(BASE_API_URL + this.authService.extractTenantFromUrl(this.group.getLinks()['members']) + "/groups");
  }
}

class LocalGroupMember extends GroupMember{
  isChecked:boolean;
  constructor(name: string, type: string, link:any, isChecked: boolean){
    super(name, type, link);
    this.isChecked = isChecked;
  }

  getIsChecked():boolean{
    return this.isChecked;
  }

  setIsChecked(isChecked:boolean){
    this.isChecked = isChecked;
  }
}
