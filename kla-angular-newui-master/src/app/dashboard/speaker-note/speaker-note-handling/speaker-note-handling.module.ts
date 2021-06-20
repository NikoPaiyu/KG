import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpeakerNoteHandlingRoutingModule } from './speaker-note-handling-routing.module';
import { SpeakerNoteHandlingComponent } from './speaker-note-handling.component';


@NgModule({
  declarations: [SpeakerNoteHandlingComponent],
  imports: [
    CommonModule,
    SpeakerNoteHandlingRoutingModule
  ]
})
export class SpeakerNoteHandlingModule { }
