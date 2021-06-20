import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdinanceDisapprovalComponent } from './ordinance-disapproval/ordinance-disapproval.component';
import { ResponsesComponent} from './responses.component'
import { BillResponseslistComponent } from './bill-responseslist/bill-responseslist.component';


const routes: Routes = [
  {
    path: "",
    component: ResponsesComponent,
    children: [
      {
        path: "",
        redirectTo: "bill-responses",
      },
      {
        path: "ordinance-disapp",
        component:OrdinanceDisapprovalComponent,
      },
      {
        path: "bill-responses",
        component:BillResponseslistComponent,
      },
     
     
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsesRoutingModule { }
