import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Group} from "../../../../domain/model/Group";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-group-list-item',
  templateUrl: './group-list-item.component.html',
  styleUrls: ['./group-list-item.component.css']
})
export class GroupListItemComponent implements OnInit , OnChanges{


  @Input('group')group:Group;

  constructor(private router: Router , private r:ActivatedRoute) {


  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  gotoMembers(){
    this.router.navigate(['/autorized/groupmembers/', this.group.getLinks()['members']]);
    //this.router.navigate(["../autorized/register", '76DC6953-AD34-446E-91D0-92934E5DB6D4'], { relativeTo: this.r });
  }


}
