import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SeatLayoutComponent } from "./seat-layout/seat-layout.component";
import { SectionSeatConfrigurationComponent } from './section-seat-confriguration/section-seat-confriguration.component';


const routes: Routes = [
  { path: "", redirectTo: "seat-layout", pathMatch: "full" },
  { path: "seat-layout", component: SeatLayoutComponent },
  { path: "section-seat", component: SectionSeatConfrigurationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatManagementRoutingModule {}
