

import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})

export class SignupComponent{
  title: string = "SignupComponent";
  constructor(private route: Router, private r:ActivatedRoute){
  }

  gotoSignIn(){
    this.route.navigate(["../auth"], { relativeTo: this.r });
  }
}
