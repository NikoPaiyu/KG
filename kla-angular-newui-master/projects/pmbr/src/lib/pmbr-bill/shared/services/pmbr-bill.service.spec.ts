import { TestBed } from '@angular/core/testing';

import { PmbrBillService } from './pmbr-bill.service';

describe('PmbrManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PmbrBillService = TestBed.get(PmbrBillService);
    expect(service).toBeTruthy();
  });
});
