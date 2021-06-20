import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeMeetingComponent } from './committee-meeting.component';

describe('CommitteeMeetingComponent', () => {
  let component: CommitteeMeetingComponent;
  let fixture: ComponentFixture<CommitteeMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitteeMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
