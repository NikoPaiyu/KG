import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGovernersAddressComponent } from './list-governers-address.component';

describe('ListGovernersAddressComponent', () => {
  let component: ListGovernersAddressComponent;
  let fixture: ComponentFixture<ListGovernersAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGovernersAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGovernersAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
