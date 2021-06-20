import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { BusinessManagementRoutingModule } from "./business-management-routing.module";
import { BusinessManagementComponent } from "./business-management.component";
import { LiveBusinessManagementComponent } from "./live-business-management/live-business-management.component";
import { FilterBusinessLines } from "./live-business-management/filterBusinessLines.pipe";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { FilterPlayingMember } from "./live-business-management/filterPlayingMember.pipe";
import { NgxTimerModule } from "ngx-timer";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { PinchZoomModule } from "ngx-pinch-zoom";
import { ReactiveFormsModule } from "@angular/forms";
import { MemberswitchComponent } from "./shared/component/memberswitch/memberswitch.component";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  entryComponents: [MemberswitchComponent],
  declarations: [
    BusinessManagementComponent,
    LiveBusinessManagementComponent,
    FilterBusinessLines,
    FilterPlayingMember,
    MemberswitchComponent
  ],
  imports: [
    CommonModule,TranslateModule,
    BusinessManagementRoutingModule,
    NgZorroAntdModule,
    PdfViewerModule,
    PinchZoomModule,
    ReactiveFormsModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger"
    }),
    NgxTimerModule,
    FormsModule
  ]
})
export class BusinessManagementModule {}
