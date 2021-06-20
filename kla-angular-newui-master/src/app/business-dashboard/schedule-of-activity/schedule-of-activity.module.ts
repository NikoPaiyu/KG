import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleOfActivityRoutingModule } from './schedule-of-activity-routing.module';
import { ScheduleOfActivityComponent } from './schedule-of-activity.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [ScheduleOfActivityComponent],
  imports: [
    CommonModule,
    ScheduleOfActivityRoutingModule,
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
    NzGridModule,
    NzDatePickerModule,
    NzFormModule ,
    FormsModule,
    NzBreadCrumbModule,
    ReactiveFormsModule,TranslateModule
  ]
})
export class ScheduleOfActivityModule { }
