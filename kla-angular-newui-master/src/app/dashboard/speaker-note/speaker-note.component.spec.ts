import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerNoteComponent } from './speaker-note.component';

describe('SpeakerNoteComponent', () => {
  let component: SpeakerNoteComponent;
  let fixture: ComponentFixture<SpeakerNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeakerNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
