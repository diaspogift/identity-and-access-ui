import { Injectable } from '@angular/core';
//import {holeAppSore} from "../app.component";
import {tokenNotExpired} from "angular2-jwt";
import {appStore} from "../store/AppStore";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BASE_API_URL} from "../Constante";
import {User} from "../domain/model/User";
import {MyAction} from "../common/MyAction";
import {appActionCreator} from "../actions/Action";
import {LOGIN_USER} from "../actions/UserAction";
import {Router} from "@angular/router";
import {Cookie} from "ng2-cookies";
import {AccessToken} from "../domain/model/AccessToken";
import {SAVE_TOKEN} from "../actions/TokenAction";

@Injectable()
export class AuthService {

  cookies:any;

  constructor(private httpClient: HttpClient, private  router: Router,){

  }

  login(username: string, password: string) {

    this.httpClient.get(BASE_API_URL + encodeURIComponent(appStore.getState().tenantState.tenant.getTenantId()) + "/users/" +
      encodeURIComponent(username) + "/autenticated-with/" + encodeURIComponent(password), {
      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)
    }).subscribe((data)=>{
      let user: User = new User(data['tenantId'], data['username'], data['emailAddress'], false);

      let monAction:MyAction = appActionCreator(LOGIN_USER, user);

      console.log("users ----------- user---------------> ", JSON.stringify(monAction));
      appStore.dispatch(monAction);

      this.router.navigate(['/autorized']);
    });
  }

  /*changeTenantStatus(tenantId:string, status:boolean){



  }*/

  validateEmailAddress(emailAddress: string):boolean{
    let re : RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(emailAddress);
  }

  isLoggedIn() : boolean{
    let check: boolean = this.checkCookieToken();
    return (appStore.getState().userState.user !== null &&
      appStore.getState().userState.user.getTenantId().length === 36 &&
      appStore.getState().userState.user.getUsername().length > 0 &&
      this.validateEmailAddress(appStore.getState().userState.user.getEmailAddress()) &&
      appStore.getState().tokenState.token != null &&
      this.isValideToken()) || (check);
  }

  isValideToken():boolean{
    return (new Date().getTime()) < appStore.getState().tokenState.token.receivedAt;
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    return tokenNotExpired(token);
  }

  checkCookieToken(): boolean{
    if (Cookie.check('access_token')){
      let data  = Cookie.getAll();
      this.cookies = data;
      let token : AccessToken = new AccessToken(data['access_token'], data['token_type'], data['refresh_token'],
        data['expires_in_token'], data['scope_token'], data['received_at_token'], data['username_token']);

      return token.isValide();
      /*if (!token.isValide()){
        Cookie.deleteAll();
        let monAction:MyAction = appActionCreator(SAVE_TOKEN, null);
        appStore.dispatch(monAction);

      }else{
        let monAction:MyAction = appActionCreator(SAVE_TOKEN, token);
        appStore.dispatch(monAction);

      }*/
    }else{
      console.log("NoCookies");
      return false;
    }
  }


}


//5BB1C93E-99A2-4521-859B-370E186254CF
