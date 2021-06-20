import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMinuteComponent } from './view-minute.component';

describe('ViewMinuteComponent', () => {
  let component: ViewMinuteComponent;
  let fixture: ComponentFixture<ViewMinuteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMinuteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMinuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
