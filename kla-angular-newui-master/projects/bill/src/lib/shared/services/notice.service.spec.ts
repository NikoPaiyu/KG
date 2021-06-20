import { TestBed } from '@angular/core/testing';

import { BillNoticeService } from './bill-notice.service';

describe('NoticeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillNoticeService = TestBed.get(BillNoticeService);
    expect(service).toBeTruthy();
  });
});
