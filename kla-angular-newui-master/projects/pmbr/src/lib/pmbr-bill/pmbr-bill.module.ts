import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmbrBillRoutingModule } from './pmbr-bill-routing.module';
import { PmbrBillComponent } from './pmbr-bill.component';
import { BillsListComponent } from './bills-list/bills-list.component';
import { CreateBillContentSelectComponent } from './shared/components/create-bill-content-select/create-bill-content-select.component';
import { CreateBillContentComponent } from './shared/components/create-bill-content/create-bill-content.component';
import { MemberReadingComponent } from './member-reading/member-reading.component';
import { BallotingComponent } from './balloting/balloting.component';
import { BillRegisterComponent } from './bill-register/bill-register.component';
import { OpinionComponent } from './opinion/opinion.component';
import { CreateBillMetaformComponent } from './shared/components/create-bill-metaform/create-bill-metaform.component';
import { BillsComponent } from './bills/bills.component';
import { NoticeListComponent } from './notice-list/notice-list.component';
import { CreateBillComponent } from './create-bill/create-bill.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgZorroAntdModule, NzInputModule, NzIconModule, NzSwitchModule } from 'ng-zorro-antd';
import { BillFullViewComponent } from './bill-full-view/bill-full-view.component';
// import { BillContentViewComponent } from './shared/components/bill-content-view/bill-content-view.component';
import { CreateNoticeComponent } from './shared/components/create-notice/create-notice.component';
import { QuillModule } from "ngx-quill";
import { BillRegisterListComponent } from './bill-register-list/bill-register-list.component';
import { BillRegisterViewComponent } from './bill-register-view/bill-register-view.component';
import { BallotListComponent } from './ballot-list/ballot-list.component';
import { BillContentViewComponent } from './shared/components/bill-content-view/bill-content-view.component';
import { BallotViewComponent } from './ballot-view/ballot-view.component';
import { RejectedBillListComponent } from './rejected-bill-list/rejected-bill-list.component';
import { MemberBallotListComponent } from './member-ballot-list/member-ballot-list.component';
import { BallotResultViewComponent } from './ballot-result-view/ballot-result-view.component';
// import { BallotViewComponent } from './ballot-view/ballot-view.component';
export { BillContentViewComponent } from './shared/components/bill-content-view/bill-content-view.component';



@NgModule({
  declarations: [PmbrBillComponent, CreateBillComponent, NoticeListComponent, BillsComponent, CreateBillMetaformComponent, OpinionComponent, BillRegisterComponent, BallotingComponent, MemberReadingComponent, CreateBillContentComponent, CreateBillContentSelectComponent, BillsListComponent, BillFullViewComponent, BillContentViewComponent, CreateNoticeComponent, BillRegisterListComponent, BillRegisterViewComponent, BallotListComponent, BallotViewComponent, RejectedBillListComponent, MemberBallotListComponent, BallotResultViewComponent],
  imports: [
    CommonModule,
    PmbrBillRoutingModule,
    NgZorroAntdModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    TranslateModule,
    NzSwitchModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }],
          [{ direction: "rtl" }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
        ],
      },
    }),
  ],
  exports: [
    BillContentViewComponent, BallotViewComponent
  ]
})
export class PmbrBillModule {

}
