import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BudgetRoutingModule } from "./budget-routing.module";
import { BudgetComponent } from "./budget.component";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { BudgetfolderComponent } from './budgetfolder/budgetfolder.component';
import { NzEmptyModule, NzInputModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [BudgetComponent, BudgetfolderComponent],
  entryComponents: [],
  imports: [
    CommonModule,
    BudgetRoutingModule,
    NzDrawerModule,
    NzEmptyModule,
    PdfJsViewerModule,
    FormsModule,
    NzInputModule,
    FormsModule,
    NzSelectModule,
    TranslateModule
  ]
})
export class BudgetModule { }
