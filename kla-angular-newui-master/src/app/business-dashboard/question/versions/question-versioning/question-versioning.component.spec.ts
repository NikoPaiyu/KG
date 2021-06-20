import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionVersioningComponent } from './question-versioning.component';

describe('QuestionVersioningComponent', () => {
  let component: QuestionVersioningComponent;
  let fixture: ComponentFixture<QuestionVersioningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionVersioningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionVersioningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
