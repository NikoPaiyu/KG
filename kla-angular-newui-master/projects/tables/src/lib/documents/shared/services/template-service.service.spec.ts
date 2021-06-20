import { TestBed } from '@angular/core/testing';

import { TemplateServiceService } from './template-service.service';

describe('TemplateServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TemplateServiceService = TestBed.get(TemplateServiceService);
    expect(service).toBeTruthy();
  });
});
