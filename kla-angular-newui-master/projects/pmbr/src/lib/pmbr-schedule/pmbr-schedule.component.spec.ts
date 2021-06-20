import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmbrScheduleComponent } from './pmbr-schedule.component';

describe('PmbrScheduleComponent', () => {
  let component: PmbrScheduleComponent;
  let fixture: ComponentFixture<PmbrScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmbrScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmbrScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
