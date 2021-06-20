import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateCheckQuestionsComponent } from './duplicate-check-questions.component';

describe('DuplicateCheckQuestionsComponent', () => {
  let component: DuplicateCheckQuestionsComponent;
  let fixture: ComponentFixture<DuplicateCheckQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateCheckQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateCheckQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
