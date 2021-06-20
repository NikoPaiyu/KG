import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { VoteStartRoutingModule } from "./vote-start-routing.module";
import { VoteStartComponent } from "./vote-start.component";
import { InitiateVoteComponent } from './initiate-vote/initiate-vote.component';
import { LobService } from "../../business-dashboard/lob/shared/services/lob.service";
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core';

//import {LobListingComponent} from "../../business-dashboard/lob/lob-listing/lob-listing.component"

@NgModule({
  providers:[LobService],
  declarations: [VoteStartComponent, InitiateVoteComponent],
  imports: [CommonModule,TranslateModule, VoteStartRoutingModule, NgZorroAntdModule,FormsModule,ReactiveFormsModule],
})
export class VoteStartModule {}
