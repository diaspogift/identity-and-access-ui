
import {Routes} from "@angular/router";
import {AuthComponent} from "../auth/AuthComponent";
import {AutorizationComponent} from "../autorization/AutorizationComponent";
import {SignupComponent} from "../signup/SignupComponent";
import {AuthorizationGuard} from "../guards/authorization.guard";
import {TenantComponent} from "../autorization/tenant/tenant/tenant.component";
import {UserComponent} from "../autorization/tenant/user/user/user.component";
import {ServiceComponent} from "../autorization/service/service/service.component";
import {GroupComponent} from "../autorization/tenant/group/group.component";
import {NewtenantComponent} from "../autorization/tenant/tenant/newtenant/newtenant.component";
import {ChangePasswordComponent} from "../autorization/tenant/user/change-password/change-password.component";

export const childRoutes : Routes = [
  {path:'', redirectTo:'tenants', pathMatch:'full'},
  {path:'tenants', component:TenantComponent},
  {path:'users', component:UserComponent},
  {path:'services', component:ServiceComponent},
  {path:'groups', component:GroupComponent},
  {path:'groups/:id', component:GroupComponent},
  {path:'users/:id', component:UserComponent},
  {path:'newtenant', component:NewtenantComponent},
  {path:'changepassword', component:ChangePasswordComponent},

];

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent},
  { path: 'signup', component: SignupComponent },
  { path: 'autorized', component: AutorizationComponent, canActivate: [AuthorizationGuard], children:childRoutes},
  { path: '**', component: AuthComponent}
];

// considerer la desactivation du guard




