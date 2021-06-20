import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatPlanListComponent } from './seat-plan-list.component';

describe('SeatPlanListComponent', () => {
  let component: SeatPlanListComponent;
  let fixture: ComponentFixture<SeatPlanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatPlanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
