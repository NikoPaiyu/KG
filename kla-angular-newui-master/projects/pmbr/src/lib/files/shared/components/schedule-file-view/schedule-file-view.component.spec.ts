import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleFileViewComponent } from './schedule-file-view.component';

describe('ScheduleFileViewComponent', () => {
  let component: ScheduleFileViewComponent;
  let fixture: ComponentFixture<ScheduleFileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleFileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
