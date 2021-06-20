import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MinisterRoutingModule } from './minister-routing.module';
import { ViewConvenienceComponent } from './view-convenience/view-convenience.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzBreadCrumbModule, NzTabsModule } from 'ng-zorro-antd';
import { ListConvenienceComponent } from './list-convenience/list-convenience.component';
import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  declarations: [ListConvenienceComponent, ViewConvenienceComponent],
  imports: [
    CommonModule,
    MinisterRoutingModule,
    NzTableModule,
    NzBreadCrumbModule,
    NzTabsModule,
    TranslateModule
  ]
})
export class MinisterModule { }
