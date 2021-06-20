import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnstarredQuestionsComponent } from './unstarred-questions.component';
import { UnstarredfolderComponent } from './unstarredfolder/unstarredfolder.component';
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { FormsModule } from "@angular/forms";
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { UnstarredQuestionsRoutingModule } from './unstarred-questions-routing.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    declarations: [UnstarredQuestionsComponent, UnstarredfolderComponent],
    imports: [
        CommonModule,
        PdfJsViewerModule,
        NzDrawerModule,
        FormsModule,
        NzEmptyModule,
        UnstarredQuestionsRoutingModule,
        NzSelectModule,
        TranslateModule
    ]
})
export class UnstarredQuestionsModule { }