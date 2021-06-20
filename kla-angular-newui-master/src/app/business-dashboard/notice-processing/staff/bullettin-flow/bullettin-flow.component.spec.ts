import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BullettinFlowComponent } from './bullettin-flow.component';

describe('BullettinFlowComponent', () => {
  let component: BullettinFlowComponent;
  let fixture: ComponentFixture<BullettinFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BullettinFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BullettinFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
