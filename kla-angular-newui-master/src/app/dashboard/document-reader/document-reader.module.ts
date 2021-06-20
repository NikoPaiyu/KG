import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { DocumentReaderRoutingModule } from "./document-reader-routing.module";
import { DocumentReaderComponent } from "./document-reader.component";
import { ReadDocumentComponent } from "./read-document/read-document.component";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { PinchZoomModule } from "ngx-pinch-zoom";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [DocumentReaderComponent, ReadDocumentComponent],
  imports: [
    CommonModule,
    PinchZoomModule,
    DocumentReaderRoutingModule,
    PdfViewerModule,
    TranslateModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger"
    })
  ]
})
export class DocumentReaderModule {}
