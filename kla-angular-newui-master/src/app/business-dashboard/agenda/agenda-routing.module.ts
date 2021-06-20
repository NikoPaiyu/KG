import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AgendaComponent } from "./agenda.component";
import { AgendaListingComponent } from "./agenda-listing/agenda-listing.component";
import { AgendaCreateComponent } from "./agenda-create/agenda-create.component";

const routes: Routes = [
  {
    path: "",
    component: AgendaComponent,
    children: [
      { path: "", redirectTo: "listing", pathMatch: "full" },
      { path: "listing", component: AgendaListingComponent },
      { path: "create", component: AgendaCreateComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaRoutingModule {}
