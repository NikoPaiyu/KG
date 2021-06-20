import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddConstituencyComponent } from './add-constituency.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [AddConstituencyComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule
  ],
  exports: [AddConstituencyComponent]
})
export class AddConstituencyModule { }
