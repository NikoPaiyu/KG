import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmbrResolutionRoutingModule } from './pmbr-resolution-routing.module';
import { PmbrResolutionComponent } from './pmbr-resolution.component';
import { ResolutionViewComponent } from './resolution-view/resolution-view.component';
import { ResolutionComponent } from './resolution/resolution.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateResolutionComponent } from './create-resolution/create-resolution.component';
import { CreateResolutionContentComponent } from './shared/component/create-resolution-content/create-resolution-content.component';
import { TranslateModule } from '@ngx-translate/core';
import { CreateResolutionMetadataComponent } from './shared/component/create-resolution-metadata/create-resolution-metadata.component';
import { ResolutionListComponent } from './resolution-list/resolution-list.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { QuillModule } from "ngx-quill";
import { LottingNoticeListComponent } from './lotting-notice-list/lotting-notice-list.component';
import { CreateLottingNoticeComponent } from './shared/component/create-lotting-notice/create-lotting-notice.component';
import { ViewLottingNoticeComponent } from './shared/component/view-lotting-notice/view-lotting-notice.component';
import { ResolutionCreateNoticeComponent } from './shared/component/resolution-create-notice/resolution-create-notice.component';
import { ResolutionFullViewComponent } from './resolution-full-view/resolution-full-view.component';
import { ResolutionContentViewComponent } from './shared/component/resolution-content-view/resolution-content-view.component';
import { ResolutionCreateClauseByClauseAmendmentsComponent } from './create-clause-by-clause-amendments/create-clause-by-clause-amendments.component';
import { ResolutionBallotingComponent } from './resolution-balloting/resolution-balloting.component';
import { ResolutionBallotListComponent } from './resolution-ballot-list/resolution-ballot-list.component';
import { ResolutionBallotViewComponent } from './resolution-ballot-view/resolution-ballot-view.component';
import { ResolutionListsComponent } from './resolution-lists/resolution-lists.component';
import { PmbrScheduleModule } from '../pmbr-schedule/pmbr-schedule.module';
import { SafehtmlModule } from '../shared/pipes/safehtml/safehtml.module';
import { ResolutionClauseByClauseAllAmendmentsComponent } from './clause-by-clause-all-amendments/clause-by-clause-all-amendments.component';
import { ResoolutionAmendmentNoticesComponent } from './clause-by-clause-notices/clause-by-clause-notices.component';
import { ResolutionAmendmentNoticesForListComponent } from './clause-by-clause-notices-for-list/clause-by-clause-notices-for-list.component';
import { BillClauseListViewComponent } from './bill-clause-list-view/bill-clause-list-view.component';
import { NestableModule } from 'ngx-nestable';
import { ClauseByClauseAmendmentsComponent } from './clause-by-clause-amendments/clause-by-clause-amendments.component';
import { ListsComponent } from './lists/lists.component';
import { LottingWonResolutionlistComponent } from './shared/component/lotting-won-resolutionlist/lotting-won-resolutionlist.component';
import { AmendmentsListViewComponent } from './amendments-list-view/amendments-list-view.component';
import { ResolutionMemberreadingViewComponent } from './shared/component/resolution-memberreading-view/resolution-memberreading-view.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';

export { ResolutionContentViewComponent } from './shared/component/resolution-content-view/resolution-content-view.component';
export { ResolutionMemberreadingViewComponent } from './shared/component/resolution-memberreading-view/resolution-memberreading-view.component';
export { ResolutionCreateNoticeComponent } from './shared/component/resolution-create-notice/resolution-create-notice.component';


@NgModule({
  declarations: [
    ResolutionCreateClauseByClauseAmendmentsComponent,
    PmbrResolutionComponent,
    ResolutionViewComponent,
    ResolutionComponent,
    CreateResolutionComponent,
    CreateResolutionContentComponent,
    CreateResolutionMetadataComponent,
    ResolutionListComponent,
    LottingNoticeListComponent,
    CreateLottingNoticeComponent,
    ViewLottingNoticeComponent,
    ResolutionCreateNoticeComponent,
    ResolutionFullViewComponent,
    ResolutionContentViewComponent,
    ResolutionBallotingComponent,
    ResolutionBallotListComponent,
    ResolutionBallotViewComponent,
    ResolutionListsComponent,
    ResolutionClauseByClauseAllAmendmentsComponent,
    ResoolutionAmendmentNoticesComponent,
    ResolutionAmendmentNoticesForListComponent,
    BillClauseListViewComponent,
    ClauseByClauseAmendmentsComponent,
    ListsComponent,
    LottingWonResolutionlistComponent,
    AmendmentsListViewComponent,
    ResolutionMemberreadingViewComponent,
  ],
  imports: [
    CommonModule,
    PmbrResolutionRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NzBreadCrumbModule,
    NzTabsModule,
    QuillModule,
    PmbrScheduleModule,
    SafehtmlModule,
    NestableModule,
    NzSelectModule,
    NzCardModule
  ],
  exports: [
    ResolutionBallotViewComponent,
    BillClauseListViewComponent,
    ResolutionContentViewComponent,
    ResolutionMemberreadingViewComponent,
    ResolutionCreateNoticeComponent
  ]
})
export class PmbrResolutionModule { }
