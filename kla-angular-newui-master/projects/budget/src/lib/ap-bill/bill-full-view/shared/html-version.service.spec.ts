import { TestBed } from '@angular/core/testing';

import { HtmlVersionService } from './html-version.service';

describe('HtmlVersionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HtmlVersionService = TestBed.get(HtmlVersionService);
    expect(service).toBeTruthy();
  });
});
