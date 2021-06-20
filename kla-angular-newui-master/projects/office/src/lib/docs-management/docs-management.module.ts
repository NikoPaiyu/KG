import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxDocViewerModule } from "ngx-doc-viewer";

import { DocsManagementRoutingModule } from './docs-management-routing.module';
import { DocsManagementComponent } from './docs-management.component';
import { UploadDocComponent } from './upload-doc/upload-doc.component';
import { DocslistComponent } from './docslist/docslist.component';
import { SectionWiseDocsComponent } from './section-wise-docs/section-wise-docs.component';
import { UploadedDocviewComponent } from './uploaded-docview/uploaded-docview.component';


@NgModule({
  declarations: [DocsManagementComponent, UploadDocComponent, DocslistComponent, SectionWiseDocsComponent, UploadedDocviewComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    DocsManagementRoutingModule,
    NgxDocViewerModule
  ]
})
export class DocsManagementModule { }
