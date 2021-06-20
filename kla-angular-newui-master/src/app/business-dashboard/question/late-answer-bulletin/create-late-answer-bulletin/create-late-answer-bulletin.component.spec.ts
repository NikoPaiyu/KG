import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLateAnswerBulletinComponent } from './create-late-answer-bulletin.component';

describe('CreateLateAnswerBulletinComponent', () => {
  let component: CreateLateAnswerBulletinComponent;
  let fixture: ComponentFixture<CreateLateAnswerBulletinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLateAnswerBulletinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLateAnswerBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
