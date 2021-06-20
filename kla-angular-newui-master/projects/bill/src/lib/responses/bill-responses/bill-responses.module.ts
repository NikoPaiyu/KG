import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BillResponsesRoutingModule } from './bill-responses-routing.module';
import { BillResponsesComponent } from './bill-responses.component';



@NgModule({
  declarations: [BillResponsesComponent,],
  imports: [
    CommonModule,
    BillResponsesRoutingModule,
    NgZorroAntdModule ,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule 

  ]
})
export class BillResponsesModule { }
