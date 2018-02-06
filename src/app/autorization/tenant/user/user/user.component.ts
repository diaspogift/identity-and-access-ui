import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {User} from "../../../../domain/model/User";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {BASE_API_URL} from "../../../../Constante";
import {appStore} from "../../../../store/AppStore";
import {LOAD_USERS} from "../../../../actions/UserAction";
import {appActionCreator} from "../../../../actions/Action";
import {MyAction} from "../../../../common/MyAction";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../auth/AuthService";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Tenant} from "../../../../domain/model/Tenant";


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit , AfterViewInit{

  tenant: any;
  tenantUrl: string;

  public alerts: Array<IAlert> = [];

  canInvitePeople:boolean;
  users:User[];

  url: string;

  rFormRegistrationInvitation: FormGroup;
  description: string;
  email: string;
  startingOn: string;
  until: string;
  errorMessage: string;
  successMessage: string;

  modelUntil: any;
  modelStartingOn: any;

  modalReference: any;

  message: string;
  loading: boolean;

  failiure: boolean;

  success: boolean;

  @ViewChild("registrationInvitationmModal", {read: ElementRef}) registrationInvitationmModal: ElementRef;

  ngAfterViewInit(): void {
    // outputs `I am span`
    //console.log("registrationInvitationmModal: " + this.registrationInvitationmModal.nativeElement.textContent);

    //console.log("registrationInvitationmModal: " + $('#registrationInvitationmModal').html());
    //$('#registrationInvitationmModal').
    //$(this.registrationInvitationmModal.nativeElement).modal('show');
   // $('#registrationInvitationmModal').modal('show');


  }


  constructor(private modalService: NgbModal, private fb: FormBuilder, private httpClient: HttpClient, private route: Router, private r:ActivatedRoute, private authService: AuthService) {
    r.params.subscribe(params=>{

      console.log("appStore.getState().tenantState.tenant.getTenantId(): user === " + JSON.stringify(appStore.getState().tenantState.tenant));

      console.log("\n\n\nstate state state: " + JSON.stringify(appStore.getState()) + "\n\n\n");

      this.url = params['id']?params['id']:BASE_API_URL + appStore.getState().tenantState.tenant.getTenantId() +"/users";

      this.tenantUrl = BASE_API_URL + this.authService.extractTenantFromUrl(this.url);

      console.log("url url url: " + this.url);
    });

    this.rFormRegistrationInvitation = fb.group({
      //'tenantId' : [null, Validators.required],
      'description' : [null, Validators.required],
      'email' : [null, Validators.required],
      'startingOn' : [null, Validators.required],
      'until' : [null, Validators.required],
      //'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      //'validate' : ''
    });

    this.message = '';
    this.loading = false;
    this.failiure = false;
    this.success = false;
    this.tenant = {name:''};

    //this.alerts.push(null);


  }

  refresh(event){
    this.url = event;
    this.ngOnInit();
  }

  ngOnInit() {

    this.httpClient.get(this.url, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("Users  Users Users Users: " + JSON.stringify(data));
      let receivedData = data['users'];
      let index: number;
      this.users = [];
      console.log("LENGTH LENGTH LENGTH: " + receivedData.length);
      for (index=0; index < receivedData.length; index++){
        let links: any = receivedData[index]['_links'];
        console.log("\n\n\nreceivedData[index]['enabled']: " + receivedData[index]['enabled'] + "\n\n\n");
        let aUser: User = new User(receivedData[index]['tenantId'], receivedData[index]['username'],
          receivedData[index]['emailAddress'], receivedData[index]['enabled'], links, null,
          receivedData[index]['firstName'], receivedData[index]['lastName']); // links a revoir
        console.log(index + " - adding: " + JSON.stringify(aUser));
        this.users.push(aUser);
      }

      console.log("Users Users Users Users: " + JSON.stringify(this.users));

      if (this.users.length > 0){
        let monAction:MyAction = appActionCreator(LOAD_USERS, {'tenantid':this.users[0].getTenantId(), 'users':this.users});
        appStore.dispatch(monAction);
      }


      this.httpClient.get(this.tenantUrl, {
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }).subscribe((donnees)=>{

        this.tenant = donnees;
        /*
        {
  "tenantId": "DECAC906-0EBE-48A7-8D0A-8674A6FFDDBB",
  "name": "DASPOGIFT",
  "description": "DIASPORA GIFT",
  "active": true
}
         */

      });

    });
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

    let body = {
      description:this.description,
      startingOn: "2017" + '-' + trailingZeroToday + (today.getMonth()) + '-' + trailingZeroToday1 +  today.getDate().toLocaleString() + 'T' + trailingZeroTodayH +today.getHours() + ':' + trailingZeroTodayM+ today.getMinutes() + ':' +
      trailingZeroTodayS+today.getSeconds() + '.' + today.getMilliseconds() +  '+01:00[Africa/Douala]',
      until:tomorow.getFullYear() + '-' + trailingZerotomorow  + (tomorow.getMonth()) + '-' + trailingZerotomorow1 + tomorow.getDate().toLocaleString() + 'T' + trailingZerotomorowH + tomorow.getHours() + ':' + trailingZerotomorowM + tomorow.getMinutes() + ':' +
      trailingZerotomorowS + tomorow.getSeconds()+ '.' + tomorow.getMilliseconds() +  '+01:00[Africa/Douala]',
      email:form.email
    };

    console.log("BODYYYYYYYYYYYYYYYYY: " + JSON.stringify(body));

    this.loading = true;

    //this.url

    let tenantId = this.authService.extractTenantFromUrl(this.url);

    console.log("tenant: " + tenantId);

    this.alerts.push(null);

    this.httpClient.post(BASE_API_URL + encodeURIComponent(appStore.getState().tenantState.tenant.getTenantId()) +
      "/registration-invitations" , body, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      this.loading = false;
      this.success = true;
      this.failiure = false;
      console.log("Response data: " + JSON.stringify(data));
      this.message = 'Success: The registration invitation identify by ' + data['invitationId'] + ' and describe by "'
        + data['description']+ '  |  Validity: From: ' + data['startingOn'] + '    To : ' + data['until'] + '  was sent to: ' + form.email;
      localStorage.setItem("registrationinvitation", JSON.stringify(data));

      this.alerts[0] = {
        id: 1,
        type: 'success',
        message: this.message
      };

      setTimeout(()=>{
        this.abandonne();
      }, 3000);




      //console.log("registrationInvitationmModal: " + $('#registrationInvitationmModal').html());
      //$('#registrationInvitationmModal').hide();

      //this.registrationInvitationmModal.nativeElement.modal("hide");

      //jQuery('#confirmModal').modal('hide');

      /*let status = {"isActive":data['active']};
      //new User(data['tenantId'], data['username'], data['emailAddress']);
      //availability-status  CHANGE_TENANT_AVAILABILITY_STATUS
      let myNewTenant : Tenant = Object.assign({}, this.tenant, status);

      let monAction:MyAction = appActionCreator(CHANGE_TENANT_AVAILABILITY_STATUS, myNewTenant);

      console.log("tenant changed ----------- Tenant---------------> ", JSON.stringify(monAction));
      appStore.dispatch(monAction);

      //this.router.navigate(['/autorized']);*/
    }, (data) => {
      this.message = "An error occured: " + data;
      this.failiure = true;
    },()=>{
      this.loading = false;
    });


  }

  abandonne() {
    this.modalReference.close();
  }

  openInvitePeople(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      console.log("Opening modal...");
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  canInvite():boolean{
    let thisTenant = this.authService.extractTenantFromUrl(this.url);
    let connectedTenant = appStore.getState().tenantState.tenant.getTenantId();
    return thisTenant === connectedTenant;
  }

  public closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
}

export interface IAlert {
  id: number;
  type: string;
  message: string;
}
