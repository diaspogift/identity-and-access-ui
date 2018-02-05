
import {Routes} from "@angular/router";
import {AuthComponent} from "../auth/AuthComponent";
import {AutorizationComponent} from "../autorization/AutorizationComponent";
import {SignupComponent} from "../signup/SignupComponent";
import {AuthorizationGuard, CanManageTenant} from "../guards/authorization.guard";
import {TenantComponent} from "../autorization/tenant/tenant/tenant.component";
import {UserComponent} from "../autorization/tenant/user/user/user.component";
import {ServiceComponent} from "../autorization/service/service/service.component";
import {GroupComponent} from "../autorization/tenant/group/group.component";
import {NewtenantComponent} from "../autorization/tenant/tenant/newtenant/newtenant.component";
import {ChangePasswordComponent} from "../autorization/tenant/user/change-password/change-password.component";
import {LogoutComponent} from "../autorization/tenant/user/logout/logout.component";
import {NotautorizedComponent} from "../notautorized/notautorized.component";
import {GroupMemberComponent} from "../autorization/tenant/group/group-menber/group-menber.component";
import {AddGroupMembersComponent} from "../autorization/tenant/group/group-menber/add-group-members/add-group-members.component";
import {RoleComponent} from "../autorization/tenant/role/role/role.component";

export const childRoutes : Routes = [
  //{path:'', redirectTo:'tenants', pathMatch:'full'},
  {path:'tenants', component:TenantComponent},
  {path:'users', component:UserComponent},
  {path:'services', component:ServiceComponent},
  {path:'groups', component:GroupComponent},
  {path:'roles', component:RoleComponent},
  {path:'roles/:id', component:RoleComponent},
  {path:'groups/:id', component:GroupComponent},
  {path:'users/:id', component:UserComponent},
  {path:'newtenant', component:NewtenantComponent},
  {path:'changepassword', component:ChangePasswordComponent},
  {path:'logout', component:LogoutComponent},
  {path:'groupmembers', component:GroupMemberComponent},
  {path:'groupmembers/:id', component:GroupMemberComponent},
  {path:'groupmembers/:id/:notmemberUrl/:grpname', component:GroupMemberComponent},
  {path:'addgroupmembers/:url/:grpname', component:AddGroupMembersComponent}
  //{path:'register/:registrationinvitation', component:RegisterUserComponent},
];

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth/:tenantId', component: AuthComponent},
  { path: 'signup/:tenantId/:registrationinvitationid', component: SignupComponent},
  { path: 'autorized', component: AutorizationComponent, canActivate: [AuthorizationGuard], children:childRoutes},
  { path: 'notautorized', component: NotautorizedComponent},
  { path: '**', component: AuthComponent}
];

// considerer la desactivation du guard




