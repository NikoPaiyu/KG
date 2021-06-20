import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleOfActivityComponent } from './schedule-of-activity.component';

describe('ScheduleOfActivityComponent', () => {
  let component: ScheduleOfActivityComponent;
  let fixture: ComponentFixture<ScheduleOfActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleOfActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleOfActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
