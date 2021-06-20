import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule, NzFormModule, NgZorroAntdModule, NzDropDownModule, NzToolTipModule, NzModalModule } from 'ng-zorro-antd';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { AuctionRoutingModule } from './auction-routing.module';
import { CreateAuctionComponent } from './components/create/create-auction/create-auction.component';
import { CreateDeliveryNoteComponent } from './components/create/create-delivery-note/create-delivery-note.component';
import { CreateDisposalComponent } from './components/create/create-disposal/create-disposal.component';
import { CreateRegisterComponent } from './components/create/create-register/create-register.component';
import { CreateVoucherComponent } from './components/create/create-voucher/create-voucher.component';
import { AuctionDashboardComponent } from './components/dashboard/auction-dashboard/auction-dashboard.component';
import { AuctionRegisterComponent } from './components/dashboard/auction-register/auction-register.component';
import { DeliveryNoteDashboardComponent } from './components/dashboard/delivery-note-dashboard/delivery-note-dashboard.component';
import { DisposalDashboardComponent } from './components/dashboard/disposal-dashboard/disposal-dashboard.component';
import { VoucherDashboardComponent } from './components/dashboard/voucher-dashboard/voucher-dashboard.component';
import { AuctionApiService } from './services/auction-api.service';
import { BreadcumComponent } from './shared/components/breadcum/breadcum.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { TableComponent } from './shared/components/table/table.component';
import { FilterPipe } from './shared/pipes/filter.pipe';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { CreateComponent } from './shared/components/create/create.component';
import { SearchPipe } from './shared/pipes/search.pipe';
import { FileListComponent } from './shared/components/file-list/file-list.component';
import { CreateBidComponent } from './components/create/create-bid/create-bid.component';


@NgModule({
  declarations: [DashboardComponent, CreateAuctionComponent, CreateDisposalComponent, DisposalDashboardComponent, AuctionDashboardComponent, CreateComponent, BreadcumComponent, SearchPipe, TableComponent, VoucherDashboardComponent, CreateVoucherComponent, FileListComponent, FilterPipe, NotificationComponent, DeliveryNoteDashboardComponent, CreateDeliveryNoteComponent, AuctionRegisterComponent, CreateRegisterComponent, CreateBidComponent],
  imports: [
    CommonModule,
    AuctionRoutingModule,
    FormsModule,
    NzButtonModule,
    NzFormModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NzDropDownModule,
    TranslateModule,
    NzToolTipModule ,
    NzModalModule,
    PdfViewerModule ,
    PdfJsViewerModule 
  ],
  providers : [AuctionApiService],
  exports : [
    DashboardComponent, CreateAuctionComponent, CreateDisposalComponent, DisposalDashboardComponent, AuctionDashboardComponent, CreateComponent, BreadcumComponent
  ]
})
export class AuctionModule { }
