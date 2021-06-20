import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnswerStatusListComponent } from './create-answer-status-list.component';

describe('CreateAnswerStatusListComponent', () => {
  let component: CreateAnswerStatusListComponent;
  let fixture: ComponentFixture<CreateAnswerStatusListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAnswerStatusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAnswerStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
