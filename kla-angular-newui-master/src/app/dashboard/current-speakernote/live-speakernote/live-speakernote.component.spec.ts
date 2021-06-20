import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSpeakernoteComponent } from './live-speakernote.component';

describe('LiveSpeakernoteComponent', () => {
  let component: LiveSpeakernoteComponent;
  let fixture: ComponentFixture<LiveSpeakernoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveSpeakernoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveSpeakernoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
