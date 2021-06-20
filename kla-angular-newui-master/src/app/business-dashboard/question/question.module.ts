import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { QuestionRoutingModule } from "./question-routing.module";
import { QuestionComponent } from "./question.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzSelectModule } from "ng-zorro-antd/select";
import { QuestionListDeptComponent } from "./list/question-list-dept/question-list-dept.component";
import { QuestionCreateComponent } from "./question-create/question-create.component";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzFormModule } from "ng-zorro-antd/form";
import { QuestionViewComponent } from "./question-full-view/question-view/question-view.component";
import { QuestionAnswerComponent } from "./question-full-view/question-answer/question-answer.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { QuestionConsentComponent } from "./consents/question-consent/question-consent.component";
import { QuestionEditComponent } from "./edit/question-edit/question-edit.component";
import { QuestionRequestConsentComponent } from "./consents/question-request-consent/question-request-consent.component";
import { QuestionGrantConsentComponent } from "./consents/question-grant-consent/question-grant-consent.component";
import { QuestionMlaListingComponent } from "./list/question-mla-listing/question-mla-listing.component";
import { QuestionMlaViewComponent } from "./question-full-view/question-mla-view/question-mla-view.component";
import { TableFilterPipe } from "./shared/model/table-filter.pipe";
import { ListFilterPipe } from "./shared/pipes/filter.pipe";
import { QuestionDashboardComponent } from "./dashboard/question-dashboard/question-dashboard.component";
import { QuestionDeptDashboardComponent } from "./dashboard/question-dept-dashboard/question-dept-dashboard.component";
import { QuestionBallotDateReportComponent } from "./Reports/question-ballot-date-report/question-ballot-date-report.component";
import { TranslateModule } from "@ngx-translate/core";
import { NgxSortableModule } from "ngx-sortable";
import { NestableModule } from "ngx-nestable";
import { NgxPrintModule } from 'ngx-print';
import { QuestionVersioningComponent } from "./versions/question-versioning/question-versioning.component";
import { QuestionPortfolioAddComponent } from "./question-portfolio-add/question-portfolio-add.component";
import { QuestionSettingsComponent } from "./question-balloting/question-settings/question-settings.component";
import { QuestionClauseSettingsComponent } from "./question-clause-settings/question-clause-settings.component";
import { QuestionDateShiftingComponent } from "./question-date-shifting/question-date-shifting.component";
import { QuestionduplicateComponent } from "./shared/component/questionduplicate/questionduplicate.component";
import { QuestionAnswerVersionComponent } from "./versions/question-answer-version/question-answer-version.component";
import { QuestionPerformBallotComponent } from "./question-balloting/question-perform-ballot/question-perform-ballot.component";
import { QuestionBallotListComponent } from "./question-balloting/question-ballot-list/question-ballot-list.component";
import { QuestionBallotViewComponent } from "./question-balloting/question-ballot-view/question-ballot-view.component";
import { QuestionBallotedViewComponent } from "./question-balloting/question-balloted-view/question-balloted-view.component";
import { NoticePreviewComponent } from './shared/component/notice-preview/notice-preview.component';
import { UnstarredSetupComponent } from './question-balloting/unstarred-setup/unstarred-setup.component';
import { QuestionEditDeptComponent } from "./edit/question-editdept/question-editdept.component";
import { BookletPreviewComponent } from './shared/component/booklet-preview/booklet-preview.component';
import { QuestionListMlaComponent } from './list/question-list-mla/question-list-mla.component';
import { QuestionBankComponent } from './list/question-bank/question-bank.component';
import { QuestionCullingAssuranceComponent } from './question-culling/question-culling-assurance/question-culling-assurance.component';
import { MarkAssuranceComponent } from './question-culling/mark-assurance/mark-assurance.component';
import { QuestionNoticeAddtobankComponent } from './question-notice-addtobank/question-notice-addtobank.component';
import { QuestionansPreviewComponent } from './shared/component/questionans-preview/questionans-preview.component';
import { AnswerStatusListComponent } from './answer-status/answer-status-list/answer-status-list.component';
import { CreateAnswerStatusListComponent } from './answer-status/create-answer-status-list/create-answer-status-list.component';
import { ProcessAnswerStatusListComponent } from './answer-status/process-answer-status-list/process-answer-status-list.component';
import { SafePipe } from "./shared/pipes/safehtml.pipe";
import { StarredBookletComponent } from './question-booklet/starred-booklet/starred-booklet.component';
import { UnStarredBookletComponent } from './question-booklet/unstarred-booklet/unstarred-booklet.component';
import { QuestionCorrectionViewComponent } from './question-full-view/question-correctionview/question-correctionview.component';
import { QuestionClubbWithdwComponent } from './list/question-clubb-withdw/question-clubb-withdw.component';
import { QuestionSenttoDeptComponent } from './question-senttodept/question-senttodept.component';
import { QuestionReportComponent } from './Reports/question-report/question-report.component';
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { LateAnswerBulletinListComponent } from './late-answer-bulletin/late-answer-bulletin-list/late-answer-bulletin-list.component';
import { CreateLateAnswerBulletinComponent } from './late-answer-bulletin/create-late-answer-bulletin/create-late-answer-bulletin.component';
import { ProcessLateAnswerBulletinComponent } from './late-answer-bulletin/process-late-answer-bulletin/process-late-answer-bulletin.component';
import { ListDelayStatementListComponent } from './delay-statement-list/list-delay-statement-list/list-delay-statement-list.component';
import { CreateDelayStatementListComponent } from './delay-statement-list/create-delay-statement-list/create-delay-statement-list.component';
import { QuestionPPOConfigComponent } from './question-ppoconfig/question-ppoconfig.component';
import { QuestionCheckDuplicateComponent } from './question-check-duplicate/question-check-duplicate.component';
import { ShortNoticePreviewComponent } from './shared/component/short-notice-preview/short-notice-preview.component';
import { ShortNoticeViewComponent } from './question-full-view/question-snq-view/question-snq-view.component';
import { AssuranceViewComponent } from './question-culling/assurance-view/assurance-view.component';
import { DraftAssuranceListComponent } from './question-culling/draft-assurance-list/draft-assurance-list.component';
import { AssuranceListComponent } from './question-culling/assurance-list/assurance-list.component';
import { DraftListViewComponent } from './question-culling/draft-list-view/draft-list-view.component';
import { AssuranceMainListComponent } from './question-culling/assurance-main-list/assurance-main-list.component';
import { ApprovedAssuranceListComponent } from './question-culling/approved-assurance-list/approved-assurance-list.component';
import { NotesComponent } from './shared/component/notes/notes.component';
import { DraftListPreviewComponent } from './shared/component/draft-list-preview/draft-list-preview.component';
import { ClubbingViewComponent } from './question-clubbing/clubbing-view/clubbing-view.component';
import { QuestionClubbingListComponent } from './question-clubbing/clubbing-list/clubbing-list.component';
import { WorkFlowProgressComponent } from './shared/component/work-flow-progress/work-flow-progress.component';
import { AuthorizeListComponent } from "./question-authorize/authorize-list/authorize-list.component";
import { ApprovedLateAnswerListComponent } from './late-answer-bulletin/approved-late-answer-list/approved-late-answer-list.component';
import { PublishedBullettinComponent } from "./late-answer-bulletin/published-bullettin/published-bullettin.component";

