import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BudgetDocumentComponent } from './budget-document.component';
import { ListBudgetDocLetterComponent } from './budget-grl/list-budget-doc-letter/list-budget-doc-letter.component';
import { BudgetMainComponent } from './budget-main/budget-main.component';
const routes: Routes = [
  {
    path: "",
    component: BudgetDocumentComponent,
    children: [
      {
        path: "approved-list-GRL",
        component: ListBudgetDocLetterComponent
      },
      {
        path: "budget-main",
        component: BudgetMainComponent
      },
      {
        path: "approved-list",
        component: BudgetMainComponent
      }

    ],
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetDocumentRoutingModule { }
