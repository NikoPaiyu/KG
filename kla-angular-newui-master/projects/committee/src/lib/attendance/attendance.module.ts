import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance.component';


import { AttendanceListComponent } from './attendance-list/attendance-list.component';

const Components = [AttendanceComponent, AttendanceListComponent];

@NgModule({ 
  declarations: [...Components],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    AttendanceRoutingModule
  ],
  exports: [],
})
export class AttendanceModule {}
