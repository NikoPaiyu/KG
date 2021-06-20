import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometricEnrollmentComponent } from './biometric-enrollment.component';

describe('BiometricEnrollmentComponent', () => {
  let component: BiometricEnrollmentComponent;
  let fixture: ComponentFixture<BiometricEnrollmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiometricEnrollmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
