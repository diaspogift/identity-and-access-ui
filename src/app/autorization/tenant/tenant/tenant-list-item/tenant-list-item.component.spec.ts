import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantListItemComponent } from './tenant-list-item.component';

describe('TenantListItemComponent', () => {
  let component: TenantListItemComponent;
  let fixture: ComponentFixture<TenantListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
