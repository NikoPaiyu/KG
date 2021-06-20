import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FileViewComponent } from "./file-view.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FileWorkflowActionsComponent } from "./components/file-workflow-actions/file-workflow-actions.component";
import { FileTabInfoComponent } from "./components/file-tab-info/file-tab-info.component";
import { FileTabNotesComponent } from "./components/file-tab-notes/file-tab-notes.component";
import { FileTabLogsComponent } from "./components/file-tab-logs/file-tab-logs.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileBusinessBlocksComponent } from "./components/file-business-blocks/file-business-blocks.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NzStepsModule } from "ng-zorro-antd/steps";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { QuillModule } from "ngx-quill";
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NzStepsModule,
    NgxDocViewerModule,
    QuillModule.forRoot(),
  ],
  declarations: [
    FileViewComponent,
    FileWorkflowActionsComponent,
    FileTabInfoComponent,
    FileTabNotesComponent,
    FileTabLogsComponent,
    FileBusinessBlocksComponent,
  ],
  exports: [FileViewComponent],
})
export class FileViewModule {}
