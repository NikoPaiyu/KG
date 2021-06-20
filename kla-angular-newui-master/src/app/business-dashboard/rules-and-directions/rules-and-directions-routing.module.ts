import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RulesAndDirectionsComponent } from './rules-and-directions.component';
import { RulesComponent } from './rules/rules.component';
import { DirectionsComponent } from './directions/directions.component';


const routes: Routes = [
  {
    path: "",
    component: RulesAndDirectionsComponent,
    children: [
      {path: "", redirectTo: "rules"},
      {path: "rules", component: RulesComponent},
      {path: "directions", component: DirectionsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RulesAndDirectionsRoutingModule { }
