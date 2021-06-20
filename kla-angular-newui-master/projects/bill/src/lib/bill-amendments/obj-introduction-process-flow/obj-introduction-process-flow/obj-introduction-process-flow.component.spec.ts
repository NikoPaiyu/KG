import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjIntroductionProcessFlowComponent } from './obj-introduction-process-flow.component';

describe('ObjIntroductionProcessFlowComponent', () => {
  let component: ObjIntroductionProcessFlowComponent;
  let fixture: ComponentFixture<ObjIntroductionProcessFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjIntroductionProcessFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjIntroductionProcessFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
