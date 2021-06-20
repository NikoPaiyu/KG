import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedLateAnswerListComponent } from './approved-late-answer-list.component';

describe('ApprovedLateAnswerListComponent', () => {
  let component: ApprovedLateAnswerListComponent;
  let fixture: ComponentFixture<ApprovedLateAnswerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedLateAnswerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedLateAnswerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
