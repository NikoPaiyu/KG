import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireListingComponent } from './questionnaire-listing.component';

describe('QuestionnaireListingComponent', () => {
  let component: QuestionnaireListingComponent;
  let fixture: ComponentFixture<QuestionnaireListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionnaireListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
