import { TestBed } from '@angular/core/testing';

import { CurrentAttendanceService } from './current-attendance.service';

describe('CurrentAttendanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentAttendanceService = TestBed.get(CurrentAttendanceService);
    expect(service).toBeTruthy();
  });
});
