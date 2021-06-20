import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LobRoutingModule } from "./lob-routing.module";
import { LobComponent } from "./lob.component";
import { LobListingComponent } from "./lob-listing/lob-listing.component";
import { LobCreateComponent } from "./lob-create/lob-create.component";
import { LobWorkflowComponent } from "./lob-workflow/lob-workflow.component";
import { NzTableModule } from "ng-zorro-antd/table";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { LobService } from "./shared/services/lob.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CreateQuestionComponent } from "./create-question/create-question.component";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { UserManagementService } from "../user-management/shared/services/user-management.service";
import { BusinessControllerViewComponent } from "./business-controller-view/business-controller-view.component";
import { CalenderofsittingService } from "../calender-of-sitting/shared/services/calenderofsitting.service";
import { NgxTimerModule } from "ngx-timer";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { StaffLobViewComponent } from "./stafflobview/stafflobview.component";
import { SpeakerNoteService } from "src/app/dashboard/shared/services/speaker-note.service";
import { NzEmptyModule } from "ng-zorro-antd/empty";
import { NgxSortableModule } from "ngx-sortable";
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  providers: [
    LobService,
    UserManagementService,
    CalenderofsittingService,
    SpeakerNoteService
  ],
  declarations: [
    LobComponent,
    LobListingComponent,
    LobCreateComponent,
    LobWorkflowComponent,
    CreateQuestionComponent,
    BusinessControllerViewComponent,
    StaffLobViewComponent
  ],
  entryComponents: [CreateQuestionComponent],
  imports: [
    CommonModule,TranslateModule,
    LobRoutingModule,
    NzTableModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    NgxTimerModule,
    NzEmptyModule,
    NgxSortableModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger"
    })
  ]
})
export class LobModule {}
