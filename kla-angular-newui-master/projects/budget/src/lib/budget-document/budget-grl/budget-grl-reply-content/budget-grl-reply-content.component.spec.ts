import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetGrlReplyContentComponent } from './budget-grl-reply-content.component';

describe('BudgetGrlReplyContentComponent', () => {
  let component: BudgetGrlReplyContentComponent;
  let fixture: ComponentFixture<BudgetGrlReplyContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetGrlReplyContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetGrlReplyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
