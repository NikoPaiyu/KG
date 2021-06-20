import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListBookletComponent } from './list-booklet/list-booklet.component';
import { BooletFlowComponent } from './boolet-flow/boolet-flow.component';


const routes: Routes = [
  {
    path: '',
    component: ListBookletComponent
  },
  {
    path: 'view/:id',
    component: BooletFlowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookletApprovalRoutingModule { }
