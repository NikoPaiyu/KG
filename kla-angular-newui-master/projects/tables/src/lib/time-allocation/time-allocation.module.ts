import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from "ngx-quill";

import { TimeAllocationRoutingModule } from './time-allocation-routing.module';
import { TimeAllocationComponent } from './time-allocation.component';
import { PendingTimeAllocationBusinessComponent } from './pending-time-allocation-business/pending-time-allocation-business.component';
import { GenerateTimeAllocationComponent } from './generate-time-allocation/generate-time-allocation.component';
import { ViewTimeAllocationComponent } from './view-time-allocation/view-time-allocation.component';
import { AttachToFileModule } from '../shared/component/attach-to-file/attach-to-file.module';
import { MemberTimeAllocationComponent } from './member-time-allocation/member-time-allocation.component';
import { NestableModule } from 'ngx-nestable';


@NgModule({
  declarations: [TimeAllocationComponent, PendingTimeAllocationBusinessComponent, GenerateTimeAllocationComponent, ViewTimeAllocationComponent, MemberTimeAllocationComponent],
  imports: [
    CommonModule,
    TimeAllocationRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    AttachToFileModule,
    NestableModule
  ],
  exports:[GenerateTimeAllocationComponent,ViewTimeAllocationComponent,MemberTimeAllocationComponent]
})
export class TimeAllocationModule { }
