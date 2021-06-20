import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionduplicateComponent } from './questionduplicate.component';

describe('QuestionduplicateComponent', () => {
  let component: QuestionduplicateComponent;
  let fixture: ComponentFixture<QuestionduplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionduplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionduplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
