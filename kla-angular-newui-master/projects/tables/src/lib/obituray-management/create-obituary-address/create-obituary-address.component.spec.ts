import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateObituaryAddressComponent } from './create-obituary-address.component';

describe('CreateObituaryAddressComponent', () => {
  let component: CreateObituaryAddressComponent;
  let fixture: ComponentFixture<CreateObituaryAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateObituaryAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateObituaryAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
