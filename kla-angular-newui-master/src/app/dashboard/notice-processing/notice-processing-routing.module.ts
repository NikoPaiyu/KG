import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoticeProcessingComponent } from './notice-processing.component';


const routes: Routes = [
  {
    path: '',
    component: NoticeProcessingComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./notice/notice.module').then(x => x.NoticeModule)
      },
      {
        path: 'template',
        loadChildren: () => import('./notice-template/notice-template.module').then(x => x.NoticeTemplateModule)
      },
      {
        path: 'process',
        loadChildren: () => import('./notice-process/notice-process.module').then(x => x.NoticeProcessModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticeProcessingRoutingModule { }
