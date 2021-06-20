import { TestBed } from '@angular/core/testing';

import { BillViewService } from './bill-view.service';

describe('BillViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillViewService = TestBed.get(BillViewService);
    expect(service).toBeTruthy();
  });
});
