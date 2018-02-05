import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {User} from "../../../../../domain/model/User";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {BASE_API_URL} from "../../../../../Constante";
import {appStore} from "../../../../../store/AppStore";
import {MyAction} from "../../../../../common/MyAction";
import {appActionCreator} from "../../../../../actions/Action";
import {CHANGE_USER_ENABLED, LOAD_USERS} from "../../../../../actions/UserAction";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbCalendar, NgbDateStruct, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.css']
})
export class UserListItemComponent implements OnInit {

  //@ViewChild('inputEnabled') inputEnabled:ElementRef;
  //@ViewChild('inputDiabled') inputDiabled:ElementRef;

  @Output('refreshListUser') refreshListUser: EventEmitter<string>;

  @Input('user') user: User;
  @Input('usersLink') usersLink: string;
  hasChanged: boolean;
  userDetails: any;
  completeUser: any;
  roles: Array<any>;
  groups: Array<any>;

  rFormEnablement: FormGroup;
  from: string;
  to: string;

  modelTo: any;
  modelFrom: any;

  loading: boolean;

  failiure: boolean;

  success: boolean;

  message: string;

  modalReference: any;
  disable:boolean;
  enable: boolean;
  initialUserEnablement: boolean;
  ngbDatepickerToEnable: boolean;
  toDateNgbDateStruct: NgbDateStruct;

  //desableObservable: Observable<> =  Rx.Observable.fromEvent("#", 'click');

  constructor(private modalService: NgbModal, private fb: FormBuilder, private router: Router,
              private httpClient: HttpClient, private r:ActivatedRoute, private calendar: NgbCalendar) {

    this.hasChanged = false;
    this.rFormEnablement = fb.group({
      'from' : [null, Validators.required],
      'to' : [null, Validators.required],
      //'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      //'validate' : ''
    });

    this.loading = false;
    this.success = false;
    this.failiure = false;
    this.message = '';

    this.userDetails = {};

    this.userDetails['emailAddress'] = '';
    this.userDetails['primaryCountryDialingCode'] = '';
    this.userDetails['primaryNumber'] = '';
    this.userDetails['secondaryCountryDialingCode'] = '';
    this.userDetails['secondaryNumber'] = '';
    this.userDetails['streetAddress'] = '';
    this.userDetails['city'] = '';
    this.userDetails['stateProvince'] = '';
    this.userDetails['postalCode'] = '';
    this.userDetails['countryCode'] = '';

    this.roles = [];
    this.groups = [];

    this.refreshListUser = new EventEmitter<string>();
    this.ngbDatepickerToEnable = true;



  }

  ngOnInit() {

    console.log("\n\ninputed user: " + JSON.stringify(this.user));

    let lien: string = BASE_API_URL + this.user.getTenantId() + '/users/' +  encodeURIComponent(this.user.getUsername());

    this.httpClient.get(lien, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("Complete Users : " + JSON.stringify(data));
      this.completeUser = data;
    },(error)=>{
      console.log("ERROORRR: " + JSON.stringify(error));
    });

    this.initialUserEnablement = this.user.getEnabled();

  }

  saveChanges(){
    if(this.hasChanged){
      console.log("Change Occure");

      /*
      private boolean enabled;
    private String startDate;
    private String endDate;
       */

      let time: number = new Date().getTime();
      let yesterday: Date = new Date(time - 24000*3600);
      let options = { timeZone: 'UTC', timeZoneName: 'short' };
      const body = {enabled: this.user.getEnabled(), startDate: new Date().toLocaleString('en-US', options),
        endDate: yesterday.toLocaleString('en-US', options)};
      console.log("\n\n" + JSON.stringify(body) + " \n\n");
      this.httpClient.post(BASE_API_URL + encodeURIComponent(this.user.getTenantId()) +
        "/users/" + encodeURIComponent(this.user.getUsername()) + "/enablement", body , {
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }).subscribe((data)=>{

        console.log("Response data: " + JSON.stringify(data));
        let enablement = {"enabled": data['enabled'], startDate: data['startDate'], endDate: data['endDate']};
        //new User(data['tenantId'], data['username'], data['emailAddress']);
        //availability-status  CHANGE_TENANT_AVAILABILITY_STATUS
        let newUser : User = Object.assign({}, this.user, enablement);

        let monAction:MyAction = appActionCreator(CHANGE_USER_ENABLED, newUser);

        console.log("Users changed ----------- User---------------> ", JSON.stringify(monAction));
        appStore.dispatch(monAction);

        //this.router.navigate(['/autorized']);
      });
      //availability-status
    }
  }


  changeEnablement(form){

    //if (this.enable && !this.disable){
      this.user.setEnabled(this.enable);
    //}else if(!this.enable && this.disable){
    //  this.user.setEnabled(this.de)
    //}

    console.log("USER before changing enablement: " + JSON.stringify(this.user));

    this.loading = true;
    this.failiure = false;
    //console.log("Change Occure");
    this.from = form.from;
    this.to = form.to;



    let today:Date = this.user.getEnabled()?
      new Date(this.from['year'], this.from['month'], this.from['day'], 23, 59, 59, 0):
      new Date(1, 1, 1, 23, 59, 59, 0);

    let tomorow: Date = this.user.getEnabled()?
      new Date(this.to['year'], this.to['month'], this.to['day'], 23, 59, 59, 0):
      new Date(2030, 1, 1, 23, 59, 59, 0);

    if(today.getTime() < tomorow.getTime()) {
     //if (today.getTime() > tomorow.getTime()){
        //this.errorMessage = 'Date are bad';
       // return ;
      //}

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
        enabled: this.user.getEnabled(),
        startDate: "" + today.getFullYear() + '-' + trailingZeroToday + (today.getMonth()) + '-' + trailingZeroToday1 +  today.getDate().toLocaleString() + 'T' + trailingZeroTodayH +today.getHours() + ':' + trailingZeroTodayM+ today.getMinutes() + ':' +
        trailingZeroTodayS+today.getSeconds() + '.' + today.getMilliseconds() +  '+01:00[Africa/Douala]',
        endDate: "" + tomorow.getFullYear() + '-' + trailingZerotomorow  + (tomorow.getMonth()) + '-' + trailingZerotomorow1 + tomorow.getDate().toLocaleString() + 'T' + trailingZerotomorowH + tomorow.getHours() + ':' + trailingZerotomorowM + tomorow.getMinutes() + ':' +
        trailingZerotomorowS + tomorow.getSeconds()+ '.' + tomorow.getMilliseconds() +  '+01:00[Africa/Douala]'
      };

      console.log("BODYYYYYYYYYYYYYYYYY: " + JSON.stringify(body));

      this.message = '';
      this.success = false;
      this.failiure = false;
      this.loading = true;

      this.httpClient.post(BASE_API_URL + encodeURIComponent(this.user.getTenantId()) +
        "/users/" + encodeURIComponent(this.user.getUsername()) + "/enablement", body , {
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }).subscribe((data)=>{

        console.log("Response data: " + JSON.stringify(data));
        let enablement = {"enabled": data['enabled'], startDate: data['startDate'], endDate: data['endDate']};
        //new User(data['tenantId'], data['username'], data['emailAddress']);
        //availability-status  CHANGE_TENANT_AVAILABILITY_STATUS
        this.user.setEnabled(data['enabled']);
       // let newUser : User = Object.assign({}, this.user, enablement);

        let monAction:MyAction = appActionCreator(CHANGE_USER_ENABLED, this.user);

        console.log("Users changed ----------- User---------------> ", JSON.stringify(monAction));
        appStore.dispatch(monAction);

        this.loading = false;
        this.hasChanged = false;
        this.success = true;
        this.failiure = false;
        this.message = data['enabled']?'Successfull enabled':'Successfull disabled';

        //this.openModal(detailsContent);
        setTimeout(()=>{
          this.modalReference.close();
        }, 3000);


        //this.router.navigate(['/autorized']);
      }, (data) => {
        this.failiure = true;
        this.success = false;
        this.message = 'Failed';
        //this.errorMessage = "An error occured: " + data;
      }, ()=>{
        this.loading = false;
        this.refreshListUser.emit(this.usersLink);
      });


    }else{
      this.failiure = true;
      this.loading = false;
      this.success = false;
      this.message = "Invalide date range";
    }


  }

  toggleEnablement(){
    this.user.setEnabled(!this.user.getEnabled());
    this.hasChanged = !this.hasChanged;

    //console.log("toggling...........................");
  }

  transform(data:string):string{
    return data.replace(/@|\./g,'');
  }

  getDetails(detailsContent: any) {

    if (!this.user.getEnabled()){
      this.success = false;
      this.failiure = true;
      this.message = 'Disabled user... Data are not accessible';
      this.loading = false;
      this.openModal(detailsContent);
      return;
    }
    this.loading = true;
    this.success = false;
    this.failiure = false;
    this.message = '';

    let lien: string = BASE_API_URL + this.user.getTenantId() + '/users/' + encodeURIComponent(this.user.getUsername()) + '/contact';
    this.httpClient.get(lien, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{

      console.log("Users  details: " + JSON.stringify(data));
      this.userDetails = data;


      let lien1: string = BASE_API_URL + this.user.getTenantId() + '/users/' + this.user.getUsername();
      this.httpClient.get(lien1 + "/roles", {
        headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
          .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
      }).subscribe((returneddata)=>{

        console.log("roles roles roles roles: " + JSON.stringify(returneddata));
        this.roles = returneddata['roles'];


        let lien2: string = BASE_API_URL + this.user.getTenantId() + '/users/' + this.user.getUsername();
        this.httpClient.get(this.user.getLinks()['groups']['href'], {
          headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
            .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
        }).subscribe((groups)=>{

          this.loading = false;
          console.log("groups groups groups groups: " + JSON.stringify(groups));
          this.groups = groups['groups'];
          this.openModal(detailsContent);

        },(error)=>{
          this.success = false;
          this.failiure = true;
          this.message = 'Failed: ' + JSON.stringify(error);
        }, ()=>{
          this.loading = false;
          if (this.failiure){
            this.openModal(detailsContent);
          }
        });


      },(error)=>{
        this.success = false;
        this.failiure = true;
        this.message = 'Failed: ' + JSON.stringify(error);
      }, ()=>{
        this.loading = false;
        if (this.failiure){
          this.openModal(detailsContent);
        }
      });


    },(error)=>{
      this.success = false;
      this.failiure = true;
      this.message = 'Failed: ' + JSON.stringify(error);
    }, ()=>{
      this.loading = false;
      if (this.failiure){
        this.openModal(detailsContent);
      }

    });
  }

  openModal(editContent){
    this.modalReference = this.modalService.open(editContent);
    this.modalReference.result.then((result) => {
      console.log("Opening modal...");
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  abandonne() {
    if (!(this.initialUserEnablement === this.user.getEnabled())){
      this.toggleEnablement();
    }
    this.modalReference.close();
  }



  openDetailsModal(detailsContent) {
    this.getDetails(detailsContent);
  }

  fromDateSeleted(event) {
    this.ngbDatepickerToEnable=false;
    //let selectedFromDate = new Date(this.from['year'], this.from['month'], this.from['day'], 23, 59, 59, 0);
    this.toDateNgbDateStruct = {
      year:event['year'],
      month: event['month'],
      day:event['day'] + 1
    };

    console.log("ngbDatepickerToEnable: " + this.ngbDatepickerToEnable +
      "\n\n" + "this.toDateNgbDateStruct: " + JSON.stringify(this.toDateNgbDateStruct));

  }

  passtoEnablement() {
    this.enable=true;
    this.disable=false;
    this.user.setEnabled(this.enable);
    let date = new Date((new Date()).getTime() - 24*60*60*1000);
    this.modelFrom={
      year:date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }
}


/*
in userWithUsername repo: aTenantId, aUsername = TenantId [id=18E0A461-9DA3-4DCE-9B14-EC951DC8F596] , admin


 in userWithUsername repo: aTenantId, aUsername = TenantId [id=18E0A461-9DA3-4DCE-9B14-EC951DC8F596] , admin
2018-01-17 17:08:01.613 DEBUG 12675 --- [nio-8081-exec-1] o.s.s.a.dao.DaoAuthenticationProvider    : User account is locked
2018-01-17 17:08:01.614  INFO 12675 --- [nio-8081-exec-1] o.s.s.o.provider.endpoint.TokenEndpoint  : Handling error: InvalidGrantException, User account is locked
2018-01-17 17:08:01.614  WARN 12675 --- [nio-8081-exec-1] .m.m.a.ExceptionHandlerExceptionResolver : Resolved exception caused by Handler execution: error="invalid_grant", error_description="User account is locked"
2018-01-17 17:08:46.071  INFO 12675 --- [nio-8081-exec-3] Spring Security Debugger                 :


telecomadmin

admintelecom

233473300@camnet.cm

233473300camnet.cm

 */
