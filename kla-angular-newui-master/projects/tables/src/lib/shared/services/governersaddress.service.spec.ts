import { TestBed } from '@angular/core/testing';

import { GovernersAddressService } from './governersaddress.service';

describe('GovernersAddressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GovernersAddressService = TestBed.get(GovernersAddressService);
    expect(service).toBeTruthy();
  });
});
