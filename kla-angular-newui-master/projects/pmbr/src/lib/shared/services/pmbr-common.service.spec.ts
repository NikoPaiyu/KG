import { TestBed } from '@angular/core/testing';

import { PmbrCommonService } from './pmbr-common.service';

describe('PmbrCommonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PmbrCommonService = TestBed.get(PmbrCommonService);
    expect(service).toBeTruthy();
  });
});
