import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillContentComponent } from './bill-content/bill-content.component';
import { BillFullViewComponent } from './bill-full-view.component';
import { BillViewComponent } from './bill-view/bill-view.component';


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
        path: "bill-content",
        component: BillContentComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillFullViewRoutingModule { }
