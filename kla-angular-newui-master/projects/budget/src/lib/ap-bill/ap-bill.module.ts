import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillFullViewModule } from './bill-full-view/bill-full-view.module';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ApBillOnBudgetModule } from './ap-bill-on-budget/ap-bill-on-budget.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,BillFullViewModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ApBillOnBudgetModule
  ]
})
export class ApBillModule { }
