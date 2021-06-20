import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { VoteStartComponent } from "./vote-start.component";
import { InitiateVoteComponent } from './initiate-vote/initiate-vote.component';


const routes: Routes = [{
  path: "", component: VoteStartComponent, children: [{
    path: "", component: InitiateVoteComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoteStartRoutingModule { }
