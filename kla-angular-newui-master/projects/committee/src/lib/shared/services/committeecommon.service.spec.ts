import { TestBed } from '@angular/core/testing';

import { CommitteecommonService } from './committeecommon.service';

describe('CommitteecommonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommitteecommonService = TestBed.get(CommitteecommonService);
    expect(service).toBeTruthy();
  });
});
