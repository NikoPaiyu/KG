import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleOfBillListComponent } from './schedule-of-bill-list.component';

describe('ScheduleOfBillListComponent', () => {
  let component: ScheduleOfBillListComponent;
  let fixture: ComponentFixture<ScheduleOfBillListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleOfBillListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleOfBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
