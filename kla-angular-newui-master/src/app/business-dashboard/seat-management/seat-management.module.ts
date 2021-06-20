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
import { TranslateModule } from "@ngx-translate/core";
import { SectionSeatConfrigurationComponent } from './section-seat-confriguration/section-seat-confriguration.component';
import { NzTableModule } from 'ng-zorro-antd/table';
@NgModule({
  declarations: [SeatLayoutComponent, SectionSeatConfrigurationComponent],
  imports: [
    CommonModule,TranslateModule,
    SeatManagementRoutingModule,
    FormsModule,
    NzButtonModule,
    NzFormModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NzDropDownModule,
    NzTableModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger"
    })
  ]
})
export class SeatManagementModule {}
