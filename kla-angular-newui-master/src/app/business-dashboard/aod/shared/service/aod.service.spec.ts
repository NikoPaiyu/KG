import { TestBed } from '@angular/core/testing';

import { AodService } from './aod.service';

describe('AodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AodService = TestBed.get(AodService);
    expect(service).toBeTruthy();
  });
});
