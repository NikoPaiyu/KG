import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeatPlanListComponent } from './seat-plan-list.component';


const routes: Routes = [
  { path: "", redirectTo: "seat-list", pathMatch: "full" },
  { path: "seat-list", component: SeatPlanListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatPlanListRoutingModule { }
