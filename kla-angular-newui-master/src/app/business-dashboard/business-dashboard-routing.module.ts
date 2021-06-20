import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BusinessDashboardComponent } from "./business-dashboard.component";
import { SeatManagementModule } from "./seat-management/seat-management.module";
import { NotificationListComponent } from "../shared/components/notification-list/notification-list.component";
const routes: Routes = [
  {
    path: "",
    component: BusinessDashboardComponent,
    children: [
      // {
      //   path: "",
      //   redirectTo: "agenda",
      //   pathMatch: "full"
      // },
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
      {
        path: "lob",
        loadChildren: "./lob/lob.module#LobModule",
        data: {
          breadcrumb: "List Of Business",
        },
      },
      {
        path: "user-management",
        loadChildren:
          "./user-management/user-management.module#UserManagementModule",
        data: {
          breadcrumb: "User Management",
        },
      },
      {
        path: 'auction',
        loadChildren : '../dashboard/auction/auction.module#AuctionModule'
      },
      {
        path: "rules-and-directions",
        loadChildren:
          "./rules-and-directions/rules-and-directions.module#RulesAndDirectionsModule",
        data: {
          breadcrumb: "rules-and-directions",
        },
      },

      {
        path: "sitting",
        loadChildren:
          "./calender-of-sitting/calender-of-sitting.module#CalenderOfSittingModule",
        data: {
          breadcrumb: "User Management",
        },
      },
      {
        path: "seat-management",
        loadChildren:
          "./seat-management/seat-management.module#SeatManagementModule",
        data: {
          breadcrumb: "Seat Management",
        },
      },
      {
        path: "attendance-management",
        loadChildren:
          "./attendance-management/attendance-management.module#AttendanceManagementModule",
        data: {
          breadcrumb: "Attendance Management",
        },
      },
      {
        path: "bulletin",
        loadChildren: "./bullettin/bullettin.module#BullettinModule",
        data: {
          breadcrumb: "Bulletin",
        },
      },
      {
        path: "role-management",
        loadChildren:
          "./role-management/role-management.module#RoleManagementModule",
        data: {
          breadcrumb: "Role Management",
        },
      },
      {
        path: "question",
        loadChildren: "./question/question.module#QuestionModule",
        data: {
          breadcrumb: "Question",
        },
      },

      {
        path: "aod",
        loadChildren: "./aod/aod.module#AodModule",
        data: {
          breadcrumb: "Aod",
        },
      },

      {
        path: "schedule-of-activity",
        loadChildren:
          "./schedule-of-activity/schedule-of-activity.module#ScheduleOfActivityModule",
        data: {
          breadcrumb: "Schedule of activity",
        },
      },
      {
        path: "help",
        loadChildren: "./help/help.module#HelpModule",
        data: {
          breadcrumb: "Help",
        },
      },
      {
        path: "fileupload",
        loadChildren: "./fileupload/fileupload.module#FileuploadModule",
      },
      {
        path: "current-number",
        loadChildren:
          "./current-number/current-number.module#CurrentNumberModule",
      },
      {
        path: "bullettin-current-number",
        loadChildren:
          "./bullettin-current-number/bullettin-current-number.module#BullettinCurrentNumberModule",
      },
      {
        path: "startvote",
        loadChildren: "./vote-start/vote-start.module#VoteStartModule",
      },

      {
        path: "runningnote",
        loadChildren: "./running-note/running-note.module#RunningNoteModule",
      },
      {
        path: "agenda",
        loadChildren: "./agenda/agenda.module#AgendaModule",
      },
      {
        path: "home",
        loadChildren: "./home/home.module#HomeModule",
      },
      {
        path: "business-management",
        loadChildren:
          "./business-management/business-management.module#BusinessManagementModule",
      },
      {
        path: "question",
        loadChildren: "./question/question.module#QuestionModule",
        data: {
          breadcrumb: "Question",
        },
      },
      {
        path: "question",
        loadChildren: "./question/question.module#QuestionModule",
        data: {
          breadcrumb: "Question",
        },
      },
      {
        path: "aod",
        loadChildren: "./aod/aod.module#AodModule",
        data: {
          breadcrumb: "Aod",
        },
      },
      {
        path: "rules-and-directions",
        loadChildren:
          "./rules-and-directions/rules-and-directions.module#RulesAndDirectionsModule",
        data: {
          breadcrumb: "rules-and-directions",
        },
      },
      {
        path: "soa",
        loadChildren: "./soa/soa.module#SoaModule",
        data: {
          breadcrumb: "Schedule of activity",
        },
      },
      {
        path: "bulletin",
        loadChildren: () =>
          import("./bullettin/bullettin.module").then((x) => x.BullettinModule),
        data: {
          breadcrumb: "Bulletin",
        },
      },
      {
        path: "cpl",
        loadChildren: "./cpl-wrapper.module#CplWrapperModule",
      },
      {
        path: "notice",
        loadChildren: () =>
          import("./notice-processing/notice-processing.module").then(
            (x) => x.NoticeProcessingModule
          ),
      },
      {
        path: "notification",
        component: NotificationListComponent,
      },
      {
        path: "main",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((x) => x.DBModule),
        data: {
          breadcrumb: "Dashboard",
        },
      },
      {
        path: "submission",
        loadChildren:
          "../dashboard/submission/submission.module#SubmissionModule",
      },
      {
        path: "lob-view",
        loadChildren: "../dashboard/lobview/lobview.module#LobviewModule",
      },

      {
        path: "questions",
        loadChildren: "../dashboard/questions/questions.module#QuestionsModule",
      },
      {
        path: "documents",
        loadChildren: "../dashboard/summary/summary.module#SummaryModule",
      },
      {
        path: "cover",
        loadChildren: "../dashboard/cover/cover.module#CoverModule",
      },
      {
        path: "configuration",
        loadChildren: "./configuration/configuration.module#ConfigurationModule",
      },
      {
        path: "Rules",
        loadChildren:
          "../dashboard/rules-and-procedure/rules-and-procedure.module#RulesAndProcedureModule",
      },
      {
        path: "bill",
        loadChildren: "./bill-wrapper.module#BillWrapperModule",
      },
      {
        path: "correspondence",
        loadChildren:
          "./correspondence-wrapper.module#CorrespondenceWrapperModule",
      },
      {
        path: "committee",
        loadChildren: "./committee-wrapper.module#CommitteeWrapperModule",
      },
      {
        path: "pmbr",
        loadChildren: () =>
          import("./pmbr-wrapper.module").then((p) => p.PmbrWrapperModule),
      },
      {
        path: "tables",
        loadChildren: "./tables-wrapper.module#TablesWrapperModule",
      },
      {
        path: "vote-results",
        loadChildren:
          "../dashboard/listvote-results/listvote-results.module#ListvoteResultsModule",
      },
      {
        path: "office",
        loadChildren: "./office-wrapper.module#OfficeWrapperModule",
      },
      {
        path: "budget",
        loadChildren: "../dashboard/budget/budget.module#BudgetModule",
      },
      {
        path: "budgets",
        loadChildren: () =>
          import("./budget-wrapper.module").then(
            (bu) => bu.BudgetWrapperModule
          ),
      },
      {
        path: "generic-file",
        loadChildren: () =>
          import("./genericfile-wrapper.module").then(
            (p) => p.GenericfileWrapperModule
          ),
      },
      {
        path: "digitisation",
        loadChildren: () =>
          import("./digitisation-wrapper.module").then(
            (d) => d.DigitisationWrapperModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessDashboardRoutingModule { }
