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
      {
        path: "",
        redirectTo: "files",
      },
      {
        path: "notes",
        component: NotesComponent,
      },
      {
        path: "file-view/:business/:id",
        component: FileViewComponent,
      },
      {
        path: "file-view/:id",
        component: FileViewComponent,
      },
      {
        path: "file-view/:type/:id",
        component: FileViewComponent,
      },
      
    ],
  },
  {
    path: 'files',
    component: FileListComponent,
  },
  {
    path: 'obituary-files',
    component: FileListComponent,
  },
  {
    path: 'election-files',
    component: FileListComponent,
  },
  {
    path: 'seat-files',
    component: FileListComponent,
  },
  {
    path: 'resume-files',
    component: FileListComponent,
  },
  {
    path: 'bulletinpart1-files',
    component: FileListComponent,
  },
  {
    path: 'time-allocation-files',
    component: FileListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilesRoutingModule { }
