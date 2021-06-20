import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDateShiftingComponent } from './question-date-shifting.component';

describe('QuestionDateShiftingComponent', () => {
  let component: QuestionDateShiftingComponent;
  let fixture: ComponentFixture<QuestionDateShiftingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionDateShiftingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionDateShiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
