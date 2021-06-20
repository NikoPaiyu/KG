import { TestBed } from '@angular/core/testing';

import { TimeAllocationService } from './time-allocation.service';

describe('TimeAllocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeAllocationService = TestBed.get(TimeAllocationService);
    expect(service).toBeTruthy();
  });
});
