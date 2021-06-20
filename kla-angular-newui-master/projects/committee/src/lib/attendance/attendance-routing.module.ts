import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceComponent } from './attendance.component';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';

const routes: Routes = [

  {
    path: '', component: AttendanceComponent,
    children: [
      {
        path: "",
        redirectTo: "list-attendance",
      },
      {
        path: 'list-attendance',
        component: AttendanceListComponent,
      }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
