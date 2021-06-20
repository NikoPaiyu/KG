import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RulesAndProcedureRoutingModule } from "./rules-and-procedure-routing.module";
import { RulesAndProcedureComponent } from "./rules-and-procedure.component";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [RulesAndProcedureComponent],
  entryComponents: [],
  imports: [
    CommonModule,
    RulesAndProcedureRoutingModule,
    PdfJsViewerModule,
    NzDrawerModule,
    NzSelectModule,
    FormsModule,
    TranslateModule
  ]
})
export class RulesAndProcedureModule { }
