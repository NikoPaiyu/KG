import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { ListTemplatesComponent } from './list-templates/list-templates.component';


const routes: Routes = [
  {
    path: '',
    component: CreateTemplateComponent
  },
  {
    path: 'list',
    component: ListTemplatesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticeTemplateRoutingModule { }
