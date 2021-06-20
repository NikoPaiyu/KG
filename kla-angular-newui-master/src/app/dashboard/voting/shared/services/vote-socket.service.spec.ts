import { TestBed } from '@angular/core/testing';

import { VoteSocketService } from './vote-socket.service';

describe('VoteSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VoteSocketService = TestBed.get(VoteSocketService);
    expect(service).toBeTruthy();
  });
});
