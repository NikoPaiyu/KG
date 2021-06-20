import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NotesComponent } from "./notes/notes.component";
import { FileViewComponent } from "./file-view/file-view.component";
import { FileListComponent } from "./file-list/file-list.component";
import { FilesComponent } from './files.component';

const routes: Routes = [
  {
    path: "",
    component: FilesComponent,
    children: [
      // {
      //   path: "",
      //   redirectTo: "files",
      // },
      {
        path: "files",
        component: FileListComponent,
      },
      {
        path: "files/meeting-files",
        component: FileListComponent,
      },
      {
        path: 'files/report-files',
        component: FileListComponent
      },
      {
        path: "file-view/:id",
        component: FileViewComponent,
      },
      {
        path: "notes",
        component: NotesComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilesRoutingModule {}
