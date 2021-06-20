import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerStatusListComponent } from './answer-status-list.component';

describe('AnswerStatusListComponent', () => {
  let component: AnswerStatusListComponent;
  let fixture: ComponentFixture<AnswerStatusListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerStatusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
