import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { BallotingRoutingModule } from './balloting-routing.module';
import { BallotingComponent } from './balloting.component';
import { PerformBallotingComponent } from './perform-balloting/perform-balloting.component';
import { CreateBulletinFormModule } from '../shared/components/create-bulletin-form/create-bulletin-form.module';
import { BallotListViewComponent } from './ballot-list-view/ballot-list-view.component';


@NgModule({
  declarations: [BallotingComponent, PerformBallotingComponent, BallotListViewComponent ],
  imports: [
    CommonModule,
    BallotingRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CreateBulletinFormModule
  ],
  exports: [BallotListViewComponent]
})
export class BallotingModule { }
