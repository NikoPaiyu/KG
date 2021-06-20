import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CutMotionRoutingModule } from './cut-motion-routing.module';
import { CutMotionComponent } from './cut-motion.component';
import { PrepareBitListComponent } from './bit-list/prepare-bit-list/prepare-bit-list.component';
import { bitListReportComponent } from './bit-list/bit-list-report/bit-list-report.component';
import { ListAllComponent } from './bit-list/list-all/list-all.component';
import { LobFilesPreviewComponent } from './bit-list/lob-files-preview/lob-files-preview.component';

import { ApprovedListComponent } from './approved-list/approved-list.component';
import { ListCutMotionComponent } from './list-cut-motion/list-cut-motion.component';
import { ViewCutMotionComponent } from './view-cut-motion/view-cut-motion.component';
import { StmtDemandsGrantsModule } from '../stmt-demands-grants/stmt-demands-grants.module';
import { QuillModule } from 'ngx-quill';
import { NgxDocViewerModule } from "ngx-doc-viewer";


let Components = [CutMotionComponent, ListCutMotionComponent, ViewCutMotionComponent, PrepareBitListComponent, ApprovedListComponent, bitListReportComponent, ListAllComponent, LobFilesPreviewComponent]
@NgModule({
  declarations: [...Components],
  imports: [
    NgZorroAntdModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CutMotionRoutingModule,
    StmtDemandsGrantsModule,
    NgxDocViewerModule,
    QuillModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ListCutMotionComponent, PrepareBitListComponent, LobFilesPreviewComponent]
})
export class CutMotionModule { }
