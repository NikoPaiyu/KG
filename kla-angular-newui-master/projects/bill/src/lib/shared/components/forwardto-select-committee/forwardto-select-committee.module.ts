import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForwardtoSelectCommitteeComponent } from './forwardto-select-committee.component';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [ForwardtoSelectCommitteeComponent],
  imports: [
    CommonModule,NgZorroAntdModule,TranslateModule,FormsModule,ReactiveFormsModule,
  ],
  exports:[ForwardtoSelectCommitteeComponent],
})
export class ForwardtoSelectCommitteeModule { }
