import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SpeakerNoteHandlingComponent } from "./speaker-note-handling.component";

const routes: Routes = [
  {
    path: "",
    component: SpeakerNoteHandlingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpeakerNoteHandlingRoutingModule {}
