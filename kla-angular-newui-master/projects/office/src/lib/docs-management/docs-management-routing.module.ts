import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocsManagementComponent } from './docs-management.component';
import { DocslistComponent } from './docslist/docslist.component';
import { SectionWiseDocsComponent } from './section-wise-docs/section-wise-docs.component';
import { UploadDocComponent } from './upload-doc/upload-doc.component';
import { UploadedDocviewComponent } from './uploaded-docview/uploaded-docview.component';


const routes: Routes = [
  {
    path: '', component: DocsManagementComponent,
    children: [
      {
        path: "doc-upload",
        component: UploadDocComponent,
      },
      { path: "doc-upload/:purpose/:id",
       component: UploadDocComponent 
      },
      {
        path: "docslist",
        component: DocslistComponent,
      },
      {
        path: "docsview/:id",
        component: UploadedDocviewComponent,
      },
      {
        path:"sectionwise-docs",
        component:SectionWiseDocsComponent
      }
    ]  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocsManagementRoutingModule { }
