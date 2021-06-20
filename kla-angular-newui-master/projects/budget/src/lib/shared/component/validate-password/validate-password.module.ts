import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidatePasswordComponent } from './validate-password.component';

import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [ValidatePasswordComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    ValidatePasswordComponent
  ]
})
export class ValidatePasswordModule { }
