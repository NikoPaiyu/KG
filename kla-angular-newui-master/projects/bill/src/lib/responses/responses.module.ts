import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponsesRoutingModule } from './responses-routing.module';
import { ResponsesComponent } from './responses.component';
import { OrdinanceDisapprovalComponent } from './ordinance-disapproval/ordinance-disapproval.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillResponseslistComponent } from './bill-responseslist/bill-responseslist.component'
import { QuillModule } from "ngx-quill";
import { BillAmendmentsModule } from '../bill-amendments/bill-amendments.module';
@NgModule({
  declarations: [ResponsesComponent, OrdinanceDisapprovalComponent,BillResponseslistComponent],
  imports: [
    CommonModule,
    ResponsesRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    BillAmendmentsModule,
    QuillModule.forRoot(),
  ]
})
export class ResponsesModule { }
