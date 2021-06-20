import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateMeetingReportComponent } from './generate-meeting-report.component';

describe('GenerateMeetingReportComponent', () => {
  let component: GenerateMeetingReportComponent;
  let fixture: ComponentFixture<GenerateMeetingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateMeetingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateMeetingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
