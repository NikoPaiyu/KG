import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetDocumentRoutingModule } from './budget-document-routing.module';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { CreateFileComponent } from '../files/create-file/create-file.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StmtDemandsGrantsModule } from './stmt-demands-grants/stmt-demands-grants.module';
import { CutMotionModule } from './cut-motion/cut-motion.module';
import { DemandDraftScheduleModule } from './demand-draft-schedule/demand-draft-schedule.module';
import { ListBudgetDocLetterComponent } from './budget-grl/list-budget-doc-letter/list-budget-doc-letter.component';
import { BudgetDocumentComponent } from './budget-document.component';
import { QuillModule } from 'ngx-quill';
import { BudgetDocReplyLetterComponent } from './budget-doc-reply-letter/budget-doc-reply-letter.component';
import { CreateBudgetdocGRLComponent } from './budget-grl/create-budgetdoc-grl/create-budgetdoc-grl.component';
import { BudgetMainComponent } from './budget-main/budget-main.component';
import { CreateBudgetComponent } from './budget-main/create-budget/create-budget.component';
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { BudgetGrlReplyContentComponent } from './budget-grl/budget-grl-reply-content/budget-grl-reply-content.component';


let Components = [ListBudgetDocLetterComponent,BudgetDocumentComponent,BudgetDocReplyLetterComponent,CreateBudgetdocGRLComponent
  ,BudgetMainComponent,CreateBudgetComponent]

@NgModule({
  declarations: [...Components, BudgetGrlReplyContentComponent],
  imports: [
    CommonModule,
    BudgetDocumentRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    StmtDemandsGrantsModule,
    DemandDraftScheduleModule,
    CutMotionModule,
    NgxDocViewerModule,
    QuillModule.forRoot(),
  ],
  entryComponents: [CreateFileComponent,CreateBudgetdocGRLComponent,CreateBudgetComponent],
  exports:[ BudgetDocReplyLetterComponent,BudgetGrlReplyContentComponent]
})
export class BudgetDocumentModule { }
