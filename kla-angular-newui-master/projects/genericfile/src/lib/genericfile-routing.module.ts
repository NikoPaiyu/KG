import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GenericfileComponent } from "./genericfile.component";
import { FilesComponent } from "./files/files.component";
import { FileViewComponent } from "./file-view/file-view.component";
import { TemplatesComponent } from "./templates/templates.component";
import { DocumentsComponent } from "./documents/documents.component";
const routes: Routes = [
  {
    path: "",
    component: GenericfileComponent,
    children: [
      {
        path: "list",
        component: FilesComponent,
      },
      {
        path: "view/:id",
        component: FileViewComponent,
      },
      {
        path: "templates",
        component: TemplatesComponent,
      },
      {
        path: "documents",
        component: DocumentsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenericfileRoutingModule {}
