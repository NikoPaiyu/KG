import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApBillOnBudgetResponseComponent } from './ap-bill-on-budget-response.component';

describe('ApBillOnBudgetResponseComponent', () => {
  let component: ApBillOnBudgetResponseComponent;
  let fixture: ComponentFixture<ApBillOnBudgetResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApBillOnBudgetResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApBillOnBudgetResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
