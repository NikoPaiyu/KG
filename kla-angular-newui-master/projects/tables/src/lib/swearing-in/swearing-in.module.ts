import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SwearingInRoutingModule } from "./swearing-in-routing.module";
import { SwearingInComponent } from "./swearing-in.component";
import { SwearingInListComponent } from "./swearing-in-list/swearing-in-list.component";
import { ElectionListComponent } from "./election-list/election-list.component";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";

@NgModule({
  declarations: [
    SwearingInComponent,
    SwearingInListComponent,
    ElectionListComponent,
  ],
  imports: [
    CommonModule,
    SwearingInRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDocViewerModule,
    PdfJsViewerModule,
  ],
})
export class SwearingInModule {}
