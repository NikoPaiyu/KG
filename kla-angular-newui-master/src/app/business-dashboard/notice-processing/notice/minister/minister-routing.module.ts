import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewConvenienceComponent } from './view-convenience/view-convenience.component';
import { ListConvenienceComponent } from './list-convenience/list-convenience.component';


const routes: Routes = [
  {
    path: 'list',
    component: ListConvenienceComponent ,
  },
  {
    path: 'view',
    component: ViewConvenienceComponent ,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinisterRoutingModule { }
