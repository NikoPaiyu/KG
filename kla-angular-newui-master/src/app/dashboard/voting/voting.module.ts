import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { VotingRoutingModule } from "./voting-routing.module";
import { VotingComponent } from "./voting.component";
import { VotingResultComponent } from "./voting-result/voting-result.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import {VoteResultsComponent} from "./vote-results/vote-results.component";

@NgModule({
  declarations: [VotingComponent,VoteResultsComponent],
  imports: [CommonModule, VotingRoutingModule, NgZorroAntdModule]
})
export class VotingModule {}
