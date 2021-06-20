import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HelpComponent } from "./help.component";
import { HelpDetailsComponent } from "./help-details/help-details.component";

const routes: Routes = [
  {
    path: "",
    component: HelpComponent,
    children: [
      { path: "", redirectTo: "details" },
      { path: "details", component: HelpDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRoutingModule {}
