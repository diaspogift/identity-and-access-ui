import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {parse} from "libphonenumber-js";
import {BASE_API_URL} from "../../../../Constante";
import {appStore} from "../../../../store/AppStore";



@Component({
  selector: 'app-newtenant',
  templateUrl: './newtenant.component.html',
  styleUrls: ['./newtenant.component.css']
})
export class NewtenantComponent implements OnInit {
  message: string;
  inputError: boolean;
  primaryCountryCode: string;
  secondaryCountryCode: string;
  addressStreetAddress: string;

  tenantInfo: any;

  countrycode1: string;

  rForm: FormGroup;

  success: boolean;
  loading: boolean;
  failure: boolean;
  mysetting: any = {
    showCurrentLocation: false,
    showSearchButton: false,
  };


  constructor(private fb: FormBuilder,private httpClient: HttpClient, private route:Router, private r:ActivatedRoute) {
    this.message = '';
    this.success = false;
    this.inputError = false;
    this.failure = false;
    this.loading = false;

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
      //'primaryDialingCountryCode' : [null, Validators.required],
      'secondaryCountryCode' : [null, Validators.required],
      //'secondaryDialingCountryCode' : [null, Validators.required],
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




  addressAutoCompleteCallback(selectedData:any) {
    //do any necessery stuff.
    console.log("addressAutoCompleteCallback: " + JSON.stringify(selectedData));
    if (selectedData['response'] === true){
      this.inputError = true;
      this.message = 'Valide Addresse';
      let data: any = selectedData['data'];
      this.addressStreetAddress = data['name'];

      for (let i=0; i<data['address_components'].length; i++){
        let country: any = data['address_components'][i];
        if(country['types'][0] === 'country' && country['types'][1] === 'political'){
          this.tenantInfo.addressCountryCode = country['short_name'];
          console.log("addressCountryCode: " + this.tenantInfo.addressCountryCode);
          //break;
        }

        if(country['types'][0] === 'administrative_area_level_1' && country['types'][1] === 'political'){
          this.tenantInfo.addressStateProvince = country['short_name'];
          console.log("addressStateProvince: " + this.tenantInfo.addressStateProvince);
          this.rForm['addressStateProvince'] = this.tenantInfo.addressStateProvince;
          //break;
        }
      }

    }else {
      this.inputError = true;
      this.message = 'Invalide Addresse';
    }
  }

  ngOnInit() {
  }

  addNewTenant(post){

    //let natiTel = this.primaryTelephone.nativeElement;

    console.log("\n\n\ninput\n\n" + JSON.stringify(post) + "\n\n " +
      this.countrycode1+"\n\nprimaryTelephone: " + JSON.stringify(post['primaryTelephone']));

    console.log("PARSED: " + JSON.stringify(parse(post['primaryTelephone'])));

    let lookupPrimaryPhoneNumber = parse(post['primaryTelephone']);

    this.message = '';
    this.success = false;

    this.tenantInfo.tenantName = post.tenantName;
    this.tenantInfo.tenantDescription = post.tenantDescription;
    this.tenantInfo.administorFirstName = post.administorFirstName;
    this.tenantInfo.administorLastName = post.administorLastName;
    this.tenantInfo.emailAddress = post.emailAddress;
    this.tenantInfo.primaryTelephone = post.primaryTelephone;
    this.tenantInfo.secondaryTelephone = post.secondaryTelephone;

    this.tenantInfo.primaryCountryCode = lookupPrimaryPhoneNumber['country'];//post.primaryCountryCode;

    let simplephonenum1 = lookupPrimaryPhoneNumber['phone'];
    let index1 =  this.tenantInfo.primaryTelephone.indexOf(simplephonenum1);

    this.tenantInfo.primaryDialingCountryCode = this.tenantInfo.primaryTelephone.substring(0, index1); //post.primaryDialingCountryCode;
    let lookupSecondaryPhoneNumber = parse(post['secondaryTelephone']);

    this.tenantInfo.secondaryCountryCode = lookupSecondaryPhoneNumber['country'];//post.secondaryCountryCode;
    let simplephonenum2 = lookupSecondaryPhoneNumber['phone'];
    let index2 =  this.tenantInfo.secondaryTelephone.indexOf(simplephonenum2);

    this.tenantInfo.secondaryDialingCountryCode = this.tenantInfo.secondaryTelephone.substring(0, index2); //post.secondaryDialingCountryCode;

    this.tenantInfo.addressStreetAddress = this.addressStreetAddress;//post.addressStreetAddress;
    this.tenantInfo.addressCity = post.addressCity;
    this.tenantInfo.addressStateProvince = this.tenantInfo.addressStateProvince;//post.addressStateProvince;
    this.tenantInfo.addressPostalCode = post.addressPostalCode;
    this.tenantInfo.addressCountryCode = this.tenantInfo.addressCountryCode;//post.addressCountryCode;

    console.log("\n\n" + JSON.stringify(this.tenantInfo));



    this.message = '';
    this.loading = true;
    this.failure = false;
    this.success = false;

    this.httpClient.post(BASE_API_URL +  "provisions", this.tenantInfo , {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{



      console.log("Response data: " + JSON.stringify(data));

      if (data['tenantId'] && data['tenantName'] && data['tenantDescription']){
        this.success = true;
        this.failure = false;
        this.message = 'Successfully Created';
        this.route.navigate(["../tenants"], { relativeTo: this.r });
        //this.route.navigate(['tenants']);
      }else {
        this.success = false;
        this.failure = true;
        this.message = 'Failed: Some thing went wrong';
      }

      //let status = {"isActive":data['active']};

      //let myNewTenant : Tenant = Object.assign({}, this.tenant, status);

      //let monAction:MyAction = appActionCreator(CHANGE_TENANT_AVAILABILITY_STATUS, myNewTenant);

      //console.log("tenant changed ----------- Tenant---------------> ", JSON.stringify(monAction));
      //appStore.dispatch(monAction);

      //this.router.navigate(['/autorized']);
    },(data)=>{
      this.success = false;
      this.failure = true;
      this.message = 'Failed: ' + JSON.stringify(data);
    },()=>{
      this.loading = false;
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
