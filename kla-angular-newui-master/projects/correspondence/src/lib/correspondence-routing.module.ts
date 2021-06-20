import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorrespondenceComponent } from './correspondence.component';
import { TemplateCreateComponent } from './template-create/template-create.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { SelectTemplateComponent } from './select-template/select-template.component';
import { DraftCorrespondenceComponent } from './draft-correspondence/draft-correspondence.component';
import { CorrespondenceWorkflowComponent } from './correspondence-workflow/correspondence-workflow.component';
import { CorrespondenceDetailViewComponent } from './correspondence-detail-view/correspondence-detail-view.component';
import { CorrespondenceListComponent } from './correspondence-list/correspondence-list.component';
import { CorrespondenceViewComponent } from './correspondence-view/correspondence-view.component';

const routes: Routes = [
  {
    path: '',
    component: CorrespondenceComponent
  },
  {
    path: 'create-template',
    component: TemplateCreateComponent
  },
  {
    path: 'create-template/:id',
    component: TemplateCreateComponent
  },
  {
    path: 'template-list',
    component: TemplateListComponent
  },
  {
    path: 'select-template',
    component: SelectTemplateComponent
  },
  {
    path: 'draft-correspondence/:id',
    component: DraftCorrespondenceComponent
  },
  {
    path: 'correspondence/:purpose/:id',
    component: CorrespondenceViewComponent
  },
  {
    path: 'correspondence-workflow/:id',
    component: CorrespondenceWorkflowComponent,
  },
  {
    path: 'correspondencedetailview/:id',
    component: CorrespondenceDetailViewComponent,
  },
  {
    path: 'correspondence-list',
    component: CorrespondenceListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CplRoutingModule {}
