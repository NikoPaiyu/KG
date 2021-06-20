import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookletApprovalRoutingModule } from './booklet-approval-routing.module';
import { ListBookletComponent } from './list-booklet/list-booklet.component';
import { BooletFlowComponent } from './boolet-flow/boolet-flow.component';
import { NzDividerModule, NzBreadCrumbModule, NzFormModule, NzTabsModule, NzSelectModule, NzTableModule, NzPopoverModule, NzInputModule, NzModalModule, NzButtonModule, NzPopconfirmModule, NzDrawerModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { QuestionsModule } from 'src/app/dashboard/questions/questions.module';
import { QuestionModule } from '../question.module';
import { FileFlowModule } from '../../shared/file-flow/file-flow.module';


@NgModule({
  declarations: [ListBookletComponent, BooletFlowComponent],
  imports: [
    CommonModule,
    BookletApprovalRoutingModule,
    NzBreadCrumbModule,
    NzDividerModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzTabsModule,
    NzSelectModule,
    NzTableModule,
    NzPopoverModule,
    TranslateModule,
    NzInputModule,
    NzModalModule,
    NzButtonModule,
    NzPopconfirmModule,
    QuestionsModule,
    NzDrawerModule,
    QuestionModule,
    FileFlowModule
  ]
})
export class BookletApprovalModule { }
