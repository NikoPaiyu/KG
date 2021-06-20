import { TestBed } from '@angular/core/testing';

import { CurrentSpeakernoteService } from './current-speakernote.service';

describe('CurrentSpeakernoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentSpeakernoteService = TestBed.get(CurrentSpeakernoteService);
    expect(service).toBeTruthy();
  });
});
