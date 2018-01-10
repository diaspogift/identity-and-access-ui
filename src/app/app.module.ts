import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import {AuthComponent} from "./auth/AuthComponent";
import {AutorizationComponent} from "./autorization/AutorizationComponent";
import {RouterModule} from "@angular/router";
import {childRoutes, routes} from "./rooute/Config";
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from "@angular/common";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {SignupComponent} from "./signup/SignupComponent";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import {MatButtonModule, MatCheckboxModule, MatTabsModule, MatCardModule, MatFormFieldModule} from '@angular/material';
//import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule } from '@angular/animations';
// forms


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AuthService} from "./auth/AuthService";
import {AuthorizationGuard, CanManageService, CanManageTenant, CanManageUser} from "./guards/authorization.guard";
import {TenantService} from "./common/TenantService";


import {HttpClientModule} from '@angular/common/http';
import {CookieService} from "ng2-cookies";
import { TenantComponent } from './autorization/tenant/tenant/tenant.component';
import { UserComponent } from './autorization/tenant/user/user/user.component';
import { ServiceComponent } from './autorization/service/service/service.component';
import { TenantListItemComponent } from './autorization/tenant/tenant/tenant-list-item/tenant-list-item.component';
import { GroupComponent } from './autorization/tenant/group/group.component';
import { GroupListItemComponent } from './autorization/tenant/group/group-list-item/group-list-item.component';
import { NewtenantComponent } from './autorization/tenant/tenant/newtenant/newtenant.component';
import { UserListItemComponent } from './autorization/tenant/user/user-list-item/user-list-item.component';
import { ChangePasswordComponent } from './autorization/tenant/user/change-password/change-password.component';
//import { NgxMyDatePickerModule } from 'ngx-mydatepicker';


@NgModule({
  declarations: [
    AppComponent, AuthComponent, AutorizationComponent, SignupComponent, TenantComponent, UserComponent, ServiceComponent, TenantListItemComponent, GroupComponent, GroupListItemComponent, NewtenantComponent, UserListItemComponent, ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes), // <-- routes
    RouterModule.forRoot(childRoutes),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,  // Add this!
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    //NgxMyDatePickerModule.forRoot()
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: AuthService, useClass: AuthService }, { provide: AuthorizationGuard, useClass: AuthorizationGuard },
    {provide:TenantService, useClass: TenantService},{provide:CanManageTenant, useClass: CanManageTenant},
    {provide:CanManageUser, useClass: CanManageUser},{provide:CanManageService, useClass: CanManageService},
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err: any) => console.error(err));
