import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerNoteHandlingComponent } from './speaker-note-handling.component';

describe('SpeakerNoteHandlingComponent', () => {
  let component: SpeakerNoteHandlingComponent;
  let fixture: ComponentFixture<SpeakerNoteHandlingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeakerNoteHandlingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerNoteHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
