import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorityListRoutingModule } from './priority-list-routing.module';
import { PriorityListComponent } from './priority-list.component';
import { ListPriorityListComponent } from './list-priority-list/list-priority-list.component';
import { CreatePriorityListComponent } from './create-priority-list/create-priority-list.component';
import { NestableModule } from 'ngx-nestable';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { CreatebillMetaformModule } from '../shared/components/createbill-metaform/createbill-metaform.module';
import { PriorityListListsComponent } from './list-priority-list/priority-list-lists/priority-list-lists.component';
import { PriorityListRequestsComponent } from './list-priority-list/priority-list-requests/priority-list-requests.component';
import { CreateBulletinFormModule } from '../shared/components/create-bulletin-form/create-bulletin-form.module';
import { PriorityListRequestViewComponent } from './priority-list-request-view/priority-list-request-view.component';
import { InitialDaysComponent } from './initial-days/initial-days.component';

import { SearchPipeModule } from '../shared/pipes/search-pipe/search-pipe.module'
import { SafehtmlModule } from '../shared/pipes/safehtml/safehtml.module';
import { ScheduleForBillComponent } from './schedule-for-bill/schedule-for-bill.component';
import { ScheduleOfBillListComponent } from './schedule-of-bill-list/schedule-of-bill-list.component';
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";

@NgModule({
  declarations: [
    PriorityListComponent,
    ListPriorityListComponent,
    CreatePriorityListComponent,
    PriorityListListsComponent,
    PriorityListRequestsComponent,
    PriorityListRequestViewComponent,
    InitialDaysComponent,
    ScheduleForBillComponent,
    ScheduleOfBillListComponent],
  imports: [
    CommonModule,
    PriorityListRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NestableModule,
    CKEditorModule,
    CreatebillMetaformModule,
    CreateBulletinFormModule,
    SearchPipeModule,
    SafehtmlModule,
    PdfJsViewerModule
  ],
  exports: [PriorityListRequestViewComponent, InitialDaysComponent, ScheduleForBillComponent]
})
export class PriorityListModule { }
