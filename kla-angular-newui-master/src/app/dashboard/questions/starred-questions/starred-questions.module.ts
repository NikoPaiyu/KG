import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { NzDrawerModule, NzEmptyModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { StarredfolderComponent } from './starredfolder/starredfolder.component';
import { StarredQuestionsComponent } from './starred-questions.component';
import { StarredQuestionsRoutingModule } from './starred-questions-routing.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [StarredfolderComponent, StarredQuestionsComponent],
  imports: [
    CommonModule,
    PdfJsViewerModule,
    NzDrawerModule,
    FormsModule,
    NzEmptyModule,
    StarredQuestionsRoutingModule,
    NzSelectModule,
    TranslateModule
  ]
})
export class StarredQuestionsModule { }
