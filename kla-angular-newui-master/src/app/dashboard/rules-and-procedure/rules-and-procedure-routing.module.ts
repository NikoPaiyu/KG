import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RulesAndProcedureComponent } from "./rules-and-procedure.component";

const routes: Routes = [
  {
    path: "",
    component: RulesAndProcedureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RulesAndProcedureRoutingModule {}
