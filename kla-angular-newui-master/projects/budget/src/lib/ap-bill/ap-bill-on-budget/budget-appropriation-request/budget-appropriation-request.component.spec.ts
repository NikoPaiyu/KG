import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetAppropriationRequestComponent } from './budget-appropriation-request.component';

describe('BudgetAppropriationRequestComponent', () => {
  let component: BudgetAppropriationRequestComponent;
  let fixture: ComponentFixture<BudgetAppropriationRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetAppropriationRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetAppropriationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
