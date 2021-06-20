import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ApBillOnBudgetRoutingModule } from './ap-bill-on-budget-routing.module';
import { BudgetAppropriationRequestComponent } from './budget-appropriation-request/budget-appropriation-request.component';
import { ApBillOnBudgetComponent } from './ap-bill-on-budget.component';
import { QuillModule } from 'ngx-quill';
import { BudgetAppropriationReplyComponent } from './budget-appropriation-reply/budget-appropriation-reply.component';

@NgModule({
  declarations: [BudgetAppropriationRequestComponent, ApBillOnBudgetComponent, BudgetAppropriationReplyComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ApBillOnBudgetRoutingModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }],
          [{ direction: "rtl" }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
        ],
      },
    })

  ],
  entryComponents: [BudgetAppropriationRequestComponent,BudgetAppropriationReplyComponent],
  exports:[BudgetAppropriationRequestComponent,BudgetAppropriationReplyComponent]
})
export class ApBillOnBudgetModule { }
