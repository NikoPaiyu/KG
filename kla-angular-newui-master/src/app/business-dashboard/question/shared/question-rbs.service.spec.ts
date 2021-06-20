import { TestBed } from '@angular/core/testing';

import { QuestionRBSService } from './question-rbs.service';

describe('QuestionRBSService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  
  it('should be created', () => {
    const service: QuestionRBSService = TestBed.get(QuestionRBSService);
    expect(service).toBeTruthy();
  });
});
