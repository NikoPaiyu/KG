import { TestBed } from '@angular/core/testing';

import { AssemblyElectionService } from './assembly-election.service';

describe('AssemblyElectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssemblyElectionService = TestBed.get(AssemblyElectionService);
    expect(service).toBeTruthy();
  });
});
