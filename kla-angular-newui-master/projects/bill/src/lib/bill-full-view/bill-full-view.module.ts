import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule, NzCheckboxModule, NzModalService } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { QuillModule } from 'ngx-quill';


import { BillFullViewRoutingModule } from './bill-full-view-routing.module';
import { BillFullViewComponent } from './bill-full-view.component';
import { BillViewComponent } from './bill-view/bill-view.component';
import { BillNoticeModule } from '../notice/bill-notice.module';
import { BillContentComponent } from './bill-content/bill-content.component';
import { EratumViewComponent } from './eratum-view/eratum-view.component';
import { RegisteredBillViewComponent } from './registered-bill-view/registered-bill-view.component';
import { MinisterMotionViewComponent } from './minister-motion-view/minister-motion-view.component';
import { CreateBulletinFormModule } from '../shared/components/create-bulletin-form/create-bulletin-form.module';
import { BillInfoComponent } from './bill-info/bill-info.component';
import { CommitteeReportPreviewModule} from '../shared/components/committee-report-preview/committee-report-preview.module';
import { TranslationViewComponent } from './translation-view/translation-view.component';

export { TranslationViewComponent } from './translation-view/translation-view.component';

export { EratumViewComponent } from './eratum-view/eratum-view.component';
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { ForwardtoSelectCommitteeComponent } from '../shared/components/forwardto-select-committee/forwardto-select-committee.component';



@NgModule({
  declarations: [BillFullViewComponent, BillViewComponent, BillContentComponent,
     EratumViewComponent, RegisteredBillViewComponent, MinisterMotionViewComponent, 
     BillInfoComponent, TranslationViewComponent,ForwardtoSelectCommitteeComponent],
  imports: [
    CommonModule,
    BillFullViewRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    BillNoticeModule,
    NzCheckboxModule,
    QuillModule.forRoot(),
    CreateBulletinFormModule,
    CommitteeReportPreviewModule,
    PdfJsViewerModule,
    NgxDocViewerModule,
  ],
  exports: [
    BillContentComponent,
    EratumViewComponent,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    MinisterMotionViewComponent,
    BillInfoComponent,
    TranslationViewComponent
  ],
  providers: [NzModalService],
  entryComponents:[
    TranslationViewComponent
  ]
})
export class BillFullViewModule { }
