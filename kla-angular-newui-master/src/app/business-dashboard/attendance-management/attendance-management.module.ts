import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceManagementRoutingModule } from './attendance-management-routing.module';
import { MemberAttendanceComponent } from './member-attendance/member-attendance.component';


@NgModule({
  declarations: [MemberAttendanceComponent],
  imports: [
    CommonModule,
    AttendanceManagementRoutingModule
  ]
})
export class AttendanceManagementModule { }
