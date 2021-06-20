import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPerformBallotComponent } from './question-perform-ballot.component';

describe('QuestionSettingsComponent', () => {
  let component: QuestionPerformBallotComponent;
  let fixture: ComponentFixture<QuestionPerformBallotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionPerformBallotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPerformBallotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
