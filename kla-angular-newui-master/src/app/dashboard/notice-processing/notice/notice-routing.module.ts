import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectNoticeTypeComponent } from './select-notice-type/select-notice-type.component';
import { CreateNoticeComponent } from './create-notice/create-notice.component';
import { ListNoticeComponent } from './list-notice/list-notice.component';


const routes: Routes = [
  {
    path: '',
    component: SelectNoticeTypeComponent
  },
  {
    path: 'create',
    component: CreateNoticeComponent
  },
  {
    path: 'list',
    component: ListNoticeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticeRoutingModule { }
