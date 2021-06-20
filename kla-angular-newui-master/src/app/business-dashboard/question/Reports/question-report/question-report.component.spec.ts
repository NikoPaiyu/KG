import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionReportComponent } from './question-report.component';

describe('QuestionReportComponent', () => {
  let component: QuestionReportComponent;
  let fixture: ComponentFixture<QuestionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
