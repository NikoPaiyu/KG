import { TestBed } from '@angular/core/testing';

import { BallotingService } from './balloting.service';

describe('BallotingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BallotingService = TestBed.get(BallotingService);
    expect(service).toBeTruthy();
  });
});
