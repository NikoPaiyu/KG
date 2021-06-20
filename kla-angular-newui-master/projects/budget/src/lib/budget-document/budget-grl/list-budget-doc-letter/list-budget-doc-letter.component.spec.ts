import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBudgetDocLetterComponent } from './list-budget-doc-letter.component';

describe('ListBudgetDocLetterComponent', () => {
  let component: ListBudgetDocLetterComponent;
  let fixture: ComponentFixture<ListBudgetDocLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBudgetDocLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBudgetDocLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
