import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileViewResumeComponent } from './file-view-resume.component';

describe('FileViewResumeComponent', () => {
  let component: FileViewResumeComponent;
  let fixture: ComponentFixture<FileViewResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileViewResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileViewResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
