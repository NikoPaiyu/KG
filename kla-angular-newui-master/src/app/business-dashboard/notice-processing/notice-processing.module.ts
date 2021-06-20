import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticeProcessingRoutingModule } from './notice-processing-routing.module';
import { NoticeProcessingComponent } from './notice-processing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule, NzDatePickerModule } from 'ng-zorro-antd';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NoticeDashboardComponent } from './notice-dashboard/notice-dashboard.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TranslateModule } from '@ngx-translate/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [
    NoticeProcessingComponent,
    NoticeDashboardComponent
  ],
  imports: [
    CommonModule,
    NoticeProcessingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NzTabsModule,
    NzDatePickerModule,
    NzBreadCrumbModule,
    TranslateModule,
    NzCardModule,
    NzIconModule,
    NgxDocViewerModule
  ]
})
export class NoticeProcessingModule { }
