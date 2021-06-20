import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApBillComponent } from './ap-bill.component';


const routes: Routes = [
  {
    path: "",
    component: ApBillComponent,
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApBillRoutingModule { }
