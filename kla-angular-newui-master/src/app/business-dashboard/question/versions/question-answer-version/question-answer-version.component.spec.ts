import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnswerVersionComponent } from './question-answer-version.component';

describe('QuestionVersioningComponent', () => {
  let component: QuestionAnswerVersionComponent;
  let fixture: ComponentFixture<QuestionAnswerVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAnswerVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnswerVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
