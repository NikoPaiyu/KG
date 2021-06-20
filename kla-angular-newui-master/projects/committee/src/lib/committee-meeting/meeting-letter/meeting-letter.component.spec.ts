import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingLetterComponent } from './meeting-letter.component';

describe('MeetingLetterComponent', () => {
  let component: MeetingLetterComponent;
  let fixture: ComponentFixture<MeetingLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
