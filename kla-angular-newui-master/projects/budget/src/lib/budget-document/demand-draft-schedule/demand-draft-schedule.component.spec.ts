import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandDraftScheduleComponent } from './demand-draft-schedule.component';

describe('DemandDraftScheduleComponent', () => {
  let component: DemandDraftScheduleComponent;
  let fixture: ComponentFixture<DemandDraftScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandDraftScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandDraftScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
