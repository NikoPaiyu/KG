import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnstarredQuestionsComponent } from './unstarred-questions.component';

describe('UnstarredQuestionsComponent', () => {
  let component: UnstarredQuestionsComponent;
  let fixture: ComponentFixture<UnstarredQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnstarredQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnstarredQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
