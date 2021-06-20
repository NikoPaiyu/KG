import { TestBed } from '@angular/core/testing';

import { HtmlDifferencesService } from './html-differences.service';

describe('HtmlDifferencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HtmlDifferencesService = TestBed.get(HtmlDifferencesService);
    expect(service).toBeTruthy();
  });
});
