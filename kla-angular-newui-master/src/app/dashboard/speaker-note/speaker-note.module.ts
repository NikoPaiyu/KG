import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SpeakerNoteRoutingModule } from "./speaker-note-routing.module";
import { SpeakerNoteComponent } from "./speaker-note.component";

@NgModule({
  declarations: [SpeakerNoteComponent],
  imports: [CommonModule, SpeakerNoteRoutingModule]
})
export class SpeakerNoteModule {}
