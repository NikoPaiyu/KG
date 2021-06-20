import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCheckDuplicateComponent } from './question-check-duplicate.component';

describe('QuestionCheckDuplicateComponent', () => {
  let component: QuestionCheckDuplicateComponent;
  let fixture: ComponentFixture<QuestionCheckDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionCheckDuplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionCheckDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
