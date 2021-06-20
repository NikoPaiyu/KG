import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GenericfileComponent } from "./genericfile.component";
import { FilesComponent } from "./files/files.component";
import { GenericfileRoutingModule } from "./genericfile-routing.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FileViewModule } from "./file-view/file-view.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TemplatesComponent } from "./templates/templates.component";
import { DocumentsComponent } from "./documents/documents.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NgxDocViewerModule } from "ngx-doc-viewer";
@NgModule({
  declarations: [
    GenericfileComponent,
    FilesComponent,
    TemplatesComponent,
    DocumentsComponent,
  ],
  imports: [
    CommonModule,
    GenericfileRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FileViewModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgxDocViewerModule,
  ],
  exports: [GenericfileComponent],
})
export class GenericfileModule {}
