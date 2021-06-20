import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBudgetDocResponseComponent } from './add-budget-doc-response.component';

describe('AddBudgetDocResponseComponent', () => {
  let component: AddBudgetDocResponseComponent;
  let fixture: ComponentFixture<AddBudgetDocResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBudgetDocResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBudgetDocResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
