import { TestBed } from '@angular/core/testing';

import { BillManagementService } from './bill-management.service';

describe('BillManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillManagementService = TestBed.get(BillManagementService);
    expect(service).toBeTruthy();
  });
});
