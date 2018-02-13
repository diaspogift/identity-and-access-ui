import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';

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

//import * as $ from 'jquery';


import {HttpClientModule} from '@angular/common/http';
import {CookieService} from "ng2-cookies";
import { TenantComponent } from './autorization/tenant/tenant/tenant.component';
import { UserComponent } from './autorization/tenant/user/user/user.component';
import { ServiceComponent } from './autorization/service/service/service.component';
import { TenantListItemComponent } from './autorization/tenant/tenant/tenant-list-item/tenant-list-item.component';
import { GroupComponent } from './autorization/tenant/group/group.component';
import { GroupListItemComponent } from './autorization/tenant/group/group-list-item/group-list-item.component';
import { NewtenantComponent } from './autorization/tenant/tenant/newtenant/newtenant.component';
import { UserListItemComponent } from './autorization/tenant/user/user/user-list-item/user-list-item.component';
import { ChangePasswordComponent } from './autorization/tenant/user/change-password/change-password.component';
import { LogoutComponent } from './autorization/tenant/user/logout/logout.component';
import { NotautorizedComponent } from './notautorized/notautorized.component';
import { GroupMemberComponent } from './autorization/tenant/group/group-menber/group-menber.component';
import { GroupMemberListItemComponent } from './autorization/tenant/group/group-menber/group-member-list-item/group-member-list-item.component';
import {BsModalModule} from "ng2-bs3-modal/ng2-bs3-modal";
import { AddGroupMembersComponent } from './autorization/tenant/group/group-menber/add-group-members/add-group-members.component';
import {InternationalPhoneModule} from "ng4-intl-phone";
import {Ng4GeoautocompleteModule} from "ng4-geoautocomplete";
import {NgxPhoneSelectModule} from "ngx-phone-select";
import {BsDropdownModule} from "ngx-bootstrap";
import { RoleComponent } from './autorization/tenant/role/role/role.component';
import { RoleListItemComponent } from './autorization/tenant/role/role/role-list-item/role-list-item.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
//import * as $ from 'jquery';
//import {BsModalModule} from "ng2-bs3-modal/ng2-bs3-modal";


//import {BsModalModule} from "ng2-bs3-modal";
//import {BsModalModule} from "ng2-bs3-modal";
//import { NgxMyDatePickerModule } from 'ngx-mydatepicker';


@NgModule({
  declarations: [
    AppComponent, AuthComponent, AutorizationComponent, SignupComponent, TenantComponent, UserComponent, ServiceComponent,
    TenantListItemComponent, GroupComponent, GroupListItemComponent, NewtenantComponent, UserListItemComponent,
    ChangePasswordComponent, LogoutComponent, NotautorizedComponent, GroupMemberComponent, GroupMemberListItemComponent,
    AddGroupMembersComponent,
    RoleComponent,
    RoleListItemComponent,
    FooterComponent,
    HeaderComponent
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
    BsModalModule,
    InternationalPhoneModule,
    Ng4GeoautocompleteModule.forRoot(),
    NgxPhoneSelectModule,
    BsDropdownModule.forRoot()

  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: AuthService, useClass: AuthService }, { provide: AuthorizationGuard, useClass: AuthorizationGuard },
    {provide:TenantService, useClass: TenantService},{provide:CanManageTenant, useClass: CanManageTenant},
    {provide:CanManageUser, useClass: CanManageUser},{provide:CanManageService, useClass: CanManageService},
    {provide:NgbActiveModal, useClass:NgbActiveModal},
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err: any) => console.error(err));
