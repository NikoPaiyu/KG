import { TestBed } from '@angular/core/testing';

import { BulletinServiceService } from './bulletin-service.service';

describe('BulletinServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BulletinServiceService = TestBed.get(BulletinServiceService);
    expect(service).toBeTruthy();
  });
});
