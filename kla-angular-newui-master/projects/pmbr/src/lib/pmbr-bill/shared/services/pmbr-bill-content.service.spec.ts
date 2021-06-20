import { TestBed } from '@angular/core/testing';

import { PmbrBillContentService } from './pmbr-bill-content.service';

describe('PmbrBillContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PmbrBillContentService = TestBed.get(PmbrBillContentService);
    expect(service).toBeTruthy();
  });
});
