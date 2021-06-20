import { TestBed } from '@angular/core/testing';

import { DocsManagementService } from './docs-management.service';

describe('DocsManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocsManagementService = TestBed.get(DocsManagementService);
    expect(service).toBeTruthy();
  });
});
