import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CurrentBusinessComponent } from "./current-business.component";
import { LiveScreenComponent } from "./live-screen/live-screen.component";

const routes: Routes = [
  {
    path: "",
    component: CurrentBusinessComponent,
    children: [
      {
        path: "live-screen",
        component: LiveScreenComponent
      },
      { path: "", redirectTo: "live-screen", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrentBusinessRoutingModule {}
