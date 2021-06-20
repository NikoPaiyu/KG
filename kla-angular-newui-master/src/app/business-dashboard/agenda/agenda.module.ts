import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AgendaRoutingModule } from "./agenda-routing.module";
import { AgendaComponent } from "./agenda.component";
import { AgendaListingComponent } from "./agenda-listing/agenda-listing.component";
import { AgendaCreateComponent } from "./agenda-create/agenda-create.component";
import { CreateItemComponent } from "./create-item/create-item.component";
import { CalenderofsittingService } from "../calender-of-sitting/shared/services/calenderofsitting.service";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AgendaServiceService } from "./shared/services/agenda-service.service";
import { UserManagementService } from "../user-management/shared/services/user-management.service";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { SpeakerNoteService } from "src/app/dashboard/shared/services/speaker-note.service";
import { NgxSortableModule } from "ngx-sortable";
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    AgendaComponent,
    AgendaListingComponent,
    AgendaCreateComponent,
    CreateItemComponent
  ],
  entryComponents: [CreateItemComponent],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSortableModule,
    TranslateModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger"
    })
  ],
  providers: [
    AgendaServiceService,
    CalenderofsittingService,
    UserManagementService,
    SpeakerNoteService
  ]
})
export class AgendaModule {
  
}