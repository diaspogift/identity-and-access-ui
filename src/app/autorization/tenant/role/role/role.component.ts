import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../../../auth/AuthService";
import {Group} from "../../../../domain/model/Group";
import {Role} from "../../../../domain/model/Role";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute} from "@angular/router";
import {BASE_API_URL} from "../../../../Constante";
import {appStore} from "../../../../store/AppStore";

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  tenant: any;
  tenantUrl: string;

  roles:Role[];
  url: string;

  rFormNewRole: FormGroup;
  description: string;
  name: string;
  modalReference: any;
  message: string;
  loading: boolean;
  failiure: boolean;
  success: boolean;
  supportsNesting: boolean;


  constructor(private modalService: NgbModal, private fb: FormBuilder,private httpClient: HttpClient, private route: ActivatedRoute, private r:ActivatedRoute, private authService: AuthService) {
    route.params.subscribe(params=>{
      this.url = params['id']?params['id']:BASE_API_URL + appStore.getState().tenantState.tenant.getTenantId() +"/roles";
      this.tenantUrl = BASE_API_URL + this.authService.extractTenantFromUrl(this.url);
      console.log("url url url: " + this.url);
    });

    this.rFormNewRole = fb.group({
      //'tenantId' : [null, Validators.required],
      'description' : [null, Validators.required],
      'name' : [null, Validators.required],
      'supportsNesting': [null, Validators.required]
      //'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      //'validate' : ''
    });

    this.message = '';

    this.loading = false;
    this.success = false;
    this.failiure = false;
    this.supportsNesting = true;
    this.tenant = {name:''};

  }

  ngOnInit() {

    this.failiure = false;
    this.loading = true;
    this.success = false;
    this.httpClient.get(this.url, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      this.success = true;
      this.failiure = false;
      this.message = 'Success';
      console.log("Roles Roles Roles Roles: " + JSON.stringify(data));
      let receivedData = data['roles'];
      let index: number;
      this.roles = [];
      console.log("LENGTH LENGTH LENGTH: " + receivedData.length);
      for (index=0; index < receivedData.length; index++){
        let links: any = receivedData[index]['_links'];
        let aRole: Role = new Role(receivedData[index]['name'],
          receivedData[index]['description'], false,{
            self:links['self']['href']
        });
        console.log(index + " - adding: " + JSON.stringify(aRole));
        this.roles.push(aRole);
      }

      console.log("Roles Roles Roles Roles: " + JSON.stringify(this.roles));
      //constructor(tenantId: string, name: string, description: string, isActive: boolean, links: any){

      this.failiure = false;
      this.loading = true;
      this.success = false;

      this.httpClient.get(this.tenantUrl, {
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }).subscribe((donnees)=>{


        this.tenant = donnees;

        this.success = true;
        this.failiure = false;
        this.message = 'Success';

        /*
        {
  "tenantId": "DECAC906-0EBE-48A7-8D0A-8674A6FFDDBB",
  "name": "DASPOGIFT",
  "description": "DIASPORA GIFT",
  "active": true
}
         */

      },(error)=>{

        this.loading = false;
        this.failiure = true;
        this.success = false;
        this.message = 'Error occured';

      },()=>{
        setTimeout(()=>{
          this.loading = false;
        }, 0);
      });
    },(data)=>{
      this.loading = false;
      this.failiure = true;
      this.success = false;
      this.message = 'Error occured';
    }, ()=>{

    });
  }


  toggleSupportsNesting(){
    this.supportsNesting = !this.supportsNesting;
  }


  createRoles(form){

    this.description = form.description;
    this.name = form.name;


    this.loading = true;
    this.success = false;
    this.failiure = false;
    this.message = '';

    let body = {
      description:this.description,
      name: this.name,
      supportsNesting:this.supportsNesting
    };

    this.httpClient.post(this.url , body, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("Response data for Create Group: " + JSON.stringify(data));
      this.message = 'Success: ' + JSON.stringify(data);

      this.success = true;
      this.failiure = false;

      this.ngOnInit();

      setTimeout(()=>{
        this.modalReference.close();
      }, 3000);


    }, (data) => {
      //this.errorMessage = "An error occured: " + data;
      this.failiure = true;
      this.success =false;
      this.message = "An error occured: " + JSON.stringify(data);
    }, ()=>{
      if (this.failiure == false){
        this.message = "Role created successfully";
      }
      this.loading = false;
    });
  }

  abandonne() {
    this.modalReference.close();
  }

  openAddRole(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      console.log("Opening modal...");
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  canCreateRole():boolean{
    let thisTenant = this.authService.extractTenantFromUrl(this.url);
    let connectedTenant = appStore.getState().tenantState.tenant.getTenantId();
    return thisTenant === connectedTenant;
  }

}
