import { TestBed } from '@angular/core/testing';

import { TablediaryService } from './tablediary.service';

describe('TablediaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TablediaryService = TestBed.get(TablediaryService);
    expect(service).toBeTruthy();
  });
});
