import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingOfficeDocumentsComponent } from './pending-office-documents.component';

describe('PendingOfficeDocumentsComponent', () => {
  let component: PendingOfficeDocumentsComponent;
  let fixture: ComponentFixture<PendingOfficeDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingOfficeDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingOfficeDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
