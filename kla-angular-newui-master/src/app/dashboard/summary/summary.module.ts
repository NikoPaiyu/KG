import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SummaryRoutingModule } from "./summary-routing.module";
import { SummaryComponent } from "./summary.component";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { FormsModule } from "@angular/forms";
import { SummaryfolderComponent } from './summaryfolder/summaryfolder.component';
import { CoverModule } from '../cover/cover.module';
import { MscModule } from './Miscellaneous/msc.module';
import { SummarysubfolderComponent } from './summaryfolder/summarysubfolder/summarysubfolder.component'
import { SummaryfolderModule } from './summaryfolder/summaryfolder.module';
import { TranslateModule } from '@ngx-translate/core'
@NgModule({
  declarations: [SummaryComponent],
  entryComponents: [],
  imports: [
    CommonModule,
    SummaryRoutingModule,
    PdfJsViewerModule,
    NzDrawerModule,
    FormsModule,
    CoverModule,
    MscModule,
    SummaryfolderModule,
    TranslateModule
  ]
})
export class SummaryModule { }
