import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateComponent } from "./create/create.component";
import { ListingComponent } from "./listing/listing.component";

const routes: Routes = [
  { path: "create", component: CreateComponent },
  { path: "listing", component: ListingComponent },
  { path: "", redirectTo: "listing", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RunningNoteRoutingModule {}
