import { TestBed } from '@angular/core/testing';

import { BillAmendmentsService } from './bill-amendments.service';

describe('BillAmendmentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillAmendmentsService = TestBed.get(BillAmendmentsService);
    expect(service).toBeTruthy();
  });
});
