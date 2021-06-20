import { TestBed } from '@angular/core/testing';

import { RunningnoteService } from './runningnote.service';

describe('RunningnoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RunningnoteService = TestBed.get(RunningnoteService);
    expect(service).toBeTruthy();
  });
});
