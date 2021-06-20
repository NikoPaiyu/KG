import { TestBed } from '@angular/core/testing';

import { SwearingInService } from './swearing-in.service';

describe('SwearingInService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SwearingInService = TestBed.get(SwearingInService);
    expect(service).toBeTruthy();
  });
});
