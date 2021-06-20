import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberAttendanceComponent } from './member-attendance/member-attendance.component';


const routes: Routes = [{ path: "", redirectTo: "member-attendance", pathMatch: "full" },
{ path: "member-attendance", component: MemberAttendanceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceManagementRoutingModule { }
