import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TenantService} from "../../../../common/TenantService";
import {BASE_API_URL, CLIENT_APP_ID, LOGOUT_LINK} from "../../../../Constante";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {initialAppsState} from "../../../../state/AppState";
import {appStore} from "../../../../store/AppStore";
import {Cookie} from "ng2-cookies";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private httpClient: HttpClient,public tenantService: TenantService, public router: Router,private r:ActivatedRoute) {

    console.log("Loging out");
    console.log("Cookie.get(access_token)" + Cookie.get("access_token"));

    if (Cookie.get('logout') !== null && Cookie.get('logout') == "logout"){
      this.router.navigate(['/auth', appStore.getState().tenantState.tenant.getTenantId()]);
      return;
    }

    this.httpClient.post(LOGOUT_LINK, {} , {

      headers: new HttpHeaders().set('Accept', 'application/json').set('Content-type', 'application/x-www-form-urlencoded; charset=utf-8')
        .//set('Authorization', 'Basic ' + btoa(CLIENT_APP_ID + ":" + "123456")).
        set('Authorization', 'Bearer '+ appStore.getState().tokenState.token.accessToken)/*,
      params: new HttpParams().set('scope', 'trusted').set("grant_type", 'password').
      set('password', this.password).
      set('username', initialAppsState.tenantState.tenant.getTenantId() + '_' + this.username).set('client_id', 'identity-and-access-ui')*/
    }).subscribe((data)=>{


      //this.cookieService.set("access_token", token.accessToken, token.receivedAt);

      Cookie.deleteAll();
      Cookie.set("logout", "logout");
      this.router.navigate(['/auth', appStore.getState().tenantState.tenant.getTenantId()]);

    });

  }

  ngOnInit() {
  }



}
