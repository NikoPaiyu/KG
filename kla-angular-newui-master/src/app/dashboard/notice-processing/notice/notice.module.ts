import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticeRoutingModule } from './notice-routing.module';
import { SelectNoticeTypeComponent } from './select-notice-type/select-notice-type.component';
import { CreateNoticeComponent } from './create-notice/create-notice.component';
import { ListNoticeComponent } from './list-notice/list-notice.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NgZorroAntdModule } from 'ng-zorro-antd';


@NgModule({
  declarations: [SelectNoticeTypeComponent, CreateNoticeComponent, ListNoticeComponent],
  imports: [
    CommonModule,
    NoticeRoutingModule,
    NzBreadCrumbModule,
    NzDividerModule,
    NzButtonModule,
    NzCardModule,
    NgZorroAntdModule
  ]
})
export class NoticeModule { }
