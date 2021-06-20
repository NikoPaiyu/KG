import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPreparationComponent } from './document-preparation.component';

describe('DocumentPreparationComponent', () => {
  let component: DocumentPreparationComponent;
  let fixture: ComponentFixture<DocumentPreparationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentPreparationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
