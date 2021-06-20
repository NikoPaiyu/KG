import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillRegisterComponent } from './bill-register.component';
import { BillRegisterListComponent } from './bill-register-list/bill-register-list.component';
import { CreateBillRegisterComponent } from './create-bill-register/create-bill-register.component';

const routes: Routes = [
  {
    path: "",
    component: BillRegisterComponent,
    children: [
      {
        path: "",
        redirectTo: "bill-register-list",
      },
      {
        path: "bill-register-list",
        component: BillRegisterListComponent,
      },
      {
        path: "bill-register-add",
        component: CreateBillRegisterComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRegisterRoutingModule { }
