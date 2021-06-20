import { TestBed } from '@angular/core/testing';

import { DigitisationService } from './digitisation.service';

describe('DigitisationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DigitisationService = TestBed.get(DigitisationService);
    expect(service).toBeTruthy();
  });
});
