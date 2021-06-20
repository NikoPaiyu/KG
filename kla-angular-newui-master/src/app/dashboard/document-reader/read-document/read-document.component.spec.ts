import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadDocumentComponent } from './read-document.component';

describe('ReadDocumentComponent', () => {
  let component: ReadDocumentComponent;
  let fixture: ComponentFixture<ReadDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
