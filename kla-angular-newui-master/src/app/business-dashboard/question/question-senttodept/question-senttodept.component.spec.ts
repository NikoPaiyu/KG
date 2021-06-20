import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSenttoDeptComponent } from './question-senttodept.component';

describe('QuestionSenttoDeptComponent', () => {
  let component: QuestionSenttoDeptComponent;
  let fixture: ComponentFixture<QuestionSenttoDeptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionSenttoDeptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSenttoDeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
