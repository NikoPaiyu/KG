import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BallotListComponent } from './ballot-list/ballot-list.component';
import { BallotViewComponent } from './ballot-view/ballot-view.component';
import { BallotingComponent } from './balloting/balloting.component';
import { BillFullViewComponent } from './bill-full-view/bill-full-view.component';
import { BillRegisterListComponent } from './bill-register-list/bill-register-list.component';
import { BillRegisterViewComponent } from './bill-register-view/bill-register-view.component';
import { BillRegisterComponent } from './bill-register/bill-register.component';
import { BillsListComponent } from './bills-list/bills-list.component';
import { BillsComponent } from './bills/bills.component';
import { CreateBillComponent } from './create-bill/create-bill.component';
import { MemberBallotListComponent } from './member-ballot-list/member-ballot-list.component';
import { MemberReadingComponent } from './member-reading/member-reading.component';
import { NoticeListComponent } from './notice-list/notice-list.component';
import { OpinionComponent } from './opinion/opinion.component';
import { PmbrBillComponent } from './pmbr-bill.component';
import { RejectedBillListComponent } from './rejected-bill-list/rejected-bill-list.component';


const routes: Routes = [{
  path: '',
  component: PmbrBillComponent,
  children: [
    {
      path: 'create/:id',
      component: CreateBillComponent
    }, {
      path: 'notice-list',
      component: NoticeListComponent
    },
    {
      path: 'bills',
      component: BillsComponent
    },
    {
      path: 'bills-list',
      component: BillsListComponent
    },
    {
      path: 'opinion',
      component: OpinionComponent
    },
    {
      path: 'bill-register',
      component: BillRegisterComponent
    },
    {
      path: 'balloting',
      component: BallotingComponent
    },
    {
      path: 'member-reading',
      component: MemberReadingComponent
    }, {
      path: 'bill-view/:id',
      component: BillFullViewComponent
    },
    {
      path: 'bill-register-list',
      component: BillRegisterListComponent
    },
    {
      path: 'bill-register-view/:id',
      component: BillRegisterViewComponent
    },
    {
      path: 'ballot-list',
      component: BallotListComponent
    },
    {
      path: 'ballot-view/:id',
      component: BallotViewComponent
    },
    {
      path: 'rejected-bills',
      component: RejectedBillListComponent
    },
    {
      path: 'member-ballot-list',
      component: MemberBallotListComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmbrBillRoutingModule { }
