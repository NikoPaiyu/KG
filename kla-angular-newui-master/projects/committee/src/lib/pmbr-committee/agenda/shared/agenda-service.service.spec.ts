import { TestBed } from '@angular/core/testing';

import { AgendaServiceService } from './agenda-service.service';

describe('AgendaServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgendaServiceService = TestBed.get(AgendaServiceService);
    expect(service).toBeTruthy();
  });
});
