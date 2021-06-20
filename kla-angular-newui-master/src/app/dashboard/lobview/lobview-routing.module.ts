import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LobviewComponent } from "./lobview.component";
import { ViewComponent } from "./view/view.component";

const routes: Routes = [
  {
    path: "",
    component: LobviewComponent,
    children: [
      { path: "view", component: ViewComponent },
      { path: "", redirectTo: "view" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LobviewRoutingModule {}
