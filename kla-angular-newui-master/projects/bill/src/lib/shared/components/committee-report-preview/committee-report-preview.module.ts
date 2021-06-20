import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommitteeReportPreviewComponent } from './committee-report-preview.component';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [CommitteeReportPreviewComponent],
  imports: [
   CommonModule,NgZorroAntdModule,TranslateModule,FormsModule,ReactiveFormsModule,

  ],
  exports:[CommitteeReportPreviewComponent],
})
export class CommitteeReportPreviewModule { }
