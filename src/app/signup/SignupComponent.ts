

import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth/AuthService";
import {appStore} from "../store/AppStore";
import {BASE_API_URL} from "../Constante";
import {Cookie} from "ng2-cookies";

@Component({
  selector: 'signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})

export class SignupComponent {

  message:string;
  rForm: FormGroup;
  registrationinvitationid: string;
  tenantId: string;
  username:string;

  constructor(private fb: FormBuilder,private httpClient:HttpClient, private route:Router, private r:ActivatedRoute,
              private authService: AuthService) {
    this.rForm = fb.group({
      'username' : [null, Validators.required],
      'password' : [null, Validators.required],
      'passwordrep' : [null, Validators.required],
      'firstName' : [null],
      'lastName' : [null],
      'primaryTelephone' : [null],
      'primaryCountryCode' : [null],
      'primaryDialingCountryCode' : [null],
      'secondaryTelephone' : [null],
      'secondaryCountryCode' : [null],
      'secondaryDialingCountryCode' : [null],
      'addressStreetAddress' : [null],
      'addressCity' : [null],
      'addressStateProvince' : [null],
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

  }


  registerUser(form){
    form.primaryTelephone = "669262656";

    form.primaryCountryCode = "CM";

    form.primaryDialingCountryCode = "00237";

    form.secondaryTelephone = "691179154";

    form.secondaryCountryCode = "CM";

    form.secondaryDialingCountryCode = "00237";

    form.addressPostalCode = "80209";

    form.addressCountryCode = "CM";

    console.log(JSON.stringify(form));

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
      primaryCountryCode: form.primaryCountryCode,
      primaryDialingCountryCode: form.primaryDialingCountryCode,
      secondaryCountryCode: form.secondaryCountryCode,
      secondaryDialingCountryCode: form.secondaryDialingCountryCode,
      addressStreetAddress: form.addressStreetAddress,
      addressCity: form.addressCity,
      addressStateProvince: form.addressStateProvince,
      addressPostalCode: form.addressPostalCode,
      addressCountryCode: form.addressCountryCode
    };

    console.log("BODYYYYYYYYYYYYYYYYY: " + JSON.stringify(body));
    let url : string = BASE_API_URL + encodeURIComponent(this.tenantId) +
      "/users/" + encodeURIComponent(form.username) + "/registrations";
    console.log("url ==== " + url);

    this.httpClient.post(url , body, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
    }).subscribe((data)=>{

      console.log("Response data: " + JSON.stringify(data));
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
      console.log("Errorrrrrrr", data);
    });

  }


}
