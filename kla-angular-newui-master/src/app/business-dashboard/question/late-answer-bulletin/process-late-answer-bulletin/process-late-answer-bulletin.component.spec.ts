import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessLateAnswerBulletinComponent } from './process-late-answer-bulletin.component';

describe('ProcessLateAnswerBulletinComponent', () => {
  let component: ProcessLateAnswerBulletinComponent;
  let fixture: ComponentFixture<ProcessLateAnswerBulletinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessLateAnswerBulletinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessLateAnswerBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
