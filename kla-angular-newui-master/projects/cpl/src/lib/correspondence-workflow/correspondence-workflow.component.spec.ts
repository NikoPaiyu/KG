import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondenceWorkflowComponent } from './correspondence-workflow.component';

describe('CorrespondenceWorkflowComponent', () => {
  let component: CorrespondenceWorkflowComponent;
  let fixture: ComponentFixture<CorrespondenceWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrespondenceWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondenceWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
