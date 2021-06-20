import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionMlaViewComponent } from './question-mla-view.component';

describe('QuestionMlaViewComponent', () => {
  let component: QuestionMlaViewComponent;
  let fixture: ComponentFixture<QuestionMlaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionMlaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionMlaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