export { WorkFlowProgressComponent } from './shared/component/work-flow-progress/work-flow-progress.component';
export { NotesComponent } from './shared/component/notes/notes.component';

@NgModule({
  declarations: [
    QuestionComponent,
    QuestionListDeptComponent,
    QuestionCreateComponent,
    QuestionViewComponent,
    QuestionAnswerComponent,
    QuestionConsentComponent,
    QuestionEditComponent,
    QuestionRequestConsentComponent,
    QuestionGrantConsentComponent,
    QuestionMlaListingComponent,
    QuestionMlaViewComponent,
    TableFilterPipe,
    ListFilterPipe,
    QuestionDashboardComponent,
    QuestionDeptDashboardComponent,
    QuestionBallotDateReportComponent,
    QuestionVersioningComponent,
    QuestionClauseSettingsComponent,
    QuestionPortfolioAddComponent,
    QuestionSettingsComponent,
    QuestionDateShiftingComponent,
    QuestionduplicateComponent,
    QuestionAnswerVersionComponent,
    QuestionPerformBallotComponent,
    QuestionBallotListComponent,
    QuestionBallotViewComponent,
    QuestionBallotedViewComponent,
    NoticePreviewComponent,
    UnstarredSetupComponent,
    QuestionEditDeptComponent,
    NoticePreviewComponent,
    BookletPreviewComponent,
    QuestionCullingAssuranceComponent,
    QuestionListMlaComponent,
    QuestionBankComponent,
    AssuranceListComponent,
    MarkAssuranceComponent,
    QuestionNoticeAddtobankComponent,
    QuestionansPreviewComponent,
    AnswerStatusListComponent,
    CreateAnswerStatusListComponent,
    ProcessAnswerStatusListComponent,
    SafePipe,
    StarredBookletComponent,
    UnStarredBookletComponent,
    QuestionCorrectionViewComponent,
    QuestionClubbWithdwComponent,
    QuestionSenttoDeptComponent,
    QuestionReportComponent,
    LateAnswerBulletinListComponent,
    CreateLateAnswerBulletinComponent,
    ProcessLateAnswerBulletinComponent,
    ListDelayStatementListComponent,
    CreateDelayStatementListComponent,
    QuestionPPOConfigComponent,
    QuestionCheckDuplicateComponent,
    ShortNoticePreviewComponent,
    ShortNoticeViewComponent,
    AssuranceViewComponent,
    DraftAssuranceListComponent,
    DraftListViewComponent,
    AssuranceMainListComponent,
    ApprovedAssuranceListComponent,
    NotesComponent,
    DraftListPreviewComponent,
    ClubbingViewComponent,
    QuestionClubbingListComponent,
    WorkFlowProgressComponent,
    AuthorizeListComponent,
    ApprovedLateAnswerListComponent,
    PublishedBullettinComponent
  ],
  imports: [
    CommonModule,
    QuestionRoutingModule,
    FormsModule,
    NzGridModule,
    NzDropDownModule,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
    NzInputModule,
    NzTableModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzRadioModule,
    NzFormModule,
    TranslateModule,
    NgZorroAntdModule,
    NgxSortableModule,
    NgxPrintModule,
    PdfJsViewerModule,
    NestableModule,
  ],
  exports: [QuestionDashboardComponent, QuestionDeptDashboardComponent, NotesComponent, WorkFlowProgressComponent],
  providers: [DatePipe],
  entryComponents: [QuestionduplicateComponent, BookletPreviewComponent, QuestionansPreviewComponent, ShortNoticePreviewComponent,
                    DraftListPreviewComponent],
})
export class QuestionModule { }
