import { TestBed } from '@angular/core/testing';

import { BlockSuggestService } from './block-suggest.service';

describe('BlockSuggestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlockSuggestService = TestBed.get(BlockSuggestService);
    expect(service).toBeTruthy();
  });
});
