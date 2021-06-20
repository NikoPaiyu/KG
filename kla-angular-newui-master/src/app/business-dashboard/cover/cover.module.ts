import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CoverRoutingModule } from "./cover-routing.module";
import { CoverComponent } from "./cover.component";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { FormsModule } from "@angular/forms";
import { PdfViewerComponent } from "src/app/shared/components/pdf-viewer/pdf-viewer.component";
import { CoverfolderComponent } from './coverfolder/coverfolder.component';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [CoverComponent, CoverfolderComponent],
  entryComponents: [],
  imports: [
    CommonModule,
    CoverRoutingModule,
    PdfJsViewerModule,
    NzDrawerModule,
    FormsModule,
    NzEmptyModule,
    NzSelectModule,
    TranslateModule
  ]
})
export class CoverModule { }
