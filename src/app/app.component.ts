import {Component, Inject, OnInit} from '@angular/core';

import {initialAppsState} from "./state/AppState";
import {AppStore, appStore} from "./store/AppStore";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {TenantService} from "./common/TenantService";
import {Tenant} from "./domain/model/Tenant";
import {initialTenantState} from "./state/TenantState";
import {DGTENANTID} from "./Constante";
import {Cookie} from "ng2-cookies";
import {AccessToken} from "./domain/model/AccessToken";
import {SAVE_TOKEN} from "./actions/TokenAction";
import {appActionCreator} from "./actions/Action";
import {MyAction} from "./common/MyAction";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{


  title = 'Diaspo Gift';
  //tenantIdStream:Observable<string>;
  tenantId:string;
  whatPage:string;
  //path:string;


  constructor(public tenantService: TenantService, public router: Router) {



    //.tenant= new Tenant(this.tenantId, "", "", []);

    /*this.tenantIdStream = Rx.Observable.create((observer:Observer<string>)=>{

      observer.next(this.whatPage);
      //return tenantService.getTenantId("tnt");
    });*/

    /*this.tenantIdStream.subscribe((value:string)=>{
      this.tenantId = value?value:DGTENANTID;
      initialTenantState.tenant = new Tenant(this.tenantId, "", "", []);
      initialAppsState.tenantState = initialTenantState;//.tenant= new Tenant(this.tenantId, "", "", []);
    });*/


    //this.whatPage = event['url'];
    //console.log("whatPage: " , this.whatPage);

    /**
     * this.router.events is an observable on which we can subscribe an obser for event on routing
     */

    /*this.router.events.subscribe((event) => {
      //console.log("Router.event: " + event);
      if (event instanceof NavigationStart) {
        console.log('NavigationStart:', event);
      }
    });*/

  }

  ngOnInit(): void {
    this.whatPage = window.location.hash.substring(1).split("?")[0];
    let tntId = this.tenantService.getTenantId("tnt");
    console.log("on init appStore.getState().tenantState.tenant.getTenantId(); " + JSON.stringify(appStore));
    //tntId = tntId?tntId: appStore.getState().tenantState.tenant.getTenantId();
    this.tenantId = tntId?tntId:DGTENANTID;
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
}
//http://localhost:8085/oauth/token   methode POST  secret: ManagingMembers@@2017
//export let holeAppSore: AppStore= new AppStore(initialAppsState);



