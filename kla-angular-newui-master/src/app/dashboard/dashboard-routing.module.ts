import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'current-business',
        pathMatch: 'full'
      },
      {
        path: 'document-reader',
        loadChildren:
          './document-reader/document-reader.module#DocumentReaderModule',
        data: {
          breadcrumb: 'Document Reader'
        }
      },
      {
        path: 'budget',
        loadChildren: './budget/budget.module#BudgetModule'
      },
      {
        path: 'rules',
        loadChildren:
          './rules-and-procedure/rules-and-procedure.module#RulesAndProcedureModule'
      },
      {
        path: 'documents',
        loadChildren: './summary/summary.module#SummaryModule'
      },
      {
        path: 'questions',
        loadChildren: './questions/questions.module#QuestionsModule'
      },
      {
        path: 'current-business',
        loadChildren:
          './current-business/current-business.module#CurrentBusinessModule'
      },
      {
        path: 'lob-view',
        loadChildren: './lobview/lobview.module#LobviewModule'
      },
      {
        path: 'seat',
        loadChildren:
          './seat-managementview/seat-managementview.module#SeatManagementModule'
      },
      {
        path: 'runningnote',
        loadChildren:
          "./runningnoteview/runningnoteview.module#RunningnoteviewModule"
      },
      {
        path: "current-speakernote",
        loadChildren:
          "./current-speakernote/current-speakernote.module#CurrentSpeakernoteModule"
      },
      {
        path: "handraise",
        loadChildren: "./hand-raise/hand-raise.module#HandRaiseModule"
      },
      {
        path: "speaker-business-management",
        loadChildren:
          "./speaker-business-management/speaker-business-management.module#SpeakerBusinessManagementModule"
      },
      {
        path: "submission",
        loadChildren: "./submission/submission.module#SubmissionModule"
      },
      { path:"vote-results", 
      loadChildren:"./listvote-results/listvote-results.module#ListvoteResultsModule"},
      // {
        
      //   path:"votingresult",
      //  loadChildren:"./voting-result/voting.module#VotingModule"

      // }
      {
        path: 'notice',
        loadChildren: () => import('../business-dashboard/notice-processing/notice-processing.module')
          .then(x => x.NoticeProcessingModule)
      },
      {
        path: "cpl",
        loadChildren:
        "./cpl-dashboard-wrapper.module#CplDashboardWrapperModule"
      },
      {
        path: "question",
        loadChildren: "../business-dashboard/question/question.module#QuestionModule",
        data: {
          breadcrumb: "Question"
        }
      }

      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
