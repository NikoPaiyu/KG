import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionEditDeptComponent } from './question-editdept.component';

describe('QuestionEditComponent', () => {
  let component: QuestionEditDeptComponent;
  let fixture: ComponentFixture<QuestionEditDeptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionEditDeptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionEditDeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
