import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BudgetSpeechComponent } from './budget-speech.component';
import { ListPublishedBsComponent } from './list-published-bs/list-published-bs.component';

const routes: Routes = [
  {
    path: "",
    component: BudgetSpeechComponent,
    children: [
      {
        path: "published-bs",
        component: ListPublishedBsComponent,
      }
    ],
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetSpeechRoutingModule { }
