import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { QuestionsComponent } from "./questions.component";
import { StarredQuestionsComponent } from "./starred-questions/starred-questions.component";
import { UnstarredQuestionsComponent } from "./unstarred-questions/unstarred-questions.component";

const routes: Routes = [
  {
    path: "",
    component: QuestionsComponent
  },
  {
    path: "starred-questions",
    component: StarredQuestionsComponent
  },
  {
    path: "unstarred-questions",
    component: UnstarredQuestionsComponent
  },
  {
    path: "unstarred-questions",
    loadChildren: './unstarred-questions/unstarred-questions.module#UnstarredQuestionsModule'
  },
  {
    path: "starred-questions",
    loadChildren: './starred-questions/starred-questions.module#StarredQuestionsModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionsRoutingModule { }