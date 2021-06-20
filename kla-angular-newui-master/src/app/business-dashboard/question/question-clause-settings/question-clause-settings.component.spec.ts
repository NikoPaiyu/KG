import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionClauseSettingsComponent } from './question-clause-settings.component';

describe('QuestionClauseSettingsComponent', () => {
  let component: QuestionClauseSettingsComponent;
  let fixture: ComponentFixture<QuestionClauseSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionClauseSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionClauseSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
