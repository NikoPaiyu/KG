import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableDiaryRoutingModule } from './table-diary-routing.module';
import { TableDiaryComponent } from './table-diary.component';
import { TableDiaryListComponent } from './table-diary-list/table-diary-list.component';
import { CreateTableDiaryComponent } from './create-table-diary/create-table-diary.component';
import { PrepareTableDiaryComponent } from './prepare-table-diary/prepare-table-diary.component';
import { TableDiaryPreviewComponent } from './table-diary-preview/table-diary-preview.component';
import { QuillModule } from "ngx-quill";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { TableDiaryBulletinPart1Component } from './table-diary-bulletin-part1/table-diary-bulletin-part1.component';
// import { BulletinPart1ListComponent } from './bulletin-part1-list/bulletin-part1-list.component';
import { BulletinPart1PreviewComponent } from './bulletin-part1-preview/bulletin-part1-preview.component';
import { ListTableDiaryBulletinPart1Component } from './list-table-diary-bulletin-part1/list-table-diary-bulletin-part1.component';
import { ResumeListComponent } from './resume-list/resume-list.component';
import { ResumePrepareComponent } from './resume-prepare/resume-prepare.component';
import { CreateResumeComponent } from './create-resume/create-resume.component';
import { FileViewBulletinPart1Component } from './file-view-bulletin-part1/file-view-bulletin-part1.component';
import { FileViewResumeComponent } from './file-view-resume/file-view-resume.component';
import { AttachToFileModule } from '../shared/component/attach-to-file/attach-to-file.module';
import { PublishedResumeListComponent } from './published-resume-list/published-resume-list.component';
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";



@NgModule({
  exports: [FileViewBulletinPart1Component, FileViewResumeComponent],
  declarations: [TableDiaryComponent, TableDiaryListComponent, CreateTableDiaryComponent, PrepareTableDiaryComponent, TableDiaryPreviewComponent, TableDiaryBulletinPart1Component, BulletinPart1PreviewComponent, ListTableDiaryBulletinPart1Component, ResumeListComponent, ResumePrepareComponent, CreateResumeComponent, FileViewBulletinPart1Component, FileViewResumeComponent, PublishedResumeListComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TableDiaryRoutingModule,
    QuillModule.forRoot(),
    NgxDocViewerModule,
    AttachToFileModule,
    PdfJsViewerModule

  ]
})
export class TableDiaryModule { }
