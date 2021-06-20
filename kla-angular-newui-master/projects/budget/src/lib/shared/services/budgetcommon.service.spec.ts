import { TestBed } from '@angular/core/testing';

import { BudgetCommonService } from './budgetcommon.service';

describe('BudgetCommonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BudgetCommonService = TestBed.get(BudgetCommonService);
    expect(service).toBeTruthy();
  });
});
