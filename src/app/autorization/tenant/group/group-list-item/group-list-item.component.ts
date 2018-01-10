import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Group} from "../../../../domain/model/Group";
import {Router} from "@angular/router";

@Component({
  selector: 'app-group-list-item',
  templateUrl: './group-list-item.component.html',
  styleUrls: ['./group-list-item.component.css']
})
export class GroupListItemComponent implements OnInit , OnChanges{


  @Input('group')group:Group;

  constructor(private router: Router) {


  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  gotoMembers(){

    let prefix = this.group.getIsGroup()?"groups":"users";
    this.router.navigate(['/autorized/' + prefix, this.group.getLinks()['groups']]);
  }

}
