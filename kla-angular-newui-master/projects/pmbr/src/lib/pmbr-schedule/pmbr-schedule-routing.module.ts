import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateScheduleComponent } from './create-schedule/create-schedule.component';
import { ListScheduleComponent } from './list-schedule/list-schedule.component';
import { PmbrScheduleComponent } from './pmbr-schedule.component';


const routes: Routes = [
  {
    path: '',
    component: PmbrScheduleComponent,
    children: [{
      path: 'create-schedule',
      component: CreateScheduleComponent
    },
    {
      path: 'create-schedule/:purpose/:id',
      component: CreateScheduleComponent
    },
    {
      path: 'schedule-list',
      component: ListScheduleComponent
    }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmbrScheduleRoutingModule { }
