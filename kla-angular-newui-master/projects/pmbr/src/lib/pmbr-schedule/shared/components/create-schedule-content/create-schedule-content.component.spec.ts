import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScheduleContentComponent } from './create-schedule-content.component';

describe('CreateScheduleContentComponent', () => {
  let component: CreateScheduleContentComponent;
  let fixture: ComponentFixture<CreateScheduleContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateScheduleContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateScheduleContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
