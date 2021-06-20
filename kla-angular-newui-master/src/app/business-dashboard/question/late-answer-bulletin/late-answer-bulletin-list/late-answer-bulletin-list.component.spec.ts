import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LateAnswerBulletinListComponent } from './late-answer-bulletin-list.component';

describe('LateAnswerBulletinListComponent', () => {
  let component: LateAnswerBulletinListComponent;
  let fixture: ComponentFixture<LateAnswerBulletinListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LateAnswerBulletinListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LateAnswerBulletinListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
