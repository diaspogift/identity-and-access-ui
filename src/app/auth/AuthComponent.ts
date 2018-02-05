
import {Component, OnInit} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {initialAppsState} from "../state/AppState";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ACCESSTOKEN_LINK, CLIENT_APP_ID} from "../Constante";
import {AccessToken} from "../domain/model/AccessToken";
import {Cookie} from "ng2-cookies";
import {ActivatedRoute, Router} from "@angular/router";
import {MyAction} from "../common/MyAction";
import {appStore} from "../store/AppStore";
import {SAVE_TOKEN} from "../actions/TokenAction";
import {appActionCreator} from "../actions/Action";
import {AuthService} from "./AuthService";
import {initialTenantState} from "../state/TenantState";
import {Tenant} from "../domain/model/Tenant";
@Component({
  selector: 'auth',
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})

export class AuthComponent implements OnInit{
  //titleAlert:string = 'This field is required';
  rForm: FormGroup;
  username:string = '';
  password:string = '';
  tenantId:string;

  constructor(private fb: FormBuilder, private http:HttpClient,  private _router: Router, private authService: AuthService ,private r:ActivatedRoute) {
    this.rForm = fb.group({
      //'tenantId' : [null, Validators.required],
      'username' : [null, Validators.required],
      'password' : [null, Validators.required],
      //'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      //'validate' : ''
    });

    r.params.subscribe(params=>{
      this.tenantId = params['tenantId']?params['tenantId']:null;
    });

  }

  ngOnInit(): void {
    /*this.whatPage = window.location.hash.substring(1).split("?")[0];
    let tntId = this.tenantService.getTenantId("tnt");
    console.log("on init appStore.getState().tenantState.tenant.getTenantId(); " + JSON.stringify(appStore));
    //tntId = tntId?tntId: appStore.getState().tenantState.tenant.getTenantId();
    this.tenantId = tntId?tntId:DGTENANTID;*/
    if (this.tenantId === null){
      this._router.navigate(['/notautorized']);
      return;
    }
    initialTenantState.tenant = new Tenant(this.tenantId, "", "", false, []);
    initialAppsState.tenantState = initialTenantState;
    this.checkToken();
  }


  checkToken(){

    console.log("cookiessssmmlmlkmlmksss", JSON.stringify(Cookie.getAll()));
    if (Cookie.check('access_token')){


      console.log("COKIESSSSSSSSSSSS", Cookie.check('access_token') + Cookie.get("access_token"));

      let data  = Cookie.getAll();
      let token : AccessToken = new AccessToken(data['access_token'], data['token_type'], data['refresh_token'],
        data['expires_in_token'], data['scope_token'], data['received_at_token'], data['username_token']);
      console.log("token from cookies: " + JSON.stringify(token));

      console.log("token valide: " + token.isValide());

      if (!token.isValide()){
        Cookie.deleteAll();
        let monAction:MyAction = appActionCreator(SAVE_TOKEN, null);
        appStore.dispatch(monAction);

      }else{
        let monAction:MyAction = appActionCreator(SAVE_TOKEN, token);
        appStore.dispatch(monAction);
      }
    }else{
      console.log("NoCookies");
    }
  }

  addAuthenticate(post) {
    //this.tenantId = post.tenantId;
    this.username = post.username;
    this.password = post.password;
    console.log("submitting: ", this.username, this.password + " | " + initialAppsState.tenantState.tenant.getTenantId());

    const body = {
      scope: 'trusted',
      grant_type: 'password',
      password: this.password,
      username: initialAppsState.tenantState.tenant.getTenantId() + '_' + this.username,
      client_id: CLIENT_APP_ID
    };

    console.log("ACCESSTOKEN_LINK in component", ACCESSTOKEN_LINK);

    console.log("Body: " + JSON.stringify(body));
    this.http.post(ACCESSTOKEN_LINK, body, {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Basic ' + btoa(body.client_id + ":" + "123456")),
      params: new HttpParams().set('scope', 'trusted').set("grant_type", 'password').
      set('password', this.password).
      set('username', initialAppsState.tenantState.tenant.getTenantId() + '_' + this.username).set('client_id', CLIENT_APP_ID)
    }).subscribe((data) => {

      let token: AccessToken = new AccessToken(data['access_token'], data['token_type'], data['refresh_token'],
        data['expires_in'], data['scope'], (new Date().getTime()) + data['expires_in'] * 1000, this.username);

      console.log("token", JSON.stringify(token));

      let monAction: MyAction = appActionCreator(SAVE_TOKEN, token);
      appStore.dispatch(monAction);

      this.saveToken(token);

      this.authService.login(this.username, this.password);

    }, (data) => {
      console.log("Errorrrrrrr0000", data);

      if (Cookie.check('access_token')){
        let refresh_token = Cookie.get('refresh_token');
        this.http.post(ACCESSTOKEN_LINK, {refresh_token:refresh_token, grant_type:'refresh_token'}, {
          headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
            .set('Authorization', 'Basic ' + btoa(body.client_id + ":" + "123456")),
          params: new HttpParams().set('scope', 'trusted').set("grant_type", 'refresh_token').
          set('password', this.password).
          set('username', initialAppsState.tenantState.tenant.getTenantId() + '_' + this.username).set('client_id', CLIENT_APP_ID)
        }).subscribe((data1) => {

          //console.log("dataaaaa", data);

          let token: AccessToken = new AccessToken(data1['access_token'], data1['token_type'], data1['refresh_token'],
            data1['expires_in'], data1['scope'], (new Date().getTime()) + data1['expires_in'] * 1000, this.username);

          console.log("token", JSON.stringify(token));

          let monAction: MyAction = appActionCreator(SAVE_TOKEN, token);
          appStore.dispatch(monAction);

          this.saveToken(token);

          this.authService.login(this.username, this.password);

          /*
          {"access_token":"2a2fdb06-cfd8-413a-9dd9-76bed0e2db21",
          "token_type":"bearer",
          "refresh_token":"ff33cae5-3ef0-4c57-a3c1-298ba518a1ab","expires_in":43199,"scope":"trusted"}nkalla@nkalla-diaspo-gift:/opt/webstorm
           */


        }, (data1) => {
          console.log("Errorrrrrrr1111111111", JSON.stringify(data1));

         });
      }



    });


  }

  saveToken(token:AccessToken){

    console.log("SAVE TOKEN IN COOKIES: " + JSON.stringify(token));
    //this.cookieService.set("access_token", token.accessToken, token.receivedAt);
    Cookie.set("access_token", token.accessToken);
    Cookie.set("refresh_token", token.refreshToken);
    Cookie.set("received_at_token", "" + token.receivedAt);
    Cookie.set("expires_in_token", "" + token.expiresIn);
    Cookie.set("scope_token", "" + token.scope);
    Cookie.set("username_token", "" + token.username);
    Cookie.delete("logout");

  }

  gotoSigUp(){
    this._router.navigate(["../signup"], { relativeTo: this.r });
  }

}

//curl -X POST
// -vu dg-collaboration-angular4-client:123456
// -H "Accept: application/json"
// -d "password=/2E7b}z1&username=95BC5749-851D-44E5-95C3-0411B72F8B45_admin&grant_type=password&scope=trusted" http://localhost:8081/oauth/token


//<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.3.1/css/foundation.min.css">


//02r|:20?1Y
