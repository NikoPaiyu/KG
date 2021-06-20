import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { DocumentsComponent } from './documents.component';
import { ListDocumentsComponent } from './list-documents/list-documents.component';
import { ListTemplateComponent } from './list-template/list-template.component';
import { SelectTemplateComponent } from './select-template/select-template.component';


const routes: Routes = [
  { path: 'documents', component: DocumentsComponent,
      children: [
        {
            path: 'template-list',
            component: ListTemplateComponent
        },
        {
          path: 'create-template',
          component: CreateTemplateComponent
      },
      {     path: 'document-list',
            component: ListDocumentsComponent
        },
        {
          path: 'select-template',
          component: SelectTemplateComponent
        },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
