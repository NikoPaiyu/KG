import { TestBed } from '@angular/core/testing';

import { BillRegisterService } from './bill-register.service';

describe('BillRegisterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillRegisterService = TestBed.get(BillRegisterService);
    expect(service).toBeTruthy();
  });
});
