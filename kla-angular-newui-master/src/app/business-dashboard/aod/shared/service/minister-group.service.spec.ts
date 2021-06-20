import { TestBed } from '@angular/core/testing';

import { MinisterGroupService } from './minister-group.service';

describe('MinisterGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MinisterGroupService = TestBed.get(MinisterGroupService);
    expect(service).toBeTruthy();
  });
});
