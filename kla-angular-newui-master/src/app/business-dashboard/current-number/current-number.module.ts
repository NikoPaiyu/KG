import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrentNumberRoutingModule } from './current-number-routing.module';
import { CurrentNumberComponent } from './current-number.component';
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzCardModule } from 'ng-zorro-antd/card';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { CurrentNumberListComponent } from './current-number-list/current-number-list.component';



@NgModule({
  declarations: [CurrentNumberComponent, CurrentNumberListComponent],
  imports: [
    CommonModule,
    CurrentNumberRoutingModule,
    NzBreadCrumbModule,
    NzDividerModule,
    NzCardModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    NgZorroAntdModule
  ]
})
export class CurrentNumberModule { }
