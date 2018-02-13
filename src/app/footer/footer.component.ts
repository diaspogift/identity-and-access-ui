import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
   copyrightDate: Date;


  constructor() {
    this.copyrightDate = new Date();
  }

  ngOnInit() {
  }

}
