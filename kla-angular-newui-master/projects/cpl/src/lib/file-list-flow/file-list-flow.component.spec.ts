import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileListFlowComponent } from './file-list-flow.component';

describe('FileListFlowComponent', () => {
  let component: FileListFlowComponent;
  let fixture: ComponentFixture<FileListFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileListFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileListFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
