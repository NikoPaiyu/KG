import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingReportPreviewComponent } from './meeting-report-preview.component';

describe('MeetingReportPreviewComponent', () => {
  let component: MeetingReportPreviewComponent;
  let fixture: ComponentFixture<MeetingReportPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingReportPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingReportPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
