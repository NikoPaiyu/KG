import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobWorkflowComponent } from './lob-workflow.component';

describe('LobWorkflowComponent', () => {
  let component: LobWorkflowComponent;
  let fixture: ComponentFixture<LobWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
