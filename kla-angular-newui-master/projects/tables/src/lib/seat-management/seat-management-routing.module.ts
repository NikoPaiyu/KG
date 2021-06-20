import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SeatLayoutComponent } from "./seat-layout/seat-layout.component";

const routes: Routes = [
  { path: "", redirectTo: "seat-layout/:id", pathMatch: "full" },
  { path: "seat-layout/:id", component: SeatLayoutComponent },
  { path: "seat-layout/:purpose/:id", component: SeatLayoutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatManagementRoutingModule {}
