import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatPlanListRoutingModule } from './seat-plan-list-routing.module';
import { SeatPlanListComponent } from './seat-plan-list.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SeatPlanListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SeatPlanListRoutingModule,
    NzSelectModule,
    NzTableModule,
    NzBreadCrumbModule,
    NzDividerModule,
    NzModalModule,
    NgZorroAntdModule,
    TranslateModule
  ]
})
export class SeatPlanListModule { }
