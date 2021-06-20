import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingChooseComponent } from './meeting-choose.component';

describe('MeetingChooseComponent', () => {
  let component: MeetingChooseComponent;
  let fixture: ComponentFixture<MeetingChooseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingChooseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingChooseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
