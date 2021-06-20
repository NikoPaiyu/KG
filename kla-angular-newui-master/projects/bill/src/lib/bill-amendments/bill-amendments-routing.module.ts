import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillAmendmentsComponent } from './bill-amendments.component';
import { ObjIntroductionComponent } from './obj-introduction/obj-introduction.component';
import { ObjIntroductionListComponent } from './obj-introduction-list/obj-introduction-list.component';
import { OrdinanceDisapprovalComponent } from './ordinance-disapproval/ordinance-disapproval.component';
import { OrdDisapprovalListComponent } from './ord-disapproval-list/ord-disapproval-list.component';
import { GeneralAmendmentComponent } from './general-amendment/general-amendment.component';
import { GeneralAmendmentListComponent } from './general-amendment-list/general-amendment-list.component';
import { ClauseByClauseAmendmentsComponent } from './clause-by-clause-amendments/clause-by-clause-amendments.component';
import { ObjIntoductionViewComponent } from './obj-introduction-process-flow/obj-intoduction-view/obj-intoduction-view.component';
import { NotesComponent } from './obj-introduction-process-flow/notes/notes.component';
import { ObjIntoductionNoticesComponent } from './obj-intoduction-notices/obj-intoduction-notices.component';
import { ObjIntroductionProcessFlowComponent } from './obj-introduction-process-flow/obj-introduction-process-flow/obj-introduction-process-flow.component';
import { CreateClauseByClauseAmendmentsComponent } from './create-clause-by-clause-amendments/create-clause-by-clause-amendments.component';
import { ListsComponent } from './lists/lists.component';
import { BallotResultListComponent } from './ballot-result-list/ballot-result-list.component';
import { ClauseByClauseNoticesComponent } from './clause-by-clause-notices/clause-by-clause-notices.component';
import { BillClauseListViewComponent } from './bill-clause-list-view/bill-clause-list-view.component';
import { ClauseByClauseAllAmendmentsComponent } from './clause-by-clause-all-amendments/clause-by-clause-all-amendments.component';
import { ClauseByClauseNoticesForListComponent } from './clause-by-clause-notices-for-list/clause-by-clause-notices-for-list.component';


const routes: Routes = [
  {
    path: '',
    component: BillAmendmentsComponent,
    children: [
      {
        path: '',
        redirectTo: 'bill-amendments',
      },

      {
        path: 'obj-introduction',
        component: ObjIntroductionComponent,
      },
      {
        path: 'obj-introduction-list/:id',
        component: ObjIntroductionListComponent,
      },
      {
        path: 'ordinance-disapproval',
        component: OrdinanceDisapprovalComponent,
      },
      {
        path: 'ordinance-disapproval-list/:id',
        component: OrdDisapprovalListComponent,
      },
      {
        path: 'general-amendment-1',
        component: GeneralAmendmentComponent
      },
      {
        path: 'general-amendment-list/:id',
        component: GeneralAmendmentListComponent
      },
      {
        path: 'clause-by-clause',
        component: ClauseByClauseAmendmentsComponent
      },
      {
        path: 'clause-by-clause-all-amendments',
        component : ClauseByClauseAllAmendmentsComponent
      },
      {
        path: 'create-clause-by-clause/:id',
        component: CreateClauseByClauseAmendmentsComponent
      },
      {
        path: 'create-clause-by-clause/:id/:readonly',
        component: CreateClauseByClauseAmendmentsComponent
      },
      {
        path: 'obj-intro-view',
        component: ObjIntoductionViewComponent
      },
      {
        path: 'notes',
        component: NotesComponent
      },
      {
        path: 'obj-introduction-notices',
        component: ObjIntoductionNoticesComponent
      },
      {
        path: 'obj-introduction-process-flow/:id',
        component: ObjIntroductionProcessFlowComponent,
      },
      {
        path: 'lists',
        component: ListsComponent,
      },
      {
        path: 'ballot-result-list',
        component: BallotResultListComponent,
      },
      {
        path: 'clause-by-clause-notices/:id',
        component: ClauseByClauseNoticesComponent,
      },
      {
        path: 'clause-by-clause-notices-for-list/:id',
        component : ClauseByClauseNoticesForListComponent,
      },
      {
        path: 'clause-list-view/:id',
        component: BillClauseListViewComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillAmendmentsRoutingModule { }
