import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedCosComponent } from './approved-cos.component';

describe('ApprovedCosComponent', () => {
  let component: ApprovedCosComponent;
  let fixture: ComponentFixture<ApprovedCosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedCosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedCosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
