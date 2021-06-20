import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BillManagementRoutingModule } from "./bill-management-routing.module";
import { BillManagementComponent } from "./bill-management.component";
import { CreateBillComponent } from "./create-bill/create-bill.component";
import { NgZorroAntdModule, NzModalRef, NzModalService } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BillsComponent } from "./bills/bills.component";
import { CreatebillMetaformModule } from "../shared/components/createbill-metaform/createbill-metaform.module";
import { QuillModule } from "ngx-quill";
import { BallotingModule } from "../balloting/balloting.module";
import { CreateBillContentComponent } from "../shared/components/create-bill-content/create-bill-content.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { ErrataListComponent } from "./errata-list/errata-list.component";
import { BillFullViewModule } from "../bill-full-view/bill-full-view.module";
import { CreateBulletinFormModule } from "../shared/components/create-bulletin-form/create-bulletin-form.module";
import { CreateBillContentSelectComponent } from "../shared/components/create-bill-content-select/create-bill-content-select.component";
export { CreateBillContentSelectComponent } from "../shared/components/create-bill-content-select/create-bill-content-select.component";
import { SearchPipeModule } from '../shared/pipes/search-pipe/search-pipe.module';
import { CommitteeReportPreviewModule} from '../shared/components/committee-report-preview/committee-report-preview.module';
import { VettingComponent } from './vetting/vetting.component';
import { TranslatedBillsComponent } from './translated-bills/translated-bills.component';
import { GovernerSignedBillsComponent } from './governer-signed-bills/governer-signed-bills.component';

@NgModule({
  declarations: [
    BillManagementComponent,
    CreateBillComponent,
    BillsComponent,
    CreateBillContentComponent,
    ErrataListComponent,
    CreateBillContentSelectComponent,
    VettingComponent,
    TranslatedBillsComponent,
    GovernerSignedBillsComponent,
  ],
  imports: [
    CommonModule,
    BillManagementRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CreatebillMetaformModule,
    QuillModule.forRoot(),
    CKEditorModule,
    BillFullViewModule,
    CreateBulletinFormModule,
    SearchPipeModule,
    CommitteeReportPreviewModule
  ],
  exports: [CreateBillContentSelectComponent]
})
export class BillManagementModule {}
