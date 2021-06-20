import { TestBed } from '@angular/core/testing';

import { PmbrScheduleService } from './pmbr-schedule.service';

describe('PmbrScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PmbrScheduleService = TestBed.get(PmbrScheduleService);
    expect(service).toBeTruthy();
  });
});
