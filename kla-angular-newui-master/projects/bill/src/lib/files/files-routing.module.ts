import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotesComponent } from './notes/notes.component';
import { FileViewComponent } from './file-view/file-view.component';
import { FileListComponent } from './file-list/file-list.component';
import { FilesComponent } from './files/files.component';


const routes: Routes = [
  {
    path: "",
    component: FilesComponent,
    children: [
      // {
      //   path: "",
      //   redirectTo: "file-view/:id",
      //   pathMatch:'full'
      // },
      {
        path: "notes",
        component: NotesComponent,
      },
      // {
      //   path: "file-view",
      //   component: FileViewComponent,
      // },
      {
        path: "file-view/:business/:id",
        component: FileViewComponent,
      },
      {
        path: "file-view/:id",
        component: FileViewComponent,
      },
    ],
  },
  {
    path: 'files',
    component: FileListComponent,
  },
  {
    path: 'files/priority-list-files',
    component: FileListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilesRoutingModule { }
