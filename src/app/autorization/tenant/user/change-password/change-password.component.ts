import { Component, OnInit } from '@angular/core';
import {appStore} from "../../../../store/AppStore";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ACCESSTOKEN_LINK, BASE_API_URL} from "../../../../Constante";
import {Router} from "@angular/router";
import {AuthService} from "../../../../auth/AuthService";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  rForm: FormGroup;

  currentpassword: string;
  newpassword: string;
  newpasswordrep: string;

  errorMessage:string;
  successMessage:string;

  constructor(private fb: FormBuilder, private router: Router, private httpClient: HttpClient, private authService: AuthService) {

    this.rForm = fb.group({
      //'tenantId' : [null, Validators.required],
      'currentpassword' : [null, Validators.required],
      'newpassword' : [null, Validators.required],
      'newpasswordrep' : [null, Validators.required],
      //'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      //'validate' : ''
    });



    this.errorMessage = '';
    this.successMessage = '';
  }

  ngOnInit() {
  }

  changePassword(post) {
    //this.tenantId = post.tenantId;

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

    }, (data) => {
      console.log("Errorrrrrrr", data);
    });

  }

}

/*
private String currentPassword;
    private String changedPassword;
 */
