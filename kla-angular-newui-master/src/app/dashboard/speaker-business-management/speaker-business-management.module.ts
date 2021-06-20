import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SpeakerBusinessManagementRoutingModule } from "./speaker-business-management-routing.module";
import { SpeakerBusinessManagementComponent } from "./speaker-business-management.component";
import { SpeakerLiveBusinessManagementComponent } from "./speaker-live-business-management/speaker-live-business-management.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { PinchZoomModule } from "ngx-pinch-zoom";
import { FilterBusinessLines } from "./speaker-live-business-management/filterBusinessLines.pipe";
import { UserManagementService } from "src/app/business-dashboard/user-management/shared/services/user-management.service";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    SpeakerBusinessManagementComponent,
    SpeakerLiveBusinessManagementComponent,
    FilterBusinessLines
  ],
  imports: [
    CommonModule,
    SpeakerBusinessManagementRoutingModule,
    NgZorroAntdModule,
    PdfViewerModule,
    PinchZoomModule,
    TranslateModule
  ],
  providers: [UserManagementService]
})
export class SpeakerBusinessManagementModule {}
