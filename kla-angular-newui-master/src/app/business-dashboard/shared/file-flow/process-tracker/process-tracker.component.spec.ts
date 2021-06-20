import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTrackerComponent } from './process-tracker.component';

describe('ProcessTrackerComponent', () => {
  let component: ProcessTrackerComponent;
  let fixture: ComponentFixture<ProcessTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
