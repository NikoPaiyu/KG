import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleOfActivityComponent } from './schedule-of-activity/schedule-of-activity.component';
import { SoaListComponent } from './soa-list/soa-list.component';
import { ApprovedSoaComponent } from './approved-soa/approved-soa.component';


const routes: Routes = [
  {
    path: 'view',
    component: ScheduleOfActivityComponent
  },
  {
    path: 'list',
    component: SoaListComponent
  },
  {
    path: 'approved',
    component: ApprovedSoaComponent
  },
  {
    path: 'view/:id',
    component: ScheduleOfActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoaRoutingModule { }
