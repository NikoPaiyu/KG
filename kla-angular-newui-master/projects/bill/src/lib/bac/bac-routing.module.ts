import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddMemberComponent } from './components/add-member/add-member.component';


const routes: Routes = [
  {
    path: 'bac',
    component: AddMemberComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BacRoutingModule { }
