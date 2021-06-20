import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CurrentSpeakernoteRoutingModule } from "./current-speakernote-routing.module";
import { CurrentSpeakernoteComponent } from "./current-speakernote.component";
import { LiveSpeakernoteComponent } from "./live-speakernote/live-speakernote.component";
import { TranslateModule } from "@ngx-translate/core";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { PinchZoomModule } from "ngx-pinch-zoom";

@NgModule({
  declarations: [CurrentSpeakernoteComponent, LiveSpeakernoteComponent],
  imports: [
    CommonModule,
    CurrentSpeakernoteRoutingModule,
    PdfViewerModule,
    TranslateModule,
    NgZorroAntdModule,
    PinchZoomModule
  ]
})
export class CurrentSpeakernoteModule {}
