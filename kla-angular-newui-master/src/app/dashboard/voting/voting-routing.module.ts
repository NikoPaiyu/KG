import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { VotingResultComponent } from "./voting-result/voting-result.component";
import {VoteResultsComponent} from "./vote-results/vote-results.component";


const routes: Routes = [
  { path: "", redirectTo: "voting-result" },
  { path: "voting-result", component: VotingResultComponent },
  {path:"vote-results",component:VoteResultsComponent}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VotingRoutingModule {}
