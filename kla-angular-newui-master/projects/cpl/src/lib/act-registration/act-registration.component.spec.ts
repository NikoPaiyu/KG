import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActRegistrationComponent } from './act-registration.component';

describe('ActRegistrationComponent', () => {
  let component: ActRegistrationComponent;
  let fixture: ComponentFixture<ActRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
