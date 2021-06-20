import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetAppropriationReplyComponent } from './budget-appropriation-reply.component';

describe('BudgetAppropriationReplyComponent', () => {
  let component: BudgetAppropriationReplyComponent;
  let fixture: ComponentFixture<BudgetAppropriationReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetAppropriationReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetAppropriationReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
