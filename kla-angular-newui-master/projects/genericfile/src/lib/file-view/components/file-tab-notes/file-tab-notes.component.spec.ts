import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTabNotesComponent } from './file-tab-notes.component';

describe('FileTabNotesComponent', () => {
  let component: FileTabNotesComponent;
  let fixture: ComponentFixture<FileTabNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileTabNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTabNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
