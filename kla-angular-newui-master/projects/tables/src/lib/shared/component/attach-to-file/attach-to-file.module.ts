import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgZorroAntdModule, NzTabsModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { AttachToFileComponent } from './attach-to-file.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [AttachToFileComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [AttachToFileComponent]
})
export class AttachToFileModule { }
