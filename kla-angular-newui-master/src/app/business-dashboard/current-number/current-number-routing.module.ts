import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentNumberListComponent } from './current-number-list/current-number-list.component';
import { CurrentNumberComponent } from './current-number.component';


const routes: Routes = [
  {
    path: "",
    component: CurrentNumberComponent
  },
  {
    path: 'list',
    component: CurrentNumberListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrentNumberRoutingModule { }
