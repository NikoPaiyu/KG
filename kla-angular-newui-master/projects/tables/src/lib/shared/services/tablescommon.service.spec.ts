import { TestBed } from '@angular/core/testing';

import { TablescommonService } from './tablescommon.service';

describe('TablescommonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TablescommonService = TestBed.get(TablescommonService);
    expect(service).toBeTruthy();
  });
});
