import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssuranceComponent } from './assurance.component';
import { CreateAssuranceComponent } from './create-assurance/create-assurance.component';
import { ListAssuranceComponent } from './list-assurance/list-assurance.component';


const routes: Routes = [
  {
    path: '',
    component: AssuranceComponent,
    children: [
      {
        path: 'list-assurance',
        component: ListAssuranceComponent
      },
      {
        path: 'create-assurance',
        component: CreateAssuranceComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssuranceRoutingModule { }
