

import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth/AuthService";
import {appStore} from "../store/AppStore";
import {BASE_API_URL} from "../Constante";
import {Cookie} from "ng2-cookies";
import {parse} from "libphonenumber-js";

@Component({
  selector: 'signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})

export class SignupComponent {

  message:string;
  success: boolean;
  loading: boolean;
  failiure: boolean;
  rForm: FormGroup;
  registrationinvitationid: string;
  tenantId: string;
  username:string;
  addressStreetAddress: string;


  mysetting: any = {
    showCurrentLocation: false,
    showSearchButton: false,
    //currentLocIconUrl: 'https://cdn4.iconfinder.com/data/icons/proglyphs-traveling/512/Current_Location-512.png',
  };
  private addressCountryCode: any;
  private addressStateProvince: any;

  constructor(private fb: FormBuilder,private httpClient:HttpClient, private route:Router, private r:ActivatedRoute,
              private authService: AuthService) {
    this.rForm = fb.group({
      'username' : [null, Validators.required],
      'password' : [null, Validators.required],
      'passwordrep' : [null, Validators.required],
      'firstName' : [null],
      'lastName' : [null],
      'primaryTelephone' : [null],
      //'primaryCountryCode' : [null],
      //'primaryDialingCountryCode' : [null],
      'secondaryTelephone' : [null],
      //'secondaryCountryCode' : [null],
      //'secondaryDialingCountryCode' : [null],
      //'addressStreetAddress' : [null],
      'addressCity' : [null],
      //'addressStateProvince' : [null],
      'addressPostalCode' : [null],
      'addressCountryCode' : [null]
    });

    r.params.subscribe(params=>{
      console.log(params);
      this.registrationinvitationid = params['registrationinvitationid'];
      console.log("registrationinvitationid: " + this.registrationinvitationid);
      this.tenantId = params['tenantId'];
      console.log("tenantId: " + this.tenantId);

    });

    this.message = '';
    this.success = false;
    this.loading = false;
    this.failiure = false;
  }



  addressAutoCompleteCallback(selectedData:any) {
    //do any necessery stuff.
    console.log("addressAutoCompleteCallback: " + JSON.stringify(selectedData));
    if (selectedData['response'] === true){
      //this.inputError = true;
      this.message = 'Valide Addresse';
      let data: any = selectedData['data'];
      this.addressStreetAddress = data['name'];

      for (let i=0; i<data['address_components'].length; i++){
        let country: any = data['address_components'][i];
        if(country['types'][0] === 'country' && country['types'][1] === 'political'){
          this.addressCountryCode = country['short_name'];
          console.log("addressCountryCode: " + this.addressCountryCode);
          //break;
        }

        if(country['types'][0] === 'administrative_area_level_1' && country['types'][1] === 'political'){
          this.addressStateProvince = country['short_name'];
          console.log("addressStateProvince: " + this.addressStateProvince);
          this.rForm['addressStateProvince'] = this.addressStateProvince;
          //break;
        }
      }

    }else {
      //this.inputError = true;
      this.message = 'Invalide Addresse';
    }
  }


  registerUser(form){
    /*form.primaryTelephone = "669262656";

    form.primaryCountryCode = "CM";

    form.primaryDialingCountryCode = "00237";

    form.secondaryTelephone = "691179154";

    form.secondaryCountryCode = "CM";

    form.secondaryDialingCountryCode = "00237";

    form.addressPostalCode = "80209";

    form.addressCountryCode = "CM";*/

    //console.log(JSON.stringify(form));

   /* let today:Date = new Date(2015, 1, 15, 23, 59, 59, 0);

    let tomorow: Date = new Date(2020, 1, 29, 23, 59, 59, 0);

    if (today.getTime() >= tomorow.getTime()){
      this.message = 'Date are bad';
      return ;
    }

    let sign = today.getTimezoneOffset() >= 0 ? '+':'';

    let trailingZeroToday = (today.getMonth())<10? "0":"";
    let trailingZerotomorow = (tomorow.getMonth())<10? "0":"";

    let trailingZeroToday1 = (today.getDate())<10? "0":"";
    let trailingZerotomorow1 = (tomorow.getDate())<10? "0":"";

    let trailingZeroTodayH = (today.getHours())<10? "0":"";
    let trailingZerotomorowH = (tomorow.getHours())<10? "0":"";

    let trailingZeroTodayM = (today.getMinutes())<10? "0":"";
    let trailingZerotomorowM = (tomorow.getMinutes())<10? "0":"";

    let trailingZeroTodayS = (today.getSeconds())<10? "0":"";
    let trailingZerotomorowS = (tomorow.getSeconds())<10? "0":"";

    let regInv = JSON.parse(localStorage.getItem('registrationinvitation'));*/

    let lookupPrimaryPhoneNumber = parse(form['primaryTelephone']);
    let simplephonenum1 = lookupPrimaryPhoneNumber['phone'];
    let index1 =  form.primaryTelephone.indexOf(simplephonenum1);

    let lookupSecondaryPhoneNumber = parse(form['secondaryTelephone']);
    let simplephonenum2 = lookupSecondaryPhoneNumber['phone'];
    let index2 =  form.secondaryTelephone.indexOf(simplephonenum2);

    console.log("lookupPrimaryPhoneNumber: " + JSON.stringify(lookupPrimaryPhoneNumber));
    console.log("lookupSecondaryPhoneNumber: " + JSON.stringify(lookupSecondaryPhoneNumber));

    console.log("\n\nform: " + JSON.stringify(form));

    let body = {
      tenantId:this.tenantId,
      invitationIdentifier: this.registrationinvitationid,//regInv['invitationId'],
      username:form.username,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      //enabled: true,
      /*startDate: "2017" + '-' + "01" + '-' + trailingZeroToday1 +  today.getDate().toLocaleString() + 'T' + trailingZeroTodayH +today.getHours() + ':' + trailingZeroTodayM+ today.getMinutes() + ':' +
      trailingZeroTodayS+today.getSeconds() + '.' + today.getMilliseconds() +  '+01:00[Africa/Douala]',
      endDate:tomorow.getFullYear() + '-' + trailingZerotomorow  + (tomorow.getMonth() + 1) + '-' + trailingZerotomorow1 + tomorow.getDate().toLocaleString() + 'T' + trailingZerotomorowH + tomorow.getHours() + ':' + trailingZerotomorowM + tomorow.getMinutes() + ':' +
      trailingZerotomorowS + tomorow.getSeconds()+ '.' + tomorow.getMilliseconds() +  '+01:00[Africa/Douala]',*/
      emailAddress: form.username,
      primaryTelephone: form.primaryTelephone,
      secondaryTelephone: form.secondaryTelephone,
      primaryCountryCode: lookupPrimaryPhoneNumber['country'],
      primaryDialingCountryCode: form.primaryTelephone.substring(0, index1),
      secondaryCountryCode: lookupSecondaryPhoneNumber['country'],
      secondaryDialingCountryCode: form.secondaryTelephone.substring(0, index2),
      addressStreetAddress: this.addressStreetAddress,
      addressCity: form.addressCity,
      addressStateProvince: this.addressStateProvince,
      addressPostalCode: form.addressPostalCode,
      addressCountryCode: this.addressCountryCode
    };

    console.log("BODYYYYYYYYYYYYYYYYY: " + JSON.stringify(body));
    let url : string = BASE_API_URL + encodeURIComponent(this.tenantId) +
      "/users/" + encodeURIComponent(form.username) + "/registrations";
    console.log("url ==== " + url);

    this.success = false;
    this.loading = true;
    this.failiure = false;

    this.httpClient.post(url , body, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
    }).subscribe((data)=>{

      console.log("Response data: " + JSON.stringify(data));
      this.success = true;
      this.message = 'Signed up successfully...';
      this.failiure = false;
      this.route.navigate(['/auth', this.tenantId]);

      //this.message = 'Success: ' + JSON.stringify(data);
      //localStorage.setItem("registrationinvitation", JSON.stringify(data));
      /*let status = {"isActive":data['active']};
      //new User(data['tenantId'], data['username'], data['emailAddress']);
      //availability-status  CHANGE_TENANT_AVAILABILITY_STATUS
      let myNewTenant : Tenant = Object.assign({}, this.tenant, status);

      let monAction:MyAction = appActionCreator(CHANGE_TENANT_AVAILABILITY_STATUS, myNewTenant);

      console.log("tenant changed ----------- Tenant---------------> ", JSON.stringify(monAction));
      appStore.dispatch(monAction);

      //this.router.navigate(['/autorized']);*/
    },(data) => {
      console.log("Errorrrrrrr", JSON.stringify(data));
      this.success = false;
      this.failiure = true;
      this.message = 'Failed to signe up'; //+ JSON.stringify(data);
      this.loading = false;
    },()=>{
      this.loading = false;
    });

  }


}

//console.log("DIDIERRRRRRRRRRRRRRR");
