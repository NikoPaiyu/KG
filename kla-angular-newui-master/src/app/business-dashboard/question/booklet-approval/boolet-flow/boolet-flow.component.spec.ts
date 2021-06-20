import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooletFlowComponent } from './boolet-flow.component';

describe('BooletFlowComponent', () => {
  let component: BooletFlowComponent;
  let fixture: ComponentFixture<BooletFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BooletFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooletFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
