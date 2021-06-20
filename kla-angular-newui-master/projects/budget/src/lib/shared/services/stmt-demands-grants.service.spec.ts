import { TestBed } from '@angular/core/testing';

import { StmtDemandsGrantsService } from './stmt-demands-grants.service';

describe('StmtDemandsGrantsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StmtDemandsGrantsService = TestBed.get(StmtDemandsGrantsService);
    expect(service).toBeTruthy();
  });
});
