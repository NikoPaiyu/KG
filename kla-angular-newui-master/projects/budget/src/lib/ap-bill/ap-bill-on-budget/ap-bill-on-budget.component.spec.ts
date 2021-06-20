import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApBillOnBudgetComponent } from './ap-bill-on-budget.component';

describe('ApBillOnBudgetComponent', () => {
  let component: ApBillOnBudgetComponent;
  let fixture: ComponentFixture<ApBillOnBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApBillOnBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApBillOnBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
