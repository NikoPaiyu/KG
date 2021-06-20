import { TestBed } from '@angular/core/testing';

import { BillBlockService } from './bill-block.service';

describe('BillBlockService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillBlockService = TestBed.get(BillBlockService);
    expect(service).toBeTruthy();
  });
});
