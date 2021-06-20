import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireViewComponent } from './questionnaire-view.component';

describe('QuestionnaireViewComponent', () => {
  let component: QuestionnaireViewComponent;
  let fixture: ComponentFixture<QuestionnaireViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionnaireViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
