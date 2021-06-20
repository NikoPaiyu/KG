import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionNoticeAddtobankComponent } from './question-notice-addtobank.component';

describe('QuestionNoticeAddtobankComponent', () => {
  let component: QuestionNoticeAddtobankComponent;
  let fixture: ComponentFixture<QuestionNoticeAddtobankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionNoticeAddtobankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionNoticeAddtobankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
