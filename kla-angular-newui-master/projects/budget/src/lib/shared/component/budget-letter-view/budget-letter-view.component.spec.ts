import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetLetterViewComponent } from './budget-letter-view.component';

describe('BudgetLetterViewComponent', () => {
  let component: BudgetLetterViewComponent;
  let fixture: ComponentFixture<BudgetLetterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetLetterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetLetterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
