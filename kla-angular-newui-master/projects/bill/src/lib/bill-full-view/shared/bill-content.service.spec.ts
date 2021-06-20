import { TestBed } from '@angular/core/testing';

import { BillContentService } from './bill-content.service';

describe('BillContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillContentService = TestBed.get(BillContentService);
    expect(service).toBeTruthy();
  });
});
