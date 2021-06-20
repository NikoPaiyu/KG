import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingNoticeComponent } from './meeting-notice.component';

describe('MeetingNoticeComponent', () => {
  let component: MeetingNoticeComponent;
  let fixture: ComponentFixture<MeetingNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
