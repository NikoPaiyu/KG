import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionListDeptComponent } from './question-list-dept.component';

describe('QuestionListDeptComponent', () => {
  let component: QuestionListDeptComponent;
  let fixture: ComponentFixture<QuestionListDeptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionListDeptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionListDeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
