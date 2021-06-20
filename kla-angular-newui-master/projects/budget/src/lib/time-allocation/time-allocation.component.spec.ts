import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeAllocationComponent } from './time-allocation.component';

describe('TimeAllocationComponent', () => {
  let component: TimeAllocationComponent;
  let fixture: ComponentFixture<TimeAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
