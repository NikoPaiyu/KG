import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RunningNoteRoutingModule } from "./running-note-routing.module";
import { RunningNoteComponent } from "./running-note.component";
import { ListingComponent } from "./listing/listing.component";
import { CreateComponent } from "./create/create.component";
import { FormsModule } from "@angular/forms";
import { LobService } from "../lob/shared/services/lob.service";
import { AgendaServiceService } from "../agenda/shared/services/agenda-service.service";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { SpeakerNoteService } from "src/app/dashboard/shared/services/speaker-note.service";
import { NgxSortableModule } from "ngx-sortable";
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [RunningNoteComponent, ListingComponent, CreateComponent],
  imports: [
    CommonModule,TranslateModule,
    RunningNoteRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    PdfJsViewerModule,
    NgxSortableModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger"
    })
  ],
  entryComponents: [],
  providers: [LobService, AgendaServiceService, SpeakerNoteService]
})
export class RunningNoteModule {}
