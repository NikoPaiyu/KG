import { TestBed } from '@angular/core/testing';

import { DigitisationprocessService } from './digitisationprocess.service';

describe('DigitisationprocessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DigitisationprocessService = TestBed.get(DigitisationprocessService);
    expect(service).toBeTruthy();
  });
});
