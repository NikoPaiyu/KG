import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BudgetComponent } from "./budget.component";
import { BudgetfolderComponent } from "./budgetfolder/budgetfolder.component";
const routes: Routes = [
  {
    path: "",
    component: BudgetComponent
  },
  {
    path: ":folder",
    component: BudgetfolderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
