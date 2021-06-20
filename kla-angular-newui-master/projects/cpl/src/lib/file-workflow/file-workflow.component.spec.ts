import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileWorkflowComponent } from './file-workflow.component';

describe('FileWorkflowComponent', () => {
  let component: FileWorkflowComponent;
  let fixture: ComponentFixture<FileWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
