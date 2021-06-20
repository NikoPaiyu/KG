import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoticeProcessComponent } from './notice-process.component';


const routes: Routes = [
  {
    path: '',
    component: NoticeProcessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticeProcessRoutingModule { }
