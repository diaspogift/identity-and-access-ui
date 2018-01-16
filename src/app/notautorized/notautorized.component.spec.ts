import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotautorizedComponent } from './notautorized.component';

describe('NotautorizedComponent', () => {
  let component: NotautorizedComponent;
  let fixture: ComponentFixture<NotautorizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotautorizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotautorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
