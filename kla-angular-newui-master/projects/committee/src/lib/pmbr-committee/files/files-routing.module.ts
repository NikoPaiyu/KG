import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileListComponent } from './file-list/file-list.component';
import { FileViewComponent } from './file-view/file-view.component';
import { FilesComponent } from './files.component';


const routes: Routes = [{
  path: "", component: FilesComponent,
  children:[
    {
      path:'pmbr-commitee/file-list',
      component : FileListComponent
    },
    {
      path:'pmbr-commitee/file-view/:id',
      component : FileViewComponent
    }   
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilesRoutingModule { }
