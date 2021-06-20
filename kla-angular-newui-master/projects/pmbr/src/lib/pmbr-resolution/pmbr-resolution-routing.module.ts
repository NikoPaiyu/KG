import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AmendmentsListViewComponent } from './amendments-list-view/amendments-list-view.component';
import { ResolutionClauseByClauseAllAmendmentsComponent } from './clause-by-clause-all-amendments/clause-by-clause-all-amendments.component';
import { ClauseByClauseAmendmentsComponent } from './clause-by-clause-amendments/clause-by-clause-amendments.component';
import { ResolutionAmendmentNoticesForListComponent } from './clause-by-clause-notices-for-list/clause-by-clause-notices-for-list.component';
import { ResoolutionAmendmentNoticesComponent } from './clause-by-clause-notices/clause-by-clause-notices.component';
import { ResolutionCreateClauseByClauseAmendmentsComponent } from './create-clause-by-clause-amendments/create-clause-by-clause-amendments.component';
import { CreateResolutionComponent } from './create-resolution/create-resolution.component';
import { ListsComponent } from './lists/lists.component';
import { LottingNoticeListComponent } from './lotting-notice-list/lotting-notice-list.component';
import { PmbrResolutionComponent } from './pmbr-resolution.component';
import { ResolutionBallotListComponent } from './resolution-ballot-list/resolution-ballot-list.component';
import { ResolutionBallotViewComponent } from './resolution-ballot-view/resolution-ballot-view.component';
import { ResolutionBallotingComponent } from './resolution-balloting/resolution-balloting.component';

import { ResolutionFullViewComponent } from './resolution-full-view/resolution-full-view.component';
import { ResolutionListComponent } from './resolution-list/resolution-list.component';
import { ResolutionListsComponent } from './resolution-lists/resolution-lists.component';
import { ResolutionComponent } from './resolution/resolution.component';


const routes: Routes = [{
  path: '',
  component: PmbrResolutionComponent,
  children: [{
    path: 'resolution',
    component: ResolutionComponent
  }, {
    path: 'resolution-view/:id',
    component: ResolutionFullViewComponent
  }, {
    path: 'create-resolution/:id',
    component: CreateResolutionComponent
  },
  {
    path: 'resolution-list',
    component: ResolutionListComponent
  },
  {
    path: 'lotting-notice-list',
    component: LottingNoticeListComponent
  },
  {
    path: 'resolution-amendment/:id',
    component: ResolutionCreateClauseByClauseAmendmentsComponent
  },
  {
    path: 'resolution-balloting',
    component: ResolutionBallotingComponent
  },
  {
    path: 'resolution-ballot-list',
    component: ResolutionBallotListComponent
  },
  {
    path: 'resolution-ballot-view/:id',
    component: ResolutionBallotViewComponent
  },
  {
    path: 'resolution-lists',
    component: ResolutionListsComponent
  },
  {
    path: 'resolution-amendments-all',
    component: ResolutionClauseByClauseAllAmendmentsComponent
  },
  {
    path: 'clause-by-clause-notices-for-list/:id',
    component: ResolutionAmendmentNoticesForListComponent
  },
  {
    path: 'assigned-resolution-amendments',
    component: ClauseByClauseAmendmentsComponent
  },
  {
    path: 'clause-by-clause-notices/:id',
    component: ResoolutionAmendmentNoticesComponent
  },
  {
    path: 'lists',
    component: ListsComponent
  },
  {
    path: 'amendments-list-view/:id',
    component: AmendmentsListViewComponent
  }

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmbrResolutionRoutingModule { }
