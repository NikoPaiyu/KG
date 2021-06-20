import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { QuestionComponent } from "./question.component";
import { QuestionListDeptComponent } from "./list/question-list-dept/question-list-dept.component";
import { QuestionCreateComponent } from "./question-create/question-create.component";
import { QuestionViewComponent } from "./question-full-view/question-view/question-view.component";
import { QuestionAnswerComponent } from "./question-full-view/question-answer/question-answer.component";
import { QuestionConsentComponent } from "./consents/question-consent/question-consent.component";
import { QuestionEditComponent } from "./edit/question-edit/question-edit.component";
import { QuestionRequestConsentComponent } from "./consents/question-request-consent/question-request-consent.component";
import { QuestionGrantConsentComponent } from "./consents/question-grant-consent/question-grant-consent.component";
import { QuestionMlaListingComponent } from "./list/question-mla-listing/question-mla-listing.component";
import { QuestionMlaViewComponent } from "./question-full-view/question-mla-view/question-mla-view.component";
import { QuestionDashboardComponent } from "./dashboard/question-dashboard/question-dashboard.component";
import { QuestionDeptDashboardComponent } from "./dashboard/question-dept-dashboard/question-dept-dashboard.component";
import { QuestionBallotDateReportComponent } from "./Reports/question-ballot-date-report/question-ballot-date-report.component";
import { QuestionVersioningComponent } from "./versions/question-versioning/question-versioning.component";
import { QuestionPortfolioAddComponent } from "./question-portfolio-add/question-portfolio-add.component";
import { QuestionSettingsComponent } from "./question-balloting/question-settings/question-settings.component";
import { UnstarredSetupComponent } from "./question-balloting/unstarred-setup/unstarred-setup.component";
import { QuestionClauseSettingsComponent } from "./question-clause-settings/question-clause-settings.component";
import { QuestionDateShiftingComponent } from "./question-date-shifting/question-date-shifting.component";
import { QuestionAnswerVersionComponent } from "./versions/question-answer-version/question-answer-version.component";
import { QuestionPerformBallotComponent } from "./question-balloting/question-perform-ballot/question-perform-ballot.component";
import { QuestionBallotListComponent } from "./question-balloting/question-ballot-list/question-ballot-list.component";
import { QuestionBallotViewComponent } from "./question-balloting/question-ballot-view/question-ballot-view.component";
import { QuestionBallotedViewComponent } from "./question-balloting/question-balloted-view/question-balloted-view.component";
import { QuestionEditDeptComponent } from "./edit/question-editdept/question-editdept.component";
import { QuestionListMlaComponent } from "./list/question-list-mla/question-list-mla.component";
import { QuestionBankComponent } from "./list/question-bank/question-bank.component";
import { QuestionCullingAssuranceComponent } from "./question-culling/question-culling-assurance/question-culling-assurance.component";
import { MarkAssuranceComponent } from "./question-culling/mark-assurance/mark-assurance.component";
import { QuestionNoticeAddtobankComponent } from "./question-notice-addtobank/question-notice-addtobank.component";
import { AnswerStatusListComponent } from "./answer-status/answer-status-list/answer-status-list.component";
import { CreateAnswerStatusListComponent } from "./answer-status/create-answer-status-list/create-answer-status-list.component";
import { ProcessAnswerStatusListComponent } from "./answer-status/process-answer-status-list/process-answer-status-list.component";
import { StarredBookletComponent } from "./question-booklet/starred-booklet/starred-booklet.component";
import { UnStarredBookletComponent } from "./question-booklet/unstarred-booklet/unstarred-booklet.component";
import { QuestionCorrectionViewComponent } from "./question-full-view/question-correctionview/question-correctionview.component";
import { QuestionClubbWithdwComponent } from "./list/question-clubb-withdw/question-clubb-withdw.component";
import { QuestionSenttoDeptComponent } from "./question-senttodept/question-senttodept.component";
import { QuestionReportComponent } from "./Reports/question-report/question-report.component";
import { LateAnswerBulletinListComponent } from "./late-answer-bulletin/late-answer-bulletin-list/late-answer-bulletin-list.component";
import { CreateLateAnswerBulletinComponent } from "./late-answer-bulletin/create-late-answer-bulletin/create-late-answer-bulletin.component";
import { ProcessLateAnswerBulletinComponent } from "./late-answer-bulletin/process-late-answer-bulletin/process-late-answer-bulletin.component";
import { ListDelayStatementListComponent } from "./delay-statement-list/list-delay-statement-list/list-delay-statement-list.component";
import { CreateDelayStatementListComponent } from "./delay-statement-list/create-delay-statement-list/create-delay-statement-list.component";
import { QuestionPPOConfigComponent } from "./question-ppoconfig/question-ppoconfig.component";
import { QuestionCheckDuplicateComponent } from "./question-check-duplicate/question-check-duplicate.component";
import { ShortNoticeViewComponent } from "./question-full-view/question-snq-view/question-snq-view.component";
import { AssuranceViewComponent } from "./question-culling/assurance-view/assurance-view.component";
import { DraftListViewComponent } from "./question-culling/draft-list-view/draft-list-view.component";
import { AssuranceMainListComponent } from "./question-culling/assurance-main-list/assurance-main-list.component";
import { ClubbingViewComponent } from "./question-clubbing/clubbing-view/clubbing-view.component";
import { QuestionClubbingListComponent } from "./question-clubbing/clubbing-list/clubbing-list.component";
import { AuthorizeListComponent } from "./question-authorize/authorize-list/authorize-list.component";
import { ApprovedLateAnswerListComponent } from './late-answer-bulletin/approved-late-answer-list/approved-late-answer-list.component';
import { PublishedBullettinComponent } from "./late-answer-bulletin/published-bullettin/published-bullettin.component";

const routes: Routes = [
  {
    path: "",
    component: QuestionComponent,
    children: [
      { path: "", redirectTo: "question-dashboard" },
      { path: "list-dept", component: QuestionListDeptComponent },
      { path: "list-dept/:status", component: QuestionListDeptComponent },
      { path: "list-dept/:isChange", component: QuestionListDeptComponent },

      { path: "list-dept-qus", component: QuestionListDeptComponent },
      { path: "list-dept-qus/:status", component: QuestionListDeptComponent },
      { path: "list-dept-qus/:isChange", component: QuestionListDeptComponent },

      { path: "list-dept-ntc", component: QuestionListDeptComponent },
      { path: "list-dept-ntc/:status", component: QuestionListDeptComponent },
      { path: "list-dept-ntc/:isChange", component: QuestionListDeptComponent },

      { path: "list-mla-ntc", component: QuestionListMlaComponent },
      {
        path: "list-mla-ntc/:status/:subby/:type",
        component: QuestionListMlaComponent,
      },
      { path: "list-mla-qus", component: QuestionListMlaComponent },
      {
        path: "list-mla-qus/:status/:subby/:type",
        component: QuestionListMlaComponent,
      },
      { path: "list-mla-snq", component: QuestionListMlaComponent },
      {
        path: "list-mla-snq/:status/:subby/:type",
        component: QuestionListMlaComponent,
      },
      { path: "list-mla-pubq", component: QuestionListMlaComponent },
      {
        path: "list-mla-pubq/:status/:subby/:type",
        component: QuestionListMlaComponent,
      },
      { path: "question-create", component: QuestionCreateComponent },
      { path: "question-create/:type", component: QuestionCreateComponent },
      { path: "question-view/:id", component: QuestionViewComponent },
      { path: "question-view/:id/:status", component: QuestionViewComponent },
      {
        path: "question-view/:id/:status/:isp",
        component: QuestionViewComponent,
      },
      {
        path: "question-clubview/:id/:status/:clubbid",
        component: QuestionViewComponent,
      },
      { path: "question-answer/:id", component: QuestionAnswerComponent },
      { path: "question-consent", component: QuestionConsentComponent },
      { path: "question-edit/:id", component: QuestionEditComponent },
      { path: "question-edit/:id/:status", component: QuestionEditComponent },
      {
        path: "question-editsec/:id",
        component: QuestionEditDeptComponent,
      },
      {
        path: "question-editsec/:id/:status",
        component: QuestionEditDeptComponent,
      },
      {
        path: "question-check-duplicate/:id",
        component: QuestionCheckDuplicateComponent,
      },
      {
        path: "question-request-consent/:status",
        component: QuestionRequestConsentComponent,
      },
      {
        path: "question-grant-consent",
        component: QuestionGrantConsentComponent,
      },
      { path: "question-mlaListing", component: QuestionMlaListingComponent },
      { path: "question-mlaView/:id", component: QuestionMlaViewComponent },
      { path: "question-dashboard", component: QuestionDashboardComponent },
      {
        path: "question-dept-dashboard",
        component: QuestionDeptDashboardComponent,
      },
      {
        path: "question-portfolio-add",
        component: QuestionPortfolioAddComponent,
      },
      {
        path: "question-ballot-date-report",
        component: QuestionBallotDateReportComponent,
      },
      {
        path: "question-versions/:id/:qstatus/:status",
        component: QuestionVersioningComponent,
      },
      { path: "question-settings", component: QuestionSettingsComponent },
      { path: "question-unstarred", component: UnstarredSetupComponent },
      {
        path: "question-clause-settings",
        component: QuestionClauseSettingsComponent,
      },
      {
        path: "question-date-shifting",
        component: QuestionDateShiftingComponent,
      },
      {
        path: "question-answer-versions/:id",
        component: QuestionAnswerVersionComponent,
      },
      {
        path: "question-perform-ballot",
        component: QuestionPerformBallotComponent,
      },
      {
        path: "question-ballot-list",
        component: QuestionBallotedViewComponent,
      },
      {
        path: "question-ballot-approve",
        component: QuestionBallotListComponent,
      },
      {
        path: "question-settolob",
        component: QuestionBallotedViewComponent,
      },
      {
        path: "question-ballot-view/:date/:action",
        component: QuestionBallotViewComponent,
      },
      { path: "apprv-list", component: QuestionListDeptComponent },
      { path: "withdr-list", component: QuestionListDeptComponent },
      { path: "withdr-list-qus", component: QuestionListDeptComponent },
      { path: "disallw-list", component: QuestionListDeptComponent },
      { path: "chngrply-list", component: QuestionListDeptComponent },
      { path: "answd-list", component: QuestionListDeptComponent },
      { path: "tkn-list", component: QuestionListDeptComponent },
      { path: "ac-list", component: QuestionListDeptComponent },
      { path: "ac-aftr-list", component: QuestionListDeptComponent },
      { path: "svd-list", component: QuestionListDeptComponent },
      { path: "pull-list", component: QuestionListDeptComponent },
      { path: "all-list", component: QuestionListDeptComponent },
      { path: "correctn-list", component: QuestionListDeptComponent },
      { path: "returned-list", component: QuestionListDeptComponent },
      { path: "snq-list", component: QuestionListDeptComponent },
      { path: "published-list", component: QuestionListDeptComponent },
      {
        path: "question-senddept",
        component: QuestionBallotListComponent,
      },
      {
        path: "question-bank",
        component: QuestionBankComponent,
      },
      {
        path: "assured-list",
        component: AssuranceMainListComponent,
      },
      {
        path: "assured-list/:type",
        component: AssuranceMainListComponent,
      },
      {
        path: "draft-assurance",
        component: AssuranceMainListComponent,
      },
      {
        path: "culling-assurance",
        component: QuestionCullingAssuranceComponent,
      },
      {
        path: "assurance-view/:id",
        component: AssuranceViewComponent,
      },
      {
        path: "draft-list-view/:id",
        component: DraftListViewComponent,
      },
      {
        path: "mark-assurance/:id",
        component: MarkAssuranceComponent,
      },
      {
        path: "addtobank",
        component: QuestionNoticeAddtobankComponent,
      },
      {
        path: "answer-status-list",
        component: AnswerStatusListComponent,
      },
      {
        path: "approved-answer-status-list",
        component: AnswerStatusListComponent,
      },
      {
        path: "create-answer-status-list",
        component: CreateAnswerStatusListComponent,
      },
      {
        path: "submit-answer-status-list/:listId",
        component: CreateAnswerStatusListComponent,
      },
      {
        path: "process-answer-status-list/:listId",
        component: ProcessAnswerStatusListComponent,
      },
      {
        path: "starred-booklet",
        component: StarredBookletComponent,
      },
      {
        path: "unstarred-booklet",
        component: UnStarredBookletComponent,
      },
      {
        path: "question-correctionview/:id/:status",
        component: QuestionCorrectionViewComponent,
      },
      {
        path: "list-dept-clubw/:status",
        component: QuestionClubbWithdwComponent,
      },
      { path: "qstn-cos-rpt", component: QuestionReportComponent },
      { path: "qstn-aod-rpt", component: QuestionReportComponent },
      { path: "qstn-soa-rpt", component: QuestionReportComponent },
      { path: "qstn-starredqstn-rpt", component: QuestionReportComponent },
      { path: "qstn-unstarredqstn-rpt", component: QuestionReportComponent },
      { path: "qstn-ballotchart-rpt", component: QuestionReportComponent },
      { path: "qstn-soactivity-rpt", component: QuestionReportComponent },
      { path: "qstn-ans-statistics-rpt", component: QuestionReportComponent },
      {
        path: "snq-send-dept",
        component: QuestionSenttoDeptComponent,
      },
      { path: "list-snq-ans", component: QuestionListDeptComponent },
      {
        path: "late-answer-bulletin",
        component: LateAnswerBulletinListComponent,
      },
      {
        path: "approved-late-answer-bulletin",
        component: LateAnswerBulletinListComponent,
      },
      {
        path: "create-late-answer-bulletin",
        component: CreateLateAnswerBulletinComponent,
      },
      {
        path: "submit-late-answer-bulletin/:listId",
        component: CreateLateAnswerBulletinComponent,
      },
      {
        path: "process-late-answer-bulletin/:listId",
        component: ProcessLateAnswerBulletinComponent,
      },
      {
        path: "delay-statement-list",
        component: ListDelayStatementListComponent,
      },
      {
        path: "approved-delay-statement-list",
        component: ListDelayStatementListComponent,
      },
      {
        path: "create-delay-statement-list",
        component: CreateDelayStatementListComponent,
      },
      {
        path: "submit-delay-statement-list/:listId",
        component: CreateDelayStatementListComponent,
      },
      {
        path: "process-delay-statement-list/:listId",
        component: CreateDelayStatementListComponent,
      },
      {
        path: "set-delay-statement-list",
        component: ListDelayStatementListComponent,
      },
      {
        path: "ppo-config",
        component: QuestionPPOConfigComponent,
      },
      {
        path: "snq-view/:id",
        component: ShortNoticeViewComponent,
      },
      { path: "clubbing-view/:id", component: ClubbingViewComponent },
      { path: "clubbing-list", component: QuestionClubbingListComponent },
      { path: "authorize-list", component: AuthorizeListComponent },
      { path: "apv-late-answer-list", component: ApprovedLateAnswerListComponent },
      {
        path: 'booklet-flow',
        loadChildren: () => import('./booklet-approval/booklet-approval.module')
        .then(x => x.BookletApprovalModule)
      },
      {
        path: "published-bulletin",
        component: PublishedBullettinComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionRoutingModule {}
