import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBallotedViewComponent } from './question-balloted-view.component';

describe('QuestionBallotedViewComponent', () => {
  let component: QuestionBallotedViewComponent;
  let fixture: ComponentFixture<QuestionBallotedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionBallotedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionBallotedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
