import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";

import { CalenderOfSittingRoutingModule } from "./calender-of-sitting-routing.module";
import { CalenderOfSittingComponent } from "./calender-of-sitting.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ViewCalenderComponent } from "./view-calender/view-calender.component";
import { AddCalenderComponent } from "./add-calender/add-calender.component";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import {FileTrackingComponent} from "./file-tracking/file-tracking.component";
import { QuillModule } from "ngx-quill";

import { TranslateModule } from '@ngx-translate/core';
import * as Quill from 'quill';
import { CosListComponent } from './cos-list/cos-list.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import { ApprovedCosComponent } from './approved-cos/approved-cos.component';
@NgModule({
  providers: [DatePipe],
  declarations: [
    CalenderOfSittingComponent,
    ViewCalenderComponent,
    AddCalenderComponent,
    FileTrackingComponent,
    CosListComponent,
    ApprovedCosComponent
  ],
  imports: [
    CommonModule,TranslateModule,
    CalenderOfSittingRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar:
          [['bold', 'italic', 'underline', 'strike'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }],
          [{ 'direction': 'rtl' }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
         ]
      }
    }),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger"
    })
  ]
})
export class CalenderOfSittingModule {}
