import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBudgetGRLReplyComponent } from './add-budget-grl-reply.component';

describe('AddBudgetGRLReplyComponent', () => {
  let component: AddBudgetGRLReplyComponent;
  let fixture: ComponentFixture<AddBudgetGRLReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBudgetGRLReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBudgetGRLReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
