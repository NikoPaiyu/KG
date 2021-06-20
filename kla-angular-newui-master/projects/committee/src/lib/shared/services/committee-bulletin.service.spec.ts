import { TestBed } from '@angular/core/testing';

import { CommitteeBulletinService } from './committee-bulletin.service';

describe('BillBulletinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommitteeBulletinService = TestBed.get(CommitteeBulletinService);
    expect(service).toBeTruthy();
  });
});
