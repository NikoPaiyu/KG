import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionListMlaComponent } from './question-list-mla.component';

describe('QuestionListMlaComponent', () => {
  let component: QuestionListMlaComponent;
  let fixture: ComponentFixture<QuestionListMlaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionListMlaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionListMlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
