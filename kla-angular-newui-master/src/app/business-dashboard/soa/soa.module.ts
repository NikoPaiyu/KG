import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoaRoutingModule } from './soa-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ScheduleOfActivityComponent } from './schedule-of-activity/schedule-of-activity.component';
import {
  NzBreadCrumbModule,
  NzDividerModule,
  NzTableModule,
  NzFormModule,
  NzDatePickerModule,
  NzSelectModule,
  NzButtonModule,
  NgZorroAntdModule
} from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SoaListComponent } from './soa-list/soa-list.component';
import { ApprovedSoaComponent } from './approved-soa/approved-soa.component';
import { SoaNotesComponent } from './shared/components/notes/notes.component';
import { FileFlowModule } from '../shared/file-flow/file-flow.module';


@NgModule({
  declarations: [ScheduleOfActivityComponent, SoaListComponent, ApprovedSoaComponent, SoaNotesComponent],
  imports: [
    CommonModule,TranslateModule,
    SoaRoutingModule,
    NzBreadCrumbModule,
    NzDividerModule,
    FormsModule,
    NzTableModule,
    NzFormModule,
    NzDatePickerModule,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NgZorroAntdModule,
    FileFlowModule
  ]
})
export class SoaModule { }
