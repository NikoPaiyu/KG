import { TestBed } from '@angular/core/testing';

import { SoaService } from './soa.service';

describe('SoaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SoaService = TestBed.get(SoaService);
    expect(service).toBeTruthy();
  });
});
