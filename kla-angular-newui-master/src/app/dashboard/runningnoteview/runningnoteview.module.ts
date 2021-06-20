import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { RunningnoteviewRoutingModule } from "./runningnoteview-routing.module";
import { RunningnoteviewComponent } from "./runningnoteview.component";
import { RnviewComponent } from "./rnview/rnview.component";
import { FormsModule } from "@angular/forms";
import { SpeakerNoteService } from "../shared/services/speaker-note.service";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [RunningnoteviewComponent, RnviewComponent],
  imports: [
    CommonModule,
    RunningnoteviewRoutingModule,
    FormsModule,
    NgZorroAntdModule,
    TranslateModule
  ],
  providers: [SpeakerNoteService]
})
export class RunningnoteviewModule {}
