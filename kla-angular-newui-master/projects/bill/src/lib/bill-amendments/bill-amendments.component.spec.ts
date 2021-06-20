import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillAmendmentsComponent } from './bill-amendments.component';

describe('BillAmendmentsComponent', () => {
  let component: BillAmendmentsComponent;
  let fixture: ComponentFixture<BillAmendmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillAmendmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillAmendmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
