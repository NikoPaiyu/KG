import { TestBed } from '@angular/core/testing';

import { PmbrResolutionService } from './pmbr-resolution.service';

describe('PmbrResolutionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PmbrResolutionService = TestBed.get(PmbrResolutionService);
    expect(service).toBeTruthy();
  });
});
