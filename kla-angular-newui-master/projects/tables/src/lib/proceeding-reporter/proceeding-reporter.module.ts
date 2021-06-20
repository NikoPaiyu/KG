import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProceedingReporterRoutingModule } from './proceeding-reporter-routing.module';
import { ProceedingReporterComponent } from './proceeding-reporter.component';
import { CreateReporterDiaryComponent } from './create-reporter-diary/create-reporter-diary.component';
import { ListReporterDiaryComponent } from './list-reporter-diary/list-reporter-diary.component';
import { ListProceedingDiaryComponent } from './list-proceeding-diary/list-proceeding-diary.component';
import { CreateProceedingDiaryComponent } from './create-proceeding-diary/create-proceeding-diary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CreateReporterMetadataComponent } from './shared/components/create-reporter-metadata/create-reporter-metadata.component';
import { QuillModule } from 'ngx-quill';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ReporterDairyTableComponent } from './shared/components/reporter-dairy-table/reporter-dairy-table.component';
import { ProceedingDiaryActionsComponent } from './shared/components/proceeding-diary-actions/proceeding-diary-actions.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';


@NgModule({
  declarations: [ProceedingReporterComponent, CreateReporterDiaryComponent, ListReporterDiaryComponent, ListProceedingDiaryComponent, CreateProceedingDiaryComponent, CreateReporterMetadataComponent, ReporterDairyTableComponent, ProceedingDiaryActionsComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ProceedingReporterRoutingModule,
    QuillModule.forRoot(),
    NgxDocViewerModule,
    PdfJsViewerModule
  ]
})
export class ProceedingReporterModule { }
