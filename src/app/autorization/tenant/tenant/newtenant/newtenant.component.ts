import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BASE_API_URL} from "../../../../Constante";
import {appStore} from "../../../../store/AppStore";
import {ActivatedRoute, Router} from "@angular/router";




@Component({
  selector: 'app-newtenant',
  templateUrl: './newtenant.component.html',
  styleUrls: ['./newtenant.component.css']
})
export class NewtenantComponent implements OnInit {

  message: string;

  tenantInfo: any;

  rForm: FormGroup;

  success: boolean;

  constructor(private fb: FormBuilder,private httpClient: HttpClient, private route:Router, private r:ActivatedRoute) {
    this.message = '';
    this.success = false;

    this.rForm = fb.group({
      //'tenantId' : [null, Validators.required],
      'tenantName' : [null, Validators.required],
      'tenantDescription' : [null, Validators.required],
      'administorFirstName' : [null, Validators.required],
      'administorLastName' : [null, Validators.required],
      'emailAddress' : [null, Validators.required],
      'primaryTelephone' : [null, Validators.required],
      'secondaryTelephone' : [null, Validators.required],
      'primaryCountryCode' : [null, Validators.required],
      'primaryDialingCountryCode' : [null, Validators.required],
      'secondaryCountryCode' : [null, Validators.required],
      'secondaryDialingCountryCode' : [null, Validators.required],
      'addressStreetAddress' : [null, Validators.required],
      'addressCity' : [null, Validators.required],
      'addressStateProvince' : [null, Validators.required],
      'addressPostalCode' : [null, Validators.required],
      'addressCountryCode' : [null, Validators.required],


      //'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      //'validate' : ''
    });

    this.tenantInfo = {};
  }

  ngOnInit() {
  }

  addNewTenant(post){

    this.message = '';
    this.success = false;

    this.tenantInfo.tenantName = post.tenantName;
    this.tenantInfo.tenantDescription = post.tenantDescription;
    this.tenantInfo.administorFirstName = post.administorFirstName;
    this.tenantInfo.administorLastName = post.administorLastName;
    this.tenantInfo.emailAddress = post.emailAddress;
    this.tenantInfo.primaryTelephone = post.primaryTelephone;
    this.tenantInfo.secondaryTelephone = post.secondaryTelephone;
    this.tenantInfo.primaryCountryCode = post.primaryCountryCode;
    this.tenantInfo.primaryDialingCountryCode = post.primaryDialingCountryCode;
    this.tenantInfo.secondaryCountryCode = post.secondaryCountryCode;
    this.tenantInfo.secondaryDialingCountryCode = post.secondaryDialingCountryCode;
    this.tenantInfo.addressStreetAddress = post.addressStreetAddress;
    this.tenantInfo.addressCity = post.addressCity;
    this.tenantInfo.addressStateProvince = post.addressStateProvince;
    this.tenantInfo.addressPostalCode = post.addressPostalCode;
    this.tenantInfo.addressCountryCode = post.addressCountryCode;

    console.log("\n\n" + JSON.stringify(this.tenantInfo));


    this.httpClient.post(BASE_API_URL +  "provisions", this.tenantInfo , {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("Response data: " + JSON.stringify(data));

      if (data['tenantId'] && data['tenantName'] && data['tenantDescription']){
        this.success = true;
        this.message = 'Successfully Created';
        this.route.navigate(["../tenants"], { relativeTo: this.r });
        //this.route.navigate(['tenants']);
      }else {
        this.success = false;
        this.message = 'Failed: Some thing went wrong';
      }

      //let status = {"isActive":data['active']};

      //let myNewTenant : Tenant = Object.assign({}, this.tenant, status);

      //let monAction:MyAction = appActionCreator(CHANGE_TENANT_AVAILABILITY_STATUS, myNewTenant);

      //console.log("tenant changed ----------- Tenant---------------> ", JSON.stringify(monAction));
      //appStore.dispatch(monAction);

      //this.router.navigate(['/autorized']);
    });

  }

}

/*
"\t\"tenantName\" : \"test tenant\",\n" +
"\t\"tenantDescription\" : \"Super marche de boppi\",\n" +
"\t\"administorFirstName\" : \"Didier\",\n" +
"\t\"administorLastName\" : \"Nkalla\",\n" +
"\t\"emailAddress\" : \"didier@yahoo.fr\",\n" +
"\t\"primaryTelephone\" : \"669262656\",\n" +
"\t\"secondaryTelephone\" : \"669262656\",\n" +
"\t\"primaryCountryCode\" : \"CM\",\n" +
"\t\"primaryDialingCountryCode\" : \"00237\",\n" +
"\t\"secondaryCountryCode\" : \"CM\",\n" +
"\t\"secondaryDialingCountryCode\" : \"00237\",\n" +
"\t\"addressStreetAddress\" : \"Rond point laureat\",\n" +
"\t\"addressCity\" : \"Douala\",\n" +
"\t\"addressStateProvince\" : \"Littoral\",\n" +
"\t\"addressPostalCode\" : \"80209\",\t\n" +
"\t\"addressCountryCode\" : \"CM\"\n" +
 */
