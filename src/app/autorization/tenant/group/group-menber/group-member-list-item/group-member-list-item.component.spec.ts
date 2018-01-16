import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMemberListItemComponent } from './group-member-list-item.component';

describe('GroupMemberListItemComponent', () => {
  let component: GroupMemberListItemComponent;
  let fixture: ComponentFixture<GroupMemberListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMemberListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMemberListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
