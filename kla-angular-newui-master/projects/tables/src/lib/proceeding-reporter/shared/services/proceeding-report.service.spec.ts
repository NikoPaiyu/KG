import { TestBed } from '@angular/core/testing';

import { ProceedingReportService } from './proceeding-report.service';

describe('ProceedingReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProceedingReportService = TestBed.get(ProceedingReportService);
    expect(service).toBeTruthy();
  });
});
