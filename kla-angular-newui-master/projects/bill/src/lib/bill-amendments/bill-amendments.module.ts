import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { BillAmendmentsRoutingModule } from './bill-amendments-routing.module';
import { ObjIntroductionComponent } from './obj-introduction/obj-introduction.component';
import { BillAmendmentListComponent } from './bill-amendment-list/bill-amendment-list.component';
import { BillAmendmentsComponent } from './bill-amendments.component';
import { ObjIntroductionListComponent } from './obj-introduction-list/obj-introduction-list.component';
import { OrdinanceDisapprovalComponent } from './ordinance-disapproval/ordinance-disapproval.component';
import { OrdDisapprovalListComponent } from './ord-disapproval-list/ord-disapproval-list.component';
import { GeneralAmendmentComponent } from './general-amendment/general-amendment.component';
import { GeneralAmendmentListComponent } from './general-amendment-list/general-amendment-list.component';
import { ClauseByClauseAmendmentsComponent } from './clause-by-clause-amendments/clause-by-clause-amendments.component';
import { ObjIntroductionProcessFlowComponent } from './obj-introduction-process-flow/obj-introduction-process-flow/obj-introduction-process-flow.component';
import { NotesComponent } from './obj-introduction-process-flow/notes/notes.component';
import { ObjIntoductionViewComponent } from './obj-introduction-process-flow/obj-intoduction-view/obj-intoduction-view.component';
import { ObjIntoductionNoticesComponent } from './obj-intoduction-notices/obj-intoduction-notices.component'
import { QuillModule } from "ngx-quill";
import { BillFullViewModule } from "../bill-full-view/bill-full-view.module";
import { CreateClauseByClauseAmendmentsComponent } from './create-clause-by-clause-amendments/create-clause-by-clause-amendments.component';
import { ListsComponent } from './lists/lists.component';
import { BallotResultListComponent } from './ballot-result-list/ballot-result-list.component';
import { BallotingModule } from '../balloting/balloting.module';
import { ClauseByClauseNoticesComponent } from './clause-by-clause-notices/clause-by-clause-notices.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { BillClauseListViewComponent } from './bill-clause-list-view/bill-clause-list-view.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { ClauseByClauseAllAmendmentsComponent } from './clause-by-clause-all-amendments/clause-by-clause-all-amendments.component';
import { ClauseByClauseNoticesForListComponent } from './clause-by-clause-notices-for-list/clause-by-clause-notices-for-list.component';
import { NestableModule } from 'ngx-nestable';
import { BillManagementModule } from '../bill-management/bill-management.module';
@NgModule({
  declarations: [
    ObjIntroductionComponent,
    BillAmendmentListComponent,
    BillAmendmentsComponent,
    ObjIntroductionListComponent,
    OrdinanceDisapprovalComponent,
    OrdDisapprovalListComponent,
    GeneralAmendmentComponent,
    GeneralAmendmentListComponent,
    ClauseByClauseAmendmentsComponent,
    CreateClauseByClauseAmendmentsComponent,
    ObjIntroductionProcessFlowComponent,
    NotesComponent,
    ObjIntoductionViewComponent,
    ObjIntoductionNoticesComponent,
    ListsComponent,
    BallotResultListComponent,
    ClauseByClauseNoticesComponent,
    BillClauseListViewComponent,
    ClauseByClauseAllAmendmentsComponent,
    ClauseByClauseNoticesForListComponent
  ],
  imports: [
    CommonModule,
    BillAmendmentsRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    BillFullViewModule,
    BallotingModule,
    NzModalModule,
    NzCardModule,
    NzIconModule,
    NzDropDownModule,
    NzModalModule,
    NzSwitchModule,
    NestableModule,
    BillManagementModule
  ],
  exports: [BillClauseListViewComponent, CreateClauseByClauseAmendmentsComponent]
})
export class BillAmendmentsModule { }
