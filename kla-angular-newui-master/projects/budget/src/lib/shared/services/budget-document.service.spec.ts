import { TestBed } from '@angular/core/testing';

import { BudgetDocumentService } from './budget-document.service';

describe('BudgetDocumentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BudgetDocumentService = TestBed.get(BudgetDocumentService);
    expect(service).toBeTruthy();
  });
});
