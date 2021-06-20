import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleOfActivityComponent } from './schedule-of-activity.component';


const routes: Routes = [{path: "",
component: ScheduleOfActivityComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleOfActivityRoutingModule { }
