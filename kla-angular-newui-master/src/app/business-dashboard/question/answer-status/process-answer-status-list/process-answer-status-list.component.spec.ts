import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessAnswerStatusListComponent } from './process-answer-status-list.component';

describe('ProcessAnswerStatusListComponent', () => {
  let component: ProcessAnswerStatusListComponent;
  let fixture: ComponentFixture<ProcessAnswerStatusListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessAnswerStatusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessAnswerStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
