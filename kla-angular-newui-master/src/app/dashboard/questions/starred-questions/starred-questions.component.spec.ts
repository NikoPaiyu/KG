import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarredQuestionsComponent } from './starred-questions.component';

describe('StarredQuestionsComponent', () => {
  let component: StarredQuestionsComponent;
  let fixture: ComponentFixture<StarredQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarredQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarredQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
