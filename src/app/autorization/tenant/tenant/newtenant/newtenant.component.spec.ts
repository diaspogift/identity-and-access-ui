import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewtenantComponent } from './newtenant.component';

describe('NewtenantComponent', () => {
  let component: NewtenantComponent;
  let fixture: ComponentFixture<NewtenantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewtenantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewtenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
