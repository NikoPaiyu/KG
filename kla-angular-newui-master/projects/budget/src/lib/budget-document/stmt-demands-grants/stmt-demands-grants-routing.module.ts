import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StmtDemandsGrantsComponent } from './stmt-demands-grants.component'; 
import { DemandsListComponent } from './demands-list/demands-list.component'; 
import { SdfgOrVOACreationComponent } from './sdfg-voa-creation/sdfg-voa-creation.component'; 
import { SdfgListComponent } from './sdfg-list/sdfg-list.component'; 
import { SdfgViewComponent } from './sdfg-view/sdfg-view.component'; 
import { CreateGreenBookComponent } from './green-book/create-greenbook/create-greenbook.component'; 

const routes: Routes = [
  {
    path: '',
    component: StmtDemandsGrantsComponent,
    children: [
      {
        path: 'sdfg/demand-list',
        component: DemandsListComponent,
      },
      {
        path: 'sdfg/create',
        component: SdfgOrVOACreationComponent,
      },
      {
        path: 'sdfg/list',
        component: SdfgListComponent,
      },
      {
        path: 'sdfg/published',
        component: SdfgListComponent,
      },
       {
        path: 'cutmotion/list',
        component: SdfgListComponent,
      },
      {
        path: 'sdfg/approved',
        component: SdfgListComponent,
      },
      {
        path: 'sdfg/view',
        component: SdfgViewComponent,
      },
      {
        path: 'sdgeg/create',
        component: SdfgOrVOACreationComponent,
      },
      {
        path: 'sdfg/grnbk/:mId',
        component: CreateGreenBookComponent,
      }
    ],
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StmtDemandsGrantsRoutingModule { }
