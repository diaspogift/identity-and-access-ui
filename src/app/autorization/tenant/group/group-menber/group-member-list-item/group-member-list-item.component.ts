import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {GroupMember} from '../../../../../domain/model/GroupMember';
import {FormBuilder, FormGroup} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {BASE_API_URL} from "../../../../../Constante";
import {appStore} from "../../../../../store/AppStore";

@Component({
  selector: 'app-group-member-list-item',
  templateUrl: './group-member-list-item.component.html',
  styleUrls: ['./group-member-list-item.component.css']
})
export class GroupMemberListItemComponent implements OnInit {

  @Output('sendGroupMembersLink') sendGroupMembersLink: EventEmitter<string>;
  @Output('sendNotMembersLink') sendNotMembersLink: EventEmitter<string>;
  @Output('sendGroupMemberName') sendGroupMemberName: EventEmitter<string>;
  @Output('sendRefreshGroupMembers') sendRefreshGroupMembers: EventEmitter<string>;
  @Input('groupMember') groupMember: GroupMember;
  @Input('groupName') groupName: string;
  @Input('membersUrl') membersUrl:string;
  loading: boolean;
  success: boolean;
  failiure: boolean;
  message: string;
  modalReference: any;
  rFormRemoveMember: FormGroup;
  constructor(private modalService: NgbModal,private fb: FormBuilder,private httpClient: HttpClient, private router: Router, private r:ActivatedRoute) {

    this.sendGroupMembersLink = new EventEmitter();
    this.sendNotMembersLink = new EventEmitter();
    this.sendGroupMemberName = new EventEmitter();
    this.sendRefreshGroupMembers = new EventEmitter();
    this.loading = false;
    this.success = false;
    this.failiure = false;
    this.message = '';

    this.rFormRemoveMember = fb.group({
    });


    r.params.subscribe(params=>{
      //this.url = params['url']?params['url']:/*BASE_API_URL + appStore.getState().tenantState.tenant.getTenantId() +"/groups/"*/'' ;
      //this.groupName = params['grpname']?params['grpname']:'';
      //console.log("url url url addgroup: " + this.url);
    });
  }

  ngOnInit() {
  }

  removeMember(form){
    this.loading = true;
    this.success = false;
    this.failiure = false;
    this.message = '';

    this.httpClient.request('delete', this.membersUrl + '/' + encodeURIComponent(this.groupMember.getName())
      + "?type=" + this.groupMember.getType(),
      {
        body: {  } ,
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }
    ).subscribe((data)=>{

      console.log("Removed member from group: " + this.groupMember.getName() + " was removed from " + this.groupName + " \n\n" + JSON.stringify(data));

      this.message = 'The group Member ' + this.groupMember.getName() + " was removed successfully from " + this.groupName;


      this.message += '\n\n';

      this.success = true;
      this.failiure = false;
      this.ngOnInit();
      setTimeout(()=>{
        this.modalReference.close();
        this.emitRefreshGroupMembers();
      }, 5000);

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

  abandonne() {
    this.modalReference.close();
  }


  emitGroupmembersLink(){
    this.sendGroupMembersLink.emit(this.groupMember.getLinks()['self']['href'] + '/members');
  }

  emitNotGroupmembersLink(){
    this.sendNotMembersLink.emit(this.groupMember.getLinks()['self']['href'] + '/not-members');
  }

  emitGroupmemberName(){
    this.sendGroupMemberName.emit(this.groupMember.getName());
  }
  emitRefreshGroupMembers(){
    this.sendRefreshGroupMembers.emit(this.groupName);

  }

  /*gotoMembers(){
    console.log("this.groupMember.getLinks()['self']['href']: " + this.groupMember.getLinks()['self']['href']);

    let url: string = this.groupMember.getLinks()['self']['href'];
    let demiUrl1 : string = url.substring(BASE_API_URL.length);
    let tenantId: string = demiUrl1.split("\/")[0];
    this.router.navigate(['/autorized/groupmembers/',  this.groupMember.getLinks()['self']['href'] + '/members' ,
      this.groupMember.getLinks()['self']['href'] + '/not-members',
      this.groupMember.getName()]);

  }*/

  openConfirmRemovModal(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      //console.log("Opening modal...");
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}


