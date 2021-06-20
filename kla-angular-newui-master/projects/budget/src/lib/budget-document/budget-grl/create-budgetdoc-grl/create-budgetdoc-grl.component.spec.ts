import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBudgetdocGRLComponent } from './create-budgetdoc-grl.component';

describe('CreateBudgetdocGRLComponent', () => {
  let component: CreateBudgetdocGRLComponent;
  let fixture: ComponentFixture<CreateBudgetdocGRLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBudgetdocGRLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBudgetdocGRLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
