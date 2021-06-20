import { TestBed } from '@angular/core/testing';

import { NoticeProcessService } from './notice-process.service';

describe('NoticeProcessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoticeProcessService = TestBed.get(NoticeProcessService);
    expect(service).toBeTruthy();
  });
});
