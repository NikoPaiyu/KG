import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileWorkflowActionsComponent } from './file-workflow-actions.component';

describe('FileWorkflowActionsComponent', () => {
  let component: FileWorkflowActionsComponent;
  let fixture: ComponentFixture<FileWorkflowActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileWorkflowActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileWorkflowActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
