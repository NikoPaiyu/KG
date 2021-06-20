import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriorityListComponent } from './priority-list.component';
import { ListPriorityListComponent } from './list-priority-list/list-priority-list.component';
import { CreatePriorityListComponent } from './create-priority-list/create-priority-list.component';
import { InitialDaysComponent } from './initial-days/initial-days.component';
import { ScheduleForBillComponent } from './schedule-for-bill/schedule-for-bill.component';
import { ScheduleOfBillListComponent } from './schedule-of-bill-list/schedule-of-bill-list.component';


const routes: Routes = [
  {
    path: "",
    component: PriorityListComponent,
    children: [

      {
        path: "list-priority-list",
        component: ListPriorityListComponent,
      },
      {
        path: "create-priority-list",
        component: CreatePriorityListComponent,
      },
      {
        path: "view-priority-list/:id",
        component: CreatePriorityListComponent,
      },
      {
        path: "view-priority-list/:id/:requestId",
        component: CreatePriorityListComponent,
      },
      {
        path: 'initial-days/:id',
        component: InitialDaysComponent,
      },
      {
        path: 'schedule-for-bill/:id',
        component: ScheduleForBillComponent,
      },
      {
        path: 'schedule-for-bill-list',
        component: ScheduleOfBillListComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriorityListRoutingModule { }
