import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { QuestionsRoutingModule } from "./questions-routing.module";
import { QuestionsComponent } from "./questions.component";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { FormsModule } from "@angular/forms";
import { UnstarredQuestionsModule } from './unstarred-questions/unstarred-questions.module';
import { StarredQuestionsModule } from './starred-questions/starred-questions.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [QuestionsComponent],
  entryComponents: [],
  imports: [
    CommonModule,
    QuestionsRoutingModule,
    PdfJsViewerModule,
    NzDrawerModule,
    FormsModule,
    UnstarredQuestionsModule,
    StarredQuestionsModule,
    TranslateModule
  ]
})
export class QuestionsModule {}
