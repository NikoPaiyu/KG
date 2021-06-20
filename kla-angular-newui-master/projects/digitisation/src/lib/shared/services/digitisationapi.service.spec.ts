import { TestBed } from '@angular/core/testing';

import { DigitisationapiService } from './digitisationapi.service';

describe('DigitisationapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DigitisationapiService = TestBed.get(DigitisationapiService);
    expect(service).toBeTruthy();
  });
});
