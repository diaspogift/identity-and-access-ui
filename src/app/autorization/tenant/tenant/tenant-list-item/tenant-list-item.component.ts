import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Tenant} from "../../../../domain/model/Tenant";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BASE_API_URL} from "../../../../Constante";
import {appStore} from "../../../../store/AppStore";
/*
import * as $ from 'jquery';
window["$"] = $;
window["jQuery"] = $;*/

import {MyAction} from "../../../../common/MyAction";
import {appActionCreator} from "../../../../actions/Action";
import {CHANGE_TENANT_AVAILABILITY_STATUS} from "../../../../actions/TenantAction";
import {BsModalComponent} from "ng2-bs3-modal";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-tenant-list-item',
  templateUrl: './tenant-list-item.component.html',
  styleUrls: ['./tenant-list-item.component.css'],

})
export class TenantListItemComponent implements OnInit , OnChanges{


  @Input('tenant')tenant:Tenant;
  hasChanged: boolean;

  closeResult: string;

  loading: boolean;

  failiure: boolean;

  success: boolean;

  message: string;

  modalReference: any;


  /**
   * MODAL config
   */

  /*@ViewChild('modalEdit')
  modalEdit: BsModalComponent;
  items: string[] = ['item1', 'item2', 'item3'];
  selected: string;
  output: string;
  //model: Person = new Person();

  index: number = 0;
  backdropOptions = [true, false, 'static'];
  cssClass: string = '';

  animation: boolean = true;
  keyboard: boolean = true;
  backdrop: string | boolean = true;
  css: boolean = false;


  closed() {
    this.output = '(closed) ' + this.selected;
  }

  dismissed() {
    this.output = '(dismissed)';
  }

  opened() {
    this.output = '(opened)';
  }

  navigate() {
    this.router.navigateByUrl('/hello');
  }

  open() {
    this.modal.open();
  }
*/
  /************** END MODAL CONFIG ***********************************************/




  //desableObservable: Observable<> =  Rx.Observable.fromEvent("#", 'click');

  constructor(private modalService: NgbModal,private router: Router, private httpClient: HttpClient,private ngbActiveModal: NgbActiveModal) {
    this.hasChanged = false;
    this.loading = false;
    this.success = false;
    this.failiure = false;
    this.message = '';
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

  gotoRoles(){
    this.router.navigate(['/autorized/roles/', this.tenant.getLinks()['self'] + '/roles']);
  }

  saveChanges(content){
    if(this.hasChanged){
      console.log("Change Occure");
      this.loading = true;
      this.success = false;
      this.failiure = false;
      this.message = '';

      const body = {active: this.tenant.getIsActive()};
      console.log("\n\n" + JSON.stringify(body) + " \n\n");
      this.httpClient.post(BASE_API_URL + encodeURIComponent(this.tenant.getTenantId()) + "/availability-status", body , {
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }).subscribe((data)=>{

        this.hasChanged = false;
        console.log("Response data: " + JSON.stringify(data));
        let status = {"isActive":data['active']};
        this.tenant.setIsActive(data['active']);
        let monAction:MyAction = appActionCreator(CHANGE_TENANT_AVAILABILITY_STATUS, this.tenant);

        console.log("tenant changed ----------- Tenant---------------> ", JSON.stringify(monAction));
        appStore.dispatch(monAction);
        this.loading = false;
        this.ngbActiveModal.close("");
        this.ngbActiveModal.dismiss('');
        console.log("this.ngbActiveModal: " + JSON.stringify(this.ngbActiveModal));
        this.message = "Save Successfully...";
        this.success = true;
        this.failiure = false;

      },(error)=>{
        this.loading = false;
        this.success = false;
        this.failiure = true;
        this.message = 'Failed: ' + JSON.stringify(error);
      }, ()=>{
         setTimeout(()=> {
          this.loading = false;
          this.success = false;
          this.failiure = false;
           console.log("ALWAYSSSSSSSSSSSSSSSS");
           this.modalReference.close();
        }, 2500);
      });
    }
  }

  toggleState(){
    this.tenant.setIsActive(!this.tenant.getIsActive());
    this.hasChanged = !this.hasChanged;
  }

  openEditModal(content) {

    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      console.log("Opening modal...");
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    /*

    event.preventDefault();

    let parent: HTMLDivElement = event.target.parentNode.parentNode;

    let allBsModal: any = parent.getElementsByTagName("bs-modal");

    let thisModal: any = null;

    console.log("NUMBER OF BSMODAL: " + allBsModal.length);

    for (let i = 0; i<allBsModal.length; i++){
      if (allBsModal[i].id === this.tenant.getTenantId()){
        thisModal = allBsModal[i];
      }
    }

    if (!(thisModal === null)){
      console.log("OPENING MODAL");
      thisModal.open('lg');
    }
    */
  }



  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  abandonne() {
    if (this.hasChanged){
      this.toggleState();
    }
    this.modalReference.close();
  }
}
