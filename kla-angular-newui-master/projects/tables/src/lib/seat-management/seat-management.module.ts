import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SeatManagementRoutingModule } from "./seat-management-routing.module";
import { SeatLayoutComponent } from "./seat-layout/seat-layout.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzFormModule } from "ng-zorro-antd/form";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [SeatLayoutComponent],
  imports: [
    CommonModule,
    SeatManagementRoutingModule,
    FormsModule,
    NzButtonModule,
    NzFormModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NzDropDownModule,
    TranslateModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger"
    })
  ],
  exports: [SeatLayoutComponent]
})
export class SeatManagementModule {}
