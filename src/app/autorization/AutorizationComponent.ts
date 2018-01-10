

import {Component} from "@angular/core";
import {ActivatedRoute, Router, RouterLink, Routes} from "@angular/router";
import {childRoutes} from "../rooute/Config";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BASE_API_URL} from "../Constante";
import {appStore} from "../store/AppStore";
import {AuthService} from "../auth/AuthService";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbDatepickerConfig} from "@ng-bootstrap/ng-bootstrap";
//import {INgxMyDpOptions} from "ngx-mydatepicker";

@Component({
  selector: 'autorization',
  templateUrl: './autorization.html',
  styleUrls: ['./autorization.css']
})

export class AutorizationComponent{
  title: string = "AutorizationComponent";
  rFormRegistrationInvitation: FormGroup;
  description: string;
  email: string;
  startingOn: string;
  until: string;
  errorMessage: string;
  successMessage: string;

  modelUntil: any;
  modelStartingOn: any;

  /*myOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
  };
  model: any = {date: {year: 2018, month: 10, day: 9}};*/

  //routerLins: Routes = childRoutes;
  constructor(private fb: FormBuilder,private httpClient:HttpClient, private route:Router, private r:ActivatedRoute,
              private authService: AuthService, config: NgbDatepickerConfig){

    this.rFormRegistrationInvitation = fb.group({
      //'tenantId' : [null, Validators.required],
      'description' : [null, Validators.required],
      'email' : [null, Validators.required],
      'startingOn' : [null, Validators.required],
      'until' : [null, Validators.required],
      //'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      //'validate' : ''
    });

    this.errorMessage = '';
    this.successMessage = '';

  }

  createRegistrationInvitation(form){

    this.description = form.description;
    this.email = form.email;
    this.startingOn = form.startingOn;
    this.until = form.until;

    if(this.description === '' ||!this.authService.validateEmailAddress(this.email)){
      this.errorMessage = 'Tous les les champ sont obligatoire et l\'E-Mail doit respecter le format: xxxxx@yyyyy.aaa';
    return ;
  }




      console.log(JSON.stringify(this.modelStartingOn));
      console.log(JSON.stringify(this.modelUntil));
      //return;

      /*
      {"year":2018,"month":1,"day":19}
AutorizationComponent.ts:68 {"year":2020,"month":1,"day":26}
       */
      //"2007-12-03T10:15:30+01:00[Europe/Paris]"
      //2018-01-02T12:48:48.579+01:00[Africa/Douala]
      //console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP" + appStore.getState().tokenState.token.accessToken);

      let today:Date = new Date(this.startingOn['year'], this.startingOn['month'], this.startingOn['day'], 23, 59, 59, 0);

      let tomorow: Date = new Date(this.until['year'], this.until['month'], this.until['day'], 23, 59, 59, 0);

      if (today.getTime() >= tomorow.getTime()){
        this.errorMessage = 'Date are bad';
        return ;
      }

      let sign = today.getTimezoneOffset() >= 0 ? '+':'';

      let trailingZeroToday = (today.getMonth() + 1)<10? "0":"";
      let trailingZerotomorow = (tomorow.getMonth() + 1)<10? "0":"";

      let trailingZeroToday1 = (today.getDate())<10? "0":"";
      let trailingZerotomorow1 = (tomorow.getDate())<10? "0":"";

      let trailingZeroTodayH = (today.getHours())<10? "0":"";
      let trailingZerotomorowH = (tomorow.getHours())<10? "0":"";

      let trailingZeroTodayM = (today.getMinutes())<10? "0":"";
      let trailingZerotomorowM = (tomorow.getMinutes())<10? "0":"";

      let trailingZeroTodayS = (today.getSeconds())<10? "0":"";
      let trailingZerotomorowS = (tomorow.getSeconds())<10? "0":"";

      let body = {
        description:this.description,
        startingOn: today.getFullYear() + '-' + trailingZeroToday + (today.getMonth() + 1) + '-' + trailingZeroToday1 +  today.getDate().toLocaleString() + 'T' + trailingZeroTodayH +today.getHours() + ':' + trailingZeroTodayM+ today.getMinutes() + ':' +
        trailingZeroTodayS+today.getSeconds() + '.' + today.getMilliseconds() +  '+01:00[Africa/Douala]',
        until:tomorow.getFullYear() + '-' + trailingZerotomorow  + (tomorow.getMonth() + 1) + '-' + trailingZerotomorow1 + tomorow.getDate().toLocaleString() + 'T' + trailingZerotomorowH + tomorow.getHours() + ':' + trailingZerotomorowM + tomorow.getMinutes() + ':' +
        trailingZerotomorowS + tomorow.getSeconds()+ '.' + tomorow.getMilliseconds() +  '+01:00[Africa/Douala]'
      };

      console.log("BODYYYYYYYYYYYYYYYYY: " + JSON.stringify(body));

      this.httpClient.post(BASE_API_URL + encodeURIComponent(appStore.getState().tenantState.tenant.getTenantId()) +
        "/registration-invitations" , body, {
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }).subscribe((data)=>{

        console.log("Response data: " + JSON.stringify(data));
        this.successMessage = 'Success: ' + JSON.stringify(data);
        /*let status = {"isActive":data['active']};
        //new User(data['tenantId'], data['username'], data['emailAddress']);
        //availability-status  CHANGE_TENANT_AVAILABILITY_STATUS
        let myNewTenant : Tenant = Object.assign({}, this.tenant, status);

        let monAction:MyAction = appActionCreator(CHANGE_TENANT_AVAILABILITY_STATUS, myNewTenant);

        console.log("tenant changed ----------- Tenant---------------> ", JSON.stringify(monAction));
        appStore.dispatch(monAction);

        //this.router.navigate(['/autorized']);*/
      });


  }

  gotoTenants(){
    this.route.navigate(["../autorized/tenants"], { relativeTo: this.r });
  }

  gotoNewTenant(){
    this.route.navigate(["../autorized/newtenant"], { relativeTo: this.r });
  }
}
