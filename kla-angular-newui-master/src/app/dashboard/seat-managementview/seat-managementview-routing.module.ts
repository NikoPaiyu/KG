import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SeatLayoutComponent } from "./seat-layout/seat-layout.component";

const routes: Routes = [
  { path: "", redirectTo: "layout", pathMatch: "full" },
  { path: "layout", component: SeatLayoutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatManagementRoutingModule {}
