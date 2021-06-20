import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionRequestConsentComponent } from './question-request-consent.component';

describe('QuestionListComponent', () => {
  let component: QuestionRequestConsentComponent;
  let fixture: ComponentFixture<QuestionRequestConsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionRequestConsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionRequestConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
