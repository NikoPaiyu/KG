import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedAssuranceListComponent } from './approved-assurance-list.component';

describe('ApprovedAssuranceListComponent', () => {
  let component: ApprovedAssuranceListComponent;
  let fixture: ComponentFixture<ApprovedAssuranceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedAssuranceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedAssuranceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
