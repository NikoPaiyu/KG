import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetDocumentComponent } from './budget-document.component';

describe('BudgetDocumentComponent', () => {
  let component: BudgetDocumentComponent;
  let fixture: ComponentFixture<BudgetDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
