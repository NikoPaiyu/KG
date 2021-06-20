import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillResponsesComponent } from './bill-responses.component';


const routes: Routes = [
  { path: '', component:  BillResponsesComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillResponsesRoutingModule { }
