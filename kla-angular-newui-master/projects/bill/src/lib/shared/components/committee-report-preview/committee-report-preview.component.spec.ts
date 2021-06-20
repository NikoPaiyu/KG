import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeReportPreviewComponent } from './committee-report-preview.component';

describe('CommitteeReportPreviewComponent', () => {
  let component: CommitteeReportPreviewComponent;
  let fixture: ComponentFixture<CommitteeReportPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitteeReportPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeReportPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
