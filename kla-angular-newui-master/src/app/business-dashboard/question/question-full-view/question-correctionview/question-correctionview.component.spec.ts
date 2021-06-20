import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCorrectionViewComponent } from './question-correctionview.component';

describe('QuestionViewComponent', () => {
  let component: QuestionCorrectionViewComponent;
  let fixture: ComponentFixture<QuestionCorrectionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionCorrectionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionCorrectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
