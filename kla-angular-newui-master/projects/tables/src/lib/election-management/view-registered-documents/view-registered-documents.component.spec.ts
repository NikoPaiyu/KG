import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRegisteredDocumentsComponent } from './view-registered-documents.component';

describe('ViewRegisteredDocumentsComponent', () => {
  let component: ViewRegisteredDocumentsComponent;
  let fixture: ComponentFixture<ViewRegisteredDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRegisteredDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRegisteredDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
