import { TestBed } from '@angular/core/testing';

import { BudgetSpeechService } from './budget-speech.service';

describe('BudgetSpeechService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BudgetSpeechService = TestBed.get(BudgetSpeechService);
    expect(service).toBeTruthy();
  });
});
