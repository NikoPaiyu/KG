import { TestBed } from '@angular/core/testing';

import { NoticeTemplateService } from './notice-template.service';

describe('NoticeTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoticeTemplateService = TestBed.get(NoticeTemplateService);
    expect(service).toBeTruthy();
  });
});
