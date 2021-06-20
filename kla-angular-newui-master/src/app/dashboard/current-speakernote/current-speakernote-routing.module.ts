import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CurrentSpeakernoteComponent } from "./current-speakernote.component";
import { LiveSpeakernoteComponent } from "./live-speakernote/live-speakernote.component";

const routes: Routes = [
  {
    path: "",
    component: CurrentSpeakernoteComponent,
    children: [
      {
        path: "live",
        component: LiveSpeakernoteComponent
      },
      { path: "", redirectTo: "live", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrentSpeakernoteRoutingModule {}
