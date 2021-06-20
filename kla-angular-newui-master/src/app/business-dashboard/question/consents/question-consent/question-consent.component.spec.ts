import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionConsentComponent } from './question-consent.component';

describe('QuestionConsentComponent', () => {
  let component: QuestionConsentComponent;
  let fixture: ComponentFixture<QuestionConsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionConsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
