import { TestBed } from '@angular/core/testing';

import { SdgEgService } from './sdg-eg.service';

describe('SdgEgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SdgEgService = TestBed.get(SdgEgService);
    expect(service).toBeTruthy();
  });
});
