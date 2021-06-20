import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DemandDraftScheduleRoutingModule } from './demand-draft-schedule-routing.module';
import { DemandDraftScheduleComponent } from './demand-draft-schedule.component';
import { DDSListComponent } from './dds-list/dds-list.component';
import { DdsCreateComponent } from './dds-create/dds-create.component';
import { DdsSuggetionComponent } from './dds-suggetion/dds-suggetion.component';
import { DdsVersionComponent } from './dds-version/dds-version.component';
import { DdsHeadsGulletinComponent } from './dds-heads-gulletin/dds-heads-gulletin.component';
import { DdsPreviewComponent } from './dds-preview/dds-preview.component';
import { ScheduleReportComponent } from './schedule-report/schedule-report.component';
import { SdgDdsCreateCreateComponent } from './sdg-dds-create/sdg-dds-create.component';

let Components = [DemandDraftScheduleComponent, DDSListComponent, DdsCreateComponent, DdsSuggetionComponent, DdsVersionComponent, DdsHeadsGulletinComponent, DdsPreviewComponent, ScheduleReportComponent, SdgDdsCreateCreateComponent]

@NgModule({
  declarations: [...Components],
  imports: [
    DemandDraftScheduleRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    CommonModule,
    FormsModule,
  ],
  exports: [SdgDdsCreateCreateComponent, DdsCreateComponent, DdsHeadsGulletinComponent, DdsPreviewComponent, ScheduleReportComponent],
})
export class DemandDraftScheduleModule { }
