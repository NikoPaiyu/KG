import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BullettinCurrentNumberRoutingModule } from './bullettin-current-number-routing.module';
import { BullettinCurrentNumberComponent } from './bullettin-current-number.component';

import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzCardModule } from 'ng-zorro-antd/card';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [BullettinCurrentNumberComponent],
  imports: [
    CommonModule,
    BullettinCurrentNumberRoutingModule,
    NzBreadCrumbModule,
    NzDividerModule,
    NzCardModule,
    TranslateModule
  ]
})
export class BullettinCurrentNumberModule { }
