import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilePopupComponent } from './file-popup.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [FilePopupComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [FilePopupComponent]
})
export class FilePopupModule { }
