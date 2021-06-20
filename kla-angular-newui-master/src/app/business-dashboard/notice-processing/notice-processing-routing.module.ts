import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoticeProcessingComponent } from './notice-processing.component';
import { NoticeDashboardComponent } from './notice-dashboard/notice-dashboard.component';
import { ListNoticeComponent } from './notice/list-notice/list-notice.component';


const routes: Routes = [
  {
    path: '',
    component: NoticeProcessingComponent,
    children: [
      {
        path: 'dashboard',
        component: NoticeDashboardComponent
      },
      {
        path: 'template',
        loadChildren: () => import('./notice-template/notice-template.module').then(x => x.NoticeTemplateModule)
      },
      {
        path: 'process/:id',
        loadChildren: () => import('./notice-process/notice-process.module').then( x => x.NoticeProcessModule)
      },
      {
        path: 'ab',
        loadChildren: () => import('./notice/notice.module').then( x => x.NoticeModule)
      },
      {
        path: 'ab/list/:status',
        loadChildren: () => import('./notice/notice.module').then( x => x.NoticeModule)
      },
      {
        path: 'staff',
        loadChildren: () => import('./staff/staff.module').then(x => x.StaffModule)
      },
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticeProcessingRoutingModule { }
