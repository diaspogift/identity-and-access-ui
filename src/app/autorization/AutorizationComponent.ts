

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";

import {appStore} from "../store/AppStore";
import {AuthService} from "../auth/AuthService";
import {Cookie} from "ng2-cookies";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {BASE_API_URL, DG_ADMINISTRATOR} from "../Constante";
import {User} from "../domain/model/User";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BsModalComponent} from "ng2-bs3-modal";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SAVE_TOKEN} from "../actions/TokenAction";
import {MyAction} from "../common/MyAction";
import {appActionCreator} from "../actions/Action";
import {LOGIN_USER} from "../actions/UserAction";
import {initialTenantState} from "../state/TenantState";
import {Tenant} from "../domain/model/Tenant";
import {initialAppsState} from "../state/AppState";


@Component({
  selector: 'autorization',
  templateUrl: './autorization.html',
  styleUrls: ['./autorization.css']
})

export class AutorizationComponent implements OnInit, AfterViewInit{

  title: string = "AutorizationComponent";
  cookies: any;

  @ViewChild("tenants", {read: ElementRef}) tenants: ElementRef;

  @ViewChild("users", {read: ElementRef}) users: ElementRef;

  @ViewChild("services", {read: ElementRef}) services: ElementRef;

  @ViewChild("groups", {read: ElementRef}) groups: ElementRef;

  @ViewChild("groupmembers", {read: ElementRef}) groupmembers: ElementRef;

  @ViewChild("roles", {read: ElementRef}) roles: ElementRef;

  modalReference: any;
  message: string;
  loading: boolean;

  failiure: boolean;

  success: boolean;



  rForm: FormGroup;

  currentpassword: string;
  newpassword: string;
  newpasswordrep: string;

  errorMessage:string;
  successMessage:string;


  /**
   * MODAL config
   */

  @ViewChild('modal')
  modal: BsModalComponent;
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

 /* navigate() {
    this.router.navigateByUrl('/hello');
  }*/

  open() {
    this.modal.open();
  }

  /************** END MODAL CONFIG ***********************************************/


  constructor(private modalService: NgbModal, private fb: FormBuilder,  private httpClient: HttpClient,private _authService: AuthService, private router: Router, private r: ActivatedRoute) {

    //console.log("ET voila 1111111" + this.modal.animation);
    this.cookies = Cookie.getAll();


    console.log("canManageTenant: " + this._authService.canManageTenant());

    //if (!this._authService.canManageTenant()) {
    //  this.router.navigate(["../autorized/users"], {relativeTo: this.r});
    //}else {

    this.rForm = fb.group({
      //'tenantId' : [null, Validators.required],
      'currentpassword': [null, Validators.required],
      'newpassword': [null, Validators.required],
      'newpasswordrep': [null, Validators.required],
      //'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      //'validate' : ''
    });


    this.errorMessage = '';
    this.successMessage = '';

    this.message = "";
    this.loading = false;

    this.failiure = false;

    this.success = false;


    if (appStore.getState().tokenState == null || appStore.getState().userState.user == null
    /*appStore.getState().tenantState.tenant == null || appStore.getState().tenantsState.tenants.length === 0*/) {
      console.log("\n\n\nmust request many thing");

      let jsonUser = Cookie.get('complete_user');
      let jsonObjectUser = JSON.parse(jsonUser);

      //let jsonUser = Cookie.get('complete_user');
      //let jsonObjectUser = JSON.parse(jsonUser);

      initialTenantState.tenant = new Tenant(jsonObjectUser['tenantId'], "", "", true, []);
      initialAppsState.tenantState = initialTenantState;

      if (this._authService.isLoggedIn()) {
        /*
            State Tenant
         */


        initialTenantState.tenant = new Tenant(jsonObjectUser['tenantId'], "", "", false, []);
        initialAppsState.tenantState = initialTenantState;

        /*
            State Token
         */

        let monAction: MyAction = appActionCreator(SAVE_TOKEN, this._authService.getCompleteToken());
        appStore.dispatch(monAction);


        /*
            Save Login user in the state
         */


        let user: User = new User(jsonObjectUser['tenantId'], jsonObjectUser['username'], jsonObjectUser['emailAddress'],
          false, null, jsonObjectUser['roles'], '', '');

        console.log("USER Cookies-----: " + JSON.stringify(user));

        let monAction1: MyAction = appActionCreator(LOGIN_USER, user);

        console.log("users ----------- user---------------> ", JSON.stringify(monAction1));
        appStore.dispatch(monAction1);

        if (!this._authService.canManageTenant()) {
          this.router.navigate(["../autorized/users"], {relativeTo: this.r});
        }else{
          this.router.navigate(["../autorized/tenants"], {relativeTo: this.r});
        }



      } else {
        this.router.navigate(["../autorized/logout"], {relativeTo: this.r});
      }

    } else {
      this.router.navigate(["../autorized/tenants"], {relativeTo: this.r});
    }
  }


  ngAfterViewInit(): void {
    this.router.events.subscribe((event) => {
      //console.log("Subscribe Subscribe Subscribe: " + event);
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd:', event.url);
        this.manageActiveLinkByUrl(event.url);
      }

    });
  }

  ngOnInit(): void {

  }

  manageActiveLink(event: any){
    //console.log("VIOLAAAAAAAAA" + event.target);
    event.preventDefault();
    //event.target.classList.remove('class1');
    let parent: HTMLUListElement = event.target.parentNode.parentNode;
    //console.log("PARENTTTTTT : " + parent);
    let cibling = parent.children;//querySelector('li');
   // console.log("cibling.length: " + cibling.length);
    for (let i = 0; i<cibling.length; i++){
      cibling[i].classList.remove('active');
      console.log((i+1) + "- removing class on: " + cibling[i]);
    }
    event.target.parentNode.classList.add('active');

    console.log("event.target.classList: " + event.target.classList);
    //parent.classList.remove('active');

  }

  gotoLogout(event: any) {
    event.preventDefault();
    this.router.navigate(["../autorized/logout"], { relativeTo: this.r });
  }
  gotoHome(event: any) {
    event.preventDefault();
    this.router.navigate(["../autorized/tenants"], { relativeTo: this.r });
  }

  manageActiveLinkByUrl(url:string){
    if (!(url.indexOf('/autorized/users') === -1)){
      let parent = this.users.nativeElement.parentNode;
      let brothers = parent.children;
      for (let i = 0; i<brothers.length; i++){
        brothers[i].classList.remove('active');
        console.log((i+1) + "- removing class on: " + brothers[i]);
      }
      this.users.nativeElement.classList.add('active');
      console.log("event.target.classList: " + this.users.nativeElement.classList);
    }
    else if (!(url.indexOf('/autorized/tenants') === -1)){
      let parent = this.tenants.nativeElement.parentNode;
      let brothers = parent.children;
      for (let i = 0; i<brothers.length; i++){
        brothers[i].classList.remove('active');
        console.log((i+1) + "- removing class on: " + brothers[i]);
      }
      this.tenants.nativeElement.classList.add('active');
      console.log("event.target.classList: " + this.tenants.nativeElement.classList);
    }

    else if (!(url.indexOf('/autorized/services') === -1)){
      let parent = this.services.nativeElement.parentNode;
      let brothers = parent.children;
      for (let i = 0; i<brothers.length; i++){
        brothers[i].classList.remove('active');
        console.log((i+1) + "- removing class on: " + brothers[i]);
      }
      this.services.nativeElement.classList.add('active');
      console.log("event.target.classList: " + this.services.nativeElement.classList);
    }

    else if (!(url.indexOf('/autorized/groups') === -1)){
      let parent = this.groups.nativeElement.parentNode;
      let brothers = parent.children;
      for (let i = 0; i<brothers.length; i++){
        brothers[i].classList.remove('active');
        console.log((i+1) + "- removing class on: " + brothers[i]);
      }
      this.groups.nativeElement.classList.add('active');
      console.log("event.target.classList: " + this.groups.nativeElement.classList);
    }

    else if (!(url.indexOf('/autorized/groupmembers') === -1)){
      let parent = this.groupmembers.nativeElement.parentNode;
      let brothers = parent.children;
      for (let i = 0; i<brothers.length; i++){
        brothers[i].classList.remove('active');
        console.log((i+1) + "- removing class on: " + brothers[i]);
      }
      this.groupmembers.nativeElement.classList.add('active');
      console.log("event.target.classList: " + this.groupmembers.nativeElement.classList);
    }
    else if (!(url.indexOf('/autorized/roles') === -1)){
      let parent = this.roles.nativeElement.parentNode;
      let brothers = parent.children;
      for (let i = 0; i<brothers.length; i++){
        brothers[i].classList.remove('active');
        console.log((i+1) + "- removing class on: " + brothers[i]);
      }
      this.roles.nativeElement.classList.add('active');
      console.log("event.target.classList: " + this.roles.nativeElement.classList);
    }

  }

  canManageTenant():boolean{
    let theUser: User = appStore.getState().userState.user;
    let b: boolean = false;
    if (!(theUser === null)){
      let roles: Array<string> = theUser.getRoles();

      for (let role of roles){
        if (role === DG_ADMINISTRATOR){
          b = true;
          break;
        }
      }
    }
    return b;
  }

  changePassword(post) {
    //this.tenantId = post.tenantId;
    this.message = '';
    this.success = false;
    this.failiure = false;
    this.loading = true;

    console.log(JSON.stringify(post));

    this.currentpassword = post.currentpassword;
    this.newpassword = post.newpassword;
    this.newpasswordrep = post.newpasswordrep;

    this.errorMessage = '';
    this.successMessage = '';

    if (this.currentpassword==='' || this.newpassword==='' || this.newpassword !== this.newpasswordrep){
      if (this.currentpassword == ''){
        this.errorMessage = "Current password can not be empty";
        return;
      }
      if (this.newpassword === ''){
        this.errorMessage = "New password can not be empty";
        return;
      }

      if (this.newpassword !== this.newpasswordrep){
        this.errorMessage = "New Password an the repeated one are different";
        return;
      }

    }

    const body = {
      currentPassword: this.currentpassword,
      changedPassword: this.newpassword
    };


    console.log("Body: " + JSON.stringify(body));
    let url: string = BASE_API_URL + encodeURIComponent(appStore.getState().tenantState.tenant.getTenantId()) +
      "/users/" + appStore.getState().userState.user.getUsername() +  "/password";
    console.log("url: " + url);
    this.httpClient.post(url, body, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/json')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data) => {

      console.log("data change password: " + JSON.stringify(data));
      this.success = true;
      this.message = 'Save successfully';

      setTimeout(()=>{
        this.abandonne();
      },2500);
    }, (data) => {
      console.log("Errorrrrrrr", data);
      this.failiure = true;
      this.message = 'Failed: ' + JSON.stringify(data);
    }, ()=>{
      this.loading = false;
    });

  }

  openChangePasswordUI(content){
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      console.log("Opening modal...");
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  abandonne() {
    this.modalReference.close();
  }

}

