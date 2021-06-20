import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBallotDateReportComponent } from './question-ballot-date-report.component';

describe('QuestionBallotDateReportComponent', () => {
  let component: QuestionBallotDateReportComponent;
  let fixture: ComponentFixture<QuestionBallotDateReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionBallotDateReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionBallotDateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
