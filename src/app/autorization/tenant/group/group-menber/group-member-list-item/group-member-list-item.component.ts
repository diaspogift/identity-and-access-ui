import { Component, OnInit , Input} from '@angular/core';
import {GroupMember} from '../../../../../domain/model/GroupMember';

@Component({
  selector: 'app-group-member-list-item',
  templateUrl: './group-member-list-item.component.html',
  styleUrls: ['./group-member-list-item.component.css']
})
export class GroupMemberListItemComponent implements OnInit {

  @Input('groupMember') groupMember: GroupMember;
  constructor() { }

  ngOnInit() {
  }

}
