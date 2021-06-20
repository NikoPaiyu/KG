import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CplComponent } from "./cpl.component";
import { RegistrationComponent } from "./registration/registration.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FileWorkflowComponent } from "./file-workflow/file-workflow.component";
import { DocumentsComponent } from "./documents/documents.component";
import { CplRoutingModule } from "./cpl-routing.module";
import { DocumentsListComponent } from "./documents-list/documents-list.component";
import { CplViewComponent } from "./cpl-view/cpl-view.component";
import { DocsComponent } from "./file-workflow/docs/docs.component";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { DocumentPreparationComponent } from "./document-preparation/document-preparation.component";
import { FileListFlowComponent } from "./file-list-flow/file-list-flow.component";
import { QuillModule } from "ngx-quill";
import { LaidListComponent } from "./laid-list/laid-list.component";
import { DynamicFormComponent } from "./shared/components/dynamic-form/dynamic-form.component";
import { SelectComponent } from "./shared/components/select/select.component";
import { InputComponent } from "./shared/components/input/input.component";
import { ComponentsModule } from "./shared/components/components.module";
import { DocAmendmentsComponent } from "./doc-amendments/doc-amendments.component";
import { DocsUploadComponent } from "./docs-upload/docs-upload.component";
import { UploadedListComponent } from "./uploaded-list/uploaded-list.component";
import { CorrespondenceListComponent } from "./correspondence-list/correspondence-list.component";
import { AmendmentViewComponent } from "./amendment-view/amendment-view.component";
import { CommonFilterPipe } from "./shared/pipes/common-filter.pipe";
import { SectionNamePipe } from "./shared/pipes/section-name.pipe";
import { ActRegistrationComponent } from "./act-registration/act-registration.component";
import { FilesComponent } from "./files/files.component";
import { DepartmentDashboardComponent } from "./department-dashboard/department-dashboard.component";
import { DraftCorrespondenceComponent } from "./draft-correspondence/draft-correspondence.component";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzModalModule } from "ng-zorro-antd/modal";
import { StatusFilterPipe } from "./shared/pipes/status-filter.pipe";
import { TemplateCreateComponent } from "./template-create/template-create.component";
import { TemplateListComponent } from "./template-list/template-list.component";
import { SelectCorrespondenceTemplateComponent } from "./select-correspondence-template/select-correspondence-template.component";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { SearchTemplatePipe } from "./shared/pipes/search-template.pipe";
import { CorrespondenceComponent } from "./correspondence/correspondence.component";
import { CorrespondenceWorkflowComponent } from "./correspondence-workflow/correspondence-workflow.component";
import { TranslateModule } from "@ngx-translate/core";
import { CurrespondenceDetailViewComponent } from "./currespondence-detail-view/currespondence-detail-view.component";
import { NzUploadModule } from "ng-zorro-antd/upload";
import { AmendmentListComponent } from './amendment-list/amendment-list.component';
import { AmendmentListViewComponent } from './amendment-list-view/amendment-list-view.component';
// import * as Quill from 'quill';

@NgModule({
  declarations: [
    CplComponent,
    RegistrationComponent,
    DashboardComponent,
    FileWorkflowComponent,
    DocumentsComponent,
    DocumentsListComponent,
    CplViewComponent,
    DocsComponent,
    FilesComponent,
    DocumentPreparationComponent,
    FileListFlowComponent,
    LaidListComponent,
    DocAmendmentsComponent,
    DocsUploadComponent,
    UploadedListComponent,
    CorrespondenceListComponent,
    AmendmentViewComponent,
    CommonFilterPipe,
    SectionNamePipe,
    ActRegistrationComponent,
    DepartmentDashboardComponent,
    DraftCorrespondenceComponent,
    StatusFilterPipe,
    TemplateCreateComponent,
    TemplateListComponent,
    SelectCorrespondenceTemplateComponent,
    SearchTemplatePipe,
    CorrespondenceComponent,
    CorrespondenceWorkflowComponent,
    CurrespondenceDetailViewComponent,
    AmendmentListComponent,
    AmendmentListViewComponent,
  ],
  imports: [
    CplRoutingModule,
    NgZorroAntdModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDocViewerModule,
    NzDividerModule,
    NzBreadCrumbModule,
    NzInputModule,
    NzSelectModule,
    NzFormModule,
    TranslateModule,
    NzModalModule,
    NzRadioModule,
    NzTabsModule,
    NzUploadModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }],
          [{ direction: "rtl" }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ["image"],
        ],
      },
    }),
    ComponentsModule,
  ],
  exports: [CplComponent, DashboardComponent, DepartmentDashboardComponent],
})
export class CplModule {
  constructor() {
    // changing quill classes to inline styles
    // const alignStyle = Quill.import('attributors/style/align');
    // const directionStyle = Quill.import('attributors/style/direction');
    // const fontStyle = Quill.import('attributors/style/font');
    // Quill.register(alignStyle, true);
    // Quill.register(directionStyle, true);
    // Quill.register(fontStyle, true);
  }
}
