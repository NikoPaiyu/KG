import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticeProcessRoutingModule } from './notice-process-routing.module';
import { NoticeProcessComponent } from './notice-process.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';


@NgModule({
  declarations: [NoticeProcessComponent],
  imports: [
    CommonModule,
    NoticeProcessRoutingModule,
    NgZorroAntdModule
  ]
})
export class NoticeProcessModule { }
