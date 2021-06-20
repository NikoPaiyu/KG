import { TestBed } from '@angular/core/testing';

import { ObituaryService } from './obituary.service';

describe('ObituaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObituaryService = TestBed.get(ObituaryService);
    expect(service).toBeTruthy();
  });
});
