import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAuctionComponent } from './components/create/create-auction/create-auction.component';
import { CreateBidComponent } from './components/create/create-bid/create-bid.component';
import { CreateDeliveryNoteComponent } from './components/create/create-delivery-note/create-delivery-note.component';
import { CreateDisposalComponent } from './components/create/create-disposal/create-disposal.component';
import { CreateRegisterComponent } from './components/create/create-register/create-register.component';
import { CreateVoucherComponent } from './components/create/create-voucher/create-voucher.component';
import { AuctionDashboardComponent } from './components/dashboard/auction-dashboard/auction-dashboard.component';
import { AuctionRegisterComponent } from './components/dashboard/auction-register/auction-register.component';
import { DeliveryNoteDashboardComponent } from './components/dashboard/delivery-note-dashboard/delivery-note-dashboard.component';
import { DisposalDashboardComponent } from './components/dashboard/disposal-dashboard/disposal-dashboard.component';

import { VoucherDashboardComponent } from './components/dashboard/voucher-dashboard/voucher-dashboard.component';


const routes: Routes = [
    {
      path : 'disposal',
      component: DisposalDashboardComponent
    },
    {
      path : 'disposal/create',
      component: CreateDisposalComponent
    },
    {
      path : 'disposal/edit/:id',
      component: CreateDisposalComponent
    },
    {
      path : 'auction',
      component: AuctionDashboardComponent
    },
    {
      path : 'auction/create/:disposalRequest',
      component: CreateAuctionComponent
    },
    {
      path : 'auction/edit/:id',
      component: CreateAuctionComponent
    },
    {
      path : 'voucher',
      component: VoucherDashboardComponent
    },
    {
      path : 'voucher/create',
      component: CreateVoucherComponent
    },
    {
      path : 'voucher/edit/:id',
      component: CreateVoucherComponent
    },
    {
      path : 'deliveryNote',
      component: DeliveryNoteDashboardComponent
    },
    {
      path : 'deliveryNote/create',
      component: CreateDeliveryNoteComponent
    },
    {
      path : 'deliveryNote/edit/:id',
      component: CreateDeliveryNoteComponent
    },
    {
      path : 'auctionRegister',
      component: AuctionRegisterComponent
    },
    {
      path : 'auctionRegister/create',
      component: CreateRegisterComponent
    },
    {
      path : 'bids/create/:auctionId',
      component: CreateBidComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuctionRoutingModule { }
