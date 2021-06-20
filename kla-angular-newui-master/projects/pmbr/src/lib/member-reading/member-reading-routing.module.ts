import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberReadingListComponent } from './member-reading-list/member-reading-list.component';
import { MemberReadingViewComponent } from './member-reading-view/member-reading-view.component';
import { MemberReadingComponent } from './member-reading/member-reading.component';


const routes: Routes = [
  {
    path: '',
    component: MemberReadingComponent,
    children: [
      {
        path: 'member-list',
        component: MemberReadingListComponent
      },
      {
        path: 'member-reading-view/:id',
        component: MemberReadingViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberReadingRoutingModule { }
