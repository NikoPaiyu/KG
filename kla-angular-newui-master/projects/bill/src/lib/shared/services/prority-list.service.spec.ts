import { TestBed } from '@angular/core/testing';

import { ProrityListService } from './prority-list.service';

describe('ProrityListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProrityListService = TestBed.get(ProrityListService);
    expect(service).toBeTruthy();
  });
});
