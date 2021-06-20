import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { QuestionModule } from "../question/question.module";
import { CplModule } from "projects/cpl/src/lib/cpl.module";

import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    QuestionModule,
    CplModule,
    NgZorroAntdModule,
    TranslateModule
  ]
})
export class DBModule { }
