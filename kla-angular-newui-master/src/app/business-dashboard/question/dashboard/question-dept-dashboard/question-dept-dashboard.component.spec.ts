import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDeptDashboardComponent } from './question-dept-dashboard.component';

describe('QuestionDeptDashboardComponent', () => {
  let component: QuestionDeptDashboardComponent;
  let fixture: ComponentFixture<QuestionDeptDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionDeptDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionDeptDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
