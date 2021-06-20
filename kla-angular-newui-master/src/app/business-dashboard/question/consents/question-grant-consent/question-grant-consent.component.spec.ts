import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionGrantConsentComponent } from './question-grant-consent.component';

describe('QuestionListComponent', () => {
  let component: QuestionGrantConsentComponent;
  let fixture: ComponentFixture<QuestionGrantConsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionGrantConsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionGrantConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
