import { TestBed } from '@angular/core/testing';

import { PmbrResolutionContentService } from './pmbr-resolution-content.service';

describe('PmbrResolutionContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PmbrResolutionContentService = TestBed.get(PmbrResolutionContentService);
    expect(service).toBeTruthy();
  });
});
