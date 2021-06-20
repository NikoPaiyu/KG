import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FileuploadComponent } from "./fileupload.component";
// import { SummaryComponent } from "../fileupload/summary/summary.component";
// import { BudgetComponent } from "../fileupload/budget/budget.component";
import { RulesAndProcedureComponent } from "../fileupload/rules-and-procedure/rules-and-procedure.component";
// import { MscSummaryComponent } from '../fileupload/miscellaneous/mscsummary.component';
// import { StarredQuestionsComponent } from '../fileupload/starred-questions/starred-questions.component';
// import { UnstarredQuestionsComponent } from '../fileupload/unstarred-questions/unstarred-questions.component';
// import { DocumentsComponent } from './documents/documents.component';

const routes: Routes = [
  {
    path: "",
    component: FileuploadComponent,
    children: [
      // {
      //   path: "summary",
      //   component: SummaryComponent
      // },
      // {
      //   path: "budget",
      //   component: BudgetComponent
      // },
      {
        path: "rules",
        component: RulesAndProcedureComponent
      }
      // {
      //   path:"miscellaneous",
      //   component:MscSummaryComponent
      // },
      // {
      //   path:"documents",
      //   component:DocumentsComponent
      // },
      // {
      //   path:"starred-questions",
      //   component:StarredQuestionsComponent
      // },
      // {
      //   path:"unstarred-questions",
      //   component:UnstarredQuestionsComponent
      // }   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileuploadRoutingModule {}
