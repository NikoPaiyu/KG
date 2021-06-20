import { TestBed } from '@angular/core/testing';

import { CommonservicesService } from './commonservices.service';

describe('CommonservicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonservicesService = TestBed.get(CommonservicesService);
    expect(service).toBeTruthy();
  });
});
