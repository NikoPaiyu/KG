import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernersAddressComponent } from './governers-address.component';

describe('GovernersAddressComponent', () => {
  let component: GovernersAddressComponent;
  let fixture: ComponentFixture<GovernersAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernersAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernersAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
