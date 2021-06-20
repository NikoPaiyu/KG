import { TestBed } from '@angular/core/testing';

import { DocumentServiceService } from './document-service.service';

describe('DocumentServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentServiceService = TestBed.get(DocumentServiceService);
    expect(service).toBeTruthy();
  });
});
