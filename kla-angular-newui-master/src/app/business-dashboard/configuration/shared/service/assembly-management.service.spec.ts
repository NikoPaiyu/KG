import { TestBed } from '@angular/core/testing';

import { AssemblyManagementService } from './assembly-management.service';

describe('AssemblyManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssemblyManagementService = TestBed.get(AssemblyManagementService);
    expect(service).toBeTruthy();
  });
});
