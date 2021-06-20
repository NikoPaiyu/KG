import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FileWorkflowComponent } from "./file-workflow.component";
import { DocsComponent } from "./docs/docs.component";

const routes: Routes = [
  {
    path: "",
    component: FileWorkflowComponent,
  },
  {
    path: "docs",
    component: DocsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileWorkflowRoutingModule {}
