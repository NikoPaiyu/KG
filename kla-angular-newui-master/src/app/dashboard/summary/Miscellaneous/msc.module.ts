import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MscSummaryComponent } from './mscsummary.component';
import { MscfolderComponent } from './mscfolder/mscfolder.component';
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { FormsModule } from "@angular/forms";
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { MscRoutingModule } from './msc-routing.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TranslateModule } from '@ngx-translate/core'


@NgModule({
  declarations: [MscSummaryComponent, MscfolderComponent],
  imports: [
    CommonModule,
    PdfJsViewerModule,
    NzDrawerModule,
    FormsModule,
    NzEmptyModule,
    MscRoutingModule,
    NzSelectModule,
    TranslateModule
  ]
})
export class MscModule { }
