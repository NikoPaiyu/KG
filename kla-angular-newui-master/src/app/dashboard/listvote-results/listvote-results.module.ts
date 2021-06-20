import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListvoteResultsRoutingModule } from './listvote-results-routing.module';
import { ListvoteResultsComponent } from './listvote-results.component';
import {VoteResultsComponent} from './vote-results/vote-results.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ListvoteResultsComponent,VoteResultsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ListvoteResultsRoutingModule,FormsModule, ReactiveFormsModule ,NgZorroAntdModule,NzInputModule
  ]
})
export class ListvoteResultsModule { }
