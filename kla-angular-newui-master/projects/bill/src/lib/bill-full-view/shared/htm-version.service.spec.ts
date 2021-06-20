import { TestBed } from '@angular/core/testing';

import { HtmVersionService } from './htm-version.service';

describe('HtmVersionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HtmVersionService = TestBed.get(HtmVersionService);
    expect(service).toBeTruthy();
  });
});
