import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CurrentBusinessRoutingModule } from "./current-business-routing.module";
import { CurrentBusinessComponent } from "./current-business.component";
import { LiveScreenComponent } from "./live-screen/live-screen.component";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { NzProgressModule } from "ng-zorro-antd/progress";
import { UserManagementService } from "src/app/business-dashboard/user-management/shared/services/user-management.service";
import { TranslateModule } from "@ngx-translate/core";
import { PinchZoomModule } from "ngx-pinch-zoom";

@NgModule({
  declarations: [CurrentBusinessComponent, LiveScreenComponent],
  providers: [UserManagementService],
  imports: [
    CommonModule,
    NzProgressModule,
    CurrentBusinessRoutingModule,
    PdfViewerModule,
    PinchZoomModule,
    TranslateModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger"
    })
  ]
})
export class CurrentBusinessModule {}
