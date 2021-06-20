import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerNoteViewComponent } from './speaker-note-view.component';

describe('SpeakerNoteViewComponent', () => {
  let component: SpeakerNoteViewComponent;
  let fixture: ComponentFixture<SpeakerNoteViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeakerNoteViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerNoteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
