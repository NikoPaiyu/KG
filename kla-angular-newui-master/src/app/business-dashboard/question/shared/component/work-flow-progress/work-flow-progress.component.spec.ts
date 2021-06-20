import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowProgressComponent } from './work-flow-progress.component';

describe('WorkFlowProgressComponent', () => {
  let component: WorkFlowProgressComponent;
  let fixture: ComponentFixture<WorkFlowProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkFlowProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFlowProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
