import { TestBed } from '@angular/core/testing';

import { BillcommonService } from './billcommon.service';

describe('BillcommonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillcommonService = TestBed.get(BillcommonService);
    expect(service).toBeTruthy();
  });
});
