import { TestBed } from '@angular/core/testing';

import { CorrespondenceService } from './correspondence.service';

describe('CorrespondenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CorrespondenceService = TestBed.get(CorrespondenceService);
    expect(service).toBeTruthy();
  });
});
