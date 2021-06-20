import { TestBed } from '@angular/core/testing';

import { BillBulletinService } from './bill-bulletin.service';

describe('BillBulletinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillBulletinService = TestBed.get(BillBulletinService);
    expect(service).toBeTruthy();
  });
});
