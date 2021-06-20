import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RunningnoteviewComponent } from "./runningnoteview.component";
import { RnviewComponent } from "./rnview/rnview.component";

const routes: Routes = [
  {
    path: "",
    component: RunningnoteviewComponent,
    children: [
      { path: "view", component: RnviewComponent },
      { path: "", redirectTo: "view" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RunningnoteviewRoutingModule {}
