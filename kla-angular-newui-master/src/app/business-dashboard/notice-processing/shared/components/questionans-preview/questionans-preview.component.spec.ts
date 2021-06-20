import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionansPreviewComponent } from './questionans-preview.component';

describe('QuestionansPreviewComponent', () => {
  let component: QuestionansPreviewComponent;
  let fixture: ComponentFixture<QuestionansPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionansPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionansPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
