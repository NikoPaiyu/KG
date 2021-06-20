import { TestBed } from '@angular/core/testing';

import { CplService } from './cpl.service';

describe('CplService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CplService = TestBed.get(CplService);
    expect(service).toBeTruthy();
  });
});
