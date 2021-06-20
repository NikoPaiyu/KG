import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BusinessDashboardRoutingModule } from "./business-dashboard-routing.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BusinessDashboardComponent } from "./business-dashboard.component";
import { VotingService } from "../dashboard/voting/shared/services/voting.service";
import { NormalPdfViewerComponent } from "./shared/components/normal-pdf-viewer/normal-pdf-viewer.component";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { NormalPdfviewerService } from "./shared/services/normal-pdfviewer.service";
import { UserManagementService } from "./user-management/shared/services/user-management.service";
import { TranslateModule } from "@ngx-translate/core";
import { NotificationCustomService } from '../shared/services/notification.service';
import { NotificationListComponent } from "../shared/components/notification-list/notification-list.component";


@NgModule({
  declarations: [
    BusinessDashboardComponent,
    NormalPdfViewerComponent,
    NotificationListComponent,
  ],
  imports: [
    CommonModule,
    BusinessDashboardRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    PdfJsViewerModule,
    TranslateModule,
    PdfJsViewerModule,TranslateModule
  ],
  providers: [VotingService, NormalPdfviewerService, UserManagementService,    
    {provide: 'notify', useValue: NotificationCustomService}],
  entryComponents: [NormalPdfViewerComponent]
})
export class BusinessDashboardModule {}
