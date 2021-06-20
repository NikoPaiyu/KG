import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { M2mProcessionComponent } from './m2m-procession.component';



@NgModule({
  declarations: [M2mProcessionComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [M2mProcessionComponent]
})
export class M2MProcessionModule { }