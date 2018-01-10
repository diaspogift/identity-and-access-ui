import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../auth/AuthService';
import {appStore} from "../store/AppStore";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(): boolean {
    console.log("calling can:  " , JSON.stringify(appStore.getState()));
    return this.authService.isLoggedIn();
  }
}

@Injectable()
export class CanManageTenant implements CanActivate{

  canActivate(): boolean {
    console.log("calling can:  " , JSON.stringify(appStore.getState()));
    return appStore.getState().userState.user.getUsername() != null;
  }

}


@Injectable()
export class CanManageUser implements CanActivate{

  canActivate(): boolean {
    console.log("calling can:  " , JSON.stringify(appStore.getState()));
    return appStore.getState().userState.user.getUsername() != null;
  }

}


@Injectable()
export class CanManageService implements CanActivate{

  canActivate(): boolean {
    console.log("calling can:  " , JSON.stringify(appStore.getState()));
    return appStore.getState().userState.user.getUsername() != null;
  }

}
