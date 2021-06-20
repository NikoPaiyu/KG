import { TestBed } from '@angular/core/testing';

import { PmbrService } from './pmbr.service';

describe('PmbrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PmbrService = TestBed.get(PmbrService);
    expect(service).toBeTruthy();
  });
});
