import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetDocReplyLetterComponent } from './budget-doc-reply-letter.component';

describe('BudgetDocReplyLetterComponent', () => {
  let component: BudgetDocReplyLetterComponent;
  let fixture: ComponentFixture<BudgetDocReplyLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetDocReplyLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetDocReplyLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
