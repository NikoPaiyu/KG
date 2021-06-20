import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UnstarredfolderComponent } from "./unstarredfolder/unstarredfolder.component";
import { UnstarredQuestionsComponent } from './unstarred-questions.component';
const routes: Routes = [
  {
    path: "",
    component: UnstarredQuestionsComponent
  },
  {
    path: ":folder",
    component: UnstarredfolderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnstarredQuestionsRoutingModule { }