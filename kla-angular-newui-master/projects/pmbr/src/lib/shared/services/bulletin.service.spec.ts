import { TestBed } from '@angular/core/testing';

import { BulletinService } from './bulletin.service';

describe('BulletinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BulletinService = TestBed.get(BulletinService);
    expect(service).toBeTruthy();
  });
});
