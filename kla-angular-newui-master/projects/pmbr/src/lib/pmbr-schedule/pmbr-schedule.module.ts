import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmbrScheduleRoutingModule } from './pmbr-schedule-routing.module';
import { CreateScheduleComponent } from './create-schedule/create-schedule.component';
import { PmbrScheduleComponent } from './pmbr-schedule.component';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from "@ngx-translate/core";
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { ListScheduleComponent } from './list-schedule/list-schedule.component';
import { CreateScheduleContentComponent } from './shared/components/create-schedule-content/create-schedule-content.component';
import { CreateBullettinFormComponent } from './shared/components/create-bullettin-form/create-bullettin-form.component';
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { BulletinContentViewModule } from '../bulletin/bulletin-content-view/bulletin-content-view.module';

@NgModule({
  declarations: [CreateScheduleComponent, PmbrScheduleComponent, ListScheduleComponent, CreateScheduleContentComponent, CreateBullettinFormComponent],
  imports: [
    CommonModule,
    PmbrScheduleRoutingModule,
    NgZorroAntdModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    TranslateModule,
    NzSwitchModule,
    PdfJsViewerModule,
    BulletinContentViewModule
  ],
  exports: [CreateBullettinFormComponent]
})
export class PmbrScheduleModule { }
