import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionClubbWithdwComponent } from './question-clubb-withdw.component';

describe('QuestionClubbWithdwComponent', () => {
  let component: QuestionClubbWithdwComponent;
  let fixture: ComponentFixture<QuestionClubbWithdwComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionClubbWithdwComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionClubbWithdwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
