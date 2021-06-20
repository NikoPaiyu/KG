import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryfolderRoutingModule } from './summaryfolder-routing.module';
import { FormsModule } from '@angular/forms';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { SummaryfolderComponent } from './summaryfolder.component';
import { SummarysubfolderComponent } from './summarysubfolder/summarysubfolder.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TranslateModule } from '@ngx-translate/core'



@NgModule({
  declarations: [SummaryfolderComponent, SummarysubfolderComponent],
  imports: [
    CommonModule,
    PdfJsViewerModule,
    NzDrawerModule,
    FormsModule,
    NzEmptyModule,
    SummaryfolderRoutingModule,
    NzSelectModule,
    TranslateModule
  ]
})
export class SummaryfolderModule { }
