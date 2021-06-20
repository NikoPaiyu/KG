import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SpeakerNoteComponent } from "./speaker-note.component";

const routes: Routes = [
  {
    path: "",
    component: SpeakerNoteComponent,
    children: [
      {
        path: "handling",
        loadChildren: () =>
          import("./speaker-note-handling/speaker-note-handling.module").then(
            s => s.SpeakerNoteHandlingModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpeakerNoteRoutingModule {}
