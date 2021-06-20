import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CplComponent } from "./cpl.component";
import { RegistrationComponent } from "./registration/registration.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DocumentsComponent } from "./documents/documents.component";
import { FileWorkflowComponent } from "./file-workflow/file-workflow.component";
import { CplViewComponent } from "./cpl-view/cpl-view.component";
import { DocumentsListComponent } from "./documents-list/documents-list.component";
import { DocumentPreparationComponent } from "./document-preparation/document-preparation.component";
import { FileListFlowComponent } from "./file-list-flow/file-list-flow.component";
import { LaidListComponent } from "./laid-list/laid-list.component";
import { DocAmendmentsComponent } from "./doc-amendments/doc-amendments.component";
import { DocsUploadComponent } from "./docs-upload/docs-upload.component";
import { UploadedListComponent } from "./uploaded-list/uploaded-list.component";
import { CorrespondenceListComponent } from "./correspondence-list/correspondence-list.component";
import { AmendmentViewComponent } from "./amendment-view/amendment-view.component";
import { ActRegistrationComponent } from "./act-registration/act-registration.component";
import { FilesComponent } from "./files/files.component";
import { DepartmentDashboardComponent } from "./department-dashboard/department-dashboard.component";
import { DraftCorrespondenceComponent } from "./draft-correspondence/draft-correspondence.component";
import { TemplateCreateComponent } from "./template-create/template-create.component";
import { TemplateListComponent } from "./template-list/template-list.component";
import { SelectCorrespondenceTemplateComponent } from "./select-correspondence-template/select-correspondence-template.component";
import { CorrespondenceComponent } from "./correspondence/correspondence.component";
import { CorrespondenceWorkflowComponent } from "./correspondence-workflow/correspondence-workflow.component";
import { CurrespondenceDetailViewComponent } from "./currespondence-detail-view/currespondence-detail-view.component";
import { AmendmentListComponent } from './amendment-list/amendment-list.component';
import { AmendmentListViewComponent } from './amendment-list-view/amendment-list-view.component';

const routes: Routes = [
  { path: "", component: CplComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "registration", component: RegistrationComponent },
  { path: "registration/OSdocs/:id", component: RegistrationComponent },
  { path: "documents", component: DocumentsComponent },
  { path: "documents/:id", component: DocumentsComponent },
  { path: "file-workflow/:id", component: FileWorkflowComponent },
  { path: "cpl-view/:purpose/:id", component: CplViewComponent },
  { path: "documents-list", component: DocumentsListComponent },
  { path: "documents-list/laid", component: LaidListComponent },
  { path: "document-preparation", component: DocumentPreparationComponent },
  { path: "document-preparation/:id", component: DocumentPreparationComponent },
  { path: "file-list-flow/:id", component: FileListFlowComponent },
  { path: "amendments", component: DocAmendmentsComponent },
  { path: "doc-upload", component: DocsUploadComponent },
  { path: "doc-upload/:id", component: DocsUploadComponent },
  { path: "doc-upload/:purpose/:id", component: DocsUploadComponent },
  { path: "uploaded-list", component: UploadedListComponent },
  { path: "correspondence-list", component: CorrespondenceListComponent },
  { path: "amendment-view/:id", component: AmendmentViewComponent },
  { path: "act-registration", component: ActRegistrationComponent },
  { path: "files", component: FilesComponent },
  { path: "department-dashboard", component: DepartmentDashboardComponent },
  { path: "draft-correspondence/:id", component: DraftCorrespondenceComponent },
  { path: "create-template", component: TemplateCreateComponent },
  { path: "create-template/:id", component: TemplateCreateComponent },
  { path: "template-list", component: TemplateListComponent },
  { path: "select-template", component: SelectCorrespondenceTemplateComponent },
  { path: "correspondence/:purpose/:id", component: CorrespondenceComponent },
  {
    path: "correspondence-workflow/:id",
    component: CorrespondenceWorkflowComponent,
  },
  {
    path: "correspondencedetailview/:id",
    component: CurrespondenceDetailViewComponent,
  },
  {
    path: "amendment-list",
    component: AmendmentListComponent,
  },
  {
    path: "amendment-list-view/:id",
    component: AmendmentListViewComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CplRoutingModule {}
