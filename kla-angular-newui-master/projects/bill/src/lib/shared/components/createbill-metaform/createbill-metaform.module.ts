import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatebillMetaformComponent } from './createbill-metaform.component';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [CreatebillMetaformComponent],
  imports: [
    CommonModule,NgZorroAntdModule,TranslateModule,FormsModule,ReactiveFormsModule,
  ],
  exports:[CreatebillMetaformComponent],
  entryComponents: [CreatebillMetaformComponent]
})
export class CreatebillMetaformModule { }
