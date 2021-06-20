import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderOfSittingComponent } from './calender-of-sitting.component';

describe('CalenderOfSittingComponent', () => {
  let component: CalenderOfSittingComponent;
  let fixture: ComponentFixture<CalenderOfSittingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalenderOfSittingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalenderOfSittingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
