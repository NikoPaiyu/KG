import { TestBed } from '@angular/core/testing';

import { RulesAndDirectionsService } from './rules-and-directions.service';

describe('RulesAndDirectionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RulesAndDirectionsService = TestBed.get(RulesAndDirectionsService);
    expect(service).toBeTruthy();
  });
});
