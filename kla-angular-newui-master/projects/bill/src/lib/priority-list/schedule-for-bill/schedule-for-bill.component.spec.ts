import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleForBillComponent } from './schedule-for-bill.component';

describe('ScheduleForBillComponent', () => {
  let component: ScheduleForBillComponent;
  let fixture: ComponentFixture<ScheduleForBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleForBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleForBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
