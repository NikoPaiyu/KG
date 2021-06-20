import { TestBed } from '@angular/core/testing';

import { QnbookletService } from './qnbooklet.service';

describe('QnbookletService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QnbookletService = TestBed.get(QnbookletService);
    expect(service).toBeTruthy();
  });
});
