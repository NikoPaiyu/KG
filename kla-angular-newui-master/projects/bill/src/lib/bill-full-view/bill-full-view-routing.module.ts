import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { BillFullViewComponent } from './bill-full-view.component';
import { BillViewComponent } from './bill-view/bill-view.component';
import { BillContentComponent } from './bill-content/bill-content.component';
import { EratumViewComponent } from './eratum-view/eratum-view.component';
import { RegisteredBillViewComponent } from './registered-bill-view/registered-bill-view.component';
import { ClauseByClauseAmendmentsComponent } from '../bill-amendments/clause-by-clause-amendments/clause-by-clause-amendments.component';

const routes: Routes = [
  {
    path: '',
    component: BillFullViewComponent,

    children: [
      {
        path: "",
        redirectTo: "",
      },
      {
        path: "bill-view/:id",
        component: BillViewComponent,
      },
      {
        path: 'registered-bill-view/:id/:type',
        component: RegisteredBillViewComponent,
      },
      {
        path: "bill-content",
        component: BillContentComponent,
      },
      {
        path: "eratum-view",
        component: EratumViewComponent,
      },
      {
        path: "clause-by-clause/:id",
        component: ClauseByClauseAmendmentsComponent,
      },

    ]
  }

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillFullViewRoutingModule { }
