import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedMOTComponent } from './approved-mot.component';

describe('ApprovedMOTComponent', () => {
  let component: ApprovedMOTComponent;
  let fixture: ComponentFixture<ApprovedMOTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedMOTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedMOTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
